// quick-260729-2ig ROW PARSER, widened by quick-260729-lc9. THREE exported pure functions over a
// GitHub pipe table and the inline links around it -- parseRows, scanTables, findLinkTargets -- plus
// ONE shared cell splitter behind all of them. Node builtins only, no deps, deliberately mirroring
// lib/provenance-honesty.mjs (which stays byte-unchanged).
//
// WHY a parser at all: six guards in check-red-references.mjs named a specific table row in their own
// LABEL while matching anywhere in the file, so the row could be deleted outright and the guard still
// reported PASS -- the worst of them had FIVE decoy prose lines. Row-scoping needs cells, and cells
// need a parse. See lib/row-guards.mjs for the guards themselves.
//
// WHY THE SPLIT IS SHARED (quick-260729-lc9). `parseRows` SKIPS a row whose width does not match, and
// `scanTables` FAILS a row whose width does not match its header. If the two disagreed about how wide a
// row is, the shape guard would report clean while the parser silently dropped the row -- the
// delimiter-evasion class this module exists to close, reintroduced between its own two consumers. So
// there is exactly ONE splitter, `splitCells`, and both call it. It is aware of a backslash-escaped
// pipe, which a bare `line.split("|")` miscounts as a cell boundary.
//
// SCOPE. `parseRows` has exactly ONE cell-level target left: principle-backing.md. The second target it
// was originally measured against was the test-double vocabulary map, which quick-260729-lc9 removed
// from the shipped tree entirely -- so that document's census is deleted here rather than carried under
// a new heading, because a measurement of a file this module no longer reads is a stale claim by
// construction. The general rule, which every comment in this workspace's instruments follows: state
// the invariant, not a number a later change can falsify.
//
// MEASURED against that one target at authoring time (2026-07-29), which is what makes the narrow shape
// safe TODAY:
//   principle-backing.md    -- 37 lines start with `|`, every one splits to exactly 5 parts
//     (3 columns), 2 separator rows, 2 header rows, 33 data rows, 0 empty data cells.
// The two principle-backing tables share a column count and a header first cell, so ONE call returns
// the data rows of BOTH. That is wanted: every guard over that file asks about a row, not about which
// of the two tables holds it.
//
// `scanTables` and `findLinkTargets`, by contrast, are GENERAL over any tree a caller hands them, so
// they carry no per-file measurement at all and none may be added: their callers assert what they SAW
// each run, via an anti-vacuity leg on a seen-count, which is a live assertion where a comment is not.
//
// This is NOT a Markdown parser and must never become one. It handles exactly the shape these
// documents actually use, and FAILS CLOSED on anything else: a row whose cell count does not match is
// SKIPPED rather than guessed at, and row-guards.mjs turns "row not found" into a loud FAIL via its
// exactly-one-row rule. A skipped row can therefore never pass silently.
//
// `scanTables` and `findLinkTargets` are the two general scanners added by quick-260729-lc9. Both are
// pure and disk-free so their classification is fixture-testable, and both are FENCE-AWARE: a fenced
// line is neither a table row nor a link site, and it closes any table that was open. Neither can
// report a problem on empty text -- "no ragged tables" and "no links" are both true of an empty
// document -- so each caller in check-red-references.mjs carries its own anti-vacuity leg on the count
// of things it actually saw.
//
// Exported for the self-test in tools/row-guards.selftest.mjs.

// A separator cell: three or more dashes, optionally colon-aligned on either side.
const SEPARATOR_CELL_RE = /^:?-{3,}:?$/;

// A fence open or close: up to three leading spaces, then three or more backticks or tildes. The
// CHARACTER has to match for a fence to close, so a tilde fence inside a backtick fence does not end it.
const FENCE_RE = /^\s{0,3}(`{3,}|~{3,})/;

// One inline link. The target excludes whitespace and `)`, and an optional quoted title is consumed so
// it never lands in the captured target.
const LINK_RE = /\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;

/**
 * THE one cell splitter. Trimmed cells of a pipe-table line, with the two empty ends produced by the
 * leading and trailing pipe already dropped.
 *
 * A backslash-escaped pipe is part of its cell, not a boundary: `a \| b` is ONE cell. `line.split("|")`
 * counts it as two, which reports a well-formed row as ragged.
 *
 * @param {string} line a single line that starts with `|`
 * @returns {string[]}  trimmed cells, in order
 */
const splitCells = (line) => {
  const parts = [];
  let current = "";

  for (let index = 0; index < line.length; index++) {
    const char = line[index];

    if (char === "\\" && index + 1 < line.length) {
      // Keep the escape AND the character it escapes -- consuming the pair is what stops an escaped
      // pipe being read as a boundary.
      current += char + line[index + 1];
      index++;
      continue;
    }

    if (char === "|") {
      parts.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  parts.push(current);

  return parts.slice(1, -1).map((cell) => cell.trim());
};

/**
 * Walk every line once, tracking fence state, and hand each line to a visitor.
 *
 * The visitor receives the line, its ONE-BASED number, and whether the line is fenced -- true for a
 * fence delimiter itself as well as for the lines between delimiters. An unterminated fence leaves
 * every following line fenced, which fails closed: content is skipped rather than mis-scanned.
 *
 * @param {string} text
 * @param {(line: string, lineNumber: number, fenced: boolean) => void} visit
 */
const scanLines = (text, visit) => {
  let fenceChar = null;

  text.split(/\r?\n/).forEach((line, index) => {
    const fence = FENCE_RE.exec(line);

    if (!fence) {
      visit(line, index + 1, fenceChar !== null);

      return;
    }

    if (fenceChar === null) {
      fenceChar = fence[1][0];
    } else if (fence[1][0] === fenceChar) {
      fenceChar = null;
    }

    visit(line, index + 1, true);
  });
};

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

    const cells = splitCells(line);

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

/**
 * Every pipe table in a document, checked for a RAGGED row -- one whose cell count differs from the
 * count set by the first pipe row of its run.
 *
 * A run of consecutive pipe-leading lines is one table. Any other line closes it, including a fenced
 * one. The FIRST row of a run sets the width; the separator row is not special, since a well-formed
 * table's separator is the same width as its header.
 *
 * This is the general form of the mutation the narrow row-count repairs kept chasing: deleting a data
 * cell TOGETHER WITH its pipe leaves a row that renders as short in GFM and that `parseRows` silently
 * SKIPS. Deleting only the cell CONTENT and keeping the pipe is a different mutation -- the row stays
 * the right width and the two render identically -- so it belongs to an empty-cell guard, not here.
 *
 * @param {string} text
 * @returns {{ tables: number, offenders: string[] }} the number of tables SEEN, and one offender
 *   string per table carrying at least one ragged row. The table count is what lets a caller assert it
 *   scanned something: this function cannot report an offender on empty text.
 */
export function scanTables(text) {
  const offenders = [];
  let tables = 0;
  let open = null;

  const closeTable = () => {
    if (open !== null && open.ragged.length > 0) {
      const detail = open.ragged.map(({ line, width }) => `line ${line} is ${width}`).join(", ");

      offenders.push(
        `table at line ${open.headerLine}: header is ${open.width} wide, but ${open.ragged.length} row(s) differ -- ${detail}`
      );
    }

    open = null;
  };

  scanLines(text, (line, lineNumber, fenced) => {
    if (fenced || !line.startsWith("|")) {
      closeTable();

      return;
    }

    const width = splitCells(line).length;

    if (open === null) {
      tables++;
      open = { headerLine: lineNumber, width, ragged: [] };

      return;
    }

    if (width !== open.width) {
      open.ragged.push({ line: lineNumber, width });
    }
  });

  closeTable();

  return { tables, offenders };
}

/**
 * Every inline link target in a document, classified. Pure and disk-free ON PURPOSE: the
 * classification is the part worth a fixture, and resolving a path against a real tree is the caller's
 * job.
 *
 * Kinds: `anchor` for a same-document fragment, `scheme` for anything carrying a URI scheme,
 * `absolute` for a root-relative path, `relative` for everything else. Only `relative` is resolvable
 * against a directory, so only `relative` can be a dead link on disk.
 *
 * @param {string} text
 * @returns {{ line: number, raw: string, kind: string }[]} one entry per link, in document order
 */
export function findLinkTargets(text) {
  const targets = [];

  scanLines(text, (line, lineNumber, fenced) => {
    if (fenced) {
      return;
    }

    LINK_RE.lastIndex = 0;
    let match;

    while ((match = LINK_RE.exec(line)) !== null) {
      targets.push({ line: lineNumber, raw: match[1], kind: linkKind(match[1]) });
    }
  });

  return targets;
}

const linkKind = (raw) => {
  if (raw.startsWith("#")) {
    return "anchor";
  }

  if (/^[a-z][a-z0-9+.-]*:/i.test(raw)) {
    return "scheme";
  }

  if (raw.startsWith("/")) {
    return "absolute";
  }

  return "relative";
};
