// The cycle logs credited to one eval run, for a grader that scores whether a session kept a TDD cycle log.
// Arm-b sessions may write their log into the shared rules folder or SLIM_ROOT, which every run reuses, so the
// runner copies the files changed there during the run into `<run folder>.cycle-logs`. A run's logs are the files changed since the run started in that copy, in the run folder (outside
// node_modules), and beside the run folder as `<run folder>.<name>`, whose file name looks like a log: it contains
// "cycle", or it contains "log" with a .md, .txt or .log extension and is not a changelog. So `src/log.ts` and
// `CHANGELOG.md` in a run's project do not count.
import { existsSync, lstatSync, readdirSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';

const looksLikeLog = (name: string): boolean =>
  !/(^|\.)cycle-start$/.test(name) &&
  (/cycle/i.test(name) || (/log/i.test(name) && /\.(md|txt|log)$/i.test(name) && !/changelog/i.test(name)));

// lstat, so a dangling symlink named like a log is skipped instead of ending the grade run.
const changedFile = (since: number) => (file: string): boolean => {
  const stat = lstatSync(file, { throwIfNoEntry: false });

  return stat?.isFile() === true && stat.mtimeMs >= since;
};

const matchingFiles = (folder: string, since: number): string[] => {
  if (!existsSync(folder)) {
    return [];
  }

  // Stryker disable next-line StringLiteral: an empty encoding falls back to utf8, so no result changes; the literal only selects the string[] overload
  return readdirSync(folder, { recursive: true, encoding: 'utf8' })
    .filter((rel) => looksLikeLog(basename(rel)) && !rel.split(/[\\/]/).includes('node_modules'))
    .map((rel) => join(folder, rel))
    .filter(changedFile(since));
};

const filesBeside = (project: string, since: number): string[] => {
  const prefix = `${basename(project)}.`;

  return readdirSync(dirname(project))
    .filter((name) => name.startsWith(prefix) && looksLikeLog(name.slice(prefix.length)))
    .map((name) => join(dirname(project), name))
    .filter(changedFile(since));
};

// since is the run's start in epoch ms, project is the run folder; returns absolute paths.
export function cycleLogs(since: number, project: string): string[] {
  return [
    ...matchingFiles(project, since),
    ...filesBeside(project, since),
    ...matchingFiles(`${project}.cycle-logs`, since),
  ];
}
