#!/usr/bin/env node
// Self-test for lib/row-guards.mjs and lib/pipe-table.mjs (quick-260729-2ig). Plain node:assert,
// matching this workspace's existing style -- check-red-references.mjs and
// provenance-honesty.selftest.mjs are assert-based scripts, not a vitest suite, so no new test
// framework is introduced. IN-MEMORY FIXTURES ONLY; this file never reads a shipped document.
//   node .claude/skills/lz-red-workspace/tools/row-guards.selftest.mjs
//
// CONTRACT. Fourteen of the guards in row-guards.mjs correctly PASS against the live text, because
// their subject is ALREADY right and their job is to stop a REGRESSION. A baseline FAIL is therefore
// neither available nor meaningful for them, and manufacturing one would mean contorting a needle or
// deleting the very content this round exists to add. THIS FIXTURE SET IS THEIR PROOF INSTEAD:
//
//   1. PRISTINE   -> PASS. The guard accepts correct content.
//   2. EVASION    -> FAIL. The guard rejects the specific defect it exists to catch. For the six
//                   STRENGTHENED guards the evasion strips the subject from the ROW while leaving a
//                   DECOY elsewhere in the fixture (a Sources bullet, a section lead-in, a prose
//                   cross-link) -- exactly the shape that kept the old file-scoped needle green.
//   3. OLD NEEDLE -> PASSES the same evasion fixture. This is the "catches an evasion the old guard
//                   passed" evidence, COMMITTED here rather than thrown away in a scratchpad.
//   4. EMPTY TEXT -> FAIL. The anti-vacuity control, on EVERY guard. A guard that reports PASS on an
//                   empty document cannot fail, and a guard that cannot fail is worse than no guard
//                   (the wev R1 defect class).
//
// The two evasions named in the task brief are fixtures here verbatim in intent:
//   (a) strip the delivery name from the Bernhardt ROW while a Sources bullet still names a delivery;
//   (b) revert the kanban row's Source cell to the chapter the same file says CONTRADICTS the
//       criterion, while a prose bullet still names the essay.
//
// No fixture, comment or label in this file contains any email-shaped token other than the project's
// approved public contact -- and no forbidden value is written even as a search needle, because the
// needle IS the leak. ASCII only.
import assert from "node:assert/strict";
import { parseRows } from "./lib/pipe-table.mjs";
import { ROW_SCOPED_GUARDS, COUNT_GUARDS, OLD_NEEDLES, RETIRED_LABELS } from "./lib/row-guards.mjs";

// ---------------------------------------------------------------------------------------------
// Fixture builders. Lines are assembled from an ARRAY of double-quoted strings rather than a template
// literal, so the backticked term names need no escaping and a fixture cannot be silently corrupted by
// a missed backslash.
// ---------------------------------------------------------------------------------------------

const TAXONOMY_LINES = [
  "# Fixture taxonomy",
  "",
  "## 1. The axes",
  "",
  "Axis one, WHERE IT LIVES:",
  "",
  "- Production -- the artifact is a real production symbol.",
  "- Test -- the artifact lives in the test's world and is wired in so the code can be",
  "  exercised in isolation.",
  "",
  "Axis two, WHAT IT STANDS IN FOR:",
  "",
  "- Its own unwritten implementation -- the right symbol with nothing behind it yet.",
  "- A collaborator -- something else, which the code under test talks to.",
  "",
  "Axis three, LIFETIME:",
  "",
  "- Transitional -- destined to be replaced.",
  "- Permanent -- a fixture of the design or of the suite.",
  "",
  "Crossing the three axes gives eight cells. This fixture maps twelve sources.",
  "",
  "- **Production / own / transitional.** Six rows in the table land here.",
  "",
  "## 2. Authority",
  "",
  "The hierarchy figure shows five kinds as direct subtypes, and the prose states four.",
  "The five kinds are enumerated below so a reader can tell WHICH five.",
  "",
  "- `Test Stub`",
  "- `Test Spy`",
  "- `Mock Object`",
  "- `Fake Object`",
  "- `Dummy Object`",
  "",
  "The cross-reference records no equivalent term for any of the five kinds.",
  "A second sentence about the five kinds keeps the site count honest.",
  "A third sentence about the five kinds keeps the site count honest.",
  "A fourth sentence about the five kinds keeps the site count honest.",
  "A fifth sentence about the five kinds keeps the site count honest.",
  "A sixth sentence about the five kinds keeps the site count honest.",
  "",
  "This fixture maps twelve sources across three axes, crossing three axes in all.",
  "",
  "## 4. The per-author table",
  "",
  "| Author | Term | Where it lives | What it stands in for | Lifetime | Defining property (this document's words) | Defines or uses | Source | Citability tier |",
  "| --- | --- | --- | --- | --- | --- | --- | --- | --- |",
  "| Kent Beck | `stub` | Production | Own implementation | Transitional | A real production symbol that compiles but does not do its job yet | Uses | Report, October 1994 | Owned; oracle-verified against the clean-room source |",
  "| Sandi Metz (talks) | `shim` | Production | Own implementation | Transitional | A minimal production definition standing where the real one will go | Uses | RailsConf 2014 | Owned; oracle-verified against the clean-room source |",
  "| Sandi Metz (talks) | `empty method` | Production | Own implementation | Transitional | A method stood up with no body so the call site can be written | Uses | RailsConf 2014 | Owned; oracle-verified against the clean-room source |",
  "| Metz and Owen | `empty class` | Production | Own implementation | Transitional | A class stood up with no behaviour so the code can be named | Uses | 99 Bottles of OOP | Owned; oracle-verified against the clean-room source |",
  "| Metz and Owen | `empty method` | Production | Own implementation | Transitional | A method defined with no body, in the chapter-2 sense | Uses | 99 Bottles of OOP, Ch. 2 | Owned; oracle-verified against the clean-room source |",
  "| Joshua Kerievsky | `skeleton` | Production | Own implementation | Transitional | A structural stand-in introduced as a temporary step | Uses in passing | Refactoring to Patterns, Ch. 10 | Owned; oracle-verified against the clean-room source |",
  "| Gary Bernhardt | double versus value | Test | A collaborator | Either | The distinction between a substituted object and a value handed to a function | Uses | Boundaries, PyCon 2013 delivery | Owned; oracle-verified, for the double-versus-value point ONLY |",
  "| Gerard Meszaros | `Test Stub` | Test | A collaborator | Either | Installed to feed the code under test the indirect INPUT a scenario needs | Defines | xUnit Test Patterns | Owned; oracle-verified against the clean-room source |",
  "| Gerard Meszaros | `Test Spy` | Test | A collaborator | Either | Records the calls it receives so the test can inspect them afterwards | Defines | xUnit Test Patterns | Owned; oracle-verified against the clean-room source |",
  "| Gerard Meszaros | `Mock Object` | Test | A collaborator | Either | Carries the expectation itself and fails when the expected call does not arrive | Defines | xUnit Test Patterns | Owned; oracle-verified against the clean-room source |",
  "| Gerard Meszaros | `Fake Object` | Test | A collaborator | Permanent | A working lightweight implementation substituted for a costly real one | Defines | xUnit Test Patterns | Owned; oracle-verified against the clean-room source |",
  "| Gerard Meszaros | `Dummy Object` | Test | A collaborator | Permanent | Something passed only to satisfy a signature, never exercised | Defines | xUnit Test Patterns, Ch. 27 | Owned; oracle-verified against the clean-room source |",
  "| Gerard Meszaros | `Responder` | Test | A collaborator | Either | A Variation of Test Stub that returns a valid canned answer | Defines | xUnit Test Patterns, Ch. 23 | Owned; oracle-verified against the clean-room source |",
  "| Gerard Meszaros | `Saboteur` | Test | A collaborator | Either | A Variation of Test Stub that injects a fault | Defines | xUnit Test Patterns, Ch. 23 | Owned; oracle-verified against the clean-room source |",
  "| Gerard Meszaros | `Temporary Test Stub` | Test | A collaborator | Transitional | A Variation of Test Stub discriminated on a LIFECYCLE axis rather than an input-kind axis; an empty shell that evolves into the real class | Defines | xUnit Test Patterns | Owned; oracle-verified against the clean-room source |",
  "",
  "## 5. Naming the artifact",
  "",
  "Four owned sources name this artifact. Six rows in the table land in its cell.",
  "Ten candidates are surveyed below and five of them collide.",
  "",
  "- `placeholder` -- COLLIDES. Registered on one side and used on the other.",
  "- bare `stub` -- COLLIDES. The collision this fixture records.",
  "- `shim` -- COLLIDES. Split between two owned sources.",
  "- `empty method` -- COLLIDES. Split on lifetime within a single work.",
  "- bare `skeleton` -- COLLIDES. Four claimants as a substitution term.",
  "- `pass-through interface` -- NO COLLISION. Denotes delegation rather than absence.",
  "- `Walking Skeleton` -- NO COLLISION. A whole-system scaffold, not a single symbol.",
  "- `impostor` -- NO COLLISION. Committed to the test side only.",
  "- the stand-in family -- NO COLLISION. Each denotes one object taking another's place.",
  "- `empty class` -- NO COLLISION. Unambiguous, but it names only a class.",
  "",
  "## 6. Caveats",
  "",
  "- A caveat that changes a citation.",
  "",
  "## Sources",
  "",
  "- Source bullet one.",
  "- Source bullet two.",
  "- Source bullet three.",
  "- Source bullet four.",
  "- Source bullet five.",
  "- Source bullet six.",
  "- Source bullet seven.",
  "- Source bullet eight.",
  "- Source bullet nine.",
  "- Source bullet ten.",
  "- Source bullet eleven.",
  "- Source bullet twelve.",
  "",
  "Three further qualifiers on what a tier promises:",
  "",
  "1. BY CLAIM TYPE.",
  "2. BY SOURCE MEDIUM.",
  "3. BY SOURCE VERSION.",
];

const BACKING_LINES = [
  "# Fixture principle backing",
  "",
  "The Three Laws of TDD spine and the classify-first seam and handoff are backed here.",
  "A build failure is a legitimate red, and that failure is not an assertion mismatch.",
  "The same inherited conflict is recorded in [test-double-taxonomy.md](test-double-taxonomy.md).",
  "Beck's owned surface for that step is the essay TDD is Kanban for Code.",
  "Seams and characterization are handled in another leaf, and four owned sources name it.",
  "",
  "| Recommendation | Source | Access tier |",
  "| --- | --- | --- |",
  "| [Three Laws of TDD spine](three-laws-and-test-selection.md) | Robert C. Martin, Clean Code Ch. 9 | Owned; oracle-verified against the clean-room source. |",
  "| [Fail for the right reason: the failure-versus-error boundary](vitest-typescript-mechanics.md) | Martin Fowler, Refactoring 2nd Edition Ch. 4 -- a failure is an assertion mismatch | Owned; oracle-verified against the clean-room source. |",
  "| [Fail for the right reason: clear the compile error, then run and fail](vitest-typescript-mechanics.md) | Kent Beck, TDD is Kanban for Code (essay) | Owned; oracle-verified against the clean-room source. |",
  "| [Classify-first and the forward lz-tpp handoff](three-laws-and-test-selection.md) | lz-red orchestration | Unowned; high-confidence core only (no-oracle). |",
  "| [Test-double taxonomy](test-double-taxonomy.md) | Twelve sources, mapped per row | PER SOURCE -- no single tier applies. |",
];

const TAXONOMY = TAXONOMY_LINES.join("\n");
const BACKING = BACKING_LINES.join("\n");

// Replace the FIRST occurrence, and assert the replacement actually happened -- a fixture mutation
// that silently no-ops would turn a FAIL assertion into a false pass on unmodified text.
const mutate = (text, from, to) => {
  const next = text.replace(from, to);

  assert.notEqual(next, text, `fixture mutation did not apply: ${from}`);

  return next;
};

// Drop the whole line containing `marker` -- the row-deletion evasion.
const dropLine = (text, marker) => {
  const lines = text.split("\n");
  const kept = lines.filter((line) => !line.includes(marker));

  assert.notEqual(kept.length, lines.length, `fixture line drop did not apply: ${marker}`);

  return kept.join("\n");
};

// ---------------------------------------------------------------------------------------------
// Harness
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

const verdict = (result) => result.ok;

console.log("row-guards self-test (row-scoped + count-re-derivation guards)");
console.log("");

// ---------------------------------------------------------------------------------------------
// pipe-table.mjs
// ---------------------------------------------------------------------------------------------

console.log("lib/pipe-table.mjs -- parseRows");
check("taxonomy fixture parses to 15 data rows", parseRows(TAXONOMY, 9, "Author").length, 15);
check("backing fixture parses to 5 data rows", parseRows(BACKING, 3, "Recommendation").length, 5);
check("header row is dropped BY VALUE, not by position", parseRows(TAXONOMY, 9, "Author")[0][0], "Kent Beck");
check("a width mismatch SKIPS the row rather than guessing", parseRows(TAXONOMY, 3, "Author").length, 0);
check("empty text parses to zero rows, no crash", parseRows("", 9, "Author").length, 0);
console.log("");

// ---------------------------------------------------------------------------------------------
// (A) Seven row-scoped guards -- four assertions each
// ---------------------------------------------------------------------------------------------

console.log("lib/row-guards.mjs -- seven ROW-SCOPED guards (pristine / evasion / old needle / empty)");

// -- 1. bernhardtDeliveryNamed. BRIEF-MANDATED EVASION (a): strip the delivery name from the ROW while
// a Sources bullet still names a delivery, which is exactly how the old file-scoped needle stayed green.
const BERNHARDT_EVASION = mutate(
  mutate(TAXONOMY, "| Uses | Boundaries, PyCon 2013 delivery |", "| Uses | Boundaries |"),
  "- Source bullet one.",
  "- Gary Bernhardt -- the double-versus-value distinction from Boundaries, PyCon 2013."
);

check("bernhardtDeliveryNamed: pristine row names a delivery -> PASS", verdict(ROW_SCOPED_GUARDS.bernhardtDeliveryNamed(TAXONOMY)), true);
check("bernhardtDeliveryNamed: EVASION (delivery stripped from the ROW, Sources bullet still names one) -> FAIL", verdict(ROW_SCOPED_GUARDS.bernhardtDeliveryNamed(BERNHARDT_EVASION)), false);
check("bernhardtDeliveryNamed: OLD file-scoped needle PASSES that same evasion", OLD_NEEDLES.bernhardtDeliveryNamed(BERNHARDT_EVASION), true);
check("bernhardtDeliveryNamed: empty text -> FAIL (anti-vacuity)", verdict(ROW_SCOPED_GUARDS.bernhardtDeliveryNamed("")), false);

// -- 2. temporaryTestStubStatesRelationship. NET-NEW, but still row-scoped by necessity: the Responder
// and Saboteur rows carry the same phrase, so a file-scoped form is satisfied by them and cannot fail.
const TEMP_STUB_EVASION = mutate(
  TAXONOMY,
  "A Variation of Test Stub discriminated on a LIFECYCLE axis rather than an input-kind axis; an empty shell that evolves into the real class",
  "An empty shell with hardcoded returns that evolves into the real class"
);

check("temporaryTestStubStatesRelationship: pristine cell states the relationship -> PASS", verdict(ROW_SCOPED_GUARDS.temporaryTestStubStatesRelationship(TAXONOMY)), true);
check("temporaryTestStubStatesRelationship: EVASION (relationship stripped from the ROW, two sibling rows still carry the phrase) -> FAIL", verdict(ROW_SCOPED_GUARDS.temporaryTestStubStatesRelationship(TEMP_STUB_EVASION)), false);
check("temporaryTestStubStatesRelationship: a FILE-SCOPED needle PASSES that same evasion (why row-scoping is required)", OLD_NEEDLES.temporaryTestStubStatesRelationship(TEMP_STUB_EVASION), true);
check("temporaryTestStubStatesRelationship: empty text -> FAIL (anti-vacuity)", verdict(ROW_SCOPED_GUARDS.temporaryTestStubStatesRelationship("")), false);

// -- 3. failureVsErrorRowBacked. Evasion: delete the ROW; five prose lines carrying the bare word
// "failure" kept the old needle green.
const FAILURE_ROW_EVASION = dropLine(BACKING, "the failure-versus-error boundary");

check("failureVsErrorRowBacked: pristine row names Fowler's Refactoring 2e Ch. 4 -> PASS", verdict(ROW_SCOPED_GUARDS.failureVsErrorRowBacked(BACKING)), true);
check("failureVsErrorRowBacked: EVASION (row deleted, prose still says failure) -> FAIL", verdict(ROW_SCOPED_GUARDS.failureVsErrorRowBacked(FAILURE_ROW_EVASION)), false);
check("failureVsErrorRowBacked: OLD file-scoped needle PASSES that same evasion", OLD_NEEDLES.failureVsErrorRowBacked(FAILURE_ROW_EVASION), true);
check("failureVsErrorRowBacked: empty text -> FAIL (anti-vacuity)", verdict(ROW_SCOPED_GUARDS.failureVsErrorRowBacked("")), false);

// -- 4. seamRowBacked. Evasion: delete the ROW; six prose lines carrying "seam" or "handoff" kept the
// old needle green. The tier assertion is the canonical STRING, not a bare non-empty check.
const SEAM_ROW_EVASION = dropLine(BACKING, "Classify-first and the forward lz-tpp handoff");
const SEAM_TIER_MUTATION = mutate(
  BACKING,
  "| [Classify-first and the forward lz-tpp handoff](three-laws-and-test-selection.md) | lz-red orchestration | Unowned; high-confidence core only (no-oracle). |",
  "| [Classify-first and the forward lz-tpp handoff](three-laws-and-test-selection.md) | lz-red orchestration | Owned; oracle-verified against the clean-room source. |"
);

check("seamRowBacked: pristine row carries the canonical no-oracle tier -> PASS", verdict(ROW_SCOPED_GUARDS.seamRowBacked(BACKING)), true);
check("seamRowBacked: EVASION (row deleted, prose still says seam and handoff) -> FAIL", verdict(ROW_SCOPED_GUARDS.seamRowBacked(SEAM_ROW_EVASION)), false);
check("seamRowBacked: OLD file-scoped needle PASSES that same evasion", OLD_NEEDLES.seamRowBacked(SEAM_ROW_EVASION), true);
check("seamRowBacked: a NON-EMPTY but wrong tier -> FAIL (a bare non-empty check could not catch this)", verdict(ROW_SCOPED_GUARDS.seamRowBacked(SEAM_TIER_MUTATION)), false);
check("seamRowBacked: empty text -> FAIL (anti-vacuity)", verdict(ROW_SCOPED_GUARDS.seamRowBacked("")), false);

// -- 5. taxonomyRowBacked. Evasion: delete the ROW; the prose cross-link kept the old needle green.
const TAXONOMY_ROW_EVASION = dropLine(BACKING, "| [Test-double taxonomy]");

check("taxonomyRowBacked: pristine row links the taxonomy -> PASS", verdict(ROW_SCOPED_GUARDS.taxonomyRowBacked(BACKING)), true);
check("taxonomyRowBacked: EVASION (row deleted, prose cross-link survives) -> FAIL", verdict(ROW_SCOPED_GUARDS.taxonomyRowBacked(TAXONOMY_ROW_EVASION)), false);
check("taxonomyRowBacked: OLD file-scoped needle PASSES that same evasion", OLD_NEEDLES.taxonomyRowBacked(TAXONOMY_ROW_EVASION), true);
check("taxonomyRowBacked: empty text -> FAIL (anti-vacuity)", verdict(ROW_SCOPED_GUARDS.taxonomyRowBacked("")), false);

// -- 6. threeLawsRowBacked. Evasion: delete the ROW; the section lead-in kept the old needle green.
const THREE_LAWS_ROW_EVASION = dropLine(BACKING, "| [Three Laws of TDD spine]");

check("threeLawsRowBacked: pristine row names Robert C. Martin -> PASS", verdict(ROW_SCOPED_GUARDS.threeLawsRowBacked(BACKING)), true);
check("threeLawsRowBacked: EVASION (row deleted, section lead-in survives) -> FAIL", verdict(ROW_SCOPED_GUARDS.threeLawsRowBacked(THREE_LAWS_ROW_EVASION)), false);
check("threeLawsRowBacked: OLD file-scoped needle PASSES that same evasion", OLD_NEEDLES.threeLawsRowBacked(THREE_LAWS_ROW_EVASION), true);
check("threeLawsRowBacked: empty text -> FAIL (anti-vacuity)", verdict(ROW_SCOPED_GUARDS.threeLawsRowBacked("")), false);

// -- 7. kanbanEssayNamedInRow. BRIEF-MANDATED EVASION (b): revert the ROW's Source cell to the chapter
// the same file says CONTRADICTS the criterion, while a prose bullet still names the essay.
const KANBAN_EVASION = mutate(
  BACKING,
  "| Kent Beck, TDD is Kanban for Code (essay) |",
  "| Robert C. Martin, Clean Code Ch. 9 |"
);
// And the D-05-adjacent regression: the row citing the BOOK rather than the owned essay.
const KANBAN_BOOK_EVASION = mutate(
  BACKING,
  "| Kent Beck, TDD is Kanban for Code (essay) |",
  "| Kent Beck, Test-Driven Development by Example |"
);

check("kanbanEssayNamedInRow: pristine row names the owned essay -> PASS", verdict(ROW_SCOPED_GUARDS.kanbanEssayNamedInRow(BACKING)), true);
check("kanbanEssayNamedInRow: EVASION (row reverted to the contradicting chapter, prose still names the essay) -> FAIL", verdict(ROW_SCOPED_GUARDS.kanbanEssayNamedInRow(KANBAN_EVASION)), false);
check("kanbanEssayNamedInRow: OLD file-scoped needle PASSES that same evasion", OLD_NEEDLES.kanbanEssayNamedInRow(KANBAN_EVASION), true);
check("kanbanEssayNamedInRow: row citing the BOOK instead of the essay -> FAIL", verdict(ROW_SCOPED_GUARDS.kanbanEssayNamedInRow(KANBAN_BOOK_EVASION)), false);
check("kanbanEssayNamedInRow: empty text -> FAIL (anti-vacuity)", verdict(ROW_SCOPED_GUARDS.kanbanEssayNamedInRow("")), false);

// -- exactly-one-row rule: a DUPLICATED row must FAIL as loudly as a missing one, or the guard silently
// asserts about whichever copy it happened to find first.
const DUPLICATED_BERNHARDT = TAXONOMY.replace(
  /^(\| Gary Bernhardt \| double versus value .*)$/m,
  "$1\n$1"
);

check("oneRow: a DUPLICATED target row -> FAIL (exactly one, or fail)", verdict(ROW_SCOPED_GUARDS.bernhardtDeliveryNamed(DUPLICATED_BERNHARDT)), false);
console.log("");

// ---------------------------------------------------------------------------------------------
// (B) Nine count guards -- pristine / word disagrees / stated total DELETED / empty
// ---------------------------------------------------------------------------------------------

console.log("lib/row-guards.mjs -- nine COUNT guards (pristine / disagree / total DELETED / empty)");

const countCase = (name, guard, disagree, deleted) => {
  check(`${name}: pristine derivation agrees with the stated word -> PASS`, verdict(guard(TAXONOMY)), true);
  check(`${name}: stated word DISAGREES with the derivation -> FAIL`, verdict(guard(disagree)), false);
  check(`${name}: stated total DELETED, so the site count drops -> FAIL`, verdict(guard(deleted)), false);
  check(`${name}: empty text -> FAIL (anti-vacuity)`, verdict(guard("")), false);
};

countCase(
  "twelveSources",
  COUNT_GUARDS.twelveSources,
  mutate(TAXONOMY, "This fixture maps twelve sources.", "This fixture maps eleven sources."),
  mutate(TAXONOMY, "This fixture maps twelve sources.", "This fixture maps the sources.")
);

countCase(
  "eightCellsFromAxes",
  COUNT_GUARDS.eightCellsFromAxes,
  mutate(TAXONOMY, "gives eight cells", "gives seven cells"),
  mutate(TAXONOMY, "gives eight cells", "gives the cells")
);

// And the derivation itself must move when an AXIS gains a value: a hardcoded 8 could not see this.
const THIRD_AXIS_VALUE = mutate(
  TAXONOMY,
  "- Permanent -- a fixture of the design or of the suite.",
  "- Permanent -- a fixture of the design or of the suite.\n- Indefinite -- a third value on this axis."
);

check("eightCellsFromAxes: an axis gaining a THIRD value moves the product -> FAIL (proves the 8 is derived, not hardcoded)", verdict(COUNT_GUARDS.eightCellsFromAxes(THIRD_AXIS_VALUE)), false);

countCase(
  "threeAxes",
  COUNT_GUARDS.threeAxes,
  mutate(TAXONOMY, "Crossing the three axes", "Crossing the four axes"),
  mutate(TAXONOMY, "Crossing the three axes", "Crossing the axes")
);

countCase(
  "sixRowsInCell",
  COUNT_GUARDS.sixRowsInCell,
  mutate(TAXONOMY, "**Production / own / transitional.** Six rows", "**Production / own / transitional.** Seven rows"),
  mutate(TAXONOMY, "**Production / own / transitional.** Six rows in the table land here.", "**Production / own / transitional.** The table lands here.")
);

countCase(
  "fiveKindsEnumerated",
  COUNT_GUARDS.fiveKindsEnumerated,
  mutate(TAXONOMY, "records no equivalent term for any of the five kinds", "records no equivalent term for any of the four kinds"),
  mutate(TAXONOMY, "records no equivalent term for any of the five kinds", "records no equivalent term for any of the kinds")
);

// And the enumeration must RESOLVE: a name that is not a row of that author FAILS.
const UNRESOLVED_KIND = mutate(TAXONOMY, "- `Fake Object`", "- `Fake Collaborator`");
// A deleted enumeration must FAIL rather than deriving zero and looking like a content bug.
const NO_ENUMERATION = dropLine(dropLine(dropLine(dropLine(dropLine(TAXONOMY, "- `Test Stub`"), "- `Test Spy`"), "- `Mock Object`"), "- `Fake Object`"), "- `Dummy Object`");

check("fiveKindsEnumerated: an enumerated name resolving to NO row of that author -> FAIL", verdict(COUNT_GUARDS.fiveKindsEnumerated(UNRESOLVED_KIND)), false);
check("fiveKindsEnumerated: the enumeration DELETED -> FAIL", verdict(COUNT_GUARDS.fiveKindsEnumerated(NO_ENUMERATION)), false);

countCase(
  "threeFurtherQualifiers",
  COUNT_GUARDS.threeFurtherQualifiers,
  mutate(TAXONOMY, "Three further qualifiers", "Four further qualifiers"),
  mutate(TAXONOMY, "Three further qualifiers on what a tier promises:", "Qualifiers on what a tier promises:")
);

countCase(
  "ambiguitySurveyCount",
  COUNT_GUARDS.ambiguitySurveyCount,
  mutate(TAXONOMY, "Ten candidates are surveyed", "Nine candidates are surveyed"),
  mutate(TAXONOMY, "Ten candidates are surveyed below and", "The candidates surveyed below are those where")
);

// The colliding SUBSET is asserted independently of the survey size.
const WRONG_COLLIDE_COUNT = mutate(TAXONOMY, "and five of them collide", "and six of them collide");
// An UNLABELLED candidate bullet must FAIL rather than being silently skipped.
const UNLABELLED_CANDIDATE = mutate(
  TAXONOMY,
  "- `empty class` -- NO COLLISION. Unambiguous, but it names only a class.",
  "- `empty class` -- unambiguous, but it names only a class."
);

check("ambiguitySurveyCount: the colliding SUBSET count disagreeing -> FAIL", verdict(COUNT_GUARDS.ambiguitySurveyCount(WRONG_COLLIDE_COUNT)), false);
check("ambiguitySurveyCount: an UNLABELLED candidate bullet -> FAIL (never silently skipped)", verdict(COUNT_GUARDS.ambiguitySurveyCount(UNLABELLED_CANDIDATE)), false);

// noEmptyDataCell states no total, so its mutation is an empty cell rather than a wrong word.
const EMPTY_CELL = mutate(
  TAXONOMY,
  "| Joshua Kerievsky | `skeleton` | Production | Own implementation | Transitional | A structural stand-in introduced as a temporary step | Uses in passing |",
  "| Joshua Kerievsky | `skeleton` | Production | Own implementation | Transitional | A structural stand-in introduced as a temporary step |  |"
);

check("noEmptyDataCell: pristine table has no empty data cell -> PASS", verdict(COUNT_GUARDS.noEmptyDataCell(TAXONOMY)), true);
check("noEmptyDataCell: a blanked data cell -> FAIL", verdict(COUNT_GUARDS.noEmptyDataCell(EMPTY_CELL)), false);
check("noEmptyDataCell: empty text -> FAIL (anti-vacuity)", verdict(COUNT_GUARDS.noEmptyDataCell("")), false);

// fourOwnedSourcesName is the ONE guard reading two files, so it gets its own block.
check("fourOwnedSourcesName: pristine pair agrees at both sites -> PASS", verdict(COUNT_GUARDS.fourOwnedSourcesName(TAXONOMY, BACKING)), true);
check(
  "fourOwnedSourcesName: stated word DISAGREES -> FAIL",
  verdict(COUNT_GUARDS.fourOwnedSourcesName(mutate(TAXONOMY, "Four owned sources name", "Five owned sources name"), BACKING)),
  false
);
check(
  "fourOwnedSourcesName: the DEPENDENT's restatement deleted, so the site count drops -> FAIL",
  verdict(COUNT_GUARDS.fourOwnedSourcesName(TAXONOMY, mutate(BACKING, "and four owned sources name it", "and owned sources name it"))),
  false
);
check(
  "fourOwnedSourcesName: a row in that cell losing its Owned tier -> FAIL",
  verdict(
    COUNT_GUARDS.fourOwnedSourcesName(
      mutate(TAXONOMY, "| Uses in passing | Refactoring to Patterns, Ch. 10 | Owned; oracle-verified against the clean-room source |", "| Uses in passing | Refactoring to Patterns, Ch. 10 | Unowned; high-confidence core only (no-oracle) |"),
      BACKING
    )
  ),
  false
);
check("fourOwnedSourcesName: empty texts -> FAIL (anti-vacuity)", verdict(COUNT_GUARDS.fourOwnedSourcesName("", "")), false);
console.log("");

// ---------------------------------------------------------------------------------------------
// Roster shape. A bare emitted-check COUNT is blind to a short swap that happens to balance, so the
// guard NAME SET is asserted here and the emitted LABEL SET is asserted by the checker's roster gate.
// ---------------------------------------------------------------------------------------------

console.log("lib/row-guards.mjs -- export roster (a count alone cannot see a renamed or swapped guard)");
check(
  "ROW_SCOPED_GUARDS exports exactly the seven named row-scoped guards",
  Object.keys(ROW_SCOPED_GUARDS).sort(),
  [
    "bernhardtDeliveryNamed",
    "failureVsErrorRowBacked",
    "kanbanEssayNamedInRow",
    "seamRowBacked",
    "taxonomyRowBacked",
    "temporaryTestStubStatesRelationship",
    "threeLawsRowBacked",
  ]
);
check(
  "COUNT_GUARDS exports exactly the nine named count guards",
  Object.keys(COUNT_GUARDS).sort(),
  [
    "ambiguitySurveyCount",
    "eightCellsFromAxes",
    "fiveKindsEnumerated",
    "fourOwnedSourcesName",
    "noEmptyDataCell",
    "sixRowsInCell",
    "threeAxes",
    "threeFurtherQualifiers",
    "twelveSources",
  ]
);
check(
  "OLD_NEEDLES carries one superseded needle per row-scoped guard",
  Object.keys(OLD_NEEDLES).sort(),
  Object.keys(ROW_SCOPED_GUARDS).sort()
);
check("RETIRED_LABELS carries exactly six composed labels", RETIRED_LABELS.length, 6);
check(
  "RETIRED_LABELS are COMPOSED strings (filename prefix), not bare label values",
  RETIRED_LABELS.every((label) => /^[a-z-]+\.md: /.test(label)),
  true
);

console.log("");

if (failures === 0) {
  console.log("SUMMARY: row-guards self-test GREEN -- all assertions pass");
  process.exit(0);
}

console.log(`SUMMARY: row-guards self-test RED -- ${failures} assertion(s) FAILED`);
process.exit(1);
