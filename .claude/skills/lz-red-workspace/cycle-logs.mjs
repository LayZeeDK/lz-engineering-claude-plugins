// The cycle logs credited to one eval run, read by rules-ab-kata/grade.mjs and e2e-rgr-srvx/grade-rgr.mjs.
// Arm-b sessions may write their log into the shared rules folder or SLIM_ROOT, which every run reuses, so the
// runner copies the files changed there during the run into `<run folder>.cycle-logs` (collect_cycle_logs in
// slim-arms.sh). A run's logs are the files changed since the run started in that copy, in the run folder (outside
// node_modules), and beside the run folder as `<run folder>.<name>`, whose file name looks like a log: it contains
// "cycle", or it contains "log" with a .md, .txt or .log extension and is not a changelog. So `src/log.ts` and
// `CHANGELOG.md` in a run's project do not count.
import { existsSync, lstatSync, readdirSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';

const looksLikeLog = (name) =>
  name !== '' &&
  !/(^|\.)cycle-start$/.test(name) &&
  (/cycle/i.test(name) || (/log/i.test(name) && /\.(md|txt|log)$/i.test(name) && !/changelog/i.test(name)));

// lstat, so a dangling symlink named like a log is skipped instead of ending the grade run.
const changedFile = (since) => (file) => {
  const stat = lstatSync(file, { throwIfNoEntry: false });

  return stat?.isFile() === true && stat.mtimeMs >= since;
};

const matchingFiles = (folder, since) => {
  if (!existsSync(folder)) {
    return [];
  }

  return readdirSync(folder, { recursive: true })
    .map(String)
    .filter((rel) => looksLikeLog(basename(rel)) && !rel.split(/[\\/]/).includes('node_modules'))
    .map((rel) => join(folder, rel))
    .filter(changedFile(since));
};

const filesBeside = (project, since) => {
  const prefix = `${basename(project)}.`;

  return readdirSync(dirname(project))
    .filter((name) => name.startsWith(prefix) && looksLikeLog(name.slice(prefix.length)))
    .map((name) => join(dirname(project), name))
    .filter(changedFile(since));
};

/**
 * @param {number} since the run's start, epoch ms
 * @param {string} project the run folder
 * @returns {string[]} absolute paths
 */
export function cycleLogs(since, project) {
  return [
    ...matchingFiles(project, since),
    ...filesBeside(project, since),
    ...matchingFiles(`${project}.cycle-logs`, since),
  ];
}
