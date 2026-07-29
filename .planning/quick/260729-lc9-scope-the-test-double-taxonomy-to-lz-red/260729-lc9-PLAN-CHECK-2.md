# 260729-lc9 -- Plan-checker findings (iteration 2, FINAL)

**Ran:** 2026-07-29, gsd-core:gsd-plan-checker (re-check, iteration 2 of 2 -- LAST permitted)
**Verdict:** ISSUES FOUND -- 2 EXECUTION-BLOCKING, 8 NON-BLOCKING
**Plan checked:** `260729-lc9-PLAN.md`, 1019 lines, 4 tasks (Task 1 makes 2 commits = 5 total), 9 guards, 58 retirements
**All 13 iteration-1 findings: 12 CLOSED, 1 PARTIAL (IMPORTANT-5 -- its fix introduced BLOCKER-A).**

The revision is materially better than iteration 1: every number it corrected reproduces exactly,
every new leg is RED at baseline, and the two original blockers are genuinely closed. The two
blockers below are NEW, and one was created by the iteration-1 fix meant to close IMPORTANT-5 --
the `.continue-here.md` row "Fix breeds the same defect class" firing again.

---

## Section 1: OBSERVED exit codes, all four verify blocks run VERBATIM

Blocks extracted programmatically from the `<automated>` elements on disk, run with `bash` from the
repo root against the unmodified (dirty-by-design) tree.

| Block | `&&` legs | `;` | OBSERVED exit | First failing leg |
|---|---|---|---|---|
| Task 1 | 13 | 0 | **1** | leg 2 `! node check-red-references.mjs` -- battery is GREEN today |
| Task 2 | 14 | 0 | **1** | same shape |
| Task 3 | 12 | 0 | **1** | leg 3 `rg -q '125 checks...'` -- roster reports 174 today |
| Task 4 | 21 | 0 | **1** | leg 1 `test -s .planning/research/test-double-taxonomy.md` |

Baseline reproduced: battery exit 0, 175 emitted lines, roster prints
`174 checks, equal to the PREDICTED literal; all 34 new labels present; none of the 6 retired labels survive`.
Selftest exit 0. `check-hygiene.mjs` exit 0 (201 files). Plan is pure ASCII (0 non-ASCII bytes).
Working tree dirty exactly as documented: `M .planning/STATE.md`, `M ...260729-lc9-PLAN.md`.

---

## Section 2: BLOCKER-A (NEW) -- guard N9 CANNOT PASS. Tasks 3 and 4 are unsatisfiable.

**EXECUTION-BLOCKING. Hard deadlock, not a cosmetic miss.**

`PLAN.md:290-307` specifies N9 as a **`topics` guard on the `SKILL.md` FILES entry** with the needle
`/which side they mean[\s\S]*?\n## Reference material/i`.

The FILES-loop topic matcher is **PER LINE**:

```
check-red-references.mjs:548  const text = fs.readFileSync(filePath, "utf8");
check-red-references.mjs:549  const lines = text.split(/\r?\n/);
check-red-references.mjs:552  const hit = lines.some((line) => topic.re.test(line));
```

`:591` is the same for `absent` guards. `split(/\r?\n/)` strips every newline, so a needle containing
a newline can never match any element of `lines`. There is no precedent for a multi-line needle in
this mechanism -- searching the checker for the `[\s\S]` idiom returns nothing.

**Observed proof.** The needle run through the mechanism verbatim against three variants of the live
`lz-red/SKILL.md` (absent / rule inside the coach procedure / rule only in the appendix):

| Variant | FILES-loop per-line hit (the real mechanism) | whole-text hit (what the planner measured) |
|---|---|---|
| phrase absent | false | false |
| phrase INSIDE the coach procedure | **false** | true |
| phrase only in the appendix | false | false |

Row 2 is the defect: even when the executor does step 6 exactly right, N9 stays RED. The plan's own
"Measured discrimination, run this session against three variants of the live file" table at
`PLAN.md:301-305` reproduces the RIGHT-HAND column exactly -- so the planner measured the regex
against the whole file text and never through the evaluator that will actually run it. Neither
`PLAN.md` nor `RESEARCH.md` anywhere acknowledges the per-line FILES matcher (both DO note G17's
per-line nature, at `PLAN.md:590` and `RESEARCH.md:708`, which makes this a miss rather than an
unknown).

**Consequences.**

- Task 3 verify leg 2 is `node check-red-references.mjs` and must exit 0. With N9 permanently FAIL
  the battery exits 1. **Task 3's chain can never pass.** Its `<done>` ("Battery exits 0 at 125
  emitted checks") is unachievable.
- Task 4's chain runs the battery too, so it inherits the deadlock.
- Task 1's `<done>` asserts exactly 8 FAILs including `SKILL.md: [lc9] ...`. That leg passes, but for
  the wrong reason (structurally impossible, not "rule not written yet"), so N9's recorded proof kind
  is wrong: it is RED-ALWAYS, not RED-at-baseline.

**Every escape route an executor has is bad:**

| Route | Outcome |
|---|---|
| Implement literally | deadlock at Task 3 |
| Weaken to the bare `/which side they mean/i` | reintroduces the exact IMPORTANT-5 overclaim ("needle outlives its subject", a BLOCKING anti-pattern) |
| Change the shared FILES matcher to whole-text | unauthorized surgery on machinery serving ~100 topic and 14 absent guards; also shifts Task 1's exact-8 FAIL contract |
| Reimplement as a post-loop block | works, but the emitted label loses the `SKILL.md: ` prefix, contradicting Task 1's `<done>`, Task 2's `<done>` and the "compose EXACTLY as emitted" rule |

**Recommended fix (cheapest that keeps both the label and the region scope):** add a per-entry
`wholeText: true` flag to that ONE topic. The FILES spec already carries per-entry flags
(`requireFence`, `requireNonIgnoreFence`, `dir`), so at `:552`:
`const hit = topic.wholeText ? topic.re.test(text) : lines.some((line) => topic.re.test(line));`
Strictly additive, cannot weaken any existing guard, preserves the composed label
`SKILL.md: [lc9] side-qualification rule inline in the coach procedure`. The plan must then say so
explicitly and re-state the discrimination table as measured through the real evaluator.

---

## Section 3: BLOCKER-B (NEW) -- Task 1 step C (the entire fixture proof) has no verify leg

**EXECUTION-BLOCKING under the owner's stated criterion: an executor can exit 0 with the work undone.**

Task 1 verify leg 1 is a bare `node .claude/skills/lz-red-workspace/tools/row-guards.selftest.mjs`.

**Observed: the UNMODIFIED selftest exits 0 today.** So an executor who writes zero of Task 1 step
C's fixtures -- the six `scanTables` cases including the verbatim offender string
`table at line 1: header is 3 wide, but 1 row(s) differ -- line 3 is 2`, the `findLinkTargets`
per-kind cases, and the escaped-pipe `parseRows` case -- passes leg 1 and every other leg in the
chain. Nothing anywhere checks the offender-string FORMAT either, in the selftest or in the checker.

This matters because the fixture set is N1's **only** accepted falsifiability proof. CONTEXT hard
constraint: "Prove every new guard can fail. Two accepted proof kinds and only two." Exit gate: "The
new table-shape guard's fixture selftest exits 0 and **demonstrably FAILS on the pipe-deletion
fixture**." `.continue-here.md` blocking item 3: "PROVE A GUARD CAN FAIL BEFORE TRUSTING IT."

Note the shape: this is IMPORTANT-1 one level down. The revision correctly replaced `test -f` on
RED-BASELINE.md with six content legs, then left the artefact those legs DESCRIBE unchecked. The
RED-BASELINE row for N1 can claim a fixture list that was never written and legs 9-14 still pass.

**Recommended fix, one leg.** The selftest prints a section header per group and one `[PASS]` line
per assertion, so it is directly pinnable:

```
node .../row-guards.selftest.mjs > /tmp/lc9-st.txt \
  && rg -q -F 'table at line 1: header is 3 wide, but 1 row(s) differ -- line 3 is 2' /tmp/lc9-st.txt \
  && rg -q -F 'scanTables' /tmp/lc9-st.txt \
  && rg -q -F 'findLinkTargets' /tmp/lc9-st.txt \
  && rg -q -i 'escaped pipe' /tmp/lc9-st.txt
```

---

## Section 4: the 13 iteration-1 findings, one by one

### BLOCKER-1 (C-B1 had no verify leg) -- **CLOSED**

Both legs present (Task 4 legs 7 and 8 of 21). Observed against the live shipped taxonomy:

| Command | exit / count |
|---|---|
| `rg -c -F 'Clean Code versus Beck on whether a build failure is a valid red'` | 0, count **1** (unique anchor) |
| `rg -c -F 'TDD is Kanban for Code'` | **1** -- absent, so the positive leg is RED |
| `rg -U -q 'ANCHOR[\s\S]{0,900}TDD is Kanban for Code'` | **1** -- RED at baseline |
| region positive control, same anchor, needle `kanban cycle` | **0** -- the regex form works |
| `rg -c -F 'report and essays cited in his rows above'` | 0, count **1** -- the negative leg is non-vacuous |

Region-scoping verified load-bearing: naming the essay elsewhere in the file cannot satisfy the leg.

### BLOCKER-2 (blast radius wrong; pins covered 3 of 9) -- **CLOSED**

Every corrected number reproduced exactly:

- literal `warranted double` -> **5 lines in 4 files**: `anti-patterns.md:38,166`,
  `test-structure-and-assertions.md:130`, `message-matrix.md:79,137`.
- exact `the one warranted double` -> **4 lines**. `anti-patterns.md:38` reads "that one warranted
  double" -- exactly as the plan states.
- Variant-phrasing lines confirmed: `anti-patterns.md:128` ("the one warranted boundary"),
  `message-matrix.md:57`, `:73`, `vitest-typescript-mechanics.md:66`.
- `check-red-references.mjs:209` carries label "expect-to-send warranted double" with regex
  `/expect[ -]to[ -]send|expect to send/i`. The STRUCTURAL invariant holds: that regex cannot match
  `warranted` or `double` at any count, so no rename of the phrase at any site can redden the
  battery. The plan's H4 reasoning is exact.
- Scope distinction CONFIRMED: **5** expect-to-send lines in `message-matrix.md` (`:54,79,81,92,137`);
  the 6th across the lz-red tree is `vitest-typescript-mechanics.md:67`. RESEARCH's "six" and
  PLAN-CHECK's "five" are BOTH right in their own scopes, as claimed.
- All SIX pins measured at their asserted values (2,1,1,1,1,1) plus the 37-pipe-line pin. Pin-to-site
  mapping covers **all 7** out-of-scope sites (`:38` and `:166` by the count-2 pin, then `:128`,
  `:130`, `:79`, `:73`, `:66` each by its own literal).

### IMPORTANT-1 (existence-only `test -f`) -- **CLOSED**

Six content sub-legs run against four mock records:

| Subject | exit |
|---|---|
| conforming 9-row record | **0** |
| `touch`-created empty file | **1** |
| absent path | **1** |
| eight rows instead of nine | **1** |
| nine rows, `measured count 0` stripped | **1** |

A no-op cannot satisfy it. But see BLOCKER-B: the artefact these legs DESCRIBE is itself unchecked.

### IMPORTANT-2 (unsatisfiable file:line for presence-required guards) -- **CLOSED**

The direction table at `PLAN.md:340-343` is satisfiable and no line number is fabricated. Measured:

- Presence-required, all four **count 0**: `/test spy/i` in `message-matrix.md`; the Fowler-label
  phrase in `anti-patterns.md` AND `principle-backing.md`; `which side they mean` in
  `lz-tpp/SKILL.md` AND `lz-red/SKILL.md`.
- Absence-required located hits all exact: N2 = 2 (`test-double-taxonomy.md:289` in the lz-refactor
  and lz-tpp copies); N3 = 3 (the three tracked copy paths); N5 = `message-matrix.md:38,47,57,67`;
  N6 = `functional-core.md:42,44`, and only `:42` is an actual H2 heading, exactly as the plan says.

### IMPORTANT-3 (hygiene leg fail-open and narrower than its threat) -- **CLOSED**

Four subjects, all four in the chain, with the counted anchor first. Observed:

| Check | result |
|---|---|
| leg order: `test -s` (1), positive counted anchor (2), negatives (8-12), commit-count anchor (13) BEFORE the two commit-scoped legs (15,16) | correct |
| inversion over a clean copy | remainder 0, exit **0** |
| same copy plus a stray `someone@example.org` | remainder 1, exit **1** (discriminates) |
| same copy plus the approved contact | remainder 0, exit **0** |
| identity inversion over already-tagged commits, as written | remainder **0** |
| configured `user.email` inverted | remainder **0** -- the configured identity IS the approved contact, so the leg will not spuriously block execution |
| commit-message token inversion, as written | remainder **0** |
| `node check-hygiene.mjs` | exit **0**, 201 files, enumerate-then-subtract inversion, plus its own scan-floor anti-vacuity gate over identity-bearing anchors |

`check-hygiene.mjs` exists and performs exactly the inversion AGENTS.md requires over all three skill
trees, the root prose and both manifests. **The reuse is sound**, and its scope correctly does NOT
cover `.planning/`, which is why Task 4 leg 17 hand-rolls the inversion over the archived copy. Its
`wideTargets` walks all three `references/` dirs, so 201 drops to 198 at Task 3 -- and the plan
contains NEITHER literal (searched both: no match). The exit-code-only instruction is correct.

The existing `wip(quick-260729-lc9)` commit IS matched by the `--grep` in legs 14-16 but is correctly
EXCLUDED from the conventional-type count leg by its `^(test|fix|refactor|docs)` anchor. Its identity
and its message both invert clean, so it cannot poison the chain.

### IMPORTANT-4 (Task 1 writes numbers Task 3 falsifies) -- **CLOSED**

Every drift pair reproduced exactly by an independent fence-aware census over the shipped tree:

| Metric | measured BEFORE | measured AFTER (3 copies removed) | plan states |
|---|---|---|---|
| files | 197 | 194 | 197 -> 194 |
| inline links | 1014 | 990 | 1014 -> 990 |
| relative | 984 | 981 | 984 -> 981 |
| anchor | 30 | 9 | 30 -> 9 |
| tables | 31 | 28 | 31 -> 28 |
| pipe rows | 405 | 297 | 405 -> 297 |
| scheme / absolute / fenced links / ragged | 0 / 0 / 0 / 0 | 0 / 0 / 0 / 0 | four zeroes, invariant |
| unresolved relative links | exactly 2, both `test-double-taxonomy.md:289` pointing at `principle-backing.md` | 0 | H1 exact |

Escaped pipes independently re-checked WITH a positive control (the environment warns about a
degenerating pattern): the shipped tree has **0**; `.planning/research/STACK.md:26,126,127` has
**3** -- the live proof class the plan cites. The "write the invariant or write nothing" rule at
`PLAN.md:265-267` is stated, and Task 3 step 8 now carries a SECOND sweep target for the comments
Task 1 itself writes. Closed.

### IMPORTANT-5 (N9 label overclaims relative to its needle) -- **PARTIAL**

The diagnosis and the region-scoping logic are right, and the claimed discrimination table reproduces
exactly under whole-text evaluation:

| Placement | region-scoped | bare file-wide |
|---|---|---|
| absent | 1 (false) | 1 (false) |
| inside coach procedure | **0 (true)** | 0 (true) |
| appendix only | **1 (false)** | **0 (true)** -- the overclaim, confirmed |

`## Coach decision procedure` is at `lz-red/SKILL.md:52` and `## Reference material` at `:141`, so the
region key is real and stable. **But the delivery mechanism is wrong** -- see BLOCKER-A. The fix for
IMPORTANT-5 produced a guard that can never pass.

### MINOR-1 (ARCHIVED vs INERT RECORD) -- **CLOSED**
`PLAN.md:735-736` demands the exact uppercase literal `INERT RECORD` and explicitly forbids the other
wording. The verify greps that literal. Consistent.

### MINOR-2 (D-11 substantive half ungated) -- **CLOSED**
Task 4 leg 6 is region-scoped. Observed on the live taxonomy: the production-side anchor bullet at
`:106`; `read end to end` file-wide count **1** (`:136`, uppercase, matched by `-i`); the 600-char
region leg exits **1** (RED); the 3000-char widening exits **0** (calibration confirmed); the
file-wide equivalent exits **0**, i.e. **VACUOUS** -- so region-scoping is mandatory, not stylistic,
exactly as the plan claims.

### MINOR-3 (pipe-table header rewrite front-loaded) -- **CLOSED**
Task 1 A4 now explicitly forbids the rewrite and states why; Task 3 step 15 OWNS it. Citations
verified on disk: the taxonomy measurement is the `:16-18` block; the `principle-backing.md`
measurement (37 pipe-leading lines, 3 columns) is the block that follows and survives.

### MINOR-4 (shape protection attributed to the wrong control) -- **CLOSED**
`<done>` now states the 37-pipe-line pin proves only that no row was added or removed and that N1 is
the WIDTH control. A dedicated `[PASS].*no ragged pipe table` count leg is present in Task 2 and is
RED at baseline (needle absent from the baseline output, exit 1).

### MINOR-5 (D-04 not gated mechanically) -- **CLOSED**
Task 4 leg 14 asserts zero tagged commits touch `.claude/agents/`. Observed 0 today; the positive
control (same command without the grep) returns 22 commits, so the form discriminates and is not a
constant zero.

### MINOR-6 (nobody owns the planning-artifact commit) -- **CLOSED**
STEP ZERO at `PLAN.md:172-191`. `STATE.md` and the four planning artifacts appear in the frontmatter
`files_modified` (`:26-30`) and in Task 1 `<files>` (`:164-168`), staged BY NAME. Commit count 4 -> 5
across `<objective>`, `<done>`, `<success_criteria>` and Task 4 leg 13, which is RED at baseline (the
conventional-type count is 0 today), so it doubles as the anti-vacuity control for legs 15 and 16 as
claimed. The five planned subjects map one-to-one onto the anchored types (docs, test, fix, refactor,
docs).

**Fallback coherence (asked for explicitly): COHERENT, and it fails closed.** If the tree is clean at
Task 1 start, step zero is skipped and the executor must reduce the literal 5 to 4. A missed edit
produces a spurious FAIL, never a false PASS, so there is no deadlock in the dangerous direction.
Today the tree is DIRTY, so the 5-commit path is the live one and the fallback branch is dead.
See NB-5.

---

## Section 5: regression check -- everything iteration 1 confirmed sound still holds

| Item | Re-verified | Evidence |
|---|---|---|
| All eight owner boundary steps covered | yes | 1 -> T4 B; 2 -> T1 N1; 3 -> T2; 4 -> T3 A; 5 -> T3 A,B; 6 -> T4 D plus T3 step 8; 7 -> T3 D; 8 -> T3 step 8 plus T4 A |
| D-01..D-12 honored; frontmatter carries all 12 | yes | `requirements: [D-01..D-12]`; `<decisions_coverage>` names an implementing task per decision |
| D-12 baseline preserved | yes | no runtime artifact authored; lz-red keeps the inline rule and NO reference file; N3 makes the absence machine-enforced; `<success_criteria>` states it. Confirmed still absent and still deliberate. |
| 58 retirement labels, 0 duplicates, 0 mismatches | yes | 58 extracted from RESEARCH Q2 fenced blocks; 0 duplicates; **all 58 match an emitted baseline line verbatim** |
| Reverse direction clean | yes | only ONE taxonomy-ish emitted label is absent from the retire list -- the G17 label, which the plan deliberately KEEPS ("retire 58, keep 2") |
| `174 - 58 + 9 = 125` and `174 + 9 = 183` | yes | baseline `EXPECTED_CHECKS = 174`, 175 emitted lines (174 plus roster) |
| `NEW_LABELS` 34 -> 13 | yes | 16 taxonomy literals plus `TWO_IG_GUARDS.map` (7 row-scoped plus 9 count = 16) plus 2 chronology = 34; after: 4 surviving row-scoped plus 9 lc9 = 13 |
| `RETIRED_LABELS` 6 -> 64; `ROW_SCOPED_GUARDS` 7 -> 4; `COUNT_GUARDS` 9 -> deleted; `OLD_NEEDLES` 7 -> 4 | yes | live module import measures 6 / 7 / 9 / 7 today; arithmetic consistent with steps 3, 9, 10, 13 |
| `FILES.length` 12 -> 11 | yes | 12 `name:` entries measured (the `lz-tpp/SKILL.md` emitted prefix comes from a post-loop SEAM-02 block, NOT a FILES entry); the header at `:20` says "TWELVE FILES entries" |
| Composed-label forms exact | yes | the FILES loop emits `<entry name>: <label>`; emitted prefixes include `testing-stance/message-matrix.md`, `testing-stance/functional-core.md` and `SKILL.md` (entry at `:311`, `dir`-overridden) -- so the plan's composed labels are byte-right |
| Roster needles match the emitted format | yes | live format is `... -- 174 checks, equal to the PREDICTED literal; all 34 new labels present; none of the 6 retired labels survive`, so all four plan needles are correct forms |
| Task 1 leg 3 (exactly 8 FAILs) is a TIGHT gate | yes | `report()` emits exactly ONE line per check (`:527`), and the roster gate is all-or-nothing over count plus missing-new plus surviving-retired -- so `FAIL == 8` implies the roster PASSED, which implies all nine lc9 labels really are in `NEW_LABELS` |
| Ordering hazard H1 holds | yes | the only 2 unresolved relative links today are the two `:289` hits Task 3 deletes; Task 1 captures them first |
| Proof kinds clean, never both of one guard | mostly | N1 invariant-GREEN plus fixtures; N2-N8 RED-at-baseline, all confirmed genuinely RED. **N9 is RED-ALWAYS, not RED-at-baseline -- BLOCKER-A** |
| `scanTables` and `parseRows` share ONE escaped-pipe-aware splitter | yes as specified | `pipe-table.mjs:47` is the naive `line.split("|").slice(1,-1)`; the sharing requirement is stated with its load-bearing reason |
| Task 4 negative-assertion needles non-vacuous | yes | all FOUR match today, count 1 each, plus the relative-link needle count 1 |
| G17 before/after scope claim | yes, structurally | target list = 3 reference trees minus the taxonomy basename, plus 3 routers; the copies were excluded before and do not exist after, so the set is IDENTICAL -- stronger than a count |
| Replacement router sentences do not trip G17 | yes | `BARE_WORD_RE` is word-bounded over the four inflections; the allowlist is an IMMEDIATELY-PRECEDING same-line side qualifier or the meta-mention form. Every occurrence in the three proposed replacements is side-qualified on the same line; the lz-refactor replacement contains none. The plan's one-line constraint is exactly right. |
| lz-tpp `:93,95` are the only occurrences; lz-refactor tree has ZERO | yes | measured, excluding the copies |
| `.planning/research/` exists with 5 tracked files | yes | `git ls-files` |
| Chaining discipline | yes | 0 semicolons in all four blocks; 13 / 14 / 12 / 21 `&&` legs |
| No `rg -E` anywhere; the trap is documented | yes | zero occurrences in any leg; the warning is at `PLAN.md:840-843` |
| Plan is ASCII-only | yes | 0 non-ASCII bytes |

---

## Section 6: NON-BLOCKING findings

**NB-1. Task 3 leg 7 is fail-open on a path typo.** The `taxonom`-absent leg over
`principle-backing.md` uses `git grep -c ... | wc -l = 0`; a mistyped or untracked path makes
`git grep` write to stderr and emit nothing, so `wc -l` reads 0 and the leg PASSES. Task 3's chain has
no positive counted assertion on that file. Legs 11 and 12 (`rg -c ... | wc -l = 0` on the checker)
are the same class, mitigated because leg 2 `node`s the identical path. Legs 6, 9 and 10 are safe
because 9 and 10 are positive counted assertions inside the shipped tree. Cheap fix: prepend a
positive anchor on `principle-backing.md` -- the Fowler-label phrase is present after Task 2. Do NOT
use its pipe-line count as the anchor: it drops 37 -> 36 when the taxonomy row is deleted.

**NB-2. G17's emitted LABEL becomes a stale claim.** It names the taxonomy as the thing the gate looks
"outside" of, and after Task 3 no such document exists. Step 8 sweeps G17's scope COMMENT
(`:669-679`) but not the label string. The label is NOT in `NEW_LABELS`, so renaming it is safe and
breaks no gate. This is precisely the class step 6 exists to close, applied to the instrument's own
output.

**NB-3. Task 3 step 12's REPLACEMENT is unlegged.** The plan says "Do NOT just delete it" of the
composed-strings assertion, but the only leg is the selftest exiting 0 -- which deleting the assertion
also satisfies. Same one-leg fix shape as BLOCKER-B.

**NB-4. H2 (pure `git mv`, no content change) has no mechanical leg**, and the byte-identity gate that
would have caught a pre-move edit is deleted in the same commit. The end state is unaffected (Task 4
lands the same edits either way), so the harm is history legibility only. The plan already flags H2 in
prose as the single most likely executor misreading.

**NB-5. Step zero's fallback authorizes the EXECUTOR to edit a verify literal (5 -> 4).** It fails
closed, and today's dirty tree makes the branch dead. But the standing project rule "always commit
STATE.md after plan-phase completes" makes the clean-tree branch reachable if the orchestrator commits
before dispatch. Recommendation: do NOT commit `PLAN.md` / `STATE.md` before dispatching, so the
fallback stays dead and the 5-commit contract stands unmodified.

**NB-6. Task 4's inert-header content beyond two literals is unlegged.** `INERT RECORD` and
`plugin-wide shared reference` are gated; the three failed gates, the 2 BLOCKING / 15 IMPORTANT /
10 MINOR counts, the ACCEPTANCE-REVIEW path and the what-remains-open list are not. The plan is
explicit that the unprimed review in `<orchestrator_followup>` is the real gate here. Recorded for
completeness.

**NB-7. Task 2's Test Spy leg is file-level.** It proves the phrase exists somewhere in
`message-matrix.md`; it does not pin the `:57` bullet or the in-fence `:137` comment. N4's topic guard
(covered collectively by the exact-4 FAIL count) is also file-wide. Acceptable given N1 protects table
shape and the six pins protect the blast radius.

**NB-8. Advisory on scope.** Task 3 is 15 numbered steps across 12 files in ONE commit. The atomicity
argument (H3, H6) is sound and I could not find a valid split, so this is not a defect -- but it is
the plan's largest context unit and its highest-risk task, and it is where BLOCKER-A surfaces.

---

## Section 7: anti-pattern sweep against `.continue-here.md`

| Pattern | Status in this revision |
|---|---|
| Verify block that passes on a no-op | CLOSED for the RED-BASELINE record (5 controls run). **OPEN for the selftest fixture set -- BLOCKER-B.** |
| Coverage hole in a verify chain | CLOSED for C-B1 and D-11. **OPEN for Task 1 step C -- BLOCKER-B.** Minor residue at NB-3, NB-6, NB-7. |
| Blast radius asserted, not measured | CLOSED. Every site and count re-measured and exact; the plan now states the commands and tells the executor its own measurement wins. |
| Fail-open guard on an absent subject | CLOSED for Task 4 (counted anchor first, verified). Residual at NB-1. |
| Fix breeds the same defect class | **FIRING.** The IMPORTANT-5 fix produced BLOCKER-A, and the IMPORTANT-1 fix moved the same shape one level down into BLOCKER-B. |
| Needle outlives its subject | CLOSED in intent (both region-scoped legs verified). Residual at NB-2 (G17 label). |
| Inferring behavior from structure | **FIRING at one site.** N9's discrimination table was measured against the regex, not against the evaluator that runs it. |

---

## Section 8: verdict

**ISSUES FOUND. 2 EXECUTION-BLOCKING, 8 NON-BLOCKING.**

| # | Finding | Class | Fix size |
|---|---|---|---|
| A | N9's needle cannot match under the per-line FILES matcher; Tasks 3 and 4 are unsatisfiable | **EXECUTION-BLOCKING (hard deadlock)** | one per-entry `wholeText` flag plus 1 line at `:552`, plus restating the discrimination table |
| B | Task 1 step C (the whole fixture proof for N1) has no verify leg | **EXECUTION-BLOCKING (exit 0 with the work undone)** | one leg; the selftest output is already pinnable |
| NB-1..NB-8 | see Section 6 | NON-BLOCKING | one leg each, or nothing |

Both blockers are MECHANICAL. Neither is a design question and neither touches a locked decision.
The iteration cap is exhausted, so the choice is force-proceed with a written executor caveat, or a
targeted hand-fix of two verify blocks followed by execution.

**If force-proceeding, note the failure shape:** BLOCKER-A will HALT the executor at Task 3 rather
than let a defect ship, so it is a stall, not a silent regression. But the most tempting escape from
that stall is to weaken N9's needle to the bare file-wide form, which ships exactly the overclaim
IMPORTANT-5 identified. Any force-proceed instruction must name that escape and forbid it, and must
also tell the executor that leg 1 of Task 1 does not check its own step C.
