# Phase 10: Distribution & Hygiene - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md -- this log preserves the alternatives considered.

**Date:** 2026-07-09
**Phase:** 10-Distribution & Hygiene
**Mode:** `--analyze --auto` (trade-off table per gray area; recommended option
auto-selected; operator requested a PAUSE before plan-phase, so no auto-advance ran)
**Areas discussed:** DST-04 no-verbatim scan mechanism, DST-04 scan breadth, README
depth, manifest metadata scope, hygiene-gate coverage, review gates and findings
triage, CHANGELOG shape and release mechanics

---

## GA-1: DST-04 no-verbatim scan mechanism

The binding constraint: 178 Markdown leaves in the shipped `lz-refactor` tree, three
copyrighted books in the git-ignored `.oracle/`, and a clean-room rule that the main
authoring context must NEVER read book prose. Any fresh draft-vs-source comparison is
therefore forced through the read-only `oracle-reviewer` subagent.

| Option | Description | Selected |
|--------|-------------|----------|
| A. Attestation-only | Cite the per-leaf `oracle-reviewer` verdicts from Phases 7 / 8 / 8.1 and run the existing `check-hygiene` WARN heuristic. Cheapest. Circular: `check-hygiene.mjs:8` names "the Phase-10 hygiene scan" as the authoritative gate, so Phase 10 cannot defer back to the checker. | |
| B. Full fresh oracle sweep | Re-run `oracle-reviewer` over all 178 leaves against the three books. Maximum assurance; each leaf is a chunked full-chapter read. Cost is prohibitive and largely re-derives verdicts already on file. | |
| C. Layered: hardened detector + risk-targeted oracle sweep + recorded attestation | Promote and widen `check-hygiene`'s no-verbatim heuristic to a hard gate (source-free, main-context safe); run `oracle-reviewer` DST-04-only over a risk-ranked subset; cite the on-file per-leaf verdicts for the remainder. | (rec) |

**Auto-selection:** C -- recommended.
**Rationale:** A is self-referential and B is unaffordable, so the only defensible
design is layered. Layer 2's mechanism is *forced* by the clean-room model rather than
chosen, which is why confidence in the mechanism is high. Recorded as D-01/D-02.

---

## GA-2: DST-04 scan breadth (the risk-ranked subset)

Split out of GA-1 deliberately. Impact is HIGH (verbatim copyrighted prose in a public
repo's git history is expensive to reverse -- memory
`lz-plugins-phase1-workemail-git-history-exposure` records a `git filter-repo` +
force-push for a comparable leak). Confidence is only MEDIUM: no prior artifact settles
which surfaces a final sweep must cover.

| Option | Description | Selected |
|--------|-------------|----------|
| a. Surface-scoped, all leaves | Sweep every `## Intent` line (29 leaves) and every mechanics step list, but only those surfaces. Widest coverage of both proved collision surfaces; highest oracle cost. | (x) |
| b. Surface-scoped, GoF + extra only | 29 leaves; the one surface with a proved, reviewer-confirmed near-verbatim trap. Cheapest defensible option; leaves Fowler/Kerievsky mechanics on Phase-7/8 attestation alone. | |
| c. Detector-first | Run the hardened source-free detector across all 178 leaves, then send its hits plus all 29 `## Intent` lines to `oracle-reviewer`. Data-driven; oracle cost unknown until the detector runs. | |

**Auto-selection:** NONE -- deliberately left OPEN by the `--auto` pass.
**Operator's choice (2026-07-09, at the pre-plan-phase pause):** (a) both proven
surfaces, all leaves, surface-scoped, batched by chapter.

**Notes:** This is the high-impact + not-high-confidence trap quadrant that `--auto` is
documented to mishandle (`CLAUDE.md`, "`--auto` can silently lock a bad choice"). The
operator's requested pause before plan-phase was the human checkpoint, so the correct
`--auto` behavior was to record the competing options and stop, then escalate. The
operator selected (a). Rationale captured in D-03: the two observed collisions sit on
DIFFERENT surfaces, so (b) would leave the surface where a real accidental collision
was actually caught (`push-down-method` mechanics) resting on attestation alone; and
(c) is illusory economy, because a source-free detector can only flag stylistic proxies
and its hit set collapses back onto (a)'s surface pair. Batching per chapter (as
Phases 7 and 8 already drove `oracle-reviewer`) puts (a) at roughly 15-20 subagent
invocations rather than ~120, so its cost premium over (b) is modest.

**Supporting evidence gathered (feeds D-02 regardless of which breadth wins):**
- Memory `pattern-leaf-intent-near-verbatim-dst04`: canonical one-line pattern Intents
  reproduce near-verbatim even in a blind draft. Proved in Phase 08.1 -- three of four
  reviewers flagged it, one was lenient. Highest-risk surface in the tree.
- Phase 7 (07-09): an ACCIDENTAL verbatim collision on `push-down-method`'s mechanics.
  A blind draft matched the source's short imperative steps; short procedural steps
  have few original phrasings available.
- `gof-catalog/README.md` mirrors each leaf's `## Applicability` first line, so a single
  leaf's collision propagates into two files.

---

## GA-3: README depth for lz-refactor

| Option | Description | Selected |
|--------|-------------|----------|
| A. Minimal | One paragraph plus the `/lz-tdd:lz-refactor` invocation. Smallest surface; undersells a six-catalog skill and breaks symmetry with the existing `lz-tpp` section. | |
| B. Mirror the lz-tpp shape + a one-line catalog inventory | "What lz-refactor does" (two modes) + brief original primer + book sources by link + pointer into `references/`, plus a factual catalog inventory. Consistent with the page's existing structure. | (rec) |
| C. Expanded capability table | Enumerate all six reference groups with per-group descriptions. Most informative; duplicates `references/` content into the README and invites drift. | |

**Auto-selection:** B -- recommended.
**Rationale:** Phase-4 **D-02** already locked "link the sources, never inline them" for
this exact README, and C violates it. Counts and names are facts rather than protected
expression, so the inventory is DST-04-safe and costs about five lines. DST-04 applies
to the README itself, so the primer must be original prose. Recorded as D-05/D-06/D-07.

---

## GA-4: manifest metadata scope beyond `version`

| Option | Description | Selected |
|--------|-------------|----------|
| A. `version` only | The literal DST-01 reading. Leaves `plugin.json`'s `description` and `keywords` claiming a one-skill plugin. | |
| B. `version` + `plugin.json` `description` + `keywords` | Corrects what a user sees on the installed plugin. Leaves the marketplace listing stale. | |
| C. B + `marketplace.json` `plugins[0].description` | Corrects all three strings that describe the plugin, including the marketplace-listing text. | (rec) |

**Auto-selection:** C -- recommended.
**Rationale:** All three strings currently mis-describe a two-skill plugin. Phase-4
**D-06** classifies factual inaccuracy in shipped metadata as FIX-in-phase, and all
three are one-line edits inside DST-01's blast radius. Explicit non-goal carried from
the project tech-stack constraint: do NOT add `version` to `marketplace.json` --
`plugin.json` silently wins and the validator warns. Recorded as D-08/D-09.

---

## GA-5: hygiene-gate coverage

Discovered during the codebase scout: `check-hygiene.mjs` walks only
`plugins/lz-tdd/skills/lz-refactor/`. The files this phase writes -- `README.md`,
`CHANGELOG.md`, `plugin.json`, `marketplace.json` -- and the entire `lz-tpp` skill are
ungated for both the ASCII and the work-email axes.

| Option | Description | Selected |
|--------|-------------|----------|
| A. Leave as-is | No harness change. DST-02 asserts the work email is absent and output is ASCII-only over files the gate never opens. | |
| B. Widen the walk | Add both skill trees, repo-root `README.md` / `CHANGELOG.md` / `LICENSE`, and both manifests to the target set. | (rec) |

**Auto-selection:** B -- recommended.
**Rationale:** Not scope creep -- DST-02 makes the claim; the gate has to be able to
check it. Widening a gate freezes no contract and is strictly safer, so this is
high-impact and high-confidence rather than a trap-quadrant item. The checker's own
header records that the work-email leak "recurred twice in Phase 4" (the
README-writing phase), and memory `lz-plugins-phase1-workemail-git-history-exposure`
records a third exposure that required rewriting published history. `repoRoot` already
resolves in the checker (`:17`), so this is a target-set change, not a path-model
change. Recorded as D-10/D-11.

---

## GA-6: review gates and findings triage

| Option | Description | Selected |
|--------|-------------|----------|
| A. Reuse Phase 9's `skill-reviewer` PASS | 09-04 already ran it. Zero cost. That PASS predates the README, the version bump, and the manifest edits, and it never covered `lz-tpp`. | |
| B. Phase-4 D-05/D-06 retargeted to the final tree | `validate .` + `--strict` (hard gate), `plugin-validator`, `skill-reviewer` on BOTH skills; triage FIXes structural/security/ASCII/link/factual findings and DEFERs triggering + routing-accuracy findings to Phase 11. | (rec) |

**Auto-selection:** B -- recommended.
**Rationale:** A public ship gate belongs on the tree that ships. `plugin-validator` has
not been run at all this milestone. The Phase-4 triage rule transfers unchanged with
Phase 11 substituted for Phase 5 as the deferral target, which keeps empirical tuning
from being pulled forward into the ship. Recorded as D-12/D-13/D-14.

**Live fact established during discussion (2026-07-09):** `claude plugin validate .`
and `claude plugin validate . --strict` BOTH exit 0 on today's tree. They are
regression gates for this phase, not open risk -- a useful de-risking of DST-02.

---

## GA-7: CHANGELOG shape and release mechanics

| Option | Description | Selected |
|--------|-------------|----------|
| A. Entry only; tag and Release deferred | `## [lz-tdd@0.0.2] - <date>` in Keep a Changelog shape mirroring 0.0.1, with a bottom link-ref to the not-yet-created tag. | (rec) |
| B. Entry + cut the git tag + publish the GitHub Release in-phase | Ships end to end in one phase. Nothing in the roadmap's four Success Criteria asks for it. | |

**Auto-selection:** A -- recommended.
**Rationale:** The 0.0.1 tag and GitHub Release were cut by a separate
`changelog-and-github-release` quick task AFTER Phase 4 closed (STATE.md, Quick Tasks
Completed, 2026-07-04). Following that precedent keeps Phase 10's boundary at the four
Success Criteria. A link-ref pointing at a tag that does not exist yet is exactly what
the 0.0.1 entry did at write time, so it is correct rather than a defect. Recorded as
D-15/D-16.

---

## Claude's Discretion

Deferred to research and planning, inside the locked boundaries (D-17):

- README section ordering, tagline and value-prop wording, whether to include a
  copy-paste usage snippet, and any badges (ASCII, minimal).
- The exact `keywords` list in `plugin.json`.
- CHANGELOG bullet granularity.
- Whether the hardened DST-04 detector extends `check-hygiene.mjs` or lands as a
  sibling checker in the same battery.
- The order the three D-12 review gates run in.

## Deferred Ideas

- Git tag `lz-tdd@0.0.2` + GitHub Release -> separate quick task after Phase 10 closes,
  per the 0.0.1 precedent.
- Skill-effectiveness evals (EVL-01 trigger recall/specificity, EVL-02 coach routing
  accuracy) -> Phase 11, late and non-blocking. Any triggering or routing-accuracy
  finding surfaced by `skill-reviewer` here is recorded and deferred, per D-13.
- Full Beck *Tidy First?* tidyings catalog -> FUT-01 (needs the book for oracle
  verification). The CHANGELOG must not imply it exists.
- Splitting the Kerievsky layer into `lz-refactor-to-patterns` -> FUT-04.
- npm packaging, additional plugins, non-TypeScript example sets -> post-0.0.2, per the
  REQUIREMENTS "Out of Scope" table.

### Reviewed Todos (not folded)

None -- `gsd-sdk query todo.match-phase 10` returned 0 matches.
