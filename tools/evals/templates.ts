// Slim run templates (D-05, D-12): a kata at a pinned commit with its toolchain installed from a sha256-checked
// lockfile, optionally armed (an approvals snapshot written and proved) and given a known-red overlay, committed as
// one git repository. Each slim run starts in a fresh copy of one. Repository-only; nothing here ships with the plugin.
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { copyFileSync, cpSync, existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { assertName, isRecord, readJson } from './guards.ts';
import { forwardSlashes } from './run-set.ts';
import { archiveInto, git, gitIn } from './stage.ts';

export interface Recipe {
  readonly clone: string;
  readonly commit: string;
  readonly subdir: string;
  readonly lockfile: { readonly path: string; readonly sha256: string };
  readonly arm: { readonly spec: string; readonly snapshot: string; readonly blob: string } | null;
  readonly overlay: string | null;
  readonly red: { readonly spec: string } | null;
}

const segment = /^[A-Za-z0-9._-]+$/;

// A path relative to the clone or the template: forward slashes, no drive, no `.` or `..` segment.
function relativePath(value: unknown, what: string): string {
  if (typeof value !== 'string' || !value.split('/').every((part) => segment.test(part) && part !== '.' && part !== '..')) {
    throw new Error(`${what} must be a relative path of plain names, not ${JSON.stringify(value)}`);
  }

  return value;
}

function hex(value: unknown, length: number, what: string): string {
  if (typeof value !== 'string' || !new RegExp(`^[0-9a-f]{${String(length)}}$`).test(value)) {
    throw new Error(`${what} must be ${String(length)} lowercase hex digits`);
  }

  return value;
}

function only(value: unknown, keys: readonly string[], what: string): Record<string, unknown> {
  if (!isRecord(value)) {
    throw new Error(`${what} must be a JSON object`);
  }

  const unknown = Object.keys(value).filter((key) => !keys.includes(key));

  if (unknown.length > 0) {
    throw new Error(`${what}: unknown keys ${unknown.join(', ')}`);
  }

  return value;
}

function recipe(value: unknown, what: string): Recipe {
  const fields = only(value, ['clone', 'commit', 'subdir', 'lockfile', 'arm', 'overlay', 'red'], what);
  const lockfile = only(fields['lockfile'], ['path', 'sha256'], `${what} lockfile`);
  const arm = fields['arm'] ?? null;
  const red = fields['red'] ?? null;
  const overlay = fields['overlay'] ?? null;
  const clone = relativePath(fields['clone'], `${what} clone`);

  if (clone.split('/').length !== 2) {
    throw new Error(`${what} clone must be <org>/<repo> below LZ_EVAL_CLONES`);
  }

  const armFields = arm === null ? null : only(arm, ['spec', 'snapshot', 'blob'], `${what} arm`);
  const redFields = red === null ? null : only(red, ['spec'], `${what} red`);

  // Key order is fixed here, so the recipe hash in the template folder name is stable.
  return {
    clone,
    commit: hex(fields['commit'], 40, `${what} commit`),
    subdir: relativePath(fields['subdir'], `${what} subdir`),
    lockfile: {
      path: relativePath(lockfile['path'], `${what} lockfile path`),
      sha256: hex(lockfile['sha256'], 64, `${what} lockfile sha256`),
    },
    arm:
      armFields === null
        ? null
        : {
            spec: relativePath(armFields['spec'], `${what} arm spec`),
            snapshot: relativePath(armFields['snapshot'], `${what} arm snapshot`),
            blob: hex(armFields['blob'], 40, `${what} arm blob`),
          },
    overlay: overlay === null ? null : relativePath(overlay, `${what} overlay`),
    red: redFields === null ? null : { spec: relativePath(redFields['spec'], `${what} red spec`) },
  };
}

export function templatesFile(repo: string): string {
  return `${repo}/evals/lz-tdd-apply/templates.json`;
}

export function readTemplates(repo: string): Map<string, Recipe> {
  const file = templatesFile(repo);
  const value = readJson(file);

  if (!isRecord(value)) {
    throw new Error(`${file} is not a JSON object`);
  }

  return new Map(Object.entries(value).map(([name, entry]) => [assertName('template', name), recipe(entry, `${file} ${name}`)]));
}

function sha256(text: string | Buffer): string {
  return createHash('sha256').update(text).digest('hex');
}

export function templateDir(slimRoot: string, name: string, template: Recipe): string {
  return `${slimRoot}/templates/${name}-${template.commit.slice(0, 12)}-${sha256(JSON.stringify(template)).slice(0, 8)}`;
}

// Inside .git, so a copy carries it without git status or the session seeing an untracked file.
function markerOf(dir: string): string {
  return `${dir}/.git/template.json`;
}

export interface TestRun {
  readonly status: number | null;
  // The end of the runner's output, for the error when a run goes wrong.
  readonly output: string;
}

// The install and the test runs, replaceable so the unit tests stay offline.
export interface Toolchain {
  readonly install: (dir: string) => void;
  readonly vitest: (dir: string, args: readonly string[]) => TestRun;
}

// The child's environment with <dir>/node_modules/.bin first on its PATH, as `npx` gives a script: the kata's
// approvals spec starts `ts-node` by name. Windows spells the variable Path, so the existing key is kept.
export function withLocalBin(dir: string, env: NodeJS.ProcessEnv): NodeJS.ProcessEnv {
  const key = Object.keys(env).find((name) => name.toUpperCase() === 'PATH') ?? 'PATH';
  const separator = process.platform === 'win32' ? ';' : ':';
  const bin = join(dir, 'node_modules', '.bin');

  return { ...env, [key]: env[key] === undefined || env[key] === '' ? bin : `${bin}${separator}${env[key]}` };
}

// Stryker disable all: spawns npm and vitest, which the unit tests replace
// A .cmd shim cannot be spawned without a shell, so npm runs as its own script under this Node.js.
export const kataToolchain: Toolchain = {
  install: (dir) => {
    const npm = join(dirname(process.execPath), 'node_modules/npm/bin/npm-cli.js');
    const result = spawnSync(process.execPath, [npm, 'ci', '--ignore-scripts', '--no-audit', '--no-fund'], {
      cwd: dir,
      encoding: 'utf8',
      maxBuffer: 64 * 1024 * 1024,
      windowsHide: true,
    });

    if (result.status !== 0) {
      throw new Error(`npm ci in ${dir} exited ${String(result.status)}: ${(result.stderr ?? '').slice(-1500)}`);
    }
  },
  vitest: (dir, args) => {
    const result = spawnSync(process.execPath, ['node_modules/vitest/vitest.mjs', ...args], {
      cwd: dir,
      env: withLocalBin(dir, process.env),
      encoding: 'utf8',
      maxBuffer: 64 * 1024 * 1024,
      windowsHide: true,
    });

    return { status: result.status, output: `${result.stdout ?? ''}${result.stderr ?? ''}${result.error?.message ?? ''}`.slice(-2000) };
  },
};
// Stryker restore all

function arm(dir: string, template: Recipe, toolchain: Toolchain): void {
  if (template.arm === null) {
    return;
  }

  // The update flag is explicit and --ci is never passed: CI mode refuses to write a new snapshot.
  const wrote = toolchain.vitest(dir, ['run', template.arm.spec, '-u']);

  if (wrote.status !== 0) {
    throw new Error(`arming ${template.arm.spec} failed: the update run exited ${String(wrote.status)}:\n${wrote.output}`);
  }

  const proved = toolchain.vitest(dir, ['run', template.arm.spec]);

  if (proved.status !== 0) {
    throw new Error(`arming ${template.arm.spec} failed: the plain re-run exited ${String(proved.status)}:\n${proved.output}`);
  }

  const blob = git(dir, ['hash-object', template.arm.snapshot]);

  if (blob !== template.arm.blob) {
    throw new Error(`the armed snapshot ${template.arm.snapshot} is blob ${blob}, not ${template.arm.blob}`);
  }
}

// The red spec must fail on an assertion: at least one failed test, and no failed file without tests (which is a
// compile or collection error, not a red test).
function proveRed(dir: string, template: Recipe, toolchain: Toolchain): void {
  if (template.red === null) {
    return;
  }

  const report = `${dirname(dir)}/red-${String(process.pid)}.json`;

  try {
    const { status } = toolchain.vitest(dir, ['run', template.red.spec, '--reporter=json', `--outputFile=${report}`]);
    const json = existsSync(report) ? readJson(report) : null;
    const failed = isRecord(json) && typeof json['numFailedTests'] === 'number' ? json['numFailedTests'] : 0;
    const files = isRecord(json) && Array.isArray(json['testResults']) ? json['testResults'] : [];
    const broken = files.filter(
      (file) => isRecord(file) && file['status'] === 'failed' && (!Array.isArray(file['assertionResults']) || file['assertionResults'].length === 0),
    );

    if (status === 0 || failed < 1 || broken.length > 0) {
      throw new Error(`${template.red.spec} is not red on an assertion: exit ${String(status)}, ${String(failed)} failed tests, ${String(broken.length)} files failed without tests`);
    }
  } finally {
    rmSync(report, { force: true });
  }
}

function sameRecipe(dir: string, template: Recipe): boolean {
  const marker = markerOf(dir);
  const value = existsSync(marker) ? readJson(marker) : null;

  return isRecord(value) && JSON.stringify(value['recipe']) === JSON.stringify(template);
}

// Builds the template once in <dir>.tmp-<pid> and renames it into place, so a template folder exists only when
// complete; a folder already built from the same recipe is reused as it is.
export function buildTemplate(
  repo: string,
  slimRoot: string,
  clonesRoot: string,
  name: string,
  toolchain: Toolchain = kataToolchain,
): string {
  const template = readTemplates(repo).get(name);

  if (template === undefined) {
    throw new Error(`${templatesFile(repo)} has no template ${name}`);
  }

  const dir = templateDir(slimRoot, name, template);

  if (sameRecipe(dir, template)) {
    return dir;
  }

  const clone = `${clonesRoot}/${template.clone}`;

  if (gitIn(clone, ['cat-file', '-e', `${template.commit}^{commit}`]).status !== 0) {
    throw new Error(`fetch ${template.commit} into ${clone}`);
  }

  if (!template.lockfile.path.startsWith(`${template.subdir}/`)) {
    throw new Error(`${name}: the lockfile ${template.lockfile.path} is not below ${template.subdir}`);
  }

  const overlay = template.overlay === null ? null : `evals/lz-tdd-apply/${template.overlay}`;

  if (overlay !== null && gitIn(repo, ['rev-parse', '--verify', '--quiet', `HEAD:${overlay}`]).status !== 0) {
    throw new Error(`${name}: overlay missing: commit ${overlay}`);
  }

  const tmp = `${dir}.tmp-${String(process.pid)}`;
  rmSync(tmp, { recursive: true, force: true });
  mkdirSync(tmp, { recursive: true });

  try {
    archiveInto(clone, `${template.commit}:${template.subdir}`, tmp, tmp);
    const lockfile = `${tmp}/${template.lockfile.path.slice(template.subdir.length + 1)}`;
    copyFileSync(`${clone}/${template.lockfile.path}`, lockfile);
    const lockHash = sha256(readFileSync(lockfile));

    if (lockHash !== template.lockfile.sha256) {
      throw new Error(`${clone}/${template.lockfile.path} has sha256 ${lockHash}, not the pinned ${template.lockfile.sha256}`);
    }

    toolchain.install(tmp);
    arm(tmp, template, toolchain);

    if (overlay !== null) {
      archiveInto(repo, `HEAD:${overlay}`, tmp, `${tmp}-overlay`);
    }

    proveRed(tmp, template, toolchain);
    git(tmp, ['init', '-q']);
    // The kata's own .gitignore keeps node_modules and the lockfile out of the commit.
    git(tmp, ['add', '-A']);
    git(tmp, ['-c', 'user.name=lz-tdd-eval', '-c', 'user.email=larsbrinknielsen@gmail.com', '-c', 'commit.gpgsign=false', 'commit', '-q', '-m', `template ${name}`]);
    const tree = git(tmp, ['rev-parse', 'HEAD^{tree}']);
    writeFileSync(markerOf(tmp), `${JSON.stringify({ name, recipe: template, tree }, null, 2)}\n`);
    rmSync(dir, { recursive: true, force: true });
    renameSync(tmp, dir);
  } catch (error) {
    rmSync(tmp, { recursive: true, force: true });

    throw error;
  }

  return dir;
}

// A real copy of every file, links followed, so a run's node_modules goes with its run folder and nothing the
// session does can reach the template or the clone.
export function copyTemplate(dir: string, cwd: string, slimRoot: string): void {
  const runsRoot = `${forwardSlashes(slimRoot)}/runs/`;

  if (!forwardSlashes(cwd).startsWith(runsRoot)) {
    throw new Error(`${cwd} is not below ${runsRoot}; refusing to fill it`);
  }

  if (existsSync(cwd) && readdirSync(cwd).length > 0) {
    throw new Error(`${cwd} is not empty; a run starts in an empty folder`);
  }

  if (!existsSync(markerOf(dir))) {
    throw new Error(`${dir} is not a built template`);
  }

  cpSync(dir, cwd, { recursive: true, dereference: true });
}
