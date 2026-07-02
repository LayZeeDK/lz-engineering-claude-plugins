---
phase: 4
slug: distribution-hygiene
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-07-02
---

# Phase 4 - Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> This phase has no runtime code (pure docs + config). The review gates and
> hygiene guards ARE the tests.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | none (no runtime code) -- verification via first-party CLI gate + plugin-dev agents + `git grep` guards |
| **Config file** | none |
| **Quick run command** | `claude plugin validate . --strict` |
| **Full suite command** | ASCII gate + work-email guard + `claude plugin validate . --strict` + `plugin-validator` agent + `skill-reviewer` agent |
| **Estimated runtime** | ~15 seconds (scriptable gates); agents add interactive review time |

---

## Sampling Rate

- **After every task commit:** Run the scriptable guards -- ASCII gate + work-email guard:
  - `git grep -qP '[^\x00-\x7F]' -- 'plugins/' '.claude-plugin/' 'README.md' 'LICENSE'` (rc=1 = PASS/clean)
  - `git grep -qE '@consensus\.dk'` (rc=1 = absent = PASS)
- **After every plan wave:** Run `claude plugin validate . --strict` (exit 0 = PASS) + both plugin-dev agents.
- **Before `/gsd:verify-work`:** Full suite must be green; all agent findings triaged per CONTEXT D-06.
- **Max feedback latency:** ~15 seconds for the scriptable gates.

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 04-01 (README) | 01 | 1 | DIST-01 | -- | N/A | doc-presence | `git grep -nF '/plugin marketplace add LayZeeDK/lz-engineering-claude-plugins' -- README.md` (+ install + `/lz-tdd:lz-tpp` strings) | W0 | [ ] pending |
| 04-01 (LICENSE) | 01 | 1 | DIST-02 | T-04 info-disclosure | Work email absent; public gmail present | file + guard | LICENSE exists + `git grep -nE 'larsbrinknielsen@gmail\.com' -- LICENSE README.md` present + `git grep -qE '@consensus\.dk'` rc=1 (absent) | W0 | [ ] pending |
| 04-01 (review) | 01 | 1 | DIST-03 | path-traversal / info-disclosure | Manifests structurally valid; no secrets; ASCII-only shippable surface | gate + agents | `claude plugin validate . --strict` (exit 0) + ASCII gate rc=1 + `plugin-validator` + `skill-reviewer` reports triaged per D-06 | yes (CLI green now) | [ ] pending |

*Status: [ ] pending - [x] green - [!] red - [~] flaky*
*File Exists: yes = exists - W0 = Wave 0 creates it*

---

## Wave 0 Requirements

- [ ] `README.md` (root) -- covers DIST-01 (does not exist yet)
- [ ] `LICENSE` (root, verbatim MIT + `Copyright (c) 2026 Lars Gyrup Brink Nielsen`) -- covers DIST-02 (does not exist yet)
- [x] Redact the work-email literal in `.planning/phases/04-distribution-hygiene/04-CONTEXT.md` and `04-DISCUSSION-LOG.md` so the DIST-02 full-tree guard passes truthfully (Pitfall 1 / Open Q1) -- DONE during planning (working tree + unpushed commit `3c313a9` rewritten; verified `git grep -qE '@consensus\.dk'` rc=1)
- No test-framework install needed (no runtime code).

*Note: the pre-existing work-email exposure in the PUBLIC history of Phase-1 commits (`5f46fee`, `79b1db0`, `43ee129`, `009060c`, all ancestors of `origin/main`) is OUT OF SCOPE for this phase -- it requires rewriting/force-pushing public history and is a separate, user-gated decision. History scrubbing is out of scope unless explicitly requested (RESEARCH Open Q1).*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| `plugin-validator` agent report | DIST-03 | plugin-dev subagent, no programmatic exit code | In a session with `plugin-dev` installed, invoke the plugin-validator agent on the plugin; expect no critical/major structural/security findings (README/LICENSE-at-plugin-root warnings are by-design per Pitfall 5) |
| `skill-reviewer` agent report | DIST-03 | plugin-dev subagent, no programmatic exit code | Invoke the skill-reviewer agent on `lz-tpp`; RECORD-and-DEFER the predictable 750-char description + 578-word body findings to Phase 5 per D-06 (Pitfall 4); do NOT act on them |

---

## Validation Sign-Off

- [ ] All tasks have an automated guard/gate or a Wave 0 dependency
- [ ] Sampling continuity: no 3 consecutive tasks without automated verification
- [ ] Wave 0 covers all MISSING references (README, LICENSE, work-email redaction)
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s for scriptable gates
- [ ] `nyquist_compliant: true` set in frontmatter (after execution + gsd-validate-phase)

**Approval:** pending
