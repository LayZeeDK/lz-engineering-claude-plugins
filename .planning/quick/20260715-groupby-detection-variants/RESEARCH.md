---
slug: groupby-detection-variants
created: 2026-07-15
kind: research (design-only; no skill edit, no eval run)
target: lz-refactor recall of reduce->Map group-by (T4 groupImports), missed 0/3 pre+post prior edit
---

# Closing the reduce->Map group-by recall blind spot in lz-refactor

Design-only. Ranked variants + pitfalls. No skill file was edited and no eval was run
(eval-run approval gate; this is prep). Running any arm needs explicit user approval + spend.

## 1. Mechanism verdict

The hypothesis (the word "explicit loop" in the recognize-by cue anchors the model on
`for`/`while` and structurally excludes a `.reduce()` group-by) is PARTIALLY correct and,
more importantly, points at the ONE lever that was never actually pulled. But the miss is
NOT a single mechanism -- the 3 re-run traces split across two distinct failure modes:

- RECOGNITION miss (run-5): did not mention groupImports; caught T3 and, per SUMMARY.md,
  echoed "the Loops recognize-by cue near-verbatim." This is the smoking gun -- the model
  demonstrably reads and reproduces the INDEX cue text at `references/smells.md:64`, and that
  cue reads (smells.md:64, mirrored at smells/loops.md:3):
  `Recognize by: an explicit loop whose real intent (filter, map, sum) is buried in bookkeeping.`
  The subject noun "an explicit loop" plus the intent list "filter, map, sum" is a for/while
  lens. A `.reduce()` group-by does not trip it, so the model never opens the leaf.
- RECOGNITION-but-wrong-angle (run-6): touched groupImports only for a `{ member; importPath }`
  type-shape angle, not the group-by. The function registered, the group-by intent did not.
- JUDGMENT miss (run-4): READ groupImports and parked it under "What I would not touch --
  reasonable as-is." This is NOT recognition. The model saw the reduce, considered it, and
  declined. No recognition-cue edit can move this run.

So: cue-anchoring is real and explains 2/3 (run-5, run-6), but 1/3 (run-4) is a warrant/judgment
call. Implication for whether ANY skill edit can fix it:

- A pure recognition-cue edit has a CEILING near 2/3 on these traces. It cannot clear run-4.
- run-4's "reasonable as-is" is partly a design consequence: lz-refactor's step-4 net-cost gate
  (SKILL.md:61-71) DECLINES by default and the whole skill is biased against churning working,
  "readable enough" code. A group-by reduce that "works" is exactly what step 4 is built to
  leave alone -- UNLESS the skill gives it a concrete cost to remove. groupImports uses
  `acc.find(...)` inside the reduce, i.e. a linear scan per item = O(n^2). That is a real,
  profile-independent cost (algorithmic complexity, not micro-opt) the Map/pipeline form
  removes. Naming that cost is the only lever with a mechanistic path to run-4.

CRITICAL FINDING (why the prior null-delta does not close the question): the prior experiment
(.planning/quick/20260715-groupby-loop-recall) edited the LEAF BODY (loops.md:12-15) and two
catalog motivations, but its PLAN.md and SUMMARY.md both state it "left Recognize by: / Use
when: / Correspondence: selector lines byte-unchanged (checker-mirrored)." So it edited content
the model only reaches AFTER the gate fires, and never touched the GATE itself. SKILL.md step 2
(SKILL.md:49-51) routes: "Scan the recognize-by cues in references/smells.md, then OPEN the
matching smell leaf." The index cue is the gate; a leaf edit is dead weight if the gate never
fires (SUMMARY.md itself calls the leaf note "uselessly" placed). The prior null-delta tested
"leaf content," NOT "the gating index cue." The gate cue is the untested, highest-leverage lever.

## 2. The mirror constraint is NOT machine-enforced (enables the variant)

HARD constraint #1 says smells.md:64 and smells/loops.md:3 are "CHECKER-MIRRORED" and must be
changed to the SAME text or the battery breaks. Reading check-smells.mjs, this is FALSE as
stated. check-smells asserts only:

- each smell leaf has a line matching `^Recognize by:\s*\S` (check-smells.mjs:225);
- smells.md contains SOME `/recognize by:/i` text (check-smells.mjs:335-336);
- smells.md links all 24 leaves via `](smells/<slug>.md)` (check-smells.mjs:341-356).

There is NO byte-identity assertion between the index cue and the leaf cue for smells (unlike
check-catalog/kerievsky/functional/gof/extra, which DO mirror `Use when:` / Applicability-first-line
into README rows). check-crossrefs.mjs only resolves links, not text. So the two lines can diverge
without breaking the battery, as long as each keeps a `Recognize by:` line and the links stay.

Engineering call: change BOTH to the SAME text anyway, for coherence and to avoid the exact
selector-drift the 2026-07-09 humanize incident caused (MEMORY: check-smells "8" broken tokens).
The point is that editing the index cue is LOW-risk on the checker axis, not that it is forbidden.
Hygiene (check-hygiene.mjs): ASCII-only + email-allowlist + no double-quoted run >= 120 chars.
All variant text below is ASCII, carries no long quoted run, and is original functional phrasing
(not Fowler-verbatim), so DST-04 / hygiene stay green.

## 3. Ranked variants

### Variant A -- broaden the GATING index cue (PRIMARY)

Mechanism targeted: detection-cue at the gate (the smells.md scan SKILL.md step 2 runs first).
This is the untested lever. Break the "explicit loop" subject-noun anchor so the index scan
fires for a reduce group-by, while keeping loop coverage and the "buried in bookkeeping"
precision gate.

Change BOTH lines to identical text (respects the mirror convention):

- File `references/smells.md`, line 64
  OLD: `Recognize by: an explicit loop whose real intent (filter, map, sum) is buried in bookkeeping. ([leaf](smells/loops.md))`
  NEW: `Recognize by: a loop, or a reduce or accumulator that buckets items into a Map or object under a key, whose real intent (filter, map, sum, group-by) is buried in bookkeeping. ([leaf](smells/loops.md))`

- File `references/smells/loops.md`, line 3
  OLD: `Recognize by: an explicit loop whose real intent (filter, map, sum) is buried in bookkeeping.`
  NEW: `Recognize by: a loop, or a reduce or accumulator that buckets items into a Map or object under a key, whose real intent (filter, map, sum, group-by) is buried in bookkeeping.`

Expected leverage: HIGH relative to the untested set -- this is the one edit on the evidenced
behavior path (run-5 echoed this exact line). Best case moves run-5 and run-6 from miss to catch
(ceiling ~2/3). Cannot fix run-4.
Risks:
- T3 regression: LOW. Subject still leads with "a loop"; index/`for` loops still match; intent
  list still carries filter/map/sum.
- False positive on benign reduce: LOW-MODERATE. The clause "buckets items into a Map or object
  under a key" is the group-by shape specifically; a `reduce((a,x)=>a+x,0)` sum does not bucket
  into a Map, and "buried in bookkeeping" further gates it. Watch the eval for the coach flagging
  a clean fold as a smell.
- Router bloat: none (index file, not SKILL.md).
Checker: green (keeps `Recognize by:` prefix + the leaf link; ASCII; no long quote).

### Variant B -- name the O(n^2) cost so a recognized group-by is WARRANTED (COMPLEMENT to A)

Mechanism targeted: leaf-content, but on the JUDGMENT axis, not recognition -- gives step 4 a
concrete "removes" so the model does not park it as "reasonable as-is" (run-4). B is NOT a
standalone: the model only reaches the leaf if A's gate fires, so eval A+B together.

- File `references/smells/loops.md`, append one sentence to the group-by paragraph (after line 15):
  ADD: `When the bucket is located by scanning the accumulator on each item (an acc.find inside the reduce), the group-by is also quadratic; restating it as a keyed Map fold removes that per-item linear scan -- a real cost removed, on top of the readability.`

Expected leverage: MEDIUM. The only lever aimed at run-4. Converts a lateral "reduce -> reduce"
readability move into a cost-removing (O(n^2) -> O(n)) one that clears step-4 APPLY.
Risks:
- Prior null-delta was a leaf-content edit, so leaf-content leverage is empirically weak; B is
  plausible but unproven. That is WHY it is paired with A (the gate), not run alone.
- Over-claiming perf. Keep the claim to algorithmic complexity (acc.find-per-item IS quadratic
  regardless of profile), NOT wall-clock; the skill is deliberately careful about "measured hot
  path" for the reverse direction (replace-loop-with-pipeline.md:70-77). The wording above says
  "quadratic," not "faster," on purpose.
Checker: green (ASCII; the phrase "an acc.find inside the reduce" is not quoted; no long quote;
original phrasing).

### Variant D -- minimal parenthetical only (CONSERVATIVE FLOOR)

Mechanism targeted: detection-cue, but keeps the anchoring subject noun -- the smallest possible
diff. Presented mainly to show why the minimal edit is expected to underperform.

- Both smells.md:64 and loops.md:3:
  OLD subject unchanged; only extend the intent list:
  NEW: `Recognize by: an explicit loop whose real intent (filter, map, sum, or a group-by into a Map) is buried in bookkeeping.` (+ leaf link on the index line)

Expected leverage: LOW. Preserves "an explicit loop" -- the exact noun the hypothesis blames for
anchoring -- so the recognition mechanism is barely touched. Likely reproduces null-delta.
Risk: lowest false-positive of the set, but also lowest payoff. Use only if A's broader subject
is judged too risky for false positives (it is not, on this analysis).

### Variant C -- one-line router hint in SKILL.md (LAST RESORT; violates D-03 spirit)

Mechanism targeted: router-hint (always-in-context salience).

- File `SKILL.md`, step 2 (lines 49-51), append: `Treat a reduce or accumulator as a loop for
  this scan.`

Expected leverage: potentially HIGH (SKILL.md is always loaded; the index is a hop away).
Risk / TRADEOFF (constraint #2): this puts smell-specific content into the deliberately lean
~159-line router, against decision D-03 (no smell table / smell-specific hints in SKILL.md). It
sets a precedent where every under-recalled smell earns a router line -> router bloat. DECLINE
unless A+B both fail to move recall and the recognition axis is otherwise exhausted.

Ranking: A (primary) > B (complement; eval WITH A) > D (conservative floor) > C (router,
D-03 violation, last resort).

## 4. Recommended experiment

Eval ONE arm: A + B combined, k=3, byte-identical Phase-14 cr-rlu invoke_skill config (recommend,
--synthetic-base, claude-opus-4-8 @ high, --setting-sources project), fresh indices (preserve
baseline run-1..3 and the prior run-4..6). Rationale: A and B target the two distinct, evidenced
miss modes (recognition + judgment); running them apart wastes runs given the known model-ceiling
prior, and B is meaningless without A's gate. If budget allows a second arm, A-alone isolates
whether the gate cue suffices without the cost framing.

Pass / fail bar:
- STRONG PASS: T4 groupImports caught 3/3 AND T3 findTransitiveExternalDependencies stays 3/3.
- PASS (meaningful): T4 >= 2/3 AND T3 == 3/3 AND no new false-positive recommendation on a benign
  reduce (e.g. a sum-fold). 2/3 is the realistic ceiling because run-4's "reasonable as-is" may be
  a defensible judgment call / genuine model ceiling.
- REGRESSION (abort + revert): T3 drops below 3/3 -> the broadened subject diluted the loop signal.
- NULL (stop): T4 <= 1/3 -> confirms the model recall/judgment ceiling (consistent with the
  milestone's triple-closed output-warrant finding); keep the edit as marginal doc explicitness or
  revert to keep the milestone tree minimal -- user's call. Do NOT spend further arms.

Discipline note: MEMORY records the output-warrant axis as triple-closed and advises "don't
re-run." Frame A+B as the SINGLE remaining untested lever (the gating index cue), worth exactly
one k=3 arm if the user wants to fully exhaust the recognition axis, not an open-ended sweep.

## 5. Light external grounding (general; not blocking)

No fetch performed -- the internal mechanism analysis is the core and the finding is self-contained.
General, well-established points that support the design (from prior knowledge, not a cited fetch):

- LLMs reviewing code exhibit surface-form salience: a checklist item phrased around one concrete
  form (here, an "explicit loop") biases the model toward that form and lets structurally-equivalent
  variants (a `.reduce()` group-by) slip. Broadening the trigger's SUBJECT (not just its examples)
  is the standard fix; extending only the example list (Variant D) rarely re-anchors perception.
- Recall vs precision trade-off: a broader trigger raises recall but risks flagging benign
  instances. The mitigation used in Variant A -- a specific shape qualifier ("buckets items into a
  Map under a key") plus a severity gate ("buried in bookkeeping") -- is the conventional way to
  buy recall without tanking precision. The eval must watch the precision side, not only recall.
- Recognition vs judgment are separable failure modes; measuring them together (as here) risks
  attributing a judgment decline to a recognition gap. This is exactly why run-4 must be read as a
  distinct mode and why a recognition-only edit has a ceiling below 3/3.
