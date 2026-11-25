// The lz-tdd eval harness command line. Repository-only; nothing here ships with the plugin.
//
//   node tools/evals/eval.ts run <run set dir> [--concurrency 3]            start every run that has no folder yet
//   node tools/evals/eval.ts rerun <run set dir> <run dir>... [--concurrency 3]
//   node tools/evals/eval.ts resume <run set dir> <run dir>...              continue stopped slim sessions
//   node tools/evals/eval.ts aggregate <run set dir> [--allow-stub]          write RESULTS.md and recheck.json
//
// <run set dir>/run-set.json names the cells: {"cells": [{"arm", "ref", "models": {"<model>": <runs>}, "suites":
// [{"suite", "tags"?, "cases"?}]}], "record"?: [...]}. A run is done when its result.json exists, and `run` never
// starts it again; a run folder without one is a run that died, which `run` leaves alone and names. `rerun` moves
// the named runs into set-aside-<n> and starts them fresh; `resume` continues a slim run's own session into
// raw/result-resume-<n>.json (plugin eval has no resume). Both refuse a run that has a result. A <run dir> is a path
// relative to the run set (head/claude-sonnet-5-5/<case>/run-1) or an absolute one. `run` starts plugin-eval runs on
// --concurrency workers, then slim runs one at a time.
// Environment: LZ_EVAL_REPO (the repository whose evals/ the harness reads; default this repository),
// LZ_EVAL_CLAUDE (the claude binary; a .ts file runs under this Node.js), LZ_EVAL_RUN_SLIM (default
// ~/.claude/references/slim-claude-p/run-slim.ts), LZ_EVAL_STAGE_ROOT (default <repo>/dist/eval), LZ_EVAL_SLIM_ROOT
// (default D:/tmp/slim-claude-p), LZ_EVAL_PROJECTS_DIR (default ~/.claude/projects), and for a slim suite marked heavy
// LZ_EVAL_HEAVY_LOCK (heavy-lock.ts) with LZ_EVAL_LOCK_OWNER.
import { existsSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, relative, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { aggregate, recheckCases, renderResults } from './aggregate.ts';
import { evalRepo, evalsRoots } from './cases.ts';
import { isRecord, readJson } from './guards.ts';
import { claudeCommand, pluginEvalTarget, startPluginEvalRun, type PluginEvalContext } from './plugin-eval.ts';
import {
  diedRuns,
  newRuns,
  planRuns,
  readRunSet,
  runAll,
  runState,
  setAside,
  type PlannedRun,
  type RunOutcomeEntry,
  type RunSet,
} from './run-set.ts';
import {
  required,
  resumeSlimRun,
  runSlimCommand,
  sessionId,
  slimPluginDir,
  startSlimRun,
  withHeavyLock,
  type SlimContext,
} from './slim.ts';

const usage =
  'usage: eval.ts run <run set dir> [--concurrency 3] | rerun|resume <run set dir> <run dir>... | aggregate <run set dir> [--allow-stub]';

function shortName(runSet: RunSet, run: PlannedRun): string {
  return relative(runSet.dir, run.runDir).replaceAll('\\', '/');
}

function isSlim(run: PlannedRun): boolean {
  return run.suite.backend === 'slim';
}

function checkStages(runs: readonly PlannedRun[], stageRoot: string): void {
  const needed = runs.flatMap((run) => {
    const dir = isSlim(run) ? slimPluginDir(stageRoot, run) : pluginEvalTarget(stageRoot, run);

    return dir === null ? [] : [dir];
  });
  const missing = [...new Set(needed)].filter((dir) => !existsSync(dir));

  if (missing.length > 0) {
    throw new Error(`stage ${missing.join(', ')} first`);
  }
}

function namedRuns(runSet: RunSet, plan: readonly PlannedRun[], runDirs: readonly string[]): PlannedRun[] {
  const wanted = runDirs.map((runDir) => resolve(runSet.dir, runDir).replaceAll('\\', '/'));
  const unknown = wanted.filter((runDir) => !plan.some((run) => run.runDir === runDir));

  if (unknown.length > 0) {
    throw new Error(`not planned runs of ${runSet.name}: ${unknown.join(', ')}`);
  }

  return plan.filter((run) => wanted.includes(run.runDir));
}

function reportDied(runSet: RunSet, died: readonly PlannedRun[]): void {
  for (const run of died) {
    const name = shortName(runSet, run);
    const resume = isSlim(run) ? `, or continue its session with: node tools/evals/eval.ts resume ${runSet.dir} ${name}` : '';
    console.error(`died, no result: ${name}; start it over with: node tools/evals/eval.ts rerun ${runSet.dir} ${name}${resume}`);
  }
}

function reportOutcomes(runSet: RunSet, outcomes: readonly RunOutcomeEntry[]): boolean {
  const notDone = outcomes.filter(({ outcome }) => outcome !== 'done');

  for (const { run, outcome } of notDone) {
    console.error(`${outcome}, no result: ${shortName(runSet, run)} (see its raw/refused.txt)`);
  }

  if (outcomes.some(({ outcome }) => outcome === 'limit')) {
    console.error('the usage limit stopped the run set; start the run set again once the limit resets');
  }

  return notDone.length === 0;
}

// recheck.json only grows: a case once listed keeps its extra runs in the plan, so their results stay counted.
function writeRecheck(runSet: RunSet, listed: Record<string, number>): void {
  const file = `${runSet.dir}/recheck.json`;
  const before = existsSync(file) ? readJson(file) : {};
  const merged = { ...(isRecord(before) ? before : {}), ...listed };

  if (Object.keys(merged).length > 0) {
    writeFileSync(file, `${JSON.stringify(merged, null, 2)}\n`);
  }
}

function lockMinutes(runs: readonly PlannedRun[]): number {
  return runs.reduce((total, run) => total + run.suite.timeoutMinutes + 2, 0);
}

interface Context extends PluginEvalContext, SlimContext {}

// Plugin-eval runs on the workers first; slim runs one at a time after them, under the heavy lock when a suite needs it.
async function startRuns(runSet: RunSet, runs: readonly PlannedRun[], concurrency: number, ctx: Context): Promise<RunOutcomeEntry[]> {
  const pluginRuns = runs.filter((run) => !isSlim(run));
  const slimRuns = runs.filter(isSlim);
  const first = await runAll(pluginRuns, concurrency, (run) => startPluginEvalRun(run, ctx));

  if (first.some(({ outcome }) => outcome === 'limit') || slimRuns.length === 0) {
    return first;
  }

  const second = await withHeavyLock(
    slimRuns.some((run) => run.suite.heavy),
    `lz-tdd eval ${runSet.name}: ${String(slimRuns.length)} slim claude -p runs, one at a time`,
    lockMinutes(slimRuns),
    () => runAll(slimRuns, 1, (run) => startSlimRun(run, ctx)),
    process.env,
  );

  return [...first, ...second];
}

// Stryker disable all: command-line entry; eval.test.ts, run-set.test.ts and dry-run.test.ts run it as a process
// Below Node.js 22.18.0 import.meta.main is undefined, which would skip the command and exit 0.
if (typeof import.meta.main !== 'boolean') {
  throw new Error('eval.ts needs Node.js >= 22.18.0 (import.meta.main)');
}

if (import.meta.main) {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      concurrency: { type: 'string', default: '3' },
      'allow-stub': { type: 'boolean', default: false },
    },
  });
  const [command, runSetDir, ...runDirs] = positionals;
  const takesRuns = command === 'rerun' || command === 'resume';

  if (
    runSetDir === undefined ||
    (takesRuns && runDirs.length === 0) ||
    (!takesRuns && runDirs.length > 0) ||
    !['run', 'rerun', 'resume', 'aggregate'].includes(command ?? '')
  ) {
    throw new Error(usage);
  }

  const repo = evalRepo(process.env);
  const runSet = readRunSet(runSetDir);
  const plan = planRuns(runSet, evalsRoots(repo));

  if (command === 'aggregate') {
    const summary = aggregate(runSet.dir, plan, { allowStub: values['allow-stub'], record: runSet.record });
    writeFileSync(`${runSet.dir}/RESULTS.md`, renderResults(summary));
    writeRecheck(runSet, recheckCases(summary));
    console.log(`wrote ${runSet.dir}/RESULTS.md`);
  } else {
    console.log(`eval pid ${String(process.pid)}`);
    const concurrency = Number(values.concurrency);

    if (!Number.isInteger(concurrency) || concurrency < 1) {
      throw new Error(`--concurrency must be a whole number of at least 1, not ${values.concurrency}`);
    }

    const ctx: Context = {
      stageRoot: process.env['LZ_EVAL_STAGE_ROOT'] ?? `${repo}/dist/eval`,
      claude: claudeCommand(process.env),
      slimRoot: process.env['LZ_EVAL_SLIM_ROOT'] ?? 'D:/tmp/slim-claude-p',
      runSlim: runSlimCommand(process.env),
    };
    const projectsDir = process.env['LZ_EVAL_PROJECTS_DIR'] ?? join(homedir(), '.claude/projects');
    const died = command === 'run' ? diedRuns(plan) : [];
    const todo = command === 'run' ? newRuns(plan) : namedRuns(runSet, plan, runDirs);
    const done = todo.filter((run) => runState(run.runDir) === 'done');

    // Every refusal comes before the first spawn and before the lock is taken.
    if (done.length > 0) {
      throw new Error(`each of these runs has a result, which ${String(command)} never replaces: ${done.map((run) => shortName(runSet, run)).join(', ')}`);
    }

    checkStages(todo, ctx.stageRoot);

    if (todo.some((run) => isSlim(run) && run.suite.heavy)) {
      required('LZ_EVAL_HEAVY_LOCK', process.env);
    }

    let outcomes: RunOutcomeEntry[] = [];

    if (command === 'resume') {
      const plugin = todo.filter((run) => !isSlim(run));

      if (plugin.length > 0) {
        throw new Error(`plugin eval has no resume; rerun it: ${plugin.map((run) => shortName(runSet, run)).join(', ')}`);
      }

      const sessions = new Map(todo.map((run) => [run.runDir, runState(run.runDir) === 'new' ? null : sessionId(run.runDir, projectsDir)]));
      const missing = todo.filter((run) => sessions.get(run.runDir) === null);

      if (missing.length > 0) {
        throw new Error(`no session to resume; rerun it: ${missing.map((run) => shortName(runSet, run)).join(', ')}`);
      }

      outcomes = await withHeavyLock(
        todo.some((run) => run.suite.heavy),
        `lz-tdd eval ${runSet.name}: resume ${String(todo.length)} slim claude -p runs`,
        lockMinutes(todo),
        () => runAll(todo, 1, (run) => resumeSlimRun(run, ctx, sessions.get(run.runDir) ?? '')),
        process.env,
      );
    } else if (todo.length === 0 && died.length === 0) {
      console.log(`every run of ${runSet.name} has a result; raise runs in run-set.json for more`);
    } else {
      if (command === 'rerun') {
        setAside(runSet.dir, todo.map((run) => run.runDir));
      }

      outcomes = await startRuns(runSet, todo, concurrency, ctx);
    }

    reportDied(runSet, died);

    if (!reportOutcomes(runSet, outcomes) || died.length > 0) {
      process.exitCode = 1;
    }
  }
}
// Stryker restore all
