# Phase 12: Autonomous multi-round refactoring for whole-package sweeps - Research

**Researched:** 2026-07-11
**Domain:** Claude Code skill authoring (description triggering + agent-loop instruction) and before/after eval measurement
**Confidence:** HIGH (design is locked in 12-CONTEXT.md; primary Anthropic engineering sources fetched for the two research deltas)

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Build ON committed quick-task 8acd2b8; do NOT re-open it. SPLIT the two gaps: Gap 1 (sweep trigger) is a `description` + eval-set change; Gap 2 (stop-and-ask) is a NARROW behavior change to the command/drive arm only. Do NOT re-author catalogs / smells.md / principles, do NOT weaken the lz-tpp seam, do NOT expand into codemods (FUT-03 out).
- **D-02:** Broaden the `description` to fire on whole-package / codebase / multi-file SWEEP apply prompts. The missing intent CATEGORY is "whole-package scan-and-fix of existing green code". Address the CATEGORY, not the literal e2e phrasings. Keep third-person voice and bounded-pushy posture.
- **D-03:** PAIR every new sweep positive with a matching sweep-shaped HARD negative so 100% specificity and the lz-tpp seam survive. Do NOT broaden with generic whole-codebase imperative vocabulary that neighbors the green step or feature work. Prior 100% specificity was scored on the OLD description -- INVALID until re-measured on the new surface. The guardrail lives in the eval set, not the prose.
- **D-04:** `description` char budget: load-bearing ~1000-1500 window (current 1245 fine; `claude plugin validate` accepts >1024). Keep all exclusions before the 1536 listing truncation. ASCII-only.
- **D-05:** [KEY, evidence-backed via 3-lens panel] Refined Option A -- "scoped autonomous drive to a FIXPOINT, with a terminal review gate and structural guards." A sweep is NOT a new mode, flag, or sub-skill: it is the EXISTING command/drive arm with its termination changed from "do one refactoring, then stop" to "loop the decision procedure to a fixpoint WITHIN the named scope." Drive all clearly-safe, in-scope, test-covered rounds autonomously WITHOUT per-item asking.
- **D-06:** STOP-CONDITION = fixpoint within the named scope (a scan pass surfaces no remaining WARRANTED, ACTIONABLE, in-scope refactoring) PLUS an anti-runaway round / diff-size / file ceiling; then land at a terminal "N rounds, tests green each round, changes uncommitted -- here is the summary, please review" gate. NEVER commit unless asked. The end goal is NOT "zero smells".
- **D-07:** PAUSE / surface (do not silently proceed) boundaries: (1) lz-tpp seam / behavior-changing item -> route to lz-tpp, EXCLUDE from sweep, continue on the rest; (2) unrecoverable red tests -> revert round + hard stop + report; (3) untested / uncovered target -> STOP, advise Feathers characterization-tests-first as a SEPARATE user-approved step (never sweep uncovered code on false-green; never auto-author characterization tests inside a sweep); (4) speculative pattern INTRODUCTION not earning its keep -> leave with a one-line reason (de-patterning AWAY stays autonomous); (5) genuinely ambiguous behavior -> pin or ask; (6) blast radius escapes named scope (exported/public-API change, cross-package/call-site edit outside target's own test scope) -> pause and ask; (7) flaky or too-slow-to-run-each-step suite -> fall back to advise mode.
- **D-08:** Forward-only within a sweep -- never both introduce AND remove the same abstraction in one sweep, and never re-touch code an earlier round already refactored (anti-oscillation).
- **D-09:** The QUESTION vs COMMAND intent axis stays the PRIMARY gate; sweep is a SCOPE sub-branch inside the drive arm ONLY. Sweep QUESTION -> advise-only (prioritized inventory + named recommendations, edit nothing). SINGLE-target COMMAND -> keep the shipped "do one, then stop" UNCHANGED. Guard both leaks.
- **D-10:** Value-framing -- lead with pattern-directed / de-patterning / seam routing (where the skill measurably beats a strong baseline); plain mechanical Extract Function is already base-Opus catalog-grade.
- **D-11:** Reuse `.planning/research/skill-trigger-optimization.md` as the trigger-optimization substrate; extend with (a) whole-package/sweep trigger phrasing and (b) autonomous multi-round agent-loop instruction patterns, following PROJECT.md source-authority precedence. Use the fetch fallback chain for AI-blocked domains.
- **D-12:** Extend the EXISTING native trigger-eval harness (no new harness code). Add 3 sweep-shaped POSITIVES to `evals/trigger-eval.json`. Add 3 sweep-shaped near-miss NEGATIVES to BOTH `evals/trigger-eval.json` (for `check-evals.mjs`) AND `evals/d07-chunks/negatives.json` (the spec runner reads THIS file) -- the dual-write trap. Negatives guard three boundaries: feature-adding sweep, performance sweep, red-test sweep. Keep `check-evals` green. Before re-running, DELETE stale `trigger-results-d07-{recall,spec}-chunk-*.json` AND `evals/d07-chunks/{recall,spec}-chunk-*.json`. LOCKED run config: canary-gated chunk runners, `--runs-per-query 3 --num-workers 1 --model claude-opus-4-8`, `PONYTAIL_DEFAULT_MODE=off`.
- **D-13:** Extend BOTH e2e suites with ONE multi-round sweep-COMMAND scenario each. nx: sweep `runtime-lint-utils.ts` (T3 loop->pipeline + T4 groupImports reduce->Map = 2+ safe rounds) or `src/utils`. kata: sweep `updateQuality` in `app/gilded-rose.ts` (guard clauses -> per-branch updater -> name magic numbers = 3+ safe rounds). SEED each with N safe items + exactly ONE should-pause TRAP: nx trap = exported-signature change (public-API break); kata trap = a behavior change (Conjured / Sulfuras) the golden master does not cover.
- **D-14:** Per-run pass criteria from `meta.json` + `diff.patch` + transcript (NOT `used_refactor` -- it UNDERCOUNTS invoke_skill in apply sessions): `fired`; `rounds_completed` (>=2); `tests_green_each_round`; `behavior_preserved` (run the ORIGINAL unmodified tests against the EDITED source); `scope_contained` (changed_files subset of target file(s); no test-file edits, no unrelated files); plus posture signals `pauses`, `stopped_at_seeded_risk`, `drove_through_risk`.
- **D-15:** Headline metric = AUTONOMY-PRECISION: fraction of runs that drive all N_safe rounds to completion WITHOUT asking, pause at most once, land ONLY on the seeded should-pause item, behavior preserved. Over-pausing => posture B (too timid); under-pausing (drove_through_risk) => posture C (too reckless); high autonomy-precision => refined Option A correct + correctly implemented.
- **D-16:** Before/after protocol (reuse workspace `baseline/` and `after/`). Capture baselines against CURRENT shipped skill FIRST. Then edit -> agent-review -> commit -> reload-plugins (USER, D-18) -> delete stale chunks -> capture `after/`. Report {trigger gap, drive gap} x {nx, kata} x {before, after} matrix + Pass@k (per-suite + combined); a gap is CLOSED when the after-rate crosses the bar while before was at/near 0. Also re-run the existing 18/18 e2e coach-recommend triggering + the 11/11-quiet specificity set (SC1 no-regression).
- **D-17:** SKILL.md `description` + coach/apply + sweep-drive edits are triggering-critical AND agent-instruction changes -> MUST be subagent-reviewed before acceptance, including >=1 UNBIASED from-scratch reviewer.
- **D-18:** The eval RUN spends metered `claude -p`. PRE-APPROVED for the phase, CONDITIONAL on any skill Markdown change having been agent-reviewed first (D-17). BUT `/reload-plugins` is a HARD GATE only the USER can clear. Build + review + commit proceed autonomously up to that point; present ready-to-run eval commands + the reload-plugins ask, then wait.

### Claude's Discretion

- Exact `description` wording and exact sweep positive/negative phrasings (address the category, not phrasing; pick final by held-out score).
- Exact SKILL.md instruction wording for the sweep-drive sentence-cluster -- ONE added cluster in the "Coach by default; drive when asked" paragraph (scope sub-branch + loop-to-fixpoint termination; the pause list already maps onto decision-procedure steps 1/4/5). Keep SKILL.md < 500 lines; no new mode / config flag / sub-skill.
- Exact seeded-trap implementation and scenario counts within D-13's posture; whether a small posture-labeling helper is added if manual transcript reads prove too noisy.
- Whether Gap-1 and Gap-2 changes ship as one plan or two; `k` for the `no_skill` control (k=1 acceptable if budget-bound, note the tradeoff).

### Deferred Ideas (OUT OF SCOPE)

- Automated refactoring execution / codemods / hook-driven transforms (FUT-03).
- Turning the trigger + drive eval sets into a permanent CI/regression gate.
- Exhaustive per-leaf eval coverage of every Fowler/Kerievsky/GoF/functional leaf.
- A dedicated sweep MODE, config flag, or `lz-refactor-sweep` sub-skill.
- Auto-authoring characterization tests to "enable" a sweep of untested code.
</user_constraints>

<phase_requirements>
## Phase Requirements

REQ-IDs are TBD (formalized in `/gsd-spec-phase 12`); the 4 ROADMAP Success Criteria are the contract.

| ID | Description | Research Support |
|----|-------------|------------------|
| SC1 | Whole-package sweep prompt auto-triggers lz-refactor in BOTH suites (kata + nx), before/after, WITHOUT regressing coach-recommend (18/18) or specificity | Standard Stack (description is the sole routing lever); Architecture Pattern 1 (sweep intent category); Common Pitfall 1 (overfit) + 6 (specificity invalid until re-measured); Measurement (D-12 dual-write + no-regression re-run) |
| SC2 | On a sweep, the skill drives multiple rounds autonomously toward the end goal with behavior-preservation guards (tests between rounds), reconciled with question->advise / command->drive -- not stop-and-ask on every risk | Architecture Pattern 2 (loop-to-fixpoint instruction, modeled on the loop-engineering SKILL.md template); Code Examples; Don't Hand-Roll (no new mode/harness) |
| SC3 | Skill instruction / description / trigger-opt / eval-query changes are informed by research (source-authority precedence) | This document + the reused substrate; Sources section (primary Anthropic engineering posts) |
| SC4 | Both gaps measured CLOSED (before/after in both suites) -- not assertion alone | Measurement section (native trigger harness + both e2e suites + baseline/after archive + Pass@k); Validation Architecture (build-time gates before the metered run) |
</phase_requirements>

## Summary

Phase 12 closes two empirically-confirmed gaps that block `lz-refactor` from serving the autonomous multi-round whole-package sweep use case (canonical prompt: "Identify code smells in @nx/eslint-plugin and refactor them away", no slash command). The fix is deliberately small text: (1) broaden the frontmatter `description` to fire on the whole-package/codebase scan-and-fix intent category, paired with sweep-shaped hard negatives that keep specificity and the lz-tpp green-step seam intact; and (2) add ONE sentence-cluster to the existing "Coach by default; drive when asked" paragraph that changes the drive arm's termination from "do one, then stop" to "loop the decision procedure to a fixpoint within the named scope", with a terminal review gate and seven pause boundaries. No new mode, flag, sub-skill, or harness code. The design was already adjudicated by a 3-lens panel and is locked in D-05..D-16; this research answers HOW to author and HOW to measure, not WHETHER.

The trigger delta (Gap 1) is a straight extension of the existing single-target trigger-optimization substrate (`.planning/research/skill-trigger-optimization.md`, HIGH) to a new intent CATEGORY. The primary levers are unchanged: the `description` is the top selection lever, write it action- and trigger-oriented, match user intent not jargon, be bounded-pushy, and let near-miss negatives carry the specificity signal. The behavior delta (Gap 2) is grounded in three primary Anthropic engineering posts (all fetched HIGH): "Building Effective Agents" (agents are loops; terminate on completion OR a max-iteration stopping condition; escalate rather than guess), "Effective harnesses for long-running agents" (the exact two failure modes this phase fights -- do-too-much-at-once and declare-done-early -- and the antidote: define "done" explicitly, work incrementally, leave a clean state after each step), and "Loop engineering: Getting started with loops" (define success criteria so Claude does not self-judge "good enough" and stop early; and the explicit endorsement of encoding the verification loop INSIDE a SKILL.md). Anthropic's loop mechanics are largely harness-level (Agent SDK, `/goal` evaluator); Phase 12 correctly transfers the PRINCIPLES into SKILL.md instruction prose instead of adding tooling.

**Primary recommendation:** Extend `description` to signal whole-package scan-and-fix of existing green code (the intent category), guarded by 3 sweep-shaped hard negatives; add one loop-to-fixpoint sentence-cluster to the drive arm modeled on the loop-engineering "verify... do not hand back partially verified work" template, with the D-07 pauses mapped onto decision-procedure steps 1/4/5; then measure before/after on the untouched native + e2e harness (dual-write negatives, delete stale chunks, reload-plugins is a user gate).

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Sweep auto-trigger (Gap 1 / SC1) | Skill metadata (`description` frontmatter) | Eval set (`trigger-eval.json` + `d07-chunks/negatives.json`) | The `description` is the sole routing lever Claude sees at startup; negatives are the only place the specificity guarantee can live |
| Multi-round drive-to-fixpoint (Gap 2 / SC2) | Skill body (SKILL.md "Coach by default; drive when asked" paragraph) | Coach decision procedure steps 1/4/5 (pause boundaries) | The loop is instruction prose, not tooling; the pause list already maps onto existing decision-procedure steps |
| Behavior-preservation guards (7 pause boundaries) | Skill body (instruction prose) | lz-tpp sibling skill (seam routing) | Routing + stop conditions are expressed as instructions; behavior-changing items hand off to lz-tpp |
| Before/after measurement (SC4) | Native trigger-eval harness + both e2e suites (non-shipped `lz-refactor-workspace/`) | `baseline/` and `after/` archive dirs | Measurement is code fully isolated from the shipped `plugins/` surface |
| No-regression on frozen catalogs + skill structure | Build-time checkers (`npm run check`, `check-evals.mjs`, `claude plugin validate`) | Agent review gate (D-17) | Gates the frozen `references/` catalogs and skill frontmatter before the metered run |

## Standard Stack

No new libraries are installed by this phase. The "stack" is the existing, proven authoring and measurement toolchain already on disk.

### Core (existing, reused)
| Component | Version / Location | Purpose | Why Standard |
|-----------|--------------------|---------|--------------|
| Claude Code Agent Skills | current 2.1.x line | `SKILL.md` frontmatter `description` is the trigger; body carries the multi-step procedure | The `description` is the top selection lever; the body is where procedural loop guidance lives [CITED: platform.claude.com Agent Skills overview] |
| Native trigger-eval harness | `.claude/skills/lz-refactor-workspace/{run-recall-chunks.mjs, run-spec-chunks.mjs, check-evals.mjs}` | Recall + specificity, canary-gated, chunked, `--num-workers 1` | Proven in Phase 11 (100% recall / 100% specificity baseline); D-12 mandates reuse, no new harness code [VERIFIED: read on disk] |
| e2e suites | `.claude/skills/lz-refactor-workspace/{e2e-nx, e2e-gilded-rose}/run-e2e.mjs` | `--mode recommend|apply`, `--arm with_skill|no_skill|invoke_skill`, `--report` (Pass@1/@3/^3) | Ground-truth `--plugin-dir` triggering + apply; already exercised in the 2026-07-11 resolution [VERIFIED: read on disk] |
| `claude plugin validate .` / `--strict` | Claude Code CLI | Structural + frontmatter gate; confirms description length is accepted (>1024 OK) | Authoritative pre-ship gate [CITED: project CLAUDE.md Technology Stack] |
| skill-creator eval probe | `.claude/skills/lz-refactor-workspace/tools/skill-creator-eval/run_eval.py` | Windows-safe ephemeral-skill trigger probe (`--strict-mcp-config --setting-sources project`) | Vendored native-fix; the chunk runners call it [VERIFIED: read on disk] |

### Supporting (existing)
| Component | Location | Purpose | When to Use |
|-----------|----------|---------|-------------|
| `baseline/` and `after/` archive dirs | `lz-refactor-workspace/` | Store before/after trigger chunk results | D-16 before/after protocol |
| Catalog checker battery | `lz-refactor-workspace/tools/check-*.mjs` (`npm run check`) | Gates the frozen `references/` catalogs | No-regression check only (Phase 12 does NOT touch catalogs) |
| Target repos on disk | `D:/projects/github/nrwl/nx` (23.0.x), `D:/projects/github/emilybache/GildedRose-Refactoring-Kata/TypeScript` | Real codebases the e2e apply arm edits on a throwaway branch | e2e apply-mode runs (D-13) |

### Alternatives Considered
| Instead of | Could Use | Tradeoff (why rejected here) |
|------------|-----------|------------------------------|
| Encoding the loop in SKILL.md prose | Claude Code `/goal` (goal-based loop with evaluator) | `/goal` is a user-invoked harness primitive; it cannot be shipped inside a skill and requires the user to type it. The loop-engineering blog explicitly endorses encoding the verification loop in SKILL.md instead [CITED: claude.com/blog/getting-started-with-loops] |
| Reusing the existing drive arm | A new sweep MODE / flag / sub-skill | Rejected in D-05 and Deferred Ideas: a sweep is the existing drive arm with a looping termination, nothing more (ponytail) |
| Extending the native + e2e harness | New harness code | D-12: no new harness code; eval-set edits + one prompt/target per suite suffice |

**Installation:** None. No packages added. Phase edits are Markdown (`SKILL.md`) + JSON (eval sets) + two new e2e prompt files.

## Package Legitimacy Audit

**Not applicable.** This phase installs no external packages. All tooling already exists on disk in `lz-refactor-workspace/` and was vendored in Phase 11. The only file additions are Markdown (skill prose, e2e prompts) and JSON (eval queries). No npm/PyPI/crates install occurs, so no slopcheck / registry verification is required.

## Architecture Patterns

### System flow (trigger + drive, end to end)

```
User prompt (no slash command)
  "Identify code smells in @nx/eslint-plugin and refactor them away"
        |
        v
[Skill selection]  Claude reads all skill descriptions in its system prompt
        |            <-- Gap 1 lives HERE: description must match the
        |                whole-package scan-and-fix intent category
        v
   description matches?  --no-->  base Opus does the work (current Gap-1 failure: 0 activations)
        | yes
        v
[SKILL.md body loaded]  classify request against the QUESTION vs COMMAND axis (D-09, primary gate)
        |
        +-- QUESTION ("what smells are in @pkg, how would you fix them?")
        |        -> advise-only: prioritized smell inventory + named recommendations, edit nothing
        |
        +-- SINGLE-target COMMAND ("refactor this function")
        |        -> UNCHANGED shipped behavior: do one, then stop
        |
        +-- SWEEP COMMAND (scope = a named package / directory / module)   <-- Gap 2 lives HERE
                 |
                 v
        [Loop the decision procedure to a FIXPOINT within the named scope]
                 |
             +-> scan pass: any WARRANTED, ACTIONABLE, in-scope refactoring left?
             |        | yes
             |        v
             |   pick next round -> check pause boundaries (D-07 steps 1/4/5/6)
             |        |
             |        +-- clean, safe, test-covered, in-scope -> apply one round,
             |        |        run tests, keep going (forward-only, D-08)
             |        |
             |        +-- pause boundary hit -> route/exclude/revert/advise (do NOT silently proceed)
             |        |
             |        '--> back to scan pass
             |
             '-> no remaining item OR anti-runaway ceiling (rounds/diff/files) reached
                      |
                      v
        [Terminal review gate]  "N rounds, tests green each round, changes uncommitted --
                                 here is the summary, please review"  (NEVER commit unless asked)
```

### Recommended edit surface (prescriptive)
```
plugins/lz-tdd/skills/lz-refactor/SKILL.md
  frontmatter description (lines 3-17)   # Gap 1: add the sweep intent category + 3 exclusions hold
  "Coach by default; drive when asked"   # Gap 2: add ONE sweep-drive sentence-cluster (scope sub-branch
    paragraph (lines 75-82)              #        + loop-to-fixpoint termination + terminal review gate)
  decision procedure steps 1/4/5 (43-73) # pauses already map here; reference, do not duplicate prose

.claude/skills/lz-refactor-workspace/evals/trigger-eval.json       # +3 sweep positives, +3 sweep negatives
.claude/skills/lz-refactor-workspace/evals/d07-chunks/negatives.json # +3 sweep negatives (DUAL-WRITE)
.claude/skills/lz-refactor-workspace/e2e-nx/{suite.json, targets.json, prompts/}       # +1 sweep-command scenario
.claude/skills/lz-refactor-workspace/e2e-gilded-rose/{suite.json, targets.json, prompts/} # +1 sweep-command scenario
```

### Pattern 1: Sweep trigger as a new INTENT CATEGORY (Gap 1)
**What:** The 13 current trigger positives are all single-target ("this function", "this class"). The missing category is "whole-package / codebase / multi-file scan-and-fix of existing green code" -- the user names a PACKAGE / DIRECTORY / CODEBASE (not one symbol) and asks to both FIND smells and FIX them, with no slash command.
**When to use:** Broadening the `description` (D-02). Add scope-plural language that signals package/codebase/module-wide scanning + iterated fixing, framed as the SAME existing intent (improve structure/readability of existing working code) applied at package scope.
**Prescriptive signals to add** (the category, not the e2e phrasing):
- Scope words: "across a package / module / directory / codebase", "the whole X", a scoped package name (e.g. `@scope/pkg`).
- Scan-and-act framing: "identify / find code smells and refactor them away", "clean up / sweep a package for smells", "go through the module and improve what needs it".
**Boundaries that MUST hold** (the 3 sweep-shaped hard negatives, D-03/D-12) -- pair each new positive with one:
- feature-adding sweep ("add X across the package", "implement Y everywhere") -> feature work, NOT refactor.
- performance sweep ("make the whole module faster", "optimize the package") -> speed rewrite, NOT structure.
- red-test sweep ("get the failing tests across the package to pass") -> lz-tpp green step (also keeps the >=2-seam `check-evals` lint satisfied).
**Anti-overfit rule:** address the category; do NOT paste the e2e prompt keywords into the description; pick the final wording by held-out/validation score (per the substrate).

### Pattern 2: Loop-to-fixpoint as INSTRUCTION prose, not tooling (Gap 2)
**What:** Change the drive arm's termination. Today the drive arm applies one behavior-preserving refactoring and stops (correct for a single-target command; the BUG for a sweep). For a sweep command, loop the decision procedure to a fixpoint within the named scope, running tests each round, pausing on the D-07 boundaries, landing at a terminal review gate.
**When to use:** The ONE added sentence-cluster in the "Coach by default; drive when asked" paragraph (D-05, discretion). Keep it to one cluster; the pause conditions already live in decision-procedure steps 1/4/5 -- reference them, do not restate.
**How real skills express "keep going until done, but stop on real risk":** the loop-engineering blog's own shipped example encodes the loop inside a SKILL.md with a numbered procedure that ends "If any step fails, fix the issue and rerun from step 1 -- do not hand back partially verified work." Model the sweep-drive cluster on that shape: an explicit "keep going until no in-scope item remains" + "run the tests each round" + "do not stop after one" + the explicit pause/stop list + "leave changes uncommitted for review". [CITED: claude.com/blog/getting-started-with-loops]
**Why this maps to Anthropic guidance:**
- "Agents are loops; the task terminates on completion, but it is common to include stopping conditions such as a maximum number of iterations to maintain control." -> the fixpoint (completion) + the anti-runaway round/diff/file ceiling (max-iteration stop). [CITED: anthropic.com/engineering/building-effective-agents]
- The two documented long-running failure modes are EXACTLY this phase's two postures: (a) "try to do too much at once" = posture C over-reach / runaway; (b) a later agent "look around, see progress, declare the job done" = posture B premature stop (the current Gap-2 bug). Antidote: define what "done" looks like explicitly, work incrementally one item at a time, leave a clean state (tests green + revertable) after each step. [CITED: anthropic.com/engineering/effective-harnesses-for-long-running-agents]
- "When you define the success criteria, Claude doesn't have to determine what is 'good enough' and end the loop early." Deterministic criteria (tests passing) are the most reliable stop signal. -> define the fixpoint + tests-green-each-round explicitly so the model does not self-judge and stop. [CITED: claude.com/blog/getting-started-with-loops]
- "Escalate to a human rather than guessing" and "build human approval checkpoints for high-stakes decisions" -> the D-07 pause boundaries + the terminal review gate + never-commit-unless-asked. [CITED: anthropic.com/engineering/building-effective-agents; equipping-agents-for-the-real-world-with-agent-skills]

### Anti-Patterns to Avoid
- **A new sweep mode / flag / sub-skill.** Rejected (D-05, Deferred). Sweep is the existing drive arm with a looping termination.
- **"Zero smells" as the goal.** Smell detection is a generator of work; "zero" is a moving target that invites over-refactoring and oscillation. The goal is the fixpoint within scope (D-06).
- **Introduce-then-remove churn in one sweep.** Forward-only; never both introduce AND remove the same abstraction, never re-touch an already-refactored region (D-08).
- **Sweeping uncovered code on false-green.** Green on untested code proves nothing; STOP and advise Feathers characterization-tests-first as a separate user-approved step. Never auto-author characterization tests inside a sweep (D-07.3).
- **Generic whole-codebase imperative vocabulary in the description.** It neighbors feature work and the green step and will leak specificity (D-03).
- **Committing autonomously.** Land uncommitted at the review gate; commit only on request (D-06; matches reversible-over-irreversible).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Multi-round autonomy | A `/goal`-style evaluator loop, a sweep sub-agent, or any orchestration code | The turn-based loop encoded as SKILL.md instruction prose | The loop-engineering blog endorses encoding the loop in SKILL.md; a harness is out of scope (D-05, FUT-03) [CITED: claude.com/blog] |
| Sweep triggering | A hook, a router agent, or a second skill | The existing `description` (broadened) | The description IS the trigger mechanism; adding surface adds validation risk with no value |
| Before/after measurement | A new eval runner / grader | The existing canary-gated chunk runners + `run-e2e.mjs --report` | Proven in Phase 11; D-12 forbids new harness code |
| Behavior-preservation oracle | A new comparison tool | Run the ORIGINAL unmodified tests against the EDITED source (kata golden master; nx jest 46/46 or nx-plugin-checks 7/7) | D-14; a green-on-edited-source run against the untouched test file is the behavior oracle |
| Posture labeling | An LLM grader by default | Manual transcript/diff read; add a small posture-labeling helper ONLY if manual reads prove too noisy | Discretion; keep it lazy unless noise forces it |

**Key insight:** Every capability this phase needs already exists as text or as proven harness code. The entire phase is authoring (two edits + eval queries + two prompts) plus running the existing measurement. The temptation to "build a real sweep engine" is exactly the max-blast-radius / min-marginal-value trap the adversarial lens flagged.

## Common Pitfalls

### Pitfall 1: Overfitting the description to the e2e prompts
**What goes wrong:** Pasting keywords from the failing sweep prompts into the description; it then triggers on those exact phrasings and misses the general category.
**Why it happens:** The e2e prompts are concrete and tempting; the category is abstract.
**How to avoid:** Address the intent CATEGORY (whole-package scan-and-fix of existing green code); pick the final wording by held-out/validation score, not by the training prompts. [CITED: skill-trigger-optimization.md]
**Warning signs:** New positives are near-clones sharing a file/template; the added description phrase quotes an e2e prompt.

### Pitfall 2: The dual-write trap (spec runner reads a DIFFERENT file)
**What goes wrong:** Adding sweep negatives only to `trigger-eval.json`; the specificity runner never measures them because it reads `evals/d07-chunks/negatives.json`.
**Why it happens:** `check-evals.mjs` lints `trigger-eval.json`; `run-spec-chunks.mjs` reads `d07-chunks/negatives.json`. Two files, one logical set.
**How to avoid:** Write every new negative to BOTH files, byte-consistent (D-12). Keep `check-evals` green (>=8 pos, >=8 neg, >=2 seam, ASCII). [VERIFIED: read run-spec-chunks.mjs + check-evals.mjs]
**Warning signs:** The spec runner's negative count does not match the lint's.

### Pitfall 3: Stale chunk cache after adding queries
**What goes wrong:** Chunk boundaries shift when queries are added (CHUNK_SIZE 3 recall / 4 spec); a resumed run reuses stale results keyed to the old boundaries.
**Why it happens:** The runners are resumable and skip "valid" chunks by index.
**How to avoid:** Before re-running, DELETE all `trigger-results-d07-{recall,spec}-chunk-*.json` AND `evals/d07-chunks/{recall,spec}-chunk-*.json` (D-12). [VERIFIED: read both runners]
**Warning signs:** Reported counts do not add up to the new query totals; a chunk "VALID, skip" that predates the edit.

### Pitfall 4: `used_refactor` undercounts in apply sessions
**What goes wrong:** Grading `fired` from the `used_refactor` flag misses invoke_skill in edit-heavy apply runs (the slash command loads the skill up front without a later tool_use).
**Why it happens:** `used_refactor` is a `tool_use` reference; apply sessions do not re-reference it.
**How to avoid:** Grade posture from the transcript + `diff.patch` + `meta.json`, not `used_refactor` (D-14). Confirm activation from answer content (catalog terms, seam callouts). [VERIFIED: E2E-FINDINGS.md caveat + run-e2e.mjs report uses used_refactor||used_tpp for Pass@k]
**Warning signs:** apply-arm Pass@k shows 0 firing while the diff clearly applied catalog-named refactorings.

### Pitfall 5: The reload-plugins hard gate blocks autonomous after-measurement
**What goes wrong:** Editing + committing SKILL.md does NOT make the change live for `--plugin-dir` eval; committed != live.
**Why it happens:** Claude cannot run `/reload-plugins`; only the user can.
**How to avoid:** Build + review + commit autonomously; then present the ready-to-run eval commands and the reload-plugins ask, and WAIT (D-18). [CITED: MEMORY reload-plugins-after-oracle-agent-changes]
**Warning signs:** After-measurement numbers look identical to baseline (the old skill is still loaded).

### Pitfall 6: Specificity is INVALID until re-measured on the new surface
**What goes wrong:** Claiming "specificity held at 100%" from the OLD description's run after broadening the description.
**Why it happens:** SC1 says "without regressing specificity", but the prior number was scored on a different description.
**How to avoid:** The guarantee lives in the eval set: add the sweep negatives and re-run the seam + specificity set on the NEW description before claiming no-regression (D-03). [CITED: 12-CONTEXT.md D-03]
**Warning signs:** A no-regression claim that cites a pre-edit specificity number.

### Pitfall 7: Over-pausing vs under-pausing (the two failure postures)
**What goes wrong:** Posture B (too timid): the loop stops early with a trailing "continue?" -- the current Gap-2 bug re-appears. Posture C (too reckless): the loop drives through a seeded should-pause trap (signature/behavior change).
**Why it happens:** The instruction wording under- or over-specifies the stop conditions.
**How to avoid:** The headline metric AUTONOMY-PRECISION (D-15) catches both; the seeded ONE-trap-per-scenario design (D-13) makes the posture deterministic; tune the sentence-cluster wording between iterations. [CITED: 12-CONTEXT.md D-13/D-15]
**Warning signs:** rounds_completed < N_safe with a trailing question (B); drove_through_risk true with a signature/behavior diff (C).

### Pitfall 8: Blast radius escaping the named scope (monorepo)
**What goes wrong:** A sweep edits an exported/public-API symbol or a cross-package call site; the local test run passes but downstream monorepo consumers break undetected.
**Why it happens:** The local test suite does not cover downstream consumers (nx is a monorepo).
**How to avoid:** D-07.6 -- pause and ask on exported-signature or cross-package edits. This is exactly the nx seeded trap (exported-signature change). [CITED: 12-CONTEXT.md D-07/D-13]
**Warning signs:** `scope_contained` false; changed files outside the target file(s).

## Code Examples

### The loop-encoded-in-SKILL.md pattern (Anthropic's own shipped shape)
The loop-engineering blog ships this SKILL.md example. It is the template for the Gap-2 sweep-drive cluster: numbered procedure, explicit rerun-until-done, explicit "do not hand back partial work".
```markdown
# Source: claude.com/blog/getting-started-with-loops
---
name: verify-frontend-change
description: Verify any UI change end-to-end before declaring it done.
---
# Verifying frontend changes
Never report a UI change as complete based on a successful edit alone. Verify it the way a
human reviewer would:
1. Start the dev server and open the edited page in the browser.
2. Interact with the change directly ... confirm the expected state change ...
3. Check the browser console: zero new errors or warnings.
4. Use ... run a performance trace and audit Core Web Vitals.
If any step fails, fix the issue and rerun from step 1 -- do not hand back partially verified work.
```
Transfer to the sweep-drive cluster (conceptual, not final wording -- discretion): "When the command names a package/directory scope, do not stop after one refactoring. Repeat: scan the scope for the next warranted, in-scope, test-covered refactoring; apply it in small steps; run the tests. Keep going until a scan pass finds nothing left (or you hit the round/diff/file ceiling). Pause and surface -- do not silently proceed -- when [the D-07 list]. Then stop and leave the changes uncommitted with a summary for review; never commit unless asked."

### The existing "Coach by default; drive when asked" paragraph (what to extend, not rewrite)
```markdown
# Source: plugins/lz-tdd/skills/lz-refactor/SKILL.md lines 75-82 (committed 8acd2b8)
Coach by default; drive when asked. When the request is a QUESTION or asks for advice
(...), present the named refactoring and the smallest next step ... When the request is an
explicit COMMAND to do it (...), perform the refactoring yourself in small behavior-preserving
steps, running the tests after each; then stop and leave the changes for the developer to
review -- do not commit unless they ask. ...
```
The single added cluster keys off SCOPE inside the COMMAND branch: single-target command keeps "then stop" (D-09, unchanged); a package/directory-scoped command loops to a fixpoint.

### Native trigger-eval invocation (locked config, D-12)
```bash
# Source: run-recall-chunks.mjs / run-spec-chunks.mjs (read on disk)
# recall (positives, incl. new sweep positives): canary-gated, CHUNK_SIZE 3
node run-recall-chunks.mjs            # run/resume; --report to print only
# specificity (negatives from d07-chunks/negatives.json): canary-gated, CHUNK_SIZE 4
node run-spec-chunks.mjs
# both call: python -m scripts.run_eval --runs-per-query 3 --num-workers 1
#            --model claude-opus-4-8   (env PONYTAIL_DEFAULT_MODE=off)
# BEFORE re-running after adding queries: delete stale trigger-results-*-chunk-*.json
# and d07-chunks/{recall,spec}-chunk-*.json (chunk boundaries shift)
```

### e2e sweep-command run (D-13/D-16)
```bash
# Source: e2e-nx/run-e2e.mjs (read on disk)
# baseline sweep-trigger (expect ~0 activations, reproduces Gap 1):
node run-e2e.mjs --mode apply --arm with_skill --cwd <nx-throwaway-branch>
# drive isolated from trigger (force-load, reproduces Gap 2 stop-and-ask):
node run-e2e.mjs --mode apply --arm invoke_skill --cwd <nx-throwaway-branch>
node run-e2e.mjs --mode apply --arm no_skill --cwd <nx-throwaway-branch>   # base-Opus control
node run-e2e.mjs --report   # Pass@1/@3/^3 per (mode,arm,prompt) + pooled
# apply mode refuses to run on a protected branch and resets to applyBase between k runs
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| "Coach, don't drive... never edit unless asked" (blanket no-edit) | Question->advise / command->drive bifurcation | Quick task 8acd2b8 (2026-07-11) | The command arm now drives; Phase 12 extends only its termination for sweeps |
| Skill author self-judges when the loop is "done" | Define "done" explicitly so the model does not stop early; deterministic (tests) criteria; encode the loop in SKILL.md | Loop engineering blog (2026-06-30) | Directly informs the Gap-2 sentence-cluster wording |
| Long-running work one-shotted or declared-done-early | Initializer + incremental coding agent, explicit feature checklist, clean state each step | Effective harnesses post (2025-11-26) | The two failure modes = this phase's two postures; antidote transfers as instruction prose |

**Deprecated/outdated:**
- The blanket "never edit" instruction (superseded by the committed bifurcation; do not reintroduce).
- The pre-edit "100% specificity" claim as evidence for the broadened description (invalid until re-measured, Pitfall 6).

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Broadening the `description` with scope-plural scan-and-fix language will raise sweep auto-trigger without collapsing specificity | Pattern 1 | LOW-MED: the eval set (3 sweep negatives + re-run) is the falsifier; if it regresses, tune wording per held-out score. This is exactly what SC4 measures |
| A2 | A single SKILL.md sentence-cluster is sufficient to flip the drive termination to a fixpoint (no tooling) | Pattern 2 | MED: if instruction prose alone yields posture B/C under measurement, discretion allows a second tuning iteration; still no harness (D-05) |
| A3 | The seeded ONE-trap-per-scenario design makes posture A/B/C read deterministically from transcript/diff | Measurement | LOW: discretion permits a small posture-labeling helper if manual reads prove noisy |
| A4 | Grading posture from transcript+diff+meta (not `used_refactor`) is reliable in apply mode | Pitfall 4 | LOW: confirmed by the 2026-07-11 e2e resolution using the same method |

**Note:** No package-name or version assumptions exist (no installs). The exact final `description` and sweep phrasings are Claude's-discretion and are selected empirically by held-out score, not asserted here.

## Open Questions (RESOLVED)

1. **Does the broadened description leak onto feature-work / performance sweeps or the green step?**
   - RESOLVED: keep the perf-sweep negative and broaden the description without a literal "not for performance" clause -- implemented by 12-01 (the 3 dual-written sweep negatives incl. perf-sweep, which carry the specificity guarantee) + 12-02 (description broadening, no perf-exclusion clause per Open Question 1); the metered specificity run (12-03) adjudicates any residual leak.
   - What we know: the 3 sweep-shaped hard negatives (feature, perf, red-test) plus the existing 3-boundary exclusions are the guard.
   - What's unclear: whether the perf-sweep negative stays quiet given the description already leaves single-target perf partly in scope (a known ambiguity carried from the quick task).
   - Recommendation: keep the perf-sweep negative; let the specificity run decide; sharpen the anchor only if it becomes a persistent false positive (do not add a literal "not for performance" clause -- overfitting).

2. **One plan or two (Gap 1 vs Gap 2)?**
   - RESOLVED: both edits (Gap 1 description + Gap 2 sweep-drive cluster) ship in ONE plan (12-02), sharing a single D-17 review and the single reload-plugins gate; the instruments (12-01) and the present-and-halt gate (12-03) are separate plans for wave/parallelism reasons, not a Gap-1/Gap-2 split.
   - What we know: D-01 splits the gaps conceptually; both edit the same SKILL.md.
   - What's unclear: whether shipping them as one plan (one review, one reload) or two is lower-friction.
   - Recommendation: discretion. One combined plan is likely lazier given both edits touch one file and share the D-17 review + the single reload-plugins gate; note the tradeoff if split.

3. **`k` for the `no_skill` control?**
   - RESOLVED: k=1 for the base-Opus no_skill control (a reproduction reference), k=3 for the with_skill / invoke_skill arms where autonomy-precision is measured -- implemented by the 12-03 presented protocol (D-15/D-16 locked run config).
   - What we know: k=1 acceptable if budget-bound (discretion), with a tradeoff note.
   - Recommendation: k=1 for the base-Opus control (it is a reproduction reference, not the headline); keep k=3 for the with_skill / invoke_skill arms where autonomy-precision is measured.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| `claude` CLI (`claude -p`, `--plugin-dir`, `--setting-sources project`) | trigger + e2e runs | Yes (session runtime) | 2.1.x line | none -- metered runs need it (gated on user reload) |
| `python` (`python -m scripts.run_eval`) | native trigger-eval probe | Yes (per CLAUDE.md: Python 3 installed) | 3.x | none |
| `node` (ESM `.mjs` runners) | all harness scripts | Yes (FNM-managed) | current | none |
| nrwl/nx repo on disk @ 23.0.x | e2e-nx apply arm | Yes | `D:/projects/github/nrwl/nx` (branch 23.0.x) | none -- suite.json points here |
| Gilded Rose kata (TypeScript) on disk | e2e-gilded-rose apply arm | Yes | `D:/projects/github/emilybache/GildedRose-Refactoring-Kata/TypeScript` | none |
| `/reload-plugins` (user-only) | after-measurement (live skill) | USER GATE | - | none -- Claude cannot run it; halt and ask (D-18) |

**Missing dependencies with no fallback:** none at build time. The only hard block is the `/reload-plugins` user gate, which by design stops the after-measurement until the user clears it -- this is expected, not a defect.

## Validation Architecture

> nyquist_validation is enabled (`.planning/config.json` -> `workflow.nyquist_validation: true`). These are the build-time checks that prove the changes are structurally correct BEFORE the metered `claude -p` eval run (D-18) -- the eval run itself is the behavioral proof (SC4), gated on the user reload.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | No unit-test framework; correctness is gated by standalone Node checkers + `claude plugin validate` + the metered eval harness |
| Config file | `.claude/skills/lz-refactor-workspace/package.json` (scripts: `check`, `typecheck`) |
| Quick run command | `node .claude/skills/lz-refactor-workspace/check-evals.mjs` (eval-set lint, no claude -p) |
| Full suite command | `cd .claude/skills/lz-refactor-workspace && npm run check` (catalog no-regression) + `claude plugin validate .` (repo root) |

### Phase Requirements -> Test Map (build-time gates)
| Req | Behavior | Test Type | Automated Command | Exists? |
|-----|----------|-----------|-------------------|---------|
| SC1 pre-run | Eval set well-formed: >=8 pos, >=8 neg, >=2 seam, ASCII, valid schema | lint | `node check-evals.mjs` | Yes |
| SC1 pre-run | New negatives dual-written byte-consistent to `d07-chunks/negatives.json` | manual/lint | diff the two negative lists | manual (Wave 0 if a lint is wanted) |
| SC1/SC2 | `description` accepted (>1024 OK) + skill frontmatter/structure valid | structural | `claude plugin validate .` (and `--strict`) | Yes |
| SC1/SC2 | `description` within the load-bearing window and all exclusions before 1536 | length check | `wc -c` on the description block (or a tiny node char-count) | manual |
| no-regression | Frozen `references/` catalogs still pass (Phase 12 must not touch them) | checker battery | `npm run check` | Yes |
| no-regression | Shipped tree ASCII-only, no work-email, no verbatim prose | hygiene | `node tools/check-hygiene.mjs` (part of `npm run check`) | Yes |
| D-17 | Skill Markdown changes reviewed by >=1 unbiased subagent before acceptance | review gate | agent review (not a script) | process gate |
| SC2 behavior | Multi-round drive + pauses + behavior preserved | metered e2e | `run-e2e.mjs` (apply arms) -- AFTER reload-plugins | user-gated |
| SC1 trigger | Sweep auto-trigger recall + specificity | metered trigger | `run-recall-chunks.mjs` / `run-spec-chunks.mjs` -- AFTER reload | user-gated |

### Sampling Rate
- **Per edit (local, free):** `check-evals.mjs` after any eval-set change; `claude plugin validate .` after any SKILL.md change.
- **Per phase gate (local, free):** `npm run check` (catalog no-regression) + agent review (D-17) green BEFORE commit.
- **Behavioral gate (metered, user-gated):** the full before/after matrix (D-16) AFTER `/reload-plugins` -- present commands and wait (D-18).

### Wave 0 Gaps
- [ ] Optional: a tiny lint asserting the two negative lists (`trigger-eval.json` negatives vs `d07-chunks/negatives.json`) are byte-consistent -- closes the dual-write trap deterministically. Discretion; ponytail says skip unless the manual diff proves error-prone.
- [ ] Optional: a description char-count assertion (load-bearing window; exclusions before 1536). Discretion; a one-line `wc -c` suffices.
- [ ] No test framework install needed -- the harness is checkers + eval runners, all present.

*(No new test files are required; the phase reuses the Phase-11 harness. The only "tests" are the build-time checkers above plus the metered eval run.)*

## Security Domain

> `security_enforcement` is absent from `.planning/config.json` (treated as enabled). This phase's attack surface is minimal: it edits Markdown skill prose and JSON eval queries. No auth, session, crypto, network, or input-parsing code ships.

### Applicable ASVS Categories
| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | no auth surface |
| V3 Session Management | no | none |
| V4 Access Control | no | none |
| V5 Input Validation | no (shipped) | eval JSON is developer-authored, not user input; `check-evals.mjs` schema-lints it |
| V6 Cryptography | no | none |
| V14 Config / supply chain | yes (light) | no new dependencies; public-repo hygiene (ASCII-only, maintainer work-email absent by allowlist-inversion per AGENTS.md) |

### Known Threat Patterns for this stack
| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Skill prose that drives unwanted edits (over-reach) | Tampering | The D-07 pause boundaries + terminal review gate + never-commit-unless-asked; scope-contained enforcement |
| Public-repo PII leak (maintainer work email/domain) | Info disclosure | Allowlist-inversion scan before commit; only the approved public gmail may appear (CLAUDE.md/AGENTS.md) |
| Untrusted skill instructions | Elevation | The skill is first-party and reviewed (D-17); no external skill is added |

The sweep-drive instruction is itself the security-relevant artifact: its guards (pause on blast-radius escape, revert on unrecoverable red, never sweep uncovered code, never auto-commit) ARE the safety controls that make autonomous multi-round editing shippable. The security auditor should verify these guards are present in the shipped prose, not merely in the eval design.

## Sources

### Primary (HIGH confidence -- fetched this session via markdown.new)
- anthropic.com/engineering/building-effective-agents -- agents as loops; terminate on completion OR max-iteration stopping condition; pause at checkpoints/blockers; escalate rather than guess; simplicity/transparency; reversible-autonomous vs irreversible-gated.
- anthropic.com/engineering/effective-harnesses-for-long-running-agents (Nov 26, 2025) -- the two failure modes (one-shot too-much; declare-done-early), define "done" as an explicit checklist, incremental one-item-at-a-time, clean/revertable state each step, never remove tests.
- claude.com/blog/getting-started-with-loops (Jun 30, 2026) -- loop = repeat until a stop condition; turn-based loop; encode the verification loop in SKILL.md; the verify-frontend SKILL.md template ("rerun from step 1 -- do not hand back partially verified work"); `/goal` evaluator prevents early stop; deterministic (tests) criteria most reliable.
- platform.claude.com Agent Skills overview / best practices (via search summarizer + prior HIGH fetch in the substrate) -- `description` is the trigger and should be action- and trigger-oriented; skills should carry only high-signal info that pushes away from defaults; autonomy safeguards (min permissions, reversible over destructive, human checkpoints).

### Reused substrate (HIGH -- prior web-sourced, this repo)
- `.planning/research/skill-trigger-optimization.md` -- eval-set design (recall + specificity, ~20 queries, 3 runs, held-out split, no-keyword-overfit), near-miss hard negatives carry specificity, exclude-and-reroute in the description (citypaul convention), description is the top lever, match user intent not jargon, bounded-pushy.

### Verified on disk (HIGH -- read this session)
- `plugins/lz-tdd/skills/lz-refactor/SKILL.md` (committed 8acd2b8) -- current description + coach/apply paragraph + decision procedure.
- `lz-refactor-workspace/{run-recall-chunks.mjs, run-spec-chunks.mjs, check-evals.mjs, evals/trigger-eval.json, evals/d07-chunks/negatives.json}` -- harness mechanics (canary gating, chunk sizes, dual-write, locked run config, stale-cache).
- `lz-refactor-workspace/{e2e-nx, e2e-gilded-rose}/{run-e2e.mjs, suite.json, targets.json}` -- arm/mode/report mechanics, Pass@k, apply-branch protection, seed targets (T3/T4, updateQuality).
- `lz-refactor-workspace/E2E-FINDINGS.md` -- the cross-suite findings + the 2026-07-11 resolution (18/18, command-drive 6/6, used_refactor undercount caveat).
- `.planning/quick/20260710-lz-refactor-trigger-opt/{RESEARCH.md, PROPOSED-EDITS.md}` -- harness section C + coach/apply fix direction + the committed edit wording this phase extends.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all tooling exists and was read on disk; no new installs.
- Trigger pattern (Gap 1): HIGH-MEDIUM -- substrate is HIGH; the sweep intent-category generalization is a MEDIUM inference the eval set will confirm (SC4).
- Behavior pattern (Gap 2): HIGH -- three primary Anthropic engineering posts fetched; the loop-in-SKILL.md pattern is Anthropic's own shipped example; the principle transfer is direct.
- Measurement: HIGH -- harness read on disk; D-12..D-16 map cleanly onto the existing runners.
- Pitfalls: HIGH -- each is grounded in a read-on-disk mechanic or a locked decision.

**Research date:** 2026-07-11
**Valid until:** ~2026-08-10 for the trigger/measurement mechanics (stable, on-disk); Anthropic loop guidance is fast-moving (~7-14 days), but the transferred principles (define done, incremental, stop conditions, escalate not guess) are stable.
