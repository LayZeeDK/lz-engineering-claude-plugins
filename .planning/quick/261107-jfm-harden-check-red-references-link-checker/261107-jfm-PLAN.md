---
phase: quick-261107-jfm
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - .claude/skills/lz-red-workspace/tools/lib/package-links.mjs
  - .claude/skills/lz-red-workspace/tools/package-links.selftest.mjs
  - .claude/skills/lz-red-workspace/tools/lib/pipe-table.mjs
  - .claude/skills/lz-red-workspace/tools/check-red-references.mjs
  - .claude/skills/lz-red-workspace/package.json
autonomous: true
requirements:
  - QUICK-261107-jfm
must_haves:
  truths:
    - "F1: a relative link whose target exists on disk but is not in `git ls-files plugins` fails the N2 link gate (untracked, git-ignored and junction-reached files are all absent from the index)"
    - "F4: a relative link whose path differs only in letter case from a tracked file fails, on Windows as well as Linux"
    - "F2: a target that leaves the plugin package (relative escape, UNC, root-absolute, drive-letter) is reported LEAVES PACKAGE with zero node:fs calls made while checking it"
    - "F3 (part): drive-letter targets (`C:/x`, `C:\\x`, `c:..\\x`) classify as `absolute` instead of `scheme` and fail the gate"
    - "Each of F1, F2, F3, F4 has a selftest case that was run and FAILED against the pre-fix port before the fix, and passes after it"
    - "check-red-references.mjs stays GREEN on the current tree at exactly 125 checks, and `npm run check` (now including the new selftest) exits 0"
    - "plugins/ is byte-unchanged; no claude -p or other metered run happens"
  artifacts:
    - path: .claude/skills/lz-red-workspace/tools/lib/package-links.mjs
      provides: "pure link-vs-package core over (target, source path, tracked set)"
      exports: ["packageLinkProblems"]
    - path: .claude/skills/lz-red-workspace/tools/package-links.selftest.mjs
      provides: "red-first fixtures for F1-F4 plus a regression floor"
    - path: .claude/skills/lz-red-workspace/package.json
      provides: "check script runs the new selftest"
      contains: "node tools/package-links.selftest.mjs"
  key_links:
    - from: .claude/skills/lz-red-workspace/tools/check-red-references.mjs
      to: .claude/skills/lz-red-workspace/tools/lib/package-links.mjs
      via: "N2 gate calls packageLinkProblems with a Set built from `git ls-files -z -- plugins`"
    - from: .claude/skills/lz-red-workspace/tools/lib/package-links.mjs
      to: .claude/skills/lz-red-workspace/tools/lib/pipe-table.mjs
      via: "target.kind from findLinkTargets/linkKind decides absolute vs relative"
---

<objective>
Harden the N2 relative-link gate in `check-red-references.mjs` per the ft7 security review (F1, F2, F3 part, F4): resolve link targets lexically against the git-tracked set instead of the disk, compare case-sensitively, reject package escapes before any filesystem access, and fail drive-letter targets as absolute. Each fix gets a red-first selftest over a pure function, so no real git repo or fixture tree is needed.

Purpose: the gate claims "resolves inside its plugin package", and the package is the git-tracked files of `plugins/<plugin>/`. Today it checks the Windows disk, which is case-insensitive and includes untracked and junction-reached files, and it touches UNC paths before rejecting them.
Output: `tools/lib/package-links.mjs`, `tools/package-links.selftest.mjs`, a two-line `linkKind` change, the N2 block rewired, and `check` running the new selftest.
</objective>

<execution_context>
@~/.claude/gsd-core/workflows/execute-plan.md
@~/.claude/gsd-core/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@./CLAUDE.md
@C:/Users/LarsGyrupBrinkNielse/AppData/Local/Temp/claude/D--projects-github-LayZeeDK-lz-engineering-claude-plugins/0944bfb7-575c-41e6-b8b2-c331fd77ccb7/scratchpad/review-ft7/security.md
@.claude/skills/lz-red-workspace/tools/check-red-references.mjs
@.claude/skills/lz-red-workspace/tools/lib/pipe-table.mjs
@.claude/skills/lz-red-workspace/tools/provenance-honesty.selftest.mjs
@.claude/skills/lz-red-workspace/package.json

Facts the planner measured (2026-11-07, HEAD 8e5dee6), so the executor need not re-derive them:
- No selftest of check-red-references.mjs exists. `tools/` has provenance-honesty.selftest.mjs, row-guards.selftest.mjs, check-rgr-routing.selftest.mjs. Style: `import assert from "node:assert/strict"`, a `check(label, actual, expected)` helper wrapping `assert.deepEqual` and counting failures, `[PASS]`/`[FAIL]` lines, a `SUMMARY:` line, `process.exit(0|1)`. Copy that shape.
- N2 lives at check-red-references.mjs lines ~784-873: `findLinkTargets(linkText)`, skips `kind !== "relative"`, splits on `#`, `path.resolve(path.dirname(file), filePart)`, `fs.existsSync(resolved)` (dead hit), then `path.relative(pluginRoot, resolved)` boundary test (LEAVES PACKAGE hit), anti-vacuity counter `relativeLinksResolved`, one `report(..., LINK_RESOLVES_LABEL, ...)`.
- `linkKind` is pipe-table.mjs lines 280-294: `#` -> anchor, `/^[a-z][a-z0-9+.-]*:/i` -> scheme, leading `/` -> absolute, else relative. Only check-red-references.mjs and row-guards.selftest.mjs use `findLinkTargets`; row-guards.selftest.mjs lines 315-326 pin the anchor/scheme/absolute/relative kinds and must stay green.
- Current tree: every relative link target in plugins/**/*.md ends in `.md` (optionally `#fragment`); zero directory links; zero drive-letter, backslash-root or `/`-root links (rg exit 1, positive control 21 links in lz-refactor SKILL.md). The checker is GREEN at 125 checks.
- `.planning/config.json` shows as modified in the working tree; it is not part of this task, do not stage it.
</context>

<tasks>

<task type="auto" tdd="true">
  <name>Task 1: Extract today's N2 logic as a pure-signature port and write the red-first selftest</name>
  <files>.claude/skills/lz-red-workspace/tools/lib/package-links.mjs, .claude/skills/lz-red-workspace/tools/package-links.selftest.mjs, .claude/skills/lz-red-workspace/tools/check-red-references.mjs</files>
  <behavior>
    Selftest cases (all call `packageLinkProblems(target, sourceRel, tracked)`, where `target` comes from `findLinkTargets("[p](<raw>)")[0]` so the kind classification is exercised too; `sourceRel` is a repo-relative posix path; `tracked` is a Set of repo-relative posix paths):
    - Floor 1: `skills/lz-red/SKILL.md` from `plugins/lz-tdd/README.md`, tracked contains `plugins/lz-tdd/skills/lz-red/SKILL.md` -> `[]`.
    - Floor 2: file-plus-fragment `skills/lz-red/SKILL.md#x` with the same tracked set -> `[]`.
    - Floor 3: `../lz-refactor/SKILL.md` from `plugins/lz-tdd/skills/lz-red/SKILL.md` with `plugins/lz-tdd/skills/lz-refactor/SKILL.md` tracked -> `[]` (an in-package `..` is fine).
    - Floor 4: a target missing from both disk and tracked set (`skills/lz-red/no-such-file.md`) -> one problem containing `dead`.
    - Floor 5: `../../README.md` and `..\..\README.md` from `plugins/lz-tdd/README.md` -> a problem containing `LEAVES PACKAGE`.
    - F1: `skills/lz-red/SKILL.md` from `plugins/lz-tdd/README.md` with a tracked set that does NOT contain it (the file IS on disk in this repo) -> one problem containing `dead`.
    - F4: `SKILLS/LZ-RED/SKILL.md` from `plugins/lz-tdd/README.md`, tracked contains the lowercase path -> one problem containing `dead`.
    - F2: with every node:fs entry point replaced by a recorder (see action), each of `\\127.0.0.1\lzjfm-probe\x.md`, `../../README.md`, `/etc/x.md` -> a problem containing `LEAVES PACKAGE` AND the recorder saw zero calls.
    - F3: `C:/Windows/win.ini`, `C:\x.md`, `c:..\..\README.md` -> `findLinkTargets` kind is `absolute` AND `packageLinkProblems` returns a problem containing `LEAVES PACKAGE`, with zero recorded fs calls.
  </behavior>
  <action>
    Create `tools/lib/package-links.mjs` exporting one function `packageLinkProblems(target, sourceRel, tracked)` that returns an array of problem strings (empty means the link is fine). In this task it is a FAITHFUL PORT of today's N2 per-link logic, nothing improved: non-`relative` kinds return `[]`; for a relative target, take the part before `#` (return `[]` if empty), resolve it against `path.dirname(sourceRel)` under a module-level `repoRoot` (five `..` up from the lib dir: lib -> tools -> lz-red-workspace -> skills -> .claude -> repo), push `dead` when `fs.existsSync` is false, then compute the plugin root as the first two segments of `sourceRel` (`plugins/<name>`) and push `LEAVES PACKAGE` when `path.relative` from it escapes, exactly as lines ~851-861 do now. Use `import fs from "node:fs"` and call `fs.existsSync` through the default-export object (not a destructured import), so the selftest's recorder can intercept it. Problem strings: `dead (target is not in the package)` and `LEAVES PACKAGE`; the checker prefixes them with `${shown}:${target.line} -> ${target.raw}`.

    Rewire the N2 loop in check-red-references.mjs to call the port: compute `sourceRel` as `path.relative(repoRoot, file)` with separators converted to `/`, keep the anchor/scheme/absolute skip in the port, keep the `relativeLinksResolved` counter counting exactly what it counts today, and push one hit per returned problem in today's format (`${shown}:${target.line} -> ${target.raw}` for dead, the same plus ` LEAVES PACKAGE` for the escape) so output is byte-identical. Pass a `tracked` argument (`new Set()` for now; Task 2 builds the real one). Run `node tools/check-red-references.mjs` from the workspace: still GREEN, still 125 checks.

    Create `tools/package-links.selftest.mjs` in the provenance-honesty.selftest.mjs style with the behavior cases above. The fs recorder: before an F2/F3 case, save and replace `existsSync`, `statSync`, `lstatSync`, `realpathSync`, `accessSync`, `readdirSync` and `readFileSync` on the `node:fs` default export with functions that record the call and return `false` (or throw ENOENT for the throwing ones) without touching the real filesystem; restore them in a `finally`. This keeps even the pre-fix run from opening an SMB session to 127.0.0.1. Run the selftest: the floor cases pass and every F1, F2, F3 and F4 case FAILS. Copy the selftest's `[FAIL]` lines verbatim into the SUMMARY as the red evidence. Do NOT add the selftest to the `check` script yet, so `npm run check` stays green at this commit.

    Commit (identity check first: `git config user.email` must print the public gmail; fix it with `git config user.email` before committing if not): stage the three files by name, `git commit -F <msgfile>`, subject like `test(lz-red-workspace): extract link-gate core and add red package-links selftest`, then `git log --oneline -1`.
  </action>
  <verify>
    <automated>cd D:/projects/github/LayZeeDK/lz-engineering-claude-plugins/.claude/skills/lz-red-workspace && node tools/check-red-references.mjs | rg "roster integrity|SUMMARY" ; node tools/package-links.selftest.mjs ; test $? -eq 1 && echo SELFTEST-RED-AS-EXPECTED</automated>
  </verify>
  <done>Checker GREEN with "125 checks, equal to the PREDICTED literal"; selftest exits 1 with every F1-F4 case [FAIL] and every floor case [PASS]; red lines recorded for the SUMMARY; one commit with the three files.</done>
</task>

<task type="auto" tdd="true">
  <name>Task 2: Make the core lexical over the tracked set, classify drive letters as absolute, and gate it in check</name>
  <files>.claude/skills/lz-red-workspace/tools/lib/package-links.mjs, .claude/skills/lz-red-workspace/tools/lib/pipe-table.mjs, .claude/skills/lz-red-workspace/tools/check-red-references.mjs, .claude/skills/lz-red-workspace/package.json</files>
  <behavior>
    - Every Task 1 selftest case passes, without editing any expectation.
    - row-guards.selftest.mjs stays green (anchor, `https:` scheme, `/docs/x.md` absolute, sibling relative kinds unchanged).
    - check-red-references.mjs stays GREEN at 125 checks on the current tree.
  </behavior>
  <action>
    pipe-table.mjs `linkKind` (F3 part, F2): before the scheme test, return `absolute` for a drive-letter target (`/^[a-z]:/i`, which covers `C:/x`, `C:\x` and drive-relative `c:..\x`); widen the root test so a target starting with `/` or `\` is `absolute` (this makes UNC `\\host\share` absolute). Update the kinds line of the `findLinkTargets` JSDoc to say a drive-letter, root or UNC path is `absolute`.

    package-links.mjs: rewrite the body as a pure, lexical function and delete the `node:fs` import and the `repoRoot` constant (per F1, F2, F4):
    1. `anchor` and `scheme` kinds -> `[]`.
    2. `absolute` kind -> `["LEAVES PACKAGE"]` immediately (the package cannot contain a rooted path).
    3. Relative: take the part before `#`, replace every `\` with `/`, resolve with `path.posix.normalize(path.posix.join(path.posix.dirname(sourceRel), filePart))`. Plugin root = first two segments of `sourceRel`. If the result is neither the plugin root nor starts with `${pluginRoot}/`, return `["LEAVES PACKAGE"]` with no further work. This boundary test runs before any lookup.
    4. Otherwise return `[]` when `tracked.has(resolved)`, else the `dead (target is not in the package)` problem. `Set.has` is case-sensitive, which is the F4 fix; a directory link would fail here, and the planner measured zero directory links, so no directory branch is added.

    check-red-references.mjs N2 block: build the tracked set once with `execFileSync("git", ["ls-files", "-z", "--", "plugins"], { cwd: repoRoot, encoding: "utf8" })` from `node:child_process`, split on the NUL character, drop empty strings, into a Set. Fail closed: wrap it in try/catch and on error push a hit naming the git failure; if the set is empty, push a hit saying no tracked file was found so the gate checked nothing (same anti-vacuity shape as `NO RELATIVE LINK WAS RESOLVED`). Pass that set to `packageLinkProblems`. The counter now counts every target handed to the core that is not `anchor` or `scheme` (relative and absolute both are acted on). Keep `LINK_RESOLVES_LABEL`, the single `report` call and `EXPECTED_CHECKS = 125` unchanged: no check is added or removed. Rewrite the N2 comment sentences that this change makes false (that root-absolute paths are skipped by kind, that targets are existsSync-checked, "resolved against the disk") so they state the current rule: targets resolve lexically against the `git ls-files` set, case-sensitively, and an escaping or rooted target fails before any lookup. Write invariants, not history; no planning IDs in the new sentences.

    package.json `check`: insert `node tools/package-links.selftest.mjs && ` right after the row-guards selftest. Leave the other commands as they are.

    Run, from `.claude/skills/lz-red-workspace`: `node tools/package-links.selftest.mjs` (exit 0), `node tools/row-guards.selftest.mjs` (exit 0), `node tools/check-red-references.mjs` (GREEN, 125), `npm run check` (exit 0). Confirm `git status --porcelain -- plugins` prints nothing. Run the public-repo allowlist-inversion scan over the five changed files: `rg -n -o -i "[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}"` over them must print nothing, or only the approved gmail; positive-control the regex on a scratch file holding the gmail first.

    Commit (identity re-checked as in Task 1, stage the four files by name, `git commit -F`), subject like `fix(lz-red-workspace): resolve package links against the git-tracked set`, then `git log --oneline -1`.
  </action>
  <verify>
    <automated>cd D:/projects/github/LayZeeDK/lz-engineering-claude-plugins/.claude/skills/lz-red-workspace && node tools/package-links.selftest.mjs && npm run check && git status --porcelain -- ../../../plugins</automated>
  </verify>
  <done>Selftest GREEN with all F1-F4 and floor cases passing; `npm run check` exits 0 with the new selftest in the chain; checker reports 125 checks GREEN; plugins/ has no diff; one commit with the four files under the public identity.</done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| repo Markdown -> link checker | Link targets are repo-authored text the checker parses and resolves |
| link checker -> filesystem / network | Before this fix a UNC target reached `fs.existsSync`, which can open an SMB session |

## STRIDE Threat Register

| Threat ID | Category | Component | Severity | Disposition | Mitigation Plan |
|-----------|----------|-----------|----------|-------------|-----------------|
| T-jfm-01 | Information disclosure | N2 gate on a UNC target (F2) | low | mitigate | Core is lexical with no node:fs use; rooted/UNC targets classify `absolute` and fail before any lookup; selftest recorder asserts zero fs calls |
| T-jfm-02 | Tampering (false green) | N2 gate on untracked/junction/case-variant targets (F1, F4) | low | mitigate | Resolve against the case-sensitive `git ls-files` Set; F1/F4 selftest cases |
| T-jfm-03 | Tampering (false green) | Drive-letter targets skipped as `scheme` (F3 part) | low | mitigate | `linkKind` returns `absolute` for `/^[a-z]:/i`; F3 selftest cases |
| T-jfm-04 | Denial of service | git ls-files failure or empty result | low | mitigate | Fail closed: git error or empty set pushes a hit, gate goes RED |
| T-jfm-05 | Tampering | Unparsed link forms (angle destinations, single-quoted titles, nested brackets, reference-style, HTML href) | low | accept | Deferred in SUMMARY; review measured zero such forms in the tree |
</threat_model>

<verification>
- Red evidence: Task 1 selftest run shows every F1-F4 case [FAIL] and floor cases [PASS], recorded verbatim in the SUMMARY.
- Green evidence: Task 2 selftest exits 0 with unchanged expectations; `npm run check` exits 0; checker GREEN at exactly 125.
- `git status --porcelain -- plugins` empty; no metered run.
</verification>

<success_criteria>
F1, F2, F3 (drive letters) and F4 are fixed, each proven by a selftest case that failed before and passes after; the selftest runs in `npm run check`; the checker raises no false positive on today's tree; plugins/ untouched.
</success_criteria>

<output>
Create `.planning/quick/261107-jfm-harden-check-red-references-link-checker/261107-jfm-SUMMARY.md` with: the Task 1 red `[FAIL]` lines; the Task 2 green results (selftest, row-guards, checker 125, `npm run check`); the two commit hashes. Record under Deferred: F3's remaining unparsed link forms (angle-bracket destinations, single-quoted titles, nested brackets in link text, reference-style definitions, HTML `href`/`src`) with the reason that the review measured zero of them in the tree, so they are latent, and a CommonMark parser or a fail-on-unsupported-form gate is the follow-up. Record under Declined, each with its reason: F5 (quadratic `LINK_RE` on crafted lines; pre-existing, polynomial not exponential, input is repo-authored), F6 (`${CLAUDE_SKILL_DIR}` prefix for the lz-refactor SKILL.md references path; declined because leaf opens were measured 11/11 and 2/2 without it), F7 (unpinned plugin README link to the repository; intended, a human navigation link to the default branch). Also note that the shipped-tree walk (`collectFiles`) still reads the disk and skips symlinked Markdown, which the review raised under F1 but this task's scope (link targets) does not cover.
</output>
