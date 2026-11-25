// The `claude plugin eval` backend: one invocation per arm x model x case x run, since the command has no resume. The
// CLI's JSON goes to raw/plugin-eval.json and its traces are copied into raw/ at once (they live in temp folders that
// are not kept); the harness writes result.json only after its own checks. Repository-only; nothing here ships with
// the plugin.
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import type { Ablation } from './cases.ts';
import { isRecord, jsonLines, readJson } from './guards.ts';
import {
  scriptOrBinary,
  spawnLogged,
  stageDir,
  writeResult,
  type Command,
  type GraderVerdict,
  type PlannedRun,
  type RunOutcome,
  type RunResult,
} from './run-set.ts';
import { limitStopped, modelRefusal, traceModels, traceResult } from './trace.ts';

export function claudeCommand(env: NodeJS.ProcessEnv): Command {
  return scriptOrBinary(
    env['LZ_EVAL_CLAUDE'] ?? join(homedir(), '.local/bin/node_modules/@anthropic-ai/claude-code/bin/claude.exe'),
  );
}

export interface PluginEvalInput {
  readonly target: string;
  readonly caseName: string;
  readonly model: string;
  readonly ablation: Ablation;
  readonly allowTools: readonly string[];
  readonly scaffold: boolean;
  readonly rawDir: string;
}

// The target goes first and --allow-tools last: that flag reads every following word as a tool name.
export function pluginEvalArgs(input: PluginEvalInput): string[] {
  return [
    ...['plugin', 'eval', input.target, '--case', input.caseName, '--runs', '1', '--model', input.model],
    ...['--ablation', input.ablation, '--threshold', '0', '--trust-plugin', '--no-publish'],
    ...['--judge-model', 'claude-sonnet-5-5', '--output-dir', input.rawDir, '--json', `${input.rawDir}/plugin-eval.json`],
    ...(input.scaffold ? ['--scaffold'] : []),
    ...(input.allowTools.length > 0 ? ['--allow-tools', ...input.allowTools] : []),
  ];
}

export interface Traces {
  readonly with: readonly unknown[] | null;
  readonly without: readonly unknown[] | null;
}

export interface RunMeta {
  readonly startedAt: string;
  readonly binary: string;
}

export type Normalized =
  | { readonly outcome: 'done'; readonly result: RunResult }
  | { readonly outcome: 'failed' | 'limit'; readonly reason: string };

function failed(reason: string): Normalized {
  return { outcome: 'failed', reason };
}

function numberAt(record: Record<string, unknown>, key: string): number {
  const value = record[key];

  return typeof value === 'number' ? value : 0;
}

function verdicts(armRun: Record<string, unknown>): GraderVerdict[] | null {
  const graders = armRun['graders'];

  if (!Array.isArray(graders)) {
    return null;
  }

  const parsed = graders.map((grader) =>
    isRecord(grader) && typeof grader['name'] === 'string' && typeof grader['passed'] === 'boolean'
      ? { name: grader['name'], passed: grader['passed'], scored: grader['scored'] !== false }
      : null,
  );

  return parsed.every((verdict) => verdict !== null) ? parsed.filter((verdict) => verdict !== null) : null;
}

function armRuns(arms: Record<string, unknown>, side: 'with' | 'without'): Record<string, unknown>[] | null {
  const runs = arms[side] ?? [];

  return Array.isArray(runs) && runs.every(isRecord) ? runs.filter(isRecord) : null;
}

// Verdicts come from each arm run's graders[], never from score or passRate: under with-without the CLI leaves
// tool_used Skill graders out of the score.
export function normalizePluginEval(json: unknown, traces: Traces, run: PlannedRun, meta: RunMeta): Normalized {
  if (!isRecord(json) || json['schemaVersion'] !== 1) {
    return failed('plugin-eval.json is missing or not schemaVersion 1');
  }

  const cases = json['cases'];
  const only = Array.isArray(cases) && cases.length === 1 ? cases[0] : null;

  if (!isRecord(only) || only['name'] !== run.caseInfo.name || !isRecord(only['arms'])) {
    return failed(`plugin-eval.json does not hold exactly the case ${run.caseInfo.name}`);
  }

  const withRuns = armRuns(only['arms'], 'with');
  const withoutRuns = armRuns(only['arms'], 'without');
  const ablated = run.suite.ablation === 'with-without';

  if (withRuns?.length !== 1 || withoutRuns?.length !== (ablated ? 1 : 0)) {
    return failed('plugin-eval.json does not hold one run per arm');
  }

  const armRun = withRuns[0];
  const baselineRun = withoutRuns[0];

  if (armRun === undefined) {
    return failed('plugin-eval.json has no with-arm run');
  }

  const sideRuns = [armRun, ...(baselineRun === undefined ? [] : [baselineRun])];
  const errors = sideRuns.flatMap((side) => {
    const error = side['error'];

    return error === null || error === undefined ? [] : [typeof error === 'string' ? error.replace(/^exit \d+: /, '') : String(error)];
  });
  const limited = errors.find((error) => limitStopped(error));

  // A usage-limited run scores 0 and the suite is not marked partial, so its error text is the only sign.
  if (limited !== undefined) {
    return { outcome: 'limit', reason: `usage limit: ${limited}` };
  }

  if (json['partial'] !== false || sideRuns.some((side) => side['aborted'] === true)) {
    return failed(`the run is partial (${String(json['partialReason'] ?? 'no reason given')})`);
  }

  const maxTurns = errors.some((error) => error.startsWith('Reached maximum number of turns'));
  const otherError = errors.find((error) => !error.startsWith('Reached maximum number of turns'));

  if (otherError !== undefined) {
    return failed(`the run reports an error: ${otherError}`);
  }

  const traceList = ablated ? [traces.with, traces.without] : [traces.with];

  if (traceList.some((trace) => trace === null)) {
    return failed('a trace is missing');
  }

  const models = traceList.map((trace) => traceModels(trace ?? []));
  const refusal = models.map(({ init, used }) => modelRefusal(run.model, init, used)).find((reason) => reason !== null);

  if (refusal !== undefined) {
    return failed(refusal);
  }

  const withVerdicts = verdicts(armRun);
  const withoutVerdicts = baselineRun === undefined ? null : verdicts(baselineRun);

  if (withVerdicts === null || (ablated && withoutVerdicts === null)) {
    return failed('an arm run has no readable graders');
  }

  const facts = traceList.map((trace) => traceResult(trace ?? []));
  const sum = (values: readonly number[]): number => values.reduce((total, value) => total + value, 0);

  return {
    outcome: 'done',
    result: {
      schemaVersion: 1,
      backend: 'plugin-eval',
      runSet: run.runSetName,
      arm: run.arm,
      ref: run.ref,
      pluginTree: null,
      casesTree: null,
      suite: run.suite.name,
      case: run.caseInfo.name,
      k: run.k,
      requestedModel: run.model,
      initModel: models[0]?.init ?? null,
      modelsUsed: [...new Set(models.flatMap(({ used }) => used))],
      claudeCodeVersion: models[0]?.claudeCodeVersion ?? null,
      binary: meta.binary,
      startedAt: meta.startedAt,
      seconds: numberAt(json, 'durationSeconds'),
      turns: numberAt(armRun, 'turns'),
      costUsd: sum(sideRuns.map((side) => numberAt(side, 'costUsd'))),
      judgeCostUsd: sum(sideRuns.map((side) => numberAt(side, 'judgeCostUsd'))),
      tokens: {
        input: sum(facts.map((fact) => fact?.tokens.input ?? 0)),
        output: sum(facts.map((fact) => fact?.tokens.output ?? 0)),
        cacheRead: sum(facts.map((fact) => fact?.tokens.cacheRead ?? 0)),
        cacheCreation: sum(facts.map((fact) => fact?.tokens.cacheCreation ?? 0)),
      },
      maxTurns,
      graded: true,
      arms: { with: withVerdicts, without: ablated ? withoutVerdicts : null },
    },
  };
}

function tracePathOf(json: unknown, side: 'with' | 'without'): string | null {
  const cases = isRecord(json) ? json['cases'] : null;
  const only = Array.isArray(cases) ? cases[0] : null;
  const arms = isRecord(only) ? only['arms'] : null;
  const runs = isRecord(arms) ? arms[side] : null;
  const first = Array.isArray(runs) ? runs[0] : null;
  const path = isRecord(first) ? first['tracePath'] : null;

  return typeof path === 'string' ? path : null;
}

// Copies each arm's trace into raw/ before anything else reads it, and gives back the copies' entries.
export function copyTraces(json: unknown, rawDir: string): Traces {
  const copy = (side: 'with' | 'without'): unknown[] | null => {
    const source = tracePathOf(json, side);

    if (source === null || !existsSync(source)) {
      return null;
    }

    const target = `${rawDir}/trace-${side}.jsonl`;
    copyFileSync(source, target);

    return jsonLines(readFileSync(target, 'utf8'));
  };

  return { with: copy('with'), without: copy('without') };
}

function readCliJson(file: string): unknown {
  try {
    return existsSync(file) ? readJson(file) : null;
  } catch {
    return null;
  }
}

export interface PluginEvalContext {
  readonly stageRoot: string;
  readonly claude: Command;
}

export function pluginEvalTarget(stageRoot: string, run: PlannedRun): string {
  if (run.ref === null) {
    throw new Error(`arm ${run.arm} has no ref; a plugin-eval suite needs a packaged plugin`);
  }

  return `${stageDir(stageRoot, run.ref)}/lz-tdd`;
}

// Stryker disable all: spawns the CLI, which the unit tests leave to the dry run
export async function startPluginEvalRun(run: PlannedRun, ctx: PluginEvalContext): Promise<RunOutcome> {
  const rawDir = `${run.runDir}/raw`;
  const args = pluginEvalArgs({
    target: pluginEvalTarget(ctx.stageRoot, run),
    caseName: run.caseInfo.name,
    model: run.model,
    ablation: run.suite.ablation,
    allowTools: run.suite.allowTools,
    scaffold: run.suite.scaffold,
    rawDir,
  });
  const startedAt = new Date().toISOString();
  mkdirSync(rawDir, { recursive: true });
  writeFileSync(`${rawDir}/started.json`, `${JSON.stringify({ startedAt, argv: [...ctx.claude.prefix, ...args] }, null, 2)}\n`);
  const status = await spawnLogged(ctx.claude, args, rawDir, 'plugin-eval');
  const json = readCliJson(`${rawDir}/plugin-eval.json`);
  const traces = copyTraces(json, rawDir);
  const normalized = normalizePluginEval(json, traces, run, { startedAt, binary: ctx.claude.prefix[0] ?? ctx.claude.file });

  if (normalized.outcome === 'done') {
    writeResult(run.runDir, normalized.result);

    return 'done';
  }

  writeFileSync(`${rawDir}/refused.txt`, `exit ${String(status)}: ${normalized.reason}\n`);

  return normalized.outcome;
}
// Stryker restore all
