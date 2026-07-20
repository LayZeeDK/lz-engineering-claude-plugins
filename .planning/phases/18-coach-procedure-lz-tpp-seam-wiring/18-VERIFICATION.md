---
phase: 18-coach-procedure-lz-tpp-seam-wiring
verified: 2026-07-20T19:17:02Z
status: passed
score: 11/11 must-haves verified (4 ROADMAP success criteria + 5 phase requirements + VIT-02 co-owned clause + 1 co-edit/regression-floor truth)
behavior_unverified: 0
overrides_applied: 0
re_verification: null
---

# Phase 18: Coach Procedure & lz-tpp Seam Wiring Verification Report

**Phase Goal:** The inline RED decision procedure ties the references together on the Three Laws spine, routes the stance, fails for the right reason, and wires the lz-red <-> lz-tpp seam (closing the carried reverse-pointer tech-debt).
**Verified:** 2026-07-20
**Status:** passed
**Re-verification:** No -- initial verification

## Goal Achievement

The phase goal is achieved. Direct reading of the shipped `lz-red/SKILL.md` confirms a real, numbered,
6-step inline coach decision procedure on the Three Laws spine that classifies first, routes the
testing stance with a stated route and a natural-language override, confirms fail-for-the-right-reason
before the forward handoff, and closes with a coach-not-drive paragraph. The shipped `lz-tpp/SKILL.md`
carries a new, purely additive section naming both `lz-red` and `lz-refactor` as reverse pointers,
closing the carried tech-debt. All five co-edited/owned reference leaves are filled, byte-stable on
their retained (Phase 16/17) content, and free of stale deferral markers. The full deterministic
battery (content-completeness checker, tsc --strict extractor, hygiene/no-verbatim scan, provenance-
honesty self-test, `claude plugin validate .`) was independently re-run by this verifier and is GREEN.

### Observable Truths -- ROADMAP Success Criteria

| # | Success Criterion | Status | Evidence |
| --- | --- | --- | --- |
| 1 | `SKILL.md` carries a numbered coach procedure on the Three Laws spine (Law 1 gates entry, Law 2 sizes the test, Law 3 = lz-tpp handoff) that classifies RED vs GREEN vs REFACTOR first | VERIFIED | `lz-red/SKILL.md` "## Coach decision procedure": step 1 classifies against the lz-tpp/lz-refactor seams before any test; step 2 states Law 1 (gate entry) and Law 2 (size the test -- a not-yet-defined symbol counts) and points at Law 3 as step 6; step 6 frames Law 3 as the lz-tpp handoff. Links `references/three-laws-and-test-selection.md` file-level without restating it. |
| 2 | The routing step detects/matches the house test idiom always, routes by structural control/seam availability, states the route + why, and honors an optional natural-language override (no CLI flag) | VERIFIED | `lz-red/SKILL.md` step 3: "Detect the house test idiom, then route the stance ... through the route table in references/testing-stance/README.md ... State the route you took and why." Override: "If the developer states a stance preference in plain language ... honor that override over the auto-route and still state the route chosen. The override is natural language; there is no flag." |
| 3 | A fail-for-the-right-reason step (watch the red bar; AssertionError on the asserted behavior, not compile/setup error or false green; F.I.R.S.T. baseline) precedes the forward lz-red -> lz-tpp handoff; the coach questions rather than drives | VERIFIED | `lz-red/SKILL.md` step 5 (precedes step 6): "must fail on its assertion -- an AssertionError ... not on a compile, import, or setup error ... must not pass immediately (a false green); F.I.R.S.T. is the quality baseline. Explain which failure is the right one and why; do not run the suite unprompted." Closing paragraph: distinguishes QUESTION (present + let developer write, no edit/no run) from COMMAND (write the test, then stop -- do not drive to green). |
| 4 | A reverse `lz-tpp -> lz-red` pointer (plus the deferred `lz-tpp -> lz-refactor` pointer, same edit) is added to the shipped lz-tpp `SKILL.md` | VERIFIED | `lz-tpp/SKILL.md` gained "## The green step vs the red step (lz-red) and the refactor step (lz-refactor)" (git show 51f76c2: +10 lines, 0 deletions, purely additive). Names both `lz-red` (red step) and `lz-refactor` (refactor step) as pointers, mirrors the sibling "vs the green step" sections lz-red/lz-refactor already carry, no restatement. |

**Score:** 4/4 ROADMAP success criteria verified (0 present-behavior-unverified)

### Observable Truths -- Phase Requirements

| Req | Truth | Status | Evidence |
| --- | --- | --- | --- |
| LAW-01 | Three Laws framed as the RED spine (Law 1 gate entry, Law 2 size the test, Law 3 = lz-tpp handoff) | VERIFIED | `three-laws-and-test-selection.md` "## The Three Laws spine and classify-first" owns the distilled prose (Law 1/2 tagged "Robert C. Martin, owned; oracle-verified"; Law 3 tagged "lz-red orchestration, no-oracle"); `SKILL.md` step 2 carries only the compact spine and links the leaf. Oracle-reviewer gate (18-06-SUMMARY) confirmed the owned tier against Clean Code Ch. 9 with no downgrade (confidence 93); D-05 honesty-gate self-test 3/3 and the in-battery honesty gate both PASS (independently re-run). |
| LAW-02 | Fail-for-the-right-reason guidance; F.I.R.S.T. as the test-quality baseline | VERIFIED | `vitest-typescript-mechanics.md` "## Fail-for-the-right-reason as a procedure" (AssertionError vs broken harness vs false green); `test-structure-and-assertions.md` "## F.I.R.S.T. as a red-step baseline" (points at, does not restate, the existing owned F.I.R.S.T. block); `SKILL.md` step 5 ties both together. |
| RTR-02 | Coach routing step -- detect house idiom always, route by structural control/seam availability, state route + why, optional natural-language override (no CLI flag) | VERIFIED | `SKILL.md` step 3 (see SC2 row above); wires into `testing-stance/README.md` (Phase-17-complete route table, unmodified navigation index). |
| SEAM-01 | Classify-first (RED/GREEN/REFACTOR) + forward `lz-red -> lz-tpp` handoff (Law 1/2 -> Law 3) in the procedure | VERIFIED | `SKILL.md` step 1 (classify) + step 6 (forward handoff, Law 3); `three-laws-and-test-selection.md` "Classify first" paragraph is consistent with (not a restatement contradicting) the SKILL.md framing. |
| SEAM-02 | Reverse `lz-tpp -> lz-red` pointer added to the shipped lz-tpp skill; subagent-reviewed before acceptance | VERIFIED | `lz-tpp/SKILL.md` new section (git show 51f76c2). Checker's SEAM-02 block (`lz-tpp/SKILL.md: SEAM-02 reverse pointers`) independently re-run: PASS. Subagent review recorded in 18-06-SUMMARY (>= 1 unbiased from-scratch review, PASS: own-words, pointer-only, no sibling content restated, purely additive). |
| VIT-02 (SKILL.md clause, co-owned this phase) | TypeScript + Vitest examples throughout SKILL.md, tsc --strict-clean | VERIFIED | `SKILL.md` carries one worked `applyDiscount` Vitest example (compiling stub returning the wrong value -> runtime AssertionError, not a missing symbol, not a `ts ignore` fence). Independently re-ran `npm --prefix .claude/skills/lz-red-workspace run typecheck`: exit 0, 8 modules including `SKILL-1.ts`, 0 fences skipped. A gap-closure fix (worked-example step-number mislabel, commit `d4191c3`) was independently confirmed as a correctly scoped 2-line prose fix, re-verified GREEN after. |

**Score:** 6/6 requirement-level truths verified (5 Phase-18-owned + 1 co-owned VIT-02 clause)

### Co-edit / Regression-floor Truth

| # | Truth | Status | Evidence |
| --- | --- | --- | --- |
| 1 | Only the Phase-18 slices are filled; Phase-16/17 content (SEL/STR/ASRT/NAME/RTR-01/RTR-03/VIT/ANTI) stays byte-stable; no stale `/Phase 18/i` deferral marker survives anywhere in the shipped lz-red tree | VERIFIED | Diff inspection (`git diff cb14638^ cb14638` etc.) confirms each co-edited file's diff is scoped to its named insertion-point section plus the head blockquote; the SEL slice and all Phase-16/17 rows are untouched. Full file list touched across the phase (`git diff --name-only dee8f2b^ d4191c3`) contains no unexpected files (no `plugin.json`, README, or CHANGELOG -- correctly deferred to Phase 19). Checker `absent` guards (all 4 co-edited files + SKILL.md) independently re-run: PASS. |

**Overall score: 11/11 truths verified.**

### Required Artifacts

| Artifact | Expected | Status | Details |
| --- | --- | --- | --- |
| `plugins/lz-tdd/skills/lz-red/SKILL.md` | Inline 6-step coach procedure + VIT-02 worked example, under ~200 lines | VERIFIED | 147 lines (well under 500-line cap, near lz-refactor's 181/lz-tpp's precedent grain). All 6 steps present, file-level links only, no leaf content restated. |
| `plugins/lz-tdd/skills/lz-red/references/three-laws-and-test-selection.md` | Owned Three Laws spine + classify-first, SEL slice intact | VERIFIED | Filled, marker gone, SEL slice byte-stable per diff inspection. |
| `plugins/lz-tdd/skills/lz-red/references/principle-backing.md` | LAW-01/02 (owned) + SEAM-01/02 (no-oracle) backing rows | VERIFIED | Rows present in exact 3-column pipe shape; canonical tier strings used verbatim; D-05 honesty gate holds. |
| `plugins/lz-tdd/skills/lz-red/references/test-structure-and-assertions.md` | F.I.R.S.T.-as-red-step-baseline section, STR/ASRT slice intact | VERIFIED | Filled, marker gone, points at (does not restate) the existing F.I.R.S.T. block. |
| `plugins/lz-tdd/skills/lz-red/references/vitest-typescript-mechanics.md` | Fail-for-the-right-reason procedure section, VIT slice intact | VERIFIED | Filled, marker gone, ties the existing Read-the-red-bar mechanic to the LAW-02 step. |
| `plugins/lz-tdd/skills/lz-tpp/SKILL.md` | Reverse-pointer section naming lz-red + lz-refactor | VERIFIED | Additive section present (+10 lines, 0 deletions); grew from 81 to 91 lines. |
| `.claude/skills/lz-red-workspace/tools/check-red-references.mjs` | Extended instrument: absent guard, SKILL.md dir-override entry, non-ignore fence guard, SEAM-02 block | VERIFIED | Read in full; implementation matches the plan's design exactly (per-entry `dir`, `absent` inverse-of-`deferral` branch, `NON_IGNORE_TS_FENCE_RE`, post-loop SEAM-02 block reading lz-tpp/SKILL.md). |
| `.claude/skills/lz-red-workspace/extract-samples.mjs` | SKILL.md fence added to the tsc-extractor walk | VERIFIED | `SKILL-1.ts` confirmed among 8 compiled modules in the independently re-run typecheck. |

### Key Link Verification

| From | To | Via | Status | Details |
| --- | --- | --- | --- | --- |
| `SKILL.md` step 2 | `references/three-laws-and-test-selection.md` | Markdown link | WIRED | Link present; target file filled with the owned spine. |
| `SKILL.md` step 3 | `references/testing-stance/README.md` | Markdown link | WIRED | Link present; target route table unmodified (Phase-17-complete). |
| `SKILL.md` step 4 | `references/test-structure-and-assertions.md` | Markdown link | WIRED | Link present. |
| `SKILL.md` step 5 | `references/vitest-typescript-mechanics.md` + `references/test-structure-and-assertions.md` | Markdown links | WIRED | Both links present. |
| `SKILL.md` step 6 | lz-tpp (forward handoff) | prose pointer (no link needed, sibling skill) | WIRED | "lz-tpp" named; matches SEAM-01 forward-handoff framing. |
| `lz-tpp/SKILL.md` reverse section | `lz-red`, `lz-refactor` | prose pointer | WIRED | Both names present; checker SEAM-02 block confirms (re-run: PASS). |
| `three-laws-and-test-selection.md` | `principle-backing.md` LAW rows | tier-consistency | WIRED | Both tag Law 1/2 "Owned; oracle-verified against the clean-room source" identically. |

### Behavioral Spot-Checks / Deterministic Battery (independently re-run by this verifier)

| Check | Command | Result | Status |
| --- | --- | --- | --- |
| Content-completeness checker | `node .claude/skills/lz-red-workspace/tools/check-red-references.mjs` | exit 0 -- "RED-REFS GREEN -- 11/11 lz-red surfaces authored", every topic/fence/cross-link/absent-marker/SEAM-02/D-05-honesty-gate check PASS | PASS |
| tsc --strict extractor | `npm --prefix .claude/skills/lz-red-workspace run typecheck` | exit 0 -- 8 modules extracted (incl. SKILL-1.ts), 0 fences skipped | PASS |
| Hygiene (ASCII/work-email/no-verbatim) | `node .claude/skills/lz-refactor-workspace/tools/check-hygiene.mjs` | exit 0 -- 198 files ASCII-clean, no non-allowlisted emails, 191 files no-verbatim clean | PASS |
| Provenance-honesty self-test | `node .claude/skills/lz-red-workspace/tools/provenance-honesty.selftest.mjs` | 3/3 assertions pass | PASS |
| First-party plugin validation | `claude plugin validate .` | exit 0 -- "Validation passed" | PASS |

### Orchestrator-gated Qualitative Reviews (recorded in 18-06-SUMMARY.md, not re-run by this verifier)

Three gates in this phase require a fresh-context subagent (gsd-executor cannot spawn one): the
oracle-reviewer on the owned Three-Laws surface (D-05/D-12, main context must never read `.oracle/`
prose so this verifier does not either), the >= 1 unbiased review of the shipped lz-tpp edit (D-10),
and the >= 1 unbiased skill-review of the lz-red coach procedure. All three are recorded PASS in
18-06-SUMMARY.md with specific, checkable findings rather than a rubber-stamp one-liner:

- The oracle-reviewer's confidence-93 PASS is corroborated by this verifier's own re-run of the
  deterministic D-05 honesty gate (principle-backing.md's Owned rows all correctly avoid citing the
  no-oracle book) and the no-verbatim hygiene scan (both GREEN).
- The skill-reviewer's one actionable finding (a wrong step-number cross-reference in the worked-
  example prose) produced a concrete, independently checkable gap-closure commit (`d4191c3`), which
  this verifier confirmed via `git show` is exactly the scoped 2-line fix described (no other content
  changed), re-verified GREEN.

These reviews are accepted as evidence rather than re-run, consistent with the clean-room constraint
(this verifier must not open `.oracle/` prose) and with the concrete, falsifiable trace (the gap-
closure commit) that corroborates a genuine review occurred.

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
| --- | --- | --- | --- | --- |
| LAW-01 | 18-02, 18-05 | Three Laws framed as the RED spine | SATISFIED | three-laws-and-test-selection.md + SKILL.md step 2 |
| LAW-02 | 18-03, 18-05 | Fail-for-the-right-reason + F.I.R.S.T. baseline | SATISFIED | vitest-typescript-mechanics.md + test-structure-and-assertions.md + SKILL.md step 5 |
| RTR-02 | 18-05 | Coach routing step + natural-language override | SATISFIED | SKILL.md step 3 |
| VIT-02 (SKILL.md clause) | 18-05 | tsc-strict Vitest worked example in SKILL.md | SATISFIED | SKILL.md worked example (SKILL-1.ts) |
| SEAM-01 | 18-02, 18-05 | Classify-first + forward lz-tpp handoff | SATISFIED | SKILL.md steps 1 + 6; three-laws-and-test-selection.md classify-first paragraph |
| SEAM-02 | 18-01, 18-04 | Reverse lz-tpp -> lz-red pointer, subagent-reviewed | SATISFIED | lz-tpp/SKILL.md new section; SEAM-02 checker block; orchestrator review recorded |

No orphaned requirements: all six Phase-18-mapped IDs (LAW-01, LAW-02, RTR-02, SEAM-01, SEAM-02, and
the VIT-02 SKILL.md clause) appear in a plan's `requirements` field and are delivered.

**Traceability note (not a phase-18 gap):** `.planning/REQUIREMENTS.md`'s checkbox list and its
per-requirement status table still show LAW-01, LAW-02, RTR-02, SEAM-01, SEAM-02 as unchecked/
"Pending", and VIT-02's traceability row still points at "Phase 17". This matches the established
project pattern: requirement-checkbox reconciliation in REQUIREMENTS.md happens as a separate,
subsequent commit after gsd-verifier's own pass (confirmed by inspecting Phase 17's history: the
checkbox-flip commit `11a70b2` landed AFTER the 17-VERIFICATION.md commit `c036d10`, as its own
"reconcile ... across planning docs" commit). The task brief for this verification explicitly flags
the VIT-02/Phase-17 row as "a known-stale traceability row to reconcile at phase closure, not a
phase-18 gap" -- the same reconciliation step should also flip LAW-01, LAW-02, RTR-02, SEAM-01,
SEAM-02 to `[x]` / "Complete" and update their Phase-18 status-table rows. This is a follow-up
documentation-reconciliation action, not a gap in the phase's delivered content.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
| --- | --- | --- | --- | --- |
| `plugins/lz-tdd/skills/lz-red/SKILL.md` | 113 | "Not yet implemented" | Info | Benign -- an intentional inline comment on the RED worked-example's production stub (the whole point of the example is that it is not yet implemented); not a stub in the deliverable itself. |
| `plugins/lz-tdd/skills/lz-red/references/vitest-typescript-mechanics.md` | 27 | "placeholders" | Info | Benign -- "printf-style placeholders" describes Vitest `test.each` title syntax (same false-positive noted and accepted in the 17-VERIFICATION.md report), not a stub. |

No debt markers (TBD/FIXME/XXX) in any modified file. No empty implementations, no "coming soon" leaks.
No stray `plugins/lz-tdd` file touched outside the six content files + the two dev-only instrument
files (confirmed via `git diff --name-only` across the full phase commit range) -- Phase 19's DST-01/
02/03 scope (plugin.json bump, README, CHANGELOG) was correctly not pulled forward.

### Human Verification Required

None. The three qualitative reviews that would otherwise require human judgment (own-words fidelity of
the owned Three-Laws surface against Clean Code Ch. 9; verbatim-safety and pointer-only fidelity of the
scan-excluded lz-tpp edit; coach-don't-drive / no-restatement quality of the lz-red coach procedure)
were each already closed by a dedicated orchestrator-driven subagent gate this pass (recorded in
18-06-SUMMARY.md), with one gap-closure fix independently confirmed via git history. All Phase-18
truths are Markdown documentation content verifiable by direct file read + deterministic gates; none
assert a runtime state transition or a cancellation/cleanup/ordering invariant, so there are no
present-behavior-unverified items.

### Gaps Summary

No gaps. The inline RED decision procedure ties the Phase-16/17/18 references together on the Three
Laws spine, routes the stance with a stated route and a natural-language override, fails for the right
reason ahead of the forward handoff, and the lz-red <-> lz-tpp seam is fully wired in both directions
(the carried reverse-pointer tech-debt is closed). The co-edit boundary is respected: only the
Phase-18 slices were filled, the Phase-16/17 regression floor is byte-stable, and every deterministic
gate (re-run independently by this verifier) is GREEN. The one open item -- REQUIREMENTS.md checkbox/
traceability-table reconciliation -- is a documentation follow-up consistent with this project's
established pattern (confirmed against Phase 17's own history) and is not a gap in Phase 18's
delivered content.

---

_Verified: 2026-07-20_
_Verifier: Claude (gsd-verifier)_
