# Phase 3: lz-tpp Skill Authoring - Research

**Researched:** 2026-07-02
**Domain:** Claude Code Agent Skill authoring (dual-mode coach + reference) for the Transformation Priority Premise (TPP), shipped as `lz-tpp` under the `lz-tdd` plugin. Deliverables are Markdown (SKILL.md + references/*.md with fenced TypeScript), NOT standalone code.
**Confidence:** HIGH

> Synthesis note: the design space is already heavily researched in this repo (FEATURES.md,
> TPP-TYPESCRIPT.md, ARCHITECTURE.md, STACK.md, PITFALLS.md). This RESEARCH.md distills those
> into plan-ready guidance and adds one thing they lacked: a fresh (2026-07-02) verification
> of Anthropic's CURRENT Agent Skills authoring docs, which resolves the description char-limit
> ambiguity and adds two concrete progressive-disclosure rules. It does NOT re-derive the TPP
> list or re-verify the TS/TCO patterns.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Reference-file organization & progressive disclosure**

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

**Skill behavior: dual-mode invocation + coach scope**

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

**TypeScript examples & TCO guidance (TPP-05/06/07)**

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

**Triggering description (SKILL-05)**

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

### Deferred Ideas (OUT OF SCOPE)

- **Skill-creator trigger + behavior evals and empirical `description` tuning** -> Phase 5
  (EVAL-01/02).
- **README + MIT LICENSE + first-party authoring review (plugin-validator / skill-reviewer)**
  -> Phase 4 (DIST-01/02/03).
- **Additional worked examples (full Word Wrap walk, Prime Factors) and additional
  languages (Python/Go/C#/Clojure ordering variants)** -> v1.x / v2+ (NEXT-04); out of
  scope for 0.0.1.
- **Quick-reference one-line-per-transformation cheat sheet** -> v1.x (FEATURES "Add After
  Validation").
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| SKILL-01 | `lz-tpp` lives at `plugins/lz-tdd/skills/lz-tpp/SKILL.md`, invocable as `/lz-tdd:lz-tpp` | Path + namespace already fixed (Phase 1). Frontmatter `name: lz-tpp` == dir name == command segment. See Standard Stack + Architecture Patterns; validated by `claude plugin validate` [VERIFIED: claude 2.1.198 present]. |
| SKILL-02 | Auto-triggers as coach (default frontmatter, not disabled) AND explicitly invocable as reference | D-03. OMIT `disable-model-invocation` (default false = auto-trigger) and `user-invocable` (default true = `/lz-tdd:lz-tpp` works). [CITED: docs.claude.com Agent Skills best-practices, fetched 2026-07-02]. See Pattern 4 (dual-mode routing). |
| SKILL-03 | Coach recommends next transformation by TPP priority via a concrete procedure incl. backtracking / posing a simpler test at impasse | D-04. The 7-step Coach Decision Procedure from FEATURES.md Part 2, embeddable as a workflow checklist (docs "workflow for Skills without code" pattern). See Code Examples + Pattern 2. |
| SKILL-04 | Reference behavior: explains transformations + ordering rationale on demand | D-03/D-05. Reference-mode route reads the LOCKED `references/transformations.md` (14-item list + provenance + rationale + hedges). See Component Responsibilities. |
| SKILL-05 | `description` tuned to trigger on TDD/transformation/TPP contexts without over-triggering; <= 1024 chars | D-10. Field cap is **1024 chars, VERIFIED** against current docs [CITED: docs.claude.com]. Draft a scoped POSTURE now; Phase 5 tunes empirically. See Pattern 5 + Code Examples. |
| SKILL-06 | SKILL.md lean via progressive disclosure (body well under ~500 lines / ~1.5-2k words); heavy material in `references/` | D-01/D-02. Docs confirm <500-line body, references one level deep, TOC for reference files >100 lines. See Pattern 1 + Validation Architecture. |
| TPP-05 | Paired functional + imperative TypeScript examples showing paradigm-driven priority shift | D-07. Kata 1 (sum, linear) + Kata 2 (flatten, tree) from TPP-TYPESCRIPT.md -- verified runnable, `tsc --strict`-clean on Node v24.18.0. Lift near-verbatim. See Code Examples. |
| TPP-06 | At least one full worked example applied test-by-test in monotonic priority order | D-06. Fibonacci walk (FEATURES Part 2 has the Java source to translate to TS). Word Wrap referenced as impasse illustration only. See Code Examples + Pitfall 6. |
| TPP-07 | JS/TS TCO reality + stack-safe alternatives (trampoline, generator, CPS) + when to prefer iterative | D-08/D-09. Full teach-vs-mention split + engine status + decision guide + typing gotchas all in TPP-TYPESCRIPT.md. See Don't Hand-Roll + Pitfalls 3/4/5. |
</phase_requirements>

## Summary

Phase 3 is a **content-authoring** phase, not a coding phase: it replaces the Phase-1
placeholder `SKILL.md` with a real dual-mode Agent Skill and adds two new bundled
reference files under `references/`, all built on the LOCKED Phase-2 `transformations.md`.
Because the design decisions are already locked in CONTEXT.md (D-01..D-10) and the subject
matter is already distilled and verified (FEATURES.md Part 2, TPP-TYPESCRIPT.md), the
planner's job is to sequence the WRITING and MECHANICAL VERIFICATION of these Markdown
artifacts, not to make architecture choices.

The one genuinely new input this research adds is a fresh (2026-07-02) read of Anthropic's
current Agent Skills authoring docs. That read (1) **confirms the `description` field cap is
exactly 1024 chars** (resolving an ambiguity in STACK.md, which also mentioned a separate
1,536-char listing truncation), (2) confirms the dual-mode default-frontmatter posture
(omit `disable-model-invocation` and `user-invocable`), and (3) adds two concrete
progressive-disclosure rules that directly shape the multi-file `references/` layout:
**keep references one level deep from SKILL.md** (no reference file linking to another), and
**give any reference file over 100 lines a table of contents at the top**. It also validates
the shape of the coach: the docs' "workflow for Skills without code" checklist pattern is
exactly how the 7-step Coach Decision Procedure should be embedded, and the docs' "flexible
guidance / use your best judgment" template posture is exactly the anti-dogma framing D-05
requires.

The single load-bearing correctness core (per PROJECT.md and CONTEXT specifics) is the
transformation-priority guidance: the coach must name the CORRECT highest-priority available
transformation, and the reference must stay faithful to `transformations.md`. The TS/TCO
material carries three preserved landmines the planner must protect: CPS is stack-safe ONLY
with a trampoline; the kangax compat-table "Node 2/2" cell is a false positive; and the TS
typing gotchas (tagged-union `Bounce<T>`, custom `isNested` guard, explicit generator return
typing, DOM-global name collisions) must survive verbatim from TPP-TYPESCRIPT.md.

**Primary recommendation:** Author a lean SKILL.md (dual-mode router + 7-step coach workflow
+ impasse heuristic + one-line distinctions + pointers) and two TOC-headed reference files
(`fibonacci-worked-example.md` for TPP-06; `typescript-and-tco.md` for TPP-05+TPP-07),
lifting the verified TS from TPP-TYPESCRIPT.md near-verbatim; do NOT touch
`transformations.md`; verify mechanically (frontmatter parse, <=1024-char description,
line/word budget, one-level-deep links, per-file TOC, ASCII-only, `claude plugin validate .`),
and defer all trigger/behavior accuracy to Phase 5 evals.

## Architectural Responsibility Map

This is a single-skill Markdown deliverable, not a multi-tier application. The meaningful
"tiers" are the three progressive-disclosure loading levels of an Agent Skill. Each phase
capability is mapped to the artifact (tier) that owns it, so the planner can sanity-check
that heavy material never leaks up into the always-loaded or trigger-loaded tiers.

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Auto-trigger on TDD/TPP contexts (SKILL-02, SKILL-05) | Frontmatter `description` (always-loaded metadata) | -- | Description is the SOLE triggering mechanism; must be self-contained and <=1024 chars. |
| Dual-mode intent routing (D-03) | SKILL.md body (loaded on trigger) | -- | Routing decides coach vs reference; cheap, must be in the body. |
| Coach decision procedure (SKILL-03, D-04) | SKILL.md body | small `references/` file only if body strains budget (discretion) | Core value; the operational summary must live in the body per D-02. |
| Impasse / backtrack heuristic (SKILL-03) | SKILL.md body | -- | Highest-value coach move; belongs with the procedure. |
| Reference explanation of the list + rationale (SKILL-04) | `references/transformations.md` (on demand, LOCKED) | SKILL.md body (one-line distinction + pointer) | Full 14-item list + hedges are bulky; load only when explaining. |
| Fibonacci worked example (TPP-06) | new `references/` worked-example file (on demand) | SKILL.md body (pointer) | Full test-by-test walk is long; must not bloat the body. |
| Paired functional/imperative katas (TPP-05) | new `references/` TypeScript file (on demand) | SKILL.md body (pointer + 1-line overlay note) | Runnable code blocks are heavy; on-demand tier. |
| TCO reality + stack-safe patterns (TPP-07) | same new `references/` TypeScript file (on demand) | SKILL.md body (1-line "no reliable TCO; prefer iterative" overlay) | Engine status + 5 patterns + decision guide are reference-grade depth. |

## Standard Stack

This is a file-format + toolchain "stack," not a runtime dependency stack. No packages are
installed by this phase (see Package Legitimacy Audit).

### Core
| Technology | Version | Purpose | Why Standard |
|------------|---------|---------|--------------|
| `SKILL.md` + Agent Skills format | Agent Skills open standard; Claude Code >= 2.1.x | The skill: YAML frontmatter (`name`+`description`) + Markdown body + `references/` | The single required file per skill; `description` drives auto-triggering, dir name drives `/lz-tdd:lz-tpp`. [CITED: docs.claude.com Agent Skills best-practices, 2026-07-02] |
| `references/*.md` (bundled) | n/a (Markdown) | On-demand progressive-disclosure tier: full list, worked example, TS/TCO | Docs-blessed way to keep the body lean; loaded only when the body points to them. [CITED: docs.claude.com] |
| `claude plugin validate` (built-in CLI) | claude 2.1.198 (installed) | Structural gate: marketplace/plugin/skill frontmatter, paths, dup names | Authoritative first-party validator. [VERIFIED: `claude --version` -> 2.1.198] |

### Supporting (verification toolchain, not shipped)
| Tool | Version | Purpose | When to Use |
|------|---------|---------|-------------|
| Node.js | v24.18.0 (installed) | Run/extract-check the fenced TS examples if desired | Optional confirmatory TS check; matches the exact env TPP-TYPESCRIPT.md verified on. [VERIFIED: `node --version`] |
| TypeScript `tsc` | 6.0.3 (global, installed) | `tsc --strict` type-check extracted examples | Optional; the patterns are already `--strict`-clean per TPP-TYPESCRIPT.md. [VERIFIED: `tsc --version`] |
| `tsx` | not global (use `npx tsx` if needed) | Execute extracted examples | Optional; only if the planner wants a runtime re-confirmation. [VERIFIED: `tsx` not on PATH; `npx` 11.16.0 present] |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Two new reference files (D-01 split) | One combined `references/` file | D-01 locks the split-by-concern; combining would re-bloat one file and violate the decision. Keep two. |
| `lz-tpp` skill name | Gerund-form name (docs suggest e.g. `coaching-transformations`) | Docs list noun-phrase/acronym names as "acceptable alternatives"; the name is LOCKED by Phase-1 (dir name == command). Do NOT rename. |

**Installation:** None. This phase writes Markdown files only.

**Version verification:** No packages to verify. Toolchain versions confirmed live above
(node v24.18.0, tsc 6.0.3, claude 2.1.198, npx 11.16.0, python 3.13.6).

## Package Legitimacy Audit

**Not applicable.** This phase installs no external packages. Deliverables are Markdown
(SKILL.md + references/*.md with fenced TypeScript). The fenced TypeScript uses only the
standard library and language features (no imports beyond built-ins); it is documentation,
not an installed/executed dependency. No npm/PyPI/crates install occurs, so the slopcheck /
registry-verification gate has nothing to audit.

**Packages removed due to slopcheck [SLOP] verdict:** none (no packages).
**Packages flagged as suspicious [SUS]:** none (no packages).

## Architecture Patterns

### System Architecture Diagram

Data flow of the dual-mode skill during a session (progressive-disclosure loading tiers):

```
                         SESSION CONTEXT
                               |
      +------------------------+------------------------+
      | (always-loaded metadata: name + description)    |
      | description matches TDD/TPP/transformation      |
      | intent?                                         |
      +------------------------+------------------------+
                               | yes
                               v
                    SKILL.md BODY loads (on trigger)
                               |
                    +----------+-----------+
                    |  DUAL-MODE ROUTER    |
                    +----------+-----------+
              failing test + code |        | "explain TPP / why this
              present             |        | order / what does (X) mean"
                    v             |        v
        +-----------------------+ |  +--------------------------+
        | COACH MODE            | |  | REFERENCE MODE           |
        | run 7-step procedure  | |  | explain list + rationale |
        +-----------+-----------+ |  +------------+-------------+
                    |             |               |
       needs full   |             |    reads on   |
       list / TS    |             |    demand     |
       depth        v             |               v
        +--------------------------+   +--------------------------+
        | references/ (on demand)  |   | references/              |
        |  transformations.md      |   |  transformations.md      |
        |  fibonacci-worked-...md  |   |  (LOCKED; the reference  |
        |  typescript-and-tco.md   |   |   corpus)                |
        +------------+-------------+   +--------------------------+
                     |
                     v
        COACH OUTPUT: named transformation + minimal diff + rationale
        (SHOW, do not edit code or run tests -- coach, don't drive)
```

The two modes share the same trigger and the same reference corpus; they differ only in
what the body does with the input. Explicit `/lz-tdd:lz-tpp` invocation enters the same body
and naturally lands in reference mode (or coach mode if the user supplies a test + code).

### Recommended Project Structure

```
plugins/lz-tdd/skills/lz-tpp/
|-- SKILL.md                              # REPLACE placeholder; lean dual-mode body
'-- references/
    |-- transformations.md                # LOCKED (Phase 2, 226 lines) -- DO NOT MODIFY
    |-- fibonacci-worked-example.md        # NEW (TPP-06); TOC required (>100 lines)
    '-- typescript-and-tco.md              # NEW (TPP-05 + TPP-07); TOC required (>100 lines)
```

File names for the two NEW files are Claude's discretion (D-01); the names above are a
recommendation that matches the split-by-concern decision. What is NOT discretionary: the
count is two new files (one worked-example file, one TS+TCO file per D-01), and both must be
linked directly from SKILL.md (one level deep).

### Pattern 1: Progressive disclosure, one level deep, TOC-headed references
**What:** SKILL.md body stays under ~500 lines / ~1.5-2k words and points DIRECTLY at each
reference file; each reference file over 100 lines opens with a table of contents.
**When to use:** Mandatory here (SKILL-06, D-02).
**Why it is load-bearing (VERIFIED today):** The current docs warn that Claude may
partial-read (`head -100`) files reached through NESTED references, yielding incomplete
information -- so every reference file must link directly from SKILL.md, never from another
reference file. And files over 100 lines need a TOC so a partial read still shows the full
scope. The two NEW reference files will both exceed 100 lines, so both need a TOC.
**Example (SKILL.md body pointer block):**
```markdown
## Reference material

- Full 14-item transformation list, provenance, and rationale:
  see [references/transformations.md](references/transformations.md)
- Fibonacci applied test-by-test in priority order:
  see [references/fibonacci-worked-example.md](references/fibonacci-worked-example.md)
- Paired functional/imperative TypeScript + TCO-safe recursion guidance:
  see [references/typescript-and-tco.md](references/typescript-and-tco.md)
```
Source: [CITED: docs.claude.com Agent Skills best-practices, "Progressive disclosure
patterns" + "Avoid deeply nested references" + "Structure longer reference files with table
of contents", fetched 2026-07-02].

### Pattern 2: Coach decision procedure as a "workflow for Skills without code"
**What:** Embed the 7-step Coach Decision Procedure as an explicit numbered workflow the
model follows, optionally as a copyable checklist.
**When to use:** SKILL-03 / D-04; this is the Core Value.
**Why:** The docs explicitly bless the "workflow for Skills without code" pattern (their
"Research synthesis workflow" example is a numbered analysis procedure identical in shape to
our coach procedure). This turns the coach from vibes into a repeatable algorithm.
**Example:** see Code Examples below for the concrete 7-step body.

### Pattern 3: Impasse handling as a feedback loop
**What:** When the only transformation that passes the current red test is low-priority
(`(expression -> function)` #12 or `(case)` #14), do NOT force it: (a) pose a DIFFERENT,
simpler test passable by a higher-priority transformation (optionally skip/`@Ignore` the
hard test); (b) check whether a structure-only refactoring opens a higher-priority path;
(c) only then take the low-priority transformation, stating why it was unavoidable.
**When to use:** SKILL-03; the premise's actual payoff (escape local maxima).
**Why:** Maps onto the docs' "feedback loop: validator -> fix -> repeat" pattern where, for a
Skill without code, the "validator" is the priority list and the "fix" is choosing a better
NEXT TEST. Word Wrap is the illustration (referenced, not re-walked; D-06).

### Pattern 4: Dual-mode routing on default frontmatter
**What:** ONE skill, default frontmatter (omit `disable-model-invocation` and
`user-invocable`), body routes by intent.
**When to use:** SKILL-02 / D-03.
**Why:** Default `disable-model-invocation: false` => auto-triggers as coach; default
`user-invocable: true` => `/lz-tdd:lz-tpp` works for the reference. No frontmatter flags
needed to get both modes. [CITED: docs.claude.com]. Body opens with a short router: "If the
user has a failing test and current code, coach the next transformation (below). If the user
asks what TPP is / why this order / what a transformation means, explain from
references/transformations.md."

### Component Responsibilities

| Component | Owns / Responsibility | Must NOT do |
|-----------|-----------------------|-------------|
| Frontmatter `description` | Triggering (what + when), <=1024 chars, third-person, scoped trigger terms | Contain XML tags; contain "claude"/"anthropic"; over-trigger on generic coding; carry a `version` field |
| SKILL.md body | Router, 7-step coach procedure, impasse heuristic, one-line distinctions, TS/JS overlay note, pointers | Inline the full list, the worked example, or the TS/TCO depth (that is bloat); instruct auto-edit/auto-run |
| `references/transformations.md` (LOCKED) | The 14-item list, provenance, RGR, hedges, notation -- the reference-behavior corpus | Be modified in this phase (Phase-2 locked it) |
| `references/fibonacci-worked-example.md` (NEW) | TPP-06 monotonic Fibonacci walk in TS; TOC at top | Skip priority steps; use non-ASCII arrows |
| `references/typescript-and-tco.md` (NEW) | TPP-05 katas + TPP-07 TCO reality/patterns/decision-guide/typing gotchas; TOC at top | Present CPS as a standalone fix; trust the compat-table Node cell; link to a further nested reference file |

### Anti-Patterns to Avoid
- **Bloated SKILL.md:** inlining the full 14-item list, the worked example, or the 5 TCO
  patterns in the body. Push all of it to `references/`; keep only the operational summary
  + pointers. (PITFALLS Pitfall 7.)
- **Reference-only skill:** shipping a body that recites/explains but has no decision
  procedure. The coach procedure IS the product. (PITFALLS Pitfall 4.)
- **Rigid dogma:** "ALWAYS use transformation N" / "you violated TPP." Frame as heuristic
  with rationale; allow stated-reason deviation. (D-05, PITFALLS Pitfall 2.)
- **Deeply nested references:** SKILL.md -> file A -> file B. Keep every reference one level
  deep. (VERIFIED docs rule.)
- **Modifying transformations.md:** it is Phase-2 LOCKED. New material goes in new files.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| The transformation list / its provenance | A fresh transcription or a "from memory" list | Point to the LOCKED `references/transformations.md` | It is verbatim-faithful, cited, and reconciles the 12-vs-14 discrepancy. Re-deriving risks drift (PITFALLS Pitfall 3). |
| Stack-safe recursion patterns in TS | New trampoline/generator/CPS code written from scratch | Lift the 5 verified patterns from TPP-TYPESCRIPT.md near-verbatim | All are `tsc --strict`-clean and executed at depth 1,000,000 on Node v24.18.0. Rewriting reintroduces the typing gotchas. |
| The Fibonacci walk | A new invented kata | Translate FEATURES.md Part 2's FibTPP Java walk to TS, step-for-step | The canonical walk is guaranteed monotonic in priority order; invented walks often violate it (PITFALLS Pitfall 6/11). |
| The paired katas | New examples of paradigm divergence | Kata 1 (sum) + Kata 2 (flatten) from TPP-TYPESCRIPT.md | Already designed to show the exact #9-vs-#10/#13 divergence and the tree-recursion "no tail form" lesson. |
| TCO engine status | A fresh browser/runtime compat claim | Cite TPP-TYPESCRIPT.md's verified table + the empirical V8 overflow | The compat-table "Node 2/2" cell is a known false positive; hand-checking risks repeating it. |

**Key insight:** Phase 3 is assembly + faithful translation, not invention. Every factual
claim already has a verified home in the Phase-2 reference or the TS/TCO research. The
authoring risk is drift and bloat, not missing knowledge.

## Common Pitfalls

### Pitfall 1: Description over/under-triggering tuned by feel
**What goes wrong:** The `description` fires on every "write a function" (noise) or never
fires during real TDD (inert).
**Why it happens:** Description is the sole trigger and is written once by intuition; the
docs note Claude also only consults skills for non-trivial tasks, so simple prompts will not
trigger regardless.
**How to avoid:** Draft the SCOPED posture now (D-10): trigger on TDD/red-green-refactor/
"next transformation"/"make the failing test pass"/TPP/transformation-priority + explicit
"explain TPP" requests; explicitly exclude generic "write code"/"add a feature"/plain
refactoring. Do NOT overstuff for "pushiness." Defer accuracy to Phase 5 evals.
**Warning signs:** Broad nouns ("testing", "TypeScript", "refactoring") as triggers; a
description near the 1024 cap padded with phrases.

### Pitfall 2: SKILL.md bloat (progressive-disclosure failure)
**What goes wrong:** Full list + all examples + TCO theory inline; body balloons past budget
and loads on every trigger.
**How to avoid:** Body carries only the D-02 items; everything heavy goes to `references/`
one level deep. Verify line/word budget mechanically.
**Warning signs:** Body > ~500 lines / ~2k words; the 14-item list or a full code kata
visible in SKILL.md; content duplicated between body and references.

### Pitfall 3: Presenting CPS as a standalone stack-safety fix (the #1 misinformation landmine)
**What goes wrong:** The TS/TCO file implies CPS alone fixes stack growth. It does NOT --
naked CPS overflows at the same ~10k threshold as naive recursion (verified).
**How to avoid:** Every CPS mention must state, explicitly, that CPS is stack-safe ONLY when
paired with a trampoline (return thunks, bounce off a driver loop). MENTION CPS; steer to
iteration/trampoline/generator. (D-08.)
**Warning signs:** A CPS code block presented as "the fix"; no trampoline in the CPS example.

### Pitfall 4: Trusting the kangax compat-table "Node 2/2" proper-tail-calls cell
**What goes wrong:** The TS/TCO file claims Node has PTC because the compat-table shows Node
2/2. It is a reporting artifact; Node/V8 overflows.
**How to avoid:** Cite the Chrome row (0/2) + the empirical V8 overflow (~10k frames on Node
v24), not the Node cell. State only JavaScriptCore/Safari implements ES6 PTC.
**Warning signs:** Any sentence asserting Node/Deno supports proper tail calls.

### Pitfall 5: Dropping the TS typing gotchas when lifting the patterns
**What goes wrong:** The trampoline/flatten examples fail `tsc --strict` or silently
mis-narrow because the gotcha handling was stripped.
**How to avoid:** Preserve verbatim: tagged-union `Bounce<T>` when the payload can be a
function; custom `isNested` guard (`Array.isArray` does not narrow a `readonly` union);
explicit `Generator<Yield, Return, Next>` return typing; avoid DOM-global names
(`Node`/`Text`/`Range`/`Event`) -- use `Item`/`Nested` etc.
**Warning signs:** `Array.isArray(x)` used directly on a `readonly` union; an element type
named `Node`; `Trampoline<T> = T | Thunk<T>` used where `T` can be a function.

### Pitfall 6: Worked example that does not actually follow priority order
**What goes wrong:** The Fibonacci walk skips or reorders steps, contradicting the skill's
own thesis.
**How to avoid:** Annotate EACH step with the transformation applied and its list position;
confirm each is the highest-priority-that-passes the then-current test. Translate the
canonical FibTPP walk rather than inventing one. (TPP-06, PITFALLS Pitfall 11.)
**Warning signs:** A step uses `(unconditional -> if)` where `(constant -> scalar)` would
have passed; untagged steps.

### Pitfall 7: Conflating transformations with refactorings
**What goes wrong:** The coach treats a structure-only change (extract/rename/inline) as a
priority-ranked transformation, or ranks the recurse->iterate stack-safety conversion when a
deep-input test is NOT present.
**How to avoid:** State the distinction in the body's first lines; scope the coach to the
GREEN phase; carry TPP-TYPESCRIPT.md's sharp edge -- stack-safety conversion is a refactoring
UNLESS a deep-input test pins behavior, in which case it is the transformation. (D-08,
PITFALLS Pitfall 1.)
**Warning signs:** "extract"/"rename" listed as transformations; guidance firing during the
refactor step.

### Pitfall 8: Non-ASCII content
**What goes wrong:** Smart quotes, en/em dashes, or the source's special arrow glyph leak in
and cause mojibake on the Windows cp1252 toolchain.
**How to avoid:** ASCII-only; arrows as `->`; hyphens not dashes. Grep for non-ASCII bytes as
a mechanical gate. (CLAUDE.md, PITFALLS security table.)

## Code Examples

Verified patterns and copy-ready shapes. Source tags indicate provenance.

### Frontmatter skeleton (SKILL.md)
```yaml
---
name: lz-tpp
description: >-
  [<= 1024 chars, third-person, what + when. Scoped POSTURE per D-10; Phase 5 tunes wording.]
---
```
- `name: lz-tpp` -- LOCKED; == dir name == `/lz-tdd:lz-tpp` segment; <=64 chars; no reserved
  words. [CITED: docs.claude.com]
- OMIT `disable-model-invocation`, `user-invocable`, `version`, `allowed-tools`. [CITED:
  docs.claude.com + STACK.md]

### Description posture (draft target, NOT final wording -- D-10)
A scoped example that fits the posture (well under 1024 chars; Phase 5 will tune):
```
This skill should be used during red-green-refactor TDD to recommend the next code
transformation by Transformation Priority Premise (TPP) priority, and to explain the
transformations and their ordering on demand. Use it when a failing test and current code
are present and the question is which minimal change makes the test pass, when the user
mentions TPP, transformation priority, the transformation list, or asks what a transformation
like (constant -> scalar) or ({} -> nil) means or why the order is what it is. Do not use it
for generic "write a function", "add a feature", or plain refactoring requests that are not
about choosing the next transformation.
```
[ASSUMED] exact wording -- this is a posture illustration; Phase 5 (EVAL-01) tunes it against
should/should-not-trigger sets. Provenance: shape follows D-10 + docs' "what + when,
third-person, key terms" guidance.

### Coach Decision Procedure (embed in SKILL.md body as a workflow) -- SKILL-03 / D-04
Source: [CITED: FEATURES.md Part 2 "Coach Decision Procedure"]; workflow shape [CITED:
docs.claude.com "workflow for Skills without code"].
```
1. Confirm the green phase. Exactly one new failing (red) test, prior tests green, code
   compiles -> you are choosing a transformation. If tests are green and the request is
   "clean this up," that is a refactoring (structure-only) -- do not priority-rank it.
2. Enumerate candidate minimal changes that make the red test pass. Classify each as a
   transformation and map it to the canonical 14-item list (references/transformations.md).
3. Recommend the highest-priority (lowest-numbered) available transformation, and NAME it
   (e.g. "Use (constant -> scalar): replace the literal 1 with the parameter n").
4. Apply the TS/JS overlay. Prefer (if -> while) #10 and (variable -> assignment) #13 above
   the recursion transformations (#9/#11) when it changes the pick, because JS/TS lacks
   reliable TCO. State this when it changes the recommendation.
5. Impasse check. If only a low-priority transformation ((expression -> function) #12 or
   (case) #14) passes: (a) pose a different, simpler test passable by a higher-priority
   transformation (optionally skip/@Ignore the hard test); (b) check if a structure-only
   refactoring opens a higher-priority path; (c) only then take the low-priority
   transformation, and say why it was unavoidable.
6. Show, don't drive. Present the minimal diff and the named transformation; let the
   developer apply it and run the tests. Never edit code or run tests unless explicitly asked.
7. Stay non-dogmatic. Frame every recommendation as "the simplest transformation that passes
   this test, per TPP"; the ordering is a heuristic (informal, roughly ordered, language-
   specific). Deviation with a stated reason is legitimate.
```

### TS example lift targets (for the two NEW reference files)
All snippets below are ALREADY verified `tsc --strict`-clean and executed at depth 1,000,000
on Node v24.18.0 / tsc 6.0.3. Lift near-verbatim from TPP-TYPESCRIPT.md; do not rewrite.
Source: [CITED: TPP-TYPESCRIPT.md, executed on local Node v24.18.0].

- TPP-06 (fibonacci-worked-example.md): the FibTPP walk translated to TS --
  `({} -> nil)` + `(nil -> constant)` -> `(unconditional -> if)` + `(constant -> scalar)`
  -> `(statement -> tail-recursion)` #9 -> unwound to `(if -> while)` #10 +
  `(variable -> assignment)` #13 for stack safety. Each step tagged with its list position.
- TPP-05 (typescript-and-tco.md): Kata 1 `sum(1..n)` (linear; functional reaches #9 then
  pays for stack safety; imperative reaches #10+#13 for free) and Kata 2 `flatten` (tree;
  no tail form, so both paradigms converge on explicit stack / generator).
- TPP-07 (typescript-and-tco.md): Pattern 1 trampoline (`Thunk<T>`/`Bounce<T>`), Pattern 2
  generator-as-state-machine, Pattern 3 CPS-WITH-trampoline (mention; naked-CPS-overflows
  warning), Pattern 4 iterative `(if -> while)` default, Pattern 5 fold/reduce, Pattern 6
  mutual-recursion trampolining (one sentence) + the decision guide.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Custom `commands/` dir for user-invoked actions | Skills produce the `/{plugin}:{skill}` command; `commands/` is legacy | 2026 Claude Code line | Ship a skill only; no `commands/` (already reflected in project constraints). |
| Description limit ambiguous (1024 field vs 1536 listing) | **`description` field cap = 1024 chars**; the 1536 figure was a separate listing-truncation | Confirmed 2026-07-02 | Target well under 1024; SKILL-05 satisfied by the field cap. [CITED: docs.claude.com] |
| References can nest freely | Keep references ONE level deep from SKILL.md; >100-line files get a TOC | Current docs guidance | Directly shapes the two-new-file layout; both need a TOC. [CITED: docs.claude.com] |
| ES6 mandated proper tail calls; V8 shipped behind flags | V8/Node/Deno + SpiderMonkey do NOT ship PTC; only JavaScriptCore/Safari does; STC proposal stalled | PTC removed ~2016; still true 2026 | The TS/JS overlay (prefer iteration) is a source-sanctioned consequence, not an opinion. [CITED: TPP-TYPESCRIPT.md] |

**Deprecated/outdated:**
- `version` in SKILL.md frontmatter: not a recognized skill field; OMIT (Out of Scope).
- The 12-item TPP list as canonical: superseded by the revised 14-item FibTPP list (Phase-2
  resolved this; the reference retains the 12-item list for provenance only).

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Exact `description` wording (the drafted posture example) | Code Examples | LOW -- explicitly a POSTURE; Phase 5 (EVAL-01) tunes it against eval sets. Not a locked decision. |
| A2 | Recommended new file names `fibonacci-worked-example.md` / `typescript-and-tco.md` | Recommended Project Structure | LOW -- names are Claude's discretion (D-01); only the split-by-concern + two-file count is locked. |
| A3 | Bun (JavaScriptCore) gets PTC | State of the Art / TCO | LOW -- MEDIUM-confidence in source; the skill treats "no reliable TCO" as the portable default and does not rely on Bun. |

**Note:** All TPP subject-matter, TS patterns, engine status, and skill-authoring field rules
in this research are VERIFIED (in-repo primary-sourced research) or CITED (docs.claude.com
fetched 2026-07-02). Only the three items above are assumptions, and all are low-risk.

## Open Questions

1. **Should the fenced TS examples be mechanically extracted-and-type-checked in this phase?**
   - What we know: The exact verification toolchain is present (Node v24.18.0, tsc 6.0.3),
     and TPP-TYPESCRIPT.md already verified every pattern.
   - What's unclear: Whether the planner wants a confirmatory extract+`tsc --strict` gate or
     treats the prior verification as sufficient.
   - Recommendation: Offer it as an OPTIONAL confirmatory check in Validation Architecture,
     not a blocker. If included, keep it a mechanical one-off (extract fenced ```ts blocks to
     a temp file, `tsc --strict --noEmit`), not a shipped test harness.

2. **Does the coach procedure stay entirely in the body, or partly in a small reference file?**
   - What we know: D-02 requires the operational summary in the body; the discretion note
     allows offloading detail to a small `references/` file if the body strains budget.
   - Recommendation: Keep the full 7-step procedure in the body (it is the Core Value and is
     compact). Only offload if the body approaches the line/word budget.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| `claude` CLI | `claude plugin validate .` structural gate | Yes | 2.1.198 | -- |
| Node.js | Optional TS extract/run check | Yes | v24.18.0 | -- (matches TPP-TYPESCRIPT.md env) |
| TypeScript `tsc` | Optional `tsc --strict` check | Yes | 6.0.3 | `npx typescript` |
| `tsx` | Optional runtime execution of examples | No (not global) | -- | `npx tsx` (npx 11.16.0 present) |
| Python 3 | Not required this phase | Yes | 3.13.6 | -- |

**Missing dependencies with no fallback:** none.
**Missing dependencies with fallback:** `tsx` is not global; use `npx tsx` only if the
planner opts into a runtime re-confirmation of the examples (not required; already verified).

## Validation Architecture

There is no unit-test framework for a Markdown skill deliverable. Consistent with the Phase
1/2 precedent, the validation instrument is **mechanical checks** on the authored files plus
the first-party `claude plugin validate`. Behavioral accuracy (does the coach pick the RIGHT
transformation; does the description trigger correctly) is empirical and is the domain of
Phase 5 evals -- explicitly DEFERRED and manual here.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None (Markdown deliverable). Instrument = mechanical checks + `claude plugin validate`. |
| Config file | none -- see Wave 0 |
| Quick run command | `claude plugin validate ./plugins/lz-tdd` (per-file edits) |
| Full suite command | `claude plugin validate .` + the mechanical checks below |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SKILL-01 | Skill at correct path; namespace resolves | mechanical | `test -f plugins/lz-tdd/skills/lz-tpp/SKILL.md && claude plugin validate ./plugins/lz-tdd` | exists |
| SKILL-02 | Default frontmatter (no disable/user-invocable) | mechanical | frontmatter parse: assert keys `disable-model-invocation` and `user-invocable` ABSENT | Wave 0 (parse check) |
| SKILL-05 | `description` present, <=1024 chars, no XML tags, no `version` field | mechanical | parse frontmatter; `description` length <= 1024; grep no `<...>`; grep no `^version:` | Wave 0 (parse check) |
| SKILL-05 | `name: lz-tpp` == dir name | mechanical | parse frontmatter `name` == basename(skill dir) == `lz-tpp` | Wave 0 (parse check) |
| SKILL-06 | Body under budget | mechanical | `wc -l` body < 500; word count ~<= 2000 (target 1.5-2k) | Wave 0 (count check) |
| SKILL-06 | References one level deep + linked from body | mechanical | assert body links each of the 2 new files + transformations.md; assert no reference file links to another reference file | Wave 0 (link check) |
| SKILL-06 / TPP-06/07 | New reference files >100 lines have a TOC | mechanical | for each new file >100 lines, assert a "## Contents"/TOC block near the top | Wave 0 (TOC check) |
| TPP-05 | Paired functional + imperative TS present | mechanical + manual | grep for both katas (sum + flatten) and both paradigms; optional extract + `tsc --strict --noEmit` | Wave 0 (grep) / optional tsc |
| TPP-06 | Fibonacci walk, each step tagged with transformation | manual (fidelity) | reviewer confirms monotonic priority order, each step tagged; optional extract + `tsc --strict` | manual |
| TPP-07 | TCO reality + patterns + CPS-needs-trampoline + compat-table caveat | mechanical + manual | grep asserts: "trampoline" present in every CPS mention; "Node" PTC false-positive caveat present; "JavaScriptCore"/"Safari" PTC statement present | Wave 0 (grep) |
| (all) | ASCII-only | mechanical | grep for any non-ASCII byte across new/changed files -> must be empty | Wave 0 (ascii check) |
| (guard) | transformations.md unchanged | mechanical | `git diff --exit-code -- plugins/lz-tdd/skills/lz-tpp/references/transformations.md` | exists |
| (guard) | No auto-edit/auto-run language in coach body | manual + grep | grep body for imperative "edit the file"/"run the tests" without the "unless explicitly asked" guard | manual |

### Sampling Rate
- **Per task commit:** frontmatter parse + `wc -l`/word count on the edited file + ASCII
  grep; `claude plugin validate ./plugins/lz-tdd`.
- **Per wave merge:** full mechanical check set (all rows above) + `claude plugin validate .`.
- **Phase gate:** full mechanical set green + `claude plugin validate .` clean before
  `/gsd:verify-work`. Behavioral trigger/coach accuracy is NOT gated here (Phase 5).

### Wave 0 Gaps
- [ ] Define the mechanical check commands (frontmatter parse, <=1024-char description,
      line/word budget, one-level-deep link check, per-file TOC presence, ASCII-only grep,
      transformations.md unchanged, CPS/compat-table grep asserts). These can be inline Bash
      commands in task verification steps (Phase 1/2 precedent) rather than a committed
      script. No test files to author in the traditional sense.
- [ ] (Optional) A one-off TS extraction check: extract fenced ```ts blocks to a temp file
      and run `tsc --strict --noEmit`. Confirmatory only -- patterns already verified.

*Deferred to Phase 5 (NOT in this phase): should/should-not-trigger evals (EVAL-01) and
coach-behavior/correct-next-transformation evals (EVAL-02). These are behavioral/empirical and
cannot be mechanically checked at authoring time.*

## Security Domain

This phase ships **Markdown only** -- no executable code, no installed packages, no network,
no auth, no data handling at runtime. Most ASVS categories are therefore not applicable. The
genuine security/hygiene surface for a PUBLIC repo is content safety and secret leakage.

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | No auth in a skill Markdown file. |
| V3 Session Management | no | N/A. |
| V4 Access Control | no | N/A. |
| V5 Input Validation | no (runtime) | The skill runs no code and validates no input; it only recommends changes to the user. |
| V6 Cryptography | no | N/A -- never hand-roll, but nothing crypto here. |
| V14 Config / Secrets | yes | No secrets in files; public contact = `larsbrinknielsen@gmail.com`; the work email must appear NOWHERE (project + global CLAUDE.md; MEMORY: public-repo work-email allowlist). |

### Known Threat Patterns for a public TPP skill

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Work/private email leaked into public repo | Information Disclosure | ASCII grep + email allowlist gate; only the public gmail may appear; verify absence of the work-email literal. |
| Coach body instructs unsafe auto-editing / arbitrary code execution | Elevation / Tampering | Enforce "coach, don't drive": the body must present a diff and let the human apply/run; NEVER edit code or run tests unless explicitly asked (D-04, Out of Scope). |
| Uncredited long quotes of Clean Coder content | (licensing) | Summarize + cite source URLs; quote the transformation list minimally with attribution (transformations.md already does this). |
| Non-ASCII mojibake in committed files | (integrity/hygiene) | ASCII-only gate (arrows `->`, no smart punctuation). |

## Project Constraints (from CLAUDE.md)

- **ASCII-only output** in all committed files: arrows as `->`, no smart quotes, no en/em
  dashes, no emojis/box-drawing. (Windows cp1252 toolchain; mechanical ASCII grep gate.)
- **Public contact only:** `larsbrinknielsen@gmail.com`; the work email must appear nowhere
  in the repo (project CLAUDE.md + global memory + MEMORY: public-repo work-email allowlist).
- **Search:** use `git grep` / `rg`, never `grep`.
- **Package manager:** `npm` default (not needed this phase -- no installs).
- **No AI attribution in commits.**
- **GSD workflow:** file changes go through a GSD command; commit docs per `commit_docs: true`.
- **Source authority precedence (project):** Anthropic News/Blog > frontier labs > community
  > Claude Code Docs > skill-creator > plugin-dev. For skill-authoring field rules,
  docs.claude.com (fetched today) is authoritative; in-repo research is the fallback if docs
  are blocked (they were reachable this session via markdown.new).

## Sources

### Primary (HIGH confidence)
- **docs.claude.com, "Skill authoring best practices"** -- fetched 2026-07-02 via
  markdown.new. Confirms: `name` <=64 chars (lowercase/numbers/hyphens, no XML tags, no
  reserved words "anthropic"/"claude"); `description` non-empty, **<=1024 chars**, no XML
  tags, third-person, what + when; SKILL.md body <500 lines; references ONE level deep; TOC
  for reference files >100 lines; "workflow for Skills without code" pattern; "flexible
  guidance / use your best judgment" template posture.
- **.planning/research/FEATURES.md** (in-repo, HIGH) -- Part 1 skill feature landscape +
  anti-features + MVP; Part 2 canonical TPP subject matter + Fibonacci walk + 7-step Coach
  Decision Procedure.
- **.planning/research/TPP-TYPESCRIPT.md** (in-repo, HIGH) -- TCO engine status, 5 verified
  stack-safe patterns, teach-vs-mention split, transformation-vs-refactoring framing,
  decision guide, Kata 1 (sum) + Kata 2 (flatten), TS typing gotchas. Executed on Node
  v24.18.0 / tsc 6.0.3.
- **plugins/lz-tdd/skills/lz-tpp/references/transformations.md** (in-repo, LOCKED) -- the
  canonical 14-item list, provenance, RGR, hedges, notation. The reference-behavior corpus.
- **.planning/research/STACK.md, ARCHITECTURE.md, PITFALLS.md** (in-repo, HIGH) -- frontmatter
  field rules, progressive-disclosure layout, and the 12 skill-authoring pitfalls.

### Secondary (MEDIUM confidence)
- Live tool probes this session: `claude --version` (2.1.198), `node --version` (v24.18.0),
  `tsc --version` (6.0.3), `npx --version` (11.16.0), `python --version` (3.13.6). [VERIFIED
  this environment, 2026-07-02.]

### Tertiary (LOW confidence)
- None relied upon. (Bun/JSC PTC is MEDIUM in the source and not relied on -- see A3.)

## Metadata

**Confidence breakdown:**
- Standard stack / frontmatter rules: HIGH -- verified against current docs.claude.com today.
- Architecture / progressive disclosure: HIGH -- docs + ARCHITECTURE.md agree; two new
  concrete rules (one-level-deep, TOC>100) verified.
- Coach procedure + subject matter: HIGH -- FEATURES.md Part 2 + transformations.md, primary-
  sourced.
- TS/TCO patterns: HIGH -- TPP-TYPESCRIPT.md executed on the exact toolchain present here.
- Pitfalls: HIGH -- PITFALLS.md primary-sourced; landmines cross-checked.

**Research date:** 2026-07-02
**Valid until:** ~2026-08-02 for the skill-authoring field rules (docs can evolve; description
cap and progressive-disclosure rules are stable-ish); the TPP subject matter and TS/TCO
findings are effectively durable (primary sources + engine status unchanged since ~2016).
