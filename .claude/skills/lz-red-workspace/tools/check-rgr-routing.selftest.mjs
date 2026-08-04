#!/usr/bin/env node
// Self-test for lib/routing-parse.mjs, the parser behind check-rgr-routing.mjs (Phase 22, CLS-01 and
// CLS-04). Plain node:assert, matching this workspace's existing style -- row-guards.selftest.mjs and
// provenance-honesty.selftest.mjs are assert-based scripts, not a vitest suite, so no test framework
// is introduced. IN-MEMORY FIXTURES ONLY; this file reads no document from disk at all, which is why
// it stays GREEN while the real gate is deliberately RED against today's tree.
//   node .claude/skills/lz-red-workspace/tools/check-rgr-routing.selftest.mjs
//
// CONTRACT. Four categories carried over from row-guards.selftest.mjs, plus a fifth this guard needs:
//   1. PRISTINE   -> PASS. The parser accepts content in the target shape.
//   2. EVASION    -> FAIL. The parser rejects each specific defect the gate exists to catch: a
//                   re-introduced bare catch-all terminal, a deleted positive branch, a test-state
//                   clause smuggled back into a routing condition, a RENAMED heading, and a vanished
//                   file (surrogate: the empty string, which is what the fail-closed read yields).
//   3. OLD NEEDLE -> PASSES the same evasion fixtures. A bare word-boundary skill-name presence test
//                   goes GREEN on both the re-introduced catch-all AND the renamed heading. That is
//                   the measured F-1 ceiling, and the evidence is COMMITTED here rather than thrown
//                   away in a scratchpad.
//   4. EMPTY / VACUOUS -> FAIL. An emptied corpus and an emptied surface list must both FAIL. A guard
//                   that reports PASS with nothing to check cannot fail, and a guard that cannot fail
//                   is worse than no guard.
//   5. REWORDED-BUT-CORRECT -> PASS, and INCIDENTAL MENTION -> PASS. The two should-STAY-GREEN legs.
//                   They are what separate this guard from a vocabulary proxy: rewording a correct
//                   branch in different words while keeping the same ask-words must not break it, and
//                   naming a sibling skill outside any branch must not satisfy it. This is the D-12
//                   grader-trap lesson applied to the CHECKER itself.
//   6. INTRO PROSE -> mutation 9, added in a gap-closure follow-up after 22-08. Covers the blind spot
//                   ABOVE the first `## ` heading (introBody), which is where the phase's own BLOCKER
//                   and a banned description phrase both lived, invisible to categories 1-5. Same
//                   should-fail / should-stay-green shape: a missing or reordered hop must FAIL, a
//                   reworded-but-correct hop must STAY GREEN, and a test-state phrase wrapped across a
//                   source line is proven caught only AFTER flattening (the Pitfall-2 wrap-tolerance
//                   class this repo has recorded elsewhere).
//
// SCOPE, stated plainly. The exports under test are the PARSER's. The gate itself is a top-level
// script by house convention -- it resolves paths, reports, and exits -- so it cannot be imported
// without running it.
//
// `covers` / `owns` / `isDeclaredResidual` / `routesCase` are now IMPORTED from the parser, not
// restated. An earlier version of this note called them "a deliberate minimal restatement kept
// identical in shape", and that was the defect: the restatement DRIFTED, with this file's `coveredBy`
// quantifying over one surface while the gate pooled three, so this selftest proved a discrimination
// the gate did not have -- and the gate was duly evaded by deleting one surface's branch. One
// definition, two callers, is the fix.
//
// WHAT THIS FILE STILL DOES NOT EVIDENCE: the gate's own wiring. An earlier note claimed that was
// covered "by its asserted-RED baseline against the tracked tree" -- but that baseline is CLOSED and
// the gate now exits 0, so that evidence no longer exists. `corpusFloorOk`, `scanFloorOk`,
// `hopsOrderedOk` and `flatten` remain hand-restated here, and `corpusFloorOk` does NOT model the
// gate's own `STEP1_SURFACES.length !== 3` clause, which is therefore unguarded. Treat a GREEN result
// here as evidence about the PARSER, never as evidence that the gate is wired correctly.
//
// No fixture, comment or label in this file contains any email-shaped token other than the project's
// approved public contact -- and no forbidden value is written even as a search needle, because the
// needle IS the leak. ASCII only.
import assert from "node:assert/strict";
import * as parser from "./lib/routing-parse.mjs";
import {
  RESIDUAL_MARKER_RE,
  destinationsIn,
  introBody,
  keysOnTestState,
  parseRoutingBranches,
} from "./lib/routing-parse.mjs";

// Restated identically to check-rgr-routing.mjs's own local helper (see SCOPE in the header): the
// gate flattens intro text before calling keysOnTestState on it, so this file drives that same
// flatten-then-check shape rather than the raw multi-line text.
const flatten = (s) => String(s == null ? "" : s).replace(/\s+/g, " ").trim();

// ---------------------------------------------------------------------------------------------
// Fixture builders. Lines are assembled from an ARRAY of double-quoted strings rather than a template
// literal, so a fixture cannot be silently corrupted by a missed backslash and every line is
// individually addressable by the mutation helpers below.
// ---------------------------------------------------------------------------------------------

// One synthetic coach document in the TARGET shape: positive disjoint lettered branches, one named
// owner each, an ordered two-hop branch, and a terminal that claims NOTHING and says so. The mode
// gate below it keys on the ask only. Both sections live in one document so the fixture also
// exercises the stop-at-the-next-level-2-heading boundary.
const PRISTINE_LINES = [
  "# Fixture coach",
  "",
  "## Coach decision procedure",
  "",
  "1. Classify the request by what the developer is asking for. Take the first branch that matches:",
  "   a. Asking what test to write next, how to shape or name a test, or whether a test is a good",
  "      test -> the red step. That is lz-red.",
  "   b. Asking to make a failing test pass, or to add a new behavior -> the red step FIRST, so that",
  "      is lz-red, and once a red test is in play the green step is lz-tpp.",
  "   c. Just finished making a test pass and asking what now, or asking to clean up or tidy code",
  "      including a test file without changing what it does -> the refactor step. That is",
  "      lz-refactor.",
  "   d. None of the above: this is not a red-green-refactor-loop request. Say so and answer it",
  "      directly; no skill in this loop owns it.",
  "2. Recognize the smell. Read the fixture leaf; do not restate its content here.",
  "",
  "## Two modes",
  "",
  "- Coach mode: the request names code and asks which refactoring to apply. Present it via the",
  "  coach decision procedure above.",
  "- Reference mode: the request asks to explain a refactoring, a smell, or a principle. Answer from",
  "  the fixture reference leaf; do not restate its content here.",
  "",
  "## Sources",
  "",
  "- Fixture source row, present so the section split has a level-2 heading to stop at.",
];

const PRISTINE = PRISTINE_LINES.join("\n");

// Synthetic surface descriptors. Same seven fields as a real ROUTING_SURFACES entry, so the parser is
// driven exactly as the gate drives it, but pointing at fixture text rather than a tracked file.
const ROUTER = Object.freeze({
  id: "fixture-router",
  file: "fixture/coach.md",
  heading: "Coach decision procedure",
  kind: "router",
  owner: "lz-refactor",
  parseMode: "lettered",
  variantScope: "all",
});

const MODE_GATE = Object.freeze({
  id: "fixture-modes",
  file: "fixture/coach.md",
  heading: "Two modes",
  kind: "mode-gate",
  owner: "lz-refactor",
  parseMode: "sentences",
  variantScope: "all",
});

// Three synthetic corpus cases: one plain owner, one ORDERED two-hop, one declared residual.
const FIXTURE_CASES = Object.freeze([
  Object.freeze({
    id: "f1",
    expectedOwner: "lz-refactor",
    expectedSecondHop: null,
    matchTokens: Object.freeze(["finished", "test pass", "what now"]),
  }),
  Object.freeze({
    id: "f2",
    expectedOwner: "lz-red",
    expectedSecondHop: "lz-tpp",
    matchTokens: Object.freeze(["add a new behavior"]),
  }),
  Object.freeze({
    id: "f3",
    expectedOwner: "NONE",
    expectedSecondHop: null,
    matchTokens: Object.freeze(["argument parsing"]),
  }),
]);

// ---------------------------------------------------------------------------------------------
// Mutation helpers. A mutation that silently no-ops MUST throw rather than leave PRISTINE text under
// a check that expects a FAIL -- while that still fails loudly, it does so by accident rather than by
// design, and the accident is invisible in the report.
// ---------------------------------------------------------------------------------------------

const mutate = (text, from, to) => {
  const next = text.replace(from, to);

  assert.notEqual(next, text, `fixture mutation did not apply: ${from}`);

  return next;
};

// Drop the whole line containing `marker` -- the branch-deletion evasion.
const dropLine = (text, marker) => {
  const lines = text.split("\n");
  const kept = lines.filter((line) => !line.includes(marker));

  assert.notEqual(kept.length, lines.length, `fixture line drop did not apply: ${marker}`);

  return kept.join("\n");
};

// ---------------------------------------------------------------------------------------------
// Assertion harness.
// ---------------------------------------------------------------------------------------------

let failures = 0;

const check = (label, actual, expected) => {
  try {
    assert.deepEqual(actual, expected);
    console.log(`  [PASS] ${label}`);
  } catch (err) {
    failures++;
    console.log(
      `  [FAIL] ${label} -- expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}: ${err.message}`
    );
  }
};

// ---------------------------------------------------------------------------------------------
// The gate's coverage predicates -- IMPORTED, no longer restated.
//
// These used to be hand-copied here, and the copy DRIFTED in the one way that mattered: `coveredBy`
// quantified over a single surface's branches while the gate pooled all three. So this selftest was
// proving a discrimination the gate did not have, and an unprimed review duly evaded the gate by
// deleting one surface's branch. The leaf predicates had NOT drifted -- they were byte-identical --
// which is exactly why sharing only the leaves would have missed the defect: the drift was in the
// QUANTIFICATION. `routesCase` is now the single definition of the per-pair decision, so `coveredBy`
// below is a thin alias over it rather than a parallel implementation.
// ---------------------------------------------------------------------------------------------

const { covers, owns, isDeclaredResidual, routesCase } = parser;

const coveredBy = (branches, kase) => routesCase(branches, kase).ok;

// The two anti-vacuity floors the gate carries, restated the same way.
const corpusFloorOk = (cases) =>
  cases.length > 0 &&
  cases.every(
    (c) =>
      Array.isArray(c.matchTokens) &&
      c.matchTokens.filter((t) => typeof t === "string" && t.trim() !== "").length > 0
  );

const scanFloorOk = (surfaces, text) =>
  surfaces.length > 0 && surfaces.every((s) => parseRoutingBranches(text, s).ok);

// The OLD NEEDLE: the bare word-boundary skill-name presence test the shipped TD-02 guard uses. Kept
// here as the committed measurement of what it cannot see.
const oldNeedle = (text) => /\blz-red\b/.test(text);

// ---------------------------------------------------------------------------------------------
// Mutation 0 -- PRISTINE.
// ---------------------------------------------------------------------------------------------
console.log("mutation 0 -- PRISTINE target shape parses and satisfies every predicate");

const pristineRouter = parseRoutingBranches(PRISTINE, ROUTER);
const pristineModes = parseRoutingBranches(PRISTINE, MODE_GATE);

check("PRISTINE router parses ok", pristineRouter.ok, true);
check("PRISTINE router yields the four lettered branches", pristineRouter.branches.map((b) => b.branchId), ["1a", "1b", "1c", "1d"]);
check(
  "PRISTINE every branch either names a destination or IS the declared residual",
  pristineRouter.branches.every((b) => b.destinations.length > 0 || isDeclaredResidual(b)),
  true
);
check(
  "PRISTINE no branch is a bare catch-all",
  pristineRouter.branches.filter((b) => b.isBareCatchAll).map((b) => b.branchId),
  []
);
check(
  "PRISTINE no branch keys on test state",
  pristineRouter.branches.filter((b) => b.keysOnTestState.length > 0).map((b) => b.branchId),
  []
);
check("PRISTINE the two-hop branch destinations are the ORDERED pair", pristineRouter.branches[1].destinations, ["lz-red", "lz-tpp"]);
check("PRISTINE the residual terminal claims nothing", pristineRouter.branches[3].destinations, []);
check("PRISTINE the residual terminal carries the explicit no-owner marker", pristineRouter.branches[3].isResidual, true);
check("PRISTINE mode gate parses ok", pristineModes.ok, true);
check(
  "PRISTINE mode gate keys on the ask only",
  pristineModes.branches.filter((b) => b.keysOnTestState.length > 0).map((b) => b.branchId),
  []
);
check(
  "PRISTINE every corpus case is covered",
  FIXTURE_CASES.filter((c) => !coveredBy(pristineRouter.branches, c)).map((c) => c.id),
  []
);

console.log("");

// ---------------------------------------------------------------------------------------------
// Mutation 1 -- re-introduce a bare terminal (should FAIL).
// ---------------------------------------------------------------------------------------------
console.log("mutation 1 -- a re-introduced bare otherwise-is-this-skill terminal is caught");

let m1 = mutate(
  PRISTINE,
  "   d. None of the above: this is not a red-green-refactor-loop request. Say so and answer it",
  "   d. Otherwise the request stays here, and that is lz-refactor."
);
m1 = dropLine(m1, "no skill in this loop owns it");

const m1Router = parseRoutingBranches(m1, ROUTER);

check("mutation 1 still parses (the defect is in the branch, not the structure)", m1Router.ok, true);
check(
  "mutation 1 the terminal is flagged as a bare catch-all",
  m1Router.branches.filter((b) => b.isBareCatchAll).map((b) => b.branchId),
  ["1d"]
);
check("mutation 1 the terminal is NOT the declared residual", m1Router.branches[3].isResidual, false);
check("mutation 1 the terminal names the surface's own owner", m1Router.branches[3].destinations, ["lz-refactor"]);

console.log("");

// ---------------------------------------------------------------------------------------------
// Mutation 2 -- delete the positive post-green branch (should FAIL).
// ---------------------------------------------------------------------------------------------
console.log("mutation 2 -- deleting the positive post-green branch loses its corpus case");

// All THREE of the branch's lines go, not just the one carrying the letter. Dropping the letter line
// alone would orphan the continuation lines onto the PREVIOUS branch, which then inherits a third
// destination and breaks the two-hop case -- a fixture artifact that would read as a guard defect.
let m2 = dropLine(PRISTINE, "c. Just finished making a test pass");
m2 = dropLine(m2, "including a test file without changing what it does");
m2 = dropLine(m2, "      lz-refactor.");

const m2Router = parseRoutingBranches(m2, ROUTER);

check("mutation 2 still parses", m2Router.ok, true);
check("mutation 2 the post-green case is no longer covered", coveredBy(m2Router.branches, FIXTURE_CASES[0]), false);
check("mutation 2 the OTHER cases are untouched", [coveredBy(m2Router.branches, FIXTURE_CASES[1]), coveredBy(m2Router.branches, FIXTURE_CASES[2])], [true, true]);

console.log("");

// ---------------------------------------------------------------------------------------------
// Mutation 3 -- a test-state clause smuggled back into a routing condition (should FAIL), with the
// paired NEGATIVE control so the token set is proven in BOTH directions.
// ---------------------------------------------------------------------------------------------
console.log("mutation 3 -- a test-state clause in a routing condition is caught (both directions)");

const m3 = mutate(
  PRISTINE,
  "   c. Just finished making a test pass and asking what now,",
  "   c. The tests are green and you just finished making a test pass and asking what now,"
);
const m3Router = parseRoutingBranches(m3, ROUTER);
const m3Offenders = m3Router.branches.filter((b) => b.keysOnTestState.length > 0);

check("mutation 3 exactly the mutated branch keys on test state", m3Offenders.map((b) => b.branchId), ["1c"]);
check("mutation 3 the matched token is NAMED so the report can attribute it", m3Offenders[0].keysOnTestState, ["tests are green"]);

// POSITIVE control on the token set itself, using the live-shaped mode-gate phrasing D-03 names.
check(
  "test-state POSITIVE control -- a live-shaped tests-are-green mode gate matches",
  keysOnTestState("Coach mode: the tests are green and the code has a smell, and the question is which refactoring to apply."),
  ["tests are green", "has a smell"]
);
// NEGATIVE control: an ask-only condition must return nothing. Without this the token set could be
// emptied, case-folded wrong, or wired to the wrong field and still look healthy.
check(
  "test-state NEGATIVE control -- an ask-only condition matches nothing",
  keysOnTestState(pristineRouter.branches[0].conditionText),
  []
);
check(
  "test-state NEGATIVE control -- an emptied token list claims nothing",
  keysOnTestState("the tests are green and the code has a smell", []),
  []
);
check(
  "test-state NEGATIVE control -- a blank token is dropped, not treated as a universal match",
  keysOnTestState("an ask-only condition", ["", "   "]),
  []
);

console.log("");

// ---------------------------------------------------------------------------------------------
// Mutation 4 -- rename the parsed heading (should FAIL). The structural closure of F-1.
// ---------------------------------------------------------------------------------------------
console.log("mutation 4 -- a RENAMED heading fails closed (the F-1 closure)");

const m4 = mutate(PRISTINE, "## Coach decision procedure", "## Coach routing procedure");
const m4Router = parseRoutingBranches(m4, ROUTER);

check("mutation 4 the parse reports NOT ok", m4Router.ok, false);
check("mutation 4 zero branches survive", m4Router.branches, []);
check("mutation 4 the reason names the absent heading", /heading absent/.test(m4Router.why), true);

console.log("");

// ---------------------------------------------------------------------------------------------
// Mutation 5 -- the vanished file (should FAIL). The empty string is the surrogate, because the
// gate's fail-closed read yields exactly that on a read failure.
// ---------------------------------------------------------------------------------------------
console.log("mutation 5 -- a vanished surface file fails closed with one attributable reason");

const m5Router = parseRoutingBranches("", ROUTER);

check("mutation 5 the parse reports NOT ok", m5Router.ok, false);
check("mutation 5 zero branches survive", m5Router.branches, []);
check("mutation 5 the reason is attributable, not blank", m5Router.why.length > 0, true);
check("mutation 5 the reason distinguishes an empty surface from a renamed heading", /empty/.test(m5Router.why), true);
check("mutation 5 a null-ish surface text is handled the same way, never thrown on", parseRoutingBranches(null, ROUTER).ok, false);

console.log("");

// ---------------------------------------------------------------------------------------------
// Mutation 6 -- an INCIDENTAL sibling mention outside any branch (should STAY GREEN).
// ---------------------------------------------------------------------------------------------
console.log("mutation 6 -- an incidental sibling mention outside any branch changes nothing");

const m6 = mutate(
  PRISTINE,
  "- Fixture source row, present so the section split has a level-2 heading to stop at.",
  "- Fixture source row; see also lz-tpp for the green step and lz-red for the red step."
);
const m6Router = parseRoutingBranches(m6, ROUTER);

check("mutation 6 the branch set is byte-identical to PRISTINE", m6Router.branches, pristineRouter.branches);
check(
  "mutation 6 every corpus case is still covered",
  FIXTURE_CASES.filter((c) => !coveredBy(m6Router.branches, c)).map((c) => c.id),
  []
);
check(
  "mutation 6 no bare catch-all appears",
  m6Router.branches.filter((b) => b.isBareCatchAll).map((b) => b.branchId),
  []
);

console.log("");

// ---------------------------------------------------------------------------------------------
// Mutation 7 -- REWORDED but correct, same ask-words (should STAY GREEN). The D-12 vocabulary-proxy
// lesson applied to the checker itself.
// ---------------------------------------------------------------------------------------------
console.log("mutation 7 -- a reworded-but-correct branch keeps its case and its owner");

const m7 = mutate(
  PRISTINE,
  "   c. Just finished making a test pass and asking what now, or asking to clean up or tidy code",
  "   c. You have just finished making a test pass and are asking what now, or you want code tidied,"
);
const m7Router = parseRoutingBranches(m7, ROUTER);

check("mutation 7 the wording really did change", m7Router.branches[2].conditionText === pristineRouter.branches[2].conditionText, false);
check("mutation 7 the post-green case is still covered", coveredBy(m7Router.branches, FIXTURE_CASES[0]), true);
check("mutation 7 the owner is unchanged", m7Router.branches[2].destinations, ["lz-refactor"]);
check(
  "mutation 7 no branch became a bare catch-all or a test-state key",
  [
    m7Router.branches.some((b) => b.isBareCatchAll),
    m7Router.branches.some((b) => b.keysOnTestState.length > 0),
  ],
  [false, false]
);

console.log("");

// ---------------------------------------------------------------------------------------------
// Mutation 8 -- ANTI-VACUITY. An emptied corpus and an emptied surface list must both FAIL.
// ---------------------------------------------------------------------------------------------
console.log("mutation 8 -- anti-vacuity: an emptied corpus and an emptied surface list both FAIL");

check("mutation 8 the corpus floor holds on the fixture corpus", corpusFloorOk(FIXTURE_CASES), true);
check("mutation 8 an EMPTIED corpus fails the corpus floor", corpusFloorOk([]), false);
check(
  "mutation 8 a case with no usable matchTokens fails the corpus floor",
  corpusFloorOk([{ id: "fx", expectedOwner: "lz-red", expectedSecondHop: null, matchTokens: ["  "] }]),
  false
);
check("mutation 8 the scan floor holds on the fixture surfaces", scanFloorOk([ROUTER, MODE_GATE], PRISTINE), true);
check("mutation 8 an EMPTIED surface list fails the scan floor", scanFloorOk([], PRISTINE), false);
check("mutation 8 a surface whose text vanished fails the scan floor", scanFloorOk([ROUTER], ""), false);

console.log("");

// ---------------------------------------------------------------------------------------------
// Mutation 9 -- intro prose: the blind spot ABOVE the first `## ` heading. Added in the gap-closure
// follow-up after 22-08, whose own SUMMARY recorded "the gate is structurally blind" to exactly this
// region -- lz-refactor's two-hop BLOCKER and a folded-description test-state phrase both lived here,
// invisible to every mutation above. Same five-category shape as the rest of this file: PRISTINE,
// EVASION (should-fail), REWORDED-BUT-CORRECT (should-STAY-GREEN), and a wrap-tolerance control.
// ---------------------------------------------------------------------------------------------
console.log("mutation 9 -- intro prose: the blind spot above the first heading");

// The gate's two-hop-order predicate, restated identically (see SCOPE in the header).
const hopsOrderedOk = (hops) =>
  hops.includes("lz-red") && hops.includes("lz-tpp") && hops.indexOf("lz-red") < hops.indexOf("lz-tpp");

const INTRO_LINES = [
  "# lz-fixture: Fixture coach",
  "",
  "This skill drives the fixture step. An ask to add a new behavior opens the red step first in",
  "lz-red, because Law 1 gates production code behind a failing test, and reaches lz-tpp once that",
  "test is red.",
  "",
  "## Two modes",
  "",
  "- Coach mode: the fixture request is handled here.",
].join("\n");

const INTRO_HOP_SPAN =
  "opens the red step first in\nlz-red, because Law 1 gates production code behind a failing test, and reaches lz-tpp once that\ntest is red.";

check("introBody returns null when no H1 line exists", introBody("## Two modes\n\nsome body\n"), null);
check("introBody returns null on empty or null text", [introBody(""), introBody(null)], [null, null]);

const introPristine = introBody(INTRO_LINES);

check("introBody finds the H1 and stops before the first ## heading", introPristine.includes("## Two modes"), false);

const introHops = destinationsIn(flatten(introPristine));

check("PRISTINE intro affirms lz-red before lz-tpp (the two-hop order)", introHops, ["lz-red", "lz-tpp"]);
check("PRISTINE intro hop-order predicate passes", hopsOrderedOk(introHops), true);
check("PRISTINE intro keys on the ask only", keysOnTestState(flatten(introPristine)), []);

// Mutation 9a -- the historical BLOCKER: the intro states only the second hop (should FAIL).
const introMissingFirstHop = destinationsIn(
  flatten(introBody(mutate(INTRO_LINES, INTRO_HOP_SPAN, "reaches lz-tpp once that test is red.")))
);

check("mutation 9a the first hop is gone from the extracted hops", introMissingFirstHop, ["lz-tpp"]);
check("mutation 9a the hop-order predicate FAILS -- this is the phase's own BLOCKER shape", hopsOrderedOk(introMissingFirstHop), false);

// Mutation 9b -- the hops appear in the WRONG order (should FAIL).
const introReordered = destinationsIn(
  flatten(
    introBody(
      mutate(
        INTRO_LINES,
        INTRO_HOP_SPAN,
        "reaches lz-tpp once a test is red, tracing back to\nlz-red, because Law 1 gates production code behind a failing test."
      )
    )
  )
);

check("mutation 9b both hops are still present", [introReordered.includes("lz-red"), introReordered.includes("lz-tpp")], [true, true]);
check("mutation 9b the hop-order predicate FAILS -- lz-tpp now precedes lz-red", hopsOrderedOk(introReordered), false);

// Mutation 9c -- REWORDED but correct, same order (should STAY GREEN). The D-12 vocabulary-proxy
// lesson applied to the intro-prose check specifically.
const introReworded = destinationsIn(
  flatten(
    introBody(
      mutate(
        INTRO_LINES,
        INTRO_HOP_SPAN,
        "starts in lz-red first -- Law 1 forbids production code before a failing test -- and moves on to\nlz-tpp once that test is red."
      )
    )
  )
);

check("mutation 9c reworded-but-correct still affirms the ordered pair", introReworded, ["lz-red", "lz-tpp"]);
check("mutation 9c the hop-order predicate still PASSES", hopsOrderedOk(introReworded), true);

// Mutation 9d -- a test-state clause smuggled into the intro (should FAIL).
const introTestState = keysOnTestState(
  flatten(
    introBody(
      mutate(
        INTRO_LINES,
        "This skill drives the fixture step.",
        "This skill drives the fixture step, and only once the tests are green does it reconsider scope."
      )
    )
  )
);

check("mutation 9d the smuggled test-state clause is caught", introTestState, ["tests are green"]);

// Mutation 9e -- wrap-tolerance control. A test-state phrase wrapped across a source line break is
// MISSED by keysOnTestState on the RAW (non-flattened) intro text, and CAUGHT once flattened -- the
// same Pitfall-2 class this repo has recorded three times elsewhere, now proven for the intro check.
const INTRO_WRAPPED_TEST_STATE = [
  "# lz-fixture: Fixture coach",
  "",
  "This skill drives the fixture step, and the tests are",
  "green before it reconsiders scope. An ask to add a new behavior opens the red step first in",
  "lz-red, because Law 1 gates production code behind a failing test, and reaches lz-tpp once that",
  "test is red.",
  "",
  "## Two modes",
  "",
  "- Coach mode: the fixture request is handled here.",
].join("\n");

const wrappedIntro = introBody(INTRO_WRAPPED_TEST_STATE);

check("mutation 9e wrap-tolerance -- RAW (non-flattened) text MISSES the wrapped phrase", keysOnTestState(wrappedIntro), []);
check("mutation 9e wrap-tolerance -- the SAME phrase is CAUGHT once flattened (the check's actual behavior)", keysOnTestState(flatten(wrappedIntro)), ["tests are green"]);

console.log("");

// ---------------------------------------------------------------------------------------------
// OLD NEEDLE -- the committed measurement of the ceiling this guard closes.
// ---------------------------------------------------------------------------------------------
console.log("OLD NEEDLE -- a bare skill-name presence test PASSES fixtures the new predicates FAIL");

check("OLD NEEDLE goes GREEN on the re-introduced bare catch-all", oldNeedle(m1), true);
check("NEW predicate goes RED on the same fixture", m1Router.branches.some((b) => b.isBareCatchAll), true);
check("OLD NEEDLE goes GREEN on the RENAMED heading", oldNeedle(m4), true);
check("NEW predicate goes RED on the same fixture", m4Router.ok, false);
check("OLD NEEDLE cannot even see the deleted positive branch", oldNeedle(m2), true);
check("NEW predicate loses that case", coveredBy(m2Router.branches, FIXTURE_CASES[0]), false);

console.log("");

// ---------------------------------------------------------------------------------------------
// Boundary and affirmation legs on the destination extractor.
// ---------------------------------------------------------------------------------------------
console.log("destinationsIn -- boundaries, exclusion clauses, and the deliberate self-reference gap");

check("a word-bounded slug is affirmed", destinationsIn("that is lz-refactor"), ["lz-refactor"]);
check("a longer word is NOT a slug match", destinationsIn("that is lz-redux, not a skill"), []);
check("an exclusion clause is not a destination", destinationsIn("Do NOT use lz-tpp for this."), []);
check("order is first-affirmed-occurrence order", destinationsIn("hand to lz-red first, then lz-tpp"), ["lz-red", "lz-tpp"]);
check(
  "SELF-REFERENCE is deliberately NOT resolved (house form parses to zero destinations)",
  [destinationsIn("continue here (the refactor step)"), destinationsIn("that is this skill's work")],
  [[], []]
);
check(
  "the residual marker requires BOTH halves, so a forgotten owner is not the residual",
  [
    RESIDUAL_MARKER_RE.test("this is not a red-green-refactor-loop request; no skill in this loop owns it"),
    RESIDUAL_MARKER_RE.test("this is not a red-green-refactor-loop request"),
    RESIDUAL_MARKER_RE.test("no skill in this loop owns it"),
  ],
  [true, false, false]
);

console.log("");

// ---------------------------------------------------------------------------------------------
// Export roster -- a COUNT alone cannot see a renamed or swapped export.
// ---------------------------------------------------------------------------------------------
console.log("lib/routing-parse.mjs -- export roster");

check("routing-parse.mjs exports exactly the fifteen named helpers", Object.keys(parser).sort(), [
  "CATCHALL_CONDITION_RE",
  "RESIDUAL_MARKER_RE",
  "ROUTING_SURFACES",
  "TEST_STATE_TOKENS",
  "covers",
  "destinationsIn",
  "foldedDescription",
  "introBody",
  "isDeclaredResidual",
  "keysOnTestState",
  "matchesSkillName",
  "owns",
  "parseRoutingBranches",
  "routesCase",
  "step1LeadIn",
]);
check("ROUTING_SURFACES declares the eleven classifier surfaces", parser.ROUTING_SURFACES.length, 11);
check(
  "TEST_STATE_TOKENS carries no empty or whitespace-only entry",
  parser.TEST_STATE_TOKENS.filter((t) => typeof t !== "string" || t.trim() === ""),
  []
);
check(
  "foldedDescription returns null rather than throwing when the key is absent",
  parser.foldedDescription("---\nname: fixture\n---\n"),
  null
);

// foldedDescription MUST consume the whole block scalar. It used to stop at the first line failing
// /^\s+\S/ -- i.e. at the first BLANK line -- but a blank line inside a YAML folded scalar is VALID
// and part of the value. An unprimed review turned that into a vacuous pass twice: a blank line right
// after `description: >-` made the fold return "" and the gate reported "0 chars, 1536 of headroom"
// and "banned=[]" for an intact description carrying a banned token; a blank line mid-block made it
// return a PREFIX and report headroom for a value 334 chars OVER the cap. These legs pin both shapes.
const FOLD_SIMPLE = "---\nname: f\ndescription: >-\n  alpha beta\n  gamma\n---\n";
const FOLD_LEADING_BLANK = "---\nname: f\ndescription: >-\n\n  alpha beta\n  gamma\n---\n";
const FOLD_MID_BLANK = "---\nname: f\ndescription: >-\n  alpha beta\n\n  gamma delta\n---\n";
const FOLD_THEN_KEY = "---\nname: f\ndescription: >-\n  alpha beta\nallowed-tools: []\n---\n";

check("foldedDescription folds a simple block on single spaces", parser.foldedDescription(FOLD_SIMPLE), "alpha beta gamma");
check(
  "foldedDescription does NOT stop at a LEADING blank line inside the scalar",
  parser.foldedDescription(FOLD_LEADING_BLANK),
  "alpha beta gamma"
);
check(
  "foldedDescription does NOT stop at a MID-BLOCK blank line inside the scalar",
  parser.foldedDescription(FOLD_MID_BLANK),
  "alpha beta gamma delta"
);
check(
  "foldedDescription DOES stop at the next mapping key",
  parser.foldedDescription(FOLD_THEN_KEY),
  "alpha beta"
);
check(
  "foldedDescription distinguishes an ABSENT key (null) from an empty block (\"\")",
  [parser.foldedDescription("---\nname: f\n---\n"), parser.foldedDescription("---\nname: f\ndescription: >-\n---\n")],
  [null, ""]
);
check(
  "matchesSkillName is boundary-anchored on both sides",
  [parser.matchesSkillName("fixture:lz-red here", "lz-red"), parser.matchesSkillName("lz-redux here", "lz-red")],
  [true, false]
);

// ---------------------------------------------------------------------------------------------
// step1LeadIn -- the surface that closes the lettered-lead-in blind spot. letteredChunks starts its
// loop at index 1 and so DISCARDS parts[0]; this helper is what makes that prose answerable.
//
// The last assertion is the one that matters: it reproduces the ACTUAL defect shape, a banned token
// sitting in the lead-in, and proves the pairing of step1LeadIn + keysOnTestState catches it. A
// reachability assertion without that pairing would prove only that a string was returned.
// ---------------------------------------------------------------------------------------------
const LEAD_IN_FIXTURE = [
  "## Fixture procedure",
  "",
  "1. Classify by the ask. Lead-in prose sits here, before any lettered branch.",
  "   a. First branch: that is the red step, and the red step is lz-red.",
  "   b. Second branch: that is the green step, and the green step is lz-tpp.",
  "2. A later numbered step.",
  "",
].join("\n");

check(
  "step1LeadIn returns null when the heading is absent",
  parser.step1LeadIn(LEAD_IN_FIXTURE, "No Such Heading"),
  null
);
check(
  "step1LeadIn returns null when numbered item 1 is absent",
  parser.step1LeadIn("## Fixture procedure\n\n2. Only a second item.\n", "Fixture procedure"),
  null
);
check(
  "step1LeadIn returns empty string when item 1 has no lettered sub-items",
  parser.step1LeadIn("## Fixture procedure\n\n1. One prose blob, no letters.\n", "Fixture procedure"),
  ""
);
// numberedItem splits on `^(\d+)\.[ \t]+`, so the "1. " marker is consumed and never part of the
// returned text. Asserted explicitly because the obvious expectation includes it and is wrong.
check(
  "step1LeadIn returns the flattened prose BEFORE the first lettered branch, marker consumed",
  parser.step1LeadIn(LEAD_IN_FIXTURE, "Fixture procedure"),
  "Classify by the ask. Lead-in prose sits here, before any lettered branch."
);
check(
  "step1LeadIn excludes the lettered branches themselves",
  /lz-red|lz-tpp/.test(parser.step1LeadIn(LEAD_IN_FIXTURE, "Fixture procedure")),
  false
);
// ---------------------------------------------------------------------------------------------
// routesCase -- E1 IN MINIATURE, and the E7 negative half.
//
// The whole point of the per-surface quantifier: ONE surface losing its branch must fail, even when a
// sibling still carries an identical one. A pooled quantifier passes this and that is how the real
// gate was evaded, so this is the assertion that would have caught it.
// ---------------------------------------------------------------------------------------------
const mkBranch = (branchId, conditionText, destinations, isResidual = false) => ({
  surfaceId: "fixture",
  branchId,
  conditionText,
  destinations,
  isResidual,
  isBareCatchAll: false,
});

const KASE_RED = { id: "k1", expectedOwner: "lz-red", expectedSecondHop: null, matchTokens: ["what test"] };
const KASE_TWOHOP = { id: "k2", expectedOwner: "lz-red", expectedSecondHop: "lz-tpp", matchTokens: ["add a new behavior"] };
const KASE_NONE = { id: "k9", expectedOwner: "NONE", expectedSecondHop: null, matchTokens: ["argument parsing"] };

const OWNING = mkBranch("1a", "asking what test comes next: that is lz-red", ["lz-red"]);
const RESIDUAL = mkBranch("1e", "none of the above: no skill owns it", [], true);

check("routesCase: a surface carrying the owning branch passes", routesCase([OWNING, RESIDUAL], KASE_RED).ok, true);
check(
  "routesCase: E1 in miniature -- a surface MISSING its own branch fails even though a sibling has one",
  routesCase([RESIDUAL], KASE_RED).ok,
  false
);
check(
  "routesCase: the two-hop rule is an ORDER claim -- reversed destinations fail",
  [
    routesCase([mkBranch("1c", "asking to add a new behavior: lz-red then lz-tpp", ["lz-red", "lz-tpp"])], KASE_TWOHOP).ok,
    routesCase([mkBranch("1c", "asking to add a new behavior: lz-tpp then lz-red", ["lz-tpp", "lz-red"])], KASE_TWOHOP).ok,
  ],
  [true, false]
);
// The single-hop arm judges the WHOLE destination list, not just its head. Driven in BOTH directions
// from one branch text so the pair isolates the length clause: the same correct first destination
// passes alone and fails once a contradicting sibling is affirmed after it. This is evasion-suite
// entry M4 in miniature -- there it appends a real handoff to lz-refactor inside lz-tpp step 1's own
// green-step branch, which the head-only read scored as a pass.
check(
  "owns: a single-hop case rejects a CONTRADICTING second destination after the correct first",
  [
    routesCase([mkBranch("1a", "asking what test comes next: that is lz-red", ["lz-red"])], KASE_RED).ok,
    routesCase(
      [mkBranch("1a", "asking what test comes next: that is lz-red, so hand it to lz-refactor", ["lz-red", "lz-refactor"])],
      KASE_RED
    ).ok,
  ],
  [true, false]
);
check("routesCase: a NONE case with a residual and no captor passes", routesCase([OWNING, RESIDUAL], KASE_NONE).ok, true);
check(
  "routesCase: E7 -- a NONE case CAPTURED by a positive branch fails even though the residual exists",
  routesCase([RESIDUAL, mkBranch("1f", "asking about argument parsing: that is lz-refactor", ["lz-refactor"])], KASE_NONE).ok,
  false
);
check(
  "routesCase: a NONE case with NO residual on this surface fails",
  routesCase([OWNING], KASE_NONE).ok,
  false
);

// CATCHALL widening: the house residual vocabulary is matched, and an ordinary sentence is not.
check(
  "CATCHALL_CONDITION_RE matches the house residual vocabulary but not ordinary none-of prose",
  [
    parser.CATCHALL_CONDITION_RE.test("None of (a) through (d): no skill owns it"),
    parser.CATCHALL_CONDITION_RE.test("none of the above applies"),
    parser.CATCHALL_CONDITION_RE.test("none of these smells applies, so route to lz-refactor"),
  ],
  [true, true, false]
);

check(
  "letteredChunks-blind lead-in: a banned token planted there IS caught via step1LeadIn",
  parser.keysOnTestState(
    parser.step1LeadIn(
      LEAD_IN_FIXTURE.replace("Lead-in prose sits here", "Confirm all prior tests green first"),
      "Fixture procedure"
    )
  ),
  ["all prior tests green"]
);

console.log("");

if (failures === 0) {
  console.log("SUMMARY: rgr-routing self-test GREEN -- all assertions pass");
  process.exit(0);
}

console.log(`SUMMARY: rgr-routing self-test RED -- ${failures} assertion(s) FAILED`);
process.exit(1);
