// The lz-tdd eval harness command line. Repository-only; nothing here ships with the plugin.
//
//   node tools/evals/eval.ts run <run set dir> [--concurrency 3]            start every run that has no folder yet
//   node tools/evals/eval.ts rerun <run set dir> <run dir>... [--concurrency 3]
//   node tools/evals/eval.ts resume <run set dir> <run dir>...              continue stopped slim sessions
//   node tools/evals/eval.ts aggregate <run set dir> [--allow-stub]          write RESULTS.md and recheck.json
//   node tools/evals/eval.ts stage <ref>                                     package <ref> and the committed cases
//   node tools/evals/eval.ts crosscheck <run set dir>                        grade plugin-eval traces with the model
//   node tools/evals/eval.ts template <name>                                 build one slim template by hand
//
// A slim suite's `target` names a template in evals/lz-tdd-apply/templates.json: a kata at a pinned commit with its
// sha256-checked lockfile installed (`npm ci --ignore-scripts`), optionally armed and given a known-red overlay, built
// once below <slim root>/templates/ from the clone at <LZ_EVAL_CLONES>/<org>/<repo>. `run` builds every template its
// runs need before the first spawn, and each run starts in a fresh copy.
// `crosscheck` re-grades every finished plugin-eval run from its copied traces with the harness's grader model and
// exits 1 on any verdict that differs from the CLI's, or on a run it could not grade.
// `run`, `rerun` and `resume` refuse while evals/lz-tdd or evals/lz-tdd-apply has uncommitted changes, then stage
// every ref their runs need (dist/eval/<sha12>/plugin from `git archive`, and lz-tdd/ = plugin/ plus the committed
// plugin-eval cases), so a run never tests the working tree.
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
// LZ_EVAL_HEAVY_LOCK (heavy-lock.ts) with LZ_EVAL_LOCK_OWNER; LZ_EVAL_CLONES (default D:/projects/github, the clone
// root the templates name <org>/<repo> below) and LZ_EVAL_BASH (the bash for scaffold scripts; default Git Bash).
import { existsSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, relative, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { aggregate, recheckCases, renderResults } from './aggregate.ts';
import { evalRepo, evalsRoots } from './cases.ts';
import { crosscheckRunSet, readGraders } from './grade.ts';
import { assertName, isRecord, readJson } from './guards.ts';
import { claudeCommand, startPluginEvalRun, type PluginEvalContext } from './plugin-eval.ts';
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
  type Trees,
} from './run-set.ts';
import {
  required,
  resumeSlimRun,
  runSlimCommand,
  sessionId,
  startSlimRun,
  withHeavyLock,
  type SlimContext,
} from './slim.ts';
import { casesTree, git, readStage, resolveCommit, stageRef } from './stage.ts';
import { buildTemplate } from './templates.ts';

const usage =
  'usage: eval.ts run <run set dir> [--concurrency 3] | rerun|resume <run set dir> <run dir>... | aggregate|crosscheck <run set dir> [--allow-stub] | stage <ref>';

function shortName(runSet: RunSet, run: PlannedRun): string {
  return relative(runSet.dir, run.runDir).replaceAll('\\', '/');
}

function isSlim(run: PlannedRun): boolean {
  return run.suite.backend === 'slim';
}

// Only committed cases run: staging reads them from HEAD, and a case edited since would run as its old self.
function refuseUncommittedCases(repo: string): void {
  const dirty = git(repo, ['status', '--porcelain', '--', ...evalsRoots(repo)]);

  if (dirty !== '') {
    throw new Error(`commit the cases first; uncommitted under evals/:\n${dirty}`);
  }
}

// Stages every ref the runs about to start need, checks that each plugin-eval case is in its stage, and gives back
// the trees each run's result.json records.
function stageRuns(repo: string, runs: readonly PlannedRun[], stageRoot: string): (run: PlannedRun) => Trees {
  const refs = [...new Set(runs.flatMap((run) => (run.ref === null ? [] : [run.ref])))];
  const stages = new Map(
    refs.map((ref) => {
      const info = readStage(stageRef(repo, stageRoot, resolveCommit(repo, ref)));

      if (info === null) {
        throw new Error(`staging ${ref} wrote no readable stage.json`);
      }

      return [ref, info];
    }),
  );
  const missing = runs.filter(
    (run) => !isSlim(run) && run.ref !== null && !(stages.get(run.ref)?.cases ?? []).includes(run.caseInfo.name),
  );

  if (missing.length > 0) {
    throw new Error(`not in the staged cases (commit them): ${[...new Set(missing.map((run) => run.caseInfo.name))].join(', ')}`);
  }

  const cases = casesTree(repo);

  return (run) => {
    const info = run.ref === null ? undefined : stages.get(run.ref);

    return { pluginTree: info?.pluginTree ?? null, casesTree: info?.casesTree ?? cases };
  };
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
    !['run', 'rerun', 'resume', 'aggregate', 'stage', 'crosscheck', 'template'].includes(command ?? '')
  ) {
    throw new Error(usage);
  }

  const repo = evalRepo(process.env);
  const stageRoot = process.env['LZ_EVAL_STAGE_ROOT'] ?? `${repo}/dist/eval`;
  const slimRoot = process.env['LZ_EVAL_SLIM_ROOT'] ?? 'D:/tmp/slim-claude-p';
  const clonesRoot = process.env['LZ_EVAL_CLONES'] ?? 'D:/projects/github';

  if (command === 'run' || command === 'rerun' || command === 'resume' || command === 'template') {
    refuseUncommittedCases(repo);
  }

  if (command === 'stage') {
    console.log(stageRef(repo, stageRoot, resolveCommit(repo, runSetDir)));
  } else if (command === 'template') {
    console.log(buildTemplate(repo, slimRoot, clonesRoot, assertName('template', runSetDir)));
  } else if (command === 'crosscheck') {
    const runSet = readRunSet(runSetDir);
    const report = crosscheckRunSet(planRuns(runSet, evalsRoots(repo)), stageRoot);

    for (const { caseName, run, side, grader, cli, model } of report.disagree) {
      console.error(`disagree: ${caseName} ${relative(runSet.dir, run).replaceAll('\\', '/')} ${side} ${grader}: CLI ${String(cli)}, model ${String(model)}`);
    }

    for (const { run, reason } of report.unchecked) {
      console.error(`unchecked: ${relative(runSet.dir, run).replaceAll('\\', '/')}: ${reason}`);
    }

    console.log(`crosscheck: ${String(report.agree)} agree, ${String(report.disagree.length)} disagree, ${String(report.unchecked.length)} unchecked`);

    if (report.disagree.length > 0 || report.unchecked.length > 0) {
      process.exitCode = 1;
    }
  } else if (command === 'aggregate') {
    const runSet = readRunSet(runSetDir);
    const plan = planRuns(runSet, evalsRoots(repo));
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

    const runSet = readRunSet(runSetDir);
    const plan = planRuns(runSet, evalsRoots(repo));
    const projectsDir = process.env['LZ_EVAL_PROJECTS_DIR'] ?? join(homedir(), '.claude/projects');
    const died = command === 'run' ? diedRuns(plan) : [];
    const todo = command === 'run' ? newRuns(plan) : namedRuns(runSet, plan, runDirs);
    const done = todo.filter((run) => runState(run.runDir) === 'done');

    // Every refusal comes before the first spawn and before the lock is taken.
    if (done.length > 0) {
      throw new Error(`each of these runs has a result, which ${String(command)} never replaces: ${done.map((run) => shortName(runSet, run)).join(', ')}`);
    }

    if (todo.some((run) => isSlim(run) && run.suite.heavy)) {
      required('LZ_EVAL_HEAVY_LOCK', process.env);
    }

    const plugin = todo.filter((run) => !isSlim(run));

    if (command === 'resume' && plugin.length > 0) {
      throw new Error(`plugin eval has no resume; rerun it: ${plugin.map((run) => shortName(runSet, run)).join(', ')}`);
    }

    // A slim run is graded by the harness after it has paid for the session, so its graders must read now.
    for (const run of todo.filter(isSlim)) {
      readGraders(run.caseInfo.dir);
    }

    const trees = stageRuns(repo, todo, stageRoot);
    // A resumed session goes on in the folder it has; only a fresh start copies a template.
    const targets = command === 'resume' ? [] : todo.flatMap((run) => (isSlim(run) && run.suite.target !== null ? [run.suite.target] : []));
    const templates = new Map([...new Set(targets)].map((name) => [name, buildTemplate(repo, slimRoot, clonesRoot, name)]));
    const ctx: Context = {
      stageRoot,
      claude: claudeCommand(process.env),
      slimRoot,
      runSlim: runSlimCommand(process.env),
      projectsDir,
      trees,
      templates,
    };
    let outcomes: RunOutcomeEntry[] = [];

    if (command === 'resume') {
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
