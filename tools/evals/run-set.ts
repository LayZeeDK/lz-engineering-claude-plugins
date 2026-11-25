// A run set: `<run set>/run-set.json` names cells (an arm, its packaged ref, models with runs per model, suites), and
// each run gets `<run set>/<arm>/<model>/<case>/run-<k>/`. A run is done when the harness has written its
// result.json. Repository-only; nothing here ships with the plugin.
import { spawn } from 'node:child_process';
import { closeSync, existsSync, mkdirSync, openSync, renameSync, writeFileSync } from 'node:fs';
import { basename, dirname, relative, resolve } from 'node:path';
import { findSuite, listCases, type CaseInfo, type Suite } from './cases.ts';
import { assertName, isRecord, isStringArray, readJson } from './guards.ts';

export interface SuiteSelect {
  readonly suite: string;
  readonly tags?: readonly string[];
  readonly cases?: readonly string[];
}

export interface Cell {
  readonly arm: string;
  readonly ref: string | null;
  readonly models: Readonly<Record<string, number>>;
  readonly suites: readonly SuiteSelect[];
}

// A recorded pass rate the run set reproduces. case-fired counts a case whose grader passed in at least half its runs
// (the old harness's "fired = rate >= 0.5"), case-quiet one whose grader passed in more than half (fired rate below
// 0.5), and run counts each run.
export interface RecordedCell {
  readonly label: string;
  readonly cell: string;
  readonly model: string;
  readonly suite: string;
  readonly tags?: readonly string[];
  readonly grader: string;
  readonly unit: 'case-fired' | 'case-quiet' | 'run';
  readonly passed: number;
  readonly total: number;
}

export interface RunSet {
  readonly dir: string;
  readonly name: string;
  readonly cells: readonly Cell[];
  readonly record: readonly RecordedCell[];
}

export interface PlannedRun {
  readonly runDir: string;
  readonly runSetName: string;
  readonly arm: string;
  readonly ref: string | null;
  readonly model: string;
  readonly suite: Suite;
  readonly caseInfo: CaseInfo;
  readonly k: number;
}

export type RunOutcome = 'done' | 'failed' | 'limit';

export interface GraderVerdict {
  readonly name: string;
  readonly passed: boolean;
  readonly scored: boolean;
}

export interface Tokens {
  readonly input: number;
  readonly output: number;
  readonly cacheRead: number;
  readonly cacheCreation: number;
}

// The packaged plugin's tree (null for a cell without a plugin) and the committed cases' trees a run was started on.
export interface Trees {
  readonly pluginTree: string | null;
  readonly casesTree: string | null;
}

export interface RunResult {
  readonly schemaVersion: 1;
  readonly backend: 'plugin-eval' | 'slim';
  readonly runSet: string;
  readonly arm: string;
  readonly ref: string | null;
  readonly pluginTree: string | null;
  readonly casesTree: string | null;
  readonly suite: string;
  readonly case: string;
  readonly k: number;
  readonly requestedModel: string;
  readonly initModel: string | null;
  readonly modelsUsed: readonly string[];
  readonly claudeCodeVersion: string | null;
  readonly binary: string;
  readonly startedAt: string;
  readonly seconds: number;
  readonly turns: number;
  readonly costUsd: number;
  readonly judgeCostUsd: number;
  readonly tokens: Tokens;
  readonly maxTurns: boolean;
  readonly graded: boolean;
  readonly arms: { readonly with: readonly GraderVerdict[]; readonly without: readonly GraderVerdict[] | null };
}

export function forwardSlashes(path: string): string {
  return resolve(path).replaceAll('\\', '/');
}

function selection(value: unknown, file: string): SuiteSelect {
  if (!isRecord(value) || typeof value['suite'] !== 'string') {
    throw new Error(`${file}: each suites entry needs a suite name`);
  }

  const { suite, tags, cases, ...rest } = value;

  if (Object.keys(rest).length > 0) {
    throw new Error(`${file}: unknown suites keys ${Object.keys(rest).join(', ')}`);
  }

  if ((tags !== undefined && !isStringArray(tags)) || (cases !== undefined && !isStringArray(cases))) {
    throw new Error(`${file}: suite ${suite} tags and cases must be lists of names`);
  }

  return {
    suite: assertName('suite', suite),
    ...(tags === undefined ? {} : { tags }),
    ...(cases === undefined ? {} : { cases: cases.map((name) => assertName('case', name)) }),
  };
}

function cell(value: unknown, file: string): Cell {
  if (!isRecord(value)) {
    throw new Error(`${file}: each cell must be a JSON object`);
  }

  const { arm, ref, models, suites, ...rest } = value;

  if (Object.keys(rest).length > 0) {
    throw new Error(`${file}: unknown cell keys ${Object.keys(rest).join(', ')}`);
  }

  if (typeof arm !== 'string') {
    throw new Error(`${file}: a cell needs an arm name`);
  }

  if (ref !== null && (typeof ref !== 'string' || !/^[0-9a-f]{40}$/.test(ref))) {
    throw new Error(`${file}: arm ${arm} ref must be a full 40-hex commit or null`);
  }

  if (!isRecord(models) || Object.keys(models).length === 0) {
    throw new Error(`${file}: arm ${arm} needs models with runs per model`);
  }

  const counts = Object.entries(models).map(([model, runs]): [string, number] => {
    if (typeof runs !== 'number' || !Number.isInteger(runs) || runs < 1) {
      throw new Error(`${file}: arm ${arm} model ${model} runs must be a positive whole number`);
    }

    return [assertName('model', model), runs];
  });

  if (!Array.isArray(suites) || suites.length === 0) {
    throw new Error(`${file}: arm ${arm} needs at least one suite`);
  }

  return {
    arm: assertName('arm', arm),
    ref,
    models: Object.fromEntries(counts),
    suites: suites.map((entry) => selection(entry, file)),
  };
}

function isCount(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0;
}

function recordedCell(value: unknown, file: string): RecordedCell {
  if (!isRecord(value)) {
    throw new Error(`${file}: each record entry must be a JSON object`);
  }

  const { label, cell: arm, model, suite, tags, grader, unit, passed, total, ...rest } = value;

  if (
    Object.keys(rest).length > 0 ||
    typeof label !== 'string' ||
    typeof arm !== 'string' ||
    typeof model !== 'string' ||
    typeof suite !== 'string' ||
    (tags !== undefined && !isStringArray(tags)) ||
    typeof grader !== 'string' ||
    (unit !== 'case-fired' && unit !== 'case-quiet' && unit !== 'run') ||
    !isCount(passed) ||
    !isCount(total) ||
    passed > total
  ) {
    throw new Error(`${file}: record entry ${JSON.stringify(label)} is malformed`);
  }

  return {
    label,
    cell: assertName('arm', arm),
    model: assertName('model', model),
    suite: assertName('suite', suite),
    ...(tags === undefined ? {} : { tags }),
    grader,
    unit,
    passed,
    total,
  };
}

export function readRunSet(dir: string): RunSet {
  const root = forwardSlashes(dir);
  const file = `${root}/run-set.json`;
  const value = readJson(file);

  if (!isRecord(value)) {
    throw new Error(`${file} is not a JSON object`);
  }

  const { cells, record = [], ...rest } = value;

  if (!Array.isArray(record)) {
    throw new Error(`${file}: record must be a list`);
  }

  if (Object.keys(rest).length > 0) {
    throw new Error(`${file}: unknown keys ${Object.keys(rest).join(', ')}`);
  }

  if (!Array.isArray(cells) || cells.length === 0) {
    throw new Error(`${file}: cells must be a non-empty list`);
  }

  const parsed = inFile(file, () => cells.map((entry) => cell(entry, file)));
  const arms = parsed.map(({ arm }) => arm);

  if (new Set(arms).size !== arms.length) {
    throw new Error(`${file}: two cells share an arm name`);
  }

  return {
    dir: root,
    name: assertName('run set', basename(root)),
    cells: parsed,
    record: inFile(file, () => record.map((entry) => recordedCell(entry, file))),
  };
}

// A bad name deep in a cell still names the file it came from.
function inFile<T>(file: string, read: () => T): T {
  try {
    return read();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    throw new Error(message.startsWith(file) ? message : `${file}: ${message}`);
  }
}

// recheck.json, written by `aggregate`: {"<arm>/<model>/<case>": runs}.
function readRecheck(runSetDir: string): Map<string, number> {
  const file = `${runSetDir}/recheck.json`;

  if (!existsSync(file)) {
    return new Map();
  }

  const value = readJson(file);

  if (!isRecord(value) || !Object.values(value).every((runs) => isCount(runs))) {
    throw new Error(`${file} must map <arm>/<model>/<case> to a run count`);
  }

  return new Map(Object.entries(value).flatMap(([key, runs]) => (typeof runs === 'number' ? [[key, runs]] : [])));
}

function selected(caseInfo: CaseInfo, select: SuiteSelect): boolean {
  const tagged = (select.tags ?? []).every((tag) => caseInfo.tags.includes(tag));
  const named = select.cases === undefined || select.cases.includes(caseInfo.name);

  return tagged && named;
}

// Every cell x model x selected case x k = 1..runs; a case recheck.json lists gets its recheck count when that is more
// (D-10: a case that passes on Sonnet and fails on Opus reruns on Opus at n=5 before it counts).
export function planRuns(runSet: RunSet, roots: readonly string[]): PlannedRun[] {
  const recheck = readRecheck(runSet.dir);
  const plan = runSet.cells.flatMap((entry) =>
    entry.suites.flatMap((select) => {
      const suite = findSuite(roots, select.suite);
      const cases = listCases(suite).filter((caseInfo) => selected(caseInfo, select));

      return Object.entries(entry.models).flatMap(([model, runs]) =>
        cases.flatMap((caseInfo) =>
          Array.from({ length: Math.max(runs, recheck.get(`${entry.arm}/${model}/${caseInfo.name}`) ?? 0) }, (_, index) => ({
            runDir: `${runSet.dir}/${entry.arm}/${model}/${caseInfo.name}/run-${String(index + 1)}`,
            runSetName: runSet.name,
            arm: entry.arm,
            ref: entry.ref,
            model,
            suite,
            caseInfo,
            k: index + 1,
          })),
        ),
      );
    }),
  );
  const owners = new Map<string, string>();

  for (const run of plan) {
    const owner = owners.get(run.runDir);

    if (owner !== undefined) {
      throw new Error(`two plan entries resolve to the run folder ${run.runDir} (suites ${owner} and ${run.suite.name}); a run folder is paid for once`);
    }

    owners.set(run.runDir, run.suite.name);
  }

  return plan;
}

export function resultPath(runDir: string): string {
  return `${runDir}/result.json`;
}

// The backend makes raw/ right before it spawns, so raw/ without a result is a run that died.
export function runState(runDir: string): 'done' | 'died' | 'new' {
  if (existsSync(resultPath(runDir))) {
    return 'done';
  }

  return existsSync(`${runDir}/raw`) ? 'died' : 'new';
}

// `run` starts only these, so raising a model's runs adds runs and leaves the finished ones alone.
export function newRuns(plan: readonly PlannedRun[]): PlannedRun[] {
  return plan.filter((run) => runState(run.runDir) === 'new');
}

// Runs that started and left no result: `run` refuses them until `rerun` (or `resume`, for slim) says what to do.
export function diedRuns(plan: readonly PlannedRun[]): PlannedRun[] {
  return plan.filter((run) => runState(run.runDir) === 'died');
}

// Moves what a rerun replaces into the first free set-aside-<n>, keeping its place below the root for a look later.
export function setAside(root: string, paths: readonly string[]): void {
  let number = 1;

  while (existsSync(`${root}/set-aside-${String(number)}`)) {
    number += 1;
  }

  paths
    .filter((path) => existsSync(path))
    .forEach((path) => {
      const aside = `${root}/set-aside-${String(number)}/${relative(root, path)}`;
      mkdirSync(dirname(aside), { recursive: true });
      renameSync(path, aside);
    });
}

// A rename is atomic, so a write killed halfway never leaves a result.json that reads as done.
export function writeResult(runDir: string, result: RunResult): void {
  const file = resultPath(runDir);

  if (existsSync(file)) {
    throw new Error(`${runDir} already has a result; a finished result is never overwritten`);
  }

  writeFileSync(`${file}.tmp`, `${JSON.stringify(result, null, 2)}\n`);
  renameSync(`${file}.tmp`, file);
}

export type Normalized =
  | { readonly outcome: 'done'; readonly result: RunResult }
  | { readonly outcome: 'failed' | 'limit'; readonly reason: string };

// Where a run's outcome lands on disk for both backends: result.json only when done, else raw/refused.txt with the
// reason and every raw file kept.
export function settleRun(runDir: string, normalized: Normalized, status: number | null): RunOutcome {
  if (normalized.outcome === 'done') {
    writeResult(runDir, normalized.result);

    return 'done';
  }

  mkdirSync(`${runDir}/raw`, { recursive: true });
  writeFileSync(`${runDir}/raw/refused.txt`, `exit ${String(status)}: ${normalized.reason}\n`);

  return normalized.outcome;
}

export function stageDir(stageRoot: string, ref: string): string {
  return `${stageRoot}/${ref.slice(0, 12)}`;
}

export interface Command {
  readonly file: string;
  readonly prefix: readonly string[];
}

// A .ts stand-in (the dry-run stubs) runs under this Node.js; anything else is the program itself.
export function scriptOrBinary(path: string): Command {
  return path.endsWith('.ts') ? { file: process.execPath, prefix: [path] } : { file: path, prefix: [] };
}

export interface RunOutcomeEntry {
  readonly run: PlannedRun;
  readonly outcome: RunOutcome;
}

// Starts the runs, `concurrency` at a time, and gives back each started run's outcome. After a usage-limit stop no
// worker takes a new run: every one would hit the same limit.
export async function runAll(
  runs: readonly PlannedRun[],
  concurrency: number,
  start: (run: PlannedRun) => Promise<RunOutcome>,
): Promise<RunOutcomeEntry[]> {
  const queue = [...runs];
  const outcomes: RunOutcomeEntry[] = [];
  const next = (): PlannedRun | undefined => (outcomes.some(({ outcome }) => outcome === 'limit') ? undefined : queue.shift());
  const worker = async (): Promise<void> => {
    for (let run = next(); run !== undefined; run = next()) {
      let outcome: RunOutcome;

      try {
        outcome = await start(run);
      } catch (error) {
        console.error(`${run.runDir}: ${error instanceof Error ? error.message : String(error)}`);
        outcome = 'failed';
      }

      console.log(`${run.runDir} ${outcome}`);
      outcomes.push({ run, outcome });
    }
  };
  await Promise.all(Array.from({ length: Math.min(concurrency, runs.length) }, worker));

  return outcomes;
}

// Stryker disable all: spawns a real process, which the unit tests leave to the dry run
// The child's output goes to files in raw/, so a run's evidence stays with the run and the console stays readable.
export function spawnLogged(command: Command, args: readonly string[], rawDir: string, log: string): Promise<number | null> {
  mkdirSync(rawDir, { recursive: true });
  const stdout = openSync(`${rawDir}/${log}.stdout.txt`, 'w');
  const stderr = openSync(`${rawDir}/${log}.stderr.txt`, 'w');

  return new Promise((done) => {
    const child = spawn(command.file, [...command.prefix, ...args], { stdio: ['ignore', stdout, stderr], windowsHide: true });
    let finished = false;
    // A spawn error is followed by close, and the files may be closed once only.
    const finish = (status: number | null): void => {
      if (finished) {
        return;
      }

      finished = true;
      closeSync(stdout);
      closeSync(stderr);
      done(status);
    };
    child.on('error', (error) => {
      writeFileSync(`${rawDir}/${log}.spawn-error.txt`, `${error.message}\n`);
      finish(null);
    });
    child.on('close', (status) => finish(status));
  });
}
// Stryker restore all
