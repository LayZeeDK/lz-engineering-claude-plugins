---
phase: quick-261107-kd7
plan: 01
subsystem: lz-red-workspace link checker
tags: [check-red-references, package-links, link-gate, red-first]
status: complete
requires:
  - quick-261107-jfm (package-link core, trackedFiles, selftest harness)
provides:
  - packageLinkProblems with a tracked-directory segment walk
  - findUnsupportedLinkForms (fence-aware detector for unextracted link forms)
  - packageLinkGate(tracked, readText) enumerating tracked .md sources
affects:
  - .claude/skills/lz-red-workspace/tools/check-red-references.mjs N2 gate
tech-stack:
  added: []
  patterns: [red-first selftest cases reached through namespace imports and an attempt() helper]
key-files:
  created: []
  modified:
    - .claude/skills/lz-red-workspace/tools/lib/package-links.mjs
    - .claude/skills/lz-red-workspace/tools/lib/pipe-table.mjs
    - .claude/skills/lz-red-workspace/tools/package-links.selftest.mjs
    - .claude/skills/lz-red-workspace/tools/check-red-references.mjs
decisions:
  - "N2 reads its sources from the git-tracked set; G17, N1 and N3 keep the disk walk (stricter for untracked files, N3 must catch an untracked copy)"
  - "Unsupported-link-form hits belong to N2, so EXPECTED_CHECKS stays 125 and LINK_RESOLVES_LABEL keeps its text"
  - "Item 4 (links inside inline code are extracted and checked) declined, per Lars"
metrics:
  completed: 2026-11-07
  tasks: 3
  files: 4
---

# Quick 261107-kd7: Close the package-link gate silent passes Summary

The N2 package-link gate now resolves targets segment by segment against tracked directories, fails on link
forms its extractor cannot read, and checks exactly the git-tracked Markdown under plugins/. Each of the three
fixes went red first.

Lars's approval, verbatim: "1-2: Approve recommendations."

## Commits

| Task | Item | Commit | Message |
|------|------|--------|---------|
| 1 | 2 | d7e2daa | fix(lz-red-workspace): resolve link segments against tracked directories |
| 2 | 3 | 7228fc0 | feat(lz-red-workspace): detect link forms the package-link gate cannot read |
| 3 | 1 | 0461230 | fix(lz-red-workspace): check package links in exactly the git-tracked Markdown |

This SUMMARY is left untracked for the orchestrator to commit (orchestrator override; the plan's docs commit
was not made).

## Red-first evidence (verbatim [FAIL] lines)

### Task 1 (item 2): K1-K5, saved run `kd7-red-task1.txt`

```
  [FAIL] K1: trailing slash after a tracked file -> one dead problem -- expected {"count":1,"dead":true,"leavesPackage":false}, got {"count":0,"dead":false,"leavesPackage":false}: Expected values to be strictly deep-equal:
  [FAIL] K2: trailing slash after a nested tracked file -> one dead problem -- expected {"count":1,"dead":true,"leavesPackage":false}, got {"count":0,"dead":false,"leavesPackage":false}: Expected values to be strictly deep-equal:
  [FAIL] K3: `..` out of a missing directory -> one dead problem -- expected {"count":1,"dead":true,"leavesPackage":false}, got {"count":0,"dead":false,"leavesPackage":false}: Expected values to be strictly deep-equal:
  [FAIL] K4: a path through a missing directory -> one dead problem -- expected {"count":1,"dead":true,"leavesPackage":false}, got {"count":0,"dead":false,"leavesPackage":false}: Expected values to be strictly deep-equal:
  [FAIL] K5: a path through a file used as a directory -> one dead problem -- expected {"count":1,"dead":true,"leavesPackage":false}, got {"count":0,"dead":false,"leavesPackage":false}: Expected values to be strictly deep-equal:
SUMMARY: package-links self-test RED -- 5 of 38 assertion(s) FAILED
```

K6 (floor, `skills/lz-red/../lz-refactor/SKILL.md`) and all 32 earlier cases passed in that run. Exit 1.

### Task 2 (item 3): U1-U8, saved run `kd7-red-task2.txt`

```
  [FAIL] U1: reference-style definition -> reported -- expected ["reference-style definition"], got "threw: pipeTable.findUnsupportedLinkForms is not a function": Expected values to be strictly deep-equal:
  [FAIL] U2: angle-bracket destination -> reported -- expected ["angle-bracket destination"], got "threw: pipeTable.findUnsupportedLinkForms is not a function": Expected values to be strictly deep-equal:
  [FAIL] U3: single-quoted link title -> reported -- expected ["single-quoted link title"], got "threw: pipeTable.findUnsupportedLinkForms is not a function": Expected values to be strictly deep-equal:
  [FAIL] U4: HTML href attribute -> reported -- expected ["HTML href/src attribute"], got "threw: pipeTable.findUnsupportedLinkForms is not a function": Expected values to be strictly deep-equal:
  [FAIL] U5: HTML src attribute -> reported -- expected ["HTML href/src attribute"], got "threw: pipeTable.findUnsupportedLinkForms is not a function": Expected values to be strictly deep-equal:
  [FAIL] U6: every unsupported form inside a backtick fence and a tilde fence -> nothing reported -- expected [], got "threw: pipeTable.findUnsupportedLinkForms is not a function": Expected values to be strictly deep-equal:
  [FAIL] U7: double-quoted title, scheme and anchor links -> nothing reported -- expected [], got "threw: pipeTable.findUnsupportedLinkForms is not a function": Expected values to be strictly deep-equal:
  [FAIL] U8: a form on line 2 -> reported at line 2 -- expected [2], got "threw: pipeTable.findUnsupportedLinkForms is not a function": Expected values to be strictly deep-equal:
SUMMARY: package-links self-test RED -- 8 of 46 assertion(s) FAILED
```

All 38 earlier cases passed in that run. Exit 1.

### Task 3 (item 1): W1-W3, saved run `kd7-red-task3.txt`

```
  [FAIL] W1: packageLinkGate reads only the tracked .md files and reports a dead link and an unsupported form -- expected {"reads":["plugins/p/a.md","plugins/p/b.md"],"resolved":2,"hits":["plugins/p/a.md:2 -> nope.md dead (target is not in the package)","plugins/p/b.md:1 -> unsupported link form (reference-style definition), not checked"]}, got "threw: packageLinks.packageLinkGate is not a function": Expected values to be strictly deep-equal:
  [FAIL] W3: an unreadable tracked file is one hit and the gate continues -- expected {"hits":["plugins/p/a.md: UNREADABLE (EACCES)"],"resolved":1}, got "threw: packageLinks.packageLinkGate is not a function": Expected values to be strictly deep-equal:
  [FAIL] W2: packageLinkGate over trackedFiles reads a tracked symlink and skips untracked and ignored files -- expected ["plugins/p/linked.md","plugins/p/spaced ø.md","plugins/p/tracked.md"], got "threw: packageLinks.packageLinkGate is not a function": Expected values to be strictly deep-equal:
SUMMARY: package-links self-test RED -- 3 of 49 assertion(s) FAILED
```

All 46 earlier cases passed in that run, M2 included (W2 runs in its own `attempt`, so its throw cannot
overwrite M2's result). The W2 throw came from the gate call, after `git hash-object` and `git update-index`
succeeded. Exit 1.

## Green evidence

| Command | Result |
|---------|--------|
| `node .claude/skills/lz-red-workspace/tools/package-links.selftest.mjs` after task 1 | exit 0, `38/38 assertions pass` |
| `node .claude/skills/lz-red-workspace/tools/package-links.selftest.mjs` after task 2 | exit 0, `46/46 assertions pass` |
| `node .claude/skills/lz-red-workspace/tools/row-guards.selftest.mjs` after task 2 | exit 0, `GREEN -- all assertions pass` |
| `node .claude/skills/lz-red-workspace/tools/package-links.selftest.mjs` after task 3 | exit 0, `49/49 assertions pass` |
| `node .claude/skills/lz-red-workspace/tools/check-red-references.mjs` after tasks 1 and 3 | exit 0, `125 checks, equal to the PREDICTED literal`; N2 `[PASS]` |
| `npm --prefix .claude/skills/lz-red-workspace run check` | exit 0; every SUMMARY line GREEN (provenance-honesty, row-guards, package-links 49/49, RED-REFS, rgr-routing, RGR-ROUTING, EVASIONS 19 CAUGHT / 8 OPEN baseline 8) |
| `git diff --stat 1c9ddf1 0461230 -- plugins` | empty, exit 0 (plugins/ byte-unchanged through the three planned commits; see Review follow-up for the one later line) |
| `git status --porcelain -- plugins` and `git diff --cached --name-only -- plugins` | empty before every commit |
| `git log --format='%ae %ce' -3` | only `larsbrinknielsen@gmail.com` |
| Allowlist-inversion: `rg -o -i` email-shaped tokens over the four changed files, minus the gmail | zero tokens at all (count exit 1); positive control: the same pattern returns the gmail twice in `AGENTS.md` |

## End-to-end probes (both undone before the task 3 commit)

- (a) untracked `plugins/lz-tdd/kd7-probe.md` with `[x](no-such.md)`: checker exit 0, N2
  `[PASS] [lc9] every relative markdown link in the shipped tree resolves inside its plugin package`.
  The untracked file is not checked by N2.
- (b) the same file with `[r]: no-such.md`, staged with `git add -N`: checker exit 1, hit line:
  `[FAIL] [lc9] every relative markdown link in the shipped tree resolves inside its plugin package -- 1 unresolved: plugins/lz-tdd/kd7-probe.md:1 -> unsupported link form (reference-style definition), not checked`.
  Then `git rm --cached -q`, the file deleted; `git status --porcelain -- plugins` empty afterwards.

## What changed

- Item 2 (`packageLinkProblems`): the final lexical `normalize` lookup became a segment walk over the tracked
  set. Every segment before the last must be a tracked directory, a trailing-slash target must be a tracked
  directory, a final `.`/`..` is accepted as an already-proven directory, and otherwise a tracked file or
  directory is accepted (keeps M3's `skills`). One local `isTrackedDir` arrow holds the `startsWith` idiom.
- Item 3 (`findUnsupportedLinkForms` in `pipe-table.mjs`): built on `scanLines`, skips fenced lines, reports
  reference-style definitions, angle-bracket destinations, single-quoted titles and HTML `href=`/`src=`, one
  entry per form per line. Inline code is not stripped, on purpose (loud direction).
- Item 1 (`packageLinkGate` in `package-links.mjs`): reads the sorted `.md` entries of the tracked set through
  `readText`; an unreadable file, an unsupported form and a link problem each become a hit; `resolved` counts
  non-anchor, non-scheme targets. N2 in the checker now calls it once with a reader over `repoRoot`, keeps the
  `trackedFiles` try/catch, the empty-set hit, the nothing-resolved hit, `LINK_RESOLVES_LABEL` and the single
  `report`, and no longer starts from `pluginsWalkError`. Hit paths are now repo-relative posix (failure text
  only). The `findLinkTargets`/`packageLinkProblems` imports in the checker were replaced by `packageLinkGate`.

## Item 1 decision: G17, N1 and N3

G17, N1 and N3 keep the disk walk, because this task does not need them changed: an untracked file there is
scanned, which is stricter, and N3 must also catch an untracked copy. The comments that said FOUR gates consume
the one walk now say THREE, with N2 reading git.

## Why the check count stays 125

No report is added or removed. The unsupported-form hits belong to N2, because a link the gate could not read
is a link it did not resolve. `EXPECTED_CHECKS` and `NEW_LABELS` are unchanged, and the roster check reads
`125 checks, equal to the PREDICTED literal`.

## Declined

- Item 4: links inside inline code are extracted and checked. The failure direction is a loud false failure
  only, never a silent pass, and Lars approved declining it.

## Deferred

- The G17/N1 disk walk (`collectFiles`) skips a symlinked Markdown file. Zero tracked symlinks exist under
  plugins/ today. Price to close: the same tracked-set enumeration N2 now uses.
- A CommonMark parser stays deferred until a currently unsupported link form is wanted in the shipped tree.

## Deviations from Plan

- The `pipe-table.mjs` module header opened with "THREE exported pure functions"; it now says FOUR and names
  `findUnsupportedLinkForms`, beside the planned one-sentence header addition. Comment accuracy only.
- The SUMMARY is not committed (orchestrator override).

Otherwise the plan was executed as written.

## Review follow-up

A scoped review found more silent passes (H1, M1, M2, M3, L1, L4). Each got a selftest case that ran red
before its fix. The fixes landed in two commits, ordered so that every commit keeps the battery green:

| Commit | Message |
|--------|---------|
| 7ec1480 | docs(lz-refactor): move the web-only marker out of the Return Modified Value link text |
| f7f2a36 | fix(lz-red-workspace): close the package-link gate silent passes found in review |

What f7f2a36 changes:
- A fence opens only with up to 3 leading spaces; a tab indent is indented code. A fence closes only on the
  opener's character, with a run at least as long and nothing but whitespace after it (H1, M1).
- Any `](` that `LINK_RE` did not consume is an "unparsed link" hit, reported when no specific form matched
  on that line (M2). There is no separate "line starts mid-link" check. A `](` with no `[` before it can
  never be consumed by `LINK_RE`, so the catch-all covers that case, and X7 shows it.
- The gate reads `/\.(md|markdown)$/i` (M3).
- A tracked Markdown file directly under plugins/ gives a `NOT IN A PLUGIN` hit (L4).
- The `last === "." || last === ".."` early return is removed (L1).

Red run before the fixes (`kd7-red-review.txt`, exit 1, `9 of 60 assertion(s) FAILED`), verbatim:

```
  [FAIL] X1: a link after a 4-backtick fence holding a 3-backtick line -> extracted -- expected ["dead.md"], got []: Expected values to be strictly deep-equal:
  [FAIL] X2: a link after the inner 3-backtick line, inside the 4-backtick fence -> not extracted -- expected [], got ["dead.md"]: Expected values to be strictly deep-equal:
  [FAIL] X3: a tab-indented backtick run is not a fence -> the link after it is extracted -- expected ["dead.md"], got []: Expected values to be strictly deep-equal:
  [FAIL] X4: nested brackets in link text -> unparsed link -- expected ["unparsed link"], got []: Expected values to be strictly deep-equal:
  [FAIL] X5: escaped bracket in link text -> unparsed link -- expected ["unparsed link"], got []: Expected values to be strictly deep-equal:
  [FAIL] X6: parenthesised link title -> unparsed link -- expected ["unparsed link"], got []: Expected values to be strictly deep-equal:
  [FAIL] X7: link text broken across lines -> unparsed link on the second line -- expected [{"line":2,"form":"unparsed link"}], got []: Expected values to be strictly deep-equal:
  [FAIL] X8: tracked `.MD` and `.markdown` files are read and their dead links reported -- expected ["plugins/p/Docs.MD:1 -> dead.md dead (target is not in the package)","plugins/p/n.markdown:1 -> dead.md dead (target is not in the package)"], got []: Expected values to be strictly deep-equal:
  [FAIL] X11: a Markdown file directly under plugins/ -> one hit naming the file -- expected ["plugins/README.md: NOT IN A PLUGIN (a file directly under plugins/ ships in no package)"], got ["plugins/README.md:1 -> a.md dead (target is not in the package)"]: Expected values to be strictly deep-equal:
SUMMARY: package-links self-test RED -- 9 of 60 assertion(s) FAILED
```

X9 (indented reference definition) and X10 (uppercase `HREF=`) passed before the fix on purpose. They catch a
mutant that drops `^ {0,3}` or `/i`. With the `last === "." || last === ".."` early return deleted, the
selftest stays green.

### The one plugins/ edit, and why

With the fixes applied to the unchanged tree, the catch-all fired on a real shipped link. N2 failed:

```
  [FAIL] [lc9] every relative markdown link in the shipped tree resolves inside its plugin package -- 1 unresolved: plugins/lz-tdd/skills/lz-refactor/references/fowler-catalog/README.md:92 -> unsupported link form (unparsed link), not checked
```

Line 92 was `| [Return Modified Value [web-only]](return-modified-value.md) | none | ... |`. The nested
brackets meant the gate had never checked this link. Claude (the orchestrator), not Lars, decided the fix. The
README's own provenance legend (line 10) defines `[web-only]` as the marker, so it stays and moves out of the
link text: `| [Return Modified Value](return-modified-value.md) [web-only] | none | ... |`, with the rest of the
row byte-identical. That lifted the "plugins/ untouched" limit for exactly this one line, committed alone as
7ec1480. `check-catalog.mjs` reads index rows only through `](slug.md)` and checks `[web-only]` in the leaf
file, which is unchanged.

Evidence:
- Before 7ec1480, `git diff --stat -- plugins` showed 1 file, 1 insertion, 1 deletion; `git diff --stat 1c9ddf1 HEAD -- plugins`
  shows the same at the tip.
- `npm --prefix .claude/skills/lz-refactor-workspace run check` exited 0. Every SUMMARY line was GREEN: FWL-01
  62/62, KRV 27/27, GOF-01 23/23, XTR-01 5/5, FWL-02 24/24, cross-refs (720 links resolve), FWL-03 8/8,
  hygiene, FUN 19/19, PRIN-01/02/03 backing.
- A throwaway scratchpad probe (`kd7-line92-probe.mjs`) ran `findLinkTargets` on the new line 92:
  `targets: [{"line":1,"raw":"return-modified-value.md","kind":"relative"}]`, `unsupported: []`. The link is
  now extracted and resolved.
- 7ec1480 on its own, with the pre-fix tools, is inferred green, not measured: the old extractor reads the
  new link, and its target is tracked.

After f7f2a36:
- `node .claude/skills/lz-red-workspace/tools/package-links.selftest.mjs`: exit 0, 60/60.
- `node .claude/skills/lz-red-workspace/tools/check-red-references.mjs`: exit 0, N2 [PASS],
  `125 checks, equal to the PREDICTED literal`.
- `npm --prefix .claude/skills/lz-red-workspace run check`: exit 0, every SUMMARY line GREEN (EVASIONS 19
  CAUGHT / 8 OPEN, baseline 8).
- Email allowlist-inversion over the four files touched: zero email-shaped tokens.

Declined from the review: L2 (an href inside inline code is flagged; loud, intended) and L3 (`[a]()` links to
the same page, not a broken package link).

Claude (the orchestrator) then added 0e6ef00 on this branch, approved by Lars: the README row's tag is now the
code span `` `[web-only]` ``.

## Review follow-up, round 2

The closing review found that an unterminated fence still hid every later link (F1), and that nothing
tested the rule "a closing run with trailing text does not close a fence" (F2). Both are fixed in one commit:

| Commit | Message |
|--------|---------|
| cd19e0e | fix(lz-red-workspace): report an unterminated fence instead of skipping the rest of the file |

What cd19e0e changes:
- `scanLines` returns the opener of a fence still open at the end of the file. `findUnsupportedLinkForms`
  reports it as `{ line: <opener line>, form: "unterminated fence" }`, which becomes an N2 hit.
- A backtick run whose info string holds a backtick no longer opens a fence (CommonMark).
- The `scanLines` docblock no longer calls skipped content fail-closed. For a link gate, skipping is the
  silent direction. The docblock now says that list-item fences usually end up unterminated (loud) and
  blockquote fences are scanned (loud).

Red run before the fix (`kd7-red-round2.txt`, exit 1, `5 of 66 assertion(s) FAILED`), verbatim:

```
  [FAIL] Y1: a fence opened on a list-marker line -> unterminated fence at the indented closer -- expected [{"line":3,"form":"unterminated fence"}], got []: Expected values to be strictly deep-equal:
  [FAIL] Y2: a fence opened on an ordered-list line -> unterminated fence at the indented closer -- expected [{"line":3,"form":"unterminated fence"}], got []: Expected values to be strictly deep-equal:
  [FAIL] Y3: a fence inside a list item left open -> unterminated fence at its opener -- expected [{"line":2,"form":"unterminated fence"}], got []: Expected values to be strictly deep-equal:
  [FAIL] Y4: backtick info string holding a backtick -> the link after it is extracted -- expected ["dead.md"], got []: Expected values to be strictly deep-equal:
  [FAIL] Y5: backtick info string holding a backtick, then a fence line -> the link between is extracted -- expected ["dead.md"], got []: Expected values to be strictly deep-equal:
SUMMARY: package-links self-test RED -- 5 of 66 assertion(s) FAILED
```

Y4 is the review's input `"```a`b\n[a](dead.md)"`. With the backtick rule that line is no longer a fence, so
the case expects the link to be extracted, which is the loud direction, not an "unterminated fence" report.
Y5 adds a later fence line. The "unterminated fence" rule alone would not catch Y5, because that line
closes the fence.

X12 (F2) passed against the code already in place. To prove it holds the rule, I ran the selftest once
with `&& rest.trim() === ""` removed from the close test (`kd7-x12-mutant.txt`, exit 1) and restored the
rule right after:

```
  [FAIL] X12: a closing run with trailing text does not close the fence -- expected ["dead2.md"], got ["dead.md"]: Expected values to be strictly deep-equal:
SUMMARY: package-links self-test RED -- 6 of 66 assertion(s) FAILED
```

After cd19e0e:
- `node .claude/skills/lz-red-workspace/tools/package-links.selftest.mjs`: exit 0, 66/66.
- `node .claude/skills/lz-red-workspace/tools/row-guards.selftest.mjs`: GREEN.
- `node .claude/skills/lz-red-workspace/tools/check-red-references.mjs`: exit 0, N2 [PASS],
  `125 checks, equal to the PREDICTED literal`. N2 has zero hits, so the unterminated-fence rule fires on
  nothing in today's tree.
- `npm --prefix .claude/skills/lz-red-workspace run check`: exit 0, every SUMMARY line GREEN.
- `npm --prefix .claude/skills/lz-refactor-workspace run check`: exit 0, every SUMMARY line GREEN.
- `git status --porcelain -- plugins` and `git diff --cached --name-only -- plugins` were empty before the commit.
- Email allowlist-inversion over the two changed files: zero email-shaped tokens.

Declined from round 2:
- F3: a fence inside a blockquote is not recognised, so its content is scanned. That is loud, and no such
  fence exists in the tree.
- F4: a `](` inside inline code is reported as an "unparsed link". That is loud and intended, since inline
  code is not stripped.

Closed (was deferred): a backtick opener whose info string holds a backtick. cd19e0e treats it as a non-fence
(Y4, Y5), and an unterminated fence of any kind is now reported.

## Tag code spans and closing review (orchestrator)

Lars, 2026-11-07, verbatim: "1: Approve recommendation." (option A: write every attached source or provenance tag
as a code span, matching the legends). Claude committed it as 1aeb859: the 12 `smells.md` heading tags and the
`return-modified-value.md` provenance line. Both check suites passed on it; lz-refactor's FWL-01 provenance check
stayed green, so its `[web-only]` match works inside backticks (measured).

The closing opus-low review of cd19e0e and 1aeb859 found nothing high or medium. It compared old and new
`scanTables`, `findLinkTargets` and `findUnsupportedLinkForms` over all 194 tracked plugin Markdown files: 0
differences. Its two survivors, triaged by Claude:

- Declined, low: a fence deliberately left open at the end of a file is reported as "unterminated fence"
  (CommonMark closes it at end of file). The failure is loud, and no such file exists.
- Declined, cosmetic: the `FENCE_RE` comment does not mention the backtick info-string rule; the inline comment at
  the rule explains it.

Merged as 71289b3; both check suites pass on the merged tree.

## Self-Check: PASSED

- Files modified exist: all four tools files plus the fowler-catalog README.
- Commits present on the branch: d7e2daa, 7228fc0, 0461230, 7ec1480, f7f2a36, 0e6ef00 (Claude, orchestrator),
  cd19e0e.
- No metered run happened; no `claude -p` session was started.
