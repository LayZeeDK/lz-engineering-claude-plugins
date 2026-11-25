import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, test } from 'node:test';

import { aggregate, recheckCases, renderResults, wilson } from './aggregate.ts';
import { writeResult, type PlannedRun, type RecordedCell } from './run-set.ts';

const root = mkdtempSync(join(tmpdir(), 'lz-evals-aggregate-')).replaceAll('\\', '/');

after(() => rmSync(root, { recursive: true, force: true }));

const sonnet = 'claude-sonnet-5-5';
const opus = 'claude-opus-5-5';

interface RunSpec {
  readonly model: string;
  readonly caseName: string;
  readonly verdicts: readonly (readonly [string, boolean])[];
  readonly tags?: readonly string[];
  readonly casesTree?: string | null;
  readonly binary?: string;
  readonly written?: boolean;
}

// Writes one result.json per spec (k counts up per model and case) and gives back the plan that names them.
function runSet(name: string, specs: readonly RunSpec[]): { setDir: string; plan: PlannedRun[] } {
  const setDir = `${root}/${name}`;
  const counter = new Map<string, number>();
  const plan = specs.map((spec): PlannedRun => {
    const key = `${spec.model}/${spec.caseName}`;
    const k = (counter.get(key) ?? 0) + 1;
    counter.set(key, k);
    const runDir = `${setDir}/head/${spec.model}/${spec.caseName}/run-${String(k)}`;
    const run: PlannedRun = {
      runDir,
      runSetName: name,
      arm: 'head',
      ref: '0'.repeat(40),
      model: spec.model,
      suite: {
        name: 'trigger-x',
        dir: 'W:/repo/evals/lz-tdd/trigger-x',
        backend: 'plugin-eval',
        ablation: 'none',
        allowTools: [],
        scaffold: false,
        heavy: false,
        allow: null,
        timeoutMinutes: 15,
        invokeTwin: null,
        target: null,
        skill: null,
      },
      caseInfo: { name: spec.caseName, dir: `W:/repo/evals/lz-tdd/trigger-x/${spec.caseName}`, tags: spec.tags ?? [], body: '' },
      k,
    };

    if (spec.written !== false) {
      mkdirSync(runDir, { recursive: true });
      writeResult(runDir, {
        schemaVersion: 1,
        backend: 'plugin-eval',
        runSet: name,
        arm: 'head',
        ref: run.ref,
        pluginTree: null,
        casesTree: spec.casesTree ?? null,
        suite: 'trigger-x',
        case: spec.caseName,
        k,
        requestedModel: spec.model,
        initModel: spec.model,
        modelsUsed: [spec.model],
        claudeCodeVersion: '2.1.327',
        binary: spec.binary ?? 'W:/bin/claude.exe',
        startedAt: '2026-11-25T00:00:00.000Z',
        seconds: 10,
        turns: 2,
        costUsd: 0.1,
        judgeCostUsd: 0.02,
        tokens: { input: 0, output: 0, cacheRead: 0, cacheCreation: 0 },
        maxTurns: false,
        graded: true,
        arms: { with: spec.verdicts.map(([grader, passed]) => ({ name: grader, passed, scored: true })), without: null },
      });
    }

    return run;
  });

  return { setDir, plan };
}

function runs(model: string, caseName: string, outcomes: readonly boolean[], tags: readonly string[] = []): RunSpec[] {
  return outcomes.map((passed) => ({ model, caseName, tags, verdicts: [['skill-fired', passed]] }));
}

const round = (value: number): number => Math.round(value * 1000) / 1000;

test('wilson gives the 95% interval of a pass rate', () => {
  assert.deepEqual(
    [wilson(13, 13), wilson(0, 0), wilson(3, 3), wilson(0, 5)].map(([low, high]) => [round(low), round(high)]),
    [
      [0.772, 1],
      [0, 1],
      [0.439, 1],
      [0, 0.434],
    ],
  );
});

test('recheckCases lists a case that passes on Sonnet and fails on Opus with fewer than 5 Opus runs', () => {
  const { setDir, plan } = runSet('recheck', [
    ...runs(sonnet, 'trigger-x-01', [true, true, true, false, true]),
    ...runs(opus, 'trigger-x-01', [false, true, false]),
    ...runs(sonnet, 'trigger-x-02', [true, true, true]),
    ...runs(opus, 'trigger-x-02', [true, true, false]),
    ...runs(sonnet, 'trigger-x-03', [false, false, true]),
    ...runs(opus, 'trigger-x-03', [false, false, false]),
    ...runs(sonnet, 'trigger-x-04', [true, true]),
    ...runs(opus, 'trigger-x-04', [false, false, false, false, true]),
  ]);

  assert.deepEqual(recheckCases(aggregate(setDir, plan, { allowStub: false, record: [] })), {
    [`head/${opus}/trigger-x-01`]: 5,
  });
});

test('a recorded cell reports the reproduced k/m and whether it lies inside the recorded Wilson interval', () => {
  const { setDir, plan } = runSet('record', [
    ...runs(sonnet, 'trigger-x-01', [true, true, false], ['b']),
    ...runs(sonnet, 'trigger-x-02', [true, false], ['b']),
    ...runs(sonnet, 'trigger-x-03', [false, false], []),
  ]);
  const recorded = (unit: RecordedCell['unit'], passed: number, total: number, tags?: readonly string[]): RecordedCell => ({
    label: `recorded ${unit}`,
    cell: 'head',
    model: sonnet,
    suite: 'trigger-x',
    ...(tags === undefined ? {} : { tags }),
    grader: 'skill-fired',
    unit,
    passed,
    total,
  });
  const summary = aggregate(setDir, plan, {
    allowStub: false,
    record: [
      recorded('case-fired', 13, 13, ['b']),
      recorded('case-quiet', 1, 2, ['b']),
      recorded('run', 13, 13),
      recorded('case-fired', 2, 3),
    ],
  });

  assert.deepEqual(
    summary.comparisons.map(({ reproduced, inside }) => [reproduced.passed, reproduced.total, inside]),
    [
      [2, 2, true],
      [1, 2, true],
      [3, 7, false],
      [2, 3, true],
    ],
  );

  const text = renderResults(summary);
  assert.match(text, /\| recorded case-fired \| 13\/13 \[0\.772, 1\.000\] \| 2\/2 \| inside \|/);
  assert.match(text, /\| recorded run \| 13\/13 \[0\.772, 1\.000\] \| 3\/7 \| outside \|/);
});

test('RESULTS.md names the ref, the models that ran, runs, cost and wall clock, and a partial line when runs are missing', () => {
  const { setDir, plan } = runSet('render', [
    ...runs(sonnet, 'trigger-x-01', [true, false]),
    { model: sonnet, caseName: 'trigger-x-01', verdicts: [], written: false },
  ]);
  const text = renderResults(aggregate(setDir, plan, { allowStub: false, record: [] }));

  assert.match(text, /- Ref: 0{40}/);
  assert.match(text, /- claude-sonnet-5-5: 2 runs; models that ran \(CLI output\): claude-sonnet-5-5/);
  assert.match(text, /- Cost \(agent plus judge\): \$0\.24/);
  assert.match(text, /- Wall clock \(summed\): 20 s/);
  assert.match(text, /\| trigger-x \| with \| claude-sonnet-5-5 \| skill-fired \| 1\/2 \|/);
  assert.match(text, /partial: 2 of 3 planned runs have results/);
  assert.doesNotMatch(text, /W:|[/\\]head[/\\]/);
});

test('aggregate refuses stub results without allowStub and a cell whose results come from two case trees', () => {
  const stubbed = runSet('stubbed', [{ model: sonnet, caseName: 'trigger-x-01', verdicts: [], binary: 'W:/tools/evals/stubs.ts' }]);
  assert.throws(() => aggregate(stubbed.setDir, stubbed.plan, { allowStub: false, record: [] }), /dry-run stub/);
  assert.equal(aggregate(stubbed.setDir, stubbed.plan, { allowStub: true, record: [] }).rows.length, 1);

  const mixed = runSet('mixed', [
    { model: sonnet, caseName: 'trigger-x-01', verdicts: [], casesTree: 'a'.repeat(40) },
    { model: sonnet, caseName: 'trigger-x-01', verdicts: [], casesTree: 'b'.repeat(40) },
  ]);
  assert.throws(() => aggregate(mixed.setDir, mixed.plan, { allowStub: false, record: [] }), /case trees/);
});
