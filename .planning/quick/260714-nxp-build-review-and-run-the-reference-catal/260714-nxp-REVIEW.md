# 260714-nxp Reference-catalog eval -- unbiased review (Task 3 gate)

**GATE: PASS** (post-fix, quick-260714-nxp). The pre-fix review below reached NEEDS-CHANGES; every
must-fix item is now applied and verified. See "## Fixes applied (post-review)" at the end of this
file for the change log, the SKILL.md-echo audit table, the clean core, and the dry-run count.
Spend decision still deferred to the Task-4 user checkpoint (eval-run-approval-gate).

_Original pre-fix verdict:_ **NEEDS-CHANGES** (both reviewers). Fixable defects identified; strategic
ceiling surfaced.

Two independent reviewers (neutral from-scratch + adversarial), both source-grounded (grader code +
shipped catalog + `.oracle/` book sources).

## Fairness rule: PASS
Every `independent:true` question grades a book-independent fact; no direction word is a graded token
(selfcheck enforces this). The neutral reviewer verified all 12 ground-truth token sets against the
actual books in `.oracle/` -- all correct, including the two disputed facts:
- q1 (Move Accumulation to Visitor -> Visitor AND Iterator): CONFIRMED real -- Kerievsky inside-front-cover
  Refactoring Directions table lists Iterator row = Away, Visitor row = To/Towards
  (`.oracle/refactoring-to-patterns/01-inside-front-cover.md`). The shipped README's flat "Away | Visitor"
  is a lossy compression (separate catalog display bug, out of eval scope). Iterator is NOT in SKILL.md,
  so q1's discriminator is genuine catalog recall, not preamble echo.
- q11 (Consolidate Duplicate Conditional Fragments -> Slide Statements) and q12 (Indecent Exposure =
  Kerievsky-unique): CONFIRMED.

## Confirmed defects (must fix before spend)

### Grader precision (empirically reproduced)
1. **q6 false-pass on bare `both`** -- "appears in both editions of his book" / "in both small and large
   codebases" scores CORRECT while attributing the smell to Fowler only. Fix: drop bare `both`/`in both`;
   require specific phrasings (`both authors`, `both catalogs`, `Fowler and Kerievsky`, `named by both`).
2. **q5/q12 false-FAIL biasing delta toward the skill** -- "you might guess Fowler, but actually
   Kerievsky" false-fails (mustNotClaim `a Fowler smell` matched with backward-only negation scope).
   Hedged answers false-fail; if base hedges more than the catalog-primed arm, the delta is inflated in
   the skill's favor -- a manufactured edge on exactly the provenance questions.
3. **q5/q12 false-PASS** -- "Kerievsky does not classify this as a smell; Fowler introduced it" scores
   CORRECT (Kerievsky affirmed at index 0; post-nominal negation not scanned). Fix: bidirectional
   negation scan; add `both`/`Fowler and Kerievsky`/`neither` to q5 mustNotClaim (q12 partial).
4. **q10 false-fail (phrasing-brittle anyOf)** -- "does not contain an Extract Interface" misses the
   `does not include` token. Fix: add `does not contain`, `lacks`, `absent`, `omits`, `has no`.
   Add selfcheck fixtures for holes 1-4.

### Question validity
5. **q2 SATURATED (both reviewers)** -- graded tokens Builder+Composite are both in the refactoring's
   title "Encapsulate Composite with Builder" quoted in the stem -> both arms echo the stem -> delta ~0
   by construction. Drop q2 (a named refactoring's name cannot be hidden).
6. **q4 SKILL.md ECHO (adversarial, fatal as a catalog signal)** -- SKILL.md step 4 literally lists the 3
   Away refactorings (Inline Singleton, Encapsulate Composite with Builder, Move Accumulation to Visitor).
   invoke_skill loads SKILL.md, so it answers q4 from the injected preamble, not the catalog. Drop q4.
7. **q3 partial SKILL.md echo** -- "Inline Singleton" is also in SKILL.md; q3's other half (FP
   module-of-functions) is generic knowledge base shares. Drop or rework.
   SYSTEMIC: audit every remaining question's graded tokens against the SKILL.md BODY; any token present
   there measures preamble-echo, not catalog recall.
8. **q1 stem scaffolding (low)** -- "pulling toward one while stepping back from another" telegraphs the
   answer shape; reword neutrally (no token leaked -- neutrality nit, not a fairness break).
9. **Verbosity guard ceiling** -- controls qc1/qc2 are saturated (both ~1.0), so a token-naming/format
   advantage can't be caught. Fix: report per-arm `answer_chars` (already in meta.json) alongside deltas.

## Strategic ceiling (both reviewers, independently)
After all fixes, the clean discriminating core is q7/q8/q9/q11 -- 1st->2nd-edition rename/provenance
TRIVIA. A positive delta there proves only "the catalog helps recall obscure rename facts base flubs" --
real but LOW-UTILITY for a TDD refactor coach, and several other questions are null (base knows the
classics) or were confounded by SKILL.md-echo. Honest read: the most likely outcome is a NARROW
rename-recall edge or NULL. This is consistent with the plan's own position that NULL is a valid decisive
result -- and it means the reference lever's ceiling is now largely visible from the review itself.

## Recommended run scope (if spend approved)
invoke_skill + no_skill (2 arms; with_skill auto-trigger is unreliable for questions and adds ~42 wasted
runs). A cheaper alternative: run ONLY the clean discriminating core (the rename/provenance questions
that survive the SKILL.md-echo audit), k=3, 2 arms = ~24 runs, to get a real signal on the one
defensible edge without the full 84-126.

## Fixes applied (post-review)

All must-fix items from the review above are applied to the instrument. Grader selfcheck exits 0 with
new fixtures for every fix; the clean-core dry-run composes cleanly. No metered spend was incurred
(only `--selfcheck` and `--dry-run`). `grade-run.mjs` and `run-e2e.mjs` were NOT touched.

### Grader precision (`grade-reference.mjs`, each with a new `--selfcheck` fixture)

1. **q6 bare-`both` false-pass closed.** Dropped the bare `both` / `in both` / `appears in both`
   anyOf tokens; q6 now requires a specific phrasing: `both authors`, `both catalogs`, `both books`,
   `Fowler and Kerievsky`, `named by both`, `catalogued by both`, `appears in both catalogs`.
   Fixture: "appears in both editions of his book, catalogued by Fowler" -> INCORRECT; "catalogued
   by both authors" / "Both Fowler and Kerievsky catalogue it" -> CORRECT.
2. **Negation scan made BIDIRECTIONAL + hedged-contrastive.** `occursAffirmed` now suppresses a
   token negated in EITHER direction (added `clauseAfter`, truncated at the first coordinating/
   contrastive conjunction so `and`/`but` on the far side is not mis-attributed), and treats a
   hedged-then-retracted token ("you might guess X, but actually Y") as not-affirmed (added
   `HEDGE` + forward `CONTRAST_FWD` via `sentenceAround`/`hedgedContrastive`). Fixtures: "you might
   guess it is a Fowler smell, but it is actually catalogued by Kerievsky" -> CORRECT (was a
   false-FAIL); "Kerievsky does not classify this as a smell; Fowler introduced it" -> INCORRECT
   (was a false-PASS); plus a guard that a NEG past a coordinating conjunction does NOT suppress
   ("a Kerievsky smell and does not appear in Fowler" still affirms Kerievsky).
3. **q5/q12 `mustNotClaim` widened.** Added `both authors`, `both catalogs`, `Fowler and Kerievsky`,
   `named by both`, `catalogued by both`, and the `neither` variants so a "both"/"neither"
   attribution FAILS a Kerievsky-unique provenance even when Kerievsky is also named. Fixtures cover
   both-attribution and neither-attribution failing with Kerievsky present.
4. **q10 anyOf de-brittled.** Added negative phrasings, each bound to the subject to avoid a
   bare-word false-pass: `does not contain an Extract Interface`, `lacks (an) Extract Interface`,
   `omits (an) Extract Interface`, `has no Extract Interface`, `Extract Interface is absent`.
   Fixture: "does not contain an Extract Interface" / "lacks an Extract Interface" / "has no Extract
   Interface" -> CORRECT; "contains an Extract Interface" -> INCORRECT.
10. **Verbosity guard.** `--aggregate` now reports a per-arm median `answer_chars` (read from
   `meta.json`) alongside the per-fact deltas, so a token-naming/verbosity advantage the saturated
   qc1/qc2 controls cannot catch is visible. Fixture verifies odd/even/empty medians and per-arm n.

### Question validity

5. **q2 DROPPED** (removed from `suite.json`, `targets.json`, prompt file deleted) -- saturated:
   Builder + Composite are in the refactoring title "Encapsulate Composite with Builder" quoted in
   the stem, so delta ~0 by construction.
6. **q4 DROPPED** (same) -- SKILL.md echo: the three Away refactorings are listed verbatim in the
   SKILL.md body, so invoke_skill answers from the injected preamble.
8. **q1 stem de-scaffolded** -- removed "pulling toward one while stepping back from another";
   neutral phrasing: "which design pattern(s), if any, does its entry relate to? Name each one." No
   token leaked (graded tokens are Visitor + Iterator; no direction word graded).
9. **Controls kept** -- qc1, qc2 retained and run alongside the clean core to feed the verbosity
   guard.

### SKILL.md-echo audit (the key step defining the CLEAN CORE)

Method: extracted every refactoring/pattern/smell NAME from the SKILL.md BODY (verified by count),
then for each remaining discriminating question checked whether its graded DISCRIMINATOR (the token
the base model would plausibly miss -- NOT a token merely restated in the stem/title) or its
subject->answer linkage appears in that body. A discriminator present in SKILL.md measures
preamble-echo, not catalog recall.

SKILL.md body NAME counts (git grep -c -i on the SKILL.md body): Combinatorial Explosion 1, Inline
Singleton 1, Move Accumulation to Visitor 1, Encapsulate Composite with Builder 1, Null Object 1;
Primitive Obsession 0, Indecent Exposure 0, Extract Interface 0, Slide Statements 0, Change Function
Declaration 0, Introduce Special Case 0, Return Modified Value 0, Iterator 0.

| Q   | Graded discriminator (stem-given token in parens) | In SKILL.md body? | Verdict |
| --- | -------------------------------------------------- | ----------------- | ------- |
| q1  | Iterator (Visitor given by the title)              | Iterator: NO      | IN (clean core) |
| q3  | Inline Singleton                                   | YES (step-4 list) | OUT -- echo |
| q5  | Kerievsky, via subject "Combinatorial Explosion"   | subject YES (routed to Kerievsky) | OUT -- echo |
| q6  | "both authors"/"Fowler and Kerievsky" (subject Primitive Obsession) | NO (subject + tokens absent) | IN (clean core) |
| q7  | Introduce Special Case (Null Object is the pattern, not the rename) | NO | IN (clean core) |
| q8  | Change Function Declaration                         | NO                | IN (clean core) |
| q9  | web-only / online-catalog (subject Return Modified Value) | NO         | IN (clean core) |
| q10 | "no Extract Interface" (subject Extract Interface)  | NO                | IN (clean core) |
| q11 | Slide Statements                                   | NO                | IN (clean core) |
| q12 | Kerievsky, via subject "Indecent Exposure" (authors given by the stem) | subject NO | IN (clean core) |

q3 and q5 are retained in `targets.json` (with an `excluded_from_clean_core` field and the widened
tokens, so the grader fixes stay demonstrable) but are NOT part of the clean-core run. q2 and q4 are
removed from the suite entirely.

### CLEAN CORE

Discriminating clean core (8): **q1, q6, q7, q8, q9, q10, q11, q12**.
Plus 2 saturation controls run alongside: qc1, qc2.

`--prompt` flags for the run:
`--prompt q1 --prompt q6 --prompt q7 --prompt q8 --prompt q9 --prompt q10 --prompt q11 --prompt q12 --prompt qc1 --prompt qc2`

Dry-run counts (verified, no spend): 10 prompts x invoke_skill (1 arm) x k=3 = 30 runs;
x 2 arms (invoke_skill + no_skill) x k=3 = **60 runs** total (48 discriminating + 12 control).

### Gate criteria

- All grader fixes done: YES (fixes 1-4, 10).
- Selfcheck green with new fixtures: YES (`--selfcheck` exits 0).
- q2/q4/q3 (+ q5, echo-tainted) excluded from the clean core: YES (q2/q4 dropped; q3/q5 excluded).
- No direction word graded: YES (selfcheck DIRWORDS fairness guard passes over `targets.json`).
- Clean core non-empty: YES (8 discriminating + 2 controls).

-> **GATE: PASS.**
