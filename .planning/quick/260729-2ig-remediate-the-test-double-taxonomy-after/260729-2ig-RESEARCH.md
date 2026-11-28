# Quick Task 260729-2ig: Strengthening check-red-references.mjs -- Research

**Researched:** 2026-07-29
**Domain:** repo-internal hand-rolled Markdown-reference checker (Node builtins only, zero deps)
**Confidence:** HIGH -- every number below was MEASURED against the working tree this session,
not recalled. Provenance convention: unmarked claims are `[VERIFIED: measured this session]`;
inferences are marked `[ASSUMED]` inline.

## Summary

The instrument is a single 660-line script with one reporting funnel (`report(ok, label, detail)`),
an accumulate-then-exit shape, and hardcoded paths derived from `import.meta.url`. It emits
**146 checks, 0 FAIL, exit 0** on the current tree -- exactly the total the 260728-wev RED-BASELINE
predicted, so that document's arithmetic is still trustworthy as a starting point.

Three things are true and matter for this task:

1. The codebase **already has the row-scoped idiom** it needs. `lib/provenance-honesty.mjs` is a pure
   `(text) => violations[]` pipe-table row parser with a companion in-memory-fixture selftest
   (`provenance-honesty.selftest.mjs`). Every recommendation below reuses that shape rather than
   inventing a mechanism. Do not write a Markdown parser.
2. The taxonomy's pipe table is **structurally perfect**: 36 pipe lines, every one splitting into
   exactly 11 parts (9 cells plus two empty ends), 34 data rows, **zero escaped pipes, zero pipes
   inside code spans, zero empty data cells**. Naive `split("|")` is safe here TODAY. The correct
   safeguard is not tolerating malformed rows, it is failing LOUD when a keyed row is not found
   exactly once.
3. **Six guards, not two**, name a specific table row as their subject while matching file-scoped.
   The plan's "two" undercounts. See the ranked table in section 2.

**Primary recommendation:** extract each strengthened guard into `tools/lib/` as a pure function
returning `{ ok, why }`, call it from a post-loop `report(...)` (the existing D-05 / SEAM-02 /
byte-identity idiom), and prove the evasion in a committed `*.selftest.mjs` with a PRISTINE/EVASION
fixture pair plus a row asserting the OLD regex passes the EVASION fixture. That turns the
"proves it catches a specific evasion" requirement into a permanent zero-spend test instead of a
throwaway scratchpad run.

## Project Constraints (from CLAUDE.md / AGENTS.md)

- ASCII only in every authored file. No emojis, em dashes, curly quotes, box-drawing.
- No new dependency. The workspace is Node builtins plus pinned `typescript` / `vitest` /
  `angular-typechecker` devDeps; `plugins/lz-tdd` stays dependency-free Markdown.
- Public-repo hygiene: allowlist-inversion only. Never write a forbidden email or domain as a
  search needle, including inside a checker or a fixture.
- `git grep` / `rg` only, never `grep`. Write tool for multi-line content, never heredoc.
- Blank line before and after `if` / `for` / `return`; braces always. The existing checker already
  follows this -- match it.
- Every edit to `.claude/agents/*.md` or a `SKILL.md` needs subagent review; `.mjs` harness code is
  exempt and goes through the normal verify path. `[CITED: CLAUDE.md project memory index]`

## 1. Existing architecture: how a check is expressed today

One funnel, one counter. `report(ok, label, detail)` at line 429 prints `[PASS]`/`[FAIL]` and
increments `failures` on a falsy `ok`. There is **no emitted-check counter** -- that is the gap
section 4 closes.

| # | Mechanism | Where | Emits | Match scope | Notes |
|---|-----------|-------|-------|-------------|-------|
| 1 | `topics[]` positive token | per-FILES entry, in-loop | 1 per topic | **PER LINE** (`lines.some`) | 106 today. A wrapping multi-word needle can never match. |
| 2 | `requireFence` | per-entry flag | 1 when true | whole text | `>= 1` only. 6 entries. |
| 3 | `requireNonIgnoreFence` | per-entry flag | 1 when true | whole text, `/m` | 1 entry (SKILL.md). Closes the ```ts ignore hole. |
| 4 | scaffold-phrase gate | per-entry, unconditional | **1 always** | whole text | 12 today. `scaffoldExempt` filters the shared list per entry. |
| 5 | `deferral` must-REMAIN | per-entry | 1 when truthy | per line | 0 emitted today (all 9 are `null`). |
| 6 | `absent[]` no-stale-text | per-entry, single or array | 1 per guard | **PER LINE** | 17 today. PASS only when NO line matches. |
| 7 | file-existence | per-entry | 1 only when MISSING, then `continue` | -- | A missing file emits 1 instead of its whole block. |
| 8 | D-05 honesty gate | post-loop, `existsSync`-gated | 1 **or 0** | table rows via `lib/provenance-honesty.mjs` | The ONLY row-scoped check in the battery today. |
| 9 | SEAM-02 reverse pointers | post-loop, `existsSync`-gated | 1 **or 0** | whole text of lz-tpp/SKILL.md | Bare presence of two tokens anywhere. |
| 10 | sha256 byte-identity | post-loop, unconditional | 1 always | 3 file digests | FAILs loud and by name on a missing copy. |
| 11 | G17 bare-qualifier tree scan | post-loop, unconditional | 1 always | recursive `.md` walk + 3 SKILL.md | Computes a hit list, then one `report`. |

**Measured composition of the 146:** 106 topics + 6 fence + 1 non-ignore fence + 12 scaffold +
17 absent + 4 post-loop = 146. Matches 260728-wev's predicted total exactly.

Two of the eleven mechanisms (#8, #9) **emit nothing at all** when their file is absent. Nothing in
the battery notices. Section 4 is the only fix for that.

Idiom to copy for anything new: compute an `ok` plus a detail string in a post-loop block, then call
`report` exactly once. Both #10 and #11 already do this.

## 2. Row-scoped assertions

### The defect, measured

Every guard below names a specific TABLE ROW in its own label or comment, but matches per line
against the whole file. Ranked by how easy the evasion is (decoy sites = non-row lines that satisfy
the needle on their own):

| Guard | Needle | Sites | Row line | Decoy sites | Evasion difficulty |
|-------|--------|-------|----------|-------------|--------------------|
| `[j9m] failure-vs-error boundary row` | `/failure\|error boundary/i` | 6 | pb:66 | pb:76, 77, 83, 90, 93 | **trivial** -- delete the whole row, 5 prose lines still pass it |
| `[j9m] lz-tpp seam backing row` | `/seam\|handoff/i` | 7 | pb:69, 70 | pb:13, 14, 47, 56, 58, 60 | trivial |
| `[wev G8] Bernhardt row names a specific delivery` | `/\b(PyCon\|SCNA)\b/i` | 3 | tax:214 | tax:380, 381 (Sources bullets) | **easy** -- strip `PyCon 2013 delivery` from the Source cell, Sources bullets still pass it |
| `[j9m] test-double taxonomy backing row` | `/test-double-taxonomy\.md/` | 2 | pb:71 | pb:99 (prose cross-link) | easy |
| `[j9m] Three Laws backing row` | `/three laws/i` | 2 | pb:65 | pb:58 (section lead-in) | easy |
| `[wev G16] kanban-cycle essay named as the owned surface` | `/TDD is Kanban for Code/i` | 2 | pb:67 | pb:85 (prose) | easy |

(`tax` = `test-double-taxonomy.md`, `pb` = `principle-backing.md`.)

G8 and the failure-vs-error row are the two worst; if the plan targets exactly two, those are the
ones. **Flag for the planner:** the other four have the same defect and the same fix, and fixing two
of six leaves a misleading impression that the class is closed. `[ASSUMED]` that scoping to two is a
deliberate budget choice rather than an undercount.

### Recommended mechanism: reuse the provenance-honesty shape

`lib/provenance-honesty.mjs` is already exactly this, for a 3-column table. Generalise the row split
into `lib/pipe-table.mjs` and keep every guard a pure function:

```js
// lib/pipe-table.mjs -- node builtins only, no deps, mirrors lib/provenance-honesty.mjs
const SEPARATOR_CELL = /^-{3,}$/;

// Rows of a GitHub pipe table with exactly `columnCount` cells. Header and separator rows are
// dropped. A row whose width does not match is SKIPPED, never guessed at -- callers assert their
// keyed lookup found exactly one row, which is what turns a malformed row into a loud FAIL.
export function parseRows(text, columnCount, headerFirstCell) {
  const rows = [];

  for (const line of text.split(/\r?\n/)) {
    if (!line.startsWith("|")) {
      continue;
    }

    const cells = line.split("|").slice(1, -1).map((cell) => cell.trim());

    if (cells.length !== columnCount) {
      continue;
    }

    if (cells.every((cell) => SEPARATOR_CELL.test(cell))) {
      continue;
    }

    if (cells[0] === headerFirstCell) {
      continue;
    }

    rows.push(cells);
  }

  return rows;
}
```

Then one named guard per subject, returning the `{ ok, why }` shape that maps 1:1 onto `report`:

```js
// lib/taxonomy-rows.mjs
import { parseRows } from "./pipe-table.mjs";

const COLUMNS = 9;
const AUTHOR = 0, TERM = 1, WHERE = 2, STANDS = 3, LIFETIME = 4, SOURCE = 7, TIER = 8;

// EXACTLY ONE row, or FAIL. A lookup that quietly finds zero rows is the wev R1 defect class
// ("a guard that cannot fail is worse than no guard") reintroduced.
function oneRow(text, author, term) {
  const hits = parseRows(text, COLUMNS, "Author").filter(
    (cells) => cells[AUTHOR] === author && cells[TERM] === term
  );

  if (hits.length !== 1) {
    return { row: null, why: `expected exactly 1 "${author} / ${term}" row, found ${hits.length}` };
  }

  return { row: hits[0], why: "" };
}

export function bernhardtDeliveryNamed(text) {
  const { row, why } = oneRow(text, "Gary Bernhardt", "double versus value");

  if (!row) {
    return { ok: false, why };
  }

  const source = row[SOURCE];

  return /\b(PyCon 2013|SCNA 2012)\b/.test(source)
    ? { ok: true, why: "" }
    : { ok: false, why: `Source cell names no delivery: "${source}"` };
}
```

Call site, in the existing post-loop idiom:

```js
const delivery = bernhardtDeliveryNamed(taxonomyText);
report(delivery.ok, "[2ig] Bernhardt double-versus-value ROW names a specific delivery", delivery.why);
```

For `principle-backing.md` the table is 3-column and `parseRows(text, 3, "Recommendation")` covers
it; `lib/provenance-honesty.mjs` can be left byte-unchanged (36 recorded eval runs and its own
selftest depend on nothing here, but the wev baseline asserted it untouched -- keep that streak).
Note its `ROW_RE` requires the first cell to be a `[label](link)`, which every row in that table is.

### Pitfalls, all checked against the real file

| Pitfall | Status in this table | Handling |
|---------|---------------------|----------|
| Header separator row | present, `\| --- \| ... \|` | all-cells-`---` predicate drops it |
| Header row (same width as data) | present, first cell `Author` | drop by first-cell value, not by position |
| Escaped pipes `\|` | **0 occurrences** | width mismatch skips the row; the exactly-one-row assertion turns that into a FAIL |
| Pipes inside inline code spans | **0** (all 36 rows split to exactly 11) | same |
| Legitimately empty cells | **0** -- the doc uses `Not applicable` by stated doctrine (tax:196-198, Fowler Refactoring 2e row) | cheap bonus: assert no data cell is empty, machine-enforcing the doctrine the doc already states |

## 3. Count re-derivation

### The clean mechanism for this codebase

Every stated total is written as a NUMBER WORD, not a digit. So the general shape is: derive N from
the authoritative list, then extract the stated word(s) and compare against `NUM_WORDS[N]`. Do NOT
test for the presence of the expected word -- that cannot catch a deleted claim.

```js
const NUM_WORDS = [
  "zero", "one", "two", "three", "four", "five", "six", "seven",
  "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen",
];
const NUM_ALT = NUM_WORDS.join("|");

// Whitespace-normalised whole text. REQUIRED: `topics` / `absent` match per LINE, so any
// multi-word needle can be defeated by a line wrap -- the exact trap the `/later phase/i`
// narrowing comment already records.
const flat = (text) => text.replace(/\s+/g, " ");

// Every place the document states a cardinal count of `noun`. Cardinals only -- an ordinal in the
// alternation produces false sites (a loose probe captured "second axes").
const statedCounts = (flatText, noun) =>
  [...flatText.matchAll(new RegExp(`\\b(${NUM_ALT})\\s+${noun}\\b`, "gi"))].map((m) =>
    m[1].toLowerCase()
  );

// Assert BOTH the site count and every word. Site count is load-bearing: without it, deleting a
// stated total silently passes.
const agrees = (stated, expectedSites, derived) =>
  stated.length === expectedSites && stated.every((word) => word === NUM_WORDS[derived]);
```

This needs no per-site hand-crafted anchor -- requiring an immediately preceding cardinal filters out
"owned sources", "content sources", "OPPOSITE cells", "data cells", "carrying rows in the table" and
every other decoy, measured.

### Per-total findings

| Stated total | Sites (measured) | Authoritative list | Derivation | Derived | Verdict |
|--------------|------------------|--------------------|------------|---------|---------|
| "twelve sources" | 3 (tax:11, 67, 159) | top-level `- ` bullets under `## Sources` | count `/^- /` between `## Sources` and the next `## ` | **12** | SAFE |
| "eight cells" | 1 (tax:70) | the 8 `- **X / y / z.**` bullets in section 1 | `/^- \*\*(Production\|Test) \/ (own\|collaborator) \/ (transitional\|permanent)\.\*\*/gim` | **8**, 8 distinct keys | SAFE. Second independent path: 2 x 2 x 2 from the 3 axes. Assert the key SET has size 8 to also catch a duplicated bullet. |
| "Six rows in the table" | **2** (tax:74, 272) | table rows where `(Where, Stands, Lifetime) === (Production, Own implementation, Transitional)` | `parseRows` filter | **6** | SAFE. Both sites are unwrapped today, but use `flat` anyway. |
| "Four owned sources NAME" | 1 (tax:271) | DISTINCT `Author` values of those same 6 rows | `new Set(rows.map(r => r[AUTHOR])).size` | **4**, and all 6 tiers match `/^Owned/` | SAFE, and free -- same row set as the previous line. Assert the `/^Owned/` half too; the word "owned" is load-bearing in that sentence. |
| "three axes" | 3 (tax:17, 25, 70) | the `Axis one/two/three,` blocks | `/^Axis (one\|two\|three), /gm` | **3** | SAFE bonus. Overlaps G12's axis-count half; keep G12 anyway, it also bans the hyphenated anchor-slug form a cardinal regex cannot see. |
| "Three further qualifiers" | 1 (tax:420) | the numbered `1.` / `2.` / `3.` items | `/^\d+\. [A-Z]/gm` | **3** | SAFE bonus. |
| **"five kinds"** | **9** | -- | **none** | -- | **AMBIGUOUS -- human decision required.** See below. |
| "Two live conflicts" | 1 (tax:248) | 2 bullets, block boundary is fuzzy prose | block-scoped bullet count | 2 | LOW value, block scoping is the fragile part. Skip. |
| "Four notes in his own cross-reference" | 1 (tax:109) | semicolon-separated inline clauses in one paragraph | split on `; ` | -- | **FRAGILE -- skip.** Prose punctuation is not a list. |
| "four claimants" / "Two claimants" | 2 (tax:286, 298) | comma-and inline lists inside a bullet | split on `, ` / ` and ` | -- | **FRAGILE -- skip.** |
| "Roughly thirty rows above are sound" | 1 | -- | -- | -- | Hedged by "Roughly". Not assertable, correctly. |

### "five kinds" -- the one that needs a human

Nine sites state it. The document has **no enumeration of the five**. The table has 9 Meszaros rows:
`Test Double`, `Dummy Object`, `Test Stub`, `Test Spy`, `Mock Object`, `Fake Object`, `Responder`,
`Saboteur`, `Temporary Test Stub`. Getting to 5 requires three ad-hoc exclusions, each a prose sniff
on the defining-property cell (`/^The umbrella/`, `/^A Variation of/` x2, `/^THE NEAREST MISS/`).
That is precisely the coupling bug 260728-wev removed R1 and R3 for -- a needle depending on prose a
later edit is free to move. **Do not derive it that way.**

Three options for the owner, in order of preference:

1. **Leave it ungated.** "Five kinds" is a claim about Meszaros' BOOK, not a summary of a list on
   this page. Re-deriving it from this document's own table is a category error, and none of the
   other four totals share that property. Cheapest and most honest.
2. **Row-existence contract instead of a count.** Hardcode the five kind Term values as a named set,
   assert all five exist as `Gerard Meszaros` rows, and assert the stated word is `"five"` at all 9
   sites. Falsifiable (deleting a kind row FAILs) with no prose sniffing. Cost: the set is a second
   source of truth, but a small explicit one.
3. Add an explicit enumeration sentence to the document and count that. Most work, changes shipped
   content, and the enumeration would then need its own guard.

## 4. Roster integrity: exact emitted-check count

`report` is the single funnel, so one counter closes this.

```js
let emitted = 0;

const report = (ok, label, detail) => {
  emitted++;

  if (!ok) {
    failures++;
  }

  console.log(`  [${ok ? "PASS" : "FAIL"}] ${label}${detail ? " -- " + detail : ""}`);
};
```

Then as the LAST gate, after every other `report`:

```js
// [2ig] ROSTER INTEGRITY. Nothing else in this battery notices a DELETED guard: a removed topic or
// absent entry simply stops being reported and the summary still says GREEN. The literal is
// hand-maintained ON PURPOSE -- deriving it from FILES (summing topics + flags) would lower both
// sides of the comparison when a guard is deleted, making the gate unable to fail.
// Snapshotted BEFORE the report call so this check does not count itself.
const EXPECTED_CHECKS = 146; // update deliberately, with the arithmetic recorded in the task doc
const emittedBeforeRoster = emitted;

report(
  emittedBeforeRoster === EXPECTED_CHECKS,
  "[2ig] roster integrity: exact emitted-check count",
  emittedBeforeRoster === EXPECTED_CHECKS
    ? `${emittedBeforeRoster} checks emitted`
    : `expected ${EXPECTED_CHECKS}, emitted ${emittedBeforeRoster}`
);
```

**Current measured value: 146.** The new literal is 146 plus net new guards.

What this catches that nothing else does:

- A deleted `topics` / `absent` entry (the stated motive).
- **An `existsSync`-gated post-loop block that silently emits nothing** -- the D-05 honesty gate and
  the SEAM-02 block both do this if their file vanishes. Today that is a fully silent vacuous pass.
- `topics: []` or `absent: []`. Both are silent no-ops: the `for` loop emits nothing, and `[]` is
  TRUTHY so `if (spec.absent)` does not save you.

What it does NOT catch: a guard **weakened in place** (needle broadened) -- the count is unchanged.
Only the per-guard evasion proofs in section 5 cover that. Say so in the comment so nobody mistakes
the roster gate for sufficient.

Two notes: a MISSING `topics` key (not `[]`) throws `TypeError` on `for (const topic of undefined)`
-- loud, non-zero exit, ugly stack trace, but not a silent pass. And `filesPresent`/`FILES.length`
appears only in the SUMMARY string and is never asserted -- do not mistake it for a roster gate.

**Lazier alternative:** assert only `failures === 0 && emitted === 146` inline in the task's verify
block instead of shipping a gate. Rejected: it does not survive the task, which is the whole point.

## 5. Proving a strengthened guard, non-destructively

**Confirmed constraint:** `check-red-references.mjs` has **no exports and no module-main guard**, and
runs `console.log` plus `process.exit` at top level. Importing it executes the whole battery and
kills the process. Paths are hardcoded off `import.meta.url`. There is no CLI argument and no env
override. So you cannot exercise one guard against arbitrary content as the file stands.

**Recommended (matches an existing precedent exactly):** the extraction in section 2 makes each
strengthened guard a pure `(text) => { ok, why }`. Pair it with a selftest in the shape of
`provenance-honesty.selftest.mjs`, which already states its own contract: "In-memory fixtures only;
never touches the shipped principle-backing.md." Each guard gets THREE assertions:

```js
// tools/taxonomy-rows.selftest.mjs -- node:assert/strict, same check() helper as the D-05 selftest
const PRISTINE = `
| Author | Term | Where it lives | ... | Source | Citability tier |
| --- | --- | ... | --- | --- |
| Gary Bernhardt | double versus value | Test | ... | Boundaries, PyCon 2013 delivery | Owned; ... |
`;

// THE EVASION: the row loses its delivery, while a Sources bullet elsewhere still says PyCon.
const EVASION = PRISTINE.replace("Boundaries, PyCon 2013 delivery", "Boundaries")
  + "\n- Gary Bernhardt -- Boundaries. PyCon 2013 is a compressed cut ...\n";

check("pristine row -> PASS", bernhardtDeliveryNamed(PRISTINE).ok, true);
check("evasion (row stripped, Sources bullet remains) -> FAIL", bernhardtDeliveryNamed(EVASION).ok, false);
// The regression record: the OLD file-scoped needle passed this exact evasion. THIS is the
// "proves it catches an evasion the old guard passed" evidence, committed rather than throwaway.
check("OLD needle passed the same evasion (the defect)", /\b(PyCon|SCNA)\b/i.test(EVASION), true);
check("row deleted entirely -> FAIL, not a vacuous pass", bernhardtDeliveryNamed("").ok, false);
```

The fourth assertion is the anti-vacuity control and should be present for every row-scoped guard.

**Wire it in.** `package.json` currently has `"check": "node tools/check-red-references.mjs"` and the
existing provenance selftest is **not run by any script** -- it is manual-only, so its evidence is
already rotting. Chain them:

```json
"check": "node tools/provenance-honesty.selftest.mjs && node tools/taxonomy-rows.selftest.mjs && node tools/check-red-references.mjs"
```

**Fallback for guards that stay inline bare regexes** (the `absent` needles, where extraction is
overkill): a scratchpad script that reads the real file, applies a string replacement in memory,
and tests old-vs-new regex against both versions. Non-destructive, zero repo writes -- this is the
260728-wev precedent and its evidence table shape is worth copying verbatim into the task doc.

**Do NOT** add a path or env override to the checker so it can be pointed at a copy. It creates a
bypass on a gate whose value rests on its paths being fixed, and it is not needed once the guards
are pure functions.

## 6. Pitfalls in the existing checker

1. **Per-line vs whole-text asymmetry.** `topics` and `absent` are evaluated `lines.some(...)`;
   `requireFence`, `requireNonIgnoreFence` and the scaffold gate are evaluated on the whole text. A
   multi-word needle that wraps at the ~100-column margin can never match as a topic or absent
   guard. The file already documents being bitten by this (the `/later phase/i` narrowing comment,
   lines 264-267). Both "Six rows in the table" sites happen to be unwrapped today -- that is luck.
   **Use a whitespace-normalised `flat` for every new multi-word or count needle.**
2. **Vacuous pass on an empty collection.** `topics: []` emits nothing; `absent: []` is truthy and
   also emits nothing. Section 4 is the only fix.
3. **Vacuous pass on a not-found row.** Any new "no violations" guard that returns `[]` when the
   subject row is absent PASSES. Assert exactly-one-row found, always.
4. **`existsSync`-gated post-loop blocks emit zero checks when their file is missing** (D-05 gate,
   SEAM-02). Silent today.
5. **One-sided comparisons.** `requireFence` is `>= 1`; SEAM-02 is bare presence of `/lz-red/` and
   `/lz-refactor/` anywhere in lz-tpp/SKILL.md, so a passing comment satisfies it. Same defect class
   as section 2. **Out of scope for this task** -- note it, do not fix it.
6. **G17 scope excludes the sibling reference trees.** `collectMarkdown(REFERENCES)` walks
   `lz-red/references` only, plus the three `SKILL.md` files. `lz-tpp/references/**` (3 files) and
   `lz-refactor/references/**` (177 files) are unscanned, so the taxonomy's own hard rule is
   unenforced in two of the three skills that SHIP the taxonomy. **MEASURED: widening costs nothing
   -- 0 bare hits in both trees** (the taxonomy-copy basename exclusion already handles the copies).
   This is a one-line, zero-fallout hardening: add the two sibling `references` dirs to
   `bareQualifierTargets`.
7. **`scaffoldExempt` matches by `re.source` + `re.flags` identity.** If `lib/scaffold-phrases.mjs`
   ever re-words `/\bplaceholder\b/i`, the exemption silently stops applying and the taxonomy
   false-FAILs on its own registered domain term. Fails loud, so acceptable; worth a comment.
8. **Do not triple new content guards.** The sha256 byte-identity gate propagates any lz-red-copy
   content guard to lz-tpp and lz-refactor automatically. Target the lz-red copy only.
9. **Cardinals only** in the number-word alternation. A loose probe captured "second axes"; adding
   ordinals produces false sites.

## Discovered inconsistency -- needs a human decision, not a guess

While validating a generalised form of the G2 guard (bullet claims a cell is populated <=> rows
exist for it), one cell **MISMATCHES**:

| Cell bullet (tax:76-77) | Claims | Table rows |
|-------------------------|--------|------------|
| **Test / own / permanent** | "Meszaros' Subclassed Test Double and Self Shunt" | **0** |

Neither `Subclassed Test Double` nor `Self Shunt` carries a table row. Both appear only in prose
(tax:57, 83, 317, 337). This is the INVERSE of the G2 defect -- G2 was "claims empty, table
populates it"; this is "claims populated, table has no row". Note that section 1's census language is
explicitly row-based ("Six rows in the table land here"), and that this same combination is the one
section 1 leans on to argue the axes are a genuine degree of freedom ("his Subclassed Test Double and
Self Shunt are test and own", tax:56-57) -- so the argument for keeping the axes separate currently
rests on two artifacts with no rows.

The other 7 cells are consistent. Also note the cell bullets are TERM lists, not row censuses:
`Test / collaborator / transitional` names 2 terms but 15 rows land there under the stated `Either`
rule. **So a blanket 8-cell population gate is NOT safe.** Either add the two missing rows, or scope
the gate to the one cell that makes an explicit row-count claim.

Owner decision needed: (a) add `Subclassed Test Double` and `Self Shunt` rows, (b) reword the bullet,
or (c) declare it out of scope. `[ASSUMED]` that this is in scope for a task titled "remediate the
test-double taxonomy", but it is a content change, not an instrument change, so it needs saying.

## Validation Architecture

`workflow.nyquist_validation` is `true`, so this section applies.

| Property | Value |
|----------|-------|
| Framework | `node:assert/strict` scripts (no test framework in this workspace by design) |
| Config file | none -- `.claude/skills/lz-red-workspace/package.json` scripts |
| Quick run | `node .claude/skills/lz-red-workspace/tools/check-red-references.mjs` |
| Full suite | `npm --prefix .claude/skills/lz-red-workspace run check && npm --prefix ... run typecheck` |

| Behavior | Test type | Automated command | Exists? |
|----------|-----------|-------------------|---------|
| Strengthened row-scoped guards catch their evasion | unit (in-memory fixtures) | `node tools/taxonomy-rows.selftest.mjs` | NO -- new |
| Count re-derivations agree with the lists | unit | same selftest | NO -- new |
| Roster count holds | integration | `node tools/check-red-references.mjs` | yes (extend) |
| Taxonomy byte-identical across 3 skills | integration | same | yes |

**Wave 0 gaps:** `tools/lib/pipe-table.mjs`, `tools/lib/taxonomy-rows.mjs`,
`tools/taxonomy-rows.selftest.mjs`, and the `package.json` `check` script chaining the selftests
(including the existing provenance selftest, currently unwired).

## Security Domain

`security_enforcement` is absent from config, so treated as enabled. Surface is minimal and stated
honestly: this is a dev-only, non-shipped Node script reading tracked repo files. No network, no
untrusted input, no credentials, no shipped-artifact change. V5 Input Validation applies only in the
"fail closed on malformed input" sense, which the existing code already does (G17 fails closed on an
unreadable file; the byte-identity gate fails loud on a missing copy) and which section 2's
exactly-one-row rule extends. The one live hygiene requirement is the CLAUDE.md allowlist-inversion
rule: **no fixture, comment, or label may contain a forbidden email or domain, even as a search
needle** -- and fixtures are the easy place to forget that.

## Assumptions Log

| # | Claim | Section | Risk if wrong |
|---|-------|---------|---------------|
| A1 | The plan's "two row-scoped guards" is a deliberate budget choice, not an undercount of six | 2 | Four guards keep the same defect while the class looks closed |
| A2 | The Test/own/permanent row gap is in scope for a "remediate the taxonomy" task | Discovered inconsistency | Either unwanted content churn, or a shipped self-contradiction survives |
| A3 | Widening G17 to the sibling trees is wanted, given it costs 0 new failures | 6.6 | A one-line change nobody asked for |

## Open Questions

1. **Which totals get gated?** Recommended set: twelve sources, eight cells, six rows (x2 sites),
   four owned sources, plus the cheap three-axes and three-qualifiers bonuses. "Five kinds" needs
   the section-3 decision. The claimants / notes / live-conflicts inline lists should be left alone.
2. **Does `EXPECTED_CHECKS` count the roster check itself?** Recommendation: no (snapshot before
   reporting), so the literal equals the guard total and the arithmetic in the task doc stays legible.
3. **Extract all six row-scoped guards or only two?** The lib and selftest cost is paid once; each
   extra guard is roughly 8 lines plus 4 assertions.

## Sources

### Primary (HIGH -- measured this session)
- `.claude/skills/lz-red-workspace/tools/check-red-references.mjs` -- read in full (661 lines).
- `.claude/skills/lz-red-workspace/tools/lib/provenance-honesty.mjs` and
  `tools/provenance-honesty.selftest.mjs` -- the row-parser + fixture-selftest precedent.
- `plugins/lz-tdd/skills/lz-red/references/test-double-taxonomy.md` (442 lines) and
  `principle-backing.md` (117 lines) -- read in full.
- Live run: `node tools/check-red-references.mjs` -> 146 emitted, 0 FAIL, exit 0.
- Three scratchpad probe scripts measuring guard sites, table shape, count derivations, G17
  widening cost, and cell/row consistency. No repo file was modified.
- `.planning/quick/260728-wev-.../260728-wev-RED-BASELINE.md` -- the per-guard evidence-table
  precedent and the 132 -> 146 arithmetic, both confirmed still accurate.
- `.claude/skills/lz-red-workspace/package.json`, `.planning/config.json`.

### Secondary
- `CLAUDE.md`, `AGENTS.md`, `.planning/STATE.md` (Phase 21 context; this task is post-Phase-21
  housekeeping on the instrument, not phase work).

## Metadata

**Confidence:** HIGH across the board -- architecture, row mechanism, count derivations, roster
arithmetic and pitfalls were all measured against the working tree rather than recalled. The single
LOW-confidence item is the scope question A1/A2.

**Research date:** 2026-07-29
**Valid until:** until `check-red-references.mjs` or either reference document changes. Every count
in this document is a measurement of a specific tree state; re-measure after any edit.
