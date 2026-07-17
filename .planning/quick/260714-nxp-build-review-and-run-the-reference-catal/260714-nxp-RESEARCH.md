# Reference-Catalog Eval - Design Research

**Researched:** 2026-07-14
**Domain:** eval design for the lz-refactor REFERENCE (explain/look-up) use case
**Confidence:** HIGH on catalog facts (read directly); MEDIUM on "base will get it wrong" predictions (inferred, unmeasured)

## Summary

The whole e2e session concluded the skill's OUTPUT value on refactoring tasks is null/parity vs base
Opus 4.8; auto-trigger is proven and the reference catalog is the one untested lever. A reference eval
only has value if it targets facts where base plausibly answers WRONG or VAGUE and the curated,
oracle-verified catalog answers correctly. "Explain Extract Function / Strategy" is saturated (base knows
Fowler/GoF cold) - those probe null, exactly like every prior output probe.

**The single fairness rule that makes this eval meaningful:** grade ONLY facts with a ground truth
INDEPENDENT of the skill's own conventions - real book contents, real 1st->2nd-ed renames, real
Refactoring-Directions-table membership. EXCLUDE the skill's own constructions (the inferred To-vs-Towards
semantics, the `n/a` sentinel, the N:1 idiom groupings, the Kerievsky-primitive reconciliation): base
cannot be "wrong" about a convention the catalog invented, so a delta there measures echo, not value.

**Primary recommendation:** invoke_skill vs no_skill, recommend mode, ~10 discriminating questions + 2
saturation controls, k=3, reusing run-e2e.mjs with a new `e2e-reference/` suite (all `code:false`). Grade
DETERMINISTICALLY with a `grade-reference.mjs` (reuse `nameRe` from grade-run.mjs) using per-question
`mustName` / `mustNotClaim` / `anyOf` token assertions - NO LLM judge for core facts. The metric is the
per-fact DELTA (skill_correct_rate - base_correct_rate); value = positive delta on non-saturated,
independently-true facts. A null result is a decisive, valuable outcome (closes the last value lever).

## 1. WHERE the catalog can beat base - ranked fact-classes

Ranked by (discriminating power = base likely wrong) x (catalog states it unambiguously) x (an
independent ground truth exists). All facts below verified by reading the shipped catalog.

### TIER 1 - strong: verifiable book facts, base likely wrong, catalog unambiguous

- **FC-1a Refactoring Directions dual/Away placements** (kerievsky README + `.planning/.../08-REFACTORING-DIRECTIONS.md`).
  The killer facts are the dual-column and Away cells, which base almost certainly does not carry:
  - Move Accumulation to Visitor = To/Towards **Visitor** AND **Away Iterator** (a refactoring in two
    pattern rows, opposite directions).
  - Encapsulate Composite with Builder = To **Builder** but **Away Composite**.
  - Inline Singleton = **Away Singleton**.
  - Exactly **3** de-patterning (Away) refactorings total: Inline Singleton, Encapsulate Composite with
    Builder, Move Accumulation to Visitor.
  Ground truth = the book's actual table (a real artifact; membership is a fact). Grade table MEMBERSHIP,
  not the inferred To-vs-Towards meaning.
- **FC-6 Boundary / provenance facts** (fowler README provenance legend + 08-04 LEARNINGS):
  - "Return Modified Value" is **web-only** (Fowler's online catalog, NOT in the 2nd-ed print/e-book).
  - Fowler 2nd ed has **no "Extract Interface"** refactoring (Kerievsky's 1st-ed primitive maps to Change
    Function Declaration / Extract Superclass instead).
- **FC-5 Smell provenance** (smells.md): Combinatorial Explosion, Conditional Complexity, Indecent
  Exposure, Oddball Solution are **Kerievsky-unique** (Refactoring to Patterns Ch.4), NOT Fowler smells.
  8 smells are `[both]` (Duplicated Code, Long Function, Shotgun Surgery, Primitive Obsession, Repeated
  Switches, Lazy Element, Large Class, Alternative Classes with Different Interfaces).

### TIER 2 - medium: verifiable but base has partial recall

- **FC-2 Fowler 1st->2nd-ed renames/merges** (fowler README aliases column). Strongest sub-facts are the
  MERGES: Change Function Declaration absorbed Add Parameter + Remove Parameter + Rename Function/Method +
  Change Signature; "Introduce Null Object" (1st ed) became **Introduce Special Case** (2nd ed);
  Consolidate Duplicate Conditional Fragments -> Slide Statements; Inline Temp -> Inline Variable.
- **FC-4 De-patterning routes**: away-from-Singleton = **Inline Singleton** (Kerievsky Away) OR **Module
  Namespace** (functional dissolution). The first-class "Away" direction itself is a lift (base treats
  patterns as add-only).

### TIER 3 - weak: catalog-convention (echo) or base-saturated - DO NOT grade as value

- Inferred To-vs-Towards SEMANTICS (team inference, ~72-76 confidence, not in the book - circular).
- The `n/a` sentinel for the 4 utilities (skill convention).
- The N:1 functional idiom groupings AS SUCH (design choice; e.g. exactly-which-patterns->Fold is echo).
  The FP dissolution direction (Visitor/State/Interpreter/Composite -> Discriminated Union and Fold) is a
  defensible universal fact but base knows FP well -> parity risk; use as a borderline probe only.
- Per-leaf mechanics WORDING (DST-04 paraphrase; base-saturated + echo).
- Exact catalog COUNTS (62 shipped vs the milestone's "66 Fowler" claim is unreconciled - avoid).

## 2. Grading methodology (the crux) - deterministic fact-key assertions

Because TIER 1-2 are restricted to facts with a SINGLE correct answer, grading is deterministic and
sidesteps LLM-judge bias entirely. Reuse the proven machinery in `grade-run.mjs` (the word-bounded
`nameRe` matcher + catalog-derived name lists) in a sibling `grade-reference.mjs`. Per question:

- `mustName: [tokens]` - required correct tokens; specify `all` (AND) or `anyOf` (accept synonyms, e.g.
  {away, retreat, de-pattern, dismantle}). Word-bounded to stop sub-matches.
- `mustNotClaim: [tokens]` - forbidden hallucination markers (e.g. for Return Modified Value: fail if the
  answer asserts it is "in the print/2nd edition").
- Reuse `layersInResponse` for any "routes to layer" sub-check.
- `--selfcheck` with fixture answers, matching the repo's instrument-first convention.

**Why this beats echo (the stated trap):** grade BOTH arms with the SAME rubric and report the DELTA. If
base ALSO emits the correct tokens -> saturated -> discard. If base misses/hallucinates and the
catalog-loaded skill hits -> that positive delta IS the recall edge; the "echo" is the value mechanism (a
fact base lacked). Echo is only harmful when grading (a) verbatim PROSE - excluded; we grade fact tokens
(names/directions/yes-no), which are not copyrightable prose - or (b) convention facts - excluded by the
TIER-3 rule.

**No LLM judge for core facts.** Optional only: a single cross-family (not same-model) judge for a
no-hallucination spot-check, non-load-bearing. DST-04: optionally add a deterministic near-verbatim n-gram
NEGATIVE check (penalize pasting a catalog sentence), but the reference eval is not the DST-04 gate
(check-hygiene is); low priority.

**Metric:** per-fact `skill_correct_rate - base_correct_rate` across k runs + Pass@k on "fact correct"
per arm. Report the mean positive delta on discriminating facts, controls separately.

## 3. Prompt set (~10 discriminating + 2 controls) - concrete, catalog-grounded

Neutral phrasing (never name the answer in the question). Unbiased-review the prompts before spend.

| Q | Class | Question (abbrev) | Catalog answer / grade tokens |
|---|---|---|---|
| Q1 | FC-1a | "Move Accumulation to Visitor - which pattern(s) does it move toward, which away?" | mustName all: Visitor, Iterator, anyOf{away,de-pattern} |
| Q2 | FC-1a | "Encapsulate Composite with Builder - toward or away from Composite?" | anyOf{away,retreat}+Composite; bonus Builder; mustNotClaim "toward Composite" |
| Q3 | FC-4 | "A Singleton not earning its keep - named Kerievsky move + functional alternative?" | mustName Inline Singleton; anyOf{Module Namespace, module of functions} |
| Q4 | FC-1a | "Which Kerievsky refactorings are de-patterning (Away) moves?" | all 3: Inline Singleton, Encapsulate Composite with Builder, Move Accumulation to Visitor |
| Q5 | FC-5 | "Is 'Combinatorial Explosion' a Fowler or a Kerievsky smell?" | Kerievsky; mustNotClaim Fowler-as-source |
| Q6 | FC-5 | "Is 'Primitive Obsession' Fowler, Kerievsky, or both?" | both |
| Q7 | FC-2 | "What did Fowler rename 'Introduce Null Object' to in the 2nd ed?" | Introduce Special Case; mustNotClaim "still Introduce Null Object" |
| Q8 | FC-2 | "Which single 2nd-ed refactoring absorbed Add/Remove Parameter + Rename Method?" | Change Function Declaration |
| Q9 | FC-6 | "Is 'Return Modified Value' in the 2nd-ed print, or online only?" | anyOf{web-only,online,not in print}; mustNotClaim in-print |
| Q10 | FC-6 | "Does Fowler 2nd ed include an 'Extract Interface' refactoring?" | negation (no); bonus Change Function Declaration / Extract Superclass |
| Q11 | FC-4 (borderline) | "Visitor/State/Interpreter/Composite collapse into which functional idiom?" | anyOf{discriminated union, tagged union, ADT}+fold |
| Q12 | FC-1a | "In the Refactoring Directions table, is Replace Conditional Logic with Strategy under To, Towards, or both?" | both To and Towards (grade table membership, not semantics) |
| QC1 | control | "What is Extract Function and when do you use it?" | expect base PASS (saturation control) |
| QC2 | control | "What is the Strategy pattern's intent?" | expect base PASS (saturation control) |

The 2 controls are methodologically load-bearing: if discriminating Qs show a delta but controls show ~0,
the delta is real recall, not a verbosity/citation artifact. If the skill "wins" the controls too, the
"edge" is verbosity - discount it.

## 4. Arms + mechanics - reuse run-e2e.mjs

- **Arms:** primary A/B = **invoke_skill vs no_skill**. invoke_skill (forced `/lz-tdd:lz-refactor`)
  GUARANTEES the catalog is loaded, isolating CONTENT value from trigger noise (trigger is already
  answered). `--arm all` also yields with_skill for free (a secondary "do questions auto-trigger?" data
  point) - cheap in recommend mode, so run `--arm all`.
- **Mode:** recommend (read-only). All questions are `code:false`; the runner already hard-blocks
  Edit/Write/Bash in recommend, so no repo is acted on. `repo` in suite.json can point at any harmless dir
  (only used as cwd; never touched). Omit `applyBase` (apply-only).
- **k:** k=3 default (12 x 3 arms x 3 = 108 short read-only runs; or 12 x 2 x 3 = 72 for just the clean
  pair). Bump borderline facts (Q11, any partial-delta fact) to k=5. Read-only recommend runs are fast and
  cheap vs apply.
- **New suite:** `.claude/skills/lz-refactor-workspace/e2e-reference/` with `suite.json` (prompts array,
  all `code:false`), `prompts/qN-*.md`, `targets.json` (fact-key expectations for the grader).
- **Grader:** new `grade-reference.mjs` (import `nameRe`/`NAME_LAYERS` from grade-run.mjs) - the existing
  grader's RUBRICS 0-8 are coach-specific and not reusable as-is, but its matcher and lookup are. Add
  `--selfcheck`. The runner's built-in `report()` only measures skill-FIRE, not correctness - correctness
  comes from grade-reference.mjs over each `answer.md`, then a tiny aggregate step computes per-fact deltas
  + Pass@k. (Lazier alternative: extend RUBRICS in grade-run.mjs with a new check kind instead of a new
  file - but a sibling keeps the coach grader's selfcheck clean; pick the sibling.)

## 5. Pitfalls

1. **Saturation -> null** (base already knows it). Pre-screen every Q against "is base plausibly wrong";
   keep the 2 controls; DISCARD saturated facts from the value claim. Expect most non-TIER-1 to saturate.
2. **Catalog-convention vs independent fact** (deepest trap). Grade ONLY independently-true book facts;
   exclude inferred To/Towards semantics, `n/a`, N:1 groupings, primitive reconciliation. A delta there is
   echo, not value.
3. **LLM-judge bias / DST-04.** Deterministic mustName/mustNotClaim for core facts = no judge. If any
   judge, cross-family only, spot-check only. Grade fact tokens, never prose.
4. **Echo vs real recall.** Same rubric both arms; the DELTA on independently-true facts is the
   discriminator. (See rule 2 for where echo sneaks in.)
5. **Verbosity confound.** The controls catch it: a skill that "wins" controls is being verbose, not
   recalling.
6. **Leading prompts.** Neutral phrasing; unbiased-review before spend (per the project's established
   pattern).
7. **62-vs-66 Fowler count** is unreconciled (shipped catalog 62; milestone constraint says 66) - do NOT
   build a counting question.
8. **Is a measured edge actionable?** Be honest: even a real edge on niche facts (Return Modified Value
   web-only; Away-from-Iterator) may be low-utility - how often is that asked? Report delta AND a
   frequency/utility caveat. The actionable outcome is a class verdict: "the catalog carries a real
   correct-answer edge on look-up class X; class Y is redundant with base." Given the session already
   found output value null, the most likely result is that the edge, if any, is small and concentrated in
   TIER 1 (Kerievsky Directions + provenance boundaries). A NULL result is decisive and valuable: it
   closes the last untested value lever and tells the maintainer to stop investing in reference-mode value.

## Mechanics/approval note

Honor `eval-run-approval-gate`: build the suite + prompts + grader + selfcheck, but HALT before any
`claude -p` spend and get explicit user approval. Prep is fine; execution is gated.

## Sources (all local, HIGH)

- `plugins/lz-tdd/skills/lz-refactor/references/`: fowler-catalog/README.md (aliases, `[web-only]`),
  kerievsky-catalog/README.md (Direction gloss + To/Towards/Away/n-a), gof-catalog/README.md,
  extra-patterns-catalog/README.md, functional-catalog/README.md (N:1 dissolution map), smells.md
  (`[both]`/`[Kerievsky]` tags), SKILL.md (reference mode routing).
- `.planning/phases/08-.../08-REFACTORING-DIRECTIONS.md` (authoritative table membership + dual-placement).
- `.claude/skills/lz-refactor-workspace/`: run-e2e.mjs (suite/arms/modes/extractResult/report),
  grade-run.mjs (nameRe, NAME_LAYERS, selfcheck pattern), e2e-nx/{suite,targets}.json + p5 (code:false
  reference prompt that fires reliably), E2E-FINDINGS.md + e2e-gilded-rose/GR-RESULTS.md (null-delta +
  "reference untested" conclusions).
- STATE.md Session Continuity (output-warrant exhausted; reference catalog = the one untested lever).
