import assert from 'node:assert/strict';
import fs, { mkdirSync, mkdtempSync, rmSync, statSync, symlinkSync, unlinkSync, utimesSync, writeFileSync } from 'node:fs';
import { syncBuiltinESMExports } from 'node:module';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';
import { after, mock, test } from 'node:test';

import { cycleLogs } from './cycle-logs.ts';

const root = mkdtempSync(join(tmpdir(), 'cycle-logs-'));

after(() => rmSync(root, { recursive: true, force: true }));

// Each test gets its own folder, so no test depends on files another test wrote.
function scenario(runName = 'b-1') {
  const runs = mkdtempSync(join(root, 'runs-'));
  const project = join(runs, runName);

  return {
    project,
    put(path: string, ageMs = 0): string {
      const full = join(runs, path);

      mkdirSync(join(full, '..'), { recursive: true });
      writeFileSync(full, 'x');

      const at = new Date(Date.now() - ageMs);

      utimesSync(full, at, at);

      return full;
    },
    credited(since = Date.now() - 60_000): string[] {
      return cycleLogs(since, project)
        .map((path) => relative(runs, path).split('\\').join('/'))
        .sort();
    },
  };
}

test('credits logs inside the run folder, beside it, and in the collected copy', () => {
  const run = scenario();

  run.put('b-1/src/cycle-notes.md');
  run.put('b-1.cycle.md');
  run.put('b-1.cycle-logs/harness.log');
  run.put('b-1.cycle-logs/cycle-log.md');

  assert.deepEqual(run.credited(), [
    'b-1.cycle-logs/cycle-log.md',
    'b-1.cycle-logs/harness.log',
    'b-1.cycle.md',
    'b-1/src/cycle-notes.md',
  ]);
});

test('ignores source, test and changelog files whose names contain log', () => {
  const run = scenario();

  run.put('b-1/src/log.ts');
  run.put('b-1/test/log.test.ts');
  run.put('b-1/CHANGELOG.md');
  run.put('b-1/src/log.md');

  assert.deepEqual(run.credited(), ['b-1/src/log.md']);
});

test('credits a log by its .md, .txt or .log extension and by nothing else', () => {
  const run = scenario();

  run.put('b-1/run-log.txt');
  run.put('b-1/RUN-LOG.LOG');
  run.put('b-1.run-log.txt');
  run.put('b-1.harness.log');
  run.put('b-1/run-log.json');
  run.put('b-1/run-log.md.bak');
  run.put('b-1.run-log.md.bak');

  assert.deepEqual(run.credited(), ['b-1.harness.log', 'b-1.run-log.txt', 'b-1/RUN-LOG.LOG', 'b-1/run-log.txt']);
});

test('ignores the start marker wherever it sits but credits a file that only begins like it', () => {
  const run = scenario();

  run.put('b-1.cycle-start');
  run.put('b-1/.cycle-start');
  run.put('b-1/cycle-start');
  run.put('b-1.cycle-logs/.cycle-start');
  run.put('b-1/cycle-start.md');

  assert.deepEqual(run.credited(), ['b-1/cycle-start.md']);
});

test('ignores the logs of other runs', () => {
  const run = scenario();

  run.put('b-2.cycle.md');
  run.put('b-10.cycle.md');
  run.put('b-2/cycle.md');

  assert.deepEqual(run.credited(), []);
});

test('ignores a file named after another run that happens to start with this run name', () => {
  const run = scenario();

  run.put('b-1x.cycle.md');
  run.put('b-1.cycle.md');

  assert.deepEqual(run.credited(), ['b-1.cycle.md']);
});

test('judges a file beside the run folder by the name after the run name, not the whole name', () => {
  const run = scenario('cycle-log-run');

  run.put('cycle-log-run.notes.md');
  run.put('cycle-log-run.cycle.md');

  assert.deepEqual(run.credited(), ['cycle-log-run.cycle.md']);
});

test('ignores files older than the run and credits a file changed at the very start of the run', () => {
  const run = scenario();

  run.put('b-1/old-cycle.md', 3_600_000);
  run.put('b-1.old-cycle.md', 3_600_000);
  run.put('b-1.cycle-logs/old-cycle.md', 3_600_000);

  const start = run.put('b-1/start-cycle.md');

  assert.deepEqual(run.credited(statSync(start).mtimeMs), ['b-1/start-cycle.md']);
});

test('skips anything under a node_modules folder in the run folder and in the collected copy', () => {
  const run = scenario();

  run.put('b-1/node_modules/dep/cycle-notes.md');
  run.put('b-1/e2e/node_modules/cycle.md');
  run.put('b-1.cycle-logs/node_modules/dep/cycle.md');
  run.put('b-1/node_modules_kept/cycle.md');

  assert.deepEqual(run.credited(), ['b-1/node_modules_kept/cycle.md']);
});

test('returns nothing when the run folder and the collected copy do not exist', () => {
  const run = scenario();

  assert.deepEqual(run.credited(), []);
});

test('skips a dangling symlink named like a log instead of failing', (context) => {
  const run = scenario();

  run.put('b-1/cycle-real.md');

  try {
    symlinkSync(join(run.project, 'nowhere'), join(run.project, 'cycle-dangling.md'));
  } catch (error) {
    context.skip(`cannot create a symlink here: ${String(error)}`);

    return;
  }

  assert.deepEqual(run.credited(), ['b-1/cycle-real.md']);
});

test('skips a log that vanishes between the folder listing and the check', () => {
  const run = scenario();
  const vanishing = run.put('b-1/cycle-vanishing.md');

  run.put('b-1/cycle-kept.md');

  const real = fs.lstatSync;
  const spy = mock.method(fs, 'lstatSync', (file: fs.PathLike, options: fs.StatSyncOptions & { bigint?: false; throwIfNoEntry: false }) => {
    if (file === vanishing) {
      unlinkSync(vanishing);
    }

    return real(file, options);
  });

  syncBuiltinESMExports();

  try {
    assert.deepEqual(run.credited(), ['b-1/cycle-kept.md']);
  } finally {
    spy.mock.restore();
    syncBuiltinESMExports();
  }
});
