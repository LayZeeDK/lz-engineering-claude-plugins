# Phase 8: Kerievsky Catalog (Refactoring to Patterns) - Pattern Map

**Mapped:** 2026-07-05
**Files analyzed:** 11 file classes (27 catalog leaves + optional walkthroughs + 1 index fill + ~4-5 new smell leaves + N overlap smell-leaf edits + 4 harness .mjs + 1 package.json)
**Analogs found:** 10 / 11 (every new/modified file has a strong Phase-7 precedent; only the optional `*-walkthrough.md` overflow file has no existing instance -- its shape is spec'd, not yet materialized)

> Phase 8 is a near-exact structural clone of the shipped-green Phase 7 (Fowler catalog). Every file
> below copies an existing Phase-7 file's shape verbatim and adds ONLY the three Kerievsky-specific
> leaf fields (Composed Fowler primitive(s), Direction, GoF pattern) + the Ch.4 smell fold. This is a
> re-point + additive-checker job, not new tooling. All excerpts are ASCII-only per CLAUDE.md.

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `references/kerievsky-catalog/<slug>.md` (x27, NEW) | content/reference leaf | reference lookup (read) | `references/fowler-catalog/replace-conditional-with-polymorphism.md` | exact (+3 fields) |
| `references/kerievsky-catalog/<slug>-walkthrough.md` (optional, NEW) | content/reference (explain-in-depth) | reference lookup (read) | none materialized (Fowler catalog has 0 walkthroughs); shape = the leaf `## Example` extended | partial / spec-only |
| `references/kerievsky-catalog/README.md` (MODIFY: fill stub) | index / navigation | reference routing (read) | `references/fowler-catalog/README.md` | exact |
| `references/smells/<slug>.md` (x~4-5 unique, NEW) | content/reference leaf | reference lookup (read) | `references/smells/repeated-switches.md` | exact |
| `references/smells.md` (MODIFY: add unique rows + source tags) | index / navigation | reference routing (read) | itself (current shape) | exact / self |
| `references/smells/<existing Fowler leaf>.md` (MODIFY: additive tag + note) | content/reference leaf | reference lookup (read) | `references/smells/primitive-obsession.md` | exact / self |
| `.claude/skills/lz-refactor-workspace/tools/check-kerievsky.mjs` (NEW) | test / checker | batch (validate) | `.../tools/check-catalog.mjs` | exact (name-identity model) |
| `.claude/skills/lz-refactor-workspace/extract-samples.mjs` (MODIFY) | test / compile harness | batch (transform+compile) | itself | exact / self |
| `.claude/skills/lz-refactor-workspace/tools/check-smells.mjs` (MODIFY) | test / checker | batch (validate) | itself | exact / self |
| `.claude/skills/lz-refactor-workspace/tools/check-crossrefs.mjs` (MODIFY) | test / checker | batch (validate) | itself | exact / self |
| `.claude/skills/lz-refactor-workspace/package.json` (MODIFY: add check) | config | -- | itself | exact / self |
| `.claude/agents/oracle.md`, `.claude/agents/oracle-reviewer.md` | agent (clean-room) | request-response | REUSED AS-IS -- no edit | n/a |

## Pattern Assignments

### `references/kerievsky-catalog/<slug>.md` (x27) (content leaf, reference lookup)

**Analog:** `plugins/lz-tdd/skills/lz-refactor/references/fowler-catalog/replace-conditional-with-polymorphism.md`

Mirror the LOCKED Fowler leaf shape EXACTLY, then append the 3 Kerievsky fields (D-02). The H1 is
the always-present `#<slug>` cross-link anchor other files target.

**Leaf skeleton to replicate** (analog lines 1-12):
```md
# Replace Conditional with Polymorphism

Use when: a conditional chooses behavior by type or kind, and that variation could be expressed with
subclasses.

## Motivation

A conditional that switches on a type code is a classic candidate for polymorphism: each branch is
really the behavior of one variant. ...
```
Sections in order: `# <Name>` (single H1) -> `Use when:` one-liner -> `## Motivation` (intent leads
it for pattern-directed framing) -> `## Mechanics` (numbered verb-first steps; name the test/compile
checkpoint) -> `## Example` -> optional `## Watch for`. The checker keys on these EXACT labels.

**Mechanics with intra-catalog cross-links** (analog lines 14-25) -- Mechanics may link sibling
refactorings; every link points at the target's H1 anchor:
```md
## Mechanics

1. Ensure a class hierarchy exists for the variants; if not, create it -- for example
   [Replace Type Code with Subclasses](replace-type-code-with-subclasses.md) or
   [Replace Constructor with Factory Function](replace-constructor-with-factory-function.md).
```

**Example discipline** (analog lines 30-69) -- one compact Before/after, 5-15 lines per side, only
the touched code, `ts` fenced (compiled by extract-samples), pure (no DOM/`console` -- tsconfig
`lib: ["es2021"]`), original domain + identifiers to dodge `too_close_to_source` (D-06):
```md
## Example

Before -- a switch selects the area formula by shape kind:

```ts
type Shape =
  | { kind: "square"; side: number }
  | { kind: "circle"; radius: number };
...
```
```

**The 3 Kerievsky-specific fields to ADD** (not in the Fowler analog; source = D-02/D-03/D-04 +
RESEARCH inventory). Place as flat `Label: value` lines near the `Use when:` selector so
`check-kerievsky.mjs` token contracts match the exact labels (Pitfall 4). Recommended labels +
cross-link format (RESEARCH lines 300-305):
```md
Composed Fowler primitive(s): [Replace Conditional with Polymorphism](../fowler-catalog/replace-conditional-with-polymorphism.md#replace-conditional-with-polymorphism), [Extract Class](../fowler-catalog/extract-class.md#extract-class)
Direction: Towards
GoF pattern: Strategy
```
- `Composed Fowler primitive(s):` -> cross-links to `../fowler-catalog/<slug>.md#<slug>` (the H1
  anchor; the leaf's own H1 IS that anchor, see the Fowler analog line 1). RESOLUTION is
  `check-crossrefs`'s job; PRESENCE is `check-kerievsky`'s.
- `Direction:` -> one of {To, Towards, Away}. Default "Towards"; oracle-reviewer settles To-vs-Towards.
- `GoF pattern:` -> name only (no GoF prose/code -- DST-04). For non-GoF / utility targets, name the
  real pattern (Creation Method, Collecting Parameter, Null Object) or literal "n/a -- utility"
  (Open Question 1).

**The 3 Away de-patterning leaves** (D-03) carry an explicit "refactor AWAY from `<pattern>`" callout:
- `inline-singleton.md` (away from Singleton)
- `move-accumulation-to-visitor.md` (away from Iterator)
- `encapsulate-composite-with-builder.md` (away from Composite)

---

### `references/kerievsky-catalog/<slug>-walkthrough.md` (optional overflow) (content, explain-in-depth)

**Analog:** none exists (the Fowler catalog shipped 0 walkthroughs). Shape is the LOCKED overflow rule
(D-06): an evolving multi-step example loaded ONLY in explain-in-depth mode; the leaf keeps the
compact Before/after. Likely candidates: Interpreter (#19), possibly State (#10) / Command (#12)
(RESEARCH Pitfall 5). Author only where teaching lives in intermediate states -- YAGNI otherwise.

**Constraint the executor must honor:** extract-samples must ALSO compile walkthrough fences -- ensure
the extended walk set includes `*-walkthrough.md` (RESEARCH lines 246, 348).

---

### `references/kerievsky-catalog/README.md` (index, reference routing) -- MODIFY (fill stub)

**Analog:** `plugins/lz-tdd/skills/lz-refactor/references/fowler-catalog/README.md`

The current file is a Phase-6 stub with a per-entry contract + a "Deferred split axis" note (now
resolved by D-01 -- delete/replace that section). Fill it as a THIN chapter-grouped index. Group by
Kerievsky's OWN six chapters: Creation (Ch.6), Simplification (Ch.7), Generalization (Ch.8),
Protection (Ch.9), Accumulation (Ch.10), Utilities (Ch.11).

**Header + per-chapter table shape to replicate** (analog lines 1-27):
```md
# Fowler Catalog (Refactoring, 2nd ed) -- index

Scope: the 62 Fowler refactorings, grouped by their book chapter. Coach mode routes a mechanical
smell here; reference mode looks up a named refactoring here. This is a THIN index ...

## Ch.6 -- a first set of refactorings (the basic set)

| Refactoring | 1st-ed aliases | Use when |
|---|---|---|
| [Extract Function](extract-function.md) | Extract Method | a fragment of code can be understood on its own ... |
```

**Column adaptation for Kerievsky** (Claude's discretion, D-01): the Fowler README columns are
`Refactoring | 1st-ed aliases | Use when`. For Kerievsky, drop `1st-ed aliases` and add the
Direction + GoF annotations the index must carry per D-03/D-02 -- e.g.
`Refactoring | Direction | GoF pattern | Use when`. Each `Use when:` MUST be mirrored verbatim from
its leaf (check-kerievsky mirrors the Fowler README-mirror check, check-catalog.mjs lines 303-315).

---

### `references/smells/<slug>.md` (unique Kerievsky smells, x~4-5) -- NEW

**Analog:** `plugins/lz-tdd/skills/lz-refactor/references/smells/repeated-switches.md`

Provisional unique set (oracle-confirmed at execution, D-05): Indecent Exposure, Solution Sprawl,
Combinatorial Explosion, Oddball Solution, possibly Conditional Complexity. Follow the LOCKED
smell-leaf contract EXACTLY.

**Full smell-leaf shape to replicate** (analog lines 1-21):
```md
# Repeated Switches

Recognize by: the same switch (or if/else chain) on the same value showing up in several places.

## How to recognize

You find one conditional that branches on a type or kind, then the same set of cases repeated
elsewhere ...

## Why it's a problem

Every duplicated switch is another place to update ...

## Candidate refactorings

- [Replace Conditional with Polymorphism](../fowler-catalog/replace-conditional-with-polymorphism.md#replace-conditional-with-polymorphism) -- pick when the branches vary behavior by type or kind; ...
```
Sections: `# <Smell>` (single H1) -> `Recognize by:` one-liner (mirrored to `smells.md`) ->
`## How to recognize` -> `## Why it's a problem` -> `## Candidate refactorings` (each: link +
"pick when <discriminator>").

**Kerievsky delta:** candidate links point mostly at `../kerievsky-catalog/<slug>.md#<slug>` targets
(e.g. Combinatorial Explosion -> Replace Implicit Language with Interpreter). The candidate-link
format is identical to the Fowler one, just a different catalog dir. Also add the `Fowler/Kerievsky/both`
source tag (these new leaves = `Kerievsky`).

---

### `references/smells/<existing Fowler leaf>.md` (overlap smells) -- MODIFY (additive only)

**Analog:** `plugins/lz-tdd/skills/lz-refactor/references/smells/primitive-obsession.md`

For Ch.4 smells that OVERLAP Fowler's 24 (D-05): NO new leaf/row. ADD a `both` source tag + an "also
named by Kerievsky: `<name>`" note, and (where apt) ADD Kerievsky pattern-directed candidate
refactorings to the existing `## Candidate refactorings` list. NEVER rewrite the Phase-7 recognize-by
cue -- additive only.

**Candidate-list shape the additions must match** (analog lines 19-25):
```md
## Candidate refactorings

- [Replace Primitive with Object](../fowler-catalog/replace-primitive-with-object.md#replace-primitive-with-object) -- pick when a value has started to carry meaning and needs behavior of its own.
- [Replace Type Code with Subclasses](../fowler-catalog/replace-type-code-with-subclasses.md#replace-type-code-with-subclasses) -- pick when a type-code value gates behavior ...
```
A Kerievsky candidate added here follows the same `- [Name](../kerievsky-catalog/<slug>.md#<slug>) --
pick when ...` bullet form.

---

### `references/smells.md` (navigation index) -- MODIFY (add unique rows + source tags)

**Analog:** itself (`plugins/lz-tdd/skills/lz-refactor/references/smells.md`)

ADD one navigation block per new unique Kerievsky smell in the LOCKED shape; ADD source tags. Keep
the navigation-only shape (recognize-by cue + leaf link, NO candidate refactorings inline) so Phase-9
routing is unchanged.

**Per-smell block shape to replicate** (analog lines 52-54):
```md
### Repeated Switches

Recognize by: the same switch (or if/else chain) on the same value showing up in several places. ([leaf](smells/repeated-switches.md))
```
New unique rows link `smells/<new-slug>.md` and carry the `Kerievsky` source tag; existing overlap
rows get an additive `both` tag (never a rewrite of the recognize-by cue).

---

### `.claude/skills/lz-refactor-workspace/tools/check-kerievsky.mjs` -- NEW

**Analog:** `.claude/skills/lz-refactor-workspace/tools/check-catalog.mjs`

Clone check-catalog.mjs's structure wholesale; swap the catalog dir + NAMES; assert IDENTITY not
cardinality (the WR-02 gap). RESEARCH recommends a NEW sibling file over extending check-catalog
(keeps the shipped-green Fowler 62-checker untouched).

**Path resolution + catalog constant to adapt** (analog lines 24-28):
```js
const here = path.dirname(fileURLToPath(import.meta.url));
// tools -> lz-refactor-workspace -> skills -> .claude -> repo root
const repoRoot = path.resolve(here, "..", "..", "..", "..");
const CATALOG = path.join(repoRoot, "plugins", "lz-tdd", "skills", "lz-refactor", "references", "fowler-catalog");
```
-> change `"fowler-catalog"` to `"kerievsky-catalog"`.

**Canonical NAMES array to replace** (analog lines 32-95, 62 names) -> the 27 Kerievsky names from
RESEARCH inventory (lines 125-176). `EXPECTED = 27`. Identity check loop is analog lines 234-318.

**Contract-field regexes to reuse verbatim** (analog lines 256-274) -- these are the exact label
tokens the leaves must carry:
```js
if (!/^Use when:\s*\S/m.test(leaf.text)) { missing.push("Use when: line"); }
if (!/^##\s+Motivation\s*$/m.test(leaf.text)) { missing.push("## Motivation"); }
if (!/^##\s+Mechanics\s*$/m.test(leaf.text)) { missing.push("## Mechanics"); }
if (!/^##\s+Example\b/m.test(leaf.text)) { missing.push("## Example"); }
if (!/```(ts|typescript|js|javascript)\b/.test(leaf.text)) { missing.push("ts/js fence"); }
```

**Kerievsky-specific assertions to ADD** (new; keep labels in lockstep with the leaf field labels --
Pitfall 4):
```js
if (!/^Direction:\s*(To|Towards|Away)\b/m.test(leaf.text)) { missing.push("Direction: field"); }
if (!/^GoF pattern:\s*\S/m.test(leaf.text)) { missing.push("GoF pattern: field"); }
if (!/^Composed Fowler primitive\(s\):.*\]\(\.\.\/fowler-catalog\/[a-z0-9-]+\.md#[a-z0-9-]+\)/m.test(leaf.text)) {
  missing.push("Composed Fowler primitive cross-link");
}
```
- Plus: the 3 Away cases present AND flagged with an Away callout (D-03). Model on the WEB_ONLY set +
  membership checks in check-catalog.mjs lines 101-102, 280-294 (a `Set` of the 3 names, assert
  `Direction: Away` + a "refactor AWAY" callout in each).
- Allow "n/a -- utility" for the GoF field on the 3 Utilities (Open Question 1).

**README-mirror check to reuse** (analog lines 184-208 `readmeRowsBySlug`, lines 303-315 mirror
assertion) -- each leaf's `Use when:` must appear in a `kerievsky-catalog/README.md` row linking it.

**Slug + walk helpers to reuse verbatim:** `slugFor` (analog line 127), `walkMd` (129-147),
`collectLeaves` (152-180), `report` (110-116), `isDir` (118-124).

---

### `.claude/skills/lz-refactor-workspace/extract-samples.mjs` -- MODIFY

**Analog:** itself

Two edits (RESEARCH lines 245-248):

1. **Walk `kerievsky-catalog/` too.** Current CATALOG constant (line 17) is Fowler-only:
```js
const CATALOG = path.join(repoRoot, "plugins", "lz-tdd", "skills", "lz-refactor", "references", "fowler-catalog");
```
Change the walk loop (line 93 `for (const file of walkMd(CATALOG))`) to iterate BOTH catalog dirs
(and pick up `*-walkthrough.md`, already covered by `walkMd`'s `.md` filter).

2. **Namespace output filenames per catalog** to prevent a Kerievsky slug silently overwriting a
Fowler sample module (false green -- Pitfall / Anti-pattern). Current naming (line 122):
```js
const outName = `${leaf}-${n}.ts`;
```
-> prefix by catalog, e.g. `${catalogPrefix}-${leaf}-${n}.ts` (`kerievsky-<leaf>-<n>.ts`). No tsconfig
change -- `samples/**/*.ts` is already globbed; keep pure examples (`lib: ["es2021"]`).

---

### `.claude/skills/lz-refactor-workspace/tools/check-smells.mjs` -- MODIFY

**Analog:** itself

Three edits (RESEARCH lines 262-265):

1. **Add Kerievsky-unique smell names** to the expected set (or a separate Kerievsky set); assert
each unique leaf present once with the smell-leaf contract. Model on the SMELLS array (lines 28-53)
+ identity loop (199-240).

2. **Broaden the candidate-link regex** (line 173) from `fowler-catalog/`-only:
```js
const linkRe = /\]\(([^)\s]*fowler-catalog\/[a-z0-9-]+\.md(?:#[^)\s]+)?)\)/g;
```
-> `(?:fowler|kerievsky)-catalog/` so a unique smell whose candidates are all Kerievsky refactorings
resolves (Pitfall 2). Keep the same resolve logic (lines 174-194); the `path.resolve(REFERENCES,
"smells", rel)` base still works for `../kerievsky-catalog/...` relatives.

3. **Assert source-tag validity** (`Fowler`/`Kerievsky`/`both`) and **no un-deduped duplicate** (a
Kerievsky smell that overlaps Fowler must NOT also appear as a new leaf). New assertions; no existing
analog line -- add alongside the per-smell contract loop.

---

### `.claude/skills/lz-refactor-workspace/tools/check-crossrefs.mjs` -- MODIFY

**Analog:** itself

One edit (RESEARCH lines 259-260): add `kerievsky-catalog/` leaves to `sourceFiles` so
composed-Fowler links get resolution-checked. Current (line 98):
```js
const sourceFiles = [...collectLeafFiles(CATALOG), ...collectLeafFiles(SMELLS_DIR)];
```
-> add `...collectLeafFiles(KERIEVSKY)` (define `KERIEVSKY` alongside CATALOG at lines 27-29).

**Verify the inverse-of mutuality guard stays Fowler-scoped** (line 176) -- it is CATALOG-gated, so
the one-directional Kerievsky->Fowler links are correctly EXCLUDED from mutuality:
```js
if (isInverseLine && path.dirname(targetPath) === CATALOG && path.dirname(srcResolved) === CATALOG) {
  inverseEdges.push({ from: srcBase, to: targetBase });
}
```
Do NOT broaden this to the Kerievsky dir -- composed-primitive links are one-way by design.

---

### `.claude/skills/lz-refactor-workspace/package.json` -- MODIFY

**Analog:** itself

Add `check-kerievsky.mjs` to the `check` chain (line 8):
```json
"check": "node tools/check-catalog.mjs && node tools/check-smells.mjs && node tools/check-crossrefs.mjs && node tools/check-principles.mjs && node tools/check-hygiene.mjs"
```
-> insert `&& node tools/check-kerievsky.mjs`. `typecheck` (line 7, runs extract-samples.mjs) needs
no change -- the extended walk is inside that script.

---

### `.claude/agents/oracle.md`, `.claude/agents/oracle-reviewer.md` -- REUSED AS-IS

No edit. `oracle-reviewer` (frontmatter verified: `tools: Read, Glob`, gates leaf/smell/principles
drafts, returns `pass|revise|blocked`, never echoes source prose) already knows the `.oracle/`
firewall and handles refactoring + smell leaves. The Kerievsky book is provisioned at
`.oracle/refactoring-to-patterns/`. Drive both from the MAIN context inline (D-08); pass a tight
per-leaf scope + per-axis anchors (add direction / composed-primitive-aptness / target-pattern axes
per RESEARCH line 212).

## Shared Patterns

### Leaf H1 = cross-link anchor
**Source:** every `fowler-catalog/<slug>.md` (H1 on line 1; e.g. replace-conditional-with-polymorphism.md line 1)
**Apply to:** all 27 Kerievsky leaves + all new smell leaves
Single `# <Name>` H1 whose GitHub slug (`#<slug>`) is the stable link target. Filename = kebab-slug
of the H1. Every composed-primitive / candidate link ends in `.md#<slug>`.

### Name-identity checker (not cardinality)
**Source:** `check-catalog.mjs` (NAMES array lines 32-95; identity loop 234-327), `check-smells.mjs`
(SMELLS array 28-53)
**Apply to:** `check-kerievsky.mjs`, `check-smells.mjs` extension
Key on a canonical NAMES array; assert each name present EXACTLY once as a leaf H1; flag unknown
headings (check-catalog.mjs lines 321-327). A typo or dropped refactoring fails loudly.

### Deterministic report + exit-code idiom
**Source:** `check-catalog.mjs` lines 108-116, 329-337 (mirrored in all checkers)
**Apply to:** `check-kerievsky.mjs`
```js
let failures = 0;
const report = (ok, label, detail) => {
  if (!ok) { failures++; }
  console.log(`  [${ok ? "PASS" : "FAIL"}] ${label}${detail ? " -- " + detail : ""}`);
};
// ... end: process.exit(failures === 0 ? 0 : 1);
```

### GitHub-slug anchor resolution
**Source:** `check-crossrefs.mjs` lines 50-80 (`slugsFor`) + 109-117 (`anchorsOf` cache); duplicated
in `check-smells.mjs` lines 78-118
**Apply to:** any new anchor-resolution need (reuse verbatim; already handles duplicate-slug `-1`/`-2`)

### Field-label / checker-regex lockstep (Pitfall 4)
**Source:** RESEARCH lines 342-344; enforced by check-catalog.mjs contract regexes (lines 256-274)
**Apply to:** the 3 new Kerievsky field labels
Keep `Direction:`, `GoF pattern:`, `Composed Fowler primitive(s):` IDENTICAL in the leaf template and
the checker regex, or leaves go content-correct-but-token-RED.

### Clean-room authoring loop (D-07/D-08)
**Source:** `.claude/agents/oracle-reviewer.md`, `.claude/agents/oracle.md`; 07-ORACLE-MODEL.md
**Apply to:** every catalog + smell authoring batch
Author BLIND -> run the DETERMINISTIC layer first (extract-samples + check-kerievsky/-smells/-crossrefs/-hygiene)
-> gate via oracle-reviewer sub-batched ~6-8 leaves -> revise BLIND -> cap ~3 rounds -> escalate
non-convergence via AskUserQuestion. MAIN context inline ONLY; main context never reads `.oracle/` prose.

### Public-repo + IP hygiene (auto-enforced)
**Source:** `check-hygiene.mjs` (walks all of `references/` -- no change needed)
**Apply to:** every new/edited file
ASCII-only (no Unicode/em-dash/curly-quote), no work email, no verbatim Kerievsky/GoF prose or code
(DST-04). New leaves are picked up automatically.

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `references/kerievsky-catalog/<slug>-walkthrough.md` | content (explain-in-depth overflow) | reference lookup | The Fowler catalog shipped 0 walkthrough files -- the overflow rule (D-06) is spec'd but never materialized. Shape = the leaf `## Example` extended into evolving multi-step states; must be compiled by the extended extract-samples. Author only for pattern-heavy refactorings (Interpreter #19, maybe State #10 / Command #12) where the compact Before/after loses the lesson -- YAGNI otherwise. |

## Metadata

**Analog search scope:**
- `plugins/lz-tdd/skills/lz-refactor/references/` (fowler-catalog x62+README, smells x24+smells.md, kerievsky-catalog stub)
- `.claude/skills/lz-refactor-workspace/` (extract-samples.mjs, package.json, tsconfig.json) + `tools/` (check-catalog, check-smells, check-crossrefs, check-hygiene, check-principles, verify-scaffold)
- `.claude/agents/` (oracle.md, oracle-reviewer.md -- frontmatter only)

**Files scanned in full:** 9 (2 planning docs + replace-conditional-with-polymorphism.md, fowler-catalog/README.md, smells.md, repeated-switches.md, primitive-obsession.md, kerievsky-catalog/README.md stub, check-catalog.mjs, check-smells.mjs, check-crossrefs.mjs, extract-samples.mjs, package.json; oracle-reviewer.md frontmatter)

**Firewall respected:** `.oracle/` was NOT read (only directory listings elsewhere). No book prose entered context.

**Pattern extraction date:** 2026-07-05
