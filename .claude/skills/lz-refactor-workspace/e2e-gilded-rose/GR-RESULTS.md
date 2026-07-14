# lz-refactor end-to-end results -- Gilded Rose kata

Suite: the canonical refactoring kata (`app/gilded-rose.ts` `updateQuality`). Model `claude-opus-4-8`,
effort `high`. Arms: `no_skill` / `with_skill` / `invoke_skill`. See [../E2E-FINDINGS.md](../E2E-FINDINGS.md)
for the cross-suite synthesis. Raw runs under `results/` (`outputs/` gitignored).

## Recommend, k=3 (gr1 natural, gr2 pattern-bait) -- skill-fire

| arm | gr1 | gr2 |
|---|---|---|
| `with_skill` (natural) | 0/3 | 0/3 |
| `no_skill` (baseline) | n/a | n/a |
| `invoke_skill` (forced) | 3/3 | 3/3 |

- The skill **never auto-fired** on the kata's natural prompts (0/6) -- cross-repo confirmation of the
  nx coach-mode trigger gap. Forced invoke fired 6/6.

## Apply, k=3 (gr1 -> updateQuality, throwaway branch, golden-master net)

| arm | fired | outcome |
|---|---|---|
| `with_skill` | **3/3 auto-fired** | applied Extract Function (`updateItem`), recorded the golden-master snapshot FIRST (Feathers), decomposed conditionals, named constants; behaviour-preserving |
| `invoke_skill` | 3/3 (by construction) | same shape; run-3 also replaced the `fixme` placeholder spec with real tests |

- **apply framing auto-triggers the skill here (3/3)** where recommend did not (0/6) -- the key
  framing-sensitivity finding.
- All apply runs applied clean behaviour-preserving diffs and treated the vitest approval/snapshot test as
  the characterization net (the stock `gilded-rose.spec.ts` asserts `'fixme'` and is a red placeholder --
  the agents correctly ignored it and flagged making it pass as the green/lz-tpp step, not a refactor).

## Quality highlight -- gr2 (pattern bait + `Item`-must-not-change)

Both baseline and skill correctly say "composition, not `Item` inheritance." The forced-skill answer added
real precision: named the **Kerievsky "Replace Conditional Logic with Strategy"**, surfaced **Feathers
refactoring-without-tests** (no `__snapshots__` recorded), and named **First-Class Function** (lookup
table) and **Null Object** (Sulfuras) alternatives, plus the **lz-tpp seam** for adding Conjured. This is
the clearest marginal-value case in the whole exercise -- pattern-directed + de-patterning + seam is where
the skill's catalog beats a strong baseline.

## Apply, k=3 (gr4 projsweep) -- L1 net-cost warrant re-measure (2026-07-14)

Re-measure of the L1 rewrite of SKILL.md step 4 (the countable net-cost warrant, committed `98cf482`)
on the over-engineering testbed. Runner reads L1 via `--plugin-dir` (the repo tree on disk).

| arm | fired | hierarchies built in `gilded-rose.ts` | countable DECLINE verdict | Conjured behaviour-change trap |
|---|---|---|---|---|
| `with_skill` gr4 (L1) | **3/3 auto-fired** | **0/3** | **3/3** emitted | 3/3 routed to lz-tpp (out of scope) |
| `no_skill` gr4 (base) | n/a | 0/3 | n/a (no warrant) | (baseline, reused) |

- **L1 binds.** All three runs declined Replace Conditional with Polymorphism on the count (e.g. "adds
  4 updater classes + a factory to remove a single name-dispatch"), not on taste. This fixes the
  iteration-1 regression where the prose veto let 1/3 build a 5-class hierarchy.
- Base `no_skill` gr4 is also 0/3, so L1 = **parity + a legible warrant**, not an output win over base.

## Positive-control axis: CLOSED (2026-07-14)

All over-engineering probes are DECLINE cases, so they prove L1 does not OVER-build but cannot show it
DISCRIMINATES. A positive control (does step-4 emit APPLY / does it over-decline?) was investigated and
found **conceptually foreclosed**: step-4's REMOVES side has **no extensibility/growth term by design**
(its worked example is literally "4 type codes -> polymorphism adds 4 classes, removes 0 duplication ->
DECLINE"). So a faithful L1 must decline a speculative-growth pattern (0 present duplication); if it
endorses, it overrode step-4 with base instinct, making a PASS indistinguishable from "skill inert." The
probe can only show the warrant harmless or harmful, never HELPFUL -- and declining patterns justified
only by future growth is intended YAGNI / anti-Speculative-Generality, not a bug.

Two candidate positive controls were built, unbiased-reviewed (neutral + adversarial), and disqualified
BEFORE any metered spend: (B) `@nx/vite` `add*Target` -- vacuous behaviour gate (`configuration.spec.ts`
uses `addPlugin:true` everywhere, skipping the `!hasPlugin` block that calls them, so no test executes
them) + break-even net-cost (DECLINE defensible) + wrong path (step-3 Fowler, not L1's step-4); and (A)
kata grown-type-set -- foreclosed as above. Reusing p2/validateEntry was also disqualified (already run;
base declines on taste; same family as the worked example).

**Decision: ACCEPT L1** (committed `98cf482`). Output-warrant validation is exhausted -- realizable skill
value is auto-trigger (proven) + the reference catalog (untested). Do not re-open the positive-control
quest or a same-model reviewer-agent.

## Setup / reproduce

Kata cloned at `D:/projects/github/emilybache/GildedRose-Refactoring-Kata` (throwaway). See
[README.md](README.md) for run commands. Apply runs used a throwaway branch; `npm install` once in
`TypeScript/`.
