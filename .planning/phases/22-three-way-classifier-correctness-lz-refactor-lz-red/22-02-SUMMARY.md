---
phase: 22-three-way-classifier-correctness-lz-refactor-lz-red
plan: 02
subsystem: dev-only Node harness (hygiene + eval lint) and planning requirements
tags: [instrument-first, anti-vacuity, hygiene, allowlist-inversion, gitignore, requirements]
requires:
  - .claude/skills/lz-refactor-workspace/tools/check-hygiene.mjs (pre-existing, 3-tree scope)
  - .claude/skills/lz-red-workspace/check-evals.mjs (pre-existing, e2e-red-* anchored clause 8)
  - .planning/phases/22-.../22-RESEARCH.md (pre-authored CLS-01..CLS-05 text)
provides:
  - "check-hygiene.mjs reaching plugins/lz-tdd/README.md + plugins/lz-tdd/references/ on all three axes"
  - "[cls] hygiene scope floor -- the first file-count/scope assertion this checker has ever had"
  - "check-evals.mjs clause 8 reaching the e2e-rgr-routing suite (authored by 22-05)"
  - "mechanical-routing.json as the FIXED routing rollup filename (22-05 follows it)"
  - "CLS-01..CLS-05 as formal traceable requirements"
affects:
  - "22-04 (edits beck-tdd-by-example.md -- now actually hygiene-scanned)"
  - "22-05 (authors e2e-rgr-routing/ -- now actually lint-swept, byproducts ignored)"
  - "22-06/22-07 (CLS-01..CLS-04 close on check-rgr-routing.mjs GREEN; CLS-05 at the gated run)"
tech-stack:
  added: []
  patterns:
    - "scope-builder push-gate ALWAYS paired with its scan floor in the same edit"
    - "non-vacuity floor keyed on newly-reached PATHS, never on a total-equality literal"
    - "named-set suite-dir predicate instead of a loosened prefix glob"
    - "email hygiene by allowlist-inversion only; forbidden value never written as a needle"
key-files:
  created:
    - .planning/phases/22-three-way-classifier-correctness-lz-refactor-lz-red/deferred-items.md
  modified:
    - .claude/skills/lz-refactor-workspace/tools/check-hygiene.mjs
    - .claude/skills/lz-red-workspace/check-evals.mjs
    - .gitignore
    - .planning/REQUIREMENTS.md
decisions:
  - "Named the routing rollup mechanical-routing.json -- 22-05's plan defers the name to this plan's ignore lines, so 22-02 is the naming authority; both check-evals.mjs and .gitignore state it."
  - "The new hygiene floor is keyed on the newly-reached paths, NOT on `=== 199`, so a future legitimate reference leaf cannot redden the battery."
  - "Widened the clause-8 filter with an exact dir name rather than loosening to an `e2e-` prefix, so no unrelated future e2e-* dir is swept in silently."
  - "Did NOT run npm install to unblock selfcheck-red's atc canary -- out of scope, package-manager install, and the worktree is discarded on return. Logged to deferred-items.md."
metrics:
  duration: "one session, spanning a provider spend-limit interruption between tasks 1 and 2"
  tasks_completed: 3
  files_modified: 4
  files_created: 1
  completed: 2026-08-03
status: complete
---

# Phase 22 Plan 02: Close the measured instrument holes + formalize CLS-01..CLS-05 Summary

Both measured instrument holes are closed before any content lands: `check-hygiene.mjs` now reaches
the plugin-wide `references/` dir and the plugin README on all three axes behind an AUTHORED,
mutation-proven non-vacuity floor (197 -> 199 wide, 190 -> 192 no-verbatim), `check-evals.mjs` clause
8 reaches the `e2e-rgr-routing` suite, its byproducts are explicitly ignored, `selfcheck-red.mjs` is
byte-unchanged, and CLS-01..CLS-05 exist with CLS-05 honestly bounded as build-then-halt.

## Commit trail

**Tasks 1 and 2 were split across a provider spend-limit interruption.** Task 1 was committed, then
the quota tripped mid-Task-2 with `check-evals.mjs` and `.gitignore` edited but uncommitted; the
session resumed, re-ran the worktree HEAD assertion, inspected its own uncommitted diff, finished
Task 2 from that point rather than restarting it, and continued. Nothing was redone and nothing was
lost. Recording it here so the commit trail is legible later.

| Task | Name | Commit | Files |
| ---- | ---- | ------ | ----- |
| 1 | Widen check-hygiene.mjs + author the non-vacuity count assertion | `e36a2cd` | `check-hygiene.mjs` (+80/-8) |
| 2 | Widen check-evals.mjs clause 8 + explicit gitignore lines | `fee764b` | `check-evals.mjs`, `.gitignore` (+42/-13) |
| 3 | CLS-01..CLS-05 + Traceability + coverage | `19b1b98` | `.planning/REQUIREMENTS.md` (+16/-3) |

Fork base `4ea9c4c`. Full manifest vs base: 4 files, +138/-24. No `STATE.md` or `ROADMAP.md` change
(worktree mode -- the orchestrator owns those).

## Task 1 -- the widen, and the assertion that makes it provable

The headline risk this plan existed to kill was a gate that reads clean because it scanned nothing.
`check-hygiene.mjs` was measurably blind to exactly two shipped files, one of them
`plugins/lz-tdd/references/beck-tdd-by-example.md` -- the very surface 22-04 repairs.

Added `PLUGIN_ROOT` / `PLUGIN_README` / `PLUGIN_REFERENCES` / `PLUGIN_REFERENCE_ANCHOR`, modelled on
the `LZ_RED_*` block, and pushed the README plus `walkMd(references)` into BOTH `wideTargets` and
`verbatimTargets`. Per D-21 the plugin-wide `references/` dir takes ALL THREE axes -- the lz-red
treatment (clean-room own-words, DST-04), NOT the lz-tpp no-verbatim carve-out. Extended the
identity-anchor scan floor with both new anchors, and updated the header clause list and printed
scope line.

The load-bearing part had no analog to copy: **this checker had NO count assertion at all.** Counts
appeared only in detail strings (`files: N`, `N files clean`), so "the widen worked" was
unfalsifiable. Authored `[cls] hygiene scope floor -- plugin-wide references + README reached`,
modelled on `check-evals.mjs`'s suite-dir non-vacuity `fail()` ("a SKIP is not a pass"): it asserts
that a file under the plugin-wide references dir AND the plugin README are present in BOTH scope
sets, and reports the offending set per axis on failure.

Deliberately keyed on the newly-reached **paths**, not on a `=== 199` total-equality literal. A
path-keyed floor survives an unrelated reference leaf being added; a bare total literal would redden
the battery on every legitimate new file. The totals are still printed in the detail so the
197 -> 199 / 190 -> 192 movement stays visible.

### Mutation proof (run, recorded, reverted)

The plan required proof that the floor is not decorative. Two mutations, both run:

| Mutation | Result |
| -------- | ------ |
| M1 -- remove ONLY the `wideTargets` README push | `[FAIL]` at `wide 198 / verbatim 192`, detail `wideTargets is missing plugins/lz-tdd/README.md`, exit 1. The old identity-anchor floor still **PASSED**, so the new floor catches something the pre-existing floor cannot. |
| M2 -- revert the ENTIRE widen (both pushes, both sets) | `[FAIL]` at exactly the `wide 197 / verbatim 190` pre-widen baseline, with all four gaps named (both axes x references-dir + README), exit 1. |

M2 is the specific evidence the plan asked for: **the floor is not satisfiable by the untouched
three-tree scope alone.** Both mutations were reverted; the checker is GREEN at 199/192.

### Task 1 acceptance

- `node --check` and `node check-hygiene.mjs` both exit 0; `files: 199`, `192 files clean`, the
  `[cls]` label PASSES.
- `npm --prefix .claude/skills/lz-refactor-workspace run check` exits 0 -- all ten checkers GREEN.
- `APPROVED_EMAILS`, `EMAIL_RE`, `QUOTE_THRESHOLD` untouched: they do not appear in `git diff` at all.
- Zero email-shaped tokens in the diff; detection stays allowlist-inversion. No forbidden value was
  written anywhere, not even as a needle.
- Both newly-scanned files were independently pre-checked and are clean on all three axes, so no
  `QUOTE_THRESHOLD` raise was needed and the DST-04 gate did not fire on
  `beck-tdd-by-example.md`.
- `git status --porcelain plugins/lz-tdd` empty.

## Task 2 -- clause-8 widen and the ignore lines

`check-evals.mjs`: widened the suite-dir filter past the `e2e-red-` anchor via a named predicate
`isSweptSuiteDir` accepting `e2e-red-*` OR the exact name `e2e-rgr-routing`. Deliberately NOT a
loosened `e2e-` prefix, so an unrelated future `e2e-*` dir is not swept in silently (verified:
`git grep -F "startsWith('e2e-')"` returns nothing). Replaced the single `mechanical-red.json`
filename exclusion with a `SUITE_SKIP_FILES` set also covering `mechanical-routing.json` --
extending the same predicate, not adding a second one. `SUITE_SCAN_EXTS` and `SUITE_SKIP_DIR` are
unchanged, so captured model text is still never scanned. Header clause 8, the non-vacuity `fail()`
message and the OK summary all now name both suite families in the same edit.

`.gitignore`: explicit `e2e-rgr-routing` lines for `results*/`, `run-*/`, `outputs/` and the
`mechanical-routing.json` rollup, following the file's own `e2e-red-*` convention and carrying the
same "the generic lines already cover this; the explicit lines exist for unambiguity" rationale.
Additions only. No `lz-red-workspace` rule was generalized to `*-workspace` (which would newly
ignore already-tracked lz-tpp trigger results).

### Task 2 acceptance

- Baseline held: `check-evals.mjs` exits 0 at **14 authored files / 3 suite dirs**, since
  `e2e-rgr-routing/` does not exist until 22-05. Recorded so the later increase is verifiable.
- **Forward proof (run and reverted):** a throwaway probe dir containing `suite.json` +
  `mechanical-routing.json` moved the sweep to **15 files / 4 dirs** -- `+1` dir and `+1` file, NOT
  `+2` files. That single number proves two things at once: the widened filter genuinely reaches the
  new dir name, and the rollup exclusion genuinely fires. Probe removed; back to 14/3 with a clean
  `git status`.
- All four `git check-ignore -v` probes resolve to the **NEW explicit lines**
  (`.gitignore:82/83/84/89`), not to the pre-existing generic lines.
- The non-vacuity `fail()` survives (`git grep -F "SKIP is not a pass"` still matches) and still
  fires on dirs-found-but-zero-files.
- `selfcheck-red.mjs` and `tools/check-red-references.mjs` are BYTE-UNCHANGED vs the fork base
  (empty `git diff --stat`), as D-22 requires.

## Task 3 -- CLS-01..CLS-05

New `### Request classifier correctness (CLS)` section after the EVL section, five unchecked items in
the file's existing `- [ ] **ID**: text` shape, text derived from 22-RESEARCH.md's pre-authored table
plus ROADMAP SC1-SC8 and CONTEXT D-01..D-26. No scope invented. CLS-01 -> SC1, CLS-02 -> SC2+SC4,
CLS-03 -> SC3+SC5, CLS-04 -> SC6, CLS-05 -> SC8.

CLS-05 carries the D-14/D-24 framing explicitly: BOTH metered rounds (the placement A/B and the
**mandatory** EVL-01 reciprocal trigger regression the D-06 description edits force) need fresh
explicit owner approval, neither approval implies the other, closing Phase 22 does NOT by itself
select a variant or unblock PR #3, and "no variant shipped" is the DESIGNED outcome rather than an
incomplete phase. It also carries an explicit **RECONCILE-ON-COMPLETION OBLIGATION** -- the drift
notice's second durable rule applied forward, so the row cannot decay into a false Pending the way
all three EVL rows did.

Five Traceability rows, all `Phase 22`, all Pending; phase attribution verified before writing per
the drift notice's FIRST durable rule (a row filed under the wrong phase survives every phase-scoped
sweep). Coverage 28 -> 33 / 33 mapped / 0 unmapped. Footer updated, preserving the entire prior
history as a `Prior:` chain.

**No CLS requirement was marked complete** -- CLS-01..CLS-04 close only when `check-rgr-routing.mjs`
goes GREEN in waves 2-3; CLS-05 at the owner-approved run.

The diff contains exactly **three** removed lines: the two coverage counts and the footer prefix.
Every existing SKL/SEL/STR/ASRT/NAME/LAW/RTR/VIT/SEAM/ANTI/DST/EVL line, the Out of Scope table,
Future Requirements and the DRIFT NOTICE are byte-unchanged. ASCII-only; zero email-shaped tokens.

## Deviations from Plan

None affecting scope or artifacts. Two recorded judgements:

**1. [Naming, delegated to this plan] Fixed the routing rollup filename as `mechanical-routing.json`.**
The plan told me to exclude "the routing rollup JSON name chosen in 22-05", but 22-05's own plan
defers it back ("the routing grade file and the routing rollup JSON, both covered by the explicit
ignore lines 22-02 added"). Rather than guess or leave a hole, I fixed the name mirroring
`mechanical-red.json`, stated in both `check-evals.mjs` and `.gitignore` that 22-02 is the naming
authority, and cross-referenced the two so they cannot drift. 22-05 must use this name.

**2. [Out of scope -- logged, not fixed] `selfcheck-red.mjs` cannot complete in a fresh worktree.**
The plan's soft criterion `node selfcheck-red.mjs` exits 0 is recorded as **ENVIRONMENT-BLOCKED, not
passed.** It exits 1 at `[crux 7:canary-rdxf-red]` because `angular-typechecker` cannot be resolved.
Four pieces of evidence establish this is pre-existing and not mine: `selfcheck-red.mjs` is
byte-unchanged; it contains no reference to `check-evals` so my edit is not on its code path;
`angular-typechecker@0.2.4` is a tracked pinned dep whose `node_modules/` is gitignored and absent
here *and* in the main working copy; and the tool's own error text documents this exact
fresh-worktree case. Every crux not depending on that package PASSED, including cruxes 1+2
(composition and byte-identical prompt parity across 3 suites / 6 prompts x 2 modes, the D-12 arm
proof, and the 13-token state-claim ban), 3, 4, 5, 10 and the GRC/SRVC/RXF crux-7 canaries.

I did NOT run `npm install`: it is out of this plan's four-file scope, a package-manager install is
excluded from the auto-fix rules, and the untracked tree would not survive the worktree removal
anyway. Logged with full reproduction and resolution steps to
`.planning/phases/22-.../deferred-items.md`. **The D-22 obligation that actually matters -- that
`selfcheck-red.mjs` stay byte-unchanged -- is satisfied and independently proven.**

## Known Stubs

None. This plan ships no placeholder values, no empty-collection defaults and no TODO markers. The
one intentionally-deferred name (`mechanical-routing.json`, consumed by 22-05) is a fixed decision
recorded in two files, not a stub.

## Threat Flags

None. No new network endpoint, auth path, file-access pattern or schema at a trust boundary. The
plan's own register is discharged as follows: T-22-VAC2 mitigated by the authored labeled floor plus
the extended anchor map plus the recorded two-way mutation proof; T-22-VAC3 by retaining and widening
the non-vacuity `fail()` and using a named set rather than a loosened prefix; T-22-PII2 by the widen
itself (the two files now take the email axis for the first time) with allowlist-inversion intact;
T-22-IP by the DST-04 gate now reaching `beck-tdd-by-example.md` and finding it clean with no
`QUOTE_THRESHOLD` change; T-22-REG by the byte-unchanged proof on `selfcheck-red.mjs`; T-22-SPEND2 by
running no metered command at all.

## Verification

| Check | Result |
| ----- | ------ |
| `node check-hygiene.mjs` | exit 0, `files: 199`, `192 files clean`, `[cls]` floor PASS |
| `[cls]` floor mutation-sensitivity | FAILS on M1 (README push removed) and on M2 (whole widen reverted) |
| `npm --prefix .claude/skills/lz-refactor-workspace run check` | exit 0, all ten checkers GREEN |
| `node check-evals.mjs` | exit 0, 14 files / 3 dirs, summary names both families |
| clause-8 forward reach | probe proved 15 files / 4 dirs, rollup excluded |
| `git check-ignore -v` x4 | all resolve to the new explicit lines 82/83/84/89 |
| `selfcheck-red.mjs` + `check-red-references.mjs` byte-unchanged | empty `git diff --stat` vs `4ea9c4c` |
| `node selfcheck-red.mjs` | ENVIRONMENT-BLOCKED (pre-existing missing dep) -- see Deviations |
| REQUIREMENTS.md | 5 CLS items, 5 Phase-22 rows, 33/33/0, 3 removed lines only |
| ASCII-only on all edited/authored files | `LC_ALL=C rg -c -N '[^\x00-\x7F]'` exit 1 (clean) on all 5 |
| Allowlist-inversion | zero email-shaped tokens in any diff or authored file |
| `claude plugin validate .` | Validation passed |
| `git status --porcelain plugins/lz-tdd` | empty |
| `STATE.md` / `ROADMAP.md` | untouched (worktree mode) |
| metered commands run | none |

## Self-Check: PASSED

Files verified present on disk: `check-hygiene.mjs`, `check-evals.mjs`, `.gitignore`,
`.planning/REQUIREMENTS.md`, `deferred-items.md`, this SUMMARY.

Commits verified in `git log`: `e36a2cd` (task 1), `fee764b` (task 2), `19b1b98` (task 3), all on
`worktree-agent-ad8ebeba8a8176ff9` atop fork base `4ea9c4c`. No commit deleted a tracked file
(`git diff --diff-filter=D` empty for all three).
