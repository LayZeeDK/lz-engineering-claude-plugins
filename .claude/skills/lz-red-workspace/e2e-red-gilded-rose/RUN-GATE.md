# lz-red APPLY Eval -- RUN-GATE (the gated metered-run presentation)

This file is DOCUMENTATION. It presents the ready-to-run gated metered commands and then STOPS.
Running any command below is out of scope for execute-phase; the metered 3-arm apply run is a
separate, freshly-approved, orchestrator-driven step.

Skill under test: `plugins/lz-tdd/skills/lz-red`. Milestone lz-tdd@0.0.3.

This is the single gated presentation for the WHOLE RED round, across every suite -- it is not
forked per suite. THREE suites, FOUR cells:

| Suite dir | Target | Role |
|-----------|--------|------|
| `.claude/skills/lz-red-workspace/e2e-red-gilded-rose` | `GRC` | HIGH-contamination correctness SMOKE anchor |
| `.claude/skills/lz-red-workspace/e2e-red-srvx` | `SRVC` | LOW-contamination OUT-OF-DOMAIN control |
| `.claude/skills/lz-red-workspace/e2e-red-radix-ng` | `RXF` | MEDIUM-contamination IN-DOMAIN **primary drive discriminator** |
| `.claude/skills/lz-red-workspace/e2e-red-radix-ng` | `RXL` | MEDIUM-contamination IN-DOMAIN observable-output cell |

The in-domain gap the two-suite corpus could not close is now closed: with `RXF` in the corpus a
correctness tie on GRC can finally be told apart from inertness, because `RXF` is a genuine
discriminator on the drive axis rather than a control.

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

`selfcheck-red.mjs` now takes **~4-4.5 minutes** and the radix suite is why. MEASURED 2026-07-26 on
the same machine in the same session: **114.9 s immediately BEFORE the radix suite was wired, then
232.1 s and 262.9 s after** -- a **+117 to +148 s** increase, accounted for by the two radix
toolchain copies the new canaries add (~35 s each, copy plus remove) plus their two ~12 s vitest runs
and four ~3.9 s tsc passes. The 30 s spread between the two post-wiring runs is machine load, not
drift. That is the containment's cost, not a hang.

Earlier ranges for context: ~70 s with GRC alone, and 105-155 s over six runs with GRC + srvx (the
spread there is filesystem cache warmth and machine load, and it swamps anything the
grading-worktree relocation changes -- do not read a faster or slower battery as evidence either
way; crux 11 and the crux 7/9 volume assertions are the evidence).

Cruxes 7, 9 and 10 each build a real grading worktree, and crux 7 now copies a real toolchain
NINE times -- five for GRC, two for srvx, two for radix. **Run it in the background rather than under
a tool timeout** -- the Bash tool's `timeout` is capped at 600000 ms, and while 232-263 s still fits,
the margin is no longer comfortable and would vanish outright if a third radix cell or the closed
ngx-layout target were added (the latter's per-grade copy alone is ~11 min). Never narrow the battery
to make it finish sooner: a SKIP is not a pass. See the residual list in Step 2.

---

## Step 1 -- Pre-run confirmation checklist (D-01, target confirmation)

Before any spend, confirm the target corpus with the user at the gate. All THREE suites and all FOUR
cells are BUILT and canary-green. The corpus is still steer-at-gate: the user confirms it, and may
drop cells for spend.

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
   lift". On its own it cannot tell pass-at-ceiling from inertness -- that is what `RXF` is for.

3. **RXF (radix-ng `data-focus` on the calendar cell trigger) is BUILT and canary-green -- the
   IN-DOMAIN PRIMARY drive discriminator.** Pinned at
   `4a7390a2b058457aa47c6f3e0e03b69b70dee025`, sourced from the PRISTINE clone
   `D:/projects/github/radix-ng/primitives-pin` (see the `applyBase_note` in `suite.json` for why
   the maintainer's own checkout is excluded). Scored against the 7-point checklist in
   `e2e-red-radix-ng/targets.json`; contamination MEDIUM because the contract is declared in the
   repo's own committed docs.

   **This is the cell most likely to discriminate.** The fix is ONE TOKEN on one host-binding line,
   against a convention seven sibling primitives already follow -- maximum drive temptation, and
   coach-don't-drive is exactly where Phase-20 EVL-02 found lz-red's real, unbiased-reviewer-confirmed
   edge (eval-8, COMMAND handoff). Read `changed_production_files` on this cell before anything else
   (see "Reading `changed_production_files`" below).

4. **RXL (radix-ng `RadixNGConfig.locale` inheritance) is BUILT -- the in-domain observable-output
   cell.** Same suite, same pin, same toolchain. It buys a different file, a different package, a
   different assertion shape (rendered month heading, single answer) and the PARTIAL-FIX drive case:
   the fix spans a new injection token, a provider bridge and nine primitives that hardcode a locale
   default, so a partial implementation leaves the test red -- the exact shape the unconditional
   `changed_production_files` field was built to make visible. RXF's one-token fix cannot produce it.

   RXL ships with NO standing end-to-end canary of its own -- see the residual list in Step 2 for
   exactly what that does and does not cover.

### Third target CLOSED -- ngbracket/ngx-layout is permanently out

The former in-domain candidate `ngbracket/ngx-layout` is CLOSED with evidence and must not be
revisited: no UPSTREAM revision of that repo can run `ng test` for the library (the pin's
`package.json` `exports` map omits every subpath the specs import; the commit that adds the resolving
aliases exists only on a fork branch), and its per-grade toolchain copy is ~11 minutes against a
1.6 GB / 186,366-file tree. Both routes out of that -- re-pinning to an unpushed fork commit, or
arming the target's test infrastructure before measuring the model on it -- change what the eval
measures. The in-domain slot it was meant to fill is now filled by `RXF` and `RXL` at a fraction of
the cost. The full measurement record, including the two properties worth carrying to any future
in-domain candidate (a live committed false green, and a helper that collapses assertions to an
opaque boolean), is preserved in the state record and in this file's history. Do not re-open it.

### Historical cost record -- ngx-layout, kept only because a residual bullet cites it

Copying that checkout's `node_modules` (1.6 GB, 186,366 files) was the single most expensive thing
ever measured in this instrument. Re-measured 2026-07-26, same tree, same session, one destination
straight after the other: `os.tmpdir()` on C: (cross-volume) 741.5 s copy + 134.1 s remove = 875.6 s;
`D:\.lz-red-grade-tmp` (intra-volume, what `grade-red` does) 531.4 s + 111.3 s = 642.7 s. So keeping
the copy on the target's own volume is worth about **27%** -- real, but it never made that target
affordable, and **the cost is dominated by FILE COUNT, not by the volume boundary** (the intra-volume
copy ALONE exceeds the 482 s figure the relocation was originally justified by; the machine was
simply faster that day).

Do not read the 27% as a general win. On the targets actually in the corpus, measured by alternating
the two destinations three times each so cache warmth is shared, the copy is a tie within noise and
only the remove improves: kata copy 4.06 s -> 3.86 s and remove 1.23 s -> 1.03 s; srvx copy 6.70 s ->
6.89 s and remove 2.03 s -> 1.62 s. The durable value of `resolveGradeTmpDir` is that the location is
DERIVED, overridable via `$LZ_RED_GRADE_TMPDIR` and loud when it cannot be honoured -- not that it is
fast.

5. **Confirm or nominate any FURTHER target** against the 7-point qualification
   checklist (steer-at-gate; D-01). The radix suite also records a DEFERRED candidate, CAND-3
   (`data-outside-visible-view` on the same directive as RXF), with full evidence and an enable
   checklist in `e2e-red-radix-ng/targets.json`. Enabling it is DATA ONLY -- but read the attribution
   warning there first: it is a second attribute on the SAME file as RXF, so running both in one
   round is the only configuration in the corpus where a run can legitimately land on the other
   cell's gap.
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
6. **Package-legitimacy gate on ANY newly nominated repo (T-21-SC).** If the user nominates a NEW
   real-OSS repo (not the already-vendored kata), run the package-legitimacy gate on it FIRST --
   confirm it is a real, maintained repo (registry age / downloads / source repo) -- and only then
   `npm install` + vendor it. Do NOT auto-substitute a similarly-named alternative if an install
   fails; surface it to the user. The anchor kata is already vendored + verified, so no install is
   needed for a GRC-only round. srvx was legitimacy-gated at measurement time (first publish
   2024-09-16, 83 versions, MIT, 0 runtime deps, repo live) and radix-ng at wiring time
   (`@radix-ng/primitives`, MIT, 265 stars, 2,148 weekly downloads, 89 versions, 12 contributors,
   last commit 2026-07-19, not deprecated) -- both recorded in their `targets.json`.
7. **Decide run scope for spend (D-03):** the built corpus is 4 cells x 3 arms x k=3 = **36 runs**;
   the exact cell count and k are tuned here for spend. Report Pass@k AND Pass^k
   (k = 1, 3, 5, total) per cell + overall. Scope it against the measured calibration point below
   rather than a guess -- and note that **grading is no longer a rounding error**: the two radix
   cells cost ~35 s of toolchain copy EACH PER GRADE, plus a differential typecheck that runs a full
   `packages/primitives/tsconfig.spec.json` pass TWICE. The operator must see that before choosing k.

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

| Target | Toolchain copy + remove | Differential typecheck | Notes |
|--------|-------------------------|------------------------|-------|
| GRC | 3.86 s + 1.03 s (7,610 files, 142.8 MB) | negligible; no prebuild | was 4.06 s + 1.23 s under `os.tmpdir()`; the copy is a tie within noise |
| SRVC | 6.89 s + 1.62 s (12,855 files, 170.8 MB) | plus a ~1.6 s warm `npm run build` prebuild (12.2 s cold, obuild itself 210 ms) | prebuild is TYPECHECK-only, the runner does not need it |
| **RXF / RXL** | **27.7 s + 7.1 s = ~34.8 s** (78,694 files, 949.5 MiB, 8,164 symlinks) | **~3.9 s per pass x 2 = ~7.8 s** against a 55-error pre-existing baseline; no prebuild | MEASURED 2026-07-26 copying BOTH declared `node_modules` paths intra-volume. Peak TRANSIENT disk **~949 MiB per grade**, held for the duration of that grade only (grades are sequential, so that is the peak, not the total). If the Dev Drive is short of headroom, `$LZ_RED_GRADE_TMPDIR` relocates it. |
| NGXA (CLOSED) | 531 s + 111 s (186,366 files, 1.6 GB) | none | historical record only -- the target is permanently out; see Step 1 |

Straight-line scaling for the fan-out (model spend is dominated by the turn, not by grading -- but
grading is now a visible line item, not a rounding error):

| Scope | Runs | Est. spend | Est. model wall clock (serial) | Grading overhead |
|-------|------|-----------|--------------------------------|------------------|
| GRC only x 3 arms x k=3 | 9 | ~$4.90 | ~13 min | ~45 s |
| GRC + SRVC x 3 arms x k=3 | 18 | ~$9.80 | ~26 min | ~2.5 min |
| **All 4 cells x 3 arms x k=3 (the built corpus)** | **36** | **~$19.50** | **~51 min** | **~15 min** (GRC ~44 s + SRVC ~77 s + radix ~13 min) |
| All 4 cells x 3 arms x k=5 | 60 | ~$32.50 | ~85 min | ~25 min |
| Drop RXL to keep radix at one cell | 27 | ~$14.70 | ~38 min | ~8.5 min |

Add ONE round of `pnpm install` in the radix throwaway (see Step 3c) -- amortised across the whole
round, not per grade.

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

**This canary is a REQUIRED gate step; run it BEFORE committing to the full k=3 x 4-cell spend.
It costs NOTHING, so there is no reason to skip it.**

```
node .claude/skills/lz-red-workspace/selfcheck-red.mjs      # run in the BACKGROUND; ~4-4.5 min (232-263 s measured)
```

The battery now covers **NINE fabricated runDirs across three suites** -- five GRC, two srvx, two
radix -- and each is the discriminating check for a specific mechanism:

| Fixture | Suite | The mechanism it is the discriminating check for |
|---------|-------|--------------------------------------------------|
| `canary-rundir` | GRC | the gate sees the TARGET's toolchain, routes to a runner that collects the spec, and attributes the failure to the ADDED test; also pins `changed_production_files` PRESENT and EMPTY |
| `canary-nocollect` | GRC | a spec outside every collection root returns `no_tests` rather than throwing |
| `canary-compile` | GRC | the differential typecheck still tells a clean spec from a type-broken one |
| `canary-borrowed` | GRC | RED attribution -- a PASSING test appended to an already-failing spec grades `false_green`, not a borrowed pass |
| `canary-grc-drive-red` | GRC | `changed_production_files` is recorded ON THE RED PATH, where the drive evidence used to be discarded |
| `canary-srvc-red` | SRVC | the `<reportFile>` report source AND `typecheck.prebuild`; plus the `E2E_APPLY_BASE` leak check |
| `canary-srvc-compile` | SRVC | that target's OWN `typecheck.args` still discriminate |
| `canary-rdxf-red` | RXF | MULTI-PATH toolchain provisioning and the WORKTREE-bounded containment check, end to end against a pnpm workspace of 8,164 symlinks |
| `canary-rdxf-compile` | RXF | the `-p packages/primitives/tsconfig.spec.json` differential -- this repo has NO root `tsconfig.json`, so a dropped project flag makes the differential VACUOUS rather than merely broad |

**Run it in the BACKGROUND, not under a tool timeout.** MEASURED 2026-07-26: 114.9 s before the
radix suite, 232.1 s and 262.9 s after. The Bash tool's `timeout` caps at 600000 ms; that still
fits, but the margin is no longer comfortable. And remember that **a SKIP is not a pass**: it means
the borrowed repo or its `node_modules` was not on disk and that direction went unmeasured.

**One check is PLATFORM-CONDITIONAL, and it is the one covering a Critical-class bug.** crux 9's
`verbatimSymlinks` discrimination needs a RELATIVE directory link, which Windows refuses without
Developer Mode or elevation; where it cannot be written, the probe falls back to an
always-absolute junction, which is copied identically under BOTH `cpSync` settings and therefore
cannot tell them apart. On such a machine the battery prints a top-level
`[crux 9] SKIP -- ... verbatimSymlinks discrimination went UNMEASURED`. Its only backstop,
`canary-rdxf-red`, SKIPs wherever `primitives-pin` is absent -- so on a CI runner or a second dev
box BOTH layers can SKIP together and a reopened containment hole would ship green. **If you see
that SKIP, the copy-containment direction was not measured on that machine; do not read the
battery's exit 0 as covering it.** (Measured on this machine: it does NOT skip -- relative
directory links are available here.)

There is deliberately no RXL canary. A PURE assertion instead requires RXL's `runner`, `typecheck`
and `toolchain_paths` blocks to be DEEP-EQUAL to RXF's -- which is exactly what licenses the RXF pair
to cover it, since one `runner_select` prefix routes both test dirs, one tsconfig project includes
both, and one toolchain serves both. Give RXL a divergent config and the battery FAILS, forcing a
canary rather than letting it silently inherit an unproven one. See the residual list for what that
does NOT cover.

Beyond the five GRC fixtures described below, the two srvx fixtures cover mechanisms the kata's
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
further asserts every RED suite declares byte-identical apply preamble bytes -- suites measured
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

Four more GRC fixtures cover the other directions. `fixtures/canary-nocollect/` puts the produced
spec outside every collection root and asserts the gate returns `no_tests` rather than throwing.
`fixtures/canary-compile/` is the NEGATIVE control: a spec with one deliberate type error, asserted
to grade `compile_error` with `new_tsc_errors > 0`. Without it nothing in the whole battery would
notice the differential typecheck silently ceasing to discriminate, which is the exact defect that
made a produced test with blatant type errors grade as tsc-clean.

`fixtures/canary-grc-drive-red/` is the DRIVE-EVIDENCE discriminator, and it is the one shape none
of the others can see: every other fixture's diff is TEST-ONLY. This one adds a FAILING spec AND
makes a PARTIAL production edit (the Conjured rule implemented only in the already-expired branch),
so the added test still fails on an assertion. It asserts the verdict stays `genuinely_red` -- the
taxonomy did not move -- while `changed_production_files` NAMES that production file. It sits on the
RED path precisely because that is where the evidence used to be discarded: before this, a model
that edited production code and left its test failing scored `genuinely_red` / `pass: true` with the
drive attempt completely invisible. It runs against the kata rather than a radix target on purpose:
the field is computed from the diff and is target-independent, so proving it costs one ~5 s toolchain
copy instead of two ~35 s ones.

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

- The canary drives NINE fabricated diffs, not every possible one. They prove the gate mechanism
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
- **Operator-visible cost of the containment:** on the KATA the copy adds about 4.9 s per graded run
  (2.5-2.8 s to copy its 7,610-file / 142.8 MB tree, ~1 s to remove it), so roughly 45 s across a
  9-run GRC fan-out. On the RADIX cells it is ~34.8 s per grade -- see the dedicated bullet below.
  Each grade holds ONE copy under the temp dir while it runs; grades are sequential, so that is the
  peak, not the total. Every `red-grade.json` records the real figure as `toolchain_ms` and the CLI
  prints it, so if a round feels slow the number is already in the artifacts. There is deliberately
  no shared cache: it would save that time but hand every grade a mutable tree to write through, and
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
  stranded radix worktree is ~949 MiB.
- **Per-target grading cost is not flat.** GRC ~4.9 s, SRVC ~8.5 s plus a ~1.6 s prebuild, and each
  radix cell ~34.8 s plus a ~7.8 s double typecheck pass. See the dedicated radix bullet below for
  its transient footprint and why hardlinking is not a way out.
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
  CONTROL, not a discriminator, so a tie there does not settle the question either. **RXF is the
  cell that can settle it** -- it is in-domain, MEDIUM contamination, and maximum drive temptation.
  Read a tie on GRC + SRVC alone as inconclusive, exactly as before; read RXF as the result.
- **Radix per-grade copy cost, and its peak transient footprint.** ~27.7 s to copy plus ~7.1 s to
  remove per grade, and **~949 MiB of transient disk held for the duration of each grade** (78,694
  files, 8,164 symlinks, both declared `node_modules` paths). Grades are sequential, so that is the
  peak rather than the total. Across the 18 radix runs of a k=3 round that is ~10.5 minutes of pure
  copy time. `$LZ_RED_GRADE_TMPDIR` relocates it if the Dev Drive is short of headroom -- it has less
  than the profile volume here. **Hardlinking is NOT a valid shortcut**: shared inodes mean an
  in-place write from the model's runner corrupts the SOURCE, which is exactly the hole the per-grade
  copy was made to close (crux 9 reproduces that shape every run). **ReFS block cloning remains a
  genuinely unmeasured follow-up** -- ReFS supports copy-on-write clones and Node's `fs.cpSync` does
  not use them, so a `FSCTL_DUPLICATE_EXTENTS` path could plausibly collapse this to near-zero on the
  Dev Drive. Out of scope here.
- **On radix, read a `compile_error` cluster against the RECORDED lines before treating it as a
  model failure.** That target's typecheck baseline is DIRTY -- 55 pre-existing errors across 17
  files -- and the differential is line-exact string subtraction. A produced spec that PERTURBS an
  existing diagnostic's text or position (a module augmentation, a `declare`, a type that changes
  inference in a shared file) yields "new" lines that are RELOCATED baseline errors rather than the
  model's own. Every `red-grade.json` now records `new_tsc_error_lines` (the actual NEW diagnostics,
  capped at 10) alongside `new_tsc_errors`, so the verdict can be CHECKED. On GRC and SRVC the
  baseline is clean and the count is self-evident; on radix it is not.
- **`escapingLinks` is now bounded by the WORKTREE rather than by the copied directory.** State
  plainly what that changed. What it PERMITS: a link inside the copied toolchain that resolves
  anywhere else INSIDE the same grading worktree -- which is what a pnpm workspace's package-level
  links (pointing up into the root store) and the root store's own workspace self-link (pointing back
  at `packages/primitives`) both are. MEASURED: 8,164 symlinks, 100% relative, ZERO absolute, ZERO
  resolving outside the repo, of which SEVEN escape their own copied root and none escape the
  worktree. What it still CATCHES: an ABSOLUTE link into the source checkout, an unreadable link,
  a `..` chain whose FIRST hop leaves the worktree, and -- since 2026-07-26 -- a copied
  destination whose ROOT is itself a link out of the boundary. This is a CORRECTION -- the guard's
  own contract always said "a link escaping the WORKTREE leads back to the borrowed repo"; the
  boundary was simply narrower than that. crux 9 asserts BOTH boundaries over one synthetic tree, so
  the widening is proved to be a widening and not a removal.
  **What it does NOT catch, stated exactly rather than generously: a TWO-HOP chain.** Resolution is
  a single lexical hop with no `realpath`, and the walked set is the copied toolchain destinations
  only -- which, now that the boundary is the whole worktree, is strictly SMALLER than the boundary.
  So hop 1 from inside a copied toolchain into the target's own checked-out content is legitimately
  inside the boundary, and hop 2 out of the worktree from THERE is never examined. An earlier
  wording of this bullet said "any `..` chain that leaves the worktree", which was too strong.
  Reachability needs a symlink COMMITTED in the target's tracked content -- `git ls-tree -r HEAD |
  rg '^120000'` is **0** in all three borrowed repos -- and everything inside the worktree is
  already reachable by the executing spec through ordinary relative paths (see the ABSOLUTE-path
  residual below). crux 9 PINS the permitted shape, so this bullet and the code cannot drift: close
  the two-hop case and that assertion fails, which is the signal to rewrite this bullet.
- **`fs.cpSync` does NOT preserve relative symlinks by default, and getting that wrong would have
  reopened the whole hole.** With the default `verbatimSymlinks: false` it resolves each link against
  the SOURCE and writes an ABSOLUTE path into the copy -- so a tree of ordinary relative links becomes
  a tree of links pointing straight back into the borrowed repo. FOUND end to end: the first real
  radix grade tripped `escapingLinks` with 8,170 links resolving into `primitives-pin`. Provisioning
  now passes `verbatimSymlinks: true`, and crux 9 asserts a copied relative link resolves inside the
  destination. An ABSOLUTE link in the source is still preserved as absolute and still reported as an
  escape, so the fail-closed direction is unchanged. **Do not "simplify" that option away.**
- **The `@angular-devkit/schematics` version divergence between the two radix `node_modules` is real
  and is now faithfully reproduced.** `packages/primitives/node_modules` pins 21.2.12 while the root
  store has 22.0.2; the other five package-level deps resolve to byte-identical store entries. No
  spec imports schematics, so it does not affect any current grade -- recorded here so a future
  reader does not rediscover it as a surprise, and so nobody "simplifies" `toolchain_paths` back to a
  single path on the grounds that the second one looks empty (it is 6 links and 0 files).
- **RXL has NO standing end-to-end canary, and its CROSS-PACKAGE IMPORT rests on a one-time
  measurement.** The deep-equality assertion licenses the RXF pair to cover RXL's
  `runner_select` prefix match, its shared tsconfig project and its shared toolchain -- and it
  genuinely does cover those. It does NOT cover the thing that is specific to RXL: its spec lives
  under `config/__tests__/` and imports the CALENDAR to observe locale-driven rendering. That
  resolution was proven ONCE, by hand, during this suite's measurement phase (the disciplined spec
  ran to its assertion and added 0 NEW tsc errors), behind a STOP-and-report gate -- and nothing
  re-proves it afterwards. If a future change to the tsconfig project, the path mappings or the
  vitest resolve config broke cross-package resolution, the battery would stay green and every real
  RXL run would fail at import. **Read a `collection_error` cluster on RXL specifically as a possible
  cross-package resolution regression**, and consider promoting RXL to its own canary if that ever
  happens.
- **A produced spec that lands OUTSIDE `packages/primitives/` is invisible to the radix differential
  typecheck** -- the project only includes `**/*.spec.ts` relative to that directory. That is the
  FAIL-SAFE direction rather than a hole: vitest's `root` is the same directory, so such a spec
  cannot be collected either, and the grade is `no_tests` rather than a false pass. Recorded so
  nobody adds a tolerance the gate does not need.
- **The `<reportFile>` no-collect direction is still open, and radix does not close it.** Both radix
  targets use a `<reportFile>` runner, and like srvx neither has an
  outside-every-collection-root fixture, so the branch where a wrapped runner puts its no-collect
  status line on STDOUT rather than stderr remains unmeasured for report-file runners. Unchanged from
  the previous round; see the `<reportFile>` bullet above.

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

### 3c -- RXF/RXL (radix-ng): throwaway, toolchain, drive

BOTH radix cells share ONE throwaway and ONE suite dir; `--arm all` with both prompts covers them.

```
# a) throwaway radix checkout, detached at the pin. --detach, NEVER -b.
#    The source is the PRISTINE clone. NEVER install into it, and never touch the maintainer's own
#    radix-ng/primitives checkout -- it is deliberately not the eval source (see applyBase_note).
git --git-dir="D:/projects/github/radix-ng/primitives-pin/.git" \
    --work-tree="D:/projects/github/radix-ng/primitives-pin" \
    worktree add --detach <throwaway radix checkout> \
    4a7390a2b058457aa47c6f3e0e03b69b70dee025

# a2) TOOLCHAIN -- ONCE PER ROUND, amortised across every run, NOT per grade.
#     The repo documents pnpm and its packageManager is pnpm@11.5.1.
pnpm install --dir <throwaway radix checkout>

# b) drive the radix suite (both prompts, arm all = no_skill + with_skill + invoke_skill), k=3.
#    NO E2E_APPLY_BASE -- this suite's base is the pin in suite.json, and an exported value would
#    override it and grade the wrong commit:
node .claude/skills/lz-refactor-workspace/e2e-nx/run-e2e.mjs \
  --suite .claude/skills/lz-red-workspace/e2e-red-radix-ng \
  --mode apply --arm all \
  --cwd <throwaway radix checkout> \
  --runs 3

# c) grade each captured run:
node .claude/skills/lz-red-workspace/grade-red.mjs --run <runDir> \
  --suite .claude/skills/lz-red-workspace/e2e-red-radix-ng
```

**`a2` is not tidiness -- it is the MEASUREMENT.** Without a toolchain in the apply checkout the
model cannot RUN the test it writes, which silently removes "watch it fail for the right reason"
from the RED loop in ALL THREE ARMS at once. That is the same failure class as the anti-RED apply
preamble that was already removed, and it would hit every arm equally while hollowing out exactly
what the eval measures.

MEASURED 2026-07-26 in a detached throwaway at the pin: `pnpm install` exits 0 in **37.8 s**
(2,417 packages; 25.9 s was measured earlier with a fully warm store). `--ignore-scripts` is NOT
needed and no QEMU fallback occurs -- but note one CORRECTION to the earlier "all 20 native packages
resolved to win32-arm64" note: `msgpackr-extract@3.0.4` ships NO win32-arm64 prebuild, so its
postinstall COMPILES LOCALLY via node-gyp (observed: Python 3.14 + VS2026 BuildTools, `gyp info ok`,
exit 0). It succeeds here, and it is the bulk of the difference between 25.9 s and 37.8 s -- but a
machine without a working node-gyp toolchain would see that postinstall fail. Check the install's
exit code rather than assuming.

Grading radix runs copies **both** declared `node_modules` paths (`node_modules` and
`packages/primitives/node_modules`) into each grading worktree: ~27.7 s in, ~7.1 s out, ~949 MiB
transient. The differential typecheck runs a full `packages/primitives/tsconfig.spec.json` pass
TWICE per grade (~3.9 s each) against a 55-error pre-existing baseline. No prebuild is declared.

### 3d -- tabulate ALL suites

```
node .claude/skills/lz-red-workspace/tabulate-mechanical-red.mjs
```

The tabulator now WALKS EVERY `e2e-red-*` suite dir that has a `suite.json` -- THREE of them -- prints
ONE combined table, and writes each suite's own cells to that suite's own `mechanical-red.json`, so a
per-suite artifact never carries another repo's numbers. The four cell keys are globally unique
(`GRC`, `SRVC`, `RXF`, `RXL`), and the tabulator FAILS CLOSED if two different suites ever produce
the same `target:pid|arm` key: two repos blended into one cell is a wrong number that looks entirely
plausible, since the `n` doubles and the Pass@k becomes a mix with nothing in the output saying so.

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

### Reading `changed_production_files` (new; EVIDENCE, not a gate)

Every `red-grade.json` now records `changed_production_files` -- the non-test files the captured diff
touched -- on EVERY path, not only when all assertions pass. Read it like this:

| Verdict | `changed_production_files` | What it means |
|---------|----------------------------|---------------|
| `genuinely_red` | `[]` | the clean RED: the model wrote a failing test and stopped |
| `genuinely_red` | **non-empty** | **a drive ATTEMPT.** The model edited production code and the test STILL fails -- typically a partial fix. This was completely INVISIBLE before, and it is a coach-don't-drive signal even though the verdict passes |
| `drove_to_green` | non-empty | the model drove to green successfully -- unchanged meaning, unchanged verdict |
| `false_green` | `[]` | the added test passes on current code; no production edit |

**The verdict taxonomy did NOT change.** `drove_to_green` still means drove SUCCESSFULLY, `pass` is
still `verdict === 'genuinely_red'`, and no run's verdict moves because of this field. It is evidence
for the OPERATOR and the JUDGE, not a gate -- deliberately, because a partial edit that leaves the
test red is genuinely a red test, and turning it into a failure would conflate two different things.

Expect the non-empty `genuinely_red` shape most on **RXL**, whose fix spans a new injection token, a
provider bridge and nine primitives, so a partial implementation leaves the test red. **RXF** cannot
easily produce it -- its fix is one token, so an edit that lands makes the test pass and grades
`drove_to_green` outright.

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

   **Substring rule, radix cells (RXF/RXL).** Tell the judge that on these two cells an assertion
   must be EXACT on trimmed text: one month-name spelling is a strict PREFIX of the other, and one
   attribute spelling is a strict prefix of the other, so a `toContain` / `toMatch` / `startsWith`
   form is a FALSE GREEN that passes on current code. REPRODUCED 2026-07-26 on the exact fixture.
   The MECHANICAL gate already grades that form `false_green` (the assertion passes, the diff stays
   test-only), so no new mechanism was built and none is needed -- but it means **a cluster of
   `false_green` on these cells is worth reading as a substring-assertion signal rather than only as
   a discipline signal.**
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
`runner_path_base` stripping), `produced_test_files`, **`changed_production_files`** (the non-test
files the diff touched -- recorded on EVERY path, see "Reading `changed_production_files`" in
Step 3), `toolchain_ms` and `prebuild_ms`.

All of the above is documentation only. Nothing here runs during execute-phase; the metered run starts
only on fresh explicit user approval.
