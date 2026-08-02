# Quick Task 260801-w8b: D-12 Option A target qualification - Research

**Researched:** 2026-08-01
**Domain:** eval instrument design -- target selection for a stub-vs-mock apply suite under the D-06 gate
**Confidence:** HIGH on the gate analysis and the negative finding; MEDIUM on the ranked candidates
**Spend:** ZERO. No `claude -p`, no metered command, no install, no clone, no write outside this file.

---

## What I actually did (so you can discount the rest correctly)

VERIFIED-BY-READING (I opened the file and read the code/artifact):

- `.claude/skills/lz-red-workspace/grade-red.mjs` -- `VERDICTS` (:71-80), `ASSERTION_RE` (:84-85),
  `RUNTIME_RE` (:88-89), `changedProductionFiles` (:167-169), `attributedAssertions`/`addedTestTitles`
  (:266+), `classify()` (:758-836), `verdictPass` (:838-840).
- `.claude/skills/lz-red-workspace/selfcheck-red.mjs` -- crux 1/2 (:280-382), `STATE_CLAIM_TOKENS`
  (:250+), `forbiddenTokensIn`.
- `.claude/skills/lz-red-workspace/tabulate-mechanical-red.mjs` -- cell key `${target}:${pid}|${arm}`
  (:113, :352) and the fail-closed duplicate rule (:336).
- `e2e-red-srvx/{suite.json,targets.json,prompts/r1-next-test.md}`, `e2e-red-gilded-rose/suite.json`,
  `e2e-red-gilded-rose/RUN-GATE.md` (full, both pages).
- `h3js/srvx` at pin `55d90b39840a5bb7236e23c4e326ee4fc3842d57`: all seven adapters, `_plugins.ts`,
  `_middleware.ts`, `_utils.ts`, `tracing.ts`, `log.ts`, `body-limit.ts`, `static.ts` (options block),
  `types.ts`, `adapters/_node/send.ts`, and the test index.
- `run-e2e.mjs` :194-195, :265, :304-306 -- CONTEXT's claim about the uncommitted `invoke_forcing`
  wiring is CORRECT.

VERIFIED-BY-TOOL (I ran the command this session):

- `git log/rev-parse/status/ls-tree/grep/show` against the srvx checkout. HEAD is `55d90b3`
  (`chore(release): v0.12.4`), detached, working tree CLEAN, one worktree entry. `node_modules` and
  `dist` are both present on disk (`du -sh node_modules` = 185M).
- GitHub REST API, `h3js/srvx` open issues, 2026-08-01. Issue **#144 is STILL OPEN and is STILL the
  only open `bug`-labelled issue**. Issue **#283** (AWS Lambda cookie duplication) opened 2026-07-29,
  unlabelled, no fix PR.

NOT VERIFIED -- I ran NOTHING that executes srvx, vitest, tsc, atc, `grade-red`, or `selfcheck-red`.
Every claim about what a produced test would GRADE is INFERRED from `classify()` plus the target
code, except where I say the maintainer's own artifact records a measurement.

---

## Summary

**The D-06 gate can carry this measurement, but not for the reason the CONTEXT states, and the half
of the matrix Option A was created to reach is blocked by the instrument's own non-leading rule.**

Three findings, in descending order of how much they should change the plan.

**1. `false_green` and "a double with zero diagnostic power" are the SAME D-06 verdict.** The
CONTEXT offers them as two acceptable mechanical signatures. `classify()` grades ONE tree -- the pin
-- and never re-grades against a fixed tree, so "green at the pin" and "green before AND after a
correct fix" are indistinguishable in any `red-grade.json`. srvx's celebrated zero-diagnostic-power
property was established once, by hand, by applying a real fix and re-running; the A/B run does not
re-establish it and cannot. Plan for ONE signature, `false_green`, and treat the diagnostic-power
claim as a property of the TARGET, not an output of the round.

**2. The Option-A requirement is in structural tension with crux 2.** For "a mock is the right
answer" to be mechanically visible, the missing outgoing command must be invisible to observable
state -- otherwise a state assertion also goes red and the fork collapses. But crux 2 forbids a
leading prompt, so the prompt may only name a SYMPTOM. A defect invisible to observable state HAS no
symptom other than "the message was not sent". So the prompt must either name the collaborator and
the message -- handing the model the double choice outright -- or describe nothing at all. This is
not a search problem. It is a design constraint, and it is the real reason nobody has found this
target yet. The escape hatch exists and is named in "The shape you actually need" below, but srvx
does not contain it.

**3. srvx's collaborator surface is almost entirely outgoing QUERIES, so it cannot supply the
missing half.** `ErrorHandler` returns a Response (`types.ts:403`). `ServerMiddleware` returns a
Response (`:41-44`). `BodyLimitErrorFactory` returns an error. `static.ts`'s `renderHTML` returns a
transform. The only pure outgoing COMMANDS in the package are `ServerPlugin` (`(server) => void`,
`:47`), `waitUntil` (`(p) => void`), the two `diagnostics_channel` publishes in `tracing.ts`, and
`console.error` / `process.stderr.write`. I checked each: correct at the pin, exhaustively covered by
the target's own suite, global rather than injected, or a defensible design choice. There is no live
srvx defect of the shape Option A is missing.

**Primary recommendation:** do NOT author a new suite for the missing direction yet. Run the
three-arm round on the EXISTING `SRVC` cell, which already carries the strongest measured
double-design property in the corpus at zero authoring cost, and add exactly one blind-judge
double-kind dimension. If you want the corpus wider in the same round, add `SRVA` (issue #283) as a
second cell in the SAME vendored srvx suite -- cheap, freshest contamination profile in the corpus --
but book it as a RED-discipline widener, not as an Option-A cell.

---

## User Constraints (from CONTEXT.md)

### Locked Decisions (verbatim)

- **The discriminator is the Metz message matrix (auto-locked, HIGH confidence).** "Stub-vs-mock
  materially changes the correct test" is pinned to the rule `lz-red` ALREADY teaches: assert the
  RETURN of an incoming query; assert the public side effect of an incoming command; ignore self and
  outgoing queries; expect-to-send ONLY for an outgoing command. Spy versus Mock is about WHERE THE
  ASSERTION LIVES.
- **The wrong choice must be MECHANICALLY visible, not merely judged (auto-locked, HIGH
  confidence).** Pick a target where choosing the WRONG double kind produces a mechanically
  detectable outcome under the EXISTING D-06 gate -- a `false_green` or a double with zero diagnostic
  power.
- **Three arms, one baseline (auto-locked -- owner instruction "Widen").** `invoke_skill` BASELINE,
  `invoke_treatment` PASSIVE lever, `invoke_forcing` ACTIVE lever. `invoke_forcing` must NOT contain
  the taxonomy content.
- **Partially built already -- reuse, do not rebuild (auto-locked).** `run-e2e.mjs` carries
  `invoke_forcing` at `:194`, composes it identically to `invoke_skill` at `:265`. Confirm both new
  arms are EXCLUDED from `--arm all`.
- **Grading (auto-locked).** D-06 carries the primary variable. At most ONE blind-judge dimension for
  double-kind appropriateness, never a `phraseSet`. Do NOT score "did it ask which side / which
  kind"; record asking as an outcome.

### Claude's Discretion (verbatim)

- Whether the new suite borrows an already-vendored repo or a genuinely new one, subject to the
  qualification gates. A new SUITE does not strictly require a new REPO.
- Suite directory name within the `e2e-red-*` auto-discovery namespace.
- Prompt wording, subject to the non-leading constraints.

### Hard gates (NOT discretionary)

1. Package-legitimacy gate (T-21-SC) on any NEW repo, BEFORE install or vendoring. No
   auto-substitution of a similarly-named alternative.
2. Contamination assessed and FLAGGED, never assumed low.
3. `ngbracket/ngx-layout` is PERMANENTLY CLOSED. Not revisited anywhere below.

### Deferred / out of scope

Option C and everything under `.claude/skills/lz-red-workspace/probe-d12-ambiguity/` (archived at
`D:/.lz-red-archive/2026-08-01-optionC-abandoned/`). Not touched, not revived, not built on.

---

## Project Constraints (from CLAUDE.md / AGENTS.md)

- ASCII only. No emoji, no em/en dashes, no curly quotes. This document complies.
- Public-repo hygiene: the only email-shaped token permitted in maintainer-authored content is the
  approved public gmail. Allowlist-inversion scan run on this file after writing it: ZERO
  email-shaped tokens are present, so the allowlist holds vacuously. No forbidden value is written
  anywhere, including as a search needle.
- `git grep` first, `rg` for gitignored trees, never `grep`. Followed.
- GSD workflow: this is quick task `260801-w8b`; research only, no repo edits outside this file.

---

## Part 1 -- What the D-06 gate can actually distinguish

Read from `grade-red.mjs:758-840`. VERIFIED by reading; not by running.

`classify(tscResult, runnerJson, diffPatch)` returns exactly one of eight, in this decision order:

| # | Verdict | Trigger, exactly | pass |
|---|---------|------------------|------|
| 1 | `compile_error` | `tscResult.newErrors > 0`. Checked FIRST, before the runner report is looked at. | false |
| 2 | `no_tests` | zero `assertionResults` AND the runner's own suite-level sentence matches `NO_TESTS_RE` | false |
| 3 | `collection_error` | zero `assertionResults`, no such sentence | false |
| 4 | `false_green` | at least one assertion ran, NONE failed, and `changedProductionFiles(diff)` is empty. ALSO reached when something failed but every ATTRIBUTED (diff-added) test passed. | false |
| 5 | `drove_to_green` | same as 4 but the diff touched at least one non-test file | false |
| 6 | `unattributable` | at least one failure, but nothing in the report ties to a title the diff ADDED | false |
| 7 | `wrong_reason` | at least one ADDED test failed, but some added-test failure message fails `ASSERTION_RE` or matches `RUNTIME_RE` | false |
| 8 | `genuinely_red` | at least one ADDED test failed and EVERY added-test failure is assertion-shaped | **true** |

`verdictPass(v)` is `v === 'genuinely_red'` (`:838-840`). Nothing else passes.

### Four consequences that bear directly on Option A

**(a) The gate has NO concept of a test double.** It never inspects the diff for `vi.fn`, `vi.mock`,
`toHaveBeenCalled`, or anything else. `changedProductionFiles` exists solely to split `false_green`
from `drove_to_green`. The wrong double kind is visible ONLY through whichever verdict it happens to
land on. Corollary: `genuinely_red` vs `false_green` measures "did the produced test fail on current
code" -- the same thing D-06 measures on every existing cell. The attribution of that split to a
double-kind decision is a property of the TARGET DESIGN, inferred, not measured.

**(b) A failing mock assertion DOES grade `genuinely_red`.** `ASSERTION_RE` (`:84-85`) includes
`\btohavebeen`, and vitest's failed-spy message opens `AssertionError: expected "spy" to be called
with arguments:` -- which matches on `assertion` and on `\bexpected\b` regardless. `RUNTIME_RE` does
not match it. So the gate is NOT biased against mocks; expect-to-send is a first-class way to pass.
Good: it means a "mock is right" cell is gradeable in principle.

**(c) A fabricated double that omits a method the SUT calls grades `wrong_reason`, not
`genuinely_red`.** `RUNTIME_RE` (`:88-89`) matches `is not a function` / `cannot read propert`. This
is a SECOND mechanically-visible wrong-choice landing zone, and it is worth naming because the
CONTEXT does not: a half-built double fails loudly, not silently.

**(d) `false_green` and "zero diagnostic power" are indistinguishable.** `gradeRun` grades one tree
at `applyBase`. It never applies a fix and re-grades. srvx's `mock_has_no_diagnostic_power_note`
records a HAND measurement ("Verified by applying a real fix and re-running") -- that is a fact about
the target, established once, and it does not reappear in any run's artifact. If the round is meant
to report it, that needs a second grading pass the instrument does not have and that nobody has
scoped.

**Net: the usable primary variable is `genuinely_red` (right double) vs `{false_green,
wrong_reason, compile_error}` (wrong double or bad test).** That works. But because of (a), the ONE
permitted blind-judge dimension is not decoration -- it is the only thing separating "chose the right
double kind" from "wrote any test that happens to fail". Budget for it as load-bearing.

---

## Part 2 -- Is reusing a vendored repo legitimate?

**Yes, with two named conditions. It does not compromise the measurement.** State this plainly to
the owner: the highest-authoring-cost option is not automatically the best one, and here it is
demonstrably not.

The eval's unit is the CELL, not the repo. The tabulator keys on `${target}:${pid}|${arm}`
(`tabulate-mechanical-red.mjs:113, :352`) and fails closed on a duplicate key (`:336`). A second
target inside an existing suite is a first-class cell with its own Pass@k column. `RXF` and `RXL`
already prove the pattern: same repo, same pin, same suite dir, same throwaway, two independent
cells.

**Condition 1 -- do NOT put the new cell on the SAME FILE as an existing cell.** That is the
RUN-GATE's own CAND-3 attribution warning (Step 1.5): two attributes on one file is "the only
configuration in the corpus where a run can legitimately land on the other cell's gap". This rules
out the otherwise-obvious "second cell on `send.ts`'s fast path".

**Condition 2 -- deep-equality or a new canary.** RXL is licensed to inherit RXF's canaries only
because its `runner`, `typecheck` and `toolchain_paths` blocks are DEEP-EQUAL (RUN-GATE Step 2); the
battery FAILS on divergence, forcing a canary rather than letting one be silently inherited. A new
srvx cell that reuses SRVC's blocks verbatim inherits `canary-srvc-red` and `canary-srvc-compile` at
zero added battery time. If it needs different `typecheck.args` or a different runner, it costs two
new fixtures at roughly 8.5 s of toolchain copy each -- small against the battery's existing 404.5 s.

**What reuse saves, concretely:** no clone, no legitimacy gate (srvx was gated at measurement time),
no new `npm install` round, no new toolchain measurement, no new `repo` path-form derivation, no new
apply preamble, and grading at an already-measured ~8.5 s + ~1.6 s prebuild instead of an unknown.

---

## Part 3 -- The shape you actually need, and why srvx does not have it

For the missing direction ("a mock is the right answer, a state assertion is a false green") the
target must satisfy all four of:

1. an INJECTED collaborator (not a module-scope import, or the model has to `vi.mock` and the fork
   changes shape);
2. the SUT sends it an outgoing COMMAND -- return value unused;
3. a live defect where that command is missing or carries wrong arguments;
4. the defect leaves the SUT's own observable output UNCHANGED, so a state assertion goes green.

Condition 4 is what makes the wrong choice a `false_green`. Condition 4 is also what makes the
prompt unwritable under crux 2, because it means the defect has no symptom a human would report.

**The escape hatch, stated so a future search is not blind:** pick a target where the missing
outgoing command has a DELAYED or SECOND-ORDER observable. "The process exits before the analytics
flush lands." "The next request still serves the stale cached value." "The retry never fires."
The prompt then names the second-order symptom honestly, and the model still faces a real fork:
assert the second-order state (timing-dependent, flaky, and the wrong Metz answer) or expect-to-send
on the collaborator (correct). That is a real, findable target shape. It lives in job queues, cache
layers, event buses, telemetry clients and ORMs -- not in an HTTP server whose whole observable is
its response.

### srvx audit against condition 2, exhaustive

VERIFIED by reading `types.ts` plus all seven adapters at the pin.

| Collaborator | Signature | Metz class | Live defect? |
|---|---|---|---|
| `ErrorHandler` (`options.error`) | `(error) => Response \| Promise<Response>` (`types.ts:403`) | outgoing QUERY | no; and the matrix says do NOT mock it, so it is the wrong lever |
| `ServerMiddleware` | returns a Response (`types.ts:41-44`) | outgoing QUERY | no |
| `BodyLimitErrorFactory` (`createError`) | returns an error | outgoing QUERY | no; `test/body-limit.test.ts` covers injection in 6 dedicated tests including the cancel path |
| `renderHTML` (`static.ts:388`) | returns a transform | outgoing QUERY | not investigated to a defect |
| `ServerPlugin` | `(server) => void` (`types.ts:47`) | outgoing COMMAND | invoked by all 7 adapters; VERIFIED by `git grep options.plugins` -- aws-lambda:83, bun:37, bunny:42, cloudflare:40, deno:43, generic:24, node:62 |
| `waitUntil` | `(promise) => void` | outgoing COMMAND | absent on the AWS Lambda adapter only; see the rejected-candidate note below |
| `diagnostics_channel` publishes (`tracing.ts`) | `tracePromise(...)` | outgoing COMMAND | ordering subtlety only; see CAND-3 |
| `console.error` / `process.stderr.write` | `(msg) => void` | outgoing COMMAND | not injected -- global; and correct at the pin |

**Rejected, with the reason, so nobody re-derives them:**

- **`errorPlugin` missing from `bun.ts` / `deno.ts`.** Looks like a bug (every other adapter calls it
  right after the plugin loop). It is NOT: both delegate natively -- `bun.ts:83` passes
  `error: this.options.error` to `Bun.serve`, `deno.ts:99` passes `onError: this.options.error` to
  `Deno.serve`. Checklist point 4 FAIL (design choice).
- **`waitUntil` absent on `AWSLambdaServer`.** VERIFIED: it is the only adapter with no
  `createWaitUntil()`, no `request.waitUntil`, no `server.waitUntil`, and a `close()` that returns
  `Promise.resolve()` immediately. Two independent kills. Point 4: Lambda freezes the container after
  the response and has no `waitUntil` primitive, so "no waitUntil on Lambda" is defensible and there
  is no issue for it -- this is the "arguing with the maintainers" failure the checklist names.
  Point 3: worse -- `request.waitUntil` is `undefined`, so a handler calling it throws
  `TypeError: ... is not a function`, which hits `RUNTIME_RE` and grades **`wrong_reason` even when
  the model is RIGHT**. A target whose correct answer grades false is disqualifying.
- **`pipeline(...).catch(() => {})` in `send.ts:pipeBody` swallowing mid-stream errors with no
  `console.error`, unlike `handleSendError`.** Real asymmetry, but `.catch(() => {})` is plainly
  deliberate (aborted client connections are routine and would spam logs). Point 4 FAIL.
- **No HEAD guard on `send.ts:pipeBody`** while `streamBody` has one. Plausible bug, but the failure
  mode is a HANG, which costs a grade timeout rather than a verdict. Instrument-hostile.

---

## Part 4 -- Ranked candidates

Scored against the RUN-GATE Step 1 seven-point checklist, evidence per point.

### CAND-1 (RANK 1) -- REUSE the existing `SRVC` cell. No new suite, no new repo, no new target.

The lazy answer, and I believe it is the correct one.

| # | Checklist point | Verdict | Evidence |
|---|---|---|---|
| 1 | Small + Vitest + offline-vendorable | **PASS** | MEASURED in RUN-GATE Step 1: 12,855 files / 170.8 MB; 6.89 s copy + 1.62 s remove; `runner_measured` records exit 1 in 1458 ms. `node_modules` and `dist` confirmed on disk today (185M). |
| 2 | Public API exists and compiles | **PASS** | `targets.json` line 63: "`serve` from srvx/node, tsc-clean after the prebuild". Prebuild is declared and canaried (`canary-srvc-red` proves 13-errors-unbuilt goes to 0-errors-built). |
| 3 | Correct-behavior test fails on an ASSERTION | **PASS, MEASURED** | `runner_measured` in `targets.json` records the exact failure: `AssertionError: expected [ 'b=2' ] to deeply equal [ 'a=1', 'b=2' ]`. Not my inference. |
| 4 | Genuine bug, not a design choice | **PASS, RE-VERIFIED TODAY** | Issue #144, maintainer-labelled `bug`, opened 2025-11-11. I queried the GitHub API on 2026-08-01: it is STILL OPEN and STILL the only open `bug`-labelled issue in the repo. |
| 5 | Contamination LOW or flagged | **PASS with a NEW caveat** | See Part 5. |
| 6 | Byte-identical short human prompt works | **PASS, ALREADY GREEN** | `prompts/r1-next-test.md` exists, names `test/`, declares 9 forbidden tokens, and crux 2 already passes it in both directions including the poisoned variant. |
| 7 | Stresses a RED-DISCIPLINE axis | **PASS -- and it is THE double axis** | `discipline_traps[0]` is `message-matrix-over-mock`, with the measured zero-diagnostic-power double. |

**The reframe that makes this the answer.** RUN-GATE calls SRVC a CONTROL and warns that a tie there
is not readable. That framing is about DOMAIN transfer -- "does any lift survive outside the kata's
domain". It is not about the double axis. On the double axis, SRVC is not a control at all: it is the
only cell in the entire corpus whose correct answer is determined by a double-kind decision. Reusing
it for D-12 is a legitimate re-reading of an existing instrument, not a category error. Say so
explicitly in the round's write-up so the two readings do not get confused.

**What it costs:** one `targets.json` note, one judge dimension, and the three arms. Crux-2 entry
cost is **ZERO** -- suite, prompt, `test_dir` pin, forbidden-token list and the poisoned-variant
check all already exist and are green. That is the single largest argument here and it is worth
stating in one line to the owner.

**What it does NOT buy:** the missing half. SRVC only exercises "a mock was WRONG". It will not tell
you whether the treatment teaches the model when a mock is RIGHT. Do not let the round's write-up
claim otherwise.

---

### CAND-2 (RANK 2) -- `SRVA`: a NEW cell in the ALREADY-VENDORED srvx suite, on issue #283.

**Target:** `src/adapters/_aws/utils.ts` -- `awsEventHeaders` copies every `event.headers` entry and
then appends every `event.cookies[]` entry, so a Lambda Function URL payload-2.0 event carrying
cookies in both places doubles every cookie. `requestToAwsEvent` has the mirror-image defect.

| # | Checklist point | Verdict | Evidence |
|---|---|---|---|
| 1 | Small + Vitest + offline-vendorable | **PASS, free** | Same repo, same pin, same throwaway, same toolchain as SRVC. No new install. |
| 2 | Public API exists and compiles | **PASS** | `toLambdaHandler` / `invokeLambdaHandler` are exported from `src/adapters/aws-lambda.ts`; `srvx/aws-lambda` is a declared export in `package.json`; `test/aws.test.ts` already exercises them. |
| 3 | Assertion-red on current code | **INFERRED, HIGH confidence** | The issue quotes the exact function body and the exact doubled output (`session=abc; theme=dark; session=abc; theme=dark`). I did not run it. |
| 4 | Genuine bug | **PASS, weaker than #144** | Open issue #283, 2026-07-29, third-party reporter, concrete repro, suggested fix, NO fix PR. Caveat: **unlabelled** -- no maintainer has stamped it `bug`. |
| 5 | Contamination | **LOWEST IN THE CORPUS** | Reported three days before this research. Post-cutoff for any current model. And the reporter states the path is byte-identical from 0.11.16 through 0.12.4, so the defect is **live at the EXISTING pin** -- no re-pinning, no re-canarying. |
| 6 | Byte-identical short prompt | **PASS** | The symptom is nameable without the mechanism. Draft in Part 6. |
| 7 | Stresses a RED-DISCIPLINE axis | **PASS on two axes -- but NOT the double axis** | assert-observable-behavior (assert what the fetch handler receives, not which header call was made) and root-cause-over-symptom (the reporter says `requestToAwsEvent` carries the same defect, so a one-path fix is a symptom fix). **`awsEventHeaders` is a pure function with no collaborator, so stub-vs-mock does not change the correct test.** |

**Verdict: excellent RED cell, NOT an Option-A cell.** Recommend it as a cheap corpus widener that
rides along in the same round at the same per-grade cost -- it is the only new cell in the corpus
with genuinely near-zero contamination. Do not book it against D-12's question.

---

### CAND-3 (RANK 3) -- `SRVT`: `tracingPlugin` does not trace middleware added after it.

The only srvx shape that fits Option A's missing direction. I rank it third because it fails point 6,
and I want the owner to see exactly why before spending.

**The defect:** `tracing.ts` splices the middleware array AT PLUGIN TIME. `errorPlugin` runs AFTER
all user plugins in six of seven adapters (`node.ts:62-63`, `generic.ts:24-25`, `cloudflare.ts:40-41`,
`service-worker.ts:37-38`, `bunny.ts:42-43`, `aws-lambda.ts:83-84`) and `unshift`s its middleware; on
`bun.ts`/`deno.ts` `trustProxyPlugin` and `gracefulShutdownPlugin` do the same. So middleware that is
present at request time is never traced, while the plugin's own doc comment says it "wraps **all**
middleware and the fetch handler".

| # | Checklist point | Verdict | Evidence |
|---|---|---|---|
| 1 | Small + Vitest | **PASS** | Same suite, same toolchain, `test/tracing.test.ts` already exists. |
| 2 | Public API exists and compiles | **PASS** | `tracingPlugin` exported, `srvx/tracing` declared in `package.json` exports. |
| 3 | Assertion-red on current code | **INFERRED, MEDIUM** | Read from source ordering. Never run. |
| 4 | Genuine bug | **MEDIUM-HIGH RISK** | No issue exists. The doc says "all middleware"; the natural reading is "all YOUR middleware". This is close to arguing with the maintainers. |
| 5 | Contamination | **LOW** | No issue, no PR, no tutorial presence. |
| 6 | **Byte-identical short prompt** | **FAIL** | This is the killer, and it is the Part-1 tension made concrete. Tracing has NO observable other than the channel message. Any honest symptom sentence ("one of our middleware never shows up on the `srvx.middleware` channel") NAMES the collaborator and the message, which hands the model the expect-to-send answer and destroys the fork the cell exists to measure. There is no non-leading phrasing, because there is no non-channel symptom. |
| 7 | Double axis | **PASS in principle** | Correct: subscribe to the channel and assert the message was sent. Wrong: assert the HTTP response, which is byte-identical traced or not, giving a clean `false_green`. |

**Verdict: the right SHAPE, the wrong TARGET.** Its point-6 failure is the generalisable lesson.
Carry it forward to any future in-domain search.

---

## Part 5 -- Contamination assessment for the top candidate (CAND-1 / SRVC)

**Flag: LOW today. MEDIUM-and-rising for any future round. Two vectors, one of which is new.**

**Vector 1 -- recorded and unchanged.** `targets.json` records: not a textbook example, not a kata,
a live maintainer-labelled bug in a package with no tutorial presence. One caveat -- fix PR #200
exists upstream and was CLOSED UNMERGED, so a web-searching model could find the attempt. I
re-verified today that #144 is still open and no fix has merged since, so nothing has moved this
vector.

**Vector 2 -- NOT in the existing note, and I am raising it.** This project's own artifacts now
describe SRVC's correct answer in operational detail -- `e2e-red-srvx/targets.json` spells out the
behaviour gap, the expected red colour, the discipline traps and the exact wrong-double signature,
and `RUN-GATE.md` repeats them. Those files are committed to a PUBLIC repository. Any future model
whose training corpus includes `LayZeeDK/lz-engineering-claude-plugins` has been handed the answer
key. This does not affect the 2026-08 round -- the artifacts are days to weeks old and the round runs
on `claude-opus-4-8` at effort `high` -- but it is a one-way ratchet, and it applies to every cell in
this corpus, not just SRVC.

**How to read a tie.** A correctness tie across the three arms on SRVC is **inconclusive, leaning
pass-at-ceiling**, exactly as RUN-GATE Pitfall 5 says for GRC. The reason is Part 1(a), not
contamination: the baseline `invoke_skill` arm already carries the message-matrix rule inline at
`lz-red/SKILL.md:101-104`, so all three arms have the rule and only the DELIVERY differs. A tie means
the rule was already sufficient, not that the rule is inert. Say that in the write-up before anyone
reads a tie as "the taxonomy adds nothing".

---

## Part 6 -- Wrong-choice signature for the top candidate, spelled out

Target: SRVC, `sendNodeResponse` at pin `55d90b3`. **The `genuinely_red` and `false_green` legs below
are VERIFIED by the maintainer's own recorded measurements in `e2e-red-srvx/targets.json`; I read
those artifacts, I did not re-run them. The `wrong_reason` and `compile_error` legs are INFERRED by
me from `classify()` plus the code in `_sendNodeResponse`. I ran nothing.**

**A. The right answer -- real collaborator, assert the incoming query's return.**
Node's `res` is a collaborator srvx does not own and cannot usefully fabricate. Boot a real
`serve()`, set a cookie from middleware via `req.runtime.node.res.setHeader`, issue a real `fetch`,
and assert on what the CLIENT receives:
`expect(res.headers.getSetCookie()).toEqual(['a=1', 'b=2'])`.

- Runner reports one failed assertion on the added test. `newErrors` is 0 after the prebuild.
- `ASSERTION_RE` matches, `RUNTIME_RE` does not.
- **-> `genuinely_red`, pass: true.** MEASURED: `targets.json` `runner_measured` records exit 1 in
  1458 ms with `AssertionError: expected [ 'b=2' ] to deeply equal [ 'a=1', 'b=2' ]`.

**B. Mock where a real collaborator was right (the direction this target covers).**
Fabricate `const res = { setHeader: vi.fn(), writeHead: vi.fn(), end: vi.fn(), getHeaders: undefined }`,
call `sendNodeResponse(res, new Response(...))`, assert
`expect(res.writeHead).toHaveBeenCalledWith(200, '', expect.arrayContaining(['set-cookie', 'a=1']))`.

- The double never implements the header GETTER, so the optional call short-circuits and the merge
  branch is skipped entirely. The assertion the model wrote describes what the code ALREADY does.
- All added tests PASS. The diff touched no non-test file, so `changedProductionFiles` is empty.
- **-> `false_green`, pass: false.** The `green()` branch at `grade-red.mjs:792-800`.
- This target's extra strength: `mock_has_no_diagnostic_power_note` records that the same double is
  green AFTER a correct fix too -- zero diagnostic power, verified by hand. Per Part 1(d) that
  property does NOT appear in the round's artifacts; it is a reason to trust the target, not an
  output.

**B2. The half-built variant of the same wrong choice.**
If the fabricated double omits any method `_sendNodeResponse` actually calls -- `writeHead`, `end`,
`write`, `on`, `off`, `once` -- the spec throws `TypeError: nodeRes.end is not a function`.

- `RUNTIME_RE` (`grade-red.mjs:89`) matches `is not a function`.
- **-> `wrong_reason`, pass: false.** INFERRED.

**B3. The typed variant.**
srvx's `typecheck.args` are `["--noEmit", "--strict", "--skipLibCheck"]`. A `vi.fn()` object literal
handed to a parameter typed `NodeServerResponse` will not satisfy it without a cast.

- **-> `compile_error`, pass: false**, unless the model writes `as any` / `as unknown as`. INFERRED.
- Useful side effect: `new_tsc_error_lines` records the diagnostics, so an operator can tell this
  apart from a real type error by inspection.

**C. Stub where a mock was right.** **NOT REACHABLE on this target.** There is no outgoing command in
`sendNodeResponse` whose omission the client response cannot see. That is precisely the half SRVC
does not cover and precisely why Option A was opened. Do not claim SRVC covers it.

**Summary of the mechanical separation on CAND-1:**

| Model's double choice | D-06 verdict | pass |
|---|---|---|
| real server + client assertion (correct) | `genuinely_red` | **true** |
| complete fabricated double + expect-to-send | `false_green` | false |
| incomplete fabricated double | `wrong_reason` | false |
| untyped fabricated double | `compile_error` | false |
| stub where a mock was right | not reachable | -- |

Three of the four wrong landings are distinct verdicts, all pass:false. The right answer is the only
pass. **That satisfies the CONTEXT's mechanical-visibility requirement in one direction and cannot
satisfy it in the other.**

---

## Part 7 -- Crux-2 entry cost

### For CAND-1 (the recommendation): ZERO.

`e2e-red-srvx` already declares the byte-identical apply preamble, a prompt naming `test/`, and nine
`prompt_forbidden_tokens`. Crux 2 already loops it in both directions and already proves the poisoned
variant is caught. Nothing to author, nothing to re-canary. This is the strongest single argument for
CAND-1 and it should be the first line the owner reads.

One line worth confirming at plan time, not research time: crux 1/2 iterate the three STANDARD arms
(`no_skill`, `with_skill`, `invoke_skill` -- `selfcheck-red.mjs:280`). Because `invoke_treatment` and
`invoke_forcing` compose IDENTICALLY to `invoke_skill` (`run-e2e.mjs:265`, VERIFIED), the parity and
non-leading proofs carry to them for free -- provided both stay excluded from `--arm all` so crux 6's
pinned dry-run stays byte-identical, exactly as CONTEXT requires.

### If CAND-2 is added anyway, here is its full crux-2 entry cost.

**Cell id:** `SRVA`. Unique against `GRC`, `SRVC`, `RXF`, `RXL` -- required, because
`tabulate-mechanical-red.mjs` fails closed on a duplicate `${target}:${pid}|${arm}` key (`:113`,
`:336`, `:352`). **Prompt id must also differ from `r1`** or the key collides inside the same suite;
use `a1`.

**Draft prompt** (`e2e-red-srvx/prompts/a1-next-test.md`), symptom only, names the pinned `test_dir`:

> An AWS Lambda Function URL request reaches our fetch handler and `request.headers.get("cookie")`
> shows every cookie twice. What's the next failing test you'd write for
> `src/adapters/_aws/utils.ts`? Go ahead and add it under `test/`.

**`prompt_forbidden_tokens`** -- everything that would hand over the mechanism, the call sequence, or
the second affected path:

```json
["awsEventHeaders", "requestToAwsEvent", "event.cookies", "cookies[]",
 "headers.append", "headers.set", "payload 2.0", "payload v2",
 "APIGatewayProxyEventV2", "authoritative", "toLambdaHandler",
 "invokeLambdaHandler", "awsRequest", "skip the cookie key"]
```

**A mechanical trap to design around, VERIFIED from `forbiddenTokensIn`:** the check is a
case-folded SUBSTRING match over the whole composed prompt. So a token that is a substring of the
prompt's own symptom wording self-fails the crux. `event.cookies` is safe; a bare `cookies` is NOT
(the prompt says "cookie"). `headers.set` is safe; a bare `set` is NOT. Keep every token
mechanism-specific and at least two words or dotted.

**Poisoned-variant test, exactly as crux 2 runs it** (`selfcheck-red.mjs:369-379`): the battery takes
`tokens[0]`, flips its letter case, appends it to the composed prompt, and requires
`forbiddenTokensIn` to catch it. With `tokens[0] = "awsEventHeaders"` the flipped form is
`AWSEVENTHEADERS`, and the composed poisoned prompt must come back with `awsEventHeaders` in the
caught list. An empty `prompt_forbidden_tokens` array FAILS the crux by design (`:356-361`), so the
guard cannot be quietly emptied.

**Also required for a new cell in an existing suite:** `test_dir` must be declared on the target
(`"test/"`, matching SRVC so the `runner_select` prefix routes it) and the prompt must contain that
literal string (`:341-350`). And per Condition 2 in Part 2, keep the `runner`, `typecheck` and
`toolchain_paths` blocks DEEP-EQUAL to SRVC's so the existing srvx canaries license the cell.

---

## Part 8 -- Cost estimate per grade

Method per RUN-GATE Step 1: tree size drives it. All figures below are the RUN-GATE's own MEASURED
srvx numbers, not new measurements.

| Component | Cost | Source |
|---|---|---|
| Toolchain copy + remove | 6.89 s + 1.62 s = **8.51 s** | MEASURED 2026-07-26, 12,855 files / 170.8 MB, intra-volume |
| `typecheck.prebuild` (`npm run build`) | **~1.6 s warm** (12.2 s cold, obuild itself 210 ms) | MEASURED, same session |
| Differential typecheck | negligible; baseline is 0 after the prebuild | `targets.json` `typecheck_note` |
| Runner spawn | **1458 ms** | `runner_measured` |
| **Total per grade** | **~11.6 s warm; ~22 s on the first (cold-prebuild) grade** | sum |

I re-checked the tree today: `node_modules` is 185M on disk against the 170.8 MB recorded, so the
copy figure may have drifted up slightly (the recorded number is MB, the `du` is MiB, so most of the
gap is unit, not growth). Treat 8.51 s as a floor.

**Round scaling** (model spend at the RUN-GATE's own straight-line rate of ~$0.545/run, which it
labels a FLOOR):

| Scope | Runs | Grading | Est. model spend | Est. model wall clock, serial |
|---|---|---|---|---|
| CAND-1 only, 3 arms x k=3 | 9 | ~1.8 min | ~$4.90 | ~13 min |
| CAND-1 only, 3 arms x k=5 | 15 | ~3.0 min | ~$8.20 | ~21 min |
| CAND-1 + CAND-2, 3 arms x k=3 | 18 | ~3.5 min | ~$9.80 | ~26 min |
| CAND-1 + CAND-2, 3 arms x k=5 | 30 | ~5.8 min | ~$16.35 | ~43 min |

Grading is a rounding error at this tree size -- the radix cells are what made grading a visible line
item, and neither candidate here touches them. **Choose `k` against model spend and wall clock, not
against grading.**

Two costs NOT in the table: one `npm --prefix <throwaway> install` per round (MEASURED 33 s, 478
packages, exit 0, no `--ignore-scripts` needed), amortised across the whole round; and
`selfcheck-red.mjs` at ~6.5-7 min, which is unchanged if the new cell is deep-equal to SRVC and grows
by roughly 2 x 8.5 s if it is not.

---

## Part 9 -- Package legitimacy

**srvx: SKIPPED as instructed.** Already gated at measurement time and recorded in
`e2e-red-srvx/targets.json`: first publish 2024-09-16, latest 0.12.4 (2026-07-22), 83 versions, MIT,
0 runtime dependencies, not deprecated, repo live and not a fork. Re-confirmed today only that HEAD
is the pinned v0.12.4 release commit, the tree is clean, and the issue tracker is live.

**No NEW repo is proposed, so no new legitimacy gate is owed.** I am deliberately not naming a
candidate package for the "second-order observable" shape in Part 3. Naming one from training data
and then confirming it exists on a registry is exactly the pattern my own instructions classify as
`[ASSUMED]` rather than `[VERIFIED]` -- registry existence does not confer legitimacy, and a
slopsquatted package passes `npm view` too. If the orchestrator wants that search run, it should be
its own task with a web-search budget and the T-21-SC gate applied to whatever comes back.

**No package is installed by this task.** No Package Legitimacy Audit table is owed.

---

## Environment Availability

| Dependency | Required by | Available | Detail |
|---|---|---|---|
| `h3js/srvx` checkout at `55d90b3` | CAND-1, CAND-2, CAND-3 | YES | detached at the pin, tree CLEAN, one worktree entry |
| srvx `node_modules` | grading + prebuild | YES | 185M on disk |
| srvx `dist/` | prebuild self-reference | YES | present (grading rebuilds it inside the worktree anyway) |
| `radix-ng/primitives-pin` | unrelated cells | YES | present, untouched by this task |
| GitHub REST API | issue verification | YES | unauthenticated reads succeeded |
| Any NEW repo | none | n/a | none proposed |

No missing dependency blocks any candidate.

---

## Assumptions Log

| # | Claim | Where | Risk if wrong |
|---|---|---|---|
| A1 | Vitest's failed `toHaveBeenCalledWith` message matches `ASSERTION_RE` and not `RUNTIME_RE`, so a failing mock grades `genuinely_red` | Part 1(b) | If wrong, every correct expect-to-send answer grades `wrong_reason` and the whole Option-A design is unmeasurable. **Cheapest possible check, and it should be run before any spend:** add one throwaway assertion to `grade-red.mjs --selfcheck` feeding a synthetic vitest spy-failure message through `classify()`. Zero cost. |
| A2 | Issue #283 is assertion-red at the existing pin | CAND-2 point 3 | If it is already fixed or not reproducible at `55d90b3`, CAND-2 evaporates. The reporter explicitly states 0.11.16 through 0.12.4 are identical on this path, which is strong but is his claim, not my measurement. |
| A3 | A `vi.fn()` object literal fails srvx's `--strict` typecheck without a cast | Part 6 B3 | Low impact -- it only changes which of two pass:false verdicts the wrong choice lands on. |
| A4 | CAND-3's tracing ordering gap is real at the pin | CAND-3 point 3 | Read from source ordering only. CAND-3 is rank 3 and fails point 6 regardless, so this does not gate anything. |
| A5 | The "second-order observable" target shape exists and is findable in job queues / caches / event buses | Part 3 | This is a design argument, not a measurement. If the shape turns out to be as rare as it was in srvx, the missing half of the matrix may simply not be measurable under crux 2 at any reasonable cost -- which would itself be a finding worth recording. |

---

## Open Questions for the gate

1. **Does the round want to report zero-diagnostic-power at all?** If yes, it needs a second grading
   pass against a fixed tree that the instrument does not have. Scope it or drop the claim. I
   recommend dropping it and citing the hand measurement as a target property.
2. **Is one-direction coverage acceptable for D-12?** CAND-1 answers "does the treatment stop the
   model reaching for a fabricated double". It does not answer "does the treatment teach the model
   when a mock is right". If the owner needs both, the honest budget is a separate target search with
   the Part-3 escape-hatch shape, and it should be scoped as its own task rather than folded into
   this one.
3. **Should CAND-2 ride along?** It costs one prompt file, one `targets.json` entry and ~11.6 s per
   grade, and it is the only cell in the corpus with near-zero contamination. It answers a different
   question than D-12. Owner's call on whether mixing them muddies the write-up.

---

## Sources

**Primary (HIGH -- read this session, in this repo or the pinned checkout):**

- `.claude/skills/lz-red-workspace/grade-red.mjs` -- `classify()` and the eight verdicts, both regexes,
  the attribution helpers
- `.claude/skills/lz-red-workspace/selfcheck-red.mjs` -- crux 1/2, `STATE_CLAIM_TOKENS`,
  `forbiddenTokensIn`, the poisoned-variant rule
- `.claude/skills/lz-red-workspace/tabulate-mechanical-red.mjs` -- the cell key and its fail-closed
  duplicate rule
- `.claude/skills/lz-red-workspace/e2e-red-srvx/{suite.json,targets.json,prompts/r1-next-test.md}`
- `.claude/skills/lz-red-workspace/e2e-red-gilded-rose/{suite.json,RUN-GATE.md}` -- the seven-point
  checklist, the crux inventory, the per-target cost table, the calibration points
- `.claude/skills/lz-refactor-workspace/e2e-nx/run-e2e.mjs` -- arm validation and composition
- `h3js/srvx` @ `55d90b39840a5bb7236e23c4e326ee4fc3842d57` -- source read directly from the git object
  store, never from the working tree

**Secondary (HIGH -- live queries this session):**

- GitHub REST API `repos/h3js/srvx/issues?state=open` and `/issues/283`, queried 2026-08-01

**Nothing was fetched from a blocked domain, and no fallback chain step was needed.**

---

## Metadata

**Confidence breakdown:**

- D-06 gate analysis (Part 1): **HIGH** -- read directly from `classify()`, quoted with line numbers
- Reuse-is-legitimate argument (Part 2): **HIGH** -- rests on the tabulator's own key rule and the
  RXF/RXL precedent, both read
- The crux-2 tension (Part 3): **HIGH** as reasoning, **MEDIUM** as a universal claim -- it is an
  argument from the instrument's constraints, not a measurement
- srvx collaborator audit (Part 3 table): **HIGH** on the inventory (exhaustive `git grep` plus
  reading all seven adapters), **MEDIUM** on each "no live defect" verdict
- CAND-1 scoring: **HIGH** -- six of seven points cite an existing measurement
- CAND-2 scoring: **MEDIUM** -- point 3 is inferred from the issue text
- CAND-3 scoring: **MEDIUM** -- point 3 inferred; point 6 failure is HIGH confidence
- Cost estimates: **HIGH** -- all copied from RUN-GATE's measured table

**Research date:** 2026-08-01
**Valid until:** 2026-08-31 for the gate analysis and cost table; **2026-08-08 for the contamination
and issue-status claims** -- #144 and #283 are both live tickets and either could be fixed at any
time, which would change CAND-1 point 4 and CAND-2 point 3 respectively. Re-query before spending.
