---
phase: 03-lz-tpp-skill-authoring
plan: 03
subsystem: docs
tags: [typescript, tco, trampoline, generator, cps, tpp, skill-reference, agent-skills]

# Dependency graph
requires:
  - phase: 02-tpp-source-distillation
    provides: LOCKED references/transformations.md (canonical 14-item list + FibTPP language-specificity quote referenced by the overlay)
  - phase: 03-lz-tpp-skill-authoring
    provides: research/TPP-TYPESCRIPT.md verified katas and stack-safe patterns lifted near-verbatim
provides:
  - "references/typescript-and-tco.md: paired functional/imperative katas (sum linear, flatten tree) showing paradigm-driven transformation-priority shift (TPP-05)"
  - "JS/TS no-reliable-TCO reality (JavaScriptCore-only PTC; kangax Node 2/2 false positive) + five stack-safe patterns with teach-vs-mention split (TPP-07)"
  - "Transformation-vs-refactoring distinction + deep-input decision guide + source-sanctioned TS/JS overlay"
affects: [skill-body-pointers, phase-04-authoring-review, phase-05-evals]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "TOC-headed, one-level-deep progressive-disclosure reference file (no sibling-reference links)"
    - "All fenced code blocks are tsc --strict-clean TypeScript lifted near-verbatim from verified research"

key-files:
  created:
    - plugins/lz-tdd/skills/lz-tpp/references/typescript-and-tco.md
  modified: []

key-decisions:
  - "Katas show essential solution code inline and reference the pattern sections by number within the same file (self-contained; no sibling-reference links)"
  - "Decision guide rendered as a Markdown nested list, not a fenced block, to keep every code fence as ```ts per acceptance"
  - "Engine-status sentences keep V8 as the subject (never 'Node supports/has proper tail calls') to defuse the compat-table landmine without tripping the forbidden-assertion gate"

patterns-established:
  - "Mechanical rg gate battery (ASCII, presence tokens, negative landmine asserts, work-email allowlist) as the validation instrument for a docs deliverable with no test framework"
  - "Confirmatory (not gating) per-block tsc --strict extraction: self-contained blocks compiled individually, the Kata-2 family assembled with its shared type declarations"

requirements-completed: [TPP-05, TPP-07]

# Metrics
duration: 7min
completed: 2026-07-02
---

# Phase 3 Plan 3: TypeScript paired katas and the no-reliable-TCO reality Summary

**Bundled references/typescript-and-tco.md pairing sum (linear) and flatten (tree) katas that show the transformation-priority shift by paradigm, plus the JS/TS no-reliable-TCO reality, five teach-vs-mention stack-safe patterns, and a recurse-vs-iterate decision guide -- all tsc --strict-clean and self-contained.**

## Performance

- **Duration:** 7 min
- **Started:** 2026-07-02T10:09:49Z
- **Completed:** 2026-07-02T10:17:00Z
- **Tasks:** 3
- **Files modified:** 1 (created)

## Accomplishments
- Kata 1 (sum 1..n, LINEAR): functional path reaches `(statement -> tail-recursion)` #9 (green small, overflows the deep-input test) then pays for stack safety with a trampoline; imperative path reaches `(if -> while)` #10 + `(variable -> assignment)` #13 and gets stack safety for free. Explicit divergence narrative preserved.
- Kata 2 (flatten nested list, TREE): tail-recursion is not even available (no tail form), so both paradigms converge on an explicit stack -- generator (lazy) vs explicit-stack loop (eager). `isNested` custom guard and the no-DOM-`Node` typing lesson preserved verbatim.
- No-reliable-TCO reality: only JavaScriptCore/Safari implements ES6 proper tail calls; V8 (Chrome, Node.js, Deno, Edge, Electron) and SpiderMonkey (Firefox) do not; the kangax "Node 2/2" cell is flagged as a false positive with Chrome 0/2 + the empirical V8 overflow cited.
- Teach-vs-mention split honored: TEACH iterative default + trampoline (incl. tagged-union `Bounce<T>`), TEACH generator + fold/reduce; MENTION CPS stating explicitly it is stack-safe ONLY when paired with a trampoline (naked-CPS-overflows example labelled NOT a fix); MENTION mutual-recursion trampolining.
- Transformation-vs-refactoring distinction + deep-input decision guide + the source-sanctioned TS/JS overlay (FibTPP language-specificity quote), framed as a heuristic, not dogma.

## Task Commits

Each task was committed atomically:

1. **Task 1: Author the paired functional/imperative katas section (TPP-05)** - `99b095a` (feat)
2. **Task 2: Author the TCO reality + stack-safe patterns + decision guide (TPP-07)** - `540844c` (feat)
3. **Task 3: Mechanical + type-safety verification** - verified no-op (no code change required; see Issues Encountered). Recorded here per the Phase-2 "verified-no-op in SUMMARY instead of an empty commit" pattern.

**Plan metadata:** committed with this SUMMARY (docs: complete plan).

## Files Created/Modified
- `plugins/lz-tdd/skills/lz-tpp/references/typescript-and-tco.md` (505 lines) - The TPP-05 paired katas and the TPP-07 TCO reality/patterns/decision-guide, opening with a `## Contents` TOC; one level deep (no links to sibling reference files); ASCII-only.

## Decisions Made
- Katas present essential solution code inline (naive form + stack-safe endpoint) and reference the pattern sections by number within the same file, keeping the file self-contained (no links to `transformations.md` or `fibonacci-worked-example.md`).
- The decision guide is a Markdown nested list rather than a fenced text block, so every code fence in the file is `tsc`-clean TypeScript (acceptance requires only ```ts fences).
- Engine-status prose keeps V8 (never Node) as the grammatical subject of any "does not implement proper tail calls" sentence, defusing the compat-table landmine while keeping the forbidden `node ... (supports|has) ... tail call` regex empty.
- The empirical-overflow evidence and the engine matrix are given as prose + a Markdown table (not a console fence), preserving the ```ts-only fence rule.

## Deviations from Plan

None - plan executed exactly as written. All TypeScript was lifted near-verbatim from the pre-verified `.planning/research/TPP-TYPESCRIPT.md`; no bug-fix, missing-functionality, or blocking-issue deviations were needed.

## Issues Encountered
- **Task 3 was a verified no-op.** Every mechanical gate passed on the as-authored file, so no in-place fix was needed:
  - ASCII-only gate: clean (`rg -n '[^\x00-\x7F]'` empty).
  - Presence tokens all green: `## Contents` TOC, both katas, `1_000_000` deep-input literal, the three divergence tokens `(statement -> tail-recursion)` / `(if -> while)` / `(variable -> assignment)`, `isNested`, `JavaScriptCore`, `safari`, `spidermonkey`, `false positive`, `chrome`, `Bounce<T>`, `Generator<`, `refactoring`, `decision guide`, `deep-input`, `language-specific`, `heuristic`, `mutual`, `fold|reduce`, `generator`, `trampoline`, `cps` + `only when|requires a trampoline`.
  - Negative landmine gates all empty: no `node ... (supports|has) ... tail call` assertion; no `always prefer (if -> while)` dogma; no sibling-reference `.md` links; work-email allowlist gate returns nothing (no work-email literal, and no email at all appears in the file).
  - `git diff --exit-code -- references/transformations.md` exits 0 (LOCKED file byte-unchanged; it is absent from this plan's files_modified).
  - `claude plugin validate ./plugins/lz-tdd` exits 0 with the new file present.
  - Confirmatory `tsc --strict --noEmit --target es2021` (per-block in isolation; the Kata-2 family assembled with its shared `Nested`/`Item`/`isNested` declarations): all 9 compilable modules clean. The two remaining `ts` blocks are pure `expect(...)` test-illustration snippets (undeclared `expect`/`sum`/`nest200k` by design) and the labelled naked-CPS-overflow example, which are illustrative and not compiled standalone. This matches the plan's "confirmatory, not a hard gate" disposition and the prior TPP-TYPESCRIPT.md verification on this exact toolchain (Node v24.18.0, tsc 6.0.3).

## Known Stubs
None. The reference is complete content; no placeholder values, no empty data sources, no TODO/FIXME markers.

## Threat Flags
None. This plan ships Markdown only (no network endpoints, auth paths, file access, or schema changes). The plan's threat register (T-03-03-01..06) mitigations were all applied: CPS-needs-trampoline (T-01), Node-2/2 false-positive (T-02), lifted-TS fidelity + typing gotchas (T-03), work-email allowlist (T-04), ASCII-only arrows (T-05), and the transformations.md git-unchanged guard (T-06).

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- TPP-05 and TPP-07 are satisfied by this file; ROADMAP Phase 3 SC3 (paired functional/imperative TS examples) and SC4 (TCO reality + trampoline/generator/CPS-with-trampoline + when-to-prefer-iteration) are covered.
- The SKILL.md body (plan 03-01) should point at `references/typescript-and-tco.md` for the paired katas and TCO guidance, one level deep.
- No blockers. `transformations.md` remains LOCKED and byte-unchanged.

## Self-Check: PASSED
- `plugins/lz-tdd/skills/lz-tpp/references/typescript-and-tco.md` exists (505 lines).
- Commit `99b095a` exists (Task 1: katas).
- Commit `540844c` exists (Task 2: TCO section).
- `claude plugin validate ./plugins/lz-tdd` exits 0.
- LOCKED `transformations.md` unchanged (git diff exit 0).

---
*Phase: 03-lz-tpp-skill-authoring*
*Completed: 2026-07-02*
