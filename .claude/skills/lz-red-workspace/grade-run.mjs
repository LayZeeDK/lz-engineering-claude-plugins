#!/usr/bin/env node
// Deterministic PRE-FILTER grader for lz-red RED-BEHAVIOR evals (EVL-02).
//
// The coach's job is to name the correct NEXT failing (red) test move for code in a RED
// situation: which test to write next, how to structure it, what assertion style fits the routed
// stance, whether it fails for the right reason, and handing off to lz-tpp for green without
// driving there. This grader encodes the D-05-RUBRIC HYBRID: the six mechanical / observable
// coach-procedure dimensions (selection; structure; assertion-target; fail-for-the-right-reason;
// handoff; coach-not-drive) are scored DETERMINISTICALLY via phrase-set matchers, and ONLY the two
// genuinely judgment-heavy dimensions are delegated to the LLM judge -- "is THIS genuinely the
// right next test" and "is the asserted target observable behavior, not implementation detail".
//
// Each expectation is one of:
//   { phraseSet: [phrase, ...] } -> SCORED: the response AFFIRMS any phrase in the set (a
//                                   correct-but-alternative phrasing still passes). Every phrase is
//                                   matched through the negation-aware occursAffirmed() below, NOT a
//                                   bare regex.test -- a negated or contrastive phrase ("assert the
//                                   returned value, NOT the private field"; "this is NOT a false
//                                   green"; "do NOT mock the query") is NOT credited.
//   { nodrive: true }            -> SCORED: metrics show no mutating/exec tool use (fail-safe/fail-loud, see below)
//   { judge: "question" }        -> UNSCORED: emitted passed:null; the LLM judge must resolve it.
//                                   Locked to EXACTLY the two judgment dimensions above; never more
//                                   than two judge checks per scenario (selfcheck-enforced).
//
// The phrase matcher (phraseRe) matches a LITERAL RED phrase (a coach vocabulary term such as
// "output-based" or "characterization test"), case-insensitive and whitespace-tolerant (incl.
// newlines), but WORD-BOUNDED so "seam" never sub-matches "seamless". occursAffirmed() (lifted from
// grade-reference.mjs) adds clause-scoped, BIDIRECTIONAL negation awareness (NEG / CONTRAST /
// FWD_BOUNDARY) plus hedged-contrastive retraction, so a phrase the coach explicitly WARNED against
// is not credited (Pitfall 6 / the Phase-11 grader-leniency class, CR-01).
//
// metrics.json (--metrics) shape for the nodrive check -- BOTH accepted:
//   canonical (skill-creator schemas.md):  { "tool_calls": { "Edit": N, "Write": N, "Bash": N, ... } }
//   flat convenience:                       { "edits": N, "writes": N, "testRuns": N }
// "drove" = any of Edit/Write/MultiEdit/NotebookEdit/Bash (or edits/writes/testRuns) > 0.
// Fail-safe: no --metrics -> nodrive fails (can't verify). Fail-LOUD: --metrics present but NO
// recognized keys -> nodrive fails with an explicit "unrecognized shape" evidence (never a
// silent pass). Bash counts as driving (running the suite is not coaching).
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
//   node grade-run.mjs --eval-id <0-9> --output <coach-response.(txt|md)> [--metrics <metrics.json>] --out <grading.json>
//   node grade-run.mjs --selfcheck

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

// ---- RED-phrase matcher: case-insensitive, whitespace-tolerant, but WORD-BOUNDED ----
// A RED phrase is literal text. Word boundaries (?<![\w-]) / (?![\w-]) stop a phrase from
// sub-matching a longer word, e.g. "seam" must NOT match "seamless". Whitespace between words is
// tolerated (incl. newlines).
function phraseRe(phrase) {
  const esc = phrase
    .trim()
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&") // escape regex metacharacters (phrases are literal)
    .replace(/\s+/g, "\\s+"); // tolerate any run of whitespace (incl. newlines) between words

  return new RegExp(`(?<![\\w-])${esc}(?![\\w-])`, "i");
}

// Global variant of the same pattern, for scanning every occurrence.
function phraseReAll(phrase) {
  return new RegExp(phraseRe(phrase).source, "gi");
}

// ---- clause-scoped, BIDIRECTIONAL negation awareness (lifted from grade-reference.mjs) ----
// A phrase is a real claim only when it is not negated looking in EITHER direction from the
// occurrence, and is not set up as a hedged hypothetical that a later contrast retracts. RED
// coaching prose is dense with contrastive phrasing -- "assert the returned value, NOT the private
// field", "this is NOT a false green", "do NOT mock the query" -- and a bare regex.test would
// credit the phrase the coach warned AGAINST (Pitfall 6 / Phase-11 CR-01). The three shapes caught:
//   - forward negation:   "expect-to-send is NOT the move"                (phrase then NEG, same clause)
//   - hedged contrastive: "you might GUESS an output-based test, BUT actually a characterization"
//   - (still) backward:   "NOT a false green, it fails on its assertion"
// Clause boundaries are punctuation; a coordinating/contrastive conjunction also ends a phrase's
// forward scope (a negation on the far side of "and"/"but" belongs to a different predicate), so
// "a characterization test and do not skip the seam" still affirms the characterization test.
// ponytail: punctuation + conjunction + hedge heuristics, not a parser. Proven in grade-reference's
// selfcheck; reused with the phrase-matcher rename only. Upgrade to a real clause splitter only if a
// graded phrasing proves systematically mis-scored.
const NEG = /\b(?:not|no|never|neither|nor|without|isn't|aren't|wasn't|weren't|doesn't|don't|didn't|cannot|n't)\b/i;
const CONTRAST = /\b(?:but|however|rather|instead|whereas|while|though|although|yet)\b/gi;
// Coordinating/contrastive conjunctions that end a phrase's forward negation scope.
const FWD_BOUNDARY = /\b(?:and|or|but|however|rather|instead|whereas|while|though|although|yet|because|since|so|plus)\b/i;
// Hedge cues that mark a following phrase as a hypothetical guess (the "you might guess X" setup).
const HEDGE = /\b(?:might|may|could|would)\s+(?:guess|think|assume|suppose|expect|imagine|say|be\s+tempted)\b|\bat\s+first(?:\s+glance|\s+blush)?\b|\binitially\b|\bnaively\b|\bon\s+first\s+read\b|\btempting\s+to\s+(?:say|think|guess|assume)\b/i;
// Contrast cues, scanned FORWARD of a hedged phrase, that spring the retraction ("...BUT actually Y").
const CONTRAST_FWD = /\b(?:but|however|actually|instead|rather|whereas|yet|in\s+fact|really)\b/i;

function clauseBefore(resp, idx) {
  let start = idx;

  while (start > 0 && !".,;:!?\n".includes(resp[start - 1])) {
    start--;
  }

  let clause = resp.slice(start, idx);
  const cm = [...clause.matchAll(CONTRAST)];

  if (cm.length) {
    const last = cm[cm.length - 1];
    clause = clause.slice(last.index + last[0].length);
  }

  return clause;
}

// Text AFTER the phrase up to the next punctuation, truncated at the first coordinating/contrastive
// conjunction so a negation past "and"/"but" is not mis-attributed to this phrase.
function clauseAfter(resp, end) {
  let stop = end;

  while (stop < resp.length && !".,;:!?\n".includes(resp[stop])) {
    stop++;
  }

  let clause = resp.slice(end, stop);
  const fm = clause.search(FWD_BOUNDARY);

  if (fm >= 0) {
    clause = clause.slice(0, fm);
  }

  return clause;
}

// The sentence (bounded by . ! ? newline) split around the phrase occurrence.
function sentenceAround(resp, idx, end) {
  let s = idx;

  while (s > 0 && !".!?\n".includes(resp[s - 1])) {
    s--;
  }

  let e = end;

  while (e < resp.length && !".!?\n".includes(resp[e])) {
    e++;
  }

  return { before: resp.slice(s, idx), after: resp.slice(end, e) };
}

// "you might guess X, but actually Y": a hedge before the phrase and a contrast after it (same
// sentence) mark the phrase as a retracted hypothetical, not an affirmed claim.
function hedgedContrastive(resp, idx, end) {
  const { before, after } = sentenceAround(resp, idx, end);

  return HEDGE.test(before) && CONTRAST_FWD.test(after);
}

// Phrase appears at least once as a real claim: present, negated in NEITHER direction, and not a
// hedged-then-retracted hypothetical.
function occursAffirmed(resp, phrase) {
  const re = phraseReAll(phrase);
  let m;

  while ((m = re.exec(resp)) !== null) {
    const idx = m.index;
    const end = idx + m[0].length;
    const negated = NEG.test(clauseBefore(resp, idx)) || NEG.test(clauseAfter(resp, end));

    if (!negated && !hedgedContrastive(resp, idx, end)) {
      return true;
    }

    if (re.lastIndex === m.index) {
      re.lastIndex++;
    }
  }

  return false;
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

// ---- RED coach-procedure phrase vocabulary (per-dimension, word-bounded, negation-aware) ----
// Each set is matched with occursAffirmed(): a phraseSet check PASSES if the response affirms ANY
// member. Phrases are literal (the alternatives cover correct-but-different wording); word stems are
// spelled out as separate members because the word boundary would otherwise reject a suffix
// (e.g. "triangulate" would not match "triangulation").
const P = {
  starterCase: [
    "degenerate", "degenerate case", "starter case", "simplest case", "simplest input",
    "empty list", "empty array", "empty collection", "empty input", "empty string", "zero", "no-op",
  ],
  triangulation: [
    "triangulate", "triangulation", "triangulating", "another example", "another concrete example",
    "second example", "test.each", "it.each",
  ],
  aaaStructure: [
    "arrange-act-assert", "arrange, act, assert", "given-when-then", "given, when, then", "AAA", "GWT",
  ],
  outputBased: [
    "output-based", "assert the returned value", "assert on the returned value",
    "the value it returns", "the returned value",
  ],
  noDoubles: [
    "no double", "no doubles", "no mock", "no mocks", "no test double", "pure function", "functional core",
  ],
  stateBased: [
    "state-based", "public side effect", "observable state", "observable side effect",
    "through the public surface", "through its public surface", "public interface",
  ],
  communication: [
    "communication-based", "expect-to-send", "expect to send", "toHaveBeenCalled",
    "toHaveBeenCalledWith", "the one warranted double", "one warranted double", "outgoing command",
  ],
  noOverMock: [
    "the query needs no double", "no double for the query", "no mock for the query",
    "queries need no double", "only the outgoing command", "do not mock the query",
  ],
  characterization: [
    "characterization test", "characterization", "pin the current behavior", "pin current behavior",
    "pin its current behavior", "lock it in", "lock in the current behavior",
  ],
  seam: ["find a seam", "a seam", "seams", "injection point", "substitution point"],
  falseGreen: [
    "false green", "passes immediately", "green on the first run", "green the first time", "never red",
    "never fails", "never failed", "already passes", "already does", "drives no new behavior",
  ],
  failOnAssertion: [
    "AssertionError", "fail on its assertion", "fails on its assertion", "fail on the assertion",
    "fail for the right reason", "assert the actual value", "assert the discounted value",
  ],
  handoff: [
    "lz-tpp", "green step", "hand off", "hands off", "handoff", "Law 3", "transformation step",
    "making it pass is the green",
  ],
  presentNextTest: [
    "next failing test", "next test", "starter case", "degenerate", "empty string", "output-based",
    "assert the returned value",
  ],
  classifyRed: [
    "red step", "the red step", "classify", "classify first", "new failing test", "failing test first",
    "Law 1", "write a failing test", "red test first",
  ],
  seamSeparation: [
    "lz-refactor", "lz-tpp", "after it is green", "once it is green", "then refactor",
    "separate concern", "refactor step",
  ],
};

// ---- per-eval rubric (D-05-RUBRIC per-dimension hybrid). SCORED: phraseSet / nodrive. UNSCORED: judge. ----
// Each RUBRICS[id] is count-aligned 1:1 (SAME ORDER) with that scenario's evals.json expectations.
// The judge is locked to EXACTLY the two judgment-heavy dimensions (right-next-test,
// behavior-not-implementation); no scenario uses more than two judge checks (selfcheck-enforced).
const RUBRICS = {
  // 0 -- Selection (starter case) + Structure (AAA): a brand-new behavior, sumOf([]) -> 0.
  0: [
    { phraseSet: P.starterCase, text: "Picks the degenerate / starter case (empty list -> zero) for the new behavior" },
    { phraseSet: P.aaaStructure, text: "Shapes the test arrange-act-assert (or given-when-then)" },
    { judge: "Is starting from the empty / degenerate case genuinely the right FIRST test for this new behavior?" },
    { nodrive: true, text: "Coach, don't drive (no edit / no test run)" },
  ],
  // 1 -- Selection (triangulation): one example green, a too-specific implementation still passes.
  1: [
    { phraseSet: P.triangulation, text: "Uses triangulation (another concrete example) to select the next test" },
    { judge: "Is the proposed next test one the too-specific current implementation cannot satisfy (a genuine triangulation move), not a redundant example?" },
    { nodrive: true, text: "Coach, don't drive (no edit / no test run)" },
  ],
  // 2 -- Assertion target OUTPUT (functional core): a pure value-in / value-out function.
  2: [
    { phraseSet: P.outputBased, text: "Names an output-based assertion (assert the returned value)" },
    { phraseSet: P.noDoubles, text: "States no doubles are needed for the pure core" },
    { judge: "Is asserting the returned value of this pure function genuinely observable behavior, not an implementation detail?" },
    { judge: "Is an output-based test over the core the right next test for a value-in / value-out function?" },
    { nodrive: true, text: "Coach, don't drive (no edit / no test run)" },
  ],
  // 3 -- Assertion target COMMUNICATION (message matrix, outgoing command) + over-mock temptation.
  3: [
    { phraseSet: P.communication, text: "Names the expect-to-send (outgoing command) assertion on the one warranted double" },
    { phraseSet: P.noOverMock, text: "Says the query needs no double (assert its return); only the outgoing command warrants one" },
    { judge: "Does the answer reserve the double for the single outgoing command and refuse to mock the query, rather than mocking every collaborator (over-mocking)?" },
    { nodrive: true, text: "Coach, don't drive (no edit / no test run)" },
  ],
  // 4 -- Assertion target STATE (message matrix, incoming command): the observable public side effect.
  4: [
    { phraseSet: P.stateBased, text: "Names a state-based assertion on the public side effect" },
    { phraseSet: P.noDoubles, text: "Asserts through the public surface with no double" },
    { judge: "Is the asserted state change observed through the public surface (observable behavior), not a private field (implementation detail)?" },
    { nodrive: true, text: "Coach, don't drive (no edit / no test run)" },
  ],
  // 5 -- Assertion target CHARACTERIZATION (seams and legacy): untested legacy welded to a clock.
  5: [
    { phraseSet: P.characterization, text: "Names a characterization test to pin current behavior first" },
    { phraseSet: P.seam, text: "Names finding a seam to make the behavior reachable" },
    { judge: "Is the right next move to find a seam and pin current behavior with a characterization test BEFORE the new red test, rather than jumping straight to the new behavior?" },
    { nodrive: true, text: "Coach, don't drive (no edit / no test run)" },
  ],
  // 6 -- Fail-for-the-right-reason: a candidate test that would pass immediately (false green).
  6: [
    { phraseSet: P.falseGreen, text: "Identifies it as a false green (passes immediately, drives no new behavior)" },
    { phraseSet: P.failOnAssertion, text: "Says the sharpened test must fail on its assertion (an AssertionError on the value)" },
    { judge: "Is the correct diagnosis that this is a false green to be sharpened so it fails on its assertion (an AssertionError on the discounted value)?" },
    { nodrive: true, text: "Coach, don't drive (no edit / no test run)" },
  ],
  // 7 -- Coach-not-drive, QUESTION variant: advice sought; present the test, do not edit / run.
  7: [
    { phraseSet: P.presentNextTest, text: "Presents the next failing test and the smallest move" },
    { judge: "Given a question (advice sought), does the coach present the next failing test and smallest move and leave the writing to the developer, rather than driving it?" },
    { nodrive: true, text: "Coach, don't drive (no edit / no test run on a question)" },
  ],
  // 8 -- Coach-not-drive, COMMAND variant: write the red test, then STOP; hand green off to lz-tpp.
  8: [
    { phraseSet: P.handoff, text: "Frames making it pass as the green step (hands off to lz-tpp); does not drive to green" },
    { judge: "Given an explicit command to write the red test, does the coach write a test that fails on its assertion, then stop without driving it to green?" },
    { nodrive: true, text: "Coach, don't run the suite unasked" },
  ],
  // 9 -- Classify-first boundary (REQUIRED): a naive read routes to lz-tpp / lz-refactor, but the
  //      correct move is a NEW red test for an uncovered behavior (the EVL-02 three-way boundary).
  9: [
    { phraseSet: P.classifyRed, text: "Classifies the request as RED: a new failing test for the uncovered behavior comes first" },
    { phraseSet: P.seamSeparation, text: "Parks the tidy-up as a separate lz-refactor concern (after green) and green as lz-tpp" },
    { judge: "Is the correct next move a NEW failing test for the uncovered behavior (RED), rather than refactoring the messy-but-green code or jumping to a green-step transformation?" },
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

  if (check.phraseSet) {
    const hits = check.phraseSet.filter((p) => occursAffirmed(resp, p));
    const passed = hits.length > 0;

    return {
      text: check.text || "Affirms an in-set RED phrase",
      passed,
      evidence: passed
        ? `affirmed in-set phrase: ${hits.join(", ")}`
        : `affirmed none of the phrase set (${check.phraseSet.join(" | ")})`,
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

  // phraseRe: whitespace-tolerant (incl. newlines) and WORD-BOUNDED (no sub-match).
  assert(occursAffirmed("use an output-based assertion here", "output-based"), "phraseRe matches the exact phrase");
  assert(occursAffirmed("assert  the   returned value", "assert the returned value"), "phraseRe tolerant of extra spaces");
  assert(occursAffirmed("triangulate\n  with another example", "triangulate"), "phraseRe tolerant of newline/indent between words");
  assert(!occursAffirmed("a seamless workflow", "seam"), "phraseRe must NOT sub-match inside a longer word (seamless)");
  assert(occursAffirmed("first find a seam to observe it", "a seam"), "phraseRe matches a standalone phrase");

  // negation awareness (clause-scoped, BIDIRECTIONAL): a negated / retracted RED phrase is NOT credited.
  assert(occursAffirmed("this is a false green: it passes immediately", "false green"), "affirmed 'false green' counts");
  assert(!occursAffirmed("this is not a false green; it fails on its assertion", "false green"), "same-clause PRECEDING negation on 'false green' suppresses");
  assert(!occursAffirmed("expect-to-send is not the right move here", "expect-to-send"), "FORWARD negation (NEG after the phrase) suppresses");
  assert(occursAffirmed("assert the returned value, not the private field", "assert the returned value"), "affirmed phrase before a contrast still counts");
  assert(occursAffirmed("it is a characterization test, not an output-based one", "characterization test"), "negation past a comma does not cross to this phrase");
  assert(occursAffirmed("use a characterization test and do not skip the seam", "characterization test"), "forward NEG past a coordinating conjunction does NOT suppress this phrase");
  assert(!occursAffirmed("you might guess an output-based test, but actually a characterization test", "an output-based test"), "hedged-then-retracted phrase is not an affirmed claim");

  // phraseSet: SCORED pass when any member is affirmed; fail when none is.
  const g2 = grade(2, "assert the returned value; this is a pure function so no doubles are needed", zero);
  assert(g2.expectations[0].passed === true, "eval2 output-based phraseSet passes when affirmed");
  assert(g2.expectations[1].passed === true, "eval2 no-doubles phraseSet passes when affirmed");
  assert(g2.expectations[2].passed === null, "eval2 behavior-not-impl check is judge-only (passed:null)");
  assert(g2.expectations[3].passed === null, "eval2 right-next-test check is judge-only (passed:null)");
  assert(g2.expectations[4].passed === true, "eval2 nodrive passes with zero tool calls");
  assert(g2.summary.total === 3, "eval2 summary counts the 3 SCORED checks (2 phraseSet + nodrive)");
  assert(g2.judge_required.length === 2, "eval2 reports 2 judge_required items (the two locked dimensions)");
  const g2miss = grade(2, "just write any test you like", zero);
  assert(g2miss.expectations[0].passed === false, "eval2 output-based phraseSet FAILS when no member is affirmed");
  assert(g2miss.expectations[1].passed === false, "eval2 no-doubles phraseSet FAILS when no member is affirmed");

  // negation-blind guard at the grade level: a warned-against phrase does not credit the check.
  const g6neg = grade(6, "this is not a false green; it already fails on its assertion", zero);
  assert(g6neg.expectations[0].passed === false, "eval6 false-green phraseSet is NOT credited when the phrase is negated");
  assert(g6neg.expectations[1].passed === true, "eval6 fail-on-assertion phraseSet still passes on the affirmed clause");

  // nodrive: nested (canonical) shape DETECTED as drove; flat shape works; unrecognized fails loud; missing fails safe.
  const droveNested = grade(0, "start from the empty list, arrange-act-assert", { tool_calls: { Edit: 3, Write: 2, Bash: 1 } });
  assert(droveNested.expectations[3].passed === false, "nested tool_calls with edits>0 must FAIL nodrive");
  const droveFlat = grade(0, "start from the empty list, arrange-act-assert", { edits: 1 });
  assert(droveFlat.expectations[3].passed === false, "flat edits>0 must FAIL nodrive");
  const miskeyed = grade(0, "start from the empty list, arrange-act-assert", { foo: 1, bar: 2 });
  assert(miskeyed.expectations[3].passed === false, "unrecognized metrics shape must FAIL nodrive (no silent pass)");
  assert(/unrecognized|no recognized/i.test(miskeyed.expectations[3].evidence), "miskeyed metrics evidence names the shape problem");
  const noMetrics = grade(0, "start from the empty list, arrange-act-assert", null);
  assert(noMetrics.expectations[3].passed === false, "nodrive without metrics reports false (fail-safe)");

  // judge checks never autonomously pass/fail.
  const g1 = grade(1, "triangulate with another example that rules out the constant", zero);
  assert(g1.expectations[1].passed === null, "eval1 right-next-test check is judge-only");
  assert(g1.summary.total === 2, "eval1 has 2 scored checks (triangulation phraseSet + nodrive)");

  // fail-closed output path: judge items remain -> grading.preliminary.json, NOT grading.json.
  assert(finalOutPath("x/grading.json", 1).endsWith("grading.preliminary.json"), "judge items remaining -> preliminary path");
  assert(finalOutPath("x/grading.json", 0) === "x/grading.json", "no judge items -> honor --out path");

  // every phraseSet in RUBRICS is a non-empty array (no dead check).
  for (const [id, checks] of Object.entries(RUBRICS)) {
    for (const c of checks) {
      if ("phraseSet" in c) {
        assert(Array.isArray(c.phraseSet) && c.phraseSet.length > 0, `RUBRICS[${id}] has an empty phraseSet`);
      }
    }
  }

  // the LLM judge is locked to at most the two judgment dimensions per scenario (D-05-RUBRIC).
  for (const [id, checks] of Object.entries(RUBRICS)) {
    const judges = checks.filter((c) => "judge" in c).length;
    assert(judges <= 2, `RUBRICS[${id}] has ${judges} judge checks (max is the 2 locked dimensions)`);
  }

  // RUBRICS <-> evals.json alignment (Pitfall 5: fails loudly on count drift; reads evals.json by the script's own path).
  try {
    const evalsPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "evals", "evals.json");
    const doc = JSON.parse(fs.readFileSync(evalsPath, "utf8"));
    assert(doc.skill_name === "lz-red", `evals.json skill_name is "${doc.skill_name}", expected "lz-red"`);

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

// Run main() only as a script; guarded so this module can be imported (by a tabulator) to reuse the
// negation-aware matcher without executing the grader (mirrors run-e2e.mjs).
const isMainModule = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMainModule) {
  main();
}

export { occursAffirmed, phraseRe };
