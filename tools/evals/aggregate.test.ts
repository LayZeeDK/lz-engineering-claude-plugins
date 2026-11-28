import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, test } from 'node:test';

import { aggregate, recheckCases, renderResults, wilson } from './aggregate.ts';
import type { Suite } from './cases.ts';
import { writeResult, type GraderVerdict, type PlannedRun, type RecordedCell } from './run-set.ts';

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

interface SideRun {
  readonly arm: string;
  readonly ref: string | null;
  readonly model: string;
  readonly suite: Suite;
  readonly caseName: string;
  readonly with: readonly (readonly [string, boolean])[];
  readonly without?: readonly (readonly [string, boolean])[];
}

const graderText: Record<string, string> = {
  'skill-fired': '---\ntype: tool_used\ntool: Skill\n---\n',
  'wrote-test': '---\ntype: tool_used\ntool: Write\n---\n',
  'ran-tests': '---\ntype: tool_used\ntool: Bash\n---\n',
  quiet: "---\ntype: regex\npattern: '^'\n---\n",
};

function suiteOf(name: string, backend: Suite['backend'], ablation: Suite['ablation'], invokeTwin: string | null = null): Suite {
  return {
    name,
    dir: `${root}/cases/${name}`,
    backend,
    ablation,
    allowTools: [],
    scaffold: false,
    heavy: false,
    allow: null,
    timeoutMinutes: 15,
    invokeTwin,
    target: null,
    skill: null,
  };
}

// Writes each run's result.json and its case's grader files, and gives back the plan that names them.
function sideRunSet(name: string, specs: readonly SideRun[]): { setDir: string; plan: PlannedRun[] } {
  const setDir = `${root}/${name}`;
  const counter = new Map<string, number>();
  const plan = specs.map((spec): PlannedRun => {
    const key = `${spec.arm}/${spec.model}/${spec.caseName}`;
    const k = (counter.get(key) ?? 0) + 1;
    counter.set(key, k);
    const runDir = `${setDir}/${key}/run-${String(k)}`;
    const caseDir = `${spec.suite.dir}/${spec.caseName}`;
    mkdirSync(`${caseDir}/graders`, { recursive: true });

    for (const [grader] of [...spec.with, ...(spec.without ?? [])]) {
      writeFileSync(`${caseDir}/graders/${grader}.md`, graderText[grader] ?? '');
    }

    const verdicts = (list: readonly (readonly [string, boolean])[]): GraderVerdict[] =>
      list.map(([grader, passed]) => ({ name: grader, passed, scored: true }));
    mkdirSync(runDir, { recursive: true });
    writeResult(runDir, {
      schemaVersion: 1,
      backend: spec.suite.backend,
      runSet: name,
      arm: spec.arm,
      ref: spec.ref,
      pluginTree: null,
      casesTree: null,
      suite: spec.suite.name,
      case: spec.caseName,
      k,
      requestedModel: spec.model,
      initModel: spec.model,
      modelsUsed: [spec.model],
      claudeCodeVersion: null,
      binary: 'W:/bin/claude.exe',
      startedAt: '2026-11-25T00:00:00.000Z',
      seconds: 10,
      turns: 2,
      costUsd: 0.1,
      judgeCostUsd: 0,
      tokens: { input: 0, output: 0, cacheRead: 0, cacheCreation: 0 },
      maxTurns: false,
      graded: true,
      arms: { with: verdicts(spec.with), without: spec.without === undefined ? null : verdicts(spec.without) },
    });

    return {
      runDir,
      runSetName: name,
      arm: spec.arm,
      ref: spec.ref,
      model: spec.model,
      suite: spec.suite,
      caseInfo: { name: spec.caseName, dir: caseDir, tags: [], body: '' },
      k,
    };
  });

  return { setDir, plan };
}

const sha = '1'.repeat(40);

function times(count: number, make: (index: number) => SideRun): SideRun[] {
  return Array.from({ length: count }, (_, index) => make(index));
}

test('a with-without suite and its invoke twin get with and without rows, Wilson intervals and a verdict; Skill graders are left out', () => {
  const doing = suiteOf('doing-x', 'plugin-eval', 'with-without', 'doing-x-invoke');
  const twin = suiteOf('doing-x-invoke', 'plugin-eval', 'none');
  const trigger = suiteOf('trigger-x', 'plugin-eval', 'none');
  const { setDir, plan } = sideRunSet('with-without', [
    ...times(5, () => ({
      arm: 'head',
      ref: sha,
      model: sonnet,
      suite: doing,
      caseName: 'doing-x-01',
      with: [
        ['skill-fired', true],
        ['wrote-test', true],
      ],
      without: [['wrote-test', false]],
    })),
    ...times(5, (index) => ({ arm: 'head', ref: sha, model: sonnet, suite: twin, caseName: 'doing-x-invoke-01', with: [['wrote-test', index < 3]] })),
    ...times(2, () => ({ arm: 'head', ref: sha, model: sonnet, suite: trigger, caseName: 'trigger-x-01', with: [['skill-fired', true]] })),
  ]);
  const summary = aggregate(setDir, plan, { allowStub: false, record: [] });

  assert.deepEqual(summary.withWithout.verdicts, [
    { suite: 'doing-x', arm: 'head', verdict: 'discriminates' },
    { suite: 'doing-x-invoke', arm: 'head', verdict: 'does not discriminate' },
    { suite: 'trigger-x', arm: 'head', verdict: 'no without arm' },
  ]);
  assert.deepEqual(
    summary.withWithout.rows.map((row) => [row.suite, row.grader, row.with.passed, row.with.total, row.without.passed, row.without.total, row.overlap]),
    [
      ['doing-x', 'wrote-test', 5, 5, 0, 5, false],
      ['doing-x-invoke', 'wrote-test', 3, 5, 0, 5, true],
    ],
  );

  const text = renderResults(summary);
  const section = text.slice(text.indexOf('## With and without'));
  assert.match(section, /^\| doing-x \| head \| discriminates \|$/m);
  assert.match(section, /^\| doing-x-invoke \| head \| does not discriminate \|$/m);
  assert.match(section, /^\| trigger-x \| head \| no without arm \|$/m);
  assert.match(section, /^\| doing-x \| head \| claude-sonnet-5-5 \| wrote-test \| 5\/5 \| 0\/5 \| 1\.00 \| \[0\.566, 1\.000\] \| \[0\.000, 0\.434\] \| no \|$/m);
  assert.match(section, /^\| doing-x-invoke \| head \| claude-sonnet-5-5 \| wrote-test \| 3\/5 \| 0\/5 \| 0\.60 \| \[0\.231, 0\.882\] \| \[0\.000, 0\.434\] \| yes \|$/m);
  assert.doesNotMatch(section, /skill-fired/);
  assert.equal(text.indexOf('## With and without') > text.lastIndexOf('## Arm head'), true);
});

test('a slim suite takes its without side from the cell without a ref', () => {
  const apply = suiteOf('apply-x', 'slim', 'none');
  const { setDir, plan } = sideRunSet('slim-sides', [
    ...times(5, () => ({
      arm: 'head',
      ref: sha,
      model: opus,
      suite: apply,
      caseName: 'apply-x-01',
      with: [
        ['skill-fired', true],
        ['ran-tests', true],
      ],
    })),
    ...times(5, () => ({
      arm: 'no-plugin',
      ref: null,
      model: opus,
      suite: apply,
      caseName: 'apply-x-01',
      with: [
        ['skill-fired', false],
        ['ran-tests', true],
      ],
    })),
  ]);
  const summary = aggregate(setDir, plan, { allowStub: false, record: [] });

  assert.deepEqual(summary.withWithout.verdicts, [{ suite: 'apply-x', arm: 'head', verdict: 'does not discriminate' }]);
  assert.deepEqual(
    summary.withWithout.rows.map((row) => [row.suite, row.model, row.grader, row.with.passed, row.without.passed, row.delta]),
    [['apply-x', opus, 'ran-tests', 5, 5, 0]],
  );
});

test('two plugin arms on one suite are compared with the without side apart, never pooled', () => {
  const apply = suiteOf('apply-y', 'slim', 'none');
  const arm = (name: string, ref: string | null, passed: boolean): SideRun[] =>
    times(5, () => ({ arm: name, ref, model: opus, suite: apply, caseName: 'apply-y-01', with: [['ran-tests', passed]] }));
  const { setDir, plan } = sideRunSet('two-arms', [...arm('head', sha, true), ...arm('base', '2'.repeat(40), false), ...arm('no-plugin', null, false)]);
  const summary = aggregate(setDir, plan, { allowStub: false, record: [] });

  assert.deepEqual(summary.withWithout.verdicts, [
    { suite: 'apply-y', arm: 'head', verdict: 'discriminates' },
    { suite: 'apply-y', arm: 'base', verdict: 'does not discriminate' },
  ]);
  assert.deepEqual(
    summary.withWithout.rows.map((row) => [row.suite, row.arm, row.grader, row.with.passed, row.with.total, row.without.passed, row.without.total]),
    [
      ['apply-y', 'head', 'ran-tests', 5, 5, 0, 5],
      ['apply-y', 'base', 'ran-tests', 0, 5, 0, 5],
    ],
  );
});

test('a with-without suite in two plugin arms compares each arm with the without arm of its own runs', () => {
  const doing = suiteOf('doing-z', 'plugin-eval', 'with-without');
  const arm = (name: string, ref: string, without: boolean): SideRun[] =>
    times(5, () => ({ arm: name, ref, model: opus, suite: doing, caseName: 'doing-z-01', with: [['wrote-test', true]], without: [['wrote-test', without]] }));
  const { setDir, plan } = sideRunSet('two-ablated-arms', [...arm('head', sha, false), ...arm('base', '2'.repeat(40), true)]);
  const summary = aggregate(setDir, plan, { allowStub: false, record: [] });

  assert.deepEqual(
    summary.withWithout.rows.map((row) => [row.arm, row.with.passed, row.without.passed, row.without.total, row.overlap]),
    [
      ['head', 5, 0, 5, false],
      ['base', 5, 5, 5, true],
    ],
  );
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
