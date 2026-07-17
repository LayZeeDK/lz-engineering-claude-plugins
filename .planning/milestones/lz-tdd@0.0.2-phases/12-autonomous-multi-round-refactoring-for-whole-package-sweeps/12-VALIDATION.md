---
phase: 12
slug: autonomous-multi-round-refactoring-for-whole-package-sweeps
status: complete
nyquist_compliant: true
wave_0_complete: true
created: 2026-07-11
validated: 2026-07-14
---

# Phase 12 -- Validation Strategy

> Per-phase validation contract for feedback sampling during execution. ASCII-only
> (repo convention). This phase's "tests" are build-time lints (fast, unattended) plus
> a metered `claude -p` eval run that is USER-GATED behind `/reload-plugins` (D-18) --
> the eval run is the behavior oracle, not a unit-test suite.
>
> **Retroactive audit note (2026-07-14, gsd-nyquist-auditor):** the coverage contract is
> MET. Every deterministic build-time instrument was RE-RUN this audit and is GREEN; both
> empirically-confirmed gaps were measured CLOSED before/after in BOTH suites (durable rates
> in E2E-FINDINGS.md / GR-RESULTS.md / the quick-task VERIFICATIONs, deterministic from
> `meta.json`). One genuine automation gap was found and FILLED (the D-12 dual-write invariant
> had no guard). The single prior WARNING (nx whole-package sweep auto-trigger re-confirmed
> post-revert only inferentially) was CLOSED 2026-07-14 by a gated metered re-run on HEAD
> (quick 260714-vmy: p8 with_skill apply k=3 -> 3/3 auto-trigger), converting inferred to measured.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Node.js ESM checkers + skill-creator-eval (native-fixed run_eval.py) under `.claude/skills/lz-refactor-workspace/` |
| **Config file** | `.claude/skills/lz-refactor-workspace/package.json` (npm run check battery) |
| **Quick run command** | `node .claude/skills/lz-refactor-workspace/check-evals.mjs` (build-time eval-set lint + D-12 dual-write guard, no claude -p) |
| **Full suite command** | trigger recall/spec chunk runners + `e2e-nx` / `e2e-gilded-rose` runners (metered claude -p; USER-GATED per D-18) |
| **Estimated runtime** | lints ~seconds; metered eval + e2e ~tens of minutes (gated) |

---

## Sampling Rate

- **After every SKILL.md / eval-set edit:** `check-evals.mjs` lint stays green (schema, >=8/>=8 split, >=2 seam, ASCII-only, AND D-12 dual-write byte-consistency); `claude plugin validate .` passes.
- **After the plugin is reloaded (USER `/reload-plugins`):** trigger recall/spec + e2e before/after runs (D-16).
- **Before phase complete:** both gaps measured CLOSED before/after in BOTH suites (SC4); the existing 18/18 e2e recall + 11/11 specificity re-run with no regression (SC1).
- **Max feedback latency:** build-time lints immediate; the metered runs are the gated behavior oracle.

---

## Per-Task Verification Map

Each phase deliverable is anchored to a build-time lint (runnable + deterministic, RE-RUN this
audit), the D-17 subagent review (incl. >=1 unbiased) for SKILL.md edits, or a gated metered
eval/e2e run whose durable rate is captured in a tracked results file.

| # | Deliverable | Plan | Requirement (SC) | Test Type | Automated Command | Status |
|---|-------------|------|------------------|-----------|-------------------|--------|
| 1 | 3 sweep positives + 3 dual-written sweep negatives in trigger-eval.json | 12-01 | SC1/SC4 (instrument) | build-time lint | `node check-evals.mjs` | green |
| 2 | D-12 dual-write byte-consistency (trigger-eval.json negatives == d07-chunks/negatives.json) | 12-01 | SC1 specificity integrity | build-time lint (NEW this audit) | `node check-evals.mjs` | green |
| 3 | nx + kata multi-round sweep-command e2e scenarios (p7cmd/gr3cmd) + directive prompts (p8/gr4, p9-p12) | 12-01 | SC2/SC4 (instrument) | e2e (gated metered) | `node e2e-nx/run-e2e.mjs` / `--suite gilded-rose` | green (measured via loop) |
| 4 | SKILL.md "Whole-package / directory sweeps" drive cluster (loop-to-fixpoint + guards) | 12-02 | SC2 | D-17 review + plugin validate + structural | `claude plugin validate .` | green |
| 5 | SKILL.md trigger description (8acd2b8 intent-based; 12-02 sweep-bulk reverted 138acf4) | 12-02 | SC1 | D-17 review + plugin validate + metered recall/e2e | `claude plugin validate .` ; e2e recall | green (nx p8 3/3 on HEAD, quick 260714-vmy) |
| 6 | Research-informed changes (12-RESEARCH + n5o research; D-17 reviews on each SKILL.md commit) | 12-RESEARCH | SC3 | doc + subagent review | (manual review record) | green |
| 7 | D-16 pre-edit baseline tree (OLD SKILL.md + NEW instruments) | 12-01 | D-16 protocol | git tree | `git show --stat beed2a1` | green |

*Status: pending / green / red / flaky (ASCII words, no symbols).*

**Instruments re-run this audit (deterministic, GREEN):**
- `node check-evals.mjs` -> `OK - 30 queries (16 trigger / 14 near-miss; 5 lz-tpp-seam), ASCII-clean` (exit 0). Now also asserts the D-12 dual-write byte-consistency (proven fail-closed: injecting a one-token drift into `d07-chunks/negatives.json` yields exit 1 with a dual-write mismatch message; restored byte-clean).
- `claude plugin validate .` -> `Validation passed` (exit 0).
- Dual-write cross-check (independent script): trigger-eval.json 14 negatives == d07-chunks/negatives.json 14 negatives, byte-identical, same order.
- Git ancestry: 8acd2b8 (trigger description), 138acf4 (revert of 12-02 sweep bulk), 98eedd5 (12-02 sweep bulk) all ancestors of HEAD (64be50b). Shipped SKILL.md description does NOT contain the reverted "sweep a whole package" broadening clause; the sweep-DRIVE cluster (lines 101-116) IS present with all guards (fixpoint, tests-green-each-round, blast-radius pause, revert-on-red, checkpoint). 158 lines (< 500), ASCII-clean.

---

## Wave 0 Requirements

- [x] Sweep-shaped trigger positives added to `evals/trigger-eval.json` (3: billing package, src/services directory, auth library); sweep-shaped negatives added to BOTH `evals/trigger-eval.json` and `evals/d07-chunks/negatives.json` (3 dual-written: api feature-add, reporting perf, parser red-test); `check-evals.mjs` green. **Now also guarded by the D-12 dual-write assertion (deliverable #2).**
- [x] Baseline capture (current shipped skill) archived BEFORE any SKILL.md edit: the D-16 pre-edit tree = OLD SKILL.md + NEW instruments was committed as beed2a1 (instruments-first), with SKILL.md untouched; the workspace `baseline/` archive dir is present.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Plugin reload before after-measurement | SC4 | `/reload-plugins` cannot be run by Claude; committed != live (D-18) | User runs `/reload-plugins`, then the after-measurement runs proceed. Satisfied post-phase: the skill-improvement-loop e2e read the edited skill via `--plugin-dir` (repo tree on disk). |
| Metered eval / e2e run | SC1, SC4 | Spends `claude -p`; user pre-approved conditionally (agent-reviewed Markdown) | Done via the loop; durable rates in E2E-FINDINGS.md / GR-RESULTS.md / quick 260712-i5y + 260712-n5o. Raw run dirs are transient (cleaned up after triage); the tracked docs are the record. |

---

## Measurement evidence verified (SC1 / SC4)

Both gaps measured CLOSED before/after in BOTH suites -- rates deterministic from `meta.json`
(D-14), verified against the tracked results files, not SUMMARY assertion:

| Axis | Suite | Before | After | Source |
|------|-------|--------|-------|--------|
| TRIGGER (coach) | nx p1-p4 | 1/12 | 12/12 | E2E-FINDINGS.md Resolution |
| TRIGGER (coach) | kata gr1/gr2 | 0/6 | 6/6 | E2E-FINDINGS.md Resolution |
| TRIGGER (combined coach) | both | 1/18 (6%) | 18/18 (100%) | E2E-FINDINGS.md Resolution |
| TRIGGER (isolated recall / specificity) | trigger-eval | 92% / 100% (11/11 quiet) | 100% / 100% | E2E-FINDINGS.md (old 13-pos set) |
| TRIGGER (package sweep) | nx p8 / fleet p9-p12 | ~0 | p8 3/3 (HEAD post-revert, 2026-07-14) + 8/8 fleet (pre-revert) | quick 260714-vmy (p8) / 260712-i5y / 260712-n5o |
| TRIGGER (package sweep) | kata gr4 | 0 | 3/3 (post-revert, 2026-07-14) | GR-RESULTS.md |
| DRIVE (command) | both | stop-and-ask / fired-but-zero-edits | command 6/6 | E2E-FINDINGS.md Resolution |
| DRIVE (package sweep) | nx p8 / kata gr4 / fleet | stop-and-ask | 4-6 behavior-preserving rounds to fixpoint | quick 260712-i5y / 260712-n5o |

Behavior preservation confirmed (original tests against edited source): nx 169-pass held both
arms; kata golden master + characterization snapshot; seeded traps avoided (nx exported-signature;
kata Conjured 6/6).

---

## Findings

**FILLED (1 genuine gap):**
- **D-12 dual-write invariant had no automated guard.** `check-evals.mjs` read only
  `trigger-eval.json`; nothing asserted byte-consistency with `d07-chunks/negatives.json` (the
  file the SPEC runner actually reads). Drift between them -- the exact "dual-write trap" D-12
  names -- would silently make the spec runner measure a stale negative set, invalidating the SC1
  specificity guarantee, with no fail-closed signal. 12-01 verified consistency MANUALLY only.
  Fixed by adding assertion (5) to `check-evals.mjs` (harness .mjs, exempt from the D-17
  subagent-review gate per project convention; verified by running). Proven fail-closed.

**RESOLVED (1 prior WARNING, closed 2026-07-14):**
- **nx whole-package sweep auto-trigger on HEAD post-revert is now DIRECTLY MEASURED (was inferred).**
  Originally the nx sweep trigger (p8 3/3, fleet 8/8) was measured PRE-revert against the broadened
  12-02 description (98eedd5), later reverted (138acf4); post-revert only the KATA sweep (gr4 3/3)
  had been directly re-confirmed on HEAD, leaving the nx sweep strongly inferred. Closed by a gated,
  user-approved metered re-run on HEAD (quick 260714-vmy): `run-e2e.mjs --mode apply --prompt p8
  --arm with_skill --runs 3` against nx branch `lz-refactor-e2e-smoke` (= origin/23.0.x), reading the
  live skill via `--plugin-dir` (= HEAD). Result: **3/3 auto-triggered** (`used_refactor=true`,
  `skills_invoked=["lz-tdd:lz-refactor"]` each run; deterministic from meta.json), matching the
  pre-revert p8 3/3 and the post-revert kata gr4 3/3. No regression from the 138acf4 revert. This
  converts the last inferred measurement to measured; no coverage gap remains.

**No BLOCKER.** All four ROADMAP Success Criteria are met and measured; 12-VERIFICATION is
status: passed (4/4). The prior low-risk WARNING above is now CLOSED (measured on HEAD).

---

## Validation Sign-Off

- [x] Every plan task anchored to a build-time lint, a D-17 review, or a gated eval/e2e run (see map)
- [x] Sampling continuity: no build task without a lint/validate check
- [x] Wave 0 covers eval-set edits + baseline capture before any SKILL.md change
- [x] No watch-mode flags; `--num-workers 1` locked for eval runs (D-12)
- [x] `nyquist_compliant: true` set in frontmatter (coverage contract met by instruments + measurement)

**Approval:** validated (gsd-nyquist-auditor, 2026-07-14) -- coverage contract met; 1 gap filled (D-12 dual-write guard); the 1 non-blocking WARNING (nx sweep post-revert re-confirmation) was CLOSED 2026-07-14 by a gated metered re-run on HEAD (quick 260714-vmy: p8 with_skill apply 3/3 auto-trigger).
