import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, test } from 'node:test';

import { requireRecord, readJson } from './guards.ts';
import { caseTarget, casesTree, git, pluginTree } from './stage.ts';

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
  assert.ok(target.includes(caseTarget(stageRoot, sha, casesTree(repo))), target);
  assert.ok(existsSync(`${caseTarget(stageRoot, sha, casesTree(repo))}/evals/demo-01/prompt.md`));

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

  // The stub passes every grader, but its trace replies "stub reply", so the model fails the `hello` regex.
  const crosscheck = evalCli(['crosscheck', setDir], env);
  assert.equal(crosscheck.status, 1, crosscheck.output);
  assert.match(crosscheck.output, /disagree: demo-01 head\/claude-sonnet-5-5\/demo-01\/run-1 with stub: CLI true, model false/);
  assert.match(crosscheck.output, /crosscheck: 0 agree, 1 disagree, 0 unchecked/);
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

test('a slim run starts in a copy of its suite template, after its case scaffold ran there', () => {
  const base = `${root}/slim-template`;
  const clone = `${base}/clones/demo/kata`;
  mkdirSync(clone, { recursive: true });
  git(clone, ['init', '-q']);
  put(`${clone}/ts/package.json`, '{"name":"kata","version":"1.0.0","private":true}\n');
  put(`${clone}/ts/.gitignore`, 'node_modules\npackage-lock.json\n');
  git(clone, ['add', '-A']);
  git(clone, ['-c', 'user.name=lz-tdd-eval', '-c', 'user.email=larsbrinknielsen@gmail.com', 'commit', '-q', '-m', 'kata']);
  const lock = '{"name":"kata","version":"1.0.0","lockfileVersion":3,"requires":true,"packages":{"":{"name":"kata","version":"1.0.0"}}}\n';
  put(`${clone}/ts/package-lock.json`, lock);
  const repo = `${base}/repo`;
  const sha = demoRepo(repo);
  put(
    `${repo}/evals/lz-tdd-apply/templates.json`,
    JSON.stringify({
      kata: {
        clone: 'demo/kata',
        commit: git(clone, ['rev-parse', 'HEAD']),
        subdir: 'ts',
        lockfile: { path: 'ts/package-lock.json', sha256: createHash('sha256').update(lock).digest('hex') },
        arm: null,
        overlay: null,
        red: null,
      },
    }),
  );
  put(`${repo}/evals/lz-tdd-apply/apply/suite.json`, '{"backend":"slim","target":"kata"}\n');
  put(`${repo}/evals/lz-tdd-apply/apply/apply-01/prompt.md`, 'Make it pass.\n');
  put(`${repo}/evals/lz-tdd-apply/apply/apply-01/case.yaml`, 'name: apply-01\ncontext:\n  scaffold_script: scaffold.sh\n');
  put(`${repo}/evals/lz-tdd-apply/apply/apply-01/scaffold.sh`, 'echo scaffolded > scaffolded.txt\n');
  git(repo, ['add', '-A']);
  git(repo, ['-c', 'user.name=lz-tdd-eval', '-c', 'user.email=larsbrinknielsen@gmail.com', 'commit', '-q', '-m', 'slim case']);
  const setDir = `${base}/set`;
  put(
    `${setDir}/run-set.json`,
    JSON.stringify({ cells: [{ arm: 'head', ref: sha, models: { 'claude-sonnet-5-5': 1 }, suites: [{ suite: 'apply' }] }] }),
  );
  const env = {
    LZ_EVAL_REPO: repo,
    LZ_EVAL_STAGE_ROOT: `${base}/stage`,
    LZ_EVAL_SLIM_ROOT: `${base}/slim`,
    LZ_EVAL_CLONES: `${base}/clones`,
    LZ_EVAL_RUN_SLIM: join(import.meta.dirname, 'stubs.ts'),
    LZ_EVAL_PROJECTS_DIR: `${base}/projects`,
    LZ_EVAL_STUB_DIR: `${base}/stub`,
  };

  const ran = evalCli(['run', setDir], env);
  assert.equal(ran.status, 0, ran.output);
  const runDir = `${setDir}/head/claude-sonnet-5-5/apply-01/run-1`;
  const cwd = String(requireRecord(readJson(`${runDir}/raw/started.json`), 'started.json')['cwd']);
  assert.equal(readFileSync(`${cwd}/package.json`, 'utf8'), '{"name":"kata","version":"1.0.0","private":true}\n');
  assert.equal(readFileSync(`${cwd}/scaffolded.txt`, 'utf8').trim(), 'scaffolded');
  // npm ci of a lockfile without packages makes no node_modules; the lockfile itself is copied in.
  assert.equal(readFileSync(`${cwd}/package-lock.json`, 'utf8'), lock);
  assert.equal(git(cwd, ['rev-parse', 'HEAD^{tree}']), git(clone, ['rev-parse', 'HEAD:ts']));
  const result = requireRecord(readJson(`${runDir}/result.json`), 'result.json');
  assert.deepEqual([result['backend'], result['graded'], result['pluginTree']], ['slim', true, pluginTree(repo, sha)]);
});

test('a paid run books the timing-sensitive lock for a plugin-eval suite, and refuses before any spawn without it', () => {
  const repo = `${root}/paid`;
  const stubDir = `${root}/paid-stub`;
  const setDir = `${root}/sets/paid`;
  const sha = demoRepo(repo);
  put(
    `${setDir}/run-set.json`,
    JSON.stringify({ cells: [{ arm: 'head', ref: sha, models: { 'claude-sonnet-5-5': 1 }, suites: [{ suite: 'demo' }] }] }),
  );
  // Any backend but the stub counts as paid; this one hands its arguments on to the stub.
  const claude = `${root}/paid-claude.ts`;
  const stub = join(import.meta.dirname, 'stubs.ts');
  put(
    claude,
    `import { spawnSync } from 'node:child_process';\nconst ran = spawnSync(process.execPath, [${JSON.stringify(stub)}, ...process.argv.slice(2)], { stdio: 'inherit' });\nprocess.exit(ran.status ?? 1);\n`,
  );
  const log = `${root}/paid-lock.jsonl`;
  const lock = `${root}/paid-lock.ts`;
  put(lock, `import { appendFileSync } from 'node:fs';\nappendFileSync(${JSON.stringify(log)}, JSON.stringify(process.argv.slice(2)) + '\\n');\n`);
  const env = { LZ_EVAL_REPO: repo, LZ_EVAL_STAGE_ROOT: `${root}/paid-stage`, LZ_EVAL_CLAUDE: claude, LZ_EVAL_STUB_DIR: stubDir };

  const refused = evalCli(['run', setDir], { ...env, LZ_EVAL_HEAVY_LOCK: '', LZ_EVAL_LOCK_OWNER: '' });
  assert.equal(refused.status, 1, refused.output);
  assert.match(refused.output, /set LZ_EVAL_HEAVY_LOCK/);
  assert.equal(existsSync(`${stubDir}/argv.jsonl`), false);

  const locked = { ...env, LZ_EVAL_HEAVY_LOCK: lock, LZ_EVAL_LOCK_OWNER: 'eval-test' };
  const badMinutes = evalCli(['run', setDir, '--lock-minutes', '1441'], locked);
  assert.equal(badMinutes.status, 1, badMinutes.output);
  assert.match(badMinutes.output, /--lock-minutes must be a whole number from 1 to 1440/);
  assert.equal(existsSync(log), false);

  const ran = evalCli(['run', setDir, '--lock-minutes', '7', '--lock-note', 'part 1 of 3'], locked);
  assert.equal(ran.status, 0, ran.output);
  assert.equal(argvLines(stubDir), 1);
  const calls = readFileSync(log, 'utf8').split('\n').filter((line) => line !== '').map((line): unknown => JSON.parse(line));
  assert.deepEqual(
    calls.map((call) =>
      Array.isArray(call) ? [call[0], call.includes('--timing'), call.includes('--minutes') ? call[call.indexOf('--minutes') + 1] : null] : null,
    ),
    [['wait', false, '7'], ['acquire', true, '7'], ['release', false, null]],
  );
  const acquired = calls[1];
  assert.match(Array.isArray(acquired) ? String(acquired[acquired.indexOf('--task') + 1]) : '', /^lz-tdd eval .*\(part 1 of 3\)$/);
});

test('stage prints the case target of a ref for the committed cases, and a ref that is no commit fails', () => {
  const repo = `${root}/stage-cli`;
  const stageRoot = `${root}/stage-cli-out`;
  const sha = demoRepo(repo);
  const env = { LZ_EVAL_REPO: repo, LZ_EVAL_STAGE_ROOT: stageRoot };

  const staged = evalCli(['stage', 'HEAD'], env);
  assert.equal(staged.status, 0, staged.output);
  assert.equal(staged.output.trim(), caseTarget(stageRoot, sha, casesTree(repo)));
  assert.ok(existsSync(`${staged.output.trim()}/evals/demo-01/prompt.md`));

  const missing = evalCli(['stage', 'no-such-ref'], env);
  assert.equal(missing.status, 1, missing.output);
  assert.match(missing.output, /no-such-ref names no commit/);
});
