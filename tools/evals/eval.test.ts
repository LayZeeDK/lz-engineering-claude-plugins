import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, test } from 'node:test';

import { requireRecord, readJson } from './guards.ts';
import { casesTree, git, pluginTree } from './stage.ts';

const root = mkdtempSync(join(tmpdir(), 'lz-evals-cli-')).replaceAll('\\', '/');

after(() => rmSync(root, { recursive: true, force: true }));

function put(path: string, text: string): void {
  mkdirSync(join(path, '..'), { recursive: true });
  writeFileSync(path, text);
}

// A repository whose one commit holds a minimal plugin and the demo plugin-eval suite; gives back that commit.
function demoRepo(repo: string): string {
  mkdirSync(repo, { recursive: true });
  git(repo, ['init', '-q']);
  put(`${repo}/plugins/lz-tdd/.claude-plugin/plugin.json`, '{"name":"lz-tdd"}\n');
  put(`${repo}/evals/lz-tdd/demo/suite.json`, '{"backend":"plugin-eval"}\n');
  put(`${repo}/evals/lz-tdd/demo/demo-01/prompt.md`, '---\ntags: [demo]\n---\n\nSay hello.\n');
  put(`${repo}/evals/lz-tdd/demo/demo-01/graders/stub.md`, '---\ntype: regex\npattern: hello\n---\n');
  git(repo, ['add', '-A']);
  git(repo, ['-c', 'user.name=lz-tdd-eval', '-c', 'user.email=larsbrinknielsen@gmail.com', 'commit', '-q', '-m', 'demo']);

  return git(repo, ['rev-parse', 'HEAD']);
}

function evalCli(args: readonly string[], env: NodeJS.ProcessEnv): { status: number | null; output: string } {
  const result = spawnSync(process.execPath, [join(import.meta.dirname, 'eval.ts'), ...args], {
    encoding: 'utf8',
    env: { ...process.env, ...env },
  });

  return { status: result.status, output: `${result.stdout}${result.stderr}` };
}

function argvLines(stubDir: string): number {
  return readFileSync(`${stubDir}/argv.jsonl`, 'utf8').split('\n').filter((line) => line !== '').length;
}

test('one plugin-eval run goes from run-set.json to result.json and RESULTS.md, and a second run starts nothing', () => {
  const repo = `${root}/repo`;
  const stageRoot = `${root}/stage`;
  const stubDir = `${root}/stub`;
  const setDir = `${root}/sets/tracer`;
  const sha = demoRepo(repo);
  put(
    `${setDir}/run-set.json`,
    JSON.stringify({ cells: [{ arm: 'head', ref: sha, models: { 'claude-sonnet-5-5': 1 }, suites: [{ suite: 'demo' }] }] }),
  );
  const env = {
    LZ_EVAL_REPO: repo,
    LZ_EVAL_STAGE_ROOT: stageRoot,
    LZ_EVAL_CLAUDE: join(import.meta.dirname, 'stubs.ts'),
    LZ_EVAL_STUB_DIR: stubDir,
  };

  const first = evalCli(['run', setDir], env);
  assert.equal(first.status, 0, first.output);
  assert.match(first.output, /^eval pid \d+/);
  const result = requireRecord(readJson(`${setDir}/head/claude-sonnet-5-5/demo-01/run-1/result.json`), 'result.json');
  const arms = requireRecord(result['arms'], 'arms');
  assert.deepEqual(
    [result['requestedModel'], result['initModel'], arms['with']],
    ['claude-sonnet-5-5', 'claude-sonnet-5-5', [{ name: 'stub', passed: true, scored: true }]],
  );
  assert.deepEqual([result['pluginTree'], result['casesTree']], [pluginTree(repo, sha), casesTree(repo)]);
  assert.ok(existsSync(`${setDir}/head/claude-sonnet-5-5/demo-01/run-1/raw/trace-with.jsonl`));
  const target = readFileSync(`${stubDir}/argv.jsonl`, 'utf8');
  assert.ok(target.includes(`${stageRoot}/${sha.slice(0, 12)}/lz-tdd`), target);
  assert.ok(existsSync(`${stageRoot}/${sha.slice(0, 12)}/lz-tdd/evals/demo-01/prompt.md`));

  const second = evalCli(['run', setDir], env);
  assert.equal(second.status, 0, second.output);
  assert.equal(argvLines(stubDir), 1);

  const allowed = evalCli(['aggregate', setDir, '--allow-stub'], env);
  assert.equal(allowed.status, 0, allowed.output);
  const results = readFileSync(`${setDir}/RESULTS.md`, 'utf8');
  assert.match(results, /\| demo \| with \| claude-sonnet-5-5 \| stub \| 1\/1 \|/);
  assert.doesNotMatch(results, /[/\\](?:tmp|Temp|sets)[/\\]/i);

  const refused = evalCli(['aggregate', setDir], env);
  assert.equal(refused.status, 1, refused.output);
  assert.match(refused.output, /dry-run stub/);
});

test('run refuses an uncommitted case before it stages or spawns anything', () => {
  const repo = `${root}/dirty`;
  const stageRoot = `${root}/dirty-stage`;
  const stubDir = `${root}/dirty-stub`;
  const setDir = `${root}/sets/dirty`;
  const sha = demoRepo(repo);
  put(`${repo}/evals/lz-tdd/demo/demo-02/prompt.md`, 'Not committed.\n');
  put(
    `${setDir}/run-set.json`,
    JSON.stringify({ cells: [{ arm: 'head', ref: sha, models: { 'claude-sonnet-5-5': 1 }, suites: [{ suite: 'demo' }] }] }),
  );
  const env = { LZ_EVAL_REPO: repo, LZ_EVAL_STAGE_ROOT: stageRoot, LZ_EVAL_CLAUDE: join(import.meta.dirname, 'stubs.ts'), LZ_EVAL_STUB_DIR: stubDir };

  const refused = evalCli(['run', setDir], env);
  assert.equal(refused.status, 1, refused.output);
  assert.match(refused.output, /commit the cases first/);
  assert.deepEqual([existsSync(`${stubDir}/argv.jsonl`), existsSync(stageRoot), existsSync(`${setDir}/head`)], [false, false, false]);
});

test('stage prints the stage folder of a ref, and a ref that is no commit fails', () => {
  const repo = `${root}/stage-cli`;
  const stageRoot = `${root}/stage-cli-out`;
  const sha = demoRepo(repo);
  const env = { LZ_EVAL_REPO: repo, LZ_EVAL_STAGE_ROOT: stageRoot };

  const staged = evalCli(['stage', 'HEAD'], env);
  assert.equal(staged.status, 0, staged.output);
  assert.equal(staged.output.trim(), `${stageRoot}/${sha.slice(0, 12)}`);
  assert.equal(requireRecord(readJson(`${stageRoot}/${sha.slice(0, 12)}/stage.json`), 'stage.json')['pluginTree'], pluginTree(repo, sha));

  const missing = evalCli(['stage', 'no-such-ref'], env);
  assert.equal(missing.status, 1, missing.output);
  assert.match(missing.output, /no-such-ref names no commit/);
});
