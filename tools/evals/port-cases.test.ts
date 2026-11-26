import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, test } from 'node:test';

import { evalRepo } from './cases.ts';
import { readGraders } from './grade.ts';
import { routingCases, routingSettings, triggerCases, triggerSettings, writeSuite, type PortedCase } from './port-cases.ts';

const root = mkdtempSync(join(tmpdir(), 'lz-evals-port-')).replaceAll('\\', '/');

after(() => rmSync(root, { recursive: true, force: true }));

function put(path: string, text: string): void {
  mkdirSync(join(path, '..'), { recursive: true });
  writeFileSync(path, text);
}

function git(repo: string, args: readonly string[]): string {
  const result = spawnSync('git', ['-C', repo, ...args], { encoding: 'utf8', windowsHide: true });

  if (result.status !== 0) {
    throw new Error(result.stderr);
  }

  return result.stdout.trim();
}

function commitAll(repo: string): string {
  git(repo, ['add', '-A']);
  git(repo, ['-c', 'user.name=lz-tdd-eval', '-c', 'user.email=larsbrinknielsen@gmail.com', 'commit', '-q', '--allow-empty', '-m', 'x']);

  return git(repo, ['rev-parse', '--short=7', 'HEAD']);
}

interface Entry {
  readonly query: string;
  readonly should_trigger: boolean;
  readonly note?: string;
}

function entries(fire: number, quiet: number, prefix: string): Entry[] {
  return [
    ...Array.from({ length: fire }, (_, i) => ({ query: `${prefix} fire ${String(i)}`, should_trigger: true })),
    ...Array.from({ length: quiet }, (_, i) => ({ query: `${prefix} quiet ${String(i)}`, should_trigger: false })),
  ];
}

const ws = '.claude/skills/lz-red-workspace/evals';
let count = 0;

// A repository whose recorded set is committed first and the current sets after, like the real history.
function sourceRepo(held: readonly Entry[], forward: readonly Entry[], chunk: readonly Entry[]): { repo: string; sha: string } {
  count += 1;
  const repo = `${root}/src-${String(count)}`;
  mkdirSync(repo, { recursive: true });
  git(repo, ['init', '-q']);
  put(`${repo}/${ws}/heldout-d09.json`, JSON.stringify(held.slice(0, 2)));
  const sha = commitAll(repo);
  put(`${repo}/${ws}/heldout-d09.json`, JSON.stringify(held));
  put(`${repo}/${ws}/trigger-eval.json`, JSON.stringify(forward));
  put(`${repo}/${ws}/d07-chunks/negatives.json`, JSON.stringify(chunk));
  commitAll(repo);

  return { repo, sha };
}

function spec(sha: string): { files: string[]; record: { sha: string; path: string } } {
  return {
    files: [`${ws}/heldout-d09.json`, `${ws}/trigger-eval.json`, `${ws}/d07-chunks/negatives.json`],
    record: { sha, path: `${ws}/heldout-d09.json` },
  };
}

const canary: Entry = { query: 'canary query', should_trigger: true, note: 'CANARY: known-good, excluded' };

test('triggerCases unions the sets by query in first-appearance order, names and tags every case', () => {
  const held = [canary, ...entries(6, 5, 'held')];
  const { repo, sha } = sourceRepo([canary, { query: 'held fire 0', should_trigger: true }], [...entries(2, 1, 'fwd'), { query: 'held fire 1', should_trigger: true }], entries(0, 2, 'chunk'));
  put(`${repo}/${ws}/heldout-d09.json`, JSON.stringify(held));
  commitAll(repo);
  const cases = triggerCases(repo, 'lz-red', spec(sha));

  assert.equal(cases.length, 11 + 1 + 3 + 2);
  assert.deepEqual(cases.slice(0, 3).map((c) => [c.name, c.body]), [
    ['trigger-lz-red-01', 'canary query\n'],
    ['trigger-lz-red-02', 'held fire 0\n'],
    ['trigger-lz-red-03', 'held fire 1\n'],
  ]);
  assert.deepEqual(cases[0]?.tags, ['trigger', 'lz-red', 'fire', 'heldout', 'canary']);
  assert.deepEqual(cases[1]?.tags, ['trigger', 'lz-red', 'fire', 'heldout', `rec-${sha}`, 'baseline']);
  assert.deepEqual(cases[2]?.tags, ['trigger', 'lz-red', 'fire', 'forward', 'heldout', 'baseline']);
  assert.deepEqual(cases.at(-1)?.tags, ['trigger', 'lz-red', 'quiet', 'chunk']);
});

test('baseline goes on the first five fire and first five quiet cases that are not canaries', () => {
  const { repo, sha } = sourceRepo([], entries(0, 0, 'f'), []);
  put(`${repo}/${ws}/heldout-d09.json`, JSON.stringify([canary, ...entries(7, 6, 'held')]));
  put(`${repo}/${ws}/trigger-eval.json`, '[]');
  put(`${repo}/${ws}/d07-chunks/negatives.json`, '[]');
  commitAll(repo);
  const cases = triggerCases(repo, 'lz-red', spec(sha));
  const baseline = cases.filter((c) => c.tags.includes('baseline'));

  assert.deepEqual(
    baseline.map((c) => c.body.trim()),
    ['held fire 0', 'held fire 1', 'held fire 2', 'held fire 3', 'held fire 4', 'held quiet 0', 'held quiet 1', 'held quiet 2', 'held quiet 3', 'held quiet 4'],
  );
});

test('fewer than five non-canary cases of a label, or one query with two labels, throws', () => {
  const few = sourceRepo([], [], []);
  put(`${few.repo}/${ws}/heldout-d09.json`, JSON.stringify(entries(5, 4, 'h')));
  commitAll(few.repo);
  assert.throws(() => triggerCases(few.repo, 'lz-red', spec(few.sha)), /fewer than 5 quiet/);

  const clash = sourceRepo([], entries(5, 5, 'h'), [{ query: 'h fire 0', should_trigger: false }]);
  put(`${clash.repo}/${ws}/heldout-d09.json`, '[]');
  commitAll(clash.repo);
  assert.throws(() => triggerCases(clash.repo, 'lz-red', spec(clash.sha)), /h fire 0.*two labels/);
});

test('a fire case grades its skill fired and both siblings quiet; a quiet case grades its skill quiet', () => {
  const { repo, sha } = sourceRepo([], entries(5, 5, 'h'), []);
  put(`${repo}/${ws}/heldout-d09.json`, '[]');
  commitAll(repo);
  const [fire] = triggerCases(repo, 'lz-red', spec(sha));
  const quiet = triggerCases(repo, 'lz-red', spec(sha)).at(-1);

  assert.deepEqual(fire?.graders, [
    { name: 'skill-fired', skill: 'lz-red', quiet: false },
    { name: 'sibling-quiet-lz-tpp', skill: 'lz-tpp', quiet: true },
    { name: 'sibling-quiet-lz-refactor', skill: 'lz-refactor', quiet: true },
  ]);
  assert.deepEqual(quiet?.graders, [{ name: 'quiet', skill: 'lz-red', quiet: true }]);
});

test('writeSuite writes prompts and graders the harness reads, drops stale cases, and a second run changes nothing', () => {
  const repo = `${root}/write`;
  mkdirSync(repo, { recursive: true });
  git(repo, ['init', '-q']);
  const dir = `${repo}/evals/lz-tdd/trigger-x`;
  const cases: PortedCase[] = [
    { name: 'trigger-x-01', tags: ['trigger', 'fire'], body: 'a query\n', graders: [{ name: 'skill-fired', skill: 'lz-red', quiet: false }] },
    { name: 'trigger-x-02', tags: ['trigger', 'quiet'], body: 'b query\n', graders: [{ name: 'quiet', skill: 'lz-red', quiet: true }] },
  ];
  put(`${dir}/trigger-x-03/prompt.md`, 'stale\n');
  writeSuite(dir, { backend: 'plugin-eval', ablation: 'none', skill: 'lz-red' }, cases, triggerSettings);

  assert.equal(existsSync(`${dir}/trigger-x-03`), false);
  assert.equal(
    readFileSync(`${dir}/trigger-x-01/prompt.md`, 'utf8'),
    '---\ntags: [trigger, fire]\nmax_turns: 10\nallowed_tools: [Read, Glob, Grep, Skill]\ndisallowed_tools: [Agent]\n---\n\na query\n',
  );
  writeSuite(`${repo}/evals/lz-tdd/routing-x`, { backend: 'plugin-eval', ablation: 'none', skill: null }, [{ name: 'routing-x-01', tags: ['trigger', 'fire'], body: 'a query\n', graders: [] }], routingSettings);
  assert.equal(
    readFileSync(`${repo}/evals/lz-tdd/routing-x/routing-x-01/prompt.md`, 'utf8'),
    '---\ntags: [trigger, fire]\nmax_turns: 3\nallowed_tools: [Read, Glob, Grep, Skill]\n---\n\na query\n',
  );
  assert.deepEqual(
    readGraders(`${dir}/trigger-x-02`).map(({ name, tool, inputMatch, min, max, arm }) => ({ name, tool, inputMatch, min, max, arm })),
    [{ name: 'quiet', tool: 'Skill', inputMatch: '"skill"\\s*:\\s*"(?:[\\w-]+:)?lz-red"', min: 0, max: 0, arm: 'both' }],
  );
  assert.equal(readGraders(`${dir}/trigger-x-01`)[0]?.max, null);

  commitAll(repo);
  writeSuite(dir, { backend: 'plugin-eval', ablation: 'none', skill: 'lz-red' }, cases, triggerSettings);
  assert.equal(git(repo, ['status', '--porcelain']), '');
});

test('the real sets give the planned counts, record tags and baseline picks', () => {
  const repo = evalRepo({});
  const expected = { 'lz-red': [36, 18, 12, 'rec-8cd13a8'], 'lz-tpp': [28, 14, 27, 'rec-5f586da'], 'lz-refactor': [30, 16, 20, 'rec-f23c7f8'] } as const;

  for (const [skill, [total, fire, recorded, tag]] of Object.entries(expected)) {
    const cases = triggerCases(repo, skill);
    const baseline = cases.filter((c) => c.tags.includes('baseline'));

    assert.equal(cases.length, total, skill);
    assert.equal(cases.filter((c) => c.tags.includes('fire')).length, fire, skill);
    assert.equal(cases.filter((c) => c.tags.includes(tag)).length, recorded, skill);
    assert.equal(baseline.length, 10, skill);
    assert.equal(baseline.filter((c) => c.tags.includes('canary')).length, 0, skill);

    if (skill === 'lz-red') {
      assert.ok(baseline.every((c) => c.tags.includes('heldout')));
    }
  }
});

test('routingCases gives the nine corpus prompts verbatim with owner and quiet graders', () => {
  const cases = routingCases(evalRepo({}));
  const byName = new Map(cases.map((c) => [c.name, c]));

  assert.deepEqual([...byName.keys()], Array.from({ length: 9 }, (_, i) => `routing-c${String(i + 1)}`));
  assert.equal(byName.get('routing-c1')?.body, 'I just finished making a test pass. What now?\n');
  assert.deepEqual(byName.get('routing-c4')?.graders, [
    { name: 'owner-fired', skill: 'lz-red', quiet: false },
    { name: 'quiet-lz-refactor', skill: 'lz-refactor', quiet: true },
  ]);
  assert.deepEqual(byName.get('routing-c9')?.graders.map((g) => [g.name, g.quiet]), [
    ['quiet-lz-red', true],
    ['quiet-lz-tpp', true],
    ['quiet-lz-refactor', true],
  ]);
});
