# Quick Task 260801-sc9: Complete "distinguish, but prove it first" - Research

**Researched:** 2026-08-01
**Domain:** Claude Code plugin loading (`--plugin-dir`), the lz-red eval harness, guard scoping
**Confidence:** HIGH on Q1/Q2/Q4/Q5 (all measured this session); MEDIUM on Q3 (a content
recommendation, not a measurement)
**Spend:** zero. No `claude -p`, no file under `plugins/` touched, no artifact authored.

Every claim below is tagged VERIFIED (a command I ran or a `file:line` I read this session) or
INFERRED (reasoning I did not measure). Two probes were planted and removed; `git status --porcelain`
was clean afterwards apart from this quick task's own directory.

<user_constraints>
## User Constraints (from CONTEXT.md, verbatim)

### Locked Decisions

- **Treatment artifact location -- OUT of the shipped tree.** The artifact MUST NOT be authored into
  `plugins/`. Renaming it to evade N3's stem match is REJECTED.
- **A/B mechanism -- `--plugin-dir` toggle.** Baseline arm = the shipped `plugins/lz-tdd` (no
  artifact). Treatment arm = a copy carrying the artifact. The shipped tree is never mutated.
- **Artifact content -- distil the remediated archived taxonomy** at
  `.planning/research/test-double-taxonomy.md`. Re-deriving from scratch is rejected.
- **Provenance -- DST-04 own-words, re-gated on the shipped form.** The DISTILLED form is a new
  artifact and must be re-gated by `oracle-reviewer` before it is treated as shippable.

### Claude's Discretion

- Exact path and directory shape of the treatment plugin copy, subject to it being outside
  `plugins/` and git-ignored or otherwise not shipped.
- Whether the treatment copy is a full plugin tree or a minimal overlay, provided `--plugin-dir`
  loads it and the CLI's `system/init` advertises `lz-red`.
- Wording of the distilled artifact, subject to DST-04 and the oracle-reviewer gate.

### Out of scope (BLOCKED)

- Step 3, the ambiguous-prompt corpus and its target -- UNRESOLVED-1, owner-gated.
- Step 4, running the A/B -- needs metered approval.
</user_constraints>

## Q1 -- Treatment plugin dir shape

**VERIFIED (`claude --help`):** `--plugin-dir <path>` is documented as "Load a plugin from a
directory or .zip for this session only (repeatable: `--plugin-dir A --plugin-dir B.zip`)". It loads
**one plugin per flag, from a plugin ROOT** -- it is not an overlay mechanism and there is no merge
semantics on offer.

**VERIFIED (`run-e2e.mjs:40`, `:273-277`):** `PLUGIN_DIR = <repo>/plugins/lz-tdd`, pushed for the
`with_skill` and `invoke_skill` arms; `MATTPOCOCK_DIR` for `code_review`. Both resolved dirs carry a
`.claude-plugin/` directory on disk (verified by `ls`). `PLUGIN_DIR` is a plain `const` with **no env
override**, unlike `MATTPOCOCK_DIR` (`:45-47`).

**VERIFIED (`run-e2e.mjs:348-359`, `:285-289`):** the availability signal is the CLI's
`{type:"system",subtype:"init"}` event; the runner scans `ev.skills` + `ev.slash_commands` and
matches each tracked name with a boundary-anchored regex, so an advertised `lz-tdd:lz-red` sets
`skills_available["lz-red"] = true`. RED suites set `trackSkills: ["lz-red","lz-tpp"]`
(`e2e-red-gilded-rose/suite.json`).

**Answer: a full plugin tree, not an overlay.** The minimum is a copy of `plugins/lz-tdd` with
exactly two deltas:

1. `references/test-double-taxonomy.md` added (mirroring the FUT-TAXONOMY-SHARED ship destination).
2. one citation line added to `skills/lz-red/SKILL.md`, in the already-shipped inline-code form --
   `${CLAUDE_PLUGIN_ROOT}/references/<name>.md` -- copied from the live precedent at
   `plugins/lz-tdd/skills/lz-red/SKILL.md:159` (VERIFIED, that is the `beck-tdd-by-example.md`
   citation).

**The plugin `name` must stay `lz-tdd`** (VERIFIED): `suite.json` sets `skillCommand:
"/lz-tdd:lz-red"`, so the `invoke_skill` arm's forced slash command breaks under any other plugin
name, and `${CLAUDE_PLUGIN_ROOT}` resolves per-plugin so the citation only reaches a reference that
lives in the *same* plugin root as the citing skill.

**A second `--plugin-dir` carrying only the reference is REJECTED (INFERRED, high confidence).** It
would be a differently-named plugin, so its `${CLAUDE_PLUGIN_ROOT}` is a different directory and
lz-red's citation cannot reach it -- and it cannot deliver delta 2 at all, since the SKILL.md edit
lives inside `lz-tdd`. Two `--plugin-dir` values both named `lz-tdd` is a name collision, untested.

**VERIFIED size:** `plugins/lz-tdd` is 837K / 195 files, so a physical copy is cheap.

**Lazier alternative worth naming (INFERRED, a preference not a requirement):** do not commit an
837K duplicate. Track only the two deltas (the artifact `.md`, plus the one-line SKILL.md insertion)
and a small build script that copies `plugins/lz-tdd` into an ignored directory and applies them.
The treatment stays reproducible from tracked inputs and git carries ~1 new file instead of 195.

## Q2 -- Where to put it so nothing ships and no guard reddens

**VERIFIED, N3's walk root:** `PLUGINS_DIR = path.join(repoRoot, "plugins")`
(`check-red-references.mjs:598`), walked once by `collectFiles(PLUGINS_DIR)` (`:606`) into
`pluginsAllFiles` / `pluginsMarkdown`. `repoRoot` is `tools -> lz-red-workspace -> skills -> .claude ->
repo root` (`:91`). N3 (`:819-823`), N2 (`:763`), the ragged-table gate (`:704`) and G17 (`:618`) all
consume that one walk. **Every one of them is scoped to `plugins/` and nothing else.**

**MEASURED this session (positive proof, not inference):** planted
`.claude/skills/lz-red-workspace/tmp-n3-probe/test-double-taxonomy.md` and re-ran the battery ->
`[PASS] [lc9] no test-double taxonomy copy in the shipped tree`, 123 checks, exit 0. Probe removed.
So a taxonomy-stem file anywhere outside `plugins/` is invisible to N3 **by measurement**, not by
reading the code.

**VERIFIED, `git check-ignore -v` on candidate paths:**

| candidate | verdict |
|---|---|
| `.claude/skills/lz-red-workspace/treatment-plugin/x.md` | NOT IGNORED |
| `.claude/skills/lz-red-workspace/run-treatment/x.md` | ignored -- `.gitignore:59` `**/run-*/` |
| `.claude/skills/lz-red-workspace/results-treatment/x.md` | ignored -- `.gitignore:58` `**/results*/` |
| `.claude/skills/lz-red-workspace/e2e-red-taxonomy/suite.json` | NOT IGNORED |
| `out/lz-tdd-treatment/x.md` | ignored -- `.gitignore:7` `out/` |
| `dist/x.md` | ignored -- `.gitignore:5` `dist/` |

There is no `.gitignore` anywhere under `.claude/` (VERIFIED by `find`); the root `.gitignore` is the
only one in play.

**VERIFIED, nothing under `.claude/` ships:** `.claude-plugin/marketplace.json` lists exactly one
plugin, `source: "./plugins/lz-tdd"`.

**Recommendation: generate the treatment tree at `out/lz-tdd-treatment/`** -- already ignored with
zero `.gitignore` edits, and **outside `.claude/skills/`**. The second property matters: Claude Code
auto-loads project skills from `.claude/skills/<name>/SKILL.md`, and a generated tree containing a
`SKILL.md` under `.claude/skills/...` is an unverified auto-load risk (INFERRED -- confirming it
needs a live session, i.e. spend). If it were auto-loaded it would contaminate **both** arms and
destroy the A/B, so the cheap move is to not find out. Keep the tracked delta inputs somewhere
sensible under the workspace (a name that is **not** `e2e-red-*` -- see Pitfall 5).

## Q3 -- What the distilled runtime artifact should contain

**VERIFIED structure of `.planning/research/test-double-taxonomy.md`** -- 628 lines / 57,735 bytes:

| lines | section | what it is |
|---|---|---|
| 1-88 | INERT RECORD header | the D-04 header: failed three acceptance gates, what is still open |
| 89-113 | H1 + scope note + TOC | |
| 114-179 | 1. The three axes | 3 axes x binary values, plus a **census list** of the 8 cells |
| 180-268 | 2. The authority rule | authority is per cell; Meszaros is the frame for the collaborator side only |
| 269-320 | 3. Headline finding | owned sources assign the contested word to opposite cells; the hard coach rule |
| 321-403 | 4. Per-author table | 34 data rows x 9 columns (`:339-372`) + false-friend + two live conflicts |
| 404-465 | 5. Production-side naming | "call it a production-side stub"; the withdrawn coinage |
| 466-549 | 6. Caveats that change a citation | |
| 550-628 | Sources | |

**Keep (mid-cycle readable):** the three axes, compressed; the operational rule at `:308-311`
(never bare, qualify by side, and *ask which side the developer means before answering*); the five
Meszaros collaborator-side kinds with a one-line discriminator each; "call it a production-side
stub"; the Cooper `classical` vs Fowler `classicist` false friend (`:380-383`); the per-cell
citation rule in one sentence (cite Meszaros for what separates a Test Spy from a Mock Object;
citing a Fowler taxonomy for that split is the common error).

**Drop:** the entire 88-line inert header; all process/provenance narration (D-03: "all of the how
goes"); the `Defines or uses`, `Source` and `Citability tier` columns (9 -> ~4); the four
remediation rounds' history; the Sources section; section 2's warrant argumentation; the GoF rows
(production-side ancestors, not a mid-cycle decision -- and the highest DST-04 risk, below).
INFERRED target: 60-100 lines.

**Keep the census LIST, do not draw the matrix.** CONTEXT notes the "read mid-cycle" justification
becomes true again. But the reason the archived page gives for omitting the grid is a *different*
and surviving one: section 1's HARD RULE ON EMPTINESS (`:143-149`, restated `:175-178`) -- the
document never asserts a cell is empty, and a grid invites reading an empty box as a claim. That
rule travels with the content, so the census list is the correct runtime form regardless of who
reads it.

**DST-04 near-verbatim risks (VERIFIED by reading the rows).** The
`pattern-leaf-intent-near-verbatim` trap applies directly: the archived `Defining property` column is
one canonical one-liner per row. Highest risk, in order:

- GoF Proxy / Adapter / Template Method hook / Builder / `NullIterator` (`:368-372`) -- canonical GoF
  Intents, the single worst offender class in this repo's record. **Recommend dropping these rows
  from the runtime form entirely** rather than paraphrasing them again.
- The five Meszaros kinds (`:360-364`) plus `Responder` / `Saboteur` (`:365-366`) -- canonical
  catalog one-liners. Re-paraphrase from scratch; do **not** copy the archived column, which was
  written for a different document under a different review.
- Beck's `stub` row (`:339`) and Bernhardt's two-property value criterion (`:351`).

**Hard content constraint the distillation must respect (MEASURED this session, and it is NOT in
REQUIREMENTS).** G17 (`check-red-references.mjs:565-567`, `:628-653`) fires on
`/\b(stub|stubs|stubbed|stubbing)\b/gi` across every markdown file under `plugins/`, excusing a hit
only when immediately preceded by `production-side ` / `collaborator-side ` or by `the word `. I ran
that exact needle against the archived document: **34 occurrences, 31 of them BARE**. Nine of those
lines carry `Test Stub` (10 occurrences including `Temporary Test Stub`), which is a Meszaros catalog
name that D-06 forbids rewording. **A taxonomy artifact therefore cannot be made G17-clean while
keeping the catalog names verbatim.** The archived page predicts this at `:313-319` ("it would fire
on this document if it were ever added back"); this is that prediction measured. Consequence: the
eventual ship needs a **G17 carve-out in addition to the N3 carve-out** that FUT-TAXONOMY-SHARED
already names -- REQUIREMENTS records only the N3 cost. The treatment arm itself is unaffected
(it lives outside `plugins/`), but the artifact should be authored knowing it.

## Q4 -- How the A/B would be graded

**VERIFIED: no existing grader can score a vocabulary or classification choice.**

`grade-red.mjs` (3,682 lines) classifies a produced diff into the 8 D-06 classes -- `genuinely_red`,
`false_green`, `drove_to_green`, `wrong_reason`, `no_tests`, `collection_error`, ... -- and
`pass === (verdict === 'genuinely_red')` (`:11-20`, `:70-77`, `:839`). Nothing in it reads the answer
text, and there is no naming dimension.

**Machinery a future corpus could reuse, and it already exists:**

- `grade-run.mjs` -- deterministic PRE-FILTER over per-scenario `RUBRICS` (`:287`+). Three
  expectation kinds: `{phraseSet}` (negation-aware literal matcher), `{nodrive}` (no mutating tool
  use), and `{judge: "question"}` which emits `passed: null` for an LLM judge. Max 2 judge checks per
  scenario, selfcheck-enforced (`:501-504`).
- `merge-judge.mjs` -- fail-closed merge of `judge-verdicts.json` into a final `grading.json`, plus a
  `--verify <iteration-dir>` pre-aggregate gate that refuses to let an unmerged run be silently
  dropped from the denominator (`:1-36`).

**Smallest honest addition:** one new `RUBRICS` scenario whose only scored dimension is a single
`{judge}` item -- something on the order of "did the answer establish which side of the contested
term the developer means before answering, or name the double kind the test actually needs?" -- plus
its eval-set entry. No new grader, no new merge path, no schema change.

**Do NOT reach for `{phraseSet}` here, and this is the load-bearing warning.** For a
vocabulary/classification A/B the treatment *is* the vocabulary, so a phrase-set matcher scores the
treatment arm high by construction and measures house vocabulary rather than substance. That is the
same defect class as the RXL DESIGN-CONFOUNDED verdict CONTEXT already names. The judge item is the
honest instrument; the phrase set is a confound wearing a determinism costume.

## Q5 -- Pitfalls specific to this change

1. **`check-red-references.mjs` is unaffected -- MEASURED.** Exit 0, 123 checks, both with and
   without a planted out-of-`plugins/` taxonomy file. (The roster line reads 123 checks; the older
   `EXPECTED_CHECKS = 174` figure quoted in the lc9 CONTEXT is stale as of this tree.)

2. **Do NOT re-point the existing `with_skill` arm at the treatment dir via an env override.**
   `selfcheck-red.mjs` crux 1/2 (`checkComposedPrompt`, `:267-330`) hard-asserts, for **every**
   discovered RED suite x **every** prompt x **both** modes, that `with_skill --plugin-dir` matches
   `/[\\/]plugins[\\/]lz-tdd$/` (`:292`) and likewise for `invoke_skill` (`:312`). `dryRun()` spawns
   with **inherited env** (`spawnSync` with no `env` option, `:146-150`), so any shell that exports an
   override turns the selfcheck RED. Add a **new arm name** instead.

3. **A new arm name is safe against crux 1, 2 and 6 -- VERIFIED by reading the assertions.** All
   three only check *presence* of `no_skill` / `with_skill` / `invoke_skill` in the arm map
   (`:278-282`, `:3085-3089`); `Object.keys(arms)` appears only inside failure text, so an extra key
   is not an error. `--arm all` currently expands to exactly those three
   (`run-e2e.mjs:936-941`); adding the treatment arm to `all` is **optional and required by no gate**.
   The laziest wiring is an explicit-only arm that `all` does not include -- then crux 6's
   `--arm all` dry-run is byte-for-byte what it is today.

4. **Crux 6 pins the lz-refactor default byte-for-byte -- do not touch the shared preamble.**
   `selfcheck-red.mjs:117-120` keeps its own copy of `DEFAULT_APPLY_PREAMBLE` as a tripwire against
   `run-e2e.mjs:110-118`, and `checkNxRegression()` (`:3081-3127`) requires the nx suite to compose
   it unchanged and `no_skill`/`with_skill` prompts to stay byte-identical. A new arm must add a
   branch in `buildCmd` only (the `--plugin-dir` selection at `:273-277`) and must leave
   `DEFAULT_PREAMBLE`, `PREAMBLE` and `composePrompt` alone.

5. **`e2e-red-*` is an auto-discovery namespace -- naming a directory that way opts it into the full
   battery.** `discoverRedSuites()` (`selfcheck-red.mjs:210-217`) and `discoverSuiteDirs()`
   (`tabulate-mechanical-red.mjs:319`) both pick up any `e2e-red-*` child with a `suite.json`. If
   UNRESOLVED-1 later resolves to option (A) "new dedicated suite", that suite is instantly subject
   to crux 1/2: it must declare `preambles.apply` byte-identical to the other RED suites
   (`:401-431`), every prompt must name its target's pinned `test_dir` (`:342-347`), the target must
   declare `prompt_forbidden_tokens` (`:358`) and the prompt must name none of them (`:366`), the
   prompt must make no test-state claim (13 `STATE_CLAIM_TOKENS`, `:250-264`), and a **poisoned**
   variant must be provably caught (`:376`). Budget option (A) accordingly -- it is not "a suite.json
   plus a prompt file". Corollary: name the treatment's tracked delta directory anything **except**
   `e2e-red-*`.

6. **The distilled artifact is a new artifact for DST-04 purposes** (CONTEXT, locked) -- the
   `oracle-reviewer` gate must run on the distilled form, not be inherited from the archived source's
   four remediation rounds.

7. **`selfcheck-red.mjs` takes ~7 minutes and was NOT run** (per the task constraint). All crux
   claims above are from reading the source, at the `file:line` cited.

## Assumptions Log

| # | Claim | Section | Risk if wrong |
|---|---|---|---|
| A1 | `--plugin-dir` requires `.claude-plugin/plugin.json` at the named dir (help text says "a plugin", both live dirs have one) | Q1 | A leaner overlay might load; cost is only a slightly larger copy |
| A2 | Two `--plugin-dir` values both named `lz-tdd` collide | Q1 | If they merge cleanly, a 2-file overlay plugin becomes possible -- but delta 2 (the SKILL.md edit) still is not deliverable that way |
| A3 | A `SKILL.md` nested under `.claude/skills/<workspace>/<sub>/skills/<name>/` is NOT auto-loaded as a project skill | Q2 | Would contaminate both arms and void the A/B. Avoided by putting the generated tree at `out/` |
| A4 | 60-100 lines is the right size for the distilled form | Q3 | A content judgement, not a measurement -- the binding constraint is D-03's cost driver (process/provenance narration), not a line count |

## Open Questions

1. **Does the eventual ship need a G17 carve-out?** Measured yes (31 bare hits, 9 lines of
   unrewordable catalog names). REQUIREMENTS' FUT-TAXONOMY-SHARED cost note names only the N3
   carve-out. Recommendation: fold the G17 finding into that entry when the A/B result is known --
   it does not block steps 1-2.
2. **UNRESOLVED-1 (owner-gated, untouched here).** Note only that option (A) carries the crux 1/2
   entry cost enumerated in Pitfall 5, which was not visible when the three options were framed.

## Sources

All primary, all read or run this session:

- `claude --help` (`--plugin-dir`, `--setting-sources`) -- HIGH
- `.claude/skills/lz-refactor-workspace/e2e-nx/run-e2e.mjs:1-130`, `:250-360`, `:920-985` -- HIGH
- `.claude/skills/lz-red-workspace/selfcheck-red.mjs:100-330`, `:3055-3153` -- HIGH
- `.claude/skills/lz-red-workspace/tools/check-red-references.mjs:85-115`, `:560-670`, `:700-880` -- HIGH
- `.claude/skills/lz-red-workspace/grade-red.mjs` (header + verdict classes), `grade-run.mjs:1-45`,
  `:280-300`, `:495-510`, `merge-judge.mjs:1-40` -- HIGH
- `.planning/research/test-double-taxonomy.md` (headings, `:89-418`) -- HIGH
- `.planning/REQUIREMENTS.md:122-147` (FUT-TAXONOMY-SHARED) -- HIGH
- `.gitignore`, `.claude-plugin/marketplace.json`, `plugins/lz-tdd/.claude-plugin/plugin.json`,
  `e2e-red-gilded-rose/suite.json` -- HIGH
- Commands run: `node tools/check-red-references.mjs` (exit 0, 123 checks, twice), `git check-ignore -v`
  on 9 paths, `du`/`find` on `plugins/lz-tdd`, and a scratchpad probe replicating G17's needle against
  the archived taxonomy (34 occurrences / 31 bare / 9 `Test Stub` lines)

**Valid until:** ~30 days, or the next edit to `run-e2e.mjs`, `selfcheck-red.mjs` or
`check-red-references.mjs`.
