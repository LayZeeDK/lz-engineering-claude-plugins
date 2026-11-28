import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, test } from 'node:test';

import { assertName, isRecord, isStringArray, jsonLines, readJson, requireRecord } from './guards.ts';

const root = mkdtempSync(join(tmpdir(), 'lz-evals-guards-'));

after(() => rmSync(root, { recursive: true, force: true }));

test('assertName lets lowercase names through and stops anything that could leave the run set', () => {
  assert.equal(assertName('case', 'demo-01'), 'demo-01');
  assert.deepEqual(
    ['../x', 'A', '', '-x', 'a/b', 'a.b', 'C:'].map((name) => {
      try {
        assertName('case', name);

        return 'passed';
      } catch (error) {
        return error instanceof Error && error.message.startsWith('case name') ? 'refused' : 'other';
      }
    }),
    ['refused', 'refused', 'refused', 'refused', 'refused', 'refused', 'refused'],
  );
});

test('isRecord, requireRecord and isStringArray tell JSON objects and name lists apart', () => {
  assert.deepEqual(
    [{}, [], null, 'x', 1].map((value) => isRecord(value)),
    [true, false, false, false, false],
  );
  assert.deepEqual(
    [['a'], [], ['a', 1], 'a'].map((value) => isStringArray(value)),
    [true, true, false, false],
  );
  assert.deepEqual(requireRecord({ a: 1 }, 'thing'), { a: 1 });
  assert.throws(() => requireRecord([], 'thing'), /thing is not a JSON object/);
});

test('jsonLines keeps one value per parseable line and skips the rest', () => {
  assert.deepEqual(jsonLines('{"a":1}\r\nnot json\n\n[2]\n'), [{ a: 1 }, [2]]);
});

test('readJson names the file it cannot parse', () => {
  const good = join(root, 'good.json');
  const bad = join(root, 'bad.json');
  writeFileSync(good, '{"a":1}');
  writeFileSync(bad, '{"a":');
  assert.deepEqual(readJson(good), { a: 1 });
  assert.throws(() => readJson(bad), (error: unknown) => error instanceof Error && error.message.includes(bad));
});
