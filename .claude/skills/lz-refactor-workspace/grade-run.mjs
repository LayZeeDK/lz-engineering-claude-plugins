#!/usr/bin/env node
// Deterministic PRE-FILTER grader for lz-refactor BEHAVIOR evals (EVL-02).
//
// The coach's job is to name the correct NEXT refactoring in the correct LAYER for a
// tests-GREEN body carrying a smell. lz-refactor's smell->refactoring mapping is ONE-TO-MANY:
// a smell has a candidate set (any in-set pick can be right), and some scenarios pin a single
// best fit. This grader encodes the D-04-RUBRIC HYBRID so name + layer are scored
// DETERMINISTICALLY; only rationale QUALITY is delegated to the LLM judge.
//
// Each expectation is one of:
//   { bestFit: name }          -> SCORED: the pinned single best-fit NAME is present (word-bounded)
//   { candidateSet: [names] }  -> SCORED: the response names ANY in-set refactoring (one-to-many tolerance)
//   { layer: L | [L,...] }     -> SCORED: a named refactoring resolves to an accepted LAYER via the
//                                 name->layer lookup (L in Fowler | Kerievsky | Kerievsky-Away | functional)
//   { nodrive: true }          -> SCORED: metrics show no mutating/exec tool use (fail-safe/fail-loud, see below)
//   { judge: "question" }      -> UNSCORED: emitted passed:null; the LLM judge must resolve it (RATIONALE only)
//
// The name matcher (nameRe) matches a canonical refactoring NAME (a proper-noun phrase like
// "Extract Function" or "Replace Conditional with Polymorphism"), case-insensitive and
// whitespace-tolerant, but WORD-BOUNDED so "Extract Function" never sub-matches "Extract
// Functionality". The name->layer lookup (NAME_LAYERS) is derived from the three shipped catalog
// READMEs: the 62 Fowler names -> "Fowler"; the 27 Kerievsky names -> "Kerievsky" (the 3
// Direction=Away rows ALSO -> "Kerievsky-Away"); the functional idiom-leaf names -> "functional".
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
// The summary is PRELIMINARY (SCORED checks only). The EVL-02 run flow MUST run the LLM judge on
// judge_required, merge those verdicts into expectations, and RECOMPUTE summary before Pass@k
// (a run "fully passes" only when ALL expectations pass). To make that non-optional, this script
// STRUCTURALLY refuses to emit grading.json while judge items remain -- it writes
// grading.preliminary.json instead; aggregate_benchmark.py then skips that run dir (fail-closed)
// rather than counting an unmerged scored-only summary as a false pass.
//
// Usage:
//   node grade-run.mjs --eval-id <0-8> --output <coach-response.(txt|md)> [--metrics <metrics.json>] --out <grading.json>
//   node grade-run.mjs --selfcheck

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

// ---- refactoring-NAME matcher: case-insensitive, whitespace-tolerant, but WORD-BOUNDED ----
// A canonical name is a proper-noun phrase. Word boundaries (?<![\w-]) / (?![\w-]) stop a name
// from sub-matching a longer word, e.g. "Extract Function" must NOT match "Extract Functionality".
function nameRe(canonical) {
  const esc = canonical
    .trim()
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&") // escape regex metacharacters
    .replace(/\s+/g, "\\s+"); // tolerate any run of whitespace (incl. newlines) between words

  return new RegExp(`(?<![\\w-])${esc}(?![\\w-])`, "i");
}
const N = nameRe;

// ---- name->layer lookup, derived from the three shipped catalog READMEs (build-time DATA) ----
// Fowler 62 -> "Fowler"; Kerievsky 27 -> "Kerievsky" (+ the 3 Direction=Away rows -> "Kerievsky-Away");
// functional idiom-leaf names -> "functional". A Singleton dissolves to Module Namespace (functional),
// so the de-patterning scenario accepts BOTH Inline Singleton (Kerievsky-Away) and Module Namespace.
const FOWLER = [
  // Ch.6 a first set
  "Extract Function", "Inline Function", "Extract Variable", "Inline Variable",
  "Change Function Declaration", "Encapsulate Variable", "Rename Variable",
  "Introduce Parameter Object", "Combine Functions into Class",
  "Combine Functions into Transform", "Split Phase",
  // Ch.7 encapsulation
  "Encapsulate Record", "Encapsulate Collection", "Replace Primitive with Object",
  "Replace Temp with Query", "Extract Class", "Inline Class", "Hide Delegate",
  "Remove Middle Man", "Substitute Algorithm",
  // Ch.8 moving features
  "Move Function", "Move Field", "Move Statements into Function", "Move Statements to Callers",
  "Replace Inline Code with Function Call", "Slide Statements", "Split Loop",
  "Replace Loop with Pipeline", "Remove Dead Code",
  // Ch.9 organizing data
  "Split Variable", "Rename Field", "Replace Derived Variable with Query",
  "Change Reference to Value", "Change Value to Reference",
  // Ch.10 simplifying conditional logic
  "Decompose Conditional", "Consolidate Conditional Expression",
  "Replace Nested Conditional with Guard Clauses", "Replace Conditional with Polymorphism",
  "Introduce Special Case", "Introduce Assertion",
  // Ch.11 refactoring APIs
  "Separate Query from Modifier", "Parameterize Function", "Remove Flag Argument",
  "Preserve Whole Object", "Replace Parameter with Query", "Replace Query with Parameter",
  "Remove Setting Method", "Replace Constructor with Factory Function",
  "Replace Function with Command", "Replace Command with Function", "Return Modified Value",
  // Ch.12 dealing with inheritance
  "Pull Up Method", "Pull Up Field", "Pull Up Constructor Body", "Push Down Method",
  "Push Down Field", "Replace Type Code with Subclasses", "Remove Subclass",
  "Extract Superclass", "Collapse Hierarchy", "Replace Subclass with Delegate",
  "Replace Superclass with Delegate",
];

const KERIEVSKY = [
  // Ch.6 Creation
  "Replace Constructors with Creation Methods", "Move Creation Knowledge to Factory",
  "Encapsulate Classes with Factory", "Introduce Polymorphic Creation with Factory Method",
  "Encapsulate Composite with Builder", "Inline Singleton",
  // Ch.7 Simplification
  "Compose Method", "Replace Conditional Logic with Strategy", "Move Embellishment to Decorator",
  "Replace State-Altering Conditionals with State", "Replace Implicit Tree with Composite",
  "Replace Conditional Dispatcher with Command",
  // Ch.8 Generalization
  "Form Template Method", "Extract Composite", "Replace One/Many Distinctions with Composite",
  "Replace Hard-Coded Notifications with Observer", "Unify Interfaces with Adapter",
  "Extract Adapter", "Replace Implicit Language with Interpreter",
  // Ch.9 Protection
  "Replace Type Code with Class", "Limit Instantiation with Singleton", "Introduce Null Object",
  // Ch.10 Accumulation
  "Move Accumulation to Collecting Parameter", "Move Accumulation to Visitor",
  // Ch.11 Utilities
  "Chain Constructors", "Unify Interfaces", "Extract Parameter",
];

// The Direction=Away rows (kerievsky-catalog/README.md): they de-pattern, so ALSO tag Kerievsky-Away.
const KERIEVSKY_AWAY = [
  "Encapsulate Composite with Builder",
  "Inline Singleton",
  "Move Accumulation to Visitor",
];

// Functional idiom-leaf names (functional-catalog/README.md leaves). Only the LEAF names are
// "functional"; the Fowler/Kerievsky source names in that README are cross-references, not idioms.
const FUNCTIONAL = [
  "Factory Function", "Function Composition", "Structural Clone", "Module Namespace",
  "First-Class Function", "Discriminated Union and Fold", "Memoization and Interning",
  "Thunk and Lazy Value", "Generator", "Reducer and Store", "Immutable Snapshot",
  "Observer Callbacks", "Branded Type", "Option and Either", "Currying and Partial Application",
  "Functor and Monad", "Lens and Optics", "Transducers", "Normalized Store",
];

const NAME_LAYERS = new Map();
const addLayer = (name, layer) => {
  const cur = NAME_LAYERS.get(name) || [];

  if (!cur.includes(layer)) {
    cur.push(layer);
  }

  NAME_LAYERS.set(name, cur);
};

for (const n of FOWLER) {
  addLayer(n, "Fowler");
}

for (const n of KERIEVSKY) {
  addLayer(n, "Kerievsky");
}

for (const n of KERIEVSKY_AWAY) {
  addLayer(n, "Kerievsky-Away");
}

for (const n of FUNCTIONAL) {
  addLayer(n, "functional");
}

// Distinct layers of every KNOWN refactoring name that appears in the response.
// Longest-match / full-name-boundary resolution: a shorter canonical name that is a word-bounded
// sub-phrase of a LONGER matched name is SHADOWED (its layers are not credited), so the functional
// leaf "Factory Function" never leaks its layer into the Fowler name "Replace Constructor with
// Factory Function" (CR-01). Because a proper sub-phrase is always shorter than the name that
// contains it, this only suppresses phantom sub-matches and never drops a genuinely named move.
function layersInResponse(resp) {
  const matched = [...NAME_LAYERS.keys()].filter((name) => nameRe(name).test(resp));
  const found = new Set();

  for (const name of matched) {
    const shadowed = matched.some(
      (other) => other !== name && other.length > name.length && nameRe(name).test(other),
    );

    if (shadowed) {
      continue;
    }

    for (const l of NAME_LAYERS.get(name)) {
      found.add(l);
    }
  }

  return [...found];
}

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

// ---- per-eval rubric. SCORED: bestFit/candidateSet/layer/nodrive. UNSCORED: judge. ----
// Each RUBRICS[id] is count-aligned 1:1 (SAME ORDER) with that scenario's evals.json expectations.
const RUBRICS = {
  // Long Function -> Extract Function (Fowler mechanical)
  0: [
    { bestFit: "Extract Function", text: "Names Extract Function as the best-fit next refactoring" },
    {
      candidateSet: [
        "Extract Function", "Replace Temp with Query", "Introduce Parameter Object",
        "Preserve Whole Object", "Replace Function with Command", "Decompose Conditional",
        "Split Loop", "Replace Conditional with Polymorphism",
      ],
      text: "Names an in-set Long Function refactoring",
    },
    { layer: "Fowler", text: "Routes to the Fowler mechanical layer" },
    { judge: "Ties the pick to a nameable block within the long body (validate / compute totals / format receipt), not a generic 'shorten it'" },
    { nodrive: true, text: "Coach, don't drive (no edit / no test run)" },
  ],
  // Long Parameter List -> Introduce Parameter Object (Fowler mechanical)
  1: [
    { bestFit: "Introduce Parameter Object", text: "Names Introduce Parameter Object as the best-fit next refactoring" },
    {
      candidateSet: [
        "Replace Parameter with Query", "Preserve Whole Object", "Introduce Parameter Object",
        "Remove Flag Argument", "Combine Functions into Class",
      ],
      text: "Names an in-set Long Parameter List refactoring",
    },
    { layer: "Fowler", text: "Routes to the Fowler mechanical layer" },
    { judge: "Ties the pick to the street/city/zip clump that travels together, not a generic parameter reduction" },
    { nodrive: true, text: "Coach, don't drive (no edit / no test run)" },
  ],
  // Duplicated Code in sibling subclasses -> Pull Up Method (Fowler mechanical)
  2: [
    { bestFit: "Pull Up Method", text: "Names Pull Up Method as the best-fit next refactoring" },
    { candidateSet: ["Extract Function", "Slide Statements", "Pull Up Method"], text: "Names an in-set Duplicated Code refactoring" },
    { layer: "Fowler", text: "Routes to the Fowler mechanical layer" },
    { judge: "Ties the pick to WHERE the duplication lives (identical code in sibling subclasses -> lift to the shared parent), not a generic dedup" },
    { nodrive: true, text: "Coach, don't drive (no edit / no test run)" },
  ],
  // Feature Envy -> Move Function (Fowler mechanical)
  3: [
    { bestFit: "Move Function", text: "Names Move Function as the best-fit next refactoring" },
    { candidateSet: ["Move Function", "Extract Function"], text: "Names an in-set Feature Envy refactoring" },
    { layer: "Fowler", text: "Routes to the Fowler mechanical layer" },
    { judge: "Ties the pick to the whole function computing from Customer's fields (it envies the other module), siting it with that data" },
    { nodrive: true, text: "Coach, don't drive (no edit / no test run)" },
  ],
  // Conditional Complexity (whole-algorithm select) -> Replace Conditional Logic with Strategy (Kerievsky)
  4: [
    { bestFit: "Replace Conditional Logic with Strategy", text: "Names Replace Conditional Logic with Strategy as the best-fit next refactoring" },
    {
      candidateSet: [
        "Replace Conditional Logic with Strategy", "Move Embellishment to Decorator",
        "Replace State-Altering Conditionals with State", "Introduce Null Object",
      ],
      text: "Names an in-set Conditional Complexity refactoring",
    },
    { layer: "Kerievsky", text: "Routes to the Kerievsky pattern-directed layer" },
    { judge: "Ties the pick to the conditional choosing among whole interchangeable algorithms (not optional embellishment or next-state selection)" },
    { nodrive: true, text: "Coach, don't drive (no edit / no test run)" },
  ],
  // Conditional Complexity (state-altering) -> Replace State-Altering Conditionals with State (Kerievsky)
  5: [
    { bestFit: "Replace State-Altering Conditionals with State", text: "Names Replace State-Altering Conditionals with State as the best-fit next refactoring" },
    {
      candidateSet: [
        "Replace Conditional Logic with Strategy", "Move Embellishment to Decorator",
        "Replace State-Altering Conditionals with State", "Introduce Null Object",
      ],
      text: "Names an in-set Conditional Complexity refactoring",
    },
    { layer: "Kerievsky", text: "Routes to the Kerievsky pattern-directed layer" },
    { judge: "Ties the pick to conditionals that both decide what may happen now AND choose which status comes next (state-altering), not whole-algorithm selection" },
    { nodrive: true, text: "Coach, don't drive (no edit / no test run)" },
  ],
  // Combinatorial Explosion -> Replace Implicit Language with Interpreter (Kerievsky)
  6: [
    { bestFit: "Replace Implicit Language with Interpreter", text: "Names Replace Implicit Language with Interpreter as the best-fit next refactoring" },
    { layer: "Kerievsky", text: "Routes to the Kerievsky pattern-directed layer" },
    { judge: "Frames the near-identical combination methods as an unnamed mini-language whose terms become composable objects, not plain incidental duplication" },
    { nodrive: true, text: "Coach, don't drive (no edit / no test run)" },
  ],
  // De-patterning: unwarranted Singleton -> Inline Singleton (Kerievsky-Away) OR Module Namespace (functional)
  7: [
    { candidateSet: ["Inline Singleton", "Module Namespace"], text: "Names an accepted de-patterning route: Inline Singleton or the Module Namespace functional dissolution" },
    { layer: ["Kerievsky-Away", "functional"], text: "Routes to the Kerievsky-Away or functional layer (either is accepted)" },
    { judge: "Frames the Singleton as unwarranted (nothing needs single-instance policy) and names the dissolution, rather than keeping or embellishing the pattern" },
    { nodrive: true, text: "Coach, don't drive (no edit / no test run)" },
  ],
  // Routing boundary: same type switch repeated across sites -> Replace Conditional with Polymorphism (FOWLER, not a pattern)
  8: [
    { bestFit: "Replace Conditional with Polymorphism", text: "Names Replace Conditional with Polymorphism as the best-fit next refactoring" },
    { layer: "Fowler", text: "Routes to the Fowler mechanical layer (NOT a Kerievsky pattern-directed refactoring)" },
    { judge: "Justifies the Fowler mechanical route over a pattern-directed one: it is the SAME type switch repeated across sites, not a single complex conditional wanting a design pattern" },
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

  if (check.bestFit) {
    const passed = N(check.bestFit).test(resp);

    return {
      text: check.text || `Names best-fit (${check.bestFit})`,
      passed,
      evidence: passed ? `named "${check.bestFit}"` : `did not name "${check.bestFit}"`,
    };
  }

  if (check.candidateSet) {
    const hits = check.candidateSet.filter((c) => N(c).test(resp));
    const passed = hits.length > 0;

    return {
      text: check.text || `Names an in-set refactoring`,
      passed,
      evidence: passed ? `named in-set: ${hits.join(", ")}` : `named none of the in-set candidates (${check.candidateSet.join(", ")})`,
    };
  }

  if (check.layer) {
    const accepted = Array.isArray(check.layer) ? check.layer : [check.layer];
    const present = layersInResponse(resp);
    const matched = present.filter((l) => accepted.includes(l));
    const passed = matched.length > 0;

    return {
      text: check.text || `Routes to the ${accepted.join(" or ")} layer`,
      passed,
      evidence: passed
        ? `named refactoring(s) resolve to accepted layer: ${matched.join(", ")}`
        : present.length
          ? `named refactoring(s) resolve to ${present.join(", ")}, not ${accepted.join("/")}`
          : "no known refactoring name found to resolve a layer",
    };
  }

  return { text: check.text || "(unknown)", passed: false, evidence: "unknown check kind" };
}

function grade(evalId, resp, metrics) {
  const rubric = RUBRICS[evalId];

  if (!rubric) {
    throw new Error(`no rubric for eval-id ${evalId} (have ${Object.keys(RUBRICS).join(", ")})`);
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

  // nameRe: whitespace-tolerant (incl. newlines) and WORD-BOUNDED (no sub-match).
  assert(N("Extract Function").test("do an Extract Function on the totals block"), "nameRe matches the exact phrase");
  assert(N("Extract Function").test("Extract  Function"), "nameRe tolerant of extra spaces");
  assert(N("Pull Up Method").test("apply Pull Up\n   Method to the parent"), "nameRe tolerant of newline/indent between words");
  assert(!N("Extract Function").test("this is just Extract Functionality"), "nameRe must NOT sub-match a longer word (Extract Functionality)");
  assert(!N("Move Function").test("call moveFunctions() here"), "nameRe must NOT match inside a run-together identifier");

  // bestFit: SCORED pass on presence, fail on absence.
  const g0 = grade(0, "the workhorse move for length is Extract Function on the validate/compute/format spans", zero);
  assert(g0.expectations[0].passed === true, "eval0 bestFit passes when Extract Function is named");
  assert(g0.expectations[1].passed === true, "eval0 candidateSet passes (Extract Function is in-set)");
  assert(g0.expectations[2].passed === true, "eval0 layer resolves Extract Function -> Fowler");
  assert(g0.expectations[3].passed === null, "eval0 rationale tie is judge-only (passed:null)");
  assert(g0.expectations[4].passed === true, "eval0 nodrive passes with zero tool calls");
  assert(g0.summary.total === 4, "eval0 summary counts the 4 SCORED checks (bestFit+candidateSet+layer+nodrive)");
  assert(g0.judge_required.length === 1, "eval0 reports 1 judge_required item");
  const g0miss = grade(0, "just shorten it somehow", zero);
  assert(g0miss.expectations[0].passed === false, "eval0 bestFit FAILS when Extract Function is absent");
  assert(g0miss.expectations[1].passed === false, "eval0 candidateSet FAILS when no in-set name is present");
  assert(g0miss.expectations[2].passed === false, "eval0 layer FAILS when no known refactoring name resolves");

  // candidateSet: any in-set alternative pick still passes (one-to-many tolerance).
  const g3alt = grade(3, "you could start with Extract Function to isolate the envied computation", zero);
  assert(g3alt.expectations[1].passed === true, "eval3 candidateSet passes on the alternative in-set pick (Extract Function)");
  assert(g3alt.expectations[0].passed === false, "eval3 bestFit still FAILS when only the alternative (not Move Function) is named");

  // layer: resolve-via-lookup across all four layers.
  const gK = grade(4, "reach for Replace Conditional Logic with Strategy here", zero);
  assert(gK.expectations[2].passed === true, "eval4 layer resolves a Kerievsky name -> Kerievsky");
  const gKwrong = grade(4, "just do an Extract Function", zero);
  assert(gKwrong.expectations[2].passed === false, "eval4 layer FAILS when the named refactoring resolves to Fowler, not Kerievsky");
  const g7away = grade(7, "refactor away via Inline Singleton", zero);
  assert(g7away.expectations[0].passed === true, "eval7 candidateSet passes on Inline Singleton");
  assert(g7away.expectations[1].passed === true, "eval7 layer accepts Kerievsky-Away (Inline Singleton is a Direction=Away row)");
  const g7fn = grade(7, "dissolve it into a Module Namespace of plain functions", zero);
  assert(g7fn.expectations[0].passed === true, "eval7 candidateSet passes on Module Namespace");
  assert(g7fn.expectations[1].passed === true, "eval7 layer accepts the functional dissolution (Module Namespace -> functional)");
  const g8 = grade(8, "this is Replace Conditional with Polymorphism, a Fowler mechanical move", zero);
  assert(g8.expectations[0].passed === true, "eval8 bestFit passes on Replace Conditional with Polymorphism");
  assert(g8.expectations[1].passed === true, "eval8 layer resolves Replace Conditional with Polymorphism -> Fowler (not a Kerievsky pattern)");

  // nodrive: nested (canonical) shape DETECTED as drove; flat shape works; unrecognized fails loud; missing fails safe.
  const droveNested = grade(2, "apply Pull Up Method", { tool_calls: { Edit: 3, Write: 2, Bash: 1 } });
  assert(droveNested.expectations[4].passed === false, "nested tool_calls with edits>0 must FAIL nodrive");
  const droveFlat = grade(2, "apply Pull Up Method", { edits: 1 });
  assert(droveFlat.expectations[4].passed === false, "flat edits>0 must FAIL nodrive");
  const miskeyed = grade(2, "apply Pull Up Method", { foo: 1, bar: 2 });
  assert(miskeyed.expectations[4].passed === false, "unrecognized metrics shape must FAIL nodrive (no silent pass)");
  assert(/unrecognized|no recognized/i.test(miskeyed.expectations[4].evidence), "miskeyed metrics evidence names the shape problem");
  const noMetrics = grade(2, "apply Pull Up Method", null);
  assert(noMetrics.expectations[4].passed === false, "nodrive without metrics reports false (fail-safe)");

  // judge checks never autonomously pass/fail.
  const g6 = grade(6, "name it Replace Implicit Language with Interpreter", zero);
  assert(g6.expectations[2].passed === null, "eval6 rationale/framing check is judge-only");
  assert(g6.summary.total === 3, "eval6 has 3 scored checks (bestFit+layer+nodrive)");

  // fail-closed output path: judge items remain -> grading.preliminary.json, NOT grading.json.
  assert(finalOutPath("x/grading.json", 1).endsWith("grading.preliminary.json"), "judge items remaining -> preliminary path");
  assert(finalOutPath("x/grading.json", 0) === "x/grading.json", "no judge items -> honor --out path");

  // every candidateSet/bestFit name in RUBRICS resolves in the name->layer lookup (name-resolve gate).
  for (const [id, checks] of Object.entries(RUBRICS)) {
    for (const c of checks) {
      const names = c.bestFit ? [c.bestFit] : c.candidateSet || [];

      for (const nm of names) {
        assert(NAME_LAYERS.has(nm), `RUBRICS[${id}] name "${nm}" does not resolve in the name->layer lookup`);
      }
    }
  }

  // resolve-identity gate (CR-01): every catalog name must resolve to EXACTLY its own layer set,
  // so a shorter canonical name can never sub-phrase-match inside a longer one (e.g. the functional
  // "Factory Function" leaking into the Fowler "Replace Constructor with Factory Function"). This
  // regression was invisible to the name-resolve gate above, which only checks a name EXISTS.
  for (const [name, own] of NAME_LAYERS) {
    assert(
      JSON.stringify(layersInResponse(name).sort()) === JSON.stringify([...own].sort()),
      `name "${name}" resolves to [${layersInResponse(name)}] but declares [${own}]`,
    );
  }

  // RUBRICS <-> evals.json alignment (Pitfall-6: fails loudly on count drift).
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
    console.error("usage: node grade-run.mjs --eval-id <0-8> --output <file> [--metrics <file>] --out <grading.json>");
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

  // fail-closed (IN-02): when judge items remain we emit grading.preliminary.json instead of the
  // requested final path. Remove any stale FINAL grading.json left in that dir from a prior grading
  // of the same run, so aggregate_benchmark.py cannot count it as a completed scored-only summary.
  if (result.judge_required.length > 0) {
    const stale = args.out;

    if (fs.existsSync(stale)) {
      fs.rmSync(stale);
    }
  }

  try {
    fs.writeFileSync(outPath, JSON.stringify(result, null, 2) + "\n");
  } catch (e) {
    console.error(`cannot write ${outPath}: ${e.message}`);
    process.exit(2);
  }

  const note = result.judge_required.length > 0 ? " [PRELIMINARY -- run the LLM-judge merge to produce grading.json]" : "";
  console.log(`graded eval-${evalId}: ${result.summary.passed}/${result.summary.total} scored, ${result.judge_required.length} need LLM-judge -> ${outPath}${note}`);
}

// Run main() only as a script; guarded so this module can be imported (by the tabulators) to
// reuse the canonical name lists + matcher without executing the grader (mirrors run-e2e.mjs).
const isMainModule = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMainModule) {
  main();
}

export { nameRe, FOWLER, KERIEVSKY, KERIEVSKY_AWAY, FUNCTIONAL };
