# 260726 -- Relocate the RED grading worktree to the source repo's own volume

Recorded by the orchestrator: the executing agent was blocked by the harness from writing `.md`
files, so its report is transcribed here.

Commits: `59823b5` (trap fix, landed FIRST), `06c1567` (the relocation), `fbdd126` (RUN-GATE cost
table corrected). Merge `bb52011`.

## Headline -- THE STATED JUSTIFICATION WAS FALSIFIED BY MEASUREMENT

The change was requested on the premise that the per-grade toolchain copy is slow BECAUSE it crosses
volumes, citing 482 s for ngx-layout. Measured today, same tree, same session, one destination
straight after the other:

| Destination | Copy | Remove | Total |
|-------------|------|--------|-------|
| `os.tmpdir()` on C: (cross-volume) | 741.5 s | 134.1 s | 875.6 s |
| `D:\.lz-red-grade-tmp` (intra-volume) | 531.4 s | 111.3 s | 642.7 s |

Worth **27%** -- real, but not the removal it was billed as. The intra-volume copy ALONE (531 s)
still exceeds the 482 s figure the change was justified by. **The cost is dominated by FILE COUNT,
not by the volume boundary.** Nine grades of that target go from ~2.2 h to ~1.6 h of pure copying,
which does not make it affordable.

**Baseline drift caught, and it matters methodologically:** the same cross-volume copy measured 482 s
on 2026-07-25 and 741 s on 2026-07-26. Comparing across sessions would have concluded the relocation
made things WORSE. Only the same-session A/B is sound. Any future copy-cost claim must be measured
that way.

On the two targets actually in the corpus the relocation is close to nothing:

| Target | Files / size | Before (C:) | After (D:) |
|--------|--------------|-------------|------------|
| Gilded Rose kata | 7,610 / 142.8 MB | 4.06 s copy, 1.23 s rm | 3.86 s copy, 1.03 s rm |
| srvx | 12,855 / 170.8 MB | 6.70 s copy, 2.03 s rm | 6.89 s copy, 1.62 s rm |
| ngx-layout | 186,366 / 1.6 GB | 741.5 s copy, 134.1 s rm | 531.4 s copy, 111.3 s rm |

Copy is a TIE within noise on the small targets (srvx marginally SLOWER on D:); remove is 15-20%
faster; only the 186k-file tree shows a material copy difference. Battery wall clock ranges overlap
completely (before 113.5/143.7 s; after 107.5/115.4/153.4 s) -- not evidence either way, and
RUN-GATE now says so.

## What the change is actually worth

Not speed. The grading scratch location is now DERIVED PER TARGET, OVERRIDABLE, and LOUD when it
cannot be honoured -- instead of being silently whatever volume the OS profile happens to sit on.

`resolveGradeTmpDir(gitRoot)`, called once by `gradeRun`:
1. `$LZ_RED_GRADE_TMPDIR` when the operator sets it;
2. `<target repo's volume root>/.lz-red-grade-tmp`, derived via `path.parse(path.resolve(gitRoot)).root`
   -- never a hardcoded drive;
3. `os.tmpdir()` as last resort.

A candidate is REJECTED if it is inside the target checkout or cannot be created. Landing off the
target's volume emits a `console.error` naming the override. Volume identity is `fs.statSync(p).dev`
(volume serial on Windows, device id on POSIX) -- answering "will this copy cross a filesystem"
rather than using a drive-letter proxy. Verified: C: `1849118894`, D: `4171565527`.

## A real bug found while writing the containment check

`a.startsWith(b + path.sep)` is WRONG when `b` is a volume root. `path.resolve('D:\\')` already
carries its separator, so appending another builds `D:\\`, which nothing starts with -- the naive
form answers "not inside" for EVERY path on the volume, and the one candidate that MUST be rejected
(scratch at the root of a checkout that IS that root) would have been accepted. `isWithin` handles
the trailing separator.

## The vacuity trap, resolved

Two guards were exercised only INCIDENTALLY, because `os.tmpdir()` returns the 8.3 SHORT form here
(`C:\Users\LARSGY~1\...`) while git reports its toplevel LONG. Neither was strictly vacuous before,
and neither is after -- but both were one environment change away from decoration, and the relocation
is exactly that change.

- `resolveArmCwd()`'s path-form refusal: was covered by a synthetic POSIX-ish pair independent of
  `os.tmpdir()`. Added an EXPLICIT 8.3-shaped case so the shape the guard exists for is named.
- `arm-anchor.mjs`'s realpath identity: had NO unit-level coverage, only end-to-end via crux 10's
  `os.tmpdir()` throwaway -- i.e. by local accident. Added a SYNTHETIC junction alias in crux 9 (a
  junction and its target are two strings naming one directory, on any machine).

Both new assertions were checked to DISCRIMINATE on identical inputs:

```
alias check, realpath rule     : {"same":true,"nested":true,"unrelated":false}
alias check, STRING-ONLY rule  : {"same":false,"nested":false,"unrelated":false}

8.3 short-form pair, WITH the guard   : threw
8.3 short-form pair, WITHOUT the guard: C:\Users\LARSGY~1\AppData\Local\LONGUS~1\repo\TypeScript
```

That second line is the damage in full: unguarded, the grade cwd resolves OUTSIDE the worktree --
putting `git apply`, the runner spawn on model-authored code, and teardown's recursive delete
somewhere that is neither the worktree nor the target.

## Anti-regression

No guard-disabling flag was added. `red-grade.json` now records `worktree` -- the throwaway the grade
actually ran in. It is gone by the time anyone reads it, which is precisely why recording it is the
only way to prove afterwards where the grade ran.

- crux 7 (six real canaries, both suites): `assertWorktreeOnTargetVolume` fails if the recorded
  worktree's parent is not on the borrowed repo's volume.
- crux 9: same assertion against the STAND-IN's volume. The stand-in stays on C: while the borrowed
  repos are on D:, so cruxes 7 and 9 cover TWO DIFFERENT volumes -- a resolver pinned to either fails.
- crux 11 (new, pure): derivation on-volume and outside the checkout; a checkout AT a volume root is
  REFUSED; the override is honoured; and the off-volume warning fires EXACTLY when the result is
  off-volume (a biconditional, so deleting the log line fails it either way round).

The stranded-worktree scan now covers BOTH locations. An `os.tmpdir()`-only scan could no longer see
a grading worktree at all, so it would have passed by construction -- a check that cannot fail is not
a check.

## Deliberately unchanged

Three `os.tmpdir()` uses stay, justified in code: `diffTargetPaths()`'s neutral cwd for
`git apply --numstat` (creates nothing, only needs a cwd that is not a git repo, runs before anything
exists); and `gradeFixture`'s `--outputFile` plus `gradeRun`'s `<reportFile>` (ONE small JSON file
each, not a tree, and `os.tmpdir()` is the location most certain to be writable for a path handed to
a third-party runner).

Containment untouched: per-grade disposable copy, teardown ordering, `escapingLinks()`,
`resolveArmCwd()`, `assertSafeDiffPaths()`, SIGINT/SIGTERM cleanup. The resolver ADDS a layer --
scratch may never be created inside a borrowed checkout.

## Tradeoff to know about

The Dev Drive has LESS headroom than the profile volume: **29 GB free on D: vs 86 GB on C:**. A
per-grade copy of a large target is held for the whole grade, so this moves a 1.6 GB transient onto
the tighter volume. That is what `$LZ_RED_GRADE_TMPDIR` exists for.

`<volume root>\.lz-red-grade-tmp` is created on demand and left in place (empty) between runs; only
the `red-wt-*` worktrees inside it are per-grade.

## The lazier alternative, named by the agent

Since the speed premise did not hold, the smallest change delivering everything the relocation
actually delivers is JUST THE ENV OVERRIDE: read `$LZ_RED_GRADE_TMPDIR`, default to `os.tmpdir()` --
roughly 5 lines, no derivation, no volume comparison, no crux 11. The derived version was built
because it was what was asked for, and because a default that is right without configuration beats
one requiring the operator to know a variable exists -- especially where getting it wrong costs
minutes per grade and looks like a hang. Deleting the derivation and keeping the override is a clean
subtraction if the extra surface is unwanted.

## Residual

**ReFS block cloning is now the only untried lever on this cost.** ReFS supports copy-on-write clones
and `fs.cpSync` does not use them, so a `FSCTL_DUPLICATE_EXTENTS` path could plausibly collapse the
copy to near-zero on the Dev Drive. Out of scope here, unmeasured, recorded in RUN-GATE's residual list.
