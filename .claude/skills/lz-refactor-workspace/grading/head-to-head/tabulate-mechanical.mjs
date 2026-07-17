#!/usr/bin/env node
// tabulate-mechanical.mjs -- deterministic MECHANICAL-dimension tabulator for the phase-14
// head-to-head (lz-refactor recommend `invoke_skill` arm vs mattpocock `code_review` arm).
//
// It walks the phase-14 recommend results trees, reads every per-run meta.json (produced by
// run-e2e.mjs's extractResult(); D-01/D-07) plus its sibling answer.md, and emits per (cell, arm)
// the MECHANICAL D-04 dimensions -- the ones computable offline with no model:
//   * token/cost totals   -- total_cost_usd + per-model model_usage roll up the sub-agents (the fair
//                            cross-arm headline); input/output_tokens are main-context-only (D-07).
//   * tool_calls histogram + sub-agent SPAWN count -- the 2-vs-0 spawn asymmetry is the tool-usage
//                            headline finding (code_review spawns Standards/Spec sub-agents;
//                            lz-refactor recommend is a single read-only context).
//   * lift -- distinct named Fowler/Kerievsky refactorings surfaced in answer.md (a mechanical
//             HEURISTIC via the reused word-bounded name matcher; the GRADED lift refinement is
//             oracle-owned in 14-05).
//   * Pass@k / Pass^k on the lift>0 predicate (a run "passes" if it surfaced >= 1 named refactoring).
//
// The GRADED dimensions (book authenticity, output quality, over/under-engineering, TS/FP/OOP
// idioms+patterns) are NOT computed here -- they route through oracle/oracle-reviewer/judge in 14-05
// (DST-04). summary.template.json (a sibling of this file) fixes the full seven-dimension rollup
// shape those graded fills land in.
//
// nameRe + the FOWLER/KERIEVSKY name arrays are IMPORTED from ../../grade-run.mjs (the lift-
// vocabulary source of truth). comb/passAtK/passHatK are still COPIED VERBATIM from
// ../../e2e-nx/run-e2e.mjs, which does not export the stats helpers -- copying keeps the numbers
// identical to the shipped runner (PATTERNS Pattern F; "Don't Hand-Roll") and the offline
// --selfcheck below guards them against drift. Do NOT reinvent the matcher or the stats.
//
// Usage:
//   node tabulate-mechanical.mjs --selfcheck                 # offline fixture check (zero spend)
//   node tabulate-mechanical.mjs                             # tabulate the two recommend trees -> mechanical.json
//   node tabulate-mechanical.mjs --cell cr-emb --cell cr-gr  # restrict to specific cells
//   node tabulate-mechanical.mjs --results <dir> --out <f>   # override results root(s) + output path
//
// ASCII-only, fail-closed: a garbled/unparseable meta.json aborts (never a silent skip).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { nameRe, FOWLER, KERIEVSKY } from '../../grade-run.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE = path.resolve(HERE, '../..'); // grading/head-to-head -> grading -> lz-refactor-workspace

// The head-to-head arms: the lz-refactor recommend arm (invoke_skill) and the competitor (code_review).
const DEFAULT_ARMS = ['invoke_skill', 'code_review'];

// The two phase-14 recommend trees (D-09 corpus: nx cr-emb/cr-rlu + kata cr-gr).
const DEFAULT_RESULTS_ROOTS = [
  path.join(WORKSPACE, 'e2e-nx', 'results', 'recommend'),
  path.join(WORKSPACE, 'e2e-gilded-rose', 'results', 'recommend'),
];

const DEFAULT_OUT = path.join(HERE, 'mechanical.json');

// Sub-agent-spawn tool names. code-review "sends a single message with two Agent tool calls";
// count by name against this set (case-insensitive) rather than hardcoding a single spelling, so
// the count survives whatever the CLI labels the spawn tool (Agent vs Task).
const SPAWN_TOOL_NAMES = new Set(['task', 'agent']);

function fail(msg) {
  console.error(`tabulate-mechanical: FAIL - ${msg}`);
  process.exit(1);
}

// The lift vocabulary = the distinct union of the two catalogs (KERIEVSKY_AWAY is a subset of
// KERIEVSKY, so no separate merge is needed for a distinct-name count). FOWLER/KERIEVSKY/nameRe
// are imported from grade-run.mjs above.
const LIFT_NAMES = [...new Set([...FOWLER, ...KERIEVSKY])];

// Distinct named refactorings surfaced in a response. Longest-match shadowing (same rule as
// grade-run.mjs layersInResponse): a matched name that is a word-bounded sub-phrase of a LONGER
// matched name is dropped, so "Factory Function" never phantom-counts inside "Replace Constructor
// with Factory Function". Because a proper sub-phrase is always shorter, this only suppresses
// phantom sub-matches and never drops a genuinely named move.
function distinctNames(resp) {
  const matched = LIFT_NAMES.filter((name) => nameRe(name).test(resp));

  return matched.filter((name) => {
    const shadowed = matched.some(
      (other) => other !== name && other.length > name.length && nameRe(name).test(other),
    );

    return !shadowed;
  });
}

// Sub-agent spawn count = sum of tool_calls entries whose name is a spawn tool (Agent/Task),
// matched case-insensitively so the count is spelling-agnostic (RESEARCH anti-pattern: hardcoding
// one tool name).
function spawnCount(toolCalls) {
  if (!toolCalls || typeof toolCalls !== 'object') {
    return 0;
  }

  let n = 0;

  for (const [name, count] of Object.entries(toolCalls)) {
    if (SPAWN_TOOL_NAMES.has(String(name).toLowerCase())) {
      n += Number(count) || 0;
    }
  }

  return n;
}

// ---- Pass@k / Pass^k: COPIED VERBATIM from run-e2e.mjs (Pattern F; do NOT reinvent) ----
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

// Pass@k (optimistic): prob >=1 of k sampled runs "passes". Pass^k (conservative): all k pass.
// n = total runs, c = passing runs. Returns null when k > n.
function passAtK(n, c, k) {
  return k > n ? null : 1 - comb(n - c, k) / comb(n, k);
}

function passHatK(n, c, k) {
  return k > n ? null : comb(c, k) / comb(n, k);
}

// Merge two {name: count} histograms into acc (in place).
function mergeHistogram(acc, hist) {
  if (!hist || typeof hist !== 'object') {
    return;
  }

  for (const [name, count] of Object.entries(hist)) {
    acc[name] = (acc[name] || 0) + (Number(count) || 0);
  }
}

// Compute the per-(cell, arm) MECHANICAL block from that cell's meta list + matching answer texts.
// metas[i] pairs with answers[i]. Kept a pure function so --selfcheck can drive it from a fixture.
function tabulateGroup(suite, cell, arm, metas, answers) {
  const runs = metas.length;
  const tokens = {
    input_total: 0,
    output_total: 0,
    cache_read_total: 0,
    cache_creation_total: 0,
    total_cost_usd_total: 0,
    num_turns_total: 0,
  };
  const modelUsageTotal = {};
  const toolsMerged = {};
  let spawnTotal = 0;
  const liftPerRun = [];
  const unionNames = new Set();

  metas.forEach((m, i) => {
    tokens.input_total += Number(m.input_tokens) || 0;
    tokens.output_total += Number(m.output_tokens) || 0;
    tokens.cache_read_total += Number(m.cache_read_input_tokens) || 0;
    tokens.cache_creation_total += Number(m.cache_creation_input_tokens) || 0;
    tokens.total_cost_usd_total += Number(m.total_cost_usd) || 0;
    tokens.num_turns_total += Number(m.num_turns) || 0;

    if (m.model_usage && typeof m.model_usage === 'object') {
      for (const [model, mu] of Object.entries(m.model_usage)) {
        if (!modelUsageTotal[model]) {
          modelUsageTotal[model] = { input: 0, output: 0, costUSD: 0 };
        }

        modelUsageTotal[model].input += Number(mu.input) || 0;
        modelUsageTotal[model].output += Number(mu.output) || 0;
        modelUsageTotal[model].costUSD += Number(mu.costUSD) || 0;
      }
    }

    mergeHistogram(toolsMerged, m.tool_calls);
    spawnTotal += spawnCount(m.tool_calls);

    const names = distinctNames(answers[i] || '');
    liftPerRun.push(names.length);

    for (const nm of names) {
      unionNames.add(nm);
    }
  });

  const c = liftPerRun.filter((n) => n > 0).length; // runs that surfaced >= 1 named refactoring

  return {
    suite,
    cell,
    arm,
    runs,
    tokens: {
      ...tokens,
      total_cost_usd_mean: runs ? tokens.total_cost_usd_total / runs : 0,
    },
    model_usage_total: modelUsageTotal,
    tools: {
      merged: toolsMerged,
      spawn_count_total: spawnTotal,
      spawn_count_mean: runs ? spawnTotal / runs : 0,
    },
    lift: {
      per_run: liftPerRun,
      mean: runs ? liftPerRun.reduce((a, b) => a + b, 0) / runs : 0,
      union_names: [...unionNames],
      union_count: unionNames.size,
    },
    passk: {
      dimension: 'lift>0 (surfaced >= 1 named Fowler/Kerievsky refactoring)',
      n: runs,
      c,
      passAt1: passAtK(runs, c, 1),
      passAt3: passAtK(runs, c, 3),
      passHat3: passHatK(runs, c, 3),
    },
  };
}

// Suite name = the dir two levels above `results` (e.g. .../e2e-nx/results/recommend -> e2e-nx).
function suiteOf(resultsRoot) {
  return path.basename(path.dirname(path.dirname(resultsRoot)));
}

// Recursively collect every run dir (containing meta.json) under a results root. Fail-closed on a
// garbled meta.json (never silently skip -- T-14-07).
function collectRuns(root, suite, armFilter, cellFilter, out) {
  if (!fs.existsSync(root)) {
    return;
  }

  const walk = (dir) => {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, ent.name);

      if (ent.isDirectory()) {
        walk(full);

        continue;
      }

      if (ent.name !== 'meta.json') {
        continue;
      }

      let meta;

      try {
        meta = JSON.parse(fs.readFileSync(full, 'utf8'));
      } catch (e) {
        fail(`garbled meta.json at ${full}: ${e.message}`);
      }

      if (!meta.prompt_id || !meta.arm) {
        fail(`meta.json at ${full} is missing prompt_id/arm (cannot key it)`);
      }

      if (!armFilter.includes(meta.arm)) {
        continue;
      }

      if (cellFilter && cellFilter.length && !cellFilter.includes(meta.prompt_id)) {
        continue;
      }

      let answer = '';
      const answerPath = path.join(path.dirname(full), 'answer.md');

      if (fs.existsSync(answerPath)) {
        answer = fs.readFileSync(answerPath, 'utf8');
      }

      out.push({ suite, cell: meta.prompt_id, arm: meta.arm, meta, answer });
    }
  };

  walk(root);
}

function tabulate({ resultsRoots, arms, cells, out }) {
  const records = [];

  for (const root of resultsRoots) {
    collectRuns(root, suiteOf(root), arms, cells, records);
  }

  const groups = new Map(); // suite|cell|arm -> {suite, cell, arm, metas, answers}

  for (const r of records) {
    const key = `${r.suite}|${r.cell}|${r.arm}`;

    if (!groups.has(key)) {
      groups.set(key, { suite: r.suite, cell: r.cell, arm: r.arm, metas: [], answers: [] });
    }

    const g = groups.get(key);
    g.metas.push(r.meta);
    g.answers.push(r.answer);
  }

  const cellBlocks = [...groups.values()]
    .sort((a, b) => `${a.suite}${a.cell}${a.arm}`.localeCompare(`${b.suite}${b.cell}${b.arm}`))
    .map((g) => tabulateGroup(g.suite, g.cell, g.arm, g.metas, g.answers));

  const rollup = {
    generated_by: 'tabulate-mechanical.mjs',
    generated_at: new Date().toISOString(),
    note:
      'MECHANICAL D-04 dimensions only (tokens, tool usage + sub-agent spawn count, lift). ' +
      'GRADED dimensions (book authenticity, output quality, over/under-engineering, ' +
      'idiom/pattern) are oracle/judge-owned in 14-05 (DST-04) and are NOT computed here.',
    passk_source: 'run-e2e.mjs comb/passAtK/passHatK -- formulas copied verbatim (PATTERNS Pattern F)',
    name_source: 'grade-run.mjs FOWLER+KERIEVSKY name arrays -- imported',
    spawn_tool_names: [...SPAWN_TOOL_NAMES],
    lift_predicate: 'distinct named Fowler/Kerievsky refactorings in answer.md (mechanical heuristic; graded lift is oracle-owned in 14-05)',
    arms,
    cell_filter: cells && cells.length ? cells : null,
    results_roots: resultsRoots,
    cells: cellBlocks,
  };

  fs.writeFileSync(out, JSON.stringify(rollup, null, 2) + '\n');
  console.log(
    `tabulate-mechanical: wrote ${cellBlocks.length} (cell, arm) blocks -> ${out} ` +
      `(${records.length} runs across ${resultsRoots.filter((r) => fs.existsSync(r)).length} results root(s))`,
  );
}

function approxEq(a, b, eps = 1e-9) {
  return Math.abs(a - b) < eps;
}

function selfcheck() {
  let ok = true;
  const assert = (cond, msg) => {
    if (!cond) {
      ok = false;
      console.error('SELFCHECK FAIL:', msg);
    }
  };

  // Pass@k / Pass^k against hand-computed values (the copied formulas must match run-e2e.mjs).
  assert(approxEq(passAtK(3, 2, 1), 2 / 3), 'passAtK(3,2,1) = 2/3');
  assert(passAtK(3, 3, 3) === 1, 'passAtK(3,3,3) = 1');
  assert(passAtK(1, 1, 3) === null, 'passAtK(1,1,3) = null (k > n)');
  assert(passHatK(3, 2, 3) === 0, 'passHatK(3,2,3) = 0 (all-3 impossible with c=2)');
  assert(passHatK(3, 3, 3) === 1, 'passHatK(3,3,3) = 1');

  // spawnCount is spelling-agnostic and counts only spawn tools.
  assert(spawnCount({ Bash: 6, Read: 3, Task: 2 }) === 2, 'spawnCount reads Task=2');
  assert(spawnCount({ Agent: 4, Read: 1 }) === 4, 'spawnCount reads Agent=4 (alternate spelling)');
  assert(spawnCount({ Bash: 9, Read: 2 }) === 0, 'spawnCount = 0 when no spawn tool present');

  // distinctNames: word-bounded + shadow-suppressed.
  assert(distinctNames('do an Extract Function on the totals block').length === 1, 'one named refactoring counts as 1');
  assert(distinctNames('this is just Extract Functionality').length === 0, 'no sub-match on a longer word');

  // Fixture-driven end-to-end check of tabulateGroup (the deterministic core), zero spend.
  const fixMeta = JSON.parse(fs.readFileSync(path.join(HERE, 'fixtures', 'meta.sample.json'), 'utf8'));
  const fixAnswer = fs.readFileSync(path.join(HERE, 'fixtures', 'answer.sample.md'), 'utf8');

  const block = tabulateGroup('fixture', fixMeta.prompt_id, fixMeta.arm, [fixMeta], [fixAnswer]);

  // Known token totals (synthetic values pinned in the fixture).
  assert(block.runs === 1, 'fixture is a single run');
  assert(block.tokens.input_total === 1200, `input_total = 1200 (got ${block.tokens.input_total})`);
  assert(block.tokens.output_total === 800, `output_total = 800 (got ${block.tokens.output_total})`);
  assert(block.tokens.cache_read_total === 5000, `cache_read_total = 5000 (got ${block.tokens.cache_read_total})`);
  assert(approxEq(block.tokens.total_cost_usd_total, 0.5), `total_cost_usd_total = 0.5 (got ${block.tokens.total_cost_usd_total})`);
  assert(block.tokens.num_turns_total === 9, `num_turns_total = 9 (got ${block.tokens.num_turns_total})`);

  // Headline model row (the opus row rolls up sub-agents; the haiku row is the CLI fast-model tax).
  assert(approxEq(block.model_usage_total['claude-opus-4-8'].costUSD, 0.49), 'opus model row costUSD = 0.49');
  assert(block.model_usage_total['claude-opus-4-8'].input === 1200, 'opus model row input = 1200');

  // Tool histogram + the 2-spawn count (the fixture carries an Agent-spawn entry: Task=2).
  assert(block.tools.merged.Bash === 6, `merged Bash = 6 (got ${block.tools.merged.Bash})`);
  assert(block.tools.spawn_count_total === 2, `spawn_count_total = 2 (got ${block.tools.spawn_count_total})`);

  // Lift: the fixture answer names exactly two Fowler refactorings.
  assert(block.lift.per_run[0] === 2, `lift per_run[0] = 2 (got ${block.lift.per_run[0]})`);
  assert(block.lift.union_count === 2, `lift union_count = 2 (got ${block.lift.union_count})`);
  assert(
    block.lift.union_names.includes('Extract Function') && block.lift.union_names.includes('Introduce Parameter Object'),
    `lift union_names = [Extract Function, Introduce Parameter Object] (got ${JSON.stringify(block.lift.union_names)})`,
  );

  // Pass@k on the lift>0 predicate for the single passing fixture run.
  assert(block.passk.n === 1 && block.passk.c === 1, 'fixture passk n=1 c=1 (the run surfaced a named refactoring)');
  assert(block.passk.passAt1 === 1, 'fixture passAt1 = 1');
  assert(block.passk.passAt3 === null, 'fixture passAt3 = null (k > n)');

  if (ok) {
    console.log('tabulate-mechanical: SELFCHECK OK - tokens, spawn count, lift, and Pass@k compute correctly against the fixture (zero spend)');
    process.exit(0);
  }

  console.error('tabulate-mechanical: SELFCHECK FAILED');
  process.exit(1);
}

function parseArgs(argv) {
  const args = { selfcheck: false, resultsRoots: [], arms: [], cells: [], out: DEFAULT_OUT };

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];

    if (a === '--selfcheck') {
      args.selfcheck = true;
    } else if (a === '--results') {
      args.resultsRoots.push(path.resolve(argv[++i]));
    } else if (a === '--arm') {
      args.arms.push(argv[++i]);
    } else if (a === '--cell') {
      args.cells.push(argv[++i]);
    } else if (a === '--out') {
      args.out = path.resolve(argv[++i]);
    } else {
      throw new Error(`unknown arg: ${a}`);
    }
  }

  return args;
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.selfcheck) {
    selfcheck();

    return;
  }

  tabulate({
    resultsRoots: args.resultsRoots.length ? args.resultsRoots : DEFAULT_RESULTS_ROOTS,
    arms: args.arms.length ? args.arms : DEFAULT_ARMS,
    cells: args.cells,
    out: args.out,
  });
}

main();
