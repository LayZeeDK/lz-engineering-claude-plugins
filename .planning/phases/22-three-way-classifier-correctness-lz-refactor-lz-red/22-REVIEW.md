---
phase: 22-three-way-classifier-correctness-lz-refactor-lz-red
reviewed: 2026-11-24T17:53:15Z
depth: deep
files_reviewed: 25
files_reviewed_list:
  - .claude/skills/lz-red-workspace/ROUTING-AB-RESULTS.md
  - .claude/skills/lz-red-workspace/check-evals.mjs
  - .claude/skills/lz-red-workspace/e2e-rgr-routing/RUN-GATE.md
  - .claude/skills/lz-red-workspace/e2e-rgr-routing/suite.json
  - .claude/skills/lz-red-workspace/e2e-rgr-routing/targets.json
  - .claude/skills/lz-red-workspace/fixtures-routing/fixtures.json
  - .claude/skills/lz-red-workspace/grade-routing.mjs
  - .claude/skills/lz-red-workspace/package.json
  - .claude/skills/lz-red-workspace/selfcheck-routing.mjs
  - .claude/skills/lz-red-workspace/tabulate-mechanical-red.mjs
  - .claude/skills/lz-red-workspace/tools/check-rgr-routing.mjs
  - .claude/skills/lz-red-workspace/tools/check-rgr-routing.selftest.mjs
  - .claude/skills/lz-red-workspace/tools/lib/routing-parse.mjs
  - .claude/skills/lz-red-workspace/tools/lib/section-body.mjs
  - .claude/skills/lz-red-workspace/tools/rgr-cases.json
  - .claude/skills/lz-red-workspace/variants/build-variants.mjs
  - .claude/skills/lz-red-workspace/variants/rgr-routing.md
  - .claude/skills/lz-refactor-workspace/e2e-nx/run-e2e.mjs
  - .claude/skills/lz-refactor-workspace/tools/check-hygiene.mjs
  - .gitignore
  - plugins/lz-tdd/references/beck-tdd-by-example.md
  - plugins/lz-tdd/skills/lz-red/SKILL.md
  - plugins/lz-tdd/skills/lz-red/references/three-laws-and-test-selection.md
  - plugins/lz-tdd/skills/lz-refactor/SKILL.md
  - plugins/lz-tdd/skills/lz-tpp/SKILL.md
findings:
  critical: 1
  warning: 11
  info: 6
  total: 18
  necessity: 1
status: issues_found
---

# Phase 22: Code Review Report

**Reviewed:** 2026-11-24T17:53:15Z
**Depth:** deep
**Files Reviewed:** 25
**Status:** issues_found

## Summary

Scope: the 25 listed files, reviewed against the tracked tree at `1cb416c`. The diff base
`6049aaa` spans more than Phase 22 (153 files), so only the listed files were judged; two out-of-list
files were read only where a listed file calls into them (`tools/check-rgr-routing.evasions.mjs` via
`package.json`, and `merge-judge.mjs` via `grade-routing.mjs`).

Checks run (all zero-spend, read-only on the tracked tree): `tools/check-rgr-routing.mjs` (GREEN,
exit 0), `tools/check-rgr-routing.selftest.mjs` (GREEN), `tools/check-rgr-routing.evasions.mjs`
(GREEN: 19 caught, 8 open, 3 ceiling; `git status` on `plugins/` clean afterwards),
`grade-routing.mjs --selfcheck` (OK), `check-evals.mjs` (OK), lz-refactor `check-hygiene.mjs` (GREEN).
`build-variants.mjs` and `selfcheck-routing.mjs` were NOT run, because the build deletes and rewrites
`out/`; their behavior was measured instead with a scratch probe that imports `VARIANTS` and resolves
every transform against the current tracked tree without writing anything.

The shipped classifier itself is in good shape: the routing gate is GREEN, and the three step-1
procedures, the three narratives, `laws-classify` and `beck-seam` agree with the corpus. The defects
are in the Round A instrument the phase claims is "BUILT and GREEN offline". The variant builder
cannot build variant C against today's tree, and the replacement text it carries would put the banned
test-state gate back into that arm (CR-01). The grader's deterministic arms are one-sided on the two
cases that pin D-01 and D-02 (WR-01, WR-02). Judge blinding misses the variant B/C table's own
headings (WR-03). The tabulator writes its rollup under a filename that is neither gitignored nor
hygiene-swept (WR-04). One gate check uses bare `includes` where the library's own rule demands the
negation-aware pass (WR-05). The metered rounds are deliberately not run; that halt is not a finding.

## Critical Issues

### CR-01: Variant C cannot be built, and its lz-tpp transform would put the banned test-state gate back into the measured arm

**File:** `.claude/skills/lz-red-workspace/variants/build-variants.mjs:143-161`
(cross-ref `plugins/lz-tdd/skills/lz-tpp/SKILL.md:67-70`, `e2e-rgr-routing/RUN-GATE.md:58-65, 433-440`)

**Issue:** `C_POINTER['lz-tpp'].from` is the six-line step-1 opening as it stood at 22-06 ("Once a
branch below has settled this as the green step, confirm the green phase before ranking anything:
exactly one new failing (red) test, all prior tests green, and the code compiles..."). Commits
`6587d65`, `1717fb8` and `b55bd76` later rewrote lz-tpp step 1 to the current four lines and moved the
phase assumption to step 2. `build-variants.mjs` was not updated after `41bf593`. Measured with a
read-only probe over `VARIANTS`:

```
variant-c replaceRun skills\lz-tpp\SKILL.md from-run matches: 0 | to carries "all prior tests green": true
```

Consequences:

1. `replaceRun` fails closed (exit 1) on variant C, so `out/lz-tdd-variant-c` is never produced and
   `selfcheck-routing.mjs` then exits 1 on the missing tree. RUN-GATE's pre-run checklist step 2 and
   its "OFFLINE INSTRUMENT PROOF" battery both fail, so Round A cannot start. Both RUN-GATE and
   ROUTING-AB-RESULTS claim the opposite: "proved the whole instrument GREEN offline".
2. The `to` run is worse than stale. Copying the current `from` lines in mechanically would still
   apply the old `to`, which re-inserts the literal `TEST_STATE_TOKENS` member `all prior tests green`
   and the confirm-the-green-phase-before-ranking gate that the phase removed as a D-03 violation.
   Variant C would then differ from A and B in routing CONTENT, not just placement, and the A/B would
   measure the wrong variable. Nothing catches this: no single-axis check runs over the generated
   trees, and `build-variants` is not part of `npm run check`.

**Fix:** Re-anchor `from` on the current text and drop the green-phase clause from `to`:

```js
'lz-tpp': {
  from: [
    '1. Classify the request by what the developer is asking for, never by the state of the suite. A',
    '   cleanup ask is a structure-only refactoring that belongs to lz-refactor, so it is never',
    '   priority-ranked here. See "The green step vs the red step (lz-red) and the refactor step',
    '   (lz-refactor)" above; do not restate it. Take the FIRST branch that matches:',
  ],
  to: [
    '1. Classify the request by what the developer is asking for, never by the state of the suite. A',
    '   cleanup ask is a structure-only refactoring that belongs to lz-refactor, so it is never',
    '   priority-ranked here. The full case-to-owner table, the two-hop rule and the edge cases live',
    '   in the plugin-wide routing reference ' + TABLE_CITE + '; read it',
    '   rather than restating it here. Take the FIRST branch that matches:',
  ],
},
```

Then close the gap that let the drift go unnoticed. Have `build-variants.mjs` assert
`keysOnTestState(flatten(text)).length === 0` over every edited SKILL.md (import from
`tools/lib/routing-parse.mjs`). Also add a no-write mode (build into `os.tmpdir()`, or resolve
transforms only) that `npm run check` runs, so a shipped-prose edit that breaks a variant anchor goes
red when it lands, not at metered-run time.

## Warnings

### WR-01: On the two-hop case c4, the only deterministic outcome the grader can produce is FAIL

**File:** `.claude/skills/lz-red-workspace/grade-routing.mjs:501-505, 517-522`

**Issue:** c4 expects `lz-red -> lz-tpp`. An answer that affirms both names is `multiple` and always
goes to the judge. An answer that affirms exactly one name is resolved deterministically by
`destination.label === expected`, and no single label can equal a two-hop label. So "write the
failing test first, that is lz-red's job, then make it pass" (correct first hop, second hop described
but not named by slug) is a hard deterministic FAIL. An answer that names NO skill gets the more
lenient judge path. Naming the correct owner therefore scores worse than naming none, on the one case
that pins D-02. Because the split differs by arm (inline wording versus table wording changes how
often a slug gets named), this bias can show up as an arm effect.

**Fix:** When `expected` contains `HOP`, send `exactly-one` to the judge (or pass it only when the
single name equals `caseSpec.expectedOwner` and judge the second hop):

```js
if (destination.cardinality === 'exactly-one' && !expected.includes(HOP)) {
  passed = destination.label === expected;
  ...
} else if (destination.cardinality === 'exactly-one') {
  evidence = `judge: one destination (${destination.label}) on an ordered two-hop case expecting ${expected}`;
}
```

Add a selfcheck leg: a c4 answer naming only `lz-red` must be `passed === null`, not `false`.

### WR-02: The residual case c9 passes deterministically on ANY answer that names no slug, so it measures nothing

**File:** `.claude/skills/lz-red-workspace/grade-routing.mjs:506-511`

**Issue:** `zero` affirmed names on c9 is a deterministic PASS. A skill-loaded model that answers the
CLI argument-parsing question by coaching it as a refactor ("extract a parser function, then replace
the conditional with a table...") names no slug, so it passes. That answer is the exact
residual-capture failure D-01 exists to prevent, the "anything mentioning code lands here" shape the
evasion suite records as M2/M2b. Models rarely emit `lz-*` slugs in coaching prose, so c9 will read at
or near 100% in every arm by construction. That inflates every arm's Pass@k equally and hides the one
routing failure c9 was added to catch.

**Fix:** Do not resolve c9 deterministically on absence. Send `zero` on the residual case to the judge
too, or make the deterministic pass require an affirmative no-owner signal in the answer (for
example the residual marker family `not a red-green-refactor ... no skill ... owns`, matched through
the negation-aware pass). Record the change symmetrically for all arms, per ROUTING-AB-RESULTS'
own rule.

### WR-03: Judge blinding misses the variant B/C table's own headings, so a B/C answer can still be identified

**File:** `.claude/skills/lz-red-workspace/grade-routing.mjs:287-337`

**Issue:** `shippedSectionHeadings` reads only `plugins/lz-tdd/skills/*/SKILL.md` in the TRACKED tree,
and the comment justifies that with "A's heading set is the superset that contains every heading a
leak could name". That is false. Variants B and C ADD `references/rgr-routing.md`, whose `##` headings
(`The routing table`, `Edge cases`) and bold edge-case titles (`The two-hop rule, and why Law 1 forces
it`, `The residual terminal claims nothing`) exist only in those arms. An answer that says "per the
routing table's Edge cases" reaches the judge unstripped and identifies a B/C arm, while
`normalization_fired` reports nothing, which makes the "blindness evidenced" table lie by omission.

**Fix:** Derive the blinding set from all three trees: add the headings of
`variants/rgr-routing.md` (`^#{1,3}` plus the `^\*\*...\*\*` edge-case titles) to the set, and fix the
superset comment. Add a selfcheck leg with a fixture answer quoting `Edge cases` that must fire
`section-heading`.

### WR-04: The tabulator's routing rollup is written as `mechanical-red.json`, which is neither gitignored nor hygiene-swept; the `mechanical-routing.json` entries cover a file nothing writes

**File:** `.claude/skills/lz-red-workspace/tabulate-mechanical-red.mjs:886`, `.gitignore:85-89`,
`.claude/skills/lz-red-workspace/check-evals.mjs:254-258`

**Issue:** `main` always writes `path.join(suiteDir, 'mechanical-red.json')`, including under
`--suite e2e-rgr-routing`. The routing-suite ignore line covers only `e2e-rgr-routing/mechanical-routing.json`, and
`git check-ignore` confirms `e2e-rgr-routing/mechanical-red.json` is NOT ignored (the existing
`e2e-red-*/mechanical-red.json` line does not reach it). The check-evals comment says "the name is
FIXED HERE and 22-05's tabulate step follows it", but the tabulator does not follow it. Result: the
first Round A rollup leaves an untracked file of model-derived numbers in the suite dir, ready to be
staged. Because `SUITE_SKIP_FILES` also lists `mechanical-red.json`, if it is committed it escapes the
clause-8 ASCII and email sweep of this public repo.

**Fix:** Make the rollup name follow the suite: derive it from the grade file or the suite, or add an
`--out-name` flag that the RUN-GATE command passes as `mechanical-routing.json`. Or ignore
`e2e-rgr-routing/mechanical-red.json` explicitly and delete the unused `mechanical-routing.json`
entries. Then keep `.gitignore`, `SUITE_SKIP_FILES` and the tabulator on one name.

### WR-05: The intro two-hop check accepts a NEGATED first-hop claim, because it uses bare `includes`

**File:** `.claude/skills/lz-red-workspace/tools/check-rgr-routing.mjs:936`
(rule it violates: `tools/lib/routing-parse.mjs:465-468`)

**Issue:** `claimed = FIRST_HOP_CLAIM_PHRASES.filter((p) => redSentence.toLowerCase().includes(p))`.
The library states that any guard matching a phrase list against authored prose must go through
`affirmedPhrasesIn`, because a substring test cannot tell an assertion from its inversion. The mode-gate
delegation check and the tie-break check follow that rule; this check does not. Measured with a probe:

```
"An ask to add a new behavior does not take the red step first: hand it to lz-red after the
 code exists, then lz-tpp."
destinationsIn -> [lz-red, lz-tpp]; includes("red step first") -> true; affirmedPhrasesIn -> []
```

With that sentence in lz-refactor's intro, the `[cls-03] intro two-hop rule` check passes even though
the intro denies the first hop. That is the same mention-is-not-a-claim evasion the comment block at
lines 898-913 says this check was rebuilt to close.

**Fix:**

```js
const claimed = affirmedPhrasesIn(redSentence, FIRST_HOP_CLAIM_PHRASES);
```

Add an evasion entry with the negated sentence above.

### WR-06: `selfcheck-routing.mjs` does not prove the variant trees were built from the CURRENT tracked tree

**File:** `.claude/skills/lz-red-workspace/selfcheck-routing.mjs:369-416`

**Issue:** `crux 3` compares frontmatter only, and `crux 4` compares the delta SET only. A tree built
before a later SKILL.md body edit (exactly what happened between 22-06 and 22-08 for lz-tpp) still
shows each SKILL.md as `edited`, which is declared, and still shows identical frontmatter when the
description did not change. So a stale `out/` tree passes all six checks and the treatment arms run
older routing bodies than variant A. `out/` persists across sessions in one checkout, so this needs no
fresh clone to happen.

**Fix:** Have `build-variants.mjs` write a stamp (for example `out/<variant>/.source-hash` holding
the `hashTree(SOURCE_DIR)` digest plus a hash of `build-variants.mjs` and `rgr-routing.md`) outside
the plugin tree. Have selfcheck-routing recompute the hash and fail on mismatch with "rebuild the
variants".

### WR-07: `npm run check` now rewrites shipped plugin files in place, with no signal-safe restore

**File:** `.claude/skills/lz-red-workspace/package.json:8`
(callee `tools/check-rgr-routing.evasions.mjs:604-611`)

**Issue:** The `check` script now ends with `check-rgr-routing.evasions.mjs`, which does
`fs.writeFileSync(target, mutated)` on tracked `plugins/lz-tdd/**` files, runs the gate, and restores
the file in a `finally`. A `finally` does not run when Node is killed by SIGINT, SIGTERM or SIGKILL (a
tool timeout, Ctrl-C, a closed terminal). An interrupted `npm run check` therefore leaves a shipped
SKILL.md carrying a deliberate routing defect. A second session running the same check against the
same checkout corrupts the baseline of the first. RUN-GATE lists this command under "Everything
below is free and safe to re-run at any time", and the brief for this review treats it as a read-only
deterministic check, so it is advertised as harmless. The suite's own restore verification cannot help
after a kill.

**Fix:** Run the evasion suite against a COPY. Give `check-rgr-routing.mjs` a root argument (or env
override) and have the evasion script copy `plugins/lz-tdd` to `os.tmpdir()` and mutate only there.
Until then, take it out of `check` (keep `check:evasions`) and install `process.on('SIGINT'|'SIGTERM')`
handlers that restore `original` before exiting.

### WR-08: `grade-routing.mjs --suite` exits 0 on a missing or empty suite

**File:** `.claude/skills/lz-red-workspace/grade-routing.mjs:628-634, 887-893`

**Issue:** `collectRunDirs` returns `[]` when `results/recommend` is absent, and `main` prints
"nothing to grade" and exits 0. A mistyped `--suite` path, or a capture written under a different
mode, reads as success. The file header says the grader "fails CLOSED", and the sibling tabulator was
changed in this phase for exactly this reason ("exits 0 having tabulated nothing is the failure that
looks healthiest") and now refuses a `--suite` without `suite.json`.

**Fix:** Require `suite.json` in `--suite` and exit non-zero when it is absent. Treat zero captured
runs as exit 2 (an IO/usage error) unless an explicit `--allow-empty` is passed.

### WR-09: RUN-GATE states a superseded model pin and stale description lengths as current facts

**File:** `.claude/skills/lz-red-workspace/e2e-rgr-routing/RUN-GATE.md:52-54, 130-132, 365-379`

**Issue:** (a) The checklist says the descriptions went "lz-refactor from 1233 to 1369 chars, lz-tpp
from 750 to 840, lz-red from 1245 to 1439". The gate measures them today at 1495, 1139 and 1466. The
baselines also contradict `check-rgr-routing.mjs:126-133`, which records the earlier values as lz-red
1233 and lz-refactor 1245, swapped. (b) The document calls `claude-opus-5` "the current default Claude
Code model" for both Round A (`run-e2e.mjs` default) and Round B (`--model claude-opus-5`). The
current generation is Opus 5.5. That is inferred from the session model and the owner's model notes,
not from the CLI's own `system/init`. The project rule is to pin the current default and re-check per
generation. A round approved from this page would run on a superseded model while the page calls it
current.

**Fix:** Replace the hard-coded lengths with "see the `[cls] description char cap` lines of
`check-rgr-routing.mjs`", as that file's own comment already recommends. Re-verify the default model
from the CLI's `system/init` before the gate is presented, then update `run-e2e.mjs`'s `MODEL` default
and both Round B commands together.

### WR-10: Branch (c)'s "before any test covers it" is a suite-state qualifier inside a routing condition

**File:** `plugins/lz-tdd/skills/lz-refactor/SKILL.md:77-79`, `plugins/lz-tdd/skills/lz-red/SKILL.md:83-85`,
`plugins/lz-tdd/skills/lz-tpp/SKILL.md:79-81` (also `beck-tdd-by-example.md:75-76`,
`three-laws-and-test-selection.md` classify-first paragraph)

**Issue:** The two-hop branch keys on "Asking to add a new behavior, or to change what working code
does, before any test covers it". Read as intended, "it" is the NEW behavior, which no test covers by
definition, so the qualifier adds nothing. Read the way a model plausibly reads it, as "the code has no
tests yet", it is a coverage condition, the axis D-03 forbids. Then a request to change what
ALREADY-TESTED code does matches neither (c) nor (d), which excludes behavior changes, and falls to
(e): "not a red-green-refactor-loop request ... answer the question directly". That routes a behavior
change around Law 1 to a direct answer, the dead end this phase exists to remove. The narratives in
all three skills state the rule without the qualifier, so the procedures and the narratives disagree.
`keysOnTestState` returns `[]` for the clause (probed), because the list is a literal blocklist (the
recorded OPEN-5 ceiling). This rests on how the clause reads rather than on a measured misroute.

**Fix:** Delete ", before any test covers it" from branch (c) in all three step-1 procedures and the
two references. If the intent was "before a failing test exists for it", say that: "...change what
working code does -- the red step writes the failing test for it first". Then re-run the gate (the
`add a new behavior` matchToken is unaffected).

### WR-11: Impossible-state guard: the one-byte probe in `crux 3` tests SHA-256, not the frontmatter extraction

**File:** `.claude/skills/lz-red-workspace/selfcheck-routing.mjs:372-377`
**Category:** necessity

**Issue:** The probe asserts `hashOf(probe) !== hashOf(probe + ' ')`. That can never fail: SHA-256
discriminates a one-byte difference by construction (`crypto.createHash('sha256')`, line 212). The
empty-pass risk this check actually carries is in `frontmatterBlock`: for example, extraction
returning the same slice for every file, or the trees being the same directory. The probe does not
exercise that code.

**Fix:** Replace it with a probe through `frontmatterBlock` itself: write two temp files whose
frontmatter differs by one byte and assert their block hashes differ. Or drop it and rely on the
distinct-tree assertion in `crux 1`, recording that in a comment.

## Info

### IN-01: ROUTING-AB-RESULTS contradicts RUN-GATE on the rollup gaps, and miscounts the surfaces

**File:** `.claude/skills/lz-red-workspace/ROUTING-AB-RESULTS.md:38, 200-207`

**Issue:** "The rollup is not fully automated yet ... Whoever fills this document must confirm run
completeness by hand, or close the gaps first" is stale: RUN-GATE records both gaps CLOSED with the
updated commands. Line 38 says the classifier is fixed "across all six surfaces"; the gate declares
eleven.

**Fix:** Point the caveat at RUN-GATE's CLOSED note and the `merge-judge --verify` command, and say
"eleven surfaces".

### IN-02: The selftest header still says the real gate is deliberately RED

**File:** `.claude/skills/lz-red-workspace/tools/check-rgr-routing.selftest.mjs:5-6`

**Issue:** "it stays GREEN while the real gate is deliberately RED against today's tree". The gate is
GREEN, and lines 46-51 of the same header say so.

**Fix:** Drop the clause.

### IN-03: `COVERAGE_FLOOR` fails open for a router surface that has no entry

**File:** `.claude/skills/lz-red-workspace/tools/check-rgr-routing.mjs:452`

**Issue:** `COVERAGE_FLOOR[surface.id] ?? []` gives a new non-step-1 router an empty floor, so its
coverage-floor check passes with nothing to check and the deleted-ask-words escape documented at lines
430-432 reopens for that surface. Every current surface has an entry, so this is latent.

**Fix:** Report a FAIL when `!(surface.id in COVERAGE_FLOOR)`.

### IN-04: Heading blinding has no word boundaries and strips ordinary prose

**File:** `.claude/skills/lz-red-workspace/grade-routing.mjs:108-115, 358-368`

**Issue:** `phraseReAll` is case-insensitive and unanchored, and the derived set includes generic
headings such as `Two modes` and `Reference material`. "The skill runs in two modes" becomes
"The skill runs in [section heading]", and the substitution counts toward `section-heading` fired.
The effect is symmetric, so it does not bias the A/B, but it inflates the "blindness evidenced" count
and degrades judge input.

**Fix:** Add `\b` anchors, and strip a generic heading only when it appears quoted or as a heading
line.

### IN-05: The `variant_a` read rate is not a structural zero

**File:** `.claude/skills/lz-refactor-workspace/e2e-nx/run-e2e.mjs:497`, `e2e-rgr-routing/RUN-GATE.md:97-99`

**Issue:** The matcher is `readPath.toLowerCase().includes('rgr-routing.md')`. The workspace source
`.claude/skills/lz-red-workspace/variants/rgr-routing.md` matches too, and it can be reached from the
in-repo cwd (Read is not blocked in recommend mode). A variant A run that reads it would record
`routing_table_read: true` and see the whole case-to-owner table. suite.json's `repo_note` admits the
walk-up risk, but RUN-GATE and ROUTING-AB-RESULTS still call A's rate a structural zero.

**Fix:** Match on `references/rgr-routing.md` and record any read of `variants/rgr-routing.md` as a
separate contamination flag.

### IN-06: A state-framed routing sentence sits in the plugin reference outside every declared surface

**File:** `plugins/lz-tdd/references/beck-tdd-by-example.md:47-51`

**Issue:** "Once the bar is green, drive out duplication ... The second rule is where lz-refactor
lives". `the bar is green` and `once the bar is green` are `TEST_STATE_TOKENS` members, and the next
sentence maps that state to a skill. `## The two rules` is not a declared surface, and the beck intro
sweep stops at the first `##`, so no check reads it. This is a paraphrase of Beck's rule rather than a
routing branch, and a model reading the file could take it as one.

**Fix:** Rephrase the mapping on the ask, for example "Removing that duplication is a structure-only
change, which is the refactor step, lz-refactor's." Or add `## The two rules` to the contradiction or
whole-section sweep.

---

_Reviewed: 2026-11-24T17:53:15Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: deep_
