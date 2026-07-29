// quick-260729-2ig ROW-SCOPED and COUNT-RE-DERIVATION guards for check-red-references.mjs.
//
// Every export here is a PURE function returning `{ ok, why }`, so it maps 1:1 onto the checker's
// existing `report(ok, label, detail)` funnel and onto an in-memory selftest fixture. Node builtins
// only, no deps. lib/provenance-honesty.mjs -- the precedent this file copies -- stays byte-unchanged.
//
// WHY THIS MODULE EXISTS. Two defect classes got through a 146/146 GREEN battery:
//
//   1. ROW-SCOPED DEFECT. Six guards named a specific table row in their own LABEL while their needle
//      matched ANYWHERE in the file. Decoy prose (a Sources bullet, a section lead-in, a cross-link)
//      kept them PASSing with the row gone; the worst had FIVE decoys. Fix: parse the row, key on its
//      FULL name, and assert the specific cell.
//   2. UNDERIVED COUNT. Every stated total is written as a NUMBER WORD, and nothing checked it against
//      the list it summarises. Fix: derive N from the authoritative list, then assert BOTH the SITE
//      COUNT and every stated word against NUM_WORDS[N]. The SITE COUNT is the load-bearing half --
//      without it, DELETING a stated total passes silently, and a presence check for the expected word
//      cannot catch a deletion at all.
//
// TWO INVARIANTS THIS MODULE ENFORCES ON ITSELF:
//
//   * EXACTLY ONE ROW, OR FAIL (`oneRow`). A lookup that quietly finds ZERO rows and reports "no
//     violations" is the wev R1 defect class reintroduced -- a guard that cannot fail is worse than no
//     guard. Every row lookup here is exactly-one-or-FAIL, and the `why` names how many were found.
//   * FLATTEN BEFORE MATCHING (`flat`). The checker's own `topics` and `absent` mechanisms match PER
//     LINE, so any multi-word needle is defeated by a wrap at the ~100-column margin -- the checker
//     already carries a comment recording that exact bite on the anti-patterns guard. Every multi-word
//     and every count needle in this module runs against whitespace-flattened text.
//
// Exported for the self-test in tools/row-guards.selftest.mjs.
import { parseRows } from "./pipe-table.mjs";

// ---------------------------------------------------------------------------------------------
// Shared internals
// ---------------------------------------------------------------------------------------------

// Column indices keyed BY NAME, never by a magic number at the call site.
const TAXONOMY_COLUMNS = 9;
const TAXONOMY_HEADER = "Author";
const TAX = {
  Author: 0,
  Term: 1,
  Where: 2,
  StandsFor: 3,
  Lifetime: 4,
  DefiningProperty: 5,
  DefinesOrUses: 6,
  Source: 7,
  Tier: 8,
};

const BACKING_COLUMNS = 3;
const BACKING_HEADER = "Recommendation";
const BACKING = { Recommendation: 0, Source: 1, Tier: 2 };

// Whitespace-normalised whole text. MANDATORY for every multi-word and every count needle -- see the
// FLATTEN BEFORE MATCHING invariant above.
const flat = (text) => text.replace(/\s+/g, " ");

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

const taxonomyRows = (text) => parseRows(text, TAXONOMY_COLUMNS, TAXONOMY_HEADER);
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

export const ROW_SCOPED_GUARDS = {
  failureVsErrorRowBacked,
  seamRowBacked,
  threeLawsRowBacked,
  kanbanEssayNamedInRow,
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

// ---------------------------------------------------------------------------------------------
// (B) Nine COUNT RE-DERIVATION guards
// ---------------------------------------------------------------------------------------------

// Every stated total in these documents is a NUMBER WORD, so the comparison is word-to-word.
const NUM_WORDS = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
];
// CARDINALS ONLY. An ordinal in the alternation produces false sites -- "a FOURTH claimant" in the
// candidate survey is the live example.
const CARDINAL_ALT = NUM_WORDS.join("|");

const statedCardinals = (text, nounSource) => {
  const re = new RegExp(`\\b(${CARDINAL_ALT})\\s+${nounSource}`, "gi");

  return [...flat(text).matchAll(re)].map((match) => match[1].toLowerCase());
};

// Assert BOTH halves: the number of SITES stating this total, and the word at every one of them.
// The site count is what makes a DELETED total fail; the word check is what makes a WRONG total fail.
const assertStatedTotal = ({ texts, derived, nounSource, expectedSites, subject }) => {
  if (!Number.isInteger(derived) || derived < 0 || derived >= NUM_WORDS.length) {
    return fail(`${subject}: derivation produced ${derived}, which is not a stateable cardinal`);
  }

  const words = texts.flatMap((text) => statedCardinals(text, nounSource));

  if (words.length !== expectedSites) {
    return fail(
      `${subject}: expected ${expectedSites} site(s) stating this total, found ${words.length} [${words.join(", ")}]`
    );
  }

  const expectedWord = NUM_WORDS[derived];
  const wrong = words.filter((word) => word !== expectedWord);

  if (wrong.length > 0) {
    return fail(
      `${subject}: derived ${derived} ("${expectedWord}") but ${wrong.length} site(s) state [${wrong.join(", ")}]`
    );
  }

  return ok();
};

// -- derivations -------------------------------------------------------------------------------

// Top-level `- ` bullets between `## Sources` and the next `## `. Returns -1 when the heading is
// missing, so a vanished section FAILS rather than deriving 0 and looking like a content bug.
const sourceBulletCount = (text) => {
  const lines = text.split(/\r?\n/);
  const start = lines.findIndex((line) => /^## Sources\s*$/.test(line));

  if (start === -1) {
    return -1;
  }

  let end = lines.length;

  for (let i = start + 1; i < lines.length; i++) {
    if (/^## /.test(lines[i])) {
      end = i;
      break;
    }
  }

  return lines.slice(start + 1, end).filter((line) => /^- /.test(line)).length;
};

// The `Axis one/two/three,` blocks, and the VALUE BULLETS under each. A bullet's wrapped continuation
// lines are indented, so the walk stops at the first non-blank line that is neither a bullet nor a
// continuation -- which is the next axis block or the paragraph after the last one.
const axisValueCounts = (text) => {
  const lines = text.split(/\r?\n/);
  const starts = [];

  lines.forEach((line, index) => {
    if (/^Axis (one|two|three),/.test(line)) {
      starts.push(index);
    }
  });

  return starts.map((start) => {
    let count = 0;

    for (let i = start + 1; i < lines.length; i++) {
      const line = lines[i];

      if (line.trim() === "" || /^ {2}\S/.test(line)) {
        continue;
      }

      if (/^- /.test(line)) {
        count++;
        continue;
      }

      break;
    }

    return count;
  });
};

const productionOwnTransitionalRows = (text) =>
  taxonomyRows(text).filter(
    (r) =>
      r[TAX.Where] === "Production" &&
      r[TAX.StandsFor] === "Own implementation" &&
      r[TAX.Lifetime] === "Transitional"
  );

// The kinds enumeration: a run of consecutive lines each carrying a backticked term ALONE. That shape
// is the discriminator ON PURPOSE -- it depends on no prose wording, and it cannot collide with the
// candidate survey in section 5, whose every bullet carries ` -- reason` after the term. MEASURED: the
// pre-edit document contains ZERO lines of this shape.
const enumerationRuns = (text) => {
  const lines = text.split(/\r?\n/);
  const runs = [];
  let current = null;

  for (const line of lines) {
    const match = /^- `([^`]+)`\s*$/.exec(line);

    if (match) {
      if (!current) {
        current = [];
        runs.push(current);
      }

      current.push(match[1]);
      continue;
    }

    current = null;
  }

  return runs;
};

// -- the nine guards ---------------------------------------------------------------------------

// SITES ARE PINNED TO THE POST-EDIT VALUE, not to the pre-edit measurement, because the content edits
// in the same task DELETE sites these guards count. Pre/post arithmetic per guard is recorded in
// 260729-2ig-RED-BASELINE.md so a post-edit FAIL can never be misdiagnosed as an instrument bug.

export const twelveSources = (text) =>
  assertStatedTotal({
    texts: [text],
    derived: sourceBulletCount(text),
    nounSource: "sources\\b",
    expectedSites: 2,
    subject: "mapped-source count",
  });

export const eightCellsFromAxes = (text) => {
  const counts = axisValueCounts(text);

  if (counts.length === 0) {
    return fail("cell count: no axis block found, so the product cannot be derived");
  }

  if (counts.some((count) => count < 2)) {
    return fail(`cell count: an axis carries fewer than two values [${counts.join(", ")}]`);
  }

  // The PRODUCT of the measured per-axis value counts. Never a literal 8, never `2 ** 3`, and never a
  // hardcoded 2 per axis -- a hardcoded total in a derivation costume is the guard-in-name-only
  // category this round exists to delete. Derived from the AXES, never from the cell bullet list,
  // because the content edits remove two of those bullets.
  const product = counts.reduce((total, count) => total * count, 1);

  return assertStatedTotal({
    texts: [text],
    derived: product,
    nounSource: "cells\\b",
    expectedSites: 1,
    subject: "cell count",
  });
};

export const threeAxes = (text) =>
  assertStatedTotal({
    texts: [text],
    derived: axisValueCounts(text).length,
    nounSource: "axes\\b",
    expectedSites: 3,
    subject: "axis count",
  });

export const sixRowsInCell = (text) => {
  const rows = taxonomyRows(text);

  if (rows.length === 0) {
    return fail("cell row count: the per-author table parsed to ZERO rows");
  }

  return assertStatedTotal({
    texts: [text],
    derived: productionOwnTransitionalRows(text).length,
    nounSource: "rows\\b",
    expectedSites: 2,
    subject: "cell row count",
  });
};

// The ONLY guard that reads two files, and it still emits ONE report: the count is restated in the
// dependent's taxonomy row, so both sites belong to one claim. Emitting one report per file would make
// the measured total 173 and fail the roster equality gate for the wrong reason.
export const fourOwnedSourcesName = (taxonomyText, backingText) => {
  const cellRows = productionOwnTransitionalRows(taxonomyText);

  if (cellRows.length === 0) {
    return fail("owned-source count: no row lands in the production-side transitional cell");
  }

  const untiered = cellRows.filter((r) => !/^Owned\b/.test(r[TAX.Tier]));

  if (untiered.length > 0) {
    return fail(
      `owned-source count: ${untiered.length} row(s) in that cell are not tiered Owned [${untiered.map((r) => r[TAX.Term]).join(", ")}]`
    );
  }

  return assertStatedTotal({
    texts: [taxonomyText, backingText],
    derived: new Set(cellRows.map((r) => r[TAX.Author])).size,
    nounSource: "owned sources name",
    expectedSites: 2,
    subject: "owned-source count",
  });
};

// Derive the count from the ENUMERATION, never from the rows: the author carries NINE rows in this
// table, and deriving 5 from 9 would need ad-hoc prose sniffs on a defining-property cell -- the exact
// wording-coupling that forced two guards to be REMOVED last round. The enumeration is the single
// source of truth for the NUMBER; the rows are what each enumerated name must RESOLVE to.
export const fiveKindsEnumerated = (text) => {
  const runs = enumerationRuns(text);

  if (runs.length !== 1) {
    return fail(`kinds enumeration: expected exactly ONE enumeration run, found ${runs.length}`);
  }

  const [enumerated] = runs;
  const terms = new Set(
    taxonomyRows(text)
      .filter((r) => r[TAX.Author] === "Gerard Meszaros")
      .map((r) => r[TAX.Term].replace(/`/g, ""))
  );
  const unresolved = enumerated.filter((name) => !terms.has(name.replace(/`/g, "")));

  if (unresolved.length > 0) {
    return fail(
      `kinds enumeration: ${unresolved.length} enumerated name(s) resolve to no Gerard Meszaros row [${unresolved.join(", ")}]`
    );
  }

  return assertStatedTotal({
    texts: [text],
    derived: enumerated.length,
    nounSource: "kinds\\b",
    expectedSites: 8,
    subject: "kinds count",
  });
};

export const threeFurtherQualifiers = (text) =>
  assertStatedTotal({
    texts: [text],
    derived: text.split(/\r?\n/).filter((line) => /^\d+\. /.test(line)).length,
    nounSource: "further qualifiers\\b",
    expectedSites: 1,
    subject: "closing-qualifier count",
  });

// The section-5 candidate survey. Every candidate bullet carries an explicit verdict token, so BOTH
// the survey size and the colliding subset are derivable, and an UNLABELLED candidate bullet fails
// rather than being silently skipped.
export const ambiguitySurveyCount = (text) => {
  const lines = text.split(/\r?\n/);
  const open = lines.findIndex((line) => /^## 5\./.test(line));
  const close = lines.findIndex((line) => /^## 6\./.test(line));

  if (open === -1 || close === -1 || close <= open) {
    return fail("ambiguity survey: could not bound section 5 between its own heading and section 6");
  }

  const block = lines.slice(open, close);
  const bullets = block.filter((line) => /^- /.test(line));
  const collides = bullets.filter((line) => /\bCOLLIDES\b/.test(line));
  const noCollision = bullets.filter((line) => /\bNO COLLISION\b/.test(line));
  const surveyed = collides.length + noCollision.length;

  if (surveyed === 0) {
    return fail("ambiguity survey: no candidate bullet carries a verdict token");
  }

  if (surveyed !== bullets.length) {
    return fail(
      `ambiguity survey: ${bullets.length} candidate bullet(s) but only ${surveyed} carry a verdict token`
    );
  }

  const total = assertStatedTotal({
    texts: [text],
    derived: surveyed,
    nounSource: "candidates\\b",
    expectedSites: 1,
    subject: "surveyed-candidate count",
  });

  if (!total.ok) {
    return total;
  }

  return assertStatedTotal({
    texts: [text],
    derived: collides.length,
    nounSource: "of them collide\\b",
    expectedSites: 1,
    subject: "colliding-candidate count",
  });
};

// Machine-enforces the doctrine the document already states in prose: the one row that places no
// artifact carries an explicit not-applicable value rather than a blank, so an empty cell is never
// left to be read as a claim.
export const noEmptyDataCell = (text) => {
  const rows = taxonomyRows(text);

  if (rows.length === 0) {
    return fail("empty-cell check: the per-author table parsed to ZERO rows");
  }

  const offenders = [];

  rows.forEach((cells, index) => {
    cells.forEach((cell, column) => {
      if (cell === "") {
        offenders.push(`row ${index + 1} column ${column + 1}`);
      }
    });
  });

  if (offenders.length > 0) {
    return fail(`empty-cell check: ${offenders.length} empty data cell(s) -- ${offenders.join("; ")}`);
  }

  return ok();
};

export const COUNT_GUARDS = {
  twelveSources,
  eightCellsFromAxes,
  threeAxes,
  sixRowsInCell,
  fourOwnedSourcesName,
  fiveKindsEnumerated,
  threeFurtherQualifiers,
  ambiguitySurveyCount,
  noEmptyDataCell,
};
