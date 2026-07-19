# Phase 17: Assertion Design, Stance Router & TS/Vitest Mechanics - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md -- this log preserves the alternatives considered.

**Date:** 2026-07-19
**Phase:** 17-assertion-design-stance-router-ts-vitest-mechanics
**Mode:** --analyze --auto --chain (autonomous single pass; recommended option auto-locked per
gray area; trade-off tables logged here for the audit trail). Every area was rated IMPACT x
CONFIDENCE per the trap-quadrant rule; none was HIGH-impact + NOT-high-confidence, so none was
escalated to an interactive question. Determined areas (source tiers, the assertion-style-to-stance
mapping, the clean-room loop) were locked directly from the ROADMAP Success Criteria + the
Phase-15 stubs + Phase-16 / 0.0.2 precedent; the two genuine judgment calls are logged with full
trade-off tables below.
**Areas auto-resolved:** Source access tiers, Assertion design (ASRT), Stance router (RTR),
Vitest/TS mechanics (VIT), Anti-patterns & Test Desiderata (ANTI), Validation & co-edit boundary.

---

## Source access tiers & clean-room

| Option | Description | Selected |
|--------|-------------|----------|
| Mirror Phase 16 tiers (owned = oracle-gated; unowned = no-oracle) | 99 Bottles / Clean Code F.I.R.S.T. / Cooper talks oracle-gated; Khorikov / Bernhardt / Feathers / GOOS / Beck authored blind no-oracle; DHH banned | [selected] |
| Treat all Phase-17 sources as no-oracle | Skip the oracle loop entirely | |

**Choice:** Mirror the Phase-16 / 0.0.2 tiers exactly (D-01, D-02).
**Notes:** The Phase-15 stubs already tag each source's tier and the `.oracle/` set was provisioned
in Phase 16; HIGH confidence, HIGH impact but fully evidence-backed -> auto-locked, not a trap.

---

## Assertion design (ASRT)

| Option | Description | Selected |
|--------|-------------|----------|
| Four pillars (resistance-to-refactoring load-bearing) + F.I.R.S.T., style tied to stance | Khorikov blind (no-oracle); F.I.R.S.T. owned (Clean Code Ch.9); output/state/communication selection maps to functional-core/Metz/Feathers | [selected] |
| Assertion advice without the stance tie | Simpler, but breaks ASRT-02's differentiator | |

**Choice:** Four pillars + F.I.R.S.T., assertion-style selection tied to the stance (D-03, D-04, D-05).
**Notes:** The mapping is written verbatim in ROADMAP Success Criterion 1; the Metz matrix (owned)
carries ASRT-03. HIGH confidence.

---

## Testing-stance router (RTR)

| Option | Description | Selected |
|--------|-------------|----------|
| Author index navigation half + 3 leaves; Feathers cross-links lz-refactor | README = detection signals + route table (Phase 17); SKILL.md wiring = RTR-02 Phase 18; seams leaf points at refactoring-without-tests.md, not copy | [selected] |
| Copy the Feathers no-tests techniques into the leaf | Self-contained leaf, but duplicates shipped lz-refactor content | |

**Choice:** Index half + 3 leaves; Feathers CROSS-LINKS (D-06); listen-to-the-tests meta-rule in
anti-patterns (D-07).
**Notes:** RTR-01 explicitly says "cross-linked ... not copied"; the target file is verified present.
HIGH confidence.

---

## Vitest / TypeScript mechanics (VIT) -- judgment call 1

| Option | Description | Selected |
|--------|-------------|----------|
| Named VIT-01 surface only + brief deferred pointers | it.todo / test.each / vi.* / watch fully, tsc-strict; type-level + fast-check forward-pointed to ADV-01/ADV-02; no fast-check dep | [selected] |
| Author type-level + property-based leaves now | One-stop mechanics doc, but pulls in explicitly-deferred future requirements + a fast-check dependency | |

**Choice:** Named surface only; type-level and property-based are brief "deferred to ADV-01/ADV-02"
pointers (D-09).
**Notes:** ADV-01 / ADV-02 are explicit Future Requirements (post-0.0.3); Markdown-only tree; YAGNI.
Medium impact, evidence-backed -> auto-locked. Fail-for-the-right-reason appears here only as a
Vitest mechanic; the LAW-02 spine is Phase 18.

---

## VIT-02 "examples throughout SKILL.md" -- judgment call 2

| Option | Description | Selected |
|--------|-------------|----------|
| Examples throughout the references; SKILL.md example co-owned by Phase 18 | Phase 17 does not edit the SKILL.md body (co-edit rule + lean-router SKL-02); the SKILL.md example lands with the Phase-18 coach procedure | [selected] |
| Add TS examples to the SKILL.md body now | Literal "throughout SKILL.md" in 17, but bloats the lean router before its coach body exists and forces a double-edit | |

**Choice:** References in 17; SKILL.md example with the Phase-18 coach procedure (D-10).
**Notes:** VIT-02 closes as satisfied-by-references in 17; medium impact, evidence-backed ->
auto-locked.

---

## Anti-patterns & Test Desiderata (ANTI)

| Option | Description | Selected |
|--------|-------------|----------|
| Full anti-pattern leaf + Test Desiderata tradeoff lens | Cooper over-mock/test-per-class (owned) + private-method/multi-assert/pass-immediately/snapshot/slow-order (no-oracle); Beck Desiderata as tradeoffs, "heuristic not law" voice | [selected] |
| Anti-patterns without the Desiderata lens | Misses ANTI-02 | |

**Choice:** Full anti-pattern leaf + Test Desiderata lens (D-11, D-12).
**Notes:** GOOS counterpoint-only; DHH never cited. HIGH confidence.

---

## Validation & co-edit boundary

| Option | Description | Selected |
|--------|-------------|----------|
| Extend the Phase-16 lz-red-workspace instrument; co-edit stubs, no SKILL.md body edit | Turn the Phase-17 RED guards GREEN; tsc --strict + no-verbatim mandatory; leave Phase-18 markers intact | [selected] |
| Stand up a new sibling checker | Redundant with the existing instrument | |

**Choice:** Extend `check-red-references.mjs`; co-edit-don't-split; no SKILL.md body edit (D-13, D-14, D-15).
**Notes:** Instrument-first Nyquist precedent; no build dep in `plugins/lz-tdd`. Planner's call on
the exact wave-0 baseline.

---

## Claude's Discretion

- Exact own-words wording of each pillar / matrix cell / stance signal / anti-pattern (executor
  drafts; oracle-reviewer gates the owned surfaces only).
- Exact minimal TS/Vitest example per reference, within D-08/D-09/VIT-02 and tsc --strict.
- Reuse/extend the Phase-16 instrument vs a sibling check (planner's call).
- Plan / wave breakdown across the six stubs (planner's call).

## Deferred Ideas

- LAW spine + fail-for-the-right-reason procedure + classify-first/seam + RTR-02 SKILL.md wiring -> Phase 18.
- Type-level RED leaf -> ADV-01 (post-0.0.3); property-based RED leaf -> ADV-02 (post-0.0.3).
- plugin.json 0.0.3 + README + CHANGELOG + validators -> Phase 19.
- Eval workspace + trigger/behavior evals + description tuning -> Phase 20.
