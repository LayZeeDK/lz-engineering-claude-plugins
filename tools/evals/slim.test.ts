import assert from 'node:assert/strict';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, utimesSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, test } from 'node:test';

import type { Suite } from './cases.ts';
import { readJson, requireRecord } from './guards.ts';
import type { PlannedRun } from './run-set.ts';
import { projectFolder, resumeArgs, sessionId, settleSlim, slimArgs, slimCwd, withHeavyLock } from './slim.ts';

const root = mkdtempSync(join(tmpdir(), 'lz-evals-slim-')).replaceAll('\\', '/');

after(() => rmSync(root, { recursive: true, force: true }));

const sonnet = 'claude-sonnet-5-5';
const sessionA = '11111111-2222-4333-8444-555555555555';
const sessionB = '66666666-7777-4888-9999-aaaaaaaaaaaa';

function put(path: string, text: string): void {
  mkdirSync(join(path, '..'), { recursive: true });
  writeFileSync(path, text);
}

function plannedRun(runDir: string, heavy = false): PlannedRun {
  const suite: Suite = {
    name: 'apply',
    dir: 'W:/repo/evals/lz-tdd-apply/apply',
    backend: 'slim',
    ablation: 'none',
    allowTools: [],
    scaffold: false,
    heavy,
    allow: null,
    timeoutMinutes: 20,
    invokeTwin: null,
    target: null,
  };

  return {
    runDir,
    runSetName: 'set',
    arm: 'head',
    ref: '0'.repeat(40),
    model: sonnet,
    suite,
    caseInfo: { name: 'apply-01', dir: 'W:/repo/evals/lz-tdd-apply/apply/apply-01', tags: [], body: 'Make it pass.\n' },
    k: 2,
  };
}

function outFile(session: string | null, text: string, models: readonly string[] = [sonnet], ms = 2000): string {
  const result = {
    type: 'result',
    is_error: false,
    session_id: session,
    total_cost_usd: 0.3,
    num_turns: 4,
    result: text,
    modelUsage: Object.fromEntries(models.map((model) => [model, { inputTokens: 10, outputTokens: 5 }])),
  };

  return JSON.stringify({ cwd: 'S:/cwd', args: [], prompt: 'x', status: 0, ms, stdout: session === null ? '' : JSON.stringify(result), stderr: '' });
}

const input = {
  cwd: 'S:/slim/runs/set-abc',
  rawDir: 'W:/set/head/m/c/run-1/raw',
  model: sonnet,
  timeoutMinutes: 20,
  pluginDir: null,
  allow: null,
};

test('slimArgs passes cwd, prompt, out, model, no rules and the timeout, and the plugin and allow rules only when set', () => {
  assert.deepEqual(slimArgs(input), [
    '--cwd',
    'S:/slim/runs/set-abc',
    '--prompt-file',
    'W:/set/head/m/c/run-1/raw/prompt.txt',
    '--out',
    'W:/set/head/m/c/run-1/raw/result.json',
    '--model',
    sonnet,
    '--rules',
    'none',
    '--timeout-min',
    '20',
  ]);
  assert.deepEqual(slimArgs({ ...input, pluginDir: 'W:/stage/000000000000/plugin', allow: 'Bash(npm test)' }).slice(12), [
    '--plugin-dir',
    'W:/stage/000000000000/plugin',
    '--allow',
    'Bash(npm test)',
  ]);
});

test('resumeArgs writes the next result-resume-<n>.json from continue.txt and resumes the session', () => {
  const rawDir = `${root}/resume/raw`;
  put(`${rawDir}/result.json`, '{}');
  put(`${rawDir}/result-resume-1.json`, '{}');
  const args = resumeArgs({ ...input, rawDir }, sessionA);

  assert.deepEqual(
    [args[args.indexOf('--prompt-file') + 1], args[args.indexOf('--out') + 1], args.slice(-2)],
    [`${rawDir}/continue.txt`, `${rawDir}/result-resume-2.json`, ['--resume', sessionA]],
  );
});

test('projectFolder turns every character outside letters and digits into a dash', () => {
  assert.equal(projectFolder('D:/tmp/slim-claude-p/runs/set-abc'), 'D--tmp-slim-claude-p-runs-set-abc');
});

test('slimCwd is short, below the slim root and the same for the same run', () => {
  const run = plannedRun('W:/set/head/m/c/run-2');

  assert.match(slimCwd('S:/slim', run), /^S:\/slim\/runs\/set-[0-9a-f]{12}$/);
  assert.equal(slimCwd('S:/slim', run), slimCwd('S:/slim', { ...run }));
  assert.notEqual(slimCwd('S:/slim', run), slimCwd('S:/slim', { ...run, k: 3 }));
});

test('sessionId reads the latest --out file, else the single transcript written since the run started', () => {
  const projects = `${root}/projects`;
  const startedAt = new Date(Date.now() - 60_000);
  const started = (runDir: string, cwd: string): void =>
    put(`${runDir}/raw/started.json`, JSON.stringify({ startedAt: startedAt.toISOString(), cwd }));

  const fromOut = `${root}/s1`;
  started(fromOut, 'S:/a');
  put(`${fromOut}/raw/result.json`, outFile(sessionA, 'partial'));
  put(`${fromOut}/raw/result-resume-1.json`, outFile(sessionB, 'more'));

  const fromTranscript = `${root}/s2`;
  started(fromTranscript, 'S:/b');
  put(`${projects}/${projectFolder('S:/b')}/${sessionA}.jsonl`, '{}\n');
  const old = `${projects}/${projectFolder('S:/b')}/${sessionB}.jsonl`;
  put(old, '{}\n');
  const before = new Date(startedAt.getTime() - 60_000);
  utimesSync(old, before, before);

  const twoTranscripts = `${root}/s3`;
  started(twoTranscripts, 'S:/c');
  put(`${projects}/${projectFolder('S:/c')}/${sessionA}.jsonl`, '{}\n');
  put(`${projects}/${projectFolder('S:/c')}/${sessionB}.jsonl`, '{}\n');

  const none = `${root}/s4`;
  started(none, 'S:/d');

  assert.deepEqual(
    [fromOut, fromTranscript, twoTranscripts, none].map((runDir) => sessionId(runDir, projects)),
    [sessionB, sessionA, null, null],
  );
});

test('settleSlim writes result.json for a finished run and refuses a limit stop, a model mismatch and a missing --out', () => {
  const settle = (name: string, out: string | null): { outcome: string; result: boolean; refused: string } => {
    const runDir = `${root}/settle-${name}`;
    put(`${runDir}/raw/started.json`, JSON.stringify({ startedAt: '2026-11-25T00:00:00.000Z', cwd: 'S:/x' }));

    if (out !== null) {
      put(`${runDir}/raw/result.json`, out);
    }

    const outcome = settleSlim(plannedRun(runDir), `${runDir}/raw/result.json`, 0, 'W:/bin/run-slim.ts');

    return {
      outcome,
      result: existsSync(`${runDir}/result.json`),
      refused: existsSync(`${runDir}/raw/refused.txt`) ? readFileSync(`${runDir}/raw/refused.txt`, 'utf8') : '',
    };
  };

  const finished = settle('done', outFile(sessionA, 'All tests pass.', [sonnet, 'claude-haiku-4-5-20251001']));
  const limited = settle('limit', outFile(sessionA, "You've hit your 5-hour limit resets 6:30am (Europe/Copenhagen)"));
  const mismatch = settle('model', outFile(sessionA, 'Done.', ['claude-opus-5-5']));
  const missing = settle('missing', null);

  assert.deepEqual(
    [finished, limited, mismatch, missing].map(({ outcome, result }) => [outcome, result]),
    [
      ['done', true],
      ['limit', false],
      ['failed', false],
      ['failed', false],
    ],
  );
  assert.match(mismatch.refused, /model mismatch/);
  assert.match(limited.refused, /usage limit/);
});

test('a resumed run sums turns and seconds over its --out files and keeps the highest cost', () => {
  const runDir = `${root}/timing`;
  put(`${runDir}/raw/started.json`, JSON.stringify({ startedAt: '2026-11-25T00:00:00.000Z', cwd: 'S:/x' }));
  put(`${runDir}/raw/result.json`, outFile(sessionA, 'stopped', [sonnet], 3000));
  put(`${runDir}/raw/result-resume-1.json`, outFile(sessionA, 'Done.', [sonnet], 5000));

  assert.equal(settleSlim(plannedRun(runDir), `${runDir}/raw/result-resume-1.json`, 0, 'W:/bin/run-slim.ts'), 'done');
  const result = requireRecord(readJson(`${runDir}/result.json`), 'result.json');
  assert.deepEqual(
    ['turns', 'seconds', 'costUsd', 'graded', 'backend'].map((key) => result[key]),
    [8, 8, 0.3, false, 'slim'],
  );
});

test('withHeavyLock refuses a heavy suite without LZ_EVAL_HEAVY_LOCK and never calls the lock for a light one', async () => {
  await assert.rejects(
    withHeavyLock(true, 'task', 5, async () => 'ran', {}),
    /set LZ_EVAL_HEAVY_LOCK/,
  );
  assert.equal(await withHeavyLock(false, 'task', 5, async () => 'ran', { LZ_EVAL_HEAVY_LOCK: 'W:/no/such/heavy-lock.ts' }), 'ran');
});
