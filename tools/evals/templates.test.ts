import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { spawn, type ChildProcess } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, test } from 'node:test';

import { git } from './stage.ts';
import { buildTemplate, cleanEnv, copyTemplate, readTemplates, templateDir, withLocalBin, type Recipe, type Toolchain } from './templates.ts';

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
  // An executable file, as srvx has: Windows checkouts carry no exec bit, so the template must take it from the clone.
  put(`${clone}/ts/bin/kata.mjs`, '#!/usr/bin/env node\n');
  git(clone, ['add', '-A']);
  git(clone, ['update-index', '--chmod=+x', 'ts/bin/kata.mjs']);
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

      return { status: 0, output: '' };
    },
    run: () => {
      throw new Error('this recipe has no build');
    },
  };
}

interface BuildCalls {
  readonly steps: { step: string; dir: string; lockfile: string | null }[];
}

// Stands in for npm ci and npm run: records each step with the lockfile the folder holds at that moment, and a build
// answers with the given status.
function fakeNpmBuild(calls: BuildCalls, buildStatus = 0): Toolchain {
  const lockfileIn = (dir: string): string | null => (existsSync(`${dir}/package-lock.json`) ? readFileSync(`${dir}/package-lock.json`, 'utf8') : null);

  return {
    install: (dir) => {
      calls.steps.push({ step: 'ci', dir, lockfile: lockfileIn(dir) });
    },
    vitest: () => ({ status: 0, output: '' }),
    run: (dir, script) => {
      calls.steps.push({ step: `run ${script}`, dir, lockfile: lockfileIn(dir) });

      return { status: buildStatus, output: buildStatus === 0 ? 'built' : 'obuild crashed at the end' };
    },
  };
}

const rootLockText = '{"name":"kata","lockfileVersion":3,"packages":{"":{"name":"kata"}}}\n';
const rootLockSha = createHash('sha256').update(rootLockText).digest('hex');

// A recipe at the clone root whose package-lock.json is committed to the repository below evals/lz-tdd-apply.
function committedLock(commit: string, extra: Record<string, unknown> = {}): Record<string, unknown> {
  return recipe(commit, { subdir: null, lockfile: { path: 'package-lock.json', sha256: rootLockSha, from: 'lockfiles/kata/package-lock.json' }, ...extra });
}

function commitLockfile(f: Fixture, text = rootLockText): void {
  put(`${f.repo}/evals/lz-tdd-apply/lockfiles/kata/package-lock.json`, text);
  commitAll(f.repo);
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

      return { status: failed > 0 || files.length > 0 ? 1 : 0, output: '' };
    },
    run: () => {
      throw new Error('this recipe has no build');
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

test('cleanEnv keeps PATH, SystemRoot and the given HOME, and drops every other variable', () => {
  assert.deepEqual(cleanEnv({ Path: 'A', SystemRoot: 'W:/win', GH_TOKEN: 'secret', HOME: 'real' }, 'H'), {
    PATH: 'A',
    HOME: 'H',
    TMPDIR: tmpdir(),
    SystemRoot: 'W:/win',
  });
  assert.deepEqual(cleanEnv({ SECRET: 'x' }, 'H'), { PATH: '', HOME: 'H', TMPDIR: tmpdir() });
});

test('withLocalBin puts the template node_modules/.bin first on PATH under the name the environment already uses', () => {
  const separator = process.platform === 'win32' ? ';' : ':';
  const bin = join('W:/kata', 'node_modules', '.bin');

  assert.deepEqual(withLocalBin('W:/kata', { Path: 'A', OTHER: 'x' }), { Path: `${bin}${separator}A`, OTHER: 'x' });
  assert.deepEqual(withLocalBin('W:/kata', { PATH: 'A' }), { PATH: `${bin}${separator}A` });
  assert.deepEqual(withLocalBin('W:/kata', {}), { PATH: bin });
});

test('the committed templates.json pins three GildedRose recipes with clone-relative paths and the srvx recipe with its committed npm lockfile', () => {
  const repo = join(import.meta.dirname, '..', '..').replaceAll('\\', '/');
  const recipes = readTemplates(repo);
  const kata = (name: string): Recipe | undefined => recipes.get(name);
  const gildedRose = ['gilded-rose-ts', 'gilded-rose-ts-armed', 'gilded-rose-ts-conjured-red'];

  assert.deepEqual([...recipes.keys()], [...gildedRose, 'srvx']);
  assert.deepEqual(
    gildedRose.map((name) => kata(name)).map((entry) => `${String(entry?.clone)}@${String(entry?.commit)}:${String(entry?.subdir)}`),
    Array.from({ length: 3 }, () => 'emilybache/GildedRose-Refactoring-Kata@3e0085bfd0da7ca9cc2db23129eb882b9d7184fa:TypeScript'),
  );
  assert.deepEqual([kata('gilded-rose-ts')?.arm, kata('gilded-rose-ts-armed')?.arm?.blob], [null, '2998a7711cc40813c573dd5c89b70d1fe8d6b13e']);
  assert.deepEqual([kata('gilded-rose-ts-conjured-red')?.overlay, kata('gilded-rose-ts-conjured-red')?.red?.spec], ['overlays/conjured-red', 'test/vitest/conjured.spec.ts']);
  // No added keys on the GildedRose recipes, so their template folder names stay what Plan 02 built.
  assert.deepEqual(
    gildedRose.map((name) => Object.keys(kata(name) ?? {})),
    Array.from({ length: 3 }, () => ['clone', 'commit', 'subdir', 'lockfile', 'arm', 'overlay', 'red']),
  );
  assert.match(templateDir('S:', 'gilded-rose-ts-armed', kata('gilded-rose-ts-armed') ?? assert.fail()), /gilded-rose-ts-armed-3e0085bfd0da-f724b921$/);
  const srvxLock = readFileSync(`${repo}/evals/lz-tdd-apply/lockfiles/srvx/package-lock.json`);
  assert.deepEqual(kata('srvx'), {
    clone: 'h3js/srvx',
    commit: '55d90b39840a5bb7236e23c4e326ee4fc3842d57',
    subdir: null,
    lockfile: { path: 'package-lock.json', sha256: createHash('sha256').update(srvxLock).digest('hex'), from: 'lockfiles/srvx/package-lock.json' },
    arm: null,
    overlay: null,
    red: null,
    build: 'build',
  });
});

test('readTemplates refuses the old installer key, a build that is not a script name and a lockfile source outside the evals folder', () => {
  const f = fixture('npm-read', (commit) => ({ plain: recipe(commit) }));
  const refuse = (entry: Record<string, unknown>, pattern: RegExp): void => {
    put(`${f.repo}/evals/lz-tdd-apply/templates.json`, JSON.stringify({ bad: entry }));
    assert.throws(() => readTemplates(f.repo), pattern);
  };

  refuse(recipe(f.commit, { installer: { pnpm: '11.11.0' } }), /templates\.json bad: unknown keys installer/);
  refuse(recipe(f.commit, { build: 'build && rm -rf /' }), /templates\.json bad build must be a package script name/);
  refuse(committedLock(f.commit, { lockfile: { path: 'package-lock.json', sha256: rootLockSha, from: '../package-lock.json' } }), /bad lockfile from must be a relative path/);
  refuse(committedLock(f.commit, { lockfile: { path: 'package-lock.json', sha256: rootLockSha, from: 'D:/lock.json' } }), /bad lockfile from must be a relative path/);
  refuse(recipe(f.commit, { subdir: '' }), /subdir must be a relative path/);
});

test('a recipe with a committed lockfile copies it from the repository HEAD, runs npm ci, then the build, and commits the whole tree', () => {
  const f = fixture('npm-build', (commit) => ({ root: committedLock(commit, { build: 'build' }) }));
  commitLockfile(f);
  // The working tree differs from HEAD; the template takes the committed bytes.
  put(`${f.repo}/evals/lz-tdd-apply/lockfiles/kata/package-lock.json`, 'uncommitted\n');
  const calls: BuildCalls = { steps: [] };
  const dir = buildTemplate(f.repo, f.slimRoot, f.clones, 'root', fakeNpmBuild(calls));

  assert.deepEqual(
    calls.steps.map(({ step, lockfile }) => [step, lockfile]),
    [
      ['ci', rootLockText],
      ['run build', rootLockText],
    ],
  );
  assert.ok(calls.steps.every(({ dir: at }) => at.startsWith(`${dir}.tmp-`)));
  assert.equal(readFileSync(`${dir}/package-lock.json`, 'utf8'), rootLockText);
  // The whole clone commit plus the lockfile it lacks, all committed.
  assert.equal(git(dir, ['rev-parse', 'HEAD:ts/package.json']), git(`${f.clones}/demo/kata`, ['rev-parse', `${f.commit}:ts/package.json`]));
  assert.equal(git(dir, ['show', 'HEAD:package-lock.json']), rootLockText.trim());
  assert.equal(git(dir, ['status', '--porcelain']), '');
});

test('a recipe with a committed lockfile refuses a missing or changed lockfile before npm ci, and reports a failed build', () => {
  const f = fixture('npm-refuse', (commit) => ({
    root: committedLock(commit),
    built: committedLock(commit, { build: 'build' }),
  }));
  const calls: BuildCalls = { steps: [] };

  assert.throws(() => buildTemplate(f.repo, f.slimRoot, f.clones, 'root', fakeNpmBuild(calls)), /lockfile missing: commit evals\/lz-tdd-apply\/lockfiles\/kata\/package-lock\.json/);
  commitLockfile(f, 'changed\n');
  assert.throws(() => buildTemplate(f.repo, f.slimRoot, f.clones, 'root', fakeNpmBuild(calls)), new RegExp(`lockfiles/kata/package-lock\\.json has sha256 [0-9a-f]{64}, not the pinned ${rootLockSha}`));
  assert.deepEqual(calls.steps, []);

  commitLockfile(f);
  assert.throws(() => buildTemplate(f.repo, f.slimRoot, f.clones, 'built', fakeNpmBuild(calls, 3)), /npm run build exited 3:\nobuild crashed at the end/);
  assert.deepEqual(readdirSync(`${f.slimRoot}/templates`), []);
});

// A crashed build can leave the folder undeletable for a while (measured: EPERM on Windows), and the cleanup must not
// then hide why the build failed. A process left running in the folder stands in for it here (Windows refuses to
// delete a folder that is a process's working directory).
test('a failed build still reports its own error when the half-built folder cannot be removed', () => {
  const f = fixture('npm-held', (commit) => ({ built: committedLock(commit, { build: 'build' }) }));
  commitLockfile(f);
  const failing = fakeNpmBuild({ steps: [] }, 3);
  const held: { child: ChildProcess | null } = { child: null };
  const holding: Toolchain = {
    ...failing,
    run: (dir, script) => {
      held.child = spawn(process.execPath, ['-e', 'setTimeout(() => {}, 60000)'], { cwd: dir, stdio: 'ignore' });

      return failing.run(dir, script);
    },
  };

  try {
    assert.throws(
      () => buildTemplate(f.repo, f.slimRoot, f.clones, 'built', holding),
      (error: unknown) => {
        assert.ok(error instanceof Error);
        assert.match(error.message, /^npm run build exited 3:\nobuild crashed at the end/);
        const left = readdirSync(`${f.slimRoot}/templates`);

        if (left.length > 0) {
          assert.match(error.message, /could not be removed/);
        }

        return true;
      },
    );
  } finally {
    held.child?.kill();
  }
});
