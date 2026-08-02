# Quick Task 260802-j03: Fix six D-12 A/B defects - Research

**Researched:** 2026-08-02
**Domain:** eval-harness correctness (Node ESM scripts, git-driven apply runs, a hand-rolled 8-class
test-verdict classifier)
**Confidence:** HIGH on D1/D2/D4/D5 (everything load-bearing was read or measured this session);
MEDIUM on D3 (prompt determinacy is a judgement call, and I attack my own drafts below)
**Spend:** ZERO. No `claude -p`, no metered command, no install, no clone. Nothing outside this
document was written. `selfcheck-red.mjs` was READ, never run.

---

## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D1** -- Interleave arms by run index. Drive with RUN INDEX outermost and ARM innermost. Record
  the wall-clock start of every run so the interleave is verifiable after the fact.
- **D2** -- Record the per-run pristine assertion. At minimum `git status --porcelain` empty and HEAD
  at the pinned base, persisted alongside the run. Do NOT create a fresh worktree per run.
- **D3** -- Cut the resolving antecedent from each prompt. Must stay a short, natural developer
  request and must still name the pinned `test_dir`. CONSTRAINT: re-check ground truth is still
  DETERMINATE; if a prompt cannot be made ambiguous while keeping determinate ground truth, say so.
- **D4** -- Inline the taxonomy into the treatment tree's `SKILL.md` rather than shipping it as a
  reference bullet. Inlining preserves LEVER SEPARATION (arm 2 purely passive content, arm 3 purely
  the active step). The write-up must say the arm-2 question changed to "does the content help WHEN
  GUARANTEED PRESENT".
- **D5** -- Recognise the deliberate blunt red as a valid RED. MUST NOT WEAKEN THE GATE. Require BOTH
  conditions (throw originates in a file present in `changed_production_files` AND the message has a
  not-implemented shape), keep `RUNTIME_RE` fail-closed for everything else, and prove the
  discrimination with a canary in `grade-red --selfcheck` that a dead-end copy of the pre-change
  logic FAILS.
- **D6** -- k=5. 3 arms x 2 prompts x 5 = 30 runs, budget ~$27.

### Claude's Discretion

- Exact prompt wording after the antecedent cut, subject to D3's determinacy constraint.
- Where the per-run pristine record is persisted (sidecar file vs a field the harness writes).
- Implementation shape of the blunt-red predicate, subject to D5's both-conditions requirement.

### Deferred Ideas (OUT OF SCOPE)

`FUT-TAXONOMY-SHARED` stays OPEN with honest status NOT-YET-TESTED. Nothing in this task ships the
taxonomy into `plugins/`.

---

## Project Constraints (from CLAUDE.md / AGENTS.md)

| Directive | Bearing on this task |
|---|---|
| ASCII only; no emoji, no Unicode dashes/quotes | Applies to every file the planner touches: prompts, `grade-red.mjs` comments, `targets.json` notes. `check-evals.mjs` already gates this over every `e2e-red-*` authored file (`CHECK_EVALS_GREEN` in the prior round). |
| Allowlist-inversion for emails; only `larsbrinknielsen@gmail.com` | Unchanged. `check-evals.mjs` covers it. Never write a forbidden value as a search needle. |
| Never `git add .` / `-A` / `-u`; stage by name | The commit for this task must name each file. NOTE: `run-e2e.mjs:753` uses `git add -A` INSIDE the throwaway target checkout -- that is the harness capturing the model's diff, not the maintainer staging repo work. Leave it alone. |
| No AI attribution in commit messages | Applies. |
| `git grep` first, `rg` for gitignored trees; never `grep` | `out/` is gitignored, so `rg` is required there. |
| Every gate exit-code gated (`test $? -eq 0 && echo TOKEN`) | From CONTEXT specifics. A trailing `echo "EXIT=$?"` always exits 0. |
| GSD: run this through a GSD workflow | Already inside `/gsd-quick 260802-j03`. |

---

## Summary

Six fixes, and they are not six equal-sized things.

**D1, D2 and D6 are near-mechanical**, and two of them are smaller than CONTEXT.md assumes.
`run-e2e.mjs` ALREADY has the interleaved loop (`for k { for prompt { for arm } }`, line 1053-1059) --
what blocked the D-12 round was that `--arm` accepts one arm or the aliases `both`/`all`, and `all`
expands to the three LEGACY arms, not the D-12 trio. I measured the proof: the earlier `r1` round in
the same results tree IS perfectly interleaved by run index, because it used an alias. D2's reset
already exists at `run-e2e.mjs:680-681`; only the RECORD is missing, and I confirmed the assertion
would be non-vacuous and false-positive-free on this target (srvx at the pin: `git status
--porcelain` = 0 lines with `node_modules/` and `dist/` present as ignored artifacts).

**D5 is the risky one and it is tractable** -- more tractable than I expected, because the evidence
needed is richer than the CONTEXT description implies. The two captured blunt reds carry a full
vitest stack in `failureMessages`, and frame 0 of each names `src/correlation-id.ts`, which is
exactly the entry in `changed_production_files`. The contrast case (run-3, a genuine AssertionError)
has frame 0 in the TEST file. So frame 0 separates the two classes cleanly on measured data, with no
worktree plumbing and no absolute-path normalization beyond backslash-to-slash. The two real traps
are elsewhere: the not-implemented phrase must be read from the MESSAGE HEAD only, never from the
runner's code-frame echo of model-authored source (the exact self-certification hole this file
measured on 2026-07-25 and documents at `grade-red.mjs:93-100`); and adding a `blunt_red` class
without also widening `verdictPass()` is a cosmetic fix that leaves the defect fully intact.

**D3 is where the honest answer is mixed.** `a1` survives the cut, but only if the cut is targeted:
dropping the whole clause takes the artifact noun with it and collapses the referent, whereas
dropping only the ABSENCE ASSERTION while keeping the noun leaves ground truth determinate and the
side genuinely open. **`a2` does not survive the cut as specified.** Its resolving clause is the only
thing that introduces a collaborator at all; remove it and "Stub that" has no collaborator referent,
which pushes the natural reading toward the SUBJECT -- the wrong answer -- rather than making the
prompt ambiguous. A softened variant is possible, but `a2` is a saturated precision control (measured
base rate 42/44 EMPTY) and an unambiguous precision control is a perfectly good precision control. My
recommendation is to apply D3 to `a1` and leave `a2` unchanged with the reason recorded.

**Primary recommendation:** apply D1/D2/D4/D6 as locked; implement D5 as a NINTH verdict class
`blunt_red` with a frame-0 + message-head predicate and a five-case discrimination canary; apply D3
to `a1` only and record `a2`'s exemption. Then, BEFORE buying the 30-run round, buy a 3-run
baseline-only pilot of the revised `a1` -- see the Ceiling section, which is the finding with the
biggest effect on whether the round is worth its budget at all.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|---|---|---|---|
| Arm interleave, run indexing | Orchestrator (operator command sequence) | `run-e2e.mjs` arg parser | The loop exists; only arm SELECTION is missing. |
| Per-run wall-clock start | `run-e2e.mjs` `runOne()` | -- | `started` is already computed at :687; only the meta field is missing. |
| Per-run pristine record | `run-e2e.mjs` `runOne()` apply branch | -- | The reset is at :680-681; the record belongs immediately after it, inside the same function. |
| Prompt text | `e2e-red-srvx/prompts/*.md` | `targets.json` notes | Determinacy rationale lives in the target spec, not the prompt. |
| Treatment dose delivery | `treatment/build-treatment.mjs` | `treatment/test-double-taxonomy.md` | Build-time composition; the shipped tree is never mutated. |
| Blunt-red recognition | `grade-red.mjs` `classify()` | `--selfcheck` canary | Pure classifier; must stay pure and must stay testable offline. |
| Pass/fail rollup | `grade-red.mjs` `verdictPass()` | `tabulate-mechanical-red.mjs` | The tabulator reads only `grade.pass` and documents that adding a class needs no change there (`:96-101`). |

---

## Measured baseline: what the 18 prior runs actually show

Reconstructed this session from `results/apply/**/{meta.json,red-grade.json}` plus `meta.json` mtime.
27 rows total; the first 9 are the earlier `r1` round, the last 18 are the D-12 round.

`[VERIFIED: local artifact walk, 2026-08-02]`

| Completion | Arm | Prompt | Verdict | `changed_production_files` |
|---|---|---|---|---|
| 05:13-05:44 | with_skill / no_skill / **invoke_skill, INTERLEAVED by run index** | r1 | 8 genuinely_red, 1 unattributable | 0 in all 9 |
| 22:46-22:57 | invoke_skill | a1 x3, a2 x3 | 6 genuinely_red | a1: **1,1,1** / a2: **0,0,0** |
| 23:00-23:10 | invoke_treatment | a1 x3, a2 x3 | 6 genuinely_red | a1: **1,1,1** / a2: **0,0,0** |
| 23:12-23:26 | invoke_forcing | a1 x3, a2 x3 | 4 genuinely_red, **2 wrong_reason** | a1: **1,1,1** / a2: **0,0,0** |

Four things fall out of this table, and three of them are not in CONTEXT.md.

1. **The time confound is confirmed by measurement, not just asserted.** The three D-12 arms occupy
   three disjoint 10-14 minute blocks.
2. **The harness interleaves natively when the arm list has more than one member.** The `r1` block is
   with_skill, no_skill, invoke_skill, then run-2 of each, then run-3 of each -- which is exactly what
   `for k { for p { for arm } }` produces. `[VERIFIED: run-e2e.mjs:1053-1059 + the mtime ordering]`
   That the `r1` round used the `all` alias is `[INFERRED]` from the arm set matching the alias
   expansion exactly, but the loop behaviour it demonstrates is verified.
3. **THE DISCRIMINATOR WAS AT CEILING, NOT TIED.** `changed_production_files` was correct on 18 of 18
   runs -- non-empty on every `a1`, empty on every `a2`, in all three arms. The prior round's
   predicted headroom for `a1` ("the corpus touches production 2 in 44, and `a1` REQUIRES a
   production touch") was FALSIFIED: the 2-in-44 corpus base rate does not transfer, because `a1`'s
   prompt asks for the production touch outright and every arm delivered it 3/3.
4. **D5 cost exactly 2 runs, both in one arm, both on `a1`.** Under a fixed predicate those become
   passing blunt reds and the forcing arm's `a1` verdict column goes 1/3 -> 3/3 -- but its
   DISCRIMINATOR column was already 3/3. So D5 stops a mis-score; it does not restore the round's
   informativeness. Do not let the D5 fix be mistaken for a fix to the null.

---

## The ceiling problem, and the cheap pilot that de-risks the whole budget

This is the single most consequential finding for the planner, so it goes before the per-defect
sections.

D6's own rationale says it plainly: "with D3 applied the ceiling should drop, which is what makes any
effect observable at all". Measured fact 3 above says the baseline arm scored 3/3 on the
discriminator for both prompts. At k=5 that is 10/10 per arm. **If D3 does not move the `a1` baseline
off saturation, the fixed round reproduces the null at ~1.7x the prior cost**, and every other fix in
this task -- the interleave, the pristine record, the inlined dose, the blunt-red class -- will have
improved a measurement that still cannot measure anything.

The de-risking move costs about a tenth of the round:

- Drive `--arm invoke_skill --prompt a1 --runs 3` against the REVISED `a1` only. Measured cost basis:
  the prior `a1` invoke_skill runs took 146/164/159 s at ~$0.91/run, so ~$2.70 and ~8 minutes.
- Read `changed_production_files` on those 3 grades.
- 3/3 non-empty => the ceiling did not move; the full round is not worth buying and D3 needs another
  pass (or the cell needs retiring). 0-2/3 non-empty => headroom exists; buy the round.

This is a pre-registered decision rule, and it should be written into the plan BEFORE the pilot runs
so the outcome cannot be reinterpreted afterwards. It is also spend, so it needs the same explicit
user approval as the round itself (project memory: eval runs are never self-approved).

---

## D5 -- the blunt-red predicate (highest risk; most of the analysis)

### 5.1 Is the throwing FILE recoverable at grade time?

**Yes, and more cleanly than expected.** Four measured facts settle it.

**(a) `classify()` sees the FULL message; only the persisted artifact is truncated.**
`failureExcerpt()` slices at 500 chars (`grade-red.mjs:1198`) but `classify()` reads
`a.failureMessages` straight off the parsed runner report (`:830`). The two do not share a
truncation. `[VERIFIED: grade-red.mjs:829-833 vs :1188-1199]`

**(b) The report is read from a FILE, not stdout, so there is no `maxBuffer` truncation either.**
AMB1/AMB2's runner template carries `--outputFile "<reportFile>"`, and `gradeRun` detects that
(`:2435`), reads the file (`:2457`) and feeds the text to `parseRunnerReport` (`:2464`).
`[VERIFIED: grade-red.mjs:2424-2470 + targets.json AMB1.runner.vitest]`

**(c) The stack IS in `failureMessages`, and frame 0 is the throw site.** Both captured blunt reds:

```
Error: correlationIdMiddleware is not implemented
    at D:/.lz-red-grade-tmp/red-wt-AMB1-35800-1785626871778/src/correlation-id.ts:10:9
    at D:/.lz-red-grade-tmp/red-wt-AMB1-35800-1785626871778/test/correlation-id.test.ts:15:28
    at file:///D:/.lz-red-grade-tmp/red-wt-AMB1-35800-1785626871778/node_modules/@vitest/runner/...
```

and `changed_production_files: ["src/correlation-id.ts"]`. The diff confirms the throw site:
`+  throw new Error("correlationIdMiddleware is not implemented");` inside that file.
`[VERIFIED: invoke_forcing/a1/run-{1,2}/red-grade.json + run-1/diff.patch]`

**(d) The CONTRAST case separates the classes for free.** run-3 on the same cell is a genuine
AssertionError, and its frame 0 is `test/correlation-id.test.ts:20:54` -- a TEST file.
`[VERIFIED: invoke_forcing/a1/run-3/red-grade.json]`

That is the whole discriminator. An assertion's frame 0 is where `expect()` was called (the spec); a
production throw's frame 0 is the production file. **Condition 1 is therefore not merely satisfiable
-- it is naturally unsatisfiable by an ordinary assertion**, which is exactly the property a gate
wants.

**Do NOT map absolute to repo-relative.** The tempting implementation passes `worktree` into
`classify()` and strips the prefix. Three reasons not to:

- The stack carries THREE path forms in one message: bare Windows-drive with forward slashes
  (`D:/...`), the same inside parentheses for named frames (`at fn (D:/...)`), and an ESM URL
  (`file:///D:/...`). `[VERIFIED: the two excerpts above + run-3's `at processTicksAndRejections
  (node:internal/...)`]` Plus `meta.worktree` is persisted in BACKSLASH form
  (`"D:\\.lz-red-grade-tmp\\red-wt-..."`), and `grade-red.mjs:644` documents that `os.tmpdir()` can
  hand back the 8.3 short form on this machine. Path-form normalization is the exact hazard class
  `resolveArmCwd()`'s docblock (`:721-750`) exists because of.
- `classify()` is a PURE function with a three-argument signature used at 15 call sites, 13 of them
  in the selfcheck. Adding a required parameter touches all of them.
- It is unnecessary. Invert the direction: for each `p` in `changedProductionFiles(diffPatch)`, ask
  whether frame 0 contains `"/" + p + ":"`. `p` is guaranteed forward-slash and relative --
  `assertSafeDiffPaths` REJECTS any diff path containing a backslash (`:420`) or absolute form
  (`:416`). So the only normalization needed is backslash-to-slash on the frame. Against real data:
  `/src/correlation-id.ts:` is present in run-1's frame 0 and absent from run-3's.

**When the stack is truncated or absent.** Truncation upstream of `classify()` does not occur (facts
a and b). If a message carries no `at ` frame at all -- a custom Error with `stack` stripped, or a
runner that reports message-only -- the predicate cannot establish origin and **must fail closed to
`wrong_reason`**. The honest cost: some genuine blunt reds will still be mis-scored. That is the
correct direction and it must be stated in the write-up rather than engineered away.

### 5.2 What should "not-implemented shape" match, and what does it wrongly admit?

**The critical structural point first, because it is the one most likely to be missed.** The two
conditions read DIFFERENT SLICES of the same string:

- Condition 1 reads the STACK FRAMES.
- Condition 2 reads the MESSAGE HEAD ONLY -- everything before the first frame line.

If condition 2 is run over the whole blob, a model can put `// not implemented` in its spec source,
vitest echoes that source in the code frame, and the model self-certifies a blunt red. That is not
hypothetical: `grade-red.mjs:93-100` records the measured 2026-07-25 case where
`it('says no tests found when empty')` alone flipped a `collection_error` into a `no_tests` through
exactly this route.

`stripCodeFrame()` is the existing tool and it is already correct for this. Its split pattern is
`/\n\s{2,}[>\d]/` -- two-or-more spaces followed by `>` or a digit. A stack frame is
`\n    at ...`, where the char after the spaces is `a`. **So `stripCodeFrame` drops the source echo
and KEEPS the frames**, which is precisely what this predicate needs from it.
`[VERIFIED: grade-red.mjs:116-118, pattern traced by hand]`

Draft slicing:

```js
const stripped = stripCodeFrame(m);
const at   = stripped.search(/\n\s+at\s/);
const head = at < 0 ? stripped : stripped.slice(0, at);          // condition 2 reads this
const f0   = at < 0 ? '' : stripped.slice(at + 1).split('\n')[0]; // condition 1 reads this
```

Draft phrase pattern:

```js
const NOT_IMPLEMENTED_RE =
  /\bnot[\s_-]*(?:yet[\s_-]*)?implemented\b|\bunimplemented\b|\bnotimplementederror\b/i;
```

Notes on the draft, including one trap:

- `\bnot` will NOT match inside "cannot" (no word boundary between `can` and `not`). Good.
- The third alternative is REQUIRED, not redundant: in `NotImplementedError` the trailing `\b` of
  alternative one fails because the next char is `E`. Getting this wrong fails CLOSED (missed blunt
  red), not open -- so it is a safe bug, but it is worth pinning in the canary.
- Do NOT add bare `TODO` or `not supported`. `TODO` is far too loose and `not supported` is a
  legitimate runtime rejection rather than a deliberate placeholder.

**Enumerated false-positive routes, and which condition kills each:**

| Route | Realistic? | Killed by |
|---|---|---|
| A test that ASSERTS on a not-implemented message (`expect(fn).toThrow('not implemented')`) | Yes | Never reaches the branch. Such a message matches `ASSERTION_RE`, which is tested FIRST and returns `true` on the existing path. |
| A library throwing its own not-implemented error (jsdom `Not implemented: navigation`, an ORM abstract-method guard, `ERR_METHOD_NOT_IMPLEMENTED`) | Yes -- this is the main one | Condition 1. Frame 0 is inside `node_modules/`, which is not a `changed_production_files` entry. Add an explicit `f0.includes('/node_modules/') -> false` as belt-and-braces. |
| A real `TypeError` whose message contains the phrase (`middleware.notImplemented is not a function`) | Yes | `RUNTIME_RE`, kept as a hard veto evaluated FIRST inside the new predicate. |
| `throw new TypeError('not implemented')` written by the model in its own new file | Yes | Nothing -- and it SHOULD pass. The error class is irrelevant; a deliberate placeholder in a file the model added is a blunt red regardless of constructor. |
| An accidental runtime error in the model's own new file whose message happens to contain the phrase | I cannot construct a realistic one. Node's own runtime TypeErrors ("Cannot read properties of undefined", "x is not a function", "x is not defined") all hit `RUNTIME_RE`. | `RUNTIME_RE` in practice |
| The phrase present only in the runner's code-frame echo of the model's spec | Yes -- and it is the measured hazard class | `stripCodeFrame` + head-only slicing |
| Suffix collision: frame 0 in `packages/other/src/log.ts` while the diff changed `src/log.ts` | Narrow. Needs a monorepo layout AND a not-implemented head AND no RUNTIME_RE token. | Not killed. See below. |

The suffix collision is the only residual. Optional tightening that costs nothing when unavailable:
accept an OPTIONAL fourth argument `{ worktree }`; when present, additionally require the normalized
frame 0 to start with the normalized worktree; when absent, fall back to suffix matching. That keeps
all 15 existing call sites valid and lets the real gate be strictly tighter than the selfcheck. I
judge the residual unreachable in this corpus and would ship without the tightening, but the shape is
cheap if the planner wants it.

### 5.3 Where the predicate must sit

`classify()`'s ordering, verified at `grade-red.mjs:758-836`:

1. `tscResult.newErrors > 0` -> `compile_error`
2. `asserts.length === 0` -> `no_tests` | `collection_error`
3. `failed.length === 0` -> `green()`
4. `attributedFailed.length === 0` -> `green()` | `unattributable`
5. `rightReason ? 'genuinely_red' : 'wrong_reason'`

**Branch 5 only, and additively.** Branches 1-4 must remain unreachable from the new code, which they
are by construction (they all `return`). Two consequences worth stating: a blunt red that also
introduces NEW strict-tsc errors still grades `compile_error` at branch 1 -- correct, a placeholder
must compile -- and a blunt red in a test the diff cannot be attributed to still grades
`unattributable` at branch 4 -- also correct.

**Keep the existing expression byte-identical.** The minimum-diff shape:

```js
const rightReason = attributedFailed.every((a) => {
  const m = (Array.isArray(a.failureMessages) ? a.failureMessages : []).join('\n');

  if (ASSERTION_RE.test(m) && !RUNTIME_RE.test(m)) {
    return true;                                   // UNCHANGED -- 46 archived grades keep their meaning
  }

  return isDeliberateBluntRed(m, diffPatch);       // NEW -- runs only where the old rule said no
});
```

with `isDeliberateBluntRed` opening on `if (RUNTIME_RE.test(m)) { return false; }` so the runtime veto
binds on the new path too. Written this way the change is provably one-directional: no input that
graded `genuinely_red` before can grade anything else now.

`every()` is preserved, so a run with one blunt red AND one genuine TypeError still grades
`wrong_reason`. That is correct and must be canaried.

**A new verdict class serves better than widening `genuinely_red`. Recommend `blunt_red`.**

| | New class `blunt_red` | Widen `genuinely_red` |
|---|---|---|
| Preserves the skill's own distinction | Yes. `SKILL.md:83-89` ranks an AssertionError "the SHARPEST form" and a not-implemented throw "a valid but blunter red". An eval measuring that skill must not erase the distinction its subject teaches. | No -- destroys it |
| Auditable | Yes. You can count exactly how many runs moved. | No |
| Blast radius | `VERDICTS[]`, `whyFor()`, `verdictPass()`, one selfcheck table row + the canary | Smaller |
| Tabulator | **No change.** `tabulate-mechanical-red.mjs:96-101` reads only `grade.pass` and explicitly documents that adding a class needs no change there (it cites the 8th class, `unattributable`, as precedent). `[VERIFIED]` | No change |

**THE TRAP:** `pass === (verdict === 'genuinely_red')` at `:838`. Adding `blunt_red` WITHOUT widening
`verdictPass()` to `verdict === 'genuinely_red' || verdict === 'blunt_red'` is a cosmetic rename that
leaves the forcing arm still scored down for obeying the skill -- the entire defect, untouched, now
wearing a better label. The two edits are one change.

Corollary the write-up must carry: widening `pass` creates a two-regime corpus. The 46 archived
grades were computed under the old rule. Two mitigations, and the cheap one suffices: the number that
actually matters downstream -- the 42/44 EMPTY base rate in `AMB2.ceiling_note` -- is a
`changed_production_files` count, **not** a verdict count, so it is unaffected. Re-grading history is
therefore unnecessary; declaring the regime change is sufficient.

### 5.4 The canary, and the dead-end copy it must beat

The dead-end-copy idiom is already established four times in this file
(`tscLinesPreStatusCorrelation:2595`, `atcDiagnosticsPreGuard:2607`,
`newTscErrorsRawSetDifference:2622`, `classifyPreAttribution:2630`), each with the same contract
comment: "nothing else calls it, and it must never be wired back into the gate." Follow it exactly.

```js
// The rightReason rule as it stood BEFORE blunt-red recognition, reproduced verbatim ...
function classifyPreBluntRed(runnerJson, diffPatch) { /* old expression, verbatim */ }
```

Five cases on IDENTICAL inputs. Case (a) is the discrimination proof; (b)-(e) prove the gate did not
loosen.

| # | Input | New rule | Dead-end copy | Proves |
|---|---|---|---|---|
| **a** | head `Error: correlationIdMiddleware is not implemented`; frame 0 `.../src/correlation-id.ts:10:9`; diff adds `src/correlation-id.ts` + the test | `blunt_red` | `wrong_reason` | **THE DISCRIMINATION.** If these are equal, fail with the existing wording pattern: "the discrimination proof is not exercising the defect it claims to close" (`:2726-2729`). |
| **b** | same diff, message `TypeError: (0 , x.compute) is not a function`, frame 0 in the same production file | `wrong_reason` | `wrong_reason` | `RUNTIME_RE` still vetoes even when condition 1 holds |
| **c** | same not-implemented head, frame 0 `.../node_modules/some-lib/dist/index.js:9:1`, test-only diff | `wrong_reason` | `wrong_reason` | condition 1 binds; a library's own not-implemented throw is not a blunt red |
| **d** | head is something else; the phrase appears ONLY in the runner's code-frame echo of the model's spec; frame 0 in a TEST file | `wrong_reason` | `wrong_reason` | **self-certification is closed** -- the case most likely to be omitted |
| **e** | two attributed failures: one blunt red + one TypeError | `wrong_reason` | `wrong_reason` | `every()` still binds |

Split the implementation the way the file already splits: make **(a) a RUNNABLE fixture** so the real
vitest 4.1.10 message-plus-stack shape stays empirically pinned (the file's whole ethos), and (b)-(e)
**synthetic `runnerJson` payloads** the way the `drove_to_green` proof at `:2682-2699` does --
constructing a real library throw is disproportionate.

Note for the runnable fixture: `gradeFixture` synthesizes a TEST-ONLY diff by default
(`newFileDiff(specFile, ...)` at `:1119`), which makes `changedProductionFiles` empty and condition 1
unsatisfiable. It reads a fixture-supplied `diff.patch` when one exists (`:1116-1119`) -- the
`borrowed` fixture already uses that path. The blunt-red fixture needs its own `diff.patch` naming
`module.ts` as added. Its frame 0 will be `<fixtureDir>/module.ts:N:M`, and the suffix test
`/module.ts:` matches.

Also add the new class to the `runSelfcheck()` table at `:2653-2661` so `blunt_red` is proven the
same way the other eight are.

### 5.5 Can D5 be made safe? Yes -- stated plainly

The honest answer the brief invited is available and it is positive. Every predicate I could design
that reads ONLY the message text is unsafe (a library's own not-implemented throw is
indistinguishable). The predicate that reads frame 0 as well is safe, because frame 0 is
runner-attested rather than model-authored: the model cannot make V8 name a file it did not execute
in. The measured contrast (production throw -> frame 0 in `src/`; assertion -> frame 0 in `test/`)
makes the discrimination empirical rather than argued. The residual costs are two, both in the
fail-closed direction: a stackless message is still mis-scored `wrong_reason`, and a
`NotImplementedError` missed by a `\b` slip is likewise mis-scored. Neither admits a runtime error.

I do not recommend the fallback options the brief offered (leave D5 unfixed, read the discriminator
first). They are viable but strictly worse: the discriminator already reads correctly on those two
runs, and leaving the verdict wrong means the gate keeps penalising the arm for following the skill
under test -- which is a defect in the instrument, not a reporting inconvenience.

---

## D3 -- the antecedent cut

### 3.1 `a1`

**Current text** (`prompts/a1-stub-the-correlation-id.md`, one line, verbatim):

> Every service we run behind this reinvents a correlation id for tracing, and there is no middleware
> for it here yet. Stub it and add the failing test under `test/`.

**The clause the forcing arm's audit named:** `, and there is no middleware for it here yet`.

**Why it resolves.** It establishes the middleware as a MISSING PRODUCTION SYMBOL. Once the reader
knows the symbol does not exist, "Stub it" can only mean "write the placeholder symbol" -- you cannot
coherently make a test-side double of a thing that has no symbol. The absence assertion IS the
resolver.

**The naive cut fails.** Deleting the whole clause gives:

> Every service we run behind this reinvents a correlation id for tracing. Stub it and add the
> failing test under `test/`.

Now "it" has only one antecedent left: "a correlation id" -- a VALUE, not a symbol. "Stub a
correlation id" is close to meaningless. This is REFERENTIAL collapse, and it is the failure mode
D3's constraint warns about: the prompt is no longer ambiguous between the two sides, it is
underdetermined about which ARTIFACT is wanted. Ground truth becomes indeterminate on the wrong axis.

**The targeted cut works.** Keep the artifact noun, drop the absence assertion, by moving the noun
into the imperative:

> **DRAFT a1':** Every service we run behind this reinvents a correlation id for tracing. Stub the
> middleware for it and add the failing test under `test/`.

**Attacking my own draft.**

- *Is ground truth still determinate?* Yes, and all three of the CELL doc's arguments survive
  intact: the middleware is still the SUBJECT (not a collaborator), so axis 2 places it in
  Production/own/transitional with no hedge; a test-side double of the subject is still tautological;
  and the developer still asked for both the symbol and the test.
- *Is it still ambiguous?* Yes, and this is the distinction that makes the cut legitimate. There are
  two different ambiguities in play. REFERENTIAL ambiguity (which thing is meant) destroys
  determinacy. Ambiguity of the WORD "stub" GIVEN a fixed referent -- write a production placeholder
  vs. stand a double up in the spec -- preserves it, because the correct reading is fixed by the
  referent's role. `a1'` has the second and not the first. The wrong reading is still live and is
  already enumerated in `AMB1.plausible_wrong_answers` #2 ("stand the middleware up inside the spec").
- *Doesn't "the" imply it exists?* Mildly, and it is counterfactual at the pin. That is acceptable:
  the model greps, finds nothing (measured: `git grep -in correlation` = 0 hits repo-wide), and must
  then decide. Absence becomes DISCOVERED rather than ASSERTED -- which is the whole point. The
  manipulation check asks whether the PROMPT's wording settles the side; a model resolving it
  correctly by its own investigation is the model being good, which is what the round measures.
- *Residual, stated honestly:* naming "the middleware" still identifies the subject, and subject-hood
  is what makes the correct answer production-side. There is a real tension here -- the words that
  make ground truth determinate are related to the words that hint at the side -- and I do not think
  it can be fully dissolved for this cell. `a1'` reduces the resolution substantially without
  destroying determinacy; it does not eliminate it.

**Crux 2 re-check of `a1'`** (`[VERIFIED]` by hand against `selfcheck-red.mjs:327-379` and
`forbiddenTokensIn:231-237`, which is a case-folded substring test):

| Clause | Result |
|---|---|
| Names `target.test_dir` = `test/` | Yes -- `` under `test/` `` |
| Names none of AMB1's 17 `prompt_forbidden_tokens` | Clean. `src/` absent (only `test/` appears). `ServerMiddleware` needs the contiguous string; "the middleware" does not contain it. `placeholder`, `toBe*`, `vi.*`, `crypto`, `randomUUID`, `x-request-id`, `requestId`, `headers.set`, `log.ts`, `production-side`, `collaborator-side`, `test double` all absent. |
| No test-state claim (13 `STATE_CLAIM_TOKENS`) | None present |
| Short, natural developer request | Yes -- 2 sentences, 24 words |

### 3.2 `a2` -- the cut destroys it. Recommend NOT applying D3 here.

**Current text** (`prompts/a2-stub-the-logger-output.md`, verbatim):

> `src/log.ts` writes nothing at all for a request whose handler throws, so the only requests missing
> from the access log are the ones worth reading. Real stdout is in the way of seeing what it writes.
> Stub that and add the failing test under `test/`.

**The clause the audit named:** `Real stdout is in the way of seeing what it writes.`

**Cutting it:**

> `src/log.ts` writes nothing at all for a request whose handler throws, so the only requests missing
> from the access log are the ones worth reading. Stub that and add the failing test under `test/`.

**This is not ambiguous; it is broken, and it is broken in the WRONG DIRECTION.** The clause is the
only thing in the prompt that introduces a collaborator. Remove it and "Stub that" has these
candidate referents: `src/log.ts`, "the access log", "a request whose handler throws", or the
situation as a whole. The only nameable ARTIFACT among them is `src/log.ts` -- the SUBJECT. So the
natural reading shifts toward stubbing the subject, i.e. toward the production side, which is
`AMB2`'s WRONG answer (`constraint`: "do NOT add a writer/sink option or any other seam"). A prompt
that resolves toward the wrong answer is worse than one that resolves toward the right one.

**A softened variant exists but buys little.** The clause does two jobs: it NAMES stdout (required
for determinacy) and it frames stdout as an OBSTACLE (the resolver -- an obstacle is what you
substitute). Keeping the first and dropping the second:

> **DRAFT a2'':** `src/log.ts` writes nothing at all for a request whose handler throws, so the only
> requests missing from the access log are the ones worth reading. It writes to real stdout. Stub
> that and add the failing test under `test/`.

This does give "that" two live candidates (`src/log.ts` and "real stdout"), and it passes crux 2:
bare `stdout` is deliberately NOT on AMB2's forbidden list (the `prompt_forbidden_tokens_note` says
so explicitly), and "It writes to real stdout." introduces no forbidden substring -- notably not
`stdout.write` (the text reads "writes to real stdout"), not `writer` ("writes" is not "writer"), not
`toBe`, and no `STATE_CLAIM_TOKENS`. `[VERIFIED by hand against the token lists]`

**But I recommend against shipping it, for three measured reasons:**

1. `a2` is a saturated precision control, and D3 cannot change that. Its correct signature is EMPTY,
   and the corpus base rate for EMPTY is 42/44 (`AMB2.ceiling_note`, measured 2026-08-02). The prior
   round scored 9/9 EMPTY. Ambiguity cannot create headroom on a discriminator whose correct side is
   already saturated.
2. `a2`'s job -- catching an arm that OVER-CORRECTS toward production after being handed side
   vocabulary -- does not require the prompt to be ambiguous. It requires the prompt to be answerable
   test-side. An unambiguous precision control is a perfectly good precision control.
3. If "that" does read as `src/log.ts`, a `vi.mock` of the logger module is still test-side and still
   scores EMPTY. So the added ambiguity produces correct-for-the-wrong-reason passes -- noise on the
   discriminator rather than signal.

**Recommendation:** apply D3 to `a1` only. Record in `AMB2` and in the write-up that `a2` was
deliberately exempted, with reason 1 above as the citation. That is a finding, not a skipped fix --
D3's own constraint anticipated exactly this outcome and instructed me to say so.

### 3.3 Target-spec fields the D3 edit invalidates

These carry claims about the prompts and go stale the moment the text changes:

| Field | What breaks |
|---|---|
| `AMB1.prompt_forbidden_tokens_note` | Describes the current prompt as naming "a FEATURE AREA and an ABSENCE". `a1'` no longer asserts the absence. |
| `AMB1.prompt_asymmetry_note` | Still true, still worth keeping. |
| `AMB1.ceiling_note` | Pre-registers the null on structural grounds. Per CONTEXT specifics, must be updated -- and now must ALSO record the measured 3/3 baseline saturation from the prior round. |
| `AMB2.ceiling_note` | Add the measured 9/9 EMPTY from the prior round and the D3 exemption. |
| `AMB1.throw_variant_hazard` | Says a not-implemented throw "grades `wrong_reason` ... This is a real and expected split, not a bug". D5 changes that to `blunt_red` / pass. Must be rewritten or the next reader inherits a contradicted instruction. |
| `suite.json` `d12_cell_note` | Same review. |
| CELL doc hazard 3 ("Throw-variant split on a1") | Same. |

Also worth doing (CONTEXT specifics, item 3): note in the target spec that `isTestFile` is a filename
pattern (`/\.(spec|test)\.[cm]?[jt]sx?$/i`, `grade-red.mjs:130`), so a test helper not named
`*.test.ts` counts as PRODUCTION -- an operator reading a surprising non-empty
`changed_production_files` needs that.

---

## D4 -- inlining the taxonomy

### 4.1 How the treatment delta is produced today

`build-treatment.mjs` is a table-driven two-variant builder. The treatment record (`:104-114`):

```js
{ id: 'treatment', outName: 'lz-tdd-treatment', artifactSrc: ARTIFACT_SRC,
  anchor: CITATION_ANCHOR, position: 'after', lines: CITATION_LINES, marker: CITATION,
  expectedDeltas: ['added references/test-double-taxonomy.md', 'edited skills/lz-red/SKILL.md'] }
```

Mechanics: `cpSync` the shipped tree, copy the artifact to `references/`, find the ONE line containing
`anchor`, splice `lines` after it, then assert (i) exactly one anchor match, (ii) exactly one marker
occurrence, (iii) the delta set equals `expectedDeltas` exactly, (iv) the manifest name is `lz-tdd`,
(v) all three arms' `SKILL.md` differ pairwise.

`CITATION_ANCHOR` is the beck-tdd-by-example bullet, which is `SKILL.md:159` and occurs exactly once
`[VERIFIED: rg -F -c]`. `position: 'after'` puts the 2-line citation at 160-161 in a 167-line file
`[VERIFIED: wc -l]` -- inside the `## Reference material` list, 6 lines from the end. That is the
audit's theory for the zero-retrieval result, and the placement is consistent with it.

### 4.2 Smallest change that inlines

Edit the treatment VARIANT record only; the builder's machinery is untouched.

| Field | From | To |
|---|---|---|
| `artifactSrc` | `ARTIFACT_SRC` | `null` |
| `anchor` | `CITATION_ANCHOR` (`SKILL.md:159`) | `'## Reference material'` -- occurs exactly **1** time `[VERIFIED: git grep -c]` |
| `position` | `'after'` | `'before'` |
| `lines` | 2 citation lines | the taxonomy body read from `treatment/test-double-taxonomy.md` at build time, minus its dev-time header, plus a `## ` section heading |
| `marker` | `CITATION` | `'HARD RULE ON EMPTINESS'` -- occurs **1** time in the artifact and **0** times in the shipped `SKILL.md` `[VERIFIED: rg -c / git grep -c]` |
| `expectedDeltas` | 2 entries | `['edited skills/lz-red/SKILL.md']` |

**Strip the dev-time header.** Lines 1-14 of the artifact are the H1 plus two workspace-meta
paragraphs ("DEV-TIME TREATMENT-ARM CONTENT ... NOT approved for shipping" and the GATING STATUS
note). Those must not enter a `SKILL.md` -- they would tell the model under test it is inside an
experiment. Slice from the `## The three axes` heading onward and prepend one `## ` heading.

**Anchor `before '## Reference material'` is the right placement, for three reasons.** It puts the
content in the MAIN BODY (guaranteed loaded, which is D4's entire purpose) rather than behind a link;
it lands immediately after the numbered procedure and the worked RED example, i.e. right where the
qualify-by-side rule at `:101-104` sets it up; and it needs only ONE anchor, which is all the builder
supports. Inserting at `:104` instead would push the worked example and the coach-don't-drive
paragraph 110 lines down -- strictly worse.

### 4.3 THE GUARD THAT MUST BE RE-KEYED (most likely silent-failure point)

Two lever-separation guards are keyed on `!variant.artifactSrc` as a PROXY for "is this the active
lever":

- `:192-203` -- the `TAXONOMY_TOKENS` smuggle tripwire on the inserted block.
- `:292-298` -- the output-tree no-taxonomy-copy check.

The moment the passive lever stops shipping a file, that proxy inverts. The tripwire would run
against the treatment block -- which is nothing BUT taxonomy tokens -- and the build would fail with
a message about the ACTIVE lever smuggling content.

Good news: it fails LOUD (`process.exit(1)`), not silently. But the fix must re-key both guards on
lever identity (`variant.id === 'forcing'`, or better an explicit `activeLever: true` field), **not**
delete them. Deleting the tripwire would silently un-guard the forcing arm, which is the one thing
`build-treatment.mjs:18-21` says is enforced rather than trusted.

### 4.4 Resulting size, and the crowding-out question answered honestly

`[VERIFIED: wc -l / wc -c]`

| Tree | `SKILL.md` lines | bytes |
|---|---|---|
| baseline (`plugins/lz-tdd`) | 167 | 11,326 |
| forcing (+7 lines) | 174 | ~11,900 |
| **treatment (inlined, header stripped)** | **~279** | **~19,000** |

- **Against the 500-line guidance:** fits, with room. (The project's own tech-stack notes cite
  `< 500 lines` for a `SKILL.md`.)
- **Does it crowd out other content?** Only the `## Reference material` list (23 lines) moves later,
  and that is the least load-bearing part of the file -- it is a link index, not procedure. The
  numbered steps, the worked RED example and the coach-don't-drive paragraph all keep their positions.
  So the displacement cost is low and the delivery guarantee is real.
- **The new confound, which the write-up MUST carry.** The three arms are no longer matched on skill
  length: 167 / ~279 / 174 lines. The treatment arm's body is 67% longer than the baseline's, every
  run. Any measured treatment effect is therefore confounded with length and position. **This is
  unavoidable given the locked decision** -- you cannot both guarantee the dose and hold length
  constant -- so it is a known limitation to declare, not a defect to fix. It also means
  treatment-vs-forcing is not a clean two-lever comparison on length either.

### 4.5 G17 does not fire -- cleared with evidence

The artifact's own header warns it is INCOMPATIBLE with guard G17 (no bare unqualified contested word
under `plugins/`). I checked whether inlining trips the reference battery: G17's walk root is
`path.join(repoRoot, "plugins")` and nothing else `[VERIFIED: check-red-references.mjs:594-618]`. The
generated tree lands in `out/lz-tdd-treatment/`, which is gitignored and outside that root. Guard N3
(no taxonomy copy under `plugins/`) consumes the same walk, so it is equally unaffected. And
`build-treatment.mjs:327` already asserts the source tree was read-only. `BATTERY_GREEN` should be
unaffected -- but re-run it anyway, exit-code gated, since the assertion above is static analysis.

---

## D1, D2, D6 -- mechanical (brief, as instructed)

### D1 -- interleave + wall-clock start

**Two facts change the shape of this fix.**

1. `run-e2e.mjs:1053-1059` is ALREADY `for (k of runs) { for (p of selected) { for (arm of arms) } }`.
   The interleave is native. What blocked it is `parseArgs`: `--arm` takes ONE value, or `both`
   (with_skill, no_skill) or `all` (with_skill, no_skill, invoke_skill) -- there is no alias covering
   the D-12 trio `[VERIFIED: :169-174, :194-196]`. Empirical confirmation: the `r1` block in the same
   results tree is perfectly interleaved by run index.

   So CONTEXT.md's parenthetical -- "an ORCHESTRATION change, not a harness change ... `run-e2e.mjs`
   already drives one arm per invocation" -- is factually off in a way that matters for cost. Both
   paths satisfy the locked DECISION (arms alternate by run index):

   | Path | Cost | Note |
   |---|---|---|
   | Orchestrator loops 30 separate `--run k --arm X` invocations | 30 process launches, a shell loop the operator must get right | Literal reading of D1's rationale |
   | Add a D-12 arm alias (or accept comma-separated `--arm a,b,c`) and drive ONE `--runs 5` | ~2 lines in `parseArgs`, reuses the proven loop | Recommended |

   I flag this as a correction to the rationale, not a challenge to the decision. Planner's call.

2. **`meta.json` has no start timestamp.** Keys verified on a prior run: `elapsed_ms` is present,
   `started_at` is not. So "record the wall-clock start" IS a harness change -- but a one-liner:
   `started` is already computed at `:687`, so add `started_at: new Date(started).toISOString()` to
   the meta object at `:761`. Note the current after-the-fact reconstruction uses `meta.json` mtime,
   which is the run's END, not its start.

### D2 -- the pristine record

The reset is `git reset --hard APPLY_BASE` + `git clean -fd` at `:680-681`, both `mustSucceed`, and it
runs BEFORE the spawn. The record belongs immediately after line 681, inside the same `if (mode ===
'apply')` block, and gets written into the existing `meta` object -- no sidecar needed:

```
pristine: { head: <rev-parse HEAD>, base: <rev-parse APPLY_BASE>, porcelain_lines: <n>, ok: <bool> }
```

**The assertion is non-vacuous and false-positive-free on this target.** `[VERIFIED: read-only check
of the srvx checkout, 2026-08-02]` -- detached HEAD at `55d90b3` (the pin), `git status --porcelain` =
**0 lines**, with `node_modules/` and `dist/` present. So porcelain-empty is a real signal here, not a
tautology, and the ignored artifacts do not pollute it.

Recommend throwing on a non-empty porcelain, consistent with the file's I1 fail-closed idiom
(`:678-681` comment: "abort loudly rather than silently stacking edits across k runs"). Continuing
past an unpristine tree spends money on an uninterpretable run.

**Scope limit the write-up must carry:** `clean -fd` has no `-x`, so ignored content (`node_modules/`,
`dist/`) persists across runs by design and by necessity -- D2 explicitly declines a fresh worktree
per run. The record therefore proves the TRACKED tree was pristine, not that the environment was
fully isolated. That is the honest claim and it is the one to make.

### D6 -- k=5

Pure arithmetic; nothing in the harness resists it (`--runs 5` expands to indices 1..5 at `:174-180`).
Budget check against measured data: the 18 prior runs averaged ~141 s; at the CONTEXT's ~$0.91/run,
30 runs is ~$27 and roughly 70-90 minutes of wall clock, ignoring grading. Grading adds ~2.5 s
toolchain copy + ~3.5 s prebuild + runner per grade on srvx (measured, `AMB1.red_shape_rationale` /
`resolveGradeTmpDir` docblock) -- negligible.

The one caveat is not arithmetic: see the Ceiling section. k=5 only buys observability if D3 moves the
baseline off saturation.

---

## Don't Hand-Roll

| Problem | Do NOT build | Use instead | Why |
|---|---|---|---|
| Recovering the throwing file from a stack | An absolute-to-relative path mapper taking `worktree` | Suffix match of `changedProductionFiles()` entries against frame 0 | Three path forms in one stack, backslash/forward-slash divergence, documented 8.3 short-form hazard. Every normalizer is a place to be silently wrong. |
| Excluding model-authored text from the message | A new "strip the model's source" helper | `stripCodeFrame()` (`:116`) | Already exists, already correct, and verified to KEEP frames while dropping the source echo. |
| Comparing the new rule to the old | An assertion against a remembered verdict | A dead-end copy function | The file's own established idiom, four times over, with a stated never-rewire contract. |
| Interleaving arms | A new driver script | The existing `for k { for p { for arm } }` loop + an arm-list selector | The loop is proven; the r1 round is the evidence. |
| Proving the tree was pristine | A fresh worktree per run | `git status --porcelain` + `rev-parse HEAD` recorded in meta | srvx is ~170 MB plus an install; the reset is not what is in doubt. |
| Guaranteeing the treatment dose | A prompt instruction to open the reference | Inlining into the loaded `SKILL.md` body | Measured zero retrieval over six runs with a passing positive control. |

---

## Common Pitfalls

1. **Adding `blunt_red` without widening `verdictPass()`.** Cosmetic; the defect survives intact.
2. **Running the not-implemented pattern over the whole message.** Reopens the measured
   self-certification hole (`grade-red.mjs:93-100`). Read the head only.
3. **Deleting the `TAXONOMY_TOKENS` tripwire instead of re-keying it** when `artifactSrc` goes away on
   the treatment variant. Deletion silently un-guards the forcing arm.
4. **Cutting the whole antecedent clause from `a1`.** Takes the artifact noun with it; referential
   collapse.
5. **Applying D3 to `a2`.** Resolves toward the WRONG answer rather than making it ambiguous.
6. **Leaving `AMB1.throw_variant_hazard` in place after D5.** It instructs the operator to read a
   `wrong_reason` as a right-side answer; after D5 that verdict no longer occurs for this shape.
7. **Reading `meta.json` mtime as the run's start.** It is the end. Add `started_at`.
8. **A gate whose last line is `echo "EXIT=$?"`.** Always exits 0. Use `test $? -eq 0 && echo TOKEN`.
9. **Treating the D5 fix as a fix to the null.** It corrects 2 of 18 verdicts; the discriminator was
   already at ceiling in all three arms.
10. **`git grep` in `out/`.** Gitignored -- silent zero results. Use `rg`.

---

## Validation Architecture

No JS test framework in this repo; validation is the workspace's own script batteries, each
exit-code gated.

| Gate | Command | Covers |
|---|---|---|
| Classifier | `node grade-red.mjs --selfcheck` | D5. Must gain a `blunt_red` table row + the 5-case canary. Fast, offline, zero spend. |
| Treatment build | `node treatment/build-treatment.mjs` | D4. Its own post-build assertions (anchor count, marker count, delta set, pairwise distinctness) are the gate. |
| Reference battery | `node tools/check-red-references.mjs` | Confirms `BATTERY_GREEN` -- i.e. G17/N3 unaffected by D4. |
| ASCII + email allowlist | `node check-evals.mjs` | Every `e2e-red-*` authored file, including the revised prompt. |
| Full harness | `node selfcheck-red.mjs` | D3 (crux 1+2: prompt composition, parity, `test_dir` pinned, forbidden tokens both directions, no test-state claim) and D1 (`--dry-run` parity across the three arms). ~7 min. **Read, not run, this session.** |
| Dry-run parity | `run-e2e.mjs --dry-run` for 3 arms x 2 prompts x 2 modes | D1's arm-selector change must not perturb the `-p` bytes or the argv arrays. Zero spend. |

**Wave 0 gaps:** the `blunt_red` runnable fixture (`fixtures/blunt/` with `module.ts`,
`module.spec.ts`, and its own `diff.patch`) does not exist and must be created before the canary can
run.

**Sampling:** selfcheck after any `grade-red.mjs` edit; the full battery once before any spend; the
`--dry-run` parity check after the `parseArgs` change.

---

## Security Domain

No network surface, no auth, no user input, no new dependency. The relevant control is unchanged and
must not regress: `diff.patch` is attacker-shaped input (whatever the model under test staged), and
`assertSafeDiffPaths()` (`:405-436`) rejects absolute paths, backslashes and `node_modules`/`.git`/`..`
segments before any worktree exists.

| ASVS | Applies | Control |
|---|---|---|
| V5 Input Validation | yes | `assertSafeDiffPaths` + `assertReadableDiff`, unchanged. D5's predicate consumes `changedProductionFiles(diffPatch)`, which is downstream of both -- so its inputs inherit the guarantees. |
| V2/V3/V4/V6 | no | No auth, session, access control or crypto in scope. |

One threat worth naming because D5 touches it directly: **verdict self-certification** -- the model
under test steering its own grade through text it authored. Measured twice in this file's history
(the `no tests found` comment, 2026-07-25; the borrowed-failure attribution hole, 2026-07-25). D5's
mitigation is that condition 1 reads runner-attested frame data and condition 2 reads only the message
head. Canary case (d) is the regression test for it and must not be dropped.

---

## Package Legitimacy Audit

**Not applicable.** This task installs no external packages. Every change is to existing first-party
`.mjs` scripts, JSON specs and Markdown prompts inside this repo. No `npm install`, no new dependency,
no registry lookup required.

---

## Environment Availability

`[VERIFIED: read-only checks, 2026-08-02]`

| Dependency | Required by | Available | Detail |
|---|---|---|---|
| srvx checkout at the pin | the whole round | Yes | `D:/projects/github/h3js/srvx`, detached HEAD `55d90b3`, `git status --porcelain` = 0 lines |
| srvx `node_modules/` + `dist/` | grading toolchain copy + prebuild | Yes | present as ignored artifacts |
| Prior-round artifacts | D5 evidence, ceiling analysis | Yes | 18 `red-grade.json` + `meta.json` under `e2e-red-srvx/results/apply/` |
| `out/` build target | D4 | gitignored, builder creates it | `build-treatment.mjs` refuses any destination not ending `out/<name>` |
| `claude` CLI | the round only | not probed | Zero-spend constraint; the round needs explicit user approval anyway |

**Missing with no fallback:** none.

---

## Assumptions Log

| # | Claim | Section | Risk if wrong |
|---|---|---|---|
| A1 | The `r1` round used the `all` arm alias | D1 | Low. The interleaved loop is verified from source regardless; the alias is only the likeliest explanation for the observed order. |
| A2 | The full `failureMessages` for the two blunt reds contains more frames than the 500-char excerpt shows | D5.1 | Low, and it does not matter. Frames 0-2 are fully visible in both excerpts and frame 0 is all condition 1 needs. The runner report file is deleted after grading, so the full string is not recoverable now. |
| A3 | Vitest 4.1.10 emits frame 0 as the throw site for a plain `throw new Error()` in an imported module | D5.1 | Low -- observed on 2 of 2 captured runs, with the assertion contrast on a 3rd. Canary case (a) pins it empirically. |
| A4 | ~$0.91/run holds at k=5 with the revised prompts | Ceiling, D6 | Low-moderate. Taken from CONTEXT; the prior a1/a2 runs averaged ~141 s, consistent with it. |
| A5 | Stripping artifact lines 1-14 yields ~112 lines / ~7.7 KB of body | D4.4 | Low -- arithmetic on verified `wc` output; exact figure depends on the heading the planner prepends. |
| A6 | A model resolving `a1'` by grepping (rather than by the prompt's wording) is measuring the right thing | D3.1 | Moderate. This is a judgement about what the cell asks, not a measurement. It is the crux of whether `a1'` is a legitimate fix; worth a second reader. |

---

## Open Questions

1. **Does D3 actually move the `a1` baseline off 3/3?**
   - Known: the discriminator was saturated in all three arms at k=3.
   - Unclear: whether removing the absence assertion is enough.
   - Recommendation: the 3-run, ~$2.70 pilot with a pre-registered decision rule (Ceiling section).
     This is the highest-value open item in the task.

2. **Should the archived corpus be re-graded after `verdictPass` widens?**
   - Known: only 2 of 46 archived grades are affected, both in this round; the 42/44 base rate is a
     `changed_production_files` count and is unaffected.
   - Recommendation: do not re-grade. Declare the two-regime change in the write-up.

3. **`a1'` versus a wording that avoids naming the artifact at all.**
   - Known: dropping the noun collapses the referent (D3.1).
   - Unclear: whether a third phrasing exists that is more ambiguous than `a1'` and still determinate.
   - Recommendation: ship `a1'`; do not spend more design effort before the pilot says the direction
     is even productive.

4. **Empty-diff / treatment-stall runs still have no automatic tally** (CELL open item 4).
   - `grade-red` throws on an empty diff, so a stalled treatment run produces no `red-grade.json`.
     Unchanged by this task. With the dose now guaranteed present, the treatment artifact's
     ask-which-side rule reaches the model on every run, so the stall rate could go UP. Worth a
     per-arm hand count in the write-up.

---

## Sources

### Primary (HIGH -- read or measured this session)

- `.claude/skills/lz-red-workspace/grade-red.mjs` -- `classify()` `:758-836`, `ASSERTION_RE`/`RUNTIME_RE`
  `:84-89`, `stripCodeFrame` `:116-118`, `isTestFile` `:130`, `changedProductionFiles` `:167`,
  `attributedAssertions` `:309`, `assertSafeDiffPaths` `:405-436`, `gradeFixture` `:1086-1151`,
  `failureExcerpt` `:1188-1199`, `gradeRun` report handling `:2424-2476`, dead-end copies `:2595-2646`,
  selfcheck table `:2653-2699`, `verdictPass` `:838`.
- `.claude/skills/lz-red-workspace/selfcheck-red.mjs` -- crux 2 `:296-382`, `forbiddenTokensIn`
  `:231-237`, `STATE_CLAIM_TOKENS` `:250-264`.
- `.claude/skills/lz-red-workspace/tools/check-red-references.mjs` -- G17 walk root `:594-618`.
- `.claude/skills/lz-red-workspace/tabulate-mechanical-red.mjs` -- `:96-101`.
- `.claude/skills/lz-red-workspace/treatment/build-treatment.mjs` -- full read.
- `.claude/skills/lz-red-workspace/treatment/test-double-taxonomy.md` -- full read.
- `.claude/skills/lz-refactor-workspace/e2e-nx/run-e2e.mjs` -- `parseArgs` `:160-212`, `runOne`
  `:626-809`, main loops `:1024-1059`.
- `.claude/skills/lz-red-workspace/e2e-red-srvx/targets.json` -- AMB1 / AMB2 in full.
- `.claude/skills/lz-red-workspace/e2e-red-srvx/prompts/a{1,2}-*.md` -- verbatim.
- `e2e-red-srvx/results/apply/**/{meta.json,red-grade.json,diff.patch}` -- 18 D-12 + 9 r1 runs.
- `plugins/lz-tdd/skills/lz-red/SKILL.md` -- `:80-167`.
- `D:/projects/github/h3js/srvx` -- read-only `git rev-parse` / `git status --porcelain` / `ls`.
- `.planning/quick/260801-w8b-.../260801-w8b-CELL.md`, `260802-j03-CONTEXT.md`.
- `./CLAUDE.md`, `./AGENTS.md`.

### Secondary (MEDIUM)

- Project tech-stack notes in `CLAUDE.md` for the `SKILL.md < 500 lines` guidance (used only for the
  D4 size sanity check).

### Tertiary (LOW)

- None. No web search was performed; this task is entirely local-artifact-bound.

---

## Metadata

**Confidence breakdown:**

- D1 / D2 / D6: HIGH. Every claim traced to a source line or a read-only measurement; the two
  corrections to CONTEXT's rationale are backed by the r1 interleave evidence and the `meta.json` key
  list.
- D4: HIGH on mechanics (anchor and marker uniqueness verified, G17 root verified, sizes measured);
  MEDIUM on the crowding-out judgement, which is an argument about attention, not a measurement.
- D5: HIGH. The discriminator is grounded in three captured runs including a contrast case, and the
  ordering constraints are read from source.
- D3: MEDIUM. Determinacy is a judgement call. The `a2` finding is the most confident part (the
  referential collapse is mechanical); the `a1'` draft is the least (see A6).
- Ceiling analysis: HIGH on the measurement (18/18 discriminator correctness), MEDIUM on the
  inference that D3 may not move it.

**Research date:** 2026-08-02
**Valid until:** until the next round runs or `grade-red.mjs` / `run-e2e.mjs` change. Every line
reference above is pinned to the current working tree.
