# Phase 14: Compare lz-refactor to mattpocock-skills code-review (kata + nx) - Research

**Researched:** 2026-07-15
**Domain:** Head-to-head skill-comparison eval harness (measurement-only); Node.js `claude -p` runner extension; git plumbing for equal-input diffs; DST-04 oracle grading
**Confidence:** HIGH (all five crux items verified against local artifacts; one MEDIUM item flagged: sub-agent token roll-up, verifiable only at the first approved run)

## Summary

This is a MEASUREMENT-ONLY, terminal phase. It ships no skill code. It extends the existing
`run-e2e.mjs` recommend harness with a competitor arm and richer meta capture, runs both skills in
report/recommend mode on the same targets, and grades the outputs. Every crux question the plan needs
was answerable from LOCAL files plus a few `git`/transcript probes -- no web research was required.

All five implementation cruxes are resolved with VERIFIED mechanisms:
1. **Competitor arm (D-06):** a new `code_review` arm in `run-e2e.mjs` that points `--plugin-dir` at the
   mattpocock cache and invokes `/mattpocock-skills:code-review <ROOT_SHA>`. It needs a DIFFERENT tool
   profile than the lz-refactor recommend arm (code-review requires Bash + the sub-agent-spawn tool;
   lz-refactor recommend needs neither). That asymmetry is a finding, not a bug.
2. **Equivalent input (D-02):** the git empty-tree hash CANNOT be code-review's fixed point -- it breaks
   code-review's documented three-dot `git diff <fp>...HEAD` (verified: exit 128, "is a tree, not a
   commit"). The least-hacky on-grain mechanism is a per-target throwaway branch = `empty-root-commit ->
   commit-adding-only-the-target-file(s)`, with fixed-point = the empty root commit. Verified: rev-parse,
   three-dot diff, and git log all resolve correctly and the diff is exactly the whole target file.
3. **Meta capture (D-07):** `--output-format stream-json`'s final `result` event already carries
   `usage` (input/output/cache tokens), `total_cost_usd`, `modelUsage` (per-model, aggregates sub-agents),
   and `num_turns`. Tool usage is countable from top-level `tool_use` blocks by `name`. Verified against
   on-disk transcripts. `extractResult()` currently discards all of this -- extend it.
4. **Recommend-mode queries (D-08):** author new report-framed prompts that force `/lz-tdd:lz-refactor`
   (the invoke path) at the SAME target file code-review reviews, mirroring "review these files, surface
   smells + fixes".
5. **Grading (D-04/D-05):** mechanical dims (tokens, tools, lift-count) come from meta/transcripts;
   graded dims (book authenticity, idiom/pattern fidelity, output quality, over/under-engineering) route
   through `oracle`/`oracle-reviewer` (DST-04). The vocabulary-breadth asymmetry is quantified below.

**Primary recommendation:** Extend (don't rewrite) `run-e2e.mjs`: add a `code_review` arm with its own
tool profile + synthetic-branch setup, extend `extractResult()`/`meta.json` with token+tool fields, add
report-framed lz-refactor prompts, and run BOTH arms in the SAME synthetic worktree so bytes are
identical. Validate all three extensions offline (dry-run + against already-captured transcripts) BEFORE
the D-12 spend gate.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Arm dispatch + prompt/command assembly | Runner (`run-e2e.mjs` main context) | -- | Node child_process orchestration; no model involved |
| Equal-input diff construction | Runner (git plumbing, runner's own child process) | -- | Not gated by Claude's permission classifier; deterministic |
| Skill invocation (both arms) | `claude -p` session | Sub-agents (code-review only) | The measured unit of work |
| Token/tool/cost capture | Runner (parse `result` event + `tool_use`) | -- | Read from stream-json transcript, no model |
| Book-authenticity + idiom grading | `oracle`/`oracle-reviewer` agents | Runner (normalize claims first) | DST-04 firewall; main context never reads `.oracle/` prose |
| Mechanical scoring (tokens/tools/lift) | Runner + main-context tabulation | -- | Deterministic from meta.json |
| Results doc + verdict | Main context (author) + >=1 unbiased reviewer | -- | Empirical verdict, unbiased-review gate |

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01 [comparable modes]:** lz-refactor runs recommend mode (`--mode recommend`, read-only), invoked
  explicitly as `/lz-tdd:lz-refactor <query>`. code-review runs as `/mattpocock-skills:code-review
  <fixed-point>`. Both produce findings/recommendations, NOT applied diffs.
- **D-02 [equivalent inputs -- whole-file-as-diff; re-surfaced at the spend gate]:** feed code-review the
  SAME target file(s) as a whole-file diff against an empty/pristine baseline. Exact mechanism = research +
  planner discretion. CAVEAT: code-review is designed for INCREMENTAL diffs; a whole-file diff uses it
  slightly off-grain -- MUST be stated as a methodology caveat in `14-RESULTS.md`.
- **D-03 [Spec axis skips -- expected asymmetry]:** only code-review's Standards axis is comparable. The
  kata/nx corpus has no originating issue/PRD, so the Spec sub-agent skips and reports "no spec available"
  -- EXPECTED, reported as structural asymmetry. `docs/agents/issue-tracker.md` setup NOT required.
- **D-04 [dimension set + measurement kind]:** Lift (GRADED-lite), Token usage (MECHANICAL), Tool usage
  (MECHANICAL), Output quality (GRADED/judge), Book authenticity (GRADED, DST-04), Over-/under-engineering
  (GRADED), TypeScript/FP/OOP idioms + patterns (GRADED -- OWNER ADDITION). The vocabulary-breadth
  asymmetry is EXPECTED and is the headline on the idiom/pattern axis -- do NOT normalize it away.
- **D-05 [grading path -- DST-04]:** book-authenticity + idiom/pattern grading routes through
  `oracle`/`oracle-reviewer` against git-ignored `.oracle/`; main context NEVER reads book prose; verdicts
  in the agent's own words; per-claim pass/partial/fail per arm. Functional idioms grade against
  `.planning/research/functional-depatterning-ts.md` (no-oracle tier) + the shipped functional-catalog.
- **D-06 [competitor arm]:** extend `run-e2e.mjs` with a `code_review` arm loading the mattpocock plugin
  via `--plugin-dir`, invoking `/mattpocock-skills:code-review <fixed-point>`, persisting output + meta the
  same way. ADD the arm, do not rewrite.
- **D-07 [meta capture extension]:** extend `meta.json` to record token usage (input/output) + tool-usage
  counts (per tool), incl. code-review's sub-agents.
- **D-08 [recommend-mode queries]:** author new recommend/report-oriented lz-refactor queries mirroring
  code-review's "review these files, surface smells + fixes" framing (explicit `/lz-tdd:lz-refactor`), same
  files.
- **D-09 [corpus]:** reuse BOTH suites -- kata (`e2e-gilded-rose`) + nx (`e2e-nx`). Recommended subset:
  kata target + 1-2 nx packages (e.g. `@nx/eslint-plugin` p8). Exact target list = planner discretion.
- **D-10 [arms + run config]:** two arms per cell -- `lz-refactor` (recommend, shipped plugin) vs
  `code_review` (mattpocock plugin-dir). k=3, serial (`--num-workers 1`), `claude-opus-4-8 @ high`,
  `--setting-sources project`, PONYTAIL off, MCP + user-plugins stripped except plugin under test. Reuse
  the Phase-11/13 locked config verbatim.
- **D-11 [results doc + verdict]:** `14-RESULTS.md` (phase dir) tabulates per cell per dimension; verdict
  is an EMPIRICAL finding, never a pre-assumed win. MUST state the D-02 whole-file-diff caveat + the D-03
  Spec-axis-skip asymmetry. Include >=1 unbiased from-scratch grading reviewer. Reuse
  `E2E-RESULTS.md`/`EVAL-RESULTS.md` format conventions.
- **D-12 [HARD eval-run gate]:** the plan BUILDS all run commands + grading scaffolding + harness
  extensions (D-06/D-07) and HALTS for explicit user approval before executing ANY metered run -- no
  self-approval, even in `--auto`. Grading (oracle agent calls) runs only AFTER outputs exist.

### Claude's Discretion
- Exact `run-e2e.mjs` arm/`--plugin-dir` wiring for the competitor; vendor a pinned mattpocock@1.2.0 copy
  vs point at the plugin cache.
- Exact target subset + whether nx and kata share one plan or split by suite.
- Whether to include a base `no_skill` third reference arm (Phase 13 already characterized base).
- Exact `14-RESULTS.md` table shape (one table per dimension vs a matrix); whether a small normalization
  helper is written for finding extraction if manual reads prove noisy.
- Grading efficiency: fetch reusable per-(book, refactoring/smell) mechanics ground truth once and reuse
  across arms, PROVIDED each per-claim VERDICT stays oracle-owned + in the agent's own words.
- Whether to run `/gsd-spec-phase 14` before plan. RECOMMENDED NOT to block the chain.

### Deferred Ideas (OUT OF SCOPE)
- The full `@nx/*` fleet (`p9`-`p13`) and `kata gr3`.
- Comparing the two skills on APPLY/DRIVE output (this phase is recommend/report only).
- Turning the head-to-head into a standing CI/regression gate.
- Any tuning of the shipped lz-refactor skill on a surfaced defect (feeds a separate gated decision).
</user_constraints>

## Project Constraints (from CLAUDE.md / AGENTS.md)

- **NEVER run evals without explicit approval.** Every metered `claude -p` run is gated
  ([[eval-run-approval-gate]]); the plan builds commands and HALTS (D-12). Grading (oracle calls on the
  Claude plan) runs only after outputs exist.
- **DST-04 clean-room grading.** Book-authenticity + idiom grading route through `oracle`/`oracle-reviewer`
  only; main context never reads `.oracle/` book prose; verdicts in the agent's own words.
- **ASCII-only committed output.** No Unicode/emoji/box-drawing (Windows cp1252). Use `->`, `--`, `[OK]`.
- **Public-repo hygiene.** Only the approved public gmail may appear in committed files, commit messages,
  and committer identity. Verify by allowlist-inversion; never write the forbidden value as a needle.
- **Windows arm64.** `git grep`/`rg` (never `grep`); `npm`; pipe filters via `| rg`.
- **Compute + report Pass@k / Pass^k** per eval and overall (the runner's `report()` already does this for
  skill-firing; extend the reporting posture to the new dimensions where run counts allow).
- **Include >=1 unbiased from-scratch reviewer** ([[unbiased-review-beats-primed]]) in grading.
- **Wait for ALL completion notifications** before grading background runs (`total_tokens`/`duration_ms`
  are only available at completion).
- **GSD UI gate false-positive:** this is a Markdown/harness phase, no frontend -- skip-ui, do NOT
  auto-gen UI-SPEC ([[gsd-ui-gate-false-positive-skill-authoring]]).
- **nx test on arm64:** `nx test` fails at `nx:build-native`; use `--exclude-task-dependencies` or raw
  jest as the behavior oracle (only relevant if any behavior check is added; this phase is report-mode, so
  no apply/behavior check is expected).

## Standard Stack

### Core
| Component | Version | Purpose | Why Standard |
|-----------|---------|---------|--------------|
| `run-e2e.mjs` (existing) | in-repo | Arm dispatch, prompt/command assembly, spawn `claude -p`, capture output+meta | The proven Phase-11/13 backbone; extend it [VERIFIED: read file] |
| `claude` CLI (`claude-opus-4-8`) | installed, resolved via `resolveClaude()` | The measured runtime; `-p --output-format stream-json` | Locked run config (D-10) [VERIFIED: run-e2e.mjs] |
| `node:child_process` `spawnSync` | Node stdlib | Launch claude + run git plumbing (runner's own child, ungated) | Already used; no new dep [VERIFIED] |
| `git` plumbing (`commit-tree`, `write-tree`, `update-index`, `worktree`) | system git | Build the equal-input synthetic branch (D-02) | Deterministic, on-grain for code-review [VERIFIED via probes] |
| `oracle` / `oracle-reviewer` agents | in-repo GSD agents | DST-04 book-authenticity + idiom grading | Only sanctioned channel to `.oracle/` (D-05) |

### Supporting
| Component | Purpose | When to Use |
|-----------|---------|-------------|
| mattpocock-skills plugin (cache `~/.claude/plugins/cache/mattpocock/mattpocock-skills/1.2.0`) | The competitor under test; loaded via `--plugin-dir` | code_review arm [VERIFIED: `.claude-plugin/{plugin.json,marketplace.json}` present] |
| `.planning/research/functional-depatterning-ts.md` | No-oracle correctness anchor for the FP idiom axis | Grading the functional/FP dimension (D-05) [VERIFIED: 52KB file exists] |
| `targets.json` (both suites) | `expected_family`+`judgment`+`smells` = ready-made ground truth | Lift + book-authenticity + over/under-engineering scoring [VERIFIED] |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Point `--plugin-dir` at the mattpocock cache | Vendor a pinned copy of mattpocock@1.2.0 into the workspace | Vendoring buys reproducibility if the cache is cleared/updated, at the cost of a large committed tree (the cache has a full `node_modules/`). RECOMMEND: point at the cache AND record the resolved version (1.2.0) + SKILL.md content hash in meta, so a future re-run can detect drift without committing the tree. If the plan wants durability, vendor ONLY `skills/engineering/code-review/` + `.claude-plugin/{plugin,marketplace}.json` (not `node_modules/`). [VERIFIED: cache layout] |
| Empty-tree hash as code-review's fixed point | Synthetic empty-root-commit as fixed point | Empty tree BREAKS three-dot diff (exit 128); synthetic commit works on-grain. See D-02 below. [VERIFIED] |
| Both arms in one synthetic worktree | lz-refactor in pristine repo + code_review in worktree | One worktree = byte-identical input, simplest fairness argument. RECOMMEND one worktree. |

**Installation:** none. No new npm/PyPI/crates packages. The harness extension is pure Node stdlib +
system git + the already-installed claude CLI + the already-cached mattpocock plugin.

## Package Legitimacy Audit

**N/A -- this phase installs NO external packages.** The harness extension uses Node stdlib
(`node:fs`, `node:path`, `node:child_process`, `node:os`, `node:url`), system `git`, the already-installed
`claude` CLI, and the already-cached `mattpocock-skills@1.2.0` plugin. slopcheck/registry verification is
not applicable. If the plan later decides to vendor the mattpocock plugin, that is a file copy of an
already-installed, user-trusted plugin -- not a registry install.

## Architecture Patterns

### System data flow

```
plan builds commands  ->  [D-12 HARD GATE: explicit user approval]  ->  run-e2e.mjs
                                                                          |
        per (target, arm) cell, k=3, serial:                             |
                                                                          v
   +--------------------------------------------------------------------------------+
   |  SETUP (runner's own git child, ungated):                                      |
   |    build synthetic branch in a throwaway worktree of the borrowed repo:        |
   |      ROOT = commit-tree <empty-tree>            (empty root commit)            |
   |      TREE = write-tree of a temp index holding ONLY the target path(s)         |
   |      TIP  = commit-tree TREE -p ROOT            (adds the whole target file)   |
   |      branch review-<target> = TIP ; worktree checkout TIP                      |
   +--------------------------------------------------------------------------------+
        |                                              |
        v (arm = lz-refactor)                          v (arm = code_review)
   claude -p                                      claude -p
     prompt: "/lz-tdd:lz-refactor <report query>"   prompt: "/mattpocock-skills:code-review <ROOT>"
     --plugin-dir plugins/lz-tdd                     --plugin-dir <mattpocock cache>
     tool profile: block Edit/Write/Bash             tool profile: block Edit/Write, ALLOW Bash + Agent
     (reads the target file directly)                (runs git diff/log; spawns 2 general-purpose agents)
        |                                              |
        v                                              v
   stream-json transcript  --------------------->  extractResult() (EXTENDED):
                                                     finalText + usage{in,out,cache} +
                                                     total_cost_usd + modelUsage + num_turns +
                                                     tool_calls{name:count}
        |                                              |
        v                                              v
   answer.md + meta.json (per run)  ------------->  TEARDOWN: remove worktree + branch; repo pristine
                                                     |
                                                     v
   GRADING (AFTER outputs, on the Claude plan, not metered pool):
     mechanical: tabulate tokens/tools/lift from meta.json
     graded: normalize each arm's named smells/refactorings/patterns -> oracle/oracle-reviewer (DST-04)
             -> per-claim pass/partial/fail (book authenticity + idiom/pattern fidelity)
             judge: output quality, over/under-engineering
        |
        v
   14-RESULTS.md (per-dimension tables + empirical verdict) + >=1 unbiased reviewer
```

### Pattern 1: Per-arm tool profile (the key wiring change)
**What:** the recommend arm and the code_review arm need DIFFERENT `--disallowedTools` sets.
**Why:** the current recommend profile blocks `Edit Write MultiEdit NotebookEdit Bash` (run-e2e.mjs:206).
code-review REQUIRES Bash (it runs `git rev-parse`/`git diff`/`git log`) and the sub-agent-spawn tool
(it "sends a single message with two `Agent` tool calls"). Blocking Bash would make code-review fail at
step 1. lz-refactor recommend needs neither (it reads the target file directly).
**Recommendation:**
```
lz-refactor arm  (report/recommend): --disallowedTools Edit Write MultiEdit NotebookEdit Bash
code_review arm  (report):            --disallowedTools Edit Write MultiEdit NotebookEdit
                                      (Bash + the Agent/Task tool remain allowed; no apply)
```
Both keep `--permission-mode bypassPermissions` (so reads/git never prompt). Blocking Edit/Write on the
code_review arm keeps it report-only (code-review does not edit anyway). This tool-profile asymmetry IS
the D-04 tool-usage finding -- record it in `14-RESULTS.md`, do not "equalize" it. [VERIFIED: run-e2e.mjs
+ code-review SKILL.md steps 1,4]

### Pattern 2: `composePrompt()` / `buildCmd()` arm branch
**What:** add `code_review` to the arm allowlist and to `composePrompt`/`buildCmd`.
- `parseArgs`: extend the `--arm` allowlist to include `code_review`.
- `composePrompt(p, mode, arm)`: for `arm === 'code_review'`, return `/mattpocock-skills:code-review
  <ROOT_SHA>` (the synthetic root commit SHA for this target). No PREAMBLE (code-review is a slash command
  with a positional fixed-point, not a coaching query).
- `buildCmd(...)`: for `arm === 'code_review'`, push `--plugin-dir <mattpocock cache>` (a per-arm plugin
  dir, not the constant `PLUGIN_DIR`), and apply the report tool profile above.
- The `ROOT_SHA` is produced by the setup step and threaded into the prompt -- so `composePrompt` needs
  access to it (pass it in, or set it on the prompt entry during setup).
**Anti-pattern:** hardcoding a sub-agent tool name (`Task` vs `Agent`). Count ALL `tool_use` by `name`
so the histogram captures whatever the CLI actually calls the spawn tool. [VERIFIED: extractResult
already iterates all tool_use blocks]

### Pattern 3: Synthetic equal-input branch (D-02), built with plumbing
**What:** per target, build `empty-root-commit -> commit-adding-only-the-target-file(s)` and pass the
root as code-review's fixed point.
**Build from the PRISTINE ref, not HEAD.** The nx working clone is currently on a leftover
`lz-refactor-e2e-smoke` branch, so `HEAD:<path>` may not be pristine. Build the target tree from the
suite's `applyBase` (`origin/23.0.x` for nx, `main` for kata). [VERIFIED: `git rev-parse
origin/23.0.x:packages/eslint-plugin/src/rules/nx-plugin-checks.ts` -> resolves; nx HEAD = smoke branch]
**Kata path prefix nuance:** the kata git repo root is `.../GildedRose-Refactoring-Kata`; the TS project
is under `TypeScript/`. From the git root the target is `TypeScript/app/gilded-rose.ts`; from the TS
subdir (the suite `repo` path) it is `app/gilded-rose.ts`. Run the plumbing from the git root with
root-relative paths, or set the worktree cwd to the TS subdir consistently. [VERIFIED: `git rev-parse
main:app/gilded-rose.ts` fails from root, needs `TypeScript/` prefix]
**Verified construction (ungated runner child):**
```bash
EMPTY=4b825dc642cb6eb9a060e54bf8d69288fbee4904          # universal empty-tree object
ROOT=$(git commit-tree $EMPTY -m "review base: empty")  # real root commit, empty tree
# build a tree containing ONLY the target path(s), from the pristine ref, without touching the worktree:
GIT_INDEX_FILE=$TMP git read-tree --empty
GIT_INDEX_FILE=$TMP git update-index --add --cacheinfo 100644,$(git rev-parse origin/23.0.x:$P),$P
TREE=$(GIT_INDEX_FILE=$TMP git write-tree)
TIP=$(git commit-tree $TREE -p $ROOT -m "target under review")
git branch review-$TARGET $TIP
git worktree add <wt-path> review-$TARGET     # code-review runs here; HEAD = TIP
# invoke: /mattpocock-skills:code-review $ROOT
# teardown: git worktree remove <wt-path> --force ; git branch -D review-$TARGET
```
Verified outcomes with fixed-point=ROOT, HEAD=TIP:
- `git rev-parse $ROOT` -> resolves, exit 0 (code-review step-1 sanity passes).
- `git diff $ROOT...$TIP --stat` (THREE-dot, code-review's exact command) -> exit 0, "1 file changed,
  640 insertions(+)" -- the WHOLE target file as an add.
- three-dot == two-dot (ROOT is a true ancestor of TIP, merge-base = ROOT) -> YES.
- `git log $ROOT..$TIP --oneline` -> exit 0, one commit "target under review".
- `git ls-tree -r --name-only $TIP` -> exactly the target path (scoped, no other repo files).
[ALL VERIFIED via git probes in D:/projects/github/nrwl/nx]

### Anti-Patterns to Avoid
- **Empty-tree as code-review's fixed point.** `git diff 4b825dc...HEAD` -> exit 128 "object ... is a
  tree, not a commit". code-review's whole documented flow is commit-based. Do NOT use the two-dot
  `git diff <empty-tree> HEAD` shortcut for code-review -- it works for a plain diff but is off code-review's
  documented three-dot path AND is unscoped (reviews the entire repo, thousands of files). [VERIFIED]
- **Reviewing the whole repo diff.** Without scoping to the target path, code-review would review every
  file. The synthetic TREE must contain ONLY the target path(s) so the reviewed change equals the file
  lz-refactor scans. [VERIFIED: ls-tree scoped]
- **Equalizing the tool profiles.** The two skills legitimately drive different tools; forcing the same
  `--disallowedTools` would break one of them. The asymmetry is the finding.
- **Grading book authenticity in main context.** Route every book-fidelity + idiom claim through the
  oracle agents (DST-04). Main context reads only the arm OUTPUT (answer.md), never `.oracle/` prose.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Token/cost accounting | A custom token counter over transcript text | The `result` event's `usage` + `total_cost_usd` + `modelUsage` | The CLI already reports exact billed usage incl. cache + per-model; recomputing is wrong and lossy [VERIFIED] |
| Equal-input diff | Hand-edited patch files or string munging | git `commit-tree`/`write-tree`/`worktree` plumbing | Deterministic, keeps code-review on its documented commit-based flow [VERIFIED] |
| Book ground truth | Reading `.oracle/` books in main context | `oracle`/`oracle-reviewer` agents | DST-04 firewall is mandatory (CLAUDE.md/AGENTS.md) |
| Pass@k / Pass^k | New stats code | `run-e2e.mjs` `passAtK`/`passHatK` (already present) | Proven, reused across phases [VERIFIED: run-e2e.mjs:462-468] |
| Arm dispatch/persistence | A new runner | Extend `run-e2e.mjs` (D-06 says ADD the arm) | Backbone exists; rewrite risks cross-phase comparability |

**Key insight:** almost everything this phase needs already exists in `run-e2e.mjs` or the CLI's
stream-json output. The real new code is (a) one arm branch, (b) a synthetic-branch setup/teardown, and
(c) ~15 lines extending `extractResult()` to read the `result` event's usage/cost/modelUsage/num_turns and
build a `tool_use`-by-name histogram. Resist building anything larger.

## Meta Capture Detail (D-07)

The final `result` event (last line of the stream-json transcript) carries everything needed. Verified
by parsing an on-disk transcript
(`.../results/apply/no_skill/p1/run-1/outputs/transcript.stream.jsonl`):

- `usage`: `{ input_tokens, output_tokens, cache_creation_input_tokens, cache_read_input_tokens,
  server_tool_use{web_search_requests,web_fetch_requests}, service_tier, ... }` -- MAIN-context tokens.
- `total_cost_usd`: a single float (e.g. `1.5663615`) -- whole-session billed cost.
- `modelUsage`: keyed by model, each with `{ inputTokens, outputTokens, cacheReadInputTokens,
  cacheCreationInputTokens, costUSD, contextWindow, maxOutputTokens }`. In the probed run BOTH
  `claude-opus-4-8` and `claude-haiku-4-5` appear (haiku = the CLI's internal fast-model tasks, cost
  ~$0.0007, negligible).
- `num_turns`: integer (e.g. `22`).

Tool usage: count top-level `tool_use` blocks by `name`. Verified histogram on the probed run:
`Bash 12, Edit 6, Glob 1, Read 2`. [ALL VERIFIED]

**New `meta.json` fields to add** (keep the existing fields):
```
input_tokens, output_tokens, cache_read_input_tokens, cache_creation_input_tokens,
total_cost_usd, num_turns,
model_usage: { "<model>": { input, output, costUSD } },   // from modelUsage
tool_calls:  { "<ToolName>": <count> }                     // top-level tool_use histogram
```

**Sub-agent measurement boundary (MEDIUM confidence -- the one thing to confirm at the first approved
run):** code-review spawns 2 `general-purpose` sub-agents (Standards + Spec). In stream-json `-p` mode,
the PARENT transcript shows the sub-agent SPAWN as a single `tool_use` (the Agent/Task tool) plus its
`tool_result`; the sub-agents' OWN internal `Read`/`Bash`/etc. calls are NOT individually enumerable in
the parent transcript. Therefore:
- **Tool usage** is measured at the top level: main-context git/read tools + the COUNT of sub-agent spawns
  (expected: 2 for code_review, 0 for lz-refactor). This 2-vs-0 spawn count IS the headline tool-usage
  finding (D-04, [specifics]). Do not attempt to reconstruct sub-agent-internal tool calls -- report the
  spawn count.
- **Token/cost** [ASSUMED, verify at first run]: the whole-session `total_cost_usd` and the per-model
  `modelUsage` are EXPECTED to aggregate sub-agent turns (a single billed session), so they are the fair
  cross-arm cost comparison. The top-level `usage` block is main-context-only and will UNDER-count
  code-review (which offloads to sub-agents). Recommendation: report `total_cost_usd` + `modelUsage`
  (opus row) as the headline token/cost number, and `usage` as the main-context-only figure. Confirm the
  sub-agent roll-up empirically on the FIRST approved code_review run (compare `total_cost_usd` against
  the sum implied by main-context `usage`); adjust the reported field if the roll-up differs.

## Recommend-Mode Query Authoring (D-08)

Existing lz-refactor recommend prompts are coach-shaped and point at a target via prose
(e.g. p1: "The `run` function in `packages/.../enforce-module-boundaries.ts` has become a pain... The
tests are green. What would you do with it?"). For an equal-input comparison against code-review's
"review this diff, surface smells" framing, author NEW report-framed prompts that:
1. Force activation with an explicit `/lz-tdd:lz-refactor` prefix (reuse the `invoke_skill`
   `composePrompt` path; D-01 requires explicit invocation). [VERIFIED: composePrompt:182-186 prepends
   `SKILL_COMMAND`]
2. Point at the SAME target file code-review reviews (same path, same pristine content).
3. Use review/report framing, e.g.: *"Review `<target path>`. The tests are green. Surface the code
   smells you see and the named refactorings you would recommend for each. Do not edit anything."*
4. Stay read-only (recommend preamble + Bash-blocked tool profile).

Place them under each suite's `prompts/` with new ids (e.g. `cr-<target>`). Add matching entries to
`suite.json.prompts` (or select via `--prompt`). Because these are new, non-leading prompts, subagent-review
them (incl. an unbiased reviewer) before the run -- the same discipline used for `p2cmd`/`gr1cmd`
(E2E-FINDINGS.md resolution). [VERIFIED: E2E-FINDINGS.md]

## Grading Architecture (D-04 / D-05)

| Dimension | Kind | Source / channel |
|-----------|------|------------------|
| Lift (distinct actionable findings + named refactorings/smells) | GRADED-lite | Normalize each arm's answer.md into a finding list; count. Cross-check named refactorings vs `targets.json.smells`/`expected_family` |
| Token usage | MECHANICAL | `meta.json` (`total_cost_usd`, `modelUsage`, `usage`) |
| Tool usage | MECHANICAL | `meta.json.tool_calls` + sub-agent spawn count |
| Output quality | GRADED (judge) | Judge read of answer.md vs `targets.json.judgment`; usefulness/accuracy/actionability |
| Book authenticity | GRADED (DST-04) | Normalize named smells/refactorings -> `oracle` (open-ended book mechanics) or `oracle-reviewer` (on a normalized per-claim list) -> pass/partial/fail per claim, agent's words |
| Over-/under-engineering | GRADED (judge + oracle where a pattern is named) | Proportionality of recommendations vs `targets.json.judgment` (e.g. the polymorphism-decline traps) |
| TS/FP/OOP idioms + patterns | GRADED (owner addition) | Breadth + correctness of named idiom/pattern vocabulary; FP idioms vs `functional-depatterning-ts.md` + shipped functional-catalog; OO patterns vs GoF/Kerievsky via oracle |

**Grading efficiency (discretion):** fetch per-(book, refactoring/smell) mechanics ground truth ONCE from
the oracle and reuse across arms, PROVIDED each per-claim VERDICT stays oracle-owned + in the agent's own
words. The `oracle-reviewer` contract gates a DRAFTED per-claim list -- so normalize each arm's raw answer
into a claim list in main context first, then hand THAT to the reviewer (same posture as Phase 13:
"raw findings normalized in main context, per-claim verdict oracle-owned"). [VERIFIED: 13-RESULTS.md
grading channels]

### The idiom/pattern breadth asymmetry (the expected headline)

Measured vocabulary each skill ships, from LOCAL leaf counts [VERIFIED via `find`]:

| Skill | Named vocabulary shipped |
|-------|--------------------------|
| lz-refactor | Fowler-catalog 62 leaves + Kerievsky-catalog 30 + GoF-catalog 23 + extra-patterns 5 + functional-catalog 19 idioms = ~139 named refactorings/patterns/idioms; plus 28 smell leaves (smells.md unified index) |
| code-review | 12 Fowler code smells (its "Step 3" baseline), NO refactoring/pattern/idiom vocabulary |

code-review's 12 smells (verbatim from its SKILL.md step 3): Mysterious Name, Duplicated Code, Feature
Envy, Data Clumps, Primitive Obsession, Repeated Switches, Shotgun Surgery, Divergent Change, Speculative
Generality, Message Chains, Middle Man, Refused Bequest. Each reads *what it is -> how to fix* as a
labelled judgement call. [VERIFIED: code-review SKILL.md:44-56]

This ~139-vs-12 breadth gap is EXPECTED and is the headline finding on the idiom/pattern axis (D-04,
[specifics]) -- reported, NOT normalized away. The prior cross-phase finding to test against: base Opus is
already catalog-grade on plain mechanical work; lz-refactor's realizable edge is pattern-directed /
de-patterning / seam + auto-trigger. A parity-with-broader-vocabulary result vs code-review is a
publishable finding, not a failure. [VERIFIED: E2E-FINDINGS.md, MEMORY.md]

## Common Pitfalls

### Pitfall 1: code_review arm fails at step 1 because Bash is blocked
**What goes wrong:** the run produces no findings; transcript shows code-review unable to run
`git rev-parse`/`git diff`.
**Root cause:** reusing the recommend tool profile (Bash in `--disallowedTools`).
**Avoid:** give the code_review arm its own profile (block Edit/Write only; allow Bash + Agent/Task).
**Warning sign (dry-run):** the composed `--disallowedTools` list for the code_review arm contains `Bash`.

### Pitfall 2: whole-repo review (unscoped diff)
**What goes wrong:** code-review reviews thousands of files; tokens explode; not equivalent to
lz-refactor scanning one file.
**Root cause:** the synthetic TREE contains more than the target path, or the empty-tree fixed point is
used unscoped.
**Avoid:** build the TREE with ONLY the target path(s) via the temp-index write-tree; verify with
`git ls-tree -r --name-only $TIP` before the run.
**Warning sign:** `git diff $ROOT...$TIP --stat` shows more than the target file(s).

### Pitfall 3: building the synthetic tree from a dirty HEAD
**What goes wrong:** the "target file under review" is a modified/leftover version, not pristine.
**Root cause:** the nx clone is on a leftover `lz-refactor-e2e-smoke` branch; `HEAD:<path>` != pristine.
**Avoid:** build from the suite `applyBase` (`origin/23.0.x` / `main`), not HEAD. [VERIFIED]
**Warning sign:** the target's blob hash differs from `git rev-parse origin/23.0.x:<path>`.

### Pitfall 4: kata path-prefix mismatch
**What goes wrong:** `git rev-parse main:app/gilded-rose.ts` fails from the repo root.
**Root cause:** the kata git root is the parent dir; the TS project is under `TypeScript/`.
**Avoid:** use `TypeScript/app/gilded-rose.ts` from the git root, or run plumbing from the TS subdir. [VERIFIED]

### Pitfall 5: sub-agent tokens under-counted
**What goes wrong:** code_review looks cheaper than it is because only main-context `usage` is reported.
**Root cause:** top-level `usage` excludes sub-agent turns.
**Avoid:** report `total_cost_usd`/`modelUsage` (whole-session) as the headline; confirm roll-up on the
first approved run.

### Pitfall 6: borrowed-repo residue
**What goes wrong:** worktrees/branches/loose refs left behind; `git status` not clean.
**Root cause:** teardown skipped on error path.
**Avoid:** `git worktree remove --force` + `git branch -D review-*` in a finally-style teardown; the
existing runner already has apply-mode reset discipline to model this on. Loose commit objects from
`commit-tree` are harmless (GC-eligible), but remove the branches/worktrees. Confirm each borrowed repo
`git status` is clean after the phase (Phase-13 acceptance criterion).

## Runtime State Inventory

Not applicable -- this is a measurement/eval phase, not a rename/refactor/migration. The only mutable
runtime state is throwaway git worktrees/branches in the BORROWED repos (nx, kata), which must be torn
down (Pitfall 6). No datastores, no OS-registered state, no secrets/env changes, no installed-package
artifacts are touched in this repo. The workspace persists `answer.md`/`meta.json`/grading records under
`.claude/skills/lz-refactor-workspace/` (tracked; raw `outputs/` gitignored) -- same as prior phases.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| `claude` CLI | Every metered run | Yes | claude-opus-4-8 @ high | none (blocking; but runs are gate-deferred) |
| system `git` (commit-tree/write-tree/worktree) | Synthetic-branch setup (D-02) | Yes | supports empty-tree + plumbing | none needed [VERIFIED via probes] |
| node | run-e2e.mjs | Yes | ESM `.mjs` runs | none |
| nx borrowed repo | nx cells | Yes, on disk | `D:/projects/github/nrwl/nx`, `origin/23.0.x` reachable | none [VERIFIED] |
| kata borrowed repo | kata cells | Yes, on disk | `.../GildedRose-Refactoring-Kata/TypeScript`, `main` | none [VERIFIED] |
| mattpocock-skills plugin | code_review arm | Yes, cached | 1.2.0, `.claude-plugin/{plugin,marketplace}.json` present | vendor a pinned copy if the cache is volatile [VERIFIED] |
| `.oracle/` books | DST-04 grading | Assumed present (used in Phase 13) | Fowler/Kerievsky/GoF | oracle agent will report if missing |
| `oracle`/`oracle-reviewer` agents | Graded dims | Yes (GSD) | -- | none |

**Missing dependencies with no fallback:** none identified. **Note:** the nx clone is currently checked
out on a leftover `lz-refactor-e2e-smoke` branch (not pristine 23.0.x) -- the setup must build synthetic
trees from `origin/23.0.x`, and the plan should re-establish a clean baseline / confirm `git status`
clean before and after. [VERIFIED]

## Validation Architecture

> `workflow.nyquist_validation: true` [VERIFIED: .planning/config.json] -- section required.

This phase's "code" is a harness extension (a Node runner + prompt files + grading scaffolding), not a
product. There is no jest/vitest project here. Validation is therefore build-time self-checks that run
OFFLINE with ZERO metered spend -- these are the guards the harness extensions must not break, and they
run BEFORE the D-12 spend gate. The metered runs themselves are the eval, gated separately.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | none (no test project); self-checks are Node `assert`-based `--dry-run` + offline transcript parsing |
| Config file | none -- see Wave 0 |
| Quick run command | `node run-e2e.mjs --dry-run --arm code_review --prompt <cr-target>` (composes commands, spends nothing) |
| Full suite command | dry-run for both arms + offline meta-parse self-check against on-disk transcripts |

### Phase Requirements -> Validation Map
> No `14-SPEC.md` requirement IDs exist (CONTEXT D-* are the scope). Map each harness-extension behavior:

| Behavior (from D-*) | Check type | Automated command (zero spend) | Exists? |
|---------------------|-----------|--------------------------------|---------|
| D-06 code_review arm composes the right command | build/self-check | `node run-e2e.mjs --dry-run --arm code_review` asserts prompt = `/mattpocock-skills:code-review <ROOT>` and `--plugin-dir` = mattpocock cache and Bash NOT in `--disallowedTools` | Wave 0 |
| D-06/Pattern-1 lz-refactor arm still blocks Bash | build/self-check | `--dry-run --arm lz-refactor` asserts Bash IS in `--disallowedTools` | Wave 0 |
| D-02 synthetic branch = whole target file, scoped | git self-check | build ROOT/TIP for a target; assert `git diff ROOT...TIP --stat` non-empty AND `git ls-tree -r --name-only TIP` == target path(s); teardown | Wave 0 (mechanics VERIFIED this research) |
| D-07 meta capture parses usage/tools | offline parse | run the extended `extractResult()` over an EXISTING on-disk transcript; assert `input_tokens>0`, `total_cost_usd>0`, `tool_calls` non-empty | Wave 0 (fields VERIFIED present this research) |
| D-08 new prompts are non-leading + force invocation | subagent review | subagent-review each new prompt (incl. >=1 unbiased) before any run | Wave 0 |
| Teardown leaves borrowed repos pristine | git self-check | after a dry setup+teardown, assert `git status --porcelain` empty and no `review-*` branch/worktree | Wave 0 |

### Sampling Rate
- **Per harness edit (commit):** `node run-e2e.mjs --dry-run --arm code_review` + `--arm lz-refactor` (both
  compose cleanly, zero spend).
- **Per wave merge:** offline meta-parse self-check over the on-disk Phase-13 transcripts + the D-02
  git-mechanics self-check with teardown.
- **Phase gate:** all offline self-checks green, THEN present the D-12 spend gate. No metered run before
  the gate.

### Wave 0 Gaps
- [ ] Extend `extractResult()` to read `result.usage` / `total_cost_usd` / `modelUsage` / `num_turns` and
  build the `tool_calls` histogram; add the new `meta.json` fields.
- [ ] Add `code_review` to the `--arm` allowlist + `composePrompt`/`buildCmd` branches + per-arm tool
  profile.
- [ ] Add the synthetic-branch setup/teardown helper (git plumbing + worktree), building from `applyBase`.
- [ ] Author + subagent-review the report-framed `/lz-tdd:lz-refactor` prompts (D-08).
- [ ] An offline self-check script (Node `assert`) that: (a) parses an existing transcript and asserts the
  new fields extract; (b) builds+tears down a synthetic branch and asserts scope. No framework install.

## Security Domain

> `security_enforcement` is absent in config (= enabled by default). Threat surface for this phase is
> minimal: a local, read-only eval harness with no network endpoints, no auth, no untrusted external
> input, and no persisted product code.

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V5 Input Validation | minimal | Inputs are curated prompt files + a target path chosen by the maintainer; no untrusted input |
| V6 Cryptography | no | none |
| V2/V3/V4 Auth/Session/Access | no | no auth surface; local CLI runs |

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Committing the work email / its bare domain (maintainer PII) | Information Disclosure | Public-repo hygiene: allowlist-inversion scan before committing `14-RESULTS.md` and any grading prose; committer identity = approved public gmail (CLAUDE.md/AGENTS.md) |
| Leaking `.oracle/` copyrighted book prose into committed output | Information Disclosure | DST-04 firewall: oracle agents only; verdicts in the agent's own words; ASCII-only |
| Borrowed-repo residue (worktrees/branches) | Tampering (local) | Teardown + `git status` clean assertion (Pitfall 6) |
| Unapproved metered spend | (process) | D-12 HARD gate: build-then-halt; no self-approval |

The dominant "security" control here is PUBLIC-REPO HYGIENE + DST-04, not application security -- there
is no runtime attack surface.

## State of the Art

| Old Approach (Phase 11-13) | This Phase | Impact |
|----------------------------|-----------|--------|
| Compare skill vs base Opus (plugin present/absent) | Compare skill vs a REAL external skill (code-review) | Tests the prior "parity + narrow edge" finding against a competing tool, not just base |
| meta.json = firing/changed_files/exit/elapsed only | + token usage, cost, per-model, tool histogram | Enables the token/tool dimensions (D-04) |
| No new harness (Phase 13) | Modest harness extension (arm + meta + synthetic branch) | The only structural difference from Phase 13 |
| Apply/drive output graded (Phase 13) | Recommend/report output only | Matches code-review's mode (it never applies) |

**Deprecated/outdated:** the two-dot `git diff <empty-tree> HEAD` shortcut is a dead end for code-review
(breaks its three-dot flow) -- do not carry it forward from any earlier scratch idea.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | code-review's whole-session `total_cost_usd`/`modelUsage` aggregate its 2 sub-agents' token cost | Meta Capture Detail | If not, code_review token/cost is under-reported; MITIGATION: confirm on first approved run by comparing total vs main-context usage, then pick the correct field |
| A2 | code-review spawns exactly 2 `general-purpose` sub-agents (Standards + Spec; Spec skips on no-spec but is still spawned-then-skips or not spawned) | Meta Capture / D-03 | Spawn count could be 1 (Spec not spawned) or 2 (spawned, skips). Either is fine as a reported finding; verify from the first transcript. code-review SKILL.md step 4 says "skip the Spec sub-agent" when no spec -> likely 1 spawn on this corpus [CITED: SKILL.md:74] |
| A3 | `.oracle/` books are present for grading (as in Phase 13) | Grading Architecture | If missing, book-authenticity grading blocks; oracle agent will report. Verify before grading (not before runs) |
| A4 | Loading the mattpocock plugin via `--plugin-dir` exposes only code-review as an invocable command we use, though all ~22 skills' descriptions load into context | Standard Stack / D-10 | Minor context-token inflation on the code_review arm; inherent to loading the competitor plugin; note as a caveat, not a blocker [VERIFIED: plugin.json lists 22 skills] |

## Open Questions

1. **Does the plan split nx and kata into one plan or two?** (D-09 discretion)
   - Known: both suites reuse the same runner + extension; targets differ.
   - Recommendation: ONE harness extension shared by both suites (the runner is suite-parameterized via
     `--suite`); target selection per suite. Splitting into two PLANs is fine for execution granularity but
     the code change is shared -- do it once.
2. **Include a base `no_skill` third arm?** (D-10 discretion)
   - Known: Phase 13 already characterized base Opus on applied output; this phase is recommend-mode.
   - Recommendation: OPTIONAL. The head-to-head is lz-refactor vs code_review. A `no_skill` reference arm
     would re-confirm the base baseline in recommend mode but adds spend; DEFER unless the verdict needs it.
3. **Vendor the mattpocock plugin or point at the cache?** (discretion)
   - Recommendation: point at the cache + record version 1.2.0 + code-review SKILL.md content hash in
     meta for drift detection; vendor only the `code-review` skill subtree if durability is wanted (never
     the cache `node_modules/`).

## Sources

### Primary (HIGH confidence -- local artifacts + direct probes)
- `run-e2e.mjs` (read in full) -- arm/mode/plugin-dir wiring, `extractResult()`, `buildCmd()`,
  `composePrompt()`, tool profiles, Pass@k helpers.
- code-review `SKILL.md` (mattpocock cache 1.2.0) -- two-axis process, three-dot diff command, 12-smell
  baseline, sub-agent spawn, Spec-skip.
- mattpocock `plugin.json` + `.claude-plugin/marketplace.json` present -- plugin name `mattpocock-skills`,
  22 skills, code-review dir -> `/mattpocock-skills:code-review`.
- Git probes in `D:/projects/github/nrwl/nx`: empty-tree three-dot diff fails (exit 128); synthetic
  empty-root -> target-only-tree -> tip works on-grain (rev-parse/three-dot diff/git log all exit 0;
  tree scoped to target); `origin/23.0.x:<path>` resolves; nx HEAD = leftover smoke branch.
- On-disk transcript parse: `result` event carries `usage`/`total_cost_usd`/`modelUsage`/`num_turns`;
  `tool_use`-by-name histogram works.
- Catalog leaf counts via `find`: fowler 62, kerievsky 30, gof 23, extra 5, functional 19, smells 28.
- `14-CONTEXT.md` (D-01..D-12), `13-SPEC.md`, `13-RESULTS.md`, `E2E-RESULTS.md`, `E2E-FINDINGS.md`,
  suite.json/targets.json (both suites), `.planning/config.json`.

### Secondary (MEDIUM confidence)
- Sub-agent token roll-up into `total_cost_usd`/`modelUsage` (A1) -- expected Claude Code `-p` behavior,
  not verified in this session (no run spent); confirm at first approved run.

### Tertiary (LOW confidence)
- None. No web research was needed; all answers are local.

## Metadata

**Confidence breakdown:**
- Competitor arm wiring (D-06): HIGH -- run-e2e.mjs read in full; tool-profile requirement derived from
  code-review's documented git+Agent usage.
- Equal-input mechanism (D-02): HIGH -- empty-tree failure and synthetic-branch success both VERIFIED via
  git probes.
- Meta capture (D-07): HIGH for field availability (VERIFIED on-disk); MEDIUM for sub-agent token roll-up
  (A1, verify at first run).
- Grading path (D-04/D-05): HIGH -- reuses Phase-13 posture; vocabulary counts VERIFIED.
- Recommend queries (D-08): HIGH -- reuses existing invoke_skill prompt path.

**Research date:** 2026-07-15
**Valid until:** ~2026-08-15 (stable; the mattpocock cache version and CLI stream-json shape are the
only drift risks -- re-verify code-review SKILL.md and the `result` event shape if either updates).
