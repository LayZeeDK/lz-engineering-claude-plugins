# Requirements: lz-engineering-claude-plugins

**Milestone:** lz-tdd@0.0.2 -- lz-refactor Skill (Fowler + Kerievsky)
**Defined:** 2026-07-04
**Core Value:** A single `/lz-tdd:lz-refactor` dual-mode coach + reference that picks
the right named refactoring during the red-green-refactor "refactor" step (and
explains it on demand) -- completing the TDD loop alongside `lz-tpp`.

## lz-tdd@0.0.2 Requirements

Requirements for this milestone. Each maps to exactly one roadmap phase.

### Skill Structure & Progressive Disclosure

- [ ] **SKEL-01**: User can invoke `/lz-tdd:lz-refactor`; the skill lives at `plugins/lz-tdd/skills/lz-refactor/SKILL.md` with dual-mode default frontmatter (auto-triggers as a coach AND is user-invocable as a reference)
- [ ] **SKEL-02**: The skill uses progressive disclosure -- a lean router `SKILL.md` that lazy-loads `references/` docs grouped by task area (Fowler catalog, smell taxonomy, principles, Kerievsky patterns, refactoring-without-tests), modeled on the `angular-developer` skill and the skill-creator / plugin-dev authoring guidelines; `SKILL.md` stays within the size budget (< 500 lines)
- [ ] **SKEL-03**: The `description` is tuned to trigger on refactor-step / code-smell / refactoring-catalog prompts and stay quiet on near-misses, within the description character cap, per skill-creator description guidance
- [ ] **SKEL-04**: Each `references/` doc is reachable from `SKILL.md` via a one-level-deep pointer, and heavy catalog material is bundled (not inlined), so no single file forces the whole catalog into context

### Fowler Catalog (Refactoring, 2nd ed)

- [ ] **FWL-01**: The reference covers all 66 Fowler refactorings -- each with name, motivation, distilled mechanics (original words), and an original TS/JS before/after example -- provenance-labeled (the 5 print-absent entries and Split Phase's online-only examples marked as such)
- [ ] **FWL-02**: A unified smell-taxonomy reference covers the 24 Fowler bad smells, each mapped to its candidate refactorings (the coach's trigger table)
- [ ] **FWL-03**: A principles reference distills Ch.2 (definition, the two hats, when-to-refactor: rule of three / preparatory / comprehension / litter-pickup, performance, YAGNI) in original words with correct attributions
- [ ] **FWL-04**: All Fowler TS/JS samples are `tsc --strict`-clean and behavior-preserving, verified against the owner's e-book/web oracle (refactoring.com for the 5 print-absent entries)

### Kerievsky Catalog (Refactoring to Patterns)

- [ ] **KRV-01**: The reference covers all 27 Kerievsky pattern-directed refactorings -- each with name, intent, distilled mechanics (original words), an original TS/JS example re-rendered from the book's Java, and the Fowler primitive(s) it composes
- [ ] **KRV-02**: The To / Towards / Away directions model is captured, with the "refactor AWAY from a pattern" (de-patterning) cases called out (Inline Singleton; Move Accumulation to Visitor away from Iterator; Encapsulate Composite with Builder away from Composite)
- [ ] **KRV-03**: Kerievsky's Ch.4 smells (including Conditional Complexity, Indecent Exposure, Solution Sprawl, Combinatorial Explosion, Oddball Solution) are folded into the unified smell taxonomy with source tags and deduplicated against Fowler's list
- [ ] **KRV-04**: Each Kerievsky refactoring cross-references its target GoF pattern (from the owner's GoF e-book) for vocabulary, without reproducing GoF text

### Coach Behavior

- [ ] **CCH-01**: For a detected or named smell during the refactor step, the coach recommends the next NAMED refactoring -- routing mechanical smells to Fowler refactorings and repeated/complex-structure smells to Kerievsky pattern-directed refactorings
- [ ] **CCH-02**: The coach applies the over-/under-engineering balance -- it recommends de-patterning (refactor away) when a pattern is unwarranted, not only adding structure
- [ ] **CCH-03**: The coach enforces behavior-preservation discipline (small steps, run tests after each) and, when tests are absent, routes to the Feathers "refactor safely without tests" guidance
- [ ] **CCH-04**: In reference mode, the coach answers on-demand catalog / smell / principle questions by routing to the correct `references/` doc
- [ ] **CCH-05**: The coach frames the red-green-refactor seam with `lz-tpp` (green step = TPP transformation; refactor step = lz-refactor), consistent with Beck's TDD cycle

### Principle-Backing Cross-References (no owned oracle -- high-confidence core only)

- [ ] **PRIN-01**: Beck *TDD by Example* backing -- the red-green-refactor cycle, the two rules, and the green-bar strategies (Fake It / Triangulate / Obvious Implementation) -- tagged no-oracle, scoped to seam context
- [ ] **PRIN-02**: Beck *Tidy First?* backing -- the structural-vs-behavioral change separation and when-to-refactor economics (coupling / cohesion / options) -- cross-referenced to overlapping Fowler refactorings; no complete tidyings catalog claimed
- [ ] **PRIN-03**: Feathers *Working Effectively with Legacy Code* backing -- a "refactor safely without tests" reference (legacy = no tests; seams; characterization tests; the change algorithm; Sprout/Wrap Method+Class, Subclass and Override Method, Extract Interface) -- core techniques only

### Distribution & Hygiene

- [ ] **DST-01**: `plugins/lz-tdd/.claude-plugin/plugin.json` version is bumped to `0.0.2` and the root `README.md` documents the `lz-refactor` skill (what it does + `/lz-tdd:lz-refactor` invocation) alongside `lz-tpp`
- [ ] **DST-02**: The repo passes `claude plugin validate .` and `--strict` with the new skill, and first-party review (plugin-validator + skill-reviewer) PASSes; public-repo hygiene preserved (work email absent, MIT, ASCII-only)
- [ ] **DST-03**: `CHANGELOG.md` gains an `lz-tdd@0.0.2` entry describing the lz-refactor skill
- [ ] **DST-04**: No verbatim Fowler/Kerievsky/GoF prose or code listings appear in the shipped tree -- only original prose, original code, names, and facts

### Skill-Effectiveness Evals

- [ ] **EVL-01**: Trigger eval -- the `description` fires on in-scope refactoring / refactor-step / smell prompts and stays quiet on near-misses (recall + specificity), run on the native eval harness
- [ ] **EVL-02**: Behavior eval -- the coach recommends the correct next refactoring for representative smell/scenario prompts across both layers (Fowler mechanical + Kerievsky pattern-directed routing), measured with-skill vs. baseline

## Future Requirements

Deferred beyond lz-tdd@0.0.2. Tracked, not in this roadmap.

### Deepening

- **FUT-01**: Full Beck *Tidy First?* tidyings catalog (requires acquiring the book for oracle verification)
- **FUT-02**: Multi-language example sets beyond TypeScript/JavaScript
- **FUT-03**: Automated refactoring execution (codemods / hook-driven transforms), vs. the current guidance-only skill
- **FUT-04**: Split the Kerievsky pattern-directed layer into its own `lz-refactor-to-patterns` skill if it outgrows a single skill

## Out of Scope

Explicitly excluded for lz-tdd@0.0.2. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Verbatim book prose / code listings | Copyright; the skill uses original prose + original code, names, and facts only |
| Full catalogs of the 3 unowned books (Beck x2, Feathers) | No owner oracle; only the high-confidence core is included, tagged no-oracle |
| 1st-edition-only Fowler refactorings | The skill targets the 2nd-edition catalog; 1st-ed-only entries are out |
| A separate `lz-refactor-to-patterns` skill | Decided: one `lz-refactor` skill with two reference layers |
| Automated refactoring execution / codemods | This is a guidance/knowledge skill, not a transform tool (see FUT-03) |
| npm packaging, additional plugins, non-TS languages | Deferred milestone candidates, unchanged from 0.0.1 |

## Traceability

Which phase covers which requirement. Populated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| SKEL-01 | (pending roadmap) | Pending |
| SKEL-02 | (pending roadmap) | Pending |
| SKEL-03 | (pending roadmap) | Pending |
| SKEL-04 | (pending roadmap) | Pending |
| FWL-01 | (pending roadmap) | Pending |
| FWL-02 | (pending roadmap) | Pending |
| FWL-03 | (pending roadmap) | Pending |
| FWL-04 | (pending roadmap) | Pending |
| KRV-01 | (pending roadmap) | Pending |
| KRV-02 | (pending roadmap) | Pending |
| KRV-03 | (pending roadmap) | Pending |
| KRV-04 | (pending roadmap) | Pending |
| CCH-01 | (pending roadmap) | Pending |
| CCH-02 | (pending roadmap) | Pending |
| CCH-03 | (pending roadmap) | Pending |
| CCH-04 | (pending roadmap) | Pending |
| CCH-05 | (pending roadmap) | Pending |
| PRIN-01 | (pending roadmap) | Pending |
| PRIN-02 | (pending roadmap) | Pending |
| PRIN-03 | (pending roadmap) | Pending |
| DST-01 | (pending roadmap) | Pending |
| DST-02 | (pending roadmap) | Pending |
| DST-03 | (pending roadmap) | Pending |
| DST-04 | (pending roadmap) | Pending |
| EVL-01 | (pending roadmap) | Pending |
| EVL-02 | (pending roadmap) | Pending |

**Coverage:**
- lz-tdd@0.0.2 requirements: 26 total
- Mapped to phases: 0 (pending roadmap)
- Unmapped: 26 (roadmap will resolve)

---
*Requirements defined: 2026-07-04*
*Last updated: 2026-07-04 after initial definition*
