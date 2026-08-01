# Quick Task 260801-sc9: Complete "distinguish, but prove it first" for the test double taxonomy for the lz-red skill - Context

**Gathered:** 2026-08-01
**Status:** Ready for planning, with ONE UNRESOLVED blocker recorded below
**Mode:** `--full --auto` (discussion auto-locked except the trap-quadrant item)

<domain>
## Task Boundary

Complete the D-12 ruling "distinguish, but prove it first" for the test-double taxonomy in `lz-red`.

D-12 (recorded in `.planning/quick/260729-lc9-.../260729-lc9-CONTEXT.md`) ruled that the runtime
artifact is to be **authored, then A/B'd** against the no-artifact baseline using at least two
genuinely ambiguous prompts, and **shipped ONLY on measured lift**. It is explicitly "NOT abandoned
and NOT approved for shipping".

The task therefore decomposes into four steps, of which only the first two are in scope here:

1. Author the runtime artifact (the treatment arm). IN SCOPE, zero spend.
2. Wire the A/B so it is runnable (treatment plugin dir + arm composition). IN SCOPE, zero spend.
3. Author >= 2 genuinely ambiguous prompts + choose a target. **BLOCKED -- see UNRESOLVED-1.**
4. Run the A/B, then ship or close `FUT-TAXONOMY-SHARED` as DECLINED. **BLOCKED on metered approval.**

**This task is BUILD-THEN-HALT.** "Prove it first" is by definition a metered run, and the standing
eval-run-approval-gate means `--auto` cannot authorize that spend. The task completes at the gate.

</domain>

<decisions>
## Implementation Decisions

### Treatment artifact location -- OUT of the shipped tree (auto-locked, HIGH confidence)

The artifact MUST NOT be authored into `plugins/`. Guard N3 in
`.claude/skills/lz-red-workspace/tools/check-red-references.mjs` walks the ENTIRE `plugins/` tree and
fails by name on any file whose basename STEM is `test-double-taxonomy`, regardless of extension.
Authoring it there turns the reference battery RED.

Renaming the artifact to evade the stem match is REJECTED. N3's own comment records that this
constraint "was violated ONCE ALREADY and survived three consecutive acceptance reviews, for exactly
one reason: nothing checked it" -- and the stem match exists precisely because a `.txt` copy slipped
past an earlier filename-scoped needle. Dodging the guard by renaming is the evasion it was
hardened against.

Confidence is HIGH because the alternative is not merely worse, it is forbidden twice over: N3
fails the battery, and D-12 requires the shipped tree to REMAIN the no-artifact baseline arm.

### A/B mechanism -- `--plugin-dir` toggle (auto-locked, HIGH confidence)

`run-e2e.mjs` already composes arms by toggling `--plugin-dir` and already parameterises a second
plugin directory (`MATTPOCOCK_DIR` alongside `PLUGIN_DIR`), so a treatment plugin dir is an
extension of an existing mechanism rather than new machinery. The project precedent is the
lz-refactor EDITED-vs-PREEDIT toggle, which A/B'd a skill edit the same way.

Baseline arm = the shipped `plugins/lz-tdd` (no artifact). Treatment arm = a copy carrying the
artifact. The shipped tree is never mutated, so N3 stays green and the baseline survives
BY CONSTRUCTION rather than by discipline.

### Artifact content -- distil the remediated archived taxonomy (auto-locked, MEDIUM-HIGH confidence)

The source is `.planning/research/test-double-taxonomy.md`, already hardened across four
remediation rounds (`260728-j9m` four provenance defects; `260728-wev` re-axis + drop the coinage;
`260729-2ig` argumentation and attribution; `260729-lc9` scope-to-planning). Re-deriving from
scratch would discard that work and re-open closed provenance findings.

One consequence worth noting: the archived document justifies omitting a matrix diagram on the
grounds that "this page is read mid-cycle" -- a claim the `lc9` research flagged as FALSE once the
page became an inert `.planning/` record (finding S3). Distilling it back into a runtime artifact
makes that justification TRUE again.

### Provenance -- DST-04 own-words, re-gated on the shipped form (auto-locked, HIGH confidence)

The artifact cites Meszaros and Fowler. Any runtime form must be own-words per DST-04, and the
`pattern-leaf-intent-near-verbatim` trap applies: canonical one-line definitions reproduce
near-verbatim in blind drafts. The archived source is already remediated, but the DISTILLED form is
a new artifact and must be re-gated by `oracle-reviewer` before it is treated as shippable.

### Claude's Discretion

- Exact path and directory shape of the treatment plugin copy, subject to it being outside
  `plugins/` and git-ignored or otherwise not shipped.
- Whether the treatment copy is a full plugin tree or a minimal overlay, provided `--plugin-dir`
  loads it and the CLI's `system/init` advertises `lz-red`.
- Wording of the distilled artifact, subject to DST-04 and the oracle-reviewer gate.

</decisions>

<unresolved>
## UNRESOLVED-1 (BLOCKER) -- the ambiguous-prompt corpus and its target

**NOT auto-locked. This is the `--auto` trap quadrant: HIGH impact, NOT-HIGH confidence.**

D-12 requires "at least two genuinely ambiguous prompts". The supporting measurement the owner
weighed is that **zero of the 59 prompts in lz-red's existing eval corpora are genuinely
ambiguous** -- so no existing prompt or suite can carry this A/B, and the corpus must be authored
new.

Why confidence is NOT high:

- There is no precedent for an "ambiguous prompt" in this instrument, and the RUN-GATE's 7-point
  target qualification checklist does not contain the criterion. It is a new axis.
- The measurement must turn on the model's test-double VOCABULARY/classification choice, while every
  existing cell grades a produced test's RED correctness. These are different dependent variables,
  and the existing D-06 gate does not score naming.
- This project has just been burned by exactly this failure mode. RXL's mechanical verdict was
  ruled DESIGN-CONFOUNDED because "the pass/fail split tracks WHICH INJECTION TOKEN the model
  imagined, not RED discipline". An ambiguity corpus chosen carelessly reproduces that error with a
  different variable.

Competing options, none auto-lockable:

- **(A) New dedicated suite** with a target where stub-vs-mock materially changes the correct test.
  Cleanest measurement; highest authoring cost; needs a fresh target qualification.
- **(B) New prompts against an existing target** (GRC / SRVC / RXF). Cheap; but those targets were
  chosen to stress RED discipline, and none is known to make the double-kind choice load-bearing.
- **(C) A non-apply judged probe** -- ambiguous prompt, grade the model's stated classification
  rather than a produced test. Cheapest and most direct for a vocabulary question; but it is
  coaching-prose grading, which D-02 moved this milestone AWAY from, and Phase 20 showed such
  graders measure house vocabulary rather than substance.

**Terminal action for this headless pass:** recorded here as UNRESOLVED. Steps 1-2 proceed and do
not depend on it. Step 3 needs an owner decision; step 4 additionally needs metered approval.

</unresolved>

<specifics>
## Specific Ideas

- `FUT-TAXONOMY-SHARED` in `.planning/REQUIREMENTS.md` already specifies the SHIP destination if the
  A/B shows lift: ONE plugin-wide shared reference at `plugins/lz-tdd/references/`, cited as INLINE
  CODE carrying `${CLAUDE_PLUGIN_ROOT}`, never as a Markdown link -- because guard N2 existsSync-checks
  any target it classifies as `relative`, and a variable-prefixed path is classified relative yet can
  never resolve on disk.
- That destination already exists and has a precedent occupant: `beck-tdd-by-example.md` was
  relocated there by `23c8ee2` as a reference shared by lz-red and lz-refactor. The taxonomy would
  be the second such shared reference, using the identical citation form.
- If the A/B shows NO lift, `FUT-TAXONOMY-SHARED` closes as DECLINED and the shipped tree does not
  change -- a legitimate and pre-authorized outcome, not a failure.

</specifics>

<canonical_refs>
## Canonical References

- `.planning/quick/260729-lc9-scope-the-test-double-taxonomy-to-lz-red/260729-lc9-CONTEXT.md` -- D-12
  itself, the ruling and its two supporting measurements.
- `.planning/REQUIREMENTS.md` -- `FUT-TAXONOMY-SHARED`, the ship destination and its citation form.
- `.claude/skills/lz-red-workspace/tools/check-red-references.mjs` -- guards N2 (link resolution) and
  N3 (no taxonomy copy in the shipped tree).
- `.planning/research/test-double-taxonomy.md` -- the remediated source document.
- `.claude/skills/lz-refactor-workspace/e2e-nx/run-e2e.mjs` -- the `--plugin-dir` arm composition.

</canonical_refs>
