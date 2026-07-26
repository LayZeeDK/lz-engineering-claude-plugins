# lz-red APPLY Eval -- RUN-GATE (the gated metered-run presentation)

This file is DOCUMENTATION. It presents the ready-to-run gated metered commands and then STOPS.
Running any command below is out of scope for execute-phase; the metered 3-arm apply run is a
separate, freshly-approved, orchestrator-driven step.

Skill under test: `plugins/lz-tdd/skills/lz-red`. Milestone lz-tdd@0.0.3.

This is the single gated presentation for the WHOLE RED round, across every suite -- it is not
forked per suite. Suites:

| Suite dir | Target | Role |
|-----------|--------|------|
| `.claude/skills/lz-red-workspace/e2e-red-gilded-rose` | `GRC` | HIGH-contamination correctness SMOKE anchor |
| `.claude/skills/lz-red-workspace/e2e-red-srvx` | `SRVC` | LOW-contamination OUT-OF-DOMAIN control |

A third, in-domain discriminator (`ngbracket/ngx-layout`) was built up to the measurement step and
is BLOCKED on a target-selection decision -- see "Blocked third target" in Step 1. Do not treat the
two-suite corpus as final without reading that section: with only one discriminating target, a
correctness tie on GRC still cannot be told apart from pass-at-ceiling.

---

## HALT -- METERED RUN

**METERED RUN -- requires fresh explicit user approval (eval-run-approval-gate). Do NOT run any
command below during execute-phase.**

This is the build-then-halt boundary (D-12). The instrument is BUILT and GREEN offline; every
`claude -p` command in this file spends real tokens and MUST NOT start without fresh explicit
approval per the standing eval-run-approval-gate. No prior approval and no `workflow.auto_advance`
setting carries over -- this gate is blocking-human and never auto-approvable. Until approval, the
phase is BUILD-complete and HALTED.

Offline instrument proof (zero spend -- safe to re-run any time; this is NOT the metered run):

```
node .claude/skills/lz-red-workspace/grade-red.mjs --selfcheck               # all 8 D-06 classes
                                                                             # + RED attribution, incl. its
                                                                             # discrimination vs the pre-fix rule
node .claude/skills/lz-red-workspace/tabulate-mechanical-red.mjs --selfcheck # mechanical + Pass@k/Pass^k
node .claude/skills/lz-red-workspace/merge-judge.mjs --selfcheck             # judge merge + fail-closed verify
node .claude/skills/lz-red-workspace/selfcheck-red.mjs                       # composition/parity/worktree/classifier/nx
                                                                             # + crux 4, the trigger detector (fixtures)
                                                                             # + crux 7, the Step 2 target-toolchain canary
                                                                             # + cruxes 8/9, the write-path containment
node .claude/skills/lz-red-workspace/check-evals.mjs                         # eval-set shape + ASCII/email hygiene
```

`selfcheck-red.mjs` takes **~105-155 s** (MEASURED 2026-07-26 over six runs: 113.5 s and 143.7 s
before the grading-worktree relocation, 107.5 s / 115.4 s / 153.4 s after, and 104.7 s on the
intermediate tree. The ranges OVERLAP COMPLETELY -- the spread is filesystem cache warmth and machine
load, and it swamps anything the relocation changes, so do not read a faster or slower battery as
evidence either way; crux 11 and the crux 7/9 volume assertions are the evidence. It was ~70 s with
GRC alone). Cruxes 7, 9 and 10 each build a real grading worktree, and crux 7 copies a real toolchain
SIX times -- four for GRC and two for srvx. That is the containment's cost, not a hang. **Run it in
the background rather than under a tool timeout** -- the Bash tool's `timeout` is capped at
600000 ms, which the battery would exceed outright if the blocked ngx-layout target were ever added
(its per-grade copy alone is ~11 min). Never narrow the battery to make it finish sooner: a SKIP is
not a pass. See the residual list in Step 2.

---

## Step 1 -- Pre-run confirmation checklist (D-01, target confirmation)

Before any spend, confirm the target corpus with the user at the gate. Two suites are BUILT and
canary-green; a third is blocked on a decision only the user can make.

1. **Anchor is fixed: GRC (Gilded Rose `Conjured`).** Verified genuinely-red (tsc-clean +
   assertion-red on current code). Contamination HIGH -- it is a correctness SMOKE anchor, NOT a
   discriminator. A correctness tie across all three arms on GRC is EXPECTED (read as pass-at-ceiling,
   not "the skill adds nothing"; RESEARCH Pitfall 5). Keeping GRC alone at k=3-5 is a valid first
   round (backup). Its base is ARMED at the gate -- see Step 3a3; this is the only suite that needs
   `E2E_APPLY_BASE`.

2. **SRVC (h3js/srvx `sendNodeResponse`) is BUILT and canary-green -- the out-of-domain control.**
   Pinned at `55d90b39840a5bb7236e23c4e326ee4fc3842d57` (v0.12.4). Scored against the 7-point
   checklist in `e2e-red-srvx/targets.json`; contamination LOW with one caveat (a fix PR exists
   upstream, closed unmerged, so a web-searching model could find the attempt). It stresses
   message-matrix-over-mock on the strongest property measured anywhere in the target search: the
   naive fabricated double is green BEFORE AND AFTER a correct fix, so it has zero diagnostic power
   rather than merely being a false green. What this target grades is the test's DESIGN, which is
   why naming the SYMPTOM in the prompt is not leading it.

   **Read a GRC-vs-SRVC comparison as domain-transfer, not as a discriminator pair.** SRVC is a
   CONTROL: it answers "does any lift survive outside the kata's domain", not "how large is the
   lift". With no in-domain discriminator in the corpus (see below), a tie on both targets remains
   genuinely ambiguous between pass-at-ceiling and inertness.

### Blocked third target -- ngbracket/ngx-layout (needs a decision, do NOT auto-resolve)

The in-domain discriminator was built up to the measurement step and stopped there. MEASURED
2026-07-26 in a detached throwaway at the declared pin
(`daeb01f487b8f354199931489a9199d67d19182d`) with a copied toolchain:

- `npx ng test @ngbracket/ngx-layout --include "flex/layout-align/layout-align.spec.ts"` -- the
  TARGET'S OWN existing spec, not a produced one -- FAILS to collect: `numTotalTests: 0`,
  `suite.status: failed`, message `Missing "./_private-utils" specifier in "@ngbracket/ngx-layout"
  package`. The library self-references by package name, and at the pin
  `projects/libs/flex-layout/package.json` declares an `exports` map holding only `./mq` and
  `./_mq`, so every subpath import fails resolution at run time.
- Swapping in ONE later file, `vitest-base.config.ts`, and changing nothing else makes the same
  worktree at the same pin run: **exit 0, 33 passed**. That file adds `resolve.alias` entries for
  each subpath. So the pin's unrunnability is caused precisely by that commit being absent.
- That commit (`5b16200`) exists ONLY on the fork's own branch
  `LayZeeDK/test/migrate-custom-test-utilities`. `upstream/main` and `origin/main` are both exactly
  the pin, so **no upstream revision of this repo can run `ng test` for this library.**

TARGETS.md records "33 passed" as MEASURED for this target. That measurement is real but was taken
against the fork's branch tip, not against the pin it declares -- which is exactly what the
measure-first step exists to catch.

Two things DID come out of it and are already shipped, so re-attempting this target is cheap:

- the JSON report shape is confirmed Jest-compatible and readable by `classify()`; the correct flag
  is `--output-file` (dash-case), NOT the schema's `outputFile`, which the CLI rejects outright;
- `grade-red`'s `<reportFile>`, `runner_path_base` and `typecheck.args` mechanisms all exist and are
  canary-proven (via SRVC for the first, purely for the other two).

**Resolving it is a target-selection decision (D-01 steer-at-gate), not an executor one.** The two
obvious routes both change what the eval measures:

| Route | What it costs |
|-------|---------------|
| Re-pin the suite to the fork branch tip `5b16200` | Pins the eval to an unpushed, fork-only commit: not reproducible from upstream, and it puts the fork's own in-flight test-infrastructure migration under measurement. |
| Keep the upstream pin and ARM the target's test config (apply the alias commit in the throwaway, like the GRC snapshot arming) | Modifies the target's test infrastructure before the model is measured on it, and the aliases are a non-trivial behavioural change rather than a latent-net arming. |

A third route -- find a DIFFERENT in-domain discriminator -- is also open and may be cheaper than
either. Bring this to the user; do not pick one to keep the corpus at three.

Two properties of that target are worth carrying into whichever route wins, because they are the
reason it was chosen and they are not obvious from the file:

- **A COMMITTED FALSE GREEN, live rather than planted.** `layout-align.spec.ts:240-256` is the only
  `space-evenly` test in the file, it is main-axis, and its single assertion sits inside
  `if (platform.SAFARI)`, which is false under jsdom -- so it executes zero assertions and always
  passes. If this target is ever run, **read a run that "fixes" that test instead of writing the
  missing cross-axis one as a coach-don't-drive signal, not as an instrument artifact.**
- **A free grading axis.** The file's helper `expectElementStyles` collapses to a boolean
  (`expect(allStylesMatch).toBe(expected)`), so a helper-based assertion yields the opaque
  `expected false to be true` while a direct `lookupStyle` yields the diagnostic
  `expected 'stretch' to be 'space-evenly'`. Both are legitimately red; only one is a good test.
  That is a JUDGE dimension, not a D-06 one.

**Cost note if it is ever unblocked, and a CORRECTION to the earlier one.** Copying this checkout's
`node_modules` (1.6 GB, 186,366 files) is the single most expensive thing in the whole instrument.
The 2026-07-25 note recorded **482 s copy + 123 s remove** and blamed the volume boundary -- the copy
went from the D: Dev Drive into `os.tmpdir()` on C:. **That attribution was wrong.** Re-measured
2026-07-26, same tree, same session, one destination straight after the other:

| Destination | Copy | Remove | Total |
|-------------|------|--------|-------|
| `os.tmpdir()` on C: (cross-volume) | 741.5 s | 134.1 s | **875.6 s** |
| `D:\.lz-red-grade-tmp` (intra-volume, what `grade-red` now does) | 531.4 s | 111.3 s | **642.7 s** |

So keeping the copy on the target's own volume is worth about **27%** -- real, but it does not make
this target affordable. Note the intra-volume copy ALONE (531 s) exceeds the whole 482 s figure the
relocation was justified by: the machine was simply faster on 2026-07-25, and **the cost is
dominated by FILE COUNT, not by the volume boundary**. At 3 arms x k=3 that is still ~1.6 hours of
pure copy time instead of ~2.2. Price it before adding it, and see the residual list for why
hardlinking is not a valid shortcut.

Do not read the 27% as a general win either. On the two targets actually in the corpus, measured by
alternating the two destinations three times each so cache warmth is shared, the copy is a tie
within noise and only the remove improves: kata copy 4.06 s -> 3.86 s and remove 1.23 s -> 1.03 s;
srvx copy 6.70 s -> 6.89 s and remove 2.03 s -> 1.62 s.

3. **Confirm or nominate any FURTHER target** against the 7-point qualification
   checklist (steer-at-gate; D-01):
   1. Small + Vitest/Jest + offline-vendorable (its `npm test` runs a single file quickly).
   2. The target public API EXISTS and COMPILES (so the test is tsc-clean, not a compile error).
   3. A specific behavior is wrong/missing so a correct-behavior test FAILS on an ASSERTION (not
      compile, not false green) on CURRENT code.
   4. The gap is a genuine bug or unimplemented feature, NOT a deliberate design choice (else the red
      is arguing with the maintainers).
   5. Low contamination preferred (not a textbook example) -- or contamination flagged so parity is
      read correctly.
   6. A byte-identical short human prompt works (the target is nameable by path without leading the
      answer).
   7. It stresses at least one RED-DISCIPLINE axis (classify-first / assert-observable-behavior /
      message-matrix-over-mock / coach-don't-drive-to-green).
4. **Package-legitimacy gate on ANY newly nominated repo (T-21-SC).** If the user nominates a NEW
   real-OSS repo (not the already-vendored kata), run the package-legitimacy gate on it FIRST --
   confirm it is a real, maintained repo (registry age / downloads / source repo) -- and only then
   `npm install` + vendor it. Do NOT auto-substitute a similarly-named alternative if an install
   fails; surface it to the user. The anchor kata is already vendored + verified, so no install is
   needed for a GRC-only round. srvx was legitimacy-gated at measurement time (first publish
   2024-09-16, 83 versions, MIT, 0 runtime deps, repo live) -- recorded in its `targets.json`.
5. **Decide run scope for spend (D-03):** the built corpus is 2 targets x 3 arms x k=3 = **18 runs**;
   the exact target count and k are tuned here for spend. Report Pass@k AND Pass^k
   (k = 1, 3, 5, total) per target + overall. Scope it against the measured calibration point below
   rather than a guess -- and note that grading is no longer a flat rounding error across targets.

### Calibration -- what the k=1 pilot actually cost (2026-07-25, user-approved)

One `invoke_skill` apply run against GRC, `claude-opus-4-8` at effort `high`, throwaway kata
checkout with its own `npm ci` toolchain:

| Dimension | Measured |
|-----------|----------|
| Cost | **$0.54** (`total_cost_usd`, the CLI's own roll-up) |
| Wall clock | **85 s** (`elapsed_ms` 85,095; `duration_api_ms` 74,831) |
| Turns | **8** |
| Tokens | 11 input / 4,670 output / 154,919 cache-read / 34,983 cache-creation |
| Tools | Read x4, Glob x1, Write x1, PowerShell x1 |
| D-06 verdict | `genuinely_red`, `pass: true` |
| Runner | the target's OWN `vitest@0.28.5` (not the workspace's pinned 4.1.10) |
| Toolchain copy (per grade) | ~3.4 s |
| Kata afterwards | pristine -- clean tree, one worktree entry, `node_modules` intact |
| Exit | 0 |

### Per-grade cost is now PER TARGET, not a flat constant (MEASURED 2026-07-26)

Grading used to be a rounding error. With more than one target that stops being true, so price the
grading column per target rather than multiplying the kata's number.

Since 2026-07-26 `grade-red` creates its throwaway on the **target repo's own volume**
(`<volume root>\.lz-red-grade-tmp`, derived -- never a hardcoded drive), so these are intra-volume
numbers. Override with `$LZ_RED_GRADE_TMPDIR` if that volume is short of room; the grade prints a
loud warning whenever the scratch dir is NOT on the target's volume, and every `red-grade.json`
records the `worktree` it actually used.

| Target | Toolchain copy + remove | Typecheck prebuild | Notes |
|--------|-------------------------|--------------------|-------|
| GRC | 3.86 s + 1.03 s (7,610 files, 142.8 MB) | none | was 4.06 s + 1.23 s under `os.tmpdir()`; the copy is a tie within noise |
| SRVC | 6.89 s + 1.62 s (12,855 files, 170.8 MB) | ~1.6 s warm (`npm run build`; 12.2 s cold, obuild itself 210 ms) | was 6.70 s + 2.03 s; prebuild is TYPECHECK-only, the runner does not need it |
| NGXA (blocked) | **531 s + 111 s** (186,366 files, 1.6 GB) | none | was 742 s + 134 s cross-volume -- still ~11 min per grade; see the corrected cost note in Step 1 |

Straight-line scaling for the fan-out (model spend is dominated by the turn, not by grading):

| Scope | Runs | Est. spend | Est. wall clock (serial) | Grading overhead |
|-------|------|-----------|--------------------------|------------------|
| GRC only x 3 arms x k=3 | 9 | ~$4.90 | ~13 min | ~45 s |
| GRC + SRVC x 3 arms x k=3 (**the built corpus**) | 18 | ~$9.80 | ~26 min | ~2.5 min |
| GRC + SRVC x 3 arms x k=5 | 30 | ~$16.30 | ~43 min | ~4 min |
| + NGXA, if ever unblocked | +9 | +~$4.90 | +~13 min | **+~1.6 h** |

Treat these as a FLOOR. The pilot was a single forced run that went straight to a correct answer in
8 turns; a `no_skill` run that thrashes, or a target with a slower suite, costs more. The two
defects it exposed (a trigger detector blind to slash-command invocation, and an anti-RED apply
preamble) are fixed.

A second, `with_skill` pilot followed (2026-07-25, also user-approved: $0.51, 78 s, 10 turns, exit
0, `genuinely_red`). Its verdict was correct, but it exposed a third defect the forced pilot could
not: the model APPENDED its test to the kata's existing `test/vitest/gilded-rose.spec.ts` rather
than creating a file, so the recorded `failure_excerpt` was that spec's pre-existing `should foo`
placeholder rather than the model's own test. The gate had only asked "does the file have a failing
assertion", so a produced test that PASSED would have graded `genuinely_red` / `pass: true` on the
borrowed failure -- arm-independent, and it would have inflated every arm's Pass@k equally while
hollowing out the eval's only hard correctness gate. That is fixed too (RED attribution; see the
residual list in Step 2), so the next round measures what it claims to.

---

## Step 2 -- REQUIRED zero-spend canary before the full fan-out

**This canary is a REQUIRED gate step; run it BEFORE committing to the full k=3 x 2-target spend.
It costs NOTHING, so there is no reason to skip it.**

```
node .claude/skills/lz-red-workspace/selfcheck-red.mjs      # run in the BACKGROUND; 96-116 s
```

The battery now covers **SIX fabricated runDirs across two suites** -- four GRC and two srvx -- and
it runs for one and a half to two minutes rather than the old ~70 s, dominated by the six toolchain
copies. Run
it in the background rather than under a tool timeout, and remember that **a SKIP is not a pass**:
it means the borrowed repo or its `node_modules` was not on disk and that direction went unmeasured.

Beyond the four GRC fixtures described below, the two srvx fixtures cover mechanisms the kata's
structurally cannot reach, because the kata declares neither:

- `fixtures/canary-srvc-red/` proves the `<reportFile>` report source AND the `typecheck.prebuild`.
  Its spec imports the package's PUBLIC entry point on purpose: MEASURED, without the prebuild that
  import adds 2 NEW differential errors and the canary would grade a false `compile_error`; with it
  the baseline is 0 and the same spec adds 0. It is also the only step proving that a FILE-sourced
  report still carries a `title` the gate can attribute -- if it did not, every real srvx run would
  grade `unattributable` and read as a model failure.
- `fixtures/canary-srvc-compile/` is that target's NEGATIVE control (4 NEW tsc errors). It is not
  redundant with the GRC one: srvx sets its own `typecheck.args`, so the GRC canary does not
  exercise them.

The srvx red canary additionally asserts that its recorded `apply_base` equals its OWN pin. That is
the leak check for Step 3a3's `E2E_APPLY_BASE`: the GRC canaries run with that variable set, and if
it survived past them this grade would silently run against the kata's base instead. Verified to
discriminate -- with the leak simulated, the grade still returned `genuinely_red` and `apply_base`
was the only field that differed.

Crux 10 is new and needs no toolchain at all. It asserts, in both directions, that `gradeRun`
REFUSES a `requireExplicitApplyBase` suite when `E2E_APPLY_BASE` is unset (naming the variable), and
that `arm-anchor.mjs --verify` FAILS on an unarmed throwaway and PASSES on an armed one while
leaving the kata clean, with one worktree and no `red-*` branch.

Crux 2 now loops EVERY suite, every prompt and both modes. It also checks each prompt against its
target's own `prompt_forbidden_tokens` in BOTH directions: the real composed prompt must name none,
and the same prompt poisoned with one of those tokens in a different letter case must be caught. A
target that declares an empty list FAILS the crux, so the guard cannot be quietly emptied. It
further asserts every RED suite declares byte-identical apply preamble bytes -- two suites measured
under different instructions are not comparable.

Crux 7 inside that battery grades a FABRICATED runDir -- a committed `meta.json` + `diff.patch`
under `fixtures/canary-rundir/`, the same two files a real capture contributes -- end to end against
the kata's OWN toolchain, and asserts:

- the gate produced a VERDICT rather than throwing;
- the verdict is `genuinely_red` with `pass: true`, and zero NEW differential tsc errors;
- the recorded `runner` is the one the produced test's directory routes to;
- the recorded `runner_version` is a REAL version, not the `unknown` sentinel -- which is only
  readable from a `node_modules` the grading worktree can actually see;
- the borrowed kata still has its `node_modules`, is git-clean, and leaked no grading worktree.

- the failing assertion is ATTRIBUTED to the test the diff ADDED (`added_test_titles` carries the
  fixture's own `it()` title, `attributed_failures` is 1, and `failure_excerpt` names that test) --
  the only step that proves the target's real runner reports a title the gate can tie back to the
  diff, rather than one that would make every real run `unattributable`.

Three more fixtures cover the other directions. `fixtures/canary-nocollect/` puts the produced spec
outside every collection root and asserts the gate returns `no_tests` rather than throwing.
`fixtures/canary-compile/` is the NEGATIVE control: a spec with one deliberate type error, asserted
to grade `compile_error` with `new_tsc_errors > 0`. Without it nothing in the whole battery would
notice the differential typecheck silently ceasing to discriminate, which is the exact defect that
made a produced test with blatant type errors grade as tsc-clean.

`fixtures/canary-borrowed/` is the ATTRIBUTION anti-regression, and it is the one shape the other
three structurally cannot see: all of them write a BRAND-NEW spec file, where "the file has a
failing assertion" and "the test the model added failed" happen to coincide. This one APPENDS a
test that PASSES to the kata's own `test/vitest/gilded-rose.spec.ts`, which ships a permanently
failing `should foo` placeholder asserting `'fixme'` -- the exact shape of the k=1 `with_skill`
pilot. It is asserted to grade `false_green` / `pass: false`, with `attributed_failures` 0 and a
`failure_excerpt` that SAYS the failure it quotes is `PRE-EXISTING`. Before attribution the gate
answered the file-level question, recorded the placeholder's `expected 'foo' to be 'fixme'` as the
produced test's failure, and returned `genuinely_red` / `pass: true`.

Crux 4 no longer SKIPs either. It used to need a real transcript, which is gitignored, so the
trigger detector was never exercised offline -- and that is how the pilot's blind spot survived the
whole battery. It now runs off two committed, hand-authored fixtures under `fixtures/transcripts/`
(a slash-command shape with no `Skill` tool_use, and a genuine model-choice `Skill` call) and
asserts the detector agrees on availability while differing on model-fired.

Crux 8 is pure and offline and never SKIPs: it pins the steering and write exploits measured on
2026-07-25 as blocked -- a captured diff cannot name a path into the borrowed repo, the no-tests
signal is taken from the runner's own anchored status line rather than from the produced spec's
text, and the config-abort guard ignores ordinary source diagnostics.

Crux 9 covers the direction crux 8 cannot see. Crux 8 is about what a captured diff DECLARES;
crux 9 is about what the produced spec DOES once the runner executes it. It grades the measured
exploit shape for real -- a spec declaring a perfectly legitimate `test/vitest/*.spec.ts` whose BODY
deletes and overwrites through `node_modules/` -- against a THROWAWAY stand-in repo built under the
temp dir, and asserts that tree is byte-intact afterwards. The kata is never the probe target: a
check that can only discriminate by damaging a borrowed repo is not a check worth having.

If crux 7 prints SKIP, the kata or its `node_modules` is not on disk. Fix that first
(`npm ci` in the kata's own `TypeScript/`, which HAS an untracked lockfile on disk -- unlike a
fresh worktree checkout; see Step 3a2) -- a SKIP here is NOT a pass, and the fan-out would grade
against a toolchain that is not there. If crux 9 prints SKIP, run `npm ci` in
`.claude/skills/lz-red-workspace` (its stand-in repo borrows the workspace's own runner). Same
rule: a SKIP is not a pass, it just means the write path went unmeasured this time.

**Why this replaced the old metered canary.** Step 2 used to require capturing ONE real metered run
and grading it, framing the residual risk narrowly as "runner-JSON shape drift". Two things were
wrong with that. First, the shape risk it existed to de-risk was closed offline on 2026-07-25: both
of the kata's runners were measured against the real repo and BOTH emit the Jest-compatible report
shape `classify()` reads (jest 29 `--json`: 4455 bytes, `numFailedTests` 1; vitest 0.28
`--reporter=json`: 1016 bytes, `assertionResults[0].status` `failed`). Second, and more important, a
shape-only check could not see the two defects that were actually present -- a grading worktree with
no toolchain at all, and a runner selected by substring-matching a PROSE field so that it could not
collect the produced test. A fabricated runDir catches both and costs nothing. The old
"add a `jest` devDependency to the workspace" alternative is moot: the kata already ships jest 29,
and the canary uses the target's toolchain rather than the workspace's.

**Residual risk after this canary (the honest list, not just reporter shape):**

- The canary drives FOUR fabricated diffs, not every possible one. They prove the gate mechanism
  -- that it sees the target toolchain, routes to a runner that collects the spec, still tells a
  clean spec from a type-broken one, attributes a failure to the test the diff added rather than to
  one that was already in the file, and returns a verdict rather than crashing when nothing is
  collected. They do not prove every model-produced diff applies cleanly; a malformed capture still
  fails closed at `git apply`.
- **What RED ATTRIBUTION does and does not cover** (added 2026-07-25, after the k=1 `with_skill`
  pilot). `genuinely_red` now requires at least one failing assertion belonging to a test the
  produced diff ADDED, matched by extracting `it()` / `test()` titles from the diff's `+` lines and
  comparing them to the runner's reported `assertionResults[].title`. What it CLOSES: a produced
  test that PASSES can no longer inherit a pass from a failure that was already in the file --
  exactly the shape the pilot produced, and the shape a `false_green` verdict exists to catch. What
  it does NOT cover, and how each failure direction lands:
  - **Attribution is by TITLE, not by hunk position.** A diff that only edits an EXISTING test's
    body -- tightening an assertion rather than adding a test -- declares no new title and grades
    `unattributable`, never a pass. That is deliberate (fail closed), but it means an operator
    reading `unattributable` must check whether the model tightened an existing test rather than
    writing one. **Read an `unattributable` cluster as a possible instrument artifact and inspect
    `added_test_titles` in the `red-grade.json` before attributing anything to an arm.**
  - **A DYNAMIC title cannot be extracted.** `it(caseName, ...)` and a `.each` table spanning
    several source lines both leave the gate with no literal to match, so the run grades
    `unattributable` rather than passing on an unverified attribution.
  - **Parameterized titles ARE handled.** A `.each` or template-literal title is reported by the
    runner in SUBSTITUTED form (`'adds %i and %i'` arrives as `'adds 1 and 2'`), so each
    placeholder becomes a wildcard while every literal part still has to match, anchored. A title
    that is ALL placeholder (`'%s'`) is refused outright: it would match every test in the file,
    including a pre-existing failing one.
  - **A duplicated title is ambiguous, and is dropped.** If the diff also shows the same title on
    its pre-existing side (a context or removed line), that title attributes nothing -- a moved or
    duplicated test cannot be told from the one that was already there.
  - **Attribution says nothing about test QUALITY.** It answers "did the model's own test fail?",
    not "was it the right next test" or "does it assert observable behavior". Those stay judge /
    oracle-reviewer dimensions in EVAL-RESULTS.md, exactly as before.
  - **A pre-existing failure is excluded from the wrong-reason check too.** A broken placeholder
    already in the file can no longer turn the model's genuine assertion failure into
    `wrong_reason`; only the ADDED tests' failure messages are inspected.
- A captured diff that touches `node_modules`, escapes the worktree, or writes into `.git` is
  REJECTED outright before the grading worktree is built, so such a run gets no verdict at all
  rather than a wrong one. **Read a rejected-capture error as an instrument or a model-behaviour
  finding worth inspecting by hand, not as a verdict.**
- **Grading EXECUTES the produced spec, and the borrowed kata is not in reach of it.** This is the
  one residual the earlier version of this list did not name at all, and it is worth stating
  plainly because a reader would otherwise conclude the path-rejection bullet above covered
  everything. It does not: that check scans the paths a diff DECLARES, never hunk CONTENT, so a
  spec declaring a legitimate `test/vitest/*.spec.ts` whose body calls
  `fs.rmSync('node_modules/typescript', { recursive: true })` is accepted -- and grading then runs
  it. What contains it is structural rather than a scan: since 2026-07-25 the grading worktree's
  `node_modules` is a per-grade DISPOSABLE COPY, not a junction into the kata, so those writes land
  on a throwaway that teardown deletes. Measured against a stand-in repo: junction -> the sentinel
  file read "PWNED" and a package was deleted; copy -> both byte-intact. `selfcheck-red` crux 9
  re-runs that exact shape every time the battery runs.
- **Still open, and NOT closed by the copy: a produced spec can write to an ABSOLUTE path.** The
  runner executes arbitrary model-authored code, so nothing in-process can stop
  `fs.writeFileSync('D:/.../GildedRose-Refactoring-Kata/...', ...)`; containing that needs a
  sandbox, which this instrument does not have. It is far less likely than the junction case was
  -- the junction made an ordinary RELATIVE `node_modules/` path reach the kata, which a spec might
  hit by accident, whereas an absolute path has to be typed on purpose -- but it is not zero.
  **Check the kata after each metered round** (`git status --porcelain` clean, exactly one
  worktree, `TypeScript/node_modules` intact) rather than assuming it.
- **Operator-visible cost of the containment:** the copy adds about 3.5 s per graded run on this
  machine (measured: 2.5-2.8 s to copy the kata's 7610-file / 142.8 MB tree, ~0.7 s to remove it),
  so roughly 30 s across a 9-run fan-out, and about 13 s to a `selfcheck-red` run. Each grade holds
  one ~143 MB copy under the temp dir while it runs; grades are sequential, so that is the peak,
  not the total. Every `red-grade.json` records the real figure as `toolchain_ms` and the CLI
  prints it, so if a round feels slow the number is already in the artifacts. There is deliberately
  no shared cache: it would save the 30 s but hand every grade a mutable tree to write through, and
  one poisoned compiler would silently be measured against for the rest of the round.
- The produced test's directory is now PINNED in the prompt (`test/vitest/`, byte-identical across
  arms) and asserted against `targets.json`, which closes the directory lottery: a spec outside
  every collection root would grade `no_tests` for a folder choice that says nothing about RED
  quality. The residual is a model that ignores the pin. **Read a cluster of `no_tests` OR
  `collection_error` verdicts as a possible instrument artifact and inspect where the specs
  actually landed before attributing anything to an arm.** The pinned directory accepts both jest
  and vitest idiom (vitest globals are on), so idiom alone no longer produces a `collection_error`.
- A produced spec using an es2021-or-later method DOES manufacture a NEW differential error under
  the current tsc args and grades `compile_error` -- measured, `String.replaceAll` yields one new
  TS2550. That verdict is HONEST (the test genuinely does not compile under the target's own pinned
  TypeScript 4.9.5, which is what D-06 clause 1 is for), but the class exists, so an operator
  reading a `compile_error` cluster should check whether it is modern-syntax rather than a real type
  error. Pinning `--lib` was considered and REJECTED: it couples a target-agnostic gate to one
  compiler's accepted lib list, and a value the target's tsc rejects becomes an identical error in
  both differential runs -- the vacuous differential the config-abort guard now catches.
- If a NEW target is nominated at Step 1, write its `suite.json` `repo` in the SAME path form git
  reports for that checkout (`git -C <repo> rev-parse --show-toplevel`). A form mismatch -- an 8.3
  short Windows path against git's long one is the measured case -- used to make the grade resolve
  its working directory back onto the target checkout itself, putting the apply, the runner spawn
  and teardown's recursive delete inside the borrowed repo. `grade-red` now refuses that outright
  before it creates anything, so the failure is a clear error rather than damage; the fix is to
  paste git's own path. **Take it from git with BOTH flags** --
  `git --git-dir=<repo>/.git --work-tree=<repo> rev-parse --show-toplevel`. `--work-tree` is not
  redundant: with `--git-dir` alone git resolves the work tree from the CURRENT directory, so the
  command returns whatever repo you happen to be standing in. Reproduced -- from this project root
  it returns this project, and from a temp dir it returns the temp dir, either of which would put
  the WRONG path in the foundational `repo` field.
- **The path-form guards no longer get a free hazard from the environment, and their coverage was
  made explicit before that changed.** `os.tmpdir()` hands back the 8.3 SHORT Windows form on this
  machine, and while the grading worktree lived there, `resolveArmCwd()`'s form check and
  `arm-anchor.mjs`'s realpath identity were partly exercised BY ACCIDENT. The worktree has moved, so
  both are now driven by SYNTHETIC input in crux 9: an explicit `C:\Users\LONGUS~1\...` against
  `C:\Users\LongUserName\...`, and a junction whose target is the same directory under a different
  string. Both were checked to DISCRIMINATE on identical inputs -- unguarded, the short-form pair
  resolves the grade cwd to `C:\Users\LARSGY~1\AppData\Local\LONGUS~1\repo\TypeScript`, outside the
  worktree entirely; and the pre-realpath string rule answers `false` where the realpath rule
  answers `true`. **Do not "simplify" either guard back to a string comparison**, and do not assume
  a path-form bug would still surface on its own from a temp path.
- **`grade-red` creates its worktree at `<target volume root>\.lz-red-grade-tmp`.** That parent
  directory is created on demand and left in place (empty) between runs; only the `red-wt-*`
  worktrees inside it are per-grade. An interrupted fan-out strands one of those, so if a battery or
  a round is killed, check BOTH that directory and `os.tmpdir()` -- selfcheck-red scans both, and a
  stranded ngx-layout-sized worktree is ~1.6 GB.
- **Per-target grading cost is no longer flat, and one target's is enormous.** GRC ~3.9 s, SRVC
  ~6.9 s plus a ~1.6 s prebuild, and the blocked ngx-layout target ~531 s to copy plus ~111 s to
  remove -- about 11 minutes per grade, and a peak scratch-disk footprint of ~1.6 GB held for the
  duration of each grade. **Hardlinking is NOT a valid shortcut**: shared inodes mean an in-place
  write from the model's runner corrupts the SOURCE, which is exactly the hole the per-grade copy
  was made to close (crux 9 reproduces that shape every run).
- **Keeping the copy on the target's own volume was tried and is only worth ~27% on the big tree.**
  This was the follow-up the previous residual list proposed, and the measurement did not support
  its premise: the 482 s figure was NOT mostly a cross-volume penalty (see the corrected cost note
  in Step 1). `grade-red` derives the scratch dir per target anyway -- the durable value is that the
  location is derived, overridable via `$LZ_RED_GRADE_TMPDIR` and loud when it cannot be honoured,
  not that it is fast. **A block-cloning copy remains genuinely unexplored**: ReFS supports
  copy-on-write clones and Node's `fs.cpSync` does not use them, so a `FSCTL_DUPLICATE_EXTENTS`
  path could plausibly collapse the copy to near-zero on the Dev Drive. Out of scope here and
  unmeasured. Note the Dev Drive has LESS headroom than the profile volume here (29 GB vs 86 GB
  free), which is the case `$LZ_RED_GRADE_TMPDIR` exists for.
- **The srvx prebuild runs the TARGET's own build script inside the grading worktree.** That is
  third-party code this gate does not own, executed once per grade. It is contained the same way
  the runner spawn is: inside the throwaway worktree, against the disposable toolchain COPY, never
  the pristine checkout. Same containment, same residual -- an absolute path is still reachable
  (see the bullet above about `fs.writeFileSync` to an absolute path).
- **The `<reportFile>` path is now part of the fail-closed contract.** When a runner command carries
  the placeholder, grade-red allocates a temp path under `os.tmpdir()` -- which stays there
  deliberately: it is ONE small file rather than a tree, so the volume it lands on is irrelevant,
  and `os.tmpdir()` is the location most certain to be writable for a path handed to a third-party
  runner -- reads the report from that FILE, and feeds it to the SAME `parseRunnerReport` spread
  over the real spawn result, so `status`, `stderr` and `error` still decide the no-collect and
  infrastructure-failure branches. A MISSING report file is treated exactly as an empty stdout,
  which is what a runner that collected nothing produces. The temp file is removed in a `finally`.
  **One direction is measured for bare vitest/jest but NOT for a wrapped runner:** the GRC
  `canary-nocollect` fixture proves the no-collect branch for a stdout-reporting runner, and there
  is no equivalent fixture for a `<reportFile>` runner, because the srvx suite has no
  outside-every-collection-root case. If a future wrapped runner puts its no-collect status line on
  STDOUT (which the override discards) rather than stderr, that branch would throw instead of
  grading `no_tests`. **Read a thrown grade on a report-file runner as a possible instrument
  artifact and inspect where the spec landed** -- and do NOT loosen `parseRunnerReport` to make it
  pass; that contract is load-bearing for every suite.
- **What arming does NOT fix** (Step 3a3): the kata's `test/vitest/gilded-rose.spec.ts` ships a
  permanently failing placeholder, so a run can still "answer" by tightening that existing test
  rather than adding one. That grades `unattributable` and needs hand inspection. Arming narrows the
  characterize-first branch only.
- Contamination on GRC is HIGH, so a correctness tie across arms is expected (Step 1). SRVC is a
  CONTROL, not a discriminator, so a tie there does not settle the question either -- with the
  in-domain discriminator blocked, the corpus cannot currently distinguish pass-at-ceiling from
  inertness. Say so in the writeup rather than reading a two-target tie as a result.

**Optional extra (metered, NOT required):** once the fan-out is approved and the first real runs are
captured, grading one of them is a free sanity read on real model output --
`node .claude/skills/lz-red-workspace/grade-red.mjs --run <runDir> --suite <this suite dir>`. It is
no longer a gate step, because the fabricated canary already covers everything it would have.

Only after the zero-spend canary passes does the full fan-out below proceed.

---

## Step 3 -- First-round metered command (3 own-skill arms; GATED)

The first round runs the THREE own-skill arms (D-04): `no_skill` (no plugin), `with_skill`
(`--plugin-dir plugins/lz-tdd` + natural prompt -- genuine description auto-trigger), and
`invoke_skill` (natural prompt force-prefixed with `/lz-tdd:lz-red ` -- the forced CONTENT control:
the skill's content is guaranteed present, so this arm isolates content lift from trigger lift).
`--arm all` composes exactly these three.

Isolation (baked into the suite / reused driver): `--strict-mcp-config` + `--setting-sources project`
(drop MCP servers and the user's global plugins); model `claude-opus-4-8` at effort `high`; arms x
prompts x runs run SERIALLY; one suite dir per target repo, driven sequentially.

Drive ONE suite at a time, sequentially. The apply harness refuses to run on a protected branch
(`main` / `master` per `suite.json`), so each suite first needs a THROWAWAY checkout -- NEVER run
apply against a pristine tree.

**Use `--detach` for EVERY throwaway.** A named branch on a borrowed repo is out of bounds; it was
correctly refused by the permission classifier earlier, and the arming commit in 3a3 must not be
reachable once the worktree is gone.

### 3a -- GRC (Gilded Rose): throwaway, toolchain, ARM, drive

```
# a) throwaway kata checkout (never the pristine main tree). --detach, never -b:
git --git-dir="<kata>/.git" worktree add --detach <throwaway kata checkout> main

# a2) GIVE THAT CHECKOUT A TOOLCHAIN -- see the note below; do NOT skip this.
#     `npm ci` ALONE CANNOT WORK HERE: TypeScript/.gitignore lists package-lock.json, so no
#     lockfile is tracked and a fresh worktree checkout has none. Measured -- `npm ci` in such a
#     checkout exits EUSAGE, "can only install with an existing package-lock.json". Copy the
#     kata's untracked lockfile in first, THEN ci, which keeps the install reproducible:
cp "<kata>/TypeScript/package-lock.json" "<throwaway kata checkout>/TypeScript/package-lock.json"
npm --prefix "<throwaway kata checkout>/TypeScript" ci
#     Fallback if the kata has no lockfile on disk either:
#     npm --prefix "<throwaway kata checkout>/TypeScript" install
#
#     Do NOT link the kata's node_modules into this checkout with `mklink /J`. That instruction was
#     REMOVED on 2026-07-25. The apply checkout is where the MODEL UNDER TEST runs with write
#     access for the whole metered round, so a junction hands it the borrowed repo's real
#     dependency tree -- one `npm install` in its turn and a third-party checkout is modified. The
#     earlier note warned only about a recursive delete following the link on teardown and said
#     nothing about writes, which is the same blind spot that ran through the GRADER too: its
#     `git apply` (closed by assertSafeDiffPaths) and then its runner spawn on the produced spec
#     (closed by making the grading worktree's node_modules a per-grade COPY -- see the residual
#     list in Step 2). A copy would work here as well, but an install is better for the apply
#     checkout: the model may legitimately add a dependency during its turn.

# a3) ARM THE ANCHOR -- kata only. See the sub-section below; this is not optional for GRC.
node .claude/skills/lz-red-workspace/arm-anchor.mjs --arm    <throwaway kata checkout>
node .claude/skills/lz-red-workspace/arm-anchor.mjs --verify <throwaway kata checkout>
export E2E_APPLY_BASE=<the sha those two printed>

# b) drive the GRC suite (arm all = no_skill + with_skill + invoke_skill), serial, k=3:
node .claude/skills/lz-refactor-workspace/e2e-nx/run-e2e.mjs \
  --suite .claude/skills/lz-red-workspace/e2e-red-gilded-rose \
  --mode apply --arm all \
  --cwd <throwaway kata checkout>/TypeScript \
  --runs 3

# c) grade each captured run (D-06 gate -> red-grade.json). E2E_APPLY_BASE MUST still be exported:
node .claude/skills/lz-red-workspace/grade-red.mjs --run <runDir> \
  --suite .claude/skills/lz-red-workspace/e2e-red-gilded-rose
```

### 3a3 -- ARM the anchor, and export the base for BOTH the drive AND every grade

The kata's approvals spec uses `toMatchSnapshot()` but commits no snapshot, so its characterization
net is LATENT. That left "characterize the legacy code first" a defensible alternative answer and
cost a scoreable result in pilot 3. `arm-anchor.mjs --arm` writes the snapshot with the runner's
explicit `--update` flag, proves it with a plain re-run, and commits that ONE file inside the
throwaway. MEASURED 2026-07-26: vitest 0.28.5 also AUTO-writes the missing snapshot and passes
outside `--ci` (2 written, exit 0) -- but arming does not rely on that, and it must never run under
CI mode, which refuses to write new snapshots.

Committing puts the snapshot in the BASE, where it is invisible to the captured diff by construction
and restored by each inter-run reset, while a snapshot the MODEL writes still shows up. An untracked
one would land in the model's diff; `.git/info/exclude` would hide the model's too.

**CORRECTION to the earlier framing, and the reason this is a sub-step rather than a note: the two
commands FAIL DIFFERENTLY.** The arming commit puts HEAD ahead of `main`, so the DRIVE refuses on its
own -- `run-e2e.mjs` computes `rev-list APPLY_BASE..HEAD` and throws. The GRADE had no such check:
`gradeRun` has no ahead-check and no protected-branch check, so a forgotten export on a later
`grade-red --run` silently graded the armed round against the UNARMED base. Since this file
documents driving and grading as separate commands, that is an ordinary operator slip.

What protects the grade is the `requireExplicitApplyBase` flag on the GRC suite: a missing
`E2E_APPLY_BASE` is now an INSTANT refusal naming the variable, raised before a worktree or a
toolchain copy exists. So **export it on EVERY grade invocation, not just the drive**, and note that
every `red-grade.json` records the `apply_base` it actually used -- a reader can verify rather than
trust.

Do NOT export it for the other suites. Their bases are fixed pins, they do not set the flag, and an
exported value would OVERRIDE their pin and grade the wrong commit.

Arming narrows the characterize-first branch only. It does NOT fix the other branch: the kata's
`test/vitest/gilded-rose.spec.ts` ships a permanently failing placeholder, so a run can still
"answer" by tightening that existing test, which grades `unattributable` and needs hand inspection.

### 3b -- SRVC (srvx): throwaway, toolchain, drive

```
# a) throwaway srvx checkout, detached at the pin:
git --git-dir="<srvx>/.git" worktree add --detach <throwaway srvx checkout> \
  55d90b39840a5bb7236e23c4e326ee4fc3842d57

# a2) TOOLCHAIN. srvx ships only a pnpm lockfile, so there is NO tracked npm lockfile to copy and
#     `npm ci` cannot work. Use install, and keep the generated package-lock.json INSIDE the
#     throwaway -- writing one into the borrowed checkout would leave it permanently dirty.
#     MEASURED: exit 0, 33 s, 478 packages; --ignore-scripts NOT needed; the win32-arm64 oxlint /
#     oxfmt / rolldown bindings are present and execute.
npm --prefix "<throwaway srvx checkout>" install

# b) drive the SRVC suite. NO E2E_APPLY_BASE -- this suite's base is the pin in suite.json, and an
#    exported value would override it:
node .claude/skills/lz-refactor-workspace/e2e-nx/run-e2e.mjs \
  --suite .claude/skills/lz-red-workspace/e2e-red-srvx \
  --mode apply --arm all \
  --cwd <throwaway srvx checkout> \
  --runs 3

# c) grade each captured run:
node .claude/skills/lz-red-workspace/grade-red.mjs --run <runDir> \
  --suite .claude/skills/lz-red-workspace/e2e-red-srvx
```

Grading srvx runs `npm run build` once per grade inside the grading worktree (`typecheck.prebuild`),
because the package self-references through a gitignored `dist/`. Two of srvx's own test files fail
on this machine for environmental reasons (a da-DK locale time format and a port-allocation
timeout); NO tolerance mechanism is needed, because the gate runs only the produced test file and
`classify()` reads `testResults[0]`.

### 3d -- tabulate ALL suites

```
node .claude/skills/lz-red-workspace/tabulate-mechanical-red.mjs
```

The tabulator now WALKS EVERY `e2e-red-*` suite dir that has a `suite.json`, prints ONE combined
table, and writes each suite's own cells to that suite's own `mechanical-red.json` -- so a per-suite
artifact never carries another repo's numbers. It FAILS CLOSED if two different suites produce the
same `target:pid|arm` cell key: two repos blended into one cell is a wrong number that looks
entirely plausible, since the `n` doubles and the Pass@k becomes a mix with nothing in the output
saying so.

**Why `a2` matters for the MEASUREMENT, not just for tidiness.** A fresh `git worktree add` checkout
has no `node_modules` -- it is gitignored and untracked, so nothing is copied into it. Without a
toolchain the model under test cannot RUN the test it writes. That does not merely slow it down: it
silently removes the "watch it fail for the right reason" step from the RED loop, in all three arms
at once, which is one of the behaviours the eval is supposed to be measuring. Verified 2026-07-25 --
a fresh detached kata worktree has no `TypeScript/node_modules`, and neither `npx jest` nor `npx
tsc` resolves the kata's pinned versions from inside it. Install or link BEFORE driving `b`.

`c` (the pass criterion) = runs whose `red-grade.pass === true` (verdict `genuinely_red`: the
differential `tsc --strict` is clean AND at least one failing assertion belongs to a test the
produced diff ADDED). Pass@k over exit-0 runs only. Each `red-grade.json` records the attribution
evidence -- `added_test_titles`, `attributed_failures`, and a `failure_excerpt` that names the test
the message came from -- so a verdict can be checked rather than taken on trust.

### Reading the D-04 trigger columns

`tabulate-mechanical-red.mjs` prints THREE trigger rates, not one. Do not collapse them -- the k=1
pilot did, and reported a 0.00 "auto-trigger" for a run in which the skill demonstrably loaded.

| Column | Source | with_skill | invoke_skill | no_skill |
|--------|--------|------------|--------------|----------|
| `fired` (`autoTriggerRate`) | a `Skill` tool_use, i.e. the model CHOSE to invoke | the D-04 headline -- the number to report | **0.00 by design** | 0.00 |
| `avail` (`availableRate`) | the CLI's `system/init` event advertises the skill | 1.00 | 1.00 -- the working positive control | 0.00 |
| `force` (`forcedRate`) | the harness prefixed the slash command (by construction) | 0.00 | 1.00 | 0.00 |

A slash command in the `-p` prompt is expanded by the CLI at prompt-processing time. It produces no
`Skill` tool_use and no other trace in the stream, so a forced run is transcript-indistinguishable
from a run that never fired. `invoke_skill` therefore reads `fired` 0.00, and that is CORRECT, not a
bug: forcing is not a model choice, and reporting it as one would invent an auto-trigger the run
never made. What makes `invoke_skill` a working control is the `avail` 1.00 + `force` 1.00 pair --
it proves `--plugin-dir` loaded the plugin AND the detector is live, which is what licenses reading
a `with_skill` `fired` of 0.00 as a real trigger gap rather than a broken instrument.

If `invoke_skill` ever shows `avail` 0.00, STOP: the plugin did not load and the whole round is
measuring nothing. If a captured `meta.json` predates the 2026-07-25 detector fix, the tabulator
fails closed and asks for a re-capture rather than defaulting the three rates to 0.

### Apply preamble

The RED suite declares its own apply preamble in `suite.json` (`preambles.apply`). The shared
lz-refactor default ends "...run the affected tests to confirm nothing broke", which argues against
the behavior this suite measures -- the produced test MUST fail. The override still asks for a
typecheck and still forbids committing, is byte-identical across the three arms, and is asserted by
crux 2; crux 6 pins the lz-refactor default byte-for-byte so the shared string is never edited in
place. If you add a suite, decide deliberately which preamble it inherits.

---

## Step 4 -- Graded-dims path (blind judge + oracle-reviewer; ORCHESTRATOR-driven, post-run)

After the metered run, the ORCHESTRATOR (the gsd-executor cannot spawn subagents) runs:

1. **Blind LLM judge, at most 2 dims (the Phase-20 lock):**
   - Dim 1: "Is THIS the right next test?"
   - Dim 2: "Does it assert observable behavior, not implementation?"
   Blind the judge by feeding ONLY the produced test code + the target behavior spec -- NO arm label,
   NO skill self-identification (strip comments / normalize formatting). This is the Pitfall 7
   improvement over Phase 20 (a test file blinds far better than a self-identifying transcript).
2. **Second blind judge (contingent):** add classify-first ("is the right next move RED, not
   green/refactor?") as a THIRD dim only via a SECOND judge, and only if the confirmed targets stress
   it -- keep <= 2 dims per judge.
3. **oracle-reviewer for book/source authenticity** of the produced test vs the owned
   `.oracle/{clean-code, 99-bottles-2e-js, videos/test-desiderata, written-content}` RED sources
   (clean-room, DST-04; own-words verdicts only cross back). Expect lower discriminating power for a
   test artifact than for a named refactoring (RESEARCH A5).
4. **Fail-closed merge/verify:** `node .claude/skills/lz-red-workspace/merge-judge.mjs --merge` then
   `--verify` (byte-match verdict provenance + the fail-closed gate; reused verbatim, selfcheck-GREEN).
5. **Fill EVAL-RESULTS.md** -- every blank Pass@k/Pass^k, mechanical, auto-trigger, and graded-dim cell.

Contamination flag per target (GRC = HIGH) stays on each row so a tie is read as pass-at-ceiling.

---

## Step 5 -- Competitor round (D-05; LATER, CONTINGENT -- not the first fan-out)

The `mattpocock-skills:tdd` competitor arm is a LATER, CONTINGENT round -- run it ONLY after our own
lift is measured, and only because its standalone check passed (no hard sibling dep). **Scope
mismatch to note in the writeup:** mattpocock `tdd` is a full red->green loop with an interactive
seam-confirmation step, whereas lz-red is a RED-step-only coach (write the failing test and stop;
making it green is lz-tpp's job). The competitor is NOT in the first fan-out; add it as a separate,
freshly-scoped round if the own-skill lift warrants a head-to-head.

---

## Step 6 -- Run-time orchestration hygiene (D-13)

For the gated run (all RUN-time, not part of the build):

- **Small waves.** Fan out in SMALL waves (respect the org concurrency cap; the user flagged
  24-in-flight). run-e2e.mjs already drives arms x prompts x runs SERIALLY, so a single suite is safe;
  the risk is the ORCHESTRATOR spawning multiple background suites or many grading subagents at once.
  Drive ONE suite dir at a time, sequentially.
- **Normal mode / stop ponytail.** Put an explicit "normal mode / stop ponytail" directive in EVERY
  in-session Agent subagent prompt -- the env-var lock does not reach subagents, and a lazy default
  perturbs the probe.
- **Resume spend-limit kills.** If a subagent is killed by a spend limit, resume it via
  `SendMessage(agentId)` rather than re-spawning (avoids double-spend and preserves state).
- **Isolated git-ignored worktree per run.** Drive each run in an isolated git-ignored worktree/dir
  (ground-truth nodrive); the borrowed repo's pristine tree is never the apply target. Per-run
  byproducts (`results/apply/**`, transcripts) are git-ignored; NO dependency is added to
  `plugins/lz-tdd`.

---

## Step 7 -- Post-run unbiased review + substance-only headline (D-08 / D-10)

**Mandatory before any number is recorded:** at least ONE from-scratch UNBIASED reviewer (a neutral
brief, given NO prior findings and NOT primed with these numbers) audits the grader source
(`grade-red.mjs` + `merge-judge.mjs` + `tabulate-mechanical-red.mjs`), a sample of blinded test diffs
+ transcripts, and the reported Pass@k/Pass^k + mechanical numbers. This is the gate that caught the
Phase-20 ~3x vocabulary inflation (`unbiased-review-beats-primed`).

**The headline is SUBSTANCE-ONLY (D-08).** Substance = (1) the mechanical D-06 correctness GATE (runs
the test, classifies the runner JSON -- no house-vocabulary proxy can inflate it) + (2) the blind-judge
substance dims. Any house-style / house-vocabulary number, if reported at all, is a SEPARATE row
explicitly labeled CONTEXT-ONLY and is never the headline. Apply artifact caveats SYMMETRICALLY to
both arms, never just upward. Read a correctness tie on the contaminated GRC anchor as
pass-at-ceiling, framed by the Phase-13 parity + Phase-20 concentration priors -- NOT as evidence the
skill is inert.

---

## Reference -- expected outputs

- `<suite dir>/results/apply/<arm>/<pid>/run-*/` (git-ignored, PER SUITE): `meta.json`, `answer.md`,
  `diff.patch`, `red-grade.json`, `outputs/`.
- `<suite dir>/mechanical-red.json` (PER SUITE, git-ignored): that suite's own tabulated mechanical
  dims + Pass@k/Pass^k. The tabulator also prints one COMBINED table across all suites.
- `EVAL-RESULTS.md`: filled from the run + the graded dims + the unbiased-reviewer verdict.

Each `red-grade.json` records, alongside the verdict: `apply_base` (which commit the grade actually
ran against), `runner_test_path` (the path the runner command received, after any
`runner_path_base` stripping), `toolchain_ms` and `prebuild_ms`.

All of the above is documentation only. Nothing here runs during execute-phase; the metered run starts
only on fresh explicit user approval.
