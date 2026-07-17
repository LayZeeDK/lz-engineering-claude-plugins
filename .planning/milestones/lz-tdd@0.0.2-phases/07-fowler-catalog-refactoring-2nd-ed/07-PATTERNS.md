# Phase 7: Fowler Catalog (Refactoring, 2nd ed) - Pattern Map

**Mapped:** 2026-07-04 / **Re-mapped + synthesized:** 2026-07-05 (scope-correction re-plan)
**Files analyzed:** 8 target categories (62 refactoring leaves + chapter-grouped index + 24 smell
leaves + navigation-only smell index + principles + overhauled/new checkers + KEPT harness config +
the two clean-room agent instruments)
**Analogs found:** 8 strong in-repo analogs / 8 categories (every new file type has an exact or
role-match analog; the two net-new categories from the 2026-07-04 map -- tsconfig/package.json/
extract-samples -- are now BUILT, so they are KEPT precedent rather than no-analog)

> ## SYNTHESIS STATUS (read first)
>
> This re-map integrates the 2026-07-05 scope-correction re-plan (per-refactoring-leaf model,
> two-tier smells, clean-room loop) with the 2026-07-04 base map. The base map assumed TAG-GROUP
> leaves, a 66-name catalog checker, a single smell TABLE, a 5-entry `[web-only]` set, and
> AskUserQuestion oracle access. All five are superseded. What carries forward unchanged: the
> throwaway-checker idiom, the ASCII/hygiene scan, the compile-harness (one-module-per-fence) design,
> and the content-format lineage (compact before->after; distilled-original-words voice).
>
> | Base map mapping | Status | What changed |
> |------------------|--------|--------------|
> | `fowler-catalog/<tag-group>.md` (~7-20 leaves, `###` entry headings) | **SUPERSEDED** | ONE leaf per refactoring (62 files), `# <Name>` level-1 heading; file identity = the entry |
> | README index = provenance legend + tag-group link list | **SUPERSEDED** | Chapter-grouped index (Ch.6-12), 62 rows, mirrored `Use when:`, 2-marker legend |
> | `smells.md` = single Fowler-24 trigger TABLE (Source column) | **SUPERSEDED** | Two-tier: 24 smell LEAVES (candidates live here) + navigation-only recognize-by index |
> | check-catalog: 66 names, `###` headings, 5 `[web-only]` | **SUPERSEDED (overhaul 07-02)** | 62 names, per-file leaf, `[web-only]`={Return Modified Value}, `[web-example]`={Split Phase}, + `Use when:` + index-mirror |
> | check-smells: count 24 Fowler table rows + candidate links | **SUPERSEDED (overhaul 07-02)** | 24 smell leaves in `smells/`, navigation-only index, candidate-link resolution |
> | AskUserQuestion oracle blockquotes in the stubs | **SUPERSEDED** | Clean-room `oracle`/`oracle-reviewer` loop; the FILL rewrites drop those blockquotes |
> | `principles.md` = Phase-6 stub | **NOW BUILT (07-03, oracle-converged)** | It is now the STRONGEST same-skill analog for leaf voice + cross-link idiom |
> | tsconfig / package.json / extract-samples = no-analog net-new | **NOW BUILT (07-01)** | KEPT precedent; leaf/checker categories copy from them, not from RESEARCH text |
> | Harness checker idiom, `scanNonAscii`, module-per-fence, SUMMARY+exit | **KEPT** | Unchanged; all new checkers copy it |

This is a Markdown skill-authoring phase with a non-shipped Node checker battery + a `tsc --strict`
compile harness. "Role" below is a documentation/tooling role, not a controller/service role. "Data
flow" is the disclosure path (SKILL -> index -> leaf) or the build/validate path each file joins.

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `references/fowler-catalog/<slug>.md` (NEW x62) | refactoring leaf | reference/coach disclosure (SKILL -> README -> leaf) | `principles.md` (same skill, oracle-converged voice + cross-links) + `lz-tpp/.../fibonacci-worked-example.md` (heading+prose+compact fence rhythm) + `typescript-and-tco.md` (tsc-strict fences) | exact |
| `references/fowler-catalog/README.md` (FILL; stub superseded) | catalog index | reference routing (single SKILL pointer, chapter-grouped) | `fibonacci-worked-example.md` Contents anchor-list (18-28) + `transformations.md` Sources idiom (107-116) + `principles.md` "When to refactor" grouped-links (44-54) | role-match (no exact index analog) |
| `references/smells/<slug>.md` (NEW x24) | smell leaf | coach disclosure (smells.md -> smell leaf -> refactoring leaf) | refactoring-leaf analogs above + `principles.md` candidate-link idiom (44-51) | exact |
| `references/smells.md` (FILL; table stub superseded) | smell index (navigation-only) | coach routing (fuzzy recognize-by -> confirm) | `fibonacci-worked-example.md` Contents idiom + `principles.md` section+link shape | role-match |
| `references/principles.md` | principles doc | reference disclosure | ALREADY BUILT (07-03, oracle-converged) -- no new work; it is the template, not a target | done |
| `.../tools/check-catalog.mjs` (OVERHAUL 07-02) | validation tooling | validate (FWL-01: 62 identity + contract + provenance + index mirror) | itself (current file) + `verify-scaffold.mjs` `walkMd`/`report`/SUMMARY idiom | exact |
| `.../tools/check-smells.mjs` (OVERHAUL 07-02) | validation tooling | validate (FWL-02: 24 leaves + candidate resolution + nav-only index) | itself (`slugsFor`/link-resolution 33-145) + check-catalog `collectEntries` | exact |
| `.../tools/check-crossrefs.mjs` (NEW 07-02) | validation tooling | phase-gate validate (bidirectional smell<->refactoring, inverse-of, no self-ref, resolve) | `check-smells.mjs` `slugsFor` + `linkRe`/`anchorCache` (33-145) generalized | role-match (compose from check-smells machinery) |
| `.../tools/check-hygiene.mjs` | validation tooling | validate (ASCII + work-email + no-verbatim) | ALREADY BUILT (07-01) -- KEPT, unchanged | done |
| `.../tools/check-principles.mjs` | validation tooling | validate (FWL-03 topic presence) | ALREADY BUILT (07-01) -- KEPT, unchanged | done |
| `.../extract-samples.mjs` + `tsconfig.json` + `package.json` | build tooling / config | build (`tsc --strict --noEmit`) | ALREADY BUILT (07-01) -- KEPT; package.json `check` script gains check-crossrefs | done |
| `.claude/agents/oracle.md` + `oracle-reviewer.md` | authoring instrument (subagent) | clean-room author -> gate -> converge | ALREADY BUILT + converged -- the instruments the loop invokes; no new agent file | done |

**NOT touched:** `plugins/lz-tdd/skills/lz-refactor/SKILL.md`. Its pointers
(`references/fowler-catalog/README.md`, `references/smells.md`, `references/principles.md`) all still
resolve under the new structure (smell leaves live in a sibling `references/smells/` dir; the index
stays at `references/smells.md`). Confirmed by `verify-scaffold.mjs` Check 5/6 (5 distinct pointers,
all resolve) and 07-ROUTING-ARCHITECTURE lines 45-47.

## Pattern Assignments

### `references/fowler-catalog/<slug>.md` -- refactoring leaf (NEW x62)

**Primary analog (NEW this re-map):** `plugins/lz-tdd/skills/lz-refactor/references/principles.md`
-- the SAME skill, already oracle-converged (07-03). It demonstrates the exact voice, DST-04
distilled-original-words discipline, ASCII hygiene, and relative-cross-link idiom the leaves need.
This is a stronger analog than the cross-skill lz-tpp files the 2026-07-04 map had to rely on.
**Secondary analogs:** `lz-tpp/references/fibonacci-worked-example.md` (heading + distilled prose +
compact `ts` fence rhythm) and `lz-tpp/references/typescript-and-tco.md` (tsc-strict fence style).

**Leaf skeleton** -- one file per refactoring, `# <Name>` at level 1 (NOT `###` -- the tag-group
`###`-entry model is superseded). Contract from 07-ROUTING-ARCHITECTURE lines 51-70 and RESEARCH
Pattern 2:
```markdown
# <2nd-ed Name>

_Aliases (1st-ed): <alias>, <alias>_   <!-- omit if none -->

Use when: <one-line situation/seam -- MIRRORED verbatim into the index row>

## Motivation

<2-4 sentences, original words: the WHY>

## Mechanics

1. <verb-first imperative step, original words>
2. <... name the test/compile checkpoint inline where behavior-preservation lives>

## Example

```ts
// before: original, tsc --strict-clean
```
```ts
// after: original, behavior-preserving, tsc --strict-clean
```

## Watch for

- <0-3 bullets; may cross-link ../principles.md by NAMING the target section in link text>
```

**Distilled-original-words voice** (from `principles.md` lines 8-14, 24-33) -- restate the concept in
plain original words; NO verbatim Fowler prose or code (DST-04). `principles.md` is the calibrated
example of this voice at the exact fidelity the `oracle-reviewer` accepts:
```markdown
Refactoring (noun): reworking the internal structure of code without changing its observable
behavior, so the code reads more clearly for the next person and future edits take less effort.
```

**Compact before->after Example** (from `fibonacci-worked-example.md` lines 59-71 -- one heading,
distilled prose, then a `ts` fence). Hard cap 2 examples; prefer ONE 5-15-line-per-side pair. BOTH
`before` and `after` must compile `tsc --strict`-clean (a smell is a design issue, not a type error).

**tsc-strict fence conventions** (from `typescript-and-tco.md` lines 11-13 and the CLAUDE.md JS/TS
style already honored throughout lz-tpp): braces always, blank line before `return`, blank lines
around control flow, ASCII `->` only. The `extract-samples.mjs` harness writes each fence to its own
module and gates it -- see the harness section.

**Provenance labels** (D-06 LOCKED -- ONLY two): Return Modified Value carries `[web-only]`; Split
Phase carries `[web-example]`. Keep the tag on the SAME line as the `# <Name>` heading so the
line-oriented checker cannot false-negative (RESEARCH Pitfall 6). The 4 former "+" relics (Replace
Magic Literal, Replace Control Flag with Break, Replace Error Code with Exception, Replace Exception
with Precheck) are CUT -- do NOT author or label them.

**Leaf -> principles back-edge** (07-ROUTING-ARCHITECTURE lines 143-147): a `Watch for` bullet may
cross-reference a named `principles.md` section (e.g. Change Function Declaration -> the
atomic-boundary principle) rather than restating it. Gate text lives once in `principles.md` (hub);
leaves are spokes. Mirror `principles.md`'s own relative-link idiom (lines 44-51).

---

### `references/fowler-catalog/README.md` -- catalog index (FILL; stub superseded)

**Analog:** `fibonacci-worked-example.md` Contents anchor-list (lines 18-28) for the row shape;
`transformations.md` Sources section (lines 107-116) for the provenance legend idiom;
`principles.md` "When to refactor" grouped-links (lines 44-54) for chapter-grouped one-line entries.

**REWRITE the stub.** The current `fowler-catalog/README.md` (lines 1-37) is the superseded Phase-6
stub: it says "all 66", carries the AskUserQuestion oracle blockquote (lines 6-11), and defers the
split axis (lines 24-37). The FILL replaces all of it with a thin CHAPTER-GROUPED index. Do NOT
inline any leaf content (SKEL-04).

**Chapter-grouped row shape** (7 headings Ch.6-12; per entry = name + alias + mirrored `Use when:`
+ link; 07-ROUTING-ARCHITECTURE lines 71-73):
```markdown
## Ch.6 -- a first set of refactorings

- [Extract Function](extract-function.md) -- _Extract Method_ -- Use when: <mirrored one-line>
- [Inline Function](inline-function.md) -- Use when: <mirrored one-line>
```

**Provenance legend** (only two markers now):
```markdown
## Provenance legend
- `[web-only]`    -- verified against the web edition only (Return Modified Value).
- `[web-example]` -- the extended examples are online-only (Split Phase).
```
The `Use when:` text in each row is MIRRORED VERBATIM from the leaf and kept single-line (Pitfall 6);
`check-catalog` asserts the mirror.

---

### `references/smells/<slug>.md` -- smell leaf (NEW x24)

**Analog:** the refactoring-leaf analogs above (`principles.md` voice + `fibonacci` rhythm) plus
`principles.md`'s candidate-link idiom (lines 44-51 -- relative links into `fowler-catalog/<slug>.md`
with an inline discriminator).

**Smell-leaf skeleton** (07-ROUTING-ARCHITECTURE lines 75-80 / RESEARCH Pattern 3) -- candidates live
HERE (the smell->refactoring map), so the coach must confirm-via-leaf:
```markdown
# <Smell>

Recognize by: <one-line cue -- MIRRORED into the smells.md index>

## How to recognize

<fuller cues; separate near-neighbors so the coach does not mis-identify>

## Why it's a problem

<original words>

## Candidate refactorings

- [<Refactoring>](../fowler-catalog/<slug>.md#<anchor>) -- pick when <smell-specific discriminator>
```
Every candidate link is bidirectional-checked by `check-crossrefs` at the 07-10 gate; keep each on
one line. Anchor = the GitHub-style slug of the target leaf's heading (github-slugger rules; see the
harness section for the exact slug function).

---

### `references/smells.md` -- smell index (FILL; table stub superseded)

**Analog:** `fibonacci-worked-example.md` Contents idiom + `principles.md` section+link shape.

**REWRITE the stub.** The current `smells.md` (lines 1-25) is the superseded single-TABLE contract
("one trigger-table row ... Source tag ... candidate named refactorings", lines 12-19) with an
AskUserQuestion blockquote (lines 7-9). The FILL replaces it with a NAVIGATION-ONLY recognize-by
index -- NO candidates (deliberately, so it cannot shortcut the confirm tier), 07-ROUTING-ARCHITECTURE
lines 82-84:
```markdown
### Duplicated Code  -- recognize by: <one-line cue>

[Confirm + candidates](smells/duplicated-code.md)
```
Sequence `smells.md` and the smell leaves AFTER the catalog leaves exist (RESEARCH Open Question 1);
`check-crossrefs` resolves the candidate links only at the 07-10 phase gate.

---

### `references/principles.md` -- ALREADY BUILT (07-03, oracle-converged)

No new work. It is the CALIBRATION TEMPLATE for every leaf's voice/hygiene/cross-link idiom (see the
refactoring-leaf section). `check-principles.mjs` already gates its topic set (definition, two hats,
rule of three, preparatory, comprehension, litter-pickup, performance, YAGNI) and passes. If a leaf
adds a `Watch for` back-edge, verify the named `principles.md` section still exists (it does:
"How to refactor safely", "Limits and cautions" lines 57-89).

---

### `.../tools/check-catalog.mjs` -- OVERHAUL (07-02)

**Analog:** itself (`.claude/skills/lz-refactor-workspace/tools/check-catalog.mjs`) + the
`verify-scaffold.mjs` `walkMd`/`report`/`SUMMARY` idiom. The whole scaffold (shebang, `node:fs`,
`report()` lines 103-109, `walkMd` 119-137, terminal SUMMARY+exit 264-270) is KEPT. Three data
changes and one model change:

1. **Names 66 -> 62** (lines 20-87): remove the 4 cut relics -- Replace Magic Literal, Replace
   Control Flag with Break, Replace Error Code with Exception, Replace Exception with Precheck.
2. **`WEB_ONLY` set of 5 -> 1** (lines 90-96): keep ONLY `Return Modified Value`. `WEB_EXAMPLE`
   stays `{Split Phase}` (line 99).
3. **Entry model: `###` headings-within-a-file -> one leaf per refactoring** (SUPERSEDES
   `collectEntries` lines 143-181). New model: `walkMd(CATALOG)` skipping `README.md`; each leaf is
   ONE refactoring; derive the name from the leaf's `# <Name>` level-1 heading (strip a trailing
   `` `[...]` `` tag); assert exactly 62 leaves whose names equal the canonical set, no dupes, no
   unknown leaf.
4. **Contract per leaf** (extends lines 216-218): keep Motivation/Mechanics/`ts` fence, ADD a
   `Use when:` line presence check AND assert the index row in `README.md` mirrors that exact
   `Use when:` string (07-ROUTING-ARCHITECTURE lines 107-109). Provenance tag on the `# ` heading.

**RED-by-design baseline:** the checker must be RED against the empty/old catalog before the 62
leaves land (proves it works), then GREEN at 62/62 -- same discipline as the current header comment
(lines 6-8).

---

### `.../tools/check-smells.mjs` -- OVERHAUL (07-02)

**Analog:** itself -- specifically the `slugsFor` github-slugger function (lines 33-64) and the
link-resolution machinery (`linkRe`, `anchorCache`, resolve loop lines 110-145) are KEPT and REUSED.
The table-row counting (lines 80-108) is SUPERSEDED. New model:

1. Assert 24 smell LEAVES exist under `references/smells/` (walk the dir), each with a `Recognize by:`
   line and a `## Candidate refactorings` section.
2. Resolve every candidate link `](../fowler-catalog/<slug>.md#<anchor>)` against the target leaf's
   real anchors via `slugsFor` (REUSE lines 33-64) -- the exact idiom already in the file, path
   adjusted from `fowler-catalog/` to `../fowler-catalog/`.
3. Assert the navigation-only `smells.md` index has one recognize-by row + resolving leaf link per
   smell, and NO candidate links (nav-only invariant).

---

### `.../tools/check-crossrefs.mjs` -- NEW (07-02)

**Analog (compose, do not invent):** `check-smells.mjs` `slugsFor` (lines 33-64) + `linkRe`/
`anchorCache` resolution (lines 110-145) is the exact machinery. Generalize it across all reference
dirs and add the graph invariants (07-ROUTING-ARCHITECTURE lines 106-115 / RESEARCH FWL-02 map):

1. **Resolve** every `](...md#anchor)` cross-link in `fowler-catalog/*.md`, `smells/*.md`,
   `principles.md` against the target's github-slugger anchors (REUSE `slugsFor`).
2. **Bidirectional** smell<->refactoring: a smell leaf listing refactoring R as a candidate, and
   inverse-of refactoring pairs, must be declared MUTUALLY (RESEARCH Pitfall 2).
3. **No self-referential** links (a leaf linking itself).
4. **Phase-gate only:** run FULLY at 07-10, NOT per-wave -- during wave 3 cross-chapter links point at
   leaves that do not exist yet (RESEARCH Sampling Rate / Pitfall 1).

**Slug-drift guard (top fan-out risk):** the canonical name->slug map (kebab-case of the canonical
name) is pinned in the 07-02 pilot SUMMARY as the shared contract all wave-3 plans link against
(RESEARCH Pitfall 1 / Impact note 1). `check-crossrefs` catches misses at the gate.

---

### KEPT harness: `check-hygiene.mjs`, `check-principles.mjs`, `extract-samples.mjs`, `tsconfig.json`, `package.json`

All BUILT in 07-01 and unchanged by the scope correction. Copy nothing new; just note:

- **`check-hygiene.mjs`** -- `scanNonAscii` (lines 71-81), work-email allowlist (lines 23-24,
  110-123), no-verbatim WARN heuristic (lines 126-137). GREEN today. Elevated ASCII risk because the
  oracle is an e-book, but the firewall means the main context never sees it (residual risk = editor
  auto-format). No change.
- **`check-principles.mjs`** -- line-oriented topic presence (TOPICS lines 18-27; presence loop
  53-61). Matches the built `principles.md`. No change.
- **`extract-samples.mjs`** -- walks `fowler-catalog/*.md` recursively, `extractFences` (lines 50-80),
  one module per fence with `export {}` scope-forcing (lines 113-127), vacuous-GREEN on empty include
  (lines 131-136), `tsc --strict --noEmit -p tsconfig.json` (lines 138-142). Per-leaf model still
  walks correctly (each leaf's before/after fences become their own modules). No change.
- **`tsconfig.json`** -- strict, noEmit, target es2021, module esnext, moduleResolution bundler, lib
  es2021 (no `dom`), skipLibCheck, `include samples/**/*.ts`. No change.
- **`package.json`** -- `check` script (line 8) chains catalog+smells+principles+hygiene; ADD
  `check-crossrefs` to that chain when 07-02 creates it. `devDependencies.typescript` stays `6.0.3`.

---

### `.claude/agents/oracle.md` + `oracle-reviewer.md` -- authoring instruments (BUILT + converged)

No new agent file is created this phase. These ARE the clean-room subagent pattern the authoring loop
invokes; each leaf/smell/principles doc is authored BLIND then gated by `oracle-reviewer` before it is
considered done (07-ORACLE-MODEL "The loop"). Map for the planner:

- **`oracle-reviewer`** (`.claude/agents/oracle-reviewer.md`) -- GATE a drafted leaf. Input contract:
  `DRAFT_PATHS` (repo leaf paths), `SOURCE` (`.oracle/refactoring-2e/index.md` + chapter/topic),
  `CONTENT_TYPE` (`refactoring-leaf` -> axes mechanics/motivation/example/applicability/spirit;
  `smell-leaf` -> candidates/recognition/motivation/applicability/spirit; `principles`/other -> driver
  supplies axes+anchors). Returns a raw JSON array, one object per draft, verdict
  `pass|revise|blocked|error`. The round is CLEAN iff every entry is `pass` (or owner-accepted
  `blocked`) with no `error`.
- **`oracle`** (`.claude/agents/oracle.md`) -- OPEN-ENDED lookups (chapter membership, candidate set)
  in own words. Use for A2 chapter-placement confirmation before grouping an index row.
- **Driver responsibilities** (07-ORACLE-MODEL lines 158-190, NOT enforceable inside the agents):
  fan-out aggregation guard (dedupe/cap; no persisted full ordered name+chapter map); loop bound
  (~3 rounds) with owner escalation on non-convergence; pass the canonical per-axis anchors.

## Shared Patterns

### Throwaway checker idiom (not a framework)
**Source:** `verify-scaffold.mjs` (whole file) -- shebang, `node:fs`/`node:path`/`fileURLToPath`,
`repoRoot` resolved 4 levels up (lines 10-12), `report(ok, label, detail)` failure counter (lines
22-28), `isDir`/`walkMd` (lines 30-36, 114-132), terminal `SUMMARY:` + non-zero exit (lines 241-247).
Also `check-catalog.mjs` / `check-smells.mjs` / `check-hygiene.mjs` all mirror it.
**Apply to:** the overhauled check-catalog, the overhauled check-smells, the NEW check-crossrefs.
Node builtins only; NO new runtime dependency (the only package is `typescript` in the workspace).

### GitHub-slugger anchor resolution (cross-link checking)
**Source:** `check-smells.mjs` `slugsFor` (lines 33-64) + `linkRe`/`anchorCache` resolve loop (lines
110-145) -- lowercase, drop punctuation except word chars/space/hyphen, spaces->hyphens, duplicate
`-1/-2` suffixing.
**Apply to:** the overhauled check-smells AND the new check-crossrefs (both resolve `](...md#anchor)`
links against real headings). This exact function already exists; reuse it, do not re-derive.

### ASCII-only + arrow normalization
**Source:** `check-hygiene.mjs` `scanNonAscii` (lines 71-81); `transformations.md` arrow-normalization
note (lines 81-95); `principles.md` (ASCII-clean throughout, the built exemplar).
**Apply to:** every authored Markdown file AND every `ts` fence. Use `->` not the arrow glyph, `--`
not em/en dash, straight quotes, literal `...`. Gate with `check-hygiene`.

### DST-04 distilled-original-words discipline (no verbatim, no fabrication)
**Source:** `principles.md` (the whole file -- oracle-converged distilled voice, e.g. lines 8-14) is
now the in-repo exemplar; contrast `transformations.md` which is ALLOWED to block-quote the public TPP
posts (lines 5-14) -- Fowler content is NOT (it is copyrighted). The gate is the `oracle-reviewer`
near-verbatim axis + `check-hygiene` no-verbatim heuristic + Phase-10 scan.
**Apply to:** all 62 refactoring leaves, all 24 smell leaves, the two indexes. Author BLIND; the main
context never opens `.oracle/` (`ls` for names only -- RESEARCH Pitfall 4 / Anti-Patterns).

### Mirrored single-line selectors for line-oriented gates
**Source:** RESEARCH Pitfall 6 (recurring Phase 2/3 lesson); enforced by check-catalog (index mirror)
and check-principles (topic presence).
**Apply to:** the leaf `Use when:` line (mirrored VERBATIM into the index row), the smell `Recognize
by:` line (mirrored into the smell index), provenance tags on `# ` headings, cross-link anchors,
principle topic tokens. A soft-wrapped required token false-negatives the gate -- keep each on ONE
line.

### Clean-room author -> gate -> converge loop
**Source:** `.claude/agents/oracle.md` + `oracle-reviewer.md` (firewall contract + verdict schema);
07-ORACLE-MODEL (the loop, driver responsibilities, canonical anchors).
**Apply to:** every leaf/smell/principles authoring task -- author BLIND, spawn `oracle-reviewer`,
revise BLIND from directives, iterate to convergence (driver caps ~3 rounds; escalate `blocked`/
non-converge to the owner via AskUserQuestion per-entry checkpoint). This mechanizes the FWL-04
behavior-preserving clause (reviewer example axis) and the DST-04 gate.

### Workspace is non-shipped
**Source:** `.gitignore` `.oracle/` entry (line ~38) + the tracked `lz-refactor-workspace/tools/`.
**Apply to:** all checkers, the extractor, tsconfig, package.json -- keep them under
`.claude/skills/lz-refactor-workspace/` so `claude plugin validate` sees pure Markdown in the shipped
skill dir. The generated `samples/` dir is scrubbed fresh each run by extract-samples (lines 82-87).

## No Analog Found

None. Every new-structure file type maps to an in-repo analog:

- The 2026-07-04 "no analog" trio (tsconfig / package.json / extract-samples) is now BUILT (07-01) and
  KEPT verbatim -- they are precedent, not net-new.
- `check-crossrefs.mjs` is the only genuinely NEW checker, and it composes entirely from the existing
  `check-smells.mjs` slug/resolution machinery + the shared checker idiom -- no unprecedented logic.
- The refactoring/smell leaves and both indexes copy voice + structure from the now-built,
  oracle-converged `principles.md` and the lz-tpp reference files.

The only content with no code analog is the CATALOG CONTENT ITSELF (motivations, mechanics, smell
text) -- by design it is not copied from any analog; it is transcribed in original words through the
clean-room `oracle`/`oracle-reviewer` loop (07-ORACLE-MODEL). That is authoring, not a pattern gap.

## Metadata

**Analog search scope:** `plugins/lz-tdd/skills/lz-refactor/references/` (built principles.md +
superseded stubs + SKILL.md), `plugins/lz-tdd/skills/lz-tpp/references/` (content-format lineage),
`.claude/skills/lz-refactor-workspace/` (harness + 5 checkers + tsconfig + package.json),
`.claude/agents/` (oracle + oracle-reviewer).
**Files read this re-map (fully or targeted):** 15 -- 07-RESEARCH.md, 07-ROUTING-ARCHITECTURE.md,
07-ORACLE-MODEL.md, prior 07-PATTERNS.md, oracle.md, oracle-reviewer.md, check-catalog.mjs,
check-smells.mjs, check-hygiene.mjs, check-principles.mjs, extract-samples.mjs, tsconfig.json,
package.json, verify-scaffold.mjs, fowler-catalog/README.md (stub), smells.md (stub), principles.md
(built), SKILL.md, fibonacci-worked-example.md (head), typescript-and-tco.md (head),
transformations.md.
**Re-map date:** 2026-07-05

## Impact on the LOCKED plans

No required plan change -- the analogs hold. The re-map only re-points them at the correct, current
in-repo precedents and confirms the overhaul is mechanical, not architectural:

1. **[CONFIRMATION]** The three KEPT harness pieces (extract-samples/tsconfig/package.json) and two
   KEPT checkers (hygiene/principles) need NO touch; 07-02 overhauls only check-catalog + check-smells
   and adds check-crossrefs, exactly as the locked plans state. `check-crossrefs` composes from
   existing `check-smells` machinery -- low build risk.
2. **[ENRICHMENT -- for the 07-02 SUMMARY, no plan edit]** Pin the canonical name->slug map so the six
   wave-3 chapter plans link identical cross-ref targets (RESEARCH Pitfall 1 / Impact 1). This is the
   single highest fan-out risk; `check-crossrefs` is the phase-gate backstop.
3. **[UPGRADE noted, no plan edit]** `principles.md` graduated from a stub (base map) to the built,
   oracle-converged exemplar. The wave-2/3 leaf authors should calibrate leaf voice/hygiene/cross-link
   idiom against it directly -- a better, in-skill analog than the cross-skill lz-tpp files the base
   map used. Fold this into the 07-02 pilot calibration note.
