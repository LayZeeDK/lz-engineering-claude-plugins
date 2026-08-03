# Quick Task 260729-2ig: GAP CLOSURE -- the chronology ban

**Executed:** 2026-07-29
**Base:** `ceff869` (`merge(quick-260729-2ig)`)
**Commits:** `7726c76` (instrument, RED) -> `177a92d` (content, GREEN)

## The gap, and why it is a gap rather than a defect in prior work

The task brief for 260729-2ig required two things that never reached its
`CONTEXT.md`, which the planner was told is the authority: a ban on chronology /
seniority / ordering constructions, and a guard forbidding them. Absent from the
authority, absent from the plan, absent from the executor's instructions --
so the round shipped a surviving construction behind a **173/173 GREEN battery**.
The planner, plan-checker and executor each worked correctly from an incomplete
input.

The surviving construction, at `test-double-taxonomy.md:151-153`:

> Beck's collaborator-side vocabulary POSTDATES that 2007 book -- one term in an
> August 2008 essay, the other in a January 2022 essay, both owned and both
> carrying rows in the table below.

`POSTDATES` is `predates` mirrored, and the three dates exist only to order two
usages. It is also self-undercutting: it explains the blank Beck column by
non-existence, which weakens the very reading the paragraph is built on.

## Task 1 -- the instrument

Commit `7726c76`, one file: `.claude/skills/lz-red-workspace/tools/check-red-references.mjs`.

### Mechanism choice, and why it is TWO checks

The brief invited a judgment on mechanism. The chronology ban splits across two,
because its needles come in two shapes and only one shape is safe per line.

| Needle shape | Mechanism | Why |
| --- | --- | --- |
| single-token stems -- `postdat`, `predat`, `antedat`, `seniorit` | `absent` entry on the taxonomy | Per line, which is safe here **only because a stem cannot wrap**. Keeps the ban inside the taxonomy's existing banned-wording inventory (G1-G5, G11, G12 and the six `[2ig]` guards) where a reader will look for it. |
| multi-word -- `came first`, `older vocabulary`, `earlier vocabulary`, `takes precedence` | post-loop block over **whitespace-flattened** text | No per-line needle over these can match once the phrase wraps, and **not one narrows to a single token** without false-failing live prose. |

**Why the multi-word half cannot live in `absent`, stated as measurement rather
than caution.** `absent` guards run through the per-line loop. A wrapped phrase
is two separate strings, so no single-line regex reaches it -- `\s+` does not
help, because the newline never appears in the line being tested. Proven below:
the flattened gate catches both wrapped injections while a per-line control over
the identical needle misses both.

**Why no single-token narrowing is available for the four phrases.**
`precedence` alone is a live domain word in this document (the section-2
`**Precedence.**` block, `source-authority precedence`, and a *pinned positive
topic* `[j9m] no declared precedence`), so it would false-fail. `vocabulary` and
`first` are both far too common. This is the `anti-patterns.md` narrowing
precedent applied and found unavailable.

**Why `lib/row-guards.mjs` was NOT used.** That module is scoped to ROW-SCOPED and
COUNT guards, and its selftest asserts the exact export-name set of both buckets
plus `OLD_NEEDLES` key parity with `ROW_SCOPED_GUARDS`. A chronology-phrase
absence guard is neither a row guard nor a count guard, so landing it there means
inventing a third bucket, extending three roster assertions, and authoring
fixtures -- ceremony for one regex. The direct precedent is **G17**, itself a
prose-absence gate that lives as a post-loop block in the checker precisely
because the per-file loop cannot express it. The flattening idiom
(`text.replace(/\s+/g, " ")`) is copied from `row-guards.mjs` `flat`, honoring its
FLATTEN BEFORE MATCHING invariant without importing its bucket structure.

### `lineage` deliberately excluded -- reported, not silent

The standing prose rule says "no chronology, no seniority, no lineage". The
brief's needle list omits `lineage`, and measurement shows why: the document's own
`**Lineage.**` block (`:161`, `:163`) names which authors lz-red's **doctrine**
descends from. That is doctrinal ancestry, not a temporal or seniority relation
between two authors' usages. Adding the needle would false-fail prose that must
stay, so per the brief's caution it is narrowed out rather than the guard deleted
or the prose reworded. **Consequence, stated plainly: a future chronology claim
phrased purely as lineage would not be caught.** Flagged for review rather than
papered over.

### RED evidence

Offending `file:line`: **`plugins/lz-tdd/skills/lz-red/references/test-double-taxonomy.md:152`**
(the `POSTDATES` token; the full sentence spans `:151-153`).

Observed at baseline, exit 1, exactly one FAIL:

```
  [FAIL] test-double-taxonomy.md: [gap] no chronology or seniority token -- stale marker still present (matches /postdat|predat|antedat|seniorit/i)
```

```
SUMMARY: RED-REFS RED -- 12/12 surfaces present, 1 check(s) FAILED
```

Exit code alone would also be satisfied by a top-level throw, so the designed
summary line is recorded separately.

### Proof that each half can BOTH fail and pass

A guard that cannot fail is worth nothing; a guard that cannot pass is worth
nothing either. The token half is RED on live text, so its PASS needed proving.
The phrase half has zero live occurrences, so its FAIL needed proving. Both were
measured by injecting into the real file and restoring it (restore asserted
byte-identical; `git status` confirmed clean afterwards).

| Case | Gate | Verdict | Per-line control |
| --- | --- | --- | --- |
| live document, unmodified | token | **FAIL** | n/a |
| live `POSTDATES` sentence neutralised | token | **PASS** | n/a |
| `predates` injected | token | **FAIL** | n/a |
| `antedates` injected | token | **FAIL** | n/a |
| `seniority` injected | token | **FAIL** | n/a |
| live document, unmodified | phrase | **PASS** | n/a |
| `came first`, single line | phrase | **FAIL** | WOULD CATCH |
| `older vocabulary`, single line | phrase | **FAIL** | WOULD CATCH |
| `earlier vocabulary`, single line | phrase | **FAIL** | WOULD CATCH |
| `takes precedence`, single line | phrase | **FAIL** | WOULD CATCH |
| `came first`, **WRAPPED across a newline** | phrase | **FAIL** | **WOULD MISS** |
| `takes precedence`, **WRAPPED across a newline** | phrase | **FAIL** | **WOULD MISS** |

The last two rows are the whole justification for the second mechanism: the
flattening is load-bearing, not decorative. The control replicates exactly what
the `absent` mechanism would have done (`OLD_NEEDLES` idiom).

The phrase gate also carries an **empty-text anti-vacuity leg**: `readOrEmpty`
yields `""` for a missing file, and an absence gate over `""` would report PASS
forever -- the `wev R1` defect class.

### Emitted-check count

**`EXPECTED_CHECKS` 172 -> 174** (+2, one per mechanism). Total emitted lines
173 -> 175; the roster gate snapshots the count before its own emission, which is
why the literal is 174 while 175 lines print.

Both new labels are added to `NEW_LABELS` **by name**, not merely counted, because
the count alone cannot see one half dropped while something else is added:

- `test-double-taxonomy.md: [gap] no chronology or seniority token`
- `test-double-taxonomy.md: [gap] no chronology or seniority phrase (wrap-proof)`

Observed after both tasks:

```
  [PASS] [2ig] roster integrity: exact emitted-check count -- 174 checks, equal to the PREDICTED literal; all 34 new labels present; none of the 6 retired labels survive
```

## Task 2 -- the content

Commit `177a92d`, three files (the taxonomy and its two byte-identical copies).

### Why this is not a pure deletion

The deleted sentence supplied **one direction** of the conclusion
"So neither author is citing the other and neither is deviating from the other."
The blank Beck column establishes only that Meszaros never mapped Beck. It
establishes nothing whatever about Beck's direction. Deleting the sentence and
leaving that conclusion would have left it standing on half its warrant.

### Exact final wording of the repaired conclusion

Replacing the former `:151-155`:

> any of the five kinds; owner-verified against the print book. THE INDEPENDENCE IN THAT HEADLINE IS
> ONE-DIRECTIONAL, and the blank column is the whole of its warrant: Meszaros never mapped Beck, so
> his scheme never claimed Beck's usage. This document claims nothing about the other direction and
> does not need to -- one direction carries the conclusion. Beck's production-side usage is not an
> error against a scheme that never claimed him.

Checked against the brief's constraints:

- **Claims strictly less**, never more: one direction where the old text claimed two.
- **Payload survives verbatim in substance**: Beck's production-side usage is not
  an error against a scheme that never claimed him.
- **No replacement dated, ordered or derivational argument.** No date, no ordering
  verb, no descent claim.
- **No new absence claim about what Beck's essays cite.** "This document claims
  nothing about the other direction" is a scope statement about *this document*,
  matching its existing idiom (`This document deliberately does NOT assert an
  etymology...`, `SCOPE OF THAT NEGATIVE...`), not a claim about Beck's essays.
- No information lost with the dates: both essay dates remain in the table's own
  `Source` cells and in the Sources bullet.

### A guard that caught me -- reported, per the brief

The bolded lead **`Two INDEPENDENT VOCABULARIES that collided on one word.`** is
a *two-directional* label, and after the deletion its full warrant no longer sits
in the paragraph. It is **pinned by `[wev G13]`** (`re: /independent vocabularies/i`),
so rewording it away would flip that guard to FAIL. Rather than reword around a
live guard or silently leave an over-claim unremarked, the narrowing sentence
annotates the headline in place: `THE INDEPENDENCE IN THAT HEADLINE IS
ONE-DIRECTIONAL`. **Flagged for the independent review**: if the reviewer prefers
the headline itself narrowed, `[wev G13]`'s needle has to move with it, and that
is a guard change rather than a prose change.

### Counts re-derived, not trusted

The brief said its own count measurement should be verified rather than trusted.
Every pinned site count was re-derived independently after the edit, using the
same cardinal alternation the guards use, with the line of each site reported.
**All nine unchanged:**

| Noun | Pinned | Found | Sites |
| --- | --- | --- | --- |
| `sources` | 2 | 2 | `:11`, `:175` |
| `cells` | 1 | 1 | `:61` |
| `axes` | 3 | 3 | `:17`, `:25`, `:61` |
| `rows` | 2 | 2 | `:66`, `:308` |
| `owned sources name` | 2 | 2 | taxonomy `:307`, `principle-backing.md:71` |
| `kinds` | 8 | 8 | `:94`, `:115`, `:151`, `:249` (x2), `:380`, `:467`, `:476` |
| `further qualifiers` | 1 | 1 | `:501` |
| `candidates` | 1 | 1 | `:315` |
| `of them collide` | 1 | 1 | `:315` |

The deleted sentence contained no counted token, and the replacement introduces
none, so the brief's prediction was correct -- now measured rather than assumed.

### Byte identity

All three copies at **sha256 `3bb4a27fa17d3a639f495548e22931c3cf5a32e401392531574ec916f4e3c693`**;
`sha256sum | sort -u | wc -l` = **1**.

## Verification run

| Gate | Result |
| --- | --- |
| `check-red-references.mjs` | exit 0, **175/175 PASS**, 0 FAIL |
| `[gap] no chronology or seniority token` | PASS |
| `[gap] no chronology or seniority phrase (wrap-proof)` | PASS |
| roster integrity | PASS, 174 = predicted literal, 34 labels present, 6 retired absent |
| `row-guards.selftest.mjs` | exit 0 |
| `provenance-honesty.selftest.mjs` | exit 0 |
| lz-refactor battery (all 10 checkers) | exit 0 each, including `check-hygiene` (201 files ASCII + email clean, 193 files no-verbatim) and `check-crossrefs` (719 links resolve) |
| chronology needle re-sweep, all three copies | only the two `**Lineage.**` occurrences remain |
| post-commit deletion check | no files deleted |
| working tree | clean, no untracked files |

Hygiene probes on the changed workspace file were **positive-controlled**, because
a zero-hit search is not evidence of absence: the email regex was confirmed to
find the approved public contact in `.claude-plugin/marketplace.json`, and the
non-ASCII probe was confirmed to fire on a deliberately non-ASCII scratch file.
Allowlist-inversion on the changed file returns empty; no forbidden value is
written anywhere as a needle.

## Verify commands I judge WEAK, rather than banking their pass

Reported because the brief asked for this rather than for a clean bill.

1. **`[gap] no chronology or seniority token` is per line.** Safe *today* only
   because every alternate is a single token. Anyone adding a multi-word needle to
   that entry reintroduces the wrap hazard silently -- the comment says so, but a
   comment is not a gate.
2. **The `lineage` exclusion is a real hole.** A chronology claim phrased purely as
   lineage passes both halves. Narrowing it out was the correct call against the
   live false positive, but it is a scope limit, not a clean result.
3. **Both halves are scoped to the lz-red copy only.** Sound *because* the sha256
   byte-identity gate forces the three copies equal -- so the guard's coverage is
   only as good as that gate. If byte identity is ever relaxed, these two guards
   silently cover one third of the shipped surface.
4. **The needle set is a denylist of eight constructions.** It cannot see a ninth
   phrasing nobody thought of. There is no allowlist-inversion available for this
   class the way there is for email tokens.
5. **The roster gate cannot see a guard WEAKENED IN PLACE** -- its own comment says
   so. Neither new guard has a committed fixture set (the `row-guards.selftest.mjs`
   route was declined for the reasons above), so the injection evidence in this
   document is the *only* record that they fail. That evidence rots the moment
   someone edits the needles.
6. **GREEN is not acceptance.** This document has shipped with blocking defects
   twice behind a green battery -- six checkers passed the defective version at
   12/12, and a 146/146 battery passed four blocking defects. This round is a third
   instance of the same pattern: 173/173 GREEN over a banned construction. The
   independent unprimed review has **not** run and remains the real gate.

## Deviations

1. **Two checks rather than one `absent` entry.** The brief said "add a chronology
   absent-guard to the taxonomy's `absent` set" and separately granted a judgment on
   mechanism. The `absent` set carries the guard as instructed; the four multi-word
   needles additionally required a flattened mechanism, because they provably cannot
   be made single-line-matchable and provably cannot be narrowed to single tokens.
   `EXPECTED_CHECKS` moved by 2, not 1.
2. **`lineage` omitted from the needle set**, against the prose rule's wording but
   consistent with the brief's needle list and with its caution #2. Two legitimate
   occurrences measured; reported as a limitation above.
3. **The bolded `INDEPENDENT VOCABULARIES` lead was annotated, not reworded**,
   because `[wev G13]` pins the phrase. Flagged for the reviewer.
4. **No `node_modules` junction was created.** Nothing in this task needed it --
   every checker and both selftests use node builtins only, and no package-manager
   install was run. Recorded because the brief asked for it either way.

## Untouched, asserted rather than claimed

- `lib/row-guards.mjs`, `lib/pipe-table.mjs`, `lib/provenance-honesty.mjs`,
  `lib/scaffold-phrases.mjs`, `tools/row-guards.selftest.mjs`,
  `tools/provenance-honesty.selftest.mjs` -- all byte-unchanged
  (`git diff --stat` over both commits shows four files total: the checker and the
  three taxonomy copies).
- No path or env override was added to the checker; no bypass exists on a gate
  whose value rests on its paths being fixed.
- Zero new dependencies.
- Throwaway proof scripts were written to the session scratchpad, never into the
  repo.
