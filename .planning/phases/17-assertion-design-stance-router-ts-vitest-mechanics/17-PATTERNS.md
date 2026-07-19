# Phase 17: Assertion Design, Stance Router & TS/Vitest Mechanics - Pattern Map

**Mapped:** 2026-07-19
**Files analyzed:** 9 (8 Markdown stubs co-edited/filled + 1 dev-only checker extended)
**Analogs found:** 9 / 9

> This is a Markdown skill-authoring phase, not application code. "Role" and "data flow" are
> documentation-authoring roles (reference-slice / leaf / nav-index / backing-map / dev-checker),
> not runtime tiers -- the same framing RESEARCH used for its Architectural Responsibility Map.
> Every target is a MODIFY (fill an existing Phase-15 stub, or extend the Phase-16 instrument);
> nothing is net-new. The "excerpts to copy from" show the STRUCTURE to mirror (heading shape,
> bullet contract, fence style, Sources section), not literal code the planner pastes.

## File Classification

| Target file (all MODIFY) | Role | Data flow | Closest analog | Match quality |
|--------------------------|------|-----------|----------------|---------------|
| `plugins/lz-tdd/skills/lz-red/references/test-structure-and-assertions.md` (ASRT slice) | reference-content-slice (co-edited) | progressive-disclosure coach reference + tsc fence | SELF, the filled STR slice (same file, lines 19-84) + `three-laws-and-test-selection.md` | exact (in-file) |
| `plugins/lz-tdd/skills/lz-red/references/testing-stance/README.md` | navigation-index | navigation-only (recognize-by + links) | `plugins/lz-tdd/skills/lz-refactor/references/smells.md` | exact |
| `plugins/lz-tdd/skills/lz-red/references/testing-stance/functional-core.md` | reference-leaf (no-oracle) | progressive-disclosure + tsc fence | `naming.md` (bullet+fence+Sources) + leaf shape of `refactoring-without-tests.md` | role-match |
| `plugins/lz-tdd/skills/lz-red/references/testing-stance/message-matrix.md` | reference-leaf (OWNED, oracle-gated) | progressive-disclosure + tsc fence | `naming.md` owned-attribution shape + RESEARCH 6-cell matrix table | role-match |
| `plugins/lz-tdd/skills/lz-red/references/testing-stance/seams-and-legacy.md` | reference-leaf (no-oracle, cross-link) | cross-skill link (do not copy) | `refactoring-without-tests.md` (the link TARGET) + `principles.md` cross-link form | exact (target verified on disk) |
| `plugins/lz-tdd/skills/lz-red/references/vitest-typescript-mechanics.md` | reference-leaf (no-oracle) | progressive-disclosure + tsc fences | `three-laws-and-test-selection.md` fence + `naming.md` | role-match |
| `plugins/lz-tdd/skills/lz-red/references/anti-patterns.md` | reference-leaf (Cooper OWNED + no-oracle) | progressive-disclosure (prose/table, fence optional) | `naming.md` mixed-provenance + RESEARCH anti-pattern table | role-match |
| `plugins/lz-tdd/skills/lz-red/references/principle-backing.md` (co-edited) | backing-map (cross-cutting registry) | cross-cutting registry | aggregate `## Sources` tier convention across the filled lz-red refs + `principles.md` voice | partial (no single-file table analog) |
| `.claude/skills/lz-red-workspace/tools/check-red-references.mjs` | dev-checker (instrument, NOT shipped) | content-completeness gate (validation) | SELF (extend in place) + `check-backing.mjs` template | exact |

## Pattern Assignments

### `references/test-structure-and-assertions.md` -- ASRT slice (reference-content-slice, co-edited)

**Analog:** SELF -- the STR slice already filled in Phase 16 IS the in-file style analog. Do not
re-derive style; mirror lines 19-84 exactly. Also mirror `three-laws-and-test-selection.md`.

**What to do:** REPLACE the Phase-17 deferral section (lines 86-90) with the ASRT content; extend
the provenance blockquote and `## Sources` (lines 92-102) to add the four-pillars (Khorikov,
no-oracle) and F.I.R.S.T. (Clean Code Ch.9, OWNED/oracle-gated) sources. Leave the STR slice intact.

**Bullet-contract to mirror** (lines 54-61, incl. the OWNED-attribution parenthetical):
```
## One concept per test

- Rule: let each test pin a single concept, so a failure points back to exactly one broken behavior.
  ...
- When-to-use: when a test accumulates assertions about different behaviors ...
- Distilled rationale (Robert C. Martin, owned; oracle-verified): a test that owns exactly one
  concept turns a red bar into a precise signal ...
```
Every ASRT heading follows `Rule:` (or `Property:` for the pillars) / `When-to-use:` /
`Distilled rationale:`. Owned surfaces (F.I.R.S.T.) carry the `(Author, owned; oracle-verified)`
parenthetical; no-oracle surfaces (four pillars) omit it.

**Heading to REPLACE** (lines 86-90) -- and per RESEARCH instrument note (d/a), DROP the literal
"(Phase 17)" from the new heading so the instrument's inverted deferral guard cannot false-fail:
```
## Assertions and the four pillars (Phase 17)   <-- current deferral stub; REPLACE
```
Becomes a real content heading, e.g. `## Assert observable behavior: the four pillars` (no
"(Phase 17)").

**tsc-strict fence to mirror** (lines 65-84 -- self-contained, vitest import, AAA comments, SUT
defined in the same fence): see Shared Pattern "tsc-strict Vitest fence".

**Sources section to extend** (lines 92-102) -- add rows for Khorikov (no-oracle) and F.I.R.S.T. /
Clean Code Ch.9 (owned; oracle-verified). Format per Shared Pattern "Sources + access tier".

**Co-edit guard:** the F.I.R.S.T.-as-baseline PROCEDURE step (LAW-02) is Phase 18 -- add its
insertion-point marker and keep it; do NOT author the procedure here.

---

### `references/testing-stance/README.md` (navigation-index)

**Analog:** `plugins/lz-tdd/skills/lz-refactor/references/smells.md` (the stub itself declares this,
line 7: "This mirrors the lz-refactor smells.md index convention").

**Nav-only header + NAVIGATION-ONLY declaration to mirror** (`smells.md` lines 1-8):
```
# Code Smells index (unified taxonomy ...)

Scope: ... This index is NAVIGATION ONLY: per smell, a recognize-by cue and a link to its leaf.
It deliberately carries NO candidate refactorings, so a coach must open the smell leaf ...
```
The README must carry recognize-by signals + links ONLY (Pitfall 4: README accreting stance content
is the failure mode). Assert/mock guidance lives in the leaves, never here.

**Route-row form.** `smells.md` uses `### Name` + `Recognize by: ... ([leaf](path.md))` (lines
14-16). The README stub (lines 25-27) already lists the three route targets; RESEARCH (lines
286-293) specifies a 3-row route TABLE instead:

| Detection signal (recognize-by) | Route to |
|---------------------------------|----------|
| Value-in / value-out; pure functions; no mocking needed | `functional-core.md` |
| Object with collaborators; a query/command message split | `message-matrix.md` |
| Untested legacy; hidden I/O; no obvious place to assert | `seams-and-legacy.md` |

Either the `smells.md` `### + Recognize by` row form or a markdown table satisfies the nav-index
contract; the table matches RESEARCH's spec and the checker token (`route table`). No fence
(`requireFence: false`); the extractor skips READMEs anyway.

**Sources:** rewrite `## Sources (placeholder)` (lines 29-32) to `## Sources` (router-only; the
leaves carry the sourced stance content) -- see Shared Pattern "scaffold rewrite".

---

### `references/testing-stance/functional-core.md` (reference-leaf, no-oracle)

**Analog:** `naming.md` for the bullet+fence+Sources shape; leaf sectioning from
`refactoring-without-tests.md`.

**Leaf bullet contract** -- the stub's own content contract (lines 15-19) already names the fields:
`Signal:` (recognize-by) / `Assert rule:` (value-based over the core) / `Mock rule:` (the core needs
no double). Mirror the `naming.md` Convention/When-to-use/Distilled-rationale rhythm with these
field names.

**tsc-strict fence** required (`requireFence: true`): an output-based (value-in / assert value-out)
example with NO doubles. Mirror the fence at `three-laws-and-test-selection.md` lines 54-72. See
Shared Pattern.

**Pitfall 3 (brownfield trap):** scope to "when the code IS value-in/value-out"; do NOT present FCIS
as the default. No-seam legacy routes to Feathers, not here.

**Sources:** Bernhardt (unowned; high-confidence core only, no-oracle) -- Shared Pattern "Sources".

---

### `references/testing-stance/message-matrix.md` (reference-leaf, OWNED / oracle-gated)

**Analog:** `naming.md` -- specifically its OWNED-attribution shape (Metz + Owen, lines 44-47 and
the Sources entry lines 87-89: "Owned; oracle-verified against the clean-room source").

**Owned-attribution bullet to mirror** (`naming.md` line 44):
```
- Distilled rationale (Sandi Metz and Katrina Owen, owned; oracle-verified): ...
```
This is the exact attribution string form for the OWNED 99 Bottles matrix. Final prose is produced
by the oracle / oracle-reviewer loop -- do NOT paraphrase from memory in main context (Pitfall 2).

**Matrix structure** (RESEARCH lines 268-272; the stub content contract lines 21-27 lists the same
five occupied cells). Present the 6-cell origin x type table; the ONE warranted double is
outgoing-command (expect-to-send):

| Origin \ Type | Query | Command |
|---------------|-------|---------|
| Incoming | Assert the RETURNED value | Assert the direct public SIDE EFFECT |
| Sent to self | Ignore | Ignore |
| Outgoing | Ignore | Expect to send (the one warranted double) |

**tsc-strict fence** required (`requireFence: true`): e.g. an incoming-query return assertion, and an
outgoing-command `vi.fn()` `toHaveBeenCalled()` expect-to-send. Mirror the fence shape from the
Shared Pattern; import `{ describe, it, expect, vi } from 'vitest'`.

**Sources:** Metz + Owen, 99 Bottles of OOP 2nd Ed JavaScript Edition (owned; oracle-verified).

---

### `references/testing-stance/seams-and-legacy.md` (reference-leaf, no-oracle, CROSS-LINK)

**Analog:** `plugins/lz-tdd/skills/lz-refactor/references/refactoring-without-tests.md` -- this is
the CROSS-LINK TARGET, not a copy source. Its technique bodies (Seams lines 21-31, Characterization
33-41, the change algorithm 45-50, Sprout/Wrap 53-70, Subclass-and-Override 73-80, Extract Interface
83-89) ALREADY EXIST there. RTR-01 says link, not copy -- and the no-verbatim gate would flag
duplicated prose.

**Cross-link form** to add (the stub's line 27-29 explicitly defers the link to fill time). The
verified relative path FROM this leaf (RESEARCH lines 314-318):
```
[refactoring-without-tests.md](../../../lz-refactor/references/refactoring-without-tests.md)
```
(up out of `testing-stance/` -> `references/` -> `lz-red/` -> `skills/`, then down into
`lz-refactor/references/`). This is a cross-SKILL link inside the same plugin. NOTE: the lz-red
workspace has NO crossref-resolution gate (unlike lz-refactor's `check-crossrefs.mjs`), so the
`../../../` form is correct here and only needs a presence guard (see instrument (d)).

**Leaf content (RED-step framing ONLY):** Seam (the assertion point) / Characterization test (pin
CURRENT behavior, not desired) / Sequencing (seam -> characterization -> then the new red test).
Field names from the stub contract (lines 15-20): `Technique:` / `When-to-use:` / `Assert rule:`.
`requireFence: false` (prose-heavy; a fence is optional).

**Sources:** Michael Feathers (unowned; high-confidence core only, no-oracle). Cross-linked to, not
copied from, lz-refactor's Feathers reference.

---

### `references/vitest-typescript-mechanics.md` (reference-leaf, no-oracle)

**Analog:** `three-laws-and-test-selection.md` (fence shape) + `naming.md` (bullet+Sources). Domain
facts fully specified in RESEARCH "Vitest 4.x Mechanics" (lines 320-365) and the Standard Stack
signature table (lines 171-186).

**Bullet contract** -- stub content contract (lines 15-21) names the fields: `Mechanic:` /
`When-to-use:` (the red-step move it supports) / `Distilled note:`. Map each Vitest facility to a RED
concept: `it.todo` = running test list; `test.each`/`it.each` = triangulation; `vi.*` doubles WITH
RESTRAINT (link to anti-patterns.md listen-to-the-tests + message-matrix outgoing-command);
watch mode = fast feedback loop.

**tsc-strict fences** required (`requireFence: true`). Import shape the extractor recognizes as a
module (RESEARCH line 322-326): `import { describe, it, test, expect, vi } from 'vitest';`. Avoid the
4.0 traps (RESEARCH lines 349-360, Pitfall 6): no `toMatchTypeOf`, no config snippets, no arrow-fn
mock used with `new`.

**D-09 forward-pointer (brief, do NOT author leaves, do NOT install):** type-level RED
(`expectTypeOf`/`assertType`, `--typecheck`, `*.test-d.ts`) -> ADV-01; property-based RED
(`fast-check`) -> ADV-02. One or two sentences, marked advanced/deferred.

**Co-edit guard:** "fails for the right reason" is a Vitest MECHANIC here (how to read the red bar --
`AssertionError` = valid RED; `ReferenceError`/`TypeError`/import failure = broken harness). The
LAW-02 spine + F.I.R.S.T.-baseline PROCEDURE is Phase 18 -- leave that marker (add a Phase-18
deferral guard per instrument (e)).

**Sources:** Vitest 4.x (cite vitest.dev; version-pinned 4.1.10). fast-check named only as a deferred
forward-pointer.

---

### `references/anti-patterns.md` (reference-leaf, Cooper OWNED + no-oracle)

**Analog:** `naming.md` (mixed-provenance blockquote + Sources with per-source tiers). Domain content
fully specified in RESEARCH "Anti-Patterns" (lines 369-399): the six-row anti-pattern table
(anti-pattern / Recognize by / Correction / source-tier), the RTR-03 listen-to-the-tests meta-rule,
and the ANTI-02 Test Desiderata tradeoff lens.

**Field contract** -- stub content contract (lines 15-20): `Anti-pattern:` / `Recognize by:` /
`Correction:` (observable-behavior fix). The RESEARCH table (lines 373-380) already carries these
columns at planning grain; author own-words prose from it.

**Provenance split:** Cooper's over-mock / test-per-class (#1) is OWNED (two `.oracle/` transcripts)
-> oracle-gated. The rest (private-methods, multiple-asserts, no-red, snapshot-as-thinking,
slow/order-dependent) are no-oracle. Khorikov's implementation-detail brittleness threads through
1/2/5 as the assertion-side failure mode.

**RTR-03 + GOOS counterpoint:** test-writing pain routes toward a functional core (Bernhardt) or a
seam (Feathers), NOT more doubles. GOOS (Freeman + Pryce) stated FAIRLY as counterpoint only;
classicist/value-based default holds. DHH is NEVER cited (hard ban).

`requireFence: false` (prose/table-heavy; a short bad-vs-good fence is a nice-to-have, not required
-- Open Question 1).

**Sources:** Cooper (owned; oracle-verified), Khorikov / GOOS / Beck (no-oracle) -- per-source tiers.

---

### `references/principle-backing.md` (backing-map, co-edited)

**Analog (partial):** no single-file table analog exists. Mirror (a) the aggregate `## Sources`
access-tier vocabulary already used verbatim across the filled lz-red refs, and (b) the "why we say
this" backing voice of `plugins/lz-tdd/skills/lz-refactor/references/principles.md` (lines 1-5).

**Access-tier vocabulary to reuse** (already canonical in the filled refs -- copy the exact strings):
- OWNED: `Owned; oracle-verified against the clean-room source.` (`naming.md` line 89)
- NO-ORACLE: `Unowned; high-confidence core only (no-oracle).` (`test-structure-and-assertions.md`
  line 94-95)

**What to add (co-edit):** Phase-17 backing rows mapping each new recommendation to its source +
tier: Khorikov (no-oracle, four pillars), F.I.R.S.T./RCM Clean Code Ch.9 (owned), Bernhardt
(no-oracle), Metz + Owen (owned), Feathers (no-oracle), Cooper (owned), GOOS (no-oracle), Beck
(no-oracle). The stub content contract (lines 15-19) names the row fields: `Recommendation:` /
`Source:` / `Access tier:`. A markdown table (Recommendation | Source | Access tier) is the natural
shape; link each Recommendation to the doc that states it (form: `[Extract Function](path.md)` per
`principles.md` lines 53-56).

**Sources:** rewrite `## Sources (placeholder)` -> `## Sources`.

---

## Shared Patterns

### Provenance blockquote (every filled doc)
**Source:** `three-laws-and-test-selection.md` lines 9-17; `naming.md` lines 8-14.
**Apply to:** all 7 filled Markdown docs.
Immediately under the Scope paragraph, a `>` blockquote declaring provenance + the DST-04 no-verbatim
line. Two shapes:
- Mixed-provenance (owned + no-oracle in one doc): name which material is `owned and oracle-verified
  against the clean-room source` vs `high-confidence core only, authored blind ... (no-oracle tag)`,
  then `Technique NAMES are kept as plain facts; every definition below is written in original words,
  with no verbatim source prose or code (DST-04).`
- Pure no-oracle (`refactoring-without-tests.md` lines 9-11): `No-oracle reference: high-confidence
  CORE only ... Original prose, no verbatim ... prose or code (DST-04). Technique NAMES are kept
  verbatim as facts ...`
Replace each stub's `> Populated in Phase 17 ...` marker with the real provenance blockquote.

### Bullet contract per section (all content leaves/slices)
**Source:** `three-laws-and-test-selection.md` lines 20-28; `naming.md` lines 16-24.
**Apply to:** assertions slice, functional-core, message-matrix, seams-and-legacy, vitest-mechanics,
anti-patterns.
Each `## Heading` carries three bullets: a lead verb-noun (`Rule:` / `Move:` / `Convention:` /
`Property:` / `Mechanic:` / `Technique:` / `Anti-pattern:`), then `When-to-use:`, then
`Distilled rationale:` (or `Distilled note:` / `Distilled mechanics:`). OWNED surfaces append the
attribution parenthetical `(Author, owned; oracle-verified)` on the distilled line; no-oracle
surfaces omit it. Each stub's `## Per-entry content contract` block already names that stub's exact
field labels -- reuse them.

### tsc-strict Vitest fence (fence-bearing docs)
**Source:** `three-laws-and-test-selection.md` lines 54-72; `test-structure-and-assertions.md` lines
65-84; `naming.md` lines 61-79.
**Apply to:** assertions slice, message-matrix, functional-core, vitest-mechanics (`requireFence:
true`).
```ts
import { describe, it, expect } from 'vitest';

// One-line intent comment.
describe('subjectName', () => {
  it('should <behavior>', () => {
    // Arrange
    const input = ...;
    // Act
    const result = subjectName(input);
    // Assert
    expect(result).toBe(...);
  });
});

function subjectName(...): ... {
  return ...;
}
```
Extractor constraints (RESEARCH lines 419-437; Pitfall 1): each fence is its OWN module -- SELF-
CONTAINED (define/import every symbol, no reference to a prior fence). tsconfig is `lib: ["es2021"]`,
bundler resolution, no DOM, no @types/node -- so NO `document`/`window`/`fs`/`process`. A "red
example" must COMPILE clean and FAIL AT RUNTIME (stub the SUT to return a wrong value so
`expect(...).toBe(...)` fails), never reference a not-yet-defined symbol (that is a compile error
that breaks the gate). Escape hatch: tag the fence ` ```ts ignore ` and explain in prose. Run via
`npm --prefix .claude/skills/lz-red-workspace run typecheck`.

### Sources section + access tier (all docs)
**Source:** `three-laws-and-test-selection.md` lines 94-101; `naming.md` lines 81-89.
**Apply to:** all filled docs.
Final `## Sources` section, one bullet per source: `Author, Work -- what it backs. <tier>.` Tier
strings are canonical (reuse verbatim): `Owned; oracle-verified against the clean-room source.` or
`Unowned; high-confidence core only (no-oracle).`

### Scaffold-phrase rewrite (all filled docs)
**Source:** `.claude/skills/lz-red-workspace/tools/lib/scaffold-phrases.mjs` line 8.
**Apply to:** every stub being filled.
`SCAFFOLD_RES` trips on `/\bplaceholder\b/i`, `/\bTODO\b/`, `/\bTBD\b/`, `/once it exists/i`,
`/to be authored/i`. Each stub's `## Sources (placeholder)` MUST be rewritten to `## Sources` (as
Phase 16 did), and no draft marker may remain, or `check-red-references` / `check-hygiene` fail.

### Phase-18 deferral markers (co-edit boundary D-15)
**Source:** `three-laws-and-test-selection.md` lines 88-92 (the surviving Phase-18 section);
`check-red-references.mjs` lines 40, 51, 109-112 (the must-REMAIN guard).
**Apply to:** the assertions slice (F.I.R.S.T.-as-baseline PROCEDURE / LAW-02) and vitest-mechanics
(LAW-02 spine). Leave a labelled Phase-18 insertion-point marker and add a deferral-marker-remains
guard so the co-edit boundary is machine-enforced. Do NOT edit the SKILL.md body (Phase 18 owns it).

### Hygiene (all shipped Markdown -- `check-hygiene.mjs`, no change to the checker)
**Source:** RESEARCH lines 475-482.
**Apply to:** every filled doc.
ASCII-only (use `--`, `->`, ASCII quotes -- no em-dash / curly quotes / arrows / emoji); only
`larsbrinknielsen@gmail.com` may appear as an email-shaped token (allowlist-inversion; never write the
maintainer work email or its bare domain, even as a search needle); no double-quoted run >= 120 chars
(the no-verbatim proxy -- keep example strings/quoted phrases short, never paste book prose). OWNED
surfaces additionally clear the oracle-reviewer converge-to-clean loop.

## Instrument Extension -- `check-red-references.mjs`

**Analog:** SELF (extend in place, do NOT stand up a sibling -- D-13 discretion + Open Question 2
both recommend extend) + the `check-backing.mjs` template it already mirrors.

**Current shape** (`check-red-references.mjs` lines 30-63, 68, 103-112): a `FILES` array of
`{ name, topics: [{label, re}], deferral: {label, re} | null }`; `TS_FENCE_RE = /```(ts|typescript)\b/`
asserted UNCONDITIONALLY per file (line 103-104); a `SCAFFOLD_RES` no-leak check (line 106-107); an
optional must-REMAIN `deferral` guard (line 109-112); `report()` + `SUMMARY` + `process.exit(0|1)`.

**Five required changes (RESEARCH lines 439-473):**
- (a) FLIP the `test-structure-and-assertions.md` deferral (lines 51 `deferral: {re: /Phase 17|ASRT-0/}`).
  Phase 17 FILLS that slice -> DELETE that deferral guard and add ASRT content tokens (four pillars,
  resistance to refactoring, F.I.R.S.T., observable behavior, output/state/communication). CAUTION:
  do not invert to "no Phase 17 marker" if any heading still says "Phase 17" -- the recommended fix is
  to rename the heading to drop "(Phase 17)" (see the assertions-slice assignment) and just delete the
  guard.
- (b) ADD six Phase-17 FILES entries with content tokens + the no-scaffold guard: `testing-stance/
  README.md`, `functional-core.md`, `message-matrix.md`, `seams-and-legacy.md`,
  `vitest-typescript-mechanics.md`, `anti-patterns.md`. (Subdir files: the `name` must include the
  `testing-stance/` segment, joined under `REFERENCES`.)
- (c) Make the fence assertion PER-FILE: add a `requireFence: true|false` flag (default the current
  unconditional behavior only where wanted). TRUE: assertions slice, `message-matrix.md`,
  `functional-core.md`, `vitest-typescript-mechanics.md`. FALSE: `README.md` (nav-only; extractor
  skips READMEs), and `anti-patterns.md` / `seams-and-legacy.md` (prose-heavy).
- (d) ADD a cross-link presence guard on `seams-and-legacy.md`. Model it on `check-backing.mjs` lines
  54-56 (the `>=1 fowler-catalog cross-link` topic idiom), asserting the string
  `refactoring-without-tests.md` (or the full `../../../lz-refactor/...` relative link) appears --
  machine-proof of RTR-01 "cross-linked, not copied". NOTE the path difference: lz-refactor guards a
  same-tree `(?:\.\/)?fowler-catalog/...` link (its check-crossrefs rejects `../`); lz-red's is a
  cross-SKILL `../../../lz-refactor/...` link and has no crossref resolver, so the guard just checks
  presence.
- (e) KEEP the `three-laws-and-test-selection.md` `deferral: /Phase 18|LAW-0|SEAM-0/` guard (line 40,
  untouched this phase). ADD Phase-18 deferral-marker-remains guards for any Phase-17 file that leaves
  a Phase-18 insertion point (the assertions slice F.I.R.S.T.-baseline PROCEDURE; the vitest leaf's
  LAW-02 spine note).

**Note:** `extract-samples.mjs` (tsc gate) and the shared `check-hygiene.mjs` need NO change -- they
already walk the lz-red tree recursively and auto-cover new Phase-17 files (RESEARCH lines 419-437,
475-482; "Don't Hand-Roll" table). Only `check-red-references.mjs` is extended.

## No Analog Found

None. Every target has at least a role-match analog on disk. The weakest is `principle-backing.md`
(no single-file table analog) -- but its access-tier vocabulary and backing voice are already
canonical across the filled lz-red refs and `principles.md`, so the planner has concrete strings to
copy. No file needs to fall back to RESEARCH-only patterns.

## Metadata

**Analog search scope:** `plugins/lz-tdd/skills/lz-red/references/**` (stubs + Phase-16-filled),
`plugins/lz-tdd/skills/lz-refactor/references/**` (smells.md index, principles.md backing,
refactoring-without-tests.md cross-link target), `.claude/skills/lz-red-workspace/tools/**` (the
instrument + scaffold-phrases), `.claude/skills/lz-refactor-workspace/tools/check-backing.mjs`
(checker template).
**Files scanned:** 15 read (8 stubs, 2 Phase-16-filled analogs, smells.md, principles.md,
refactoring-without-tests.md, check-red-references.mjs, check-backing.mjs, scaffold-phrases.mjs).
**Clean-room guardrail:** no `.oracle/` file was read (DST-04); owned-surface final prose is deferred
to the execute-time oracle loop by design.
**Pattern extraction date:** 2026-07-19

## PATTERN MAPPING COMPLETE

**Phase:** 17 - Assertion Design, Stance Router & TS/Vitest Mechanics
**Files classified:** 9 (8 Markdown stubs + 1 dev-only checker)
**Analogs found:** 9 / 9

### Coverage
- Files with exact analog: 4 (`test-structure-and-assertions.md` ASRT slice = SELF/STR; `README.md`
  = smells.md; `seams-and-legacy.md` = refactoring-without-tests.md cross-link target;
  `check-red-references.mjs` = SELF + check-backing.mjs)
- Files with role-match analog: 4 (`functional-core.md`, `message-matrix.md`,
  `vitest-typescript-mechanics.md`, `anti-patterns.md` = `naming.md` / `three-laws...md` house style)
- Files with partial analog: 1 (`principle-backing.md` -- aggregate tier vocabulary + `principles.md`
  voice, no single-file table analog)
- Files with no analog: 0

### Key Patterns Identified
- Every filled lz-red reference follows one house shape: Title + Scope paragraph -> `>` provenance
  blockquote (mixed / no-oracle + DST-04) -> `## Heading` sections with the
  Rule/When-to-use/Distilled-rationale bullet triad (OWNED surfaces add `(Author, owned;
  oracle-verified)`) -> a self-contained tsc-strict Vitest fence -> `## Sources` with per-source
  access tier. The Phase-16-filled `three-laws-and-test-selection.md` and `naming.md` are the exact
  templates; the STR slice of `test-structure-and-assertions.md` is the in-file analog for the ASRT
  slice.
- The `testing-stance/README.md` is NAVIGATION-ONLY, mirroring `lz-refactor/references/smells.md`
  (recognize-by cue + leaf link, zero stance content) -- Pitfall 4 is accreting content into it.
- `seams-and-legacy.md` CROSS-LINKS (does not copy) the verified target
  `../../../lz-refactor/references/refactoring-without-tests.md`; the checker gets a presence guard
  modeled on check-backing.mjs's cross-link topic idiom.
- The instrument is EXTENDED in place (not a sibling): flip the assertions-slice deferral to ASRT
  content tokens, add six FILES entries, make the ts-fence assertion per-file via a `requireFence`
  flag, add the seams cross-link presence guard, and keep/add Phase-18 deferral guards for the
  co-edit boundary. `extract-samples.mjs` and `check-hygiene.mjs` need no change.

### File Created
`.planning/phases/17-assertion-design-stance-router-ts-vitest-mechanics/17-PATTERNS.md`

### Ready for Planning
Pattern mapping complete. The planner can reference the analog files and concrete excerpts (with
line numbers) directly in each PLAN.md action section.
