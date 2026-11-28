# Phase 16: Source Distillation & Core RED References - Research

**Researched:** 2026-07-19
**Domain:** Clean-room own-words distillation + authoring three flat progressive-disclosure references (test SELECTION, STRUCTURE, NAMING) for the lz-red RED-phase TDD coach skill, with a dev-only tsc --strict validation gate. Markdown-only shipped tree.
**Confidence:** HIGH (clean-room mechanics, tsc harness, and grain all read directly on disk; source-fact framings inherited from the 1-day-old 2026-07-18 milestone research verified against authoritative sources; owned-source facts are oracle-gated at execute time, not pre-authored here).

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions (D-01 .. D-12, verbatim intent)

- **D-01:** Oracle-access checkpoint CLEARED (mirrors 0.0.2's D-09). All RED-phase owned sources are provisioned into git-ignored `.oracle/`: `.oracle/clean-code/` (indexed subdir + `index.md`, RCM *Clean Code*; load-bearing Ch.9 Unit Tests + Ch.2 Meaningful Names), `.oracle/99-bottles-2e-js/` (indexed subdir + `index.md`, Metz + Owen *99 Bottles of OOP* 2nd Ed **JavaScript Edition**; Phase-16 load is light = name-for-behavior), and two FLAT Cooper transcripts (`tdd-where-did-it-all-go-wrong-ian-cooper-yt-EZ05e7EMOLM.md`, `tdd-revisited-ian-cooper-ndc-porto-2023-yt-IN9lftH0cJc.md`). RED facts are distilled OWN-WORDS via the oracle / oracle-reviewer clean-room agents; main context NEVER reads book/talk prose (DST-04). [VERIFIED: `.oracle/` structure confirmed via `ls` only this session -- no prose read.]
- **D-02:** Source tagging. OWNED / oracle-gated: RCM *Clean Code*; Metz+Owen *99 Bottles of OOP* 2e JS; the two Cooper talks. NO-ORACLE / high-confidence core (author blind, tag no-oracle, do NOT claim oracle verification): Kent Beck (test list, triangulation, assert-first, evident data), Bill Wake (Arrange-Act-Assert), Dan North (Given-When-Then / BDD "should"), Roy Osherove (three-part naming).
- **D-03:** Talk-transcript access. The two Cooper talks are FLAT files (no `<book>/index.md`); the packaged oracle input points DIRECTLY at the flat transcript path (no navigation index). Both are large (~55-60 KB) -> oracle agents MUST chunk-read to EOF (length-agnostic). For Phase 16 the talks are SECONDARY (SEL: a new behavior triggers the next test; NAME: name the behavior not the method); their heavy use is Phase 17.
- **D-04:** Fill only the requirement SLICES; leave each co-edited stub's "Populated in Phase NN" marker intact for 17/18. `three-laws-and-test-selection.md` = fill SEL (SEL-01, SEL-02), LEAVE Three Laws spine + classify-first seam (LAW-01/02, SEAM-01) to Phase 18. `test-structure-and-assertions.md` = fill STR (STR-01, STR-02), LEAVE assertions + Khorikov four pillars (ASRT-01/02) to Phase 17. `naming.md` = fill fully (NAME-01 is entirely Phase 16). Do NOT fragment a decision doc per-source; a stub spanning >1 phase is co-edited, never split.
- **D-05:** SEL-01 -- running test list, one small (one-step) step, degenerate/starter case (empty, zero, null). Own-words from *Clean Code* (owned) + Beck (no-oracle). Degenerate-first framed as the opening move of a new behavior.
- **D-06:** SEL-02 -- triangulation as a RED test-SELECTION move (add a second concrete example to force the next test), EXPLICITLY bounded against lz-tpp's fake-it / generalize (the GREEN facet). The boundary sentence is load-bearing (SC-2).
- **D-07:** STR-01 -- Arrange-Act-Assert (Wake) and Given-When-Then (North) as ONE three-part skeleton in TWO vocabularies; do NOT impose one school; instruct to MATCH the house idiom. Design-agnostic (SC-3).
- **D-08:** STR-02 -- assert-first, evident / intention-revealing test data, one-concept-per-test (one reason to fail). Own-words from Beck (assert-first + evident data, no-oracle) + *Clean Code* (one concept per test, owned).
- **D-09:** NAME-01 -- behavior / BDD "should ..." naming PRIMARY (North); Osherove three-part `UnitOfWork_StateUnderTest_ExpectedBehavior` as the documented ALTERNATIVE; plus "match the codebase's existing naming stance." Metz name-the-behavior-not-the-method (owned) is the rationale thread.
- **D-10:** Every TypeScript sample is tsc --strict CLEAN and has NO verbatim book prose/code. Examples are MINIMAL RED illustrations (failing-test skeleton, degenerate-case test, an AAA/GWT pair, a "should"-named test) paired with the language-agnostic principle. Vitest is the framework idiom, but Phase 16 uses only the minimal `it` / `expect` surface -- deep Vitest mechanics (`it.todo`, `test.each`, `vi.*`) are Phase 17 (VIT).
- **D-11:** The shipped `plugins/lz-tdd` tree gets NO build deps. tsc --strict validation runs in a DEV-ONLY workspace mirroring the lz-refactor-workspace one-module-per-fence extractor + pinned typescript. Planner's call: reuse the lz-refactor extractor pointed at lz-red refs OR stand up a minimal `lz-red-workspace` tsc gate now. Instrument-first (RED against empty refs -> GREEN when content lands) is the 0.0.2 precedent; a tsc --strict gate is MANDATORY either way.
- **D-12:** Owned-source surfaces (Clean Code / 99 Bottles / Cooper) are oracle-reviewer gated (converge-to-clean, 3-round cap) PLUS a deterministic no-verbatim scan. No-oracle surfaces (Beck/Wake/North/Osherove) are authored blind from high-confidence core and get the no-verbatim scan ONLY. Main context never reads `.oracle/` prose; only own-words facts cross back.

### Claude's Discretion

- Exact own-words wording of each selection / structure / naming heuristic (executor drafts; oracle-reviewer gates the owned surfaces).
- Exact minimal TS/Vitest example per reference, within the D-10 constraints.
- Whether the planner reuses the lz-refactor-workspace tsc extractor or stands up a minimal lz-red one (D-11) -- a tsc --strict gate + no-verbatim scan are mandatory.
- Whether Phase 16 opens with an instrument-first Wave-0 (empty-ref RED baseline) -- planner's call, but the tsc gate + no-verbatim scan are non-negotiable.

### Deferred Ideas (OUT OF SCOPE for Phase 16)

- Assertion design, Khorikov four pillars, Metz message matrix, stance router, Vitest deep mechanics, anti-patterns, Test Desiderata -> Phase 17.
- Three Laws spine framing + fail-for-the-right-reason + classify-first + forward/reverse lz-tpp seam -> Phase 18.
- plugin.json 0.0.3 bump / README / CHANGELOG / validators -> Phase 19.
- Eval workspace + trigger/behavior evals + description tuning -> Phase 20.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| SEL-01 | Keep a test list; take one small (one-step) step; start from the degenerate/starter case (empty, zero, null). | No-oracle core: Beck *TDD by Example* (Test List, One Step Test, Starter Test) [CITED: FEATURES.md, verified 2026-07-18]. Owned rationale thread: RCM *Clean Code* Ch.9 "only enough to fail / one small step" [ASSUMED -- oracle-gated at execute]. Fills the SEL slice of `three-laws-and-test-selection.md`. |
| SEL-02 | Triangulation for the RED facet (add another concrete example to select the next test), explicitly bounded against lz-tpp's fake-it / generalize (GREEN facet). | No-oracle core: Beck triangulation, RED-facet framing [CITED: FEATURES.md]. Boundary sentence is load-bearing (SC-2) -- firewall from lz-tpp GREEN generalization. See Pitfall 5. |
| STR-01 | Arrange-Act-Assert (Wake) and Given-When-Then (North) as one skeleton in two vocabularies; match the house idiom. | No-oracle core: Wake (AAA), North (GWT) [CITED: FEATURES.md]. Design-agnostic; no imposed school (SC-3). Fills the STR slice of `test-structure-and-assertions.md`. |
| STR-02 | Assert-first, evident / intention-revealing test data, one-concept-per-test. | No-oracle core: Beck (assert-first, evident data) [CITED: FEATURES.md]. Owned rationale thread: RCM *Clean Code* one-concept-per-test [ASSUMED -- oracle-gated]. |
| NAME-01 | Behavior / BDD "should ..." naming PRIMARY; Osherove three-part convention as documented ALTERNATIVE; match the codebase's naming stance. | No-oracle core: North ("should"/BDD), Osherove (three-part) [CITED: FEATURES.md]. Owned rationale thread: Metz *99 Bottles* JS Ed name-the-behavior-not-the-method [ASSUMED -- oracle-gated]. Fills `naming.md` fully. |
</phase_requirements>

## Summary

Phase 16 is a clean-room content-authoring phase, not a build phase. It fills the SEL/STR/NAME slices of three EXISTING Phase-15 stubs with own-words facts and minimal tsc --strict-clean TypeScript/Vitest examples, then gates the result with the exact validation recipe 0.0.2 proved: an oracle / oracle-reviewer converge-to-clean loop (3-round cap) on owned surfaces, a deterministic no-verbatim scan on everything, and a one-module-per-fence tsc --strict compile gate in a dev-only workspace. The shipped `plugins/lz-tdd` tree stays dependency-free Markdown; nothing new installs into it.

The domain content risk is LOW -- there is broad, high-confidence expert consensus on what a good RED selection/structure/naming move is, already distilled and verified against authoritative sources in the 2026-07-18 milestone research (one day old, within freshness). The real risks are all authoring discipline: DST-04 near-verbatim leaks of canonical one-liners (F.I.R.S.T., "should", AAA, Osherove's three-part), tsc --strict failures in hand-written test snippets, Vitest 4.x API drift, and the load-bearing SEL-02 firewall that must keep triangulation-for-SELECTION from bleeding into lz-tpp's GREEN generalization. Two non-obvious mechanical findings drive the plan: (1) the tsc gate is GREEN-on-empty (0 fences compiles vacuously), so it is NOT the Nyquist RED->GREEN completeness signal -- a lightweight content-completeness checker is; and (2) lz-red's test examples need Vitest's types to compile, which lz-refactor's examples never did, so the tsc gate needs a Vitest-types strategy the 0.0.2 harness never faced.

**Primary recommendation:** Stand up a minimal `.claude/skills/lz-red-workspace/` now by copying the proven lz-refactor extractor recipe (extract-samples.mjs + tsconfig.json + package.json) and repointing it at the flat lz-red references, adding `vitest@4.1.x` to the dev-workspace devDependencies (alongside `typescript@6.0.3`, the version already pinned and installed globally) so the minimal `import { it, expect } from 'vitest'` fences type-check. Extend the existing repo-global `check-hygiene.mjs` to cover the lz-red tree (ASCII + email + no-verbatim). Open with an instrument-first Wave 0 that asserts a RED baseline via a lightweight lz-red completeness checker, then fill one reference per content wave (all three are independent), and close with an oracle-reviewer + skill-reviewer + full-battery-GREEN finalize wave.

## Architectural Responsibility Map

For a docs/authoring phase, "tier" is the context boundary that owns each capability -- who is allowed to hold what.

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Distill OWNED facts (RCM Clean Code, Metz 99 Bottles, Cooper) into own words | Clean-room `oracle` agent (isolated context) | -- | Only the isolated agent may hold copyrighted full text; it returns own-words facts, never prose (DST-04). Main/planner/researcher context must NEVER read `.oracle/`. |
| Author the NO-ORACLE core (Beck, Wake, North, Osherove) | Main-context executor (blind, from high-confidence core) | -- | No owned copy exists to gate against; author from verified core facts, tag no-oracle, no-verbatim scan only. |
| Gate owned surfaces for near-verbatim fidelity | Clean-room `oracle-reviewer` agent (isolated) | Deterministic no-verbatim scan (check-hygiene axis c) | The reviewer holds the source and returns only a pass/revise/blocked verdict; the scan is a cheap always-on backstop. |
| Validate TS/Vitest examples compile tsc --strict | Dev-only `lz-red-workspace` (node + tsc 6.0.3 + vitest types) | -- | Never a shipped-plugin dependency; the shipped tree is Markdown-only. |
| ASCII + work-email + no-verbatim hygiene | Repo-global `check-hygiene.mjs` (extended to lz-red) | git author/committer identity check | Hygiene is inherently repo-wide; one gate over all three skills. |
| Author the shipped Markdown references | Main-context executor | oracle facts cross back into these | The three refs live in the SHIPPED tree; only own-words content lands there. |

## Standard Stack

The shipped skill adds NOTHING. The stack below is (a) the dev-only validation toolchain and (b) the DEMONSTRATION stack the examples are written in.

### Core (dev-only validation toolchain -- reuse the 0.0.2 recipe)

| Tool | Version | Purpose | Why Standard |
|------|---------|---------|--------------|
| Node.js | v24.18.0 (present) | Runs the node-builtin checkers + the extractor | Repo harness convention: ESM `.mjs`, node builtins only, zero deps [VERIFIED: node --version, CONVENTIONS.md]. |
| TypeScript (`tsc`) | 6.0.3 (global present + lz-refactor-workspace pin) | The authoritative `tsc --strict --noEmit` compile gate for every example fence | Matches the proven 0.0.2 pin; examples use only stable strict-mode syntax so 6.0.3 is version-safe. Do NOT chase 7.0.2 -- consistency + proven [VERIFIED: tsc --version 6.0.3; package.json pin]. |
| Vitest (types) | 4.1.x (pin 4.1.10) | Provides `describe` / `it` / `expect` types so test-example fences type-check under tsc | NEW to the harness -- lz-refactor examples had no test-framework imports; lz-red examples do [CITED: STACK.md, npm registry 2026-07-18]. |

### Supporting (demonstration stack -- what examples are WRITTEN in, never installed into the plugin)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Vitest | 4.1.10 | The RED framework idiom for examples (`describe`/`it`/`expect` only in Phase 16) | Every example fence. Phase 16 uses the minimal surface ONLY; `it.todo`/`test.each`/`vi.*` are Phase 17. |
| Node.js engine | ^20 \|\| ^22 \|\| >=24 | Vitest 4 `engines` floor | The demo/validation env must satisfy it; v24.18.0 does [VERIFIED]. |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| New `lz-red-workspace` tsc gate | Bolt a lz-red catalog entry onto the existing lz-refactor `extract-samples.mjs` | Edits a closed-milestone artifact to serve a different skill, pollutes lz-refactor's workspace with vitest, and couples two skills' gates. False economy -- see Open Questions. |
| `import { it, expect } from 'vitest'` in fences (+ vitest devDep) | `types: ["vitest/globals"]` in tsconfig + ambient globals | Globals compile without imports but hide where the API comes from (worse teaching) and still need vitest installed. Explicit imports are more honest and self-contained. |
| Vitest devDep for types | Hand-written `vitest-ambient.d.ts` shim (no vitest install) | Lighter (no install) but masks real matcher type errors and drifts from real Vitest types. Only worth it if `npm install` is undesirable; not recommended. |
| typescript 6.0.3 | typescript 7.0.2 (latest GA native port) | 7.0.2 is newer but unproven in this repo; 6.0.3 is the pinned/installed version. Examples are version-agnostic; pin what is proven. |

**Installation (dev-only workspace, NEVER `plugins/lz-tdd`):**
```bash
# In .claude/skills/lz-red-workspace/  -- copied recipe, not a new invention
npm install   # devDependencies: typescript 6.0.3, vitest 4.1.x
```

**Version verification:** node v24.18.0, npm 11.16.0, global tsc 6.0.3 confirmed this session. Vitest 4.1.10 / node engines confirmed against npm registry + vitest.dev on 2026-07-18 (STACK.md). No new versions to re-verify -- within freshness.

## Package Legitimacy Audit

Phase 16 installs external packages ONLY into the dev-only workspace (never the shipped plugin). Two packages: `typescript` (already the pinned + globally-installed 6.0.3), `vitest` (new to the harness; the milestone-locked test framework).

| Package | Registry | Age signal | Downloads | Source Repo | Verdict | Disposition |
|---------|----------|-----------|-----------|-------------|---------|-------------|
| typescript | npm | latest published 2026-07-08 (fresh release) | 219M/wk | github.com/microsoft/TypeScript | SUS (`too-new`) | APPROVED -- already the pinned dev dep + global 6.0.3; the flag is the latest-version-age heuristic misfiring on a routine Microsoft release, not a new package. |
| vitest | npm | latest published 2026-07-06 (fresh release) | 73M/wk | github.com/vitest-dev/vitest | SUS (`too-new`) | APPROVED -- milestone-locked framework, 73M weekly downloads, official vitest-dev repo, no postinstall. `too-new` reflects a recent version bump, not a slopsquat. |

**Interpretation:** Both `SUS` verdicts are `too-new` false positives -- the checker keys on the LATEST version's publish date (both packages shipped a routine release within ~2 weeks), not the package's first-publish age. Signals (200M+/73M weekly downloads, official Microsoft / vitest-dev repos, `postinstall: null`, `deprecated: false`) are unambiguously legitimate. Neither is a hallucinated or slopsquatted name -- both are canonical, ubiquitous tooling.

**Packages removed due to [SLOP] verdict:** none.
**Packages flagged as suspicious [SUS]:** typescript, vitest -- both dispositioned APPROVED above. Per protocol the planner MAY add a single optional `checkpoint:human-verify` before the dev-workspace `npm install`, but the residual supply-chain risk is nil (both are already-in-use, official-repo, no-postinstall packages). No `postinstall` scripts on either [VERIFIED: legitimacy signals]. Pin exact versions (`typescript@6.0.3`, `vitest@4.1.10`) in the workspace `package.json` to avoid range drift.

## Architecture Patterns

### System Architecture Diagram (clean-room authoring + validation data flow)

```
OWNED path (Clean Code / 99 Bottles / Cooper facts)        NO-ORACLE path (Beck / Wake / North / Osherove)
---------------------------------------------------        ------------------------------------------------
.oracle/<book>/index.md  (or FLAT Cooper .md path)          high-confidence core facts (verified 2026-07-18)
        |                                                            |
        v  packaged input: question + index/flat path               v
   [oracle agent]  reads full text in ISOLATED context         executor drafts BLIND, own words, tag no-oracle
        |  returns OWN-WORDS facts only (never prose/paths)          |
        +----------------------------+-------------------------------+
                                     v
                     executor authors the shipped reference (main context, own words)
                     plugins/lz-tdd/skills/lz-red/references/<ref>.md  (+ minimal ts fences)
                                     |
              +----------------------+----------------------+---------------------------+
              v (owned surfaces only)                       v (all surfaces)            v (all fences)
     [oracle-reviewer agent]  gate near-verbatim   check-hygiene.mjs axis c    lz-red-workspace tsc gate
     verdict pass|revise|blocked (converge <=3)    no-verbatim >=120-char quote   extract every ts fence ->
              |  revise -> re-draft BLIND, re-gate  + ASCII + email allowlist     one module -> tsc --strict
              v                                            |                             |
          all pass -----------------------------> full battery GREEN + skill-reviewer PASS -> phase complete
```

The diagram traces the primary use case: an owned fact enters via `.oracle/`, is abstracted to own words by the isolated oracle agent, is authored into the shipped ref by the executor, then passes three gates (fidelity, hygiene, compile). A no-oracle fact skips the oracle agents but takes the same hygiene + compile gates.

### Recommended Project Structure

```
plugins/lz-tdd/skills/lz-red/references/     # SHIPPED -- Markdown only, no deps
|-- three-laws-and-test-selection.md         # FILL SEL slice (SEL-01, SEL-02); LEAVE LAW/SEAM markers
|-- test-structure-and-assertions.md         # FILL STR slice (STR-01, STR-02); LEAVE ASRT markers
'-- naming.md                                # FILL FULLY (NAME-01)

.claude/skills/lz-red-workspace/             # NEW, dev-only, NOT shipped (gitignored byproducts)
|-- package.json                             # {typescript 6.0.3, vitest 4.1.10}  (copied recipe)
|-- tsconfig.json                            # strict/noEmit + vitest types  (copied + 1 edit)
|-- extract-samples.mjs                      # one-module-per-fence tsc gate  (copied + repoint path)
'-- tools/
    '-- check-red-references.mjs             # NEW lightweight completeness checker (RED baseline)

.claude/skills/lz-refactor-workspace/tools/check-hygiene.mjs   # EXTEND: add lz-red tree to targets
```

Gitignore already covers `*-workspace/**/samples/` and pycache/outputs generically [VERIFIED: .gitignore lines 29-36], so a new lz-red-workspace's tsc `samples/` output is ignored with NO gitignore edit. Per-run eval-capture globs are lz-refactor-specific but Phase 16 runs NO evals (that is Phase 20), so no gitignore change is needed this phase.

### Pattern 1: Clean-room converge-to-clean loop (the 0.0.2 model)

**What:** Owned facts are held only by isolated agents; only own-words facts cross back. [VERIFIED: .claude/agents/oracle.md, oracle-reviewer.md]

- **`oracle` agent** (open-ended lookup/survey): packaged input = a QUESTION + ONE book as an `.oracle/<book>/index.md` entry; navigates from the index, chunk-reads the chapter to EOF (Read truncates at a TOKEN cap, so it advances offset by lines ACTUALLY returned, never by requested limit), returns own-words facts with a `Sources/Confidence/Not covered` footer. Names are allowed; expression is not.
- **`oracle-reviewer` agent** (fidelity gate): packaged input = DRAFT_PATHS + `.oracle/<book>/index.md` + CONTENT_TYPE + AXES (with per-axis correct/partial/wrong anchors for non-default types); returns a raw JSON verdict array (`pass|revise|blocked`) driving a converge-to-clean loop. A round is CLEAN iff every entry is `pass` (or owner-accepted `blocked`) with no `error`.
- **3-round cap:** re-draft BLIND from category-only directives (never read `.oracle/`), re-gate; escalate to the owner only if unresolved after 3 rounds (0.0.2 cleared 24 surfaces this way with 0 escalations) [CITED: STATE.md Phase 10-03].

**Indexed book vs FLAT transcript (D-03):** the two Cooper talks have NO `index.md`. The `oracle` agent's Input contract is written around an `index.md` entry, but its Process step-1 chunk-read mechanics work on ANY file -- so the driver passes the FLAT transcript path directly and the agent chunk-reads it to EOF instead of navigating an index. For Phase 16 the Cooper talks are SECONDARY (light SEL/NAME use), so this wrinkle is low-stakes here; the heavy flat-transcript use is Phase 17.

**Planner note (oracle-reviewer contract scope):** the shipped oracle-reviewer's Input contract text names `plugins/lz-tdd/skills/lz-refactor/references/` and its DEFAULT axes are `refactoring-leaf` / `smell-leaf`. lz-red drafts live under `.../lz-red/references/` and are neither. The path text is descriptive, not enforced -- the agent scores whatever DRAFT_PATHS it is given -- so Phase 16 can invoke it AS-IS by passing CONTENT_TYPE=`other`/`principles` + lz-red draft paths + driver-supplied per-axis anchors (e.g. anchors for "should-naming is primary", "AAA and GWT are one skeleton", "one concept per test"). Editing the agent to generalize its path/axis text is OUT of Phase 16's minimal scope and would itself require subagent review (memory: agent-instruction edits need review). Prefer using it as-is with explicit anchors.

### Pattern 2: Instrument-first RED baseline (Nyquist) -- with the tsc-GREEN-on-empty caveat

**What:** Assert a machine-checkable RED baseline against the empty stubs, then watch it turn GREEN as content lands. [CITED: STATE.md Phase 7-01 / 08.1-01 precedent]

**Critical nuance (new finding):** the tsc extractor reports GREEN when it finds 0 fences (`extracted === 0 -> vacuously strict-clean`) [VERIFIED: extract-samples.mjs lines 155-160]. The current stubs have NO `ts` fences, so the tsc gate is already GREEN -- it is NOT the RED->GREEN completeness signal. The RED baseline must come from a lightweight lz-red completeness checker (mirroring `check-backing.mjs`) that is RED on the stubs and GREEN when the three slices are filled. The tsc gate is a "must stay/turn GREEN once fences exist" quality gate layered on top.

**Proposed `check-red-references.mjs` assertions (per ref, presence-based, ~60 lines node-builtin):**

| Ref | RED-now assertion (turns GREEN when filled) | Guard (must remain) |
|-----|---------------------------------------------|---------------------|
| `three-laws-and-test-selection.md` | `## Sources (placeholder)` heading removed; SEL content present (test list, one step, degenerate/starter, triangulation moves); >= 1 `ts`/`typescript` fence | Phase-18 deferral token (LAW/SEAM "Populated in Phase 18") still present -- guard against over-fill |
| `test-structure-and-assertions.md` | placeholder Sources removed; STR content present (AAA/GWT one-skeleton, assert-first, evident data, one-concept); >= 1 fence | Phase-17 deferral token (ASRT / four pillars) still present |
| `naming.md` | placeholder Sources removed; NAME content present ("should"/behavior primary, Osherove three-part alt, match-house-stance); >= 1 fence | none (fully Phase 16; marker fully resolved) |

### Pattern 3: Slice co-editing (fill the slice, preserve the seam)

**What:** Two of the three refs are co-edited across phases; Phase 16 fills only its slice and leaves the later-phase insertion points intact (D-04). [VERIFIED: stub markers on disk]

Exact fill-vs-leave map:

- `three-laws-and-test-selection.md`: **FILL** the running test list, one step at a time, degenerate/starter case, triangulation (SEL-01/02). **LEAVE** the Three Laws of TDD spine, one-step Law-2 framing, and the classify-first seam framing to Phase 18 (LAW-01/02, SEAM-01). The stub's "Sub-topics in scope" lists the Three Laws and classify-first -- those headings stay as Phase-18 markers, not filled prose.
- `test-structure-and-assertions.md`: **FILL** AAA/GWT one-skeleton, assert-first, evident data, one-concept-per-test (STR-01/02). **LEAVE** F.I.R.S.T., the Khorikov four pillars, and assertion-behavior content to Phase 17 (ASRT-01/02).
- `naming.md`: **FILL** everything (NAME-01 is wholly Phase 16); resolve its marker fully.

Owned-vs-no-oracle per surface (routes which surfaces take the oracle gate):

| Ref / slice | NO-ORACLE (blind + no-verbatim scan) | OWNED (oracle + oracle-reviewer gated) |
|-------------|--------------------------------------|-----------------------------------------|
| SEL-01 | Beck: test list, one step, degenerate-first | RCM Clean Code Ch.9: "one small step / only enough" rationale thread |
| SEL-02 | Beck: triangulation + the lz-tpp GREEN boundary | (none -- no-oracle only) |
| STR-01 | Wake (AAA), North (GWT) | (none) |
| STR-02 | Beck: assert-first, evident data | RCM Clean Code Ch.9: one-concept-per-test |
| NAME-01 | North ("should"/BDD), Osherove (three-part) | Metz 99 Bottles JS Ed Ch.2/naming: name-the-behavior rationale |

Every ref has at least a light owned rationale thread (RCM for SEL/STR one-step + one-concept; Metz for NAME), so all three route through the oracle loop on their owned portions, plus the no-verbatim scan on everything.

### Suggested Wave Structure

Mirrors the 0.0.2 instrument-first rhythm (Nyquist scaffold -> content -> finalize). The three content refs are INDEPENDENT (no cross-ref between SEL/STR/NAME within Phase 16), so their waves can parallelize.

- **Wave 0 (instrument-first, no oracle content):** stand up `lz-red-workspace` (copy extract-samples.mjs + tsconfig.json + package.json; repoint at flat lz-red refs; add vitest devDep + vitest types in tsconfig); author `check-red-references.mjs` to an asserted RED baseline; extend `check-hygiene.mjs` to include the lz-red tree (stays GREEN -- stubs are ASCII/email/verbatim clean). Gate: completeness checker RED (expected), tsc GREEN-on-empty, hygiene GREEN, `claude plugin validate .` exit 0.
- **Wave 1a/1b/1c (parallel content):** fill SEL slice; fill STR slice; fill naming.md. Each: oracle facts for owned threads -> author own words -> add minimal tsc-clean fence(s) -> oracle-reviewer gate owned surface -> no-verbatim scan -> tsc gate. Per-wave: completeness checker advances toward GREEN, tsc + hygiene GREEN.
- **Wave 2 (finalize / phase gate):** full battery GREEN (completeness checker GREEN for all three, tsc gate GREEN over all fences, hygiene GREEN), oracle-reviewer all-pass on owned surfaces, skill-reviewer PASS (incl. >= 1 unbiased from-scratch reviewer), `claude plugin validate .` exit 0.

Merging Wave 1a/1b/1c into one wave is fine if the executor prefers serial authoring; keep Wave 0 (instruments) and Wave 2 (gate) distinct.

### Anti-Patterns to Avoid

- **Filling deferred slices:** authoring the Three Laws spine (Phase 18) or the four pillars (Phase 17) into a co-edited stub. Guard with the completeness checker's "deferral token still present" assertions.
- **Per-source file fragmentation:** a doc per author (beck.md, wake.md, ...). ARCHITECTURE Anti-Pattern 1 -- lz-red has no enumerable catalog; keep the three clustered refs, cite sources inside.
- **Marking test-framework fences `ts ignore` to dodge tsc:** defeats SC-5 ("every TypeScript sample tsc --strict clean"). Make the fences actually compile (vitest types) instead.
- **Reading `.oracle/` in main/planner/executor context:** breaks the clean-room guarantee. Only the oracle/oracle-reviewer agents read it.
- **Drafting canon verbatim then "cleaning later":** own-words from the FIRST draft; the DST-04 trap reconstructs canonical one-liners word-for-word (see Pitfall 1).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| tsc --strict per-fence compile gate | A new extractor from scratch | Copy `extract-samples.mjs` (repoint path) | Handles unterminated-fence fail-loud, `ts ignore` skip, module-scope forcing, empty-catalog vacuous-GREEN, CommonMark-indented fences -- all already solved [VERIFIED]. |
| ASCII + work-email + no-verbatim scan | A per-skill hygiene copy | Extend the repo-global `check-hygiene.mjs` targets | Hygiene is repo-wide; one allowlist-inversion gate over all three skills; duplicating the allowlist logic invites drift. |
| Own-words distillation of owned books | Reading books in main context and paraphrasing | The `oracle` / `oracle-reviewer` agents | The clean-room firewall is the ONLY DST-04-safe path; main context reading `.oracle/` is the leak. |
| Vitest / TypeScript versions | Guessing from training data | The 2026-07-18 STACK.md pins (vitest 4.1.10, tsc 6.0.3) | Already verified against npm registry + vitest.dev; training data mixes versions (Vitest 4.x drift -- Pitfall 3). |
| Build tooling in the shipped plugin | Adding vitest/typescript to `plugins/lz-tdd` | The dev-only `lz-red-workspace` | Out-of-Scope hard rule: no build deps in `plugins/`; consumers bring their own Vitest. |

**Key insight:** the entire Phase-16 validation apparatus already exists as a proven 0.0.2 recipe. The work is COPY + REPOINT + one additive extension (lz-red tree into hygiene; vitest types into a copied tsconfig), not invention. The only genuinely new mechanical concern is the Vitest-types resolution for test-example fences (Pitfall 4).

## Common Pitfalls

### Pitfall 1: DST-04 near-verbatim copyright leak from canonical one-liners

**What goes wrong:** reference prose reproduces canonical formulations near word-for-word -- F.I.R.S.T., the "should ..." naming sentence, Arrange-Act-Assert / Given-When-Then glosses, Osherove's `UnitOfWork_StateUnderTest_ExpectedBehavior`, RCM's one-concept-per-test.
**Why it happens:** terse, memorable canon reconstructs itself almost verbatim in a blind draft. This trap has fired repeatedly in this repo (memory: pattern-leaf Intent near-verbatim DST-04 trap; Phase 7-09 push-down-method collision).
**How to avoid:** own-words from the first draft (never draft verbatim then soften). NAMES/acronyms are statable as facts; sentence-level phrasing must be original. Owned surfaces take the oracle-reviewer gate; ALL surfaces take the no-verbatim scan (`check-hygiene` axis c fails on any double-quoted run >= 120 chars) [VERIFIED: check-hygiene.mjs QUOTE_THRESHOLD=120].
**Warning signs:** a leaf sentence that would grep-match the source; an acronym gloss that reads like the book's own gloss.

### Pitfall 2: tsc --strict failures in hand-written test snippets

**What goes wrong:** shipped TS samples do not compile under strict (implicit any, unused vars, missing null checks, un-awaited promises).
**Why it happens:** hand-written snippets are not run through the compiler before ship.
**How to avoid:** every fence goes through the `lz-red-workspace` tsc gate before the phase closes; the extractor gives each fence its own module so sibling fences reusing the same symbol names never collide [VERIFIED: extract-samples.mjs]. LSP diagnostics are NOT authoritative -- run tsc.
**Warning signs:** the tsc gate reports RED over N modules; a fence relies on a global not in `lib: ["es2021"]`.

### Pitfall 3: Vitest 4.x API drift in examples

**What goes wrong:** examples use removed/deprecated APIs (mixed-version training data).
**Why it happens:** Vitest moves fast; 4.0 is current stable, 5.0 in beta.
**How to avoid:** Phase 16 uses ONLY the minimal `describe`/`it`/`expect` surface (D-10) -- the highest-drift APIs (`toMatchTypeOf` deprecated -> `toExtend`; `vi.restoreAllMocks()` narrowed to spyOn; type-level tests need `--typecheck` + `*.test-d.ts`) are Phase 17 concerns, not Phase 16. Keeping to the minimal surface sidesteps the drift entirely this phase [CITED: PITFALLS.md B4, vitest.dev 2026-07-18].
**Warning signs:** an example imports `it.todo`/`test.each`/`vi.*` (those belong to Phase 17); a matcher name not present in Vitest 4.x.

### Pitfall 4: Vitest-typed fences do not resolve types under tsc (new to lz-red)

**What goes wrong:** `import { it, expect } from 'vitest'` (or ambient `describe`/`it`) fails tsc because Vitest's types are not resolvable in the workspace -- a gap lz-refactor never hit (its examples had no test-framework imports).
**Why it happens:** the copied tsconfig (`moduleResolution: bundler`) resolves bare `vitest` imports from `node_modules`, but only if vitest is installed in the workspace root; global tsc alone with no local `node_modules` cannot resolve it.
**How to avoid:** add `vitest@4.1.10` to the workspace `devDependencies` and run `npm install`; use explicit `import { describe, it, expect } from 'vitest'` in fences (self-contained modules the extractor already treats as modules -- it appends `export {}` only when no import/export is present) [VERIFIED: extract-samples.mjs lines 138-143]. Alternative: `types: ["vitest/globals"]` in tsconfig for ambient usage.
**Warning signs:** tsc error "Cannot find module 'vitest'"; a fence uses `describe`/`it` with no import and no globals type configured.

### Pitfall 5: SEL-02 triangulation bleeds into lz-tpp's GREEN generalization

**What goes wrong:** the triangulation prose drifts into "add examples to GENERALIZE the implementation" (fake-it -> generalize), which is lz-tpp's GREEN facet, blurring the RED/GREEN boundary.
**Why it happens:** triangulation has two facets -- RED (add a second example to SELECT the next test) and GREEN (let extra examples pull the general solution out). lz-red owns only the RED facet.
**How to avoid:** the boundary sentence is load-bearing (SC-2, D-06). State explicitly that triangulation here SELECTS the next failing test; the generalization of production code is lz-tpp's job. The lz-refactor `beck-tdd-by-example.md` precedent does exactly this ("they belong to the green step ... the coach mentions them only to locate the seam") [VERIFIED: on disk].
**Warning signs:** the SEL-02 prose describes changing production code; no explicit "this is RED selection, not GREEN generalization" firewall sentence.

### Pitfall 6: ASCII-only + work-email hygiene regression

**What goes wrong:** Unicode (em-dash, curly quotes, arrows, checkmarks) or the maintainer work-email/domain in shipped content or commit identity.
**Why it happens:** AI prose favors em-dashes/Unicode; copy-paste from docs; commit-identity misconfig.
**How to avoid:** ASCII substitutes only (`--`, `->`, straight quotes); extend `check-hygiene` to the lz-red tree (allowlist-inversion: assert only `larsbrinknielsen@gmail.com` present); confirm git author/committer = public gmail before committing [VERIFIED: check-hygiene.mjs, AGENTS.md]. Re-run before committing agent-generated prose.
**Warning signs:** `check-hygiene` reports `file@byteN` non-ASCII; any non-allowlisted email token.

## Code Examples

These are MECHANICS/SHAPES only -- they deliberately do NOT author the owned content (that is the executor's clean-room job) and carry no verbatim source prose.

### tsc gate invocation (copied recipe, repointed)
```bash
# .claude/skills/lz-red-workspace/  -- extract-samples.mjs repointed at the flat lz-red refs
node extract-samples.mjs
# extracts every ts/typescript fence -> samples/<ref>-<n>.ts -> tsc --strict --noEmit -p tsconfig.json
# 0 fences => vacuous GREEN (why the completeness checker, not tsc, is the RED baseline)
```

### Minimal tsc-clean Vitest fence SHAPE (imports resolve once vitest is a devDep)
```ts
// SHAPE ONLY -- the real degenerate-case content is authored own-words at execute time.
import { describe, it, expect } from 'vitest';

describe('total', () => {
  it('should be zero for an empty basket', () => {
    // Arrange
    const items: number[] = [];
    // Act
    const result = total(items);
    // Assert
    expect(result).toBe(0);
  });
});

function total(items: number[]): number {
  return items.reduce((sum, n) => sum + n, 0);
}
```

### Completeness-checker skeleton (mirrors check-backing.mjs grain)
```js
// SHAPE ONLY -- node builtins, accumulate-then-exit, RED on stubs / GREEN when slices land.
let failures = 0;
const report = (ok, label, detail) => {
  if (!ok) {
    failures++;
  }

  console.log(`  [${ok ? "PASS" : "FAIL"}] ${label}${detail ? " -- " + detail : ""}`);
};

// per ref: placeholder Sources removed? required slice headings present? >= 1 ts fence?
// co-edited refs: deferral token for the LATER phase still present (guard over-fill)?

process.exit(failures === 0 ? 0 : 1);
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `toMatchTypeOf` for type assertions | `toExtend` / `toMatchObjectType` | Vitest 4 / expect-type v1.2 | Not used in Phase 16 (minimal surface); relevant Phase 17. |
| `vi.restoreAllMocks()` restores all mocks | Restores only `vi.spyOn()` mocks | Vitest 4 | Not used in Phase 16; relevant Phase 17. |
| TypeScript JS compiler | TS 7.0.x native (Go) port GA | 2026 | Examples are version-agnostic; pin 6.0.3 (proven) for the gate. |

**Deprecated/outdated (avoid even if training data suggests them):** `toMatchTypeOf`; `it.fails`/`test.fails` to represent RED; a separate assertion lib (chai/should); jsdom/happy-dom in unit examples; `ts-jest`/`babel-jest`. None belong in Phase 16 anyway.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | RCM *Clean Code* Ch.9 supplies the "one small step / only enough to fail" rationale thread for SEL-01. | Pattern 3, SEL-01 | Low -- oracle agent confirms/denies at execute; if absent, SEL-01 stands on Beck (no-oracle) alone. |
| A2 | RCM *Clean Code* Ch.9 supplies one-concept-per-test for STR-02. | Pattern 3, STR-02 | Low -- oracle-gated; if absent, attribute to Beck evident-data / Osherove one-logical-concept. |
| A3 | Metz *99 Bottles* JS Ed carries the name-the-behavior-not-the-method rationale for NAME-01. | Pattern 3, NAME-01 | Low -- oracle-gated; the primary NAME content is North/Osherove (no-oracle) regardless. |
| A4 | Osherove 3rd-ed (JS) relaxes the three-part convention toward readability; exact wording not pinned. | NAME-01 | Low -- present the classic three-part convention as the documented alternative + note the readability direction, do not quote a specific rule (MEDIUM per FEATURES.md). |
| A5 | oracle-reviewer scores lz-red drafts AS-IS via CONTENT_TYPE=other + driver anchors, no agent edit. | Pattern 1 | Low-Medium -- if the agent balks on non-lz-refactor paths, fall back to a reviewed agent-path generalization (out of minimal scope). |

**Note:** all owned-source facts (A1-A3) are `[ASSUMED]` here BY DESIGN -- they are verified in the clean room at EXECUTE time by the oracle/oracle-reviewer agents, never pre-read into planner/researcher context. The no-oracle core (Beck/Wake/North/Osherove framings) is `[CITED]` from the 2026-07-18 milestone research, not assumed.

## Open Questions

1. **Reuse the lz-refactor extractor vs stand up `lz-red-workspace` (D-11, planner's call).**
   - What we know: the lz-refactor `extract-samples.mjs` is hard-coded to CATALOG subdirs and walks only those; lz-red refs are FLAT; lz-red fences need vitest types the lz-refactor workspace lacks.
   - Recommendation: stand up `lz-red-workspace` (copy the recipe, repoint the path, add vitest). It isolates the two skills, front-loads the Phase-20 workspace dir, and avoids editing a closed-milestone artifact. The "bolt onto lz-refactor" alternative is a false economy (cross-skill coupling + vitest pollution).

2. **Vitest-types strategy for fences (Pitfall 4).**
   - What we know: `moduleResolution: bundler` resolves bare `vitest` imports only if vitest is installed locally.
   - Recommendation: explicit `import { describe, it, expect } from 'vitest'` + `vitest@4.1.10` devDep + `npm install`. Faithful, self-contained, honest teaching.

3. **RED baseline instrument (tsc is GREEN-on-empty).**
   - What we know: the tsc gate cannot be the completeness signal.
   - Recommendation: a lightweight `check-red-references.mjs` (presence-based, ~60 lines) is the RED->GREEN signal; tsc + hygiene are quality gates layered on top.

4. **oracle-reviewer contract scope for lz-red (A5).**
   - What we know: its Input contract names lz-refactor paths + refactoring/smell axes.
   - Recommendation: invoke as-is with CONTENT_TYPE=other + lz-red paths + per-axis anchors; do NOT edit the agent this phase.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | checkers + extractor | yes | v24.18.0 | -- (satisfies Vitest 4 engines >=24) |
| npm | dev-workspace install | yes | 11.16.0 | -- |
| tsc (global) | compile gate | yes | 6.0.3 | workspace-local install |
| typescript (dev dep) | pinned gate | pin needed | 6.0.3 | global 6.0.3 already present |
| vitest (dev dep, types) | fence type-check | install needed | 4.1.10 | ambient `vitest/globals` shim (less faithful) |
| `oracle` / `oracle-reviewer` agents | clean-room distillation + gate | yes | on disk | -- [VERIFIED: .claude/agents/] |
| `.oracle/` owned sources | own-words facts | yes | provisioned | -- [VERIFIED: `ls` only; clean-code/, 99-bottles-2e-js/, 2 Cooper .md] |

**Missing dependencies with no fallback:** none.
**Missing dependencies with fallback:** vitest (needs `npm install` in the new workspace; ambient shim is a lighter fallback). Everything else is present.

## Validation Architecture

> Nyquist validation is enabled (`workflow.nyquist_validation: true` [VERIFIED: config.json]). This section drives VALIDATION.md.

### Test Framework

For this repo, "test" of the shippable Markdown = deterministic node-builtin checkers + the tsc extractor. Vitest is the DEMO framework the examples are written in, NOT the harness runner.

| Property | Value |
|----------|-------|
| Framework | Plain Node.js ESM `.mjs` checkers (no jest/vitest for the harness) + `tsc --strict --noEmit` for example fences |
| Config file | `.claude/skills/lz-red-workspace/tsconfig.json` (copied; strict/noEmit + vitest types); no config for the checkers |
| Quick run command | `node .claude/skills/lz-red-workspace/tools/check-red-references.mjs` (completeness) |
| Full suite command | `node .../lz-red-workspace/extract-samples.mjs && node .../lz-red-workspace/tools/check-red-references.mjs && node .claude/skills/lz-refactor-workspace/tools/check-hygiene.mjs` |

### Phase Requirements -> Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SEL-01 | test list / one-step / degenerate content present + fence compiles | completeness + compile | `check-red-references.mjs` (three-laws slice) + `extract-samples.mjs` | Wave 0 |
| SEL-02 | triangulation-for-selection present WITH the lz-tpp GREEN firewall sentence | completeness (+ oracle-reviewer/skill-reviewer for the boundary) | `check-red-references.mjs` + skill-reviewer | Wave 0 / Wave 2 |
| STR-01 | AAA + GWT as one skeleton, two vocabularies; fence compiles | completeness + compile | `check-red-references.mjs` (structure slice) + `extract-samples.mjs` | Wave 0 |
| STR-02 | assert-first + evident data + one-concept present; fence compiles | completeness + compile | same as STR-01 | Wave 0 |
| NAME-01 | "should" primary + Osherove alt + match-house-stance; fence compiles | completeness + compile | `check-red-references.mjs` (naming) + `extract-samples.mjs` | Wave 0 |
| DST-04 (hygiene) | no verbatim book prose; ASCII; email allowlist over lz-red tree | deterministic scan + oracle-reviewer | `check-hygiene.mjs` (extended) + oracle-reviewer verdict | extend existing |

### RED baseline vs GREEN-when-content-lands

- **RED baseline (Wave 0):** `check-red-references.mjs` FAILS on the three stubs (placeholder Sources present, slice content absent, 0 fences). tsc gate reports GREEN-on-empty (0 fences -- NOT a completeness signal). hygiene GREEN (stubs are clean). This asserted RED is the Nyquist instrument-first baseline.
- **GREEN (content lands):** each filled slice flips its completeness assertions; each added fence keeps the tsc gate GREEN; hygiene stays GREEN; oracle-reviewer returns all-pass on owned surfaces. Phase gate = full battery GREEN + skill-reviewer PASS + `claude plugin validate .` exit 0.

### Sampling Rate

- **Per task commit:** `check-red-references.mjs` + `extract-samples.mjs` (fast, free, deterministic).
- **Per wave merge:** add `check-hygiene.mjs` (extended) + the oracle-reviewer verdict on any owned surface authored in that wave.
- **Phase gate:** full suite GREEN + oracle-reviewer all-pass + skill-reviewer (>= 1 unbiased) PASS before `/gsd:verify-work`.

### Wave 0 Gaps

- [ ] `.claude/skills/lz-red-workspace/package.json` -- devDeps `typescript@6.0.3` + `vitest@4.1.10` (copied recipe)
- [ ] `.claude/skills/lz-red-workspace/tsconfig.json` -- strict/noEmit + vitest types (copied + 1 edit)
- [ ] `.claude/skills/lz-red-workspace/extract-samples.mjs` -- copied, repointed at the FLAT lz-red references dir
- [ ] `.claude/skills/lz-red-workspace/tools/check-red-references.mjs` -- NEW completeness checker (RED baseline), covers SEL/STR/NAME
- [ ] `check-hygiene.mjs` -- EXTEND wideTargets + verbatimTargets to include the lz-red tree (additive, non-weakening)
- [ ] `npm install` in the new workspace (or global tsc 6.0.3 + ambient vitest shim fallback)

## Security Domain

> `security_enforcement` is not set to `false` in config (absent = enabled). Proportional to a Markdown-only docs phase; ASVS L1, block on high.

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V1 Encoding/Sanitization | yes | ASCII-only shipped tree; `check-hygiene` axis (a) fails on any byte > 0x7F (cp1252 mojibake) |
| V5 Input Validation | partial | Checkers accumulate-then-exit with fail-loud/fail-closed/scan-floor modes; the extractor fails loud on unterminated fences |
| V6 Cryptography | no | No secrets/crypto in a docs phase |
| V10 Malicious Code / Supply Chain | yes | Dev-only deps pinned exact (typescript 6.0.3, vitest 4.1.10); legitimacy-checked (both official-repo, no postinstall); NO deps in the shipped plugin |
| V14 Config | yes | tsconfig pinned + committed; no runtime config surface |

### Known Threat Patterns for a clean-room docs phase (STRIDE-lite -> the PLAN.md `<threat_model>` inputs)

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Verbatim copyright leak from owned books/talks (DST-04) | Information Disclosure | Clean-room `.oracle/` (agents only) + oracle-reviewer converge-to-clean + no-verbatim scan (>= 120-char quoted run) + own-words from first draft |
| Maintainer work-email / domain in shipped content or commit identity | Information Disclosure | Allowlist-inversion (`check-hygiene` axis b: only `larsbrinknielsen@gmail.com`); verify git author/committer = public gmail before commit; never write the forbidden value as a needle |
| Non-ASCII / mojibake in the shipped tree | Tampering (data corruption) | `check-hygiene` axis (a) ASCII-only, reported as `file@byteN` |
| A broken (non-tsc-strict) TS example shipping as a teaching artifact | Tampering (integrity of guidance) | `extract-samples.mjs` tsc --strict gate over every fence; one module per fence |
| Supply-chain risk from a dev dependency | Tampering / Elevation | Pin exact versions; legitimacy-check (done: both SUS=too-new false positives, no postinstall); dev-only, never in `plugins/` |
| Over-filling a deferred slice (17/18 content leaking into Phase 16) | (scope integrity) | Completeness-checker "deferral token still present" guard |

Block-on-high posture: a DST-04 verbatim hit, a non-allowlisted email, or a non-ASCII byte is a HARD failure (non-zero exit) and blocks the phase gate.

## Sources

### Primary (HIGH confidence -- read on disk this session)
- `.claude/agents/oracle.md` + `.claude/agents/oracle-reviewer.md` -- clean-room packaged-input contract, chunk-read-to-EOF mechanics, converge-to-clean verdict loop, names-allowed/expression-forbidden firewall, oracle-reviewer path/axis scope.
- `.claude/skills/lz-refactor-workspace/extract-samples.mjs` + `tsconfig.json` + `package.json` -- one-module-per-fence tsc --strict gate, empty-catalog vacuous-GREEN, `ts ignore` skip, module-scope forcing, pinned typescript 6.0.3.
- `.claude/skills/lz-refactor-workspace/tools/check-hygiene.mjs` -- ASCII + work-email allowlist-inversion + no-verbatim (>= 120-char quoted run) axes; wide vs verbatim target split; scan-floor.
- `plugins/lz-tdd/skills/lz-red/references/{three-laws-and-test-selection,test-structure-and-assertions,naming}.md` + `SKILL.md` -- the Phase-15 stubs, their content contracts, and the co-edit "Populated in Phase NN" markers.
- `plugins/lz-tdd/skills/lz-refactor/references/beck-tdd-by-example.md` -- the exact no-oracle flat-reference grain + the triangulation RED/GREEN firewall precedent.
- `.planning/codebase/{TESTING,CONVENTIONS}.md` -- dev-only-workspace harness pattern, ASCII/DST-04 conventions, checker error modes.
- `.planning/STATE.md` -- 0.0.2 clean-room precedent (Phase 7-01 instrument-first harness, 10-03 DST-04 sweep, 0 escalations), Phase 15 scaffold facts.
- `.planning/config.json` -- nyquist_validation true, code_review deep, ui_phase false.
- Session probes: node v24.18.0, npm 11.16.0, global tsc 6.0.3; `.oracle/` structure via `ls` (no prose read); package-legitimacy on vitest + typescript.

### Secondary (MEDIUM-HIGH -- inherited from 2026-07-18 milestone research, within freshness, NOT re-fetched per task instruction)
- `.planning/research/{STACK,FEATURES,PITFALLS,SUMMARY,ARCHITECTURE}.md` -- source-author framings (Beck test list/triangulation/assert-first/evident data; Wake AAA; North GWT/should; Osherove three-part) verified against authoritative talks/books/posts; Vitest 4.1.10 / typescript / node engines verified against npm registry + vitest.dev on 2026-07-18.

### Tertiary (LOW / oracle-gated at execute)
- Owned-source facts (RCM Clean Code Ch.9/Ch.2, Metz 99 Bottles JS Ed, Cooper talks) -- NOT read this session (clean-room firewall); distilled + verified by the oracle/oracle-reviewer agents at EXECUTE time. Tagged `[ASSUMED]` until then.

## Metadata

**Confidence breakdown:**
- Validation toolchain + clean-room mechanics: HIGH -- read directly on disk; proven in 0.0.2.
- No-oracle source content (Beck/Wake/North/Osherove): HIGH -- verified 2026-07-18, 1 day old.
- Owned source content (RCM/Metz/Cooper): deferred to execute-time oracle gate by design -- HIGH that the process is correct, ASSUMED on the specific facts until the oracle agents run.
- Wave structure + slice boundaries: HIGH -- derived from stubs + CONTEXT + 0.0.2 rhythm.

**Research date:** 2026-07-19
**Valid until:** ~2026-08-18 for the toolchain/version facts (stable); the source framings are stable canon. Re-verify Vitest 4.x API only if Phase 16 unexpectedly reaches beyond the minimal `it`/`expect` surface.
