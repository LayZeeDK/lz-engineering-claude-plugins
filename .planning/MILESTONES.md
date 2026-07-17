# Milestones

## lz-tdd@0.0.2 lz-refactor Skill (Fowler + Kerievsky) (Shipped: 2026-07-17)

**Delivered:** A single `/lz-tdd:lz-refactor` dual-mode coach + reference that operationalizes Martin Fowler's *Refactoring* (2nd ed) and Joshua Kerievsky's *Refactoring to Patterns* -- picking the right named refactoring during the red-green-refactor "refactor" step and explaining it on demand -- completing the TDD loop alongside `lz-tpp` (lz-tpp drives the green step; lz-refactor drives the refactor step).

**Phases completed:** 11 phase directories (6, 7, 8, 8.1, 8.2, 9, 10, 11, 12, 13, 14), 55 plans.
**Timeline:** 2026-07-04 -> 2026-07-17 (~13 days); 457 commits since lz-tdd@0.0.1 (65 `feat(`); 178 Markdown files under the shipped `lz-refactor` skill.
**Version note:** GSD milestone id `lz-tdd@0.0.2` -- plugin-scoped (plugin `lz-tdd` at semver `0.0.2`). Git tag and GitHub Release: `lz-tdd@0.0.2`.
**Requirements:** 36/36 satisfied. **Audit:** passed (2026-07-17). **Nyquist:** 11/11 compliant. **Known deferred items at close:** 0 (10 pre-close open artifacts -- 9 non-shipped eval-workspace quick tasks + Phase 09's already-closed verification thread -- were resolved before archiving, not deferred).

**Key accomplishments:**

- Fowler catalog: all 62 2nd-ed refactorings as per-refactoring leaves + 24 bad-smell leaves + Ch.2 principles, original prose + tsc --strict-clean TypeScript, clean-room-oracle-verified against the git-ignored `.oracle/refactoring-2e/` (DST-04: the main context never reads book prose).
- Kerievsky catalog: all 27 pattern-directed refactorings with the To/Towards/Away directions settled against the book's authoritative Refactoring Directions table, each composed from named Fowler primitives, with Ch.4 smells folded into the unified taxonomy.
- GoF + extra catalog: 23 GoF design patterns + 5 Tier-1 extra patterns on a locked 5-section contract (Intent / Applicability / Consequences / Example / Related patterns), author-cited modern-status caveats folded into Consequences, and the 3 Direction:Away de-patterning links resolved.
- Functional catalog: 19 idiom leaves + an N:1 pattern->idiom map, with 55 mutual OO<->FP `Functional alternative:` / `Correspondence:` cross-links spanning all three OO catalogs.
- Dual-mode coach: an inline 6-step decision procedure (smell -> named refactoring; mechanical->Fowler, structural->Kerievsky; de-patterning routed to the functional catalog; behavior-preservation with a Feathers no-tests fallback; the lz-tpp red-green-refactor seam), backed by three no-oracle principle refs (Beck *TDD by Example*, Beck *Tidy First?*, Feathers *Legacy Code*).
- Distribution + hygiene: truthful two-skill 0.0.2 (plugin.json bump, README + CHANGELOG, marketplace listing); `claude plugin validate .` plain + `--strict` clean; plugin-validator + skill-reviewer PASS on both skills; no verbatim book prose/code; ASCII-only; work-email absent (allowlist-inversion clean over the full tree).
- Evals: native-harness trigger recall/specificity (EVL-01) + smell->refactoring behavior accuracy vs baseline (EVL-02), both PASS; plus post-eval comparisons against base Opus 4.8 (Phase 13: book-authenticity + correctness parity, unbiased-reviewed) and the third-party mattpocock code-review skill (Phase 14).
- Post-phase refinement (informational, not a milestone requirement): a skill-level loop-audit forcing-function (SKILL.md AUDIT+DECIDE step) -- the first non-null + safe lever on the output-warrant axis after five null probes.

---

## lz-tdd@0.0.1 First Release (Shipped: 2026-07-04)

**Delivered:** The first public release of the `lz-engineering-claude-plugins` marketplace -- the `lz-tdd` plugin and its dual-mode `lz-tpp` skill (`/lz-tdd:lz-tpp`), a TDD coach + reference for Robert C. Martin's Transformation Priority Premise.

**Phases completed:** 5 phases, 11 plans, 15 tasks
**Timeline:** 2026-07-02 -> 2026-07-04 (3 days); ~909 LOC shipped under `plugins/`; 134 commits (9 `feat(`).
**Version note:** GSD milestone id `lz-tdd@0.0.1` -- plugin-scoped (plugin `lz-tdd` at semver `0.0.1`). Originally tracked as `v1.0`, relabeled `v0.0.1` (to match the `plugin.json` semver), then `lz-tdd@0.0.1` (the marketplace hosts multiple plugins, so versions are scoped per plugin). Git tag and GitHub Release: `lz-tdd@0.0.1`.

**Key accomplishments:**

- Installable, validating three-level Claude Code marketplace hierarchy (lz-engineering-claude-plugins -> lz-tdd -> placeholder lz-tpp skill) plus a Node/OS .gitignore, passing `claude plugin validate .` clean in both plain and --strict modes.
- NDC 2011 "Transformation Priority Premise" talk (B93QezwTQpI) transcribed via the local youtube-to-markdown tool (1141 caption segments) and retained ASCII-clean, git-tracked at the D-08 path as reconciliation source material for 02-02.
- Shipped `references/transformations.md`: the verbatim-faithful, per-post-cited 14-item FibTPP transformation-priority list with the explicit 12-vs-14 resolution, transformations-vs-refactorings definition, provisional-heuristic hedges, amended red-green-refactor process, and NDC 2011 transcript reconciliation -- all ASCII-only.
- Lean dual-mode lz-tpp SKILL.md: an auto-triggering TPP coach (7-step decision procedure + impasse/backtrack) and an on-demand reference, on default frontmatter with a 750-char scoped description and one-level-deep pointers to all three reference files.
- Canonical FibTPP Fibonacci walk translated to TypeScript, applied test-by-test in monotonic TPP priority order -- ({} -> nil) #1, (nil -> constant) #2, (unconditional -> if) #6 + (constant -> scalar) #4, (statement -> tail-recursion) #9 preferred over (statement -> recursion) #11, then unwound to (if -> while) #10 + (variable -> assignment) #13 for JS/TS stack safety -- with (case) #14 noted as the degenerate-switch-preventing last resort and Word Wrap referenced only as the impasse illustration.
- Bundled references/typescript-and-tco.md pairing sum (linear) and flatten (tree) katas that show the transformation-priority shift by paradigm, plus the JS/TS no-reliable-TCO reality, five teach-vs-mention stack-safe patterns, and a recurse-vs-iterate decision guide -- all tsc --strict-clean and self-contained.
- Public-ship distribution: root README (install commands + what `lz-tpp` does + `/lz-tdd:lz-tpp` invocation), verbatim MIT LICENSE with the public contact, work-email absent from the tree, passing plugin-validator + skill-reviewer + `claude plugin validate . --strict` (exit 0).
- Skill effectiveness evals via the native harness: EVAL-01 trigger 100% recall (13/13) / 100% specificity (14/14) on the shipped description; EVAL-02 coaching 29/30 with-skill (Pass@1 0.97, Pass@3 1.00) vs 15/30 baseline -- no tuning needed, shipped skill unchanged.

---
