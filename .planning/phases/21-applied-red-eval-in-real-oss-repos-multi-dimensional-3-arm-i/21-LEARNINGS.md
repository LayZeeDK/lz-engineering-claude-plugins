---
phase: 21
phase_name: "applied-red-eval-in-real-oss-repos-multi-dimensional-3-arm-i"
project: "lz-engineering-claude-plugins"
generated: "2026-08-02"
counts:
  decisions: 6
  lessons: 7
  patterns: 7
  surprises: 6
missing_artifacts:
  - "21-UAT.md (none created; verification passed with no human_needed items)"
  - "21-REVIEW.md (no code review run for this phase)"
extraction_note: >-
  Extracted 2026-08-02, AFTER /gsd-secure-phase and /gsd-validate-phase, so it captures what those
  audits surfaced rather than a half-closed snapshot. The phase itself completed 2026-07-23. The
  "Post-Phase" section is separated deliberately: those items were measured after the phase closed,
  by the gated metered run and three quick tasks, and several of them CORRECT claims made in the
  phase's own artifacts. They are the most valuable part of this file.
---

# Phase 21 Learnings: applied-red-eval-in-real-oss-repos

## Decisions

### Build the whole instrument, run nothing metered (D-11 / D-12 / D-14)
All four plans built and deterministically proved the applied-RED instrument -- suite, correctness
gate, tabulator, selfcheck battery, results scaffold, RUN-GATE -- and spent zero metered tokens. The
Task-3 blocking-human gate was REACHED and surfaced, never crossed.

**Rationale:** The metered run spends real money and is user-gated (eval-run-approval-gate). Building
a ready-to-run instrument and halting keeps the phase zero-spend and leaves the spend decision with
the owner. Mirrors the Phase-11 (0.0.2) and Phase-20 precedent.
**Source:** 21-01..21-04 SUMMARY.md; RUN-GATE.md HALT banner

### Leave EVL-03 Pending despite phase completion
Every plan set `requirements_completed: []` and deliberately skipped `requirements mark-complete`.

**Rationale:** EVL-03 is an EMPIRICAL requirement -- it asserts what the eval measures, not that the
eval exists. Marking it Complete at build time would have been a false claim. This was the right call
at the time. See the Post-Phase section for how it later became the phase's one durable defect.
**Source:** 21-01/21-02/21-03/21-04-SUMMARY.md state-update notes

### The correctness gate reads structured runner JSON, never text
`classify()` decides from `testResults[].assertionResults[].status` and `failureMessages[]`, not from
scanning prose for vocabulary.

**Rationale:** Correctness is the ONE hard gate, so it must be immune to wording. Phase 20's headline
finding was that a deterministic phrase-set grader measures house VOCABULARY rather than substance and
false-fails a correct answer worded differently. Making this gate mechanical closes that whole class.
**Source:** 21-02-SUMMARY.md decisions; [[lz-red-evl02-substance-vs-vocabulary]]

### Differential tsc -- count NEW errors only
Baseline error set at the pristine worktree versus the with-test set; only the difference is
attributed to the produced test.

**Rationale:** The Gilded Rose kata's `Item` constructor is untyped, so a whole-project `tsc --strict`
is already non-zero. A naive absolute check would fail every produced test for a pre-existing defect
the model never touched.
**Source:** 21-02-SUMMARY.md; targets.json `strict_scope_note` (Pitfall 3)

### Reuse the lz-refactor driver via one surgical parameterization, never a fork
`run-e2e.mjs` gained `SUITE.trackSkills` with the back-compat scalars (`usedRefactor`, `refactorHits`,
`usedTpp`, `tppHits`) retained and derived from the new hit map.

**Rationale:** A fork doubles the maintenance surface of the most load-bearing script in the eval
estate. Keeping the back-compat scalars meant the lz-refactor suites composed byte-identically, which
was asserted by a dedicated regression crux rather than assumed.
**Source:** 21-01-SUMMARY.md; selfcheck-red crux 6

### Steer the discriminating target at the gate, do not hard-lock it at plan time (D-01)
`targets.json` carries a 7-point qualification checklist; the second and third OSS targets are
confirmed or nominated by the owner at the run gate, with a package-legitimacy gate on any newly
nominated repo before vendoring or `npm install`.

**Rationale:** Target quality is the single biggest determinant of whether the eval measures anything,
and it is a judgement best made with fresh eyes at spend time. The legitimacy gate is the supply-chain
mitigation (T-21-SC) and is never auto-approvable.
**Source:** 21-01-SUMMARY.md; RUN-GATE.md Step 1

## Lessons

### Pin the runner's ACTUAL JSON shape before writing the classifier
The RESEARCH sketch assumed a shape. The empirical pin against six fixtures showed it was wrong in a
load-bearing way, and the classifier was written to the real shape instead.

**Why it matters:** Had the assumed shape shipped, two of seven classes would have been
indistinguishable and the gate would have mis-scored silently. Probing cost minutes; the defect would
have cost a whole round.
**Source:** 21-02-SUMMARY.md "Pinned runner-JSON findings"

### Commit fixtures BEFORE the script whose selfcheck consumes them
The plan listed the script first; execution committed the fixtures first.

**Why it matters:** It makes the script's own commit immediately verifiable -- green AT that commit --
rather than landing a script whose selfcheck cannot yet run. A deliberate, documented ordering
deviation that improved the history.
**Source:** 21-02-SUMMARY.md deviations

### Gate on exit status, never on log text and never on a trailing `echo $?`
`check-red-references.mjs` prints its check count even when RED, and `cmd; echo "EXIT=$?"` always
exits 0.

**Why it matters:** Both are fail-OPEN legs that report success while the thing under test failed.
This has now recurred across several sessions, including during this extraction session. The only
reliable form is `cmd; test $? -eq 0 && echo TOKEN`.
**Source:** 21-04-SUMMARY.md; 260801-sc9 plan-checker findings; 2026-08-02 session

### `npm run check` is NOT the battery
The `check` script runs ONLY `check-red-references.mjs`; `extract-samples.mjs` and `check-evals.mjs`
must be invoked separately.

**Why it matters:** "I ran the check script and it was green" is a false all-clear covering one third
of the battery. 21-04 ran all three explicitly and said so.
**Source:** 21-04-SUMMARY.md Task 1

### A phase gate can pass while the instrument grows past its own selfcheck
Phase 21 verified that all THREE own-skill arms compose and are parity-asserted. Later work added two
more arms reachable only via a separate token, and the selfcheck never covered them -- so 2 of 5 arms
had no parity assertion at all, while the phase's verification remained literally true.

**Why it matters:** Requirements pin a NUMBER ("all three arms") and instruments grow. A coverage
assertion should be written against "every arm the harness can run", not against today's count.
**Source:** 21-VALIDATION.md (nyquist audit, 2026-08-02)

### Deliberate "Pending" becomes drift the moment the gated event happens
Leaving EVL-03 Pending was correct at build time and was reaffirmed by four separate plans. Nothing
updated it when the metered run actually ran, so six artifacts described a completed round as
outstanding for over a week.

**Why it matters:** A status that is only ever written by the step that DEFERS it will never be
cleared by the step that RESOLVES it. Build-then-halt needs a matching "on run completion, reconcile
the status" action, or the honesty of the deferral decays into a lie.
**Source:** 2026-08-02 reconciliation; REQUIREMENTS.md drift notice

### TypeScript 6.x rejects command-line files when a tsconfig is present
TS 6.0.3 emits TS5112; the fixture invocation must pass `--ignoreConfig` plus explicit compiler
options mirroring the workspace tsconfig.

**Why it matters:** Discovered by an empirical probe before the classifier was finalized. A toolchain
version bump can break a gate in a way that looks like a test failure.
**Source:** 21-02-SUMMARY.md issues

## Patterns

### Differential-tsc NEW-errors-only
Baseline versus with-change set-difference, so a repo with pre-existing type debt does not sink a
verdict about newly added code. Reusable for any "did this change introduce type errors" gate.

### Runner-JSON classifier over vocabulary scanning
Decide mechanically from the test runner's structured output. Immune to phrasing, and therefore
immune to the grader-artifact failure mode that inflated a prior eval roughly threefold.

### Selfcheck-only fixtures, with reports written to a temp dir
Fixtures are never eval targets, and `--outputFile` points outside the fixture tree, so
`git status --porcelain fixtures/` stays empty after a run.

### Fail-closed gate integrity
An unreadable or empty diff, a garbled or keyless meta, or unparseable runner JSON THROWS rather than
silently scoring "no change". Verified by runtime probe (9 of 9 paths) rather than by reading.

### One pure function shared by the real path and the selfcheck
`aggregate()` in the tabulator and `classify()` in the grader are pure and shared, so the offline
proof exercises the exact code the metered run will.

### Back-compat by derivation, asserted by a regression crux
When generalizing a shared script, derive the old scalars from the new structure and assert the old
consumers compose byte-identically -- do not merely believe they do.

### Non-vacuity: prove the check can FAIL
Every important assertion in this estate is driven in BOTH directions -- a poisoned prompt must be
caught, a collapsed lever must be reported. A green check that has never been shown to fail is not
evidence.

## Surprises

### `collection_error` and `no_tests` are byte-identical in vitest JSON
Both give `numTotalTests=0`, `status='failed'`, and an empty `assertionResults`. The ONLY discriminator
is `testResults[0].message`. This was the load-bearing discovery of 21-02 and is invisible without an
empirical pin.

### The kata's own type debt would have failed every produced test
The untyped `Item` constructor means a pristine `tsc --strict` is already non-zero -- which is exactly
why the differential design exists rather than an absolute check.

### A cell designed to discriminate can sit at a measured ceiling
Post-phase, the D-12 discriminator was correct on 21 of 21 runs across all arms. The cause is
structural: the shipped skill the BASELINE arm loads already contains both the decision rule and a
worked example whose answer IS the cell's answer. A skill cannot be shown to beat a baseline that is
reading the answer out of that same skill.

### A six-dimension tie can be an unadministered treatment
Round 1 of the D-12 A/B tied on every dimension and was reported as a result. An unbiased audit then
found the treatment arm never opened the taxonomy in any of its six runs -- the dose was zero, so the
round measured retrieval rather than content and could support no conclusion at all.

### A verdict's stated reason can be false
The forcing arm's 4-of-6 was attributed to detecting a runtime error. Nothing detected anything: a
not-implemented throw matched neither regex and failed by fail-closed DEFAULT, penalising a form the
skill under test explicitly endorses.

### A canary firing can be the operator's own fault
During this extraction session a battery came back RED on the leftover-worktree canary. The leftover
was created by a duplicate run killed mid-crux, whose teardown never executed. The canary was correct;
the operator was the defect.

## Post-Phase: what the instrument taught once it ran

Separated because these were measured AFTER 2026-07-23 and several correct the phase's own claims.

### The round ran, and the numbers are grader-regime-invariant
The metered round ran 2026-07-27/28 (36 runs, $29.05) across GRC/RXF/RXL/SRVC. On 2026-08-02 all 36
captures were re-graded under a grader that had since gained a `blunt_red` class and a widened
`verdictPass()`: ZERO verdict changes. The published numbers stand. Cost: nothing, because grading is
local -- which makes "re-grade before you re-run" the cheapest possible way to test a regime worry.

### $4.11 spent to avoid $27 is the best trade this instrument has made
A pre-registered 3-run pilot, with its decision rule committed BEFORE the pilot ran, returned N=3 of 3
and closed the question: the ceiling held, and the round was not bought. Pre-registration is what made
the answer un-rationalisable after the fact.

### "Not tested" is not "no effect", and the difference is the whole point
FUT-TAXONOMY-SHARED remains OPEN with status NOT-YET-TESTED. Two rounds failed to test it -- the first
because the dose was zero, the second because the baseline is saturated. Recording either as a null
would have retired a live hypothesis on no evidence.

### The audits found real defects that the phase's own verification could not
`gsd-security-auditor` closed 9 of 9 threats but only by checking that the supply-chain gate was
APPLIED at every entry point, not merely documented. `gsd-nyquist-auditor` returned PARTIAL and found
the unasserted arms. Both were reached by the dedicated agent rather than the workflow's inline
short-circuit -- and the short-circuit would have passed both phases cleanly.

### The auditor's first fix failed its own mutation test
The extended parity crux initially waved through a lever collapsed onto `plugins/lz-tdd` via a
forward-slash spelling, because it used a raw string compare. Caught by the mutation the auditor wrote
against itself, then fixed with path-form-insensitive comparison. The mutation is the evidence; the
green run never was.

### Guaranteeing a treatment dose costs arm-length parity
Inlining the taxonomy to guarantee delivery took the arms to 167 / 174 / 282 lines. This cannot be
fixed -- you cannot guarantee the dose and hold length constant at once -- so any treatment effect
measured on this cell must be reported as confounded with length and position.
