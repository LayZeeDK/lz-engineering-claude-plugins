---
task: quick-260725-63f
artifact: WRITEPATH-FIX
date: 2026-07-25
closes: gsd-verifier W2 (STATE.md "Open before the Phase-21 metered run", item 1)
threat_id: T-63f-05
commits: 3
spend: none (zero metered commands; no claude -p, no fan-out)
kata_end_state: clean status, exactly 1 worktree, only main, node_modules 308 entries, typescript 4.9.5
scope: .claude/skills/lz-red-workspace/** only; plugins/lz-tdd = 0 files, 0 dependencies added
status: complete
---

# 260725-63f -- Closing the RUNTIME write path on the RED apply instrument

The verifier's W2: `gradeRun` linked the grading worktree's `node_modules` to the borrowed kata's
REAL tree with a Windows junction, then spawned the target's test runner on the MODEL-AUTHORED spec
while that junction was up. `assertSafeDiffPaths` (CR-01) scans DECLARED PATHS ONLY, never hunk
CONTENT, so a patch declaring a perfectly legitimate `TypeScript/test/vitest/evil.spec.ts` whose
body calls `fs.rmSync('node_modules/typescript', { recursive: true })` was ACCEPTED -- and executing
it deleted through the junction into a third-party repo we do not own.

It is closed structurally: the grading worktree's toolchain is now a per-grade DISPOSABLE COPY.
Reproduced end to end, discrimination measured against the pre-fix module, and pinned by a new
offline crux. The kata was never the probe target.

Three atomic commits, each verified green before it landed. Zero metered commands.

```
bbc579f fix:  contain the runtime write path into the borrowed repo
36ca844 docs: name the runtime write path in the RUN-GATE residual list
9509aa6 docs: stop the comments claiming a toolchain junction still exists
```

---

## The mechanism I shipped

`gradeRun` copies the target's `node_modules` into the grading worktree once per grade
(`provisionToolchain`), instead of linking it. Everything the produced spec can reach through a
relative path -- the apply, both differential typechecks, the runner spawn, teardown -- is now
inside a throwaway under `os.tmpdir()`. The borrowed repo is READ once, to make the copy, and is
never a write target.

Three supporting pieces:

- **`escapingLinks(root)`** rejects a copy that is not self-contained. `fs.cpSync` copies a symlink
  AS a symlink, so a source tree carrying one would hand the copy a path straight back out and
  silently reopen the hole. The kata's tree has none (measured: 0 links in 7610 files) but an npm
  workspaces or `file:` target can, and a structural containment must not depend on which target
  happens to be configured.
- **`resolveArmCwd(worktree, gitRoot, repo)`** -- a second hazard I found while building the probe,
  described below.
- **`toolchain_ms`** in `red-grade.json`, and one extra CLI line, so the containment's per-grade
  cost is auditable in every artifact instead of being a mystery pause.

`assertSafeDiffPaths` is UNTOUCHED. It still rejects such a patch outright and crux 8 still pins all
five shapes. The copy replaces the old `unlinkToolchain()` / `linkToolchain()` bracket around
`git apply` and is strictly stronger than it was: the bracket covered the apply only, the copy also
covers the runner spawn -- the direction the bracket never reached. Teardown still removes the
toolchain BEFORE `git worktree remove --force`.

`runner_version` stays truthful: it is read from `<armCwd>/node_modules/<runner>/package.json`,
which is now the copy of the target's tree, so crux 7 still records the kata's own `vitest@0.28.5`
rather than the workspace's pinned 4.1.10 or the `unknown` sentinel.

---

## The choice, with the measurements

The brief expected per-grade copying to be too slow ("the tree is 151M"). It is not. Measured on
this machine against the kata's real tree (7610 files, 142.8 MB, 311 top-level entries):

| Option | Measured cost | Contains a DELETE | Contains a MODIFY | Verdict |
|--------|---------------|-------------------|-------------------|---------|
| **Per-grade disposable copy (SHIPPED)** | 2.5-2.8 s copy + ~0.7 s remove = **~3.5 s per grade**, ~30 s across a 9-run fan-out | yes | yes | **chosen** |
| Shared cache under `os.tmpdir()` + junction | ~2.7 s once, then ~0 | yes (rebuildable) | **NO across grades** | rejected |
| Per-worktree `npm ci` | **6.0 s** warm, exit 0, 310 entries | yes | yes | rejected |
| Hardlink farm | not measured | yes | **NO** | rejected on the brief's own reasoning |
| Hunk-content scan | ~0 | heuristic only | heuristic only | rejected as a mechanism |

**Why not the (preferred-in-the-brief) shared cache.** At 2.7 s a copy, the cache buys about 30 s
across a fan-out that costs real money and many minutes -- and charges for it with a mutable tree
that every grade writes through. A spec that damages the cache poisons every LATER grade in the
round: delete `typescript` and the next grade silently loses its differential; modify a file inside
it and the next grade is measured against a compiler nobody inspected. Detecting that needs a stamp
plus a freshness check, and a cheap check (top-level entry names) catches deletion but NOT deep
modification, so the honest version of the cache ships with a residual the copy simply does not
have. The copy also needs no stamp, no freshness logic, no rebuild path, and no first-build
surprise. Simpler AND stronger for ~30 s: not a close call once the number was measured.

**Why not `npm ci` per worktree.** Twice the cost warm, and worse on two axes that matter more than
seconds: it puts a registry dependency inside a deterministic grading gate (a cold cache or an
outage turns a grade into a network flake), and it EXECUTES third-party postinstall scripts -- the
measured run printed `npm warn allow-scripts esbuild@0.18.20 (postinstall: node install.js)`. Adding
arbitrary install-time code execution to close a code-execution write path is moving the problem.

**Why not hardlinks.** Agreed with the brief and not attempted. A hardlink is a second name for the
same inode: `unlink` through it removes only that name, but `writeFileSync` through it mutates the
ORIGINAL file's content. It contains deletion and not modification, which is half a containment and
therefore none. No hardlinks are used anywhere in this change.

**Why a content scan is not the mechanism.** The runner executes arbitrary model-authored code. Any
`fs` / `child_process` call can be spelled `globalThis[atob('cmVxdWlyZQ==')]` or reached through a
transitive import, so a hunk-body scan is a heuristic that a determined spec walks past and an
ordinary spec can trip by accident. I did not add one, not even as defence in depth: a heuristic
sitting next to a structural guarantee mostly teaches readers to trust the wrong one.

**Cost accepted, and where it lands.** `selfcheck-red` goes from 32.4 s to 71.4 s: +13 s for crux
7's three grades now each copying the kata tree, +26 s for the new crux 9 (which builds a stand-in
repo, copies a toolchain twice and runs a real vitest). Peak disk is one ~143 MB copy at a time,
since grades are sequential. RUN-GATE.md now states all of this, and the per-grade figure is
recorded in every `red-grade.json`.

---

## A second write path, found while building the probe

The first run of the reproduction failed with `cpSync: src and dest cannot be the same`. The cause
is not the copy -- it is that `armCwd` had resolved to the SOURCE CHECKOUT.

`rel` is `path.relative(gitRoot, repo)` over two strings that must agree on FORM. git reports its
toplevel in long Windows form; `os.tmpdir()` on this machine hands back an 8.3 SHORT path
(`C:\Users\LARSGY~1\...`). Mixing them makes `path.relative` emit an escaping `../..` chain, and
`path.join(worktree, thatChain)` normalises straight back onto the repo. Everything downstream --
`git apply`, the toolchain provisioning, the runner spawn on the model-authored spec, teardown's
recursive delete -- would then run INSIDE the borrowed checkout. That is the same damage as the
junction, reached by arithmetic instead of by a link, and it is worse: it is not confined to
`node_modules/`.

It was reachable only through a hand-written `suite.json`, and the shipped kata suite uses git's own
long path, so it was never live. But it is one line of config away, Step 1 of RUN-GATE invites the
operator to nominate a NEW target, and both the old junction (`symlinkSync` EEXIST) and the new copy
(`cpSync` src===dest) only caught it by accident. `resolveArmCwd` now refuses it explicitly, before
the worktree exists, with an error that names the fix.

I folded this into the same commit rather than splitting it, and the reason is causal rather than
convenience: with `armCwd === repo` the "disposable copy" IS the borrowed tree, so guarding the path
arithmetic is a precondition for the copy meaning anything at all. Splitting patch-surgery across a
containment file to satisfy a granularity rule was the worse trade.

---

## Anti-regression: `selfcheck-red` crux 9

Two blocks, both new.

**`checkRuntimeWriteContainment()`** -- the verifier's exact exploit shape, graded FOR REAL:

- a throwaway git repo under `os.tmpdir()`, built to the kata's shape (a `TypeScript/` subdir, so
  `rel` is exercised), with the workspace's own toolchain copied in as its `node_modules`, plus a
  `SENTINEL.txt` of known content and a `victim/` package;
- a fabricated runDir whose `diff.patch` declares ONE perfectly legitimate path,
  `TypeScript/test/vitest/conjured.spec.ts`, and whose BODY deletes `victim/` and overwrites
  `SENTINEL.txt` through `../../node_modules/` before asserting;
- assertions: `gradeRun` returned a verdict; the spec's own assertion marker appears in
  `failure_excerpt` (so the containment cannot be vacuously "passed" by a spec that never ran); the
  stand-in's `SENTINEL.txt` is byte-intact; `victim/` still exists; no worktree stranded.

The kata is NEVER the probe target. A check that can only discriminate by damaging a borrowed repo
is not a check worth having -- and shipping one would mean every future revert of this fix destroys
the kata on the next battery run.

**`checkContainmentInvariants()`** -- pure, offline, never SKIPs: `escapingLinks` flags an escaping
junction and NOT a contained one; `resolveArmCwd` returns the right `rel`/`armCwd` for a subdir
target and for a repo that IS its git root, and throws on a path-form mismatch.

### Discrimination, measured

No flag, no env var and no escape hatch was added to either version -- the previous pass was
correctly refused exactly that, and it would be a worse thing to ship than the bug. Instead the
BYTE-IDENTICAL probe was replayed through the pre-fix module loaded out of git
(`git show HEAD:.claude/skills/lz-red-workspace/grade-red.mjs`), against a fresh stand-in each time:

| module | verdict | spec executed | stand-in `SENTINEL.txt` | stand-in `victim/` | result |
|--------|---------|---------------|-------------------------|--------------------|--------|
| pre-fix (junction) | `genuinely_red` | yes | `"PWNED"` | DELETED | **BREACHED** |
| shipped (disposable copy) | `genuinely_red` | yes | `"DO-NOT-TOUCH-ME"` | present | **CONTAINED** |

Same verdict either way, which is the point: the gate's grading behaviour is unchanged and only the
containment differs. Crux 9 asserts the CONTAINED row, so it fails on the pre-fix module and passes
on this one.

---

## What is NOT closed, stated rather than implied

**A produced spec can still write to an ABSOLUTE path.** The runner executes arbitrary
model-authored code; nothing in-process can stop
`fs.writeFileSync('D:/.../GildedRose-Refactoring-Kata/...', ...)`. Containing that needs a sandbox,
which this instrument does not have and which is well outside this task.

The distinction that makes the fix worth having anyway: the junction turned an ORDINARY RELATIVE
path -- `node_modules/...`, which a test-writing model might touch by accident during cleanup --
into a reach into the kata. An absolute path into a specific third-party checkout has to be typed on
purpose. The accidental route is closed; the deliberate one is named, and RUN-GATE.md now tells the
operator to check the kata after each metered round instead of assuming.

Two smaller residuals, also named in RUN-GATE:

- The copy is per-grade, so nothing can be poisoned across grades -- but a spec CAN corrupt its own
  grade's toolchain mid-run (e.g. delete `typescript` before the second differential typecheck).
  That produces a nonsense verdict for that run only, and the vacuous-differential guard already
  fails closed on the config-level abort that follows.
- `escapingLinks` proves no LINK escapes the copy. It does not prove the copy is byte-identical to
  the source; `cpSync` is trusted for that.

---

## RUN-GATE.md changes

The residual list did not name this runtime path at all -- it said only that a diff TOUCHING
`node_modules` is rejected, which a reader would fairly take to mean the borrowed tree is
unreachable from a grade. That is the same shape of half-truth SG-04 already had to correct once in
`targets.json`, so it is fixed in all three places:

- **New residual bullet**: grading executes the produced spec; why a declared-path check cannot see
  it; that a per-grade copy is what closes it; the stand-in measurement both ways.
- **New residual bullet**: the absolute-path direction that the copy does NOT close, why it is much
  less likely than the junction case was, and the "check the kata after each round" instruction.
- **New residual bullet**: operator-visible cost, with all the measured figures and why there is no
  shared cache.
- **New residual bullet**: write a nominated target's `suite.json` `repo` in git's own path form,
  and what the refusal means if you do not.
- **Step 2** gains the crux 9 description and its SKIP remedy; the header block states the battery
  now takes ~70 s and why, so the copy is not read as a hang.
- **Step 3a2**'s parenthetical claimed the grader's write path was "closed separately by
  assertSafeDiffPaths". That was half of it. It now names both directions, and says why an install
  rather than a copy remains right for the APPLY checkout: the model may legitimately add a
  dependency during its turn.
- `targets.json`'s `coverage_note` gets the same correction inline.

A third commit swept six comments that still described the junction in the present tense (including
`assertSafeDiffPaths`' own header and its rejection message). A stale comment on a containment
boundary is the failure mode, not a tidiness issue. While there, crux 7's SIGINT/SIGTERM assertion
now says in place that it does NOT exercise the signal path, matching the IM-04 coverage claim the
verifier made REVIEW-FIX withdraw, instead of leaving a reader to infer coverage that is not there.

---

## Verification

All six offline commands exit 0 against the final tree:

| # | Command | Exit |
|---|---------|------|
| 1 | `node grade-red.mjs --selfcheck` | 0 |
| 2 | `node tabulate-mechanical-red.mjs --selfcheck` | 0 |
| 3 | `node merge-judge.mjs --selfcheck` | 0 |
| 4 | `node selfcheck-red.mjs` | 0 (17 lines; crux 4 SKIP -- no transcript, expected) |
| 5 | `node check-evals.mjs` | 0 |
| 6 | `claude plugin validate .` | 0 |

New battery lines:

```
[crux 9] containment invariants OK (escapingLinks flags the escaping link only; resolveArmCwd
         keeps the grade inside the worktree and refuses a path-form mismatch)
[crux 9] runtime write path contained OK (a legit-path spec whose body deletes + overwrites
         through node_modules ran to its assertion -> genuinely_red; stand-in tree byte-intact,
         toolchain copied in 429 ms)
```

Crux 7 is unchanged and still reports `runner vitest@0.28.5` -- the kata's own version, read out of
the copy, so the `runner_version` pin survives the mechanism change.

**Bisect safety.** Each of the three commits was verified before it landed. `bbc579f` is the tree
the full six-command battery ran green against. `36ca844` changes `RUN-GATE.md` only -- verified by
`git diff --stat bbc579f 36ca844 -- '*.mjs'` returning nothing, and no gate reads that file
(`git grep -l RUN-GATE -- ':!*.md'` matches `grade-red.mjs` in comments only). `9509aa6` was run
green across all six before committing. No commit lands a knowingly-red state; no empty commits;
one concern each.

**Borrowed kata, after every probe and every battery run:**

```
git status --porcelain    (empty)                                    clean
git worktree list         GildedRose-Refactoring-Kata 3e0085b [main]  exactly one
git branch --list         * main                                     no strays
node_modules entries      308                                        unchanged
typescript                4.9.5                                      resolvable
```

No `red-wt-*`, `red-canary-*`, `red-t63f05-*`, `red-links-*` or `measure-*` directory survives under
the temp dir.

**Fences:**

| Fence | Result |
|-------|--------|
| Scope: only `.claude/skills/lz-red-workspace/**` | PASS (4 files, all under it) |
| `plugins/lz-tdd` untouched, no dependency added | PASS (`git diff --name-only <base>..HEAD -- plugins/` -> 0) |
| Zero spend | PASS (no `claude -p`, no fan-out, no metered command) |
| Exploit reproduced against a throwaway only | PASS (kata never a probe target; verified intact after each run) |
| Anti-regression discriminates | PASS (table above; pre-fix BREACHED, shipped CONTAINED) |
| No flag/env that disables the guard | PASS (`rg 'process\.env' grade-red.mjs` -> the 2 pre-existing reads) |
| Bisect-safe atomic commits | PASS (3 commits, each green before landing) |
| ASCII-only, files and commit messages | PASS |
| Email allowlist-inversion | PASS (only the approved public contact; the scan encodes no forbidden value) |
| Author/committer identity | PASS (approved public contact on all 3 commits) |
| No `git add .` / `-A` / `-u` | PASS (named paths only) |
| `git grep` / `rg` only | PASS |

---

## What I would look at next

- **The absolute-path residual needs a decision, not a fix here.** If the metered rounds ever move
  to a machine where the kata is not worth risking on trust, the answer is a container for the
  grade, not more guards inside the process. Worth costing out before a second, non-kata target is
  vendored -- a repo we do not own AND cannot cheaply restore is a different risk than this one.
- **IM-03 and IM-04 remain fix-without-regression-test** (STATE.md's second open item). This change
  makes both LESS load-bearing rather than more -- a failed teardown now strands a throwaway rather
  than a live junction, and the signal handler is disk hygiene rather than containment -- so the
  case for building a fault-injection seam just for them is weaker than it was. Both comments now
  say so in place.
- **The stand-in repo builder in crux 9 is a reusable seam.** It is the first thing in this workspace
  that grades a full `gradeRun` against a repo we own and can safely damage. If a future check needs
  to prove something destructive stays contained, extend it rather than reaching for the kata.

---

_Fix pass: 2026-07-25_
_Input: 260725-63f-VERIFICATION.md W2 / STATE.md "Open before the Phase-21 metered run", item 1_
