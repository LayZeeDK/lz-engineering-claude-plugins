#!/usr/bin/env node
// ---------------------------------------------------------------------------------------------
// check-rgr-routing.evasions.mjs -- the routing gate's ADVERSARIAL suite.
//
// WHAT THIS IS. Every entry below is a MEASURED evasion of `check-rgr-routing.mjs`: a concrete edit
// to a tracked file that introduces the defect one of the gate's headline claims names. Each was found
// by a human review reading the files, never by the gate. This file applies each one, runs the real
// gate, and asserts the expected outcome.
//
// WHY IT EXISTS, and it is the point of the whole file. These reproductions previously lived as PROSE
// in `.planning/quick/*/`-deferred-items files, plus throwaway scratch scripts that were deleted. That
// made "OPEN-3 is closed" an author's claim rather than a runnable fact -- and in this project the
// author has been wrong every single time: three consecutive patching rounds each shipped a fresh
// defect (two false comment claims, and a double-space bug inside a fold repair), each caught by a
// plan-checker, an unprimed reviewer, or a selftest leg. Never by the person writing it.
//
// So the acceptance criteria are executable now. A guard is "closed" when its line here flips from
// EVADED to CAUGHT, and it STAYS closed because this runs in the normal battery.
//
// SIX HARD RULES, each learned from a specific failure in this repo. Do not relax any of them.
//   1. ASSERT THE MUTATION LANDED before running the gate. A non-matching anchor is a BAD TEST and
//      FAILS -- it must never read as a pass. This fired twice in one session: a `sed` anchor that
//      spanned a ~100-column line wrap, and a fold-proof anchor for text that did not exist. Both
//      produced a GREEN gate that proved absolutely nothing.
//   2. RESTORE AND VERIFY BY CHECKSUM, in a `finally`, so a throw cannot leave a shipped file mutated.
//   3. ASSERT THE EXPECTED NAMED LABEL, not merely a non-zero exit. An insertion at the wrong site that
//      reddens some unrelated check would otherwise read as a pass.
//   4. NO PIPES when measuring an exit code -- a pipeline reports the LAST stage's status. This
//      produced a false "exit 0" reading for a command that exits 1.
//   5. REFUSE TO RUN if the baseline gate is not already GREEN. Every verdict below would be
//      meaningless against a red baseline.
//   6. A NON-CAUGHT ENTRY is recorded as `expect: null` and is EXPECTED to stay GREEN. That is an
//      honest record of a known-open hole, not a pass. Such entries are printed separately in the
//      summary so a reader cannot mistake the count of caught evasions for the count of entries.
//   7. NON-CAUGHT ENTRIES HAVE TWO KINDS AND MUST NOT SHARE A LABEL. This was the honest caveat the
//      2026-08-04 session recorded against itself: the summary called all twelve "evading by design",
//      which was true of three of them. A `ceiling` is UNCLOSABLE -- a literal blocklist whose axis
//      cannot be closed by construction (`unclosable: true`, an ALLOWLIST). Everything else is OPEN:
//      real work not yet done, printed as OPEN and counted apart. The allowlist fails in the safe
//      direction -- a new entry that forgets the flag reads OPEN, which is the louder verdict.
//   8. THE OPEN COUNT IS RATCHETED against EXPECTED_OPEN below. Any change in either direction exits
//      1: a RISE means a new evasion landed or a closed guard regressed; a FALL means an item was
//      closed and the constant was not updated, which would let the next rise hide inside the slack.
//      This is what stops the battery reading GREEN over unfinished work -- the property `npm run
//      check` was wired up for. It does NOT hard-red on open work, because that would block the
//      battery on items (F2) gated behind an unapproved metered round.
//
// ASCII only. No email-shaped token other than the project's approved public contact appears here, and
// no forbidden value is written even as a search needle -- the needle IS the leak.
// ---------------------------------------------------------------------------------------------
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "..", "..", "..", "..");
const GATE = path.join(here, "check-rgr-routing.mjs");

const abs = (rel) => path.join(repoRoot, ...rel.split("/"));
const sha = (p) => crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");

// Exit code measured directly from the child, never through a pipe (rule 4).
const runGate = () => {
  try {
    return { code: 0, out: execFileSync("node", [GATE], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }) };
  } catch (e) {
    return { code: typeof e.status === "number" ? e.status : 1, out: `${e.stdout || ""}${e.stderr || ""}` };
  }
};

const RED = "plugins/lz-tdd/skills/lz-red/SKILL.md";
const TPP = "plugins/lz-tdd/skills/lz-tpp/SKILL.md";
const REFACTOR = "plugins/lz-tdd/skills/lz-refactor/SKILL.md";
const BECK = "plugins/lz-tdd/references/beck-tdd-by-example.md";
const CORPUS = ".claude/skills/lz-red-workspace/tools/rgr-cases.json";

// THE RATCHET (rule 8). The number of OPEN entries expected at HEAD. Raise it only when a new open
// evasion is deliberately recorded; LOWER it in the same commit that closes one. Any drift exits 1.
// A rise is a regression or a newly found hole; a fall is a stale constant hiding future slack.
const EXPECTED_OPEN = 9;

// `find` may be a string (literal, safest) or a RegExp. `expect` is the substring that must appear in
// a FAIL line, or null for an entry the gate does not catch. A non-caught entry is OPEN work unless it
// carries `unclosable: true`, which marks the axis as closed by construction (rule 7).
const EVASIONS = [
  // -- closed: per-surface quantification -----------------------------------------------------
  {
    id: "E1",
    open: "closed",
    what: "delete lz-red's OWN branch (a) while its two siblings keep an identical one",
    claim: "[cls-01] exhaustive protects each skill's own classifier",
    file: RED,
    find: /^ {3}a\. Asking which test to write next[^\n]*\n(?: {6}[^\n]*\n)*/m,
    repl: "",
    expect: "exhaustive -- red-step1 routes",
  },
  {
    id: "E2",
    open: "closed",
    what: "rewrite lz-refactor's terminal as a self-claiming catch-all in the HOUSE vocabulary",
    claim: "[cls-01] no bare catch-all terminal",
    file: REFACTOR,
    find: /^ {3}e\. None of \(a\) through \(d\)[^\n]*\n(?: {6}[^\n]*\n)*/m,
    repl:
      "   e. None of (a) through (d): the request stays here anyway, and that is lz-refactor.\n" +
      "      Take it and answer it.\n",
    expect: "no bare catch-all terminal -- refactor-step1",
  },
  {
    id: "E7",
    open: "closed",
    what: "add an f. branch capturing the no-owner case c9 for lz-refactor",
    claim: "a NONE case reaches the residual and is claimed by nobody",
    file: REFACTOR,
    find: /^( {3}e\. None of \(a\) through \(d\))/m,
    repl:
      "   f. Asking the best way to structure a CLI's argument parsing, or any other design question:\n" +
      "      that is this skill's work, and this skill is lz-refactor.\n$1",
    expect: "exhaustive -- refactor-step1 routes c9",
  },

  // -- closed: the four regions outside the parsed branch list ---------------------------------
  {
    id: "E3",
    open: "closed",
    what: "narrative sentence naming NO slug, carrying a literal banned token (dropped by the sentence filter)",
    claim: "[cls-03] no test-state token in a declared surface",
    file: RED,
    find: "## RED vs the green step (lz-tpp) and the refactor step (lz-refactor)\n",
    repl:
      "## RED vs the green step (lz-tpp) and the refactor step (lz-refactor)\n\n" +
      "When the tests are green, route the request onward instead.\n",
    expect: "whole-section single-axis -- red-narrative",
  },
  {
    id: "E4",
    open: "closed",
    what: "a LATER numbered step (outside item 1) carrying a banned token",
    claim: "[cls-03] no test-state token in a declared surface",
    file: RED,
    find: "3. Detect the house test idiom, then route the stance.",
    repl: "3. Detect the house test idiom, then route the stance. Skip this when the tests already pass.",
    expect: "whole-section single-axis -- red-step1",
  },
  {
    id: "E6",
    open: "closed",
    what: "prose BETWEEN the `## ` heading and item 1, which numberedItem discards",
    claim: "[cls-03] no test-state token in a declared surface",
    file: RED,
    find: "Run these steps in order on a coach-mode request.",
    repl: "Run these steps in order on a coach-mode request, but only once the tests are green.",
    expect: "whole-section single-axis -- red-step1",
  },
  {
    id: "M6",
    // Was labelled "closed" while its own ceiling text tracks it as OPEN-8c -- harmless while every
    // non-caught entry printed the same CEILING label, actively misleading now that the line reads
    // `[OPEN    ] M6 (closed)`. The tracking id is the one its ceiling text names.
    open: "OPEN-8c",
    what: "literal banned token in a `## ` section that is NOT a declared surface (lz-tpp Transformations vs refactorings)",
    claim: "no test-state framing anywhere -- NOTE: this section is outside ROUTING_SURFACES by design",
    file: TPP,
    find: "## Transformations vs refactorings\n",
    repl:
      "## Transformations vs refactorings\n\n" +
      "Once the tests are green, treat every candidate change as a refactoring and stop ranking here.\n",
    expect: null,
    ceiling:
      "UNANCHORED SECTION. Only ROUTING_SURFACES entries are scanned. Tracked as OPEN-8c: the residual " +
      "inventory of `## ` sections no surface anchors to.",
  },

  // -- closed: the folded-description vacuity --------------------------------------------------
  {
    id: "M17",
    open: "closed",
    what: "blank line right after `description: >-` -- the fold used to return \"\" and the gate reported 0 chars / 1536 headroom / banned=[]",
    claim: "[cls] description char cap and [cls-03] description single-axis",
    file: REFACTOR,
    find: "description: >-\n",
    repl: "description: >-\n\n  Reach for it once the tests are green and the code has a smell.\n",
    expect: "description",
  },
  {
    id: "M1",
    open: "closed",
    what: "blank line MID-block -- the fold used to return a prefix and report headroom for a value over the cap",
    claim: "[cls] description char cap",
    file: REFACTOR,
    find: "  Do NOT use it to ADD or CHANGE behavior",
    repl:
      "\n  Reach for it as soon as the tests are green and the code has a smell, which is exactly when\n" +
      "  this skill applies to the work in front of you and nothing else does.\n" +
      "  Do NOT use it to ADD or CHANGE behavior",
    expect: "description",
  },

  // -- OPEN: recorded, expected to EVADE until each is closed ----------------------------------
  {
    id: "M7b",
    open: "closed",
    what: "swap the sweep rule's cited destinations (both slugs stay in the set, so membership alone passes)",
    claim: "[cls-03] sweep-rule citation PAIRS each ask with the skill step 1 routes it to",
    file: REFACTOR,
    find: "sweep (step 1) -- a make-a-failing-test-pass ask to lz-tpp, an add-a-new-behavior ask to lz-red",
    repl: "sweep (step 1) -- a make-a-failing-test-pass ask to lz-red, an add-a-new-behavior ask to lz-tpp",
    expect: "sweep-rule citation",
  },
  {
    id: "M5",
    open: "OPEN-2",
    what: "flip a routing destination in a NARRATIVE surface (red-narrative), which step 1 delegates to",
    claim: "every router surface routes each case correctly",
    file: RED,
    find: "An ask to make a failing test pass is the green step: hand off to lz-tpp.",
    repl: "An ask to make a failing test pass is also the red step, and that step is lz-red.",
    expect: "red-narrative",
  },
  {
    id: "M14",
    open: "OPEN-2",
    what: "flip the green step in the plugin-wide seam (beck-seam)",
    claim: "every router surface routes each case correctly",
    file: BECK,
    // RE-ANCHORED. The old anchor was the bare "green step is lz-tpp", and `original.replace(string,
    // ...)` substitutes only the FIRST occurrence -- which is this file's own intro line ("the green
    // step is lz-tpp's"), 60-odd lines ABOVE the `## The seam across the three steps` heading and
    // therefore outside every parsed surface. So the mutation landed, the suite's landed-check passed,
    // and the entry proved nothing about the surface it names. A mutation must land in the REGION the
    // entry claims, not merely somewhere in the file; the landed-check cannot see the difference,
    // which is why this anchor now carries enough context to be unique to the seam sentence.
    // The region the old anchor hit is recorded separately as M14b.
    find: "green step is lz-tpp. An ask to add a new behavior",
    repl: "green step is lz-refactor. An ask to add a new behavior",
    expect: "beck-seam",
  },
  {
    id: "M14b",
    open: "OPEN-9",
    what: "flip the plugin-wide reference's INTRO seam claim (above its first `## ` heading)",
    claim: "no assertion reads the plugin-wide reference's intro prose",
    file: BECK,
    find: "The red step is lz-red's concern, the green step is lz-tpp's",
    repl: "The red step is lz-red's concern, the green step is lz-refactor's",
    expect: null,
    ceiling:
      "FOUND while re-anchoring M14, which had been hitting this line by accident. The intro " +
      "single-axis check runs over the three SKILL.md files only, and every ROUTING_SURFACES entry " +
      "anchors to a `## ` heading, so prose above the first heading of plugins/lz-tdd/references/ " +
      "is read by nothing -- the same shape as the SKILL.md intro hole Phase 22 closed, one file " +
      "further out. Tracked as OPEN-9; closing it means extending introBody's single-axis and " +
      "two-hop checks to the plugin-wide references. PARTIALLY addressed: the [cls-04] contradiction " +
      "sweep now READS this intro, but the entry still evades because the mutated sentence carries no " +
      "corpus ask-words, so covers() matches nothing. Same mechanism as OPEN-13.",
  },
  {
    id: "M4",
    open: "OPEN-3",
    what: "name a CONTRADICTING second destination after the correct first one",
    claim: "owns() validates the destination list, not just destinations[0]",
    file: TPP,
    find: "      is the green step, and the green step is lz-tpp.",
    repl:
      "      is the green step, and the green step is lz-tpp, so do not answer it here; hand the whole\n" +
      "      request over to lz-refactor and let it pick the change.",
    expect: "tpp-step1 routes c6",
  },
  {
    id: "M2",
    open: "OPEN-4",
    what: "declared residual that keeps BOTH marker halves AND self-claims in the house form",
    claim: "the declared residual terminal claims NOTHING",
    file: REFACTOR,
    find: "loop owns it. Say so plainly, answer the question directly, and claim nothing.",
    repl:
      "loop owns it. In practice almost every request that mentions code at all lands here, and\n" +
      "      when it does, answer it here as part of this skill's own work and continue here.",
    expect: "refactor-step1",
  },
  // -- Found by the unprimed attack review of 2026-08-04. Every anchor below is a SINGLE physical
  // line: three of this session's anchors silently straddled the ~100-column wrap, so multi-line
  // anchors are not used here at all. F1 is CLOSED; F2 through F7 are open and expected to evade.
  {
    id: "F1",
    open: "closed",
    what: "NEGATE a mode gate's coach clause instead of narrowing it -- every ask-word survives",
    claim: "[cls-03] mode gate admission reads what the clause SAYS, not which words appear in it",
    file: REFACTOR,
    find: "a target carrying no tests is still coach mode, not an",
    repl: "a target carrying no tests is never coach mode and is declined here, not an",
    expect: "refactor-modes",
  },
  {
    id: "F2",
    open: "OPEN-10",
    what: "invert every exclusion in the YAML description -- the surface the skill SELECTOR reads",
    claim: "a description's ownership claims are checked at all",
    file: TPP,
    find: "  changing what it does -- that is the refactor step; use lz-refactor instead. An ask to add a new",
    repl: "  changing what it does -- lz-refactor is a catalog lookup only, so never hand it any of that, and\n  the same goes for lz-red. An ask to add a new",
    expect: null,
    ceiling:
      "NOTHING checks a description's routing. The char-cap check measures length and the single-axis " +
      "check runs the test-state blocklist; ROUTING_SURFACES anchors exclusively to `## ` headings, so " +
      "frontmatter is outside the exhaustive / at-most-one / contradiction machinery by construction. " +
      "In production this is the surface that ACTUALLY routes -- it is read before any body text loads " +
      "-- which makes it the highest-value gap in the gate. Tracked as OPEN-10. Closing it means adding " +
      "frontmatter as a surface; note that a failing assertion there would force a description edit, " +
      "which is metered-round-gated, so MEASURE before asserting. STILL OPEN after the [cls-04] " +
      "contradiction sweep, which now READS this region -- and the measured reason is the point: this " +
      "attack REMOVES correct routing (it negates the exclusion) rather than adding wrong routing, so " +
      "destinationsIn returns [] for the edited sentence, the sentence is filtered out, and no " +
      "contradiction remains to find. Closing it needs the POSITIVE half, and a full router-style " +
      "assertion over descriptions FAILS on the shipped tree (lz-tpp carries c4's two-hop across a " +
      "sentence boundary, so its sentence names lz-red alone). A description-level COVERAGE FLOOR, " +
      "pinning what each description routes today, is the untried candidate that needs no edit.",
  },
  {
    id: "F3",
    open: "OPEN-11",
    what: "a self-claiming sentence on a sentence-parsed router, using LISTED claim phrases",
    claim: "SELF_CLAIM_PHRASES reaches self-claims anywhere, not only on the residual branch",
    file: RED,
    find: "lz-refactor. Anything outside those is not a red-green-refactor-loop request and no skill in this",
    repl:
      "lz-refactor. An ask to make a failing test pass is also structural once the test exists, so answer\nit here as part of this skill's own work instead of handing it along. Anything outside those is not a\nred-green-refactor-loop request and no skill in this",
    expect: null,
    ceiling:
      "STRUCTURAL bypass, not a vocabulary ceiling -- the inserted sentence uses TWO listed phrases " +
      "(\"answer it here\", \"this skill's\") and they are never evaluated. parseRoutingBranches DROPS any " +
      "router sentence with zero destinations that is not the residual, and a self-claim resolves to " +
      "zero literal slugs BY DESIGN, so the sentence is deleted before any check sees it. selfClaimsIn " +
      "is only ever reached through isDeclaredResidual, which is gated on isResidual. OPEN-4 closed the " +
      "residual-branch case only. Tracked as OPEN-11; closing it means keeping self-claiming sentences " +
      "as branches rather than filtering them. STILL OPEN after the [cls-04] contradiction sweep, for " +
      "the SAME root cause: a self-claim affirms no literal slug by design, so the sweep's sentence " +
      "filter drops it exactly as the routing parse does. Any fix has to stop filtering, not add " +
      "another reader.",
  },
  {
    id: "F4",
    open: "OPEN-12",
    what: "a step-1 branch claims asks the 9-case corpus does not sample",
    claim: "a branch may not claim work outside its own step",
    file: RED,
    find: "      name it, or whether this is a good test: that is the red step, and the red step is lz-red.",
    repl:
      "      name it, whether this is a good test, or asking to extract a method, rename a symbol, inline\n      a variable, or simplify a nested conditional in working code: that is the red step, and the red\n      step is lz-red.",
    expect: null,
    ceiling:
      "Four canonical Fowler refactorings routed to the RED step by branch (a), which beats branch (d) " +
      "under first-match-wins, so structural asks never reach lz-refactor -- and (a) now contradicts (d) " +
      "inside one procedure. Every assertion is quantified over CASES, and the added ask-words match no " +
      "case's matchTokens, so no assertion has a subject. COVERAGE_FLOOR pins coverage DOWNWARD only. " +
      "Tracked as OPEN-12: the corpus samples the classifier, it does not bound it.",
  },
  {
    id: "F5",
    open: "OPEN-13",
    what: "install a SECOND routing axis in the prose between the `## ` heading and item 1",
    claim: "[cls-03] whole-section single-axis covers the pre-item-1 region for more than test state",
    file: RED,
    find: "reference leaf that carries the detail; do not restate a leaf's content here.",
    repl:
      "reference leaf that carries the detail; do not restate a leaf's content here.\n\nBefore step 1, check the file kind. If the code the developer points at lives in a test file, the\nrequest is structural by definition and belongs to lz-refactor: hand it straight over without\nclassifying the ask at all. Only production files reach the branches below.",
    expect: null,
    ceiling:
      "Reverses c3 outright -- \"Is this a good test?\" goes to lz-refactor -- which is exactly the D-04 " +
      "error the c3/c5 pair exists to pin. numberedItem discards everything before item 1 and " +
      "step1LeadIn starts INSIDE item 1, so no branch-level assertion sees this region; the only check " +
      "reaching it runs keysOnTestState, so the region is closed for the TEST-STATE axis only and any " +
      "other second axis walks through. M11/OPEN-8c covers items 2..N, not this. Tracked as OPEN-13. " +
      "STILL OPEN after the [cls-04] contradiction sweep, which now reads this region: the mutation " +
      "reverses c3 SEMANTICALLY (\"lives in a test file\" -> lz-refactor) without containing c3's " +
      "ask-words (\"good test\"), so covers() matches no case and there is no contradiction to report. " +
      "Closing it needs a rule that this region may not route AT ALL, rather than a rule about what it " +
      "routes -- a second axis is defined by dispatching here, not by which case it names.",
  },
  {
    id: "F6",
    open: "OPEN-14",
    what: "collapse ownership in lz-red's INTRO prose, which carries no destination assertion",
    claim: "[cls-03] intro checks generalise across the three skills they loop over",
    file: RED,
    find: "sibling skill lz-tpp; restructuring working code without changing behavior is the refactor step",
    repl:
      "own work too, and so is restructuring working code without changing behavior; lz-tpp and\nlz-refactor are reference catalogs only, so never hand a request to either of them. The refactor step",
    expect: null,
    ceiling:
      "The only intro check that reads DESTINATIONS is the two-hop rule, and it is hard-scoped to " +
      "lz-refactor's text; the per-skill loop over SKILLS runs keysOnTestState alone. So M8b/OPEN-7 " +
      "closed the lz-refactor intro and the lz-red and lz-tpp intros still have no ownership assertion " +
      "-- a closure that did not generalise across the three files the loop already visits. Tracked as " +
      "OPEN-14, and it is the cheapest of this batch to close. STILL OPEN after the [cls-04] " +
      "contradiction sweep, which now reads all three intros: the mutation self-claims AND negates both " +
      "siblings, so the sentence affirms no destination and is filtered out. Same root cause as " +
      "OPEN-11, and the two should be closed together by one change to the filter.",
  },
  {
    id: "F7",
    open: "closed",
    what: "DELETE step 1's tie-break rules (first-match-wins, self-report-is-context, primary-ask)",
    claim: "[cls-04] the three tie-break rules are PRESENT, not merely free of test-state tokens",
    file: RED,
    find: "   Take the FIRST branch that matches:",
    repl: "   Take whichever of the branches below seems to apply:",
    expect: "tie-break rules",
  },
  {
    id: "M16",
    open: "OPEN-5",
    what: "a total catch-all in wording the literal family does not list",
    claim: "[cls-01] no bare catch-all terminal -- LITERAL BLOCKLIST ceiling",
    file: REFACTOR,
    find: /^( {3}e\. None of \(a\) through \(d\))/m,
    repl: "      In all remaining cases the refactor step takes the request, and that is lz-refactor.\n$1",
    expect: null,
    unclosable: true,
    ceiling:
      "CATCHALL_CONDITION_RE is a literal family blocklist, exactly like TEST_STATE_TOKENS. No unlisted " +
      "phrasing can be caught. Tracked as OPEN-5, deliberately unclosable.",
  },
  {
    id: "E5",
    open: "OPEN-5",
    what: "a NOVEL PARAPHRASE of test-state framing on a fully judged mode gate",
    claim: "[cls-03] single-axis -- LITERAL BLOCKLIST ceiling",
    file: REFACTOR,
    // RE-ANCHORED after the OPEN-6 mode-gate rewrite moved this bullet's opening words. The claim is
    // unchanged: plant an UNLISTED test-state paraphrase in a fully judged coach clause.
    find: "- Coach mode: the request asks for a move on code",
    repl: "- Coach mode: nothing in the suite is red, and the request asks for a move on code",
    expect: null,
    unclosable: true,
    ceiling:
      "TEST_STATE_TOKENS is a literal blocklist. This paraphrase is not a listed phrase. Tracked as " +
      "OPEN-5; the honest complements are the metered eval and human review.",
  },
  {
    id: "M2b",
    open: "OPEN-4",
    what: "a self-claiming residual worded OUTSIDE the listed claim vocabulary",
    claim: "the declared residual terminal claims NOTHING -- LITERAL BLOCKLIST ceiling",
    file: REFACTOR,
    find: "loop owns it. Say so plainly, answer the question directly, and claim nothing.",
    repl:
      "loop owns it. In practice almost every request that mentions code at all lands in this\n" +
      "      procedure, and when it does, take the request on directly as part of the refactoring\n" +
      "      brief rather than passing it along.",
    expect: null,
    unclosable: true,
    ceiling:
      "SELF_CLAIM_PHRASES is a literal family blocklist, the third in this parser alongside " +
      "TEST_STATE_TOKENS and CATCHALL_CONDITION_RE. OPEN-4 closes the DEMONSTRATED wording (M2), not " +
      "the axis: this paraphrase claims the request with no listed phrase and no literal slug. Read a " +
      "clean self-claim result as \"no LISTED claim wording is present\". Same family as OPEN-5 and " +
      "unclosable for the same reason.",
  },
  {
    id: "M12",
    open: "OPEN-6",
    what: "a `## Two modes` gate that admits work belonging to a sibling skill",
    claim: "a mode gate classifies what its own skill claims",
    file: RED,
    // RE-ANCHORED after the OPEN-6 rewrite. The claim is unchanged and now MEASURABLE rather than
    // merely recorded: narrow the coach clause back to a sibling's work so it no longer admits the
    // cases lz-red owns, which the new mode-gate admission assertion reads.
    // Anchored WITHIN one physical line: this file hard-wraps near 100 columns, and "most often"
    // straddles the wrap, so the obvious phrase-spanning anchor silently would not match.
    find: "  test to write next, how to shape or name it, whether this is a good test, or an ask to add a new",
    repl: "  refactoring the code now invites, or which minimal change makes a red test pass, or an ask to add a new",
    expect: "red-modes",
  },
  {
    id: "M8b",
    open: "OPEN-7",
    what: "an intro that MENTIONS lz-red before lz-tpp while DENYING both hops",
    claim: "[cls-03] intro two-hop rule",
    file: REFACTOR,
    find: "new behavior, or to change what working code does, opens the red step first in lz-red, because",
    repl:
      "new behavior, or to change what working code does, is this skill's own work start to finish:\n" +
      "lz-red and lz-tpp cover the loop's other two beats, so continue here and change the code directly,\n" +
      "because",
    expect: "intro two-hop",
  },
  {
    id: "M10",
    open: "OPEN-8b",
    what: "invert the QUESTION vs COMMAND section's guidance (its BODY is read by nothing)",
    claim: "[cls-03] QUESTION/COMMAND anchor resolves -- existence-only",
    file: REFACTOR,
    find: "## QUESTION vs COMMAND intent routing\n",
    repl:
      "## QUESTION vs COMMAND intent routing\n\n" +
      "Drive by default; ask only when stuck. Go ahead and edit the working code yourself and run the\n" +
      "suite, because a question is an invitation to improve the code in place.\n",
    expect: null,
    ceiling:
      "The check asserts the heading EXISTS and is named verbatim by the procedure. The section body is " +
      "read by no assertion. Tracked as OPEN-8b.",
  },
  {
    id: "M11",
    open: "OPEN-8c",
    what: "flip a hand-off destination in a LATER numbered step of a router surface",
    claim: "numbered items 2..N carry routing that nothing asserts",
    file: RED,
    find: "6. Hand off forward to lz-tpp.",
    repl: "6. Hand off forward to lz-refactor.",
    expect: null,
    ceiling:
      "letteredChunks/numberedItem keep item 1 only. Items 2..N reach only the coarse whole-section " +
      "token scan, which does not check destinations. Tracked as OPEN-8c/8e.",
  },
  {
    id: "M9",
    open: "OPEN-8d",
    what: "retire the D-02 ordered-pair assertion by editing ONE corpus word",
    claim: "the corpus's own shape is pinned",
    file: CORPUS,
    find: '"expectedSecondHop": "lz-tpp"',
    repl: '"expectedSecondHop": null',
    expect: "corpus",
  },
];

// ---------------------------------------------------------------------------------------------
const args = process.argv.slice(2);
const only = args.includes("--only") ? args[args.indexOf("--only") + 1] : null;
const listOnly = args.includes("--list");

// Rule 7 -- the three states. `unclosable` is an ALLOWLIST, so a new entry that forgets it reads OPEN.
const stateOf = (ev) => (ev.expect !== null ? "must-catch" : ev.unclosable ? "ceiling" : "open");

if (listOnly) {
  console.log("rgr-routing evasion suite -- recorded reproductions\n");

  for (const ev of EVASIONS) {
    console.log(`  ${ev.id.padEnd(5)} ${ev.open.padEnd(9)} ${stateOf(ev).padEnd(10)}  ${ev.what}`);
  }

  const n = (s) => EVASIONS.filter((e) => stateOf(e) === s).length;
  console.log(`\n${EVASIONS.length} entries -- ${n("must-catch")} must-catch, ${n("open")} OPEN (real work), ${n("ceiling")} unclosable ceiling.`);
  process.exit(0);
}

const countOf = (s) => EVASIONS.filter((e) => stateOf(e) === s).length;

console.log("rgr-routing EVASION suite -- each recorded evasion applied against the real gate");
console.log(`  entries: ${EVASIONS.length} (${countOf("must-catch")} must-catch, ${countOf("open")} OPEN work, ${countOf("ceiling")} unclosable ceilings)`);
console.log("");

// RULE 5 -- refuse to run against a red baseline.
const baseline = runGate();

if (baseline.code !== 0) {
  console.error(`FATAL: baseline gate exits ${baseline.code}, not 0. Every verdict below would be meaningless. Fix the gate first.`);
  process.exit(2);
}

console.log("  baseline gate: exit 0 (verified before any mutation)\n");

let failures = 0;
let caught = 0;
let ceilings = 0;
let opens = 0;

for (const ev of EVASIONS) {
  if (only && ev.id !== only) {
    continue;
  }

  const target = abs(ev.file);
  const before = sha(target);
  const original = fs.readFileSync(target, "utf8");
  const mutated = original.replace(ev.find, ev.repl);

  // RULE 1 -- a non-applying anchor is a BAD TEST, never a pass.
  if (mutated === original) {
    console.log(`  [BAD TEST] ${ev.id} (${ev.open}) -- anchor did not match ${ev.file}; this entry proves NOTHING until its anchor is repaired`);
    failures++;
    continue;
  }

  let result;
  let restored;

  try {
    fs.writeFileSync(target, mutated);
    result = runGate();
  } finally {
    // RULE 2 -- restore in a finally, and verify.
    fs.writeFileSync(target, original);
    restored = sha(target) === before;
  }

  const failLines = result.out.split("\n").filter((l) => l.includes("[FAIL]"));

  if (ev.expect === null) {
    // RULES 6 + 7 -- a non-caught entry is an honest record of a hole, not a pass, and its KIND is
    // reported: `unclosable` really does evade by design, everything else is work not yet done.
    const unclosable = stateOf(ev) === "ceiling";
    unclosable ? ceilings++ : opens++;
    const stillGreen = result.code === 0;
    const verdict = stillGreen
      ? unclosable
        ? " (EVADES, unclosable by construction)"
        : " (EVADES -- OPEN WORK, not by design)"
      : " (now caught -- update this entry to must-catch)";
    console.log(`  [${unclosable ? "CEILING " : "OPEN    "}] ${ev.id} (${ev.open}) -- gate exit ${result.code}${verdict}`);
    console.log(`             ${ev.ceiling}`);

    if (!restored) {
      console.log(`  [RESTORE ] ${ev.id} -- FILE NOT RESTORED, investigate immediately`);
      failures++;
    }

    continue;
  }

  // RULE 3 -- require the expected NAMED label, not merely a red gate.
  const hit = failLines.some((l) => l.includes(ev.expect));
  const ok = result.code !== 0 && hit;

  if (ok) {
    caught++;
    console.log(`  [CAUGHT  ] ${ev.id} (${ev.open}) -- ${ev.expect}`);
  } else {
    failures++;
    console.log(`  [EVADED  ] ${ev.id} (${ev.open}) -- gate exit ${result.code}, expected a FAIL line containing "${ev.expect}"${result.code !== 0 ? ` (gate WAS red, but on other checks: ${failLines.length} failure(s))` : ""}`);
    console.log(`             claim defeated: ${ev.claim}`);
    console.log(`             ${ev.what}`);
  }

  if (!restored) {
    console.log(`  [RESTORE ] ${ev.id} -- FILE NOT RESTORED, investigate immediately`);
    failures++;
  }
}

// The tree must be exactly as we found it.
const final = runGate();

console.log("");
console.log(`  final gate after all restores: exit ${final.code}`);

if (final.code !== 0) {
  console.log("  [ERROR   ] the gate is not GREEN after restores -- a mutation leaked");
  failures++;
}

// RULE 8 -- the ratchet. Skipped on a partial run: `--only` visits one entry, so its counts say
// nothing about the tree and applying the ratchet there would be noise, not a signal.
if (!only && opens !== EXPECTED_OPEN) {
  const direction =
    opens > EXPECTED_OPEN
      ? `OPEN COUNT ROSE ${EXPECTED_OPEN} -> ${opens}. A new evasion landed, or a closed guard regressed. ` +
        "Close it, or record it deliberately and raise EXPECTED_OPEN in the same commit."
      : `OPEN COUNT FELL ${EXPECTED_OPEN} -> ${opens}. Something was closed and EXPECTED_OPEN was not ` +
        "lowered with it. Lower it now -- stale slack is where the next rise hides.";
  console.log(`  [RATCHET ] ${direction}`);
  failures++;
}

console.log("");

const tally = `${caught} CAUGHT, ${opens} OPEN (baseline ${EXPECTED_OPEN}), ${ceilings} unclosable CEILING`;

if (failures === 0) {
  // GREEN means "nothing unaccounted", NOT "nothing left to do" -- the OPEN count is the backlog and
  // it is printed on the same line so the word GREEN can never be read as covering it.
  console.log(`SUMMARY: EVASIONS GREEN -- ${tally}, 0 unexplained`);
  process.exit(0);
}

console.log(`SUMMARY: EVASIONS RED -- ${failures} problem(s); ${tally}`);
process.exit(1);
