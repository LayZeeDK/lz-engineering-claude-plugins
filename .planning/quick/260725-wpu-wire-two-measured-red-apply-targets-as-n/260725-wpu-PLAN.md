---
phase: quick-260725-wpu
plan: 01
type: execute
wave: 1
depends_on: []
autonomous: true
requirements: [EVL-03.3]
files_modified:
  - .claude/skills/lz-red-workspace/grade-red.mjs
  - .claude/skills/lz-red-workspace/tabulate-mechanical-red.mjs
  - .claude/skills/lz-red-workspace/selfcheck-red.mjs
  - .claude/skills/lz-red-workspace/arm-anchor.mjs
  - .claude/skills/lz-red-workspace/e2e-red-ngx-layout/suite.json
  - .claude/skills/lz-red-workspace/e2e-red-ngx-layout/targets.json
  - .claude/skills/lz-red-workspace/e2e-red-ngx-layout/prompts/r1-next-test.md
  - .claude/skills/lz-red-workspace/e2e-red-srvx/suite.json
  - .claude/skills/lz-red-workspace/e2e-red-srvx/targets.json
  - .claude/skills/lz-red-workspace/e2e-red-srvx/prompts/r1-next-test.md
  - .claude/skills/lz-red-workspace/fixtures/canary-ngxa-red/
  - .claude/skills/lz-red-workspace/fixtures/canary-ngxa-compile/
  - .claude/skills/lz-red-workspace/fixtures/canary-ngxa-nocollect/
  - .claude/skills/lz-red-workspace/fixtures/canary-srvc-red/
  - .claude/skills/lz-red-workspace/fixtures/canary-srvc-compile/
  - .claude/skills/lz-red-workspace/e2e-red-gilded-rose/suite.json
  - .claude/skills/lz-red-workspace/e2e-red-gilded-rose/RUN-GATE.md

must_haves:
  truths:
    - "`run-e2e.mjs --suite <new suite>` composes all three arms with byte-identical prompts for both new targets, proved offline by selfcheck-red at zero spend."
    - "`grade-red --run` against a fabricated runDir returns a VERDICT (never a throw) with a real semver `runner_version` for EACH new target, using that target's own toolchain."
    - "The differential typecheck discriminates for EACH new target: a deliberately type-broken produced spec grades `compile_error` with `new_tsc_errors > 0` against a baseline where a clean spec grades `genuinely_red` with 0."
    - "`tabulate-mechanical-red.mjs` aggregates every `e2e-red-*` suite and fails closed when two suites would collide on one `target:pid|arm` cell key."
    - "`arm-anchor.mjs --verify` FAILS on an unarmed throwaway checkout and PASSES on an armed one; the armed snapshot is a COMMIT in the throwaway, so it can never appear in a captured `diff.patch`."
    - "`grade-red --run` against the GRC suite REFUSES to grade when `E2E_APPLY_BASE` is unset, so a forgotten export cannot silently grade the armed round against the unarmed base; every `red-grade.json` records the `apply_base` it used."
    - "All three borrowed repos end git-clean (no untracked files, no leftover worktree, no new named branch); `plugins/lz-tdd` has zero files in the diff."
    - "Zero metered spend: no `claude -p`, no eval fan-out, no `run-e2e.mjs` without `--dry-run`."
  artifacts:
    - .claude/skills/lz-red-workspace/e2e-red-ngx-layout/suite.json
    - .claude/skills/lz-red-workspace/e2e-red-ngx-layout/targets.json
    - .claude/skills/lz-red-workspace/e2e-red-ngx-layout/prompts/r1-next-test.md
    - .claude/skills/lz-red-workspace/e2e-red-srvx/suite.json
    - .claude/skills/lz-red-workspace/e2e-red-srvx/targets.json
    - .claude/skills/lz-red-workspace/e2e-red-srvx/prompts/r1-next-test.md
    - .claude/skills/lz-red-workspace/arm-anchor.mjs
    - "five fixture dirs: canary-ngxa-red, canary-ngxa-compile, canary-ngxa-nocollect, canary-srvc-red, canary-srvc-compile"
  key_links:
    - "`suite.requireExplicitApplyBase` -> `gradeRun` refuses before it creates anything when `E2E_APPLY_BASE` is unset; `red-grade.json.apply_base` is the audit trail."
    - "`runner_select` prefix map -> the PRODUCED test's repo-subdir-relative path (unchanged mechanism; new targets only add data)."
    - "`<reportFile>` placeholder in a runner command -> grade-red reads the report from that file instead of stdout, through the SAME `parseRunnerReport` fail-closed contract."
    - "`runner_path_base` -> the form of `<producedTestFile>` substituted into the runner command (ng `--include` is project-relative)."
    - "`typecheck.prebuild` -> runs in the grading worktree BEFORE the differential baseline, so srvx's `srvx` self-import resolves."
    - "`E2E_APPLY_BASE=<armed sha>` -> read by BOTH run-e2e.mjs and grade-red.mjs, so the armed anchor is the base for the apply run AND the grade."
---

<objective>
Wire two MEASURED RED apply targets as new eval suites and arm the Gilded Rose anchor.

- `ngbracket/ngx-layout` @ `daeb01f487b8f354199931489a9199d67d19182d` (Vitest 4.1.8 via `@angular/build:unit-test`) as the PRIMARY in-domain discriminator.
- `h3js/srvx` @ `55d90b39840a5bb7236e23c4e326ee4fc3842d57` (Vitest 4.1.10) as the out-of-domain control.
- The Gilded Rose approvals snapshot, armed inside the THROWAWAY checkout so "characterize first" stops being a defensible alternative answer.

Purpose: the RED apply instrument currently has exactly ONE target, a HIGH-contamination smoke anchor. Without a discriminator the metered round cannot measure lift, only ceiling.

Output: two new suite dirs, three small data-driven mechanisms in `grade-red.mjs`, multi-suite tabulation, four new fabricated-runDir canaries, an arming script with a discriminating selfcheck crux, and an updated RUN-GATE.

BUILD ONLY. The eval-run-approval-gate is CLOSED. No task here runs a metered command.
</objective>

<context>
@.planning/quick/260725-wpu-wire-two-measured-red-apply-targets-as-n/260725-wpu-TARGETS.md
@.claude/skills/lz-red-workspace/grade-red.mjs
@.claude/skills/lz-red-workspace/selfcheck-red.mjs
@.claude/skills/lz-red-workspace/tabulate-mechanical-red.mjs
@.claude/skills/lz-red-workspace/e2e-red-gilded-rose/suite.json
@.claude/skills/lz-red-workspace/e2e-red-gilded-rose/targets.json
@.claude/skills/lz-red-workspace/e2e-red-gilded-rose/RUN-GATE.md
@.claude/skills/lz-refactor-workspace/e2e-nx/run-e2e.mjs
@CLAUDE.md
@AGENTS.md
</context>

<design_decisions>

The six open questions, SETTLED. Do not re-litigate these; implement them.

**D-1. Topology: one suite dir per repo.** `suite.json` carries a single `repo` + `applyBase`, `run-e2e.mjs` is driven one `--suite` at a time, and RUN-GATE Step 6 already mandates one suite at a time. So: `e2e-red-ngx-layout/` and `e2e-red-srvx/` alongside `e2e-red-gilded-rose/`.

`tabulate-mechanical-red.mjs` keys cells `${target}:${pid}|${arm}` and currently hardcodes `SUITE_DIR = join(HERE, 'e2e-red-gilded-rose')`. Target ids are globally unique (`GRC`, `NGXA`, `SRVC`), so three suites aggregate into one table without collision -- but that is an invariant, not a guarantee, so the walk FAILS CLOSED on a duplicate `target:pid|arm` key arriving from two different suite dirs.

**D-2. `run-e2e.mjs` needs NO change.** Verified by reading it: the driver is fully suite-driven (`SUITE_DIR` from `--suite`; `repo`, `applyBase`, `protectedBranches`, `skillCommand`, `trackSkills`, `preambles`, `prompts` all off `suite.json`; `targets.json` for the file path). The scope fence's "if genuinely required" resolves to NOT required. Leave it byte-identical -- that is also the cheapest guarantee of no lz-refactor regression.

**D-3. Runner selection: reuse `runner_select`, unchanged.** It already keys on the PRODUCED test's repo-subdir-relative path (longest prefix first, `runner_default` fallback). Selection therefore reflects where the produced test actually landed, which is the honesty property the field was built for. New targets only add DATA:

| target | `runner_select` | `runner_default` |
|--------|-----------------|------------------|
| NGXA | `{"projects/libs/flex-layout/": "vitest"}` | `vitest` |
| SRVC | `{"test/": "vitest"}` | `vitest` |

The runner NAME must stay a real package name (`vitest`) because `readRunnerVersion` reads `node_modules/<runnerName>/package.json`; both targets ship vitest, so `runner_version` is a real semver even though ngx-layout invokes it through `ng test`. A `runner_default` is set (rather than omitted) so a spec that lands outside the collection root grades `no_tests` honestly instead of throwing.

**D-4. Per-target runner and typecheck config: three small data-driven mechanisms in `grade-red.mjs`.** No target name appears in code.

1. `<reportFile>` placeholder in a runner command. When present, grade-red substitutes a temp path (forward slashes), runs, then feeds `{ ...runRes, stdout: <file contents or ''> }` to the EXISTING `parseRunnerReport`. Every fail-closed rule survives untouched: empty report + non-zero exit + the runner's own anchored no-collect line still yields `no_tests`; empty report + exit 0 still throws. This is required for ngx-layout, where `ng test` interleaves Angular build output on stdout and `parseRunnerJson`'s outermost-brace extraction would slice garbage. `gradeFixture` already reads vitest's `--outputFile`, so this is the same idea in the real gate.
2. `runner_path_base` on the runner spec. `ng test --include` is PROJECT-relative, while the produced test path is repo-relative. `runner_path_base: "projects/libs/flex-layout"` makes the `<producedTestFile>` substitution project-relative. `runner_select` keeps keying on the UNSTRIPPED path, so selection semantics do not move.
3. `typecheck: { args: [...], prebuild: "..." }` on the target. Default when absent: `["--noEmit", "--strict"]` and no prebuild -- so GRC is byte-identical. NGXA sets `args` to add `-p projects/libs/flex-layout/tsconfig.spec.json`. SRVC sets `prebuild: "npm run build"` because its `srvx` self-import resolves through an unbuilt `dist/`; without the build a produced test that imports the public API manufactures its own NEW `TS2307` and grades a false `compile_error`. The prebuild runs once, in the grading worktree, after the toolchain copy and BEFORE the differential baseline, and FAILS CLOSED on a non-zero exit.

**D-5. Prompt leading-ness, decided per target.**

- **NGXA: file path + the written contract, nothing else.** The prompt names `layout-align.ts` and the API doc that declares the behavior. That is the same information a developer opening the ticket would have; the model must still find which axis has no code path. Naming the contract is what TARGETS.md's contamination argument already assumes, and it converts "invent a requirement" runs into a real signal.
- **SRVC: name the SYMPTOM.** `sendNodeResponse` is unguessable from the path alone, so the prompt describes the observable failure (a cookie set on `res` disappears from what the client receives). The symptom is the bug REPORT. What this eval grades is the test's DESIGN -- a real server plus a real `fetch` versus a fabricated `vi.fn()` double -- and the symptom does not hint at that at all. `writeHead`, `getHeaders`, `rawHeaders`, the merge, `FastResponse` and the fast path stay out.

Both prompts stay byte-identical across arms (composition adds only the shared apply preamble and, on `invoke_skill`, the slash prefix), both name their pinned `test_dir`, and both are guarded by a new per-target `prompt_forbidden_tokens` list asserted by crux 2.

**D-6. Anchor arming: commit inside the throwaway, drive with `E2E_APPLY_BASE`.**

`run-e2e.mjs` captures with `git add -A` then `git diff --cached <APPLY_BASE>`, and resets `--hard <APPLY_BASE>` + `clean -fd` between runs. Consequences:

- Leaving the snapshot UNTRACKED puts it in the captured diff and in `changed_files` -- attribution poison.
- `.git/info/exclude` would hide it from `git add -A` and survive `clean -fd` (no `-x`), but it would ALSO hide any snapshot the MODEL writes. That is a measurement hole in the direction that matters, so it is rejected.
- Committing it makes it part of the base: invisible to the diff by construction, restored exactly by each inter-run reset, and a model-written snapshot change still shows up. It also matches what the kata maintainer already did in the sibling `TypeScript-deno` variant.

The commit makes HEAD ahead of `main`, which `run-e2e.mjs` refuses (it will not orphan commits). Both `run-e2e.mjs` and `grade-red.mjs` already read `process.env.E2E_APPLY_BASE || suite.applyBase`, so the arming step prints the armed SHA and RUN-GATE tells the operator to export it. The throwaway is detached (`git worktree add --detach`), so no named branch lands on the borrowed kata and the armed commit is unreachable after teardown.

**The two steps do NOT fail the same way, and the difference is the whole risk.** Forgetting the export on the DRIVE is loud -- `run-e2e.mjs` computes `rev-list APPLY_BASE..HEAD` and throws. Forgetting it on a later `grade-red.mjs --run` was SILENT: `gradeRun` has no ahead-check and no protected-branch check, it simply builds a worktree at whatever base it resolved, so the armed round would have been graded against unarmed `main` with no signal at all. RUN-GATE documents driving and grading as separate commands, which makes that an ordinary operator slip rather than an exotic one. Task 4 therefore adds a real guard (`requireExplicitApplyBase` on the suite) instead of only documenting the hazard; the correction to the earlier framing is itself a required RUN-GATE edit.

`arm-anchor.mjs` owns the mechanics and the verification; RUN-GATE gains it as step `3a3`, between the toolchain install (`3a2`) and driving the suite. The UNVERIFIED "vitest 0.28 auto-writes and passes" assumption is verified by MEASUREMENT in Task 4 (run the approvals spec bare, record what happens), while the script itself writes with the explicit update flag and then proves the armed state with a plain re-run -- so the arming does not depend on the assumption either way.

**D-7 (bonus, from the brief). srvx's two pre-existing environmental failures are already tolerated.** `test/log.test.ts` (da-DK locale) and `test/cli.test.ts` (port timeout) fail on this machine, but the gate runs ONLY the produced test file (`npx vitest run <producedTestFile>`), so neither is ever collected, and `classify()` reads `testResults[0]` -- the single file it ran. The differential typecheck is likewise unaffected: both files are type-clean and appear identically in both runs. No change needed; record the reasoning in the suite's `targets.json` so a future reader does not re-derive it.

</design_decisions>

<constraints_restated>
- Modify ONLY `.claude/skills/lz-red-workspace/**` and the repo-root `.gitignore`. NEVER `plugins/lz-tdd/**`. `run-e2e.mjs` stays byte-identical (D-2).
- HARD ZERO SPEND. No `claude -p`. `run-e2e.mjs` may be invoked ONLY with `--dry-run` (that is what selfcheck-red does).
- The three borrowed repos are READ-ONLY and must end git-clean. Use `--detach` for any worktree; never create a named branch on them.
- One logical change per commit, relevant verify BEFORE each commit, never commit a knowingly-red state.
- Stage files BY NAME. Never `git add .` / `-A` / `-u` in THIS repo.
- ASCII only, in every file and every commit message. Search with `git grep` or `rg`, never standalone `grep`; filter pipes with `rg`.
- `selfcheck-red.mjs` grows from ~70 s to SEVERAL MINUTES once the ngx-layout canaries land (each copies ~1.4-1.6 GB). The Bash tool's `timeout` is capped at 600000 ms, which is too tight to rely on, so from Task 2 onward run it with `run_in_background: true` and WAIT for the completion notification. Never skip it, never narrow it to make it finish sooner.
- In a fresh worktree run `npm ci --prefix .claude/skills/lz-red-workspace` first; its `node_modules` is gitignored and the selfchecks fail on vitest resolution without it.
</constraints_restated>

<tasks>

<task type="auto">
  <name>Task 1: Per-target runner + typecheck config in grade-red, and multi-suite tabulation</name>
  <files>.claude/skills/lz-red-workspace/grade-red.mjs, .claude/skills/lz-red-workspace/tabulate-mechanical-red.mjs</files>
  <action>
Two commits, both instrument-generic, both provable offline against the WORKSPACE toolchain with no borrowed repo involved.

COMMIT 1 -- `feat(red): per-target runner and typecheck configuration in grade-red`.

Implement the three mechanisms from D-4 in `grade-red.mjs`. Every one is optional and absent-by-default, so the GRC suite's behavior must not move.

(a) Export a pure `relativeToBase(testPath, base)`: returns `testPath` with a leading `base + '/'` stripped, and returns `testPath` unchanged when `base` is empty or is not a prefix. Trim trailing slashes off `base` first.

(b) Export a pure `substituteRunnerCmd(template, { testPath, reportFile })`: replaces `<producedTestFile>` with `testPath` and `<reportFile>` with `reportFile` normalised to forward slashes (a Windows temp path carries backslashes, and a backslash inside a shell string is an escape). Leave a template that has no `<reportFile>` untouched.

(c) Export a pure `resolveTypecheck(target)`: returns `{ args, prebuild }` where `args` is `target.typecheck.args` when it is a non-empty array and `['--noEmit', '--strict']` otherwise, and `prebuild` is `target.typecheck.prebuild` or `null`. An empty array must fall back to the default -- a config typo must not silently disable clause 1 of D-06.

(d) In `gradeRun`: compute `pathBase` from `runnerSpec.runner_path_base`, derive `testForTemplate = relativeToBase(testForRunner, pathBase)`, and build `cmd` via `substituteRunnerCmd`. `selectRunner` KEEPS receiving the unstripped `testForRunner` -- selection semantics must not move. Record `runner_test_path: testForTemplate` in `red-grade.json` so an operator can see what the command actually received.

(e) In `gradeRun`: when the template contains `<reportFile>`, allocate a temp path under `os.tmpdir()` (same pid/timestamp/random shape as `gradeFixture` uses), run the command, then read the file (empty string when it is missing) and call `parseRunnerReport({ ...runRes, stdout: fileText })`. Remove the temp file in a `finally`. When the template has no placeholder, the existing `parseRunnerReport(runRes)` call stands. Spreading `runRes` is load-bearing: `status`, `stderr` and `error` must reach `parseRunnerReport` unchanged or the no-collect and infrastructure-failure branches stop working.

(f) In `gradeRun`: resolve `{ args, prebuild }` via `resolveTypecheck(target)` and use `args` where the hardcoded `['--noEmit', '--strict']` is today. When `prebuild` is set, run it with `shell: true` in `armCwd` AFTER `provisionToolchain()` and the zero-produced-tests early return, and BEFORE the baseline typecheck; throw a fail-closed error naming the command and its stderr on a non-zero exit. Record `prebuild_ms` in `red-grade.json` (0 when there is no prebuild), alongside the existing `toolchain_ms`.

(g) Extend `runSelfcheck()` with pure assertions for each mechanism -- each must FAIL if its mechanism is deleted: `relativeToBase` strips an exact prefix, leaves a non-prefix alone, and leaves the path alone for an empty base; `substituteRunnerCmd` emits forward slashes for a backslashed temp path and leaves a placeholder-free template byte-identical; `resolveTypecheck` returns the default for an absent config, for an empty array, and returns the target's own args when present. Keep every existing assertion.

COMMIT 2 -- `feat(red): tabulate every RED suite, fail closed on a colliding cell`.

In `tabulate-mechanical-red.mjs`, replace the hardcoded `SUITE_DIR` with a `discoverSuiteDirs(root = HERE)` that returns, sorted, every direct child directory whose name starts with `e2e-red-` and that contains a `suite.json`. `main()` walks each suite's `results/apply`, aggregates ALL runs into ONE printed table, and writes each suite's own cells to that suite's own `mechanical-red.json` -- so with a single suite present the output is exactly what it is today.

Add the collision guard: while walking, map each `${target}:${pid}|${arm}` cell key to the suite dir that produced it, and throw a fail-closed error naming BOTH suite dirs if a second suite produces a key that already exists. Two repos merged into one cell is a silently wrong number, which is the class of defect this file's fail-closed contract exists to prevent.

Extend `--selfcheck` with a discriminating multi-suite case: build a throwaway root under `os.tmpdir()` holding TWO fake suite dirs, each with a `suite.json` and one captured run (`results/apply/<arm>/<pid>/run-1/{meta.json,red-grade.json}` reusing the existing fixture shapes, with different target ids); assert discovery finds both, the aggregate has both cells, and that a third suite reusing the first suite's target id throws. Remove the throwaway root afterwards. This fails against the pre-change single-suite code, which is the point.
  </action>
  <verify>
    <automated>node .claude/skills/lz-red-workspace/grade-red.mjs --selfcheck &amp;&amp; node .claude/skills/lz-red-workspace/selfcheck-red.mjs &amp;&amp; node .claude/skills/lz-refactor-workspace/e2e-nx/selfcheck-code-review.mjs &amp;&amp; git diff --name-only -- .claude/skills/lz-refactor-workspace/e2e-nx/run-e2e.mjs plugins/lz-tdd | rg . ; test $? -eq 1</automated>
    <automated>node .claude/skills/lz-red-workspace/tabulate-mechanical-red.mjs --selfcheck &amp;&amp; node .claude/skills/lz-red-workspace/merge-judge.mjs --selfcheck &amp;&amp; node .claude/skills/lz-red-workspace/selfcheck-red.mjs</automated>
  </verify>
  <done>The FIRST automated line runs and passes before commit 1 is made, the SECOND before commit 2 -- these are per-commit gates, not one end-of-task batch, per the bisect-safety rule. Both selfchecks exit 0 with the new assertions printing; `selfcheck-red.mjs` still exits 0 including the unchanged GRC crux 7; `run-e2e.mjs` and `plugins/lz-tdd` have zero uncommitted changes at each gate; two atomic commits landed.</done>
</task>

<task type="auto">
  <name>Task 2: Wire the ngx-layout suite (primary discriminator)</name>
  <files>.claude/skills/lz-red-workspace/e2e-red-ngx-layout/suite.json, .claude/skills/lz-red-workspace/e2e-red-ngx-layout/targets.json, .claude/skills/lz-red-workspace/e2e-red-ngx-layout/prompts/r1-next-test.md, .claude/skills/lz-red-workspace/fixtures/canary-ngxa-red/, .claude/skills/lz-red-workspace/fixtures/canary-ngxa-compile/, .claude/skills/lz-red-workspace/fixtures/canary-ngxa-nocollect/, .claude/skills/lz-red-workspace/selfcheck-red.mjs</files>
  <action>
ONE commit -- `feat(red): ngx-layout RED apply suite (primary discriminator)`.

MEASURE FIRST, then write. All of this is offline and free.

1. Take the repo path from git itself, verbatim:

   `git --git-dir=D:/projects/github/LayZeeDK/ngbracket__ngx-layout/.git --work-tree=D:/projects/github/LayZeeDK/ngbracket__ngx-layout rev-parse --show-toplevel`

   Paste THAT string into `suite.json.repo`. A path-form mismatch is refused by `resolveArmCwd`, so getting it from git is the fix, not a nicety. **`--work-tree` is MANDATORY here.** With `--git-dir` alone git resolves the work tree from CWD, so the command returns whatever repo the executor happens to be standing in -- reproduced: from this project root it returns `D:/projects/github/LayZeeDK/lz-engineering-claude-plugins`, and from a temp dir it returns that temp dir. That would silently put THIS repo's path in the foundational `repo` field. Verified correct with `--work-tree`: it returns `D:/projects/github/LayZeeDK/ngbracket__ngx-layout`. (`cd` into the target repo first is the equally valid alternative.)
2. Confirm the pin object exists locally: `git --git-dir=<...>/.git cat-file -t daeb01f487b8f354199931489a9199d67d19182d` prints `commit`. (Already verified during planning; re-confirm because it is one command and the whole suite rests on it. The checkout's own HEAD is a DESCENDANT of the pin on a feature branch -- that is fine and expected; the suite pins the commit, not the branch.)
3. Measure the JSON report path: in a THROWAWAY detached worktree of the pin, with the toolchain in place, run the target's runner asking for the JSON reporter into a file, and confirm the file parses and carries `testResults[0].assertionResults[].title`. The builder schema exposes `reporters` (with a `json` entry) and `outputFile`, so the command shape is `npx ng test @ngbracket/ngx-layout --include "**/<project-relative spec path>" --reporters json --outputFile "<abs path>"`. If the emitted shape is NOT the Jest-compatible one `classify()` reads, STOP and report it -- do not paper over it; that is a genuine blocker for this target and the plan needs revising, not the classifier.
4. Measure the toolchain-copy cost. This checkout's `node_modules` is 1.6 GB across 186,366 files versus the kata's 142.8 MB / 7,610, so the per-grade disposable copy will be roughly 20-30x the kata's ~3.4 s. Record the REAL `toolchain_ms` from the canary in Task 5's RUN-GATE edit; it is a spend/wall-clock input for the gated round, and hiding it would misprice the fan-out.

Then author the suite.

`suite.json`: `name` `red-ngx-layout`; `repo` from step 1; `applyBase` the full pin SHA; `protectedBranches` `["main", "master"]`; `skillCommand` `/lz-tdd:lz-red`; `trackSkills` `["lz-red", "lz-tpp"]`; `preambles.apply` copied BYTE-IDENTICALLY from `e2e-red-gilded-rose/suite.json` (all RED suites share one apply preamble; crux 2 will assert that); one prompt `{ "id": "r1", "file": "r1-next-test.md", "target": "NGXA", "code": true }`.

`targets.json`: one target `NGXA`.
- `file`: `projects/libs/flex-layout/flex/layout-align/layout-align.ts`; `symbol`: `LayoutAlignStyleBuilder.buildStyles`.
- `runner`: `vitest` -> the `ng test` command from step 3 written with the `<producedTestFile>` and `<reportFile>` placeholders; `runner_select` `{"projects/libs/flex-layout/": "vitest"}`; `runner_default` `"vitest"`; `runner_path_base` `"projects/libs/flex-layout"`.
- `typecheck.args`: `["--noEmit", "--strict", "-p", "projects/libs/flex-layout/tsconfig.spec.json"]`.
- `test_dir`: `projects/libs/flex-layout/flex/layout-align/`.
- `behavior_gap`, `red_shape_rationale`, `expected_red_color` (`genuinely_red`), `contamination` (`HIGH`) with the earned justification from TARGETS.md (the specific lines are pre-fork Angular-team artifacts with a public discussion trail; accepted because the eval does not ask the model to DISCOVER the defect, and prior knowledge only strengthens the pull to just implement the fix, which is the discipline under test).
- A `committed_false_green_note` recording the live trap: the file's only existing test for this value is main-axis and its single assertion sits behind a platform guard that is false under jsdom, so it executes zero assertions and always passes. A run that "fixes" that test instead of writing the missing one is a coach-don't-drive signal, not a gate artifact.
- A `house_helper_note` recording the free grading axis: the file's assertion helper collapses to a boolean, so a helper-based assertion yields an opaque message while a direct style lookup yields a diagnostic one. Both are legitimately red; only one is a good test. That is a judge dimension, not a D-06 one.
- `discipline_traps`, `axis`, and `prompt_forbidden_tokens` (see below).

`prompts/r1-next-test.md`, exactly one line, no trailing prose:

`What's the next failing test you'd write for `projects/libs/flex-layout/flex/layout-align/layout-align.ts`? Its documented API is `projects/apps/docs/documentation/docs/fx-flex/fxLayoutAlign-API.md`. Go ahead and add it under `projects/libs/flex-layout/flex/layout-align/`.`

`prompt_forbidden_tokens` for NGXA: the CSS distribution value at issue, `cross axis`, `cross-axis`, `align-content`, `align-items`, `switch`, `stretch`, `default case`, and the two wired sibling values.

The check path must be a PURE exported helper -- `forbiddenTokensIn(prompt, tokens)` returning the tokens it found, case-insensitively -- so it can be driven in both directions. A positive-only assertion passes trivially today and would keep passing with a case-folding bug, an empty token list, or a matcher wired to the wrong field, which is precisely the class of silent failure the rest of this plan refuses to ship.

FIXTURES. Build THREE fabricated runDirs mirroring `fixtures/canary-rundir/`, `fixtures/canary-compile/` and `fixtures/canary-nocollect/`: a `meta.json` (target `NGXA`, `prompt_id` `r1`, an arm, `run_idx`, and `changed_files` naming the produced spec at its repo-relative path) plus a `diff.patch` that creates that spec as a new file.
- `canary-ngxa-red`: the MEASURED disciplined test -- a direct style lookup asserting the documented cross-axis value -- which is tsc-clean and fails on an assertion. Expect `genuinely_red`, `pass: true`, `new_tsc_errors` 0, `runner` `vitest`, a semver `runner_version`, the added title extracted, and `attributed_failures` 1.
- `canary-ngxa-compile`: the same shape with ONE deliberate type error. Expect `compile_error`, `pass: false`, `new_tsc_errors > 0`. This is the negative control that proves the `-p tsconfig.spec.json` differential still tells two inputs apart; without it nothing would notice the typecheck ceasing to discriminate.
- `canary-ngxa-nocollect`: the produced spec placed OUTSIDE the collection root, exactly as the GRC `canary-nocollect` fixture does. Expect a VERDICT of `no_tests` with `pass: false`, never a throw. This one is REQUIRED rather than nice-to-have: the `<reportFile>` override feeds `parseRunnerReport` a synthesised `stdout` and DISCARDS the real spawn's stdout, and the no-collect fail-closed contract was only ever pinned against bare jest and vitest, where the status line lands on stderr with a 0-byte stdout. Whether the Angular wrapper puts its own no-collect signal somewhere the override drops is UNVERIFIED. If this canary throws instead of grading, the override's fail-closed contract does not hold for this runner -- report it rather than loosening `parseRunnerReport`, which is load-bearing for every suite.

The red canary is also the discriminating check for BOTH new grade-red mechanisms: strip `runner_path_base` and the `--include` glob matches nothing so the grade becomes `no_tests`; drop `<reportFile>` support and Angular's build output on stdout defeats the outermost-brace extraction.

SELFCHECK. Generalise `selfcheck-red.mjs` rather than duplicating it:
- add a `discoverRedSuites()` sibling of the tabulator's discovery (or a tiny shared helper) and make crux 2 LOOP over every RED suite and every prompt in it: three arms compose, no_skill and with_skill are byte-identical, invoke_skill is the prefix plus with_skill, no test-state claim, the prompt names its target's `test_dir`, and `forbiddenTokensIn(composedPrompt, target.prompt_forbidden_tokens)` is EMPTY. Assert additionally that every RED suite declares the SAME apply preamble bytes.
- add the DISCRIMINATING half, per suite, in the same loop: feed a deliberately POISONED prompt -- the real composed prompt with one token from that target's own list appended, in a different letter case -- through the SAME helper and assert it comes back NON-EMPTY and naming that token. This is what proves the matcher works rather than that the list is unreachable. A target that declares an empty list must FAIL this crux, so the list itself cannot be quietly emptied.
- parameterise `gradeFabricatedRunDir` by suite dir, keep the existing SKIP-if-the-repo-or-node_modules-is-absent discipline, and register the three NGXA canaries.
- keep every existing GRC assertion and crux 6 untouched.

Gitignore: the existing lz-red globs were checked at plan time and ALREADY cover both new suite dirs, so expect to add nothing. Confirm rather than assume, and add only if a `results/` or `mechanical-red.json` path shows up in `git status --porcelain`.

**Run `selfcheck-red.mjs` with `run_in_background: true` and WAIT for the completion notification.** Three NGXA canaries each copy this checkout's `node_modules` -- roughly 1.4-1.6 GB across ~190k-230k entries depending on how they are counted, about 30x the kata's file count -- so this crux alone runs for minutes and the whole battery lands in the several-minute range. The Bash tool's `timeout` parameter is capped at 600000 ms, which is now uncomfortably close; background execution has no cap and is the required method. Do NOT skip the battery, and do NOT narrow it to make it finish sooner.
  </action>
  <verify>
    <automated>node .claude/skills/lz-red-workspace/selfcheck-red.mjs</automated>
    <automated>node .claude/skills/lz-red-workspace/grade-red.mjs --selfcheck &amp;&amp; node .claude/skills/lz-red-workspace/check-evals.mjs</automated>
    <automated>git --git-dir=D:/projects/github/LayZeeDK/ngbracket__ngx-layout/.git --work-tree=D:/projects/github/LayZeeDK/ngbracket__ngx-layout status --porcelain | rg . ; test $? -eq 1</automated>
    <automated>git --git-dir=D:/projects/github/LayZeeDK/ngbracket__ngx-layout/.git worktree list | rg -c . | rg '^1$'</automated>
  </verify>
  <done>`selfcheck-red.mjs` exits 0 with crux 2 covering two suites in both directions (real prompt clean, poisoned prompt caught) and crux 7 printing three NGXA canaries -- `genuinely_red` with a real `runner` and semver `runner_version`, `compile_error` with `new_tsc_errors > 0`, and `no_tests` as a verdict rather than a throw; the ngx-layout checkout is git-clean with exactly one worktree entry and no new branch; the measured per-grade toolchain copy time is recorded for Task 5; one atomic commit.</done>
</task>

<task type="auto">
  <name>Task 3: Wire the srvx suite (out-of-domain control)</name>
  <files>.claude/skills/lz-red-workspace/e2e-red-srvx/suite.json, .claude/skills/lz-red-workspace/e2e-red-srvx/targets.json, .claude/skills/lz-red-workspace/e2e-red-srvx/prompts/r1-next-test.md, .claude/skills/lz-red-workspace/fixtures/canary-srvc-red/, .claude/skills/lz-red-workspace/fixtures/canary-srvc-compile/, .claude/skills/lz-red-workspace/selfcheck-red.mjs</files>
  <action>
ONE commit -- `feat(red): srvx RED apply suite (out-of-domain control)`.

FIRST, leave the borrowed repo clean. It currently carries four untracked leftovers from the verification pass: three scratch spec files and a generated `package-lock.json`. DELETE all four. Rationale to record in the suite: the repo ships only a pnpm lockfile, so there is no tracked npm lockfile to copy into a throwaway; keeping a generated one in the borrowed tree would leave it permanently dirty. RUN-GATE therefore tells the operator to `npm install` in the throwaway (measured: exit 0, 33 s, 478 packages, arm64 bindings present and executing) and to keep the resulting lockfile inside the throwaway only. The pristine checkout's `node_modules` stays -- it is gitignored and it is what `grade-red` copies from.

MEASURE, then write. All offline.

1. `git --git-dir=D:/projects/github/h3js/srvx/.git --work-tree=D:/projects/github/h3js/srvx rev-parse --show-toplevel` -- paste that exact string into `suite.json.repo`. **`--work-tree` is MANDATORY** for the reason spelled out in Task 2 step 1: without it git resolves the work tree from CWD and returns the wrong repo entirely (reproduced for this repo too). Verified correct with it: `D:/projects/github/h3js/srvx`.
2. In a THROWAWAY detached worktree at the pin, with a toolchain: confirm `npm run build` exits 0, and confirm the differential typecheck ARGS discriminate -- baseline clean-ish after the build, and a deliberately type-broken spec under `test/` adds a NEW error. If the produced spec is NOT part of the tsc program under those args (nothing new appears), STOP and report: a typecheck that cannot see the produced test makes D-06 clause 1 vacuous for this target.
3. Confirm the runner command shape: `npx vitest run <spec> --typecheck.enabled=false --reporter=json --outputFile "<abs path>"`. The `--typecheck.enabled=false` flag MATTERS -- `vitest.config.mjs` sets `typecheck: { enabled: true }`, and leaving it on turns type diagnostics into test failures and muddies the classifier.

Then author the suite, mirroring Task 2's structure.

`suite.json`: `name` `red-srvx`; `repo` from step 1; `applyBase` the full pin SHA `55d90b39840a5bb7236e23c4e326ee4fc3842d57`; the same `protectedBranches`, `skillCommand`, `trackSkills`, and the BYTE-IDENTICAL shared apply preamble; one prompt targeting `SRVC`.

`targets.json`: one target `SRVC`.
- `file`: `src/adapters/_node/send.ts`; `symbol`: `sendNodeResponse`.
- `runner`: `vitest` -> the step-3 command with the `<producedTestFile>` and `<reportFile>` placeholders; `runner_select` `{"test/": "vitest"}`; `runner_default` `"vitest"`. No `runner_path_base` (the repo IS its git root and vitest takes a repo-relative path).
- `typecheck`: `{ "args": ["--noEmit", "--strict", "--skipLibCheck"], "prebuild": "npm run build" }` with a note that the prebuild exists because the package self-reference resolves through a gitignored `dist/`, so an unbuilt worktree manufactures a NEW module-resolution error for any produced test that imports the public API -- a false `compile_error` that would look like a model failure. Note too that the RUNNER does not need the build (the vitest config aliases the self-reference at the source), so the prebuild is a typecheck-only cost.
- `test_dir`: `test/`.
- `behavior_gap`: headers set earlier on the Node response are not merged into what is passed to `writeHead`, so a previously-set cookie is dropped; the SAME defect exists on the fast path, so a run that patches only one path is a root-cause-versus-symptom signal.
- `expected_red_color` `genuinely_red`; `contamination` `LOW` with the one caveat (a closed-unmerged fix PR exists upstream, so a web-searching model could find the attempt).
- A `mock_has_no_diagnostic_power_note` recording the strongest measured property in the whole search: the naive fabricated double is green BEFORE and AFTER a correct fix, because it never implements the header getter so the merge branch is skipped entirely. Also record the caveat that a variant double which DOES implement it stays green at the pin but goes red after a fix -- mock brittleness, not detection -- so if a post-fix signal is ever scored, choose deliberately which one.
- An `environmental_failures_note` recording D-7: two test files fail on this machine for environmental reasons (a locale-dependent time format and a port-allocation timeout). The gate runs only the produced test file and `classify()` reads `testResults[0]`, so neither is ever collected; the differential typecheck sees them identically in both runs. No tolerance mechanism is needed -- this is why.
- `discipline_traps`, `axis`, `prompt_forbidden_tokens`.

`prompts/r1-next-test.md`, exactly one line:

`A middleware sets a cookie on the Node `res`, then we send a web `Response`, and the cookie is gone from what the client receives. What's the next failing test you'd write for `src/adapters/_node/send.ts`? Go ahead and add it under `test/`.`

`prompt_forbidden_tokens` for SRVC: the header-writing API name, the header-getter name, the header-setter name, `rawHeaders`, `merge`, the fast-path response class name, `fast path`, the internal fast-path helper name, and the exported function name. Crux 2's loop picks this suite up automatically, INCLUDING the poisoned-prompt half added in Task 2 -- so the list must be non-empty and every token must genuinely be absent from the prompt, or the crux fails.

FIXTURES. Two fabricated runDirs, same shape as Task 2's.
- `canary-srvc-red`: the MEASURED disciplined test -- a real server plus a real `fetch`, asserting on the response's own set-cookie accessor -- which fails on an assertion. It MUST import from the package's public entry point, because that is exactly what makes it the discriminating check for the prebuild: without `typecheck.prebuild` the import does not resolve and the grade flips to `compile_error`. Expect `genuinely_red`, `pass: true`, `new_tsc_errors` 0, `runner` `vitest`, a semver `runner_version`, `attributed_failures` 1.
- `canary-srvc-compile`: the same shape with one deliberate type error. Expect `compile_error`, `new_tsc_errors > 0`.

SELFCHECK: register the two SRVC canaries with the crux 7 helper already parameterised in Task 2; crux 2's loop, in BOTH directions, picks the new suite up automatically via discovery. Gitignore: the existing globs were checked at plan time and already cover this suite dir -- confirm via `git status --porcelain`, add nothing otherwise.

Run `selfcheck-red.mjs` with `run_in_background: true` and WAIT for the completion notification. The battery now carries the three ngx-layout canaries from Task 2 as well, so it runs for minutes; the Bash tool's `timeout` is capped at 600000 ms and background execution is not. Do not narrow the battery to make it finish sooner.
  </action>
  <verify>
    <automated>node .claude/skills/lz-red-workspace/selfcheck-red.mjs</automated>
    <automated>node .claude/skills/lz-red-workspace/tabulate-mechanical-red.mjs --selfcheck &amp;&amp; node .claude/skills/lz-red-workspace/check-evals.mjs</automated>
    <automated>git --git-dir=D:/projects/github/h3js/srvx/.git --work-tree=D:/projects/github/h3js/srvx status --porcelain | rg . ; test $? -eq 1</automated>
    <automated>git --git-dir=D:/projects/github/h3js/srvx/.git worktree list | rg -c . | rg '^1$'</automated>
  </verify>
  <done>`selfcheck-red.mjs` exits 0 with crux 2 covering all three suites and crux 7 printing an SRVC `genuinely_red` canary and an SRVC `compile_error` canary with `new_tsc_errors > 0`; the srvx checkout is git-clean (all four leftovers gone) with one worktree entry; one atomic commit.</done>
</task>

<task type="auto">
  <name>Task 4: Arm the Gilded Rose approvals snapshot in the throwaway checkout</name>
  <files>.claude/skills/lz-red-workspace/arm-anchor.mjs, .claude/skills/lz-red-workspace/selfcheck-red.mjs, .claude/skills/lz-red-workspace/grade-red.mjs, .claude/skills/lz-red-workspace/e2e-red-gilded-rose/suite.json</files>
  <action>
ONE commit -- `feat(red): arm the Gilded Rose approvals snapshot in the throwaway checkout`.

MEASURE the flagged-unverified assumption FIRST and record the result in the script's header comment. In a throwaway detached worktree of the kata WITH a toolchain, run the approvals spec bare (no update flag, no CI flag) and record exactly what happens: whether the missing snapshot is auto-written, whether the run passes, and the runner version that did it. That is the assumption TARGETS.md flags as documentation-derived; it now becomes a measured line in the script. Note alongside it that CI mode refuses to write new snapshots, so the arming step must never run under it.

Write `arm-anchor.mjs`, a small CLI over ONE throwaway checkout path. It NEVER touches the pristine kata; refuse to run when the given path resolves to the suite's own `repo`.

`node arm-anchor.mjs --arm <throwaway checkout>`:
1. Refuse unless the checkout is at a DETACHED HEAD (a named branch on the borrowed repo is out of bounds) and its worktree is clean.
2. Run the approvals spec with the runner's EXPLICIT snapshot-update flag. Writing explicitly rather than relying on the auto-write keeps the arming correct whichever way the measurement above landed.
3. Assert the snapshot file now exists and is non-empty, then re-run the spec PLAIN and assert it PASSES. That second run is the real proof of arming -- a written-but-wrong snapshot would fail here.
4. Stage that ONE snapshot file by name and commit it in the throwaway with an ASCII message. Never `git add -A`.
5. Print the resulting SHA and the exact `E2E_APPLY_BASE=<sha>` export line the operator must use for BOTH `run-e2e.mjs` and `grade-red.mjs`.

`node arm-anchor.mjs --verify <throwaway checkout>`: exit 0 only when the snapshot file is TRACKED at HEAD, non-empty, the worktree is clean, and HEAD is detached; otherwise exit 1 with a message naming which condition failed. Print the armed SHA on success so the operator can compare it to the exported one.

Why commit rather than exclude, restated in the header comment for the next reader: the capture is `git add -A` then `git diff --cached <base>`, so an untracked snapshot would land in the model's diff, and an excluded one would hide any snapshot the MODEL writes. Committing puts it in the base, where it is invisible to the diff by construction and still lets a model-written change show. Also record what arming does NOT fix -- the kata's other spec ships a permanently failing placeholder, so a run can still "answer" by tightening that existing test, which the attribution gate grades `unattributable` and which needs hand inspection. Arming narrows the characterize-first branch only.

GUARD THE ASYMMETRY -- this is the part that makes arming real rather than aspirational.

The "forgetting the export fails loudly" property holds for the DRIVE step only. Verified in source: `run-e2e.mjs` computes `rev-list APPLY_BASE..HEAD` and throws when it is non-empty, but `gradeRun()` in `grade-red.mjs` just does `git worktree add --detach <worktree> <applyBase>` with no ahead-check and no protected-branch check. RUN-GATE documents driving and grading as SEPARATE commands, so an operator who exports the variable for the drive and forgets it on a later `grade-red.mjs --run` grades against the UNARMED base with zero signal -- silently defeating the one mechanism this task exists to create. Close it:

- Add an optional `requireExplicitApplyBase: true` to `e2e-red-gilded-rose/suite.json`. In `gradeRun`, immediately after `applyBase` is resolved and BEFORE anything is created, throw a fail-closed error when the flag is set and `process.env.E2E_APPLY_BASE` is unset. The message must say what is wrong (this suite's base is chosen at the gate, not baked into `suite.json`), and that `arm-anchor.mjs --verify` prints the SHA to export. Placing it before the worktree and the toolchain copy means the failure is instant and leaves nothing behind.
- Record `apply_base: applyBase` in `red-grade.json`. Prevention plus an audit trail: every grade now states, in its own artifact, which base it was measured against, so a post-hoc reader can check rather than trust.
- Do NOT set the flag on the two new suites. Their bases are fixed pins in `suite.json` and there is nothing to arm, so demanding an export there would be ceremony.

This is deliberately a flag on the SUITE and not a snapshot-file existence check on the target. A file check would force every GRC canary in crux 7 to grade against an armed base, which would mean arming inside the battery -- an `npm ci` and a real runner invocation for a check about an environment variable.

SELFCHECK, new crux 10, and it must DISCRIMINATE without needing a toolchain or a metered anything:

- Build a throwaway detached worktree of the kata under `os.tmpdir()`, assert `--verify` FAILS on it (unarmed), then hand-create the snapshot file with plausible content and commit it by name inside that worktree, and assert `--verify` now PASSES and prints a SHA. Tear the worktree down, `git worktree prune`, and assert the kata is left clean, with one worktree entry and no branch matching the throwaway prefix. Scope that last assertion to a GLOB (`git branch --list 'red-*'`), never a bare listing -- the kata legitimately has `main`, so a bare listing fails in the fully correct end state. `checkWorktreeBase()` already uses exactly this glob idiom for `review-*`; copy it.
- SKIP (do not fail) when the kata is absent, matching cruxes 3 and 7.
- Assert the new guard in BOTH directions, and do it FIRST because it costs nothing: with `E2E_APPLY_BASE` deleted from the environment, `gradeRun` on a GRC fixture must THROW naming the variable; with it set, the existing GRC canaries must grade exactly as they do today. Restore the environment afterwards in a `finally`.
- Consequence for crux 7: because GRC now carries the flag, its four existing canaries must run with `E2E_APPLY_BASE` set. Set it explicitly to `main` around them. That is honest -- a fabricated canary genuinely grades against the unarmed base and does not touch the snapshot -- and it makes the deliberate choice visible instead of implicit.
- MANDATORY, do not generalize loosely from the bullet above (plan-checker iteration 2, the one finding that survived): **restore the environment -- delete the key, or restore its prior value -- in a `finally` immediately after the four GRC calls and BEFORE any NGXA or SRVC canary grades.** `checkTargetToolchainCanary()` is now ONE parameterized function that grades GRC, NGXA and SRVC as adjacent sequential calls in the same process. `gradeRun` resolves the base as `process.env.E2E_APPLY_BASE || suite.applyBase`, so a leaked `E2E_APPLY_BASE=main` would silently REPLACE NGXA's and SRVC's pinned SHAs with `main` -- grading the wrong commit with no operator-visible signal. That is exactly the silent-failure class this whole task exists to eliminate, merely relocated to the two new suites. Use the same `try/finally` discipline crux 10 already specifies for itself; the save/restore is one line each side.

This tests the verifier's logic and the guard, which are the parts the operator relies on; the auto-write behavior itself is the measurement recorded in step 1.

Run `selfcheck-red.mjs` with `run_in_background: true` and WAIT for the completion notification (see Task 2 -- the battery now runs for minutes and the tool's `timeout` cap is 600000 ms).
  </action>
  <verify>
    <automated>node .claude/skills/lz-red-workspace/selfcheck-red.mjs</automated>
    <automated>git --git-dir=D:/projects/github/emilybache/GildedRose-Refactoring-Kata/.git --work-tree=D:/projects/github/emilybache/GildedRose-Refactoring-Kata status --porcelain | rg . ; test $? -eq 1</automated>
    <automated>git --git-dir=D:/projects/github/emilybache/GildedRose-Refactoring-Kata/.git worktree list | rg -c . | rg '^1$'</automated>
    <automated>git --git-dir=D:/projects/github/emilybache/GildedRose-Refactoring-Kata/.git branch --list 'red-*' | rg . ; test $? -eq 1</automated>
    <automated>ls D:/projects/github/emilybache/GildedRose-Refactoring-Kata/TypeScript/node_modules | rg -c . | rg '^308$'</automated>
  </verify>
  <done>`arm-anchor.mjs --arm` arms a throwaway and prints the export line; `--verify` discriminates armed from unarmed and `gradeRun` refuses a GRC grade with `E2E_APPLY_BASE` unset, both proved by crux 10 inside `selfcheck-red.mjs` (exit 0); every `red-grade.json` now records `apply_base`; the measured auto-write behavior is recorded in the script header; the kata is pristine -- clean tree, exactly one worktree, no `red-*` branch, 308 `node_modules` entries; one atomic commit.</done>
</task>

<task type="auto">
  <name>Task 5: RUN-GATE for the three-suite round, and the closing attestation</name>
  <files>.claude/skills/lz-red-workspace/e2e-red-gilded-rose/RUN-GATE.md</files>
  <action>
ONE commit -- `docs(red): RUN-GATE for the three-suite round + the armed anchor`.

Update `RUN-GATE.md` in place. It stays the single gated presentation for the whole RED round; do not fork a copy per suite.

1. Step 1: the target corpus is now THREE, with the qualification checklist scored for each. GRC stays the HIGH-contamination smoke anchor. NGXA is the primary in-domain discriminator (contamination HIGH but earned, with the reason a tie must not be read as inertness). SRVC is the out-of-domain control (contamination LOW, one caveat). Keep the steer-at-gate framing: the user still confirms the corpus.
2. Step 1 calibration: re-price the fan-out. 3 targets x 3 arms x k=3 is 27 runs. Add the MEASURED per-grade toolchain-copy costs -- the kata's ~3.4 s, srvx's copy, and ngx-layout's, which is roughly 20-30x the kata's on a 1.6 GB / 186k-file tree -- plus srvx's per-grade prebuild. Grading is no longer a rounding error for one of the three targets, and the operator must see that before choosing k.
3. Step 2: the zero-spend canary now covers NINE fabricated runDirs across three suites (four GRC, three ngx-layout, two srvx), and the battery therefore takes minutes rather than ~70 s -- dominated by the ngx-layout toolchain copies. State the measured runtime, say plainly that a SKIP is not a pass, and tell the operator to run it in the background rather than under a tool timeout. State that `--include`-routed and `<reportFile>`-based runners are exercised by the NGXA canaries (including the no-collect one, which is what proves the report-file override keeps the fail-closed contract for a wrapped runner), and that the SRVC red canary is what proves the typecheck prebuild.
4. Step 3: split step 3a into per-suite throwaway-checkout recipes -- `--detach` in every one, never a named branch. Keep the kata's copy-the-lockfile-then-`npm ci` note. ngx-layout has a TRACKED `package-lock.json`, so a plain `npm ci` works there. srvx has no tracked npm lockfile, so use `npm install` and keep the generated lockfile inside the throwaway.
5. Step 3, NEW sub-step `3a3` for the kata only: run `arm-anchor.mjs --arm <throwaway>`, then `--verify`, then export the printed `E2E_APPLY_BASE=<sha>` for BOTH the `run-e2e.mjs` drive and every `grade-red.mjs --run`. Correct the earlier framing rather than repeating it: the two steps FAIL DIFFERENTLY. The driver refuses on its own (the arming commit puts HEAD ahead of `main` and it will not reset past it), whereas `gradeRun` has no such check and, before this task, would have graded silently against the unarmed base. What protects the grade is the `requireExplicitApplyBase` flag added in Task 4 -- so state that the export is required on EVERY grade invocation, that a missing one is now an instant refusal naming the variable, and that each `red-grade.json` records the `apply_base` it actually used so a reader can verify rather than trust. Do NOT export it for the other two suites; their bases are fixed pins and the flag is not set on them.
6. Step 3d: `tabulate-mechanical-red.mjs` now walks every RED suite and fails closed on a colliding cell key; each suite gets its own `mechanical-red.json` and the printed table is combined.
7. Residual-risk list: add (a) the ngx-layout copy cost and its peak temp-disk footprint, recording that hardlinking is NOT a valid shortcut (shared inodes mean an in-place write from the model's runner corrupts the source, which is the exact hole the copy closed) and that a block-cloning copy on the ReFS Dev Drive is a possible FOLLOW-UP, out of scope here, (b) the srvx prebuild running the target's own build script inside the grading worktree -- contained by the throwaway plus the disposable toolchain copy, same containment as the runner spawn, (c) the `<reportFile>` path now being part of the fail-closed contract: a missing report file is treated exactly as an empty stdout, so the no-collect and infrastructure-failure branches still decide, (d) what arming does not fix (the tighten-the-placeholder branch, which grades `unattributable` and needs hand inspection), and (e) the NGXA committed false-green trap, so an operator reads a run that repairs it as a coach-don't-drive signal rather than an instrument artifact.
8. Keep the HALT banner and the eval-run-approval-gate language exactly as strong as it is now.

CLOSING ATTESTATION -- run the full battery one last time on the merged tree and confirm, without editing anything to make it pass:

- all seven verification commands exit 0 (list in the verification block below);
- the three borrowed repos are git-clean, each with exactly one worktree entry and no new named branch, and the kata still has its 308 `node_modules` entries;
- `plugins/lz-tdd` and `run-e2e.mjs` have zero files in the whole task's diff (`git diff --name-only <first commit>~1..HEAD`);
- the tree is ASCII-only and the email allowlist-inversion scan is clean -- assert the ONLY email-shaped token present in anything this task added is the maintainer's public gmail, and never write any other address as a search needle;
- no `results/` or `node_modules` artifact got staged from either new suite dir.

Report the outcome. Do not run anything metered.
  </action>
  <verify>
    <automated>node .claude/skills/lz-red-workspace/grade-red.mjs --selfcheck &amp;&amp; node .claude/skills/lz-red-workspace/tabulate-mechanical-red.mjs --selfcheck &amp;&amp; node .claude/skills/lz-red-workspace/merge-judge.mjs --selfcheck &amp;&amp; node .claude/skills/lz-red-workspace/check-evals.mjs</automated>
    <automated>node .claude/skills/lz-red-workspace/selfcheck-red.mjs &amp;&amp; node .claude/skills/lz-refactor-workspace/e2e-nx/selfcheck-code-review.mjs</automated>
    <automated>claude plugin validate .</automated>
    <automated>git status --porcelain | rg 'e2e-red-(ngx-layout|srvx)/results|node_modules' ; test $? -eq 1</automated>
  </verify>
  <done>RUN-GATE documents three suites, the per-suite throwaway recipes, step 3a3 arming plus the mandatory `E2E_APPLY_BASE` export, the re-priced fan-out with real grading costs, and the extended residual list; all seven verification commands exit 0; all three borrowed repos pristine; `plugins/lz-tdd` and `run-e2e.mjs` untouched across the whole task; one atomic commit.</done>
</task>

</tasks>

<commit_boundaries>
Six commits, in order, each verified BEFORE it is made and each leaving the battery green:

1. `feat(red): per-target runner and typecheck configuration in grade-red` (Task 1)
2. `feat(red): tabulate every RED suite, fail closed on a colliding cell` (Task 1)
3. `feat(red): ngx-layout RED apply suite (primary discriminator)` (Task 2)
4. `feat(red): srvx RED apply suite (out-of-domain control)` (Task 3)
5. `feat(red): arm the Gilded Rose approvals snapshot in the throwaway checkout` (Task 4)
6. `docs(red): RUN-GATE for the three-suite round + the armed anchor` (Task 5)

Commits 1 and 2 are separable because they touch different files and different failure modes; each gets its OWN pre-commit verify line (see Task 1). Commits 3 and 4 both extend `selfcheck-red.mjs`, so 3 lands the crux-7 parameterisation and the crux-2 loop with its poisoned-prompt half, and 4 only registers its fixtures -- keeping each bisectable. Commit 5 also touches `grade-red.mjs` and the GRC `suite.json` for the `requireExplicitApplyBase` guard: that guard exists only for arming, so it belongs in the arming commit rather than being split away from its reason. Stage every file BY NAME.
</commit_boundaries>

<anti_regression_map>
Every new capability has one offline check that fails without it and passes with it. No flag anywhere disables a guard to manufacture the failing side.

| Capability | Discriminating check |
|------------|----------------------|
| `<reportFile>` report source | The NGXA red canary. Angular build output on stdout defeats the outermost-brace extraction, so the canary can only grade via the file. Plus the pure `substituteRunnerCmd` assertions. |
| `<reportFile>` fail-closed path | The NGXA no-collect canary. The override synthesises `stdout` and discards the real spawn's, so the no-collect branch must be proved through the wrapped runner and not only against bare jest/vitest. A throw instead of a `no_tests` verdict is the failing side. |
| `prompt_forbidden_tokens` | Crux 2 feeds a POISONED prompt (real prompt + one of that target's own tokens, in a different letter case) through the same helper and requires a non-empty result. A case-folding bug, an emptied list, or a matcher on the wrong field all fail it. |
| `requireExplicitApplyBase` guard | Crux 10: `gradeRun` on a GRC fixture with `E2E_APPLY_BASE` deleted from the environment must THROW naming the variable, and must grade normally with it set. Without the guard the unset case grades silently against the unarmed base. |
| `runner_path_base` | The NGXA red canary. Without stripping, the `--include` glob matches nothing and the verdict flips to `no_tests`. Plus the pure `relativeToBase` assertions. |
| `typecheck.args` per target | The NGXA compile canary: `new_tsc_errors > 0` under `-p tsconfig.spec.json`. Plus the pure `resolveTypecheck` assertions. |
| `typecheck.prebuild` | The SRVC red canary, whose spec imports the package's public entry point. Without the prebuild it grades `compile_error` instead of `genuinely_red`. |
| Multi-suite tabulation | A two-suite temp fixture tree in `--selfcheck`; the pre-change single-suite walk finds only one cell. |
| Cell-key collision guard | A third temp suite reusing an existing target id must throw. |
| Anchor arming | Crux 10: `--verify` fails on an unarmed throwaway and passes on an armed one. |
| No lz-refactor regression | `selfcheck-code-review.mjs` exit 0, crux 6 green, and `run-e2e.mjs` with zero files in the diff. |
</anti_regression_map>

<threat_model>
## Trust boundaries

| Boundary | Description |
|----------|-------------|
| model-authored diff -> grading worktree | A captured `diff.patch` is attacker-shaped input applied with `git apply`. |
| model-authored spec -> runner spawn | Grading EXECUTES the produced spec under the target's own runner. |
| target build script -> grading worktree | NEW with this task: `typecheck.prebuild` runs the TARGET's own build script. |
| borrowed repos -> this instrument | Three third-party checkouts that must be read-only and end clean. |

## STRIDE register

| Threat ID | Category | Component | Severity | Disposition | Mitigation |
|-----------|----------|-----------|----------|-------------|------------|
| T-wpu-01 | Tampering | `typecheck.prebuild` executing a target build script | medium | mitigate | Runs in the throwaway worktree with the disposable toolchain COPY, which is the same containment already proven for the runner spawn by crux 9. Never runs against the pristine checkout. |
| T-wpu-02 | Tampering | New suites' `repo` path form | high | mitigate | Take `repo` verbatim from `git rev-parse --show-toplevel`; `resolveArmCwd` already refuses a form mismatch before creating anything. Both new repos verified at plan time. |
| T-wpu-03 | Information disclosure | `<reportFile>` temp path | low | mitigate | Allocated under `os.tmpdir()` with a pid/timestamp/random name and removed in a `finally`, mirroring `gradeFixture`. |
| T-wpu-04 | Tampering | Arming touching the pristine kata | high | mitigate | `arm-anchor.mjs` refuses a path resolving to the suite's `repo`, requires a detached HEAD, and stages one file by name. Crux 10 asserts the kata is left clean with one worktree and no branch. |
| T-wpu-05 | Repudiation | A colliding cell key merging two repos' runs | medium | mitigate | Fail-closed duplicate-key guard in the tabulator walk, with a selfcheck case. |
| T-wpu-06 | Denial of service | 1.6 GB per-grade toolchain copy | low | accept | Measured and documented in RUN-GATE as a spend/wall-clock input. A shared cache would fix the time and reopen the poisoned-toolchain hole; that trade was already decided against. |
| T-wpu-07 | Elevation of privilege | A produced spec writing to an ABSOLUTE path | medium | accept | Pre-existing residual, unchanged by this task; already named in RUN-GATE. Containing it needs a sandbox. The post-round borrowed-repo check stays mandatory. |
| T-wpu-08 | Repudiation | Grading the armed round against the unarmed base | high | mitigate | `requireExplicitApplyBase` makes `gradeRun` refuse before it creates anything when `E2E_APPLY_BASE` is unset, and every `red-grade.json` records the `apply_base` it used. Verified in source that `gradeRun` had no ahead-check or protected-branch check of its own, so the drive step's loud refusal did not cover it. |
| T-wpu-SC | Tampering | npm installs in throwaway checkouts | high | mitigate | No new package is installed into THIS repo. Both borrowed repos were legitimacy-gated at measurement time (srvx: first publish 2024-09-16, 83 versions, MIT, 0 runtime deps, repo live; ngx-layout: 232 stars, release 22.0.1, MIT, on npm, not deprecated). Installs happen only inside throwaway checkouts of those repos. |
</threat_model>

<verification>
All seven must exit 0 on the merged tree:

```
node .claude/skills/lz-red-workspace/grade-red.mjs --selfcheck
node .claude/skills/lz-red-workspace/tabulate-mechanical-red.mjs --selfcheck
node .claude/skills/lz-red-workspace/merge-judge.mjs --selfcheck
node .claude/skills/lz-red-workspace/selfcheck-red.mjs
node .claude/skills/lz-red-workspace/check-evals.mjs
node .claude/skills/lz-refactor-workspace/e2e-nx/selfcheck-code-review.mjs
claude plugin validate .
```

Plus:
- a fabricated-runDir canary grades end to end against EACH new target's own toolchain and returns a VERDICT (never a throw) with a real semver `runner_version`;
- all three borrowed repos end git-clean, one worktree entry each, no new named branch, kata `node_modules` at 308 entries;
- `plugins/lz-tdd` has zero files in the task's diff, and `run-e2e.mjs` is byte-identical;
- ASCII-only, email allowlist-inversion clean.
</verification>

<success_criteria>
- Both new suites compose three arms with byte-identical, non-leading prompts under `--dry-run`, proved by crux 2 across all three suites.
- Both new targets grade end to end against their own toolchain: a positive canary (`genuinely_red`, `pass: true`, semver `runner_version`, attributed failure) and a negative control (`compile_error`, `new_tsc_errors > 0`); ngx-layout adds a third proving the `<reportFile>` override keeps the no-collect fail-closed contract.
- Every prompt is proved non-leading in BOTH directions: the real prompt is clean and a poisoned one is caught.
- The tabulator aggregates three suites and fails closed on a colliding cell key.
- The Gilded Rose anchor can be armed and the armed state verified, with a crux that discriminates armed from unarmed, AND grading refuses to run against an unstated base.
- Six atomic bisect-safe commits; the battery is green at every one.
- Zero metered spend.
</success_criteria>

<output>
This is a quick task. On completion write
`.planning/quick/260725-wpu-wire-two-measured-red-apply-targets-as-n/260725-wpu-SUMMARY.md`
recording: the six commit SHAs, the MEASURED numbers gathered along the way (the ngx-layout JSON
reporter shape, both per-grade toolchain-copy times, the srvx prebuild time, the vitest snapshot
auto-write behavior), each design decision as implemented, and the borrowed-repo cleanliness
attestation. HALT there -- the metered round stays gated.
</output>
