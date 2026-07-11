# Phase 12: Autonomous multi-round refactoring for whole-package sweeps - Context

**Gathered:** 2026-07-11
**Status:** Ready for planning
**Mode:** `--analyze --auto --chain`. Gray areas GA-2..GA-6 were auto-locked (low-impact
OR high-confidence-on-approach). The ONE trap-quadrant item (GA-1, the multi-round autonomy
boundary -- HIGH impact + not-high confidence, because it changes SHIPPED skill behavior and
re-opens the freshly-resolved coach/apply tension) was NOT auto-locked. The user is away for
the day and directed an autonomous, evidence-maximizing pass with spend de-prioritized, so
GA-1 was resolved WITH EVIDENCE via a 3-lens independent panel (unbiased from-scratch,
adversarial red-team, evals-design) rather than left UNRESOLVED. The panel converged on a
REFINED Option A (below), which the phase's own evals are then designed to adjudicate
empirically. `--chain` will auto-advance to plan-phase; note the hard reload-plugins gate in
D-18 that only the user can clear.

<domain>
## Phase Boundary

Close the two gaps that block `lz-refactor` from serving the AUTONOMOUS MULTI-ROUND
WHOLE-PACKAGE SWEEP use case -- a natural prompt such as "Identify code smells in
@nx/eslint-plugin and refactor them away" with NO explicit `/lz-tdd:lz-refactor`, where the
package source is scanned for smells, refactorings are identified and applied with the right
named patterns/idioms, and multiple rounds run autonomously to the end goal. Both gaps were
empirically confirmed 2026-07-11 (e2e in both repos):

1. TRIGGER -- whole-package / sweep apply prompts do not auto-invoke the skill (0 activations;
   base Opus did the work). This is a DIFFERENT prompt shape from the single-target coach
   prompts the quick task already fixed.
2. BEHAVIOR -- even when force-invoked, the coach stops-and-asks / stops after one refactoring
   instead of driving rounds to completion.

Close both via research-informed changes to the skill INSTRUCTIONS, the DESCRIPTION, the
TRIGGER-OPTIMIZATION eval queries, and the EVAL queries -- verified before/after in BOTH the
Gilded Rose TypeScript kata AND nrwl/nx `@nx/eslint-plugin`.

**Builds ON, does not re-litigate, the committed quick-task work.** The 2026-07-10/11
trigger-opt quick task already closed the SINGLE-TARGET versions of both gaps, committed live
in `SKILL.md` (241c1fb): single-target coach auto-trigger 1/18 -> 18/18 (specificity held
100%), and the QUESTION->advise / COMMAND->drive bifurcation (single-apply command drives
6/6). Phase 12 is the SWEEP + MULTI-ROUND delta on top of that.

**Out of scope (own phases / future):** re-authoring any catalog / smells / principles content
(all frozen); weakening the lz-tpp green-step seam; automated codemods / hook-driven transforms
(FUT-03); turning the eval sets into a standing CI gate; exhaustive per-leaf eval coverage.

</domain>

<decisions>
## Implementation Decisions

### Scope and framing
- **D-01:** Phase 12 builds ON the committed quick-task changes (241c1fb: intent-based pushy
  `description` + question->advise / command->drive bifurcation) and does NOT re-open them.
  Per the adversarial panel, SPLIT the two gaps and treat them differently: Gap 1 (trigger on
  sweep prompts) is a `description` + eval-set change; Gap 2 (stop-and-ask) is a NARROW behavior
  change to the command/drive arm only. Do NOT re-author catalogs / smells.md / principles, do
  NOT weaken the lz-tpp seam, do NOT expand into codemods / automated transforms (FUT-03 stays
  out).

### Trigger for sweeps (Gap 1 -- SC1)
- **D-02:** Broaden the `description` (and any routing instruction) to fire on whole-package /
  codebase / multi-file SWEEP apply prompts. The missing intent CATEGORY is "whole-package
  scan-and-fix of existing green code" -- all 13 current trigger positives are single-target.
  Address the CATEGORY, not the literal e2e phrasings (no overfit; find the general category a
  failed query represents, per the research). Keep third-person voice and the bounded-pushy
  posture the quick task established.
- **D-03:** PAIR every new sweep positive with a matching sweep-shaped HARD negative so the
  100% specificity and the lz-tpp seam survive the broadened surface. Do NOT broaden with
  generic whole-codebase imperative vocabulary that neighbors the green step or feature work.
  The prior 100% specificity was scored on the OLD description -- it is INVALID until
  re-measured on the new surface (SC1's "without regressing specificity" is unfalsifiable
  unless the eval set gains sweep negatives and re-runs the seam; the guardrail lives in the
  eval set, not the prose).
- **D-04:** `description` char budget: use the load-bearing ~1000-1500 window (current 1245 is
  fine; `claude plugin validate` accepts >1024). Keep all exclusions before the 1536 listing
  truncation. ASCII-only. (See [[skill-description-char-cap]].)

### Multi-round autonomy (Gap 2 -- SC2) -- GA-1, resolved WITH EVIDENCE
- **D-05:** [KEY, evidence-backed via the 3-lens panel] Refined Option A -- "scoped autonomous
  drive to a FIXPOINT, with a terminal review gate and structural guards." A sweep is NOT a new
  mode, flag, or sub-skill: it is the EXISTING command/drive arm with its termination changed
  from "do one refactoring, then stop" to "loop the decision procedure to a fixpoint WITHIN the
  named scope." Drive all clearly-safe, in-scope, test-covered refactoring rounds autonomously
  WITHOUT per-item asking. (Raw "autonomous whole-package to zero smells" Option A was rejected
  by the adversarial lens as unshippable; fully-autonomous-tests-only Option C rejected as
  reckless; round-by-round checkpoint Option B rejected as under-delivering SC2.)
- **D-06:** STOP-CONDITION = fixpoint within the named scope (a scan pass surfaces no remaining
  WARRANTED, ACTIONABLE, in-scope refactoring) PLUS an anti-runaway round / diff-size / file
  ceiling; then land at a terminal "N rounds, tests green each round, changes uncommitted --
  here is the summary, please review" gate. NEVER commit unless asked. The end goal is NOT
  "zero smells" (a moving target -- smell detection is a generator of work -- that invites
  over-refactoring and oscillation).
- **D-07:** PAUSE / surface (do not silently proceed) boundaries -- the guards that make the
  autonomy safe:
  1. lz-tpp seam / an item that actually changes behavior -> route to lz-tpp, EXCLUDE it from
     the sweep, continue on the rest (route, do not stall).
  2. Unrecoverable red tests -> revert the round + hard stop + report.
  3. Untested / uncovered target code -> STOP and advise Feathers characterization-tests-first
     as a SEPARATE user-approved step. NEVER sweep uncovered code on false-green (green on
     uncovered code proves nothing); NEVER auto-author characterization tests inside a sweep
     (itself a large unrequested change that pins current bugs).
  4. Speculative pattern INTRODUCTION that does not obviously earn its keep -> leave it with a
     one-line reason (clarity-is-default). De-patterning AWAY stays safe/autonomous.
  5. Genuinely ambiguous behavior -> pin or ask; never guess.
  6. Blast radius escapes the named scope -- an exported / public-API symbol change, or a
     cross-package / call-site edit outside the target's own test scope -> pause and ask (the
     local test run does NOT cover downstream monorepo consumers).
  7. Flaky or too-slow-to-run-each-step suite -> fall back to advise mode (a guard you cannot
     run after every small step is not a guard).
- **D-08:** Forward-only within a sweep -- never both introduce AND remove the same abstraction
  in one sweep, and never re-touch code an earlier round already refactored (anti-oscillation;
  the Kerievsky Away directions + the functional-catalog make round-3-pattern / round-9-depattern
  churn a real risk otherwise).
- **D-09:** The QUESTION vs COMMAND intent axis stays the PRIMARY gate; sweep is a SCOPE
  sub-branch inside the drive arm ONLY. Sweep QUESTION ("what smells are in @pkg, how would you
  fix them?") -> advise-only (prioritized smell inventory + named recommendations, edit nothing).
  SINGLE-target COMMAND ("refactor this function") -> keep the shipped "do one, then stop"
  UNCHANGED. Guard both leaks: the sweep loop must not bleed into single-target commands, and
  the single-target stop must not bleed into sweeps (that early-stop IS the current bug).
- **D-10:** Value-framing -- lead with pattern-directed / de-patterning / seam routing, where
  the skill measurably beats a strong baseline; on plain mechanical Extract Function base
  Opus 4.8 @ high is already catalog-grade (E2E Findings 2/3). This tempers over-churn
  expectations and locates where the sweep's marginal value actually lives.

### Research (SC3)
- **D-11:** Reuse `.planning/research/skill-trigger-optimization.md` (HIGH-confidence,
  web-sourced) as the trigger-optimization substrate; extend with targeted research on (a)
  whole-package / sweep trigger phrasing and (b) autonomous multi-round agent-loop /
  drive-to-completion instruction patterns, following the PROJECT.md source-authority
  precedence (Anthropic News / Claude Code Blog > frontier labs > community > Claude Code Docs >
  skill-creator > plugin-dev). Use the fetch fallback chain (markdown.new, WebFetch,
  url-to-markdown, playwright-cli) for AI-blocked domains.

### Measurement (SC4) -- prove both gaps CLOSED before/after in BOTH suites
- **D-12:** Extend the EXISTING native trigger-eval harness (no new harness code). Add 3
  sweep-shaped POSITIVES to `evals/trigger-eval.json` (recall runner auto-picks them up). Add 3
  sweep-shaped near-miss NEGATIVES to BOTH `evals/trigger-eval.json` (for the `check-evals.mjs`
  lint) AND `evals/d07-chunks/negatives.json` (the spec runner reads THIS file) -- the
  dual-write trap. Negatives guard the three boundaries: a feature-adding sweep (vs feature
  work), a performance sweep (vs speed rewrites), and a red-test sweep (vs the lz-tpp seam;
  also keeps the >=2-seam lint satisfied). Keep `check-evals` green. Before re-running, DELETE
  stale `trigger-results-d07-{recall,spec}-chunk-*.json` AND
  `evals/d07-chunks/{recall,spec}-chunk-*.json` (chunk boundaries shift when queries are added).
  LOCKED run config: canary-gated chunk runners, `--runs-per-query 3 --num-workers 1 --model
  claude-opus-4-8`, `PONYTAIL_DEFAULT_MODE=off`.
- **D-13:** Extend BOTH e2e suites with ONE multi-round sweep-COMMAND scenario each (new prompt
  + target). nx: sweep the whole `runtime-lint-utils.ts` (already carries the T3 loop->pipeline
  and T4 groupImports reduce->Map targets = 2+ safe rounds) or `src/utils`. kata: sweep
  `updateQuality` in `app/gilded-rose.ts` end-to-end (guard clauses -> per-branch updater ->
  name magic numbers = 3+ safe rounds). SEED each scenario with N safe behavior-preserving items
  + exactly ONE should-pause TRAP so posture reads deterministically: nx trap = an
  exported-signature change (public-API break); kata trap = a behavior change (Conjured handling
  / Sulfuras degradation) the golden master does not cover.
- **D-14:** Per-run pass criteria (from `meta.json` + `diff.patch` + transcript, NOT from
  `used_refactor` -- it UNDERCOUNTS invoke_skill in apply sessions; grade posture from
  transcript/diff): `fired`; `rounds_completed` (>=2); `tests_green_each_round`;
  `behavior_preserved` (run the ORIGINAL, unmodified tests against the EDITED source -- the
  behavior oracle: kata approval/golden master, nx target jest 46/46 or nx-plugin-checks 7/7);
  `scope_contained` (changed_files subset of the target file(s); no test-file edits, no
  unrelated files); plus posture signals `pauses`, `stopped_at_seeded_risk`,
  `drove_through_risk`.
- **D-15:** THE single headline metric = AUTONOMY-PRECISION: the fraction of runs that drive
  all N_safe rounds to completion WITHOUT asking, pause at most once, and land ONLY on the
  seeded should-pause item, with behavior preserved. Its two failure modes point opposite ways:
  over-pausing (rounds < N_safe, trailing "continue?") => posture B (too timid); under-pausing
  (`drove_through_risk` true, signature/behavior diff) => posture C (too reckless); high
  autonomy-precision => refined Option A is correct and correctly implemented.
- **D-16:** Before/after protocol (reuse the workspace `baseline/` and `after/` dirs). Capture
  baselines against the CURRENT shipped skill FIRST: isolated trigger -> `baseline/trigger/`;
  sweep-trigger e2e `--arm with_skill` (expect ~0 activations, reproducing Gap 1); drive e2e
  `--arm invoke_skill` (force-load, isolates DRIVE from the trigger gap) + `--arm no_skill`
  (base-Opus control) in apply mode (expect stop-and-ask, reproducing Gap 2). Then edit ->
  agent-review -> commit -> reload-plugins (USER, D-18) -> delete stale chunks -> capture
  `after/`. Report a {trigger gap, drive gap} x {nx, kata} x {before, after} matrix + Pass@k
  (per-suite + combined); a gap is CLOSED when the after-rate crosses the bar while the
  before-rate was at/near 0. Also re-run the existing 18/18 e2e coach-recommend triggering +
  the 11/11-quiet specificity set to prove NO regression (SC1).

### Process constraints (locked)
- **D-17:** The SKILL.md `description` + coach/apply + sweep-drive edits are triggering-critical
  AND agent-instruction changes -> MUST be subagent-reviewed before acceptance, including >=1
  UNBIASED from-scratch reviewer (the user's explicit approval condition + [[agent-skill-instruction-changes-need-review]]
  + [[unbiased-review-beats-primed]]).
- **D-18:** The eval RUN spends metered `claude -p`. The user PRE-APPROVED this spend for the
  phase, CONDITIONAL on any skill Markdown change having been agent-reviewed first (D-17). BUT
  `/reload-plugins` is a HARD GATE that only the USER can clear (Claude cannot run it;
  committed != live) -- so the after-measurement cannot complete autonomously. Build + review +
  commit can proceed autonomously up to that point; present the ready-to-run eval commands and
  the reload-plugins ask, then wait. (See [[eval-run-approval-gate]], [[reload-plugins-after-oracle-agent-changes]],
  [[skill-creator-eval-windows-native-fix]].)

### Claude's Discretion
- Exact `description` wording and exact sweep positive/negative phrasings (the empirical
  trigger-opt loop picks the final by held-out score; address the category, not phrasing).
- Exact SKILL.md instruction wording for the sweep-drive sentence-cluster -- per the panel it is
  ONE added cluster in the "Coach by default; drive when asked" paragraph (scope sub-branch +
  loop-to-fixpoint termination; the pause list already maps onto decision-procedure steps
  1/4/5). Keep SKILL.md < 500 lines; no new mode / config flag / sub-skill.
- Exact seeded-trap implementation and scenario counts within D-13's posture; whether a small
  posture-labeling helper is added if manual transcript reads prove too noisy.
- Whether the Gap-1 and Gap-2 changes ship as one plan or two; `k` for the `no_skill` control
  (k=1 acceptable if budget-bound, note the tradeoff).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Roadmap and requirements (PRIMARY)
- `.planning/ROADMAP.md` -> "Phase 12: Autonomous multi-round refactoring for whole-package
  sweeps" -- Goal, dependency (Phase 11), and the 4 Success Criteria (SC1 sweep trigger in both
  suites without regressing the 18/18 or specificity; SC2 multi-round autonomous drive with
  behavior-preservation guards; SC3 research-informed; SC4 both gaps measured CLOSED before/after
  in both suites).
- `.planning/REQUIREMENTS.md` -- requirements are TBD for Phase 12 (Goal + SC are the contract
  until `/gsd-spec-phase 12` formalizes them); the Out of Scope table (codemods = FUT-03).

### Skill under change (edit targets -- reviewed per D-17)
- `plugins/lz-tdd/skills/lz-refactor/SKILL.md` -- the `description` (D-02/03/04 target), the
  6-step coach decision procedure (steps 1/4/5 carry the D-07 pause conditions), and the "Coach
  by default; drive when asked" paragraph (D-05..D-09 sweep-drive target, lines ~75-82).

### Prior work this phase builds on (do NOT re-litigate)
- `.claude/skills/lz-refactor-workspace/E2E-FINDINGS.md` -- the cross-suite synthesis: Finding 1
  (trigger depends on framing + target), Finding 2/3 (base Opus catalog-grade; skill edge is
  pattern/de-patterning/seam), Finding 4 (the coach-vs-apply tension), and the 2026-07-11
  Resolution (single-target trigger 1/18->18/18, command-drive 6/6).
- `.planning/quick/20260710-lz-refactor-trigger-opt/RESEARCH.md` -- section C documents the
  native trigger-eval harness (`run-recall-chunks.mjs`, `run-spec-chunks.mjs` reading
  `evals/d07-chunks/negatives.json`, `check-evals.mjs`, canary gating, CHUNK sizes, run config,
  stale-cache deletion, reload-plugins requirement); section D the coach/apply fix direction.
- `.planning/quick/20260710-lz-refactor-trigger-opt/PROPOSED-EDITS.md` -- the exact committed
  description + coach/apply wording and the eval-set changes (13 pos / 11 neg, 4 seam) this
  phase extends.

### Research substrate (SC3)
- `.planning/research/skill-trigger-optimization.md` -- eval-set design (recall + specificity),
  hard negatives, technical-term-misuse (exclude-and-reroute in the description), Anthropic
  levers (description is the top lever; pushy-but-guarded; match user intent not jargon).

### Eval + e2e harness (measurement -- SC4, under `.claude/skills/lz-refactor-workspace/`)
- `evals/trigger-eval.json` -- positives + the `check-evals` lint source (D-12 dual-write).
- `evals/d07-chunks/negatives.json` -- the negatives the SPEC runner actually measures (D-12
  dual-write; edit BOTH).
- `run-recall-chunks.mjs`, `run-spec-chunks.mjs`, `check-evals.mjs` -- the native trigger runners
  + lint (canary-gated; `--num-workers 1`; opus-4-8; PONYTAIL off).
- `e2e-nx/` (`run-e2e.mjs`, `suite.json`, `targets.json`, `prompts/`) and `e2e-gilded-rose/`
  (`suite.json`, `targets.json`, `prompts/`, driven via `--suite`) -- the two e2e suites +
  `baseline/` / `after/` archive dirs; `run-e2e.mjs --report` emits Pass@1/@3/^3 per
  (mode,arm,prompt) and pooled.
- `tools/skill-creator-eval/run_eval.py` -- the vendored native-fixed probe (Windows-safe;
  ephemeral real skill; `--strict-mcp-config --setting-sources project`).

### Project constraints
- `CLAUDE.md` + `AGENTS.md` (project + global) -- ASCII-only committed output (`->`, straight
  quotes, no em-dashes/emojis); `git grep`/`rg` for search; npm default; public-repo hygiene
  (only the approved public gmail may appear; work email/domain never committed;
  allowlist-inversion detection); skill-creator workflow rules (Pass@k/Pass^k; wait for all
  completion notifications before grading; >=1 unbiased reviewer; NEVER run evals without
  explicit approval -- here PRE-APPROVED conditionally, D-18).

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- The committed `SKILL.md` (241c1fb) already carries the intent-based pushy `description` and
  the QUESTION->advise / COMMAND->drive paragraph -- Phase 12 EXTENDS these (one description
  broadening + one sweep-drive sentence-cluster), it does not rewrite them.
- The native trigger-eval harness + both e2e suites already exist and are proven -- NO new
  harness code is needed. Trigger = eval-set edits + existing runners; drive = one prompt +
  target per suite, posture read from the transcript/diff the runner already captures.
- The `baseline/` and `after/` archive dirs already exist in `lz-refactor-workspace/`.
- The nx `runtime-lint-utils.ts` targets (T3 loop->pipeline, T4 groupImports reduce->Map) and
  the kata `updateQuality` already provide multi-round-safe refactoring material -- seed the
  sweep scenarios there rather than inventing.

### Established Patterns
- Eval material lives under `.claude/skills/*-workspace/` (git-tracked record; bulky raw outputs
  gitignored; PR-filtered off the shipped surface). The shipped `plugins/` surface stays lean.
- ASCII-only committed content; `git grep`/`rg` first; a leading-`/` search pattern needs
  `MSYS_NO_PATHCONV=1` on Git Bash ([[gitbash-msys-slash-pattern-pathconv]]).
- Trigger-opt discipline: address the CATEGORY of a failed query, never paste its keywords;
  pick the final description by held-out/validation score; run each query 3x.
- Skill/instruction edits are agent-reviewed (incl. >=1 unbiased) before acceptance; after
  commit the plugin must be reloaded before re-eval.

### Integration Points
- Evals consume the shipped skill by path (`plugins/lz-tdd/skills/lz-refactor/`) and its
  `description`; triggering is model-specific, so runs use the session model `claude-opus-4-8`.
- The lz-tpp <-> lz-refactor seam is LIVE (both ship in `lz-tdd`): a broadened sweep description
  must keep the red-test / green-step negatives quiet (the highest-value hard negatives).
- Phase 12 is the last item of milestone lz-tdd@0.0.2 as currently rostered; the STATE.md shows
  the milestone otherwise complete. A D-05..D-09 SKILL.md change is a write-back into `plugins/`
  and re-opens the ship surface, so it re-runs the D-17 review + hygiene gates.

</code_context>

<specifics>
## Specific Ideas

- The canonical Phase-12 prompt is a whole-package sweep with no slash command: "Identify code
  smells in @nx/eslint-plugin and refactor them away." The trigger fix must catch THIS shape,
  which the current single-target-tuned description misses (0 activations).
- Seed each e2e sweep with N safe items + exactly ONE should-pause TRAP so posture A/B/C is
  deterministic: nx = exported-signature break (public-API), kata = behavior change
  (Conjured/Sulfuras). "Behavior preserved" is checked by running the ORIGINAL tests against the
  EDITED source.
- The fix is small text: one broadened `description` + one added sweep-drive sentence-cluster in
  the existing coach/apply paragraph + eval-set additions. No new mode, flag, sub-skill, or
  harness code (ponytail).
- The adversarial lens is on record that raw whole-package autonomy is max-blast-radius for
  min-marginal-value (base Opus already handles the mechanical bulk); the fixpoint + scope-bound
  + terminal-review-gate + coverage/API/flaky guards are what make it shippable. Keep the
  autonomy scoped and guarded, not open-ended.
- "Without regressing specificity" (SC1) is only verifiable if the eval set gains sweep-shaped
  negatives and re-runs the seam -- the specificity guarantee lives in the eval set, not the
  prose.

</specifics>

<deferred>
## Deferred Ideas

- Automated refactoring execution / codemods / hook-driven transforms -- FUT-03; this skill is
  guidance + in-session apply, not a transform tool.
- Turning the trigger + drive eval sets into a permanent CI/regression gate -- future; Phase 12
  is a one-time before/after validation, same posture as Phases 5 and 11.
- Exhaustive per-leaf eval coverage of every Fowler/Kerievsky/GoF/functional leaf -- out of
  scope; the sweep scenarios are a REPRESENTATIVE multi-round spread, not exhaustive (per-leaf
  correctness is already gated by the catalog checkers + oracle sweeps).
- A dedicated sweep MODE, config flag, or `lz-refactor-sweep` sub-skill -- rejected; sweep is the
  existing drive arm with a looping termination, nothing more.
- Auto-authoring characterization tests to "enable" a sweep of untested code -- explicitly
  rejected (a large unrequested change that pins current bugs); untested code -> advise Feathers
  as a separate user-approved step.

### Reviewed Todos (not folded)
None -- `todo.match-phase 12` returned 0 matches.

</deferred>

---

*Phase: 12-Autonomous multi-round refactoring for whole-package sweeps*
*Context gathered: 2026-07-11*
