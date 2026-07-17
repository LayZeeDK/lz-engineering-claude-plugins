# 14-05 SUMMARY -- Head-to-head grading + verdict

**Plan:** 14-05 | **Wave:** 2 | **Status:** complete
**Completed:** 2026-07-15

## What shipped

Graded the Phase-14 head-to-head (lz-refactor recommend vs mattpocock code-review) across all seven D-04
dimensions and wrote the terminal comparison record `14-RESULTS.md` with an empirical verdict.

Artifacts:
- `grading/head-to-head/mechanical.json` -- MECHANICAL dims (token/cost, tool histogram + sub-agent spawn
  count, named-refactoring lift, Pass@k) via the self-checked `tabulate-mechanical.mjs`, restricted to the
  3 phase-14 cells (18 runs).
- `grading/head-to-head/claims.json` -- normalized union of named smells/refactorings/patterns per (cell,
  arm), built in main context from the 18 `answer.md` (DST-04: no `.oracle/` read).
- `grading/head-to-head/fidelity.json` -- per-claim book-authenticity + idiom/pattern verdicts, graded by
  the `oracle` agent against `.oracle/` (Fowler/Kerievsky/GoF), verdicts in the agent's own words.
- `grading/head-to-head/summary.json` -- filled rollup (mechanical + graded, per row).
- `14-RESULTS.md` -- 7 dimension tables (cell x arm) + per-table findings + Caveats + Verdict.

## Grading pipeline (DST-04 respected)

1. Mechanical: `tabulate-mechanical.mjs --cell cr-emb --cell cr-rlu --cell cr-gr` (`--selfcheck` exits 0).
2. Claims: a reader agent normalized the 18 `answer.md` + judged output-quality / over-under-engineering
   against `targets.json.judgment` (reads OUR outputs + the code under review; never `.oracle/`).
3. Book/idiom fidelity: the `oracle` agent graded the deduplicated claim set against `.oracle/`
   (confidence 88/100); main context never read book prose.
4. Unbiased from-scratch reviewer (T-14-09): **PASS** -- all tables match the JSON records exactly, verdict
   not overclaimed, code_review's off-axis value (regex bug + Spec-axis faithfulness) verified real by
   spot-checking answer.md, disclosures symmetric. One non-blocking note applied: surfaced the regex bug's
   "1 of 3 runs" frequency in 14-RESULTS.md for symmetric disclosure.

## Verdict (empirical, not a pre-assumed win)

The two skills do differently-shaped work. lz-refactor is the book-grounded refactoring specialist: named
book-authentic Fowler/Kerievsky refactorings (lift 11-12 vs 0), reached the FP axis (Replace Loop with
Pipeline) where code_review's 12-smell baseline structurally could not, made explicit net-cost
APPLY/DECLINE proportionality calls (resisting the over-engineering traps), at ~30-45% lower cost with 0
sub-agents. code_review is a broader general reviewer with distinct off-axis value lz-refactor did not
attempt: it named the same smells authentically, caught a real correctness bug (unescaped-dot regex, 1/3
runs), and verified spec/behavioral faithfulness. The ~139-vs-12 vocabulary breadth is the headline on the
idiom/pattern axis -- expected, a defect of neither. Shared blind spot: both missed T4 (`groupImports`) in
every cr-rlu run.

## Caveats carried into the record

- D-02 whole-file-diff (code_review off its incremental grain) + D-03 Spec-axis asymmetry (skips on nx,
  engages on the kata) -- both stated in 14-RESULTS.md.
- A1 token headline = `total_cost_usd`/`model_usage` (rolls up sub-agents); A4 mattpocock plugin context
  inflation.
- Book-fidelity graded on a deduplicated vocabulary list; smell-to-construct attachment corroborated by the
  claim-normalizer, not re-verified by the oracle.

## Hygiene

- `14-RESULTS.md` + all grading JSON ASCII-only; allowlist-inversion email scan clean (no work email;
  committer = approved public gmail).
- Both borrowed repos `git status` clean, no `review-*` residue.
