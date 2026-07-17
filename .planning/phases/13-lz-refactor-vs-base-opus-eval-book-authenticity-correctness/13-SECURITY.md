---
phase: 13-lz-refactor-vs-base-opus-eval-book-authenticity-correctness
audited: 2026-07-15
auditor: gsd-security-auditor
asvs_level: 1
threats_total: 6
threats_closed: 6
threats_open: 0
unregistered_flags: 0
status: secured
---

# Phase 13 Security Audit -- lz-refactor vs base Opus eval (book authenticity & correctness)

**Phase type:** MEASUREMENT-ONLY eval. Ships NO application/product code. The phase-13 commit
range (`08bc905^..HEAD`, 69 files) touched only `.md` docs, `.json` data, `.patch` diff captures,
and one `.snap` golden master -- zero `.ts`/`.js`/`.py` source. There is no runtime, network, or
user-input attack surface. The declared threat model is therefore INFORMATION-DISCLOSURE plus
authoring/supply-chain TAMPERING only (ASVS L1).

**Threat register:** the 5 PLAN.md `<threat_model>` blocks declare 6 distinct threats (deduplicated
across plans): T-13-01, T-13-02, T-13-03 (mitigate), T-13-04, T-13-05 (mitigate), T-13-SC (accept).
Every threat was verified against the committed artifacts on disk (not against documentation intent).

## Threat Verification

| Threat ID | Category | Disposition | Result | Evidence |
|-----------|----------|-------------|--------|----------|
| T-13-01 | Information Disclosure (source-book prose leak) | mitigate | CLOSED | No `.oracle/` PATH token in any grading record (`grading/**.json`) or `13-RESULTS.md`; the only `.oracle` occurrences are firewall-describing meta-notes in `13-05-SUMMARY.md` (lines 29, 56) and `13-VERIFICATION.md` (lines 38, 61, 115) -- acceptable per scope. `fidelity.json` `why` fields are structural paraphrase in the oracle's own words (e.g. "names a coherent fragment, replaces the call site, and folds N recurrences onto one helper"), no verbatim book definitions/headings/example code. `claims.json` `functional_change` fields are OUR diff-derived words (symbol names, line deltas, test counts); `named_refactoring` fields are refactoring TITLES (facts, not prose). |
| T-13-02 | Information Disclosure (maintainer work email/domain) | mitigate | CLOSED | Allowlist-inversion over the full phase-13 tree (planning dir + grading + baselines + results/apply): the ONLY email-shaped token present is the approved public gmail (`larsbrinknielsen@gmail.com`, in `13-05-PLAN.md` as the allowlisted value); no other email-shaped token anywhere. All 17 commits touching the phase-13 dir/workspace have author AND committer email = the approved gmail (allowlist-inversion of `%ae`/`%ce` returned NONE outside it). |
| T-13-03 | Tampering (non-ASCII / mojibake) | mitigate | CLOSED | `rg -nP '[^\x00-\x7F]'` over all 69 phase-13-authored files (per `git diff --name-only 08bc905^..HEAD`) returned nothing -- ASCII-clean. (See observation below re: pre-existing `invoke_skill` corpus.) |
| T-13-04 | Tampering (apply run corrupts protected borrowed branch) | mitigate | CLOSED | `run-e2e.mjs` has `PROTECTED_BRANCHES` (line 55), refuses `git reset --hard` on a protected branch in apply mode (lines 338-344), and requires `--cwd` pointing at a throwaway branch (line 592). Phase reused this harness unchanged (D-03). `13-VERIFICATION.md` confirms both borrowed repos restored pristine post-phase (nx clean @ `origin/23.0.x`; kata on `main`, throwaway `lz13-kata-apply` deleted). |
| T-13-05 | Tampering (behavior verdict corrupted by wrong gate) | mitigate | CLOSED | `behavior.json` `method` + `baselines` record the nx DIFFERENTIAL gate ("no NEW failures beyond baseline"; baseline 15 failed / 169 passed / 184 total) and the kata `jest --ci` golden-master gate ("--ci refuses to write; PASS = matches pristine golden master"). `e2e-nx/behavior-baseline.json` records the 15-fail differential reference + `differential_rule`; the pristine golden master exists at `e2e-gilded-rose/golden-master/approvals.spec.ts.snap`. |
| T-13-SC | Tampering (npm/pip installs) | accept | CLOSED | Accepted risk logged below; acceptance premise VERIFIED: no `package.json`/lockfile (npm/yarn/pnpm/pip/poetry/cargo) touched in `08bc905^..HEAD`; file-type breakdown is 26 `.md` / 24 `.json` / 18 `.patch` / 1 `.snap` only. The eval reused the borrowed repos' existing `node_modules`; no registry surface. |

## Accepted Risks Log

| Threat ID | Category | Rationale | Acceptance basis |
|-----------|----------|-----------|------------------|
| T-13-SC | Tampering / supply-chain (package installs) | Measurement-only phase installs no packages; nx/jest already present in the borrowed repos' `node_modules`; the in-repo grading uses only `node` (for Pass@k) and the repos' existing test runners. No registry fetch occurred. | Empirically verified: zero manifest/lockfile changes across the phase commit range; only `.md`/`.json`/`.patch`/`.snap` files changed. |

## Unregistered Flags

None. No SUMMARY.md (`13-01..13-05`) contains a `## Threat Flags` section, and no new attack
surface appeared during implementation that maps to no threat ID. (The phase ships no code, so no
new runtime surface was possible.)

## Observations (non-blocking)

- **Pre-existing non-ASCII in the reused `invoke_skill` corpus.** `results/apply/invoke_skill/gr1/run-3/answer.md`
  (and sibling `invoke_skill` answer.md files) contain Unicode punctuation (em dash, arrow). These
  files are NOT in the phase-13 commit range -- they were committed by an earlier phase and are
  REUSED as graded corpus (the `invoke_skill` arm), not authored/re-committed by phase 13. T-13-03's
  declared mitigation is scoped to "the new files," which are all ASCII-clean, so this is outside the
  threat's scope and NOT a gap. Flagged only because `13-RESULTS.md` cites the `invoke_skill` arm:
  if those reused artifacts are ever re-committed under this repo they should be ASCII-normalized
  first. No action required for phase-13 sign-off.

## Verdict

All 6 declared threats are CLOSED (5 mitigations verified present in the committed artifacts;
1 accepted risk with its premise empirically confirmed). `threats_open: 0`. No blockers; no
unregistered flags. Phase 13 passes the security audit.
