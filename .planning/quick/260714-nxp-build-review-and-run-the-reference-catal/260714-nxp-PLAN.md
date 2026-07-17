---
quick: 260714-nxp
plan: 01
type: execute
wave: 1
depends_on: []
autonomous: false
requirements: [REF-EVAL]
files_modified:
  - .claude/skills/lz-refactor-workspace/e2e-reference/suite.json
  - .claude/skills/lz-refactor-workspace/e2e-reference/targets.json
  - .claude/skills/lz-refactor-workspace/e2e-reference/prompts/
  - .claude/skills/lz-refactor-workspace/e2e-reference/README.md
  - .claude/skills/lz-refactor-workspace/e2e-reference/REFERENCE-RESULTS.md
  - .claude/skills/lz-refactor-workspace/grade-reference.mjs
  - .claude/skills/lz-refactor-workspace/package.json

must_haves:
  truths:
    - "The instrument grades ONLY facts with a ground truth independent of the skill's own invented conventions (real book contents, real 1st->2nd-ed renames, real Refactoring-Directions-table MEMBERSHIP, real smell provenance) -- NOT the inferred To-vs-Towards semantics, the n/a sentinel, or the N:1 idiom groupings."
    - "The metric is the per-fact DELTA (invoke_skill_correct_rate - no_skill_correct_rate) computed with the SAME rubric on both arms; a positive delta on non-saturated independently-true facts is the only value signal."
    - "The metered claude -p RUN task cannot start until (a) the instrument is built AND (b) it has PASSED an unbiased review (neutral + adversarial) AND (c) the user has explicitly approved the spend."
    - "The grader is deterministic (mustName all/anyOf + mustNotClaim token assertions, word-bounded) with a --selfcheck that exits 0, and no LLM judge decides any core fact."
    - "The 2 saturation-control questions run on all arms so a discriminating-Q delta can be separated from a verbosity/citation artifact."
    - "The eval cwd contains NO copy of the shipped lz-refactor catalog, so the no_skill arm cannot read the answers off disk; the catalog reaches the skill arms only via --plugin-dir."
  artifacts:
    - path: ".claude/skills/lz-refactor-workspace/e2e-reference/suite.json"
      provides: "Suite config: 12 discriminating + 2 control prompts, all code:false, recommend-only, catalog-free cwd"
      contains: "\"code\": false"
    - path: ".claude/skills/lz-refactor-workspace/e2e-reference/targets.json"
      provides: "Per-question fact-key expectations (mustName all/anyOf, mustNotClaim, independent/control flags)"
      contains: "mustName"
    - path: ".claude/skills/lz-refactor-workspace/e2e-reference/prompts"
      provides: "14 neutral-phrasing question files (q1-q12 + qc1-qc2), ASCII, no near-verbatim book prose"
    - path: ".claude/skills/lz-refactor-workspace/grade-reference.mjs"
      provides: "Deterministic per-question grader + --aggregate (per-fact delta + Pass@k per arm) + --selfcheck"
      contains: "selfcheck"
    - path: ".claude/skills/lz-refactor-workspace/e2e-reference/REFERENCE-RESULTS.md"
      provides: "Honest verdict: per-fact delta, controls separately, class verdict + actionability caveat (NULL is a valid decisive outcome)"
  key_links:
    - from: ".claude/skills/lz-refactor-workspace/e2e-nx/run-e2e.mjs"
      to: ".claude/skills/lz-refactor-workspace/e2e-reference/suite.json"
      via: "--suite e2e-reference (reuse the existing runner; do NOT fork it)"
      pattern: "--suite"
    - from: ".claude/skills/lz-refactor-workspace/grade-reference.mjs"
      to: ".claude/skills/lz-refactor-workspace/e2e-reference/targets.json"
      via: "grader reads per-question expectations"
      pattern: "targets\\.json"
    - from: ".claude/skills/lz-refactor-workspace/grade-reference.mjs"
      to: ".claude/skills/lz-refactor-workspace/e2e-reference/results"
      via: "--aggregate walks results/recommend/<arm>/<qid>/run-<k>/answer.md"
      pattern: "answer\\.md"
---

<objective>
Build, unbiased-review, gate-approve, run, and grade a REFERENCE-CATALOG eval for the lz-refactor
skill -- the one untested value lever after the whole output-warrant loop concluded null/parity vs
base Opus 4.8.

Purpose: Measure whether the curated, oracle-verified reference catalog carries a real
correct-answer edge over base on look-up questions where base plausibly answers WRONG or VAGUE.
The metric is the per-fact DELTA (invoke_skill_correct_rate - no_skill_correct_rate), graded ONLY on
facts whose ground truth is independent of the skill's own conventions. A NULL result is a decisive,
valuable outcome (closes the last value lever).

Output: A reusable `e2e-reference/` suite (suite.json + prompts + targets.json), a deterministic
`grade-reference.mjs` (grader + aggregate + selfcheck), and a REFERENCE-RESULTS.md verdict.

Follows the design in
`.planning/quick/260714-nxp-build-review-and-run-the-reference-catal/260714-nxp-RESEARCH.md`.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
</execution_context>

<context>
@.planning/quick/260714-nxp-build-review-and-run-the-reference-catal/260714-nxp-RESEARCH.md
@.planning/STATE.md
@AGENTS.md

<!-- The harness to REUSE (do not fork). Runner supports --suite <dir>; results land under the suite. -->
@.claude/skills/lz-refactor-workspace/e2e-nx/run-e2e.mjs
<!-- Structures to MIRROR for the new suite. -->
@.claude/skills/lz-refactor-workspace/e2e-gilded-rose/suite.json
@.claude/skills/lz-refactor-workspace/e2e-gilded-rose/targets.json
<!-- The grader whose matcher DESIGN + selfcheck pattern to mirror (the sibling re-derives the ~6-line
     word-bounded matcher locally; it does NOT import from here, to keep the load-bearing EVL-02
     grader untouched). -->
@.claude/skills/lz-refactor-workspace/grade-run.mjs

<interfaces>
<!-- Runner facts the executor needs (from run-e2e.mjs). No exploration required. -->
- Invoke a foreign suite:  node e2e-nx/run-e2e.mjs --suite <abs-or-rel path to e2e-reference> ...
- SUITE_DIR = resolved --suite dir; RESULTS_DIR = SUITE_DIR/results; PROMPTS_DIR = SUITE_DIR/prompts.
- suite.json shape: { name, repo, applyBase, protectedBranches, skillCommand, prompts:[{id,file,target,code}] }.
  Set every prompt code:false (recommend-only; apply is impossible and the runner skips non-code prompts in apply).
- Arms: --arm all => with_skill, no_skill, invoke_skill. Primary A/B = invoke_skill (forced /lz-tdd:lz-refactor,
  guarantees catalog loaded) vs no_skill (baseline). with_skill is a free secondary auto-trigger data point.
- Mode: recommend hard-blocks Edit/Write/MultiEdit/NotebookEdit/Bash (--disallowedTools). All questions are read-only.
- Model/effort pinned: claude-opus-4-8 @ high (E2E_MODEL / E2E_EFFORT override). --setting-sources project drops user global plugins.
- Skill catalog reaches with_skill/invoke_skill via --plugin-dir (constant PLUGIN_DIR = repo/plugins/lz-tdd), NOT via cwd.
- Output tree per run: results/<mode>/<arm>/<qid>/run-<k>/{answer.md, meta.json}. Idempotent resume: exit-0 runs skip unless --force.
- Dry run: node run-e2e.mjs --suite <dir> --arm all --mode recommend --runs 3 --dry-run  (prints the run count, spends nothing).

<!-- Grader matcher DESIGN to mirror (from grade-run.mjs). -->
- Word-bounded name matcher: new RegExp(`(?<![\\w-])${esc}(?![\\w-])`, "i") with esc = escape-metachars + \s+ between words.
  Stops "Extract Function" from sub-matching "Extract Functionality". ~6 lines; copy it into the sibling.
- --selfcheck runs assert()-based fixtures and process.exit(0/1); mirror that convention.

<!-- Confirmed ground-truth tokens (read from the shipped catalog this session; grade MEMBERSHIP not semantics). -->
- fowler-catalog/README.md: "Return Modified Value [web-only]" (sole web-only entry); "Introduce Special Case | Introduce Null Object" alias row; Change Function Declaration absorbed Add/Remove Parameter + Rename; Consolidate Duplicate Conditional Fragments (1st ed) -> Slide Statements (2nd ed).
- kerievsky-catalog/README.md: exactly 3 Direction=Away rows -> Encapsulate Composite with Builder (Away Composite, To Builder), Move Accumulation to Visitor (Away Iterator, To Visitor), Inline Singleton (Away Singleton).
- smells.md: "Primitive Obsession [both]"; "Combinatorial Explosion [Kerievsky]"; "Indecent Exposure [Kerievsky]".
</interfaces>
</context>

<fairness_rule>
CRITICAL (bake into targets.json AND the review gate). Grade ONLY facts with a ground truth
INDEPENDENT of the skill's own inventions:

GRADE (independent, real): book contents, 1st->2nd-ed renames/merges, Refactoring-Directions-table
MEMBERSHIP (which patterns appear in a refactoring's row), smell provenance (Fowler/Kerievsky/both),
web-only vs print provenance, "does Fowler 2nd ed have X" existence facts.

DO NOT GRADE AS VALUE (echo, not value -- base cannot be "wrong" about a convention the catalog
invented): the inferred To-vs-Towards SEMANTICS, the n/a sentinel, the N:1 functional idiom
groupings as such, the Kerievsky-primitive reconciliation, per-leaf mechanics WORDING, the 62-vs-66
count.

Q1/Q2/Q4 grade real-pattern MEMBERSHIP tokens (which real patterns are named -- e.g. Iterator is the
q1 discriminator; base may name only the pattern in the refactoring's title), NEVER the invented
directional meaning. NO direction words are graded on any question. q11/q12 grade a real 2nd-ed
rename (Slide Statements) and a real Kerievsky smell-provenance (Indecent Exposure) -- NOT the
dropped Fold-grouping / To-vs-Towards echo (both are RESEARCH TIER 3 echo and are excluded).
</fairness_rule>

<tasks>

<task type="auto">
  <name>Task 1: Build the e2e-reference suite (suite.json + prompts + targets.json)</name>
  <files>.claude/skills/lz-refactor-workspace/e2e-reference/suite.json, .claude/skills/lz-refactor-workspace/e2e-reference/prompts/*.md, .claude/skills/lz-refactor-workspace/e2e-reference/targets.json, .claude/skills/lz-refactor-workspace/e2e-reference/README.md</files>
  <action>
Create `e2e-reference/suite.json` mirroring the gilded-rose shape, with 14 prompts (q1-q12 discriminating + qc1-qc2 controls), EVERY prompt `code:false`. Set `skillCommand:"/lz-tdd:lz-refactor"`. Set `repo` to a CATALOG-FREE directory OUTSIDE this repo so no arm can read the shipped catalog off disk -- use `D:/projects/github/emilybache/GildedRose-Refactoring-Kata/TypeScript` (exists, contains no refactoring catalog; recommend mode hard-blocks writes so it is never touched). `applyBase` is unused (recommend-only) -- set it to `"main"` and add a `// recommend-only` note in README, not in JSON.

Write 14 `prompts/qN-*.md` files, NEUTRAL phrasing per RESEARCH.md section 3 (never name the answer in the question), ASCII-only, and NO near-verbatim catalog/book prose (DST-04): paraphrase every stem in original wording. One question per file. Question set + the grade tokens they target (from the RESEARCH table, reconciled to the fairness rule -- MEMBERSHIP only, no direction words):
- q1 (FC-1a): Move Accumulation to Visitor -- which pattern(s) does it move toward, which away? -> mustName.all: Visitor AND Iterator (grade MEMBERSHIP only; Iterator is the discriminator -- base may name only Visitor). NO direction words graded, NO mustNotClaim.
- q2 (FC-1a): Encapsulate Composite with Builder -- toward or away from Composite? -> mustName.all: Builder AND Composite (grade MEMBERSHIP only; Composite is the discriminator). NO direction words graded, NO mustNotClaim.
- q3 (FC-4): a Singleton not earning its keep -- named Kerievsky move + functional alternative? -> Inline Singleton + {Module Namespace|module of functions}
- q4 (FC-1a): which Kerievsky refactorings are de-patterning (Away) moves? -> all 3: Inline Singleton, Encapsulate Composite with Builder, Move Accumulation to Visitor (grade MEMBERSHIP of the 3 real refactoring names; the "Away" set membership is a real table fact, not the invented direction semantics)
- q5 (FC-5): is "Combinatorial Explosion" a Fowler or Kerievsky smell? -> Kerievsky; mustNotClaim it is a Fowler smell
- q6 (FC-5): is "Primitive Obsession" Fowler, Kerievsky, or both? -> both
- q7 (FC-2): what did Fowler rename "Introduce Null Object" to in the 2nd ed? -> Introduce Special Case; mustNotClaim "still Introduce Null Object"
- q8 (FC-2): which single 2nd-ed refactoring absorbed Add/Remove Parameter + Rename Method? -> Change Function Declaration
- q9 (FC-6): is "Return Modified Value" in the 2nd-ed print, or online only? -> {web-only|online|not in print}; mustNotClaim in-print
- q10 (FC-6): does Fowler 2nd ed include an "Extract Interface" refactoring? -> negation (no); bonus Change Function Declaration|Extract Superclass
- q11 (FC-2): which single 2nd-ed refactoring covers the case Fowler's 1st-ed "Consolidate Duplicate Conditional Fragments" handled? -> mustName.all: Slide Statements (real 2nd-ed rename/merge, book-independent; REPLACES the dropped Fold-grouping echo question -- RESEARCH TIER 3)
- q12 (FC-5): is "Indecent Exposure" a code smell catalogued by Fowler, by Kerievsky, or by neither? -> mustName.all: Kerievsky (real Kerievsky-unique smell provenance, book-independent; REPLACES the dropped To-vs-Towards echo question -- RESEARCH TIER 3)
- qc1 (control): what is Extract Function and when do you use it? (expect base PASS)
- qc2 (control): what is the Strategy pattern's intent? (expect base PASS)

Write `targets.json`: an array of per-question objects keyed by prompt id, each with: `class`, `independent` (true for q1-q12, false for qc1-qc2), `control` (true for qc1-qc2), and the assertion set -- `mustName.all` (AND list of required tokens), `mustName.anyOf` (array of OR-groups; each group needs >=1 hit), `mustNotClaim` (forbidden-token list; none may be present). Encode the tokens above. Every `independent:true` question must survive the rule "base could be wrong about this real book fact, and correctness does NOT depend on the skill's vocabulary" -- do NOT encode any direction word (away/toward/towards/de-pattern/dismantle/retreat) as a required or forbidden token on any question. Keep controls with a loose `mustName.anyOf` only (they exist to detect verbosity, graded but reported separately).

Write a short `README.md` (ASCII): what the suite measures, the fairness rule (one paragraph), how to run (reuse `../e2e-nx/run-e2e.mjs --suite ../e2e-reference`), and the eval-run-approval-gate note.
  </action>
  <verify>
    <automated>node .claude/skills/lz-refactor-workspace/e2e-nx/run-e2e.mjs --suite .claude/skills/lz-refactor-workspace/e2e-reference --arm all --mode recommend --runs 3 --dry-run</automated>
  </verify>
  <done>Dry-run prints 14 prompts x 3 arms x 3 runs = 126 recommend commands, spends nothing, and resolves the claude binary. suite.json has 14 code:false prompts; targets.json has a matching entry per prompt id; 14 prompt files exist; NO targets.json entry encodes a direction word as a required/forbidden token; cwd is the catalog-free kata dir.</done>
</task>

<task type="auto">
  <name>Task 2: Build grade-reference.mjs (deterministic grader + aggregate + selfcheck)</name>
  <files>.claude/skills/lz-refactor-workspace/grade-reference.mjs, .claude/skills/lz-refactor-workspace/package.json</files>
  <action>
Create sibling `grade-reference.mjs` at the workspace root (next to grade-run.mjs). Copy the ~6-line word-bounded `nameRe` matcher from grade-run.mjs verbatim (do NOT import -- the EVL-02 grader has no exports and runs main() on load; re-deriving 6 lines is the smaller, lower-risk diff than adding exports + guarding its main()). The reference grader needs NO NAME_LAYERS (it grades book-fact tokens, not smell->layer routing).

Two modes:
1. Per-question grade of one answer: `--target <id> --output <answer.md> --out <grading.json>` (or a batch mode). Read the question's expectations from `targets.json`. A question is CORRECT iff: every `mustName.all` token matches (word-bounded), every `mustName.anyOf` group has >=1 match, and NO `mustNotClaim` token is present. Emit `{ id, correct, evidence, checks:[...] }`.
2. `--aggregate`: walk `e2e-reference/results/recommend/<arm>/<qid>/run-<k>/answer.md`, grade each answer, then per question per arm compute correct-rate over k runs. Report:
   - per-question: no_skill rate, invoke_skill rate, with_skill rate, and DELTA = invoke_skill_rate - no_skill_rate (primary A/B).
   - Pass@k and Pass^k per arm per question -- COPY the small comb/passAtK/passHatK helpers from run-e2e.mjs into grade-reference.mjs (do NOT import: run-e2e.mjs has NO exports and executes main() on load, so importing it would run the whole runner). Re-deriving these few lines is the smaller, lower-risk diff -- same rationale as the nameRe copy.
   - discriminating (q1-q12) and controls (qc1-qc2) reported in SEPARATE sections; mean positive delta computed over discriminating facts only.
   Emit a machine-readable `aggregate.json` and a human table to stdout.

Add `--selfcheck` (assert-based, process.exit 0/1) mirroring grade-run.mjs: (a) matcher is word-bounded (no sub-match) + whitespace/newline tolerant; (b) a fixture answer that names all required tokens and no forbidden token -> correct:true; (c) a fixture missing a `mustName.all` token -> correct:false; (d) a fixture containing a `mustNotClaim` token -> correct:false; (e) a fixture hitting only one member of an anyOf group -> that group passes; (f) delta math: fabricate a tiny in-memory results set and assert delta = invoke_rate - no_skill_rate and Pass@k values.

Wire `package.json`: add `"grade-reference": "node grade-reference.mjs"` and `"grade-reference:selfcheck": "node grade-reference.mjs --selfcheck"` scripts (mirror the existing grade-run wiring pattern; do not disturb other scripts).
  </action>
  <verify>
    <automated>node .claude/skills/lz-refactor-workspace/grade-reference.mjs --selfcheck</automated>
  </verify>
  <done>--selfcheck prints "SELFCHECK OK" and exits 0. Grader distinguishes a correct answer from a catalog-echo miss and a hallucination (mustNotClaim) via the fixtures. Aggregate math (delta + Pass@k) covered by a selfcheck fixture. The comb/passAtK/passHatK helpers are COPIED into grade-reference.mjs (no `import ... from "*run-e2e*"`). package.json has the two new scripts and stays valid JSON. grade-run.mjs is UNTOUCHED.</done>
</task>

<task type="auto">
  <name>Task 3: Unbiased review gate on the instrument (prompts + rubric) -- no spend</name>
  <files>.planning/quick/260714-nxp-build-review-and-run-the-reference-catal/260714-nxp-REVIEW.md</files>
  <action>
Spawn TWO independent reviewer subagents (Task tool, general-purpose) over the built instrument (`e2e-reference/prompts/*.md` + `targets.json`). Per the project's hard rule (unbiased-review-beats-primed + every eval instrument must pass unbiased review before spend):
- Reviewer A -- NEUTRAL, from-scratch brief: NO priming with expected outcomes. Ask only: "For each question, is the phrasing neutral (does it leak/name its own answer)? Are the grade tokens in targets.json actually correct against the real Fowler/Kerievsky/GoF books? Is any question ambiguous?"
- Reviewer B -- ADVERSARIAL: try to break the fairness rule. For each graded question, argue whether its ground truth is INDEPENDENT of the skill's own conventions or whether it is echo (To-vs-Towards semantics, n/a sentinel, N:1 groupings, primitive reconciliation, mechanics wording, the 62-vs-66 count). Verify NO direction word (away/toward/towards/de-pattern/dismantle/retreat) is a required/forbidden grade token. Flag any leading phrasing and any near-verbatim book prose (DST-04).

Collect both verdicts into `260714-nxp-REVIEW.md`. Apply every actionable fix to the prompts/targets (reword leading stems, drop or fix echo-tainted questions, correct wrong tokens, paraphrase DST-04 hits). Re-run Task 1 and Task 2 verifies after fixes.

The gate PASSES only when: both reviewers report no leading phrasing, no echo-graded question survives in the `independent:true` set, no direction word is a grade token, no DST-04 near-verbatim prose, controls present, and all tokens verified. Record the PASS (or the blocking issues) at the top of REVIEW.md.
  </action>
  <verify>
    <automated>test -f .planning/quick/260714-nxp-build-review-and-run-the-reference-catal/260714-nxp-REVIEW.md && rg -q -i "GATE: PASS" .planning/quick/260714-nxp-build-review-and-run-the-reference-catal/260714-nxp-REVIEW.md && node .claude/skills/lz-refactor-workspace/grade-reference.mjs --selfcheck</automated>
  </verify>
  <done>REVIEW.md exists with both reviewers' verdicts and a top-line "GATE: PASS". Every fix applied; Task 1 dry-run and Task 2 selfcheck still green. No echo-tainted question remains flagged independent:true; no direction word graded. If the gate cannot reach PASS, the plan STOPS here (do not proceed to spend) and the blocking issues are surfaced to the user.</done>
</task>

<task type="checkpoint:decision" gate="blocking">
  <decision>Approve the metered `claude -p` spend to run the reference-catalog eval?</decision>
  <context>
Tasks 1-2 built the instrument; Task 3's unbiased review gate is PASS. Per the project's
eval-run-approval-gate, no skill eval may RUN (metered `claude -p` spend) without explicit user
approval. The default run is `--arm all --mode recommend --runs 3` = 14 questions x 3 arms x 3 runs
= 126 read-only recommend sessions (short/cheap; recommend hard-blocks all edits). The dry-run count
was confirmed in Task 1. This checkpoint is the spend gate: the orchestrator HALTS here.
  </context>
  <options>
    <option id="approve-all">
      <name>Approve full run (--arm all, k=3, 126 runs)</name>
      <pros>Primary A/B (invoke_skill vs no_skill) + free with_skill auto-trigger data point; controls included.</pros>
      <cons>Largest spend of the three options (still cheap: recommend/read-only).</cons>
    </option>
    <option id="approve-pair">
      <name>Approve clean pair only (invoke_skill + no_skill, k=3, ~84 runs)</name>
      <pros>Lower spend; still yields the primary per-fact delta.</pros>
      <cons>No with_skill auto-trigger secondary signal. (No single --arm flag yields exactly this pair; run --arm invoke_skill and --arm no_skill separately.)</cons>
    </option>
    <option id="decline">
      <name>Do not run</name>
      <pros>Zero spend; instrument is built and reviewed, run deferred.</pros>
      <cons>The last untested value lever stays unmeasured.</cons>
    </option>
  </options>
  <resume-signal>Select: approve-all, approve-pair, or decline</resume-signal>
</task>

<task type="auto">
  <name>Task 5: Run the reference-catalog eval (GATED -- the spend)</name>
  <files>.claude/skills/lz-refactor-workspace/e2e-reference/results/</files>
  <action>
ONLY after Task 4 approval. Run the existing runner against the new suite (reuse, no fork):
`node .claude/skills/lz-refactor-workspace/e2e-nx/run-e2e.mjs --suite .claude/skills/lz-refactor-workspace/e2e-reference --arm all --mode recommend --runs 3`
(or the invoke_skill + no_skill pair if the user chose approve-pair). Model/effort stay pinned
(claude-opus-4-8 @ high). The runner is idempotent (exit-0 runs skip on re-invoke). Optional
top-up for the borderline q2/q11 only, if the user asks: `--prompt q11 --arm all --runs 5`.
Confirm each arm produced answer.md files under results/recommend/<arm>/<qid>/run-<k>/.
  </action>
  <verify>
    <automated>node .claude/skills/lz-refactor-workspace/e2e-nx/run-e2e.mjs --suite .claude/skills/lz-refactor-workspace/e2e-reference --report</automated>
  </verify>
  <done>--report lists captured runs for all approved arms x q1-q12 + qc1-qc2 x k. No spawn errors; answer.md present for each run. (This task is skipped entirely if Task 4 = decline.)</done>
</task>

<task type="auto">
  <name>Task 6: Grade, aggregate deltas, write the honest verdict</name>
  <files>.claude/skills/lz-refactor-workspace/e2e-reference/aggregate.json, .claude/skills/lz-refactor-workspace/e2e-reference/REFERENCE-RESULTS.md</files>
  <action>
Run `node .claude/skills/lz-refactor-workspace/grade-reference.mjs --aggregate` over the results tree.
Write `REFERENCE-RESULTS.md` (mirror e2e-gilded-rose/GR-RESULTS.md structure, ASCII-only):
- Per-question table: no_skill / invoke_skill / with_skill correct-rate, DELTA (invoke_skill -
  no_skill), Pass@k per arm. Discriminating (q1-q12) and controls (qc1-qc2) in SEPARATE sections.
- Mean positive delta over discriminating facts; controls separately (a skill that also "wins" the
  controls is being verbose -- discount the edge).
- Honest verdict as a CLASS statement: which look-up fact-class (if any) carries a real
  correct-answer edge vs base, and which are redundant with base. Include the actionability/frequency
  caveat from RESEARCH section 5.8 (a real edge on niche facts may be low-utility). State plainly if
  the result is NULL -- that is a decisive, valuable outcome that closes the reference-mode value
  lever and tells the maintainer to stop investing there.
  </action>
  <verify>
    <automated>test -f .claude/skills/lz-refactor-workspace/e2e-reference/REFERENCE-RESULTS.md && test -f .claude/skills/lz-refactor-workspace/e2e-reference/aggregate.json</automated>
  </verify>
  <done>aggregate.json has per-question per-arm rates + deltas; REFERENCE-RESULTS.md states per-fact deltas, controls separately, and an explicit class verdict (edge on class X / null) with the actionability caveat. ASCII-only.</done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| operator -> metered `claude -p` | Spend crosses here; a run must not start unbuilt/unreviewed/unapproved. |
| eval cwd -> shipped catalog | If cwd contained the catalog, the no_skill arm could read the answers off disk and void the delta. |
| authored prose -> public repo | Question stems / rubric must be ASCII + free of near-verbatim book prose (DST-04) + free of the maintainer work-email. |

## STRIDE Threat Register

| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-nxp-01 | Elevation (unauthorized spend) | Task 5 run | mitigate | Run task depends on Task 3 review PASS + Task 4 spend-approval checkpoint (blocking); orchestrator halts before spend. |
| T-nxp-02 | Information disclosure (base reads catalog) | suite.json `repo` cwd | mitigate | cwd set to a catalog-free dir OUTSIDE this repo; catalog reaches skill arms only via --plugin-dir; recommend mode hard-blocks all writes. |
| T-nxp-03 | Tampering (echo graded as value) | targets.json `independent` set | mitigate | Fairness rule enforced in Task 1 (MEMBERSHIP-only tokens, no direction words, no To-vs-Towards / Fold-grouping questions) + adversarial Reviewer B in Task 3; only book-independent facts graded as value. |
| T-nxp-04 | Repudiation (invisible false pass) | grade-reference.mjs | mitigate | Deterministic mustName/mustNotClaim + --selfcheck fixtures (correct / miss / hallucination / delta math); no LLM judge for core facts. |
| T-nxp-05 | Information disclosure (PII / DST-04) | prompts + rubric prose | mitigate | ASCII-only; paraphrase all stems; Reviewer B flags near-verbatim; work-email absent (allowlist-inversion per AGENTS.md). |
| T-nxp-SC | Tampering | npm/pip/cargo installs | accept | No new dependencies -- reuses the in-repo harness; no install task exists. |
</threat_model>

<verification>
- Task 1 dry-run: 126 (or pair) commands composed, zero spend, claude resolved; no direction word graded.
- Task 2 + Task 3: `grade-reference.mjs --selfcheck` exits 0; comb/passAtK helpers copied (not imported); grade-run.mjs untouched.
- Task 3: REVIEW.md "GATE: PASS" with neutral + adversarial verdicts and applied fixes.
- Task 4: explicit user spend approval recorded before any `claude -p`.
- Task 5: `--report` lists all approved runs; no spawn errors.
- Task 6: aggregate.json + REFERENCE-RESULTS.md with per-fact deltas, controls separate, class verdict + caveat.
- ASCII-only across all authored files; no near-verbatim book prose; maintainer work-email absent.
</verification>

<success_criteria>
- The reference-catalog eval is BUILT (suite + prompts + deterministic grader), REVIEWED (unbiased
  neutral + adversarial PASS), RUN (only after explicit spend approval), and GRADED (per-fact deltas).
- The grader is deterministic and selfcheck-green; it distinguishes genuine correctness from
  catalog-echo and from hallucination; no LLM judge decides a core fact.
- Only independently-true book facts are graded as value (real MEMBERSHIP / renames / smell
  provenance / print-vs-web); NO invented direction semantics or idiom groupings are graded; the
  delta is computed with the SAME rubric on both arms; controls are reported separately.
- The existing run-e2e.mjs is reused via --suite (not forked); grade-run.mjs is untouched.
- REFERENCE-RESULTS.md delivers an honest class verdict (edge on class X, or NULL) with an
  actionability caveat -- either outcome is decisive.
</success_criteria>

<output>
Create `.claude/skills/lz-refactor-workspace/e2e-reference/REFERENCE-RESULTS.md` (the verdict) and
`.planning/quick/260714-nxp-build-review-and-run-the-reference-catal/260714-nxp-REVIEW.md` (the
unbiased-review gate record) when done.
</output>
