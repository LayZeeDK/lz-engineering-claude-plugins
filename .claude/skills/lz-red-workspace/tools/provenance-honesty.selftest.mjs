#!/usr/bin/env node
// Self-test for lib/provenance-honesty.mjs (D-05 honesty-gate parser). Plain node:assert, matching
// this workspace's existing style (check-red-references.mjs / check-hygiene.mjs are assert-based
// scripts, not a vitest suite) -- no new test framework introduced. In-memory fixtures only; never
// touches the shipped principle-backing.md.
//   node .claude/skills/lz-red-workspace/tools/provenance-honesty.selftest.mjs
import assert from "node:assert/strict";
import { findBookCitedAsOwned } from "./lib/provenance-honesty.mjs";

// Fixture 1: a clean table -- the book cited but tagged Unowned (the honest, current shape).
const CLEAN_TABLE = `
| Recommendation | Source | Access tier |
| --- | --- | --- |
| [Running test list](three-laws-and-test-selection.md) | Kent Beck, Canon TDD | Owned; oracle-verified against the clean-room source. |
| [Evident test data](test-structure-and-assertions.md) | Kent Beck, Test-Driven Development by Example | Unowned; high-confidence core only (no-oracle). |
`;

// Fixture 2: a REGRESSION -- someone flips the tier cell to Owned without also fixing the Source
// cell, still citing the book. This is exactly what D-05 forbids and what this check must catch.
const VIOLATING_TABLE = `
| Recommendation | Source | Access tier |
| --- | --- | --- |
| [Running test list](three-laws-and-test-selection.md) | Kent Beck, Canon TDD | Owned; oracle-verified against the clean-room source. |
| [Evident test data](test-structure-and-assertions.md) | Kent Beck, Test-Driven Development by Example | Owned; oracle-verified against the clean-room source. |
`;

let failures = 0;

const check = (label, actual, expected) => {
  try {
    assert.deepEqual(actual, expected);
    console.log(`  [PASS] ${label}`);
  } catch (err) {
    failures++;
    console.log(`  [FAIL] ${label} -- expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}: ${err.message}`);
  }
};

console.log("provenance-honesty self-test (D-05 book-cited-as-owned parser)");
console.log("");

check("clean table -- book cited but Unowned -> no violations", findBookCitedAsOwned(CLEAN_TABLE), []);
check(
  "violating table -- book cited AND tagged Owned -> caught",
  findBookCitedAsOwned(VIOLATING_TABLE),
  ["Evident test data"]
);
check("empty text -> no violations, no crash", findBookCitedAsOwned(""), []);

console.log("");

if (failures === 0) {
  console.log("SUMMARY: provenance-honesty self-test GREEN -- 3/3 assertions pass");
  process.exit(0);
}

console.log(`SUMMARY: provenance-honesty self-test RED -- ${failures} assertion(s) FAILED`);
process.exit(1);
