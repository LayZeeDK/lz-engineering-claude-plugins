// The D-03 step 1 free dry run (EVH-04): the harness against stub claude and stub run-slim, killed partway, then
// started again. No model is called.
import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, test } from 'node:test';
import { setTimeout as sleep } from 'node:timers/promises';

import { evalsRoots } from './cases.ts';
import { readJson, requireRecord } from './guards.ts';
import { planRuns, readRunSet, resultPath, runState, type PlannedRun } from './run-set.ts';
import { projectFolder } from './slim.ts';
import { git } from './stage.ts';

const root = mkdtempSync(join(tmpdir(), 'lz-evals-dry-run-')).replaceAll('\\', '/');

after(() => rmSync(root, { recursive: true, force: true }));

const sonnet = 'claude-sonnet-5-5';
const opus = 'claude-opus-5-5';
const evalScript = join(import.meta.dirname, 'eval.ts');
const stubScript = join(import.meta.dirname, 'stubs.ts');

function put(path: string, text: string): void {
  mkdirSync(join(path, '..'), { recursive: true });
  writeFileSync(path, text);
}

interface Scenario {
  readonly repo: string;
  readonly ref: string;
  readonly setDir: string;
  readonly stubDir: string;
  readonly projects: string;
  readonly env: NodeJS.ProcessEnv;
}

// A repository whose one commit holds a minimal plugin, a plugin-eval suite `pe` and a slim suite `sl` of three cases
// each; the cells test that commit, which `run` stages.
function scenario(name: string): Scenario {
  const base = `${root}/${name}`;
  const repo = `${base}/repo`;
  mkdirSync(repo, { recursive: true });
  git(repo, ['init', '-q']);
  put(`${repo}/plugins/lz-tdd/.claude-plugin/plugin.json`, '{"name":"lz-tdd"}\n');
  put(`${repo}/evals/lz-tdd/pe/suite.json`, '{"backend":"plugin-eval"}');
  put(`${repo}/evals/lz-tdd-apply/sl/suite.json`, '{"backend":"slim","timeoutMinutes":5}');

  for (const index of ['01', '02', '03']) {
    put(`${repo}/evals/lz-tdd/pe/pe-${index}/prompt.md`, `Answer ${index}.\n`);
    put(`${repo}/evals/lz-tdd-apply/sl/sl-${index}/prompt.md`, `Apply ${index}.\n`);
  }

  git(repo, ['add', '-A']);
  git(repo, ['-c', 'user.name=lz-tdd-eval', '-c', 'user.email=larsbrinknielsen@gmail.com', 'commit', '-q', '-m', 'cases']);
  // The harness's own variables come only from here, so a heavy lock or a real binary set in the shell never leaks in.
  const inherited = Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.startsWith('LZ_EVAL_')));

  return {
    repo,
    ref: git(repo, ['rev-parse', 'HEAD']),
    setDir: `${base}/set`,
    stubDir: `${base}/stub`,
    projects: `${base}/projects`,
    env: {
      ...inherited,
      LZ_EVAL_REPO: repo,
      LZ_EVAL_CLAUDE: stubScript,
      LZ_EVAL_RUN_SLIM: stubScript,
      LZ_EVAL_STAGE_ROOT: `${base}/stage`,
      LZ_EVAL_SLIM_ROOT: `${base}/slim`,
      LZ_EVAL_PROJECTS_DIR: `${base}/projects`,
      LZ_EVAL_STUB_DIR: `${base}/stub`,
    },
  };
}

function writeRunSet(s: Scenario, models: Record<string, number>, suites: readonly unknown[]): void {
  put(`${s.setDir}/run-set.json`, JSON.stringify({ cells: [{ arm: 'head', ref: s.ref, models, suites }] }));
}

function plan(s: Scenario): PlannedRun[] {
  return planRuns(readRunSet(s.setDir), evalsRoots(s.repo));
}

function states(runs: readonly PlannedRun[]): Record<string, number> {
  const counts: Record<string, number> = { done: 0, died: 0, new: 0 };

  for (const run of runs) {
    const state = runState(run.runDir);
    counts[state] = (counts[state] ?? 0) + 1;
  }

  return counts;
}

function evalCli(args: readonly string[], env: NodeJS.ProcessEnv): { status: number | null; output: string } {
  const result = spawnSync(process.execPath, [evalScript, ...args], { encoding: 'utf8', env });

  return { status: result.status, output: `${result.stdout}${result.stderr}` };
}

// Starts `run`, waits for a stub to hang, and kills the whole process tree the way run-slim's watchdog does.
async function runAndKill(s: Scenario, args: readonly string[]): Promise<void> {
  const child = spawn(process.execPath, [evalScript, ...args], {
    env: s.env,
    stdio: 'ignore',
    detached: process.platform !== 'win32',
  });
  const closed = new Promise((done) => child.on('close', done));

  for (let waited = 0; !existsSync(`${s.stubDir}/hung`); waited += 100) {
    if (waited > 30_000) {
      break;
    }

    await sleep(100);
  }

  assert.ok(existsSync(`${s.stubDir}/hung`), 'a stub hung within 30 s');

  if (process.platform === 'win32') {
    spawnSync('taskkill', ['/PID', String(child.pid), '/T', '/F']);
  } else {
    process.kill(-(child.pid ?? 0), 'SIGKILL');
  }

  await closed;
}

function withoutHang(env: NodeJS.ProcessEnv, extra: NodeJS.ProcessEnv = {}): NodeJS.ProcessEnv {
  return Object.fromEntries(
    Object.entries({ ...env, ...extra }).filter(([key]) => key !== 'LZ_EVAL_STUB_HANG_AFTER'),
  );
}

function argvLog(s: Scenario): string[][] {
  return readFileSync(`${s.stubDir}/argv.jsonl`, 'utf8')
    .split('\n')
    .filter((line) => line !== '')
    .map((line): string[] => {
      const value: unknown = JSON.parse(line);

      return Array.isArray(value) ? value.map(String) : [];
    });
}

test('killed partway, the next run starts only unfinished runs; a died run waits for rerun; raising n keeps results', async () => {
  const s = scenario('a');
  writeRunSet(s,{ [sonnet]: 2, [opus]: 2 }, [{ suite: 'pe' }, { suite: 'sl' }]);
  const all = plan(s);
  assert.equal(all.length, 24);

  s.env['LZ_EVAL_STUB_HANG_AFTER'] = '5';
  await runAndKill(s, ['run', s.setDir, '--concurrency', '1']);
  assert.deepEqual(states(all), { done: 5, died: 1, new: 18 });
  const died = all.find((run) => runState(run.runDir) === 'died');
  assert.ok(died !== undefined);
  const diedStart = readFileSync(`${died.runDir}/raw/started.json`, 'utf8');
  const shortName = died.runDir.slice(s.setDir.length + 1);

  const noResume = evalCli(['resume', s.setDir, shortName], withoutHang(s.env));
  assert.equal(noResume.status, 1, noResume.output);
  assert.match(noResume.output, /plugin eval has no resume; rerun it/);

  const again = evalCli(['run', s.setDir], withoutHang(s.env));
  assert.equal(again.status, 1, again.output);
  assert.deepEqual(states(all), { done: 23, died: 1, new: 0 });
  assert.equal(readFileSync(`${died.runDir}/raw/started.json`, 'utf8'), diedStart);
  assert.match(again.output, new RegExp(`died, no result: ${shortName}; .*rerun`));

  const rerun = evalCli(['rerun', s.setDir, shortName], withoutHang(s.env));
  assert.equal(rerun.status, 0, rerun.output);
  assert.equal(existsSync(`${s.setDir}/set-aside-1/${shortName}/raw/started.json`), true);
  assert.equal(runState(died.runDir), 'done');

  const mtimes = all.map((run) => statSync(resultPath(run.runDir)).mtimeMs);
  writeRunSet(s,{ [sonnet]: 3, [opus]: 2 }, [{ suite: 'pe' }, { suite: 'sl' }]);
  const raised = evalCli(['run', s.setDir], withoutHang(s.env));
  assert.equal(raised.status, 0, raised.output);
  const added = plan(s).filter((run) => !all.some((old) => old.runDir === run.runDir));
  assert.deepEqual(
    added.map((run) => `${run.model}/${run.caseInfo.name}/run-${String(run.k)}`).sort(),
    ['pe-01', 'pe-02', 'pe-03', 'sl-01', 'sl-02', 'sl-03'].map((name) => `${sonnet}/${name}/run-3`),
  );
  assert.deepEqual(states(added), { done: 6, died: 0, new: 0 });
  assert.deepEqual(
    all.map((run) => statSync(resultPath(run.runDir)).mtimeMs),
    mtimes,
  );
});

test('a slim run killed before it wrote --out resumes its own session by the transcript id', async () => {
  const s = scenario('b');
  writeRunSet(s,{ [sonnet]: 3 }, [{ suite: 'sl', cases: ['sl-01'] }]);
  s.env['LZ_EVAL_STUB_HANG_AFTER'] = '1';
  await runAndKill(s, ['run', s.setDir]);
  const runs = plan(s);
  assert.deepEqual(states(runs), { done: 1, died: 1, new: 1 });
  const died = runs.find((run) => runState(run.runDir) === 'died');
  assert.ok(died !== undefined);
  assert.equal(existsSync(`${died.runDir}/raw/result.json`), false);
  const cwd = requireRecord(readJson(`${died.runDir}/raw/started.json`), 'started.json')['cwd'];
  const transcripts = readdirSync(`${s.projects}/${projectFolder(String(cwd))}`);
  assert.equal(transcripts.length, 1);
  const session = (transcripts[0] ?? '').replace(/\.jsonl$/, '');

  const resumed = evalCli(['resume', s.setDir, died.runDir.slice(s.setDir.length + 1)], withoutHang(s.env));
  assert.equal(resumed.status, 0, resumed.output);
  const resumeCall = argvLog(s).at(-1) ?? [];
  assert.deepEqual(resumeCall.slice(resumeCall.indexOf('--resume'), resumeCall.indexOf('--resume') + 2), ['--resume', session]);
  assert.deepEqual(
    [existsSync(`${died.runDir}/raw/result-resume-1.json`), existsSync(resultPath(died.runDir))],
    [true, true],
  );

  const plugin = evalCli(['resume', s.setDir, runs[0]?.runDir ?? ''], withoutHang(s.env));
  assert.equal(plugin.status, 1, plugin.output);
  assert.match(plugin.output, /has a result/);
});

test('a usage-limit stop on either backend writes no result, stops the queue and fails the run set', () => {
  for (const suite of ['pe', 'sl']) {
    const s = scenario(`c-${suite}`);
    writeRunSet(s,{ [sonnet]: 1 }, [{ suite, cases: [`${suite}-01`] }]);
    assert.equal(evalCli(['run', s.setDir], s.env).status, 0);
    writeRunSet(s,{ [sonnet]: 3 }, [{ suite, cases: [`${suite}-01`] }]);

    const limited = evalCli(['run', s.setDir, '--concurrency', '1'], { ...s.env, LZ_EVAL_STUB_ERROR: 'limit' });
    const runs = plan(s);
    assert.equal(limited.status, 1, limited.output);
    assert.match(limited.output, /once the limit resets/);
    assert.deepEqual(
      runs.map((run) => [runState(run.runDir), existsSync(`${run.runDir}/raw/refused.txt`)]),
      [
        ['done', false],
        ['died', true],
        ['new', false],
      ],
    );

    const next = evalCli(['run', s.setDir], s.env);
    assert.equal(next.status, 1, next.output);
    assert.deepEqual(
      runs.map((run) => runState(run.runDir)),
      ['done', 'died', 'done'],
    );
  }
});
