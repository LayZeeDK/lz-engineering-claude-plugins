# Quick Task 260729-lc9: Scope the test-double taxonomy to lz-red only and harden the table instrument - Context

**Gathered:** 2026-07-29
**Status:** Ready for planning
**Owner shorthand for this task:** "Resolve all 8 steps"

> AUTHORITY NOTE, READ FIRST. This document is the authority the planner, plan-checker and
> executor validate against. A recorded BLOCKING anti-pattern in this work stream is that gates
> check conformance to the authority and never its completeness -- a requirement present in the
> task brief but omitted from CONTEXT.md survived three gates unseen. This file was therefore
> written by enumerating every owner instruction in the originating session and diffing the result
> against them before dispatch. If you find an instruction in the session that is not below, the
> omission is the defect.

<domain>
## Task Boundary

Eight steps, all zero-spend, all on branch `gsd/lz-tdd-0.0.3-lz-red`:

1. **Fix content blocker C-B1** -- a qualifier the taxonomy marks NOT OPTIONAL is attributed to
   Beck surfaces that do not carry it.
2. **Build a general markdown table-shape guard** -- every row of every pipe table, header
   included, must have the same cell count. Replaces the narrower row-count repair.
3. **Fix three correctness errors** in lz-red references (a mislabelled Test Spy, six headings,
   one attribution).
4. **Move one copy of the taxonomy to `.planning/`, verbatim**, as an inert record.
5. **Delete all three shipped copies**, replacing the two sibling router blocks with one inline
   sentence each.
6. **Sweep the surviving text** for claims about the shipped tree that step 5 makes false.
7. **Re-scope the checker battery** to match.
8. **Record the forward constraint** for the next milestone.

### Explicitly OUT of scope

- **Authoring the runtime intent-disambiguation artifact, and its A/B eval.** That is "step 9",
  deliberately excluded. It requires a separate, freshly-approved metered run.
- **Any metered `claude -p` run.** This task is zero-spend. The standing project rule is that
  eval runs need explicit user approval; none has been given for this task.
- **The EVL-03 ~$39 three-arm apply round.** Still pending, independently blocks the milestone,
  and the owner did NOT elect to descope it when offered.
- **Anything in lz-refactor addressing overloaded "refactor" / "refactoring".** See D-09.
- **Investigating or proving HOW a plugin-wide shared reference works.** See D-10.

</domain>

<decisions>
## Implementation Decisions

All of these are LOCKED by the owner in the originating session. Do not revisit or re-litigate.

### D-01: The taxonomy is used by lz-red ONLY (owner, verbatim re-assertion of a standing rule)

> "I explicitly stated that our test double taxonomy should only be used by lz-red initially, not
> by lz-refactor or lz-tpp."

This was violated at the artifact's introduction (commit `ef7d12f`, subject line "three copies")
and survived three acceptance reviews because the constraint lived in the owner's instruction and
not in the CONTEXT.md the reviewers were briefed from.

### D-02: No byte-identical copies, ever again (owner, verbatim)

> "I don't want byte-identical test double taxonomy references in a future milestone. In this
> milestone, only lz-red uses it. In a future milestone, the reference must be placed as a
> plugin-wide shared reference."

Consequence for step 7: the sha256 byte-identity gate is **deleted outright, not narrowed and not
archived**. Two independent reasons, both binding:
- Narrowing it to one copy makes it VACUOUS -- its predicate is `digests.every(d => d ===
  digests[0])`, which a one-element array satisfies unconditionally. That reproduces the
  guard-that-cannot-fail class the checker's own header condemns.
- The mechanism it guards is now permanently retired, so preserving it preserves a forbidden shape.

What must NOT be lost is the *reason*. `check-red-references.mjs:35-37` currently documents
triplication as deliberate design ("ships as three copies ... one per skill because a bundled
reference is scoped to its own skill directory"). That comment is the seed of the defect and must
be REPLACED with the forward constraint, not merely deleted.

### D-03: The 522-line document's how-and-why leaves the shipped tree (owner, verbatim)

> "The test double taxonomy carries a lot of explanations about how and why it was created. Too
> much cost for a skill to load. It should be focused on what the lz-red skill needs. ... The how
> and most of the why belongs in .planning/, not a skill reference."

Note the diagnosis names a specific cost driver -- process and provenance narration -- not length
in the abstract. "Most of the why" is asymmetric on purpose: all of the how goes; the operational
why (why bare `stub` is forbidden) stays wherever the rule stays.

### D-04: The map is an INERT RECORD, never an agent input

Owner selected "Inert record, not an agent input", with the clarifying note:

> "I meant the map should be used to communicate with and understand the oracle's sources."

So its job is to help a HUMAN or the ORCHESTRATOR understand what is in the oracle's sources and
frame questions to the oracle. It is **never** wired into `oracle.md` or `oracle-reviewer.md` as an
input, and no agent definition may be edited to reference it.

Measured basis: `git grep -ln "test-double-taxonomy" -- .claude/agents/` returns nothing today, and
both agents are `tools: Read, Glob`. Wiring it in would be a new data path, not a preserved one.

The `.planning/` copy MUST carry a header stating it failed three acceptance gates and what remains
open in it, so no future reader mistakes it for settled.

### D-05: "Ubiquitous taxonomy" is the NARROW reading, plus the real correctness errors

Owner selected "Narrow -- plus the real errors".

Measured basis: the taxonomy settles exactly ONE usage rule -- `:208`, never bare `stub`, qualify by
side. Section 2 is a CITATION rule ("Read this section before citing anything below ... cite
MESZAROS"), not a vocabulary rule. The one usage rule is already machine-enforced by the `[wev G17]`
gate and measures ZERO violations across the shipped tree.

So: **settle no new vocabulary. Add no vocabulary guards.** Do fix these three correctness defects,
which are wrong regardless of any vocabulary question:
- `testing-stance/message-matrix.md:131-138` demonstrates a **Test Spy** (records calls, test
  inspects them afterwards, per taxonomy row `:258`) but the section is headed "Mock rule" and the
  prose calls it "the one warranted double". Taxonomy `:259` reserves Mock Object for a double that
  *carries the expectation itself*.
- Six `Mock rule:` headings whose bodies say "double" -- `message-matrix.md:38,47,57,67` and
  `functional-core.md:42,44`.
- The `mockist` attribution at `anti-patterns.md:123` and the mirrored row
  `principle-backing.md:52`. Taxonomy `:251` records `classicist`/`mockist` as Fowler's OWN
  contribution; the current wording reads as crediting GOOS. **Recorded strength: PLAUSIBLE, not
  CONFIRMED** -- read strictly the clause names the school's proponents, not its namers, which is
  defensible. Clarify it; do not describe it as a fabrication.

### D-06: Authoritative names stay verbatim; test-double words use the house term (owner, verbatim)

> "Of course, lz-red and the rest of lz-tdd should use the pattern/smell/refactoring names exactly
> as the authoritative sources do but the test double taxonomy should be used outside of that for
> clarity."

Precedence rule: a term naming a catalogued pattern, smell or refactoring (GoF, Fowler, Kerievsky,
Meszaros' smell catalog) is reproduced exactly. For the collaborator-side double kinds there is no
conflict, because the house term IS the catalog name -- the taxonomy selects Meszaros as the frame
for that cell set. The only cell with no catalog name is the production side, where the house rule
supplies "production-side stub".

Do NOT "correct" an authoritative pattern name into house vocabulary. Do NOT touch:
`vi.fn` / `vi.spyOn` / `vi.mock` (framework API names, already declared plain facts at
`vitest-typescript-mechanics.md:15`), "over-mocking" (Cooper's named anti-pattern), "mockist"
(Fowler's own term), "doubles as documentation" and "double duty" (English homographs), and "One
skeleton" at `test-structure-and-assertions.md:24,28` (a structural sense the taxonomy explicitly
licenses at `:343`).

### D-07: Fix C-B1 now, regardless of everything else (owner-selected)

`test-double-taxonomy.md:285-287` sources the Beck side of a live conflict to "the report and essays
cited in his rows above" -- rows `:235`-`:238`, which give a 1994 report plus essays from 2007-2010,
Feb 2022, Aug 2008 and Jan 2022. The Beck surface that actually carries that position is named
correctly at `principle-backing.md:67` and `:85` and at
`lz-refactor/references/beck-tdd-by-example.md:26` and `:83`. The dependents are right and the map
is wrong. Two qualifiers the document marks NOT OPTIONAL hang off the wrong work.

### D-08: The general table-shape guard replaces the narrow row-count repair (owner-proposed)

Owner proposed it directly:

> "how about a guard that verifies that Markdown tables has the same amount of cells in every row,
> including the header?"

Adopted. Rationale and measurements are in RESEARCH; the short version is that the narrow repair
protects one table in a file that step 5 removes from the shipped tree, whereas the general guard
protects the ~30 tables that stay, and it drops the narrow form's single-table-shape assumption.

The deleted hard rule (see D-11) and the marker-cell idea are settled: an explicit not-applicable
marker already exists at `:252` and is already enforced by `noEmptyDataCell`; it is orthogonal to
this defect, because deleting a cell deletes its marker along with it.

### D-09: The lz-refactor "refactor is overloaded" parallel is an OBSERVATION, not a work order

Owner named it; five independent consultants agreed it is not actionable now, and the unprimed one
rated acting on it the single most likely misreading of the owner's text -- because it appears in
the same paragraph that forbids the taxonomy in lz-refactor. **Log it as a future candidate.
Change nothing in lz-refactor beyond the deletions D-01 requires.**

### D-10: Do not investigate the shared-reference mechanism (owner, verbatim)

> "I know a plugin-wide reference is possible and supported but we don't need to investigate or
> prove *how* now."

Step 8 records the constraint. It does NOT spike, prototype, or validate the mechanism.

### D-11: The deleted absence rule is reinstated in the `.planning/` copy

The rule, before its deletion this round, read: the document states only what POPULATES each cell,
"never about the literature at large and **never about what some author does or does not name**."
The struck clause was cut, and the claim it would have caught survived at `:106` -- "He does not
name that artifact" -- which is the entire warrant for section 2's ruling that Meszaros is not the
authority for the production side.

Nobody can verify a whole-book negative here: the oracle agent has no search tool and the
orchestrator is firewalled from the sources. Reinstating the clause and scoping `:106` to what was
actually read is part of step 4, which the owner approved by instructing "Resolve all 8 steps"
after the step list was presented with that wording.

### D-12: The runtime artifact's fate is already ruled -- "distinguish, but PROVE IT FIRST"

Owner selected "Distinguish, but prove it first" when asked whether lz-red should distinguish Mock
Object from Test Stub from its own shipped reference, or simply ask which the developer means.

That ruling is recorded here so a future reader does not mistake the artifact's absence for an
oversight. It means: the artifact is to be authored, then A/B'd against the no-artifact baseline
using at least two genuinely ambiguous prompts, and shipped ONLY on a measured lift. It is NOT
abandoned and it is NOT approved for shipping.

**Why it is out of scope for this task:** the A/B needs a metered run and the owner scoped this
task to the eight zero-spend steps. Two supporting measurements the owner weighed: zero of the 59
prompts in lz-red's existing eval corpora are genuinely ambiguous, so nothing today would detect
whether the artifact works; and this project's own record is five consecutive passive-content
probes that all measured NULL, with the only positive lever being an ACTIVE forcing-function step.

**Consequence for step 5 that the executor must understand:** after this task, lz-red ships NO
test-double reference -- only the never-bare-`stub` rule, inline. That end state is not a
regression to be quietly patched. It IS the no-artifact baseline arm of the future A/B, and it must
be left standing.

### Claude's Discretion

- Exact wording of the replacement inline sentences in `lz-tpp/SKILL.md` and
  `lz-refactor/SKILL.md`, subject to the constraints below.
- Exact file name and location of the `.planning/` destination.
- Implementation shape of the table-shape guard (which `lib/` module, fixture layout).
- Which of the ~14 retained guards retarget to the `.planning/` copy versus retire.

</decisions>

<specifics>
## Specific Ideas and measured facts the plan must respect

All measured this session against the live tree. Do not re-derive; do verify if a number is
load-bearing for a decision you are about to make.

### The artifact

- `test-double-taxonomy.md` is 522 lines / 48,751 bytes, byte-identical in three places:
  `lz-red/references/`, `lz-refactor/references/`, `lz-tpp/references/`.
- Linked from `lz-red/SKILL.md:159`, `lz-refactor/SKILL.md:186` (a full H2 section at `:182-186`),
  `lz-tpp/SKILL.md:96` (a bullet at `:92-96`), and `principle-backing.md:71` and `:99`.
- Section layout: lead+TOC 1-24, S1 three axes 25-83, S2 authority rule 84-168, S3 headline finding
  169-216, S4 per-author table (34 data rows x 9 columns) 217-297, S5 naming + collision survey
  298-359, S6 caveats 360-443, Sources 444-522.
- **It is NOT in the coach decision procedure.** `lz-red/SKILL.md:52-100` routes steps 2-5 to
  `three-laws-and-test-selection.md`, `testing-stance/README.md`,
  `test-structure-and-assertions.md` and `vitest-typescript-mechanics.md`. The taxonomy appears
  only in the appendix reference list.

### The instrument

- Battery: `node .claude/skills/lz-red-workspace/tools/check-red-references.mjs`, currently 175
  checks, exit 0. Roster pin `EXPECTED_CHECKS = 174`.
- **60 of the 175 checks are taxonomy-coupled**: 29 topic-present, 14 absent-needle, 1 scaffold,
  1 byte-identity, 2 row-scoped, 9 count-derivation, 1 chronology phrase, 1 tree-scope (G17),
  1 dependent cross-link, 1 roster.
- **Deleting only the two sibling copies fails exactly ONE check** (the sha256 gate). Every other
  taxonomy guard reads the lz-red copy only.
- **Deleting all three makes 43 checks vanish SILENTLY** -- the FILES loop skips a missing file, so
  only 15 fail loud. Retirements MUST be recorded by name in `RETIRED_LABELS`, or a deliberate
  retirement and an accidental drop are the same green run.
- **G17's scope is unchanged by the deletion** -- 10 / 3 / 177 files scanned before and after. It
  never scanned the taxonomy copies. Only `TAXONOMY_BASENAME` (`:691`) needs attention.
- **No link-resolution guard exists anywhere in the battery.** Deleting copies currently leaves
  dead links shipping at full GREEN. This class is created by this change.
- `lz-tpp/SKILL.md:93` and `:95` are the **ONLY** occurrences of `stub` or `production-side`
  anywhere in the lz-tpp tree. Removing that bullet without an inline replacement strips the naming
  rule from the skill that fills the empty symbol.
- `test-double-taxonomy.md:211-215` asserts the gate covers "all three skills' reference trees and
  all three routers, exempting the three copies of this document". The acceptance review certified
  that sentence TRUE. Step 5 makes it FALSE. Step 6 exists to catch exactly this.
- `test-double-taxonomy.md:289` is a relative `[principle-backing.md](principle-backing.md)` link.
  It already dead-ends in two of three copies; in `.planning/` it dead-ends always. The two
  NOT-OPTIONAL qualifiers are declared "stated in full" behind it.

### Table-shape guard -- baseline and evasion proof, both measured

Baseline across the three shipped skill trees: **31 tables, 405 pipe rows, 0 ragged, 0 escaped
pipes (`\|`), 0 pipe-leading lines inside code fences, 0 tables written without a leading pipe.**
The guard therefore starts GREEN, which under this repo's two-proof-kinds rule means its proof is a
FIXTURE SET, not a baseline failure. Do not demand a RED baseline for it.

Evasion proof, verified in memory against the live document (`impostor` row, line 237):

| mutation | shape guard | note |
|---|---|---|
| unmodified | ok | no false positive |
| blank the cell, KEEP the pipe | ok | correctly silent -- `noEmptyDataCell` owns this one |
| delete the cell AND its pipe | **FAIL** | `table at line 233: header is 9 wide, but 1 row(s) differ -- line 237 is 8` |

The two guards partition the problem: `noEmptyDataCell` catches content emptiness, the shape guard
catches structural raggedness. The two mutations render identically in GFM and neither guard alone
sees both. Keep fence-awareness in the implementation even though nothing needs it today -- this
repo has a recorded lesson about fence-blind scanners mangling headings.

Scope the guard to the shipped tree AND the `.planning/` copy.

> SUPERSEDED 2026-07-30 by OD-X0I-1, quick task `260729-x0i`. The instruction on the line ABOVE is
> preserved verbatim as a record of what was locked at the time; it is **not a live instruction** and
> must not be acted on. REASON: scoping the guard to the archived `.planning/` copy made a shipped-skill gate
> fail CLOSED on a planning artifact that a milestone close relocates. Both halves of that are measured,
> not predicted -- with the archived copy moved aside the pre-fix battery exited 1 with
> `[FAIL] [lc9] no ragged pipe table -- 1 problem(s): .planning\research\test-double-taxonomy.md:
> UNREADABLE (ENOENT)`, and `.planning/milestones/lz-tdd@0.0.1-research/` already exists on disk as the
> relocation precedent. The same three reasons were ALREADY recorded in `check-red-references.mjs` at the
> retirement note above `TWO_IG_GUARDS`, which this instruction contradicted -- the gate's own source
> argued against pointing shipped-skill guards at that archive while its code did exactly that.
> The ragged-table gate now walks the shipped tree ONLY; the archive left its SCOPE rather than being
> conditionally skipped. Trail forward: `.planning/quick/260729-x0i-fix-the-archive-header-and-instrument-ho/260729-x0i-PLAN.md`
> and `260729-x0i-RED-EVIDENCE.md` in that same directory.

</specifics>

<canonical_refs>
## Canonical References

- `.planning/quick/260729-2ig-remediate-the-test-double-taxonomy-after/260729-2ig-ACCEPTANCE-REVIEW.md`
  -- the three-reviewer verdict that stopped the prior loop. C-B1 and C-B2 are defined there.
- `.planning/.continue-here.md` -- the BLOCKING constraints list. Every item was discovered through
  an actual failure. Read it before dispatching anything.
- `.planning/HANDOFF.json` -- structured prior state.
- `AGENTS.md` -- public-repo hygiene, allowlist-inversion.
- `CLAUDE.md` -- ASCII-only output, `git grep`/`rg` never `grep`, GSD workflow rules.

</canonical_refs>

<constraints>
## Hard constraints

- **NEVER read anything under `.oracle/`**, including index files. Copyright firewall. `ls`/`find`
  for existence only. Only the `oracle` agent reads it.
- **ASCII only** in every file and every message. No emojis, no em dashes, no curly quotes, no
  ellipsis character, no box-drawing.
- **Public-repo hygiene.** Verify by allowlist-inversion -- assert the only email-shaped token
  present is the approved public gmail. Never write a forbidden value as a search needle.
- **Search with `git grep` (tracked) or `rg` (untracked/ignored). Never plain `grep`.**
- **Zero spend.** No `claude -p`, no metered runs, no evals.
- **Prove every new guard can fail.** Two accepted proof kinds and only two: RED-at-baseline with a
  `file:line`, or invariant-GREEN with a fixture set. Do not demand both of one guard.
- **Chain verification commands with `&&`, not `;`.** A recorded failure in this work stream is two
  plan verify blocks that exited 0 with the task entirely undone, because `;` let only the last
  command set the status. Assert every leg.
- **A green battery is not acceptance.** This document has gone fully green over a blocking defect
  three times.

## Exit gates -- all must hold

- `node .claude/skills/lz-red-workspace/tools/check-red-references.mjs` exits 0.
- `node .claude/skills/lz-red-workspace/tools/row-guards.selftest.mjs` exits 0.
- The new table-shape guard's fixture selftest exits 0 and demonstrably FAILS on the pipe-deletion
  fixture.
- `claude plugin validate .` passes.
- No dead relative links in any shipped `SKILL.md` or reference.
- `git status` clean; no stray worktrees or branches.

</constraints>
