---
status: passed
quick_id: 260712-i5y
date: 2026-07-12
---

# Verification: package-scope directive eval

Goal: measure the user's package-scope directive prompt (no `/lz-refactor`) live vs baseline, both
suites, and report whether identify+triage+multi-round-drive works and is skill-attributable.

## must_haves check

- [x] Package-scope directive prompts built for both suites (p8 nx, gr4 kata), verbatim user wording.
- [x] Live measured FIRST, `no_skill` baseline AFTER (per user ordering). All 12 runs exit 0.
- [x] Prompts + configs + runner code-reviewed before any run; I1/I3/I5 harness fixes landed;
      unbiased review passed (p8/gr4 relabeled directive).
- [x] Graded from meta.json + untracked-inclusive diff.patch + transcript, exit-0 filtered.
- [x] Behavior preservation confirmed: nx 169-pass baseline held both arms; kata golden master +
      characterization snapshot; no test-file edits (the kata `.snap` is a generated safety net).

## Outcome

- Capability confirmed: directive package prompt auto-triggers 3/3, triages across 4-6 files, drives
  4-6 behavior-preserving rounds to a safe fixpoint, checkpoints before high-blast-radius decomposition.
- Skill value: NULL delta vs base Opus 4.8 @ high at package scale (matches the full session ladder).
- Seeded traps avoided (nx exported-signature; kata Conjured 6/6).

## Human follow-up

- Keep/revert-12-02 disposition is the user's call (evidence now complete across scopes/gaps).
- Target repos (nx, kata) + baseline worktrees + stashes require restore/cleanup (after-triage).
