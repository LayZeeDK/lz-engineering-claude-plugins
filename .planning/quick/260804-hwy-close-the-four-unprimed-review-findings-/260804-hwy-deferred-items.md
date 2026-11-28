# Quick task 260804-hwy -- deferred items

Four gate evasions and a set of smaller instrument findings remain OPEN. All were raised by this
task's mandatory from-scratch UNPRIMED reviewer and **each evasion was empirically proven** by
mutating a tracked file, running the gate, and restoring with a checksum -- not argued.

They are deferred rather than fixed because they are gate DESIGN changes, and this repository's own
record is explicit that consecutive hand-patching rounds each introduce a fresh instance of the class
they repair. Three rounds of the taxonomy remediation did exactly that, and the recorded
recommendation was to stop patching instances and build a guard that DERIVES its verdict.

**None of these is a defect in the shipped routing text.** The reviewer confirmed all nine corpus
cases route correctly at both tiers. These are limits on what the gate would CATCH in future.

---

## OPEN-1 (IMPORTANT) -- `[cls-01] exhaustive` pools branches, so a single skill can lose its own

**Where:** `check-rgr-routing.mjs`, the `[cls-01] exhaustive` block.

**The defect.** The assertion is quantified over `step1Branches`, a POOLED list of branches from all
three step-1 procedures. The three procedures are near-identical today, so any single-file regression
is masked by its siblings.

**Proven (E1).** Deleting `lz-red/SKILL.md`'s branch (a) -- the branch by which lz-red claims the red
step at all -- left the gate **GREEN, exit 0**. Deleting the same branch from all three turned it RED
with 3 failures. So the gate's primary assertion does not protect any individual file.

**Fix.** Quantify per surface: for each step-1 surface, require that every case whose `expectedOwner`
is that surface's `owner` is owned by one of ITS OWN branches, and that every other case is routed
away by one of its own branches.

---

## OPEN-2 (IMPORTANT) -- the bare-catch-all guard cannot see the house residual vocabulary

**Where:** `routing-parse.mjs`, `CATCHALL_CONDITION_RE`.

**The defect.** The regex matches the `otherwise` / `else` / `in every other case` / `failing all of
those` family. Every shipped terminal uses `"None of (a) through (d)"`, which it does not match.

**Proven (E2).** Rewriting `lz-refactor`'s branch (e) to
`"None of (a) through (d): the request stays here anyway, and that is lz-refactor."` -- a
self-claiming catch-all in the house condition vocabulary -- left the gate **GREEN**. c9 still passed
because the other two surfaces supply a residual (which is OPEN-1's pooling again).

**Compounding finding.** The comment justifying the looser predicate claims "today's four shipped
catch-alls" use a self-reference form. **Zero such catch-alls exist** -- verified, exit 1 with a
positive control. So the justification for the weaker predicate is void.

**Fix.** Add the `none of the above` / `none of (a) through` family to `CATCHALL_CONDITION_RE`, and
make the residual assertion per-surface so each router must carry its own declared residual.

---

## OPEN-3 (IMPORTANT) -- a `NONE` case can be captured and the gate reports it as a PASS

**Where:** `check-rgr-routing.mjs`, `[cls-01]` and `[cls-02]`.

**The defect.** For `expectedOwner: "NONE"` the gate asserts only that a declared residual terminal
EXISTS. It never asserts that the case is NOT covered by a positive branch. `covers()` is never
applied to a residual case, and `[cls-02]` passes at one claimant.

**Proven (E7).** Adding an `f.` branch to `lz-refactor` step 1 that captures c9 left the gate
**GREEN** -- and `[cls-02]` printed
`[PASS] ... c9 claimed by at most one step-1 procedure -- claimed by refactor-step1`, reporting the
capture as a pass. A case whose whole point is that no skill owns it was claimed, and the report read
as healthy.

**Fix.** For a `NONE` case assert `step1Branches.filter((b) => covers(b, kase)).length === 0` AND
that a declared residual exists.

**Note.** OPEN-1, OPEN-2 and OPEN-3 share ONE root cause: assertions quantified over a pooled branch
list instead of per surface. The reviewer's own cheaper suggestion is to move the
`for (const kase of CASES)` loops INSIDE the `for (const surface of STEP1_SURFACES)` loop, which
closes all three at once and is a smaller diff than three separate guards.

---

## OPEN-4 (MINOR, and inherent) -- `TEST_STATE_TOKENS` is a literal blocklist

**Proven (E5).** Prefixing `lz-refactor`'s coach mode with `"nothing in the suite is red, and"` -- a
novel paraphrase on a fully judged surface -- left the gate GREEN. The new whole-section check does
not help: it runs the same literal token set.

This task's own D1 widening is the second time this ceiling has been hit. The honest response is to
STATE the limitation in the header as a named ceiling rather than treat the axis as closed, and to
keep relying on the metered eval plus the human-review habit that has now found all four blind spots.
Do not pretend a blocklist is exhaustive.

---

## OPEN-5 (MINOR) -- smaller instrument findings, all verified

| id | Where | Finding | Fix |
|----|-------|---------|-----|
| 5a | `selftest`, `foldedDescription` block | Only the null-when-absent leg is asserted. Its PRIMARY contract -- fold a multi-line block joined by single spaces -- is never asserted, yet both the char-cap guard and the description-single-axis guard stand entirely on it. A join-with-`""` bug would pass the selftest. | Assert the happy path plus `("")` and `(null)`. |
| 5b | `selftest`, TEST_STATE_TOKENS emptiness check | `[].filter(...)` is `[]`, so the assertion passes on an EMPTIED token list -- vacuous in the one direction that matters. | Add a `length >= N` floor, or fold it into the exact-token positive control. |
| 5c | `selftest`, predicate restatements | Six gate predicates (`covers`, `owns`, `isDeclaredResidual`, ...) are hand-duplicated with no drift detection, and one HAS drifted: `coveredBy` runs over one surface while the gate pools three. So the selftest proves a discrimination the gate does not have. | Export the predicates from the lib and import them in both places. |
| 5d | `routing-parse.mjs`, `"has a smell"` token | It is a claim about CODE STRUCTURE, not suite state -- and it is exactly the signal lz-refactor legitimately routes on. Dormant only because the shipped gate says "a smell in view". A correct, ask-axis rewording would turn the gate RED, and the header forbids weakening assertions, so a maintainer would be pushed to contort correct prose. | Drop it, or give a code-state axis its own token set and label. |
| 5e | `routing-parse.mjs` branch (c), all three files | The condition is qualified `"...before any test covers it"`, which decides routing partly from the suite's contents -- the same underlying claim that the banned token `nothing failing yet` names. It also opens an exhaustiveness hole: "change what this working code does, and a test already covers it" matches no branch and falls to the residual, which is wrong. All three narrative sections and all three descriptions state the rule UNQUALIFIED, so two parsed surfaces disagree and the gate never compares surfaces. | Drop the qualifier; add a corpus case for a behavior change to already-covered code. |
| 5f | `lz-red/SKILL.md` `## Two modes` | Cannot classify two of the four cases lz-red owns: c3 (judging an existing test) and c4 (add-a-behavior) match neither coach nor reference mode, though the description claims both and branches (a)/(c) route them. `lz-refactor`'s gate was widened for exactly this in D4a; lz-red's was not. No assertion checks mode-gate coverage. | Widen lz-red's coach mode. Body-only, so free of metered implication. |
| 5g | `lz-tpp` + `lz-refactor` descriptions | The primary-ask tiebreak is now in `lz-red`'s description only, so a c8-shaped request is arbitrated by whichever description happens to carry the rule. | lz-tpp has 397 chars free; lz-refactor has 41 and would need a trim. Rides Round B. |
| 5h | `rgr-cases.json` c9 + `lz-refactor` description | c9's residual status is not robustly derivable at the description tier: the design-question exclusion is scoped to code that "does not exist yet", and c9's argument parsing arguably exists. | Widen to "whether or not the code exists yet". Rides Round B. |
| 5i | Coverage boundary, by design | Text in `## ` sections that are NOT declared routing surfaces (for example `## Listen to the tests`) is outside all coverage. Discovered while reproducing an evasion: a mutation there is correctly not caught, because only declared surfaces are guarded. Stated so it is not mistaken for a hole. | None needed; record the boundary. |

---

## Sequencing note

OPEN-1/2/3 are one refactor of the gate's quantification and are worth doing together, with each
evasion above re-run afterward as the acceptance test -- the evasions ARE the test suite for that
change, and they are already written down with exact mutations.

5f is free (body only). 5g and 5h ride Round B and must land before it or force a second round; note
`lz-refactor` has only 41 chars of headroom left.
