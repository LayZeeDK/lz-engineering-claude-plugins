# Research: lz-refactor trigger optimization + coach-vs-apply fix

Read-only research (general-purpose agent) grounding the plan. Sources: skill-creator plugin
(`.../plugins/marketplaces/claude-plugins-official/plugins/skill-creator/skills/skill-creator/SKILL.md`
+ `scripts/improve_description.py`, `run_loop.py`), the current `lz-refactor` SKILL.md, the
`lz-refactor-workspace` trigger-eval harness, and `E2E-FINDINGS.md`.

## A. skill-creator guidance (description / triggering)

- **Root cause of the coach gap:** skill-creator SKILL.md (~396-401) says Claude only consults a skill for
  tasks it *can't easily handle on its own* -- "make this readable" reads as self-handleable, so it
  under-consults even on a keyword match. This explains the ~1/18 coach-mode trigger rate directly.
- The **description IS the trigger mechanism**; put all "when to use" there. Current Claude UNDER-triggers,
  so make the description deliberately **"pushy"**: "Use this skill whenever the user mentions X/Y/Z, even
  if they don't explicitly ask for '...'".
- **Generalize to intent categories; do NOT overfit** to specific queries. Focus on user intent, imperative
  voice, distinctive vs sibling skills.
- **Length:** keep under ~1024 chars (optimizer hard limit; the 1,536 in PROJECT.md is the listing
  truncation). Current description ~740 chars.
- **Eval methodology:** ~20 queries, >=8 should-trigger + >=8 should-not; realistic/casual; the valuable
  negatives are **near-misses** sharing keywords (= the lz-tpp seam). 3 runs/query; automated loop picks
  best description by HELD-OUT TEST score. NOTE: `run_loop.py`/`improve_description.py` are NOT vendored in
  this repo -> iteration here is MANUAL (edit -> reload -> re-run the MJS runners).

## B. Why the current description under-matches natural advice prompts

Current description (SKILL.md 3-12) gates on jargon the natural prompts lack:

| description phrase | natural prompt instead says |
|---|---|
| "the next NAMED refactoring" / "which named refactoring to apply" | "what would you do with it?", "anything you'd refactor?", "how would you make it easier to read?" |
| "for a detected code smell" / "the code has a smell" | "a pain to work in", "took me a while to follow", "hard to follow" |
| "during the refactor step of red-green-refactor TDD" | (natural prompts don't name the ritual) |

The green-tests cue matches; the **action framing** fails (description advertises a lookup/selection task;
users frame an open improvement request). Fix DIRECTION (recall up, specificity preserved, no overfit):
- Add plain-English intent language: clean up / tidy / simplify / restructure / improve readability or
  structure of **existing working code**; "hard to read / follow / messy / a pain to work with"; "what would
  you do / what you'd refactor / how to make it easier to read".
- Add one "pushy" clause: use it whenever the user wants to improve code that already works + passes tests,
  even if they don't say "refactor" or name a smell.
- **Preserve specificity** on 3 boundaries: (1) vs lz-tpp green step (making a failing/red test pass --
  keep the explicit exclusion + >=2 seam negatives); (2) vs plain feature work / write-a-function (existing
  + tested code, not new code); (3) vs performance rewrites (structure/readability, behavior-preserving, not
  speed -- keep that guard negative).
- **Sibling seam (lz-tpp):** both declare "during red-green-refactor TDD" and ship in the same `lz-tdd`
  plugin. Keep discriminators crisp -- lz-tpp = failing test + minimal change to pass; lz-refactor = tests
  green + structure of existing code. New language must avoid "transformation / make the test pass / minimal
  change".

## C. Trigger-eval harness (lz-refactor-workspace)

- **`run-recall-chunks.mjs`**: reads positives from `evals/trigger-eval.json`, canary-gated (canary = positive
  #6), CHUNK_SIZE=3, `--runs-per-query 3 --num-workers 1 --model claude-opus-4-8`, `PONYTAIL_DEFAULT_MODE=off`.
  A chunk is VALID only if its canary fired >=0.5. Adding positives to `trigger-eval.json` is auto-picked up.
- **`run-spec-chunks.mjs`**: reads negatives from **`evals/d07-chunks/negatives.json`** (SEPARATE file, NOT
  trigger-eval.json), hardcoded canary, CHUNK_SIZE=4. To add a negative that the spec runner measures, edit
  **both** `trigger-eval.json` (for the lint) AND `d07-chunks/negatives.json`.
- **`check-evals.mjs`**: local lint (no claude -p): >=8 positives, >=8 negatives, >=2 lz-tpp-seam negatives
  (regex `failing test|make .* pass|minimal transformation|go green|green it|smallest (edit|step)`),
  ASCII-only. Fail-closed.
- **Stale-cache caveat:** adding/removing queries shifts chunk boundaries. Before re-running, DELETE all
  `trigger-results-d07-{recall,spec}-chunk-*.json` AND `evals/d07-chunks/{recall,spec}-chunk-*.json`.
- **Windows/native + throttling:** the vendored `tools/skill-creator-eval/run_eval.py` is native-fixed
  (background reader thread; whole-turn detection; ephemeral real skill; `--strict-mcp-config
  --setting-sources project`). LOCKED `--num-workers 1`. Always use the canary-gated CHUNK runners (a single
  big serial pass under-reads recall under load).
- Current set: 10 positives + 10 negatives (3 seam). EVL-01 baseline was 100% recall / 100% specificity.

## D. Coach-vs-apply instruction (the wrinkle)

- **Location:** SKILL.md 69-70: "Coach, don't drive... Never edit the developer's code or run the tests
  unless explicitly asked." The escape hatch exists but "Never edit" dominates -> in an apply context where
  the harness DID ask, the skill still produced advice + 0 edits (E2E Finding 4, nx p2 run-3).
- **Fix DIRECTION** (request-keyed mode; per skill-creator, avoid heavy-handed all-caps NEVER, explain why):
  default = COACH for advice requests ("what would you do", "anything you'd refactor"); DRIVE when the
  developer explicitly asks to apply ("refactor this", "apply it", "make the change") -- perform the SAME
  small behavior-preserving steps, tests after each, commit on green. Keep to the one paragraph (optionally
  soften step 5's "Advise" -> "Advise -- or perform, when asked --").

## Process constraints (for the plan)

- SKILL.md edits are triggering-critical + agent-instruction changes -> MUST be subagent-reviewed before
  acceptance, incl. >=1 UNBIASED from-scratch reviewer.
- Trigger/apply evals via `claude -p` are metered -> GATED on explicit user approval; prep is fine, halt
  before executing any `run-*-chunks.mjs` or apply run.
- After committing SKILL.md, the plugin must be reloaded (`/reload-plugins`) before re-eval; Claude cannot
  run it -- escalate to user and wait.
- Description < ~1024 chars, ASCII-only. Eval-set edits keep `check-evals.mjs` green; delete stale results.
- Route through the GSD workflow gate.

## Lazy note (ponytail)

The fix is TWO small text edits (broaden `description`; rewrite the coach/apply paragraph). No new harness
code -- the existing MJS runners + eval-set edits cover measurement. Vendoring skill-creator's automated
`run_loop.py` optimizer is out of scope unless a manual tune misses the recall bar after ~2 iterations.
