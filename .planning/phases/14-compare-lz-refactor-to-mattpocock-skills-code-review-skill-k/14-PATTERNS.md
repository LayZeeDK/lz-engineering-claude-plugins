# Phase 14: Compare lz-refactor to mattpocock-skills code-review - Pattern Map

**Mapped:** 2026-07-15
**Files analyzed:** 5 (1 modified, 4 added)
**Analogs found:** 5 / 5

Measurement-only eval phase. No product code. Every "file" below is an extension or addition
to the tracked eval workspace `.claude/skills/lz-refactor-workspace/`. The dominant instruction is
D-06's "ADD the arm, do not rewrite": the largest change is an in-place extension of ONE existing
file (`run-e2e.mjs`) whose own existing branches (`invoke_skill`, apply-mode reset/teardown,
`extractResult`) are the analogs to copy. Almost nothing is net-new construction.

All paths below are absolute-from-repo-root under
`D:\projects\github\LayZeeDK\lz-engineering-claude-plugins\`.

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `.claude/skills/lz-refactor-workspace/e2e-nx/run-e2e.mjs` (MODIFY: `code_review` arm + token/tool meta + synthetic-branch setup/teardown) | harness runner | request-response + file-I/O | itself -- the existing `invoke_skill` arm branch, apply-mode git reset/teardown, and `extractResult()` | exact (self-analog) |
| `.claude/skills/lz-refactor-workspace/e2e-nx/selfcheck-code-review.mjs` (ADD: offline Wave-0 self-check for the 3 cruxes) | self-check | batch/transform (assert-based) | `.claude/skills/lz-refactor-workspace/check-evals.mjs` | role-match |
| `.claude/skills/lz-refactor-workspace/{e2e-nx,e2e-gilded-rose}/prompts/cr-*.md` (ADD: report-framed queries, D-08) + `suite.json` entries | eval-data prompt | file-I/O (static input) | `e2e-nx/prompts/p8-eslint-plugin-package-directive.md`, `e2e-gilded-rose/prompts/gr1-update-quality.md` + `suite.json.prompts` | exact |
| `.claude/skills/lz-refactor-workspace/grading/*` (ADD: per-finding normalization + dimension tables for the head-to-head) | grading helper | transform + file-I/O | `.claude/skills/lz-refactor-workspace/grade-run.mjs` (name matcher + `NAME_LAYERS`) + `grading/{book-authenticity/claims.json,summary.json}` | exact |
| `.planning/phases/14-.../14-RESULTS.md` (ADD: head-to-head record + verdict) | results doc | document | `.planning/phases/13-.../13-RESULTS.md` (+ `e2e-nx/E2E-RESULTS.md`, `e2e-gilded-rose/GR-RESULTS.md`) | exact |

## Pattern Assignments

### `run-e2e.mjs` -- add `code_review` arm + token/tool meta + synthetic branch (MODIFY)

**Analog:** the file itself. Four existing patterns are extended in place; do NOT introduce a
second runner (D-06, RESEARCH "Don't Hand-Roll").

**Pattern A -- arm allowlist + arm-expansion (extend `parseArgs`, lines 126-128 and `main`
585-588).** Add `code_review` to the validation list and (optionally) to the `all` fan-out. Current:
```js
if (!['with_skill', 'no_skill', 'invoke_skill', 'both', 'all'].includes(args.arm)) {
  throw new Error(`--arm must be with_skill|no_skill|invoke_skill|both|all, got ${args.arm}`);
}
```
The `invoke_skill` arm is the closest existing analog for adding a new arm end-to-end -- follow every
place it is switched on (`parseArgs` allowlist, `composePrompt` branch, `buildCmd` `--plugin-dir`
push, `main` arm fan-out).

**Pattern B -- per-arm prompt branch (extend `composePrompt`, lines 179-189).** The `invoke_skill`
branch is the template: a dedicated `arm ===` branch returning a differently-shaped prompt.
```js
function composePrompt(promptEntry, mode, arm) {
  const body = fs.readFileSync(path.join(PROMPTS_DIR, promptEntry.file), 'utf8').trim();

  if (arm === 'invoke_skill') {
    return `${SKILL_COMMAND} ${PREAMBLE[mode]}${body}`;
  }

  return PREAMBLE[mode] + body;
}
```
For `code_review`: return `/mattpocock-skills:code-review <ROOT_SHA>` with NO preamble/body (it is a
slash command with a positional fixed-point). `ROOT_SHA` is produced by the setup step (Pattern D)
and must be threaded in -- pass it via the `promptEntry` (set `promptEntry.root_sha` during setup) so
`composePrompt`'s signature need not change.

**Pattern C -- per-arm tool profile + per-arm `--plugin-dir` (extend `buildCmd`, lines 191-216).**
The recommend profile at line 206 blocks `Bash`; code-review REQUIRES Bash + the sub-agent-spawn
tool. The `--plugin-dir` push at 211-213 uses the module-level constant `PLUGIN_DIR` (line 38) -- the
`code_review` arm needs a DIFFERENT plugin dir (the mattpocock cache), so make the dir per-arm.
Current:
```js
if (mode === 'recommend') {
  cmd.push('--permission-mode', 'bypassPermissions');
  cmd.push('--disallowedTools', 'Edit', 'Write', 'MultiEdit', 'NotebookEdit', 'Bash');
} else {
  cmd.push('--permission-mode', 'bypassPermissions');
}

if (arm === 'with_skill' || arm === 'invoke_skill') {
  cmd.push('--plugin-dir', PLUGIN_DIR);
}
```
For `code_review`: `--disallowedTools Edit Write MultiEdit NotebookEdit` (drop `Bash`; leave the
Agent/Task spawn tool allowed) and push `--plugin-dir` = the mattpocock cache
`C:\Users\LarsGyrupBrinkNielse\.claude\plugins\cache\mattpocock\mattpocock-skills\1.2.0`. This
tool-profile asymmetry is the D-04 tool-usage FINDING -- do NOT equalize it (RESEARCH Pattern 1,
Anti-Patterns). Keep `--plugin-dir` a per-arm value, not the `PLUGIN_DIR` constant.

**Pattern D -- synthetic equal-input branch setup/teardown (NEW helper, model on the existing
`git()` helper lines 282-292 and apply-mode reset/teardown lines 337-353 + 399-409).** The runner
already shells `git` as its own ungated child and already does destructive-but-guarded worktree
discipline in apply mode. Reuse that shape. Existing `git()`:
```js
function git(cwd, gitArgs, { mustSucceed = false } = {}) {
  const r = spawnSync('git', gitArgs, { cwd, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, windowsHide: true });

  if (mustSucceed && r.status !== 0) {
    throw new Error(`git ${gitArgs.join(' ')} failed (exit ${r.status}) in ${cwd}: ${(r.stderr || '').trim()}`);
  }

  return r;
}
```
Existing apply-mode teardown discipline to imitate (setup: reset --hard to `APPLY_BASE` + clean;
this phase instead builds an empty-root -> target-only-tree -> tip branch in a throwaway worktree
and tears it down with `worktree remove --force` + `branch -D`). The verified plumbing sequence is in
14-RESEARCH.md "Pattern 3": `EMPTY=4b825dc... -> commit-tree -> read-tree --empty -> update-index
--add --cacheinfo -> write-tree -> commit-tree -p ROOT -> branch -> worktree add`; fixed point =
ROOT, HEAD = TIP. Build the target tree from the suite `applyBase` (`origin/23.0.x` / `main`), NOT
`HEAD` (nx clone is on a leftover branch -- RESEARCH Pitfall 3). Kata needs the `TypeScript/` path
prefix from the git root (RESEARCH Pitfall 4). Use `mustSucceed: true` for every setup step (I1
discipline). Teardown MUST run finally-style so a failed run still removes the worktree/branch
(RESEARCH Pitfall 6); confirm `git status --porcelain` clean after.

**Pattern E -- token/tool meta capture (extend `extractResult`, lines 221-277, and the `meta`
object, lines 411-431).** `extractResult` ALREADY iterates every `tool_use` block (lines 247-267) --
extend that same loop to build a `{name: count}` histogram; it ALREADY captures the `result` event
(lines 237-239) -- extend that branch to also read `ev.usage`, `ev.total_cost_usd`, `ev.modelUsage`,
`ev.num_turns`. Existing loop:
```js
if (ev.type === 'result' && typeof ev.result === 'string') {
  finalText = ev.result;
}
...
for (const block of content) {
  if (block?.type !== 'tool_use') {
    continue;
  }
  const blob = JSON.stringify(block).toLowerCase();
  if (blob.includes('lz-refactor')) { refactorHits++; }
  ...
}
```
Add `toolCalls[block.name] = (toolCalls[block.name] || 0) + 1;` inside that loop. On the `result`
event read the usage fields (verified present in on-disk transcripts -- 14-RESEARCH.md "Meta Capture
Detail"). Existing `meta` object to extend (keep all current fields):
```js
const meta = {
  prompt_id: promptEntry.id, target: promptEntry.target, run_idx: runIdx,
  arm, mode, cwd, model: MODEL, effort: EFFORT,
  changed_files: changedFiles, prompt_used: fullPrompt,
  used_refactor: usedRefactor, used_tpp: usedTpp,
  refactor_hits: refactorHits, tpp_hits: tppHits, skills_invoked: skillsInvoked,
  exit_code: res.status, elapsed_ms: elapsedMs, answer_chars: (finalText || '').length,
};
```
New fields (D-07, RESEARCH): `input_tokens, output_tokens, cache_read_input_tokens,
cache_creation_input_tokens, total_cost_usd, num_turns, model_usage: {<model>:{input,output,costUSD}},
tool_calls: {<ToolName>:<count>}`. Report `total_cost_usd`/`modelUsage` as the headline (rolls up
sub-agents); `usage` is main-context-only and under-counts code_review -- confirm the roll-up on the
first approved run (Assumption A1).

**Pattern F -- Pass@k / Pass^k (reuse, lines 442-468).** `comb`/`passAtK`/`passHatK` already exist
and were copied verbatim into Phase 13's `grading/summary.json`. Reuse; do NOT write new stats code
(RESEARCH "Don't Hand-Roll").

**Note (dry-run gate):** the `--dry-run` path (lines 595-622) composes prompts + commands and spends
nothing -- it is the Wave-0 build check for Patterns B/C. Ensure `code_review` composes cleanly there
before the D-12 gate.

---

### `selfcheck-code-review.mjs` -- offline Wave-0 self-check (ADD)

**Analog:** `.claude/skills/lz-refactor-workspace/check-evals.mjs`

Self-contained Node `assert`-style lint, no framework, fail-closed, ASCII-clean, `process.exit`.
Copy its skeleton verbatim.

**`fail()` + fail-closed structure** (check-evals.mjs lines 21-24, 141):
```js
function fail(msg) {
  console.error(`check-evals: FAIL - ${msg}`);
  process.exit(1);
}
...
console.log(`check-evals: OK - ...`);
process.exit(0);
```

**`import.meta.url` -> here-dir + read-json-or-fail** (check-evals.mjs lines 13-40): the ES-module
path resolution + try/catch read + try/catch parse pattern.

**ASCII-only assertion** (check-evals.mjs lines 84-91), reuse verbatim for any committed prompt/text:
```js
const nonAscii = Buffer.from(el.query, 'utf8').some((b) => b > 0x7f);
if (nonAscii) { fail(`entry ${i} ... non-ASCII byte (> 0x7F)`); }
```

This one script must cover the three RESEARCH cruxes (Wave 0 Gaps):
1. **Command composition** -- shell `node run-e2e.mjs --dry-run --arm code_review` and assert the
   composed prompt is `/mattpocock-skills:code-review <ROOT>`, `--plugin-dir` is the mattpocock cache,
   and `Bash` is NOT in `--disallowedTools`; also `--dry-run --arm lz-refactor` asserts `Bash` IS
   blocked (RESEARCH Validation Architecture table).
2. **Synthetic branch** -- build ROOT/TIP for one target, assert `git diff ROOT...TIP --stat`
   non-empty AND `git ls-tree -r --name-only TIP` == the target path(s), then teardown and assert
   `git status --porcelain` empty + no `review-*` branch/worktree.
3. **Transcript parse** -- run the extended `extractResult()` over an EXISTING on-disk Phase-13
   transcript (`results/apply/no_skill/p1/run-1/outputs/transcript.stream.jsonl`) and assert
   `input_tokens>0`, `total_cost_usd>0`, `tool_calls` non-empty.

Second analog for a `--selfcheck` self-test mode inside a grader: `grade-run.mjs --selfcheck`
(grade-run.mjs line 45).

---

### `prompts/cr-*.md` + `suite.json` entries -- report-framed queries (ADD)

**Analog:** `e2e-nx/prompts/p8-eslint-plugin-package-directive.md` (whole-package report framing),
`e2e-gilded-rose/prompts/gr1-update-quality.md` (single-target coach framing), and the
`suite.json.prompts` array.

Existing prompts are plain Markdown bodies, deliberately non-leading, pointing at a target via prose.
p8 (the recommended nx target, D-09):
```
Identify the code smells in the `@nx/eslint-plugin` package and refactor them away. The tests are
green.
```
gr1 (kata):
```
The `updateQuality` method in `app/gilded-rose.ts` has always been hard to work with. The tests
are green. What would you do with it?
```

New `cr-*` prompts (D-08) mirror code-review's "review these files, surface smells + fixes" framing,
point at the SAME target file code-review reviews, and stay read-only. RESEARCH "Recommend-Mode Query
Authoring" gives the template: *"Review `<target path>`. The tests are green. Surface the code smells
you see and the named refactorings you would recommend for each. Do not edit anything."* The
`invoke_skill` arm prepends `/lz-tdd:lz-refactor` automatically (composePrompt line 185), so the body
stays framing-only. Add a matching entry to `suite.json.prompts` following the existing shape
(suite.json lines 7-23):
```json
{ "id": "p1", "file": "p1-enforce-module-boundaries-run.md", "target": "T1", "code": true }
```
Because these are new non-leading prompts, subagent-review each (incl. >=1 unbiased) BEFORE any run
-- the same discipline logged for `p2cmd`/`gr1cmd` in `E2E-FINDINGS.md` (RESEARCH D-08).

---

### `grading/*` -- per-finding normalization + dimension tables (ADD)

**Analog:** `.claude/skills/lz-refactor-workspace/grade-run.mjs` (name matcher + name->layer lookup)
and the Phase-13 grading records `grading/book-authenticity/claims.json` + `grading/summary.json`.

**Per-claim record shape** (`grading/book-authenticity/claims.json` lines 1-19) -- reuse verbatim,
adding an `arm` value of `code_review` alongside `lz-refactor`:
```json
{ "cell": "p1", "arm": "with_skill", "run": 1, "book": "Fowler",
  "named_refactoring": "Extract Function",
  "file_symbol": "enforce-module-boundaries.ts:run",
  "functional_change": "extracted 2 inline autofix closures ..." }
```

**Machine-readable rollup shape** (`grading/summary.json` lines 1-50) -- reuse the per-(cell,arm)
row with a `passk:{n,c,passAt1,passAt3,passHat3}` block sourced from `run-e2e.mjs`'s
`passAtK`/`passHatK` (summary.json line 8 records `"passk_source": "run-e2e.mjs ... copied
verbatim"`). Add the new D-04 dimensions (lift, tokens, tools, idiom/pattern) as sibling blocks to
`book_authenticity` / `name_layer` / `behavior`.

**Refactoring-NAME matcher + `NAME_LAYERS` lookup** (grade-run.mjs lines 54-120): the word-bounded
`nameRe()` and the Fowler(62)/Kerievsky(27)/functional catalogs are the ready-made normalization for
counting distinct named refactorings/smells per arm (the Lift dimension) and for the idiom/pattern
breadth count (the ~139-vs-12 headline). Reuse `nameRe`; do NOT hand-roll a new matcher.

**DST-04 firewall (unchanged):** book-authenticity + idiom claims route through `oracle` /
`oracle-reviewer` only; main context normalizes the raw `answer.md` into a claim list first, then
hands THAT list to the reviewer (the Phase-13 posture -- 13-RESULTS.md line 10). Main context never
reads `.oracle/` prose.

---

### `14-RESULTS.md` -- head-to-head record + verdict (ADD)

**Analog:** `.planning/phases/13-lz-refactor-vs-base-opus-eval-book-authenticity-correctness/13-RESULTS.md`
(closest: a multi-arm, per-cell, per-dimension eval results doc with an EMPIRICAL parity verdict and
an unbiased-reviewer confirmation). Secondary format analogs: `e2e-nx/E2E-RESULTS.md`,
`e2e-gilded-rose/GR-RESULTS.md`.

Reuse 13-RESULTS.md's structure verbatim, swapping the arm axis from `with_skill`/`no_skill` to
`lz-refactor`/`code_review`:
- **Header block** (13-RESULTS.md lines 3-10): skill under test, model/config, arms, borrowed repos,
  graded corpus, run-artifact paths, grading-channel note.
- **One table per dimension**, cell x arm, with `Runs graded | Claims | pass | partial | fail |
  pass@1 | pass@3 | pass^3` columns (13-RESULTS.md lines 18-30). Phase 14 dimensions (D-04): Lift,
  Token usage, Tool usage, Output quality, Book authenticity, Over/under-engineering, TS/FP/OOP
  idioms+patterns.
- **Per-table one-line finding** ("... result: parity"), then a **Caveats** section, then a
  **Verdict** framed as an empirical finding, never a pre-assumed win (13-RESULTS.md lines 39-127).
- **MANDATORY caveats** (D-11): the D-02 whole-file-diff off-grain caveat AND the D-03 Spec-axis-skip
  asymmetry MUST both be stated. Reuse the "Caveats" section shape at 13-RESULTS.md lines 84-99.
- ASCII-only; `->` / `--` / `[OK]`; public-repo hygiene allowlist scan before commit.

## Shared Patterns

### Fail-closed offline self-check (ASCII + fail())
**Source:** `.claude/skills/lz-refactor-workspace/check-evals.mjs` lines 21-24, 84-91, 136-141
**Apply to:** the Wave-0 self-check; any committed prompt/text validation
Copy the `fail()` + `process.exit(1)` fail-closed idiom and the `Buffer.from(...).some(b => b > 0x7f)`
ASCII assertion. Never write a check that can pass silently on missing input.

### Runner-owned git as an ungated child process
**Source:** `run-e2e.mjs` `git()` helper lines 282-292; apply-mode guarded destructive ops 337-353
**Apply to:** the synthetic-branch setup/teardown (Pattern D)
`spawnSync('git', ...)` from the runner is NOT gated by Claude's permission classifier; use
`mustSucceed: true` on every state-changing step and a finally-style teardown. Refuse to operate on
`PROTECTED_BRANCHES` (line 342). Confirm `git status` clean before and after (Phase-13 acceptance).

### Pass@k / Pass^k, copied verbatim
**Source:** `run-e2e.mjs` `comb`/`passAtK`/`passHatK` lines 442-468
**Apply to:** every dimension table in `grading/summary.json` + `14-RESULTS.md`
```js
function passAtK(n, c, k) { return k > n ? null : 1 - comb(n - c, k) / comb(n, k); }
function passHatK(n, c, k) { return k > n ? null : comb(c, k) / comb(n, k); }
```
Report k = 1, 3 (and the total run count where applicable). Flag saturated cells (both arms 1.00).

### DST-04 book-authenticity firewall
**Source:** 13-RESULTS.md line 10 grading-channel note; `grading/book-authenticity/claims.json`
**Apply to:** book-authenticity + idiom/pattern grading of BOTH arms
Normalize `answer.md` -> a claim list in main context; hand the list to `oracle` / `oracle-reviewer`;
per-claim pass/partial/fail in the agent's own words. Main context never reads `.oracle/` prose.
Functional idioms grade against `.planning/research/functional-depatterning-ts.md` (no-oracle tier).

## No Analog Found

None. Every new/changed file maps to an existing workspace analog.

| File | Role | Reason |
|------|------|--------|
| (none) | -- | The synthetic-branch git plumbing (Pattern D) is the only genuinely new logic, and its shape follows the existing `git()`/apply-teardown pattern; its exact command sequence is already VERIFIED in 14-RESEARCH.md "Pattern 3". |

## Metadata

**Analog search scope:** `.claude/skills/lz-refactor-workspace/` (runner, self-check, prompts,
grading records, results docs) and `.planning/phases/13-.../13-RESULTS.md`.
**Files scanned:** run-e2e.mjs (full), check-evals.mjs (full), grade-run.mjs (head), both
suite.json, e2e-nx/targets.json, e2e-nx/E2E-RESULTS.md, 13-RESULTS.md, grading/{claims,summary}.json,
2 prompt files; workspace tree + mattpocock cache dir listed.
**Pattern extraction date:** 2026-07-15
