import assert from 'node:assert/strict';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, test } from 'node:test';

import { caseTarget, casesTree, git, pluginTree, resolveCommit, stageRef } from './stage.ts';

const root = mkdtempSync(join(tmpdir(), 'lz-evals-stage-')).replaceAll('\\', '/');

after(() => rmSync(root, { recursive: true, force: true }));

function put(path: string, text: string): void {
  mkdirSync(join(path, '..'), { recursive: true });
  writeFileSync(path, text);
}

function commitAll(repo: string, message: string): string {
  git(repo, ['add', '-A']);
  git(repo, ['-c', 'user.name=lz-tdd-eval', '-c', 'user.email=larsbrinknielsen@gmail.com', 'commit', '-q', '-m', message]);

  return git(repo, ['rev-parse', 'HEAD']);
}

function demoRepo(name: string): string {
  const repo = `${root}/${name}`;
  mkdirSync(repo, { recursive: true });
  git(repo, ['init', '-q']);
  put(`${repo}/plugins/lz-tdd/.claude-plugin/plugin.json`, '{"name":"lz-tdd"}\n');
  put(`${repo}/plugins/lz-tdd/skills/demo/SKILL.md`, '---\nname: demo\ndescription: demo\n---\n');
  put(`${repo}/evals/lz-tdd/demo/suite.json`, '{"backend":"plugin-eval"}\n');
  put(`${repo}/evals/lz-tdd/demo/demo-01/prompt.md`, 'Say hello.\n');
  put(`${repo}/evals/lz-tdd/demo/demo-01/graders/hello.md`, '---\ntype: regex\npattern: hello\n---\n');
  put(`${repo}/evals/lz-tdd-apply/apply/suite.json`, '{"backend":"slim"}\n');
  put(`${repo}/evals/lz-tdd-apply/apply/apply-01/prompt.md`, 'Make it pass.\n');

  return repo;
}

test('stageRef packages the commit and the committed plugin-eval cases, and reuses the plugin on a second call', () => {
  const repo = demoRepo('stage');
  const sha = commitAll(repo, 'demo');
  // The working tree is not what gets staged.
  put(`${repo}/plugins/lz-tdd/skills/demo/SKILL.md`, 'edited, not committed\n');
  const stageRoot = `${root}/stage-out`;

  const staged = stageRef(repo, stageRoot, sha);
  const dir = `${stageRoot}/${sha.slice(0, 12)}`;
  assert.equal(staged.target, caseTarget(stageRoot, sha, casesTree(repo)));
  assert.match(staged.target, new RegExp(`^${dir}/lz-tdd-[0-9a-f]{12}$`));
  assert.equal(readFileSync(`${dir}/plugin/skills/demo/SKILL.md`, 'utf8'), '---\nname: demo\ndescription: demo\n---\n');
  assert.equal(readFileSync(`${staged.target}/.claude-plugin/plugin.json`, 'utf8'), '{"name":"lz-tdd"}\n');
  assert.deepEqual(readdirSync(`${staged.target}/evals`), ['demo-01']);
  assert.ok(existsSync(`${staged.target}/evals/demo-01/graders/hello.md`));
  assert.equal(existsSync(`${dir}/plugin/evals`), false);
  assert.deepEqual(staged, { sha, pluginTree: pluginTree(repo, sha), casesTree: casesTree(repo), cases: ['demo-01'], target: staged.target });
  assert.deepEqual(readdirSync(stageRoot), [sha.slice(0, 12)]);

  const pluginMtime = statSync(`${dir}/plugin`).mtimeMs;
  const caseMtime = statSync(staged.target).mtimeMs;
  assert.deepEqual(stageRef(repo, stageRoot, sha), staged);
  assert.deepEqual([statSync(`${dir}/plugin`).mtimeMs, statSync(staged.target).mtimeMs], [pluginMtime, caseMtime]);
});

test('stageRef stages each committed cases tree in its own case target and never rebuilds one in use', () => {
  const repo = demoRepo('per-tree');
  const sha = commitAll(repo, 'demo');
  const stageRoot = `${root}/per-tree-out`;
  const first = stageRef(repo, stageRoot, sha);
  const firstMtime = statSync(first.target).mtimeMs;

  put(`${repo}/evals/lz-tdd/demo/demo-02/prompt.md`, 'Say bye.\n');
  commitAll(repo, 'second case');
  const second = stageRef(repo, stageRoot, sha);

  assert.notEqual(second.target, first.target);
  assert.deepEqual([first.cases, second.cases, second.casesTree], [['demo-01'], ['demo-01', 'demo-02'], casesTree(repo)]);
  assert.deepEqual([readdirSync(`${first.target}/evals`), statSync(first.target).mtimeMs], [['demo-01'], firstMtime]);
  assert.deepEqual(readdirSync(`${second.target}/evals`), ['demo-01', 'demo-02']);
});

test('an uncommitted case is not staged', () => {
  const repo = demoRepo('uncommitted');
  const sha = commitAll(repo, 'demo');
  put(`${repo}/evals/lz-tdd/demo/demo-09/prompt.md`, 'Not committed.\n');

  const staged = stageRef(repo, `${root}/uncommitted-out`, sha);
  assert.deepEqual(readdirSync(`${staged.target}/evals`), ['demo-01']);
});

test('two plugin-eval cases with one name in different suites are refused', () => {
  const repo = demoRepo('twins');
  put(`${repo}/evals/lz-tdd/other/suite.json`, '{"backend":"plugin-eval"}\n');
  put(`${repo}/evals/lz-tdd/other/demo-01/prompt.md`, 'Twin.\n');
  const sha = commitAll(repo, 'twins');

  assert.throws(() => stageRef(repo, `${root}/twins-out`, sha), /two committed cases are named demo-01/);
});

test('resolveCommit gives the full sha of a ref and names a ref that is no commit', () => {
  const repo = demoRepo('refs');
  const sha = commitAll(repo, 'demo');

  assert.equal(resolveCommit(repo, 'HEAD'), sha);
  assert.equal(resolveCommit(repo, sha.slice(0, 7)), sha);
  assert.throws(() => resolveCommit(repo, 'no-such-ref'), /no-such-ref names no commit/);
});

test('casesTree is none when HEAD has no evals folder', () => {
  const repo = `${root}/no-evals`;
  mkdirSync(repo, { recursive: true });
  git(repo, ['init', '-q']);
  put(`${repo}/plugins/lz-tdd/.claude-plugin/plugin.json`, '{"name":"lz-tdd"}\n');
  const sha = commitAll(repo, 'plugin only');

  assert.equal(casesTree(repo), 'none');
  const staged = stageRef(repo, `${root}/no-evals-out`, sha);
  assert.deepEqual([existsSync(`${staged.target}/evals`), staged.cases], [false, []]);
});
