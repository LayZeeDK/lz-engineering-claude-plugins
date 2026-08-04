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
//   6. A DOCUMENTED CEILING is recorded as `expect: null` and is EXPECTED to stay GREEN. That is an
//      honest record of a known-open hole, not a pass. Ceilings are printed separately in the summary
//      so a reader cannot mistake the count of caught evasions for the count of entries.
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

// `find` may be a string (literal, safest) or a RegExp. `expect` is the substring that must appear in
// a FAIL line, or null for a documented ceiling.
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
    open: "closed",
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
    find: "green step is lz-tpp",
    repl: "green step is lz-refactor",
    expect: "beck-seam",
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
  {
    id: "M16",
    open: "OPEN-5",
    what: "a total catch-all in wording the literal family does not list",
    claim: "[cls-01] no bare catch-all terminal -- LITERAL BLOCKLIST ceiling",
    file: REFACTOR,
    find: /^( {3}e\. None of \(a\) through \(d\))/m,
    repl: "      In all remaining cases the refactor step takes the request, and that is lz-refactor.\n$1",
    expect: null,
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
    find: "- Coach mode: the ask is to improve",
    repl: "- Coach mode: nothing in the suite is red, and the ask is to improve",
    expect: null,
    ceiling:
      "TEST_STATE_TOKENS is a literal blocklist. This paraphrase is not a listed phrase. Tracked as " +
      "OPEN-5; the honest complements are the metered eval and human review.",
  },
  {
    id: "M12",
    open: "OPEN-6",
    what: "a `## Two modes` gate that admits work belonging to a sibling skill",
    claim: "a mode gate classifies what its own skill claims",
    file: RED,
    find: "- Coach mode: a codebase is in view and the question is which failing test to write next or how",
    repl:
      "- Coach mode: a codebase is in view and the question is which refactoring to apply to it, or\n" +
      "  which minimal change makes a red test pass, or how",
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

if (listOnly) {
  console.log("rgr-routing evasion suite -- recorded reproductions\n");

  for (const ev of EVASIONS) {
    console.log(`  ${ev.id.padEnd(5)} ${ev.open.padEnd(9)} ${ev.expect === null ? "ceiling" : "must-catch"}  ${ev.what}`);
  }

  console.log(`\n${EVASIONS.length} entries.`);
  process.exit(0);
}

console.log("rgr-routing EVASION suite -- each recorded evasion applied against the real gate");
console.log(`  entries: ${EVASIONS.length} (${EVASIONS.filter((e) => e.expect !== null).length} must-catch, ${EVASIONS.filter((e) => e.expect === null).length} documented ceilings)`);
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
    // RULE 6 -- a ceiling is an honest record of an open hole, not a pass.
    ceilings++;
    const stillGreen = result.code === 0;
    console.log(`  [CEILING ] ${ev.id} (${ev.open}) -- gate exit ${result.code}${stillGreen ? " (EVADES, as documented)" : " (now caught -- update this entry to must-catch)"}`);
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

console.log("");

if (failures === 0) {
  console.log(`SUMMARY: EVASIONS GREEN -- ${caught} evasion(s) CAUGHT with their named label, ${ceilings} documented ceiling(s) still evading by design, 0 unexplained`);
  process.exit(0);
}

console.log(`SUMMARY: EVASIONS RED -- ${failures} problem(s); ${caught} caught, ${ceilings} ceiling(s)`);
process.exit(1);
