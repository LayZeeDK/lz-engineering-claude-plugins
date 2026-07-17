# Testing Patterns

**Analysis Date:** 2026-07-17

This is a Markdown-authored skill/plugin repository. There is **no application
runtime to unit-test**, so "testing" here means three distinct things, all
living under `.claude/skills/*-workspace/`:

1. **Structural checkers** -- deterministic Node.js scripts that assert the
   shippable Markdown catalog obeys its contract (completeness, per-leaf fields,
   cross-ref mirroring, ASCII/hygiene). These are the closest thing to unit tests.
2. **Embedded self-checks** -- `--selfcheck` assertion suites inside the eval
   graders that verify the grader logic itself.
3. **AI behavior evals** -- graded `claude -p` runs that measure whether the skill
   triggers correctly and gives the right coaching/output. These cost money and
   are gated behind explicit human approval.

There is **no jest / vitest / mocha** for authored code and no `package.json`.
(The vendored `.gsd-opengsd/` toolchain has its own test suite; ignore it.)

## Test Framework

**Runner:**
- Plain Node.js (`node <script>.mjs`). ESM, node builtins only, no framework,
  no config file. Each script is self-contained and exits `0` (green) or nonzero
  (red / failure).

**Assertion Library:**
- None. Checkers use a hand-rolled `report(ok, label, detail)` + failure counter.
- Self-checks use a hand-rolled `assert(cond, msg)` that flips an `ok` flag and
  logs `SELFCHECK FAIL: <msg>`.

**Run Commands:**
```bash
# Structural checker battery (run each; all must print GREEN / exit 0)
node .claude/skills/lz-refactor-workspace/tools/verify-scaffold.mjs
node .claude/skills/lz-refactor-workspace/tools/check-catalog.mjs      # Fowler 62-leaf contract
node .claude/skills/lz-refactor-workspace/tools/check-kerievsky.mjs
node .claude/skills/lz-refactor-workspace/tools/check-gof.mjs
node .claude/skills/lz-refactor-workspace/tools/check-functional.mjs
node .claude/skills/lz-refactor-workspace/tools/check-extra-patterns.mjs
node .claude/skills/lz-refactor-workspace/tools/check-smells.mjs
node .claude/skills/lz-refactor-workspace/tools/check-principles.mjs
node .claude/skills/lz-refactor-workspace/tools/check-crossrefs.mjs
node .claude/skills/lz-refactor-workspace/tools/check-backing.mjs
node .claude/skills/lz-refactor-workspace/tools/check-hygiene.mjs      # ASCII + email + no-verbatim

# Eval-set lint + grader self-checks (fast, free, deterministic)
node .claude/skills/lz-refactor-workspace/check-evals.mjs
node .claude/skills/lz-refactor-workspace/grade-run.mjs --selfcheck

# Behavior / trigger / e2e evals (SPENDS claude -p budget -- see "Approval gate")
node .claude/skills/lz-refactor-workspace/run-spec-chunks.mjs ...
node .claude/skills/lz-refactor-workspace/e2e-nx/run-e2e.mjs ...
```

## Test File Organization

**Location:**
- Per-skill workspace: `.claude/skills/lz-refactor-workspace/` and
  `.claude/skills/lz-tpp-workspace/`. Tooling and eval records are NOT inside the
  shipped `plugins/` tree -- they sit alongside it in the ignored-by-default
  workspace root.
- Structural checkers: `.../tools/check-*.mjs` + `verify-scaffold.mjs`.
- Shared checker helpers: `.../tools/lib/*.mjs`
  (`heading-scan.mjs`, `section-body.mjs`, `scaffold-phrases.mjs`,
  `github-slug.mjs`) -- single source of truth so checkers cannot diverge.
- Eval sets + records: `.../evals/`, `.../grading/`, `.../e2e-*/`,
  `.../iteration-1/`.

**Naming:**
- Checkers: `check-<domain>.mjs` (one per catalog/axis).
- Graders: `grade-run.mjs`, `grade-reference.mjs`; mergers `merge-judge.mjs`;
  runners `run-*.mjs`; prep/synthesis `prep-*.mjs`, `synth*.mjs`.

**What is tracked vs ignored** (`.gitignore` lines 24-49):
- **Tracked:** the checker/harness `tools/`, eval sets (`evals.json`,
  `trigger-eval.json`, `suite.json`, `targets.json`), grading rubrics/configs,
  and the verdict records (`*-RESULTS.md`, `*-FINDINGS.md`, `benchmark.json`,
  `aggregate.json` where noted).
- **Ignored:** bulky re-runnable byproducts -- `**/outputs/`, `**/results*/`,
  `**/run-*/`, `*.stream.jsonl`, `run_loop_*`, generated `samples/`, and
  `.oracle/`. The verdict is committed; the raw run is regenerable.

## Test Structure

**Structural checker pattern** (`check-catalog.mjs`, `check-hygiene.mjs`,
`verify-scaffold.mjs`):
```js
let failures = 0;
const report = (ok, label, detail) => {
  if (!ok) {
    failures++;
  }

  console.log(`  [${ok ? "PASS" : "FAIL"}] ${label}${detail ? " -- " + detail : ""}`);
};

// ... run every assertion via report(...) ...

if (failures === 0) {
  console.log("SUMMARY: ... GREEN -- ...");
  process.exit(0);
}

console.log(`SUMMARY: ... RED -- ${failures} check(s) FAILED`);
process.exit(1);
```

**Embedded self-check pattern** (`grade-run.mjs --selfcheck`):
```js
function selfcheck() {
  let ok = true;
  const assert = (cond, msg) => {
    if (!cond) {
      ok = false;
      console.error("SELFCHECK FAIL:", msg);
    }
  };

  assert(N("Extract Function").test("do an Extract Function ..."), "matches exact phrase");
  assert(!N("Extract Function").test("Extract Functionality"), "must NOT sub-match a longer word");
  // ...

  console.log(ok ? "SELFCHECK OK" : "SELFCHECK FAILED");
  process.exit(ok ? 0 : 1);
}
```
Self-checks exercise: the name matcher edge cases, each rubric-check kind
(bestFit / candidateSet / layer / nodrive), fail-loud/fail-closed output paths,
and **drift guards** that re-read the real data files and assert the code's
tables stay aligned with them (e.g. `RUBRICS` count == `evals.json` expectation
count; every rubric name resolves in the name->layer lookup).

## Mocking

**Framework:** None.

**Patterns:**
- No mocking library. Self-checks pass **literal fixtures inline** -- a fake coach
  response string and a fake metrics object:
```js
const zero = { tool_calls: { Edit: 0, Write: 0, Bash: 0 } };
const g0 = grade(0, "the workhorse move is Extract Function on ...", zero);
assert(g0.expectations[0].passed === true, "bestFit passes when named");
```
- The unit under test is a pure function (`grade`, `nameRe`, `layersInResponse`,
  `sectionBody`), so no I/O needs mocking -- inputs are constructed in-memory.

**What NOT to mock:**
- The real data files. Drift guards deliberately read `evals.json` /
  `negatives.json` from disk so a stale/renamed data file fails loudly rather
  than being masked by a stub.

## Fixtures and Factories

**Test data:**
- Eval scenarios: `.../evals/evals.json` -- array of
  `{ id, prompt, expected_output, files, expectations[] }`. `expectations` are
  1:1 count-aligned with the `RUBRICS[id]` checks in `grade-run.mjs` (a drift
  guard enforces the alignment).
- Trigger eval: `.../evals/trigger-eval.json` -- array of
  `{ query, should_trigger }`; `check-evals.mjs` asserts >= 8 positives, >= 8
  negatives, >= 2 "seam" negatives, ASCII-clean, and byte-consistency with
  `.../evals/d07-chunks/negatives.json`.
- E2E apply evals: `.../e2e-*/suite.json` + `targets.json` -- point at real
  external repos (`repo`, `applyBase`, `protectedBranches`, per-prompt
  `{ id, file, target, code }`). Prompts live in `.../e2e-*/**/prompts/`.
- Grading rubrics/config: `.../grading/**/*.json`
  (`book-authenticity/`, `correctness/`, `head-to-head/`), with
  `*.template.json` and `*.sample.json` provided as shape references.
- Golden master: `.../e2e-gilded-rose/golden-master/approvals.spec.ts.snap` and
  `.../e2e-nx/behavior-baseline.json` pin pre-refactor behavior so an apply eval
  can prove behavior was preserved.

**Location:** co-located with the runner that consumes them, under the workspace.

## Coverage

**Requirements:** No numeric line-coverage target and no coverage tool. "Coverage"
here has two meanings:
- **Catalog coverage** -- the checker battery asserts *completeness*: e.g.
  `check-catalog.mjs` requires all 62 canonical Fowler names present exactly once
  with full contract fields (`62/62` = green). This is the shippable-content
  coverage gate.
- **Eval / Nyquist coverage** -- behavior evals must cover each routing decision
  and the negative seam; Pass@k / Pass^k reliability is computed across runs
  (see below).

**View coverage:**
```bash
node .claude/skills/lz-refactor-workspace/eval-status.mjs   # eval run status
```

## Test Types

**Structural / contract tests (unit-equivalent):**
- Scope: the shipped Markdown -- leaf headings, `Use when:` selectors, required
  sections, ts/js fences, README-row mirroring, cross-refs, ASCII/email/verbatim
  hygiene. Deterministic, free, fast. Run these on every content change.

**Grader self-checks:**
- Scope: the grading logic itself. `--selfcheck` on `grade-run.mjs` (and the
  `selfcheck-code-review.mjs` guard). Run before trusting a grading run.

**AI behavior evals (integration/e2e):**
- Trigger evals: does the skill auto-activate for in-scope prompts and stay
  silent on near-miss negatives (`trigger-eval.json`).
- Behavior evals (EVL-02): does the coach name the correct next refactoring in
  the correct layer without editing code. Graded by a **deterministic
  pre-filter** (`grade-run.mjs`: `bestFit` / `candidateSet` / `layer` / `nodrive`
  checks) with rationale-quality items delegated to an **LLM judge**, then merged
  (`merge-judge.mjs`) before recomputing the summary.
- E2E apply evals: run the skill against real repos and check the applied diff
  preserved behavior (golden master / behavior baseline) and made the intended
  change (`e2e-nx/run-e2e.mjs`, `e2e-angular/*`).

**Reliability metrics:** report **Pass@k** (>=1 of k runs fully passes) and
**Pass^k** (all k pass) per eval and overall, for k = 1, 3, 5 and the run count.
A run "fully passes" only when every expectation passes.

## Common Patterns

**Deterministic-first grading (fail-closed):**
```js
// grade-run.mjs: refuse to emit a FINAL grading.json while judge items remain.
function finalOutPath(outArg, judgeCount) {
  return judgeCount > 0 ? path.join(path.dirname(outArg), "grading.preliminary.json") : outArg;
}
```
The deterministic layer scores everything it can; anything requiring judgment is
emitted as `passed: null` and MUST be resolved by the LLM judge + merge before a
final verdict. `aggregate_benchmark.py` skips any run dir that still has only a
preliminary file (never counts an unmerged run as a pass).

**Drift guards over stubbing:** self-checks re-read the canonical data files and
assert code tables match them, so a rename or count change fails loudly:
```js
for (const e of doc.evals) {
  assert(RUBRICS[e.id].length === e.expectations.length,
    `eval ${e.id}: rubric/expectation count drift`);
}
```

**Fail-safe / fail-loud verification:** an unverifiable condition fails rather
than passing silently -- e.g. `nodrive` fails when metrics are missing (fail-safe)
and fails with explicit evidence when the metrics shape is unrecognized
(fail-loud), never a silent pass.

**Windows arm64 harness note:** the upstream skill-creator eval runner is broken
on Windows (native `select`, trigger mis-detection); this repo vendors a
native-fixed harness under the workspace `tools/`. Use the vendored scripts, not
the upstream runner.

## Approval Gate (process rule)

Running behavior/trigger/e2e evals spends `claude -p` budget. **Do not RUN evals
or trigger optimizations without explicit human approval.** Preparing eval sets,
rubrics, and running the free deterministic checkers / `--selfcheck` is always
fine; halt before any metered `claude -p` execution.

---

*Testing analysis: 2026-07-17*
