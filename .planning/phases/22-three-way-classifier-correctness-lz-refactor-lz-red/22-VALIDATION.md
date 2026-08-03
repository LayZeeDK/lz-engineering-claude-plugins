---
phase: 22
slug: three-way-classifier-correctness-lz-refactor-lz-red
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-08-03
---

# Phase 22 -- Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> Derived from `22-RESEARCH.md` section `## Validation Architecture`.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Node-builtins checker battery per workspace (`npm run check`) plus per-script `--selfcheck` modes plus orchestrator-run subagent reviews. No test runner, no framework, no config file (CONVENTIONS.md) |
| **Config file** | `.claude/skills/lz-red-workspace/package.json` and `.claude/skills/lz-refactor-workspace/package.json` (`scripts.check`) |
| **Quick run command** | `node .claude/skills/lz-red-workspace/tools/check-rgr-routing.mjs` (the new gate alone, < 2s) |
| **Full suite command** | `npm --prefix .claude/skills/lz-red-workspace run check && npm --prefix .claude/skills/lz-refactor-workspace run check && claude plugin validate .` |
| **Estimated runtime** | quick < 2s; full battery can exceed 600s (it grew to 3152 lines during Phase 21 -- the plan-time "< 60s" claim was corrected as false and must not be reintroduced) |

**Measured pre-phase baseline** (research session, HEAD `e01201a`): lz-red battery exit 0 at 125
checks equal to the predicted literal, all 13 new labels present, none of the 64 retired labels
surviving; `check-hygiene.mjs` exit 0 at `files: 197`; `claude plugin validate .` and `--strict`
both exit 0.

---

## Sampling Rate

- **After every task commit:** `node .claude/skills/lz-red-workspace/tools/check-rgr-routing.mjs`
  plus that task's own `--selfcheck` (each < ~5s).
- **After every plan wave:** both workspace batteries plus `claude plugin validate .`
  (`npm --prefix ... run check` twice, exit 0 each).
- **Phase gate:** full battery GREEN, `validate .` exit 0, every `--selfcheck` GREEN, the widened
  hygiene scope proven non-vacuous by its file count, the ORCHESTRATOR's unprimed acceptance review,
  and BOTH metered rounds presented and HALTED.
- **Max feedback latency:** quick gate < 2s. The full battery is NOT latency-bounded -- do not
  re-assert a numeric ceiling for it.

---

## Per-Task Verification Map

Task IDs fill in once `22-0N-PLAN.md` files exist. The requirement-to-check mapping below is the
contract those tasks must satisfy.

| Req | Behavior | Test type | Automated command / label | Exists? |
|-----|----------|-----------|---------------------------|---------|
| CLS-01 | Every corpus case has exactly one named owner; no bare catch-all terminal on any in-scope classifier surface | unit (parsed table) | `check-rgr-routing.mjs` -> `exhaustive` + `no bare catch-all` labels | NO -- Wave 0 |
| CLS-01 | The guard fails when a catch-all returns, a positive branch is deleted, a heading is renamed, or the target file vanishes; and does NOT fail on an incidental mention or a reworded-but-correct branch | unit (mutation, both directions) | `check-rgr-routing.selftest.mjs` -- 8 mutations incl. the anti-vacuity control | NO -- Wave 0 |
| CLS-02 | No corpus case is claimed by two of the step-1 procedures | unit (parsed table) | `check-rgr-routing.mjs` -> `at-most-one` label | NO -- Wave 0 |
| CLS-02 | Test-code ownership follows the ask (the two test-code corpus cases route to different owners) | unit (corpus) | same checker, two distinct corpus rows | NO -- Wave 0 |
| CLS-03 | Zero routing or mode-selection branches key on test state, across all in-scope surfaces | unit (parsed table) | same checker -> `single-axis` label, with positive AND negative control in the selftest | NO -- Wave 0 |
| CLS-03 | `lz-refactor/SKILL.md` step 6's sweep rule cites a rule step 1 actually contains | unit (region-scoped) | same checker -> `citation resolves` label | NO -- Wave 0 |
| CLS-04 | The guard fails closed on a missing canonical location; no `existsSync` skip anywhere in it | unit (mutation) | selftest mutation: delete the target, expect exactly one attributable FAIL | NO -- Wave 0 |
| CLS-04 | `check-red-references.mjs` label arithmetic is untouched | regression | lz-red battery roster label still reads 125 checks / 13 new labels / 64 retired absent | YES -- assert unchanged |
| CLS-05 | The three variant trees exist, differ from `plugins/lz-tdd` exactly as declared, and carry BYTE-IDENTICAL `description` frontmatter per skill | unit (build assertions) | `variants/build-variants.mjs` then `selfcheck-routing.mjs` | NO -- Wave 1/2 |
| CLS-05 | All three arms compose with distinct `--plugin-dir` values and byte-identical `-p` prompts | unit (dry-run argv) | `selfcheck-routing.mjs` | NO -- Wave 2 |
| CLS-05 | The destination grader classifies exactly-one / multi / none correctly, treats exclusion clauses as non-destinations, and refuses to emit a final grading while judge items remain | unit (fixtures) | `grade-routing.mjs --selfcheck` | NO -- Wave 2 |
| CLS-05 | Judge merge is fail-closed; the pre-aggregate gate blocks an unmerged run | unit | `merge-judge.mjs --selfcheck` | YES |
| CLS-05 | Pass@k / Pass^k compute correctly over fixtures | unit | `tabulate-mechanical-red.mjs --selfcheck` | YES -- assert unchanged after the new param |
| CLS-05 | Corpus and eval prompts derive from ONE source (one prompt file per case, ids matching) | unit | `selfcheck-routing.mjs` | NO -- Wave 2 |
| CLS-05 | ROUTING CORRECTNESS per arm, Pass@k / Pass^k, substance-only headline, read-rate per arm | MANUAL-ONLY (metered, HALT-gated) | presented in `e2e-rgr-routing/RUN-GATE.md`, never executed (D-14) | NO -- gated |
| D-06 / SC5 | Each `description` stays within the 1,536-char per-entry cap (measured today: lz-refactor 1233, lz-tpp 750, lz-red 1245) | unit | measurement assertion in the routing checker | NO -- Wave 0/1 |
| D-06 / SC5 | Trigger reciprocal specificity does not regress after the description edits | MANUAL-ONLY (metered, HALT-gated) | the reciprocal commands in `EVAL-RESULTS.md`, presented not run (D-14) | data exists, run gated |
| D-19 | Shipped tree ASCII-only, email allowlist-inversion clean, no-verbatim -- INCLUDING `plugins/lz-tdd/references/` | unit (widened scope) | `check-hygiene.mjs`, file count 197 -> 199+ | YES but SCOPE-INCOMPLETE -- widen in Wave 0 |
| D-19 | Eval-set shape + hygiene over the new suite's authored prose | unit (widened glob) | `check-evals.mjs` clause 8 | YES but glob is `e2e-red-*`-anchored -- widen |
| D-19 | Plugin structure legal | unit | `claude plugin validate .` and `--strict` | YES |
| D-18 / SC7 | All three shipped skills pass a fresh acceptance review with >= 1 from-scratch UNPRIMED reviewer | MANUAL-ONLY (ORCHESTRATOR) | orchestrator spawns reviewers after the executor returns; `gsd-executor` has no Agent tool | N/A -- process gate |

*Status legend: [ ] pending * [PASS] green * [FAIL] red * [WARN] flaky*

---

## Wave 0 Requirements

- [ ] `.claude/skills/lz-red-workspace/tools/check-rgr-routing.mjs` -- CLS-01..CLS-04. **ASSERTED RED against today's tree before any content lands.**
- [ ] `.claude/skills/lz-red-workspace/tools/check-rgr-routing.selftest.mjs` -- 8 mutations, both directions, including the anti-vacuity control
- [ ] `.claude/skills/lz-red-workspace/tools/lib/routing-parse.mjs` -- the `(condition -> destination)` parser, wrap-tolerant at branch scope
- [ ] `.claude/skills/lz-red-workspace/tools/lib/section-body.mjs` -- copied from the lz-refactor workspace (house convention is duplication; zero cross-workspace imports exist)
- [ ] the corpus JSON -- 9 cases, header declaring the reconstructed ones as RECONSTRUCTED
- [ ] `check-hygiene.mjs` scope widen to `plugins/lz-tdd/references/` + updated file-count assertion so the widen is provably non-vacuous
- [ ] `check-evals.mjs` clause-8 glob widen for the new suite dir
- [ ] `.gitignore` explicit lines for the new suite's run tree + rollup JSON
- [ ] `package.json` `scripts.check` wiring for `check-rgr-routing.mjs`

**Wave 2 (A/B instrument):** `variants/build-variants.mjs`, `grade-routing.mjs` + fixtures +
`--selfcheck`, `selfcheck-routing.mjs`, `e2e-rgr-routing/{suite.json,targets.json,prompts/,RUN-GATE.md}`,
`run-e2e.mjs` arm additions, `tabulate-mechanical-red.mjs` grade-file param.

---

## Coverage boundary -- stated explicitly

The deterministic layer proves the **authored classifier** is exhaustive, disjoint, and single-axis
over the corpus. It does **NOT** prove that a model **routes** correctly -- that is CLS-05's metered
eval, which is manual-only by D-14.

Do not let a GREEN battery be read as a routing-correctness verdict. This repo has recorded that
failure mode twice ("THE BATTERY IS NOT THE GATE", STATE.md 2026-07-29), and **this phase exists
because a 125/125 green battery coexisted with a non-exhaustive classifier.** The new checker's
header comment must say so in its own words.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Routing correctness per placement variant (the 3-arm A/B) | CLS-05 | Metered spend; HALT-gated on fresh owner approval (D-14) | `e2e-rgr-routing/RUN-GATE.md` presents the exact command; the executor never runs it |
| Trigger reciprocal specificity after the description edits | D-06 / SC5 | Metered spend; same gate | reciprocal commands recorded in `EVAL-RESULTS.md`; presented, not run |
| Fresh acceptance review of all three shipped skills | D-18 / SC7 | Requires independent subagent contexts; `gsd-executor` has no Agent tool | ORCHESTRATOR spawns >= 2 reviewers, >= 1 with a from-scratch unprimed brief, after the executor returns |
| `/reload-plugins` after the description edits | D-19 | Only the human operator can run it; committed is not live | Owner runs it before any trigger measurement is believed |

---

## Validation Sign-Off

- [ ] All tasks have an automated verify or a declared Wave 0 dependency
- [ ] Sampling continuity: no 3 consecutive tasks without an automated verify
- [ ] Wave 0 covers every MISSING reference above
- [ ] No watch-mode flags
- [ ] Quick-gate latency < 2s (full battery deliberately unbounded)
- [ ] Coverage boundary restated in the new checker's header
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
