---
phase: 07-fowler-catalog-refactoring-2nd-ed
plan: 01
subsystem: testing
tags: [typescript, tsc-strict, node, validation-harness, checkers, fowler-catalog]

# Dependency graph
requires:
  - phase: 06-lz-refactor-skill-scaffold-progressive-disclosure
    provides: "the lz-refactor scaffold (SKILL.md + references/ stubs: fowler-catalog/README.md, smells.md, principles.md) that the checkers assert against, and the lz-refactor-workspace/tools/verify-scaffold.mjs checker idiom"
provides:
  - "FWL-04 tsc --strict compile harness (tsconfig.json + package.json + extract-samples.mjs): one .ts module per fenced ts block, tsc --strict --noEmit gate"
  - "FWL-01 catalog completeness + provenance checker (check-catalog.mjs): 66-name identity check + Motivation/Mechanics/fence contract + [web-only]/[web-example] tags"
  - "FWL-02 smell checker (check-smells.mjs): 24 Fowler rows + GitHub-slug cross-link anchor resolution"
  - "FWL-03 principles checker (check-principles.mjs): Ch.2 topic-presence gate"
  - "hygiene checker (check-hygiene.mjs): ASCII scan + work-email allowlist (hard-fail) + no-verbatim long-quote heuristic (WARN)"
  - ".gitignore entry for the generated workspace samples/ dir"
affects: [07-02, 07-03, 07-04, 07-05, 07-06, 07-07, 07-08, fowler-catalog-content, smells, principles]

# Tech tracking
tech-stack:
  added: [typescript@6.0.3 (workspace devDependency, non-shipped)]
  patterns: [one-module-per-fence tsc extraction, node-builtin throwaway checkers, exit-code-gated validation battery, work-email allowlist gate]

key-files:
  created:
    - .claude/skills/lz-refactor-workspace/tsconfig.json
    - .claude/skills/lz-refactor-workspace/package.json
    - .claude/skills/lz-refactor-workspace/extract-samples.mjs
    - .claude/skills/lz-refactor-workspace/tools/check-catalog.mjs
    - .claude/skills/lz-refactor-workspace/tools/check-smells.mjs
    - .claude/skills/lz-refactor-workspace/tools/check-principles.mjs
    - .claude/skills/lz-refactor-workspace/tools/check-hygiene.mjs
  modified:
    - .gitignore

key-decisions:
  - "Pinned typescript@6.0.3 as a workspace devDependency (D-03 reproducibility); the harness still runs against the globally installed tsc 6.0.3 with zero install"
  - "One module per fence (append export {} to force module scope) so before/after snippets reusing symbol names never collide"
  - "Empty-catalog handling: extractor reports vacuous GREEN (exit 0) when 0 modules -- tsc -p errors on an empty include set, which would false-RED"
  - "check-catalog asserts name IDENTITY (each of 66 present exactly once), not just cardinality -- closes the WR-02 gap from the Phase-6 review"
  - "FWL-01..FWL-04 deliberately NOT marked complete: this wave-1 plan authors no content; the checkers are RED by design (0/66, 0/24, 0/8) and the requirements close when waves 2-4 land content"

patterns-established:
  - "Exit-code-gated checker battery: every instrument ends with a SUMMARY: line + process.exit(0 GREEN / 1 RED) so a wave merge gates on exit code"
  - "GitHub-slug cross-link resolution: check-smells computes heading anchors (lowercase, strip punctuation, spaces to hyphens, dup -N suffix) and asserts each ](fowler-catalog/<leaf>.md#anchor) resolves"

requirements-completed: []  # NONE closed here -- see Decisions Made; FWL-01..04 are graded by these instruments and close in later waves

# Metrics
duration: 13min
completed: 2026-07-04
---

# Phase 7 Plan 01: FWL-01..04 Validation Harness Summary

**Non-shipped tsc --strict compile harness (one module per fence) plus a four-checker node-builtin battery (66-name catalog identity + provenance, 24 smell rows + cross-link resolution, Ch.2 topics, ASCII/work-email/no-verbatim hygiene) that grades the Fowler catalog by exit code -- RED against the empty catalog by design.**

## Performance

- **Duration:** 13 min
- **Started:** 2026-07-04T21:07Z (approx)
- **Completed:** 2026-07-04T21:19Z (approx)
- **Tasks:** 3
- **Files modified:** 8 (7 created, 1 modified)

## Accomplishments

- FWL-04 compile harness: `extract-samples.mjs` walks the shipped `fowler-catalog/*.md` leaves, writes each fenced `ts` block to `samples/<leaf>-<n>.ts` as its own module (skipping `ts ignore` fences), then runs `tsc --strict --noEmit` against a strict `tsconfig.json` (es2021, no `dom` lib per the Phase-3 Node-global collision). `typescript@6.0.3` pinned as a workspace devDependency.
- FWL-01 checker: hardcodes the 66 canonical 2nd-ed names, asserts each is present exactly once as a level-3 entry heading (identity, not cardinality), each entry carries Motivation + Mechanics + a ts/js fence, and the 5 print-absent entries carry `[web-only]` while Split Phase carries `[web-example]`.
- FWL-02 checker: counts Fowler-tagged smell rows (== 24) and resolves every `](fowler-catalog/<leaf>.md#anchor)` cross-link against GitHub-style heading slugs.
- FWL-03 checker: line-oriented topic-presence gate for the 8 Ch.2 topics (definition, two hats, rule of three, preparatory, comprehension, litter-pickup, performance, YAGNI).
- Hygiene checker: ASCII scan + work-email allowlist (only `larsbrinknielsen@gmail.com` permitted; hard-fail) + a no-verbatim long-quote heuristic (WARN-level, DST-04).
- `.gitignore`: added `.claude/skills/*-workspace/**/samples/` so the generated modules are never committed.

## Task Commits

Each task was committed atomically:

1. **Task 1: FWL-04 compile harness (config + extractor + tsc driver + .gitignore)** - `9ba343f` (feat)
2. **Task 2: FWL-01 catalog checker + FWL-02 smell checker** - `363d178` (feat)
3. **Task 3: FWL-03 principles checker + hygiene checker** - `9a96649` (feat)

**Plan metadata:** committed with this SUMMARY (docs)

## Files Created/Modified

- `.claude/skills/lz-refactor-workspace/tsconfig.json` - strict/noEmit es2021 config, no `dom` lib, `include: samples/**/*.ts` (FWL-04)
- `.claude/skills/lz-refactor-workspace/package.json` - pins `typescript@6.0.3` devDep; `typecheck` (extractor+tsc) and `check` (four checkers) scripts
- `.claude/skills/lz-refactor-workspace/extract-samples.mjs` - fence extractor + tsc driver; one module per fence; vacuous-GREEN on empty catalog
- `.claude/skills/lz-refactor-workspace/tools/check-catalog.mjs` - FWL-01 66-name identity + contract-field + provenance checker
- `.claude/skills/lz-refactor-workspace/tools/check-smells.mjs` - FWL-02 24-row count + cross-link anchor resolution
- `.claude/skills/lz-refactor-workspace/tools/check-principles.mjs` - FWL-03 Ch.2 topic-presence gate
- `.claude/skills/lz-refactor-workspace/tools/check-hygiene.mjs` - ASCII + work-email allowlist + no-verbatim heuristic
- `.gitignore` - ignore generated `samples/` under any workspace

## Verification Results (expected RED/GREEN baseline)

Full battery run against the empty Phase-6 scaffold:

| Instrument | Exit | Meaning |
|------------|------|---------|
| `extract-samples.mjs` | 0 | 0 modules to compile -- vacuously FWL-04 GREEN |
| `check-catalog.mjs` | 1 | 0/66 present -- expected RED (content lands waves 2-4) |
| `check-smells.mjs` | 1 | 0/24 Fowler rows -- expected RED |
| `check-principles.mjs` | 1 | 0/8 Ch.2 topics -- expected RED |
| `check-hygiene.mjs` | 0 | current shipped Markdown is ASCII-clean and email-clean |

`git status plugins/` is clean -- the harness lives only under `.claude/skills/lz-refactor-workspace/`, so `claude plugin validate` still sees pure Markdown.

## Decisions Made

- **FWL-01..FWL-04 NOT marked complete.** This is wave 1 of Phase 7 and authors no catalog content; the four checkers are the grading instruments and are RED by design (0/66, 0/24, 0/8 topics). The requirements close only when the content plans (waves 2-4) fill the leaves and the battery turns GREEN. Marking them complete now would be a false claim that the phase verifier / milestone audit would flag. REQUIREMENTS.md left unchanged for FWL-01..04.
- **Pinned `typescript@6.0.3`** in the non-shipped workspace `package.json` for a reproducible public FWL-04 claim (D-03); the extractor still runs against the globally installed `tsc 6.0.3` via PATH with zero `npm install`, and only the single first-party Microsoft compiler (threat T-07-SC, disposition Approved) enters the workspace.
- **One module per fence** with an appended `export {}` when a fence has no top-level import/export, so 66 x (before + after) snippets that reuse names like `order`/`price` do not collide (RESEARCH Pitfall 2).
- **Vacuous-GREEN on empty catalog:** `tsc -p` errors ("No inputs were found") on an empty include set, which would false-RED the harness; the extractor short-circuits to exit 0 when 0 modules are extracted, with a clear SUMMARY line.
- **Identity over cardinality:** check-catalog matches each canonical name to exactly one level-3 heading and also flags unknown/typo headings, closing the WR-02 identity-vs-count gap noted in the Phase-6 review (threat T-07-04).

## Deviations from Plan

None - plan executed exactly as written. All three tasks and their acceptance criteria were satisfied on first implementation; no auto-fixes (Rules 1-3) or architectural escalations (Rule 4) were required.

## Threat Model Coverage

- **T-07-SC (Tampering, devDependency):** mitigated -- only `typescript@6.0.3` pinned; no other dependency; confined to the non-shipped workspace.
- **T-07-02 (Info Disclosure, work-email):** mitigated -- `check-hygiene.mjs` enforces the work-email allowlist over SKILL.md + every references leaf.
- **T-07-04 (Tampering, silently-passing checker):** mitigated -- name IDENTITY assertion + `SUMMARY:` line + non-zero exit on every checker so a wave merge gates on exit code.

## Issues Encountered

None. The `gsd-sdk state.record-metric` / `state.add-decision` handlers require named flags (`--phase`, `--summary-file`, ...) and project-local file paths rather than positional args -- adjusted the invocation accordingly; not a plan issue.

## Next Phase Readiness

- The FWL-01..04 grading battery is in place and gates on exit code, ready for the wave-2..4 content plans (07-02 opens the D-07 oracle checkpoint, then 07-04..07-08 author the catalog leaves, smells.md rows, and principles.md topics).
- As content lands, each checker moves from RED to GREEN; a phase-gate run of the full battery + `claude plugin validate .` closes FWL-01..04.
- No blockers.

## Self-Check: PASSED

- All 7 created files verified present on disk; `.gitignore` modification verified.
- All 3 task commits verified in git history: `9ba343f`, `363d178`, `9a96649`.
- Generated `samples/` dir confirmed gitignored (no `plugins/` or `samples/` files staged).

---
*Phase: 07-fowler-catalog-refactoring-2nd-ed*
*Completed: 2026-07-04*
