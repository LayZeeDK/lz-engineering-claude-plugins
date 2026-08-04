---
phase: 22
slug: three-way-classifier-correctness-lz-refactor-lz-red
status: verified
nyquist_compliant: true
wave_0_complete: true
created: 2026-08-03
validated: 2026-08-04
---

# Phase 22 -- Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> Derived from `22-RESEARCH.md` section `## Validation Architecture`.

**Audited retroactively 2026-08-04, adversarial gap-fill pass** (fresh review of the shipped
instrument against this file's own plan-time claims; the orchestrator did not reach this verdict
inline). Phase 22 was already VERIFIED passed 8/8 (`22-VERIFICATION.md`, re-verification after
22-08) and SECURE (`threats_open: 0`) before this pass ran.

This pass targeted the ONE coverage question the phase's own history flags as load-bearing:
`check-rgr-routing.mjs` was GREEN throughout while a real BLOCKER sat in `lz-refactor/SKILL.md`'s
intro paragraph, because every `ROUTING_SURFACES` entry anchors to a `## ` heading and prose above
the first heading was outside all eleven parsed surfaces. **That gap was REAL** -- confirmed by
direct code read (the import list in `check-rgr-routing.mjs` never touched intro text; no
`ROUTING_SURFACES` entry has a heading covering the H1-to-first-`##` region) and by
`22-08-SUMMARY.md`'s own words: *"the gate is structurally blind to all of them; it is a floor,
never evidence the fixes landed correctly."* A second, narrower gap was equally real: `description`
CONTENT (not just its 1,536-char length) was never checked by any wired assertion --
`keysOnTestState`/`foldedDescription` were exported and used together only via a throwaway scratch
script during plan 22-08 (its own task instruction: *"Write a throwaway script OUTSIDE the
repo... never a tracked path"*), never inside a committed checker.

**Both gaps are CLOSED by this pass.** Two additive checks were built directly into
`check-rgr-routing.mjs`, proven GREEN against the real shipped tree, and mutation-proven in BOTH
directions in `check-rgr-routing.selftest.mjs` (new mutation 9, 15 assertions). No existing
assertion was weakened, retuned, or gated to reach this result. The full battery was GREEN before
this pass and stays GREEN after it. Zero metered spend. See "Coverage gap found and closed at
audit" below for the full account, and "Coverage boundary" for what remains explicitly open by
design (model routing correctness, CLS-05).

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Node-builtins checker battery per workspace (`npm run check`) plus per-script `--selfcheck` modes plus orchestrator-run subagent reviews. No test runner, no framework, no config file (CONVENTIONS.md) |
| **Config file** | `.claude/skills/lz-red-workspace/package.json` and `.claude/skills/lz-refactor-workspace/package.json` (`scripts.check`) |
| **Quick run command** | `node .claude/skills/lz-red-workspace/tools/check-rgr-routing.mjs` (the gate alone, < 2s; now includes the intro-prose and description-single-axis checks) |
| **Full suite command** | `npm --prefix .claude/skills/lz-red-workspace run check && npm --prefix .claude/skills/lz-refactor-workspace run check && claude plugin validate .` |
| **Estimated runtime** | quick < 2s; full battery can exceed 600s (it grew to 3152 lines during Phase 21 -- the plan-time "< 60s" claim was corrected as false and must not be reintroduced) |

**Post-execution measured state (this audit, HEAD after the additive edits below):** lz-red
workspace `npm run check` exit 0; `check-rgr-routing.mjs` exit 0, `SUMMARY: RGR-ROUTING GREEN`
over 11 surfaces, 9 corpus cases, PLUS the two new label groups (`[cls-03] intro prose`,
`[cls-03] description single-axis`) all PASS; `check-rgr-routing.selftest.mjs` exit 0, mutations
0-9 all PASS (9 new); lz-refactor workspace `npm run check` exit 0; `claude plugin validate .` and
`--strict` both exit 0; `check-evals.mjs`, `extract-samples.mjs`, `build-variants.mjs`,
`selfcheck-routing.mjs` (6/6 cruxes, frontmatter hashes unchanged from 22-08) all exit 0.

---

## Sampling Rate

- **After every task commit:** `node .claude/skills/lz-red-workspace/tools/check-rgr-routing.mjs`
  plus that task's own `--selfcheck` (each < ~5s).
- **After every plan wave:** both workspace batteries plus `claude plugin validate .`
  (`npm --prefix ... run check` twice, exit 0 each).
- **Phase gate:** full battery GREEN, `validate .` exit 0, every `--selfcheck` GREEN, the widened
  hygiene scope proven non-vacuous by its file count, the ORCHESTRATOR's unprimed acceptance review,
  and BOTH metered rounds presented and HALTED.
- **Max feedback latency:** quick gate < 2s. The full battery is NOT latency-bounded -- do not
  re-assert a numeric ceiling for it.

---

## Per-Task Verification Map -- POST-EXECUTION

Automated rows only, with true post-execution status. Rows resolved only by human/orchestrator
judgment live in Manual-Only below.

| Req | Behavior | Test type | Automated command / label | Status |
|-----|----------|-----------|---------------------------|--------|
| CLS-01 | Every corpus case has exactly one named owner; no bare catch-all terminal on any in-scope classifier surface | unit (parsed table) | `check-rgr-routing.mjs` -> `[cls-01] exhaustive` (9/9) + `[cls-01] no bare catch-all terminal` (8/8 router surfaces) | green |
| CLS-01 | The guard fails when a catch-all returns, a positive branch is deleted, a heading is renamed, or the target file vanishes; and does NOT fail on an incidental mention or a reworded-but-correct branch | unit (mutation, both directions) | `check-rgr-routing.selftest.mjs` -- mutations 1, 2, 4, 5, 6, 7, 8 | green |
| CLS-02 | No corpus case is claimed by two of the step-1 procedures | unit (parsed table) | `check-rgr-routing.mjs` -> `[cls-02] at-most-one` (9/9) | green |
| CLS-02 | Test-code ownership follows the ask (the two test-code corpus cases route to different owners) | unit (corpus) | same checker; c3 -> `red-step1`, c5 -> `refactor-step1` | green |
| CLS-03 | Zero routing or mode-selection branches key on test state, across all in-scope surfaces | unit (parsed table) | `check-rgr-routing.mjs` -> `[cls-03] single-axis` (11/11 surfaces), with positive AND negative control in the selftest (mutation 3) | green |
| CLS-03 | `lz-refactor/SKILL.md` step 6's sweep rule cites a rule step 1 actually contains | unit (region-scoped) | same checker -> `[cls-03] sweep-rule citation resolves` | green |
| CLS-03 (widened this pass) | Intro prose (the text between the H1 and the first `## ` heading, outside all eleven ROUTING_SURFACES) does not key on test state, and lz-refactor's intro states D-02's two-hop rule in order | unit (new, additive) | `check-rgr-routing.mjs` -> `[cls-03] intro single-axis` (3 skills) + `[cls-03] intro two-hop rule`; mutation-proven both directions in `check-rgr-routing.selftest.mjs` mutation 9 (9a/9b should-FAIL, 9c should-STAY-GREEN, 9d/9e wrap-tolerance) | green (NEW) |
| CLS-03 (widened this pass) | The folded `description` frontmatter (not just its length) does not key on test state | unit (new, additive) | `check-rgr-routing.mjs` -> `[cls-03] description single-axis` (3 skills), reusing `keysOnTestState`/`foldedDescription`, whose own mutation coverage already exists in mutation 3 | green (NEW -- was previously a scratch-script-only measurement, see gap-closure section) |
| CLS-04 | The guard fails closed on a missing canonical location; no `existsSync` skip anywhere in it | unit (mutation) | `check-rgr-routing.selftest.mjs` mutations 4 (renamed heading), 5 (vanished file), 8 (anti-vacuity: emptied corpus / emptied surface list) | green |
| CLS-04 | `check-red-references.mjs` label arithmetic is untouched | regression | lz-red battery roster label still reads 125 checks / 13 new labels / 64 retired absent | green -- confirmed unchanged by this pass (file not touched) |
| CLS-05 | The three variant trees exist, differ from `plugins/lz-tdd` exactly as declared, and carry BYTE-IDENTICAL `description` frontmatter per skill | unit (build assertions) | `variants/build-variants.mjs` then `selfcheck-routing.mjs` | green -- re-run this pass, hashes unchanged from 22-08 (`96dc19eacb038e48` / `05e23a05916fc341` / `a5d425ba9dcc974f`) |
| CLS-05 | All three arms compose with distinct `--plugin-dir` values and byte-identical `-p` prompts | unit (dry-run argv) | `selfcheck-routing.mjs` | green -- 6/6 cruxes, re-run this pass |
| CLS-05 | The destination grader classifies exactly-one / multi / none correctly, treats exclusion clauses as non-destinations, and refuses to emit a final grading while judge items remain | unit (fixtures) | `grade-routing.mjs --selfcheck` | green |
| CLS-05 | Judge merge is fail-closed; the pre-aggregate gate blocks an unmerged run | unit | `merge-judge.mjs --selfcheck` | green |
| CLS-05 | Pass@k / Pass^k compute correctly over fixtures | unit | `tabulate-mechanical-red.mjs --selfcheck` | green |
| CLS-05 | Corpus and eval prompts derive from ONE source (one prompt file per case, ids matching) | unit | `selfcheck-routing.mjs` | green |
| CLS-05 | ROUTING CORRECTNESS per arm, Pass@k / Pass^k, substance-only headline, read-rate per arm | MANUAL-ONLY (metered, HALT-gated) | presented in `e2e-rgr-routing/RUN-GATE.md`, never executed (D-14) | not run -- BY DESIGN, see Manual-Only |
| D-06 / SC5 | Each `description` stays within the 1,536-char per-entry cap | unit | `check-rgr-routing.mjs` -> `[cls] description char cap` | green -- lz-red 1422/114, lz-tpp 1000/536, lz-refactor 1391/145 |
| D-06 / SC5 | Trigger reciprocal specificity does not regress after the description edits | MANUAL-ONLY (metered, HALT-gated) | the reciprocal commands in `EVAL-RESULTS.md`, presented not run (D-14) | owed, not run -- see Manual-Only |
| D-19 | Shipped tree ASCII-only, email allowlist-inversion clean, no-verbatim -- INCLUDING `plugins/lz-tdd/references/` | unit (widened scope) | `check-hygiene.mjs`, file count 199 wide / 192 no-verbatim | green |
| D-19 | Eval-set shape + hygiene over the new suite's authored prose | unit (widened glob) | `check-evals.mjs` clause 8 | green |
| D-19 | Plugin structure legal | unit | `claude plugin validate .` and `--strict` | green -- re-run this pass |
| D-18 / SC7 | All three shipped skills pass a fresh acceptance review with >= 1 from-scratch UNPRIMED reviewer | MANUAL-ONLY (ORCHESTRATOR) | orchestrator spawned reviewers after plan 22-08 returned | done -- see `22-VERIFICATION.md` |

*Status legend: green = automated, exit 0, re-confirmed by this pass * not run = correctly gated by design, not a gap*

---

## Coverage gap found and closed at audit (the intro-prose + description-content blind spot)

**What the audit was asked to check.** Whether the two-part coverage boundary this phase's own
history names is now instrumented or still guarded only by human review: (1) intro prose above the
first `## ` heading, (2) `description` CONTENT (not just length), and (3) whether the mutation
selftest already proves both directions for whatever exists.

**(3) was already true and needed no fix.** `check-rgr-routing.selftest.mjs` mutations 0-8 already
cover should-fail (1, 2, 3, 4, 5, 8) and should-stay-green (0, 6, 7) legs, plus an explicit OLD
NEEDLE comparison proving the F-1 ceiling. This part of the plan-time design held up under direct
read; no gap here.

**(1) and (2) were both PARTIAL -- gaps confirmed, not assumed.**

- Read `check-rgr-routing.mjs`'s `ROUTING_SURFACES` array (`tools/lib/routing-parse.mjs`): all
  eleven entries anchor to a `## ` heading via `sectionBody(text, surface.heading)`. No entry names
  the region between a file's H1 and its first `## ` heading. Read the three shipped `SKILL.md`
  files directly: the fixed two-hop sentence (naming both `lz-red` and `lz-tpp`, closing the
  BLOCKER) and the fixed vocabulary sentence (`lz-red`'s "restructuring working code") both sit in
  exactly that region. Confirmed by `22-08-PLAN.md`'s own task 1 (`read_first` names "the intro
  paragraph at 23 to 27... this task edits") and `22-08-SUMMARY.md`'s explicit disclosure quoted
  above.
- Read `check-rgr-routing.mjs`'s import list before this pass: `foldedDescription` was imported and
  used for the character-cap check only. `keysOnTestState` was NOT imported into the checker at
  all. `22-08-PLAN.md` task 5 instructs the executor to measure `keysOnTestState(foldedDescription(file))`
  via "a throwaway script OUTSIDE the repo... never a tracked path" -- i.e., by design, that
  measurement was never meant to become a repeatable, committed assertion. It stayed a one-off.

**How they were closed, additively, mutation-proven both directions.**

1. `tools/lib/routing-parse.mjs` gained one new export, `introBody(text)`: returns the prose
   between the H1 title and the first `## ` heading, or `null` when no H1 line is found (fail-closed,
   consistent with the file's existing `sectionBody` null-on-absence convention). Nothing existing
   was changed; this is a new, independent function.
2. `tools/check-rgr-routing.mjs` gained two new check blocks (both additive, placed alongside the
   existing same-file citation checks and description-char-cap block, changing neither):
   - `[cls-03] intro prose` -- for each of the three skills, asserts `keysOnTestState` over the
     FLATTENED intro paragraph returns `[]` (extends D-03's single-axis rule to the blind spot),
     plus one targeted assertion that `lz-refactor`'s intro affirms `lz-red` before `lz-tpp` (D-02's
     two-hop rule, the exact surface the phase's BLOCKER lived on). This does NOT invent a new
     requirement that every intro name both siblings -- `lz-tpp`'s intro names neither, and
     `22-VERIFICATION.md` already ruled that omission non-blocking (incomplete, not contradictory).
   - `[cls-03] description single-axis` -- for each of the three skills, asserts
     `keysOnTestState(foldedDescription(file))` returns `[]`, turning 22-08's scratch-script
     measurement into a committed, repeatable gate.
3. `tools/check-rgr-routing.selftest.mjs` gained mutation 9 (15 new assertions, in-memory fixtures
   only, same house convention as mutations 0-8):
   - `introBody` fail-closed proofs (no H1 -> `null`; empty/null text -> `null`; finds the H1 and
     stops before the first `## `).
   - **Should-FAIL leg 9a** -- reproduce the historical BLOCKER shape (state only the second hop):
     the hop-order predicate flips to `false`.
   - **Should-FAIL leg 9b** -- reorder the hops (`lz-tpp` before `lz-red`): the hop-order predicate
     flips to `false`.
   - **Should-STAY-GREEN leg 9c** -- reword the sentence differently, same order: the predicate
     stays `true` (the D-12 vocabulary-proxy lesson applied to this check specifically).
   - **Should-FAIL leg 9d** -- smuggle a test-state clause into the intro: caught.
   - **Wrap-tolerance leg 9e** -- a test-state phrase wrapped across a source line break is MISSED
     by `keysOnTestState` on the RAW (non-flattened) intro text and CAUGHT once flattened, proving
     the flatten-before-check design choice is load-bearing rather than decorative (the same
     Pitfall-2 class this repo has recorded three times elsewhere).
   - Export roster updated from nine to ten named helpers (adding `introBody`), so a future rename
     or removal of any export -- including the new one -- still fails the roster check.

**Verification, run directly by this audit, not assumed:**

```
node .claude/skills/lz-red-workspace/tools/check-rgr-routing.mjs
  -> SUMMARY: RGR-ROUTING GREEN -- ... no test-state key in any of 11 surfaces or in any intro
     paragraph, citations resolve, descriptions within the 1536-char cap and single-axis
  -> exit 0
  -> [PASS] [cls-03] intro two-hop rule -- lz-refactor's intro names lz-red before lz-tpp --
     hops [lz-red, lz-tpp]
  -> [PASS] [cls-03] description single-axis -- lz-red/lz-tpp/lz-refactor -- banned=[]

node .claude/skills/lz-red-workspace/tools/check-rgr-routing.selftest.mjs
  -> SUMMARY: rgr-routing self-test GREEN -- all assertions pass (mutation 9, all 15 legs PASS)
  -> exit 0

npm --prefix .claude/skills/lz-red-workspace run check        -> exit 0
npm --prefix .claude/skills/lz-refactor-workspace run check   -> exit 0
claude plugin validate .                                       -> Validation passed, exit 0
claude plugin validate . --strict                               -> Validation passed, exit 0
node .claude/skills/lz-red-workspace/check-evals.mjs            -> exit 0
node .claude/skills/lz-red-workspace/extract-samples.mjs        -> exit 0
node .claude/skills/lz-red-workspace/variants/build-variants.mjs -> exit 0, frontmatter hashes
                                                                     unchanged from 22-08
node .claude/skills/lz-red-workspace/selfcheck-routing.mjs       -> exit 0, 6/6 cruxes
```

`git status --short` after these edits shows exactly three files touched, all under
`.claude/skills/lz-red-workspace/tools/`: `check-rgr-routing.mjs`,
`check-rgr-routing.selftest.mjs`, `tools/lib/routing-parse.mjs`. No file under `plugins/lz-tdd`
was touched (confirmed both by `git status` and by the unchanged `build-variants.mjs` frontmatter
hashes above), so the D-11 placement-A/B precondition is untouched by this pass.

**What this closure does NOT claim.** It does not claim every skill's intro must name both
siblings (a requirement the phase never had -- `22-VERIFICATION.md`'s SC5 Judgment Call already
disposed of that as an omission, not a contradiction, for `lz-tpp`). It does not claim to close
every conceivable blind spot in the instrument -- only the two the phase's own recorded history
names as real, previously-uncaught defects. And it does not touch CLS-05's model-routing claim,
which stays explicitly manual and gated (see Coverage boundary below).

---

## Wave 0 Requirements

All complete; every item's gate runs green (re-confirmed this pass).

- [x] `.claude/skills/lz-red-workspace/tools/check-rgr-routing.mjs` -- CLS-01..CLS-04, now widened
      with the intro-prose and description-single-axis checks (this pass).
- [x] `.claude/skills/lz-red-workspace/tools/check-rgr-routing.selftest.mjs` -- mutations 0-8 as
      planned, PLUS mutation 9 (this pass) for the widened checks, both directions.
- [x] `.claude/skills/lz-red-workspace/tools/lib/routing-parse.mjs` -- the `(condition -> destination)`
      parser, wrap-tolerant at branch scope, now also exporting `introBody`.
- [x] `.claude/skills/lz-red-workspace/tools/lib/section-body.mjs` -- copied, not cross-imported.
- [x] the corpus JSON -- 9 cases, RECONSTRUCTED provenance declared.
- [x] `check-hygiene.mjs` scope widened to `plugins/lz-tdd/references/`; 199 wide / 192 no-verbatim,
      proven non-vacuous.
- [x] `check-evals.mjs` clause-8 glob widened for the new suite dir.
- [x] `.gitignore` lines for the new suite's run tree + rollup JSON.
- [x] `package.json` `scripts.check` wiring for `check-rgr-routing.mjs` (and, by extension, its
      widened checks -- no wiring change was needed since both new checks live inside the same
      already-wired script).

**Wave 2 (A/B instrument):** `variants/build-variants.mjs`, `grade-routing.mjs` + fixtures +
`--selfcheck`, `selfcheck-routing.mjs`, `e2e-rgr-routing/{suite.json,targets.json,prompts/,RUN-GATE.md}`,
`run-e2e.mjs` arm additions, `tabulate-mechanical-red.mjs` grade-file param. All built and GREEN
offline; BUILD-then-HALT is the designed phase-close state (D-24), not an incomplete item.

---

## Coverage boundary -- stated explicitly

The deterministic layer proves the **authored classifier** is exhaustive, disjoint, and single-axis
over the corpus -- and, after this pass, over the intro-prose and description tiers that sit outside
the eleven `## `-anchored surfaces. It still does **NOT** prove that a model **routes** correctly --
that is CLS-05's metered eval, which is manual-only by D-14 and remains un-run at this audit's
time, by design.

Do not let a GREEN battery be read as a routing-correctness verdict. This repo has recorded that
failure mode twice ("THE BATTERY IS NOT THE GATE", STATE.md 2026-07-29), and **this phase exists
because a 125/125 green battery coexisted with a non-exhaustive classifier.** The new checker's
header comment says so in its own words, and now ALSO documents the SECOND boundary this audit
closed (intro prose + description content) and states plainly what remains open.

**Residual boundary, stated honestly rather than rounded away:** this audit closed the SPECIFIC
blind spot the phase's own recorded history names -- prose above the first `## ` heading, and
description content beyond its length. It does not certify there is no THIRD undiscovered blind
spot of the same shape elsewhere in the shipped tree (for example, prose inside a `### ` sub-heading
that no surface's `parseMode` walks, should one ever be authored). The instrument's scope is
`ROUTING_SURFACES` plus the two new checks; anything structurally outside that data is, by the same
mechanism that created this phase, a candidate for another unprimed human review to find. Naming
that limit is the honest result this phase's own doctrine calls for -- not a reason to withhold the
`nyquist_compliant: true` flag, since the two SPECIFIC, EVIDENCED gaps this audit was asked about
are genuinely closed.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Status |
|----------|-------------|------------|--------|
| Routing correctness per placement variant (the 3-arm A/B) | CLS-05 | Metered spend; HALT-gated on fresh owner approval (D-14) | Not run -- BY DESIGN. `e2e-rgr-routing/RUN-GATE.md` presents the exact command; instrument re-proven offline this pass (`build-variants.mjs`, `selfcheck-routing.mjs` 6/6, `grade-routing.mjs --selfcheck`) |
| Trigger reciprocal specificity after the description edits | D-06 / SC5 | Metered spend; same gate | Owed, not run. The D-06 description edits (plan 22-08) force this round; it stays HALT-gated per D-14 |
| Fresh acceptance review of all three shipped skills | D-18 / SC7 | Requires independent subagent contexts; `gsd-executor` has no Agent tool | Done. Orchestrator ran a fresh unprimed reviewer pass after plan 22-08 returned; all findings disposed of, none blocking (`22-VERIFICATION.md`) |
| `/reload-plugins` after the description edits | D-19 | Only the human operator can run it; committed is not live | Owed -- `22-VERIFICATION.md`'s own recommendation #3 records this as still outstanding as of the last verification pass; this audit did not independently confirm it has since been run and does not claim otherwise |

---

## Follow-Ups Recorded by This Audit (not phase-22 gaps)

1. **Bookkeeping lag already flagged by `22-VERIFICATION.md`, not re-litigated here.**
   `REQUIREMENTS.md`'s CLS-01..CLS-05 checkboxes and Traceability rows still read `[ ]`/"Pending",
   and `STATE.md`'s frontmatter predates plan 22-08. Out of this audit's scope (this file only
   updates `22-VALIDATION.md` per its own mandate); tracked already as a required follow-up for
   whoever closes out the phase.
2. **The residual-boundary limit named above** (a hypothetical third blind spot outside
   `ROUTING_SURFACES` plus the two new checks) is not a defect -- it is the honest scope statement
   this phase's own doctrine requires. No corpus case or shipped-file defect currently demonstrates
   one.

---

## Validation Sign-Off

- [x] All tasks have an automated verify or a declared Wave 0 dependency
- [x] Sampling continuity: no 3 consecutive tasks without an automated verify
- [x] Wave 0 covers every MISSING reference above
- [x] No watch-mode flags
- [x] Quick-gate latency < 2s (full battery deliberately unbounded)
- [x] Coverage boundary restated in the new checker's header, INCLUDING the second boundary this
      audit closed and the residual boundary that remains open by design
- [x] `nyquist_compliant: true` set in frontmatter (post-execution, this retroactive audit)

**Approval:** validated 2026-08-04 -- retroactive Nyquist gap-fill audit. Two genuine coverage gaps
found (intro prose above the first heading; description content beyond its length), both closed
additively with mutation-proven checks in both directions, full battery re-confirmed GREEN
throughout. CLS-05's model-routing claim remains explicitly manual and HALT-gated by design (D-14);
this is a stated boundary, not an unmet requirement.
