---
phase: 20
slug: skill-effectiveness-evals
status: verified
# threats_open = count of OPEN threats at or above workflow.security_block_on severity (the blocking gate)
threats_open: 0
asvs_level: 1
created: 2026-07-21
---

# Phase 20 - Security

> Per-phase security contract: threat register, accepted risks, and audit trail.

---

## Trust Boundaries

| Boundary | Description | Data Crossing |
|----------|-------------|---------------|
| maintainer-authored eval content -> committed public repo | new committed JSON (trigger/reciprocal/negatives/scenario data) + JS (check-evals.mjs, grade-run.mjs) + Markdown (EVAL-RESULTS.md, vendored README.md) crosses into a public repo | maintainer identity / PII; public docs |
| eval/grader scripts -> local filesystem | check-evals.mjs, grade-run.mjs, eval-status.mjs, merge-judge.mjs read/write only under `lz-red-workspace`; no network calls | local file I/O only |
| canary-gated runners -> `claude` / `python` CLI (token spend) | `run-recall-chunks.mjs` / `run-spec-chunks.mjs` shell out via `execFileSync` with an argv array (not a shell string) to the already-authenticated `claude` session; GATED, not invoked in this phase | token spend; subprocess invocation |
| vendored third-party rig -> lz-red-workspace | `tools/skill-creator-eval/{scripts/*.py,LICENSE.upstream.txt}` copied byte-identical from the on-disk Phase-11 rig (Apache-2.0); no network fetch, no package install | supply chain (copy-only) |

No runtime / network / session / crypto / user-input surface in this phase's shipped state. The
gated `claude -p` runs (out of this phase's scope, D-11) are the only component that spends tokens
or spawns a subprocess, and they ran nothing here. The threat class is content hygiene (PII,
non-ASCII), grader-leniency (false-credit of a warned-against phrase), token-spend discipline, and
supply-chain provenance of the vendored harness.

---

## Threat Register

| Threat ID | Category | Component | Severity | Disposition | Mitigation | Status |
|-----------|----------|-----------|----------|-------------|------------|--------|
| T-20-01 | Information Disclosure (PII) | committed eval JSON/prose (trigger-eval.json, reciprocal-red.json, d07-chunks/negatives.json, evals.json, grade-run.mjs, EVAL-RESULTS.md, vendored README.md) | high | mitigate | `check-evals.mjs` `scanEmails()` allowlist-inversion (asserts ONLY `larsbrinknielsen@gmail.com` may appear as an email-shaped token, flags anything else) over all 4 authored JSON files; standalone hygiene scan for `evals.json` (20-02); tree-wide backstop scan after both wave-1 plans merge (20-03). Confirmed NOT needle-based -- the script never encodes the forbidden work-email or its bare domain. | closed |
| T-20-02 | Information Disclosure (mojibake) | committed eval prose (queries with inline code + typos) | low | mitigate | `check-evals.mjs` ASCII-only byte scan (`Buffer.from(query,'utf8').some(b=>b>0x7F)`); standalone + tree-wide backstop scans over the merged tree | closed |
| T-20-03 | Denial of Service (token spend) | gated `claude -p` trigger + reciprocal + behavior runs | high (per 20-03's authoritative closing register; 20-01/20-02 scoped it "n/a, out of this plan's scope") | mitigate | D-11 HARD GATE: zero metered runs across all 3 plans; EVAL-RESULTS.md documents exact ready-to-run commands and ends with an explicit HALT line; the run is user-approval-gated (`eval-run-approval-gate`) | closed |
| T-20-04 | Tampering (grader leniency) | `grade-run.mjs` phrase matching (introduced in 20-02) | high | mitigate | Every `phraseSet` check routes through the negation-aware `occursAffirmed()` (borrowed from `grade-reference.mjs`), never a bare `regex.test`; `--selfcheck` carries explicit negation-rejection fixtures (forward/backward/hedged-contrastive) | closed |
| T-20-SC | Tampering (supply chain) | npm/pip installs; vendored `tools/skill-creator-eval/` rig | n/a | accept | No package install in any of the 3 plans (`package.json`/`package-lock.json`/`tsconfig.json` untouched since Phase 16); the harness is a byte-identical on-disk copy from the Phase-11 rig, not fetched over the network. Package-legitimacy gate vacuously satisfied. | closed |

*Status: open - closed - open below high threshold (non-blocking)*
*Severity: critical > high > medium > low -- only open threats at or above `high` count toward threats_open*
*Disposition: mitigate (implementation required) - accept (documented risk) - transfer (third-party)*

---

## Accepted Risks Log

| Risk ID | Threat Ref | Rationale | Accepted By | Date |
|---------|------------|-----------|-------------|------|
| AR-20-SC | T-20-SC | No package installs across any of the 3 phase-20 plans (independently confirmed: `package.json`/`package-lock.json`/`tsconfig.json` last modified in Phase-16 commits `8cdda55`/`5b816d9`, untouched by every Phase-20 commit). The vendored `tools/skill-creator-eval/` rig is a byte-identical on-disk copy of the Phase-11 harness (Apache-2.0), independently re-verified via `git diff --no-index --quiet` (exit 0) for all 6 verbatim files. Low severity, accepted. | Lars Gyrup Brink Nielsen (maintainer) | 2026-07-21 |

---

## Security Audit Trail

| Audit Date | Threats Total | Closed | Open | Run By |
|------------|---------------|--------|------|--------|
| 2026-07-21 | 5 | 5 | 0 | gsd-security-auditor (Sonnet 5), orchestrator-spawned |

**Verification depth:** ASVS L1 (grep/inspection), with several checks carried to L2/L3 depth
(mitigation-placement and negation-logic tracing, and filesystem-level absence proofs, not just
pattern presence). All checks below were independently re-run by the auditor against the merged
tree -- none are accepted on SUMMARY.md's word alone:

- **T-20-01 / T-20-02 (hygiene):** `node check-evals.mjs` re-run -> exit 0, "24 queries (12 trigger
  / 12 near-miss; 3 lz-tpp-seam + 3 lz-refactor-seam), reciprocal 12 all-false byte-consistent,
  ASCII-clean, email-allowlist-clean". Read `check-evals.mjs` source directly: `scanEmails()` (lines
  201-218) asserts an `APPROVED_EMAIL` allowlist and flags any other email-shaped token -- confirmed
  allowlist-inversion, NOT a needle for the forbidden value (the forbidden work-email/domain does not
  appear anywhere in the script). Independently re-scanned (auditor-authored script, not the
  executor's) the full merged `lz-red-workspace` tree (18 files, excluding the vendored rig,
  `node_modules`, and byproduct dirs) -> `tree-hygiene-ok`, zero non-ASCII bytes, zero
  non-allowlisted email tokens. Independently confirmed the vendored, maintainer-edited
  `tools/skill-creator-eval/README.md` and `EVAL-RESULTS.md` are both ASCII-clean (`rg` non-ASCII
  scan = 0 matches) and carry no email-shaped token at all (trivially allowlist-clean).
- **T-20-03 (token spend / D-11 gate):** Filesystem search (`find`) for `trigger-results-*`,
  `grading*.json`, `*.preliminary.json`, and any `run-*/`, `results*/`, `iteration-*/` directory under
  `lz-red-workspace` returned EMPTY -- nothing metered ran, not merely "wasn't committed" but absent
  from disk entirely. `git ls-files` search for tracked byproduct paths returned only the two
  intentional runner SOURCE files (`run-recall-chunks.mjs`, `run-spec-chunks.mjs`), no captured
  results. `.gitignore` carries exactly the 3 added `lz-red-workspace` run-capture lines. All 7
  phase-20 task commits (`8b44780`, `dfdde96`, `d3b620b`, `3ccdcb0`, `07986d2`, `8b3bfc5`, `c18d6c8`)
  were individually inspected via `git show --stat` -- every changed file is source/data, never a
  runtime artifact. `EVAL-RESULTS.md` documents the exact GATED commands with every result cell blank
  and ends with an explicit HALT line.
- **T-20-04 (grader leniency):** `node grade-run.mjs --selfcheck` re-run -> exit 0, "SELFCHECK OK".
  Read `grade-run.mjs` source directly: the `phraseSet` branch of `scoreCheck()` (line 387) calls
  `occursAffirmed()` for every phrase, never a bare `regex.test`. `occursAffirmed()` (lines 162-183)
  implements clause-scoped bidirectional negation (`NEG`, `CONTRAST`, `FWD_BOUNDARY`) plus
  hedged-contrastive retraction. The selfcheck body carries multiple negation-rejection fixtures
  confirmed present in source (forward negation, backward negation, hedged-then-retracted, and a
  full `grade()`-level fixture on eval-6 proving a negated "false green" is NOT credited).
- **T-20-SC (supply chain):** `git diff --no-index --quiet` independently re-run for all 6 vendored
  files (`run_eval.py`, `utils.py`, `__init__.py`, `LICENSE.upstream.txt`, `eval-status.mjs`,
  `merge-judge.mjs`) against the Phase-11 `lz-refactor-workspace` source -> exit 0 for every file
  (byte-identical). `git log` confirms `package.json`/`package-lock.json`/`tsconfig.json` last
  touched in Phase-16 (`8cdda55`, `5b816d9`), never in Phase 20.
- **Regression check (not a declared threat, but load-bearing):** the existing Phase-16/17/18 content
  gate re-run clean on the merged tree -- `tools/check-red-references.mjs` 11/11 PASS,
  `extract-samples.mjs` 8/8 modules tsc-strict clean.
- **New-attack-surface spot-check:** the two LIGHT-EDIT runner scripts
  (`run-recall-chunks.mjs`/`run-spec-chunks.mjs`, modified beyond a verbatim copy) were read in full.
  Both invoke `execFileSync` with an argv array (`["-m","scripts.run_eval",...]`), never a shell
  string -- no command-injection surface introduced beyond the established Phase-11 precedent
  pattern; this code path is additionally inert in this phase (D-11 gate, confirmed above).
- **Unregistered flags:** `rg -l "Threat Flags"` across all 3 SUMMARY.md files (20-01, 20-02, 20-03)
  returns no match -- none contains a `## Threat Flags` section, and no new unmapped attack surface
  was found during this audit.
- **Severity-consistency note (non-blocking observation):** T-20-03's severity is stated
  inconsistently across the plans -- "n/a (out of scope)" in 20-01 and 20-02's registers, but "high"
  in 20-03's (the phase-closing plan). This register uses 20-03's "high" as authoritative (fail
  toward the stricter reading); it does not change the disposition or the closed status, since the
  D-11 gate is independently verified to have held with zero metered execution across all 3 plans.

No unregistered threat flags. No SUMMARY (20-01/20-02/20-03) contains a `## Threat Flags` section
and no new attack surface appeared during implementation beyond what the register already covers.

---

## Sign-Off

- [x] All threats have a disposition (mitigate / accept / transfer)
- [x] Accepted risks documented in Accepted Risks Log
- [x] `threats_open: 0` confirmed
- [x] `status: verified` set in frontmatter

**Approval:** verified 2026-07-21
