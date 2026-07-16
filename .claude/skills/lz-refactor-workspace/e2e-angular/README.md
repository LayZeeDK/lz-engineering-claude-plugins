# lz-refactor apply/drive-mode eval -- real Angular repos

Tests the shipped `lz-refactor` skill in **apply/drive mode** (the skill EDITS code in small
behavior-preserving steps) on **TypeScript source** in three real, locally-cloned Angular repos.
Targets are pre-identified (nx-style) in `targets.json`.

## Targets (all TypeScript, apply/drive mode)

| id  | repo         | file / symbol                                            | primary smell -> expected move                          |
|-----|--------------|----------------------------------------------------------|---------------------------------------------------------|
| ac1 | angular-cli  | `@angular-devkit/core` registry.ts `_compile`            | Long Function + dup transform loops -> Extract Function  |
| ac2 | angular-cli  | `@angular-devkit/core` writer.ts `convert*Collection`    | Duplicated Code -> Parameterize Function                 |
| cd1 | components   | `@angular/cdk` sticky-styler.ts `stickRows`              | Long Method + loop phases -> Extract Function + Consolidate |
| cd2 | components   | `@angular/cdk` list-key-manager.ts `onKeydown` (OPTIONAL)| Conditional Complexity -> Decompose Conditional          |
| an1 | angular      | `@angular/core` change_tracker.ts `_recordImports`       | mixed-concern loops -> Extract Function + pipeline        |

## Verification (apply mode needs a behavior guard; these repos are bazel-first, no turnkey jest)

Two-tier, per target:
1. **`tsc --noEmit` hard gate** -- the edit must compile. (components/angular have `node_modules`;
   **angular-cli needs `pnpm install` first** -- no `node_modules`.)
2. **Golden-master characterization** where the target is node-callable + deps resolve (ac1, ac2,
   maybe an1): capture behavior before the edit, re-run after, must match. DOM-bound CDK targets
   (cd1/cd2) get **`tsc` + LLM diff-judge** only.
3. **LLM diff-judge** everywhere: behavior-preserving? correct NAMED refactoring? small incremental
   steps? over/under-engineering sound? Did the skill actually DRIVE (edit) vs only advise?

Bazel/karma tests are the authentic guard but impractical for a repeated k x targets x arms loop on
Windows arm64 -- golden-master (the existing `e2e-gilded-rose` pattern) is the substitute.

## Arms + runs

- `with_skill` (plugin dir loaded, auto-trigger) vs `no_skill` (baseline Opus 4.8, no plugin) vs
  `invoke_skill` (forced `/lz-tdd:lz-refactor`). k=3. Ran on throwaway branches per repo.
- Recommended FIRST PASS (scoped): `with_skill` vs `no_skill`, k=3, on the 4 core targets
  (ac1/ac2/cd1/an1) = 24 apply runs. Expand to `invoke_skill` / cd2 only if signal appears.

## Prior-evidence caveat (why a scoped first pass, not the full matrix)

The output-warrant axis is **triple-closed** and the **nx real-repo apply arm already concluded
skill ~= baseline on applied output** (coach auto-trigger ~absent; value concentrated in
reference/seam, which apply mode excludes). These Angular packages are **well-factored -> mild
smells**, so baseline Opus 4.8 very likely applies them correctly unaided. Expect parity; the run's
value is fresh real-repo apply evidence + auto-trigger generalization, not a likely skill win.

## Setup

- angular-cli: `pnpm install` in the repo (one-time; enables tsc + golden-master).
- components/angular: `node_modules` present; `tsc`/`tsx`/`ts-node` available.
- Run apply agents on throwaway branches (`git switch -c eval/<id>`), revert/delete after grading.
