# Codebase Concerns

**Analysis Date:** 2026-07-17

> Context: this repo is a Claude Code plugin marketplace. The shipped product is
> almost entirely Markdown -- two skills (`lz-tpp`, `lz-refactor`) and five
> reference catalogs under `plugins/lz-tdd/skills/` (183 files, ~12.7K lines). The
> only executable code is a NON-shipped eval/checker harness under the gitignored
> workspace `.claude/skills/lz-refactor-workspace/` (32 `.mjs` files). "Concerns"
> here therefore skew toward content correctness, distribution hygiene, and skill
> effectiveness rather than classic runtime bugs.

## Tech Debt

**No CI -- the entire quality battery is manual-only:**
- Issue: The structural gate (`npm run check` = 10 checkers, plus `typecheck` via `extract-samples.mjs`, plus `claude plugin validate .`) exists only as `scripts` in a private, gitignored package. Nothing runs automatically on push or PR.
- Files: `.claude/skills/lz-refactor-workspace/package.json` (the `check` script chains all 10 `tools/check-*.mjs`); no `.github/workflows/` directory exists.
- Impact: A bad edit to any shipped skill leaf (broken cross-link, name-identity drift, leaked scaffold phrase, ASCII/email hygiene violation, verbatim book prose) can reach the public marketplace un-gated. The battery is GREEN today, but only because a human remembered to run it. The verbatim-book-prose gate (DST-04, `check-hygiene.mjs` axis c) is the highest-stakes check with no automation.
- Fix approach: Add a GitHub Actions workflow that (a) copies or symlinks the shipped `plugins/` tree next to the workspace checkers, (b) runs `npm run check` + `npm run typecheck`, and (c) runs `claude plugin validate .`. The checkers already exit non-zero on failure, so wiring is mechanical. The blocker is that the checkers live in a gitignored workspace and read `../../../plugins/...` relative paths -- CI needs the workspace checked out too, which means un-gitignoring `tools/` or vendoring the battery into a committed `scripts/` dir.

**Eval-harness structural duplication (deliberately deferred):**
- Issue: The `/simplify` pass (quick task `260717-sbz`) explicitly SKIPPED the cross-file extractions as YAGNI on throwaway tooling. The 10 catalog checkers duplicate `report()` / `isDir()` / `walkMd()` / `collectLeaves()` ~11 ways; `nameRe` / Pass@k / anchor helpers are copy-pasted between `grade-run.mjs`, `run-e2e.mjs`, and `tabulate-mechanical.mjs`; `run-recall-chunks.mjs` / `run-spec-chunks.mjs` are near-twins; `check-gof.mjs` / `check-extra-patterns.mjs` share structure.
- Files: `.claude/skills/lz-refactor-workspace/tools/check-*.mjs` (10 files), `.../grade-run.mjs`, `.../e2e-nx/run-e2e.mjs`, `.../e2e-angular/tabulate-mechanical.mjs`, `.../run-recall-chunks.mjs`, `.../run-spec-chunks.mjs`.
- Impact: Low today. This is milestone-throwaway tooling with deliberate drift-guard `--selfcheck` blocks per checker. The debt only bites if the harness is reused for a third catalog/skill.
- Fix approach: Extract a shared `tools/lib/checker-common.mjs` (report/isDir/walkMd/collectLeaves) and lift `nameRe`/`passk`/`anchors` into `tools/lib/`. Do this ONLY when a new catalog is added -- not before.

**Version declared only in `plugin.json` (intentional, not debt) -- but no enforcement:**
- Files: `plugins/lz-tdd/.claude-plugin/plugin.json` (`"version": "0.0.2"`); `.claude-plugin/marketplace.json` deliberately omits `version`.
- Impact: Correct pattern (avoids the version-masking trap). The risk is only that nothing prevents a future contributor from re-adding `version` to the marketplace entry, which would silently mask `plugin.json`.
- Fix approach: A one-line assertion in the (future) CI hygiene check: fail if `marketplace.json` plugin entries contain a `version` key.

## Known Bugs

**`readmeRowsBySlug` regex divergence (latent, currently inert):**
- Symptoms: The `/simplify` pass flagged that `readmeRowsBySlug`'s row regex diverges across catalog checkers and does not match `./`-prefixed or `#anchor` link forms.
- Files: catalog checker(s) under `.claude/skills/lz-refactor-workspace/tools/` (per quick task `260717-sbz` SUMMARY).
- Trigger: A README that starts using `[Name](./slug.md)` or `[Name](slug.md#anchor)` link forms would silently drop that row from validation -- a false-GREEN.
- Workaround: Currently harmless because no shipped README uses those link forms. The real fix is the deferred `tools/lib` extraction above. Track it; do not rely on the coincidence forever.

## Security Considerations

**Work-email bare DOMAIN in 4 `.planning/` docs in published `main` history (ACCEPTED risk):**
- Risk: The maintainer's employer email BARE DOMAIN (no `@local-part`) appears as a search needle inside four audit/review docs already published on `main`. This is the recurring Pitfall-3 self-reference trap (a doc asserting the email is absent spelled the domain to do so).
- Files: `.planning/milestones/lz-tdd@0.0.1-phases/02-tpp-source-distillation/02-SECURITY.md`, `.../03-lz-tpp-skill-authoring/03-REVIEW.md`, `.../03-lz-tpp-skill-authoring/03-SECURITY.md`, `.../05-skill-effectiveness-evals/05-SECURITY.md`. Full disposition recorded in `.planning/milestones/lz-tdd@0.0.2-phases/10-distribution-hygiene/deferred-items.md`.
- Current mitigation: Formally ACCEPTED by the maintainer (2026-07-09). It is a bare public domain, not a routable address; the SHIPPABLE surface (both skill trees + root README/CHANGELOG/LICENSE + both manifests) is clean (allowlist-inversion PASS). Remediation would require rewriting shared, already-published `main` history + force-pushing `origin/main`, breaking SHAs for every clone/fork -- cost exceeds exposure.
- Recommendations: Leave as-is unless the repo gains significant fork/clone traffic that would make a history rewrite cheap. Forward prevention already landed (`AGENTS.md` + `CLAUDE.md` allowlist-inversion rule, commit `444c5ad`). Do NOT re-litigate; the decision tree is in `deferred-items.md`.

**Clean-room integrity depends on a gitignore rule + read discipline:**
- Risk: `.oracle/` holds authoritative COPYRIGHTED book excerpts (Fowler / Kerievsky / GoF). It is present on disk and gitignored, read only by the `oracle` / `oracle-reviewer` subagents. If it were ever force-added (`git add -f`), or the `.gitignore` `.oracle/` line regressed, verbatim copyrighted prose would leak into a public MIT repo.
- Files: `.oracle/` (gitignored, untracked -- verified 0 tracked files); `.gitignore` (the `.oracle/` rule); `.claude/agents/oracle.md`, `.claude/agents/oracle-reviewer.md` (the only readers).
- Current mitigation: `.oracle/` is gitignored; the project bans `git add .`/`-A`/`-u` (CLAUDE.md), which is the primary guard against accidental inclusion; `check-hygiene.mjs` axis (c) scans the shipped tree for verbatim prose.
- Recommendations: Add a CI/hygiene assertion that fails if any path under `.oracle/` is tracked (`git ls-files .oracle | wc -l` must be 0). Cheap, and it makes the copyright guard fail-closed instead of convention-dependent.

## Performance Bottlenecks

**Metered eval runs dominate cost and cannot gate every change:**
- Problem: The only validation of actual COACHING behavior (not structure) is `claude -p` eval runs that cost real money and require explicit user approval before running (see the `eval-run-approval-gate` memory).
- Files: eval suites under `.claude/skills/lz-refactor-workspace/e2e-angular/`, `.../e2e-nx/`, `.../e2e-reference/`; RETROSPECTIVE.md notes "substantial metered `claude -p` eval spend in Phases 11-14".
- Cause: Behavioral correctness of an LLM coaching skill is inherently expensive to measure; there is no cheap deterministic proxy for "did the coach recommend the right refactoring".
- Improvement path: Not really a perf bug -- accept it. Keep the deterministic structural battery as the per-commit gate and reserve metered evals for release checkpoints only.

## Fragile Areas

**Mirror-sync between `smells.md` and the smell leaves:**
- Files: `plugins/lz-tdd/skills/lz-refactor/references/smells.md` (the coach trigger table / recognize-by cues) and the 28 leaves under `plugins/lz-tdd/skills/lz-refactor/references/smells/`.
- Why fragile: The recognize-by cues and routing tokens are mirrored between the index and the leaves and are BYTE-fragile. A prose "humanize" pass already broke mirrored selectors once (memory `lz-refactor-precheck-catalog-red-preexisting`, resolved in commit `bf5af55`). The coach scans `smells.md:64` FIRST (step 2 of the decision procedure), so a broken cue there silently degrades routing even if the leaf is correct.
- Safe modification: Never bulk-reword catalog Markdown without re-running `check-smells.mjs` + `check-catalog.mjs` + `check-crossrefs.mjs` afterward. Protect Use-when / Source / recognize-by tokens during any prose edit.
- Test coverage: The checkers catch drift, but only when run manually (see the No-CI concern).

**The skill descriptions are the ONLY triggering mechanism:**
- Files: `plugins/lz-tdd/skills/lz-refactor/SKILL.md` frontmatter `description` (1245 chars) and `plugins/lz-tdd/skills/lz-tpp/SKILL.md` (750 chars).
- Why fragile: Auto-triggering is entirely description-driven; there is no runtime guardrail. History shows how sensitive this is -- coach-mode auto-trigger went 1/18 -> 18/18 purely from a description retune (quick task `20260710-lz-refactor-trigger-opt`). Both descriptions sit under the 1536-char listing-truncation cap (fine), but any edit that trims the intent-first phrasing can silently tank recall.
- Safe modification: Treat every `description` edit as trigger-critical. Re-run the trigger eval (`check-evals.mjs` lint + the isolated trigger eval) before shipping. Per the `agent-skill-instruction-changes-need-review` memory, every SKILL.md edit also requires unbiased subagent review.
- Test coverage: `check-evals.mjs` lints the trigger dataset at build time; measured recall/specificity requires a metered run.

## Scaling Limits

**Manual check-battery surface grows linearly with catalogs/skills:**
- Current capacity: 10 catalog/hygiene checkers cover 2 skills + 5 catalogs (62 Fowler + 27 Kerievsky + 23 GoF + 5 extra + 19 functional + 28 smells), each hardcoding `NAMES` arrays.
- Limit: Adding a third plugin or a sixth catalog means new hardcoded-NAMES checkers and a longer manual `check` chain. Without CI this becomes progressively easier to forget to run.
- Scaling path: The CI wiring (top concern) is the real unlock; the shared-lib extraction (deferred debt) reduces per-catalog authoring cost.

## Dependencies at Risk

**Claude Code plugin/skill format is a moving target:**
- Risk: Skill triggering semantics, the 1536-char description cap, and marketplace-source resolution are all Claude Code runtime features (>=2.1.x). A future Claude Code release could change triggering behavior or frontmatter rules.
- Impact: The product's entire value (auto-triggering + progressive disclosure) rides on these. A silent semantics change would not surface until a metered eval or a user report.
- Migration plan: None needed proactively. The shipped tree is dependency-free Markdown, so there is no supply-chain surface; monitor Claude Code release notes for skill-frontmatter or triggering changes and re-run the trigger eval after a runtime bump.

**Pinned `typescript@6.0.3` (dev-only, non-shipped):**
- Risk: Minimal. Used only by the workspace compile harness (`extract-samples.mjs`) to `tsc --strict`-check catalog code fences.
- Files: `.claude/skills/lz-refactor-workspace/package.json`.
- Migration plan: Bump when TS 6.x moves; the shipped plugin ships no TS and no `node_modules`.

## Missing Critical Features

**The skill's applied-output value over base Opus is essentially NULL (product-value risk):**
- Problem: The Phase 11-14 eval program plus ~8 probe quick tasks established that the skill's applied-output lift over base Opus 4.8 at package scale is null -- base Opus is already catalog-grade. The proven, robust value narrows to: (1) auto-triggering during TDD, (2) a narrow reference edge (Kerievsky Refactoring-Directions dual/Away facts base gets wrong), and (3) the loop-audit forcing-function (first non-null applied lever, shipped in commit `01208c8`).
- Files: findings recorded in `.planning/RETROSPECTIVE.md` (lz-tdd@0.0.2 "What Was Inefficient"), `.planning/milestones/lz-tdd@0.0.2-phases/13-.../13-RESULTS.md`, `.../14-.../14-RESULTS.md`, and the probe SUMMARYs under `.planning/quick/`.
- Blocks: Nothing ships-blocking (milestone closed). But the value proposition erodes as base models improve. Future work that adds passive catalog content should be treated as low-ROI for applied lift -- the evidence says passive content is null (5 nulls); only ACTIVE forcing-function steps moved the needle.

## Test Coverage Gaps

**No cheap regression gate on coaching behavior:**
- What's not tested: The actual coach decision procedure (smell -> named-refactoring routing, APPLY/DECLINE net-cost verdict, the lz-tpp seam classification, question-vs-command drive behavior) has no offline test. Only structure (names, cross-links, hygiene, code-fence compilation) is checked without spend.
- Files: coaching logic lives in `plugins/lz-tdd/skills/lz-refactor/SKILL.md` (steps 1-6) and `plugins/lz-tdd/skills/lz-tpp/SKILL.md` (steps 1-7); no non-metered test exercises it.
- Risk: A SKILL.md logic edit could regress routing or the drive/coach gating and only surface in an expensive metered eval or a user report.
- Priority: Medium. Mitigated by the mandatory unbiased-subagent review on every SKILL.md edit (`agent-skill-instruction-changes-need-review` memory), which is the current substitute for an automated behavioral gate.

**Catalog code samples compile-checked only manually:**
- What's not tested (automatically): The TS/JS code fences in catalog leaves are `tsc --strict`-verified by `extract-samples.mjs`, but that runs only when a human invokes `npm run typecheck` in the gitignored workspace.
- Files: `.claude/skills/lz-refactor-workspace/extract-samples.mjs`; samples live across `plugins/lz-tdd/skills/lz-refactor/references/**/*.md`.
- Risk: A broken code sample ships if the human skips the typecheck. Same root cause as the No-CI concern.
- Priority: Medium -- fold into the CI wiring.

---

*Concerns audit: 2026-07-17*
