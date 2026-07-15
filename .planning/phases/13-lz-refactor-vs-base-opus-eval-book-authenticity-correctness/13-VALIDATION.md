---
phase: 13
slug: lz-refactor-vs-base-opus-eval-book-authenticity-correctness
status: complete
nyquist_compliant: true
wave_0_complete: true
created: 2026-07-15
validated: 2026-07-15
---

# Phase 13 -- Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> This is a MEASUREMENT-ONLY eval phase: it ships no application code, so the
> "tests" are disk-artifact existence checks, oracle-verdict presence, an
> independent behavior oracle (repo tests on edited source), and a hygiene scan.
> Requirements are the 6 in 13-SPEC.md (referenced here as SPEC req 1-6).

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework (nx behavior oracle)** | nx 23.0.x + jest (`npx nx test eslint-plugin`); node_modules present in the borrowed repo |
| **Framework (kata behavior oracle)** | jest ^29.4.3 snapshot golden master (`test/jest/approvals.spec.ts`) |
| **Config file (nx)** | `packages/eslint-plugin/jest.config.cts` (preset `../../jest.preset.js`) |
| **Config file (kata)** | `package.json` scripts (`test:jest`); no jest.config committed at kata root |
| **Quick run command (nx)** | `npx nx test eslint-plugin` (differential vs recorded ~15-fail baseline) |
| **Quick run command (kata)** | `npx jest --ci test/jest/approvals.spec.ts` (refuses to write snapshots; fails on mismatch) |
| **Phase-artifact checks** | disk-existence + oracle-verdict presence + hygiene scan (the acceptance checks below) |
| **Estimated runtime** | behavior-oracle per cell ~1-3 min; grading is oracle-agent calls (Claude plan, not metered) |

---

## Sampling Rate

- **Per graded run:** run the behavior-oracle command (nx differential / kata `--ci`) against the edited source, plus collect the oracle fidelity verdicts for that run's claims.
- **Per cell:** compute Pass@k / Pass^k across k=3 for BOTH dimensions (reuse `run-e2e.mjs` `passAtK` / `passHatK`).
- **Phase gate (before `/gsd-verify-work`):** all six acceptance checks pass, `13-RESULTS.md` complete, both borrowed repos restored pristine, hygiene scan clean.
- **Max feedback latency:** ~3 minutes (per behavior-oracle run).

---

## Per-Requirement Verification Map

| SPEC req | Behavior | Check Type | Automated Command / Assertion | File Exists | Status |
|----------|----------|-----------|-------------------------------|-------------|--------|
| req 1 | no_skill single-target diffs exist (or explicit no-edit meta) | disk-artifact | for p in p1 p2 (nx) + gr1 (kata), k in 1..3: `test -f results/apply/no_skill/$p/run-$k/meta.json` (diff.patch non-empty OR meta records no-edit) | [OK] 9 runs | [OK] green |
| req 2 | sweep diffs persisted + survive borrowed-repo restore | disk-artifact | `test -s results/apply/no_skill/p8/run-{1..3}/diff.patch` + gr4 both arms; confirm still present after borrowed repo `git status` clean (nx p8 with_skill REUSED per OQ-1) | [OK] all arms | [OK] green |
| req 3 | every applied refactoring has an oracle fidelity verdict | verdict-presence | grading record lists {book, refactoring name, pass/partial/fail} per claim per graded run; assert no claim lacks a verdict; verdict in the agent's own words | [OK] fidelity.json | [OK] green |
| req 4a | name/layer correct recorded, both arms | record-presence | correctness record has name-correct + layer-correct y/n per run per arm vs targets.json `expected_family`/`judgment` (sweeps: constituent per-target judgments) | [OK] name-layer.json | [OK] green |
| req 4b | behavior preserved (independent oracle) | test-green | nx: raw-jest differential vs ~15-fail baseline (no NEW failures); kata: `jest --ci approvals.spec.ts` vs pristine `main` snapshot | [OK] behavior.json | [OK] green |
| req 5 | 13-RESULTS.md tabulates both dims + empirical verdict | file + content | `test -f 13-RESULTS.md`; contains per-cell with_skill/invoke_skill vs no_skill for BOTH dims + Pass@k + a verdict sentence framed as empirical finding | [OK] 13-RESULTS.md + summary.json | [OK] green |
| req 6 | clean-room + hygiene + repo restoration | scan | `git -C <nx> status --porcelain` empty; `git -C <kata> status` clean on main; `rg -nP '[^\x00-\x7F]'` empty on committed artifacts; email allowlist-inversion (only approved gmail); no `.oracle/` path/prose committed | [OK] scans clean | [OK] green (1 WARNING) |

*Status: [ ] pending | [OK] green | [X] red | [!] flaky. "File Exists" [X] W0 = produced during Wave 0 / by the runs.*

### Audit evidence (retroactive Nyquist audit, 2026-07-15)

Verified against on-disk artifacts (no metered `claude -p` re-run; no behavior-oracle re-run; no `.oracle/` read):

- **req 1** -- 9 `no_skill` single-target runs on disk and git-tracked: nx `p1` (diff.patch 14.9-22.6 KB), nx `p2` (3.5-4.3 KB), kata `gr1` (15.5-16.1 KB); each `run-{1..3}/meta.json` present; all diff.patch non-empty.
- **req 2** -- sweep both arms tracked and non-empty: nx `p8/no_skill` (10.3-16.2 KB) + reused `p8/with_skill` (13.4-24.8 KB); kata `gr4/with_skill` (15.7-15.9 KB) + `gr4/no_skill` (15.9-16.0 KB); 18 net-new `meta.json` are git-tracked (`git status` clean -> survive borrowed-repo restore).
- **req 3** -- `book-authenticity/fidelity.json`: 63 records, 62 `pass` + 1 `n/a` (the p2 with_skill run-3 no-edit decline), **0 missing verdict**; every cell/arm represented (p1/p2/p8/gr1/gr4, both arms + kata invoke_skill); each record names book + refactoring + own-words `why`.
- **req 4a** -- `correctness/name-layer.json`: 33 records = 11 cell/arm groups x 3 runs; 32 name/layer-correct + 1 `n/a` decline; each cites its target (T1/T2/G1) or constituent sweep judgment.
- **req 4b** -- `correctness/behavior.json`: 33 records, **33/33 tests_green**, `oracle` = `nx-differential` (18) / `kata-jest-ci` (15); baselines wired and present on disk (`e2e-nx/behavior-baseline.json` 169 pass / 15 fail / 184; `e2e-gilded-rose/golden-master/approvals.spec.ts.snap`).
- **req 5** -- `13-RESULTS.md` (132 lines): Book-authenticity + Correctness tables, per-cell with_skill/invoke_skill vs no_skill, Pass@k, Caveats, empirical PARITY Verdict (direction + magnitude, not a pre-assumed win); `grading/summary.json` 11 rows, each with `passAt3` + `passHat3`.
- **req 6** -- `.oracle` path/prose: **none** in grading records / RESULTS / apply artifacts. Email allowlist-inversion across 185 committed files: only `larsbrinknielsen@gmail.com` present. No borrowed-repo source tree committed under the workspace. Borrowed-repo restoration (nx clean @ `fea2cabbcc` = origin/23.0.x; kata clean on `main`, throwaway branch deleted) confirmed by 13-05 + 13-VERIFICATION; not re-checked here to avoid disturbing the pristine repos. **WARNING (non-blocking):** the phase-13-authored output (grading records, RESULTS, baselines, 18 net-new runs) is ASCII-clean, but the REUSED prior-phase `with_skill`/`invoke_skill` `answer.md` transcripts (p1/p2/p8/gr1, ~13 files) carry non-ASCII punctuation (U+2014 em dash, U+2192 arrow, U+00D7 x, U+2026 ellipsis). These were committed in earlier phases/quick-tasks (p1/gr1 @ `4a61bbc`/`1fdcc88` 2026-07-10; p8 reused arm @ `cfcbfa5` 2026-07-14) and reused as graded-corpus INPUTS, not authored by phase 13. A corpus-wide `rg -nP '[^\x00-\x7F]'` is therefore NOT empty, contradicting the blanket "ASCII-clean" phrasing in 13-VERIFICATION. No grading verdict is affected. Follow-up (out of phase-13 scope): normalize the reused transcript `answer.md` to ASCII for public-repo hygiene.

---

## Wave 0 Requirements

- [X] No external test infrastructure to install -- both borrowed repos have node_modules; the `oracle`/`oracle-reviewer` agents and `run-e2e.mjs` are present.
- [X] Capture the behavior-oracle baseline ONCE per repo BEFORE grading edited-source runs: nx ~15-fail baseline on pristine `origin/23.0.x` (`behavior-baseline.json`: 169 pass / 15 fail); kata golden-master snapshot seeded from pristine `main` (`golden-master/approvals.spec.ts.snap`). Captured in 13-01.
- [X] Optional (discretion): a thin diff-to-claim normalizer helper -- handled inline (main-context normalized OUR output only into claims.json); no separate helper needed.
- [X] Optional (recommended): an unbiased from-scratch grading reviewer -- run in 13-05 Task 2; independently derived "parity" and confirmed DST-04 clean.

*Existing infrastructure covers all phase checks -- no framework install needed.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions | Resolution |
|----------|-------------|------------|-------------------|------------|
| The empirical verdict is framed as a finding (parity / delta w/ magnitude), not a pre-assumed skill win | req 5 | Editorial judgment on wording; not machine-checkable | Read the 13-RESULTS.md verdict sentence; confirm it states direction + magnitude and does not assert a win absent supporting per-cell data | **RESOLVED** -- 13-RESULTS.md states PARITY with direction + magnitude; the 13-05 unbiased reviewer independently derived parity from the per-cell numbers. |
| Oracle verdicts contain no source prose (DST-04) | req 3, req 6 | Semantic paraphrase check | Spot-read grading records; confirm each verdict is in the agent's own words, no near-verbatim book text | **RESOLVED** -- fidelity `why` fields are structural paraphrase; no `.oracle` path/prose in grading records; 13-05 unbiased reviewer confirmed no source prose. |

---

## Validation Sign-Off

- [X] All six SPEC requirements have an automated check or a Wave 0 dependency
- [X] Sampling continuity: behavior oracle runs per graded cell; Pass@k per cell (11 cells in summary.json)
- [X] Wave 0 baselines captured (nx 15-fail; kata pristine snapshot) before edited-source grading
- [X] No watch-mode flags (kata uses `--ci`; nx single-run raw jest)
- [X] Feedback latency < 180s per behavior-oracle run
- [X] `nyquist_compliant: true` set in frontmatter (post-execution, by /gsd-validate-phase)

**Approval:** COMPLIANT (2026-07-15). All 6 SPEC requirements have a satisfied, on-disk-backed validation check. One non-blocking WARNING on req 6: reused prior-phase `answer.md` transcripts carry non-ASCII punctuation (pre-existing, out of phase-13 authorship scope, no verdict impact). Phase-13-authored output is ASCII-clean, email allowlist-inversion clean, DST-04 clean. No metered eval or behavior-oracle re-run was performed (per mandate); coverage confirmed from committed artifacts.
