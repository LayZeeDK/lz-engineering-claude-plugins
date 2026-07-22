# Phase 21: Applied RED Eval in Real OSS Repos (multi-dimensional, 3-arm) - Research

**Researched:** 2026-07-22
**Domain:** Applied-output skill eval harness (reuse the lz-refactor apply rig for a RED produced-test grade)
**Confidence:** HIGH on harness reuse + grading design (verified against the on-disk rig and the Phase 13/20 precedents); MEDIUM on OSS target selection (D-01 is deliberately steer-at-gate) and on the exact test-runner JSON shapes (verify at build time against the pinned runner versions).

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01 (UNRESOLVED -> research-directed; NOT auto-locked):** The specific OSS TypeScript repo(s) and the red-test-shaped module(s) are deliberately NOT locked. ROADMAP pins ">= 1 real OSS TypeScript repo (Vitest/Jest)" but names none; choosing one is HIGH-IMPACT and not evidence-backed (the `--auto` trap quadrant). Directed research: propose 2-3 concrete red-test-shaped targets where "the next failing test" is genuinely meaningful and a byte-identical short prompt works across all arms. Reuse-candidate baseline: nx `@nx/*` + the Gilded Rose kata already vendored. The planner confirms the final target(s) at plan time; the user can steer before the gated run.
- **D-02:** The task = drive the NEXT failing (red) test on CURRENT code via a short, basic, human-style prompt ("what should I test next here?", "add the next test"). Byte-identical across arms except the target path. Grade the produced test file / diff, never coaching prose.
- **D-03:** Precedent-sized small corpus: aim ~2-3 targets x k=3 (mirrors lz-refactor cr-emb / cr-rlu / cr-gr at k=3-5); exact count tuned at the run gate for spend. Report Pass@k and Pass^k (k = 1, 3, 5, total).
- **D-04:** THREE own-skill arms in the first rounds: `no_skill` (baseline); `with_skill` (real installed plugin present + natural prompt - tests whether the description AUTO-TRIGGERS and then helps); `invoke_skill` (prompt force-starts with `/lz-tdd:lz-red ...` - isolates content value). `with_skill` vs `invoke_skill` surfaces the trigger gap. MUST-AVOID: the Phase-20 conflation where "with_skill" was actually force-invoke reading SKILL.md from disk - `with_skill` here runs the real plugin via `claude -p` for genuine auto-trigger.
- **D-05:** The `mattpocock-skills:tdd` competitor arm is a LATER, CONTINGENT round - only after our own lift is measured. Note the scope mismatch: mattpocock `tdd` is a full red->green loop with an interactive seam-confirmation step, vs lz-red's RED-step-only coach. NOT in the first fan-out.
- **D-06 (hard GATE):** Correctness per produced test = tsc `--strict` clean AND genuinely RED for the right reason on current code (fails on the asserted behavior, not a compile / setup error, not a false green). A run that is not correctness-clean does not count as a pass.
- **D-07 (report / compare - lift dims, not pass/fail):** wall-clock time; tool usage; token usage (mechanical from stream-json meta); output quality; book/source authenticity vs the owned `.oracle/` RED sources (oracle-reviewer, DST-04); follows idioms; follows house style; follows TDD RED practices (right next test, fail-for-right-reason, assert observable behavior, classify-first, lz-tpp handoff).
- **D-08:** SUBSTANCE-ONLY is the headline wherever any vocabulary proxy (phrase-set matcher) is used; any full-run vocabulary number is labeled context only. (Phase-20 EVL-02 lesson: phrase-set graders measure house vocabulary, not substance -> ~3x inflation caught by the unbiased reviewer.)
- **D-09:** Mechanical dims from the stream-json result meta via `tabulate-mechanical.mjs`. Graded dims via blind LLM judges (<= 2 dims per judge, per the Phase-20 judge lock). Book authenticity via `oracle-reviewer` against `.oracle/` (clean-room, DST-04). Pass@k + Pass^k per eval and overall.
- **D-10:** >= 1 from-scratch UNBIASED reviewer (neutral brief, no prior findings) audits the results before they are recorded. Mandatory.
- **D-11:** Reuse the lz-refactor apply harness at `.claude/skills/lz-refactor-workspace/` (`run-e2e.mjs`, `tabulate-mechanical.mjs`, `selfcheck-*.mjs`) + `oracle`/`oracle-reviewer`. Adapt for RED: the graded artifact is a produced test (does it compile + fail for the right reason), not a refactor diff. Synthetic base, stream-json meta, per-arm tool profiles carry over.
- **D-12:** Build + zero-spend selfcheck freely; the metered apply RUN is user-gated - HALT at the run gate for fresh approval. Per-run byproducts git-ignored; NO build deps added to `plugins/lz-tdd` (dev-only workspace).
- **D-13 (run-time orchestration hygiene, carried from Phase 20):** fan out in SMALL waves (24-in-flight + org cap); put an explicit "normal mode / stop ponytail" directive in every in-session Agent subagent prompt (the env-var lock does not reach subagents); resume spend-limit-killed agents via `SendMessage(agentId)`; drive each run in an isolated git-ignored `work/` dir (ground-truth nodrive).
- **D-14:** EVL-03 is formalized in `REQUIREMENTS.md` at PLAN time, mapping the 5 Phase-21 success criteria. The planner does an instrument-first build plan (harness + selfcheck GREEN before the gated run).

### Claude's Discretion

- Harness adaptation details (how the RED produced-test grader plugs into `run-e2e.mjs`), exact judge prompts, and per-arm tool-profile specifics are for the researcher/planner to settle against the reused rig.

### Deferred Ideas (OUT OF SCOPE)

- **mattpocock-skills:tdd competitor round** - contingent, only after own lift is measured (D-05). A later Phase-21 round, not a new phase.
- **ADV-01 / ADV-02** (type-level `expectTypeOf` RED; property-based `fast-check` RED) - Future Requirements, post-0.0.3.
- **Milestone close** - `/gsd-complete-milestone lz-tdd@0.0.3` runs only AFTER Phase 21 completes.
</user_constraints>

<phase_requirements>
## Phase Requirements

Phase 21 formalizes ONE new requirement, EVL-03, at plan time (D-14). Below is a proposed, testable decomposition mapping the 5 ROADMAP success criteria. Each sub-criterion is tagged BUILD (offline-verifiable in this phase by the selfcheck / deterministic battery - the instrument-first deliverable) or RUN (empirically closes only after the user-gated metered run - like EVL-01/EVL-02 which are "build complete; empirical run gated"). This BUILD/RUN split is the honest closure model: this phase closes the BUILD sub-criteria and HALTS; the RUN sub-criteria close in a later, freshly-approved step.

| ID | Sub-criterion | Maps SC | Kind | Proven by |
|----|---------------|---------|------|-----------|
| EVL-03.1 | A RED apply suite exists (suite.json + prompts/ + targets.json) whose short human prompt is byte-identical across arms except the target path, and whose bodies never name the expected test/assertion (non-leading). | SC1 | BUILD | `selfcheck-red` composition crux + a prompt-parity assertion (diff the composed `-p` across arms == only the target path differs) |
| EVL-03.2 | The harness composes all THREE own-skill arms correctly: `no_skill` (no `--plugin-dir`), `with_skill` (`--plugin-dir plugins/lz-tdd`, natural prompt), `invoke_skill` (natural prompt prefixed with `/lz-tdd:lz-red`). | SC2 | BUILD | `selfcheck-red` dry-run argv assertions (mirrors `selfcheck-code-review.mjs` crux 1) |
| EVL-03.3 | The produced-test correctness GATE (D-06) classifies a run as {genuinely_red / false_green / compile_error / collection_error / no_tests / drove_to_green} and passes ONLY genuinely_red (tsc --strict clean AND assertion-failure on current code). | SC3 | BUILD | `grade-red --selfcheck` over fixture test-pairs (one per class), zero spend, fixtures left pristine |
| EVL-03.4 | Mechanical dims (wall-clock, tokens, cost, tool histogram, num_turns, auto-trigger rate) tabulate from the stream-json meta, with Pass@k + Pass^k (k=1,3,5,total) on the correctness gate, per target and overall. | SC3, SC5 | BUILD | `tabulate-mechanical-red --selfcheck` over fixture meta.json + red-grade.json |
| EVL-03.5 | Judgment dims (>= 1 blind LLM judge, <= 2 dims each: "is THIS the right next test?" + "does it assert observable behavior, not implementation?") and book/source authenticity (oracle-reviewer vs owned `.oracle/` RED sources, DST-04) are wired with a fail-closed merge/verify gate. | SC3, SC5 | BUILD (wiring) / RUN (verdicts) | `merge-judge --selfcheck` + a judge-input emission check; verdicts fill post-run |
| EVL-03.6 | The build adds NO dependency to `plugins/lz-tdd`; per-run byproducts are git-ignored; the metered run is gated (HALT). | SC4 | BUILD | `git status` clean after selfcheck; gitignore covers the results tree; `plugins/lz-tdd` untouched |
| EVL-03.7 | Results are recorded with Pass@k / Pass^k + >= 1 from-scratch unbiased reviewer; wherever a vocabulary proxy is used the SUBSTANCE-ONLY comparison is the headline (D-08/D-10). | SC5 | RUN | EVAL-RESULTS scaffold with reserved unbiased-reviewer slot + substance-only headline structure; verdict fills post-run |

The planner should write EVL-03 in REQUIREMENTS.md as "BUILT + deterministically verified this phase; empirical run user-gated" - exactly the EVL-01/EVL-02 closure shape.
</phase_requirements>

## Summary

Phase 21 turns the Phase-20 coaching-prose RED eval into an APPLY eval: short human prompts drive a real produced test file in a real OSS TypeScript repo, across `no_skill` / `with_skill` / `invoke_skill` arms, graded on correctness (a hard gate) plus a set of lift dimensions. The dominant reuse asset is `.claude/skills/lz-refactor-workspace/e2e-nx/run-e2e.mjs` - a mature driver that ALREADY implements the exact 3-arm design D-04 wants (`--arm all` = with_skill/no_skill/invoke_skill via `--plugin-dir` for genuine auto-trigger), the stream-json meta capture (tokens/cost/tools/num_turns), per-run pristine reset, new-file-aware diff capture, worktree-based synthetic bases, Windows-safe process-tree teardown, idempotent resume, and Pass@k/Pass^k. [VERIFIED: disk - run-e2e.mjs read in full]

The genuinely new piece is a RED correctness grader (`grade-red.mjs`): apply the produced test to a fresh checkout, run `tsc --strict` and the target's own test runner, and classify whether the test is genuinely red for the right reason (an assertion failure) versus a compile error, a collection/import error, zero tests, a false green, or a drove-to-green (the agent also implemented the behavior). This classifier is the D-06 gate AND doubles as the apply-mode "wrote the red test and stopped" discipline check. It is mechanically decidable from the runner's JSON output and provable offline on fixture test-pairs, so the whole instrument is selfcheckable with zero spend before the gated run. [VERIFIED: disk - gilded-rose.ts, selfcheck-code-review.mjs, grade-run.mjs]

Two precedent findings shape expectations. First, on APPLIED output a strong base model (claude-opus-4-8 @ high) is already excellent: Phase 13 found strict PARITY between lz-refactor and base Opus on book authenticity and correctness. [VERIFIED: disk - 13-RESULTS.md] Second, Phase 20 EVL-02 found the skill's real, judge-verified edge is concentrated on RED-DISCIPLINE cases a strong base gets wrong (COMMAND handoff/coach-don't-drive, classify-first boundary), and that phrase-set graders inflate the gap ~3x by measuring house vocabulary. [VERIFIED: disk - EVAL-RESULTS.md] So Phase 21 should EXPECT correctness parity on the easy targets and design the target set + the graded dims to surface the RED-discipline signal, with a substance-only headline (D-08) and a mandatory unbiased reviewer (D-10).

**Primary recommendation:** Build the instrument as a new `lz-red-workspace` apply suite that REUSES `run-e2e.mjs` verbatim via `--suite` (with one surgical edit - parameterize the skill-name tracking off suite.json) plus three new sibling scripts (`grade-red.mjs` correctness gate, `tabulate-mechanical-red.mjs`, `selfcheck-red.mjs`) and the reused `merge-judge.mjs` + `oracle-reviewer`. Anchor the corpus on the vendored Gilded Rose `Conjured` target (verified genuinely-red, but high-contamination -> a correctness smoke anchor, not a discriminator) and add 1-2 discriminating real-OSS targets the user confirms at the gate. Prove every crux offline on fixtures, then HALT for approval.

## Architectural Responsibility Map

The "tiers" here are the eval-harness stages, not app tiers. This map is for the planner to sanity-check task assignment and for the plan-checker to verify each capability lands in the right script (and that NOTHING lands in `plugins/lz-tdd`).

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Arm composition + `claude -p` driving (3 arms, stream-json, per-arm tool profile) | `run-e2e.mjs` (driver, REUSED) | suite.json / prompts/ (config) | Already implements the exact D-04 arm set; do not rewrite |
| Equal-input isolation per target (fresh checkout, pristine reset, new-file diff capture) | `run-e2e.mjs` apply mode + worktree | os.tmpdir() worktree | Existing reset/clean/diff logic is new-file-aware (I3) |
| Skill-fired / auto-trigger signal (used_red; with_skill vs invoke_skill gap) | `run-e2e.mjs` `extractResult` (EDIT: parameterize skill names) | suite.json `trackSkills` | Currently hardcodes lz-refactor/lz-tpp - the one surgical edit |
| Correctness GATE (D-06): tsc --strict + run test + classify genuinely-red | `grade-red.mjs` (NEW) | TARGET repo toolchain (its vitest/jest + tsc) | The graded artifact is a test that must RUN and FAIL for the right reason; mechanical |
| Mechanical dims + Pass@k/Pass^k | `tabulate-mechanical-red.mjs` (NEW, adapt `tabulate-mechanical.mjs`) | meta.json + red-grade.json | Reuse comb/passAtK/passHatK; retarget "pass" to the correctness gate |
| Judgment dims (right-next-test; observable-behavior) | Blind LLM judge (ORCHESTRATOR) | `merge-judge.mjs` (REUSED) + fail-closed verify | <= 2 dims per judge (Phase-20 lock); blind the judge to arm |
| Book/source authenticity vs owned RED sources | `oracle-reviewer` agent (REUSED) | `.oracle/{clean-code,99-bottles-2e-js,videos/test-desiderata,written-content}` | Clean-room DST-04; own-words verdicts only cross back |
| Offline proof of every crux (zero spend) | `selfcheck-red.mjs` (NEW, mirror `selfcheck-code-review.mjs`) | fixtures/ (synthetic test-pairs) | The build-then-halt boundary; fixtures are selfcheck-only, NOT eval targets |
| Unbiased audit of grader + numbers | from-scratch reviewer (ORCHESTRATOR) | EVAL-RESULTS reserved slot | Caught the Phase-20 vocabulary inflation; mandatory (D-10) |

## Standard Stack

No new runtime stack is introduced. This phase is Node ESM harness scripts plus the vendored target repos' own toolchains.

### Core (all already present)
| Component | Version | Purpose | Why Standard |
|-----------|---------|---------|--------------|
| `run-e2e.mjs` (lz-refactor rig) | on-disk, 2026-07-17 | The 3-arm apply driver (stream-json, per-arm tool profile, worktree base, Pass@k) | Purpose-built for exactly this eval shape; D-11 mandates reuse [VERIFIED: disk] |
| Node.js (built-ins: `child_process`, `fs`, `path`, `os`, `url`) | system Node | spawn `claude -p`, git plumbing, transcript parse | The rig is pure Node ESM, no framework [VERIFIED: disk] |
| `claude` CLI | installed (Team Plan) | drives the metered runs; `--output-format stream-json` gives the meta | The rig resolves the native `.exe` on Windows [VERIFIED: disk - resolveClaude()] |
| `merge-judge.mjs` (lz-red-workspace) | on-disk, 2026-07-21 | merge blind judge verdicts + fail-closed verify gate | Already selfcheck-GREEN; reuse verbatim [VERIFIED: disk] |
| `oracle` / `oracle-reviewer` agents | on-disk | clean-room book-authenticity gate (DST-04) | The only sanctioned path to `.oracle/` [VERIFIED: disk - oracle-reviewer.md] |
| TARGET repo toolchain (vitest/jest + tsc) | per repo (kata: vitest 0.28 + jest 29 + ts 4.4) | run the produced test for the correctness gate | The gate must run the test in ITS repo, not the workspace [VERIFIED: disk - kata package.json] |

### Supporting (dev-only workspace deps, already pinned)
| Component | Version | Purpose | When to Use |
|-----------|---------|---------|-------------|
| `typescript` (lz-red-workspace devDep) | 6.0.3 (pinned) | the workspace's own reference-sample gate | NOT the correctness-gate typechecker - that uses the target's tsc [VERIFIED: disk] |
| `vitest` (lz-red-workspace devDep) | 4.1.10 (pinned) | the workspace's own sample runner | Same - correctness gate uses the target's runner |

**Installation:** None. NO dependency is added to `plugins/lz-tdd` (D-12). The vendored target repos already have `node_modules` installed (kata verified on disk; nx verified on disk). If a NEW real-OSS target is chosen at the gate, its one-time `npm install` is a gate-time setup step, not a build dep.

**Version verification performed:**
- Gilded Rose kata: `test:vitest` + `test:jest` scripts present; vitest `^0.28.5`, jest `^29.4.3`, typescript `^4.4.4`. [VERIFIED: disk - kata package.json] Caveat: vitest 0.28's JSON reporter output shape predates vitest 1.x; verify the exact JSON shape at build time against the fixture (see Pitfalls).
- nx: on `origin/23.0.x`, jest-based `@nx/eslint-plugin`. [VERIFIED: disk] Not recommended as a RED target (see D-01).

## Package Legitimacy Audit

This phase installs NO external packages into the shipped plugin or the workspace (D-12: no build deps in `plugins/lz-tdd`; the workspace deps typescript@6.0.3 + vitest@4.1.10 are already pinned and were legitimacy-checked in Phase 16). The vendored target repos are pre-installed real OSS.

| Package | Registry | Age | Downloads | Source Repo | Verdict | Disposition |
|---------|----------|-----|-----------|-------------|---------|-------------|
| (none added) | - | - | - | - | - | No install step |
| Gilded Rose kata (target repo, pre-vendored) | github.com/emilybache/GildedRose-Refactoring-Kata | 10+ yrs | n/a (kata) | emilybache/GildedRose-Refactoring-Kata | OK (real, MIT, on disk) | Approved as a target [VERIFIED: disk + web] |
| nrwl/nx (target repo, pre-vendored) | github.com/nrwl/nx | 9+ yrs | very high | nrwl/nx | OK | Present but NOT recommended as a RED target |

**Packages removed due to SLOP verdict:** none.
**Packages flagged as suspicious (SUS):** none.
**Gate note:** if the user nominates a NEW real-OSS target repo at the gate, run the package-legitimacy gate on IT (it will be `npm install`ed) and confirm it is a real, maintained repo before vendoring.

## Architecture Patterns

### System Architecture Diagram (data flow)

```
                         suite.json + prompts/*.md + targets.json     (config: the RED corpus, D-01)
                                        |
              short human prompt (byte-identical across arms except target path, D-02)
                                        |
                      +-----------------+-----------------+
                      |                 |                 |
                  no_skill          with_skill        invoke_skill                 (D-04 arms; run-e2e.mjs --arm all)
                 (no plugin)   (--plugin-dir, natural)  (prefix /lz-tdd:lz-red)
                      |                 |                 |
                      +--------> claude -p (apply mode, bypassPermissions) <--------+
                                        |
                          stream-json transcript + working-tree edits
                                        |
                        +---------------+----------------+
                        |                                |
              extractResult (meta.json:            git add -A; git diff --cached
              tokens/cost/tools/num_turns,          -> diff.patch (the produced test),
              auto-trigger = used_red)              changed_files ; then reset --hard
                        |                                |
                        |                                v
                        |                 grade-red.mjs  (D-06 correctness GATE)
                        |                 fresh worktree @ applyBase -> apply test
                        |                 -> tsc --strict (differential)
                        |                 -> run target's vitest/jest (--reporter=json)
                        |                 -> classify: genuinely_red | false_green |
                        |                    compile_error | collection_error |
                        |                    no_tests | drove_to_green
                        |                                |
                        v                                v
       tabulate-mechanical-red.mjs  <----- red-grade.json (per run: gate verdict + why)
       (wall-clock, tokens, tools, num_turns;
        Pass@k/Pass^k on the correctness gate;
        auto-trigger rate; substance-only)
                        |
                        |     +--> blind LLM judge (<=2 dims: right-next-test, observable-behavior)
                        |     |         -> merge-judge.mjs (fail-closed verify) -> merged verdicts
                        |     +--> oracle-reviewer (produced test vs owned .oracle/ RED sources, DST-04)
                        v     v
                  EVAL-RESULTS.md  (Pass@k/Pass^k tables per target + overall;
                  substance-only headline; reserved >=1 unbiased-reviewer slot, D-10)
                        |
                        v
          selfcheck-red.mjs proves EVERY crux above on fixtures OFFLINE (zero spend)  ==>  HALT (D-12)
```

File-to-stage mapping lives in the Architectural Responsibility Map above; the diagram shows data flow only.

### Recommended workspace layout (mirrors the lz-refactor rig)

```
.claude/skills/lz-red-workspace/
  e2e-red-<repo>/                 # one apply suite per target repo (mirrors e2e-nx / e2e-gilded-rose)
    suite.json                    # { name, repo, applyBase, protectedBranches, skillCommand:/lz-tdd:lz-red, trackSkills:[lz-red,lz-tpp], prompts[] }
    targets.json                  # per-target: file path, the behavior gap, expected RED color, the discipline trap it stresses
    prompts/                      # short human-style bodies (byte-identical across arms; non-leading)
    results/apply/<arm>/<pid>/run-<k>/{meta.json, answer.md, diff.patch, red-grade.json, outputs/}   # gitignored
  grade-red.mjs                   # NEW: the D-06 correctness gate + classifier (+ --selfcheck over fixtures/)
  tabulate-mechanical-red.mjs     # NEW: mechanical dims + Pass@k on the correctness gate (+ --selfcheck)
  selfcheck-red.mjs               # NEW: offline zero-spend cruxes (mirror selfcheck-code-review.mjs)
  fixtures/                       # NEW: synthetic test-pairs proving the classifier (genuinely-red / false-green / compile-error / collection-error). SELFCHECK-ONLY, never eval targets.
  merge-judge.mjs                 # REUSED (already present, selfcheck-GREEN)
```

The shared driver stays at `.claude/skills/lz-refactor-workspace/e2e-nx/run-e2e.mjs` and is invoked with `--suite <the new e2e-red dir>` (the rig already supports cross-workspace `--suite`; e2e-gilded-rose does exactly this). [VERIFIED: disk - README.md, run-e2e.mjs argVal('--suite')]

### Pattern 1: Reuse run-e2e.mjs; add a post-run grader, do not fork the driver

**What:** run-e2e.mjs drives the arms and captures `diff.patch` + `meta.json`. Grading is a SEPARATE post-run pass (Phase 13 did the same - `grading/*` scripts read the captured diffs). This keeps the driver edit to one surgical change and isolates the RED-specific logic in `grade-red.mjs`.
**When to use:** always here. D-11 mandates reuse; forking the driver would duplicate the Windows process-tree teardown, resume, and safety rails.
**The one driver edit (skill-name parameterization):**
```js
// Source: run-e2e.mjs extractResult() currently hardcodes lz-refactor/lz-tpp.
// Change: read the tracked skill name(s) from suite.json (default keeps back-compat).
// SUITE.trackSkills = ["lz-red", "lz-tpp"]  ->  scan tool_use blobs for each; emit used_<name>.
// with_skill "auto-trigger fired" = a Skill tool_use whose command/skill names lz-red
//   WHILE the composed prompt did NOT contain "/lz-tdd:lz-red" (invoke_skill DID). That
//   prompt-vs-invocation asymmetry is exactly the D-04 trigger-gap signal.
```

### Pattern 2: The correctness gate is a runner-JSON classifier, not a text scan

**What:** For each run, apply `diff.patch` to a fresh `applyBase` worktree, run `tsc --noEmit --strict` (differential vs the pristine baseline) and the target's own test runner with a machine-readable reporter, then classify from the structured result.
**When to use:** the D-06 gate for every run.
**Example (classification logic):**
```js
// Source: derived from vitest/jest JSON reporter semantics [ASSUMED - verify shape on the fixture].
// vitest run <file> --reporter=json    (or jest <file> --json) emits testResults[].assertionResults[]
//   with status 'passed'|'failed' and failureMessages[]; a suite that fails to LOAD appears as a
//   file-level error with no assertionResults.
function classify(tscResult, runnerJson) {
  if (tscResult.newErrors > 0) return 'compile_error';          // D-06: tsc --strict must be clean
  const suite = runnerJson.testResults?.[0];
  if (!suite) return 'collection_error';                        // runner could not load the file
  if (suite.status === 'failed' && !suite.assertionResults?.length)
    return 'collection_error';                                  // import/setup threw before any assert
  const asserts = suite.assertionResults || [];
  if (asserts.length === 0) return 'no_tests';                  // 0 tests collected
  const failed = asserts.filter(a => a.status === 'failed');
  if (failed.length === 0) return 'false_green_or_drove';       // passed immediately OR agent implemented it
  // A genuine RED = failed on an ASSERTION, not a runtime/type error masquerading as a failure.
  const rightReason = failed.every(a =>
    /assertionerror|expected|toBe|toEqual|toHaveBeen/i.test((a.failureMessages || []).join('\n')) &&
    !/is not a function|cannot find|is not defined|referenceerror|syntaxerror/i.test((a.failureMessages || []).join('\n')));
  return rightReason ? 'genuinely_red' : 'wrong_reason';
}
// 'false_green_or_drove' is split by inspecting diff.patch: if the diff changed PRODUCTION (non-test)
// files such that the test now passes, it is 'drove_to_green' (overstepped into lz-tpp's job); else
// 'false_green'. A small compiling STUB that keeps the test RED is allowed (Law 2) and is NOT a fault.
```

### Pattern 3: Genuine auto-trigger requires the plugin loaded, natural prompt, and a prompt-vs-invocation check

**What:** `with_skill` = `--plugin-dir plugins/lz-tdd` + a natural prompt (no slash command). The skill auto-triggers by its description. `invoke_skill` = the same but the prompt is prefixed with `/lz-tdd:lz-red`. `no_skill` = no `--plugin-dir`. The MUST-AVOID (D-04) is the Phase-20 conflation where "with_skill" pasted SKILL.md text inline - that is NOT what run-e2e.mjs does; its with_skill is a genuine plugin load. [VERIFIED: disk - buildCmd() / composePrompt()]
**Confirming auto-trigger fired from the transcript:** a `Skill` tool_use event (or an `lz-red` string in a tool_use blob) in a with_skill run whose composed prompt did not name the skill. The gap between with_skill fire-rate and invoke_skill (which always fires) is the trigger-gap dimension.

### Anti-Patterns to Avoid
- **Re-scanning the produced test's SOURCE for house vocabulary as a correctness proxy.** A good test does not need to contain the words "output-based" or "arrange-act-assert". The Phase-20 phrase-set-over-prose grader does NOT transfer to a code artifact. Vocabulary proxies over a test file are even less meaningful than over prose; keep them out of the correctness gate and, if used at all for a "house style" dim, label them substance-only context (D-08).
- **Grading the coach's chat prose instead of the produced test.** D-02 is explicit: grade the file/diff, not prose. The `answer.md` is context; `diff.patch` is the artifact.
- **A single "synthetic base" of only the target file for RED.** The lz-refactor code-review synthetic base is a ONE-FILE tree (for a diff fixed-point). RED needs the FULL repo so the produced test can import, typecheck, and run. Use a full-repo worktree at `applyBase` (os.tmpdir()), not the single-file synthetic tree.
- **Equalizing tool profiles across arms.** Per the D-04 finding tradition, do not force the arms to identical tool budgets; the tool-usage histogram IS a reported dimension.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Drive 3 arms + capture stream-json meta | A new claude -p spawner | `run-e2e.mjs` (REUSE via `--suite`) | Already has arm fan-out, Windows exe resolution, process-tree kill, resume, safety rails [VERIFIED: disk] |
| Capture the produced test (incl. new files) | A bespoke diff walker | run-e2e apply mode `git add -A; git diff --cached APPLY_BASE` | The I3 fix already stages untracked new files (the test is a new file) [VERIFIED: disk] |
| Decide if a test failed on an assertion vs errored | Regex over human console output | The runner's JSON reporter (`vitest --reporter=json` / `jest --json`) assertionResults[].status | Console scraping is brittle across runner versions; JSON is structured [ASSUMED - verify shape] |
| Pass@k / Pass^k | New combinatorics | `comb/passAtK/passHatK` in run-e2e.mjs + tabulate-mechanical.mjs | Verbatim-reusable; identical formulas already in both [VERIFIED: disk] |
| Merge blind judge verdicts + fail-closed gate | A new merge script | `merge-judge.mjs` (REUSE; selfcheck-GREEN) | Byte-match verdict provenance + verify gate already built [VERIFIED: disk - EVAL-RESULTS How-to-run] |
| Book/source authenticity | Let main context read `.oracle/` | `oracle-reviewer` agent | DST-04 clean-room firewall; only own-words verdicts cross back [VERIFIED: disk] |
| Isolated per-run checkout | A copy of the repo per run | `git worktree add <tmp> <applyBase>` (as buildSyntheticBase does) | Cheap, pristine, torn down finally-style; nothing lands in the tracked tree [VERIFIED: disk] |

**Key insight:** ~90% of Phase 21 is reuse. The only genuinely new logic is the RED correctness classifier (a ~1-screen JSON-classifier), its fixtures, and its selfcheck crux. Everything else is a config suite + adapters over proven scripts.

## Common Pitfalls

### Pitfall 1: The D-06 gate silently constrains target selection to "existing-compiling-API + wrong/missing-behavior"
**What goes wrong:** D-06 requires tsc --strict CLEAN AND a genuinely-red ASSERTION failure. A brand-new-symbol-from-scratch test references a not-yet-defined symbol -> compile error -> fails D-06 (even though the skill's Law 2 says "not-compiling counts as the failure"). A fully-correct-but-untested function -> the natural test PASSES -> false green -> fails D-06. So neither greenfield nor already-correct code is a valid RED target under this gate.
**Why it happens:** the gate's "not a compile error, not a false green" clauses are stricter than the skill's own Law 2. This is a real tension between D-06 and the skill content.
**How to avoid:** choose targets where the public API ALREADY EXISTS and COMPILES but the behavior is wrong or missing on some input class - so the test compiles (tsc-clean) and fails on an assertion. The SKILL.md worked example encodes exactly this shape (a compiling stub with a wrong body). [VERIFIED: disk - SKILL.md applyDiscount example]
**Warning signs:** a candidate target where "the next test" would reference a symbol that does not exist yet, or where the current code already does the right thing.

### Pitfall 2: Characterization tests are green-by-construction and do not fit the RED gate
**What goes wrong:** the lz-red skill covers the Feathers characterization stance (pin CURRENT behavior of untested legacy). A characterization test PASSES (it asserts what the code currently does) -> false green under D-06.
**Why it happens:** characterization is a green move by design; the RED gate wants a red move.
**How to avoid:** keep the graded corpus to NEW-behavior / next-increment targets (assertion-red). If a characterization-stance target is wanted for the "TDD RED practices" dimension, grade it as a JUDGE dimension ("is the right next move to pin behavior via a characterization test first?"), NOT through the mechanical genuinely-red gate. Do not put a characterization target on the D-06 pass/fail path.

### Pitfall 3: "tsc --strict clean" must be scoped so the target's own non-strict source does not sink the verdict
**What goes wrong:** the Gilded Rose `Item` constructor has untyped params (`constructor(name, sellIn, quality)`); under `--strict` (`noImplicitAny`) the SOURCE itself has type errors. If the gate typechecks the whole project with --strict, the verdict fails on pre-existing source, not on the produced test. [VERIFIED: disk - gilded-rose.ts lines 6-10]
**Why it happens:** "tsc --strict clean" is ambiguous between "the whole project is strict-clean" (often false for real repos) and "the produced test introduces no NEW type errors".
**How to avoid:** use a DIFFERENTIAL typecheck - run the target's own `tsc --noEmit --strict` at the pristine baseline, record the baseline error set, then re-run with the produced test and assert ZERO NEW errors attributable to the test. This mirrors Phase 13's differential behavior oracle ("no NEW failures beyond the recorded baseline"). [VERIFIED: disk - 13-RESULTS.md caveat 2]
**Warning signs:** a target repo whose pristine `tsc --strict` is already non-zero.

### Pitfall 4: Runner-awareness - the gate runs the TARGET's toolchain, not the workspace's
**What goes wrong:** grading with the workspace's vitest 4.1.10 against a kata that uses vitest 0.28 (or nx that uses jest) produces config/resolution failures (the `@/` path alias, globals, coverage provider all live in the target's config). [VERIFIED: disk - kata vitest.config.ts uses tsconfigPaths + globals]
**Why it happens:** each target repo has its own runner, config, and node_modules.
**How to avoid:** the grader reads the run command from suite.json / the target's package.json and shells into the TARGET repo (`npx vitest run <file> --reporter=json` or `npx jest <file> --json`). Record the runner + version in red-grade.json for drift detection.
**Warning signs:** "cannot find module '@/...'" or "describe is not defined" during grading = you ran the wrong runner/config.

### Pitfall 5: Contamination -> correctness parity (do not read parity as failure)
**What goes wrong:** the canonical kata answers are in the model's training data. Gilded Rose "Conjured items degrade twice as fast" (name "Conjured Mana Cake", SellIn 6/Quality 5 -> 3, degrade 4 after sell-by, never below 0) is fully documented. [VERIFIED: web] Base Opus produces the same correct test as the skill arm -> correctness PARITY (exactly Phase 13). If parity is read as "the skill adds nothing", the eval is misjudged.
**Why it happens:** a strong base model already knows textbook TDD moves (Phase 20 saw 8/10 substance ties).
**How to avoid:** treat correctness as a GATE (does the arm clear the bar), not the discriminator. Put the discriminating signal on the RED-DISCIPLINE dims (classify-first, coach-don't-drive-to-green, assert-observable-behavior, handoff) + the trigger gap (with_skill vs invoke_skill) + process dims (tokens/turns/tools). Flag contamination explicitly per target.
**Warning signs:** all arms pass correctness at ceiling on a famous kata - expected, not a defect.

### Pitfall 6: Vocabulary-proxy inflation (the Phase-20 lesson) - substance-only headline
**What goes wrong:** any phrase-set/house-vocabulary matcher (over prose OR test source) systematically false-fails a substantively-correct baseline that words things differently, inflating the skill's apparent edge (~3x in Phase 20). [VERIFIED: disk - EVAL-RESULTS.md]
**How to avoid:** the correctness gate is mechanical (runs the test, not word-matching). Judgment dims go through a BLIND LLM judge. Any "house style" vocabulary number is labeled context-only; the headline is substance-only (D-08). Apply artifact caveats SYMMETRICALLY (to both arms), not just upward.

### Pitfall 7: Judge un-blindability (Phase-20 design flaw to FIX)
**What goes wrong:** with_skill transcripts self-identify (they contain "lz-red", "Law 1-3", "message-matrix"), so a judge reading the transcript is not truly blind. Phase 20 found no bias symptom but flagged it as a design flaw. [VERIFIED: disk - EVAL-RESULTS.md]
**How to avoid:** for Phase 21 the graded artifact is the TEST FILE, which is far easier to blind - strip comments, normalize formatting, and feed the judge ONLY the test code + the target behavior spec, with no arm label and no skill self-identification. This is a genuine improvement Phase 21 can make over Phase 20.

### Pitfall 8: Concurrency / org cap during the gated run (D-13)
**What goes wrong:** fanning out too many `claude -p` sessions at once trips the org concurrency cap and spend-limit kills (the user flagged 24-in-flight). run-e2e.mjs runs arms/prompts/runs SERIALLY, so a single suite is safe; the risk is the ORCHESTRATOR spawning multiple background suites or many grading subagents in parallel.
**How to avoid:** small waves; drive one suite at a time; resume spend-limit-killed agents via SendMessage; put an explicit "normal mode / stop ponytail" directive in every in-session Agent subagent prompt (env-var lock does not reach subagents). All of this is RUN-time and gated - not part of the build.

### Pitfall 9: "drove to green" masquerading as a pass
**What goes wrong:** an arm writes the test AND implements the behavior, so the test passes green - which naively looks like success but is a RED-discipline FAILURE (overstepped into lz-tpp's job; the produced artifact is not a red test).
**How to avoid:** the genuinely-red gate already fails a green test. Additionally inspect `diff.patch`: if production (non-test) files changed such that the test passes, classify `drove_to_green` (distinct from a benign compiling stub that keeps the test red). This IS the apply-mode analog of the Phase-20 nodrive dimension.

## Code Examples

### Example: selfcheck fixture crux for the RED classifier (offline, zero-spend)
```js
// Source: pattern lifted from selfcheck-code-review.mjs (three offline cruxes) [VERIFIED: disk].
// New crux 4: prove grade-red classifies each color on a FIXTURE test-pair, no claude spend.
// fixtures/ holds tiny self-contained module+test pairs (SELFCHECK-ONLY, never eval targets):
//   red/        module with wrong body + test that fails on an assertion   -> expect genuinely_red
//   green/      module correct + test that passes                          -> expect false_green
//   compile/    test with a type error under --strict                      -> expect compile_error
//   collect/    test importing a missing symbol                            -> expect collection_error
//   notest/     a spec file with no it()                                   -> expect no_tests
for (const [dir, want] of [['red','genuinely_red'],['green','false_green'],
                           ['compile','compile_error'],['collect','collection_error'],['notest','no_tests']]) {
  const got = gradeRedFixture(join('fixtures', dir));   // runs tsc + the fixture's runner, offline
  if (got !== want) fail(`[classifier:${dir}] classified ${got}, expected ${want}`);
}
console.log('  [crux 4] RED classifier OK (genuinely_red / false_green / compile_error / collection_error / no_tests)');
```

### Example: differential tsc + runner invocation (the correctness gate body)
```bash
# Source: differential pattern from Phase 13 behavior oracle [VERIFIED: disk - 13-RESULTS.md].
# In a fresh worktree at applyBase, BEFORE applying the produced test:
npx tsc --noEmit --strict 2> baseline-tsc.txt || true      # record the pristine baseline error set
npx vitest run <targetSpec> --reporter=json > /dev/null 2>&1 || true   # (sanity) target's own suite
# AFTER applying the produced test file from diff.patch:
npx tsc --noEmit --strict 2> withtest-tsc.txt || true      # NEW errors (withtest minus baseline) must be 0
npx vitest run <producedTestFile> --reporter=json > run.json 2>&1      # classify from run.json
# jest targets: npx jest <producedTestFile> --json > run.json
```

### Example: prompt-parity assertion (byte-identical across arms except path, D-02)
```js
// Source: new selfcheck assertion for EVL-03.1.
// Compose the -p prompt for all three arms on the same target; assert the ONLY difference across
// no_skill vs with_skill is nothing, and invoke_skill differs by EXACTLY the leading "/lz-tdd:lz-red ".
const [ns] = dryRunArgvs(['--mode','apply','--arm','no_skill','--prompt','r1']);
const [ws] = dryRunArgvs(['--mode','apply','--arm','with_skill','--prompt','r1']);
const [is] = dryRunArgvs(['--mode','apply','--arm','invoke_skill','--prompt','r1']);
if (flagValue(ns,'-p') !== flagValue(ws,'-p')) fail('no_skill vs with_skill prompt differs (must be byte-identical)');
if (flagValue(is,'-p') !== '/lz-tdd:lz-red ' + flagValue(ws,'-p')) fail('invoke_skill is not with_skill prompt + the slash prefix');
```

## State of the Art

| Old Approach (Phase 20) | Current Approach (Phase 21) | Why it changed | Impact |
|--------------------------|------------------------------|----------------|--------|
| Grade COACHING PROSE via phrase-set matchers over the response text | Grade the PRODUCED TEST FILE mechanically (runs + fails for the right reason) + blind judge | The user requires APPLY-in-real-repos, not prose over inline snippets [VERIFIED: MEMORY.md requirement] | Substance is the test's behavior, not vocabulary |
| "with_skill" = pasted SKILL.md text inline (a conflation) | "with_skill" = real `--plugin-dir` plugin load + natural prompt (genuine auto-trigger) | D-04 MUST-AVOID; run-e2e.mjs already does this correctly | Measures the real description-trigger + help path |
| Judge reads self-identifying transcripts (un-blindable) | Judge reads only the blinded test code + behavior spec | Phase-20 flagged un-blindability as a design flaw | A genuinely blind judgment delta |
| Correctness measured as a phrase-set proxy | Correctness is a hard mechanical gate (tsc + runner JSON) | D-06 defines a concrete pass condition | No vocabulary inflation on correctness |

**Deprecated/outdated for this phase:**
- The phrase-set-over-prose portion of `grade-run.mjs` does not transfer to a test artifact; reuse only its skeleton/`merge-judge` wiring and the `occursAffirmed` matcher IF grading residual prose (context-only).

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `vitest --reporter=json` / `jest --json` emit `testResults[].assertionResults[].status` and distinguish an assertion failure from a suite-load error | Patterns / Don't Hand-Roll | If the exact shape differs by runner version (kata's vitest 0.28 predates 1.x), the classifier needs shape-tweaks; the fixture selfcheck catches this offline before any spend |
| A2 | A `--plugin-dir plugins/lz-tdd` load auto-triggers the lz-red skill by description exactly as an installed plugin would | Pattern 3 / arms | If dev-dir load differs from marketplace-cache load, point `--plugin-dir` at the installed cache instead; both test genuine auto-trigger (0.0.3 already reloaded, so tree == cache) |
| A3 | A verified low-contamination real-OSS behavior gap is hard to pre-pick in research; the corpus leans on the vendored kata + user-nominated targets | D-01 (below) | If the user wants a specific real repo, run the qualification checklist on it at the gate; parity on contaminated targets is expected, not a defect |
| A4 | The differential tsc approach reliably isolates test-introduced type errors from pre-existing source errors | Pitfall 3 | If baseline error attribution is noisy, scope the typecheck to a temp tsconfig that `include`s only the produced test + its direct imports with `--strict` |
| A5 | Book/source authenticity is a meaningful dimension for a produced TEST (vs a named refactoring) | D-07 / grading | Authenticity for a test is fuzzier than for a catalog refactoring; frame the oracle-reviewer axis as "does the test embody the owned RED practices (F.I.R.S.T., Test Desiderata, message-matrix, intention-revealing naming)", and expect lower discriminating power |

## Open Questions

1. **The exact discriminating real-OSS target(s) beyond the kata anchor (D-01).**
   - What we know: Gilded Rose `Conjured` is verified genuinely-red but high-contamination (a correctness smoke anchor). nx `@nx/eslint-plugin` files are heavily tested (spec files 700-1600 lines) -> poor RED targets. [VERIFIED: disk - targets.json test_net fields]
   - What's unclear: whether the user wants a second/third emilybache kata (real OSS, contamination-flagged) or a nominated real production repo with a genuine gap.
   - Recommendation: see the D-01 section - anchor on the kata, let the user confirm 1-2 discriminating targets at the gate using the qualification checklist. This is exactly D-01's "planner confirms; user steers" design.

2. **How many judgment dims / how many judges.**
   - What we know: Phase-20 locked <= 2 dims per judge. The two natural dims are "is THIS the right next test?" and "does it assert observable behavior, not implementation?".
   - What's unclear: whether a second judge pair is warranted for classify-first and house-idiom-match (the discriminating dims), or whether those fold into the mechanical gate + one judge.
   - Recommendation: one blind judge with the two locked dims for the headline; add classify-first as a THIRD dim only via a second judge (keep <= 2 per judge). Decide at plan time based on how many targets stress classify-first.

3. **Whether to run one suite (kata) or multiple suites at the gate.**
   - What we know: D-03 wants ~2-3 targets x k=3. Each suite runs serially (safe); multiple suites in parallel risk the org cap (Pitfall 8).
   - Recommendation: one suite dir per target repo; drive them sequentially at the gate.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| `claude` CLI (native exe) | metered runs (gated) | Yes (Team Plan) | current | none needed; run is gated anyway |
| Node.js + git | driver + grader + selfcheck | Yes | system | none |
| `git worktree` | fresh per-run checkout | Yes | system git | none |
| Gilded Rose kata + its node_modules | the anchor RED target | Yes | vendored, `npm install` done | re-`npm install` if stale |
| nx + node_modules | (available, not recommended as RED target) | Yes | origin/23.0.x | n/a |
| `oracle` / `oracle-reviewer` agents | book-authenticity dim | Yes | on-disk | none |
| `merge-judge.mjs` | judge merge/verify | Yes | on-disk, selfcheck-GREEN | none |
| A second/third real-OSS target's node_modules | discriminating targets (if chosen) | NO (until vendored) | - | one-time `npm install` at the gate (setup, not a build dep) |

**Missing dependencies with no fallback:** none for the BUILD (everything the offline selfcheck needs is present).
**Missing dependencies with a fallback:** a user-nominated discriminating repo needs a one-time `npm install` before its gated run - a gate-time setup step, not a build blocker.

## D-01: OSS target selection (the load-bearing open choice)

**The core tension (why D-01 was left unresolved):** the D-06 gate needs an existing-compiling-API with a wrong/missing behavior (Pitfall 1), the phase wants MULTI-DIMENSIONAL discrimination across RED-discipline axes, the user's standing requirement wants REAL OSS repos (not synthetic snippets) [VERIFIED: MEMORY.md], low contamination is desirable, and it must be offline-vendorable + verifiable. Well-maintained OSS is usually fully tested (natural next test = false green) or its "gaps" are deliberate design choices (ambiguous red) - so a verified, low-contamination, real-OSS behavior gap is genuinely scarce. This scarcity is the reason D-01 is a steer-at-gate decision, and the recommendation below is honest about it.

**Note on "real OSS" vs katas:** the user's requirement contrasts APPLY-in-real-repos against PROSE-over-inline-snippets. A kata repo (real public GitHub, real `npm test`, real files, produced test graded as code) SATISFIES that requirement - the graded artifact is a real test file in a real repo. Katas are acceptable; their weakness is contamination (which predicts correctness parity), not un-realness.

### Candidate targets (each assessed against the red-test-shaped criteria)

| Candidate | Repo / path | The behavior gap | Red-test-shaped? | Runner / house idiom | Setup | Contamination |
|-----------|-------------|------------------|------------------|----------------------|-------|---------------|
| **Gilded Rose `Conjured`** (RECOMMEND: primary anchor) | emilybache/GildedRose-Refactoring-Kata `TypeScript/app/gilded-rose.ts` @ `main` (VENDORED) | `updateQuality()` has no Conjured branch (only Aged Brie / Backstage / Sulfuras / normal). A test asserting "Conjured degrades by 2" compiles (Item/GildedRose exist) and FAILS on the assertion (code degrades by 1). | YES - verified genuinely-red: tsc-clean + assertion-fail, not compile error, not false green [VERIFIED: disk] | vitest 0.28 (`describe/it/expect`, `@/` alias, globals) + jest 29 both configured | already vendored + installed | HIGH (canonical, fully documented) [VERIFIED: web] |
| **nx `@nx/eslint-plugin`** (NOT recommended as RED) | nrwl/nx `packages/eslint-plugin/...` @ `origin/23.0.x` (VENDORED) | none obvious - these files are heavily tested (spec files 700-1600 lines) and are refactoring targets, not behavior-gap targets | NO - natural next test = false green (already covered) [VERIFIED: disk - targets.json test_net] | jest | vendored | low but moot |
| **Second emilybache kata (e.g. Tennis)** (RECOMMEND: 1 discriminating target, needs vendoring) | a small scoring kata (0/15/30/40, deuce, advantage) | the increment sequence is a natural next-test chain; stresses test-list + triangulation + degenerate/starter case + behavior naming | LIKELY (verify the vendored variant leaves the scorer stubbed/incomplete so tests are assertion-red) | typically vitest/jest | one-time clone + `npm install` at the gate | MEDIUM-HIGH (well-known) |
| **User-nominated real production repo** (RECOMMEND: optional, user steers) | (user provides) | a genuine unimplemented feature / wrong edge case on an existing public API | must pass the qualification checklist below | must be Vitest/Jest | one-time `npm install` | ideally LOW |

### Qualification checklist for ANY target (run before the gate)
1. Small + Vitest/Jest + offline-vendorable (its `npm test` runs a single file quickly).
2. The target public API EXISTS and COMPILES (so the test is tsc-clean, not a compile error).
3. A specific behavior is wrong/missing such that a correct-behavior test FAILS on an ASSERTION (not compile, not false green) on CURRENT code.
4. The gap is a genuine bug / unimplemented feature, NOT a deliberate design choice (or the "red" is arguing with the maintainers).
5. Low contamination preferred (not a textbook example) - or contamination flagged so parity is read correctly.
6. Byte-identical short human prompt works (the target is nameable by path without leading the answer).
7. It stresses at least one RED-DISCIPLINE axis (classify-first / assert-observable-behavior / message-matrix-over-mock / coach-don't-drive-to-green).

### Recommendation (primary + backup)
- **Primary corpus (small, verified, mostly-vendored):** Gilded Rose `Conjured` as the anchor + correctness smoke target (verified genuinely-red; contamination-flagged -> expect parity here) PLUS one discriminating target the user confirms at the gate - either a second emilybache kata (Tennis, for test-list/triangulation/naming) or a user-nominated real repo passing the checklist. This mirrors the lz-refactor precedent (kata + a second repo) at D-03's ~2-3 targets x k=3.
- **Backup:** if no clean second real target is available at the gate, run the Gilded Rose anchor alone at k=3-5 across the three arms as a first round (it exercises the full instrument end-to-end and stresses classify-first + don't-touch-Item + assert-observable-behavior + coach-don't-drive-to-green), and defer additional targets to a later round - explicitly the same "first round + contingent later round" structure D-05 uses for the mattpocock arm.
- **Do NOT** build a synthetic-fixture "seeded-gap" module set as an EVAL target - that contradicts the user's real-OSS requirement. Synthetic fixtures belong ONLY in `fixtures/` for the offline classifier selfcheck (a separate, sanctioned use).

## Validation Architecture

> nyquist_validation is enabled (config.json workflow.nyquist_validation: true) [VERIFIED: disk]. This phase's "feature" is the eval instrument itself, so the validation maps each EVL-03 sub-criterion to the deterministic offline gate that proves it BEFORE the gated run. The instrument is Nyquist-covered when the full battery + the three new selfchecks exit 0 with zero spend and the repos left pristine.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Node ESM selfcheck scripts (assert-and-exit, no test framework) - the established workspace pattern (`selfcheck-code-review.mjs`, `grade-run.mjs --selfcheck`, `merge-judge.mjs --selfcheck`) [VERIFIED: disk] |
| Config file | none (scripts self-contained); the deterministic battery is `check-red-references.mjs` + `extract-samples.mjs` + the new selfchecks |
| Quick run command | `node .claude/skills/lz-red-workspace/selfcheck-red.mjs` (composition + base + parse + classifier crux) |
| Full suite command | `node grade-red.mjs --selfcheck && node tabulate-mechanical-red.mjs --selfcheck && node merge-judge.mjs --selfcheck && node selfcheck-red.mjs` (all exit 0, zero spend) |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| EVL-03.1 | Prompt byte-identical across arms except path; non-leading bodies | unit (dry-run argv) | `node selfcheck-red.mjs` (prompt-parity assertion) | Wave 0 |
| EVL-03.2 | 3 arms compose correctly (plugin-dir, slash-prefix) | unit (dry-run argv) | `node selfcheck-red.mjs` (composition crux) | Wave 0 |
| EVL-03.3 | Correctness classifier decides genuinely_red vs the 5 other classes | unit (fixtures) | `node grade-red.mjs --selfcheck` | Wave 0 |
| EVL-03.4 | Mechanical dims + Pass@k/Pass^k tabulate from meta + red-grade | unit (fixtures) | `node tabulate-mechanical-red.mjs --selfcheck` | Wave 0 |
| EVL-03.5 | Judge merge + fail-closed verify; oracle-reviewer wiring | unit | `node merge-judge.mjs --selfcheck` (reused) + judge-input emission check | exists (merge-judge); Wave 0 (emission) |
| EVL-03.6 | No plugins/lz-tdd dep; byproducts git-ignored; repos pristine | integration | `git status --porcelain` clean after selfcheck; grep plugins/lz-tdd unchanged | Wave 0 |
| EVL-03.7 | EVAL-RESULTS scaffold: Pass@k/Pass^k tables + reserved unbiased slot + substance-only headline | doc scaffold | manual review of the scaffold | Wave 0 |

### Sampling Rate
- **Per task commit:** the touched selfcheck (`node <script> --selfcheck`).
- **Per wave merge:** the full battery (`npm run check` + the three new selfchecks + `claude plugin validate .`).
- **Phase gate:** full battery GREEN + repos pristine + `plugins/lz-tdd` untouched, then HALT (no metered run) for `/gsd-validate-phase`.

### Wave 0 Gaps
- [ ] `grade-red.mjs` + its `--selfcheck` and `fixtures/{red,green,compile,collect,notest}/` - covers EVL-03.3 (the genuinely-new logic; author fixtures + classifier together as an instrument-first RED baseline).
- [ ] `tabulate-mechanical-red.mjs` + `--selfcheck` with a fixture `meta.json` + `red-grade.json` - covers EVL-03.4.
- [ ] `selfcheck-red.mjs` (composition + worktree base build/teardown + transcript parse + classifier crux + prompt-parity) - covers EVL-03.1/.2.
- [ ] The one `run-e2e.mjs` edit (skill-name parameterization off suite.json) + a regression assertion that the lz-refactor suites still compose unchanged.
- [ ] gitignore lines for the new suite's results tree (mostly covered by `.claude/skills/lz-red-workspace/**/results*/` and `**/run-*/`; add a `work/` line if the grader writes an in-workspace scratch dir - prefer os.tmpdir() worktrees so nothing lands in the tree). [VERIFIED: disk - .gitignore lines 50-52]
- [ ] EVAL-RESULTS.md scaffold (blank numbers, reserved unbiased-reviewer slot, substance-only headline structure) - the EVL-03.7 build artifact.

## Security Domain

> security_enforcement is not set in config.json (absent = enabled). This is a dev-only eval-harness phase (no shipped code changes), so most ASVS categories do not apply, but the harness DOES execute untrusted-ish code and holds a real, if low, threat surface worth one explicit note.

### Applicable ASVS categories
| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V5 Input Validation | partial | The grader parses model-produced diffs + runner JSON; parse defensively, fail-closed on garbled input (the rig already does - mustSucceed git ops, keyless-meta exit 1) [VERIFIED: disk] |
| V12 Files/Resources | yes | Per-run worktrees in os.tmpdir(); pristine reset + teardown; never operate on a protected branch (rig enforces) [VERIFIED: disk] |
| V2/V3/V4/V6 (auth/session/access/crypto) | no | No auth, no secrets, no network service; the harness is local |

### Known threat patterns for this harness
| Pattern | STRIDE | Standard mitigation |
|---------|--------|---------------------|
| Running model-generated test code + third-party OSS test suites with `--permission-mode bypassPermissions` in apply mode | Elevation of Privilege / Tampering | Runs are gated (no spend without approval); each run is a disposable worktree reset to `applyBase`; process-tree kill on timeout prevents surviving grandchildren racing the tree (rig has this) [VERIFIED: disk] |
| A grading step silently writing an empty diff and scoring "no change" | Tampering (false verdict) | The rig's `mustSucceed` on the diff capture throws rather than write an empty patch; grade-red must likewise fail-closed on an unreadable diff/run.json [VERIFIED: disk] |
| Public-repo hygiene leak in committed eval artifacts | Information Disclosure | RESEARCH.md + all committed artifacts stay email-free; allowlist-inversion scan in check-hygiene covers the workspace; per-run transcripts are git-ignored [VERIFIED: disk - AGENTS.md, .gitignore] |

## Sources

### Primary (HIGH confidence) - on-disk, read this session
- `.claude/skills/lz-refactor-workspace/e2e-nx/run-e2e.mjs` - the apply driver (arms, stream-json meta, synthetic base, Pass@k, safety rails). Read in full.
- `.claude/skills/lz-refactor-workspace/e2e-nx/selfcheck-code-review.mjs` - the offline zero-spend selfcheck pattern (3 cruxes).
- `.claude/skills/lz-refactor-workspace/e2e-angular/tabulate-mechanical.mjs` - mechanical dims + Pass@k tabulation.
- `.claude/skills/lz-red-workspace/{grade-run.mjs, EVAL-RESULTS.md, package.json, tsconfig.json}` - the Phase-20 grader (phrase-set-over-prose), the baseline record + substance-vs-vocabulary lesson, the pinned dev deps.
- `plugins/lz-tdd/skills/lz-red/SKILL.md` - the skill under test (coach procedure, the compiling-stub RED worked example).
- `.planning/milestones/lz-tdd@0.0.2-phases/13-*/13-RESULTS.md` - the apply-eval precedent (PARITY finding; differential behavior oracle).
- `D:/projects/github/emilybache/GildedRose-Refactoring-Kata/TypeScript/{app/gilded-rose.ts, test/vitest/gilded-rose.spec.ts, package.json, vitest.config.ts}` - verified the Conjured gap + runner setup.
- `.claude/skills/lz-refactor-workspace/e2e-nx/{suite.json, targets.json}` + `e2e-gilded-rose/{suite.json, README.md}` - suite/target config shape; nx targets are heavily-tested (poor RED).
- `.claude/agents/oracle-reviewer.md` - the clean-room authenticity gate contract.
- `.planning/{ROADMAP.md, REQUIREMENTS.md, STATE.md, config.json}` + `21-CONTEXT.md` - phase spec, config flags, history.

### Secondary (MEDIUM confidence) - web, verified against a canonical source
- WebSearch "Gilded Rose Conjured canonical requirement" - confirmed the Conjured spec is fully documented (Conjured Mana Cake; SellIn 6/Quality 5 -> 3; degrade 4 after sell-by; never below 0; don't touch Item) = HIGH contamination. Sources: [Codurance kata page](https://www.codurance.com/katas/gilded-rose), [kata-log.rocks](https://kata-log.rocks/gilded-rose-kata), [Codeheir walkthrough](https://codeheir.com/blog/2024/04/10/the-gilded-rose-refactoring-kata/).
- WebSearch "small TypeScript Vitest kata TDD repos" - candidate kata collections ([cesalberca/katas](https://github.com/cesalberca/katas), [ashleyfrieze/easy-tdd-typescript](https://github.com/ashleyfrieze/easy-tdd-typescript), [jellydn/learn-tdd-with-katas](https://github.com/jellydn/learn-tdd-with-katas)); no clean low-contamination real-OSS behavior gap surfaced (reinforces the D-01 steer-at-gate recommendation).

### Tertiary (LOW confidence) - training knowledge, flagged for build-time verification
- Vitest/Jest JSON reporter field shapes (A1) - verify against the pinned runner versions on the fixture selfcheck before relying on the classifier.

## Metadata

**Confidence breakdown:**
- Harness reuse (what stays / what changes): HIGH - run-e2e.mjs read in full; the arm design already matches D-04; the one edit is surgical.
- Correctness gate design (D-06 classifier): HIGH on the classification logic + the target-shape constraint it implies; MEDIUM on the exact runner-JSON field names (A1, verify on the fixture).
- Grading + dimensions (mechanical vs judge vs oracle): HIGH - grounded in Phase 13 (differential oracle) + Phase 20 (blind judge <=2 dims, substance-only, unbiased reviewer) + merge-judge on disk.
- OSS target selection (D-01): MEDIUM - the kata anchor is verified; the discriminating target is deliberately steer-at-gate (contamination + gap-scarcity are real).
- Build boundary + selfcheck (D-12): HIGH - the offline-crux pattern is proven in selfcheck-code-review.mjs; the new classifier crux is a direct extension.

**Research date:** 2026-07-22
**Valid until:** ~2026-08-21 for the harness/precedent findings (stable, on-disk). Verify runner-JSON shapes (A1) and re-confirm the chosen target's gap at the gate (targets can drift with upstream pulls).
