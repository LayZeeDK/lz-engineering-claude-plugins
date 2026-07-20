# Phase 18: Coach Procedure & lz-tpp Seam Wiring - Pattern Map

**Mapped:** 2026-07-20
**Files analyzed:** 8 (modified; no new files -- Markdown skill-authoring + dev-only instrument extension)
**Analogs found:** 8 / 8 (every target has strong in-repo precedent; most are self-analogs or adjacent-slice analogs)

This is a Markdown skill-authoring phase (no runtime code). "Analog" means the shipped/authored
in-repo prose or checker structure the fill must MIRROR, not application code to copy. Excerpts below
are the exact structural shapes to replicate; exact wording is executor discretion (and, for the
owned Three-Laws surface, oracle-reviewer gated -- see Shared Patterns).

## File Classification

| Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---------------|------|-----------|----------------|---------------|
| `plugins/lz-tdd/skills/lz-red/SKILL.md` | skill-router (orchestration) | decision-tree / request-response | `plugins/lz-tdd/skills/lz-refactor/SKILL.md` (6-step) + `.../lz-tpp/SKILL.md` (7-step) | exact (shipped coach-procedure precedent) |
| `.../lz-red/references/three-laws-and-test-selection.md` | reference (owned content) | content-fill | its own filled slices (lines 34-43) + head blockquote (9-20) | self-analog |
| `.../lz-red/references/test-structure-and-assertions.md` | reference (content) | content-fill | its own F.I.R.S.T. section (107-120) | self-analog |
| `.../lz-red/references/vitest-typescript-mechanics.md` | reference (content) | content-fill | its own "Read the red bar" section (83-92) | self-analog |
| `.../lz-red/references/principle-backing.md` | reference (backing table) | content-fill | its own table rows (27-54) | self-analog |
| `plugins/lz-tdd/skills/lz-tpp/SKILL.md` | sibling shipped skill (SEAM-02) | cross-link pointer | lz-red seam section (36-42) + lz-refactor seam section (37-41) | exact (cross-skill seam shape) |
| `.claude/skills/lz-red-workspace/tools/check-red-references.mjs` | dev-only instrument (checker) | file-I/O validation | its own FILES entries + `deferral` guard (42-180) | self-analog + net-new field |
| `.claude/skills/lz-red-workspace/extract-samples.mjs` | dev-only instrument (tsc extractor) | file-I/O + compile | its own `walkMd` loop (101-142) | self-analog |

**NOT modified (referenced only):** `.../lz-red/references/testing-stance/README.md` -- navigation
index (Phase-17-complete); SKILL.md step 3 POINTS at its route table (RTR-02 wiring), no index
rewrite. `.claude/skills/lz-refactor-workspace/tools/check-hygiene.mjs` -- runs unchanged (already
scans lz-red on all three axes, lz-tpp on ASCII+email only). `.../tools/lib/provenance-honesty.mjs`
+ `.selftest.mjs` -- keep byte-intact; the D-05 gate must still pass 3/3.

## Pattern Assignments

### `plugins/lz-tdd/skills/lz-red/SKILL.md` (skill-router, orchestration) -- the biggest fill

**Analog A (step structure + closing paragraph):** `plugins/lz-tdd/skills/lz-refactor/SKILL.md`

Numbered decision tree, classify-first step 1 that points back at the seam section without
restating, then a "coach by default" closing paragraph. The closing paragraph is the model to mirror
for lz-red (question vs command; do not edit / run tests unasked):

lz-refactor step 1 (classify-first, points back -- lines 45-48):
```md
1. Classify the request against the lz-tpp seam. If a red / failing test must be made to
   pass, that is the green step. Hand off to lz-tpp and stop. ... See "Refactoring vs the green step"
   above; do not restate it.
```

lz-refactor closing paragraph (lines 114-121, the "coach by default; drive when asked" model):
```md
Coach by default; drive when asked. When the request is a QUESTION or asks for advice ... present
the named refactoring and the smallest next step and let the developer apply it -- do not edit their
code or run tests unasked ... When the request is an explicit COMMAND to do it ... perform [it]
yourself in small behavior-preserving steps ...
```

**Analog B (target line count + folded show-don't-drive):** `plugins/lz-tdd/skills/lz-tpp/SKILL.md`
(81 lines total). Its step 7 folds the coach-don't-drive into the last step (lines 63-65):
```md
7. Show, don't drive. Present the minimal diff and the named transformation; let the developer
   apply it and run the tests. Never edit the developer's code or run the tests
   unless explicitly asked -- coach, don't drive.
```

**Adaptation for Phase 18 (D-02 step order, replacing the placeholder at lines 52-58):**
6-step tree spining on the Three Laws (see RESEARCH "Code Examples" skeleton for exact shape):
1. Classify RED/GREEN/REFACTOR [SEAM-01]; point at the existing "RED vs the green step" section
   (SKILL.md:36-42), do not restate.
2. Three Laws spine -- Law 1 gates entry, Law 2 sizes the test (Law 3 is step 6) [LAW-01]; link
   `three-laws-and-test-selection.md`, do not restate.
3. Detect + match house idiom, route the stance via the
   `references/testing-stance/README.md` route table, STATE the route + why, honor a NL override
   [RTR-02, D-06/D-07].
4. Structure test + assert observable behavior; link `test-structure-and-assertions.md`.
5. Fail for the right reason -- AssertionError not a compile/setup error or false green, F.I.R.S.T.
   baseline [LAW-02, D-08]; link `vitest-typescript-mechanics.md` + `test-structure-and-assertions.md`.
6. Forward handoff to lz-tpp -- Law 3, the green step [SEAM-01].
Then the closing "coach by default; hand off, do not drive" paragraph (mirror Analog A) + the ONE
VIT-02 worked example (below).

**Size discipline (SKL-02):** aim under ~200 lines, near lz-tpp's 81 end of the range, well under the
500 cap. lz-red needs no analogue of lz-refactor's heavy step-5 loop-audit.

**D-14 stale-marker cleanup (MANDATORY -- 3 sites):** removing the placeholder is not enough. `git grep`
confirms three `/Phase 18/i` hits in this file that must ALL be gone after the fill:
- line 30: parenthetical "(The full coach decision procedure is deferred to Phase 18 -- see the placeholder below.)" in the Coach-mode bullet -- rewrite to describe the now-present procedure.
- line 52: the section heading "## Coach decision procedure (deferred to Phase 18)" -- becomes "## Coach decision procedure".
- lines 54-58: the whole placeholder body -- replaced by the real procedure.

### VIT-02 tsc-strict Vitest worked example (inside SKILL.md, content fence)

**Analog (existing tsc-strict fences):** `three-laws-and-test-selection.md:57-75` (sumOf) and
`test-structure-and-assertions.md:69-88` (applyCredit). All use the same shape:
```ts
import { describe, it, expect } from 'vitest';

describe('sumOf', () => {
  it('should be zero for an empty list', () => {
    // Arrange
    const values: number[] = [];
    // Act
    const result = sumOf(values);
    // Assert
    expect(result).toBe(0);
  });
});

function sumOf(values: number[]): number {
  return values.reduce((running, value) => running + value, 0);
}
```

**Critical adaptation (Pitfall 3 -- this is a RED example, not a green one):** the existing fences show
GREEN examples (the function returns the RIGHT value). VIT-02 depicts a FAILING test that STILL
tsc-compiles. Do NOT use a missing symbol (tsc RED) or a ` ```ts ignore ` fence (extractor SKIPS it
-> zero tsc coverage). Instead: a compiling stub that returns the WRONG value so it fails its
assertion at RUNTIME (an AssertionError). Types line up (tsc clean); the test is a valid red -- which
IS the LAW-02 lesson. RESEARCH "Code Examples" gives the exact `discountedTotal` shape:
```ts
function discountedTotal(total: number, percent: number): number {
  return total; // not yet implemented -> AssertionError: expected 180, received 200
}
```

### `references/three-laws-and-test-selection.md` (owned content) -- fill lines 91-95

**Analog (its own filled owned slice, "Take one small step", lines 34-43):** the exact
Move / When-to-use / Distilled-rationale bullet shape with the inline owned tier tag:
```md
## Take one small step

- Move: advance by a single new failing test at a time ...
- When-to-use: whenever you reach for the next test ...
- Distilled rationale (Robert C. Martin, owned; oracle-verified): the discipline is to grow the test
  only to the first failure, then stop -- a not-yet-defined symbol counts as that failure ...
```

**Head blockquote (lines 9-20)** is the mixed-provenance model; line 19-20 currently says the Three
Laws spine is "deferred to Phase 18 and left as a marker below" -- rewrite that sentence to declare
the now-present owned Three-Laws surface (owned; oracle-verified vs Clean Code Ch. 9), removing the
`/Phase 18/i` token.

**Adaptation:** fill "## The Three Laws spine and classify-first (Phase 18)" with owned Three-Laws
prose (Law 1 gates entry / Law 2 sizes the test / Law 3 = lz-tpp handoff) + classify-first framing.
LAW-02's "only enough to fail; not-compiling counts" is the SAME thread as the existing owned
"Take one small step" row -- keep the tier consistent. Section heading loses "(Phase 18)".
**Provenance:** this is the ONE owned surface Phase 18 introduces -- authored BLIND, orchestrator
oracle-reviewer gated (D-05/D-12). Law-3-as-handoff is orchestration (no-oracle).

### `references/test-structure-and-assertions.md` (content) -- fill lines 163-167

**Analog (its own F.I.R.S.T. section, lines 107-120):** the already-owned F.I.R.S.T. property block
LAW-02 leans on -- do not restate it, tie to it procedurally. Head blockquote line 20-21 says the
"F.I.R.S.T.-as-baseline PROCEDURE step (LAW-02) is deferred to Phase 18" -- rewrite to remove the
`/Phase 18/i` token. **Adaptation:** fill "## F.I.R.S.T. as a red-step baseline (Phase 18)" turning
F.I.R.S.T. into the coach's test-quality baseline the LAW-02 procedure step checks against. Leave
STR/ASRT content byte-stable (regression floor, Pitfall 6).

### `references/vitest-typescript-mechanics.md` (content) -- fill lines 106-111

**Analog (its own "Read the red bar" section, lines 83-92):** the existing Vitest MECHANIC that
LAW-02 ties into -- an AssertionError is a valid red; a ReferenceError/TypeError/import failure is a
broken harness. **Adaptation:** fill "## Fail-for-the-right-reason as a procedure (Phase 18)" tying
that mechanic to the LAW-02 procedure step (fail-for-the-right-reason before any production code).
Head note is a plain no-oracle blockquote (this file has no owned surface). Remove the `/Phase 18/i`
token from the heading + body sentence.

### `references/principle-backing.md` (backing table) -- fill lines 56-60

**Analog (its own table rows, lines 27-54):** the exact three-column pipe shape the D-05 parser
(`ROW_RE`) depends on. The "Grow the test only enough to fail" row (line 31) is the tier model for
the LAW rows:
```md
| Recommendation | Source | Access tier |
| --- | --- | --- |
| [Grow the test only enough to fail](three-laws-and-test-selection.md) | Robert C. Martin, Clean Code Ch. 9 | Owned; oracle-verified against the clean-room source. |
```

**Adaptation:** fill "## Three-Laws spine and lz-tpp seam backing (Phase 18)" with LAW-01/LAW-02 rows
(Clean Code Ch. 9, `Owned; oracle-verified`, gate-confirmed) + SEAM-01/SEAM-02 rows (lz-red
orchestration, no-oracle). Keep every row in the exact `| [rec](doc.md) | Source | tier |` shape.
**Pitfall 6:** never tag a row `Owned` while citing a summary-only book (the honesty gate trips).
Remove the `/Phase 18/i` token from head blockquote (line 13) + heading + body sentence.

### `plugins/lz-tdd/skills/lz-tpp/SKILL.md` (SEAM-02 reverse pointer) -- additive section

**Analog A:** `plugins/lz-tdd/skills/lz-red/SKILL.md:36-42` -- the "## RED vs the green step (lz-tpp)
and the refactor step (lz-refactor)" section:
```md
## RED vs the green step (lz-tpp) and the refactor step (lz-refactor)

The red step (choose and write the next failing test) is lz-red. Making that failing test pass by
changing behavior is the green / transformation step (lz-tpp). Restructuring passing code without
changing behavior is the refactor step (lz-refactor). Classify the request before acting: ...
```

**Analog B:** `plugins/lz-tdd/skills/lz-refactor/SKILL.md:37-41` -- the sibling "## Refactoring vs the
green step (the lz-tpp seam)" section (same shape from the refactor vantage point).

**Adaptation (D-09, ONE edit, both pointers):** lz-tpp currently has NO cross-skill pointer section
(only "## Transformations vs refactorings" at lines 30-34, which is a classify-not-a-pointer). Add a
short red-green-refactor-seam section from the GREEN vantage point: naming lz-red (the red step --
choosing/writing the next failing test) AND lz-refactor (the refactor step -- restructuring passing
code), so all three skills point at each other. Placement + phrasing = executor discretion (Q2 in
RESEARCH: likely after "Transformations vs refactorings"), gated by D-10 review.
**Backstop caveat (Pitfall 5):** lz-tpp is EXCLUDED from the no-verbatim gate (check-hygiene.mjs:126-128,
cited FibTPP), so this prose is NOT no-verbatim-backstopped -- it relies on own-words authoring + the
D-10 unbiased review. It IS covered by ASCII + work-email (wideTargets includes lz-tpp SKILL.md).

### `.claude/skills/lz-red-workspace/tools/check-red-references.mjs` (checker) -- extend in place (D-13)

**Analog (its own FILES entry + `deferral` guard, lines 42-53):**
```js
{
  name: "three-laws-and-test-selection.md",
  requireFence: true,
  topics: [
    { label: "running test list", re: /test list/i },
    ...
  ],
  deferral: { label: "Phase 18 spine/seam marker remains", re: /Phase 18|LAW-0|SEAM-0/ },
},
```

**Adaptation 1 -- flip the 4 `deferral` guards to content topics + a NEGATIVE no-stale-marker guard**
(Pitfall 1). The 4 files with `deferral` set today: three-laws (line 53), test-structure (76), vitest
(150), principle-backing (178). For each: add positive `topics` asserting the FILLED content AND add
a NEW `absent` guard that fails if `/Phase 18/i` is present. Do NOT assert `/LAW-0/`-absence --
LAW-01/LAW-02/SEAM-01 legitimately appear as requirement refs in filled content; only `/Phase 18/i`
is the clean D-14 needle. RESEARCH "Instrument flip" gives the exact shape:
```js
topics: [ /* ...existing Phase-16/17 tokens KEPT (regression floor)... */,
  { label: "Three Laws spine present", re: /three laws|law 1|law 2/i },
  { label: "classify-first framing", re: /classify|red.*green.*refactor/i },
],
absent: { label: "no stale Phase-18 deferral marker", re: /Phase 18/i },  // net-new field
```
Note: `absent` is a NET-NEW field -- no existing analog in the checker (the current pattern is
`deferral`, which asserts a marker REMAINS; `absent` is its inverse). Add the loop branch that
evaluates it alongside the existing `deferral` branch (lines 228-231).

**Adaptation 2 -- add SKILL.md coverage (NET-NEW read; Pitfall 2).** Every FILES entry resolves under
`REFERENCES` (line 204, `path.join(REFERENCES, spec.name)`); the lz-red SKILL.md sits at the skill
ROOT (parent of `references/`) so nothing touches it today. Add it either as a FILES entry with an
optional per-entry `dir` override (default `REFERENCES`; SKILL.md sets `dir` = skill root) OR as a
separate SKILL.md block after the loop (mirrors the D-05 gate block idiom at lines 239-249). The
base-dir override is leaner (reuses topics + requireFence + scaffold + absent machinery). SKILL.md
tokens: classify-first, Three Laws / LAW spine, stance-routing + override, fail-for-the-right-reason
(`/right reason|AssertionError/`), forward `lz-tpp` handoff; `requireFence: true`; `absent: /Phase 18/i`.

**Adaptation 3 -- harden the ts-fence guard for VIT-02 (Pitfall 3).** `TS_FENCE_RE = /```(ts|typescript)\b/`
(line 185) MATCHES ` ```ts ignore ` (the `\b` sits before the space), so a no-coverage ignore fence
would falsely pass requireFence. For the SKILL.md entry, require a NON-ignore fence so VIT-02 gets
real tsc coverage.

**Adaptation 4 -- add a SEAM-02 guard reading `lz-tpp/SKILL.md`** (NET-NEW read, outside the lz-red
tree): assert both `/lz-red/` AND `/lz-refactor/` pointers present. Mirror the standalone-block idiom
of the D-05 honesty gate (lines 239-249) since it reads a path outside `REFERENCES`.

**Cosmetic honesty:** the header comment (lines 1-24) and SUMMARY strings (254, 258) say "Phase-17"
throughout -- update to Phase-18 as part of the honest extend-in-place. Keep the D-05 honesty gate
block (lines 234-249) + its `findBookCitedAsOwned` import byte-intact.

### `.claude/skills/lz-red-workspace/extract-samples.mjs` (tsc extractor) -- extend in place

**Analog (its own walk loop, line 101):** `for (const file of walkMd(REFERENCES))`. The README-skip
guard (lines 104-106) keys on basename `readme`. **Adaptation (Pitfall 2):** prepend the SKILL.md path
so its VIT-02 fence is tsc-covered:
```js
const SKILL_MD = path.join(repoRoot, "plugins", "lz-tdd", "skills", "lz-red", "SKILL.md");
for (const file of [SKILL_MD, ...walkMd(REFERENCES)]) { ... }
```
SKILL.md basename is "SKILL" (not "readme") so it passes the skip guard; its fence extracts as
`SKILL-1.ts`. GREEN-on-empty behavior (lines 146-151) is preserved for the Wave-0 RED baseline
(the checker, not the extractor, is the content-completeness signal).

## Shared Patterns

### SKILL.md = orchestration; references = content (the load-bearing split)
**Source:** `plugins/lz-tdd/skills/lz-refactor/SKILL.md` + `.../lz-tpp/SKILL.md` (both link file-level
and never restate leaf content: "do not restate it" / "do not restate the list here").
**Apply to:** the lz-red SKILL.md procedure (links to the 5 leaves + route table) and every reference
fill (owned/no-oracle CONTENT lives in the leaf; SKILL.md carries only the compact spine + routing).
D-04: the owned Three-Laws prose lands in the LEAF; SKILL.md carries the compact Law 1/2/3 steps.

### Mixed-provenance blockquote + inline tier tags
**Source:** `three-laws-and-test-selection.md:9-20` (head blockquote) + inline
"(Robert C. Martin, owned; oracle-verified)" / "(no-oracle)" tags on each distilled rationale.
**Apply to:** the three-laws fill (owned tier tag) and the principle-backing rows (Access-tier cell).
The fixed tier vocabulary strings are: `Owned; oracle-verified against the clean-room source.` and
`Unowned; high-confidence core only (no-oracle).` -- reproduce verbatim (checker + honesty gate key on
`/oracle-verified/i` and `/no-oracle/i`).

### Clean-room DST-04 authoring split
**Source:** CONTEXT D-12 + `three-laws-and-test-selection.md` head blockquote.
**Apply to:** ONLY the owned Three-Laws surface (Clean Code Ch. 9) is authored BLIND + orchestrator
oracle-reviewer gated (converge-to-clean, 3-round cap; gate-decides owned-vs-no-oracle per Law
statement). All other Phase-18 prose (SKILL.md procedure, routing/seam framing, lz-tpp pointer) is
authored blind as orchestration and passes only the deterministic no-verbatim scan. Main context NEVER
reads `.oracle/` prose.

### The `/Phase 18/i`-absent no-stale-marker guard (D-14 enforcement)
**Source:** net-new; closest is the inverted `deferral` guard in check-red-references.mjs.
**Apply to:** all 5 co-edited Markdown files (lz-red SKILL.md + 4 references). Content never
legitimately says "Phase 18" (a deferral artifact); it MAY say "LAW-01". So `/Phase 18/i`-absence is
the clean D-14 needle. `git grep "Phase 18" plugins/lz-tdd/skills/lz-red` must return ZERO hits after
the fills.

### ASCII-only
**Source:** CLAUDE.md + `check-hygiene.mjs` axis (a).
**Apply to:** every file. No em/en dashes (`--`), no arrows (`->`), no curly quotes, no ellipsis, no
box-drawing. lz-red SKILL.md + references + lz-tpp SKILL.md are all in the hygiene ASCII scan.

### THREE orchestrator gates -- NOT executor steps (Pitfall 4, critical for the planner)
**Source:** MEMORY `gsd-executor-cannot-spawn-subagents`; CONTEXT D-05/D-10/D-12.
gsd-executor tools are Read/Write/Edit/Bash/Grep/Glob/Skill only -- NO Agent/Task. Plan all three as
ORCHESTRATOR steps AFTER the executor returns its blind edits; never word a `<task>` "executor spawns
the oracle-reviewer / unbiased reviewer":
1. **oracle-reviewer** on the owned Three-Laws surface (D-05/D-12; gate-decides tier per Law statement).
2. **>=1 unbiased from-scratch review** of the shipped `lz-tpp/SKILL.md` edit (D-10, SC4).
3. **>=1 unbiased review / skill-reviewer** of the lz-red SKILL.md coach procedure (standing rule;
   17-06 precedent -- coach-don't-drive, override honored, no leaf content restated).
The executor authors blind and runs the DETERMINISTIC checkers only. `/reload-plugins` is a Phase-19
human ship action, NOT a Phase-18 task.

### Regression floor (co-edit, do not split) + D-05 honesty gate
**Source:** CONTEXT D-14; `check-red-references.mjs` (keeps all Phase-16/17 topics) +
`provenance-honesty.selftest.mjs`.
**Apply to:** fill ONLY the Phase-18 slice in each file; leave SEL/STR/ASRT/NAME/RTR-01/RTR-03/VIT/ANTI
content byte-stable. Keep the principle-backing table shape exact (the `ROW_RE` parser). Run the
provenance self-test (3/3) in the battery.

## No Analog Found

None. Every target has a strong in-repo analog. The two NET-NEW aspects are extensions of an existing
pattern, not new construction:

| Aspect | Nearest pattern | Note |
|--------|-----------------|------|
| SKILL.md coverage in the checker + extractor | the FILES-entry / walkMd loop patterns | The instrument reads `references/` only today; SKILL.md (skill root) is a net-new read, added via a `dir` override / prepended path -- reuses all existing machinery. |
| The `absent` (no-stale-marker) checker field | the `deferral` guard (its logical inverse) | New field + loop branch; structurally mirrors `deferral` evaluation. |
| The SEAM-02 lz-tpp-pointer guard | the standalone D-05 honesty-gate block | Reads a path outside the lz-red tree; mirror the post-loop standalone-block idiom. |

## Metadata

**Analog search scope:** `plugins/lz-tdd/skills/{lz-red,lz-refactor,lz-tpp}/` (SKILL.md + references),
`.claude/skills/lz-red-workspace/{tools,}/`, `.claude/skills/lz-refactor-workspace/tools/`.
**Files scanned:** 11 read in full (3 SKILL.md, 4 lz-red references, testing-stance README,
check-red-references.mjs, extract-samples.mjs) + 2 targeted `git grep` sweeps (Phase-18 marker
inventory across the 5 co-edited files; lz-tpp handling in check-hygiene.mjs).
**Pattern extraction date:** 2026-07-20
