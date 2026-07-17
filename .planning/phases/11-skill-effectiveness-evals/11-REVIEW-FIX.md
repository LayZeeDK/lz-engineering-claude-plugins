---
phase: 11-skill-effectiveness-evals
fixed_at: 2026-07-11T11:05:54Z
review_path: .planning/phases/11-skill-effectiveness-evals/11-REVIEW.md
iteration: 1
findings_in_scope: 4
fixed: 4
skipped: 0
status: all_fixed
---

# Phase 11: Code Review Fix Report

**Fixed at:** 2026-07-11T11:05:54Z
**Source review:** .planning/phases/11-skill-effectiveness-evals/11-REVIEW.md
**Iteration:** 1

**Summary:**
- Findings in scope: 4 (CR-01, WR-01, WR-02, WR-03 -- critical_warning scope; Info IN-01/IN-02 excluded)
- Fixed: 4
- Skipped: 0

**Note on this run:** All four in-scope findings were already applied and committed
on this branch (`gsd/lz-tdd-0.0.2-lz-refactor`) by a prior fixer pass -- each has its
own atomic `fix(11): {id}` commit and the working tree is clean, so the current source
matches the review-recommended code exactly (this is the idempotent re-run case). No new
edits or commits were made this run. Each fix was RE-VERIFIED against the live source:
CR-01 via the grader `--selfcheck` gate, and WR-01/02/03 via `node --check` plus direct
source inspection. Commit hashes below reference the existing atomic fix commits.

**Verification commands run this iteration:**

```
$ node .claude/skills/lz-refactor-workspace/grade-run.mjs --selfcheck
SELFCHECK OK
EXIT=0
```

```
$ node --check .claude/skills/lz-refactor-workspace/run-recall-chunks.mjs
run-recall-chunks.mjs: SYNTAX OK
$ node --check .claude/skills/lz-refactor-workspace/grade-run.mjs
grade-run.mjs: SYNTAX OK
```

```
$ git diff --stat HEAD -- grade-run.mjs run-recall-chunks.mjs
(empty -- both files match HEAD)
```

## Fixed Issues

### CR-01: name->layer lookup misclassifies a Fowler refactoring as `functional` (false PASS on the eval-7 layer check)

**Files modified:** `.claude/skills/lz-refactor-workspace/grade-run.mjs`
**Commit:** 2f734f6 (`fix(11): CR-01 resolve layers by longest-match so a shorter name cannot sub-phrase-match a longer one`)
**Applied fix:** `layersInResponse()` (grade-run.mjs:172-191) now uses the review's Option A
shadowing rule -- a matched canonical name is credited ONLY if no longer matched name
contains it (`other.length > name.length && nameRe(name).test(other)`), so the functional
leaf "Factory Function" no longer leaks its layer into the Fowler name "Replace Constructor
with Factory Function" (and the same-layer "Unify Interfaces" / "Unify Interfaces with
Adapter" sub-phrase is cleaned up too). The review's recommended `--selfcheck` assertion is
present at grade-run.mjs:503-508: for every `[name, own]` in `NAME_LAYERS` it asserts
`layersInResponse(name)` equals exactly that name's declared layer set.
**Verification:** `node grade-run.mjs --selfcheck` -> `SELFCHECK OK` (exit 0). The new
resolve-identity gate passes, so CR-01 is confirmed closed and nothing regressed.

### WR-01: recall canary constant drifts from the trigger-eval positive it stands in for

**Files modified:** `.claude/skills/lz-refactor-workspace/run-recall-chunks.mjs`
**Commit:** 22dc88e (`fix(11): WR-01 derive recall canary from the eval set so it is the real positive #6`)
**Applied fix:** The hand-typed canary twin is gone. `run-recall-chunks.mjs:29-34` defines a
single `CANARY_PREFIX = "what does Extract Function actually do"` and derives
`CANARY = all.find((q) => q.should_trigger && q.query.startsWith(CANARY_PREFIX))` directly
from the eval set, throwing `"canary positive missing from trigger-eval.json"` if it is
absent. The exclude-filter (line 38) and every result-side canary lookup now key off the
same `CANARY_PREFIX`, so the excluded positive and the appended canary are byte-for-byte the
same eval-set query and can no longer drift.
**Verification:** `node --check run-recall-chunks.mjs` -> SYNTAX OK; source inspection
confirms the derive-and-throw pattern and the single-source `CANARY_PREFIX`.

### WR-02: chunk-set write outside try/catch and CHUNK_DIR never created -> uncaught ENOENT

**Files modified:** `.claude/skills/lz-refactor-workspace/run-recall-chunks.mjs`
**Commit:** 6a1c6b4 (`fix(11): WR-02 mkdir chunk dir up front and move chunk-set write inside try/catch`)
**Applied fix:** `fs.mkdirSync(CHUNK_DIR, { recursive: true })` runs up front at
run-recall-chunks.mjs:21 (right after `CHUNK_DIR` is defined at line 15), and the
`recall-chunk-*.json` write is now inside the per-chunk `try` block (line 103), so a fresh
checkout without `evals/d07-chunks` no longer crashes with an uncaught ENOENT -- the write is
covered by the graceful "will resume next invocation" catch.
**Verification:** `node --check run-recall-chunks.mjs` -> SYNTAX OK; source inspection
confirms the up-front mkdir and the write relocated inside `try`.

### WR-03: `assess()` and the report loop dereference `r.results` unguarded

**Files modified:** `.claude/skills/lz-refactor-workspace/run-recall-chunks.mjs`
**Commit:** 124c27d (`fix(11): WR-03 guard assess and report loop against result files missing a results array`)
**Applied fix:** Inside `assess()` the parse `try/catch` is followed by
`if (!r || !Array.isArray(r.results)) return { valid: false, reason: "no results array" };`
(run-recall-chunks.mjs:65-67), and the canary report loop applies the same guard before its
dereference at lines 164-166 (`if (!r || !Array.isArray(r.results)) { continue; }`). A
valid-JSON-but-wrong-shape result file (e.g. an error object or partial `{}`) is now treated
as invalid instead of throwing an uncaught TypeError that would kill the resumable run.
**Verification:** `node --check run-recall-chunks.mjs` -> SYNTAX OK; source inspection
confirms both guards are inside their respective try / before their dereference.

---

_Fixed: 2026-07-11T11:05:54Z_
_Fixer: Claude (gsd-code-fixer)_
_Iteration: 1_
