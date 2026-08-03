# Phase 22: Three-way classifier correctness (lz-refactor + lz-red) - Research

**Researched:** 2026-08-03
**Domain:** Claude Code sibling-skill routing semantics; Markdown-only classifier authoring; deterministic parsed-table guards; 3-arm `--plugin-dir` placement A/B
**Confidence:** HIGH on repo mechanics (all measured this session), MEDIUM on Claude Code loading semantics (official docs, fetched), LOW on decision-table prior art (one source reachable)

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

#### Classifier semantics

- **D-01:** Exhaustiveness is achieved by NAMED-OWNER ENUMERATION, not by a catch-all. No leaf
  skill keeps a bare "otherwise ... is this skill" terminal. Each step 1 becomes positive disjoint
  branches, plus an explicitly named owner for every residual case in the red-green-refactor loop,
  plus one terminal for "this is not an RGR-loop request" that claims nothing and says so. This
  satisfies SC2's literal wording (at most one of the three procedures claims any given request),
  which multiple catch-alls cannot. The smaller patch the unbiased reviewer offered -- making
  `lz-refactor` branch (c) a catch-all -- was already declined by the owner on 2026-08-03 and stays
  declined.
- **D-02:** The two currently-failing requests route as follows. "I just finished making a test
  pass. What now?" -> `lz-refactor`, as a POSITIVE branch (newly green and asking what is next is
  the refactor step's own trigger), never as a fallback. "I want to add a new behavior to this
  module" with nothing failing yet -> `lz-red` first, because Law 1 forbids production code before
  a failing test; `lz-tpp` owns it only once a red test is in play. That two-hop rule is the
  TDD-correct answer and replaces today's dead end where the description names `lz-tpp` and
  `lz-tpp` declines it.
- **D-03:** Single axis = the ask. NO routing or mode-selection branch may key on test state.
  Narrow reading, deliberately: in-procedure preconditions that do not decide ownership stay
  (`lz-tpp` step 1's green-phase sanity check, `lz-red` step 5's fail-for-the-right-reason), but
  are reworded so they cannot be read as ownership decisions. Sites to fix:
  `lz-refactor/SKILL.md:30` (`## Two modes` coach gate, which also contradicts step 5's own
  untested-code branch), `lz-tpp/SKILL.md`'s `## Two modes` coach gate ("the request has a failing
  (red) test plus the current code"), and `lz-refactor/SKILL.md:139`, which cites a step-1 rule
  step 1 does not contain.
- **D-04:** Test code is owned BY THE ASK, not by the file's kind. "Is this a good test / what
  should it assert / how should it be named / what test comes next" -> `lz-red`. "This test file is
  duplicated or messy, tidy it" -> `lz-refactor` (a structure-only ask about code that happens to
  live in a test file). `lz-refactor` branch (c) gains the explicit exclusion; routing on file type
  instead would violate D-03's single axis and would strip a legitimate refactoring case.

#### Scope

- **D-05:** ALL THREE shipped skills are in scope, not the two named in the phase title. SC2's "at
  most one of the three step-1 procedures" and SC3's "any equivalent in lz-red or lz-tpp" cannot be
  met while `lz-tpp` keeps its own catch-all and its test-state coach gate. `lz-tpp` edits stay
  minimal and classifier-only -- its TPP content, ordering, and worked examples are untouched.
- **D-06:** `description` frontmatter IS in scope (owner decision, 2026-08-03). Each description is
  minimally reworded so it names the correct destination -- specifically `lz-refactor`'s
  "or otherwise ADD or CHANGE behavior ... use lz-tpp instead" clause, which is wrong for the
  nothing-failing-yet case per D-02. This satisfies SC5 literally rather than in spirit, and it
  therefore REQUIRES the EVL-01 reciprocal trigger regression round (D-14) plus `/reload-plugins`.
  The owner chose this over the zero-spend body-only option after being shown that it reopens the
  auto-trigger -- the one lever this project has measured to work.
- **D-07:** The cheap same-file fixes the same review found are in scope: step 6's reference router
  gains `refactoring-without-tests.md` and `beck-tidy-first.md`; the QUESTION/COMMAND paragraph
  gets a real heading so `lz-refactor/SKILL.md:81`'s cross-reference resolves. Fix by adding the
  missing anchor, not by deleting the pointer -- the pointer is load-bearing for step 4's
  de-patterning gate.

#### Placement: decided empirically, folded into this phase

- **D-08:** The routing content's PLACEMENT is decided by measurement, not argument. Author it in
  three variants and A/B them: **(A) inline only** -- step 1 branches plus the existing per-skill
  narrative section, no new shipped file; **(B) shared table plus inline rationale** -- a canonical
  `plugins/lz-tdd/references/rgr-routing.md` for the full case-to-owner table and edge cases, with
  each `SKILL.md` keeping its step-1 branches AND a short classify-first rationale inline;
  **(C) shared table replacing the narrative sections** -- the three per-skill narrative sections
  collapse into the one shared table, `SKILL.md` keeps only its short branch list and links out.
  Precedent for the shared form is `plugins/lz-tdd/references/beck-tdd-by-example.md`, already
  plugin-wide and cited via `${CLAUDE_PLUGIN_ROOT}`.
- **D-09:** FOLDED INTO PHASE 22 (owner decision): author all three variants, measure, ship only
  the winner. One edit to the shipped bodies, decided empirically. PR #3 remains held for the full
  author-variants -> gated-run -> writeup cycle. The alternative (ship the fix inline now, A/B in a
  follow-up phase, unblock PR #3 sooner) was presented and NOT taken.
- **D-10:** PRE-REGISTERED NULL TIEBREAK = variant **C** (shared table replacing the narrative
  sections). Rationale is forward-looking: a future `/lz-tdd` entrypoint skill gets ONE normative
  artifact to cite and a legitimate home for the residual owner, instead of arriving as a fourth
  inline copy. **Flagged, and accepted by the owner with the risk stated:** C is the variant that
  moves the classify-first rationale behind a lazy read, and classify-first is one of only two
  scenarios where EVL-02 measured a real edge over baseline Opus. The tiebreak applies only on a
  MEASURED tie on routing correctness; a tie on that metric does not prove parity on
  coaching-quality dimensions. The writeup must say so rather than reading a tie as
  "C is free".
- **D-11:** A TRIGGER eval cannot discriminate the three placement arms. The arms carry
  byte-identical `description` frontmatter by construction, so all three would score identically --
  the vendored `skill-creator-eval` trigger flow is the wrong instrument for D-08. The right
  instrument is an EVL-02-style body/behavior eval: identical prompts, three plugin-tree variants
  toggled via `--plugin-dir` (the EDITED-vs-PREEDIT pattern proven in the prior placement probes),
  deterministic grade -> blind judge -> merge -> verify.
- **D-12:** The A/B metric is ROUTING CORRECTNESS per request: given a request, does the loaded
  skill name the correct owner. Graded on the DESTINATION, never on house vocabulary -- the exact
  grader trap the unbiased reviewer caught in Phase 20 EVL-02, which inflated that headline roughly
  threefold. Corpus = the reviewer's eight traced requests plus the "not an RGR-loop request"
  residual case.
- **D-13:** Two-stage design. Low-k screening across the three arms first; escalate k only if a
  signal appears. Five prior placement / passive-content probes on this project came back null, so a
  null here is a likely and legitimate outcome -- which is why D-10 exists. Report Pass@k and
  Pass^k, run at least one from-scratch unbiased reviewer, and make the substance-only comparison
  the headline.
- **D-14:** BOTH metered rounds are HALT-gated on fresh explicit owner approval at run time -- the
  placement A/B (D-08) and the EVL-01 reciprocal trigger regression that D-06 forces. Build the
  harness, author the variants, and prove every deterministic selfcheck GREEN first; then stop and
  ask. No metered command runs inside this phase's execution without that approval.

#### Guard (SC6)

- **D-15:** The gate DERIVES its verdict from a parsed routing table instead of matching tokens.
  Parse each classifier surface into `(condition -> destination)` pairs and assert three things
  over the case corpus: exhaustive (every case has an owner), at-most-one (no case has two), and
  single-axis (no routing branch keys on test state). Mutation-tested in BOTH directions. This
  closes the ceiling reviewer 1 measured on the TD-02 guard -- a renamed heading alone satisfies a
  bare `/lz-red/` needle -- and follows this project's own recorded lesson to derive verdicts from a
  parsed table rather than patch the third instance of a class.
- **D-16:** New sibling tool `check-rgr-routing.mjs` under
  `.claude/skills/lz-red-workspace/tools/`, wired into that workspace's `npm run check`. A NEW file
  rather than an extension of `check-red-references.mjs`, so that file's documented label-count
  arithmetic (125) and its `NEW_LABELS` roster stay untouched. The existing SEAM-02 and TD-02
  presence guards stay exactly as they are -- they cover the zero-occurrence regression the new
  semantic gate does not replace.
- **D-17:** The new guard's parse target depends on which placement variant wins, so it reads the
  canonical location and FAILS CLOSED if that location is missing. No `existsSync` skip: this
  file's own header names the silent-vacuous-pass hazard, and the TD-02 guard was deliberately built
  ungated for exactly this reason.

#### Validation and review

- **D-18:** A fresh acceptance review runs on all three shipped skills with at least one
  from-scratch UNPRIMED reviewer, per the standing rule that every shipped `SKILL.md` edit is
  subagent-reviewed before acceptance. The ORCHESTRATOR runs this gate -- `gsd-executor` has no
  Agent tool and cannot. This is the third defect class an unprimed review has caught on this repo
  that a contract-scoped gate could not; keep both reviewer kinds.
- **D-19:** Full deterministic battery (both workspaces) plus `claude plugin validate .` exit 0,
  plus hygiene re-run (ASCII-only, email allowlist-inversion, no-verbatim) over the edited tree.
  `/reload-plugins` is required after the description edits land, and the owner must run it --
  committed is not live.

### Claude's Discretion

- Exact branch wording and ordering inside each step 1, provided D-01 through D-04 hold.
- `check-rgr-routing.mjs` internals: parse strategy, case-corpus representation, report labels.
  Must follow the house harness conventions (header block stating invariants and scope, shared
  `report()` accumulator, `SUMMARY:` line, exit 1 on failure / 2 on IO error, node builtins only).
- How the three variants are physically staged for the `--plugin-dir` toggle (three trees, or one
  tree plus scripted placement swaps).
- Whether the A/B writeup lives in the existing `lz-red-workspace/EVAL-RESULTS.md` or a
  phase-scoped sibling.

### Deferred Ideas (OUT OF SCOPE)

- **`/lz-tdd` entrypoint skill** (future milestone) -- a fourth skill acting as the loop's front
  door: it would classify and dispatch to `lz-red` / `lz-tpp` / `lz-refactor` and would be the
  legitimate owner of the residual case that D-01 currently distributes by name. It informs D-10's
  tiebreak but is out of scope here.
- **Description reconciliation as separate tech debt** -- superseded: the owner folded it into this
  phase via D-06.
- **Retiring the TD-02 / SEAM-02 presence guards** once the parsed-table gate exists -- deliberately
  NOT done (D-16). Revisit only after the semantic gate has proven itself across a milestone.
- **FUT-04** (split the Kerievsky layer into its own skill) -- unrelated, still backlogged; note
  only that a fourth skill would join the same classifier and inherit whichever placement wins.
</user_constraints>

<phase_requirements>
## Phase Requirements

CLS-01..CLS-05 do not exist in `.planning/REQUIREMENTS.md` yet. Recommended text below, in the
file's existing `- [ ] **ID**: text` shape, plus Traceability rows. Each maps to a ROADMAP success
criterion so the planner can wire `requirements_completed` per plan.

| ID | Recommended requirement text | Maps to SC | Research support |
|----|------------------------------|-----------|------------------|
| **CLS-01** | The three sibling classifiers are EXHAUSTIVE by named-owner enumeration: every request in the case corpus lands with exactly one named owner, and no leaf skill keeps a bare "otherwise ... is this skill" terminal. Each step 1 carries positive disjoint branches plus a named owner for every residual RGR-loop case plus one terminal for "this is not an RGR-loop request" that claims nothing. | SC1 | Finding 1 (five catch-all sites measured, incl. two outside CONTEXT's scope list); Finding 6 (Law 1 backs the two-hop rule) |
| **CLS-02** | The three classifiers are MUTUALLY EXCLUSIVE: at most one of the three step-1 procedures claims any given request, and the post-green "what now?" case fires a POSITIVE `lz-refactor` branch. Test code is owned by the ask, not by the file's kind ("is this a good test" -> `lz-red`; "this test file is messy, tidy it" -> `lz-refactor`). | SC2, SC4 | Finding 1; Finding 2 (the `beck-tdd-by-example.md` seam section is a two-way-only sixth surface) |
| **CLS-03** | SINGLE AXIS: no routing or mode-selection branch keys on test state; all key on the ask. Covers `lz-refactor/SKILL.md` `## Two modes` (L30), `lz-tpp/SKILL.md` `## Two modes` (L23) and coach step 1 (L54-57), and `lz-refactor/SKILL.md:139`'s citation of a step-1 rule step 1 does not contain. In-procedure preconditions that do not decide ownership survive, reworded so they cannot be read as ownership decisions. | SC3, SC5 | Finding 1; verified line refs in "Surface Inventory" |
| **CLS-04** | GUARDED SEMANTICALLY: `check-rgr-routing.mjs` derives its verdict from a PARSED `(condition -> destination)` table over each classifier surface and asserts exhaustive / at-most-one / no-test-state-key over the case corpus. It fails closed on a missing canonical location (no `existsSync` skip), is wrap-tolerant, is mutation-tested in BOTH directions, and is wired into `lz-red-workspace`'s `npm run check`. `check-red-references.mjs`'s label arithmetic (125) and `NEW_LABELS` roster are untouched. | SC6 | Findings 4, 5, 8; Guard Design section |
| **CLS-05** | PLACEMENT DECIDED EMPIRICALLY: the routing content is authored in three placement variants (A inline / B shared table + inline rationale / C shared table replacing the narrative sections), staged as three `--plugin-dir`-selectable trees, and A/B'd on ROUTING CORRECTNESS over the case corpus with a destination-extraction grader (never a house-vocabulary proxy), Pass@k + Pass^k, >= 1 blind judge and >= 1 from-scratch unbiased reviewer, substance-only headline. Pre-registered null tiebreak: variant C. Both metered rounds (placement A/B and the EVL-01 reciprocal trigger regression) are BUILD-then-HALT, gated on fresh explicit owner approval. | SC8 | Findings 3, 7, 9, 10; A/B Instrument section |
</phase_requirements>

## Summary

The classifier defect is broader than the phase scope currently written, in two directions that
change the plan. First, the catch-all is replicated on **five** routing surfaces, not the three
`SKILL.md` step-1 blocks CONTEXT lists: `lz-red/references/three-laws-and-test-selection.md:126`
carries the same "otherwise ... is lz-red" terminal and says so explicitly ("This is the same
red-vs-green-vs-refactor split the SKILL.md router states"), and
`plugins/lz-tdd/references/beck-tdd-by-example.md` -- the plugin-wide shared file that is D-08's own
precedent for variants B and C -- carries a `## The seam with lz-tpp` section that is a **two-way,
lz-refactor-relative** routing rule ("that is this skill's job", "stay here") in a file cited from
`lz-red/SKILL.md`. Variants B/C add a canonical routing table to the exact directory that already
contains a stale, skill-relative, lz-red-blind copy of the same rule. Fixing three step-1 blocks
while leaving those two shipped surfaces intact would leave the classifier non-exhaustive on the
very reference material the winning variant cites.

Second, both instruments the plan depends on have measured gaps that make a naive build silently
vacuous. `check-hygiene.mjs` scans 197 files but its scope is built from three per-skill trees plus
root prose plus manifests -- so exactly two shipped `.md` files under `plugins/` are outside ALL
THREE hygiene axes, and one of them is `plugins/lz-tdd/references/beck-tdd-by-example.md`. Under
variants B/C the new shared table lands in that unscanned directory, making D-19's hygiene re-run a
vacuous pass on the one new file. And `selfcheck-red.mjs` AUTO-DISCOVERS any `e2e-red-*` sibling
suite and asserts its prompts carry no `STATE_CLAIM_TOKENS` -- but the routing corpus must carry test
state facts by design (D-03 exists because routing must ignore them), so naming the routing suite
`e2e-red-*` would hard-fail the existing selfcheck on a corpus that is correct.

The A/B instrument is real and reusable but is not the one CONTEXT names. D-11's `--plugin-dir` arm
toggle lives ONLY in `.claude/skills/lz-refactor-workspace/e2e-nx/run-e2e.mjs`, which already carries
six arms including two generated-tree arms (`invoke_treatment`, `invoke_forcing`) built by
`.claude/skills/lz-red-workspace/treatment/build-treatment.mjs`. Phase 20's EVL-02 used a completely
different mechanism (in-session orchestrator subagent fan-out, no `--plugin-dir`). The smallest
correct build is: `run-e2e.mjs` in `recommend` mode, driven at a new suite via `--suite`, with one
new arm-group token and three new `--plugin-dir` constants, fed by a variant builder modelled on
`build-treatment.mjs` and graded by a NEW destination-extraction grader.

**Primary recommendation:** treat the phase as SIX classifier surfaces, not three; extend
`check-hygiene.mjs`'s scope and stage the routing suite outside the `e2e-red-*` namespace before any
content lands; build the guard as a parsed `(condition -> destination)` table over whitespace-flattened
section bodies; and reuse `run-e2e.mjs --mode recommend` with a `placement` arm-group rather than
inventing a harness.

## Architectural Responsibility Map

Tiers here are authoring/verification layers, not application tiers -- the deliverable is Markdown
plus dev-only Node checkers.

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Request classification (the shipped behavior) | Shipped Markdown (`SKILL.md` frontmatter + body) | Shipped shared reference (variants B/C) | Only the description is always in context; only the invoked body is guaranteed loaded. Routing that decides ownership must live where it is guaranteed present. |
| Auto-trigger / which skill loads at all | `description` frontmatter ONLY | -- | The listing carries name+description only; the body cannot influence which skill fires. D-06 edits this tier, which is why the trigger regression is mandatory. |
| Deep routing rationale / edge-case table | Shipped reference (lazy read) | Shipped body | Reference files are read on demand and this repo has MEASURED zero-retrieval on a cited reference (Finding 3). This is exactly D-10's disclosed risk. |
| Semantic routing invariants (exhaustive / disjoint / single-axis) | `lz-red-workspace/tools/check-rgr-routing.mjs` | `check-red-references.mjs` presence guards (kept, D-16) | A parsed table is the only layer that can hold semantics; presence needles hold the zero-occurrence regression. |
| Hygiene (ASCII / email / no-verbatim) | `lz-refactor-workspace/tools/check-hygiene.mjs` | `check-red-references.mjs` G17 + N2/N3 walks | Hygiene owns the shipped-tree axes; its scope must be widened for variants B/C (Finding 8). |
| Placement measurement | `run-e2e.mjs --mode recommend --suite <routing suite>` | new `build-variants.mjs` + new `grade-routing.mjs` | Arm composition and stream-json meta already exist and are selfchecked. |
| Trigger regression after a description edit | vendored `skill-creator-eval` (`run_eval.py`) + `evals/reciprocal-red.json` | `check-evals.mjs` build-time lint | Trigger accuracy is the only thing that flow measures, and D-11 correctly bars it from the placement A/B. |

## Project Constraints (from CLAUDE.md / AGENTS.md)

Directives with the same authority as locked decisions. The planner must verify compliance.

| Constraint | Consequence for this phase |
|-----------|---------------------------|
| **ASCII-only output** -- no emoji, no Unicode dashes/quotes/ellipsis, anywhere (scripts, prose, comments) | Every authored surface + every new checker's report strings. `check-hygiene.mjs` axis (a) enforces it -- but see Finding 8 for the two files it does not reach. |
| **Never use `grep`; use `git grep` (primary) or `rg` (gitignored/untracked)**; `\| rg` never `\| grep` in pipes | Any plan task naming a search must use `git grep`/`rg`. `git grep` returns silent zero inside gitignored paths (`out/`, `node_modules/`) -- the variant trees live in `out/`, so inspecting them requires `rg`. |
| **Never `git add .` / `-A` / `-u`; stage specific files by name** | Especially load-bearing here: `out/` is gitignored but the per-run capture trees and `.err`/`.json` byproducts under the workspaces are covered by named `.gitignore` lines, and a new suite dir needs its own lines (see Environment Availability). |
| **Never write multi-line content via heredoc/echo; use the Write tool** | All authored Markdown + `.mjs`. |
| **Public-repo email hygiene by ALLOWLIST-INVERSION; never encode the forbidden value as a needle; maintainer-scoped** | `check-hygiene.mjs` already implements the correct shape (`APPROVED_EMAILS` + `EMAIL_RE`). Any new hygiene scope must extend that set, never add a forbidden literal. |
| **No new build dependency in `plugins/lz-tdd`** (Out of Scope table, REQUIREMENTS.md) | Shipped tree stays dependency-free Markdown; every new checker is node-builtins-only under `.claude/skills/*-workspace/`. |
| **Node builtins only, zero deps, no framework, no config file** for harness scripts (CONVENTIONS.md L52) | `check-rgr-routing.mjs`, `build-variants.mjs`, `grade-routing.mjs`. |
| **Every harness script opens with a header block** stating what it checks, scope, and the named failure mode (CONVENTIONS.md L154); `report()` accumulator; `SUMMARY: ... GREEN/RED`; exit 0/1 (2 on IO error) | CONTEXT's Claude's-Discretion clause repeats this; CONVENTIONS.md L114-125 names the three modes: fail-loud, fail-closed, fail-safe/scan-floor. |
| **JS/TS style: blank line around control flow and returns; always brace** | Every new `.mjs`. |
| **`gsd-executor` has no Agent tool** | oracle-reviewer / skill-reviewer / unbiased acceptance review are ORCHESTRATOR steps after the executor returns (D-18). |
| **Eval-run approval gate: never run a metered eval without explicit owner approval** | D-14. BUILD-then-HALT; present commands, never execute. |
| **Windows 11 arm64, Git Bash, `npm`** | Path separators in checker output; `run-e2e.mjs` already resolves a native `claude.exe`. |

## Surface Inventory (verified against HEAD `e01201a`)

Every line number below was read this session. `[VERIFIED: file read]`

### The six classifier surfaces

| # | Surface | Shape today | In CONTEXT scope? |
|---|---------|-------------|-------------------|
| 1 | `lz-refactor/SKILL.md` L3-17 description; L28-35 `## Two modes` (L30 test-state gate); L37-45 narrative; L49-53 step 1 (three positive conditions, no catch-all); L80 dangling prose xref; L115-117 step 6 router; L119-126 unnamed QUESTION/COMMAND paragraph; L139 sweep rule citing a non-existent step-1 rule | positive-only -> can LOSE a request | yes |
| 2 | `lz-red/SKILL.md` L3-15 description; L26-34 `## Two modes`; L36-42 narrative **catch-all L42**; L52-104 coach procedure, **step 1 catch-all L59** | two catch-alls | yes |
| 3 | `lz-tpp/SKILL.md` L3-12 description; L21-28 `## Two modes` (**L23** "the request has a failing (red) test plus the current code"); L36-44 narrative **catch-all L43**; L52-75 coach procedure, **step 1 L54-57** hybrid test-state + ask branch | catch-all + test-state gate | yes |
| 4 | **`lz-red/references/three-laws-and-test-selection.md` L123-129** -- `## The Three Laws spine and classify-first`. Full three-way classify with **catch-all L126**, and L127-129 states it is "the same red-vs-green-vs-refactor split the SKILL.md router states" | catch-all, replicated | **NO -- Finding 1** |
| 5 | **`plugins/lz-tdd/references/beck-tdd-by-example.md` L66-73** -- `## The seam with lz-tpp`. TWO-WAY only (lz-tpp vs lz-refactor); written skill-relative ("that is this skill's job", "stay here"); L3-5 self-describes as "the core of the test-first loop that **lz-refactor** sits inside" -- yet the file is plugin-wide and cited from `lz-red/SKILL.md:159` | two-way, wrong self-reference for lz-red | **NO -- Finding 2** |
| 6 | `lz-red/references/principle-backing.md` L56-69 -- the classify-first / lz-tpp seam BACKING rows, incl. `[Classify-first and the forward lz-tpp handoff](three-laws-and-test-selection.md)`. Not itself a router, but it is the provenance surface that must stay consistent if #4 changes | provenance only | no |

### Measured description lengths and headroom

Folded description length, measured this session `[VERIFIED: computed from frontmatter]`. Per-entry
listing cap is 1,536 chars `[CITED: docs.claude.com/en/docs/claude-code/skills]`.

| Skill | Description chars | Headroom to 1,536 | `SKILL.md` lines (cap 500) |
|-------|-------------------|-------------------|----------------------------|
| `lz-red` | 1,233 | 303 | 167 |
| `lz-tpp` | 750 | 786 | 91 |
| `lz-refactor` | 1,245 | **291** | 185 |

`lz-refactor` is the tightest: D-06's rewording of the "or otherwise ADD or CHANGE behavior ... use
lz-tpp instead" clause into a two-destination form must fit in 291 chars of net growth. Naming a
second destination adds roughly 40-70 chars if phrased tersely, so there is room -- but the budget is
real and the planner should require the measurement as a task assertion, not an assumption.
The repo's project memory records that the old "1024 hard cap" note is NOT enforced and that
~1000-1500 is the load-bearing triggering window; all three descriptions already sit inside it.

## Standard Stack

### Core

| Component | Version / location | Purpose | Why standard |
|-----------|-------------------|---------|--------------|
| Claude Code plugin skills | plugin `0.0.3`, Claude Code 2.1.x line | The shipped classifier lives in `SKILL.md` frontmatter + body | Target platform. `claude plugin validate .` exits 0 on HEAD `[VERIFIED: ran it]` |
| `${CLAUDE_PLUGIN_ROOT}` substitution in skill content | documented | Cites the plugin-wide shared reference from a skill body | Docs table: for "Skill and agent content" placeholders resolve "Anywhere the placeholder appears" `[CITED: docs.claude.com/en/docs/claude-code/plugins-reference#environment-variables]` |
| Node 20+ builtins (`node:fs`, `node:path`, `node:url`, `node:child_process`, `node:crypto`) | in-repo convention | Every checker / builder / grader | CONVENTIONS.md L52: "Node builtins only. Zero dependencies, no framework, no config file." `[VERIFIED: read]` |
| `run-e2e.mjs` | `.claude/skills/lz-refactor-workspace/e2e-nx/run-e2e.mjs`, 1137 lines | The `--plugin-dir` arm-composition driver; `--suite <dir>` retargets it | The ONLY place the arm toggle exists; already drives the lz-red `e2e-red-*` suites cross-workspace `[VERIFIED: read SUITE_DIR resolution at L84-92]` |
| `build-treatment.mjs` | `.claude/skills/lz-red-workspace/treatment/build-treatment.mjs` | Template for generating variant plugin trees into gitignored `out/` | Already builds two variant trees with anchor-based insertion, destination safety, lever tripwires, delta assertions `[VERIFIED: read]` |

### Supporting

| Component | Location | Purpose | When to use |
|-----------|----------|---------|-------------|
| `sectionBody(text, heading)` | `lz-refactor-workspace/tools/lib/section-body.mjs` (20 lines) | Extract a `## ` section body up to the next `## ` or EOF; returns `null` when absent | The natural parse entry for a step-1 / narrative block. **See Finding 5: it is in the WRONG workspace.** |
| `collectH1Lines` | `lz-refactor-workspace/tools/lib/heading-scan.mjs` | H1 slug collection | Only if the routing table gets per-case leaves (it will not) |
| `scanTables`, `findLinkTargets` | `lz-red-workspace/tools/lib/pipe-table.mjs` (294 lines) | Parse pipe tables into cells; classify link targets | **The right primitive for a shared routing TABLE** under variants B/C -- parse cells, do not regex prose |
| `ROW_SCOPED_GUARDS` | `lz-red-workspace/tools/lib/row-guards.mjs` (282 lines) | Row-scoped assertions over a parsed table, each returning `{ ok, why }` | The precedent shape for `(condition -> destination)` row guards, and it has its own selftest with an anti-vacuity control |
| `passAtK` / `passHatK` / `comb` | `lz-red-workspace/tabulate-mechanical-red.mjs` L44-72 | Pass@k / Pass^k | Reuse the formulas; the walker is hard-wired to `results/apply/<arm>/<pid>/run-*/` + `red-grade.json`, so it needs a param or a sibling |
| `merge-judge.mjs` | `lz-red-workspace/merge-judge.mjs` (435 lines) | Fail-closed judge merge + pre-aggregate `--verify` gate | Reuse verbatim; it refuses a final `grading.json` while any `passed:null` remains |
| `occursAffirmed` | `lz-red-workspace/grade-run.mjs` L164-183 | Negation-aware phrase presence (rejects negated and hedged-contrastive occurrences) | Essential for destination extraction: the classifier prose NAMES all three skills, most of them in exclusion clauses |
| vendored `skill-creator-eval` | `lz-red-workspace/tools/skill-creator-eval/` | Trigger recall/specificity (`run_eval.py`) | ONLY for the D-06 trigger regression; barred from the placement A/B by D-11 |

### Alternatives Considered

| Instead of | Could use | Tradeoff |
|------------|-----------|----------|
| `run-e2e.mjs --mode recommend` for the A/B | Phase 20's orchestrator subagent fan-out (EVL-02 mechanism) | Subagent fan-out cannot toggle `--plugin-dir`, so it cannot present three different plugin TREES -- it can only vary the prompt or the agent brief. D-11 requires a tree toggle. Rejected. |
| Three generated trees in `out/` | One tree plus scripted in-place swaps | In-place swaps mutate `plugins/lz-tdd` (the baseline), and `selfcheck-red.mjs` cruxes 1/2 hard-assert `with_skill`/`invoke_skill` resolve to `plugins/lz-tdd`. `build-treatment.mjs`'s header records the same reasoning. Three trees is the house pattern. |
| Extend `check-red-references.mjs` | New sibling `check-rgr-routing.mjs` | D-16 locks the sibling. Extending would perturb the hand-maintained `EXPECTED_CHECKS = 125` arithmetic and the 13-entry `NEW_LABELS` roster, both of which the file's own header defends at length. |
| Suite named `e2e-red-rgr-routing` | Suite named `e2e-rgr-routing` (outside the discovered namespace) | `e2e-red-*` is AUTO-DISCOVERED by `selfcheck-red.mjs` and its crux 2 bans `STATE_CLAIM_TOKENS` in prompts -- which the routing corpus needs. See Finding 7; recommend the non-`e2e-red-` name plus a sibling selfcheck. |
| Markdown link to the shared table | Inline code carrying `${CLAUDE_PLUGIN_ROOT}` | Guard N2 (`[lc9] every relative markdown link in the shipped tree resolves`) classifies a variable-prefixed path as `relative` and `existsSync`-checks it, so it can never resolve -- the checker's own comment at L808-811 says so. Inline code is mandatory. `[VERIFIED: read + the one shipped citation uses inline code]` |

**Installation:** none. No package is added to `plugins/lz-tdd` or to either workspace. The
Package Legitimacy Audit section is therefore N/A.

## Architecture Patterns

### System Architecture Diagram

```
                        PHASE 22 DATA FLOW

  [ 22-CONTEXT.md D-01..D-19 ]      [ 53q-REVIEW.md: 8 traced requests ]
              |                                   |
              |                                   v
              |                     +-------------------------------+
              |                     | CASE CORPUS (9 cases)         |
              |                     | reconstructed, NOT recovered  |<-- Finding 10
              |                     | (only 3 of 8 quoted in repo)  |
              |                     +-------------------------------+
              |                          |                    |
              v                          v                    v
  +---------------------------+   +----------------+   +---------------------+
  | WAVE 0  instrument-first  |   | guard corpus   |   | eval prompts/       |
  |                           |   | (checker data) |   | (one .md per case)  |
  | check-rgr-routing.mjs     |<--+                |   +---------------------+
  |  parse -> (cond -> dest)  |                                     |
  |  assert exhaustive        |                                     |
  |         at-most-one       |                                     |
  |         no-test-state-key |                                     |
  |  FAIL CLOSED on missing   |                                     |
  |  ASSERTED **RED** on HEAD |                                     |
  +---------------------------+                                     |
  | check-hygiene.mjs SCOPE   |<-- Finding 8: +2 unscanned files     |
  |   widened (plugin-wide    |                                      |
  |   references/ + README)   |                                      |
  +---------------------------+                                      |
              |                                                      |
              v                                                      |
  +--------------------------------------------------+               |
  | WAVE 1  author the SIX surfaces, x3 variants     |               |
  |                                                  |               |
  |  variant A: inline only (no new shipped file)    |               |
  |  variant B: + plugins/lz-tdd/references/         |               |
  |               rgr-routing.md, inline rationale   |               |
  |  variant C: shared table replaces narratives     |               |
  |                                                  |               |
  |  ALL THREE: byte-identical `description`          |               |
  |             frontmatter (D-11 precondition)      |               |
  +--------------------------------------------------+               |
              |                          |                           |
              | (A = the tracked tree)   | (B, C = generated)         |
              v                          v                           |
  +---------------------+   +-------------------------------+         |
  | plugins/lz-tdd      |   | build-variants.mjs            |         |
  | (variant A in tree) |-->| -> out/lz-tdd-variant-b       |         |
  |                     |   | -> out/lz-tdd-variant-c       |         |
  | check-rgr-routing   |   | (gitignored `out/`, sha-      |         |
  |  now **GREEN**      |   |  asserted deltas, fail-closed)|         |
  +---------------------+   +-------------------------------+         |
              |                          |                           |
              +------------+-------------+                           |
                           v                                        v
              +----------------------------------------------------------+
              | WAVE 2  A/B INSTRUMENT (built, never run)                |
              |                                                          |
              | run-e2e.mjs --mode recommend --suite <routing suite>     |
              |   --arm placement  =>  variant_a | variant_b | variant_c |
              |   each arm: claude -p --plugin-dir <tree>                |
              |             --disallowedTools Edit,Write,...,Bash        |
              |             --output-format stream-json                  |
              |   per run: answer.md + meta.json                         |
              +----------------------------------------------------------+
                           |
                           v
              +-------------------------------------------+
              | grade-routing.mjs (NEW)                   |
              |  DETERMINISTIC layer:                     |
              |   - extract candidate destinations        |
              |     (occursAffirmed, word-bounded)        |
              |   - classify: exactly-one | multi | none  |
              |   - emit multi/none as passed:null        |
              |  -> grading.preliminary.json              |
              +-------------------------------------------+
                           |
                           v
              +-------------------------------------------+
              | BLIND JUDGE (orchestrator; 1 question:    |
              |  "which single skill does this answer     |
              |   name as the owner?")  on NORMALIZED     |
              |  answers (arm-identifying strings         |
              |  stripped -- Finding 9)                   |
              +-------------------------------------------+
                           |
                           v
              merge-judge --merge -> --verify -> Pass@k / Pass^k
                           |
                           v
              +-------------------------------------------+
              | WAVE 3  PHASE GATE + DOUBLE HALT          |
              |  both batteries GREEN, validate . exit 0  |
              |  RUN-GATE presents 2 metered commands     |
              |  ORCHESTRATOR: unprimed acceptance review |
              |  STOP. Owner approves, then runs.         |
              +-------------------------------------------+
```

Component-to-file mapping is in the Standard Stack tables above and in Validation Architecture below.

### Recommended file layout

```
plugins/lz-tdd/
|-- references/
|   |-- beck-tdd-by-example.md          # EDIT: reconcile the L66-73 seam section (Finding 2)
|   '-- rgr-routing.md                  # NEW, variants B/C only
'-- skills/
    |-- lz-red/SKILL.md                 # description + Two modes + narrative + step 1
    |   '-- references/
    |       |-- three-laws-and-test-selection.md   # EDIT: catch-all L126 (Finding 1)
    |       '-- principle-backing.md               # EDIT only if #4's backing row moves
    |-- lz-tpp/SKILL.md                 # description + Two modes L23 + narrative L43 + step 1 L54-57
    '-- lz-refactor/SKILL.md            # description + Two modes L30 + narrative + step 1
                                        # + L80 anchor + L115-117 router + L139 sweep rule

.claude/skills/lz-red-workspace/
|-- tools/
|   |-- check-rgr-routing.mjs           # NEW (D-16), wired into npm run check
|   |-- check-rgr-routing.selftest.mjs  # NEW: mutation proofs both directions
|   '-- lib/
|       |-- section-body.mjs            # NEW copy (Finding 5 -- duplicate, do not cross-import)
|       '-- routing-parse.mjs           # NEW: the (condition -> destination) parser
|-- variants/
|   '-- build-variants.mjs              # NEW, modelled on treatment/build-treatment.mjs
|-- e2e-rgr-routing/                    # NEW suite -- deliberately NOT e2e-red-* (Finding 7)
|   |-- suite.json  |-- targets.json  |-- prompts/  |-- RUN-GATE.md
|-- grade-routing.mjs                   # NEW destination-extraction grader + --selfcheck
|-- selfcheck-routing.mjs               # NEW: arm composition + prompt parity for the 3 arms
'-- ROUTING-AB-RESULTS.md               # NEW phase-scoped writeup (or fold into EVAL-RESULTS.md)

.claude/skills/lz-refactor-workspace/
|-- e2e-nx/run-e2e.mjs                  # EDIT: +1 arm-group token, +3 --plugin-dir consts
'-- tools/check-hygiene.mjs             # EDIT: widen scope (Finding 8)

out/                                    # gitignored, already
|-- lz-tdd-variant-b/  '-- lz-tdd-variant-c/
```

### Pattern 1: Named-owner enumeration with a declared residual (D-01)

**What:** replace `if A -> me; if B -> sib1; if C -> sib2; otherwise -> me` with a list of positive
disjoint conditions each naming ONE owner, then an explicit residual terminal that claims nothing.

**When to use:** all six surfaces.

**Shape** (illustrative -- exact wording is Claude's discretion per CONTEXT):

```markdown
1. Classify the request by WHAT THE DEVELOPER IS ASKING FOR. Take the first branch that matches:
   a. Asking which test to write next, how to shape or name a test, whether a test is a good
      test, or what it should assert -> the red step. That is lz-red.
   b. Asking to make a failing test pass, or to add or change behavior when nothing is failing
      yet -> the red step FIRST (a failing test must exist before production code), so hand to
      lz-red; once a red test is in play the green step is lz-tpp.
   c. Newly green and asking what comes next, or asking to clean up / tidy / restructure code
      (including code that happens to live in a test file) without changing behavior -> the
      refactor step. That is lz-refactor.
   d. None of (a)-(c): this is not a red-green-refactor-loop request. Say so and answer directly;
      no skill in this loop owns it.
```

Branch (b) is D-02's two-hop rule and is the only branch that names two skills in sequence. That is
the shape the guard must accommodate: a `(condition -> destination)` pair whose destination is an
ORDERED PAIR, not a single name.

### Pattern 2: Wrap-tolerant needle with a bounded window

**What:** the repo's own idiom for a multi-word assertion in wrapped Markdown. Per-line matching is
the default (`lines.some(...)`); a needle that must span a wrap opts in via `wholeText: true` with a
bounded `[\s\S]{0,N}` gap.

**Source:** `check-red-references.mjs` L228-232 and L445-457 `[VERIFIED: read]`:

```javascript
// Whole-text with a bounded window rather than per-line, because the pairing wraps at both live
// sites and a per-line needle over a wrapped phrase can never match.
{
  label: "[lc9] Test Spy named for the record-then-inspect double",
  re: /test spy\b[\s\S]{0,80}record/i,
  wholeText: true,
},
```

The file's own comment (L451-455) warns that a BLANKET flip to whole-text loosens every one of the
~100 per-line topics. The new checker should therefore normalize ONCE, deliberately, at the section
level -- see Guard Design below -- rather than sprinkling `wholeText` flags.

### Pattern 3: Generated variant trees with a lever tripwire

**What:** `build-treatment.mjs`'s shape: a `VARIANTS` array of `{ id, outName, anchor, position,
lines, marker, expectedDeltas }`, a destination-safety assert BEFORE any recursive delete
(hardcoded path, no env override on the destructive target), a `hashTree()` before/after proving the
source tree is untouched, and an assertion that the inserted block carries its marker and that the
delta set matches `expectedDeltas` exactly.

**Adaptation needed:** `build-treatment.mjs` supports ONE operation -- insert lines at an anchor.
Variant C must DELETE three narrative sections and ADD a file. So the transform vocabulary must
widen to at least `{ insertBefore | replaceSection | deleteSection | addFile }`. Keep every
fail-closed assertion; add one per new operation (a `replaceSection` whose heading is absent must
FAIL, not silently no-op -- that is the silent-degradation class the builder's header names).

**Cross-variant invariant to assert in the builder:** all three trees carry BYTE-IDENTICAL
`description` frontmatter for all three skills. This is D-11's precondition, and if it silently
breaks the A/B measures triggering rather than placement. Assert it as a sha256 comparison of the
extracted frontmatter block per skill per tree.

### Anti-Patterns to Avoid

- **A bare-name presence needle as a routing guard.** Measured ceiling: reviewer 1 reverted both
  routing sites to lz-tpp-only text, kept the renamed heading, and the battery stayed GREEN
  (`53q-REVIEW.md` F-1). A guard satisfied by a renamed heading or an incidental mention is the
  named failure mode for CLS-04.
- **A deterministic phrase-set grader over coaching prose.** Phase 20's grader measured house
  vocabulary and inflated the headline ~3x (`EVAL-RESULTS.md` L142-153). D-12 exists because of it.
- **`existsSync`-gating a post-loop block.** `check-red-references.mjs`'s header condemns it as a
  silent vacuous pass; the TD-02 guard uses `try/catch -> ""` instead so `report()` runs exactly once
  every run (L533-553). D-17 locks this.
- **A Markdown link to a `${CLAUDE_PLUGIN_ROOT}` path.** Guard N2 classifies it relative and
  `existsSync`-fails it. Inline code only.
- **Cross-workspace imports between the two workspaces.** None exist today; the shared
  `scaffold-phrases.mjs` is DUPLICATED byte-identically in both `tools/lib/` dirs `[VERIFIED: diff]`.
- **Editing `--arm all` / `--arm both` in `run-e2e.mjs`.** Selfcheck crux 6 pins the nx `--arm all`
  dry-run BYTE-FOR-BYTE (L1021-1023). Add a NEW token, as `d12` did.
- **A grader `RUBRICS` array count-aligned to `evals.json`.** `grade-run.mjs` is structurally bound
  to the 10 Phase-20 scenarios (`RUBRICS[0-9]`, selfcheck-enforced alignment). Reusing it for the
  routing corpus means editing Phase-20 evidence. Write a sibling.

## Don't Hand-Roll

| Problem | Don't build | Use instead | Why |
|---------|-------------|-------------|-----|
| Extract a `## ` section body | A regex over the whole file | `sectionBody()` (copy into the lz-red workspace lib) | 20 lines, regex-escapes the heading, returns `null` on absence so the caller can fail closed. Four catalog checkers already share it (WR-02). |
| Parse a pipe table into cells | Split on `\|` | `scanTables()` from `lib/pipe-table.mjs` | Already handles ragged rows (it powers the ragged-table gate) and is the right primitive for a shared routing TABLE. |
| Decide whether a skill name in prose is a real claim | `text.includes('lz-tpp')` | `occursAffirmed()` from `grade-run.mjs` L164-183 | The classifier prose names all three skills, mostly inside EXCLUSION clauses ("Do NOT use it to ... use lz-tpp instead"). A bare `includes` is exactly the F-1 ceiling. Handles negation in both directions plus hedged-contrastive retraction. |
| Pass@k / Pass^k | Fresh binomials | `comb`/`passAtK`/`passHatK` from `tabulate-mechanical-red.mjs` L44-72 | Already selfchecked against fixtures. |
| Merge LLM judge verdicts into a final grading | Ad-hoc merge | `merge-judge.mjs --merge` then `--verify <dir>` | Refuses on unknown/duplicate/missing verdict text and on any surviving `passed:null`; `--verify` is what stops aggregate from silently dropping an unmerged run. |
| Build the variant trees | Copy-paste three trees into git | `build-variants.mjs` into gitignored `out/` | `plugins/lz-tdd` is 195 files / ~837K; each variant differs in 1-4 files. `build-treatment.mjs`'s header records this exact reasoning. |
| Arm composition + stream-json meta capture | A new runner | `run-e2e.mjs` (+1 arm token, +3 consts) | 1137 lines of already-selfchecked composition, model/effort pinning, `--strict-mcp-config`, `--setting-sources project`, and the three-way trigger detection (available / model-fired / forced). |

**Key insight:** every primitive this phase needs already exists in one of the two workspaces. The
work is (a) six Markdown surfaces, (b) one parsed-table guard, (c) three small additive
edits to existing instruments, and (d) two new thin scripts. Anything larger is over-build.

## Guard Design (CLS-04 / D-15, D-16, D-17)

### Parse strategy

Three-stage, all node-builtins, in `tools/lib/routing-parse.mjs` so it is unit-testable
independently of the checker (the `row-guards.mjs` + `row-guards.selftest.mjs` precedent).

**Stage 1 -- locate the block, fail closed.** For each of the six surfaces, `sectionBody(text,
heading)` on the surface's declared heading. `sectionBody` returns `null` when the heading is
absent; treat `null` as a FAILURE with an attributable label, never a skip. Read the file with
`try { ... } catch { return "" }` (the TD-02 idiom) so a missing file also fails closed with exactly
one `report()` call. **This is the answer to "a guard satisfied by a renamed heading": the heading
is an INPUT to the parse, so renaming it makes the parse return `null` and the guard FAIL** -- the
inverse of the F-1 ceiling, where the heading was the ASSERTION.

**Stage 2 -- normalize for wrap.** Within the extracted block, split on the branch delimiter
(numbered `N.` items, or `a.`/`b.`/`c.` sub-items, or table rows), then whitespace-flatten each
branch: `branch.replace(/\s+/g, ' ').trim()`. Flattening at BRANCH scope, not file scope, is what
makes multi-word needles wrap-proof without loosening anything else -- it is the same reasoning as
`check-red-references.mjs`'s per-entry `wholeText` opt-in, applied structurally. `[VERIFIED: the
repo's stated rationale at check-red-references.mjs L451-455]`

**Stage 3 -- emit pairs.** Per flattened branch, produce
`{ surface, branchId, conditionText, destinations: [names in order], keysOnTestState: bool }`:

- `destinations` = the three skill names matched word-bounded (reuse `matchesSkillName`'s boundary
  class from `run-e2e.mjs` L320-324: `(^|[^a-z0-9-])name($|[^a-z0-9-])`, which correctly refuses
  `lz-redux`), filtered through `occursAffirmed` so an exclusion clause does not count as a
  destination. ORDER matters (D-02's two-hop branch is an ordered pair).
- A branch may also carry `destination: NONE` -- the declared residual (D-01's terminal (d)).
  Recognize it by an explicit no-owner marker in the branch text rather than by absence of a name,
  so a branch that merely forgot to name an owner FAILS instead of silently becoming the residual.
- `keysOnTestState` = the flattened condition matches a test-state predicate set (`tests are green`,
  `tests already pass`, `all prior tests green`, `a failing (red) test plus`, `nothing failing yet`,
  `has a smell`... ). **Author this set as data, and prove BOTH directions in the selftest** -- a
  positive control (today's `lz-refactor/SKILL.md:30` must match) and a negative control (an
  ask-only condition must not).

### The three assertions over the case corpus

The corpus is a tracked JSON array of `{ id, request, expectedOwner, expectedSecondHop|null,
rationale }`. Given the parsed pairs, per case:

| Assertion | Predicate | Fails when |
|-----------|-----------|-----------|
| **Exhaustive** | at least one branch across the three step-1 procedures matches the case and names an owner (or the case's expected owner IS the residual terminal) | the post-green "what now?" case matches nothing -- today's BLOCKER |
| **At-most-one** | no more than one of the three step-1 procedures CLAIMS the case for ITSELF | two skills both claim it -- today's catch-all collision |
| **Single-axis** | zero branches in any routing or mode-selection block have `keysOnTestState === true` | `lz-refactor/SKILL.md:30`, `lz-tpp/SKILL.md:23`, `lz-tpp` step 1's hybrid branch |

Matching a case to a branch is the one genuinely hard sub-problem, and it must not become a
free-text NLP task. Recommendation: the corpus case carries an explicit `matchTokens` array
(the ask-words the branch must contain), and the assertion is set-membership over the flattened
branch. That makes the guard a **structural** check on the authored branches -- "does a branch exist
whose condition covers these ask-words and names this owner" -- which is deterministic, legible in
the report, and mutation-sensitive. It is NOT a claim that a model will route correctly; that claim
belongs to CLS-05's eval. State that boundary in the checker's header so the two are never
conflated.

### Variant-dependent parse target (D-17)

The surface list is data. Under variant A the canonical routing table is the three narrative
sections; under B/C it is `plugins/lz-tdd/references/rgr-routing.md`. Recommendation: the checker
reads a single tracked `ROUTING_SURFACES` constant that names the canonical location(s), and
**asserts the canonical location EXISTS** as its own labeled check. If the winning variant is B or C
and the file is missing, that is one attributable FAIL -- not a skip. No `existsSync` short-circuit
anywhere. Because the winner is unknown until after the gated run, Wave 0 should target variant A's
surface set (which is a strict subset present in all three variants: the three step-1 blocks + the
two out-of-scope surfaces from Findings 1 and 2), and a later task flips the constant when the
winner is known. That keeps the guard RED-then-GREEN in Wave 0/1 without depending on a run.

### Mutation testing in BOTH directions

Ship `tools/check-rgr-routing.selftest.mjs` (the `row-guards.selftest.mjs` precedent), asserting
per mutation that the battery flips. Minimum set:

| # | Mutation | Direction | Expected |
|---|----------|-----------|----------|
| 1 | Re-introduce a bare "otherwise ... is this skill" terminal in one step 1 | should-fail | exhaustive PASS, at-most-one FAIL |
| 2 | Delete the post-green positive branch from `lz-refactor` step 1 | should-fail | exhaustive FAIL on that case |
| 3 | Re-add `the tests are green and` to a routing condition | should-fail | single-axis FAIL |
| 4 | Rename a parsed heading | should-fail | `sectionBody` -> `null` -> attributable FAIL (closes F-1) |
| 5 | Delete the target file entirely | should-fail | fail-closed, exactly one attributable FAIL (reviewer 1's 4th mutation, adopted) |
| 6 | Add an INCIDENTAL mention of a sibling name outside any branch | should-STAY-GREEN | proves the guard reads branches, not the file |
| 7 | Reword a correct branch in different words but the same ask-words | should-STAY-GREEN | proves the guard is not a vocabulary proxy (the D-12 lesson applied to the CHECKER) |
| 8 | Empty the corpus / empty the surface list | should-fail | anti-vacuity control -- `row-guards.selftest.mjs` already carries this pattern |

Mutations 6, 7 and 8 are the ones a "should-fail-only" proof set would omit, and they are what
distinguish this guard from the one it replaces.

### Do NOT layer reviewer 1's cheap tightening

CONTEXT `<specifics>` is explicit: "require the sibling token on a line containing 'hand off'" is
SUPERSEDED by D-15, not added on top. A line-scoped needle would also be wrap-fragile.

## A/B Instrument (CLS-05 / D-08, D-11, D-13)

### The right base, named explicitly

**Base: `.claude/skills/lz-refactor-workspace/e2e-nx/run-e2e.mjs`, `--mode recommend`.**
Rationale, all verified this session:

- It is the ONLY script with `--plugin-dir` arm composition (`buildCmd`, L280-315).
- It already has TWO generated-tree arms (`invoke_treatment` -> `TREATMENT_DIR`, `invoke_forcing` ->
  `FORCING_DIR`) whose entire implementation is ~2 lines each in three places. That is the exact
  EDITED-vs-PREEDIT toggle D-11 names.
- `--suite <dir>` retargets it at any suite dir anywhere (`SUITE_DIR` L84); the lz-red `e2e-red-*`
  suites already drive it cross-workspace.
- `recommend` mode hard-blocks `Edit`/`Write`/`MultiEdit`/`NotebookEdit`/`Bash` (L299-302), so the
  output is pure coaching prose in `answer.md` -- exactly D-12's graded artifact, no applied diff.
- It captures the D-07 meta from the stream-json `result` event, including the three separated
  trigger facts (available / model-fired / forced, L326-346).

**Phase 20's EVL-02 is NOT the base.** Its "How to run" section (`EVAL-RESULTS.md` L408-438) shows an
in-session orchestrator subagent fan-out with `with_skill`/`no_skill` arms and no `--plugin-dir` at
all. It cannot present three plugin TREES. CONTEXT's "EVL-02-style" refers to the GRADING PIPELINE
(`grade-run` -> judge -> `merge-judge` -> aggregate), which IS reusable; the DRIVER is `run-e2e.mjs`.

### The smallest change that yields a 3-arm placement A/B

Six additive edits. Nothing is rewritten.

1. **`run-e2e.mjs`: three `--plugin-dir` constants.** Mirror `TREATMENT_DIR`/`FORCING_DIR` exactly
   (env-overridable because they are READ-only here; the builder's destructive paths stay
   hardcoded). `variant_a` points at `plugins/lz-tdd` -- the tracked tree IS variant A, so it needs
   no generated copy and doubles as the composition anchor `selfcheck-red.mjs` cruxes 1/2 already
   assert.
2. **`run-e2e.mjs`: one arm-group token.** `args.arm === 'placement' ? ['variant_a','variant_b','variant_c']`.
   NEW token; `all`/`both`/`d12` byte-unchanged (crux 6 pins the `all` dry-run).
3. **`run-e2e.mjs`: `composePrompt` + `parseArgs` validation + `buildCmd`.** Add the three ids to the
   allow-list and to `buildCmd`'s `--plugin-dir` chain. All three arms compose IDENTICALLY -- same
   preamble, same body, no slash prefix (natural prompt), so the ONLY variable is the tree. Do NOT
   force-invoke: the descriptions are byte-identical across arms, so auto-trigger is a shared
   constant and letting it fire naturally also yields a free auto-trigger sanity reading per arm
   from `skills_model_fired`.
4. **New suite `e2e-rgr-routing/`** (name deliberate -- Finding 7): `suite.json` with
   `{ name, repo, skillCommand: "/lz-tdd:lz-red", trackSkills: ["lz-red","lz-tpp","lz-refactor"],
   preambles: { recommend: <a routing-neutral preamble> }, prompts: [9 entries] }`, a `targets.json`
   (REQUIRED -- `run-e2e.mjs` reads it unconditionally at L92), and `prompts/<case-id>.md` = one
   bare request per case. `repo` can be any readable dir (`cwd = args.cwd || REPO`, L1032); use a
   small fixed checkout so all arms see identical context, or the repo root itself.
5. **New `grade-routing.mjs`** (destination extraction; next section) with `--selfcheck` over
   fixtures.
6. **New `selfcheck-routing.mjs`**: offline, zero-spend, asserts (a) all three arms compose with the
   three distinct `--plugin-dir` values, (b) the `-p` prompt is BYTE-IDENTICAL across the three arms
   per prompt, (c) the three trees' `description` frontmatter blocks are sha256-identical per skill,
   (d) each variant tree's delta set vs `plugins/lz-tdd` matches its declared expectation. (c) is
   the D-11 precondition and the single most important offline assertion in the phase.

`tabulate-mechanical-red.mjs` needs either a `--grade-file` parameter or a thin sibling: it hard-wires
`red-grade.json` and the `results/apply/<arm>/<pid>/run-*/` walk (L228-301), and `recommend` mode
writes to `results/recommend/<arm>/<prompt>/run-N/` (L634). Prefer the parameter -- one added
argument, and Phase 21's frozen evidence path stays the default.

### Two-stage design (D-13)

- **Stage 1 (screen):** k=1, 9 cases x 3 arms = 27 runs. Enough to detect a gross placement effect
  (e.g. variant C routing a case wrong where A/B route it right). Pass@1 + Pass^1 per arm.
- **Stage 2 (escalate, only on a signal):** k=3 or 5 on the SUBSET of cases that discriminated.
  Do not escalate globally -- five prior probes on this repo were null, and 8 of 10 EVL-02 scenarios
  saturated on substance.
- **Both stages HALT-gated separately.** Stage 2's approval is not implied by stage 1's.

## Grading Routing Correctness (D-12)

### The graded unit

Per (case, arm, run): **the single destination skill the answer names as the owner** -- a closed
label from `{lz-red, lz-tpp, lz-refactor, NONE}` plus, for D-02's two-hop case, an ordered pair
`(lz-red, lz-tpp)`. Compare to the corpus's `expectedOwner`. A run passes on that case iff the
extracted label equals the expected label. That is it. No phrase sets, no house vocabulary, no
"did it say classify-first".

### What the deterministic layer can safely assert

1. **Word-bounded name occurrence.** Which of the three names appear at all. Use
   `matchesSkillName`'s boundary class (refuses `lz-redux`). Safe: mechanical.
2. **Affirmed vs excluded.** Run each occurrence through `occursAffirmed` so
   "Do NOT use it to ... use lz-tpp instead" does not count as naming lz-tpp as the destination.
   Safe, and load-bearing: the classifier prose is dense with exclusion clauses. This is the single
   place where a naive `includes()` would recreate the F-1 ceiling inside the grader.
3. **Cardinality of affirmed names.** Exactly one / more than one / zero.
4. **Route the verdict:**
   - **exactly one affirmed name** -> DETERMINISTIC pass/fail against `expectedOwner`. This is the
     common case for a correct answer, and it is genuinely mechanical.
   - **zero affirmed names** -> DETERMINISTIC on the residual case only (case 9 expects `NONE`);
     on every other case, emit `passed: null` (a coaching answer that solves the problem without
     naming a skill is substantively ambiguous, not automatically wrong).
   - **two or more affirmed names** -> `passed: null`, ALWAYS. A correct answer to the two-hop case
     names two skills legitimately; a hedging answer names three. Only a judge can tell "lz-red
     first, then lz-tpp" from "could be lz-red or lz-tpp".
5. **Zero-spend structural asserts:** an `answer.md` that is empty or a tool-error transcript ->
   fail closed, do not grade (the fail-loud convention).

Emit `grading.preliminary.json` with `judge_required: [...]` and structurally refuse to write a final
`grading.json` while any remain -- `grade-run.mjs`'s `finalOutPath()` (L423-425) is the pattern.

### What must go to a blind judge

ONE question per ambiguous run, and only one:

> Which single skill, if any, does this answer designate as the owner of the request -- `lz-red`,
> `lz-tpp`, `lz-refactor`, an ordered handoff of two of them, or none of the three? Answer with the
> label only.

Keep it to one dimension. Phase 20 locked the judge to exactly two dimensions and enforced that in
the selfcheck; one is enough here because the metric is one label.

**Blinding is achievable here in a way it was not in EVL-02, and that is a genuine advantage.**
EVL-02's judge could not be blinded because `with_skill` transcripts self-identify via house
vocabulary against a no-skill baseline (`EVAL-RESULTS.md` L150-153). Here ALL THREE arms are
skill-loaded and share the same vocabulary, so the arm is not inferable from the coaching register.
Two residual leaks must be closed by NORMALIZING the judge input before it is handed over:

- **File-path leak:** variants B/C answers may cite `rgr-routing.md` or `${CLAUDE_PLUGIN_ROOT}`;
  variant A cannot. Strip any `references/`-path or plugin-root-variable token from the judge input.
- **Section-title leak:** variant A/B answers may quote a per-skill narrative heading that variant C
  deletes. Strip quoted heading strings.

Record the normalization as a tracked function with its own selfcheck, and report per run whether
normalization fired -- so the writeup can state how much was stripped rather than assert blindness.

### How the substance-only headline is computed

Only ONE dimension is scored, so there is no vocabulary layer to strip -- which is the point of
choosing destination-extraction as the metric. The headline is therefore:

- **Per arm:** Pass@1 and Pass^1 over the 9 cases (and Pass@k / Pass^k at k = 1, 3, 5, total if
  stage 2 runs), where "pass" = extracted label equals expected label, with judge-resolved labels
  merged in via `merge-judge --merge` and the `--verify` gate run before any aggregate.
- **Report the deterministic-vs-judge SPLIT explicitly** per arm: how many of that arm's runs were
  resolved mechanically and how many needed the judge. A variant that systematically produces
  multi-name hedging answers will show a higher judge share, and that asymmetry is itself a finding
  about the placement -- report it rather than letting it hide inside the pass rate.
- **State the k=1 power bound in the same paragraph as the numbers.** 9 cases x 1 run cannot
  distinguish a small effect from noise, and D-10's tiebreak fires on a MEASURED tie. Per D-10,
  the writeup must also say that a tie on routing correctness does NOT prove parity on
  coaching quality -- variant C moves the classify-first rationale behind a lazy read, and
  classify-first is one of only two dimensions EVL-02 measured a real edge on.
- **>= 1 from-scratch unbiased reviewer** over the grader source, a sample of normalized answers, and
  the reported numbers (the standing `unbiased-review-beats-primed` rule). Orchestrator-run.

## Load-Bearing Findings

Ten findings, ordered by how much they change the plan. Every one measured this session.

### Finding 1 -- The catch-all is on FIVE surfaces, and one is a reference leaf `[VERIFIED: rg over plugins/]`

Routing-relevant `otherwise` occurrences in the shipped tree:

| Site | Text |
|------|------|
| `lz-tpp/SKILL.md:43` | "...hand off to lz-red; **otherwise**, picking the minimal change that turns the red bar green is this skill." |
| `lz-red/SKILL.md:42` | "...hand off to lz-refactor; **otherwise**, choosing and writing the next failing test is this skill." |
| `lz-red/SKILL.md:59` | "...hand off to lz-refactor. **Otherwise** choosing and writing the next failing test is this skill's work." |
| **`lz-red/references/three-laws-and-test-selection.md:126`** | "...hand it off to lz-refactor. **Otherwise** the work is choosing and writing the next failing test, which is lz-red" |
| `lz-refactor/SKILL.md:15` | description: "...make a failing or red test pass or **otherwise** ADD or CHANGE behavior" (not a catch-all -- the D-06 clause) |

The 4th is a full three-way classify inside a REFERENCE leaf, in the `## The Three Laws spine and
classify-first` section (L123-129), and it closes by stating it is "the same
red-vs-green-vs-refactor split the SKILL.md router states; it is repeated here as the entry gate to
the selection moves". **Fixing `lz-red/SKILL.md` while leaving this leaf intact ships two
contradicting classifiers inside one skill**, and the leaf is the one `lz-red` step 2 explicitly
tells the model to read ("read it to decide which test comes next"). It must be in scope.

Consequence for the plan: the surface count is 4 minimum, not 3. `principle-backing.md` L69 backs
this leaf's classify-first row, so if the leaf's section changes materially the backing row's
description may need a matching touch (the row's tier does not change -- it is already
"lz-red orchestration / no-oracle").

### Finding 2 -- The plugin-wide shared reference already contains a stale, two-way, skill-relative router `[VERIFIED: file read]`

`plugins/lz-tdd/references/beck-tdd-by-example.md` -- the file CONTEXT names as "the plugin-wide
shared-reference precedent; the model for variants B and C" -- carries `## The seam with lz-tpp`
(L66-73):

> "...Once the bar is green, choosing and applying the structure-improving move is the refactor step,
> and that is **this skill's** job. The coach classifies every request against this line first: if a
> red test must be made to pass, hand off to lz-tpp; if the tests are green and the code has a smell,
> **stay here**."

Three defects in one section, in a file that is loaded plugin-wide and cited from
`lz-red/SKILL.md:159`:

1. **"this skill's job" / "stay here" is skill-relative in a plugin-wide file.** Read by `lz-red`,
   it says the refactor step is lz-red's job. Its own scope line (L3-5) compounds this: "the core of
   the test-first loop that **lz-refactor** sits inside".
2. **Two-way only.** It never names `lz-red` as a destination, so it is non-exhaustive by
   construction -- the same defect the phase exists to fix, in the shared tier.
3. **It keys on test state** ("if the tests are green and the code has a smell") -- a direct D-03
   violation on a routing sentence.

**This is the single most plan-changing finding.** Variants B and C add a canonical routing table to
the same directory, and any variant that does not reconcile this section ships two contradicting
shared routing statements. Under variant C the contradiction is worse, because C's entire premise is
"ONE normative artifact to cite" (D-10) and there would demonstrably be two. Recommendation: make
reconciling `beck-tdd-by-example.md` L3-5 and L66-73 an in-scope task in ALL THREE variants (it is a
D-03/D-01 defect independent of placement), and under B/C have that section point at the canonical
table rather than restate a rule.

### Finding 3 -- Reference-file retrieval has MEASURED zero-rate on this repo `[VERIFIED: build-treatment.mjs header, D-04 note]`

The prior placement probe shipped an artifact into `references/` and cited it from the reference
LIST. Recorded verdict:

> "ZERO of six treatment runs opened it -- verified by transcript grep with a passing positive
> control -- so the treatment DOSE was zero and the arm measured RETRIEVAL rather than content.
> Inlining puts the content in the MAIN BODY, which is guaranteed loaded, and that is the entire
> purpose."

This is the empirical core of D-10's disclosed risk, and it is stronger than the docs-level argument.
Corroborated by the official docs: the invoked `SKILL.md` body enters context as one message and
persists, but reference files are read on demand and "Claude Code does not re-read the skill file on
later turns" `[CITED: docs.claude.com/en/docs/claude-code/skills#skill-content-lifecycle]`.

**Consequence:** variant C is not a neutral relocation -- it moves the routing rule from a
guaranteed-loaded tier to a tier with a measured zero-retrieval precedent on this exact repo. Two
concrete recommendations for the plan:

1. **Instrument retrieval as a first-class dimension of the A/B, not an afterthought.** Per run,
   record from the transcript whether the shared file was actually READ (`Read` tool_use naming the
   path). If variant C scores well WITHOUT the read, the shared table is not what produced the
   answer, and the result says nothing about placement. `run-e2e.mjs`'s `extractResult` already
   parses `tool_use` blocks and builds a `toolCalls` histogram, so this is a small addition.
2. **Variant C must keep the SHORT BRANCH LIST inline** (which D-08's own wording already requires:
   "`SKILL.md` keeps only its short branch list and links out"). The plan should make explicit that
   what C moves out is the RATIONALE and the EDGE-CASE TABLE, never the branch list itself.

### Finding 4 -- Renaming a heading is closed by making the heading a parse INPUT `[VERIFIED: 53q-REVIEW F-1 + sectionBody semantics]`

Reviewer 1's measured ceiling: "revert both routing sites to lz-tpp-only text but keep the renamed
heading, and the battery stays GREEN -- the heading alone satisfies the needle." The structural fix
is not a stronger needle. It is inverting the role of the heading: `sectionBody()` returns `null`
when its heading is absent, so a rename makes the parse yield nothing and the guard FAIL with an
attributable label. The named failure mode -- "a guard satisfied by a renamed heading or an
incidental mention" -- is closed by construction, plus mutation 6 (incidental mention must stay
GREEN) proves the other half.

### Finding 5 -- `sectionBody` / `heading-scan` are in the WRONG workspace; duplicate, do not cross-import `[VERIFIED: ls + diff + import scan]`

CONTEXT's Reusable Assets lists "Shared libs: `tools/lib/heading-scan.mjs` and
`tools/lib/section-body.mjs`" without naming a workspace. They exist **only** in
`.claude/skills/lz-refactor-workspace/tools/lib/`. The lz-red workspace's `tools/lib/` has four
different modules (`pipe-table.mjs`, `provenance-honesty.mjs`, `row-guards.mjs`,
`scaffold-phrases.mjs`) and **zero** cross-workspace imports.

The house convention is DUPLICATION: `scaffold-phrases.mjs` exists byte-identically in both
`tools/lib/` dirs `[VERIFIED: diff reports identical]`. So `check-rgr-routing.mjs` (which D-16 puts
in the lz-red workspace) should copy `section-body.mjs` into
`.claude/skills/lz-red-workspace/tools/lib/`, not import across the boundary. Copying a 20-line
zero-dep module preserves the two workspaces' independence (each has its own `package.json` and its
own `npm run check`); a cross-import would make the lz-red battery fail if the lz-refactor workspace
were ever relocated.

### Finding 6 -- D-02's two-hop rule IS what the shipped distillation says `[VERIFIED: file read]`

`plugins/lz-tdd/skills/lz-red/references/three-laws-and-test-selection.md`, section
`## The Three Laws spine and classify-first`, bullet `Law 1 -- gate entry`:

> "Law 1 -- gate entry (Robert C. Martin, owned; oracle-verified): **write no production code until a
> failing unit test asks for it. The failing test comes first and the code that satisfies it comes
> second, so a red bar is the entry ticket to writing any behavior.**"

And the `Law 3` bullet establishes the second hop:

> "Law 3 -- the lz-tpp handoff... lz-red confirms the red bar fails for the right reason and hands the
> failing test forward; lz-tpp then chooses the minimal transformation that turns it green."

**D-02 is confirmed, not contradicted.** "Add new behavior, nothing failing yet -> write the failing
test first (lz-red), then lz-tpp" is exactly Law 1 followed by Law 3 as this repo's own owned,
oracle-verified distillation states them. The provenance tier is `Owned; oracle-verified` for Law 1
(source: R.C. Martin, Clean Code Ch. 9) and `lz-red orchestration, no-oracle` for the Law-3-as-handoff
reframe -- so the two-hop rule's FIRST hop is book-backed and its SECOND hop is this project's own
declared orchestration. The plan can cite Law 1 as authority for the routing rule; it should NOT
claim book backing for the handoff framing, which the file itself labels a reframe.

Backing row to keep consistent: `principle-backing.md:69`,
`| [Classify-first and the forward lz-tpp handoff](three-laws-and-test-selection.md) | lz-red
orchestration | Unowned; high-confidence core only (no-oracle). |`

### Finding 7 -- Naming the routing suite `e2e-red-*` would HARD-FAIL the existing selfcheck `[VERIFIED: read selfcheck-red.mjs L301-308, L422-430, L345-359]`

`selfcheck-red.mjs` `discoverRedSuites()` auto-discovers every direct child of the lz-red workspace
named `e2e-red-*` carrying a `suite.json`, and runs cruxes 1+2 over ALL of them x 2 modes. Crux 2
includes:

```javascript
const lowered = wsPrompt.toLowerCase();
const claimed = STATE_CLAIM_TOKENS.filter((t) => lowered.includes(t));

if (claimed.length) {
  fail(`[crux 2] ${label}: the prompt makes a claim about the existing tests' pass/fail state ...
        the RED prompt must not assert that the target's tests currently pass or fail`);
}
```

`STATE_CLAIM_TOKENS` = `all green`, `all passing`, `are green`, `are passing`, `currently green`,
`currently passing`, `currently pass`, `currently fail`, `tests pass`, `suite is green`,
`green right now`, `passing right now`, `pass right now`.

The routing corpus MUST carry test-state facts -- that is the whole point of D-03 (routing must
IGNORE them, so the corpus has to present them). Natural phrasings of the post-green case ("the tests
are green, what next?", "everything's passing, what now?") trip these tokens directly. The BLOCKER
case as quoted ("I just finished making a test pass") happens NOT to match (the token is plural
`tests pass`), but that is luck, not design, and it constrains the corpus's wording for no good
reason.

Also: crux 1 requires every discovered suite to compose `no_skill`, `with_skill` and `invoke_skill`
under `--arm all` with `--plugin-dir` ending in `plugins/lz-tdd` -- assertions that are correct for
an apply suite and irrelevant for a placement suite.

**Recommendation:** name the suite `e2e-rgr-routing` (outside the discovered namespace) so
`selfcheck-red.mjs` stays BYTE-UNCHANGED (protecting Phase 21's frozen evidence and its 9 cruxes),
and ship a sibling `selfcheck-routing.mjs` that gives the new arms their own offline composition +
parity + description-identity proof. Do NOT leave the new suite unproven -- that is the silent-gap
class this repo repeatedly punishes. If the planner instead prefers auto-discovery, crux 2 needs a
per-suite opt-out and `selfcheck-red.mjs` changes, which is the larger and riskier diff.

### Finding 8 -- MEASURED hygiene hole: exactly 2 shipped `.md` files are outside ALL THREE axes, and one is the plugin-wide references dir `[VERIFIED: computed set difference + ran the checker]`

`check-hygiene.mjs` builds `wideTargets` from `lz-refactor` + `lz-tpp` + `lz-red` skill trees plus
root `README`/`CHANGELOG`/`LICENSE` plus both manifests (L20-39, L100-127). Measured:

```
all .md under plugins/:                 194
covered by hygiene wideTargets:         192
NOT covered by check-hygiene (any axis):
   plugins/lz-tdd/README.md
   plugins/lz-tdd/references/beck-tdd-by-example.md
```

(The checker reports `files: 197` = 192 plugin files + 5 root files/manifests.)

**Under variants B and C the new canonical routing table lands in the ONE shipped directory the
hygiene battery does not scan**, so D-19's "hygiene re-run (ASCII-only, email allowlist-inversion,
no-verbatim) over the edited tree" would be a vacuous pass on the new file. The `[wev G17]` gate in
`check-red-references.mjs` DOES walk every `.md` under `plugins/` (its header: "Scope: EVERY .md
under plugins/... NOTHING is excluded"), so the bare-qualifier axis and the N2/N3 link/name gates
reach the shared dir -- but ASCII, email and no-verbatim do not.

**Recommendation:** extend `check-hygiene.mjs` scope to `plugins/lz-tdd/references/` (all three
axes -- it is clean-room own-words like lz-red) and to `plugins/lz-tdd/README.md`. Do it in Wave 0,
instrument-first, and prove the widened scope is non-vacuous by asserting the new file count
(`197 -> 199` before the variant file exists). The checker already has a `scan floor` assertion for
exactly this class of hazard -- extend it rather than trusting the count.

### Finding 9 -- The EVL-02 grader trap, and why it does not transfer verbatim `[VERIFIED: EVAL-RESULTS.md L142-153, L180-200, L228-230]`

The recorded trap:

> "the deterministic phrase-set dimensions measure the skill's HOUSE VOCABULARY as a proxy for
> correctness, and that proxy systematically false-fails the baseline, which gives substantively
> correct answers in its own words... The full-run Pass@1 (0.87 vs 0.50) is retained for completeness
> but is vocabulary-inflated; it overstates the effect ~3x."

Concrete instances: "assert the **return** value" vs the matcher's "return**ed** value"; AAA written
as `// Arrange // Act // Assert` comments; "there's nothing to mock" instead of "no double". Five of
eight nominally-discriminating rows were substance TIES.

Two things transfer and one does not:

- **Transfers:** the RULE that the substance measure is the headline and any vocabulary-proxy figure
  is labeled context only. D-12 encodes this.
- **Transfers:** the rule to apply a grader artifact SYMMETRICALLY (EVL-02's eval-3 artifact hurt
  both arms; the caveat was initially applied only upward).
- **Does NOT transfer:** the un-blindability. EVL-02's judge could infer the arm from house
  vocabulary because one arm had no skill. Here all three arms are skill-loaded with identical
  descriptions, so the register is shared. Blinding is achievable -- see the two residual leaks and
  the normalization requirement in the Grading section. **This is a real design improvement over
  EVL-02 and the writeup should claim it explicitly, with the normalization evidence attached.**

### Finding 10 -- Only 3 of the "eight traced requests" are recoverable; the corpus must be RE-AUTHORED `[VERIFIED: quoted-string extraction over all four quick-task docs]`

D-12 says "Corpus = the reviewer's eight traced requests plus the 'not an RGR-loop request' residual
case." The reviewer's brief was not saved. Exhaustive extraction of quoted developer requests from
all four `260803-53q-*.md` files yields exactly three:

1. `"I just finished making a test pass. What now?"` (REVIEW L73 -- the BLOCKER)
2. `"Is this a good test?"` (REVIEW L87, L104 -- the branch-(c) over-capture)
3. `"What test should I write next?"` (REVIEW L115 -- the hop TD-02 closed)

A fourth is derivable from ROADMAP SC1: *"I want to add a new behavior to this module"* with nothing
failing yet. The remaining four are described only by effect (the (a)/(b) combined-ask overlap; the
untested-code case step 5 handles).

**Consequence:** the plan must own corpus AUTHORING as an explicit deliverable, state in the corpus
file's own header that it is RECONSTRUCTED rather than recovered, and derive the missing cases from
the defect descriptions rather than claim provenance it does not have. Recommended 9-case shape (one
per named defect plus the residual), each case carrying `{ id, request, expectedOwner,
expectedSecondHop, defectRef, matchTokens }`:

| # | Case | Expected owner | Defect it pins |
|---|------|----------------|----------------|
| 1 | "I just finished making a test pass. What now?" | `lz-refactor` (positive branch) | BLOCKER; D-02 |
| 2 | "What test should I write next?" | `lz-red` | TD-02 regression floor |
| 3 | "Is this a good test?" | `lz-red` | IMPORTANT: branch (c) over-capture; D-04 |
| 4 | "I want to add a new behavior to this module" (nothing failing) | `lz-red` then `lz-tpp` | IMPORTANT: body-vs-description gap; D-02 two-hop |
| 5 | "This test file is duplicated and messy, tidy it up" | `lz-refactor` | D-04's other side (own by ask, not file kind) |
| 6 | "Make this failing test pass" | `lz-tpp` | the seam that already works -- regression floor |
| 7 | "Clean up this function -- it has no tests" | `lz-refactor` | MINOR: coach gate excludes the case step 5 handles; D-03 |
| 8 | "What test comes next, and can you also tidy the helper?" (combined ask) | one owner + a named second step | MINOR: (a)/(b) both fire |
| 9 | "What's the best way to structure this CLI's argument parsing?" | `NONE` (declared residual) | D-01's terminal (d) |

Cases 5-9 are RECONSTRUCTED. Label them so in the file. The corpus is consumed by BOTH the guard
(as `matchTokens` + `expectedOwner`) and the eval (as `prompts/<id>.md`), so author it once as the
single source and derive both -- a divergence between the guard's corpus and the eval's prompts is a
silent measurement error. Assert the derivation in `selfcheck-routing.mjs` (one prompt file per
corpus case, ids matching).

## Common Pitfalls

### Pitfall 1: Perturbing `check-red-references.mjs`'s label arithmetic

**What goes wrong:** any change to that file's emitted-check count reddens the roster gate at
`EXPECTED_CHECKS = 125`, and the failure is reported on the ROSTER rather than on the guard that
found something -- the wrong signal, as the file's own header says.
**Why:** the literal is hand-maintained and PREDICTED from the inventory, deliberately not derived.
**How to avoid:** D-16's sibling-file rule. Verified baseline this session: `npm run check` in the
lz-red workspace exits 0 with "125 checks, equal to the PREDICTED literal; all 13 new labels present;
none of the 64 retired labels survive".
**Warning sign:** the battery fails on `[2ig] roster integrity` rather than on a routing label.

### Pitfall 2: A per-line needle over a wrapped routing sentence

**What goes wrong:** `lines.some((l) => re.test(l))` can NEVER match a multi-word needle whose phrase
wraps, producing a structurally unmatchable guard that is RED even when the content is right.
**Why:** the shared matcher splits on newlines first.
**How to avoid:** flatten at BRANCH scope (Stage 2 of the parse), or opt in per-needle with
`wholeText` + a bounded `[\s\S]{0,N}` window. Never flip the whole matcher to whole-text.
**Warning sign:** this is a REPEATED defect class on this repo -- `check-red-references.mjs` records
three separate instances (the `later phase` guard narrowing, the `Test Spy` window, the chronology
phrase gate needing its own post-loop block).

### Pitfall 3: Descriptions drifting across the three variant trees

**What goes wrong:** if a variant tree's `description` frontmatter differs by even one byte, the A/B
silently measures TRIGGERING instead of PLACEMENT and D-11's premise is void.
**Why:** the builder edits `SKILL.md` files, and frontmatter sits in the same file as the body.
**How to avoid:** sha256 the extracted frontmatter block per skill per tree in
`selfcheck-routing.mjs` and fail on any mismatch. `build-treatment.mjs` already hashes trees
(`hashTree`), so the primitive exists.
**Warning sign:** an arm shows a different `skills_model_fired` rate -- with identical descriptions
that should be noise, not signal.

### Pitfall 4: A variant tree that silently lacks its lever

**What goes wrong:** a `replaceSection` / `deleteSection` whose anchor heading was reworded no-ops,
producing a tree that looks healthy and measures nothing.
**Why:** anchor-based transforms fail silently by default.
**How to avoid:** `build-treatment.mjs`'s doctrine -- "Everything here fails CLOSED. A
silently-skipped insertion would produce a tree whose lever is absent, and the A/B would then measure
nothing while looking healthy." Assert per variant: anchor found, marker present in output,
`expectedDeltas` matches exactly, source tree hash unchanged.
**Warning sign:** two arms score identically AND their trees' delta sets are equal.

### Pitfall 5: Grading a run whose shared file was never read (variants B/C)

**What goes wrong:** variant C scores well, the writeup concludes "the shared table works", but the
transcript shows the model never opened it -- so the answer came from the inline branch list.
**Why:** the measured zero-retrieval precedent (Finding 3).
**How to avoid:** record per run whether the canonical file was READ, and report the read rate per
arm alongside the pass rate. A high pass rate at a zero read rate means the A/B measured the inline
residue, not the placement.
**Warning sign:** variant C's read rate is 0 and its pass rate equals variant A's.

### Pitfall 6: `git grep` returning a silent zero inside `out/`

**What goes wrong:** verifying a variant tree's content with `git grep` returns zero matches with no
error, because `out/` is gitignored and `git grep` reads the index only.
**How to avoid:** use `rg` for anything under `out/` (an explicit path into an ignored tree needs no
flags). Check the exit code: `1` is genuine no-match, `2` is a failed command.

### Pitfall 7: Reading a "GREEN battery" as an acceptance verdict

**What goes wrong:** the deterministic battery passes and the content is still wrong.
**Why:** recorded on this repo -- "THE BATTERY IS NOT THE GATE -- two rounds have now shipped
blocking defects behind a green one" (STATE.md, 2026-07-29). And this phase EXISTS because a green
125/125 battery coexisted with a non-exhaustive classifier.
**How to avoid:** D-18's unprimed acceptance review is the gate, run by the ORCHESTRATOR. The
battery is a floor.
**Warning sign:** a plan whose final task is "battery GREEN" with no orchestrator review step.

### Pitfall 8: Assuming `run-e2e.mjs` reads only `suite.json`

**What goes wrong:** a new suite dir without `targets.json` throws at module load, before any flag is
parsed, because `TARGETS` is read unconditionally at L92.
**How to avoid:** ship a `targets.json` in the routing suite even though there is no code target
(a single descriptive entry is enough). Also confirm `SUITE.repo` points at a readable dir --
`cwd = args.cwd || REPO`.

## Code Examples

### The whole-file fail-closed read (the TD-02 idiom, D-17)

```javascript
// Source: .claude/skills/lz-red-workspace/tools/check-red-references.mjs L538-553 (verbatim shape)
// Deliberately NOT existsSync-gated. This file's own header condemns an existsSync-gated post-loop
// block as a silent vacuous pass. The try/catch yields the empty string instead, which has no match,
// so the guard fails CLOSED with no extra branch and report() runs exactly once every run.
const lzRefactorSkillPath = path.join(repoRoot, "plugins", "lz-tdd", "skills", "lz-refactor", "SKILL.md");
let lzRefactorText = "";

try {
  lzRefactorText = fs.readFileSync(lzRefactorSkillPath, "utf8");
} catch {
  lzRefactorText = "";
}
```

### Section extraction that makes a heading rename fail (Finding 4)

```javascript
// Source: .claude/skills/lz-refactor-workspace/tools/lib/section-body.mjs (verbatim; copy to lz-red)
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const sectionBody = (text, heading) => {
  const re = new RegExp(`^##\\s+${escapeRe(heading)}\\s*$`, "m");
  const parts = text.split(re);

  if (parts.length < 2) {
    return null;              // <-- a renamed heading lands HERE; treat as FAIL, never as skip
  }

  return parts[1].split(/^##\s+/m)[0];
};
```

### Word-bounded skill-name match that refuses `lz-redux`

```javascript
// Source: .claude/skills/lz-refactor-workspace/e2e-nx/run-e2e.mjs L320-324 (verbatim)
function matchesSkillName(token, name) {
  const esc = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  return new RegExp(`(^|[^a-z0-9-])${esc}($|[^a-z0-9-])`, 'i').test(String(token));
}
```

### The arm toggle to extend (three sites, additive)

```javascript
// Source: .claude/skills/lz-refactor-workspace/e2e-nx/run-e2e.mjs L304-312 (verbatim today)
if (arm === 'with_skill' || arm === 'invoke_skill') {
  cmd.push('--plugin-dir', PLUGIN_DIR);
} else if (arm === 'invoke_treatment') {
  cmd.push('--plugin-dir', TREATMENT_DIR);
} else if (arm === 'invoke_forcing') {
  cmd.push('--plugin-dir', FORCING_DIR);
} else if (arm === 'code_review') {
  cmd.push('--plugin-dir', MATTPOCOCK_DIR);
}
// ADD: variant_a -> PLUGIN_DIR (the tracked tree IS variant A), variant_b -> VARIANT_B_DIR,
//      variant_c -> VARIANT_C_DIR. Plus one NEW arm-group token at L1024-1031 ('placement'),
//      never an edit to 'all'/'both' (selfcheck crux 6 pins the 'all' dry-run byte-for-byte).
```

### The judge-merge fail-closed boundary

```javascript
// Source: .claude/skills/lz-red-workspace/grade-run.mjs L423-425 (verbatim)
// Structural guard: never emit a FINAL-looking grading.json while judge items remain.
function finalOutPath(outArg, judgeCount) {
  return judgeCount > 0 ? path.join(path.dirname(outArg), "grading.preliminary.json") : outArg;
}
```

## Skill Loading Semantics (external, RQ1)

All `[CITED: docs.claude.com]`, fetched this session via `markdown.new`.

| Fact | Source | Consequence for D-08 |
|------|--------|---------------------|
| "In a regular session, skill descriptions are loaded into context so Claude knows what's available, but full skill content only loads when invoked." | `/skills#control-who-invokes-a-skill` (Note) | Only the DESCRIPTION influences which skill fires. D-06 edits the only tier that can affect triggering -- hence the mandatory regression. |
| "When you or Claude invoke a skill, the rendered `SKILL.md` content enters the conversation as a single message and stays there for the rest of the session... **Claude Code does not re-read the skill file on later turns**" | `/skills#skill-content-lifecycle` | Inline routing (variant A) is guaranteed present once the skill fires. A `references/` file is not. |
| "Skills can include multiple files in their directory... letting Claude access detailed reference material **only when needed**." Reference files must be cited so "Claude knows what each file contains and when to load it." | `/skills#add-supporting-files` | Variants B/C depend on a model DECISION to read. Combined with Finding 3's measured zero-rate, that is the risk D-10 accepted. |
| "each entry's combined text is capped at **1,536 characters** regardless of budget" (configurable via `skillListingMaxDescChars`); listing budget defaults to 1% of the context window (`skillListingBudgetFraction`); on overflow, descriptions are dropped starting with least-invoked skills; "put the key use case first" | `/skills#skill-descriptions-are-cut-short` | The D-06 budget: `lz-refactor` has 291 chars of headroom. All three descriptions already lead with the positive use case, which is correct. |
| "Keep `SKILL.md` under 500 lines." | `/skills#add-supporting-files` (Tip) | No variant approaches it (167 / 91 / 185 lines today). Not a binding constraint, so it is NOT an argument for variant C. |
| Placeholder substitution table: for **"Skill and agent content"** placeholders resolve **"Anywhere the placeholder appears"**; `${CLAUDE_PLUGIN_ROOT}` = "Absolute path to the plugin's installation directory" | `/plugins-reference#environment-variables` | **`${CLAUDE_PLUGIN_ROOT}/references/rgr-routing.md` in a SKILL.md body is a documented, supported form.** Variants B/C need no new mechanism. |
| The documented standard plugin layout lists only auto-discovered component dirs (`skills/`, `commands/`, `agents/`, `hooks/`, `scripts/`, `bin/`, ...). A plugin-level `references/` is NOT among them. | `/plugins-reference#plugin-directory-structure` | `references/` at plugin root is inert bundled content -- a repo convention with no special meaning to Claude Code, reachable only via the variable. Honest framing: the CITATION MECHANISM is documented; the DIRECTORY NAME is ours. |
| `claude plugin validate .` and `--strict` both exit 0 on HEAD, with `plugins/lz-tdd/references/beck-tdd-by-example.md` shipped and cited via `${CLAUDE_PLUGIN_ROOT}` | `[VERIFIED: ran both]` | The validator inspects manifests, not reference paths -- so "validate passes" is NOT evidence the citation resolves at runtime; it is evidence the layout is legal. |

**Sibling-skill selection mechanics: NOT verified.** The docs describe the listing and the
description's role but do not specify an algorithm for choosing among overlapping siblings. The
troubleshooting guidance is behavioral only: "Make the description more specific" (triggers too
often) and "Strengthen the skill's `description` and instructions so the model keeps preferring it"
`[CITED: /skills#skill-triggers-too-often, #skill-content-lifecycle]`. WebSearch was unavailable this
session (tool returned a configuration error on every query), so no community corroboration was
gathered. Treat "reciprocal exclusion clauses in each description are what enforce the boundary" as
`[ASSUMED]` -- it is this repo's own design (SKL-03) and it is EMPIRICALLY supported by EVL-01's
measured reciprocal specificity (lz-tpp 12/12 quiet, lz-refactor 12/12 quiet on RED positives), which
is the strongest evidence available and is in-repo rather than external.

## Decision-Table Prior Art (external, RQ5 -- kept brief)

| Check | Standard term | Confidence |
|-------|--------------|-----------|
| Every input combination has an action | **complete** / **balanced** | `[CITED: en.wikipedia.org/wiki/Decision_table]` -- "a decision table is considered balanced or complete if it includes every possible combination of input variables" |
| At most one rule fires per input | **unique hit policy** (DMN); overlap / conflicting rules | `[ASSUMED]` -- Wikipedia does not name it; not verified against an authoritative DMN source this session |
| A rule that can never fire because an earlier one always shadows it | **masked** / **subsumed** rule | `[ASSUMED]` |
| Inputs that are irrelevant in a branch | **don't-care** | `[CITED: same]` |

**Borrowable pitfall:** "don't care" cells collapse a table without changing behavior, but they also
HIDE which inputs a rule ignores. Mapped onto this phase: D-03's single-axis rule is exactly a
don't-care declaration -- test state is a don't-care for every routing branch -- and the guard's
`keysOnTestState` assertion is the mechanical enforcement of it. Do not over-invest further; the
project's own recorded lesson ("derive verdicts from a parsed table rather than patch the third
instance of a class") is the operative guidance and it already matches D-15.

## Description Edits and the Trigger Regression (RQ7)

### Where the EVL-01 data lives `[VERIFIED: ls + counts]`

| File | Shape | Role |
|------|-------|------|
| `.claude/skills/lz-red-workspace/evals/trigger-eval.json` | 24 entries: 12 `should_trigger:true` + 12 `false` | Forward: does `lz-red` fire on RED intent and stay quiet on near-misses |
| `.claude/skills/lz-red-workspace/evals/reciprocal-red.json` | 12 entries, ALL `should_trigger:false` | **The reciprocal set.** The 12 RED positives re-tagged false, fed to EACH sibling skill-path; both siblings must stay quiet |
| `.claude/skills/lz-red-workspace/evals/heldout-d09.json` | 13 entries: 7 true / 6 false | The independent held-out set the shipped D-09 widen was validated on |
| `.claude/skills/lz-red-workspace/evals/d07-chunks/negatives.json` | dual-write of the 12 negatives | What the chunked spec runner reads |

`check-evals.mjs` enforces the dual-writes as a build-time lint, fail-closed (its header, clauses 5
and 6): the negatives must be byte-consistent with `d07-chunks/negatives.json` (same strings, same
order), and `reciprocal-red.json` must be byte-consistent with the `should_trigger:true` positives
re-tagged false. **Consequence:** you cannot edit one set without editing its mirror, and
`check-evals.mjs` will catch a one-sided edit. Clause 7 also runs the email allowlist-inversion over
every eval file, and clause 8 over every `e2e-red-*` suite's authored files -- another reason the
routing suite's name matters (Finding 7): named `e2e-rgr-routing`, its `suite.json`/`prompts/*.md`
would NOT be hygiene-scanned by clause 8. **Recommendation:** widen clause 8's glob to cover the new
suite dir explicitly, in the same Wave 0 as the `check-hygiene.mjs` widen.

### Scoping the regression round

The reciprocal probe is the one D-06 forces. Commands (BUILD-then-HALT; present, never run) are
already written out at `EVAL-RESULTS.md` L382-399 and need only the model pin refreshed.

| Question | Answer |
|----------|--------|
| Which sets must change if `lz-refactor`'s exclusion clause names a SECOND destination? | **Probably none, and that must be verified rather than assumed.** `reciprocal-red.json` is a fixed re-tagging of the RED positives; it tests that `lz-refactor` stays QUIET on RED intent. Naming `lz-red` as a destination inside `lz-refactor`'s description makes that exclusion clause mention `lz-red` -- which is a plausible way to make `lz-refactor` MORE likely to fire on a RED prompt (a description that names a concept can trigger on it). So the existing 12 reciprocal negatives are exactly the right regression check and need no data change. |
| Is any NEW eval data needed? | Yes, one gap: there is no reciprocal set in the OTHER direction for the new two-hop clause -- no set of "add new behavior, nothing failing yet" prompts. Recommend adding >= 2 such queries to `trigger-eval.json`'s positives (they SHOULD trigger `lz-red` under D-02) with the mirrored dual-writes, and note that this changes the 12/12 split `check-evals.mjs` asserts (it requires `>= 8` each, so growth is fine). |
| Char budget | `lz-refactor` 1,245 -> must stay <= 1,536 (291 chars of headroom). Assert the measurement as a task check. |
| What else is mandatory | `/reload-plugins` after the description edits land, run by the OWNER (D-19). Committed is not live -- a standing rule on this repo. |

## State of the Art

| Old approach (this repo) | Current approach | When changed | Impact |
|--------------------------|------------------|--------------|--------|
| Presence needle as a cross-skill guard (SEAM-02, TD-02) | Parsed-table semantic gate | This phase (D-15) | Closes the F-1 ceiling. Presence guards are KEPT (D-16) -- they hold the zero-occurrence regression the semantic gate does not. |
| Deterministic phrase-set grader over coaching prose | Closed-label destination extraction + blind judge on ambiguity | This phase (D-12), after Phase 20's ~3x inflation | The metric becomes a label, not a vocabulary match. |
| Passive skill content as the lever | Active forcing-function steps in `SKILL.md` | 2026-07-17, after 5 null passive probes | Directly relevant: variant C moves content from body to reference -- i.e. the OPPOSITE direction from the one lever measured to work on this repo. Name this in the writeup. |
| Reference file cited from the reference LIST | Content inlined in the body | 2026-08-02 (build-treatment D-04) | Measured zero-of-six retrieval on a cited reference. Finding 3. |
| Verbatim `--arm` token edits | New arm-group tokens (`d12`) | Phase 21 | Preserves byte-pinned selfcheck dry-runs. Follow it for `placement`. |

**Deprecated / not applicable:**

- `grade-run.mjs` for this corpus -- structurally bound to the 10 Phase-20 scenarios via
  `RUBRICS[0-9]` with selfcheck-enforced count alignment. Reuse `occursAffirmed` and the
  preliminary/judge/merge SHAPE; write a sibling grader.
- The vendored `skill-creator-eval` trigger flow for placement -- barred by D-11 (byte-identical
  descriptions). It remains the correct instrument for the D-06 regression.
- `tabulate-mechanical-red.mjs` as-is -- hard-wires `red-grade.json` and the `results/apply/...`
  walk. Parameterize or write a thin sibling; keep Phase 21's path as the default.

## Assumptions Log

| # | Claim | Section | Risk if wrong |
|---|-------|---------|---------------|
| A1 | DMN "unique hit policy", "masked"/"subsumed" rule are the standard terms for the at-most-one and shadowed-rule checks | Decision-Table Prior Art | Cosmetic. The checks themselves are specified by D-15 independently of what they are called. |
| A2 | Reciprocal exclusion clauses in each `description` are the mechanism enforcing the sibling boundary | Skill Loading Semantics | Low. It is this repo's own design (SKL-03) and EVL-01 measured 12/12 + 12/12 reciprocal specificity. If the real mechanism is broader, the D-06 regression round measures the outcome either way. |
| A3 | Naming a second destination inside `lz-refactor`'s exclusion clause could make it MORE likely to fire on RED prompts | Trigger Regression | Low-moderate. This is the stated reason the existing 12 reciprocal negatives suffice unchanged. If the mechanism is different, the regression round still measures the right thing; only the rationale changes. |
| A4 | Naming the new suite outside `e2e-red-*` keeps `selfcheck-red.mjs` byte-unchanged | Finding 7 | Low -- `discoverRedSuites()`'s filter (`name.startsWith('e2e-red-')`) was read directly. Residual risk is a DIFFERENT auto-discovery elsewhere; the plan should re-grep for `e2e-` globs before committing to the name. |
| A5 | k=1 x 9 cases x 3 arms is enough to SCREEN for a placement effect | A/B Instrument | Moderate, and deliberately accepted by D-13's two-stage design. A small true effect will be missed at stage 1; the writeup must state the power bound rather than report a null as parity. |
| A6 | A `matchTokens` set-membership match is a faithful way to bind a corpus case to an authored branch | Guard Design | Moderate. It makes the guard structural rather than semantic. Mitigation: mutation 7 (reworded-but-correct branch must stay GREEN) plus stating the boundary in the checker header so the guard is never read as a claim about model behavior. |
| A7 | `plugins/lz-tdd/references/` should take ALL THREE hygiene axes (like lz-red), not two (like lz-tpp) | Finding 8 | Low. `beck-tdd-by-example.md`'s own Sources block declares it unowned / own-words / DST-04-clean, which is the lz-red treatment. If the owner prefers the lz-tpp carve-out, only the no-verbatim axis changes. |

## Open Questions

1. **Which surface set does the guard target in Wave 0, given the winner is unknown?**
   - What we know: D-17 requires fail-closed on the canonical location, and the winner is decided by
     a gated run that may not happen inside this phase.
   - What's unclear: whether the plan should ship a variant-A-shaped guard now and flip a constant
     later, or gate the guard's canonical-location assertion behind the run.
   - Recommendation: target the surface set common to all three variants (the three step-1 blocks +
     Findings 1 and 2's surfaces) in Wave 0, with the canonical-shared-table assertion in a separate
     labeled check that is only ADDED when the winner is known. That keeps Wave 0 RED-then-GREEN
     without depending on a metered run, and keeps D-17's no-skip rule intact for whatever ships.

2. **Does the phase ship a variant before the A/B runs?**
   - What we know: D-09 says "author all three variants, measure, ship only the winner", and D-14
     says no metered command runs inside this phase's execution.
   - What's unclear: those two together mean the phase can complete with NO variant shipped, leaving
     `plugins/lz-tdd` in variant-A shape (which is a legitimate variant) but with the placement
     decision formally open and PR #3 still held.
   - Recommendation: plan for variant A to be the TRACKED tree (it needs no generated copy and is
     the composition anchor `selfcheck-red.mjs` already asserts). The phase then completes with the
     classifier FIXED and the placement question BUILT-and-HALTED. Make that explicit in the phase's
     own success framing so "no variant shipped" is not later read as an incomplete phase.

3. **Does reconciling `beck-tdd-by-example.md` (Finding 2) need an oracle-reviewer gate?**
   - What we know: the file is `Unowned; high-confidence core only, no-oracle` per its own Sources
     block, and its Fowler Ch.4 row IS `Owned; oracle-verified`.
   - What's unclear: whether editing the `## The seam with lz-tpp` section touches the oracle-verified
     Fowler claim (it should not -- the seam section is orchestration prose, not a book claim).
   - Recommendation: scope the edit to the seam section and the L3-5 scope line only, leave every
     Sources row untouched, and have the ORCHESTRATOR run the standard unprimed review rather than an
     oracle-reviewer gate. Escalate to oracle-reviewer only if the edit touches a book-backed claim.

4. **Where does the A/B writeup live?**
   - CONTEXT leaves it to discretion.
   - Recommendation: a phase-scoped sibling (`ROUTING-AB-RESULTS.md`). `EVAL-RESULTS.md` is 515 lines
     of frozen EVL-01/EVL-02 evidence with a hand-maintained structure; appending a fourth eval to it
     invites the drift the REQUIREMENTS.md DRIFT NOTICE documents. A sibling also means the
     reconcile-on-completion step has one obvious file to update.

## Environment Availability

| Dependency | Required by | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js (builtins only) | every checker / builder / grader | yes | (fnm-managed; `run-e2e.mjs` requires `node:*` only) | none needed |
| `claude` CLI | `claude plugin validate .`; the gated metered runs | yes | validate exits 0 `[VERIFIED: ran]` | none |
| `claude.exe` native binary | `run-e2e.mjs` `resolveClaude()` | yes (resolved by prior rounds) | -- | `CLAUDE_BIN` env override |
| Python 3 + vendored `skill-creator-eval` | the D-06 trigger regression (`python -m scripts.run_eval`) | yes (used in prior rounds) | -- | the canary-gated chunk runners (`run-recall-chunks.mjs`) |
| `rg` | inspecting gitignored `out/` variant trees | yes | 14.1.0 | none (`git grep` cannot see `out/`) |
| `out/` gitignored | staging the variant trees | yes -- `.gitignore` line 7 | -- | none needed |
| `.gitignore` coverage for the NEW suite's run tree | per-run eval byproducts must not be committed | **NO -- gap** | -- | see below |

**Missing with no fallback:** none.

**Missing with a fallback / action required:**

- **`.gitignore` coverage for a suite named `e2e-rgr-routing`.** The existing lines are
  `e2e-red-*`-anchored (`.claude/skills/lz-red-workspace/e2e-red-*/**/results*/` etc.). The generic
  `.claude/skills/lz-red-workspace/**/results*/` and `**/run-*/` lines DO cover it, and
  `**/outputs/` is covered by the `*-workspace` rule -- so basic coverage exists. But the
  explicit-line convention (the file's own comments explain why the `e2e-red-*` lines were added even
  though generic lines covered them: "these explicit e2e-red-* lines make the new suite's run tree
  unambiguous") means the plan should add matching explicit lines. Also add a line for any new
  rollup JSON, mirroring `mechanical-red.json`.
- **`check-hygiene.mjs` scope** does not reach `plugins/lz-tdd/references/` (Finding 8) -- must be
  widened in Wave 0, with the file-count assertion updated so the widen is provably non-vacuous.
- **`check-evals.mjs` clause 8** globs `e2e-red-*` suites only -- widen to the new suite dir so its
  authored prose takes the ASCII + email allowlist scan.

## Validation Architecture

Test framework: none in the conventional sense. This repo's shipped artifact is dependency-free
Markdown; validation is a battery of node-builtins checkers plus zero-spend `--selfcheck` modes plus
orchestrator-run subagent reviews. That IS the framework, and CONVENTIONS.md codifies it.

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Node-builtins checker battery per workspace (`npm run check`) + per-script `--selfcheck` modes. No test runner, no framework, no config file (CONVENTIONS.md L52) |
| Config file | `.claude/skills/lz-red-workspace/package.json` and `.claude/skills/lz-refactor-workspace/package.json` (`scripts.check`) |
| Quick run command | `node .claude/skills/lz-red-workspace/tools/check-rgr-routing.mjs` (the new gate alone; < 2s) |
| Full suite command | `npm --prefix .claude/skills/lz-red-workspace run check && npm --prefix .claude/skills/lz-refactor-workspace run check && claude plugin validate .` |

Measured baseline this session: lz-red battery exits 0 at "125 checks, equal to the PREDICTED
literal; all 13 new labels present; none of the 64 retired labels survive". `check-hygiene.mjs` exits
0 at `files: 197` (ASCII 197 clean, no non-allowlisted emails, no-verbatim 190 clean).
`claude plugin validate .` and `--strict` both exit 0.

### Phase Requirements -> Test Map

| Req | Behavior | Test type | Automated command | Exists? |
|-----|----------|-----------|-------------------|---------|
| CLS-01 | Every corpus case has exactly one named owner; no bare catch-all terminal on any of the (>=) 4 in-scope classifier surfaces | unit (parsed-table) | `node .claude/skills/lz-red-workspace/tools/check-rgr-routing.mjs` -> the `exhaustive` + `no bare catch-all` labels | NO -- Wave 0 |
| CLS-01 | The guard actually fails when a catch-all returns, when a positive branch is deleted, when a heading is renamed, and when the target file vanishes; and does NOT fail on an incidental mention or a reworded-but-correct branch | unit (mutation, both directions) | `node .claude/skills/lz-red-workspace/tools/check-rgr-routing.selftest.mjs` (8 mutations, incl. the anti-vacuity control) | NO -- Wave 0 |
| CLS-02 | No corpus case is claimed by two of the three step-1 procedures | unit (parsed-table) | same checker -> the `at-most-one` label | NO -- Wave 0 |
| CLS-02 | Test-code ownership follows the ask (corpus cases 3 and 5 route to different owners) | unit (corpus) | same checker; cases 3 and 5 are distinct corpus rows | NO -- Wave 0 |
| CLS-03 | Zero routing or mode-selection branches key on test state, across all in-scope surfaces | unit (parsed-table) | same checker -> the `single-axis` label; positive AND negative control in the selftest | NO -- Wave 0 |
| CLS-03 | `lz-refactor/SKILL.md:139`'s sweep rule cites a rule step 1 actually contains | unit (region-scoped) | same checker -> a `citation resolves` label parsing step 1 for the cited rule | NO -- Wave 0 |
| CLS-04 | The guard fails closed on a missing canonical location; no `existsSync` skip anywhere in it | unit (mutation 5) | selftest mutation 5: delete the target, expect exactly one attributable FAIL | NO -- Wave 0 |
| CLS-04 | `check-red-references.mjs` label arithmetic is untouched | regression | `npm --prefix .claude/skills/lz-red-workspace run check` -> the roster label must still read `125 checks ... all 13 new labels present ... none of the 64 retired labels survive` | YES (exists; assert unchanged) |
| CLS-05 | The three variant trees exist, differ from `plugins/lz-tdd` exactly as declared, and carry BYTE-IDENTICAL `description` frontmatter per skill | unit (build assertions + selfcheck) | `node .claude/skills/lz-red-workspace/variants/build-variants.mjs` then `node .claude/skills/lz-red-workspace/selfcheck-routing.mjs` | NO -- Wave 1/2 |
| CLS-05 | All three arms compose with distinct `--plugin-dir` values and byte-identical `-p` prompts | unit (dry-run argv) | `selfcheck-routing.mjs` (parses `run-e2e.mjs --dry-run` argv, the crux-1/2 pattern) | NO -- Wave 2 |
| CLS-05 | The destination grader classifies exactly-one / multi / none correctly, treats exclusion clauses as non-destinations, and refuses to emit a final grading while judge items remain | unit (fixtures) | `node .claude/skills/lz-red-workspace/grade-routing.mjs --selfcheck` | NO -- Wave 2 |
| CLS-05 | Judge merge is fail-closed and the pre-aggregate gate blocks an unmerged run | unit | `node .claude/skills/lz-red-workspace/merge-judge.mjs --selfcheck` | YES |
| CLS-05 | Pass@k / Pass^k compute correctly over fixtures | unit | `node .claude/skills/lz-red-workspace/tabulate-mechanical-red.mjs --selfcheck` | YES (assert unchanged after the `--grade-file` param) |
| CLS-05 | Corpus and eval prompts are derived from ONE source (one prompt file per corpus case, ids matching) | unit | `selfcheck-routing.mjs` | NO -- Wave 2 |
| CLS-05 | ROUTING CORRECTNESS per arm, Pass@k / Pass^k, substance-only headline, read-rate per arm | **manual-only (metered, HALT-gated)** | presented in `e2e-rgr-routing/RUN-GATE.md`, never executed (D-14) | NO -- gated |
| D-06 / SC5 | Descriptions stay within the 1,536-char per-entry cap | unit | a measurement assertion in the routing checker or a task check; measured today 1233 / 750 / 1245 | NO -- Wave 0/1 |
| D-06 / SC5 | Trigger reciprocal specificity does not regress after the description edits | **manual-only (metered, HALT-gated)** | `EVAL-RESULTS.md` L382-399 commands, presented not run (D-14) | data exists; run gated |
| D-19 | Shipped tree ASCII-only, email allowlist-inversion clean, no-verbatim -- INCLUDING `plugins/lz-tdd/references/` | unit (widened scope) | `npm --prefix .claude/skills/lz-refactor-workspace run check` -> `check-hygiene.mjs`, file count 197 -> 199+ | YES but SCOPE-INCOMPLETE (Finding 8) -- widen in Wave 0 |
| D-19 | Eval-set shape + hygiene over the new suite's authored prose | unit (widened glob) | `node .claude/skills/lz-red-workspace/check-evals.mjs` | YES but clause-8 glob is `e2e-red-*`-anchored -- widen |
| D-19 | Plugin structure legal | unit | `claude plugin validate .` (and `--strict`) | YES |
| D-18 / SC7 | All three shipped skills pass a fresh acceptance review with >= 1 from-scratch UNPRIMED reviewer | **manual-only (ORCHESTRATOR)** | orchestrator spawns reviewers after the executor returns; `gsd-executor` has no Agent tool | N/A -- process gate |

### Sampling Rate

- **Per task commit:** `node .claude/skills/lz-red-workspace/tools/check-rgr-routing.mjs` plus that
  task's own `--selfcheck` (each < ~5s).
- **Per wave merge:** both workspace batteries plus `claude plugin validate .`
  (`npm --prefix ... run check` x2, exit 0 each).
- **Phase gate:** full battery GREEN + `validate .` exit 0 + every `--selfcheck` GREEN + the
  widened hygiene scope proven non-vacuous by its file count + the ORCHESTRATOR's unprimed acceptance
  review + BOTH metered rounds presented and HALTED.

### Coverage boundary -- state it explicitly

The deterministic layer proves the AUTHORED CLASSIFIER is exhaustive, disjoint and single-axis over
the corpus. It does NOT prove a model ROUTES correctly -- that is CLS-05's metered eval, which is
manual-only by D-14. Do not let a GREEN battery be read as a routing-correctness verdict; this repo
has recorded that failure mode twice ("THE BATTERY IS NOT THE GATE", STATE.md 2026-07-29), and this
phase exists because a 125/125 green battery coexisted with a non-exhaustive classifier. The checker's
header must say so.

### Wave 0 Gaps

- [ ] `.claude/skills/lz-red-workspace/tools/check-rgr-routing.mjs` -- CLS-01, CLS-02, CLS-03, CLS-04. **ASSERTED RED against today's tree before any content lands.**
- [ ] `.claude/skills/lz-red-workspace/tools/check-rgr-routing.selftest.mjs` -- 8 mutations, both directions, incl. the anti-vacuity control
- [ ] `.claude/skills/lz-red-workspace/tools/lib/routing-parse.mjs` -- the `(condition -> destination)` parser
- [ ] `.claude/skills/lz-red-workspace/tools/lib/section-body.mjs` -- copied from the lz-refactor workspace (Finding 5; duplicate, do not cross-import)
- [ ] the corpus JSON -- 9 cases, header declaring cases 5-9 RECONSTRUCTED (Finding 10)
- [ ] `check-hygiene.mjs` scope widen + updated file-count assertion (Finding 8)
- [ ] `check-evals.mjs` clause-8 glob widen for the new suite dir
- [ ] `.gitignore` explicit lines for the new suite's run tree + rollup
- [ ] `package.json` `scripts.check` wiring for `check-rgr-routing.mjs` (D-16)

Wave 2 gaps (A/B instrument): `variants/build-variants.mjs`, `grade-routing.mjs` + fixtures +
`--selfcheck`, `selfcheck-routing.mjs`, `e2e-rgr-routing/{suite.json,targets.json,prompts/,RUN-GATE.md}`,
`run-e2e.mjs` arm additions, `tabulate-mechanical-red.mjs` `--grade-file` param.

## Security Domain

`workflow.security_enforcement` is not present in `.planning/config.json`; treated as enabled.
This phase ships no code that runs in production and no network surface -- the deliverable is
Markdown plus dev-only local scripts. ASVS applicability is therefore narrow but not empty.

### Applicable ASVS Categories

| ASVS category | Applies | Standard control |
|---------------|---------|-----------------|
| V2 Authentication | no | No auth surface. |
| V3 Session Management | no | No sessions. |
| V4 Access Control | no | No multi-user surface. |
| V5 Input Validation | **yes (narrow)** | The new checkers/graders parse repo-local Markdown and JSON. Fail-loud on unrecognized-but-present input (CONVENTIONS.md L118), fail-closed on unreadable input (the TD-02 `try/catch -> ""` idiom), and regex-escape every heading interpolated into a `RegExp` (`section-body.mjs` already does). |
| V6 Cryptography | **yes (integrity use only)** | sha256 via `node:crypto` for tree/frontmatter identity assertions -- integrity comparison, not secrecy. Never hand-roll; `build-treatment.mjs`'s `hashFile`/`hashTree` is the pattern. |
| V12 Files and Resources | **yes** | `build-variants.mjs` starts with a recursive delete. Keep `build-treatment.mjs`'s destination-safety asserts VERBATIM in spirit: destination hardcoded with NO env override, asserted inside the repo root, asserted to end in `out/<expected-name>`, all BEFORE anything is deleted. |
| V14 Configuration | **yes** | Public-repo hygiene: allowlist-inversion for emails; never encode the forbidden value as a needle; the maintainer's author/committer email must be the public gmail. |

### Known Threat Patterns

| Pattern | STRIDE | Standard mitigation |
|---------|--------|---------------------|
| Recursive delete on a mis-resolved path (`out/` builder) | Destruction / DoS | Hardcoded destination, no env override on the destructive target, in-repo assert + exact-suffix assert before any `rm`. Env override allowed ONLY where the path is read (`run-e2e.mjs`'s `--plugin-dir` consts). |
| A silently-vacuous guard (missing file -> emits nothing -> reads as clean) | Tampering (undetected) | D-17: no `existsSync` skip; `try/catch -> ""` so `report()` runs once per run. Anti-vacuity control in the selftest. Roster/scan-floor count assertions. |
| Maintainer work-email or its bare domain reaching a committed file | Information disclosure | Allowlist-inversion over the widened scope (Finding 8 closes the two-file hole). NEVER write the forbidden value as a needle -- that is itself the leak. |
| Verbatim copyrighted book prose entering the shipped tree | Legal / IP | `check-hygiene.mjs` no-verbatim axis (`QUOTE_THRESHOLD` 120 chars) over the widened scope; `.oracle/` stays gitignored; main context never reads it. Relevant here because Finding 2's edit touches a distillation file. |
| A metered eval run firing without owner approval | Unauthorized resource use | D-14 double HALT. `RUN-GATE.md` is documentation; no plan task executes a `claude -p` command. |
| Non-ASCII bytes reaching a public ASCII-only tree | Integrity / tooling breakage | `check-hygiene.mjs` axis (a) over the widened scope; ASCII-only in every authored string including checker report labels. |

## Sources

### Primary (HIGH confidence -- measured in this session)

- `plugins/lz-tdd/skills/{lz-red,lz-tpp,lz-refactor}/SKILL.md` -- read in full; all line refs verified
- `plugins/lz-tdd/skills/lz-red/references/{three-laws-and-test-selection.md,principle-backing.md,vitest-typescript-mechanics.md}` -- routing + backing surfaces (Findings 1, 6)
- `plugins/lz-tdd/references/beck-tdd-by-example.md` -- the shared-tier router (Finding 2)
- `.claude/skills/lz-red-workspace/tools/check-red-references.mjs` (1137 lines) -- header doctrine, SEAM-02/TD-02 blocks, `EXPECTED_CHECKS = 125` arithmetic, `NEW_LABELS`, `wholeText` idiom, N2/G17 walks
- `.claude/skills/lz-red-workspace/tools/lib/{pipe-table.mjs,row-guards.mjs,provenance-honesty.mjs,scaffold-phrases.mjs}` -- inventory; Finding 5 verified by `ls` + `diff` + import scan
- `.claude/skills/lz-refactor-workspace/tools/lib/{section-body.mjs,heading-scan.mjs}` -- read; workspace location verified
- `.claude/skills/lz-refactor-workspace/tools/check-hygiene.mjs` -- scope construction; Finding 8 computed as a set difference and confirmed by running the checker
- `.claude/skills/lz-refactor-workspace/e2e-nx/run-e2e.mjs` (1137 lines) -- arm composition, `--suite`, `recommend` tool-blocking, trigger-fact separation, arm-group tokens, crux-6 pin
- `.claude/skills/lz-red-workspace/treatment/build-treatment.mjs` -- variant-tree pattern, fail-closed doctrine, measured zero-retrieval note (Finding 3)
- `.claude/skills/lz-red-workspace/selfcheck-red.mjs` (3314 lines, targeted reads) -- `discoverRedSuites()`, cruxes 1/2, `STATE_CLAIM_TOKENS` (Finding 7)
- `.claude/skills/lz-red-workspace/{grade-run.mjs,merge-judge.mjs,tabulate-mechanical-red.mjs,check-evals.mjs}` -- grading pipeline, `occursAffirmed`, Pass@k, dual-write lint
- `.claude/skills/lz-red-workspace/EVAL-RESULTS.md` -- the EVL-02 grader trap and the orchestrator run flow (Finding 9)
- `.claude/skills/lz-red-workspace/evals/*.json` -- entry counts measured (24 / 12 / 13)
- `.planning/quick/260803-53q-.../260803-53q-REVIEW.md` -- F-1 measured ceiling; the three recoverable traced requests (Finding 10)
- `.gitignore`, `.planning/config.json`, `.planning/codebase/CONVENTIONS.md`, `AGENTS.md`, `CLAUDE.md`
- `claude plugin validate .` and `--strict` -- both exit 0; lz-red battery 125/125 exit 0; hygiene 197 files exit 0

### Secondary (MEDIUM confidence -- official docs, fetched via markdown.new)

- `https://docs.claude.com/en/docs/claude-code/skills` -- skill-content lifecycle, description-in-context vs body-on-invoke, supporting files, 1,536-char cap, listing budget, 500-line tip
- `https://docs.claude.com/en/docs/claude-code/plugins-reference` -- the placeholder-substitution table ("Skill and agent content: Anywhere the placeholder appears"), `${CLAUDE_PLUGIN_ROOT}` definition, standard plugin layout
- `https://docs.claude.com/en/docs/claude-code/plugins` -- plugin-root rules, `skills/` auto-discovery
- `https://en.wikipedia.org/wiki/Decision_table` -- "balanced or complete"; don't-care cells

### Tertiary (LOW confidence -- flagged for validation)

- Sibling-skill selection algorithm: **not documented and not verified.** Docs give behavioral advice
  only. Recorded as A2.
- DMN hit-policy / masked-rule terminology: `[ASSUMED]` (A1).
- **Tool limitation, stated so it is not mistaken for a completed search:** `WebSearch` returned an
  environment configuration error on every attempt this session, and no MCP research providers
  (`context7`, `exa`, `tavily`, `brave`, `firecrawl`) were available -- `.planning/config.json` has
  all four search flags `false`. External findings therefore rest on direct doc fetches
  (`markdown.new`) plus one Wikipedia page. Both external questions (RQ1, RQ5) were answerable from
  primary docs, so the gap is bounded to community corroboration on RQ1's sibling-selection sub-question
  and to DMN terminology on RQ5 -- neither of which changes a plan decision.

## Metadata

**Confidence breakdown:**

- **Surface inventory / repo mechanics: HIGH.** Every file read; every line number verified; the
  battery, hygiene checker and validator all run this session with recorded output.
- **Guard design: HIGH.** Every primitive is an existing in-repo pattern read this session, and the
  F-1 ceiling closure is structural (heading as parse input) rather than a stronger needle.
- **A/B instrument: HIGH on mechanics** (arm composition, `--suite`, tool blocking, variant builder,
  gitignore, selfcheck collision) -- all read directly. **MEDIUM on design adequacy:** k=1 screening
  power is a deliberate accepted bound (A5), and the corpus is reconstructed (Finding 10).
- **Grading design: MEDIUM-HIGH.** The trap is documented and the metric change is principled; the
  `matchTokens` binding (A6) and the normalization-for-blinding step are new to this repo and unproven.
- **Claude Code loading semantics: MEDIUM.** Official docs, quoted; the sibling-selection algorithm
  is not documented (A2).
- **Decision-table prior art: LOW.** One reachable source; DMN terms assumed (A1). Deliberately
  under-invested per the research brief.

**Research date:** 2026-08-03
**Valid until:** 2026-09-02 for the repo findings (stable; they change only when the phase edits
them). **7 days** for the Claude Code loading semantics -- the docs carry live `min-version` markers
(2.1.196 / 2.1.202 / 2.1.215 / 2.1.218), so the skill-listing budget, re-invocation behavior and
compaction budget are actively changing across patch releases. Re-check the 1,536-char cap and the
placeholder-substitution table before relying on either in a shipped decision.
