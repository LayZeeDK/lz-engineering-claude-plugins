---
phase: 13
slug: lz-refactor-vs-base-opus-eval-book-authenticity-correctness
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-07-15
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
| req 1 | no_skill single-target diffs exist (or explicit no-edit meta) | disk-artifact | for p in p1 p2 (nx) + gr1 (kata), k in 1..3: `test -f results/apply/no_skill/$p/run-$k/meta.json` (diff.patch non-empty OR meta records no-edit) | [X] W0 (needs runs) | [ ] pending |
| req 2 | sweep diffs persisted + survive borrowed-repo restore | disk-artifact | `test -s results/apply/no_skill/p8/run-{1..3}/diff.patch` + gr4 both arms; confirm still present after borrowed repo `git status` clean (nx p8 with_skill REUSED per OQ-1) | [OK] p8 with_skill; [X] rest | [ ] pending |
| req 3 | every applied refactoring has an oracle fidelity verdict | verdict-presence | grading record lists {book, refactoring name, pass/partial/fail} per claim per graded run; assert no claim lacks a verdict; verdict in the agent's own words | [X] (needs grading) | [ ] pending |
| req 4a | name/layer correct recorded, both arms | record-presence | correctness record has name-correct + layer-correct y/n per run per arm vs targets.json `expected_family`/`judgment` (sweeps: constituent per-target judgments) | [X] (needs grading) | [ ] pending |
| req 4b | behavior preserved (independent oracle) | test-green | nx: `nx test eslint-plugin` differential vs ~15-fail baseline (no NEW failures); kata: `jest --ci approvals.spec.ts` vs pristine `main` snapshot | [OK] commands ready | [ ] pending |
| req 5 | 13-RESULTS.md tabulates both dims + empirical verdict | file + content | `test -f 13-RESULTS.md`; contains per-cell with_skill/invoke_skill vs no_skill for BOTH dims + Pass@k + a verdict sentence framed as empirical finding | [X] (to author) | [ ] pending |
| req 6 | clean-room + hygiene + repo restoration | scan | `git -C <nx> status --porcelain` empty; `git -C <kata> status` clean on main; `rg -nP '[^\x00-\x7F]'` empty on committed artifacts; email allowlist-inversion (only approved gmail); no `.oracle/` path/prose committed | [X] (check post-phase) | [ ] pending |

*Status: [ ] pending | [OK] green | [X] red | [!] flaky. "File Exists" [X] W0 = produced during Wave 0 / by the runs.*

---

## Wave 0 Requirements

- [ ] No external test infrastructure to install -- both borrowed repos have node_modules; the `oracle`/`oracle-reviewer` agents and `run-e2e.mjs` are present.
- [ ] Capture the behavior-oracle baseline ONCE per repo BEFORE grading edited-source runs: nx ~15-fail baseline on pristine `origin/23.0.x`; kata golden-master snapshot seeded from pristine `main` (no `.snap` committed).
- [ ] Optional (discretion): a thin diff-to-claim normalizer helper if manual reads of multi-file sweep diffs prove noisy.
- [ ] Optional (recommended): an unbiased from-scratch grading reviewer to catch grader bias on the verdict (unbiased-review-beats-primed).

*Existing infrastructure covers all phase checks -- no framework install needed.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| The empirical verdict is framed as a finding (parity / delta w/ magnitude), not a pre-assumed skill win | req 5 | Editorial judgment on wording; not machine-checkable | Read the 13-RESULTS.md verdict sentence; confirm it states direction + magnitude and does not assert a win absent supporting per-cell data |
| Oracle verdicts contain no source prose (DST-04) | req 3, req 6 | Semantic paraphrase check | Spot-read grading records; confirm each verdict is in the agent's own words, no near-verbatim book text |

---

## Validation Sign-Off

- [ ] All six SPEC requirements have an automated check or a Wave 0 dependency
- [ ] Sampling continuity: behavior oracle runs per graded cell; Pass@k per cell
- [ ] Wave 0 baselines captured (nx 15-fail; kata pristine snapshot) before edited-source grading
- [ ] No watch-mode flags (kata uses `--ci`; nx single-run)
- [ ] Feedback latency < 180s per behavior-oracle run
- [ ] `nyquist_compliant: true` set in frontmatter (post-execution, by /gsd-validate-phase)

**Approval:** pending
