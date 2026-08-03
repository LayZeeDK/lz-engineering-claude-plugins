# Quick Task 260729-lc9: Scope the test-double taxonomy to lz-red only - Research

**Researched:** 2026-07-29
**Domain:** Markdown instrument engineering (node ESM guard battery) + content de-scoping
**Confidence:** HIGH on every measured number below; every claim carries the command or `file:line`
that produced it. Anything I could not verify is tagged **UNVERIFIED**.

> SCOPE OF THIS DOCUMENT. CONTEXT.md carries the LOCKED decisions D-01..D-12 and the headline
> measurements. This file settles only the IMPLEMENTATION unknowns the plan needs. It does NOT
> re-derive CONTEXT's numbers, except where I re-measured to confirm a load-bearing one; those
> confirmations are marked.

---

## User Constraints (from CONTEXT.md)

Locked decisions D-01..D-12 are the authority and are NOT restated here. The three that bind this
research hardest:

- **D-02** -- the sha256 byte-identity gate is DELETED outright, not narrowed and not archived,
  because narrowing it to one copy makes its predicate vacuous. The generalisation of that reasoning
  drives my answer to question 2.
- **D-04** -- the `.planning/` copy is an INERT RECORD, never an agent input, carrying a header that
  states it failed three acceptance gates.
- **D-08** -- the general table-shape guard replaces the narrow row-count repair; it starts GREEN, so
  its proof is a FIXTURE SET, not a baseline FAIL.

Claude's discretion, per CONTEXT: replacement sentence wording, `.planning/` destination, guard
implementation shape, and which retained guards retarget versus retire.

---

## Measurement Environment

Every number below was produced this session against the live tree at `HEAD = 1c27189`, branch
`gsd/lz-tdd-0.0.3-lz-red`, working tree clean. Three read-only probe scripts were written to the
session scratchpad (OUTSIDE the repo) and run with `node`; the repo was never mutated.

| Probe | Path (scratchpad, outside repo) | What it measured |
|---|---|---|
| `linkscan.mjs` | scratchpad | every inline markdown link in `plugins/**/*.md`, resolved on disk, plus a simulated post-deletion pass |
| `shapescan.mjs` | scratchpad | table/row/ragged census + the three CONTEXT-named evasion mutations, in memory |
| `cells.mjs` | scratchpad | empty-data-cell census over the shipped tables excluding the taxonomy |

Baseline battery, re-run and confirmed:

```
node .claude/skills/lz-red-workspace/tools/check-red-references.mjs   # EXIT=0, 175 emitted lines
```

`EXPECTED_CHECKS = 174` (`check-red-references.mjs:925`) and the roster gate is the 175th emitted
line, snapshotting `emitted` BEFORE its own emission. So `174` is the number to arithmetic against,
not `175`.

---

## Q1. The general table-shape guard: exact implementation shape

**RECOMMENDATION: one new export in `lib/pipe-table.mjs`, one post-loop block in the checker, one new
section in the existing selftest. No new files. One emitted check.**

### Where it belongs, and why not the two alternatives

| Option | Verdict | Reason |
|---|---|---|
| New export in `lib/pipe-table.mjs` | **CHOSEN** | The module already owns the pipe-table parse AND already records the shape measurement in its own header (`pipe-table.mjs:16-23`: "36 lines start with `\|`, every one splits to exactly 11 parts"). The shape guard IS that header's assertion, mechanised. Rung 2 of the ladder: the helper is already here. |
| Addition to `lib/row-guards.mjs` | rejected | That module is explicitly about ROWS OF A NAMED TABLE IN TWO NAMED DOCUMENTS (`row-guards.mjs:36-53` hardcodes `TAXONOMY_COLUMNS`, `BACKING_HEADER`, column-index maps). The shape guard is document-agnostic and multi-file. Putting it there couples a general primitive to two specific documents. |
| New `lib/table-shape.mjs` | rejected | One function. A third lib file for one function is the abstraction the repo does not need. |

### Signature

```js
// lib/pipe-table.mjs -- SECOND export, next to parseRows.
/**
 * @param {string} text
 * @returns {{ tables: number, offenders: string[] }}
 */
export function scanTables(text) { ... }
```

**Why `{ tables, offenders }` and not `(text) => {ok, why}`:** the `{ok, why}` shape in
`row-guards.mjs` maps 1:1 onto ONE `report()` call over ONE document. This guard walks ~200 files and
emits ONE aggregated report, exactly like `[wev G17]` does with `bareQualifierHits`
(`check-red-references.mjs:764-768`). Returning the table COUNT alongside the offenders is what makes
the anti-vacuity leg testable -- see below.

### Algorithm (measured, not proposed)

1. Split on `/\r?\n/`.
2. Fence-aware: `/^\s{0,3}(`{3,}|~{3,})/` opens; the same fence character closes. Lines inside a
   fence are skipped and CLOSE any open table.
3. A line is a table row iff `line.startsWith("|")` -- the SAME predicate `parseRows` already uses
   (`pipe-table.mjs:42`). Consistency with the existing parser is the point: the shape guard's job is
   to make the parser's skip-on-width-mismatch (`pipe-table.mjs:51-53`) visible instead of silent.
4. Width = `line.split("|").slice(1, -1).length` -- identical to `pipe-table.mjs:47`.
5. First pipe row of a run establishes the table width. Any later row of a different width is an
   offender. A non-pipe line closes the table.
6. Offender string, VERBATIM as measured:
   `table at line 233: header is 9 wide, but 1 row(s) differ -- line 237 is 8`
   This matches CONTEXT's recorded evasion-proof string byte for byte.

### Wiring in `check-red-references.mjs`

- ONE post-loop block, placed next to `[wev G17]`, **reusing G17's existing `collectMarkdown(dir)`
  helper** (`check-red-references.mjs:693-710`). Do NOT write a second directory walker.
- ONE `report()` call. Detail = `${offenders.length} ragged table(s): ${offenders.join("; ")}`, the
  G17 by-file-and-line idiom.
- Fails CLOSED on an unreadable file or tree -- push a hit rather than filtering (the explicit
  reasoning at `check-red-references.mjs:720-728`).
- **Anti-vacuity leg, and this is load-bearing:** also FAIL when `tablesSeen === 0`. Without it a
  wrong path yields 0 files -> 0 offenders -> permanent PASS, which is the `wev R1` guard-that-cannot-
  fail class the checker's own header condemns (`check-red-references.mjs:46-48`). G17 does not have
  this leg; it relies on the unreadable-tree hit instead, which does not cover "the path resolved but
  is empty". One condition closes it.

### Files it scans

**Recommended scope: `plugins/**/*.md` (the whole shipped plugin tree) PLUS the single `.planning/`
copy.** CONTEXT: "Scope the guard to the shipped tree AND the `.planning/` copy."

`collectMarkdown(path.join(repoRoot, "plugins"))` returns all of it in one call. Do not narrow to the
three reference trees the way G17 does -- G17 is narrow because the never-bare-`stub` rule is about
lz-tdd's own prose; table shape is a property of any table anywhere.

### Baseline, MEASURED (confirms CONTEXT exactly)

```
BASELINE over plugins/**/*.md
{ "files": 197, "tables": 31, "pipeRows": 405, "ragged": 0,
  "noLeadingPipe": 0, "col0PipeInsideFence": 0, "indentedPipeInsideFence": 14 }
```

- CONTEXT said 31 tables / 405 pipe rows / 0 ragged / 0 escaped pipes / 0 fence-internal pipe-leading
  lines / 0 tables without a leading pipe. **All six reproduced.** `git grep -c -F '\|' -- 'plugins/**/*.md'`
  returns nothing, confirming 0 escaped pipes.
- The 14 "indented pipe inside fence" lines are indented, so `startsWith("|")` never sees them. They
  are irrelevant to this guard, and they are why fence-awareness costs nothing today. Keep it anyway
  per CONTEXT and per the repo's recorded fence-blind-scanner lesson.
- **Post-step-5 scope:** taxonomy = 1 table / 36 pipe rows per copy (measured). Shipped tree drops to
  **28 tables / 297 rows**; adding the `.planning/` copy back gives the guard **29 tables / 333 rows**.

### Fixture set (the proof, since the guard starts GREEN)

Add a `lib/pipe-table.mjs -- scanTables` section to the EXISTING `tools/row-guards.selftest.mjs`. Do
not create a second selftest file: that file already carries a `lib/pipe-table.mjs -- parseRows`
section (`row-guards.selftest.mjs:217-223`), and its stated invariant "IN-MEMORY FIXTURES ONLY; this
file never reads a shipped document" (`:5`) is exactly right for this guard. The exit gate's phrase
"the new table-shape guard's fixture selftest exits 0" is satisfied by the extended file.

Six cases. The first four are **MEASURED**; cases 5 and 6 are designed-not-yet-run (**UNVERIFIED** as
executed assertions, though the algorithm above trivially yields them):

| # | Fixture | Expected | Status |
|---|---|---|---|
| 1 | Well-formed 3-col table | `offenders.length === 0` | MEASURED (`bare ragged fixture` control passes its inverse) |
| 2 | **Header 3 wide, data row 2 wide (pipe DELETED)** | `1` offender, string `table at line 1: header is 3 wide, but 1 row(s) differ -- line 3 is 2` | **MEASURED** |
| 3 | Live taxonomy row 237, cell BLANKED but pipe KEPT | `0` offenders -- `noEmptyDataCell` owns this one | **MEASURED** |
| 4 | Ragged-looking table INSIDE a ``` fence | `0` offenders | **MEASURED** |
| 5 | Two tables of different widths separated by a blank line | `0` offenders (blank line closes the table) | UNVERIFIED |
| 6 | `scanTables("")` | `{ tables: 0, offenders: [] }` -- proves the anti-vacuity leg must live on `tables`, not on `offenders` | UNVERIFIED |

**Honest note on case 6:** the pure function CANNOT fail on empty text, because "no ragged tables" is
true of an empty document. That is unlike every guard in `row-guards.mjs`, whose anti-vacuity control
is a FAIL on `""`. The anti-vacuity therefore lives at the CHECKER level, on `tablesSeen === 0`. State
this in the code comment so a future reader does not file it as a missing control.

Live evasion proof, run against the unmodified document in memory (repo untouched):

```
unmodified                    -> 0 offender(s)
blank the cell, KEEP the pipe -> 0 offender(s)
delete the cell AND its pipe  -> 1 offender(s): table at line 233: header is 9 wide, but 1 row(s) differ -- line 237 is 8
fenced ragged-looking table   -> 0 offender(s)
bare ragged fixture           -> 1 offender(s): table at line 1: header is 3 wide, but 1 row(s) differ -- line 3 is 2
```

### Optional, NOT recommended by default

`noEmptyDataCell` retires with the taxonomy (Q2), leaving NOTHING guarding empty cells in any table.
Generalising it into the same walk is ~3 extra lines and is **baseline-safe: measured 0 empty data
cells across all 28 remaining shipped tables**. But CONTEXT D-08 explicitly settles the marker-cell
question as orthogonal, and nothing asks for it. Skipped by default; the measurement is here so the
planner can take it in one line if the partition matters after the taxonomy leaves.

---

## Q2. Guard disposition, name by name

### Reconciling the inventory

The 60 taxonomy-coupled checks, enumerated from the live run (all 175 labels captured):

| Group | Count | Where |
|---|---|---|
| A. `FILES` entry `test-double-taxonomy.md` -- 29 topics | 29 | `check-red-references.mjs:357-421` |
| B. same entry -- auto scaffold check | 1 | loop, `:577` |
| C. same entry -- 14 `absent` guards | 14 | `:425-495` |
| D. post-loop sha256 byte-identity | 1 | `:632-661` |
| E. row-scoped taxonomy guards | 2 | `:786-792` |
| F. count guards | 9 | `:816-853` |
| G. chronology phrase (wrap-proof) | 1 | `:862-892` |
| H. `[wev G17]` bare-qualifier gate | 1 | `:663-768` |
| I. dependent cross-link `taxonomyRowBacked` | 1 | `:801-804` |
| J. roster integrity | 1 | `:975` |

29+1+14+1+2+9+1+1+1+1 = **60**. Matches CONTEXT.

Cross-check of CONTEXT's "43 vanish silently / 15 fail loud": the FILES loop emits NO `exists` label
for a present file, so deleting the file turns 44 loop checks into 1 (`exists` FAIL) and 43 silent
drops. Loud failures = exists(1) + byte-identity(1) + row-scoped(2) + count(9) + chronology(1) +
roster(1) = **15**. Arithmetic confirms CONTEXT.

### Recommendation: RETIRE 58, KEEP 2, RETARGET 0

**Reasoning, which is D-02's own reasoning generalised.** D-02 retires the byte-identity gate because
"the mechanism it guards is now permanently retired, so preserving it preserves a forbidden shape."
The same holds for the other 57: their subject leaves the deliverable. Two further facts decide it:

1. **A frozen archive has no regression surface.** D-04 makes the `.planning/` copy inert -- never an
   agent input, never loaded by a skill. A regression guard on a document nothing reads and nothing
   edits can only fail on a deliberate archive edit. That is the guard-that-cannot-fail class in a
   new costume.
2. **Retargeting couples a SHIPPED-SKILL gate to a planning artifact.** `check-red-references.mjs` is
   the lz-red reference-completeness gate (its own banner, `:530`). Pointing 44 of its checks at
   `.planning/` makes a planning-doc edit able to redden the skill gate. Wrong direction of coupling.

**The lazier-looking alternative and why I reject it.** RETARGET-the-count-guards is a much smaller
DIFF (change one path constant feeding `taxonomyText`, keep `row-guards.mjs` and its ~200-line fixture
untouched). It is smaller today and worse forever, for the two reasons above -- plus it is fragile
against the Q4 destination choice: if the copy lands under `.planning/quick/`, milestone close MOVES
it and every retargeted guard breaks. Recorded here so the planner can weigh it, with its arithmetic
below.

### RETIRE -- 58 exact label strings for `RETIRED_LABELS`

Composed exactly as emitted. Verified against the captured run output.

**A. The 29 positive topics (delete the whole `FILES` entry):**

```
test-double-taxonomy.md: [j9m] table of contents
test-double-taxonomy.md: [j9m] lifetime axis
test-double-taxonomy.md: [j9m] bare-stub collision headline
test-double-taxonomy.md: [j9m] defines-vs-uses column
test-double-taxonomy.md: [j9m] Self Shunt disclosure model
test-double-taxonomy.md: [j9m] Saboteur polarity caveat
test-double-taxonomy.md: [j9m] Overspecified Software citation
test-double-taxonomy.md: [j9m] Cooper false-friend caveat
test-double-taxonomy.md: [j9m] degraded-scan confidence caveat
test-double-taxonomy.md: [j9m] appendices not exhaustive
test-double-taxonomy.md: [j9m] authority is per cell
test-double-taxonomy.md: [j9m] Meszaros scoped as a reference frame, not the spine
test-double-taxonomy.md: [j9m] inherited disagreement named
test-double-taxonomy.md: [j9m] no declared precedence for the TDD content sources
test-double-taxonomy.md: [wev G6] three-axis count named
test-double-taxonomy.md: [wev G7] never-assert-an-empty-cell doctrine stated
test-double-taxonomy.md: [wev G9] tier assertions are version-bound
test-double-taxonomy.md: [wev G10] transcript mistranscription named
test-double-taxonomy.md: [wev G13] independent vocabularies, no seniority claim
test-double-taxonomy.md: [2ig] five-kind count attributed to the hierarchy figure
test-double-taxonomy.md: [2ig] prose states four by folding two members
test-double-taxonomy.md: [2ig] the five kinds enumerated as direct subtypes
test-double-taxonomy.md: [2ig] naming citation versus meaning citation
test-double-taxonomy.md: [2ig] Temporary Test Stub relationship on the lifecycle axis
test-double-taxonomy.md: [2ig] contested-word absence hedged to the swept scope
test-double-taxonomy.md: [2ig] numeral absence hedged to the parts read end to end
test-double-taxonomy.md: [2ig] positive remote-variant finding across an address space
test-double-taxonomy.md: [2ig] do-nothing hook is the real near-miss trap
test-double-taxonomy.md: [2ig] non-optional kanban qualifier carried
```

**B. The scaffold check (1) -- note the label prefix comes FIRST, an easy transcription error:**

```
[j9m] test-double-taxonomy.md: no scaffold phrase
```

**C. The 14 `absent` guards:**

```
test-double-taxonomy.md: [wev G1] no invented term
test-double-taxonomy.md: [wev G2] no empty-cell assertion
test-double-taxonomy.md: [wev G3] no skill-relative self-reference
test-double-taxonomy.md: [wev G4] no unaudited-mapping caveat
test-double-taxonomy.md: [wev G5] no degraded-scan carve-out
test-double-taxonomy.md: [wev G11] no non-occurring Metz term
test-double-taxonomy.md: [wev G12] no superseded two-axis or four-cell wording
test-double-taxonomy.md: [2ig] no set-scoped emptiness assertion
test-double-taxonomy.md: [2ig] no deliberate-negative intent inference
test-double-taxonomy.md: [2ig] no every-available-name universal quantifier
test-double-taxonomy.md: [2ig] no possessive five-kinds attribution
test-double-taxonomy.md: [2ig] no two-appendix count
test-double-taxonomy.md: [2ig] no only-occurrence skeleton phrasing
test-double-taxonomy.md: [gap] no chronology or seniority token
```

**D. Byte-identity (1) -- also an unusual shape, no `: ` after the filename:**

```
[j9m] test-double-taxonomy.md byte-identical across all three skills
```

**E. Row-scoped taxonomy guards (2):**

```
test-double-taxonomy.md: [2ig] Bernhardt row names a specific delivery
test-double-taxonomy.md: [2ig] Temporary Test Stub row states its relationship
```

**F. Count guards (9) -- ALL NINE read the taxonomy, including the two-file one:**

```
test-double-taxonomy.md: [2ig] mapped-source count re-derived
test-double-taxonomy.md: [2ig] cell count re-derived from the axes
test-double-taxonomy.md: [2ig] axis count re-derived
test-double-taxonomy.md: [2ig] cell row count re-derived
[2ig] owned-source count re-derived across both files
test-double-taxonomy.md: [2ig] kinds count re-derived from the enumeration
test-double-taxonomy.md: [2ig] closing-qualifier count re-derived
test-double-taxonomy.md: [2ig] ambiguity survey counts re-derived
test-double-taxonomy.md: [2ig] no empty data cell in the per-author table
```

**G. Chronology phrase (1):**

```
test-double-taxonomy.md: [gap] no chronology or seniority phrase (wrap-proof)
```

**I. Dependent cross-link (1) -- retires because step 6 removes the row it asserts (see Q5):**

```
principle-backing.md: [2ig] test-double taxonomy ROW backed
```

Total: 29 + 1 + 14 + 1 + 2 + 9 + 1 + 1 = **58**.

### KEEP -- 2, unchanged behaviour

```
[wev G17] no bare unqualified contested word outside the taxonomy
[2ig] roster integrity: exact emitted-check count
```

- **G17 keeps its scope.** CONTEXT measured 10/3/177 files before and after -- it never scanned the
  taxonomy copies. Only `TAXONOMY_BASENAME` (`:691`) needs attention: after deletion the filter
  `path.basename(file) !== TAXONOMY_BASENAME` (`:731`) is a no-op. **Recommendation: DELETE the
  constant and the filter.** It is self-enforcing that way -- if a copy is ever re-added to a shipped
  reference tree, G17 fires loudly on it, which is the correct outcome under D-01/D-02. Keeping a
  vacuous filter preserves the retired mechanism's shape, which is what D-02 forbids.
- **Roster keeps its behaviour, gets a new literal.**

### RETARGET -- 0

Recommended count is zero. See the reasoning above.

### `EXPECTED_CHECKS` arithmetic, with working

```
  174   current literal (check-red-references.mjs:925), equal to emitted-before-roster
-  58   retirements enumerated above
= 116   after step 7's deletions alone
+   N   new checks this task adds
```

New checks. The exit gates mandate the first two; the third mechanises D-02/step 8; the rest are the
instrument-first discipline applied to the content this task edits. **The planner sets the final N;
this is my recommended set of 8, giving `EXPECTED_CHECKS = 124`.**

| # | New check | Mandated by | Proof kind |
|---|---|---|---|
| N1 | table-shape guard | exit gate | invariant-GREEN + fixture set (Q1) |
| N2 | link-resolution guard | exit gate "no dead relative links" | **RED-at-baseline, 2 hits** (Q3) |
| N3 | no `test-double-taxonomy.md` anywhere under `plugins/` | D-02 forward constraint (see note) | RED-at-baseline until step 5 runs |
| N4 | `message-matrix.md`: Test Spy named for the record-then-inspect double | D-05 | RED-at-baseline (`Test Spy` occurs nowhere outside the taxonomy copies -- measured) |
| N5 | `message-matrix.md`: absent `Mock rule` | D-05 | RED-at-baseline (4 live occurrences) |
| N6 | `functional-core.md`: absent `Mock rule` | D-05 | RED-at-baseline (2 live occurrences) |
| N7 | `anti-patterns.md` + `principle-backing.md`: mockist attribution clarified | D-05 | RED-at-baseline |
| N8 | `lz-tpp/SKILL.md`: the naming rule survives inline | CONTEXT "the ONLY occurrences" hazard | invariant-GREEN + fixture |

**N3 is ADDITIVE beyond the literal step text and is my judgment call, flagged as such.** CONTEXT D-02
says the `:35-37` comment "must be REPLACED with the forward constraint, not merely deleted." A
comment is what CONTEXT literally asks for. A guard is strictly stronger and is ~6 lines:
`collectMarkdown(plugins).some(f => path.basename(f) === "test-double-taxonomy.md")` -> FAIL. It is
RED at baseline right now (3 hits), which is the strong proof kind, and it makes D-01 machine-enforced
instead of prose-enforced. Recommend taking it; the plan should still write the comment too.

**Arithmetic for the rejected RETARGET variant, for completeness:** retire only A+B+C+D+I = 46, keep
E+F+G pointed at the `.planning/` copy. `174 - 46 + N = 128 + N`.

### Collateral edits the label list forces -- MEASURED, and easy to miss

1. **`row-guards.selftest.mjs:493`** asserts `RETIRED_LABELS.length === 6`. Growing to 64 breaks it.
2. **`row-guards.selftest.mjs:494-498`** asserts every retired label matches `/^[a-z-]+\.md: /`.
   I tested the new labels against that regex. **Three of the 58 FAIL it:**

   ```
   FAIL  [j9m] test-double-taxonomy.md: no scaffold phrase
   FAIL  [j9m] test-double-taxonomy.md byte-identical across all three skills
   FAIL  [2ig] owned-source count re-derived across both files
   ```

   The assertion must be replaced with one that still has teeth. Recommended replacement: assert every
   entry is non-empty, that the list is duplicate-free, and that no entry equals a bare `label` value
   from the checker (i.e. every entry contains either `.md` or a `[tag] ` prefix). Do NOT just delete
   the assertion -- its purpose is catching a bare-label transcription error, which is a live hazard
   given item B's prefix-first shape.
3. **`row-guards.selftest.mjs:460-472`** asserts `ROW_SCOPED_GUARDS` has exactly 7 keys and
   `COUNT_GUARDS` exactly 9. After retirement: `ROW_SCOPED_GUARDS` -> **4** (drop
   `bernhardtDeliveryNamed`, `temporaryTestStubStatesRelationship`, `taxonomyRowBacked`),
   `COUNT_GUARDS` -> **0 (empty)**. All nine count guards read the taxonomy.
4. **`row-guards.selftest.mjs:488-492`** asserts `Object.keys(OLD_NEEDLES)` equals
   `Object.keys(ROW_SCOPED_GUARDS)`. `OLD_NEEDLES` must shrink in lockstep.
5. **Dead code after retirement in `row-guards.mjs`:** the entire section (B) -- `NUM_WORDS`,
   `CARDINAL_ALT`, `statedCardinals`, `assertStatedTotal`, `sourceBulletCount`, `axisValueCounts`,
   `productionOwnTransitionalRows`, `enumerationRuns` and all nine guards (`:247-621`), plus
   `TAXONOMY_COLUMNS` / `TAXONOMY_HEADER` / `TAX` / `taxonomyRows` (`:37-49`, `:73`). And in the
   selftest, `TAXONOMY_LINES` (`:42-147`, 106 lines) plus its whole count-guard block. The plan must
   say explicitly whether these are deleted -- an executor that only edits `RETIRED_LABELS` leaves a
   large dead-export surface that the roster gate cannot see.
6. **`check-red-references.mjs:89`** imports `COUNT_GUARDS`; if it empties, the import goes too.
7. **`lib/pipe-table.mjs:16-18`** header records the taxonomy's measurement as the justification for
   the narrow parser shape. That justification changes (the `principle-backing.md` measurement at
   `:19-23` survives). Comment-only, but it is a claim that goes stale -- see Q5.

---

## Q3. The link-resolution guard

**RECOMMENDATION: one post-loop block in the checker, one emitted check, scoped to `plugins/**/*.md`.
It has a RED-at-baseline proof available RIGHT NOW -- capture it before step 5.**

### Design (minimum viable, measured against the live tree)

1. Walk `plugins/**/*.md` with the existing `collectMarkdown`.
2. Extract inline links with `/\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g`. Per line, so a link cannot
   span a wrap (measured: none does).
3. Classify and skip:
   - `^#` -> anchor-only. **MEASURED: 30 of them, all in the taxonomy TOC.**
   - `^[a-z][a-z0-9+.-]*:` -> external scheme. **MEASURED: 0 today** in `plugins/`; `git grep -c -E
     '\]\((https?|mailto):' -- 'plugins/**/*.md'` returns nothing. Skip anyway, cheap and future-proof.
   - `^/` -> absolute. **MEASURED: 0.**
4. Split the remainder at the first `#` and resolve the file part against `path.dirname(file)`.
   **This is required, not optional: there are file-plus-fragment links in the lz-refactor catalogs**
   (e.g. `plugins/lz-tdd/skills/lz-refactor/references/extra-patterns-catalog/collecting-parameter.md:3
   -> ../functional-catalog/function-composition.md#collecting-parameter`).
5. `fs.existsSync` -> report `file:line -> target` for each miss. Aggregate into ONE report, G17 idiom.
6. Anti-vacuity: FAIL when `linksSeen === 0`.

**Intentional non-file links: none exist.** Measured -- 1014 inline links across 197 files, of which
984 relative and 30 anchor-only, 0 external, and 0 reference-style link definitions
(`^\s*\[label\]: target`). So no allowlist is needed. Say so in the comment, with the count, so a
future reader knows the omission was measured rather than forgotten.

### Scope: shipped tree ONLY, not `.planning/`

The exit gate's own wording is "No dead relative links in any shipped `SKILL.md` or reference." The
`.planning/` copy's `:289` link is handled as CONTENT in step 6 (Q5), not by this guard. Scoping the
guard to `.planning/` too would force a link fix in an inert archive for no shipped benefit.

### Proof: RED-at-baseline, TODAY, 2 hits

```
UNRESOLVED today: 2
  plugins\lz-tdd\skills\lz-refactor\references\test-double-taxonomy.md:289 -> principle-backing.md
  plugins\lz-tdd\skills\lz-tpp\references\test-double-taxonomy.md:289 -> principle-backing.md
```

This is the STRONGER proof kind and it is available for free -- CONTEXT `:270-272` predicted exactly
these two and the measurement confirms them. **Ordering consequence: build and run the link guard
BEFORE step 5 deletes the sibling copies, and record the two-hit FAIL as its RED baseline.** After
step 5 those two files are gone and the guard has no failing case left; you would be back to needing
a fixture.

### What the guard catches after step 5 -- simulated deletion, MEASURED

```
UNRESOLVED after deleting the three taxonomy copies: 7
  plugins\lz-tdd\skills\lz-red\references\principle-backing.md:71  -> test-double-taxonomy.md
  plugins\lz-tdd\skills\lz-red\references\principle-backing.md:99  -> test-double-taxonomy.md
  plugins\lz-tdd\skills\lz-red\SKILL.md:159                        -> references/test-double-taxonomy.md
  plugins\lz-tdd\skills\lz-refactor\SKILL.md:186                   -> references/test-double-taxonomy.md
  plugins\lz-tdd\skills\lz-tpp\SKILL.md:96                         -> references/test-double-taxonomy.md
  (plus the two :289 links, whose files are themselves deleted)
```

**Five shipped dead links are created by step 5. That is the exact edit list for steps 5 and 6.**

### Fixture set

Extend `row-guards.selftest.mjs` again, with an in-memory pure function
`findLinkTargets(text) -> {line, raw, kind}[]` so classification is testable without touching disk;
the `existsSync` half stays in the checker block. Cases: file link, file#fragment link, anchor-only,
`https:` scheme, absolute `/path`, a link inside a code fence (**UNVERIFIED whether any exist -- I did
not fence-filter the link scan; if the planner wants fence-awareness here, measure first**).

---

## Q4. Destination for the `.planning/` copy

**RECOMMENDATION: `.planning/research/test-double-taxonomy.md`**

### The trade-off, stated plainly -- and a correction to the premise

**The focus brief's premise is FALSE as stated, and I measured it.** The brief says
"`.planning/quick/*` dirs get archived at milestone close while `.planning/research/` persists."
`.planning/research/` does NOT persist:

```
ls .planning/milestones/     ->  lz-tdd@0.0.1-phases    lz-tdd@0.0.1-research
                                 lz-tdd@0.0.2-phases    (no -research; the dir did not exist yet)
ls .planning/research/       ->  ARCHITECTURE.md FEATURES.md PITFALLS.md STACK.md SUMMARY.md
                                 (all dated Jul 18, i.e. created AFTER the 0.0.2 close on Jul 17)
```

`lz-tdd@0.0.1-research` in the milestones dir is direct evidence that a previous milestone close
MOVED `.planning/research/` wholesale. The current `research/` is the 0.0.3 milestone's, and the
0.0.3 close will archive it the same way.

**Consequence: NO milestone-scoped `.planning/` subdirectory survives a close.** Only top-level files
that the close UPDATES rather than archives (`PROJECT.md`, `STATE.md`, `MILESTONES.md`) genuinely
persist in place. So the real choice is not persist-versus-archive -- it is WHICH archived path.

| Candidate | Where it ends up at 0.0.3 close | Verdict |
|---|---|---|
| `.planning/quick/260729-lc9-.../260729-lc9-TEST-DOUBLE-TAXONOMY.md` | buried under a task ID inside the archived phases tree | Rejected. Illegible path; a future reader looking for "the test-double taxonomy" will not think to open a quick-task folder named after a 3-character hash. |
| `.planning/research/test-double-taxonomy.md` | `.planning/milestones/lz-tdd@0.0.3-research/test-double-taxonomy.md` | **CHOSEN.** Archived, but to a legible, self-describing, correctly-dated path, grouped with the milestone's other research. Findable by basename from the repo root. |
| `.planning/TEST-DOUBLE-TAXONOMY.md` (top level) | persists in place | Rejected. It is the only truly persistent option, but a 522-line reference at `.planning/` top level breaks the convention that top level holds project-state documents only, and D-04's requirement is that no reader mistakes it for settled -- the HEADER does that job, not the path. |

**This measurement independently reinforces the RETARGET-0 recommendation in Q2.** Any guard pointed
at the `.planning/` copy breaks at the next milestone close, whichever `.planning/` subdirectory is
chosen. There is no "safe" retarget destination.

**MEASURED:** `.planning/research/` already exists and its five files are tracked
(`git ls-files .planning/research`), so this adds a file to an existing tracked directory -- no new
directory, no gitignore question.

Keep the basename `test-double-taxonomy.md` so `git log --follow` tracks the move and the D-02 rename
history stays legible. Do the move with `git mv` from the lz-red copy (the canonical one), then delete
the two siblings -- that gives git a clean rename plus two deletions rather than three deletions and
one addition.

### The inert-record header (D-04 + D-11)

Draft, ASCII only, to sit above the existing `# ` title:

```markdown
# Test-double taxonomy -- INERT RECORD, NOT A SKILL REFERENCE

> **STATUS: NOT ACCEPTED. This document is an archived record, not a deliverable and not an agent
> input.** It shipped as a bundled reference in three lz-tdd skills, was REMOVED from all of them by
> quick task 260729-lc9, and no skill, agent or command reads it. Do not wire it into `oracle.md`,
> `oracle-reviewer.md`, or any SKILL.md.
>
> **Why it is here.** Its per-author map is the useful part: it records which author uses which
> test-double term, on which side, and which source to cite. Use it to UNDERSTAND the oracle's
> sources and to frame a question to the oracle -- never as an authority a coach quotes.
>
> **It failed three consecutive acceptance gates.** Round three's independent unprimed review returned
> ACCEPT WITH FIXES: 2 BLOCKING, 15 IMPORTANT, 10 MINOR. The findings are in
> `.planning/quick/260729-2ig-remediate-the-test-double-taxonomy-after/260729-2ig-ACCEPTANCE-REVIEW.md`.
> The map itself verified sound every round; every blocker sat in the argumentation wrapped around it.
>
> **What remains open in this file:**
> - The IMPORTANT and MINOR findings from that review are NOT all closed.
> - Absence claims here rest on a degraded scan of parts of the sources; nobody has verified a
>   whole-book negative, because the oracle agent has no search tool.
> - Statements about how this document was distributed, gated or enforced describe a state that no
>   longer exists.
>
> **Forward constraint (D-02).** If a future milestone needs this material in the plugin, it goes in
> as ONE plugin-wide shared reference. Never as byte-identical per-skill copies.
```

D-11's reinstated absence rule is a CONTENT edit inside section 1's hard-rule block, not part of this
header: restore the struck clause "never about the literature at large and **never about what some
author does or does not name**", and scope `:106` ("He does not name that artifact") to what was
actually read.

---

## Q5. The step-6 sweep -- every claim step 5 makes false

This is the completeness-critical section. Method: exhaustive `git grep` over the whole shipped tree
plus the checker tooling for (a) the taxonomy filename, (b) the word `taxonom`, (c) self-referential
and distribution phrases in the taxonomy itself, (d) the resolved-link simulation from Q3.

### Tier 1 -- BLOCKING. A surviving sentence that becomes literally false.

| # | `file:line` | The claim | Why step 5 falsifies it |
|---|---|---|---|
| S1 | `test-double-taxonomy.md:211-215` | "A gate in the lz-red DEVELOPMENT WORKSPACE checks that rule across all three skills' reference trees and all three routers, **exempting the three copies of this document**" | There are no three copies. The exemption is deleted (Q2 KEEP note). CONTEXT-named; the acceptance review certified this sentence TRUE. |
| S2 | `test-double-taxonomy.md:289` | "Both are stated in full on the row that backs it in `[principle-backing.md](principle-backing.md)`" | Dead relative link from `.planning/`. The two NOT-OPTIONAL qualifiers are declared "stated in full" behind a link that resolves nowhere. CONTEXT-named. |
| **S3** | **`test-double-taxonomy.md:81`** | **"No eight-cell matrix diagram is drawn here on purpose. This page is read mid-cycle, and a list is [...]"** | **NOT NAMED IN CONTEXT.** After step 5 the page is read mid-cycle by nobody -- it is an inert `.planning/` record. The sentence's whole justification for a design choice rests on a readership that no longer exists, and it directly contradicts the D-04 header. |
| **S4** | **`test-double-taxonomy.md:7`** | **"This document settles what to CALL things and which author to cite for each cell."** | **NOT NAMED IN CONTEXT.** "Settles" is a claim to operative authority. The D-04 header states the document is not accepted and not an agent input. Header and lead would contradict each other on the same screen. |
| S5 | `principle-backing.md:71` | The whole `[Test-double taxonomy](test-double-taxonomy.md)` row: dead link, plus "Twelve sources, mapped per row **inside the linked document**", plus "four owned sources name it" | Shipped dead link (measured). Every cell describes a document that is no longer in the tree. |
| S6 | `principle-backing.md:98-99` | "The same inherited conflict is recorded from the vocabulary side in `[test-double-taxonomy.md](test-double-taxonomy.md)`." | Shipped dead link (measured). |
| S7 | `lz-red/SKILL.md:154-159` | The appendix bullet: "It places every artifact on three axes [...] Read it before using the word stub" + the link | Shipped dead link (measured). D-12 requires lz-red to end with the naming rule INLINE and no reference. |
| S8 | `lz-tpp/SKILL.md:92-96` | The bullet + link | Shipped dead link (measured). And `:93,:95` are the ONLY `stub`/`production-side` occurrences in the whole lz-tpp tree -- confirmed by `git grep -n -iE '\b(stub\|stubs\|stubbed\|stubbing)\b' -- plugins/lz-tdd/skills/lz-tpp`, which returns exactly those two lines. |
| S9 | `lz-refactor/SKILL.md:182-186` | The `## Test-double and stand-in taxonomy` H2 section + link | Shipped dead link (measured). |

### Tier 2 -- BLOCKING, in the instrument's own prose. D-02 names one; I found three more.

| # | `file:line` | The claim |
|---|---|---|
| S10 | `check-red-references.mjs:35-37` | "ships as three copies (lz-red, lz-tpp, lz-refactor), one per skill because a bundled reference is scoped to its own skill directory" -- **CONTEXT D-02 explicitly requires this be REPLACED with the forward constraint, not merely deleted.** |
| S11 | `check-red-references.mjs:20-23` | "TWELVE FILES entries as of quick-260728-j9m: the eleven above plus test-double-taxonomy.md" -- becomes eleven again. |
| S12 | `check-red-references.mjs:632-637` | The byte-identity block comment: "ships as THREE copies -- one per skill -- because a bundled reference is scoped to its own skill directory: no cross-skill `../` path, no symlink, and no plugin-root shared dir." **This sentence is the seed of the defect and it is DUPLICATED from `:35-37`. Deleting only one leaves the claim standing.** |
| S13 | `check-red-references.mjs:669-679` | G17's scope comment, which says the gate walks three reference trees "and the taxonomy-basename exclusion already covers their copies" -- false once the exclusion is removed. |
| S14 | `lib/pipe-table.mjs:16-18` | "MEASURED against both targets at authoring time: `test-double-taxonomy.md` -- 36 lines start with `\|`, every one splits to exactly 11 parts" -- the file is no longer a target of this module. |
| S15 | `check-red-references.mjs:874-875` | The chronology block's "SCOPED TO THE lz-red COPY ALONE, and that is sufficient rather than lazy: the sha256 byte-identity gate above already forces all three copies equal" -- the justification evaporates with the gate. Retires with G, but the comment must go with it. |

### Tier 3 -- ADVISORY. Not false, but reads oddly and a reviewer will flag it.

| # | `file:line` | Note |
|---|---|---|
| S16 | `test-double-taxonomy.md:171,174` | "This is the reason the document exists" / "What this page adds is" -- present-tense claims of an operative role. Survives, but sits under a header saying the document is inert. |
| S17 | `row-guards.selftest.mjs:154,164` | Fixture lines containing `[test-double-taxonomy.md](test-double-taxonomy.md)`. These are IN-MEMORY fixtures, not claims about the shipped tree -- **not false**. But they exist solely to exercise `taxonomyRowBacked`, which retires. Delete with the guard. |
| S18 | `.planning/.continue-here.md` and `HANDOFF.json` | Describe a merged three-copy state. Planning history, not a shipped claim. **Recommend leaving them: rewriting history is worse than a dated record.** State this explicitly so a reviewer does not read the omission as a miss. |

### Search vocabulary used, so a reviewer can judge completeness

The sweep is only as complete as its needles, so they are listed rather than summarised. Over the
taxonomy, all three SKILL.md, every shipped reference, and the three tooling files:

`test-double-taxonomy` | `taxonom` | `three copies` | `three skills` | `three routers` | `all three` |
`byte-identical` | `per copy` | `bundled` | `skill director` | `each skill` | `the plugin` |
`not shipped` | `outside the plugin` | `installed copy` | `shipp` | `a gate in` | `\bgate\b` |
`\bguard` | `checker` | `battery` | `workspace` | `enforc` | `machine-` | `automat` |
`this document` | `this page` | `this file` | `relative (form|reference|link|path)` |
`\bthree\b` (exhaustive, 20 hits, all triaged)

Plus a mechanical pass: every inline markdown link in `plugins/**/*.md` resolved on disk before and
after a simulated deletion (Q3). The mechanical pass is what found S5-S9 independently of the prose
needles, so those five are measured rather than reasoned.

**Residual risk, stated rather than hidden:** a claim phrased without any of the above tokens would
be missed. The classes I judge most exposed are (a) a sentence describing the document's ROLE without
naming a copy or a gate -- S3 and S4 are exactly that class and were caught by the `this page` /
`this document` needles, and (b) an assertion in a table CELL rather than in prose. I read the full
per-author table (`:233-268`) and found no distribution claim in any cell.

### What I checked and found CLEAN (so absence is measured, not assumed)

- `git grep -n -i 'taxonom' -- 'plugins/**/*.md'` outside the taxonomy copies returns 13 hits. Nine
  are S5-S9 above. The other four are unrelated uses of the word: `message-matrix.md:150` ("query/
  command test taxonomy"), `seams-and-legacy.md:50` ("seam taxonomy"), `lz-refactor/SKILL.md:145,147`
  and `smells.md:1,3,137` ("smell taxonomy"). **None is affected.**
- The taxonomy contains exactly **ONE** non-anchor relative link, `:289` (S2). Verified with
  `git grep -n -E '\]\([^)#][^)]*\)'` over the file.
- `test-double-taxonomy.md:357` says "all three" but of stand-in LEVELS, not copies. Not affected.
- 0 external-scheme links and 0 reference-style link definitions anywhere in `plugins/`.

### Step-3 blast radius (D-05) -- MEASURED, and NARROWER than it looks

Included here because an over-wide step 3 is the likeliest way to manufacture a fifth self-falsifying
claim, and because these edits share files with the step-6 sweep.

**`Mock rule` -- exactly SIX occurrences, matching D-05's list byte for byte:**

```
functional-core.md:42   ## Mock rule: no doubles in the core          <- an H2 HEADING
functional-core.md:44   - Mock rule: the core needs no test doubles   <- a bullet label
message-matrix.md:38    - Mock rule: no double.
message-matrix.md:47    - Mock rule: no double.
message-matrix.md:57    - Mock rule: this is the ONE cell that warrants a double.
message-matrix.md:67    - Mock rule: no double.
```

Note D-05 calls all six "headings"; only `functional-core.md:42` is an actual heading. The other five
are bullet labels. The plan should say which it means so the executor does not restructure sections.

**"the one warranted double" -- NINE occurrences, and EIGHT of them are CORRECT. Do NOT sweep-rename.**

```
anti-patterns.md:38, :128, :166
test-structure-and-assertions.md:130
message-matrix.md:57, :73, :79, :137
vitest-typescript-mechanics.md:66
```

`double` is the correct UMBRELLA term at all nine sites -- a Test Spy IS a test double. D-05's defect
is narrower: at `message-matrix.md:131-138` the demonstrated artifact records calls and the test
inspects them afterwards (taxonomy row `:258` = Test Spy), yet the section is labelled "Mock rule" and
`:137` calls it "the one warranted double" in a context that reads as Mock Object. **Only the `:131-138`
example and its label need the Test Spy name.** Renaming the other eight would be a fresh error.

**`Test Spy` occurs NOWHERE outside the taxonomy copies** --
`git grep -n -i 'test spy' -- 'plugins/**/*.md'` minus the taxonomy returns zero. That is what makes
guard N4 RED-at-baseline, the strong proof kind.

### Coupling hazards the step-6 edits create for EXISTING guards

These are not false claims but they will redden the battery if the plan does not sequence them.

| Existing guard | Hazard |
|---|---|
| `check-red-references.mjs:209` topic `expect-to-send warranted double`, re `/expect[ -]to[ -]send/i` | **LOW risk, measured.** `expect-to-send` has SIX sites in the lz-red tree (`message-matrix.md:54,79,81,92,137`; `vitest-typescript-mechanics.md:67`), so rewriting `:137` alone cannot redden it. Noted so the plan does not over-constrain the D-05 wording. |
| `row-guards.mjs:468-490` `fourOwnedSourcesName`, `expectedSites: 2` | One of its two sites is `principle-backing.md:71`, the row S5 deletes. Retires under my recommendation; **if the planner retargets instead, this guard breaks on the row deletion.** |
| `row-guards.mjs:152-161` `taxonomyRowBacked` | Asserts `principle-backing.md`'s row links `(test-double-taxonomy.md)`. S5 removes exactly that. Must retire, not retarget. |
| `check-red-references.mjs:289` topic `>= 1 recommendation link`, re `/\]\([^)]+\.md/` | Survives S5/S6 comfortably -- `principle-backing.md` has ~30 other `.md` links. No action. |

---

## Q6. Replacement sentences for the routers

All three drafts were checked against `[wev G17]` by hand-simulating `BARE_WORD_RE` +
`SIDE_QUALIFIED_RE` + `META_MENTION_RE` (`check-red-references.mjs:687-689`). The gate is per line and
matches `stub|stubs|stubbed|stubbing` case-insensitively; the only two legal preceding contexts are an
IMMEDIATELY preceding `production-side ` / `collaborator-side `, or `the word ` (optionally followed by
a quote character). **A line wrap between the qualifier and the word DEFEATS the allowlist** -- the
regexes are anchored to end-of-slice on the same line. Every draft below keeps qualifier and word on
one line; that constraint is load-bearing, not cosmetic.

### `lz-tpp/SKILL.md` -- replaces the bullet at `:92-96`

lz-tpp is the skill that FILLS the empty symbol, and `:93`/`:95` are the only two occurrences of the
contested word in its entire tree (measured). So the replacement must carry the naming rule, not just
delete the pointer.

```markdown
- A production symbol with no implementation yet is a production-side stub. Always qualify it by
  side, because owned sources assign the bare word to opposite sides; when a developer says it
  unqualified, establish which side they mean before answering.
```

G17 simulation, line by line:
- Line 1 contains `stub` at "a production-side stub". Preceding slice ends `...is a production-side ` ->
  `SIDE_QUALIFIED_RE` matches. **PASS.**
- Line 2 contains no member of the stub family -- "the bare word" is used instead of naming it. **PASS.**
- No occurrence of `this skill` (the retired `[wev G3]` needle is not live here anyway).

Skipped: a second sentence explaining the three axes. lz-tpp does not need the axes to pick a
transformation; the naming rule is the whole of what `:93-95` contributed.

### `lz-refactor/SKILL.md` -- replaces the H2 section at `:182-186`

**MEASURED: the lz-refactor tree contains ZERO occurrences of `stub`/`stubs`/`stubbed`/`stubbing` and
zero of `production-side`/`collaborator-side` outside the taxonomy copy.** So there is no naming rule
to preserve here -- the removed section was about transitional-versus-permanent artifacts, which is
lz-refactor's own concern. The replacement should say that, and nothing about the contested word.

```markdown
## Transitional versus permanent stand-ins

When a request turns on whether an artifact is a temporary step or a permanent fixture of the design,
say which it is before refactoring it: a temporary step is meant to be replaced and a permanent
fixture is part of the shape you are refactoring toward.
```

G17 simulation: no member of the stub family on any line. **PASS unconditionally.**

Lazier alternative, named per the ladder: delete the section outright with no replacement. The step
list says "one inline sentence each", so I drafted one -- but lz-refactor loses nothing functional if
the section simply goes, since no other line in its tree depends on it. Owner's call.

### `lz-red/SKILL.md` -- replaces the bullet at `:154-159`

**The focus asked about the two siblings, but lz-red needs one too** -- `:159` is a measured dead link
after step 5 (S7), and D-12 states the end state is "lz-red ships NO test-double reference -- only the
never-bare-`stub` rule, inline." Recommended placement is NOT the `## Reference material` list (a
bullet there with no link is odd) but inline in step 6 of the coach procedure, adjacent to the two
existing side-qualified uses at `:99-100`:

```markdown
Always qualify the contested word by side -- a production-side stub is the symbol's own unwritten
implementation, a collaborator-side stub stands in for something else. Owned sources assign the bare
word to opposite sides, so when a developer uses it unqualified, establish which side they mean
before answering.
```

G17 simulation:
- Line 1: `stub` at "a production-side stub" -> `SIDE_QUALIFIED_RE`. **PASS.**
- Line 2: `stub` at "a collaborator-side stub" -> `SIDE_QUALIFIED_RE`. **PASS.** (Note the qualifier and
  the word are on the SAME line by construction; splitting them across the wrap would FAIL.)
- Lines 3-4: no stub-family occurrence. **PASS.**

The eight existing side-qualified uses in the lz-red tree (`SKILL.md:99,100,111,125`;
`anti-patterns.md:32`; `principle-backing.md:85`; `three-laws-and-test-selection.md:78`;
`vitest-typescript-mechanics.md:64`) are untouched and all already pass G17.

---

## Ordering hazards between the eight steps

Ordered by severity. Each names the masking failure it causes.

| # | Hazard | Required order |
|---|---|---|
| **H1** | **The link guard's RED-at-baseline proof is DESTROYED by step 5.** The only two failing cases today are the two sibling copies' `:289` links, and step 5 deletes those files. Build it after and you must manufacture a fixture instead of capturing a real FAIL. | **Step 2 (or a new step 2b) BEFORE step 5.** Record the two-hit FAIL as the baseline. |
| **H2** | **Step 4 says "verbatim"; steps 1, 6 and D-11 all edit that same text.** If step 4 runs after them, a "verbatim" copy silently reverts the C-B1 fix, the D-11 reinstatement and the S1-S4 sweep. If it runs before them, "verbatim" is satisfied at copy time and the edits land on the copy. | **Step 4 BEFORE steps 1 and 6 for the taxonomy text.** Interpret "verbatim" as "copied without rewriting", then edited in place. State this in the plan; it is the single most likely executor misreading. |
| **H3** | **Deleting the taxonomy before re-scoping the battery makes 43 checks vanish silently** (measured; only 15 fail loud). A run in that window is not a signal. | **Step 7's retirements land in the SAME commit as step 5's deletions,** or the battery is meaningless in between. Do not commit step 5 alone. |
| **H4** | **The D-05 fix is over-wide by default.** "the one warranted double" has 9 sites and 8 are correct (measured, above); an executor told to "fix the Mock/Spy mislabelling" may sweep all 9. `check-red-references.mjs:209` is NOT at risk (6 `expect-to-send` sites), so the battery will NOT catch an over-wide rename. | Step 3's plan text must name the exact target as `message-matrix.md:131-138` and its label only, and say the other eight sites are correct. Re-run the battery before step 5 muddies the diff. |
| **H5** | **`RETIRED_LABELS` growth breaks three assertions in `row-guards.selftest.mjs` (measured: `:493` length, `:494-498` regex on 3 labels, `:460-472` guard-key counts).** An executor that runs only the main battery sees GREEN and ships a red selftest. | Both exit-gate commands must be `&&`-chained in every verify block: `node .../check-red-references.mjs && node .../row-guards.selftest.mjs`. |
| **H6** | **`COUNT_GUARDS` empties.** `check-red-references.mjs:89` imports it and `row-guards.selftest.mjs:474-487` asserts nine keys. A partial retirement leaves an import of an empty object and a failing assertion. | Retire the count guards as one atomic edit across all three files. |
| **H7** | Step 8's forward-constraint comment replaces `check-red-references.mjs:35-37`, but the SAME claim is duplicated at `:632-637` (S12). | Step 8 must sweep both sites, or the retired mechanism's justification survives verbatim. |
| **H8** | G17's `TAXONOMY_BASENAME` exclusion is removed, but the new table-shape guard scans the `.planning/` copy. If someone reuses `TAXONOMY_BASENAME` for the `.planning/` path, G17 could be re-widened onto it by accident and fire on hundreds of legitimate occurrences. | Keep the two scopes textually separate. G17: `plugins/` only. Shape guard: `plugins/` + the one `.planning/` path. |

---

## Assumptions Log

| # | Claim | Section | Risk if wrong |
|---|---|---|---|
| A1 | ~~`.planning/research/` is not archived~~ **RESOLVED AND FALSIFIED, see Q4.** `.planning/milestones/lz-tdd@0.0.1-research` proves a prior close moved it. The focus brief's premise was wrong; the recommendation survives on a different (legible-archived-path) argument. | Q4 | n/a -- measured, not assumed |
| A2 | No inline markdown link in `plugins/` sits inside a code fence | Q3 | The link guard could false-fail on an illustrative link in a fenced example. **UNVERIFIED** -- my link scan was not fence-filtered. Measure before shipping, or add fence-awareness by default (the shape guard already has the helper). |
| A3 | Fixture cases 5 and 6 of the shape guard behave as described | Q1 | Low. The algorithm trivially yields them, but they are designed-not-run. |
| A4 | `~14` in CONTEXT's discretion note refers to the 14 taxonomy `absent` guards | Q2 | If the owner meant a different 14, my RETIRE-58 recommendation is a wider cut than intended. The RETARGET arithmetic is provided so the planner can switch without re-measuring. |

---

## Repo state at end of research

```
$ git status --short
?? .planning/quick/260729-lc9-scope-the-test-double-taxonomy-to-lz-red/

$ node .claude/skills/lz-red-workspace/tools/check-red-references.mjs   -> EXIT 0
$ node .claude/skills/lz-red-workspace/tools/row-guards.selftest.mjs    -> EXIT 0
```

The only untracked entry is this task's own quick-task directory (CONTEXT.md + this RESEARCH.md).
All three probe scripts ran from the session scratchpad OUTSIDE the repo; every mutation was
in-memory. No tracked repo file was edited, moved or deleted, and both exit-gate commands still
pass at baseline.
