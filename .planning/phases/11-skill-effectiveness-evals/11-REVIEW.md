---
phase: 11-skill-effectiveness-evals
reviewed: 2026-07-10T06:52:06Z
depth: deep
files_reviewed: 5
files_reviewed_list:
  - .claude/skills/lz-refactor-workspace/grade-run.mjs
  - .claude/skills/lz-refactor-workspace/check-evals.mjs
  - .claude/skills/lz-refactor-workspace/run-recall-chunks.mjs
  - .claude/skills/lz-refactor-workspace/evals/trigger-eval.json
  - .claude/skills/lz-refactor-workspace/evals/evals.json
findings:
  critical: 1
  warning: 3
  info: 2
  total: 6
status: issues_found
---

# Phase 11: Code Review Report

**Reviewed:** 2026-07-10T06:52:06Z
**Depth:** deep
**Files Reviewed:** 5
**Status:** issues_found

## Summary

Reviewed the Phase-11 eval assets for the lz-refactor skill: the deterministic
behavior grader (`grade-run.mjs`), the build-time trigger-set lint (`check-evals.mjs`),
the canary-gated recall runner (`run-recall-chunks.mjs`), and the two eval-data JSON
files. Analysis was deep (cross-file: grader RUBRICS <-> evals.json, canary constant
<-> trigger-eval.json positive, NAME_LAYERS derivation <-> layer checks). `--selfcheck`
passes on the current tree.

The independent auditor's two prior observations (deterministic `layer` is not an
exclusion gate; name-matching is substring / negation-blind / presence-not-primacy)
were taken as ground truth and are NOT re-reported. Building on that substrate, I found
a CONCRETE, reproducible false-grade the prior notes did not pin down: the name->layer
lookup itself misclassifies one Fowler refactoring into the `functional` layer via a
word-bounded sub-phrase collision, which makes the eval-7 layer check emit a false
`passed: true`. That is BLOCKER-class because the grader's single job is emitting
correct deterministic per-expectation verdicts.

The remaining findings are correctness/robustness defects in the recall runner
(a canary/eval-set text drift that mis-measures recall, plus two uncaught-crash paths
that defeat the documented "resumable/idempotent" design) and two lower-severity
reporting/fail-closed gaps.

Adversarial data-integrity pass on the eval JSON: I checked every trigger-eval.json
label and every evals.json expected refactoring. The trigger positives/negatives are
correctly labeled, the seam-negative probes are sound, and each scenario's pinned
best-fit and candidate set match the smell it describes. The one data defect found is
the canary text drift (WR-01), not a mislabeled trigger or a wrong expected refactoring.
The RUBRICS <-> evals.json count-and-order alignment is correct for all 9 evals, and
every scored name resolves in the lookup.

## Narrative Findings (AI reviewer)

### Critical Issues

#### CR-01: name->layer lookup misclassifies a Fowler refactoring as `functional` (confirmed false PASS on the eval-7 layer check)

**File:** `.claude/skills/lz-refactor-workspace/grade-run.mjs:167-179` (with `NAME_LAYERS` build at 139-164; source entries at line 92 `FOWLER` and line 132 `FUNCTIONAL`)

**Issue:**
`layersInResponse()` iterates every entry in `NAME_LAYERS` and unions the layers of
every catalog name whose `nameRe(name)` matches the response. `nameRe` is word-bounded
against `[\w-]` but NOT anchored, so a canonical name that is a whole-word sub-phrase of
a longer canonical name matches inside it. The functional leaf `"Factory Function"`
(layer `functional`, line 132) is a word-bounded sub-phrase of the Fowler name
`"Replace Constructor with Factory Function"` (layer `Fowler`, line 92). An exhaustive
scan of all four catalogs shows this is the only CROSS-layer collision, and it is
one-directional: naming the Fowler move also lights up `functional`.

Concrete failing case (reproduced through the actual grader):

```
$ node grade-run.mjs --eval-id 7 --output coach7.txt --metrics zero.json --out g.json
# coach7.txt names ONLY the Fowler move:
#   "the next move is Replace Constructor with Factory Function so callers build it explicitly."
```
emits, in `grading.preliminary.json`:
```json
{
  "text": "Routes to the Kerievsky-Away or functional layer (either is accepted)",
  "passed": true,
  "evidence": "named refactoring(s) resolve to accepted layer: functional"
}
```
The coach named a Fowler refactoring and no functional dissolution, yet the eval-7
layer expectation (which accepts `["Kerievsky-Away","functional"]`, line 298) is graded
`passed: true`. `functional` appears solely as a phantom sub-phrase of the Fowler name.
This is a false positive on a scored, deterministic check -- exactly the failure class
the grader exists to prevent. Because `layersInResponse` returns a SUPERSET, the fault
can only ever manufacture a false PASS on an accept-list layer check (never a false
fail), and today only eval 7 accepts `functional`, so the blast radius is that one
expectation. It does not by itself flip eval 7 to a full pass (the `candidateSet` check
still correctly fails on this response), but the layer signal is meant to be an
INDEPENDENT verdict, and any future eval whose accepted layer set includes `functional`
(or a rubric that drops the candidateSet gate) would turn this into a run-level false
pass. `--selfcheck` does not catch it because its name-resolve gate only asserts that
RUBRICS names EXIST in the lookup, never that a name resolves to exactly its own layer.

**Fix:** Resolve layers by longest-match / anchored identity instead of "any name that
matches anywhere." Two viable approaches:

```js
// Option A: only credit a matched name if no longer matched name contains it.
function layersInResponse(resp) {
  const matched = [...NAME_LAYERS.keys()].filter((name) => nameRe(name).test(resp));
  const found = new Set();

  for (const name of matched) {
    const shadowed = matched.some(
      (other) => other !== name && other.length > name.length && nameRe(name).test(other),
    );

    if (!shadowed) {
      for (const l of NAME_LAYERS.get(name)) {
        found.add(l);
      }
    }
  }

  return [...found];
}
```
Option B (data-side, narrower): keep a set of "sub-phrase" names and require them to
match with a trailing sentence boundary rather than mid-phrase. Option A is preferred
because it generalizes and also fixes the same-layer shadowing noted below.

Add a `--selfcheck` assertion that closes the gap:
```js
for (const [name, own] of NAME_LAYERS) {
  assert(
    JSON.stringify(layersInResponse(name).sort()) === JSON.stringify([...own].sort()),
    `name "${name}" resolves to ${layersInResponse(name)} but declares ${own}`,
  );
}
```
Note: `"Unify Interfaces"` is likewise a sub-phrase of `"Unify Interfaces with Adapter"`
(both Kerievsky, so it adds no EXTRA layer today and is harmless), but it is the same
defect class and Option A cleans it up too.

### Warnings

#### WR-01: recall canary constant drifts from the trigger-eval positive it stands in for; the real positive #6 is never measured and recall over-claims "all 10 positives"

**File:** `.claude/skills/lz-refactor-workspace/run-recall-chunks.mjs:18` and `:24`; `.claude/skills/lz-refactor-workspace/evals/trigger-eval.json:7`

**Issue:**
The runner intends the Extract Function catalog-lookup positive to serve as the
window-health canary, excluding it from the measured chunk set and reporting it
separately so the total covers "all 10 positives" (comments at lines 16-24, report at
lines 147-149). But the hardcoded `CANARY` text does not equal the trigger-eval.json
positive it represents:

```
trigger-eval.json[6]: "...and when should i reach for it instead of inlining?"
run-recall CANARY:     "...and when should i reach for it over inlining?"
```
(`"instead of"` vs `"over"`; verified `===` is false.)

The filter at line 24
(`!q.query.startsWith("what does Extract Function actually do")`) removes the REAL
positive #6 from `positives`, and the appended canary is the DIFFERENT variant, so:
1. trigger-eval.json positive #6 is never run in any chunk (excluded) nor is it the
   canary (different string) -- it is silently dropped from measurement entirely.
2. The line-149 "RECALL (canary-validated, all 10 positives)" figure counts a query
   that is not in the eval set as the 10th positive.

The recall metric therefore does not measure what it claims. The two strings are
semantically near-identical so the reported number is probably close, but a phase whose
deliverable is a trustworthy recall figure should measure the actual eval-set query.

**Fix:** Make the canary BE the eval-set positive rather than a hand-typed twin:
```js
const CANARY = all.find((q) =>
  q.should_trigger && q.query.startsWith("what does Extract Function actually do"),
);

if (!CANARY) {
  throw new Error("canary positive missing from trigger-eval.json");
}
```
This keeps the exclusion filter and the canary in lockstep and prevents future drift.

#### WR-02: chunk-set write is outside the try/catch and CHUNK_DIR is never created -> uncaught ENOENT crash defeats the documented "resume next invocation"

**File:** `.claude/skills/lz-refactor-workspace/run-recall-chunks.mjs:78-79`

**Issue:**
```js
const setPath = `${CHUNK_DIR}/recall-chunk-${i + 1}.json`;
fs.writeFileSync(setPath, JSON.stringify([...chunks[i], CANARY], null, 2)); // outside try
```
`CHUNK_DIR` (`evals/d07-chunks`) is assumed to pre-exist; the runner never `mkdir`s it,
and this write is BEFORE the `try` block at line 82. On a checkout where `d07-chunks` is
absent (fresh clone that has not yet run the sibling spec runner, or after a cleanup),
`writeFileSync` throws an uncaught `ENOENT` and terminates the whole script with a stack
trace -- not the graceful "will resume next invocation" the catch at line 91-94
advertises. The directory only happens to exist today because tracked chunk files live
in it; that is incidental, not guaranteed. `extract-samples.mjs:101` already does the
right thing (`fs.mkdirSync(SAMPLES, { recursive: true })`).

**Fix:** Ensure the directory once, up front:
```js
fs.mkdirSync(CHUNK_DIR, { recursive: true });
```
(place it near the top, after `CHUNK_DIR` is defined).

#### WR-03: `assess()` and the report loop dereference `r.results` unguarded -> a valid-JSON-but-wrong-shape result file throws an uncaught TypeError

**File:** `.claude/skills/lz-refactor-workspace/run-recall-chunks.mjs:41-52` and `:133-135`

**Issue:**
`assess()` wraps only `readFileSync`/`JSON.parse` in try/catch (returns
`{valid:false, reason:"unparseable"}` on parse error), then immediately does
`r.results.find(...)` (line 49) and `r.results.filter(...)` (line 52). The combined
report re-reads and does `r.results.find(...)` at line 135. If a result file is valid
JSON but lacks a `.results` array -- e.g. run_eval emits an error object, or a partial
`{}` is written -- `r.results` is `undefined` and `.find` throws
`TypeError: Cannot read properties of undefined`. That throw is NOT inside the try, so
it crashes the entire resumable runner (in both the run loop via line 89 and the report
loop via line 135), which contradicts the file's whole reason for existing (resilient,
idempotent resume across throttled windows).

**Fix:** Guard the shape inside the same try, and treat a missing array as invalid:
```js
try {
  r = JSON.parse(fs.readFileSync(p, "utf8"));
} catch {
  return { valid: false, reason: "unparseable" };
}

if (!r || !Array.isArray(r.results)) {
  return { valid: false, reason: "no results array" };
}
```
Apply the same `Array.isArray(r.results)` guard before the line-135 dereference.

### Info

#### IN-01: recall denominator hardcodes +1 for the canary even when no chunk was valid, producing a misleading "all 10 positives" figure

**File:** `.claude/skills/lz-refactor-workspace/run-recall-chunks.mjs:144-149`

**Issue:**
`const totalTested = tested + 1;` always folds the canary into the denominator. When
every chunk is throttled/invalid, `tested === 0` and `canaryRuns === 0`, so the final
line prints `RECALL (canary-validated, all 10 positives): 0/1 = 0%` -- a denominator of
1 and a "10 positives" label for a run in which nothing was actually measured. This
can be misread as "1 of 10 measured" rather than "no valid data."

**Fix:** Only count the canary in the denominator when it actually ran, and make the
label reflect measured coverage:
```js
const canaryTested = canaryRuns > 0 ? 1 : 0;
const totalTested = tested + canaryTested;
```
and guard the percentage line against `totalTested === 0`.

#### IN-02: writing grading.preliminary.json does not clear a pre-existing grading.json in the same out dir (fail-closed gap)

**File:** `.claude/skills/lz-refactor-workspace/grade-run.mjs:400-403, 569-576`

**Issue:**
When judge items remain, `finalOutPath()` redirects output to
`grading.preliminary.json` (correctly refusing to emit a final-looking `grading.json`).
But if a stale `grading.json` from a prior grading of the same run dir already exists,
this run writes the preliminary file alongside it and leaves the stale final in place.
The header (lines 38-41) relies on `aggregate_benchmark.py` skipping run dirs that have
unmerged judge items; a leftover `grading.json` could be counted as a completed
scored-only summary, which is the exact false pass the preliminary mechanism is meant
to prevent. Low likelihood in practice (runs typically target a fresh out dir), hence
INFO, but the fail-closed guarantee is only as strong as the dir being clean.

**Fix:** When emitting the preliminary path, remove any stale final in the same dir:
```js
if (result.judge_required.length > 0) {
  const stale = path.join(path.dirname(args.out), path.basename(args.out));

  if (fs.existsSync(stale)) {
    fs.rmSync(stale);
  }
}
```
(or document that callers must grade into a fresh directory).

---

_Reviewed: 2026-07-10T06:52:06Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: deep_
