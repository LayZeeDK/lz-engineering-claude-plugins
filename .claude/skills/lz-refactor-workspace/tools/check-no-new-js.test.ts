import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { after, test } from 'node:test';

import { findScriptViolations, listWorkspaceFiles, parseGrandfatherList } from './check-no-new-js.ts';

const workspace = '.claude/skills/lz-red-workspace';

test('reports a .mjs under a workspace that is not grandfathered', () => {
  assert.deepEqual(findScriptViolations([`${workspace}/new.mjs`], []), {
    added: [`${workspace}/new.mjs`],
    stale: [],
  });
});

test('reports a .js the same way and matches the extension case-insensitively', () => {
  const listed = [`${workspace}/b.js`, `${workspace}/c.MJS`, `${workspace}/a.Js`];

  assert.deepEqual(findScriptViolations(listed, []), {
    added: [`${workspace}/a.Js`, `${workspace}/b.js`, `${workspace}/c.MJS`],
    stale: [],
  });
});

test('passes a grandfathered path', () => {
  const path = `${workspace}/grade.mjs`;

  assert.deepEqual(findScriptViolations([path], [path]), { added: [], stale: [] });
});

test('ignores other extensions under a workspace', () => {
  const listed = ['x.ts', 'x.json', 'x.md', 'x.sh', 'x.py', 'x.mjs.map'].map((name) => `${workspace}/${name}`);

  assert.deepEqual(findScriptViolations(listed, []), { added: [], stale: [] });
});

test('ignores any path with a node_modules segment', () => {
  const listed = [`${workspace}/node_modules/dep/index.js`, `${workspace}/e2e/node_modules/x.mjs`];

  assert.deepEqual(findScriptViolations(listed, []), { added: [], stale: [] });
});

test('ignores .mjs and .js outside .claude/skills/*-workspace/', () => {
  const listed = ['plugins/lz-tdd/x.mjs', '.claude/skills/lz-red/scripts/x.mjs', '.claude/skills/x-workspace-old/y.mjs'];

  assert.deepEqual(findScriptViolations(listed, []), { added: [], stale: [] });
});

test('reports a grandfathered path that is no longer listed as stale', () => {
  const kept = `${workspace}/kept.mjs`;
  const gone = `${workspace}/gone.mjs`;

  assert.deepEqual(findScriptViolations([kept], [kept, gone]), { added: [], stale: [gone] });
});

test('parseGrandfatherList drops blank and # lines, trims entries, and accepts CRLF', () => {
  const text = '# header\r\n\r\n  a/b.mjs  \r\n# note\r\nc/d.js\r\n   \r\n';

  assert.deepEqual(parseGrandfatherList(text), ['a/b.mjs', 'c/d.js']);
});

const repo = mkdtempSync(join(tmpdir(), 'check-no-new-js-'));

after(() => rmSync(repo, { recursive: true, force: true }));

function git(...args: string[]): void {
  execFileSync('git', args, { cwd: repo, stdio: 'ignore' });
}

function write(path: string): void {
  const full = join(repo, path);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, '');
}

test('listWorkspaceFiles lists staged and untracked files but not ignored ones', () => {
  const ws = '.claude/skills/x-workspace';
  const staged = `${ws}/staged.mjs`;
  const untracked = `${ws}/untracked.mjs`;

  git('init', '--quiet');
  writeFileSync(join(repo, '.gitignore'), 'node_modules/\nresults/\n');
  write(staged);
  write(untracked);
  write(`${ws}/node_modules/dep/index.js`);
  write(`${ws}/results/out.mjs`);
  git('add', '--', staged);

  const listed = listWorkspaceFiles(repo);

  assert.ok(listed.includes(staged));
  assert.ok(listed.includes(untracked));
  assert.equal(
    listed.some((path) => path.includes('node_modules') || path.includes('results/')),
    false,
  );
  assert.deepEqual(findScriptViolations(listed, [staged]), { added: [untracked], stale: [] });
});
