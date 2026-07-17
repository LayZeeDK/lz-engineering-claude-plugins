# Phase 13 Results: lz-refactor vs base Opus 4.8 @ high -- book authenticity & correctness

**Skill under test:** `lz-refactor` (shipped `plugins/lz-tdd/skills/lz-refactor`)
**Model / config:** `claude-opus-4-8` @ effort `high`, `--setting-sources project`, k=3 per cell
**Arms:** `with_skill` / `invoke_skill` (skill loaded via `--plugin-dir`) vs `no_skill` (base Opus, no plugin) -- the only A/B difference is the plugin's presence
**Borrowed repos:** nx `@nx/eslint-plugin` @ `origin/23.0.x`; kata Gilded Rose (TypeScript) @ `main`
**Graded corpus:** single-target apply p1/p2 (nx), gr1 (kata); whole-package/project sweep p8 (nx), gr4 (kata)
**Run artifacts:** `.claude/skills/lz-refactor-workspace/{e2e-nx,e2e-gilded-rose}/results/apply/<arm>/<pN>/run-<k>/{diff.patch,meta.json,answer.md}` (raw transcripts under `outputs/` are gitignored)
**Grading records:** `grading/book-authenticity/{claims,fidelity}.json`, `grading/correctness/{name-layer,behavior}.json`, `grading/summary.json`
**Grading channels:** book authenticity via the `oracle` agent (DST-04 firewall to the source books; verdicts in the agent's own words); correctness name/layer vs `targets.json`; behavior via an INDEPENDENT oracle (re-apply each diff to a fresh checkout, run the ORIGINAL tests on the EDITED source)

---

## Book authenticity (fidelity of the applied refactoring to the book's mechanics)

Run-granularity: a run passes if every refactoring it applied realizes its book's mechanics.

| Cell | Arm | Runs graded | Claims | pass | partial | fail | pass@1 | pass@3 | pass^3 |
|------|-----|-------------|--------|------|---------|------|--------|--------|--------|
| p1 (nx, Extract Function) | with_skill | 3 | 3 | 3 | 0 | 0 | 1.00 | 1.00 | 1.00 |
| p1 | no_skill | 3 | 3 | 3 | 0 | 0 | 1.00 | 1.00 | 1.00 |
| p2 (nx, Extract Function; polymorphism trap) | with_skill | 2 (+1 decline) | 2 | 2 | 0 | 0 | 1.00 | 1.00 | 1.00 |
| p2 | no_skill | 3 | 3 | 3 | 0 | 0 | 1.00 | 1.00 | 1.00 |
| p8 (nx sweep) | with_skill | 3 | 3 | 3 | 0 | 0 | 1.00 | 1.00 | 1.00 |
| p8 | no_skill | 3 | 3 | 3 | 0 | 0 | 1.00 | 1.00 | 1.00 |
| gr1 (kata, Conditional Complexity) | with_skill | 3 | 5 | 3 | 0 | 0 | 1.00 | 1.00 | 1.00 |
| gr1 | invoke_skill | 3 | 8 | 3 | 0 | 0 | 1.00 | 1.00 | 1.00 |
| gr1 | no_skill | 3 | 8 | 3 | 0 | 0 | 1.00 | 1.00 | 1.00 |
| gr4 (kata sweep) | with_skill | 3 | 12 | 3 | 0 | 0 | 1.00 | 1.00 | 1.00 |
| gr4 | no_skill | 3 | 12 | 3 | 0 | 0 | 1.00 | 1.00 | 1.00 |

Distinct refactorings graded (all pass): Fowler Extract Function, Decompose Conditional, Replace Nested
Conditional with Guard Clauses, Replace Magic Literal with Symbolic Constant (oracle caveat: not a named
refactoring in the Fowler 2nd-ed catalog -- graded vs the book's general naming principle), Extract Variable,
Consolidate Conditional Expression; Kerievsky Replace Conditional Logic with Strategy (gr1 with_skill run-2).
The oracle confirmed both arms' declining of Replace Conditional with Polymorphism (nx type-code ladders;
small kata conditionals) is consistent with Fowler, which warns against polymorphism overuse.

**Book-authenticity result: parity.** Both arms produce book-faithful applied refactorings at ceiling
(pass@1 = 1.00 everywhere a refactoring was applied). The only arm-distinguishing fact: `with_skill`
uniquely REACHED a named pattern-directed refactoring (Kerievsky Replace Conditional Logic with Strategy,
gr1 run-2, oracle pass) that `no_skill` never named or applied -- but the fidelity of what each arm DID
apply is equally high.

---

## Correctness (right named refactoring at the right layer + behavior-preserving)

| Cell | Arm | name/layer (c/n) | name/layer pass@1 | tests-green (c/n) | behavior pass@1 |
|------|-----|------------------|-------------------|-------------------|-----------------|
| p1 | with_skill | 3/3 | 1.00 | 3/3 | 1.00 |
| p1 | no_skill | 3/3 | 1.00 | 3/3 | 1.00 |
| p2 | with_skill | 2/3 (*) | 0.67 (*) | 3/3 | 1.00 |
| p2 | no_skill | 3/3 | 1.00 | 3/3 | 1.00 |
| p8 | with_skill | 3/3 | 1.00 | 3/3 | 1.00 |
| p8 | no_skill | 3/3 | 1.00 | 3/3 | 1.00 |
| gr1 | with_skill | 3/3 | 1.00 | 3/3 | 1.00 |
| gr1 | invoke_skill | 3/3 | 1.00 | 3/3 | 1.00 |
| gr1 | no_skill | 3/3 | 1.00 | 3/3 | 1.00 |
| gr4 | with_skill | 3/3 | 1.00 | 3/3 | 1.00 |
| gr4 | no_skill | 3/3 | 1.00 | 3/3 | 1.00 |

(*) p2 with_skill run-3 was a QUESTION-mode advise-only run: it correctly recommended Extract Function and
correctly declined polymorphism, but applied NO code (empty diff). This is purely a denominator-convention
artifact: book-authenticity EXCLUDES the same decline (n=2) and behavior COUNTS it as trivially green, but the
name/layer denominator COUNTS it, dropping the cell to 2/3. Treated consistently (decline excluded, as in the
book-authenticity dimension), p2 with_skill name/layer is 2/2 = 1.00 -- clean parity. It is NOT a refactoring
error; it is the skill's QUESTION->advise bifurcation behaving as designed (and p2/T2 is the case whose target
explicitly rejects Strategy for the 3-value mode param).

Behavior oracle: nx used a DIFFERENTIAL check (raw jest, since `nx test` fails at the `nx:build-native` Rust
prerequisite on this arm64 box) -- behavior-preserving = 0 new failures beyond the recorded 15-fail/169-pass
pristine baseline; every graded nx run held exactly 169 pass / 15 fail. kata used `jest --ci` against the
pristine-seeded golden master; every graded kata run matched (2/2 snapshots). No run took a seeded judgment
trap: no Strategy for the p2 mode param, no exported-signature change in the nx p8 sweep, no Conjured/Sulfuras
behavior change in the kata gr4 sweep.

**Correctness result: parity.** Both arms are name/layer correct and behavior-preserving on every applied
run (the lone sub-1.0 is the advise-only-decline artifact above, not a miss).

---

## Caveats

1. **Comparability of single-target skill-arm diffs.** The reused single-target `with_skill`/`invoke_skill`
   diffs (p1, p2, gr1) were captured under earlier `SKILL.md` states; read the single-target with/without as
   skill-at-capture-time vs base-now. The sweep pair (p8, gr4) was freshly re-run this phase for both arms
   (nx p8 with_skill reused per the amended D-02 -- committed k=3 on current HEAD against the unchanged skill),
   so it carries no version caveat -- lean on the sweep pair for the headline.
2. **nx behavior oracle is differential, not all-green.** `@nx/eslint-plugin` carries 15 pre-existing failures
   (a single `dependency-checks.spec.ts` spyOn/interop crash) on this machine; behavior-preservation is scored
   as "no NEW failures," not "all green." `nx test` itself is unusable here (build-native artifact-copy
   failure) -- raw jest against the package config is the oracle.
3. **Book-fidelity saturation.** pass@1 = 1.00 for both arms on book authenticity, correctness name/layer
   (apply runs), and behavior. These are non-discriminating on APPLIED output -- consistent with, not a defect
   of, the finding below.
4. **Grading depth.** Sweep runs (p8, gr4) apply one dominant refactoring family (Extract Function/de-dup for
   nx; Extract Function + Decompose Conditional + guard clauses + constants for kata); the per-refactoring
   fidelity verdict is homogeneous within a run, so run-granularity Pass@k is the reported statistic.

---

## Verdict

**Empirical finding: PARITY between `lz-refactor` (with_skill/invoke_skill) and base Opus 4.8 @ high on BOTH
measured dimensions of APPLIED output -- book authenticity and correctness.** Across all 11 cell x arm
groups, book-authenticity fidelity, name/layer correctness (on apply runs), and behavior-preservation all sit
at pass@1 = 1.00; the single sub-1.0 number (p2 with_skill name/layer 2/3) is a QUESTION-mode advise-only
decline behaving as designed, not a defect. This CONFIRMS the prior finding (E2E-FINDINGS.md): base Opus 4.8
@ high is already catalog-grade on the mechanical bulk of refactoring -- Extract Function, guard clauses,
de-duplication, decomposition -- and it also, unprompted, respects the same over-engineering guardrails
(declining Replace Conditional with Polymorphism where a simpler extraction suffices; pausing on the
untested/public-config blast-radius; leaving `Item` untouched in the kata) that the skill encodes.

The skill shows NO clean applied-output advantage on either dimension. The one place `with_skill` reached a
named pattern-directed refactoring that base did not -- Kerievsky Replace Conditional Logic with Strategy
(gr1 run-2, oracle-graded book-faithful) -- is graded a MILD OVER-REACH on that single-target cell (name/layer
correct, but G1's judgment prefers clarity-first Extract/Decompose at only three item types), not a win; and
the base `no_skill` arm independently matched the invoke_skill "ideal" clarity-first answer on the same cell.
The only durable qualitative difference is process-level, not output-level: `with_skill` consistently NAMED
the pattern-routing decision and gave explicit net-cost DECLINE reasoning (the skill's signature move, correct
in the gr4 sweep), whereas base did equivalent mechanical cleanup without that framing and in one gr4 run
over-reached by typing the goblin-owned `Item`. Net: on the two dimensions this phase set out to difference,
the skill does not measurably beat base on APPLIED output; an independent from-scratch reviewer confirmed
strict parity (no cell where any skill arm's Pass@k exceeds base on any dimension). The skill's value remains
where prior phases located it (auto-triggering; pattern-direction vocabulary; explicit over-engineering
judgment) and is "harmless" on the mechanical majority where base Opus 4.8 @ high is already catalog-grade.

---

*Phase 13 -- terminal measurement of milestone lz-tdd@0.0.2. Grading is measurement-only; no shipped-skill
change. See `grading/summary.json` for the machine-readable rollup.*
