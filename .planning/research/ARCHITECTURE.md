# Architecture Research

**Domain:** Claude Code agent skill (RED-phase TDD coach) inside the `lz-tdd` plugin, mirroring
its two shipped siblings lz-tpp (green) and lz-refactor (refactor).
**Researched:** 2026-07-18
**Confidence:** HIGH (both sibling skills read directly on disk; conventions are observed, not
inferred; unowned-book source facts are high-confidence core, not verbatim).

## Standard Architecture

lz-red is a third dual-mode agent skill under the existing `lz-tdd` plugin. It reuses the exact
progressive-disclosure shape both siblings ship: a lean `SKILL.md` router that auto-triggers as a
coach and answers on demand as a reference, plus a lazy-loaded `references/` tree the router points
into but never inlines. Nothing about the plugin/marketplace scaffold changes -- skills are
auto-discovered from the plugin root, so adding lz-red needs no manifest edits beyond a version
bump.

### System Overview

```
+---------------------------------------------------------------+
|  Claude Code runtime (>= 2.1.x): auto-discovers skills/,      |
|  namespaces as /lz-tdd:lz-red, triggers on `description`      |
+---------------------------------------------------------------+
|  plugins/lz-tdd/  (plugin.json: name + version, MIT)          |
|   +--------------+   +--------------+   +------------------+   |
|   | lz-tpp       |   | lz-refactor  |   | lz-red (NEW)     |   |
|   | GREEN step   |   | REFACTOR step|   | RED step         |   |
|   +------+-------+   +------+-------+   +--------+---------+   |
|          ^                                       |             |
|          | Three Laws 1/2 -> Law 3 handoff       |             |
|          +---------------------------------------+             |
+---------------------------------------------------------------+
|  lz-red/SKILL.md  (lean router, target ~80-140 lines < 500)   |
|   - frontmatter: name + description (dual-mode by omission)    |
|   - Two modes (coach / reference)                             |
|   - RED vs green seam (lz-tpp)                                |
|   - numbered Coach decision procedure (incl. stance router)   |
|   - "listen to the tests" meta-rule + heuristic caveat        |
|   - Reference material pointers                              |
+---------------------------------------------------------------+
|  lz-red/references/  (lazy-loaded; loaded only when routed)   |
|   flat docs  + one small navigation subdir (testing-stance/)  |
+---------------------------------------------------------------+
|  .claude/skills/lz-red-workspace/  (NOT shipped; gitignored   |
|   run byproducts) -- vendored skill-creator eval harness      |
+---------------------------------------------------------------+
|  .oracle/  (git-ignored clean-room; oracle agents only)       |
|   owned books: RCM Clean Code, Metz 99 Bottles JS Ed          |
+---------------------------------------------------------------+
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| `SKILL.md` | Router + coach: triggering `description`, mode split, inline numbered decision procedure, stance-router detection, seam handoff, reference pointers | Frontmatter (name + description only) + Markdown body; near lz-tpp size (81 lines), well under 500 |
| `references/*.md` (flat) | Deep, single-topic docs loaded on demand (test selection, structure/assertions, naming, anti-patterns, Vitest/TS mechanics, principle backing) | Standalone Markdown with own-words prose + tsc-clean TS/Vitest examples (lz-tpp `references/` pattern) |
| `references/testing-stance/` (subdir) | The adaptive router destinations behind a navigation index | `README.md` index (recognize-by cues + links) + one leaf per stance (Bernhardt / Metz / Feathers) -- the lz-refactor catalog-subdir pattern at small grain |
| `.claude/skills/lz-red-workspace/` | Eval record + vendored harness; never shipped | evals/*.json + tools/skill-creator-eval (Apache-2.0) + grading `.mjs`, copied from a sibling workspace |
| `.oracle/` | Clean-room copyrighted source; own-words only crosses back | Markdown book excerpts read solely by oracle/oracle-reviewer agents (DST-04) |

## Recommended Project Structure

```
plugins/lz-tdd/skills/lz-red/
+-- SKILL.md                              # NEW lean router (target ~80-140 lines)
+-- references/
    +-- three-laws-and-test-selection.md  # RCM Three Laws spine + Beck test tactics + seam
    +-- test-structure-and-assertions.md  # AAA/GWT, assert-first, evident data, one concept, F.I.R.S.T., Khorikov pillars
    +-- testing-stance/                   # the ADAPTIVE router (navigation index + leaves)
    |   +-- README.md                     # detection signals + route table (navigation only)
    |   +-- functional-core.md            # Bernhardt FCIS: value-based tests, no doubles
    |   +-- message-matrix.md             # Metz+Owen query/command matrix (design-agnostic)
    |   +-- seams-and-legacy.md           # Feathers no-seam legacy: seam first + characterization
    +-- naming.md                         # behavior-shaped naming (North, Osherove, Metz)
    +-- anti-patterns.md                  # over-mock / test-per-class (Ian Cooper), impl-detail
    |                                     #   assertions (Khorikov), GOOS mockist counterpoint
    +-- vitest-typescript-mechanics.md    # it.todo test list, test.each triangulation,
    |                                     #   expectTypeOf/assertType, vi.* restraint, watch loop,
    |                                     #   fast-check property triangulation, "fail for the right reason"
    +-- principle-backing.md              # source-to-recommendation map + owned/unowned tier notes
```

### Structure Rationale

- **Flat docs, not a big catalog:** unlike lz-refactor (62 + 27 + 23 + 19 catalog leaves behind
  index stubs), lz-red has no large enumerable catalog. Its knowledge is a small set of principles
  and one router. So the right grain is lz-tpp's -- a handful of flat single-topic docs -- not a
  many-leaf catalog. Do NOT over-decompose; a doc per source author would be catalog cosplay.
- **One navigation subdir (`testing-stance/`):** the adaptive router is the skill's novel core and
  the only part with a real branch. Splitting it into a navigation `README.md` (detection signals +
  route table) plus three separately loadable leaves mirrors lz-refactor's proven index-is-navigation
  -only, leaf-carries-content convention, and keeps the router logic in SKILL.md thin (route by
  signal, open the matching leaf). Three destinations justify the subdir; a fourth would too.
- **`test-selection` and `structure/assertions` split:** picking WHICH test (test list, one-step,
  starter/degenerate, triangulation) and structuring THAT test (AAA/GWT, assert-first, evident data,
  F.I.R.S.T.) are two decision-procedure steps with distinct source clusters; keeping them separate
  lets the coach load only the one the current question needs.
- **`principle-backing.md` single doc, not per-book files:** lz-refactor shipped separate
  `beck-*.md` backing docs, but lz-red's unowned sources (Beck, Khorikov, Feathers, Cooper, North,
  Osherove, GOOS, fast-check) are used as a cross-reference map, not full catalogs. One backing doc
  that maps each recommendation to its source and marks the owned/unowned access tier is leaner and
  matches the no-oracle high-confidence-core posture.

## Architectural Patterns

### Pattern 1: Dual-mode-by-omission frontmatter

**What:** The skill declares only `name` (== directory name) and a `description`. Omitting
`disable-model-invocation` and `user-invocable` leaves both defaults, so the skill BOTH
auto-triggers as a coach and answers explicit `/lz-tdd:lz-red` invocations as a reference. Both
siblings do exactly this.
**When to use:** Always here -- lz-red must auto-fire mid-TDD (coach) and be directly askable
(reference).
**Trade-offs:** The `description` carries the entire triggering burden. It must be scoped tightly
enough to fire on RED-phase / next-failing-test / testing-stance prompts and stay quiet on
green-step and refactor near-misses. Budget: the load-bearing window is ~1000-1536 chars
(truncation at 1536); lz-refactor's is 774. Reserve the tail for the two exclusion clauses.

**Example:**
```yaml
---
name: lz-red
description: >-
  This skill should be used during red-green-refactor TDD to choose and write the next
  FAILING (red) unit test well ... adaptively matching the codebase's testing stance ...
  Do NOT use it to make a failing test pass (that is the green/transformation step -- use
  lz-tpp) nor to restructure passing code (that is the refactor step -- use lz-refactor).
---
```

### Pattern 2: Inline numbered coach decision procedure

**What:** The coach logic lives as a numbered list in SKILL.md (lz-tpp: 7 steps; lz-refactor: 6).
It is concrete and self-contained -- it names the move, states the seam classification first, and
routes to a `references/` doc only for depth. lz-red's procedure is the RED spine plus the stance
router folded in as one step.
**When to use:** Always -- the procedure IS the skill; it must not be buried in references.
**Trade-offs:** Adds lines to SKILL.md; keep each step one to three sentences and push examples to
references to hold the line count near lz-tpp.

**Proposed lz-red coach procedure (7-8 steps, mirroring lz-tpp shape):**

1. **Classify against the seams.** Are we adding a NEW failing test? That is RED (this skill). If a
   red test already exists and the question is the minimal code to green it, that is the green step
   -- hand off to lz-tpp and stop. If the tests are green and the code needs restructuring, that is
   lz-refactor. RED = selecting and writing the next failing test.
2. **Detect the house idiom** (router step A -- see Detection Signals below). Read existing test
   files and framework config; adopt their structure, assertion style, naming, and doubles
   convention. Never impose a foreign idiom on a codebase that has one.
3. **Pick the next test.** Consult / build the test list (`it.todo`). Prefer a one-step test
   passable by a high-priority transformation (this is the reciprocal of lz-tpp's amended
   red-green-refactor). If nothing exists yet, start with a degenerate / starter test. Use
   triangulation (`test.each`, or a fast-check property) to force generalization rather than a
   fake-it constant surviving.
4. **Choose the testing stance** (router step B). Classify the unit under test: a pure functional
   core -> Bernhardt value-based tests, no doubles (`testing-stance/functional-core.md`); an object
   with collaborators -> Metz query/command matrix -- assert the return of an incoming query, the
   public side effect of an incoming command, ignore sent-to-self and outgoing queries, expect only
   outgoing commands (`testing-stance/message-matrix.md`); a no-seam legacy unit (hidden I/O,
   statics, constructor work, singletons) -> Feathers: introduce a seam and pin behavior with a
   characterization test first (`testing-stance/seams-and-legacy.md`). Honor an optional override
   phrase; there is no CLI flag.
5. **Structure the test.** AAA or Given-When-Then matching the house idiom; assert-first; evident
   test data; ONE concept per test; keep it F.I.R.S.T. (Fast, Isolated, Repeatable,
   Self-validating, Timely).
6. **Assert observable behavior, not implementation.** Assert return values, public state, or
   observable outgoing messages -- never private fields, and never merely that a collaborator method
   was called (except a genuine outgoing command). Name the test for the behavior it pins (North's
   "should ...", Osherove's unit-of-work / scenario / expected).
7. **Fail for the right reason.** The test must fail with an assertion mismatch, not a compile /
   type / import error. A test that errors instead of failing is not a valid RED -- fix the harness
   first.
8. **Hand off to lz-tpp.** Once the test is red for the right reason, the next move -- the minimal
   code that makes it pass -- is the transformation step. Point to lz-tpp. Show, don't drive: on a
   question, present the test and the next step; on an explicit command, write the test but do not
   run production changes or commit unless asked.

### Pattern 3: Adaptive stance router driven by repo-readable detection signals

**What:** Rather than pick one testing school, the coach reads the actual codebase and routes. This
is the skill's differentiator and the LOCKED design decision. The router has two detection passes
(house idiom, then unit shape / seam availability) feeding one route table.
**When to use:** Every coach invocation with a real codebase in view.
**Trade-offs:** Detection is heuristic -- if signals conflict or the repo is greenfield, fall back
to the house idiom (if any) then to the functional-core default, and say so.

**Detection signals (must be actionable -- a coach reading the repo applies these directly):**

| Question | Signals to read | Route implication |
|----------|-----------------|-------------------|
| What is the house test idiom? | `*.test.ts` / `*.spec.ts` / `__tests__/`; `vitest.config.*` / `jest.config.*`; package.json `test` script + devDeps; assertion style (`expect().toBe` vs `assert`); `describe`/`it` vs `test`; naming pattern of existing test titles; doubles lib in use (`vi.mock`, `jest.mock`, sinon); AAA vs GWT comment style | Adopt it verbatim in step 2/5. No existing tests -> pick the Vitest + `expect` default and note the choice. |
| Does the unit already exist and is it controllable? | Is the target function/class exported? Can it be constructed in a test without heavy setup (pure vs needs dependency injection)? | Exists + pure -> functional-core route. Exists + needs collaborators -> message-matrix route. Does not exist yet -> starter/degenerate test drives it into existence (step 3). |
| Is a seam available, or is this no-seam legacy? | Scan the unit for hidden I/O (`fs`, `fetch`/network, `Date.now`, `Math.random`, env, DB), module-level singletons/statics, real work in the constructor, `new ConcreteCollaborator()` inline | Present -> Feathers route: introduce a seam (parameterize/inject/extract) + characterization test BEFORE the new failing test. Absent -> test directly. |

**Example (route table the SKILL.md step 4 encodes, detail in the leaves):**
```
pure value-in/value-out .......... Bernhardt FCIS  -> functional-core.md   (assert the value; no doubles)
object with collaborators ........ Metz matrix     -> message-matrix.md    (assert by message type)
hidden I/O / statics / ctor work . Feathers        -> seams-and-legacy.md  (seam + characterization first)
```

## Data Flow

### Invocation and progressive-disclosure load flow

```
Developer prompt (mid-TDD, or explicit /lz-tdd:lz-red)
    |
    v
description match -> Claude loads lz-red/SKILL.md (router only)
    |
    +-- coach mode: run numbered procedure
    |       step 1 classify -> (green? -> lz-tpp) (refactor? -> lz-refactor)
    |       step 2 detect house idiom (read repo)
    |       step 3 pick next test (test list / triangulation)
    |       step 4 stance route -> OPEN testing-stance/<leaf>.md on demand
    |       step 5-7 structure / assert behavior / fail-right (open a ref doc if depth needed)
    |       step 8 hand off to lz-tpp
    |
    +-- reference mode: route the question to the one references/ doc and answer from it
```

### Seam data flow (the lz-tpp handoff)

```
lz-red   : Three Laws 1 (write a failing test first) + 2 (only enough test to fail)
              |  RED test that fails for the right reason
              v
lz-tpp   : Three Laws 3 (only enough production code to pass) -- the transformation step
              |  GREEN
              v
lz-refactor : structure-only, behavior-preserving cleanup -- the refactor step
              |  loops back to lz-red for the next test
```

### Key Data Flows

1. **House-idiom detection:** the coach reads existing test files + config, then mirrors that idiom
   in every test it proposes -- the single always-on router pass.
2. **Stance routing:** unit-shape/seam signals select exactly one `testing-stance/` leaf; only that
   leaf is loaded (progressive disclosure keeps the base context lean).
3. **Seam handoff:** classification in step 1 and the explicit step-8 pointer route behavior changes
   to lz-tpp and structure changes to lz-refactor, so lz-red never leaves its lane.

## Scaling Considerations

Here "scale" is context budget and authoring surface, not users.

| Scale | Architecture adjustments |
|-------|--------------------------|
| v1 (this milestone) | ~6-7 flat refs + one 4-file stance subdir; SKILL.md near lz-tpp size. Fits the base context comfortably. |
| If the stance router grows | Add leaves under `testing-stance/`; the navigation README absorbs new routes without touching SKILL.md logic. |
| If outside-in / acceptance TDD lands (deferred) | New sibling skill or a new reference cluster; keep unit RED and outside-in separate so neither router bloats. Do NOT pre-build it -- it is explicitly out of scope for 0.0.3. |

### Scaling Priorities

1. **First thing that breaks: SKILL.md line count.** Fold the stance router into ONE numbered step
   with the route table; push per-stance depth to leaves. Watch the < 500 hard cap; target ~80-140.
2. **Second: description triggering.** If evals show green-step or refactor prompts stealing the
   trigger, tighten the two exclusion clauses before adding positive phrasing.

## Anti-Patterns

### Anti-Pattern 1: Over-decomposing references into a per-source catalog

**What people do:** One reference file per author (beck.md, metz.md, feathers.md, khorikov.md, ...).
**Why it is wrong:** lz-red has no enumerable catalog; a file per book fragments a single decision
procedure across a dozen thin docs and mismatches the lz-tpp grain the skill should follow.
**Do this instead:** Cluster by decision-procedure step (selection, structure, stance, naming,
anti-patterns, mechanics, backing). Sources are cited inside the doc, not promoted to their own file.

### Anti-Pattern 2: Restating reference content in SKILL.md

**What people do:** Inline the transformation list / route detail / the whole matrix in the router.
**Why it is wrong:** Breaks progressive disclosure and blows the line budget; both siblings
explicitly say "do not restate the list/content here."
**Do this instead:** SKILL.md names the move and links; the leaf carries the content. Index docs are
navigation-only (recognize-by cue + link), exactly as `smells.md` is.

### Anti-Pattern 3: Baking one testing school into the coach

**What people do:** Always mock collaborators (London/mockist), or always demand a pure functional
core.
**Why it is wrong:** Brownfield code cannot assume a functional core; blanket mocking is the
over-mock / test-per-class trap Ian Cooper warns against and couples tests to implementation.
**Do this instead:** Detect and route (Pattern 3). Keep GOOS's mockist view as a cited counterpoint
in `anti-patterns.md`, not the default. Let "listen to the tests" be the meta-rule: test pain
signals design pain, not a mandate to mock.

### Anti-Pattern 4: Committing verbatim book/talk prose

**What people do:** Paste RCM / Metz / talk transcripts into a reference to be "faithful."
**Why it is wrong:** Public-repo copyright hygiene (DST-04); recorded talks are all-rights-reserved.
**Do this instead:** Owned books (RCM Clean Code, Metz 99 Bottles JS Ed) go in git-ignored
`.oracle/`, read only by oracle/oracle-reviewer agents; own-words synthesis crosses back. Unowned
sources are no-oracle high-confidence core. DHH is hard-banned as a source.

## Integration Points

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| lz-red <-> lz-tpp | Seam in `description` (exclusion clause) + body section + step-1 classify + step-8 handoff | NEW forward seam: Three Laws 1/2 -> Law 3. Add a REVERSE pointer in lz-tpp SKILL.md ("choosing/writing the next failing test is lz-red"). |
| lz-red <-> lz-refactor | `description` exclusion clause ("restructure passing code -> lz-refactor") + step-1 classify | No code change to lz-refactor needed; the carried-forward lz-tpp -> lz-refactor reverse pointer can be added in the same lz-tpp edit (tech debt from 0.0.2). |
| SKILL.md <-> references/ | Markdown relative links; loaded on demand | Router links, never inlines. Stance subdir README is navigation-only. |
| skill <-> eval harness | `.claude/skills/lz-red-workspace/` (not under `plugins/`, so never shipped) | Vendored skill-creator-eval + eval sets + grading scripts, copied from a sibling workspace. |
| authoring <-> `.oracle/` | oracle/oracle-reviewer agents only | Main context never reads book prose; own-words only. |

### Eval-harness reuse (vendored skill-creator rig)

Both siblings ship an identical, self-contained recipe -- copy it into a new
`.claude/skills/lz-red-workspace/`:

- `tools/skill-creator-eval/` -- copy verbatim from `lz-tpp-workspace` (Apache-2.0; upstream
  `run_eval.py` with the native-Windows `run_single_query` fix for the three trigger-probe bugs;
  runs `python -m scripts.run_eval` natively, no WSL). `LICENSE.upstream.txt` travels with it.
- `evals/trigger-eval.json` -- NEW: array of `{query, should_trigger}`. Positives = RED-phase /
  next-failing-test / testing-stance / triangulation prompts; negatives = green-step (lz-tpp),
  refactor (lz-refactor), debug-my-failing-test, and generic write-a-test-for-me near-misses.
  Measures recall + specificity (0.0.1/0.0.2 target: 100%/100%).
- `evals/evals.json` (and/or `evl02-scenarios.json`) -- NEW behavior eval: `{prompt, expected_output,
  expectations[]}` scoring RED-behavior accuracy vs baseline: names the right next test, routes to
  the correct stance, asserts behavior not implementation, fails for the right reason, hands off to
  lz-tpp, and coaches (does not drive).
- Grading scripts (`grade-run.mjs`, `merge-judge.mjs`, `eval-status.mjs`) -- copy from
  `lz-tpp-workspace`.
- Optional hygiene checker -- mirror lz-refactor's `tools/check-hygiene.mjs` (no verbatim prose) and
  run the email allowlist-inversion scan before commit.
- `.gitignore` -- MODIFY: add `lz-red-workspace` per-run capture globs (`**/results*/`, `**/run-*/`,
  `**/trigger-results-*.json`) alongside the lz-refactor-specific block; the generic
  `*-workspace/**` rules already cover pycache/outputs/samples/stream. Eval SETS and RESULTS stay
  tracked.

## New vs Modified Files

**NEW (shipped under `plugins/`):**
- `plugins/lz-tdd/skills/lz-red/SKILL.md`
- `plugins/lz-tdd/skills/lz-red/references/three-laws-and-test-selection.md`
- `.../references/test-structure-and-assertions.md`
- `.../references/testing-stance/README.md`
- `.../references/testing-stance/functional-core.md`
- `.../references/testing-stance/message-matrix.md`
- `.../references/testing-stance/seams-and-legacy.md`
- `.../references/naming.md`
- `.../references/anti-patterns.md`
- `.../references/vitest-typescript-mechanics.md`
- `.../references/principle-backing.md`

**NEW (dev-only, not shipped):**
- `.claude/skills/lz-red-workspace/**` -- eval sets + vendored harness + grading scripts (tracked
  record; run byproducts gitignored)
- `.oracle/` additions -- RCM Clean Code, Metz 99 Bottles JS Ed (git-ignored, build input only)

**MODIFIED:**
- `plugins/lz-tdd/skills/lz-tpp/SKILL.md` -- add reverse pointers to lz-red (and the deferred
  lz-refactor reverse pointer)
- `plugins/lz-tdd/.claude-plugin/plugin.json` -- version `0.0.2` -> `0.0.3`; extend `description`
  and `keywords` to mention the red step
- `README.md` -- document `/lz-tdd:lz-red`
- `CHANGELOG.md` -- 0.0.3 entry
- `.gitignore` -- lz-red-workspace per-run capture globs

**UNCHANGED:** `.claude-plugin/marketplace.json` (version deliberately omitted from the marketplace
entry; skills auto-discovered -- adding lz-red needs no marketplace edit).

## Suggested Phase / Build Order (with dependencies)

Mirrors the 0.0.2 rhythm (scaffold -> source -> content -> coach -> distribution -> evals) but
leaner, since there is no large catalog.

1. **Phase A -- Scaffold and progressive-disclosure skeleton.** Create `lz-red/`, SKILL.md router
   with dual-mode-by-omission frontmatter, reference stubs each carrying a per-doc content contract,
   plugin.json version bump. Gate: `claude plugin validate .` exits 0. *Depends on: nothing.*
2. **Phase B -- Oracle setup and source distillation.** Add owned books to `.oracle/`; fix the
   oracle-vs-no-oracle tiering per source; distill the RED-phase facts (Three Laws, F.I.R.S.T.,
   Beck tactics, Metz matrix, Bernhardt FCIS, Feathers seams, Khorikov pillars, Cooper, North,
   Osherove, GOOS counterpoint, fast-check) in own words. *Depends on: A (stubs to target); may
   partly parallel A.*
3. **Phase C -- Reference content authoring.** Fill the ~6-7 flat docs + the `testing-stance/`
   subdir with own-words prose and tsc --strict-clean TS/Vitest examples. *Depends on: B.*
4. **Phase D -- Coach procedure, stance router, and seam wiring.** Author the inline numbered
   procedure and detection signals in SKILL.md; wire the lz-tpp forward seam + the reverse pointers
   in lz-tpp SKILL.md. *Depends on: C (reference links must resolve).*
5. **Phase E -- Distribution and hygiene.** README + CHANGELOG, verified version bump,
   plugin-validator + skill-reviewer PASS, `validate --strict` exit 0, no-verbatim hygiene gate +
   email allowlist-inversion scan. *Depends on: D.*
6. **Phase F -- Skill-effectiveness evals.** Vendor the harness into `lz-red-workspace`; author
   trigger + behavior eval sets; run trigger recall/specificity and RED-behavior accuracy vs
   baseline; tune the `description` if needed. *Depends on: E (eval the shippable skill).*

Reasonable merges if the roadmap wants fewer phases: A+B (scaffold with oracle setup) and D into C
(author content and coach together). Keep E and F distinct -- distribution hygiene and empirical
evals are separate gates.

## Sources

- `plugins/lz-tdd/skills/lz-tpp/SKILL.md` (on disk, 81 lines) -- HIGH. Frontmatter convention, two-mode
  split, 7-step coach procedure shape, heuristic caveat, reference-material pointers, seam framing.
- `plugins/lz-tdd/skills/lz-refactor/SKILL.md` (on disk, 180 lines) -- HIGH. Router + references/
  decomposition, index-is-navigation-only + leaf-carries-content convention, inline coach procedure,
  description seam/near-miss pattern, whole-package sweep framing.
- `plugins/lz-tdd/skills/lz-{tpp,refactor}/references/**` (on disk) -- HIGH. Flat-doc vs
  index+subdir grain; `smells.md` navigation-only pattern; catalog-leaf structure.
- `.claude/skills/lz-tpp-workspace/**` + `lz-refactor-workspace/**` (on disk) -- HIGH. Vendored
  skill-creator-eval harness (Apache-2.0, native-Windows fix), eval-set JSON formats
  (trigger-eval.json, evals.json), grading `.mjs`, gitignore posture.
- `.planning/PROJECT.md` (Current Milestone lz-tdd@0.0.3 + Key Decisions) -- HIGH. Locked scope,
  adaptive-stance decision, source access model, seam tech debt, DHH ban.
- `plugins/lz-tdd/.claude-plugin/plugin.json` + root `.gitignore` -- HIGH. Version-bump surface;
  workspace/oracle ignore rules.
- Domain source facts (Beck, RCM Three Laws/F.I.R.S.T., Metz+Owen message matrix, Bernhardt FCIS,
  Khorikov four pillars, Feathers seams/characterization, Ian Cooper, North GWT, Osherove naming,
  GOOS mockist counterpoint, fast-check) -- HIGH as high-confidence core (own-words synthesis; no
  verbatim). To be verified against `.oracle/` clean-room for the owned titles during Phase B.

---
*Architecture research for: RED-phase TDD coach skill (lz-red) under the lz-tdd plugin*
*Researched: 2026-07-18*
