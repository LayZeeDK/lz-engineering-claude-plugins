# Quick Task 260801-w8b: D-12 Option A dedicated apply suite - Context

**Gathered:** 2026-08-01
**Status:** Ready for research, then planning
**Mode:** `--full --auto`

<domain>
## Task Boundary

The owner selected **UNRESOLVED-1 OPTION A**, verbatim:

> **(A) New dedicated suite** with a target where stub-vs-mock materially changes the correct test.
> Cleanest measurement; highest authoring cost; needs a fresh target qualification.

This supersedes an earlier misread in which Option C (a non-apply judged probe) was built. That work
is ABANDONED and archived at `D:/.lz-red-archive/2026-08-01-optionC-abandoned/`; its edits to
`evals.json`, `grade-run.mjs` and `check-evals.mjs` were reverted. Do not revive it.

This is a BUILD-THEN-HALT task. The metered A/B run is a separate, already-approved step that the
ORCHESTRATOR drives; the executor builds and must not spend.

</domain>

<decisions>
## Implementation Decisions

### The discriminator is the Metz message matrix (auto-locked, HIGH confidence)

"Stub-vs-mock materially changes the correct test" is pinned to the rule `lz-red` ALREADY teaches and
that the taxonomy artifact sharpens: assert the RETURN of an incoming query; assert the public side
effect of an incoming command; ignore self and outgoing queries; expect-to-send ONLY for an outgoing
command. The taxonomy's own discriminator agrees -- Spy versus Mock is about WHERE THE ASSERTION
LIVES, not about how capable the object is.

So the target must involve a collaborator interaction where ONE of these is right and the other is a
real error, not a style preference.

### The wrong choice must be MECHANICALLY visible, not merely judged (auto-locked, HIGH confidence)

This is the strongest requirement and it is what makes Option A "the cleanest measurement".

Pick a target where choosing the WRONG double kind produces a mechanically detectable outcome under
the EXISTING D-06 gate -- a `false_green` (the test passes on current code) or a double with zero
diagnostic power. Then the primary dependent variable needs no new grader and cannot be gamed by
vocabulary, which is the failure mode that inflated the Phase 20 result roughly threefold.

There is precedent that this property is findable: the srvx target's own notes record "the naive
fabricated double is green BEFORE AND AFTER a correct fix... ZERO diagnostic power, not merely a
false green", described there as the strongest property measured anywhere in the target search.

### Three arms, one baseline (auto-locked -- owner instruction "Widen")

- `invoke_skill` -- BASELINE. Shipped lz-red. Note it ALREADY carries the rule inline at
  `SKILL.md:101-104`, so the baseline is not artifact-free.
- `invoke_treatment` -- the PASSIVE lever: + the taxonomy reference.
- `invoke_forcing` -- the ACTIVE lever: + an always-active classify-before-answering step, and NO
  reference.

Rationale: passive content is 0-for-5 in this project; the single lever that ever moved this axis was
an always-active forcing function in SKILL.md (`lz-refactor/SKILL.md:88-109`), which flipped 0/3 to
5/5 and shipped. Two arms could not tell the levers apart.

`invoke_forcing` must NOT contain the taxonomy content, or it collapses into `invoke_treatment`. Arm 3
tells the model to LOOK; arm 2 gives it the TABLE.

### Partially built already -- reuse, do not rebuild (auto-locked)

Uncommitted in the working tree and VERIFIED to parse: `run-e2e.mjs` carries `invoke_forcing` in the
validated arm list at `:194`, composes it identically to `invoke_skill` at `:265`, and
`build-treatment.mjs` was extended toward emitting both trees. These are design-agnostic and carry
over from the abandoned Option C pass. Verify them rather than re-authoring them, and confirm both
new arms are EXCLUDED from `--arm all` so crux 6's pinned dry-run stays byte-identical.

Also present and untracked: `.claude/skills/lz-red-workspace/probe-d12-ambiguity/`, an Option C
leftover. It is archived; remove it or leave it out of the suite, but do not build on it.

### Grading (auto-locked)

The D-06 correctness gate carries the primary variable per the mechanical-visibility decision above.
Add AT MOST ONE blind-judge dimension for double-kind appropriateness, and never a `phraseSet` for it
-- the treatment IS the vocabulary, so a phrase matcher scores it high by construction. Do NOT score
"did it ask which side / which kind"; the artifact and the forcing step both instruct that behaviour,
so scoring compliance hands both treatment arms a win they did not earn. Record asking as an outcome.

### Claude's Discretion

- Whether the new suite borrows an already-vendored repo or a genuinely new one, subject to the
  qualification gates below. A new SUITE does not strictly require a new REPO.
- Suite directory name within the `e2e-red-*` auto-discovery namespace.
- Prompt wording, subject to the non-leading constraints.

</decisions>

<unresolved>
## Target selection -- DELEGATED TO RESEARCH, not auto-locked blind

Target choice is HIGH impact, but it is RESEARCHABLE rather than low-confidence, so it is not the
`--auto` trap quadrant. Research must qualify candidates against the RUN-GATE's 7-point checklist and
return EVIDENCE per point; the orchestrator gates the final pick before any vendoring.

Two hard gates that are NOT discretionary:

1. **Package-legitimacy gate (T-21-SC).** Any NEW repo must be confirmed real and maintained --
   registry age, downloads, source repo, licence, not deprecated -- BEFORE `npm install` or
   vendoring. If an install fails, do NOT auto-substitute a similarly-named alternative; surface it.
2. **Contamination must be assessed and FLAGGED**, not assumed low, so a tie is read correctly. A
   correctness tie on a contaminated target is pass-at-ceiling, not evidence of inertness.

`ngbracket/ngx-layout` is PERMANENTLY CLOSED with evidence and must not be revisited.

</unresolved>

<specifics>
## Specific Ideas

- The `e2e-red-*` prefix is an AUTO-DISCOVERY namespace: `selfcheck-red.mjs` and
  `tabulate-mechanical-red.mjs` both walk it. A new suite therefore inherits the full crux-2 entry
  cost -- a byte-identical apply preamble, every prompt naming its target's pinned `test_dir`, a
  NON-EMPTY `prompt_forbidden_tokens` list (crux 2 FAILS a target declaring an empty one), no
  test-state claim in any prompt, and a poisoned variant provably caught. Option A is not
  "a suite.json plus a prompt file".
- `suite.json`'s `repo` must be git's OWN path string, taken with BOTH flags:
  `git --git-dir=<repo>/.git --work-tree=<repo> rev-parse --show-toplevel`. With `--git-dir` alone git
  resolves the work tree from the current directory and returns the wrong repo.
- The tabulator FAILS CLOSED if two suites produce the same `target:pid|arm` key, so the new cell key
  must be globally unique against `GRC`, `SRVC`, `RXF`, `RXL`.
- Per-grade cost is per target: GRC ~4.9 s, SRVC ~8.5 s plus prebuild, radix ~34.8 s plus ~19 s atc.
  Prefer a small tree; a large `node_modules` dominates grading time.

</specifics>

<canonical_refs>
## Canonical References

- `.claude/skills/lz-red-workspace/e2e-red-gilded-rose/RUN-GATE.md` -- the 7-point target
  qualification checklist (Step 1), the crux inventory (Step 2), and the per-target cost table.
- `.claude/skills/lz-red-workspace/e2e-red-srvx/` -- the closest existing precedent for a
  double-design target, including its measured zero-diagnostic-power note.
- `.planning/quick/260801-sc9-.../260801-sc9-RUN-GATE.md` -- UNRESOLVED-1 verbatim and the DST-04
  gate status on the treatment artifact.
- `plugins/lz-tdd/skills/lz-refactor/SKILL.md:88-109` -- the shipped forcing-function precedent that
  arm 3 mirrors in shape.
- `plugins/lz-tdd/skills/lz-red/SKILL.md:101-104` -- the inline rule the BASELINE already carries.

</canonical_refs>
