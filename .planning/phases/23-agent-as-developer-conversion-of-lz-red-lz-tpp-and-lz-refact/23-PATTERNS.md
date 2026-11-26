# Phase 23: Agent-as-developer conversion of lz-red, lz-tpp and lz-refactor - Pattern Map

**Mapped:** 2026-11-26
**Files analyzed:** 19 new or modified files (grouped below)
**Analogs found:** 17 / 19

All analog paths below are git-tracked source (checked with `git ls-files`). Line numbers are from HEAD `7aa4821`;
re-read before editing, because the conversion plans shift them.

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `plugins/lz-tdd/skills/lz-tpp/SKILL.md` (modify) | skill body | request-response (edit + run + report line) | itself: step 8 lines 111-113, `## Two modes` lines 25-35 | exact (in-place) |
| `plugins/lz-tdd/skills/lz-red/SKILL.md` (modify) | skill body | request-response | itself: COMMAND paragraph lines 169-175, `## Two modes` lines 29-42, step text line 124 | exact (in-place) |
| `plugins/lz-tdd/skills/lz-refactor/SKILL.md` (modify) | skill body | request-response | itself: `## QUESTION vs COMMAND intent routing` lines 162-171, step 4 lines 119-121, step 5 lines 123-155, step 6 lines 156-160 | exact (in-place) |
| `plugins/lz-tdd/skills/lz-tdd-coach/SKILL.md` (NEW) | skill body | request-response (explain only, no edits) | `plugins/lz-tdd/skills/lz-tpp/SKILL.md` (frontmatter, reference-mode bullet, `## Reference material`) | role-match |
| `tools/evals/check-skills.ts` (NEW) | static check (lint) | batch / transform (read Markdown + graders, report problems) | `tools/evals/check-cases.ts` | exact |
| `tools/evals/check-skills.test.ts` (NEW) | test | batch | `tools/evals/check-cases.test.ts` | exact |
| `tools/evals/package.json` (modify `check` script) | config | -- | itself, `scripts.check` | exact |
| `.claude/skills/lz-red-workspace/tools/lib/routing-parse.mjs` (selector edit) | check library | transform | itself, `ROUTING_SURFACES` lines 67-135 (`heading: "Coach decision procedure"` at 72, 99, 126) | exact |
| `.claude/skills/lz-red-workspace/tools/check-rgr-routing.mjs` (selector edit) | gate | batch | itself, lines 201-203 constants, 530-532 bullet split, 849-870 anchor check, ~1035 sweep | exact |
| `.claude/skills/lz-red-workspace/tools/check-rgr-routing.selftest.mjs` (fixture strings) | test | batch | itself, lines 84-127, 365, 481-571 | exact |
| `.claude/skills/lz-red-workspace/tools/check-rgr-routing.evasions.mjs` (re-anchor / retire) | adversarial test | batch | itself; `EXPECTED_OPEN` ratchet | exact |
| `.claude/skills/lz-red-workspace/variants/build-variants.mjs` (re-anchor `from` runs) | build script | file-I/O | itself, `C_POINTER` line 129, banned text at 147/155, `replaceRun` at 230-233 | exact |
| Variant single-axis + staleness check (NEW, `.ts` + `.test.ts`) | static check | file-I/O (hash, compare) | `.claude/skills/lz-refactor-workspace/tools/check-no-new-js.ts` + `.test.ts` (workspace TS check shape); hashing idea from `build-variants.mjs` source-hash assert | role-match |
| `.claude/skills/lz-refactor-workspace/tools/check-hygiene.mjs` (add coach tree) | gate | batch | itself, target constants lines 22-55 (`LZ_RED_SKILL_DIR` block is the model) | exact |
| `.claude/skills/lz-red-workspace/package.json` / `lz-refactor-workspace/package.json` (`check` script) | config | -- | themselves | exact |
| `plugins/lz-tdd/.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json` (description) | config | -- | themselves | exact |
| `README.md`, `plugins/lz-tdd/README.md` (docs) | docs | -- | `README.md` lines 5-8, 41-44 | exact |
| `.planning/PROJECT.md` (line 89, core value), `.planning/REQUIREMENTS.md` (out-of-scope row ~193, AGD ids) | planning docs | -- | themselves | exact |
| lz-refactor smell leaves linking the seven unreachable catalog leaves (D-11) | reference | -- | todo file names the seven; existing smell-leaf link form | no analog read (see below) |
| Optional new eval suites (`trigger-lz-tdd-coach`, slim loop case) | eval case | -- | `evals/lz-tdd/doing-lz-red/doing-lz-red-08/` (prompt.md + graders/*.md) | not read here (see below) |

## Pattern Assignments

### Converted skills: the doing paragraph (lz-tpp, lz-red, lz-refactor)

**Analog:** each skill's own COMMAND sentence (CONTEXT code_context: "the conversion makes it the default rather than
writing new procedure text").

lz-red COMMAND half to promote (`plugins/lz-tdd/skills/lz-red/SKILL.md` lines 172-175):
```markdown
When the request is an explicit COMMAND to write the test (write the failing test for me, add the red
test), write the failing test and then stop; making it pass is the green step (lz-tpp), so do not
drive it to green. Refusing to write the test when you were plainly asked to is the failure to avoid,
not caution.
```
Delete the QUESTION half (lines 169-171, "Coach by default; hand off, do not drive ... do not edit their tests or run the
suite unasked") and the step-5 clause at line 124 ("Explain which failure is the right one and why; do not run the suite
unprompted.") -- replace with "run the new test alone and confirm the failure reason" (D-04).

lz-refactor COMMAND half to promote (`lz-refactor/SKILL.md` lines 167-171):
```markdown
When the request is an explicit COMMAND to do
it (refactor this for me, apply it, go ahead and make the change, do it), perform the refactoring yourself
in small behavior-preserving steps, running the tests after each; then stop and leave the changes for the
developer to review -- do not commit unless they ask.
```
Also convert: step 4 pointer (lines 119-121, "gated on intent -- see \"QUESTION vs COMMAND intent routing\" below -- so do
not edit working code on a question"), step 5 opener (line 123, "Advise -- or perform, when the developer asks you to
apply it --"), step 5 tail (lines 152-155, "on a COMMAND ... on a QUESTION, present them ... and do not edit"), step 6
"Reference mode." (lines 156-160 -> moves to lz-tdd-coach). Keep the guards at lines 128-133 (public-API pause,
characterization tests first, commit only when asked).

lz-tpp: replace step 8 (lines 111-113):
```markdown
8. Show, don't drive. Present the minimal diff and the named transformation; let the developer
   apply it and run the tests. Never edit the developer's code or run the tests
   unless explicitly asked -- coach, don't drive.
```
with "apply the change, run the new test then the module's tests, end with the GREEN line". lz-tpp step 2 (lines 90-95,
"ASSUME the phase is sound") stays; it is already the D-02-compatible precondition form.

**Placement (R13):** the doing paragraph goes near the top of each body, beside `## Two modes`.

### Converted skills: `## Two modes` gate (keep heading, D-07 / C2)

**Analog:** `lz-tpp/SKILL.md` lines 25-35 (shortest of the three):
```markdown
- Coach mode: the request asks for a move on code -- most often which minimal change makes a failing
  test pass, the green step. Run the coach decision procedure below; step 1 classifies the ask. ...
  coach versus reference only: it never decides ownership and never declines a request itself.
- Reference mode: otherwise -- the request is "explain TPP", "why this order", "what does (X) mean",
  or an explicit `/lz-tdd:lz-tpp` invocation with nothing to coach. Explain the transformations and
  their ordering rationale FROM references/transformations.md; do not restate the list here.
```
Rewrite as two bullets: a doing bullet (keeps every corpus token of the skill's own cases and the delegation phrase
`step 1 classifies the ask`) and an explain bullet handing explain requests to `lz-tdd-coach`. Corpus tokens per owner
(RESEARCH Pitfall 4): lz-red `what test`, `write next`, `good test`, `add a new behavior`, `what test comes next`;
lz-tpp `failing test pass`; lz-refactor `finished`, `test pass`, `what now`, `test file`, `tidy`, `clean up`, `no tests`.

### Converted skills: report line (D-05)

**Analog for the grader the line must pass:** `tools/evals/grade.ts` lines 110-118 -- regex, empty flags, tested on
`evidence.lastMessage` only, so the line must be the last line of the reply:
```typescript
function passes(def: GraderDef, evidence: Evidence): boolean {
  if (def.type === 'regex') {
    return new RegExp(def.pattern ?? '', def.flags).test(evidence.lastMessage);
  }
```
State each format once as a code span plus one canonical example (R11). Verified grader patterns are in RESEARCH
Pattern 2; the transformation name form comes from `lz-tpp/references/transformations.md` lines 68 and 70
(`4. \`(constant -> scalar)\``, `6. \`(unconditional -> if)\``).

### Converted skills: H1 and procedure heading renames (D-07)

Current headings (rg over the three files):
- `lz-red/SKILL.md:21` `# lz-red: RED-phase TDD coach`
- `lz-tpp/SKILL.md:19` `# lz-tpp: Transformation Priority Premise coach`
- `lz-refactor/SKILL.md:22` `# lz-refactor: Refactoring coach (Fowler + Kerievsky)`
- `## Coach decision procedure` at `lz-red:67`, `lz-tpp:65`, `lz-refactor:64` -> `## Decision procedure`
- `lz-refactor/SKILL.md:162` `## QUESTION vs COMMAND intent routing` -> the doing section's heading
- `lz-refactor/SKILL.md:197` `## Smell taxonomy (coach trigger table)` also says coach

All three heading renames and every selector land in one commit (Pitfall 6).

---

### `plugins/lz-tdd/skills/lz-tdd-coach/SKILL.md` (NEW, skill, explain-only)

**Analog:** `plugins/lz-tdd/skills/lz-tpp/SKILL.md`

**Frontmatter shape** (lines 1-17): `name:` equal to the directory name, `description: >-` folded block, "This skill
should be used ..." voice (R17), exclusions naming the sibling skills ("Do not use it to ... use lz-red instead").
Copy the shape; content per RESEARCH Pattern 5 skeleton. Move into it the explain triggers lz-tpp loses (lines 8-10:
"the transformation priority list, the next transformation, or asks what a transformation such as (constant -> scalar)
or ({} -> nil) means or why the ordering is what it is").

**Body content to move in (from the three skills):**
- lz-tpp reference bullet, lines 33-35; `## TPP is a heuristic, not a law`, lines 115-120 (drop "the author himself").
- lz-red reference bullet, lines 39-42.
- lz-refactor step 6 router, lines 156-160.

**Reference list pattern:** lz-red `## Reference material` lines 177-200, but every link rewritten to the plugin-root
form lz-red already uses for the shared reference (line 191):
```markdown
reference, shared with lz-refactor): `${CLAUDE_PLUGIN_ROOT}/references/beck-tdd-by-example.md`
```
i.e. `${CLAUDE_PLUGIN_ROOT}/skills/lz-tpp/references/transformations.md`. Reference files do not move (leaf-read graders
match their paths).

**Name-free (D-16):** strip the names visible in the moved text: "Robert C. Martin's" (lz-tpp:21), "(Bernhardt)",
"(Metz + Owen)", "(Feathers)" (lz-red:194-199), "(Fowler + Kerievsky)", "Fowler Ch.2" in headings. Named patterns,
refactorings and techniques stay.

---

### `tools/evals/check-skills.ts` (NEW, static check, batch)

**Analog:** `tools/evals/check-cases.ts`

**Header comment pattern** (lines 1-6): purpose, "Repository-only; nothing here ships with the plugin.", then the usage
line `node tools/evals/check-skills.ts  prints one line per problem and exits 1, or the OK line and exits 0`.

**Imports pattern** (lines 7-11):
```typescript
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { evalRepo, evalsRoots, readCaseYaml, readFrontmatter, readSuite, type Suite } from './cases.ts';
import { gradeRun, readGraders, type Evidence, type GraderDef } from './grade.ts';
import { isRecord, readJson } from './guards.ts';
```
Use `readGraders(caseDir)` (`grade.ts` lines 92-101) and `gradeRun(defs, { calls: [], lastMessage })` to test each
fenced example report line in a SKILL.md against the committed grader (e.g.
`evals/lz-tdd/doing-lz-red/doing-lz-red-08`, `doing-lz-tpp-01`, `doing-lz-refactor-00`,
`evals/lz-tdd-apply/apply-lz-tpp/apply-lz-tpp-conjured`). `readFrontmatter` from `cases.ts` reads skill frontmatter
(description length at most 1536, `name` present for lz-tdd-coach). Do not copy the four regexes into the check.

**Core pattern:** an exported pure function returning a report with `problems: readonly string[]` plus counts (the
`LintReport` interface, `check-cases.ts` lines ~48-54), so the test calls it in-process on a temp tree.

**Entry-point pattern** (tail of `check-cases.ts`), copy verbatim with names changed:
```typescript
// Stryker disable all: command-line entry; check-cases.test.ts calls lintCases in-process
// Below Node.js 22.18.0 import.meta.main is undefined, which would skip the lint and exit 0.
if (typeof import.meta.main !== 'boolean') {
  throw new Error('check-cases.ts needs Node.js >= 22.18.0 (import.meta.main)');
}

if (import.meta.main) {
  const report = lintCases(evalRepo(process.env));

  if (report.problems.length > 0) {
    for (const problem of report.problems) {
      console.log(problem);
    }

    process.exitCode = 1;
  } else {
    console.log(`check-cases: OK - ...`);
  }
}
// Stryker restore all
```

**Email allowlist pattern** (if the check also covers lz-tdd-coach hygiene instead of `check-hygiene.mjs`, Pitfall 9),
`check-cases.ts` lines ~36-37:
```typescript
const publicContact = 'larsbrinknielsen@gmail.com';
const emailShaped = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+[.][A-Za-z]{2,}/g;
```

**Banned-phrase list** (verified quotes, RESEARCH Code Examples): `coach, don't drive`, `Show, don't drive`,
`do not run the suite unprompted`, `QUESTION vs COMMAND`, `Reference mode:`. Assert RED at HEAD first.

### `tools/evals/check-skills.test.ts` (NEW, test)

**Analog:** `tools/evals/check-cases.test.ts` lines 1-40:
```typescript
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, test } from 'node:test';

const root = mkdtempSync(join(tmpdir(), 'lz-evals-check-cases-')).replaceAll('\\', '/');

after(() => rmSync(root, { recursive: true, force: true }));

function put(path: string, text: string): void {
  mkdirSync(join(path, '..'), { recursive: true });
  writeFileSync(path, text);
}

function graderFile(path: string, lines: readonly string[]): void {
  put(path, ['---', ...lines, '---', '', 'What this grader checks.', ''].join('\n'));
}
```
Build a temp tree with a SKILL.md and a grader file, assert one problem per defect and zero on the clean tree.

### `tools/evals/package.json` (modify)

Append `check-skills.test.ts` to the `node --test ...` list and `&& node check-skills.ts` after `node check-cases.ts` in
`scripts.check` (current value has `tsc -p tsconfig.json && node --test eval.test.ts ... port-cases.test.ts && node
check-cases.ts`).

---

### `routing-parse.mjs` / `check-rgr-routing.mjs` / selftest / evasions (selector edits, D-07)

**Analog:** themselves. The exact strings to change in one commit:

`.claude/skills/lz-red-workspace/tools/lib/routing-parse.mjs` lines 72, 99, 126:
```javascript
      heading: "Coach decision procedure",
```
`.claude/skills/lz-red-workspace/tools/check-rgr-routing.mjs` lines 201-203:
```javascript
const ANCHOR_HEADING = "QUESTION vs COMMAND intent routing";
const SWEEP_HEADING = "Whole-package / directory sweeps";
const PROCEDURE_HEADING = "Coach decision procedure";
```
lines 530-532 (bullet labels, update with the new `## Two modes` labels):
```javascript
  const coachRaw = body.split(/^-\s+Reference mode:/m)[0] ?? "";
  const coach = flatten(coachRaw.replace(/^-\s+Coach mode:/m, ""));
```
lines 865-870: the printed check name `"[cls-03] QUESTION/COMMAND anchor resolves"` and the reason text "the coach
procedure's prose pointer" -- relabel with the constant. Also the contradiction sweep's
`sectionBody(text, "Coach decision procedure")` near line 1035.

Selftest fixture strings: `check-rgr-routing.selftest.mjs` lines 84-127, 365, 481-571. Evasions: per-entry disposition
table (E5, E6, F1, F2, F5, F6, M1, M8b, M8c, M10, M12, M17), keep `EXPECTED_OPEN` in step. Verify with
`npm --prefix .claude/skills/lz-red-workspace run check` and `npm run check:evasions`.

### `variants/build-variants.mjs` (re-anchor, D-08 / CR-01)

**Analog:** itself. Re-anchor the `C_POINTER` map (line 129) and the `from` runs that still carry
`'   anything: exactly one new failing (red) test, all prior tests green, and the code compiles. A'` (lines 147, 155) to
the converted text; the `replaceRun` op (lines 230-233, implementation at 448) fails closed on 0 matches, which is the
current CR-01 failure. Keep the source-tree hash-before/after assert it already has (header lines 20-22). Changes past
string anchors are D-12 edits.

### Variant single-axis + staleness check (NEW TS, WR-06)

**Analog:** `.claude/skills/lz-refactor-workspace/tools/check-no-new-js.ts` (+ `.test.ts`): workspace-local erasable TS,
exported pure functions (`findScriptViolations`, `parseGrandfatherList`) plus a thin git/fs reader that throws on
failure "so the guard exits non-zero instead of passing on an empty listing" (line ~38 comment). Test analog
(`check-no-new-js.test.ts` lines 1-30) scrubs `GIT_DIR` and friends before scratch-repo calls -- copy that loop if the
new check calls git. Integrate into `lz-red-workspace/package.json` `check` the way `cycle-logs.test.ts` is
(`node --test cycle-logs.test.ts` near the start). Staleness by content hash of source tree + script + `rgr-routing.md`
(WR-06's named fix), not timestamps.

### `check-hygiene.mjs` (add `skills/lz-tdd-coach/`, Pitfall 9)

**Analog:** its own lz-red block, `.claude/skills/lz-refactor-workspace/tools/check-hygiene.mjs` lines 31-36:
```javascript
const LZ_RED_SKILL_DIR = path.join(repoRoot, "plugins", "lz-tdd", "skills", "lz-red");
const LZ_RED_SKILL_MD = path.join(LZ_RED_SKILL_DIR, "SKILL.md");
const LZ_RED_REFERENCES = path.join(LZ_RED_SKILL_DIR, "references");
```
Add a coach constant, include it in `wideTargets` and `verbatimTargets` (it is own-words, so all three axes), and a
path-keyed floor like `PLUGIN_REFERENCE_ANCHOR` (line ~47) so an empty scan cannot pass. Allowlist is
`APPROVED_EMAILS = new Set(["larsbrinknielsen@gmail.com"])` (line ~55). Alternative: put this coverage in
`check-skills.ts` to meet D-12 without growing an `.mjs`.

### Manifests and docs (AGD-12)

- `plugins/lz-tdd/.claude-plugin/plugin.json` `description` (lists three skills, "guidance"): add lz-tdd-coach, drop
  "Robert C. Martin's" only if the planner pulls D-16 forward (otherwise 23.1). Keep `"version": "0.0.3"`.
- `.claude-plugin/marketplace.json` line 13: "Transformation Priority Premise coaching", "refactoring coaching".
- `README.md` lines 5-8 ("coaches the red step ... both an auto-triggering coach and an on-demand"), 41-44 ("It
  coaches; it does not edit your code or run your tests.").
- `.planning/PROJECT.md` lines 208 ("Skill is coach + reference"), 89 vs 214 (GoF, D-11 E1).
- Gate: `rg -n -i "coaches|coach mode|reference mode" README.md plugins/lz-tdd` prints nothing outside lz-tdd-coach.

## Shared Patterns

### Checks fail closed and print one line per problem
**Source:** `tools/evals/check-cases.ts` entry point; `check-hygiene.mjs` "TWO floors keep an empty scan from reading as
clean" (header line 13).
**Apply to:** `check-skills.ts`, the variant checks, the hygiene widen. Every new scan has a floor that names a file
that must be scanned.

### Erasable TypeScript + `node:test` beside it (D-12)
**Source:** `tools/evals/*.ts` and `lz-refactor-workspace/tools/check-no-new-js.ts`. `engines` in both package.json:
`"^22.18.0 || ^24.11.0 || ^26.13.0"`; `tsc -p` first in `check`. `check-no-new-js.ts` fails any new `.mjs`/`.js` under
a workspace, so new scripts must be `.ts` (edits to grandfathered `.mjs` are fine).

### Selectors mirror SKILL.md text exactly
**Source:** `routing-parse.mjs` headings, `check-rgr-routing.mjs` constants, evasions anchors.
**Apply to:** every skill edit -- run `npm --prefix .claude/skills/lz-red-workspace run check` and
`npm --prefix .claude/skills/lz-refactor-workspace run check` after each.

### Skill text rules
ASCII; bracketed tags as code spans; banned-word table; no names in new text (D-16 for the coach); R1-R18 list in
RESEARCH; each rule once per skill (R9); remove old coach sentences instead of overriding them (R8).

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| lz-refactor smell-leaf links to the seven unreachable leaves (D-11, C8) | reference | -- | Not read here; the todo `.planning/todos/pending/2026-11-24-lz-refactor-reachability-fowler-sources-gof-line.md` names the leaves; copy the link form of a neighbouring smell leaf under `plugins/lz-tdd/skills/lz-refactor/references/smells/` |
| Optional eval suites (`trigger-lz-tdd-coach`, slim loop case) | eval case | -- | Not read here; nearest is `evals/lz-tdd/doing-lz-red/doing-lz-red-08/` (prompt.md, graders/*.md, suite.json); never edit a baseline suite (Pitfall 10) |

## Metadata

**Analog search scope:** `plugins/lz-tdd/skills/*`, `tools/evals/`, `.claude/skills/lz-red-workspace/{tools,variants}`,
`.claude/skills/lz-refactor-workspace/tools`, manifests, root README, `.planning/PROJECT.md`
**Files scanned:** 16
**Pattern extraction date:** 2026-11-26
