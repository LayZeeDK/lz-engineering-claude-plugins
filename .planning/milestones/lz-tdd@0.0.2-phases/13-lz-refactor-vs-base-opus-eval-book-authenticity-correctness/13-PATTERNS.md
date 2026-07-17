# Phase 13: lz-refactor vs base Opus eval -- book authenticity & correctness - Pattern Map

**Mapped:** 2026-07-15
**Files analyzed:** 6 (2 new grading-record types, 1 results doc, 1 optional helper, 2 harness-produced diff sets) + 5 reused-as-is assets
**Analogs found:** 6 / 6 (this is an ASSEMBLY phase -- every artifact has a strong in-repo precedent)

All paths below are relative to the repo root
`D:/projects/github/LayZeeDK/lz-engineering-claude-plugins/`. The eval workspace root is
`.claude/skills/lz-refactor-workspace/` (abbreviated `WS/` in this doc). This is a MEASUREMENT-ONLY
phase: no application/skill code changes. Most "creation" is data records + one results doc; the
runner and oracle firewall already exist and are reused verbatim.

## File Classification

| New/Modified Artifact | Role | Data Flow | Closest Analog | Match Quality |
|-----------------------|------|-----------|----------------|---------------|
| Per-run book-authenticity fidelity records (per-claim {book, refactoring, pass/partial/fail}) | eval-record (data) | transform (diff -> claim -> oracle verdict) | `WS/e2e-reference/aggregate.json` | role-match (per-cell grade record + Pass@k) |
| Per-run correctness records (name/layer y/n; tests-green y/n, both arms) | eval-record (data) | transform (diff vs `targets.json`; behavior oracle) | `WS/e2e-reference/aggregate.json` + `WS/iteration-1/passk-metrics.json` | role-match |
| `13-RESULTS.md` (per-cell with/without, both dimensions, Pass@k, empirical verdict) | report | aggregate/transform | `WS/e2e-nx/E2E-RESULTS.md`, `WS/e2e-gilded-rose/GR-RESULTS.md`, `WS/e2e-reference/REFERENCE-RESULTS.md` | exact (same doc genre) |
| (Optional) diff-to-claim normalizer helper `.mjs` | utility / script | file-I/O + transform (read `diff.patch`/`answer.md` -> claim list) | `WS/grade-run.mjs`, `WS/grade-reference.mjs`, `run-e2e.mjs` `report()`/`extractResult()` | role-match |
| `no_skill` single-target diffs (p1/p2/gr1) + sweep diffs (p8 no_skill; gr4 both) | run output (produced by reused harness) | batch (throwaway apply -> persist) | existing `results/apply/with_skill/**` trees | exact (same runner, same layout) |

**Reused as-is (NOT created -- load-bearing inputs; see Shared Patterns):**

| Reused Asset | Role | Why reused, not rebuilt |
|--------------|------|-------------------------|
| `WS/e2e-nx/run-e2e.mjs` | harness | D-03: already does arms, apply-on-throwaway, diff+meta persist, Pass@k. No new runner. Drives kata via `--suite`. |
| `.claude/agents/oracle.md` | grading agent | D-05: the ONLY DST-04 channel to `.oracle/`. Owns the fidelity verdict. |
| `.claude/agents/oracle-reviewer.md` | grading agent | D-05: gates a DRAFTED claim doc only; optional unbiased second pass. |
| `WS/e2e-{nx,gilded-rose}/targets.json` | correctness ground truth | D-07: `expected_family` + `judgment` per target. Our own file (not book prose). |
| Borrowed-repo test runners (nx `packages/eslint-plugin/jest.config.cts`; kata `test/jest/approvals.spec.ts`) | behavior oracle | D-07: run ORIGINAL tests against EDITED source. |

## Pattern Assignments

### Book-authenticity fidelity records (eval-record, transform)

**Analog:** `WS/e2e-reference/aggregate.json` (per-question grade + Pass@k rollup) and the claim-list
shape already latent in each run's `answer.md`.

**Claim-source pattern (input the record is built from).** Each graded run's `answer.md` already reads
as a claim list -- normalize from it + `diff.patch`, NEVER from `.oracle/`. Real p8 `with_skill` run-1
(`WS/e2e-nx/results/apply/with_skill/p8/run-1/answer.md`) enumerates 5 numbered Extract Functions,
each with file/symbol + a functional description:

```
1. Source-tag helpers (runtime-lint-utils.ts -> used in enforce-module-boundaries.ts): getSourceTags()/
   stringifySourceTags() replace a source-tag expression that appeared 5x.
2. findJsonPropertyByKey() (nx-plugin-checks.ts): collapsed 11 copies of a .find(...) predicate.
3. getContextFileName() (runtime-lint-utils.ts): centralized an ESLint v8/v9 compat shim, 8 sites.
4. getImportMembers() + replaceWithGroupedImports() (enforce-module-boundaries.ts): two fix() helpers.
5. parseSourceFile() + findIdentifierNodes() (ast-utils.ts): deduped readFileSync+createSourceFile.
```

Each numbered item becomes one claim `{ book, named_refactoring, file_symbol, functional_change }`
(sweep = N claims/run per D-06; single-target = 1 claim/run). The `meta.json` `changed_files` array
(`p8/run-1/meta.json` lines 10-16) bounds which files the diff touched -- use it to confirm the claim
set is complete.

**Per-cell record shape to copy (from `aggregate.json` lines 8-41 / 417-432):** one entry per graded
cell x arm carrying `rates`, `delta`, and a `passk` block `{ n, c, passAt1, passAt3, passHat3 }`,
plus a top-level `summary { n_discriminating, mean_delta, n_positive, ... }`. For fidelity, replace
the binary rate with the pass/partial/fail tally per claim, and keep the same per-arm `passk` block so
`13-RESULTS.md` can lift it directly.

**Verdict field is oracle-owned (D-05).** The record stores the oracle's returned verdict text
verbatim-in-agent's-own-words (pass|partial|fail + why); main context must not author the book
rationale. See Shared Pattern "Oracle packaging (DST-04)".

**Placement (OQ-3, discretion):** keep alongside `results/apply/.../` in the workspace, ASCII-only.
NOTE the gitignore posture below -- `results/apply/**/{answer.md,diff.patch,meta.json}` are TRACKED
(confirmed via `git ls-files`), so any grading record you drop there is committed and MUST pass the
ASCII + hygiene scan. `WS/e2e-reference/results/` + `aggregate.json` are the ONE ignored exception
(`.gitignore` lines 36-37) -- if you want records local-only, mirror that pattern with an explicit
ignore, otherwise they ship.

---

### Correctness records (eval-record, transform)

**Analog:** `WS/e2e-reference/aggregate.json` (per-arm `passk`) + `WS/iteration-1/passk-metrics.json`
(`with_skill`/`without_skill` split with `fully_correct` count).

**Ground truth (a) name/layer -- from `targets.json`, main context, no book read.** Single-target cells
map directly: nx `p1` -> T1, `p2` -> T2 (`WS/e2e-nx/targets.json` lines 7-26); kata `gr1` -> G1
(`WS/e2e-gilded-rose/targets.json` lines 6-21). Each target carries `expected_family` + `judgment`
(the right named refactoring at the right LAYER, plus the over/under-engineering trap). Example T2
(`targets.json` lines 22-25): `expected_family` = "Fowler mechanical: Extract Function per validation
section..."; `judgment` = "the 3-value mode param is a whiff of type-code, but ... REJECT introducing
Strategy/polymorphism here".

**Sweep correctness has NO direct entry (Pitfall 6).** `pkgsweep`/`projsweep` are absent from
`targets.json`. Grade each applied refactoring in the sweep against the CONSTITUENT judgments:
nx `p8` -> `p7sweep` (`WS/e2e-nx/targets.json` lines 68-79, the multi-round `N_safe=2` + exported-
signature PAUSE trap) plus T1-T4; kata `gr4` -> `G1sweep` (`WS/e2e-gilded-rose/targets.json` lines
32-45, `N_safe=3+` + Conjured/Sulfuras behavior-change PAUSE trap). The `p7sweep`/`G1sweep`
`judgment` fields already encode Posture A/B/C (pass/timid/reckless) -- reuse that rubric verbatim.

**Ground truth (b) behavior-preserving -- behavior-oracle tier (independent).** See Shared Pattern
"Behavior oracle". Record `name_layer_correct: y/n` + `tests_green: y/n` per run per arm.

**Pass@k rollup:** reuse `run-e2e.mjs` `passAtK`/`passHatK` (lines 462-468) exactly; the
`passk-metrics.json` per-eval `{ n, fully_correct, pass@1, pass^1, pass@3, pass^3 }` block is the
copy-ready shape.

---

### `13-RESULTS.md` (report, aggregate)

**Analog:** `WS/e2e-nx/E2E-RESULTS.md` (closest -- nx suite, with/without table + conclusions +
caveats), `WS/e2e-gilded-rose/GR-RESULTS.md` (sweep + L1 parity framing), and
`WS/e2e-reference/REFERENCE-RESULTS.md` (per-cell delta table + explicit "essentially NULL" verdict).

**Header block pattern** (from `E2E-RESULTS.md` lines 1-8): title, model/effort line
(`claude-opus-4-8`, effort `high`, `--setting-sources project`), arms, borrowed-repo + branch, and a
pointer to raw runs with the `outputs/` gitignored note.

**Per-cell Pass@k table pattern** (from `E2E-RESULTS.md` lines 14-21):

```
| prompt | intent | run-1 | run-2 | run-3 | fired | pass@1 | pass@3 | pass^3 |
|--------|--------|-------|-------|-------|-------|--------|--------|--------|
| p1 | coach: Long Function | - | - | - | 0/3 | 0.00 | 0.00 | 0.00 |
```

**with/without comparison-table pattern** (from `E2E-RESULTS.md` lines 67-71 and
`REFERENCE-RESULTS.md` lines 12-23): one row per cell, columns for each arm + a `delta`/`marginal
value` column + a short note. `REFERENCE-RESULTS.md` line 14 is the exact style for a per-cell delta
with a "GENUINE edge (verified)" annotation.

**Two-table layout (D discretion, per RESEARCH Code Examples):** one table per dimension --
`## Book authenticity` (columns: cell | arm | runs | claims | pass | partial | fail | pass@1 |
pass@3 | pass^3) and `## Correctness` (cell | arm | name/layer k=3 | tests-green k=3 | pass@1 |
pass@3). Skeleton in `13-RESEARCH.md` Code Examples (REQ-5).

**Verdict pattern (empirical, NOT a pre-assumed win -- D-08).** Copy the framing of
`REFERENCE-RESULTS.md` "Verdict: essentially NULL, with ONE genuine niche edge" (line 9) and
`GR-RESULTS.md` "L1 = parity + a legible warrant, not an output win over base" (line 53). The prior
finding to CONFIRM OR REFUTE (from `WS/E2E-FINDINGS.md` / `E2E-RESULTS.md` conclusions): base Opus
4.8 @ high is already catalog-grade on plain mechanical work; the skill's realizable edge is
pattern-directed / de-patterning / seam. State parity or a signed magnitude delta.

**Caveats section pattern** (from `E2E-RESULTS.md` lines 116-123): effort=high not xhigh; single
model; N=3; plus THIS phase's comparability caveat (CONTEXT specifics) -- reused single-target
`with_skill`/`invoke_skill` diffs were captured under earlier SKILL.md states, so read the
single-target with/without delta as skill-arm-at-capture-time vs base-now; the SWEEP cells re-run
fresh carry no such caveat -- lean on them for the headline.

**Location:** `.planning/phases/13-.../13-RESULTS.md` is the ONLY artifact under `.planning/` (D-08).

---

### (Optional) diff-to-claim normalizer helper (utility, file-I/O + transform)

**Analog:** `WS/grade-run.mjs`, `WS/grade-reference.mjs` (deterministic per-fact graders, Node ESM),
and `run-e2e.mjs` `extractResult()` + `report()` (lines 380-440, 472-545) for the read-tree /
write-record idioms.

**Only build this if manual diff reads prove noisy (D discretion + RESEARCH "New code should be
limited to a thin diff-to-claim normalizer").** Ponytail: skip until the sweep diffs are actually
noisy to read by hand -- p8 `answer.md` is already a claim list. If built: Node ESM `.mjs`, reads
`results/apply/<arm>/<pN>/run-<k>/{diff.patch,answer.md,meta.json}`, emits a claim JSON per run.
Reuse `run-e2e.mjs` file-walk pattern (`fs.readdirSync` over `results/apply`, lines ~480-500) and its
`passAtK`/`passHatK` rather than re-deriving combinatorics. It reads OUR output only -- never
`.oracle/`.

**Reused harness invocation (NOT a new file -- reference for the run-arm plan tasks):** exact
`run-e2e.mjs --dry-run` then `--mode apply --arm no_skill|both` commands are in `13-RESEARCH.md` Code
Examples (REQ-1/REQ-2). Dry-run first (spends nothing); halt at D-09 before any metered run.

## Shared Patterns

### Pass@k / Pass^k math
**Source:** `WS/e2e-nx/run-e2e.mjs` lines 442-468 (`comb`, `passAtK`, `passHatK`).
**Apply to:** every grading record + `13-RESULTS.md`, both dimensions, per cell x arm at k=3.
```javascript
// run-e2e.mjs:462-468 -- reuse verbatim (n = total runs, c = passing runs; null when k > n)
function passAtK(n, c, k) {
  return k > n ? null : 1 - comb(n - c, k) / comb(n, k);
}

function passHatK(n, c, k) {
  return k > n ? null : comb(c, k) / comb(n, k);
}
```
Don't hand-roll combinatorics (RESEARCH "Don't Hand-Roll"). Record-shape to fill:
`aggregate.json` `passk` block `{ n, c, passAt1, passAt3, passHat3 }` (lines 18-40).

### Run-output persistence (why diffs survive repo restore -- D-04)
**Source:** `WS/e2e-nx/run-e2e.mjs` lines 399-431.
**Apply to:** understanding what the reused runner already guarantees (no new code).
```javascript
// run-e2e.mjs:399-408 -- stage ALL (incl. new files) so `diff --cached` captures them, into the
// WORKSPACE, BEFORE the next run's reset --hard wipes the borrowed repo.
git(cwd, ['add', '-A']);
const diff = git(cwd, ['diff', '--cached', APPLY_BASE]);
fs.writeFileSync(path.join(outDir, 'diff.patch'), diff.stdout || '');
const names = git(cwd, ['diff', '--cached', '--name-only', APPLY_BASE]);
changedFiles = (names.stdout || '').split('\n').map((s) => s.trim()).filter(Boolean);
git(cwd, ['reset']);
```
`meta.json` schema (run-e2e.mjs:411-431) is the correctness input: `changed_files`, `used_refactor`,
`skills_invoked`, `exit_code`, `elapsed_ms`, `prompt_used`. Protected-branch guard is at lines
337-353 (`apply mode refuses to reset --hard on protected branch`) -- kata must leave `main` first.
An explicit no-edit run leaves a `meta.json` with empty `changed_files` (REQ-1 acceptance; p2
run-3..8 are the documented 0-byte declines -- Pitfall 8).

### Oracle packaging (DST-04 firewall)
**Source:** `.claude/agents/oracle.md` -- input contract (lines 60-64), output footer (lines
104-121), direction-table rule (lines 89-100).
**Apply to:** every book-authenticity claim (REQ-3, D-05).
- ONE book per call (oracle.md:61-63). Book routing: Fowler -> `.oracle/refactoring-2e/index.md`;
  Kerievsky -> `.oracle/refactoring-to-patterns/index.md`; GoF -> `.oracle/design-patterns/index.md`.
- Hand the oracle the named refactoring + OUR own-words functional description; ask for
  pass|partial|fail + why. Verdict is returned in the agent's own words -- store it verbatim.
- Efficiency lever (D discretion): batch same-(book, refactoring) claims (most sweep claims are
  Extract Function) into one call; the per-claim VERDICT stays oracle-owned.
- `oracle-reviewer` (`.claude/agents/oracle-reviewer.md`) is usable ONLY on a drafted per-claim doc
  (it gates documents, not raw transcripts) -- reserve for the optional unbiased second pass.
- Main context reads ONLY `diff.patch`/`answer.md`/`targets.json`; NEVER `.oracle/` (Pitfall 4).

### Behavior oracle (independent -- run ORIGINAL tests on EDITED source, D-07 / Phase-12 D-14)
**Source:** `13-RESEARCH.md` Code Examples REQ-4(b); borrowed-repo runners.
**Apply to:** the `tests_green y/n` field of every correctness record, both arms.
- **nx (Pitfall 2 -- DIFFERENTIAL, not "all green"):** `@nx/eslint-plugin` has ~15 pre-existing
  failures on this arm64 box (recorded in `p8/run-1/answer.md` line 1: "15 failed / 169 passed").
  Record the baseline ONCE, then behavior-preserved = no NEW failures. Config:
  `packages/eslint-plugin/jest.config.cts`; run `npx nx test eslint-plugin`.
- **kata (Pitfall 3 -- pristine-seeded snapshot):** `test/jest/approvals.spec.ts` uses
  `toMatchSnapshot()` and NO `.snap` exists on disk. Seed the golden master from PRISTINE `main`
  first, then `git apply` each diff and re-run `npx jest --ci test/jest/approvals.spec.ts` (`--ci`
  refuses to write, fails on mismatch). Ignore `test/jest/gilded-rose.spec.ts` (asserts `'fixme'`).
- Re-apply on a FRESH throwaway checkout each time (never trust the in-session self-reported run).

### ASCII + PII hygiene (REQ-6, Pitfall 5)
**Source:** project `CLAUDE.md` / `AGENTS.md`; the trap is live in reused transcripts.
**Apply to:** `13-RESULTS.md` and every authored grading record (all committed under `.planning/` or
the tracked `results/apply/**` tree).
- The reused `p8/run-1/answer.md` contains em-dashes (U+2014) and curly quotes -- when quoting a model
  claim or oracle verdict, normalize to ASCII (`->`, straight quotes, no em-dashes/box-drawing).
- Verify committer identity = approved public gmail; run an allowlist-inversion email scan (assert the
  ONLY email-shaped token is the approved gmail); never write the work email/domain as a search needle.
- No `.oracle/` path or source prose in any committed artifact (hygiene scan). Search with `git grep`
  (tracked) / `rg -uu` (gitignored `.oracle/`, `node_modules/`, `outputs/`) -- never the Grep tool
  (Pitfall 7).

### Repo restoration (REQ-6)
**Source:** `13-RESEARCH.md` Runtime State table + D-04.
**Apply to:** cleanup after all runs. nx clone back to clean `git status` (currently on throwaway
`lz-refactor-e2e-smoke` with uncommitted edits); kata back on `main` (currently protected `main`, no
`.snap`); remove any throwaway worktrees + node_modules junctions. The persisted
`diff.patch`/`meta.json` in THIS repo remain (they are the tracked record).

## No Analog Found

None. Every artifact this phase produces has a direct in-repo precedent (this is why RESEARCH calls
it "assembly, not construction"). The only genuinely new code is the OPTIONAL diff-to-claim
normalizer, and even that mirrors `grade-run.mjs` / `run-e2e.mjs` idioms -- build it only if manual
sweep-diff reads prove noisy.

## Metadata

**Analog search scope:** `.claude/skills/lz-refactor-workspace/` (e2e-nx, e2e-gilded-rose,
e2e-reference, iteration-1, top-level graders); `.claude/agents/` (oracle, oracle-reviewer);
`.gitignore`.
**Files scanned:** ~25 (results docs x4, targets.json x2, run-e2e.mjs, oracle.md, aggregate.json,
passk-metrics.json, p8/p1/gr1 run dirs + meta/answer, gitignore, tree listings).
**Key disk facts confirmed this pass:** `results/apply/**/{answer.md,diff.patch,meta.json}` are
git-TRACKED (grading records dropped there ship); p8 `with_skill` k=3 present (2026-07-14);
`e2e-reference/results/` + `aggregate.json` are the sole ignored-record exception; oracle +
oracle-reviewer both present; both `targets.json` carry sweep-constituent judgments (`p7sweep`,
`G1sweep`).
**Pattern extraction date:** 2026-07-15
