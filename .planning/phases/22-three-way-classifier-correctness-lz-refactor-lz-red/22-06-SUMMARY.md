---
phase: 22-three-way-classifier-correctness-lz-refactor-lz-red
plan: 06
subsystem: dev-only eval harness (placement A/B) -- shared routing table source, fail-closed variant builder, offline arm proof
tags: [placement-ab, variant-trees, fail-closed, destination-safety, frontmatter-identity, mutation-proof, zero-spend]
status: complete
requires:
  - .claude/skills/lz-red-workspace/tools/rgr-cases.json (22-01: the 9-case corpus, single source)
  - .claude/skills/lz-red-workspace/tools/lib/pipe-table.mjs (22-01: the row-parsing contract the table honors)
  - plugins/lz-tdd/skills/{lz-red,lz-tpp,lz-refactor}/SKILL.md (22-03: the headings and step-1 runs the transforms anchor on)
  - plugins/lz-tdd/references/beck-tdd-by-example.md (22-04: the file-shape analog and the plugin-neutral seam vocabulary)
  - .claude/skills/lz-refactor-workspace/e2e-nx/run-e2e.mjs (22-05: the placement arm group and the exported VARIANT_B_DIR / VARIANT_C_DIR)
  - .claude/skills/lz-red-workspace/e2e-rgr-routing/ (22-05: the suite this selfcheck targets by name)
  - .claude/skills/lz-red-workspace/grade-routing.mjs (22-05: extractDestination / expectedLabelFor / loadCorpus, imported not reimplemented)
  - .claude/skills/lz-red-workspace/treatment/build-treatment.mjs (pre-existing: the builder analog and its doctrine)
provides:
  - "variants/rgr-routing.md -- the shared routing table SOURCE, plugin-neutral, pipe-table-parseable, 9 rows"
  - "variants/build-variants.mjs -- out/lz-tdd-variant-b and out/lz-tdd-variant-c, four fail-closed operations"
  - "a four-operation transform vocabulary (addFile / replaceSection / deleteSection / replaceRun), every one exercised"
  - "selfcheck-routing.mjs -- six cruxes proving composition, 9-prompt parity, description identity, delta declaration, corpus derivation and grader alignment"
  - "frontmatterHash + variantDest + VARIANTS exported for the selfcheck's declaration import"
affects:
  - "22-07 (the RUN-GATE presents `--arm placement` against these three trees; the double HALT keeps it unrun)"
  - "the owner-approved A/B (the trees are built on demand; nothing is shipped and no variant is selected inside this phase, per D-24)"
tech-stack:
  added: []
  patterns:
    - "destructive destination hardcoded with NO environment override, asserted inside the repo root and on its subpath BEFORE any delete"
    - "the heading as a parse INPUT, so a rewording FAILS rather than no-ops"
    - "inverse post-assert on a deletion, because a present-marker check on a delete is satisfied by the no-op it guards"
    - "declaration imported, measurement computed independently (crux 4)"
    - "closed-label round trip through the real grader instead of a second literal (crux 6)"
    - "both-directions controls on every assertion that could pass vacuously"
key-files:
  created:
    - .claude/skills/lz-red-workspace/variants/rgr-routing.md
    - .claude/skills/lz-red-workspace/variants/build-variants.mjs
    - .claude/skills/lz-red-workspace/selfcheck-routing.mjs
  modified: []
decisions:
  - "The staging note is stripped from every generated copy by an ordinary deleteSection transform rather than a bespoke header slicer, so it carries the same fail-closed assert as every other operation. Copying it verbatim would tell a model under test it is inside an experiment -- the hazard the analog's dev-time-header strip exists for, and one the plan did not resolve."
  - "The operation vocabulary is FOUR operations and deliberately does not include a bare insert-at-anchor: replaceRun subsumes it, and neither variant uses one. An operation no variant exercises would carry a fail-closed assert no run reaches, which is a guard that cannot fail."
  - "deleteSection's post-assert is the INVERSE (heading count 0) of the plan's present-marker rule, because a present-marker check on a deletion is satisfied by the very no-op the pre-assert exists to catch."
  - "The selfcheck computes its own frontmatter hash rather than importing the builder's, so crux 3 is an independent verdict at measurement time; it imports the builder's delta DECLARATION, because that must stay a single source of truth."
metrics:
  duration: "~41 min (base c9c2c63 21:07 -> 4cad918 21:48, 2026-08-03)"
  tasks_completed: 3
  commits: 3
  files_created: 3
  files_modified: 0
  lines_authored: 1350
  generated_trees: 2
  metered_spend: none
  completed: 2026-08-03
---

# Phase 22 Plan 06: Placement variants staged and proven offline Summary

The three placement arms are staged and the whole setup is proven at zero spend: a plugin-neutral,
cell-parseable shared routing table as a workspace source; two generated trees whose every transform
fails closed and whose deltas match their declaration exactly; and a sibling selfcheck proving the
three arms compose distinctly off nine byte-identical prompts with byte-identical descriptions. Both
mutation proofs were performed and both bit. Nothing shipped, nothing metered ran, and
`selfcheck-red.mjs` is byte-unchanged.

## Commit trail

| Task | Name | Commit | Files |
| ---- | ---- | ------ | ----- |
| 1 | The shared routing table SOURCE | `b22dc0e` | `variants/rgr-routing.md` (86 lines, new) |
| 2 | Fail-closed generation of the two variant trees | `41bf593` | `variants/build-variants.mjs` (691 lines, new) |
| 3 | Offline arm proof | `4cad918` | `selfcheck-routing.mjs` (573 lines, new) |

Fork base `c9c2c63`. Three files created, none modified. No `plugins/` file touched, no `STATE.md` or
`ROADMAP.md` change (worktree mode -- the orchestrator owns those), nothing under the gitignored
build-output directory staged.

## Task 1 -- the shared routing table, and the vantage it deliberately does not have

`variants/rgr-routing.md` is a SOURCE artifact in the workspace, not a shipped file. That is D-24's
consequence rather than a preference: variant A is the TRACKED tree and adds no shipped file, so a
copy under `plugins/` would make the baseline arm carry the treatment.

The table is one 5-column pipe table -- `Case | Ask | Owner | Second hop | Reason` -- with a header
row identified by its first cell value and no ragged row, so `lib/pipe-table.mjs`'s `parseRows` can
consume CELLS rather than a caller regexing prose. Measured: every table line splits to the same
field count (one distinct width across 11 lines), and all nine corpus ids appear in column one.

**The residual row's owner cell reads `no owner`, not empty.** `parseRows` SKIPS a width mismatch
rather than guessing, so an empty cell would make a ragged-row skip indistinguishable from a declared
residual -- and exhaustiveness proven by named-owner enumeration depends on being able to tell those
two apart. The edge-case section states that reason explicitly rather than leaving it to a reader.

The edge cases carry the discretion the step-1 branch lists deliberately omit: the two-hop rule and
why Law 1 forces its ORDER (reversing c4 is a Law 1 violation, not a stylistic variation), both sides
of the test-code boundary with c3 and c5 named as the pair that must resolve differently, and what the
residual terminal means. Sources attribute the rules to this project's own D-01..D-04 and cite Law 1
for the FIRST hop of c4 and nothing else; the handoff framing claims no book backing.

**No first-person plugin vantage, re-read and measured.** The plan asks the executor to record this.
A re-read found no sentence that reads differently depending on which of the three skills the reader
arrived from; `rg -n -e 'this skill' -e 'stay here' -e 'continue here'` exits 1 (genuine no-match, with
a passing positive control on the same path). One draft sentence explained the rule by QUOTING the
forbidden phrase; it was reworded, because a quoted mention is indistinguishable from a use to every
grep a later reader will run.

## Task 2 -- the builder, and the two things it refuses to do silently

`variants/build-variants.mjs` generates `out/lz-tdd-variant-b` and `out/lz-tdd-variant-c`, the
hardcoded twins of `run-e2e.mjs`'s read-only `VARIANT_B_DIR` / `VARIANT_C_DIR`. There is no variant A
entry: the tracked tree is variant A.

### Destination safety, written before the delete existed

The destructive destination is hardcoded with NO environment override, resolved, asserted inside the
repo root and asserted to end in `out/<outName>` -- all before `fs.rmSync` appears in the flow. The
asserts were authored before the delete call, not retrofitted around it. The driver's consts carry the
override instead, because there the value is only ever READ. Measured: `rg 'process\.env'` over the
builder exits 1 -- the literal does not appear anywhere in the file, which satisfies the plan's
narrower criterion by construction rather than by careful phrasing.

### Four operations, every one exercised

| Operation | Pre-assert | Post-assert | Used by |
|-----------|-----------|-------------|---------|
| `addFile` | source exists; destination does NOT already exist in the copied tree | marker present exactly once | B, C (the shared table) |
| `replaceSection` | `## <heading>` matches EXACTLY once | heading survives once AND marker present once | B (three narrative sections) |
| `deleteSection` | `## <heading>` matches EXACTLY once | heading occurs ZERO times | B, C (the staging note); C (three narrative sections) |
| `replaceRun` | the exact contiguous line run matches EXACTLY once | the original run is gone AND marker present once | C (three step-1 pointers) |

`replaceRun` SUBSUMES the analog's insert-at-anchor, so this is a widening from one operation to four
rather than a swap.

`deleteSection`'s post-assert is the INVERSE of the plan's present-marker rule, and that is the point:
a present-marker check on a deletion would be satisfied by the very no-op the pre-assert exists to
catch, so asserting presence there would be a guard that cannot fail.

### Variant C keeps its branch list

C deletes the narrative section and rewrites only step 1's CLOSING POINTER, so it links out to the
table by inline code instead of naming a now-absent heading. The lettered branch list stays inline --
D-08's own wording, and D-10's disclosed risk means relocating it would move the load-bearing rule to a
tier with a measured zero read rate. Measured on the generated trees with `rg` and an explicit path:
`^ +[a-d]\. ` reports 4 in each of C's three `SKILL.md` files.

`lz-tpp`'s pointer wraps its heading across two lines, so a single-line anchor could not have captured
it -- which is why `replaceRun` takes an exact contiguous RUN rather than one line. The green-phase
precondition sentence is preserved verbatim inside the rewritten run.

## Deviations from Plan

### Auto-fixed issues

**1. [Rule 2 - Missing critical] The staging note would have reached the trees under test**

- **Found during:** Task 1 design, confirmed while writing Task 2.
- **Issue:** Task 1's acceptance criteria REQUIRE a not-shipped-until-selected note naming the decision
  ids, and Task 2 copies the artifact into both generated trees. Taken literally, both variant trees
  would carry a file announcing that it is staged for a placement A/B -- telling the model under test
  it is inside an experiment. The analog names this hazard in its own words and slices its dev-time
  header off for exactly this reason; the plan did not carry that step across.
- **Fix:** the note is its own `## ` section in the source, and each variant's transform list strips it
  with an ordinary `deleteSection` on the copied artifact. No bespoke slicer: it gets the same
  exactly-once pre-assert and the same inverse post-assert as every other operation, and the build
  additionally asserts the note's heading occurs zero times in every tree.
- **Files:** `variants/rgr-routing.md`, `variants/build-variants.mjs`. **Commits:** `b22dc0e`, `41bf593`.

**2. [Rule 2 - Missing critical] Three assertions the plan did not list**

- **The shared table is byte-identical in B and C.** B and C differ in PLACEMENT only; a drifted copy
  would make them two different treatments and the comparison would answer a question nobody asked.
- **The staging note is absent from every generated tree.** The delta check implies it; stating it
  directly means the guarantee does not rest on reading a delta list.
- **The KEEP-THE-TWO-IN-SYNC pair is asserted, not trusted** (crux 1). The driver READS
  `VARIANT_B_DIR` / `VARIANT_C_DIR` and the builder WRITES those paths; both consts accept an
  environment override, so they can drift with no code change. `run-e2e.mjs`'s own comment calls that
  "the failure mode that looks healthiest".
- **Files:** `variants/build-variants.mjs`, `selfcheck-routing.mjs`. **Commits:** `41bf593`, `4cad918`.

**3. [Rule 1 - Bug] Two generated lines exceeded the house wrap width**

- **Found during:** Task 2 inspection of the generated trees.
- **Issue:** concatenating the inline-code citation onto a prose line produced a 122-character line in
  variant B and a 102-character line in variant C, against a ~100-column house wrap.
- **Fix:** re-wrapped the three variant bodies. No wording changed.
- **Files:** `variants/build-variants.mjs`. **Commit:** `41bf593`.

### Interpretations recorded (not defects, but the reviewer should see them)

- **The operation vocabulary is FOUR operations, and a bare insert-at-anchor is NOT one of them.** The
  plan's `<action>` lists "insert lines relative to an anchor line" among "at least" four shapes.
  Neither variant needs one: B replaces section bodies, C deletes sections and replaces line runs.
  Including it would have added an operation whose fail-closed assert no run ever reaches -- a guard
  that cannot fail, which is the vacuity class this repo's own instruments condemn. `replaceRun`
  subsumes it (pass the anchor as the whole `from` run and the anchor plus new lines as `to`), so no
  capability is lost. The must_have this serves -- "EVERY new operation carries its own fail-closed
  assert" -- is satisfied more strongly by four exercised operations than by five with one dead.
- **The mutation was applied to a tracked input I own, never to a shipped file.** The plan says
  "reword one anchor heading in a COPY of the input". The builder reads the shipped tree directly and
  has no alternate-source switch (deliberately). M-A therefore reworded the heading in
  `variants/rgr-routing.md` -- this plan's own tracked artifact -- and M-B reworded the builder's
  declared heading constant, which exercises the identical assert without touching
  `plugins/lz-tdd`. `git status --porcelain plugins/lz-tdd` was empty at every point.

## Mutation proofs -- both required proofs performed, plus two extras

Every mutation was applied, run, and reverted. All four bit.

| # | Mutation | Target | Result |
|---|----------|--------|--------|
| M-A | reword the staging-note heading in the tracked source | `variants/rgr-routing.md` | **FAIL** exit 1: `variant-b: deleteSection in references\rgr-routing.md: heading ... matched 0 time(s), expected exactly 1` -- names the variant, the operation and the file |
| M-B | reword the declared narrative heading for one skill | `NARRATIVE_HEADING['lz-red']` | **FAIL** exit 1: `variant-b: replaceSection in skills\lz-red\SKILL.md: heading ... matched 0 time(s)` |
| M-C | perturb one line of a step-1 pointer run | `C_POINTER['lz-red'].from` | **FAIL** exit 1: `variant-c: replaceRun in skills\lz-red\SKILL.md: the 3-line run matched 0 time(s)` -- and it names the run's first line |
| M-D | append ONE byte inside a generated tree's frontmatter | `out/lz-tdd-variant-b/skills/lz-red/SKILL.md` | **FAIL** exit 1 at `[crux 3] lz-red: frontmatter is NOT identical across the three trees` -- names the skill and all three hashes |

After M-A the source restored byte-identical (`git status --porcelain` on it empty) and the build
returned exit 0. After M-B and M-C the constants were restored and the build returned exit 0. After
M-D a rebuild restored the tree and the selfcheck returned all six cruxes PASSING.

**M-D also measured why crux 3 has to exist separately from crux 4.** While the tree was mutated, the
delta set was computed independently and came back UNCHANGED -- `added references/rgr-routing.md` plus
the same three `edited` skills, 4 total. `skills/lz-red/SKILL.md` was already declared `edited`, so a
further byte change is invisible to a delta-set assertion. Crux 4 would have passed. That is a
measurement rather than an argument, and it is the concrete reason D-11 gets its own assertion at both
generation time and measurement time.

## Task 3 -- the selfcheck, and what it refuses to inherit

`selfcheck-routing.mjs` is a SIBLING. `selfcheck-red.mjs` is byte-unchanged (`git diff --stat` empty)
and its `startsWith('e2e-red-')` auto-discovery filter is NOT copied -- measured in both directions:
the needle is absent from the new file (exit 1) and present in the sibling (exit 0), so the absence is
a real result rather than a broken pattern. Copying it would have re-imported the 13-token state-claim
ban onto a corpus that carries test-state facts BY DESIGN, hard-failing prompts that are correct.

Six cruxes, all PASSING:

| Crux | What it proves |
|------|----------------|
| 1 | 3 arms compose x 9 prompts; 3 distinct plugin dirs; `variant_a` is the shipped tree; B and C match the driver's EXPORTED consts by identity; argv identical outside `--plugin-dir`; all 5 editing/command tools blocked; builder destinations and driver consts in sync |
| 2 | all NINE prompts byte-identical across the three arms, none with a leading slash |
| 3 | per-skill frontmatter identical across all three trees, computed independently of the builder, with a hash-discrimination probe so it cannot pass vacuously |
| 4 | both generated delta sets equal the builder's DECLARED expectation exactly (4 paths each) |
| 5 | one-to-one corpus-to-prompt derivation: 9 cases, 9 prompt ids, 9 files, no orphan on either side |
| 6 | every expected label round-trips through `grade-routing.mjs`'s own extractor; decoys rejected; the single ordered two-hop `c4: lz-red -> lz-tpp` is representable and its REVERSE is a different label |

Crux 6 deliberately does not compare against a second literal label list. It builds a synthetic answer
designating the case's expected owner, runs it through the real `extractDestination`, and requires the
result to equal `expectedLabelFor(caseSpec)`. That proves the corpus's vocabulary is one the grader
RECOGNIZES rather than one that merely looks similar. A decoy naming a different owner must NOT produce
the expected label, and the reversed two-hop must produce a different label from the forward one, so
neither leg can pass vacuously.

## Known Stubs

None. All three files are complete and runnable, and both generated trees build from them on demand.
Every figure that could only come from a metered run is ABSENT rather than stubbed: this plan writes no
results tree, no rollup and no writeup, because there is nothing measured to put in one. No variant is
selected here, which is D-24's stated outcome and not an omission.

## Threat Flags

None new. No network surface, no auth path, no production code, no schema at a trust boundary. This
plan's own register is discharged as follows:

| Threat | Mitigation as built |
|--------|---------------------|
| T-22-RMRF | Destination hardcoded with NO environment override (`process.env` does not appear in the file at all), resolved, asserted inside the repo root and asserted to end in `out/<outName>`, all before any delete. The asserts were authored before the delete call existed |
| T-22-NOOP | Every operation asserts exactly-one resolution before applying and its marker (or, for a delete, its ABSENCE) after; delta sets must match their declaration exactly; three recorded mutations (M-A/M-B/M-C) show the build FAILS rather than no-ops, each naming the variant, the operation and the file |
| T-22-DESCDRIFT | Asserted TWICE and independently -- by the builder at generation time and by crux 3 at measurement time, with its own hash helper rather than an import. M-D proves it bites, and the same mutation is MEASURED invisible to the delta assertion, so the two are not redundant |
| T-22-SAMETREE | Pairwise distinctness across all three trees per `SKILL.md` (9 comparisons) in the builder, plus crux 1's distinct-plugin-dir assertion and the builder/driver sync check |
| T-22-LAZYREAD | Accepted per D-10 and left visible rather than engineered away: C keeps its inline branch list (measured 4 lettered branches per file) and retrieval is instrumented per run by 22-05, so a pass at a zero read rate is reportable as a finding |
| T-22-SRCMUT | Source tree hashed before and after every build and the equality ASSERTED over 195 files (the analog only prints a count); `git status --porcelain plugins/lz-tdd` empty after every run |
| T-22-STAGE | `out/` already gitignored; `git status --porcelain` asserted clean under it; staging by explicit filename only |
| T-22-SPEND6 | Zero metered spend. Every command was a dry-run, a build or a selfcheck; `rg` finds no `claude -p` invocation in either new file (the one textual hit is a header sentence stating it never calls claude), and the only spawn is `node run-e2e.mjs --dry-run` |

## Verification

| Check | Result |
| ----- | ------ |
| `node --check` on both new `.mjs` | exit 0 each |
| pipe table non-ragged | 1 distinct field width across 11 table lines (header + separator + 9 rows) |
| nine corpus ids in column one | c1..c9 all present; c9's owner cell is `no owner`, not empty |
| plugin-root citation form | `rg 'CLAUDE_PLUGIN_ROOT[^\`]*\)'` exit 1 -- no Markdown link around a variable-prefixed path |
| no first-person plugin vantage | `rg -e 'this skill' -e 'stay here' -e 'continue here'` exit 1, with a passing positive control |
| `node variants/build-variants.mjs` | exit 0; 4 declared deltas matched exactly per variant |
| source untouched | 195 files hashed before and after, all identical; `git status --porcelain plugins/lz-tdd` empty |
| pairwise distinctness | 3 pairs x 3 `SKILL.md` = 9 comparisons, all differ |
| shared table identical in B and C | `d61f43debd38` both |
| frontmatter identity (D-11) | lz-red `0e7c4d3408d99502`, lz-tpp `004f400f9e2bf244`, lz-refactor `35b3b7666d92c3d0` -- identical across all 3 trees |
| generated trees inspected | `rg` with an EXPLICIT path into `out/` (exit 0); `git grep` on the same content returns a SILENT ZERO (exit 1), recorded as the negative control the prohibition exists for |
| variant C branch lists intact | `rg -c '^ +[a-d]\. '` = 4 in each of C's three `SKILL.md` |
| variant C narrative deleted / B's survives | C exit 1, B exit 0 on the same heading |
| no env override on the destructive path | `rg 'process\.env'` exit 1 (the literal is absent entirely); positive control `process.exit` = 2 hits |
| `node selfcheck-routing.mjs` | exit 0, **6/6 cruxes PASSING**, 27 dry-run composes (9 prompts x 3 arms), zero spend |
| mutation proofs | M-A, M-B, M-C, M-D each flip the relevant battery RED; all four reverted and re-verified GREEN |
| `selfcheck-red.mjs` byte-unchanged | `git diff --stat` empty |
| auto-discovery filter not copied | absent from the new file (exit 1), present in the sibling (exit 0) |
| `node grade-routing.mjs --selfcheck` | exit 0 |
| `node grade-red.mjs --selfcheck` | exit 0 |
| `node check-evals.mjs` | exit 0 -- 24 queries, 25 authored files across 4 suite dirs |
| `npm --prefix .claude/skills/lz-red-workspace run check` | exit 0 |
| `npm --prefix .claude/skills/lz-refactor-workspace run check` | exit 0 (hygiene GREEN: ASCII 199 files, no non-allowlisted emails, no-verbatim 192) |
| `claude plugin validate .` | exit 0 |
| frozen files byte-unchanged | `git diff --stat` empty on `selfcheck-red.mjs`, `grade-red.mjs`, `grade-routing.mjs`, `run-e2e.mjs`, `check-red-references.mjs` |
| ASCII-only on all 3 authored files | `LC_ALL=C rg -c -N '[^\x00-\x7F]'` exit 1 (zero non-ASCII bytes) |
| email allowlist-inversion | zero email-shaped tokens in any authored file; no forbidden value written, not even as a needle |
| `git status --porcelain` | clean; nothing under `out/`, no results, `run-*` or outputs path created |
| `STATE.md` / `ROADMAP.md` | untouched (worktree mode) |
| metered commands run | **none** |
| reviewer/subagent spawned by the executor | **none** (`gsd-executor` has no Agent tool) |

### Environment note (mechanism stated accurately)

A fresh worktree does not carry gitignored files, so this worktree started with no `node_modules` under
either workspace. `npm --prefix .claude/skills/lz-red-workspace install` was run to restore it from the
tracked, pinned `package-lock.json` -- **no package was added and no dependency is missing from the
repo**; this is the same restore 22-04 recorded. That turned `grade-red.mjs --selfcheck` from an
environment failure into a measured exit 0. `git status` stayed clean afterwards, since `node_modules/`
is gitignored.

`node selfcheck-red.mjs` was started and had not finished when this plan closed. It is a long-running
check that builds real git worktrees and runs typechecks against three borrowed repos, and by its own
header it is deliberately NOT wired into `npm run check`. Its result is deferred to the orchestrator's
post-merge battery. What matters for THIS plan's contract is proven directly and is in the table above:
the file is byte-unchanged, and its auto-discovery filter was not copied.

## Handoff to the orchestrator

1. **Nothing is shipped and no variant is selected.** That is D-24's stated outcome. Closing this plan
   does not unblock PR #3; the owner-approved A/B run does.
2. **Both metered rounds remain HALT-gated.** No command in this plan spends anything, and 22-07 owns
   the RUN-GATE and the double HALT.
3. **A GREEN battery is not acceptance.** The D-18/SC7 acceptance review is 22-07's and the D-26
   unprimed review is yours. This plan claims a floor, not a verdict.
4. **Rebuild before any run.** The trees live under gitignored `out/` and do not survive a fresh
   checkout. `node variants/build-variants.mjs` then `node selfcheck-routing.mjs`, in that order --
   the selfcheck fails closed with the build command in its message if a tree is absent.
5. **Re-run the batteries post-merge**, including `node selfcheck-red.mjs` to completion.

## Self-Check: PASSED

| Claim | Verified |
| ----- | -------- |
| `.claude/skills/lz-red-workspace/variants/rgr-routing.md` exists | FOUND, 86 lines |
| `.claude/skills/lz-red-workspace/variants/build-variants.mjs` exists | FOUND, 691 lines |
| `.claude/skills/lz-red-workspace/selfcheck-routing.mjs` exists | FOUND, 573 lines |
| Commit `b22dc0e` exists | FOUND in `git log` |
| Commit `41bf593` exists | FOUND in `git log` |
| Commit `4cad918` exists | FOUND in `git log` |
| No commit deleted a tracked file | `git diff --diff-filter=D` empty for all three |
| No `STATE.md` / `ROADMAP.md` modification | `git status --porcelain` on both empty |
| No `plugins/lz-tdd` modification | `git status --porcelain` empty |
