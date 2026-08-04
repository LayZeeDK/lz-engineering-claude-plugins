# Quick task 260804-jay -- deferred items

From an UNPRIMED review briefed to ATTACK the gate rather than confirm it. It applied 17 mutations to
tracked files, each verified present before the gate ran and each restored with a checksum; **16 left
the gate GREEN**. Its verdict was NEEDS WORK.

Three of those were this task's targets and are CLOSED. A fourth (the folded-description vacuity) was
closed here because it invalidated evidence cited earlier in the session. **The rest is recorded, not
fixed.**

**Why not fixed.** This repo's record is explicit that consecutive hand-patching rounds each introduce
a fresh instance of the class they repair, and this task demonstrated it three times over -- two false
comment claims and a double-space bug in the very fold repair, all mine, none caught by me. A fifth
round in the same session is the documented way to add a fifth defect. The reproductions below are
precise enough to execute cold.

**None of this is a defect in the shipped routing text.** The reviewer traced all nine corpus cases at
both tiers and found the owners correct. These are limits on what the gate would CATCH.

---

## OPEN-1 (BLOCKING) -- the sweep-rule citation check is TAUTOLOGICAL

`check-rgr-routing.mjs`, the `[cls-03] sweep-rule citation` block, and its
`behaviorChangeDestinations` construction.

`"changing behavior"` is listed as a behavior-change ask token and tested with a plain
`cond.includes(t)`. Branch `1d` of `refactor-step1` reads *"Asking to improve structure or readability
**without changing behavior**"* -- the exact negation -- so `1d`'s destination `lz-refactor` is
admitted into the set. Measured through the gate's own parser:

```
#1b: tokens=[failing test pass]   destinations=[lz-tpp]
#1c: tokens=[add a new behavior]  destinations=[lz-red, lz-tpp]
#1d: tokens=[changing behavior]   destinations=[lz-refactor]   <-- from "WITHOUT changing behavior"
behaviorChangeDestinations = {lz-tpp, lz-red, lz-refactor}
```

With all three skills in the set, `unresolved` is empty for any cited slug and the check collapses to
`citing.length > 0` -- "some sweep sentence contains the literal string `(step 1)`". It printed
`[PASS] ... cites [lz-tpp, lz-red], each a step-1 behavior-change destination` **while the citation was
swapped**, and again while it cited `lz-refactor` alone. The `report()` detail string asserts a property
the code cannot check.

**Fix.** Route the behavior-change side through the same negation-aware matcher the citing side uses
(`destinationsIn` / the `NEG` clause logic), or drop `"changing behavior"` for tokens that cannot
appear inside `without ...`. Add a control asserting the set is a strict subset of the three names.

---

## OPEN-2 (IMPORTANT) -- five of eight router surfaces have NO correctness assertion

`STEP1_SURFACES` filters on `parseMode === "lettered"`, so `refactor-narrative`, `red-narrative`,
`tpp-narrative`, `laws-classify` and `beck-seam` get only scan floor + catch-all + single-axis. No
exhaustiveness, no at-most-one, no destination correctness.

That matters because each step-1 procedure DELEGATES to its narrative -- `lz-red/SKILL.md` step 1 says
*"See 'RED vs the green step ...' above; do not restate it"* -- so the narrative is the authoritative
statement of the routing it points at.

**Reproductions, both GREEN:**
- in `lz-red/SKILL.md` `red-narrative`, replace *"An ask to make a failing test pass is the green step:
  hand off to lz-tpp."* with *"An ask to make a failing test pass is also the red step, and that step
  is lz-red."*
- in `plugins/lz-tdd/references/beck-tdd-by-example.md` `beck-seam`, change `green step is lz-tpp` to
  `green step is lz-refactor`.

**Fix.** Run `routesCase` over every `kind: "router"` surface, not just the lettered three. Mode gates
stay excluded (they name no destination by design). Note this may legitimately go RED -- the narratives
are prose and may not carry every case's ask-words -- so measure first, exactly as this task measured
0-of-27 before committing to the per-surface shape.

---

## OPEN-3 (IMPORTANT) -- `owns()` inspects only `destinations[0]`

`lib/routing-parse.mjs`, `owns`. For a single-hop case nothing constrains `destinations[1..]`, so a
branch may name the right owner first and then contradict itself.

**Reproduction, GREEN:** in `lz-tpp/SKILL.md` branch `1b`, append to the green-step branch *"...so do
not answer it here; hand the whole request over to lz-refactor and let it pick the change."*
`destinations` becomes `[lz-tpp, lz-refactor]`, `destinations[0]` still matches, gate green.

**Fix.** When `expectedSecondHop` is null, require `destinations.length === 1`.

---

## OPEN-4 (IMPORTANT) -- the declared residual can claim everything

`lib/routing-parse.mjs`, `isBareCatchAll`'s `&& !isResidual` conjunct plus `isDeclaredResidual`
requiring only zero LITERAL-slug destinations. Because `destinationsIn` deliberately does not resolve
the house self-reference form, a terminal can carry both halves of the residual marker AND claim the
request for itself.

**Reproduction, GREEN:** extend `lz-refactor` branch `1e` with *"In practice almost every request that
mentions code at all lands here, and when it does, answer it here as part of this skill's own work and
continue here."* Still counts as claiming nothing.

**Fix.** Flag a declared residual whose text also contains a self-claim (`this skill`, `continue here`,
`answer it here`, `here as part of`) -- the same house vocabulary the parser already refuses to resolve.
Recorded in the code at `isBareCatchAll` so a maintainer meets it there.

---

## OPEN-5 (IMPORTANT) -- the catch-all family is a literal blocklist

Now NAMED as a ceiling in the code (this task fixed the comment that overclaimed "closes the
evasion"), but not closed. **Reproduction, GREEN:** insert *"In all remaining cases the refactor step
takes the request, and that is lz-refactor."* before branch `e.` -- not a listed wording.

Same class as the `TEST_STATE_TOKENS` ceiling, which has now been hit three times. There is no fix
that makes a blocklist exhaustive; the honest complements are the metered eval and human review.

---

## OPEN-6 (IMPORTANT) -- every `## Two modes` gate fails to classify what its own step 1 claims

No assertion covers mode-gate COVERAGE (mode gates are token-scanned only), so this is invisible to
the gate.

| Skill | Gap |
|-------|-----|
| `lz-red` | Coach = "which failing test to write next or how to shape it". **c3** ("Is this a good test?") is claimed verbatim by its description AND branch `1a`, but matches neither mode. c1/c5/c6/c7 are claimed by branches for hand-off with no mode admitting them |
| `lz-tpp` | **7 of 9** corpus requests match neither mode, yet step 1 claims to classify all nine. Compounded by step 2's "Once branch (b) has settled this as the green step": the mode gate must admit the request before step 1 can decline it |
| `lz-refactor` | Best covered (c1/c5/c7 land in coach mode, untested targets explicitly admitted), but c2/c3/c4/c6/c9 are claimed by branches matching neither mode |

A consistent structural gap: every mode gate scopes to its own work while every step-1 procedure is
written as a whole-loop router. **Fix** is prose plus a new assertion, and it touches three shipped
`SKILL.md` bodies -- free of metered implication, but it is real scope.

---

## OPEN-7 (IMPORTANT) -- the intro two-hop check tests mention ORDER, not the hop

It requires only that `lz-red` is affirmed at a lower index than `lz-tpp`.

**Reproduction, GREEN:** rewrite lz-refactor's intro to *"...is this skill's own work start to finish:
lz-red and lz-tpp cover the loop's other two beats, so continue here and change the code directly."*
An ordered mention that DENIES both hops satisfies the check.

**Fix.** Additionally require a first-hop phrase (`red step first`, `opens the red step`) in the same
sentence as `lz-red`.

---

## OPEN-8 (MINOR) -- the rest

| id | Where | Finding |
|----|-------|---------|
| 8a | `destinationsIn` | Scores `lz-refactor` as NEGATED in lz-red's intro, because the house phrase is "restructuring working code **without** changing behavior" and `NEG` matches `without`. Measured: `lz-red intro hops=[lz-tpp]`. Harmless today (nothing asserts that intro's hops) but it is the same root cause as OPEN-1 and it hides destinations in `without`-clauses generally |
| 8b | `## QUESTION vs COMMAND intent routing`, `## Whole-package / directory sweeps` | Read by the citation check but not `ROUTING_SURFACES` entries, so neither single-axis check reaches them. The QUESTION/COMMAND check asserts only that the heading exists and is named verbatim; its BODY is read by nothing. Reproduction: rewrite that section to "Drive by default; ask only when stuck ... edit the working code yourself and run the suite" -- GREEN |
| 8c | Unanchored `## ` sections | `lz-red`: Listen to the tests, Reference material. `lz-tpp`: Transformations vs refactorings, Amended red-green-refactor, TPP is a heuristic, Reference material. `lz-refactor`: QUESTION vs COMMAND, Whole-package sweeps, 7 catalog-pointer sections. A literal banned token in `lz-tpp`'s `## Transformations vs refactorings` went GREEN |
| 8d | `rgr-cases.json` | The corpus's own shape is unasserted: nothing pins that exactly one case carries `expectedSecondHop`, that owners are drawn from the three slugs plus NONE, or that exactly one case is NONE. Changing `"expectedSecondHop": "lz-tpp"` to `null` on c4 silently RETIRES the D-02 ordered-pair assertion -- GREEN |
| 8e | `selftest` | `corpusFloorOk`, `scanFloorOk`, `hopsOrderedOk` and `flatten` are still hand-restated rather than imported -- the same drift shape fixed for `coveredBy`. `corpusFloorOk` does NOT model the gate's `STEP1_SURFACES.length !== 3` clause, so that clause is unguarded. No leg drives `numberedItem` for `n != 1`, and items 2..N being out of scope is untested and unstated |
| 8f | `routing-parse.mjs` two stale comments | The `TEST_STATE_TOKENS` seed comment still presents four "MEASURED live sites" (the tests-are-green gate in lz-refactor's Two modes, the failing-red-test-plus gate in lz-tpp's Two modes, the all-prior-tests-green precondition, the already-passing-code catch-all phrasing) -- **none exists in `plugins/` today**, each verified absent with a positive control. And the `destinationsIn` note claims "today's shipped self-owning branches use the house self-reference form, so they parse to zero destinations for their own owner" -- false: `red-step1#1a` is `[lz-red]`, `tpp-step1#1b` is `[lz-tpp]`, `refactor-step1#1d` is `[lz-refactor]`. Acting on that comment would revert branches into the form the gate cannot verify |

---

## Recommended sequencing

1. **OPEN-1** first -- it is a check that currently asserts something it cannot see, which is worse
   than a missing check because it reads as coverage.
2. **OPEN-3, OPEN-4, OPEN-7** together -- three narrow predicate tightenings, each with a one-line
   reproduction above that becomes its acceptance test.
3. **OPEN-2** with a measure-first step, exactly as this task pre-measured 0-of-27 before committing.
4. **OPEN-8d and 8e** -- cheap, and 8d protects the D-02 assertion from being retired by a one-word
   edit.
5. **OPEN-6** is the largest and the only one touching shipped prose; it deserves its own task.
6. **OPEN-5** is not closeable. Keep it named.

The 16 reproductions in this file and in `260804-hwy-deferred-items.md` are the acceptance suite for
all of the above. Re-run them as a set: anything that flips from GREEN to RED is progress, and anything
already RED must stay RED.
