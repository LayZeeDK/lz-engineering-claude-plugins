---
phase: quick-260725-wpu
plan: 01
status: complete
completed: 2026-07-26
requirements: [EVL-03.3]
outcome: partial -- 4 of 5 tasks delivered; the primary discriminator is BLOCKED on a measured, user-owned target-selection decision
commits:
  - 8a58cf2 feat(red) per-target runner and typecheck configuration in grade-red
  - 074e8d8 feat(red) tabulate every RED suite, fail closed on a colliding cell
  - 748bd97 feat(red) srvx RED apply suite (out-of-domain control)
  - 5668693 feat(red) arm the Gilded Rose approvals snapshot in the throwaway checkout
  - a3f01a5 docs(red) RUN-GATE for the multi-suite round + the armed anchor
spend: zero (no claude -p, no eval fan-out, no metered command)
---

# 260725-wpu -- Wire measured RED apply targets, and arm the anchor

## Headline

Five of the plan's six commits landed. The RED apply instrument now has **two** suites instead of
one, the Gilded Rose anchor can be armed and the armed state verified, and grading refuses to run
against an unstated base.

**The plan's PRIMARY target is BLOCKED and was not built.** `ngbracket/ngx-layout` cannot run its
own test suite at the pin the plan declares, and no upstream revision of that repo can. This was
caught by the plan's own measure-first step, which instructs STOP-and-report rather than papering
over. Resolving it changes what the eval measures, so it is a D-01 steer-at-gate decision, not an
executor one. Details below and in RUN-GATE Step 1.

Consequence to carry forward: with the in-domain discriminator absent, the corpus is one
HIGH-contamination anchor plus one out-of-domain CONTROL. A tie across both still cannot be told
apart from pass-at-ceiling. RUN-GATE says so explicitly rather than letting a two-target tie read as
a result.

## What each new suite's measured canary verdict was

Both are real `gradeRun` grades against the target's OWN toolchain, in `selfcheck-red` crux 7, at
zero spend.

| Suite | Fixture | Verdict | Evidence |
|-------|---------|---------|----------|
| SRVC (srvx) | `canary-srvc-red` | `genuinely_red`, `pass: true` | runner `vitest@4.1.10` via `<reportFile>`, `new_tsc_errors` 0, 1 failure attributed to the ADDED test, `prebuild_ms` 1582-1633, `toolchain_ms` 4474-4707 |
| SRVC (srvx) | `canary-srvc-compile` | `compile_error`, `pass: false` | 4 NEW tsc errors against a clean post-prebuild baseline |
| NGXA (ngx-layout) | not built | n/a | blocked before fixtures -- see below |

The four existing GRC canaries are unchanged and still green (`genuinely_red`, `no_tests`,
`compile_error`, `false_green`).

The SRVC red canary was measured standalone first, in a detached throwaway at the pin:
`npx vitest run <spec> --typecheck.enabled=false --reporter=json --outputFile "<file>"` exits 1 in
1458 ms and emits a Jest-compatible report whose `assertionResults[0]` carries
`title` / `status: failed` / `AssertionError: expected [ 'b=2' ] to deeply equal [ 'a=1', 'b=2' ]`.

## The NGXA blocker, in full

The plan's Task 2 step 3 says: measure the runner in a throwaway at the pin, and if it does not
work, STOP and report because the plan needs revising rather than the classifier. That fired.

MEASURED 2026-07-26, detached throwaway at `daeb01f487b8f354199931489a9199d67d19182d` with a copied
toolchain:

1. The correct CLI flag is `--output-file` (dash-case). The builder schema names the option
   `outputFile`, and passing it that way is rejected outright: `Error: Unknown argument: outputFile`.
2. With `--output-file`, the report IS the Jest-compatible shape `classify()` reads
   (`numTotalTests`, `testResults[0].assertionResults[].title/status/failureMessages`). **The plan's
   stated blocker condition -- a non-Jest shape -- did NOT occur.**
3. But the run fails to COLLECT. `numTotalTests: 0`, `suite.status: failed`, message
   `Missing "./_private-utils" specifier in "@ngbracket/ngx-layout" package`. This happens for the
   library's OWN existing `layout-align.spec.ts`, not merely for a produced spec.
4. Cause, isolated decisively: swapping in ONE later file, `vitest-base.config.ts`, and changing
   nothing else makes the SAME worktree at the SAME pin run **exit 0, 33 passed**. That file adds
   `resolve.alias` entries for each `@ngbracket/ngx-layout/*` subpath. At the pin,
   `projects/libs/flex-layout/package.json` declares an `exports` map holding only `./mq` and
   `./_mq`, so self-referencing subpath imports cannot resolve.
5. That commit (`5b16200`) exists ONLY on the fork's own branch
   `LayZeeDK/test/migrate-custom-test-utilities`. `upstream/main` and `origin/main` are both exactly
   the pin. **So no upstream revision of this repo can run `ng test` for this library.**

TARGETS.md records "33 passed" as MEASURED. That measurement is real, but it was taken against the
fork's branch tip, not against the pin the document declares. This is exactly the class of error the
measure-first step exists to catch.

Two resolution routes both change what the eval measures (re-pin to an unpushed fork-only commit, or
arm the target's test config the way the GRC snapshot is armed); a third is to find a different
in-domain discriminator. RUN-GATE Step 1 lays out all three with their costs and does NOT pick one.

A separate hard fact for pricing, if it is ever unblocked: copying that checkout's `node_modules`
(1.6 GB, 186,366 files) from the D: Dev Drive into `os.tmpdir()` on C: took **482 s**, and removing
it took **123 s** -- about **10 minutes of grading overhead per run**, roughly 175x the kata's
~3.4 s. The plan estimated 20-30x from the file-count ratio; the real figure is ~6x worse because
the copy crosses volumes.

## Did the anchor arming actually work, including the UNVERIFIED assumption

**Yes, and the flagged assumption is now measured rather than documentation-derived.**

TARGETS.md flagged as UNVERIFIED: "that vitest 0.28 auto-writes the missing snapshot and PASSES
outside `--ci`". MEASURED 2026-07-26 in a detached throwaway with a copied toolchain, running the
approvals spec BARE -- no update flag, no CI flag -- under `vitest/0.28.5 win32-arm64 node-v24.18.0`:

- exit 0 in 2626 ms
- `Snapshots 2 written`, `Test Files 1 passed`, `Tests 2 passed`
- the snapshot appears at `test/vitest/__snapshots__/approvals.spec.ts.snap`, **11,552 bytes**,
  holding both `Gilded Rose Approval > should foo 1` and `> should thirtyDays 1`

So the documented behavior holds here. The corollary is recorded alongside it in the script header:
CI mode refuses to write NEW snapshots, so the arming step must never run under it.

Arming does not depend on that either way. `arm-anchor.mjs --arm` writes with the runner's explicit
`--update` flag and then proves the armed state with a plain re-run, which a written-but-wrong
snapshot would fail. End-to-end against a real throwaway:

- `--verify` on the UNARMED throwaway: exit 1, "NOT ARMED: ... is not tracked at HEAD"
- `--arm`: write 2441 ms, plain-re-run proof 4230 ms, committed 11,552 bytes as
  `8d51b96a4da3067894cb45dba99aa0da9c394d13`, printed the `E2E_APPLY_BASE` export line
- `--verify` again: exit 0, prints the armed SHA and the export line
- refuses the pristine kata root AND its `TypeScript/` subdir (both directions of the containment
  check), exit 1 each

`selfcheck-red` crux 10 pins both halves without needing a toolchain, and leaves the kata clean with
one worktree and no `red-*` branch.

## The wall-clock cost the new canaries add to the battery

MEASURED, two wall-clock runs of the whole battery on the final tree: **95.7 s and 116.4 s** (spread
is filesystem cache warmth). It was ~70 s with GRC alone, so the two SRVC canaries add roughly
25-45 s -- their toolchain copies are 4.5-8.0 s each plus a ~1.6 s prebuild each.

That is far below the plan's expectation, because the plan sized the battery around the ngx-layout
canaries (~10 min per grade x 3). Those were never built, so the battery is still comfortably
runnable. It is nonetheless run in the background per the plan, and RUN-GATE records both the
measured range and the reason the background rule must survive: adding ngx-layout would blow past
the Bash tool's 600000 ms timeout cap outright.

Per-target grading cost, measured:

| Target | Toolchain copy | Prebuild | node_modules |
|--------|----------------|----------|--------------|
| GRC | ~3.4 s | none | 7,610 files / 142.8 MB |
| SRVC | 4.5-8.0 s | 1.6 s warm, 12.2 s cold | 12,855 files / 170.8 MB |
| NGXA (blocked) | 482 s copy + 123 s remove | none | 186,366 files / 1.6 GB |

## Deviations from the plan, and why

1. **Task 2 (ngx-layout) NOT delivered -- commit 3 of 6 does not exist.** Blocked as above. The
   plan's own instruction is to stop and report; the resolution is a target-selection decision. Not
   auto-resolved, per the trap-quadrant rule (HIGH impact -- it freezes the primary discriminator's
   pin and what the eval measures; NOT-HIGH confidence -- the plan's premise is falsified).

2. **Task 2's generic selfcheck machinery moved into Task 3's commit.** The plan assigned the crux-2
   suite loop, the poisoned-prompt half, and the crux-7 parameterisation to the ngx-layout commit,
   with Task 3 only registering fixtures. Since that commit does not exist and Task 3 depends on the
   machinery, it landed in `748bd97`. It is target-agnostic, so nothing about it is ngx-layout
   specific.

3. **`prompt_forbidden_tokens` added to the GRC target** (also in `748bd97`), which the plan did not
   list among Task 3's files. Crux 2's loop asserts the list in both directions for EVERY suite, and
   the plan requires an empty list to FAIL the crux, so GRC needed one or the loop would have had a
   silent exemption.

4. **`forbiddenTokensIn` lives in `selfcheck-red.mjs`, not `grade-red.mjs`.** The plan required a
   pure exported helper so it could be driven in both directions; it is exported and its
   bidirectional proof sits next to it. Keeping it out of `grade-red.mjs` kept that file out of
   Task 3's commit boundary.

5. **`arm-anchor.mjs` compares REALPATHS, not raw strings.** Not in the plan; forced by measurement.
   `os.tmpdir()` returns the 8.3 SHORT Windows form while git reports its toplevel LONG, so the
   first `--verify` refused a perfectly valid throwaway. String comparison would ALSO have let a
   short-form path slip past the pristine-checkout containment check, so this is a strengthening,
   not a workaround.

6. **`gitOrFail`'s hardcoded `[crux 9]` prefix moved to its call sites.** It is now shared with
   crux 10, and a hardcoded prefix would have attributed one crux's git failure to the other.

7. **The SRVC canary imports `srvx/node`, not the bare `srvx` root.** The plan said "the package's
   public entry point". The bare root is aliased for the runner by `vitest.config.mjs` using
   `new URL(...).pathname`, which yields a leading-slash path and does not resolve on Windows --
   measured: `Cannot find package 'srvx'`. The subpath resolves through the package `exports` to the
   built output, so the prebuild covers BOTH the typecheck and the runtime, which is strictly more
   of what the plan wanted from that fixture.

8. **The `<reportFile>` no-collect direction is proved for stdout runners only.** The plan made an
   NGXA `canary-ngxa-nocollect` REQUIRED precisely to prove that branch through a wrapped runner. It
   was not built, and srvx has no outside-every-collection-root case. Recorded as an open residual
   in RUN-GATE with the instruction to inspect rather than loosen `parseRunnerReport`.

## Anti-regression: every new capability has a check that fails without it

Each was proved by comparing pre-fix and post-fix logic on identical inputs, not asserted.

| Capability | Discriminating check | Proof |
|------------|----------------------|-------|
| `<reportFile>` report source | SRVC red canary + pure `substituteRunnerCmd` assertions | canary is `genuinely_red` only via the file; the pure assertions fail if the forward-slash normalisation is removed |
| `typecheck.prebuild` | SRVC red canary | measured both ways on identical inputs: unbuilt, the same spec adds 2 NEW errors and grades `compile_error`; built, 0 |
| `typecheck.args` per target | SRVC compile canary | 4 NEW errors under this target's own args |
| `runner_path_base` | pure `relativeToBase` assertions | includes a segment-exactness case (`flexbox` is not stripped by a `flex` base) |
| `prompt_forbidden_tokens` | crux 2 poisoned prompt | real prompt clean AND a case-flipped token caught; an empty list fails the crux |
| Multi-suite tabulation | two-suite temp fixture tree | measured on one tree: the pre-change single-suite walk finds 1 run, the new walk finds 2 |
| Cell-key collision guard | third temp suite reusing a target id | throws, naming both suite dirs |
| `requireExplicitApplyBase` | crux 10 | `gradeRun` throws naming the variable when unset; grades normally when set |
| `E2E_APPLY_BASE` restore | SRVC canary asserts `apply_base` == its own pin | leak simulated: the grade still returned `genuinely_red` and `apply_base` was the ONLY differing field |
| Anchor arming | crux 10 | `--verify` fails unarmed, passes armed |
| No lz-refactor regression | `selfcheck-code-review.mjs`, crux 6, `run-e2e.mjs` byte-identical | all green; `run-e2e.mjs` has zero files in the task diff |

No flag was added anywhere to disable a guard for testing.

## Closing attestation

All seven verification commands exit 0 on the merged tree, with nothing edited to make them pass:

```
grade-red.mjs --selfcheck                 EXIT=0
tabulate-mechanical-red.mjs --selfcheck   EXIT=0
merge-judge.mjs --selfcheck               EXIT=0
selfcheck-red.mjs                         EXIT=0  (95.7 s)
check-evals.mjs                           EXIT=0
lz-refactor e2e-nx/selfcheck-code-review  EXIT=0
claude plugin validate .                  Validation passed
```

Borrowed repos, all three READ-ONLY and verified after the last run:

| Repo | `status --porcelain` | Worktrees | New named branch | Other |
|------|----------------------|-----------|------------------|-------|
| GildedRose-Refactoring-Kata | empty | 1 (`main`) | none (`red-*` glob empty) | `TypeScript/node_modules` = 308 entries |
| h3js/srvx | empty | 1 (detached at the pin) | none | the 4 untracked leftovers deleted as planned |
| ngbracket__ngx-layout | empty | 1 | none | measurement worktree + 1.6 GB toolchain copy removed |

Scope and hygiene:

- the task diff touches ONLY `.claude/skills/lz-red-workspace/**` (13 files); `plugins/lz-tdd` and
  `run-e2e.mjs` have zero files in it, so `run-e2e.mjs` is byte-identical as D-2 requires
- ASCII-only across all 14 touched files; email allowlist-inversion clean (the only email-shaped
  token present is the maintainer's approved public contact)
- no `results/` or `node_modules` artifact staged from either suite dir
- **zero metered spend**: no `claude -p`, no eval fan-out, no `run-e2e.mjs` outside `--dry-run`

## HALT

The metered round stays gated. Before it can be scoped, the user needs to decide the ngx-layout
question in RUN-GATE Step 1 -- or accept a two-target round on the understanding that a tie will not
be interpretable.
