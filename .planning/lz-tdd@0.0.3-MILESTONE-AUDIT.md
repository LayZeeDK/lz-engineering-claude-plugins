---
milestone: lz-tdd@0.0.3
milestone_name: lz-red Skill (RED phase)
audited: 2026-08-02
audited_head: 0ae7909
status: gaps_found
resolved_after_audit:
  - id: "SEAM-02"
    resolved_at: 2026-08-03
    commit: 50fb4ba
    how: >
      Owner elected to RE-LAND rather than descope. The cross-skill pointer section is back in
      plugins/lz-tdd/skills/lz-tpp/SKILL.md (+10/-0, additive-only), and the SEAM-02 guard that
      fc2f94b removed is restored in check-red-references.mjs (EXPECTED_CHECKS 123 -> 124), so the
      requirement cannot silently regress a third time. Guard mutation-tested: exit 1 with the
      pointers stripped, exit 0 with them present.

      NOT a verbatim restore. An unbiased from-scratch reviewer caught a routing defect in the
      original 51f76c2 text that had never been reviewed on its merits -- fc2f94b reverted that
      commit for SCOPE, not correctness, so the defect rode along untouched and a verbatim restore
      would have re-shipped it. The old wording routed on a negative catch-all ("with no failing
      test in hand yet -> lz-red") whose condition strictly contained the cleanup branch, so every
      cleanup-on-green request mis-routed to lz-red; it also swallowed lz-tpp's own Reference mode,
      defined as an explicit invocation "with no test to coach". Both branches now key on intent
      rather than test state, stated positively and scoped to coach mode. Reviewer re-gated: ACCEPT.
    requirement_status_now: satisfied
  - id: "DST-01"
    resolved_at: 2026-08-03
    commit: 50fb4ba
    how: >
      The CHANGELOG.md:33-35 claim that lz-tpp gained a reverse pointer became TRUE again with the
      re-land; no edit was required. Same for REQUIREMENTS.md's [x] SEAM-02 and Complete row. This
      is a property of restoring rather than descoping -- the descope path would have needed edits
      to both files.
    requirement_status_now: satisfied
status_if_reaudited: "passed on requirements (28/28); INT-02 remains open (dev-only stale instrument path)"
scores:
  requirements: 26/28   # 28/28 after 50fb4ba; see resolved_after_audit
  phases: 8/8
  integration: "2 BLOCKERs at audit time; INT-01 closed by 50fb4ba, INT-02 still open"
  flows: 2/3            # 3/3 after 50fb4ba
  nyquist: 8/8 compliant
gaps:
  requirements:
    - id: "SEAM-02"
      status: "unsatisfied"
      phase: "Phase 18"
      claimed_by_plans: ["18-01-PLAN.md", "18-04-PLAN.md"]
      completed_by_plans: ["18-02-SUMMARY.md", "18-04-SUMMARY.md"]
      verification_status: "passed (TRUE WHEN WRITTEN 2026-07-20; falsified by a later commit)"
      evidence: >
        The reverse `lz-tpp -> lz-red` pointer was shipped by commit 51f76c2 (18-04) and
        correctly verified in 18-VERIFICATION.md. It was then REVERTED by commit fc2f94b
        (quick task 260729-lc9, 2026-07-29) on the deliberate and defensible ground that
        "the 0.0.3 lz-red milestone must not modify already-shipped skills". Confirmed at
        HEAD: `git grep -e lz-red --or -e lz-refactor -- plugins/lz-tdd/skills/lz-tpp/SKILL.md`
        exits 1 (zero hits), and `git diff lz-tdd@0.0.2 HEAD -- plugins/lz-tdd/skills/lz-tpp/SKILL.md
        plugins/lz-tdd/skills/lz-refactor/SKILL.md` is EMPTY -- both files are byte-identical
        to the 0.0.2 tag. REQUIREMENTS.md was never reconciled and still carries `[x] SEAM-02`
        plus a `Complete` traceability row. The revert commit itself names the removed guard
        explicitly, so this is a bookkeeping miss, not a hidden regression.
    - id: "DST-01"
      status: "partial"
      phase: "Phase 19"
      claimed_by_plans: ["19-01-PLAN.md"]
      completed_by_plans: ["19-01-SUMMARY.md"]
      verification_status: "passed (TRUE WHEN WRITTEN 2026-07-21; one clause falsified by fc2f94b)"
      evidence: >
        plugin.json 0.0.3, marketplace.json three-skill listing, and README are all accurate
        and re-verified live. But DST-01 also requires the CHANGELOG to document lz-red
        truthfully, and CHANGELOG.md:33-35 asserts "`lz-tpp` gained a reverse pointer back to
        `lz-red` so the coach classifies the step before acting." That claim is FALSE of the
        shipped tree as of fc2f94b. This is the only user-facing false statement found in the
        audit and it ships in a published changelog.
  integration:
    - id: "INT-01"
      severity: "blocker"
      affects: ["SEAM-02", "DST-01"]
      issue: >
        The three-way seam is one-directional. lz-red/SKILL.md points forward to both siblings,
        and lz-refactor/SKILL.md points to lz-tpp (8 hits), but NEITHER lz-tpp nor lz-refactor
        names lz-red. This is the same defect the lz-tdd@0.0.2 audit already logged as tech debt
        ("fold a reverse link into the next lz-tpp touch"); 0.0.3 closed it in Phase 18 and then
        re-opened it in the lc9 revert.
    - id: "INT-02"
      severity: "blocker"
      affects: ["dev-only tooling; no shipped-surface impact"]
      issue: >
        `npm --prefix .claude/skills/lz-refactor-workspace run check` exits 1.
        `tools/check-backing.mjs` hardcodes `plugins/lz-tdd/skills/lz-refactor/references/
        beck-tdd-by-example.md`, but commit 23c8ee2 (2026-07-29) relocated that file to the
        plugin-wide `plugins/lz-tdd/references/beck-tdd-by-example.md`. The SHIPPED side of the
        relocation is correct -- both real consumers resolve (lz-red/SKILL.md:159 via
        `${CLAUDE_PLUGIN_ROOT}`, lz-refactor/references/principles.md:27 via `../../../`) -- and
        the sibling `check-crossrefs.mjs` guards the same path with `existsSync` and stays GREEN
        (718 links resolve). Only `check-backing.mjs` lacks the guard. 1 of ~10 sub-checks fails;
        every other checker in the battery is GREEN.
  flows:
    - id: "FLOW-01"
      severity: "blocker"
      flow: "Full red-green-refactor loop (red -> green -> refactor -> red)"
      breaks_at: "the return hops (lz-tpp -> lz-red and lz-refactor -> lz-red)"
      issue: >
        lz-red -> lz-tpp and lz-red -> lz-refactor are WIRED. Neither return hop has any
        in-skill routing text, so loop continuity rests entirely on each sibling's own
        auto-trigger description independently re-firing -- a materially weaker guarantee than
        an explicit pointer, and weaker than what CHANGELOG.md and the milestone goal describe.
tech_debt:
  - phase: "16-source-distillation-core-red-references / 17-assertion-design-stance-router"
    items:
      - "GSD process jargon leaks into two shipped, user-facing reference docs: naming.md:13 ('NAME-01 is wholly Phase 16') and test-structure-and-assertions.md:19 ('Phase 16 filled the test-STRUCTURE slice ... Phase 17 fills the assertion-design slice'). The automated stale-marker guard in check-red-references.mjs matches only /Phase 18/i (it was built for the VIT-02 17/18 split) and reports PASS, so this class is unguarded. Phase 19's Gate 2 recorded the same cosmetic finding and correctly declined to action it (touching SKILL.md would trigger the D-10 review + /reload-plugins cascade); it remains open."
  - phase: "21-applied-red-eval-in-real-oss-repos"
    items:
      - "21-VERIFICATION.md frontmatter is STALE at `status: human_needed`. Its blocking-human gate WAS cleared: the metered run landed 2026-07-27/28 (36 runs, $29.04, 4 cells), is fully written up with Pass@k/Pass^k, a mandatory from-scratch unbiased reviewer (11 findings, 5 blocking, all adopted), and was re-graded 2026-08-02 under the current grader with ZERO verdict changes. Only the report's frontmatter never got the forward-pointer addendum that 20-VERIFICATION.md received."
      - "Four LATENT grader findings recorded by the unbiased reviewer, not triggered by this corpus, deferred to any next round: rightReason regexes run over raw failureMessages including the code frame (model-authored text could flip a verdict); attributedAssertions matches on `title` not `fullName` (duplicate innermost titles could mis-attribute toward false-PASS); only producedTests[0] is executed (a second produced spec is silently unmeasured); changedProductionFiles would misclassify vite.config.ts or test/helpers.ts as production."
  - phase: "milestone-wide"
    items:
      - "The lz-tdd@0.0.3 git tag and GitHub Release are not yet cut. CHANGELOG.md's bottom link-ref intentionally points ahead to the not-yet-existing tag, matching the 0.0.1 / 0.0.2 precedent. Cut at milestone close."
      - "STATE.md frontmatter is stale: `status: verifying` and a `stopped_at` describing the Phase-21 halt, though the run completed and every phase closed. Its own last_activity_desc already narrates the completion."
      - "ROADMAP.md line 7 still reads '[IN PROGRESS] ... (Phase 21 applied eval in progress)' and line 198 reads 'Plans: 2/3 plans executed' for Phase 19, though the table below it and all three checkboxes show 3/3 Complete."
process_findings:
  - >
    The SEAM-02 drift is the SAME CLASS the milestone's own REQUIREMENTS.md DRIFT NOTICE
    (2026-08-02) documents for EVL-01/02/03, and it was missed BY that reconciliation pass.
    The notice's own second durable rule -- "never cite an existing status as precedent without
    verifying it" -- generalizes: the pass verified statuses that were falsely PENDING but did
    not check for statuses that were falsely COMPLETE. A revert that removes shipped content is
    exactly as invisible to a status field as a gated run that finally happens.
  - >
    Both blockers were introduced by post-phase QUICK TASKS (fc2f94b and 23c8ee2, both
    2026-07-29), after every phase VERIFICATION.md had already passed. No phase gate was wrong
    when written. The milestone has no mechanism that re-checks closed requirements against
    later quick-task commits, which is why an 8-for-8 phase-verification record coexists with
    two real blockers.
  - >
    ADDED 2026-08-03, surfaced while closing SEAM-02 and worth more than the fix itself.
    RESTORING A REVERTED COMMIT VERBATIM CARRIES FORWARD WHATEVER WAS WRONG WITH IT, and a revert
    made for SCOPE leaves the reverted content's CORRECTNESS unexamined. 51f76c2 shipped a routing
    paragraph with a branch-subsumption defect; it passed Phase 18's own unbiased review; fc2f94b
    then reverted it for being out of scope, which said nothing about whether it was right. When
    the owner reversed that scope call, the natural move -- re-apply the reverted diff -- would
    have silently re-shipped the defect, and every gate would have gone green, because the guard
    only asserts the two sibling names appear SOMEWHERE in the file. The defect was caught only
    because the re-land was put through a fresh from-scratch review rather than treated as a
    mechanical restore. DURABLE RULE: review a restore as new work, never as a revert-of-a-revert.
  - >
    RELATED GUARD-PRECISION NOTE (reviewer, 2026-08-03): the restored SEAM-02 guard greps for the
    substrings `lz-red` and `lz-refactor` anywhere in lz-tpp/SKILL.md. It proves the pointer EXISTS;
    it cannot see whether the routing rule is CORRECT, nor whether the seam is wired into the coach
    procedure. Do not read a green SEAM-02 check as evidence about the paragraph's content.
nyquist:
  compliant_phases: [15, 16, 17, "17.1", 18, 19, 20, 21]
  partial_phases: []
  missing_phases: []
  overall: compliant
security:
  phases_with_security_md: 8
  threats_open_total: 0
  overall: secured
---

# Milestone Audit: lz-tdd@0.0.3 -- lz-red Skill (RED phase)

**Audited:** 2026-08-02 at HEAD `0ae7909`
**Scope:** Phases 15, 16, 17, 17.1, 18, 19, 20, 21 (8 phases, 27 plans)
**Status at audit time:** `gaps_found` -- 26/28 requirements satisfied; 1 unsatisfied, 1 partial

> **UPDATE 2026-08-03 -- two of the three gaps are CLOSED; the body below is the point-in-time
> record and is left intact.** The owner elected to re-land the SEAM-02 reverse pointer rather than
> descope it (commit `50fb4ba`). That closed SEAM-02 (unsatisfied -> satisfied), DST-01 (partial ->
> satisfied, with no CHANGELOG edit needed since the claim became true again), INT-01, and FLOW-01.
> Requirements now stand at **28/28** and the full red-green-refactor loop is wired in both
> directions.
>
> The re-land was NOT verbatim. An unbiased reviewer caught a routing defect in the original Phase-18
> text -- a negative catch-all branch that mis-routed every cleanup-on-green request to lz-red and
> swallowed lz-tpp's own Reference mode. That defect shipped in `51f76c2`, passed Phase 18's own
> unbiased review, and survived `fc2f94b` because that revert was for SCOPE rather than correctness,
> so the paragraph had never been reviewed on its merits. See the process finding below.
>
> **INT-02 (the stale `check-backing.mjs` path) remains OPEN.** It is dev-only and does not affect
> the shipped product.

## Verdict in one paragraph

The lz-red skill itself is built, verified, hygienic, and empirically evaluated to a standard
well above the milestone's own bar. Every phase has a passing VERIFICATION.md, every phase is
Nyquist-compliant, every phase has `threats_open: 0`, all three empirical evals RAN with honest
documented bounds and unbiased reviewers, and `claude plugin validate . --strict` exits 0. The
milestone does **not** pass, for a narrow and specific reason: two post-phase quick tasks on
2026-07-29 changed the shipped tree, and the requirement bookkeeping was never reconciled to
them. One requirement (SEAM-02) is now false, and a published CHANGELOG line asserts a feature
that no longer ships. Neither is a defect in lz-red; both are drift between what shipped and
what the docs claim shipped.

## Requirements Coverage (3-source cross-reference)

Sources: phase `VERIFICATION.md` requirements tables, plan `SUMMARY.md` `requirements_completed`
frontmatter, and the `REQUIREMENTS.md` traceability table + checkboxes.

| REQ | Phase | VERIFICATION | SUMMARY fm | REQS.md | Final |
|-----|-------|--------------|-----------|---------|-------|
| SKL-01 | 15 | passed | listed | `[x]` | satisfied |
| SKL-02 | 15 | passed | listed | `[x]` | satisfied |
| SKL-03 | 15 | passed | listed | `[x]` | satisfied |
| SEL-01 | 16 | passed | listed | `[x]` | satisfied |
| SEL-02 | 16 | passed | listed | `[x]` | satisfied |
| STR-01 | 16 | passed | listed | `[x]` | satisfied |
| STR-02 | 16 | passed | listed | `[x]` | satisfied |
| ASRT-01 | 17 | passed | listed | `[x]` | satisfied |
| ASRT-02 | 17 | passed | listed | `[x]` | satisfied |
| ASRT-03 | 17 | passed | listed | `[x]` | satisfied |
| NAME-01 | 16 | passed | listed | `[x]` | satisfied |
| LAW-01 | 18 | passed | listed | `[x]` | satisfied |
| LAW-02 | 18 | passed | listed | `[x]` | satisfied |
| RTR-01 | 17 | passed | listed | `[x]` | satisfied |
| RTR-02 | 18 | passed | listed | `[x]` | satisfied |
| RTR-03 | 17 | passed | listed | `[x]` | satisfied |
| VIT-01 | 17 | passed | listed | `[x]` | satisfied |
| VIT-02 | 17+18 | passed (both clauses) | listed (18-05) | `[x]` | satisfied |
| SEAM-01 | 18 | passed | listed | `[x]` | satisfied |
| **SEAM-02** | 18 | passed (then falsified) | listed | `[x]` | **UNSATISFIED** |
| ANTI-01 | 17 | passed | listed | `[x]` | satisfied |
| ANTI-02 | 17 | passed | listed | `[x]` | satisfied |
| **DST-01** | 19 | passed (then partly falsified) | listed | `[x]` | **PARTIAL** |
| DST-02 | 19 | passed | missing | `[x]` | satisfied (manually verified) |
| DST-03 | 19 | passed | listed | `[x]` | satisfied |
| EVL-01 | 20 | passed (build) | `[]` w/ note | `[x]` | satisfied (run 2026-07-21) |
| EVL-02 | 20 | passed (build) | `[]` w/ note | `[x]` | satisfied (run 2026-07-22) |
| EVL-03 | 21 | `human_needed` (stale) | missing | `[x]` | satisfied (run 2026-07-27/28) |

**26 satisfied / 1 unsatisfied / 1 partial. Orphan check: none.** All 28 traceability IDs appear
in at least one phase VERIFICATION.md requirements table.

### Notes on the three matrix-ambiguous rows

These three resolved to `partial` by the mechanical matrix (VERIFICATION passed + SUMMARY
frontmatter missing) and were each promoted to `satisfied` on manual verification, as the
matrix directs:

- **DST-02** -- no plan SUMMARY lists it, but 19-VERIFICATION.md's requirements table marks it
  SATISFIED against Truths #11 and #14, and `19-GATE-RESULTS.md` (commit `d4751e0`) records the
  `plugin-validator` and `skill-reviewer` PASSes routed from their dedicated agents. Both
  `claude plugin validate .` and `--strict` were re-run live this audit and exit 0.
- **EVL-01 / EVL-02** -- deliberately `[]` in SUMMARY frontmatter with an inline note, because
  Phase 20 was a build-then-halt phase (D-11). Both empirical runs subsequently landed and are
  recorded with bounds in `.claude/skills/lz-red-workspace/EVAL-RESULTS.md`.
- **EVL-03** -- the only row whose VERIFICATION status is not `passed`. 21-VERIFICATION.md is
  frozen at `human_needed` because it was written 2026-07-23, four days BEFORE the gate was
  cleared. The gate WAS cleared and the run is complete (see below). The stale frontmatter is
  logged as tech debt, not as a gap.

### EVL-03: the human gate was cleared

`21-VERIFICATION.md` frontmatter still requests a human approval decision. That decision was
made and executed:

- **RUN COMPLETE 2026-07-27/28** -- 36 runs, 4 cells (GRC / SRVC / RXF / RXL), 3 arms, k=3,
  $29.04 total, user-approved at the metered gate after the required zero-spend canary passed.
- Substance-only headline, per D-08: **no correctness lift and no test-design lift from passive
  skill content; the baseline is at ceiling.** Pooled Pass@1 is 0.67 for all three arms after
  the corrections an independent audit could defend.
- Mandatory unbiased from-scratch reviewer ran, recomputed all 36 runs independently, returned
  11 findings (5 blocking), and **overturned four of the orchestrator's conclusions**. All five
  blocking findings were adopted into the writeup.
- Re-graded 2026-08-02 under the current grader (which had since gained a `blunt_red` class and
  a widened `verdictPass()`) with **zero verdict changes**, so the published numbers are
  grader-regime-invariant.

This is a genuinely negative result, honestly reported. It is not a milestone gap: EVL-03 asked
for a rigorous applied eval, not for a favourable one.

## Phase Verification Summary

| Phase | Status | Score | Nyquist | Security | Note |
|-------|--------|-------|---------|----------|------|
| 15 lz-red Scaffold & Description Boundary | passed | 10/10 | compliant | 0 open | -- |
| 16 Source Distillation & Core RED References | passed | 10/10 | compliant | 0 open | -- |
| 17 Assertion Design, Stance Router, TS/Vitest | passed | 14/14 | compliant | 0 open | -- |
| 17.1 Phase-16 Beck Follow-up (INSERTED) | passed | 10/11 | compliant | 0 open | 1 non-blocking doc-accuracy note, since corrected in ROADMAP |
| 18 Coach Procedure & lz-tpp Seam Wiring | passed | 11/11 | compliant | 0 open | SEAM-02 true when verified, later reverted |
| 19 Distribution & Hygiene | passed | 17/17 | compliant | 0 open | re-verified after closing a DST-02 gate |
| 20 Skill-Effectiveness Evals | passed | 20/20 | compliant | 0 open | carries a 2026-08-02 forward-pointer addendum |
| 21 Applied RED Eval (INSERTED) | **human_needed (stale)** | 7/7 BUILD | compliant | 0 open | gate cleared 2026-07-27/28; frontmatter never updated |

All 8 phases carry a VERIFICATION.md. No unverified phase.

## Cross-Phase Integration

Checked by `gsd-integration-checker`; every blocking claim independently re-verified by this
orchestrator against the live tree before being recorded.

### WIRED (verified)

| Wiring | Evidence |
|--------|----------|
| Manifest chain: marketplace.json `./plugins/lz-tdd` -> plugin.json `0.0.3` -> auto-discovered `skills/{lz-tpp,lz-refactor,lz-red}` | `claude plugin validate .` and `--strict` both exit 0 |
| Skill dir name == frontmatter `name`, all three skills | confirmed per skill |
| Progressive disclosure: SKILL.md -> all 10 reference files incl. the 3-leaf testing-stance router | `check-red-references.mjs` exit 0, 123 checks, "no dead relative link anywhere in the shipped tree" |
| RTR-01 cross-link: `testing-stance/seams-and-legacy.md` -> `../../../lz-refactor/references/refactoring-without-tests.md` | path arithmetic confirmed, target exists, cross-linked not copied |
| Plugin-wide `beck-tdd-by-example.md` relocation (23c8ee2), shipped side | file at `plugins/lz-tdd/references/`; both consumers resolve |
| lz-red -> lz-tpp (SEAM-01) and lz-red -> lz-refactor forward handoffs | SKILL.md steps 1 and 6 |
| lz-refactor -> lz-tpp seam | 8 mentions in lz-refactor/SKILL.md |
| Repo-wide link resolution | `check-crossrefs.mjs`: 718 links resolve, 20 inverse pairs mutual, no self-refs |
| No build-dependency leak into `plugins/` | no package.json / node_modules anywhere under `plugins/` |
| VIT-02 tsc --strict | `extract-samples.mjs` exit 0, 8 modules clean, 0 fences skipped |
| DST-03 hygiene | `check-hygiene.mjs` exit 0, 197 files ASCII + email-allowlist clean, no-verbatim clean |
| EVL-01 three-way boundary data | `check-evals.mjs` exit 0, 24 queries, 3 lz-tpp-seam + 3 lz-refactor-seam, reciprocal all-false byte-consistent |
| Grading machinery | `grade-run.mjs --selfcheck`, `grade-red.mjs --selfcheck`, `tabulate-mechanical-red.mjs --selfcheck` all exit 0 |
| Apply-harness crux battery | `selfcheck-red.mjs` exit 0 (all cruxes; see instrument note below) |
| E2E install/invoke | `/plugin marketplace add` -> `/plugin install lz-tdd@...` -> `/lz-tdd:lz-red` traceable end to end |

### BROKEN

**INT-01 (BLOCKER) -- the three-way seam is one-directional.** See the SEAM-02 gap above.
Independently confirmed at HEAD, not taken from the checker's report.

**INT-02 (BLOCKER, dev-only) -- `lz-refactor-workspace` battery exits 1.** Confirmed by
re-running it: `[FAIL] beck-tdd-by-example.md exists -- not found`, then
`PRIN-01/02/03 backing RED -- 2/3 references present, 1 check(s) FAILED`. `check-backing.mjs`
(last touched 2026-07-17) hardcodes the pre-relocation path with no `existsSync` guard, unlike
its sibling `check-crossrefs.mjs`, which guards the same path and stays GREEN. **The shipped
product is unaffected** -- this is a stale instrument, and the fix is a one-line path update.

### Instrument note -- `selfcheck-red.mjs` (resolved GREEN)

The integration checker reported this as inconclusive (it exceeded the subagent's time budget).
Re-run here to completion, where it initially FAILED on
`[crux 7:canary-rundir] stranded grading worktree director(ies)` naming
`D:\.lz-red-grade-tmp\red-wt-RXF-440-1785707485356`, timestamped 23:51 the same evening -- i.e.
debris left by the checker's own killed subprocess, whose `finally` teardown never ran. The
guard fired correctly on real leftover state; it is doing its job.

That debris was removed (the worktree was a throwaway checkout of pinned base `4a7390a2` from
`radix-ng/primitives-pin`; nothing was lost, and the parent repo is back to a single worktree
entry). **On the clean re-run `selfcheck-red.mjs` exits 0** -- composition, prompt-parity,
worktree base, transcript parse, classifier, target-toolchain canary, captured-diff containment,
runtime write path, per-volume grading temp dir, and the lz-refactor nx regression all pass,
zero claude spend, borrowed repo left pristine. **Recorded GREEN. Not a milestone defect.**

## E2E Flows

| Flow | Status |
|------|--------|
| Marketplace add -> install -> `/lz-tdd:lz-red` invocation | COMPLETE |
| lz-red progressive disclosure (SKILL.md -> 10 references -> stance router) | COMPLETE |
| Full red-green-refactor loop (red -> green -> refactor -> red) | **BREAKS at both return hops** |

## Nyquist Coverage

| Phase | VALIDATION.md | nyquist_compliant | wave_0_complete | Action |
|-------|---------------|-------------------|-----------------|--------|
| 15 | exists | true | true | none |
| 16 | exists | true | true | none |
| 17 | exists | true | true | none |
| 17.1 | exists | true | true | none |
| 18 | exists | true | true | none |
| 19 | exists | true | true | none |
| 20 | exists | true | true | none |
| 21 | exists | true | true | none |

**8/8 COMPLIANT.** No phase needs `/gsd:validate-phase`. Phase 21's VALIDATION.md is worth
noting positively: it set `nyquist_compliant: true` only AFTER correcting two rows that claimed
automated coverage which did not exist, and after closing a real coverage gap (selfcheck-red
never parity-asserted the d12 arms, leaving 2 of 5 own-skill arms unasserted; the fix's first
version failed its own mutation test).

## Security

8/8 phases carry SECURITY.md; `threats_open: 0` on every one. Phase 21's audit was reached by
the dedicated `gsd-security-auditor` rather than the workflow's inline short-circuit, closing
9/9 threats with two runtime-probed rather than read. No open threat at or above the blocking
severity anywhere in the milestone.

## Deferred by owner decision -- coach-procedure wiring (open, non-blocking)

Surfaced by the reviewer during the SEAM-02 re-land and NOT actioned, because it would modify
pre-existing lines in an already-shipped skill:

Both siblings wire their seam section into **step 1 of the coach procedure** --
`lz-red/SKILL.md:57-61` and `lz-refactor/SKILL.md:45-48` each say "Classify the request against
the ... seam(s) ... See '<section>' above; do not restate it." `lz-tpp/SKILL.md`'s step 1 still
handles only green-vs-refactor and never names lz-red, so lz-tpp implements half the house pattern.

**Prose-only is weaker, not inert** -- the reviewer checked this specifically rather than assuming.
SKILL.md's body loads wholesale on invocation (progressive disclosure gates `references/`, not
sections), the seam paragraph sits at line 38 ahead of the procedure at line 52, and step 1 opens
with a precondition ("Exactly one new failing (red) test, all prior tests green, and the code
compiles") that a no-failing-test request cannot satisfy -- so step 1 FAILS CLOSED and the prose
four sections up supplies the destination. Wiring it would upgrade "fails closed, then very likely
recovers via the prose" to "fails closed and names the destination."

If a non-additive edit to a shipped skill is ever acceptable, this is the one to make. Note the
SEAM-02 guard cannot detect its presence either way.

## Recommended closure path

All three gaps are documentation-or-tooling reconciliation against two known commits. None
requires re-executing phase work, and none touches the lz-red skill content.

1. ~~**Decide SEAM-02's disposition.**~~ **DONE 2026-08-03** -- owner chose to re-land. Commit
   `50fb4ba`. Requirement satisfied; guard restored so it cannot regress silently again.
2. ~~**Fix CHANGELOG.md:33-35.**~~ **DONE by consequence** -- the claim became true again with the
   re-land, so no edit was needed. Had the descope path been chosen, this edit would have been
   mandatory.
3. **STILL OPEN -- one-line fix to `check-backing.mjs`:** point it at `plugins/lz-tdd/references/`
   or add the `existsSync` guard its sibling `check-crossrefs.mjs` already has, and re-green the
   lz-refactor battery. Dev-only; does not affect the shipped product.
4. **STILL OPEN -- housekeeping, non-blocking:** add a forward-pointer addendum to
   21-VERIFICATION.md (mirror the one 20-VERIFICATION.md already carries); refresh STATE.md's
   `status`/`stopped_at`; correct ROADMAP.md line 7 and line 198.
5. **Human action, pending:** run `/reload-plugins` so the re-landed lz-tpp pointer goes live in
   this session. Committed is not loaded.

---

*Audited: 2026-08-02 | Auditor: Claude (gsd audit-milestone orchestrator) | Integration checked by gsd-integration-checker, blocking claims independently re-verified*
