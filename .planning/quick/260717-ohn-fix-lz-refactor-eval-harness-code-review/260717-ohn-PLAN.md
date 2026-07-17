---
quick_id: 260717-ohn
mode: quick-full
type: execute
autonomous: true
branch: gsd/lz-tdd-0.0.2-lz-refactor
task_count: 13
commits_expected: 13
files_modified:
  - .claude/skills/lz-refactor-workspace/tools/lib/section-body.mjs
  - .claude/skills/lz-refactor-workspace/tools/check-catalog.mjs
  - .claude/skills/lz-refactor-workspace/tools/check-gof.mjs
  - .claude/skills/lz-refactor-workspace/tools/check-extra-patterns.mjs
  - .claude/skills/lz-refactor-workspace/tools/check-functional.mjs
  - .claude/skills/lz-refactor-workspace/tools/check-kerievsky.mjs
  - .claude/skills/lz-refactor-workspace/tools/check-smells.mjs
  - .claude/skills/lz-refactor-workspace/tools/check-crossrefs.mjs
  - .claude/skills/lz-refactor-workspace/tools/lib/github-slug.mjs
  - .claude/skills/lz-refactor-workspace/grade-reference.mjs
  - .claude/skills/lz-refactor-workspace/eval-status.mjs
  - .claude/skills/lz-refactor-workspace/extract-samples.mjs
  - .claude/skills/lz-refactor-workspace/e2e-angular/prep-ws.mjs
  - .claude/skills/lz-refactor-workspace/e2e-angular/tabulate-mechanical.mjs
  - .claude/skills/lz-refactor-workspace/e2e-nx/selfcheck-code-review.mjs
  - .claude/skills/lz-refactor-workspace/e2e-nx/run-e2e.mjs

must_haves:
  truths:
    - "The full offline check battery (10 tools/check-*.mjs + e2e-nx/selfcheck-code-review.mjs + check-evals.mjs) exits 0 at HEAD after all 13 commits."
    - "Each of the 13 fixes is its own atomic commit; every commit leaves the checker(s) it touches GREEN (bisect-safe)."
    - "check-catalog fails a leaf whose ## Example body has no ts/js fence even when a fence exists elsewhere in the leaf (e.g. in ## Motivation)."
    - "sectionBody is defined once in a shared module and imported by check-gof, check-catalog, check-extra-patterns, and check-functional (no divergent local copies for those four)."
    - "grade-reference refuses the aggregate when a question has zero runs in every arm, instead of silently omitting it."
    - "eval-status enumerates config directories from disk, so runs under invoke_skill / no_skill are no longer hidden."
    - "No metered claude -p run is triggered; every verification is a zero-spend node invocation."
    - "All edits are ASCII-only; the maintainer commit identity stays the public gmail; no AI-attribution trailers."
  artifacts:
    - path: ".claude/skills/lz-refactor-workspace/tools/lib/section-body.mjs"
      provides: "Shared sectionBody(text, heading) helper (regex-escaped heading; returns section body or null)"
      exports: ["sectionBody"]
    - path: ".claude/skills/lz-refactor-workspace/tools/check-catalog.mjs"
      provides: "Fowler catalog checker; Example-body-scoped ts/js fence test"
      contains: "sectionBody(leaf.text, \"Example\")"
    - path: ".claude/skills/lz-refactor-workspace/grade-reference.mjs"
      provides: "Reference-eval aggregate that refuses on a zero-run question"
    - path: ".claude/skills/lz-refactor-workspace/e2e-nx/run-e2e.mjs"
      provides: "e2e runner: apply-mode orphan-commit guard + process-unique synthetic branch name"
  key_links:
    - from: "tools/check-catalog.mjs"
      to: "tools/lib/section-body.mjs"
      via: "import { sectionBody }"
      pattern: "from \"./lib/section-body.mjs\""
    - from: "tools/check-gof.mjs"
      to: "tools/lib/section-body.mjs"
      via: "import { sectionBody } (local copy removed)"
      pattern: "from \"./lib/section-body.mjs\""
    - from: "e2e-nx/selfcheck-code-review.mjs"
      to: "e2e-nx/run-e2e.mjs"
      via: "imports buildSyntheticBase; branch-name change stays review-* glob-compatible"
      pattern: "buildSyntheticBase"
---

<objective>
Fix 13 pre-triaged code-review findings in the lz-refactor eval harness (internal .mjs
tooling under `.claude/skills/lz-refactor-workspace/`). These are NOT the shipped skill --
no SKILL.md change, no /reload-plugins.

Purpose: correct false-green / data-loss / silent-drop defects in the offline checkers and
eval runners without weakening any gate.

Output: 13 atomic, bisect-safe commits (ONE per fix). Every commit leaves the offline check
battery GREEN for the checker(s) it touched.
</objective>

<constraints>
- ONE TASK = ONE COMMIT. Do NOT batch fixes. Commit after each task's verify passes. This
  exceeds the usual quick 1-3 task guideline BY DESIGN (bisect-safety).
- Stage files BY NAME (`git add <path>`), never `git add .` / `-A` / `-u`.
- ASCII-only edits. No AI-attribution trailers. Commit author identity stays the public
  maintainer gmail (already configured).
- ZERO SPEND. Never run `claude -p` or any metered eval. Every verify is a local `node`
  invocation. `node <checker>` and `node --check <file>` are offline.
- Preserve each file's existing code style. The `tools/check-*.mjs` files use the
  blank-line-around-control-flow house style; the `e2e-angular/*.mjs` prep/tabulate scripts
  and `extract-samples.mjs` fence loop use a terser compressed style -- match the file you
  are editing so the diff stays minimal.
- Do NOT re-run the checkers you did not touch as a gate for a given commit, but DO run the
  full battery once at the very end (Task 13's final verify).

Full offline battery (zero-spend, safe to run repeatedly), from the repo root:
  for c in backing catalog crossrefs extra-patterns functional gof hygiene kerievsky principles smells; do node .claude/skills/lz-refactor-workspace/tools/check-$c.mjs; done
  node .claude/skills/lz-refactor-workspace/e2e-nx/selfcheck-code-review.mjs
  node .claude/skills/lz-refactor-workspace/check-evals.mjs
</constraints>

<context>
@CLAUDE.md
@AGENTS.md

Baseline verified GREEN at HEAD before planning: all 10 checkers, selfcheck-code-review,
check-evals, grade-reference --selfcheck all exit 0. Branch: gsd/lz-tdd-0.0.2-lz-refactor.

Paths below are relative to `.claude/skills/lz-refactor-workspace/`.
</context>

<tasks>

<task type="auto">
  <name>Task 1 (FIX 1): Extract shared sectionBody + scope check-catalog Example fence test</name>
  <files>tools/lib/section-body.mjs (new), tools/check-catalog.mjs, tools/check-gof.mjs, tools/check-extra-patterns.mjs, tools/check-functional.mjs</files>
  <action>
    Create `tools/lib/section-body.mjs` exporting `sectionBody(text, heading)` -- the body of a
    level-2 `## <heading>` section (everything after the heading line up to the next `## ` or EOF),
    or null when the heading is absent. Use the REGEX-ESCAPED heading form from
    check-functional.mjs:146-155 (a private, non-exported `escapeRe` inside the new module and a
    heading regex of `^##\s+${escapeRe(heading)}\s*$` with the `m` flag, splitting on `^##\s+`). The
    escaped form is a behavior-preserving superset: every caller passes a plain single-word heading
    ("Example", "Consequences"), for which escaped and unescaped forms are byte-identical -- so
    rewiring check-functional is provably behavior-preserving.

    Remove the local `sectionBody` definitions and add `import { sectionBody } from "./lib/section-body.mjs";`
    in: check-gof.mjs (delete its local `sectionBody` at ~114-123), check-extra-patterns.mjs (delete
    its local `sectionBody` at ~67-76), and check-functional.mjs (delete ONLY its local `sectionBody`
    at ~146-155). CRITICAL: KEEP check-functional.mjs's local `escapeRe` (line ~141) -- it is still
    used at lines ~391, ~398, ~497 outside sectionBody; do not remove it.

    In check-catalog.mjs: add `import { sectionBody } from "./lib/section-body.mjs";` and change the
    whole-leaf fence test (currently `if (!/```(ts|typescript|js|javascript)\b/.test(leaf.text)) { missing.push("ts/js fence"); }`,
    ~line 269) to test the Example body ONLY, mirroring check-gof.mjs:274-278: compute
    `const exampleBody = sectionBody(leaf.text, "Example");` and push `"ts/js fence in ## Example"`
    when `exampleBody === null || !/<the same ts|typescript|js|javascript fence alternation>/.test(exampleBody)`.
    KEEP the broader Fowler `ts|typescript|js|javascript` alternation (Fowler leaves allow JS) --
    do NOT narrow it to check-gof's `ts|typescript`. This Example-body scoping is the ONLY behavior
    change in this commit; the extraction + rewiring of the other three files is behavior-preserving.
  </action>
  <verify>
    <automated>node .claude/skills/lz-refactor-workspace/tools/check-catalog.mjs (exit 0) AND node .claude/skills/lz-refactor-workspace/tools/check-gof.mjs (exit 0) AND node .claude/skills/lz-refactor-workspace/tools/check-extra-patterns.mjs (exit 0) AND node .claude/skills/lz-refactor-workspace/tools/check-functional.mjs (exit 0) AND node --check .claude/skills/lz-refactor-workspace/tools/lib/section-body.mjs</automated>
  </verify>
  <done>All four checkers exit 0; section-body.mjs exports sectionBody; the three former-local copies are gone; check-functional's escapeRe is retained; check-catalog fence test reads the Example body. Commit: `refactor(lz-refactor): share sectionBody helper; scope check-catalog Example fence test`.</done>
</task>

<task type="auto">
  <name>Task 2 (FIX 5): Exact ## Example heading match in check-gof + check-extra-patterns</name>
  <files>tools/check-gof.mjs, tools/check-extra-patterns.mjs</files>
  <action>
    In BOTH files, replace the loose Example presence check `/^##\s+Example\b/m` (check-gof.mjs
    ~line 264; check-extra-patterns.mjs ~line 217) with the exact `/^##\s+Example\s*$/m`, matching
    the WR-02 fix already in check-functional.mjs:331. This makes the presence check agree with the
    exact heading that `sectionBody` matches, so a decorated heading like `## Example (Before -> After)`
    no longer passes the presence check while sectionBody fails to find it (the misleading
    "missing ts fence in ## Example" diagnostic). Reference the pattern by its shape, not by line
    number -- Task 1 may have shifted line numbers in these two files.
  </action>
  <verify>
    <automated>node .claude/skills/lz-refactor-workspace/tools/check-gof.mjs (exit 0) AND node .claude/skills/lz-refactor-workspace/tools/check-extra-patterns.mjs (exit 0)</automated>
  </verify>
  <done>Both checkers exit 0; both use `^##\s+Example\s*$` for the Example presence check. Commit: `fix(lz-refactor): exact ## Example heading match in check-gof and check-extra-patterns`.</done>
</task>

<task type="auto">
  <name>Task 3 (FIX 7): Broaden check-kerievsky README-row link regex</name>
  <files>tools/check-kerievsky.mjs</files>
  <action>
    In `readmeRowsBySlug` (~line 225), broaden the README link regex from
    `/\]\(([a-z0-9][a-z0-9-]*)\.md\)/g` to `/\]\((?:\.\/)?([a-z0-9][a-z0-9-]*)\.md(?:#[^)\s]+)?\)/g`,
    mirroring the smell-link regexes in check-smells.mjs (lines 335 and 347). This makes the row
    parser recognize links written with a leading `./` prefix and/or a trailing `#anchor`, so
    README rows using those forms are no longer silently missed. Keep the `g` flag.
  </action>
  <verify>
    <automated>node .claude/skills/lz-refactor-workspace/tools/check-kerievsky.mjs (exit 0)</automated>
  </verify>
  <done>check-kerievsky exits 0; the README-row regex accepts `./`-prefixed and `#anchor`-suffixed links. Commit: `fix(lz-refactor): broaden check-kerievsky README-row link regex (./ prefix, #anchor)`.</done>
</task>

<task type="auto">
  <name>Task 4 (FIX 8): Per-smell recognize-by co-occurrence in check-smells</name>
  <files>tools/check-smells.mjs</files>
  <action>
    Replace the global count-equality recognize-by assertion (~lines 332-340, `recognizeCount === smellLinkCount`)
    with a PER-SMELL co-occurrence check, matching the comment's own claim ("one recognize-by line
    for every smell it links"). Inside the existing per-slug index loop (~lines 345-354), for each
    canonical smell whose leaf link IS present in the index, also assert that a `recognize by:` line
    (case-insensitive) co-occurs with that smell's row -- i.e. the index carries a recognize-by cue
    for each linked smell, not merely an equal global tally. A practical approach: split the index
    into per-smell row scopes (e.g. the text from each smell's link line up to the next smell link
    or EOF), or assert that for every linked smell slug there is a `recognize by:` occurrence
    associated with its row. Keep the existing "links all 24 smell leaves" assertion. Do NOT weaken:
    a missing recognize-by for any linked smell must FAIL.
  </action>
  <verify>
    <automated>node .claude/skills/lz-refactor-workspace/tools/check-smells.mjs (exit 0)</automated>
  </verify>
  <done>check-smells exits 0; recognize-by is enforced per linked smell (co-occurrence), not by a global count. Commit: `fix(lz-refactor): enforce per-smell recognize-by co-occurrence in check-smells`.</done>
</task>

<task type="auto">
  <name>Task 5 (FIX 13): Correct check-crossrefs header + github-slug comment</name>
  <files>tools/check-crossrefs.mjs, tools/lib/github-slug.mjs</files>
  <action>
    Take the SMALLER correct change on each (comment/header accuracy, behavior stable):
    (1) check-crossrefs.mjs header (~line 9) claims it catches "a leaf linking its own file / its own
    anchor", but `linkRe` (~line 167) requires a `.md` target, so a bare `](#anchor)` fragment
    self-link is never scanned. Correct the header claim to describe ACTUAL behavior: it catches a
    leaf linking its own FILE (via a `.md` link, including its own `.md#anchor`), but does NOT scan
    bare `](#fragment)` self-links. (Do NOT add a new fragment-scan unless it is trivial and safe --
    the comment fix is the lower-risk change and is what this task requires.)
    (2) github-slug.mjs comment (~lines 1-19): the "Matches github-slugger's rule" phrasing over-claims
    -- `.replace(/\s+/g, "-")` COLLAPSES whitespace runs to a single hyphen, whereas github-slugger
    replaces each individual space. Correct the comment so it accurately describes the collapse
    behavior and does not claim exact github-slugger parity on whitespace. Behavior of both files is
    unchanged (comment/header only).
  </action>
  <verify>
    <automated>node .claude/skills/lz-refactor-workspace/tools/check-crossrefs.mjs (exit 0) AND node --check .claude/skills/lz-refactor-workspace/tools/lib/github-slug.mjs</automated>
  </verify>
  <done>check-crossrefs exits 0; both comments describe actual behavior; no behavior change. Commit: `docs(lz-refactor): correct check-crossrefs self-link header and github-slug whitespace comment`.</done>
</task>

<task type="auto">
  <name>Task 6 (FIX 3): grade-reference refuses on a zero-run question</name>
  <files>grade-reference.mjs</files>
  <action>
    In `runAggregate` (~line 415), after `const expected = Math.max(0, ...counts);`, also push a
    shortfall when `expected === 0` (e.g. `shortfalls.push(`${t.id}: 0 runs in all arms`);`), so a
    question with zero runs in every arm makes the aggregate REFUSE (exit 1) rather than silently
    omit the question from the discriminating summary. Keep the existing per-cell unbalanced-sample
    shortfall logic intact.
  </action>
  <verify>
    <automated>node .claude/skills/lz-refactor-workspace/grade-reference.mjs --selfcheck (exit 0) AND node --check .claude/skills/lz-refactor-workspace/grade-reference.mjs</automated>
  </verify>
  <done>--selfcheck exits 0; runAggregate pushes a shortfall when a question has 0 runs across all arms. Optional offline regression: `node grade-reference.mjs --aggregate --suite .claude/skills/lz-refactor-workspace/e2e-reference` still behaves (reads disk only, zero spend). Commit: `fix(lz-refactor): grade-reference refuses aggregate on a zero-run question`.</done>
</task>

<task type="auto">
  <name>Task 7 (FIX 6): eval-status enumerates config dirs from disk</name>
  <files>eval-status.mjs</files>
  <action>
    Replace the hardcoded config loop `for (const cfg of ["with_skill", "without_skill"])` (~line 43)
    with an on-disk enumeration of the per-slug config directories: build `const slugDir = path.join(iter, slug);`
    then derive `cfgs` from `fs.readdirSync(slugDir, { withFileTypes: true })` filtered to directories
    (guard with the existing `exists(slugDir)` helper -- skip the slug when its dir is absent). Iterate
    those discovered config names instead of the hardcoded pair, so runs under invoke_skill / no_skill
    (or any other config dir present) are no longer hidden.
  </action>
  <verify>
    <automated>node --check .claude/skills/lz-refactor-workspace/eval-status.mjs</automated>
  </verify>
  <done>Syntax-check passes; config dirs come from readdirSync of the per-slug dir, not a hardcoded array. (Optional: build a tiny throwaway iteration-dir fixture in the scratchpad to confirm enumeration lists a non-default config dir.) Commit: `fix(lz-refactor): enumerate eval-status config dirs from disk`.</done>
</task>

<task type="auto">
  <name>Task 8 (FIX 12): extract-samples accepts indented code fences</name>
  <files>extract-samples.mjs</files>
  <action>
    In `extractFences` (~line 68), broaden the fence-detection regex so the three-backtick marker may
    be preceded by up to 3 leading spaces per CommonMark: change the anchored pattern from
    `^` + three-backticks + `(.*)$` to `^\s{0,3}` + three-backticks + `(.*)$` (i.e. prefix the
    existing pattern with `\s{0,3}`). This applies to both the open and close detection (the same
    `line.match`). Keep the WR-01 unterminated-fence guard (~lines 90-93) intact. Tracking the opening
    indent for the close is optional -- the catalog leaves use consistent indentation, so the prefix
    change alone is sufficient; do not add indent-stripping unless a compile fails without it.
  </action>
  <verify>
    <automated>node --check .claude/skills/lz-refactor-workspace/extract-samples.mjs AND node .claude/skills/lz-refactor-workspace/extract-samples.mjs (offline tsc over all catalog samples; exit 0)</automated>
  </verify>
  <done>Syntax-check passes AND the offline tsc harness still exits 0 (any newly-picked-up indented ts fences compile clean). Commit: `fix(lz-refactor): extract-samples accepts CommonMark-indented code fences`.</done>
</task>

<task type="auto">
  <name>Task 9 (FIX 9): prep-ws bundles only successful drove-runs</name>
  <files>e2e-angular/prep-ws.mjs</files>
  <action>
    At the run filter (~line 15), also `continue` when the run failed, mirroring prep-k5new.mjs:22
    (`m.exit_code === 0 && (m.changed_files || []).length > 0`). Change the guard so a run is bundled
    only when `meta.exit_code === 0` AND it has changed files -- i.e. `if (meta.exit_code !== 0 || (meta.changed_files || []).length === 0) continue;`.
    Match this file's terse one-line style (no added blank lines).
  </action>
  <verify>
    <automated>node --check .claude/skills/lz-refactor-workspace/e2e-angular/prep-ws.mjs</automated>
  </verify>
  <done>Syntax-check passes; non-zero-exit runs are excluded from the graded-ws bundle. (One-shot prep script -- do NOT re-run it against live data; syntax check suffices.) Commit: `fix(lz-refactor): prep-ws bundles only exit-0 drove-runs`.</done>
</task>

<task type="auto">
  <name>Task 10 (FIX 10): tabulate-mechanical excludes non-zero-exit runs from drove/lift</name>
  <files>e2e-angular/tabulate-mechanical.mjs</files>
  <action>
    In the per-cell loop (~lines 49-63), exclude non-zero-exit runs from the drove/lift computation.
    Introduce `const clean = rs.filter((r) => r.exit === 0); const nClean = clean.length;` and compute
    `drove` (clean runs with edits>0), `union` (clean names), `liftMean` (sum of clean names / nClean,
    guarded so nClean===0 yields "0.0" not NaN), and `cLift` (clean runs with names>0) over `clean`;
    base the Pass@1 / Pass^3 denominators on `nClean` too. Keep cost/turns/tools aggregated over ALL
    runs (`rs`) -- spend and tool usage are real regardless of exit. Report the drove/lift columns
    against `nClean` (e.g. `drove/nClean`), and store nClean-based fields in `out[key]`. Match the
    file's terse style.
  </action>
  <verify>
    <automated>node --check .claude/skills/lz-refactor-workspace/e2e-angular/tabulate-mechanical.mjs</automated>
  </verify>
  <done>Syntax-check passes; drove/lift/union/Pass@k are computed over exit-0 runs only with a divide-by-zero guard; cost/turns/tools unchanged. Commit: `fix(lz-refactor): tabulate-mechanical excludes non-zero-exit runs from drove/lift`.</done>
</task>

<task type="auto">
  <name>Task 11 (FIX 4): selfcheck-code-review skips crux-3 when transcript is absent</name>
  <files>e2e-nx/selfcheck-code-review.mjs</files>
  <action>
    In `checkTranscriptParse` (~line 223), stop hard-failing when the gitignored transcript
    (`results/apply/no_skill/p1/run-1/outputs/transcript.stream.jsonl`) is absent. In the catch block
    (~lines 229-231), when the read failed because the file does not exist (`err.code === 'ENOENT'`),
    log a clear SKIP warning (e.g. `console.log("  [crux 3] SKIP -- transcript absent (gitignored); run a metered apply run to exercise it")`)
    and `return` from the function instead of calling `fail(...)`. For any OTHER error, keep failing.
    When the transcript IS present, run the crux exactly as before. Do NOT change the two other cruxes.
  </action>
  <verify>
    <automated>node .claude/skills/lz-refactor-workspace/e2e-nx/selfcheck-code-review.mjs (exit 0, transcript present)</automated>
  </verify>
  <done>selfcheck exits 0 with the transcript present; when absent it logs a SKIP and still exits 0 (verify by reasoning through the ENOENT branch, or by temporarily renaming the transcript file and restoring it). Commit: `fix(lz-refactor): selfcheck-code-review skips crux-3 when the gitignored transcript is absent`.</done>
</task>

<task type="auto">
  <name>Task 12 (FIX 2): run-e2e apply mode refuses to orphan commits</name>
  <files>e2e-nx/run-e2e.mjs</files>
  <action>
    In `runOne` apply-mode guard (~lines 495-511), ADD a second refusal alongside the existing
    PROTECTED_BRANCHES denylist, BEFORE the `git reset --hard APPLY_BASE` + `git clean -fd`. If the
    current checkout has commits that the reset would orphan -- i.e.
    `git(cwd, ['rev-list', `${APPLY_BASE}..HEAD`]).stdout` (trimmed) is non-empty -- throw a clear
    error instructing the operator to use a throwaway branch at or behind APPLY_BASE before running
    apply. Keep the existing PROTECTED_BRANCHES check. Use the existing `git()` helper (returns
    `{ stdout, status, ... }`). Do NOT touch the synthetic-base / code_review path (buildSyntheticBase).
    This is a separate commit from FIX 11 (Task 13) -- keep the diff isolated to the apply-mode guard.
  </action>
  <verify>
    <automated>node --check .claude/skills/lz-refactor-workspace/e2e-nx/run-e2e.mjs AND node .claude/skills/lz-refactor-workspace/e2e-nx/selfcheck-code-review.mjs (exit 0)</automated>
  </verify>
  <done>Syntax-check passes; selfcheck exits 0 (unaffected -- FIX 2 does not touch buildSyntheticBase); apply mode now refuses when APPLY_BASE..HEAD is non-empty, in addition to the protected-branch check. Commit: `fix(lz-refactor): run-e2e apply mode refuses to orphan HEAD commits on reset`.</done>
</task>

<task type="auto">
  <name>Task 13 (FIX 11): run-e2e synthetic branch name is process-unique</name>
  <files>e2e-nx/run-e2e.mjs</files>
  <action>
    In `buildSyntheticBase` (~line 401), make the synthetic branch name process-unique to prevent
    collisions between concurrent same-target runs: change `const branchName = `review-${promptEntry.target}`;`
    to append the same uniqueness token the worktree path uses -- `review-${promptEntry.target}-${process.pid}-${Date.now()}`
    (or at minimum `-${process.pid}`). All downstream references (the protected-branch check ~403, the
    `git branch` create ~434, `worktree add` ~437, the teardown `branch -D` ~446, and the returned
    object) use the `branchName` VARIABLE, so updating the definition propagates automatically -- verify
    there are no remaining string-literal `review-<target>` references. The name still starts with
    `review-`, so the selfcheck's `branch --list 'review-*'` teardown assertion and the final console
    message ("review-* branch removed") remain correct. Keep this a separate commit from FIX 2.
  </action>
  <verify>
    <automated>node --check .claude/skills/lz-refactor-workspace/e2e-nx/run-e2e.mjs AND node .claude/skills/lz-refactor-workspace/e2e-nx/selfcheck-code-review.mjs (exit 0)</automated>
  </verify>
  <done>Syntax-check passes; selfcheck exits 0 (synthetic branch built + torn down cleanly with the new unique name matching the `review-*` glob); branch name includes process.pid. Then run the FULL offline battery once (all 10 checkers + selfcheck-code-review + check-evals, all exit 0) to confirm HEAD is GREEN after all 13 commits. Commit: `fix(lz-refactor): process-unique synthetic branch name in run-e2e buildSyntheticBase`.</done>
</task>

</tasks>

<verification>
Per-commit (bisect-safety): each task's `<verify>` command(s) exit 0 at that commit.

Final gate (after Task 13): the full offline battery is GREEN at HEAD:
- node tools/check-{backing,catalog,crossrefs,extra-patterns,functional,gof,hygiene,kerievsky,principles,smells}.mjs -- all exit 0
- node e2e-nx/selfcheck-code-review.mjs -- exit 0
- node check-evals.mjs -- exit 0

`git log --oneline` shows 13 new commits (one per fix). `git bisect` across them keeps the
touched checkers green at every step.
</verification>

<success_criteria>
- 13 atomic commits, one per fix, in the order above (FIX 1 first; FIX 2 and FIX 11 as two
  separate run-e2e.mjs commits; FIX 4 before FIX 2/11).
- Full offline battery exits 0 at HEAD.
- No metered claude -p run occurred.
- All edits ASCII-only; files staged by name; no AI-attribution trailers; maintainer commit
  identity is the public gmail.
- No gate weakened (check-catalog/gof/extra Example scoping and check-smells recognize-by are
  STRICTER, not looser; grade-reference and prep-ws/tabulate now refuse/exclude bad data).
</success_criteria>

<output>
No SUMMARY file required for a quick task beyond the standard gsd-quick close-out. Report the
13 commit SHAs and the final battery result to the operator.
</output>
