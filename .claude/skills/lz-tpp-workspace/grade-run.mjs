#!/usr/bin/env node
// Deterministic PRE-FILTER grader for lz-tpp BEHAVIOR evals (EVAL-02).
//
// Reviewed 2026-07-02 by two independent agents. Key finding: a regex grader can reliably
// check only OBJECTIVE facts -- (a) that a specific transformation NAME is present, and
// (b) that the coach did not edit code / run tests ("coach, don't drive", via a metrics.json).
// It CANNOT reliably judge nuance: "does NOT recommend X" (a good coach names X to warn
// against it -> false-fail; a bad coach does X in code without naming it -> false-pass),
// "raises an insight unprompted" (prompt-echo free passes), or "allows a deviation vs a rigid
// refusal" (negation scope). Those are DELEGATED to the LLM judge (skill-creator agents/grader.md).
//
// So each expectation is one of:
//   { names: ["a -> b", ...] }  -> SCORED: ALL canonical transform names present (tolerant match)
//   { anyRe: [/re/, ...] }      -> SCORED: at least one regex matches (only for stable, discriminating tokens)
//   { nodrive: true }           -> SCORED: metrics.json shows edits=writes=testRuns=0 (fail-safe false without metrics)
//   { judge: "question" }       -> UNSCORED: emitted passed:null; the LLM judge must resolve it
//
// grading.json shape stays exactly what aggregate_benchmark.py + the eval-viewer read:
//   { expectations:[{text,passed,evidence}], summary:{passed,failed,total,pass_rate} }
// plus extra (ignored-by-consumer) fields: preliminary:true, judge_required:[texts].
// IMPORTANT: summary here is PRELIMINARY (scored checks only). The EVAL-02 run flow MUST run
// the LLM judge on judge_required, merge those verdicts into expectations, and recompute the
// summary before Pass@k / Pass^k is taken (a run "fully passes" only when ALL expectations do).
//
// Usage:
//   node grade-run.mjs --eval-id <0-9> --output <coach-response.(txt|md)> [--metrics <metrics.json>] --out <grading.json>
//   node grade-run.mjs --selfcheck
//
// --metrics json shape: { "edits": 0, "writes": 0, "testRuns": 0 }  (any > 0 => coach drove => nodrive fails)

import fs from "node:fs";

// ---- transform-name matcher: tolerant of spacing, hyphen/space, optional parens ----
function transformRe(canonical) {
  const [a, b] = canonical.split("->").map((s) => s.trim());
  const esc = (s) =>
    s
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&") // escape regex metacharacters
      .replace(/\\\{\\\}/g, "\\{\\s*\\}") // {} -> { \s* }
      .replace(/-/g, "[- ]"); // hyphen OR space
  return new RegExp(`\\(?\\s*${esc(a)}\\s*->\\s*${esc(b)}\\s*\\)?`, "i");
}
const T = transformRe;

// ---- per-eval rubric. SCORED: names/anyRe/nodrive. UNSCORED: judge. ----
const RUBRICS = {
  0: [
    { names: ["{} -> nil", "nil -> constant"] },
    { judge: "Presents only minimal code (e.g. `return 0`), NOT a full Fibonacci algorithm" },
    { nodrive: true, text: "Coach, don't drive (no edit / no test run)" },
  ],
  1: [
    { names: ["unconditional -> if", "constant -> scalar"] },
    { judge: "Does NOT recommend jumping to a recursion transformation as the next move (naming recursion only to warn against it is fine)" },
    { nodrive: true, text: "Coach, don't drive (no edit / no test run)" },
  ],
  2: [
    { names: ["statement -> tail-recursion"] },
    { judge: "Explicitly prefers (statement -> tail-recursion) #9 OVER plain (statement -> recursion) #11 as the pick (rejects #11 as the next move)" },
    { nodrive: true, text: "Coach, don't drive (no edit / no test run)" },
  ],
  3: [
    { judge: "Raises, UNPROMPTED, that the deep-input test makes stack-safety BEHAVIORAL -- a transformation, not merely a refactoring (do not credit an echo of the word 'overflow' from the prompt)" },
    { judge: "Recommends the stack-safe form: (if -> while) + (variable -> assignment), or an explicitly-named trampoline" },
    { judge: "Does NOT offer a plain (V8) tail-recursive solution as the FINAL answer" },
    { nodrive: true, text: "Coach, don't drive (no edit / no test run)" },
  ],
  4: [
    { judge: "States (statement -> tail-recursion) #9 is NOT available for this tree recursion (no single tail call)" },
    { anyRe: [T("if -> while"), /\bgenerator\b/i, /explicit\s+stack/i], text: "Recommends an explicit-stack (if -> while) iteration or a generator-as-state-machine" },
    { nodrive: true, text: "Coach, don't drive (no edit / no test run)" },
  ],
  5: [
    { judge: "Recommends BACKTRACKING: pose a simpler intermediate test (or a structure-only refactor first) instead of writing the whole algorithm now" },
    { judge: "Does NOT just write the whole wrap algorithm / apply the low-priority (expression -> function) #12 now" },
    { nodrive: true, text: "Coach, don't drive (no edit / no test run)" },
  ],
  6: [
    { anyRe: [/\brefactor/i], text: "Identifies this as a REFACTORING (structure-only)" },
    { judge: "Declines to assign a numbered / priority-ranked transformation (treats it as a refactoring, not priority-ranked)" },
    { nodrive: true, text: "Coach, don't drive (no edit / no test run)" },
  ],
  7: [
    { names: ["unconditional -> if", "constant -> scalar"] },
    { judge: "Corrects the user's premature jump: explains recursion is premature / lower-priority here and the base-case split is preferred" },
    { nodrive: true, text: "Coach, don't drive (no edit / no test run)" },
  ],
  8: [
    { judge: "Cites the author's own hedges (informal / roughly ordered / not likely / language-specific) and that the list is ordered by increasing complexity -- the coach's own explanation, not a bare echo of the quoted 'not likely' in the prompt" },
    { judge: "Frames TPP as a heuristic / thinking aid, NOT a rigid law" },
    { nodrive: true, text: "No edit / no test run" },
  ],
  9: [
    { judge: "Notes strict priority prefers the smaller (constant -> scalar) step first (the coach's own framing, not just an echo of the prompt token)" },
    { judge: "ALLOWS the reasoned deviation to (scalar -> array) as a heuristic with a stated reason -- does NOT rigidly refuse ('no, take the higher-priority move')" },
    { nodrive: true, text: "Coach, don't drive (no edit / no test run)" },
  ],
};

function scoreCheck(check, resp, metrics) {
  if (check.judge) {
    return { text: check.judge, passed: null, evidence: "LLM-JUDGE REQUIRED (not deterministically checkable)" };
  }

  if (check.nodrive) {
    if (!metrics) {
      return { text: check.text, passed: false, evidence: "no metrics.json provided; run with --metrics to verify no Edit/Write/test-run" };
    }

    const drove = (metrics.edits | 0) > 0 || (metrics.writes | 0) > 0 || (metrics.testRuns | 0) > 0;

    return {
      text: check.text,
      passed: !drove,
      evidence: drove
        ? `coach DROVE: edits=${metrics.edits || 0} writes=${metrics.writes || 0} testRuns=${metrics.testRuns || 0}`
        : "no Edit/Write/test-run recorded",
    };
  }

  if (check.names) {
    const misses = check.names.filter((c) => !resp.match(T(c)));
    const passed = misses.length === 0;

    return {
      text: `Names ${check.names.map((c) => `(${c})`).join(" + ")}`,
      passed,
      evidence: passed ? "all required transformation names present" : `missing: ${misses.map((c) => `(${c})`).join(", ")}`,
    };
  }

  if (check.anyRe) {
    let hit = null;

    for (const re of check.anyRe) {
      const m = resp.match(re);

      if (m) {
        hit = m[0];
        break;
      }
    }

    return { text: check.text, passed: !!hit, evidence: hit ? `matched: ${hit}` : "no required pattern found" };
  }

  return { text: check.text || "(unknown)", passed: false, evidence: "unknown check kind" };
}

function grade(evalId, resp, metrics) {
  const rubric = RUBRICS[evalId];

  if (!rubric) {
    throw new Error(`no rubric for eval-id ${evalId} (have 0..9)`);
  }

  const expectations = rubric.map((c) => scoreCheck(c, resp, metrics));
  const scored = expectations.filter((e) => e.passed !== null);
  const passed = scored.filter((e) => e.passed).length;
  const total = scored.length;
  const judge_required = expectations.filter((e) => e.passed === null).map((e) => e.text);

  return {
    expectations,
    summary: { passed, failed: total - passed, total, pass_rate: total ? passed / total : 0 },
    preliminary: true,
    judge_required,
  };
}

function selfcheck() {
  let ok = true;
  const assert = (cond, msg) => {
    if (!cond) {
      ok = false;
      console.error("SELFCHECK FAIL:", msg);
    }
  };

  // names: tolerant of spacing / hyphen-vs-space / parens.
  const g0 = grade(0, "write `return 0` -- that's ( {}->nil ) then (nil -> constant)", { edits: 0, writes: 0, testRuns: 0 });
  assert(g0.expectations[0].passed === true, "eval0 names both transformations with varied spacing");
  assert(g0.expectations[1].passed === null, "eval0 'not a full algorithm' is judge-only (passed:null)");
  assert(g0.expectations[2].passed === true, "eval0 nodrive passes with zero edits/writes/testRuns");
  assert(g0.summary.total === 2, "eval0 summary counts only the 2 SCORED checks, not the judge one");
  assert(g0.judge_required.length === 1, "eval0 reports 1 judge_required item");

  // names FAILS when a required transformation is absent.
  const g0miss = grade(0, "just `return 0` for the base case", { edits: 0, writes: 0, testRuns: 0 });
  assert(g0miss.expectations[0].passed === false, "eval0 names must FAIL when (nil -> constant) is absent");

  // nodrive fails when the coach edited code, and is fail-safe without metrics.
  const drove = grade(2, "apply (statement -> tail-recursion)", { edits: 2, writes: 1, testRuns: 0 });
  assert(drove.expectations[2].passed === false, "eval2 nodrive must fail when edits>0");
  const noMetrics = grade(2, "apply ( statement -> tail recursion )", null);
  assert(noMetrics.expectations[2].passed === false, "nodrive without metrics reports false (fail-safe)");
  assert(noMetrics.expectations[0].passed === true, "eval2 tail-recursion name matches hyphen-or-space form");

  // anyRe: eval4 c2 matches (if -> while) OR generator OR explicit stack.
  const g4 = grade(4, "use an explicit stack while-loop here", { edits: 0, writes: 0, testRuns: 0 });
  assert(g4.expectations[1].passed === true, "eval4 anyRe matches 'explicit stack'");
  const g4gen = grade(4, "convert it to a generator-as-state-machine", { edits: 0, writes: 0, testRuns: 0 });
  assert(g4gen.expectations[1].passed === true, "eval4 anyRe matches 'generator'");

  // judge checks never autonomously pass/fail (no false signal from inverted heuristics).
  const g9 = grade(9, "no, you can't skip, take the higher-priority move", { edits: 0, writes: 0, testRuns: 0 });
  assert(g9.expectations[1].passed === null, "eval9 anti-dogma check is judge-only, so a rigid refusal is NOT wrongly passed");
  assert(g9.summary.total === 1, "eval9 has exactly 1 scored check (nodrive); the two nuance checks are judged");

  console.log(ok ? "SELFCHECK OK" : "SELFCHECK FAILED");
  process.exit(ok ? 0 : 1);
}

function parseArgs(argv) {
  const a = {};

  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];

    if (k === "--selfcheck") {
      a.selfcheck = true;
    } else if (k.startsWith("--")) {
      a[k.slice(2)] = argv[++i];
    }
  }

  return a;
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.selfcheck) {
    selfcheck();

    return;
  }

  if (args["eval-id"] === undefined || !args.output || !args.out) {
    console.error("usage: node grade-run.mjs --eval-id <0-9> --output <file> [--metrics <file>] --out <grading.json>");
    process.exit(2);
  }

  let resp;

  try {
    resp = fs.readFileSync(args.output, "utf8");
  } catch (e) {
    console.error(`cannot read --output ${args.output}: ${e.message}`);
    process.exit(2);
  }

  let metrics = null;

  if (args.metrics) {
    try {
      metrics = JSON.parse(fs.readFileSync(args.metrics, "utf8"));
    } catch (e) {
      console.error(`cannot read/parse --metrics ${args.metrics}: ${e.message}`);
      process.exit(2);
    }
  }

  const result = grade(Number(args["eval-id"]), resp, metrics);

  try {
    fs.writeFileSync(args.out, JSON.stringify(result, null, 2) + "\n");
  } catch (e) {
    console.error(`cannot write --out ${args.out}: ${e.message}`);
    process.exit(2);
  }

  console.log(`graded eval-${args["eval-id"]}: ${result.summary.passed}/${result.summary.total} scored, ${result.judge_required.length} need LLM-judge -> ${args.out}`);
}

main();
