import assert from 'node:assert/strict';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';

import type { Ablation, Suite } from './cases.ts';
import { claudeCommand, copyTraces, normalizePluginEval, pluginEvalArgs, pluginEvalTarget, type Traces } from './plugin-eval.ts';
import type { PlannedRun } from './run-set.ts';
import { caseTarget } from './stage.ts';

const sonnet = 'claude-sonnet-5-5';
const limitText = "exit 1: You've hit your 5-hour limit resets 6:30am (Europe/Copenhagen)";

function plannedRun(ablation: Ablation): PlannedRun {
  const suite: Suite = {
    name: 'demo',
    dir: 'W:/repo/evals/lz-tdd/demo',
    backend: 'plugin-eval',
    ablation,
    allowTools: [],
    scaffold: false,
    heavy: false,
    allow: null,
    timeoutMinutes: 15,
    invokeTwin: null,
    target: null,
    skill: null,
  };

  return {
    runDir: `W:/set/head/${sonnet}/demo-01/run-1`,
    runSetName: 'set',
    arm: 'head',
    ref: '0'.repeat(40),
    model: sonnet,
    suite,
    caseInfo: { name: 'demo-01', dir: 'W:/repo/evals/lz-tdd/demo/demo-01', tags: [], body: 'Say hello.\n' },
    k: 1,
  };
}

function traceOf(model: string, extraUsage: Record<string, unknown> = {}): unknown[] {
  return [
    { type: 'system', subtype: 'init', session_id: 's', model, claude_code_version: '2.1.327' },
    {
      type: 'result',
      total_cost_usd: 0.1,
      num_turns: 2,
      modelUsage: { [model]: { inputTokens: 5, outputTokens: 6 }, ...extraUsage },
    },
  ];
}

function armRun(error: string | null): Record<string, unknown> {
  return {
    score: 1,
    passed: true,
    turns: 2,
    costUsd: 0.1,
    judgeCostUsd: 0.02,
    durationSeconds: 20,
    error,
    tracePath: 'W:/temp/claude-eval-x/out/trace.jsonl',
    graders: [{ name: 'skill-fired', passed: true, weight: 1, withOnly: false, scored: true }],
  };
}

function cliJson(overrides: { partial?: boolean; error?: string | null; withoutError?: string | null; name?: string; ablated?: boolean } = {}): unknown {
  const ablated = overrides.ablated ?? false;

  return {
    schemaVersion: 1,
    durationSeconds: 25,
    partial: overrides.partial ?? false,
    suite: { modelOverride: sonnet },
    cases: [
      {
        name: overrides.name ?? 'demo-01',
        arms: {
          with: [armRun(overrides.error ?? null)],
          without: ablated ? [armRun(overrides.withoutError ?? null)] : [],
        },
      },
    ],
  };
}

const meta = { startedAt: '2026-11-25T00:00:00.000Z', binary: 'W:/bin/claude.exe', pluginTree: 'p'.repeat(40), casesTree: 'c'.repeat(40) };
const bothTraces: Traces = { with: traceOf(sonnet), without: null };

function outcome(json: unknown, traces: Traces = bothTraces, ablation: Ablation = 'none'): string {
  const normalized = normalizePluginEval(json, traces, plannedRun(ablation), meta);

  return normalized.outcome === 'done' ? `done${normalized.result.maxTurns ? ' max-turns' : ''}` : normalized.outcome;
}

test('pluginEvalArgs puts the target first, one run per invocation, and --allow-tools last', () => {
  assert.deepEqual(
    pluginEvalArgs({
      target: 'W:/stage/000000000000/lz-tdd',
      caseName: 'demo-01',
      model: sonnet,
      ablation: 'with-without',
      allowTools: ['Write', 'Edit'],
      scaffold: true,
      rawDir: 'W:/set/run-1/raw',
    }),
    [
      'plugin',
      'eval',
      'W:/stage/000000000000/lz-tdd',
      '--case',
      'demo-01',
      '--runs',
      '1',
      '--model',
      sonnet,
      '--ablation',
      'with-without',
      '--threshold',
      '0',
      '--trust-plugin',
      '--no-publish',
      '--keep-temp',
      '--judge-model',
      'claude-sonnet-5-5',
      '--output-dir',
      'W:/set/run-1/raw',
      '--json',
      'W:/set/run-1/raw/plugin-eval.json',
      '--scaffold',
      '--allow-tools',
      'Write',
      'Edit',
    ],
  );
});

test('copyTraces copies each arm trace into raw/ and then removes the kept claude-eval sandbox, and no other folder', () => {
  const root = mkdtempSync(join(tmpdir(), 'lz-evals-traces-')).replaceAll('\\', '/');

  try {
    const sandbox = `${root}/claude-eval-AbC123`;
    const other = `${root}/elsewhere`;
    const rawDir = `${root}/raw`;
    mkdirSync(`${sandbox}/out`, { recursive: true });
    mkdirSync(`${other}/out`, { recursive: true });
    mkdirSync(rawDir);
    writeFileSync(`${sandbox}/out/trace.jsonl`, '{"type":"system"}\n');
    writeFileSync(`${other}/out/trace.jsonl`, '{"type":"result"}\n');
    const json = {
      cases: [{ arms: { with: [{ tracePath: `${sandbox}/out/trace.jsonl` }], without: [{ tracePath: `${other}/out/trace.jsonl` }] } }],
    };

    assert.deepEqual(copyTraces(json, rawDir), { with: [{ type: 'system' }], without: [{ type: 'result' }] });
    assert.equal(readFileSync(`${rawDir}/trace-with.jsonl`, 'utf8'), '{"type":"system"}\n');
    assert.deepEqual([existsSync(sandbox), existsSync(`${other}/out/trace.jsonl`)], [false, true]);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('claudeCommand runs a .ts stand-in under this Node.js and anything else directly', () => {
  assert.deepEqual(claudeCommand({ LZ_EVAL_CLAUDE: 'W:/tools/stubs.ts' }), { file: process.execPath, prefix: ['W:/tools/stubs.ts'] });
  assert.deepEqual(claudeCommand({ LZ_EVAL_CLAUDE: 'W:/bin/claude.exe' }), { file: 'W:/bin/claude.exe', prefix: [] });
  assert.match(claudeCommand({}).file, /claude-code[/\\]bin[/\\]claude\.exe$/);
});

test('pluginEvalTarget is the case target of the ref for the cases tree the run records, and refuses an arm without a ref', () => {
  const run = plannedRun('none');
  assert.equal(pluginEvalTarget('W:/stage', run, 'aaa+bbb'), caseTarget('W:/stage', run.ref ?? '', 'aaa+bbb'));
  assert.notEqual(pluginEvalTarget('W:/stage', run, 'aaa+bbb'), pluginEvalTarget('W:/stage', run, 'aaa+ccc'));
  assert.throws(() => pluginEvalTarget('W:/stage', { ...run, ref: null }, 'aaa+bbb'), /no ref/);
});

test('normalizePluginEval sorts every run state the CLI can leave', () => {
  assert.deepEqual(
    [
      outcome(cliJson()),
      outcome(cliJson({ partial: true })),
      outcome(cliJson({ error: limitText })),
      outcome(cliJson({ error: 'exit 1: Reached maximum number of turns (3)' })),
      outcome(cliJson({ error: 'exit 1: API Error' })),
      outcome(null),
      outcome(cliJson(), { with: null, without: null }),
      outcome(cliJson(), { with: traceOf('claude-opus-5-5'), without: null }),
      outcome(cliJson(), { with: traceOf(sonnet, { 'claude-haiku-4-5-20251001': { inputTokens: 1 } }), without: null }),
      outcome(cliJson({ name: 'demo-02' })),
      outcome(cliJson({ ablated: true }), { with: traceOf(sonnet), without: traceOf(sonnet) }, 'with-without'),
      outcome(cliJson({ ablated: true, withoutError: limitText }), { with: traceOf(sonnet), without: traceOf(sonnet) }, 'with-without'),
      outcome(cliJson({ ablated: true }), { with: traceOf(sonnet), without: null }, 'with-without'),
      outcome(cliJson({ ablated: true }), { with: traceOf(sonnet), without: traceOf(sonnet) }, 'none'),
    ],
    [
      'done',
      'failed',
      'limit',
      'done max-turns',
      'failed',
      'failed',
      'failed',
      'failed',
      'done',
      'failed',
      'done',
      'limit',
      'failed',
      'failed',
    ],
  );
});

test('a model mismatch fails with a reason naming both models', () => {
  const normalized = normalizePluginEval(cliJson(), { with: traceOf('claude-opus-5-5'), without: null }, plannedRun('none'), meta);

  assert.deepEqual(
    normalized.outcome === 'done' ? null : normalized.reason,
    'model mismatch: claude-opus-5-5 ran where claude-sonnet-5-5 was requested',
  );
});

test('a done run carries the verdicts, the models from the traces and the cost of both arms', () => {
  const normalized = normalizePluginEval(
    cliJson({ ablated: true }),
    { with: traceOf(sonnet, { 'claude-haiku-4-5-20251001': { inputTokens: 1 } }), without: traceOf(sonnet) },
    plannedRun('with-without'),
    meta,
  );

  assert.equal(normalized.outcome, 'done');

  if (normalized.outcome === 'done') {
    const { result } = normalized;
    assert.deepEqual(
      {
        initModel: result.initModel,
        modelsUsed: result.modelsUsed,
        costUsd: result.costUsd,
        judgeCostUsd: result.judgeCostUsd,
        seconds: result.seconds,
        turns: result.turns,
        tokens: result.tokens,
        arms: result.arms,
        claudeCodeVersion: result.claudeCodeVersion,
      },
      {
        initModel: sonnet,
        modelsUsed: [sonnet, 'claude-haiku-4-5-20251001'],
        costUsd: 0.2,
        judgeCostUsd: 0.04,
        seconds: 25,
        turns: 2,
        tokens: { input: 11, output: 12, cacheRead: 0, cacheCreation: 0 },
        arms: {
          with: [{ name: 'skill-fired', passed: true, scored: true }],
          without: [{ name: 'skill-fired', passed: true, scored: true }],
        },
        claudeCodeVersion: '2.1.327',
      },
    );
  }
});
