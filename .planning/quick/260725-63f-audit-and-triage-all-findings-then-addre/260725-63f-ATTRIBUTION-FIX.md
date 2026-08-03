# 260725-63f -- ATTRIBUTION FIX (D-06 false-PASS closure)

Closes the false-PASS the k=1 `with_skill` pilot exposed in the D-06 correctness gate, plus the
contradicting run-summary line in the shared harness.

Base: `ac53a7e`. Two atomic commits on `worktree-agent-abfdb97b177208dca`:

| Commit | Subject |
|--------|---------|
| `1f5b00b` | `fix(lz-red): attribute the D-06 RED to the test the diff actually added` |
| `b9fa4d4` | `fix(e2e): count the run summary off the suite's own tracked skills` |

Zero `claude -p` spend. No file under `plugins/lz-tdd/` in the diff (verified: 0).

---

## 1. The defect

`classify()` in `grade-red.mjs` decided `genuinely_red` on a FILE-level question -- "does the suite
have at least one failed assertion, and is every failure an assertion error?" -- and never asked
whether the failure belonged to the test the model wrote.

The captured `with_skill` run (2026-07-25, exit 0, 78 s, $0.51) APPENDED its Conjured test to the
kata's existing `TypeScript/test/vitest/gilded-rose.spec.ts`, which ships a permanently failing
`should foo` placeholder asserting `'fixme'`. So the file was already red before the produced test
ran, and the recorded `failure_excerpt` was that placeholder's message:

```
"expected 'foo' to be 'fixme' // Object.is equality"
```

That run's verdict was right by luck -- its Conjured test also fails (asserts 4, current code
yields 5) -- but the gate did not establish it. **A model that appends a test which PASSES would
have graded `genuinely_red` / `pass: true` on the borrowed failure**, which is precisely the
`false_green` case D-06 exists to catch. Arm-independent, so it would have inflated every arm's
Pass@k equally while hollowing out the eval's only hard correctness gate. Both kata spec files
(`test/jest/` and `test/vitest/`) ship the placeholder, so both routes were exposed.

---

## 2. The fix -- attribution

`genuinely_red` now requires at least one failing assertion belonging to a test the produced diff
ADDED.

**Extraction** (`extractTestTitles`, per source line, two regexes):

- direct: `it('t')`, `it.only("t")`, `test.skip(\`t\`)`, `it.failing('t')`, and the rest of the
  modifier chain (`todo` / `fails` / `concurrent` / `sequential` / `runIf` / `skipIf` / `for` /
  `extend`);
- `.each`: `it.each([[1, 2]])('adds %i and %i')` and `` test.each`a|b`('$a + $b') `` -- the table
  argument sits between the modifier chain and the title, so it needs its own pattern.

Both are line-scoped, so a `.each` table spanning several lines simply does not match, which fails
in the safe direction (unattributable, never a pass).

**Diff walk** (`addedTestTitles`): titles from `+` lines inside a TEST file only. Titles the diff
also shows on its pre-existing side (context or `-` lines) are dropped as AMBIGUOUS -- a duplicated
or moved test cannot be told from the one that was already there. A header git QUOTED (and this
therefore cannot parse) resets the current file to "not a test file" rather than carrying the
previous one forward.

**Matching** (`titleMatcher`, against `assertionResults[].title`, never `fullName`):

- an ordinary literal matches EXACTLY;
- a `.each` or template-literal title is reported SUBSTITUTED (`'adds %i and %i'` arrives as
  `'adds 1 and 2'`), so each placeholder (`%s %d %i %f %j %o %p %# %%`, `$var`, `$#`, `${...}`)
  becomes a wildcard while every literal part still has to match, anchored;
- **the wildcard treatment applies ONLY to `.each` / backtick titles.** A plain `it('%s')` is
  reported verbatim, and wildcarding it would hand the model under test a matcher claiming every
  test in the file -- including a pre-existing failing one;
- an ALL-placeholder title (`'%s'`) is refused outright for the same reason.

**Decision order in `classify()`:**

1. `newErrors > 0` -> `compile_error` (unchanged).
2. zero assertion results -> `no_tests` / `collection_error` (unchanged).
3. **nothing in the file failed** -> `false_green` / `drove_to_green`. Sound WITHOUT attribution
   (if nothing failed, the added test passed too), so it deliberately stays the first branch and
   today's clean new-file shape is untouched.
4. something failed, and an ADDED test is among the failures -> right-reason check over the ADDED
   failures only -> `genuinely_red` / `wrong_reason`.
5. something failed, added tests RAN and all PASSED -> `false_green` / `drove_to_green`. **This is
   the defect shape.**
6. something failed, nothing attributable -> `unattributable` (new 8th class).

Step 4 narrowing matters in both directions: a broken placeholder already in the file can no longer
turn the model's genuine assertion failure into `wrong_reason` either.

### Why `unattributable` is its own class

"No failure could be tied to a test the diff added" is NOT the claim "the added test passed".
Folding it into `false_green` would assert something the runner report does not support. It is
`pass: false` either way, but the two demand different operator responses: `false_green` is a model
result, `unattributable` is a prompt-me-to-look signal.

Kept consistent across: `VERDICTS`, `whyFor()` (it names the extracted titles that matched
nothing), the `grade-red --selfcheck` class list and closing message, `selfcheck-red` crux 5,
RUN-GATE.md, EVAL-RESULTS.md. The tabulator needs **no** code change -- it keys on the single
`pass` boolean, never on the class list -- and now carries a comment saying so, because a second
copy of the vocabulary would be a second place to forget.

### Auditability

`failure_excerpt` reports the ATTRIBUTED failure and labels its source, so a borrowed one is
visibly borrowed rather than silently presented as the produced RED:

```
added test "should degrade Conjured items ...": expected 5 to be 4 // Object.is equality
PRE-EXISTING test "should foo": expected 'foo' to be 'fixme' // Object.is equality
```

`red-grade.json` gains `added_test_titles` and `attributed_failures`. Without them an
`unattributable` verdict is unreadable -- the operator cannot see what the gate extracted.

---

## 3. The `gradeFixture` integration hazard, fixed honestly

`gradeFixture` passed a header-only synthetic diff with **no `+` lines**, so it carried no added
titles. Under attribution every existing fixture would have become `unattributable` and the 7-class
selfcheck would have collapsed.

Fixed by making the DIFF part of the fixture:

- a fixture that ships its own `diff.patch` is graded against it verbatim -- the only way to express
  an APPEND onto a file that already contains a failing test;
- every other fixture gets a real new-file diff synthesized from its own spec source
  (`newFileDiff`), which is exactly the diff a model produces when it creates a spec from nothing.

**No bypass flag.** A flag disabling attribution for fixtures would have reopened the hole in the
one place nobody re-reads; the code comment says so explicitly so the idea does not come back.

---

## 4. Anti-regression, at both layers

**`fixtures/borrowed/`** (workspace toolchain, `grade-red --selfcheck`) -- `module.spec.ts` holds a
permanently failing `should foo` placeholder plus an APPENDED test that PASSES; `diff.patch` adds
only the appended one. Asserted `false_green`, `pass: false`.

**Discrimination on identical inputs** -- the selfcheck carries `classifyPreAttribution()`, the
pre-fix rule reproduced verbatim as a dead-end copy, and runs BOTH rules on the same runner report:

```
[classify:attribution] borrowed-failure shape -> false_green (pass=false) OK
                       -- the pre-fix rule scored the SAME inputs 'genuinely_red' / pass=true
```

The proof also asserts the pre-fix rule DID say `genuinely_red`, so the check fails loudly if it
ever stops exercising the defect it claims to close.

**`fixtures/canary-borrowed/`** (crux 7, the kata's REAL `vitest@0.28.5`) -- the same shape appended
to the kata's own `test/vitest/gilded-rose.spec.ts`, added test `degrades a normal item by one
before its sell-by date` (passes on current code: quality 10 -> 9). Asserted `false_green`,
`pass: false`, `attributed_failures` 0, and an excerpt starting `PRE-EXISTING test`.

This one closes a structural blind spot: the three existing canaries all write a BRAND-NEW spec
file, the single shape where "the file has a failing assertion" and "the added test failed" happen
to coincide. **None of them could have seen this defect.**

Additional coverage added:

- crux 7 `canary-rundir` now also asserts `added_test_titles`, `attributed_failures === 1`, and an
  `added test "..."` excerpt -- the only step proving the TARGET's real runner reports a `title` the
  gate can match. If it did not, every real run would grade `unattributable`.
- crux 5 re-asserts the borrowed shape and the unattributable shape at the crux layer, and its
  classifier inputs were upgraded from a header-only diff / untitled assertions to realistic ones.
- `grade-red --selfcheck` covers parameterized titles in both directions: a substituted `.each`
  title attributes (`genuinely_red`), an unrelated title does not, and an all-placeholder pattern
  attributes nothing.

---

## 5. Secondary fix -- the contradicting summary line

`run-e2e.mjs` counted `used_refactor || used_tpp`, two hardcoded scalars off the LEGACY substring
probe. On the RED suite it printed

```
with_skill: 0/1 runs invoked an lz skill (lz-refactor or lz-tpp).
```

directly under the correct per-run `model-fired: lz-red` -- two contradicting statements about the
same run in one output.

Now `countModelFired(withSkill, TRACK_SKILLS)` reads `skills_model_fired` for the skills
`suite.json` actually tracks. No legacy fallback in that path: `runOne` writes the field for every
meta in the loop, so a missing key would be a bug worth surfacing rather than defaulting to 0.

**No lz-refactor regression.** The scalars stay in `meta.json` untouched, and `report()` -- which
walks ALREADY-CAPTURED results from disk, including pre-fix metas -- still reads them; that is where
back-compat matters. On the nx suite `TRACK_SKILLS` is the same lz-refactor pair, so the only change
is that the count comes from model-fired rather than the substring probe, which over-counted a mere
mention.

Pinned by crux 4 on the exact regression shape (`skills_model_fired['lz-red'] = 1`, both legacy
scalars false): the new count returns 1, the old expression returns 0 on the same meta (asserted),
and the lz-refactor pair still counts correctly.

---

## 6. Evidence

### The six DoD commands -- all exit 0

| Command | Exit |
|---------|------|
| `grade-red.mjs --selfcheck` | 0 -- all EIGHT classes + attribution + discrimination |
| `tabulate-mechanical-red.mjs --selfcheck` | 0 |
| `merge-judge.mjs --selfcheck` | 0 |
| `selfcheck-red.mjs` | 0 -- 20 crux lines, no SKIP except crux 3's on-disk-transcript extra |
| `check-evals.mjs` | 0 |
| `claude plugin validate .` | 0 |

### Re-grade of the captured `with_skill` run (offline, free)

Graded from a scratchpad COPY so the committed artifact was not overwritten:

```json
{
  "verdict": "genuinely_red",
  "pass": true,
  "why": "tsc --strict clean; >=1 assertion failure in a test the diff ADDED (correct RED)",
  "runner": "vitest",
  "runner_version": "0.28.5",
  "added_test_titles": ["should degrade Conjured items in quality twice as fast as normal items"],
  "attributed_failures": 1,
  "failure_excerpt": "added test \"should degrade Conjured items in quality twice as fast as normal items\": expected 5 to be 4 // Object.is equality"
}
```

Still `genuinely_red` (its Conjured test genuinely fails), and the excerpt now names the MODEL'S
test instead of `expected 'foo' to be 'fixme'`. This also empirically confirms vitest 0.28's JSON
report carries a per-assertion `title` the gate can match -- the one fact attribution depends on
that could not be proven from hand-built fixtures.

### No lz-refactor regression

- **222 composed prompts byte-identical** (10 suites x 2 modes x 3 arms; 216 lz-refactor + 6 RED),
  diffed against a snapshot taken before the first edit. The only textual difference anywhere in
  the raw snapshot was a line number inside the `e2e-reference apply` "no code prompts selected"
  error -- not a composed prompt; the `-p` values and `--plugin-dir` values are identical.
- `selfcheck-code-review.mjs` exit 0.
- crux 6 (nx composes 3 arms with `plugins/lz-tdd`; shared apply preamble byte-for-byte) passes.

### Borrowed repo

Kata checked before and after every grading run: `git status --porcelain` empty, exactly ONE
worktree entry (`main`), no extra branch, `TypeScript/node_modules` at 308 entries.

### Hygiene

- ASCII-only across every touched file (`rg '[^\x00-\x7F]'` -> no match).
- Email allowlist-inversion over every touched file: zero email-shaped tokens present. Commit
  identity is the public gmail. The forbidden value was never written as a needle.

---

## 7. Residual risk (RUN-GATE.md Step 2 updated with this list)

What attribution does NOT cover, and how each direction lands:

- **Attribution is by TITLE, not by hunk position.** A diff that only edits an EXISTING test's body
  -- tightening an assertion rather than adding a test -- declares no new title and grades
  `unattributable`, never a pass. Deliberate (fail closed), but it means **an `unattributable`
  cluster must be inspected via `added_test_titles` before anything is attributed to an arm.**
- **A DYNAMIC title cannot be extracted.** `it(caseName, ...)`, or a `.each` table spanning several
  source lines, leaves no literal to match -> `unattributable` rather than an unverified pass.
- **Parameterized titles ARE handled** (wildcard per placeholder, anchored literals), and an
  all-placeholder title is refused.
- **A duplicated title is ambiguous and attributes nothing** (moved/duplicated test).
- **Attribution says nothing about test QUALITY.** It answers "did the model's own test fail?", not
  "was it the right next test" or "does it assert observable behavior" -- those stay judge /
  oracle-reviewer dimensions in EVAL-RESULTS.md.
- **A pre-existing failure is excluded from the wrong-reason check too**, so a broken placeholder
  cannot mask a genuine RED.

Everything in the pre-existing residual list (absolute-path writes from the produced spec, the
`no_tests` / `collection_error` directory-pin residual, modern-syntax `compile_error`, GRC
contamination) is unchanged.

---

## 8. Files touched

```
.claude/skills/lz-red-workspace/grade-red.mjs                          (attribution + 8th class + excerpt + fixture diffs)
.claude/skills/lz-red-workspace/selfcheck-red.mjs                      (crux 4 summary count, crux 5, crux 7 borrowed canary)
.claude/skills/lz-red-workspace/tabulate-mechanical-red.mjs            (comment: keys on `pass`, not the class list)
.claude/skills/lz-red-workspace/fixtures/borrowed/{module.ts,module.spec.ts,diff.patch}   (new)
.claude/skills/lz-red-workspace/fixtures/canary-borrowed/{meta.json,diff.patch}           (new)
.claude/skills/lz-red-workspace/e2e-red-gilded-rose/RUN-GATE.md        (canary list + residual risk + pilot history)
.claude/skills/lz-red-workspace/e2e-red-gilded-rose/EVAL-RESULTS.md    (pass criterion)
.claude/skills/lz-refactor-workspace/e2e-nx/run-e2e.mjs                (countModelFired + summary line)
```

---

## 9. State

The metered run remains HALTED behind its blocking-human gate. The instrument is BUILD-complete and
green offline; the one approved metered run is the orchestrator's to make.
