# Phase 17: Assertion Design, Stance Router & TS/Vitest Mechanics - Research

**Researched:** 2026-07-19
**Domain:** Authoring lz-red RED-phase reference content -- assertion design (Khorikov four pillars),
the adaptive testing-stance router (Bernhardt / Metz / Feathers), Vitest 4.x + TypeScript mechanics,
and the anti-pattern / Test Desiderata references. Markdown-only shipped tree; dev-only tsc/hygiene gates.
**Confidence:** HIGH (all decisions locked in 17-CONTEXT.md; instrument read on disk; Vitest 4.x API
verified against official docs + npm; domain framing corroborated by the HIGH-confidence milestone
research from 2026-07-18).

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions (D-01..D-15, verbatim intent)

**Source tiers & clean-room (D-01/D-02, mirrors Phase 16):**
- **D-01 OWNED / oracle-gated** (distilled own-words via the clean-room oracle / oracle-reviewer agents,
  converge-to-clean 3-round cap + deterministic no-verbatim scan; main context NEVER reads `.oracle/`):
  Metz + Owen *99 Bottles of OOP* 2nd Ed **JavaScript Edition** -> `message-matrix.md` (ASRT-03/RTR-01);
  RCM *Clean Code* Ch.9 -> the F.I.R.S.T. properties in the assertions slice; Ian Cooper (two talks) ->
  over-mock / test-per-class (ANTI-01).
- **D-02 NO-ORACLE / high-confidence core** (authored BLIND, no oracle gate, no-verbatim scan only):
  Vladimir Khorikov (four pillars, ASRT-01); Gary Bernhardt (FCIS, RTR-01/ASRT-02); Michael Feathers
  (seams + characterization, RTR-01/ASRT-02, CROSS-LINK not copy); GOOS Freeman + Pryce (mockist
  counterpoint, stated fairly, ANTI-01/RTR-03); Kent Beck (Test Desiderata, ANTI-02).
- **DHH is HARD-BANNED** -- never cited or referenced anywhere.

**Assertion design (D-03/D-04/D-05):**
- **D-03 (ASRT-01):** assert observable behavior via Khorikov's four pillars (protection against
  regressions; resistance to refactoring; fast feedback; maintainability), with **resistance to
  refactoring named the LOAD-BEARING property** (fewest false failures on a behavior-preserving change).
  Authored blind. Lands in the assertions slice of `test-structure-and-assertions.md`. F.I.R.S.T.
  (owned, oracle-gated) lands in the same slice as the baseline the four pillars sit on.
- **D-04 (ASRT-02):** output-/state-/communication-based assertion-style selection tied to the router:
  output-based <-> Bernhardt functional core; state-/communication-based <-> Metz boundary;
  characterization <-> Feathers legacy. This is the spine linking the assertions slice to the three leaves.
- **D-05 (ASRT-03):** the Metz query/command message matrix as the design-agnostic assert-vs-mock rule:
  assert the RETURN of an incoming query; assert the direct public SIDE EFFECT of an incoming command;
  IGNORE self-messages and outgoing queries; EXPECT-to-send (the one warranted double) only for outgoing
  commands. Owned, oracle-gated. Lands in `message-matrix.md`.

**Testing-stance router (D-06/D-07):**
- **D-06 (RTR-01):** author `testing-stance/` at content grain -- README navigation index (detection
  signals + route table, NAVIGATION-ONLY) + three leaves. `seams-and-legacy.md` CROSS-LINKS
  `plugins/lz-tdd/skills/lz-refactor/references/refactoring-without-tests.md` (verified present) rather
  than duplicating; RED-step (write the pinning test) framing only.
- **D-07 (RTR-03):** "listen to the tests" -- test-writing pain is DESIGN FEEDBACK routing toward a
  functional core (Bernhardt) or a seam (Feathers), NOT more doubles; GOOS as COUNTERPOINT only. Lands
  in `anti-patterns.md`. The lean SKILL.md already carries a short "Listen to the tests" section (Phase 15);
  the leaf deepens it -- NO SKILL.md edit.

**Vitest mechanics (D-08/D-09/D-10):**
- **D-08 (VIT-01):** map Vitest 4.x (pinned 4.1.10) mechanics to RED concepts: `it.todo` = running test
  list; `test.each` / `it.each` = triangulation over concrete examples; `vi.*` doubles WITH RESTRAINT
  (linked to listen-to-the-tests); watch mode = fast feedback loop. "Fails for the right reason" appears
  here ONLY as a Vitest MECHANIC (how you read the red bar and see it is the asserted-behavior failure,
  not a compile / import / fixture failure) -- the LAW-02 spine framing + F.I.R.S.T.-as-baseline PROCEDURE
  is Phase 18.
- **D-09 (judgment call, LOCKED):** cover VIT-01's NAMED surface fully; mention type-level assertions
  (`expectTypeOf` / `assertType`) and property-based generation (`fast-check`) ONLY as brief
  "advanced -- deferred to ADV-01 / ADV-02" forward-pointers. Do NOT author full type-level-RED or
  property-based leaves, and **do NOT add `fast-check` as a dependency.**
- **D-10 (judgment call, LOCKED):** satisfy VIT-02 with TS + Vitest examples throughout the REFERENCES
  Phase 17 authors. The "throughout SKILL.md" clause is satisfied at the SKILL.md level in PHASE 18.
  Phase 17 does NOT edit the SKILL.md body.

**Anti-patterns & Test Desiderata (D-11/D-12):**
- **D-11 (ANTI-01):** anti-pattern leaf naming RED anti-patterns with a Recognize-by cue + observable-
  behavior Correction each: over-mocking / test-per-class rigidity (Cooper, owned), testing private methods,
  multiple unrelated assertions, a test that passes immediately (no red), snapshot-as-thinking, slow /
  order-dependent tests. Khorikov's implementation-detail brittleness (no-oracle) threads in as the
  assertion-side failure mode.
- **D-12 (ANTI-02):** Test Desiderata tradeoff lens -- Beck's good-test properties as tradeoffs to
  OPTIMIZE, not dogma, in lz-tpp's "heuristic not law" voice. No-oracle (Beck).

**Validation & co-edit boundary (D-13/D-14/D-15):**
- **D-13:** Instrument-first -- extend the existing dev-only `lz-red-workspace`
  `check-red-references.mjs` so its Phase-17 RED guards turn GREEN as content lands; every TS fence is
  tsc --strict clean via the pinned extractor (typescript 6.0.3 / vitest 4.1.10). NO build dep enters
  `plugins/lz-tdd`. The tsc gate + no-verbatim scan are non-negotiable.
- **D-14:** No-verbatim gate -- owned surfaces go through oracle-reviewer converge-to-clean + the
  deterministic no-verbatim scan; no-oracle surfaces authored blind + no-verbatim scan only.
- **D-15:** Co-edit, do not split -- fill only the ASRT / RTR-01 / RTR-03 / VIT / ANTI slices; leave the
  Phase-18 markers (LAW spine, fail-for-the-right-reason PROCEDURE, classify-first seam, RTR-02 SKILL.md
  wiring) intact; do NOT edit the SKILL.md body; `principle-backing.md` is co-edited (add Phase-17 rows).

### Claude's Discretion (verbatim)
- Exact own-words wording of each pillar / matrix cell / stance signal / anti-pattern (executor drafts;
  oracle-reviewer gates the owned surfaces only).
- Exact minimal TS/Vitest example per reference, within D-08/D-09/VIT-02 and tsc --strict.
- Whether the planner reuses / extends the Phase-16 `check-red-references.mjs` guards vs adds a sibling
  check (D-13) -- planner's call; the tsc gate + no-verbatim scan are mandatory.
- Plan / wave breakdown across the six stubs (planner's call; owned-oracle leaves may sequence after the
  instrument baseline).

### Deferred Ideas (OUT OF SCOPE for Phase 17)
- Three Laws spine + fail-for-the-right-reason PROCEDURE + F.I.R.S.T.-as-baseline procedure step
  (LAW-01/02), classify-first + lz-tpp seam (SEAM-01/02), RTR-02 SKILL.md wiring -> Phase 18.
- Type-level RED leaf (`expectTypeOf`/`assertType` + `vitest --typecheck` + `*.test-d.ts`) -> ADV-01 (post-0.0.3).
- Property-based RED leaf (`fast-check`) -> ADV-02 (post-0.0.3).
- plugin.json 0.0.3 bump + README + CHANGELOG + validators -> Phase 19. Eval workspace + evals -> Phase 20.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| ASRT-01 | Assert observable behavior, not implementation (Khorikov four pillars; resistance-to-refactoring load-bearing) | Four pillars named + load-bearing pillar identified (Assertion Design section). Owned F.I.R.S.T. co-lands (oracle-gated). Target: assertions slice of `test-structure-and-assertions.md`. |
| ASRT-02 | Output-/state-/communication-based assertion-style selection tied to the stance router | Khorikov's three assertion STYLES mapped to the router spine (output<->functional-core; state/communication<->Metz; characterization<->Feathers). Selection rule in the assertions slice; each leaf carries its own assert rule. |
| ASRT-03 | Metz query/command message matrix as the design-agnostic assert-vs-mock rule | Six-cell matrix (origin x type) at planning grain; the one warranted double = outgoing command. Owned (99 Bottles JS ed), oracle-gated. Target: `message-matrix.md`. |
| RTR-01 | `testing-stance/` subdir: README nav index + 3 leaves; Feathers cross-linked, not copied | Detection signals + route table (README nav-only); leaf content contracts; verified cross-link path `../../../lz-refactor/references/refactoring-without-tests.md`. |
| RTR-03 | "Listen to the tests" meta-rule: test pain routes to core/seam, GOOS counterpoint only | Framing at planning grain; GOOS stated fairly; DHH banned. Target: `anti-patterns.md`. |
| VIT-01 | Vitest 4.x mechanics mapped to RED concepts (`it.todo`, `test.each`, `vi.*` restraint, watch) | Verified 4.x API surface + signatures (Vitest Mechanics section). Target: `vitest-typescript-mechanics.md`. |
| VIT-02 | TS + Vitest examples throughout the references, all tsc --strict-clean | Extract-samples one-module-per-fence tsc gate (unchanged, auto-covers new fences); self-contained-fence + DOM-free constraints documented. |
| ANTI-01 | Anti-pattern leaf: six named RED anti-patterns + observable-behavior fix (incl. Cooper) | Six anti-patterns + corrections at planning grain; Cooper owned/oracle-gated; Khorikov threads in. Target: `anti-patterns.md`. |
| ANTI-02 | Test Desiderata tradeoff lens in the "heuristic not law" voice | Beck's ~12 desiderata + the tradeoff tensions (no-oracle). Target: `anti-patterns.md`. |
</phase_requirements>

## Summary

Phase 17 is Markdown reference authoring with a machine gate, not code. Every genuine decision is already
locked in 17-CONTEXT.md (D-01..D-15); the remaining unknowns the planner cannot get from CONTEXT are:
(1) the exact Vitest 4.x API surface, verified current and tsc-strict-safe; (2) the domain framing at
planning grain (pillar names, matrix cells, anti-pattern set, Test Desiderata) so the planner can scope
each slice; (3) how the existing `check-red-references.mjs` instrument must be EXTENDED so its Phase-17
guards flip RED->GREEN as content lands; and (4) the exact cross-link path. All four are resolved below.

The work fills six co-edited stubs plus the `principle-backing.md` map. Three surfaces are OWNED and
oracle-gated (the Metz matrix in `message-matrix.md`, F.I.R.S.T. in the assertions slice, Cooper in
`anti-patterns.md`); the rest are no-oracle high-confidence core authored blind. Two automated gates are
already stood up and require only extension/use: the one-module-per-fence `tsc --strict` extractor
(`extract-samples.mjs`, needs NO change -- it already walks the whole tree recursively and is GREEN-on-empty)
and the shared `check-hygiene.mjs` (already scans the lz-red tree on all three axes: ASCII, work-email
allowlist-inversion, no-verbatim). The content-completeness gate `check-red-references.mjs` is the one
instrument that MUST be extended (add six Phase-17 file entries, flip the assertions-slice deferral guard,
make the ts-fence assertion per-file, add a cross-link presence guard).

**Primary recommendation:** Run instrument-first -- EXTEND `check-red-references.mjs` in place to a Phase-17
RED baseline (do not add a sibling checker), then author the six slices to flip it GREEN. Show every red
example as a test that COMPILES tsc-strict-clean and FAILS AT RUNTIME (assertion mismatch), never a
not-yet-implemented symbol (that is a compile error, which breaks the extractor unless tagged ` ```ts ignore `).
Keep the owned-surface prose behind the oracle loop; author the no-oracle surfaces blind in original words.

## Architectural Responsibility Map

This is a documentation phase; the "tiers" are the skill's progressive-disclosure layers, not runtime tiers.

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Assertion-design rule (four pillars, F.I.R.S.T., output/state/communication selection) | `references/test-structure-and-assertions.md` (assertions slice) | -- | Downstream of test structure; the "assert well" surface. STR slice already filled Phase 16 -- leave intact. |
| Stance navigation (detection signals + route table) | `references/testing-stance/README.md` (nav-only) | SKILL.md wiring is Phase 18 | Index carries recognize-by cues + links only; content lives in leaves (mirrors lz-refactor `smells.md`). |
| Output-based assert rule (value-in/value-out, no doubles) | `references/testing-stance/functional-core.md` | assertions slice (selection rule points here) | Bernhardt FCIS; the leaf carries the assert/mock rule, the slice carries the selection rule. |
| Assert-vs-mock by message type (the design-agnostic firewall) | `references/testing-stance/message-matrix.md` | assertions slice | Metz matrix owns the query/command rule; ASRT-03 lands here. Owned -> oracle-gated. |
| Characterization assert rule (pin current behavior; seam first) | `references/testing-stance/seams-and-legacy.md` | lz-refactor `refactoring-without-tests.md` (CROSS-LINK) | RED-step framing only; the no-tests techniques already live in lz-refactor -- link, do not copy. |
| Vitest 4.x -> RED-concept mapping + tsc-strict examples | `references/vitest-typescript-mechanics.md` | anti-patterns.md (mock restraint link) | The demo stack lands here, not in the description or router. |
| Anti-pattern set + listen-to-the-tests + Test Desiderata | `references/anti-patterns.md` | functional-core / seams (route targets for test pain) | The "what not to do" surface; RTR-03 meta-rule + ANTI-01/02 live here. |
| Source-to-recommendation backing + access tiers | `references/principle-backing.md` (co-edited) | -- | Add Phase-17 rows (Khorikov, Bernhardt, Metz, Feathers, Cooper, GOOS, Beck) + owned/no-oracle tiers. |

## Standard Stack

This phase ships **Markdown only** (no runtime dependencies enter `plugins/lz-tdd`). The "stack" is the
dev-only validation workspace, already installed and pinned.

### Core (dev-only, already present in `.claude/skills/lz-red-workspace/`)
| Tool | Version | Purpose | Why Standard |
|------|---------|---------|--------------|
| `typescript` | 6.0.3 (pinned) | `tsc --strict --noEmit` over every extracted example fence | Established 0.0.1/0.0.2 gate; pinned in workspace `package.json`; already installed [VERIFIED: package.json + node_modules on disk] |
| `vitest` | 4.1.10 (pinned) | Supplies the vitest types the example fences import (`import { ... } from 'vitest'`) | The RED demo stack; pinned in workspace `package.json`; matches current npm `vitest` 4.1.10 [VERIFIED: npm view + package.json] |

### Supporting (Vitest 4.x API surface the examples/prose reference)
| Facility | Form | RED concept it maps to (D-08) |
|----------|------|-------------------------------|
| `it.todo` / `test.todo` | `test.todo(name: string \| Function): void` | the running test list (not-yet-written tests, shown in the report) [CITED: vitest.dev/api] |
| `test.each` / `it.each` | array-table `test.each(cases)(name, fn)` AND tagged-template ``test.each`a \| b`(name, fn)`` | triangulation over concrete examples [CITED: vitest.dev/api] |
| `test.for` / `it.for` | `test.for(cases)(name, (row, ctx) => ...)` | triangulation variant: arrays NOT spread; gives `TestContext` (4.x) [CITED: vitest.dev/api] |
| `vi.fn` | `vi.fn(impl?): Mock` | a double, used with restraint | [CITED: vitest.dev/api/vi] |
| `vi.spyOn` | `vi.spyOn(obj, key, accessor?: 'get'\|'set'): Mock` | observe/replace a method or getter/setter | [CITED: vitest.dev/api/vi] |
| `vi.mock` | `vi.mock(path, factory?)` (hoisted above imports) | module substitution (edges only) | [CITED: vitest.dev/api/vi] |
| watch mode | `vitest` (no args, interactive TTY) = watch; `vitest run` = single CI run; `vitest --watch` explicit | the fast feedback loop | [CITED: vitest.dev/guide/cli] |

### Forward-pointer only (D-09 -- mention as deferred; DO NOT author leaves; DO NOT install)
| Facility | Status for the forward-pointer |
|----------|-------------------------------|
| `expectTypeOf` / `assertType` | Type-level testing: lives in `*.test-d.ts`, requires the `--typecheck` flag (runs `tsc --noEmit` under the hood), NOT executed at runtime. -> ADV-01. [CITED: vitest.dev/guide/testing-types] |
| `fast-check` (4.9.0) + `@fast-check/vitest` (0.4.1) binding (`test.prop`) | Property-based generation. -> ADV-02. Registry-confirmed to exist but NOT installed this phase. [VERIFIED: npm view fast-check / @fast-check/vitest] |

### Installation
None. Phase 17 adds no packages. The workspace deps are already installed (verified: `node_modules/` present
with `typescript`, `vitest`, and the vitest sub-packages).

## Package Legitimacy Audit

Phase 17 installs **zero** external packages (Markdown-only shipped tree; D-13 forbids build deps in
`plugins/lz-tdd`; D-09 forbids adding `fast-check`). The table below records the dev deps already in use and
the forward-pointed names, verified against the npm registry so the D-09 pointer is accurate.

| Package | Registry | Version seen | Disposition |
|---------|----------|--------------|-------------|
| `typescript` | npm | 6.0.3 (pinned, installed) | Approved -- already in use, no change |
| `vitest` | npm | 4.1.10 (pinned, installed; matches `npm view vitest` latest) | Approved -- already in use, no change |
| `fast-check` | npm | 4.9.0 (registry) | NOT installed -- forward-pointer only (ADV-02) |
| `@fast-check/vitest` | npm | 0.4.1 (registry) | NOT installed -- forward-pointer only (ADV-02) |

**Packages removed due to [SLOP] verdict:** none.
**Packages flagged [SUS]:** none.
**Note:** `fast-check` / `@fast-check/vitest` names were recalled from training data and then confirmed on the
npm registry; they are mentioned only as deferred forward-pointers and are NOT installed, so no
`checkpoint:human-verify` is required this phase. If ADV-02 is ever built, verify legitimacy at that time.

## Assertion Design (planning grain -- NOT final prose)

> These are established, publicly-known ideas stated in my own words at planning grain. The OWNED surfaces
> (F.I.R.S.T. from Clean Code Ch.9) are oracle-gated: the executor's oracle loop produces the final own-words
> prose; do NOT treat the wording here as ship-ready. Khorikov is no-oracle (authored blind).

### Khorikov's four pillars of a good unit test (ASRT-01, no-oracle) [ASSUMED -- corroborated by PITFALLS.md HIGH]
Vladimir Khorikov, *Unit Testing: Principles, Practices, and Patterns*. A good unit test maximizes four
properties:
1. **Protection against regressions** -- the test's power to catch real bugs (few false negatives).
2. **Resistance to refactoring** -- the degree to which the test survives a behavior-preserving change
   without a false failure (few false positives). **THIS IS THE LOAD-BEARING PILLAR for lz-red** (D-03):
   it is precisely "assert observable behavior, not implementation." The only way to achieve it is to
   assert on the observable end result / public API, not on internal structure.
3. **Fast feedback** -- how quickly the test runs.
4. **Maintainability** -- how easy the test is to read and to run.

Planning note: pillars 1+2 together define a test's *accuracy* (few false negatives AND few false positives).
Resistance to refactoring is the pillar you cannot trade away -- false positives destroy trust in the suite --
so it anchors the assertions slice and is the yardstick behind the whole "assert behavior not implementation"
rule.

### Khorikov's three assertion STYLES -> the ASRT-02 selection rule (no-oracle) [ASSUMED -- corroborated by ARCHITECTURE.md]
Khorikov also names three styles of unit test, which ARE the output-/state-/communication-based taxonomy in
ROADMAP SC1 / D-04:
- **Output-based (functional):** feed input, assert the RETURNED value. Highest resistance to refactoring;
  only available for pure functions / a functional core. **Maps to Bernhardt functional-core.md.**
- **State-based:** exercise, then assert the final observable STATE. **Maps to the Metz boundary
  (message-matrix.md, incoming-command side effect).**
- **Communication-based:** assert an INTERACTION (a message sent) via a double. Use sparingly. **Maps to the
  Metz boundary (message-matrix.md, outgoing-command expect-to-send).**
- **Characterization** (Feathers) is the fourth selection outcome in the mapping: pin CURRENT behavior (state
  or output) before change. **Maps to seams-and-legacy.md.**

The selection rule (lands in the assertions slice, points at the leaves): prefer output-based; use
state-based when the behavior is a state change; use communication-based ONLY for a genuine outgoing command;
use characterization when the unit is untested legacy. This is the spine that ties ASRT-02 to the three leaves.

### F.I.R.S.T. properties (owned, Clean Code Ch.9, ORACLE-GATED) [ASSUMED name-facts; prose is oracle-gated]
RCM *Clean Code* Ch.9. The acronym expands to **Fast, Independent (isolated), Repeatable, Self-validating
(boolean pass/fail), Timely (written just before the code).** These are FACTS/acronym expansions (safe to
name); every sentence of gloss must be original own-words and is produced by the oracle loop (D-01/D-14).
F.I.R.S.T. is the test-quality baseline the four pillars sit on (D-03). NOTE the co-edit boundary: F.I.R.S.T.
lands in the assertions slice in Phase 17, but the F.I.R.S.T.-as-baseline PROCEDURE step (LAW-02) is Phase 18
-- leave that marker intact.

## Message Matrix (ASRT-03 -- planning grain; OWNED, oracle-gated) [ASSUMED structure; prose is oracle-gated]

> Sandi Metz + Katrina Owen, *99 Bottles of OOP* 2nd Ed, **JavaScript Edition** (D-01 specifies the JS 2e,
> NOT the Ruby 1st ed and NOT the "Magic Tricks of Testing" talk). The matrix STRUCTURE below is a fact (a
> well-known 6-cell table); the executor's oracle loop against `.oracle/99-bottles-2e-js/index.md` produces
> the final own-words prose. Main context must NOT read the book.

Two axes: message **origin** (Incoming / Sent-to-self / Outgoing) x message **type** (Query = returns a value,
no observable side effect; Command = changes observable state, no meaningful return). The assert-vs-mock rule
per cell (this is the design-agnostic over-mocking firewall, D-05):

| Origin \ Type | Query | Command |
|---------------|-------|---------|
| **Incoming** | Assert the RETURNED value | Assert the direct public SIDE EFFECT |
| **Sent to self** (private) | Ignore (do not test) | Ignore (do not test) |
| **Outgoing** | Ignore (do not test) | **Expect to send** (the one warranted double) |

Planning notes for scoping `message-matrix.md`:
- The ONLY cell that warrants a mock/double is **outgoing command** (expect-to-send). Everything else is
  assert-a-value or do-not-test. This is the firewall against the over-mock / test-per-class anti-pattern.
- Outgoing queries and self-messages are implementation details of a collaborator -- testing them duplicates
  the collaborator's own incoming-query test and over-couples.
- The leaf's content contract already lists exactly these five cells (the four occupied by a rule plus the
  sent-to-self ignore). VIT-02 wants >= 1 tsc-strict Vitest example here (e.g. an incoming-query return
  assertion, and an outgoing-command `vi.fn()` expect-to-have-been-called).

## Testing-Stance Router (RTR-01)

### README navigation index (nav-only; detection signals + route table)
The README carries recognize-by cues and links ONLY (never stance content -- open the leaf to act). The three
route rows (detection signal -> leaf), from ARCHITECTURE.md's detection-signal work:

| Detection signal (recognize-by) | Route to |
|---------------------------------|----------|
| Value-in / value-out code; pure functions; no mocking needed | `functional-core.md` (Bernhardt) |
| Object with collaborators; a query/command message split | `message-matrix.md` (Metz + Owen) |
| Untested legacy; hidden I/O / statics / constructor work; no obvious place to assert | `seams-and-legacy.md` (Feathers) |

### functional-core.md (Bernhardt FCIS, no-oracle) [ASSUMED -- corroborated by ARCHITECTURE.md HIGH]
Gary Bernhardt, "Boundaries" (2012). Push decision logic into pure functions (the functional core) that take
values and return values with no I/O; keep side effects in a thin imperative shell at the edge. Testing
consequence (the leaf's assert/mock rule): the core is tested output-based (value-in / assert value-out) with
**no doubles** -- purity removes the need to mock; the shell gets a thin band of integration tests. Signal:
value-in/value-out code. PITFALL (see Common Pitfalls): FCIS is a design you ACHIEVE, not a precondition every
codebase has -- the router must NOT prescribe it where no core exists (that is the Feathers route).

### seams-and-legacy.md (Feathers, no-oracle; CROSS-LINK not copy) [ASSUMED -- corroborated by lz-refactor ref on disk]
Michael Feathers, *Working Effectively with Legacy Code*. RED-step framing only:
- **Seam** = a place where behavior can be altered without editing in place (object / link / preprocessing
  seam) -- the substitution/observation point where a test can assert.
- **Characterization test** = pin CURRENT behavior (correct or not) by exercising the code, observing the
  actual output, and asserting that observed value -- so a later change becomes detectable. The assert rule:
  it pins current behavior, NOT desired behavior.
- **Sequencing:** find a seam -> write a characterization test to pin current behavior -> THEN drive the new
  behavior test-first.
- **Cross-link (RTR-01):** point at the lz-refactor no-tests techniques instead of duplicating them. The
  refactor-step technique bodies (seam taxonomy, change algorithm, Sprout/Wrap, Extract Interface, Subclass
  and Override) already live in `refactoring-without-tests.md` (verified present on disk, 5951 bytes). The
  correct relative link FROM `references/testing-stance/seams-and-legacy.md` is:
  **`../../../lz-refactor/references/refactoring-without-tests.md`**
  (up out of `testing-stance/` -> `references/` -> `lz-red/` -> `skills/`, then down into
  `lz-refactor/references/`). This is a cross-skill link INSIDE the same plugin.

## Vitest 4.x Mechanics (VIT-01) -- verified current API [CITED: vitest.dev]

Imports are named exports from the package root (all example fences use this shape, which the extractor
recognizes as a module so it does NOT append `export {}`):
```
import { describe, it, test, expect, vi } from 'vitest';
```

**Mechanic -> RED-concept mapping (the VIT-01 surface):**
- **`it.todo(name)` = the running test list.** Stubs a not-yet-written test; shown as a distinct entry in the
  report. Vitest auto-marks a test with no body as todo; v4.1 tracks todos in the run summary. Maps to SEL's
  "keep a test list" (already filled Phase 16 in `three-laws-and-test-selection.md`).
- **`test.each` / `it.each` = triangulation.** Two forms: an array-table (`test.each([[a, b, expected], ...])`)
  with printf placeholders (`%s`, `%i`, `%o`, `%#`) or `$prop` object access, and a tagged-template form
  (first row = pipe-separated column names, later rows = `${value}`). Drives out the next case from concrete
  examples -- the RED facet of triangulation (bounded against lz-tpp's fake-it/generalize, already filled
  Phase 16). `test.for` is the 4.x sibling that does NOT spread arrays and exposes `TestContext`.
- **`vi.*` doubles WITH RESTRAINT.** `vi.fn(impl?)` (a spy/mock fn), `vi.spyOn(obj, key, accessor?)` (spy a
  method or get/set), `vi.mock(path, factory?)` (module substitution, hoisted above imports). Link to the
  listen-to-the-tests meta-rule (`anti-patterns.md`) and to the message matrix: the only warranted double is
  the outgoing-command expect-to-send.
- **Watch mode = the fast feedback loop.** Bare `vitest` in an interactive terminal runs in watch by default;
  `vitest run` is the single-shot CI run; `vitest --watch` forces it. The RED loop: write the failing test,
  watch it go red, hand off to lz-tpp.
- **"Fails for the right reason" as a MECHANIC only (D-08).** Show HOW to read the red bar: an
  `AssertionError` (expected X, received Y) is a valid RED (the asserted behavior is missing); a
  `ReferenceError` / `TypeError` / import failure is NOT a valid RED (the harness is broken). The LAW-02 spine
  + F.I.R.S.T.-baseline PROCEDURE is Phase 18 -- leave that marker.

**Vitest 4.0 breaking changes to AVOID tripping in examples** [CITED: vitest.dev/guide/migration]:
- `vi.fn()` / `vi.spyOn()` now support constructors: a mock invoked with `new` must use a `function`/`class`
  implementation -- an ARROW function throws "not a constructor". (Regular value-returning arrow mocks are
  still fine.)
- `vi.restoreAllMocks()` now restores only manual `vi.spyOn()` spies, not automocks. (Corroborated by
  PITFALLS.md B4.)
- Automocked getters return `undefined` (do not invoke the original); use `vi.spyOn(obj, name, 'get')`.
- `invocationCallOrder` now starts at 1 (Jest-parity).
- `toMatchTypeOf` is deprecated (expect-type) -> use `toExtend` / `toMatchObjectType`. Only relevant if a
  type-level example is shown -- and D-09 defers type-level to a brief forward-pointer, so avoid it entirely.
- Config renames (`workspace`->`projects`, `poolOptions`->top-level `maxWorkers`/`isolate`) -- only relevant
  if an example shows config; RED examples should not.

**D-09 forward-pointer (brief, accurate):** type-level RED (`expectTypeOf`/`assertType` in `*.test-d.ts`,
needs `--typecheck`; Vitest statically analyzes, does not run them) -> ADV-01; property-based RED
(`fast-check` express-the-invariant + shrink, optional `@fast-check/vitest` `test.prop` binding) -> ADV-02.
State they are advanced and deferred; do NOT author leaves; do NOT add `fast-check` as a dependency.

## Anti-Patterns (ANTI-01) + Test Desiderata (ANTI-02) -- planning grain

### The six named RED anti-patterns (D-11) with observable-behavior corrections
> Cooper's over-mock / test-per-class is OWNED (two talk transcripts in `.oracle/`), oracle-gated. The rest
> are no-oracle high-confidence core. Names + corrections at planning grain; final prose is executor's.

| # | Anti-pattern | Recognize by | Correction (observable-behavior fix) | Source / tier |
|---|--------------|--------------|--------------------------------------|---------------|
| 1 | Over-mocking / test-per-class rigidity | One spec per production class; a mock for every collaborator; "verify save() was called" | Test behaviors through the public API / port; mock only at the module boundary (outgoing command). Trigger a new test on a new BEHAVIOR, not a new class. | Ian Cooper (OWNED, oracle-gated) |
| 2 | Testing private methods | Reflection/casting to reach privates; tests break on internal rename | Exercise privates through the public API; if that is hard, it is design feedback (extract a collaborator). | Cooper / Metz / Khorikov |
| 3 | Multiple unrelated assertions in one test | A test name with "and"; asserts spanning different behaviors | One concept per test; split (ties to STR-02, already filled Phase 16). | Beck / Osherove / Wake |
| 4 | A test that passes immediately (no red) | Green on first run before production code exists | See it fail first; a never-red test proves nothing (LAW-02 procedure is Phase 18; here it is the anti-pattern). | RCM Three Laws / Beck |
| 5 | Snapshot-as-thinking | `toMatchSnapshot()` as the primary assertion; blindly updating snapshots | Assert the specific observable behavior you intend; reserve snapshots for stable serializable output you actually review. | Khorikov / Beck |
| 6 | Slow / order-dependent tests | Shared mutable state; pass only in run order; hit real I/O | Isolate state; push I/O to a shell; make each test independent + fast (F.I.R.S.T.). | RCM F.I.R.S.T. |

Khorikov's implementation-detail brittleness threads through 1/2/5 as the assertion-side failure mode: an
implementation-detail assertion has low resistance to refactoring.

### RTR-03 "listen to the tests" meta-rule (lands in anti-patterns.md)
Test-writing pain (heavy mocking, private access, awkward assertions) is DESIGN FEEDBACK -- route toward a
functional core (Bernhardt) or a seam (Feathers), NOT more doubles. **GOOS (Freeman + Pryce) is the
COUNTERPOINT only:** the mockist/London school also "listens to the tests" but uses the pain to drive OO
design via mocking roles at boundaries -- state it fairly; the classicist / value-based default holds. **DHH
is never cited** (hard ban).

### ANTI-02 Test Desiderata (Beck, no-oracle) [ASSUMED -- Beck's public list]
Kent Beck's good-test properties, framed as tradeoffs to OPTIMIZE, not dogma (the lz-tpp "heuristic not law"
voice). The properties: **Isolated, Composable, Deterministic, Fast, Writable, Readable, Behavioral,
Structure-insensitive, Automated, Specific, Predictive, Inspiring.** The KEY lens (why it is a tradeoff, not a
checklist): several are in TENSION -- e.g. Behavioral (sensitive to behavior change) vs Structure-insensitive
(insensitive to structure change; this is Khorikov's resistance-to-refactoring restated); Writable vs
Readable; Fast vs Predictive. You cannot max all; you optimize the mix per context. That tension IS the ANTI-02
content.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Compile-check the TS examples | A new per-file tsc runner | Existing `extract-samples.mjs` (one-module-per-fence, recursive, GREEN-on-empty) | Already handles module-scope isolation, `ts ignore` fences, unterminated-fence detection, README skip. NO change needed. |
| Content-completeness gate | A brand-new checker | EXTEND `check-red-references.mjs` (FILES array + topic/fence/scaffold/deferral idiom + SUMMARY/exit contract) | Sibling checker duplicates all of that. Extend in place (D-13 discretion; recommended). |
| ASCII / work-email / no-verbatim scan | A new hygiene checker in lz-red-workspace | Existing shared `check-hygiene.mjs` (already includes the lz-red tree on all three axes) | Lines 114-118 (ASCII+email wideTargets) and 139-143 (no-verbatim verbatimTargets) already cover lz-red. NO change needed. |
| Feathers no-tests technique bodies | Re-author seams/Sprout/Wrap/Extract-Interface in seams-and-legacy.md | Cross-link to `refactoring-without-tests.md` | RTR-01 says link, not copy; the no-verbatim gate would also flag duplicated prose. |
| Own-words prose for OWNED surfaces (Metz matrix, F.I.R.S.T., Cooper) | Paraphrase from memory in main context | The clean-room oracle / oracle-reviewer loop (converge-to-clean, 3-round cap) | D-01/D-14; main context must never read `.oracle/`; owned surfaces are oracle-gated. |

**Key insight:** All three validation instruments already exist and two of them (`extract-samples.mjs`,
`check-hygiene.mjs`) need ZERO change -- they auto-cover new Phase-17 files. Only `check-red-references.mjs`
needs extension. The lazy, correct move is to extend it in place, not stand up a sibling.

## Instrument Extension (D-13) -- concrete guidance for the planner

The workspace has three checkers. Precise state and required change for each:

### 1. `extract-samples.mjs` (the tsc --strict gate) -- NO CHANGE NEEDED
- Walks `references/` recursively (flat docs + `testing-stance/` subdir), extracts every ` ```ts ` /
  ` ```typescript ` fence into its OWN module under `samples/`, runs `tsc --strict --noEmit -p tsconfig.json`.
- GREEN-on-empty (0 fences compile vacuously); skips `README` files; skips fences whose info string includes
  `ignore` (` ```ts ignore `); appends `export {}` to any fence that does not already `import`/`export` (forces
  module scope so sibling fences do not collide); FAILS LOUD on an unterminated fence.
- **Authoring constraints this imposes on Phase-17 fences (load-bearing):**
  - Each fence must be **self-contained**: define or import every symbol it uses. A fence cannot reference a
    symbol from a previous fence (each becomes its own module).
  - **tsconfig is `lib: ["es2021"]`, `target es2021`, `moduleResolution bundler`, `skipLibCheck true`, no DOM
    and no @types/node.** So: no `document`/`window`/DOM types, no Node builtins (`fs`, `process`) in a fence,
    or it will not compile. `import { ... } from 'vitest'` resolves via bundler resolution against the local
    vitest devDep -- that is the intended import.
  - A "red example" must **compile clean and fail at RUNTIME** (assertion mismatch). Do NOT show a test that
    references a not-yet-defined production symbol (that is a compile error -> breaks the gate). Either stub
    the SUT with a typed placeholder that returns a wrong value (so the assertion fails at runtime, which is
    the point), or tag the fence ` ```ts ignore ` and explain why in prose.
  - Run via `npm --prefix .claude/skills/lz-red-workspace run typecheck` (guarantees the pinned tsc 6.0.3 on
    PATH via node_modules/.bin).

### 2. `check-red-references.mjs` (the content-completeness gate) -- MUST BE EXTENDED
Current state: it covers only the THREE Phase-16 CORE references (`three-laws-and-test-selection.md`,
`test-structure-and-assertions.md`, `naming.md`) with per-file `topics` tokens + an unconditional `>= 1 ts
fence` assertion + a no-scaffold-phrase guard + an optional `deferral` marker-must-remain guard. Required
Phase-17 changes:

- **(a) Flip the assertions-slice deferral.** The `test-structure-and-assertions.md` entry currently asserts
  its `deferral: /Phase 17|ASRT-0/` marker REMAINS. Phase 17 FILLS that slice, so this guard must be REMOVED
  (or inverted to assert the "deferred to Phase 17" language is GONE), and replaced with ASRT content tokens
  (four pillars, resistance to refactoring, F.I.R.S.T., observable behavior, output/state/communication).
  **CAUTION:** the heading `## Assertions and the four pillars (Phase 17)` contains the literal "Phase 17"; an
  inverted "no Phase-17 marker" guard would false-fail on that heading. RECOMMEND: rename the heading to drop
  "(Phase 17)" when filling, and simply delete the deferral guard, adding content tokens instead.
- **(b) Add six Phase-17 FILES entries** (or a sibling checker) with content tokens + no-scaffold guard:
  `testing-stance/README.md` (detection signal, route table, links to the 3 leaves), `functional-core.md`
  (signal / value-based / no-doubles), `message-matrix.md` (incoming query, incoming command, outgoing
  command, expect-to-send, outgoing query ignore), `seams-and-legacy.md` (seam, characterization, sequencing),
  `vitest-typescript-mechanics.md` (it.todo, test.each/it.each, vi., watch, ADV forward-pointer),
  `anti-patterns.md` (the six anti-pattern names + listen-to-the-tests + Test Desiderata + GOOS counterpoint).
- **(c) Make the `>= 1 ts fence` assertion PER-FILE.** The current gate applies it unconditionally to every
  FILES entry. `README.md` is navigation-only (MUST NOT carry a fence -- the extractor skips READMEs anyway),
  and `anti-patterns.md` / `seams-and-legacy.md` may legitimately carry zero fences. Add a `requireFence:
  true|false` flag: TRUE for `test-structure-and-assertions.md` (assertions slice), `message-matrix.md`,
  `functional-core.md`, `vitest-typescript-mechanics.md`; FALSE for `README.md` (and optionally the other two).
  This satisfies VIT-02 ("examples throughout") without false-RED-ing the nav-only / prose-only files.
- **(d) Add a cross-link presence guard** on `seams-and-legacy.md`: assert the string
  `refactoring-without-tests.md` (or the full relative link) appears -- machine-proof of RTR-01 "cross-linked,
  not copied".
- **(e) Keep intact:** the `three-laws-and-test-selection.md` `deferral: /Phase 18|LAW-0|SEAM-0/` guard (Phase
  17 does not touch that file). For any Phase-17 file that leaves a Phase-18 insertion point (e.g. the
  vitest leaf noting the LAW-02 spine is Phase 18), add a deferral-marker-remains guard so the co-edit
  boundary (D-15) is machine-enforced.
- `SCAFFOLD_RES` (shared `lib/scaffold-phrases.mjs`) already trips on `## Sources (placeholder)`, `TODO`,
  `TBD`, `to be authored`, `once it exists`, `placeholder`. Each filled stub must rewrite `## Sources
  (placeholder)` to a real `## Sources` section (as Phase 16 did).

### 3. `check-hygiene.mjs` (ASCII + work-email + no-verbatim) -- NO CHANGE NEEDED
- Already includes the lz-red SKILL.md + `references/**` in the ASCII + work-email `wideTargets` (lines
  114-118) AND the no-verbatim `verbatimTargets` (lines 139-143). Runs from `lz-refactor-workspace/tools`.
- Constraints on Phase-17 authoring: **ASCII-only** (no em-dash, curly quotes, arrows, emoji -- use `--`,
  `->`, ASCII); **only `larsbrinknielsen@gmail.com`** may appear as an email-shaped token (allowlist-inversion;
  the maintainer work email + its bare domain must never appear, even as a search needle); **no double-quoted
  run >= 120 chars** (the no-verbatim proxy -- keep example strings and quoted phrases short, and never paste
  book prose). Owned surfaces additionally clear the oracle-reviewer converge-to-clean loop on top of this scan.

## Validation Architecture

> `workflow.nyquist_validation: true` in config -> this section is REQUIRED. This is a Markdown skill-authoring
> phase; "tests" are the dev-only workspace checkers, not a runtime test suite.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None shipped (Markdown-only skill). Dev-only gates: Node.js checkers + `tsc --strict` (typescript 6.0.3) + vitest 4.1.10 types, all under `.claude/skills/lz-red-workspace/` (never shipped). |
| Config file | `.claude/skills/lz-red-workspace/tsconfig.json` (`strict`, `noEmit`, `include: samples/**/*.ts`) |
| Quick run command | `npm --prefix .claude/skills/lz-red-workspace run check` (= `node tools/check-red-references.mjs`, extended) |
| Full suite command | `npm --prefix .claude/skills/lz-red-workspace run typecheck && npm --prefix .claude/skills/lz-red-workspace run check && node .claude/skills/lz-refactor-workspace/tools/check-hygiene.mjs` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test type | Automated signal (command) | File exists? |
|--------|----------|-----------|----------------------------|--------------|
| ASRT-01 | Four pillars + resistance-to-refactoring load-bearing + F.I.R.S.T. in assertions slice | content-gate + tsc + oracle | `check-red-references` tokens on `test-structure-and-assertions.md` (added) + `run typecheck` (fence) + oracle-reviewer PASS (F.I.R.S.T.) + no-verbatim | Instrument: EXTEND (Wave 0) |
| ASRT-02 | Output/state/communication selection tied to the router | content-gate | `check-red-references` selection tokens in assertions slice + each leaf's assert-rule token | EXTEND (Wave 0) |
| ASRT-03 | Metz matrix assert-vs-mock rule (6 cells; expect-to-send only outgoing command) | content-gate + tsc + oracle | `check-red-references` cell tokens on `message-matrix.md` + fence (`run typecheck`) + oracle-reviewer PASS (owned 99 Bottles) + no-verbatim | EXTEND (Wave 0) |
| RTR-01 | testing-stance README route table + 3 leaves; Feathers cross-link not copy | content-gate | `check-red-references` entries for README + 3 leaves + the `refactoring-without-tests.md` cross-link-presence guard | EXTEND (Wave 0) |
| RTR-03 | Listen-to-the-tests routes to core/seam; GOOS counterpoint only | content-gate | `check-red-references` listen-to-the-tests + GOOS-counterpoint tokens on `anti-patterns.md` | EXTEND (Wave 0) |
| VIT-01 | it.todo / test.each / vi.* restraint / watch mapped to RED + ADV forward-pointer | content-gate + tsc | `check-red-references` mechanic tokens + ADV pointer token on `vitest-typescript-mechanics.md` + fence | EXTEND (Wave 0) |
| VIT-02 | TS+Vitest examples throughout; every fence tsc-strict clean | tsc | `run typecheck` -> `extract-samples` GREEN over all extracted modules | Exists (no change) |
| ANTI-01 | Six named anti-patterns + observable-behavior fix (incl. Cooper) | content-gate + oracle | `check-red-references` six anti-pattern-name tokens on `anti-patterns.md` + oracle-reviewer PASS (Cooper owned) | EXTEND (Wave 0) |
| ANTI-02 | Test Desiderata tradeoff lens in "heuristic not law" voice | content-gate | `check-red-references` Test-Desiderata + tradeoff/heuristic tokens on `anti-patterns.md` | EXTEND (Wave 0) |

### Global gates (apply to every requirement)
- `extract-samples` GREEN -- every extracted fence is `tsc --strict --noEmit` clean (VIT-02).
- `check-hygiene` GREEN -- ASCII-only, work-email allowlist-inversion, no-verbatim (>=120-char quoted run)
  across the lz-red tree (DST-04 / hygiene; no change to the checker).
- No `SCAFFOLD_RES` phrase leaks (each `## Sources (placeholder)` rewritten to `## Sources`).
- Phase-18 deferral markers REMAIN (co-edit boundary D-15): the `three-laws-and-test-selection.md` Phase-18
  guard stays, and any Phase-18 insertion point Phase 17 leaves is guarded.
- Owned surfaces (Metz matrix, F.I.R.S.T., Cooper) additionally clear oracle-reviewer converge-to-clean.

### Sampling Rate
- **Per task commit:** `npm --prefix .claude/skills/lz-red-workspace run check` (fast content gate).
- **Per wave merge:** the Full suite command (content + tsc + hygiene).
- **Phase gate:** Full suite GREEN + skill-reviewer PASS (>= 1 unbiased) + `claude plugin validate .` exit 0
  before `/gsd:verify-work`.

### Wave 0 Gaps
- [ ] EXTEND `.claude/skills/lz-red-workspace/tools/check-red-references.mjs`: add six Phase-17 file entries;
      flip the `test-structure-and-assertions.md` deferral guard to ASRT content tokens; add a per-file
      `requireFence` flag; add the `seams-and-legacy.md` cross-link-presence guard; add Phase-18 deferral
      guards for any co-edited insertion points. (This IS the instrument-first Wave-0 RED baseline.)
- [ ] No framework install needed -- the workspace already has `typescript` + `vitest` installed and pinned.
- [ ] No change to `extract-samples.mjs` or `check-hygiene.mjs` (they auto-cover new Phase-17 files).

## Common Pitfalls

### Pitfall 1: A red example that is a COMPILE error, not a runtime failure
**What goes wrong:** Authoring a "failing test" example that references a not-yet-implemented production symbol
breaks `tsc --strict` (name not found) -> the extractor RED-fails the whole gate.
**How to avoid:** Show the red as a RUNTIME assertion failure -- stub the SUT with a typed placeholder that
returns a wrong value so `expect(...).toBe(...)` fails at run time (the actual RED). If a
not-yet-implemented example is pedagogically necessary, tag the fence ` ```ts ignore ` and say why in prose.
**Warning signs:** `tsc` error "Cannot find name X" in a red example; a fence that imports the SUT from a
nonexistent module.

### Pitfall 2: DST-04 near-verbatim leak on the OWNED surfaces
**What goes wrong:** The Metz matrix cells, the F.I.R.S.T. gloss, and Cooper's formulations are terse and
memorable -- a blind draft reconstructs them near word-for-word (this trap has fired repeatedly in this repo).
**How to avoid:** Owned surfaces (message-matrix.md, F.I.R.S.T. in the assertions slice, Cooper in
anti-patterns.md) MUST go through the clean-room oracle / oracle-reviewer loop; main context never reads
`.oracle/`. Paraphrase every canonical one-liner in original words from the first draft. The no-verbatim gate
(>=120-char quoted run) + oracle-reviewer verdict are the backstop.
**Warning signs:** A leaf sentence that would match the book if grep'd; an acronym gloss that reads like the
book's own gloss; a reviewer flags "this is the source's phrasing."

### Pitfall 3: FCIS prescribed where no functional core exists (the brownfield trap)
**What goes wrong:** `functional-core.md` reads as "always extract a pure core and test it without mocks," but
FCIS is a design you ACHIEVE, not a property every codebase has. On seamless legacy the advice is unactionable.
**How to avoid:** The README route table branches by detected signal; no-seam legacy routes to Feathers
(seam + characterization first), NOT to FCIS. Keep functional-core.md scoped to "when the code IS value-in/
value-out," and let the router own the "which stance" decision.
**Warning signs:** functional-core.md implying it is the default; a RED step that needs a multi-file
restructure before a test can be written.

### Pitfall 4: README accreting stance content (breaking navigation-only)
**What goes wrong:** The route table starts carrying assert/mock guidance, duplicating the leaves and blowing
the nav-only contract.
**How to avoid:** README carries recognize-by signals + links ONLY. All assert/mock content lives in the
leaves. This mirrors lz-refactor `smells.md`.

### Pitfall 5: Over-filling a later phase's slice (co-edit boundary)
**What goes wrong:** Phase 17 authors the LAW spine / fail-for-the-right-reason PROCEDURE / RTR-02 SKILL.md
wiring, which belong to Phase 18.
**How to avoid:** Fill ONLY the ASRT / RTR-01 / RTR-03 / VIT / ANTI slices. "Fails for the right reason" is a
Vitest MECHANIC here (read the red bar), NOT the LAW-02 procedure. Do NOT edit the SKILL.md body. The
Phase-18 deferral guards in the instrument enforce this.

### Pitfall 6: Vitest version drift in examples
**What goes wrong:** Examples use removed/deprecated APIs (`toMatchTypeOf`, old `workspace` config, arrow-fn
mock constructors) that fail or mislead on Vitest 4.1.10.
**How to avoid:** Pin to the verified 4.x surface in this doc; avoid `toMatchTypeOf` (deprecated) and config
snippets entirely; if a mock is constructed with `new`, use a `function`/`class` impl. Every fence goes
through `tsc --strict` against the pinned vitest types, which catches signature drift.

## State of the Art

| Old Approach | Current Approach (Vitest 4.x) | Impact |
|--------------|-------------------------------|--------|
| `toMatchTypeOf` (type-level) | `toExtend` / `toMatchObjectType` | Only matters if a type-level example is shown; D-09 defers type-level, so avoid it. |
| `vi.restoreAllMocks()` resets everything | Restores only manual `vi.spyOn()` spies, not automocks (v4) | Keep mock examples minimal; do not rely on a broad reset. |
| Arrow-fn mock usable as constructor | Must be `function`/`class` if invoked with `new` (v4) | Constructor mocks in examples must not be arrows. |
| `workspace` config / `poolOptions` | `projects` / top-level `maxWorkers` + `isolate` (v4) | Do not show config in RED examples. |
| `it.each` only | `it.each` + `it.for` (arrays not spread; TestContext) | `it.each` is the triangulation idiom to teach; `it.for` is a mention at most. |

**Deprecated / banned as sources:** DHH ("TDD is dead" / test-induced design damage) is HARD-BANNED (D-02) --
never cited or referenced. GOOS is COUNTERPOINT-only, never the default route.

## Assumptions Log

> Domain framing tagged `[ASSUMED]` is high-confidence public knowledge corroborated by the milestone research
> (PITFALLS.md / ARCHITECTURE.md, HIGH confidence, 2026-07-18). For the OWNED surfaces, the final own-words
> prose is produced by the executor's oracle loop, not asserted here -- so the risk below is about SCOPING, not
> final wording.

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Khorikov's four pillars are exactly {protection against regressions, resistance to refactoring, fast feedback, maintainability} with resistance-to-refactoring load-bearing | Assertion Design | LOW -- corroborated by PITFALLS.md + D-03; the load-bearing choice is a locked decision. |
| A2 | Khorikov's output/state/communication test styles ARE the ASRT-02 taxonomy and map cleanly to the three leaves | Assertion Design | LOW -- the mapping is written verbatim in ROADMAP SC1 / D-04. |
| A3 | The Metz matrix is the 6-cell origin x type table with expect-to-send only for outgoing command | Message Matrix | LOW for STRUCTURE (well-known, matches D-05 + the stub contract); final PROSE is oracle-gated. |
| A4 | F.I.R.S.T. = Fast, Independent, Repeatable, Self-validating, Timely | Assertion Design | LOW -- standard acronym; gloss is oracle-gated (owned). |
| A5 | Beck's Test Desiderata list (~12 properties) and the specific tension pairs | Anti-Patterns | LOW-MEDIUM -- Beck's public list; exact membership may vary slightly by phrasing, but the tradeoff LENS (what ANTI-02 needs) is robust. |
| A6 | The six anti-patterns and their observable-behavior corrections | Anti-Patterns | LOW -- matches D-11 verbatim; Cooper's is oracle-gated for final prose. |
| A7 | Cross-link relative path `../../../lz-refactor/references/refactoring-without-tests.md` resolves | Testing-Stance Router | LOW -- path computed from the two file locations; target existence VERIFIED on disk. |
| A8 | Vitest 4.x API signatures + 4.0 breaking changes as documented | Vitest Mechanics | LOW -- [CITED] official vitest.dev docs + [VERIFIED] npm; pinned 4.1.10 in the workspace is authoritative. |

## Open Questions

1. **Should the fence requirement apply to `anti-patterns.md` and `seams-and-legacy.md`?**
   - What we know: VIT-02 wants examples "throughout"; README must be fence-free; the four example-bearing
     leaves (assertions slice, message-matrix, functional-core, vitest-mechanics) clearly need fences.
   - What's unclear: whether anti-patterns.md / seams-and-legacy.md carry a fence.
   - Recommendation: planner's call. Recommend `requireFence: false` for both (they are prose/nav-heavy), and
     let VIT-02 be satisfied by the four example-bearing files. A short anti-pattern "bad vs good" fence is a
     nice-to-have, not required.

2. **Extend `check-red-references.mjs` vs add a sibling `check-red-stance.mjs`?**
   - What we know: D-13 + Claude's Discretion leave this to the planner; the tsc gate + no-verbatim scan are
     mandatory either way.
   - Recommendation: EXTEND in place -- the FILES-array + topic/fence/scaffold/deferral idiom already fits;
     a sibling duplicates the SUMMARY/exit scaffolding. (This is the lazy, correct move.)

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | running the three `.mjs` checkers | Yes (repo uses Node ESM throughout) | -- | none needed |
| `typescript` (workspace devDep) | `extract-samples.mjs` tsc gate | Yes (installed) | 6.0.3 (pinned) | global `tsc` on PATH (comment in extractor confirms) |
| `vitest` (workspace devDep) | vitest types for example fences | Yes (installed; node_modules present) | 4.1.10 (pinned) | none needed |
| `.oracle/99-bottles-2e-js/`, `.oracle/clean-code/`, the two Cooper transcripts | oracle loop for the OWNED surfaces (execute-time only) | Provisioned in Phase 16 (git-ignored) | -- | If missing at execute, the owned-surface authoring blocks -- but that is an EXECUTE concern, not planning; main context must not read them. |

**Missing dependencies with no fallback:** none for planning.
**Missing dependencies with fallback:** `tsc` resolves via workspace node_modules/.bin under `npm run
typecheck`; global tsc is the fallback if run bare.

## Security Domain

`security_enforcement` is not set in config (absent = enabled), but this phase ships **Markdown documentation
only** -- no runtime, no auth, no sessions, no input handling, no network, no crypto, no data store. Standard
ASVS categories (V2 auth, V3 session, V4 access control, V5 input validation, V6 crypto) do NOT apply.

The only security-adjacent concerns are handled by the existing hygiene gate, not new controls:
| Concern | Control (already in place) |
|---------|----------------------------|
| Maintainer work-email / bare-domain leak in committed content or commit identity | `check-hygiene.mjs` allowlist-inversion (only `larsbrinknielsen@gmail.com` permitted); verify git author/committer = public gmail before committing; never write the forbidden value as a search needle. |
| Copyright exposure (DST-04) from verbatim book/talk prose | Clean-room `.oracle/` (oracle agents only) + oracle-reviewer converge-to-clean + no-verbatim scan (>=120-char quoted run). |
| Non-ASCII / mojibake in shipped tree | `check-hygiene.mjs` ASCII-only byte scan. |

No STRIDE threats apply to a static Markdown reference tree.

## Sources

### Primary (HIGH confidence)
- `plugins/lz-tdd/skills/lz-red/references/**` and `SKILL.md` (on disk) -- the six stubs' per-doc content
  contracts, the SKILL.md reference pointers, the co-edit markers.
- `.claude/skills/lz-red-workspace/tools/check-red-references.mjs`, `extract-samples.mjs`, `tsconfig.json`,
  `package.json`, `tools/lib/scaffold-phrases.mjs` (on disk) -- exact instrument behavior, pins (typescript
  6.0.3 / vitest 4.1.10), tsconfig (lib es2021, bundler resolution).
- `.claude/skills/lz-refactor-workspace/tools/check-hygiene.mjs` (on disk) -- confirms the lz-red tree is
  already in all three hygiene axes (ASCII lines 114-118, no-verbatim lines 139-143).
- `plugins/lz-tdd/skills/lz-refactor/references/refactoring-without-tests.md` (on disk; existence VERIFIED via
  `ls`) -- the cross-link target; its technique set (do not duplicate).
- Vitest official docs [CITED]: `vitest.dev/api/` (it.todo, test.each/it.each, test.for),
  `vitest.dev/api/vi` (vi.fn/spyOn/mock signatures), `vitest.dev/guide/testing-types` (expectTypeOf/assertType,
  --typecheck, *.test-d.ts), `vitest.dev/guide/migration` (4.0 breaking changes). Fetched 2026-07-19.
- npm registry [VERIFIED]: `vitest` 4.1.10 (matches pin), `fast-check` 4.9.0, `@fast-check/vitest` 0.4.1.
- 17-CONTEXT.md (D-01..D-15), ROADMAP.md (Phase 17 goal + 5 success criteria), REQUIREMENTS.md (ASRT/RTR/VIT/
  ANTI + ADV-01/02 Future Requirements + Out-of-Scope) -- the locked scope.

### Secondary (HIGH -- prior milestone research, 2026-07-18)
- `.planning/research/PITFALLS.md` -- Bucket A anti-patterns A1-A10 (source-tied), Bucket B authoring pitfalls
  incl. B4 Vitest 4.x drift (corroborates `toMatchTypeOf` deprecation + `vi.restoreAllMocks()` narrowing),
  the DST-04 near-verbatim trap, the FCIS-brownfield trap.
- `.planning/research/ARCHITECTURE.md` -- the detection-signal / route-table work, the reference grain, the
  progressive-disclosure conventions, the coach-procedure shape (Phase 18 context).

### Tertiary (domain framing -- high-confidence core, `[ASSUMED]`)
- Khorikov four pillars + three assertion styles; Metz + Owen query/command matrix (STRUCTURE only -- final
  prose oracle-gated); Bernhardt FCIS; Feathers seams + characterization; Kent Beck Test Desiderata; Ian
  Cooper over-mock / test-per-class (final prose oracle-gated). All corroborated by the HIGH-confidence
  milestone research above; none read from `.oracle/` in this session.

## Metadata

**Confidence breakdown:**
- Standard stack (Vitest 4.x API): HIGH -- [CITED] official docs + [VERIFIED] npm + pinned in workspace.
- Instrument extension: HIGH -- read the three checkers' source directly on disk.
- Domain framing (pillars / matrix / anti-patterns / desiderata): HIGH-confidence core -- corroborated by the
  milestone research; owned surfaces' final prose deferred to the execute-time oracle loop by design.
- Cross-link path: HIGH -- computed from file locations; target existence verified on disk.

**Research date:** 2026-07-19
**Valid until:** ~2026-08-18 for the domain framing (stable canon); ~2026-08-02 for the Vitest API surface
(4.x is fast-moving and 5.0 exists in beta, but the workspace pin at 4.1.10 is authoritative regardless).

## RESEARCH COMPLETE
