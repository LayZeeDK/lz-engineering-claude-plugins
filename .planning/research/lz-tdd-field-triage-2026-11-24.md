# lz-tdd field ledgers: audit, triage and milestone plan

Published with Lars's approval (2026-11-24): "As long as no work repos ... are mentioned, it may be made public". The
projects named here are Lars's non-work projects. Roadmap state at the time: Phases 23 and 24 were added to lz-tdd@0.0.3
(commit a5e07ed); the later milestones below are backlog.

Written by Claude, 2026-11-24, from the ledgers of four projects that ran lz-tdd 0.0.3 at `e01201a` (installed
2026-10-26, never updated). HEAD of `gsd/lz-tdd-0.0.3-lz-red` is 24 plugin commits past that build; every theme
below was re-checked at HEAD (measured unless marked inferred).

## Sources read

| Project | File | Size | Period |
|---|---|---|---|
| stryker-playwright-runner | `docs/filings.md`, lz-tdd section | O1-O173, S1-S103 | 2026-10-26 .. 11-14 |
| lz-gardener | `.scratch/lz-tdd-ledger.md`, `.scratch/tdd-calls-decision.md` | ~60 entries | 2026-11-07 .. 11-16 |
| lz-node-test | `.scratch/plans/lz-tdd-upstream-ledger.md` (+ `t-tests-lztdd.md`, summarised in its O-review-1) | O1-O12, T1-T4, S1-S6 | 2026-10-26 .. 11-11 |
| lz-oop | `references/lz-tdd-ledger.md`, `.scratch/parameter-properties.report.md` here | 6 open, 1 closed, 1 report | 2026-11-15 .. 11-16 |
| dijkstra-js | no ledger; tracker plans lz-red as the entry for a refuted obligation (design intent, no usage evidence) | - | - |

Not read line by line: lz-gardener `tdd-cycles.log` (1,143 lines) and the stryker `cycles.log` files; the ledgers
already cite them. Copies under `.stryker-tmp/` sandboxes were ignored.

## Audit of the evidence

- **No bug report survives in any ledger.** All four apply the same bar (minimal reproduction or it stays an
  observation), and none reached it. Everything below is an observation or a suggestion.
- **Strongest signal is independent recurrence**: a theme seen by several projects, different workers and models.
- **Weak spots**: stryker's O104 retracted itself (the 150k cap came from a brief); O100 corrects O93 (a mapping
  miss, not a TPP gap); several lz-tpp "misfit" entries are a label being uninformative, not wrong advice. Where
  the ledger itself labels a cause as Claude's or the brief's (lz-node-test O6, stryker O86, gardener "Claude's own
  slip"), it is not a plugin finding.
- **Already true at HEAD (measured)**: none of the recurring themes is fixed. Phase 22 reworked routing only. The
  SKILL.md bodies grew from 30,428 B to 41,241 B (lz-red 14.3 KB, lz-refactor 17.8 KB, lz-tpp 9.1 KB), so the
  most-reported cost theme is 35% worse than in the field.

## Triage (themes, deduplicated)

Verdict: CONFIRMED = several independent projects, or measured at HEAD. SINGLE = one project, plausible.
DROP = not a plugin issue.

### A. Agent loops and cost (the plugin assumes a human developer)

| Id | Theme | Evidence | Verdict |
|---|---|---|---|
| A1 | Coach-only defaults block an agent that is told to implement ("show, don't drive"; "do not run the suite unasked"); every call needs "Command" wording | node-test O1/O2/S1/S2; stryker O3 (x4 rounds)/S3; gardener 11-14 step 7; user-scope `test-first.md` "You are the developer" exists only to undo this | CONFIRMED (4/4) |
| A2 | lz-tpp has no command paragraph; under a command it applies the change and does not name the transformation (2 of 10 calls); lz-refactor likewise skipped verdict and name | node-test O2/O11/S2; stryker O40/S36 | CONFIRMED |
| A3 | Whole SKILL.md re-sent per call: ~7.6K tokens per cycle at e01201a, ~10K now; workers drop calls to save context, then batch | gardener 11-08/11-09 + eval (once-per-session: $0.98 -> $0.31, peak 119K -> 48K, same outcome); stryker O58/O61/O62/S52/S55; node-test O5/S5; lz-oop #4 | CONFIRMED, measured |
| A4 | Descriptions trigger on a developer's coaching questions, not an agent's own work ("fix this finding test-first") | stryker O7/S7; node-test O6/O12 (calls skipped) | CONFIRMED |
| A5 | No cycle record survives compaction; skills skipped after a compaction | gardener 11-07, 11-14 (parallel append); user-scope cycle log + acceptance checks exist to cover it | CONFIRMED |

### B. lz-red: kinds of red and test shapes it does not name

| Id | Theme | Evidence | Verdict |
|---|---|---|---|
| B1 | Test-after / mutant-kill / guard test: green by construction, red only against the mutant; skill offers driver or characterization pin only | node-test O7/O10/T1/S6; stryker O1/O50/O84/O115/O157/S1/S44/S78; gardener 11-10 | CONFIRMED (3/4), most frequent lz-red gap |
| B2 | Mechanics leaf is Vitest-only; repos run `node:test` (t.mock, hooks order, `--test-name-pattern`, type stripping) | all of gardener, node-test, stryker (x5 "held again") | CONFIRMED (3/3 node:test repos); measured: no `node:test` text under plugins/ |
| B3 | Table-driven tests: one behaviour arrives as many rows; "exactly one new failing test" | node-test O3/S3; stryker O2/O18/O51/O62/O102/O107/S17/S45/S56; gardener J2-J7 | CONFIRMED |
| B4 | Reds that hang or crash (unbounded loop, synchronous never-yield, stack/heap); runner timeout cannot stop them | gardener GL27, cycle 4/5; stryker O42/O43/O152/O155/O161/S39/S97/S100 | CONFIRMED |
| B5 | Exact expected values derived from the environment or recalled from memory (8.3 paths, git messages, quote style, env vars captured into pins) | gardener F12/G5/Y19/start-count pins; stryker O71/O168/O172 | CONFIRMED |
| B6 | Fixture holds a second instance of what the test counts; wrong-reason reds that only the green exposes | node-test O4/O9/S4; stryker O73/O74/O85/O118/O151/O167/O173/S67/S79 | CONFIRMED |
| B7 | Old test contradicted by a new requirement; a correct green must change earlier expectations; fixture fallout | gardener G9/G11/H6/J1/J7; stryker O48/O76/O105/O116/O153/S42/S70 | CONFIRMED |
| B8 | Slow or gated reds (lock slots, e2e, 40 s specs): filtered runs, deferred reds, proof by mutation | node-test O8/2026-11-11; stryker O46/O97/O135/S41/S90; gardener R1-R6 | CONFIRMED |
| B9 | Integration/browser scope, type-level reds (tsc under type stripping), skip-count reds | stryker O4/O64/O66/O120/O156/S58/S60/S101 | SINGLE (one project, many instances) |
| B10 | Boundary examples after triangulation (limit, limit+1); one red per field of a multi-field parser | gardener diffs.ts; stryker O17/S16 | CONFIRMED |
| B11 | No review mode for an existing suite | node-test O-review-1/S-review | SINGLE |
| B12 | Seam needed before the red: hand off to lz-refactor and back | stryker O52/S46; gardener cycle 6, platform guard | CONFIRMED |

### C. lz-refactor: production-only catalogue and a count that misses costs

| Id | Theme | Evidence | Verdict |
|---|---|---|---|
| C1 | No test-code smells or test refactorings (Meszaros: General Fixture, Obscure Test, Mystery Guest, Test Code Duplication; removing a stepping-stone or twin test; hook to per-test setup) | gardener cycle 4; node-test O-review-1; stryker O5/O25/O31/O127 + "held again" x3/S5/S24/S30 | CONFIRMED (3/4); measured: no such text at HEAD |
| C2 | Missing leaves/smells: Replace Magic Literal, type assertion (`as`), Replace Loop with Recursion, executed-but-redundant code | gardener cycle 5; stryker O6/O10/O24/O82/O91/S6/S9/S23/S76/S84 | CONFIRMED; measured: no magic-literal leaf |
| C3 | Step-4 net-cost count: no mutation cost, no churn, no tie-break, no "defer"/"file busy", unlike units, rule-of-three improvised | stryker O19/O22/O30/O32/O41/O49/O114/S18/S21/S29/S31/S37/S43 | SINGLE project, heavy recurrence |
| C4 | Loop audit runs when nothing loops; ignores house rules (`forEach`), `lib` setting, type checker | gardener cycle 3; stryker O23/O53/O56/O82/S22/S47/S50 | CONFIRMED |
| C5 | No survey (read-only) mode and no verify-earlier-refactorings mode | stryker O20/O29/S19/S28 | SINGLE |
| C6 | No preparatory refactoring route; no route when the target is already chosen by a review or ruling | stryker O12/O14/O124/S11/S13 | SINGLE |
| C7 | Green suite trusted as the oracle when conditions are unpinned (dropped condition, merged branches) | stryker O128/O129/O131/O162/S103; gardener C2 duplication two cycles apart | CONFIRMED |
| C8 | Seven catalog leaves unreachable from the smell route | lz-oop #3 | CONFIRMED, measured at HEAD |
| C9 | Fowler catalog has no Sources section | lz-oop #6 | CONFIRMED, measured (4 of 5 catalogs have one) |
| C10 | Copy check covers only quoted runs > 120 chars; close paraphrase unmeasured | lz-oop #2 | SINGLE, inferred gap |
| C11 | Parameter properties in TS examples are not erasable syntax | lz-oop report | CONFIRMED, measured; fix in flight (quick 261124-nq7) |

### D. lz-tpp: where the premise does not fit the green step

About 30 entries across three projects. They share one finding: TPP ranks generality of data/control-flow
transformations, and most agent greens in real repos are something else.

| Id | Kind of green with no rung | Evidence |
|---|---|---|
| D1 | Exception and error paths (catch, retry, restore-and-rethrow) | gardener cycle 2/4; stryker O90/S83 |
| D2 | Editing an existing condition (widen, narrow, add disjunction, remove a clause) | stryker O37/O54/O77/S48/S71 |
| D3 | Introducing a collaborator or seam; reusing an existing predicate or library; moving existing code | gardener cycle 6, platform guard; stryker O67/O96/O166/S61/S89 |
| D4 | Mechanism, timing, order, platform hooks, representation change, resource bounds | stryker O33-O35/O101/O154/O155/S32/S33/S99/S100 |
| D5 | Data, templates, schemas, documents, config | node-test T3; stryker O36/O59/O80/O93/O119/S53/S74 |
| D6 | First green that must be a whole parse, component or engine | gardener GL1, S6; stryker O28/O68/O78/S27/S62 |
| D7 | Unbounded loop over I/O as the "simplest" green hangs the suite: bound it in the first green | gardener cycle 4; stryker O42/S38 |
| D8 | Ties: prefer the candidate right for cases the test did not name; where it lands (pipeline, range) | gardener O1; stryker O55/S49 |
| D9 | Test-after and finding-driven guards have no green to choose | node-test T1/T4; stryker O15/O38/S14/S35 |

Also positive: the impasse check worked as written (stryker O39); the priority order caught wrong first attempts.
Verdict: CONFIRMED as a class (3/3 projects that logged greens). The decision is a scope statement plus a small set
of named non-TPP green kinds, not ~30 new rungs.

### E. Records in this repository

| Id | Item | Verdict |
|---|---|---|
| E1 | `.planning/PROJECT.md:89` says GoF is not in `.oracle/`; line 214 says GoF was verified through the clean room | CONFIRMED, measured (lz-oop #5) |
| E2 | Quick task 261107-lbc executed and reviewed (round 2) in worktree `agent-a66eda950b4e0fb0a`, 4 commits through `2915060`, never merged; STATE.md shows it unfinished | CONFIRMED, measured |

### DROP

- Caller drift that the ledgers themselves attribute to Claude or a brief: node-test O6, stryker O86, O104
  (retracted), gardener "Claude's own slip", `sed -i` use, the late-written ledger entries.
- stryker O93 (corrected by O100: a mapping miss).
- lz-oop #1 (closed: the Direction column is correct).

## Which user-scope rules belong in the plugin

From `~/.claude/skills/lars-mode/references/test-first.md`, checked against the A/B memory (the rule buys process
discipline 3/3 vs 0/3 with an outcome tie on a kata, at 5.2x cost; the once-per-session call rule cuts cost about
3x with the same outcome).

| Rule | Adopt in plugin? | Why |
|---|---|---|
| "You are the developer" (an agent doing the work takes the recommendation and edits and runs) | Yes | Fixes A1 at the source; the rule exists only to undo the plugin's coach default |
| Once per session, again after compaction | Yes, with a short cycle card | Measured 3x cost cut, same outcome; pairs with A3 |
| Red/green/refactor completion criteria (exactly one new failure, from the code under test; compile error is not red; two behaviours = two tests) | Yes, into lz-red step 5 and lz-tpp step 1 | Plugin-generic; several are partly there already |
| Cycle log format (`<n> \| test \| red \| green \| refactor`, `test-after` lines) | Yes, as an optional reference | Answers A5 and node-test/stryker log gaps; needs `refactor-only`, deferred-red and pin rows (stryker O126/O141/O142) |
| Slow seams: cycle at the cheapest seam | Yes, lz-red stance | Plugin-generic |
| Acceptance checks over Claude Code transcripts (`rg` over `toolUseResult`) | No | Depends on transcript internals and Lars's orchestration |
| Subagent slice sizing (470k compaction, 350k mark) | No; a generic one-paragraph brief template at most | Machine- and window-specific |
| lz-tdd over `pstack:tdd` / `mattpocock-skills:tdd` | No | Lars's preference, user-scope |

Mods (`/plugin-authoring`): a cycle-log panel or enforcement hook would help A5, but Enterprise may exclude
plugin-packaged mods outside its allowlist, so nothing above may depend on one. Keep enforcement in skill text plus
an optional script; a mod can be an extra, never the mechanism.

Evals (Lars, 2026-11-24: "I want you to adopt `claude plugin eval` and/or slim `claude -p` and replace our current
skill-creator plugin-inspired eval setup."): `claude plugin eval` (Claude Code 2.1.327, measured from `--help` and
`init --bare`) runs `evals/**/case.yaml` or `prompt.md` + `graders/*.md` cases against the plugin, adds a no-plugin
baseline arm with the score delta (`--ablation with-without`), has deterministic graders such as `tool_used: Skill`
(reported as a plugin-fired indicator) beside `type: llm` graders (default judge Haiku, `--judge-model`), and has
`--runs`, `--max-cost-usd`, `--threshold`, `--json` and an HTML report. Lars notes graders that check a leaf was read
or a skill was loaded; the full grader catalogue is not in `--help` and is the migration phase's first research
item. Slim `claude -p` stays for runs `plugin eval` cannot express (apply-based edits in a real OSS repo, multi-arm
`--plugin-dir` toggles such as the Phase 22 placement A/B). The replacement retires the vendored skill-creator
harnesses under `.claude/skills/*-workspace/` (run_eval, trigger and grading scripts) once each suite is ported and
shown to reproduce a recorded result. `claude plugin validate` was already the structural gate in Phase 22 (exit 0
recorded 2026-08-03), so nothing to adopt there.

## `claude plugin eval` research (2026-11-24, from lz-oop and lz-gardener, measured unless marked)

Prior art in Lars's repos, the strongest evidence available:

- lz-oop `evals/lz-oop/` and `evals/lz-oop-real/` (real OSS repos), run through `nx run lz-oop:eval` /
  `eval-real`. `case.yaml` (`schema_version: "1.1"`, `name`, `tags`, `context.scaffold_script: checkout.sh`, which
  `git archive`s a pinned commit of a local clone) + `prompt.md` (frontmatter `max_turns`, `allowed_tools`) +
  `graders/*.md`. Grader forms seen: `type: tool_used` with `tool`, `input_match` (regex on the tool input JSON) and
  `arm: with-only | both`: `skill-fired` (Skill, the skill name), `leaf-read` (Read, the reference leaf the route
  should reach), `read-source` (Read, the source under study, both arms); `type: llm` with PASS-if / FAIL-if prose,
  judged three times (`judgeVotes`). Cases must sit below a plugin root, so a pre-eval step copies the plugin and its
  cases to `dist/eval/<plugin>/` (cases stay out of the shipped plugin). `--scaffold` runs the checkout scripts.
- Result JSON (`--json`): top `schemaVersion, claudeVersion, startedAt, durationSeconds, costUsd, partial, suite,
  cases, aggregates`; per case `arms.with[] / arms.without[]` runs with `score, passed, turns, costUsd, judgeCostUsd,
  durationSeconds, error, tracePath, graders[{name, passed, weight, explanation, withOnly, scored, judgeVotes,
  evidence}]`. No token counts seen in the run record. lz-oop's `tools/eval-summary.ts` adds Pass@k and Pass^k, skill
  fired and leaf read per arm; reuse its shape.
- lz-gardener spike (2026-11-21, `plans/lz-gardening-evals.plan.md`): trigger measuring runs on `plugin eval` from a
  plugin copy, `--ablation none --runs 2 -j 3 --trust-plugin --no-publish --threshold 0 --json`, $0.03-0.08 a run,
  no shell grant so no sandbox; a `tool_used` Skill grader separates triggered from not in both directions; the
  skill-creator `{query, should_trigger}` set compiles into one case per query with `train`/`test` tags; the improve
  step stays one slim `claude -p` call. Its "Why not `claude plugin eval`" section names the limits below.
- Limits: a Bash grant needs the OS sandbox and native Windows has none (WSL2 only), so any case that runs tests
  (every red-green behaviour eval) runs under WSL2 or through slim `claude -p`; every run starts fresh in its own
  workspace; `--ablation` compares with and without the plugin, not two plugin versions (placement A/B arms need
  slim `claude -p` with `--plugin-dir` toggles, or one suite run per packaged variant, inferred).
- Official docs (`code.claude.com/docs/en/plugin-evals.md`, read by the claude-code-guide agent 2026-11-24):
  - Six grader types: `regex` (`pattern`, `flags`, `match: not_contains | "count:N"`, `target`), `tool_used`
    (`tool`, `input_match`, `min`, `max`), `tool_order` (`before`, `after`), `file_exists` (created files only),
    `llm` (body = criteria, `focus`, 2 of 3 votes), `baseline` (compare to a reference `.jsonl` transcript).
    Common keys `type`, `weight`, `arm`. No custom-code or script graders, no diff grader: a test run is graded by
    having the agent write the outcome to a file plus a `tool_used` Bash check.
  - Leaf read is not its own grader type; it is `tool_used` on `Read` with a path-tail `input_match`, as lz-oop
    does. "Must not fire" = `tool_used` Skill with `min: 0`, `max: 0`, `arm: both`. Trigger suites score the
    Skill grader only under `--ablation none` or `arm: both`.
  - Regex/llm targets: `last_message` (default), `trace` (llm judge sees first and last 12 messages only),
    `files`, `{ source: file, path }`, `mock_calls`.
  - Isolation is the default: each run is a `claude -p` child with its own temporary home; user settings, hooks,
    CLAUDE.md, memory, skills, other plugins and project `.claude/` are absent; managed settings still apply; env
    limited to an allowlist plus `EVAL_*`. This covers what slim `claude -p` exists for in read-only suites.
  - `scaffold_script` is Bash, 120 s limit, runs only with `--scaffold`; files it writes under `.claude/` or
    `CLAUDE.md` are not loaded. Shell grants are refused on native Windows (WSL2 only).
  - No version-vs-version arms: `--ablation` is `none` or `with-without`. Variant A/B = one `--ablation none`
    run per packaged variant with `--model` and `--judge-model` pinned, then compare the JSON.
  - Read directly by Claude 2026-11-24 (markdown.new). Additions: only Bash/PowerShell grants need the sandbox;
    `--allow-tools Write Edit` runs natively on Windows, so apply-based cases that edit files and are graded on
    `{ source: file, path }` contents (regex) or `tool_used` Edit run here; only cases that RUN tests need WSL2.
    Under the sandbox the home folder is unreadable and network is limited to granted domains.
    `context.add_dirs` gives read-only fixture folders inside the case dir with no `--scaffold`. Judge default is
    the background-task model. `--keep-temp` keeps each run's workspace. A run ending on an API error (rate or
    usage limit) scores 0 ungraded and the command exits non-zero, not partial: re-run those cases. Trusting a
    path trusts the whole git repo. Git >= 2.31 required. Related page not yet read: `plugins/measure.md`
    ("what the plugin adds to each session's context"), relevant to theme A3.
  - No Pass@k / Pass^k fields (compute them, as lz-oop's `eval-summary.ts` does). Per-run `costUsd`,
    `judgeCostUsd`, `durationSeconds` and `turns` are present in the 2.1.327 result file (measured in lz-oop's
    `aggregate-result.json`, though the docs name only the suite-level fields). No token counts anywhere.

Mapping for lz-tdd (inferred): EVL-01 trigger suites -> `plugin eval`, Read/Glob/Grep/Skill only, `tool_used` Skill
graders, positive and near-miss cases; coaching-answer suites (EVL-02 style) -> `plugin eval` with `llm` graders
plus `leaf-read`; apply-based red-green-refactor suites that run tests -> WSL2 `plugin eval` with a scaffold, or slim
`claude -p` (existing `run-slim.ts`) where WSL2 is not set up; placement A/B -> slim `claude -p` arms.

## Milestone plan (recommendation)

### lz-tdd@0.0.3 (current, PR #3 held at the Phase 22 metered-round gate)

Land now, through GSD quick tasks; none changes routing or descriptions, so none invalidates the Phase 22 rounds:

1. C11 erasable TS examples (quick 261124-nq7, executing).
2. E2 merge the stranded 261107-lbc work (`/gsd-core:gsd-quick resume`).
3. C8 link the seven unreachable leaves from `smells.md` or the routing table.
4. C9 Fowler Sources section; E1 fix the stale PROJECT.md line.

Then a new Phase 23, "Eval harness on `claude plugin eval` and slim `claude -p`", before the two owed Phase 22
metered rounds: port the trigger suites (EVL-01 is a `tool_used: Skill` grader with the built-in baseline arm), the
placement A/B (leaf-read graders, or slim `claude -p` with `--plugin-dir` arms), and the behaviour suites; reproduce
one recorded result per suite unmetered or at minimal spend (spend needs Lars's go-ahead); retire the skill-creator
harnesses. The Phase 22 rounds then run once, on the new harness.

Decision for Lars: A1+A2 (agent-as-developer, command naming line) change SKILL.md bodies. The owed Phase 22
rounds measure bodies and descriptions, so a body change after them means a rerun. Either fold A1+A2 into 0.0.3 as
a Phase 23 before the rounds (extends the PR hold, one measurement covers both), or ship 0.0.3 as is and start
0.0.4 with them.

### lz-tdd@0.0.4 "lz-tdd in agent loops" (next)

A1-A5, B1, B2, B3 and the adopted user-scope rules. Shape: each SKILL.md becomes a short router plus cycle card
(target: a few hundred tokens per repeat call), procedures move to references read once; an agent-as-developer
clause in all three; a required naming/verdict line under a command; a `node:test` mechanics leaf beside Vitest; a
third red kind (guard/mutant-kill, red shown against the mutant) and table rows as one behaviour; the cycle log
reference; trigger phrases for an agent's own work. Eval: `claude plugin eval` / slim `claude -p`, apply-based in a
real repo per the repo's eval-design memory, with cost and context as first-class measures. Every content change
gets subagent review; any metered run waits for Lars.

### lz-tdd@0.0.5 "lz-red depth"

B4-B12: hang/crash reds, environment-derived expectations, fixture purity, contradicting old tests and fixture
fallout, slow/gated reds, boundary examples, seam handoff, type-level reds, a review mode.

### lz-tdd@0.0.6 "lz-refactor for test code and real costs"

C1-C7, C10: a test-smell catalogue (Meszaros, clean-room through the oracle where the book is owned), missing
leaves, step-4 extensions (mutation, churn, defer, tie-break), loop-audit house-rule deference and skip-when-no-loop,
survey and verify modes, preparatory and pre-chosen refactorings, unpinned-condition checks.

### Agent-as-developer conversion (Lars, 2026-11-24: "I'm okay with converting the lz-tdd plugin to an
agent-as-developer plugin and instead of coach mode have `/lz-tdd:lz-tdd-audit` and `/lz-tdd:lz-tdd-review` skills
similar to the lz-oop plugin.")

Reading taken by Claude (stated to Lars): the conversion of lz-red, lz-tpp and lz-refactor (coach mode removed; the
skill does the step and names the transformation or refactoring) IS the A1/A2 work Lars put in 0.0.3, so it ships
there. The two new skills `lz-tdd-audit` (a package or repository: test-suite and TDD-practice hot spots, read-only)
and `lz-tdd-review` (a change: was it test-driven, red/green/refactor discipline, test quality) are new surface and
open 0.0.4, modelled on lz-oop's `lz-audit` / `lz-review` (read-only, route-only SKILL.md, references read before
reporting, and a fresh-context `auditor` / `reviewer` agent when the current session wrote the code, findings
checked against the code before relaying). Explain-on-demand (PROJECT.md core value "explains the premise on
demand"), Lars 2026-11-24: "Either as part of lz-tdd-audit/lz-tdd-review or a separate lz-tdd-coach skill".
Claude's recommendation for 0.0.4 discuss-phase: a separate `lz-tdd-coach` skill limited to explaining (TPP, the
red/green/refactor rules, a smell or refactoring), never driving code; audit and review stay read-only reports with
a code scope, and folding open-ended questions into their descriptions would blur when each triggers.

### Bulk-step milestone (Lars, 2026-11-24: "Another change I suggest in a separate milestone: Several concurrent
changes in one red/green/refactor phase step. ... we should support a *bulk* mode that for example writes multiple
failing tests in one red phase.")

Prior art, read 2026-11-24 from local clones `D:\projects\github\marmicode\skills` (fa09f8d) and
`...\charted-coding-workshop` (367dd06): `charted-red` writes the body of the next `it.todo` test and keeps it todo;
`charted-green` activates written todo tests "strictly one at a time", green after each; `charted-continue` routes
scaffold/red/green from a design doc's checkboxes, one downstream skill per run; workshop 302 tip: "`/charted-red all
tests` or `/charted-green all tests`", goal "try and feel the right step granularity". So bulk red = many tests
written but parked (todo/skip), activated one per green; the one-failing-test rule holds at the moment of each green.
Ledger evidence feeding it: B3 (table rows as one behaviour), stryker O2/O18/O51/O62 (batched reds), gardener J2-J7,
the cost theme A3 (fewer calls per change). lz-refactor bulk = one refactoring applied across many sites in one step
(already close to the step-5 loop audit). Motivation, Lars 2026-11-24: "One of the reasons I'm suggesting bulk
mode is that I have observed that Claude sessions have taken a lot more wall-clock time since we started using the
lz-tdd plugin. Any way to make the steps faster would be beneficial and bulk mode is my first proposal to address
this that we should sample." So the milestone's success measure is wall-clock time per finished change (plus cost and
peak context), sampled A/B single-step vs bulk on the same tasks with outcome quality held; prior data point: gardener's
once-per-session eval cut cost $0.98 -> $0.31 and peak context 119K -> 48K at the same outcome, and the rules A/B
memory measured 2.8x time for the test-first rule. Other speed levers to sample beside bulk: fewer skill calls per
cycle (once per session + a short cycle card, A3), smaller SKILL.md bodies, and running only the affected tests per
step (B8). Research first: Beck's test list, Charted's todo parking, and what
"several concurrent changes" means for lz-tpp's one-transformation rule.

### lz-tdd `lz-green` skill milestone (Lars, 2026-11-24: "All ledger entries about the `lz-tpp` skill not being
sufficient for the green phase goes into a separate `lz-green` skill milestone")

A new `lz-green` skill owns the green step; lz-tpp stays the TPP specialist it can consult. Scope: every D entry
(D1-D9) plus the green-step entries filed elsewhere above: A2's naming line for the green, B7's correct green that
must change earlier expectations, stryker O79/O121/O125/O146/O150/O165 (second transformation, right change with
one wrong detail, outside rulings, the green that breaks earlier tests), gardener K8/H5/J1 (run neighbouring specs,
lint and fixture searches before calling green done), stryker O75/O81 (formatter after green, port the reference's
size). Research first (what Beck, Martin and others say about each kind of green, through the oracle where owned),
then design the lz-tpp/lz-green split and the routing change in the three-way classifier.

Order rationale: 0.0.4 removes the costs that make agents skip the skills, and the field showed that a skipped
skill makes every other improvement moot (stryker O6/O7/O61, gardener 11-07, node-test O12).
