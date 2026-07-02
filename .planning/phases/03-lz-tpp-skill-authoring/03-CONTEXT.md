# Phase 3: lz-tpp Skill Authoring - Context

**Gathered:** 2026-07-02
**Status:** Ready for planning

<domain>
## Phase Boundary

Author the working dual-mode `lz-tpp` skill on top of Phase 2's locked source: an
auto-triggering TDD coach plus an on-demand reference, invocable as `/lz-tdd:lz-tpp`.
It ships a lean `SKILL.md` (tuned triggering description, coach decision procedure,
impasse/backtrack guidance, reference pointers) plus bundled `references/` material:
paired functional/imperative TypeScript examples, at least one full worked example
applied test-by-test in monotonic TPP priority order, and TS/JS TCO-safe recursion
guidance. Requirements: SKILL-01, SKILL-02, SKILL-03, SKILL-04, SKILL-05, SKILL-06,
TPP-05, TPP-06, TPP-07.

This phase clarifies HOW to author the skill against what is already scoped and against
the Phase-2 `transformations.md` (which it references and does NOT modify). It does NOT
write README/LICENSE (Phase 4) or build skill-creator evals / tune the description
empirically (Phase 5).

</domain>

<decisions>
## Implementation Decisions

### Reference-file organization & progressive disclosure
- **D-01:** Phase 3 adds focused reference files under
  `plugins/lz-tdd/skills/lz-tpp/references/` ALONGSIDE the existing (Phase-2, LOCKED)
  `transformations.md`, which is NOT modified:
  - a worked-example file -- the full Fibonacci walk applied test-by-test in monotonic
    TPP priority order, in TypeScript (TPP-06);
  - a TypeScript file -- the paired functional/imperative examples (TPP-05) plus the
    TS/JS TCO reality, the stack-safe patterns, and the recurse-vs-iterate decision
    guide (TPP-07).
  Split by concern is the decision; exact file names/count are Claude's discretion.
- **D-02:** `SKILL.md` body stays lean (well under the ~500-line / ~1.5-2k-word
  guidance, SKILL-06). The body contains: the tuned `description` (frontmatter), the
  amended red-green-refactor framing, the concrete coach decision procedure, the
  impasse/backtrack heuristic, the one-line transformations-vs-refactorings distinction,
  and POINTERS to `references/` (full 14-item list + rationale in `transformations.md`;
  worked example + TS examples + TCO guidance in their files). Heavy material is NEVER
  inlined in the body (anti-feature: bloated SKILL.md).

### Skill behavior: dual-mode invocation + coach scope
- **D-03:** ONE skill with DEFAULT frontmatter -- do NOT set `disable-model-invocation`
  or `user-invocable: false` (SKILL-02). It auto-triggers as the coach during
  red-green-refactor TDD; explicit `/lz-tdd:lz-tpp` invocation serves the reference
  explanation. The body routes by intent: a failing test + current code -> coach mode;
  "explain TPP / what does (X) mean / why this order" -> reference mode.
- **D-04:** Coach behavior (SKILL-03) follows the concrete decision procedure from
  FEATURES.md Part 2: confirm the green phase; enumerate candidate minimal changes that
  pass the red test; classify each as a transformation and map it to the canonical list;
  recommend the highest-priority (lowest-numbered) available transformation and NAME it;
  apply the TS/JS overlay when it changes the pick; run the impasse check (pose a
  simpler test / small structure-only refactor before forcing a low-priority
  transformation). Show the minimal diff and the named transformation; NEVER edit the
  user's code or run tests unless explicitly asked -- coach, don't drive (PROJECT
  out-of-scope boundary).
- **D-05:** Anti-dogma framing throughout: present TPP as a heuristic (informal, roughly
  ordered, language-specific), explain the WHY, and allow deviation with a stated reason.
  No "ALWAYS use transformation N" mandates. Reference behavior (SKILL-04) explains the
  list and its ordering rationale from `transformations.md` on demand.

### TypeScript examples & TCO guidance (TPP-05/06/07)
- **D-06:** Worked example (TPP-06) = Fibonacci in TypeScript, applied test-by-test in
  monotonic priority order (the canonical FibTPP walk: `({} -> nil)`, `(nil ->
  constant)`, `(unconditional -> if)` + `(constant -> scalar)`, `(statement ->
  tail-recursion)`, then unwound to `(if -> while)` + `(variable -> assignment)` for
  stack safety). Word Wrap is referenced as the impasse illustration (already summarized
  in `transformations.md` / FEATURES), NOT a second full walk in v1.
- **D-07:** Paired functional/imperative examples (TPP-05) = the two katas from
  `TPP-TYPESCRIPT.md`: Kata 1 (sum 1..n, LINEAR -- clean paradigm divergence: functional
  reaches `(statement -> tail-recursion)` #9 then must pay for stack safety; imperative
  reaches `(if -> while)` #10 + `(variable -> assignment)` #13 and gets it for free) and
  Kata 2 (flatten a nested list, TREE -- shows tail-recursion is not even available, so
  both paradigms converge on an explicit stack / generator). Together they show how
  transformation-priority choices shift by paradigm.
- **D-08:** TCO-alternative guidance (TPP-07) follows `TPP-TYPESCRIPT.md`'s teach-vs-mention
  split: TEACH the iterative default (`(if -> while)` + `(variable -> assignment)`) and
  the trampoline (first-class); TEACH generator-as-state-machine and fold/reduce
  (secondary); MENTION CPS and state EXPLICITLY that it is stack-safe ONLY when paired
  with a trampoline (never a standalone fix -- the single most likely misinformation);
  MENTION mutual-recursion trampolining. State the "no reliable TCO in JS/TS" reality
  (only JavaScriptCore/Safari implements ES6 proper tail calls; V8/SpiderMonkey do not;
  the kangax compat-table "Node 2/2" cell is a false positive) and the
  transformation-vs-refactoring distinction (recurse-vs-iterate at green time is a
  transformation; converting an already-green recursive solution to a stack-safe form is
  a refactoring -- UNLESS a deep-input test pins behavior, then stack safety is
  behavioral). Include the decision guide (deep-input test? -> stack safety is
  behavioral -> the chosen transformation must itself be stack-safe).
- **D-09:** The TS/JS language overlay (prefer `(if -> while)` and `(variable ->
  assignment)` above the recursion transformations) is presented as an opinionated,
  SOURCE-SANCTIONED overlay (FibTPP's own language-specificity note + the TCO rationale),
  framed as a heuristic with a stated reason -- NOT a contradiction of the canonical list
  and NOT dogma.

### Triggering description (SKILL-05)
- **D-10:** Author a SCOPED triggering `description` (<= 1024 chars) now: third-person
  ("This skill should be used when..."), firing on red-green-refactor / TDD / "next
  transformation" / "make the failing test pass" / Transformation Priority Premise /
  transformation-priority contexts, and explicitly NOT on generic "write a function /
  write code" requests. Empirical trigger + behavior tuning (should/should-not-trigger
  evals, coaching-accuracy evals) is DEFERRED to Phase 5 (EVAL-01/02). Exact wording is
  Claude's discretion within this posture.

### Claude's Discretion
- Exact reference file names/count beyond the D-01 split by concern.
- Exact `description` wording within the D-10 scoped posture (tuned in Phase 5).
- Whether the coach procedure lives entirely in the SKILL.md body or partly in a small
  `references/` file, as long as the body carries the operational summary and stays lean.
- Exact TS example ordering/formatting and which kata leads.
- Whether to include a one-line-per-transformation cheat sheet (FEATURES lists it as
  v1.x; optional, low priority).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Skill behavior, structure, and feature scope (PRIMARY)
- `.planning/research/FEATURES.md` Part 1 -- the skill feature landscape: table stakes,
  differentiators, anti-features (over-broad description, bloated SKILL.md, auto-editing
  code, dogma), MVP definition, the concrete Coach Decision Procedure, and the
  prioritization matrix. PRIMARY for SKILL-01..06.
- `.planning/research/FEATURES.md` Part 2 -- canonical TPP subject matter (the Fibonacci
  worked walk in Java to translate to TS; the amended RGR process; the coach decision
  procedure sketch). Grounds reference behavior and the worked example.

### TypeScript / TCO (PRIMARY for TPP-05/06/07)
- `.planning/research/TPP-TYPESCRIPT.md` -- the TS/JS TCO reality (engine status, V8/Node
  overflow, compat-table caveat), the 5 stack-safe patterns with teach-vs-mention
  guidance, the transformation-vs-refactoring framing, the decision guide, the two
  verified katas (Kata 1 sum 1..n; Kata 2 flatten), and the TS typing gotchas
  (tagged-union `Bounce<T>`, custom `isNested` guard, generator return typing, DOM name
  collisions). All patterns are `tsc --strict`-clean and executed on Node v24.

### Locked Phase-2 source (DO NOT MODIFY)
- `plugins/lz-tdd/skills/lz-tpp/references/transformations.md` -- the canonical 14-item
  list, provenance, notation notes, amended RGR, and the author's hedges. The skill
  references it (progressive disclosure) and the reference behavior explains from it.
- `.planning/phases/02-tpp-source-distillation/02-CONTEXT.md` -- Phase-2 decisions
  (D-01..D-08) that locked the source-of-truth.

### Skill/plugin authoring rules & pitfalls
- `.planning/research/ARCHITECTURE.md` -- skill structure and progressive-disclosure
  layout.
- `.planning/research/STACK.md` -- SKILL.md frontmatter field rules (`name` <= 64 chars,
  `description` <= 1024 chars, `disable-model-invocation`/`user-invocable` defaults,
  version OMITTED, body < 500 lines).
- `.planning/research/PITFALLS.md` -- skill-authoring pitfalls: over-broad/pushy-everywhere
  description, bloated SKILL.md, reference-only-that-does-not-coach, rigid-dogma framing,
  and ASCII-only content.
- `CLAUDE.md` (project) "Technology Stack" -- SKILL.md frontmatter table, the 1,024-char
  description cap, progressive disclosure, dual-mode invocation control, and the
  "What NOT to Use (v1)" table.

### Requirements & success criteria
- `.planning/REQUIREMENTS.md` -- SKILL-01..06, TPP-05, TPP-06, TPP-07, and the Out of
  Scope table (no auto-edit/auto-run of user code; no `version` field in SKILL.md
  frontmatter).
- `.planning/ROADMAP.md` -- Phase 3 goal, the 5 success criteria, and the 3-plan sketch.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `plugins/lz-tdd/skills/lz-tpp/references/transformations.md` (Phase 2, 226 lines,
  LOCKED) is the canonical source the skill references; its sections (list, provenance,
  RGR, hedges, notation) ARE the reference-behavior content.
- The Phase-1 placeholder `SKILL.md` (deliberately non-triggering) is REPLACED with the
  real dual-mode skill this phase.
- `TPP-TYPESCRIPT.md` ships runnable, `--strict`-clean patterns and two katas verified on
  Node v24.18.0 / tsc 6.0.3 -- the executor can lift them near-verbatim, reducing
  authoring risk.
- FEATURES.md Part 2 has the Fibonacci walk (Java) to translate to TypeScript for TPP-06.

### Established Patterns
- Progressive disclosure: lean `SKILL.md` body + heavy content in bundled `references/*`
  loaded on demand.
- ASCII-only committed content (arrows `->`, no smart punctuation) -- repo convention.
- Directory-name == frontmatter `name` == `lz-tpp` so the namespace resolves to
  `/lz-tdd:lz-tpp` (Phase-1 D-08/D-11).

### Integration Points
- `references/` is auto-discovered; SKILL.md points at the files, loaded on demand.
- Consumed downstream by Phase 4 (README/authoring review: plugin-validator +
  skill-reviewer) and Phase 5 (skill-creator trigger + behavior evals).
- The skill auto-triggers via its `description`; explicit invocation is `/lz-tdd:lz-tpp`.

</code_context>

<specifics>
## Specific Ideas

- All TypeScript examples must be `tsc --strict`-clean; `TPP-TYPESCRIPT.md` verified them
  on Node v24.18.0 / tsc 6.0.3. Honor its typing notes: the tagged-union `Bounce<T>`
  trampoline variant when the payload can be a function, a custom `isNested` type guard
  (`Array.isArray` does not narrow a `readonly` union), explicit generator return typing,
  and avoiding DOM-global name collisions (`Node`, `Text`, `Range`).
- CPS MUST be presented as requiring a trampoline -- never a standalone stack-safety fix.
- Do NOT trust the kangax compat-table "Node 2/2" proper-tail-calls cell; cite the Chrome
  row + the empirical V8 overflow.
- The single "if everything else fails, this must be correct" core is the
  transformation-priority guidance -- keep the coach's next-transformation choice
  correct and the reference faithful to `transformations.md`.

</specifics>

<deferred>
## Deferred Ideas

- **Skill-creator trigger + behavior evals and empirical `description` tuning** -> Phase 5
  (EVAL-01/02).
- **README + MIT LICENSE + first-party authoring review (plugin-validator / skill-reviewer)**
  -> Phase 4 (DIST-01/02/03).
- **Additional worked examples (full Word Wrap walk, Prime Factors) and additional
  languages (Python/Go/C#/Clojure ordering variants)** -> v1.x / v2+ (NEXT-04); out of
  scope for 0.0.1.
- **Quick-reference one-line-per-transformation cheat sheet** -> v1.x (FEATURES "Add After
  Validation").

</deferred>

---

*Phase: 3-lz-tpp Skill Authoring*
*Context gathered: 2026-07-02*
