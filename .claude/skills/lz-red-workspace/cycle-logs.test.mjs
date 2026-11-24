import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, utimesSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';
import { after, test } from 'node:test';

import { cycleLogs } from './cycle-logs.mjs';

const root = mkdtempSync(join(tmpdir(), 'cycle-logs-'));
const runs = join(root, 'runs');
const project = join(runs, 'b-1');
const since = Date.now() - 60_000;

after(() => rmSync(root, { recursive: true, force: true }));

function file(path, ageMs = 0) {
  const full = join(runs, path);
  mkdirSync(join(full, '..'), { recursive: true });
  writeFileSync(full, 'x');
  const at = new Date(Date.now() - ageMs);
  utimesSync(full, at, at);
}

function credited() {
  return cycleLogs(since, project)
    .map((path) => relative(runs, path).split('\\').join('/'))
    .sort();
}

test('credits logs inside the run folder, beside it, and in the collected copy', () => {
  file('b-1/src/cycle-notes.md');
  file('b-1.cycle.md');
  file('b-1.cycle-logs/harness.log');
  file('b-1.cycle-logs/cycle-log.md');

  assert.deepEqual(credited(), [
    'b-1.cycle-logs/cycle-log.md',
    'b-1.cycle-logs/harness.log',
    'b-1.cycle.md',
    'b-1/src/cycle-notes.md',
  ]);
});

test('ignores source, test and changelog files whose names contain log', () => {
  file('b-1/src/log.ts');
  file('b-1/test/log.test.ts');
  file('b-1/CHANGELOG.md');

  assert.equal(credited().some((path) => /log\.ts|log\.test\.ts|CHANGELOG/.test(path)), false);
});

test('ignores the start marker, other runs and files older than the run', () => {
  file('b-1.cycle-start');
  file('b-2.cycle.md');
  file('b-1/old-cycle.md', 3_600_000);

  const paths = credited();

  assert.equal(paths.includes('b-1.cycle-start'), false);
  assert.equal(paths.includes('b-2.cycle.md'), false);
  assert.equal(paths.includes('b-1/old-cycle.md'), false);
});
