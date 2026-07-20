---
phase: 19-distribution-hygiene
artifact: DST-04-ATTESTATION
requirement: DST-03
status: layer-1-and-layer-3-recorded; layer-2-orchestrator-pending
recorded: 2026-07-21
ascii_only: true
---

# Phase 19: DST-04 No-Verbatim Attestation (lz-red tree)

This artifact records the three-layer DST-04 (no verbatim book prose / talk
transcripts) result for the `lz-red` tree on the FINAL public-ship 0.0.3 tree,
per D-01 / D-02. An undocumented attestation is not an attestation; this file is
the durable record.

**Clean-room invariant (D-02):** the main authoring context NEVER reads `.oracle/`.
Every draft-vs-source comparison is forced through the read-only `oracle-reviewer`
subagent, which returns own-words `pass | revise | blocked` verdicts and never echoes
source prose. "Just diff the tree against the book" is impossible by construction.
This attestation quotes no `.oracle/` source text; it names sources (author + title)
as facts only.

## Layer 1 -- Deterministic no-verbatim gate (GREEN on the final tree)

The `check-hygiene.mjs` axis (c) no-verbatim gate covers the `lz-red` tree plus the
root prose (README.md / CHANGELOG.md) and re-ran GREEN on the final tree as part of
the Plan 19-03 Task 1 deterministic battery:

- `check-hygiene` axis (c) no-verbatim: 191 files clean, exit 0.
- (Same run: axis (a) ASCII 198 files clean; axis (b) work-email allowlist-inversion
  no non-allowlisted emails; both exit 0.)
- Full-tree email allowlist-inversion (independent of check-hygiene): the only genuine
  email-shaped token across the tracked tree is the approved public gmail; the six
  remaining tokens are benign `<pkg>@<version>-<DOC>.md` milestone filenames, not
  emails. True remainder empty.

This is the syntactic backstop. It runs in the normal battery because it never reads
book prose.

## Layer 2 -- Targeted clean-room re-sweep SCOPE (orchestrator-run; result pending)

The layer-3 DST-04 re-sweep re-confirms the handful of OWNED `lz-red` surfaces on the
final tree -- NOT the whole tree. It is an ORCHESTRATOR post-execution gate run through
the `oracle-reviewer` subagent AFTER the executor returns (the `gsd-executor` has no
Agent/Task tool). Per-invocation spec (RESEARCH Finding 4, D-13): agent = `oracle-reviewer`;
DRAFT input = only the shipped surface (not whole leaves); source scope = the book via
`index.md` (the reviewer resolves the file); rubric = the DST-04 near-verbatim axis only;
round cap = 3; batched-or-per-surface is the orchestrator's call. On any `revise`, the
owner rewords that surface BLIND from the reviewer's short directives and re-gates;
non-convergence escalates to the owner.

The four OWNED surfaces in scope:

| # | Owned surface | File(s) | Source lineage (fact-only) |
|---|---------------|---------|----------------------------|
| 1 | RCM Beck-lineage test-selection rows (running list, one small step, degenerate/starter, triangulation) + the F.I.R.S.T. block | `three-laws-and-test-selection.md` + `test-structure-and-assertions.md` | R.C. Martin, Clean Code Ch. 9 / Canon TDD lineage |
| 2 | Metz query/command message matrix | `testing-stance/message-matrix.md` | Sandi Metz, The Magic Tricks of Testing (message matrix) |
| 3 | Cooper over-mock / test-per-class anti-pattern | `anti-patterns.md` | Ian Cooper (talks) |
| 4 | RCM Three-Laws spine (Law 1 gates entry; Law 2 sizes the failing test; Law 3 = lz-tpp GREEN handoff) | `three-laws-and-test-selection.md` + the `SKILL.md` compact step-2 spine | R.C. Martin, Clean Code Ch. 9 (Three Laws of TDD) |

**Expected result:** all-pass (each surface already passed at authoring; the surfaces are
unchanged on the final tree -- 19-01 did not touch them). The orchestrator records the
all-pass verdict into this section on completion.

`<orchestrator-fill>` Layer-2 re-sweep verdict (per surface, oracle-reviewer): PENDING
-- to be recorded by the orchestrator after the executor returns. `</orchestrator-fill>`

## Layer 3 -- Standing owned-surface attestation (citations)

Every OWNED `lz-red` surface was individually `oracle-reviewer`-gated at authoring time.
These standing verdicts are cited as evidence for the surfaces the layer-2 re-sweep does
not need to re-open (it only re-confirms on the final tree). Citations by filename:

- **16-03-SUMMARY.md** (Phase 16 finalize gate) -- the RCM Beck-lineage test-selection
  rows + the F.I.R.S.T. seed. Dual-reviewer skill gate (>= 1 unbiased from-scratch);
  two DST-04 near-verbatim canon phrasings were reworded BLIND and the reworded RCM
  owned surfaces re-gated via `oracle-reviewer`: both `pass`, `too_close_to_source=false`,
  confidence 93 (raised from 78/85 -- the reword moved further from source while staying
  faithful). Surfaces in `three-laws-and-test-selection.md`, `test-structure-and-assertions.md`,
  `naming.md`.
- **17-06-SUMMARY.md** (Phase 17 finalize gate) + **17-VERIFICATION.md** -- the Clean Code
  F.I.R.S.T. baseline, the Metz query/command message matrix, and the Ian Cooper over-mock /
  test-per-class anti-pattern. 17-06 delivered the GREEN deterministic battery and handed the
  three owned surfaces to the orchestrator `oracle-reviewer`; 17-VERIFICATION.md (status:
  passed, 14/14) corroborates the `oracle-reviewer` PASS on all owned surfaces (Metz matrix,
  F.I.R.S.T., Cooper) with the no-verbatim scan GREEN, and the `skill-reviewer` PASS
  (>= 1 unbiased).
- **18-06-SUMMARY.md** (Phase 18 finalize gate) -- the RCM Three-Laws spine. `oracle-reviewer`
  PASS, confidence 93: Law 1 (no production code before a failing test) and Law 2 (only enough
  test to fail; not-compiling counts) confirmed faithfully backed as owned + oracle-verified,
  no tier downgrade; the Law-3-as-lz-tpp-handoff reframe correctly tagged lz-red orchestration
  (no-oracle), not falsely claimed owned; no verbatim / near-verbatim reproduction; main context
  never read `.oracle/`. The lz-red `skill-reviewer` PASS (8 properties) and the lz-tpp
  reverse-pointer unbiased review PASS are recorded in the same gate.

## No-oracle leaves -- OUTSIDE the DST-04 book-prose re-sweep axis

The following `lz-red` content was authored BLIND with no `.oracle/` read. It is NOT part
of the layer-2 book-prose re-sweep scope; it rests on the layer-1 deterministic gate (ASCII +
work-email allowlist-inversion + no-verbatim) plus the standing no-verbatim scan alone:

- `testing-stance/functional-core.md` (Bernhardt functional core / imperative shell)
- `testing-stance/seams-and-legacy.md` (Feathers seams + characterization; cross-linked to
  the lz-refactor `refactoring-without-tests.md`, not copied)
- `vitest-typescript-mechanics.md` (Vitest 4.x + TypeScript RED mechanics)
- `naming.md` (behavior-oriented test naming)
- the STR / AAA-GWT structure content in `test-structure-and-assertions.md` (the F.I.R.S.T.
  block in the same file IS an owned surface -- see Layer 2 #1; the AAA/GWT structure content
  is no-oracle)
- `principle-backing.md` (the no-oracle backing map)

These are no-oracle high-confidence core or cross-linked (not copied) content by construction,
so a book-prose re-sweep does not apply to them.

## Summary

- Layer 1 (deterministic): GREEN on the final tree (191 files no-verbatim, exit 0).
- Layer 2 (targeted re-sweep): scope = four owned surfaces; ORCHESTRATOR-run gate; expected
  all-pass; verdict recorded by the orchestrator on completion.
- Layer 3 (attestation): standing `oracle-reviewer` PASS verdicts cited from 16-03-SUMMARY.md,
  17-06-SUMMARY.md + 17-VERIFICATION.md, and 18-06-SUMMARY.md.
- No-oracle leaves: authored blind, no `.oracle/` read, outside the DST-04 book-prose axis.

---
*Phase: 19-distribution-hygiene*
*Recorded: 2026-07-21 (executor: layers 1 and 3 + layer-2 scope; orchestrator fills the layer-2 verdict)*
