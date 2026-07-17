# Phase 11: Skill-Effectiveness Evals - Pattern Map

**Mapped:** 2026-07-10
**Files analyzed:** 9 (7 core + 2 optional)
**Analogs found:** 9 / 9 (every target file has an exact on-disk analog in the Phase-5 rig)

All analogs are under `.claude/skills/lz-tpp-workspace/` (gitignored path prefix -- read with
`rg`/`Read`/`Glob`, never `git grep`). All targets are net-new (additive) under
`.claude/skills/lz-refactor-workspace/`, which currently holds only the Phase 7-10 catalog-checker
harness (`tools/check-*.mjs`, `samples/`, `extract-samples.mjs`, `package.json`, `tsconfig.json`) --
confirmed: NO `evals/` dir, NO `grade-run.mjs`/`merge-judge.mjs`/`eval-status.mjs`, NO
`tools/skill-creator-eval/`, NO `EVAL-RESULTS.md` exist there yet. The existing
`package.json` `check` script is the catalog battery; do NOT touch it (eval selfchecks run via
`node <script> --selfcheck` directly, or an additive new npm script at the planner's discretion).

This is a build-only phase. Every target below is BUILT and committed; nothing is RUN (D-10 hard
gate). The disposition column tells the planner exactly how much authoring each file needs.

## File Classification

| Target file (under `lz-refactor-workspace/`) | Role | Data flow | Closest analog (`lz-tpp-workspace/`) | Disposition |
|-----------------------------------------------|------|-----------|--------------------------------------|-------------|
| `tools/skill-creator-eval/` (whole dir) | vendored harness | file-I/O + subprocess | `tools/skill-creator-eval/` | COPY VERBATIM (README path-edit only) |
| `eval-status.mjs` | orchestration util | file-I/O (run-tree walk) | `eval-status.mjs` | COPY VERBATIM |
| `merge-judge.mjs` | grading util | transform (JSON merge/gate) | `merge-judge.mjs` | COPY VERBATIM |
| `run-spec-chunks.mjs` | orchestration util (optional) | subprocess + file-I/O | `run-spec-chunks.mjs` | LIGHT EDIT (4 constants + canary) |
| `grade-run.mjs` | deterministic grader | transform (response -> grading.json) | `grade-run.mjs` | HEAVY REWRITE (skeleton kept, matcher + RUBRICS replaced) |
| `evals/trigger-eval.json` | eval data (EVL-01) | data | `evals/trigger-eval.json` | REPLACE CONTENT (schema identical) |
| `evals/evals.json` | eval data (EVL-02) | data | `evals/evals.json` | REPLACE CONTENT (schema identical) |
| `EVAL-RESULTS.md` | results record | doc | `EVAL-RESULTS.md` | COPY STRUCTURE, blank numbers |
| `evals/d07-chunks/negatives.json`, `evals/trigger-smoke.json` | eval data (optional) | data | same names in analog | OPTIONAL, author if used |

Name->layer lookup DATA (new, no analog file -- derived from the shipped catalog READMEs at build
time): see "Shared Patterns -> Name->layer lookup" below.

## Pattern Assignments

### `tools/skill-creator-eval/` (vendored harness, COPY VERBATIM)

**Analog:** `.claude/skills/lz-tpp-workspace/tools/skill-creator-eval/`
Contents: `scripts/__init__.py`, `scripts/utils.py`, `scripts/run_eval.py`, `LICENSE.upstream.txt`,
`README.md`. The native fix (3 upstream bugs) lives in `run_single_query` inside `run_eval.py` and
is skill-agnostic -- copy byte-for-byte; do NOT re-fix upstream (A2). Verify with a post-copy diff.

**Only edit:** `README.md`. Two changes:
1. Replace the two `lz-tpp` example paths with `lz-refactor`.
2. Widen the Pitfall-2 note to name BOTH sibling skills (double-risk now that both ship in one
   plugin).

Current README lines to edit (`README.md:38`, `README.md:48`):
```
  --skill-path <repo>/plugins/lz-tdd/skills/lz-tpp \
```
```
- A3 / Pitfall 2: ensure `lz-tpp` is NOT an enabled project skill in the directory where
```
Change `lz-tpp` -> `lz-refactor` in the `--skill-path`; change the Pitfall-2 note to "ensure
NEITHER `lz-tpp` NOR `lz-refactor` is an enabled project skill ... either real sibling can steal
the trigger". Keep the Apache-2.0 provenance block and the `run_eval` reimplementation note
verbatim.

Note: the README's usage example shows `--num-workers 3`, but the D-01 LOCKED run config is
`--num-workers 1` (serial). The `EVAL-RESULTS.md` "Harness lessons" section is the authoritative
run-config; the planner should either fix the README example to `1` or leave it (the RUN command in
EVAL-RESULTS.md / the final HALT task is what the operator uses).

---

### `eval-status.mjs` (orchestration util, COPY VERBATIM)

**Analog:** `.claude/skills/lz-tpp-workspace/eval-status.mjs` (73 lines). Fully generic run-tree
walker; takes `<iteration-dir> [--evals slugA,slugB] [--runs N]`. Hardcodes only `with_skill` /
`without_skill` config names and the `outputs/transcript.md` / `timing.json` / `metrics.json` /
`grading.json` / `grading.preliminary.json` artifact names -- all shared across skills. No lz-tpp
content. Copy byte-for-byte.

Core pattern (lines 43-63):
```javascript
for (const cfg of ["with_skill", "without_skill"]) {
  for (let k = 1; k <= runsExpected; k++) {
    const run = path.join(iter, slug, cfg, `run-${k}`);
    const t = exists(path.join(run, "outputs", "transcript.md")) && nonEmpty(...);
    ...
    if (!t) { state = "MISSING (respawn)"; missing++; }
    else if (gFinal) { state = "DONE (final grading.json)"; done++; }
    else { state = `PARTIAL [...] -- recoverable from transcript`; partial++; }
  }
}
```

---

### `merge-judge.mjs` (grading util, COPY VERBATIM)

**Analog:** `.claude/skills/lz-tpp-workspace/merge-judge.mjs` (436 lines). Fail-closed judge-verdict
merge + pre-aggregate completeness gate. Fully generic: the `--selfcheck` uses placeholder
`"Q1 nuance"` / `"Q2 nuance"` texts (no skill content). Three modes: `--merge`, `--verify
<iteration-dir>`, `--selfcheck`. Copy byte-for-byte. Its `--verify` gate is Pitfall-5 protection
(stops `aggregate_benchmark.py` from silently dropping unmerged runs). Selfcheck must be GREEN in
Wave 0 (no change expected -- it is verbatim).

Fail-closed refusals to preserve (the load-bearing behavior, lines 52-124): non-boolean verdict,
unknown/hallucinated verdict text, duplicate verdict, missing verdict, already-final preliminary --
each throws `MergeError` and exits 3, writing nothing.

Quick check command: `node merge-judge.mjs --selfcheck` (expect `SELFCHECK OK`).

---

### `run-spec-chunks.mjs` (orchestration util, LIGHT EDIT -- OPTIONAL component)

**Analog:** `.claude/skills/lz-tpp-workspace/run-spec-chunks.mjs` (115 lines). Canary-gated
specificity runner (Pitfall-1/throttle workaround). Logic reused verbatim; edit ONLY the 4
hardcoded path constants + the canary query.

Lines to change (`run-spec-chunks.mjs:14-18`):
```javascript
const WS = "D:/projects/github/LayZeeDK/lz-engineering-claude-plugins/.claude/skills/lz-tpp-workspace";
const TOOL_DIR = WS + "/tools/skill-creator-eval";
const SKILL = "D:/projects/github/LayZeeDK/lz-engineering-claude-plugins/plugins/lz-tdd/skills/lz-tpp";
const CHUNK_DIR = WS + "/evals/d07-chunks";
const CANARY = { query: "what does the transformation `(constant -> scalar)` actually mean and when would I reach for it?", should_trigger: true };
```
Rewrite for lz-refactor:
- `WS` -> `.../\.claude/skills/lz-refactor-workspace`
- `SKILL` -> `.../plugins/lz-tdd/skills/lz-refactor`
- `TOOL_DIR` / `CHUNK_DIR` derive from `WS` automatically (no separate edit).
- `CANARY` -> an lz-refactor should-trigger query with `should_trigger: true` (e.g. the Extract
  Function catalog lookup, EVL-01 candidate T6: "what does Extract Function actually do, and when
  should I reach for it over inlining?").

Everything else (chunking, `assess`, resume, combined report, `execFileSync` with
`PONYTAIL_DEFAULT_MODE: "off"` + `--num-workers 1`) is reused as-is. OPTIONAL: build it, but at RUN
time prefer the direct `run_eval` pass; fall back to chunking only if throttling shows.

---

### `grade-run.mjs` (deterministic grader, HEAVY REWRITE -- the only real authoring task)

**Analog:** `.claude/skills/lz-tpp-workspace/grade-run.mjs` (375 lines). This is the one file with
genuine per-skill work. KEEP the skeleton verbatim; REPLACE two skill-specific pieces.

**KEEP VERBATIM (lines cited from analog):**
- `toolDrive(metrics)` (lines 58-86) -- nodrive source; nested `tool_calls` OR flat `edits/writes/
  testRuns`; "drove" = any Edit/Write/MultiEdit/NotebookEdit/Bash > 0. Do not touch.
- `scoreCheck` nodrive + judge branches (lines 143-168) -- fail-safe (no metrics -> fail),
  fail-loud (unrecognized shape -> fail), judge -> `passed:null`.
- `grade()` preliminary/judge_required assembly (lines 199-218).
- `finalOutPath()` (lines 221-223) -- writes `grading.preliminary.json` while judge items remain.
- `parseArgs`, `main` (lines 299-372) -- unchanged except the `--eval-id <0-9>` range in the usage
  string / validation (widen to the lz-refactor eval count).
- The selfcheck STRUCTURE incl. the RUBRICS<->evals.json alignment assertion (lines 280-293) --
  Pitfall-6 protection. KEEP the alignment loop; rewrite only the per-check assertions to match the
  new matcher/RUBRICS.

**REPLACE 1 -- the name matcher.** lz-tpp used `transformRe(canonical)` (lines 44-54) that splits on
`->` and matches `(a -> b)` tokens:
```javascript
// ANALOG (lz-tpp) -- DELETE. Matches transformation tokens like "(nil -> constant)".
function transformRe(canonical) {
  const [a, b] = canonical.split("->").map((s) => s.trim());
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
                      .replace(/\\\{\\\}/g, "\\{\\s*\\}")
                      .replace(/-/g, "[- ]");
  return new RegExp(`(?<![\\w+])\\(?\\s*${esc(a)}\\s*->\\s*${esc(b)}(?![\\w+])\\s*\\)?`, "i");
}
```
lz-refactor names are proper-noun phrases ("Extract Function", "Replace Conditional with
Polymorphism", "Inline Singleton") -- NOT `(a -> b)` tokens. Replace with a case-insensitive,
whitespace-tolerant, word-bounded phrase matcher, e.g.:
```javascript
// TARGET (lz-refactor). Matches a canonical refactoring NAME, tolerant of spacing/newlines,
// word-bounded so "Extract Function" does not sub-match "Extract Functionality".
function nameRe(canonical) {
  const esc = canonical.trim()
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&") // escape regex metacharacters
    .replace(/\s+/g, "\\s+");               // tolerate any run of whitespace between words
  return new RegExp(`(?<![\\w-])${esc}(?![\\w-])`, "i");
}
```

**REPLACE 2 -- the RUBRICS object + check kinds.** lz-tpp check kinds were `{names:[...]}`,
`{anyRe:[...]}`, `{nodrive}`, `{judge}`. lz-refactor (per D-04-RUBRIC hybrid) uses:
- `{ candidateSet: [names] }` -> SCORED PASS if the response names ANY refactoring in the smell's
  candidate set (one-to-many tolerance; a correct-but-alternative in-set pick still passes). Match
  = `names.some(n => nameRe(n).test(resp))`.
- `{ bestFit: name }` -> SCORED PASS only if the pinned single best-fit name is present (scenarios
  whose details pin one answer, e.g. ids 2/6/8). Match = `nameRe(name).test(resp)`.
- `{ layer: "Fowler" | "Kerievsky" | "Kerievsky-Away" | "functional" }` (accept a single value OR an
  array of acceptable layers for the de-patterning case) -> SCORED PASS if the refactoring named in
  the response resolves to the expected layer via the name->layer lookup. This is what enforces
  "correct layer per CCH-01" deterministically (not by judge).
- `{ nodrive: true }` -> reuse verbatim (`toolDrive`).
- `{ judge: "question" }` -> reuse verbatim (`passed:null`, resolved by grader agent + merge-judge).
  Use ONLY for rationale quality (do NOT judge anything name/layer set-match covers). Examples:
  (a) does the rationale tie the named refactoring to the detected smell (not just name-drop);
  (b) id 8: did the coach justify the Fowler route over a pattern-directed one; (c) id 7: did the
  coach frame the pattern as unwarranted / name the FP dissolution.

RUBRICS shape per eval-id (illustrative for id 2, Duplicated Code in sibling subclasses):
```javascript
2: [
  { bestFit: "Pull Up Method", text: "Names Pull Up Method (duplicate in sibling subclasses)" },
  { candidateSet: ["Extract Function", "Slide Statements", "Pull Up Method"], text: "Names an in-set Duplicated Code refactoring" },
  { layer: "Fowler", text: "Routes to the Fowler mechanical layer" },
  { judge: "Ties the pick to WHERE the duplication lives (sibling subclasses -> lift to parent), not a generic dedup" },
  { nodrive: true, text: "Coach, don't drive (no edit / no test run)" },
],
```
De-patterning id 7 layer check accepts a set: `{ layer: ["Kerievsky-Away", "functional"] }` and
`{ candidateSet: ["Inline Singleton", "Module Namespace"] }` (both routes pass per D-05 note / A4).

**Selfcheck (KEEP structure, rewrite assertions):** exercise `candidateSet` any-match,
`bestFit` exact-match, `layer` resolve-via-lookup (Fowler + Kerievsky + the Away + functional
cases), the nodrive nested-drove/flat/miskeyed/no-metrics cases (copy those assertions verbatim,
they are matcher-agnostic), the `finalOutPath` preliminary path, and the RUBRICS<->evals.json
alignment loop (`RUBRICS[e.id].length === e.expectations.length` for every id -- KEEP; path
resolution reads `evals/evals.json` relative to the script, preserve it). Quick check:
`node grade-run.mjs --selfcheck` (expect `SELFCHECK OK`).

grading.json output shape is unchanged and MUST stay what `aggregate_benchmark.py` reads:
`{ expectations:[{text,passed,evidence}], summary:{passed,failed,total,pass_rate}, preliminary,
judge_required }`.

---

### `evals/trigger-eval.json` (EVL-01 data, REPLACE CONTENT)

**Analog:** `.claude/skills/lz-tpp-workspace/evals/trigger-eval.json`. Schema is a flat array of
`{ query: string, should_trigger: boolean }`. lz-tpp shipped 13 should-trigger + 14 near-miss.
lz-refactor authors 8-10 + 8-10 (D-02) from the RESEARCH.md "EVL-01 Query Candidates" table (T1-T10
should-trigger, N1-N10 near-miss). Ground truth = the shipped `description` (SKILL.md:3-12), incl.
its explicit "Do not use it for the green / transformation step of TDD ... is lz-tpp" clause.

Analog excerpt (schema shape -- note: lz-tpp's should-trigger ARE green-step queries; for
lz-refactor those same green-step queries FLIP to `should_trigger: false`, the highest-value
negatives N1-N3):
```json
[
  {"query": "red test `expect(of(2)).toBe(1)`, my `of` is `return n <= 1 ? n : 1;`. whats the smallest edit to get it passing? doing tdd", "should_trigger": true},
  {"query": "write a jest test for this `formatCurrency(cents)` helper covering negative values and zero", "should_trigger": false}
]
```
For lz-refactor: should-trigger = refactor-step/smell/catalog-lookup/de-patterning prompts (green
tests + a smell); near-miss MUST include >= 2 lz-tpp-seam green-step negatives ("which change makes
this failing test pass", "minimal transformation to green it") plus write-a-test, write-a-function,
"refactor to be faster" (behavior change), explain-SOLID, debug, complexity-analysis. Do NOT use a
"rename variable X" near-miss (Rename Variable IS a shipped Fowler refactoring -> legit trigger).
ASCII-only (`->`, straight quotes, no emojis).

---

### `evals/evals.json` (EVL-02 data, REPLACE CONTENT)

**Analog:** `.claude/skills/lz-tpp-workspace/evals/evals.json`. Schema:
```
{ "skill_name": string,
  "evals": [ { "id": int (0-based contiguous), "prompt": string, "expected_output": string,
               "files": [], "expectations": [string] } ] }
```
Set `skill_name: "lz-refactor"`. Author >= 8 scenarios (10 shown in RESEARCH "EVL-02 Scenario
Candidates"; trim the optional no-tests id 9 first). Each scenario = tests-GREEN code carrying a
smell (NO failing test -- a failing test is the lz-tpp green step). `files: []` (prompt-only). Each
`expectations` array MUST be count-aligned 1:1 with the corresponding `grade-run.mjs` RUBRICS[id]
(Pitfall-6; the selfcheck asserts this).

Analog excerpt (id 2 -- the shape to mirror; note `expectations` count == RUBRICS[2] check count):
```json
{
  "id": 2,
  "prompt": "fibonacci `of(n)` in typescript. base cases 0 and 1 are handled; ...",
  "expected_output": "Names (statement -> tail-recursion) #9; rejects plain (statement -> recursion) #11 as the pick.",
  "files": [],
  "expectations": [
    "Recommends `(statement -> tail-recursion)` (#9), e.g. via an accumulator helper",
    "Explicitly does NOT pick plain `(statement -> recursion)` (#11) as the next move ...",
    "Does not edit any source file and does not run tests (coach, don't drive)"
  ]
}
```
lz-refactor prompts describe green code + a smell and ask for the next refactoring; `expected_output`
names the best-fit refactoring + layer; `expectations` phrase the candidate-set / best-fit / layer /
judge / nodrive checks in prose (one string per RUBRICS check, same order). Every named refactoring
must resolve in the name->layer lookup (build-time lint). Ground truth is pre-proven from the smell
leaves (see candidate sets below). ASCII-only.

---

### `EVAL-RESULTS.md` (results record, COPY STRUCTURE, blank numbers)

**Analog:** `.claude/skills/lz-tpp-workspace/EVAL-RESULTS.md`. Copy the section structure; leave
numbers blank (filled only after the gated RUN). Sections to scaffold:
- Intro (skill, model `claude-opus-4-8`, runs 3 per query/scenario/config).
- `## EVL-01 -- Trigger accuracy (native)` -- recall / specificity table with the D-06 ~90% bar
  column, numbers blank.
- `## EVL-02 -- Behavior / next-refactoring` -- per-scenario with_skill vs baseline (full-pass,
  Pass@1) table + verdict column, numbers blank.
- `## Harness lessons` -- COPY the run-config caveat text VERBATIM (it is the authoritative
  run-config record): run the trigger probe serially (`--num-workers 1`);
  `PONYTAIL_DEFAULT_MODE=off`; `--strict-mcp-config` (drops MCP ~3%); `--setting-sources project`
  (drops user plugins, keeps the ephemeral project skill, ~54% token cut); do NOT use
  `--setting-sources ""` or `--bare`; specificity is throttle-robust, recall is not.
- `## Reproduce / resume` -- the RUN commands (grade -> judge -> merge -> verify -> aggregate).

The analog's `> CORRECTION (2026-07-03)` block documents the num-workers-3 false-8%-recall artifact
(Pitfall 1); carry the LESSON into "Harness lessons" but do not copy the lz-tpp-specific correction
prose.

## Shared Patterns

### Name->layer lookup (new build-time DATA -- feeds the grade-run.mjs `layer` check)

**Sources (shipped, tracked -- read with `git grep`/Read):**
- `plugins/lz-tdd/skills/lz-refactor/references/fowler-catalog/README.md` (+ 62 leaf filenames under
  `fowler-catalog/`) -> every Fowler name maps to `"Fowler"`.
- `plugins/lz-tdd/skills/lz-refactor/references/kerievsky-catalog/README.md` -> all 27 names map to
  `"Kerievsky"`; the 3 rows whose `Direction` column is `Away` (Inline Singleton, Encapsulate
  Composite with Builder, Move Accumulation to Visitor) ALSO map to `"Kerievsky-Away"`.
- `plugins/lz-tdd/skills/lz-refactor/references/functional-catalog/README.md` -> idiom-leaf names
  (Module Namespace, Discriminated Union and Fold, First-Class Function, Function Composition,
  Factory Function, etc.) map to `"functional"`.

Kerievsky Direction column excerpt (the Away rows to tag -- `kerievsky-catalog/README.md:22-23,61`):
```
| [Encapsulate Composite with Builder](...) | Away | Builder | clients build a Composite by hand ... |
| [Inline Singleton](...) | Away | Singleton | a class is a Singleton, but its single-instance policy ... |
| [Move Accumulation to Visitor](...) | Away | Visitor | code accumulates a result by iterating ... |
```
Functional Singleton dissolution excerpt (`functional-catalog/README.md:39,71`): Singleton and
Inline Singleton both map to `[Module Namespace](module-namespace.md#singleton)` -- so the
de-patterning scenario (id 7) `candidateSet` accepts BOTH `Inline Singleton` (Kerievsky-Away) and
`Module Namespace` (functional), and its `layer` check accepts `["Kerievsky-Away", "functional"]`.

The planner builds this lookup as a small map literal (or derives it from the READMEs at build
time). Keep it in `grade-run.mjs` or a sibling data file that grade-run imports; the selfcheck must
assert every `candidateSet`/`bestFit` name in RUBRICS resolves in the lookup.

### Candidate sets (from the smell leaves -- the D-04-RUBRIC candidate sets)

Each smell leaf has a `## Candidate refactorings` section; the candidate set = the link texts under
it. Long Function leaf excerpt (`references/smells/long-function.md:22-30`):
```
## Candidate refactorings
- [Extract Function](...): pick when a span of the body can be named ...; this is the workhorse move for length.
- [Replace Temp with Query](...): pick when local temporaries are what make extraction awkward.
- [Introduce Parameter Object](...): pick when extraction is blocked by a clump of arguments ...
- [Preserve Whole Object](...): pick when several extracted parameters all come from one object ...
- [Replace Function with Command](...): pick when the whole function is too tangled ...
- [Decompose Conditional](...): pick when the length comes from a complex conditional's ...
- [Split Loop](...): pick when one loop does several things ...
- [Replace Conditional with Polymorphism](...): pick when the same switching on one condition recurs ...
```
Smell leaves live under `references/smells/` (long-function, long-parameter-list, duplicated-code,
feature-envy, conditional-complexity, combinatorial-explosion, repeated-switches, ...). The planner
lifts the candidate set for each EVL-02 scenario from its anchoring leaf (RESEARCH "EVL-02 Scenario
Candidates" table already maps scenario -> leaf -> candidate set -> best-fit -> layer).

### Coach ground truth (EVL-02 behavior + the lz-tpp seam)

**Source:** `plugins/lz-tdd/skills/lz-refactor/SKILL.md`.
- `description` (lines 3-12) = EVL-01 trigger ground truth, incl. the explicit out-of-scope clause
  "Do not use it for the green / transformation step of TDD (... is lz-tpp)".
- Coach decision procedure (lines 38-70, CCH-01..06) = EVL-02 layer-routing ground truth. Key
  excerpt (lines 47-58): mechanical smell -> Fowler; repeated/complex-structure smell -> Kerievsky;
  unwarranted pattern -> refactor AWAY (Kerievsky Away or functional dissolution); no tests -> route
  to Feathers first. `Coach, don't drive` (lines 69-70) = the `nodrive` check ground truth.

### Repo hygiene (applies to all authored eval prose)

- ASCII-only committed content: `->` not the arrow char, straight quotes, no emojis/em-dashes
  (trigger queries + scenario prompts are new committed prose; code snippets stay ASCII).
- Re-run the allowlist-inversion email scan before committing (assert the only email-shaped token is
  the approved gmail; never write the work email/domain as a needle).
- All eval assets under `.claude/skills/lz-refactor-workspace/` (D-09). The root `.gitignore`
  `.claude/skills/*-workspace/` rules already track the eval RECORD (sets, scripts, tools,
  results) and drop bulky raw outputs (`outputs/`, `*.stream.jsonl`, `trigger-results*.json`,
  `iteration-*/`, `__pycache__/`, `samples/`) -- reuse as-is; no per-skill gitignore edits. Do NOT
  write anything into `plugins/lz-tdd/skills/lz-refactor/` (a D-08 tuning pass is the only allowed
  write-back, and only if a bar is missed).

## No Analog Found

None. Every target file has an exact on-disk analog in the Phase-5 lz-tpp rig. The only net-new
artifact with no file analog is the name->layer lookup DATA, which is derived from three shipped,
tracked catalog READMEs (see Shared Patterns) -- not invented.

## Metadata

**Analog search scope:** `.claude/skills/lz-tpp-workspace/` (Phase-5 rig, gitignored -- read via
Glob/Read), `.claude/skills/lz-refactor-workspace/` (target, confirmed no eval assets),
`plugins/lz-tdd/skills/lz-refactor/` (skill under test + ground-truth catalogs, tracked).
**Files read for excerpts:** `grade-run.mjs`, `merge-judge.mjs`, `eval-status.mjs`,
`run-spec-chunks.mjs`, `evals/trigger-eval.json`, `evals/evals.json`, `EVAL-RESULTS.md`,
`tools/skill-creator-eval/README.md` (all lz-tpp-workspace); `SKILL.md`,
`references/smells/long-function.md`, `references/kerievsky-catalog/README.md`,
`references/functional-catalog/README.md`, `package.json` (lz-refactor).
**Search tools:** `rg`/`Glob`/`Read` for gitignored workspace paths; NO `git grep` under
`*-workspace/` (silent-zero landmine), NO Grep tool (denied on this machine).
**Pattern extraction date:** 2026-07-10
