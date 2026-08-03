# ROUTING-AB-RESULTS -- the D-08 placement A/B (SCAFFOLD, no numbers yet)

**Status: the instrument is BUILT and the measurement is HALTED pending owner approval.**

Every figure in this document is a blank placeholder. Nothing here has been measured. The run is
presented, ready to go, in `e2e-rgr-routing/RUN-GATE.md`, and it starts only on fresh explicit owner
approval.

This file is a phase-scoped SIBLING of the workspace eval record, deliberately NOT an append to it
(D-25). That record is frozen EVL-01 and EVL-02 evidence with a hand-maintained structure; folding a
fourth eval into it invites exactly the drift its own drift notice documents.

The caveats below are written NOW, BEFORE the numbers arrive. That ordering is the point: a caveat
authored after a result is indistinguishable from a rationalization of it.

- **Phase:** 22 -- three-way classifier correctness (lz-refactor + lz-red)
- **Requirement:** CLS-05
- **Decisions:** D-08 (three variants), D-09 (measure, ship only the winner), D-10 (pre-registered
  null tiebreak), D-11 (a behavior eval, not a trigger eval), D-12 (destination metric), D-13
  (two-stage), D-14 (double HALT gate), D-24 (honest success framing), D-25 (this file's location)
- **Scaffold authored:** 2026-08-03
- **Measured:** NOT YET

---

## What closing Phase 22 does and does not do (D-24)

**Closing Phase 22 does NOT by itself unblock the held pull request. The owner-approved A/B run
does.**

This has to be written down plainly, because "no variant shipped" would otherwise read later as an
incomplete phase. It is not. It is the designed outcome of two decisions taken together:

- **D-09** says author all three variants, measure, and ship only the winner.
- **D-14** says no metered command runs inside this phase's execution without fresh owner approval.

Together those mean **no placement variant is formally selected inside Phase 22**. The phase completes
with the classifier FIXED across all six surfaces and provably so, and with the placement question
BUILT-and-HALTED.

**The tracked tree remains variant A, and variant A is a legitimate variant** -- inline only, the
composition anchor the existing selfcheck already asserts, and one of the three candidates the A/B is
between. The tree is not in a half-migrated or provisional state. It is one of the three answers,
sitting unchanged while the question is decided by measurement rather than by argument.

What Phase 22 DID close: CLS-01 through CLS-04, deterministically and with mutation proofs in both
directions. What it did NOT close: CLS-05, which is BUILD-complete and honestly recorded as halted.

---

## Arms

| Arm | Plugin tree | Placement lever |
|-----|-------------|-----------------|
| `variant_a` | `plugins/lz-tdd` (TRACKED) | inline only -- step-1 branches plus the per-skill narrative section; no new shipped file |
| `variant_b` | `out/lz-tdd-variant-b` (generated) | shared routing table PLUS a short inline classify-first rationale per skill |
| `variant_c` | `out/lz-tdd-variant-c` (generated) | shared routing table REPLACING the three per-skill narrative sections; branch lists stay inline |

All three carry BYTE-IDENTICAL `description` frontmatter per skill, asserted independently at
generation time and again at measurement time. That is what makes this a placement comparison rather
than a triggering comparison (D-11).

## Corpus

Nine cases from `tools/rgr-cases.json`, one prompt per case, ids matching exactly. The corpus is
labelled RECONSTRUCTED and is not claimed as a reviewer's verbatim set (D-23).

## Metric

Routing correctness per request: the single closed DESTINATION label the answer designates as the
owner. Graded on the destination, NEVER on house vocabulary (D-12).

---

## Results

### Per-arm Pass@k and Pass^k over the nine cases

n = total runs for the arm. c = runs whose extracted label equals the expected label.

| Arm | n | c | Pass@1 | Pass@3 | Pass@5 | Pass^1 | Pass^3 | Pass^5 | Pass@total | Pass^total |
|-----|---|---|--------|--------|--------|--------|--------|--------|------------|------------|
| `variant_a` | ___ | ___ | ___ | ___ | ___ | ___ | ___ | ___ | ___ | ___ |
| `variant_b` | ___ | ___ | ___ | ___ | ___ | ___ | ___ | ___ | ___ | ___ |
| `variant_c` | ___ | ___ | ___ | ___ | ___ | ___ | ___ | ___ | ___ | ___ |

**Read every cell in this table together with the power bound stated below it and with the read rate
in the next table. A pass rate alone is not a result here.**

### Read rate, adjacent to the pass rate (Pitfall 5)

| Arm | Pass@1 | READ RATE (shared table opened) | Interpretation |
|-----|--------|--------------------------------|----------------|
| `variant_a` | ___ | structural zero (its tree carries no shared table) | in-corpus zero baseline |
| `variant_b` | ___ | ___ | ___ |
| `variant_c` | ___ | ___ | ___ |

A high pass rate at a ZERO read rate means the measurement captured the INLINE RESIDUE rather than
the placement. Variant A's structural zero is what makes the other two rates interpretable rather than
merely reported.

### Deterministic-versus-judge split

How many of each arm's runs resolved mechanically, and how many needed the judge.

| Arm | Runs total | Resolved deterministically | Sent to the judge | Judge share |
|-----|-----------|----------------------------|-------------------|-------------|
| `variant_a` | ___ | ___ | ___ | ___ |
| `variant_b` | ___ | ___ | ___ | ___ |
| `variant_c` | ___ | ___ | ___ | ___ |

**This split is a FINDING in its own right, not bookkeeping.** A variant that systematically produces
multi-name hedging answers shows a higher judge share, and that asymmetry says something about the
placement. Report it rather than letting it hide inside a pass rate.

### Normalization-fired count -- blindness evidenced, not asserted

| Arm | Runs | Normalization fired (any leak) | File-path leaks stripped | Section-heading leaks stripped |
|-----|------|-------------------------------|--------------------------|--------------------------------|
| `variant_a` | ___ | ___ | ___ | ___ |
| `variant_b` | ___ | ___ | ___ | ___ |
| `variant_c` | ___ | ___ | ___ | ___ |

**This A/B can be genuinely blinded where the prior behavior eval could not.** That one compared a
skill-loaded arm against a no-skill baseline, so the transcripts self-identified through house
vocabulary and the "blind judge" claim did not hold. Here ALL THREE arms are skill-loaded and share
the same coaching register, so the arm is not inferable from the voice. Only two mechanical leaks
remained -- a cited file path and a quoted section heading -- and both are normalized to neutral
placeholders before the judge sees anything. The counts above are what turn "blinded" from a claim
into evidence.

### Run parameters

| Parameter | Value |
|-----------|-------|
| Stage | ___ |
| k | ___ |
| Model | ___ |
| Date | ___ |
| Approved by | ___ |
| Total runs | ___ |
| Total spend | ___ |

---

## Caveats -- written in advance of the numbers

### The k=1 power bound, stated in the same breath as the figures

Stage 1 is nine cases x three arms at k=1, which is 27 runs. **That cannot distinguish a small effect
from noise.** A one-case difference between two arms at k=1 is within sampling variation, and no
conclusion about placement should be drawn from one. Stage 1 is a SCREEN: it exists to catch a gross
effect, such as one variant routing a case wrong where the other two route it right. Stage 2 escalates
k only on a signal and only on the discriminating subset, and it needs its own separate approval.

Whatever numbers land in the tables above, state this bound in the same paragraph as them. Do not
report a headline in one place and its power bound in another.

### The D-10 tiebreak is pre-registered, and it is NOT free

D-10 pre-registers variant C as the null tiebreak, because a future entrypoint skill would get ONE
normative artifact to cite and a legitimate home for the residual owner, rather than a fourth inline
copy.

**Two constraints on using it, both accepted by the owner with the risk stated:**

1. **The tiebreak fires only on a MEASURED tie on routing correctness.** It is not a default to fall
   back on when the data is thin, ambiguous, or absent. No measurement means no tiebreak.

2. **A tie on routing correctness does NOT prove parity on coaching quality.** These are different
   metrics and only one of them was measured. Variant C moves the classify-first rationale BEHIND A
   LAZY READ, and classify-first is one of only TWO scenarios where the prior behavior eval measured a
   real edge over the baseline model (the other being the COMMAND handoff). The substance-only gap
   there was 29 of 30 with the skill against 26 of 30 without, concentrated in exactly those two
   scenarios. Variant C relocates the rationale for one of them to a tier this repo has MEASURED at
   zero retrieval.

**So a tie must not be written up as "C is free".** It is "C is not worse on the one axis we
measured, on an axis that does not cover the risk C carries." If the tiebreak selects C, say that.

### The prior-probe base rate -- a null here is likely and legitimate

Five prior placement and passive-content probes on this project came back NULL. Eight of ten scenarios
in the prior behavior eval saturated on substance against a strong base model. The single probe that
ever moved the output axis was an ACTIVE forcing-function step, not passive content placement.

**A null is the modal expected outcome, not a failed experiment.** It is the reason D-10 exists at
all. Do not treat a null as a reason to re-run at higher k hoping for a different answer, and do not
treat it as evidence that the instrument is broken -- the instrument's own selfchecks are the evidence
about the instrument.

### Any grader artifact is applied SYMMETRICALLY to every arm

If the reviewer or the run surfaces a grader artifact -- an extraction miss, a normalization that
stripped something load-bearing, an affirmation heuristic that mis-reads an exclusion clause -- **the
correction applies to EVERY arm, not to the arm it was noticed on.** The recorded failure mode on this
project is a caveat applied upward for one arm only, which silently converts an instrument defect into
an apparent effect.

### The rollup is not fully automated yet

Two steps of the downstream chain do not currently reach this suite: the tabulator discovers only
`e2e-red-*` suite dirs and walks only `results/apply`, and the judge merge's `--verify` gate globs a
different directory shape and a different grade filename. Both are recorded with their measured
evidence in `e2e-rgr-routing/RUN-GATE.md` under KNOWN GAPS. **Whoever fills this document must confirm
run completeness by hand, or close the gaps first.** A rollup computed over a partially merged set
drops unresolved runs out of the denominator, which is a scored-only false pass.

---

## Unbiased reviewer verdict (RESERVED -- at least one from-scratch reviewer)

Per the standing rule that an unbiased review beats a primed one, at least ONE review agent with a
NEUTRAL from-scratch brief -- no prior findings, not primed with these results, not told what
conclusion is expected -- audits the grader source, a sample of normalized judge inputs, and the
reported numbers AFTER the gated run and BEFORE those numbers are recorded as findings.

This is the gate that caught a grader-vocabulary artifact on this project which had inflated a
headline by roughly threefold. It is an ORCHESTRATOR-spawned step; the executor cannot spawn
subagents.

Slot reserved; filled post-run.

| Reviewer | Brief | Scope | Verdict | Findings |
|----------|-------|-------|---------|----------|
| ___ | ___ | ___ | ___ | ___ |

---

## Reconcile on completion -- CLS-05

**When the owner-approved run completes and this document is filled, RECONCILE the CLS-05 requirement
row in `.planning/REQUIREMENTS.md` and its traceability entry.**

CLS-05 is currently and correctly recorded as BUILD-complete and HALTED. That status was written by
the step that DEFERRED the measurement. **A status only ever written by the step that defers it is
never cleared by the step that resolves it** -- three prior gated requirements on this project decayed
into a false Pending exactly that way, which is why this note names the row explicitly instead of
trusting a future reader to notice.

Reconcile all three of these together, or none of them:

- the CLS-05 checkbox and its traceability row,
- this document's status line at the top,
- the phase's own record of what shipped, including which variant was selected and on what evidence.
