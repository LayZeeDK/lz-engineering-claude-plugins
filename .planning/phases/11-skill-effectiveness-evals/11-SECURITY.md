---
phase: 11-skill-effectiveness-evals
type: security-audit
asvs_level: 1
block_on: high
threats_total: 3
threats_closed: 3
threats_open: 0
status: secured
audited: 2026-07-10
---

# Phase 11 (skill-effectiveness-evals) -- Security Audit

Verification of the threat register declared in `11-04-PLAN.md` `<threat_model>`.
Each threat is verified by its declared disposition against implemented code and
git history -- documentation and intent are not accepted as evidence.

Phase 11 is a NON-BLOCKING eval/validation phase: no production service, no
network listener, no untrusted external input, no auth or secrets. The artifacts
are local Node/Python eval tooling + JSON data + `claude -p` probe subprocesses
under `.claude/skills/lz-refactor-workspace/`.

## Threat Verification

| Threat ID | Category | Disposition | Verdict | Evidence |
|-----------|----------|-------------|---------|----------|
| T-11-07 | Elevation of Privilege | mitigate | CLOSED | See below |
| T-11-08 | Information Disclosure | accept | CLOSED (not triggered) | See accepted-risks log |
| T-11-SC | Tampering | accept | CLOSED (not triggered) | See accepted-risks log |

## T-11-07 -- Elevation of Privilege (mitigate) -> CLOSED

Threat: running an eval spends `claude -p` tokens (a standing user-gated action);
an autonomous phase must not spend tokens without explicit approval.

Declared mitigation: D-10 hard gate -- 11-04 is `autonomous:false` / blocking;
present ready-to-run commands + HALT; automated readiness runs ONLY
selfchecks/lints (no `claude -p`).

Verified mitigations present:

1. Hard gate is structural, not documentary.
   - `11-04-PLAN.md` frontmatter: `autonomous: false` (line 8).
   - The single task is `<task type="checkpoint:human-verify" gate="blocking">`
     (line 52) with a `<resume-signal>` requiring the user to type "approved".
2. Readiness checks spend zero tokens.
   - The automated verify is `node grade-run.mjs --selfcheck && node
     merge-judge.mjs --selfcheck && node check-evals.mjs`.
   - Grep-inversion for `claude` in the readiness scripts:
     `grade-run.mjs` and `merge-judge.mjs` -> 0 matches;
     `check-evals.mjs` -> only a comment "This is a local lint, NOT a claude -p
     run (D-10 respected)". No readiness script invokes the CLI.
3. The token-spending run executed only AFTER explicit approval, out of phase.
   - Build plans 11-01/11-02/11-03 committed build artifacts only; all three
     SUMMARY files state nothing was run and EVAL-RESULTS.md numbers stayed blank
     (D-10 halt honored).
   - Approval is recorded at commit `9d56b1b` (2026-07-10 02:55, "D-10 approved
     for autonomous run"); the run results were committed later at `8c0c105`
     (2026-07-10 08:28, "record EVL-01 + EVL-02 skill-effectiveness eval
     results"). The order proves the run followed the gate.
4. Probe injection surface is closed.
   - `tools/skill-creator-eval/scripts/run_eval.py` invokes the CLI via
     `subprocess.Popen(cmd, ...)` with `cmd` as an argv array (lines 117-152);
     grep-inversion for `shell=True` -> 0 matches. The raw query is passed as a
     single argv element and `shutil.which` resolves the binary, so shell
     metacharacters (backticks/quotes) in a query are never re-parsed (documented
     lines 108-109). This is the standing serial config: `--num-workers 1`,
     `PONYTAIL_DEFAULT_MODE=off`, `--strict-mcp-config` + `--mcp-config
     {"mcpServers":{}}` + `--setting-sources project` (lines 134-137) -- MCP
     servers dropped, user plugins dropped so neither sibling skill steals the
     probe.

Verdict: CLOSED. All four declared mitigation elements are present in code /
plan structure / git history.

## T-11-08 -- Information Disclosure (accept) -> CLOSED (accepted risk, not triggered)

Threat: a post-approval D-08 tuning pass could write back into
`plugins/lz-tdd/skills/lz-refactor/SKILL.md`, potentially committing
non-ASCII/PII prose into the shipped public skill.

Disposition: accept. Verified NOT triggered:

- Both D-07 bars were met, so no D-08 tuning was authorized: EVAL-RESULTS.md
  reports EVL-01 100% recall / 100% specificity and EVL-02 with_skill 100%
  Pass@1; the D-08 section states "NOT applied ... No file under plugins/ was
  modified by this phase."
- Git confirms zero write-back: `git log 4ef2dd7..HEAD -- plugins/` (the entire
  phase-11 commit range) returns no commits. `plugins/lz-tdd/skills/lz-refactor/
  SKILL.md` was last touched at `00258e3` (2026-07-09 23:41), which PREDATES every
  phase-11 commit (earliest is `f82358e`, 2026-07-10 01:01).

Verdict: CLOSED. Accepted risk did not fire; no tuning write-back occurred.

## T-11-SC -- Tampering (accept) -> CLOSED (accepted risk, not triggered)

Threat: npm/pip/cargo installs pulling tampered packages.

Disposition: accept (low severity, no ASVS L1 install surface). Verified NOT
triggered:

- The harness was reused from the pre-existing vendored Phase-5 rig
  (byte-identical copy per 11-01); Node stdlib and the existing Python venv only.
- `tech-stack.added: []` in all four phase-11 SUMMARY files.
- Git confirms no dependency manifest churn: `git log 4ef2dd7..HEAD` over
  `package.json` / `package-lock.json` / `requirements.txt` / `Cargo.toml` /
  `pyproject.toml` returns no commits.

Verdict: CLOSED. No package installs this phase.

## Accepted-Risks Log

| Threat ID | Accepted Risk | Status this phase | Re-check trigger |
|-----------|---------------|-------------------|------------------|
| T-11-08 | A post-approval, bounded D-08 tuning pass could write into `plugins/lz-tdd/skills/lz-refactor/SKILL.md`; would be re-scanned (ASCII-only + email allowlist-inversion) at that point. | NOT triggered -- both D-07 bars met, D-08 not applied, zero writes into `plugins/` (git-verified). | Any future D-08 tuning pass on a demonstrated soft-bar miss. |
| T-11-SC | Package installs (npm/pip/cargo) could introduce tampered dependencies. | NOT triggered -- vendored harness reused; no manifest churn (git-verified); Node stdlib + existing venv only. | Any future `npm/pip/cargo install` in this workspace. |

## Unregistered Flags

None. No SUMMARY carries a `## Threat Flags` section. The `## Threat Surface`
note in `11-02-SUMMARY.md` references only already-registered threat IDs
(T-11-03, T-11-04, T-11-SC) from the per-plan threat models, all reported
mitigated; no new unmapped attack surface appeared during implementation.

## Result

3 of 3 threats resolved: 1 mitigated-and-CLOSED (T-11-07), 2 accepted-and-CLOSED
(T-11-08, T-11-SC). Open threats: 0. ASVS Level 1. No implementation gaps; no
escalation required.
