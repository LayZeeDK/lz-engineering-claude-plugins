---
phase: 14
phase_name: "compare-lz-refactor-to-mattpocock-skills-code-review-skill-k"
project: "lz-engineering-claude-plugins"
generated: "2026-07-15"
counts:
  decisions: 7
  lessons: 4
  patterns: 6
  surprises: 5
missing_artifacts:
  - "14-UAT.md"
---

# Phase 14 Learnings: Compare lz-refactor to mattpocock-skills code-review skill (kata + nx)

## Decisions

### code_review competitor arm added in place with its own tool profile (D-06)
Extended `run-e2e.mjs` with a `code_review` arm that composes `/mattpocock-skills:code-review <ROOT>` via a per-arm `--plugin-dir` pointed at the mattpocock 1.2.0 cache; it allows Bash + the Agent spawn tool but blocks Edit/Write/MultiEdit/NotebookEdit, is NOT in the `both`/`all` fan-outs, and requires `--synthetic-base`.

**Rationale:** Position lz-refactor against a real external code-review skill, not just base Opus. The Bash/sub-agent asymmetry vs the lz-refactor arms is preserved deliberately AS the D-04 tool-usage finding, never equalized.
**Source:** 14-01-SUMMARY.md

### Synthetic whole-file-diff baseline built from applyBase, not HEAD (D-02)
`buildSyntheticBase()` builds an empty-root ROOT -> target-only-tree TIP throwaway `review-<target>` branch from the suite `applyBase` (origin/23.0.x / kata main), scoped to exactly the target path, with finally-style worktree/branch teardown.

**Rationale:** Give both arms byte-identical whole-file input. code-review is designed to review an incremental diff since a fixed point, so an equal-input comparison forces a whole-file-as-diff baseline (its incremental strength is not exercised here -- the stated price of a fair comparison).
**Source:** 14-01-SUMMARY.md, 14-RESULTS.md (Caveats)

### total_cost_usd + model_usage is the fair cross-arm token headline (D-07 / A1)
Token/cost meta is read from the stream-json `result` event; the headline is `total_cost_usd` + per-model `model_usage` (which roll up sub-agents). Main-context `input/output_tokens` are recorded but explicitly NOT the cross-arm headline.

**Rationale:** code_review's sub-agent tokens live only in `model_usage`/`total_cost_usd`; raw `output_tokens` are main-context-only and would undercount code_review, spuriously favoring it.
**Source:** 14-01-SUMMARY.md, 14-04-SUMMARY.md (A1 finding)

### Report-framed, byte-identical, non-leading cr-* queries (D-08)
Three lz-refactor queries, one framing sentence each, byte-identical across all three targets except the file path, read-only ("Do not edit anything"), naming no expected smell/refactoring/pattern; the `invoke_skill` arm prepends `/lz-tdd:lz-refactor` at `composePrompt` time so the bodies stay framing-only.

**Rationale:** Mirror code-review's Standards-axis output contract (surface smells + named fixes, read-only) so both skills do the same work; keeping bodies path-only makes per-target bias structurally impossible.
**Source:** 14-02-SUMMARY.md

### Copy the shipped nameRe matcher + Pass@k helpers verbatim rather than import
`tabulate-mechanical.mjs` copies `nameRe` + the FOWLER/KERIEVSKY name arrays from `grade-run.mjs` and `comb`/`passAtK`/`passHatK` from `run-e2e.mjs`, with provenance notes.

**Rationale:** Neither module is importable -- `grade-run.mjs` runs `main()` on import with no exports, and `run-e2e.mjs` does not export the stats helpers. Copy-with-provenance keeps the head-to-head numbers identical to the shipped grader/runner.
**Source:** 14-03-SUMMARY.md

### D-12 metered spend gate: build-then-halt, explicit approval, no self-approval
The 18 metered `claude -p` runs executed only after the user explicitly approved the exact commands + spend estimate (approve-3cell = 18 runs). Both offline Wave-0 self-checks were green first.

**Rationale:** eval-run-approval-gate; a metered eval is never self-approved. The build halts and presents the gate before any spend.
**Source:** 14-04-SUMMARY.md

### Measurement-only phase; the verdict is an empirical finding, not a required skill win (D-11)
The phase ships NO change to the lz-refactor skill (harness extensions only). The verdict is framed as a differently-shaped-work finding; a skill "win" was never the success condition, so parity-with-broader-vocabulary is a valid PASS.

**Rationale:** An overclaimed or pre-assumed-win verdict is a measurement-validity threat (T-14-09); an unbiased from-scratch reviewer confirmed the tables match the grading records before the verdict was accepted.
**Source:** 14-VERIFICATION.md, 14-05-SUMMARY.md

---

## Lessons

### run-e2e.mjs `--suite` resolves against CWD, not the runner directory
The plan's kata command used `--suite ../e2e-gilded-rose`; `run-e2e.mjs:57` `path.resolve`s `--suite` against CWD (the workspace root), so `../` overshot to a non-existent `.claude/skills/e2e-gilded-rose` (ENOENT). Correct form from the workspace root is `--suite e2e-gilded-rose` (no `../`).

**Context:** Fail-fast caught the bad path before any kata `claude -p` fired -- zero wasted spend. The 12 nx runs (which use the runner's own dir, no `--suite`) were unaffected.
**Source:** 14-04-SUMMARY.md

### The org monthly spend-limit interrupts metered runs mid-flight
The limit was hit twice this milestone-close session (during 14-03 and during gsd-verifier); an earlier spend-limit-killed run produced zero output and left a leftover `review-T1` worktree that needed manual cleanup.

**Context:** Run metered work one gate at a time, keep artifacts durable + committed, and clean up any synthetic worktree residue after an aborted run. Do not retry in a loop -- resume the specific step after the user resets the limit.
**Source:** 14-04-SUMMARY.md

### A general code-review skill names smells + prose fixes, not canonical named refactorings
code_review scored 0 on the named-refactoring lift heuristic -- NOT because it found nothing, but because its vocabulary is smells + prose fixes rather than catalog refactoring names.

**Context:** Read a 0 lift as vocabulary shape, not "found nothing"; both arms named the same underlying smells authentically. The mechanical lift heuristic only measures catalog-name breadth.
**Source:** 14-RESULTS.md (section 1)

### A --selfcheck that drives only the pure core does not cover the main-path fail-closed guard
The tabulator's `--selfcheck` exercises the pure `tabulateGroup` core; the T-14-07 fail-closed guard (abort on garbled/keyless meta) lives in `collectRuns()` on the main path, so it must be verified separately with scratch garbled / missing-key fixtures.

**Context:** Surfaced by the validate-phase nyquist audit, which re-ran the guard adversarially (and rejected a first false-green ENOENT before confirming both failure modes fire for the right reason).
**Source:** 14-VALIDATION.md (validation audit)

---

## Patterns

### Equal-input / equal-framing head-to-head comparison
Make the report-mode query mirror the competitor's output contract (surface smells + named fixes, read-only) so both skills do the same work, and feed byte-identical whole-file input via a synthetic diff base.

**When to use:** Comparing two skills/tools fairly, especially when one is diff-oriented and the other whole-file-oriented -- equalize input and framing, report the remaining asymmetries as findings.
**Source:** 14-02-SUMMARY.md, 14-01-SUMMARY.md

### Offline zero-spend Wave-0 gate before any metered spend
A fail-closed self-check gates command composition + synthetic branch build/teardown + transcript parsing entirely offline, leaving borrowed repos pristine, BEFORE any `claude -p`.

**When to use:** Any metered eval -- de-risk the harness (composition, teardown, parse) at zero spend so the metered run only pays for the measurement, not for debugging.
**Source:** 14-01-SUMMARY.md

### Prompt-review discipline: >= 2 subagents, >= 1 unbiased from-scratch, before any run
Clear the eval prompts through at least two review subagents (one with a neutral from-scratch brief) to prove they are non-leading before spend.

**When to use:** Any eval where prompt framing could bias the result; the unbiased reviewer catches primed vocabulary or apply/drive leakage a primed reviewer would rubber-stamp.
**Source:** 14-02-SUMMARY.md

### git plumbing as the runner's own child + throwaway branch as a synthetic fixed point
Build an empty-root synthetic commit (via a throwaway `GIT_INDEX_FILE`, `write-tree`/`commit-tree`) scoped to just the target blob, branch `review-<target>`, and `worktree add` it as the diff baseline; tear down in a `finally`.

**When to use:** Constructing a whole-file-as-diff or synthetic base for a diff-oriented tool without touching the borrowed repo's real history or working tree.
**Source:** 14-01-SUMMARY.md

### Module-main guard + ESM exports so an offline self-check can import runner internals
Guard the CLI entry with a module-main check and export the internals (`extractResult`, `buildSyntheticBase`, `git`), so a self-check can import and unit-exercise them without running the whole CLI.

**When to use:** Any script that is both a CLI and a source of functions a test/self-check needs to call in isolation.
**Source:** 14-01-SUMMARY.md

### Spelling-agnostic sub-agent spawn count
Count sub-agent spawns by matching a case-insensitive name SET (`{task, agent}`), not one hardcoded tool name.

**When to use:** Tabulating tool-use histograms across runs where the CLI's spawn-tool spelling may vary between versions.
**Source:** 14-03-SUMMARY.md

---

## Surprises

### code_review caught a genuine correctness bug lz-refactor's smell lens missed
An unescaped-dot regex `/.tsx?$/` at `enforce-module-boundaries.ts:500` (matches any char, not a literal dot) was flagged by code_review in 1 of 3 cr-emb runs; lz-refactor's refactoring/smell lens skipped it.

**Impact:** Off-axis value lz-refactor does not attempt -- the two skills complement rather than rank. Reported with its "1 of 3 runs" frequency for symmetric disclosure.
**Source:** 14-RESULTS.md (section 4)

### Both arms shared a blind spot: missed T4 (groupImports reduce -> Map group-by) in every cr-rlu run
Neither skill surfaced the `groupImports` reduce-to-Map group-by transform on the functional target in any of the three runs.

**Impact:** Neither skill is complete; a real FP transform escaped both arms across k=3 -- a reminder that head-to-head parity does not mean full coverage.
**Source:** 14-RESULTS.md (Verdict)

### A NULL skill "win" is the valid, headline result
lz-refactor is cheaper (~30-45%), names 11-12 refactorings vs 0, reaches the FP axis code_review's 12-smell baseline structurally cannot, and runs an explicit net-cost APPLY/DECLINE proportionality judgment; code_review is broader with off-axis bug-finding + spec verification. Both are book-authentic on what they named (no fabrication on either side).

**Impact:** Reframes the value story as differently-shaped work, not a single-winner ranking -- consistent with the milestone's earlier finding that base Opus 4.8@high is already catalog-grade.
**Source:** 14-RESULTS.md, 14-VERIFICATION.md

### code_review's Spec axis engaged on the kata but skipped on nx
On the nx cells (no originating issue/PRD) the Spec sub-agent reported "no spec available" and skipped; on the kata it treated the canonical Gilded Rose as an implicit spec and verified behavioral faithfulness.

**Impact:** Surfaced a genuine code_review strength (spec/behavioral verification) the nx corpus could not exercise -- an expected structural asymmetry (D-03), reported not treated as a defect.
**Source:** 14-RESULTS.md (Caveats)

### lz-refactor's only book-fidelity blemishes were legacy names + TS-flavored labels, graded PARTIAL never FAIL
A few 1st-edition names (Replace Method with Method Object; Consolidate Duplicate Conditional Fragments) and TS-flavored labels (Extract Type; Extract Constant) were concept-faithful but off the 2nd-ed catalog.

**Impact:** Graded PARTIAL, never FAIL, with zero fabricated smells/refactorings -- the shipped catalog's routing (mechanical -> Fowler; repeated/complex -> Kerievsky) matches the books.
**Source:** 14-RESULTS.md (section 5)
