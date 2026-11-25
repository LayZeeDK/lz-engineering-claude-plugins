// The lz-tdd eval harness command line. Repository-only; nothing here ships with the plugin.
//
//   node tools/evals/eval.ts run <run set dir> [--concurrency 3]            start every run that has no folder yet
//   node tools/evals/eval.ts rerun <run set dir> <run dir>... [--concurrency 3]
//   node tools/evals/eval.ts aggregate <run set dir> [--allow-stub]          write RESULTS.md and recheck.json
//
// <run set dir>/run-set.json names the cells: {"cells": [{"arm", "ref", "models": {"<model>": <runs>}, "suites":
// [{"suite", "tags"?, "cases"?}]}], "record"?: [...]}. A run is done when its result.json exists, and `run` never
// starts it again; a run folder without one is a run that died, which `run` leaves alone and names. `rerun` moves
// the named runs into set-aside-<n> and starts them fresh; it refuses a run that has a result. A <run dir> is a path
// relative to the run set (head/claude-sonnet-5-5/<case>/run-1) or an absolute one.
// Environment: LZ_EVAL_REPO (the repository whose evals/ the harness reads; default this repository),
// LZ_EVAL_CLAUDE (the claude binary; a .ts file runs under this Node.js), LZ_EVAL_STAGE_ROOT (default
// <repo>/dist/eval).
import { existsSync, writeFileSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { aggregate, recheckCases, renderResults } from './aggregate.ts';
import { evalRepo, evalsRoots } from './cases.ts';
import { readJson, isRecord } from './guards.ts';
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

const usage =
  'usage: eval.ts run <run set dir> [--concurrency 3] | rerun <run set dir> <run dir>... | aggregate <run set dir> [--allow-stub]';

function shortName(runSet: RunSet, run: PlannedRun): string {
  return relative(runSet.dir, run.runDir).replaceAll('\\', '/');
}

function checkStages(runs: readonly PlannedRun[], stageRoot: string): void {
  const missing = [...new Set(runs.map((run) => pluginEvalTarget(stageRoot, run)))].filter((target) => !existsSync(target));

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
    console.error(
      `died, no result: ${shortName(runSet, run)}; start it over with: node tools/evals/eval.ts rerun ${runSet.dir} ${shortName(runSet, run)}`,
    );
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

  if (
    runSetDir === undefined ||
    (command === 'rerun' && runDirs.length === 0) ||
    (command !== 'rerun' && runDirs.length > 0) ||
    (command !== 'run' && command !== 'rerun' && command !== 'aggregate')
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

    const ctx: PluginEvalContext = {
      stageRoot: process.env['LZ_EVAL_STAGE_ROOT'] ?? `${repo}/dist/eval`,
      claude: claudeCommand(process.env),
    };
    const died = command === 'run' ? diedRuns(plan) : [];
    const todo = command === 'run' ? newRuns(plan) : namedRuns(runSet, plan, runDirs);
    const done = todo.filter((run) => runState(run.runDir) === 'done');

    if (done.length > 0) {
      throw new Error(`each of these runs has a result, which rerun never replaces: ${done.map((run) => shortName(runSet, run)).join(', ')}`);
    }

    if (todo.length === 0 && died.length === 0) {
      console.log(`every run of ${runSet.name} has a result; raise runs in run-set.json for more`);
    } else {
      checkStages(todo, ctx.stageRoot);

      if (command === 'rerun') {
        setAside(runSet.dir, todo.map((run) => run.runDir));
      }

      const outcomes = await runAll(todo, concurrency, (run) => startPluginEvalRun(run, ctx));
      reportDied(runSet, died);
      const allDone = reportOutcomes(runSet, outcomes);

      if (!allDone || died.length > 0) {
        process.exitCode = 1;
      }
    }
  }
}
// Stryker restore all
