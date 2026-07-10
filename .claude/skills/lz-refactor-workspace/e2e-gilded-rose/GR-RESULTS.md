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

## Setup / reproduce

Kata cloned at `D:/projects/github/emilybache/GildedRose-Refactoring-Kata` (throwaway). See
[README.md](README.md) for run commands. Apply runs used a throwaway branch; `npm install` once in
`TypeScript/`.
