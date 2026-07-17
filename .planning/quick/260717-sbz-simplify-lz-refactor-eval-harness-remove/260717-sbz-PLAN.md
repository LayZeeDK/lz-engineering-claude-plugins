---
phase: quick-260717-sbz
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - .claude/skills/lz-refactor-workspace/tools/check-functional.mjs
  - .claude/skills/lz-refactor-workspace/tools/check-catalog.mjs
  - .claude/skills/lz-refactor-workspace/grade-run.mjs
autonomous: true
requirements: [SIMP-01, SIMP-02, SIMP-03]
must_haves:
  truths:
    - "After each commit, the checker battery (npm run check) still exits 0 -- behavior preserved."
    - "check-functional.mjs no longer defines the unused slugFor symbol and no comment names it."
    - "check-catalog.mjs no longer references the permanently-empty WEB_EXAMPLE Set; the unexpected-marker branch fires iff hasWebExample (unchanged behavior)."
    - "grade-run.mjs --selfcheck still exits 0 after the no-op stale-path derivation is replaced with args.out."
  artifacts:
    - path: ".claude/skills/lz-refactor-workspace/tools/check-functional.mjs"
      provides: "FUN-01..04 functional-catalog checker with dead slugFor const removed and comments reworded"
      contains: "githubSlug"
    - path: ".claude/skills/lz-refactor-workspace/tools/check-catalog.mjs"
      provides: "Fowler catalog checker with WEB_EXAMPLE dead branch removed, unexpected branch collapsed"
      contains: "if (hasWebExample)"
    - path: ".claude/skills/lz-refactor-workspace/grade-run.mjs"
      provides: "Deterministic grader with no-op stale-path round-trip simplified to args.out"
      contains: "const stale = args.out;"
  key_links:
    - from: ".claude/skills/lz-refactor-workspace/tools/check-functional.mjs"
      to: "npm run check battery"
      via: "node tools/check-functional.mjs"
      pattern: "SUMMARY:.*GREEN"
    - from: ".claude/skills/lz-refactor-workspace/tools/check-catalog.mjs"
      to: "npm run check battery"
      via: "node tools/check-catalog.mjs"
      pattern: "SUMMARY:.*GREEN"
    - from: ".claude/skills/lz-refactor-workspace/grade-run.mjs"
      to: "grade-run selfcheck gate"
      via: "node grade-run.mjs --selfcheck"
      pattern: "const stale = args\\.out"
---

<objective>
Simplify the lz-refactor eval harness by removing three pre-triaged dead-code / no-op findings from a /simplify pass. Each finding becomes its own bisect-safe atomic commit, each independently leaving the checker battery green.

Purpose: quality cleanup only -- delete code that can never execute and one path round-trip that reconstructs its own input. NOT a bug fix, NOT a feature change. Behavior is identical before and after every commit.

Output: three atomic commits on the current branch, plus a SUMMARY.

Scope note: SIMP-01/02/03 are the three FROZEN /simplify findings (not ROADMAP requirement IDs -- this is a quick task). Do NOT add, broaden, or remove findings. Do NOT touch Markdown or JSON. Target files live under the NON-shipped `.claude/skills/lz-refactor-workspace/` eval harness (its own package.json marks it "Not part of the shipped plugin"); the shipped skill tree is untouched.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md

# Verify-from directory for all node commands (relative paths below resolve here):
#   .claude/skills/lz-refactor-workspace/
#
# Checker battery script (package.json "check") runs all 10 tools/check-*.mjs, including
# check-catalog.mjs and check-functional.mjs (the two files edited in Tasks 1-2).
# grade-run.mjs is NOT in the battery; it guards main() behind isMainModule and exposes --selfcheck.
#
# Ground truth confirmed 2026-07-17: battery currently GREEN; catalog complete (62 Fowler).
# All three edits are behavior-preserving.

@.claude/skills/lz-refactor-workspace/package.json
@.claude/skills/lz-refactor-workspace/tools/check-functional.mjs
@.claude/skills/lz-refactor-workspace/tools/check-catalog.mjs
@.claude/skills/lz-refactor-workspace/grade-run.mjs
</context>

<tasks>

<task type="auto">
  <name>Task 1: Drop unused slugFor from check-functional eval checker</name>
  <files>.claude/skills/lz-refactor-workspace/tools/check-functional.mjs</files>
  <action>
Delete the dead `slugFor` const and its preceding comment: remove line 138 (`const slugFor = (name) => name.toLowerCase()...`) and line 137 (the `// kebab-case FILENAME slug of a canonical name...` comment). It is never called: the filename check uses `spec.slug` from the LEAVES table (each leaf carries an explicit `slug:` value) and #anchors use the imported `githubSlug`. Verified via git grep -- the only references are the two comments below plus the definition.

Then reword the two comments that still NAME `slugFor` so no dangling reference to a removed symbol remains (comment-only, zero behavior change):
- Around line 34, the sentence currently reads "...there is NO second resolver here, and no second slug function (FILENAME uses slugFor; #anchor uses the imported githubSlug...". Reword the parenthetical to describe the rule generically without naming a function -- e.g. the FILENAME is the kebab-case slug of the leaf H1 while the #anchor uses the imported githubSlug, so a demanded anchor can never diverge from what check-crossrefs validates (WR-02).
- Around line 57, the sentence currently reads "...`slug` is slugFor(name) == the filename AND githubSlug(name)...". Reword to state `slug` is the kebab-case filename slug of `name`, equal to the filename and to githubSlug(name) (they agree -- all names are alphanumeric + single spaces + one hyphen).

Do NOT touch `escapeRe` (line ~143) -- it is still used at the served sub-heading and Correspondence back-link matches. Do NOT touch the LEAVES table or any other logic.
  </action>
  <verify>
    <automated>node tools/check-functional.mjs (from .claude/skills/lz-refactor-workspace/) exits 0; node --check tools/check-functional.mjs clean</automated>
  </verify>
  <done>slugFor const removed, comments no longer name it, checker green.</done>
  <commit>
Stage ONLY this file by name (never git add . / -A / -u), then commit:
  git commit message: "refactor(lz-refactor): drop unused slugFor from check-functional eval checker"
Author/committer identity is already the public gmail; this is a code edit with no email content.
  </commit>
</task>

<task type="auto">
  <name>Task 2: Remove dead WEB_EXAMPLE branch from check-catalog eval checker</name>
  <files>.claude/skills/lz-refactor-workspace/tools/check-catalog.mjs</files>
  <action>
Remove the permanently-empty Set declaration on line 105: `const WEB_EXAMPLE = new Set();`.

Delete the now-unreachable required-marker branch (lines 294-296) in full:
`if (WEB_EXAMPLE.has(name) && !hasWebExample) { missing.push("[web-example] marker"); }` -- its condition is always false against an empty Set, so it never fired.

Collapse the unexpected-marker branch (line 298) from `if (!WEB_EXAMPLE.has(name) && hasWebExample)` to `if (hasWebExample)` -- the `!WEB_EXAMPLE.has(name)` term was always true against the empty Set. Keep the branch body (`missing.push("unexpected [web-example] marker")`) unchanged.

Keep the existing provenance comment on lines 102-103 documenting that there is no web-example leaf (the owner reversed the Split Phase [web-example] label). Do NOT touch the WEB_ONLY Set or its two branches. Do NOT touch any other logic.

This is behavior-identical: the required branch never fired (empty Set), and the unexpected branch fires iff `hasWebExample` both before and after.
  </action>
  <verify>
    <automated>node tools/check-catalog.mjs (from .claude/skills/lz-refactor-workspace/) exits 0; node --check tools/check-catalog.mjs clean</automated>
  </verify>
  <done>WEB_EXAMPLE const and its unreachable branch removed, unexpected branch collapsed to `if (hasWebExample)`, checker green.</done>
  <commit>
Stage ONLY this file by name (never git add . / -A / -u), then commit:
  git commit message: "refactor(lz-refactor): remove dead WEB_EXAMPLE branch from check-catalog eval checker"
Author/committer identity is already the public gmail; this is a code edit with no email content.
  </commit>
</task>

<task type="auto">
  <name>Task 3: Simplify no-op stale-path derivation in grade-run</name>
  <files>.claude/skills/lz-refactor-workspace/grade-run.mjs</files>
  <action>
At line ~598, replace `const stale = path.join(path.dirname(args.out), path.basename(args.out));` with `const stale = args.out;`.

`path.join(path.dirname(p), path.basename(p))` just reconstructs `p`, and the value feeds `fs.existsSync` / `fs.rmSync`, so path normalization is irrelevant -- behavior-preserving. Keep the surrounding fail-closed (IN-02) comment and the `if (fs.existsSync(stale)) { fs.rmSync(stale); }` body unchanged.
  </action>
  <verify>
    <automated>node --check grade-run.mjs clean; node grade-run.mjs --selfcheck (from .claude/skills/lz-refactor-workspace/) exits 0</automated>
  </verify>
  <done>no-op path round-trip replaced with `args.out`, selfcheck green.</done>
  <commit>
Stage ONLY this file by name (never git add . / -A / -u), then commit:
  git commit message: "refactor(lz-refactor): simplify no-op stale-path derivation in grade-run"
Author/committer identity is already the public gmail; this is a code edit with no email content.
  </commit>
</task>

</tasks>

<threat_model>
## Trust Boundaries

No new trust boundaries. All three edits are dead-code / no-op removals inside the NON-shipped internal eval harness (`.claude/skills/lz-refactor-workspace/`). No new inputs, no new file/network reads, no package installs, no change to the shipped plugin tree.

## STRIDE Threat Register

| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-sbz-01 | Tampering | behavior-preserving code edits | accept | Each edit removes unreachable code (empty-Set branch, uncalled const) or a self-reconstructing path round-trip; no logic path changes. Bisect-safety guaranteed by re-running the checker battery per commit. |
| T-sbz-SC | Tampering | npm/pip/cargo installs | accept | No installs performed; no dependency graph change. |
</threat_model>

<verification>
Per-commit (bisect-safe -- each commit independently green):
- Task 1 commit: `node tools/check-functional.mjs` exits 0.
- Task 2 commit: `node tools/check-catalog.mjs` exits 0.
- Task 3 commit: `node grade-run.mjs --selfcheck` exits 0.

Final battery (from `.claude/skills/lz-refactor-workspace/`), after all three commits:
- `npm run check` exits 0 (all 10 checkers GREEN, including the two edited in Tasks 1-2).
- `node grade-run.mjs --selfcheck` exits 0.
- `node --check` clean on all three edited files.

Git hygiene:
- Exactly three commits, one file each, staged by name (no `git add .`).
- No Markdown or JSON files touched.
- Commit author/committer email is the public gmail; no email content introduced.
</verification>

<success_criteria>
- slugFor const removed from check-functional.mjs; no comment names it; checker green.
- WEB_EXAMPLE const + its unreachable required branch removed from check-catalog.mjs; unexpected branch collapsed to `if (hasWebExample)`; checker green.
- grade-run.mjs stale-path derivation replaced with `const stale = args.out;`; --selfcheck green.
- `npm run check` GREEN and `grade-run.mjs --selfcheck` exit 0 after all commits.
- Three atomic, bisect-safe commits with the exact conventional messages above.
</success_criteria>

<output>
Create `.planning/quick/260717-sbz-simplify-lz-refactor-eval-harness-remove/260717-sbz-SUMMARY.md` when done.
</output>
