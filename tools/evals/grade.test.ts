import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, test } from 'node:test';

import type { Suite } from './cases.ts';
import { crosscheckRunSet, gradeRun, readGrader, runEvidence, sessionTranscripts, traceEvidence, type GraderDef } from './grade.ts';
import type { PlannedRun, RunResult } from './run-set.ts';
import { projectFolder } from './slim.ts';
import { caseTarget } from './stage.ts';
import { toolCalls, type ToolCall } from './trace.ts';

const root = mkdtempSync(join(tmpdir(), 'lz-evals-grade-')).replaceAll('\\', '/');

after(() => rmSync(root, { recursive: true, force: true }));

const sessionA = '11111111-2222-4333-8444-555555555555';
const sessionB = '66666666-7777-4888-9999-aaaaaaaaaaaa';

function put(path: string, text: string): void {
  mkdirSync(join(path, '..'), { recursive: true });
  writeFileSync(path, text);
}

function grader(name: string, lines: readonly string[]): GraderDef {
  const file = `${root}/graders/${name}.md`;
  put(file, ['---', ...lines, '---', '', 'What this grader checks.', ''].join('\n'));

  return readGrader(file);
}

function call(name: string, input: unknown, id = `t-${name}-${JSON.stringify(input).length}`): ToolCall {
  return { id, name, input, isError: false, denied: false, exitCode: null };
}

function lines(entries: readonly unknown[]): string {
  return `${entries.map((entry) => JSON.stringify(entry)).join('\n')}\n`;
}

function toolUse(id: string, name: string, input: unknown): unknown[] {
  return [
    { type: 'assistant', message: { content: [{ type: 'tool_use', id, name, input }] } },
    { type: 'user', message: { content: [{ type: 'tool_result', tool_use_id: id, content: 'ok' }] } },
  ];
}

const skillFired = ['type: tool_used', 'tool: Skill', 'input_match: \'"skill"\\s*:\\s*"(?:[\\w-]+:)?lz-red"\''];

test('readGrader reads tool_used and regex graders with their defaults, named after the file', () => {
  assert.deepEqual(grader('skill-fired', skillFired), {
    name: 'skill-fired',
    type: 'tool_used',
    pattern: null,
    flags: '',
    tool: 'Skill',
    inputMatch: '"skill"\\s*:\\s*"(?:[\\w-]+:)?lz-red"',
    min: 1,
    max: null,
    arm: null,
  });
  assert.deepEqual(grader('quiet', ['type: tool_used', 'tool: Skill', 'min: 0', 'max: 0', 'arm: both']), {
    name: 'quiet',
    type: 'tool_used',
    pattern: null,
    flags: '',
    tool: 'Skill',
    inputMatch: null,
    min: 0,
    max: 0,
    arm: 'both',
  });
  assert.deepEqual(grader('red-line', ['type: regex', "pattern: 'RED: [^\\n]+ -- fails: [^\\n]+\\s*$'", 'flags: i']), {
    name: 'red-line',
    type: 'regex',
    pattern: 'RED: [^\\n]+ -- fails: [^\\n]+\\s*$',
    flags: 'i',
    tool: null,
    inputMatch: null,
    min: 1,
    max: null,
    arm: null,
  });
});

test('readGrader refuses a type or key the model does not hold, naming the file', () => {
  assert.throws(() => grader('judge', ['type: llm']), /judge\.md.*type llm/);
  assert.throws(() => grader('made', ['type: file_exists', 'path: x.ts']), /made\.md.*type file_exists/);
  assert.throws(() => grader('weighted', ['type: regex', 'pattern: x', 'weight: 2']), /weighted\.md.*weight/);
  assert.throws(() => grader('target', ['type: regex', 'pattern: x', 'target: trace']), /target\.md.*target/);
  assert.throws(() => grader('no-tool', ['type: tool_used']), /no-tool\.md.*tool/);
  assert.throws(() => grader('no-pattern', ['type: regex']), /no-pattern\.md.*pattern/);
  assert.throws(() => grader('bad-min', ['type: tool_used', 'tool: Read', 'min: -1']), /bad-min\.md.*min/);
});

test('readGrader refuses a pattern that is not a valid regex with its flags, naming the file', () => {
  assert.throws(() => grader('bad-pattern', ['type: regex', "pattern: 'a{'", 'flags: u']), /bad-pattern\.md.*pattern is not a valid regex/);
});

test('readGrader refuses an input_match that is not a valid regex, naming the file', () => {
  assert.throws(() => grader('bad-input', ['type: tool_used', 'tool: Edit', "input_match: 'src[\\\\/]+(a'"]), /bad-input\.md.*input_match is not a valid regex/);
});

test('readGrader refuses a min above max, which no run can pass', () => {
  assert.throws(() => grader('never', ['type: tool_used', 'tool: Edit', 'min: 2', 'max: 1']), /never\.md.*min 2 is above max 1/);
});

test('tool_used counts calls of the tool whose JSON input matches, between min and max', () => {
  const fired = grader('fired', skillFired);
  const quiet = grader('quiet-red', [...skillFired, 'min: 0', 'max: 0', 'arm: both']);
  const twice = grader('twice', ['type: tool_used', 'tool: Edit', 'min: 2']);
  const red = call('Skill', { skill: 'lz-tdd:lz-red' });
  const redTeam = call('Skill', { skill: 'lz-tdd:lz-red-team' });
  const bare = call('Skill', { skill: 'lz-red' });
  const verdicts = (calls: readonly ToolCall[]): boolean[] =>
    gradeRun([fired, quiet, twice], { calls, lastMessage: '' }).map(({ passed }) => passed);

  assert.deepEqual(verdicts([red]), [true, false, false]);
  assert.deepEqual(verdicts([bare]), [true, false, false]);
  assert.deepEqual(verdicts([redTeam]), [false, true, false]);
  assert.deepEqual(verdicts([]), [false, true, false]);
  assert.deepEqual(verdicts([call('Edit', { a: 1 }, 'e1'), call('Edit', { a: 2 }, 'e2'), call('Read', { skill: 'lz-tdd:lz-red' })]), [false, true, true]);
  assert.deepEqual(
    gradeRun([fired], { calls: [red], lastMessage: '' }),
    [{ name: 'fired', passed: true, scored: true }],
  );
});

test('a tool_used grader naming two tools as Edit|Write counts a matching call of either', () => {
  const testFile = ['type: tool_used', "tool: 'Edit|Write'", "input_match: '[\\\\/]+test[\\\\/]+[^\"]*\\.ts\"'"];
  const editedTest = grader('edited-test', testFile);
  const passed = (name: string, path: string): boolean =>
    gradeRun([editedTest], { calls: [call(name, { file_path: path })], lastMessage: '' })[0]?.passed ?? false;

  assert.equal(passed('Write', 'D:\\tmp\\srvx\\test\\static.test.ts'), true);
  assert.equal(passed('Edit', 'D:/tmp/srvx/test/static.test.ts'), true);
  assert.equal(passed('Write', 'D:/tmp/srvx/src/static.ts'), false);
  assert.equal(passed('Read', 'D:/tmp/srvx/test/static.test.ts'), false);
  assert.equal(passed('MultiEdit|Write', 'D:/tmp/srvx/test/static.test.ts'), false);
});

test('a path-tail input_match matches a Windows path and a forward-slash path in the JSON-encoded input', () => {
  const leaf = grader('leaf-read', ['type: tool_used', 'tool: Read', "input_match: 'references[\\\\/]+transformations\\.md'", 'arm: with-only']);
  const read = (path: string): boolean => gradeRun([leaf], { calls: [call('Read', { file_path: path })], lastMessage: '' })[0]?.passed ?? false;

  assert.equal(read('C:\\x\\skills\\lz-tpp\\references\\transformations.md'), true);
  assert.equal(read('references/transformations.md'), true);
  assert.equal(read('C:\\x\\skills\\lz-tpp\\SKILL.md'), false);
});

test('regex tests the last message only, so a report line followed by another paragraph does not match', () => {
  const redLine = grader('red', ['type: regex', "pattern: 'RED: [^\\n]+ -- fails: [^\\n]+\\s*$'"]);
  const passes = (lastMessage: string): boolean => gradeRun([redLine], { calls: [], lastMessage })[0]?.passed ?? false;

  assert.equal(passes('Wrote the test.\n\nRED: next -- fails: x'), true);
  assert.equal(passes('RED: next -- fails: x\n'), true);
  assert.equal(passes('RED: next -- fails: x\n\nAnything else?'), false);
  assert.equal(passes('red: next -- fails: x'), false);
  assert.equal(gradeRun([grader('red-i', ['type: regex', 'pattern: red', 'flags: i'])], { calls: [], lastMessage: 'RED' })[0]?.passed, true);
});

test('a Bash call that ran the tests is a tool_used grader over the transcript', () => {
  const ranTests = grader('ran-tests', ['type: tool_used', 'tool: Bash', "input_match: 'vitest|npm (?:run )?test'"]);
  const entries = [
    ...toolUse('b1', 'Bash', { command: 'git status' }),
    ...toolUse('b2', 'Bash', { command: 'node node_modules/vitest/vitest.mjs run test/vitest' }),
  ];

  assert.equal(gradeRun([ranTests], { calls: toolCalls(entries), lastMessage: '' })[0]?.passed, true);
  assert.equal(gradeRun([ranTests], { calls: toolCalls(entries.slice(0, 2)), lastMessage: '' })[0]?.passed, false);
});

test('sessionTranscripts lists the main transcript and every subagent transcript of the session', () => {
  const projects = `${root}/projects-list`;
  const folder = `${projects}/${projectFolder('S:/run')}`;
  put(`${folder}/${sessionA}.jsonl`, '{}\n');
  put(`${folder}/${sessionA}/subagents/agent-b.jsonl`, '{}\n');
  put(`${folder}/${sessionA}/subagents/agent-a.jsonl`, '{}\n');
  put(`${folder}/${sessionA}/subagents/agent-a.meta.json`, '{}\n');

  assert.deepEqual(sessionTranscripts(projects, 'S:/run', sessionA), [
    `${folder}/${sessionA}.jsonl`,
    `${folder}/${sessionA}/subagents/agent-a.jsonl`,
    `${folder}/${sessionA}/subagents/agent-b.jsonl`,
  ]);
});

function slimOut(session: string, text: string, cwd: string): string {
  const result = { type: 'result', is_error: false, session_id: session, result: text, modelUsage: {} };

  return JSON.stringify({ cwd, args: [], prompt: 'x', status: 0, ms: 1, stdout: JSON.stringify(result), stderr: '' });
}

test('runEvidence reads every session of a slim run with its subagents, once per tool call, and the latest reply', () => {
  const projects = `${root}/projects-evidence`;
  const cwd = 'S:/slim/runs/set-abc';
  const folder = `${projects}/${projectFolder(cwd)}`;
  const runDir = `${root}/evidence-run`;
  put(`${runDir}/raw/result.json`, slimOut(sessionA, 'stopped', cwd));
  put(`${runDir}/raw/result-resume-1.json`, slimOut(sessionB, 'RED: next -- fails: x', cwd));
  put(`${folder}/${sessionA}.jsonl`, lines([...toolUse('s1', 'Skill', { skill: 'lz-tdd:lz-red' })]));
  // A resume that forks a new session repeats the earlier messages; the repeat counts once.
  put(`${folder}/${sessionB}.jsonl`, lines([...toolUse('s1', 'Skill', { skill: 'lz-tdd:lz-red' }), ...toolUse('w1', 'Write', { file_path: 'a.spec.ts' })]));
  put(`${folder}/${sessionB}/subagents/agent-x.jsonl`, lines(toolUse('r1', 'Read', { file_path: 'references/transformations.md' })));

  const evidence = runEvidence(runDir, projects);
  assert.deepEqual(
    evidence.calls.map(({ id, name }) => `${id}:${name}`),
    ['s1:Skill', 'w1:Write', 'r1:Read'],
  );
  assert.equal(evidence.lastMessage, 'RED: next -- fails: x');

  const missing = `${root}/evidence-missing`;
  put(`${missing}/raw/result.json`, slimOut('77777777-7777-4777-8777-777777777777', 'done', cwd));
  assert.throws(() => runEvidence(missing, projects), /no transcript for session 77777777-7777-4777-8777-777777777777/);
});

function failedUse(id: string, name: string, input: unknown, content: string): unknown[] {
  return [
    { type: 'assistant', message: { content: [{ type: 'tool_use', id, name, input }] } },
    { type: 'user', message: { content: [{ type: 'tool_result', tool_use_id: id, content, is_error: true }] } },
  ];
}

function slimEvidence(name: string, entries: readonly unknown[]): string[] {
  const projects = `${root}/projects-${name}`;
  const cwd = `S:/slim/runs/${name}`;
  const runDir = `${root}/${name}-run`;
  put(`${runDir}/raw/result.json`, slimOut(sessionA, 'done', cwd));
  put(`${projects}/${projectFolder(cwd)}/${sessionA}.jsonl`, lines(entries));

  return runEvidence(runDir, projects).calls.map(({ id }) => id);
}

test('runEvidence leaves out a slim call whose result is an error, such as an Edit that changed nothing', () => {
  const entries = [
    ...toolUse('e1', 'Edit', { file_path: 'test/a.test.ts' }),
    ...failedUse('e2', 'Edit', { file_path: 'test/b.test.ts' }, '<tool_use_error>String to replace not found in file.</tool_use_error>'),
  ];

  assert.deepEqual(slimEvidence('failed-edit', entries), ['e1']);
});

test('runEvidence keeps a slim command that ran and exited non-zero, such as a test run with a failing test', () => {
  const entries = [
    ...failedUse('b1', 'Bash', { command: 'npx vitest run' }, 'Exit code 1\n FAIL  test/a.test.ts > adds'),
    ...failedUse('b2', 'Bash', { command: 'npx jest' }, 'This command requires approval'),
  ];

  assert.deepEqual(slimEvidence('exited', entries), ['b1']);
});

test('runEvidence leaves out a slim call that a permission decision rejected, with or without an error result', () => {
  const entries = [
    { type: 'assistant', message: { content: [{ type: 'tool_use', id: 'w1', name: 'Write', input: { file_path: 'src/a.ts' } }] } },
    { type: 'user', permissionDecision: { decision: 'reject' }, message: { content: [{ type: 'tool_result', tool_use_id: 'w1', content: 'denied' }] } },
    ...toolUse('w2', 'Write', { file_path: 'test/a.test.ts' }),
  ];

  assert.deepEqual(slimEvidence('rejected', entries), ['w2']);
});

test('traceEvidence keeps every plugin-eval call, failed or refused, as the CLI counts them', () => {
  const entries = [
    ...failedUse('e1', 'Edit', { file_path: 'a.ts' }, 'String to replace not found in file.'),
    ...failedUse('w1', 'Write', { file_path: 'b.ts' }, 'Permission to use Write has been denied.'),
  ];

  assert.deepEqual(traceEvidence(entries).calls.map(({ id }) => id), ['e1', 'w1']);
});

function plannedRun(runDir: string, caseName: string): PlannedRun {
  const suite: Suite = {
    name: 'trigger-red',
    dir: `${root}/repo/evals/lz-tdd/trigger-red`,
    backend: 'plugin-eval',
    ablation: 'with-without',
    allowTools: [],
    scaffold: false,
    heavy: false,
    allow: null,
    timeoutMinutes: 15,
    invokeTwin: null,
    target: null,
    skill: null,
  };

  return {
    runDir,
    runSetName: 'set',
    arm: 'head',
    ref: 'a'.repeat(40),
    model: 'claude-sonnet-5-5',
    suite,
    caseInfo: { name: caseName, dir: `${suite.dir}/${caseName}`, tags: [], body: 'x' },
    k: 1,
  };
}

function trace(entries: readonly unknown[], text: string): string {
  return lines([
    { type: 'system', subtype: 'init', model: 'claude-sonnet-5-5' },
    ...entries,
    { type: 'result', subtype: 'success', is_error: false, result: text },
  ]);
}

const staged = 'cases-a+cases-b';

function pluginResult(run: PlannedRun, withVerdicts: Record<string, boolean>, withoutVerdicts: Record<string, boolean>): RunResult {
  const verdicts = (map: Record<string, boolean>): RunResult['arms']['with'] =>
    Object.entries(map).map(([name, passed]) => ({ name, passed, scored: true }));

  return {
    schemaVersion: 1,
    backend: 'plugin-eval',
    runSet: 'set',
    arm: run.arm,
    ref: run.ref,
    pluginTree: null,
    casesTree: staged,
    suite: run.suite.name,
    case: run.caseInfo.name,
    k: run.k,
    requestedModel: run.model,
    initModel: run.model,
    modelsUsed: [run.model],
    claudeCodeVersion: null,
    binary: 'W:/bin/claude.exe',
    startedAt: '',
    seconds: 0,
    turns: 1,
    costUsd: 0,
    judgeCostUsd: 0,
    tokens: { input: 0, output: 0, cacheRead: 0, cacheCreation: 0 },
    maxTurns: false,
    graded: true,
    arms: { with: verdicts(withVerdicts), without: verdicts(withoutVerdicts) },
  };
}

test('crosscheckRunSet agrees with the CLI on its own traces, lists a flipped verdict, and counts a run without a trace', () => {
  const stageRoot = `${root}/stage`;
  const caseDir = (name: string): string => `${caseTarget(stageRoot, 'a'.repeat(40), staged)}/evals/${name}`;
  const runs = ['trigger-red-01', 'trigger-red-02', 'trigger-red-03'].map((name) => plannedRun(`${root}/set/head/m/${name}/run-1`, name));

  for (const run of runs) {
    put(`${caseDir(run.caseInfo.name)}/graders/fired.md`, ['---', ...skillFired, '---', ''].join('\n'));
    put(`${caseDir(run.caseInfo.name)}/graders/red-line.md`, ['---', 'type: regex', "pattern: 'RED: [^\\n]+ -- fails: [^\\n]+\\s*$'", '---', ''].join('\n'));
  }

  const fired = toolUse('s1', 'Skill', { skill: 'lz-tdd:lz-red' });
  const [agree, flipped, untraced] = runs;
  assert.ok(agree !== undefined && flipped !== undefined && untraced !== undefined);

  put(`${agree.runDir}/raw/trace-with.jsonl`, trace(fired, 'RED: a -- fails: b'));
  put(`${agree.runDir}/raw/trace-without.jsonl`, trace([], 'I would write a test.'));
  put(`${agree.runDir}/result.json`, JSON.stringify(pluginResult(agree, { fired: true, 'red-line': true }, { fired: false, 'red-line': false })));

  put(`${flipped.runDir}/raw/trace-with.jsonl`, trace(fired, 'RED: a -- fails: b'));
  put(`${flipped.runDir}/raw/trace-without.jsonl`, trace([], 'No.'));
  put(`${flipped.runDir}/result.json`, JSON.stringify(pluginResult(flipped, { fired: true, 'red-line': false }, { fired: false, 'red-line': false })));

  put(`${untraced.runDir}/result.json`, JSON.stringify(pluginResult(untraced, { fired: true }, {})));

  const report = crosscheckRunSet(runs, stageRoot);
  assert.equal(report.agree, 7);
  assert.deepEqual(report.disagree, [{ caseName: 'trigger-red-02', run: flipped.runDir, side: 'with', grader: 'red-line', cli: false, model: true }]);
  assert.deepEqual(report.unchecked.map(({ run }) => run), [untraced.runDir]);
  assert.match(report.unchecked[0]?.reason ?? '', /trace-with\.jsonl/);

  assert.deepEqual(crosscheckRunSet([agree], stageRoot), { agree: 4, disagree: [], unchecked: [] });
});

test('crosscheckRunSet leaves a run unchecked when no stage holds the cases tree its result records', () => {
  const stageRoot = `${root}/stage-other-tree`;
  const run = plannedRun(`${root}/set-other/head/m/trigger-red-01/run-1`, 'trigger-red-01');
  put(`${caseTarget(stageRoot, 'a'.repeat(40), 'later+tree')}/evals/trigger-red-01/graders/fired.md`, ['---', ...skillFired, '---', ''].join('\n'));
  put(`${run.runDir}/raw/trace-with.jsonl`, trace(toolUse('s1', 'Skill', { skill: 'lz-tdd:lz-red' }), 'x'));
  put(`${run.runDir}/result.json`, JSON.stringify(pluginResult(run, { fired: true }, {})));

  const report = crosscheckRunSet([run], stageRoot);
  assert.deepEqual([report.agree, report.unchecked.length], [0, 1]);
  assert.match(report.unchecked[0]?.reason ?? '', /no stage holds the cases tree cases-a\+cases-b/);
});
