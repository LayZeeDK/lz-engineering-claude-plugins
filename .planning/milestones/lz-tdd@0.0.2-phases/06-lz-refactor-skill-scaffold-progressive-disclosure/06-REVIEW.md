---
phase: 06-lz-refactor-skill-scaffold-progressive-disclosure
reviewed: 2026-07-04T17:19:20Z
depth: deep
files_reviewed: 7
files_reviewed_list:
  - plugins/lz-tdd/skills/lz-refactor/SKILL.md
  - plugins/lz-tdd/skills/lz-refactor/references/fowler-catalog/README.md
  - plugins/lz-tdd/skills/lz-refactor/references/kerievsky-catalog/README.md
  - plugins/lz-tdd/skills/lz-refactor/references/smells.md
  - plugins/lz-tdd/skills/lz-refactor/references/principles.md
  - plugins/lz-tdd/skills/lz-refactor/references/refactoring-without-tests.md
  - .claude/skills/lz-refactor-workspace/tools/verify-scaffold.mjs
findings:
  critical: 0
  warning: 2
  info: 3
  total: 5
status: issues_found
---

# Phase 6: Code Review Report

**Reviewed:** 2026-07-04T17:19:20Z
**Depth:** deep
**Files Reviewed:** 7
**Status:** issues_found

## Summary

Scope is a scaffold phase: one dual-mode router `SKILL.md`, five content-contract
STUB reference files (correctly left unpopulated for Phases 7-9), and one Node ESM
Wave-0 verification checker (`verify-scaffold.mjs`). I ran the checker (EXIT=0, all
11 assertions green) and independently byte-scanned the sources.

Findings that survive scrutiny:

- The six Markdown files are ASCII-clean (verified by byte scan), contain no verbatim
  book prose (DST-04 respected -- they only describe the per-entry content contracts),
  and all five `](references/...)` pointers in SKILL.md resolve to files that exist on
  disk. Frontmatter is well-formed: `name: lz-refactor`, dual-mode by omission of
  `disable-model-invocation` / `user-invocable`, no stray `version`. No issues in the
  Markdown; the stub state is the intended, correct state for this phase.
- `verify-scaffold.mjs` is ASCII-clean and its assertions test real conditions -- no
  security issue, no crash, no data-loss path, and it correctly greenlights the current
  (correct) scaffold. However, deep review of the checker surfaced one boundary
  off-by-one and one verification-completeness gap (both WARNING, both latent at the
  current scale), plus three minor robustness/documentation nits (INFO).

No BLOCKERs: nothing here ships broken, and the verifier does not false-pass the
scaffold as it stands. The WARNINGs are latent defects in the throwaway checker that
would only bite under specific future edits.

## Warnings

### WR-01: Line-count assertion off-by-one (trailing-newline counts as a line)

**File:** `.claude/skills/lz-refactor-workspace/tools/verify-scaffold.mjs:169-170`
**Issue:** `lineCount = skillText.split(/\r?\n/).length` counts the trailing empty
segment produced by the file's terminating newline. I confirmed SKILL.md is 69 content
lines but `split(/\r?\n/).length` returns 70 (last segment is `""`), and the checker
prints "70 lines". Because the assertion is `lineCount < 500`, the effective content
cap is 498 lines, not the "< 500" the label claims -- a genuine off-by-one in a
boundary check. Impact is currently nil (69 vs 500, a 431-line margin), so this is
latent, but it is a real defect in the assertion's semantics and would misreport by one
near the boundary.
**Fix:**
```js
const lineCount = skillText.replace(/\r?\n$/, "").split(/\r?\n/).length;
report(lineCount < LINE_CAP, "SC2 SKILL.md line count < 500", `${lineCount} lines`);
```

### WR-02: "exactly 5 references" verifies cardinality, not identity (rewire false-pass)

**File:** `.claude/skills/lz-refactor-workspace/tools/verify-scaffold.mjs:172-199`
**Issue:** Check 5 counts distinct pointer *strings* (`pointers` Set) and Check 6
confirms each *resolves*, but neither asserts the pointers are the FIVE EXPECTED
reference files. Consequences: (a) a pointer typo'd to a different-but-existing file
(for example both catalog READMEs, or any other real `references/*.md`) still passes
as long as five distinct strings resolve; (b) two path-variant strings that normalize
to the same file (for example `references/smells.md` and `references/./smells.md`)
count as 2 distinct pointers but are 1 file, so five distinct strings could resolve to
fewer than five actual files and still pass. The check therefore cannot detect a
scaffold that points at the wrong set of references. For a Wave-0 gate this is a
verification-completeness gap.
**Fix:** Assert the resolved pointer set equals the expected set rather than just its
size:
```js
const EXPECTED = new Set([
  "references/fowler-catalog/README.md",
  "references/kerievsky-catalog/README.md",
  "references/smells.md",
  "references/principles.md",
  "references/refactoring-without-tests.md",
]);
const same =
  pointers.size === EXPECTED.size &&
  [...EXPECTED].every((p) => pointers.has(p));
report(same, "SC2 references/ pointers match the expected 5", same ? "" : `got: ${[...pointers].join(", ")}`);
```

## Info

### IN-01: Two checks pass vacuously on empty input

**File:** `.claude/skills/lz-refactor-workspace/tools/verify-scaffold.mjs:164-166, 184-199`
**Issue:** Check 3 (`descLen <= DESC_CAP`) evaluates `0 <= 1536` and PASSES when the
description is absent/unparsed (descLen defaults to 0). Check 6 (pointer resolution)
PASSES when `pointerList` is empty because the `for` loop never runs and `unresolved`
stays `[]`. Both are currently masked by sibling checks (Check 2's `descPresent`,
Check 5's `=== 5`), so the aggregate exit code stays correct -- but the individual
`[PASS]` lines are misleading if a parse regresses. Robustness/clarity, not a live bug.
**Fix:** Gate each on its precondition, for example `report(descPresent && descLen <= DESC_CAP, ...)`
and skip/failing Check 6 when `pointerList.length === 0`.

### IN-02: Header comment undercounts assertions ("nine" vs 11 emitted)

**File:** `.claude/skills/lz-refactor-workspace/tools/verify-scaffold.mjs:2-3`
**Issue:** The banner says "nine filesystem/frontmatter assertions", but the script
emits 11 `report()` lines (9 numbered Checks, with Check 2 emitting three separate
reports). The run output confirms 11 PASS lines. Minor doc drift.
**Fix:** Change "nine" to "eleven", or say "nine checks (11 assertions)".

### IN-03: Misleading line-count hint "(target ~90-150)"

**File:** `.claude/skills/lz-refactor-workspace/tools/verify-scaffold.mjs:170`
**Issue:** The detail string advertises a target of ~90-150 lines while the shipped
SKILL.md is 69 content lines by design (thin router, coach procedure deferred to Phase
9). A reader scanning the output could read 70 as under-target when the file is
correct. The companion description hint "(target ~750)" is fine (774 actual). Cosmetic.
**Fix:** Drop or correct the "~90-150" hint to reflect the intended thin-router size,
or remove the target hints entirely from the detail strings.

---

_Reviewed: 2026-07-04T17:19:20Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: deep_
