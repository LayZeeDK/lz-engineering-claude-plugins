---
quick_id: 260717-ohn
verified: 2026-07-17T00:00:00Z
status: passed
score: 8/8 must-have truths verified
overrides_applied: 0
---

# Quick 260717-ohn: lz-refactor eval-harness code-review fixes -- Verification Report

**Task Goal:** Fix the 13 triaged code-review findings in the lz-refactor eval harness, one atomic
bisect-safe commit per fix, with the offline check battery GREEN and no metered evals.
**Verified:** 2026-07-17
**Status:** passed
**Re-verification:** No -- initial verification

## Goal Achievement

### Observable Truths (PLAN must_haves)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Full offline battery (10 tools/check-*.mjs + selfcheck-code-review + check-evals) exits 0 at HEAD | VERIFIED | Ran all 10 checkers + selfcheck-code-review + check-evals myself at HEAD (58cf731): every one exit 0. grade-reference --selfcheck also exit 0. |
| 2 | Each of the 13 fixes is its own atomic bisect-safe commit; touched checker(s) GREEN per commit | VERIFIED | 13 commits 5e68670..58cf731 in exact plan order, one logical fix each (correct file scope per `git show --stat`). Spot-checked 7 checker-gated intermediates in-place (FIX1 catalog/gof/extra/functional, FIX2 gof/extra, FIX3 kerievsky, FIX4 smells, FIX5 crossrefs, FIX6 grade-reference --selfcheck, Task11 selfcheck) -- all exit 0. Remaining 6 are isolated additive changes (node --check + HEAD green). |
| 3 | check-catalog fails a leaf whose ## Example body has no ts/js fence even when a fence exists elsewhere | VERIFIED | check-catalog.mjs:276-280 -- `sectionBody(leaf.text,"Example")` then `if (exampleBody===null \|\| !/\`\`\`(ts\|typescript\|js\|javascript)\b/.test(exampleBody))`. Fence test reads Example body ONLY; broad Fowler alternation kept. |
| 4 | sectionBody defined once in a shared module, imported by check-gof/catalog/extra/functional (no local copies) | VERIFIED | tools/lib/section-body.mjs exports `sectionBody` (regex-escaped heading, returns null when absent). All four files `import { sectionBody } from "./lib/section-body.mjs"`; zero remaining `const sectionBody` local copies; check-functional retains its own `escapeRe` (used at 382/389/488). |
| 5 | grade-reference refuses the aggregate when a question has zero runs in every arm | VERIFIED | grade-reference.mjs runAggregate() 415-420: `const expected=Math.max(0,...counts)`; `if(expected===0){ shortfalls.push(...); continue; }`. 431-438: any shortfall -> `process.exit(1)`. Per-cell unbalanced shortfall (426) intact. --selfcheck exit 0. |
| 6 | eval-status enumerates config directories from disk (invoke_skill/no_skill no longer hidden) | VERIFIED | eval-status.mjs 42-53: `slugDir=path.join(iter,slug)`; guarded by `exists(slugDir)`; `cfgs=fs.readdirSync(slugDir,{withFileTypes:true}).filter(d=>d.isDirectory()).map(d=>d.name)`; iterates discovered dirs (hardcoded pair removed). fs/path/exists/iter all in scope; node --check OK. |
| 7 | No metered claude -p run; every verification zero-spend node invocation | VERIFIED | This verification ran only `node`/`git` commands. Never ran `claude -p`; never ran run-e2e.mjs without --selfcheck (only selfcheck-code-review.mjs, which is offline). No eval-capture artifacts in the 13-commit diff. |
| 8 | Edits ASCII-only; maintainer commit identity is the public gmail; no AI-attribution trailers | VERIFIED | Diff e7bb534..HEAD added lines: zero non-ASCII bytes; zero email-shaped tokens introduced (allowlist-inversion clean). All 13 commits author+committer = public gmail. Commit-message scan for co-authored-by/generated-with/claude/anthropic: none. |

**Score:** 8/8 truths verified

### Per-Fix Behavior Checks (13 fixes, requested by parent)

| Fix / Task | Commit | Cited change present at HEAD? | Evidence |
|-----------|--------|-------------------------------|----------|
| FIX1 / T1 catalog Example-scoped fence + shared sectionBody | 5e68670 | YES | check-catalog.mjs:276-280 scopes fence to `sectionBody(leaf.text,"Example")`; lib/section-body.mjs new + 4 importers |
| FIX5 / T2 exact `^##\s+Example\s*$` in gof + extra | 7ef7590 | YES | check-gof.mjs:257, check-extra-patterns.mjs:210 both use exact regex |
| FIX7 / T3 kerievsky README-row regex broadened | bb23fd8 | YES | check-kerievsky.mjs:227 `/\]\((?:\.\/)?([a-z0-9][a-z0-9-]*)\.md(?:#[^)\s]+)?\)/g` |
| FIX8 / T4 per-smell recognize-by co-occurrence | 4a122d9 | YES | check-smells.mjs:346-363 per-smell row-scope loop, `rowsMissingCue` -> report(false); "links all 24" assertion retained |
| FIX13 / T5 crossrefs header + github-slug comment accuracy | 391dbd1 | YES | check-crossrefs header now states bare `](#fragment)` NOT scanned; github-slug.mjs comment states collapse != github-slugger parity (comment-only, code unchanged) |
| FIX3 / T6 grade-reference flags expected===0 | 0f3e503 | YES | grade-reference.mjs:419-420 (see Truth 5) |
| FIX6 / T7 eval-status enumerates dirs | 07056de | YES | eval-status.mjs:42-53 (see Truth 6) |
| FIX12 / T8 extract-samples indented fences | b390519 | YES | extract-samples.mjs fence regex `^\s{0,3}\`\`\`(.*)$`; WR-01 unterminated guard intact; offline tsc harness exit 0 (259 modules clean, 0 skipped) |
| FIX9 / T9 prep-ws exit_code gate | babcb85 | YES | prep-ws.mjs guard `if(meta.exit_code!==0 \|\| (meta.changed_files\|\|[]).length===0) continue;` |
| FIX10 / T10 tabulate excludes non-zero-exit | a0af7af | YES | tabulate-mechanical.mjs: `clean=rs.filter(r=>r.exit===0)`, `nClean`; drove/union/liftMean/cLift/Pass@k over clean, liftMean guarded (`nClean ? ... : '0.0'`), cost/turns/tools over all `rs` |
| FIX4 / T11 selfcheck skips crux-3 on ENOENT | a411ecf | YES | selfcheck-code-review.mjs:230-234 `if(err.code==='ENOENT'){ SKIP; return; }`; non-ENOENT still `fail(...)` |
| FIX2 / T12 run-e2e apply refuses to orphan commits | 3323e45 | YES | run-e2e.mjs:512-518 `const ahead=(git(cwd,['rev-list',\`${APPLY_BASE}..HEAD\`]).stdout\|\|'').trim(); if(ahead) throw` -- placed after PROTECTED_BRANCHES (502) and before reset --hard (524)/clean -fd (525); buildSyntheticBase untouched |
| FIX11 / T13 run-e2e synthetic branch process-unique | 58cf731 | YES | run-e2e.mjs:403 `branchName=\`review-${promptEntry.target}-${process.pid}-${Date.now()}\``; still `review-`-prefixed (glob-compatible); no residual literal `review-<target>` branch refs |

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| tools/lib/section-body.mjs | Shared sectionBody(text,heading) helper, regex-escaped, null when absent | VERIFIED | Exists, exports sectionBody; imported by 4 checkers |
| tools/check-catalog.mjs | Example-body-scoped ts/js fence test | VERIFIED | Contains `sectionBody(leaf.text, "Example")` at :276 |
| grade-reference.mjs | Aggregate refuses on zero-run question | VERIFIED | expected===0 -> shortfall -> exit 1 |
| e2e-nx/run-e2e.mjs | Apply-mode orphan-commit guard + process-unique synthetic branch | VERIFIED | Both present (two separate commits) |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|----|--------|---------|
| tools/check-catalog.mjs | tools/lib/section-body.mjs | import { sectionBody } | WIRED | Import at :25; used at :276 |
| tools/check-gof.mjs | tools/lib/section-body.mjs | import (local copy removed) | WIRED | Import at :32; no local sectionBody remains |
| e2e-nx/selfcheck-code-review.mjs | e2e-nx/run-e2e.mjs | buildSyntheticBase; branch stays review-* glob-compatible | WIRED | selfcheck exit 0 at HEAD (crux-2 builds+tears down synthetic `review-*` branch with the new unique name) |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Full offline battery green at HEAD | node tools/check-{10} + selfcheck + check-evals + grade-reference --selfcheck | all exit 0 | PASS |
| Offline tsc harness (extract-samples indented fences) | node extract-samples.mjs | exit 0; 259 modules --strict clean, 0 skipped | PASS |
| Bisect-safety (7 checker-gated intermediates) | detached checkout + run touched checker | all exit 0 | PASS |

### Anti-Patterns Found

None. No debt markers (TBD/FIXME/XXX/HACK/PLACEHOLDER) in any added line across the 13-commit diff. No gate weakened: catalog/gof/extra Example scoping and smells recognize-by are STRICTER (per-smell co-occurrence, `report(false)` -> exit 1 retained); grade-reference/prep-ws/tabulate now refuse/exclude bad data; kerievsky/extract-samples regexes are BROADER (accept previously-missed valid forms), not looser gates.

### Human Verification Required

None. All 13 fixes are internal offline harness tooling; every cited behavior is verifiable by code
inspection plus the zero-spend offline battery, which was run in full. The run-e2e apply-guard fires
only in the refusal (throw) path and the synthetic-branch change is exercised by selfcheck crux-2 at
HEAD -- neither requires a metered live run to confirm.

### Gaps Summary

No gaps. 13 atomic bisect-safe commits exist in plan order (FIX2 apply-guard 3323e45 and FIX11
synthetic-branch 58cf731 are separate run-e2e.mjs commits). Every cited behavior change is present at
HEAD. Full offline battery exits 0 (zero-spend). ASCII-only, public-gmail identity, no AI-attribution
trailers, no shipped-skill (plugins/lz-tdd/skills/**) file touched, no ROADMAP.md change.

---

_Verified: 2026-07-17_
_Verifier: Claude (gsd-verifier)_
