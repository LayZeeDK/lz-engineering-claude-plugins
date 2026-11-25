// Counts the graders' verdicts over a run set's result.json files and renders RESULTS.md, which names suites, cases,
// graders and numbers only, never a path. Repository-only; nothing here ships with the plugin.
import { existsSync } from 'node:fs';
import { basename } from 'node:path';
import { isRecord, isStringArray, readJson } from './guards.ts';
import { resultPath, type GraderVerdict, type PlannedRun, type RecordedCell } from './run-set.ts';

export interface ResultFacts {
  readonly binary: string;
  readonly casesTree: string | null;
  readonly modelsUsed: readonly string[];
  readonly costUsd: number;
  readonly judgeCostUsd: number;
  readonly seconds: number;
  readonly with: readonly GraderVerdict[];
  readonly without: readonly GraderVerdict[] | null;
}

function verdictList(value: unknown): GraderVerdict[] | null {
  if (!Array.isArray(value)) {
    return null;
  }

  const parsed = value.flatMap((entry) =>
    isRecord(entry) && typeof entry['name'] === 'string' && typeof entry['passed'] === 'boolean'
      ? [{ name: entry['name'], passed: entry['passed'], scored: entry['scored'] !== false }]
      : [],
  );

  return parsed.length === value.length ? parsed : null;
}

export function readResultFacts(file: string): ResultFacts {
  const value = readJson(file);
  const arms = isRecord(value) ? value['arms'] : null;
  const withVerdicts = isRecord(arms) ? verdictList(arms['with']) : null;
  const without = isRecord(arms) ? arms['without'] : undefined;
  const withoutVerdicts = without === null ? null : verdictList(without);

  if (
    !isRecord(value) ||
    value['schemaVersion'] !== 1 ||
    typeof value['binary'] !== 'string' ||
    (value['casesTree'] !== null && typeof value['casesTree'] !== 'string') ||
    !isStringArray(value['modelsUsed']) ||
    typeof value['costUsd'] !== 'number' ||
    typeof value['judgeCostUsd'] !== 'number' ||
    typeof value['seconds'] !== 'number' ||
    withVerdicts === null ||
    (without !== null && withoutVerdicts === null)
  ) {
    throw new Error(`${file} is not a result in the harness schema`);
  }

  return {
    binary: value['binary'],
    casesTree: typeof value['casesTree'] === 'string' ? value['casesTree'] : null,
    modelsUsed: value['modelsUsed'],
    costUsd: value['costUsd'],
    judgeCostUsd: value['judgeCostUsd'],
    seconds: value['seconds'],
    with: withVerdicts,
    without: withoutVerdicts,
  };
}

export interface RunRow {
  readonly run: PlannedRun;
  readonly facts: ResultFacts;
}

export interface GraderCount {
  readonly arm: string;
  readonly suite: string;
  readonly side: 'with' | 'without';
  readonly model: string;
  readonly grader: string;
  readonly passed: number;
  readonly total: number;
}

export interface CellModel {
  readonly model: string;
  readonly runs: number;
  readonly used: readonly string[];
}

export interface CellLine {
  readonly arm: string;
  readonly ref: string | null;
  readonly models: readonly CellModel[];
  readonly costUsd: number;
  readonly seconds: number;
}

export interface Comparison {
  readonly record: RecordedCell;
  readonly interval: readonly [number, number];
  readonly reproduced: { readonly passed: number; readonly total: number };
  readonly inside: boolean;
}

export interface Summary {
  readonly runSet: string;
  readonly planned: number;
  readonly rows: readonly RunRow[];
  readonly cells: readonly CellLine[];
  readonly counts: readonly GraderCount[];
  readonly comparisons: readonly Comparison[];
}

export interface AggregateOptions {
  readonly allowStub: boolean;
  readonly record: readonly RecordedCell[];
}

// The 95% Wilson score interval of passed/total; [0, 1] when nothing ran. z is the exact 97.5% normal quantile: the
// rounded 1.96 moves some bounds in the third decimal (3/3 gives 0.438 instead of 0.439).
export function wilson(passed: number, total: number, z = 1.959964): readonly [number, number] {
  if (total === 0) {
    return [0, 1];
  }

  const p = passed / total;
  const z2 = z * z;
  const centre = (p + z2 / (2 * total)) / (1 + z2 / total);
  const half = (z * Math.sqrt((p * (1 - p)) / total + z2 / (4 * total * total))) / (1 + z2 / total);

  return [Math.max(0, centre - half), Math.min(1, centre + half)];
}

interface CaseRate {
  readonly key: string;
  readonly passed: number;
  readonly runs: number;
}

// Per arm, model and case: the runs whose `passes` verdict held.
function caseRates(rows: readonly RunRow[], passes: (row: RunRow) => boolean | null): CaseRate[] {
  const rates = new Map<string, CaseRate>();

  for (const row of rows) {
    const passed = passes(row);

    if (passed === null) {
      continue;
    }

    const key = `${row.run.arm}/${row.run.model}/${row.run.caseInfo.name}`;
    const before = rates.get(key) ?? { key, passed: 0, runs: 0 };
    rates.set(key, { key, passed: before.passed + (passed ? 1 : 0), runs: before.runs + 1 });
  }

  return [...rates.values()];
}

const sonnet = 'claude-sonnet-5-5';
const opus = 'claude-opus-5-5';

// A run passes when every verdict of its with side passed. A case that passes on Sonnet and fails on Opus with fewer
// than 5 Opus runs gets 5 Opus runs before it counts (D-10).
export function recheckCases(summary: Summary): Record<string, number> {
  const rates = caseRates(summary.rows, ({ facts }) => facts.with.every((verdict) => verdict.passed));
  const rateOf = (key: string): CaseRate | undefined => rates.find((rate) => rate.key === key);
  const listed = rates.flatMap(({ key, passed, runs }) => {
    const [arm, model, caseName] = key.split('/');
    const onSonnet = rateOf(`${String(arm)}/${sonnet}/${String(caseName)}`);

    return model === opus && passed / runs < 0.5 && runs < 5 && onSonnet !== undefined && onSonnet.passed / onSonnet.runs >= 0.5
      ? [[key, 5] as const]
      : [];
  });

  return Object.fromEntries(listed);
}

function compare(rows: readonly RunRow[], record: RecordedCell): Comparison {
  const matching = rows.filter(
    ({ run }) =>
      run.arm === record.cell &&
      run.model === record.model &&
      run.suite.name === record.suite &&
      (record.tags ?? []).every((tag) => run.caseInfo.tags.includes(tag)),
  );
  const rates = caseRates(matching, ({ facts }) => facts.with.find((verdict) => verdict.name === record.grader)?.passed ?? null);
  const counted = (rate: CaseRate): boolean => {
    if (record.unit === 'case-fired') {
      return rate.passed / rate.runs >= 0.5;
    }

    return rate.passed / rate.runs > 0.5;
  };
  const reproduced =
    record.unit === 'run'
      ? { passed: rates.reduce((total, rate) => total + rate.passed, 0), total: rates.reduce((total, rate) => total + rate.runs, 0) }
      : { passed: rates.filter(counted).length, total: rates.length };
  const interval = wilson(record.passed, record.total);
  const share = reproduced.total === 0 ? null : reproduced.passed / reproduced.total;

  return { record, interval, reproduced, inside: share !== null && share >= interval[0] && share <= interval[1] };
}

// A result made by a dry-run stub must never be recorded as a real one.
export function isStubBinary(binary: string): boolean {
  return basename(binary.replaceAll('\\', '/')) === 'stubs.ts';
}

function unique<T>(values: readonly T[]): T[] {
  return [...new Set(values)];
}

function cellLines(rows: readonly RunRow[]): CellLine[] {
  return unique(rows.map(({ run }) => run.arm)).map((arm) => {
    const inArm = rows.filter(({ run }) => run.arm === arm);

    return {
      arm,
      ref: inArm[0]?.run.ref ?? null,
      models: unique(inArm.map(({ run }) => run.model)).map((model) => {
        const ran = inArm.filter(({ run }) => run.model === model);

        return { model, runs: ran.length, used: unique(ran.flatMap(({ facts }) => facts.modelsUsed)).sort() };
      }),
      costUsd: inArm.reduce((total, { facts }) => total + facts.costUsd + facts.judgeCostUsd, 0),
      seconds: inArm.reduce((total, { facts }) => total + facts.seconds, 0),
    };
  });
}

function graderCounts(rows: readonly RunRow[]): GraderCount[] {
  const counts = new Map<string, GraderCount>();

  for (const { run, facts } of rows) {
    const sides: { side: 'with' | 'without'; verdicts: readonly GraderVerdict[] }[] = [
      { side: 'with', verdicts: facts.with },
      ...(facts.without === null ? [] : [{ side: 'without' as const, verdicts: facts.without }]),
    ];

    for (const { side, verdicts } of sides) {
      for (const verdict of verdicts) {
        const key = JSON.stringify([run.arm, run.suite.name, side, run.model, verdict.name]);
        const before = counts.get(key) ?? {
          arm: run.arm,
          suite: run.suite.name,
          side,
          model: run.model,
          grader: verdict.name,
          passed: 0,
          total: 0,
        };
        counts.set(key, { ...before, passed: before.passed + (verdict.passed ? 1 : 0), total: before.total + 1 });
      }
    }
  }

  return [...counts.values()];
}

export function aggregate(runSetDir: string, plan: readonly PlannedRun[], options: AggregateOptions): Summary {
  const rows = plan
    .filter((run) => existsSync(resultPath(run.runDir)))
    .map((run) => ({ run, facts: readResultFacts(resultPath(run.runDir)) }));
  const stubbed = rows.filter(({ facts }) => isStubBinary(facts.binary));

  if (stubbed.length > 0 && !options.allowStub) {
    throw new Error(
      `${String(stubbed.length)} results were made by a dry-run stub; pass --allow-stub only for a dry run`,
    );
  }

  // One cell's numbers must all come from one set of cases, or they compare different tests.
  for (const arm of unique(rows.map(({ run }) => run.arm))) {
    const trees = unique(rows.filter(({ run }) => run.arm === arm).map(({ facts }) => facts.casesTree));

    if (trees.length > 1) {
      throw new Error(`arm ${arm} has results from ${String(trees.length)} case trees; rerun the stale runs`);
    }
  }

  return {
    runSet: basename(runSetDir),
    planned: plan.length,
    rows,
    cells: cellLines(rows),
    counts: graderCounts(rows),
    comparisons: options.record.map((record) => compare(rows, record)),
  };
}

const fixed = (value: number): string => value.toFixed(3);

export function renderResults(summary: Summary): string {
  const lines = [`# Run set ${summary.runSet}`, ''];

  if (summary.rows.length < summary.planned) {
    lines.push(`partial: ${String(summary.rows.length)} of ${String(summary.planned)} planned runs have results`, '');
  }

  if (summary.comparisons.length > 0) {
    lines.push(
      '## Recorded cells',
      '',
      '| Record | Recorded k/n [95% Wilson] | Reproduced k/m | Verdict |',
      '|---|---|---|---|',
      ...summary.comparisons.map(
        ({ record, interval, reproduced, inside }) =>
          `| ${record.label} | ${String(record.passed)}/${String(record.total)} [${fixed(interval[0])}, ${fixed(interval[1])}] | ${String(reproduced.passed)}/${String(reproduced.total)} | ${inside ? 'inside' : 'outside'} |`,
      ),
      '',
    );
  }

  for (const line of summary.cells) {
    lines.push(
      `## Arm ${line.arm}`,
      '',
      `- Ref: ${line.ref ?? 'none (no plugin)'}`,
      ...line.models.map(
        (model) =>
          `- ${model.model}: ${String(model.runs)} runs; models that ran (CLI output): ${model.used.join(', ') || 'none'}`,
      ),
      `- Cost (agent plus judge): $${line.costUsd.toFixed(2)}`,
      `- Wall clock (summed): ${String(Math.round(line.seconds))} s`,
      '',
      '| Suite | Side | Model | Grader | Passed |',
      '|---|---|---|---|---|',
      ...summary.counts
        .filter((count) => count.arm === line.arm)
        .map(
          (count) =>
            `| ${count.suite} | ${count.side} | ${count.model} | ${count.grader} | ${String(count.passed)}/${String(count.total)} |`,
        ),
      '',
    );
  }

  return `${lines.join('\n').trimEnd()}\n`;
}
