---
phase: 17
slug: assertion-design-stance-router-ts-vitest-mechanics
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-07-19
---

# Phase 17 -- Validation Strategy

> Per-phase validation contract for feedback sampling during execution. This is a
> Markdown skill-authoring phase; "tests" are the dev-only `lz-red-workspace` checkers
> plus `tsc --strict`, NOT a shipped runtime test suite. Source: 17-RESEARCH.md
> `## Validation Architecture`. Refined at `/gsd-validate-phase` by gsd-nyquist-auditor.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None shipped (Markdown-only skill). Dev-only gates: Node.js checkers + `tsc --strict` (typescript 6.0.3) + vitest 4.1.10 types under `.claude/skills/lz-red-workspace/` (never shipped). |
| **Config file** | `.claude/skills/lz-red-workspace/tsconfig.json` (`strict`, `noEmit`) |
| **Quick run command** | `npm --prefix .claude/skills/lz-red-workspace run check` (= `node tools/check-red-references.mjs`, extended in Wave 0) |
| **Full suite command** | `npm --prefix .claude/skills/lz-red-workspace run typecheck && npm --prefix .claude/skills/lz-red-workspace run check && node .claude/skills/lz-refactor-workspace/tools/check-hygiene.mjs` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run the Quick run command (fast content gate).
- **After every plan wave:** Run the Full suite command (content + tsc + hygiene).
- **Before `/gsd:verify-work`:** Full suite GREEN + skill-reviewer PASS (>= 1 unbiased) + `claude plugin validate .` exit 0.
- **Max feedback latency:** ~10 seconds.

---

## Per-Requirement Verification Map

| Req ID | Behavior | Test type | Automated signal | Wave 0 |
|--------|----------|-----------|------------------|--------|
| ASRT-01 | Four pillars (resistance-to-refactoring load-bearing) + F.I.R.S.T. in assertions slice | content-gate + tsc + oracle | `check-red-references` tokens on `test-structure-and-assertions.md` + `run typecheck` + oracle-reviewer PASS (F.I.R.S.T.) + no-verbatim | EXTEND |
| ASRT-02 | Output/state/communication selection tied to the router | content-gate | `check-red-references` selection tokens in assertions slice + each leaf's assert-rule token | EXTEND |
| ASRT-03 | Metz matrix assert-vs-mock rule (expect-to-send only for outgoing command) | content-gate + tsc + oracle | `check-red-references` cell tokens on `message-matrix.md` + fence + oracle-reviewer PASS (owned 99 Bottles) + no-verbatim | EXTEND |
| RTR-01 | testing-stance README route table + 3 leaves; Feathers cross-link not copy | content-gate | `check-red-references` entries for README + 3 leaves + `refactoring-without-tests.md` cross-link-presence guard | EXTEND |
| RTR-03 | Listen-to-the-tests routes to core/seam; GOOS counterpoint only | content-gate | `check-red-references` listen-to-the-tests + GOOS-counterpoint tokens on `anti-patterns.md` | EXTEND |
| VIT-01 | it.todo / test.each / vi.* restraint / watch mapped to RED + ADV forward-pointer | content-gate + tsc | `check-red-references` mechanic tokens + ADV pointer token on `vitest-typescript-mechanics.md` + fence | EXTEND |
| VIT-02 | TS+Vitest examples throughout; every fence tsc-strict clean | tsc | `run typecheck` -> `extract-samples` GREEN over all extracted modules | Exists (no change) |
| ANTI-01 | Six named anti-patterns + observable-behavior fix (incl. Cooper) | content-gate + oracle | `check-red-references` six anti-pattern-name tokens on `anti-patterns.md` + oracle-reviewer PASS (Cooper owned) | EXTEND |
| ANTI-02 | Test Desiderata tradeoff lens in "heuristic not law" voice | content-gate | `check-red-references` Test-Desiderata + tradeoff/heuristic tokens on `anti-patterns.md` | EXTEND |

Global gates (every requirement): `extract-samples` GREEN (every fence `tsc --strict --noEmit` clean);
`check-hygiene` GREEN (ASCII-only, work-email allowlist-inversion, no-verbatim >=120-char run) across the
lz-red tree; no `## Sources (placeholder)` scaffold leaks; Phase-18 co-edit deferral markers REMAIN (D-15);
owned surfaces additionally clear oracle-reviewer converge-to-clean.

---

## Wave 0 Requirements

- [ ] EXTEND `.claude/skills/lz-red-workspace/tools/check-red-references.mjs`: add the six Phase-17 file
      entries; flip the `test-structure-and-assertions.md` deferral guard to ASRT content tokens; add a
      per-file `requireFence` flag; add the `seams-and-legacy.md` cross-link-presence guard; add Phase-18
      deferral guards for any co-edited insertion points. This IS the instrument-first Wave-0 RED baseline.
- [ ] No framework install -- the workspace already pins `typescript` + `vitest`.
- [ ] No change to `extract-samples.mjs` or `check-hygiene.mjs` (they auto-cover new Phase-17 files).

*If none: "Existing infrastructure covers all phase requirements." (Not the case here -- the instrument extension is the RED baseline.)*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Own-words fidelity of owned surfaces (Metz matrix, F.I.R.S.T., Cooper) | ASRT-01/03, ANTI-01 | Copyright/DST-04 judgment is not machine-decidable | oracle-reviewer converge-to-clean (3-round cap) + deterministic no-verbatim scan |
| Assertion-style-to-stance aptness | ASRT-02 | Semantic mapping, not a token match | skill-reviewer PASS (>= 1 unbiased from-scratch) |

---

## Validation Sign-Off

- [ ] All requirements have an automated signal or a Wave 0 dependency
- [ ] Sampling continuity: no 3 consecutive tasks without an automated content-gate/tsc signal
- [ ] Wave 0 covers the instrument extension (the RED baseline)
- [ ] No watch-mode flags in any automated command
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter (flipped at validate-phase)

**Approval:** pending
