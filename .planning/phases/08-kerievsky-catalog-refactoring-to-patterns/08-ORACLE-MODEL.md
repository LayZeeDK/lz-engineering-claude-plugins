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
  - partial: a counterweight is present but generic (not tied to THIS pattern's specific
    over-application failure mode).
  - wrong: the pattern is presented as an unconditional good (apply-always), or the counterweight
    contradicts the source.
  - Ownership seam (parallel to the mechanics/composed-primitive split below, to keep axes orthogonal):
    `motivation` owns the fidelity of the reasons/force; `applicability` owns the fidelity of the
    source's specific caveats (none invented); `direction` owns the To/Towards/Away label (an inverted
    label fires `direction`, NOT `spirit` -- no double-score); `spirit/judgment` owns ONLY the presence
    + non-contradiction of the earn-it-vs-over-engineer counterweight. A leaf can pass motivation,
    applicability, AND direction yet still fail spirit if it never states the counterweight (reads as
    apply-always).
  - Keep the discriminator OBSERVABLE (is an explicit over-engineering / premature-pattern counterweight
    present and consistent with the source?), NOT "the emphasis the source stresses" -- this is the
    softest axis and the one most prone to false-`revise`/oscillation, so lean on presence + the round
    cap + owner escalation rather than a subjective emphasis judgment.
  - Honest status: this is a FORWARD-LOOKING bet, not a proven catcher. Its feeder signals are near-dead
    on the 12 done leaves (direction 0 fires; generic spirit 0). The justification is (a) the
    counterweight is the content Phase 9's de-patterning coach consumes (CCH-02), and (b) the presence
    obligation changes authoring behavior -- not that it has caught anything yet. Re-evaluate after
    Ch.8-11 whether it earns its place. This mirrors the Phase-7 precedent of retargeting spirit rather
    than dropping it.

For `smell-leaf` content (the Ch.4 fold, 08-06): keep spirit/judgment in the base generic judgment form
(07 anchor). The one useful refinement seen in practice is severity-judgment (is the smell's severity /
when-it-is-actually-acceptable framed as the source does -- e.g. refused-bequest as a usually-mild
judgment call, the single time the axis fired). Do NOT apply the counterweight retarget to smells (they
have no Direction field).

**The 12 Ch.6-7 leaves (already shipped) were gated PRE-retarget** (generic spirit), so they were not
gated on the counterweight obligation. They were spot-checked: each already carries an over-engineering
counterweight in its `## Watch for` (e.g. Strategy "never a third case", Decorator narrow-interface,
Composite "shallow tree", Compose Method "do not over-extract"; Ch.6's "single obvious construction
gains nothing", "a Composite clients rarely build by hand does not need a builder"), so they satisfy
the PRESENCE obligation as-authored -- accepted as-is, no oracle re-gate. The retarget governs Ch.8-11
gating only. If the owner wants uniform enforcement, presence (not fidelity) is cheaply checkable
deterministically and could be added at the 08-06 gate; fidelity stays the reviewer's job going forward.
Flagging this so the two-tier gating is explicit, not silent.

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
