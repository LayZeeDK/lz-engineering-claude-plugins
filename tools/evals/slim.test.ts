import assert from 'node:assert/strict';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, utimesSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, test } from 'node:test';

import type { Suite } from './cases.ts';
import { readJson, requireRecord } from './guards.ts';
import type { PlannedRun } from './run-set.ts';
import {
  projectFolder,
  resumeArgs,
  runScaffold,
  scaffoldScript,
  sessionId,
  settleSlim,
  slimArgs,
  slimCwd,
  withHeavyLock,
} from './slim.ts';

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

const meta = { binary: 'W:/bin/run-slim.ts', pluginTree: 'p'.repeat(40), casesTree: 'c'.repeat(40) };
// Each finished session below has a transcript here, which settleSlim grades from.
const projects = `${root}/settle-projects`;
put(`${projects}/${projectFolder('S:/cwd')}/${sessionA}.jsonl`, '{"type":"user","message":{"content":"Make it pass."}}\n');

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

    const outcome = settleSlim(plannedRun(runDir), `${runDir}/raw/result.json`, 0, meta, projects);

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

  assert.equal(settleSlim(plannedRun(runDir), `${runDir}/raw/result-resume-1.json`, 0, meta, projects), 'done');
  const result = requireRecord(readJson(`${runDir}/result.json`), 'result.json');
  assert.deepEqual(
    ['turns', 'seconds', 'costUsd', 'graded', 'backend', 'pluginTree', 'casesTree', 'binary'].map((key) => result[key]),
    [8, 8, 0.3, true, 'slim', meta.pluginTree, meta.casesTree, meta.binary],
  );
});

test('a finished slim run is graded from its transcript with the case graders; one without a transcript fails', () => {
  const caseDir = `${root}/graded-case`;
  put(`${caseDir}/graders/fired.md`, '---\ntype: tool_used\ntool: Skill\ninput_match: \'"skill"\\s*:\\s*"(?:[\\w-]+:)?lz-tpp"\'\n---\n');
  put(`${caseDir}/graders/ran-tests.md`, "---\ntype: tool_used\ntool: Bash\ninput_match: 'vitest'\n---\n");
  put(`${caseDir}/graders/green.md`, "---\ntype: regex\npattern: 'GREEN: [^\\n]+\\s*$'\n---\n");
  const run = (runDir: string): PlannedRun => ({ ...plannedRun(runDir), caseInfo: { ...plannedRun(runDir).caseInfo, dir: caseDir } });
  const cwd = 'S:/graded';
  const entries = [
    { type: 'assistant', message: { content: [{ type: 'tool_use', id: 's1', name: 'Skill', input: { skill: 'lz-tdd:lz-tpp' } }] } },
    { type: 'user', message: { content: [{ type: 'tool_result', tool_use_id: 's1', content: 'ok' }] } },
    { type: 'assistant', message: { content: [{ type: 'tool_use', id: 'b1', name: 'Bash', input: { command: 'npx vitest run' } }] } },
  ];
  put(`${projects}/${projectFolder(cwd)}/${sessionB}.jsonl`, `${entries.map((entry) => JSON.stringify(entry)).join('\n')}\n`);
  const out = (session: string): string => outFile(session, 'Done.\n\nGREEN: x -- y passes; 3 tests green').replace('"cwd":"S:/cwd"', `"cwd":"${cwd}"`);

  const gradedDir = `${root}/graded-run`;
  put(`${gradedDir}/raw/started.json`, JSON.stringify({ startedAt: '2026-11-25T00:00:00.000Z', cwd }));
  put(`${gradedDir}/raw/result.json`, out(sessionB));
  assert.equal(settleSlim(run(gradedDir), `${gradedDir}/raw/result.json`, 0, meta, projects), 'done');
  const result = requireRecord(readJson(`${gradedDir}/result.json`), 'result.json');
  assert.deepEqual([result['graded'], requireRecord(result['arms'], 'arms')['with']], [
    true,
    [
      { name: 'fired', passed: true, scored: true },
      { name: 'green', passed: true, scored: true },
      { name: 'ran-tests', passed: true, scored: true },
    ],
  ]);

  const lostDir = `${root}/lost-transcript`;
  const lost = '99999999-9999-4999-8999-999999999999';
  put(`${lostDir}/raw/started.json`, JSON.stringify({ startedAt: '2026-11-25T00:00:00.000Z', cwd }));
  put(`${lostDir}/raw/result.json`, out(lost));
  assert.equal(settleSlim(run(lostDir), `${lostDir}/raw/result.json`, 0, meta, projects), 'failed');
  assert.match(readFileSync(`${lostDir}/raw/refused.txt`, 'utf8'), new RegExp(`no transcript for session ${lost}`));
  assert.equal(existsSync(`${lostDir}/result.json`), false);
});

test('withHeavyLock refuses a heavy suite without LZ_EVAL_HEAVY_LOCK and never calls the lock for a light one', async () => {
  await assert.rejects(
    withHeavyLock(true, 'task', 5, async () => 'ran', {}),
    /set LZ_EVAL_HEAVY_LOCK/,
  );
  assert.equal(await withHeavyLock(false, 'task', 5, async () => 'ran', { LZ_EVAL_HEAVY_LOCK: 'W:/no/such/heavy-lock.ts' }), 'ran');
});

test('scaffoldScript names the case.yaml scaffold script inside the case folder, and refuses one outside it', () => {
  const caseDir = `${root}/scaffold-case`;
  assert.equal(scaffoldScript(caseDir), null);
  put(`${caseDir}/case.yaml`, 'name: demo\ncontext:\n  scaffold_script: checkout.sh\n');
  assert.equal(scaffoldScript(caseDir), `${caseDir}/checkout.sh`);
  put(`${caseDir}/case.yaml`, 'name: demo\n');
  assert.equal(scaffoldScript(caseDir), null);
  put(`${caseDir}/case.yaml`, 'context:\n  scaffold_script: ../other/checkout.sh\n');
  assert.throws(() => scaffoldScript(caseDir), /must name a file inside the case folder/);
});

test('runScaffold runs bash in the run folder with PATH, a temp HOME and TMPDIR only, and fails on a non-zero exit', () => {
  const cwd = `${root}/scaffold-cwd`;
  const rawDir = `${root}/scaffold-raw`;
  mkdirSync(cwd, { recursive: true });
  const script = `${root}/scaffold.sh`;
  put(script, 'printf "%s|%s|%s" "$(pwd -W 2>/dev/null || pwd)" "${LZ_SECRET-unset}" "${HOME:+home}" > env.txt\necho scaffolded\n');
  const env = { ...process.env, LZ_SECRET: 'leaked' };

  runScaffold(script, cwd, rawDir, env);
  const [where, secret, home] = readFileSync(`${cwd}/env.txt`, 'utf8').split('|');
  assert.deepEqual([where?.replaceAll('\\', '/').toLowerCase(), secret, home], [cwd.toLowerCase(), 'unset', 'home']);
  assert.equal(readFileSync(`${rawDir}/scaffold.stdout.txt`, 'utf8'), 'scaffolded\n');

  put(script, 'echo broken >&2\nexit 3\n');
  assert.throws(() => runScaffold(script, cwd, rawDir, env), /exited 3/);
  assert.equal(readFileSync(`${rawDir}/scaffold.stderr.txt`, 'utf8'), 'broken\n');
});
