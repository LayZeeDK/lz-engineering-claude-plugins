---
phase: 09-coach-behavior-principle-backing
plan: 01
subsystem: testing
tags: [checker-harness, node-mjs, instrument-first, nyquist, fence-aware-parsing, principle-backing]

# Dependency graph
requires:
  - phase: 08.2-functional-catalog-inserted
    provides: functional-catalog + the four catalog checkers (check-gof/kerievsky/extra/functional) carrying the identical fence-blind H1 scan (IN-02 debt)
  - phase: 07-fowler-catalog
    provides: check-principles.mjs (line-oriented topic-token template) + check-crossrefs.mjs source-set idiom
provides:
  - "tools/lib/heading-scan.mjs: shared fence-aware collectH1Lines(text) serving all four catalog checkers (IN-02 retired, D-10)"
  - "tools/check-backing.mjs: PRIN-01/02/03 structural gate, RED baseline by design (D-09)"
  - "check-crossrefs.mjs source set extended with SKILL.md + principles.md + the 3 backing refs (coach/Beck links now resolution-gated)"
  - "package.json check battery carries check-backing.mjs"
affects: [09-02, 09-coach-authoring, principle-backing, PRIN-01, PRIN-02, PRIN-03, CCH-01, CCH-05]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Shared-helper-once for cross-checker gaps: one lib/ module imported by all consumers, never a per-checker patch (D-10)"
    - "Instrument-first RED->GREEN: stand up the structural gate to an asserted RED baseline before any content is authored (Nyquist scaffold)"
    - "Link resolution is check-crossrefs's job: check-backing asserts PRESENCE/format only, no second resolver"

key-files:
  created:
    - .claude/skills/lz-refactor-workspace/tools/lib/heading-scan.mjs
    - .claude/skills/lz-refactor-workspace/tools/check-backing.mjs
  modified:
    - .claude/skills/lz-refactor-workspace/tools/check-gof.mjs
    - .claude/skills/lz-refactor-workspace/tools/check-kerievsky.mjs
    - .claude/skills/lz-refactor-workspace/tools/check-extra-patterns.mjs
    - .claude/skills/lz-refactor-workspace/tools/check-functional.mjs
    - .claude/skills/lz-refactor-workspace/tools/check-crossrefs.mjs
    - .claude/skills/lz-refactor-workspace/package.json

key-decisions:
  - "D-10: IN-02 folded once as tools/lib/heading-scan.mjs imported by all four catalog checkers; per-checker patch forbidden; behavior-preserving (still-GREEN battery is the proof)"
  - "D-09: check-backing.mjs is a NEW sibling (not an overload of the FWL-03-specific check-principles.mjs); RED baseline before content; wired into npm run check"
  - "Deleted the orphaned split-lines const in check-functional too (not just the other three): the plan's premise that check-functional referenced lines elsewhere was inaccurate -- empirically the H1 scan was its only consumer"

patterns-established:
  - "Fence-aware level-1 heading collection (collectH1Lines): CommonMark-ish fence tracker, single source of truth across the four catalog checkers"
  - "check-backing topic-token gate: line-oriented lines.some() presence + no-oracle tag + SCAFFOLD guard + fowler-catalog link presence for beck-tidy-first"

requirements-completed: []  # PRIN-01/02/03 remain OPEN by design -- this is the instrument-first RED gate; they close only when Wave 2 authors content and turns check-backing GREEN.

# Metrics
duration: ~18min
completed: 2026-07-08
---

# Phase 9 Plan 01: Instrument-First Harness (IN-02 retirement + PRIN gate) Summary

**Retired the carried-in IN-02 fence-blind-heading debt into one shared collectH1Lines helper (battery stays GREEN), and stood up check-backing.mjs to an asserted RED baseline wired into the npm run check battery, with check-crossrefs now sourcing SKILL.md + principles.md + the 3 backing refs.**

## Performance

- **Duration:** ~18 min
- **Started:** 2026-07-08T18:57Z
- **Completed:** 2026-07-08T19:14:51Z
- **Tasks:** 2
- **Files modified:** 8 (2 created, 6 modified)

## Accomplishments

- IN-02 (D-10) retired: `tools/lib/heading-scan.mjs` exports a fence-aware `collectH1Lines(text)`; all four catalog checkers (check-gof, check-kerievsky, check-extra-patterns, check-functional) now route their leaf-H1 scan through it in place of the identical fence-blind `lines.filter(/^#\s+\S/)`. Behavior-preserving: all 9 pre-existing checkers still exit 0 individually (no leaf carries a fenced column-0 hash, so counts are identical).
- `check-backing.mjs` (D-09) added as a NEW sibling of `check-principles.mjs`: line-oriented topic-token presence for the 3 backing refs + the `no-oracle` tag + a SCAFFOLD guard + a fowler-catalog link presence check for `beck-tidy-first.md`. Driven to an asserted RED baseline (exit 1) and wired into the `npm run check` battery.
- `check-crossrefs.mjs` source set extended (existsSync-guarded) with SKILL.md, principles.md, and the 3 backing refs, so the coming coach cross-links and Beck->Fowler links get resolution-checked. Still GREEN (695 links resolve, 0 unresolved).
- Phase-open baseline established and asserted: **check-backing is the sole RED; every other checker is GREEN; typecheck GREEN (251 modules).**

## Task Commits

Each task was committed atomically:

1. **Task 1: Shared fence-aware heading helper + rewire the four catalog checkers (IN-02 / D-10)** - `723fa6c` (refactor)
2. **Task 2: check-backing.mjs RED gate + check-crossrefs source extension + package.json wiring (D-09)** - `7c61136` (feat)

_No TDD split; this is a harness-authoring plan._

## Files Created/Modified

- `.claude/skills/lz-refactor-workspace/tools/lib/heading-scan.mjs` - NEW. Fence-aware `collectH1Lines(text)`; single source of truth for level-1 heading detection across the four catalog checkers.
- `.claude/skills/lz-refactor-workspace/tools/check-backing.mjs` - NEW. PRIN-01/02/03 structural gate; RED baseline by design; no second link resolver.
- `.claude/skills/lz-refactor-workspace/tools/check-gof.mjs` - Import + call `collectH1Lines`; dropped orphaned `const lines`.
- `.claude/skills/lz-refactor-workspace/tools/check-kerievsky.mjs` - Second `./lib/` import + call `collectH1Lines`; dropped orphaned `const lines`.
- `.claude/skills/lz-refactor-workspace/tools/check-extra-patterns.mjs` - Import + call `collectH1Lines`; dropped orphaned `const lines`.
- `.claude/skills/lz-refactor-workspace/tools/check-functional.mjs` - Second `./lib/` import + call `collectH1Lines`; replaced the stale carried-in-debt ponytail note with a one-line note; dropped orphaned `const lines`.
- `.claude/skills/lz-refactor-workspace/tools/check-crossrefs.mjs` - Added SKILL.md/principles.md/3-backing path consts + a guarded push loop onto `sourceFiles`.
- `.claude/skills/lz-refactor-workspace/package.json` - Appended `&& node tools/check-backing.mjs` to `scripts.check`; `typecheck` unchanged.

## Decisions Made

- **D-10 (IN-02):** Folded once into a shared `heading-scan.mjs` helper, never per-checker. The still-GREEN battery is the proof the swap is behavior-preserving.
- **D-09:** `check-backing.mjs` is a new sibling, not an overload of the FWL-03-specific `check-principles.mjs` (which hardcodes a single Fowler-topic set + one path). Matches the check-gof/check-extra/check-functional sibling pattern.
- **PRIN-01/02/03 left OPEN:** this plan deliberately establishes the RED gate; the requirements close only when Wave 2 authors the content and turns check-backing GREEN. `requirements-completed` is intentionally empty (mirrors the FWL-01..04 Phase-7 Wave-1 handling).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Deleted the orphaned `const lines` in check-functional too (plan premise was inaccurate)**
- **Found during:** Task 1 (rewiring the four catalog checkers)
- **Issue:** The plan action, its acceptance criteria, and the executor critical reminders all instructed to KEEP `const lines = text.split(...)` in check-functional "because other checks still reference `lines`." Empirical `rg -n '\blines\b'` on check-functional.mjs showed the `lines` variable is declared at line 191 and consumed ONLY at the H1-scan (line 198); the other "lines" matches (lines 37, 446) are the word inside comments, and `contentLines`/`readmeLines` are distinct variables. After the swap to `collectH1Lines(text)`, keeping `const lines` would leave a dead, unused declaration -- exactly the Phase-10-review hygiene ding the plan's dominant "No dead const may remain / dead-code-free refactor" criterion forbids.
- **Fix:** Applied the rule's own operative condition ("DELETE where the removed H1-scan line was the ONLY consumer") to check-functional as well; removed the orphaned `const lines` in all four checkers.
- **Files modified:** .claude/skills/lz-refactor-workspace/tools/check-functional.mjs
- **Verification:** `rg -n 'const lines = text.split'` returns none across all four checkers; all 9 checkers exit 0 individually; full battery GREEN except the intended check-backing RED.
- **Committed in:** `723fa6c` (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 bug/dead-code)
**Impact on plan:** The deviation makes the refactor genuinely dead-code-free, honoring the plan's stated intent over an inaccurate parenthetical. No scope creep; behavior-preserving (battery unchanged).

## Issues Encountered

- Transient "claude-opus-4-8 temporarily unavailable" on one Edit call (the check-crossrefs const insertion); retried immediately and it succeeded. No impact on output.

## User Setup Required

None - no external service configuration required. This is a non-shipped node-builtin harness change; zero packages added.

## Next Phase Readiness

- **Wave 2 (coach + content authoring) is unblocked:** check-backing.mjs gives the authoring plans a machine-checkable RED->GREEN target. Authoring `beck-tdd-by-example.md` + `beck-tidy-first.md` and populating `refactoring-without-tests.md` (removing the `## Sources (placeholder)` marker) turns check-backing GREEN and closes PRIN-01/02/03.
- **check-crossrefs already sources SKILL.md + the backing refs**, so once the coach procedure lands inline and the Beck->Fowler links are authored, they are resolution-gated automatically.
- **No blockers.** The check-crossrefs `slugsFor`/`linkRe` fence gap remains adjacent-and-dormant (out of D-10 scope by design); D-11 authoring discipline (TS/fence-free principle refs) keeps it dormant.

## Self-Check: PASSED

- FOUND: .claude/skills/lz-refactor-workspace/tools/lib/heading-scan.mjs
- FOUND: .claude/skills/lz-refactor-workspace/tools/check-backing.mjs
- FOUND commit: 723fa6c (Task 1)
- FOUND commit: 7c61136 (Task 2)

---
*Phase: 09-coach-behavior-principle-backing*
*Completed: 2026-07-08*
