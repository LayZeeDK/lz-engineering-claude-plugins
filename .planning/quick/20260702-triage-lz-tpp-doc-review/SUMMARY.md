---
status: complete
completed: 2026-07-02
applied: [1, 2, 3, 4, 5]
deferred: []
---

# Summary: Triage lz-tpp doc-quality review

Audited all 5 findings against the actual files. All factually accurate; two carried
nuance the report missed.

## Applied (3 findings, 3 atomic commits)

- **#1** `typescript-and-tco.md`: collapsed Pattern 3 (CPS) from a full two-fence TEACH
  treatment to the 1-2 sentence MENTION its own table (`:248-255`) promises. Removed ~44
  lines and the third `Thunk`/`Trampoline`/`Cont` redeclaration; key facts preserved (naked
  CPS overflows at ~10k; stack-safe only when trampolined; niche is already-CPS code).
- **#2** `transformations.md`: stripped `(D-03)` / `(D-06)` planning IDs from `:153` / `:204`.
  Verified these were the only two D-NN leaks in shipped content. Also removed the unshipped
  `.planning/.../ndc-2011-tpp-transcript.md` path leaked in the Sources block (`:223-224`) --
  same distribution-boundary defect, missed by the report.
- **#4** `SKILL.md`: deleted the duplicate standalone "TypeScript/JavaScript overlay" section
  (`:73-78`); grafted its one load-bearing clause ("a source-sanctioned heuristic, not a
  contradiction of the canonical list") into coach step 5. Detail pointer survives in the
  Reference material list.

## Decisions

- **#5 RESOLVED (2026-07-02): keep `.planning/` committed.** GSD shared state + convention;
  history already public; the leak was fixed by #2 independently. No file change required.
- **#3 RESOLVED (2026-07-02): aggressive trim** (user chose aggressive over the minimal
  recommendation, after reviewing a side-by-side preview). Moved the production-note
  blockquote, the original 12-item list, the FibTPP-revisions walkthrough, secondary-source
  drift, and the NDC-transcript reconciliation out of the shipped reference into
  `.planning/phases/02-tpp-source-distillation/transformations-provenance.md`. Shipped
  `transformations.md` dropped 224 -> 116 lines, keeping the coach-facing core (definitions,
  premise/mantra, hedges, 14-item list, notation, amended process) plus a cleaned Sources
  block (TPP + FibTPP entries only; NDC/secondary citations live in the companion). Fixed the
  dangling "see Provenance below" cross-ref and confirmed no `.planning/` path leaks into
  shipped content.
