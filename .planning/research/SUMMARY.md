# Project Research Summary

**Project:** lz-engineering-claude-plugins -- lz-red RED-phase TDD skill (lz-tdd@0.0.3)
**Domain:** Dual-mode Claude Code agent skill (Markdown-only, progressive disclosure) -- the RED step of red-green-refactor TDD
**Researched:** 2026-07-18
**Confidence:** HIGH

## Executive Summary

lz-red is the third dual-mode skill in the shipped `lz-tdd` plugin: the RED step (choose and write the next failing UNIT test well, then hand off to lz-tpp), sitting alongside lz-tpp (GREEN) and lz-refactor (REFACTOR). Experts build this kind of coach as a lean auto-triggering `SKILL.md` router plus a lazy-loaded `references/` tree -- exactly the shape both siblings already ship. The skill itself is Markdown-only: it adds NO build or runtime dependencies to the repo or plugin. TypeScript + Vitest are the DEMONSTRATION stack the examples are written in and validated against (`tsc --strict`-clean), never plugin dependencies. There is broad, high-confidence expert consensus on what a good RED move is (Beck, Robert C. Martin's Three Laws, Khorikov, Metz, Cooper, North, Osherove, Bernhardt, Feathers), so the content risk is low; the real risk is authoring discipline, not domain uncertainty.

The recommended approach is a numbered coach decision procedure on the Three Laws spine (classify-first -> detect house idiom -> pick the next test -> choose stance -> structure -> assert observable behavior -> fail for the right reason -> hand off to lz-tpp), rendered concretely in TS + Vitest. The one true differentiator is the ADAPTIVE testing-stance router: rather than impose one testing school, the coach reads the codebase and routes by structural control and seam availability -- pure functional core to Bernhardt (value-based, no doubles), object-with-collaborators to the Metz query/command matrix, no-seam legacy to Feathers (seam + characterization first) -- always matching the house idiom, with "listen to the tests" as the meta-rule (test pain is design feedback, not a cue to mock more). Scope is UNIT RED only; outside-in/acceptance/double-loop is explicitly deferred, and DHH's "test-induced-design-damage" framing is a hard-banned source.

The key risks are all authoring risks, and the top one is load-bearing: lz-red, lz-tpp, and lz-refactor sit on three adjacent steps of one loop and share the noun "test," so a prompt like "help me with this failing test" can auto-trigger the wrong skill. Mitigation is reciprocal near-miss guards in ALL THREE descriptions plus a cross-skill trigger eval, which simultaneously closes the carried-forward lz-tpp <-> lz-refactor reverse-pointer tech debt. The other recurring risks -- DST-04 near-verbatim copyright leaks from canonical one-liners, Vitest 4.x API drift (`toMatchTypeOf` is deprecated; type-level RED needs `--typecheck` + `*.test-d.ts`), `tsc --strict` failures, and ASCII/work-email hygiene -- are known repo traps with established mitigations from 0.0.1/0.0.2 (clean-room `.oracle/`, own-words drafting, compile gate, allowlist-inversion scan).

## Key Findings

### Recommended Stack

The skill ships Markdown only. TypeScript + Vitest are the demonstration/validation stack for examples, isolated to a dev-only workspace (mirroring the existing eval-workspace pattern) if CI validation is wanted -- never added to `plugins/lz-tdd`'s manifest. Consumers bring their own Vitest setup. Examples should state "tsc --strict-clean" rather than pin a TS version, since they use only stable strict-mode syntax that compiles across the 5.x -> 7.x line. Vitest is deliberately the single test dependency: one install gives structure (`describe`/`it`), assertions (`expect`), doubles (`vi.*`), type testing (`expectTypeOf`/`assertType`, bundled), and the watch-mode RED loop.

**Core technologies:**
- TypeScript (`--strict`): example language + authoritative compile gate -- locked milestone decision; examples are effectively version-agnostic, so state the strict-clean stance not a pin.
- Vitest 4.x: unit runner + assertions + doubles + type-test + watch loop in one dependency -- locked runner; no separate assertion/mock/type-test packages needed.
- fast-check (advanced, lazy leaf only): property-based RED -- state an invariant instead of enumerating cases; use vanilla `fc.assert(fc.property(...))` as the default, `@fast-check/vitest` `test.prop` is optional sugar.

Load-bearing API-to-RED mappings: `it.todo`/`test.todo` = the test list (RED backlog), `test.each` = triangulation, `expectTypeOf`/`assertType` + `--typecheck` in `*.test-d.ts` = type-level RED, `vi.*` = doubles WITH restraint (only at true seams), watch mode = the feedback loop. Explicitly avoid: a separate assertion lib, snapshot-as-default-assertion, over-mocking, `it.fails` to represent RED, `ts-jest`/`babel-jest`, and jsdom/happy-dom/testing-library (out of scope for unit RED).

### Expected Features

RED is a disciplined micro-decision loop, not "write a test." The nine table-stakes categories map 1:1 to the expected REQUIREMENTS.md categories. The load-bearing boundary: lz-red owns "what test, shaped how, asserting what, named how, failing how"; the moment the question is "what minimal code makes it pass" that is lz-tpp, and "improve working code without changing behavior" is lz-refactor.

**Must have (table stakes):**
- Test selection/ordering (test list, one-step, degenerate-first, triangulate) -- Beck. Triangulation here is the RED facet only (add an example to SELECT the next test); the GREEN facet (fake-it -> generalize) stays in lz-tpp -- do not duplicate.
- Test structure (AAA/GWT, assert-first, evident data, one concept) -- Wake, North, Beck.
- Assertion design (assert observable behavior; output/state/communication styles; four pillars) -- Khorikov, Metz, Cooper. The single highest-value RED skill.
- Test naming (behavior/BDD "should"; Osherove three-part alternative) -- North, Osherove.
- Fail-for-the-right-reason (Three Laws spine) -- Martin, Beck. The discipline the whole procedure hangs on.
- TS + Vitest mechanics woven through, `tsc --strict`-clean -- locked stack.
- lz-tpp seam + classify-first + forward pointer -- Martin; closes the RGR loop.
- Anti-pattern reference leaf (incl. Cooper over-mock/test-per-class) -- Cooper, Khorikov, Metz, Beck.
- Skill-effectiveness evals (trigger recall/specificity + RED-behavior accuracy) -- as in 0.0.1/0.0.2.

**Should have (competitive):**
- Adaptive testing-stance router (crown differentiator) -- route by structural control/seams to Bernhardt/Metz/Feathers, match house idiom, "listen to the tests." No mainstream tool does this; it is the milestone's core bet.
- "Listen to the tests" as design feedback -- reframes a hard-to-write test as a seam signal, not a reason to over-mock.
- Test Desiderata as a tradeoff lens (not dogma) -- matches the house "heuristic not law" voice.

**Defer (v2+ / add after validation):**
- Type-level RED leaf (`expectTypeOf`/`assertType`) -- TS differentiator; add once the core loop triggers cleanly.
- Property-based RED with fast-check -- advanced technique; add after example-based triangulation proves out.
- Reverse lz-tpp -> lz-red pointer -- bundle with the next lz-tpp edit (carried tech debt), but the description-guard work forces it earlier (see Pitfalls).
- Outside-in/acceptance/double-loop RED -- explicitly deferred by decision (unit RED only).
- Multi-language examples beyond TypeScript (FUT-02); GOOS mockist stance stays counterpoint only.

### Architecture Approach

lz-red reuses the exact progressive-disclosure shape of its siblings: a lean `SKILL.md` router (dual-mode by omission -- declare only `name` + `description`, so it both auto-triggers as coach and answers `/lz-tdd:lz-red` as reference) plus a lazy `references/` tree it links but never inlines. Crucially, it mirrors lz-tpp's GRAIN (a handful of flat single-topic docs, SKILL.md ~80-140 lines), NOT lz-refactor's large-catalog grain -- lz-red has no enumerable catalog, so a per-source file layout would be "catalog cosplay." Adding the skill needs no marketplace edit (skills are auto-discovered); only a `plugin.json` version bump to 0.0.3 and description/keyword extension.

**Major components:**
1. `SKILL.md` router + coach -- the triggering `description` (with two exclusion clauses), the inline numbered decision procedure, the stance-router detection step, and the lz-tpp seam handoff. The procedure IS the skill; keep it near lz-tpp size.
2. `references/` (~6-7 flat docs) -- three-laws-and-test-selection, test-structure-and-assertions, naming, anti-patterns, vitest-typescript-mechanics, principle-backing. One backing doc maps each recommendation to its source (not per-book files).
3. `references/testing-stance/` (one navigation subdir) -- the adaptive router: `README.md` (detection signals + route table, navigation-only) + three leaves (functional-core / message-matrix / seams-and-legacy). The only part with a real branch; three destinations justify the subdir.
4. Dev-only, not shipped: `.claude/skills/lz-red-workspace/` (vendored skill-creator eval harness + eval sets, per-run byproducts gitignored) and `.oracle/` additions (owned books, clean-room, oracle agents only).
5. Cross-skill wiring: NEW forward seam lz-red -> lz-tpp; reverse pointers added in lz-tpp's SKILL.md (lz-tpp -> lz-red, plus the deferred lz-tpp -> lz-refactor pointer in the same edit).

The Feathers stance is SHARED with lz-refactor, which already owns `refactoring-without-tests.md` -- same author, different phase (lz-red writes the first failing/characterization test when ADDING behavior to seamless legacy; lz-refactor pins behavior before RESTRUCTURING). Cross-link, do not copy.

### Critical Pitfalls

1. **Description collision with lz-tpp and lz-refactor (the load-bearing risk).** Adjacent RGR steps share the noun "test," so "help me with this failing test" fires the wrong skill or several at once. Avoid with reciprocal near-miss guards in ALL THREE descriptions (write-the-test vs make-it-pass vs restructure), wire the lz-red -> lz-tpp handoff + reverse pointers (this closes the carried-forward lz-tpp <-> lz-refactor reverse-pointer debt), and PROVE it with a cross-skill trigger eval. This is the only proof the boundary holds.
2. **The test that never fails / RED for the wrong reason.** A test passes on first run or fails on a compile/setup error instead of the assertion. Avoid by making "fail for the right reason" an explicit procedure step: run it, read the failure, confirm it fails on the assertion because behavior is missing, THEN hand off.
3. **Over-mocking / mockist over-coupling / one-test-per-class (Cooper's central diagnosis).** Avoid by mocking only true seams / unmanaged out-of-process deps, testing behavior through a port, and routing mock decisions through the Metz command/query matrix. GOOS stays a documented counterpoint, never the default.
4. **The FCIS brownfield trap.** Recommending "extract a functional core, test without mocks" where no seam exists forces a risky restructure just to write one test. The adaptive router IS the mitigation: detect seams first; no seam -> Feathers characterization + seam before the driving test.
5. **DST-04 near-verbatim copyright leak.** Canonical one-liners (F.I.R.S.T. gloss, Three Laws phrasing, Metz matrix cells, North's GWT) reconstruct almost verbatim in blind drafts -- a repeatedly-fired trap in this repo. Avoid with the clean-room `.oracle/` model (books read only by oracle agents; own-words synthesis crosses back), paraphrase every one-liner from the first draft, and gate on oracle-reviewer + no-verbatim scan.

Also carried forward as authoring gates: Vitest 4.x API drift (no `toMatchTypeOf`; use `toExtend`/`toMatchObjectType`; `vi.restoreAllMocks()` narrowed to spyOn; type tests need `--typecheck` + `*.test-d.ts`), `tsc --strict`-clean for every sample, ASCII-only + email allowlist-inversion hygiene, over-scoping beyond unit RED, and mirroring a bad house style (match idiom, not anti-patterns). Process gotchas: skip the GSD UI-SPEC gate (false-positive on "guidance"), keep the description under ~1500 load-bearing chars, `/reload-plugins` after committed skill edits, and every SKILL.md/leaf edit reviewed by a subagent including >=1 unbiased reviewer.

## Implications for Roadmap

Based on research, the suggested phase structure follows the 0.0.2 rhythm but leaner (no large catalog). The architecture research proposes six build phases (A-F); the pitfalls research names nine prevention phases (P-SRC, P-SCAF, P-COACH, P-ROUTER, P-TS, P-ANTI, P-SEAM, P-DIST, P-EVAL). Recommended: collapse to six phases, folding the fine-grained pitfall phases into the build phases they gate.

### Phase 1: Scaffold + description boundary
**Rationale:** Nothing depends on it, and the three-way-guarded description is the single most load-bearing decision -- author it early so downstream evals can prove it. Skip the GSD UI-SPEC gate (Markdown authoring, no frontend).
**Delivers:** `lz-red/` skeleton, SKILL.md router with dual-mode-by-omission frontmatter and reciprocal near-miss guards, reference stubs each carrying a per-doc content contract, `plugin.json` version bump 0.0.2 -> 0.0.3.
**Addresses:** Structural parity (dual-mode skill); out-of-scope guard (unit RED only).
**Avoids:** B3 description collision (guards authored here), B2 over-scoping. Gate: `claude plugin validate .` exits 0.

### Phase 2: Oracle setup + source distillation
**Rationale:** Content must be own-words from the first draft; distilling through the clean room before authoring prevents the DST-04 trap rather than trying to scrub it later.
**Delivers:** Owned books (RCM Clean Code, Metz 99 Bottles JS Ed) into git-ignored `.oracle/`; oracle-vs-no-oracle tiering per source; own-words RED-phase facts (Three Laws, F.I.R.S.T., Beck tactics, Metz matrix, Bernhardt FCIS, Feathers seams, Khorikov pillars, Cooper, North, Osherove, GOOS counterpoint, fast-check).
**Uses:** Clean-room `.oracle/` model; oracle/oracle-reviewer agents.
**Avoids:** B1/DST-04 near-verbatim leak. May partly parallel Phase 1.

### Phase 3: Reference content authoring (incl. stance router + TS/Vitest mechanics)
**Rationale:** The references carry all depth; they must exist before the coach procedure links into them. The stance router (the differentiator) and the TS + Vitest mechanics live here.
**Delivers:** The ~6-7 flat docs + the `testing-stance/` subdir (README navigation + three leaves) filled with own-words prose and `tsc --strict`-clean Vitest 4.x examples. Cross-link the Feathers leaf to lz-refactor's `refactoring-without-tests.md` (do not copy).
**Implements:** Components 2 and 3 (references + testing-stance subdir); assertion design routed by stance.
**Avoids:** Catalog over-decomposition (mirror lz-tpp grain), A2/A4/A5/A9 anti-patterns (content), B4 Vitest drift, B5 tsc failures, FCIS brownfield trap (router branches by seam).

### Phase 4: Coach procedure + seam wiring
**Rationale:** The inline numbered procedure is the product; it can only be written once reference links resolve. Seam wiring closes the RGR loop and pays the reverse-pointer debt.
**Delivers:** The 7-8 step SKILL.md procedure (classify -> detect idiom -> pick test -> stance route -> structure -> assert behavior -> fail-right -> hand off), the lz-red -> lz-tpp forward seam, and the reverse pointers in lz-tpp SKILL.md (lz-tpp -> lz-red plus the deferred lz-tpp -> lz-refactor pointer).
**Addresses:** Fail-for-the-right-reason step, classify-first, lz-tpp seam, coach-don't-drive (QUESTION vs COMMAND).
**Avoids:** A1 never-fails RED (explicit step), B3 (seam + reverse pointers).

### Phase 5: Distribution + hygiene
**Rationale:** A distinct ship gate -- distribution and copyright/ASCII/email hygiene are a separate concern from empirical eval.
**Delivers:** README `/lz-tdd:lz-red` entry, CHANGELOG 0.0.3, verified version bump, plugin-validator + skill-reviewer PASS, `validate --strict` exit 0, no-verbatim hygiene gate + email allowlist-inversion scan, ASCII-only confirmation, git author/committer = public gmail.
**Avoids:** B1 (final no-verbatim gate), B6 (ASCII + email hygiene). Requires >=1 unbiased reviewer; `/reload-plugins` after commit.

### Phase 6: Skill-effectiveness evals
**Rationale:** Eval the shippable skill last. The cross-skill trigger eval is the ONLY proof the description boundary holds; without it, trigger collisions ship silently.
**Delivers:** Vendored harness into `lz-red-workspace`; trigger-eval (positives = RED/next-failing-test/stance/triangulation prompts; negatives = green-step, refactor, debug-my-failing-test, generic write-a-test near-misses); behavior eval (names right test, routes correct stance, asserts behavior not implementation, fails for right reason, hands off, coaches not drives). Tune the `description` if specificity drops.
**Avoids:** B3 (verification gate), A1/A2/A4/A5/A6/A9 (behavior eval cases). Gate targets: 100% recall / 100% specificity (0.0.1/0.0.2 bar).

### Phase Ordering Rationale

- **Dependencies:** scaffold has none; oracle/distillation must precede content (own-words first); content must precede the coach (links must resolve); seam wiring needs the coach; distribution and evals gate the shippable artifact. This is the architecture research's A-F order with A+B allowed to partly parallel.
- **Grouping by architecture:** references + stance subdir cohere as one authoring phase; the coach procedure + seam wiring cohere as the router-and-glue phase. TS/Vitest mechanics fold into content authoring rather than standing alone (they render the principles, they are not a separate deliverable).
- **Avoids pitfalls by construction:** the description guards land in Phase 1 (earliest), clean-room distillation precedes any drafting (Phase 2), and the cross-skill trigger eval is a hard final gate (Phase 6) -- the three highest-impact risks are each addressed at the earliest phase where they can be.

### Research Flags

Phases likely needing deeper research during planning (`/gsd:plan-phase --research-phase <N>`):
- **Phase 3 (reference content / stance router):** the adaptive router is novel and the crown differentiator; the exact detection signals, route table, and how to encode "listen to the tests" as an actionable step (not a lecture) warrant design research. Also the exact Vitest 4.x type-level RED setup (`--typecheck`, `*.test-d.ts`, `toExtend` vs `toMatchObjectType`) should be re-verified against current docs at authoring time.
- **Phase 6 (evals):** cross-skill trigger boundary is empirical; near-miss prompt design (what exactly should NOT fire lz-red vs lz-tpp/lz-refactor) benefits from studying the shipped sibling descriptions and prior eval sets.

Phases with standard patterns (skip research-phase):
- **Phase 1 (scaffold):** the dual-mode-by-omission frontmatter and progressive-disclosure layout are established and observed on disk in both siblings.
- **Phase 2 (oracle/distillation):** the clean-room `.oracle/` model is a proven repo convention.
- **Phase 5 (distribution/hygiene):** the validator + skill-reviewer + allowlist-inversion recipe is established from 0.0.1/0.0.2.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | npm registry versions verified 2026-07-18; Vitest testing-types/features docs fetched; Markdown-only stance carried from prior milestones. |
| Features | HIGH | Every locked source framing verified against authoritative talks/books/posts. MEDIUM only on Osherove 3rd-ed (JS) wording nuance and Vitest API naming (pinned in STACK). |
| Architecture | HIGH | Both sibling skills and their workspaces read directly on disk; conventions observed not inferred. |
| Pitfalls | HIGH | Anti-patterns source-tied; authoring pitfalls grounded in repo memory (DST-04, description cap, UI-gate false-positive) proven in 0.0.1/0.0.2; Vitest 4.x drift verified against current docs. |

**Overall confidence:** HIGH

### Gaps to Address

- **Osherove 3rd-ed (JS) naming relaxation:** exact updated wording not pinned (MEDIUM). Handle during Phase 3 authoring -- present classic three-part convention as the documented alternative and the readability relaxation as a noted direction, not a quoted rule.
- **Stance-router detection heuristics on real repos:** detection signals are actionable but heuristic; conflicting signals or greenfield code need a documented fallback (house idiom -> functional-core default, and say so). Validate with brownfield/no-seam eval cases in Phase 6.
- **Cross-skill trigger boundary in practice:** the reciprocal-guard design is sound on paper; only the Phase 6 cross-skill trigger eval proves it. Treat the eval as a blocking gate, not a formality -- do not ship the description without it.
- **Reverse-pointer edit to lz-tpp:** modifying a shipped sibling's SKILL.md is a live-skill change; it needs subagent review (incl. unbiased) and `/reload-plugins` before relying on it in-session.

## Sources

### Primary (HIGH confidence)
- registry.npmjs.org dist-tags + manifests (fetched 2026-07-18) -- vitest 4.1.10, typescript 7.0.2, fast-check 4.9.0, @fast-check/vitest 0.4.1, expect-type 1.4.0; vitest engines + vite peer ranges.
- vitest.dev/guide/testing-types, /guide/features, /api/expect-typeof, /api/assert-type, /guide/migration.html (fetched 2026-07-18) -- type testing bundled, `--typecheck` + `*.test-d.ts`, watch-by-default/run-in-CI, `toMatchTypeOf` deprecated -> `toExtend`, `vi.restoreAllMocks()` narrowed to spyOn.
- `plugins/lz-tdd/skills/lz-tpp/SKILL.md` (81 lines) + `lz-refactor/SKILL.md` (180 lines) + their `references/**` and `*-workspace/**` (on disk) -- frontmatter convention, two-mode split, coach-procedure shape, flat-doc vs index+subdir grain, vendored eval harness + eval-set JSON formats, gitignore posture.
- `.planning/PROJECT.md` (lz-tdd@0.0.3 milestone, Key Decisions, Constraints) -- locked scope, adaptive-stance decision, source access model, seam tech debt, DHH ban.
- Beck (*TDD by Example*), Robert C. Martin (Three Laws, F.I.R.S.T.), Khorikov (*Unit Testing*), Metz + Owen ("Magic Tricks of Testing" / *99 Bottles*), Cooper ("TDD Where Did It All Go Wrong"), North (*Introducing BDD*), Wake (Arrange-Act-Assert), Bernhardt (*Boundaries* / *Fast Test Slow Test*), Feathers (*WELC*), Osherove (*Art of Unit Testing*), Beck (Test Desiderata), fast-check.dev -- domain facts as own-words high-confidence core; owned titles to be verified against `.oracle/` clean-room in the distillation phase.

### Secondary (MEDIUM confidence)
- Osherove *Art of Unit Testing* 3rd ed (JS, w/ Khorikov) -- direction of the readability relaxation confirmed; exact updated wording not pinned.
- Vitest API framing prior to the 2026-07-18 re-fetch -- upgraded to HIGH once pinned in STACK research.

### Tertiary (LOW confidence)
- None. GOOS mockist double-loop and DHH framing are intentionally excluded from scope (GOOS = counterpoint only; DHH = hard-banned source), not low-confidence findings.

---
*Research completed: 2026-07-18*
*Ready for roadmap: yes*
