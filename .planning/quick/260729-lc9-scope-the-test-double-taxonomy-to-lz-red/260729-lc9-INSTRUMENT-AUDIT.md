# quick-260729-lc9 -- INSTRUMENT AUDIT (what the instrument's own gates cannot see)

Independent audit of `0990862..384568e` against the pre-change instrument recovered from git.
Read-only on the main working tree. Every claim below carries the command and the observed output.

Scope of the audit: the four instrument files
`.claude/skills/lz-red-workspace/tools/check-red-references.mjs`,
`tools/lib/row-guards.mjs`, `tools/lib/pipe-table.mjs`, `tools/row-guards.selftest.mjs`.

Working-tree note: at audit time `plugins/lz-tdd/skills/lz-tpp/SKILL.md` and
`plugins/lz-tdd/skills/lz-refactor/references/beck-tdd-by-example.md` are reverted to their
`lz-tdd@0.0.2` state (owner ruling, uncommitted), so the live battery exits 1 with 2 FAILs. That is
expected and out of scope. All measurements below were taken against the COMMITTED state at
`384568e` in a throwaway worktree, so they are unaffected.

---

## Method: recovering the pre-change emitted LABEL set

The roster gate compares against the `label` argument of `report(ok, label, detail)`, not against
the printed line. Splitting stdout on `" -- "` would be guesswork, so the label array was captured
directly. Two throwaway detached worktrees were created (`0990862` and `384568e`), a copy of each
checker was patched to add one exit hook after `const emittedLabels = [];`

```js
process.on("exit", () => fs.writeFileSync(process.env.LABEL_OUT, JSON.stringify(emittedLabels, null, 1)));
```

and each was run. Both exited 0.

```
pre  (0990862): 175 labels captured   (174 emitted before the roster + the roster label itself)
post (384568e): 126 labels captured   (125 emitted before the roster + the roster label itself)
```

The same hook was extended to serialise the `FILES` spec (every topic/absent label plus
`String(regex)` plus the per-entry flags) for the weakened-in-place comparison.

---

## 1. TRANSCRIPTION VERDICT -- 58/58 EXACT. No mismatch.

`RETIRED_LABELS` went 6 -> 64; the 58 newly added entries are exactly the ones this change added.

```
pre RETIRED count=6
post RETIRED count=64
pre-only: []            (nothing was dropped from the roster)
newly added count=58
```

Every one of the 58 was compared, byte-for-byte, against the captured pre-change label array:

```
== newly retired entries: 58
EXACT MATCH in pre-change emitted labels: 58
NO MATCH: 0
== duplicate emitted labels PRE: []
== duplicate emitted labels POST: []
== duplicate RETIRED_LABELS entries: []
```

The four odd shapes the roster comment flags as the likely transcription errors were each checked
individually and each is correct:

| Shape | Roster entry | Verified |
|---|---|---|
| bracket prefix FIRST, before the filename | `[j9m] test-double-taxonomy.md: no scaffold phrase` | exact |
| NO colon after the filename | `[j9m] test-double-taxonomy.md byte-identical across all three skills` | exact |
| no filename prefix at all | `[2ig] owned-source count re-derived across both files` | exact |
| no bracket prefix (Phase-18 originals) | `principle-backing.md: Three Laws backing row`, `principle-backing.md: lz-tpp seam backing row` | pre-existing 6, unchanged |

**Label-versus-detail subtlety: handled correctly.** The pre-change run printed

```
  [PASS] [j9m] test-double-taxonomy.md byte-identical across all three skills -- sha256 3bb4a27fa17d in all three
```

but the captured LABEL is

```
"[j9m] test-double-taxonomy.md byte-identical across all three skills"
```

because the pre-change source passed the digest as the third argument
(`report(identical, TAXONOMY_LABEL, `sha256 ${...}`)`, `git show 0990862:...check-red-references.mjs`
line 638ff). The roster entry carries the label-only form -- correct. Had it carried the sha256 the
gate would have been permanently, invisibly vacuous.

### Related finding: 59 labels vanished, only 58 are rostered

```
== labels emitted PRE but not POST: 59
== vanished but NOT recorded in RETIRED_LABELS: 1
    "[wev G17] no bare unqualified contested word outside the taxonomy"
== labels emitted POST but not PRE: 10
```

The 59th is a RENAME, not a retirement (see section 6.1). `174 - 59 + 10 = 125` checks out; the
comment's `174 + 9 - 58 = 125` is arithmetically right only because the rename pair cancels.

---

## 2. WEAKENED IN PLACE -- none found. One guard was STRENGTHENED.

### 2.1 `FILES` topics and absent guards: zero surviving predicate changed

The serialised `FILES` spec was diffed key-by-key (key = the COMPOSED label, value = the regex
source plus flags):

```
== FILES entries pre=12 post=11
== keys removed: 44        (the departed entry: 29 topics + 14 absent + the entry itself)
== keys added: 4           (the four [lc9] FILES-entry guards)
== keys CHANGED IN PLACE: 3
```

All three "changed" keys are per-ENTRY summary rows whose only delta is the added guard count
(`absentCount 0 -> 1` on the two testing-stance entries, `topicCount 10 -> 11` on SKILL.md).
`requireFence` / `requireNonIgnoreFence` / `scaffoldExempt` / `deferral` are identical on every
surviving entry, and **not one surviving topic or absent regex changed**.

### 2.2 The loop mechanism widening is opt-in and inert on every pre-existing topic

```diff
-    const hit = lines.some((line) => topic.re.test(line));
+    const hit = topic.wholeText ? topic.re.test(text) : lines.some((line) => topic.re.test(line));
```

`wholeText` is set on exactly ONE topic in the whole spec (the new N9 SKILL.md guard). Every other
topic serialises as `wholeText:false`, so each keeps the per-line path byte-for-byte. Not a
weakening.

### 2.3 `[wev G17]` -- STRENGTHENED, and the label was renamed to match

```diff
-const BARE_QUALIFIER_LABEL = "[wev G17] no bare unqualified contested word outside the taxonomy";
-const TAXONOMY_BASENAME = "test-double-taxonomy.md";
+const BARE_QUALIFIER_LABEL = "[wev G17] no bare unqualified contested word in the shipped tree";
...
 const bareQualifierTargets = [
-  ...referenceTreeFiles.filter((file) => path.basename(file) !== TAXONOMY_BASENAME),
+  ...referenceTreeFiles,
```

That is the ENTIRE code delta for G17 (`diff -u` of the two blocks; the three regexes
`BARE_WORD_RE` / `SIDE_QUALIFIED_RE` / `META_MENTION_RE`, the walk, the allowlist and the
fail-closed error handling are byte-identical). Removing an exemption filter widens the target set,
so the predicate got stronger.

### 2.4 `pipe-table.mjs` `parseRows`: the only change to existing code is a correctness fix

```diff
-    const cells = line.split("|").slice(1, -1).map((cell) => cell.trim());
+    const cells = splitCells(line);
```

`splitCells` treats a backslash-escaped pipe as cell content. Under the old splitter such a row got
the wrong width and was SKIPPED, which `oneRow` turns into a loud `found 0` FAIL -- so the old
behaviour was fail-safe and the new one is strictly more accurate. Both the pre- and post-change
batteries report all four surviving row-scoped guards PASS, so there is no behaviour change on the
live content.

### 2.5 `row-guards.mjs`: the four surviving guards are byte-identical in predicate

`failureVsErrorRowBacked`, `seamRowBacked`, `threeLawsRowBacked`, `kanbanEssayNamedInRow` keep their
row predicate, column, `cellRe` and expectation unchanged; `OLD_NEEDLES` was pruned to exactly the
four survivors and the selftest asserts that parity (`Object.keys(OLD_NEEDLES).sort()` vs
`Object.keys(ROW_SCOPED_GUARDS).sort()`). The deleted count-guard surface (commit `60ef38a`) was
removed in a SEPARATE commit from the retirement, and the emitted count is provably unchanged by
that deletion.

---

## 3. THE FOUR RESIDUES

### (a) Step-12 replacement assertion -- DERIVES. Verdict: sound as an assertion, but its stated purpose is NOT achieved.

`tools/row-guards.selftest.mjs:398-403`

```js
check(
  "RETIRED_LABELS are non-empty, duplicate-free, and each carries a filename or a bracketed tag",
  RETIRED_LABELS.every((label) => label.trim() !== "" && (label.includes(".md") || /^\[[^\]]+\] /.test(label))) &&
    new Set(RETIRED_LABELS).size === RETIRED_LABELS.length,
  true
);
```

All three properties are computed FROM the roster data and compared against the constant `true` --
not a value hardcoded on both sides. Falsifiability confirmed by probe:

```
live roster all-pass: true
falsify -- empty entry ("  " appended): false
falsify -- duplicate appended: detected
```

**But the comment above it overclaims.** It says: *"A bare `label` value from FILES has neither, so
it can never slip in."* That is false. Nearly every FILES label starts with a bracketed tag, which
`/^\[[^\]]+\] /` accepts. Measured against the departed entry's own bare labels -- the exact
population the 58 retirements were transcribed from:

```
departed entry bare labels: 43
ACCEPTED by the shape predicate (would slip in undetected): 43
rejected: 0
```

Spot check:

```
  ACCEPTED: "[j9m] table of contents"
  ACCEPTED: "[wev G1] no invented term"
  ACCEPTED: "[2ig] no two-appendix count"
  ACCEPTED: "[gap] no chronology or seniority token"
  rejected: "Three Laws backing row"
  rejected: "lz-tpp seam backing row"
```

The shape check catches the two no-prefix Phase-18 originals and nothing else. Combined with the
roster gate's structural blindness (a mistyped retired label is trivially "not emitted"), the ONLY
real protection against a bare-label transcription error was the executor's discipline in
transcribing from a captured run. Section 1 is the actual verification, and it came out clean.

Recommendation: either narrow the comment to what the check does, or make the check compare the
roster against a stronger property (e.g. every entry contains `": "` or is one of the two known
no-prefix originals).

### (b) `scanTables` offender-string fixture -- GENUINELY PRODUCED. Verdict: sound.

`row-guards.selftest.mjs:257-261` pins
`"table at line 1: header is 3 wide, but 1 row(s) differ -- line 3 is 2"` against
`scanTables(RAGGED_TABLE).offenders`. The string is built in `pipe-table.mjs` from three computed
values (`open.headerLine`, `open.width`, `open.ragged`), not from a literal. Proved by varying the
input and watching every number move:

```
3-wide header, row 3 is 2 -> {"tables":1,"offenders":["table at line 1: header is 3 wide, but 1 row(s) differ -- line 3 is 2"]}
4-wide header, row 3 is 2 -> {"tables":1,"offenders":["table at line 1: header is 4 wide, but 1 row(s) differ -- line 3 is 2"]}
table starting at line 5  -> {"tables":1,"offenders":["table at line 5: header is 3 wide, but 1 row(s) differ -- line 7 is 2"]}
two ragged rows           -> {"tables":1,"offenders":["table at line 1: header is 3 wide, but 2 row(s) differ -- line 3 is 2, line 4 is 1"]}
```

Header width, ragged-row count, table start line and per-row line/width all track the data. Not a
comment, not a both-sides literal.

### (c) `TAXONOMY_LINES` -- SURVIVED and IS exercised. One false claim in its comment.

It lives at `row-guards.selftest.mjs:46-151` as an in-memory array of string literals; the selftest
imports only `node:assert/strict` and the two libs, so it reads nothing from disk. Three `parseRows`
cases consume it, and the two the comment names really are unique to it:

```js
check("taxonomy fixture parses to 15 data rows", parseRows(TAXONOMY, 9, "Author").length, 15);
check("header row is dropped BY VALUE, not by position", parseRows(TAXONOMY, 9, "Author")[0][0], "Kent Beck");
check("a width mismatch SKIPS the row rather than guessing", parseRows(TAXONOMY, 3, "Author").length, 0);
```

No other fixture asserts `[0][0]` after a header drop, and no other fixture passes a deliberately
wrong column count. Deleting `TAXONOMY_LINES` would silently remove both proofs, exactly as the
comment says.

Falsified empirically (mutations applied to a COPY of the selftest in a throwaway worktree, then
reverted). Baseline: `node row-guards.selftest.mjs` -> exit 0, 41 PASS, 0 FAIL.

```
# drop one data row from TAXONOMY_LINES
  [FAIL] taxonomy fixture parses to 15 data rows -- expected 15, got 14
  SUMMARY: row-guards self-test RED -- 1 assertion(s) FAILED

# rename the header's first cell "Author" -> "Writer"
  [FAIL] taxonomy fixture parses to 15 data rows -- expected 15, got 16
  [FAIL] header row is dropped BY VALUE, not by position -- expected "Kent Beck", got "Writer"
  SUMMARY: row-guards self-test RED -- 2 assertion(s) FAILED

# move the header row BELOW the separator row (position changes, value does not)
  [PASS] taxonomy fixture parses to 15 data rows
  [PASS] header row is dropped BY VALUE, not by position
```

The third mutation is the positive control for the label's own claim: the drop really is by VALUE,
so moving the row leaves both checks green while renaming its first cell reddens both. The fixture
is live, not decorative.

**However, the comment's other claim is false.** It states: *"It is not a copy of any shipped or
archived document -- every line here was written for this file."* Nine lines of the archived record
(>= 25 chars) appear VERBATIM inside the selftest source:

```
archived lines >= 25 chars: 479
of those, appearing VERBATIM inside the selftest source: 9
   [25] Axis one, WHERE IT LIVES:
   [32] Axis two, WHAT IT STANDS IN FOR:
   [26] ## 4. The per-author table
   [158] | Author | Term | Where it lives | ... | Citability tier |
   [55] | --- | --- | --- | --- | --- | --- | --- | --- | --- |
   [229] | Gerard Meszaros | `Test Stub` | Test | A collaborator | Either | ... |
   [224] | Gerard Meszaros | `Test Spy` | Test | A collaborator | Either | ... |
   [223] | Gerard Meszaros | `Responder` | Test | A collaborator | Either | ... |
   [30] against the clean-room source.
```

Functionally harmless (the fixture is still in-memory and decoupled; nothing re-reads the archive),
and no copyright exposure since the archived record is itself clean-room own-words. But it is a
claim the code does not support -- the same defect class this task exists to close, pointed at the
fixture instead of the prose. Narrow the comment to "not a copy of the archived document's
CONTENT-BEARING prose; a handful of structural lines are shared by construction", or reword the
shared lines.

### (d) Orphaned `taxonomyText` -- NONE. Verdict: clean.

```
$ git grep -n "taxonomyText\|TAXONOMY_BASENAME\|COUNT_GUARDS\|createHash" -- .claude/skills/lz-red-workspace/tools/
exit=1
$ git grep -c "readOrEmpty" -- .claude/skills/lz-red-workspace/tools/check-red-references.mjs   # positive control
.claude/skills/lz-red-workspace/tools/check-red-references.mjs:2
```

Zero hits with a passing positive control on the same path, so the zero is genuine. The
`createHash` import, the `COUNT_GUARDS` import and the `TAXONOMY_BASENAME` constant went with their
consumers.

---

## 4. THE TWO EXECUTOR DEVIATIONS

### 4.1 `oneRow` duplicated-row proof, RETARGETED -- SOUND.

Pre-change (`0990862`, selftest line 319ff):

```js
const DUPLICATED_BERNHARDT = TAXONOMY.replace(/^(\| Gary Bernhardt \| double versus value .*)$/m, "$1\n$1");
check("oneRow: a DUPLICATED target row -> FAIL (exactly one, or fail)", verdict(ROW_SCOPED_GUARDS.bernhardtDeliveryNamed(DUPLICATED_BERNHARDT)), false);
```

Post-change (selftest line 363ff):

```js
const DUPLICATED_THREE_LAWS = BACKING.replace(/^(\| \[Three Laws of TDD spine\].*)$/m, "$1\n$1");
check("oneRow: a DUPLICATED target row -> FAIL (exactly one, or fail)", verdict(ROW_SCOPED_GUARDS.threeLawsRowBacked(DUPLICATED_THREE_LAWS)), false);
```

Structurally identical, and both guards reach `oneRow` through the same `rowCellGuard` wrapper.
Verified at runtime that the retarget exercises the `matches.length !== 1` branch and not some
other failure path:

```
mutation applied (line count 8 -> 9)
parsed rows pristine=4 duplicated=5
pristine verdict:    {"ok":true,"why":""}
duplicated verdict:  {"ok":false,"why":"expected exactly ONE the Three Laws of TDD spine backing row, found 2"}
triplicated verdict: {"ok":false,"why":"expected exactly ONE the Three Laws of TDD spine backing row, found 3"}
```

It proves what it proved before, for the guard it now names: pristine passes, a duplicate fails, the
failure reason names the count, and the count scales. The anti-vacuity spine is intact.

Minor note, not a defect: this fixture uses a bare `.replace` rather than the file's own `mutate`
helper, which asserts the mutation applied. A silent no-op here is still safe -- the guard would
then return `ok:true` while the check expects `false`, so it fails loudly -- but the protection is
incidental rather than designed. Using `mutate` would make it deliberate.

### 4.2 Archive path as a single joined literal -- GENUINELY WIRED.

```js
const ARCHIVED_RECORD = path.join(repoRoot, ".planning/research/test-double-taxonomy.md");
...
for (const file of [...pluginsMarkdown, ARCHIVED_RECORD]) { ... }
```

Proved by removing the file in a throwaway worktree and re-running the committed checker:

```
  [FAIL] [lc9] no ragged pipe table -- 1 problem(s): .planning\research\test-double-taxonomy.md: UNREADABLE (ENOENT)
SUMMARY: RED-REFS RED -- 11/11 surfaces present, 1 check(s) FAILED
--- restored, re-run ---
  [PASS] [lc9] no ragged pipe table
```

It is in the loop, it fails closed, and it is a real surface rather than a no-op: the archived
record contributes an actual table to the scan (`scanTables(archived) -> {"tables":1,"offenders":[]}`),
so it also feeds the `tablesSeen === 0` anti-vacuity leg.

---

## 5. OTHER GUARDS WHOSE LABEL OVERCLAIMS RELATIVE TO ITS NEEDLE

The `## Reference material` instance is excluded per instruction (already closed by direct read).
Three further instances, all introduced or renamed by this change, plus two pre-existing ones.

### 5.1 `[lc9] mockist label attributed to Fowler at both sites` -- OVERCLAIM (strongest of the set)

```js
const FOWLER_LABEL_NEEDLE = "Fowler's label";
for (const name of ["anti-patterns.md", "principle-backing.md"]) {
  if (!fs.readFileSync(file, "utf8").includes(FOWLER_LABEL_NEEDLE)) { ... }
}
```

The label names a SUBJECT (`mockist label`) and an ATTRIBUTION RELATION that the needle does not
constrain at all -- it is a bare file-wide `includes` of five words. "at both sites" IS enforced
(two files); nothing else in the label is.

```
$ git grep -n -e "Fowler's label" -e "mockist" -- .../anti-patterns.md .../principle-backing.md
anti-patterns.md:7    ... states the mockist counterpoint fairly ...
anti-patterns.md:14   ... and the mockist counterpoint (GOOS ...) are
anti-patterns.md:123  ... the mockist, or London, school -- Fowler's label for the
anti-patterns.md:174  ... mockist counterpoint that drives object roles ...
principle-backing.md:52 | [Mockist counterpoint, stated fairly](anti-patterns.md) | ... the school name is Fowler's label for the position, ... |
```

`anti-patterns.md` has FOUR `mockist` mentions and ONE attribution; the guard cannot tell whether
the attribution is attached to the right one, and would stay green if the attribution moved to an
unrelated sentence while every mockist mention went bare. This is precisely the defect class
`row-guards.mjs`'s own header condemns ("guards named a specific table row in their own LABEL while
their needle matched ANYWHERE in the file"). Aggravating: in `principle-backing.md` the attribution
lives inside a TABLE ROW, and the module already exports `backingRows` + `rowCellGuard` for exactly
that file -- the row-scoped machinery was at hand and not used.

### 5.2 `[wev G17] no bare unqualified contested word in the shipped tree` -- OVERCLAIM by exactly one file

The renamed label claims the shipped tree; the target set is three `references/` trees plus three
`SKILL.md` files.

```
shipped .md files: 194; G17 targets: 193
shipped .md NOT scanned by G17: ["plugins\\lz-tdd\\README.md"]
```

`plugins/lz-tdd/README.md` is currently clean (`git grep -n -i -e "stub" -- plugins/lz-tdd/README.md`
-> exit 1, positive control `git grep -c -i -e "the"` -> 2 hits, so the zero is genuine), so this is
latent rather than an active false green. The fix is free: the checker computes
`pluginsMarkdown = collectMarkdown(PLUGINS_DIR)` -- the true shipped-tree walk -- twenty lines
later. Either point G17 at that list or rename the label back to the scope it has.

### 5.3 `[lc9] Test Spy named for the record-then-inspect double` -- OVERCLAIM (mild)

Needle: `/test spy/i`, per line, file-wide. The label's "for the record-then-inspect double" half is
unenforced -- the two words appearing on any line satisfy it. Content happens to be correct today
(`message-matrix.md:57` "the double is a Test Spy -- it records", `:139` "against a Test Spy, which
recorded the"), but the guard would pass on a bare mention with the semantics stripped. Same family
as 5.1, lower stakes.

### 5.4 `[lc9] every relative markdown link resolves` -- scope narrower than "every"

Scoped to `plugins/**/*.md` only; the archived record, which the sibling N1 gate DOES cover, is
excluded from N2. That happens to be harmless (the archived record has no relative `.md` links --
`git grep -c -e "](.*\.md" -- .planning/research/test-double-taxonomy.md` exits 1), but the two
gates share one walk and then diverge in scope without the labels saying so. The SUMMARY line is
correctly qualified ("anywhere in the shipped tree"); the label is not.

Related structural weakness in the same gate: the anti-vacuity leg counts ALL link kinds.

```js
for (const target of findLinkTargets(linkText)) {
  linksSeen++;
  if (target.kind !== "relative") { continue; }
```

```
N2 linksSeen composition over plugins/**/*.md: {"relative":976,"anchor":9}
```

`linksSeen` is incremented before the kind filter, so a tree containing only anchors and scheme URLs
-- or a regression that made `linkKind` stop returning `"relative"` -- would leave `linksSeen > 0`
and the gate green having resolved nothing. The N1 counterpart is correct by contrast (`tablesSeen`
counts the thing the gate actually acts on). Counting resolved RELATIVE targets instead is a
one-word fix.

### 5.5 Pre-existing (not introduced by this change), listed for completeness

- `principle-backing.md: ">= 1 recommendation link"`, needle `/\]\([^)]+\.md/`. Matches ANY markdown
  link to a `.md` file anywhere in the file; nothing ties it to a Recommendation-column cell.
- `SKILL.md: "stance routing step"`, needle `/route|routing/i`. The label claims a procedure STEP;
  the needle is a word.
- `naming.md: "match the house naming stance"`, needle `/match.*(house|stance)/i`. The label claims
  the NAMING stance specifically; the needle is generic.

Note that the two `absent` guards whose labels name a narrower scope than their needle
(`[wev G14] worked example does not deny...`, `[wev G15] worked-example body is not the identity
return`) are NOT defects: for a negative guard a wider scope is strictly stronger.

---

## 6. WHAT THE INSTRUMENT'S GATES STRUCTURALLY CANNOT SEE

### 6.1 A guard RENAME is invisible to all three roster assertions

`[wev G17]` changed its label in this change. The three roster legs are:

| Leg | Why it misses the rename |
|---|---|
| `emittedBeforeRoster === EXPECTED_CHECKS` | net zero: one label out, one label in |
| `NEW_LABELS` all present | the NEW G17 label is not in `NEW_LABELS` (13 entries: 4 `TWO_IG_GUARDS` + 4 literals + 5 constants) |
| no `RETIRED_LABELS` survive | the OLD G17 label is not in `RETIRED_LABELS` |

So a rename plus a simultaneous predicate weakening would pass all three legs silently. Here the
predicate direction happened to be a widening (section 2.3) and the rename IS documented in a
comment (`check-red-references.mjs:530-533`) -- but nothing in the instrument enforces that. The
cheap close is to add the current `BARE_QUALIFIER_LABEL` constant to `NEW_LABELS` (13 -> 14, and
`EXPECTED_CHECKS` unchanged), which turns the rename into an assertion.

### 6.2 The retired-label roster is vacuous by construction, and its only shape check accepts 43/43 bare labels

Covered in section 3(a). Restating because it is the headline structural blind spot: a mistyped
retired label is trivially "not emitted", so `survivingRetiredLabels.length === 0` passes either
way. The selftest's shape check was the intended backstop and it accepts every bare label carrying a
bracketed tag. Section 1 of this document is currently the only evidence the 58 are right.

### 6.3 The 9-additions / 58-retirements narrative is not derived from anything

`EXPECTED_CHECKS = 125` is a hand-maintained literal by deliberate design (correctly so -- deriving
it would make it unable to fail). But the ARITHMETIC NARRATIVE in the comment
(`174 + 9 - 58 = 125`) is prose, and it is already slightly off: 10 labels were added and 59 removed.
Nothing checks the narrative against the label sets, which is why the rename slipped through it.

### 6.4 An indented pipe table is invisible to `scanTables`

`scanTables` and `parseRows` both gate on `line.startsWith("|")`. GFM permits up to three leading
spaces on a table row. An indented ragged table anywhere in the shipped tree would not be seen, and
the `tablesSeen === 0` anti-vacuity leg cannot detect a table it never recognised as one. No such
table exists today, so this is latent. It is also arguably correct as a "handles exactly the shape
these documents use, fails closed on anything else" decision -- but the failure mode here is
skip-silently, not fail-closed, which is the one direction the module's own header rules out.

### 6.5 The `.md`-only walk

`collectMarkdown` filters on `.endsWith(".md")`. `[lc9] no test-double taxonomy copy in the shipped
tree` therefore cannot see a copy re-added under `.markdown` or any other extension. Trivial in
practice; noted because the label says "no copy", unqualified.

---

## Summary table

| Item | Verdict |
|---|---|
| 58 retired labels, transcription | **58/58 EXACT. No mismatch.** Label-vs-detail form correct on the sha256 entry. |
| Surviving guard weakened in place | **None.** G17 strengthened; `parseRows` splitter fixed; every surviving topic/absent regex byte-identical. |
| (a) step-12 replacement assertion | Derives all three properties from data and is falsifiable. **But its comment's claim is false** -- 43/43 bare FILES labels pass the shape check. |
| (b) `scanTables` offender fixture | **Sound.** Produced at runtime; every number in the string tracks the input. |
| (c) `TAXONOMY_LINES` | **Survived, in-memory, genuinely exercised** by 3 `parseRows` cases, 2 of them unique to it. Comment's "not a copy" claim is false (9 verbatim lines). |
| (d) orphaned `taxonomyText` | **Clean.** Zero hits, positive control passes. |
| Deviation 1: `oneRow` retarget | **Sound.** Same code path, `found 2` / `found 3`, pristine passes. |
| Deviation 2: archive path | **Genuinely wired.** Fails closed on ENOENT; contributes a real table. |
| Other label overclaims | 3 introduced/renamed here (Fowler attribution, G17 scope, Test Spy), 1 scope asymmetry (N2 "every"), 3 pre-existing. |
| Gate blind spots | Rename invisible to all 3 roster legs; roster vacuity backstop ineffective; indented tables skipped silently; N2 anti-vacuity counts the wrong thing. |

Nothing found here blocks the change. The retirement itself is correct and completely transcribed;
the findings are (1) claims in comments that the code does not support, and (2) label/needle scope
mismatches, three of them newly introduced.
