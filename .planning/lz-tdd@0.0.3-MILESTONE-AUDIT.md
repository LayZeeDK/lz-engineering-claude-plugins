---
milestone: lz-tdd@0.0.3
milestone_name: lz-red Skill (RED phase)
audited: 2026-08-03T01:31:37Z
audited_head: f8a69e6
status: tech_debt
supersedes:
  - audited: 2026-08-02
    audited_head: 0ae7909
    status: gaps_found
    note: >
      Re-audit at a HEAD 13 commits newer. Both integration blockers the prior audit raised are
      now resolved in code, but its own closure narrative was found to OVERSTATE what commit
      50fb4ba fixed. See "Correction to the superseded audit" below -- that correction is a
      finding of this audit, not a restatement of the prior one.
scores:
  requirements: 28/28
  phases: 8/8
  integration: 15/17
  flows: 3/3
  nyquist: 8/8 compliant
gaps:
  requirements: []
  integration: []
  flows: []
tech_debt:
  - phase: 19-distribution-hygiene
    items:
      - id: "TD-01"
        severity: "warning"
        affects: ["DST-01"]
        file: "plugins/lz-tdd/README.md:4"
        issue: >
          The per-plugin README names only lz-tpp ("how to use the `lz-tpp` skill
          (`/lz-tdd:lz-tpp`)") for a plugin that now ships THREE skills. Untouched since
          commit ea8a577 in milestone lz-tdd@0.0.1 phase 04 -- it was never revisited when
          lz-refactor shipped in 0.0.2 or when lz-red shipped in 0.0.3. It is a shipped,
          user-facing file.
        why_not_a_blocker: >
          DST-01's literal predicate is "README + CHANGELOG document lz-red", and the ROOT
          README.md does document all three skills accurately. The stub explicitly defers to
          the root README, so no user flow breaks -- a reader is redirected to a correct
          document. The defect is a stale pointer, not a wrong instruction.
        cost_to_close: "One line. Name all three skills, or drop the skill-specific clause entirely."
  - phase: 18-coach-procedure-lz-tpp-seam-wiring
    items:
      - id: "TD-02"
        severity: "warning"
        affects: []
        file: "plugins/lz-tdd/skills/lz-refactor/SKILL.md:37,45"
        issue: >
          The three-way seam is still one-directional on the lz-refactor side. lz-refactor's
          SKILL.md contains ZERO occurrences of "lz-red" (measured: git grep -c returns no
          match), and its coach procedure step 1 classifies only against the lz-tpp seam
          ("Classify the request against the lz-tpp seam", line 45; section heading line 37).
          A user inside lz-refactor who should be writing a new failing test has no in-skill
          pointer back to lz-red.
        why_not_a_blocker: >
          No REQ-ID is violated. SEAM-02's text asks only for a reverse lz-tpp -> lz-red
          pointer in the shipped lz-tpp skill, and that exists and is gated. None of the three
          named E2E flows traverses the lz-refactor -> lz-red hop; all three pass. This is
          incompleteness against the milestone GOAL's spirit ("completing the RGR loop"), not
          against its letter.
        cost_to_close: >
          One additive section in lz-refactor/SKILL.md mirroring the lz-tpp one (+10 lines was
          the lz-tpp cost), plus a guard in check-red-references.mjs so it cannot regress -- the
          SEAM-02 guard is the precedent. Subagent review required before acceptance, per the
          standing rule for shipped-skill edits.
---

# Milestone Audit: lz-tdd@0.0.3 -- lz-red Skill (RED phase)

**Audited:** 2026-08-03T01:31:37Z at HEAD `f8a69e6` (branch `gsd/lz-tdd-0.0.3-lz-red`)
**Status:** `tech_debt` -- no blockers; 28/28 requirements satisfied; two warnings need an
accept-or-fix decision.

This audit SUPERSEDES the 2026-08-02 audit at `0ae7909`, which recorded `gaps_found`.

## Verdict

| Dimension | Score | Notes |
|---|---|---|
| Requirements | **28/28 satisfied** | 24 clean on the 3-source matrix; 4 resolved by manual verification (see "Matrix blind spot") |
| Phases | **8/8** | every phase has a VERIFICATION.md and every one reads `status: passed` |
| Integration | **15/17** | 0 BLOCKER, 2 WARNING (TD-01, TD-02) |
| E2E flows | **3/3** | all three named flows traced end to end in the shipped Markdown |
| Nyquist | **8/8 compliant** | every phase has a VALIDATION.md with `nyquist_compliant: true` and `wave_0_complete: true` |
| Orphaned requirements | **0** | every REQ-ID appears in its assigned phase's VERIFICATION.md |

No requirement is `unsatisfied`, so the step-5e FAIL gate does not fire.

## Phase Verifications

All eight read directly; none missing.

| Phase | Status | Score |
|---|---|---|
| 15 lz-red-skill-scaffold-description-boundary | passed | 10/10 must-haves |
| 16 source-distillation-core-red-references | passed | 10/10 must-haves |
| 17 assertion-design-stance-router-ts-vitest-mechanics | passed | 14/14 (9 requirements + 5 success criteria) |
| 17.1 perform-phase-16-beck-follow-up | passed | 10/11 (1 partial, documentation-accuracy, non-blocking) |
| 18 coach-procedure-lz-tpp-seam-wiring | passed | 11/11 must-haves |
| 19 distribution-hygiene | passed | 17/17 (re-verified; previous `gaps_found` 13/16, gap D-08 closed with committed agent evidence) |
| 20 skill-effectiveness-evals | passed | 20/20 must-haves |
| 21 applied-red-eval-in-real-oss-repos | passed | 8/8 (re-verified; previous `human_needed`, 4 gaps closed) |

Six `deferred` truths appear across the VERIFICATION frontmatter. **All six are intra-milestone
forward references and all six were closed by the phase that inherited them** -- 15 -> 20
(empirical trigger firing), 16 -> 20 (empirical RED-behavior), and four from 17 -> 18 (the VIT-02
SKILL.md clause, the LAW-01/LAW-02 procedure, the RTR-02 routing step, the SEAM-01 seam). Nothing
was deferred past the milestone boundary.

## Requirements Coverage (3-source cross-reference)

Sources: REQUIREMENTS.md traceability table + checkbox state; each phase's VERIFICATION.md; each
plan SUMMARY.md `requirements_completed` frontmatter.

24 of 28 resolve `satisfied` with all three sources agreeing.

### Matrix blind spot -- four requirements needed manual verification

Four requirements resolve to `partial` on the mechanical matrix (VERIFICATION `passed` + SUMMARY
frontmatter missing): **DST-02, EVL-01, EVL-02, EVL-03**. All four verify clean against their
actual predicates and are recorded `satisfied`.

**This is a systematic blind spot in the matrix, not a gap in the work.** These four requirements
close through ORCHESTRATOR-driven gates -- dedicated-agent reviews and user-approved metered eval
runs -- that execute after `execute-phase` has already returned. `gsd-executor` has no Agent tool,
so a requirement whose closing evidence is an agent verdict or a gated run can NEVER appear in a
plan SUMMARY's `requirements_completed`. Any future audit will re-flag these four for the same
structural reason; the fix is to read the predicate, not to distrust the work.

Verification performed for this audit:

| REQ | Predicate | Evidence (verified this session) |
|---|---|---|
| DST-02 | `claude plugin validate . --strict` passes; plugin-validator AND skill-reviewer PASS on lz-red | Ran the validator: **exit 0** ("Validation passed"). `19-GATE-RESULTS.md` records plugin-validator **PASS (0 critical, 0 warnings)** and skill-reviewer **PASS (no ship-blockers)**, each reached BY the dedicated agent with the orchestrator routing the verdict, not deriving it |
| EVL-01 | Trigger eval incl. the three-way boundary | `.claude/skills/lz-red-workspace/EVAL-RESULTS.md` tracked and committed. Reciprocal sets re-inspected live: lz-tpp 12/12 quiet, lz-refactor 12/12 quiet |
| EVL-02 | RED-behavior eval vs unaided baseline | Same file; substance-only headline 0.97 vs 0.87 recorded with its vocabulary-inflation caveat |
| EVL-03 | Applied 3-arm multi-dimensional eval | `e2e-red-gilded-rose/EVAL-RESULTS.md` tracked and committed, 36-row per-specimen verdict table present |

### Requirements closing with documented caveats

Three EVL requirements are satisfied but NOT clean wins. The audit records them as the
requirement text records them, because rounding them up would misrepresent the milestone:

- **EVL-01** -- shortfall. Forward recall 92% against a 100% target (T9, house-idiom, fired 1/3).
  The widen was applied and validated on an independent held-out set (5/6 -> 6/6, specificity
  held, unbiased review PASS), but **the 92% headline measures a skill version that no longer
  ships** and the held-out A/B was never re-measured at full scale.
- **EVL-02** -- modest and concentrated. Substance-only Pass@1 0.97 vs 0.87; the edge comes from
  2 of 10 scenarios (eval-8 coach-don't-drive, eval-9 classify-first). The other 8 are substance
  ties against a strong base model. The 0.87-vs-0.50 full-run figure is vocabulary-inflated and
  is retained only as labeled context.
- **EVL-03** -- complete, with the last dimension NULL. Re-graded 2026-08-02 under the current
  grader with zero verdict changes (grader-regime-invariant). The oracle-reviewer authenticity
  dimension ran 2026-08-03: authentic-of-12 was 7 / 6 / 5 across no_skill / with_skill /
  invoke_skill -- **a tie at this n, not a reverse effect**, with the monotone direction named
  before being argued away.

## Integration

The integration checker re-ran every battery live rather than trusting recorded results.

| Battery | Result | Exit |
|---|---|---|
| `check-red-references.mjs` | 11/11 lz-red surfaces, 124/124 roster checks, SEAM-02 gate PASS, link-resolution gate PASS | 0 |
| lz-red-workspace `npm run check` | GREEN incl. provenance + row-guard selftests | 0 |
| lz-red-workspace `npm run typecheck` | 8/8 TS modules `tsc --strict` clean | 0 |
| lz-refactor-workspace `npm run check` (10 checkers) | ALL GREEN -- hygiene 197 files, cross-refs 718 links resolve, backing 3/3 | 0 |
| `claude plugin validate .` and `--strict` | Validation passed both | 0 |
| Independent link-resolution sweep, 198 shipped files | 0 broken relative links | -- |

Three independent tools agree there are zero dead relative links in the shipped tree, including
across the `beck-tdd-by-example.md` relocation to the plugin-wide `plugins/lz-tdd/references/`.
Both consumers resolve: `lz-red/SKILL.md:159` via `${CLAUDE_PLUGIN_ROOT}` and
`lz-refactor/references/principles.md:27` via `../../../`.

### E2E flows -- 3/3

| Flow | Verdict | Evidence |
|---|---|---|
| (a) RED question -> lz-red -> coach procedure -> stance route -> lz-tpp handoff | WIRED | SKILL.md steps 1-6: step 1 classifies against both siblings, step 3 routes via `testing-stance/README.md`, step 6 hands forward |
| (b) GREEN question -> lz-red stays quiet / classifies away | WIRED | Explicit description guard; step 1 hands to lz-tpp and stops. Corroborated empirically: lz-tpp's description does not fire on 12/12 RED-facing queries |
| (c) REFACTOR question -> routes to lz-refactor | WIRED | Mirrored guard; reciprocal set 12/12 |

## Correction to the superseded audit

**This is a finding of this audit.** The 2026-08-02 audit's update note (lines 171-173) states
that commit `50fb4ba` closed `INT-01` and `FLOW-01` and that "the full red-green-refactor loop is
wired in both directions." **That claim is false, and it was false when written.**

Traced directly with `git show --stat 50fb4ba`: that commit touched exactly two files --
`check-red-references.mjs` (+59/-12) and `plugins/lz-tdd/skills/lz-tpp/SKILL.md` (+10/-0). It did
NOT touch `lz-refactor/SKILL.md`.

- `INT-01` was raised as "NEITHER lz-tpp nor lz-refactor names lz-red." Only the lz-tpp half was
  fixed. Measured at this HEAD: lz-tpp/SKILL.md has 3 `lz-red` occurrences; lz-refactor/SKILL.md
  has **zero**.
- `FLOW-01` was raised as breaking at "the return hops (lz-tpp -> lz-red AND lz-refactor ->
  lz-red)." One of the two return hops exists.

The residue is carried forward as **TD-02** rather than re-raised as a blocker, because no REQ-ID
is violated and all three named flows pass. But the prior record overstated its own closure, and
a reader trusting it would believe the loop is bidirectional when half of it is not.

The prior audit's OTHER closures verify as claimed: `SEAM-02` and `DST-01` are genuinely satisfied
by the re-land, and the re-land was correctly not verbatim (an unbiased reviewer caught a routing
defect in the original Phase-18 text -- a negative catch-all that mis-routed cleanup-on-green
requests to lz-red and swallowed lz-tpp's Reference mode).

### INT-02 -- closed and independently verified

The prior audit's `status_if_reaudited` still reads "INT-02 remains open." **Stale.** INT-02 closed
at commit `ee50a74`, which landed after the audit's last edit (`b235c9c`).

Verified this session by running the instrument: `check-backing.mjs` executes **exactly 8**
PRIN-01 assertions against `beck-tdd-by-example.md` and all 8 PASS -- the precise count the fix
claimed had been silently skipped. The full 10-checker battery exits 0. The fix used the
`spec.dir ?? REFERENCES` shape the sibling checker already uses rather than an `existsSync` guard,
which would have made the gate permanently fail-open on exactly the assertions it exists to run.

## Tech Debt

**Total: 2 items across 2 phases.** Both are WARNINGs; neither blocks the milestone.

**Phase 19 -- Distribution & Hygiene**
- **TD-01** `plugins/lz-tdd/README.md:4` names only lz-tpp for a three-skill plugin. Untouched
  since `ea8a577` (0.0.1, phase 04). Root README is accurate and the stub defers to it, so no
  flow breaks. One-line fix.

**Phase 18 -- Coach Procedure & Seam Wiring**
- **TD-02** `lz-refactor/SKILL.md` has zero `lz-red` mentions; its step 1 classifies only against
  the lz-tpp seam. The lz-refactor -> lz-red return hop does not exist. Closing it means one
  additive section plus a regression guard, mirroring the SEAM-02 precedent.

Both are cheap. TD-02 is the one that matters, because the milestone goal is stated as
"completing the RGR loop" and one of the four hops in that loop is absent.

## Audit method

- All 8 VERIFICATION.md read in full; none missing.
- All 27 SUMMARY.md `requirements_completed` extracted via `summary-extract`.
- REQUIREMENTS.md traceability table parsed; all 28 rows `[x]`.
- Orphan detection run across all 28 REQ-IDs against all VERIFICATION.md files: 0 orphans.
- Nyquist discovery run across all 8 phases (discovery only; `/gsd:validate-phase` never
  auto-called).
- Integration checked by `gsd-integration-checker` in a fresh context, deliberately NOT primed
  with the prior audit's findings so its sweep would be independent. Both of its warnings were
  then re-verified by the orchestrator against the underlying files and git history before being
  recorded here.
- Batteries re-run rather than read: exit codes reported are observed.
