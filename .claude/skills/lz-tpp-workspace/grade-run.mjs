#!/usr/bin/env node
// Deterministic PRE-FILTER grader for lz-tpp BEHAVIOR evals (EVAL-02).
//
// A regex grader can reliably check only OBJECTIVE facts -- (a) that a specific transformation
// NAME is present, and (b) that the coach did not edit code / run tests ("coach, don't drive",
// from a per-run metrics.json). It CANNOT reliably judge nuance ("does NOT recommend X" --
// a good coach names X to warn against it -> false-fail; a bad coach does X in code without
// naming it -> false-pass), unprompted insight, or deviation-vs-refusal. Those are DELEGATED to
// the LLM judge (skill-creator agents/grader.md).
//
// Each expectation is one of:
//   { names: ["a -> b", ...] }  -> SCORED: ALL canonical transform names present (tolerant, word-bounded)
//   { anyRe: [/re/, ...] }      -> SCORED: at least one regex matches (only stable, discriminating tokens)
//   { nodrive: true }           -> SCORED: metrics show no mutating/exec tool use (fail-safe/fail-loud, see below)
//   { judge: "question" }       -> UNSCORED: emitted passed:null; the LLM judge must resolve it
//
// metrics.json (--metrics) shape for the nodrive check -- BOTH accepted:
//   canonical (skill-creator schemas.md):  { "tool_calls": { "Edit": N, "Write": N, "Bash": N, ... } }
//   flat convenience:                       { "edits": N, "writes": N, "testRuns": N }
// "drove" = any of Edit/Write/MultiEdit/NotebookEdit/Bash (or edits/writes/testRuns) > 0.
// Fail-safe: no --metrics -> nodrive fails (can't verify). Fail-LOUD: --metrics present but NO
// recognized keys -> nodrive fails with an explicit "unrecognized shape" evidence (never a
// silent pass). Bash counts as driving (running the tests/commands is not coaching).
//
// grading.json shape stays exactly what aggregate_benchmark.py + the viewer read:
//   { expectations:[{text,passed,evidence}], summary:{passed,failed,total,pass_rate} }
// plus (consumer-ignored) preliminary:true, judge_required:[texts].
// The summary is PRELIMINARY (SCORED checks only). The EVAL-02 run flow MUST run the LLM judge on
// judge_required, merge those verdicts into expectations, and RECOMPUTE summary before Pass@k
// (a run "fully passes" only when ALL expectations pass). To make that non-optional, this script
// STRUCTURALLY refuses to emit grading.json while judge items remain -- it writes
// grading.preliminary.json instead; aggregate_benchmark.py then skips that run dir (fail-closed)
// rather than counting an unmerged scored-only summary as a false pass.
//
// Usage:
//   node grade-run.mjs --eval-id <0-9> --output <coach-response.(txt|md)> [--metrics <metrics.json>] --out <grading.json>
//   node grade-run.mjs --selfcheck

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// ---- transform-name matcher: tolerant of spacing / hyphen-vs-space / optional parens, but word-bounded ----
function transformRe(canonical) {
  const [a, b] = canonical.split("->").map((s) => s.trim());
  const esc = (s) =>
    s
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&") // escape regex metacharacters
      .replace(/\\\{\\\}/g, "\\{\\s*\\}") // {} -> { \s* }
      .replace(/-/g, "[- ]"); // hyphen OR space
  // (?<![\w+]) / (?![\w+]) stop a token from sub-matching a different transformation,
  // e.g. `nil -> constant` must NOT match `(nil -> constant+)` (#3) or `inconstant -> scalar`.
  return new RegExp(`(?<![\\w+])\\(?\\s*${esc(a)}\\s*->\\s*${esc(b)}(?![\\w+])\\s*\\)?`, "i");
}
const T = transformRe;

// ---- metrics -> "coach drove?" (accepts nested tool_calls OR flat keys; reports if unrecognized) ----
function toolDrive(metrics) {
  if (!metrics || typeof metrics !== "object") {
    return { recognized: false };
  }

  const pos = (v) => {
    const n = Number(v);

    return Number.isFinite(n) && n > 0;
  };
  const tc = metrics.tool_calls;

  if (tc && typeof tc === "object") {
    const keys = ["Edit", "Write", "MultiEdit", "NotebookEdit", "Bash"];
    const hits = keys.filter((k) => pos(tc[k])).map((k) => `${k}=${tc[k]}`);

    return { recognized: true, drove: hits.length > 0, detail: hits.join(", ") || "none" };
  }

  const flat = ["edits", "writes", "testRuns"];

  if (flat.some((k) => k in metrics)) {
    const hits = flat.filter((k) => pos(metrics[k])).map((k) => `${k}=${metrics[k]}`);

    return { recognized: true, drove: hits.length > 0, detail: hits.join(", ") || "none" };
  }

  return { recognized: false };
}

// ---- per-eval rubric. SCORED: names/anyRe/nodrive. UNSCORED: judge. (Count must match evals.json expectations.) ----
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
    { judge: "Identifies this as a REFACTORING (structure-only, behavior-preserving), not a transformation" },
    { judge: "Declines to name a numbered / priority-ranked transformation (it belongs to the refactor step)" },
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

    const d = toolDrive(metrics);

    if (!d.recognized) {
      return {
        text: check.text,
        passed: false,
        evidence: "metrics.json present but NO recognized tool-call keys (expected tool_calls.{Edit,Write,Bash,...} or edits/writes/testRuns) -- cannot verify no-drive",
      };
    }

    return {
      text: check.text,
      passed: !d.drove,
      evidence: d.drove ? `coach DROVE: ${d.detail}` : "no Edit/Write/MultiEdit/NotebookEdit/Bash recorded",
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

// Structural guard: never emit a FINAL-looking grading.json while judge items remain.
function finalOutPath(outArg, judgeCount) {
  return judgeCount > 0 ? path.join(path.dirname(outArg), "grading.preliminary.json") : outArg;
}

function selfcheck() {
  let ok = true;
  const assert = (cond, msg) => {
    if (!cond) {
      ok = false;
      console.error("SELFCHECK FAIL:", msg);
    }
  };
  const zero = { tool_calls: { Edit: 0, Write: 0, Bash: 0 } };

  // names: tolerant of spacing / hyphen-vs-space / parens; FAILS on absence.
  const g0 = grade(0, "write `return 0` -- that's ( {}->nil ) then (nil -> constant)", zero);
  assert(g0.expectations[0].passed === true, "eval0 names both transformations with varied spacing");
  assert(g0.expectations[1].passed === null, "eval0 'not a full algorithm' is judge-only (passed:null)");
  assert(g0.expectations[2].passed === true, "eval0 nodrive passes with zero tool calls");
  assert(g0.summary.total === 2, "eval0 summary counts only the 2 SCORED checks");
  assert(g0.judge_required.length === 1, "eval0 reports 1 judge_required item");
  const g0miss = grade(0, "just `return 0` for the base case", zero);
  assert(g0miss.expectations[0].passed === false, "eval0 names must FAIL when (nil -> constant) is absent");

  // transformRe word boundary: must not sub-match a different transformation.
  assert(!T("nil -> constant").test("recommend (nil -> constant+)"), "T('nil -> constant') must NOT match (nil -> constant+) [#3]");
  assert(T("nil -> constant").test("recommend (nil -> constant)"), "T('nil -> constant') still matches the exact token");
  assert(T("statement -> tail-recursion").test("( statement -> tail recursion )"), "T tolerant of hyphen-vs-space + spacing");

  // nodrive: nested (canonical) shape now DETECTED as drove; flat shape works; unrecognized fails loud; missing fails safe.
  const droveNested = grade(2, "apply (statement -> tail-recursion)", { tool_calls: { Edit: 3, Write: 2, Bash: 1 } });
  assert(droveNested.expectations[2].passed === false, "nested tool_calls with edits>0 must FAIL nodrive (the bug fresh review caught)");
  const droveFlat = grade(2, "apply (statement -> tail-recursion)", { edits: 1 });
  assert(droveFlat.expectations[2].passed === false, "flat edits>0 must FAIL nodrive");
  const miskeyed = grade(2, "apply (statement -> tail-recursion)", { foo: 1, bar: 2 });
  assert(miskeyed.expectations[2].passed === false, "unrecognized metrics shape must FAIL nodrive (no silent pass)");
  assert(/unrecognized|no recognized/i.test(miskeyed.expectations[2].evidence), "miskeyed metrics evidence names the shape problem");
  const noMetrics = grade(2, "apply ( statement -> tail recursion )", null);
  assert(noMetrics.expectations[2].passed === false, "nodrive without metrics reports false (fail-safe)");
  assert(noMetrics.expectations[0].passed === true, "eval2 tail-recursion name matches hyphen-or-space form");

  // anyRe: matches T('if -> while') / generator / explicit stack; FAILS on none.
  const g4tf = grade(4, "switch to an ( if -> while ) loop", zero);
  assert(g4tf.expectations[1].passed === true, "eval4 anyRe matches the T('if -> while') entry (tolerant)");
  const g4gen = grade(4, "convert it to a generator-as-state-machine", zero);
  assert(g4gen.expectations[1].passed === true, "eval4 anyRe matches 'generator'");
  const g4none = grade(4, "just memoize the results", zero);
  assert(g4none.expectations[1].passed === false, "eval4 anyRe must FAIL when no required pattern is present");

  // judge checks never autonomously pass/fail (no false signal from inverted heuristics).
  const g9 = grade(9, "no, you can't skip, take the higher-priority move", zero);
  assert(g9.expectations[1].passed === null, "eval9 anti-dogma check is judge-only; a rigid refusal is NOT wrongly passed");
  assert(g9.summary.total === 1, "eval9 has exactly 1 scored check (nodrive)");

  // fail-closed output path: judge items remain -> grading.preliminary.json, NOT grading.json.
  assert(finalOutPath("x/grading.json", 1).endsWith("grading.preliminary.json"), "judge items remaining -> preliminary path");
  assert(finalOutPath("x/grading.json", 0) === "x/grading.json", "no judge items -> honor --out path");

  // RUBRICS <-> evals.json alignment (catches drift like the eval-6 count mismatch fresh review found).
  try {
    const evalsPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "evals", "evals.json");
    const doc = JSON.parse(fs.readFileSync(evalsPath, "utf8"));

    for (const e of doc.evals) {
      assert(Array.isArray(RUBRICS[e.id]), `RUBRICS is missing an entry for eval ${e.id}`);
      assert(
        RUBRICS[e.id] && RUBRICS[e.id].length === e.expectations.length,
        `eval ${e.id}: RUBRICS has ${RUBRICS[e.id] ? RUBRICS[e.id].length : 0} checks but evals.json has ${e.expectations.length} expectations (drift)`,
      );
    }
  } catch (e) {
    assert(false, `alignment check could not read evals.json: ${e.message}`);
  }

  console.log(ok ? "SELFCHECK OK" : "SELFCHECK FAILED");
  process.exit(ok ? 0 : 1);
}

function parseArgs(argv) {
  const a = {};

  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];

    if (k === "--selfcheck") {
      a.selfcheck = true;
    } else if (k.startsWith("--") && k.includes("=")) {
      const idx = k.indexOf("=");
      a[k.slice(2, idx)] = k.slice(idx + 1); // support --flag=value
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

  const validIds = Object.keys(RUBRICS).map(Number);
  const evalId = Number(args["eval-id"]);

  if (!validIds.includes(evalId)) {
    console.error(`--eval-id must be one of ${validIds.join(", ")} (got "${args["eval-id"]}")`);
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

  const result = grade(evalId, resp, metrics);
  const outPath = finalOutPath(args.out, result.judge_required.length);

  try {
    fs.writeFileSync(outPath, JSON.stringify(result, null, 2) + "\n");
  } catch (e) {
    console.error(`cannot write ${outPath}: ${e.message}`);
    process.exit(2);
  }

  const note = result.judge_required.length > 0 ? " [PRELIMINARY -- run the LLM-judge merge to produce grading.json]" : "";
  console.log(`graded eval-${evalId}: ${result.summary.passed}/${result.summary.total} scored, ${result.judge_required.length} need LLM-judge -> ${outPath}${note}`);
}

main();
