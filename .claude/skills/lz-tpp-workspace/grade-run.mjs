#!/usr/bin/env node
// Deterministic grader for lz-tpp BEHAVIOR evals (EVAL-02).
//
// Design (05-CONTEXT.md D-04): grade deterministically FIRST -- objective checks are
// transformation-name presence (tolerant of spacing / hyphen-vs-space / optional parens /
// "#N" numbering) and the "coach, don't drive" tool-use check. Nuanced/rejection checks
// (e.g. "explicitly rejects plain recursion", "raises stack-safety unprompted") are
// best-effort regex heuristics, marked "(heuristic)" in evidence so a human / LLM-judge can
// confirm the borderline ones. This keeps grading reusable across iterations without an LLM.
//
// Emits grading.json in the EXACT shape skill-creator's aggregate_benchmark.py + eval-viewer
// require: { expectations: [{text, passed, evidence}], summary: {passed, failed, total, pass_rate} }.
//
// Usage:
//   node grade-run.mjs --eval-id <0-9> --output <coach-response.(txt|md)> [--metrics <metrics.json>] --out <grading.json>
//   node grade-run.mjs --selfcheck
//
// --metrics json (optional) drives the "coach, don't drive" check; shape:
//   { "edits": 0, "writes": 0, "testRuns": 0 }   (any > 0 => the coach drove => that check fails)
// Without --metrics, the no-drive check is reported passed:false with evidence asking for metrics.

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
function numRe(n) {
  return new RegExp(`#\\s*${n}\\b`);
}
const T = transformRe;

// ---- per-eval rubric. kinds: all(regex[]) | any(regex[]) | none(regex[]) | nodrive. soft => heuristic ----
const RUBRICS = {
  0: [
    { text: "Names ({} -> nil) then (nil -> constant)", all: [T("{} -> nil"), T("nil -> constant")] },
    { text: "Presents minimal `return 0`, not a full algorithm", any: [/return\s+0\b/i] },
    { text: "Coach, don't drive (no edit / no test run)", nodrive: true },
  ],
  1: [
    { text: "Names (unconditional -> if) + (constant -> scalar)", all: [T("unconditional -> if"), T("constant -> scalar")] },
    { text: "Does NOT jump to recursion", none: [/->\s*(tail[- ])?recursion/i, /\buse\s+recursion\b/i], soft: true },
    { text: "Coach, don't drive (no edit / no test run)", nodrive: true },
  ],
  2: [
    { text: "Names (statement -> tail-recursion) #9", any: [T("statement -> tail-recursion"), numRe(9)] },
    { text: "Explicitly rejects plain (statement -> recursion) #11", any: [/(not|avoid|don't|do not|instead of|rather than|premature)[^.\n]{0,60}(plain\s+)?(statement\s*->\s*recursion|#\s*11)/i], soft: true },
    { text: "Coach, don't drive (no edit / no test run)", nodrive: true },
  ],
  3: [
    { text: "Raises that stack-safety is BEHAVIORAL (deep-input test)", any: [/stack[- ]saf/i, /behaviou?ral/i, /overflow/i], soft: true },
    { text: "Names (if -> while) + (variable -> assignment), or a trampoline", any: [/((if\s*->\s*while)[^.\n]{0,80}(variable\s*->\s*assignment))|((variable\s*->\s*assignment)[^.\n]{0,80}(if\s*->\s*while))/i, /\btrampoline\b/i] },
    { text: "Does NOT offer a plain V8 tail-recursive final answer", none: [/proper\s+tail\s+call/i], soft: true },
    { text: "Coach, don't drive (no edit / no test run)", nodrive: true },
  ],
  4: [
    { text: "States tail-recursion (#9) is NOT available for tree recursion", any: [/(no|not|isn't|cannot|can't|un-?available)[^.\n]{0,60}tail/i], soft: true },
    { text: "Recommends explicit-stack (if -> while) or a generator", any: [T("if -> while"), /\bgenerator\b/i, /explicit\s+stack/i] },
    { text: "Coach, don't drive (no edit / no test run)", nodrive: true },
  ],
  5: [
    { text: "Recommends BACKTRACKING (simpler test / structure-only refactor)", any: [/backtrack/i, /simpler\s+test/i, /smaller\s+(test|step)/i, /structure[- ]only/i] },
    { text: "Does NOT immediately apply (expression -> function) / write the whole algorithm", none: [T("expression -> function")], soft: true },
    { text: "Coach, don't drive (no edit / no test run)", nodrive: true },
  ],
  6: [
    { text: "Identifies this as a REFACTORING (not a transformation)", any: [/refactor/i] },
    { text: "Declines to name a numbered transformation", none: [/#\s*\d+/], soft: true },
    { text: "Coach, don't drive (no edit / no test run)", nodrive: true },
  ],
  7: [
    { text: "Corrects to (unconditional -> if) + (constant -> scalar)", all: [T("unconditional -> if"), T("constant -> scalar")] },
    { text: "Explains recursion is premature / lower-priority", any: [/premature/i, /higher[- ]priority/i, /too\s+early/i, /lower[- ]priority/i], soft: true },
    { text: "Coach, don't drive (no edit / no test run)", nodrive: true },
  ],
  8: [
    { text: "Cites the author's hedges (informal / roughly ordered / not likely / language specific)", any: [/informal/i, /roughly\s+ordered/i, /not\s+likely/i, /language[- ]specific/i] },
    { text: "Frames TPP as a heuristic, not a law", any: [/heuristic/i, /not\s+a\s+law/i, /guideline/i, /thinking\s+aid/i], soft: true },
    { text: "No edit / no test run", nodrive: true },
  ],
  9: [
    { text: "Notes strict priority prefers the smaller (constant -> scalar) step", any: [T("constant -> scalar")] },
    { text: "Allows the reasoned deviation (heuristic, not rigid 'no')", any: [/heuristic/i, /deviat/i, /with a (stated )?reason/i, /that'?s fine|you can|reasonable|go ahead/i], soft: true },
    { text: "Coach, don't drive (no edit / no test run)", nodrive: true },
  ],
};

function runCheck(check, resp, metrics) {
  if (check.nodrive) {
    if (!metrics) {
      return { passed: false, evidence: "no metrics.json provided; run with --metrics to verify no Edit/Write/test-run" };
    }

    const drove = (metrics.edits | 0) > 0 || (metrics.writes | 0) > 0 || (metrics.testRuns | 0) > 0;

    return {
      passed: !drove,
      evidence: drove
        ? `coach DROVE: edits=${metrics.edits || 0} writes=${metrics.writes || 0} testRuns=${metrics.testRuns || 0}`
        : "no Edit/Write/test-run recorded",
    };
  }

  const firstHit = (list) => {
    for (const re of list) {
      const m = resp.match(re);

      if (m) {
        return m[0];
      }
    }

    return null;
  };
  const tag = check.soft ? " (heuristic; confirm if borderline)" : "";

  if (check.all) {
    const misses = check.all.filter((re) => !resp.match(re));
    const passed = misses.length === 0;

    return { passed, evidence: (passed ? `matched all required patterns` : `missing ${misses.length} of ${check.all.length} required pattern(s)`) + tag };
  }

  if (check.any) {
    const hit = firstHit(check.any);

    return { passed: !!hit, evidence: (hit ? `matched: ${hit}` : "no required pattern found") + tag };
  }

  if (check.none) {
    const bad = firstHit(check.none);

    return { passed: !bad, evidence: (bad ? `found disallowed: ${bad}` : "no disallowed pattern") + tag };
  }

  return { passed: false, evidence: "unknown check kind" };
}

function grade(evalId, resp, metrics) {
  const rubric = RUBRICS[evalId];

  if (!rubric) {
    throw new Error(`no rubric for eval-id ${evalId} (have 0..9)`);
  }

  const expectations = rubric.map((c) => {
    const { passed, evidence } = runCheck(c, resp, metrics);

    return { text: c.text, passed, evidence };
  });
  const passed = expectations.filter((e) => e.passed).length;
  const total = expectations.length;

  return {
    expectations,
    summary: { passed, failed: total - passed, total, pass_rate: total ? passed / total : 0 },
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

  // eval 2: a good coach response should pass the "names #9" check regardless of arrow spacing.
  const good2 = grade(2, "Apply ( statement->tail recursion ) #9 with an accumulator; do NOT jump to plain (statement -> recursion) #11 yet.", { edits: 0, writes: 0, testRuns: 0 });
  assert(good2.expectations[0].passed, "eval2 tail-recursion name should match tolerant spacing");
  assert(good2.expectations[1].passed, "eval2 rejection heuristic should match 'do NOT jump to plain (statement -> recursion)'");
  assert(good2.expectations[2].passed, "eval2 no-drive should pass with zero edits/writes/testRuns");
  assert(good2.summary.pass_rate === 1, "eval2 clean response should be 3/3");

  // no-drive must FAIL when the coach edited code.
  const drove = grade(0, "return 0 for ({} -> nil) then (nil -> constant)", { edits: 2, writes: 1, testRuns: 0 });
  assert(drove.expectations[2].passed === false, "eval0 no-drive must fail when edits>0");

  // no-drive without metrics => not verified (fail-safe).
  const noMetrics = grade(0, "return 0 for ({}->nil) then (nil->constant)", null);
  assert(noMetrics.expectations[2].passed === false, "no-drive without metrics must be reported false");
  assert(noMetrics.expectations[0].passed, "eval0 names both transformations without spaces");

  // eval 6: classifies refactoring, declines a numbered transformation.
  const ref = grade(6, "That's a refactoring (structure-only); it is not priority-ranked, so no numbered transformation applies.", { edits: 0, writes: 0, testRuns: 0 });
  assert(ref.expectations[0].passed, "eval6 should detect 'refactoring'");
  assert(ref.expectations[1].passed, "eval6 declines a numbered transformation (no #N present)");

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

  const resp = fs.readFileSync(args.output, "utf8");
  const metrics = args.metrics ? JSON.parse(fs.readFileSync(args.metrics, "utf8")) : null;
  const result = grade(Number(args["eval-id"]), resp, metrics);
  fs.writeFileSync(args.out, JSON.stringify(result, null, 2) + "\n");
  console.log(`graded eval-${args["eval-id"]}: ${result.summary.passed}/${result.summary.total} -> ${args.out}`);
}

main();
