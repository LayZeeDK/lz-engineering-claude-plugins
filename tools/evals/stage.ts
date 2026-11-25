// Staging (D-07): a packaged copy of the plugin at one commit, from `git archive`, and beside it the same plugin with
// every committed plugin-eval case flattened under evals/<case>/, which is where `claude plugin eval` reads cases.
// Nothing is read from the plugin's working tree. Repository-only; nothing here ships with the plugin.
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { isRecord, isStringArray, readJson } from './guards.ts';
import { stageDir } from './run-set.ts';

export interface GitResult {
  readonly status: number | null;
  readonly stdout: string;
  readonly stderr: string;
}

export function gitIn(repo: string, args: readonly string[]): GitResult {
  const result = spawnSync('git', ['-C', repo, ...args], { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024, windowsHide: true });

  return { status: result.status, stdout: result.stdout ?? '', stderr: result.stderr ?? '' };
}

// Gives back git's trimmed output, or throws with its error text.
export function git(repo: string, args: readonly string[]): string {
  const result = gitIn(repo, args);

  if (result.status !== 0) {
    throw new Error(`git ${args.join(' ')} in ${repo} exited ${String(result.status)}: ${result.stderr.trim()}`);
  }

  return result.stdout.trim();
}

export function resolveCommit(repo: string, ref: string): string {
  const result = gitIn(repo, ['rev-parse', '--verify', '--quiet', `${ref}^{commit}`]);
  const sha = result.stdout.trim();

  if (result.status !== 0 || !/^[0-9a-f]{40}$/.test(sha)) {
    throw new Error(`${ref} names no commit in ${repo}`);
  }

  return sha;
}

export function pluginTree(repo: string, sha: string): string {
  return git(repo, ['rev-parse', `${sha}:plugins/lz-tdd`]);
}

// The committed trees of the two case roots, `<evals/lz-tdd>+<evals/lz-tdd-apply>` (`none` for a root HEAD lacks), or
// `none` when HEAD has neither. Run sets under evals/results stay out, so committing one never changes a run's cases.
export function casesTree(repo: string): string {
  const trees = ['evals/lz-tdd', 'evals/lz-tdd-apply'].map((root) => {
    const result = gitIn(repo, ['rev-parse', '--verify', '--quiet', `HEAD:${root}`]);

    return result.status === 0 ? result.stdout.trim() : 'none';
  });

  return trees.every((tree) => tree === 'none') ? 'none' : trees.join('+');
}

// Git Bash's GNU tar reads `C:` in a path as a remote host, so Windows uses its own tar.
export function extractTar(tarFile: string, dest: string): void {
  const tar = process.platform === 'win32' ? join(process.env['SystemRoot'] ?? 'C:/Windows', 'System32/tar.exe') : 'tar';
  mkdirSync(dest, { recursive: true });
  const result = spawnSync(tar, ['-xf', tarFile, '-C', dest], { encoding: 'utf8', windowsHide: true });

  if (result.status !== 0) {
    throw new Error(`${tar} -xf ${tarFile} exited ${String(result.status)}: ${(result.stderr ?? '').trim()}`);
  }
}

// Unpacks `git archive <treeish>` into dest.
export function archiveInto(repo: string, treeish: string, dest: string, scratch: string): void {
  const tarFile = `${scratch}.tar`;
  git(repo, ['archive', '--format=tar', '-o', tarFile, treeish]);

  try {
    extractTar(tarFile, dest);
  } finally {
    rmSync(tarFile, { force: true });
  }
}

export interface StageInfo {
  readonly sha: string;
  readonly pluginTree: string;
  readonly casesTree: string;
  readonly cases: readonly string[];
}

export function readStage(dir: string): StageInfo | null {
  const file = `${dir}/stage.json`;
  const value = existsSync(file) ? readJson(file) : null;

  if (!isRecord(value)) {
    return null;
  }

  const { sha, pluginTree: plugin, casesTree: cases, cases: names } = value;

  return typeof sha === 'string' && typeof plugin === 'string' && typeof cases === 'string' && isStringArray(names)
    ? { sha, pluginTree: plugin, casesTree: cases, cases: names }
    : null;
}

function exists(repo: string, treeish: string): boolean {
  return gitIn(repo, ['rev-parse', '--verify', '--quiet', treeish]).status === 0;
}

// The committed plugin-eval suites under evals/lz-tdd at HEAD, read from git rather than the working tree.
function committedPluginEvalSuites(repo: string): string[] {
  if (!exists(repo, 'HEAD:evals/lz-tdd')) {
    return [];
  }

  return git(repo, ['ls-tree', '--name-only', 'HEAD:evals/lz-tdd'])
    .split('\n')
    .filter((name) => name !== '' && exists(repo, `HEAD:evals/lz-tdd/${name}/suite.json`))
    .filter((name) => {
      const suite: unknown = JSON.parse(git(repo, ['show', `HEAD:evals/lz-tdd/${name}/suite.json`]));

      return isRecord(suite) && suite['backend'] === 'plugin-eval';
    });
}

// Copies plugin/ and every committed plugin-eval case into lz-tdd.tmp-<pid>, then renames it into place.
function buildCaseTarget(repo: string, dir: string): string[] {
  const target = `${dir}/lz-tdd`;
  const tmp = `${target}.tmp-${String(process.pid)}`;
  rmSync(tmp, { recursive: true, force: true });
  cpSync(`${dir}/plugin`, tmp, { recursive: true });
  const scratch = mkdtempSync(`${dir}/suites-`);
  const cases: string[] = [];

  try {
    for (const suite of committedPluginEvalSuites(repo)) {
      const unpacked = `${scratch}/${suite}`;
      archiveInto(repo, `HEAD:evals/lz-tdd/${suite}`, unpacked, unpacked);
      const names = readdirSync(unpacked, { withFileTypes: true })
        .filter((entry) => entry.isDirectory() && existsSync(`${unpacked}/${entry.name}/prompt.md`))
        .map((entry) => entry.name);

      for (const name of names) {
        if (cases.includes(name)) {
          throw new Error(`two committed cases are named ${name}; case names must be unique across plugin-eval suites`);
        }

        cases.push(name);
        mkdirSync(`${tmp}/evals`, { recursive: true });
        renameSync(`${unpacked}/${name}`, `${tmp}/evals/${name}`);
      }
    }
  } catch (error) {
    rmSync(tmp, { recursive: true, force: true });

    throw error;
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }

  rmSync(target, { recursive: true, force: true });
  renameSync(tmp, target);

  return cases.sort();
}

// Builds plugin/ once per commit; rebuilds lz-tdd/ whenever the committed evals/ tree has changed since it was built.
export function stageRef(repo: string, stageRoot: string, sha: string): string {
  const dir = stageDir(stageRoot, sha);
  const plugin = pluginTree(repo, sha);

  if (!existsSync(`${dir}/plugin`)) {
    const tmp = `${dir}.tmp-${String(process.pid)}`;
    rmSync(tmp, { recursive: true, force: true });
    mkdirSync(tmp, { recursive: true });

    try {
      archiveInto(repo, `${sha}:plugins/lz-tdd`, `${tmp}/plugin`, `${tmp}/plugin`);
      mkdirSync(dir, { recursive: true });
      renameSync(`${tmp}/plugin`, `${dir}/plugin`);
    } finally {
      rmSync(tmp, { recursive: true, force: true });
    }
  }

  const cases = casesTree(repo);
  const before = readStage(dir);

  if (before === null || before.casesTree !== cases || before.sha !== sha || !existsSync(`${dir}/lz-tdd`)) {
    const info: StageInfo = { sha, pluginTree: plugin, casesTree: cases, cases: buildCaseTarget(repo, dir) };
    writeFileSync(`${dir}/stage.json`, `${JSON.stringify(info, null, 2)}\n`);
  }

  return dir;
}
