---
phase: 22-three-way-classifier-correctness-lz-refactor-lz-red
extracted: 2026-08-04
plans: 8
metered_spend: none
---

# Phase 22 -- Learnings

## Decisions

### Instrument-first sequencing turns a judgment call into a measurement

Wave 1 authored the routing gate and asserted it RED (20 FAIL / 34 PASS) while touching zero shipped
Markdown. That baseline let wave 2's acceptance be stated as a falsifiable target rather than a review
opinion: the executor was handed its eighteen owned failures verbatim, told which two belonged to a
later plan, and told which case already passed and must not regress. It landed exactly that.

Do this whenever the deliverable is prose or configuration, where "looks right" is otherwise the only
available standard. The cost is one extra wave; the return is that every later acceptance is arithmetic.

### A GREEN battery is a floor, never a verdict

The phase existed because a green 125-check battery coexisted with a non-exhaustive classifier. It then
reproduced the same failure inside itself: `check-rgr-routing.mjs` reached 0 FAIL over eleven surfaces
and nine corpus cases while the phase's own headline defect sat live in a shipped file.

Keep the independent review gate even when every mechanical check is green. The gate found what the
instrument could not, twice.

### Omission is not contradiction -- apply the standard symmetrically

Late review raised that the three `description` fields advertise less than their bodies own. Ruled
OMISSION rather than contradiction, so the "body and description agree" criterion was not falsified --
the same standard an earlier reviewer had applied to a structurally identical finding. Deciding this
consistently mattered more than deciding it strictly; an inconsistent bar is how a phase never closes.

## Lessons

### A guard anchored to structure inherits that structure's blind spots

Every parsed surface in the gate was anchored to a `## ` heading, so prose ABOVE the first heading was
outside all eleven surfaces. Both the phase's BLOCKER and a second defect lived there. Worse, the
banned-phrase token set did not contain the exact wording used, so widening the surfaces alone would
still have missed one. And `description` fields were checked for character cap only -- length, never
content -- while being the surface that actually decides which skill loads.

Ask of any structural guard: what region does the anchor EXCLUDE, and is anything load-bearing there?

### A negative check is not evidence until a positive control passes on the same path

This fired four times in one phase, in four different disguises:

1. A plan's acceptance criterion grepped for a phrase that WRAPS across lines, so it returned "clean"
   at HEAD before any fix existed. The gap had zero falsifiable acceptance.
2. `rg -E` is not a valid flag; the command exited 2 with no output, and the `|| echo "NONE"` fallback
   fired on the FAILURE, reading as absence.
3. An `rg` piped into `sort` captured `sort`'s exit code, so a hygiene check reported the wrong status.
4. A wrap-tolerant pattern still under-reported because the wrap fell at a different word join than the
   `\s+` allowed for.

Rule: check the exit code (0 = hits, 1 = genuine absence, 2 = the command failed), run a positive
control on the same path, and use `rg -U` with `\s+` at every word join for multi-word phrases.

### Verify the EVIDENCE, not just the VERDICT

Two executors reported success truthfully in outline while their stated reasoning was false. One filed
a deferred item claiming a dependency was absent from the repo; the real mechanism was that git
worktrees do not carry gitignored files. The conclusion survived on independent evidence; the reasoning
did not, and the spurious item would have cost a future reader a real investigation.

A false deferred item is worse than no item. Re-run the disputed command yourself.

### Check the plan before checking the code

The plan-checker found TWO blockers inside the gap plan itself, before any file was touched: a
placement instruction that would have broken a byte-exact anchor in the variant builder and taken a
measurement precondition RED, and the vacuous acceptance criterion above. Neither would have surfaced
until after the earlier tasks were committed, and the plan forbade editing the file that would need
repairing -- so execution would have terminated mid-plan.

The review that pays best is the one that runs earliest.

## Patterns

### Prove a new assertion by mutation, in both directions

After instrumenting the blind spot, the fix was proven by restoring the exact original defect and
confirming the checker went RED with the precise diagnosis, then restoring and confirming sha256
identity and a green gate. A new assertion that has only ever been observed passing is indistinguishable
from one that cannot fail.

### Two-file agreement is auditable only if one file promises it

A reference leaf closed with a sentence declaring it states the same split as its skill's router. That
sentence made a prose-level property machine-checkable: the promise could be tested, and it was false.
Keep such self-describing claims and make them true, rather than deleting them to avoid the obligation.

### Isolate the commit that reopens a cost

The description edits force a metered regression round; every other fix does not. Keeping them in their
own commit means the cost is attributable, and the marginal cost of any further description change is
zero as long as it lands before that round runs -- and a whole extra round if it lands after. Sequence
work by which gate it reopens, not only by which file it touches.

## Surprises

### The canonical request reached its owner only by accident

Late unprimed review found that the corpus case which created this phase is quoted verbatim as one
skill's trigger in four separate files, yet that skill's `description` never mentions the moment. Since
descriptions decide which skill LOADS and bodies only run afterwards, the request reaches its owner
only because a sibling skill lexically mis-loads on two shared words and then hands off. The reviewer's
phrase was exact: a self-healing accident, not a route.

The routers were replicated four times and kept in sync; the descriptions were never brought level with
them. Replication kept the copies consistent with each other and hid that they were inconsistent with
the layer above.

### The tooling that reports state also corrupts it

A state-writing verb reported four tidy field updates while injecting non-ASCII characters into an
ASCII-only public repo and replacing only the FIRST line of multi-line fields, orphaning their tails
mid-sentence. Its own return value described none of this.

Snapshot before, diff after, repair by hand, and assert cleanliness independently. Never re-run a state
verb to "check" state -- these mutate on every invocation.

### A killed background process can strand state in a DIFFERENT repository

An executor left a long-running check running when its plan closed; the worktree was force-removed,
killing the process mid-run and stranding a grading worktree inside a borrowed third-party repo. The
canary correctly went RED, and clearing it required a destructive removal outside the project that
needed explicit owner permission.

Long-running checks that spawn external state should be finished, not abandoned -- and a canary that
fires on residue is doing its job, so diagnose before assuming regression.
