---
phase: 15-lz-red-skill-scaffold-description-boundary
plan: 01
subsystem: testing
tags: [claude-code-plugin, agent-skill, tdd, red-phase, progressive-disclosure, skill-description, lz-red]

# Dependency graph
requires:
  - phase: "0.0.2 / Phase 6 (lz-refactor scaffold)"
    provides: "dual-mode-by-omission router pattern, thin stub content-contract convention, reciprocal exclusion-clause description template, navigation-index-only subdir convention"
provides:
  - "Invocable /lz-tdd:lz-red skill registered via skills/ auto-discovery (no manifest edit)"
  - "v1 three-way-guarded triggering description: RED positive trigger first + lz-tpp and lz-refactor reciprocal exclusions in the tail (folded 1091 chars, language-agnostic)"
  - "10-file progressive-disclosure references/ stub tree, each stub a per-doc content contract naming its requirement IDs, source cluster, and fill phase(s)"
  - "Unambiguous fill targets for Phases 16-18 (every SKILL.md link resolves from day one)"
affects: [16-oracle-and-red-references, 17-red-references-content, 18-red-coach-procedure-and-seams, 19-distribution-version-bump, 20-cross-skill-trigger-eval]

# Tech tracking
tech-stack:
  added: []
  patterns: [dual-mode-by-omission frontmatter, progressive-disclosure stub tree, navigation-index-only subdir, three-way reciprocal description guard, thin content-contract stubs with fill-phase markers]

key-files:
  created:
    - plugins/lz-tdd/skills/lz-red/SKILL.md
    - plugins/lz-tdd/skills/lz-red/references/three-laws-and-test-selection.md
    - plugins/lz-tdd/skills/lz-red/references/test-structure-and-assertions.md
    - plugins/lz-tdd/skills/lz-red/references/naming.md
    - plugins/lz-tdd/skills/lz-red/references/anti-patterns.md
    - plugins/lz-tdd/skills/lz-red/references/vitest-typescript-mechanics.md
    - plugins/lz-tdd/skills/lz-red/references/principle-backing.md
    - plugins/lz-tdd/skills/lz-red/references/testing-stance/README.md
    - plugins/lz-tdd/skills/lz-red/references/testing-stance/functional-core.md
    - plugins/lz-tdd/skills/lz-red/references/testing-stance/message-matrix.md
    - plugins/lz-tdd/skills/lz-red/references/testing-stance/seams-and-legacy.md
  modified: []

key-decisions:
  - "Shipped SKILL.md at 80 lines (near lz-tpp's 81), NOT padded to the ~90-120 estimate, because the coach procedure is a labeled Phase-18 placeholder (D-04 + RESEARCH: the router sits at the low end this phase, do not pad)"
  - "Used the plan's exact v1 description verbatim; measured folded length 1091 chars (RESEARCH estimated ~1083), under the 1536 cap; no empirical tuning (D-08 -> Phase 20)"
  - "Applied owned/no-oracle access-tier tags per stub only where the milestone constraints already establish them (RCM/Metz owned; Beck/Feathers no-oracle); ambiguous tiers deferred to the Phase-16 oracle checkpoint"

patterns-established:
  - "Three-way reciprocal description guard: positive RED trigger first, then one exclusion clause per sibling skill (make a failing test pass -> lz-tpp; restructure passing code -> lz-refactor) in the tail"

requirements-completed: [SKL-01, SKL-02, SKL-03]

coverage:
  - id: D1
    description: "/lz-tdd:lz-red is invocable -- SKILL.md exists with dual-mode-by-omission frontmatter (name==lz-red + description only) and claude plugin validate . exits 0"
    requirement: "SKL-01"
    verification:
      - kind: automated
        ref: "claude plugin validate . (exit 0)"
        status: pass
      - kind: other
        ref: "frontmatter top-level keys == [name, description]; name: lz-red equals the directory"
        status: pass
    human_judgment: false
  - id: D2
    description: "SKILL.md is a lean router (80 lines, < 500) using progressive disclosure; all 10 reference stubs exist with content-contract markers and every stub resolves from a SKILL.md link"
    requirement: "SKL-02"
    verification:
      - kind: other
        ref: "wc -l SKILL.md=80 (<500); test -f x10 stubs; git grep -F each references/<path> in SKILL.md (10/10 linked+resolve); git grep -l 'Populated in Phase' = 10/10"
        status: pass
    human_judgment: false
  - id: D3
    description: "v1 three-way-guarded description present -- folded 1091 chars (<=1536), positive trigger precedes both exclusions, and both sibling exclusions (lz-tpp, lz-refactor) are named; empirical trigger firing is deferred to Phase 20 (EVL-01) by design"
    requirement: "SKL-03"
    verification:
      - kind: other
        ref: "folded desc len=1091<=1536; byte-offset positive-trigger < first 'Do NOT use it'; git grep -F 'use lz-tpp' and 'use lz-refactor' both hit SKILL.md"
        status: pass
    human_judgment: false

# Metrics
duration: 8min
completed: 2026-07-18
status: complete
---

# Phase 15 Plan 01: lz-red Skill Scaffold and Description Boundary Summary

**Invocable dual-mode lz-red RED-phase TDD skill: an 80-line SKILL.md router carrying a v1 three-way-guarded triggering description (RED trigger first, lz-tpp + lz-refactor exclusions) plus a 10-file progressive-disclosure reference stub tree, all under claude plugin validate . exit 0.**

## Performance

- **Duration:** ~8 min
- **Started:** 2026-07-18T03:31:05+02:00 (first task commit)
- **Completed:** 2026-07-18T03:35:42+02:00 (last task commit)
- **Tasks:** 3
- **Files modified:** 11 (all new, all under plugins/lz-tdd/skills/lz-red/)

## Accomplishments
- Registered `/lz-tdd:lz-red` via a dual-mode-by-omission SKILL.md (name + description only; omitting version / disable-model-invocation / user-invocable / allowed-tools makes the skill both auto-trigger as a coach and answer explicit invocation as a reference) -- validated with `claude plugin validate .` exit 0, no manifest edit needed (skills auto-discovered).
- Shipped the reasoned v1 three-way-guarded description: the RED positive trigger leads, both reciprocal near-miss exclusions (make a failing test pass -> lz-tpp; restructure passing code -> lz-refactor) sit in the tail, language-agnostic, folded 1091 chars (under the 1536 cap with ~445 chars of headroom for Phase-20 tuning).
- Stood up the 10-file progressive-disclosure `references/` tree (6 flat single-topic docs + one `testing-stance/` navigation subdir with an index and 3 leaves), each stub a thin content contract naming its requirement IDs, source cluster, scoped sub-topics, and `Populated in Phase NN` fill marker -- giving Phases 16-18 unambiguous fill targets with every SKILL.md link resolving from day one.

## Task Commits

Each task was committed atomically:

1. **Task 1: 5 flat core test-shaping reference stubs** - `a7c037d` (docs)
2. **Task 2: testing-stance navigation subdir (index + 3 leaves) + anti-patterns stub** - `f2f3965` (docs)
3. **Task 3: SKILL.md router + v1 three-way-guarded description** - `1e75b0e` (feat)

## Files Created/Modified
- `plugins/lz-tdd/skills/lz-red/SKILL.md` - dual-mode-by-omission router (80 lines): two modes, three-way seam intro, listen-to-the-tests caveat, labeled Phase-18 coach placeholder, and a Reference-material pointer linking all 10 stubs.
- `references/three-laws-and-test-selection.md` - stub: Three Laws spine + next-failing-test selection (SEL-01/02, LAW-01/02, SEAM-01; RCM, Beck; Phases 16+18).
- `references/test-structure-and-assertions.md` - stub: AAA/GWT structure + observable-behavior assertions (STR-01/02, ASRT-01/02; Wake, North, Beck, Khorikov; Phases 16+17).
- `references/naming.md` - stub: behavior/"should" naming + Osherove three-part alternative (NAME-01; North, Osherove, Metz; Phase 16).
- `references/anti-patterns.md` - stub: over-mock/impl-detail anti-patterns + listen-to-the-tests meta-rule (ANTI-01/02, RTR-03; Cooper, Khorikov, Metz, GOOS, Beck; Phase 17).
- `references/vitest-typescript-mechanics.md` - stub: demo-stack red-step mechanics (VIT-01/02; Vitest 4.x, fast-check; Phase 17).
- `references/principle-backing.md` - stub: cross-cutting source-to-recommendation + access-tier map (supports DST-03; all sources; Phases 16-17).
- `references/testing-stance/README.md` - navigation-only index stub: detection signals + route table to the 3 leaves (RTR-02; Phases 17+18).
- `references/testing-stance/functional-core.md` - leaf stub: Bernhardt FCIS value-based stance (RTR-01, ASRT-02; Phase 17).
- `references/testing-stance/message-matrix.md` - leaf stub: Metz+Owen query/command matrix (RTR-01, ASRT-03; Phase 17).
- `references/testing-stance/seams-and-legacy.md` - leaf stub: Feathers seams + characterization; notes a future cross-link to lz-refactor (RTR-01, ASRT-02; Phase 17).

## Decisions Made
- Kept SKILL.md at 80 lines rather than padding to the ~90-120 line estimate. RESEARCH and D-04 explicitly say the router sits at the low end this phase because the coach procedure is a placeholder; "do not pad it". The hard constraint is < 500 (met); 80 is near lz-tpp's 81.
- Used the plan's exact v1 description text verbatim (D-06/D-07/D-08). Measured folded length is 1091 chars (RESEARCH estimated ~1083; the small delta is punctuation counting, not a wording change), well under the 1536 cap. No empirical tuning -- that is Phase 20 by design.
- Wrapped the folded description so `use lz-tpp`, `use lz-refactor`, and the positive-trigger phrase each stay intact on a single line, so the Wave-0 `git grep -F` and byte-offset checks pass on the committed file.
- Applied owned/no-oracle access-tier tags per stub only where the milestone constraints already establish them (RCM and Metz owned via `.oracle/`; Beck and Feathers unowned -> no-oracle); tiers not yet established are deferred to the Phase-16 oracle-access checkpoint rather than guessed.

## Deviations from Plan

None - plan executed exactly as written. All 3 tasks completed with no bugs, missing critical functionality, blocking issues, or architectural changes encountered (deviation Rules 1-4 not triggered). No package installs (Markdown-only phase).

## Known Stubs

All stubs below are INTENTIONAL and are the explicit deliverable of this scaffold phase (D-02, D-04), not accidental gaps. Each carries a `Populated in Phase NN` content-contract marker naming its fill phase. They do not block the Phase-15 goal (the goal IS to create these fill targets), and the plan's ROADMAP fixes each resolution phase:

- The 10 `references/` stubs are thin content contracts (title + Scope + fill marker + requirement IDs + source cluster + scoped bullets + Sources placeholder). Real prose facts and any TypeScript/Vitest examples are Phases 16-17 (gated by the `.oracle/` clean-room + tsc --strict-clean).
- The SKILL.md `## Coach decision procedure (deferred to Phase 18)` section is a labeled 4-line placeholder. The numbered RED procedure + stance-router wiring + lz-tpp handoff is Phase 18 (SEAM-01, LAW-01/02, RTR-02/03).
- No empirical description tuning (Phase 20 / EVL-01), no version bump (plugin.json stays 0.0.2 -> Phase 19), no lz-tpp reverse pointer (SEAM-02 -> Phase 18), no eval workspace or `.oracle/` content (Phases 20/16). All confirmed absent by the Wave-0 scope-fence check.

## Issues Encountered

- Two Wave-0 `git grep -F` acceptance checks initially reported "not found" for `use lz-tpp` / `use lz-refactor` / `deferred to Phase 18`. Root cause: `git grep` only searches the tracked index, and SKILL.md was still untracked at the time of the check (a known Windows/arm64 workflow note). Content-based checks (rg + byte-offset) confirmed the strings were present; staging SKILL.md made every `git grep` check pass. No content change was needed.

## User Setup Required

None - no external service configuration required. Markdown-only skill scaffold.

## Next Phase Readiness

- The lz-red skill tree is registered and structurally complete; Phases 16-18 have unambiguous, link-resolved fill targets.
- Phase 16 (oracle setup + first RED references) is the natural next step: open the AskUserQuestion oracle-access checkpoint for the owned books (RCM Clean Code, Metz 99 Bottles JS Ed) and begin filling the SEL/STR/NAME stubs.
- No blockers. Scope fences held: plugin.json at 0.0.2, marketplace.json and lz-tpp/SKILL.md untouched, no workspace/oracle content created.

## Wave-0 Structural Gate

All 11 gate checks green on the committed state: `claude plugin validate .` exit 0; 11/11 files exist; SKILL.md 80 lines (< 500); 10/10 stubs carry the `Populated in Phase` marker; 10/10 stub paths linked from SKILL.md and resolve (case-correct `testing-stance/README.md`); both reciprocal exclusions present; folded description 1091 <= 1536; frontmatter exactly `name`+`description` with `name: lz-red`; ASCII-only across all 11 files; email allowlist-inversion clean (0 tokens); scope fences intact.

## Self-Check: PASSED

- Created files: 11/11 exist on disk (SKILL.md + 10 reference stubs).
- Task commits: all 3 present in git history (a7c037d, f2f3965, 1e75b0e).
- SUMMARY hygiene: ASCII-only, email allowlist-inversion clean (0 tokens).

---
*Phase: 15-lz-red-skill-scaffold-description-boundary*
*Completed: 2026-07-18*
