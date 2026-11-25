import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, test } from 'node:test';

import { git } from './stage.ts';
import { buildTemplate, copyTemplate, readTemplates, templateDir, type Recipe, type Toolchain } from './templates.ts';

const root = mkdtempSync(join(tmpdir(), 'lz-evals-templates-')).replaceAll('\\', '/');

after(() => rmSync(root, { recursive: true, force: true }));

const lockText = '{"lockfileVersion":3,"packages":{}}\n';
const lockSha = createHash('sha256').update(lockText).digest('hex');
const snapshotText = 'exports[`approvals 1`] = `ok`;\n';

function put(path: string, text: string): void {
  mkdirSync(join(path, '..'), { recursive: true });
  writeFileSync(path, text);
}

function commitAll(repo: string): string {
  git(repo, ['add', '-A']);
  git(repo, ['-c', 'user.name=lz-tdd-eval', '-c', 'user.email=larsbrinknielsen@gmail.com', 'commit', '-q', '-m', 'x']);

  return git(repo, ['rev-parse', 'HEAD']);
}

interface Fixture {
  readonly repo: string;
  readonly clones: string;
  readonly slimRoot: string;
  readonly commit: string;
  readonly blob: string;
}

// A kata clone at <clones>/demo/kata with its lockfile ignored in the clone (as the real kata does), and a repository
// whose evals/lz-tdd-apply/templates.json names it.
function fixture(name: string, recipes: (commit: string, blob: string) => Record<string, unknown>): Fixture {
  const base = `${root}/${name}`;
  const clone = `${base}/clones/demo/kata`;
  mkdirSync(clone, { recursive: true });
  git(clone, ['init', '-q']);
  put(`${clone}/ts/package.json`, '{"name":"kata","private":true}\n');
  put(`${clone}/ts/.gitignore`, 'node_modules\npackage-lock.json\n');
  put(`${clone}/ts/test/approvals.spec.ts`, 'test("approvals", () => {});\n');
  const commit = commitAll(clone);
  put(`${clone}/ts/package-lock.json`, lockText);
  const snapshot = `${base}/snapshot.snap`;
  put(snapshot, snapshotText);
  const blob = git(base, ['hash-object', snapshot]);
  const repo = `${base}/repo`;
  mkdirSync(repo, { recursive: true });
  git(repo, ['init', '-q']);
  put(`${repo}/evals/lz-tdd-apply/templates.json`, JSON.stringify(recipes(commit, blob), null, 2));
  commitAll(repo);

  return { repo, clones: `${base}/clones`, slimRoot: `${base}/slim`, commit, blob };
}

function recipe(commit: string, extra: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    clone: 'demo/kata',
    commit,
    subdir: 'ts',
    lockfile: { path: 'ts/package-lock.json', sha256: lockSha },
    arm: null,
    overlay: null,
    red: null,
    ...extra,
  };
}

interface Calls {
  installs: number;
  vitest: string[][];
}

// Stands in for npm ci and vitest: install makes node_modules, and an update run writes the snapshot.
function fakeToolchain(calls: Calls): Toolchain {
  return {
    install: (dir) => {
      calls.installs += 1;
      put(`${dir}/node_modules/vitest/package.json`, '{}\n');
    },
    vitest: (dir, args) => {
      calls.vitest.push([...args]);

      if (args.includes('-u')) {
        put(`${dir}/test/__snapshots__/approvals.spec.ts.snap`, snapshotText);
      }

      return 0;
    },
  };
}

test('readTemplates reads the recipes and refuses unknown keys, absolute or parent paths and short hashes', () => {
  const f = fixture('read', (commit) => ({ plain: recipe(commit) }));
  const plain = readTemplates(f.repo).get('plain');
  assert.equal(plain?.commit, f.commit);
  assert.deepEqual(plain?.lockfile, { path: 'ts/package-lock.json', sha256: lockSha });

  const refuse = (entry: Record<string, unknown>, pattern: RegExp): void => {
    put(`${f.repo}/evals/lz-tdd-apply/templates.json`, JSON.stringify({ bad: entry }));
    assert.throws(() => readTemplates(f.repo), pattern);
  };

  refuse(recipe(f.commit, { extra: 1 }), /unknown keys extra/);
  refuse(recipe(f.commit, { clone: 'D:/projects/github/demo/kata' }), /clone must be a relative path/);
  refuse(recipe(f.commit, { subdir: '../ts' }), /subdir must be a relative path/);
  refuse(recipe(f.commit, { clone: 'kata' }), /clone must be <org>\/<repo>/);
  refuse(recipe(f.commit.slice(0, 12)), /commit must be 40 lowercase hex digits/);
  refuse(recipe(f.commit, { arm: { spec: 'a.spec.ts', snapshot: 's.snap' } }), /arm blob must be 40/);
  refuse(recipe(f.commit, { red: { spec: 'r.spec.ts', reporter: 'json' } }), /red: unknown keys reporter/);
});

test('buildTemplate builds a committed copy of the kata with its toolchain, and reuses it on the next call', () => {
  const f = fixture('build', (commit) => ({ plain: recipe(commit) }));
  const calls: Calls = { installs: 0, vitest: [] };
  const dir = buildTemplate(f.repo, f.slimRoot, f.clones, 'plain', fakeToolchain(calls));
  const plain = readTemplates(f.repo).get('plain');
  assert.ok(plain !== undefined);
  assert.equal(dir, templateDir(f.slimRoot, 'plain', plain));
  assert.match(dir, new RegExp(`/templates/plain-${f.commit.slice(0, 12)}-[0-9a-f]{8}$`));
  assert.equal(readFileSync(`${dir}/package-lock.json`, 'utf8'), lockText);
  assert.ok(existsSync(`${dir}/node_modules/vitest/package.json`));
  // The tree of the template commit equals the kata subfolder at the pinned commit.
  assert.equal(git(dir, ['rev-parse', 'HEAD^{tree}']), git(`${f.clones}/demo/kata`, ['rev-parse', `${f.commit}:ts`]));
  assert.equal(git(dir, ['status', '--porcelain']), '');
  assert.deepEqual(readdirSync(`${f.slimRoot}/templates`), [dir.split('/').at(-1)]);

  const mtime = statSync(dir).mtimeMs;
  assert.equal(buildTemplate(f.repo, f.slimRoot, f.clones, 'plain', fakeToolchain(calls)), dir);
  assert.deepEqual([calls.installs, statSync(dir).mtimeMs], [1, mtime]);
});

test('an armed template writes the snapshot with the update flag, proves it with a plain run and checks its blob', () => {
  const f = fixture('armed', (commit, blob) => ({
    armed: recipe(commit, { arm: { spec: 'test/approvals.spec.ts', snapshot: 'test/__snapshots__/approvals.spec.ts.snap', blob } }),
    wrong: recipe(commit, { arm: { spec: 'test/approvals.spec.ts', snapshot: 'test/__snapshots__/approvals.spec.ts.snap', blob: 'f'.repeat(40) } }),
  }));
  const calls: Calls = { installs: 0, vitest: [] };
  const dir = buildTemplate(f.repo, f.slimRoot, f.clones, 'armed', fakeToolchain(calls));
  assert.deepEqual(calls.vitest, [
    ['run', 'test/approvals.spec.ts', '-u'],
    ['run', 'test/approvals.spec.ts'],
  ]);
  assert.equal(git(dir, ['rev-parse', 'HEAD:test/__snapshots__/approvals.spec.ts.snap']), f.blob);

  assert.throws(() => buildTemplate(f.repo, f.slimRoot, f.clones, 'wrong', fakeToolchain(calls)), /is blob [0-9a-f]{40}, not f{40}/);
  assert.equal(readdirSync(`${f.slimRoot}/templates`).length, 1);
});

test('buildTemplate refuses a missing commit, a changed lockfile and a missing overlay before any install', () => {
  const f = fixture('refuse', (commit) => ({
    gone: recipe('e'.repeat(40)),
    changed: recipe(commit, { lockfile: { path: 'ts/package-lock.json', sha256: 'a'.repeat(64) } }),
    overlaid: recipe(commit, { overlay: 'overlays/red' }),
  }));
  const calls: Calls = { installs: 0, vitest: [] };

  assert.throws(() => buildTemplate(f.repo, f.slimRoot, f.clones, 'gone', fakeToolchain(calls)), new RegExp(`fetch e{40} into ${f.clones}/demo/kata`));
  assert.throws(() => buildTemplate(f.repo, f.slimRoot, f.clones, 'changed', fakeToolchain(calls)), /has sha256 [0-9a-f]{64}, not the pinned a{64}/);
  assert.throws(() => buildTemplate(f.repo, f.slimRoot, f.clones, 'overlaid', fakeToolchain(calls)), /overlay missing/);
  assert.throws(() => buildTemplate(f.repo, f.slimRoot, f.clones, 'nope', fakeToolchain(calls)), /has no template nope/);
  assert.equal(calls.installs, 0);
  assert.equal(existsSync(`${f.slimRoot}/templates`) ? readdirSync(`${f.slimRoot}/templates`).length : 0, 0);
});

test('a red template copies the committed overlay in and requires its spec to fail on an assertion', () => {
  const f = fixture('red', (commit) => ({ red: recipe(commit, { overlay: 'overlays/red', red: { spec: 'test/red.spec.ts' } }) }));
  put(`${f.repo}/evals/lz-tdd-apply/overlays/red/test/red.spec.ts`, 'test("red", () => expect(1).toBe(2));\n');
  commitAll(f.repo);
  const report = (failed: number, files: unknown[]): Toolchain => ({
    install: () => undefined,
    vitest: (_dir, args) => {
      const out = args.find((arg) => arg.startsWith('--outputFile='))?.slice('--outputFile='.length) ?? '';
      put(out, JSON.stringify({ numFailedTests: failed, testResults: files }));

      return failed > 0 || files.length > 0 ? 1 : 0;
    },
  });

  assert.throws(
    () => buildTemplate(f.repo, f.slimRoot, f.clones, 'red', report(0, [{ status: 'failed', assertionResults: [] }])),
    /not red on an assertion: exit 1, 0 failed tests, 1 files failed without tests/,
  );
  assert.throws(() => buildTemplate(f.repo, f.slimRoot, f.clones, 'red', report(0, [])), /not red on an assertion: exit 0/);

  const dir = buildTemplate(f.repo, f.slimRoot, f.clones, 'red', report(1, [{ status: 'failed', assertionResults: [{ status: 'failed' }] }]));
  assert.equal(readFileSync(`${dir}/test/red.spec.ts`, 'utf8'), 'test("red", () => expect(1).toBe(2));\n');
  assert.equal(git(dir, ['status', '--porcelain']), '');
  assert.deepEqual(readdirSync(`${f.slimRoot}/templates`).filter((name) => name.endsWith('.json')), []);
});

test('copyTemplate copies a built template into an empty run folder below the slim root, and refuses anything else', () => {
  const f = fixture('copy', (commit) => ({ plain: recipe(commit) }));
  const dir = buildTemplate(f.repo, f.slimRoot, f.clones, 'plain', fakeToolchain({ installs: 0, vitest: [] }));
  const cwd = `${f.slimRoot}/runs/set-abc`;
  mkdirSync(cwd, { recursive: true });

  copyTemplate(dir, cwd, f.slimRoot);
  assert.equal(readFileSync(`${cwd}/package.json`, 'utf8'), '{"name":"kata","private":true}\n');
  assert.ok(existsSync(`${cwd}/node_modules/vitest/package.json`));
  assert.equal(git(cwd, ['rev-parse', 'HEAD^{tree}']), git(dir, ['rev-parse', 'HEAD^{tree}']));
  assert.equal(git(cwd, ['status', '--porcelain']), '');
  // A write in the run folder never reaches the template.
  writeFileSync(`${cwd}/node_modules/vitest/package.json`, 'changed');
  assert.equal(readFileSync(`${dir}/node_modules/vitest/package.json`, 'utf8'), '{}\n');

  assert.throws(() => copyTemplate(dir, cwd, f.slimRoot), /is not empty/);
  assert.throws(() => copyTemplate(dir, `${f.slimRoot}/elsewhere`, f.slimRoot), /is not below/);
  assert.throws(() => copyTemplate(dir, `${f.slimRoot}/runs/../escape`, f.slimRoot), /is not below/);
  assert.throws(() => copyTemplate(`${f.slimRoot}/templates`, `${f.slimRoot}/runs/other`, f.slimRoot), /is not a built template/);
});

test('the committed templates.json pins three GildedRose recipes with clone-relative paths', () => {
  const recipes = readTemplates(join(import.meta.dirname, '..', '..').replaceAll('\\', '/'));
  const kata = (name: string): Recipe | undefined => recipes.get(name);

  assert.deepEqual([...recipes.keys()], ['gilded-rose-ts', 'gilded-rose-ts-armed', 'gilded-rose-ts-conjured-red']);
  assert.deepEqual(
    [...recipes.values()].map(({ clone, commit, subdir }) => `${clone}@${commit}:${subdir}`),
    Array.from({ length: 3 }, () => 'emilybache/GildedRose-Refactoring-Kata@3e0085bfd0da7ca9cc2db23129eb882b9d7184fa:TypeScript'),
  );
  assert.deepEqual([kata('gilded-rose-ts')?.arm, kata('gilded-rose-ts-armed')?.arm?.blob], [null, '2998a7711cc40813c573dd5c89b70d1fe8d6b13e']);
  assert.deepEqual([kata('gilded-rose-ts-conjured-red')?.overlay, kata('gilded-rose-ts-conjured-red')?.red?.spec], ['overlays/conjured-red', 'test/vitest/conjured.spec.ts']);
});
