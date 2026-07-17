# Phase 9: Coach Behavior & Principle-Backing - Pattern Map

**Mapped:** 2026-07-08
**Files analyzed:** 13 (4 new, 9 modified)
**Analogs found:** 13 / 13 (every file has an in-repo template; zero net-new patterns)

This phase adds NO new pattern. Every deliverable copies an existing sibling: the
coach procedure copies the lz-tpp skill's coach procedure; the Beck refs copy the
Feathers stub + functional-catalog no-oracle Sources note; `check-backing.mjs` copies
`check-principles.mjs`; `heading-scan.mjs` copies `github-slug.mjs`; the four checker
edits are one identical line swap; the `check-crossrefs`/`package.json` edits copy their
own existing extend-the-list idioms.

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `plugins/lz-tdd/skills/lz-refactor/SKILL.md` (edit :38-43) | skill router | request-response (routing) | `plugins/lz-tdd/skills/lz-tpp/SKILL.md` `## Coach decision procedure` (:42-65) + this file's own router sections | exact |
| `plugins/lz-tdd/skills/lz-refactor/references/principles.md` (edit) | reference doc | transform (cross-ref) | its own existing catalog-link style (:46-53) | exact |
| `plugins/lz-tdd/skills/lz-refactor/references/refactoring-without-tests.md` (populate stub) | reference doc (no-oracle) | transform (author) | its own content contract (:10-27) + functional-catalog `## Sources` note | exact |
| `plugins/lz-tdd/skills/lz-refactor/references/beck-tdd-by-example.md` (NEW) | reference doc (no-oracle) | transform (author) | Feathers stub structure + functional-catalog `## Sources` no-oracle note (README.md:173-180) | role-match |
| `plugins/lz-tdd/skills/lz-refactor/references/beck-tidy-first.md` (NEW) | reference doc (no-oracle) | transform (author) | same as above + principles.md's fowler-catalog link style | role-match |
| `.claude/skills/lz-refactor-workspace/tools/check-backing.mjs` (NEW) | checker script | file-I/O (read + assert) | `tools/check-principles.mjs` (full file) | exact |
| `.claude/skills/lz-refactor-workspace/tools/lib/heading-scan.mjs` (NEW) | shared lib | transform (pure fn) | `tools/lib/github-slug.mjs` (full file) | role-match |
| `.claude/skills/lz-refactor-workspace/tools/check-gof.mjs` (edit :160) | checker script | file-I/O | identical H1-scan line in the other 3 checkers | exact |
| `.claude/skills/lz-refactor-workspace/tools/check-kerievsky.mjs` (edit :199) | checker script | file-I/O | already imports from `./lib/` (:36) | exact |
| `.claude/skills/lz-refactor-workspace/tools/check-extra-patterns.mjs` (edit :113) | checker script | file-I/O | identical H1-scan line | exact |
| `.claude/skills/lz-refactor-workspace/tools/check-functional.mjs` (edit :198) | checker script | file-I/O | already imports slug helper; ponytail note :192-197 names this exact upgrade | exact |
| `.claude/skills/lz-refactor-workspace/tools/check-crossrefs.mjs` (edit :107-114) | checker script | file-I/O | its own `sourceFiles` spread + single-file push (:112-114) | exact |
| `.claude/skills/lz-refactor-workspace/package.json` (edit :8) | config | n/a | its own `scripts.check` `&&` chain | exact |

---

## Pattern Assignments

### `SKILL.md` coach procedure (skill router, edit :38-43)

**Analog:** `plugins/lz-tdd/skills/lz-tpp/SKILL.md` -- the sibling TDD skill has the exact
same two-mode + classify-gate + numbered-coach-procedure shape. Copy its structure; the
router-pointer sections already in lz-refactor's own SKILL.md stay as-is (the procedure
REFERENCES them, does not re-add them -- D-03).

**lz-tpp coach-procedure pattern to mirror** (lz-tpp SKILL.md:42-65) -- a numbered
decision tree opening with a classify gate, closing with a coach-not-drive line:

```markdown
## Coach decision procedure

1. Confirm the green phase. Exactly one new failing (red) test ... -> you are choosing a
   transformation. If the tests are green and the request is "clean this up", that is a
   refactoring (structure-only) -- do not priority-rank it.
2. Enumerate the candidate minimal changes ...
...
7. Show, don't drive. Present the minimal diff and the named transformation; let the
   developer apply it and run the tests. Never edit the developer's code or run the tests
   unless explicitly asked -- coach, don't drive.
```

**Exact procedure text to inline** is already specified in `09-RESEARCH.md:128-154` (the
`## Coach decision procedure` skeleton, 6 numbered steps). Do NOT re-derive it -- copy that
skeleton. It is ~30-40 lines; SKILL.md is 85 lines (`wc -l`), lands ~120-130, ~370 under
the < 500 budget, so **INLINE, no `coach-procedure.md` split** (D-01; D-02 fallback dead).

**Classify gate already present** (lz-refactor SKILL.md:32-36) -- the procedure step 1
points at this, does not restate it:

```markdown
## Refactoring vs the green step (the lz-tpp seam)
...
Classify the request before acting: if a red test must be made to pass, that is lz-tpp,
not this skill.
```

**Router pointers the procedure links to** already exist in the same file (do not re-add):
`## Fowler catalog` (:45), `## Smell taxonomy` (:50), `## Refactoring principles` (:55),
`## Kerievsky pattern-directed refactorings` (:60), `## Target pattern catalogs` (:66),
`## Functional catalog` (:74), `## Refactoring safely without tests (Feathers)` (:82).

**Also: delete the two placeholder-mode lines** -- the parenthetical at SKILL.md:27 ("The
full coach decision procedure is deferred to Phase 9 -- see the placeholder below.") when
you replace :38-43. Keep coach links FILE-LEVEL (no `#anchor`) per RESEARCH Open Question 2.

---

### `principles.md` cross-ref pointers (reference doc, edit)

**Analog:** the file's OWN existing catalog-link style -- inline `[Text](path.md)` links to
sibling references. Copy that exact link form for the two new D-06 pointers to the Beck files.

**Existing link style to mirror** (principles.md:46-53):

```markdown
- **Rule of three** -- the third time you meet the same duplication, refactor it.
  See the [Duplicated Code](smells/duplicated-code.md) smell.
...
- **Comprehension** -- ... fold that understanding back
  into it: [Rename Variable](fowler-catalog/rename-variable.md),
  [Extract Function](fowler-catalog/extract-function.md), ...
```

**Where to add the D-06 pointers** (RESEARCH :226-231): a short line under "The two hats"
(:19-24) -> `beck-tdd-by-example.md`; a short line under the refactor-economics / "When to
refactor" material -> `beck-tidy-first.md`. Paths are sibling-relative (`beck-tidy-first.md`,
no subdir). `principles.md` stays the Fowler-oracle file -- add pointers only, do not import
Beck content into it.

---

### `refactoring-without-tests.md` (reference doc, populate stub)

**Analog:** the stub's OWN per-entry content contract + the functional-catalog no-oracle
`## Sources` convention. Author each technique against the declared contract; do not invent
a new shape.

**Content contract already declared in the stub** (:10-27):

```markdown
## Per-entry content contract

Each technique, when populated, carries:

- Technique -- the technique name in original words.
- When-to-use -- the situation that calls for it.
- Distilled mechanics -- the step sequence in original words (no verbatim book prose).

Core techniques in scope (high-confidence only):
- Seams -- ...
- Characterization tests -- ...
- The change algorithm -- identify change points, find test points, break dependencies,
  write tests, make the change.
- Sprout Method / Sprout Class.
- Wrap Method / Wrap Class.
- Subclass and Override Method.
- Extract Interface.
```

**Scaffold markers to REMOVE on populate** (else `check-backing`'s SCAFFOLD guard stays RED):
- the `> Populated in Phase 9.` blockquote (:7-8)
- the `## Sources (placeholder)` heading (:29) -> rename to `## Sources` (the word
  "placeholder" trips `/\bplaceholder\b/i` -- RESEARCH Pitfall 4).

**Keep** the no-oracle framing already in the blockquote ("high-confidence CORE techniques
only, tagged no-oracle. No verbatim Feathers prose or code (DST-04).") -- fold it into the
retained top blockquote per the provenance convention below.

---

### `beck-tdd-by-example.md` (NEW, reference doc, no-oracle) + `beck-tidy-first.md` (NEW)

**Analog:** the Feathers stub (`refactoring-without-tests.md`) for file shape + the
functional-catalog README's `## Sources` no-oracle note for the provenance marker. These are
new prose (role-match, not copy-the-text), but they copy the STRUCTURE and the no-oracle tag.

**No-oracle provenance marker to mirror** -- functional-catalog/README.md:173-180 is the
in-repo precedent:

```markdown
## Sources

- `.planning/research/functional-depatterning-ts.md` Sections 10-13 -- the LOCKED design
  source of record ... This phase has no owned book oracle (D-06); the committed research
  artifact plus `check-functional` plus `tsc --strict` are the correctness anchor. Idioms,
  examples, and prose are original words ... no verbatim book or artifact prose or code (DST-04).
```

**Difference for the Beck/Feathers files (D-07):** unlike the functional catalog, there is NO
committed research artifact to cite. So the marker names only the BOOK + the no-oracle posture.
RESEARCH :217-224 gives the exact recommended convention (checker keys on `/no-oracle/i`):
- top blockquote: `> No-oracle reference: high-confidence CORE only (no owned book to verify
  against). Original prose, no verbatim Beck/Feathers prose or code (DST-04).`
- a `## Sources` section (NOT "(placeholder)") naming the book + the no-oracle posture.

**PRIN-02 extra constraint (`beck-tidy-first.md`):** must carry >=1 link into `fowler-catalog/`
(check-backing asserts `/\]\(\.\.?\/?fowler-catalog\/[a-z0-9-]+\.md/`). Use the principles.md
link style; verified-existing Fowler slugs to link (RESEARCH :196-205): `extract-variable.md`,
`extract-function.md`, `extract-class.md`, `combine-functions-into-class.md`, `inline-function.md`,
`slide-statements.md`, `replace-nested-conditional-with-guard-clauses.md`, `decompose-conditional.md`,
`rename-variable.md`. Cross-ref by LINK, do NOT restate the Fowler mechanics (PRIN-02 core).
"Explaining Constants" has NO Fowler 2nd-ed leaf -- cover in prose, do not fabricate a link.

**Core scope is FIXED by D-08 -- do not expand** (RESEARCH :183-193 has the per-file outline).
**DST-04 (RESEARCH Pitfall 1):** paraphrase the famous one-liners from the first draft
(Feathers "legacy code is code without tests"; the seam definition; Beck's Fake It / Triangulate
/ Obvious Implementation definitions; "write new code only when a test is failing"). Keep the
NAMES verbatim (facts); write the definitions in original words.

---

### `check-backing.mjs` (NEW, checker script)

**Analog:** `tools/check-principles.mjs` (full file) -- the line-oriented topic-token presence
checker. Copy it wholesale and swap the topic set + add the SCAFFOLD guard + the Fowler-link
presence check. Do NOT overload `check-principles.mjs` (it is FWL-03-specific, single path) --
add a NEW sibling (RESEARCH :481-485; sibling matches check-gof/check-extra/check-functional).

**Header + repoRoot resolution to copy** (check-principles.mjs:1-15):

```javascript
#!/usr/bin/env node
// ... one-line description ... Throwaway; node builtins only; mirrors verify-scaffold.mjs.
//   node .claude/skills/lz-refactor-workspace/tools/check-backing.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
// tools -> lz-refactor-workspace -> skills -> .claude -> repo root
const repoRoot = path.resolve(here, "..", "..", "..", "..");
```

**`report` closure + line-oriented `some()` loop to copy** (check-principles.mjs:31-61):

```javascript
const report = (ok, label, detail) => {
  if (!ok) {
    failures++;
  }

  console.log(`  [${ok ? "PASS" : "FAIL"}] ${label}${detail ? " -- " + detail : ""}`);
};
...
const lines = fs.readFileSync(PRINCIPLES, "utf8").split(/\r?\n/);
...
for (const topic of TOPICS) {
  const hit = lines.some((line) => topic.re.test(line));
  ...
  report(hit, topic.label, hit ? "" : "topic token absent");
}
```

**SUMMARY + exit convention to copy** (check-principles.mjs:65-71): `SUMMARY: ... GREEN` +
`process.exit(0)` on pass; `SUMMARY: ... RED` + `process.exit(1)` on fail.

**Topic-token map for the 3 files** (RESEARCH :466-479 -- use verbatim):
- `beck-tdd-by-example.md`: `/red-green-refactor/i`, `/two rules/i`, `/fake it/i`,
  `/triangulate/i`, `/obvious implementation/i`, `/lz-tpp/i`
- `beck-tidy-first.md`: `/structural/i`, `/behavioral/i`, `/coupling/i`, `/cohesion/i`,
  `/options/i` + Fowler-link presence `/\]\(\.\.?\/?fowler-catalog\/[a-z0-9-]+\.md/`
- `refactoring-without-tests.md`: `/seams?/i`, `/characterization test/i`,
  `/change algorithm/i` (or step tokens), `/sprout/i`, `/wrap/i`, `/subclass and override/i`,
  `/extract interface/i`
- all three: `/no-oracle/i` present AND the SCAFFOLD guard must NOT match.

**SCAFFOLD guard to add** (the idiom the catalog checkers use, RESEARCH Pitfall 4) --
`/\bTODO\b/`, `/\bTBD\b/`, `/\bplaceholder\b/i`, `/once it exists/i`, `/to be authored/i`.
This keeps Feathers RED until its `## Sources (placeholder)` marker is removed. Combined with
the 2 absent Beck files, the phase-open baseline is unambiguously RED (instrument-first).

---

### `tools/lib/heading-scan.mjs` (NEW, shared lib)

**Analog:** `tools/lib/github-slug.mjs` -- the ONLY existing file in `lib/`. Same shape: a
single named `export const`, a pure function, node-builtin-free, a doc comment explaining the
single-source-of-truth rationale. Copy that file's shape.

**github-slug.mjs shape to mirror** (:1-19):

```javascript
// Single source of truth for GitHub-flavored heading -> anchor slugs across the checker
// battery. ... Shared by check-kerievsky ... and check-crossrefs ... so the anchor a
// checker DEMANDS can never diverge from the anchor a checker VALIDATES ...
export const githubSlug = (text) =>
  text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
```

**Exact `collectH1Lines` implementation** is already specified in `09-RESEARCH.md:330-356`
(fence-aware CommonMark-ish tracker, `export const collectH1Lines = (text) => {...}`). Copy it.

**Import convention** (how the 4 checkers reach `lib/`) -- copy the existing line form from
check-kerievsky.mjs:36 / check-crossrefs.mjs:22:

```javascript
import { githubSlug } from "./lib/github-slug.mjs";
```

New callers add: `import { collectH1Lines } from "./lib/heading-scan.mjs";`

---

### The four catalog-checker edits (IN-02 / D-10, exact one-line swap)

**Analog:** the edit is IDENTICAL across all four -- one fence-blind line becomes one helper
call. A per-checker patch is FORBIDDEN (D-10); the swap routes every call through the shared
helper. RESEARCH located the exact lines:

| File | Fence-blind line to replace |
|------|-----------------------------|
| `check-gof.mjs` | :160 `const h1s = lines.filter((l) => /^#\s+\S/.test(l));` |
| `check-kerievsky.mjs` | :199 (same line) |
| `check-extra-patterns.mjs` | :113 (same line) |
| `check-functional.mjs` | :198 (same line) |

**Replace each with** (RESEARCH :360-362):

```javascript
const h1s = collectH1Lines(text);
```

**Import wiring differs per file** (RESEARCH :363-365, VERIFIED this session):
- `check-kerievsky.mjs` (already imports `githubSlug` from `./lib/` at :36) and
  `check-functional.mjs` (already imports the slug helper) -> ADD a second import line.
- `check-gof.mjs` (imports only `node:fs`/`node:path`/`node:url` at :27-29) and
  `check-extra-patterns.mjs` (same, :20-22) -> ADD `import { collectH1Lines } from "./lib/heading-scan.mjs";`.

**Also update the stale ponytail comment** in check-functional.mjs:192-197 -- it documents
this exact gap as "carried-in debt on ROADMAP Phase 9; trigger = first leaf needing a non-TS
fenced block". Once the helper lands, that comment is stale; replace/trim it. (The other three
checkers have no equivalent block -- only functional carries the note.)

**Regression guarantee:** no leaf currently has a fenced column-0 `#`, so the full battery
STAYS GREEN through this swap -- a behavior-preserving refactoring the still-GREEN battery
proves (RESEARCH Wave 1 step 1).

---

### `check-crossrefs.mjs` source-set extension (edit :107-114)

**Analog:** the file's OWN `sourceFiles` construction -- a spread of `collectLeafFiles(...)`
plus a single-file `push` guarded by `existsSync`. Copy that exact idiom to add the 5 new
source files (RESEARCH Pitfall 3 + Wave 1 step 3).

**Existing pattern to extend** (:107-114):

```javascript
const sourceFiles = [...collectLeafFiles(CATALOG), ...collectLeafFiles(KERIEVSKY),
                     ...collectLeafFiles(GOF), ...collectLeafFiles(EXTRA),
                     ...collectLeafFiles(FUNCTIONAL),
                     ...collectLeafFiles(SMELLS_DIR)];

if (fs.existsSync(SMELLS_INDEX)) {
  sourceFiles.push(SMELLS_INDEX);
}
```

**Add** (as single-file pushes, mirroring the `SMELLS_INDEX` guard): `SKILL.md`,
`principles.md`, `beck-tdd-by-example.md`, `beck-tidy-first.md`, `refactoring-without-tests.md`
so their outbound `.md` links get resolution-checked. Define the paths near the existing
`SMELLS_INDEX` const (:33-34) using the same `path.join(REFERENCES, ...)` form -- note SKILL.md
sits one dir UP from `references/` (`path.join(REFERENCES, "..", "SKILL.md")`).

**Gotcha (already handled by the file):** `principles.md` is special-cased as a file-level
hub TARGET (:165-173, no anchor resolution). Adding it as a SOURCE is orthogonal and safe --
its outbound links (the new D-06 Beck pointers) get checked; nothing checks anchors INTO it.
This is the same extend-the-source-set move 08.1 (added gof/extra) and 08.2 (added functional)
made.

---

### `package.json` check-battery wiring (config, edit :8)

**Analog:** the existing `scripts.check` `&&`-chained battery. Append the new checker the same
way every prior checker was appended.

**Existing chain** (:8):

```json
"check": "node tools/check-catalog.mjs && node tools/check-kerievsky.mjs && node tools/check-gof.mjs && node tools/check-extra-patterns.mjs && node tools/check-smells.mjs && node tools/check-crossrefs.mjs && node tools/check-principles.mjs && node tools/check-hygiene.mjs && node tools/check-functional.mjs"
```

**Append** `&& node tools/check-backing.mjs` to the end (RESEARCH Wave 1 step 4). `typecheck`
(:7, `node extract-samples.mjs`) is unchanged -- only relevant if a principle ref carries a live
TS fence; author fence-free or TS-fenced prose (D-11) so it stays a no-op.

---

## Shared Patterns

### No-oracle provenance marker
**Source:** `functional-catalog/README.md:173-180` (`## Sources` note) -- the in-repo precedent.
**Apply to:** all 3 principle refs (`beck-tdd-by-example.md`, `beck-tidy-first.md`,
`refactoring-without-tests.md`).
**Convention (RESEARCH :217-224):** a top `> No-oracle reference: ...` blockquote + a
`## Sources` section naming the book + the no-oracle posture. Checker keys on `/no-oracle/i`.
Unlike the functional catalog, NO research artifact to cite (D-07) -- name only the book.

### Line-oriented topic-token presence check
**Source:** `check-principles.mjs:50-61` (`lines.some((line) => re.test(line))`).
**Apply to:** `check-backing.mjs`. Line-oriented so a soft-wrapped token cannot false-negative
(the Phase 2/3 lesson cited in check-principles.mjs:2-4).

### Instrument-first RED->GREEN sequence
**Source:** every prior checker header ("RED against the empty ... by design ... the expected
instrument-first Wave-1 baseline, not a failure" -- e.g. check-gof.mjs:24-25, check-functional.mjs:37-39).
**Apply to:** `check-backing.mjs` (RED = 2 Beck files absent + Feathers SCAFFOLD guard trips) and
the whole phase (Wave 1 instrument before Wave 2 content). Full sequence in RESEARCH :428-449.

### Shared-helper-once, never per-checker
**Source:** `lib/github-slug.mjs` doc comment ("Single source of truth ... so the anchor a
checker DEMANDS can never diverge") + check-functional.mjs:192-197 ponytail note naming the
exact upgrade path.
**Apply to:** `heading-scan.mjs` + the 4 checker swaps (D-10). One helper, four identical call
sites. A per-checker patch re-introduces the divergence the 08.2 fixer declined.

### Link resolution is check-crossrefs's job (no second resolver)
**Source:** check-functional.mjs:32-35 ("Link RESOLUTION ... is DELEGATED to check-crossrefs ...
there is NO second resolver here").
**Apply to:** `check-backing.mjs` MUST NOT resolve links itself -- it asserts token/format
PRESENCE only; resolution comes from extending `check-crossrefs` source set (RESEARCH Don't
Hand-Roll table).

### `[PASS]/[FAIL]` + `SUMMARY: ... GREEN/RED` + `process.exit(0|1)`
**Source:** shared across the whole battery (check-principles.mjs:31-71).
**Apply to:** `check-backing.mjs`. Same `report` closure, same SUMMARY line, same exit codes.

---

## No Analog Found

None. Every file in scope maps to an existing in-repo template. The planner does not need to
fall back to RESEARCH.md's abstract patterns for any file -- concrete analogs cover all 13.

The single ADJACENT gap the planner should NOT expand into: `check-crossrefs.mjs`'s own
`slugsFor` / `linkRe` is also fence-blind (header note :16-17). D-10's scope is the FOUR
catalog `collectLeaves` sites only. Keep it there; rely on D-11 authoring discipline (TS/
fence-free principle refs) so the check-crossrefs gap stays dormant. Optional defense-in-depth
(reuse `collectH1Lines` inside `slugsFor`) is allowed at low cost but MUST NOT block the phase
(RESEARCH Open Question 1).

## Metadata

**Analog search scope:** `plugins/lz-tdd/skills/lz-refactor/` (SKILL.md, references/, catalogs),
`plugins/lz-tdd/skills/lz-tpp/SKILL.md`, `.claude/skills/lz-refactor-workspace/tools/` (all
checkers + `lib/`) and `package.json`.
**Files scanned:** 13 analog files read this session (SKILL.md x2, principles.md,
refactoring-without-tests.md, functional-catalog/README.md, check-principles.mjs,
check-crossrefs.mjs, github-slug.mjs, package.json, check-gof/kerievsky/extra/functional.mjs).
**Pattern extraction date:** 2026-07-08
</content>
</invoke>
