// The lz-tdd eval harness command line. Repository-only; nothing here ships with the plugin.
//
//   node tools/evals/eval.ts run <run set dir> [--concurrency 3]    start every run that has no folder yet
//   node tools/evals/eval.ts aggregate <run set dir> [--allow-stub]  write <run set dir>/RESULTS.md
//
// <run set dir>/run-set.json names the cells: {"cells": [{"arm", "ref", "models": {"<model>": <runs>}, "suites":
// [{"suite", "tags"?, "cases"?}]}]}. A run is done when its result.json exists; `run` never starts it again.
// Environment: LZ_EVAL_REPO (the repository whose evals/ the harness reads; default this repository),
// LZ_EVAL_CLAUDE (the claude binary; a .ts file runs under this Node.js), LZ_EVAL_STAGE_ROOT (default
// <repo>/dist/eval).
import { existsSync, writeFileSync } from 'node:fs';
import { parseArgs } from 'node:util';
import { aggregate, renderResults } from './aggregate.ts';
import { evalRepo, evalsRoots } from './cases.ts';
import { claudeCommand, pluginEvalTarget, startPluginEvalRun, type PluginEvalContext } from './plugin-eval.ts';
import { newRuns, planRuns, readRunSet, runAll, type PlannedRun } from './run-set.ts';

const usage = 'usage: eval.ts run <run set dir> [--concurrency 3] | aggregate <run set dir> [--allow-stub]';

function checkStages(runs: readonly PlannedRun[], stageRoot: string): void {
  const missing = [...new Set(runs.map((run) => pluginEvalTarget(stageRoot, run)))].filter((target) => !existsSync(target));

  if (missing.length > 0) {
    throw new Error(`stage ${missing.join(', ')} first`);
  }
}

// Stryker disable all: command-line entry; eval.test.ts and dry-run.test.ts run it as a process
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
  const [command, runSetDir, ...rest] = positionals;

  if (runSetDir === undefined || rest.length > 0 || (command !== 'run' && command !== 'aggregate')) {
    throw new Error(usage);
  }

  const repo = evalRepo(process.env);
  const runSet = readRunSet(runSetDir);
  const plan = planRuns(runSet, evalsRoots(repo));

  if (command === 'aggregate') {
    const summary = aggregate(runSet.dir, plan, { allowStub: values['allow-stub'] });
    writeFileSync(`${runSet.dir}/RESULTS.md`, renderResults(summary));
    console.log(`wrote ${runSet.dir}/RESULTS.md`);
  } else {
    console.log(`eval pid ${String(process.pid)}`);
    const concurrency = Number(values.concurrency);

    if (!Number.isInteger(concurrency) || concurrency < 1) {
      throw new Error(`--concurrency must be a whole number of at least 1, not ${values.concurrency}`);
    }

    const todo = newRuns(plan);

    if (todo.length === 0) {
      console.log(`every run of ${runSet.name} has a result; raise runs in run-set.json for more`);
    } else {
      const ctx: PluginEvalContext = {
        stageRoot: process.env['LZ_EVAL_STAGE_ROOT'] ?? `${repo}/dist/eval`,
        claude: claudeCommand(process.env),
      };
      checkStages(todo, ctx.stageRoot);
      const outcomes = await runAll(todo, concurrency, (run) => startPluginEvalRun(run, ctx));
      const notDone = outcomes.filter(({ outcome }) => outcome !== 'done');

      if (notDone.length > 0) {
        console.error(`runs without a result: ${notDone.map(({ run }) => run.runDir).join(', ')}`);
        process.exitCode = 1;
      }
    }
  }
}
// Stryker restore all
