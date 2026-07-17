# Phase 9: Coach Behavior & Principle-Backing - Research

**Researched:** 2026-07-08
**Domain:** Markdown skill authoring (inline coach decision procedure + 3 no-oracle principle references) + node-builtin structural checker harness (instrument-first RED->GREEN) + carried-in fence-aware helper debt (IN-02)
**Confidence:** HIGH (all findings verified by reading the actual edit-target files and the four catalog checkers in this session; Beck/Feathers core is public-fact, no external fetch required)

## Summary

This is a wiring + authoring phase on top of catalogs that already exist and are GREEN. There is
no application runtime, no frontend, no database, no web framework, and no new external package.
Deliverables are three: (1) replace the `## Coach decision procedure (deferred to Phase 9)`
placeholder in `SKILL.md` with the real compact decision tree; (2) author three no-oracle
principle references (Beck *TDD by Example*, Beck *Tidy First?*, Feathers *Legacy Code* -- the last
already stubbed at `refactoring-without-tests.md`); (3) instrument a RED->GREEN structural gate
(`check-backing.mjs`), extend `check-crossrefs` to cover the new source files, and fold the
carried-in IN-02 fence-aware-heading debt into ONE shared `lib/` helper serving all four catalog
checkers.

The single most consequential measurement: **`SKILL.md` is 85 lines** (`wc -l`; 86 as an editor
counts a trailing line), against a `< 500`-line budget (SKEL-02 / D-02). A compact coach decision
tree is ~30-40 lines, landing the file near ~120-130. **The 500-line budget is not remotely at
risk, so the coach procedure goes INLINE (D-01) and the D-02 split-to-`coach-procedure.md` fallback
is NOT triggered.** Do not create `coach-procedure.md`.

**Primary recommendation:** Inline the coach procedure in `SKILL.md` (no split); add a NEW sibling
`check-backing.mjs` (do not overload `check-principles.mjs`); implement IN-02 as ONE new
`tools/lib/heading-scan.mjs` exporting a fence-aware `collectH1Lines(text)` imported by all four
catalog checkers; author all three principle refs with TS-fenced or fence-free examples (never
bash/yaml/toml with a column-0 `#`) so the fence gap stays dormant everywhere (D-11).

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions (verbatim from 09-CONTEXT.md `## Implementation Decisions`)

**Coach decision procedure (CCH-01..06)**
- **D-01:** The coach decision procedure lives INLINE in `SKILL.md`, replacing the existing "Coach decision procedure (deferred to Phase 9)" placeholder section. It is the skill's core auto-trigger behavior (not heavy catalog material), and the Phase 6 scaffold reserved this inline slot. Heavy content stays in `references/`.
- **D-02:** Router size budget guard -- `SKILL.md` MUST stay < 500 lines (SKEL-02). If the compact inline procedure would breach the budget, split ONLY the detailed decision tree into a new `references/coach-procedure.md` and keep a compact routing summary inline. The researcher/planner confirms the line count and picks inline-only vs inline-summary+ref.
- **D-03:** Coach routing source-of-truth is the EXISTING `smells.md` + smell leaves -- no new duplicate smell->refactoring table. The procedure adds only the routing dimension on top: mechanical smell -> Fowler refactoring; repeated / complex-structure smell -> Kerievsky pattern-directed refactoring; unwarranted pattern -> functional-catalog de-patterning; missing tests -> Feathers. Preserves the locked "navigation-only index -> open the leaf for candidates" design (check-smells enforces it).
- **D-04:** The procedure opens with the classify-the-request gate already framed in `SKILL.md` ("Refactoring vs the green step"): if a red test must be made to pass, that is lz-tpp (green step), not this skill. CCH-05 (the lz-tpp seam) extends the existing two-hats framing in `principles.md` -- do not re-derive it.
- **D-05:** CCH-06 functional-alternative surfacing routes to the `functional-catalog` (built in Phase 8.2). For a dissolvable pattern the coach names "pattern X disappears via FP idiom Y / TS feature Z" and follows the one-line `Functional alternative:` cross-links that already exist on the OO leaves; it also gives the Replace-Pipeline-with-Loop reverse-direction guidance (clarity is the default; reverse to a loop only on a measured hot path or a named house-style reason) already noted in the Fowler `replace-loop-with-pipeline.md` leaf.

**Principle-backing references (PRIN-01..03)**
- **D-06:** Beck *TDD by Example* (PRIN-01) and Beck *Tidy First?* (PRIN-02) each get their OWN no-oracle reference file, mirroring the standalone Feathers file (`refactoring-without-tests.md`, PRIN-03, already stubbed). `principles.md` stays the Fowler-oracle file and gains cross-ref pointers to the backing files. Preserves oracle/no-oracle provenance separation and DST-04 tagging. Exact filenames are the researcher/planner's call.
- **D-07:** All three principle references are tagged NO-ORACLE, high-confidence CORE only. Beck/Feathers have NO owned oracle AND NO committed research doc. The correctness anchor is therefore: high-confidence core scope only + skill-reviewer PASS + DST-04 hygiene (original prose, no verbatim book prose/code). Downstream planning MUST NOT open the Phase 6 D-09 AskUserQuestion oracle-access checkpoint for these -- there is no book to verify against (same posture as Phase 8.2 D-06).
- **D-08:** PRIN core scope is fixed by the roadmap SC #6 and REQUIREMENTS, do not expand: Beck TDD = cycle + two rules + Fake It / Triangulate / Obvious Implementation, scoped to seam context; Beck Tidy First? = structural-vs-behavioral separation + refactor economics (coupling / cohesion / options), cross-referenced to overlapping Fowler refactorings, no complete tidyings catalog claimed (FUT-01); Feathers = seams, characterization tests, the change algorithm, Sprout/Wrap Method+Class, Subclass and Override Method, Extract Interface (the stub's content contract already lists these).

**Harness gate (instrument-first) + carried-in tech debt**
- **D-09:** Add a structural checker gate for Phase 9 following the instrument-first / Nyquist pattern (RED baseline before content, GREEN when authored). It asserts: the 3 principle references exist; each carries its required core topic tokens (line-oriented, like `check-principles.mjs`); each carries the no-oracle tag; and the new coach cross-links resolve (via the existing `check-crossrefs`). Extend `check-principles.mjs` or add a sibling `check-backing.mjs` -- planner's call -- and wire it into `package.json`'s `npm run check` battery.
- **D-10:** Fold the carried-in Phase 08.2 tech debt IN-02 (make H1/heading detection fence-aware in a shared helper imported by check-gof / check-kerievsky / check-extra-patterns / check-functional, alongside `githubSlug`) INTO the checker plan of this phase. A per-checker patch is forbidden; do it once in the shared helper.
- **D-11:** Author principle-reference content to keep IN-02 dormant-safe regardless: prefer TS fences or fence-free prose; avoid non-TS fenced blocks (bash/yaml/toml/dockerfile) with a column-0 `#` line. If such a block is genuinely needed, D-10's fence-aware fix must already be in place first.

### Claude's Discretion (verbatim from 09-CONTEXT.md)
- **D-12:** Exact principle-reference filenames, the inline-vs-split decision for the coach procedure (gated on the 500-line budget), and extend-vs-new-file for the checker are HOW micro-decisions left to the researcher/planner within D-01/D-02/D-06/D-09.

### Deferred Ideas (OUT OF SCOPE -- verbatim from 09-CONTEXT.md)
- Full Beck *Tidy First?* tidyings catalog -- FUT-01, requires acquiring the book for oracle verification; this phase claims only the high-confidence core.
- Behavioral routing-accuracy evals (coach recommends the correct next refactoring, with-skill vs baseline) -- EVL-02, Phase 11 (late, non-blocking).
- Version bump / README / CHANGELOG / first-party review / hygiene ship gate -- Phase 10 (DST-01..04).
- Native FP as its own `lz-refactor-to-patterns` skill (FUT-04) -- tracked, not now.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CCH-01 | Detected/named smell -> next NAMED refactoring; mechanical->Fowler, repeated/complex-structure->Kerievsky | Coach procedure steps 2-3 (Section: Coach Procedure Shape). Reuses `smells.md` (D-03) + existing `SKILL.md` Fowler/Kerievsky pointers; no new table. |
| CCH-02 | Over/under-engineering balance -- recommend de-patterning (refactor away) when a pattern is unwarranted | Coach procedure step 4. Routes to Kerievsky Away leaves AND functional-catalog (D-05, broader than Kerievsky Away). Away leaves confirmed: inline-singleton, encapsulate-composite-with-builder, move-accumulation-to-visitor. |
| CCH-03 | Behavior-preservation discipline (small steps, run tests after each); no tests -> Feathers | Coach procedure step 5 + `refactoring-without-tests.md` (PRIN-03). principles.md "How to refactor safely" already states the small-steps discipline. |
| CCH-04 | Reference mode: on-demand catalog/smell/principle/functional questions -> correct references/ doc | Coach procedure step 6 + existing `SKILL.md` router pointers (Fowler/Kerievsky/GoF/extra/functional/smells/principles). Already wired; procedure names the routing. |
| CCH-05 | Frame the red-green-refactor seam with lz-tpp (green=TPP transform; refactor=lz-refactor), per Beck | Coach procedure step 1 (classify gate, D-04) anchored in existing `SKILL.md` "Refactoring vs the green step" + `principles.md` two-hats + new `beck-tdd-by-example.md` (PRIN-01). |
| CCH-06 | Surface the functional alternative; "pattern X disappears via idiom Y / TS feature Z" -> functional-catalog; Replace-Pipeline-with-Loop reverse guidance | Coach procedure step 4. functional-catalog + the 55 one-line `Functional alternative:` cross-links are BUILT (Phase 8.2). replace-loop-with-pipeline.md carries the reverse note. |
| PRIN-01 | Beck *TDD by Example* -- cycle, two rules, Fake It / Triangulate / Obvious Implementation, seam-scoped, no-oracle | New file `beck-tdd-by-example.md`; check-backing topic tokens (Section: Validation Architecture). Public-fact core; DST-04 paraphrase. |
| PRIN-02 | Beck *Tidy First?* -- structural-vs-behavioral separation + economics (coupling/cohesion/options), cross-ref overlapping Fowler by LINK, no tidyings catalog | New file `beck-tidy-first.md`; links to real Fowler slugs (list below); check-backing asserts >=1 fowler-catalog link. |
| PRIN-03 | Feathers *Legacy Code* -- seams, characterization tests, change algorithm, Sprout/Wrap Method+Class, Subclass and Override, Extract Interface | Populate existing stub `refactoring-without-tests.md`; per-entry contract already declared in the stub; check-backing topic tokens. |
</phase_requirements>

## Architectural Responsibility Map

This is a docs/skill phase; "tiers" map to authoring layers, not runtime tiers.

| Capability | Primary Layer | Secondary Layer | Rationale |
|------------|---------------|-----------------|-----------|
| Coach decision procedure (CCH-01..06) | Shipped router: `SKILL.md` (inline) | -- | Core auto-trigger behavior; the Phase 6 scaffold reserved the inline slot (D-01). It is routing logic, not catalog content, so it belongs in the lean router, not `references/`. |
| lz-tpp seam framing (CCH-05) | Shipped: existing `SKILL.md` "Refactoring vs the green step" + `principles.md` two-hats | New `beck-tdd-by-example.md` | Seam is already framed (D-04); the procedure references it and the new Beck ref backs it. Do not re-derive. |
| Principle backing (PRIN-01..03) | Shipped: `references/*.md` (3 files) | `principles.md` cross-ref pointers (D-06) | Heavy explanatory content stays in `references/` per progressive disclosure (SKEL-02/04); the Fowler-oracle `principles.md` stays Fowler and only points to the new no-oracle backing files. |
| Structural gate + IN-02 helper | Non-shipped harness: `.claude/skills/lz-refactor-workspace/tools/` | `tools/lib/` (shared helper) | The harness is deliberately NOT part of the shipped plugin (package.json `private: true`, node builtins only). Never leaks a dependency into the shipped Markdown skill. |

## Standard Stack

**No new libraries. No new dependencies. Zero installs this phase.**

| Component | Version | Role | Why unchanged |
|-----------|---------|------|---------------|
| Node.js (builtins only: `node:fs`, `node:path`, `node:url`) | v24.18.0 present | Runs the `.mjs` checker battery | Every checker is `// Throwaway; node builtins only`. The new `check-backing.mjs` follows suit. `[VERIFIED: node --version this session]` |
| typescript | 6.0.3 (pinned in `tools`-workspace `package.json` devDependencies) | `npm run typecheck` compiles TS fences via `extract-samples.mjs` | Only relevant if a principle ref carries a live TS fence; the pin is unchanged. `[VERIFIED: read package.json]` |
| Markdown (CommonMark, GitHub-flavored) | -- | The shipped skill + references | Same authoring format as every prior phase. |

**Installation:** none. `npm ci` in the workspace is unnecessary unless `node_modules` is absent
(typescript is the sole devDependency, already resolved for prior phases).

## Package Legitimacy Audit

**Not applicable.** This phase installs zero external packages. The only dependency in the
non-shipped workspace is `typescript@6.0.3`, pinned and unchanged since Phase 7. The shipped plugin
remains dependency-free Markdown. slopcheck / registry verification is moot -- there is nothing to
add. `[VERIFIED: read .claude/skills/lz-refactor-workspace/package.json]`

## Coach Procedure Shape (CCH-01..06)

### Measurement that settles inline-vs-split (D-01/D-02/D-12)

| File | Current lines | Budget | Headroom | Decision |
|------|--------------:|-------:|---------:|----------|
| `SKILL.md` | 85 (`wc -l`) | < 500 | ~415 | **INLINE. No split. Do NOT create `coach-procedure.md`.** |

`[VERIFIED: wc -l this session]` A compact decision tree is ~30-40 lines; the file lands near
~120-130, ~370 lines under budget. The D-02 fallback is dead code for this phase.

### Recommended inline procedure structure

Replace the placeholder at `SKILL.md:38-43` with a compact numbered decision tree (a tree, NOT a
table dump -- CONTEXT `## Specific Ideas`). It REFERENCES the router pointers that already exist in
`SKILL.md` (Fowler, smells, principles, Kerievsky, GoF+extra, functional, Feathers) -- it does not
re-add them (CONTEXT `## Existing Code Insights`). Recommended skeleton:

```
## Coach decision procedure

1. Classify the request (the lz-tpp seam -- CCH-05).
   - A red/failing test must be made to pass -> that is the green step: hand off to lz-tpp. Stop.
   - Tests are green and the code has a smell, structure-only -> continue (this is the refactor step).
2. Recognize the smell (CCH-01). Scan the recognize-by cues in smells.md, then OPEN the matching
   smell leaf for its candidate refactorings (the index is navigation-only -- never guess from it).
3. Route by smell kind to a NAMED refactoring (CCH-01):
   - Mechanical smell (e.g. Long Function, Duplicated Code, Feature Envy) -> a Fowler refactoring.
   - Repeated / complex-structure smell (e.g. Conditional Complexity, Combinatorial Explosion,
     Repeated Switches) -> a Kerievsky pattern-directed refactoring; look the target pattern up in
     the GoF / extra-patterns catalogs.
4. Apply the over/under-engineering balance (CCH-02, CCH-06):
   - A pattern that earns its keep -> apply or keep it.
   - An unwarranted pattern -> refactor AWAY. Either a Kerievsky Away refactoring (Inline Singleton,
     Encapsulate Composite with Builder, Move Accumulation to Visitor) OR dissolve it to a
     functional idiom via the functional-catalog ("pattern X disappears via idiom Y / TS feature Z").
     Replace Pipeline with Loop only on a measured hot path or a named house-style reason -- clarity
     is the default.
5. Preserve behavior (CCH-03): take the smallest steps that keep the code working, run the tests
   after each, commit on green. If the target code has NO tests, route to the Feathers
   refactoring-without-tests reference -- pin current behavior with characterization tests first,
   then refactor.
6. Reference mode (CCH-04): for an explain/lookup request, route to the correct references/ doc and
   answer from it (Fowler / Kerievsky / GoF / extra / functional / smells / principles / backing).
```

### CCH cross-reference verification (all routing targets already exist)

- Kerievsky Away leaves (CCH-02) confirmed present: `inline-singleton.md`,
  `encapsulate-composite-with-builder.md`, `move-accumulation-to-visitor.md` (asserted by
  `check-kerievsky` REQUIRED-Away + `check-gof` REQUIRED_AWAY). `[VERIFIED: read check-kerievsky.mjs/check-gof.mjs]`
- functional-catalog + the 55 `Functional alternative:` cross-links (CCH-06) are BUILT and
  `check-functional`-gated (Phase 8.2 complete). `[VERIFIED: REQUIREMENTS traceability FUN-01..04 Complete]`
- `replace-loop-with-pipeline.md` carries the reverse-direction note (CCH-06). `[CITED: 09-CONTEXT D-05]`
- The classify gate (CCH-05) text already exists at `SKILL.md:32-36` and `principles.md:19-24`
  (two hats). `[VERIFIED: read both files]`

## Principle References (PRIN-01..03)

### Filenames (D-12 discretion -- recommended)

| Req | File (under `references/`) | Status |
|-----|----------------------------|--------|
| PRIN-01 | `beck-tdd-by-example.md` | NEW -- does not exist yet `[VERIFIED: ls]` |
| PRIN-02 | `beck-tidy-first.md` | NEW -- does not exist yet `[VERIFIED: ls]` |
| PRIN-03 | `refactoring-without-tests.md` | EXISTS as stub; populate in place `[VERIFIED: read stub]` |

Rationale: kebab-case, author-name-prefixed for the two Beck files (disambiguates two Beck books),
mirroring the descriptive `refactoring-without-tests.md`. Filenames drive the check-backing token
paths and the `principles.md` cross-ref pointers (D-06), so lock them before authoring.

### Core-topic outline per file (bounded to SC #6 / D-08 -- do NOT expand)

**PRIN-01 `beck-tdd-by-example.md`:**
- The red-green-refactor cycle (write a failing test, make it pass, refactor), scoped to the seam.
- The two rules: write new code only when a test is failing; then eliminate duplication.
- Green-bar strategies: Fake It, Triangulate, Obvious Implementation.
- Seam scoping: these are green-step (lz-tpp/TPP) concerns; lz-refactor owns only the refactor
  step. Explicitly name lz-tpp (token the checker keys on).

**PRIN-02 `beck-tidy-first.md`:**
- Structural change vs behavioral change -- keep them separate (separate commits/steps).
- Refactor economics: coupling, cohesion, and options (the value of deferring decisions).
- When to tidy (before vs after vs later), briefly.
- **Cross-reference OVERLAPPING Fowler refactorings by LINK, do not restate them (PRIN-02 core
  constraint).** No complete tidyings catalog claimed (FUT-01). Overlapping Fowler slugs that EXIST
  in `fowler-catalog/` and are the confident link targets `[VERIFIED: ls fowler-catalog]`:
  - `extract-variable.md` (Explaining Variables)
  - `extract-function.md` / `extract-class.md` / `combine-functions-into-class.md` (Extract Helper)
  - `inline-function.md` (collapsing over-extracted helpers)
  - `slide-statements.md` (Move Declaration and Initialization Together)
  - `replace-nested-conditional-with-guard-clauses.md` (Guard Clauses)
  - `decompose-conditional.md`, `rename-variable.md`
  Note the "Explaining Constants" tidying has NO Fowler 2nd-ed print leaf (Replace Magic Literal is
  one of the 4 cut web-only 1st-ed relics, FWL-01) -- do not fabricate a link; cover it in prose or
  point at `extract-variable.md`.

**PRIN-03 `refactoring-without-tests.md` (populate the existing stub):**
- The stub already declares the per-entry content contract (Technique / When-to-use / Distilled
  mechanics) and the in-scope core-techniques list. Author against it directly. `[VERIFIED: read stub]`
- Techniques: Seams (and seam types); Characterization tests; the change algorithm (identify change
  points, find test points, break dependencies, write tests, make changes); Sprout Method/Class;
  Wrap Method/Class; Subclass and Override Method; Extract Interface.
- Remove the stub's scaffold markers on populate: the `> Populated in Phase 9.` blockquote and the
  `## Sources (placeholder)` heading (the word "placeholder" is a check-backing RED trip -- see
  Validation Architecture).

### No-oracle provenance marker convention (D-07)

Every backing file carries a visible no-oracle tag, same spirit as the functional-catalog's
`## Sources` no-oracle note -- but with NO research artifact to cite (unlike Phase 8.2). Recommended
convention (checker keys on `/no-oracle/i`):
- A top blockquote: `> No-oracle reference: high-confidence CORE only (no owned book to verify
  against). Original prose, no verbatim Beck/Feathers prose or code (DST-04).`
- A `## Sources` section (NOT "(placeholder)") naming the book and the no-oracle posture.

### principles.md cross-ref pointers (D-06)

`principles.md` stays the Fowler-oracle file. Add short pointer lines from it to the two new Beck
files (e.g. under "The two hats" -> `beck-tdd-by-example.md`; under "When to refactor / economics"
-> `beck-tidy-first.md`). These become new outbound links, so `principles.md` must be added to
`check-crossrefs` sources (see Validation Architecture) for them to be resolution-checked.

## Don't Hand-Roll

| Problem | Don't build | Use instead | Why |
|---------|-------------|-------------|-----|
| Smell -> refactoring routing table | A new coach trigger table in `SKILL.md` | The existing `smells.md` + smell leaves (D-03) | Duplicates the locked navigation-only index; `check-smells` already enforces "open the leaf for candidates". A second table diverges. |
| Fence-aware heading detection per checker | A one-off fence guard in each of the 4 checkers | ONE `tools/lib/heading-scan.mjs` helper (D-10) | A per-checker patch re-introduces the exact divergence the 08.2 fixer declined. Shared helper = zero drift. |
| Link resolution in `check-backing.mjs` | A second link resolver inside the new checker | Extend `check-crossrefs` source set | The codebase forbids a second resolver (see `check-functional.mjs` header: "there is NO second resolver here ... DELEGATED to check-crossrefs"). |
| Anchor slug computation | A local slug function | The shared `lib/github-slug.mjs` | Single source of truth so DEMANDED anchors never diverge from VALIDATED anchors (WR-02). |

## Runtime State Inventory

Not a rename/refactor/migration phase in the runtime-state sense -- it authors new content and one
harness helper. No stored data, live-service config, OS-registered state, secrets, or build
artifacts carry a renamed string.

| Category | Items Found | Action |
|----------|-------------|--------|
| Stored data | None -- verified: no datastore keys/collections touched | none |
| Live service config | None -- verified: no external services | none |
| OS-registered state | None -- verified: no scheduled tasks/daemons | none |
| Secrets/env vars | None -- verified: `check-hygiene` guards work-email absence; no secret names introduced | none |
| Build artifacts | None new. `node_modules` (typescript@6.0.3) unchanged; no egg-info/compiled output | none |

## Common Pitfalls

### Pitfall 1: DST-04 near-verbatim collision on famous Beck/Feathers one-liners
**What goes wrong:** A blind draft reproduces a canonical sentence almost verbatim.
**Why:** These lines are so well-known they are the "obvious" phrasing (MEMORY: "canonical one-line
Intents reproduce near-verbatim in blind drafts"). High-risk exact phrases to paraphrase, NOT quote:
- Feathers: "legacy code is code without tests" -- his single most-quoted line. Paraphrase (e.g.
  "code that has no tests around it").
- Feathers: the seam definition ("a place where you can alter behavior without editing in that
  place") -- paraphrase.
- Beck TDD: the Fake It / Obvious Implementation / Triangulate one-line definitions -- keep the
  NAMES (facts) but write original definitions.
- Beck TDD: "write new code only when a test is failing" and "eliminate duplication" -- paraphrase.
**How to avoid:** Author original wording from the first draft (MEMORY: paraphrase every canonical
Intent from the first draft, don't quote-then-reword). Technique/refactoring NAMES are facts and are
fine verbatim. `check-hygiene`'s no-verbatim heuristic is WARN-only (long quoted runs); the real
DST-04 gate is skill-reviewer PASS + author discipline (D-07). `[CITED: MEMORY pattern-leaf-intent-near-verbatim-dst04]`

### Pitfall 2: Assuming the 500-line budget is a real constraint
**What goes wrong:** Time spent designing a split-to-`coach-procedure.md` that is unnecessary.
**Why:** D-02 offers the split as a fallback; the actual measurement (85 lines) makes it moot.
**How to avoid:** Inline only. If a reviewer flags SKEL-02, the number to cite is ~120-130 << 500.

### Pitfall 3: check-crossrefs does NOT currently scan SKILL.md or the principle refs
**What goes wrong:** New coach cross-links and Beck->Fowler links are authored but silently
UN-checked -- a broken link ships GREEN.
**Why:** `check-crossrefs.mjs` `sourceFiles` (lines 107-114) collects ONLY fowler/kerievsky/gof/
extra/functional leaves + smells leaves + `smells.md`. It does NOT include `SKILL.md`,
`principles.md`, or the principle backing files. `[VERIFIED: read check-crossrefs.mjs]`
**How to avoid:** Extend `check-crossrefs` `sourceFiles` to add `SKILL.md`, `principles.md`,
`beck-tdd-by-example.md`, `beck-tidy-first.md`, and `refactoring-without-tests.md` so their outbound
`.md` links get resolution-checked. This is the same extend-the-source-set move every prior phase
made (08.1 added gof/extra, 08.2 added functional).

### Pitfall 4: The Feathers stub already contains the technique names
**What goes wrong:** A naive token check is partially GREEN against the un-authored stub, weakening
the instrument-first RED baseline.
**Why:** The stub's "Core techniques in scope" bullet list already names Seams, Characterization
tests, Sprout/Wrap, etc. `[VERIFIED: read stub]`
**How to avoid:** Give `check-backing.mjs` the same `SCAFFOLD_RES` guard the other checkers use
(`/\bplaceholder\b/i`, `/\bTODO\b/`, `/\bTBD\b/`, `/once it exists/i`, `/to be authored/i`). The
stub's `## Sources (placeholder)` trips `/\bplaceholder\b/i` -> Feathers stays RED until authored.
Combined with the two Beck files being absent, the phase-open baseline is unambiguously RED.

### Pitfall 5: IN-02 fence gap is real for the 4 catalog checkers but NOT the mechanism that
actually threatens principle refs
**What goes wrong:** Over-scoping the IN-02 fix, or mis-believing a bash fence in a principle ref
would break `collectLeaves`.
**Why:** `collectLeaves` walks ONLY the four catalog dirs (`gof-catalog`, `kerievsky-catalog`,
`extra-patterns-catalog`, `functional-catalog`). Principle refs live directly under `references/`,
so `collectLeaves` never reads them. The genuine fence risk for a principle ref is in
`check-crossrefs`'s heading/anchor scan (`slugsFor`, also fence-blind) IF the ref is a link target
with a fenced column-0 `#`. TS fences are inherently safe (TS comments are `//`, not `#`), so
`#`-comment risk only arises in bash/yaml/toml fences.
**How to avoid:** (a) Do the D-10 four-checker helper fix as carried-in DEBT CLEANUP (it is
dormant-safe: no current leaf has a fenced column-0 `#`, so the battery stays GREEN -- a
behavior-preserving refactoring the still-GREEN battery proves). (b) Author principle refs with TS
or fence-free examples (D-11) so no fence gap fires anywhere, including `check-crossrefs`. The
`check-crossrefs` `slugsFor` gap is adjacent and out of D-10's stated scope -- flag it in Open
Questions, do not expand scope into it.

## Code Examples

### IN-02 shared fence-aware helper (recommended new file)

```javascript
// Source: pattern derived from the four checkers' identical fence-blind line
//   (check-gof.mjs:160, check-kerievsky.mjs:199, check-extra-patterns.mjs:113, check-functional.mjs:198)
// tools/lib/heading-scan.mjs
// Collect level-1 ATX heading lines (`# Heading`) that sit OUTSIDE fenced code blocks.
// Fence tracking (CommonMark-ish): a fence opens on a line starting with >=3 backticks or >=3
// tildes; it closes on a later line with the same char, a run >= the opening length, and no info
// string. Drop-in for `lines.filter((l) => /^#\s+\S/.test(l))` so H1 detection can never be fooled
// by a column-0 `#` inside a bash/yaml/toml fence (IN-02). Node builtins only; no deps.
export const collectH1Lines = (text) => {
  const out = [];
  let fence = null; // { char, len } while inside a fenced block

  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^(`{3,}|~{3,})(.*)$/);

    if (m) {
      const char = m[1][0];
      const len = m[1].length;

      if (fence === null) {
        fence = { char, len };
      } else if (char === fence.char && len >= fence.len && m[2].trim() === "") {
        fence = null;
      }

      continue;
    }

    if (fence === null && /^#\s+\S/.test(line)) {
      out.push(line);
    }
  }

  return out;
};
```

The four call sites each replace their local line with:
```javascript
const h1s = collectH1Lines(text);
```
`check-kerievsky.mjs` and `check-functional.mjs` already import from `./lib/` (add a second import
line); `check-gof.mjs` and `check-extra-patterns.mjs` do NOT import from `./lib/` yet and must add
`import { collectH1Lines } from "./lib/heading-scan.mjs";`. `[VERIFIED: git grep lib imports this session]`

## State of the Art

| Old approach (this repo, pre-Phase-9) | Current approach (Phase 9) | Impact |
|---------------------------------------|----------------------------|--------|
| Coach procedure = placeholder in `SKILL.md` | Real inline decision tree | CCH-01..06 close |
| Feathers = stub; no Beck refs | 3 authored no-oracle backing refs | PRIN-01..03 close |
| 4 checkers each fence-blind in `collectLeaves` | 1 shared `collectH1Lines` helper | IN-02 debt retired with zero divergence |
| `check-crossrefs` scans only catalog+smell sources | + `SKILL.md`, `principles.md`, 3 backing files | Coach/principle links become resolution-gated |

## Assumptions Log

| # | Claim | Section | Risk if wrong |
|---|-------|---------|---------------|
| A1 | The Tidy First? tidyings <-> Fowler overlap set (Explaining Variables->extract-variable, Guard Clauses->replace-nested-conditional-with-guard-clauses, etc.) reflects Beck's actual tidyings | Principle References PRIN-02 | LOW -- these are widely-documented, high-confidence mappings; the LINK targets are verified to exist. A mis-mapped tidying is a paraphrase choice caught by skill-reviewer, not a broken link. |
| A2 | Beck's "two rules" and green-bar strategy names (Fake It / Triangulate / Obvious Implementation) are exactly these | Principle References PRIN-01 | LOW -- canonical, well-known TDD-by-Example vocabulary. No owned oracle by design (D-07); skill-reviewer is the anchor. |
| A3 | Feathers change-algorithm steps are "identify change points, find test points, break dependencies, write tests, make changes" | Principle References PRIN-03 | LOW -- the existing stub already declares this exact step list; authoring matches the stub contract. |
| A4 | The `principles.md` cross-ref pointers to the Beck files will resolve once `principles.md` is added to check-crossrefs sources | Validation Architecture | LOW -- mechanical; both Beck files will exist before the GREEN gate. |

All four are LOW-risk paraphrase/vocabulary assumptions inherent to the no-oracle posture (D-07),
not decisions needing a user checkpoint (D-07 explicitly forbids reopening the oracle-access
checkpoint for these). No HIGH-impact assumption requires confirmation.

## Open Questions

1. **Should the D-10 helper also fix `check-crossrefs`'s fence-blind `slugsFor` / `linkRe`?**
   - Known: `check-crossrefs` (header line 16-17) notes the same fence-blind gap in its link/heading
     scan; it is where a principle-ref fenced `## ` could actually create a phantom anchor
     (false-PASS).
   - Unclear: D-10's stated scope is exactly the four catalog checkers' `collectLeaves` H1
     detection. Extending into `check-crossrefs` is arguably scope creep.
   - Recommendation: Keep D-10 minimal (four `collectLeaves` call sites) and rely on D-11 authoring
     discipline (TS/fence-free principle refs) so the `check-crossrefs` gap stays dormant. The
     planner MAY, at low cost, also reuse `collectH1Lines` inside `check-crossrefs` slugsFor if it
     wants defense-in-depth -- but do not block the phase on it.

2. **Does the coach procedure add anchored links or only file-level links?**
   - Recommendation: Keep coach links FILE-LEVEL (matching the existing router pointer style, no
     `#anchor`) so no anchor-resolution edge case arises once `SKILL.md` becomes a check-crossrefs
     source. Anchored deep-links into leaves add anchor-resolution surface for no routing benefit.

## Environment Availability

| Dependency | Required by | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| Node.js | Running the `.mjs` checker battery | Yes | v24.18.0 | none needed |
| typescript | `npm run typecheck` (only if a principle ref has a live TS fence) | Yes (pinned) | 6.0.3 | Author fence-free prose; typecheck is a no-op for non-TS content |

No external services, no network, no databases. `[VERIFIED: node --version; read package.json]`

## Validation Architecture

> nyquist_validation is `true` in `.planning/config.json` `[VERIFIED: read config]` -- this section is required.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Bespoke node-builtin checker battery (no test runner; `.mjs` scripts exit 0=GREEN / 1=RED) |
| Config file | `.claude/skills/lz-refactor-workspace/package.json` (`scripts.check`, `scripts.typecheck`) |
| Quick run command | `node tools/check-backing.mjs` (the phase's new gate, run from the workspace dir) |
| Full suite command | `npm run check && npm run typecheck` (from `.claude/skills/lz-refactor-workspace/`) |

### Instrument-first RED->GREEN sequence (Nyquist scaffold, per Phases 7/8/8.1/8.2)

Wave 1 (instrument, assert RED) -- lands BEFORE any content:
1. Add `tools/lib/heading-scan.mjs` (`collectH1Lines`) and rewire the four `collectLeaves` call
   sites (D-10). Because no leaf carries a fenced column-0 `#`, the full battery STAYS GREEN -- this
   is a behavior-preserving refactoring the still-GREEN battery proves.
2. Add `tools/check-backing.mjs` (RED baseline: 2 Beck files absent + Feathers stub trips the
   `placeholder` scaffold guard). Assert `SUMMARY: ... RED`.
3. Extend `check-crossrefs` `sourceFiles` to add `SKILL.md`, `principles.md`, and the 3 backing
   files (their links are checked once authored; before the Beck files exist, links FROM
   `principles.md`/`SKILL.md` still resolve because they point at existing catalog READMEs -- but
   the new Beck->Fowler links do not exist yet, so this stays consistent).
4. Wire `check-backing.mjs` into `package.json` `scripts.check` (append `&& node tools/check-backing.mjs`).

Wave 2 (author content -> GREEN):
5. Author `beck-tdd-by-example.md`, `beck-tidy-first.md`; populate `refactoring-without-tests.md`
   (remove scaffold markers). -> `check-backing` GREEN.
6. Replace the `SKILL.md` coach placeholder with the inline procedure; add `principles.md` cross-ref
   pointers. -> new links resolve under the extended `check-crossrefs`.

Wave 3 (phase gate): full `npm run check` + `npm run typecheck` GREEN + `claude plugin validate .`
PASS + skill-reviewer PASS (the DST-04 anchor for the no-oracle refs, D-07).

### Phase Requirements -> Test Map
| Req | Behavior | Test type | Automated command | Exists? |
|-----|----------|-----------|-------------------|---------|
| PRIN-01 | beck-tdd-by-example.md exists + carries cycle/two-rules/Fake It/Triangulate/Obvious Impl/lz-tpp tokens + no-oracle tag | structural | `node tools/check-backing.mjs` | NEW (Wave 0/1) |
| PRIN-02 | beck-tidy-first.md exists + structural/behavioral/coupling/cohesion/options tokens + >=1 fowler-catalog link + no-oracle tag | structural | `node tools/check-backing.mjs` | NEW (Wave 0/1) |
| PRIN-03 | refactoring-without-tests.md populated: seams/characterization/change-algorithm/sprout/wrap/subclass-and-override/extract-interface tokens + no scaffold phrase + no-oracle tag | structural | `node tools/check-backing.mjs` | NEW (Wave 0/1) |
| CCH-01..06 | coach cross-links resolve; routing targets exist | structural | `node tools/check-crossrefs.mjs` (extended with SKILL.md source) | EXISTS; extend source set (Wave 0/1) |
| CCH-* / SKEL-02 | SKILL.md stays ASCII-clean, email-clean, < 500 lines | hygiene + manual | `node tools/check-hygiene.mjs` (ASCII/email over SKILL.md+references recursively) | EXISTS |
| IN-02 (D-10) | 4 catalog checkers use the shared fence-aware helper; battery still GREEN | regression | `npm run check` | EXISTS (must stay GREEN) |

### Sampling Rate
- **Per task commit:** `node tools/check-backing.mjs` (+ `node tools/check-crossrefs.mjs` after link edits).
- **Per wave merge:** `npm run check && npm run typecheck`.
- **Phase gate:** full battery GREEN + `claude plugin validate .` + skill-reviewer PASS before `/gsd:verify-work`.

### Recommended `check-backing.mjs` topic-token map (line-oriented, mirrors check-principles.mjs)

```
beck-tdd-by-example.md   : /red-green-refactor/i, /two rules/i, /fake it/i, /triangulate/i,
                           /obvious implementation/i, /lz-tpp/i
beck-tidy-first.md       : /structural/i, /behavioral/i, /coupling/i, /cohesion/i, /options/i,
                           and a Fowler-link presence check: /\]\(\.\.?\/?fowler-catalog\/[a-z0-9-]+\.md/
refactoring-without-tests.md : /seams?/i, /characterization test/i, /change algorithm/i (or the
                           step tokens), /sprout/i, /wrap/i, /subclass and override/i,
                           /extract interface/i
all three                : no-oracle tag /no-oracle/i present; SCAFFOLD_RES guard
                           (/\bTODO\b/, /\bTBD\b/, /\bplaceholder\b/i, /once it exists/i,
                           /to be authored/i) must NOT match.
```

Recommend a NEW `check-backing.mjs` over extending `check-principles.mjs`: `check-principles.mjs` is
labeled "FWL-03 principles checker" and hardcodes the Fowler Ch.2 topic set + single `PRINCIPLES`
path; overloading it with 3 unrelated files muddies its single responsibility and its
FWL-03-specific SUMMARY. A sibling matches the codebase pattern (check-gof / check-extra-patterns /
check-functional are all siblings, not one mega-checker). `[VERIFIED: read check-principles.mjs]`

### Wave 0 Gaps
- [ ] `tools/check-backing.mjs` -- covers PRIN-01/02/03 (does not exist).
- [ ] `tools/lib/heading-scan.mjs` -- shared fence-aware `collectH1Lines` for D-10 (does not exist).
- [ ] `check-crossrefs.mjs` source-set extension -- add SKILL.md + principles.md + 3 backing files.
- [ ] `package.json` `scripts.check` -- append `check-backing.mjs`.
- (No test-framework install needed -- the battery is node-builtin `.mjs`; node v24.18.0 present.)

## Security Domain

This is documentation/skill authoring with no runtime, no auth, no session, no network, and no
untrusted input processing. The only security-relevant surface is public-repo supply-chain +
content hygiene, already gated.

| ASVS category | Applies | Standard control |
|---------------|---------|------------------|
| V2 Authentication | no | -- |
| V3 Session Management | no | -- |
| V4 Access Control | no | -- |
| V5 Input Validation | no | No user input processed; static Markdown + `.mjs` reading local files |
| V6 Cryptography | no | -- |
| V14 Config / Supply Chain | yes (minimal) | Zero new deps this phase; node builtins only; `check-hygiene` HARD-fails on any non-ASCII byte and on any non-approved email token (work-email leak recurred twice in Phase 4) |

| Threat pattern | STRIDE | Mitigation |
|----------------|--------|------------|
| Work-email leak into a public commit | Information Disclosure | `check-hygiene` email allowlist (HARD fail) + MEMORY public-repo allowlist rule; verify post-commit |
| Verbatim copyrighted book prose/code shipped | Info Disclosure / IP | DST-04: original prose only; `check-hygiene` no-verbatim WARN heuristic + skill-reviewer PASS (the authoritative gate, D-07) |
| Malicious dependency (slopsquat) | Tampering | N/A -- zero packages added; only pinned typescript@6.0.3 unchanged |

## Sources

### Primary (HIGH confidence)
- Read this session: `SKILL.md` (85 lines), `principles.md` (110 lines), `refactoring-without-tests.md`
  (stub + content contract), `smells.md`, and all four catalog checkers
  (`check-gof.mjs`/`check-kerievsky.mjs`/`check-extra-patterns.mjs`/`check-functional.mjs`),
  `check-crossrefs.mjs`, `check-principles.mjs`, `check-hygiene.mjs`, `lib/github-slug.mjs`,
  `package.json`.
- `wc -l`, `ls`, `git grep`, `node --version` (v24.18.0), `.planning/config.json`
  (`nyquist_validation: true`) -- this session.
- `.planning/ROADMAP.md` Phase 9 (SC #1-6 + carried-in IN-02 note at :174),
  `.planning/REQUIREMENTS.md` (CCH-01..06, PRIN-01..03), `.planning/phases/09-.../09-CONTEXT.md`
  (D-01..D-12).

### Secondary (MEDIUM confidence)
- Beck *TDD by Example* / *Tidy First?* and Feathers *Working Effectively with Legacy Code* core
  vocabulary -- widely-documented public facts (training knowledge). No owned oracle by design
  (D-07); correctness anchored by high-confidence-core scope + skill-reviewer + DST-04 hygiene. No
  external fetch performed (output must be original prose regardless -- fetching book text would
  risk DST-04, not help).

### Tertiary (LOW confidence)
- None load-bearing. The four Assumptions (A1-A4) are LOW-risk paraphrase/vocabulary items.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- zero new deps; every fact read from the actual files this session.
- Coach procedure shape: HIGH -- structure derived from the measured `SKILL.md` + existing router
  pointers + CONTEXT `## Specific Ideas`; inline decision settled by the 85-line measurement.
- Harness gate + IN-02: HIGH -- four fence-blind call sites located by `git grep` with exact line
  numbers; lib-import status verified; `check-crossrefs` source-set gap read directly.
- Principle-ref core scope: MEDIUM -- no owned oracle by design (D-07); Beck/Feathers core is
  public-fact but authoring must paraphrase (Pitfall 1).

**Research date:** 2026-07-08
**Valid until:** 2026-08-07 (stable -- no fast-moving external dependencies; the only drift vector is
further edits to the harness, which are in-repo and this phase controls).
