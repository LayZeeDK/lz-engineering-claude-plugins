---
type: quick-summary
slug: lz-refactor-e2e-nx
status: complete
completed: 2026-07-10
---

# Summary: lz-refactor end-to-end test

## What was built

A reusable, suite-driven end-to-end test harness for the `lz-refactor` skill, exercising it against
real TypeScript via isolated `claude -p --plugin-dir` sessions (model `claude-opus-4-8`, effort `high`,
`--setting-sources project` to drop user-global config). Lives under
`.claude/skills/lz-refactor-workspace/`:

- **Runner** `e2e-nx/run-e2e.mjs` -- `--suite <dir>` (loads `suite.json`: repo, applyBase, prompts);
  arms `no_skill` / `with_skill` / `invoke_skill` (forced via `/lz-tdd:lz-refactor`); modes `recommend`
  (read-only) / `apply` (edit + typecheck + tests, per-run pristine reset + `diff.patch` capture,
  protected-branch guard); per-run subdirs with idempotent resume; `--report` prints Pass@k/Pass^k on
  skill-firing. Resolves the native `claude.exe` (not the `.CMD` shim).
- **Suites:** `e2e-nx/` (nx `@nx/eslint-plugin` @ 23.0.x, 6 curated targets) and `e2e-gilded-rose/` (the
  canonical kata). Prompts, `targets.json` rubrics, and captured results (answers/meta/diffs; raw
  streams gitignored) are all committed.
- **Results docs:** cross-suite `E2E-FINDINGS.md`; per-suite `e2e-nx/E2E-RESULTS.md`,
  `e2e-gilded-rose/GR-RESULTS.md`.

## What was run

~50 `claude -p` sessions total, k=3: nx recommend (with/without/invoke) + nx apply (p1-p4, 2-parallel
worktrees) + Gilded Rose recommend (all arms) + Gilded Rose apply (with_skill + invoke_skill). Both
target repos restored to pristine (nx @ 23.0.x, kata @ main); throwaway branches + worktree removed;
node_modules junction safely torn down.

## Key findings (full detail in E2E-FINDINGS.md)

1. **Coach-mode auto-triggering is the load-bearing gap.** Advise-shaped "clean this up" prompts almost
   never route to the skill (nx 1/12, kata 0/6). Reference lookups and the failing-test seam fire
   reliably (p5 3/3; p6 -> lz-tpp 3/3). **Apply/do-it framing raises triggering, correlated with target
   size** (nx apply: big p1/p2 3/3, small p3/p4 0/6; kata apply 3/3). Forced invoke: 100%.
2. **Baseline Opus 4.8 @ high is already catalog-grade** on straightforward refactorings (correct named
   moves, over/under-engineering judgment, characterization-test discipline) -- so the skill's marginal
   value is small on mechanical targets and **largest on pattern-directed / de-patterning / seam** ones
   (kata gr2: Kerievsky Strategy, Feathers, Null Object, First-Class Function, lz-tpp seam).
3. **coach-vs-apply tension:** the skill's "never edit unless asked" can override an explicit apply
   directive (nx p2 run-3 fired but made 0 edits).

## Recommended follow-ups (not done here)

- Trigger optimization: tune the skill `description` to catch advise-shaped coach prompts (invoke proves
  the payload is worth routing to).
- Resolve the coach-vs-apply no-edit tension for do-it contexts.
- Lead the value proposition with pattern-directed / de-patterning / seam routing.

## Notes / caveats

- Answer-quality grading is qualitative (broad read of answers/diffs vs `targets.json`); triggering is
  deterministic from `meta.json`. The `used_refactor` flag undercounts `invoke_skill` in edit-heavy
  apply (slash-command loads the skill without a later tool_use) -- confirmed active from content.
- The nx p3/p4 parallel-apply worktree (junctioned node_modules) was verified: tests ran against the
  worktree's edited source and passed (p3 46/46; p4 typecheck+tests pass).
