// Dry-run stand-ins for `claude plugin eval` and run-slim.ts: they write canned results in the shapes the real tools
// write and call no model. Selected only through LZ_EVAL_CLAUDE and LZ_EVAL_RUN_SLIM; aggregation refuses what they
// make unless --allow-stub is passed. Repository-only; nothing here ships with the plugin.
//
//   node tools/evals/stubs.ts plugin eval <target> --case <name> --model <id> --ablation <a> --output-dir <dir> --json <file> ...
//
// Environment: LZ_EVAL_STUB_DIR (where the argv log goes).
import { appendFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { dirname } from 'node:path';
import { parseArgs } from 'node:util';

function logArgv(args: readonly string[], env: NodeJS.ProcessEnv): void {
  const stubDir = env['LZ_EVAL_STUB_DIR'];

  if (stubDir !== undefined) {
    mkdirSync(stubDir, { recursive: true });
    appendFileSync(`${stubDir}/argv.jsonl`, `${JSON.stringify(args)}\n`);
  }
}

function trace(model: string): string {
  const session = randomUUID();
  const lines = [
    { type: 'system', subtype: 'init', session_id: session, model, claude_code_version: '0.0.0-stub' },
    {
      type: 'result',
      subtype: 'success',
      session_id: session,
      is_error: false,
      total_cost_usd: 0,
      num_turns: 1,
      result: 'stub reply',
      modelUsage: { [model]: { inputTokens: 1, outputTokens: 1, cacheReadInputTokens: 0, cacheCreationInputTokens: 0 } },
    },
  ];

  return `${lines.map((line) => JSON.stringify(line)).join('\n')}\n`;
}

function armRun(tracePath: string): Record<string, unknown> {
  return {
    score: 1,
    passed: true,
    turns: 1,
    costUsd: 0,
    judgeCostUsd: 0,
    durationSeconds: 0,
    startedAt: new Date().toISOString(),
    error: null,
    tracePath,
    graders: [{ name: 'stub', passed: true, weight: 1, scored: true }],
  };
}

// Behaves as `claude plugin eval` for one case and one run per arm; gives back the exit code.
export function stubPluginEval(args: readonly string[], env: NodeJS.ProcessEnv): number {
  logArgv(args, env);
  const { values } = parseArgs({
    args: [...args.slice(2)],
    allowPositionals: true,
    strict: false,
    options: {
      case: { type: 'string' },
      model: { type: 'string' },
      ablation: { type: 'string' },
      'output-dir': { type: 'string' },
      json: { type: 'string' },
    },
  });
  const { case: caseName, model, ablation, json } = values;
  const outputDir = values['output-dir'];

  if (typeof caseName !== 'string' || typeof model !== 'string' || typeof outputDir !== 'string' || typeof json !== 'string') {
    console.error('stub plugin eval needs --case, --model, --output-dir and --json');

    return 1;
  }

  const ablated = ablation === 'with-without';
  mkdirSync(outputDir, { recursive: true });
  const withTrace = `${outputDir}/trace-stub-with.jsonl`;
  const withoutTrace = `${outputDir}/trace-stub-without.jsonl`;
  writeFileSync(withTrace, trace(model));

  if (ablated) {
    writeFileSync(withoutTrace, trace(model));
  }

  const result = {
    schemaVersion: 1,
    claudeVersion: '0.0.0-stub',
    durationSeconds: 0,
    costUsd: 0,
    partial: false,
    suite: { modelOverride: model, ablation: ablated ? 'with-without' : 'none' },
    cases: [{ name: caseName, arms: { with: [armRun(withTrace)], without: ablated ? [armRun(withoutTrace)] : [] } }],
  };
  mkdirSync(dirname(json), { recursive: true });
  writeFileSync(json, `${JSON.stringify(result, null, 2)}\n`);

  return 0;
}

// Stryker disable all: command-line entry; stubs.test.ts calls the stand-ins in-process
// Below Node.js 22.18.0 import.meta.main is undefined, which would skip the stand-in and exit 0.
if (typeof import.meta.main !== 'boolean') {
  throw new Error('stubs.ts needs Node.js >= 22.18.0 (import.meta.main)');
}

if (import.meta.main) {
  const args = process.argv.slice(2);
  process.exitCode = stubPluginEval(args, process.env);
}
// Stryker restore all
