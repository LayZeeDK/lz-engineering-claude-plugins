# lz-refactor end-to-end findings (cross-suite synthesis)

End-to-end test of the `lz-refactor` skill against two real TypeScript codebases via isolated
`claude -p --plugin-dir` sessions. Two suites:
- **[e2e-nx](e2e-nx/)** -- real-world nx code (`@nx/eslint-plugin` @ 23.0.x). See [e2e-nx/E2E-RESULTS.md](e2e-nx/E2E-RESULTS.md).
- **[e2e-gilded-rose](e2e-gilded-rose/)** -- the canonical refactoring kata. See [e2e-gilded-rose/GR-RESULTS.md](e2e-gilded-rose/GR-RESULTS.md).

All runs: model `claude-opus-4-8`, effort `high` (Anthropic default; `--setting-sources project` drops
the user's global config so the runs represent the defacto setup, not the maintainer's `xhigh`).
Three arms: `no_skill` (no plugin = baseline), `with_skill` (plugin loaded, skill must auto-trigger),
`invoke_skill` (plugin + forced via the `/lz-tdd:lz-refactor` slash command). Two modes: `recommend`
(read-only, advise) and `apply` (edit + typecheck + tests on a throwaway branch). k=3 per cell.

## Finding 1 -- Auto-triggering is the primary gap, and it depends on FRAMING and TARGET

Auto-trigger rate = how often the skill fired on its own (`with_skill`, natural prompt):

| context | prompt shape | auto-fire |
|---|---|---|
| nx recommend | coach ("clean this up") p1-p4 | **1/12** |
| kata recommend | coach gr1/gr2 | **0/6** |
| nx recommend | reference lookup (p5) | 3/3 |
| nx recommend | seam / failing test (p6) | 3/3 (-> **lz-tpp**) |
| nx apply | BIG refactoring targets (p1 ~530-line fn, p2) | **3/3 each** |
| nx apply | small utility tweaks (p3, p4) | **0/6** |
| kata apply | gr1 (updateQuality) | **3/3** |

Reading:
- **Coach/advise-mode auto-triggering is effectively absent** (1/12 nx, 0/6 kata). This is the skill's
  stated primary use case.
- **Apply/do-it framing raises the trigger rate**, and it **correlates with target size / how obviously
  "a refactoring" the task is**: the big nx targets (p1/p2) and the famously-smelly kata fired 3/3; the
  small nx utility functions (p3/p4) fired 0/6.
- **Reference lookups and the green-step seam trigger reliably** -- p5 (name a refactoring / de-pattern)
  fired lz-refactor 3/3; p6 (a failing test) correctly routed to **lz-tpp** 3/3.
- **Forced invocation always works**: `invoke_skill` activated 100% (nx 12/12, kata 6/6) -- so the skill
  is invocable and its content is sound; the gap is purely *automatic* routing for advice-shaped prompts.

## Finding 2 -- When it does NOT fire, baseline Opus 4.8 @ high is already catalog-grade

Across every coach target where the skill stayed silent, the base model still produced strong,
named-refactoring coaching:
- Correct Fowler moves (Extract Function sequenced by reward/risk; Decompose Conditional; Map-based
  group-by; Replace Loop with Pipeline).
- Correct **over/under-engineering judgment** unaided: rejected the polymorphism bait on nx `validateEntry`
  (generator/executor collapse to a boolean) and on the kata (subclassing `Item` is off-limits -> use a
  per-type updater/strategy).
- **Context-aware deviation**: nx p3 recommend *declined* the FP loop->pipeline rewrite after reading the
  neighbouring `graph-utils.ts` perf comment (~10x) -- the skill's own "Replace Pipeline with Loop only on
  a measured hot path" rule, reached without the skill.
- **Feathers discipline** unaided: pin the ambiguous/duplicate case with a characterization test first.

## Finding 3 -- The skill's marginal value is real but concentrated

Where the skill fired (or was forced), its lift over baseline was **small on mechanical targets** and
**largest on pattern-directed / de-patterning / seam-heavy targets**:
- nx `validateEntry` (p2): forced vs baseline reached the *same* conclusion; the skill added only an
  explicit Fowler citation.
- kata gr2 (pattern bait + `Item` constraint): the skill added genuine precision -- named the **Kerievsky
  "Replace Conditional Logic with Strategy"**, surfaced **Feathers refactoring-without-tests** (no
  `__snapshots__` recorded yet), and named catalog-specific alternatives (**First-Class Function** lookup,
  **Null Object** for Sulfuras) plus the **lz-tpp seam** (Conjured = behaviour change, not refactor).

## Finding 4 -- apply mode surfaces a "coach, don't drive" tension

The skill instructs "coach, don't drive... never edit unless asked." In `apply` mode (where the harness
DOES ask for edits), when the skill fired it usually applied clean incremental refactorings with tests
between steps (nx p1 extracted the 530-line `run` into named check fns; kata extracted `updateItem`,
recorded the golden master first, then decomposed). But **nx p2 run-3 fired the skill and produced ZERO
edits** -- advice only -- i.e. the skill's no-edit instruction can override an explicit apply directive.

## Implications for the skill (highest-leverage first)

1. **Fix coach-mode auto-triggering.** This is the load-bearing gap: the skill's primary use case
   (advise on a smell) almost never routes to it. The `description` likely under-matches advice-shaped
   prompts ("the tests are green, how would you clean up X"). This is the target for trigger optimization,
   and `invoke_skill` proves the payload is worth routing to. Apply/do-it phrasing and bigger targets
   already trigger better -- a clue for description tuning.
2. **Resolve the coach-vs-apply tension.** "Never edit unless asked" should yield when the user explicitly
   asks to apply the refactoring, so the skill helps rather than stalls in a do-it context.
3. **Lead the value proposition with pattern-directed / de-patterning / seam routing**, where the skill
   measurably beats a strong baseline; on plain mechanical Extract Function the base model is already
   complete.

## Resolution -- trigger-opt + coach/apply rewrite (2026-07-11)

Both highest-leverage implications above were addressed and verified end-to-end (new `description` +
question-vs-command coach/apply rewrite, SKILL.md commit 8acd2b8; verification commits ee95cd4 [pruned], e7fcc8c).

**Implication 1 (coach-mode auto-triggering) -- CLOSED.** Re-running the coach `recommend` prompts with
the new description, same busy `--plugin-dir` sessions, fresh run indices:

| context | before | after |
|---|---|---|
| nx coach p1-p4 (recommend) | 1/12 | **12/12** |
| kata gr1/gr2 (recommend) | 0/6 | **6/6** |
| combined coach auto-trigger | **1/18 (6%)** | **18/18 (100%)** |

The isolated trigger-eval moved 92% -> 100% recall with specificity held at 100% (11/11 quiet); the
`groupImports` readability-only miss is fixed. The isolated harness did NOT reproduce the e2e gap, so the
`--plugin-dir` re-run above is the ground-truth confirmation.

**Implication 2 (coach-vs-apply tension) -- RESOLVED.** The rewrite bifurcates on user intent instead of a
blanket "never edit":

| prompt intent | edited/n | behavior |
|---|---|---|
| deliberative question ("is X a good idea?", "what would you do?") | 1/8 | advise + ask before editing |
| explicit command ("refactor it now, apply it, run the tests") | **6/6** | drive edits + run tests, leave uncommitted |

The command-path prompts (`p2cmd`, `gr1cmd`) were subagent-reviewed (including an unbiased reviewer) before
the run to confirm they are genuine, non-leading commands. Driven refactors kept the target tests green and
were behavior-preserving (nx `nx-plugin-checks` 7/7; kata approvals golden master green). The Finding 4
"fired but zero edits" case is now the correct response to a *question*, not a stall on a *command*.

## Caveats

- Effort = `high` (defacto default), not the maintainer's `xhigh`; single model (opus-4-8).
- Grading of answer quality is qualitative (author read of a broad sample of `answer.md` / `diff.patch`
  against each suite's `targets.json`); triggering rates are deterministic from `meta.json`.
- Detector note: `used_refactor` (a `tool_use` referencing lz-refactor) UNDERCOUNTS `invoke_skill` in
  edit-heavy `apply` sessions -- the slash command loads the skill up front without a later tool_use.
  Invoke activation was confirmed from answer content (catalog terms, seam callouts), not the flag.
- `--plugin-dir` natural triggering may differ from marketplace-installed triggering.
- **Parallel-apply setup (nx p3/p4) was verified, not assumed.** Those runs used a second git worktree
  with `node_modules` junctioned from the main clone. Transcript check confirms tests actually executed
  against the worktree's EDITED source (relative imports + local `rootDir`): p3 passed 46/46 (via raw
  jest and via `nx test`); p4 typecheck-clean + tests pass. No junction module-resolution failures; the
  only artifacts were one recovered `jest --config` fumble and a benign `EISDIR 'D:'` nx-on-Windows
  post-run path warning. So the worktree edits and their behavior-preservation are real.
