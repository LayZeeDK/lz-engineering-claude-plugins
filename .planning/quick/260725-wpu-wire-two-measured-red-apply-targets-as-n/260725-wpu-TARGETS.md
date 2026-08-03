# 260725-wpu -- Measured facts for the two new RED apply targets + the anchor arming

Everything below was MEASURED on this machine on 2026-07-25, not inferred. Treat it as the
authoritative input. Where something is explicitly flagged UNVERIFIED, verify it before relying on it.

Scope fence for the whole task: modify ONLY `.claude/skills/lz-red-workspace/**` and, where the
shared driver needs it, `.claude/skills/lz-refactor-workspace/e2e-nx/run-e2e.mjs`. NEVER touch
`plugins/lz-tdd/**`. Zero metered spend -- no `claude -p`, no eval fan-out. The three borrowed repos
are third-party and READ-ONLY.

---

## Target 1 -- ngbracket/ngx-layout (PRIMARY, in-domain discriminator)

**Pin:** `daeb01f487b8f354199931489a9199d67d19182d` (upstream `main`, 2026-07-20,
"Merge 22.x.x into main (conflicts resolved) (#119)").

**Where it is on disk:** `D:/projects/github/LayZeeDK/ngbracket__ngx-layout`. This is a fork, but
divergence from upstream is **ZERO**: `git rev-list --left-right --count upstream/main...origin/main`
= `0  0`, and the blob hashes of both target files are identical across `upstream/main`,
`origin/main` and `HEAD`:
- `layout-align.ts` -> `023e4c9c6b5d5d219b90b3158bb18fa2c0b07b9c`
- doc -> `276614c6e27d45b32c4e186de07ba15f370bb66e`
So the on-disk checkout is usable directly. Vitest is UPSTREAM, not a fork artifact
(`vitest ^4.1.8` + `@angular/build ^22.0.1`, no Karma).

**Runner (MEASURED):** Vitest 4.1.8 via `@angular/build:unit-test`.
```
npx ng test @ngbracket/ngx-layout --include "**/layout-align/layout-align.spec.ts"
  -> Test Files 1 passed, Tests 33 passed, Duration 1.50s, real 0m6.558s
```
`--include` typechecks the lib but runs only the one file.

**Target file:** `projects/libs/flex-layout/flex/layout-align/layout-align.ts`,
`LayoutAlignStyleBuilder.buildStyles`, directive `[fxLayoutAlign]`.

**Declared contract:** `projects/apps/docs/documentation/docs/fx-flex/fxLayoutAlign-API.md`, line 46.
NOTE two corrections to earlier notes: the path `docs/fx-flex/fxLayoutAlign-API.md` does NOT exist
and never has; and the doc claims BOTH `align-items: space-evenly` AND `align-content: space-evenly`
(the `align-items` half is invalid CSS regardless -- rows 44/45 are wrong the same way; row 46 is the
only one with no code path at all).

**The gap:** the MAIN-axis switch has `case 'space-evenly'`. The CROSS-axis switch does not -- it
falls through to `default:` -> `stretch`, byte-identical to the invalid-value path. Wired siblings in
the SAME switch: `space-between`, `space-around`. The cross-axis describe block covers
`start start / center / end / space-between / space-around / baseline / invalid / stretch` and has
NO `start space-evenly` case.

**MEASURED red/green:**
- Disciplined, direct style lookup -> `AssertionError: expected 'stretch' to be 'space-evenly'`
- Disciplined, house-style helper -> `AssertionError: expected false to be true`
- Control (`space-around`) -> PASSES
- Both are ASSERTION-red, not throw-red. Run: `Tests 2 failed | 34 passed (36)`, real 0m6.602s.

**GRADING AXIS THIS HANDS US FOR FREE:** the house helper `expectElementStyles` collapses to a
boolean (`layout-align.spec.ts:83  expect(allStylesMatch).toBe(expected)`), so it yields the opaque
`expected false to be true`. A direct `lookupStyle` assertion yields the diagnostic
`expected 'stretch' to be 'space-evenly'`. Both are legitimately red; only one is a good test.

**Armed suite:** YES but via a helper -- `expect(` appears literally ONCE in 916 lines, at
`layout-align.spec.ts:83`, with 50 `expectElementStyles` call sites. Zero snapshots.

**COMMITTED FALSE GREEN (a live trap, not planted):** `layout-align.spec.ts:240-256` is the ONLY
`space-evenly` test in the file, it is main-axis, and its single assertion sits inside
`if (platform.SAFARI)` which is FALSE under jsdom -- so it executes zero assertions and always
passes. `space-evenly` is effectively untested on both axes. A model that "fixes" that test instead
of writing the cross-axis one is a clean coach-don't-drive failure signal.

**tsc baseline:** CLEAN. `npx tsc --noEmit -p projects/libs/flex-layout/tsconfig.spec.json` -> empty
output, 2.49 s.

**Contamination: HIGH, and the flag is earned.** Not "flex-layout was popular" -- the SPECIFIC lines
are pre-fork Angular-team artifacts: main-axis `space-evenly` born 2017-09-07 (`df46d7a`, Burleson);
both switch blocks blame to 2018-11-13 (`9148e87`, CaerusKaru); the cross-axis extension that skipped
space-evenly is 2018-11-13 (`5e3ec0e`, Suau); the doc row is 2018-01-17 (`67e4bf5`). Fork point is
2023-01-24/28. Post-fork ngbracket edits to those switch bodies in 3.5 years are Prettier reflow with
ZERO semantic change. There is also a public discussion trail on this exact asymmetry
(angular/flex-layout #404/#405 2017, #841/#845 2018).
Why we accept it: contamination bites hardest when an eval asks the model to DISCOVER a defect. This
construction does not -- the prompt names the file and the written contract, and the axis is
coach-don't-drive-to-green. A model that already knows the fix is one line has a STRONGER pull to
just implement it, which is exactly the discipline under test.

**Project health:** 232 stars, last push 2026-07-20, release 22.0.1 (2026-07-20, not prerelease),
`@ngbracket/ngx-layout` on npm, MIT, not deprecated, 35,885 weekly downloads. Essentially one
maintainer, near-empty tracker -- so "no open issue about this gap" carries little signal.

---

## Target 2 -- h3js/srvx (out-of-domain control)

**Pin:** `55d90b39840a5bb7236e23c4e326ee4fc3842d57` (= `chore(release): v0.12.4`, the latest release;
it postdates merged node-adapter fixes #243/#263, so the bug is not stale).

**Where it is on disk:** `D:/projects/github/h3js/srvx` (cloned 2026-07-25).
CURRENT STATE -- untracked leftovers from the verification pass, deal with them deliberately:
`package-lock.json`, `test/scratch-disciplined.test.ts`, `test/scratch-undisciplined.test.ts`,
`test/scratch-undisciplined-v2.test.ts`. Tracked tree is byte-clean at the pin
(`git diff --stat` empty).

**Install (MEASURED):** `npm install` -> exit 0, 33 s, 478 packages. `--ignore-scripts` NOT needed.
arm64 bindings verified present AND executing: `@oxlint/binding-win32-arm64-msvc`,
`@oxfmt/binding-win32-arm64-msvc`, `@rolldown/binding-win32-arm64-msvc`. Repo ships
`pnpm-lock.yaml`, so npm resolved fresh and wrote a `package-lock.json` -- real resolution drift, no
failure. `vitest/4.1.10 win32-arm64 node-v24.18.0`.

**Target file:** `src/adapters/_node/send.ts`, `sendNodeResponse`, exported via
`src/adapters/node.ts:32`.

**The gap:** `_sendNodeResponse` builds `rawHeaders` from `webRes.headers` ONLY (lines 136-140) and
passes them to `nodeRes.writeHead`; it never merges headers already set via `nodeRes.setHeader`.
Node's `ServerResponse.writeHead` gives its own header argument precedence, so a `Set-Cookie` set by
earlier middleware is silently dropped. Upstream issue #144, maintainer-labelled `bug`, open since
2025-11-11.
**The bug is in BOTH paths:** the fast path `_toNodeResponse` (lines 116-133, used by srvx's own
`FastResponse`) passes `res.headers` to `writeHead` unmerged too. A model that patches only the slow
path leaves `FastResponse` broken -- a root-cause-vs-symptom discriminator.

**MEASURED red/green:**
- Disciplined (real `createServer` + real `fetch`, assert `response.headers.getSetCookie()`) ->
  `AssertionError: expected [ 'b=2' ] to deeply equal [ 'a=1', 'b=2' ]`. ASSERTION-red, exit 1,
  1792 ms. No exception escapes; the server responds 200 and simply drops `a=1`.
- Undisciplined (object literal of `vi.fn()`s, assert `writeHead` called with the right args) ->
  PASSES, 1765 ms.

**THE STRONGEST PROPERTY MEASURED ANYWHERE IN THIS SEARCH:** the naive mock is green BEFORE AND AFTER
a correct fix -- it has ZERO diagnostic power, not merely a false green. The fabricated double never
implements `getHeaders`, so `nodeRes.getHeaders?.()` short-circuits and the merge branch is skipped
entirely. Verified by applying a real fix and re-running.
CAVEAT: a variant mock that DOES implement `getHeaders` is still green at the pin (discrimination
intact) but goes RED after a correct fix -- mock brittleness rather than bug detection. If a post-fix
signal is ever scored, decide deliberately which one.

**Command:** `npx vitest run <file> --typecheck.enabled=false`. The flag MATTERS --
`vitest.config.mjs` sets `typecheck: { enabled: true }`.

**Armed suite:** 1319 tests / 1234 passed / 82 skipped across 31 files, 14.27 s full run. Zero `.snap`
files anywhere. `git grep -n "sendNodeResponse" -- test/` returns NOTHING -- the function is
completely uncovered.

**TWO PRE-EXISTING ENVIRONMENTAL FAILURES on this machine (reproducible, not flakes):**
- `test/log.test.ts` -- da-DK locale renders time as `[22.04.21]`, regex expects `\d{1,2}:\d{2}:\d{2}`
- `test/cli.test.ts` -- `GetPortError: Timeout waiting for port ... after 100 retries`
A differential grade MUST diff against this baseline; do NOT require a green suite.

**tsc baseline -- important nuance:** at a fresh pin `npx tsc --noEmit --skipLibCheck` exits 1 with
13 errors, but ONLY because the `srvx` self-reference resolves through an unbuilt `dist/`
(`Cannot find module 'srvx'` x6 plus knock-on TS7006/TS18048/TS2578/TS2664). After
`npm run build` (obuild, 5.1 s) it exits 0, fully clean, and stays 0 with the scratch tests added.
`dist/` is gitignored.

**Node 24 confirmed:** `node -v` = v24.18.0; an isolated primitive check shows `writeHead` still
REPLACES rather than appends `set-cookie`, so the bug reproduces here.

**Contamination: LOW, with one caveat** -- a fix PR (#200, "node: preserve pre-existing Set-Cookie
headers in sendNodeResponse") exists and was CLOSED UNMERGED. The bug is genuinely live at the pin,
but a model that searches the web could find the attempt.

**Legitimacy gate: PASS.** First publish 2024-09-16, latest 0.12.4 (2026-07-22), 83 versions,
37,991,877 weekly downloads, MIT, not deprecated, 0 runtime deps, repo not archived/disabled/fork.

---

## Item 3 -- ARM the Gilded Rose anchor's approvals snapshot

**The problem being fixed:** `test/vitest/approvals.spec.ts` uses `toMatchSnapshot()` but NO snapshot
is committed (no `__snapshots__/`, no `.snap`). So the characterization net is LATENT, not armed: on
first run vitest WRITES the snapshot and passes. That made "characterize the legacy code first" a
defensible alternative answer, which cost us a scoreable result in pilot 3 (a model wrote a passing
characterization test with a coherent Feathers justification; graded `false_green`, correctly, but
the target had no single right answer).

**Precedent that arming is CORRECT, not merely convenient:** the kata's own sibling variant already
ships an armed snapshot for the identical `updateQuality` logic and the identical golden-master
driver -- `TypeScript-deno/test/__snapshots__/approvals_test.ts.snap`, 388 lines, COMMITTED (verified
via `git ls-files`). Arming the TypeScript variant brings it to parity with what the maintainer
already did elsewhere in the same repo.

**Where the arming must happen:** in the THROWAWAY checkout only. The harness already creates one
(RUN-GATE step 3a, `git worktree add --detach`) and gives it its own toolchain (step 3a2: copy the
untracked `package-lock.json`, then `npm ci` -- plain `npm ci` fails EUSAGE because the lockfile is
gitignored). Arming slots in as a new step in that same seam. The PRISTINE kata must NEVER be
touched: it must end git-clean, exactly ONE worktree entry, `TypeScript/node_modules` intact
(308 entries), and NO named branch (use `--detach`; a named branch on the borrowed repo was
correctly refused by the permission classifier earlier today).

**A detail that matters:** `test/vitest/__snapshots__/` is NOT gitignored in the TypeScript variant
(`git check-ignore` exits 1). So the written snapshot WILL appear in the captured diff unless handled
-- either commit it inside the throwaway checkout, or add it to that checkout's
`.git/info/exclude`. Prefer whichever keeps `assertSafeDiffPaths` and the attribution logic honest;
state the choice and why.

**UNVERIFIED, verify before relying on it:** that vitest 0.28 auto-writes the missing snapshot and
PASSES outside `--ci`. That came from documentation, not from a run on this machine. Note that CI
mode refuses to write new snapshots, so if the harness ever passes `--ci` the arming step must not.

**RESIDUAL that arming does NOT fix, and must be recorded:** `test/vitest/gilded-rose.spec.ts` ships
a permanently-failing placeholder (`expect(items[0].name).toBe('fixme')`). A model can "answer" by
tightening that existing test rather than adding one, which the attribution gate grades
`unattributable` -- an instrument artifact needing hand inspection. Arming narrows the
characterize-first branch; it does not narrow the tighten-the-placeholder branch.

---

## Instrument work implied by all of the above

- `grade-red.mjs` runner selection is currently keyed on the kata's path prefixes
  (`test/jest/`, `test/vitest/`). Both new targets need entries. srvx puts specs in `test/`;
  ngx-layout under `projects/libs/flex-layout/**`. Neither matches the kata's shape.
- The differential typecheck is currently one shape for one target. srvx needs a BUILD FIRST to have
  a clean baseline; ngx-layout needs a `-p <tsconfig.spec.json>` project flag. Per-target typecheck
  configuration is required -- do not hardcode.
- srvx's runner command needs `--typecheck.enabled=false`; ngx-layout's is an `ng test --include`
  invocation, not a bare vitest call. The existing `runner` template in `targets.json` is a
  per-target string, which should accommodate both -- verify.
- Each new suite needs its own `suite.json` + `targets.json` + a non-leading prompt that is
  BYTE-IDENTICAL across the three arms (crux 2 asserts this).
- New `selfcheck-red` cruxes should cover each target the way crux 7 covers the kata: a fabricated
  runDir graded end to end against the target's own toolchain, asserting a verdict rather than a
  throw, a real `runner_version`, and the borrowed repo left intact.
- Prompts must not name the expected behavior, smell, or verdict. For ngx-layout the file path alone
  is probably enough; for srvx the earlier assessment judged that the SYMPTOM must be named
  ("a middleware sets a cookie on `res`, then we send a web Response, and the cookie vanishes") since
  the function is otherwise unguessable -- naming the symptom is not leading the DESIGN, which is
  what we grade. Decide and justify per target.
