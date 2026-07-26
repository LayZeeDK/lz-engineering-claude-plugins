#!/usr/bin/env node
// arm-anchor.mjs -- ARM the Gilded Rose approvals snapshot inside a THROWAWAY checkout, and verify
// that arming took.
//
// THE PROBLEM. test/vitest/approvals.spec.ts uses toMatchSnapshot() but the kata commits NO
// snapshot (no __snapshots__/, no .snap). The characterization net is therefore LATENT, not armed,
// which makes "characterize the legacy code first" a defensible alternative answer to the RED
// prompt -- and that cost a scoreable result in pilot 3, where a model wrote a passing
// characterization test with a coherent Feathers justification. It graded false_green, correctly,
// but the target had no single right answer.
//
// MEASURED 2026-07-26 (this is the assumption TARGETS.md flagged as UNVERIFIED and
// documentation-derived; it is now a measurement). In a throwaway detached worktree of the kata
// with a copied toolchain, running the approvals spec BARE -- no update flag, no CI flag -- with
// vitest/0.28.5 win32-arm64 node-v24.18.0:
//
//   exit 0 in 2626 ms; "Snapshots 2 written"; "Tests 2 passed"; the snapshot file appears at
//   test/vitest/__snapshots__/approvals.spec.ts.snap, 11,552 bytes, holding both
//   `Gilded Rose Approval > should foo 1` and `Gilded Rose Approval > should thirtyDays 1`.
//
// So the documented behavior holds here: the missing snapshot IS auto-written and the run passes.
// NOTE THE COROLLARY -- CI mode refuses to write NEW snapshots, so the arming step must never run
// under --ci. This script does not pass it and the harness must not either.
//
// Arming does not DEPEND on that measurement either way: step 2 below writes with the runner's
// EXPLICIT update flag rather than relying on the auto-write, and step 3 proves the armed state
// with a plain re-run. A written-but-wrong snapshot fails that re-run.
//
// WHY COMMIT THE SNAPSHOT RATHER THAN EXCLUDE IT. run-e2e.mjs captures with `git add -A` then
// `git diff --cached <APPLY_BASE>`, and resets `--hard <APPLY_BASE>` + `clean -fd` between runs.
//   - Leaving the snapshot UNTRACKED puts it in the captured diff and in changed_files, which is
//     attribution poison: the model would be graded for a file it never touched.
//   - .git/info/exclude would hide it from `git add -A` and survive `clean -fd` (no -x), but it
//     would ALSO hide any snapshot the MODEL writes. That is a measurement hole in the direction
//     that matters most, so it is rejected.
//   - COMMITTING it makes it part of the base: invisible to the diff by construction, restored
//     exactly by each inter-run reset, and a model-written snapshot change still shows up.
// It also matches what the kata maintainer already did in the sibling TypeScript-deno variant,
// which ships an armed 388-line snapshot for the identical updateQuality logic and the identical
// golden-master driver. Arming the TypeScript variant brings it to parity rather than inventing
// something.
//
// WHAT ARMING DOES NOT FIX, and it must be recorded rather than quietly hoped away: the kata's
// OTHER spec, test/vitest/gilded-rose.spec.ts, ships a permanently failing placeholder
// (`expect(items[0].name).toBe('fixme')`). A model can still "answer" by tightening that existing
// test rather than adding one, which the attribution gate grades `unattributable` -- an instrument
// artifact needing hand inspection. Arming narrows the characterize-first branch only.
//
// THE COMMIT MOVES HEAD AHEAD OF main, which run-e2e.mjs refuses (it will not orphan commits).
// Both run-e2e.mjs and grade-red.mjs read `process.env.E2E_APPLY_BASE || suite.applyBase`, so
// --arm prints the exact export line and RUN-GATE tells the operator to use it for BOTH the drive
// AND every grade. The two steps do NOT fail the same way: forgetting the export on the DRIVE is
// loud (run-e2e computes `rev-list APPLY_BASE..HEAD` and throws), while forgetting it on a later
// `grade-red --run` was SILENT until the GRC suite gained requireExplicitApplyBase.
//
// The throwaway is DETACHED (`git worktree add --detach`), so no named branch lands on the
// borrowed kata and the armed commit is unreachable after teardown.
//
// Usage:
//   node arm-anchor.mjs --arm    <throwaway checkout>   # write, prove, commit, print the export
//   node arm-anchor.mjs --verify <throwaway checkout>   # exit 0 only if genuinely armed

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SUITE_DIR = path.join(HERE, 'e2e-red-gilded-rose');

// Paths RELATIVE TO THE SUITE'S repo subdir (the kata's TypeScript/). The subdir itself is derived
// from suite.json rather than hardcoded, so a suite whose repo IS its git root needs no change.
const SPEC_REL = 'test/vitest/approvals.spec.ts';
const SNAPSHOT_REL = 'test/vitest/__snapshots__/approvals.spec.ts.snap';
const ARM_COMMIT_MESSAGE =
  'test: arm the approvals snapshot so the characterization net is not latent';

function die(msg) {
  console.error(`arm-anchor: ${msg}`);
  process.exit(1);
}

function git(cwd, args, { mustSucceed = false } = {}) {
  const r = spawnSync('git', args, { cwd, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024, windowsHide: true });

  if (mustSucceed && r.status !== 0) {
    die(`git ${args.join(' ')} failed (exit ${r.status}) in ${cwd}: ${(r.stderr || '').trim()}`);
  }

  return r;
}

// The canonical, long-form absolute path. On Windows os.tmpdir() hands back the 8.3 SHORT form
// (C:\Users\LARSGY~1\...) while git reports its toplevel in LONG form, so two strings naming the
// SAME directory compare unequal. That is not a cosmetic difference here: it is the same path-form
// hazard resolveArmCwd() fails closed on, and comparing raw strings would both (a) refuse a
// perfectly valid throwaway under the temp dir and (b) let a short-form path slip past the
// pristine-checkout containment check below. realpath is the correct identity test.
//
// A path that does not exist cannot be canonicalised; fall back to path.resolve so callers still
// get a comparable absolute string (the caller checks existence separately).
function canon(p) {
  try {
    return fs.realpathSync.native(path.resolve(p));
  } catch {
    return path.resolve(p);
  }
}

// Is `inner` the same directory as `outer`, or nested inside it? Used in BOTH directions, so a
// throwaway that CONTAINS the pristine checkout is refused as well as one that IS it.
export function isSameOrNested(inner, outer) {
  const a = canon(inner);
  const b = canon(outer);

  return a === b || a.startsWith(b + path.sep);
}

// Resolve the suite's pristine repo, its git root, and the subdir offset between them.
function loadPristine() {
  const suite = JSON.parse(fs.readFileSync(path.join(SUITE_DIR, 'suite.json'), 'utf8'));
  const repo = suite.repo;

  if (!repo || !fs.existsSync(repo)) {
    die(`the suite's repo is not on disk (${repo}); nothing to arm against`);
  }

  const root = (git(repo, ['rev-parse', '--show-toplevel'], { mustSucceed: true }).stdout || '').trim();

  return { repo, root, rel: path.relative(path.resolve(root), path.resolve(repo)).split(path.sep).join('/') };
}

// Every guard that must hold before this script writes or commits anything. Returns the resolved
// throwaway root and the cwd the runner has to use inside it.
function resolveThrowaway(given, { requireClean }) {
  if (!given) {
    die('missing the throwaway checkout path');
  }

  const wanted = path.resolve(given);

  if (!fs.existsSync(wanted)) {
    die(`the throwaway checkout does not exist: ${wanted}`);
  }

  const pristine = loadPristine();

  // NEVER the pristine checkout. Checked both ways round so a path that merely CONTAINS the
  // borrowed repo is refused too -- a recursive `git add`/commit from there would sweep it in.
  if (isSameOrNested(wanted, pristine.root) || isSameOrNested(pristine.root, wanted)) {
    die(
      `refusing to operate on ${wanted}: it is, contains, or is inside the PRISTINE borrowed checkout ` +
        `(${pristine.root}). Arming happens in a throwaway worktree only.`,
    );
  }

  const top = (git(wanted, ['rev-parse', '--show-toplevel']).stdout || '').trim();

  if (!top) {
    die(`${wanted} is not a git worktree`);
  }

  if (canon(top) !== canon(wanted)) {
    die(`${wanted} is not the ROOT of its worktree (git reports ${top}); pass the checkout root`);
  }

  // A named branch on the borrowed repo is out of bounds -- the throwaway must be detached, so the
  // arming commit is unreachable once the worktree is gone.
  if (git(wanted, ['symbolic-ref', '--quiet', 'HEAD']).status === 0) {
    const branch = (git(wanted, ['rev-parse', '--abbrev-ref', 'HEAD']).stdout || '').trim();
    die(
      `${wanted} is on branch '${branch}', not a DETACHED HEAD. Create it with ` +
        '`git worktree add --detach`: a named branch on the borrowed repo is out of bounds, and the arming ' +
        'commit must not be reachable after teardown.',
    );
  }

  if (requireClean) {
    const porcelain = (git(wanted, ['status', '--porcelain']).stdout || '').trim();

    if (porcelain) {
      die(`${wanted} is not clean, so an arming commit could sweep in unrelated changes:\n${porcelain}`);
    }
  }

  const armCwd = pristine.rel ? path.join(wanted, pristine.rel) : wanted;

  if (!fs.existsSync(armCwd)) {
    die(`the suite's repo subdir is missing from the throwaway: ${armCwd}`);
  }

  return { wanted, armCwd, pristine };
}

// The snapshot's path relative to the WORKTREE ROOT (what git stages), vs its absolute path.
function snapshotPaths({ wanted, armCwd, pristine }) {
  const rootRel = pristine.rel ? `${pristine.rel}/${SNAPSHOT_REL}` : SNAPSHOT_REL;

  return { rootRel, abs: path.join(armCwd, ...SNAPSHOT_REL.split('/')), specAbs: path.join(armCwd, ...SPEC_REL.split('/')) };
}

function runSpec(armCwd, extraArgs, label) {
  const cmd = `npx vitest run ${SPEC_REL}${extraArgs ? ` ${extraArgs}` : ''}`;
  const started = Date.now();
  const r = spawnSync(cmd, {
    cwd: armCwd,
    shell: true,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
    windowsHide: true,
  });
  console.log(`arm-anchor: ${label} -> exit ${r.status} (${Date.now() - started} ms)`);

  return r;
}

function arm(given) {
  const ctx = resolveThrowaway(given, { requireClean: true });
  const { rootRel, abs, specAbs } = snapshotPaths(ctx);

  if (!fs.existsSync(specAbs)) {
    die(`the approvals spec is missing from the throwaway: ${specAbs}`);
  }

  if (!fs.existsSync(path.join(ctx.armCwd, 'node_modules'))) {
    die(
      `${ctx.armCwd} has no node_modules, so the runner cannot write a snapshot. Give the throwaway a ` +
        'toolchain first (RUN-GATE step 3a2).',
    );
  }

  // Step 2: write with the runner's EXPLICIT update flag rather than leaning on the auto-write.
  // Never --ci: CI mode refuses to write NEW snapshots.
  const wrote = runSpec(ctx.armCwd, '--update', 'write the snapshot (explicit --update)');

  if (wrote.status !== 0) {
    die(`the snapshot-writing run failed:\n${(wrote.stdout || '').slice(-1500)}\n${(wrote.stderr || '').slice(-800)}`);
  }

  if (!fs.existsSync(abs)) {
    die(`the runner exited 0 but wrote no snapshot at ${abs}`);
  }

  const bytes = fs.statSync(abs).size;

  if (bytes === 0) {
    die(`the snapshot at ${abs} is EMPTY, so nothing is actually characterized`);
  }

  // Step 3: the real proof. A written-but-wrong snapshot fails a plain re-run.
  const proof = runSpec(ctx.armCwd, '', 'prove the armed state (plain re-run)');

  if (proof.status !== 0) {
    die(
      'the armed snapshot does NOT pass a plain re-run, so it characterizes something other than current ' +
        `behavior:\n${(proof.stdout || '').slice(-1500)}`,
    );
  }

  // Step 4: stage that ONE file BY NAME. Never `git add -A` -- the throwaway may hold a toolchain
  // and other untracked output, and none of it belongs in the base.
  git(ctx.wanted, ['add', '--', rootRel], { mustSucceed: true });

  const staged = (git(ctx.wanted, ['diff', '--cached', '--name-only']).stdout || '').trim().split('\n').filter(Boolean);

  if (staged.length !== 1 || staged[0] !== rootRel) {
    die(`expected exactly ${rootRel} to be staged, got ${JSON.stringify(staged)}`);
  }

  git(ctx.wanted, ['commit', '-m', ARM_COMMIT_MESSAGE], { mustSucceed: true });

  const sha = (git(ctx.wanted, ['rev-parse', 'HEAD'], { mustSucceed: true }).stdout || '').trim();
  console.log(`arm-anchor: ARMED -- committed ${rootRel} (${bytes} bytes) as ${sha}`);
  console.log('');
  console.log('Export this for BOTH the run-e2e.mjs drive AND every grade-red.mjs --run:');
  console.log('');
  console.log(`    export E2E_APPLY_BASE=${sha}`);
  console.log('');
  console.log(
    'The drive refuses on its own if you forget (HEAD is now ahead of main). The GRADE does not have that\n' +
      'check, which is why the suite sets requireExplicitApplyBase -- a missing export is an instant refusal\n' +
      'naming the variable, and every red-grade.json records the apply_base it actually used.',
  );
}

function verify(given) {
  const ctx = resolveThrowaway(given, { requireClean: false });
  const { rootRel } = snapshotPaths(ctx);

  const porcelain = (git(ctx.wanted, ['status', '--porcelain']).stdout || '').trim();

  if (porcelain) {
    die(`NOT ARMED: the throwaway is dirty, so what is on disk is not what the base carries:\n${porcelain}`);
  }

  if (git(ctx.wanted, ['cat-file', '-e', `HEAD:${rootRel}`]).status !== 0) {
    die(
      `NOT ARMED: ${rootRel} is not tracked at HEAD. An untracked snapshot lands in the captured diff and ` +
        'poisons attribution; run `arm-anchor.mjs --arm` first.',
    );
  }

  const size = Number.parseInt((git(ctx.wanted, ['cat-file', '-s', `HEAD:${rootRel}`]).stdout || '0').trim(), 10);

  if (!(size > 0)) {
    die(`NOT ARMED: ${rootRel} is tracked at HEAD but EMPTY (${size} bytes), so nothing is characterized`);
  }

  const sha = (git(ctx.wanted, ['rev-parse', 'HEAD'], { mustSucceed: true }).stdout || '').trim();
  console.log(`arm-anchor: ARMED -- ${rootRel} tracked at HEAD (${size} bytes), worktree clean, HEAD detached`);
  console.log(`arm-anchor: armed SHA ${sha}`);
  console.log(`arm-anchor: export E2E_APPLY_BASE=${sha}`);
  process.exit(0);
}

function main(argv) {
  const armIdx = argv.indexOf('--arm');

  if (armIdx >= 0) {
    arm(argv[armIdx + 1]);

    return;
  }

  const verifyIdx = argv.indexOf('--verify');

  if (verifyIdx >= 0) {
    verify(argv[verifyIdx + 1]);

    return;
  }

  console.error('usage: node arm-anchor.mjs --arm <throwaway checkout> | --verify <throwaway checkout>');
  process.exit(2);
}

const isMainModule = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMainModule) {
  main(process.argv.slice(2));
}
