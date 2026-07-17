# Phase 12: Autonomous multi-round refactoring for whole-package sweeps - Pattern Map

**Mapped:** 2026-07-11
**Files analyzed:** 5 edit surfaces (1 skill MODIFY, 2 eval-set MODIFY, 2 e2e ADD-into-suite)
**Analogs found:** 5 / 5 (all in-repo; every surface has a same-file or sibling analog)

Phase 12 is a small-surface, MODIFY-heavy phase. There is no "new-component from a
distant template" work: every edit either extends a file's own committed form
(SKILL.md, the eval JSON arrays) or clones an existing sibling entry (the e2e
command prompt + its targets.json / suite.json rows). The closest analog is
therefore almost always the file itself or its immediate neighbor, not a
cross-cutting archetype.

## File Classification

| Edit surface | Role | Data flow | Closest analog | Match quality |
|--------------|------|-----------|----------------|---------------|
| `plugins/lz-tdd/skills/lz-refactor/SKILL.md` (description frontmatter, lines 3-17) | config / skill-metadata | request-response (trigger routing) | its own committed form (8acd2b8), lines 3-17 | self (exact) |
| `plugins/lz-tdd/skills/lz-refactor/SKILL.md` ("Coach by default; drive when asked", lines 75-82) | instruction prose | event-driven (drive loop) | its own committed paragraph, lines 75-82 + decision steps 1/4/5 (lines 45-70) | self (exact) |
| `.claude/skills/lz-refactor-workspace/evals/trigger-eval.json` (+3 positives, +3 negatives) | test / eval fixture | batch / transform | existing positive/negative entries in the same array | self (exact) |
| `.claude/skills/lz-refactor-workspace/evals/d07-chunks/negatives.json` (+3 negatives, dual-write) | test / eval fixture | batch / transform | existing negatives + the byte-identical negatives in trigger-eval.json | self (exact) |
| `e2e-nx/prompts/<new sweep-cmd>.md` + `e2e-nx/targets.json` row + `e2e-nx/suite.json` row | test fixture (e2e scenario) | request-response (apply run) | `e2e-nx/prompts/p2cmd-validate-entry-command.md` + targets `T3`/`T4` + suite `p2cmd` row | sibling (exact role) |
| `e2e-gilded-rose/prompts/<new sweep-cmd>.md` + `e2e-gilded-rose/targets.json` row + `e2e-gilded-rose/suite.json` row | test fixture (e2e scenario) | request-response (apply run) | `e2e-gilded-rose/prompts/gr1cmd-update-quality-command.md` + target `G1` + suite `gr1cmd` row | sibling (exact role) |

## Pattern Assignments

### `plugins/lz-tdd/skills/lz-refactor/SKILL.md` - description frontmatter (config, request-response)

**Analog:** its own committed form (8acd2b8), lines 3-17. EXTEND, do not rewrite (D-01/D-02).

**Current description block** (lines 3-17) - the surface to broaden with the sweep intent category:
```yaml
description: >-
  This skill should be used for the refactor step of red-green-refactor TDD: improving the
  STRUCTURE or READABILITY of existing, working code WITHOUT changing its behavior. Use it whenever
  a developer wants to clean up, tidy, simplify, restructure, or de-duplicate code whose tests
  already pass, or make such code more readable; says a function, class, or module is hard to read,
  ...
  refactor. It recommends the next named Fowler or Kerievsky refactoring and, when the developer
  asks you to apply it, performs it in small behavior-preserving steps; ...
  Do NOT use it to
  make a failing or red test pass or otherwise ADD or CHANGE behavior -- that is the
  green/transformation step; use lz-tpp instead -- nor for writing new code, adding a feature, or
  writing a function from scratch.
```

**Pattern to copy (in-place conventions this block already establishes):**
- Third-person, action- and trigger-oriented voice ("This skill should be used for...", "Use it whenever...").
- Scope units are currently singular ("a function, class, or module") - the Gap-1 broadening adds the plural/package scope unit (across a package / module / directory / codebase) as the SAME intent applied at scope, per D-02.
- The exclude-and-reroute tail ("Do NOT use it to make a failing or red test pass ... use lz-tpp instead ... nor for writing new code, adding a feature") is where the 3 sweep-shaped exclusions belong: keep them BEFORE the 1536-char listing truncation (D-04). Do not add a literal "not for performance" clause (overfit, Open Question 1) - let the perf-sweep negative carry it.
- Char budget: current block is load-bearing ~1245 chars; stay in the ~1000-1500 window (D-04, [[skill-description-char-cap]]). ASCII-only.

### `plugins/lz-tdd/skills/lz-refactor/SKILL.md` - "Coach by default; drive when asked" (instruction prose, event-driven drive loop)

**Analog:** its own committed paragraph, lines 75-82. Add ONE sweep-drive sentence-cluster (D-05, discretion); do NOT restate the pause conditions - they already live in decision steps 1/4/5.

**Current paragraph** (lines 75-82) - the COMMAND branch is where the sweep sub-branch attaches:
```
Coach by default; drive when asked. When the request is a QUESTION or asks for advice (what would you
do here, anything you'd refactor, how would you make this more readable), present the named refactoring
and the smallest next step and let the developer apply it -- do not edit their code or run tests unasked,
because unrequested changes to working code are unwelcome. When the request is an explicit COMMAND to do
it (refactor this for me, apply it, go ahead and make the change, do it), perform the refactoring yourself
in small behavior-preserving steps, running the tests after each; then stop and leave the changes for the
developer to review -- do not commit unless they ask. Refusing to edit when you were plainly asked to
apply is the failure to avoid, not caution.
```

**Pattern to copy (structure the added cluster must preserve):**
- The QUESTION vs COMMAND axis is the PRIMARY gate and stays first (D-09). The single-target COMMAND clause "perform ... in small behavior-preserving steps, running the tests after each; then stop" is UNCHANGED - the sweep cluster branches on SCOPE inside the command arm only, it does not replace the single-target "then stop".
- Same imperative second-person voice, same "small behavior-preserving steps, running the tests after each" phrasing to reuse verbatim so the loop reads as the existing arm iterated, not a new mode.
- The added cluster's shape (loop-to-fixpoint) is modeled on the Anthropic loop-engineering SKILL.md template quoted in RESEARCH.md (Code Examples): explicit "do not stop after one" + "run the tests each round" + "keep going until a scan pass finds nothing left (or the round/diff/file ceiling)" + "pause and surface on [D-07 list]" + "leave changes uncommitted with a summary for review; never commit unless asked" (D-05/D-06).

**Pause boundaries already map onto the decision procedure - reference, do not duplicate** (lines 45-70):
```
1. Classify the request against the lz-tpp seam (CCH-05). If a red / failing test must be made to
   pass, that is the green step. Hand off to lz-tpp and stop. ...          <- D-07.1 (seam route)
4. Apply the over/under-engineering balance (CCH-02, CCH-06). ... an unwarranted pattern is
   refactored AWAY ... Clarity is the default.                            <- D-07.4 (speculative
                                                                              introduction; de-pattern
                                                                              AWAY stays autonomous)
5. Preserve behavior (CCH-03). ... running the tests after each ... If the target code has NO tests,
   route to references/refactoring-without-tests.md (Feathers) ...        <- D-07.2/.3 (red revert;
                                                                              untested -> Feathers advise)
```
The sweep cluster references these step numbers for the pause list rather than restating them (D-05 discretion; keep SKILL.md < 500 lines - currently 125).

**Constraint:** both edits are triggering-critical AND agent-instruction changes -> MUST be subagent-reviewed incl. >=1 unbiased reviewer before acceptance (D-17, [[agent-skill-instruction-changes-need-review]], [[unbiased-review-beats-primed]]). After commit, the skill is NOT live until the USER runs `/reload-plugins` (D-18, [[reload-plugins-after-oracle-agent-changes]]).

---

### `.claude/skills/lz-refactor-workspace/evals/trigger-eval.json` - add 3 sweep positives + 3 sweep negatives (eval fixture, batch)

**Analog:** the existing entries in the same array (positives lines 2-14, negatives lines 16-26).

**Entry shape to copy** (flat array of `{query, should_trigger}`; positives first, then negatives):
```json
{"query": "green bar. i've got the same date-formatting block copy-pasted across three services - which named refactoring cleans up that duplication?", "should_trigger": true},
...
{"query": "refactor this to be faster - it's O(n^2) and i need it under 50ms", "should_trigger": false},
{"query": "add pagination to the GET /users endpoint in this express app", "should_trigger": false},
```

**Pattern to copy:**
- Natural, lowercase, first-person developer voice with a green-state cue ("all tests pass", "green bar", "tests are green"). The 13 current positives are all SINGLE-target; the 3 new positives introduce the PACKAGE/DIRECTORY/CODEBASE scope unit (D-02). Address the category, NOT the e2e phrasing (Pitfall 1 / anti-overfit).
- The two package-scoped positives already in the set (lines 13-14, the `runtime-lint-utils.ts` and `updateQuality` queries) are the nearest positives but are still single-symbol - the new sweep positives name a package/dir, not one symbol.
- The 3 new negatives guard three boundaries (D-03/D-12): a feature-adding sweep (analog: line 22 "add pagination..."), a performance sweep (analog: line 19 "refactor this to be faster..."), a red-test sweep (analog: lines 16-18, the failing-test negatives).
- **Seam-lint constraint:** the red-test sweep negative MUST match `check-evals.mjs`'s seam regex `/failing test|make .* pass|minimal transformation|go green|green it|smallest (edit|step)/i` (check-evals.mjs lines 71-72) so the `>= 2 seam negatives` gate stays satisfied (D-12). ASCII-only (gate 4).

### `.claude/skills/lz-refactor-workspace/evals/d07-chunks/negatives.json` - dual-write the same 3 negatives (eval fixture, batch)

**Analog:** the byte-identical negatives that will be added to trigger-eval.json. This file uses the SAME `{query, should_trigger}` shape but pretty-printed one field per line (lines 2-5 show the object form):
```json
{
  "query": "red test `expect(of(2)).toBe(1)`, my `of` is `return n <= 1 ? n : 1;`. whats the smallest edit to get it passing? doing tdd",
  "should_trigger": false
},
```

**Pattern to copy (the dual-write trap, Pitfall 2):** `run-spec-chunks.mjs` measures specificity from THIS file, while `check-evals.mjs` lints `trigger-eval.json`. Every new negative must be written to BOTH files with byte-consistent `query` strings (D-12). This file's negatives list is currently IDENTICAL (same 11 queries) to trigger-eval.json's negatives - keep that invariant. (Optional Wave-0 lint: assert the two negative lists are byte-consistent - RESEARCH Wave 0 Gaps; ponytail says skip unless the manual diff proves error-prone.)

---

### `e2e-nx/prompts/<new sweep-cmd>.md` (+ targets.json row + suite.json row) - e2e scenario (test fixture, request-response)

**Analog:** `e2e-nx/prompts/p2cmd-validate-entry-command.md` (the existing command-mode prompt) + targets `T3`/`T4` + the `p2cmd` suite row.

**Prompt shape to copy** (`p2cmd-validate-entry-command.md`, verbatim - the imperative COMMAND framing that drives apply mode):
```
`validateEntry` in `packages/eslint-plugin/src/rules/nx-plugin-checks.ts` is hard to follow. The
tests are green -- please refactor it now to read more clearly, then run the eslint-plugin suite.
```
The new sweep-command prompt keeps the COMMAND voice ("please refactor it now ... then run the suite") but broadens the SCOPE from one symbol to the whole file/module: sweep `packages/eslint-plugin/src/utils/runtime-lint-utils.ts` (targets `T3` loop->pipeline + `T4` groupImports reduce->Map = 2+ safe rounds, D-13).

**targets.json row shape to copy** (`T3`/`T4`, lines 27-46) - reuse the existing multi-round-safe targets rather than inventing:
```json
{
  "id": "T3",
  "file": "packages/eslint-plugin/src/utils/runtime-lint-utils.ts",
  "symbol": "findTransitiveExternalDependencies(...)",
  "smells": ["Loops (imperative index accumulation)"],
  "expected_family": "Functional idiom (filter / flatMap) ... Replace Loop with Pipeline.",
  "judgment": "...",
  "axis": "functional / FP"
}
```
The new sweep target adds N safe items PLUS exactly ONE should-pause TRAP = an exported-signature change (public-API break, D-13; this is the D-07.6 blast-radius-escapes-scope boundary and the Pitfall 8 monorepo case). The seeded trap is what makes posture A/B/C read deterministically.

**suite.json row shape to copy** (`e2e-nx/suite.json` lines 8-14):
```json
{ "id": "p2cmd", "file": "p2cmd-validate-entry-command.md", "target": "T2", "code": true }
```
Add one row `{ "id": "<sweep-cmd id>", "file": "<new>.md", "target": "<sweep target>", "code": true }`. Keep `skillCommand`, `applyBase`, `protectedBranches` untouched (lines 2-6).

### `e2e-gilded-rose/prompts/<new sweep-cmd>.md` (+ targets.json row + suite.json row) - e2e scenario (test fixture, request-response)

**Analog:** `e2e-gilded-rose/prompts/gr1cmd-update-quality-command.md` + target `G1` + the `gr1cmd` suite row.

**Prompt shape to copy** (`gr1cmd-update-quality-command.md`, verbatim):
```
`updateQuality` in `app/gilded-rose.ts` is hard to maintain. The tests are green -- please refactor
it now to make it easier to work with, then run the tests.
```
The new kata sweep-command prompt sweeps `updateQuality` end-to-end (guard clauses -> per-branch updater -> name magic numbers = 3+ safe rounds, D-13). Seed the ONE trap = a behavior change (Conjured handling / Sulfuras degradation) the golden master does NOT cover - a should-pause that reads as posture C if driven through.

**targets.json row shape to copy** (`G1`, lines 7-21): reuse `G1`'s `file`/`symbol`/`smells`/`expected_family`/`judgment`/`axis` structure; the sweep scenario may reference `G1` directly or add a `G1sweep`-style row that carries the seeded behavior-change trap in its `judgment`.

**suite.json row shape to copy** (`e2e-gilded-rose/suite.json` lines 8-11):
```json
{ "id": "gr1cmd", "file": "gr1cmd-update-quality-command.md", "target": "G1", "code": true }
```

## Shared Patterns

### Green-state + intent voice (all trigger + e2e fixtures)
**Source:** `trigger-eval.json` positives (lines 2-14) and both `*cmd*.md` prompts.
**Apply to:** every new positive and every new sweep-command prompt.
Every refactor-step fixture states the tests are GREEN ("tests are green", "green bar", "all tests pass") and frames intent as improve-existing-working-code. Question form -> advise; imperative "please refactor it now, then run the tests" -> drive. The sweep positives/prompts keep this voice and only broaden the scope unit.

### Exclude-and-reroute negatives (specificity guard)
**Source:** `trigger-eval.json` negatives (lines 16-26) + `check-evals.mjs` seam regex (lines 71-72).
**Apply to:** every new sweep negative in BOTH negative files.
The specificity guarantee lives in the eval set, not the prose (D-03, Pitfall 6). Each new positive is paired with a sweep-shaped hard negative on the neighboring category (feature / performance / red-test). The red-test negative must satisfy the seam regex.

### Dual-write invariant (eval negatives)
**Source:** `trigger-eval.json` negatives vs `d07-chunks/negatives.json` (currently byte-identical, 11 queries each).
**Apply to:** every negative edit.
Two files, one logical set. `check-evals.mjs` lints one; `run-spec-chunks.mjs` measures the other. Byte-consistent writes to both (D-12, Pitfall 2).

### e2e scenario = prompt + targets row + suite row (three coupled edits)
**Source:** the `p2cmd` / `gr1cmd` triplets across `prompts/`, `targets.json`, `suite.json`.
**Apply to:** each new e2e sweep scenario.
A scenario is never a lone prompt file: it needs a `targets.json` entry (the code target + graded expectation, incl. the seeded trap) and a `suite.json` `prompts[]` row (`{id, file, target, code}`) or `run-e2e.mjs` will not discover it.

### ASCII-only + public-repo hygiene (all committed edits)
**Source:** `AGENTS.md` / `CLAUDE.md`; `check-evals.mjs` gate 4 (lines 82-88).
**Apply to:** SKILL.md, both eval JSONs, both prompt files.
`->` not the arrow glyph, straight quotes, no em-dashes/emojis. Only the approved public gmail may appear (allowlist-inversion); the maintainer work email/domain never committed. The SKILL.md edits ship in `plugins/`, so they re-open the ship surface and re-run the hygiene gate (`npm run check` -> `tools/check-hygiene.mjs`).

## Read-Only Integration Points (NOT modified - the plan must respect them)

No new harness code this phase (D-05/D-12). These files are consumed as-is; the plan
must honor their contracts, not edit them.

| File | Contract the plan must respect |
|------|--------------------------------|
| `check-evals.mjs` | Lint gates: >=8 positives, >=8 negatives, >=2 seam negatives (regex lines 71-72), ASCII-only. Must stay green after eval edits. Local, free, no `claude -p`. |
| `run-recall-chunks.mjs` | Reads positives from `trigger-eval.json`; canary-gated; CHUNK_SIZE 3; `--runs-per-query 3 --num-workers 1 --model claude-opus-4-8`, `PONYTAIL_DEFAULT_MODE=off`. DELETE stale `trigger-results-d07-recall-chunk-*.json` + `evals/d07-chunks/recall-chunk-*.json` before re-run (chunk boundaries shift, Pitfall 3). |
| `run-spec-chunks.mjs` | Reads negatives from `d07-chunks/negatives.json` (NOT trigger-eval.json) - the dual-write reason; CHUNK_SIZE 4; same run config; DELETE stale spec chunk caches before re-run. |
| `e2e-nx/run-e2e.mjs`, `e2e-gilded-rose/run-e2e.mjs` | `--mode recommend|apply`, `--arm with_skill|no_skill|invoke_skill`, `--report` (Pass@1/@3/^3). apply mode refuses protected branches and resets to `applyBase` between k runs. Pass@k uses `used_refactor||used_tpp`, which UNDERCOUNTS invoke_skill in apply sessions (D-14, Pitfall 4) - grade posture from transcript + `diff.patch` + `meta.json`, not `used_refactor`. |

## No Analog Found

None. Every edit surface has an in-repo analog (its own committed form or an
immediate sibling entry). No file needs to fall back to RESEARCH.md-only patterns.

## Metadata

**Analog search scope:** `plugins/lz-tdd/skills/lz-refactor/` (shipped skill),
`.claude/skills/lz-refactor-workspace/evals/`, `.claude/skills/lz-refactor-workspace/e2e-nx/`,
`.claude/skills/lz-refactor-workspace/e2e-gilded-rose/`, `check-evals.mjs`.
**Search note:** the workspace is gitignored, so `rg`/Read (not `git grep`) reached
those files.
**Files scanned:** SKILL.md, trigger-eval.json, d07-chunks/negatives.json,
e2e-nx {suite,targets}.json + p2cmd prompt, e2e-gilded-rose {suite,targets}.json + gr1cmd prompt,
check-evals.mjs.
**Pattern extraction date:** 2026-07-11
