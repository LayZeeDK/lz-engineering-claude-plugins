# Phase 18: Coach Procedure & lz-tpp Seam Wiring - Research

**Researched:** 2026-07-20
**Domain:** Claude Code agent-skill authoring (Markdown-only), instrument-first Nyquist validation, clean-room provenance
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** The coach procedure is authored INLINE in `SKILL.md`, replacing the Phase-18 placeholder
  -- NOT a new reference file. (SKL-02 lean router; matches lz-tpp + lz-refactor precedent.) Est.
  ~130-180 lines, well under the 500 cap.
- **D-02:** Procedure shape mirrors the shipped precedents -- a compact numbered decision tree,
  cross-links file-level to already-existing references (never restating their content). Step order
  follows ROADMAP SC 1-3: (1) classify RED vs GREEN vs REFACTOR; (2) Three Laws spine (Law 1 gates
  entry, Law 2 sizes the test); (3) detect + match the house idiom and route the stance (RTR-02);
  (4) structure the test + assert observable behavior (points at Phase-16/17 slices); (5)
  fail-for-the-right-reason (LAW-02); (6) forward handoff to lz-tpp (Law 3 / SEAM-01). Closing
  "coach by default; hand off, do not drive" paragraph mirrors lz-refactor's.
- **D-03:** Classify every request into red / green / refactor BEFORE any test is written. Failing
  test to make pass -> hand off to lz-tpp and stop; already-passing code to clean up -> hand off to
  lz-refactor; otherwise the next failing test is lz-red. Reuse the existing SKILL.md "RED vs the
  green step ... and the refactor step" section (Phase 15) rather than restating it. Forward
  `lz-red -> lz-tpp` handoff is Law 3.
- **D-04:** Owned distilled Three Laws prose lands in `three-laws-and-test-selection.md`; the SKILL.md
  coach procedure carries only the compact spine (Law 1 / Law 2 / Law 3 as steps) and points at the
  leaf. Same reference-carries-content / SKILL.md-carries-orchestration split as lz-refactor Phase 9.
- **D-05 (judgment call, gate-confirmed):** TARGET tier for the Three Laws spine = `Owned;
  oracle-verified` against Robert C. Martin, *Clean Code* Ch. 9. The Law-3-as-lz-tpp-handoff reframe
  is lz-red orchestration (no-oracle). The owned surface goes through the orchestrator-driven
  oracle-reviewer gate; if the gate finds Ch. 9 does not adequately cover a specific Law statement,
  that statement falls back to no-oracle high-confidence core (the 17.1 gate-decides pattern).
- **D-06:** The routing step always detects + matches the house test idiom first, then routes by
  structural control / seam availability via the `testing-stance/README.md` route table (open the
  leaf to act; index is navigation-only), and STATES the route chosen and why.
- **D-07:** The optional override is a NATURAL-LANGUAGE phrase, NOT a CLI flag. Honor a stated stance
  preference over the auto-route and still state the route chosen. No rigid syntax invented.
- **D-08:** The fail-for-the-right-reason step precedes the forward lz-tpp handoff: confirm the test
  fails on the ASSERTED BEHAVIOR (an `AssertionError`), not on a compile / import / setup error or a
  false green, with F.I.R.S.T. as the test-quality baseline. The coach QUESTIONS (explains which
  failure is the right one) rather than driving; it does not run the suite unprompted.
- **D-09:** Add BOTH reverse pointers to `plugins/lz-tdd/skills/lz-tpp/SKILL.md` in ONE edit: the
  `lz-tpp -> lz-red` pointer AND the deferred `lz-tpp -> lz-refactor` pointer. Shape: a short
  red-green-refactor-seam pointer section naming lz-red (red step) and lz-refactor (refactor step),
  mirroring the "vs the green step" sections lz-red and lz-refactor already carry. lz-tpp currently
  has NO cross-skill pointer section, so this is additive.
- **D-10:** The lz-tpp edit is subagent-reviewed with >= 1 UNBIASED from-scratch reviewer BEFORE
  acceptance. Because gsd-executor has no Agent/Task tool, the review is an ORCHESTRATOR gate run
  AFTER the executor returns its blind edit -- plan it as "orchestrator gates after executor
  returns," never "executor spawns the reviewer." Making the edit LIVE requires a human
  `/reload-plugins`, deferred to ship (Phase 19).
- **D-11:** The coach procedure carries ONE compact tsc-strict Vitest worked example walking the RED
  path end to end (classify -> pick the degenerate case -> structure AAA -> assert observable
  behavior -> confirm it fails for the right reason -> hand off to lz-tpp). Closes the VIT-02
  "throughout SKILL.md" clause deferred from Phase 17. Covered by the tsc extractor + a SKILL.md
  ts-fence guard.
- **D-12:** Clean-room DST-04 -- the owned Three Laws surface (Clean Code Ch. 9) is distilled
  own-words BLIND and gated by the orchestrator-driven oracle-reviewer (converge-to-clean, 3-round
  cap); all other Phase-18 prose is authored blind as orchestration and passes the deterministic
  no-verbatim scan only. Main context NEVER reads `.oracle/` prose.
- **D-13:** Instrument-first -- extend `check-red-references.mjs` in place (no sibling): flip the four
  Phase-18 deferral guards into positive content assertions, add SKILL.md coach-procedure content
  tokens + a SKILL.md ts-fence assertion (VIT-02), add a guard asserting the lz-tpp reverse pointer.
  The Phase-17.1 D-05 provenance-honesty gate stays intact. Whether the checker gains a SKILL.md
  FILES entry vs a separate SKILL.md block, and whether Phase 18 opens with a fresh Wave-0 RED
  baseline, is the planner's call; the tsc gate + no-verbatim scan are non-negotiable. NO build dep
  enters `plugins/lz-tdd`.
- **D-14:** Co-edit, do not split -- Phase 18 fills only its LAW / RTR-02 / SEAM slices + the VIT-02
  SKILL.md example, leaving the Phase-16/17 content intact. After Phase 18, no Phase-18 deferral
  markers should remain in the four co-edited stubs.

### Claude's Discretion

- Exact own-words wording of the Three Laws spine (executor drafts blind; oracle-reviewer gates the
  owned surface only), the routing/override phrasing, and the classify-first / handoff prose.
- Exact minimal tsc-strict Vitest worked example in SKILL.md (within D-11 + tsc --strict).
- Exact placement + phrasing of the lz-tpp reverse-pointer section (D-09), subject to the D-10 review
  gate.
- Plan / wave breakdown: e.g. instrument extension -> owned Three-Laws surface (oracle-gated) ->
  SKILL.md procedure + example -> lz-tpp seam edit (review-gated) -> finalize gate.
- Whether the checker adds a SKILL.md FILES entry or a separate SKILL.md check block.

### Deferred Ideas (OUT OF SCOPE)

- plugin.json 0.0.3 bump + README + CHANGELOG + first-party validators + the ASCII/no-verbatim/email
  hygiene sweep across the three-skill tree (DST-01/02/03) -> Phase 19. Making the Phase-18
  shipped-skill edits LIVE (`/reload-plugins`) is a human action at that ship.
- Trigger eval (incl. the three-way cross-skill boundary) + RED-behavior eval vs baseline + any
  description tuning (EVL-01/02) -> Phase 20.
- Type-level RED leaf (`expectTypeOf` / `assertType`) -> ADV-01 (Future Requirements, post-0.0.3).
- Property-based RED leaf (`fast-check`) -> ADV-02 (Future Requirements, post-0.0.3).
- lz-refactor "Metz layer" enrichment (FUT-METZ-REFACTOR) -> post-0.0.3 lz-refactor milestone.
- Any new SEL/STR/ASRT/RTR-01/RTR-03/NAME/ANTI reference CONTENT -- those slices are Complete
  (Phases 16/17/17.1); Phase 18 only ties into them and adds the spine/seam.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| LAW-01 | Three Laws of TDD as the RED spine -- Law 1 gates entry (no production code before a failing test), Law 2 sizes the test (only enough to fail; not-compiling counts), Law 3 is the lz-tpp handoff | Owned Three-Laws prose fills `three-laws-and-test-selection.md:91` insertion point (D-04); SKILL.md carries the compact spine (steps 2 + 6). Deterministic content tokens + orchestrator oracle-reviewer gate on the owned surface (D-05/D-12). |
| LAW-02 | Fail-for-the-right-reason -- watch the red bar; confirm the test fails on the asserted behavior, not a compile / setup error or false green; F.I.R.S.T. as the baseline | The "read the red bar" mechanic already lives in `vitest-typescript-mechanics.md:83`; F.I.R.S.T. is already owned in `test-structure-and-assertions.md:107`. Phase 18 ties both to the procedure step (fills the two Phase-18 markers) + SKILL.md step 5. |
| RTR-02 | Coach routing step -- detect + match the house idiom always; route by structural control / seam availability; state the route + why; honor an optional NL override (no CLI flag) | Wires the complete `testing-stance/README.md` route table (Phase-17) into SKILL.md step 3. Content complete; Phase 18 only adds the SKILL.md wiring + override phrasing. |
| SEAM-01 | Classify-first (RED vs GREEN vs REFACTOR) + forward `lz-red -> lz-tpp` handoff in the coach procedure | Reuses the existing SKILL.md "RED vs the green step" section (D-03); SKILL.md steps 1 + 6. |
| SEAM-02 | Reverse `lz-tpp -> lz-red` pointer added to the shipped lz-tpp skill (+ deferred `lz-tpp -> lz-refactor`, same edit); subagent-reviewed before acceptance | Additive pointer section in `lz-tpp/SKILL.md` (D-09); new checker guard asserts both pointers; orchestrator unbiased review (D-10). |
| VIT-02 (SKILL.md clause) | TypeScript + Vitest examples throughout SKILL.md, tsc --strict-clean | ONE worked example in the coach procedure (D-11); tsc extractor extended to cover the SKILL.md fence + SKILL.md ts-fence checker guard. |
</phase_requirements>

## Summary

Phase 18 is Markdown-only skill authoring plus a dev-only instrument extension. It converts the
lz-red skill from "references authored, procedure deferred" into a working RED coach: it fills the
inline coach decision procedure in `SKILL.md`, fills the four co-edited Phase-18 insertion points in
the references, and closes the reverse-pointer tech-debt in the shipped `lz-tpp/SKILL.md`. Every
locked decision (D-01..D-14) is already resolved in CONTEXT; this research CONFIRMS the approach,
maps the exact fill targets and marker flips, and surfaces the traps -- it does NOT re-open decisions.

The work is entirely precedented in-repo. lz-refactor (Phase 9) and lz-tpp are two shipped inline
coach procedures with an identical shape: a compact numbered decision tree that classifies against
the sibling seams first, links file-level to references without restating them, and closes with a
"coach by default; drive only when asked" paragraph. The lz-red procedure is that shape applied to
the RED step. The instrument (`check-red-references.mjs`, `extract-samples.mjs`, the
lz-refactor-workspace `check-hygiene.mjs`, and the `provenance-honesty` self-test) already exists and
already scans the lz-red tree; Phase 18 extends it in place (D-13) -- flip four deferral guards to
content guards, add SKILL.md coverage to both the checker and the tsc extractor, add a lz-tpp
reverse-pointer guard, and harden the SKILL.md ts-fence so VIT-02 gets real tsc coverage.

The two failure modes that have slipped past planning before are both structural, not content:
(1) the oracle-reviewer gate on the owned Three-Laws surface AND the >=1-unbiased review of the
shipped lz-tpp edit CANNOT be run by gsd-executor (no Agent/Task tool) -- they are ORCHESTRATOR gates
after the executor returns; and (2) the checker currently reads only `references/`, so SKILL.md
coverage (content tokens + ts fence) and the lz-tpp read are NET-NEW reads the extension must add.

**Primary recommendation:** Plan five waves mirroring Phases 16/17: (0) extend the instrument to a
fresh Phase-18 RED baseline; (1) fill the owned Three-Laws surface blind + the co-edited reference
slices (disjoint files, parallel); (2) author the SKILL.md coach procedure + the tsc-safe VIT-02
worked example; (3) the lz-tpp reverse-pointer edit (blind); then a finalize gate where the
ORCHESTRATOR runs oracle-reviewer (owned surface), >=1 unbiased review (both edited SKILL.md files),
the full deterministic battery, and `claude plugin validate .` before gsd-verifier.

## Architectural Responsibility Map

The "tiers" here are the skill's authoring layers, not application tiers. Mapping capability -> owning
layer prevents the classic misassignment (putting owned content in SKILL.md, or orchestration logic
in a leaf).

| Capability | Primary Layer | Secondary Layer | Rationale |
|------------|--------------|-----------------|-----------|
| Coach decision procedure (classify -> spine -> route -> structure -> fail-right -> handoff) | SKILL.md (orchestration) | -- | D-01/D-02: inline numbered tree; matches lz-tpp/lz-refactor. Orchestration links to leaves, never restates them. |
| Three Laws owned prose (Law 1/2/3 statements) | `three-laws-and-test-selection.md` (content) | oracle-reviewer gate | D-04: owned content lives in the leaf; SKILL.md carries only the compact spine. D-05: oracle-gated. |
| Classify-first + forward handoff | SKILL.md (orchestration) | existing "RED vs the green step" section | D-03: reuse the Phase-15 section; do not restate. SEAM-01. |
| Stance routing + NL override | SKILL.md (orchestration) | `testing-stance/README.md` route table (navigation) | D-06/D-07: SKILL.md wires the complete Phase-17 route table; the index is navigation-only. RTR-02. |
| Fail-for-the-right-reason content | `vitest-typescript-mechanics.md` + `test-structure-and-assertions.md` (content) | SKILL.md ties it procedurally (step 5) | LAW-02: the red-bar mechanic + F.I.R.S.T. baseline already exist; Phase 18 makes them a procedure step. |
| VIT-02 worked example (RED path) | SKILL.md fence (content, tsc-covered) | tsc extractor | D-11: one compact tsc-strict fence in the procedure. |
| Reverse `lz-tpp -> lz-red` + `lz-tpp -> lz-refactor` pointers | `lz-tpp/SKILL.md` (sibling shipped skill) | orchestrator review gate | D-09/D-10: additive pointer section; review-gated; live at Phase-19 reload. SEAM-02. |
| Provenance backing rows (LAW/SEAM) | `principle-backing.md` (content) | D-05 honesty gate | Fills the Phase-18 backing marker; the honesty gate keeps tier cells honest. |
| Validation | dev-only `lz-red-workspace` + `lz-refactor-workspace` instruments | -- | D-13: extend in place; no build dep in `plugins/lz-tdd`. |

## Standard Stack

No new libraries. This is a Markdown-authoring phase with a dev-only validation workspace already
provisioned in Phase 16.

### Existing tooling reused (do not add, do not replace)

| Component | Version / Location | Purpose | Status |
|-----------|-------------------|---------|--------|
| `check-red-references.mjs` | `.claude/skills/lz-red-workspace/tools/` | Content-completeness gate over the 10 lz-red references | Extend in place (D-13) [VERIFIED: file read] |
| `extract-samples.mjs` | `.claude/skills/lz-red-workspace/` | tsc --strict extractor (one module per fence) | Extend to cover SKILL.md fence [VERIFIED: file read] |
| `provenance-honesty.mjs` + `.selftest.mjs` | `.claude/skills/lz-red-workspace/tools/` | D-05 honesty gate (no Owned row cites a summary-only book) | Keep intact [VERIFIED: file read] |
| `check-hygiene.mjs` | `.claude/skills/lz-refactor-workspace/tools/` | ASCII + work-email + no-verbatim over both skill trees | Already scans lz-red; run unchanged [VERIFIED: file read] |
| `typescript` | 6.0.3 (pinned devDep, installed) | tsc --strict compile of example fences | Present [VERIFIED: package.json + node_modules] |
| `vitest` | 4.1.10 (pinned devDep, installed) | Type resolution for `import ... from 'vitest'` in fences | Present [VERIFIED: package.json + node_modules] |
| `claude` CLI | current 2.1.x line | `claude plugin validate .` structural gate | Required, ran GREEN in Phases 15-17 [CITED: STATE.md] |

**Installation:** none. `npm install` in `lz-red-workspace` was performed in Phase 16 (16-02); the
legitimacy checkpoint was APPROVED then. No package is added in Phase 18.

## Package Legitimacy Audit

**No external packages are introduced in Phase 18.** The only dependencies (`typescript@6.0.3`,
`vitest@4.1.10`) were added and legitimacy-checked in Phase 16 (16-01 blocking-human checkpoint
APPROVED) and live solely in the dev-only `lz-red-workspace`. The shipped `plugins/lz-tdd` tree stays
dependency-free Markdown (D-13; REQUIREMENTS Out-of-Scope: "New repo build dependencies for the
skill"). No audit table applies this phase.

## Architecture Patterns

### The house coach-procedure shape (distilled from two shipped precedents)

Both `lz-tpp/SKILL.md` (7 steps, 81 lines total) and `lz-refactor/SKILL.md` (6 steps, 180 lines
total) implement the same shape. [VERIFIED: file reads]

1. **Two modes block** -- Coach mode (act) vs Reference mode (explain from the leaves; do not
   restate). Already present in `lz-red/SKILL.md:27`.
2. **Classify-against-the-seam section** BEFORE the procedure -- a short paragraph that sorts the
   request to the right sibling skill. Already present as `lz-red/SKILL.md:36` ("RED vs the green
   step (lz-tpp) and the refactor step (lz-refactor)"). The procedure's step 1 points back at it,
   never restating (lz-refactor step 1 does exactly this: "See ... above; do not restate it").
3. **A compact numbered decision tree** -- each step is 1-4 lines: an imperative move + a file-level
   link to the leaf that carries the content. Steps NEVER inline the leaf's content.
4. **A closing "coach by default; drive when asked" paragraph** -- distinguishes a QUESTION (present
   the next move, do not edit or run tests) from an explicit COMMAND. lz-refactor:114-121 is the
   model; lz-tpp folds it into step 7 ("Show, don't drive").
5. **Reference-material link list** -- already present at `lz-red/SKILL.md:60-80`; the procedure's
   links reuse these existing file-level links.

The lz-red procedure (D-02 step order): (1) classify RED/GREEN/REFACTOR [SEAM-01]; (2) Three Laws
spine -- Law 1 gates entry, Law 2 sizes the test [LAW-01]; (3) detect + match the house idiom, route
the stance via `testing-stance/README.md`, state the route + why, honor a NL override [RTR-02];
(4) structure the test + assert observable behavior (point at `test-structure-and-assertions.md`);
(5) fail-for-the-right-reason -- AssertionError not a compile/setup error, F.I.R.S.T. baseline
[LAW-02]; (6) forward handoff to lz-tpp -- Law 3 [SEAM-01]. Then the closing paragraph + the ONE
VIT-02 worked example [D-11].

**Size discipline (SKL-02):** lz-tpp = 81 lines, lz-refactor = 180, lz-red currently = 80. Target the
lz-tpp end of the range, not lz-refactor's -- lz-red needs no analogue of lz-refactor's heavy step-5
loop audit. CONTEXT D-01 estimates ~130-180 filled; aim under ~200 and well under the 500 cap.
[VERIFIED: wc -l]

### Instrument-first (Nyquist) pattern

The RED guard is asserted BEFORE content lands; content turns it GREEN. Phases 16 (16-01) and 17
(17-01) both opened with a Wave-0 instrument extension asserting a RED baseline, then filled content
to flip GREEN. [CITED: STATE.md] Phase 18 repeats this: extend the checker to a Phase-18 RED baseline
(SKILL.md tokens absent, deferral markers still present) first, then author content.

### Clean-room DST-04 split

Owned surfaces (distilled against a full-text source in `.oracle/`) are authored BLIND and gated by
the orchestrator-driven oracle / oracle-reviewer loop (converge-to-clean, 3-round cap). Orchestration
prose (SKILL.md procedure, routing/seam framing, lz-tpp pointer) is authored blind and passes only
the deterministic no-verbatim scan. Main context never reads `.oracle/` prose. [CITED: CONTEXT D-12,
17.1-CONTEXT D-06/D-07]

### Anti-patterns to avoid

- **Restating leaf content in SKILL.md.** The procedure links file-level and stops. Both precedents
  are explicit ("do not restate their content here").
- **Splitting the procedure into a new `references/coach-procedure.md`.** Rejected by D-01; breaks the
  pattern and hides the always-active procedure behind a lazy load.
- **Framing any RED rule as mandatory.** The skill's voice is "heuristic and thinking aid" (see the
  existing `## Listen to the tests` section, `lz-red/SKILL.md:44`). The procedure coaches, it does
  not dictate.
- **Depicting the RED example via a missing symbol.** tsc --strict would fail the extractor. See
  Pitfall 3.
- **Leaving a stale "Phase 18" marker in a filled slice.** Violates D-14; the SCAFFOLD set does NOT
  catch "deferred to Phase 18". See Pitfall 1.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Content-completeness gate | A new Phase-18 checker sibling | Extend `check-red-references.mjs` in place | D-13 mandates extend-in-place; a sibling fragments the battery (Phase 9 D-17 / Phase 16 D-13 precedent). |
| Coach procedure home | A new `references/coach-procedure.md` | Inline in `SKILL.md` | D-01; the placeholder already reserves the SKILL.md slot. |
| No-verbatim / ASCII / email scan | A new scan for the SKILL.md prose | `check-hygiene.mjs` (lz-refactor-workspace) | It already scans the lz-red SKILL.md on all three axes [VERIFIED: file read, lines 114-118, 139-143]. |
| tsc coverage of the SKILL.md example | A bespoke compile step | Extend `extract-samples.mjs` to include SKILL.md | One extra path in the walk; reuses the whole one-module-per-fence + tsc --strict machinery. |
| Distilling the Three Laws from source | Reading `.oracle/` in main context | Executor authors blind; ORCHESTRATOR runs oracle-reviewer | DST-04 clean-room (D-12); executor cannot spawn agents anyway. |
| D-05 tier honesty | A fresh tier check | Keep the existing `provenance-honesty.mjs` gate + self-test | Already regression-proofs the invariant generically over the whole table. |

**Key insight:** Nearly everything Phase 18 needs already exists as a marker, a stub, a checker
branch, or a shipped precedent. The phase is a set of precise fills and one careful instrument
extension, not new construction.

## Common Pitfalls

### Pitfall 1: The deferral-guard flip leaves stale "Phase 18" markers (D-14 violation)

**What goes wrong:** The four co-edited files carry a `deferral` guard asserting a marker `re:
/Phase 18|LAW-0|SEAM-0/` REMAINS (a PASS today). A naive flip that just deletes the guard, or that
asserts "the LAW-0 token is gone", is wrong on both ends: (a) the filled content LEGITIMATELY
contains `LAW-01`/`LAW-02`/`SEAM-01` as requirement references, so a `/LAW-0/`-absence check
false-fails; (b) if the executor fills the section but leaves the old "deferred to Phase 18 ...
insertion point" prose above it, nothing catches it -- the SCAFFOLD set (`/TODO/`, `/placeholder/i`,
`/to be authored/i`, `/once it exists/i`, `/TBD/`) does NOT match "deferred to Phase 18". [VERIFIED:
scaffold-phrases.mjs + check-red-references.mjs]
**How to avoid:** Convert each `deferral` guard to (1) positive `topics` asserting the FILLED content,
plus (2) a NEGATIVE assertion that the literal phrase `/Phase 18/i` is ABSENT from the file. Content
never legitimately says "Phase 18" (that is a deferral artifact), while it may say "LAW-01" -- so
`/Phase 18/i`-absence is the clean D-14 "no stale marker" needle. Apply the same negative guard to
SKILL.md (its placeholder says "deferred to Phase 18", `SKILL.md:52`).
**Warning signs:** The gate goes GREEN while `git grep "Phase 18" plugins/lz-tdd/skills/lz-red` still
returns hits in shipped files.

### Pitfall 2: The checker and extractor read `references/` only -- SKILL.md is invisible today

**What goes wrong:** Every `FILES` entry in `check-red-references.mjs` resolves under `REFERENCES`
(`path.join(REFERENCES, spec.name)`), and `extract-samples.mjs` walks `REFERENCES` and skips
`README`. The lz-red SKILL.md is at the skill ROOT (parent of `references/`), so NEITHER touches it
today. [VERIFIED: file reads] Without an explicit extension, the SKILL.md coach-procedure tokens and
the VIT-02 fence get ZERO coverage, and the gate goes falsely GREEN.
**How to avoid:** (a) Checker -- add SKILL.md either as a FILES entry with a per-entry base-dir
override (add an optional `dir` field defaulting to `REFERENCES`; SKILL.md sets `dir` = skill root)
OR as a separate SKILL.md block after the loop (mirrors the D-05 gate block idiom). The base-dir
override is the leaner option -- it reuses the topics + requireFence + scaffold machinery for one new
entry. (b) Extractor -- prepend the SKILL.md path to the file list: `for (const file of [SKILL_MD,
...walkMd(REFERENCES)])`, where `SKILL_MD = <repoRoot>/plugins/lz-tdd/skills/lz-red/SKILL.md`. Its
basename is "SKILL" (not "readme"), so the README-skip guard passes it through; its fence extracts as
`SKILL-1.ts`.
**Warning signs:** `npm run check` and `npm run typecheck` stay GREEN even after you intentionally
break the SKILL.md example fence.

### Pitfall 3: The VIT-02 RED example must tsc-compile, but it depicts a FAILING test

**What goes wrong:** A worked RED example naturally references behavior that "does not exist yet." If
you depict that with a missing symbol, `tsc --strict --noEmit` fails and the extractor goes RED --
but that is exactly what VIT-02 forbids (the fence must be tsc-strict clean). Using a ` ```ts ignore `
fence is worse: `extract-samples.mjs` SKIPS `ignore` fences (`f.rest.includes("ignore")` -> counted,
not compiled) [VERIFIED: extract-samples.mjs:122], so VIT-02 gets no tsc coverage -- yet the checker's
`TS_FENCE_RE = /```(ts|typescript)\b/` MATCHES ` ```ts ignore ` (the `\b` sits before the space), so
the requireFence guard would falsely pass. [VERIFIED: check-red-references.mjs:185]
**How to avoid:** Depict the RED via a COMPILING stub that fails its assertion at RUNTIME -- e.g. a
production function stubbed to return the wrong value (or `throw`) with an assertion expecting the
real value. Types line up (tsc clean), the test fails with an `AssertionError` at run time -- which is
precisely the LAW-02 teaching ("the RIGHT red is an AssertionError, not a compile/import error"). So
the tsc-safe shape and the LAW-02 lesson coincide. Additionally HARDEN the SKILL.md ts-fence guard to
require a NON-ignore fence, so a future ` ```ts ignore ` cannot satisfy VIT-02 without real coverage.
**Warning signs:** The example uses `ts ignore`, or references a symbol with no local declaration.

### Pitfall 4: The oracle-reviewer and lz-tpp review are ORCHESTRATOR gates, not executor steps

**What goes wrong:** gsd-executor's tools are Read/Write/Edit/Bash/Grep/Glob/Skill only -- NO
Agent/Task tool. [CITED: MEMORY gsd-executor-cannot-spawn-subagents] A plan task worded "the executor
distills the Three Laws against `.oracle/` and spawns the oracle-reviewer" or "the executor spawns an
unbiased reviewer for the lz-tpp edit" is UNEXECUTABLE. This exact trap survived researcher +
pattern-mapper + planner + plan-checker in Phase 16 and only surfaced at dispatch.
**How to avoid:** Plan all three gates as ORCHESTRATOR steps AFTER the executor returns its blind
edits: (1) oracle-reviewer on the owned Three-Laws surface (D-05/D-12, converge-to-clean 3-round cap,
gate-decides the owned-vs-no-oracle tier); (2) >=1 unbiased from-scratch review of the shipped lz-tpp
edit (D-10); (3) >=1 unbiased review / skill-reviewer of the lz-red SKILL.md coach procedure (the
standing rule: every SKILL.md change is subagent-reviewed; 17-06 precedent). The executor authors
blind and runs the DETERMINISTIC checkers only.
**Warning signs:** A `<task>` body contains "spawn", "Agent(", "Task(", or "oracle-reviewer" as an
executor action.

### Pitfall 5: The lz-tpp edit is a SHIPPED-skill change -- review-gated, live only at Phase-19 reload

**What goes wrong:** `lz-tpp/SKILL.md` is a live shipped skill. Editing it without review, or assuming
the edit is live in-session, both break the workflow. The edit does not take effect until a human runs
`/reload-plugins`. [CITED: MEMORY reload-plugins-after-oracle-agent-changes; CONTEXT D-10]
**How to avoid:** Gate the edit behind the D-10 orchestrator review BEFORE acceptance; note the
`/reload-plugins` as a Phase-19 ship action, not a Phase-18 task. Also: the lz-tpp tree is EXCLUDED
from the no-verbatim scan (D-04, cited FibTPP) [VERIFIED: check-hygiene.mjs:126-128], so the
reverse-pointer prose is NOT backstopped by the no-verbatim gate -- it relies on own-words authoring +
the D-10 review. It IS covered by ASCII + work-email (wideTargets includes lz-tpp SKILL.md).

### Pitfall 6: Preserve the Phase-16/17 regression floor and the D-05 honesty gate

**What goes wrong:** Co-editing a stub can accidentally drop a Phase-16/17 topic token (the checker
asserts all of them) or perturb the `principle-backing.md` table shape so the D-05 parser
(`ROW_RE`, three-column pipe table) stops matching.
**How to avoid:** Fill ONLY the Phase-18 slice in each file; leave SEL/STR/ASRT/NAME/RTR-01/RTR-03/
VIT/ANTI content byte-stable. Keep the new principle-backing LAW/SEAM rows in the exact
`| [rec](doc.md) | Source | tier |` shape, and never tag a LAW/SEAM row `Owned` while citing a
summary-only book. Run the `provenance-honesty.selftest.mjs` (3/3) as part of the battery.

## Code Examples

These are illustrative SHAPES for the planner, not final prose. Exact wording is executor discretion
(and, for the owned Three-Laws surface, oracle-gated).

### Coach-procedure skeleton (SKILL.md, replacing the placeholder at `lz-red/SKILL.md:52`)

```md
## Coach decision procedure

1. Classify the request against the lz-tpp / lz-refactor seams. Failing test to make pass -> hand
   off to lz-tpp and stop. Already-passing code to clean up -> hand off to lz-refactor. Otherwise
   the next failing test is this skill. See "RED vs the green step ... refactor step" above; do not
   restate it.
2. Three Laws spine. Law 1 gates entry: no production code before a failing test. Law 2 sizes the
   test: only enough to fail -- a not-yet-defined symbol counts. (Law 3 is step 6.) See
   [three-laws-and-test-selection.md](...); do not restate it.
3. Detect and match the house test idiom, then route the stance by structural control / seam
   availability via the [testing-stance route table](references/testing-stance/README.md); open the
   routed leaf to act. State the route chosen and why. If the developer states a stance preference
   in plain language, honor it over the auto-route and still state the route.
4. Structure the test and assert observable behavior -- see
   [test-structure-and-assertions.md](...); do not restate it.
5. Fail for the right reason. Confirm the fresh test fails on the asserted behavior (an
   AssertionError), not a compile / import / setup error or a false green; F.I.R.S.T. is the
   baseline. Explain which failure is the right one -- do not run the suite unprompted.
6. Hand off forward to lz-tpp. Once the test is red for the right reason, making it pass is Law 3 --
   the green step, lz-tpp's job, not this skill's.

Coach by default; hand off, do not drive. On a QUESTION present the next test and the smallest move
and let the developer write it -- do not edit their tests or run the suite unasked. On an explicit
COMMAND ... [mirror lz-refactor:114-121].
```

### VIT-02 tsc-safe RED worked example (compiling stub that fails its assertion)

```ts
// SOURCE PATTERN (not final): the fence must be tsc --strict clean, so depict the red via a stub
// that returns the wrong value -> AssertionError at runtime (the LAW-02 "right reason"), NOT a
// missing symbol (which breaks tsc).
import { describe, it, expect } from 'vitest';

describe('discountedTotal', () => {
  it('should subtract the percentage discount from the total', () => {
    // Arrange
    const total = 200;
    const percent = 10;
    // Act
    const result = discountedTotal(total, percent);
    // Assert -- fails on the assertion (AssertionError), not on a compile error
    expect(result).toBe(180);
  });
});

// Stub under test: type-checks (tsc clean) but returns the wrong value, so the test is a valid red.
function discountedTotal(total: number, percent: number): number {
  return total; // not yet implemented -> AssertionError: expected 180, received 200
}
```

### Instrument flip (per co-edited file) -- shape, not final code

```js
// BEFORE (Phases 16/17): assert the Phase-18 marker REMAINS.
deferral: { label: "Phase 18 spine/seam marker remains", re: /Phase 18|LAW-0|SEAM-0/ },

// AFTER (Phase 18): remove the deferral; add positive content topics + a NEGATIVE no-stale-marker
// guard. (Negative needle is /Phase 18/i ONLY -- LAW-0/SEAM-0 legitimately appear in filled content.)
topics: [ /* ...existing Phase-16/17 tokens kept... */,
  { label: "Three Laws spine present", re: /three laws|law 1|law 2/i },
  { label: "classify-first framing", re: /classify|red.*green.*refactor/i },
],
absent: { label: "no stale Phase-18 deferral marker", re: /Phase 18/i },  // new negative assertion
```

## Runtime State Inventory

Not applicable -- Phase 18 is greenfield authoring + instrument extension, not a rename / refactor /
migration. No stored data, live-service config, OS-registered state, secrets, or build artifacts
carry a string that Phase 18 changes. (The only "state" is the dev-only `samples/` dir that
`extract-samples.mjs` rebuilds every run.)

## Validation Architecture

Nyquist validation is enabled (`workflow.nyquist_validation: true` [VERIFIED: config.json]). This
section is the input to the VALIDATION.md the validate-phase step generates.

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Node builtin `assert`-based checker scripts + `tsc --strict` extractor + `claude plugin validate .`. NOT a vitest suite (vitest is a devDep only, for type resolution of the example fences' `import ... from 'vitest'`). |
| Config file | `.claude/skills/lz-red-workspace/package.json` (scripts) + `tsconfig.json` (`strict: true`, `include: samples/**/*.ts`) |
| Quick run command | `node .claude/skills/lz-red-workspace/tools/check-red-references.mjs` (content gate) |
| Full suite command | `cd .claude/skills/lz-red-workspace && npm run check && npm run typecheck` then `node .claude/skills/lz-refactor-workspace/tools/check-hygiene.mjs` then `node .claude/skills/lz-red-workspace/tools/provenance-honesty.selftest.mjs` then `claude plugin validate .` |

### Phase Requirements -> Test Map

| Req ID | Behavior | Test Type | Automated Command / Gate | Exists? |
|--------|----------|-----------|--------------------------|---------|
| LAW-01 | Three Laws spine in SKILL.md + owned prose in the leaf | content-token (det.) + oracle-reviewer (orch.) | check-red-references SKILL.md tokens (`/three laws|law 1|law 2/i`) + three-laws leaf tokens | Extend Wave 0 |
| LAW-01 | Owned Three-Laws prose is own-words + faithful to Clean Code Ch. 9 | orchestrator gate | oracle / oracle-reviewer loop (converge-to-clean, 3-round cap); D-05 gate-decides tier | Orchestrator, not automatable |
| LAW-02 | Fail-for-the-right-reason step + F.I.R.S.T. baseline tied to procedure | content-token (det.) | SKILL.md `/right reason|AssertionError/`; test-structure F.I.R.S.T.-baseline token; vitest LAW-02-tie token | Extend Wave 0 |
| RTR-02 | Routing step: detect idiom, route by control/seam, state route, NL override | content-token (det.) + skill-reviewer (orch.) | SKILL.md tokens for route/idiom/override + link to `testing-stance/README.md` | Extend Wave 0 |
| SEAM-01 | Classify-first + forward `lz-red -> lz-tpp` handoff | content-token (det.) | SKILL.md classify + `lz-tpp` handoff tokens | Extend Wave 0 |
| SEAM-02 | Both reverse pointers present in lz-tpp/SKILL.md | content-token (det.) + unbiased review (orch.) | NEW checker guard reading `lz-tpp/SKILL.md`: `/lz-red/` AND `/lz-refactor/` present | Extend Wave 0 |
| VIT-02 | One tsc-strict Vitest worked example in SKILL.md | fence-presence (det.) + tsc compile (det.) | SKILL.md non-ignore ts-fence guard + `extract-samples.mjs` covering SKILL.md, tsc --strict clean | Extend Wave 0 |
| (floor) | Phase-16/17 content intact; no stale Phase-18 marker | regression (det.) | all existing topics still PASS + new `/Phase 18/i`-absent guards | Extend Wave 0 |
| (floor) | D-05 tier honesty | invariant (det.) | `provenance-honesty.selftest.mjs` 3/3 + in-battery honesty gate | Exists, keep |
| (floor) | ASCII / work-email / no-verbatim | hygiene (det.) | `check-hygiene.mjs` (already scans lz-red; lz-tpp on ASCII+email only) | Exists, keep |
| (floor) | Structural validity | structural (det.) | `claude plugin validate .` exit 0 | Exists, keep |

### Sampling Rate

- **Per task commit:** the relevant checker (`check-red-references.mjs` for a reference/SKILL fill;
  `npm run typecheck` when a fence changes).
- **Per wave merge:** full deterministic battery (check + typecheck + hygiene + provenance self-test).
- **Phase gate:** full battery GREEN + `claude plugin validate .` exit 0 + the THREE orchestrator
  gates cleared (oracle-reviewer on the owned surface; >=1 unbiased review of each edited SKILL.md)
  before gsd-verifier.

### What is deterministic vs what needs an orchestrator gate

- **Deterministic (checker-provable):** every content token, the SKILL.md ts fence, the tsc compile,
  the lz-tpp two-pointer presence, the no-stale-marker guards, the D-05 honesty gate, ASCII/email/
  no-verbatim, and `claude plugin validate .`. These prove the artifacts LANDED and are well-formed.
- **Orchestrator gates (NOT automatable, executor cannot run them):**
  1. **oracle-reviewer** on the owned Three-Laws surface -- proves own-words fidelity to Clean Code
     Ch. 9 and DECIDES the owned-vs-no-oracle tier per Law statement (D-05/D-12).
  2. **>=1 unbiased from-scratch review** of the shipped `lz-tpp/SKILL.md` edit (D-10, SC4).
  3. **>=1 unbiased review / skill-reviewer** of the lz-red SKILL.md coach procedure (standing rule;
     17-06 precedent) -- reads for coach-don't-drive, override honored, no leaf content restated.

### Wave 0 Gaps (instrument extension -- all "extend in place", no new files)

- [ ] `check-red-references.mjs` -- flip the 4 deferral guards (three-laws, test-structure, vitest,
      principle-backing) to positive content topics + `/Phase 18/i`-absent negatives.
- [ ] `check-red-references.mjs` -- add SKILL.md coverage (base-dir override entry OR separate block):
      classify-first, Three Laws spine, stance-routing + override, fail-for-the-right-reason, forward
      handoff tokens + a NON-ignore ts-fence guard + a `/Phase 18/i`-absent guard.
- [ ] `check-red-references.mjs` -- add a SEAM-02 guard reading `lz-tpp/SKILL.md` (both `/lz-red/` and
      `/lz-refactor/` pointers present).
- [ ] `extract-samples.mjs` -- prepend the lz-red SKILL.md path so its VIT-02 fence is tsc-covered.
- [ ] Assert the fresh RED baseline: with content unfilled, the new SKILL.md + flipped guards FAIL
      by design; the tsc extractor stays GREEN-on-empty; hygiene + validate stay GREEN.
- [ ] Keep `provenance-honesty.mjs` + `.selftest.mjs` + the in-battery D-05 gate byte-intact.

*(No test-framework install needed -- the workspace and its pinned deps were provisioned in Phase 16.)*

## Security Domain

`security_enforcement` is not set in config (absent = enabled), so a Security Domain is included for
completeness, but the realistic attack surface is near-nil: Phase 18 authors Markdown and extends
dev-only Node checker scripts. The shipped artifacts execute no code (the example fences are
compiled by tsc, never run), take no external input, and touch no auth / crypto / network / storage.

### Applicable ASVS categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V1 Architecture | no | Documentation-only skill; no runtime. |
| V5 Input Validation | no | No user input processed at runtime; example fences are static. |
| V6 Cryptography | no | None. |
| V12 Files/Resources | marginal | Checker scripts read repo files only; `extract-samples.mjs` writes to a dev-only `samples/` dir it owns and rebuilds. |
| V14 Config / Supply chain | yes (satisfied) | No new deps; the two devDeps were legitimacy-checked in Phase 16. Clean-room DST-04 keeps copyrighted source text out of the shipped tree (git-ignored `.oracle/`). |

### Known threat patterns for this stack

| Pattern | STRIDE | Standard mitigation |
|---------|--------|---------------------|
| Prompt/instruction injection via `.oracle/` source prose | Tampering | Clean-room: main context never reads `.oracle/`; owned distillation is blind + oracle-reviewer-gated (D-12). |
| Verbatim copyrighted prose leaking into the shipped tree | Info disclosure (IP) | `check-hygiene.mjs` no-verbatim gate over the lz-red tree + own-words authoring + oracle-reviewer. |
| Maintainer work-email / PII leak in committed content | Info disclosure | `check-hygiene.mjs` allowlist-inversion email scan (approved gmail only) over both skill trees + manifests. |
| Supply-chain (slopsquat) via a new dep | Tampering | None added this phase; shipped tree stays dependency-free Markdown. |

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | all checker scripts + extractor | yes (FNM-managed) | current | -- |
| npm | `npm run check` / `typecheck` in the workspace | yes | current | -- |
| typescript | tsc --strict of example fences | yes (installed devDep) | 6.0.3 pinned | global `tsc` 6.0.3 via PATH |
| vitest | type resolution for `import ... from 'vitest'` in fences | yes (installed devDep) | 4.1.10 pinned | -- |
| `claude` CLI | `claude plugin validate .` structural gate | yes | 2.1.x line | -- |

**Missing dependencies with no fallback:** none. The `lz-red-workspace` `node_modules/` is present
(installed in Phase 16-02; confirmed on disk), and Phases 16/17 ran the full battery GREEN.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | The compiling-stub shape (return the wrong value -> AssertionError) is the correct tsc-safe way to depict the VIT-02 RED example | Pitfalls / Code Examples | LOW -- it is the direct consequence of "fence must tsc-compile" + "right red is an AssertionError"; alternatives (`ts ignore`, missing symbol) are ruled out by the extractor's behavior. Executor has discretion on the exact example (D-11). |
| A2 | The filled SKILL.md lands around 130-200 lines | Architecture / size discipline | LOW -- estimate only; the <500 cap is the hard limit and both precedents (81, 180) bracket it. |
| A3 | A base-dir override FILES entry is leaner than a separate SKILL.md block for the checker | Pitfall 2 | LOW -- both are viable and explicitly the planner's call (D-13); this is a recommendation, not a constraint. |
| A4 | The lz-red SKILL.md coach procedure needs a subagent review (not only the lz-tpp edit) | Validation / orchestrator gates | LOW -- follows from the standing "every SKILL.md change is reviewed" rule + the 17-06 precedent; if the operator scopes it narrower, the lz-tpp review (D-10) is still mandatory. |

**If any A-row is wrong,** it changes an implementation detail, not the phase scope -- no locked
CONTEXT decision depends on these.

## Open Questions

1. **Does the oracle-reviewer confirm Clean Code Ch. 9 adequately backs each of Law 1 / Law 2 / Law 3
   as an Owned statement?**
   - What we know: Ch. 9 is owned in the clean-room set and already backs the adjacent
     "only-enough-to-fail" + F.I.R.S.T. rows as Owned; LAW-02's "not-compiling counts" is the same
     thread (D-05). The Law-3-as-lz-tpp-handoff reframe is orchestration (no-oracle) regardless.
   - What's unclear: whether the gate finds a specific Law statement under-covered by Ch. 9.
   - Recommendation: author blind at the TARGET Owned tier; the orchestrator oracle-reviewer
     gate-DECIDES per statement, falling back to no-oracle high-confidence core where Ch. 9 does not
     cover it (the 17.1 gate-decides pattern). Reversible at the gate -- do not pre-litigate it in the
     plan.

2. **Exact placement of the reverse-pointer section in lz-tpp/SKILL.md.**
   - What we know: lz-tpp has no cross-skill pointer section today; the shape model is lz-refactor's
     "Refactoring vs the green step (the lz-tpp seam)" section and lz-red's "RED vs the green step".
   - What's unclear: whether it sits after "Transformations vs refactorings" or near the reference
     list.
   - Recommendation: executor discretion (D-09), gated by the D-10 review; a short section mirroring
     the sibling sections, naming lz-red (red step) and lz-refactor (refactor step).

## Sources

### Primary (HIGH confidence) -- direct codebase reads this session

- `plugins/lz-tdd/skills/lz-refactor/SKILL.md` (180 lines) -- the 6-step inline coach-procedure model.
- `plugins/lz-tdd/skills/lz-tpp/SKILL.md` (81 lines) -- the 7-step model + the SEAM-02 edit target.
- `plugins/lz-tdd/skills/lz-red/SKILL.md` (80 lines) -- the router + the placeholder to replace.
- `plugins/lz-tdd/skills/lz-red/references/{three-laws-and-test-selection,test-structure-and-assertions,vitest-typescript-mechanics,principle-backing}.md` + `testing-stance/README.md` -- the fill targets and the RTR-02 route table.
- `.claude/skills/lz-red-workspace/tools/check-red-references.mjs`, `.../lib/provenance-honesty.mjs`, `.../provenance-honesty.selftest.mjs`, `.../lib/scaffold-phrases.mjs`, `.claude/skills/lz-red-workspace/extract-samples.mjs`, `.../package.json`, `.../tsconfig.json` -- the instrument to extend.
- `.claude/skills/lz-refactor-workspace/tools/check-hygiene.mjs` -- the no-verbatim / ASCII / email backstop (confirmed it already scans lz-red on all axes, lz-tpp on ASCII+email only).
- `.planning/{ROADMAP,REQUIREMENTS,STATE,config}.md/.json` + `.planning/phases/18-*/18-CONTEXT.md` -- scope, requirements, gates, locked decisions.
- `git grep "Phase 18|LAW-0|SEAM-0"` over the skill trees + instrument -- the exact co-edit marker inventory.

### Secondary (project memory / prior-phase learnings)

- MEMORY: `gsd-executor-cannot-spawn-subagents`, `reload-plugins-after-oracle-agent-changes`,
  `agent-skill-instruction-changes-need-review`, `skill-description-char-cap` -- the orchestrator-gate
  and review-gate framing.

### Deliberately NOT fetched

- External web / Anthropic skill-authoring docs. The two shipped in-repo coach procedures (lz-tpp,
  lz-refactor) plus the PROJECT.md tech-stack notes are the authoritative, higher-precedence models
  for this house pattern; a generic external fetch would add no planning value and the phase's
  knowledge is entirely in-repo precedent + locked CONTEXT. (Per source-authority precedence,
  in-house skills outrank generic community guidance here.)

## Metadata

**Confidence breakdown:**
- Coach-procedure shape: HIGH -- two shipped precedents read directly + a spelled-out CONTEXT step order.
- Instrument extension: HIGH -- every checker/extractor/hygiene file read; the exact reads, guards,
  regexes, and coverage gaps verified line-by-line.
- Validation architecture: HIGH -- derived from the actual gates in config + the existing battery.
- Orchestrator-gate framing: HIGH -- verified against executor tool constraints + prior-phase memory.
- The one judgment call (D-05 owned tier): MEDIUM at the statement level -- reversible at the
  orchestrator oracle-reviewer gate by design.

**Research date:** 2026-07-20
**Valid until:** stable -- in-repo precedent + locked CONTEXT; no fast-moving external dependency. Re-check only if the instrument or the sibling SKILL.md files change before planning.
