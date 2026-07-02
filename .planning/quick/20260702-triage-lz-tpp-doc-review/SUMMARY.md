---
status: complete
completed: 2026-07-02
applied: [1, 2, 4]
deferred: [3, 5]
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

## Deferred -- awaiting user decision (trap quadrant: shipped content / stated project value)

- **#3** Provenance trim of `transformations.md`. Report's "60% meta" is overstated: FibTPP
  revisions (`:140-166`) are the ordering rationale Reference mode cites; secondary-drift
  (`:168-178`) is an operational guard; Sources (`:209-226`) is the project's faithful-citation
  value. Only the production-note blockquote (`:3-13`) and NDC-transcript reconciliation
  (`:180-207`) are true audit-trail. Recommendation: minimal trim (move those two to
  `.planning/`), NOT the aggressive cut. Held for user.
- **#5** Keep vs gitignore `.planning/` (59 files, 83% of tracked repo). Not coupled to the
  #2/#3 leak (fixed independently). Gitignore stops future tracking only -- existing files stay
  in history unless separately scrubbed -- and breaks GSD shared state on clone. Recommendation:
  keep committed. Held for user.
