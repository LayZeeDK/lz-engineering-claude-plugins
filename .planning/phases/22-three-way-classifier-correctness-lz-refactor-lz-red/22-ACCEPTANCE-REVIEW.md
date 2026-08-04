# Phase 22 -- D-18/SC7 acceptance review and D-26 unprimed review

**Date:** 2026-08-04
**Reviewed at:** `c33a3eb` (all 7 plans executed and merged; full battery GREEN; zero metered spend)
**Verdict at the time: NOT ACCEPTED -- one BLOCKER. Phase 22 did not close on this report.**

> ## SUPERSEDED 2026-08-04 -- ALL FINDINGS CLOSED BY PLAN 22-08
>
> This report is retained as the historical record of the round that BLOCKED the close. Every
> finding below was closed by the gap-closure plan `22-08-PLAN.md`, merged at `63e50d7`. Do not
> read the NOT ACCEPTED verdict above as the current state.
>
> **What closed it.** Plan 22-08 ran through a plan-checker loop that found and fixed TWO BLOCKERS
> IN THE PLAN ITSELF before any code was touched -- a placement instruction that would have broken
> `build-variants.mjs`'s byte-exact `C_POINTER` anchor and taken the D-11 precondition RED, and an
> acceptance criterion that already passed at HEAD pre-edit because the phrase it grepped for is
> line-wrapped. The second is the same vacuity class this whole phase exists to refuse.
>
> **Independent confirmation.** A fresh UNPRIMED reviewer, told nothing about what had changed,
> re-traced the nine corpus requests at the new HEAD and confirmed every item here fixed: the
> plugin-wide file now sweeps clean for skill-relative vantage, its self-description matches
> `git grep` exactly, and the BLOCKER does not appear. `gsd-verifier` then returned `status: passed`,
> 8/8, with all eight structured gaps closed.
>
> **The description criterion is now demonstrably discriminating**, not merely green: measured at
> the pre-edit commit it reports 4 banned tokens across lz-red and lz-refactor; at HEAD it reports 0.
>
> **What the re-review raised that is NOT closed here.** It surfaced a new cluster with one root
> cause -- the a-through-e router was replicated into four files while the three `description`
> fields were never brought level with it. The sharpest instance is that corpus case c1
> ("I just finished making a test pass. What now?") is quoted verbatim as `lz-refactor`'s trigger in
> four files, yet `lz-refactor`'s description never mentions the post-green moment, so the request
> reaches its owner only because `lz-tpp` lexically mis-loads on "test pass" and then hands off.
> `gsd-verifier` ruled these OMISSIONS rather than contradictions, so SC5 is not falsified and they
> are not gaps -- applying the same standard this report used for F-9. They are recorded in
> `22-VERIFICATION.md` as optional improvements. **Timing note: the descriptions were already edited
> by 22-08, so the EVL-01 reciprocal round is already owed; closing these BEFORE that round runs
> costs no additional metered round, whereas closing them after would force a second one.**

Per `22-07-PLAN.md`'s objective ("Escalation on findings"): a BLOCKER from either review is a
gap-closure loop, not a note. Route through `/gsd-plan-phase 22 --gaps` ->
`/gsd-execute-phase 22 --gaps-only`, then resume this gate.

## How this review was run

Three independent reviewers, orchestrator-spawned (the executor has no Agent tool):

| Reviewer | Brief | Scope |
|----------|-------|-------|
| A | UNPRIMED, from scratch -- no contract, no decision list, no hint that anything had changed | all three `SKILL.md` + both edited reference files; asked to trace the nine corpus requests |
| B | CONTRACT-SCOPED -- given D-01/D-02/D-03/SC5 and asked to rule on the NAMED deferred item | same five files |
| C | UNPRIMED, from scratch | `beck-tdd-by-example.md` only (the D-26 gate) |

Reviewers A and C were told nothing about what changed or why. The BLOCKER below was found
independently by A and B; the `beck` findings were found independently by all three.

**Every finding recorded here was re-verified by the orchestrator against the files on disk before
being written down.** Reviewer claims are not taken at face value -- this session already retracted
one executor claim that was false as stated.

## The GREEN gate is structurally blind to most of this

`check-rgr-routing.mjs` exits 0 at this commit. That is not evidence these files are correct:

1. Every entry in `ROUTING_SURFACES` is anchored to a `## ` heading. Both `SKILL.md` intro
   paragraphs sit ABOVE the first such heading, so they are outside all eleven parsed surfaces.
   Two separate defects (F-1/F-2 and F-4) live there.
2. Reviewer B checked the token set directly: `with the tests green` matches NONE of the 17
   `TEST_STATE_TOKENS`. So widening `ROUTING_SURFACES` alone would still not catch F-2.
3. The `description` fields are checked for character cap ONLY, never for routing content -- yet
   the description is the surface that actually decides which skill loads.

This is the same class the phase exists to fix: a green battery coexisting with a defective
classifier.

## BLOCKER

### B-1. `lz-refactor/SKILL.md:26-27` -- in-body handoff contradicts its own frontmatter

```
Behavior changes belong to the green step and its sibling skill lz-tpp.
```

Names only the SECOND hop. D-02 requires an add-or-change-behavior ask with nothing failing yet to
go to `lz-red` FIRST. Every other surface in the same file states the two-hop correctly:

| Surface | Line | Says |
|---------|------|------|
| frontmatter `description` | 16-18 | `use lz-red for the failing test and lz-tpp to pass it` |
| narrative | 48-50 | `hand off to lz-red, then on to lz-tpp once that test is red` |
| step 1 branch (c) | 64-66 | `hand off to lz-red first ... then lz-tpp ranks the transformation` |

The intro is the ONLY surface left stating the single-hop destination, and it is the first prose a
model reads after the H1. This is precisely the dead end ROADMAP SC1 names as a failing request:
lz-refactor pointing at lz-tpp, which declines it by its own description.

SC5 reads "Body and description agree, per skill. Every in-body handoff matches its own
frontmatter." Lines 26-27 are an in-body handoff that does not match its own frontmatter. SC5 is
literally falsified, in the file SC5 names by example.

## Free to fix -- body-only, no `description` touched

These reopen no metered round.

### F-2. `lz-refactor/SKILL.md:23` -- test-state framing in the scope statement

`with the tests green, it recommends the next NAMED refactoring`. Contradicted three times in the
same file: `## Two modes` (34-35, "A target carrying no tests is still coach mode, not an
exclusion"), branch (d) (70-71), and step 5 (107-110). A target with no tests can never have "the
tests green". Fixes in the same edit as B-1.

### F-3. `lz-red/SKILL.md:25` -- `restructuring passing code` (NEW find)

Plan 22-03 deliberately normalized this exact phrase to `Restructuring working code` -- its SUMMARY
records the change -- but only in the narrative at line 41. The intro copy at line 25, sixteen lines
above, was missed. Same structural blind spot as B-1: above the first `## `.

### F-4. `lz-red/SKILL.md:74` -- lz-red is told to hand off to itself (NEW find)

Branch (c) reads `hand off to lz-red first`, inside `lz-red/SKILL.md`. Correct verbatim in the two
sibling files; pasted here without adapting the vantage. The same file's own narrative gets it right
at line 46: `starts here in lz-red`.

Constraint for the fix: the literal slug `lz-red` MUST survive. `destinationsIn()` matches only the
three literal strings and has no self-reference resolution, and corpus case c4 requires the ordered
pair `['lz-red','lz-tpp']`. `starts here in lz-red` satisfies both the slug rule and the vantage.

### F-5. `beck-tdd-by-example.md:49` -- `this skill` in a plugin-wide file

`The second rule is where this skill lives: removing that duplication is a refactoring, done under a
green bar.` Found independently by all three reviewers. Two defects: the pronoun cannot resolve in a
file three skills read (an lz-red reader concludes duplication removal is lz-red's, contradicting
the seam section at 76-78), and `done under a green bar` conditions ownership on suite state.

Already recorded in `deferred-items.md` as a REQUIRED INPUT to this review. Ruled: real, fix it.

### F-6. `beck-tdd-by-example.md:55` -- `the coach`, singular, in a three-coach plugin

`They belong to the green step (lz-tpp / TPP chooses among them); the coach mentions them only to
locate the seam.` Reviewer C's sharpest point: for an lz-tpp reader this is actively harmful, because
Fake It / Triangulate / Obvious Implementation are lz-tpp's core subject matter and this sentence
tells it to mention them only in passing. Found by all three reviewers.

### F-7. `beck-tdd-by-example.md:3-5` -- the reach claim is false for one of the three (NEW find)

The scope line claims the file is shared "so any of the three can name the seams it owns".
Orchestrator-verified: `git grep -F 'beck-tdd-by-example' -- plugins/lz-tdd/skills/lz-tpp/` returns
exit 1 -- genuine absence, positive control passes elsewhere. The only inbound citations are
`lz-red/SKILL.md` and `lz-refactor/references/principles.md`. lz-tpp has no path to this file at all.

Either the claim narrows to the two skills that actually cite it, or lz-tpp gains a citation. This is
a factual overclaim, not a vantage problem.

## Requires metered spend -- OWNER APPROVED 2026-08-04 for inclusion in the gap plan

Editing any `description` reopens the EVL-01 reciprocal trigger regression (D-06) and forces
`/reload-plugins` (D-19). The owner was presented with this cost and chose to include these.

### F-8. The banned test-state string survives verbatim in TWO shipped descriptions

- `lz-refactor/SKILL.md:6-7`: `clean up, tidy, simplify, restructure, or de-duplicate code whose
  tests already pass`
- `lz-red/SKILL.md:16-17`: `Do NOT use it to restructure, clean up, or de-duplicate code whose tests
  already pass`

After YAML `>-` folding -- how the runtime sees it -- both read `code whose tests already pass`,
which is `TEST_STATE_TOKENS[10]` verbatim. D-03 removes test-state keying from routing, and the
description is the highest-leverage routing surface in the system.

Consequences reviewer B traced: lz-refactor's leading trigger clause gates on a state its own
`## Two modes` disavows; and lz-red's exclusion is state-qualified, so a cleanup ask on an UNTESTED
target falls outside the exclusion and can trigger lz-red -- which its own branch (d) then routes to
lz-refactor.

**Binding constraint: `lz-red`'s folded description is 1439 chars with only 97 of headroom under the
1536 cap.** Its rewrite must be length-neutral or shorter. `lz-refactor` has 167; `lz-tpp` has 696.

### F-9. `lz-tpp/SKILL.md:3-14` -- the description never names `lz-refactor`

Its refactoring exclusion and its add-a-feature exclusion both name no destination, while the body
names both (line 49, lines 72-73). lz-red's and lz-refactor's descriptions each name both siblings;
lz-tpp names only lz-red. Incomplete rather than contradictory -- an asymmetry, not an SC5 violation.
Ample headroom (696 chars).

## Design questions raised by two independent reviewers -- rulings needed, not obviously defects

### Q-1. Branch (d)'s trigger is itself a suite-state report

Reviewers A and C both flagged that `saying "I just finished making a test pass, what now?"` is a
statement of suite state, sitting inside the step that opens `never by the state of the suite`.

Note this is corpus case c1 -- the canonical post-green request whose mis-routing created this phase.
A defensible reading is that the ASK is "what now" and the utterance is context, not a condition. But
two independent reviewers reading cold both saw a contradiction, which is itself evidence the wording
teaches the wrong pattern. Worth an explicit carve-out sentence rather than silence.

### Q-2. No compound-ask rule exists anywhere

Corpus case c8 ("What test comes next, and can you also tidy the helper?") matches branch (a) first,
so the mandated first-match rule awards the WHOLE request to lz-red -- including a tidy lz-red's own
description forbids. The gate passes because it asserts exactly one owner, and c8 has one. Whether
first-match is the right policy for a compound ask is a design decision no file states.

### Q-3. The router is duplicated five times and has begun to drift

The untested-target carve-out in branch (d) is present in all three `SKILL.md` files and absent from
both reference copies. Outcome for c7 is unaffected, but there is no single normative source the
others defer to -- each restates the full table. This is the drift risk variant C was designed to
address, which the halted A/B has not yet measured.

## Verified as genuinely sound

Recorded so the gap plan does not churn what is already correct:

- **D-01 holds across all six classifier surfaces.** Every lettered branch names exactly one owning
  slug; the residual names none and is slug-free in all five surfaces. No branch anywhere routes
  leftovers to a specific skill.
- **Self-naming holds.** Every branch carries a literal slug, including each skill's self-owning
  branch. No `this skill` / `stay here` inside any routing branch in any of the five files.
- **D-02's authority hygiene is correct.** The leaf cites Law 1 for the FIRST hop only and attributes
  the handoff framing to the Law-3 reframe, tagged `lz-red orchestration, no-oracle`, explicitly not
  a restatement of the law's source. No book backing is claimed for the handoff anywhere.
- **The leaf's self-describing promise is TRUE.** `three-laws-and-test-selection.md` closes by
  claiming it states the same split as the SKILL.md router; reviewer B checked branch by branch and
  confirmed same conditions, same owners, same first-match order, same slug-free residual.
- **lz-tpp sequences its suite-state check correctly** -- the green-phase confirmation is explicitly
  gated on `Once a branch below has settled this as the green step`, so it never decides ownership.
- **The Triangulate seam is drawn carefully** and is the one concept both lz-red and lz-tpp could
  plausibly claim.
- **The residual terminal exists at all** -- an explicit no-owner branch is unusual and correct.
- **Provenance discipline is honest** -- per-claim tiers, and an active correction of a prior
  misattribution rather than papering over it.

## Not in scope for this review

`22-07`'s own finding -- that Round A's ROLLUP steps (`tabulate-mechanical-red.mjs` and
`merge-judge --verify`) cannot reach the routing suite -- is recorded in `deferred-items.md` and in
`RUN-GATE.md` under KNOWN GAPS. It blocks the A/B writeup, not the capture, and it is a separate
gap from this review's findings.
