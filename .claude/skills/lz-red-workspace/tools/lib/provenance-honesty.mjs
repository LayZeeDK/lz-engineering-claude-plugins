// Phase-17.1 D-05 honesty-gate parser: the principle-backing.md source-to-recommendation map is a
// pipe table with exactly three columns -- [Recommendation](doc.md) | Source | Access tier. D-05
// (17.1-CONTEXT.md) says a row may be tagged "Owned; oracle-verified ..." ONLY when it is gated
// against a real full-text FREE essay; "Kent Beck, Test-Driven Development by Example" is Access:
// book (summary-only, never gateable), so no row may cite that book while tagged Owned. This is
// the regression-proof for that invariant -- generic over the whole table, not just the six Beck
// rows Phase 17.1 re-tiered, so a future edit that flips a tier cell without checking the Source
// cell trips it too. Node builtins only; no deps. Exported for the self-test in
// provenance-honesty.selftest.mjs.
const ROW_RE = /^\|\s*\[([^\]]+)\]\([^)]*\)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*$/;
const BOOK_RE = /test-driven development by example/i;
const OWNED_RE = /^owned\b/i;

// Returns the recommendation label of every table row where the Source cell cites the book AND
// the Access-tier cell is tagged Owned -- the D-05 violation. Empty array = honesty gate holds.
export function findBookCitedAsOwned(text) {
  const violations = [];

  for (const line of text.split(/\r?\n/)) {
    const match = ROW_RE.exec(line);

    if (!match) {
      continue;
    }

    const [, recommendation, source, tier] = match;

    if (BOOK_RE.test(source) && OWNED_RE.test(tier)) {
      violations.push(recommendation);
    }
  }

  return violations;
}
