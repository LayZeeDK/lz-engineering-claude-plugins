#!/usr/bin/env node
// Semantic routing gate over the plugin's red-green-refactor classifier surfaces (Phase 22,
// CLS-01..CLS-04). Three assertions, every one of them DERIVED from a parsed
// (condition -> destination) table rather than from token presence:
//   (a) exhaustive   -- every case in tools/rgr-cases.json lands on a NAMED owner, and no router
//                       surface keeps a bare "otherwise ... is this skill" terminal (D-01).
//   (b) at-most-one  -- no case is claimed for ITSELF by more than one of the three step-1
//                       procedures (D-02, SC2's literal wording).
//   (c) single-axis  -- no branch in ANY surface, router or mode-selection gate alike, keys on test
//                       state; all key on the ask (D-03).
// Plus two same-file citation checks, a per-skill description budget check, a per-skill description
// single-axis check, an intro-prose check (two-hop order plus single-axis, over the text between
// the H1 and the first `## ` heading in each SKILL.md), a step-1 lead-in single-axis check (over the
// prose before the first lettered branch, which letteredChunks discards), and a WHOLE-SECTION
// single-axis check over every declared surface's entire section body, pre-filter -- the only check
// here quantified over a whole region rather than a sub-region, which is why an earlier version of
// this inventory omitting it was the wrong thing to leave out. All are HARD failures (non-zero exit).
// Node builtins only, plus the two local libs.
//
// HISTORY -- the wave-1 RED baseline, now CLOSED. This gate was RED against the tree by design when
// it was authored (instrument-first, modelled on check-red-references.mjs's Wave-0 wording), for six
// concrete reasons: beck-seam's post-repair heading was absent; four router surfaces ended in a bare
// catch-all terminal; two mode gates plus lz-tpp step 1 keyed on test state; no branch covered the
// post-green "what now?" case; and the QUESTION/COMMAND paragraph carried no heading. Waves 22-03
// and 22-04 closed the classifier half, and a later gap-closure round closed the last of it. The
// gate is GREEN against the tracked tree now, so a FAILURE here is a REGRESSION, not a baseline.
//
// The standing prohibition still binds: do NOT edit shipped Markdown to make this pass, and do NOT
// weaken an assertion to make it pass. The description budget check was deliberately GREEN from the
// start as a live budget guard, and it has since earned that role: it caught an edit at 1551 chars,
// 15 OVER the cap, before it could ship. (A second edit measured 1508 -- 28 of headroom, so UNDER
// the cap and never a failure; it was tightened on the separate grounds that 28 chars of margin is
// too thin to live with. An earlier version of this comment called both "over-cap", which was wrong
// about the 1508 one.) The check is ALSO defeatable, and the fold it depends on had to be repaired
// after an unprimed review made it return 0 chars -- see the anti-vacuity floor at the check itself.
//
// COVERAGE BOUNDARY, stated because conflating the two is a recorded failure mode on this repo. This
// gate proves that the AUTHORED classifier is exhaustive, disjoint and single-axis OVER THE CORPUS.
// It does NOT prove that a model ROUTES correctly -- that claim belongs to the metered placement
// eval (CLS-05), which is owner-approval-gated and does not run here. A GREEN verdict from this file
// is a floor, never an acceptance verdict: this phase EXISTS because a 125-check battery went GREEN
// while the classifier was non-exhaustive, and the reviewer measured that ceiling by reverting both
// routing sites while keeping a renamed heading.
//
// A SECOND coverage boundary, closed in a gap-closure follow-up after plan 22-08: every
// ROUTING_SURFACES entry anchors to a `## ` heading, so prose ABOVE the first heading in each
// SKILL.md was, until the intro-prose checks below existed, invisible to every assertion above --
// exactly where an unprimed human review (never this gate) found lz-refactor's two-hop BLOCKER and
// a folded-description test-state phrase that survived two shipped descriptions until 22-08. The
// intro-prose and description-single-axis checks close THAT one blind spot; they do not claim to
// close every blind spot that could exist, and they deliberately do NOT require every skill's intro
// to name both siblings -- lz-tpp's intro names neither, and 22-VERIFICATION.md already ruled that
// omission non-blocking (an incompleteness, not a contradiction).
//
// A THIRD coverage boundary, and the proof that the previous paragraph's caveat was warranted. The
// SECOND boundary was closed by reasoning about `## ` headings -- yet the very next unprimed review
// found the SAME SHAPE one level down: letteredChunks splits numbered item 1 on `a.`/`b.`/... and its
// loop starts at index 1, so the LEAD-IN prose before the first lettered branch was discarded and
// answerable to nothing. The literal banned token `all prior tests green` was living there, in
// lz-tpp step 1, one sentence after that same step forbids routing on suite state -- and the
// TEST_STATE_TOKENS seed comment had already NAMED that site as a source, so the token was listed
// for a location the parser could never reach. The `[cls-03] step-1 lead-in` check below closes it.
// The lesson to carry: closing a blind spot in one region says nothing about its neighbours, and
// each of these three was found by a human review rather than by this gate.
//
// NAMED CEILING, stated rather than left looking closed. `TEST_STATE_TOKENS` is a LITERAL BLOCKLIST,
// so the single-axis checks above are only as complete as that list. A novel paraphrase evades every
// one of them: an unprimed review demonstrated it by prefixing a judged mode gate with "nothing in
// the suite is red, and" -- not a listed phrase, gate GREEN. The whole-section check does not help,
// because it runs the same list. This has now been hit TWICE (the other was the semantic variant
// "no test is failing yet" living in two shipped descriptions), so treat the list as a floor that
// catches known phrasings, never as proof that the axis is clean. The honest complements are the
// metered placement eval (CLS-05), which measures ROUTING rather than wording, and the human review
// habit that has found every one of the four blind spots this file records. Do NOT read a GREEN
// single-axis result as "no test-state framing exists".
//
// FAIL-CLOSED CONTRACT (D-17). Every surface file is read with try/catch -> "", and deliberately NOT
// gated on an existsSync probe -- unlike the SEAM-02 block in check-red-references.mjs, whose own
// header condemns an existsSync-gated post-loop block as a fully silent vacuous pass. An
// emit-nothing path would also make a count-style roster gate fire on the COUNT rather than on the
// guard that found something. The empty string has no heading, so sectionBody returns null, so the
// parse returns ok:false and report() runs EXACTLY ONCE for that surface every run. A null section
// body is never a skip and never a `continue`. The scan floor and corpus floor are the paired
// anti-vacuity checks: an empty surface list or an empty corpus FAILS instead of reading as clean.
//
// This file is a SIBLING of check-red-references.mjs, never an extension of it (D-16). That file
// stays byte-unchanged so its hand-maintained emitted-check arithmetic and its new-label roster are
// not perturbed; its SEAM-02 and TD-02 presence guards stay exactly as they are, because they cover
// a zero-occurrence regression this semantic gate does not replace. This file predicts no check
// count of its own -- the floors above are what make it non-vacuous.
//
// ponytail: the corpus binds to branches STRUCTURALLY -- a case is covered when some branch's
// flattened condition contains every one of that case's ask-word matchTokens and names the expected
// owner first. That is deterministic, legible in the report, and mutation-sensitive. Its ceiling: it
// is a token-containment test, not semantic matching, so a branch could in principle contain the
// ask-words while meaning something else. Upgrade path if that ever bites: move the binding to a
// parsed pipe-table of (condition -> owner) rows via lib/pipe-table.mjs, which is the shape a shared
// routing table would ship in. Do not upgrade to an LLM judge -- the judged claim is the eval's.
//   node .claude/skills/lz-red-workspace/tools/check-rgr-routing.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { sectionBody } from "./lib/section-body.mjs";
import {
  ROUTING_SURFACES,
  destinationsIn,
  foldedDescription,
  introBody,
  step1LeadIn,
  covers,
  owns,
  isDeclaredResidual,
  routesCase,
  keysOnTestState,
  affirmedPhrasesIn,
  parseRoutingBranches,
} from "./lib/routing-parse.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
// tools -> lz-red-workspace -> skills -> .claude -> repo root
const repoRoot = path.resolve(here, "..", "..", "..", "..");
const CORPUS_PATH = path.join(here, "rgr-cases.json");
const LZ_REFACTOR_SKILL = path.join(repoRoot, "plugins", "lz-tdd", "skills", "lz-refactor", "SKILL.md");

// Per-entry listing cap for a skill's folded description. Do NOT hard-code a baseline here -- the
// gate PRINTS all three lengths and their headroom on every run, and a pinned figure in a comment
// goes stale silently. (It did: an earlier version of this comment claimed lz-red 1233 / lz-tpp 750
// / lz-refactor 1245. Against a real 1495, that stale 1245 OVERSTATED lz-refactor's remaining budget
// by 250 chars -- it implied ~291 chars of room where only 41 exist. Overstating is the dangerous
// direction, and a previous attempt to correct this comment got the direction backwards, which is
// why it is spelled out.) Read the run output instead. This is a LIVE budget guard, not a baseline
// to flip, and lz-refactor's headroom is by far the tightest.
const DESCRIPTION_CHAR_CAP = 1536;

// Anti-vacuity floor for the fold. No real shipped skill description is anywhere near this short --
// the three tracked ones are 1139-1495 chars -- so a fold below it means the PARSE truncated, not
// that someone wrote a terse description. Both description checks refuse rather than report a
// reassuring number over text they could not see.
const DESCRIPTION_MIN_CHARS = 200;
const SKILLS = Object.freeze(["lz-red", "lz-tpp", "lz-refactor"]);

// A behavior-change ask, as DATA. The sweep rule cites a step-1 rule in order to EXCLUDE behavior
// changes from a sweep, so "the citation resolves" means every skill the citation names really is a
// destination of some step-1 branch whose condition is about changing behavior.
//
// THIS SET MUST NOT MATCH A NEGATED MENTION, and it used to. `"changing behavior"` matched branch
// 1d's condition "Asking to improve structure or readability WITHOUT changing behavior" -- the exact
// negation -- so `lz-refactor` joined the set, all three slugs were then members, `unresolved` was
// empty for ANY cited slug, and the check collapsed to "some sweep sentence contains the literal
// string `(step 1)`". It printed "cites [lz-tpp, lz-red], each a step-1 behavior-change destination"
// while the citation was SWAPPED. A check that asserts a property it cannot compute is worse than a
// missing check, because it reads as coverage.
//
// Two defences, both required. First, the tokens are matched with a preceding-negation guard below.
// Second, an explicit anti-tautology control asserts the resulting set is a STRICT SUBSET of the
// three slugs -- if it ever contains all three again, the check has re-degenerated and says so.
const BEHAVIOR_CHANGE_ASK_TOKENS = Object.freeze([
  "changing behavior",
  "change behavior",
  "add or change behavior",
  "add a new behavior",
  "failing test pass",
]);

// Negators that flip a behavior-change mention into a behavior-PRESERVING one. Scoped to a short
// window immediately before the token so an unrelated "not" earlier in a long condition cannot
// suppress a genuine mention.
const NEGATED_ASK_RE = /\b(?:without|not|never|no|preserv\w*|rather\s+than)\b[^.;:]{0,40}$/i;

// True when `cond` affirms a behavior-change ask -- i.e. some token appears NOT under a negation.
const affirmsBehaviorChangeAsk = (cond) => {
  const lowered = cond.toLowerCase();

  return BEHAVIOR_CHANGE_ASK_TOKENS.some((token) => {
    let from = 0;

    for (;;) {
      const at = lowered.indexOf(token, from);

      if (at === -1) {
        return false;
      }

      if (!NEGATED_ASK_RE.test(lowered.slice(0, at))) {
        return true;
      }

      from = at + token.length;
    }
  });
};

// The heading 22-03 authors over today's unnamed QUESTION/COMMAND paragraph, and the exact string
// step 4's prose pointer must name so the cross-reference resolves.
const ANCHOR_HEADING = "QUESTION vs COMMAND intent routing";
const SWEEP_HEADING = "Whole-package / directory sweeps";
const PROCEDURE_HEADING = "Coach decision procedure";
const STEP1_CITATION_RE = /\(step\s*1\)/i;

let failures = 0;

const report = (ok, label, detail) => {
  if (!ok) {
    failures++;
  }

  console.log(`  [${ok ? "PASS" : "FAIL"}] ${label}${detail ? " -- " + detail : ""}`);
};

// The fail-closed whole-file read. See the FAIL-CLOSED CONTRACT in the header: no existence probe,
// the empty string on any read failure, so every surface still gets exactly one report().
const readOrEmpty = (p) => {
  try {
    return fs.readFileSync(p, "utf8");
  } catch {
    return "";
  }
};

const flatten = (s) => String(s == null ? "" : s).replace(/\s+/g, " ").trim();

// Corpus load. A malformed or unreadable corpus is an IO/usage error, not a check failure, so it
// exits 2 rather than 1 -- the operator needs to see that the instrument could not run at all.
let corpus;

try {
  corpus = JSON.parse(fs.readFileSync(CORPUS_PATH, "utf8"));
} catch (err) {
  console.log(`SUMMARY: RGR-ROUTING ERROR -- cannot read or parse ${path.relative(repoRoot, CORPUS_PATH)}: ${err.message}`);
  process.exit(2);
}

const CASES = Array.isArray(corpus && corpus.cases) ? corpus.cases : [];
// The three step-1 coach procedures: the router surfaces whose branches are lettered sub-items. The
// exhaustive and at-most-one assertions iterate these, which is why the corpus floor asserts there
// are three of them -- an empty set would make both assertions vacuous.
const STEP1_SURFACES = ROUTING_SURFACES.filter((s) => s.kind === "router" && s.parseMode === "lettered");
const ROUTER_SURFACES = ROUTING_SURFACES.filter((s) => s.kind === "router");

console.log("RGR routing gate (exhaustive + at-most-one + single-axis over a parsed routing table)");
console.log(`  surfaces: ${ROUTING_SURFACES.length} (${ROUTER_SURFACES.length} router, ${ROUTING_SURFACES.length - ROUTER_SURFACES.length} mode-gate)`);
console.log(`  corpus:   ${CASES.length} cases from ${path.relative(repoRoot, CORPUS_PATH)}`);
console.log("");

// ---------------------------------------------------------------------------------------------
// Parse every surface. One entry per ROUTING_SURFACES id, always present, even when the read or the
// parse failed -- that is what makes the per-surface reports below unconditional.
// ---------------------------------------------------------------------------------------------
const parsed = new Map();
const fileCache = new Map();

for (const surface of ROUTING_SURFACES) {
  const abs = path.join(repoRoot, ...surface.file.split("/"));

  if (!fileCache.has(abs)) {
    fileCache.set(abs, readOrEmpty(abs));
  }

  parsed.set(surface.id, parseRoutingBranches(fileCache.get(abs), surface));
}

const allBranches = [];

for (const surface of ROUTING_SURFACES) {
  allBranches.push(...parsed.get(surface.id).branches);
}

// ---------------------------------------------------------------------------------------------
// [cls] scan floor -- the D-17 canonical-location check, and the answer to a renamed heading.
// ---------------------------------------------------------------------------------------------
console.log("[cls] scan floor -- every declared surface parses to at least one branch");

for (const surface of ROUTING_SURFACES) {
  const result = parsed.get(surface.id);

  report(
    result.ok,
    `[cls] scan floor -- ${surface.id}`,
    result.ok
      ? `${result.branches.length} branch(es) from ${surface.file}`
      : `${result.why} (${surface.file})`
  );
}

console.log("");

// ---------------------------------------------------------------------------------------------
// [cls] corpus floor -- the anti-vacuity control INSIDE the real gate. Every assertion below is
// quantified over the corpus and over the surface list; if either is empty, or a case carries no
// ask-words, the assertions would pass by having nothing to check.
// ---------------------------------------------------------------------------------------------
const tokenlessCases = CASES.filter(
  (c) => !Array.isArray(c.matchTokens) || c.matchTokens.filter((t) => typeof t === "string" && t.trim() !== "").length === 0
).map((c) => c.id);
const floorReasons = [];

if (CASES.length === 0) {
  floorReasons.push("corpus carries zero cases");
}

if (ROUTING_SURFACES.length === 0) {
  floorReasons.push("surface list is empty");
}

if (STEP1_SURFACES.length !== 3) {
  floorReasons.push(`expected 3 step-1 router surfaces, found ${STEP1_SURFACES.length}`);
}

if (tokenlessCases.length > 0) {
  floorReasons.push(`case(s) with no usable matchTokens: ${tokenlessCases.join(", ")}`);
}

// THE CORPUS'S OWN SHAPE IS PART OF THE FLOOR, because the corpus is an INPUT to every assertion
// below and editing it silently retires them. Measured: flipping c4's `expectedSecondHop` from
// "lz-tpp" to null -- ONE word, in a data file -- deletes the only ordered-pair case, so `owns`
// never takes its two-hop arm again and D-02's ORDER claim stops being tested anywhere, while the
// gate reports GREEN over a corpus that now looks entirely well-formed. Every other check here
// judges authored PROSE against the corpus; nothing judged the corpus.
//
// The three shape claims are exactly the ones the assertions depend on and cannot restate for
// themselves: one residual case (the D-01 terminal), one ordered pair (the D-02 two-hop), and owners
// drawn only from the real vocabulary. Counts are pinned at ONE rather than at-least-one because
// c8's rationale makes the single ordered pair load-bearing -- a second two-hop would leave which
// case pins D-02 ambiguous.
const OWNER_VOCABULARY = Object.freeze([...SKILLS, "NONE"]);
const noneCases = CASES.filter((c) => c.expectedOwner === "NONE").map((c) => c.id);
const twoHopCases = CASES.filter((c) => c.expectedSecondHop).map((c) => c.id);
const badOwners = CASES.filter((c) => !OWNER_VOCABULARY.includes(c.expectedOwner)).map(
  (c) => `${c.id}:${c.expectedOwner}`
);
const badSecondHops = CASES.filter((c) => c.expectedSecondHop && !SKILLS.includes(c.expectedSecondHop)).map(
  (c) => `${c.id}:${c.expectedSecondHop}`
);

if (noneCases.length !== 1) {
  floorReasons.push(
    `expected exactly 1 no-owner case (D-01's declared residual), found ${noneCases.length}${noneCases.length ? ` [${noneCases.join(", ")}]` : ""}`
  );
}

if (twoHopCases.length !== 1) {
  floorReasons.push(
    `expected exactly 1 ordered two-hop case (D-02), found ${twoHopCases.length}${twoHopCases.length ? ` [${twoHopCases.join(", ")}]` : ""} -- the ordered-pair arm of owns() is untested without it`
  );
}

if (badOwners.length > 0) {
  floorReasons.push(
    `expectedOwner outside [${OWNER_VOCABULARY.join(" | ")}]: ${badOwners.join(", ")}`
  );
}

if (badSecondHops.length > 0) {
  floorReasons.push(`expectedSecondHop outside [${SKILLS.join(" | ")}]: ${badSecondHops.join(", ")}`);
}

report(
  floorReasons.length === 0,
  "[cls] corpus floor -- cases loaded with non-empty matchTokens, declared shape intact, over a non-empty surface list",
  floorReasons.length === 0
    ? `${CASES.length} cases, ${ROUTING_SURFACES.length} surfaces, ${STEP1_SURFACES.length} step-1 procedures, 1 no-owner case (${noneCases[0]}), 1 ordered two-hop (${twoHopCases[0]})`
    : floorReasons.join("; ")
);

console.log("");

// ---------------------------------------------------------------------------------------------
// Coverage predicates.
// ---------------------------------------------------------------------------------------------

// covers / owns / isDeclaredResidual and the pair-level quantifier routesCase now live in
// lib/routing-parse.mjs and are imported. They used to be defined here and RESTATED by hand in the
// selftest, which is how the selftest's `coveredBy` came to run over one surface while this gate
// pooled three -- proving a discrimination the gate did not have. One definition, two callers.

// ---------------------------------------------------------------------------------------------
// [cls-01] exhaustive -- PER SURFACE. Every step-1 procedure must independently route every case.
//
// This was quantified over a POOLED list of all three procedures' branches, and an unprimed review
// evaded it: deleting lz-red's OWN branch (a) -- the branch by which lz-red claims the red step at
// all -- left the gate GREEN, because the two sibling procedures still carried an identical 1a.
// Deleting it from all three turned the gate RED. So the gate's primary assertion protected the
// UNION of the three files and no individual file, which is worthless when they are near-identical:
// every single-file regression was masked by its siblings.
//
// Now one report per (surface, case) pair -- 27 where there were 9 -- with both halves of a NONE
// assertion folded into the pair's single report, so the count stays exactly one per pair.
// ---------------------------------------------------------------------------------------------
console.log("[cls-01] exhaustive -- every step-1 procedure independently routes every corpus case");

for (const surface of STEP1_SURFACES) {
  for (const kase of CASES) {
    const verdict = routesCase(parsed.get(surface.id).branches, kase);

    report(
      verdict.ok,
      `[cls-01] exhaustive -- ${surface.id} routes ${kase.id}`,
      verdict.ok
        ? `${verdict.why}${verdict.via.length ? ` via #${verdict.via.join(", #")}` : ""}`
        : `${verdict.why}; tokens [${kase.matchTokens.join(" | ")}]`
    );
  }
}

console.log("");

// ---------------------------------------------------------------------------------------------
// [cls-01] NON-STEP-1 router surfaces -- correctness over what each surface actually CLAIMS.
//
// THE HOLE THIS CLOSES. The assertion above quantifies over STEP1_SURFACES, i.e. the three lettered
// coach procedures. Five of the eight router surfaces were therefore reached only by the scan floor,
// the catch-all check and the single-axis check -- none of which reads a destination. Flipping a
// routing destination in any of them was undetected, which matters because each step-1 procedure
// DELEGATES to its narrative ("See ... above; do not restate it"), making the narrative the
// authoritative text a reader lands on.
//
// WHY THIS IS A COVERED-ONLY CLAIM, and why that is not a weakening. MEASURED FIRST, all 8 routers x
// all 9 cases (45 free-surface pairs), BEFORE any assertion changed: 18 pairs fail, and every single
// failure is `no branch on this surface routes it to X` where the case's ask-words are ABSENT from
// the whole surface -- zero failures are a wrong destination. These five are PROSE, and a narrative
// legitimately does not restate every case the lettered procedure enumerates: the three narratives
// carry c3/c4/c5/c6, laws-classify and beck-seam add c1. So demanding all nine here would encode a
// false claim about what the prose says and would pressure someone to weaken routesCase to make it
// pass. Asserting what the surface DOES claim keeps routesCase untouched at full strength.
//
// The residual case is asserted on every surface regardless of coverage, because a NONE verdict is
// decided by the explicit no-owner marker rather than by ask-words, so it is meaningful everywhere.
//
// ANTI-VACUITY IS MANDATORY HERE. A covered-only assertion is trivially escaped by DELETING the
// ask-words -- the guard-that-cannot-fail shape this gate exists to prevent. So the measured coverage
// SET is pinned as a floor below. Without that floor this section would be worse than no section.
// ---------------------------------------------------------------------------------------------
console.log("[cls-01] non-step-1 routers -- every case a surface CLAIMS, it routes correctly");

const FREE_ROUTERS = ROUTER_SURFACES.filter((s) => !STEP1_SURFACES.includes(s));

// MEASURED on the tracked tree 2026-08-04. Recorded as SETS rather than counts so that swapping
// which cases a surface covers fails too, not only losing one. A surface may cover MORE than its
// floor (a legitimate widening); it may never cover less.
const COVERAGE_FLOOR = Object.freeze({
  "refactor-narrative": ["c3", "c4", "c5", "c6"],
  "red-narrative": ["c3", "c4", "c5", "c6"],
  "tpp-narrative": ["c3", "c4", "c5", "c6"],
  "laws-classify": ["c1", "c3", "c4", "c5", "c6"],
  "beck-seam": ["c1", "c3", "c4", "c5", "c6"],
});

for (const surface of FREE_ROUTERS) {
  const branches = parsed.get(surface.id).branches;
  const covered = CASES.filter((k) => branches.some((b) => covers(b, k))).map((k) => k.id);
  const floor = COVERAGE_FLOOR[surface.id] ?? [];
  const missing = floor.filter((id) => !covered.includes(id));

  report(
    missing.length === 0,
    `[cls-01] coverage floor -- ${surface.id} still claims its measured cases`,
    missing.length === 0
      ? `covers [${covered.join(", ")}] (floor [${floor.join(", ")}])`
      : `ask-words for [${missing.join(", ")}] have gone MISSING from this surface, which would silently exempt them from the routing assertion below`
  );

  for (const kase of CASES) {
    const claimsIt = kase.expectedOwner === "NONE" || branches.some((b) => covers(b, kase));

    if (!claimsIt) {
      continue;
    }

    const verdict = routesCase(branches, kase);

    report(
      verdict.ok,
      `[cls-01] non-step-1 router -- ${surface.id} routes ${kase.id}`,
      verdict.ok
        ? `${verdict.why}${verdict.via.length ? ` via #${verdict.via.join(", #")}` : ""}`
        : `${verdict.why}; tokens [${kase.matchTokens.join(" | ")}]`
    );
  }
}

console.log("");

// ---------------------------------------------------------------------------------------------
// [cls-03] mode gates -- ADMISSION, not merely single-axis.
//
// Mode gates were reached by exactly one assertion, keysOnTestState, so nothing checked WHAT a gate
// admits. Measured before this section existed: tpp-modes admitted 0 of the 9 corpus asks including
// c6, the one case it owns; red-modes admitted 0 while owning c2/c3/c4/c8; refactor-modes admitted
// only c7 of its c1/c5/c7. A gate narrower than its own skill's ownership is a live defect, because
// the gate runs BEFORE step 1 -- lz-tpp step 2 says "Once branch (b) has settled this as the green
// step", so step 1 is what settles ownership and it only runs on a request the gate admitted. A gate
// that declines first makes its own step 1's route-away branches unreachable.
//
// SETTLED SEMANTICS (owner decision): the gate decides coach versus reference ONLY; ownership is
// step 1's job. So each gate is held to two things -- it admits every case its own skill owns, and it
// DELEGATES the rest to step 1 rather than declining them itself. It is deliberately NOT required to
// enumerate all nine asks: three gates each restating the full corpus would duplicate step 1 and
// bloat three shipped sections, and the delegation sentence is what carries the other cases.
//
// The coach clause is read ALONE, never the whole section. Pooling would let a token sitting in the
// reference-mode bullet satisfy a coach-mode admission claim -- the vacuity shape this file keeps
// finding.
// ---------------------------------------------------------------------------------------------
console.log("[cls-03] mode gates -- each admits what its own skill owns and delegates the rest");

// ALLOWLIST, and it fails CLOSED like the intro two-hop claim family: rewording the delegation turns
// the gate RED until the new wording is listed.
const DELEGATION_PHRASES = Object.freeze([
  "step 1 classifies the ask",
  "step 1 classifies the request",
  "step 1 decides which skill owns",
]);

const MODE_GATES = ROUTING_SURFACES.filter((s) => s.kind === "mode-gate");

for (const surface of MODE_GATES) {
  const body = sectionBody(readOrEmpty(path.join(repoRoot, surface.file)), surface.heading);

  if (body === null) {
    report(false, `[cls-03] mode gate admission -- ${surface.id}`, `heading "## ${surface.heading}" absent`);
    continue;
  }

  // The coach bullet only: from `- Coach mode:` up to the `- Reference mode:` bullet.
  const coachRaw = body.split(/^-\s+Reference mode:/m)[0] ?? "";
  const coach = flatten(coachRaw.replace(/^-\s+Coach mode:/m, ""));
  const ownedCases = CASES.filter((k) => k.expectedOwner === surface.owner);

  // AFFIRMED, not merely PRESENT. This used `covers()`, which is a bare substring test, and a review
  // defeated the whole assertion with it: inverting the clause ("a target carrying no tests is NEVER
  // coach mode -- decline it here") keeps every ask-word, so admission still read as satisfied while
  // the gate now excluded the very case its own step 5 handles. Narrowing a clause deletes tokens and
  // WAS caught; negating one keeps them. A guard that cannot tell an assertion from its inversion is
  // measuring vocabulary, not meaning.
  //
  // The delegation phrase runs through the same pass for the same reason -- "step 1 classifies the
  // ask" is equally invertible.
  const admits = (kase) =>
    affirmedPhrasesIn(coach, kase.matchTokens).length ===
    kase.matchTokens.filter((t) => typeof t === "string" && t.trim() !== "").length;
  const notAdmitted = ownedCases.filter((k) => !admits(k)).map((k) => k.id);
  const delegates = affirmedPhrasesIn(coach, DELEGATION_PHRASES);
  const reasons = [];

  // Anti-vacuity: an empty or near-empty coach clause would admit nothing and fail below, but a
  // MISSING bullet would make `coach` empty and the owned-case list is never empty, so the failure is
  // attributable either way. The explicit floor keeps the reason readable.
  if (coach === "") {
    reasons.push("no `- Coach mode:` bullet found in this section");
  }

  if (ownedCases.length === 0) {
    reasons.push(`no corpus case is owned by ${surface.owner}, so this assertion would be vacuous`);
  }

  if (notAdmitted.length > 0) {
    reasons.push(
      `coach clause does not admit [${notAdmitted.join(", ")}], which ${surface.owner} OWNS -- the gate runs before step 1, so an ask it excludes never reaches the routing branches`
    );
  }

  if (delegates.length === 0) {
    reasons.push(
      `coach clause does not DELEGATE classification to step 1; expected one of [${DELEGATION_PHRASES.join(" | ")}]`
    );
  }

  report(
    reasons.length === 0,
    `[cls-03] mode gate admission -- ${surface.id} admits ${surface.owner}'s own cases and delegates`,
    reasons.length === 0
      ? `admits [${ownedCases.map((k) => k.id).join(", ")}] and delegates via "${delegates.join('", "')}"`
      : reasons.join("; ")
  );
}

console.log("");

// ---------------------------------------------------------------------------------------------
// [cls-01] no bare catch-all terminal -- the shape D-01 removes.
// ---------------------------------------------------------------------------------------------
console.log("[cls-01] no bare catch-all terminal -- no router keeps an otherwise-is-this-skill branch");

for (const surface of ROUTER_SURFACES) {
  const offenders = parsed.get(surface.id).branches.filter((b) => b.isBareCatchAll);

  report(
    offenders.length === 0,
    `[cls-01] no bare catch-all terminal -- ${surface.id}`,
    offenders.length === 0
      ? ""
      : `bare residual condition without the explicit no-owner marker at ${offenders.map((b) => `#${b.branchId}`).join(", ")}`
  );
}

console.log("");

// ---------------------------------------------------------------------------------------------
// [cls-02] at-most-one -- no case is claimed for ITSELF by two step-1 procedures.
// ---------------------------------------------------------------------------------------------
console.log("[cls-02] at-most-one -- no case is self-claimed by two step-1 procedures");

for (const kase of CASES) {
  const claimants = STEP1_SURFACES.filter((surface) =>
    parsed
      .get(surface.id)
      .branches.some((b) => covers(b, kase) && b.destinations[0] === surface.owner)
  ).map((s) => s.id);

  // A NONE case must be claimed by ZERO procedures, not at-most-one. With the at-most-one bound this
  // check PRINTED `[PASS] ... claimed by refactor-step1` for the residual case under the capture
  // evasion -- a line asserting the capture was fine, for a case whose whole point is that no skill
  // owns it. [cls-01] catches the capture, but a reader triaging that run should not meet a PASS
  // saying otherwise.
  const residualCase = kase.expectedOwner === "NONE";
  const bound = residualCase ? 0 : 1;
  const ok = claimants.length <= bound;

  report(
    ok,
    residualCase
      ? `[cls-02] at-most-one -- ${kase.id} (no-owner case) claimed by NO step-1 procedure`
      : `[cls-02] at-most-one -- ${kase.id} claimed by at most one step-1 procedure`,
    ok
      ? claimants.length === 1
        ? `claimed by ${claimants[0]}`
        : "claimed by no procedure for itself"
      : residualCase
        ? `a no-owner case must be claimed by nobody, but ${claimants.length} procedure(s) claim it for themselves: ${claimants.join(", ")}`
        : `claimed for itself by ${claimants.length} procedures: ${claimants.join(", ")}`
  );
}

console.log("");

// ---------------------------------------------------------------------------------------------
// [cls-03] single-axis -- routers AND mode-selection gates alike (D-03).
//
// A surface whose parse failed has zero branches, so this check -- and the catch-all check above --
// pass for it vacuously. That is deliberate and not a hole: the scan floor is the ONE assertion that
// reports unconditionally per surface every run, so a broken read already produces exactly one
// attributable failure there. Re-reporting the same broken read under two more labels would triple
// the noise and obscure WHICH surface is broken. The consequence to keep in mind when reading a
// delta: taking a surface file away can leave the total failure COUNT flat, because the new
// scan-floor failure arrives as this surface's branch-level failures go vacuous. Read the label set,
// not the count.
// ---------------------------------------------------------------------------------------------
console.log("[cls-03] single-axis -- no branch keys on test state");

for (const surface of ROUTING_SURFACES) {
  const offenders = parsed.get(surface.id).branches.filter((b) => b.keysOnTestState.length > 0);

  report(
    offenders.length === 0,
    `[cls-03] single-axis -- ${surface.id} has no test-state-keyed branch`,
    offenders.length === 0
      ? `${parsed.get(surface.id).branches.length} branch(es) key on the ask only`
      : offenders
          .map((b) => `#${b.branchId} keys on [${b.keysOnTestState.join(" | ")}]`)
          .join("; ")
  );
}

console.log("");

// ---------------------------------------------------------------------------------------------
// Same-file citation checks on lz-refactor/SKILL.md (D-03's third site and D-07's anchor).
// ---------------------------------------------------------------------------------------------
console.log("[cls-03] citations resolve inside lz-refactor/SKILL.md");

const refactorText = readOrEmpty(LZ_REFACTOR_SKILL);
const sweepBody = sectionBody(refactorText, SWEEP_HEADING);
const refactorStep1 = parsed.get("refactor-step1");
const behaviorChangeDestinations = new Set();

for (const branch of refactorStep1.branches) {
  if (affirmsBehaviorChangeAsk(branch.conditionText)) {
    for (const name of branch.destinations) {
      behaviorChangeDestinations.add(name);
    }
  }
}

// ANTI-TAUTOLOGY CONTROL. If every slug is a behavior-change destination then `unresolved` is empty
// for any citation whatsoever and the check below cannot fail -- the guard-that-cannot-fail class.
// This is reported as its own assertion rather than folded in, so the degeneration is named rather
// than inferred from a suspiciously cheerful pass.
report(
  behaviorChangeDestinations.size > 0 && behaviorChangeDestinations.size < SKILLS.length,
  "[cls-03] sweep-rule citation is DISCRIMINATING",
  behaviorChangeDestinations.size === 0
    ? "no step-1 branch affirms a behavior-change ask, so the citation check has nothing to resolve against"
    : behaviorChangeDestinations.size >= SKILLS.length
      ? `all ${SKILLS.length} slugs are behavior-change destinations {${[...behaviorChangeDestinations].join(", ")}}, so the citation check below cannot fail -- it has degenerated into "some sentence contains a (step 1) citation"`
      : `behaviour-change destinations {${[...behaviorChangeDestinations].join(", ")}} is a strict subset of the ${SKILLS.length} slugs, so a wrong citation can still fail`
);

if (sweepBody === null) {
  report(false, "[cls-03] sweep-rule citation resolves", `heading absent -- no "## ${SWEEP_HEADING}" section`);
} else {
  const citing = flatten(sweepBody)
    .split(/(?<=[.!?])\s+/)
    .filter((s) => STEP1_CITATION_RE.test(s));
  const cited = new Set();

  for (const sentence of citing) {
    for (const name of destinationsIn(sentence)) {
      cited.add(name);
    }
  }

  const unresolved = [...cited].filter((name) => !behaviorChangeDestinations.has(name));

  report(
    citing.length > 0 && unresolved.length === 0,
    "[cls-03] sweep-rule citation resolves",
    citing.length === 0
      ? `no sweep sentence carries a "(step 1)" citation, so the rule it cites cannot be checked`
      : unresolved.length === 0
        ? `cites [${[...cited].join(", ")}], each a step-1 behavior-change destination`
        : `cites [${unresolved.join(", ")}], which step 1 does not route a behavior-change ask to`
  );

  // PER-ASK resolution, which set membership cannot give. The check above asks only "is each cited
  // slug SOME behavior-change destination", so SWAPPING two slugs that are both in the set passes --
  // measured: rewriting the rule to "a make-a-failing-test-pass ask to lz-red, an add-a-new-behavior
  // ask to lz-tpp" left it GREEN, because {lz-red, lz-tpp} is exactly the set either way. A citation
  // that names the right skills against the wrong asks is precisely the dead end this phase exists to
  // remove, so the pairing is what has to resolve.
  //
  // Ask phrases are matched with `[-\s]+` between words because the sweep rule hyphenates
  // ("make-a-failing-test-pass") while step-1 conditions space them ("make a failing test pass").
  // Normalising hyphens globally instead would corrupt the slugs, which contain one.
  const askRouting = new Map();

  for (const branch of refactorStep1.branches) {
    if (!affirmsBehaviorChangeAsk(branch.conditionText) || branch.destinations.length === 0) {
      continue;
    }

    for (const token of BEHAVIOR_CHANGE_ASK_TOKENS) {
      const loose = new RegExp(token.split(/\s+/).join("[-\\s]+"), "i");

      if (loose.test(branch.conditionText) && !askRouting.has(token)) {
        askRouting.set(token, branch.destinations[0]);
      }
    }
  }

  const SLUG_RE = /\blz-(?:red|tpp|refactor)\b/i;
  const mispaired = [];
  let pairsChecked = 0;

  for (const sentence of citing) {
    for (const [token, expected] of askRouting) {
      const loose = new RegExp(token.split(/\s+/).join("[-\\s]+"), "i");
      const m = loose.exec(sentence);

      if (m === null) {
        continue;
      }

      const after = sentence.slice(m.index + m[0].length);
      const slug = SLUG_RE.exec(after);

      if (slug === null) {
        continue;
      }

      pairsChecked++;

      if (slug[0].toLowerCase() !== expected) {
        mispaired.push(`"${token}" -> ${slug[0].toLowerCase()} but step 1 routes it to ${expected}`);
      }
    }
  }

  report(
    pairsChecked > 0 && mispaired.length === 0,
    "[cls-03] sweep-rule citation PAIRS each ask with the skill step 1 routes it to",
    pairsChecked === 0
      ? "no ask-to-skill pairing found in the citing sentence(s), so the pairing cannot be checked -- set membership alone would let a swap pass"
      : mispaired.length === 0
        ? `${pairsChecked} ask-to-skill pairing(s) resolve against step 1`
        : `${mispaired.length} mispaired: ${mispaired.join("; ")}`
  );
}

const anchorBody = sectionBody(refactorText, ANCHOR_HEADING);
const procedureBody = sectionBody(refactorText, PROCEDURE_HEADING);
// Section-scoped rather than item-4-scoped on purpose: the pointer lives in step 4 today, and moving
// it to another step of the SAME procedure is not the defect this closes (a dangling cross-reference
// is). The anchor heading itself sits OUTSIDE this section body -- sectionBody stops at the next
// `## ` -- so the prose mention cannot be satisfied by the heading it points at.
const pointerNamesAnchor = procedureBody !== null && flatten(procedureBody).includes(ANCHOR_HEADING);
const anchorReasons = [];

if (anchorBody === null) {
  anchorReasons.push(`no "## ${ANCHOR_HEADING}" heading in lz-refactor/SKILL.md`);
}

if (!pointerNamesAnchor) {
  anchorReasons.push(`the coach procedure's prose pointer does not name "${ANCHOR_HEADING}" verbatim`);
}

report(
  anchorReasons.length === 0,
  "[cls-03] QUESTION/COMMAND anchor resolves",
  anchorReasons.length === 0 ? "heading present and named verbatim by the procedure" : anchorReasons.join("; ")
);

console.log("");

// ---------------------------------------------------------------------------------------------
// [cls-03] intro prose -- the blind spot ABOVE the first `## ` heading. See the SECOND COVERAGE
// BOUNDARY note in the header for why this exists. Two checks: single-axis over every skill's intro
// (extends D-03 to the blind spot), and the two-hop ORDER on lz-refactor's intro specifically (the
// exact surface the phase's BLOCKER lived on). This does not require every intro to name both
// siblings -- lz-tpp's does not, and that omission is already ruled non-blocking.
// ---------------------------------------------------------------------------------------------
console.log("[cls-03] intro prose -- the blind spot above the first heading");

for (const skill of SKILLS) {
  const text = readOrEmpty(path.join(repoRoot, "plugins", "lz-tdd", "skills", skill, "SKILL.md"));
  const intro = introBody(text);

  if (intro === null) {
    report(false, `[cls-03] intro single-axis -- ${skill}`, "no H1 heading found; intro is unreachable");
    continue;
  }

  const offenders = keysOnTestState(flatten(intro));

  report(
    offenders.length === 0,
    `[cls-03] intro single-axis -- ${skill}'s intro keys on the ask only`,
    offenders.length === 0 ? "no test-state token in the intro paragraph" : `keys on [${offenders.join(" | ")}]`
  );
}

console.log("");

// MENTION ORDER IS NOT A HOP, and for one release this check believed it was. It asserted only that
// lz-red is affirmed at a lower index than lz-tpp, so an intro naming them in that order while
// DENYING both hops passed: a review rewrote the sentence to "is this skill's own work start to
// finish: lz-red and lz-tpp cover the loop's other two beats, so continue here and change the code
// directly" and the gate stayed GREEN on an intro that had reversed D-02 outright. Order plus two
// names is satisfiable by prose that merely mentions the siblings while claiming the request.
//
// So the sentence that affirms lz-red must additionally CLAIM the first hop. Scoped to that sentence
// rather than to the whole intro, because a claim phrase elsewhere in the paragraph says nothing
// about the branch that names lz-red.
//
// This family is an ALLOWLIST, the inverse of the parser's three literal blocklists, and it FAILS
// CLOSED: rewording the claim turns the gate RED until the new wording is listed here. That is noise
// in the safe direction and it is the intended trade -- a missing entry costs a false failure, where
// a blocklist's missing entry costs a false pass. Seeded from the shipped wording plus its nearest
// neighbours.
const FIRST_HOP_CLAIM_PHRASES = Object.freeze([
  "opens the red step",
  "red step first",
  "starts in the red step",
  "starts with the red step",
  "goes to the red step first",
]);

const refactorIntro = introBody(refactorText);
const refactorIntroFlat = refactorIntro === null ? "" : flatten(refactorIntro);
const refactorIntroHops = destinationsIn(refactorIntroFlat);
const hopsOrdered =
  refactorIntroHops.includes("lz-red") &&
  refactorIntroHops.includes("lz-tpp") &&
  refactorIntroHops.indexOf("lz-red") < refactorIntroHops.indexOf("lz-tpp");

// The first sentence that AFFIRMS lz-red -- destinationsIn is negation-aware, so an exclusion
// clause naming lz-red does not select the sentence.
const redSentence =
  refactorIntroFlat
    .split(/(?<=[.!?])\s+/)
    .find((s) => destinationsIn(s).includes("lz-red")) ?? "";
const claimed = FIRST_HOP_CLAIM_PHRASES.filter((p) => redSentence.toLowerCase().includes(p));
const twoHopOk = refactorIntro !== null && hopsOrdered && claimed.length > 0;

report(
  twoHopOk,
  "[cls-03] intro two-hop rule -- lz-refactor's intro routes the first hop to lz-red before lz-tpp",
  refactorIntro === null
    ? "intro unreachable -- no H1 heading found in lz-refactor/SKILL.md"
    : !hopsOrdered
      ? `hops [${refactorIntroHops.join(", ")}] -- expected lz-red before lz-tpp`
      : claimed.length > 0
        ? `hops [${refactorIntroHops.join(", ")}] claimed via "${claimed.join('", "')}" -- D-02's two-hop rule (the surface the phase's BLOCKER lived on)`
        : `hops [${refactorIntroHops.join(", ")}] are named in order but the sentence affirming lz-red CLAIMS no first hop -- mention order is not a hop; expected one of [${FIRST_HOP_CLAIM_PHRASES.join(" | ")}]`
);

console.log("");

// ---------------------------------------------------------------------------------------------
// [cls-03] step-1 lead-in -- the blind spot BEFORE the first lettered branch.
//
// A THIRD coverage boundary, the same shape as the intro-prose one above. `letteredChunks` splits
// item 1 on `a.` / `b.` / ... and its loop starts at index 1, so the prose BEFORE `a.` is discarded
// and was answerable to nothing. An unprimed review found the LITERAL banned token
// `all prior tests green` living exactly there, in lz-tpp step 1, one sentence after the same step
// forbids routing on suite state -- and the TEST_STATE_TOKENS seed comment had already NAMED that
// site as a source, so the token was listed for a location the parser could never reach.
//
// Closing the intro-prose hole did not close this one: there the blind region is above the first
// `## ` heading, here it is before the first lettered branch. Asserted as its own surface rather
// than as an extra branch, because the exhaustiveness / at-most-one / bare-catch-all assertions all
// judge routing BRANCHES and a lead-in is not one.
// ---------------------------------------------------------------------------------------------
console.log("[cls-03] step-1 lead-in -- the blind spot before the first lettered branch");

for (const surface of STEP1_SURFACES) {
  const abs = path.join(repoRoot, ...surface.file.split("/"));
  const leadIn = step1LeadIn(fileCache.has(abs) ? fileCache.get(abs) : readOrEmpty(abs), surface.heading);

  if (leadIn === null) {
    report(
      false,
      `[cls-03] step-1 lead-in single-axis -- ${surface.id}`,
      `lead-in unreachable -- no "## ${surface.heading}" section or no numbered item 1 in ${surface.file}`
    );
    continue;
  }

  const offenders = keysOnTestState(leadIn);

  report(
    offenders.length === 0,
    `[cls-03] step-1 lead-in single-axis -- ${surface.id}`,
    offenders.length === 0
      ? leadIn === ""
        ? "no lettered sub-items, so the whole item is one branch and already judged above"
        : "no test-state token in the lead-in prose"
      : `keys on [${offenders.join(" | ")}]`
  );
}

console.log("");

// ---------------------------------------------------------------------------------------------
// [cls-03] whole-section single-axis -- the UNFILTERED complement to the branch-level check.
//
// Why this exists, and why the branch-level check alone was not enough. Everything above judges the
// PARSED BRANCH LIST, which is narrowed three separate times before any assertion sees it:
//   1. `letteredChunks`/`numberedItem` keep only numbered item 1, so items 2..N are dropped;
//   2. `numberedItem` also drops the prose BETWEEN the heading and item 1;
//   3. the router/sentences filter drops any sentence naming neither a slug nor the residual.
// So a banned token could sit in a surface's section and be answerable to nothing, and an unprimed
// review demonstrated exactly that with three separate one-line insertions that each left the gate
// GREEN: a narrative sentence naming no slug, a later numbered step, and prose before item 1.
//
// This check takes the WHOLE section body, pre-filter and pre-chunking, flattens it and runs the
// same D-03 token set over it. It is deliberately COARSE: it cannot say which branch offended, and
// it does not replace the per-branch reports, which are what make a failure legible. It exists so
// that no region of a declared surface is outside every assertion.
//
// The lesson this encodes: the intro-prose hole, the lettered-lead-in hole and these three were the
// SAME defect found four times, each time one level out from the last, and each time by a human
// review rather than by this gate. Prefer a check quantified over a whole region to another check
// quantified over one more sub-region.
// ---------------------------------------------------------------------------------------------
console.log("[cls-03] whole-section single-axis -- no test-state token anywhere in a declared surface");

for (const surface of ROUTING_SURFACES) {
  const abs = path.join(repoRoot, ...surface.file.split("/"));
  const body = sectionBody(fileCache.has(abs) ? fileCache.get(abs) : readOrEmpty(abs), surface.heading);

  if (body === null) {
    report(
      false,
      `[cls-03] whole-section single-axis -- ${surface.id}`,
      `section unreachable -- no "## ${surface.heading}" line in ${surface.file}`
    );
    continue;
  }

  const offenders = keysOnTestState(flatten(body));

  report(
    offenders.length === 0,
    `[cls-03] whole-section single-axis -- ${surface.id}`,
    offenders.length === 0
      ? "no test-state token anywhere in the section, filtered or not"
      : `keys on [${offenders.join(" | ")}] somewhere in the section (may be outside any parsed branch)`
  );
}

console.log("");

// ---------------------------------------------------------------------------------------------
// [cls] description char cap -- D-06's rewording budget, ASSERTED rather than assumed.
// ---------------------------------------------------------------------------------------------
console.log(`[cls] description char cap -- each folded description within ${DESCRIPTION_CHAR_CAP} chars`);

for (const skill of SKILLS) {
  const text = readOrEmpty(path.join(repoRoot, "plugins", "lz-tdd", "skills", skill, "SKILL.md"));
  const folded = foldedDescription(text);

  if (folded === null) {
    report(false, `[cls] description char cap -- ${skill}`, "no folded description block found");
    continue;
  }

  // ANTI-VACUITY FLOOR, and it is load-bearing. An unprimed review made the fold return "" by
  // inserting one blank line after `description: >-`, and this check then reported
  // "0 chars, 1536 of headroom" as a PASS for a fully intact description. A cap check that passes
  // most enthusiastically when it can see nothing is the vacuous-guard class this file refuses. The
  // fold itself is fixed to consume the whole block scalar; this floor is the belt to that braces,
  // because the failure mode is silent and the direction of the bug always looks like headroom.
  if (folded.length < DESCRIPTION_MIN_CHARS) {
    report(
      false,
      `[cls] description char cap -- ${skill}`,
      `folded to only ${folded.length} chars, below the ${DESCRIPTION_MIN_CHARS}-char plausibility floor -- the fold is truncating, so the cap measurement is not trustworthy`
    );
    continue;
  }

  report(
    folded.length <= DESCRIPTION_CHAR_CAP,
    `[cls] description char cap -- ${skill}`,
    `${folded.length} chars, ${DESCRIPTION_CHAR_CAP - folded.length} of headroom`
  );
}

console.log("");

// ---------------------------------------------------------------------------------------------
// [cls-03] description single-axis -- the same D-03 test-state axis applied to the frontmatter
// tier. keysOnTestState and foldedDescription have been exported since Wave 0, but until this check
// they were only ever driven by a throwaway scratch script (22-08-PLAN.md's own instruction: "Write
// a throwaway script OUTSIDE the repo... never a tracked path") -- never wired into an executable
// gate. The folded description is the one surface every caller sees before any body text loads, so a
// test-state phrase here is a direct D-03 violation regardless of what the body says.
// ---------------------------------------------------------------------------------------------
console.log("[cls-03] description single-axis -- no folded description keys on test state");

for (const skill of SKILLS) {
  const text = readOrEmpty(path.join(repoRoot, "plugins", "lz-tdd", "skills", skill, "SKILL.md"));
  const folded = foldedDescription(text);

  if (folded === null) {
    report(false, `[cls-03] description single-axis -- ${skill}`, "no folded description block found");
    continue;
  }

  // Same anti-vacuity floor as the cap check, and for the same measured reason: an emptied fold
  // reported `banned=[]` for a description that carried a literal banned token. "I found no banned
  // token" is only meaningful over text the scan could actually see.
  if (folded.length < DESCRIPTION_MIN_CHARS) {
    report(
      false,
      `[cls-03] description single-axis -- ${skill}`,
      `folded to only ${folded.length} chars, below the ${DESCRIPTION_MIN_CHARS}-char plausibility floor -- banned=[] over a truncated fold proves nothing`
    );
    continue;
  }

  const offenders = keysOnTestState(folded);

  report(
    offenders.length === 0,
    `[cls-03] description single-axis -- ${skill}`,
    offenders.length === 0 ? `banned=[] over ${folded.length} folded chars` : `keys on [${offenders.join(" | ")}]`
  );
}

console.log("");

if (failures === 0) {
  console.log(
    `SUMMARY: RGR-ROUTING GREEN -- ${CASES.length} corpus cases exhaustive and at-most-one over ${STEP1_SURFACES.length} step-1 procedures, no bare catch-all terminal, no test-state key in any of ${ROUTING_SURFACES.length} surfaces, in any intro paragraph, or in any of ${STEP1_SURFACES.length} step-1 lead-ins, citations resolve, descriptions within the ${DESCRIPTION_CHAR_CAP}-char cap and single-axis`
  );
  process.exit(0);
}

console.log(`SUMMARY: RGR-ROUTING RED -- ${failures} hard failure(s)`);
process.exit(1);
