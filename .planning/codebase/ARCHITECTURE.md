<!-- refreshed: 2026-07-17 -->
# Architecture

**Analysis Date:** 2026-07-17

## System Overview

This repository is a Claude Code plugin marketplace. It ships no executable
runtime: the product is a tree of Markdown knowledge artifacts (skills, catalog
indexes, and per-item reference leaves) that Claude Code loads and reasons over.
"Runtime" here is the Claude Code plugin host that installs the marketplace,
namespaces the skills, and progressively loads their Markdown as context.

```text
+---------------------------------------------------------------+
|                  Claude Code plugin host                      |
|  reads marketplace -> installs plugin -> namespaces skills    |
|  `.claude-plugin/marketplace.json`                            |
+---------------------------+-----------------------------------+
                            |
                            v
+---------------------------------------------------------------+
|                  Plugin: lz-tdd                               |
|  `plugins/lz-tdd/.claude-plugin/plugin.json`                  |
+------------------------------+--------------------------------+
         |                                        |
         v                                        v
+--------------------------+          +---------------------------+
|  Skill: lz-tpp           |          |  Skill: lz-refactor       |
|  (green / transform step)|          |  (refactor step)          |
|  `skills/lz-tpp/SKILL.md`|          | `skills/lz-refactor/      |
|                          |          |   SKILL.md`               |
+------------+-------------+          +-------------+-------------+
             |                                      |
             v                                      v
+--------------------------+          +---------------------------+
|  lz-tpp references/      |          |  lz-refactor references/  |
|  transformations.md,     |          |  THIN indexes -> leaves:  |
|  fibonacci-worked-       |          |  smells, fowler-catalog,  |
|  example, ts-and-tco     |          |  kerievsky, gof, extra-   |
|                          |          |  patterns, functional     |
+--------------------------+          +-------------+-------------+
                                                    |
                                                    v
                                      +---------------------------+
                                      |  Clean-room source gate   |
                                      |  `.oracle/` (gitignored)  |
                                      |  read only via oracle /   |
                                      |  oracle-reviewer agents   |
                                      +---------------------------+
```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| Marketplace catalog | Names the marketplace, lists plugins and their `source` paths | `.claude-plugin/marketplace.json` |
| Plugin manifest | Declares `lz-tdd` identity/metadata; anchors auto-discovery of `skills/` | `plugins/lz-tdd/.claude-plugin/plugin.json` |
| lz-tpp skill (router) | Green-step coach: recommend next code transformation by TPP priority; explain TPP on demand | `plugins/lz-tdd/skills/lz-tpp/SKILL.md` |
| lz-refactor skill (router) | Refactor-step coach: recognize smell, route to named Fowler/Kerievsky refactoring, gate patterns by net-cost; explain on demand | `plugins/lz-tdd/skills/lz-refactor/SKILL.md` |
| Catalog indexes (thin) | Navigation-only tables mapping a name/`Use when:` selector to a leaf; no inlined mechanics | `.../lz-refactor/references/*/README.md`, `.../references/smells.md` |
| Reference leaves | The actual per-refactoring / per-smell / per-pattern / per-idiom content | `.../lz-refactor/references/<catalog>/<item>.md` |
| oracle agent | Clean-room open-ended lookup FROM copyrighted books, answers in own words | `.claude/agents/oracle.md` |
| oracle-reviewer agent | Clean-room fidelity gate on a drafted leaf against the source | `.claude/agents/oracle-reviewer.md` |
| Eval workspaces | Skill-triggering and applied-output evals + `.mjs` check scripts (dev tooling, not shipped) | `.claude/skills/lz-refactor-workspace/`, `.claude/skills/lz-tpp-workspace/` |

## Pattern Overview

**Overall:** Progressive-disclosure knowledge base behind a two-skill router.

**Key Characteristics:**
- Each skill's `SKILL.md` is a lightweight router (< 500 lines) that classifies
  intent, then links out to references; it never inlines catalog content.
- Three-tier disclosure: `SKILL.md` (router) -> catalog `README.md` (thin index,
  navigation only) -> per-item leaf (full mechanics/example). Context loads only
  the tier the task needs.
- Two-mode routing per skill: Coach mode (act on current code) vs Reference mode
  (explain/lookup). Intent classification precedes any recommendation.
- Clean-room authoring: copyrighted book prose lives only in gitignored `.oracle/`
  and is reachable exclusively through read-only agents that return facts in their
  own words, so verbatim expression cannot enter the committed tree (DST-04).

## Layers

**Router layer (skills):**
- Purpose: classify the request and route to the right reference, or run the
  coach decision procedure
- Location: `plugins/lz-tdd/skills/<skill>/SKILL.md`
- Contains: mode split, decision procedure, seam rules, index links
- Depends on: the reference layer (via relative links)
- Used by: the Claude Code plugin host (auto-trigger via `description`, or explicit
  `/lz-tdd:<skill>` invocation)

**Index layer (catalog READMEs):**
- Purpose: map a name or `Use when:` selector to the correct leaf
- Location: `plugins/lz-tdd/skills/lz-refactor/references/<catalog>/README.md` and
  `references/smells.md`
- Contains: thin tables only (name, aliases/tags, one-line selector, leaf link)
- Depends on: the leaf layer (mirrors each leaf's `Use when:` selector verbatim)
- Used by: the router layer

**Leaf layer (reference documents):**
- Purpose: hold the full content for one refactoring, smell, pattern, or idiom
- Location: `plugins/lz-tdd/skills/lz-refactor/references/<catalog>/<item>.md`,
  `references/smells/<smell>.md`, and lz-tpp `references/*.md`
- Contains: motivation, mechanics, examples, watch-fors (template varies by source)
- Depends on: nothing downstream; cross-links sideways to sibling leaves
- Used by: the index layer and, for cross-links, other leaves

## Data Flow

### Primary Request Path (lz-refactor coach mode)

1. Request arrives; host auto-triggers or user runs `/lz-tdd:lz-refactor`
   (`plugins/lz-tdd/skills/lz-refactor/SKILL.md:1` frontmatter `description`).
2. Classify against the lz-tpp seam: a red test to pass means green step, hand off
   to lz-tpp and stop (`SKILL.md:45`).
3. Recognize the smell by scanning recognize-by cues, then open the matching smell
   leaf (`references/smells.md` -> `references/smells/<smell>.md`) (`SKILL.md:49`).
4. Route by smell kind to a candidate named refactoring in the Fowler or Kerievsky
   catalog (`SKILL.md:52`).
5. For a pattern-directed refactoring, run the one-line net-cost APPLY/DECLINE
   verdict before any code (`SKILL.md:63`).
6. Loop audit: enumerate loops/accumulators, decide pipeline conversions
   (`SKILL.md:88`).
7. Coach or drive by QUESTION/COMMAND intent: present the smallest step, or perform
   behavior-preserving steps when asked (`SKILL.md:114`).

### Reference / explain path

1. Request is "explain this smell/refactoring/principle" or a named lookup.
2. Router routes to the correct `references/` doc (`SKILL.md:110`).
3. Answer from the leaf; the router never restates leaf content.

### lz-tpp coach path

1. Confirm the green phase (exactly one failing test, prior tests green,
   compiles) (`skills/lz-tpp/SKILL.md:44`).
2. Enumerate candidate minimal changes, map each to the canonical 14-item list in
   `references/transformations.md` (`SKILL.md:48`).
3. Recommend the highest-priority transformation and name it; apply the TS/JS TCO
   overlay when it changes the pick (`SKILL.md:51`).
4. Show, don't drive: present the minimal diff; do not edit or run tests unasked
   (`SKILL.md:63`).

**State Management:**
- Stateless. Each invocation is a fresh routing pass over static Markdown; there is
  no persisted application state. The only "state" is the Claude Code context window
  and the GSD `.planning/` workflow artifacts (out of the shipped product).

## Key Abstractions

**Skill router:**
- Purpose: single entry file that classifies intent and dispatches to references
- Examples: `plugins/lz-tdd/skills/lz-tpp/SKILL.md`,
  `plugins/lz-tdd/skills/lz-refactor/SKILL.md`
- Pattern: YAML frontmatter (`name` + triggering `description`) + Markdown body
  with a two-mode split and a numbered decision procedure

**Thin catalog index:**
- Purpose: navigation-only selector table, one row per leaf
- Examples: `.../references/fowler-catalog/README.md`,
  `.../references/gof-catalog/README.md`, `.../references/smells.md`
- Pattern: each row mirrors its leaf's `Use when:` / recognize-by line verbatim;
  no mechanics inlined (the functional-catalog index adds an N:1 pattern->idiom map)

**Reference leaf:**
- Purpose: one self-contained unit of knowledge
- Examples: `.../references/fowler-catalog/extract-function.md`,
  `.../references/smells/long-function.md`
- Pattern: leaf template mirrors its own source (Fowler = Motivation/Mechanics/
  Example/Watch-for; GoF = Intent/Applicability/Consequences/Example/Related)

## Entry Points

**Skill auto-invocation:**
- Location: `description` frontmatter in each `SKILL.md`
- Triggers: request text matching the skill's coach/reference triggers
- Responsibilities: load the router and run its decision procedure

**Explicit slash command:**
- Location: derived from the skill directory name -> `/lz-tdd:lz-tpp`,
  `/lz-tdd:lz-refactor`
- Triggers: user types the namespaced command
- Responsibilities: force Reference mode (or coach if a target is present)

**Marketplace install:**
- Location: `.claude-plugin/marketplace.json`
- Triggers: `/plugin marketplace add LayZeeDK/lz-engineering-claude-plugins`
- Responsibilities: register the marketplace and expose `lz-tdd` for install

## Architectural Constraints

- **No runtime code path:** the product is pure Markdown; there is no server,
  process, or thread model. The eval harness under `.claude/skills/*-workspace/`
  is Node.js ESM (`.mjs`) dev tooling, not shipped with the plugin.
- **SKILL.md size ceiling:** each router stays under ~500 lines
  (lz-refactor is 181, lz-tpp is 82) so it loads cheaply; depth goes into leaves.
- **Thin-index invariant:** catalog READMEs carry navigation only. Inlining leaf
  mechanics into an index breaks progressive disclosure and the selector-mirror
  contract.
- **Clean-room boundary (DST-04):** copyrighted source lives only in gitignored
  `.oracle/`; the main authoring context must never read it. Only the read-only
  `oracle` / `oracle-reviewer` agents (`model: opus`, tools limited to Read/Glob)
  touch it, and they return facts in their own words.
- **Worktree provisioning:** `.oracle/` is gitignored, so `.worktreeinclude` lists
  it to copy it into new worktrees where the oracle agents run.
- **GSD coexistence:** `.claude/settings.json` pins a local OpenGSD (`gsd-core`)
  marketplace and disables the full GSD skill surface except the mapper flow;
  this is workflow tooling, not part of the shipped plugin.

## Anti-Patterns

### Guessing a refactoring from the index

**What happens:** picking a refactoring straight off a catalog README row without
opening the leaf.
**Why it's wrong:** the index is navigation-only; it carries no mechanics and no
smell-to-refactoring map, so a guess skips the confirmation the leaf provides.
**Do this instead:** scan cues in `references/smells.md`, open the matching smell
leaf, then follow it to the named refactoring leaf (`lz-refactor/SKILL.md:49`).

### Applying a pattern without a net-cost verdict

**What happens:** introducing a GoF/Kerievsky pattern because it "removes the
conditional complexity", with no count.
**Why it's wrong:** naming the smell is not a cost count; unwarranted patterns add
more structure than they remove (e.g. 4 type codes -> Replace Conditional with
Polymorphism adds 4 classes, removes 0 duplication sites).
**Do this instead:** emit one `APPLY: removes ... > adds ...` or
`DECLINE: adds ... >= removes ...` line and keep the simplest form on DECLINE
(`lz-refactor/SKILL.md:63`).

### Editing working code on a QUESTION

**What happens:** performing the refactoring when the developer only asked "what
would you do here?".
**Why it's wrong:** unrequested changes to working code are unwelcome; coach mode
must show, not drive.
**Do this instead:** present the named refactoring and smallest next step; only act
on an explicit COMMAND (`lz-refactor/SKILL.md:114`).

### Inlining a copyrighted definition into a leaf

**What happens:** pasting a book's wording, headings, or example code into a leaf.
**Why it's wrong:** it leaks copyrighted expression into the public repo (DST-04).
**Do this instead:** author from the oracle agents' own-words facts and gate the
draft through `oracle-reviewer` before committing.

## Error Handling

**Strategy:** advisory guardrails, not exceptions. The skills encode pause-and-ask
gates and revert-on-red rules rather than throwing.

**Patterns:**
- Blast-radius guard: if a change alters an exported/public-API symbol whose
  consumers are not covered by local tests, pause and ask before applying
  (`lz-refactor/SKILL.md:82`).
- No-tests gate: route to `references/refactoring-without-tests.md` to add
  characterization tests before refactoring untested code (`SKILL.md:79`).
- Revert-on-red: in a sweep, if a step turns tests red, revert and take a smaller
  step; halt if green cannot be restored (`SKILL.md:136`).
- Impasse backtrack (lz-tpp): when only a low-priority transformation fits, pose a
  simpler test or look for a structure-only refactoring first (`lz-tpp/SKILL.md:57`).

## Cross-Cutting Concerns

**Logging:** Not applicable to the shipped product. Eval harness scripts under
`.claude/skills/*-workspace/tools/` emit their own run output.

**Validation:** `claude plugin validate .` (marketplace/plugin/skill frontmatter);
the `check-*.mjs` scripts under `.claude/skills/lz-refactor-workspace/tools/`
validate catalog structure, selector mirroring, and hygiene during authoring.

**Authentication:** Not applicable.

**Content integrity:** the clean-room oracle gate (agents + `.oracle/` + DST-04
rule) is the load-bearing cross-cutting concern in place of the usual
security/auth layer.

---

*Architecture analysis: 2026-07-17*
