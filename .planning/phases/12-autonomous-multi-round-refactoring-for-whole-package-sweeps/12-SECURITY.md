---
phase: 12-autonomous-multi-round-refactoring-for-whole-package-sweeps
type: security-audit
asvs_level: 1
block_on: high
threats_total: 8
threats_closed: 8
threats_open: 0
status: secured
severity_summary: none (no BLOCKER; one documented fidelity note on T-12-02 shipped prose)
audited: 2026-07-14
---

# Phase 12 (autonomous-multi-round-refactoring-for-whole-package-sweeps) -- Security Audit

Verification of the threat registers declared in `12-01-PLAN.md`, `12-02-PLAN.md`,
and `12-03-PLAN.md` `<threat_model>` blocks. Each threat is verified by its declared
disposition against implemented code, committed docs, and git history -- documentation
and intent are NOT accepted as evidence; every mitigation was grep/read-confirmed in
the shipped or committed artifact.

Phase 12 is a NON-BLOCKING skill-authoring + local eval-harness phase. There is no
runtime service, no network listener, no untrusted external input, no auth, and no
secrets. The shipped artifact is Markdown coaching guidance
(`plugins/lz-tdd/skills/lz-refactor/SKILL.md`); the rest is local eval instruments
(`.mjs` runners + JSON data + prompt files) under
`.claude/skills/lz-refactor-workspace/`, driving `claude -p` child processes against
throwaway repo checkouts.

IMPORTANT AUDIT CONTEXT -- the shipped skill was altered AFTER the phase commits.
The current HEAD state of `SKILL.md` reflects a deliberate post-phase revert:

- `beed2a1` (12-01) -- committed the eval + e2e instruments (pre-edit baseline tree).
- `98eedd5` (12-02) -- committed the broadened description + sweep-drive cluster.
- `138acf4` -- "revert 12-02 sweep bulk; bind the over-engineering veto + add
  blast-radius guard". This REVERTED the broadened description and TRIMMED the
  sweep-drive cluster, while EXPLICITLY ADDING the blast-radius guard.
- `877aef3` -- generalized the step-4 net-cost warrant.

Because implementation is the source of truth, all `SKILL.md` mitigations below are
verified against the CURRENT HEAD prose, not the plan-time 12-02 form.

## Threat Verification

| Threat ID | Plan | Category | Disposition | Verdict | Evidence |
|-----------|------|----------|-------------|---------|----------|
| T-12-01 | 12-01 | Tampering (measurement integrity) | mitigate | CLOSED | check-evals green; sweep positives + paired negatives present |
| T-12-03 | 12-01 | Information disclosure (hygiene) | mitigate | CLOSED | ASCII-clean + allowlist-inversion clean on 8 instrument files |
| T-12-01 | 12-02 | Tampering (seam mis-route) | mitigate | CLOSED | seam exclude-reroute tail intact at HEAD; broadened surface reverted |
| T-12-02 | 12-02 | Tampering / Elevation (autonomous over-reach) | mitigate | CLOSED (fidelity note) | over-reach guards present in shipped sweep section |
| T-12-03 | 12-02 | Information disclosure (hygiene) | mitigate | CLOSED | SKILL.md + commit messages ASCII + PII-clean |
| T-12-04 | 12-03 | Repudiation / measurement integrity | mitigate | CLOSED | reload + stale-cache + pre-edit-baseline protocol; measurement done post-reload |
| T-12-05 | 12-03 | Tampering (real-repo edits) | accept | CLOSED (accepted) | protected-branch guard + applyBase reset verified in harness |
| T-12-SC | all | Tampering (supply chain) | accept | CLOSED (not triggered) | no package install this phase |

## T-12-01 (12-01) -- Tampering / measurement integrity (mitigate) -> CLOSED

Threat: overfit or unbalanced trigger fixtures produce false measurement (a mis-shaped
specificity guard for the broadened sweep intent).

Declared mitigation: every new sweep positive is paired with a sweep-shaped hard
negative on a neighboring category; the red-test negative matches the seam regex so the
2-seam lint holds; `check-evals.mjs` gates the split before any run (D-03/D-12).

Verified present:

1. `check-evals.mjs` exits 0: `OK - 30 queries (16 trigger / 14 near-miss; 5
   lz-tpp-seam negatives), ASCII-clean`. The 2-seam gate is satisfied with margin (5).
2. `evals/trigger-eval.json` carries exactly 3 sweep POSITIVES naming a package /
   directory / codebase scope with a green-state cue and scan-and-fix framing (lines
   15-17: `billing` package, `src/services` directory, `auth` library codebase-wide).
3. It carries 3 paired sweep NEGATIVES on the neighboring boundaries (lines 30-32):
   feature-adding sweep (`api` package), performance sweep (`reporting` module),
   red-test sweep (`parser` package). The red-test negative
   ("...smallest edit to make each one pass? doing tdd.") matches the seam regex.
4. Dual-write byte-consistency verified: the 14 negatives in `trigger-eval.json` and
   `evals/d07-chunks/negatives.json` (the file the spec runner reads) are mutual
   subsets (identical set + order).
5. Anti-overfit confirmed: no query quotes the `p7cmd` / `gr3cmd` e2e prompt wording
   (`runtime-lint-utils.ts` / `updateQuality` appear only in the symbol-scoped
   positives on lines 13-14, not in the sweep-category positives).

Verdict: CLOSED. The specificity guard is present and gated by a green lint.

## T-12-03 (12-01) and T-12-03 (12-02) -- Information disclosure / public-repo hygiene (mitigate) -> CLOSED

Threat: committed eval queries, e2e prompt files, SKILL.md prose, or commit messages
could leak maintainer PII (work email / bare domain) or non-ASCII mojibake into the
public repo.

Declared mitigation: ASCII-only + email allowlist-inversion before commit (only the
approved public gmail `larsbrinknielsen@gmail.com` may appear; never the maintainer
work email/domain, plain or obfuscated); no AI-attribution trailer.

Verified present (allowlist-inversion scan run this audit across all 9 committed
Phase-12 surfaces -- the 8 instrument files + `SKILL.md`):

- ASCII byte scan: every file ASCII-clean (0 bytes > 127).
- Email allowlist-inversion: 0 email-shaped tokens in any file; therefore 0
  non-approved tokens. The invariant "only the approved gmail may appear" holds
  vacuously (nothing to flag). The forbidden value was never written as a search
  needle -- detection is by inversion.
- Commit messages `beed2a1`, `98eedd5`, `138acf4` are ASCII, carry no PII, and carry
  no AI-attribution trailer (conventional-commit subjects only).

Verdict: CLOSED for both plans. No hygiene violation on any committed surface.

## T-12-01 (12-02) -- Tampering / seam mis-route (mitigate) -> CLOSED

Threat: an over-broad description mis-routes the green/transformation step away from
lz-tpp (a correctness/seam regression).

Declared mitigation: address the sweep CATEGORY only; keep the exclude-and-reroute
tail; re-measure specificity on the new surface; D-17 unbiased review for seam leakage.

Verified present at HEAD:

- The 12-02 broadened description was REVERTED post-phase (`138acf4`); the current
  `SKILL.md` description is the leaner intent form from `8acd2b8`, so the broad-surface
  the threat guarded against is no longer shipped (residual risk is LOWER than at plan
  time).
- The core seam control -- the exclude-and-reroute tail -- is INTACT at HEAD
  (`SKILL.md` lines 14-17): "Do NOT use it to make a failing or red test pass or
  otherwise ADD or CHANGE behavior -- that is the green/transformation step; use
  lz-tpp instead -- nor for writing new code, adding a feature, or writing a function
  from scratch."
- The dedicated seam section "Refactoring vs the green step (the lz-tpp seam)"
  (lines 37-41) and step 1 of the decision procedure (lines 45-48) are unchanged.
- D-17 review is recorded in `12-02-SUMMARY.md`: a primed reviewer (PASS) and an
  unbiased from-scratch reviewer (PASS-with-fixes, fixes applied) ran before commit.

Verdict: CLOSED. The seam guard is present; the broadened surface was reverted.

## T-12-02 (12-02) -- Tampering / Elevation / autonomous over-reach (mitigate) -> CLOSED (with fidelity note)

Threat: the sweep-drive cluster authorizes multi-round autonomous edits; without guards
it could edit outside the named scope, on uncovered code, or change behavior.

Declared mitigation: the 7 D-07 pause boundaries + D-08 forward-only + D-06 terminal
review gate + never-commit-unless-asked are the shipped safety controls; the auditor
verifies the guards are present IN THE PROSE, not merely in the eval design.

Verified present in the shipped `## Whole-package / directory sweeps` section
(`SKILL.md` lines 101-116) plus the drive paragraph above it (lines 92-99):

- Boundary 1 (seam / behavior route-out): "route any behavior change to lz-tpp and
  exclude it (step 1)" -- PRESENT.
- Boundary 2 (revert on unrecoverable red): "If a step turns the tests red, revert it
  and take a smaller step; halt the sweep if green cannot be restored" -- PRESENT.
- Boundary 3 (untested target): "an untested target (characterization test first, per
  step 5)"; step 5 (lines 77-87) routes to Feathers before touching uncovered code
  -- PRESENT.
- Boundary 4 (speculative pattern introduction): the sweep applies "its step-4
  APPLY/DECLINE verdict" per smell; step 4 (lines 61-76) is the net-cost gate
  DECLINING unwarranted patterns -- PRESENT via reference.
- Boundary 6 (blast radius escaping scope / exported-public-API change): "Pause and
  ask (do not silently proceed) on the step-5 blast-radius guard"; step 5 (lines
  82-85) states the exported/public-API + cross-package pause -- PRESENT (explicitly
  ADDED/strengthened by revert commit `138acf4`).
- D-06 terminal review gate + bounded ceiling: "Once a sweep has touched many files or
  run several rounds, checkpoint scope with the developer rather than churning
  unbounded. Stop at the fixpoint ... not at zero smells at any cost." -- PRESENT.
- Never-commit-unless-asked: drive paragraph "then stop and leave the changes for the
  developer to review -- do not commit unless they ask" (lines 98-99) -- PRESENT.

FIDELITY NOTE (documented, NOT a blocker): the plan-declared verbose form named all 7
boundaries + an explicit forward-only D-08 clause. Revert commit `138acf4` (the
deliberate "over-engineering veto") TRIMMED three items from the shipped cluster:

- Boundary 5 (genuinely ambiguous behavior -> pin/ask) -- not stated verbatim, but an
  ambiguous behavior change is still a behavior change caught by boundary 1's blanket
  "route any behavior change to lz-tpp and exclude it".
- Boundary 7 (flaky / too-slow suite -> advise mode) -- not stated; this is a
  reliability concern, backstopped by the "tests green after each" invariant + the
  "halt if green cannot be restored" fallback.
- Explicit forward-only D-08 anti-oscillation clause -- not stated verbatim; this is a
  churn/efficiency control, constrained instead by the step-4 net-cost gate and the
  "do not churn ... for their own sake" value-lead.

The security-load-bearing over-reach controls (do not touch uncovered code; route
behavior changes out; revert on red; pause on blast-radius / public-API escape;
bounded checkpoint; never commit unasked) are all verifiably present. The trimmed
items are non-security refinements removed by a deliberate documented decision that
KEPT and strengthened the most security-relevant control.

Verdict: CLOSED. Substantive over-reach mitigation is present in the shipped prose.
The three trimmed refinements are recorded above for the milestone audit; they are not
a security gap for a Markdown-guidance phase with no runtime execution.

## T-12-04 (12-03) -- Repudiation / measurement integrity (mitigate) -> CLOSED

Threat: a before/after run against a stale or un-reloaded skill silently measures the
OLD skill (false result).

Declared mitigation: the protocol mandates /reload-plugins before the after-run,
deletion of stale chunk caches, and a baseline captured against the explicit pre-edit
tree so before/after is not conflated (D-12/D-16, Pitfall 3/5).

Verified present:

- `12-03-PLAN.md` (lines 73-86) presents the baseline-first protocol: capture the
  pre-edit baseline against the commit before the SKILL.md commit, then reload, then
  DELETE `trigger-results-d07-{recall,spec}-chunk-*.json` +
  `evals/d07-chunks/{recall,spec}-chunk-*.json` before the after-run.
- The pre-edit-baseline invariant is structurally satisfied by design: `beed2a1`
  commits ONLY instruments and `98eedd5` commits ONLY `SKILL.md`, so the commit before
  the SKILL.md commit is exactly {OLD SKILL.md + NEW instruments} (git-confirmed:
  `98eedd5` touched only `SKILL.md`; `beed2a1` touched no `plugins/` path).
- `12-03-SUMMARY.md` reconciles that the reload + measurement were subsequently
  performed (e2e read the edited skill from disk via `--plugin-dir`, avoiding the
  stale-skill trap), reporting the gaps measured CLOSED with no regression.

Verdict: CLOSED. The measurement-integrity controls are declared and were honored.

## T-12-05 (12-03) -- Tampering / real-repo edits (accept) -> CLOSED (accepted risk)

Threat: the e2e apply arm edits real target repos (nx / kata working trees).

Disposition: accept. The accept rationale (apply mode resets to applyBase between runs,
refuses protected branches, edits uncommitted/reversible) is VERIFIED well-founded in
the harness -- the accept is not taken on faith:

- `e2e-nx/run-e2e.mjs` line 55 reads `PROTECTED_BRANCHES` from the suite config;
  lines 338-345 refuse `git reset --hard` on a protected branch and throw, requiring a
  throwaway branch; line 592 requires `--cwd` to point at a throwaway checkout.
- `e2e-nx/suite.json` declares `applyBase: "origin/23.0.x"` and `protectedBranches:
  ["23.0.x","main","master"]`; `e2e-gilded-rose/suite.json` declares
  `applyBase: "main"` and `protectedBranches: ["main","master"]`.
- The apply run is the intended behavioral proof, scoped to throwaway checkouts already
  restored pristine; edits are uncommitted and reversible.

Verdict: CLOSED (accepted). See accepted-risks log.

## T-12-SC (all plans) -- Tampering / supply chain (accept) -> CLOSED (not triggered)

Threat: npm/pip/cargo installs pulling tampered packages.

Disposition: accept. Verified NOT triggered -- `tech-stack.added: []` in every
Phase-12 SUMMARY; the eval harness is the pre-existing vendored rig (Node stdlib +
existing venv); no dependency-manifest churn attributable to this phase.

Verdict: CLOSED. No package install this phase.

## Accepted-Risks Log

| Threat ID | Accepted Risk | Status this phase | Re-check trigger |
|-----------|---------------|-------------------|------------------|
| T-12-05 | The e2e apply arm edits real nx / kata working trees. | Bounded -- harness refuses protected branches, resets to applyBase between runs, requires a throwaway `--cwd`; edits uncommitted/reversible; checkouts restored pristine. | Any change to `run-e2e.mjs` protected-branch or applyBase-reset logic, or any apply run pointed at a non-throwaway tree. |
| T-12-SC | Package installs (npm/pip/cargo) could introduce tampered dependencies. | NOT triggered -- vendored harness reused; `tech-stack.added: []`; no manifest churn. | Any future `npm/pip/cargo install` in this workspace. |

## DST-04 -- Copyrighted book prose in the shipped skill (out-of-register, scope_context check)

Not in the formal threat register, but assessed per the audit brief. The only shipped
file changed this phase is `SKILL.md`, a router of original coaching prose (modes,
decision procedure, sweep section) that names refactorings/patterns (uncopyrightable
names) and links to the reference catalogs. The reference catalogs (Fowler / Kerievsky
/ GoF / functional) were FROZEN this phase (D-01: no catalog re-authoring). No
near-verbatim Fowler or Kerievsky book passage appears in `SKILL.md`. No DST-04
violation on the surface changed this phase.

## Unregistered Flags

None. No Phase-12 SUMMARY carries a `## Threat Flags` section (grep-confirmed across
all three). No new unmapped attack surface appeared during implementation.

## Out-of-Scope Observation (informational, not a Phase-12 threat)

`12-02-SUMMARY.md` records that `npm run check` is RED at HEAD due to `check-catalog.mjs`
flagging 3 Fowler leaves (Use-when not mirrored in README). This is PRE-EXISTING
(catalog byte-unchanged since before Phase 12, likely from the 2026-07-09 humanize
pass), OUTSIDE Phase-12's frozen-catalog scope, and unrelated to any Phase-12 threat.
It is a catalog-hygiene defect for a separate quick task, not a security gap.

## Result

8 of 8 threats resolved: 6 mitigated-and-CLOSED (T-12-01 x2, T-12-02, T-12-03 x2,
T-12-04), 2 accepted-and-CLOSED (T-12-05, T-12-SC). Open threats: 0. ASVS Level 1.
No BLOCKER; no escalation required. One documented fidelity note on T-12-02 (three
non-security-load-bearing sweep-cluster refinements trimmed by the post-phase
over-engineering revert) is recorded for the milestone audit.
