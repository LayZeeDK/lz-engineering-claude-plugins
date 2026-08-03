---
phase: 03-lz-tpp-skill-authoring
reviewed: 2026-07-02T10:32:45Z
depth: deep
files_reviewed: 3
files_reviewed_list:
  - plugins/lz-tdd/skills/lz-tpp/SKILL.md
  - plugins/lz-tdd/skills/lz-tpp/references/fibonacci-worked-example.md
  - plugins/lz-tdd/skills/lz-tpp/references/typescript-and-tco.md
findings:
  critical: 0
  warning: 0
  info: 2
  total: 2
status: issues_found
---

# Phase 03: Code Review Report

**Reviewed:** 2026-07-02T10:32:45Z
**Depth:** deep
**Files Reviewed:** 3
**Status:** issues_found (Info-only; no Critical or Warning findings)

## Summary

Reviewed the `lz-tpp` Agent Skill (dual-mode TDD coach + TPP reference) at deep depth,
cross-referencing every fenced example against the LOCKED
`references/transformations.md` as the source of truth. The submission is faithful,
well-formed, and the TypeScript is compile-clean. No BLOCKER or WARNING defects were
found. Two low-severity Info nits are recorded below (a terminology reuse in the coach
procedure, and a TOC-style inconsistency between the two reference files). Neither
blocks shipping.

Verification performed (all PASS):

- **Skill format / triggering (SKILL.md):** Valid YAML frontmatter with exactly `name`
  and `description`. `name: lz-tpp` matches the directory name. Folded `description` is
  750 chars (<= 1024), third-person ("This skill should be used..."), scoped to TDD/TPP
  and explicitly excludes generic coding ("Do not use it for generic write-a-function..."),
  contains NO XML tags (the only `>` characters are ASCII `->` arrows; no `<...>` tags)
  and NOT the words "claude"/"anthropic". No `version` field. No
  `disable-model-invocation`/`user-invocable` overrides (defaults preserved). Body is 88
  lines / well under the ~500-line guidance. All three reference pointers are exactly one
  level deep and resolve to files that exist.
- **Coach behavior (SKILL.md):** The 7-step coach decision procedure is present and
  coherent (confirm state -> enumerate -> classify -> pick highest-priority -> apply TS/JS
  overlay -> impasse/backtrack -> show-don't-drive). Impasse/backtrack heuristic present
  (step 6 + "Amended red-green-refactor"). Dual-mode intent routing present ("Two modes":
  coach vs reference). Anti-dogma framing present ("TPP is a heuristic, not a law"). Step 7
  correctly constrains the coach to recommend + name the transformation and show a diff but
  NEVER edit or run the developer's code ("coach, don't drive").
- **TPP fidelity:** Every transformation name and list position used in the worked example
  and the katas matches the locked 14-item canonical list exactly:
  `({} -> nil)` #1, `(nil -> constant)` #2, `(constant -> scalar)` #4,
  `(unconditional -> if)` #6, `(statement -> tail-recursion)` #9, `(if -> while)` #10,
  `(statement -> recursion)` #11, `(expression -> function)` #12,
  `(variable -> assignment)` #13, `(case)` #14. No drift (correct `constant -> scalar`,
  not `constant -> variable`; correct 9-above-10, 11-below-10 revised ordering). The SKILL
  body does not restate the list (routes to `transformations.md`), eliminating drift risk.
- **TypeScript correctness / stack safety:** All fenced TS traces as `tsc --strict`-clean.
  Fibonacci `of`/`ofAcc` (recursive, refactored, and looped) computes correct values
  (spot-checked of(0..6)); the final loop runs in constant stack space. All three CRITICAL
  landmines are preserved and correct: (1) CPS is shown stack-safe ONLY with a trampoline;
  naked CPS is explicitly labeled as still overflowing and "Do NOT present naked CPS as a
  fix"; (2) the "no reliable TCO in V8/Node" claim is correct and the kangax compat-table
  "Node 2/2" cell is explicitly flagged as a false positive with the correct remedy (cite
  Chrome 0/2 + empirical overflow); (3) TS typing gotchas are honored -- tagged-union
  `Bounce<T>`, custom `isNested` guard (with the `Array.isArray` narrowing rationale),
  explicit `Generator<Yield, Return, Next>` return typing, and no DOM-global names
  (`Item`/`Nested`, not `Node`).
- **Progressive disclosure:** Both reference files exceed 100 lines and carry a top-of-file
  "## Contents" TOC. Reference files are one level deep and link to no other reference file
  (verified: zero `.md` cross-links, zero `references/` link paths in the reference files).
- **Repo hygiene:** All four files are 100% ASCII (0 non-ASCII code points; arrows are `->`,
  no smart punctuation). No work-email literal (neither the work domain nor the local-part, in any form) anywhere in the
  skill. No contradiction of the locked `transformations.md` -- the TS/JS overlay is layered
  as a source-sanctioned heuristic on top of the caveat that `transformations.md`
  deliberately leaves out of scope.

## Info

### IN-01: "Confirm the green phase" reuses "green" in two senses within one step

**File:** `plugins/lz-tdd/skills/lz-tpp/SKILL.md:44-47`
**Issue:** Coach decision procedure step 1 is titled "Confirm the green phase" but then
describes the entry conditions for choosing a transformation as "Exactly one new failing
(red) test, all prior tests green, and the code compiles". Two sentences later the same
step says "If the tests are green ... that is a refactoring". The word "green" is thus used
in two distinct senses inside a single step: (a) the make-it-pass step of red-green-refactor
(the intended meaning of the heading), and (b) all tests currently passing (the refactoring
trigger). A reader skimming the heading could momentarily misread it as "the tests are
already green" -- the opposite of the transformation precondition. The meaning is
recoverable from context and may be intentional idiom, so this is a clarity nit, not a
correctness defect.
**Fix:** Disambiguate the heading, e.g. "Confirm you are in the make-it-green step." so the
label names the activity rather than a test-suite state:
```markdown
1. Confirm you are in the make-it-green step. Exactly one new failing (red) test, all
   prior tests green, and the code compiles -> you are choosing a transformation. If all
   tests are already green and the request is "clean this up", that is a refactoring
   (structure-only) -- do not priority-rank it.
```

### IN-02: TOC in the 506-line TCO reference is plain text, not clickable anchors

**File:** `plugins/lz-tdd/skills/lz-tpp/references/typescript-and-tco.md:24-41`
**Issue:** `typescript-and-tco.md` is the largest file under review (506 lines) yet its
"## Contents" section is a plain-text bullet list with zero anchor links
(`[...](#...)`), whereas the shorter `fibonacci-worked-example.md` (226 lines) uses a fully
linked TOC (9 anchor links). For the file that most benefits from in-page navigation, the
non-clickable TOC is a minor progressive-disclosure/usability gap and an inconsistency
between the two reference files' conventions. It does not affect content correctness.
**Fix:** Convert the Contents bullets to GitHub-style anchor links to match
`fibonacci-worked-example.md`, e.g.:
```markdown
- [Paired katas (TPP-05)](#paired-katas-tpp-05)
  - [Kata 1: sum of 1..n (linear recursion)](#kata-1-sum-of-1n-linear-recursion)
- [The no-reliable-TCO reality (TPP-07)](#the-no-reliable-tco-reality-tpp-07)
```

---

_Reviewed: 2026-07-02T10:32:45Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: deep_
