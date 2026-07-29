// quick-260729-2ig ROW PARSER. One exported pure function over a GitHub pipe table, node builtins
// only, no deps -- deliberately mirroring lib/provenance-honesty.mjs (which stays byte-unchanged).
//
// WHY a parser at all: six guards in check-red-references.mjs named a specific table row in their own
// LABEL while matching anywhere in the file, so the row could be deleted outright and the guard still
// reported PASS -- the worst of them had FIVE decoy prose lines. Row-scoping needs cells, and cells
// need a parse. See lib/row-guards.mjs for the guards themselves.
//
// This is NOT a Markdown parser and must never become one. It handles exactly the shape both target
// documents actually use, and FAILS CLOSED on anything else: a row whose cell count does not match is
// SKIPPED rather than guessed at, and row-guards.mjs turns "row not found" into a loud FAIL via its
// exactly-one-row rule. A skipped row can therefore never pass silently.
//
// MEASURED against both targets at authoring time (2026-07-29), which is what makes the narrow shape
// safe TODAY:
//   test-double-taxonomy.md -- 36 lines start with `|`, every one splits to exactly 11 parts
//     (9 columns), 1 separator row, 1 header row, 34 data rows, 0 empty data cells, 0 escaped pipes,
//     0 pipes inside code spans.
//   principle-backing.md    -- 37 lines start with `|`, every one splits to exactly 5 parts
//     (3 columns), 2 separator rows, 2 header rows, 33 data rows, 0 empty data cells.
// The two principle-backing tables share a column count and a header first cell, so ONE call returns
// the data rows of BOTH. That is wanted: every guard over that file asks about a row, not about which
// of the two tables holds it.
//
// Exported for the self-test in tools/row-guards.selftest.mjs.

// A separator cell: three or more dashes, optionally colon-aligned on either side.
const SEPARATOR_CELL_RE = /^:?-{3,}:?$/;

/**
 * Data rows of a GitHub pipe table, as arrays of trimmed cell strings.
 *
 * @param {string} text            whole document text
 * @param {number} columnCount     required cell count; a row of any other width is SKIPPED
 * @param {string} headerFirstCell first cell of the header row, matched BY VALUE not by position
 * @returns {string[][]}           one array of trimmed cells per data row, in document order
 */
export function parseRows(text, columnCount, headerFirstCell) {
  const rows = [];

  for (const line of text.split(/\r?\n/)) {
    if (!line.startsWith("|")) {
      continue;
    }

    // Drop the two empty ends produced by the leading and trailing pipe.
    const cells = line.split("|").slice(1, -1).map((cell) => cell.trim());

    // Width mismatch: SKIP. Never guess at which cell is missing -- the caller's exactly-one-row
    // rule reports the resulting absence as a failure, so this fails closed.
    if (cells.length !== columnCount) {
      continue;
    }

    if (cells.every((cell) => SEPARATOR_CELL_RE.test(cell))) {
      continue;
    }

    // Header dropped BY VALUE, so a table that gains a leading caption row does not lose a data row
    // (and a document with two same-shaped tables drops both headers).
    if (cells[0] === headerFirstCell) {
      continue;
    }

    rows.push(cells);
  }

  return rows;
}
