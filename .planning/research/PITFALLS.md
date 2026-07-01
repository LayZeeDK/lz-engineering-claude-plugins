# Pitfalls Research

**Domain:** Claude Code plugin marketplace + agent skill encoding a conceptual TDD methodology (Transformation Priority Premise)
**Researched:** 2026-07-02
**Confidence:** HIGH for plugin/skill authoring (first-party skill-creator + plugin-dev docs, official marketplace schema); HIGH for TPP fidelity (canonical Uncle Bob source fetched verbatim)

This project has two failure surfaces that rarely overlap in one repo: (1) mechanical correctness of the marketplace/plugin/skill packaging, where a single bad path or wrong field means the plugin silently never loads, and (2) fidelity + usefulness of encoding a specific, opinionated, self-described-as-provisional methodology into a skill that must both coach and explain. The critical pitfalls below are split accordingly.

---

## Critical Pitfalls

### Pitfall 1: Conflating transformations with refactorings (the central TPP fidelity error)

**What goes wrong:**
The skill blurs the line between a *transformation* (a simple operation that CHANGES behavior, applied in the RED->GREEN transition to make a failing test pass) and a *refactoring* (a simple operation that PRESERVES behavior, applied in the REFACTOR step). Examples end up recommending "extract method" or "rename" as if they were transformations, or the priority list gets mixed with a refactoring catalog.

**Why it happens:**
Both are "simple code operations" and both appear in the red-green-refactor loop, so they feel interchangeable. Secondary write-ups often gloss the distinction. The canonical definition is precise and easy to lose: "Refactorings are simple operations that change the structure of code without changing its behavior. Transformations are simple operations that change the behavior of code."

**How to avoid:**
State the behavior-changing vs behavior-preserving distinction in the first paragraph of SKILL.md and again at the top of the bundled reference. Scope the skill explicitly to the GREEN phase (choosing the minimal behavior-changing edit that passes the current failing test). Add a "what this is NOT" note: TPP does not govern the refactor step. Include at least one should-not-trigger eval where the user asks for a refactoring ("extract this into a helper") to confirm the skill does not misclassify it as a transformation.

**Warning signs:**
Any example or list entry describing a structure-only change; the words "extract", "rename", "inline", "move" appearing as transformations; guidance that fires during the refactor step.

**Phase to address:** source-distillation (get the definition right), skill-authoring (state it prominently), eval-and-tune (negative eval for refactoring requests)

---

### Pitfall 2: Presenting TPP as rigid law rather than a provisional heuristic

**What goes wrong:**
The skill states the transformation order as an authoritative, always-correct ranking and instructs Claude to follow it mechanically. Users (and Claude) treat a lower-priority-than-ideal choice as a "violation" and contort code to satisfy the list rather than to pass the test cleanly.

**Why it happens:**
An ordered numbered list reads as canon. It is tempting to encode it as MUST-follow rules. But the premise's own author explicitly hedges: in the original post Uncle Bob writes "Are these the right transformations? (probably not)" and "Is the priority order presented in this blog correct? (not likely)". TPP is a premise/heuristic to reduce impasses, not a proven algorithm.

**How to avoid:**
Frame the skill as heuristic guidance with rationale ("prefer the simpler transformation because it avoids premature complexity and reduces the chance a later test forces a rewrite"), not as law. Avoid all-caps MUST/NEVER around ordering (this also aligns with skill-creator's own writing-style guidance to explain the "why" instead of issuing rigid commands). Include the author's own uncertainty as a documented caveat in the reference material. Let Claude reason about ties and exceptions.

**Warning signs:**
SKILL.md uses "MUST follow the order" / "NEVER skip a transformation"; the skill flags reasonable code as wrong purely for ordering; no mention that the ordering is debatable/language-specific.

**Phase to address:** source-distillation (capture the caveat), skill-authoring (heuristic framing)

---

### Pitfall 3: Transformation-list drift from relying on secondary sources

**What goes wrong:**
The bundled list silently diverges from Uncle Bob's canonical list -- renamed, reordered, or with entries added/dropped -- because it was transcribed from Wikipedia, blog summaries, or memory rather than the primary sources.

**Why it happens:**
Secondary sources have already drifted. Verified during this research: Wikipedia/Grokipedia render `constant->scalar` as `constant->variable`, label `statement->recursion` as `statement->tail recursion`, and annotate `variable->assignment` as "mutating value" -- none of which match the original. Even this project's own PROJECT.md brief uses `constant->variable` and an abbreviated 7-item set. The canonical list has 12 entries.

**How to avoid:**
Transcribe the list verbatim from the primary source and pin it in a reference file. The canonical order (highest/simplest priority first) is:
1. `({}->nil)` no code at all -> code that employs nil
2. `(nil->constant)`
3. `(constant->constant+)` a simple constant to a more complex constant
4. `(constant->scalar)` replacing a constant with a variable or an argument
5. `(statement->statements)` adding more unconditional statements
6. `(unconditional->if)` splitting the execution path
7. `(scalar->array)`
8. `(array->container)`
9. `(statement->recursion)`
10. `(if->while)`
11. `(expression->function)` replacing an expression with a function or algorithm
12. `(variable->assignment)` replacing the value of a variable

Cite the source URL next to the list. Cross-check the NDC 2011 talk transcript and the FibTPP post for any refinements, and note discrepancies rather than silently picking one.

**Warning signs:**
Fewer than 12 entries; `constant->variable` instead of `constant->scalar`; "tail recursion" wording; any entry you cannot point to in the primary post.

**Phase to address:** source-distillation (primary-source transcription with citation)

---

### Pitfall 4: A reference-only skill that recites the list but does not coach the next choice

**What goes wrong:**
The skill explains what TPP is and prints the ordered list, but when Claude is mid-TDD with a failing test and some current code, the skill offers no procedure for choosing THE next minimal transformation. The stated core value ("helps Claude choose the next code transformation by TPP priority order") is unmet even though the skill "works."

**Why it happens:**
Explaining a concept is easier to write than encoding a decision procedure. Reference content is concrete; coaching behavior requires modeling the red-green state and the "simplest transformation that passes THIS test" judgment.

**How to avoid:**
Design SKILL.md around a decision procedure, not a glossary: given (a) the failing test and (b) the current implementation, identify the current position in the transformation list and recommend the smallest step up that makes the test pass, with the reasoning. Provide worked before/after snippets showing the transformation actually applied to code. Keep the full annotated list in references/ (reference behavior); keep the procedure in SKILL.md (coach behavior). Validate with evals that present an actual failing test + code, not just "explain TPP."

**Warning signs:**
SKILL.md is mostly prose about TPP history; no step-by-step "which transformation next" logic; evals only check that Claude can define TPP.

**Phase to address:** skill-authoring (procedure-first design), eval-and-tune (coach-behavior evals with real test+code inputs)

---

### Pitfall 5: Over-triggering vs under-triggering -- description tuned by feel, not by evals

**What goes wrong:**
Either the skill fires on any mention of "test", "refactor", or "TypeScript" (annoying, hijacks unrelated work), or it never fires when a user is genuinely doing red-green-refactor and would benefit. The requirement explicitly asks for accurate triggering "without over-triggering," which is in direct tension with skill-creator's advice to make descriptions deliberately "pushy" to combat undertriggering.

**Why it happens:**
The description is the sole triggering mechanism, and it is usually written once by intuition. skill-creator warns Claude currently *under*-triggers skills, so authors overcorrect into pushiness -- which for a narrow, opinionated coaching skill produces over-triggering. There is also a structural subtlety: skill-creator notes Claude only consults skills for tasks it cannot trivially handle, so simple prompts will not trigger regardless of description.

**How to avoid:**
Run skill-creator's description-optimization loop with a 20-query eval set: 8-10 should-trigger (TDD, transformation choice, "which change makes this test pass", TPP explanation requests, phrased formally and casually) and 8-10 should-not-trigger near-misses (asking for a refactoring, generic "write a function", "add a feature", non-TDD debugging, "explain what a unit test is"). Select the description by held-out test score, not train score. Scope trigger phrases to transformation-choice-during-TDD and on-demand TPP explanation, not to "TDD" or "testing" broadly.

**Warning signs:**
No `evals/` trigger set in the repo; description contains broad nouns like "testing", "TypeScript", "refactoring" as triggers; skill fires in unrelated coding sessions during dogfooding.

**Phase to address:** eval-and-tune (the description-optimization loop is the whole point of this phase)

---

### Pitfall 6: Auto-trigger vs slash-invocation confusion (`/lz-tdd:lz-tpp` namespacing)

**What goes wrong:**
The skill is documented/advertised as `/lz-tdd:lz-tpp` (an explicit slash invocation) but authored purely as a description-triggered skill, or vice versa. Users type `/lz-tdd:lz-tpp` and it does not behave like a command; or the README promises auto-coaching that never materializes because the description is written for slash-only use.

**Why it happens:**
Skills historically auto-trigger from their description; slash invocation of skills as `/plugin:skill` is a newer capability (plugin-dev now treats `commands/` as legacy and steers user-invoked actions into `skills/<name>/SKILL.md`). This project wants BOTH modes: coach (auto-trigger during TDD) and reference (explain on demand, naturally an explicit invocation). Supporting both requires deliberate design. Invocation is namespaced by PLUGIN name (`lz-tdd`), not the marketplace name -- another spot to get wrong.

**How to avoid:**
Decide the invocation model explicitly and support both: a strong triggering description (for coach mode) AND user-invoked-skill frontmatter (`description`, `argument-hint`, `allowed-tools`) so `/lz-tdd:lz-tpp` works for explicit reference/explanation. Write body instructions FOR Claude, not TO the user. Confirm the skill directory name is `lz-tpp` and the frontmatter `name` matches, so the namespace resolves to `/lz-tdd:lz-tpp`. Document in README that invocation uses the plugin name, and that the skill also activates automatically during TDD.

**Warning signs:**
README shows `/lz-tdd:lz-tpp` but SKILL.md has no argument-hint/allowed-tools; frontmatter `name` != directory name; docs reference the marketplace name in the invocation path.

**Phase to address:** scaffold (naming/namespace), skill-authoring (dual-mode frontmatter + body)

---

### Pitfall 7: Progressive-disclosure bloat -- full annotated list + all examples inline in SKILL.md

**What goes wrong:**
The entire 12-item annotated transformation list, the history/premise essay, language caveats, and every worked TypeScript example get stuffed into SKILL.md. It balloons past the recommended size, so all of it loads into context every time the skill triggers, wasting tokens and burying the decision procedure.

**Why it happens:**
It is the path of least resistance -- one file, everything visible. The requirement to "bundle the full transformation priority list as reference material" is easy to satisfy by pasting it inline instead of in `references/`.

**How to avoid:**
Apply the three-level model deliberately. SKILL.md (target ~1,500-2,000 words, under ~500 lines): the definition, the coach decision procedure, a compact list, and pointers. `references/transformations.md`: the full annotated list, per-transformation rationale, language-specificity notes, the author's provisional caveat, and the FibTPP-style worked walkthrough. Reference the file explicitly from SKILL.md ("For the full annotated list and worked examples, read references/transformations.md"). This is exactly what skill-reviewer and skill-development flag as Mistake 2 ("too much in SKILL.md").

**Warning signs:**
SKILL.md > ~3,000 words / ~500 lines; no `references/` directory; the full list AND all examples visible in the main file; information duplicated between SKILL.md and references.

**Phase to address:** skill-authoring (structure the split from the start)

---

### Pitfall 8: Marketplace/plugin manifest errors that make the plugin silently fail to load

**What goes wrong:**
The plugin never appears after `/plugin marketplace add`, or fails validation, because of: invalid JSON (trailing comma, comment in strict JSON), a `source` path that does not resolve, a `name` that is not kebab-case, a `version` that is not full semver (`1.0` instead of `1.0.0`), a missing required field, or a plugin `source` in marketplace.json that points to the wrong relative path for an in-repo plugin.

**Why it happens:**
Two manifests with different required fields are involved -- root `.claude-plugin/marketplace.json` (requires `name`, `owner` with `owner.name`, and `plugins[]` each with `name` + `source`) and per-plugin `.claude-plugin/plugin.json` (requires `name`; recommends `version`/`description`/`author`). Paths must be relative, start with `./`, use forward slashes, and never use `../`. It is easy to hand-edit one and forget the other.

**How to avoid:**
Scaffold both manifests from known-good templates. For an in-repo plugin, set the marketplace `source` to the plugin's relative directory (e.g. `"./plugins/lz-tdd"` or `"./lz-tdd"`), or use `metadata.pluginRoot` to shorten entries. Validate with `claude plugin validate <path>` and the plugin-validator agent before pushing. Keep JSON strict (no comments/trailing commas). Use full X.Y.Z semver (default `0.1.0`). Optionally add `$schema` pointing at the SchemaStore definition (`https://json.schemastore.org/claude-code-marketplace.json`) for editor validation -- note Anthropic's own referenced schema URL does not actually resolve, so do not depend on it.

**Warning signs:**
Plugin missing from `/plugin` list after add; validator reports schema/path/version errors; `source` path does not match the on-disk plugin location; `version: "1.0"`.

**Phase to address:** scaffold (manifests + validation gate)

---

### Pitfall 9: Repo-rename / name-mismatch trap between folder, GitHub repo, marketplace name, and plugin name

**What goes wrong:**
The install command `/plugin marketplace add LayZeeDK/lz-engineering-claude-plugins` fails or installs the wrong thing because the GitHub repo name, the local working directory (`lz-engineering-claude-plugin`, singular), the marketplace.json `name`, and the plugin `name` are not aligned. PROJECT.md flags the rename to the plural form is still pending.

**Why it happens:**
Four independent identifiers, renamed at different times. `/plugin marketplace add owner/repo` resolves against the GitHub repo name; the marketplace.json `name` is a separate internal identifier; the invocation namespace uses the plugin `name` (`lz-tdd`). A mismatch in any one breaks a different step.

**How to avoid:**
Decide the final names once and make them consistent: GitHub repo `lz-engineering-claude-plugins`, marketplace.json `name: lz-engineering-claude-plugins`, plugin `name: lz-tdd`, skill dir/name `lz-tpp`. Do the physical folder + GitHub rename OUTSIDE an active session (renaming cwd mid-session breaks tooling, per PROJECT.md). Update the README install command and marketplace `source` paths together with the rename. Do not reference the singular working-directory name anywhere in committed manifests or docs.

**Warning signs:**
README install command uses a repo name that does not exist yet; marketplace.json `name` differs from repo; any committed path referencing the singular folder name.

**Phase to address:** scaffold (name decision), docs (install command), ship (rename executed outside session)

---

### Pitfall 10: Language-specific TypeScript examples that mislead as "language-agnostic"

**What goes wrong:**
TypeScript examples imply the transformation is about types/generics (e.g., showing `scalar->array` as adding a typed array signature), so readers applying TPP in Python/Java/Go take the wrong lesson. Worse, one fixed ordering is presented as universal when the ordering is explicitly language-dependent: Uncle Bob notes that in Java one might move `if->while` and `variable->assignment` above `statement->recursion` because Java is not functional. A TS/JS skill that hard-codes recursion-preferred ordering may mismatch idiomatic TS.

**Why it happens:**
The requirement pairs "language-agnostic principles" with "concrete TypeScript examples." It is easy to let the concrete TS examples silently define the concept, and to present the canonical order as absolute despite the documented language caveat.

**How to avoid:**
Keep the principle statement language-neutral (transformations described in terms of code-structure change, not TS syntax). Mark TS examples clearly as illustrations of a general transformation, and choose examples where the transformation, not the type system, is the point. Include a short "ordering is language-specific" note citing the Java example, and state which ordering the skill assumes and why (multi-paradigm TS/JS). Avoid examples that only make sense with TS-only features.

**Warning signs:**
Examples where the "transformation" is really a type annotation change; no mention of language-specificity; ordering asserted as universal.

**Phase to address:** source-distillation (capture language caveat), skill-authoring (neutral principle + labeled TS examples)

---

### Pitfall 11: Worked examples that do not actually follow the priority order

**What goes wrong:**
An included walkthrough (e.g., a Fibonacci or word-wrap kata) jumps transformations, skips priority steps, or reaches green with a lower-priority transformation when a higher one would have sufficed -- directly contradicting the skill's own thesis. The requirement explicitly demands examples that follow the ordering.

**Why it happens:**
Worked examples are written to reach a plausible end state, not verified step-by-step against the list. Uncle Bob's own FibTPP post is a faithful demonstration; ad-hoc examples rarely are.

**How to avoid:**
For every example, annotate each step with the transformation applied and its list position, and confirm each step is the highest-priority transformation that passes the then-current test. Prefer adapting a canonical worked example (FibTPP) over inventing one. Add an eval that checks a produced walkthrough is monotonic in priority order (or documents any justified deviation).

**Warning signs:**
Example steps not tagged with transformation names; a step uses `unconditional->if` where a `constant->scalar` would have passed the test; the example's narrative contradicts the priority claim.

**Phase to address:** skill-authoring (annotate + verify examples), eval-and-tune (example-fidelity check)

---

### Pitfall 12: Dropping the "why" -- premise rationale and impasse-avoidance

**What goes wrong:**
The skill lists transformations and their order but omits WHY the order matters: simpler-first avoids premature complexity, and choosing tests/transformations in priority order prevents impasses where a single test forces rewriting an entire method (escaping local maxima). Without the rationale, the "explain the premise on demand" requirement is unmet and Claude cannot reason about edge cases.

**Why it happens:**
The list is the memorable artifact; the rationale is the harder-to-compress insight. Compression pressure (progressive disclosure) tempts authors to cut the "why" first.

**How to avoid:**
Keep a concise rationale in SKILL.md ("prefer simpler transformations to stay at the least complex code that passes the test and to avoid a later test forcing a large rewrite") and the fuller premise (the "as tests get more specific, code gets more generic" mantra, impasse avoidance) in references/. skill-creator explicitly favors explaining the why over rote rules.

**Warning signs:**
Skill can list transformations but cannot answer "why prefer the simpler one?"; no mention of impasses / local maxima / the specificity-vs-generality mantra.

**Phase to address:** source-distillation (extract rationale), skill-authoring (retain concise why + reference deeper)

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Ship the skill without running the trigger-eval loop | Faster to "done" | Untuned triggering; over/under-fires in real use; the core "accurate triggering" requirement unmet | Never for v1 -- accurate triggering is an explicit requirement |
| Put the whole annotated list inline in SKILL.md | One file, simple | Context bloat on every trigger; buries the coach procedure; flagged by skill-reviewer | Only for a throwaway prototype, not a published skill |
| Transcribe the transformation list from memory/Wikipedia | No source fetch needed | Silent fidelity drift (wrong names/order); undermines the skill's whole reason to exist | Never -- primary-source transcription is cheap |
| Duplicate description/version across marketplace.json and plugin.json without a sync note | Fields visible in both places | The two drift; plugin.json is authoritative under `strict:true`, so marketplace display lies | Acceptable if a single source is treated as canonical and the other documented as derived |
| Skip the plugin-validator / `claude plugin validate` gate before push | Ship sooner | Plugin silently fails to load for users; hard to diagnose remotely | Never before a public push |
| Reference-only skill now, add coaching "later" | Easy first cut | Ships the wrong product (reference exists everywhere; coaching is the value) | Only if explicitly descoped -- but that contradicts Core Value |

## Integration Gotchas

Marketplace/install/invocation integration -- where packaging meets the Claude Code runtime.

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| `/plugin marketplace add owner/repo` | Repo name in README does not match the actual GitHub repo (pending rename) | Align GitHub repo == install command == marketplace.json `name`; execute rename before publishing docs |
| marketplace.json `source` for in-repo plugin | Absolute path, missing `./`, `../`, or wrong relative dir | Relative `./...` path matching on-disk location; or `metadata.pluginRoot` shortcut; forward slashes only |
| Skill invocation namespace | Using marketplace name in the path, or dir/frontmatter name mismatch | `/lz-tdd:lz-tpp` uses the PLUGIN name; ensure skill dir == frontmatter `name` == `lz-tpp` |
| Manifest JSON format | Comments or trailing commas in `.json` (valid only in `.jsonc`) | Keep strict JSON in `plugin.json`/`marketplace.json`; validate before commit |
| `${CLAUDE_PLUGIN_ROOT}` (if any script/asset path is added later) | Hardcoding install paths or `~/` | Use `${CLAUDE_PLUGIN_ROOT}` for any intra-plugin path (not needed for a skill-only v1, but relevant as the plugin grows) |
| Schema validation | Depending on Anthropic's referenced schema URL | That URL does not resolve; use SchemaStore's `claude-code-marketplace.json` for editor validation |

## Performance Traps (adapted: token / context traps)

Scale here is not users -- it is context tokens loaded per skill activation and per session.

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Fat SKILL.md loaded on every trigger | Skill consumes large context whenever coaching fires mid-TDD | Keep SKILL.md lean; push list/examples to references/ read on demand | Every activation once body exceeds ~500 lines |
| Over-triggering during unrelated work | Skill body loads in sessions that are not doing TDD | Precise, eval-tuned description scoped to transformation-choice + TPP explanation | Whenever the user says "test"/"refactor" in any context |
| Reference file with no table of contents | Claude reads the whole large reference to find one transformation | Add a TOC / grep-friendly headers for files >300 lines | As the annotated list + examples grow |
| Metadata description overstuffed for "pushiness" | Always-in-context metadata grows; still mis-triggers | Tune description length via the optimization loop, not by piling on phrases | When pushiness is used as a substitute for evals |

## Security Mistakes (adapted: public-repo + skill-content safety)

| Mistake | Risk | Prevention |
|---------|------|------------|
| Work email committed to public repo | Personal/work contact leak; violates project constraint | Use `larsbrinknielsen@gmail.com` only; never the work email anywhere in repo/manifests |
| Missing or wrong LICENSE | Ambiguous reuse rights for a public marketplace plugin | Include MIT LICENSE at repo root; set `license: "MIT"` in plugin.json |
| Skill instructs Claude to run code that "just makes the test pass" without bounds | A coaching skill that encourages arbitrary edits could suggest unsafe changes | Scope guidance to minimal transformations on the code under test; do not instruct broad file/system operations |
| Copy-pasted source text without attribution | Licensing/attribution issues quoting Clean Coder content at length | Summarize + cite source URLs; quote transformation list minimally with attribution |
| Non-ASCII / smart punctuation in committed files | Mojibake on the author's Windows cp1252 toolchain; ugly diffs | ASCII-only in all skill/manifest/doc content (arrows as `->`, hyphens not en/em dashes) |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Skill lectures on TPP history when user just wants the next step | Coaching feels like a wall of text mid-flow | Lead with the concrete next-transformation recommendation; keep history in references/explain-on-demand |
| No clear way to get the explanation on demand | User cannot access the "reference" behavior deliberately | Support explicit `/lz-tdd:lz-tpp` invocation for explanation, distinct from auto-coaching |
| Ordering presented as verdict ("you violated TPP") | Feels pedantic; users disable the skill | Frame as suggestion with rationale; acknowledge ties and language/context exceptions |
| README omits that the skill also auto-activates | Users think they must always invoke it manually | Document both modes: auto-coach during TDD + explicit invocation for explanation |
| TypeScript-only examples for a "language-agnostic" skill | Non-TS users feel it does not apply | State principle language-neutrally; label TS as illustration; note language-specific ordering |

## "Looks Done But Isn't" Checklist

- [ ] **Marketplace install:** Often missing a working end-to-end test -- verify `/plugin marketplace add LayZeeDK/lz-engineering-claude-plugins` then install actually surfaces `lz-tdd` on a clean machine, not just that JSON validates.
- [ ] **Skill triggering:** Often "works" only because the author names the skill explicitly -- verify it triggers on natural TDD phrasing AND stays quiet on refactoring/near-miss prompts via the eval set.
- [ ] **Coach behavior:** Often only reference behavior is implemented -- verify the skill recommends a specific next transformation given a real failing test + current code, not just an explanation.
- [ ] **Transformation list fidelity:** Often silently drifted -- verify all 12 entries match the primary source names/order (no `constant->variable`, no "tail recursion").
- [ ] **Progressive disclosure:** Often everything inline -- verify SKILL.md is lean and the full list/examples live in references/ with a pointer.
- [ ] **Examples follow the order:** Often not step-checked -- verify each example step is the highest-priority transformation that passes the current test.
- [ ] **Namespace:** Often mismatched -- verify skill dir == frontmatter `name` == `lz-tpp`, invocation `/lz-tdd:lz-tpp`.
- [ ] **Hygiene:** Often forgotten -- verify MIT LICENSE present, public email only, ASCII-only content, README install command matches final repo name.
- [ ] **Both manifests:** Often only one edited -- verify marketplace.json AND plugin.json both valid and consistent.

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Transformation-list drift shipped | LOW | Re-transcribe from primary source, correct references/, bump patch version |
| Over/under-triggering discovered post-ship | MEDIUM | Run description-optimization loop, replace description, bump version; add regression evals |
| Reference-only skill shipped (no coaching) | HIGH | Redesign SKILL.md around the decision procedure; add coach evals; effectively a re-authoring |
| Manifest error -> plugin never loads | LOW | Fix JSON/path/version, re-run `claude plugin validate`, re-push |
| Name mismatch after rename | MEDIUM | Reconcile all four identifiers, update README + marketplace `source`, re-add marketplace |
| SKILL.md bloat | LOW | Move list/examples to references/, add pointers, verify no duplication |
| Work email leaked in git history | MEDIUM | Rewrite history to purge, rotate references; costlier than preventing it |

## Pitfall-to-Phase Mapping

Suggested phases: **scaffold** (marketplace + plugin manifests, names, structure), **source-distillation** (extract canonical TPP from primary sources), **skill-authoring** (write SKILL.md + references, coach + reference behavior), **eval-and-tune** (test cases + description-optimization loop), **docs** (README, LICENSE, install, hygiene).

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| 1. Transformation vs refactoring conflation | source-distillation + skill-authoring | Definition stated up front; negative eval for refactoring requests passes |
| 2. TPP as rigid law | source-distillation + skill-authoring | No MUST/NEVER around ordering; author's provisional caveat present |
| 3. List drift from secondary sources | source-distillation | All 12 entries match primary source verbatim, with citation |
| 4. Reference-only, no coaching | skill-authoring + eval-and-tune | Coach eval (failing test + code) yields a specific next transformation |
| 5. Over/under-triggering | eval-and-tune | 20-query eval set passes on held-out split; dogfooding shows no stray fires |
| 6. Auto-trigger vs slash-invocation confusion | scaffold + skill-authoring | `/lz-tdd:lz-tpp` works AND auto-coaching triggers; names aligned |
| 7. SKILL.md bloat | skill-authoring | SKILL.md within size target; list/examples in references/ |
| 8. Manifest errors | scaffold | `claude plugin validate` + plugin-validator pass; clean-machine install works |
| 9. Name/rename mismatch | scaffold + docs + ship | All identifiers aligned; README install command resolves |
| 10. Misleading language-specific examples | source-distillation + skill-authoring | Language caveat present; TS examples labeled as illustrations |
| 11. Examples violate priority order | skill-authoring + eval-and-tune | Each example step tagged + verified highest-priority-that-passes |
| 12. Dropped rationale | source-distillation + skill-authoring | Skill answers "why prefer simpler?" and explains impasse avoidance |

## Sources

- The Transformation Priority Premise -- Robert C. Martin (primary; canonical 12-item list + refactoring/transformation definitions + author's "probably not / not likely" provisional caveat), fetched verbatim: https://blog.cleancoder.com/uncle-bob/2013/05/27/TheTransformationPriorityPremise.html
- Fib. The T-P Premise. -- Robert C. Martin (worked Fibonacci walkthrough demonstrating priority order): https://blog.cleancoder.com/uncle-bob/2013/05/27/FibTPP.html
- Robert C. Martin -- The Transformation Priority Premise, NDC 2011 (talk; cited as authoritative source): https://youtu.be/B93QezwTQpI
- Transformation Priority Premise -- Wikipedia (secondary; used to DEMONSTRATE drift: renames constant->scalar, "tail recursion" wording): https://en.wikipedia.org/wiki/Transformation_Priority_Premise
- skill-creator SKILL.md (triggering mechanism, description "pushiness" vs precision, description-optimization loop, progressive disclosure, size targets) -- local first-party: `C:\Users\LarsGyrupBrinkNielse\.claude\plugins\cache\claude-plugins-official\skill-creator\unknown\skills\skill-creator\SKILL.md`
- plugin-dev skill-development SKILL.md (description quality, third-person triggers, imperative body, SKILL.md size targets, common mistakes) -- local first-party
- plugin-dev plugin-structure SKILL.md + manifest-reference.md (plugin.json fields, kebab-case, semver, relative `./` paths, auto-discovery, ${CLAUDE_PLUGIN_ROOT}) -- local first-party
- plugin-dev plugin-validator.md + skill-reviewer.md (what the validators/reviewers flag) -- local first-party
- plugin-dev create-plugin.md (skills-over-commands guidance; user-invoked skills need description/argument-hint/allowed-tools) -- local first-party
- Create and distribute a plugin marketplace -- Claude Code Docs (marketplace.json required fields name/owner/plugins, source types, reserved names, `strict`, `metadata.pluginRoot`, `claude plugin validate`), via search summary (docs domain blocks AI fetchers): https://code.claude.com/docs/en/plugin-marketplaces
- anthropics/claude-plugins-official marketplace.json (real-world reference for marketplace structure): https://github.com/anthropics/claude-plugins-official/blob/main/.claude-plugin/marketplace.json
- hesreallyhim/claude-code-json-schema (unofficial JSON schemas for plugin + marketplace) and SchemaStore `claude-code-marketplace.json` (editor validation): https://github.com/hesreallyhim/claude-code-json-schema

---
*Pitfalls research for: Claude Code plugin marketplace + TPP-encoding agent skill*
*Researched: 2026-07-02*
