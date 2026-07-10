# lz-refactor end-to-end test -- Gilded Rose kata

Second e2e suite for the `lz-refactor` skill, on the canonical refactoring kata
(https://github.com/emilybache/GildedRose-Refactoring-Kata, TypeScript). Complements `../e2e-nx/`
(real-world nx code) with a small, well-known target that has a good-known refactoring path and
fast golden-master tests -- so apply+verify is cheap and reliable here.

Uses the shared runner in `../e2e-nx/run-e2e.mjs` via `--suite`. Suite config: [`suite.json`](suite.json)
(repo = the kata's `TypeScript/` dir, applyBase `main`). Target + rubric: [`targets.json`](targets.json).
Prompts: [`prompts/`](prompts/) -- `gr1` (natural "clean up updateQuality") and `gr2` (pattern bait:
"subclass per item type, but Item can't change" -- tests the over/under-engineering balance + the
do-not-modify-Item constraint).

## Setup (one-time)

```bash
cd D:/projects/github/emilybache/GildedRose-Refactoring-Kata/TypeScript && npm install
```

## Run

From the plugins repo root:

```bash
R=.claude/skills/lz-refactor-workspace/e2e-nx/run-e2e.mjs
S=.claude/skills/lz-refactor-workspace/e2e-gilded-rose
node $R --suite $S --dry-run                                   # spend nothing
node $R --suite $S --mode recommend --arm all --runs 3         # with_skill + no_skill + invoke_skill
node $R --suite $S --report                                    # Pass@k on skill-firing
# apply (throwaway branch of the kata; its tests are fast):
cd <kata>/..; git -C <kata> checkout -b lz-refactor-e2e-apply  # (from the kata repo root)
node $R --suite $S --mode apply --arm with_skill --cwd <kata>/TypeScript --runs 3
```

Results land under `results/<mode>/<arm>/<pN>/run-<k>/` (same layout + gitignore as e2e-nx). Grade
`answer.md` / `diff.patch` against `targets.json`; see `../e2e-nx/E2E-RESULTS.md` for the nx findings.
