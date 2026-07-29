#!/usr/bin/env node
// Self-test for lib/row-guards.mjs and lib/pipe-table.mjs (quick-260729-2ig). Plain node:assert,
// matching this workspace's existing style -- check-red-references.mjs and
// provenance-honesty.selftest.mjs are assert-based scripts, not a vitest suite, so no new test
// framework is introduced. IN-MEMORY FIXTURES ONLY; this file never reads a shipped document.
//   node .claude/skills/lz-red-workspace/tools/row-guards.selftest.mjs
//
// CONTRACT. Every guard in row-guards.mjs correctly PASSES against the live text, because
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
import { parseRows, scanTables, findLinkTargets } from "./lib/pipe-table.mjs";
import { ROW_SCOPED_GUARDS, OLD_NEEDLES, RETIRED_LABELS } from "./lib/row-guards.mjs";

// ---------------------------------------------------------------------------------------------
// Fixture builders. Lines are assembled from an ARRAY of double-quoted strings rather than a template
// literal, so the backticked term names need no escaping and a fixture cannot be silently corrupted by
// a missed backslash.
// ---------------------------------------------------------------------------------------------

// [lc9] PARSER FIXTURE, and KEPT deliberately: it is the ONLY fixture exercising parseRows's
// header-dropped-BY-VALUE and width-mismatch-SKIPS cases. Deleting it because the document it mirrors
// left the shipped tree would silently remove those two proofs.
//
// It deliberately MIRRORS REAL ROW SHAPES from the archived record rather than inventing them, because
// realistic row shapes are the whole point of a parser fixture -- a nine-column table with backticked
// terms, two header rows' worth of structure, and long prose cells is what actually broke naive
// splitting. About nine structural lines of 25+ chars are therefore VERBATIM from that record (the two
// axis lead-ins, a section heading, the header and separator rows, three Meszaros rows, one tier
// fragment). An earlier version of this comment claimed "every line here was written for this file",
// which was false -- the same defect class this workspace's instruments exist to catch, pointed at a
// fixture instead of at prose.
//
// No copyright exposure: the archived record is the owner's own clean-room material. And the property
// that actually matters is untouched -- the fixture is IN MEMORY and this file reads nothing from disk,
// so no shipped or archived document can redden the selftest.
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
  "Beck's owned surface for that step is the essay TDD is Kanban for Code.",
  "Seams and characterization are handled in another leaf, and four owned sources name it.",
  "",
  "| Recommendation | Source | Access tier |",
  "| --- | --- | --- |",
  "| [Three Laws of TDD spine](three-laws-and-test-selection.md) | Robert C. Martin, Clean Code Ch. 9 | Owned; oracle-verified against the clean-room source. |",
  "| [Fail for the right reason: the failure-versus-error boundary](vitest-typescript-mechanics.md) | Martin Fowler, Refactoring 2nd Edition Ch. 4 -- a failure is an assertion mismatch | Owned; oracle-verified against the clean-room source. |",
  "| [Fail for the right reason: clear the compile error, then run and fail](vitest-typescript-mechanics.md) | Kent Beck, TDD is Kanban for Code (essay) | Owned; oracle-verified against the clean-room source. |",
  "| [Classify-first and the forward lz-tpp handoff](three-laws-and-test-selection.md) | lz-red orchestration | Unowned; high-confidence core only (no-oracle). |",
];

const TAXONOMY = TAXONOMY_LINES.join("\n");
const BACKING = BACKING_LINES.join("\n");

// [lc9] Table-SHAPE and LINK fixtures. Tiny and self-contained on purpose: each isolates exactly one
// mutation or one link kind, so a failure names the property rather than a whole document. Line numbers
// in the expected offender string are ONE-BASED and count from the first line of the fixture.
const WELL_FORMED_TABLE = ["| a | b | c |", "| --- | --- | --- |", "| 1 | 2 | 3 |"].join("\n");
// A data cell deleted TOGETHER WITH its pipe. Renders short in GFM; parseRows SKIPS it silently.
const RAGGED_TABLE = ["| a | b | c |", "| --- | --- | --- |", "| 1 | 2 |"].join("\n");
// The same cell BLANKED but its pipe KEPT. Right width, and it renders identically to the row above.
const BLANKED_CELL_TABLE = ["| a | b | c |", "| --- | --- | --- |", "| 1 | 2 |  |"].join("\n");
const FENCED_RAGGED_TABLE = ["```", "| a | b | c |", "| --- | --- | --- |", "| 1 |", "```"].join("\n");
const TWO_TABLES = ["| a | b | c |", "| --- | --- | --- |", "| 1 | 2 | 3 |", "", "| p | q |", "| --- | --- |", "| 4 | 5 |"].join("\n");
// A row whose FIRST cell contains an escaped pipe, so the row is two cells wide and not three.
const ESCAPED_PIPE_TABLE = ["| a | b |", "| --- | --- |", "| 1 \\| 2 | 3 |"].join("\n");
// [lc9] GFM allows up to THREE leading spaces on a table row. An indented table was not recognised as a
// table at all, so a ragged row inside one was SKIPPED SILENTLY -- and a seen-count anti-vacuity leg
// cannot detect a table it never recognised. Skip-silently is the one direction the module's own header
// rules out, so recognition is fixed rather than the skip made loud.
const INDENTED_RAGGED_TABLE = ["  | a | b | c |", "  | --- | --- | --- |", "  | 1 | 2 |"].join("\n");
const INDENTED_WELL_FORMED_TABLE = ["   | a | b | c |", "   | --- | --- | --- |", "   | 1 | 2 | 3 |"].join("\n");
// FOUR leading spaces is an indented CODE BLOCK in CommonMark, not a table row, and must stay unseen.
const OVER_INDENTED_TABLE = ["    | a | b | c |", "    | --- | --- | --- |", "    | 1 | 2 |"].join("\n");
const FENCED_LINK = ["```md", "see [there](sibling.md).", "```"].join("\n");

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

console.log("row-guards self-test (pipe-table scanners + row-scoped guards)");
console.log("");

// ---------------------------------------------------------------------------------------------
// pipe-table.mjs
// ---------------------------------------------------------------------------------------------

console.log("lib/pipe-table.mjs -- parseRows");
check("taxonomy fixture parses to 15 data rows", parseRows(TAXONOMY, 9, "Author").length, 15);
check("backing fixture parses to 4 data rows", parseRows(BACKING, 3, "Recommendation").length, 4);
check("header row is dropped BY VALUE, not by position", parseRows(TAXONOMY, 9, "Author")[0][0], "Kent Beck");
check("a width mismatch SKIPS the row rather than guessing", parseRows(TAXONOMY, 3, "Author").length, 0);
check("empty text parses to zero rows, no crash", parseRows("", 9, "Author").length, 0);
// [lc9] A backslash-escaped pipe is cell CONTENT, not a boundary. A bare split on "|" counts it as a
// boundary and reports this well-formed row as the wrong width, at which point parseRows SKIPS it and
// every row-scoped guard over that table silently stops seeing it.
check("a row containing an escaped pipe parses to the intended width", parseRows(ESCAPED_PIPE_TABLE, 2, "a").length, 1);
console.log("");

// ---------------------------------------------------------------------------------------------
// [lc9] pipe-table.mjs -- scanTables. This fixture set is guard N1's ONLY falsifiability proof: the
// gate is invariant-GREEN against the shipped tree (0 ragged rows measured), so no baseline failure is
// available for it and manufacturing one would mean corrupting a shipped document. These cases are the
// proof instead.
// ---------------------------------------------------------------------------------------------

console.log("lib/pipe-table.mjs -- scanTables");
check("scanTables: a well-formed three-column table -> no offender", scanTables(WELL_FORMED_TABLE), { tables: 1, offenders: [] });
// THE case the gate exists for: a cell deleted TOGETHER WITH its pipe. The offender names the table's
// start line, the number of ragged rows, and each ragged row's own line and width, so a failure is
// actionable rather than a bare count.
check(
  "scanTables: a data cell deleted WITH its pipe -> exactly one offender naming the table and the row",
  scanTables(RAGGED_TABLE).offenders,
  ["table at line 1: header is 3 wide, but 1 row(s) differ -- line 3 is 2"]
);
// The MIRROR mutation, and it is deliberately NOT this gate's job: blanking the cell while keeping the
// pipe leaves the row the right width, and the two mutations render identically in GFM. An empty-cell
// guard owns that one.
check("scanTables: a cell BLANKED with its pipe KEPT -> no offender, that is a different gate", scanTables(BLANKED_CELL_TABLE).offenders, []);
check("scanTables: a ragged-looking table inside a fence is not a table at all", scanTables(FENCED_RAGGED_TABLE), { tables: 0, offenders: [] });
// [lc9] The indented cases. GFM permits up to three leading spaces, so an indented table IS a table and
// its ragged row must be reported; at four spaces it is an indented code block and must stay unseen. The
// boundary is asserted from both sides so widening the recognizer cannot drift into code blocks.
check(
  "scanTables: an INDENTED ragged table is seen and reported, not skipped silently",
  scanTables(INDENTED_RAGGED_TABLE).offenders,
  ["table at line 1: header is 3 wide, but 1 row(s) differ -- line 3 is 2"]
);
check("scanTables: an indented well-formed table is one table with no offender", scanTables(INDENTED_WELL_FORMED_TABLE), { tables: 1, offenders: [] });
check("scanTables: FOUR leading spaces is a code block, not a table", scanTables(OVER_INDENTED_TABLE), { tables: 0, offenders: [] });
check("parseRows: an indented row is a row", parseRows(INDENTED_WELL_FORMED_TABLE, 3, "a").length, 1);
check("scanTables: two tables of different widths are two tables, not one ragged one", scanTables(TWO_TABLES), { tables: 2, offenders: [] });
// ANTI-VACUITY, and this is why the anti-vacuity control lives on the TABLE COUNT in the checker rather
// than here: "no ragged tables" is TRUE of an empty document, so this pure function cannot fail on
// empty text. Only a caller that also asserts it saw a table can catch a scan that read nothing.
check("scanTables: empty text -> zero tables and no offender, so the caller must assert the count", scanTables(""), { tables: 0, offenders: [] });
console.log("");

// ---------------------------------------------------------------------------------------------
// [lc9] pipe-table.mjs -- findLinkTargets. Classification is pure and disk-free ON PURPOSE, so it is
// fixture-testable; only a `relative` target can be a dead link on disk, and the caller resolves it.
// ---------------------------------------------------------------------------------------------

console.log("lib/pipe-table.mjs -- findLinkTargets");
check("findLinkTargets: a same-document fragment is an anchor", findLinkTargets("see [there](#a-heading).").map((t) => t.kind), ["anchor"]);
check("findLinkTargets: a URI scheme is a scheme", findLinkTargets("see [there](https://example.invalid/x).").map((t) => t.kind), ["scheme"]);
check("findLinkTargets: a root-relative path is absolute", findLinkTargets("see [there](/docs/x.md).").map((t) => t.kind), ["absolute"]);
check("findLinkTargets: a bare sibling path is relative", findLinkTargets("see [there](sibling.md).").map((t) => t.kind), ["relative"]);
// The fragment split is REQUIRED of the caller, not of this function: it reports the raw target, and a
// caller resolving `sibling.md#a-heading` as a path would report every catalog link dead.
check(
  "findLinkTargets: a file-plus-fragment target is relative and keeps its fragment in raw",
  findLinkTargets("see [there](sibling.md#a-heading).").map((t) => `${t.kind}:${t.raw}`),
  ["relative:sibling.md#a-heading"]
);
check("findLinkTargets: a link inside a fence is not a link site", findLinkTargets(FENCED_LINK), []);
console.log("");

// ---------------------------------------------------------------------------------------------
// (A) Four row-scoped guards -- four assertions each
// ---------------------------------------------------------------------------------------------

console.log("lib/row-guards.mjs -- four ROW-SCOPED guards (pristine / evasion / old needle / empty)");

// [lc9] The two fixture blocks for the guards keyed on rows of the development-time vocabulary map are
// deleted with their guards. Their evidence is not lost: the retired LABELS are recorded by name in
// RETIRED_LABELS, which the checker's roster gate asserts are no longer emitted.

// -- 1. failureVsErrorRowBacked. Evasion: delete the ROW; five prose lines carrying the bare word
// "failure" kept the old needle green.
const FAILURE_ROW_EVASION = dropLine(BACKING, "the failure-versus-error boundary");

check("failureVsErrorRowBacked: pristine row names Fowler's Refactoring 2e Ch. 4 -> PASS", verdict(ROW_SCOPED_GUARDS.failureVsErrorRowBacked(BACKING)), true);
check("failureVsErrorRowBacked: EVASION (row deleted, prose still says failure) -> FAIL", verdict(ROW_SCOPED_GUARDS.failureVsErrorRowBacked(FAILURE_ROW_EVASION)), false);
check("failureVsErrorRowBacked: OLD file-scoped needle PASSES that same evasion", OLD_NEEDLES.failureVsErrorRowBacked(FAILURE_ROW_EVASION), true);
check("failureVsErrorRowBacked: empty text -> FAIL (anti-vacuity)", verdict(ROW_SCOPED_GUARDS.failureVsErrorRowBacked("")), false);

// -- 2. seamRowBacked. Evasion: delete the ROW; six prose lines carrying "seam" or "handoff" kept the
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

// -- 3. threeLawsRowBacked. Evasion: delete the ROW; the section lead-in kept the old needle green.
const THREE_LAWS_ROW_EVASION = dropLine(BACKING, "| [Three Laws of TDD spine]");

check("threeLawsRowBacked: pristine row names Robert C. Martin -> PASS", verdict(ROW_SCOPED_GUARDS.threeLawsRowBacked(BACKING)), true);
check("threeLawsRowBacked: EVASION (row deleted, section lead-in survives) -> FAIL", verdict(ROW_SCOPED_GUARDS.threeLawsRowBacked(THREE_LAWS_ROW_EVASION)), false);
check("threeLawsRowBacked: OLD file-scoped needle PASSES that same evasion", OLD_NEEDLES.threeLawsRowBacked(THREE_LAWS_ROW_EVASION), true);
check("threeLawsRowBacked: empty text -> FAIL (anti-vacuity)", verdict(ROW_SCOPED_GUARDS.threeLawsRowBacked("")), false);

// -- 4. kanbanEssayNamedInRow. BRIEF-MANDATED EVASION (b): revert the ROW's Source cell to the chapter
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
//
// [lc9] RETARGETED, not deleted. This case previously keyed on a guard retired in this task, and `oneRow`
// is the anti-vacuity SPINE shared by every row-scoped guard in the module -- so losing its proof would
// have quietly removed the only evidence that a duplicated row fails at all. It now duplicates a
// SURVIVING guard's target row, which exercises exactly the same shared code path.
//
// Built with `mutate`, not a bare `.replace`: a silently no-op mutation here would leave PRISTINE text
// under a check that expects FAIL, and while that still fails loudly it does so by accident rather than
// by design. `mutate` asserts the replacement applied, so the protection is deliberate.
const DUPLICATED_THREE_LAWS = mutate(BACKING, /^(\| \[Three Laws of TDD spine\].*)$/m, "$1\n$1");

check("oneRow: a DUPLICATED target row -> FAIL (exactly one, or fail)", verdict(ROW_SCOPED_GUARDS.threeLawsRowBacked(DUPLICATED_THREE_LAWS)), false);
console.log("");

// ---------------------------------------------------------------------------------------------
// Roster shape. A bare emitted-check COUNT is blind to a short swap that happens to balance, so the
// guard NAME SET is asserted here and the emitted LABEL SET is asserted by the checker's roster gate.
// ---------------------------------------------------------------------------------------------

console.log("lib/row-guards.mjs -- export roster (a count alone cannot see a renamed or swapped guard)");
check(
  "ROW_SCOPED_GUARDS exports exactly the four named row-scoped guards",
  Object.keys(ROW_SCOPED_GUARDS).sort(),
  ["failureVsErrorRowBacked", "kanbanEssayNamedInRow", "seamRowBacked", "threeLawsRowBacked"]
);
check(
  "OLD_NEEDLES carries one superseded needle per row-scoped guard",
  Object.keys(OLD_NEEDLES).sort(),
  Object.keys(ROW_SCOPED_GUARDS).sort()
);
check("RETIRED_LABELS carries exactly sixty-four composed labels", RETIRED_LABELS.length, 64);
// [lc9] REPLACES the `/^[a-z-]+\.md: /` shape assertion, which FAILS on four of the 58 added retirements
// -- the auto-generated scaffold label puts its bracket prefix FIRST, the byte-identity label has no
// colon after the filename, the owned-source label has no filename prefix at all, and a
// `testing-stance/` path label carries a slash. Deleting the assertion instead of replacing it was NOT
// an option: its purpose is catching a BARE label value copied out of FILES instead of the composed
// string the checker actually emits, and that hazard is live precisely because of those odd shapes.
//
// All three properties in ONE check, so a single PASS line proves all three: every entry non-empty, the
// list duplicate-free, and every entry carrying either a `.md` filename or a bracketed tag prefix.
//
// WHAT THIS ACTUALLY GUARANTEES, stated precisely because an earlier version of this comment overclaimed
// ("a bare `label` value from FILES has neither, so it can never slip in" -- false). Nearly every FILES
// label opens with a bracketed tag, which `/^\[[^\]]+\] /` ACCEPTS. MEASURED against the departed entry's
// own bare labels, the exact population the 58 retirements were transcribed from: 43 of 43 accepted, 0
// rejected. So the shape leg catches exactly one shape -- a bare label with NEITHER a bracketed tag NOR a
// `.md`, which is the two no-prefix Phase-18 originals -- and nothing else.
//
// The non-empty and duplicate-free legs are the ones that bite generally, and both are falsifiable
// (an appended blank entry and an appended duplicate each flip this check to false).
//
// The real protection against a mistranscribed retirement is NOT this predicate: the roster gate is
// vacuous on a typo by construction, since a mistyped retired label is trivially "not emitted". It is
// that the 58 were transcribed from a CAPTURED RUN of the pre-change battery and then verified 58/58
// exact against that captured label array. Keep that provenance in mind before trusting this leg.
check(
  "RETIRED_LABELS are non-empty, duplicate-free, and each carries a filename or a bracketed tag",
  RETIRED_LABELS.every((label) => label.trim() !== "" && (label.includes(".md") || /^\[[^\]]+\] /.test(label))) &&
    new Set(RETIRED_LABELS).size === RETIRED_LABELS.length,
  true
);

console.log("");

if (failures === 0) {
  console.log("SUMMARY: row-guards self-test GREEN -- all assertions pass");
  process.exit(0);
}

console.log(`SUMMARY: row-guards self-test RED -- ${failures} assertion(s) FAILED`);
process.exit(1);
