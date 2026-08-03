# Phase 22: Three-way classifier correctness (lz-refactor + lz-red) - Context

**Gathered:** 2026-08-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Every request in the red-green-refactor loop lands with exactly one skill. The three sibling
request classifiers (`lz-red`, `lz-tpp`, `lz-refactor`) become exhaustive (nothing falls through),
mutually exclusive (no two skills claim the same request), and keyed on a single axis (what the
developer is asking for). The loop the milestone claims to complete actually closes.

Scope covers the classifier surfaces only -- each skill's `## Two modes` gate, its
sibling-seam narrative section, its coach-procedure step 1, plus the two mechanical defects the
same review found (step 6's reference router, the `lz-refactor/SKILL.md:81` dangling
cross-reference). Catalog content, reference leaves, and coach steps 2-5 are NOT in scope except
where a routing branch is stated inside them.

Two owner decisions expand this beyond the ROADMAP's written boundary and are recorded as
decisions below: (1) the routing content's PLACEMENT is decided empirically by a folded-in 3-arm
A/B eval rather than by argument, and (2) `description` frontmatter is in scope, which requires a
metered trigger-eval regression round. PR #3 stays held for the full cycle.

</domain>

<decisions>
## Implementation Decisions

### Classifier semantics

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

### Scope

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

### Placement: decided empirically, folded into this phase

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

### Guard (SC6)

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

### Validation and review

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

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Origin of the defect (read first)

- `.planning/quick/260803-53q-close-td-02-widen-the-lz-refactor-seam-s/260803-53q-REVIEW.md` -- the
  full finding list (1 BLOCKER, 2 IMPORTANT, 4 MINOR), the eight traced developer requests, the
  orchestrator's pre-existing-vs-regression adjudication, the measured guard ceiling (F-1), and the
  owner's 2026-08-03 scope decision. This is the phase's source of truth for WHAT is broken.
- `.planning/quick/260803-53q-close-td-02-widen-the-lz-refactor-seam-s/260803-53q-CONTEXT.md` --
  TD-02's own D-01..D-04, including the route-on-intent rule this phase generalizes.
- `.planning/quick/260803-53q-close-td-02-widen-the-lz-refactor-seam-s/260803-53q-PLAN.md` and
  `-SUMMARY.md` -- the guard as shipped and its disclosed limits.

### The three classifier surfaces to edit

- `plugins/lz-tdd/skills/lz-refactor/SKILL.md` -- frontmatter description (L3-17); `## Two modes`
  test-state gate (L28-35); sibling-seam narrative (L37-45); coach step 1 (L49-53, the only
  positive-condition "otherwise" of the three); step 4's pointer to the non-existent section (L81);
  step 6's incomplete reference router (L115-117); the unnamed QUESTION/COMMAND paragraph
  (L119-126); the sweep rule citing a missing step-1 rule (L139).
- `plugins/lz-tdd/skills/lz-red/SKILL.md` -- description (L3-15); `## Two modes` (L26-34);
  sibling-seam narrative with the catch-all (L36-42); coach step 1 (L57-61).
- `plugins/lz-tdd/skills/lz-tpp/SKILL.md` -- description (L3-12); `## Two modes` test-state gate
  (L21-28); sibling-seam narrative with the catch-all (L36-44); coach step 1's green-phase
  precondition (L53-57).
- `plugins/lz-tdd/references/beck-tdd-by-example.md` -- the plugin-wide shared-reference precedent
  (cited from `lz-red` via `${CLAUDE_PLUGIN_ROOT}`); the model for variants B and C.

### Instruments and guards

- `.claude/skills/lz-red-workspace/tools/check-red-references.mjs` -- the SEAM-02 and TD-02
  cross-skill guards (this file already reads all three shipped `SKILL.md` files), the label-count
  arithmetic D-16 must not perturb, and the fail-closed / silent-vacuous-pass doctrine in its
  header.
- `.claude/skills/lz-refactor-workspace/tools/check-hygiene.mjs` -- the cross-skill ASCII /
  email-allowlist-inversion / no-verbatim axes that must stay GREEN.
- `.claude/skills/lz-red-workspace/package.json` and
  `.claude/skills/lz-refactor-workspace/package.json` -- the two `npm run check` batteries.
- `.planning/codebase/CONVENTIONS.md` -- authoring and harness conventions: per-script header
  block, `report()` accumulator, the three named failure modes (fail-loud / fail-closed /
  fail-safe scan-floor), ASCII-only, blank-line-around-control-flow, always-brace.

### Eval precedent for the placement A/B

- `.claude/skills/lz-red-workspace/EVAL-RESULTS.md` -- EVL-01 (trigger, 92%/100% pre-widen) and
  EVL-02 (behavior). Read the EVL-02 record specifically for the vocabulary-proxy grader trap that
  D-12 exists to avoid, and for the finding that the measured edge is concentrated in
  classify-first (which D-10 puts at risk).
- `.claude/skills/lz-red-workspace/e2e-red-gilded-rose/EVAL-RESULTS.md` -- EVL-03's substance-only
  headline structure, Pass@k / Pass^k reporting, and unbiased-reviewer slot.
- `.claude/skills/lz-refactor-workspace/` (`run-e2e.mjs`, `tabulate-mechanical.mjs`) -- the
  `--plugin-dir` arm-composition and EDITED-vs-PREEDIT variant toggle D-11 reuses.

### Planning documents

- `.planning/ROADMAP.md` Phase 22 -- goal, seven success criteria, "also in scope", and the risk
  note that a `description` change requires a trigger-eval round (D-06 triggers it).
- `.planning/REQUIREMENTS.md` -- CLS-01..CLS-04 are to be ADDED here at plan time, plus one new
  requirement for the placement A/B (D-08..D-13). Mirror the existing
  `- [ ] **ID**: text` shape and add Traceability rows.
- `AGENTS.md` -- public-repo hygiene: maintainer-scoped allowlist-inversion, never encode the
  forbidden value as a needle.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets

- **The cross-skill read pattern already exists.** `check-red-references.mjs` reads
  `lz-tpp/SKILL.md` (SEAM-02) and `lz-refactor/SKILL.md` (TD-02) from the `lz-red` workspace, with
  a commented `..` walk to `repoRoot`. `check-rgr-routing.mjs` inherits this shape rather than
  inventing one.
- **The plugin-wide shared reference mechanism exists and ships today.**
  `plugins/lz-tdd/references/beck-tdd-by-example.md`, cited as
  `${CLAUDE_PLUGIN_ROOT}/references/beck-tdd-by-example.md`. Variants B and C need no new
  mechanism, only a second file in that directory.
- **`--plugin-dir` arm composition and the variant toggle** are built and selfchecked in
  `run-e2e.mjs` (lz-refactor workspace) and were used for the prior placement probes. The A/B needs
  a third arm, not a new harness.
- **Graders and stats:** `grade-run.mjs` (phrase matchers, `occursAffirmed`, judge dimensions),
  `tabulate-mechanical-red.mjs` (Pass@k / Pass^k), `merge-judge.mjs` (fail-closed merge).
- **Shared libs:** `tools/lib/heading-scan.mjs` (`collectH1Lines`) and `tools/lib/section-body.mjs`
  (`sectionBody`, returns `null` when a heading is absent) -- `sectionBody` is the natural way to
  extract a step-1 block for parsing.

### Established Patterns

- **Instrument-first.** Every prior content phase here stood the checker up to an ASSERTED RED
  baseline before authoring content. Do the same: `check-rgr-routing.mjs` must be RED against
  today's tree and go GREEN only when the classifier is fixed.
- **Progressive disclosure with a lean router.** `SKILL.md` carries a decision procedure plus
  links and never restates reference content; under ~500 lines. All three current files are 90-190
  lines -- variants must not bloat them.
- **Provenance identifiers in prose** (`D-04`, `TD-02`, `DST-04`, dated owner decisions) are
  preserved when editing; they tie content to planning decisions.
- **Orchestrator-run gates.** Oracle-reviewer, skill-reviewer, and unbiased acceptance reviews are
  spawned by the ORCHESTRATOR after the executor returns. Plans must phrase them that way or they
  are unexecutable.

### Integration Points

- Three shipped `SKILL.md` files under `plugins/lz-tdd/skills/*/`, plus (variants B/C) one new file
  under `plugins/lz-tdd/references/`.
- Two `npm run check` batteries, one new tool file, and the hygiene axes that scan both skill trees.
- `.gitignore` must cover any new per-run eval byproduct tree; no build dependency may enter
  `plugins/lz-tdd`.
- PR #3 (https://github.com/LayZeeDK/lz-engineering-claude-plugins/pull/3) is held for this phase
  and merges only after it closes.

</code_context>

<specifics>
## Specific Ideas

- The owner explicitly rejected deciding placement by argument: "Create and run A/B testing evals
  between the 3 options." The three arms are named in D-08 and must be measured, not reasoned about.
- The A/B should reuse the `skill-creator` A/B workflow and/or the existing skill-workspace setup
  rather than a new harness -- with the correction in D-11 that the trigger flow cannot discriminate
  these arms, so the body/behavior path is the one to use.
- The `/lz-tdd` entrypoint skill is the forward-looking reason variant C wins a tie (D-10). It is
  NOT built in this phase.
- Reviewer 1's suggested cheap tightening (require the sibling token on a line containing
  "hand off") is superseded by D-15's parsed-table gate, not layered on top of it.

</specifics>

<deferred>
## Deferred Ideas

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

</deferred>

---

*Phase: 22-three-way-classifier-correctness-lz-refactor-lz-red*
*Context gathered: 2026-08-03*
