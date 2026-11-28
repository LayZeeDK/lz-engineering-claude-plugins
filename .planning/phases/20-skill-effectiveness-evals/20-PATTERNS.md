# Phase 20: Skill-Effectiveness Evals - Pattern Map

**Mapped:** 2026-07-21
**Files analyzed:** 17 new/modified (all under `.claude/skills/lz-red-workspace/`, plus 1 root `.gitignore` edit)
**Analogs found:** 17 / 17 (16 exact, 1 schema-only)

This is an eval-harness phase where the approach IS "copy the proven rig and adapt". Almost
every new file has an exact analog on disk in `.claude/skills/lz-refactor-workspace/` (the
Phase-11 lz-refactor rig, freshest generation) with `.claude/skills/lz-tpp-workspace/` as the
Phase-5 original. RESEARCH.md `## Rig Inventory + Reuse Map` already fixed the disposition
(verbatim / light-edit / rewrite / new) per file; this map pins the analog path, the exact
lines to copy, and what changes.

**Read-blindness note (Pitfall 7):** `git grep` returns silent zero inside
`.claude/skills/*-workspace/` (partially gitignored prefix). Every analog below was located
with Glob and read directly; the planner/executor must use `rg` or Read/Glob there too.

**Do NOT map as new:** the existing Phase-16 content gate already living in
`lz-red-workspace/` -- `extract-samples.mjs`, `tools/check-red-references.mjs`,
`tools/lib/provenance-honesty.mjs`, `tools/lib/scaffold-phrases.mjs`,
`tools/provenance-honesty.selftest.mjs`, `package.json`, `package-lock.json`,
`tsconfig.json`. Eval assets are ADDITIVE alongside these; leave them untouched.

## File Classification

Roles are eval-pipeline stages (harness / runner / grader / lint / test-data / report), not web
tiers. `Disposition` is the RESEARCH.md reuse verdict and is the primary signal for the planner.

| New/Modified File (rel. to `.claude/skills/lz-red-workspace/`) | Role | Data Flow | Closest Analog (in `lz-refactor-workspace/`) | Match | Disposition |
|---|---|---|---|---|---|
| `tools/skill-creator-eval/scripts/run_eval.py` | harness / trigger probe | batch (spawn `claude -p` per query) | same path | exact | VERBATIM |
| `tools/skill-creator-eval/scripts/utils.py` | utility | transform | same path | exact | VERBATIM |
| `tools/skill-creator-eval/scripts/__init__.py` | utility | n/a | same path | exact | VERBATIM |
| `tools/skill-creator-eval/LICENSE.upstream.txt` | provenance | n/a | same path | exact | VERBATIM |
| `tools/skill-creator-eval/README.md` | doc | n/a | same path | exact | COPY + EDIT (skill-path + triple-sibling note) |
| `eval-status.mjs` | utility / resume walker | file-I/O (walk run dirs) | `eval-status.mjs` | exact | VERBATIM |
| `merge-judge.mjs` | service (judge merge + aggregate gate) | transform / batch | `merge-judge.mjs` | exact | VERBATIM (optional cosmetic retitle) |
| `run-recall-chunks.mjs` | runner (canary-gated recall) | batch | `run-recall-chunks.mjs` | exact | LIGHT EDIT (SKILL path + CANARY) |
| `run-spec-chunks.mjs` | runner (canary-gated specificity) | batch | `run-spec-chunks.mjs` | exact | LIGHT EDIT (SKILL path + CANARY) |
| `grade-run.mjs` | grader | transform (response -> grading.json) | `grade-run.mjs` | exact | HEAVY REWRITE (skeleton kept) |
| `check-evals.mjs` | lint / validator | batch (fail-closed) | `check-evals.mjs` | exact | ADAPT (both seams + reciprocal + email-allowlist) |
| `evals/trigger-eval.json` | test-data (EVL-01) | data | `evals/trigger-eval.json` | exact (schema) | REPLACE CONTENT |
| `evals/reciprocal-red.json` | test-data (EVL-01 D-03.2) | data | `evals/trigger-eval.json` (schema only) | schema-only | AUTHOR NEW |
| `evals/evals.json` | test-data (EVL-02) | data | `evals/evals.json` | exact (schema) | REPLACE CONTENT |
| `evals/d07-chunks/negatives.json` | test-data (spec-runner input) | data | `evals/d07-chunks/negatives.json` | exact (schema) | AUTHOR (mirror of trigger negatives) |
| `EVAL-RESULTS.md` | report template | n/a | `EVAL-RESULTS.md` | exact (structure) | COPY STRUCTURE (numbers blank) |
| `<repo>/.gitignore` (3 added lines) | config | n/a | `.gitignore:43-45` (lz-refactor lines) | exact | EDIT (add lz-red lines) |

**Cross-file borrow (single most valuable non-obvious reuse):** `grade-run.mjs` (rewrite) must
lift `occursAffirmed()` + its clause helpers FROM `grade-reference.mjs` (a file NOT otherwise
copied). See Shared Patterns -> Negation-aware phrase matching.

## Pattern Assignments

### `tools/skill-creator-eval/` (harness, VERBATIM) + `eval-status.mjs` + `merge-judge.mjs`

**Analog:** identical paths in `lz-refactor-workspace/`. Copy byte-for-byte; the native fix and
merge/gate logic are skill-agnostic. Do NOT re-fix the upstream bugs.

`run_eval.py` carries the three-bug native fix (documented in the README below). `merge-judge.mjs`
header names its modes and is fully generic:

```
merge-judge.mjs:15-30  (modes)
//   --merge --preliminary <grading.preliminary.json> --verdicts <judge-verdicts.json> --out <grading.json>
//   --verify <iteration-dir>     Pre-aggregate GATE ... ERRORS (exit 1) if ANY run dir lacks a final grading.json
//   --selfcheck
```

`merge-judge.mjs:2` cosmetically says "lz-tpp"; optionally retitle the comment to lz-red (no
logic change). `merge-judge.mjs --selfcheck` MUST stay GREEN after copy.

`eval-status.mjs:1-6` header (resume/status walker over `eval-*/<config>/run-*`) is fully
generic; copy verbatim.

**README edit (`tools/skill-creator-eval/README.md`, COPY + EDIT two spots):**
- Usage `--skill-path` (README `:39`): `.../plugins/lz-tdd/skills/lz-refactor` -> `.../lz-red`.
- Pitfall-2 sibling note (README `:50-52`): currently names lz-tpp + lz-refactor; edit to name
  ALL THREE siblings (lz-tpp, lz-refactor, lz-red now ship in one plugin = TRIPLE steal-risk).
  Keep the header "Phase 5" provenance line honest (this is a copy; note it serves the lz-red eval).

---

### `run-recall-chunks.mjs` + `run-spec-chunks.mjs` (runner, LIGHT EDIT)

**Analog:** `run-recall-chunks.mjs`, `run-spec-chunks.mjs`. Paths already resolve portably from
`import.meta.url`; only TWO constants change.

**Path resolution -- KEEP verbatim** (`run-recall-chunks.mjs:17-20`, mirrored in spec runner):
```javascript
const WS = path.dirname(fileURLToPath(import.meta.url)).replace(/\\/g, "/");
const TOOL_DIR = WS + "/tools/skill-creator-eval";
const SKILL = path.resolve(WS, "..", "..", "..", "plugins", "lz-tdd", "skills", "lz-refactor").replace(/\\/g, "/");
const CHUNK_DIR = WS + "/evals/d07-chunks";
```
**EDIT 1 -- re-point `SKILL`:** `"lz-refactor"` -> `"lz-red"` (line 19 recall / line 20 spec).

**EDIT 2 -- re-derive the CANARY** (`run-recall-chunks.mjs:34-39`; spec runner `:27-30`):
```javascript
const CANARY_PREFIX = "what does Extract Function actually do";
const CANARY = all.find((q) => q.should_trigger && q.query.startsWith(CANARY_PREFIX));
if (!CANARY) { throw new Error("canary positive missing from trigger-eval.json"); }
```
Replace `CANARY_PREFIX` with the leading text of a chosen lz-red should-trigger positive. WR-01:
derive FROM the eval set (`all.find(... startsWith(prefix))`), NEVER hand-type a twin that can
drift. The recall runner also excludes the canary from measured positives by the same prefix
(`:43`) -- one prefix constant drives the filter, the run, and the result-side lookup. The
throw-guard proves the prefix still matches a real positive after any query edit.

**Run config -- KEEP verbatim** (`run-recall-chunks.mjs:109-113`): the locked config that killed
Phase-5's false 8%-recall artifact is baked into the `execFileSync` call:
```javascript
["-m", "scripts.run_eval", "--eval-set", setPath, "--skill-path", SKILL, "--model",
 "claude-opus-4-8", "--runs-per-query", "3", "--num-workers", "1"],
{ cwd: TOOL_DIR, env: { ...process.env, PONYTAIL_DEFAULT_MODE: "off" }, ... }
```
(serial `--num-workers 1`, `PONYTAIL_DEFAULT_MODE=off`, session model `claude-opus-4-8`).

**Canary-gate logic -- KEEP verbatim** (`assess()` recall `:52-87`, spec `:46-74`): a chunk is
VALID only if its appended positive canary fired (`trigger_rate >= 0.5`), proving a non-throttled
window. Spec runner reads its negatives from `evals/d07-chunks/negatives.json` (`:36`).

For the D-03.2 reciprocal spot-check, the spec runner is the closest reusable shape (specificity
over a negative-tagged set) but must be pointed at `evals/reciprocal-red.json` against the lz-tpp
and lz-refactor skill-paths -- planner decides whether to parameterize the runner or invoke
`run_eval` directly three times (RESEARCH treats the reciprocal probe as three `run_eval`
invocations, no new tool).

---

### `grade-run.mjs` (grader, HEAVY REWRITE -- keep skeleton, replace matcher + RUBRICS)

**Analog:** `grade-run.mjs`. This is the ONE file needing real per-skill authoring. Keep the
whole control skeleton; replace only the refactoring-NAME machinery with RED phrase-set matchers.

**KEEP VERBATIM (skill-agnostic skeleton):**
- `toolDrive()` nodrive detection (`:194-222`): accepts canonical `tool_calls.{Edit,Write,MultiEdit,NotebookEdit,Bash}` OR flat `{edits,writes,testRuns}`; fail-SAFE on no metrics, fail-LOUD on unrecognized shape.
- `scoreCheck()` `judge` + `nodrive` branches (`:323-348`): `{judge}` -> `passed:null`; `{nodrive}` scored from metrics.
- `grade()` (`:391-410`): builds expectations, splits scored vs `judge_required`, preliminary summary.
- `finalOutPath()` (`:412-415`): STRUCTURALLY refuses a final `grading.json` while judge items remain -> writes `grading.preliminary.json` (fail-closed; aggregate then skips it).
- `parseArgs()` / `main()` (`:530-614`) incl. the stale-final-grading cleanup (`:597-603`) -- adjust only the eval-id range in the usage string + `validIds`.
- `--selfcheck` STRUCTURE (`:417-528`), especially the RUBRICS<->evals.json count-alignment gate (`:510-524`) that catches the Phase-5 eval-6 count-drift:
```javascript
for (const e of doc.evals) {
  assert(Array.isArray(RUBRICS[e.id]), `RUBRICS is missing an entry for eval ${e.id}`);
  assert(RUBRICS[e.id] && RUBRICS[e.id].length === e.expectations.length,
    `eval ${e.id}: RUBRICS has ${...} checks but evals.json has ${e.expectations.length} expectations (drift)`);
}
```

**REPLACE (skill-specific):**
- Remove `nameRe`/`NAME_LAYERS`/`FOWLER`/`KERIEVSKY`/`KERIEVSKY_AWAY`/`FUNCTIONAL`/`layersInResponse` (`:51-191`) -- the refactoring-name+layer model.
- Remove the `bestFit`/`candidateSet`/`layer` check kinds in `scoreCheck()` (`:350-386`); ADD a `phraseSet` check: SCORED PASS if the response AFFIRMS any phrase in the set (via the borrowed `occursAffirmed()`, NOT bare `regex.test`). Keep `nodrive` and `judge` unchanged.
- Rewrite `RUBRICS` (`:226-321`) into the D-05-RUBRIC per-dimension model. The analog's shape (a keyed object, 1:1 count-aligned with `evals.json[id].expectations`, mixing scored checks + `{judge}` + `{nodrive:true}`) is exactly the target shape. Analog RUBRIC entry to mimic (`:308-313`, eval 7):
```javascript
7: [
  { candidateSet: [...], text: "..." },
  { layer: [...], text: "..." },
  { judge: "Frames the Singleton as unwarranted ..." },
  { nodrive: true, text: "Coach, don't drive (no edit / no test run)" },
],
```
becomes, for RED (RESEARCH `## Deterministic RED-behavior Grading Design`, illustrative eval 2):
```javascript
2: [
  { phraseSet: ["output-based", "assert (on )?the returned value", "the value it returns"], text: "..." },
  { phraseSet: ["no doubles", "no mock", "pure function", "functional core"], text: "..." },
  { judge: "Is asserting the returned value ... genuinely observable behavior, not implementation?" },
  { judge: "Is this the right next test for a value-in/value-out function?" },
  { nodrive: true, text: "Coach, don't drive (no edit / no test run)" },
],
```
RESEARCH `## Deterministic RED-behavior Grading Design` gives the full per-dimension phrase-set
vocabulary (Selection / Structure / Assertion-target / Fail-for-the-right-reason / Handoff) and
locks the LLM judge to EXACTLY two dimensions ("is THIS the right next test", "is the target
observable not implementation").

**Keep the selfcheck FIXTURE style** (`:434-486`): scored-pass, scored-miss, nodrive nested/flat/
miskeyed/missing, judge-only `passed:null`. ADD negation fixtures (see borrow below) proving a
negated RED phrase is NOT credited, mirroring `grade-reference.mjs:494-508`.

---

### `check-evals.mjs` (lint, ADAPT)

**Analog:** `check-evals.mjs`. Keep the fail-closed spine; widen the seam rule and add two checks.

**KEEP:** schema lint (`:42-59`), split `>= 8` / `>= 8` (`:61-71`), ASCII-only byte scan (`:84-91`),
and the dual-write invariant against `evals/d07-chunks/negatives.json` (`:93-134`).

**ADAPT 1 -- BOTH-seam negatives** (`:73-82`): the analog requires only `>= 2` lz-tpp-seam
negatives via one regex:
```javascript
const seamRe = /failing test|make .* pass|minimal transformation|go green|green it|smallest (edit|step)/i;
const seamNegatives = negatives.filter((e) => seamRe.test(e.query));
if (seamNegatives.length < 2) { fail(...); }
```
Add a SECOND regex for the lz-refactor refactor-step seam (RESEARCH suggests
`/clean(ing)? up|de-?duplicat|refactor|restructure|tidy|messy|code smell/i` + a tests-green cue)
and require `>= 2` from EACH seam independently. This is the D-02/D-03.1 both-territories rule.

**ADAPT 2 -- reciprocal dual-write:** add a check that `evals/reciprocal-red.json` exists, is an
array, every entry is `should_trigger:false`, and its `query` strings are byte-consistent with the
`should_trigger:true` positives of `trigger-eval.json` (the reciprocal set is the RED positives
flipped). Mirror the existing dual-write comparison loop (`:117-134`).

**ADAPT 3 -- email-allowlist (repo hygiene, project constraint not in the analog):** assert the only
email-shaped token present in the eval files is the approved public gmail; flag anything else.
Detect by ALLOWLIST-INVERSION -- assert-only-approved, never encode the forbidden value as a needle
(AGENTS.md). The ASCII scan already lives here (`:84-91`); fold the email-allowlist beside it.

---

### `evals/trigger-eval.json` (EVL-01 data, REPLACE CONTENT)

**Analog:** `evals/trigger-eval.json`. Schema is identical: a top-level array of
`{ "query": string, "should_trigger": boolean }`. Replace lz-refactor queries with lz-red queries.

Analog entry shapes to mirror (positive + lz-tpp-seam negative), from the analog:
```json
{"query": "all tests pass, but this 60-line `processOrder()` does five different things ...", "should_trigger": true},
{"query": "red test `expect(of(2)).toBe(1)`, my `of` is `return n <= 1 ? n : 1;`. whats the smallest edit to get it passing? doing tdd", "should_trigger": false}
```
Note the analog's positives are REFACTOR prompts; for lz-red the positives are RED prompts (choose/
structure/name/assert the next failing test) and the negatives must include BOTH the lz-tpp
green-step AND lz-refactor refactor-step seams. Content comes from RESEARCH `## EVL-01 Query
Candidates` (T1..T12 positives, N1..N12 negatives) grounded in `plugins/lz-tdd/skills/lz-red/SKILL.md:3-15`
(the description with its explicit "Do NOT use ... use lz-tpp / lz-refactor" seam clauses). Concrete,
varied register, some with code/typos. ASCII-only (`->`, straight quotes).

---

### `evals/d07-chunks/negatives.json` (spec-runner input, AUTHOR)

**Analog:** `evals/d07-chunks/negatives.json`. Schema: array of `{ "query": string,
"should_trigger": false }` -- the SAME negative queries as `trigger-eval.json`, same order (the
dual-write invariant in `check-evals.mjs:117-134` enforces byte-consistency; the spec runner reads
THIS file at `run-spec-chunks.mjs:36`). Author it as the exact negative slice of the new
trigger-eval.json.

---

### `evals/reciprocal-red.json` (EVL-01 D-03.2, AUTHOR NEW -- schema analog only)

**Analog:** none semantically (no Phase-11 file); schema borrowed from `evals/trigger-eval.json`
(`[{query, should_trigger}]`). See "No Analog Found" below. The RED should-trigger positives from
`trigger-eval.json`, re-tagged `should_trigger:false`, so the harness (pointed at the lz-tpp and
lz-refactor skill-paths) asserts both siblings stay QUIET on RED intent. RESEARCH recommends
reusing the positives VERBATIM (check-evals asserts byte-consistency) so it is provably the exact
RED prompts.

---

### `evals/evals.json` (EVL-02 data, REPLACE CONTENT)

**Analog:** `evals/evals.json`. Schema identical:
```json
{ "skill_name": "lz-red",
  "evals": [ { "id": 0, "prompt": "...code in a RED situation...",
    "expected_output": "...", "files": [], "expectations": ["...", "..."] } ] }
```
Set `skill_name: "lz-red"`; ids 0-based contiguous; `expectations[]` count-aligned 1:1 with
`grade-run.mjs` `RUBRICS[id]`. Analog eval-8 (the routing-boundary trap) is the structural template
for the REQUIRED classify-first scenario (RESEARCH scenario 8), the single scenario most likely to
separate skill from baseline. Analog eval structure to mimic (`evals.json:4-16`):
```json
{ "id": 0, "prompt": "all tests pass. this `processOrder(order)` is about 60 lines ...",
  "expected_output": "Names Extract Function (Fowler) ...; does not edit code or run tests.",
  "files": [], "expectations": [ "Names Extract Function ...", "Names an in-set ...",
    "Routes to the Fowler mechanical layer", "Ties the pick to ...",
    "Does not edit any source file and does not run tests (coach, don't drive)" ] }
```
Content from RESEARCH `## EVL-02 Scenario Candidates` (scenarios 0-9, each grounded in a shipped
lz-red leaf so ground truth is pre-proven). SATURATION WARNING (Phase-11: 41/45 assertions
saturated) -- weight toward the discriminating cases (8 classify-first, 3 over-mock, 6 false-green);
document saturation as an eval-design limitation, do NOT tune it away.

---

### `EVAL-RESULTS.md` (report, COPY STRUCTURE)

**Analog:** `EVAL-RESULTS.md`. Copy the heading/table STRUCTURE and the standing run-config caveat
text (serial / Ponytail-off / MCP-stripped / session-model); leave all numbers blank (filled only
after the gated run). Add the Pass@k / Pass^k tables (k = 1, 3, 5, total) per CLAUDE.md.

---

### `<repo>/.gitignore` (config, EDIT -- add 3 lz-red lines)

**Analog:** `.gitignore:43-45` (the lz-refactor-specific block). The generic `*-workspace/` rules
(`.gitignore:29-36`) drop only `__pycache__/`, `*.pyc`, `outputs/`, `*.stream.jsonl`,
`run_loop_stdout.json`, `trigger-workspace/`, `samples/` -- they do NOT cover the bulky per-run
capture dirs or probe-stdout chunks. Those are hardcoded to lz-refactor:
```
.claude/skills/lz-refactor-workspace/**/results*/
.claude/skills/lz-refactor-workspace/**/run-*/
.claude/skills/lz-refactor-workspace/**/trigger-results-*.json
```
ADD the mirrored lz-red lines (surgical, matches precedent -- Pitfall 8):
```
.claude/skills/lz-red-workspace/**/results*/
.claude/skills/lz-red-workspace/**/run-*/
.claude/skills/lz-red-workspace/**/trigger-results-*.json
```
Prefer additive lz-red lines over generalizing to `*-workspace` (which would newly-ignore
already-tracked lz-tpp `trigger-results-*.json`). This is the one CONTEXT.md phrasing correction:
D-10 says "no per-skill gitignore edits"; RESEARCH Pitfall 8 shows an edit IS required.

## Shared Patterns

### Negation-aware phrase matching (the key borrow for `grade-run.mjs`)
**Source:** `grade-reference.mjs` (a file otherwise NOT copied).
**Apply to:** every RED phrase-set check in the rewritten `grade-run.mjs`.
Lift `occursAffirmed()` (`grade-reference.mjs:141-160`) plus its clause helpers -- `NEG`/`CONTRAST`/
`FWD_BOUNDARY`/`HEDGE`/`CONTRAST_FWD` (`:68-75`), `clauseBefore`/`clauseAfter`/`sentenceAround`/
`hedgedContrastive` (`:77-137`) -- and run every RED phrase through it instead of bare
`regex.test(resp)`:
```javascript
function occursAffirmed(resp, token) {
  const re = nameReAll(token); let m;
  while ((m = re.exec(resp)) !== null) {
    const idx = m.index, end = idx + m[0].length;
    const negated = NEG.test(clauseBefore(resp, idx)) || NEG.test(clauseAfter(resp, end));
    if (!negated && !hedgedContrastive(resp, idx, end)) { return true; }
    if (re.lastIndex === m.index) { re.lastIndex++; }
  }
  return false;
}
```
RED coaching prose is dense with contrastive phrasing ("assert the returned value, NOT the private
field", "this is NOT a false green", "do NOT mock the query"); bare presence would credit the
warned-against phrase (Phase-11 CR-01 grader-leniency class). Also mirror the selfcheck negation
fixtures (`grade-reference.mjs:494-508`) so a negated phrase is provably rejected.

### Path resolution from `import.meta.url` (portability)
**Source:** `run-recall-chunks.mjs:17-20`, `grade-run.mjs:512`, `check-evals.mjs:17-19`.
**Apply to:** every copied/rewritten `.mjs`. Roots resolve from the script's own location
(`path.dirname(fileURLToPath(import.meta.url))`), `\\` normalized to `/`. The ONLY per-skill
re-point is the `SKILL` constant (`"lz-refactor"` -> `"lz-red"`) in the two runners; everything
else is location-relative and needs no edit.

### `--selfcheck` self-test discipline (no external test framework)
**Source:** `grade-run.mjs:417-528`, `merge-judge.mjs --selfcheck`, `check-evals.mjs` (runs as a
lint, exit non-zero on violation).
**Apply to:** `grade-run.mjs` (rewritten), `merge-judge.mjs` (verbatim), `check-evals.mjs`
(adapted). The build-time gate is `node grade-run.mjs --selfcheck && node merge-judge.mjs
--selfcheck && node check-evals.mjs` from the workspace root. All three must be GREEN before the
phase halts. The `grade-run.mjs` selfcheck MUST retain the RUBRICS<->evals.json alignment assertion.

### Fail-closed everywhere
**Source:** `check-evals.mjs:21-24` (`fail()` exits 1 on any violation); `grade-run.mjs:412-415`
(`finalOutPath` refuses final grading.json while judge items remain); `merge-judge.mjs` `--verify`
(exit 1 if any run dir lacks a final grading.json, stopping a scored-only false pass in aggregate).
**Apply to:** all lint/grade/merge scripts. Never a silent pass; malformed/unmerged input errors out.

### Canary-gated chunk runs (throttle-robust measurement)
**Source:** `run-recall-chunks.mjs:52-87`, `run-spec-chunks.mjs:46-74`.
**Apply to:** both runners. A chunk's negatives/positives are trusted ONLY if its appended positive
canary fired (`trigger_rate >= 0.5`), proving a healthy window; resume skips already-valid chunks.
Recall is throttle-sensitive; specificity is throttle-robust (a throttled negative still reads quiet)
but still canary-validated.

### ASCII-only + maintainer-email hygiene on committed eval content
**Source:** `check-evals.mjs:84-91` (ASCII byte scan); project AGENTS.md (allowlist-inversion).
**Apply to:** all authored eval JSON, scripts, and `EVAL-RESULTS.md`. ASCII only (`->`, straight
quotes, no emojis/em-dashes). Email check by allowlist-inversion (assert only the approved public
gmail is present); NEVER write the forbidden work-email or its bare domain, even as a search needle.

### Locked RUN config (baked into the runners, do not deviate)
**Source:** `run-recall-chunks.mjs:109-113` (`execFileSync` args + env).
**Apply to:** every `run_eval` invocation. Serial `--num-workers 1`, `PONYTAIL_DEFAULT_MODE=off`,
MCP stripped + `--setting-sources project` (baked into `run_eval.py`), model `claude-opus-4-8`.
This is the exact config that fixed Phase-5's false 8%-recall artifact; deviating re-opens it.

## Ground-Truth Sources (data files derive content from these; not code to copy)

The eval DATA files are authored FROM the shipped, LOCKED lz-red skill -- these are the "what is
correct" sources, cited so the planner points scenario/query authoring at them:
- `plugins/lz-tdd/skills/lz-red/SKILL.md:3-15` -- the `description` (EVL-01 should/should-not ground truth, incl. the lz-tpp + lz-refactor seam clauses).
- `plugins/lz-tdd/skills/lz-red/SKILL.md:52-125` -- the 6-step coach decision procedure + coach-by-default clause (EVL-02 / D-05-RUBRIC dimensions); `:96-117` `applyDiscount` = the canonical fail-for-the-right-reason shape.
- `plugins/lz-tdd/skills/lz-red/references/` -- `three-laws-and-test-selection.md` (selection), `test-structure-and-assertions.md` (AAA/GWT, four pillars), `naming.md`, `testing-stance/{functional-core,message-matrix,seams-and-legacy}.md` (per-stance assertion styles), `vitest-typescript-mechanics.md` (fail-for-the-right-reason), `anti-patterns.md` (false-green, over-mock).
- `plugins/lz-tdd/skills/lz-tpp/SKILL.md` + `plugins/lz-tdd/skills/lz-refactor/SKILL.md` -- sibling descriptions (near-miss + reciprocal-spot-check ground truth, D-03).

## No Analog Found

Only one file has no direct Phase-11 semantic analog (it borrows the trigger-eval.json schema).
The planner authors it from the trigger-eval.json positives; no RESEARCH.md fallback needed.

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `evals/reciprocal-red.json` | test-data (EVL-01 D-03.2) | data | Genuinely new coverage: no Phase-5/11 phase ran the RED positives against the sibling skill-paths. Schema is `evals/trigger-eval.json` (`[{query, should_trigger}]`); author as the trigger-eval positives re-tagged `should_trigger:false`, byte-consistency enforced by the adapted `check-evals.mjs`. |

## Metadata

**Analog search scope:** `.claude/skills/lz-refactor-workspace/` (Phase-11 rig, primary),
`.claude/skills/lz-red-workspace/` (existing Phase-16 additive target), root `.gitignore`.
Analogs located via Glob + Read (git grep blind under `*-workspace/`, Pitfall 7).
**Files read for excerpts:** `grade-run.mjs`, `grade-reference.mjs`, `check-evals.mjs`,
`run-recall-chunks.mjs`, `run-spec-chunks.mjs`, `merge-judge.mjs` (header), `eval-status.mjs`
(header), `tools/skill-creator-eval/README.md`, `evals/trigger-eval.json`, `evals/evals.json`,
`evals/d07-chunks/negatives.json`, root `.gitignore`.
**Pattern extraction date:** 2026-07-21
