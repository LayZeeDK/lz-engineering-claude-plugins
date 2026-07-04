# Phase 7: Fowler Catalog (Refactoring, 2nd ed) - Pattern Map

**Mapped:** 2026-07-04
**Files analyzed:** 6 target categories (3 Markdown fills + tag-group leaves + harness config + harness/checker scripts)
**Analogs found:** 5 strong in-repo analogs / 6 categories (tsconfig + package.json are net-new; every Markdown + checker category has an exact or role-match analog)

This is a Markdown skill-authoring phase. There is no application code. "Role" below is a
documentation/tooling role, not a controller/service role. "Data flow" is the disclosure or
build path each file participates in.

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `references/fowler-catalog/<tag-group>.md` (NEW, ~7-20 leaves) | catalog leaf | reference-time disclosure (SKILL -> README -> leaf) | `lz-tpp/references/typescript-and-tco.md` (per-entry headings + `tsc --strict` fences) and `lz-tpp/references/fibonacci-worked-example.md` (worked-example prose+code interleave, TOC) | exact |
| `references/fowler-catalog/README.md` (FILL stub) | index | reference-time routing (single SKILL.md pointer) | its own Phase-6 stub contract + `lz-tpp/references/transformations.md` Sources/notation idiom for the provenance legend | role-match (no exact index analog in-repo) |
| `references/smells.md` (FILL stub) | trigger-table | coach routing (smell -> refactoring cross-link) | its own Phase-6 stub contract + GFM tables in `lz-tpp/references/typescript-and-tco.md` (lines 214-218, 248-255) | role-match |
| `references/principles.md` (FILL stub) | principles doc | reference-time disclosure | its own Phase-6 stub contract + quote/attribution/distilled prose in `lz-tpp/references/transformations.md` (lines 39-58, 107-116) | role-match |
| `.claude/skills/lz-refactor-workspace/extract-samples.mjs` (NEW) | build tooling | build/validate (extract `ts` fences -> `samples/*.ts`) | `.claude/skills/lz-refactor-workspace/tools/verify-scaffold.mjs` + `lz-tpp-workspace/eval-status.mjs` (node-builtin checker idiom) | role-match |
| completeness/link/topic/ASCII checker `.mjs` (NEW) | validation tooling | validate (FWL-01/02/03 + hygiene gates) | `verify-scaffold.mjs` (report helper, `scanNonAscii`, `walkMd`, `SUMMARY:` + exit) | exact |
| `.claude/skills/lz-refactor-workspace/tsconfig.json` (NEW) | config | build (`tsc --strict --noEmit`) | none tracked; content supplied verbatim by 07-RESEARCH.md lines 313-327 | no analog (net-new) |
| `.claude/skills/lz-refactor-workspace/package.json` (NEW, optional) | config | build (pin `typescript@6.0.3` + `typecheck` script) | none tracked in repo | no analog (net-new) |

**NOT touched:** `plugins/lz-tdd/skills/lz-refactor/SKILL.md`. D-01: its pointer to
`fowler-catalog/README.md` already resolves; leaves hang under the index. Confirmed by
`verify-scaffold.mjs` Check 5/6 (5 distinct `references/` pointers, all resolve).

## Pattern Assignments

### `references/fowler-catalog/<tag-group>.md` leaf files (catalog leaf, reference-time disclosure)

**Primary analog:** `plugins/lz-tdd/skills/lz-tpp/references/typescript-and-tco.md`
**Secondary analog:** `plugins/lz-tdd/skills/lz-tpp/references/fibonacci-worked-example.md`

**Contents-TOC for any leaf over ~100 lines** (from `fibonacci-worked-example.md` lines 18-28
and `typescript-and-tco.md` lines 24-42) -- anchor list at top so a large leaf is scannable:
```markdown
## Contents

- [Kata 1: sum of 1..n (linear recursion)](#kata-1-sum-of-1n-linear-recursion)
- [Kata 2: flatten a nested list (tree recursion)](#kata-2-flatten-a-nested-list-tree-recursion)
```

**Per-entry heading + interleaved prose + fenced code** (from `fibonacci-worked-example.md`
lines 59-73 -- one heading per unit, distilled prose, then a `ts` fence). Mirror this rhythm
for each refactoring's Motivation/Mechanics/Example:
```markdown
## Step 1 -- from nothing to a constant

Red test: `of(0)` should be `0`. There is no code at all yet.

Two transformations apply in sequence. First `({} -> nil)` #1 takes us from no code to a
body that employs a nothing-ish value; then `(nil -> constant)` #2 makes that value the
concrete constant `0`:

```ts
export function of(n: number): number {
  return 0;
}
```
```

**`tsc --strict`-clean fenced TS conventions** (from `typescript-and-tco.md` lines 88-98) --
CLAUDE.md JS/TS style is already honored here: braces always, blank line before `return`,
blank lines around control flow. Both `before` AND `after` fences must compile strict-clean
(a smell is a design issue, not a type error):
```ts
function sumIterative(n: number): number {
  let acc = 0;

  while (n !== 0) {
    acc = acc + n;
    n = n - 1;
  }

  return acc;
}
```

**Per-entry provenance inline tag** (D-06). No in-repo per-entry tag exists yet; the STRUCTURAL
placeholder is in 07-RESEARCH.md lines 280-296. Keep the tag on ONE line with the heading so a
line-oriented `rg` presence check does not false-negative (RESEARCH Pitfall 3):
```markdown
### <2nd-ed Name>  `[print+web]`
_Aliases (1st-ed): <alias>_
```

---

### `references/fowler-catalog/README.md` (index, reference-time routing)

**Analog:** the existing Phase-6 stub (fill against its own contract) + the citation idiom in
`lz-tpp/references/transformations.md`.

**Keep the oracle-blocking blockquote + thin-index framing** already in the stub
(`fowler-catalog/README.md` lines 1-11). Do NOT inline any entry content here (SKEL-04). The
"Per-entry content contract" block (stub lines 13-23) stays as the authored-against contract.

**Provenance legend** (D-06). No exact legend analog in-repo; closest idiom is the explicit
notation-normalization note in `transformations.md` lines 81-95 (a labeled bullet list that
tells the reader how to decode markers). The index legend follows that shape (template in
07-RESEARCH.md lines 265-274):
```markdown
## Provenance legend
- `[print+web]` -- in both the print and web editions.
- `[web-only]`  -- print-absent "+" entry (web edition only).
- `[web-example]` -- Split Phase: examples are online-only.
```

**Tag-group link list** -- one line per leaf, name + count + one-liner + relative link
(mirrors the `## Contents` anchor-list idiom; template in 07-RESEARCH.md lines 270-273):
```markdown
## Tag-groups
- [basic](basic.md) -- <count> entries: <one-line>
- [encapsulation](encapsulation.md) -- <count> entries: <one-line>
```

---

### `references/smells.md` (trigger-table, coach routing)

**Analog:** the Phase-6 stub contract (`smells.md` lines 11-19) + the GitHub-flavored table
syntax in `typescript-and-tco.md`.

**GFM table shape** (from `typescript-and-tco.md` lines 214-218 -- header row, separator row,
data rows; ASCII pipes). The smell table adds a `Source` column as the Phase-8 extension seam
(D-04); Phase 8 appends Kerievsky rows without editing Phase-7 rows:
```markdown
| Engine | Runtimes | ES6 proper tail calls |
|--------|----------|-----------------------|
| JavaScriptCore | Safari (and Bun) | YES (compat-table 2/2) |
```
Target row shape (07-RESEARCH.md lines 405-409):
```markdown
| Smell | Source | Candidate refactoring(s) | When to pick |
|-------|--------|--------------------------|--------------|
| <Smell name> | Fowler | [<Refactoring>](fowler-catalog/<tag-group>.md#<anchor>) | <one line> |
```

**Cross-link anchors must resolve.** `claude plugin validate` does NOT check body links
(RESEARCH Pitfall 5). Sequence smells.md AFTER the leaves (RESEARCH Open Question 3) and add a
link-resolution checker (see Shared Patterns). Keep each row on ONE line (Pitfall 3).

---

### `references/principles.md` (principles doc, reference-time disclosure)

**Analog:** the Phase-6 stub contract (`principles.md` lines 13-20) + the quote/attribution/
distilled-restatement structure in `transformations.md`.

**Distilled statement + explicit attribution per topic** (from `transformations.md` lines
39-58 -- each claim carries an inline source tag; and lines 107-116, the Sources section).
Because DST-04 forbids verbatim Fowler prose, prefer the DISTILLED-restatement voice (the
plain-language paraphrase transformations.md uses in lines 13-14, 23-25) over block quotes for
Fowler content. Attribution idiom to mirror (07-RESEARCH.md lines 415-421):
```markdown
## <Principle / topic>   -- Fowler, Refactoring 2nd ed, Ch.2
<distilled statement: what it means + when it applies, original words>
```
Topic-presence tokens each on one line (definition, two hats, rule of three, preparatory,
comprehension, litter-pickup, performance, YAGNI) so the `rg` topic gate (FWL-03) matches.

---

### Compile harness + checkers (build/validate tooling)

**Analog:** `.claude/skills/lz-refactor-workspace/tools/verify-scaffold.mjs` (the closest,
same-workspace precedent) and `.claude/skills/lz-tpp-workspace/eval-status.mjs`.

**Checker skeleton** (from `verify-scaffold.mjs` lines 1-36) -- shebang, `node:fs`/`node:path`,
`fileURLToPath` for repo-root resolution, a `report(ok, label, detail)` helper that increments a
failure counter and prints `[PASS]`/`[FAIL]`:
```javascript
#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "..", "..", "..", "..");

let failures = 0;
const report = (ok, label, detail) => {
  if (!ok) {
    failures++;
  }

  console.log(`  [${ok ? "PASS" : "FAIL"}] ${label}${detail ? " -- " + detail : ""}`);
};
```

**ASCII-only scan** for the hygiene gate (from `verify-scaffold.mjs` lines 102-112) -- reuse
verbatim; it returns the first non-ASCII byte offset or -1:
```javascript
const scanNonAscii = (p) => {
  const buf = fs.readFileSync(p);

  for (let i = 0; i < buf.length; i++) {
    if (buf[i] > 0x7f) {
      return i;
    }
  }

  return -1;
};
```

**Recursive `.md` walk** for gating every reference file (from `verify-scaffold.mjs` lines
114-132) -- the completeness/link checker walks `references/fowler-catalog/*.md` the same way.

**Terminal `SUMMARY:` line + non-zero exit** (from `verify-scaffold.mjs` lines 239-247 and
`eval-status.mjs` lines 70-72) -- the FWL-04 harness and every checker end this way so a wave
merge can gate on exit code:
```javascript
if (failures === 0) {
  console.log("SUMMARY: all checks PASSED -- scaffold is GREEN (SC1-SC4)");
  process.exit(0);
}

console.log(`SUMMARY: ${failures} check(s) FAILED -- scaffold incomplete`);
process.exit(1);
```

**`exists`/`nonEmpty` helpers** (from `eval-status.mjs` lines 27-34) -- small, throwaway,
no framework:
```javascript
const exists = (p) => fs.existsSync(p);
const nonEmpty = (p) => {
  try {
    return fs.statSync(p).size > 0;
  } catch {
    return false;
  }
};
```

**tsconfig.json** -- NO in-repo analog (no `tsconfig.json` is tracked; verified via
`git ls-files`). Use the content supplied by 07-RESEARCH.md lines 313-327 as-is (strict:true,
noEmit:true, target es2021, module esnext, moduleResolution bundler, no `dom` lib). This is
net-new tooling code, not copied from an analog.

**extract-samples.mjs** -- no fence-extractor exists in the repo; only the checker IDIOM above
is the analog. The behavior sketch is 07-RESEARCH.md lines 423-428: walk `fowler-catalog/*.md`,
write each ` ```ts ` fence to `samples/<file>-<n>.ts` (one module per fence to avoid
before/after symbol collisions), skip ` ```ts ignore ` fences, append `export {}` to force
module scope, then run `tsc --strict --noEmit`.

## Shared Patterns

### ASCII-only + arrow normalization
**Source:** `lz-tpp/references/transformations.md` lines 81-95 (explicit arrow-normalization
note) and `verify-scaffold.mjs` lines 102-112 (`scanNonAscii`).
**Apply to:** every authored Markdown file AND every `ts` fence.
Use `->` not the arrow glyph, `--` not em/en dash, straight quotes, literal `...`. Elevated
risk here because the oracle is an e-book with rich typography (RESEARCH Pitfall 4). Gate with
the `scanNonAscii` walk over all touched files.

### Provenance / citation discipline (DST-04)
**Source:** `lz-tpp/references/transformations.md` -- the Verbatim-vs-distilled split (lines
5-14 label a verbatim TPP quote; lines 13-14, 23-25 give the distilled restatement) and the
Sources section (lines 107-116, per-item "Source of:" attribution).
**Apply to:** all catalog leaves, README legend, smells.md, principles.md.
Fowler content is DISTILLED in original words (NO verbatim prose or code, DST-04) -- unlike
transformations.md which is allowed to quote the public TPP posts. Keep the transformations.md
attribution DISCIPLINE (label the source per claim); drop the block-quote voice for Fowler.

### Contents TOC for files over ~100 lines
**Source:** `fibonacci-worked-example.md` lines 18-28; `typescript-and-tco.md` lines 24-42.
**Apply to:** any tag-group leaf that exceeds ~100 lines and the smells/principles files if long.

### One token per line for `rg`-gated content
**Source:** RESEARCH Pitfall 3 (recurring Phase 2/3 lesson); enforced by the presence checkers.
**Apply to:** entry headings, provenance inline tags, smell rows, cross-link anchors, principle
topic tokens. A soft-wrapped required token false-negatives a line-oriented gate.

### Throwaway checker idiom (not a framework)
**Source:** `verify-scaffold.mjs` (whole file) + `eval-status.mjs` (whole file).
**Apply to:** the FWL-01 completeness checker, the FWL-02/03 cross-link/topic checker, the
hygiene (ASCII + work-email allowlist) checker, and the FWL-04 extractor+tsc driver.
Node builtins only, `report`/`exists`/`nonEmpty` helpers, terminal `SUMMARY:` + non-zero exit.
No new runtime dependency (RESEARCH Standard Stack); the only package is `typescript` in the
workspace.

### Workspace is non-shipped + gitignored-record
**Source:** `.gitignore` lines for `.claude/skills/*-workspace/**/` (tracks tools/, `.mjs`,
config; ignores `outputs/`, caches, stream dumps) and the tracked
`lz-refactor-workspace/tools/verify-scaffold.mjs`.
**Apply to:** the harness. Keep tsconfig/package.json/`extract-samples.mjs`/checkers OUT of the
shipped skill dir (`plugins/lz-tdd/...`) so `claude plugin validate` sees pure Markdown
(RESEARCH Anti-Patterns). NOTE: the generated `samples/` dir is NOT currently covered by
`.gitignore` -- the harness plan must add a `samples/` ignore entry (or nest it under an
already-ignored path) so generated `.ts` modules are not committed.

## No Analog Found

Files with no close in-repo match (planner uses the exact content/config in 07-RESEARCH.md
instead of copying an analog):

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `.claude/skills/lz-refactor-workspace/tsconfig.json` | config | build | No `tsconfig.json` tracked anywhere in repo (`git ls-files` empty). Content is net-new; supplied verbatim by RESEARCH lines 313-327. |
| `.claude/skills/lz-refactor-workspace/package.json` | config | build | No `package.json` tracked in repo (zero-dep repo). Optional pin of `typescript@6.0.3` + a `typecheck` script. |
| `extract-samples.mjs` | build tooling | build | No fence-extractor precedent (Phase 3 used ad-hoc, non-committed extraction). Only the checker IDIOM (verify-scaffold.mjs) transfers; the extract-and-write logic is net-new (sketch: RESEARCH lines 423-428). |

## Metadata

**Analog search scope:** `plugins/lz-tdd/skills/lz-tpp/references/`,
`plugins/lz-tdd/skills/lz-refactor/references/` (Phase-6 stubs),
`.claude/skills/lz-refactor-workspace/`, `.claude/skills/lz-tpp-workspace/`, repo `.gitignore`,
`git ls-files` for tracked TS/JSON config.
**Files scanned (fully read):** 8 -- 07-CONTEXT.md, 07-RESEARCH.md, transformations.md,
typescript-and-tco.md, fibonacci-worked-example.md, fowler-catalog/README.md (stub), smells.md
(stub), principles.md (stub), verify-scaffold.mjs, eval-status.mjs.
**Pattern extraction date:** 2026-07-04
