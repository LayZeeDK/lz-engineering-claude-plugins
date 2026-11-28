import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { after, test } from 'node:test';

import { findScriptViolations, listWorkspaceFiles, parseGrandfatherList } from './check-no-new-js.ts';

// git ranks these above cwd, so an inherited value (a git hook sets them) would aim the scratch-repo calls,
// listWorkspaceFiles included, at the real repository or its index.
for (const key of ['GIT_DIR', 'GIT_WORK_TREE', 'GIT_INDEX_FILE', 'GIT_OBJECT_DIRECTORY', 'GIT_COMMON_DIR']) {
  delete process.env[key];
}

const workspace = '.claude/skills/lz-red-workspace';

test('reports a .mjs under a workspace that is not grandfathered', () => {
  assert.deepEqual(findScriptViolations([`${workspace}/new.mjs`], []), {
    added: [`${workspace}/new.mjs`],
    stale: [],
  });
});

test('reports a .js or .cjs the same way and matches the extension case-insensitively', () => {
  const listed = [`${workspace}/b.js`, `${workspace}/c.MJS`, `${workspace}/a.Js`, `${workspace}/x.cjs`, `${workspace}/y.CJS`];

  assert.deepEqual(findScriptViolations(listed, []), {
    added: [`${workspace}/a.Js`, `${workspace}/b.js`, `${workspace}/c.MJS`, `${workspace}/x.cjs`, `${workspace}/y.CJS`],
    stale: [],
  });
});

test('passes a grandfathered path', () => {
  const path = `${workspace}/grade.mjs`;

  assert.deepEqual(findScriptViolations([path], [path]), { added: [], stale: [] });
});

test('ignores other extensions under a workspace', () => {
  const listed = ['x.ts', 'x.mts', 'x.cts', 'x.json', 'x.md', 'x.sh', 'x.py', 'x.mjs.map'].map((name) => `${workspace}/${name}`);

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

test('parseGrandfatherList splits on a bare line feed too', () => {
  assert.deepEqual(parseGrandfatherList('a/b.mjs\n# note\nc/d.js\n'), ['a/b.mjs', 'c/d.js']);
});

test('reports an unlisted grandfathered path as stale in sorted order', () => {
  const listed = [`${workspace}/kept.mjs`];
  const grandfathered = [`${workspace}/kept.mjs`, `${workspace}/c.mjs`, `${workspace}/a.mjs`, `${workspace}/b.mjs`];

  assert.deepEqual(findScriptViolations(listed, grandfathered), {
    added: [],
    stale: [`${workspace}/a.mjs`, `${workspace}/b.mjs`, `${workspace}/c.mjs`],
  });
});

test('ignores a .claude/skills path that is nested below another folder', () => {
  const listed = [`plugins/x/${workspace}/nested.mjs`, `docs/.claude/skills/x-workspace/nested.js`];

  assert.deepEqual(findScriptViolations(listed, []), { added: [], stale: [] });
});

const scratchRoot = mkdtempSync(join(tmpdir(), 'check-no-new-js-'));

after(() => rmSync(scratchRoot, { recursive: true, force: true }));

// Every test that needs a repository gets its own, so none depends on what another test left behind.
function scratchRepo() {
  const repo = mkdtempSync(join(scratchRoot, 'repo-'));
  const git = (...args: string[]): string =>
    execFileSync('git', args, { cwd: repo, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });

  git('init', '--quiet');

  return {
    repo,
    git,
    write(path: string, content = ''): void {
      const full = join(repo, path);

      mkdirSync(dirname(full), { recursive: true });
      writeFileSync(full, content);
    },
  };
}

test('git calls go to the scratch repository even under an inherited GIT_DIR or GIT_INDEX_FILE', () => {
  const { git } = scratchRepo();

  assert.equal(git('rev-parse', '--git-dir').trim(), '.git');
  assert.equal(git('rev-parse', '--git-path', 'index').trim(), '.git/index');
});

test('listWorkspaceFiles lists staged and untracked files but not ignored ones, with no empty entry', () => {
  const ws = '.claude/skills/x-workspace';
  const staged = `${ws}/staged.mjs`;
  const untracked = `${ws}/untracked.mjs`;
  const { repo, git, write } = scratchRepo();

  write('.gitignore', 'node_modules/\nresults/\n');
  write(staged);
  write(untracked);
  write(`${ws}/node_modules/dep/index.js`);
  write(`${ws}/results/out.mjs`);
  write('README.md');
  git('add', '--', staged);

  const listed = listWorkspaceFiles(repo);

  assert.deepEqual([...listed].sort(), [staged, untracked]);
  assert.deepEqual(findScriptViolations(listed, [staged]), { added: [untracked], stale: [] });
});

test('listWorkspaceFiles returns an empty list for a repository with nothing under .claude/skills', () => {
  const { repo, write } = scratchRepo();

  write('README.md');

  assert.deepEqual(listWorkspaceFiles(repo), []);
});
