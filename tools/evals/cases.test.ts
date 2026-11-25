import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { after, test } from 'node:test';

import { evalRepo, evalsRoots, findSuite, listCases, readCaseYaml, readFrontmatter, readSuite } from './cases.ts';

const root = mkdtempSync(join(tmpdir(), 'lz-evals-cases-')).replaceAll('\\', '/');

after(() => rmSync(root, { recursive: true, force: true }));

function put(path: string, text: string): void {
  mkdirSync(join(path, '..'), { recursive: true });
  writeFileSync(path, text);
}

test('readFrontmatter reads scalars, quoted strings, numbers, booleans and flow lists', () => {
  const text = [
    '---',
    'tags: [forward, "held out", \'x\']',
    'max_turns: 3',
    'scored: false',
    "input_match: '\"skill\"\\s*:\\s*''lz-tpp'''",
    'name: plain-value',
    'quoted: "a\\"b"',
    'empty: []',
    '---',
    '',
    'Make the test pass.',
    '',
  ].join('\r\n');

  assert.deepEqual(readFrontmatter(text), {
    data: {
      tags: ['forward', 'held out', 'x'],
      max_turns: 3,
      scored: false,
      input_match: `"skill"\\s*:\\s*'lz-tpp'`,
      name: 'plain-value',
      quoted: 'a"b',
      empty: [],
    },
    body: 'Make the test pass.\n',
  });
});

test('readFrontmatter gives the whole text as body when there is no frontmatter', () => {
  assert.deepEqual(readFrontmatter('Just a prompt.\n'), { data: {}, body: 'Just a prompt.\n' });
});

test('readFrontmatter throws, naming the line, on YAML the harness cannot read', () => {
  const lines = ['tags:\n  - a', 'nested:\n  key: value', 'x: |', "x: 'open", 'x: a: b', 'x: {a: 1}', '- a'];

  assert.deepEqual(
    lines.map((line) => {
      try {
        readFrontmatter(`---\n${line}\n---\nbody\n`);

        return 'read';
      } catch (error) {
        return error instanceof Error && error.message.includes('frontmatter') ? 'refused' : 'other';
      }
    }),
    lines.map(() => 'refused'),
  );
  assert.throws(() => readFrontmatter('---\ntags: [a]\n'), /no closing/);
});

test('readSuite fills defaults and refuses unknown keys and bad values', () => {
  put(`${root}/suites/demo/suite.json`, '{"backend":"plugin-eval"}');
  put(`${root}/suites/bad-key/suite.json`, '{"backend":"slim","heavyy":true}');
  put(`${root}/suites/bad-backend/suite.json`, '{"backend":"other"}');
  put(`${root}/suites/bad-timeout/suite.json`, '{"backend":"slim","timeoutMinutes":0}');

  assert.deepEqual(readSuite(`${root}/suites/demo`), {
    name: 'demo',
    dir: `${root}/suites/demo`,
    backend: 'plugin-eval',
    ablation: 'none',
    allowTools: [],
    scaffold: false,
    heavy: false,
    allow: null,
    timeoutMinutes: 15,
    invokeTwin: null,
    target: null,
  });
  assert.throws(() => readSuite(`${root}/suites/bad-key`), /unknown keys heavyy/);
  assert.throws(() => readSuite(`${root}/suites/bad-backend`), /backend must be/);
  assert.throws(() => readSuite(`${root}/suites/bad-timeout`), /timeoutMinutes/);

  put(`${root}/suites/kata/suite.json`, '{"backend":"slim","target":"gilded-rose-ts"}');
  put(`${root}/suites/pe-target/suite.json`, '{"backend":"plugin-eval","target":"gilded-rose-ts"}');
  put(`${root}/suites/bad-target/suite.json`, '{"backend":"slim","target":"../kata"}');
  assert.equal(readSuite(`${root}/suites/kata`).target, 'gilded-rose-ts');
  assert.throws(() => readSuite(`${root}/suites/pe-target`), /target has the wrong type/);
  assert.throws(() => readSuite(`${root}/suites/bad-target`), /template name/);
});

test('evalsRoots names both suite roots, and evalRepo honours LZ_EVAL_REPO', () => {
  assert.deepEqual(evalsRoots('W:/repo'), ['W:/repo/evals/lz-tdd', 'W:/repo/evals/lz-tdd-apply']);
  assert.match(evalRepo({ LZ_EVAL_REPO: root }), /lz-evals-cases-/);
  assert.equal(evalRepo({}), resolve(import.meta.dirname, '..', '..').replaceAll('\\', '/'));
});

test('findSuite finds one suite by name and throws on none or two', () => {
  const roots = [`${root}/r1`, `${root}/r2`];
  put(`${root}/r1/only/suite.json`, '{"backend":"plugin-eval"}');
  put(`${root}/r1/twice/suite.json`, '{"backend":"plugin-eval"}');
  put(`${root}/r2/twice/suite.json`, '{"backend":"slim"}');

  assert.equal(findSuite(roots, 'only').name, 'only');
  assert.throws(() => findSuite(roots, 'missing'), /found 0/);
  assert.throws(() => findSuite(roots, 'twice'), /found 2/);
});

test('listCases lists case folders with prompt.md, with their tags, and refuses a name without the suite prefix', () => {
  put(`${root}/l/demo/suite.json`, '{"backend":"plugin-eval"}');
  put(`${root}/l/demo/demo-02/prompt.md`, 'Second.\n');
  put(`${root}/l/demo/demo-01/prompt.md`, '---\ntags: [a, b]\n---\nFirst.\n');
  mkdirSync(`${root}/l/demo/fixtures`, { recursive: true });

  assert.deepEqual(
    listCases(readSuite(`${root}/l/demo`)).map(({ name, tags, body }) => ({ name, tags, body })),
    [
      { name: 'demo-01', tags: ['a', 'b'], body: 'First.\n' },
      { name: 'demo-02', tags: [], body: 'Second.\n' },
    ],
  );

  put(`${root}/l/demo/other-01/prompt.md`, 'Stray.\n');
  assert.throws(() => listCases(readSuite(`${root}/l/demo`)), /must start with demo-/);
});

test('readCaseYaml reads schema_version, name, tags and context.scaffold_script, and names any other line', () => {
  const text = 'schema_version: "1.1"\nname: real-demo\ntags: [real, shape]\ncontext:\n  scaffold_script: checkout.sh\n';

  assert.deepEqual(readCaseYaml(text), {
    schemaVersion: '1.1',
    name: 'real-demo',
    tags: ['real', 'shape'],
    scaffoldScript: 'checkout.sh',
  });
  assert.deepEqual(readCaseYaml('name: bare\n'), { schemaVersion: null, name: 'bare', tags: [], scaffoldScript: null });
  assert.throws(() => readCaseYaml('name: x\ngraders:\n  - a\n'), /line 2 "graders:"/);
  assert.throws(() => readCaseYaml('context:\n  history_file: h.jsonl\n'), /line 2 " {2}history_file: h.jsonl"/);
  assert.throws(() => readCaseYaml('  scaffold_script: s.sh\n'), /line 1/);
  assert.throws(() => readCaseYaml('name: a\nname: b\n'), /line 2/);
  assert.throws(() => readCaseYaml('tags: real\n'), /tags must be a flow list/);
});
