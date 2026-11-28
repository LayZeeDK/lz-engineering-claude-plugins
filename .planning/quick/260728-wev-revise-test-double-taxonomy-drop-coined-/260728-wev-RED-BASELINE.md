# Quick Task 260728-wev: RED baseline for the revised checker

**Captured:** 2026-07-29
**Instrument:** `.claude/skills/lz-red-workspace/tools/check-red-references.mjs`
**Tree state at capture:** the checker is revised; NOTHING under `plugins/` is modified. Asserted, not
claimed: `git diff HEAD --name-only -- plugins/` was empty at capture time. Once Task 2 runs this
baseline is unrecoverable and the primary control becomes unverifiable forever, which is why the
ordering is load-bearing rather than bookkeeping.

## Pre-work commit

Task 3's email allowlist-inversion scan diffs against this SHA rather than against `HEAD`, because
execute-plan commits PER TASK: by the time Task 3 verifies, Tasks 1 and 2 are already committed and a
`HEAD`-relative scan would see only Task 3's files, silently excluding the taxonomy rewrite -- the
single largest block of new prose in this revision -- from the only mitigation for a HIGH-severity
public-repo disclosure threat (T-wev-01).

BASE=bdeb81dde086fbb898d9d59365acbe14298b7a72

## Check arithmetic

Measured baseline before the revision: **132** emitted checks, 0 FAIL, exit 0. Composition:
102 topics + 6 `requireFence` + 1 `requireNonIgnoreFence` + 12 scaffold + 8 `absent` + 3 post-loop.

Derivation after the revision, so a silently dropped guard is caught by a NUMBER rather than by
inspection:

| Bucket | Before | Change | After |
| --- | --- | --- | --- |
| topics | 102 | minus 3 removals (R1, R2, R3), plus 7 positive topics (G6-G10, G13, G16) | 106 |
| `requireFence` | 6 | unchanged | 6 |
| `requireNonIgnoreFence` | 1 | unchanged | 1 |
| scaffold | 12 | unchanged | 12 |
| `absent` | 8 | plus 9 (G1-G5, G11, G12 on the taxonomy; G14, G15 on SKILL.md) | 17 |
| post-loop | 3 | plus 1 (G17, the bare-qualifier gate) | 4 |
| **TOTAL** | **132** | | **146** |

**Measured after the revision: 146 emitted checks, 17 FAIL, exit 1.** Predicted total and predicted
FAIL count both hit exactly, so no guard was lost between design and implementation.

## Roster shape

THREE removals and SEVENTEEN guards, G1 through G17, contiguous with no gaps and every one
unconditional. There is no option-dependent guard and no conditional path: all seventeen were added,
all seventeen failed at baseline, and all seventeen have a row below. `TAXONOMY_LABEL` is the sha256
gate's label, not a coinage gate, and was not touched (still 3 occurrences).

### The three removals

| Removal | Needle removed | Defect class | Why removed |
| --- | --- | --- | --- |
| R1 | the bare word for inventing a term | needle OUTLIVED ITS SUBJECT -> false PASS | Two unrelated occurrences about Meszaros naming the umbrella term survive at taxonomy lines 56 and 145, so the topic keeps reporting PASS while the thing it exists to police is gone. Removed rather than narrowed: a guard that cannot fail is worse than no guard. This was the LIVE fifth false-GREEN. |
| R2 | the word for the fabricated mapping's audit status | subject deleted; cannot coexist with its replacement | The caveat is deleted by Task 2, and the topic cannot coexist with absent guard G4. |
| R3 | the word for two senses of differing age | SUBJECT DELETED FROM UNDER A NEEDLE -> false FAIL | Measured: exactly one occurrence, taxonomy line 71, the opening line of the very block Task 2 deletes. The topic's sole subject disappears and it flips PASS to FAIL, making Task 3's exit-0 requirement unsatisfiable. NOT converted into an absent guard: that would create an eighteenth guard and reopen the contiguous numbering. |

R1 and R3 are the two ends of one coupling bug -- a positive topic silently depending on prose that
another change is free to move. A plan that hunts only the false-PASS direction deadlocks on the
false-FAIL direction.

## Per-guard baseline evidence

Every row below is a guard that FAILED against the unmodified content tree. Any guard that did not
fail at baseline is defective; none had to be excused.

| Guard | What it asserts | Needle, in words | Baseline file:line evidence | Emitted FAIL line |
| --- | --- | --- | --- | --- |
| G1 | The invented two-word term is absent from the taxonomy | the two-word coinage | `test-double-taxonomy.md:22` (TOC entry), `:182` (section-5 heading), `:189` (coining paragraph), `:305` (Sources bullet); the coinage declaration also sits at `:14` | `[FAIL] test-double-taxonomy.md: [wev G1] no invented term -- stale marker still present (matches /signature skeleton/i)` |
| G2 | No cell is asserted to be named by no author | the self-falsifying no-author phrase | `test-double-taxonomy.md:46` -- and the document's own table populates that cell with FIVE rows (125, 130, 134, 136, 144), which is the falsification that started this revision | `[FAIL] test-double-taxonomy.md: [wev G2] no empty-cell assertion -- stale marker still present (matches /no author names/i)` |
| G3 | No skill-relative self-reference; the file is byte-identical across three skills so a relative reference is false in two of the three copies | the relative form naming the current skill | `test-double-taxonomy.md:14`, `:113`, `:177`. All THREE. Line 177 is inside the two-live-conflicts note and is the easiest to miss, because the surrounding sentence goes on to name lz-red explicitly | `[FAIL] test-double-taxonomy.md: [wev G3] no skill-relative self-reference -- stale marker still present (matches /\bthis skill\b/i)` |
| G4 | The fabricated mapping's audit-status caveat is gone | the audit-status word | `test-double-taxonomy.md:69`, `:236` | `[FAIL] test-double-taxonomy.md: [wev G4] no unaudited-mapping caveat -- stale marker still present (matches /\bunaudited\b/i)` |
| G5 | The degraded-scan caveat carries no carve-out | the single-cell carve-out phrase | `test-double-taxonomy.md:243` -- the exempted cell is precisely the fabricated one, so the carve-out inverted the actual reliability | `[FAIL] test-double-taxonomy.md: [wev G5] no degraded-scan carve-out -- stale marker still present (matches /other than the Beck cell/i)` |
| G6 | The three-axis count is named | the axis count as a word plus the word axes | zero occurrences in `test-double-taxonomy.md` at baseline (the document says two) | `[FAIL] test-double-taxonomy.md: [wev G6] three-axis count named -- topic token absent` |
| G7 | The never-assert-an-empty-cell doctrine is STATED, not merely obeyed | the doctrine sentence's verb | zero occurrences in `test-double-taxonomy.md`. Verified NOT satisfied by the existing declines-an-etymology sentence at `:85`, so the guard is falsifiable even when every cell happens to be populated | `[FAIL] test-double-taxonomy.md: [wev G7] never-assert-an-empty-cell doctrine stated -- topic token absent` |
| G8 | The Bernhardt row names a specific delivery | either of the two delivery names | zero occurrences in `test-double-taxonomy.md`; the row at `:138` and the Sources bullet at `:280` both cite the talk with no delivery | `[FAIL] test-double-taxonomy.md: [wev G8] Bernhardt row names a specific delivery -- topic token absent` |
| G9 | The tier block carries the version qualifier | the compound adjective for version-boundness | zero occurrences in `test-double-taxonomy.md`; the closing tier rule at `:307-310` carries the per-row rule only | `[FAIL] test-double-taxonomy.md: [wev G9] tier assertions are version-bound -- topic token absent` |
| G10 | The medium qualifier names what an automatic transcript can garble | the word for a transcription error | zero occurrences in `test-double-taxonomy.md` | `[FAIL] test-double-taxonomy.md: [wev G10] transcript mistranscription named -- topic token absent` |
| G11 | The non-occurring Metz term is gone from row, rejection list and Sources bullet alike | the term absent from the twenty-one-file corpus | `test-double-taxonomy.md:132` (table row), `:207` (rejection list), `:275` (Sources bullet) | `[FAIL] test-double-taxonomy.md: [wev G11] no non-occurring Metz term -- stale marker still present (matches /do-nothing method/i)` |
| G12 | No superseded axis-count or four-cell wording survives anywhere in the file | one needle over the axis-count phrase and the four-cell phrase | `test-double-taxonomy.md:18` (TOC link text AND its anchor slug), `:26` (section-1 heading), `:45` (the four-cell sentence). LOAD-BEARING: topics are file-scoped, so G6 alone would be satisfied by new prose appearing anywhere while all three old sites still stand -- a document asserting both axis counts, at full GREEN | `[FAIL] test-double-taxonomy.md: [wev G12] no superseded two-axis or four-cell wording -- stale marker still present (matches /two[ -]axes\|four cells/i)` |
| G13 | The independence claim replaces the deleted seniority argument | the two-word phrase for two vocabularies that collided without either author citing the other | zero occurrences in `test-double-taxonomy.md`. The bare word alone would be VACUOUS -- `:187` already says twelve independent sources -- and was verified NOT to satisfy this needle | `[FAIL] test-double-taxonomy.md: [wev G13] independent vocabularies, no seniority claim -- topic token absent` |
| G14 | The worked example's fenced comment does not deny what step 5 sanctions | the trailing clause of the fenced comment | `SKILL.md:112`. The CORRECT sibling clause at `:105` differs by two words and was verified NOT caught | `[FAIL] SKILL.md: [wev G14] worked example does not deny the not-implemented throw -- stale marker still present (matches /not a missing symbol/i)` |
| G15 | The worked example's wrong body is not the identity return | the exact bare return statement, semicolon included | `SKILL.md:127`. Three real-implementation forms and a sentinel body were all verified NOT caught, so the semicolon anchor discriminates as intended | `[FAIL] SKILL.md: [wev G15] worked-example body is not the identity return -- stale marker still present (matches /^\s*return total;\s*$/)` |
| G16 | The kanban-cycle essay is named as the owned surface | the essay title | zero occurrences of the title anywhere under `plugins/` at baseline; `principle-backing.md:67` says the surface was not established while `:81` and `:84-85` count Beck among four owned sources citing it | `[FAIL] principle-backing.md: [wev G16] kanban-cycle essay named as the owned surface -- topic token absent` |
| G17 | No bare unqualified contested word outside the three taxonomy copies | word-bounded noun and verb forms, allowlisting only an immediately preceding canonical side qualifier or the quotes-the-word meta-mention | SEVEN sites, matching the audit exactly: `anti-patterns.md:32`, `principle-backing.md:85`, `vitest-typescript-mechanics.md:64`, `lz-red/SKILL.md:99`, `:100`, `:111`, `:124` | `[FAIL] [wev G17] no bare unqualified contested word outside the taxonomy -- 7 bare use(s): plugins/lz-tdd/skills/lz-red/references/anti-patterns.md:32 (stub); plugins/lz-tdd/skills/lz-red/references/principle-backing.md:85 (stub); plugins/lz-tdd/skills/lz-red/references/vitest-typescript-mechanics.md:64 (stub); plugins/lz-tdd/skills/lz-red/SKILL.md:99 (stub); plugins/lz-tdd/skills/lz-red/SKILL.md:100 (stub); plugins/lz-tdd/skills/lz-red/SKILL.md:111 (stub); plugins/lz-tdd/skills/lz-red/SKILL.md:124 (stub)` |

## G17 reconciliation

Expectation stated BEFORE the run: seven flagged sites, not six -- the six audit-confirmed violations
plus the non-canonical capitalised form at `lz-red/SKILL.md:124` that Task 3 canonicalises. Actual
output: seven, at exactly those seven sites. No unexplained difference, so the gate agrees with the
audit and neither needed correcting.

The two meta-mentions the audit classified as non-violations -- `lz-red/SKILL.md:153` and
`lz-tpp/SKILL.md:93` -- were correctly allowlisted and did NOT appear, which is the positive control
on the allowlist half of the gate: it discriminates rather than flagging every occurrence.

## Needle discrimination checks

Four guards can fail in a direction a bare presence check would miss, so each was checked against the
sibling text it must NOT catch. All fifteen cases behaved as designed:

Row ids in this table are deliberately written as `Guard GNN` rather than as a bare guard id, so the
seventeen-row assertion over the roster table above counts the roster and nothing else.

| Which guard | Must MATCH | Must NOT match | Result |
| --- | --- | --- | --- |
| Guard G14 | the fenced comment at `SKILL.md:112` | the correct prose lead-in at `:105`, which differs by two words | discriminates |
| Guard G15 | the identity return at `SKILL.md:127` | a real implementation beginning with the same two words followed by an operator (minus and multiply forms checked), and a sentinel return | discriminates |
| Guard G12 | all three superseded sites, including the anchor slug's hyphenated form | the legitimate new phrasing about all four COMBINATIONS of the first and second axes, and the new three-axis heading | discriminates; combinations are not cells |
| Guard G13 | the independence phrasing | the existing twelve-independent-sources sentence at `:187`, which would have made the bare word vacuous | discriminates |
| Guard G7 | the doctrine sentence | the existing declines-an-etymology sentence at `:85` | discriminates |

## Untouched, and asserted rather than claimed

- `grade-red.mjs` -- byte-unchanged. Thirty-six recorded eval runs depend on it.
- `lib/provenance-honesty.mjs` -- byte-unchanged; its selftest still exits 0.
- `TAXONOMY_LABEL` -- still 3 occurrences. It is the sha256 gate's label, not a coinage gate.
- Every pre-existing topic, flag and gate other than the three named removals.
- Everything under `plugins/` -- unmodified at capture time.

## Falsifiability note

The FAIL count and the emitted check total are both asserted numerically in Task 1's verify block, so
a silently dropped guard fails the task rather than passing unnoticed. That matters here specifically:
the battery passed this content at 12/12 GREEN while every defect the revision fixes was present, so
GREEN is necessary and not sufficient, and a guard is only trusted because it was SEEN to fail.
