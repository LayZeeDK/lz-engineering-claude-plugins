---
phase: 13-lz-refactor-vs-base-opus-eval-book-authenticity-correctness
extracted: 2026-07-15
---

# Phase 13 Learnings

## Decisions

### Empirical verdict: PARITY on applied output; base Opus 4.8 @ high is catalog-grade
The head-to-head (with_skill/invoke_skill vs no_skill) is parity on BOTH measured dimensions of applied
output -- book-authenticity fidelity and correctness -- at Pass@1 = 1.00 for every cell/arm (the lone
sub-1.0 is a QUESTION-mode advise-only decline artifact). An unbiased from-scratch reviewer independently
confirmed parity.
**Why:** the two dimensions never cleanly differenced against base before; the result confirms E2E-FINDINGS
(base is already catalog-grade on mechanical refactoring and unprompted respects the same over-engineering
guardrails the skill encodes -- declining polymorphism, pausing on blast-radius, leaving Item untouched).
**How to apply:** the skill's realizable value is NOT applied-output quality; it stays in auto-triggering,
pattern-direction vocabulary, and explicit over-engineering judgment. Do not invest further in "beat base on
applied output" -- that axis is exhausted (parity). Ties to [[lz-refactor-output-warrant-axis-exhausted]].

### OQ-1: reuse the committed nx p8 with_skill diffs; verify disk before trusting a SPEC's "what exists"
The SPEC premise "no sweep diffs persisted for either arm" was FALSIFIED for nx p8 with_skill (committed k=3,
fresh on HEAD). User chose reuse; net-new metered runs = 18, not 21.
**Why:** the spec-phase captured disk state at authoring time; disk drifts (a later quick-task had re-run p8).
**How to apply:** in an eval/backfill phase, re-enumerate disk in research and treat the SPEC's inventory
claims as needing re-verification; surface any falsified premise as an explicit decision (here at the D-09
gate), do not silently follow the stale SPEC.

## Lessons

### nx `nx test` is unusable on this arm64 Windows box -- use raw jest (bypasses build-native)
`npx nx test eslint-plugin` fails at the `nx:build-native` Rust prerequisite ("Failed to copy artifact",
exit 130) BEFORE jest runs. The behavior oracle must use raw jest against the package config:
`npx jest --config packages/eslint-plugin/jest.config.cts --ci`.
**Why:** nx infers the test target via its jest plugin with a native-build dependency that does not produce
its artifact on this hardware.
**How to apply:** for any nx behavior check on this machine, skip `nx test` entirely and run raw jest with the
project's jest.config; the runner command is recorded in `e2e-nx/behavior-baseline.json.runner`. The nx
differential baseline is 15 failed / 169 passed / 184 total (all 15 = the pre-existing dependency-checks.spec
spyOn crash); behavior-preserving = no NEW failures beyond that.

### Bash 10-min timeout means metered claude -p runs must be detached background jobs
A single nx sweep apply run is ~9-13 min and 18 runs total hours; the Bash tool caps at 10 min, so foreground
execution is impossible.
**Why:** run-e2e.mjs runs the sessions synchronously (spawnSync per run); a foreground Bash call would time out
mid-run.
**How to apply:** launch metered eval runs via `run_in_background: true` (detached, no timeout, re-invokes on
completion). run-e2e.mjs is idempotent (skips completed exit-0 runs), so crashes resume cleanly. Parallelize
across DIFFERENT borrowed repos (one nx job + one kata job), but keep runs SERIAL within a repo (the runner
git-reset-hards the shared clone between runs).

### gsd-executor cannot spawn agents -- oracle-agent grading must be orchestrator-driven
The DST-04 book-authenticity grading requires invoking the `oracle` agent, but gsd-executor's toolset has no
Agent/Task tool.
**Why:** only the orchestrator (main loop) can spawn subagents.
**How to apply:** split grading work -- the orchestrator drives any oracle-agent step inline; a gsd-executor can
still own the Bash-heavy, no-Agent parts (here, the correctness behavior-oracle test cycles), run in parallel
in a worktree.

## Patterns

### DST-04 diff-to-claim-to-oracle grading pipeline works cleanly
Main context normalizes OUR OWN output (diff.patch + answer.md + meta.json) into a per-claim list (never
reading the source books), then packages each distinct (book, refactoring) group to the `oracle` agent, which
establishes the book's mechanics and returns pass/partial/fail in its OWN words. Both oracles returned all-pass
with own-words rationale; no source prose crossed back.
**Why:** the diff is our generated artifact (safe to read); the firewall keeps copyrighted book prose behind
the agent boundary.
**How to apply:** batch one book per oracle call, one call per distinct (book, refactoring) since fidelity is
homogeneous across identical textbook applications; map the returned verdict onto each claim of that group.

### Behavior oracle must be differential (nx) and pristine-seeded (kata), never all-green / self-seeded
nx: score "no NEW failures" vs a pristine 15-fail baseline captured ONCE in Wave 0. kata: seed the golden
master from pristine main, then verify edited-source runs with `jest --ci` (refuses to write, fails on
mismatch). Reconfirms Phase-12 D-14.
**Why:** an "all green" nx gate would fail every run on the pre-existing crash; a self-written kata snapshot
would pass trivially against its own edits.
**How to apply:** always capture the behavior-oracle baseline on pristine source BEFORE grading edited output;
re-apply each persisted diff to a FRESH checkout and run the ORIGINAL tests (never trust the in-session
self-reported test run).

### run-e2e.mjs already covered the whole eval need -- assembly, not construction
`--arm no_skill|both`, `--mode apply`, and diff+meta persistence into the tracked workspace (before the
borrowed-repo reset) all pre-existed; no harness code was written.
**Why:** the harness was built general in Phases 11-12.
**How to apply:** before authoring eval infra, check the existing workspace harness flags; a backfill/re-run is
usually a config-only invocation.

## Surprises

### Reused prior-phase answer.md transcripts carry non-ASCII (pre-existing repo hygiene gap)
The 18 net-new phase-13 answer.md were ASCII-normalized (em-dash/arrow/x/ellipsis -> ASCII), but the ~13
REUSED with_skill/invoke_skill answer.md from Phases 11-12/quick-tasks (committed under an earlier hygiene
state) still contain non-ASCII punctuation.
**Why:** raw model-output captures were committed verbatim in earlier phases before the ASCII-only convention
was applied to this corpus.
**How to apply:** deferred follow-up (out of phase-13 scope): normalize the reused transcript answer.md to ASCII
for public-repo hygiene. New captures should always be ASCII-normalized at commit time. Ties to
[[public-repo-work-email-allowlist]] hygiene discipline.
