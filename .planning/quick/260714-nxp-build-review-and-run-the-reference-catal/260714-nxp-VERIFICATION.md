---
phase: quick-260714-nxp
verified: 2026-07-14T00:00:00Z
status: passed
score: 6/6 must-haves verified
overrides_applied: 0
---

# Quick 260714-nxp: Build, review, and run the reference-catalog eval -- Verification Report

**Task Goal:** Build, unbiased-review, gate-approve, run, and grade a REFERENCE-CATALOG eval for the
lz-refactor skill; measure the per-fact recall DELTA (invoke_skill - no_skill) on book-independent facts.
**Verified:** 2026-07-14
**Status:** passed
**Re-verification:** No -- initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Instrument grades ONLY book-independent facts (real membership/renames/provenance), NOT the skill's invented To-vs-Towards semantics / n:1 groupings / n/a sentinel | VERIFIED | `targets.json` grade tokens are all real pattern names / rename names / provenance (Visitor+Iterator, Introduce Special Case, Change Function Declaration, Slide Statements, Kerievsky, web-only, no Extract Interface). NO direction word (away/toward/de-pattern/dismantle/retreat) appears as a required/forbidden token; the `--selfcheck` DIRWORDS guard (grade-reference.mjs:548-569) scans the shipped targets.json and passes. Echo-tainted q3/q5 carry `excluded_from_clean_core` and are omitted from the run. |
| 2 | Metric is per-fact DELTA = invoke_skill_rate - no_skill_rate, SAME rubric both arms; positive delta on non-saturated facts is the only value signal | VERIFIED | `grade-reference.mjs:248` computes `delta = rates.invoke_skill - rates.no_skill`; the same `gradeOne()` is applied to every answer of both arms in `walkResults`. Re-running `--aggregate` reproduces the committed `aggregate.json` BYTE-IDENTICAL from the on-disk answer.md files (data-flow trace confirmed, not hand-edited). |
| 3 | Metered run cannot start until (a) instrument built AND (b) unbiased review PASS AND (c) explicit spend approval | VERIFIED | Commit timeline: build `f08ca62` @18:08 -> review-fix w/ GATE:PASS `714767e` @19:40 -> run answer.md written @19:43 (after both). `REVIEW.md` top line "GATE: PASS" with neutral + adversarial verdicts. Run scope = clean-core (10 prompts x 2 arms x k=3 = 60), exactly the review-recommended clean core, matching SUMMARY's "user approved clean-core". (The user's explicit approval is a human checkpoint; the run-scope match + ordering is strong corroboration.) |
| 4 | Grader deterministic (mustName all/anyOf + mustNotClaim, word-bounded), --selfcheck exits 0, no LLM judge on any core fact | VERIFIED | `grade-reference.mjs --selfcheck` prints "SELFCHECK OK", exit 0. Matching is pure regex (`nameRe` word-bounded, clause-scoped bidirectional negation). No network/LLM call anywhere in the file. |
| 5 | 2 saturation controls run on all arms, reported separately, to separate a real delta from a verbosity artifact | VERIFIED | qc1/qc2 present in suite.json (code:false), 6 answer.md each (2 arms x k=3), `aggregate.json` reports them under `control:true`; `printTable` prints a separate controls section; verbosity guard reports per-arm median_answer_chars (no_skill 1256 vs invoke_skill 1548.5). |
| 6 | Eval cwd contains NO catalog copy (no_skill cannot read answers off disk); catalog reaches skill arms only via --plugin-dir | VERIFIED | suite.json `repo` = external `D:/projects/github/emilybache/GildedRose-Refactoring-Kata/TypeScript` (exists; contains only kata source, no fowler/kerievsky catalog -- marker search returns empty). Recommend mode hard-blocks writes; runner injects catalog via `--plugin-dir` per run-e2e.mjs. |

**Score:** 6/6 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `e2e-reference/suite.json` | 12 code:false prompts, recommend-only, catalog-free cwd | VERIFIED | 12 prompts, every `"code": false`; repo = external kata dir. (Plan said 14; review dropped q2 saturated + q4 SKILL.md-echo -- documented, fairness-improving deviation.) |
| `e2e-reference/targets.json` | per-question mustName all/anyOf + mustNotClaim, independent/control flags | VERIFIED | 12 entries; membership-only tokens; no direction words; q3/q5 flagged excluded_from_clean_core. |
| `e2e-reference/prompts/` | neutral-phrasing question files, ASCII, no answer leak | VERIFIED | 12 files; sampled q1/q7/q10/q12 are neutral (name the subject, never the graded discriminator); ASCII scan clean. |
| `grade-reference.mjs` | deterministic grader + --aggregate (delta + Pass@k) + --selfcheck | VERIFIED | selfcheck exits 0; comb/passAtK/passHatK + nameRe COPIED (no import of run-e2e/grade-run); grade-run.mjs untouched (git log confirms). |
| `e2e-reference/REFERENCE-RESULTS.md` | honest per-fact delta verdict + controls + class verdict + caveat | VERIFIED | Per-question table, controls separate, verbosity guard, NULL-with-one-niche-edge class verdict, actionability caveat, q10 grader limitation disclosed. |
| `aggregate.json` | per-question per-arm rates + deltas | VERIFIED | Present; reproduces byte-identical from answers; 1/8 positive, mean_delta 0.125. |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|----|--------|---------|
| run-e2e.mjs | e2e-reference suite | `--suite` (reuse, no fork) | WIRED | 60 answer.md produced under e2e-reference/results/recommend/<arm>/<qid>/run-<k>; runner not forked. |
| grade-reference.mjs | targets.json | loadTargets() reads targets.json | WIRED | grade-reference.mjs:284. |
| grade-reference.mjs | results tree | --aggregate walks answer.md | WIRED | walkResults() at :289; aggregate reproduces from disk. |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|--------------------|--------|
| aggregate.json | per-arm correct rates + delta | 60 real answer.md graded by gradeOne | Yes -- re-run reproduces byte-identical | FLOWING |
| q1 +1.00 delta | Iterator token per arm | no_skill run-1 says "Visitor -- and only Visitor ... confident it relates to Visitor alone" (wrong); invoke_skill names Visitor AND Iterator | Yes -- edge is a genuine correct-vs-wrong difference, not verbosity | FLOWING |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Grader selfcheck | `node grade-reference.mjs --selfcheck` | SELFCHECK OK, exit 0 | PASS |
| Aggregate reproducibility | `node grade-reference.mjs --aggregate` + diff | byte-identical to committed aggregate.json | PASS |
| Result count | count answer.md under results | 60 (10 prompts x 2 arms x 3) | PASS |
| q1 edge is real | rg iterator in q1 answers per arm | invoke_skill names Iterator; no_skill omits it | PASS |
| ASCII compliance | non-ASCII scan on authored files | 0 hits | PASS |
| Email hygiene | email-token allowlist-inversion scan | 0 email tokens in authored files | PASS |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| REF-EVAL | 260714-nxp-PLAN | Reference-catalog eval BUILT, REVIEWED, RUN (gated), GRADED with book-independent per-fact deltas | SATISFIED | All 6 truths + 6 artifacts verified above. |

### Anti-Patterns Found

None blocking. The q10 grader anyOf under-match ("does not contain a refactoring named X") is a KNOWN,
DOCUMENTED limitation disclosed in both REFERENCE-RESULTS.md and SUMMARY; it false-fails BOTH arms
symmetrically (0.00/0.00) so the delta (+0.00) is correct -- verdict-neutral, explicitly left as-is with
rationale. Treated as disclosed, not a gap.

### Human Verification Required

None. The build/review/run/grade pipeline and its outcome are fully machine-verified. The only
human-in-the-loop element (explicit spend approval) already occurred before the run (commit + mtime
ordering corroborates), and the outcome is a measured data finding, not a UI/UX behavior needing UAT.

### Gaps Summary

No gaps. The reference-catalog eval was built (12-prompt suite + deterministic selfcheck-green grader),
passed an unbiased neutral+adversarial review (GATE: PASS, with q2/q4 dropped and q3/q5 excluded to
enforce the fairness rule), run only after the review passed and spend was approved (60 metered runs,
2 arms, k=3), and graded into a reproducible aggregate.json + honest REFERENCE-RESULTS.md verdict
(reference lever essentially NULL: 1/8 positive, mean delta +0.13; the single q1 edge verified real).
The fairness rule holds -- only book-independent facts are graded, no direction word is a graded token
(selfcheck-enforced), and the cwd is catalog-free so the no_skill arm cannot read answers off disk.

---

_Verified: 2026-07-14_
_Verifier: Claude (gsd-verifier)_
