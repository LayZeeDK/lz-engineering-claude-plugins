# Phase 6: lz-refactor Skill Scaffold & Progressive Disclosure - Context

**Gathered:** 2026-07-04
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 6 delivers the SKELETON of the `lz-refactor` skill: an invocable,
auto-triggering `/lz-tdd:lz-refactor` router (lean `SKILL.md` with dual-mode
framing) plus a wired progressive-disclosure `references/` structure with
content-contract stubs -- ready to be filled by later phases. It satisfies
SKEL-01..04 only.

**In scope:** skill directory + `SKILL.md` at `plugins/lz-tdd/skills/lz-refactor/`;
dual-mode default frontmatter; a lean task-area-sectioned router; the five
`references/` task-area groups wired as one-level-deep pointers; catalogs
structured to be splittable; stub files carrying the per-entry content contract;
a `description` tuned (not yet empirically validated) for refactor-step triggers.

**Out of scope (belongs to later phases):** catalog CONTENT (66 Fowler / 27
Kerievsky entries, 24+ smells, Ch.2 principles -> Phases 7-8); the full coach
decision procedure and principle-backing prose (-> Phase 9); version bump,
README/CHANGELOG (-> Phase 10); evals (-> Phase 11). No authoritative oracle
book access is needed or performed in this phase.

</domain>

<decisions>
## Implementation Decisions

### Router Architecture
- **D-01:** `SKILL.md` is a HYBRID router -- lz-tpp's dual-mode framing (Coach
  mode + Reference mode, routed by intent) combined with angular-developer's
  task-area-sectioned pointer layout (one `##` section per reference group, each
  ending in a one-level-deep `[references/x.md](references/x.md)` pointer). Keep
  it lean (< 500 lines hard cap; target the lz-tpp scale, ~90-150 lines at
  scaffold).
- **D-02:** Frontmatter is MINIMAL, matching the in-repo lz-tpp convention:
  `name: lz-refactor` + `description` only. Omit `disable-model-invocation`
  (default false -> auto-triggers as coach), omit `user-invocable` (default
  true -> invocable as reference), omit `allowed-tools` (pure guidance skill),
  omit `version` (not in the skill frontmatter spec; versioned via
  `plugin.json`). No `license`/`metadata` block -- lz-tpp carries none; stay
  repo-consistent.

### references/ Structure
- **D-03:** Five task-area reference groups per SKEL-02, each reachable one level
  deep from `SKILL.md`: (1) Fowler catalog, (2) unified smell taxonomy,
  (3) Fowler Ch.2 principles, (4) Kerievsky pattern-directed catalog,
  (5) refactoring-without-tests (Feathers). Beck principle-backing (TDD by
  Example, Tidy First?) folds into the principles group or a sibling
  `principles-*` file -- final placement decided in Phase 9 planning.
- **D-04:** The two large catalogs are structured as SPLITTABLE from day one
  (Fowler as a subdir / multi-file group; Kerievsky likewise) so no single file
  forces the whole catalog into context (SKEL-04). The EXACT intra-catalog file
  split axis (Fowler by tag-group vs. book chapter; Kerievsky by direction vs.
  GoF family) is DEFERRED to Phase 7 / Phase 8 planning, where the owner's
  e-book oracle is consulted. Phase 6 guarantees the architecture supports the
  split; it does NOT freeze the axis.

### Scaffold Stub Strategy
- **D-05:** Each `references/` file is a STUB -- not empty, not fully populated:
  a heading, a one-line scope statement, a `Populated in Phase N` marker, and
  the per-entry content contract the later phase fills. Fowler entry contract:
  name / motivation / distilled mechanics (original words) / TS-JS before-after /
  provenance label. Kerievsky entry contract: name / intent / mechanics /
  TS-JS re-rendered from Java / composed Fowler primitive(s) /
  To-Towards-Away direction / GoF cross-ref. Stubs make `SKILL.md` pointers
  resolve (validate-clean) and document the contract WITHOUT fabricating oracle
  content.
- **D-06:** No catalog CONTENT and no detailed coach decision procedure are
  authored in Phase 6. `SKILL.md` carries only the dual-mode framing + a minimal
  routing skeleton + the reference pointers. Full coach behavior -> Phase 9.

### description / Trigger
- **D-07:** The `description` mirrors lz-tpp's proven dual-mode shape:
  "use it when [refactor step, a code smell is present, choosing the next NAMED
  refactoring] ... and to explain refactorings / smells / principles on demand
  ... Do NOT use it for [generic write-code, plain feature work, the green /
  transformation step]." Tuned for refactor-step / code-smell /
  refactoring-catalog / de-patterning triggers, within the description char cap.
  Empirical trigger tuning deferred to Phase 11 (EVL-01).
- **D-08:** The `description` explicitly disambiguates the lz-tpp seam (refactor
  step vs. green/transformation step) so the two sibling skills do not
  cross-trigger.

### Oracle-Access Thread-Forward (from the user's standing instruction)
- **D-09:** Phase 6 requires NO authoritative oracle book access -- it is
  scaffold-only. The owner's oracles -- Fowler *Refactoring* 2nd-ed e-book / web
  edition (ISBN 9780135425664), Kerievsky *Refactoring to Patterns*, and the GoF
  e-book -- are consulted in Phases 7-8. The scaffold MUST leave clean insertion
  points + the per-entry content contracts (D-05) so those phases drop in
  oracle-verified content. Per the user's standing instruction, Phase 7/8
  planning + execution MUST open an AskUserQuestion oracle-access checkpoint
  before authoring catalog content rather than fabricating it.

### Claude's Discretion
- Exact `SKILL.md` section ordering, stub wording, and individual file names
  within the agreed five-group structure.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Models & in-repo precedent
- `plugins/lz-tdd/skills/lz-tpp/SKILL.md` -- in-repo dual-mode skill precedent:
  frontmatter convention (name + description only), Coach/Reference framing, the
  `[references/x.md](references/x.md)` pointer idiom, the "do not use it for..."
  near-miss clause. COPY this shape.
- `plugins/lz-tdd/skills/lz-tpp/references/` (`transformations.md`,
  `fibonacci-worked-example.md`, `typescript-and-tco.md`) -- reference-file
  granularity + provenance-labeling precedent.
- `D:\projects\github\LayZeeDK\in-browser-ai-coding-agent\.claude\skills\angular-developer\SKILL.md`
  (+ its `references/`) -- EXTERNAL local clone; the task-area-sectioned router
  model named in the phase goal (one `##` section per area, each with a pointer
  and an optional "deeper docs" line). Absolute path, outside this repo; read-only.

### Phase scaffolds & research
- `.planning/research/refactoring-com-overview.md` -- Fowler 66-name + 1st-ed
  alias + tag-group orientation scaffold (Phase 7). Lists Fowler's 20 tag-groups
  = candidate split axes for D-04. ORIENTATION only; the owner e-book/web is the
  oracle.
- `.planning/research/ARCHITECTURE.md`, `.planning/research/FEATURES.md` --
  milestone architecture + feature research (skill shape, catalog inventory).

### Phase spec
- `.planning/ROADMAP.md` -> "Phase 6: lz-refactor Skill Scaffold & Progressive
  Disclosure" -- goal + the 4 success criteria this phase is graded on.
- `.planning/REQUIREMENTS.md` -> "Skill Structure & Progressive Disclosure"
  (SKEL-01, SKEL-02, SKEL-03, SKEL-04).
- `.planning/PROJECT.md` -- milestone brief, constraints (ASCII-only, MIT, public
  contact, no verbatim prose), and prior key decisions.

### Authoring guidance (available via the Skill tool -- no path needed)
- `skill-creator` skill -- description tuning + progressive-disclosure authoring.
- `plugin-dev:skill-development` and `plugin-dev:plugin-structure` skills --
  skill/plugin structure, frontmatter fields, auto-discovery.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **lz-tpp SKILL.md + references/**: reuse the frontmatter convention, dual-mode
  framing, and the Markdown pointer idiom verbatim in SHAPE (not content).
- **`plugins/lz-tdd/.claude-plugin/plugin.json`**: skills are auto-discovered;
  adding `skills/lz-refactor/` needs NO manifest edit (validated in Phase 1).
  The version bump to 0.0.2 is DST-01 (Phase 10), NOT Phase 6.

### Established Patterns
- Progressive disclosure: lean `SKILL.md` + bundled `references/` (lz-tpp ships
  an ~82-line SKILL.md + 3 reference files). Mirror this ratio.
- Public-repo hygiene applies from the first stub: ASCII-only, MIT, public
  contact only, and NO verbatim Fowler/Kerievsky/GoF prose or code (DST-04).

### Integration Points
- The `/lz-tdd:lz-refactor` command derives from the skill DIRECTORY name
  `lz-refactor`, namespaced by the `lz-tdd` plugin -- sibling to `/lz-tdd:lz-tpp`.
- lz-tpp seam: cross-reference it in the `description` (D-08) and in a short
  router note (green step = lz-tpp transformation; refactor step = lz-refactor).

</code_context>

<specifics>
## Specific Ideas

- "Modeled on the angular-developer skill (local clone)" (phase goal) -- the
  task-area-sectioned pointer router is the target router shape.
- User standing instruction for this milestone: "Use AskUserQuestion when you
  need authoritative oracle book access." Captured as D-09 -- it does not fire in
  Phase 6 (no oracle needed) but MUST fire in Phases 7-8 before any catalog
  content is authored.

</specifics>

<deferred>
## Deferred Ideas

- Full coach decision procedure -- smell -> named-refactoring routing
  (mechanical -> Fowler, structural -> Kerievsky), de-patterning balance,
  behavior-preservation discipline, Feathers no-tests fallback, and the lz-tpp
  seam detail -> Phase 9 (CCH-01..05, PRIN-01..03).
- Catalog CONTENT: 66 Fowler refactorings, 27 Kerievsky pattern-directed
  refactorings, the 24 Fowler + Kerievsky Ch.4 smells, and the Ch.2 principles
  -> Phases 7-8 (oracle-verified).
- The exact intra-catalog file split axis -> decided in Phase 7 / Phase 8
  planning, oracle-informed (D-04).
- Version bump to 0.0.2, README + CHANGELOG entries -> Phase 10 (DST-01, DST-03).
- Skill-effectiveness evals (trigger recall/specificity + behavior) -> Phase 11
  (EVL-01, EVL-02).

</deferred>

---

*Phase: 6-lz-refactor Skill Scaffold & Progressive Disclosure*
*Context gathered: 2026-07-04*
