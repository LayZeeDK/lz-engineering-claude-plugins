import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, test } from 'node:test';

import {
  diedRuns,
  newRuns,
  planRuns,
  readRunSet,
  resultPath,
  runAll,
  runState,
  setAside,
  writeResult,
  type PlannedRun,
  type RunOutcome,
  type RunResult,
} from './run-set.ts';

const root = mkdtempSync(join(tmpdir(), 'lz-evals-run-set-')).replaceAll('\\', '/');

after(() => rmSync(root, { recursive: true, force: true }));

const zeros = '0'.repeat(40);
const sonnet = 'claude-sonnet-5-5';
const opus = 'claude-opus-5-5';

function put(path: string, text: string): void {
  mkdirSync(join(path, '..'), { recursive: true });
  writeFileSync(path, text);
}

// A repository with one plugin-eval suite of two cases, a stage for the zero ref, and a run set over it.
function scenario(name: string, models: Record<string, number>): { repo: string; setDir: string; env: NodeJS.ProcessEnv } {
  const base = `${root}/${name}`;
  const repo = `${base}/repo`;
  put(`${repo}/evals/lz-tdd/demo/suite.json`, '{"backend":"plugin-eval"}');
  put(`${repo}/evals/lz-tdd/demo/demo-01/prompt.md`, '---\ntags: [a]\n---\nOne.\n');
  put(`${repo}/evals/lz-tdd/demo/demo-02/prompt.md`, '---\ntags: [a, b]\n---\nTwo.\n');
  mkdirSync(`${base}/stage/${zeros.slice(0, 12)}/lz-tdd`, { recursive: true });
  const setDir = `${base}/set`;
  writeRunSet(setDir, models);

  return {
    repo,
    setDir,
    env: {
      LZ_EVAL_REPO: repo,
      LZ_EVAL_STAGE_ROOT: `${base}/stage`,
      LZ_EVAL_CLAUDE: join(import.meta.dirname, 'stubs.ts'),
      LZ_EVAL_STUB_DIR: `${base}/stub`,
    },
  };
}

function writeRunSet(setDir: string, models: Record<string, number>): void {
  put(`${setDir}/run-set.json`, JSON.stringify({ cells: [{ arm: 'head', ref: zeros, models, suites: [{ suite: 'demo' }] }] }));
}

function plan(repo: string, setDir: string): PlannedRun[] {
  return planRuns(readRunSet(setDir), [`${repo}/evals/lz-tdd`, `${repo}/evals/lz-tdd-apply`]);
}

function evalCli(args: readonly string[], env: NodeJS.ProcessEnv): { status: number | null; output: string } {
  const result = spawnSync(process.execPath, [join(import.meta.dirname, 'eval.ts'), ...args], {
    encoding: 'utf8',
    env: { ...process.env, ...env },
  });

  return { status: result.status, output: `${result.stdout}${result.stderr}` };
}

function stubCalls(env: NodeJS.ProcessEnv): number {
  const file = `${env['LZ_EVAL_STUB_DIR'] ?? ''}/argv.jsonl`;

  return existsSync(file) ? readFileSync(file, 'utf8').split('\n').filter((line) => line !== '').length : 0;
}

function fakeResult(runDir: string): void {
  put(resultPath(runDir), '{"schemaVersion":1}\n');
}

test('runState is done with result.json, died with raw/ and no result, new with neither', () => {
  put(`${root}/state/done/result.json`, '{}');
  mkdirSync(`${root}/state/done/raw`, { recursive: true });
  mkdirSync(`${root}/state/died/raw`, { recursive: true });
  mkdirSync(`${root}/state/new`, { recursive: true });

  assert.deepEqual(
    ['done', 'died', 'new', 'missing'].map((name) => runState(`${root}/state/${name}`)),
    ['done', 'died', 'new', 'new'],
  );
});

test('planRuns expands cell x model x selected case x run into run folders, filtering by tags and names', () => {
  const { repo, setDir } = scenario('plan', { [sonnet]: 2, [opus]: 1 });
  const all = plan(repo, setDir).map((run) => run.runDir.slice(setDir.length + 1));

  assert.deepEqual(all, [
    `head/${sonnet}/demo-01/run-1`,
    `head/${sonnet}/demo-01/run-2`,
    `head/${sonnet}/demo-02/run-1`,
    `head/${sonnet}/demo-02/run-2`,
    `head/${opus}/demo-01/run-1`,
    `head/${opus}/demo-02/run-1`,
  ]);

  put(
    `${setDir}/run-set.json`,
    JSON.stringify({ cells: [{ arm: 'head', ref: zeros, models: { [opus]: 1 }, suites: [{ suite: 'demo', tags: ['b'] }] }] }),
  );
  assert.deepEqual(
    plan(repo, setDir).map((run) => run.caseInfo.name),
    ['demo-02'],
  );
  put(
    `${setDir}/run-set.json`,
    JSON.stringify({ cells: [{ arm: 'head', ref: zeros, models: { [opus]: 1 }, suites: [{ suite: 'demo', cases: ['demo-01'] }] }] }),
  );
  assert.deepEqual(
    plan(repo, setDir).map((run) => run.caseInfo.name),
    ['demo-01'],
  );
});

test('readRunSet refuses bad names, refs, run counts, keys and records, naming the file', () => {
  const bad = [
    { cells: [{ arm: '../x', ref: zeros, models: { [sonnet]: 1 }, suites: [{ suite: 'demo' }] }] },
    { cells: [{ arm: 'head', ref: 'abc', models: { [sonnet]: 1 }, suites: [{ suite: 'demo' }] }] },
    { cells: [{ arm: 'head', ref: zeros, models: { [sonnet]: 0 }, suites: [{ suite: 'demo' }] }] },
    { cells: [{ arm: 'head', ref: zeros, models: { [sonnet]: 1.5 }, suites: [{ suite: 'demo' }] }] },
    { cells: [{ arm: 'head', ref: zeros, models: { Sonnet: 1 }, suites: [{ suite: 'demo' }] }] },
    { cells: [{ arm: 'head', ref: zeros, models: { [sonnet]: 1 }, suites: [] }] },
    { cells: [{ arm: 'head', ref: zeros, models: { [sonnet]: 1 }, suites: [{ suite: 'demo' }], extra: 1 }] },
    { cells: [], other: 1 },
    { cells: [{ arm: 'head', ref: zeros, models: { [sonnet]: 1 }, suites: [{ suite: 'demo' }] }], record: [{ label: 'x' }] },
    {
      cells: [
        { arm: 'head', ref: zeros, models: { [sonnet]: 1 }, suites: [{ suite: 'demo' }] },
        { arm: 'head', ref: null, models: { [sonnet]: 1 }, suites: [{ suite: 'demo' }] },
      ],
    },
  ];

  assert.deepEqual(
    bad.map((value, index) => {
      const dir = `${root}/bad-${String(index)}`;
      put(`${dir}/run-set.json`, JSON.stringify(value));

      try {
        readRunSet(dir);

        return 'read';
      } catch (error) {
        return error instanceof Error && error.message.includes('run-set.json') ? 'refused' : 'other';
      }
    }),
    bad.map(() => 'refused'),
  );
});

test('readRunSet reads recorded cells for the reproduction table', () => {
  const dir = `${root}/recorded`;
  const record = {
    label: 'lz-tpp recall 2026-07',
    cell: 'old',
    model: 'claude-opus-4-8',
    suite: 'trigger-lz-tpp',
    tags: ['forward'],
    grader: 'skill-fired',
    unit: 'case-fired',
    passed: 13,
    total: 13,
  };
  put(
    `${dir}/run-set.json`,
    JSON.stringify({ cells: [{ arm: 'old', ref: null, models: { 'claude-opus-4-8': 3 }, suites: [{ suite: 'demo' }] }], record: [record] }),
  );

  assert.deepEqual(readRunSet(dir).record, [record]);
});

test('writeResult renames a finished temp file into result.json', () => {
  const runDir = `${root}/write/run-1`;
  mkdirSync(runDir, { recursive: true });
  const result: RunResult = {
    schemaVersion: 1,
    backend: 'slim',
    runSet: 'set',
    arm: 'head',
    ref: null,
    pluginTree: null,
    casesTree: null,
    suite: 'demo',
    case: 'demo-01',
    k: 1,
    requestedModel: sonnet,
    initModel: sonnet,
    modelsUsed: [sonnet],
    claudeCodeVersion: null,
    binary: 'W:/bin/run-slim.ts',
    startedAt: '2026-11-25T00:00:00.000Z',
    seconds: 1,
    turns: 1,
    costUsd: 0,
    judgeCostUsd: 0,
    tokens: { input: 0, output: 0, cacheRead: 0, cacheCreation: 0 },
    maxTurns: false,
    graded: false,
    arms: { with: [], without: null },
  };
  writeResult(runDir, result);

  assert.deepEqual([existsSync(`${runDir}/result.json`), existsSync(`${runDir}/result.json.tmp`)], [true, false]);
  assert.deepEqual(JSON.parse(readFileSync(`${runDir}/result.json`, 'utf8')), result);
});

test('setAside moves each path into the first free set-aside-<n>, keeping its place below the root', () => {
  const setDir = `${root}/aside`;
  put(`${setDir}/head/m/c/run-1/raw/x.txt`, 'first');
  put(`${setDir}/head/m/c/run-2/raw/x.txt`, 'second');
  setAside(setDir, [`${setDir}/head/m/c/run-1`, `${setDir}/missing`]);
  setAside(setDir, [`${setDir}/head/m/c/run-2`]);

  assert.deepEqual(
    [
      readFileSync(`${setDir}/set-aside-1/head/m/c/run-1/raw/x.txt`, 'utf8'),
      readFileSync(`${setDir}/set-aside-2/head/m/c/run-2/raw/x.txt`, 'utf8'),
      existsSync(`${setDir}/head/m/c/run-1`),
      existsSync(`${setDir}/head/m/c/run-2`),
    ],
    ['first', 'second', false, false],
  );
});

const plannedStub: PlannedRun = {
  runDir: '',
  runSetName: 'set',
  arm: 'head',
  ref: null,
  model: sonnet,
  suite: {
    name: 'demo',
    dir: 'W:/repo/evals/lz-tdd/demo',
    backend: 'plugin-eval',
    ablation: 'none',
    allowTools: [],
    scaffold: false,
    heavy: false,
    allow: null,
    timeoutMinutes: 15,
    invokeTwin: null,
    target: null,
  },
  caseInfo: { name: 'demo-01', dir: 'W:/repo/evals/lz-tdd/demo/demo-01', tags: [], body: '' },
  k: 1,
};

test('runAll stops taking new runs after a usage-limit outcome', async () => {
  const answers: Record<string, RunOutcome> = { a: 'done', b: 'limit', c: 'done', d: 'done' };
  const started: string[] = [];
  const outcomes = await runAll(
    ['a', 'b', 'c', 'd'].map((runDir) => ({ ...plannedStub, runDir })),
    1,
    async (run) => {
      started.push(run.runDir);

      return answers[run.runDir] ?? 'failed';
    },
  );

  assert.deepEqual(started, ['a', 'b']);
  assert.deepEqual(
    outcomes.map(({ run, outcome }) => [run.runDir, outcome]),
    [
      ['a', 'done'],
      ['b', 'limit'],
    ],
  );
});

test('runAll counts a start that throws as failed and goes on', async () => {
  const outcomes = await runAll(
    ['a', 'b'].map((runDir) => ({ ...plannedStub, runDir })),
    2,
    async (run) => {
      if (run.runDir === 'a') {
        throw new Error('spawn went wrong');
      }

      return 'done';
    },
  );

  assert.deepEqual(outcomes.map(({ outcome }) => outcome).sort(), ['done', 'failed']);
});

test('planRuns plans up to the recheck count for a case listed in recheck.json', () => {
  const { repo, setDir } = scenario('recheck', { [sonnet]: 2, [opus]: 3 });
  put(`${setDir}/recheck.json`, JSON.stringify({ [`head/${opus}/demo-02`]: 5 }));
  const opusRuns = plan(repo, setDir).filter((run) => run.model === opus);

  assert.deepEqual(
    opusRuns.map((run) => `${run.caseInfo.name}/${String(run.k)}`),
    ['demo-01/1', 'demo-01/2', 'demo-01/3', 'demo-02/1', 'demo-02/2', 'demo-02/3', 'demo-02/4', 'demo-02/5'],
  );
});

test('run starts only new runs, leaves a died run alone and names it with rerun; rerun sets runs aside; raising n keeps old results', () => {
  const { repo, setDir, env } = scenario('cli', { [sonnet]: 2, [opus]: 2 });
  const all = plan(repo, setDir);
  const at = (model: string, caseName: string, k: number): string => `${setDir}/head/${model}/${caseName}/run-${String(k)}`;
  fakeResult(at(sonnet, 'demo-01', 1));
  fakeResult(at(sonnet, 'demo-02', 1));
  fakeResult(at(opus, 'demo-01', 1));
  const died = at(opus, 'demo-02', 2);
  put(`${died}/raw/started.json`, '{"startedAt":"2026-11-25T00:00:00.000Z"}');

  assert.deepEqual(
    [newRuns(all).length, diedRuns(all).map((run) => run.runDir)],
    [4, [died]],
  );

  const first = evalCli(['run', setDir, '--concurrency', '2'], env);
  assert.equal(first.status, 1, first.output);
  assert.equal(stubCalls(env), 4);
  assert.deepEqual([runState(died), readFileSync(`${died}/raw/started.json`, 'utf8')], ['died', '{"startedAt":"2026-11-25T00:00:00.000Z"}']);
  assert.match(first.output, new RegExp(`rerun .*head/${opus}/demo-02/run-2`));
  assert.equal(diedRuns(all).length, 1);
  assert.equal(all.filter((run) => runState(run.runDir) === 'done').length, 7);

  const refused = evalCli(['rerun', setDir, `head/${sonnet}/demo-01/run-1`], env);
  assert.equal(refused.status, 1, refused.output);
  assert.match(refused.output, /has a result/);
  assert.equal(stubCalls(env), 4);

  const unknown = evalCli(['rerun', setDir, `head/${sonnet}/demo-09/run-1`], env);
  assert.equal(unknown.status, 1, unknown.output);
  assert.match(unknown.output, /not planned runs/);

  const rerun = evalCli(['rerun', setDir, `head/${opus}/demo-02/run-2`], env);
  assert.equal(rerun.status, 0, rerun.output);
  assert.deepEqual(
    [existsSync(`${setDir}/set-aside-1/head/${opus}/demo-02/run-2/raw/started.json`), runState(died)],
    [true, 'done'],
  );

  rmSync(resultPath(at(sonnet, 'demo-02', 2)));
  const second = evalCli(['rerun', setDir, at(sonnet, 'demo-02', 2)], env);
  assert.equal(second.status, 0, second.output);
  assert.equal(existsSync(`${setDir}/set-aside-2/head/${sonnet}/demo-02/run-2/raw`), true);

  const before = all.map((run) => statSync(resultPath(run.runDir)).mtimeMs);
  writeRunSet(setDir, { [sonnet]: 3, [opus]: 2 });
  const raised = plan(repo, setDir);
  assert.deepEqual(
    newRuns(raised).map((run) => run.runDir),
    [at(sonnet, 'demo-01', 3), at(sonnet, 'demo-02', 3)],
  );
  const third = evalCli(['run', setDir], env);
  assert.equal(third.status, 0, third.output);
  assert.deepEqual(
    all.map((run) => statSync(resultPath(run.runDir)).mtimeMs),
    before,
  );
  assert.equal(raised.filter((run) => runState(run.runDir) === 'done').length, 10);

  const nothing = evalCli(['run', setDir], env);
  assert.equal(nothing.status, 0, nothing.output);
  assert.match(nothing.output, /every run of set has a result/);
});
