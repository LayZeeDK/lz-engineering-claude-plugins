# quick-260729-lc9 -- INSTRUMENT AUDIT FIX SUMMARY

Closes every finding in `260729-lc9-INSTRUMENT-AUDIT.md`. Owner ruling: all instrument findings now.

Instrument files (eval workspace, not a shipped skill):
`.claude/skills/lz-red-workspace/tools/check-red-references.mjs`,
`tools/lib/row-guards.mjs`, `tools/lib/pipe-table.mjs`, `tools/row-guards.selftest.mjs`.

Base `fc2f94b` on `gsd/lz-tdd-0.0.3-lz-red`. Anchor at base: battery exit 0, 123 checks, 0 FAILs;
selftest exit 0.

## STATUS: COMPLETE. All 11 findings plus the minor and one extra are closed in four commits.

| Commit | Subject | Findings |
|---|---|---|
| `f0d1ef2` | `fix(instrument): count only resolved relative links in the N2 anti-vacuity leg` | 1, 10, E1 |
| `9ec6ecb` | `fix(instrument): close the roster rename, indented-table and non-md blind spots` | 2, 3, 4 |
| `8ac27de` | `docs(instrument): correct two false selftest claims and mutate the oneRow fixture` | 5, 6, minor |
| `6bd84f3` | `fix(instrument): scope every guard label to what its needle enforces` | 7, 8, 9, 11a-c |

An earlier attempt on this task was blocked for its whole window by a permission-classifier outage
(`Edit` and `node` both unavailable). Nothing was applied then, deliberately: every fix here needs an
observed RED and GREEN, and landing unproven edits would have violated that gate. The design was written
first, reviewed, approved, and then applied unchanged.

---

## Per-finding record

| # | Finding | RED (bug present / guard falsified) | GREEN (closed / restored) |
|---|---|---|---|
| 1 | N2 counted links pre-filter | all-anchor tree: N2 **PASS**, probe **exit 0** | same tree: N2 **FAIL**, probe **exit 1**; real tree exit 0 |
| 2 | Guard rename passed all 3 roster legs | label renamed, pre-fix battery **exit 0** | label renamed, post-fix **exit 1** naming the missing label |
| 3 | Indented pipe tables skipped silently | assertions added first, selftest **exit 1** (3 FAILs) | recognizer applied, selftest **exit 0** |
| 4 | `.md`-only walk hid a non-md copy | `.txt` copy planted, pre-fix battery **exit 0** | post-fix **exit 1** naming the file; fixture removed, **exit 0** |
| 5 | Step-12 comment overclaimed | n/a, comment-only | selftest **exit 0** |
| 6 | Fixture "every line written for this file" | n/a, comment-only | selftest **exit 0** |
| 7 | Fowler attribution unscoped | mockist stripped from the attribution line: pre-fix **exit 0**, post-fix **exit 1**; row half: selftest evasion case FAILs while the OLD needle PASSES it | content restored, battery **exit 0**; selftest **exit 0** |
| 8 | G17 missed `plugins/lz-tdd/README.md` | bare use planted there: old scope **PASS / exit 0** | new scope **FAIL naming README.md:5 / exit 1**; restored, **exit 0** |
| 8b | G17 had no anti-vacuity leg | empty tree: G17 **PASS** pre-fix | empty tree: G17 **FAIL** "NO FILE WAS SCANNED" |
| 9 | Test Spy semantics unenforced | both live sites de-semanticised: pre-fix **exit 0**, post-fix **exit 1** | restored, **exit 0** |
| 10 | N2 label claimed more than its scope | n/a, label-only | battery **exit 0** |
| 11a | ">= 1 recommendation link" matched any link | discriminating fixture (link in prose only): OLD **PASS**, NEW **FAIL** | live file: NEW **PASS** |
| 11b | "stance routing step" was a bare word | step reworded: pre-fix **exit 0**, post-fix **exit 1** | restored, **exit 0** |
| 11c | "naming stance" was a generic word pair | heading demoted to prose saying "match ... stance": pre-fix **exit 0**, post-fix **exit 1** | restored, **exit 0** |
| minor | `oneRow` fixture used bare `.replace` | pointed at a nonexistent row: selftest **exit 1**, "fixture mutation did not apply" | restored, selftest **exit 0** |
| E1 | SUMMARY line claimed a removed SEAM-02 guard | n/a | applied by the owner; folded into `f0d1ef2` |

**The strongest single measurement.** With all four content mutations for findings 7, 9, 11b and 11c in
place at once, the pre-commit-4 checker was **GREEN at exit 0** while the post-fix checker **FAILED at
exit 1** on all four. Every one of those old needles was blind to the removal of the very thing its label
claimed.

Findings 11a-c were STRENGTHENED, not relabelled. The task allowed weakening a label where closing was
disproportionate; measured content made a sharper needle cheaper in all three cases, so nothing was
watered down. Only one label was retitled, `naming.md`'s, because the heading it now requires says
"codebase's naming stance" while the old label said "house".

One honest correction made during the proofs: the first `naming.md` mutation reddened the OLD needle too,
so it was not a discriminating case. It was replaced with one that is -- demoting the heading to prose
that still says "match ... stance" -- under which the old needle PASSES and the new one FAILS.

---

## Check-count arithmetic

**123, unchanged, at every commit boundary.** No fix adds or removes a `report()` call:

- findings 1, 3, 4, 5, 6, 9, 10, 11, the minor and E1 change needles, comments, counters, labels or
  output strings only;
- finding 2 changes `NEW_LABELS` (12 -> 13), a label-SET assertion and not an emitter;
- finding 7 keeps N7 as ONE report -- the new row-scoped guard feeds the existing report rather than
  becoming a fifth `TWO_IG_GUARDS` entry, which would have made it 124;
- finding 8 keeps G17 as ONE report.

So `EXPECTED_CHECKS = 123` and the arithmetic comment `174 + 9 - 58 - 2 = 123` both stand unedited.
`RETIRED_LABELS.length === 64` untouched. Final roster output: `123 checks, equal to the PREDICTED
literal; all 13 new labels present; none of the 64 retired labels survive`. 124 PASS lines (123 checks
plus the roster line itself). Selftest grew from 41 to 49 assertions.

---

## Deviation from the audit's suggested fix (finding 2)

The audit (section 6.1) says to add "the current `BARE_QUALIFIER_LABEL` constant" to `NEW_LABELS`. That
would have been VACUOUS: the roster leg computes
`NEW_LABELS.filter((label) => !emittedLabels.includes(label))`, and the emission site pushes the same
constant, so a rename moves both sides together and the leg stays green -- a guard that cannot fail,
exactly the class this instrument exists to close. It went in as a STRING LITERAL instead, which is what
makes the rename an assertion. Confirmed by measurement: renaming the label leaves the battery at exit 0
under the constant and takes it to exit 1 under the literal. The audit was right on intent, wrong on
mechanism.

**True extent of that blind spot, recorded because it is larger than the audit stated.** Of the 13
`NEW_LABELS` entries, **8 remain rename-blind** -- not 4. Four come from
`...TWO_IG_GUARDS.map((guard) => guard.label)`, derived from the very objects that also carry those labels
to the `report` call, and four more are referenced through their own constants (`RAGGED_TABLE_LABEL`,
`LINK_RESOLVES_LABEL`, `TAXONOMY_COPY_LABEL`, `FOWLER_LABEL_LABEL`), whose comment presented that as a
feature. Only the five literals can catch a rename. Converting the other eight needs eight rename proofs
and was left out of scope; the comment in the source now records the count so the next reader is not
misled.

Nothing else in the audit was judged wrong. Every other finding reproduced as described.

---

## Owner decisions honoured

1. `beck-tdd-by-example.md` NOT moved, retargeted or edited. No fix depends on its location.
2. The taxonomy stays archived. N3 was made STRICTER (basename stem, any extension); no carve-out and no
   weakening. It still fails on any taxonomy copy under `plugins/`.
3. N2's link CLASSIFICATION untouched, so the plugin-root inline-code citation form stays correct and a
   plugin-root Markdown link would still fail the gate. Only the counter moved.
4. The nine fixture lines shared with the archived record were KEPT; only the claim about them changed.
5. Nothing under `plugins/lz-tdd/skills/lz-tpp/` or `plugins/lz-tdd/skills/lz-refactor/` was modified.
   `git diff lz-tdd@0.0.2` over both trees is 0 lines. G17 now READS the sibling trees through the shared
   walk but requires no content there, which is what keeps it compatible with both being out of scope.

The proof mutations under `plugins/lz-tdd/skills/lz-red/` and `plugins/lz-tdd/README.md` were each
restored with `git checkout --` and verified by a clean `git status` plus a green battery.

---

## Final gate

| Command | Exit |
|---|---|
| `node .claude/skills/lz-red-workspace/tools/check-red-references.mjs` | **0** (123 checks, 0 FAILs) |
| `node .claude/skills/lz-red-workspace/tools/row-guards.selftest.mjs` | **0** (49 assertions) |
| `claude plugin validate .` | **0** (validation passed) |
| `node .claude/skills/lz-refactor-workspace/tools/check-hygiene.mjs` | **0** |
| `git diff lz-tdd@0.0.2 -- plugins/lz-tdd/skills/lz-tpp/ plugins/lz-tdd/skills/lz-refactor/` | 0 lines |
| `git status --porcelain` | only the untracked `PLUGIN-WIDE-REFERENCE-RESEARCH.md` |

---

## Open items

1. **Eight of thirteen `NEW_LABELS` entries remain rename-blind** (above). Follow-up candidate; needs one
   rename proof per conversion.
2. **The retired-label roster is still vacuous on a typo by construction** -- a mistyped retired label is
   trivially "not emitted". Finding 5 corrected the comment that overclaimed a backstop for this; the
   actual evidence remains that the 58 were transcribed from a captured run and verified 58/58 exact.
   Closing it properly means capturing emitted labels across a version boundary, which is a different
   instrument.
3. **`">= 1 recommendation link"` is an existence needle**, so its RED is a fixture rather than a live
   mutation. Falsifying it live would require de-linking every data row of the table.
4. The probe harnesses used for findings 1, 8 and 11a live in the session scratchpad
   (`probe-tree.mjs`, `probe-needles.mjs`, `fixture-anchors-only/`, `fixture-empty/`) and are fully
   specified by their header comments if that directory is gone.
