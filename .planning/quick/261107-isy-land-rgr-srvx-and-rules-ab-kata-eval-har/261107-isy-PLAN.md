---
phase: quick-261107-isy
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - .claude/skills/lz-red-workspace/slim-arms.sh
  - .claude/skills/lz-red-workspace/e2e-rgr-srvx/README.md
  - .claude/skills/lz-red-workspace/e2e-rgr-srvx/make-template.sh
  - .claude/skills/lz-red-workspace/e2e-rgr-srvx/control.sh
  - .claude/skills/lz-red-workspace/e2e-rgr-srvx/selfcheck.sh
  - .claude/skills/lz-red-workspace/e2e-rgr-srvx/run-rgr.sh
  - .claude/skills/lz-red-workspace/e2e-rgr-srvx/grade-rgr.mjs
  - .claude/skills/lz-red-workspace/e2e-rgr-srvx/prompts/T1.md
  - .claude/skills/lz-red-workspace/e2e-rgr-srvx/prompts/T2.md
  - .claude/skills/lz-red-workspace/e2e-rgr-srvx/prompts/T3.md
  - .claude/skills/lz-red-workspace/e2e-rgr-srvx/prompts/control.md
  - .claude/skills/lz-red-workspace/rules-ab-kata/run-ab.sh
  - .claude/skills/lz-red-workspace/rules-ab-kata/grade.mjs
  - .claude/skills/lz-red-workspace/rules-ab-kata/task.md
  - .claude/skills/lz-red-workspace/rules-ab-kata/RESULTS.md
  - .claude/skills/lz-red-workspace/rules-ab-kata/template/package.json
  - .claude/skills/lz-red-workspace/rules-ab-kata/template/package-lock.json
  - .claude/skills/lz-red-workspace/rules-ab-kata/template/tsconfig.json
  - .claude/skills/lz-red-workspace/rules-ab-kata/hidden/acceptance.spec.ts
autonomous: true
requirements: [quick-261107-isy]

must_haves:
  truths:
    - "Both harnesses live under .claude/skills/lz-red-workspace/ and nothing under plugins/ changes"
    - "No landed file holds a session-temp path or a home-folder absolute path; every path is derived from the script's own folder, $HOME, or an env var with a D:/tmp/slim-claude-p default"
    - "The plugin under test is packaged by a script step from git archive <ref>:plugins/lz-tdd (default d02204d, env-overridable) into D:/tmp/slim-claude-p/pkg/<ref>, reused when already present"
    - "Arm b's rules folder is generated at run time under D:/tmp/slim-claude-p/rules-b from $HOME's lars-mode test-first.md plus a CLAUDE.md holding the Test-first bullet; test-first.md is never committed"
    - "run-rgr.sh --dry-run T3 a 1 T3 b 1 exits 0 with a cwd under D:/tmp and long-path plugin and rules args"
    - "selfcheck.sh T3 shows hidden failures on the parent and all hidden tests passing on the reference"
    - "run-ab.sh --dry-run sets up one run folder per arm and prints run-slim's dry-run args"
    - "Each suite's out/ is git-ignored and the only email-shaped token in any landed file is the approved public gmail"
    - "No claude -p session runs without --dry-run (no metered spend)"
  artifacts:
    - path: .claude/skills/lz-red-workspace/slim-arms.sh
      provides: "Shared, sourced helper: SLIM_ROOT default, plugin packaging step, arm-b rules folder generation"
    - path: .claude/skills/lz-red-workspace/e2e-rgr-srvx/README.md
      provides: "Purpose, arms, task construction, measured controls, how to run, metered-run gate"
    - path: .claude/skills/lz-red-workspace/e2e-rgr-srvx/run-rgr.sh
      provides: "Queue runner with --dry-run, MODEL/PROMPT overrides, stop-on-first-failure"
    - path: .claude/skills/lz-red-workspace/rules-ab-kata/run-ab.sh
      provides: "Kata A/B runner with new --dry-run"
  key_links:
    - from: run-rgr.sh and run-ab.sh
      to: slim-arms.sh
      via: "source of the shared helper (package + rules-b generation)"
    - from: run-rgr.sh / run-ab.sh
      to: "~/.claude/references/slim-claude-p/run-slim.ts"
      via: "node $HOME/.claude/references/slim-claude-p/run-slim.ts --cwd <D:/tmp run folder> --plugin-dir <pkg> --rules <none|rules-b>"
    - from: grade-rgr.mjs
      to: "D:/tmp/slim-claude-p/rules-b"
      via: "cycle-log search folder (was the scratchpad rules-b)"
---

<objective>
Land two eval harnesses from the session temp folder (called S below; full path in `<context>`) into the repo under
`.claude/skills/lz-red-workspace/`: (A) `e2e-rgr-srvx/`, a red-green-refactor outcome eval on three post-cutoff
h3js/srvx commits, and (B) `rules-ab-kata/`, the shippingCost kata A/B that already ran (6 sessions). Make every path
derived or env-driven, generate the plugin package and the arm-b rules folder at run time, and prove the result with
dry runs and the grader self-check. No metered run.

Purpose: the harnesses only exist in a session folder that will be deleted; the metered Opus round (3 tasks x 2 arms
x k=3) needs a reproducible, committed harness before Lars decides on it.
Output: two commits, one per suite (the shared helper lands with suite A).

Assumption (stated, not asked): the D:/tmp work folders keep their current names, `rgr-eval` for suite A and
`rules-ab` for suite B, so the srvx templates already built at D:/tmp/slim-claude-p/rgr-eval/T1..T3 are reused and
RESULTS.md's run-folder paths stay true.
</objective>

<execution_context>
@~/.claude/gsd-core/workflows/execute-plan.md
@~/.claude/gsd-core/templates/summary.md
</execution_context>

<context>
@./CLAUDE.md
@./AGENTS.md
@~/.claude/references/slim-claude-p.md

Source folder S (read only; never copy this path into a landed file):
C:/Users/LarsGyrupBrinkNielse/AppData/Local/Temp/claude/D--projects-github-LayZeeDK-lz-engineering-claude-plugins/0944bfb7-575c-41e6-b8b2-c331fd77ccb7/scratchpad

Sources to land:
- S/rgr-eval: make-template.sh, control.sh, selfcheck.sh, run-rgr.sh, grade-rgr.mjs, prompts/T1.md, T2.md, T3.md,
  control.md. NOT PLAN.md (that is the arm-C proposal, not part of this harness) and NOT out/.
- S/rules-ab: run-ab.sh, grade.mjs, task.md, RESULTS.md, hidden/acceptance.spec.ts, template/package.json,
  template/package-lock.json, template/tsconfig.json (template/src is empty: nothing to land). NOT the .bak files,
  cycle logs, out/, ctl-cwd/, shared/, deny-probe.md, control-prompt.md, rules-b/test-first.md.
- S/rules-ab/rules-b/CLAUDE.md: source of the Test-first bullet text only (its path gets rewritten).
- S/rgr-eval/out/run-T1-a-ctl.json and run-T1-b-ctl.json: the Haiku setup control results, read only to confirm the
  README's control facts. They hold local paths: never land them.

Facts already established by the planner:
- Repo .gitignore line 7 `out/` already ignores both suites' out/ folders (checked with git check-ignore). The
  `.claude/skills/lz-red-workspace/**/run-*/` rule matches directories only, so run-rgr.sh and run-ab.sh are tracked.
- `git config user.email` is already larsbrinknielsen@gmail.com.
- D:/tmp/slim-claude-p/rgr-eval/T1, T2, T3 already hold template/, hidden/, after-src/ (built by make-template.sh).
  No runs/ folders exist there or under D:/tmp/slim-claude-p/rules-ab. D:/tmp/slim-claude-p/pkg does not exist yet.
- The Test-first reference exists at $HOME/.claude/skills/lars-mode/references/test-first.md.
- run-slim.ts expands --cwd/--plugin-dir/--rules to long link-resolved paths, refuses a cwd inside the home folder,
  and `--dry-run` prints the arguments without starting a session. Its --out files hold local paths (keep them in
  the ignored out/).
- A pre-scan of all S sources with an email-shaped regex found no email tokens. The setup scripts' git identity
  `eval@localhost` is a non-routable placeholder with no dotted domain and is not an identity of Lars.
</context>

<tasks>

<task type="auto">
  <name>Task 1: Shared slim-arms helper and the e2e-rgr-srvx suite (commit 1)</name>
  <files>.claude/skills/lz-red-workspace/slim-arms.sh, .claude/skills/lz-red-workspace/e2e-rgr-srvx/README.md, .claude/skills/lz-red-workspace/e2e-rgr-srvx/make-template.sh, .claude/skills/lz-red-workspace/e2e-rgr-srvx/control.sh, .claude/skills/lz-red-workspace/e2e-rgr-srvx/selfcheck.sh, .claude/skills/lz-red-workspace/e2e-rgr-srvx/run-rgr.sh, .claude/skills/lz-red-workspace/e2e-rgr-srvx/grade-rgr.mjs, .claude/skills/lz-red-workspace/e2e-rgr-srvx/prompts/T1.md, .claude/skills/lz-red-workspace/e2e-rgr-srvx/prompts/T2.md, .claude/skills/lz-red-workspace/e2e-rgr-srvx/prompts/T3.md, .claude/skills/lz-red-workspace/e2e-rgr-srvx/prompts/control.md</files>
  <action>
0. Record BASE = `git rev-parse HEAD` before touching anything; the plugins/ checks diff against it.
1. Create `.claude/skills/lz-red-workspace/slim-arms.sh`, a bash file the two runners `source` (no shebang needed,
   not executable on its own). It owns the knowledge both suites share, so the Test-first bullet text exists once:
   - `slim_root="${SLIM_ROOT:-D:/tmp/slim-claude-p}"`.
   - Function `ensure_pkg`: ref from `${LZ_TDD_REF:-d02204d}`; `pkg_dir="$slim_root/pkg/$ref"`. When
     `$pkg_dir/.claude-plugin/plugin.json` already exists, reuse it. Otherwise verify the ref resolves to a commit
     (`git rev-parse --verify "$ref^{commit}"` run inside the helper's own folder, located with
     `${BASH_SOURCE[0]}`), extract `git archive "$ref:plugins/lz-tdd" | tar -x -C` into a temp sibling folder,
     and rename it to `$pkg_dir` only after tar succeeds, so a failed extract is never reused. Fail loudly (return 1
     with an `[ERROR]` line) when the ref is unknown or plugin.json is missing after extraction.
   - Function `ensure_rules_b`: `rules_b="$slim_root/rules-b"`; `mkdir -p`; copy
     `$HOME/.claude/skills/lars-mode/references/test-first.md` into it (fail loudly when the source is missing); then
     write `$rules_b/CLAUDE.md` with the Test-first bullet copied word for word from S/rules-ab/rules-b/CLAUDE.md,
     except that the backticked path becomes the generated folder's long Windows path, computed with
     `cygpath -m -l "$rules_b"` plus `/test-first.md` (long form matters: run-slim misbehaves on 8.3 short paths).
     Overwrite both files on every call but never delete the folder: B sessions have written cycle logs there and the
     grader reads them after the run. Print the sha256 of the copied test-first.md (`sha256sum`) so each run log
     records which version of the rule ran. Do not commit test-first.md anywhere (it is Lars's private skill
     reference).
2. Copy the S/rgr-eval sources into `e2e-rgr-srvx/` (scripts at the suite root, prompts under prompts/), then change:
   - make-template.sh, control.sh, selfcheck.sh: source `../slim-arms.sh` (path from `$(dirname "$0")`) for
     `slim_root`; task root becomes `$slim_root/rgr-eval/$task`; the srvx clone comes from
     `${SRVX_REPO:-D:/projects/github/h3js/srvx}`. Templates, hidden suites and reference sources stay built from
     the local clone at run time under D:/tmp, never in the repo.
   - run-rgr.sh: drop the hardcoded session-folder variable `S=` and the `E=` derived from it. `here` = the script's
     own folder; outputs go to `$here/out/run-TASK-ARM-K.json`; prompts from `$here/prompts/${PROMPT:-$task}.md`.
     Call `ensure_pkg` once before the loop (exit 1 if it fails) and pass `--plugin-dir "$pkg_dir"`. Arm b calls
     `ensure_rules_b` (once, before the loop, is fine) and passes `--rules "$rules_b"`; arm a passes `--rules none`.
     Invoke `node "$HOME/.claude/references/slim-claude-p/run-slim.ts"` with `--cwd` under
     `$slim_root/rgr-eval/TASK/runs/ARM-K`. Keep unchanged: the ALLOW/DENY lists, `--dry-run` handling,
     `MODEL` (default opus) and `PROMPT` env overrides, `--timeout-min 30`, the per-run fresh template copy + `pnpm
     install --frozen-lockfile --prefer-offline` + `git init` + base commit + `git tag base`, and the
     stop-the-queue-on-first-failure guard with its spend-limit comment. Update the header comment: arm b = packaged
     lz-tdd + the Test-first rule folder generated by slim-arms.sh.
   - grade-rgr.mjs: `tasksRoot` = `join(process.env.SLIM_ROOT ?? 'D:/tmp/slim-claude-p', 'rgr-eval')`; `rulesDir` =
     the same root joined with `rules-b` (it is a cycle-log search place). Keep the transcript-based denial count,
     the `models=` report, `--outcome-only`, and the out/ location next to the script. House style: blank line around
     control flow and returns, braces on every body, lowerCamelCase consts; comments only for a non-obvious why
     (keep the existing two why-comments).
   - Prompts: copy unchanged unless one names a session-temp or home-folder path (none do today).
3. Write `e2e-rgr-srvx/README.md` (plain prose, ASCII, no banned words from the global style list) covering, in this
   order: purpose (full red-green-refactor outcome eval on three post-cutoff h3js/srvx commits: T1 555a793
   `createError` option for body-limit, T2 d946356 cookie de-duplication on AWS Lambda, T3 5866bc7 content-type
   text/binary detection); arms (a = packaged lz-tdd only, `--rules none`; b = the same plus the Test-first rule
   folder generated by `../slim-arms.sh`, which copies the reference from the owner's lars-mode skill at run time and
   is never committed); how a task is built (template = the commit's parent from the local srvx clone, hidden suite =
   the commit's own test files, reference = the commit's source files; all rebuilt by `make-template.sh TASK
   COMMIT` under D:/tmp/slim-claude-p/rgr-eval/TASK); the measured controls (hidden suite fails on the parent:
   T1 5 of 33, T2 3 of 93, T3 2 of 119, and passes fully on the commit, via control.sh; `selfcheck.sh` shows the
   grader separates parent from reference; a Haiku setup control passed both arms on 2026-11-07, showing the
   allowed and refused commands and that the Test-first rule reaches the main session and subagents only in arm b);
   env vars (`SLIM_ROOT`, `LZ_TDD_REF`, `SRVX_REPO`, `MODEL`, `PROMPT`); how to run (make-template per task,
   control.sh, selfcheck.sh, `run-rgr.sh --dry-run ...`, the Haiku control as
   `MODEL=haiku PROMPT=control bash run-rgr.sh T1 a ctl T1 b ctl`, then `node grade-rgr.mjs TASK-ARM-K ...`);
   and a closing line that the metered Opus run (3 tasks x 2 arms x k=3, one session at a time) is blocked until
   Lars gives the go-ahead. Mention that out/ files hold local paths and stay git-ignored. Confirm the control facts
   against S/rgr-eval/out/run-T1-a-ctl.json and run-T1-b-ctl.json; if they disagree with the facts above, report the
   difference instead of guessing.
4. Run the Task 1 checks in `<verify>` (never run a session without `--dry-run`). Then run the hygiene scan from
   `<verification>` over the Task 1 files, stage the files by name, and commit with `git commit -F <message file>`:
   subject `test(lz-red-workspace): land the e2e-rgr-srvx red-green-refactor eval harness`, no AI attribution.
   Confirm with `git log --oneline -1`.
  </action>
  <verify>
    <automated>bash .claude/skills/lz-red-workspace/e2e-rgr-srvx/run-rgr.sh --dry-run T3 a 1 T3 b 1 (exit 0; output shows the cwd under D:/tmp/slim-claude-p/rgr-eval/T3/runs, the plugin dir under slim-claude-p pkg d02204d, arm a `--rules none`, arm b rules under slim-claude-p rules-b, and no `~1` short path; first run `bash make-template.sh T3 5866bc7` only if D:/tmp/slim-claude-p/rgr-eval/T3/template is missing)</automated>
    <automated>bash .claude/skills/lz-red-workspace/e2e-rgr-srvx/selfcheck.sh T3 (parent line: hiddenAllPass false with hidden 117/119; reference line: hiddenAllPass true with hidden 119/119)</automated>
    <automated>node --check .claude/skills/lz-red-workspace/e2e-rgr-srvx/grade-rgr.mjs</automated>
    <automated>test -f D:/tmp/slim-claude-p/pkg/d02204d/.claude-plugin/plugin.json and D:/tmp/slim-claude-p/rules-b/CLAUDE.md names D:/tmp/slim-claude-p/rules-b/test-first.md; git ls-files reports no test-first.md under .claude/skills/lz-red-workspace</automated>
    <automated>git check-ignore -v .claude/skills/lz-red-workspace/e2e-rgr-srvx/out/run-T3-a-1.json (ignored by the `out/` rule)</automated>
    <automated>git diff --name-only "$BASE" COMMIT1_SHA -- plugins (empty; BASE = the HEAD sha recorded before Task 1 started, COMMIT1_SHA = the sha of commit 1)</automated>
  </verify>
  <done>Commit 1 holds slim-arms.sh and the e2e-rgr-srvx suite with README; dry run exits 0 with long D:/tmp paths and the generated rules-b folder for arm b; selfcheck separates parent (2 hidden failures) from reference (all green); hygiene scan clean; plugins/ untouched.</done>
</task>

<task type="auto">
  <name>Task 2: rules-ab-kata suite with a --dry-run (commit 2)</name>
  <files>.claude/skills/lz-red-workspace/rules-ab-kata/run-ab.sh, .claude/skills/lz-red-workspace/rules-ab-kata/grade.mjs, .claude/skills/lz-red-workspace/rules-ab-kata/task.md, .claude/skills/lz-red-workspace/rules-ab-kata/RESULTS.md, .claude/skills/lz-red-workspace/rules-ab-kata/template/package.json, .claude/skills/lz-red-workspace/rules-ab-kata/template/package-lock.json, .claude/skills/lz-red-workspace/rules-ab-kata/template/tsconfig.json, .claude/skills/lz-red-workspace/rules-ab-kata/hidden/acceptance.spec.ts</files>
  <action>
1. Copy the listed S/rules-ab sources into `rules-ab-kata/` (never node_modules; task.md, template files and the
   hidden spec unchanged).
2. run-ab.sh: drop the hardcoded session-folder variables (`L=`, `R=`). `here` = the script's own folder; source
   `../slim-arms.sh`; template from `$here/template`, prompt `$here/task.md`, outputs `$here/out/run-<arm>-<k>.json`
   (mkdir -p out). Run folders under `$slim_root/rules-ab/runs/<arm>-<k>` (keep the existing "outside the home
   folder" why-comment and the `rm -rf "$dir" "$dir".*`). Call `ensure_pkg` before the loop and pass
   `--plugin-dir "$pkg_dir"`; arm b passes `--rules "$rules_b"` from `ensure_rules_b`, arm a `--rules none`. Use
   `node "$HOME/.claude/references/slim-claude-p/run-slim.ts"`. Add `--dry-run` as the optional first argument,
   handled the same way as run-rgr.sh: it still sets up each run folder (copy + `npm ci`) and passes `--dry-run` to
   run-slim so only the arguments print. Add the same stop-the-queue-on-first-failure guard run-rgr.sh has (the
   reference doc requires it; the original kata script lacked it). Keep the ALLOW/DENY lists, `--model opus`,
   `--timeout-min 25`. Update the header Usage line to `run-ab.sh [--dry-run] <arm a|b> <k> [...]` and the arm-b
   description to the generated rules folder; replace the comment that names the short-path user folder with one
   saying long paths are required because run-slim refuses reads through 8.3 short paths.
3. grade.mjs: drop the `<rules-ab dir>` argument; results come from `join(import.meta.dirname, 'out')` and the hidden
   spec from `join(import.meta.dirname, 'hidden', 'acceptance.spec.ts')`; `runsRoot` =
   `join(process.env.SLIM_ROOT ?? 'D:/tmp/slim-claude-p', 'rules-ab', 'runs')`. Update the Usage comment to
   `node grade.mjs <arm-k> [...]`. Leave its metrics logic as is. Same house style as Task 1.
4. RESULTS.md: keep every measured number and the verdict. Rewrite only the provenance wording: the session-folder
   package name (`pkg/landed2`) becomes "lz-tdd packaged at d02204d by run-ab.sh"; the sentence about where B's
   cycle logs landed names "the harness folder and its rules folder" instead of the session temp folder; the
   `context-probe.mjs` mention becomes "a context probe (not landed)". Add one line that `--rules` for arm B now
   points at the folder slim-arms.sh generates.
5. Run the Task 2 checks in `<verify>`, then the hygiene scan from `<verification>` over the Task 2 files. Stage by
   name and commit with `git commit -F <message file>`: subject
   `test(lz-red-workspace): land the rules-ab shippingCost kata harness`, no AI attribution. Confirm with
   `git log --oneline -1`.
  </action>
  <verify>
    <automated>bash .claude/skills/lz-red-workspace/rules-ab-kata/run-ab.sh --dry-run a 1 b 1 (exit 0; each arm prints run-slim dry-run args with cwd D:/tmp/slim-claude-p/rules-ab/runs/<arm>-1 in long form, the pkg d02204d plugin dir, arm a `--rules none`, arm b the generated rules-b folder, no `~1`)</automated>
    <automated>node --check .claude/skills/lz-red-workspace/rules-ab-kata/grade.mjs</automated>
    <automated>git check-ignore -v .claude/skills/lz-red-workspace/rules-ab-kata/out/run-a-1.json (ignored by the `out/` rule)</automated>
    <automated>git ls-files .claude/skills/lz-red-workspace/rules-ab-kata lists exactly the 8 files of this task (no node_modules, no out/)</automated>
  </verify>
  <done>Commit 2 holds the kata suite; its dry run sets up a and b run folders and prints run-slim's args with the generated rules folder for b; RESULTS.md numbers unchanged and free of session paths; hygiene scan clean.</done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| local machine -> public repo | Landed files and commits become public; local paths, private skill text and identities can leak |
| harness -> metered claude -p | A wrong flag or a missing --dry-run spends the org budget without Lars's go-ahead |

## STRIDE Threat Register

| Threat ID | Category | Component | Severity | Disposition | Mitigation Plan |
|-----------|----------|-----------|----------|-------------|-----------------|
| T-isy-01 | Information disclosure | all landed files, commit messages, commit identity | high | mitigate | Allowlist-inversion email scan (only the public gmail may appear) plus the path-literal scan in `<verification>` before each commit; `git log -1 --format='%ae %ce'` shows the gmail for both |
| T-isy-02 | Information disclosure | test-first.md (private lars-mode reference) | medium | mitigate | Copied at run time into D:/tmp only by slim-arms.sh; `git ls-files` check proves no copy is tracked |
| T-isy-03 | Information disclosure | run-slim --out JSON (local paths, prompts) | medium | mitigate | Written only to each suite's out/, proven ignored with git check-ignore |
| T-isy-04 | Elevation of privilege / spend | run-rgr.sh, run-ab.sh | medium | mitigate | Executor runs only with --dry-run; both runners stop the queue on the first non-zero exit |
| T-isy-05 | Tampering | reused package folder | low | mitigate | Extract into a temp sibling and rename only after tar succeeds; reuse only when plugin.json exists |
</threat_model>

<verification>
Hygiene scan, run before each commit over that task's landed files (list them explicitly, never a directory walk that
could reach out/):

1. Email allowlist-inversion: `rg -o -N --no-filename '[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}' <files> | sort -u`
   prints nothing or only `larsbrinknielsen@gmail.com`. Positive control first: run the same regex on a temp file
   holding the gmail and confirm one hit, so a zero is meaningful. Any other hit: stop, do not commit, report it.
   Never type any other specific address or domain as a needle.
2. Path literals: `rg -n -i 'scratchpad|AppData|C:[/\\]Users|LARSGY~1' <files>` exits 1 (check the exit code: 2
   means the command failed). Positive control: the same pattern on S/rgr-eval/run-rgr.sh exits 0.
3. `git log -1 --format='%ae %ce'` after each commit prints the gmail twice; the message has no AI attribution.
4. `git diff --name-only BASE COMMIT2_SHA -- plugins` is empty (BASE = the HEAD sha recorded before Task 1 started,
   COMMIT2_SHA = the sha of commit 2; pinned shas, because another session may commit in between).
5. `git status --short` shows no stray untracked files under the two suite folders (out/ is ignored).
</verification>

<success_criteria>
- Two Conventional Commits, one per suite, files staged by name, author and committer the public gmail.
- Both dry runs exit 0 with long D:/tmp paths; arm b points at the generated D:/tmp/slim-claude-p/rules-b.
- selfcheck.sh T3: parent 2 of 119 hidden tests failing, reference 119 of 119 passing.
- No landed file holds a session-temp or home-folder absolute path, test-first.md, or any email other than the gmail.
- Zero metered spend: no session started without --dry-run.
</success_criteria>

<output>
Create `.planning/quick/261107-isy-land-rgr-srvx-and-rules-ab-kata-eval-har/261107-isy-SUMMARY.md` when done
</output>
