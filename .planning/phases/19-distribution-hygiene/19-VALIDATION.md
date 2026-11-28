---
phase: 19
slug: distribution-hygiene
status: validated
nyquist_compliant: true
wave_0_complete: true
created: 2026-07-20
validated: 2026-07-21
---

# Phase 19 - Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> This is a docs + hygiene + regression-gate phase: `plugins/lz-tdd` ships only
> dependency-free Markdown/JSON that executes no code. There is no runtime test
> framework to scaffold. "Validation" here is the existing deterministic checker
> battery + first-party CLI + (for DST-02) two first-party agent gates whose PASS
> verdicts are inherently non-deterministic and are legitimately manual-only.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | node built-in check-*.mjs battery + tsc --strict extractor (dev-only workspaces); no runtime test framework in the shipped plugin |
| **Config file** | `.claude/skills/lz-refactor-workspace/package.json` (npm run check / typecheck) |
| **Quick run command** | `npm run check --prefix .claude/skills/lz-refactor-workspace` |
| **Full suite command** | `npm run check --prefix .claude/skills/lz-refactor-workspace && npm run typecheck --prefix .claude/skills/lz-refactor-workspace && claude plugin validate . --strict` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run the quick check battery (check-hygiene + check-red-references)
- **After every plan wave:** Run the full suite command
- **Before `/gsd:verify-work`:** Full suite must be green + `claude plugin validate . --strict` exit 0
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Secure/Correct Behavior | Test Type | Automated Command | Status |
|---------|------|------|-------------|-------------------------|-----------|-------------------|--------|
| 19-01 (D1-D5) | 01 | 1 | DST-01, DST-03 | plugin.json 0.0.3 + 3-skill description + RED keywords; marketplace 3-skill description, no `version` key; README documents lz-red (loop framing, link-only sources, references pointer); CHANGELOG `[lz-tdd@0.0.3]` entry above 0.0.2; all 4 edited files ASCII + gmail-only | content-guard + checker + CLI | `git grep` content assertions (version/keywords/section headings/link-ref) + `node .claude/skills/lz-refactor-workspace/tools/check-hygiene.mjs` + `claude plugin validate .` / `--strict` | green |
| 19-02 (GA-7 sweep) | 02 | 1 | DST-03 | encode-the-forbidden-value anti-pattern removed from all 19 tracked planning docs carrying it; rewritten to non-encoding allowlist-inversion form; docs-only diff, no shipped-tree file touched | content-guard (allowlist-inversion) | full-tree email-token enumeration minus approved gmail (`git grep -hIoE '<email-regex>' -- . \| sort -u`); `git status --short` scope check | green |
| 19-03 (D1-D5) | 03 | 2 | DST-02, DST-03 | full deterministic finalize battery GREEN (both workspace check+typecheck batteries); `claude plugin validate .` plain + strict exit 0; full-tree email allowlist-inversion true remainder empty; DST-04 3-layer attestation recorded; 3 orchestrator agent gates (plugin-validator, skill-reviewer, DST-04 re-sweep) routed from their dedicated agents | full battery + CLI + orchestrator agent gates | `npm --prefix .claude/skills/lz-red-workspace run check && run typecheck && npm --prefix .claude/skills/lz-refactor-workspace run check && run typecheck && claude plugin validate . --strict` (+ plugin-validator / skill-reviewer PASS + DST-04 re-sweep, all manual, see below) | green |

*Independently re-run GREEN by gsd-nyquist-auditor 2026-07-21 (not just trusted from SUMMARYs):*
*- `npm --prefix .claude/skills/lz-refactor-workspace run check` -- all 10 checkers GREEN incl. check-hygiene (198 files ASCII-clean, 0 non-allowlisted emails, 191 files no-verbatim-clean), exit 0.*
*- `npm --prefix .claude/skills/lz-refactor-workspace run typecheck` -- 259 modules tsc --strict clean, 0 skipped, exit 0.*
*- `npm --prefix .claude/skills/lz-red-workspace run check` -- RED-REFS GREEN 11/11 surfaces, exit 0.*
*- `npm --prefix .claude/skills/lz-red-workspace run typecheck` -- 8 modules tsc --strict clean, 0 skipped, exit 0.*
*- `claude plugin validate . --strict` -- "Validation passed", exit 0 (CLI 2.1.216).*
*- Independent full-tree email allowlist-inversion (`git grep -hIoE` over the email regex): 7 unique tokens = the 1 approved gmail + 6 benign `<pkg>@<version>-<DOC>.md` milestone filenames; true remainder after excluding both = empty. Matches 19-03-SUMMARY.md's reported result exactly.*

---

## Wave 0 Requirements

- Existing infrastructure covers all phase requirements. check-hygiene.mjs already walks the lz-red tree + root README/CHANGELOG + both manifests (added 16-01); check-red-references + the tsc --strict extractor already GREEN. No new instrument was needed (Phase 19 is a docs + regression-gate + one-scoped-fix phase) -- confirmed after execution: no gap required building a new instrument.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions | Result |
|----------|-------------|------------|-------------------|--------|
| plugin-validator agent PASS on the lz-tdd plugin | DST-02 | First-party agent judgment (structure/manifest/security/path-traversal), not a deterministic script | Spawn `plugin-dev` `plugin-validator` on the final tree | PASS -- 0 critical, 0 warnings (19-GATE-RESULTS.md Gate 1, orchestrator-spawned, verdict routed not self-certified) |
| skill-reviewer agent PASS on lz-red | DST-02 | First-party agent judgment (progressive disclosure, frontmatter, coach quality), not a deterministic script | Spawn `plugin-dev` `skill-reviewer` on lz-red SKILL.md + all 10 references | PASS -- no ship-blockers; 1 cosmetic suggestion + 2 Phase-20 DEFER items recorded, not actioned (19-GATE-RESULTS.md Gate 2) |
| DST-04 targeted clean-room re-sweep over the 4 owned surfaces | DST-03 | Book-prose fidelity vs `.oracle/` is an oracle-reviewer judgment, not a token match; source lives in a git-ignored, read-only-by-oracle-reviewer directory | Orchestrator re-confirms the 4 owned surfaces are byte-unchanged since their own passing oracle-reviewer gates (16-03/17-06+17-VERIFICATION/18-06), else re-spawns oracle-reviewer | DISCHARGED -- `git diff --stat a9e6099..HEAD -- plugins/lz-tdd/skills/lz-red/` empty (deterministic, re-confirmable); standing PASSes apply byte-for-byte; corroborated by Gates 1+2 (19-GATE-RESULTS.md Gate 3) |

*README/CHANGELOG/manifest factual accuracy is checked by the deterministic gates + validate; the agent gates above are the non-deterministic PASS requirement. All three routed from their dedicated agents into the committed `19-GATE-RESULTS.md` (commit d4751e0) -- not self-certified inline by the orchestrator.*

---

## Validation Audit 2026-07-21

| Metric | Count |
|--------|-------|
| Requirements audited | 3 (DST-01, DST-02, DST-03) |
| Covered (automated deterministic) | 3 |
| Covered (manual-only agent gate, evidence recorded) | 2 (plugin-validator + skill-reviewer PASS, both part of DST-02) |
| Gaps found | 0 |
| Tests generated | 0 (docs/hygiene phase; the checker battery + first-party CLI is the test suite and already exists + passes) |
| Escalated | 0 |

No MISSING gaps: every requirement maps to existing automated verification (check-hygiene.mjs's
3 axes, both workspaces' check+typecheck batteries, `claude plugin validate .`/`--strict`), all
independently re-run GREEN by this audit (not merely accepted from SUMMARYs), plus the two
inherently-non-deterministic DST-02 agent-gate PASSes recorded with committed, spot-checked
evidence in `19-GATE-RESULTS.md`. Per the workflow's no-gaps path, no test files were generated --
there is no code in the shipped `plugins/lz-tdd` tree to unit-test, and inventing a runtime test
framework for prose/manifests would be the wrong instrument for this phase.

---

## Validation Sign-Off

- [x] All tasks have automated verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references (none needed; existing instrument sufficient)
- [x] No watch-mode flags
- [x] Feedback latency < 30s
- [x] `nyquist_compliant: true` set in frontmatter (by validate-phase)

**Approval:** validated 2026-07-21
