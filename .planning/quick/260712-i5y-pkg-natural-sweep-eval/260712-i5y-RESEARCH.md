# Research: design decisions for the package-scope directive eval

## Baseline choice (the "most relevant baseline")

Chose `no_skill` (base Opus 4.8 @ high, no plugin) over `9ce3343` (pre-12-02 skill). Rationale: the
user's question is a CAPABILITY question ("can I write this prompt and have it identify+triage+refactor
to completion"), whose control is base-Opus-without-the-skill. The 9ce3343-vs-live (12-02 attribution)
comparison was already shown null at single-file scope; `no_skill` isolates the skill's TOTAL
contribution at package scale, which is the unanswered question. (9ce3343 remains available if 12-02
attribution at package scale is wanted later.)

## Register: directive-unscripted (a third register)

The existing suite had two registers: interrogative-natural (p1/p3/gr1/p7/gr3, "what would you do
with it?") and scripted-command (p2cmd/p7cmd/gr3cmd, "please refactor it now ... in small steps ...
until clean"). The user's literal prompt ("Identify code smells and refactor them away ...") is
neither: it is an imperative (orders the outcome) but unscripted (no forced `/lz-refactor`, no
step-by-step). Kept the wording verbatim (it is the real-world prompt) and labeled it `-directive` so
it is not mistaken for a spontaneous-trigger test.

## Harness fixes applied before spending (from code review)

- I1: `git reset --hard`/`clean` gain a `mustSucceed` guard -> abort rather than silently stacking
  edits across the k runs (independence of samples).
- I3: stage-before-diff (`git add -A` then `diff --cached`) so untracked files from extract-to-module
  refactorings are captured (a plain `git diff <base>` omits them). Side effect: the kata's generated
  characterization snapshot now appears in the diff.
- I5: on Windows timeout, kill the whole process tree (agent's node/jest/nx-daemon grandchildren) so
  they cannot race the next run's reset.
- Mitigations: `nx reset` before the nx runs (I6 cache); nx apply timeout raised to 45 min.
- Deferred to manual grading: I2 (report denominator includes failed runs), I4 (exit-0 error runs).

## Pitfalls carried in

- Isolated/recommend triggering != e2e apply behavior; the apply run is ground truth.
- `used_refactor` undercounts force-load; irrelevant here (auto-trigger arm), used only as a coarse
  fired hint, confirmed against transcripts.
- Pre-existing nx `dependency-checks.spec.ts` 15 failures (jest-30 native-bindings) are the baseline,
  not a regression.
