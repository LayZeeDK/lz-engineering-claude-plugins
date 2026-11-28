# 260802-j03 -- Pilot Result: the ceiling HELD

**Date:** 2026-08-02
**Gate:** `targets.json` `AMB1.pilot_decision_rule`, pre-registered and committed
(`f75a989`) BEFORE any pilot run
**Outcome:** **N = 3 -> CEILING HELD -> STOP. The ~$27 round was NOT bought.**

---

## The rule, as it was committed

> N = the number of GRADEABLE pilot runs whose `changed_production_files` is NON-EMPTY, out
> of 3. **N = 3 means CEILING HELD** -- the rewritten `a1` is resolved correctly by the
> baseline every time, exactly as the un-rewritten one was; STOP, do NOT buy the round,
> report the ceiling as the finding, keep `FUT-TAXONOMY-SHARED` OPEN with status
> NOT-YET-TESTED, and record that D-03 did not move the baseline. N = 0, 1 or 2 means
> CEILING MOVED -- BUY the round at k=5.

Applied verbatim. Nothing was reinterpreted after the numbers were visible.

## What was measured

Baseline arm (`invoke_skill`) only, revised `a1` only, 3 runs, apply mode, against the
srvx throwaway at `D:/.lz-red-throwaway/srvx-d12`.

| Run | `changed_production_files` | Counts toward N | Verdict | Pass | tsc | Cost | Time |
|-----|---------------------------|-----------------|---------|------|-----|------|------|
| 1 | `src/correlation-id.ts` | YES | `blunt_red` | true | 0 new errors | $1.2609 | 148 s |
| 2 | `src/correlation-id.ts` | YES | `genuinely_red` | true | 0 new errors | $1.5206 | 199 s |
| 3 | `src/correlation-id.ts` | YES | `genuinely_red` | true | 0 new errors | $1.3295 | 214 s |

**N = 3 of 3.** Zero void runs, so no re-runs were consumed and the gate was read on three
grades as the rule requires -- never on two.

**Actual spend $4.11** against a $3.71 budget (+11%). The pilot ran ~$0.40 over because the
re-run of run-1 was charged twice in total across the session: ~$1.24 before the pause and
$1.26 after. The overrun bought the freshness guarantee and is not a budget defect.

Secondary, recorded but explicitly NOT the gate: the verdict distribution was
2 x `genuinely_red` + 1 x `blunt_red`, all three passing, all three tsc-clean, all three
producing `test/correlation-id.test.ts`. Every run's pristine-tree attestation returned
`ok: true`. The `lz-red` skill fired 16 / 26 / 25 times, so the arm was armed as intended.

## The finding

**The discriminator is at a ceiling, and D-03 did not move it.**

Cutting `a1`'s absence assertion -- the D-03 repair, whose entire purpose was to make the
prompt referentially ambiguous so the baseline could plausibly fail -- **did not change the
baseline's behaviour at all**. The baseline resolved the prompt to the production side on
every one of the three runs, exactly as it had on the un-rewritten prompt.

The cumulative record on this discriminator is now:

- Round 1 (2026-08-01, 18 runs, all three arms): correct **18 of 18** -- non-empty on every
  `a1`, empty on every `a2`.
- This pilot (baseline arm, revised `a1`): correct **3 of 3**.
- **21 of 21 overall.** The baseline arm alone is 6 of 6 on `a1` across both prompt versions.

That is a ceiling, not a tie. A k=5 round would put the baseline at 10/10 per arm, and no
treatment can be observed to beat an arm that never fails. The ~$27 round could not have
measured anything, which is precisely what the pilot existed to determine -- for $4.11
instead of $27.

## Consequences

1. **The round is not bought.** No further metered spend on this cell.
2. **`FUT-TAXONOMY-SHARED` stays OPEN, status NOT-YET-TESTED.** This is unchanged, and the
   pilot is why it must stay that way: the shared-taxonomy hypothesis has still never been
   given a fair test. Round 1 could not test it (zero dose), and this pilot establishes
   that the instrument cannot test it either while the baseline is saturated. Do not record
   this as a null result for the taxonomy -- it is a NOT-TESTED, and the distinction is the
   whole lesson of the prior session.
3. **D-03 is recorded as ineffective.** The antecedent cut was a sound repair to a real
   defect (the prompt genuinely did carry a resolving antecedent), and it still failed to
   create headroom. Being right about the defect did not make the fix work.

## Why the ceiling is structural, not bad luck

`AMB1.ceiling_note` predicted this on structural grounds before round 1, and both rounds
have now confirmed it. The shipped `lz-red` SKILL.md that the baseline arm loads already
carries the qualify-by-side rule verbatim (SKILL.md:101-104) AND a worked example whose
production-side stub IS this cell's correct answer (SKILL.md:106-130). The baseline is not
guessing well -- it is reading the answer out of the skill it was armed with. `a1` also asks
for the production touch outright, so the 2-in-44 corpus base rate that suggested headroom
never applied here.

**To measure a taxonomy effect at all, the cell needs a target where the baseline is not
already correct.** That is a new-cell problem, not a prompt-rewording problem, and this
pilot is the evidence that no further rewording of `a1` is worth buying.

## Provenance of these numbers

The pilot was launched, paused after run 1, and resumed in a later session, which left a
MIXED results tree: one fresh capture carrying a stale grade from round 1, plus two
untouched round-1 captures. Reading that tree would have produced a wrong N.

Repair, before any number was computed:

1. Verified the round-1 archive intact at `D:/.lz-red-archive/2026-08-01-d12-round-1/`
   (27 metas, 27 grades) so nothing was at risk.
2. Deleted all three stale `red-grade.json` files.
3. Recorded a resume boundary of `2026-08-02T16:12:32.363Z` BEFORE re-running, so the
   freshness check was anchored on a value that predates every new artifact.
4. Re-ran all three with `--force` (without it the harness silently skips completed runs).
5. Re-graded all three.
6. Asserted, fail-closed, that every `meta.json` `started_at` AND every `red-grade.json`
   mtime postdates the boundary. All six artifacts passed; captures at 16:12:53 / 16:15:23 /
   16:18:42, grades at 16:22:47 / 16:22:58 / 16:23:09.

Only then was N computed.
