// Counts the graders' verdicts over a run set's result.json files and renders RESULTS.md, which names suites, cases,
// graders and numbers only, never a path. Repository-only; nothing here ships with the plugin.
import { existsSync } from 'node:fs';
import { basename } from 'node:path';
import { isRecord, isStringArray, readJson } from './guards.ts';
import { resultPath, type GraderVerdict, type PlannedRun } from './run-set.ts';

export interface ResultFacts {
  readonly binary: string;
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

export interface Summary {
  readonly runSet: string;
  readonly planned: number;
  readonly rows: readonly RunRow[];
  readonly cells: readonly CellLine[];
  readonly counts: readonly GraderCount[];
}

export interface AggregateOptions {
  readonly allowStub: boolean;
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

  return {
    runSet: basename(runSetDir),
    planned: plan.length,
    rows,
    cells: cellLines(rows),
    counts: graderCounts(rows),
  };
}

export function renderResults(summary: Summary): string {
  const lines = [`# Run set ${summary.runSet}`, ''];

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
