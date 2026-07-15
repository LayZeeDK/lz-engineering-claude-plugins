---
slug: groupby-detection-variants
created: 2026-07-15
mode: quick --full --research --auto
status: complete
outcome: null (T4 0/3 even with the highest-leverage gate-cue fix; T3 3/3; variant reverted)
---

# Quick Task: research-informed variant to close the groupImports blind spot

## Problem

Follow-up to `groupby-loop-recall` (null delta). The lz-refactor coach missed T4 `groupImports`
(reduce->Map group-by) 3/3 both before and after a leaf-body prose edit, while catching T3
(`findTransitiveExternalDependencies`, explicit for-loops) 3/3.

## Research finding (RESEARCH.md)

The prior edit was DEAD WEIGHT: it changed leaf bodies but left the GATE CUE (`smells.md:64`, coach
step 2 scans it FIRST) byte-unchanged. "an explicit loop whose real intent (filter, map, sum) is
buried" anchors on for/while and excludes a `.reduce()` group-by, so the leaf was never opened.
The mirror is NOT byte-enforced by check-smells (only each leaf must keep a `Recognize by:` line +
index keeps 24 links), so editing the gate cue is low-risk. Recognition ceiling ~2/3 (one run was a
judgment miss "reasonable as-is", not recognition).

## Variant applied (A+B combined, --auto-locked)

- A (gate cue, both mirrored files `smells.md:64` + `smells/loops.md:3`): "an explicit loop whose real
  intent (filter, map, sum) is buried in bookkeeping" -> "a loop, or a reduce or accumulator that
  buckets items into a Map or object under a key, whose real intent (filter, map, sum, group-by) is
  buried in bookkeeping". Breaks the "explicit loop" anchor; keeps the "buried in bookkeeping" precision
  gate (low benign-reduce false-positive) and full loop coverage (low T3 risk).
- B (judgment axis, loops leaf group-by note): add the O(n^2) `acc.find`-in-reduce cost so step-4 sees
  a real "removes" and stops parking groupImports as "reasonable as-is".

## Gates

- Check battery + typecheck + plugin validate; ASCII + email allowlist-inversion.
- skill-reviewer subagent (mandatory).

## Experiment (user-approved spend; D-12 build-then-halt shown inline)

cr-rlu invoke_skill k=3, fresh indices 7-9, byte-identical Phase-14 config (recommend, --synthetic-base,
opus-4-8 @ high). cr-rlu reviews the whole runtime-lint-utils.ts, exercising BOTH T3 and T4.

Pass bar: T4 >= 2/3 caught AND T3 stays 3/3 (strong = 3/3). Null if T4 <= 1/3 (confirms model ceiling).
Disposition (auto): KEEP if pass; REVERT if null or T3 regresses.
