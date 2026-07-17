# 08-02 Summary: Ch.6 Creation leaves (Kerievsky)

**Plan:** 08-02 | **Wave:** 2 | **Status:** complete
**Requirements:** KRV-01, KRV-02, KRV-04 (Ch.6 Creation slice)

## What was built

All 6 Ch.6 Creation pattern-directed refactorings authored as per-refactoring leaf files under
`plugins/lz-tdd/skills/lz-refactor/references/kerievsky-catalog/`, each mirroring the LOCKED Fowler
leaf contract (Use when / Motivation / Mechanics / Example / Watch for) plus the 3 Kerievsky fields
(`Composed Fowler primitive(s):`, `Direction:`, `GoF pattern:`). Authored BLIND via the clean-room
loop and oracle-converged.

## Confirmed Ch.6 membership (for the 08-06 check-kerievsky NAMES reconciliation)

All 6 authored H1 names/slugs match the CITED canonical names -- **no oracle name/slug corrections**:

| Refactoring (H1) | slug | Direction | GoF pattern (settled) |
|---|---|---|---|
| Replace Constructors with Creation Methods | replace-constructors-with-creation-methods | Towards | Creation Method (Kerievsky's own; non-GoF) |
| Move Creation Knowledge to Factory | move-creation-knowledge-to-factory | Towards | Factory (corrected from Abstract Factory in R1) |
| Encapsulate Classes with Factory | encapsulate-classes-with-factory | Towards | Factory (corrected from Abstract Factory in R1) |
| Introduce Polymorphic Creation with Factory Method | introduce-polymorphic-creation-with-factory-method | Towards | Factory Method |
| Encapsulate Composite with Builder | encapsulate-composite-with-builder | **Away** (from Composite) | Builder |
| Inline Singleton | inline-singleton | **Away** (from Singleton) | Singleton |

2 of the 3 named de-patterning (Away) cases are in this chapter (Encapsulate Composite with Builder,
Inline Singleton), both `Direction: Away` with an explicit "away from <pattern>" callout.

## Oracle convergence (clean-room loop)

- **Round 1** (6 leaves, 1 oracle-reviewer call): 1 `pass` (Encapsulate Composite with Builder) + 5 `revise`.
- **Round 2** (5 revised leaves re-gated): all 5 `pass`. **=> 6/6 pass, 0 escalations.**
- No `too_close_to_source`, no `blocked`, no `error` in either round; every example behavior-preserving,
  in a domain unrelated to the source with original identifiers.
- R1 directives applied blind: delegating-constructor inline step + structural-extraction caveat
  (replace-constructors); collaborator-sprawl reframe + field-consolidation step + plain Factory
  (move-creation-knowledge); per-kind creation methods via extract-and-move + plain Factory
  (encapsulate-classes); hierarchy-duplication reframe + template-method/pull-up + dropped
  conditional-with-polymorphism (introduce-polymorphic-creation); absorb-into-owner-then-delete
  reconciled with injection + Inline Class primitive (inline-singleton).

## Task 2 (owner escalation checkpoint): NO-OP

No leaf failed to converge within the round cap and no GoF target was unresolvable, so no
AskUserQuestion owner escalation fired.

## Verification (deterministic layer, run before + after oracle gate)

- `extract-samples.mjs` (tsc --strict): GREEN -- 136 modules (12 new = 6 leaves x 2 examples), 0 skipped.
- `check-hygiene.mjs`: GREEN -- ASCII-only, no work-email, 0 no-verbatim WARN.
- All 6 leaves carry the 3 field labels; all composed-Fowler links resolve to real fowler-catalog leaves.
- `kerievsky-catalog/README.md` and all checker .mjs UNTOUCHED (README mirror + full check-kerievsky
  + crossrefs run at the 08-06 gate). No `.oracle/` file opened by the main context (ls for names only).

## Deviation: oracle-agent chunked-read hardening

While running this plan, the `oracle`/`oracle-reviewer` agents were found to silently truncate long
`.oracle/` chapters (Read tool ~25K-token cap; Ch.6/7/8 exceed it). Fixed both agent contracts to
ALWAYS chunk-read to EOF (length-agnostic). This deviates from the plan's "reuse the oracle agents
unchanged" note. Per the owner's standing rule ("all agent/skill instruction changes must undergo
agent review"), the change was reviewed by agents: firewall/DST-04 review = SAFE; correctness review
= CHANGES-NEEDED (token-vs-line-cap false-EOF hole) -> fixed (advance by actual lines returned, stop
on zero lines, modest window) -> re-review in progress. Committed separately from this plan's leaves.

## Files

- plugins/lz-tdd/skills/lz-refactor/references/kerievsky-catalog/replace-constructors-with-creation-methods.md
- plugins/lz-tdd/skills/lz-refactor/references/kerievsky-catalog/move-creation-knowledge-to-factory.md
- plugins/lz-tdd/skills/lz-refactor/references/kerievsky-catalog/encapsulate-classes-with-factory.md
- plugins/lz-tdd/skills/lz-refactor/references/kerievsky-catalog/introduce-polymorphic-creation-with-factory-method.md
- plugins/lz-tdd/skills/lz-refactor/references/kerievsky-catalog/encapsulate-composite-with-builder.md
- plugins/lz-tdd/skills/lz-refactor/references/kerievsky-catalog/inline-singleton.md
