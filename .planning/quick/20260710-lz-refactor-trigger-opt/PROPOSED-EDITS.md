# Proposed SKILL.md edits (draft -- NOT yet applied)

Two edits to `plugins/lz-tdd/skills/lz-refactor/SKILL.md`, grounded in
[../../research/skill-trigger-optimization.md](../../research/skill-trigger-optimization.md). SKILL.md is
kept untouched until these are reviewed + approved, so the baseline eval stays measurable.

## Edit 1 -- `description` (frontmatter, lines 4-12)

**Why:** current description gates on jargon ("NAMED refactoring", "detected code smell", "which named
refactoring to apply") the natural coach prompts lack; skills under-trigger and read "make this readable"
as self-handleable. Fix = match USER INTENT, be "pushy", keep the exclude-and-reroute pointer to lz-tpp.
Addresses the CATEGORY (vague, advice-shaped requests to improve working code), not the 4 literal e2e
prompts (avoids overfitting). **1245 chars, ASCII (review-revised).**

**Char budget (corrected):** the `description` field is NOT hard-capped at 1024 -- `claude plugin validate`
(incl. `--strict`) accepts a >1024-char description with no length complaint. Per separate-project
verification, ~1000-1500 chars are LOAD-BEARING for skill loading/triggering, and 1536 is the listing
truncation. So we deliberately use the load-bearing window (1245) rather than trimming to 1024; all three
exclusions sit well before the 1536 cut. (This supersedes the repo's 2026-07-02 "1024 hard field cap" note,
which the current validator does not enforce.)

### CURRENT
> This skill should be used during the refactor step of red-green-refactor TDD to recommend the next NAMED
> refactoring for a detected code smell, and to explain refactorings, smells, and refactoring principles on
> demand. Use it as a coach when the tests are green and the code has a smell and the question is which named
> refactoring to apply, and as a reference when the user asks what a refactoring such as Extract Function or
> Replace Conditional with Polymorphism means, how to refactor away from a pattern (de-patterning), or asks a
> Fowler or Kerievsky catalog question. Do not use it for the green / transformation step of TDD (choosing the
> change that makes a failing test pass is lz-tpp), nor for plain feature work or generic write-a-function or
> write-code requests.

### PROPOSED (1245 chars, review-revised)
> This skill should be used for the refactor step of red-green-refactor TDD: improving the STRUCTURE or
> READABILITY of existing, working code WITHOUT changing its behavior. Use it whenever a developer wants to
> clean up, tidy, simplify, restructure, or de-duplicate code whose tests already pass, or make such code
> more readable; says a function, class, or module is hard to read, hard to follow, messy, doing too much, or
> a pain to work with; or mentions a code smell, a refactoring, or a design pattern in existing code (applying
> one to it, or refactoring away from one / de-patterning) -- even when they only ask "what would you do with
> this?", "anything you'd refactor?", or "how would you make it easier to read?" and never name a smell or say
> the word refactor. It recommends the next named Fowler or Kerievsky refactoring and, when the developer asks
> you to apply it, performs it in small behavior-preserving steps; it also explains a refactoring, code smell,
> refactoring principle, or design pattern on request. Do NOT use it to make a failing or red test pass or
> otherwise ADD or CHANGE behavior -- that is the green/transformation step; use lz-tpp instead -- nor for
> writing new code, adding a feature, or writing a function from scratch.

**Review revisions applied (3 reviewers):** third-person voice (parity with lz-tpp); design-pattern clause
anchored to "in existing code" (stops greenfield leaks); garden-path fix ("...code whose tests already pass,
or make such code more readable"). Perf left unguarded deliberately (body puts measured-hot-path perf partly
in scope; eval decides).

**Research mapping:** intent-not-jargon (Vercel); "pushy" + "even when they only ask..." (skill-creator);
exclude-and-reroute naming lz-tpp (citypaul convention); anchor = behavior-preserving STRUCTURE change
(mutually exclusive vs lz-tpp's green step); "when asked, applies it" primes the apply/wrinkle behavior.

## Edit 2 -- coach/apply paragraph (lines 69-70) + step 5 (the wrinkle)

**Why:** "Never edit... unless explicitly asked" dominates and stalled an explicit apply (nx p2 run-3: fired,
0 edits). Reframe to request-keyed mode; keep coach-by-default + the behavior-preserving guarantee.

### CURRENT (lines 69-70)
> Coach, don't drive. Present the named refactoring and the smallest next step; let the developer apply
> it and run the tests. Never edit the developer's code or run the tests unless explicitly asked.

### PROPOSED (review-revised)
> Coach by default; drive when asked. When the request is a QUESTION or asks for advice (what would you do
> here, anything you'd refactor, how would you make this more readable), present the named refactoring and the
> smallest next step and let the developer apply it -- do not edit their code or run tests unasked, because
> unrequested changes to working code are unwelcome. When the request is an explicit COMMAND to do it
> (refactor this for me, apply it, go ahead and make the change, do it), perform the refactoring yourself in
> small behavior-preserving steps, running the tests after each; then stop and leave the changes for the
> developer to review -- do not commit unless they ask. Refusing to edit when you were plainly asked to apply
> is the failure to avoid, not caution.

**Review revisions applied:** discriminator stated as QUESTION-vs-COMMAND (dropped the ambiguous "clean it
up" apply example); **dropped auto-commit** -- apply + run tests, then stop, commit only on request (Review 2:
an unrequested commit contradicts the paragraph's own "unrequested changes are unwelcome" principle).

### Step 5 (line 61) minor tweak
- CURRENT: "Preserve behavior (CCH-03). Advise the smallest steps that keep the code working, running the tests after each and committing on green."
- PROPOSED: "Preserve behavior (CCH-03). Advise -- or perform, when the developer asks you to apply it -- the smallest steps that keep the code working, running the tests after each; commit on green is the developer's call (commit only when asked)."

## Eval-set changes (already applied to the workspace, NOT SKILL.md)

- `evals/trigger-eval.json`: POSITIVES -- added the e2e advise prompts that missed, then (rubric review)
  COLLAPSED the overfit near-clones to 2 (kept `groupImports` "easier to read" + `updateQuality` "what would
  you do"; dropped the two nx clones that shared a file/template) and added ONE vague, keyword-free positive
  (a "god object... can't stand working in it, how do i break it up?" complaint -- no "refactor"/"smell"/
  test-state jargon, per the research's high-value-vague-positive guidance). NEGATIVES -- added p6 seam
  ("what refactoring makes this failing test pass" -- shares "refactor", needs lz-tpp). Now **13 pos / 11 neg
  (54/46), 4 seam**; `check-evals` green.
- `evals/d07-chunks/negatives.json`: +p6 (the spec runner reads this file); byte-consistent with trigger-eval.json's negatives (rubric-verified).
- p6 is a HARD near-miss negative graded as a SUPPORTING signal only; the true seam check is the
  routing/outcome test (lz-tpp wins with both skills present) -- already shown by the e2e `p6 -> lz-tpp`
  result, so it lives in the e2e/output evals, not this binary trigger harness. "Grade outcomes, not paths."
- Rubric review confirmed: no mislabeled negatives; the perf case (L20) and p6 (L27) are correctly
  should-not-trigger (strong term-misuse near-misses); the SOLID negative (L24) is kept DELIBERATELY as a hard
  near-miss with the anchor "SOLID = OO design principles, outside the Fowler+Kerievsky refactoring catalog".

## Open questions for review

1. **Perf case ("refactor this to be faster"):** kept as a should-not-trigger NEGATIVE (intent = speed, not
   structure). But a behavior-preserving speedup is arguably a refactoring, and the new anchor ("structure or
   readability... without changing behavior") may or may not keep it quiet. Flagged as a known ambiguity for
   the eval to reveal; do NOT add a literal "not for performance" clause (overfitting) -- sharpen the anchor
   only if it becomes a persistent false positive.
2. **Recall vs over-trigger:** does the broadened, pushy description risk firing on plain feature work or the
   green step? The 3 exclusions + the seam/feature negatives are the guard; the reviewers + the eval verify.
3. **Overfitting:** the 4 added positives are specific; confirm the description fix addresses the CATEGORY
   (vague advice-shaped requests to improve working code), not those phrasings.
