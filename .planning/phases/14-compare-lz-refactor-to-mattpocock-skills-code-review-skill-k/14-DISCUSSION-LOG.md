# Phase 14: Compare lz-refactor to mattpocock-skills code-review skill (kata + nx) - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md -- this log preserves the alternatives considered.

**Date:** 2026-07-15
**Phase:** 14-compare-lz-refactor-to-mattpocock-skills-code-review-skill-k
**Mode:** `--analyze --auto --chain` (autonomous single pass; recommended option auto-selected per area;
trade-off tables logged for the audit trail; no AskUserQuestion issued)
**Areas discussed:** Comparability harness, Dimension set, Harness extensions, Corpus + run config,
Verdict + results, Execution gate

---

## Comparability harness -- how does code-review get an equivalent input? (D-02)

| Option | Description | Selected |
|--------|-------------|----------|
| Whole-file diff vs empty/pristine baseline | Feed code-review the SAME target files as a whole-file diff -> equal-input | check |
| Natural incremental diff on a synthetic change | Use code-review on its home turf (incremental review) | |
| Point code-review at working-tree files directly | Simplest, but deviates from its documented diff-only flow | |

**Auto-selected (recommended):** Whole-file diff vs baseline.
**Notes:** Only option that equalizes inputs, which the goal requires ("compared on equivalent work").
CAVEAT logged in CONTEXT + to be stated in 14-RESULTS.md: code-review is designed for incremental
diffs; whole-file use is slightly off its natural grain. Flagged to be re-surfaced at the spend gate
(D-12). IMPACT x CONFIDENCE: consequential-but-reversible x reasonable-default -> not trap-quadrant
(terminal phase, ships nothing, gated).

---

## Dimension set -- what is scored + how (D-04, incl. owner mid-discussion addition)

| Option | Description | Selected |
|--------|-------------|----------|
| ROADMAP dimensions only | lift, tokens, tools, quality, book-authenticity, over/under-eng | |
| ROADMAP dimensions + TS/FP/OOP idioms + patterns | Adds the owner's mid-discussion axis as first-class | check |

**Auto-selected (recommended):** ROADMAP dimensions + the owner-added idiom/pattern axis.
**Notes:** Owner said mid-discussion "Also compare on TypeScript/FP/OOP idioms and patterns." Split each
dimension into MECHANICAL (meta/transcript) vs GRADED (oracle/judge). The idiom/pattern axis is where
lz-refactor's GoF/Kerievsky/functional catalogs vs code-review's 12 Fowler smells differ most --
expected headline, not normalized away.

---

## Harness extensions -- competitor arm + new meta fields (D-06, D-07, D-08)

| Option | Description | Selected |
|--------|-------------|----------|
| Extend run-e2e.mjs (add code_review arm + token/tool meta) | Reuse the proven recommend harness; add an arm | check |
| New standalone competitor runner | Fresh script for code-review | |

**Auto-selected (recommended):** Extend run-e2e.mjs.
**Notes:** Phase 13's "no new harness" no longer holds -- phase 14 needs (a) a `code_review` arm that
loads the mattpocock plugin-dir + invokes `/mattpocock-skills:code-review`, (b) extended `meta.json`
capturing token + tool usage (new dimensions), (c) recommend-mode queries for lz-refactor. Extending the
proven runner preserves cross-phase comparability with the Phase-13 baseline.

---

## Corpus + run config (D-09, D-10)

| Option | Description | Selected |
|--------|-------------|----------|
| Reuse Phase-11/13 serial config + representative targets | k=3, opus-4-8@high, serial, kata + 1-2 nx pkgs | check |
| New config / full @nx/* fleet | Broader corpus, new run settings | |

**Auto-selected (recommended):** Reuse the locked serial config + a representative kata + 1-2 nx target
subset.
**Notes:** Reusing the proven config keeps the comparison comparable to Phase 13 and bounds metered
spend; inventing a new config would break cross-phase comparability. Full fleet deferred.

---

## Verdict + results (D-11)

| Option | Description | Selected |
|--------|-------------|----------|
| Empirical head-to-head + unbiased reviewer | 14-RESULTS.md per-cell-per-dimension; verdict = finding | check |
| Assume-skill-win summary | Pre-assumed conclusion | |

**Auto-selected (recommended):** Empirical head-to-head with >= 1 unbiased from-scratch reviewer.
**Notes:** Reuse Phase-13 posture -- verdict framed as an empirical finding, never a pre-assumed win;
state the D-02 caveat + D-03 Spec-axis-skip asymmetry.

---

## Execution gate (D-12)

| Option | Description | Selected |
|--------|-------------|----------|
| HARD build-then-halt eval-run gate | Build all runs + grading; HALT for explicit approval before any metered run | check |
| Self-approve because "Approve spend" was passed | Skip the gate presentation | |

**Auto-selected (recommended):** HARD build-then-halt gate.
**Notes:** Per the standing eval-run-approval gate, the plan builds all run commands + harness
extensions + grading and HALTS before any metered run. The invocation's "Approve spend" is recorded as
standing intent, honored WHEN the gate is presented at plan/execute -- the gate is still shown; approval
is not silently assumed during discuss (which spends no eval tokens).

---

## Claude's Discretion

- Exact competitor-arm `--plugin-dir` wiring; vendor a pinned mattpocock-skills@1.2.0 copy vs point at
  the plugin cache.
- Exact target subset; nx + kata in one plan vs split by suite.
- Whether to include a base `no_skill` third reference arm.
- Exact 14-RESULTS.md table shape; a normalization helper for finding extraction if manual reads prove noisy.
- Grading efficiency (reuse per-(book, refactoring) mechanics ground truth; per-claim verdict stays oracle-owned).
- Whether to run `/gsd-spec-phase 14` before plan (recommended NOT to block the chain).

## Deferred Ideas

- Full `@nx/*` fleet (p9-p13) + kata gr3.
- Comparing the two skills on APPLY/DRIVE output (this phase = recommend/report mode only).
- Turning the head-to-head into a standing CI gate.
- Any tuning of the shipped lz-refactor skill on a surfaced defect (separate gated decision).
