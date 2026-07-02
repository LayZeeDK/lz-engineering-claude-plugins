# Requirements: lz-engineering-claude-plugins

**Defined:** 2026-07-02
**Core Value:** `lz-tpp` helps Claude choose the next code transformation by TPP priority during TDD (and explains the premise on demand).

## 0.0.1 Requirements (first milestone)

Requirements for the initial release (version 0.0.1). Each maps to a roadmap phase.

### Marketplace & Plugin (MKT)

- [x] **MKT-01**: Repo root has a valid `.claude-plugin/marketplace.json` named `lz-engineering-claude-plugins` (owner `LayZeeDK`) that lists the `lz-tdd` plugin via a relative `source` of `./plugins/lz-tdd`
- [x] **MKT-02**: `plugins/lz-tdd/.claude-plugin/plugin.json` is valid with `name: lz-tdd`, `version: 0.0.1` (X.Y.Z semver; the first milestone is 0.0.1), description, author, MIT license, and keywords
- [x] **MKT-03**: The repo passes `claude plugin validate .` and the plugin-dev validator with no errors
- [x] **MKT-04**: Layout is extensible -- adding a second skill under `lz-tdd`, or a second plugin, requires no restructuring of existing files
- [x] **MKT-05**: `version` is declared only in `plugin.json` (omitted from the marketplace entry) to avoid the version-masking trap

### lz-tpp Skill Behavior (SKILL)

- [x] **SKILL-01**: `lz-tpp` lives at `plugins/lz-tdd/skills/lz-tpp/SKILL.md` and is invocable as `/lz-tdd:lz-tpp`
- [x] **SKILL-02**: The skill auto-triggers as a coach during red-green-refactor TDD (default frontmatter, not disabled) AND is explicitly invocable as a reference
- [x] **SKILL-03**: Coach behavior -- given a failing test and current code, it recommends the next transformation by TPP priority via a concrete decision procedure, including backtracking / posing a simpler test at an impasse
- [x] **SKILL-04**: Reference behavior -- on demand it explains the transformations and their priority ordering with rationale
- [x] **SKILL-05**: The `description` frontmatter is tuned to trigger on TDD / transformation / TPP contexts without over-triggering, and stays within the field limit (<= 1024 chars)
- [x] **SKILL-06**: `SKILL.md` stays lean via progressive disclosure (body well under the ~500-line / ~1.5-2k-word guidance); heavy material lives in bundled `references/`

### TPP Subject-Matter Content (TPP)

- [x] **TPP-01**: `references/transformations.md` contains the canonical transformation priority list transcribed verbatim-faithfully from the primary sources, with citations
- [x] **TPP-02**: The reference resolves the 12-item vs 14-item discrepancy explicitly (uses the revised FibTPP list as canonical; notes the original list and secondary-source drift)
- [x] **TPP-03**: The NDC 2011 talk (video id `B93QezwTQpI`) is transcribed via the local `youtube-to-markdown` tool (fallback: markitdown) and reconciled against the blog list; the transcript is retained as source material
- [x] **TPP-04**: Content distinguishes transformations (behavior-changing, green) from refactorings (behavior-preserving) and frames TPP as a provisional heuristic, not rigid law
- [x] **TPP-05**: Includes paired TypeScript examples in BOTH functional and imperative styles, demonstrating how transformation-priority choices shift by paradigm (recursion/expressions vs iteration/assignment)
- [x] **TPP-06**: At least one full worked example (e.g. Fibonacci or word-wrap) shows the transformations applied test-by-test in monotonic priority order
- [x] **TPP-07**: JS/TS references address the lack of reliable tail-call optimization in JavaScript engines (only JavaScriptCore/Safari implements ES6 proper tail calls; V8 and SpiderMonkey do not) and cover TCO-alternative patterns for recursion-based transformations -- trampolines, generators-as-state-machines, and Continuation-Passing Style (CPS) -- so functional-style examples stay stack-safe, and clarify when to prefer the iterative transformation instead

### Skill Evaluation (EVAL) -- late / optional-final

- [ ] **EVAL-01**: A skill-creator trigger-eval set validates the `description` fires on in-scope prompts and stays quiet on out-of-scope prompts (optional-final effectiveness check, run late)
- [ ] **EVAL-02**: A skill-creator behavior/effectiveness eval checks the coach recommends correct next transformations on sample scenarios (optional-final, run late)

### Distribution & Hygiene (DIST)

- [x] **DIST-01**: `README.md` documents install via `/plugin marketplace add LayZeeDK/lz-engineering-claude-plugins` then `/plugin install lz-tdd@lz-engineering-claude-plugins`, plus what the skill does and how to invoke it
- [x] **DIST-02**: Repo has an MIT `LICENSE` and public contact `larsbrinknielsen@gmail.com`; the work email appears nowhere
- [x] **DIST-03**: Authoring complies with skill-creator and plugin-dev guidelines (passes skill-reviewer / plugin-validator without significant findings)
- [x] **DIST-04**: A `.gitignore` appropriate to the repo (Node / OS noise) is present

## Later (post-0.0.1)

Deferred to a future release. Tracked, not in the current roadmap.

### Future skills & plugins

- **NEXT-01**: Additional TDD skills under `lz-tdd` (e.g. test naming, triangulation, red-green discipline)
- **NEXT-02**: Additional plugins in the marketplace beyond `lz-tdd`
- **NEXT-03**: npm packaging/distribution of the plugin
- **NEXT-04**: Multi-language example sets beyond TypeScript (e.g. Python, Java)

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| `commands/`, `agents/`, `hooks/`, MCP in `lz-tdd` 0.0.1 | 2026 Claude Code line merged custom commands into skills; a skill alone yields `/lz-tdd:lz-tpp`. Skill-only meets the need. |
| Auto-editing or auto-running the user's code, or reading test-runner output to drive TDD | `lz-tpp` coaches, it does not drive; avoids overreach and keeps it safe/portable |
| `version` field in SKILL.md frontmatter | Not a valid skill frontmatter field in the current format; version belongs in `plugin.json` |
| Automating the physical folder / GitHub repo rename during a live session | Renaming the cwd mid-session breaks tooling; done outside an active session |

## Traceability

Each requirement maps to exactly one phase (see .planning/ROADMAP.md).

| Requirement | Phase | Status |
|-------------|-------|--------|
| MKT-01 | Phase 1 | Complete |
| MKT-02 | Phase 1 | Complete |
| MKT-03 | Phase 1 | Complete |
| MKT-04 | Phase 1 | Complete |
| MKT-05 | Phase 1 | Complete |
| SKILL-01 | Phase 3 | Complete |
| SKILL-02 | Phase 3 | Complete |
| SKILL-03 | Phase 3 | Complete |
| SKILL-04 | Phase 3 | Complete |
| SKILL-05 | Phase 3 | Complete |
| SKILL-06 | Phase 3 | Complete |
| TPP-01 | Phase 2 | Complete |
| TPP-02 | Phase 2 | Complete |
| TPP-03 | Phase 2 | Complete |
| TPP-04 | Phase 2 | Complete |
| TPP-05 | Phase 3 | Complete |
| TPP-06 | Phase 3 | Complete |
| TPP-07 | Phase 3 | Complete |
| EVAL-01 | Phase 5 | Pending |
| EVAL-02 | Phase 5 | Pending |
| DIST-01 | Phase 4 | Complete |
| DIST-02 | Phase 4 | Complete |
| DIST-03 | Phase 4 | Complete |
| DIST-04 | Phase 1 | Complete |

**Coverage:**
- 0.0.1 requirements: 24 total
- Mapped to phases: 24 (100%)
- Unmapped: 0

**Per-phase counts:**
- Phase 1 (Marketplace & Plugin Scaffold): 6 (MKT-01, MKT-02, MKT-03, MKT-04, MKT-05, DIST-04)
- Phase 2 (TPP Source Distillation): 4 (TPP-01, TPP-02, TPP-03, TPP-04)
- Phase 3 (lz-tpp Skill Authoring): 9 (SKILL-01, SKILL-02, SKILL-03, SKILL-04, SKILL-05, SKILL-06, TPP-05, TPP-06, TPP-07)
- Phase 4 (Distribution & Hygiene): 3 (DIST-01, DIST-02, DIST-03)
- Phase 5 (Skill Effectiveness Evals): 2 (EVAL-01, EVAL-02)

---
*Requirements defined: 2026-07-02*
*Last updated: 2026-07-02 after roadmap creation (traceability filled, 24/24 mapped)*
