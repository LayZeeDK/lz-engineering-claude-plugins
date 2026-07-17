# Codebase Structure

**Analysis Date:** 2026-07-17

## Directory Layout

```
lz-engineering-claude-plugins/
|-- .claude-plugin/
|   '-- marketplace.json              # marketplace catalog; lists lz-tdd + source
|-- plugins/
|   '-- lz-tdd/                       # the only plugin (source: ./plugins/lz-tdd)
|       |-- .claude-plugin/
|       |   '-- plugin.json           # plugin manifest (name, version 0.0.2, keywords)
|       |-- README.md                 # per-plugin docs
|       '-- skills/
|           |-- lz-tpp/               # skill -> /lz-tdd:lz-tpp (green step)
|           |   |-- SKILL.md          # router (82 lines)
|           |   '-- references/       # transformations, worked example, TS/TCO
|           '-- lz-refactor/          # skill -> /lz-tdd:lz-refactor (refactor step)
|               |-- SKILL.md          # router (181 lines)
|               '-- references/
|                   |-- smells.md             # smell taxonomy index
|                   |-- principles.md         # refactoring principles
|                   |-- refactoring-without-tests.md
|                   |-- beck-tdd-by-example.md
|                   |-- beck-tidy-first.md
|                   |-- smells/               # 28 smell leaves
|                   |-- fowler-catalog/       # README + 62 refactoring leaves
|                   |-- kerievsky-catalog/    # README + 30 leaves (incl. walkthroughs)
|                   |-- gof-catalog/          # README + 23 pattern leaves
|                   |-- extra-patterns-catalog/  # README + 5 non-GoF pattern leaves
|                   '-- functional-catalog/   # README + 19 FP idiom leaves
|-- .claude/
|   |-- settings.json                 # OpenGSD coexistence + GSD skill toggles
|   |-- agents/                       # oracle.md, oracle-reviewer.md (clean-room gate)
|   '-- skills/                       # *-workspace/ eval harnesses (dev tooling)
|-- .oracle/                          # gitignored copyrighted source excerpts
|-- .planning/                        # GSD workflow artifacts (phases, codebase, state)
|-- .worktreeinclude                  # copies .oracle/ into new worktrees
|-- AGENTS.md                         # agent-agnostic repo rules (imported by CLAUDE.md)
|-- CLAUDE.md                         # project instructions
|-- README.md                         # marketplace README
|-- CHANGELOG.md
'-- LICENSE                           # MIT
```

## Directory Purposes

**`.claude-plugin/`:**
- Purpose: marketplace-level manifest at the repo root
- Contains: `marketplace.json` only
- Key files: `.claude-plugin/marketplace.json`

**`plugins/lz-tdd/`:**
- Purpose: the shipped plugin; everything under it is distributed on install
- Contains: plugin manifest, README, and the two skills
- Key files: `plugins/lz-tdd/.claude-plugin/plugin.json`

**`plugins/lz-tdd/skills/<skill>/`:**
- Purpose: one skill each; directory name drives the slash command
- Contains: `SKILL.md` router + a `references/` tree
- Key files: `skills/lz-tpp/SKILL.md`, `skills/lz-refactor/SKILL.md`

**`.../lz-refactor/references/<catalog>/`:**
- Purpose: one catalog per knowledge source, each a thin `README.md` index plus
  per-item leaves
- Contains: `README.md` (navigation-only) + `<item>.md` leaves
- Key files: `fowler-catalog/README.md`, `gof-catalog/README.md`,
  `kerievsky-catalog/README.md`, `functional-catalog/README.md`,
  `extra-patterns-catalog/README.md`, `references/smells.md`

**`.claude/agents/`:**
- Purpose: clean-room source-access agents (dev/authoring only, not shipped)
- Contains: `oracle.md`, `oracle-reviewer.md`
- Key files: both

**`.claude/skills/*-workspace/`:**
- Purpose: skill-creator eval workspaces (trigger + applied-output evals, `.mjs`
  check scripts). Partly gitignored: the eval RECORD is tracked; caches and bulky
  raw run outputs are ignored.
- Contains: `evals/`, `tools/check-*.mjs`, `e2e-*/`, `*-RESULTS.md`
- Key files: `.claude/skills/lz-refactor-workspace/tools/check-catalog.mjs`

**`.oracle/`:**
- Purpose: gitignored clean-room excerpts of the source books
- Contains: `design-patterns/`, `refactoring-2e/`, `refactoring-to-patterns/`
- Committed: No (never)

**`.planning/`:**
- Purpose: GSD workflow state and artifacts
- Contains: phases, milestones, `codebase/` (this doc), `STATE.md`
- Committed: Yes (tracked)

## Key File Locations

**Entry Points:**
- `.claude-plugin/marketplace.json`: marketplace catalog read by `/plugin marketplace add`
- `plugins/lz-tdd/skills/lz-tpp/SKILL.md`: green-step skill router
- `plugins/lz-tdd/skills/lz-refactor/SKILL.md`: refactor-step skill router

**Configuration:**
- `plugins/lz-tdd/.claude-plugin/plugin.json`: plugin identity/version/keywords
- `.claude/settings.json`: OpenGSD coexistence, GSD skill toggles, agent deny list
- `.gitignore`: excludes `.oracle/`, `.gsd-opengsd/`, eval run byproducts

**Core Logic (knowledge content):**
- `plugins/lz-tdd/skills/lz-refactor/references/smells.md`: smell taxonomy index
- `plugins/lz-tdd/skills/lz-refactor/references/<catalog>/README.md`: catalog indexes
- `plugins/lz-tdd/skills/lz-refactor/references/<catalog>/<item>.md`: leaves
- `plugins/lz-tdd/skills/lz-tpp/references/transformations.md`: canonical 14-item list

**Testing (evals, dev tooling):**
- `.claude/skills/lz-refactor-workspace/`: refactor skill evals + check scripts
- `.claude/skills/lz-tpp-workspace/`: tpp skill evals

## Naming Conventions

**Files:**
- Skill router: always `SKILL.md` (uppercase), one per skill directory
- Catalog index: always `README.md` inside the catalog directory
- Leaf: kebab-case of the refactoring/smell/pattern/idiom name, e.g.
  `extract-function.md`, `replace-loop-with-pipeline.md`, `long-function.md`
- Kerievsky worked examples: `<refactoring>-walkthrough.md` alongside the leaf
- Eval check scripts: `check-<aspect>.mjs` (Node.js ESM)
- Repo meta-docs: UPPERCASE.md (`README.md`, `CHANGELOG.md`, `AGENTS.md`)

**Directories:**
- Catalog: `<source>-catalog` (e.g. `fowler-catalog`, `gof-catalog`)
- Skill: the bare skill name (`lz-tpp`, `lz-refactor`) since it drives the command
- Eval workspace: `<skill-name>-workspace` under `.claude/skills/`

## Where to Add New Code

**New refactoring / smell / pattern / idiom leaf:**
- Leaf file: `plugins/lz-tdd/skills/lz-refactor/references/<catalog>/<kebab-name>.md`
- Then add ONE row to that catalog's `README.md`, mirroring the leaf's `Use when:`
  selector verbatim (thin-index invariant)
- For a smell, also add a recognize-by row to `references/smells.md`
- Author from oracle-agent facts; gate the draft through `oracle-reviewer` before commit

**New skill in the lz-tdd plugin:**
- Directory: `plugins/lz-tdd/skills/<skill-name>/SKILL.md` (auto-discovered; no
  manifest path change needed)
- Its command becomes `/lz-tdd:<skill-name>` from the directory name
- Bundle deep content under `<skill-name>/references/`, keep `SKILL.md` < 500 lines

**New plugin in the marketplace:**
- Directory: `plugins/<plugin-name>/` with its own `.claude-plugin/plugin.json`
- Add a `plugins[]` entry to `.claude-plugin/marketplace.json` with a relative
  `./plugins/<plugin-name>` source

**New eval:**
- Under the matching `.claude/skills/<skill>-workspace/`; verdicts go in a tracked
  `*-RESULTS.md`, raw run outputs stay gitignored

## Special Directories

**`.oracle/`:**
- Purpose: clean-room copyrighted book excerpts (Fowler, Kerievsky, GoF)
- Generated: No (curated)
- Committed: No (gitignored; copied into worktrees via `.worktreeinclude`)

**`.claude/skills/*-workspace/`:**
- Purpose: skill-creator eval harnesses and check scripts
- Generated: Partly (run outputs are generated and gitignored; eval sets and
  `*-RESULTS.md` records are hand-authored and tracked)
- Committed: Record yes, raw run byproducts no

**`.gsd-opengsd/`, `.gsd-migration-backup/`:**
- Purpose: local OpenGSD runtime and migration backup
- Generated: Yes
- Committed: No (`.gsd-opengsd/` gitignored)

**`.planning/`:**
- Purpose: GSD planning artifacts and this codebase map
- Generated: Partly
- Committed: Yes

---

*Structure analysis: 2026-07-17*
