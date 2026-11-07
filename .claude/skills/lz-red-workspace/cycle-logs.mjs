// The cycle logs credited to one eval run, read by rules-ab-kata/grade.mjs and e2e-rgr-srvx/grade-rgr.mjs.
// Arm-b sessions may write their log into the shared rules folder or SLIM_ROOT, which every run reuses, so the
// runner copies the files changed there during the run into `<run folder>.cycle-logs` (collect_cycle_logs in
// slim-arms.sh). A run's logs are the files in that copy and in the run folder changed since the run started,
// whose path matches /cycle|log/i, outside node_modules.
import { existsSync, lstatSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const matchingFiles = (folder, since) => {
  if (!existsSync(folder)) {
    return [];
  }

  return readdirSync(folder, { recursive: true })
    .map(String)
    .filter((rel) => /cycle|log/i.test(rel) && !rel.split(/[\\/]/).includes('node_modules'))
    .map((rel) => join(folder, rel))
    .filter((file) => {
      // lstat, so a dangling symlink named like a log is skipped instead of ending the grade run.
      const stat = lstatSync(file, { throwIfNoEntry: false });

      return stat?.isFile() === true && stat.mtimeMs >= since;
    });
};

/**
 * @param {number} since the run's start, epoch ms
 * @param {string} project the run folder
 * @returns {string[]} absolute paths
 */
export function cycleLogs(since, project) {
  return [...matchingFiles(project, since), ...matchingFiles(`${project}.cycle-logs`, since)];
}
