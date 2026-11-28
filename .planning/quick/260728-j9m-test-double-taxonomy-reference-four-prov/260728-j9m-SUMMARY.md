---
phase: quick-260728-j9m
plan: 01
subsystem: lz-tdd skills (lz-red, lz-tpp, lz-refactor) + the lz-red workspace checker
tags: [taxonomy, provenance, doctrine, test-doubles, red-criterion, instrument-first]
requires:
  - the eleven pre-existing lz-red surfaces gated by check-red-references.mjs
provides:
  - test-double-taxonomy.md, byte-identical in all three lz-tdd skills
  - a per-cell authority rule for test-double and stand-in vocabulary
  - the coined term `signature skeleton` for the SUT-side transitional artifact
  - a four-tier red criterion, consistent across eight surfaces, with a characterization carve-out
  - corrected provenance for the seams rows, the criterion backing, and the green-bar discipline
affects:
  - any future lz-red/lz-tpp/lz-refactor coach answer that uses the word stub
  - the recorded divergence between shipped doctrine and the RED eval gate
tech-stack:
  added: []
  patterns:
    - instrument-first (D-13): extend the checker in place, assert RED, then author to GREEN
    - three byte-identical copies gated by sha256 rather than a shared dir or symlink
    - per-entry checker exemptions instead of weakening a shared phrase list
key-files:
  created:
    - plugins/lz-tdd/skills/lz-red/references/test-double-taxonomy.md
    - plugins/lz-tdd/skills/lz-tpp/references/test-double-taxonomy.md
    - plugins/lz-tdd/skills/lz-refactor/references/test-double-taxonomy.md
  modified:
    - .claude/skills/lz-red-workspace/tools/check-red-references.mjs
    - plugins/lz-tdd/skills/lz-red/SKILL.md
    - plugins/lz-tdd/skills/lz-tpp/SKILL.md
    - plugins/lz-tdd/skills/lz-refactor/SKILL.md
    - plugins/lz-tdd/skills/lz-red/references/principle-backing.md
    - plugins/lz-tdd/skills/lz-red/references/vitest-typescript-mechanics.md
    - plugins/lz-tdd/skills/lz-red/references/three-laws-and-test-selection.md
    - plugins/lz-tdd/skills/lz-red/references/test-structure-and-assertions.md
    - plugins/lz-tdd/skills/lz-red/references/anti-patterns.md
    - plugins/lz-tdd/skills/lz-red/references/naming.md
    - plugins/lz-tdd/skills/lz-red/references/testing-stance/seams-and-legacy.md
    - plugins/lz-tdd/skills/lz-red/references/testing-stance/functional-core.md
    - plugins/lz-tdd/skills/lz-red/references/testing-stance/message-matrix.md
    - plugins/lz-tdd/skills/lz-refactor/references/beck-tdd-by-example.md
decisions:
  - Authority stated PER CELL; Meszaros scoped to the collaborator-side term set only
  - Vintage warranted by the owned 1994 chronology, NOT by an RPC etymology (retracted mid-execution)
  - The Beck kanban-cycle backing row tagged no-oracle rather than guessing an owned Beck work
  - The anti-patterns later-phase guard needle narrowed so it actually gates a line-wrapped marker
  - The RED eval gate left byte-unchanged; the divergence documented instead
metrics:
  tasks: 4
  commits: 4
  completed: 2026-07-28
status: complete
---

# Quick Task 260728-j9m: Test-double taxonomy reference and four provenance fixes Summary

One change, seven deliverables: authored the cross-author test-double taxonomy as three
byte-identical copies, landed the owner-approved red-criterion doctrine change across eight
surfaces, and corrected four provenance defects -- all gated by new deterministic checks written
before the content.

## Tasks completed

| Task | Name | Commit | Key files |
| --- | --- | --- | --- |
| 1 | Extend the checker, assert the RED baseline (DEL-6) | `d4ca98f` | check-red-references.mjs |
| 2 | Author the taxonomy, three copies, three SKILL.md pointers (DEL-1..4) | `ef7d12f` | test-double-taxonomy.md x3, three SKILL.md |
| 3 | Land the red-criterion doctrine change (DEL-7a,b,c,d,f,g) | `c691def` | SKILL.md + 7 lz-red references |
| 4 | Correct provenance, retag the criterion (DEL-5, 7e, DEL-6) | `9ad48cd` | principle-backing, seams-and-legacy, vitest-mechanics, beck-tdd-by-example |

All four executed in the plan's order. Task 3 ran before task 4, as required, because the retag
depends on the criterion text task 3 settles.

## Gate results

Every gate was run as its own process with `$?` captured immediately. No gate verdict was taken from
piped log text.

| Command | Exit |
| --- | --- |
| `node .claude/skills/lz-red-workspace/tools/check-red-references.mjs` | **0** |
| `node .claude/skills/lz-red-workspace/tools/provenance-honesty.selftest.mjs` | **0** |
| `node .claude/skills/lz-refactor-workspace/tools/check-backing.mjs` | **0** |
| `node .claude/skills/lz-refactor-workspace/tools/check-crossrefs.mjs` | **0** |
| `node .claude/skills/lz-refactor-workspace/tools/check-hygiene.mjs` | **0** |
| `claude plugin validate .` | **0** |
| `node .claude/skills/lz-red-workspace/extract-samples.mjs` | **1** -- environment, see below |

Final summaries: RED-REFS GREEN 12/12 surfaces; provenance-honesty 3/3; PRIN-01/02/03 backing GREEN;
cross-refs GREEN 719 links, no self-refs; hygiene GREEN across ASCII + work-email (201 files) +
no-verbatim (193 files); plugin validation passed.

### Task 1 RED baseline (the instrument-first proof)

`check-red-references.mjs` exited **1** with **14 FAILs, every one carrying the `[j9m]` prefix** and
**zero** from the eleven pre-existing surfaces, the D-05 honesty gate or the SEAM-02 block. 101 PASSes
were untouched, so nothing pre-existing regressed and the whole RED baseline was the new work.

### extract-samples.mjs module count

**8 modules extracted, 0 fences skipped** -- before and after every edit. The lz-red tree holds
exactly 16 fence markers (8 fences), unchanged, which is the mechanical proof the taxonomy added no
fence and the example fixes added or dropped none.

### Three-copy byte identity

All three copies hash identically:

```
6deb707e7d24ba3ac1bf299528cb84736154c227743e16b0b8cb1c8d615c721b  lz-red/references/test-double-taxonomy.md
6deb707e7d24ba3ac1bf299528cb84736154c227743e16b0b8cb1c8d615c721b  lz-tpp/references/test-double-taxonomy.md
6deb707e7d24ba3ac1bf299528cb84736154c227743e16b0b8cb1c8d615c721b  lz-refactor/references/test-double-taxonomy.md
```

The checker's own gate reports `sha256 6deb707e7d24 in all three`. The copies were made with `cp`,
never re-typed. The document contains no fenced code block, no double quote at all, and no markdown
link containing a `/` -- all seven of its links are intra-file `#anchor` links, which is what lets the
three copies stay byte-identical across trees whose sibling files differ.

## Coordinator revisions applied

Three revision messages arrived mid-execution. All landed.

**Round 1 (five additions):** section renumbering to 2 authority / 3 headline / 4 table / 5 coined /
6 caveats / 7 Sources; the two new Meszaros-edge caveats (`Fragile Fixture` typed three ways across
Ch. 2, Ch. 16 and Appendix F; Appendix F omits `Test Hook` and Appendix G omits two of `Self Shunt`'s
aliases, replacing the shorter appendices line); the caveats block framed so it is explicit that each
Meszaros internal edge belongs there because it CHANGES A CITATION; the per-row-tier rule added as the
closing paragraph of Sources, closing the loophole where a reader infers a row's tier from the Sources
block; and the 7e retag framed as an inherited disagreement rather than a flat list.

**Round 2 (the RPC retraction):** no sentence asserting RPC descent was ever written -- the retraction
arrived before the document was authored, so removal was not needed. The vintage conclusion keeps its
warrant via the owned 1994 chronology instead. The document states explicitly that it does NOT assert
an etymology for the word `stub`, and that the book a reader would reach for to support one does not
support it.

**Vintage direction (the thing no regex can check):** stated in the required direction. The
production-side stand-in vocabulary is the SENIOR documented vocabulary (1994, credited to prior work
reaching back to 1963) and the test-double vocabulary is the 2007 newcomer on those words, so Beck's
production-side `stub` is the OLDER sense and explicitly not a deviation from a scheme that postdated
him. The document says so in as many words, and notes that lz-red's own step-2 mechanics rest on him.

**Round 3 (GoF):** added the GoF row set in the permanent production-side cell only (Proxy with alias
`Surrogate` and its four variants plus Coplien's `Ambassador`; Adapter with alias `Wrapper` and the
book's own after-the-fact versus before timing contrast; the Template Method hook as permanent;
Builder's empty build operations; `NullIterator`). Added the three new caveats (the half-true
do-nothing-object misattribution with Null Object left to Woolf/PLoPD3 and Bruce Anderson's
`active nothing`; GoF arguing AGAINST a masking default via Composite's rejected do-nothing `Add`;
`virtual proxy` as the nearest miss that still fails because the proxy graduates rather than being
replaced), plus the `stub`-absent-from-GoF warning naming the Template Method `skeleton` misread as
the specific trap. `placeholder` is recorded as contested from BOTH sides since 1994, with only
`Surrogate` formally registered -- which strengthened the rejection. The count moved eleven -> twelve
sources. `DebuggingGlyph` recorded as resemblance only. GoF tiered owned but production-side ancestor
only, with the structural reason for its testing-vocabulary absence.

## Deviations from plan

### [Rule 1 - Bug] The specified later-phase absent guard could never fire

- **Found during:** Task 1, while establishing the RED baseline.
- **Issue:** The plan specified `absent: /in a later phase/i` on `anti-patterns.md`. Absent guards are
  evaluated PER LINE, and the live stale marker wraps across two lines -- line 75 ends `... in a` and
  line 76 begins `later phase).`. The longer phrase therefore matches no single line, so the guard
  reported PASS while the stale text was fully present. As specified it gated nothing.
- **Fix:** Narrowed the needle to `/later phase/i`, which matches the wrapped tail and is the file's
  only occurrence. It then correctly FAILed at baseline and PASSes after task 3 removed the marker.
  The reason is recorded in a comment at the guard.
- **Files modified:** `.claude/skills/lz-red-workspace/tools/check-red-references.mjs`
- **Commit:** `d4ca98f`

### [Rule 2 - Missing critical functionality] New-surface auto-labels lacked the `[j9m]` prefix

- **Found during:** Task 1. The baseline showed one FAIL without the prefix:
  `[FAIL] test-double-taxonomy.md exists -- not found`. The task's done criterion requires every FAIL
  to carry `[j9m]`. Its hand-written topic labels carry the prefix, but the loop's auto-generated
  labels (exists / fence / scaffold) are built from `spec.name` and had none.
- **Fix:** Added an optional per-entry `labelPrefix`, applied only to auto-generated labels and set
  only on the new taxonomy entry. Unset on all eleven pre-existing entries, whose reported labels are
  byte-unchanged.
- **Commit:** `d4ca98f`

### [Rule 2 - Missing critical functionality] Corrected an understated provenance note

- **Found during:** Task 4, fix 4. Adding the owned Fowler failure-versus-error boundary to
  `vitest-typescript-mechanics.md` left that file's blockquote asserting there is no owned source to
  verify against, which had become false -- the same defect class as fix 1.
- **Fix:** Rewrote the note to per-claim tiers and added both the Fowler citation and the
  own-measurement entry to its Sources.
- **Commit:** `9ad48cd`

## Plan instructions that were wrong against the live tree

Reported as findings, not worked around silently.

1. **The later-phase guard regex could not match.** See the Rule 1 deviation above. The plan's
   `<!-- planner-discipline-allow -->` markers show the planner believed the phrase was present on one
   line; it is present, but wrapped.
2. **Task 2's verify regex contradicts its own done text.** The command filters FAILs through
   `rg 'taxonomy|byte-identical'` and expects none, but the plan simultaneously states the remaining
   `[j9m]` FAILs are the provenance gates, still RED by design -- and one of those is
   `principle-backing.md: [j9m] test-double taxonomy backing row`, which contains the word taxonomy.
   The regex therefore cannot be satisfied at the end of task 2 without doing task 4's work. I
   verified the substantive criterion instead: all 17 taxonomy topics PASS, its exists and scaffold
   gates PASS, and byte-identity PASSes; the only taxonomy-matching FAIL was the principle-backing
   row, which task 4 then closed.
3. **House rule 10 overstates the git-ignore situation.** It states that `git grep` returns zero
   matches under `.claude/skills/` because the tree is git-ignored. The checker itself is TRACKED and
   not ignored (`git check-ignore` exit 1, `git ls-files --error-unmatch` exit 0), so `git grep` would
   work on it. Harmless -- I used `rg` throughout as instructed.
4. **The Beck kanban-cycle owned surface was not established.** The plan said to cite it by the same
   owned Beck work name the existing owned Beck rows use, but `principle-backing.md` carries two
   different owned Beck works (Canon TDD and Test Desiderata), so "the same" is ambiguous. Per the
   plan's own explicit fallback -- tag no-oracle rather than guess, because a wrong owned tag is the
   defect being fixed -- that row is tagged **no-oracle**, with the reason stated in the tier cell.
   Flagging it as a judgment call: it may be upgradable to owned if a future oracle pass establishes
   which Beck surface carries the kanban cycle.

## Deferred issues

**`extract-samples.mjs` cannot exit 0 in this environment.** It exits **1**, but the failure is
entirely pre-existing and unrelated to this change: `node_modules` is absent from BOTH the worktree
and the main checkout, and the harness's own header documents that it needs a local `vitest` devDep
for type resolution. All 8 samples fail with the identical `TS2307 Cannot find module 'vitest'`,
including files this change never touched. There are **zero non-`TS2307` errors** before or after.

Package-manager installs are excluded from auto-fix, so I did not install anything. To still get a
real type signal on the fence I had to edit, I supplied the missing `vitest` types via an ambient
`.d.ts` written to the session scratchpad -- never into the repo -- and re-ran `tsc --strict` over the
extracted samples. **All 8 samples typecheck clean (exit 0), including the rewritten
`three-laws-and-test-selection` fence.** So the fence fix is genuinely `tsc --strict` clean and the
harness's exit 1 is purely the absent dependency. Installing dependencies in this environment is the
follow-up, and it is out of this task's scope.

## Out-of-scope files confirmed untouched

`git diff --name-status` against the base lists exactly the 17 files in `files_modified` and nothing
else. `git diff --quiet` confirms both `grade-red.mjs` (the RED eval gate) and
`lib/scaffold-phrases.mjs` are **byte-unchanged** -- the gate deliberately so, since a prior gate
change was falsified against the negative controls and altering it would invalidate 36 recorded eval
runs; the shared phrase list because the lz-refactor battery imports it, so the `placeholder`
exemption was scoped to a single checker entry instead. No files were deleted in any commit.

## Known stubs

None. No hardcoded empty values, no placeholder text, and no unwired components were introduced.

## Threat flags

None. No new network endpoint, auth path, file-access pattern, or schema at a trust boundary. The
change is Markdown content plus one workspace checker.

Threat register dispositions all hold: T-j9m-01 (hygiene work-email axis GREEN over 201 files, plus an
allowlist-inversion scan finding zero email-shaped tokens anywhere in the three skill trees or the
checker, and no forbidden value written as a needle); T-j9m-02 (D-05 honesty gate GREEN, the criterion
retagged rather than upgraded, the unconfirmed Beck row tagged down); T-j9m-03 (sha256 byte-identity
gate PASSes, copies made with `cp`); T-j9m-04 (the whole sweep encoded mechanically, all three absent
guards PASS); T-j9m-05 (eval gate byte-unchanged, divergence documented in the shipped reference);
T-j9m-06 (accepted; no verbatim prose, zero double quotes in the new document, no-verbatim axis GREEN).

## Self-Check: PASSED

Created files, all three present:

- `plugins/lz-tdd/skills/lz-red/references/test-double-taxonomy.md` -- FOUND
- `plugins/lz-tdd/skills/lz-tpp/references/test-double-taxonomy.md` -- FOUND
- `plugins/lz-tdd/skills/lz-refactor/references/test-double-taxonomy.md` -- FOUND

Commits, all four in `git log 418d554..HEAD`:

- `d4ca98f` -- FOUND
- `ef7d12f` -- FOUND
- `c691def` -- FOUND
- `9ad48cd` -- FOUND

Working tree clean. Six of seven gates exit 0; the seventh is the documented pre-existing environment
gap above, with the underlying typecheck proven clean by a scratchpad shim.
