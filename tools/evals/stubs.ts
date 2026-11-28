// Dry-run stand-ins for `claude plugin eval` and run-slim.ts: they write canned results in the shapes the real tools
// write and call no model. Selected only through LZ_EVAL_CLAUDE and LZ_EVAL_RUN_SLIM; aggregation refuses what they
// make unless --allow-stub is passed. Repository-only; nothing here ships with the plugin.
//
//   node tools/evals/stubs.ts plugin eval <target> --case <name> --model <id> --ablation <a> --output-dir <dir> --json <file> ...
//   node tools/evals/stubs.ts --cwd <dir> --prompt-file <file> --out <file> --model <id> [--resume <session>] ...
//
// Environment: LZ_EVAL_STUB_DIR (invocation counter, argv log, hung marker), LZ_EVAL_PROJECTS_DIR (where the run-slim
// stand-in writes its transcript), LZ_EVAL_STUB_HANG_AFTER=<n> (invocation n+1 and later write their start files,
// then wait forever), LZ_EVAL_STUB_ERROR (limit | other | max-turns), LZ_EVAL_STUB_MODEL (the model the output
// names instead of --model), LZ_EVAL_STUB_EXIT (plugin eval: exit with this code before writing --json).
import { randomUUID } from 'node:crypto';
import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { parseArgs } from 'node:util';
import { projectFolder } from './grade.ts';

const limitText = "You've hit your 5-hour limit resets 6:30am (Europe/Copenhagen)";

export type StubExit = number | 'hang';

function stubDirOf(env: NodeJS.ProcessEnv): string | null {
  const stubDir = env['LZ_EVAL_STUB_DIR'];

  if (stubDir === undefined || stubDir === '') {
    return null;
  }

  mkdirSync(stubDir, { recursive: true });

  return stubDir;
}

function logArgv(args: readonly string[], env: NodeJS.ProcessEnv): void {
  const stubDir = stubDirOf(env);

  if (stubDir !== null) {
    appendFileSync(`${stubDir}/argv.jsonl`, `${JSON.stringify(args)}\n`);
  }
}

// Counts this invocation; true when it is past LZ_EVAL_STUB_HANG_AFTER, after writing the hung marker.
function shouldHang(env: NodeJS.ProcessEnv): boolean {
  const stubDir = stubDirOf(env);

  if (stubDir === null) {
    return false;
  }

  const countFile = `${stubDir}/count`;
  const count = (existsSync(countFile) ? Number(readFileSync(countFile, 'utf8')) : 0) + 1;
  writeFileSync(countFile, String(count));
  const after = env['LZ_EVAL_STUB_HANG_AFTER'];

  if (after === undefined || after === '' || count <= Number(after)) {
    return false;
  }

  writeFileSync(`${stubDir}/hung`, String(count));

  return true;
}

function modelUsage(model: string): Record<string, unknown> {
  return { [model]: { inputTokens: 1, outputTokens: 1, cacheReadInputTokens: 0, cacheCreationInputTokens: 0 } };
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
      modelUsage: modelUsage(model),
    },
  ];

  return `${lines.map((line) => JSON.stringify(line)).join('\n')}\n`;
}

const pluginErrors: Record<string, string> = {
  limit: `exit 1: ${limitText}`,
  other: 'exit 1: API Error',
  'max-turns': 'exit 1: Reached maximum number of turns (3)',
};

function armRun(tracePath: string, error: string | null): Record<string, unknown> {
  const graded = error === null || error.includes('maximum number of turns');

  return {
    score: graded ? 1 : 0,
    passed: graded,
    turns: 1,
    costUsd: 0,
    judgeCostUsd: 0,
    durationSeconds: 0,
    startedAt: new Date().toISOString(),
    error,
    tracePath,
    graders: graded ? [{ name: 'stub', passed: true, weight: 1, scored: true }] : [],
  };
}

// Behaves as `claude plugin eval` for one case and one run per arm.
export function stubPluginEval(args: readonly string[], env: NodeJS.ProcessEnv): StubExit {
  logArgv(args, env);

  if (shouldHang(env)) {
    return 'hang';
  }

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
  const { case: caseName, ablation, json } = values;
  const outputDir = values['output-dir'];
  const model = env['LZ_EVAL_STUB_MODEL'] ?? values.model;

  if (typeof caseName !== 'string' || typeof model !== 'string' || typeof outputDir !== 'string' || typeof json !== 'string') {
    console.error('stub plugin eval needs --case, --model, --output-dir and --json');

    return 1;
  }

  const ablated = ablation === 'with-without';
  const error = pluginErrors[env['LZ_EVAL_STUB_ERROR'] ?? ''] ?? null;
  mkdirSync(outputDir, { recursive: true });
  const withTrace = `${outputDir}/trace-stub-with.jsonl`;
  const withoutTrace = `${outputDir}/trace-stub-without.jsonl`;
  writeFileSync(withTrace, trace(model));

  if (ablated) {
    writeFileSync(withoutTrace, trace(model));
  }

  const exit = env['LZ_EVAL_STUB_EXIT'];

  if (exit !== undefined && exit !== '') {
    return Number(exit);
  }

  const result = {
    schemaVersion: 1,
    claudeVersion: '0.0.0-stub',
    durationSeconds: 0,
    costUsd: 0,
    partial: false,
    suite: { modelOverride: values.model, ablation: ablated ? 'with-without' : 'none' },
    cases: [
      {
        name: caseName,
        arms: { with: [armRun(withTrace, error)], without: ablated ? [armRun(withoutTrace, error)] : [] },
      },
    ],
  };
  mkdirSync(dirname(json), { recursive: true });
  writeFileSync(json, `${JSON.stringify(result, null, 2)}\n`);

  return error === null || error.includes('maximum number of turns') ? 0 : 1;
}

// Behaves as run-slim.ts: a transcript in the cwd's project folder at start, then the --out file.
export function stubRunSlim(args: readonly string[], env: NodeJS.ProcessEnv): StubExit {
  logArgv(args, env);
  const { values } = parseArgs({
    args: [...args],
    allowPositionals: true,
    strict: false,
    options: {
      cwd: { type: 'string' },
      'prompt-file': { type: 'string' },
      out: { type: 'string' },
      model: { type: 'string' },
      resume: { type: 'string' },
    },
  });
  const { cwd, out, resume } = values;
  const promptFile = values['prompt-file'];
  const model = env['LZ_EVAL_STUB_MODEL'] ?? values.model;
  const projects = env['LZ_EVAL_PROJECTS_DIR'];

  if (typeof cwd !== 'string' || typeof promptFile !== 'string' || typeof out !== 'string' || typeof model !== 'string') {
    console.error('stub run-slim needs --cwd, --prompt-file, --out and --model');

    return 1;
  }

  const session = typeof resume === 'string' ? resume : randomUUID();

  if (projects !== undefined && projects !== '') {
    const folder = `${projects}/${projectFolder(cwd)}`;
    mkdirSync(folder, { recursive: true });
    appendFileSync(`${folder}/${session}.jsonl`, `${JSON.stringify({ type: 'user', sessionId: session, cwd })}\n`);
  }

  if (shouldHang(env)) {
    return 'hang';
  }

  const result = {
    type: 'result',
    subtype: 'success',
    is_error: false,
    session_id: session,
    total_cost_usd: 0,
    num_turns: 1,
    result: env['LZ_EVAL_STUB_ERROR'] === 'limit' ? limitText : 'stub reply',
    modelUsage: modelUsage(model),
  };
  const prompt = readFileSync(promptFile, 'utf8');
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, JSON.stringify({ cwd, args, prompt, status: 0, ms: 1, stdout: JSON.stringify(result), stderr: '' }, null, 2));

  return 0;
}

// Stryker disable all: command-line entry; stubs.test.ts calls the stand-ins in-process
// Below Node.js 22.18.0 import.meta.main is undefined, which would skip the stand-in and exit 0.
if (typeof import.meta.main !== 'boolean') {
  throw new Error('stubs.ts needs Node.js >= 22.18.0 (import.meta.main)');
}

if (import.meta.main) {
  const args = process.argv.slice(2);
  const exit = args[0] === 'plugin' ? stubPluginEval(args, process.env) : stubRunSlim(args, process.env);

  if (exit === 'hang') {
    // Waits until the dry run kills the process tree, as a session stuck in a tool call would.
    setInterval(() => undefined, 60_000);
  } else {
    process.exitCode = exit;
  }
}
// Stryker restore all
