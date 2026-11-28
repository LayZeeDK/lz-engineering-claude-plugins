---
phase: quick-261128-ghr
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - tools/evals/templates.ts
  - tools/evals/templates.test.ts
  - tools/evals/port-cases.ts
  - tools/evals/port-cases.test.ts
  - .github/workflows/evals-check.yml
  - .github/workflows/evals-mutation.yml
autonomous: true
requirements: [quick-261128-ghr]

must_haves:
  truths:
    - "On Ubuntu and macOS the kata toolchain starts npm from <prefix>/lib/node_modules/npm/bin/npm-cli.js; on Windows from node_modules/npm/bin/npm-cli.js beside node.exe; the path does not depend on the host OS"
    - "The lz-tpp trigger record is read from published commit d85ffeb while every recorded case keeps the tag rec-5f586da"
    - "node tools/evals/port-cases.ts reproduces the committed suites: git status shows no change under evals/"
    - "The real-tree port-cases test passes against a clone that does not hold 5f586da"
    - "Windows CI jobs check out LF (core.autocrlf false before actions/checkout)"
    - "The mutation workflow builds the pinned lz-node-test checkout, so its packages' dist/index.js exist before Stryker loads the mutators"
  artifacts:
    - path: tools/evals/templates.ts
      provides: "exported npmCliPath(execPath, platform)"
    - path: tools/evals/port-cases.ts
      provides: "TriggerSpec.record.readFrom, the commit the record is read from"
    - path: .github/workflows/evals-check.yml
      provides: "core.autocrlf false step before checkout"
    - path: .github/workflows/evals-mutation.yml
      provides: "nx build of the pinned lz-node-test checkout"
  key_links:
    - from: tools/evals/templates.ts
      to: tools/evals/templates.ts
      via: "const npmCli = npmCliPath(process.execPath, process.platform), used by kataToolchain.install and kataToolchain.run"
    - from: tools/evals/port-cases.ts
      to: evals/lz-tdd/trigger-lz-tpp
      via: "triggerCases reads record.readFrom ?? record.sha and tags rec-<record.sha>"
---

<objective>
Make `npm --prefix tools/evals run check` pass on GitHub's Ubuntu and Windows runners (Node.js 22, 24, 26), and make the
mutation workflow load its Stryker config. Run 46136891456 (Evals check) failed on all six jobs and run 46136891407
(Evals mutation) failed on every shard. Four causes, all measured by the orchestrator:

1. Ubuntu: `tools/evals/templates.ts` line 210 builds the npm CLI path in the Windows layout only.
2. All jobs: `tools/evals/port-cases.ts` reads the lz-tpp trigger record from 5f586da, a commit that exists only in the
   local clone. Published d85ffeb (an ancestor of HEAD) holds the identical blob of that path.
3. Windows: the runners have core.autocrlf true, so checkouts and the tests' temp repos get CRLF and five byte-exact
   compares fail.
4. Mutation: the lz-node-test workspace packages export `./dist/index.js` by default, and the CI clone is never built.

Fixes 1 and 2 are test-first, one test per red-green-refactor cycle; fixes 3 and 4 are CI config with no cycle.
No tracer task: the four fixes are independent and share no stack.

Output: two small code changes with three new tests, two workflow edits, four commits.
</objective>

<execution_context>
@~/.claude/gsd-core/workflows/execute-plan.md
@~/.claude/gsd-core/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@CLAUDE.md
@AGENTS.md
@tools/evals/templates.ts
@tools/evals/templates.test.ts
@tools/evals/port-cases.ts
@tools/evals/port-cases.test.ts
@.github/workflows/evals-check.yml
@.github/workflows/evals-mutation.yml

Rules that hold for every task:
- Shared machine. Before EVERY test run (single file or full check) and before the lz-node-test install in Task 3, run
  `node C:/Users/LarsGyrupBrinkNielse/.claude/references/shared-machine/heavy-lock.ts status` and start nothing while a
  holder is marked `[timing-sensitive]`; wait and check again. The full `npm --prefix tools/evals run check` is a heavy
  run; single files (`node --test tools/evals/<file>.test.ts`) are fine outside a timing-sensitive slot.
- Test-first (Tasks 1 and 2): read `C:/Users/LarsGyrupBrinkNielse/.claude/skills/lars-mode/references/test-first.md`
  before the first test. Call the skills `lz-tdd:lz-red`, `lz-tdd:lz-tpp` and `lz-tdd:lz-refactor` once each in this
  session before the first cycle (again only after a context compaction); the executor is the developer and makes the
  edits and runs the tests itself. Write one cycle-log line per cycle to `cycle-log.txt` in the executor's scratchpad,
  in the format test-first.md gives (node:test summary = the `fail` line alone). Each cycle's red and green runs print
  the runner's summary lines unfiltered.
- Commits: `git config user.email` must print `larsbrinknielsen@gmail.com` before the first commit. Conventional
  Commits with scope `quick-261128-ghr`, message written to a file in the scratchpad and committed with
  `git commit -F <file>`, files staged by name, subject checked with `git log --oneline -1`. No AI attribution.
- Comments: only a one-line why the code cannot show. ASCII only.
- The orchestrator pushes and watches CI; the executor does not push.
</context>

<tasks>

<task type="auto" tdd="true">
  <name>Task 1: Resolve npm-cli.js for both the Windows and the POSIX Node.js layout</name>
  <files>tools/evals/templates.ts, tools/evals/templates.test.ts</files>
  <read_first>
    - C:/Users/LarsGyrupBrinkNielse/.claude/skills/lars-mode/references/test-first.md
    - plugins/lz-tdd/skills/lz-red/SKILL.md, plugins/lz-tdd/skills/lz-tpp/SKILL.md, plugins/lz-tdd/skills/lz-refactor/SKILL.md (through the Skill tool calls)
    - tools/evals/templates.ts lines 184-250 (cleanEnv, withLocalBin, the Stryker-disabled npmCli constant and kataToolchain)
    - tools/evals/templates.test.ts line 11 (imports) and the cleanEnv / withLocalBin tests near lines 272-290 (style analog)
  </read_first>
  <behavior>
    - Test 1 (starter): npmCliPath('C:\\nodejs\\node.exe', 'win32') returns 'C:\\nodejs\\node_modules\\npm\\bin\\npm-cli.js'
    - Test 2: npmCliPath('/opt/hostedtoolcache/node/24.22.3/x64/bin/node', 'linux') returns '/opt/hostedtoolcache/node/24.22.3/x64/lib/node_modules/npm/bin/npm-cli.js'
  </behavior>
  <action>
    Add `export function npmCliPath(execPath: string, platform: NodeJS.Platform): string` to tools/evals/templates.ts,
    placed ABOVE the line `// Stryker disable all: spawns npm and vitest, which the unit tests replace` so Stryker
    mutates it. Run the two behaviors as two cycles in tools/evals/templates.test.ts, one test each, Test 1 first.
    For Test 1's red, the missing export is an import failure, a prerequisite to clear: add the export with a
    not-implemented throw body, then run again to reach the red. Green and refactor follow lz-tpp and lz-refactor.

    Constraint on the shape after the last cycle: the result must not depend on the host OS. Choose the `win32` or the
    `posix` path functions from node:path by the `platform` argument. Host `join`/`dirname` would pass on this Windows
    machine and fail on Ubuntu CI. Windows keeps npm beside node.exe (`<dir of node.exe>/node_modules/npm/bin/npm-cli.js`);
    every other platform keeps node in `<prefix>/bin` and npm in `<prefix>/lib/node_modules/npm/bin/npm-cli.js`.

    Then replace the body of the existing constant at line 210 with
    `const npmCli = npmCliPath(process.execPath, process.platform);`. It stays inside the Stryker-disabled region, and
    the comment above it about the .cmd shim stays. Nothing else in kataToolchain changes.

    Run the spec with `node --test tools/evals/templates.test.ts` (heavy-lock status first). Commit
    tools/evals/templates.ts and tools/evals/templates.test.ts as
    `fix(quick-261128-ghr): find npm-cli.js in the POSIX Node.js layout too`.
  </action>
  <verify>
    <automated>node --test tools/evals/templates.test.ts</automated>
    <automated>rg -c "npmCliPath" tools/evals/templates.ts  # [HEAD=0 EXPECT>=2]</automated>
  </verify>
  <done>
    templates.test.ts passes with the two new tests; the cycle log has two cycle lines whose red summaries appear in
    tool results; templates.ts line 210's constant calls npmCliPath; the function sits outside the Stryker-disabled
    region; the two tests together fail if the platform condition is forced either way.
  </done>
</task>

<task type="auto" tdd="true">
  <name>Task 2: Read the lz-tpp trigger record from published d85ffeb and keep the rec-5f586da tag</name>
  <files>tools/evals/port-cases.ts, tools/evals/port-cases.test.ts</files>
  <read_first>
    - tools/evals/port-cases.ts lines 30-74 (TriggerSpec, triggerSpec) and 114-170 (triggerCases)
    - tools/evals/port-cases.test.ts lines 51-96 (sourceRepo, spec, the first triggerCases test as the analog) and 173-191 (the real-tree test)
  </read_first>
  <behavior>
    - Test: triggerCases given a spec whose record names a commit the temp repo does not hold (for example
      sha '0abc123') and sets readFrom to the repo's real first-commit sha tags the non-canary queries of the recorded
      file at that commit with 'rec-0abc123' (assert the bodies of the cases carrying that tag). Build the repo with
      the existing sourceRepo and enough fire and quiet queries for the baseline picks (at least five non-canary of
      each). Expected red: triggerCases throws git's "invalid object name" error at the point of use, a valid red that
      originates in the code under test (lz-red step 5).
  </behavior>
  <action>
    One cycle, one test, added to tools/evals/port-cases.test.ts. The target change in tools/evals/port-cases.ts:
    TriggerSpec.record gains an optional `readonly readFrom?: string`, the commit the record is read from when `sha`
    was never published. The `git show` at line 135 reads `${spec.record.readFrom ?? spec.record.sha}:${spec.record.path}`.
    The tag at line 161 still comes from `spec.record.sha`. Green follows lz-tpp, refactor follows lz-refactor.
    tsconfig has exactOptionalPropertyTypes on, so pass readFrom only as a real string.

    Outside the cycle (data, no behavior): in triggerSpec's lz-tpp branch (line 63) set the record to
    `{ sha: '5f586da', readFrom: 'd85ffeb', path: ... }`, with a one-line comment that 5f586da was never published and
    d85ffeb holds the identical file. The other two records (8cd13a8, f23c7f8) stay as they are; both are on
    origin. Keep `rec-5f586da` as the tag: 37 committed files carry it, including the run-set.json of two finished paid
    runs.

    Prove the CI condition locally after the change:
    (a) `node tools/evals/port-cases.ts`, then `git status --porcelain -- evals/` prints nothing.
    (b) Clone this repository without 5f586da:
    `git clone --no-local --single-branch --no-tags --branch gsd/lz-tdd-0.0.3-lz-red <repo root> <scratchpad>/published`.
    `git -C <scratchpad>/published cat-file -e 5f586da` must FAIL; that is the control showing the clone matches CI.
    Then, with heavy-lock status first, run the real-tree test with the data from that clone:
    `LZ_EVAL_REPO=<scratchpad>/published node --test --test-name-pattern="real sets" tools/evals/port-cases.test.ts`.
    It must pass. Leave the clone in the scratchpad.

    Commit tools/evals/port-cases.ts and tools/evals/port-cases.test.ts as
    `fix(quick-261128-ghr): read the lz-tpp trigger record from published d85ffeb`.
  </action>
  <verify>
    <automated>node --test tools/evals/port-cases.test.ts</automated>
    <automated>node tools/evals/port-cases.ts && git status --porcelain -- evals/  # expect empty output</automated>
    <automated>rg -c "readFrom" tools/evals/port-cases.ts  # [HEAD=0 EXPECT>=3]</automated>
  </verify>
  <done>
    port-cases.test.ts passes with the new test; the cycle log has its cycle line; the generator reproduces the
    committed suites with no diff under evals/; the real-tree test passes against the scratch clone that lacks
    5f586da (cat-file control failed first).
  </done>
</task>

<task type="auto">
  <name>Task 3: Check out LF on Windows CI and build the pinned lz-node-test checkout for mutation runs</name>
  <files>.github/workflows/evals-check.yml, .github/workflows/evals-mutation.yml</files>
  <read_first>
    - .github/workflows/evals-check.yml (steps, lines 34-46)
    - .github/workflows/evals-mutation.yml (the "Install the pinned lz-node-test checkout" step, lines 63-68)
    - lz-node-test at the pinned commit: `git -C D:/projects/github/LayZeeDK/lz-node-test show a78a56c4:.github/workflows/ci.yml`
      (it builds with `npx nx run-many -t ... build ...`) and `show a78a56c4:packages/stryker-mutator-core/package.json`
      (exports: `@layzee/source` -> src, default -> ./dist/index.js)
  </read_first>
  <action>
    (a) .github/workflows/evals-check.yml: add a first step, before actions/checkout, that runs
    `git config --global core.autocrlf false`, with a one-line comment that GitHub's Windows runners set
    core.autocrlf true and the byte-exact tests compare against the committed LF. The global setting also reaches the
    temp repos the tests create. The maintainer's machine has core.autocrlf input, which also checks out LF. Do not
    add this step to evals-mutation.yml: it runs on ubuntu-latest only, where the setting is unset and the step would
    change nothing.

    (b) .github/workflows/evals-mutation.yml: rename the step to "Install and build the pinned lz-node-test checkout".
    Give it step-level env `NX_DAEMON: 'false'` and `NX_NO_CLOUD: 'true'`. After its `npm ci` line, append
    `cd "$RUNNER_TEMP/lz-node-test"` and `npx --no nx run-many -t build`. `--no` forbids npx from downloading nx from
    the registry, so only the lockfile's nx 24.0.1 runs. Add a one-line comment that the workspace packages export
    dist/index.js unless the @layzee/source condition is set, which Stryker's config load does not set. Keep the
    existing comment and `--ignore-scripts`.

    (c) Reproduce the mutation install locally before committing (heavy-lock status first; it runs npm ci with
    network). Clone with `git clone --no-checkout D:/projects/github/LayZeeDK/lz-node-test <scratchpad>/lz-node-test`,
    then `git -C <scratchpad>/lz-node-test checkout --detach a78a56c819b78edd21ba935523074512d99c4307`, then
    `npm ci --prefix <scratchpad>/lz-node-test --ignore-scripts`. From inside that checkout, run an import of
    `./packages/stryker-node-mutators/src/index.ts` with node: it must fail with ERR_MODULE_NOT_FOUND for
    @layzee/stryker-mutator-core, the CI failure; that is the control. Then run
    `npx --no nx run-many -t build` there with NX_DAEMON=false and NX_NO_CLOUD=true and repeat the import: it must
    succeed, and packages/stryker-mutator-core/dist/index.js must exist. If the build fails only because
    `--ignore-scripts` skipped an install script, stop and report it to the orchestrator; do not drop the flag. Leave
    the scratch checkout in place.

    (d) Full check, heavy-lock status first: `npm --prefix tools/evals run check` must pass. Expect 155 tests: 152
    before this plan plus the three new ones. Print its summary lines unfiltered.

    Commit as two commits, each with its file staged by name:
    `ci(quick-261128-ghr): check out LF on Windows runners for the evals check` (evals-check.yml) and
    `ci(quick-261128-ghr): build the pinned lz-node-test checkout before Stryker loads it` (evals-mutation.yml).
  </action>
  <verify>
    <automated>rg -c "core.autocrlf false" .github/workflows/evals-check.yml  # [HEAD=0 EXPECT==1]</automated>
    <automated>rg -c "npx --no nx run-many -t build" .github/workflows/evals-mutation.yml  # [HEAD=0 EXPECT==1]</automated>
    <automated>npm --prefix tools/evals run check</automated>
  </verify>
  <done>
    The autocrlf step comes before actions/checkout in evals-check.yml; the mutation install step builds the
    checkout with npx --no and the two Nx env vars; the local reproduction showed the import failing before the build
    and succeeding after it; the full check passes locally; four commits exist with the scope quick-261128-ghr and the
    gmail identity.
  </done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| CI runner -> lz-node-test checkout | The mutation job runs code from another repository at a pinned commit |
| CI runner -> npm registry | npm ci and npx may fetch packages |

## STRIDE Threat Register

| Threat ID | Category | Component | Severity | Disposition | Mitigation Plan |
|-----------|----------|-----------|----------|-------------|-----------------|
| T-261128-ghr-01 | Tampering | evals-mutation.yml nx build step | medium | mitigate | Build runs only the checkout pinned by LZ_NODE_TEST_REF, installed from its lockfile with --ignore-scripts; `npx --no` refuses a registry download of nx |
| T-261128-ghr-02 | Tampering | evals-check.yml core.autocrlf step | low | accept | Changes line endings of the checkout only; no code or secrets involved; the job keeps persist-credentials: false and contents: read |
| T-261128-ghr-SC | Tampering | npm/pip/cargo installs | high | mitigate | No new package enters this repository; the only installs are the existing lockfile-pinned npm ci runs |
</threat_model>

<verification>
- `node --test tools/evals/templates.test.ts` and `node --test tools/evals/port-cases.test.ts` pass.
- `node tools/evals/port-cases.ts` leaves `git status --porcelain -- evals/` empty.
- The real-tree port-cases test passes with LZ_EVAL_REPO pointing at a clone without 5f586da.
- The local lz-node-test reproduction fails the mutators import before the build and passes it after.
- `npm --prefix tools/evals run check` passes locally (155 tests), run outside a timing-sensitive slot.
- Cross-platform proof: the orchestrator pushes and watches the Evals check and Evals mutation runs.
</verification>

<success_criteria>
- Three new tests, each written in its own red-green-refactor cycle and logged in the scratchpad cycle log.
- npmCliPath picks the npm CLI path by platform argument, independent of the host.
- The lz-tpp record reads d85ffeb; the committed rec-5f586da tags are unchanged.
- Both workflow files are fixed; evals-mutation.yml does not get the autocrlf step.
- Four Conventional Commits with scope quick-261128-ghr, author and committer larsbrinknielsen@gmail.com.
</success_criteria>

<output>
Create `.planning/quick/261128-ghr-make-the-tools-evals-check-portable-to-c/261128-ghr-SUMMARY.md` when done, listing the
four commits, the cycle-log path and its lines, the local reproduction results, and the full-check summary lines.
</output>
