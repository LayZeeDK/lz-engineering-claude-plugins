---
phase: 22-three-way-classifier-correctness-lz-refactor-lz-red
fixed_at: 2026-11-24T21:18:41Z
review_path: .planning/phases/22-three-way-classifier-correctness-lz-refactor-lz-red/22-REVIEW.md
iteration: 1
findings_in_scope: 7
fixed: 7
skipped: 0
status: all_fixed
---

# Phase 22: Code Review Fix Report

**Fixed at:** 2026-11-24T21:18:41Z
**Source review:** .planning/phases/22-three-way-classifier-correctness-lz-refactor-lz-red/22-REVIEW.md
**Iteration:** 1

**Scope:** Lars approved the split ("How to fix the review findings: OK", 2026-11-24). It covers
WR-01, WR-02, WR-03, WR-04, WR-05, WR-07 and WR-08. CR-01 and WR-06 move to Phase 23, which
rebuilds the variant builder. WR-09, WR-10, WR-11 and IN-01 to IN-06 are not fixed.

**Summary:**
- Findings in scope: 7
- Fixed: 7
- Skipped: 0 in scope; 11 out of approved scope (listed below)

Every fix was proven test-first: the named case was added, run and seen to fail on the old code,
and then the fix was applied and the case passed.

## Fixed Issues

### WR-01: On the two-hop case c4, the only deterministic outcome the grader can produce is FAIL

**Files modified:** `.claude/skills/lz-red-workspace/grade-routing.mjs`, `.claude/skills/lz-red-workspace/e2e-rgr-routing/RUN-GATE.md`
**Commit:** cb856e7
**Applied fix:** `exactly-one` resolves deterministically only when the expected label is a single
owner. On the ordered two-hop case it is unresolved and goes to the blind judge. The header and
the RUN-GATE cardinality table now say so.
**Failing case first:** selfcheck leg 4b, "exactly-one on the ordered two-hop case is unresolved,
not a deterministic FAIL" (a c4 answer naming only `lz-red`). It read FAIL before the change.
**Status:** fixed: requires human verification (a grading-logic change)

### WR-02: The residual case c9 passes deterministically on ANY answer that names no slug

**Files modified:** `.claude/skills/lz-red-workspace/grade-routing.mjs`, `.claude/skills/lz-red-workspace/e2e-rgr-routing/RUN-GATE.md`, `.claude/skills/lz-red-workspace/fixtures-routing/fixtures.json`
**Commit:** 388400c
**Applied fix:** Of the review's two options, this takes "send `zero` to the judge on every case",
the same rule for all three arms. The other option, a deterministic pass on a no-owner marker
phrase, was not taken. It would score the answer on house wording, which D-12 rules out as the
metric. Leg 10's all-resolved batch now uses the exclusion-clause fixture in place of the residual
one. The residual fixture note and the RUN-GATE table and prose are updated.
**Failing cases first:** selfcheck leg 6. "zero on the residual case is unresolved, not a
deterministic PASS" and "a residual answer that coaches the question as a refactor without naming
a skill does not pass deterministically" both read FAIL before the change.
**Status:** fixed: requires human verification (a grading-logic change; it raises the judge share
on c9 in every arm, so judge volume rises)

### WR-03: Judge blinding misses the variant B/C table's own headings

**Files modified:** `.claude/skills/lz-red-workspace/grade-routing.mjs`, `.claude/skills/lz-red-workspace/e2e-rgr-routing/RUN-GATE.md`
**Commit:** 6eb7f1b
**Applied fix:** `shippedSectionHeadings` now also reads `variants/rgr-routing.md`: `#` to `###`
headings, plus a bold title that opens a paragraph, with its trailing period dropped. It fails
closed when it cannot read that file. The superset comment is corrected, and RUN-GATE's
section-title leak bullet names both sources.
**Failing cases first:** selfcheck leg 9b. "a recited variant-table heading ("Edge cases") fires
section-heading" and "a recited variant-table edge-case title fires section-heading" both read
FAIL before the change. Both run through the real derived set, not the fixed fixture list.

### WR-04: The tabulator's routing rollup is written as `mechanical-red.json`

**Files modified:** `.claude/skills/lz-red-workspace/tabulate-mechanical-red.mjs`
**Commit:** 5b3101a
**Applied fix:** A new `rollupFileFor(gradeFile)` derives the rollup name:
`<stem>-grade.json` becomes `mechanical-<stem>.json`. `red-grade.json` keeps
`mechanical-red.json`, and `routing-grade.json` writes `mechanical-routing.json`, the name that
`.gitignore` and check-evals' `SUITE_SKIP_FILES` already carry. Neither of those files needed a
change. A `--grade-file` outside that shape is refused with exit 2. `git check-ignore` confirms
`e2e-rgr-routing/mechanical-routing.json` is ignored, and its negative control
`e2e-rgr-routing/mechanical-red.json` is not.
**Failing case first:** the tabulator selfcheck's rollup-name assertions, at the top of
`runSelfcheck`. Before the change the selfcheck exited 1 with `ReferenceError: rollupFileFor is
not defined`.

### WR-05: The intro two-hop check accepts a NEGATED first-hop claim

**Files modified:** `.claude/skills/lz-red-workspace/tools/check-rgr-routing.mjs`, `.claude/skills/lz-red-workspace/tools/check-rgr-routing.evasions.mjs`
**Commit:** a829958
**Applied fix:** `claimed = affirmedPhrasesIn(redSentence, FIRST_HOP_CLAIM_PHRASES)` replaces the
bare `includes`.
**Failing case first:** new evasion entry M8c, which rewrites lz-refactor's intro to "does not take
the red step first: hand it to lz-red after the code exists, then to lz-tpp". `--only M8c` read
`[EVADED] ... gate exit 0` before the change and `[CAUGHT] M8c` after it. M8b is still caught. The
caught count rose from 19 to 20, and the OPEN ratchet stays at 8.

### WR-07: `npm run check` now rewrites shipped plugin files in place, with no signal-safe restore

**Files modified:** `.claude/skills/lz-red-workspace/tools/check-rgr-routing.mjs`, `.claude/skills/lz-red-workspace/tools/check-rgr-routing.evasions.mjs`
**Commit:** ea0abf6
**Applied fix:** This is the review's main fix, not the interim one. The gate takes
`RGR_ROUTING_ROOT`, and every read resolves under that root: plugin files and the corpus, whose
path is now derived from the root, with the same result in a normal run. The evasion suite copies
`plugins/lz-tdd` and the corpus into `os.tmpdir()`. It mutates and gates only that copy, and
removes the copy on exit. The per-entry restore and checksum check stay, so one entry cannot
leak into the next. Header rule 2 is updated. `check` still includes the suite.
**Failing case first (probe):** the shipped `lz-refactor/SKILL.md` was made read-only and
`--only E2` was run. Before the change it failed with `EPERM` on the shipped worktree path. After
the change the write lands on the temp copy (`...\Temp\rgr-evasions-*\plugins\...`). The probe
still exits 1 there, because `fs.cpSync` keeps the read-only bit on the copy. No temp dirs were
left after either run. The full suite run is GREEN, and `git status -- plugins/` stays clean.
**Caveat:** a SIGKILL can still leave one stray `rgr-evasions-*` dir in the temp folder. The
tracked tree cannot be affected.

### WR-08: `grade-routing.mjs --suite` exits 0 on a missing or empty suite

**Files modified:** `.claude/skills/lz-red-workspace/grade-routing.mjs`
**Commit:** 602298f
**Applied fix:** A new exported `resolveSuiteRunDirs(suiteDir, { allowEmpty })` requires
`suite.json` and throws on zero captured runs. `main` turns that throw into exit 2, and
`--allow-empty` opts in to an empty suite. Measured on the real, still uncaptured
`e2e-rgr-routing`: exit 2 without the flag and exit 0 with it. A missing path gives exit 2.
**Failing cases first:** selfcheck leg 12. "--suite on a path with no suite.json fails closed"
and "--suite with zero captured runs fails closed" read FAIL before the change, and the
`--allow-empty` leg threw `ReferenceError`. The legs check the error text, so an unrelated throw
cannot satisfy them.

## Skipped Issues

### CR-01: Variant C cannot be built, and its lz-tpp transform would put the banned test-state gate back into the measured arm

**File:** `.claude/skills/lz-red-workspace/variants/build-variants.mjs:143-161`
**Reason:** skipped: out of approved scope (moved to Phase 23, which rebuilds the variant builder)
**Original issue:** The `C_POINTER['lz-tpp'].from` anchor no longer matches the current lz-tpp
step 1, so variant C cannot be built. Its `to` run would also put back `all prior tests green`.

### WR-06: `selfcheck-routing.mjs` does not prove the variant trees were built from the CURRENT tracked tree

**File:** `.claude/skills/lz-red-workspace/selfcheck-routing.mjs:369-416`
**Reason:** skipped: out of approved scope (moved to Phase 23, which rebuilds the variant builder)
**Original issue:** A stale `out/` tree passes all six checks. The proposed fix is a source-hash stamp.

### WR-09: RUN-GATE states a superseded model pin and stale description lengths as current facts

**File:** `.claude/skills/lz-red-workspace/e2e-rgr-routing/RUN-GATE.md:52-54, 130-132, 365-379`
**Reason:** skipped: out of approved scope
**Original issue:** The hard-coded description lengths are stale, and `claude-opus-5` is called
the current default.

### WR-10: Branch (c)'s "before any test covers it" is a suite-state qualifier inside a routing condition

**File:** `plugins/lz-tdd/skills/lz-refactor/SKILL.md:77-79` (and lz-red, lz-tpp, two references)
**Reason:** skipped: out of approved scope
**Original issue:** The qualifier can read as a coverage condition, which would route a
behavior change on already-tested code to the residual.

### WR-11: Impossible-state guard: the one-byte probe in `crux 3` tests SHA-256, not the frontmatter extraction

**File:** `.claude/skills/lz-red-workspace/selfcheck-routing.mjs:372-377`
**Reason:** skipped: out of approved scope (necessity finding)
**Original issue:** The probe can never fail, and it does not exercise `frontmatterBlock`.

### IN-01: ROUTING-AB-RESULTS contradicts RUN-GATE on the rollup gaps, and miscounts the surfaces

**File:** `.claude/skills/lz-red-workspace/ROUTING-AB-RESULTS.md:38, 200-207`
**Reason:** skipped: out of approved scope
**Original issue:** A stale caveat about the rollup gaps, and "six surfaces" where the gate declares eleven.

### IN-02: The selftest header still says the real gate is deliberately RED

**File:** `.claude/skills/lz-red-workspace/tools/check-rgr-routing.selftest.mjs:5-6`
**Reason:** skipped: out of approved scope
**Original issue:** A stale header clause.

### IN-03: `COVERAGE_FLOOR` fails open for a router surface that has no entry

**File:** `.claude/skills/lz-red-workspace/tools/check-rgr-routing.mjs:452`
**Reason:** skipped: out of approved scope
**Original issue:** A new router surface with no entry gets an empty floor. This has not happened yet.

### IN-04: Heading blinding has no word boundaries and strips ordinary prose

**File:** `.claude/skills/lz-red-workspace/grade-routing.mjs:108-115, 358-368`
**Reason:** skipped: out of approved scope
**Original issue:** Generic headings such as `Two modes` are stripped from ordinary prose. Note
that WR-03 adds more short generic headings from the variant table to the strip set (`Sources`,
`Edge cases`, `The routing table`), so this effect grows. It applies to all arms alike.

### IN-05: The `variant_a` read rate is not a structural zero

**File:** `.claude/skills/lz-refactor-workspace/e2e-nx/run-e2e.mjs:497`
**Reason:** skipped: out of approved scope
**Original issue:** The matcher also matches the workspace source `variants/rgr-routing.md`.

### IN-06: A state-framed routing sentence sits in the plugin reference outside every declared surface

**File:** `plugins/lz-tdd/references/beck-tdd-by-example.md:47-51`
**Reason:** skipped: out of approved scope
**Original issue:** "Once the bar is green ... where lz-refactor lives" sits outside every
declared surface.

## Verification

Where the checks ran: each fix was checked in the isolated worktree
(`.claude/worktrees/rf-22-*`, now removed). After the fast-forward, everything below was run
again in the MAIN CHECKOUT at 602298f, so these results can be reproduced from the tree as it
stands now.

- `npm run check` in `.claude/skills/lz-red-workspace`: exit 0. It includes the rgr-routing
  selftest, the gate (GREEN), and the evasions (GREEN -- 20 CAUGHT, 8 OPEN against a baseline of
  8, 3 unclosable CEILING).
- `npm run check` in `.claude/skills/lz-refactor-workspace`: exit 0 (all ten checkers GREEN).
- `git status --short -- plugins/` after both runs: empty (clean).
- Also run (not part of `check`): `grade-routing.mjs --selfcheck` exit 0,
  `tabulate-mechanical-red.mjs --selfcheck` exit 0, `check-evals.mjs` exit 0.
- Not run, per the brief: `build-variants.mjs`, `selfcheck-routing.mjs`, and any metered command.
- Hygiene: an allowlist scan of the fix diff (233 added lines) found no email-shaped token other
  than the approved gmail and no non-ASCII character. All seven commits are authored and
  committed as `larsbrinknielsen@gmail.com`.

The temp branch was rebased onto the user branch's newer tip before the fast-forward. A peer
session had added docs(23) commits, f8df3e4 through 5006aa9. The rebase had no conflicts, so the
commit hashes above are the rebased ones.

---

_Fixed: 2026-11-24T21:18:41Z_
_Fixer: Claude (gsd-code-fixer)_
_Iteration: 1_
