// quick-260729-2ig ROW-SCOPED guards for check-red-references.mjs, narrowed by quick-260729-lc9.
//
// Every export here is a PURE function returning `{ ok, why }`, so it maps 1:1 onto the checker's
// existing `report(ok, label, detail)` funnel and onto an in-memory selftest fixture. Node builtins
// only, no deps. lib/provenance-honesty.mjs -- the precedent this file copies -- stays byte-unchanged.
//
// WHY THIS MODULE EXISTS. A defect class got through a 146/146 GREEN battery: six guards named a
// specific table row in their own LABEL while their needle matched ANYWHERE in the file. Decoy prose (a
// Sources bullet, a section lead-in, a cross-link) kept them PASSing with the row gone; the worst had
// FIVE decoys. Fix: parse the row, key on its FULL name, and assert the specific cell.
//
// [lc9] SCOPE NOW. Four row-scoped guards, all over principle-backing.md. The count-re-derivation half
// of this module -- and the two row-scoped guards keyed on rows of the development-time test-double
// vocabulary map, plus the backing row that LINKED to it -- retired when that document left the shipped
// tree. Every retired guard is recorded BY NAME in RETIRED_LABELS below, and the checker's roster gate
// asserts none of those labels is still emitted; that is what makes a retirement an assertion rather
// than an absence. The dead helper surface was deleted in a SEPARATE commit from the retirement, so the
// emitted-check count is provably unchanged by the deletion -- the mechanical evidence that only
// unreferenced code went.
//
// THE INVARIANT THIS MODULE ENFORCES ON ITSELF: EXACTLY ONE ROW, OR FAIL (`oneRow`). A lookup that
// quietly finds ZERO rows and reports "no violations" is the wev R1 defect class reintroduced -- a guard
// that cannot fail is worse than no guard. Every row lookup here is exactly-one-or-FAIL, and the `why`
// names how many were found. The selftest proves it with a DUPLICATED-row fixture as well as an
// empty-text one, because finding two is as wrong as finding none.
//
// Exported for the self-test in tools/row-guards.selftest.mjs.
import { parseRows } from "./pipe-table.mjs";

// ---------------------------------------------------------------------------------------------
// Shared internals
// ---------------------------------------------------------------------------------------------

// Column indices keyed BY NAME, never by a magic number at the call site.
const BACKING_COLUMNS = 3;
const BACKING_HEADER = "Recommendation";
const BACKING = { Recommendation: 0, Source: 1, Tier: 2 };

const ok = () => ({ ok: true, why: "" });
const fail = (why) => ({ ok: false, why });

// Exactly one matching row, or a failure naming how many were found. The anti-vacuity spine.
const oneRow = (rows, predicate, description) => {
  const matches = rows.filter(predicate);

  if (matches.length !== 1) {
    return { row: null, why: `expected exactly ONE ${description}, found ${matches.length}` };
  }

  return { row: matches[0], why: "" };
};

const backingRows = (text) => parseRows(text, BACKING_COLUMNS, BACKING_HEADER);

// ---------------------------------------------------------------------------------------------
// (A) Four ROW-SCOPED guards, all over principle-backing.md
// ---------------------------------------------------------------------------------------------

// Shared shape: resolve exactly one row by its FULL name, then assert one named cell.
const rowCellGuard = ({ rows, predicate, description, column, columnName, cellRe, expectation }) => {
  const { row, why } = oneRow(rows, predicate, description);

  if (!row) {
    return fail(why);
  }

  if (!cellRe.test(row[column])) {
    return fail(`${description}: its ${columnName} cell does not ${expectation} -- cell reads "${row[column]}"`);
  }

  return ok();
};

// [lc9] The two guards keyed on rows of the development-time vocabulary map are RETIRED, by name, in
// RETIRED_LABELS below. They are not retargeted at the archived copy: a frozen record has no regression
// surface, so a guard over it could only fail on a deliberate archive edit -- the guard-that-cannot-fail
// class in a new costume.

// Replaces `[j9m] failure-vs-error boundary row`, whose needle /failure|error boundary/i was satisfied
// by FIVE prose lines -- the bare word "failure" appears throughout the retagging discussion.
export const failureVsErrorRowBacked = (text) =>
  rowCellGuard({
    rows: backingRows(text),
    predicate: (r) => /failure-versus-error boundary/i.test(r[BACKING.Recommendation]),
    description: "the failure-versus-error boundary backing row",
    column: BACKING.Source,
    columnName: "Source",
    cellRe: /Fowler[\s\S]*Refactoring 2nd Edition Ch\. 4/i,
    expectation: "name Fowler's Refactoring 2e Ch. 4",
  });

// Replaces `lz-tpp seam backing row` (a Phase-18 original, NO bracket prefix), whose needle
// /seam|handoff/i was satisfied by SIX prose lines. Asserts the CANONICAL no-oracle tier string, not
// merely a non-empty tier: a bare non-empty check cannot fail on this table and is not acceptable.
export const seamRowBacked = (text) =>
  rowCellGuard({
    rows: backingRows(text),
    predicate: (r) => /Classify-first and the forward lz-tpp handoff/i.test(r[BACKING.Recommendation]),
    description: "the classify-first / forward lz-tpp handoff backing row",
    column: BACKING.Tier,
    columnName: "Access tier",
    cellRe: /^Unowned; high-confidence core only \(no-oracle\)\.?$/i,
    expectation: "match the canonical no-oracle tier string",
  });

// [lc9] The guard asserting the backing row that LINKED to the vocabulary map is RETIRED too, because
// the row it asserted about is DELETED -- the whole row described a document no longer in the tree. A
// guard whose subject is gone must retire, not retarget.

// Replaces `Three Laws backing row` (a Phase-18 original, NO bracket prefix), which the section
// lead-in kept PASSing.
export const threeLawsRowBacked = (text) =>
  rowCellGuard({
    rows: backingRows(text),
    predicate: (r) => /Three Laws of TDD spine/i.test(r[BACKING.Recommendation]),
    description: "the Three Laws of TDD spine backing row",
    column: BACKING.Source,
    columnName: "Source",
    cellRe: /Robert C\. Martin/,
    expectation: "name Robert C. Martin",
  });

// Replaces `[wev G16]`, which a prose bullet kept PASSing. Asserts the row names the owned ESSAY and
// NOT the book: the D-05 honesty gate fails any row citing the book with a tier beginning `Owned`, so
// a revert to the book would be caught twice -- but only if this guard looks at the ROW's own cell.
export const kanbanEssayNamedInRow = (text) => {
  const guard = rowCellGuard({
    rows: backingRows(text),
    predicate: (r) => /clear the compile error/i.test(r[BACKING.Recommendation]),
    description: "the clear-the-compile-error backing row",
    column: BACKING.Source,
    columnName: "Source",
    cellRe: /TDD is Kanban for Code/,
    expectation: "name the owned kanban-cycle essay",
  });

  if (!guard.ok) {
    return guard;
  }

  const { row } = oneRow(
    backingRows(text),
    (r) => /clear the compile error/i.test(r[BACKING.Recommendation]),
    "the clear-the-compile-error backing row"
  );

  if (/Test-Driven Development by Example/i.test(row[BACKING.Source])) {
    return fail("the clear-the-compile-error backing row cites the BOOK, not the owned essay");
  }

  return ok();
};

// [lc9] Replaces the principle-backing.md half of the N7 attribution gate, whose needle was a BARE
// file-wide `includes("Fowler's label")` under a label naming a SUBJECT (the mockist label) and an
// ATTRIBUTION RELATION that five words matched anywhere could not constrain. The attribution lives in
// this row's SOURCE cell, and this file already had the row machinery, so the gate now uses it: the row
// could be emptied of the attribution while a Sources bullet or a prose cross-link kept the old needle
// green. Aggravating in the original, and the reason this is a row guard rather than a tighter regex --
// the module's own header condemns exactly this shape.
export const mockistCounterpointRowAttributed = (text) =>
  rowCellGuard({
    rows: backingRows(text),
    predicate: (r) => /Mockist counterpoint/i.test(r[BACKING.Recommendation]),
    description: "the mockist counterpoint backing row",
    column: BACKING.Source,
    columnName: "Source",
    cellRe: /Fowler's label/i,
    expectation: "attribute the school name to Fowler",
  });

export const ROW_SCOPED_GUARDS = {
  failureVsErrorRowBacked,
  seamRowBacked,
  threeLawsRowBacked,
  kanbanEssayNamedInRow,
  mockistCounterpointRowAttributed,
};

// The superseded file-scoped needles, replicated here EXACTLY as the checker evaluated them
// (per line, over the whole file). They exist for one purpose: the selftest asserts each one PASSES on
// the same evasion fixture its replacement FAILS, so the "catches an evasion the old guard passed"
// evidence is COMMITTED rather than thrown away in a scratchpad. One entry per surviving row-scoped
// guard, and the selftest asserts that parity so the two sets cannot drift apart.
const fileScoped = (re) => (text) => text.split(/\r?\n/).some((line) => re.test(line));

export const OLD_NEEDLES = {
  failureVsErrorRowBacked: fileScoped(/failure|error boundary/i),
  seamRowBacked: fileScoped(/seam|handoff/i),
  threeLawsRowBacked: fileScoped(/three laws/i),
  kanbanEssayNamedInRow: fileScoped(/TDD is Kanban for Code/),
  // [lc9] The N7 attribution needle as the checker evaluated it: a bare file-wide substring test, with
  // nothing tying it to the mockist subject or to the row that carries the attribution.
  mockistCounterpointRowAttributed: fileScoped(/Fowler's label/),
};

// The SIXTY-FOUR retired labels AS EMITTED. The checker composes `<filename>: <label>` inside the FILES
// loop and emits a post-loop label verbatim, so these are the strings the roster gate's retired-label
// assertion must look for -- NOT the bare `label` values in FILES. Getting the composition wrong makes
// the assertion VACUOUSLY TRUE: a mistyped retired label is trivially "not emitted", so the roster gate
// is blind to a transcription error by construction, which is why these were transcribed from a CAPTURED
// RUN of the pre-change battery rather than from the source or from memory.
//
// SHAPES VARY, and three of them are the likely transcription errors:
//   * two Phase-18 originals carry NO bracket prefix at all;
//   * the auto-generated scaffold label puts its bracket prefix FIRST, before the filename;
//   * the byte-identity label has NO colon after the filename;
//   * the owned-source count label has no filename prefix at all, because it reported across two files.
// Adding a prefix that does not exist, or normalising a shape, would make that entry unmatchable.
//
// [lc9] +58. The six above are the [2ig] round's. The 58 below are the whole surface that read the
// development-time vocabulary map, retired when that document left the shipped tree: its FILES entry
// (29 topics + 14 absent guards + 1 auto scaffold check), the sha256 byte-identity gate, its two
// row-scoped guards, the backing row that LINKED to it, the nine count guards, and the chronology phrase
// gate. Recording them BY NAME is what separates a deliberate retirement from an accidental drop --
// without this list the two are the same green run.
export const RETIRED_LABELS = [
  "principle-backing.md: Three Laws backing row",
  "principle-backing.md: lz-tpp seam backing row",
  "principle-backing.md: [j9m] test-double taxonomy backing row",
  "principle-backing.md: [j9m] failure-vs-error boundary row",
  "principle-backing.md: [wev G16] kanban-cycle essay named as the owned surface",
  "test-double-taxonomy.md: [wev G8] Bernhardt row names a specific delivery",
  "test-double-taxonomy.md: [j9m] table of contents",
  "test-double-taxonomy.md: [j9m] lifetime axis",
  "test-double-taxonomy.md: [j9m] bare-stub collision headline",
  "test-double-taxonomy.md: [j9m] defines-vs-uses column",
  "test-double-taxonomy.md: [j9m] Self Shunt disclosure model",
  "test-double-taxonomy.md: [j9m] Saboteur polarity caveat",
  "test-double-taxonomy.md: [j9m] Overspecified Software citation",
  "test-double-taxonomy.md: [j9m] Cooper false-friend caveat",
  "test-double-taxonomy.md: [j9m] degraded-scan confidence caveat",
  "test-double-taxonomy.md: [j9m] appendices not exhaustive",
  "test-double-taxonomy.md: [j9m] authority is per cell",
  "test-double-taxonomy.md: [j9m] Meszaros scoped as a reference frame, not the spine",
  "test-double-taxonomy.md: [j9m] inherited disagreement named",
  "test-double-taxonomy.md: [j9m] no declared precedence for the TDD content sources",
  "test-double-taxonomy.md: [wev G6] three-axis count named",
  "test-double-taxonomy.md: [wev G7] never-assert-an-empty-cell doctrine stated",
  "test-double-taxonomy.md: [wev G9] tier assertions are version-bound",
  "test-double-taxonomy.md: [wev G10] transcript mistranscription named",
  "test-double-taxonomy.md: [wev G13] independent vocabularies, no seniority claim",
  "test-double-taxonomy.md: [2ig] five-kind count attributed to the hierarchy figure",
  "test-double-taxonomy.md: [2ig] prose states four by folding two members",
  "test-double-taxonomy.md: [2ig] the five kinds enumerated as direct subtypes",
  "test-double-taxonomy.md: [2ig] naming citation versus meaning citation",
  "test-double-taxonomy.md: [2ig] Temporary Test Stub relationship on the lifecycle axis",
  "test-double-taxonomy.md: [2ig] contested-word absence hedged to the swept scope",
  "test-double-taxonomy.md: [2ig] numeral absence hedged to the parts read end to end",
  "test-double-taxonomy.md: [2ig] positive remote-variant finding across an address space",
  "test-double-taxonomy.md: [2ig] do-nothing hook is the real near-miss trap",
  "test-double-taxonomy.md: [2ig] non-optional kanban qualifier carried",
  "[j9m] test-double-taxonomy.md: no scaffold phrase",
  "test-double-taxonomy.md: [wev G1] no invented term",
  "test-double-taxonomy.md: [wev G2] no empty-cell assertion",
  "test-double-taxonomy.md: [wev G3] no skill-relative self-reference",
  "test-double-taxonomy.md: [wev G4] no unaudited-mapping caveat",
  "test-double-taxonomy.md: [wev G5] no degraded-scan carve-out",
  "test-double-taxonomy.md: [wev G11] no non-occurring Metz term",
  "test-double-taxonomy.md: [wev G12] no superseded two-axis or four-cell wording",
  "test-double-taxonomy.md: [2ig] no set-scoped emptiness assertion",
  "test-double-taxonomy.md: [2ig] no deliberate-negative intent inference",
  "test-double-taxonomy.md: [2ig] no every-available-name universal quantifier",
  "test-double-taxonomy.md: [2ig] no possessive five-kinds attribution",
  "test-double-taxonomy.md: [2ig] no two-appendix count",
  "test-double-taxonomy.md: [2ig] no only-occurrence skeleton phrasing",
  "test-double-taxonomy.md: [gap] no chronology or seniority token",
  "[j9m] test-double-taxonomy.md byte-identical across all three skills",
  "test-double-taxonomy.md: [2ig] Bernhardt row names a specific delivery",
  "test-double-taxonomy.md: [2ig] Temporary Test Stub row states its relationship",
  "principle-backing.md: [2ig] test-double taxonomy ROW backed",
  "test-double-taxonomy.md: [2ig] mapped-source count re-derived",
  "test-double-taxonomy.md: [2ig] cell count re-derived from the axes",
  "test-double-taxonomy.md: [2ig] axis count re-derived",
  "test-double-taxonomy.md: [2ig] cell row count re-derived",
  "[2ig] owned-source count re-derived across both files",
  "test-double-taxonomy.md: [2ig] kinds count re-derived from the enumeration",
  "test-double-taxonomy.md: [2ig] closing-qualifier count re-derived",
  "test-double-taxonomy.md: [2ig] ambiguity survey counts re-derived",
  "test-double-taxonomy.md: [2ig] no empty data cell in the per-author table",
  "test-double-taxonomy.md: [gap] no chronology or seniority phrase (wrap-proof)",
];
