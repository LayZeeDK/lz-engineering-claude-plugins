# Phase 8 Oracle Model -- Kerievsky addendum (driver-side anchor lock)

**Status:** driver-side addendum, agent-reviewed before adoption (2 reviewers: consistency + unbiased).
EXTENDS `../07-fowler-catalog-refactoring-2nd-ed/07-ORACLE-MODEL.md` (the base clean-room loop,
firewall, oracle-availability matrix, and driver responsibilities, all reused as-is). This file does
TWO things for the remaining Ch.8-11 chapters, so the anchors stop depending on the driver's memory:
(1) it CODIFIES the three Kerievsky-specific axes already passed ad hoc in Ch.6-7 (direction,
composed-primitive-aptness, target-pattern); and (2) it introduces two genuine scoring changes -- a
RETARGETED spirit/judgment axis and a mechanics/composed-primitive ownership split -- that change how
Ch.8-11 leaves are scored (NOT mere packaging; see those sections).

**Scope of this file (important):** these are DRIVER-side anchors passed per `oracle-reviewer`
invocation, consistent with 07-ORACLE-MODEL's design ("the agent carries a generic default rubric;
for precision the driver passes the canonical per-axis anchors"). Nothing here edits
`.claude/agents/oracle-reviewer.md` or `oracle.md`, so adopting it does not trigger the standing
agent-file review + `/reload-plugins` rule -- but because the two scoring changes above ARE the
reviewer's runtime behavioral contract, they were agent-reviewed before this file was committed. If
the owner ever wants them baked into the agent's default rubric, THAT edit would trigger the reload
gate.

## Firing record that motivates these anchors (evidence)

Across Fowler Ch.6-12 (62 leaves), Fowler Ch.3 (24 smells), and Kerievsky Ch.6-7 (12 leaves), by axis:

| Axis | Where it fired (substantive, upheld revises) | Yield |
|---|---|---|
| mechanics (+ cross-ref aptness) | every chapter; top refactoring-leaf driver; cross-ref aptness caught RCP/Decompose (07-07), Preserve Whole Object/CFD (07-08) | high |
| composed-primitive (Kerievsky) | 5 of 6 in Ch.7; embedded in Ch.6 reframes | highest Kerievsky-specific |
| applicability | dominant smell driver (07-10); Decorator narrow-interface precondition WRONG (08-03) | high |
| candidates (smells) | 12 of 24 smell leaves (07-10) | high (smells) |
| example (+ too_close + representativeness) | too_close 2x (Introduce Assertion, Push Down Method); forced the State walkthrough (08-03); DST-04 code catch | medium-high |
| target-pattern (Kerievsky) | 2x in Ch.6 (Abstract Factory -> plain Factory) | medium, high-severity |
| motivation | occasional (07-05; refused-bequest 07-10) | low, high-severity |
| direction (Kerievsky) | 0 substantive fires so far (Ch.6 Away + Ch.7 Towards all correct) | low; narrow high-risk field |
| recognition (smells) | mostly correct first pass | low |
| spirit/judgment (generic "framing matches") | 0 fires as generic across ~29 Fowler leaves; after Phase-7's spirit->spirit/judgment retarget, 1 fire (refused-bequest, a SMELL); 0 on Kerievsky Ch.6-7 | near-dead for pattern-directed leaves -> RETARGETED below |

## Locked Kerievsky per-axis anchors (pass these EVERY chapter, in addition to the Fowler refactoring-leaf defaults)

Content type: `refactoring-leaf`. Keep the base mechanics / motivation / example / applicability axes,
pass these three Kerievsky-specific axes, and REPLACE the base spirit axis with the retargeted
spirit/judgment defined below (for pattern-directed leaves):

- **direction** -- each leaf carries `Direction: To|Towards|Away`.
  - correct: the source frames this refactoring the way the field labels it (Towards = moving toward /
    adopting the pattern; To = a direct switch; Away = de-patterning / removing a premature pattern).
  - partial: defensible but the source emphasizes a different one of To/Towards/Away.
  - wrong: the Direction field contradicts the source (e.g. labeled Towards where the source removes
    the pattern).

- **composed-primitive-aptness** -- each leaf lists `Composed Fowler primitive(s):`.
  - correct: each cited Fowler primitive is one the source actually leans on in this refactoring's
    mechanics, AND no primitive the source clearly relies on is missing.
  - partial: a cited primitive is plausible but not one the source uses, OR a relied-on primitive is
    missing.
  - wrong: a cited primitive is absent from / contradicts the source's mechanics.

- **target-pattern** -- each leaf names a `GoF pattern:`.
  - correct: the named pattern is exactly the pattern this refactoring targets per the source
    (Kerievsky states it; non-GoF targets like Composed Method are named as such).
  - partial: related but imprecise (e.g. a pattern family, or Abstract Factory where the source means
    a plain Factory -- the Ch.6 catch).
  - wrong: names the wrong pattern.

- **spirit/judgment (REPLACES the base spirit axis for pattern-directed Kerievsky refactoring leaves)**
  -- scores ONE thing the other axes do not: whether the leaf frames pattern adoption as a tradeoff
  earned by a real force, WITH an over-engineering counterweight, rather than as an unconditional
  recipe. It does NOT re-score the reasons (that is `motivation`), the fidelity of the source's
  specific caveats (that is `applicability`), or the To/Towards/Away label (that is `direction`).
  - correct: the leaf carries an explicit counterweight -- for Towards/To, a guard against applying the
    pattern speculatively / before the force is real; for Away, why the pattern was premature and
    removing it improves the design -- and that counterweight does not contradict the source.
  - partial: EITHER a counterweight is present but generic (not tied to THIS pattern's specific
    over-application failure mode), OR the leaf is silent on when-not-to (no counterweight, but no
    over-claim either -- the presence obligation is unmet, yet the leaf is not misleading).
  - wrong: the pattern is presented as an unconditional good (apply-always), or the counterweight
    contradicts the source.
  - Ownership seam (PILOT-HARDENED 2026-07-06 -- see Pilot findings; parallel to the
    mechanics/composed-primitive split): the over-engineering / tradeoff guard (the "only when complex
    enough / don't over-apply" limit) is owned EXCLUSIVELY by `spirit/judgment`. `applicability` is
    BARRED from scoring that same guard -- it scores ONLY the OTHER source caveats (e.g. for Strategy
    the pass-the-context vs pass-the-data data-access liability; for Decorator the object-identity
    liability), never the over-application limit. `motivation` owns the fidelity of the reasons/force;
    `direction` owns the To/Towards/Away label (an inverted label fires `direction`, NOT `spirit`). If an
    apply-always over-claim physically sits inside the Motivation prose, it is STILL scored under
    `spirit` (stance), not `motivation` (reasons) -- do not triple-score one sentence. Net: a leaf can
    pass motivation, applicability, AND direction yet still fail spirit if it omits the counterweight or
    reads as apply-always.
  - Keep the discriminator OBSERVABLE (is an explicit over-engineering / premature-pattern counterweight
    present and consistent with the source?), NOT "the emphasis the source stresses" -- it is the
    softest axis and the one most prone to false-`revise`/oscillation, so lean on presence + the round
    cap + owner escalation rather than a subjective emphasis judgment.
  - Status (PILOT-VALIDATED 2026-07-06): a 3-variant A/B/C pilot on one Strategy leaf (counterweight
    present / silently absent / apply-always), with mechanics-example-reasons held byte-identical,
    returned spirit correct / partial / wrong in step -- so spirit is the ONLY axis that separates a
    silent omission (partial) from an active apply-always over-claim (wrong); applicability collapses
    both to wrong. That is its earned, non-redundant contribution. It remains a forward-looking bet on
    whether the Phase-9 de-patterning coach (CCH-02) uses the counterweight; re-evaluate after Ch.8-11.
    This mirrors the Phase-7 precedent of retargeting spirit rather than dropping it.

For `smell-leaf` content (the Ch.4 fold, 08-06): keep spirit/judgment in the base generic judgment form
(07 anchor). The one useful refinement seen in practice is severity-judgment (is the smell's severity /
when-it-is-actually-acceptable framed as the source does -- e.g. refused-bequest as a usually-mild
judgment call, the single time the axis fired). Do NOT apply the counterweight retarget to smells (they
have no Direction field).

**The 12 Ch.6-7 leaves were RE-GATED on the retargeted spirit axis (2026-07-06)**, closing the
pre-retarget two-tier gap for real (not just spot-checked). Result: 11/12 `correct` on the first pass;
the one miss was Replace Conditional Dispatcher with Command, whose only `## Watch for` was a
behavior-preservation caveat (NOT an over-application counterweight) -- flagged `partial`, fixed blind
(added a Command-specific over-application guard: reserve a command table for a churning dispatch set /
actions that must live on their own; leave a small stable switch as a switch), re-gated `correct`.
Final: 12/12 `correct`. This was a SPIRIT-AXIS-ONLY re-gate by design: the other axes converged under
the prior gate, and re-scoring them invites the oscillation documented in Pilot findings, so they were
explicitly out of scope. This both closed the gap AND was the second live confirmation the retargeted
axis discriminates on real content (it caught a genuine missing counterweight the generic axis passed).

## target-pattern sourcing (reconciles D-04)

target-pattern is oracle-GATED against the Kerievsky source (D-04: "The target pattern for each
refactoring is stated in the Kerievsky book itself and is oracle-verifiable by oracle-reviewer against
.oracle/refactoring-to-patterns/"). This is what caught Abstract-Factory-vs-Factory in Ch.6. The
AskUserQuestion-owner path is the FALLBACK ONLY -- fired for a specific pattern target the Kerievsky
oracle cannot settle (an `ambiguities` / `error` verdict), NOT for pattern names generally, and NOT a
reason to skip gating target-pattern. GoF prose/code is still never reproduced (DST-04).

## example / walkthrough clause (durable; was passed ad hoc in Ch.7)

For a pattern-heavy leaf, the `example` axis additionally checks: if the compact before/after loses the
teaching that lives in the intermediate states, flag it (`example: partial`) so the driver adds a
`<slug>-walkthrough.md` per the D-06 overflow rule (YAGNI otherwise -- author a walkthrough only when
the compact example genuinely loses the lesson). This is what forced the State walkthrough in Ch.7;
the Ch.8 Interpreter is the next likely trigger.

## mechanics vs composed-primitive de-duplication (Kerievsky leaves)

The `Composed Fowler primitive(s):` field and the primitives cited inline in Mechanics are two
surfaces of the same claim, so a wrong citation tends to fire BOTH mechanics and composed-primitive on
one root cause (seen across Ch.7). To keep directives crisp and avoid double-scoring: let
**composed-primitive** own the aptness of the `Composed Fowler primitive(s):` field; let **mechanics**
own step completeness / order / checkpoints and the aptness of any see-also / inverse cross-ref
citations that are NOT the composed-primitive field. Co-firing is still fine when a leaf genuinely has
both a wrong field entry and a distinct wrong mechanics step.

## How the driver packages the call (unchanged loop, per 07-ORACLE-MODEL "The loop")

Author blind -> deterministic layer FIRST (extract-samples tsc + check-hygiene + field-presence rg +
composed-link resolution) -> `oracle-reviewer` gate with SOURCE = `.oracle/refactoring-to-patterns/index.md`
+ the chapter number/topic (NO sizes -- the reloaded agent self-chunks to EOF; NEVER a book chapter
filename), CONTENT_TYPE `refactoring-leaf`, per-leaf SCOPE, and the axes above -> revise BLIND -> cap
~3 rounds -> escalate non-convergence / unresolvable target-pattern via AskUserQuestion. Main context
never reads `.oracle/` prose (ls for names only). Precedent (Ch.6, Ch.7): converges in 2 rounds; R1
tends to flag composed-primitive aptness + folded mechanics sub-steps.

## Pilot findings (2026-07-06)

The retargeted spirit/judgment axis was pilot-tested before the remaining chapters run, via a
controlled A/B/C/D gate (a fresh `oracle-reviewer`, unbiased -- not told which draft was degraded):

- **A/B/C** = three variants of the SAME Strategy leaf, differing ONLY in the counterweight/stance
  (present / silently removed / apply-always over-claim); mechanics, example, and stated reasons held
  byte-identical. **D** = a real Decorator leaf (breadth).
- **Result:** spirit returned correct / partial / wrong across A/B/C in step, and correct on D. With
  everything else held constant, spirit was by construction the discriminating axis and it discriminated
  -- and it is the ONLY axis that separates B (silent omission -> partial) from C (apply-always ->
  wrong); applicability collapses both to wrong. Discrimination CONFIRMED.

Two issues the pilot exposed, and their dispositions:

1. **Spirit <-> applicability double-scored the over-engineering caveat** (both fired on B and C, same
   content), because for a refactoring-TO-a-pattern the "over-engineering guard" and the
   "don't-use-when-too-simple caveat" are the same source concept. FIXED above: applicability is now
   BARRED from scoring the over-application limit; spirit owns it exclusively; applicability keeps only
   the OTHER caveats. The spirit<->motivation seam was clean only by rule (the apply-always sentence can
   live in Motivation prose) -- also pinned above (over-claim -> spirit, not motivation).
2. **"partial" was overloaded** (generic-guard vs silent-absence). SPLIT above into the two explicit
   sub-cases.

Operational caution (NOT a content regression): the same fresh pass ALSO re-flagged `mechanics` and
`composed-primitive` as `partial` on the already-converged A and D leaves, with directives that partly
CONTRADICT those leaves' Ch.7 R2 `pass` verdicts (e.g. now wanting parameter-extraction /
type-code-to-subclasses cited on Strategy; remove-conditional-via-polymorphism on Decorator). This is
oracle-reviewer run-to-run variance / adversarial oscillation on the composed-primitive axis -- exactly
what 07-ORACLE-MODEL's driver-responsibilities warn about. DO NOT reopen committed, converged leaves on
a single fresh adversarial re-pass; honor the round cap and the converged verdict. Treat a lone
re-flag as noise unless it reproduces or the owner adjudicates.
