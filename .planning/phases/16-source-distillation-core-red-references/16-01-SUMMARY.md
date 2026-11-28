---
phase: 16-source-distillation-core-red-references
plan: 01
subsystem: testing
tags: [claude-code-plugin, tdd, red-phase, validation-harness, tsc-strict, vitest, nyquist, instrument-first, hygiene-gate, lz-red]

# Dependency graph
requires:
  - phase: "15-lz-red-skill-scaffold-description-boundary"
    provides: "the three core RED reference stubs (three-laws-and-test-selection.md, test-structure-and-assertions.md, naming.md) + the testing-stance/ subdir that check-red-references targets, each carrying a scaffold-marked Sources heading and per-doc fill-phase markers"
  - phase: "0.0.2 / Phase 7 (lz-refactor-workspace)"
    provides: "the proven copy-and-repoint recipe: extract-samples.mjs one-module-per-fence tsc --strict extractor, tsconfig.json, package.json, tools/lib/scaffold-phrases.mjs, check-backing.mjs checker template, and the widenable check-hygiene.mjs target-set split"
provides:
  - "Dev-only lz-red-workspace: repointed one-module-per-fence tsc --strict extractor (vacuous GREEN on 0 fences today)"
  - "check-red-references.mjs -- the RED->GREEN content-completeness signal; asserted RED against the three Phase-15 stubs (exit 1 by design, instrument-first Nyquist baseline)"
  - "check-hygiene.mjs additively widened to scan the lz-red tree on all three axes (ASCII + work-email allowlist + no-verbatim); GREEN over 198/191 files"
  - "Two exact-pinned, human-approved dev dependencies (typescript@6.0.3, vitest@4.1.10) gated by a blocking-human package-legitimacy checkpoint; NO build dep in the shipped plugins/lz-tdd tree"
  - "A machine-checkable RED baseline that Wave-1 authoring (16-02) must turn GREEN"
affects: [16-02-fill-sel-str-name-slices, 16-03-finalize-gate, 17-assertion-design-stance-router, 18-coach-procedure-seam-wiring]

# Tech tracking
tech-stack:
  added:
    - "typescript@6.0.3 (dev-only, exact-pinned; declared in the workspace package.json, NOT yet installed -- 16-02 runs the approved npm install)"
    - "vitest@4.1.10 (dev-only, exact-pinned; resolves the bare 'vitest' import in the example fences under bundler resolution)"
  patterns: [instrument-first Nyquist RED baseline (assert RED before content lands), one-module-per-fence tsc --strict extractor with empty-set vacuous-GREEN early return, additive hygiene target-set widening (never weaken a rule), deferral-guard (later-phase markers must REMAIN so a wave cannot over-fill a later slice), copy-and-repoint self-contained dev workspace]

key-files:
  created:
    - .claude/skills/lz-red-workspace/extract-samples.mjs
    - .claude/skills/lz-red-workspace/tsconfig.json
    - .claude/skills/lz-red-workspace/package.json
    - .claude/skills/lz-red-workspace/tools/lib/scaffold-phrases.mjs
    - .claude/skills/lz-red-workspace/tools/check-red-references.mjs
  modified:
    - .claude/skills/lz-refactor-workspace/tools/check-hygiene.mjs

key-decisions:
  - "D-11: stood up a minimal dev-only lz-red-workspace by copying the proven lz-refactor-workspace extractor recipe repointed at the flat lz-red references walk (single FLAT walk, CATALOGS array dropped, SUMMARY label RED-SAMPLES); pinned typescript@6.0.3 + vitest@4.1.10 exact; the shipped plugins/lz-tdd tree gets NO build deps"
  - "D-10: the workspace tsc --strict --noEmit gate (extract-samples.mjs) is stood up here at its GREEN-on-empty baseline -- 0 ts fences compile vacuously via the empty-set early return, so the extractor cannot be the content-completeness signal"
  - "D-04: check-red-references.mjs carries a deferral guard -- three-laws must retain its Phase-18 (LAW/SEAM) marker and test-structure must retain its Phase-17 (ASRT) marker, so Wave-1 fills only its Phase-16 slice; naming.md is fully Phase-16 and has no deferral guard"
  - "D-12: the deterministic no-verbatim scan is instrumented by adding the lz-red tree to check-hygiene verbatimTargets (clean-room own-words, so unlike lz-tpp it DOES take the no-verbatim gate)"

patterns-established:
  - "RED->GREEN content signal via scaffold-marker: each stub's draft-marked Sources heading trips check-red-references's /\\bplaceholder\\b/i today; the baseline flips GREEN only when 16-02 authoring rewrites the heading and adds the tsc-strict fences"
  - "Additive-only hygiene widening: LZ_RED consts + walkMd pushes into BOTH wideTargets and verbatimTargets, with APPROVED_EMAILS / EMAIL_RE / QUOTE_THRESHOLD / scan-floor anchors byte-unchanged"

requirements-completed: []
# Instrument-first plan. SEL-01, SEL-02, STR-01, STR-02, NAME-01 (this plan's `requirements` frontmatter)
# are NOT closed here -- they are the RED baseline this workspace asserts. They close in 16-02 when
# authoring turns check-red-references GREEN. REQUIREMENTS.md traceability rows stay Pending (matching
# the project's instrument-plan precedent: 07-01 FWL-01..04, 08.1-01 GOF-01..04, 09-01 PRIN-01..03).

coverage:
  - id: D1
    description: "The dev-only lz-red-workspace tsc --strict extractor exists and reports GREEN-on-empty (0 fences -> vacuous strict-clean baseline) before any content lands"
    requirement: "SEL-01"
    verification:
      - kind: automated
        ref: "node .claude/skills/lz-red-workspace/extract-samples.mjs -> exit 0, prints 'RED-SAMPLES GREEN -- 0 modules to compile (empty-refs baseline)'"
        status: pass
    human_judgment: false
  - id: D2
    description: "check-red-references.mjs is asserted RED against the three current Phase-15 stubs (the instrument-first Nyquist baseline) and is wired to turn GREEN only when the SEL/STR/NAME slices are authored"
    requirement: "SEL-02"
    verification:
      - kind: automated
        ref: "node .claude/skills/lz-red-workspace/tools/check-red-references.mjs -> exit 1 = asserted RED baseline (6 content checks FAIL by design: 3x '>= 1 ts fence' + 3x 'no scaffold phrase'; 3/3 refs present + both Phase-17/18 deferral guards PASS)"
        status: pass
    human_judgment: false
  - id: D3
    description: "check-hygiene.mjs (repo-global) scans the lz-red reference tree on ALL THREE axes (ASCII, work-email allowlist, no-verbatim) and stays GREEN over the clean stubs; the edit is additive only"
    requirement: "STR-01"
    verification:
      - kind: automated
        ref: "node .claude/skills/lz-refactor-workspace/tools/check-hygiene.mjs -> exit 0 (ASCII 198 files, no non-allowlisted emails, no-verbatim 191 files, scan-floor PASS)"
        status: pass
    human_judgment: false
  - id: D4
    description: "claude plugin validate . exits 0 with the new dev-only workspace in place (the .claude/ workspace is not a plugin and does not perturb marketplace/plugin validation)"
    requirement: "STR-02"
    verification:
      - kind: automated
        ref: "claude plugin validate . -> 'Validation passed' exit 0"
        status: pass
    human_judgment: false

# Metrics
duration: ~6min active (Tasks 1-2) + blocking-human checkpoint pause
completed: 2026-07-19
status: complete
---

# Phase 16 Plan 01: Instrument-First lz-red-workspace and RED Baseline Summary

**A dev-only lz-red-workspace that asserts the Nyquist RED baseline before any oracle content lands: a repointed one-module-per-fence tsc --strict extractor (vacuous GREEN on 0 fences), a check-red-references.mjs completeness checker asserted RED against the three Phase-15 stubs (exit 1 by design), and an additive check-hygiene widening that scans the lz-red tree on ASCII + work-email + no-verbatim (GREEN over 198/191 files) -- with two exact-pinned, human-approved dev deps and zero build deps in the shipped plugin.**

## Performance

- **Duration:** ~6 min active execution (Tasks 1-2) + blocking-human package-legitimacy checkpoint pause before completion
- **Started:** 2026-07-19T01:42:46+02:00 (first task commit)
- **Completed:** 2026-07-19T01:58:00+02:00 (SUMMARY + STATE + ROADMAP metadata commit)
- **Tasks:** 3 (2 auto + 1 blocking-human checkpoint, approved)
- **Files modified:** 6 (5 created + 1 modified), all under `.claude/` dev workspaces; ZERO shipped-plugin files touched

## Accomplishments
- Stood up the dev-only `lz-red-workspace` by copying the proven `lz-refactor-workspace` recipe and repointing it at the flat lz-red references walk (D-11): `extract-samples.mjs` swaps the multi-catalog walk for a single `walkMd(REFERENCES)` over `plugins/lz-tdd/skills/lz-red/references`, one module per fence, SUMMARY label retokened to `RED-SAMPLES`; `tsconfig.json` copied byte-identical (strict/noEmit, bundler resolution, no `types` array); `package.json` renamed to `lz-red-workspace` with EXACT pins `typescript@6.0.3` + `vitest@4.1.10` (private ESM); `tools/lib/scaffold-phrases.mjs` copied verbatim so the workspace is self-contained. The extractor reports the intended vacuous GREEN today (0 ts fences -> empty-set early return, no `npm install` required for this baseline).
- Authored `check-red-references.mjs` as the RED->GREEN content signal (D-04): a `check-backing.mjs`-style node-builtin checker with one FILES entry per lz-red reference asserting the content-present topics (test list / one-step / degenerate-starter / triangulation / lz-tpp GREEN-firewall for three-laws; AAA / GWT / assert-first / evident-data / one-concept for test-structure; should-naming / behavior / Osherove-three-part / house-stance for naming), a `>= 1 ts fence` file-level assertion, and a `no SCAFFOLD_RES draft-marker` assertion per file. It is asserted RED (exit 1) against the three current stubs -- 6 checks FAIL by design (3x missing tsc-strict fence + 3x draft scaffold phrase present), while 3/3 refs resolve and both later-phase deferral guards (Phase-17 ASRT on test-structure, Phase-18 LAW/SEAM on three-laws) PASS.
- Extended the repo-global `check-hygiene.mjs` additively (D-12): added `LZ_RED_SKILL_DIR` / `LZ_RED_SKILL_MD` / `LZ_RED_REFERENCES` consts and pushed the lz-red SKILL.md + `walkMd(LZ_RED_REFERENCES)` into BOTH `wideTargets` (ASCII + work-email) AND `verbatimTargets` (no-verbatim, since lz-red is clean-room own-words). The gate stays GREEN over the widened set (198 files ASCII/email, 191 files no-verbatim) with `APPROVED_EMAILS` / `EMAIL_RE` / `QUOTE_THRESHOLD` / scan-floor anchors byte-unchanged -- widening the file set, never weakening a rule.
- Cleared the blocking-human package-legitimacy checkpoint: the human verified `typescript@6.0.3` (official microsoft/TypeScript) and `vitest@4.1.10` (official vitest-dev/vitest, no postinstall) on npmjs.com and approved the exact-pinned dev-only install. This authorizes the Wave-2 (16-02) `npm install`; 16-01 itself installs nothing.

## Task Commits

Each auto task was committed atomically:

1. **Task 1: Scaffold lz-red-workspace (extractor + tsconfig + package.json + scaffold-phrase lib)** - `5b816d9` (feat)
2. **Task 2: check-red-references.mjs RED baseline + additive check-hygiene extension to the lz-red tree** - `5a67567` (feat)
3. **Task 3: Package-legitimacy checkpoint (typescript@6.0.3 + vitest@4.1.10)** - blocking-human gate, APPROVED (no code change, no commit; performs no install -- authorizes the 16-02 install)

**Plan metadata:** `<metadata-commit>` (docs: complete plan -- SUMMARY.md + STATE.md + ROADMAP.md)

## Files Created/Modified
- `.claude/skills/lz-red-workspace/extract-samples.mjs` - one-module-per-fence tsc --strict extractor, repointed at the flat `plugins/lz-tdd/skills/lz-red/references` walk (CATALOGS array dropped, `RED-SAMPLES` SUMMARY label); GREEN-on-empty via the empty-set early return.
- `.claude/skills/lz-red-workspace/tsconfig.json` - strict/noEmit compile config copied byte-identical (target es2021, module esnext, moduleResolution bundler, no `types` array).
- `.claude/skills/lz-red-workspace/package.json` - `lz-red-workspace` (private, ESM); EXACT-pinned devDependencies `typescript@6.0.3` + `vitest@4.1.10`; `typecheck` = `node extract-samples.mjs`, `check` = `node tools/check-red-references.mjs`.
- `.claude/skills/lz-red-workspace/tools/lib/scaffold-phrases.mjs` - `SCAFFOLD_RES` draft-marker set, copied verbatim so the workspace does not import across workspaces.
- `.claude/skills/lz-red-workspace/tools/check-red-references.mjs` - NEW completeness checker; the RED->GREEN content signal, asserted RED against the three Phase-15 stubs.
- `.claude/skills/lz-refactor-workspace/tools/check-hygiene.mjs` - MODIFIED: additively widened to scan the lz-red tree on ASCII + work-email + no-verbatim; rule set (allowlist, EMAIL_RE, QUOTE_THRESHOLD, scan-floor) unchanged.

## Decisions Made
- **D-11 (dev-only workspace):** Copied the lz-refactor-workspace recipe rather than authoring fresh, and kept it self-contained (scaffold-phrases copied in, not imported across workspaces). Exact pins (no `^`/`~`) because the RESEARCH Package Legitimacy audit requires them. The shipped `plugins/lz-tdd` tree gets no build dependency -- all deps live only in the gitignored `.claude/skills/lz-red-workspace`.
- **D-10 (tsc gate stood up GREEN-on-empty):** The extractor is the compile gate, deliberately vacuous today (0 fences). It cannot be the content-completeness signal, which is why check-red-references exists as a separate RED->GREEN instrument.
- **D-04 (deferral guard):** check-red-references asserts the two co-edited stubs KEEP their later-phase markers (Phase-17 ASRT on test-structure, Phase-18 LAW/SEAM on three-laws), so Wave-1 authoring fills only the Phase-16 SEL/STR/NAME slice and cannot over-fill a later phase. naming.md is fully Phase-16 and carries no deferral guard.
- **D-12 (no-verbatim on lz-red):** lz-red is clean-room own-words with no cited-verbatim exemption, so its tree enters verbatimTargets (unlike lz-tpp, which stays excluded). The hygiene extension is additive only.

## Deviations from Plan

None observed - Tasks 1-2 executed as written and their acceptance criteria re-verify green in this continuation (extractor vacuous GREEN, check-red-references RED with the exact expected failures, check-hygiene additive + GREEN, claude plugin validate . exit 0). The two commits (`5b816d9`, `5a67567`) match the plan's file list exactly (5 created + check-hygiene modified). No deviation rules (1-4) were triggered; no package installs ran in this plan (Task 3 gates the install to 16-02).

## Known Stubs

The three lz-red core references remain RED (unfilled) BY DESIGN -- that is the asserted instrument-first baseline, not an accidental gap:

- `plugins/lz-tdd/skills/lz-red/references/three-laws-and-test-selection.md`, `test-structure-and-assertions.md`, and `naming.md` each still carry a scaffold-marked Sources heading and no tsc-strict TypeScript fence, so `check-red-references.mjs` reports 6 FAILs (exit 1). Wave-1 (16-02) turns this GREEN by authoring the own-words SEL/STR/NAME facts + Vitest examples and clearing each scaffold marker. The two co-edited stubs must retain their Phase-17 / Phase-18 deferral markers (enforced).
- The two dev dependencies (`typescript@6.0.3`, `vitest@4.1.10`) are DECLARED in the workspace `package.json` but NOT installed. The blocking-human legitimacy checkpoint is approved; 16-02 runs the actual `npm install` (out of scope here, and the extractor's vacuous-GREEN baseline needs no install).

## Issues Encountered

None. This continuation authored the plan artifacts after the blocking-human package-legitimacy checkpoint (Task 3) was approved; Tasks 1-2 were already committed and were re-verified rather than re-executed.

## Package-Legitimacy Checkpoint (Task 3)

- **Type:** blocking-human (never auto-approvable) -- package legitimacy gate.
- **Packages:** `typescript@6.0.3` (official microsoft/TypeScript; already the pinned + globally-installed version) and `vitest@4.1.10` (official vitest-dev/vitest; no install-time postinstall). RESEARCH flagged both SUS (too-new) and dispositioned both APPROVED; the SUS flag is a too-new false positive.
- **Outcome:** APPROVED. The human verified both on npmjs.com and authorized the exact-pinned dev-only install. This clears threat T-16-SC and authorizes the Wave-2 (16-02) `npm install`. No package installs into the shipped `plugins/lz-tdd` tree.

## User Setup Required

None - no external service configuration required. The one human gate (package-legitimacy verification) is complete.

## Next Phase Readiness

- The machine-checkable RED baseline is live: 16-02 (Wave 2) fills the SEL / STR / NAME slices own-words with tsc-strict Vitest examples and clears each scaffold marker to turn `check-red-references.mjs` GREEN, closing SEL-01, SEL-02, STR-01, STR-02, NAME-01.
- The two dev dependencies are exact-pinned and legitimacy-approved; 16-02 is authorized to run `npm install` in the workspace and resolve the Vitest types for the example fences.
- Scope fences held: no dependency touches the shipped `plugins/lz-tdd` tree; the hygiene edit is additive; the two co-edited stubs' later-phase deferral guards protect the Phase-17 / Phase-18 slices.
- No blockers.

## Instrument Baseline Gate

All plan-level verifications reproduce green on the committed state:
- `node extract-samples.mjs` -> exit 0, vacuous GREEN (`RED-SAMPLES GREEN -- 0 modules to compile`).
- `node tools/check-red-references.mjs` -> exit 1, asserted RED baseline (6 content checks FAIL by design; 3/3 refs present; Phase-17 ASRT + Phase-18 LAW/SEAM deferral guards PASS).
- `node .claude/skills/lz-refactor-workspace/tools/check-hygiene.mjs` -> exit 0, GREEN over the widened set (198 files ASCII/email, 191 files no-verbatim, scan-floor PASS).
- `claude plugin validate .` -> exit 0 (Validation passed).
- Package-legitimacy checkpoint cleared (human-approved) before any npm install.

## Self-Check: PASSED

- Created files: 6/6 exist on disk (5 lz-red-workspace files + the modified check-hygiene.mjs).
- Task commits: both present in git history (`5b816d9`, `5a67567`); Task 3 is the blocking-human checkpoint (no commit, APPROVED).
- Re-verification (continuation): `extract-samples` exit 0 (vacuous GREEN), `check-red-references` exit 1 (asserted RED, 6 checks FAIL by design), `check-hygiene` exit 0 (198/191 files), `claude plugin validate .` exit 0 -- all match the plan's asserted outcomes.
- SUMMARY hygiene: ASCII-only; email allowlist-inversion clean (0 non-allowlisted tokens); no build dep in the shipped `plugins/lz-tdd` tree.

---
*Phase: 16-source-distillation-core-red-references*
*Completed: 2026-07-19*
