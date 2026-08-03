# Roadmap: lz-engineering-claude-plugins

## Milestones

- [SHIPPED] **lz-tdd@0.0.1 First Release** -- Phases 1-5 (shipped 2026-07-04)
- [SHIPPED] **lz-tdd@0.0.2 lz-refactor Skill (Fowler + Kerievsky)** -- Phases 6-14 (shipped 2026-07-17)
- [IN PROGRESS] **lz-tdd@0.0.3 lz-red Skill (RED phase)** -- Phases 15-22 (8 of 9 complete; Phases 15-21 done 2026-08-03, Phase 22 added 2026-08-03 to close the three-way classifier before the milestone ships. PR #3 open and held for it.)

## Phases

<details>
<summary>[SHIPPED] lz-tdd@0.0.1 First Release (Phases 1-5) -- 2026-07-04</summary>

- [x] Phase 1: Marketplace & Plugin Scaffold (1/1 plans) -- completed 2026-07-02
- [x] Phase 2: TPP Source Distillation (2/2 plans) -- completed 2026-07-02
- [x] Phase 3: lz-tpp Skill Authoring (3/3 plans) -- completed 2026-07-02
- [x] Phase 4: Distribution & Hygiene (1/1 plan) -- completed 2026-07-02
- [x] Phase 5: Skill Effectiveness Evals (4/4 plans) -- completed 2026-07-03

Full phase detail archived at `.planning/milestones/lz-tdd@0.0.1-ROADMAP.md`
(requirements at `.planning/milestones/lz-tdd@0.0.1-REQUIREMENTS.md`, audit at
`.planning/milestones/lz-tdd@0.0.1-MILESTONE-AUDIT.md`).

</details>

<details>
<summary>[SHIPPED] lz-tdd@0.0.2 lz-refactor Skill (Fowler + Kerievsky) (Phases 6-14) -- 2026-07-17</summary>

A single `/lz-tdd:lz-refactor` dual-mode coach + reference operationalizing Fowler's
*Refactoring* (2nd ed) and Kerievsky's *Refactoring to Patterns*, completing the
red-green-refactor seam alongside `lz-tpp`. Grew beyond the original "Phases 6-11"
line via two inserted catalog phases (8.1 GoF, 8.2 Functional) and three later
eval/comparison phases (12-14).

- [x] Phase 6: lz-refactor Skill Scaffold & Progressive Disclosure (1/1 plans) -- completed 2026-07-04
- [x] Phase 7: Fowler Catalog (Refactoring, 2nd ed) (10/10 plans) -- completed 2026-07-05
- [x] Phase 8: Kerievsky Catalog (Refactoring to Patterns) (6/6 plans) -- completed 2026-07-07
- [x] Phase 8.1: GoF Design Patterns Catalog (INSERTED) (7/7 plans) -- completed 2026-07-07
- [x] Phase 8.2: Functional Catalog (INSERTED) (6/6 plans) -- completed 2026-07-07
- [x] Phase 9: Coach Behavior & Principle-Backing (4/4 plans) -- completed 2026-07-09
- [x] Phase 10: Distribution & Hygiene (4/4 plans) -- completed 2026-07-09
- [x] Phase 11: Skill-Effectiveness Evals (4/4 plans) -- completed 2026-07-10
- [x] Phase 12: Autonomous multi-round refactoring for whole-package sweeps (3/3 plans) -- completed 2026-07-14
- [x] Phase 13: lz-refactor vs base Opus eval: book authenticity & correctness (5/5 plans) -- completed 2026-07-15
- [x] Phase 14: Compare lz-refactor to mattpocock-skills code-review skill (5/5 plans) -- completed 2026-07-15

Full phase detail archived at `.planning/milestones/lz-tdd@0.0.2-ROADMAP.md`
(requirements at `.planning/milestones/lz-tdd@0.0.2-REQUIREMENTS.md`, audit at
`.planning/milestones/lz-tdd@0.0.2-MILESTONE-AUDIT.md`).

</details>

### [IN PROGRESS] lz-tdd@0.0.3 lz-red Skill (RED phase) (Phases 15-22)

**Milestone Goal:** Add a third dual-mode agent skill, `/lz-tdd:lz-red`, that coaches the
RED step of red-green-refactor -- choosing and writing the next failing unit test well,
adaptively matching the codebase's testing stance -- completing the RGR loop and handing
off to `lz-tpp` at the green step. Markdown-only; mirrors lz-tpp's lean grain; example
validation deps live only in a dev-only eval workspace.

- [x] **Phase 15: lz-red Skill Scaffold & Description Boundary** - Invocable dual-mode skill skeleton with the three-way-guarded triggering description (completed 2026-07-18)
- [x] **Phase 16: Source Distillation & Core RED References** - Clean-room own-words facts + test selection, structure, and naming references (completed 2026-07-19)
- [x] **Phase 17: Assertion Design, Stance Router & TS/Vitest Mechanics** - The differentiator: assert-behavior, the adaptive testing-stance router, Vitest mechanics, anti-patterns (completed 2026-07-19)
- [x] **Phase 18: Coach Procedure & lz-tpp Seam Wiring** - Inline RED decision procedure on the Three Laws spine + the lz-red <-> lz-tpp seam (completed 2026-07-20)
- [x] **Phase 19: Distribution & Hygiene** - Three-skill 0.0.3 ship: version bump, docs, validators, copyright/ASCII/email hygiene (completed 2026-07-20)
- [x] **Phase 20: Skill-Effectiveness Evals** - Trigger eval (incl. the cross-skill boundary) + RED-behavior eval vs baseline (completed 2026-07-21)
- [x] **Phase 21: Applied RED Eval in Real OSS Repos (multi-dimensional, 3-arm)** - APPLY the next failing test in real OSS TypeScript repos with short human prompts; no_skill / with_skill / invoke_skill arms (+ optional mattpocock tdd competitor); grade on many lift dimensions -- mirrors the lz-refactor Phase 13/14 apply evals (INSERTED 2026-07-22) (completed 2026-07-23)
- [ ] **Phase 22: Three-way classifier correctness (lz-refactor + lz-red)** - Make the three skills' request classifiers exhaustive, mutually exclusive, and keyed on one axis, so no request in the red-green-refactor loop falls through or is claimed by two skills (ADDED 2026-08-03)

## Phase Details

### Phase 15: lz-red Skill Scaffold & Description Boundary

**Goal**: The `lz-red` skill exists as an invocable dual-mode skill whose description reliably triggers on RED-phase intent without colliding with `lz-tpp` or `lz-refactor`.
**Depends on**: Nothing (first phase of milestone; builds on the shipped `lz-tdd` plugin)
**Requirements**: SKL-01, SKL-02, SKL-03
**Success Criteria** (what must be TRUE):

  1. `/lz-tdd:lz-red` is invocable and the skill loads from `plugins/lz-tdd/skills/lz-red/SKILL.md` with dual-mode-by-omission frontmatter (name + description only; `name` equals the directory).
  2. `SKILL.md` is a lean router (< 500 lines, near lz-tpp's size) using progressive disclosure -- reference stubs each carry a per-doc content contract; heavy content is deferred to lazy `references/` (flat docs plus one `testing-stance/` subdir).
  3. The `description` auto-triggers on "choose / write the next failing test" intent and carries reciprocal near-miss guards against lz-tpp (make the failing test pass) and lz-refactor (restructure working code), within the description char cap.
  4. `claude plugin validate .` exits 0.

**Plans**: 1/1 plans complete

- [x] 15-01-PLAN.md -- Scaffold lz-red: SKILL.md dual-mode router + v1 three-way-guarded description + 10 reference stubs (progressive disclosure)

### Phase 16: Source Distillation & Core RED References

**Goal**: RED-phase source facts are distilled clean-room into own words, and the core test-shaping references (selection, structure, naming) are authored with tsc-strict-clean examples.
**Depends on**: Phase 15
**Requirements**: SEL-01, SEL-02, STR-01, STR-02, NAME-01
**Success Criteria** (what must be TRUE):

  1. Owned books (RCM *Clean Code*, Metz *99 Bottles of OOP* JS Ed) and any transcribed talks live git-ignored in `.oracle/`; an oracle-access checkpoint (mirroring 0.0.2's D-09) is cleared and RED-phase facts are distilled own-words via the clean-room oracle / oracle-reviewer agents (main context never reads book prose).
  2. Guidance exists to keep a test list, take one small (one-step) step, and start from the degenerate / starter case (empty, zero, null); triangulation-for-selection is present and explicitly bounded against lz-tpp's fake-it / generalize (the GREEN facet).
  3. Arrange-Act-Assert and Given-When-Then are presented as one skeleton in two vocabularies (match the house idiom), plus assert-first, evident / intention-revealing test data, and one-concept-per-test guidance.
  4. Behavior / BDD "should ..." naming is documented as primary, with Osherove's three-part `UnitOfWork_StateUnderTest_ExpectedBehavior` convention as the documented alternative.
  5. Every TypeScript sample in these references is tsc --strict clean and contains no verbatim book prose (oracle-reviewer + no-verbatim scan pass).

**Plans**: 3/3 plans complete
**Wave 1**

- [x] 16-01-PLAN.md -- Instrument-first lz-red-workspace (repointed tsc extractor + check-red-references RED baseline + hygiene extension) with the package-legitimacy checkpoint

**Wave 2** *(blocked on Wave 1 completion)*

- [x] 16-02-PLAN.md -- Fill the SEL / STR / NAME slices own-words with tsc-strict Vitest examples (oracle-reviewer-gated owned surfaces + no-verbatim scan)

**Wave 3** *(blocked on Wave 2 completion)*

- [x] 16-03-PLAN.md -- Finalize gate: full battery GREEN + skill-reviewer PASS + claude plugin validate . exit 0

### Phase 17: Assertion Design, Stance Router & TS/Vitest Mechanics

**Goal**: The differentiator content exists -- assertion design tied to the adaptive testing-stance router, plus the TypeScript + Vitest mechanics and the anti-pattern / Test Desiderata references.
**Depends on**: Phase 16 (reuses the distilled own-words facts)
**Requirements**: ASRT-01, ASRT-02, ASRT-03, RTR-01, RTR-03, VIT-01, VIT-02, ANTI-01, ANTI-02
**Success Criteria** (what must be TRUE):

  1. Guidance exists to assert observable behavior, not implementation (Khorikov's four pillars, resistance-to-refactoring load-bearing), with output- / state- / communication-based assertion-style selection tied to the stance (output <-> functional core; state / communication <-> Metz boundary; characterization <-> Feathers legacy).
  2. A `references/testing-stance/` subdir provides a navigation README (detection signals + route table) plus three leaves -- Bernhardt (functional core-imperative shell), Metz (message matrix), Feathers (seams + characterization) -- with the Feathers leaf cross-linked to lz-refactor's `refactoring-without-tests.md`, not copied.
  3. The Metz query / command message matrix is captured as the design-agnostic rule for what to assert vs mock, and "listen to the tests" is framed as design feedback (test pain routes toward a functional core or a seam, not more doubles; GOOS as counterpoint only).
  4. Vitest 4.x mechanics are mapped to RED concepts (`it.todo` = test list, `test.each` = triangulation, `vi.*` doubles with restraint, watch mode = feedback loop); TS + Vitest examples appear throughout the references and are tsc --strict clean.
  5. An anti-pattern leaf names RED anti-patterns and the observable-behavior fix (incl. Ian Cooper's over-mock / test-per-class warning, testing private methods, multiple unrelated assertions, pass-immediately, snapshot-as-thinking, slow / order-dependent tests), and a Test Desiderata tradeoff lens matches the "heuristic not law" voice.

**Plans**: 6/6 plans complete

**Wave 1** (instrument-first RED baseline)

- [x] 17-01-PLAN.md -- Extend check-red-references.mjs to the Phase-17 RED baseline (six new file entries + flipped assertions slice + per-file requireFence + seams cross-link guard + co-edit Phase-18 deferral guards)

**Wave 2** (content -- parallel, disjoint files) *(blocked on Wave 1)*

- [x] 17-02-PLAN.md -- Assertion design slice (four pillars, resistance-to-refactoring load-bearing, F.I.R.S.T., output/state/communication selection) + principle-backing map [owned: F.I.R.S.T.]
- [x] 17-03-PLAN.md -- Testing-stance router: nav index + functional-core (Bernhardt) + seams-and-legacy (Feathers, cross-linked to lz-refactor) [no-oracle]
- [x] 17-04-PLAN.md -- Message matrix (Metz query/command, owned) + Vitest 4.x mechanics + brief ADV-01/02 forward-pointers [owned: Metz]
- [x] 17-05-PLAN.md -- Anti-patterns (Cooper owned) + listen-to-the-tests (GOOS counterpoint) + Test Desiderata [owned: Cooper]

**Wave 3** (finalize gate) *(blocked on Wave 2)*

- [x] 17-06-PLAN.md -- Finalize gate: full battery GREEN + orchestrator oracle-reviewer (3 owned surfaces) + skill-reviewer + claude plugin validate . exit 0

### Phase 17.1: Perform Phase 16 Beck follow up (INSERTED)

**Goal:** The lz-red skill's Kent-Beck-backed RED selection/structure surfaces that a free full-text essay actually backs are honestly re-tiered from no-oracle to `Owned; oracle-verified` across all four provenance surfaces (per-doc intro blockquote + `## Sources` block; `principle-backing.md` map row + Sources paragraph); recommendation CONTENT is unchanged, book-only-backed rows stay no-oracle, and the deterministic battery stays GREEN.
**Requirements**: SEL-01, SEL-02, STR-02 (already Complete in Phase 16 -- this phase is a provenance-tier upgrade to their source backing, NOT new coverage; their status stays Complete). It also upholds, but does NOT complete, the Phase-19 ship-hygiene and clean-room constraints (own-words / no-verbatim, ASCII-only, email-allowlist), which stay Pending and remain owned by Phase 19.
**Depends on:** Phase 17
**Plans:** 1/1 plans complete
**Wave 1** (single blind executor; orchestrator oracle-reviewer gate runs post-execution)

Plans:

- [x] 17.1-01-PLAN.md -- Blind owned-source tier upgrade of the Beck RED selection/structure surfaces (four consistency surfaces + Phase-16 note; battery GREEN), then orchestrator-driven oracle-reviewer gate per upgraded surface

### Phase 18: Coach Procedure & lz-tpp Seam Wiring

**Goal**: The inline RED decision procedure ties the references together on the Three Laws spine, routes the stance, fails for the right reason, and wires the lz-red <-> lz-tpp seam (closing the carried reverse-pointer tech-debt).
**Depends on**: Phase 17 (all reference links must resolve before the procedure links into them)
**Requirements**: LAW-01, LAW-02, RTR-02, SEAM-01, SEAM-02
**Success Criteria** (what must be TRUE):

  1. `SKILL.md` carries a numbered coach procedure on the Three Laws spine (Law 1 gates entry -- no production code before a failing test; Law 2 sizes the test -- only enough to fail, not-compiling counts; Law 3 is the lz-tpp handoff) that classifies RED vs GREEN vs REFACTOR first.
  2. The procedure includes a routing step that detects and matches the house test idiom always, routes by structural control / seam availability to the right stance, states the route chosen and why, and honors an optional override phrase (no CLI flag).
  3. A fail-for-the-right-reason step (watch the red bar, confirm the test fails on the asserted behavior not a compile / setup error or false green, F.I.R.S.T. baseline) precedes the forward lz-red -> lz-tpp handoff; the coach questions rather than drives (no auto-editing / running the suite unprompted).
  4. A reverse `lz-tpp -> lz-red` pointer (plus the deferred `lz-tpp -> lz-refactor` pointer, in the same edit) is added to the shipped lz-tpp `SKILL.md`, subagent-reviewed (incl. >= 1 unbiased from-scratch reviewer) before acceptance.

**Plans**: 6/6 plans complete

**Wave 1** (instrument-first RED baseline)

- [x] 18-01-PLAN.md -- Extend check-red-references.mjs + extract-samples.mjs to the Phase-18 RED baseline (flip the 4 deferral guards to positive topics + a NET-NEW `absent` guard, add SKILL.md coach-procedure coverage + a non-ignore ts-fence guard, add the SEAM-02 lz-tpp block, cover the SKILL.md fence), asserted RED

**Wave 2** (content -- parallel, disjoint files) *(blocked on Wave 1)*

- [x] 18-02-PLAN.md -- Fill the owned Three Laws spine + classify-first in three-laws-and-test-selection.md (blind, oracle-gated) + the LAW/SEAM backing rows in principle-backing.md [LAW-01, SEAM-01]
- [x] 18-03-PLAN.md -- Fill the two no-oracle LAW-02 procedure markers: F.I.R.S.T.-as-a-red-step-baseline (test-structure-and-assertions.md) + fail-for-the-right-reason (vitest-typescript-mechanics.md) [LAW-02]
- [x] 18-04-PLAN.md -- Add the reverse `lz-tpp -> lz-red` + deferred `lz-tpp -> lz-refactor` pointers to the shipped lz-tpp/SKILL.md in one edit (blind; orchestrator unbiased-review-gated) [SEAM-02]

**Wave 3** (SKILL.md coach procedure) *(blocked on Wave 2)*

- [x] 18-05-PLAN.md -- Replace the SKILL.md placeholder with the inline 6-step coach procedure on the Three Laws spine + the one tsc-strict VIT-02 worked example [LAW-01, LAW-02, RTR-02, SEAM-01, VIT-02]

**Wave 4** (finalize gate) *(blocked on Wave 3)*

- [x] 18-06-PLAN.md -- Finalize: full deterministic battery GREEN + the three orchestrator gates (oracle-reviewer on the owned Three-Laws surface; >= 1 unbiased review of the lz-tpp edit; >= 1 unbiased review of the lz-red SKILL.md coach procedure) + claude plugin validate . exit 0

### Phase 19: Distribution & Hygiene

**Goal**: The three-skill 0.0.3 is shippable -- version bumped, docs truthful, first-party validators pass, and copyright / ASCII / email hygiene is clean.
**Depends on**: Phase 18
**Requirements**: DST-01, DST-02, DST-03
**Success Criteria** (what must be TRUE):

  1. `plugin.json` is bumped to 0.0.3; README + CHANGELOG document lz-red as the RED step completing the three-skill red-green-refactor loop; the marketplace listing names all three skills.
  2. `claude plugin validate . --strict` exits 0 and the plugin-validator + skill-reviewer agents both PASS on lz-red.
  3. The shipped tree is ASCII-only with no verbatim book prose or talk transcripts (own-words, DST-04 clean-room via git-ignored `.oracle/`), every TypeScript sample is tsc --strict clean, and the maintainer work-email is absent (allowlist-inversion scan passes; author / committer = public gmail).

**Plans**: 2/3 plans executed

**Wave 1** (content edits + GA-7 hygiene forward-fix -- parallel, disjoint files)

- [x] 19-01-PLAN.md -- Three-skill 0.0.3 content: bump plugin.json to 0.0.3 + three-skill description/keywords, marketplace listing names all three skills, README lz-red RED-step section + three-skill loop lead, CHANGELOG [lz-tdd@0.0.3] entry (DST-01, DST-03)
- [x] 19-02-PLAN.md -- GA-7 work-domain anti-pattern forward-fix: rewrite the archived 06-SECURITY.md encoded needle to a non-encoding allowlist-inversion form + sweep tracked planning docs; no main history rewrite (DST-03)

**Wave 2** (finalize gate -- blocked on Wave 1)

- [x] 19-03-PLAN.md -- Finalize: deterministic battery + validate --strict GREEN + full-tree email allowlist-inversion + DST-04 attestation; orchestrator gates (plugin-validator + skill-reviewer on lz-red + targeted DST-04 clean-room re-sweep) run post-execution (DST-02, DST-03)

### Phase 20: Skill-Effectiveness Evals

**Goal**: The shipped lz-red skill is empirically validated -- it triggers on RED intent (including the three-way cross-skill boundary) and coaches the right RED move versus an unaided baseline.
**Depends on**: Phase 19
**Requirements**: EVL-01, EVL-02
**Success Criteria** (what must be TRUE):

  1. A trigger eval shows lz-red fires on RED-phase prompts and stays quiet on near-misses, INCLUDING a cross-skill trigger eval that proves the three-way boundary (lz-red vs lz-tpp vs lz-refactor) holds -- targeting the 0.0.1 / 0.0.2 bar (100% recall / 100% specificity).
  2. A RED-behavior eval shows the coach recommends the correct next-test / assertion move (right selection, structure, and assertion target; fails for the right reason; hands off to lz-tpp; coaches rather than drives) versus an unaided baseline.
  3. The vendored eval harness lives in a dev-only `lz-red-workspace` (per-run byproducts git-ignored, no build deps in `plugins/lz-tdd`); the `description` is tuned only if specificity drops, and the tuned skill is re-validated.

**Plans**: 3/3 plans complete

**Wave 1** (parallel -- disjoint files; instrument-first RED baseline then data GREEN)

- [x] 20-01-PLAN.md -- EVL-01: copy the vendored native-fixed harness + generic scripts + light-edited runners, adapt check-evals to the three-way boundary (both seams + reciprocal dual-write + email-allowlist), author trigger-eval / reciprocal-red / negatives, add the lz-red gitignore lines
- [x] 20-02-PLAN.md -- EVL-02: rewrite grade-run.mjs into the D-05-RUBRIC per-dimension hybrid grader (phrase-set matchers + borrowed negation-aware occursAffirmed + 2-dimension judge + alignment selfcheck), author the leaf-grounded RED-situation scenarios

**Wave 2** (finalize -- blocked on Wave 1)

- [x] 20-03-PLAN.md -- Scaffold EVAL-RESULTS.md, prove the full deterministic battery GREEN on the merged tree, present the ready-to-run gated commands (EVL-01 forward + reciprocal + EVL-02) and HALT before any metered run (D-11)

Post-execution: EVL-01 + D-09 widen RAN 2026-07-21; EVL-02 coaching-prose behavior benchmark RAN
2026-07-22 (substance-only Pass@1 with_skill 0.97 vs baseline 0.87; full-run vocabulary-inflated per the
unbiased review). Recorded in `.claude/skills/lz-red-workspace/EVAL-RESULTS.md`. This coaching-prose EVL-02
is a first-pass validation record; the user requested a stronger applied eval (Phase 21) before close.

### Phase 21: Applied RED Eval in Real OSS Repos (multi-dimensional, 3-arm) (INSERTED)

**Goal**: `lz-red` is validated on REAL applied work -- driving the next failing (red) test in real OSS
TypeScript repos with short, basic, human-style prompts -- across three arms and graded on many lift
dimensions, mirroring the lz-refactor Phase 13/14 apply evals (not coaching prose over synthetic
snippets).
**Depends on**: Phase 20 (reuses the eval workspace) and the lz-refactor apply harness at
`.claude/skills/lz-refactor-workspace/` (`run-e2e.mjs`, `tabulate-mechanical.mjs`, oracle-reviewer).
**Requirements**: EVL-03 (new; formalized in REQUIREMENTS.md at plan time).
**Success Criteria** (what must be TRUE):

  1. Short human-style APPLY prompts ("what should I test next here?", "add the next test") drive the
     next failing test in >= 1 real OSS TypeScript repo (Vitest/Jest); byte-identical across arms except
     the target path; real applied output (test file / diff) is captured and graded, not coaching prose.

  2. FIRST rounds run three OWN-skill arms: `no_skill` (baseline), `with_skill` (skill present + natural
     prompt -- tests whether the description AUTO-TRIGGERS and then helps), and `invoke_skill` (prompt
     force-starts with `/lz-tdd:lz-red ...` -- isolates content value); `with_skill` vs `invoke_skill`
     surfaces any trigger gap. The `mattpocock-skills:tdd` competitor arm is a LATER, CONTINGENT round
     -- run only after our own lift is measured, and only because the standalone check passed (confirmed
     2026-07-22: no hard sibling dep). Note the scope mismatch in the writeup: mattpocock tdd is a full
     red->green loop with an interactive seam-confirmation step, vs lz-red's RED-step-only coach.

  3. Produced tests are graded + compared on many lift dimensions: wall-clock time, tool usage, token
     usage (mechanical from stream-json meta); correctness (tsc --strict clean AND genuinely red for the
     right reason on current code); output quality; book/source authenticity vs the owned `.oracle/` RED
     sources via oracle-reviewer (DST-04); follows idioms; follows house style; follows TDD RED practices
     (right next test, fail-for-right-reason, assert observable behavior, classify-first, handoff).

  4. Harness reuses the lz-refactor apply pattern (synthetic base, stream-json meta, per-arm tool
     profiles); per-run byproducts git-ignored; no build deps in `plugins/lz-tdd`; the metered run is
     user-gated (D-11 / [[eval-run-approval-gate]]).

  5. Results recorded with Pass@k / Pass^k + >= 1 unbiased from-scratch reviewer; where any vocabulary
     proxy is used, the substance-only comparison is the headline (lesson carried from Phase 20 EVL-02).

**Plans**: 4/4 plans complete

**Wave 1**

- [x] 21-01-PLAN.md -- Parameterize run-e2e.mjs tracked skill names off suite.json + author the Gilded Rose `Conjured` RED apply suite (non-leading, byte-identical-across-arms, D-06 target shape) + git-ignore its run tree + formalize EVL-03 in REQUIREMENTS.md

**Wave 2** *(blocked on Wave 1)*

- [x] 21-02-PLAN.md -- grade-red.mjs: the D-06 correctness classifier (differential tsc --strict + the target's own runner JSON -> genuinely_red / false_green / drove_to_green / compile_error / collection_error / no_tests / wrong_reason) + fixtures/ + `--selfcheck`

**Wave 3** *(blocked on Wave 2)*

- [x] 21-03-PLAN.md -- tabulate-mechanical-red.mjs (mechanical dims + auto-trigger gap + Pass@k/Pass^k on the correctness gate) + selfcheck-red.mjs (composition/prompt-parity/worktree base/parse/classifier/lz-refactor regression) + EVAL-RESULTS.md scaffold

**Wave 4** *(blocked on Wave 3)*

- [x] 21-04-PLAN.md -- Phase gate (full battery GREEN + repos pristine + plugins/lz-tdd untouched) + RUN-GATE.md + the blocking-human HALT before the metered 3-arm run (eval-run-approval-gate)

## Progress

**Execution Order:** Phases execute in numeric order: 15 -> 16 -> 17 -> 18 -> 19 -> 20 -> 21.

| Phase | Milestone | Plans Complete | Status | Completed |
| ----- | --------- | -------------- | ------ | --------- |
| 1. Marketplace & Plugin Scaffold | lz-tdd@0.0.1 | 1/1 | Complete | 2026-07-02 |
| 2. TPP Source Distillation | lz-tdd@0.0.1 | 2/2 | Complete | 2026-07-02 |
| 3. lz-tpp Skill Authoring | lz-tdd@0.0.1 | 3/3 | Complete | 2026-07-02 |
| 4. Distribution & Hygiene | lz-tdd@0.0.1 | 1/1 | Complete | 2026-07-02 |
| 5. Skill Effectiveness Evals | lz-tdd@0.0.1 | 4/4 | Complete | 2026-07-03 |
| 6. lz-refactor Skill Scaffold & Progressive Disclosure | lz-tdd@0.0.2 | 1/1 | Complete | 2026-07-04 |
| 7. Fowler Catalog (Refactoring, 2nd ed) | lz-tdd@0.0.2 | 10/10 | Complete | 2026-07-05 |
| 8. Kerievsky Catalog (Refactoring to Patterns) | lz-tdd@0.0.2 | 6/6 | Complete | 2026-07-07 |
| 8.1. GoF Design Patterns Catalog (INSERTED) | lz-tdd@0.0.2 | 7/7 | Complete | 2026-07-07 |
| 8.2. Functional Catalog (INSERTED) | lz-tdd@0.0.2 | 6/6 | Complete | 2026-07-07 |
| 9. Coach Behavior & Principle-Backing | lz-tdd@0.0.2 | 4/4 | Complete | 2026-07-09 |
| 10. Distribution & Hygiene | lz-tdd@0.0.2 | 4/4 | Complete | 2026-07-09 |
| 11. Skill-Effectiveness Evals | lz-tdd@0.0.2 | 4/4 | Complete | 2026-07-10 |
| 12. Autonomous multi-round refactoring for whole-package sweeps | lz-tdd@0.0.2 | 3/3 | Complete | 2026-07-14 |
| 13. lz-refactor vs base Opus eval: book authenticity & correctness | lz-tdd@0.0.2 | 5/5 | Complete | 2026-07-15 |
| 14. Compare lz-refactor to mattpocock-skills code-review skill | lz-tdd@0.0.2 | 5/5 | Complete | 2026-07-15 |
| 15. lz-red Skill Scaffold & Description Boundary | lz-tdd@0.0.3 | 1/1 | Complete    | 2026-07-18 |
| 16. Source Distillation & Core RED References | lz-tdd@0.0.3 | 3/3 | Complete    | 2026-07-19 |
| 17. Assertion Design, Stance Router & TS/Vitest Mechanics | lz-tdd@0.0.3 | 6/6 | Complete   | 2026-07-19 |
| 18. Coach Procedure & lz-tpp Seam Wiring | lz-tdd@0.0.3 | 6/6 | Complete    | 2026-07-20 |
| 19. Distribution & Hygiene | lz-tdd@0.0.3 | 3/3 | Complete    | 2026-07-20 |
| 20. Skill-Effectiveness Evals | lz-tdd@0.0.3 | 3/3 | Complete    | 2026-07-21 |
| 21. Applied RED Eval in Real OSS Repos (multi-dimensional, 3-arm) | lz-tdd@0.0.3 | 4/4 | Complete    | 2026-07-23 |

### Phase 22: Three-way classifier correctness (lz-refactor + lz-red)

**Goal**: Every request in the red-green-refactor loop lands with exactly one skill. The three
sibling classifiers are exhaustive (nothing falls through), mutually exclusive (no two skills
claim the same request), and keyed on a single axis (what the developer is asking for), so the
loop the milestone claims to complete actually closes.

**Depends on**: Phase 18 (authored the lz-red coach procedure and the lz-tpp seam), quick task
260803-53q (closed TD-02 and surfaced this)

**Requirements**: CLS-01, CLS-02, CLS-03, CLS-04 (to be added to REQUIREMENTS.md during planning)

**Origin**: Raised by the unprimed acceptance reviewer on quick task 260803-53q, 2026-08-03. Full
finding list and the orchestrator's pre-existing-vs-regression adjudication in
`.planning/quick/260803-53q-close-td-02-widen-the-lz-refactor-seam-s/260803-53q-REVIEW.md`. The
defect is NOT introduced by 0.0.3 -- it has been public since lz-refactor shipped in lz-tdd@0.0.2.
The available two-line patch was deliberately declined in favour of fixing the classifier as a
unit.

**Success Criteria** (what must be TRUE):

  1. **Exhaustive.** Every one of the reviewer's eight traced requests lands with exactly one
     skill, including the two that currently fail: "I just finished making a test pass. What now?"
     (fires no lz-refactor branch today, so lz-red's catch-all takes it and the refactor step is
     skipped at the moment it exists for) and "I want to add a new behavior to this module" with
     nothing failing yet (routes nowhere; the destination the lz-refactor description names is
     lz-tpp, which declines it by its own description).
  2. **Mutually exclusive across skills.** At most one of the three step-1 procedures claims any
     given request. Today lz-refactor is the only sibling whose "otherwise" is a positive
     condition rather than a catch-all, so it is the only one that can lose a request it owns --
     while lz-red and lz-tpp both end with an "otherwise ... is this skill" catch-all, which is
     the collision half of the same defect.
  3. **Single axis.** No routing branch keys on test state; all key on the ask. Includes the two
     surviving test-state conditions left out of scope by 260803-53q: `lz-refactor/SKILL.md:30`
     (`## Two modes` coach gate, which also contradicts step 5's own untested-code branch) and any
     equivalent in lz-red or lz-tpp.
  4. **Test code has a named owner.** "Is this a good test?" routes to lz-red, not to lz-refactor's
     Extract Function advice. Today lz-red claims it by description while lz-refactor's branch (c)
     captures it, because branch (b) hands off only the *next failing* test.
  5. **Body and description agree, per skill.** lz-refactor's body currently drops the
     description's "or otherwise ADD or CHANGE behavior" clause, and `SKILL.md:139` cites a step-1
     rule that step 1 does not contain. Every in-body handoff matches its own frontmatter.
  6. **Guarded.** A checker gate holds the routing semantics, not merely token presence -- the
     TD-02 guard's measured ceiling (a renamed heading alone satisfies a bare `/lz-red/` needle)
     is closed for the new gates. Mutation-tested in both directions.
  7. Both shipped skills pass a fresh acceptance review with at least one from-scratch unprimed
     reviewer, and the full battery plus `claude plugin validate .` stay GREEN.

**Also in scope** (cheap, same files, found by the same review): step 6's reference router omits
`refactoring-without-tests.md` and `beck-tidy-first.md`; `lz-refactor/SKILL.md:81` names a section
that does not exist.

**Risk**: This edits two SHIPPED skills and changes triggering-adjacent prose. A trigger-eval round
may be needed -- EVL-01's reciprocal sets exist and are the natural regression check. Treat any
`description` frontmatter change as requiring one.

**Plans:** 0 plans

Plans:

- [ ] TBD (run /gsd-plan-phase 22 to break down)

---
*Roadmap created: 2026-07-02 | lz-tdd@0.0.1 shipped: 2026-07-04 | lz-tdd@0.0.2 shipped: 2026-07-17 | lz-tdd@0.0.3 roadmap added: 2026-07-18 (Phases 15-20); Phase 21 (applied eval) inserted 2026-07-22. Per-milestone phase detail lives in `.planning/milestones/`.*
