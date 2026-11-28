# Phase 22: Three-way classifier correctness (lz-refactor + lz-red) - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md -- this log preserves the alternatives considered.

**Date:** 2026-08-03
**Phase:** 22-three-way-classifier-correctness-lz-refactor-lz-red
**Mode:** `--analyze --auto --chain` (auto-resolution, with two areas escalated to the owner per the
`--auto` trap-quadrant rule: HIGH impact plus NOT-HIGH confidence is never auto-locked)
**Areas discussed:** routing source of truth / placement, description frontmatter scope, phase
shape and sequencing, null tiebreak. Auto-resolved from the ROADMAP success criteria:
exhaustiveness mechanism, single-axis breadth, test-code ownership, guard design, guard location,
lz-tpp scope, mechanical fixes.

---

## Routing source of truth / placement (ESCALATED)

| Option | Description | Selected |
|--------|-------------|----------|
| A. Inline in each SKILL.md only | Step 1 branches plus the existing per-skill narrative section stay in always-loaded body text; the new checker parses all three and derives the verdict. No new shipped file. | |
| B. Shared table plus decisive rationale inline | Canonical `plugins/lz-tdd/references/rgr-routing.md` for the full table; each SKILL.md keeps step 1 and a short classify-first rationale inline. | |
| C. Shared table replacing the narrative sections | The three narrative sections collapse into one shared table; SKILL.md keeps only its branch list and links out. | |
| **Owner's answer: measure it** | Author all three variants and decide by A/B eval, not by argument. | x |

**User's choice:** Free-text -- "Create and run A/B testing evals between the 3 options: Inline
only, shared table/decisive rational, and shared table replacement."

**Notes:** Two clarification rounds preceded this.

Round 1, the owner asked why inline was recommended. The answer given: (1) Phase 20 EVL-02 measured
lz-red's real edge over baseline Opus in only two of ten scenarios, one being the classify-first
boundary, and that content sits in always-loaded body text today -- a shared reference puts it
behind a lazy read, and five prior probes on passive reference content came back null while an
active inline step worked; (2) the SC6 checker enforces agreement identically under all three
options, so the shared file buys documentation DRY, not correctness; (3) it costs a new file in a
public shipped tree plus restructuring three shipped bodies plus more review surface. The weakness
was disclosed unprompted: under inline-only the canonical case list lives in a dev-only `.mjs`, so
the shipped tree never states the routing contract in one place, and today's three narrative
sections are already three copies that a shared table would collapse to one.

Round 2, the owner asked which option best supports a future `/lz-tdd` entrypoint skill. The answer
given: the shared table, clearly -- an entrypoint is a dispatcher whose primary content IS the
routing contract, so it would cite the same artifact instead of becoming a fourth inline copy, and
the shared table is also the legitimate home for the residual owner that today sits wrongly in the
leaves. This INVERTED the previously-stated null tiebreak (from inline-on-cheapness to
shared-on-entrypoint-readiness) and was stated as such.

One correction was issued and accepted: a TRIGGER eval cannot discriminate these three arms,
because they carry byte-identical `description` frontmatter by construction. The vendored
`skill-creator-eval` trigger flow is the wrong instrument; the body/behavior path (identical
prompts, three plugin-tree variants toggled via `--plugin-dir`) is the right one. Recorded as D-11.

---

## Phase shape and sequencing (ESCALATED)

| Option | Description | Selected |
|--------|-------------|----------|
| Split: fix ships in 22, A/B in a follow-up | Close the classifier defect with the placement cheapest to migrate FROM, unblock PR #3, A/B and migrate later. Cost: shipped bodies possibly edited twice. | |
| Fold in: author 3 variants, measure, ship the winner | One edit to the shipped bodies, decided empirically. Cost: extends the PR #3 hold by the full cycle; the phase gains a success criterion and requirement it does not have today. | x |
| Fold in, but gate the run | Author variants and harness, HALT before the metered run, ship a provisional placement. | |

**User's choice:** Fold in -- author 3 variants, measure, ship the winner.

**Notes:** The trade-off was stated plainly before the choice: PR #3 is deliberately held for Phase
22, so folding a metered 3-arm eval in extends the hold on the milestone. The owner accepted that
cost in exchange for editing the shipped bodies once, on measured grounds. Recorded as D-09.
Consequence carried into D-14: both metered rounds still HALT for explicit approval at run time --
folding the eval into the phase does not pre-approve its spend.

---

## Null tiebreak (ESCALATED)

| Option | Description | Selected |
|--------|-------------|----------|
| Shared table, entrypoint-ready (recommended) | On a tie, variant B wins: one normative artifact for a future `/lz-tdd` entrypoint, decisive rationale still inline. | |
| Inline only, cheapest | On a tie, keep the status quo shape; a future entrypoint arrives as a fourth copy. | |
| Shared table replacing the narrative sections | On a tie, take maximum DRY: three narrative sections collapse to one table. | x |

**User's choice:** Shared table replacing the narrative sections (variant C).

**Notes:** The owner chose the fullest-DRY option, one step beyond the recommendation. The risk was
stated before the choice and is restated in D-10 rather than dropped: C is the variant that moves
the classify-first rationale behind a lazy read, and classify-first is one of only two scenarios
where EVL-02 measured a real edge. Mitigation is structural -- the tiebreak only applies on a
MEASURED tie on routing correctness, so the concern is tested rather than assumed. Residual caveat
the writeup must carry: a tie on routing correctness does not prove parity on coaching-quality
dimensions, so a tie must not be read as "C is free".

---

## Description frontmatter scope (ESCALATED)

| Option | Description | Selected |
|--------|-------------|----------|
| Body-only, no frontmatter byte changes (recommended) | Bodies get the two-hop add-behavior rule; all descriptions stay byte-identical, triggering provably unchanged, zero metered spend. SC5 met in spirit, not literally. | |
| Body-only now plus scheduled follow-up | Same edits; description reconciliation deferred as explicit tech debt with its own eval round. | |
| Edit descriptions too, and run the trigger-eval round | Minimal rewording so each description names the correct destination. Literal SC5 satisfaction. Costs a metered EVL-01 reciprocal regression round, `/reload-plugins`, and reopens the auto-trigger. | x |

**User's choice:** Edit descriptions too, and run the trigger-eval round.

**Notes:** The concrete conflict: `lz-refactor`'s description routes "or otherwise ADD or CHANGE
behavior" to `lz-tpp`; `lz-tpp`'s description declines requests "not about choosing the next
transformation during TDD"; and the TDD-correct destination for "add a new behavior, nothing
failing yet" is `lz-red` (Law 1). The owner chose literal SC5 satisfaction after being shown that
it puts the eval-validated auto-trigger -- the one lever this project has measured to work -- back
in play. Recorded as D-06, with the forced consequences recorded in D-14 (gated EVL-01 reciprocal
round) and D-19 (`/reload-plugins`, which only the owner can run).

---

## Auto-resolved areas (no owner prompt; resolved from the ROADMAP success criteria)

Per `--analyze`, the trade-offs were weighed before each selection; per `--auto`, the
best-supported option was taken. None of these met the trap-quadrant test (each is either
low-impact or directly settled by SC text).

| Area | Options weighed | Selected and why |
|------|-----------------|------------------|
| Exhaustiveness mechanism | (a) named-owner enumeration, no catch-all anywhere; (b) one catch-all, moved to lz-refactor; (c) keep catch-alls plus a precedence order | (a) -- D-01. SC2's literal wording ("at most one of the three step-1 procedures claims any given request") forbids multiple catch-alls, and the owner had already declined the make-(c)-a-catch-all patch on 2026-08-03. |
| Single-axis breadth | (a) narrow: only mode-selection and sibling-routing branches must be ask-keyed; (b) broad: remove every test-state condition anywhere | (a) -- D-03. SC3 says "no ROUTING branch keys on test state". (b) would gut lz-tpp step 1's green-phase check and lz-red step 5's fail-for-the-right-reason, both eval-validated content. |
| Test-code ownership | (a) split by ask; (b) all test code to lz-red; (c) status quo | (a) -- D-04. (b) would key on file kind, contradicting the single axis, and would strip the legitimate "tidy this messy test file" refactoring case. |
| lz-tpp in scope? | (a) all three skills; (b) only the two in the phase title | (a) -- D-05. SC2 and SC3 both name lz-tpp explicitly; its catch-all is the collision half of the BLOCKER. The phase title is shorthand, not a boundary. |
| Guard design | (a) derive from a parsed table; (b) tighten the existing needles ("hand off" on the same line); (c) both | (a) as the primary gate, keeping (b)'s presence guards -- D-15, D-16. SC6 demands routing semantics over token presence, and this project's own recorded lesson is to derive verdicts from a parsed table instead of patching the third instance of a class. |
| Guard location | (a) extend `check-red-references.mjs`; (b) new sibling tool; (c) duplicate in both workspaces | (b) -- D-16. `check-red-references.mjs` carries documented label-count arithmetic (125) and a `NEW_LABELS` roster that an extension would perturb. |
| Mechanical fixes (L81, step 6 router) | (a) add the missing heading anchor; (b) delete the dangling pointer | (a) -- D-07. The pointer is load-bearing for step 4's de-patterning gate, and the anchor also gives the new checker something to key on. |

---

## Claude's Discretion

- Exact branch wording and ordering inside each step 1, provided D-01 through D-04 hold.
- `check-rgr-routing.mjs` internals (parse strategy, case-corpus representation, report labels),
  within the house harness conventions.
- Physical staging of the three variants for the `--plugin-dir` toggle.
- Whether the A/B writeup lives in the existing `EVAL-RESULTS.md` or a phase-scoped sibling.

## Deferred Ideas

- `/lz-tdd` entrypoint skill (future milestone) -- the loop's front door and the legitimate owner of
  the residual case. Informs the D-10 tiebreak; not built here.
- Retiring the TD-02 / SEAM-02 presence guards once the parsed-table gate exists -- deliberately not
  done; revisit after the semantic gate has proven itself across a milestone.
- FUT-04 (split the Kerievsky layer into its own skill) -- unrelated, still backlogged; a fourth
  skill would inherit whichever placement wins.
