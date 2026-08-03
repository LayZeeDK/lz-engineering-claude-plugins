---
phase: 21
slug: applied-red-eval-in-real-oss-repos-multi-dimensional-3-arm-i
status: verified
nyquist_compliant: true
wave_0_complete: true
created: 2026-07-22
validated: 2026-08-02
---

# Phase 21 -- Validation Strategy

> Per-phase validation contract for feedback sampling during execution. This phase's
> "feature" is the eval INSTRUMENT itself, so validation maps each EVL-03 sub-criterion
> to the deterministic OFFLINE gate that proves it BEFORE the user-gated metered run.
> The instrument is Nyquist-covered when the full battery + the new selfchecks exit 0
> with zero spend and the borrowed repos are left pristine. (Source: 21-RESEARCH.md
> "## Validation Architecture".)

**Audited post-execution 2026-08-02 by `gsd-nyquist-auditor`** (independent fresh-context
audit; the orchestrator did not reach this verdict inline). The audit returned PARTIAL,
closed one real coverage gap in test code, and escalated four artifact corrections that are
applied below. `nyquist_compliant: true` is set only AFTER those corrections, because two
rows were claiming automated coverage that does not exist -- setting the flag over them
would have overstated coverage.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Node ESM selfcheck scripts (assert-and-exit; no test framework) -- the established workspace pattern (`selfcheck-code-review.mjs`, `grade-run.mjs --selfcheck`, `merge-judge.mjs --selfcheck`). The absence of a test framework is by design, not a gap. |
| **Config file** | none (scripts self-contained); deterministic battery adds `grade-red.mjs` / `tabulate-mechanical-red.mjs` / `selfcheck-red.mjs` |
| **Quick run command** | `node .claude/skills/lz-red-workspace/grade-red.mjs --selfcheck` (or the single touched script's `--selfcheck`) -- seconds, and the right gate after a single task commit |
| **Full suite command** | `node .claude/skills/lz-red-workspace/grade-red.mjs --selfcheck && node .claude/skills/lz-red-workspace/tabulate-mechanical-red.mjs --selfcheck && node .claude/skills/lz-red-workspace/merge-judge.mjs --selfcheck && node .claude/skills/lz-red-workspace/selfcheck-red.mjs` (all exit 0, zero spend) |
| **Estimated runtime** | **CORRECTED 2026-08-02.** Per-script `--selfcheck` gates remain seconds. The FULL battery does NOT: `selfcheck-red.mjs` grew from 363 lines / 6 cruxes to 3152 lines / 11 cruxes and now provisions real toolchains for three suites, so a full run takes MINUTES and has been observed to exceed 600 s. The original "~30-60 seconds" figure was written at plan time and is false. |

---

## Sampling Rate

- **After every task commit:** Run the touched script's `--selfcheck` (seconds).
- **After every plan wave:** Run the full battery + `claude plugin validate .`.
- **Before `/gsd:verify-work`:** Full battery green AND borrowed repos pristine
  (`git status --porcelain` clean) AND `plugins/lz-tdd` untouched.
- **Max feedback latency:** seconds for the per-task gate; MINUTES for the full battery
  (may exceed 600 s). The sampling discipline still holds because the per-task gate -- the
  one that runs most often -- stayed fast; only the wave-level gate got slow.

Gate every one of these on EXIT STATUS (`cmd; test $? -eq 0 && echo TOKEN`). Never on log
text: `check-red-references.mjs` prints its check count even on a RED battery, and a
trailing `echo $?` launders the status to 0.

---

## Per-Task Verification Map

Automated rows only. A row belongs here only if it has a command that runs green; anything
verified by reading lives in Manual-Only below.

| Req ID | Behavior | Wave | Test Type | Automated Command | Status |
|--------|----------|------|-----------|-------------------|--------|
| EVL-03.1 | Prompt byte-identical across arms except path; non-leading bodies | 0 | unit (dry-run argv) | `node selfcheck-red.mjs` (crux 1+2, now including `--arm d12`) | green |
| EVL-03.2 | Own-skill arms compose correctly (plugin-dir, slash-prefix) | 0 | unit (dry-run argv) | `node selfcheck-red.mjs` (composition crux, now including `--arm d12`) | green |
| EVL-03.3 | Correctness classifier decides `genuinely_red` vs the other classes (tsc --strict differential + runner JSON) | 0 | unit (fixtures) | `node grade-red.mjs --selfcheck` | green (9 classes, grown from the planned 7) |
| EVL-03.4 | Mechanical dims + Pass@k / Pass^k tabulate from meta + red-grade | 0 | unit (fixtures) | `node tabulate-mechanical-red.mjs --selfcheck` | green |
| EVL-03.5 (merge/verify half) | Fail-closed judge merge + verify mechanism exists and works | 0 | unit | `node merge-judge.mjs --selfcheck` | green -- see the scope caveat below |
| EVL-03.6 | No `plugins/lz-tdd` dependency; byproducts git-ignored; borrowed repos pristine | 0 | integration | full battery, then `git status --porcelain`, `git status --porcelain plugins/lz-tdd`, and kata `--git-dir` porcelain | green |

*Status: pending / green / red / flaky*

**Scope caveat on EVL-03.5.** `merge-judge.mjs` is EVAL-02 machinery, reused. It merges
`grade-run.mjs` preliminaries for the lz-tpp behavior eval and consumes no RED apply
artifact. Green here means "a fail-closed merge/verify mechanism exists and works", NOT
"the RED pipeline is wired into it". Stated explicitly so a future reader does not
over-credit this row.

### Coverage gap found and closed at audit (EVL-03.1 / .2)

At audit start these two rows were **PARTIAL, not COVERED**. `selfcheck-red.mjs` contained
zero references to `invoke_treatment`, `invoke_forcing` or `d12` (confirmed by two
independent zero-match searches). Its parity and composition cruxes drive `--arm all`,
which expands to the legacy trio `{with_skill, no_skill, invoke_skill}` only
(`run-e2e.mjs:1027-1031`). Two further own-skill arms were added after the phase closed, by
quick task `260802-j03`, reachable only via a `--arm d12` token -- so 2 of the 5 own-skill
arms the harness can run had NO composition and NO parity assertion at all.

The requirement text says "all THREE own-skill arms", so a lawyer's reading passed. The
intent -- every arm that can be run is parity-asserted -- did not.

Closed by extending crux 1+2 in `selfcheck-red.mjs` (+164/-2, test code only):

- drives `--arm d12` for every (suite, prompt, mode) triple the existing crux covers
  (3 suites x 6 prompts x 2 modes);
- asserts each d12 arm's argv is byte-identical to the `--arm all` `invoke_skill` baseline
  EXCEPT the `--plugin-dir` value -- one comparison that pins prompt bytes, model, effort,
  tool policy, and that the arm token itself changes nothing;
- asserts the three trees are three distinct paths and that neither lever resolves to
  `plugins/lz-tdd` -- the "silently degrades into a second `invoke_skill` baseline" failure
  that `run-e2e.mjs:50-62` warns about, which both `LZ_TREATMENT_DIR` and `LZ_FORCING_DIR`
  make reachable with no code change;
- drives the rule in BOTH directions per this file's non-vacuity convention: a
  forced-collapse env override and a tampered argv token must each be reported.

**The first version of this fix failed its own mutation test**, which is why the check is
trustworthy. A `LZ_FORCING_DIR` set to a forward-slash spelling of `plugins/lz-tdd`
produced a fully collapsed lever that a raw string compare waved through (exit 0). Fixed
with a path-form-insensitive `samePath()`; the mutation now exits 1. A second mutation
(`LZ_TREATMENT_DIR` pointed at the forcing tree) exits 1 with "the two levers collapse into
one". A passing battery proves nothing unless the check can fail, so both mutations are the
evidence, not the green run.

---

## Wave 0 Requirements

All complete; each item's gate runs green.

- [x] `grade-red.mjs` + its `--selfcheck` and `fixtures/{red,green,compile,collect,notest}/`. Covers EVL-03.3.
- [x] `tabulate-mechanical-red.mjs` + `--selfcheck` over fixture `meta.json` + `red-grade.json`. Covers EVL-03.4.
- [x] `selfcheck-red.mjs` (composition, worktree base build/teardown, transcript parse, classifier crux, prompt parity). Covers EVL-03.1 / .2.
- [x] The `run-e2e.mjs` edit (skill-name parameterization off `suite.json`) + the regression assertion that the lz-refactor suites still compose unchanged (crux 6, verified green).
- [x] gitignore lines for the new suite's results tree.
- [x] EVAL-RESULTS.md scaffold. Covers EVL-03.7 as a DOCUMENT, verified by reading -- see Manual-Only.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| The metered 3-arm apply RUN and its empirical Pass@k / judge / oracle-reviewer verdicts | EVL-03.5 (verdicts) / EVL-03.7 (results) | Requires metered spend behind a blocking-human gate, and the verdict is an LLM judgement rather than a deterministic assertion. No offline work converts this into an automated command. | Present the ready-to-run gated commands; run only on fresh explicit approval, then fill EVAL-RESULTS.md + the unbiased-reviewer slot |
| Blinded-test-code judge INPUT is documented in the results scaffold | EVL-03.5 (emission half) | **No such emission exists and none was ever built.** The RED run tree emits `answer.md` / `diff.patch` / `meta.json` / `red-grade.json` only. `21-03-PLAN.md:24` had already softened the must-have to "the results scaffold DOCUMENTS the blinded-test-code judge input" -- a plan-time scope reduction, not an execution miss. Verified by reading the scaffold. | Read the EVAL-RESULTS.md scaffold and confirm it documents what the judge is given |
| EVAL-RESULTS scaffold structure: Pass@k / Pass^k tables, reserved unbiased-reviewer slot, substance-only headline | EVL-03.7 | Documentation verification. The draft itself specified "manual review of the scaffold"; there is no command and inventing one would be brittle against a living 38 KB results document that now carries real numbers. | Read the scaffold and confirm the three structural elements are present |

*The BUILD sub-criteria (EVL-03.1-.4, .6, and the .5 merge/verify half) close in this phase
offline. The RUN sub-criteria (.5 verdicts, .7 results) close in a later, freshly-approved
step -- the same "build complete; empirical run gated" shape as EVL-01 / EVL-02.*

**Why the previous wording was replaced.** The row formerly read "not run in this phase" --
a statement about phase execution state, which is why it went stale the moment rounds
landed. The durable reason is the one now recorded: metered spend behind a blocking-human
gate, plus a non-deterministic verdict. Rewording it means the row stops needing
maintenance every time a round runs.

---

## Follow-Ups Recorded by the Audit (not phase-21 gaps)

1. **No staleness check on the generated treatment / forcing trees.** `build-treatment.mjs`
   asserts content-distinctness and source-untouched only when the operator rebuilds. The
   new crux catches a COLLAPSED or MISSING-path arm, but not a tree built against an older
   `plugins/lz-tdd`. Hashing the generated trees against the current source is the natural
   next guard. Belongs to quick `260802-j03`, not phase 21.
2. **Stale `.gitignore` comment.** The comment near line 64 states the grader drives
   `os.tmpdir()` worktrees; it now derives onto the target repo's own volume
   (`D:\.lz-red-grade-tmp`). Still outside the checkout, so the EVL-03.6 invariant holds --
   only the stated mechanism is stale.
3. **New byproduct class since the phase closed.** `out/lz-tdd-{treatment,forcing}` are
   generated plugin trees; `git check-ignore` confirms `out/` covers them, and
   `build-treatment.mjs` hashes `plugins/lz-tdd` before and after (`0 written`) and refuses
   any destination not ending in `out/<name>`, so EVL-03.6 holds for the new arms too.

---

## Validation Sign-Off

- [x] All Wave-0 tasks have a `--selfcheck` verify or a deterministic battery command
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references (the 3 scripts + fixtures + scaffold)
- [x] No watch-mode flags
- [x] Feedback latency: per-task gate in seconds; full battery in minutes (figure corrected 2026-08-02, the plan-time "< 60s" claim was false)
- [x] Rows verified by reading moved out of the automated map into Manual-Only
- [x] `nyquist_compliant: true` set in frontmatter (post-execution, by /gsd-validate-phase)

**Approval:** verified 2026-08-02
