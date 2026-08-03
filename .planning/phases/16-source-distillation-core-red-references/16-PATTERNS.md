# Phase 16: Source Distillation & Core RED References - Pattern Map

**Mapped:** 2026-07-19
**Files analyzed:** 8 (4 created dev-only, 3 modified shipped Markdown, 1 modified checker)
**Analogs found:** 8 / 8 (every file is a copy-or-mirror of a proven 0.0.2 artifact)

This phase is COPY + REPOINT + one additive extension, not invention. The entire validation
apparatus already exists as a proven lz-refactor-workspace recipe; the three shipped references
mirror the no-oracle flat-reference grain of `beck-tdd-by-example.md`. No file here has a novel
shape.

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `.claude/skills/lz-red-workspace/extract-samples.mjs` (new) | utility (build/compile gate) | batch / file-I/O + transform | `.claude/skills/lz-refactor-workspace/extract-samples.mjs` | exact (copy + repoint) |
| `.claude/skills/lz-red-workspace/tsconfig.json` (new) | config | n-a | `.claude/skills/lz-refactor-workspace/tsconfig.json` | exact (copy, 0-1 edit) |
| `.claude/skills/lz-red-workspace/package.json` (new) | config | n-a | `.claude/skills/lz-refactor-workspace/package.json` | exact (copy + add vitest dep) |
| `.claude/skills/lz-red-workspace/tools/check-red-references.mjs` (new) | utility (completeness checker) | batch / transform (accumulate-then-exit) | `tools/check-backing.mjs` (+ fence idiom from `tools/check-catalog.mjs`) | exact (same checker idiom) |
| `plugins/lz-tdd/skills/lz-red/references/three-laws-and-test-selection.md` (modify) | reference (shipped docs) | static content | `references/beck-tdd-by-example.md` (grain + firewall) + `fowler-catalog/extract-function.md` (fence) | role + content-shape |
| `plugins/lz-tdd/skills/lz-red/references/test-structure-and-assertions.md` (modify) | reference (shipped docs) | static content | same as above | role + content-shape |
| `plugins/lz-tdd/skills/lz-red/references/naming.md` (modify) | reference (shipped docs) | static content | same as above | role + content-shape |
| `.claude/skills/lz-refactor-workspace/tools/check-hygiene.mjs` (modify) | utility (hygiene gate) | batch / scan | itself (extend targets) | exact (self-modify, additive) |

## Pattern Assignments

### `.claude/skills/lz-red-workspace/extract-samples.mjs` (new; utility, batch)

**Analog:** `.claude/skills/lz-refactor-workspace/extract-samples.mjs` -- COPY verbatim, change exactly
two things: (1) the source-dir constant, (2) the SUMMARY label token (`FWL-04` -> a lz-red token).

**The one structural change -- swap the multi-CATALOG walk for a FLAT refs walk** (analog lines 18-29):

The analog walks five catalog SUBDIRECTORIES and namespaces sample filenames by catalog prefix:
```javascript
const REFERENCES = path.join(repoRoot, "plugins", "lz-tdd", "skills", "lz-refactor", "references");
const CATALOGS = [
  { dir: path.join(REFERENCES, "fowler-catalog"), prefix: "fowler" },
  { dir: path.join(REFERENCES, "kerievsky-catalog"), prefix: "kerievsky" },
  // ...gof, extra, functional
];
```
lz-red references are FLAT files directly under one dir (no catalog subdirs). Repoint at that one dir
and drop the per-catalog prefix loop -- `walkMd` already recurses, so a single root covers the flat
refs plus the `testing-stance/` subdir stubs (which carry zero `ts` fences in Phase 16, so they are
harmless no-ops):
```javascript
const REFERENCES = path.join(repoRoot, "plugins", "lz-tdd", "skills", "lz-red", "references");
// then: for (const file of walkMd(REFERENCES)) { ... }  // sample name = `${leaf}-${n}.ts`
```

**Copy these mechanics UNCHANGED (they already solve every hazard):**

- Module-scope forcing (analog lines 138-142): fences that DON'T already start with `import`/`export`
  get `export {}` appended. Critical for lz-red: a fence that DOES `import { it, expect } from 'vitest'`
  is already a module, so nothing is appended and it stays self-contained. This is why the Vitest-import
  fences "just work" with no extractor change.
- Empty-catalog vacuous GREEN (analog lines 155-160): `extracted === 0` reports GREEN and exits 0. This
  is WHY the tsc gate is NOT the RED baseline -- the stubs have 0 fences, so tsc is already GREEN-on-empty.
  The RED signal must come from `check-red-references.mjs` (see below).
- Unterminated-fence fail-loud (analog lines 91-121), `ts ignore` skip+count (lines 130-133), fresh
  `samples/` each run (lines 97-102), the `tsc --strict --noEmit -p tsconfig.json` spawn (lines 162-166).

**tsc spawn (copy verbatim, analog lines 162-166):**
```javascript
const result = spawnSync("tsc", ["--strict", "--noEmit", "-p", "tsconfig.json"], {
  cwd: here,
  stdio: "inherit",
  shell: true,
});
```

---

### `.claude/skills/lz-red-workspace/tsconfig.json` (new; config)

**Analog:** `.claude/skills/lz-refactor-workspace/tsconfig.json` -- COPY verbatim (all 13 lines):
```json
{
  "compilerOptions": {
    "strict": true,
    "noEmit": true,
    "target": "es2021",
    "module": "esnext",
    "moduleResolution": "bundler",
    "lib": ["es2021"],
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["samples/**/*.ts"]
}
```

**The Vitest-types decision (RESEARCH Pitfall 4, Open Question 2) -- planner picks ONE:**
- **Option A (recommended, zero tsconfig edit):** `moduleResolution: "bundler"` already resolves a bare
  `import { describe, it, expect } from 'vitest'` from `node_modules` once `vitest` is a devDep + `npm install`
  has run. `skipLibCheck: true` (already present) keeps Vitest's own `.d.ts` from adding noise. So Option A
  is "copy tsconfig unchanged, install vitest, use explicit imports in fences." Most honest teaching.
- **Option B (one edit):** add `"types": ["vitest/globals"]` to `compilerOptions` for ambient `describe`/`it`
  with no per-fence import. Still needs vitest installed; hides where the API comes from. Only if fences
  omit imports.

Recommend Option A -- it keeps the copied config byte-identical and the fences self-documenting.

---

### `.claude/skills/lz-red-workspace/package.json` (new; config)

**Analog:** `.claude/skills/lz-refactor-workspace/package.json` -- COPY, change name + description + scripts +
add the vitest devDep. The analog:
```json
{
  "name": "lz-refactor-workspace",
  "private": true,
  "type": "module",
  "description": "NON-shipped compile harness + checker battery ...",
  "scripts": {
    "typecheck": "node extract-samples.mjs",
    "check": "node tools/check-catalog.mjs && ... && node tools/check-backing.mjs"
  },
  "devDependencies": {
    "typescript": "6.0.3"
  }
}
```

**lz-red target shape (copy + edit):**
```json
{
  "name": "lz-red-workspace",
  "private": true,
  "type": "module",
  "description": "NON-shipped compile + completeness gate for the lz-red RED references (SEL/STR/NAME). Not part of the shipped plugin.",
  "scripts": {
    "typecheck": "node extract-samples.mjs",
    "check": "node tools/check-red-references.mjs"
  },
  "devDependencies": {
    "typescript": "6.0.3",
    "vitest": "4.1.10"
  }
}
```
- `private: true` + `type: module` are load-bearing -- keep both (ESM `.mjs`, never published).
- Pin EXACT versions (no `^`/`~`) -- RESEARCH Package Legitimacy audit requires it; both are `too-new`
  false positives, no postinstall, dispositioned APPROVED.

---

### `.claude/skills/lz-red-workspace/tools/check-red-references.mjs` (new; utility, accumulate-then-exit)

**Analog:** `.claude/skills/lz-refactor-workspace/tools/check-backing.mjs` -- this is the DIRECT template
(same "per-file topic-token presence + no-scaffold-phrase + SUMMARY + exit(0|1)" model, RED-on-stubs by
design). Borrow the `>= 1 ts fence` assertion idiom from `check-catalog.mjs`.

**Copy the failure-counter + report() idiom verbatim (analog check-backing lines 76-84):**
```javascript
let failures = 0;

const report = (ok, label, detail) => {
  if (!ok) {
    failures++;
  }

  console.log(`  [${ok ? "PASS" : "FAIL"}] ${label}${detail ? " -- " + detail : ""}`);
};
```

**Copy the SUMMARY + exit tail verbatim (analog check-backing lines 118-124), retoken to a lz-red id.**

**Copy the FILES-with-topics data model (analog check-backing lines 34-71)** -- one entry per reference,
each with a `name` + `topics: [{ label, re }]` list of case-insensitive line-matching patterns, plus the
per-file scan loop (analog lines 92-114). Adapt topics to the RESEARCH assertion table:

| Ref | Content-present topics (turn GREEN when filled) | Guard token (must REMAIN present) |
|-----|--------------------------------------------------|-----------------------------------|
| `three-laws-and-test-selection.md` | test list; one (small/single) step; degenerate/starter/empty/zero/null; triangulat*; the lz-tpp GREEN firewall sentence | `Populated in Phase 18` / LAW / SEAM marker still present |
| `test-structure-and-assertions.md` | arrange-act-assert; given-when-then; assert-first; evident data; one concept | `Populated in Phase 17` / ASRT marker still present |
| `naming.md` | should; behavior; Osherove / three-part; match (house/stance) | none (fully Phase 16; marker fully resolved) |

**Two additions over the bare check-backing template:**

1. **`>= 1 ts fence` per ref** -- borrow from `check-catalog.mjs` line 277. A file-level regex is enough
   (these are flat refs, not catalog leaves needing a specific `## Example` section):
   ```javascript
   if (!/```(ts|typescript)\b/.test(text)) {
     missing.push(">= 1 ts fence");
   }
   ```
2. **Scaffold-phrase guard = the RED->GREEN engine.** Import the shared set and assert NONE leak
   (analog check-backing lines 24 + 112-113):
   ```javascript
   import { SCAFFOLD_RES } from "./lib/scaffold-phrases.mjs";  // copy lib/ into the new workspace, or import across
   const scaffold = SCAFFOLD_RES.find((re) => re.test(text));
   report(!scaffold, `${name}: no scaffold phrase`, scaffold ? `matches ${scaffold}` : "");
   ```
   `SCAFFOLD_RES` (`lib/scaffold-phrases.mjs` line 8) includes `/\bplaceholder\b/i`. Every stub today has a
   `## Sources (placeholder)` heading (VERIFIED: all three stubs, line 36 / 33 / 29), so this assertion is
   RED now and flips GREEN the instant authoring removes the `(placeholder)` heading. That IS the Nyquist
   instrument-first baseline.

**Deferral-guard nuance (co-edited refs, RESEARCH Pattern 3 + Anti-Patterns):** the `naming.md` stub has
NO later-phase marker (fully Phase 16) but the other two MUST retain their `Populated in Phase 17/18`
marker AND, unavoidably, their `## Sources (placeholder)` heading names a later phase. Since the scaffold
guard trips on `placeholder`, the fill MUST rewrite `## Sources (placeholder)` to a real `## Sources`
section while KEEPING a distinct `Populated in Phase 17/18` deferral sentence elsewhere (the co-edit
marker), so the guard passes but the seam is preserved. Assert the deferral token as a separate
must-remain `report(...)` on those two files.

**Path depth:** the analog resolves `repoRoot` as `here, "..", "..", "..", ".."` (tools -> workspace ->
skills -> .claude -> root, check-backing line 28). A `lz-red-workspace/tools/` checker has the SAME depth,
so copy the `repoRoot` line unchanged.

---

### `plugins/lz-tdd/skills/lz-red/references/three-laws-and-test-selection.md` (modify; fill SEL slice)

**Analog:** `plugins/lz-tdd/skills/lz-refactor/references/beck-tdd-by-example.md` -- the exact no-oracle
flat-reference grain AND the load-bearing triangulation RED/GREEN firewall precedent.

**No-oracle provenance block to mirror (analog lines 9-11)** -- the top-of-file tag every no-oracle
surface carries; `check-hygiene` no-verbatim + the phase's no-oracle discipline both key off this:
```markdown
> No-oracle reference: high-confidence CORE only (no owned book to verify against). Original prose, no
> verbatim Beck prose or code (DST-04). NAMES of techniques are kept verbatim as facts; every
> definition below is written in original words.
```
(For lz-red the owned RCM/Metz rationale threads ALSO get the oracle-reviewer gate; keep the existing
stub's dual tagging -- "owned; oracle-verified" for RCM/Metz, "no-oracle" for Beck/Wake/North/Osherove.)

**Triangulation firewall -- COPY THE SHAPE of analog lines 39-51** (this is the SC-2 / D-06 load-bearing
boundary; RESEARCH Pitfall 5 flags it as the highest content risk). The analog states the firewall from
the refactor side; lz-red states it from the RED side. Analog precedent:
```markdown
Beck names three ways to get from red to green. They belong to the green step (lz-tpp / TPP chooses
among them); the coach mentions them only to locate the seam.
...
- Triangulate: when the right generalization is unclear, add a second and third example so that only
  the real abstraction fits all of them; let the extra cases pull the general solution out of you.
```
lz-red's SEL-02 must invert this: triangulation here SELECTS the next failing test (RED facet); the
generalization of production code is lz-tpp's GREEN job. State the firewall sentence EXPLICITLY.

**tsc-strict own-words fence shape** -- mirror `fowler-catalog/extract-function.md` lines 37-67: a
```ts fenced block written in original code, tsc-strict clean, illustrating the principle (here a
failing/degenerate-case test). Phase-16 fences ADD `import { describe, it, expect } from 'vitest'` at
the top (extract-function.md fences have no test-framework import; lz-red fences do -- that import makes
the fence a self-contained module the extractor won't append `export {}` to).

**Fill vs LEAVE (D-04 / RESEARCH Pattern 3):** FILL the SEL slice (running test list, one small step,
degenerate/starter first, triangulation-for-selection). LEAVE the Three Laws spine + classify-first seam
as Phase-18 markers -- the stub's "Sub-topics in scope" list (lines 24-34) keeps the Three Laws / classify-first
headings as markers, NOT filled prose. Rewrite `## Sources (placeholder)` (line 36) to a real `## Sources`.

---

### `plugins/lz-tdd/skills/lz-red/references/test-structure-and-assertions.md` (modify; fill STR slice)

**Analog:** same two -- `beck-tdd-by-example.md` (grain + no-oracle tag) and `extract-function.md` (fence).

**Content shape:** named `##` sections in original words, each carrying the stub's per-entry contract
(Rule / When-to-use / Distilled rationale, stub lines 16-20). FILL STR-01 (AAA + GWT as ONE three-part
skeleton in TWO vocabularies, design-agnostic, match the house idiom -- D-07/SC-3) and STR-02 (assert-first,
evident data, one-concept-per-test -- D-08). LEAVE F.I.R.S.T. + Khorikov four pillars as Phase-17 markers
(stub lines 29-31). Add >= 1 tsc-strict Vitest fence (an AAA/GWT-labeled `it('should ...')` pair).

**Vitest expect surface already proven in-repo:** `references/typescript-and-tco.md` lines 57-62 shows
`expect(sum(0)).toBe(0)` fences compiling tsc-strict clean in the lz-tpp tree -- the exact minimal
`expect().toBe()` surface D-10 limits Phase 16 to. Difference: lz-tpp fences run WITHOUT an import (they
were never tsc-gated against Vitest types); lz-red fences MUST `import ... from 'vitest'` so the new
workspace's tsc gate resolves the types (RESEARCH Pitfall 4).

---

### `plugins/lz-tdd/skills/lz-red/references/naming.md` (modify; fill fully, NAME-01)

**Analog:** same two. This ref has NO later-phase co-edit marker -- fill entirely and resolve its marker
fully (stub lines 8-9 name only Phase 16). FILL: behavior/"should" naming PRIMARY (North), Osherove
three-part `UnitOfWork_StateUnderTest_ExpectedBehavior` as documented ALTERNATIVE, "match the codebase's
existing naming stance" (D-09/SC-4). Owned rationale thread: Metz name-the-behavior-not-the-method (99
Bottles JS Ed -- oracle-gated). Add >= 1 tsc-strict fence showing a "should"-named test.

**DST-04 near-verbatim hazard (RESEARCH Pitfall 1):** the canonical one-liners here -- Osherove's
three-part convention, the BDD "should" sentence -- reconstruct near-verbatim in a blind draft. Names/
acronyms are statable as facts; sentence-level phrasing must be original from the first draft. This is
the repo's recurring trap (MEMORY: pattern-leaf Intent near-verbatim DST-04). Owned Metz surface takes
the oracle-reviewer gate; ALL surfaces take the no-verbatim scan.

---

### `.claude/skills/lz-refactor-workspace/tools/check-hygiene.mjs` (modify; EXTEND targets)

**Analog:** itself. Additive, non-weakening -- add the lz-red tree to BOTH target sets, mirroring the
existing lz-refactor / lz-tpp push blocks. Do NOT restructure the checker.

**Add lz-red path constants next to the existing skill-dir consts (near analog lines 20-27):**
```javascript
const LZ_RED_SKILL_DIR = path.join(repoRoot, "plugins", "lz-tdd", "skills", "lz-red");
const LZ_RED_SKILL_MD = path.join(LZ_RED_SKILL_DIR, "SKILL.md");
const LZ_RED_REFERENCES = path.join(LZ_RED_SKILL_DIR, "references");
```

**wideTargets (ASCII + work-email) -- append after the lz-tpp push (analog lines 100-106):**
```javascript
if (fs.existsSync(LZ_RED_SKILL_MD)) {
  wideTargets.push(LZ_RED_SKILL_MD);
}

wideTargets.push(...walkMd(LZ_RED_REFERENCES));
```

**verbatimTargets (no-verbatim DST-04) -- append after the lz-refactor REFERENCES push (analog lines 119-123).**
KEY DISTINCTION: lz-tpp is EXCLUDED from verbatimTargets (its `transformations.md` is cited-FibTPP by
design, analog lines 23-24 + 114-116). lz-red is the OPPOSITE -- clean-room own-words, NO cited-verbatim
exemption -- so lz-red DOES go into verbatimTargets:
```javascript
if (fs.existsSync(LZ_RED_SKILL_MD)) {
  verbatimTargets.push(LZ_RED_SKILL_MD);
}

verbatimTargets.push(...walkMd(LZ_RED_REFERENCES));
```

**Leave the allowlist + thresholds UNTOUCHED (analog lines 36-38):** `APPROVED_EMAILS` (the single public
gmail), `EMAIL_RE`, `QUOTE_THRESHOLD = 120`. The extension only widens the file set, never weakens a rule.

**Optional scan-floor hardening (analog lines 140-152):** the missing-anchor floor currently anchors on the
lz-refactor SKILL.md + both manifests. Adding `LZ_RED_SKILL_MD` as a fourth anchor would fail-loud if the
lz-red SKILL.md silently drops from the scan (a false-GREEN guard). Non-mandatory but cheap; planner's call.

## Shared Patterns

### Checker skeleton (accumulate-then-exit)
**Source:** every `tools/check-*.mjs`, canonical in `tools/check-backing.mjs` lines 76-124.
**Apply to:** `check-red-references.mjs`, and the `check-hygiene.mjs` edit inherits it.
```javascript
let failures = 0;
const report = (ok, label, detail) => {
  if (!ok) {
    failures++;
  }

  console.log(`  [${ok ? "PASS" : "FAIL"}] ${label}${detail ? " -- " + detail : ""}`);
};
// ... per-target asserts ...
if (failures === 0) {
  console.log(`SUMMARY: <ID> GREEN -- ...`);
  process.exit(0);
}

console.log(`SUMMARY: <ID> RED -- ${failures} check(s) FAILED`);
process.exit(1);
```
Conventions carried by ALL checkers: node builtins only (no deps), ESM `.mjs`, `repoRoot` via
`fileURLToPath` + `path.resolve(here, "..", ...)`, run-from-anywhere, RED-on-stubs by design.

### Shared draft-scaffold phrase set
**Source:** `tools/lib/scaffold-phrases.mjs` line 8 (`SCAFFOLD_RES`).
**Apply to:** `check-red-references.mjs` (import it). `## Sources (placeholder)` trips `/\bplaceholder\b/i`
-- this is the RED->GREEN completeness engine (RED while stubs carry `(placeholder)`; GREEN once filled).
Copy `lib/` into the new workspace OR import across workspaces via relative path; copying keeps the
workspace self-contained (recommended).

### No-oracle vs owned provenance tagging
**Source:** `references/beck-tdd-by-example.md` lines 9-11 (`> No-oracle reference: ...`) + `## Sources`
footer lines 62-66.
**Apply to:** all three shipped refs. Beck/Wake/North/Osherove surfaces = `no-oracle` tag + no-verbatim
scan only. RCM Clean Code / Metz 99 Bottles rationale threads = "owned; oracle-verified" + oracle-reviewer
gate + no-verbatim scan (D-02 / D-12). Main context NEVER reads `.oracle/` prose -- only the oracle /
oracle-reviewer agents do.

### tsc-strict own-words fence
**Source:** `fowler-catalog/extract-function.md` lines 37-67 (own-code ```ts fences, tsc-strict clean).
Vitest surface precedent: `lz-tpp/references/typescript-and-tco.md` lines 57-62 (`expect().toBe()`).
**Apply to:** every fence in all three shipped refs. Phase-16 delta vs the analogs: PREPEND
`import { describe, it, expect } from 'vitest';` so the fence is a self-contained module the extractor
leaves alone and the new workspace's tsc gate resolves types for. Minimal surface only (D-10) -- no
`it.todo` / `test.each` / `vi.*` (those are Phase 17).

### Triangulation RED/GREEN firewall (SC-2, load-bearing)
**Source:** `references/beck-tdd-by-example.md` lines 39-51 ("They belong to the green step (lz-tpp ...);
the coach mentions them only to locate the seam").
**Apply to:** the SEL-02 slice of `three-laws-and-test-selection.md`. Invert the framing to the RED side:
triangulation SELECTS the next failing test; production-code generalization is lz-tpp's GREEN job. An
explicit firewall sentence is mandatory (RESEARCH Pitfall 5).

## No Analog Found

None. Every file maps to a proven 0.0.2 artifact:
- The four new dev-only files are COPY + REPOINT of the lz-refactor-workspace recipe.
- `check-red-references.mjs` is a near-verbatim mirror of `check-backing.mjs` (both are RED-on-stubs
  presence checkers) with a fence assertion borrowed from `check-catalog.mjs`.
- The three shipped references mirror `beck-tdd-by-example.md` (grain, no-oracle tag, firewall) and
  `extract-function.md` (fence shape).
- The `check-hygiene.mjs` edit is a self-additive target extension.

The only genuinely NEW mechanical concern (no prior analog) is the Vitest-types resolution for fences
(RESEARCH Pitfall 4) -- solved by adding `vitest` as a workspace devDep; the extractor and tsconfig need
no structural change to accommodate it.

## Metadata

**Analog search scope:** `.claude/skills/lz-refactor-workspace/` (extract-samples.mjs, tsconfig.json,
package.json, tools/check-backing.mjs, tools/check-catalog.mjs, tools/check-hygiene.mjs,
tools/lib/scaffold-phrases.mjs, tools/lib/heading-scan.mjs); `plugins/lz-tdd/skills/lz-red/references/`
(the three stubs); `plugins/lz-tdd/skills/lz-refactor/references/` (beck-tdd-by-example.md,
fowler-catalog/extract-function.md); `plugins/lz-tdd/skills/lz-tpp/references/` (typescript-and-tco.md).
**Files scanned:** 13 (read fully in-context).
**Clean-room compliance:** no `.oracle/` file was read (DST-04); structure/grain analogs only.
**Pattern extraction date:** 2026-07-19
