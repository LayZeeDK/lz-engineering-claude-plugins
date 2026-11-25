import assert from 'node:assert/strict';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, test } from 'node:test';

import { casesTree, git, pluginTree, readStage, resolveCommit, stageRef } from './stage.ts';

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

  const dir = stageRef(repo, stageRoot, sha);
  assert.equal(dir, `${stageRoot}/${sha.slice(0, 12)}`);
  assert.equal(readFileSync(`${dir}/plugin/skills/demo/SKILL.md`, 'utf8'), '---\nname: demo\ndescription: demo\n---\n');
  assert.equal(readFileSync(`${dir}/lz-tdd/.claude-plugin/plugin.json`, 'utf8'), '{"name":"lz-tdd"}\n');
  assert.deepEqual(readdirSync(`${dir}/lz-tdd/evals`), ['demo-01']);
  assert.ok(existsSync(`${dir}/lz-tdd/evals/demo-01/graders/hello.md`));
  assert.equal(existsSync(`${dir}/plugin/evals`), false);
  assert.deepEqual(readStage(dir), { sha, pluginTree: pluginTree(repo, sha), casesTree: casesTree(repo), cases: ['demo-01'] });
  assert.deepEqual(readdirSync(stageRoot), [sha.slice(0, 12)]);

  const pluginMtime = statSync(`${dir}/plugin`).mtimeMs;
  const caseMtime = statSync(`${dir}/lz-tdd`).mtimeMs;
  assert.equal(stageRef(repo, stageRoot, sha), dir);
  assert.deepEqual([statSync(`${dir}/plugin`).mtimeMs, statSync(`${dir}/lz-tdd`).mtimeMs], [pluginMtime, caseMtime]);

  put(`${repo}/evals/lz-tdd/demo/demo-02/prompt.md`, 'Say bye.\n');
  git(repo, ['checkout', '--', 'plugins']);
  commitAll(repo, 'second case');
  stageRef(repo, stageRoot, sha);
  assert.equal(statSync(`${dir}/plugin`).mtimeMs, pluginMtime);
  assert.deepEqual(readdirSync(`${dir}/lz-tdd/evals`).sort(), ['demo-01', 'demo-02']);
  assert.deepEqual(readStage(dir)?.cases, ['demo-01', 'demo-02']);
});

test('an uncommitted case is not staged', () => {
  const repo = demoRepo('uncommitted');
  const sha = commitAll(repo, 'demo');
  put(`${repo}/evals/lz-tdd/demo/demo-09/prompt.md`, 'Not committed.\n');

  const dir = stageRef(repo, `${root}/uncommitted-out`, sha);
  assert.deepEqual(readdirSync(`${dir}/lz-tdd/evals`), ['demo-01']);
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
  const dir = stageRef(repo, `${root}/no-evals-out`, sha);
  assert.deepEqual([existsSync(`${dir}/lz-tdd/evals`), readStage(dir)?.cases], [false, []]);
});
