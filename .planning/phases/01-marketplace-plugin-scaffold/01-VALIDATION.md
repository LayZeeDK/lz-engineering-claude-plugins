---
phase: 1
slug: marketplace-plugin-scaffold
status: validated
nyquist_compliant: true
wave_0_complete: true
created: 2026-07-02
---

# Phase 1 - Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> This phase has NO unit-test framework and NO build step (D-12) -- pure JSON + Markdown.
> The Nyquist "test runner" is the `claude` CLI validation gate plus the plugin-dev
> `plugin-validator` agent. That is the appropriate and sufficient sampling instrument
> for a manifest scaffold. Status markers are ASCII per repo convention (no emoji).

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | `claude plugin validate` (first-party CLI, verified 2.1.198) + plugin-dev `plugin-validator` agent |
| **Config file** | none -- manifests self-validate against the CLI's internal schema |
| **Quick run command** | `claude plugin validate .` |
| **Full suite command** | `claude plugin validate .` then `claude plugin validate . --strict`, then the local `claude plugin marketplace add . ; list ; remove` loop |
| **Estimated runtime** | ~5-15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `claude plugin validate .` (must be error-free).
- **Phase gate (after all files exist):** `claude plugin validate . --strict` clean + local marketplace add/list/remove loop succeeds + plugin-dev `plugin-validator` agent returns no findings.
- **Before `/gsd:verify-work`:** Full suite must be clean.
- **Max feedback latency:** ~15 seconds.
- **Ordering constraint:** Do NOT validate until BOTH `plugins/lz-tdd/.claude-plugin/plugin.json` AND `plugins/lz-tdd/skills/lz-tpp/SKILL.md` exist, or `source` resolution and `skills/` auto-discovery fail. Since one plan creates all four files, the rule is: create all, then validate once.

---

## Per-Task Verification Map

| Success Criterion | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|-------------------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 1. validate + plugin-dev validator report no errors | MKT-03 | -- | N/A | CLI | `claude plugin validate .` exits 0; `claude plugin validate . --strict` clean; plugin-validator agent no findings | yes | green |
| 2. Marketplace resolves + lists `lz-tdd` via `./plugins/lz-tdd` (LOCAL proxy) | MKT-01 | -- | N/A | CLI | `claude plugin marketplace add .` succeeds; `marketplace list` shows `lz-engineering-claude-plugins`; `plugin list` surfaces `lz-tdd`; then `marketplace remove lz-engineering-claude-plugins` | yes | green |
| 3. `version 0.0.1` in plugin.json ONLY, absent from marketplace entry | MKT-05 | -- | N/A | source assertion | `git grep -n '"version"'` shows version in plugin.json only; `validate . --strict` emits no version-mask warning | yes | green |
| 4. Second skill/plugin addable by new dirs only | MKT-04 | -- | N/A | source assertion | plugin.json has NO `skills`/`commands` path fields; one marketplace entry per plugin (inspection) | yes | green |
| 5. `.gitignore` present + valid placeholder SKILL.md frontmatter; repo commits clean | DIST-04 | -- | N/A | source assertion | `.gitignore` at root, does NOT list `.planning/`; SKILL.md has valid `name`+`description` frontmatter (via `validate .`); `git status` clean after commit | yes | green |
| (cross-cutting) JSON well-formedness | MKT-01/MKT-02 | -- | N/A | CLI | both manifests parse as strict JSON (validate fails fast on comments/trailing commas) | yes | green |
| (hygiene) public gmail contact only; ASCII-only content | DIST-04 | public-repo hygiene | only the public gmail appears; no work email anywhere; `->`/`--` not Unicode | source assertion | allowlist check: `rg -uNo -e '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]+' .claude-plugin plugins .gitignore \| rg -v 'larsbrinknielsen@gmail.com'` returns nothing (the only email is the public gmail; the work-email literal is never written into a committed file); all committed files ASCII | yes | green |

*Status: pending / green / red / flaky*

---

## Wave 0 Requirements

- None. There is no test framework to install (D-12 explicitly excludes npm / build tooling).
  The `claude` CLI gate is already present (2.1.198). No `conftest` / fixtures apply.

*Existing infrastructure (the `claude` CLI validation gate) covers all phase requirements.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Remote `/plugin marketplace add LayZeeDK/lz-engineering-claude-plugins` resolves | MKT-01 (remote) | DEFERRED to ship-time (D-13) -- the GitHub repo does not exist yet and the physical rename happens outside an active session | After the ship-time rename + push, run `/plugin marketplace add LayZeeDK/lz-engineering-claude-plugins` on a clean environment and confirm `lz-tdd` lists. NOT claimable in Phase 1. |

*All Phase-1-scoped behaviors have automated verification via the `claude` CLI gate. Only the deferred remote-resolution behavior is manual/ship-time.*

---

## Validation Audit 2026-07-02

| Metric | Count |
|--------|-------|
| Gaps found | 0 |
| Resolved | 0 |
| Escalated (manual-only) | 1 (remote install resolution -- ship-time, D-13) |

State A audit. No code-testable gaps: this phase ships only static JSON + Markdown (D-12), so the
Nyquist sampling instrument is the `claude plugin validate` CLI gate + the local marketplace
add/list/remove loop, not a unit-test framework. Every success criterion in the Per-Task
Verification Map ran GREEN during execution and independent phase verification (all executed, not
claimed). Wave 0 has no gaps (no framework to install). No test files were generated -- generating
unit tests for static manifests would violate the phase's scope fence (D-12) and there is no runtime
behavior to exercise. `nyquist_compliant` and `wave_0_complete` set true.

---

## Validation Sign-Off

- [x] All success criteria have an automated `claude plugin validate` / CLI / source-assertion verify
- [x] Sampling continuity: single-plan phase; validate runs after all four files exist
- [x] Wave 0 covers all MISSING references (none -- no framework needed)
- [x] No watch-mode flags
- [x] Feedback latency < 15s
- [x] `nyquist_compliant: true` set in frontmatter (flipped post-execution by validate-phase)

**Approval:** validated 2026-07-02
