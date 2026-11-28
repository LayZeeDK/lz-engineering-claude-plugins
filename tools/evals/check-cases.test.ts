import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, test } from 'node:test';

import { graderKey, lintCases } from './check-cases.ts';
import type { GraderDef } from './grade.ts';

const root = mkdtempSync(join(tmpdir(), 'lz-evals-check-cases-')).replaceAll('\\', '/');

after(() => rmSync(root, { recursive: true, force: true }));

function put(path: string, text: string): void {
  mkdirSync(join(path, '..'), { recursive: true });
  writeFileSync(path, text);
}

const skillFired = ['type: tool_used', 'tool: Skill', `input_match: '"skill"\\s*:\\s*"(?:[\\w-]+:)?lz-red"'`];
const wrote = ['type: tool_used', 'tool: Write', "input_match: 'a\\.test\\.ts'"];

function graderFile(path: string, lines: readonly string[]): void {
  put(path, ['---', ...lines, '---', '', 'What this grader checks.', ''].join('\n'));
}

function promptFile(path: string, body: string, frontmatter: readonly string[] = ['tags: [doing]', 'max_turns: 3']): void {
  put(path, ['---', ...frontmatter, '---', '', body].join('\n'));
}

function fixture(path: string, grader: Record<string, unknown>, pass: unknown, fail: unknown): void {
  put(path, `${JSON.stringify({ grader, pass, fail }, null, 2)}\n`);
}

const skillCall = (skill: string): unknown => ({ toolCalls: [{ name: 'Skill', input: { skill } }], lastMessage: '' });
const writeCall = (path: string): unknown => ({ toolCalls: [{ name: 'Write', input: { file_path: path } }], lastMessage: '' });

let count = 0;

// A clean evals/ tree in a fresh git repository: a doing suite with its invoke twin, a slim suite on a template with a
// scaffold script, and one fixture per grader definition.
function cleanRepo(): string {
  count += 1;
  const repo = `${root}/repo-${String(count)}`;
  const lz = `${repo}/evals/lz-tdd`;
  put(`${lz}/doing-x/suite.json`, '{"backend":"plugin-eval","skill":"lz-red","invokeTwin":"doing-x-invoke"}\n');
  promptFile(`${lz}/doing-x/doing-x-01/prompt.md`, 'write a test.\n');
  graderFile(`${lz}/doing-x/doing-x-01/graders/skill-fired.md`, skillFired);
  graderFile(`${lz}/doing-x/doing-x-01/graders/wrote.md`, wrote);
  put(`${lz}/doing-x-invoke/suite.json`, '{"backend":"plugin-eval","skill":"lz-red"}\n');
  promptFile(`${lz}/doing-x-invoke/doing-x-invoke-01/prompt.md`, '/lz-tdd:lz-red write a test.\n');
  graderFile(`${lz}/doing-x-invoke/doing-x-invoke-01/graders/wrote.md`, wrote);
  const apply = `${repo}/evals/lz-tdd-apply`;
  put(`${apply}/templates.json`, '{"kata": {}}\n');
  put(`${apply}/apply-x/suite.json`, '{"backend":"slim","target":"kata"}\n');
  promptFile(`${apply}/apply-x/apply-x-01/prompt.md`, 'Work in D:/tmp/kata please.\n');
  put(`${apply}/apply-x/apply-x-01/case.yaml`, 'schema_version: "1.1"\ncontext:\n  scaffold_script: scaffold.sh\n');
  put(`${apply}/apply-x/apply-x-01/scaffold.sh`, 'echo ok\n');
  graderFile(`${apply}/apply-x/apply-x-01/graders/wrote.md`, wrote);
  const fixtures = `${repo}/evals/fixtures/graders`;
  fixture(
    `${fixtures}/skill-fired-lz-red.json`,
    { type: 'tool_used', tool: 'Skill', inputMatch: '"skill"\\s*:\\s*"(?:[\\w-]+:)?lz-red"' },
    skillCall('lz-tdd:lz-red'),
    skillCall('lz-tdd:lz-tpp'),
  );
  fixture(
    `${fixtures}/wrote-a-test.json`,
    { type: 'tool_used', tool: 'Write', inputMatch: 'a\\.test\\.ts' },
    writeCall('D:\\tmp\\w\\a.test.ts'),
    writeCall('D:\\tmp\\w\\b.test.ts'),
  );
  spawnSync('git', ['init', '-q', repo], { windowsHide: true });

  return repo;
}

function problems(repo: string): readonly string[] {
  return lintCases(repo).problems;
}

function expectProblem(repo: string, pattern: RegExp): void {
  const found = problems(repo);
  assert.ok(
    found.some((problem) => pattern.test(problem)),
    `expected a problem matching ${String(pattern)}, got:\n${found.join('\n')}`,
  );
}

test('lintCases on a clean tree finds no problems and counts suites, cases, graders and fixtures', () => {
  const report = lintCases(cleanRepo());

  assert.deepEqual(report, { problems: [], suites: 3, cases: 3, graders: 2, fixtures: 2 });
});

test('graderKey ignores the grader name and orders the fields', () => {
  const def: GraderDef = {
    name: 'a',
    type: 'regex',
    pattern: 'x',
    flags: '',
    tool: null,
    inputMatch: null,
    min: 1,
    max: null,
    arm: null,
    target: 'last_message',
  };

  assert.equal(graderKey(def), graderKey({ ...def, name: 'b' }));
  assert.equal(
    graderKey(def),
    '{"arm":null,"flags":"","inputMatch":null,"max":null,"min":1,"pattern":"x","target":"last_message","tool":null,"type":"regex"}',
  );
});

test('a prompt.md frontmatter key the loader refuses, or model or runs, is a problem naming the file and key', () => {
  for (const key of ['context: x', 'model: claude-opus-5-5', 'runs: 3']) {
    const repo = cleanRepo();
    promptFile(`${repo}/evals/lz-tdd/doing-x/doing-x-01/prompt.md`, 'write a test.\n', ['tags: [doing]', key]);
    const name = key.split(':')[0] ?? '';

    expectProblem(repo, new RegExp(`doing-x-01/prompt\\.md: frontmatter key ${name}\\b`));
  }
});

test('a case not named after its suite, and one name in two suites, are problems', () => {
  const repo = cleanRepo();
  promptFile(`${repo}/evals/lz-tdd/doing-x/other-01/prompt.md`, 'x\n');
  expectProblem(repo, /other-01.*must start with doing-x-/);

  const twice = cleanRepo();
  put(`${twice}/evals/lz-tdd/doing/suite.json`, '{"backend":"plugin-eval"}\n');
  promptFile(`${twice}/evals/lz-tdd/doing/doing-x-01/prompt.md`, 'x\n');
  expectProblem(twice, /doing-x-01 is in two suites/);
});

test('a non-ASCII byte, a foreign email-shaped token or an absolute path outside D:/tmp/ is a problem naming file and line', () => {
  const ascii = cleanRepo();
  put(`${ascii}/evals/notes.md`, `ok\nsmart ${String.fromCharCode(0x2019)} quote\n`);
  expectProblem(ascii, /evals\/notes\.md:2: non-ASCII byte/);

  const email = cleanRepo();
  // Built at run time so this file holds no email-shaped token but the public contact.
  put(`${email}/evals/notes.md`, `contact larsbrinknielsen@gmail.com\nor someone${'@'}example.org\n`);
  assert.deepEqual(
    problems(email).filter((problem) => problem.includes('notes.md')),
    ['evals/notes.md:2: an email-shaped token other than the public contact'],
  );

  for (const path of ['C:/Users/x/file.ts', 'D:\\\\projects\\\\x', '/home/x/y', 'D:/tmpx/y']) {
    const abs = cleanRepo();
    put(`${abs}/evals/notes.md`, `fine D:/tmp/a and D:\\\\tmp\\\\b\nbad ${path}\n`);
    assert.deepEqual(
      problems(abs).filter((problem) => problem.includes('notes.md')),
      ['evals/notes.md:2: absolute path outside D:/tmp/'],
      path,
    );
  }
});

test('an ignored file under evals/ is not read', () => {
  const repo = cleanRepo();
  put(`${repo}/.gitignore`, 'evals/results/*/runs/\n');
  put(`${repo}/evals/results/set/runs/x.json`, `${String.fromCharCode(0x2019)}\n`);

  assert.deepEqual(problems(repo), []);
});

test('a grader with no fixture, or a fixture whose pass fails or whose fail passes, is a problem naming the grader', () => {
  const missing = cleanRepo();
  rmSync(`${missing}/evals/fixtures/graders/wrote-a-test.json`);
  expectProblem(missing, /wrote .*has no fixture.*a\\\\\.test/);

  const passFails = cleanRepo();
  fixture(
    `${passFails}/evals/fixtures/graders/wrote-a-test.json`,
    { type: 'tool_used', tool: 'Write', inputMatch: 'a\\.test\\.ts' },
    writeCall('D:\\tmp\\w\\c.test.ts'),
    writeCall('D:\\tmp\\w\\b.test.ts'),
  );
  expectProblem(passFails, /wrote-a-test\.json: .*pass evidence fails/);

  const failPasses = cleanRepo();
  fixture(
    `${failPasses}/evals/fixtures/graders/wrote-a-test.json`,
    { type: 'tool_used', tool: 'Write', inputMatch: 'a\\.test\\.ts' },
    writeCall('D:\\tmp\\w\\a.test.ts'),
    writeCall('D:\\tmp\\w\\a.test.ts'),
  );
  expectProblem(failPasses, /wrote-a-test\.json: .*fail evidence passes/);
});

test('a fixture for a target: trace regex grader is graded on the trace text of its evidence', () => {
  const repo = cleanRepo();
  const traced = (path: string): unknown => ({
    toolCalls: [],
    lastMessage: '',
    trace: `${JSON.stringify({ type: 'tool_use', name: 'Write', input: { file_path: path, content: 'x' } })}\n`,
  });
  const grader = { type: 'regex', pattern: '"name":"(?:Edit|Write)","input":\\{[^{}]*?a\\.ts"', target: 'trace' };
  fixture(`${repo}/evals/fixtures/graders/wrote-a-trace.json`, grader, traced('D:\\tmp\\w\\a.ts'), traced('D:\\tmp\\w\\b.ts'));
  assert.deepEqual(problems(repo), []);

  fixture(`${repo}/evals/fixtures/graders/wrote-a-trace.json`, grader, traced('D:\\tmp\\w\\b.ts'), traced('D:\\tmp\\w\\b.ts'));
  expectProblem(repo, /wrote-a-trace\.json: the pass evidence fails/);
});

test('a natural case without its twin, a twin prompt that is not the invoke plus the body, or wrong twin graders, are problems', () => {
  const noTwin = cleanRepo();
  rmSync(`${noTwin}/evals/lz-tdd/doing-x-invoke/doing-x-invoke-01`, { recursive: true });
  expectProblem(noTwin, /doing-x-01 has no twin doing-x-invoke-01/);

  const badPrompt = cleanRepo();
  promptFile(`${badPrompt}/evals/lz-tdd/doing-x-invoke/doing-x-invoke-01/prompt.md`, '/lz-tdd:lz-red write two tests.\n');
  expectProblem(badPrompt, /doing-x-invoke-01: prompt must be "\/lz-tdd:lz-red " followed by the doing-x-01 prompt/);

  const keptSkill = cleanRepo();
  graderFile(`${keptSkill}/evals/lz-tdd/doing-x-invoke/doing-x-invoke-01/graders/skill-fired.md`, skillFired);
  expectProblem(keptSkill, /doing-x-invoke-01: graders must be the doing-x-01 graders minus its lz-red Skill graders/);

  const dropped = cleanRepo();
  rmSync(`${dropped}/evals/lz-tdd/doing-x-invoke/doing-x-invoke-01/graders/wrote.md`);
  expectProblem(dropped, /doing-x-invoke-01: graders must be/);
});

test('a missing scaffold script and a slim suite whose target is not a template are problems', () => {
  const noScript = cleanRepo();
  rmSync(`${noScript}/evals/lz-tdd-apply/apply-x/apply-x-01/scaffold.sh`);
  expectProblem(noScript, /apply-x-01: scaffold_script scaffold\.sh is missing/);

  const noTarget = cleanRepo();
  put(`${noTarget}/evals/lz-tdd-apply/apply-x/suite.json`, '{"backend":"slim","target":"other"}\n');
  expectProblem(noTarget, /apply-x: target other is not in templates\.json/);
});

test('a grader naming two tools is a problem in a plugin-eval suite, where the CLI takes one tool name', () => {
  const repo = cleanRepo();
  const either = ['type: tool_used', "tool: 'Edit|Write'", "input_match: 'a\\.test\\.ts'"];
  graderFile(`${repo}/evals/lz-tdd/doing-x/doing-x-01/graders/wrote.md`, either);
  expectProblem(repo, /doing-x-01: grader wrote names tools Edit\|Write, which only a slim suite can grade/);
});

test('a target: trace grader is a problem in a slim suite, which has no plugin-eval trace', () => {
  const repo = cleanRepo();
  graderFile(`${repo}/evals/lz-tdd-apply/apply-x/apply-x-01/graders/wrote.md`, ['type: regex', "pattern: 'a\\.test\\.ts'", 'target: trace']);
  expectProblem(repo, /apply-x-01: grader wrote targets the trace, which only a plugin-eval suite can grade/);
});

test('an unreadable suite.json or grader is a problem, not a crash', () => {
  const repo = cleanRepo();
  put(`${repo}/evals/lz-tdd/doing-x/suite.json`, '{"backend":"plugin-eval","skil":"lz-red"}\n');
  graderFile(`${repo}/evals/lz-tdd-apply/apply-x/apply-x-01/graders/judge.md`, ['type: llm']);

  expectProblem(repo, /unknown keys skil/);
  expectProblem(repo, /judge\.md: grader type llm/);
});
