---
phase: 22-three-way-classifier-correctness-lz-refactor-lz-red
plan: 05
subsystem: dev-only eval harness (placement A/B instrument) -- arm composition, routing suite, destination grader
tags: [ab-instrument, placement, routing-correctness, destination-label, blind-judge, fail-closed, additive-edit, zero-spend]
requires:
  - .claude/skills/lz-refactor-workspace/e2e-nx/run-e2e.mjs (pre-existing, 6 arms + 2 generated-tree consts)
  - .claude/skills/lz-red-workspace/tabulate-mechanical-red.mjs (pre-existing, hardcoded red-grade.json)
  - .claude/skills/lz-red-workspace/tools/rgr-cases.json (22-01: the 9-case corpus, single source)
  - .claude/skills/lz-red-workspace/check-evals.mjs (22-02: clause 8 widened to e2e-rgr-routing)
  - .gitignore (22-02: explicit ignore lines incl. mechanical-routing.json)
  - .claude/skills/lz-red-workspace/merge-judge.mjs (pre-existing, fail-closed merge contract)
provides:
  - "run-e2e.mjs --arm placement -> variant_a | variant_b | variant_c off ONE byte-identical prompt"
  - "VARIANT_B_DIR / VARIANT_C_DIR consts, env-overridable and exported for 22-06's selfcheck"
  - "routing_table_read + routing_table_read_path per run -- retrieval as a first-class dimension"
  - "tabulate-mechanical-red.mjs --grade-file <name>, default red-grade.json"
  - "the e2e-rgr-routing suite: suite.json, targets.json, nine prompts derived from the corpus"
  - "grade-routing.mjs: closed-label destination extraction, judge routing, two-leak blinding, --selfcheck"
  - "fixtures-routing/ -- 9 hand-authored fixture files, sibling of the Phase-21 fixtures/ tree"
affects:
  - "22-06 (build-variants.mjs must write out/lz-tdd-variant-b + -c; selfcheck-routing.mjs asserts argv vs the exported consts and prompt<->corpus id correspondence)"
  - "22-07 (the RUN-GATE presents the placement command; the HALT keeps it unrun)"
tech-stack:
  added: []
  patterns:
    - "new arm-group token instead of editing a byte-pinned one (the d12 precedent)"
    - "env override only on read-only --plugin-dir consts, never on PLUGIN_DIR"
    - "closed-label metric with a negation-aware affirmation filter, never a phrase set"
    - "cardinality routes ambiguity to a judge instead of guessing"
    - "blinding derived from the tracked tree so a rewording cannot stale it"
    - "preliminary-path guard: a final-looking artifact is never written while anything is unresolved"
key-files:
  created:
    - .claude/skills/lz-red-workspace/e2e-rgr-routing/suite.json
    - .claude/skills/lz-red-workspace/e2e-rgr-routing/targets.json
    - .claude/skills/lz-red-workspace/e2e-rgr-routing/prompts/ (nine files, c1..c9)
    - .claude/skills/lz-red-workspace/grade-routing.mjs
    - .claude/skills/lz-red-workspace/fixtures-routing/fixtures.json
    - .claude/skills/lz-red-workspace/fixtures-routing/answers/ (eight files)
  modified:
    - .claude/skills/lz-refactor-workspace/e2e-nx/run-e2e.mjs
    - .claude/skills/lz-red-workspace/tabulate-mechanical-red.mjs
decisions:
  - "The routing suite's session cwd is the PROMPTS dir, not the repo root. The plan allowed the repo root; it was rejected because the tracked tree carries variant A's own SKILL.md bodies and this phase's planning documents, which state the expected owner per case -- a repo-root cwd would let a run recover the answer key and would silently collapse arm isolation."
  - "grade-routing.mjs writes ONE per-run artifact, routing-grade.json, in merge-judge's grading shape plus three additive keys (pass / routing / judge_inputs). Unresolved runs go to routing-grade.preliminary.json, so a rollup pointed at the final filename fails closed rather than tabulating an ungraded run."
  - "The judge-blinding heading set is DERIVED from the tracked tree at grade time rather than hardcoded, so a rewording by 22-03 cannot stale it; --selfcheck passes a hermetic list so its normalization legs cannot go vacuous."
  - "Followed 22-02's naming authority: mechanical-routing.json is the routing ROLLUP filename (already live in check-evals.mjs SUITE_SKIP_FILES and .gitignore:89). The per-run GRADE filename is a separate file, routing-grade.json, which is what --grade-file points at."
metrics:
  duration: "one session, split across a provider spend-limit interruption during task 3's mutation proofs"
  tasks_completed: 3
  files_created: 21
  files_modified: 2
  completed: 2026-08-03
status: complete
---

# Phase 22 Plan 05: Placement A/B instrument (content-independent half) Summary

The three-arm placement instrument is built and proven entirely offline: `run-e2e.mjs` composes
`variant_a | variant_b | variant_c` off ONE byte-identical prompt with three distinct `--plugin-dir`
values, the `e2e-rgr-routing` suite derives its nine prompts from the one tracked corpus, and
`grade-routing.mjs` extracts a closed DESTINATION label, routes every genuine ambiguity to a blind
judge, blinds both arm-identifying leaks and refuses to emit a final artifact while anything is
unresolved. Every byte-pinned Phase-20/21 guarantee is intact and nothing metered ran.

## Commit trail

**This plan's tasks were split across a provider spend-limit interruption.** Tasks 1 and 2 were
committed, then the quota tripped during task 3's grader mutation proofs with `grade-routing.mjs` and
the fixtures already STAGED but not committed. The session resumed, re-ran the worktree HEAD
assertion, confirmed the staged set on disk rather than re-deriving it, finished the mutation proofs
from that point, and committed. Nothing was redone and nothing was lost. Recording it here so the
commit trail reads correctly later.

| Task | Name | Commit | Files |
| ---- | ---- | ------ | ----- |
| 1 | Placement arms + retrieval instrumentation + `--grade-file` | `4604455` | `run-e2e.mjs` (+86/-4), `tabulate-mechanical-red.mjs` (+58/-10) |
| 2 | The `e2e-rgr-routing` suite | `f06fad4` | `suite.json`, `targets.json`, nine `prompts/c1..c9` (11 new) |
| 3 | `grade-routing.mjs` + `fixtures-routing/` | `f75977f` | grader (920 lines) + `fixtures.json` + eight answers (10 new) |

Fork base `c071b53`. Full manifest vs base: 23 files, +1206/-14. No `STATE.md` or `ROADMAP.md` change
(worktree mode -- the orchestrator owns those). No `plugins/` file touched (the sibling 22-03 owns all
three `SKILL.md`).

## Task 1 -- six additive edits, and the byte-for-byte proof that they are additive

`run-e2e.mjs` gained `VARIANT_B_DIR` / `VARIANT_C_DIR` (env-overridable via `LZ_VARIANT_B_DIR` /
`LZ_VARIANT_C_DIR`, defaulting under gitignored `out/`), the `placement` arm-group token, three
`--plugin-dir` branches, the retrieval fact, and two names on the export list. `variant_a` reuses
`PLUGIN_DIR` because the tracked tree IS variant A (D-24), so it needs no generated copy and doubles
as the composition anchor `selfcheck-red.mjs` cruxes 1/2 already assert. `PLUGIN_DIR` gained no env
override -- `git diff` shows no edit on that line at all.

The three placement arms are deliberately ABSENT from `composePrompt`'s force-invoke branch, so all
three fall through to the natural-prompt return and the `-p` bytes are identical arm to arm.

**Retrieval is a FOURTH fact, not a fourth spelling of the three trigger facts.** `routing_table_read`
plus `routing_table_read_path` are scoped to the `Read` tool's own path argument -- a `Skill` call
whose args merely mention the table, or an answer citing it from memory, is not a read. It is written
on EVERY run's meta, including `variant_a`, so the read rate has an in-corpus zero baseline: a run
whose tree carries no such file cannot read it, and recording that explicitly is what makes B's and
C's rates interpretable.

`tabulate-mechanical-red.mjs` gained `--grade-file <name>` threaded through `walkRuns` and
`walkAllSuites`, defaulting to `red-grade.json`. The fail-closed missing-grade throw kept its
semantics and now names the RESOLVED filename, so a run missing a routing grade does not send the
operator to `grade-red.mjs` for a file it never writes. The flag rejects a path (`sub/dir/x.json`) and
a missing value, both exit 2.

### The additive proof, measured rather than argued

`selfcheck-red.mjs` crux 6 pins the nx `--arm all` dry-run byte-for-byte but is unreachable in a
fresh worktree (it runs after crux 7 -- see Environment artifacts). So the guarantee was proven
DIRECTLY and more strongly, by capturing each pinned dry-run before the edit and byte-comparing after:

| Pinned dry-run | Result |
| -------------- | ------ |
| nx `--arm all` recommend | `cmp` IDENTICAL (crux 6's composition assertion is a strict subset of this) |
| nx `--arm all` apply | `cmp` IDENTICAL (crux 6's apply-preamble byte pin) |
| nx `--arm d12` | `cmp` IDENTICAL (Phase 21's D-12 arms) |
| `tabulate --selfcheck` output | `cmp` IDENTICAL |

`selfcheck-code-review.mjs` exits 0, so `extractResult`'s single-argument call signature still works.

## Task 2 -- the suite, and the cwd decision the plan left open

Eleven files: `suite.json`, `targets.json`, and one prompt per corpus case. The prompt ids are exactly
the nine corpus ids and each body carries its case's `request` verbatim; provenance is CITED from the
corpus header rather than restated nine times (D-23). The bodies deliberately carry test-state facts,
which is exactly why the suite sits outside `selfcheck-red.mjs`'s auto-discovered `e2e-red-*`
namespace (D-22) -- confirmed by re-grepping the three discovery sites: `check-evals.mjs` reaches the
new dir (22-02's widen), while `selfcheck-red.mjs` and `tabulate`'s `discoverSuiteDirs` are still
`e2e-red-`-anchored and do not.

The recommend preamble is overridden because the shared default opens with "Read what I point you at"
and no prompt in this corpus points at anything. Extracted from the PARSED JSON (not grepped, since
the suite name and tracked-skill list legitimately contain skill names), lowercased, it contains none
of `classify`, `route`, `routing`, `owner`, `seam`, nor any skill name:

```
"You are pair-programming with me. Tell me how you would approach what I am asking. Do NOT edit any file and do NOT run any command. Here is my question:\n\n"
```

**The one judgement call the plan left to discretion: the session cwd.** The plan said "the repo root
is acceptable". It was REJECTED. `cwd = args.cwd || REPO` is passed straight to the spawn, and a
repo-root cwd puts two things one `Read` away: this phase's planning documents, which state the
expected owner for every case, and `plugins/lz-tdd/skills/*/SKILL.md` -- variant A's own bodies. The
second is the worse one: a `variant_c` session could recover the narrative sections variant C
removes, collapsing arm isolation while every arm still looked healthy (Pitfall 4's class). The
prompts dir is used instead: it is the least informative existing directory available, holding only
the nine questions, and reading a sibling question reveals nothing about any case's expected owner.
The residual risk is stated in `repo_note` rather than hidden -- a session can still walk UP out of
any in-repo cwd, that risk is identical across all three arms, no prompt points at a file, and every
run's meta records a `tool_calls` histogram plus the retrieval fact, so a spelunking run is visible in
the evidence rather than silent.

### The non-vacuity proof for 22-02's clause-8 widen

`check-evals.mjs` moved from **14 authored files / 3 suite dirs** to **25 / 4** -- exactly `+11` files
and `+1` dir. 22-02 recorded 14/3 as its baseline precisely so this increase would be verifiable, and
the numbers match on both axes. The widen was not vacuous.

## Task 3 -- the grader

`grade-routing.mjs` (920 lines) grades ONE captured run's answer prose into a closed label:
`lz-red | lz-tpp | lz-refactor | <a> -> <b> | NONE`, compared against the corpus's `expectedOwner`
(plus `expectedSecondHop` when set). `pass` is label equality and nothing else.

The load-bearing piece is destination EXTRACTION. Each of the three names is matched word-bounded on
the driver's own boundary class, then every occurrence is filtered through the negation-aware
affirmation test ported from `grade-run.mjs`. That is the one place a bare `includes()` would smuggle
the measured incidental-mention ceiling back INSIDE the grader, because a correct classifier answer
talks about the two skills it is NOT handing the request to. First-occurrence order is preserved so
an ordered two-hop stays distinguishable from its reverse.

The verdict router refuses to guess: `exactly-one` resolves deterministically; `zero` resolves
deterministically ONLY on the residual case and is otherwise unresolved (a coaching answer that solves
the problem without naming a skill is ambiguous, not wrong); `multiple` is ALWAYS unresolved, because
a correct ordered handoff and a three-way hedge are not mechanically separable.

`normalizeForJudge` strips both arm-identifying leaks, replaces each with a NEUTRAL PLACEHOLDER rather
than deleting it, and reports which fired and how many times. The heading set is DERIVED from the
tracked tree at grade time, so 22-03's rewording cannot stale it; the selfcheck passes a hermetic list
so its normalization legs cannot go quietly vacuous. The accepted tradeoff is named in the header: the
three narrative headings contain skill names, so an answer whose only destination signal is a recited
heading reaches the judge with that signal gone -- which is the intended ordering, since an answer that
never designated an owner in its own prose has not designated one. Extraction reads the RAW text, so
it is unaffected.

### Proven offline, in both directions, with three mutations

`--selfcheck` runs 42 named assertions over 9 hand-authored fixture files and exits 0. The
should-STAY-GREEN direction is carried by explicit positive controls (a bare `lz-red` DOES match; an
answer with no leak reports NO normalization; normalization never strips a bare destination name), so
an over-matching or over-stripping grader fails too.

Mutation-sensitivity was MEASURED, not asserted. Each mutation was applied, run, and reverted:

| # | Mutation | Result |
| - | -------- | ------ |
| M1 | disable the negation-aware affirmation filter | RED -- both exclusion-clause legs fail |
| M2 | remove the word-boundary lookarounds | RED -- all three longer-name legs fail (`lz-redux`, `lz-red-workspace`) |
| M3 | disable the plugin-root blinding branch | RED -- after the fixture hole below was closed |

**M3 initially did NOT trip, and that was a real finding rather than a formality.** The
`references/`-path pattern greedily swallows the plugin-root token whenever a path contains both, so
the sole leaky fixture exercised only one of the two branches and the `PLUGIN_ROOT_RE` branch had no
independent coverage -- a bare `${CLAUDE_PLUGIN_ROOT}` citation with no `references/` segment would
have leaked to the judge unstripped and nothing would have noticed. The fixture was widened with the
bare form (path hits 2 -> 3), after which M3 fails as it should. Fixed as a Rule 1 bug; see Deviations.

The artifact contract was proven by RUNNING it, not by reading merge-judge: a fabricated two-hop run
produced `routing-grade.preliminary.json`, `merge-judge.mjs --merge` consumed it UNCHANGED and emitted
a valid final `grading` object. That run also confirmed the boundary documented in the header --
`pass`, `routing` and `judge_inputs` do NOT survive a merge, so the rollup must re-derive `pass` from
the merged expectations.

## Deviations from Plan

**1. [Rule 1 - Bug] `--selfcheck` printed its OK summary line even on a failing run.**
- **Found during:** Task 3, mutation M1.
- **Issue:** the SUMMARY line was printed unconditionally before `process.exit(ok ? 0 : 1)`, so a
  RED run exited 1 while its final line still read `OK`. This repo reads summary lines, and a report
  contradicting its own exit code is how a failure gets skimmed past.
- **Fix:** branch the summary -- `OK ...` on success, `RED -- ... Do NOT grade a captured round with
  this grader until it is GREEN.` on stderr otherwise.
- **Files modified:** `grade-routing.mjs`. **Commit:** `f75977f`.

**2. [Rule 1 - Bug] The judge-blinding fixture left one of the two strip branches uncovered.**
- **Found during:** Task 3, mutation M3 (the mutation that failed to trip).
- **Issue:** described in full above -- `REFERENCE_PATH_RE` masks `PLUGIN_ROOT_RE` on any path
  carrying both, so a bare plugin-root citation would have reached a judge unstripped.
- **Fix:** widened `fixtures-routing/answers/leaky-answer.md` with a bare `${CLAUDE_PLUGIN_ROOT}`
  citation; the reported path-hit count moved 2 -> 3 and M3 now bites.
- **Files modified:** `fixtures-routing/answers/leaky-answer.md`. **Commit:** `f75977f`.

**3. [Discretion exercised, not a deviation] The routing suite's cwd is the prompts dir.**
The plan offered the repo root as acceptable; the contamination and arm-isolation reasoning is above
and is recorded in `suite.json`'s `repo_note`. No locked decision covers this field.

**4. [Naming, resolved] `--grade-file` points at `routing-grade.json`, not `mechanical-routing.json`.**
These are two different files and the plan's own `key_links` distinguish them: `--grade-file` is the
PER-RUN verdict filename (linked to "grade-routing.mjs's output filename"), while
`mechanical-routing.json` is the ROLLUP, fixed by 22-02 and already live in `check-evals.mjs`'s
`SUITE_SKIP_FILES` and `.gitignore:89`. Both were verified with `git grep -n mechanical-routing`
before anything was authored. Nothing was renamed or re-decided.

## Known Stubs

None. No placeholder value, no empty-collection default and no TODO marker ships here. Every figure
that could only come from a metered run is ABSENT rather than stubbed -- this plan writes no results
tree, no rollup and no writeup, because there is nothing measured to put in one.

## Handoffs for 22-06 and 22-07

- `build-variants.mjs` must write to `out/lz-tdd-variant-b` and `out/lz-tdd-variant-c`. `run-e2e.mjs`
  hardcodes the same two destinations and carries the KEEP-THE-TWO-IN-SYNC warning; the consts are
  EXPORTED so `selfcheck-routing.mjs` can compare argv against the source of truth rather than
  recomputing the paths in a second place.
- `tabulate`'s `discoverSuiteDirs` is still `e2e-red-*`-anchored, so the routing suite is NOT
  auto-tabulated. This is deliberate scope: `--grade-file` was the plan's only tabulator change.
  `walkRuns`, `walkAllSuites`, `discoverSuiteDirs` and `aggregate` are all exported, so the routing
  rollup can call `walkRuns(<suite>/results/recommend, 'routing-grade.json')` and write
  `mechanical-routing.json`. Note the routing suite's tree is `results/recommend/...`, not
  `results/apply/...`.
- The judge step receives `judge_inputs` from the preliminary artifact -- each entry carries the merge
  key, the one label question, the normalized answer and the normalization report, and deliberately
  NOT the expected label. Converting a returned LABEL into merge-judge's required BOOLEAN is 22-06/07's
  step; the grader stops at the blind question on purpose.

## Threat Flags

None. No new network endpoint, auth path, file-access pattern or schema at a trust boundary. This
plan's own register is discharged as follows: **T-22-SPEND5** by running no metered command at all --
every command here is a dry-run or a `--selfcheck`; **T-22-MEASURE** by the byte-identical `-p` values
across the three arms, asserted from the driver's machine-parseable argv line, and reinforced by the
cwd decision above; **T-22-VOCAB** by the closed destination label plus the negation-aware affirmation
filter, with M1 proving the filter is load-bearing; **T-22-BLIND** by `normalizeForJudge` stripping and
REPORTING both leaks, with M3 proving the coverage after a real hole was found and closed;
**T-22-RETR** by `routing_table_read` on every run's meta and in every grade; **T-22-FROZEN** by the
four byte-for-byte dry-run comparisons plus empty `git diff --stat` on `selfcheck-red.mjs`,
`grade-run.mjs`, `grade-red.mjs`, `merge-judge.mjs` and `check-red-references.mjs`; **T-22-PII5** by
the ASCII and email sweeps below plus clause 8 now genuinely reaching the suite; **T-22-BYPROD** by
creating no results, `run-*` or outputs directory.

## Verification

| Check | Result |
| ----- | ------ |
| `node --check` on both edited + one new `.mjs` | exit 0 |
| `node check-evals.mjs` | exit 0, **25 files / 4 suite dirs** (was 14/3 -- `+11`/`+1`) |
| `node grade-routing.mjs --selfcheck` | exit 0, 42 assertions over 10 fixtures, zero spend |
| grader mutation sensitivity | M1, M2, M3 each flip the battery RED; all three reverted |
| `merge-judge.mjs --merge` over a grader preliminary | consumed UNCHANGED, emitted a valid final |
| `node tabulate-mechanical-red.mjs --selfcheck` | exit 0, output byte-identical to pre-edit |
| `--grade-file` arg validation | rejects a path and a missing value, exit 2 each |
| nx `--arm all` recommend / apply, `--arm d12` dry-runs | `cmp` IDENTICAL to the pre-edit captures |
| routing suite `--arm placement --prompt c1` | 3 argv lines; 3 DISTINCT plugin dirs; first is `plugins/lz-tdd`; the three `-p` are BYTE-IDENTICAL; none starts with a slash; all three block Edit/Write/MultiEdit/NotebookEdit/Bash |
| suite structure | 9 prompt ids == 9 corpus ids; every referenced file exists; no orphan file; one target with no `file`; `corpus_source` + note present |
| preamble neutrality | extracted from parsed JSON; none of classify/route/routing/owner/seam/skill names |
| prompt bodies | no skill name, no classify/route token, no leading slash, request verbatim, ASCII |
| `node merge-judge.mjs --selfcheck` | exit 0 (unedited) |
| `node selfcheck-code-review.mjs` | exit 0, all three cruxes |
| frozen files byte-unchanged | empty `git diff --stat` on `selfcheck-red.mjs`, `grade-run.mjs`, `grade-red.mjs`, `merge-judge.mjs`, `check-red-references.mjs` |
| ASCII-only on every authored file | `LC_ALL=C rg -c -N '[^\x00-\x7F]'` exit 1 (clean) on all 23 |
| Allowlist-inversion | zero email-shaped tokens in any authored file or diff; no forbidden value written, not even as a needle |
| `git status --porcelain plugins/lz-tdd` | empty (the sibling 22-03 owns those files) |
| `git status --porcelain fixtures/` | empty (Phase-21 canaries untouched) |
| `STATE.md` / `ROADMAP.md` | untouched (worktree mode) |
| metered commands run | **none** |

### Environment artifacts (pre-existing, NOT defects of this plan)

Two checks cannot complete in a fresh worktree because each workspace's `node_modules/` is gitignored
and therefore not carried in, while its `package.json` / `package-lock.json` are tracked. Neither file
was edited by this plan and both are proven byte-unchanged.

| Check | Symptom | Evidence it is environmental |
| ----- | ------- | ---------------------------- |
| `node selfcheck-red.mjs` | exit 1 at `[crux 7:canary-rdxf-red]`, `Cannot find module 'angular-typechecker/package.json'` | byte-unchanged; the tool's own error text documents this exact fresh-worktree case and names the fix; identical failure point BEFORE and AFTER this plan's edits; cruxes 1+2 (composition and byte-identical prompt parity across 3 suites / 6 prompts x 2 modes, the D-12 arm proof, the 13-token state-claim ban), 4, 5 and 10 all PASSED |
| `node grade-red.mjs --selfcheck` | throws, `Cannot find module '.../node_modules/vitest/vitest.mjs'` | byte-unchanged; same missing-gitignored-toolchain cause |

`npm install` was deliberately NOT run: a package-manager install is excluded from the auto-fix rules,
it is out of this plan's scope, and the untracked tree would not survive the worktree removal anyway.

**Crux 6 is the one assertion this costs, and it was covered by a stronger substitute.** Crux 6 runs
AFTER crux 7 in `selfcheck-red.mjs`, so it is never reached here. Its two claims are that the nx suite
still composes three arms with `plugins/lz-tdd` and that the apply preamble is byte-identical. Both
are strict subsets of the `cmp` byte-for-byte comparisons of the full dry-run output recorded above,
which were taken before and after the edit.

## Self-Check: PASSED

Files verified present on disk: `run-e2e.mjs`, `tabulate-mechanical-red.mjs`, `e2e-rgr-routing/`
(`suite.json`, `targets.json`, nine prompts), `grade-routing.mjs`, `fixtures-routing/`
(`fixtures.json`, eight answers), this SUMMARY.

Commits verified in `git log`: `4604455` (task 1), `f06fad4` (task 2), `f75977f` (task 3), all on
`worktree-agent-ab5f394f8e31ae850` atop fork base `c071b53`. No commit deleted a tracked file
(`git diff --diff-filter=D` empty for all three).
