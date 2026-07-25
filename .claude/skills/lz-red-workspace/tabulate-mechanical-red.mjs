#!/usr/bin/env node
// tabulate-mechanical-red.mjs -- the MECHANICAL lift dims + Pass@k/Pass^k on the D-06 correctness
// gate for the RED apply eval (adapted from lz-refactor-workspace/e2e-angular/tabulate-mechanical.mjs).
//
// It is a POST-RUN pass: it reads each captured run's meta.json (D-07 stream-json meta, written by
// run-e2e.mjs) + the sibling red-grade.json (the D-06 verdict, written by grade-red.mjs) and emits,
// per (target, arm):
//   - wall-clock mean (elapsed_ms), cost mean (total_cost_usd) + a per-model model_usage rollup,
//   - tool histogram + num_turns mean, changed-files/edits count (drove),
//   - the D-04 trigger-gap dimension, as THREE separate rates rather than one conflated number
//     (see the autoTriggerRate comment in aggregate() for why the k=1 pilot forced the split):
//     autoTriggerRate (the model CHOSE to fire the skill), availableRate (the plugin loaded), and
//     forcedRate (the harness prefixed the slash command -- true by construction),
//   - Pass@k + Pass^k (k = 1, 3, 5, total) on the D-06 correctness gate (c = runs whose
//     red-grade.pass === true), NOT a vocabulary/lift proxy.
//
// Nothing here is re-computed from transcript text -- the mechanical dims come straight off the meta
// (D-07/D-09). GRADED dims (right-next-test, observable-behavior, book authenticity) are judge /
// oracle-reviewer owned and live in EVAL-RESULTS.md, not here.
//
// cost/turns/tools/model_usage/auto-trigger are kept over ALL runs (spend and firing are real
// regardless of exit); Pass@k/Pass^k are kept over exit-0 runs only (a crashed run has no meaningful
// grade), mirroring the analog's clean-filter.
//
// It FAILS CLOSED (exit 1, T-21-02b): a garbled/keyless meta.json, or a captured run (meta.json
// present) missing its red-grade.json, throws rather than silently skewing the numbers.
//
// Usage:
//   node tabulate-mechanical-red.mjs              # walk the suite's results/apply, print + write mechanical-red.json
//   node tabulate-mechanical-red.mjs --selfcheck  # offline, zero spend; assert rollup/auto-trigger/Pass@k on fixtures

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const FIXTURE_DIR = path.join(HERE, 'fixtures', 'tabulate');

// ---- Pass@k / Pass^k (copied VERBATIM from run-e2e.mjs / tabulate-mechanical.mjs; neither is
//      importably clean per the Phase-14 note) ----------------------------------------------------

// C(n, r) as an exact-ish float (small n here).
function comb(n, r) {
  if (r < 0 || r > n) {
    return 0;
  }

  r = Math.min(r, n - r);
  let num = 1;
  let den = 1;

  for (let i = 0; i < r; i++) {
    num *= n - i;
    den *= i + 1;
  }

  return num / den;
}

// Pass@k (optimistic): prob >=1 of k sampled runs passes. Pass^k (conservative): all k pass.
// n = total runs, c = passing runs. Returns null when k > n.
function passAtK(n, c, k) {
  return k > n ? null : 1 - comb(n - c, k) / comb(n, k);
}

function passHatK(n, c, k) {
  return k > n ? null : comb(c, k) / comb(n, k);
}

// ---- run normalization -----------------------------------------------------------------------

// Normalize a (meta.json, red-grade.json) pair into the run record aggregate() consumes. The
// mechanical dims read straight off the meta (no recompute); pass is the D-06 gate off the grade.
function toRun(meta, grade) {
  return {
    target: meta.target,
    pid: meta.prompt_id,
    arm: meta.arm,
    run_idx: meta.run_idx,
    exit: meta.exit_code,
    elapsed: meta.elapsed_ms || 0,
    cost: meta.total_cost_usd || 0,
    turns: meta.num_turns || 0,
    tools: meta.tool_calls || {},
    edits: Array.isArray(meta.changed_files) ? meta.changed_files.length : 0,
    // The three trigger facts, kept apart (run-e2e.mjs extractResult + runOne). firedRed is the
    // ONLY genuine auto-trigger signal; availRed proves --plugin-dir loaded the plugin; forced is
    // true by construction on the invoke_skill arm. meta.used_skills (the legacy tool_use-blob
    // substring probe) is deliberately NOT read here -- it is what produced the pilot's misleading
    // numbers, and it false-positives on a mere mention.
    firedRed: (meta.skills_model_fired && meta.skills_model_fired['lz-red']) || 0,
    availRed: !!(meta.skills_available && meta.skills_available['lz-red']),
    forced: meta.skill_forced === true,
    modelUsage: meta.model_usage || {},
    // The D-06 gate, read as the single boolean grade-red already decided. This deliberately does
    // NOT enumerate the verdict classes: `pass` is true for genuinely_red and false for every other
    // class, so adding one (2026-07-25 added an 8th, `unattributable`, when the gate started
    // requiring the failure to belong to a test the diff ADDED) needs no change here. A copy of the
    // class list in this file would be a second place to forget to update.
    pass: grade.pass === true,
  };
}

// ---- pure aggregation (shared by the real walk and --selfcheck) -------------------------------

// Per (target:pid, arm): mechanical dims over ALL runs + Pass@k/Pass^k over exit-0 runs on the
// correctness gate. Pure -- takes run records, returns the mechanical-red.json shape.
function aggregate(runs) {
  const cells = {};

  for (const r of runs) {
    const key = `${r.target}:${r.pid}|${r.arm}`;
    (cells[key] ||= []).push(r);
  }

  const out = {};

  for (const key of Object.keys(cells).sort()) {
    const rs = cells[key];
    const n = rs.length;
    // Pass@k measures correctness, so it excludes runs that errored out (exit != 0) -- a crashed run
    // has no meaningful grade. cost/turns/tools/model_usage/auto-trigger stay over ALL runs.
    const clean = rs.filter((r) => r.exit === 0);
    const nClean = clean.length;
    const c = clean.filter((r) => r.pass).length; // D-06 correctness gate: red-grade.pass === true

    const costMean = n ? rs.reduce((s, r) => s + r.cost, 0) / n : 0;
    const wallMeanMs = n ? rs.reduce((s, r) => s + r.elapsed, 0) / n : 0;
    const turnsMean = n ? rs.reduce((s, r) => s + r.turns, 0) / n : 0;
    const editsMean = n ? rs.reduce((s, r) => s + r.edits, 0) / n : 0;
    const drove = clean.filter((r) => r.edits > 0).length;

    // THREE rates, never collapsed into one. The 2026-07-25 k=1 pilot proved why: a slash command
    // in the -p prompt is expanded by the CLI at prompt-processing time and produces NO Skill
    // tool_use, so the forced invoke_skill control reported a 0.00 "auto-trigger" rate while the
    // skill demonstrably loaded -- and a with_skill 0.00 could not be told apart from a broken
    // detector.
    //
    //   autoTriggerRate -- the model CHOSE to fire the skill (a Skill tool_use). This is the D-04
    //     trigger-gap headline and it is meaningful for with_skill ONLY. invoke_skill is EXPECTED
    //     to read ~0.00 here and that is not a defect: forcing is not a model choice, and dressing
    //     it up as one would report an auto-trigger the run never made. no_skill has no plugin.
    //   availableRate  -- the CLI's own system/init advertised the skill, i.e. --plugin-dir worked.
    //     THIS is what makes invoke_skill a working positive control: 1.00 there (and 1.00 on
    //     with_skill, 0.00 on no_skill) proves the plumbing AND the detector are live, so a
    //     with_skill autoTriggerRate of 0.00 is a real finding rather than an instrument failure.
    //   forcedRate     -- the harness prefixed the slash command; true BY CONSTRUCTION, expected
    //     1.00 on invoke_skill and 0.00 elsewhere. A canary on arm plumbing, not a measurement.
    const autoTriggerRate = n ? rs.filter((r) => r.firedRed > 0).length / n : 0;
    const availableRate = n ? rs.filter((r) => r.availRed).length / n : 0;
    const forcedRate = n ? rs.filter((r) => r.forced).length / n : 0;

    const toolAgg = {};

    for (const r of rs) {
      for (const [t, cnt] of Object.entries(r.tools)) {
        toolAgg[t] = (toolAgg[t] || 0) + cnt;
      }
    }

    // per-model token/cost rollup across ALL runs (D-07 headline: model_usage rolls up sub-agents).
    const modelUsage = {};

    for (const r of rs) {
      for (const [model, mu] of Object.entries(r.modelUsage)) {
        const acc = (modelUsage[model] ||= { input: 0, output: 0, costUSD: 0 });
        acc.input += mu.input || 0;
        acc.output += mu.output || 0;
        acc.costUSD += mu.costUSD || 0;
      }
    }

    out[key] = {
      n,
      nClean,
      c,
      wallMeanMs,
      costMean,
      turnsMean,
      editsMean,
      drove,
      autoTriggerRate,
      availableRate,
      forcedRate,
      toolAgg,
      modelUsage,
      passAt: {
        1: passAtK(nClean, c, 1),
        3: passAtK(nClean, c, 3),
        5: passAtK(nClean, c, 5),
        total: passAtK(nClean, c, nClean),
      },
      passHat: {
        1: passHatK(nClean, c, 1),
        3: passHatK(nClean, c, 3),
        5: passHatK(nClean, c, 5),
        total: passHatK(nClean, c, nClean),
      },
    };
  }

  return out;
}

// ---- the real walk (post-run over captured artifacts) -----------------------------------------

function readJsonOrThrow(p, label) {
  let raw;

  try {
    raw = fs.readFileSync(p, 'utf8');
  } catch (err) {
    throw new Error(`tabulate-red: cannot read ${label} ${p} (fail closed): ${err.message}`);
  }

  try {
    return JSON.parse(raw);
  } catch (err) {
    throw new Error(`tabulate-red: garbled ${label} ${p} (fail closed, T-21-02b): ${err.message}`);
  }
}

// Walk results/apply/<arm>/<pid>/run-*/, joining each meta.json with its sibling red-grade.json.
// A meta.json present but red-grade.json missing FAILS CLOSED (a captured run must be graded).
function walkRuns(applyRoot) {
  const runs = [];

  if (!fs.existsSync(applyRoot)) {
    return runs;
  }

  for (const arm of fs.readdirSync(applyRoot)) {
    const armDir = path.join(applyRoot, arm);

    if (!fs.statSync(armDir).isDirectory()) {
      continue;
    }

    for (const pid of fs.readdirSync(armDir)) {
      const pidDir = path.join(armDir, pid);

      if (!fs.statSync(pidDir).isDirectory()) {
        continue;
      }

      for (const run of fs.readdirSync(pidDir)) {
        const dir = path.join(pidDir, run);

        if (!fs.statSync(dir).isDirectory()) {
          continue;
        }

        const metaPath = path.join(dir, 'meta.json');

        if (!fs.existsSync(metaPath)) {
          continue; // not a captured run
        }

        const meta = readJsonOrThrow(metaPath, 'meta.json');

        // keyless meta must not silently skew the numbers (T-21-02b).
        if (
          !meta ||
          typeof meta.arm !== 'string' ||
          typeof meta.target !== 'string' ||
          !Array.isArray(meta.changed_files)
        ) {
          throw new Error(`tabulate-red: keyless meta ${metaPath} (missing arm/target/changed_files -- fail closed)`);
        }

        // A meta captured BEFORE the trigger-detector fix carries no separated trigger facts. It
        // cannot be tabulated honestly: defaulting the three rates to 0 is exactly the misleading
        // reading the fix removed. Fail loudly and make the operator re-capture instead.
        if (
          !meta.skills_model_fired ||
          typeof meta.skills_model_fired !== 'object' ||
          !meta.skills_available ||
          typeof meta.skills_available !== 'object' ||
          typeof meta.skill_forced !== 'boolean'
        ) {
          throw new Error(
            `tabulate-red: meta ${metaPath} predates the trigger-detector fix (no skills_model_fired / ` +
              'skills_available / skill_forced) -- its trigger rates are unmeasurable. Re-capture the run with ' +
              'the current run-e2e.mjs (fail closed).',
          );
        }

        const gradePath = path.join(dir, 'red-grade.json');

        if (!fs.existsSync(gradePath)) {
          throw new Error(
            `tabulate-red: captured run ${dir} is missing red-grade.json -- grade it with grade-red.mjs first (fail closed, T-21-02b)`,
          );
        }

        const grade = readJsonOrThrow(gradePath, 'red-grade.json');

        if (!grade || typeof grade.pass !== 'boolean') {
          throw new Error(`tabulate-red: red-grade ${gradePath} has no boolean 'pass' (fail closed, T-21-02b)`);
        }

        runs.push(toRun(meta, grade));
      }
    }
  }

  return runs;
}

// ---- multi-suite discovery + the cell-key collision guard -------------------------------------

// Every RED suite dir under `root`: a direct child whose name starts with `e2e-red-` and which
// actually carries a suite.json. Sorted, so the printed table is stable across machines.
//
// The RED instrument is ONE suite dir per target repo (suite.json carries a single repo +
// applyBase, and run-e2e.mjs is driven one --suite at a time), so tabulating a round means walking
// all of them rather than the one that happened to be hardcoded here.
export function discoverSuiteDirs(root = HERE) {
  let entries;

  try {
    entries = fs.readdirSync(root, { withFileTypes: true });
  } catch (err) {
    throw new Error(`tabulate-red: cannot list ${root} to discover RED suites (fail closed): ${err.message}`);
  }

  return entries
    .filter((e) => e.isDirectory() && e.name.startsWith('e2e-red-'))
    .map((e) => path.join(root, e.name))
    .filter((d) => fs.existsSync(path.join(d, 'suite.json')))
    .sort();
}

// Walk every suite, keeping each suite's own runs AND the combined list, and FAIL CLOSED if two
// different suites produce the same `${target}:${pid}|${arm}` cell key.
//
// Target ids are globally unique today (GRC / NGXA / SRVC), so the three suites aggregate into one
// table without colliding -- but that is an INVARIANT, not a guarantee. Two repos silently merged
// into one cell is a wrong number that looks entirely plausible: the n doubles, the Pass@k is a
// blend of two different targets, and nothing in the output says so. That is exactly the class of
// defect this file's fail-closed contract exists to prevent, so it is an error rather than a note.
export function walkAllSuites(suiteDirs) {
  const owner = new Map();
  const perSuite = [];
  const all = [];

  for (const suiteDir of suiteDirs) {
    const runs = walkRuns(path.join(suiteDir, 'results', 'apply'));

    for (const r of runs) {
      const key = `${r.target}:${r.pid}|${r.arm}`;
      const prior = owner.get(key);

      // Within ONE suite the same key repeats legitimately -- that is what k>1 means. Only a
      // SECOND suite claiming it is a collision.
      if (prior !== undefined && prior !== suiteDir) {
        throw new Error(
          `tabulate-red: cell '${key}' is produced by TWO different suites -- ${prior} and ${suiteDir}. ` +
            'Aggregating them would silently blend two targets into one Pass@k. Give each target a ' +
            'globally unique id in its own targets.json (fail closed, T-wpu-05).',
        );
      }

      owner.set(key, suiteDir);
    }

    perSuite.push({ suiteDir, runs });
    all.push(...runs);
  }

  return { all, perSuite };
}

// ---- printing --------------------------------------------------------------------------------

const pct = (v) => (v === null || v === undefined ? '  -  ' : v.toFixed(2));

function printTable(agg) {
  console.log(
    'cell        arm           n  clean pass  fired avail force  P@1  P@3  P@5  P^1  P^3   wall(s) $mean turns  tools',
  );

  for (const key of Object.keys(agg)) {
    const [cell, arm] = key.split('|');
    const a = agg[key];
    const toolStr = Object.entries(a.toolAgg)
      .sort((x, y) => y[1] - x[1])
      .map(([t, cnt]) => `${t}:${cnt}`)
      .join(' ');
    console.log(
      `${cell.padEnd(11)} ${arm.padEnd(12)} ${String(a.n).padStart(2)}  ` +
        `${String(a.nClean).padStart(2)}   ${String(a.c).padStart(2)}   ` +
        `${a.autoTriggerRate.toFixed(2)}  ${a.availableRate.toFixed(2)} ${a.forcedRate.toFixed(2)}  ` +
        `${pct(a.passAt[1])} ${pct(a.passAt[3])} ${pct(a.passAt[5])} ${pct(a.passHat[1])} ${pct(a.passHat[3])}  ` +
        `${(a.wallMeanMs / 1000).toFixed(0).padStart(5)} ${a.costMean.toFixed(2)}  ${a.turnsMean.toFixed(0).padStart(3)}   ${toolStr}`,
    );
  }

  console.log(
    '\nfired = model CHOSE to invoke the skill (the D-04 auto-trigger headline; meaningful for with_skill).\n' +
      'avail = the CLI advertised the skill, i.e. --plugin-dir worked. force = the harness prefixed the slash\n' +
      'command (true by construction). A forced arm reads fired ~0.00 BY DESIGN -- an expanded slash command\n' +
      'produces no Skill tool_use; its control value is avail 1.00 + force 1.00, which is what proves the\n' +
      'detector and the plumbing are live.',
  );
}

// ---- offline selfcheck (zero spend; asserts rollup/auto-trigger/Pass@k on the fixtures) --------

function fail(msg) {
  console.error(`tabulate-mechanical-red --selfcheck: FAIL -- ${msg}`);
  process.exit(1);
}

const EPS = 1e-9;

function approx(got, want, label) {
  if (got === null || got === undefined || Math.abs(got - want) > EPS) {
    fail(`${label}: got ${got}, expected ${want}`);
  }
}

function eq(got, want, label) {
  if (got !== want) {
    fail(`${label}: got ${got}, expected ${want}`);
  }
}

function assertThrows(fn, label) {
  let threw = false;

  try {
    fn();
  } catch {
    threw = true;
  }

  if (!threw) {
    fail(`expected the fail-closed path '${label}' to throw, but it did not`);
  }
}

// Join the two fixture arrays by (arm, target, prompt_id, run_idx), the same key the real layout
// pairs siblings on. A meta without a matching grade fails closed.
function joinFixtures(metas, grades) {
  const gradeByKey = new Map();

  for (const g of grades) {
    gradeByKey.set(`${g.arm}:${g.target}:${g.prompt_id}:${g.run_idx}`, g);
  }

  const runs = [];

  for (const m of metas) {
    const key = `${m.arm}:${m.target}:${m.prompt_id}:${m.run_idx}`;
    const g = gradeByKey.get(key);

    if (!g) {
      throw new Error(`tabulate-red: fixture meta ${key} has no matching red-grade (fail closed)`);
    }

    runs.push(toRun(m, g));
  }

  return runs;
}

// Write ONE fake suite dir holding ONE captured run, in the real on-disk layout
// (results/apply/<arm>/<pid>/run-1/{meta.json,red-grade.json}) so discovery and the walk are
// exercised against the shape they meet in production rather than against an in-memory stand-in.
function writeFakeSuite(root, name, meta, grade) {
  const suiteDir = path.join(root, name);
  const runDir = path.join(suiteDir, 'results', 'apply', meta.arm, meta.prompt_id, 'run-1');
  fs.mkdirSync(runDir, { recursive: true });
  fs.writeFileSync(path.join(suiteDir, 'suite.json'), JSON.stringify({ name }, null, 2));
  fs.writeFileSync(path.join(runDir, 'meta.json'), JSON.stringify(meta, null, 2));
  fs.writeFileSync(path.join(runDir, 'red-grade.json'), JSON.stringify(grade, null, 2));

  return suiteDir;
}

// The multi-suite walk, in BOTH directions, against a throwaway tree under os.tmpdir().
//
// This case FAILS against the pre-change single-suite code, which is the point: that version
// hardcoded one SUITE_DIR, so a second suite's runs were simply invisible and a round spanning
// three repos would have been tabulated as one. A positive-only assertion over the committed
// fixtures could not have seen that, because there is only one committed suite today.
function checkMultiSuiteWalk(baseMeta, baseGrade) {
  if (!baseMeta || !baseGrade) {
    fail('multi-suite case: the tabulate fixtures did not yield a meta/grade pair to build from');
  }

  const root = path.join(os.tmpdir(), `red-tab-suites-${process.pid}-${Date.now()}`);
  fs.mkdirSync(root, { recursive: true });

  try {
    const mkPair = (target) => [
      { ...baseMeta, target },
      { ...baseGrade, target },
    ];
    const [metaA, gradeA] = mkPair('AAA');
    const [metaB, gradeB] = mkPair('BBB');
    writeFakeSuite(root, 'e2e-red-alpha', metaA, gradeA);
    writeFakeSuite(root, 'e2e-red-beta', metaB, gradeB);
    // Two NEGATIVE discovery controls: a non-`e2e-red-` dir and an `e2e-red-` dir with no
    // suite.json must both be ignored, so discovery cannot degenerate into "every subdirectory".
    fs.mkdirSync(path.join(root, 'fixtures'), { recursive: true });
    fs.mkdirSync(path.join(root, 'e2e-red-not-a-suite'), { recursive: true });

    const found = discoverSuiteDirs(root);

    if (found.length !== 2) {
      fail(`multi-suite discovery found ${found.length} suite(s) (${found.join(', ')}), expected exactly the 2 with a suite.json`);
    }

    const { all, perSuite } = walkAllSuites(found);
    const agg = aggregate(all);
    const keyA = `AAA:${metaA.prompt_id}|${metaA.arm}`;
    const keyB = `BBB:${metaB.prompt_id}|${metaB.arm}`;

    if (!agg[keyA] || !agg[keyB]) {
      fail(`the combined aggregate is missing a suite's cell (got ${JSON.stringify(Object.keys(agg))}, expected ${keyA} + ${keyB})`);
    }

    eq(perSuite.length, 2, 'per-suite result count');
    eq(perSuite[0].runs.length, 1, 'suite A run count');
    eq(perSuite[1].runs.length, 1, 'suite B run count');

    // The collision guard: a THIRD suite reusing suite A's target id must throw rather than
    // silently blending two repos' runs into one cell.
    const [metaC, gradeC] = mkPair('AAA');
    writeFakeSuite(root, 'e2e-red-gamma', metaC, gradeC);
    assertThrows(() => walkAllSuites(discoverSuiteDirs(root)), 'colliding cell key across two suites');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }

  console.log(
    '  [multi-suite] discovery + aggregation OK (2 suite dirs found and both cells present; a non-suite dir ' +
      'and a suite.json-less dir ignored; a third suite reusing a target id throws)',
  );
}

function runSelfcheck() {
  const metas = readJsonOrThrow(path.join(FIXTURE_DIR, 'meta.sample.json'), 'meta.sample.json');
  const grades = readJsonOrThrow(path.join(FIXTURE_DIR, 'red-grade.sample.json'), 'red-grade.sample.json');
  const agg = aggregate(joinFixtures(metas, grades));

  const ws = agg['GRC:r1|with_skill'];
  const is = agg['GRC:r1|invoke_skill'];
  const ns = agg['GRC:r1|no_skill'];

  if (!ws || !is || !ns) {
    fail('missing one of the with_skill/invoke_skill/no_skill cells');
  }

  // --- with_skill: 5 runs (1 crashed), 4 clean, 3 pass ---
  eq(ws.n, 5, 'with_skill n');
  eq(ws.nClean, 4, 'with_skill nClean (exit-0 only)');
  eq(ws.c, 3, 'with_skill c (red-grade.pass among clean)');

  // token/cost rollup over ALL 5 runs (mechanical, off the meta -- no recompute)
  approx(ws.costMean, 0.21, 'with_skill costMean over all runs'); // 1.05 / 5
  approx(ws.wallMeanMs, 120000, 'with_skill wall-clock mean ms'); // 600000 / 5
  approx(ws.turnsMean, 9.4, 'with_skill turns mean'); // 47 / 5
  eq(ws.drove, 4, 'with_skill drove (clean runs with edits > 0)');
  eq(ws.toolAgg.Read, 9, 'with_skill Read tool total');
  eq(ws.toolAgg.Edit, 3, 'with_skill Edit tool total');
  eq(ws.toolAgg.Bash, 2, 'with_skill Bash tool total');
  approx(ws.modelUsage['claude-opus-4-8'].input, 5000, 'with_skill model_usage input rollup');
  approx(ws.modelUsage['claude-opus-4-8'].output, 1000, 'with_skill model_usage output rollup');
  approx(ws.modelUsage['claude-opus-4-8'].costUSD, 1.05, 'with_skill model_usage cost rollup');

  // The D-04 trigger dimension, as three separate rates. The fixture makes the legacy
  // used_skills['lz-red'] counts DIVERGE from skills_model_fired on purpose (with_skill 3/5 vs
  // 2/5; invoke_skill 3/3 vs 0/3), so a regression to reading used_skills fails these two
  // assertions instead of passing quietly with the pilot's misleading numbers.
  approx(ws.autoTriggerRate, 0.4, 'with_skill auto-trigger rate (model-fired: 2 of 5)');
  approx(ws.availableRate, 1.0, 'with_skill availableRate (--plugin-dir loaded on all 5)');
  approx(ws.forcedRate, 0.0, 'with_skill forcedRate (natural prompt, never forced)');

  // Pass@k / Pass^k on the correctness gate (nClean=4, c=3)
  approx(ws.passAt[1], 0.75, 'with_skill Pass@1'); // 1 - C(1,1)/C(4,1)
  approx(ws.passAt[3], 1.0, 'with_skill Pass@3'); // 1 - C(1,3)/C(4,3) = 1 - 0
  eq(ws.passAt[5], null, 'with_skill Pass@5 (k>n -> null)');
  approx(ws.passAt.total, 1.0, 'with_skill Pass@total (k=4)');
  approx(ws.passHat[1], 0.75, 'with_skill Pass^1'); // C(3,1)/C(4,1)
  approx(ws.passHat[3], 0.25, 'with_skill Pass^3'); // C(3,3)/C(4,3)
  eq(ws.passHat[5], null, 'with_skill Pass^5 (k>n -> null)');
  approx(ws.passHat.total, 0.0, 'with_skill Pass^total (k=4)'); // C(3,4)/C(4,4) = 0

  // --- invoke_skill: the FORCED control. The CLI expands the slash command at prompt-processing
  // time, so there is no Skill tool_use and the honest model-choice rate is 0.00. Its control value
  // is availableRate + forcedRate at 1.00: that pair is what proves --plugin-dir and the detector
  // are live, and therefore that a with_skill 0.00 is a finding rather than a broken instrument.
  // Asserting 1.00 auto-trigger here (as this battery used to) would be fabricating a model choice.
  eq(is.n, 3, 'invoke_skill n');
  approx(is.autoTriggerRate, 0.0, 'invoke_skill auto-trigger rate (forced != model-fired)');
  approx(is.availableRate, 1.0, 'invoke_skill availableRate (the positive control: plugin loaded)');
  approx(is.forcedRate, 1.0, 'invoke_skill forcedRate (by construction)');
  approx(is.passAt[1], 1.0, 'invoke_skill Pass@1');
  approx(is.passHat[3], 1.0, 'invoke_skill Pass^3');
  approx(is.costMean, 0.2, 'invoke_skill costMean'); // 0.60 / 3

  // --- no_skill: no plugin -> nothing available, nothing fired, nothing forced; 2 of 3 pass ---
  eq(ns.n, 3, 'no_skill n');
  eq(ns.c, 2, 'no_skill c');
  approx(ns.autoTriggerRate, 0.0, 'no_skill auto-trigger rate (no plugin)');
  approx(ns.availableRate, 0.0, 'no_skill availableRate (no --plugin-dir, so nothing advertised)');
  approx(ns.forcedRate, 0.0, 'no_skill forcedRate');
  approx(ns.passAt[1], 2 / 3, 'no_skill Pass@1'); // 1 - C(1,1)/C(3,1)
  approx(ns.passHat[1], 2 / 3, 'no_skill Pass^1'); // C(2,1)/C(3,1)
  approx(ns.passAt[3], 1.0, 'no_skill Pass@3');
  approx(ns.passHat[3], 0.0, 'no_skill Pass^3'); // C(2,3)/C(3,3) = 0

  // fail-closed: a meta with no matching grade throws (a captured run must be graded).
  assertThrows(
    () => joinFixtures([metas[0]], []),
    'meta with no matching red-grade',
  );
  // fail-closed: a keyless meta (no changed_files) is rejected by the real walk's guard shape.
  assertThrows(() => {
    const bad = { ...metas[0] };
    delete bad.changed_files;

    if (typeof bad.arm !== 'string' || typeof bad.target !== 'string' || !Array.isArray(bad.changed_files)) {
      throw new Error('keyless meta rejected');
    }
  }, 'keyless meta guard');

  // fail-closed: a meta captured BEFORE the trigger-detector fix has no measurable trigger state.
  // Silently defaulting its three rates to 0 is precisely the misleading reading the fix removed,
  // so the walk must reject it and demand a re-capture.
  assertThrows(() => {
    const stale = { ...metas[0] };
    delete stale.skills_model_fired;
    delete stale.skills_available;
    delete stale.skill_forced;

    if (
      !stale.skills_model_fired ||
      typeof stale.skills_model_fired !== 'object' ||
      !stale.skills_available ||
      typeof stale.skills_available !== 'object' ||
      typeof stale.skill_forced !== 'boolean'
    ) {
      throw new Error('pre-fix meta rejected');
    }
  }, 'pre-fix meta guard');

  checkMultiSuiteWalk(metas[0], grades.find((g) => g.arm === metas[0].arm && g.run_idx === metas[0].run_idx));

  console.log(
    '  [with_skill] n=5 clean=4 pass=3 fired=0.40 avail=1.00 force=0.00 Pass@1=0.75 Pass^3=0.25 ' +
      'tools=Read:9/Edit:3/Bash:2 cost=1.05 OK',
  );
  console.log(
    '  [invoke_skill] fired=0.00 avail=1.00 force=1.00 Pass@1=1.00 OK ' +
      '(forced control: an expanded slash command is NOT a model choice; avail+force are what it proves)',
  );
  console.log('  [no_skill] fired=0.00 avail=0.00 force=0.00 Pass@1=0.67 (baseline, no plugin) OK');
  console.log('  [fail-closed] meta without a grade + keyless meta + pre-fix meta all throw OK');
  console.log(
    'tabulate-mechanical-red --selfcheck: OK -- token/cost rollup, the three separated trigger rates ' +
      '(model-fired / available / forced), and Pass@k/Pass^k (k=1,3,5,total) on the D-06 correctness gate ' +
      'all match the fixtures; zero spend.',
  );
  process.exit(0);
}

// ---- main ------------------------------------------------------------------------------------

function main(argv) {
  if (argv.includes('--selfcheck')) {
    runSelfcheck();

    return;
  }

  const suiteDirs = discoverSuiteDirs();

  if (!suiteDirs.length) {
    console.log(`no e2e-red-* suite dirs with a suite.json under ${HERE} -- nothing to tabulate.`);

    return;
  }

  const { all, perSuite } = walkAllSuites(suiteDirs);

  if (!all.length) {
    console.log(
      `no captured runs under any of ${suiteDirs.length} RED suite(s) -- nothing to tabulate (run the gated suites first):\n  ` +
        suiteDirs.map((d) => path.join(d, 'results', 'apply')).join('\n  '),
    );

    return;
  }

  // ONE combined table across every suite (target ids are globally unique and walkAllSuites has
  // already refused a collision), but each suite keeps its OWN mechanical-red.json next to its own
  // results -- so a per-suite artifact never carries another repo's numbers.
  printTable(aggregate(all));

  for (const { suiteDir, runs } of perSuite) {
    if (!runs.length) {
      continue;
    }

    const suiteAgg = aggregate(runs);
    const outPath = path.join(suiteDir, 'mechanical-red.json');
    fs.writeFileSync(outPath, JSON.stringify(suiteAgg, null, 2));
    console.log(`\nwrote ${outPath} (${runs.length} runs across ${Object.keys(suiteAgg).length} cells).`);
  }
}

main(process.argv.slice(2));

export { aggregate, toRun, comb, passAtK, passHatK, walkRuns };
