# Phase 18: Coach Procedure & lz-tpp Seam Wiring - Context

**Gathered:** 2026-07-20
**Status:** Ready for planning
**Mode:** --analyze --auto --chain (autonomous single pass; trade-off tables logged for the audit
trail, recommended option auto-locked per gray area). Every gray area was rated on IMPACT x
CONFIDENCE per the trap-quadrant rule. None landed HIGH-impact + NOT-high-confidence, so nothing was
escalated: the phase is heavily pre-determined by the ROADMAP Success Criteria (4 items), the four
co-edited Phase-18 insertion-point markers already left in the shipped references, the instrument's
existing Phase-18 deferral guards, and the direct lz-refactor (Phase 9) and lz-tpp inline
coach-procedure precedent. The single genuine judgment call (D-05, the Three Laws provenance tier) is
evidence-backed AND reversible at the oracle-reviewer gate, so it was auto-locked with a
gate-confirms caveat, exactly as Phase 17.1 handled its provisional owned rows.

<domain>
## Phase Boundary

Author the lz-red COACH PROCEDURE and wire the lz-red <-> lz-tpp seam. This is the phase that ties
the Phase-16/17 references together into an executable RED decision procedure on the Three Laws
spine, routes the testing stance, fails for the right reason, and closes the carried reverse-pointer
tech-debt in the shipped lz-tpp skill. Fills LAW-01, LAW-02, RTR-02, SEAM-01, SEAM-02, and the
deferred SKILL.md-body clause of VIT-02.

In scope:

- **SKILL.md body (lz-red):** replace the "Coach decision procedure (deferred to Phase 18)"
  placeholder with the real numbered coach procedure. It classifies RED vs GREEN vs REFACTOR first,
  spines on the Three Laws of TDD (Law 1 gates entry -- no production code before a failing test;
  Law 2 sizes the test -- only enough to fail, not-compiling counts; Law 3 is the lz-tpp handoff),
  runs the stance-routing step (RTR-02), runs the fail-for-the-right-reason step (LAW-02), and hands
  off forward to lz-tpp (SEAM-01). Carries ONE tsc-strict Vitest worked example (VIT-02 SKILL.md
  clause). Coach questions rather than drives (no auto-editing / running the suite unprompted).
- **`three-laws-and-test-selection.md`:** fill the "## The Three Laws spine and classify-first
  (Phase 18)" insertion point with the owned Three Laws prose + classify-first framing (LAW-01,
  LAW-02, SEAM-01). Leave the SEL slice (Phase 16) intact.
- **`test-structure-and-assertions.md`:** fill the Phase-18 F.I.R.S.T.-as-baseline procedure marker
  (LAW-02 leans on the already-owned F.I.R.S.T. row). Leave the STR/ASRT slices intact.
- **`vitest-typescript-mechanics.md`:** fill the Phase-18 LAW-02 spine marker (the "fails for the
  right reason" mechanic is already present; Phase 18 ties it to the LAW-02 procedure step). Leave
  the VIT slice intact.
- **`testing-stance/README.md`:** the navigation index (content authored Phase 17) gets WIRED into
  the SKILL.md routing step (RTR-02). No index rewrite -- the SKILL.md points at it.
- **`principle-backing.md`:** fill the "## Three-Laws spine and lz-tpp seam backing (Phase 18)"
  marker with the LAW-01/LAW-02 + SEAM-01/SEAM-02 backing rows and their access tiers.
- **`plugins/lz-tdd/skills/lz-tpp/SKILL.md` (SHIPPED skill):** add the reverse `lz-tpp -> lz-red`
  pointer AND the deferred `lz-tpp -> lz-refactor` pointer, in the SAME edit (SEAM-02). Subagent-
  reviewed (>= 1 unbiased from-scratch reviewer) before acceptance.
- **`check-red-references.mjs` (dev-only instrument):** extend in place -- flip the four Phase-18
  deferral guards into content assertions, add the SKILL.md coach-procedure content tokens + a
  SKILL.md ts-fence assertion (VIT-02), and add a guard for the lz-tpp reverse pointer. tsc extractor
  must cover the new SKILL.md fence.

Explicitly NOT in this phase (fixed by ROADMAP; the ROADMAP's own later phases / Future
Requirements -- recorded so the planner does not pull them in):

- plugin.json 0.0.3 bump / README / CHANGELOG / first-party validators / hygiene sweep
  (DST-01/02/03) -> Phase 19.
- Eval workspace + trigger/behavior evals + description tuning (EVL-01/02) -> Phase 20.
- Type-level RED (`expectTypeOf`/`assertType`) and property-based RED (`fast-check`) leaves
  (ADV-01/02) -> Future Requirements (post-0.0.3).
- Any new SEL/STR/ASRT/RTR-01/RTR-03/NAME/ANTI reference CONTENT -- those slices are Complete
  (Phases 16/17/17.1); Phase 18 only ties into them and adds the spine/seam.
- Making the shipped-skill edits LIVE (`/reload-plugins`) -- a human action at ship time (Phase 19).

</domain>

<decisions>
## Implementation Decisions

Requirements LAW-01, LAW-02, RTR-02, SEAM-01, SEAM-02, and the VIT-02 SKILL.md clause (see
REQUIREMENTS.md) are the locked scope. The decisions below are the HOW, auto-resolved from the four
ROADMAP Success Criteria, the four co-edited Phase-18 insertion-point markers, the instrument's
Phase-18 deferral guards, and the lz-refactor (Phase 9) / lz-tpp inline coach-procedure precedent.
Confidence was HIGH on all; D-05 (the Three Laws provenance tier) is gate-confirmed.

### Coach procedure placement & shape (SKL-02, LAW-01/02, RTR-02, SEAM-01)

- **D-01:** The coach procedure is authored INLINE in `SKILL.md`, replacing the Phase-18 placeholder
  -- NOT a new reference file. Rationale: SKL-02 (lean router, near lz-tpp's ~81 lines), the explicit
  placeholder already reserving the SKILL.md body, and the two shipped precedents (lz-refactor's
  6-step inline coach procedure at SKILL.md:44-121, lz-tpp's 7-step inline procedure). Trade-off
  logged below; HIGH impact, HIGH confidence -> auto-locked.

  | Option | Pros | Cons |
  |---|---|---|
  | Inline in SKILL.md (chosen) | Matches lz-tpp + lz-refactor precedent; coach mode reaches it with no extra load; the placeholder already reserves this slot | Grows SKILL.md (est. ~130-180 lines; still well under the 500 cap and near lz-refactor's 181) |
  | New `references/coach-procedure.md` leaf | Keeps SKILL.md tiny | Breaks the established pattern; the always-active procedure would sit behind a lazy load; no precedent in the plugin |

- **D-02:** Procedure shape mirrors the shipped precedents -- a compact numbered decision tree,
  cross-links file-level to already-existing references (never restating their content). The step
  order follows ROADMAP SC 1-3: (1) classify RED vs GREEN vs REFACTOR against the lz-tpp / lz-refactor
  seams; (2) Three Laws spine -- Law 1 gates entry, Law 2 sizes the test; (3) detect + match the house
  test idiom and route the stance (RTR-02); (4) structure the test + assert observable behavior
  (points at the Phase-16/17 slices); (5) fail-for-the-right-reason (LAW-02); (6) forward handoff to
  lz-tpp (Law 3 / SEAM-01). A closing "coach by default; hand off, do not drive" paragraph mirrors
  lz-refactor's. HIGH impact, HIGH confidence (ROADMAP SC spells the steps out) -> auto-locked.

### Classify-first seam & forward handoff (SEAM-01)

- **D-03:** The procedure classifies every request into red / green / refactor BEFORE any test is
  written (ROADMAP SC1, "classifies RED vs GREEN vs REFACTOR first"): a failing test that must be
  made to pass -> hand off to lz-tpp (the green step) and stop; already-passing code to clean up ->
  hand off to lz-refactor (the refactor step); otherwise choosing/writing the next failing test is
  lz-red. This reuses the framing already in SKILL.md's "RED vs the green step ... and the refactor
  step" section (Phase 15) rather than restating it. The forward `lz-red -> lz-tpp` handoff is Law 3:
  once the failing test is confirmed red for the right reason, making it pass is lz-tpp's job.

### Three Laws spine provenance (LAW-01/02) -- the one judgment call

- **D-04:** The owned distilled Three Laws prose lands in the `three-laws-and-test-selection.md`
  "Three Laws spine (Phase 18)" section; the SKILL.md coach procedure carries only the compact spine
  (Law 1 / Law 2 / Law 3 as procedure steps) and points at the leaf. This is the same
  reference-carries-content / SKILL.md-carries-orchestration split lz-refactor Phase 9 used (the
  coach procedure was orchestration prose; the owned content lived in the leaves + principle refs).

- **D-05 (judgment call -- Three Laws access tier):** TARGET tier for the Three Laws spine =
  `Owned; oracle-verified` against Robert C. Martin, *Clean Code* Ch. 9 (Unit Tests), which is
  already owned in the clean-room set (`.oracle/clean-code/index.md`) and already backs the
  adjacent "grow the test only enough to fail" row as owned. LAW-02's "only enough to fail;
  not-compiling counts" is the SAME thread as that existing owned row, so the spine is gateable
  against real full-text (satisfies the Phase-17.1 D-05 honesty gate: owned only when verifiable
  against source text). The Law-3-as-lz-tpp-handoff REFRAME is lz-red orchestration (no-oracle). The
  owned surface goes through the orchestrator-driven oracle-reviewer gate; if the gate finds Ch. 9
  does not adequately cover a specific Law statement, that statement falls back to no-oracle
  high-confidence core -- exactly the 17.1 gate-decides pattern. Trade-off logged; MEDIUM-HIGH impact,
  HIGH confidence (source owned + contains the Three Laws + LAW-02 already owned + reversible at the
  gate) -> auto-locked, gate-confirmed.

  | Option | Pros | Cons |
  |---|---|---|
  | Owned; oracle-verified vs Clean Code Ch. 9 (chosen, gate-confirmed) | Ch. 9 is owned + literally opens with the Three Laws; LAW-02 already an owned row; honest per 17.1 D-05; consistent tiering | Requires the orchestrator oracle-reviewer gate on the spine surface (executor cannot spawn it -- see D-09) |
  | No-oracle high-confidence core | No gate needed; Three Laws are well-known | Under-claims: leaves a verifiable owned source ungated; inconsistent with the already-owned "only enough to fail" row |

### Stance-routing step & override phrase (RTR-02)

- **D-06:** The routing step (SKILL.md) always detects and matches the house test idiom first, then
  routes by structural control / seam availability to the right stance via the
  `testing-stance/README.md` route table (open the leaf to act; the index is navigation-only), and
  STATES the route chosen and why. Confidence HIGH (ROADMAP SC2 verbatim; the route table content is
  Phase-17-complete -- Phase 18 only wires it).
- **D-07:** The optional override is a NATURAL-LANGUAGE phrase, NOT a CLI flag (ROADMAP SC2, "no CLI
  flag"). If the developer states a stance preference in plain language (e.g. "test this as a
  functional core", "use the message-matrix stance", "characterize it"), honor that over the
  auto-route and still state the route chosen. This mirrors lz-tpp / lz-refactor's no-flag,
  question-vs-command routing -- no rigid syntax invented. LOW-MEDIUM impact, HIGH confidence ->
  auto-locked.

### Fail-for-the-right-reason (LAW-02)

- **D-08:** The fail-for-the-right-reason step precedes the forward lz-tpp handoff: watch the red bar,
  confirm the test fails on the ASSERTED BEHAVIOR (an `AssertionError`), not on a compile / import /
  setup error or a false green, with F.I.R.S.T. as the test-quality baseline (the F.I.R.S.T. content
  is already owned in `test-structure-and-assertions.md` -- the procedure points at it). The
  Vitest-mechanic "how you read the red bar" is already in `vitest-typescript-mechanics.md`; Phase 18
  ties it to this procedure step. The coach QUESTIONS (explains which failure is the right one and
  why) rather than driving -- it does not run the suite unprompted.

### lz-tpp reverse-pointer seam (SEAM-02) -- edits a SHIPPED skill

- **D-09:** Add BOTH reverse pointers to `plugins/lz-tdd/skills/lz-tpp/SKILL.md` in ONE edit: the
  `lz-tpp -> lz-red` pointer (closes the carried reverse-pointer tech-debt) AND the deferred
  `lz-tpp -> lz-refactor` pointer (ROADMAP SC4 requires both in the same edit). Shape: a short
  red-green-refactor-seam pointer section naming lz-red (the red step -- choosing/writing the next
  failing test) and lz-refactor (the refactor step -- restructuring passing code), mirroring the
  "vs the green step" sections lz-red and lz-refactor already carry. lz-tpp currently has NO
  cross-skill pointer section, so this is additive. Exact placement/phrasing = executor discretion,
  gated by review. HIGH impact (edits a live shipped skill), HIGH confidence (locked by SC4;
  symmetric with the existing sibling sections) -> auto-locked.
- **D-10:** The lz-tpp edit is subagent-reviewed with >= 1 UNBIASED from-scratch reviewer BEFORE
  acceptance (ROADMAP SC4 + the standing rule that every SKILL.md/agent-instruction change is
  subagent-reviewed). Because gsd-executor has no Agent/Task tool, the review is an ORCHESTRATOR gate
  run AFTER the executor returns its blind edit -- plan it as "orchestrator gates after executor
  returns," never "executor spawns the reviewer." Making the edit LIVE requires a human
  `/reload-plugins`, deferred to ship (Phase 19) and noted, not done here.

### VIT-02 SKILL.md worked example

- **D-11:** The coach procedure carries ONE compact tsc-strict Vitest worked example that walks the
  RED path end to end (classify -> pick the degenerate case -> structure AAA -> assert observable
  behavior -> confirm it fails for the right reason -> hand off to lz-tpp). This closes the VIT-02
  "throughout SKILL.md" clause that Phase 17 explicitly deferred here (17-CONTEXT D-10). The example
  is covered by the tsc extractor + a SKILL.md ts-fence guard (D-13). Exact example = executor
  discretion within tsc --strict.

### Clean-room, instrument-first & co-edit boundary (mirrors Phase 16/17 D-13/D-14/D-15)

- **D-12:** Clean-room DST-04 -- the owned Three Laws surface (Clean Code Ch. 9) is distilled
  own-words BLIND and gated by the orchestrator-driven oracle-reviewer (converge-to-clean, 3-round
  cap); all other Phase-18 prose (the SKILL.md orchestration, the routing/seam framing, the lz-tpp
  pointer) is authored blind as orchestration and passes the deterministic no-verbatim scan only.
  Main context NEVER reads `.oracle/` prose.
- **D-13:** Instrument-first -- extend the existing dev-only `check-red-references.mjs` in place (no
  sibling; D-13 precedent): flip the four Phase-18 deferral guards
  (`three-laws-and-test-selection.md`, `test-structure-and-assertions.md`,
  `vitest-typescript-mechanics.md`, `principle-backing.md`) from "later-phase marker remains" into
  positive content assertions, add the SKILL.md coach-procedure content tokens (classify-first,
  Three Laws / LAW spine, stance-routing/override, fail-for-the-right-reason, forward handoff) + a
  SKILL.md ts-fence assertion (VIT-02), and add a guard asserting the lz-tpp reverse pointer is
  present. The Phase-17.1 D-05 provenance-honesty gate stays intact. Whether the checker gains a
  SKILL.md FILES entry vs a separate SKILL.md block, and whether Phase 18 opens with a fresh Wave-0
  RED baseline, is the planner's call; the tsc gate + no-verbatim scan are non-negotiable. NO build
  dep enters `plugins/lz-tdd`.
- **D-14:** Co-edit, do not split -- Phase 18 fills only its LAW / RTR-02 / SEAM slices + the VIT-02
  SKILL.md example, leaving the Phase-16/17 content (SEL/STR/ASRT/NAME/RTR-01/RTR-03/VIT/ANTI) intact.
  After Phase 18, no Phase-18 deferral markers should remain in the four co-edited stubs -- they are
  now filled, so their deferral guards convert to content guards (D-13).

### Claude's Discretion

- Exact own-words wording of the Three Laws spine (executor drafts blind; oracle-reviewer gates the
  owned surface only), the routing/override phrasing, and the classify-first / handoff prose.
- Exact minimal tsc-strict Vitest worked example in SKILL.md (within D-11 + tsc --strict).
- Exact placement + phrasing of the lz-tpp reverse-pointer section (D-09), subject to the D-10
  review gate.
- Plan / wave breakdown (planner's call): e.g. instrument extension -> owned Three-Laws surface
  (oracle-gated) -> SKILL.md procedure + example -> lz-tpp seam edit (review-gated) -> finalize gate.
- Whether the checker adds a SKILL.md FILES entry or a separate SKILL.md check block (D-13).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents (researcher, planner, executor) MUST read these before planning or
implementing.**

### Oracle sources (git-ignored; oracle / oracle-reviewer agents ONLY -- main context must NOT read the prose)
- `.oracle/clean-code/index.md` -- Robert C. Martin, *Clean Code* navigation index (OWNED). Ch. 9
  (Unit Tests) is the Three Laws spine source (LAW-01, LAW-02) and already backs the owned
  "only-enough-to-fail" + F.I.R.S.T. rows. The only owned surface Phase 18 introduces; gated by the
  orchestrator-driven oracle-reviewer.

### The SKILL.md and references Phase 18 edits (the coach spine + co-edited slices)
- `plugins/lz-tdd/skills/lz-red/SKILL.md` -- the router; Phase 18 OWNS its body: replace the "Coach
  decision procedure (deferred to Phase 18)" placeholder with the numbered procedure + the VIT-02
  worked example.
- `plugins/lz-tdd/skills/lz-red/references/three-laws-and-test-selection.md` -- fill the "## The
  Three Laws spine and classify-first (Phase 18)" insertion point (LAW-01/02, SEAM-01). SEL slice
  intact.
- `plugins/lz-tdd/skills/lz-red/references/test-structure-and-assertions.md` -- fill the Phase-18
  F.I.R.S.T.-baseline marker (LAW-02 leans on the existing owned F.I.R.S.T. row). STR/ASRT intact.
- `plugins/lz-tdd/skills/lz-red/references/vitest-typescript-mechanics.md` -- fill the Phase-18
  LAW-02 spine marker (tie the existing "fails for the right reason" mechanic to the procedure step).
- `plugins/lz-tdd/skills/lz-red/references/testing-stance/README.md` -- the route table the SKILL.md
  routing step (RTR-02) wires into (content is Phase-17-complete; navigation-only).
- `plugins/lz-tdd/skills/lz-red/references/principle-backing.md` -- fill the "## Three-Laws spine and
  lz-tpp seam backing (Phase 18)" marker with the LAW/SEAM rows + access tiers.

### The SHIPPED skill Phase 18 edits (SEAM-02)
- `plugins/lz-tdd/skills/lz-tpp/SKILL.md` -- add the reverse `lz-tpp -> lz-red` + deferred
  `lz-tpp -> lz-refactor` pointers in ONE edit. Currently has no cross-skill pointer section. Review-
  gated (D-10).
- `plugins/lz-tdd/skills/lz-refactor/SKILL.md` -- the sibling whose "vs the green step (the lz-tpp
  seam)" section is the shape model for the lz-tpp pointer; read for symmetry, do NOT edit.

### The dev-only instrument (extend in place; git-ignored workspace)
- `.claude/skills/lz-red-workspace/tools/check-red-references.mjs` -- the content gate; carries the
  four Phase-18 deferral guards to flip + the Phase-17.1 D-05 honesty gate to preserve. Extend in
  place (D-13).
- `.claude/skills/lz-red-workspace/tools/lib/provenance-honesty.mjs` -- the D-05 honesty-gate helper
  the checker imports.
- `.claude/skills/lz-red-workspace/package.json` -- pins typescript 6.0.3 + vitest 4.1.10; the tsc
  extractor covering every fence (must cover the new SKILL.md fence).
- `.claude/skills/lz-refactor-workspace/tools/check-hygiene.mjs` -- ASCII / work-email / no-verbatim
  scan over both skill trees (already scans lz-red + lz-tpp); the no-verbatim backstop for Phase 18.

### Requirements, roadmap, project decisions
- `.planning/REQUIREMENTS.md` -- LAW-01, LAW-02, RTR-02, SEAM-01, SEAM-02 (Phase 18) + the VIT-02
  SKILL.md clause + the Out-of-Scope table (coach-don't-drive, no imposed testing school, GOOS
  counterpoint-only, DHH hard-ban, no build deps in `plugins/`).
- `.planning/ROADMAP.md` -- Phase 18 Goal + the 4 Success Criteria (the coach-procedure step spec) +
  the phase split (DST -> 19; EVL -> 20).
- `.planning/PROJECT.md` -- Key Decisions: the clean-room `.oracle/` model, the red-green-refactor
  three-skill seam, the owned-source model, the DHH hard-ban.

### Prior-phase context, precedent, and coach-procedure model
- `.planning/phases/17-assertion-design-stance-router-ts-vitest-mechanics/17-CONTEXT.md` -- D-10
  (VIT-02 SKILL.md clause deferred to Phase 18), D-13/14/15 (instrument-first, no-verbatim gate,
  co-edit boundary), and the Phase-18 deferred-ideas list this phase now executes.
- `.planning/phases/17.1-perform-phase-16-beck-follow-up/17.1-CONTEXT.md` -- the D-05 honesty gate
  (owned only when gateable against full text) + the orchestrator-driven oracle-reviewer loop
  (D-06/D-07) Phase 18 reuses for the Three Laws spine.
- `plugins/lz-tdd/skills/lz-refactor/SKILL.md` -- the shipped 6-step inline coach decision procedure
  (Phase 9): the exact model for Phase 18's procedure shape (classify-first, numbered steps,
  file-level cross-links, "coach by default; drive when asked").
- `plugins/lz-tdd/skills/lz-tpp/SKILL.md` -- the shipped 7-step inline coach procedure: the sibling
  model + the SEAM-02 edit target.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **lz-refactor SKILL.md coach procedure (Phase 9):** a shipped, reviewed 6-step inline numbered
  decision procedure with classify-against-the-seam first, file-level cross-links, and a "coach by
  default; drive when asked" closing paragraph. Phase 18's lz-red procedure is the same shape applied
  to the RED step. lz-tpp's 7-step procedure is a second precedent.
- **The Phase-16/17 references are already authored and Phase-18-ready:** each co-edited stub carries
  an explicit "(Phase 18)" insertion-point section (three-laws spine, F.I.R.S.T. baseline, LAW-02
  mechanic, Three-Laws/seam backing) -- unambiguous fill targets, not blank pages.
- **`check-red-references.mjs`** already carries the four Phase-18 deferral guards + the D-05 honesty
  gate -> extend in place (flip guards to content assertions) rather than standing up a new gate.
- **The oracle / oracle-reviewer clean-room loop** (0.0.2 + Phase 16/17/17.1): the exact model for
  the one owned Three-Laws surface.
- **lz-red + lz-refactor "vs the green step" sections** are the shape model for the lz-tpp reverse
  pointer (SEAM-02) -- the seam sentence already exists in two of the three skills.

### Established Patterns
- **SKILL.md = orchestration; references = content.** The coach procedure links to the leaves and
  never restates them (lz-refactor / lz-tpp precedent). The owned distilled content lives in the
  reference leaf; the SKILL.md carries the compact spine + routing.
- **Clean-room DST-04:** main context never reads `.oracle/`; owned = orchestrator oracle-reviewer
  gated; unowned/orchestration = no-oracle + no-verbatim scan only. D-05 honesty gate: owned only
  when gateable against full text.
- **Instrument-first (Nyquist):** the RED guard is asserted before content lands; content turns it
  GREEN. Phase 18 flips the four deferral guards into content guards.
- **gsd-executor cannot spawn agents** -> every review/oracle gate (the Three-Laws oracle-reviewer,
  the lz-tpp-edit subagent review incl. >= 1 unbiased) is an ORCHESTRATOR step AFTER the executor's
  blind edits return. Plan tasks must say "orchestrator gates after executor returns."
- **Co-edit, do not split:** fill only the Phase-18 slices; the Phase-16/17 content is a regression
  floor (kept intact + still asserted by the checker).

### Integration Points
- The SKILL.md coach procedure links FORWARD to lz-tpp (Law 3 / SEAM-01 handoff) and sideways to
  lz-refactor (classify-first), and DOWN into the Phase-16/17 references (test selection, structure,
  assertions, the stance route table). The lz-tpp reverse pointer (SEAM-02) closes the loop so all
  three skills point at each other -- the red-green-refactor seam is fully wired after this phase.
- Editing the shipped lz-tpp SKILL.md is a live-skill change: reviewed before acceptance (D-10),
  made live by a human `/reload-plugins` at ship time (Phase 19).

</code_context>

<specifics>
## Specific Ideas

- The Three Laws mapping is lz-red-specific: Law 1 gates ENTRY (no production code before a failing
  test), Law 2 sizes the TEST (only enough to fail -- a not-yet-defined symbol / non-compiling code
  counts as the failure), Law 3 is the HANDOFF (making it pass is lz-tpp's job, not lz-red's). Law 3
  as "the lz-tpp handoff" is the orchestration reframe; the Laws themselves are RCM-owned.
- "Fails for the right reason" means an `AssertionError` on the asserted behavior -- NOT a compile /
  import / fixture error and NOT a false green (a test that passes immediately). The anti-patterns
  leaf already names "passes immediately / no red"; the procedure ties it to LAW-02.
- The override is natural-language only ("test this as a functional core" / "characterize it"), no
  invented flag syntax -- and the coach still states the route it took.
- Both lz-tpp reverse pointers ship in ONE edit (SC4 requires it): `-> lz-red` (red step) and the
  deferred `-> lz-refactor` (refactor step).
- The coach questions rather than drives: it explains WHICH failure is the right one and hands off;
  it never edits the developer's test or runs the suite unprompted (coach-don't-drive, mirrors
  lz-tpp / lz-refactor).

</specifics>

<deferred>
## Deferred Ideas

- plugin.json 0.0.3 bump + README + CHANGELOG + first-party validators + the ASCII/no-verbatim/email
  hygiene sweep across the three-skill tree (DST-01/02/03) -> Phase 19. Making the Phase-18 shipped-
  skill edits LIVE (`/reload-plugins`) is a human action at that ship.
- Trigger eval (incl. the three-way cross-skill boundary) + RED-behavior eval vs baseline + any
  description tuning (EVL-01/02) -> Phase 20.
- Type-level RED leaf (`expectTypeOf`/`assertType` + `vitest --typecheck` + `*.test-d.ts`) -> ADV-01
  (Future Requirements, post-0.0.3).
- Property-based RED leaf (`fast-check`, express-the-invariant + shrink) -> ADV-02 (Future
  Requirements, post-0.0.3).
- lz-refactor "Metz layer" enrichment (FUT-METZ-REFACTOR) -> a post-0.0.3 lz-refactor milestone.

All of the above are the ROADMAP's own later phases or explicit Future Requirements (recorded so the
planner does not pull them into Phase 18), not scope creep from discussion.

None -- autonomous single pass stayed within phase scope; no user-raised out-of-scope ideas.

</deferred>

---

*Phase: 18-coach-procedure-lz-tpp-seam-wiring*
*Context gathered: 2026-07-20*
