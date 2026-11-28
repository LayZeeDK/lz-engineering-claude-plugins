# 260801-w8b: Can an ambiguous prompt with determinate ground truth be built on a vendored target?

**VERDICT: NO. Not on any of the four vendored cells, and the block is structural rather than a
search failure -- all four dimensions the treatment artifact actually teaches are either dead on
these targets or invisible to the D-06 gate by that gate's own deliberate design.**

**Spend:** ZERO. No `claude -p`, no install, no clone, no run of `grade-red`/`selfcheck-red`. One
`git show` against the already-vendored srvx object store; the rest is reading this repo.

---

## 0. Provenance of everything below

**VERIFIED-BY-RUNNING (this session):**

- The nine archived `SRVC:r1` grades, read out of
  `e2e-red-srvx/results/apply/*/r1/run-*/red-grade.json`. Verdicts and `pass` values in section 2.
- `e2e-red-srvx/results/apply/no_skill/r1/run-1/diff.patch` and
  `.../with_skill/r1/run-1/diff.patch`, read in full.
- `git show 55d90b3:src/adapters/_node/send.ts` from the pinned srvx checkout
  (`_sendNodeResponse`, `writeHead`).

**VERIFIED-BY-READING (opened the file, quoting line numbers):**

- `grade-red.mjs` -- `VERDICTS` (:70-80), `ASSERTION_RE` (:83-84), `RUNTIME_RE` (:87-88),
  `changedProductionFiles` (:167-169), `classify()` (:758-838), `verdictPass` (:840-842).
- `selfcheck-red.mjs` -- `forbiddenTokensIn` (:231-237), `STATE_CLAIM_TOKENS` (:250-264),
  `checkComposedPrompt` (:267-382), `checkCompositionAndParity` (:384-445).
- `tabulate-mechanical-red.mjs` -- `walkRuns` (:226+), `aggregate` cell key (:113),
  `walkAllSuites` duplicate rule (:336-352), per-suite `mechanical-red.json` write (:711).
- `treatment/test-double-taxonomy.md` in full; `e2e-red-srvx/{suite.json,targets.json,prompts/}`;
  the GRC and radix `targets.json` + prompts; `260801-w8b-{CONTEXT,RESEARCH}.md`;
  `260801-sc9-RUN-GATE.md` section 2.

**INFERRED (reasoning, not measurement):** every claim in sections 3, 5 and 6 about how a
hypothetical produced test would grade. Marked inline where it matters.

---

## 1. The lead hypothesis, attacked

Proposed prompt: *"our middleware sets a cookie and the client never gets it. mock out whatever you
need and write me the failing test under `test/`."*

### 1.1 Crux 1 -- is the ground truth determinate?

Determinate, yes. Ambiguous, no. Those are different failures and only the second one kills it.

The two offered readings are not two senses of a contested word. They are **obey the instruction**
versus **override it**. Under the second reading the correct answer is to substitute *nothing at
all* -- boot a real `serve()`, issue a real `fetch`. That is not a sense of "mock"; it is the model
declining the instruction because obeying it yields a worthless test. A prompt whose literal
instruction is unsatisfiable-if-followed is a trick question, not an ambiguous one.

Worse for attribution: **the artifact under test does not claim "mock" is ambiguous.** Its census
puts every mock-family term in exactly one cell (Test / collaborator / permanent: Meszaros'
`Mock Object`, `Test Spy`, `Test Double`, `Fake Object`; Beck's `mocking`). Not one bullet places
any mock term on the production side. The documented collision is on **`stub`** -- Beck's
production/own/transitional `stub` against Metz's test/collaborator/permanent `stub`, with the whole
"The collision, and the rule that follows" section written about that word.

So if a treatment arm wins on a `mock`-carrier prompt, the win cannot be attributed to the
artifact's content. It would be attributable at most to a general "be careful with doubles" prior --
which the BASELINE already carries inline at `lz-red/SKILL.md:101-104`. That is the
vocabulary-not-substance confound from Phase 20, reconstructed.

**Third defensible answer that grades neither cleanly:** obey "mock" by spying on a *real* Node
`res` inside a real server (`vi.spyOn(res, 'setHeader')`) and assert both the spy and the client
receipt. INFERRED verdict: `genuinely_red` on the client assertion, so it grades as a pass while
having taken the wrong double decision. The primary variable does not see it.

### 1.2 Crux 2 -- is the fork real? (MEASURED: no)

This is the decisive one, and the evidence is already on disk. All nine archived `SRVC:r1` runs:

| arm | run-1 | run-2 | run-3 |
|---|---|---|---|
| `no_skill` (no plugin at all) | `genuinely_red` | `genuinely_red` | `genuinely_red` |
| `with_skill` | `unattributable` | `genuinely_red` | `genuinely_red` |
| `invoke_skill` | `genuinely_red` | `genuinely_red` | `genuinely_red` |

**Not one run in nine produced a fabricated Node `res` double.** I read the `no_skill/run-1` diff:
it goes straight to `serve({ port: 0 })`, a real `fetch`, and
`expect(res.headers.getSetCookie()).toContain(...)`. The artifact-free baseline is at 3/3. The
"wrong answer" was never on the table -- so on this cell the fork does not merely close, it never
opened.

The proposal is to force it open with "mock out whatever you need". Two problems:

1. **The prompt fights itself.** The symptom clause is a *client-side* observable -- "the client
   never gets it". A fabricated `res` double has no client. To honour the symptom the model must
   boot a server; to honour the directive it must fabricate. The contradiction resolves toward the
   correct answer, so the wrong answer stays unattractive even after the directive lands. Removing
   the client framing to fix this costs the only non-leading symptom the target has.
2. **If it does work, it works for the wrong reason.** Making a wrong answer attractive by
   instructing the model to produce it does not create ambiguity; it pays for a mistake. What would
   then be measured is deference to a user's bad technique directive -- sycophancy versus pushback.
   Real axis, interesting axis, but the taxonomy artifact teaches nothing about it, and the one
   behaviour it does prescribe for this situation ("ASK WHICH SIDE THEY MEAN") is explicitly
   excluded from scoring by CONTEXT's grading lock.

### 1.3 Crux 3 -- disambiguation, or the design axis in a new hat?

**The design axis in a new hat, plus an obedience confound.** The suspicion that prompted the
earlier rejection is correct and I would not talk you out of it.

Concretely: the dependent variable is byte-identical to `r1`'s -- did the produced test fabricate a
Node `res`. Nothing about *which kind* of double (Dummy / Stub / Spy / Mock / Fake) is measured, and
nothing about axis 1, 2 or 3. The artifact's entire content is off the measurement surface. The only
change from `r1` is an instruction that pushes toward the known-wrong branch.

### 1.4 Crux 4 -- crux-2 survival (mechanically fine; one gap worth naming)

Checked clause by clause against `checkComposedPrompt` (`selfcheck-red.mjs:267-382`):

| Clause | Status | Evidence |
|---|---|---|
| Names pinned `test_dir` | PASS | body contains the literal `test/` (:341-350) |
| Names none of SRVC's 9 forbidden tokens | PASS | case-folded substring over the whole composed prompt; none of `writeHead`, `getHeaders`, `setHeader`, `rawHeaders`, `merge`, `FastResponse`, `fast path`, `_toNodeResponse`, `sendNodeResponse` occurs in the body, the apply preamble, or the recommend preamble |
| No `STATE_CLAIM_TOKENS` | PASS | none of the 13 tokens occurs (:250-264) |
| Poisoned variant caught | PASS, unchanged | `tokens[0]` is `writeHead`; the list is shared with `r1` and already proven in both directions (:369-379) |
| Prompt parity across arms | PASS | composition is arm-independent |

**On adding "mock"/"stub" to `prompt_forbidden_tokens` -- three findings:**

1. **The list is per TARGET, not per prompt.** `checkComposedPrompt` reads
   `target.prompt_forbidden_tokens` and applies it to every prompt bound to that target. There is no
   per-prompt override in the schema. So adding "mock" would immediately fail the very prompt that
   needs it. You cannot have both.
2. **Adding either token would NOT break `r1`.** I checked: neither word appears in
   `r1-next-test.md`, in the suite's apply preamble, or in the shared recommend preamble. So `r1`'s
   crux-2 status is unaffected either way. The addition is simply pointless if `a1` needs the word.
3. **The semantics are wrong, and this exposes a real gap.** The list means "tokens that hand the
   model the mechanism or the expected behaviour". "mock" hands over the *wrong* answer. Crux 2 has
   no concept of an anti-lead and would pass a deliberately-planted wrong steer without comment.
   Because the planted token is byte-identical across arms it does not bias the A/B -- but it moves
   the whole cell's difficulty, and nothing in the instrument records that it was moved. **Any
   ambiguity corpus should carry that fact in `targets.json` explicitly, because crux 2 will not.**

### 1.5 Crux 5 -- cell-key collision (solved; genuinely cheap)

**Minimum clean way: one new prompt id on the same target in the same suite. No new target id, no
new suite, no collision, no new canary.**

VERIFIED from the code:

- `walkRuns` (:226+) derives `pid` from the directory name at
  `results/apply/<arm>/<pid>/run-N`, and `target` from `meta.target`.
- `aggregate` (:113) keys on `${r.target}:${r.pid}|${r.arm}`.
- `walkAllSuites` (:336-352) throws **only** when `prior !== undefined && prior !== suiteDir` -- a
  *second suite* claiming the key. Its own comment: "Within ONE suite the same key repeats
  legitimately -- that is what k>1 means."

So adding `{ "id": "a1", "file": "...", "target": "SRVC", "code": true }` to
`e2e-red-srvx/suite.json` yields `SRVC:a1|<arm>`, disjoint from the nine archived `SRVC:r1|<arm>`
runs, which stay in their own cell untouched. Entry cost is the prompt file plus that one line;
`checkCompositionAndParity` (:394-419) iterates `suite.prompts` and covers the new prompt in both
modes automatically. Same target object means the same `runner`/`typecheck` blocks, so the existing
`canary-srvc-*` fixtures license it with no new fixture.

One item to confirm at plan time, NOT verified: each suite writes its own
`mechanical-red.json` (`tabulate-mechanical-red.mjs:711`). Adding a cell changes that committed
file. I did not check whether any battery pins its shape.

### Lead verdict

**Dead on crux 1 (wrong carrier word -- the artifact does not claim "mock" is contested) and crux 2
(measured 9/9 baseline on the same symptom clause; the added directive fights the symptom rather
than opening a fork). Crux 3's suspicion is confirmed. Cruxes 4 and 5 are clean, which is exactly
why this looked buildable.**

---

## 2. A measured fact the prior research did not have, and it also damages CAND-1

`260801-w8b-RESEARCH.md` recommends running the three arms on `SRVC:r1` as-is (CAND-1). It cites
`targets.json`'s `runner_measured` but nowhere cites the nine archived run verdicts. Those verdicts
say the baseline arm is **3/3 saturated**. A three-arm round on `SRVC:r1` has a near-certain tie as
its modal outcome, and RUN-GATE Pitfall 5 already says a tie there is unreadable.

**So CAND-1's honest expected value is "pay for a guaranteed tie".** That is not a reason to refuse
it -- a documented ceiling is worth something -- but it should not be sold as the cheap way to
answer D-12.

### A second, separate instrument fragility that bears on the hard constraint

`with_skill/run-1` graded `unattributable`, `pass: false`, on what I read as a **correct** answer.
The recorded `why`: "the suite has failing assertions but the diff declares no it()/test() title to
attribute them to". The `failure_excerpt` names the failing test
`"a set-cookie set on the Node res survives the web Response's own set-cookie"` and labels it
PRE-EXISTING -- but that title is the model's own, added in this diff. Cause, read from the diff:

```
+  test.skipIf(isDeno)(
+    "a set-cookie set on the Node res survives the web Response's own set-cookie",
```

`addedTestTitles` is line-scoped by construction (its own comment: "`.` never crosses a newline"), so
a call form that puts the title on the following line defeats attribution. The model also appended
to the existing `test/node-adapters.test.ts` rather than creating a file.

**Measured false-negative rate on the correct answer for this cell: 1 in 9 (~11%).** At k=3 across
three arms that is enough noise to manufacture an arm difference out of nothing. Any new prompt on
this suite inherits it, and a prompt that nudges toward appending to an existing spec file would
make it worse. Worth fixing (multi-line title extraction) before any metered round, independent of
D-12.

---

## 3. Why no alternative works on the vendored corpus

The artifact teaches exactly four things that could change a produced diff. I took each one against
all four vendored cells.

**Axis 1 -- production-side versus collaborator-side.** This is the artifact's only documented
collision, so it is the only axis on which a treatment win would be attributable. It needs a symbol
that does *not* yet exist, otherwise the production-side reading is foreclosed and only one reading
is live. `GRC.updateQuality`, `SRVC.sendNodeResponse` and `RXF`'s directive all exist. Only `RXL`
has a missing symbol (no `RDX_LOCALE` token at the pin) -- and `RXL` is already ruled
DESIGN-CONFOUNDED for precisely the adjacent reason ("the split tracks WHICH INJECTION TOKEN the
model imagined"), with `RDX_LOCALE` on its forbidden list so it cannot even be named. Dead.

**Axis 2 -- own unwritten implementation versus collaborator.** On SRVC the Node `res` is a
collaborator and there is no unwritten-own-implementation candidate. On GRC there are no
collaborators at all. One live value each. Dead.

**Axis 3 -- transitional versus permanent.** Lifetime is not observable in a single diff. This is
what the abandoned Option C `a2` prompt was for, and it is inherently non-apply. Dead for an apply
cell.

**The five kinds / Spy-versus-Mock ("where the assertion lives").** Needs an outgoing COMMAND
collaborator whose omission is invisible to observable state. `w8b-RESEARCH.md` Part 3 audited
srvx exhaustively (all seven adapters, `types.ts`) and found every injected collaborator is an
outgoing *query*; the only pure commands are correct at the pin, globals, or already covered. GRC has
no collaborators. Radix's gaps are an attribute spelling and a DI token. Dead, and w8b's crux-2
tension argument shows the shape is generically hard to prompt non-leadingly even if found.

### The internal kill, which is the cleanest one

Even granting a target with a not-yet-written collaborator, the artifact **refuses to settle the
ground truth for that exact case**:

> `Temporary Test Stub` ... On axis 2 it covers a collaborator nobody has written yet ...
> **AXIS 1 IS NOT SETTLED, and do not state it as though it were.** ... Cite it as ambiguous on
> where-it-lives; a flat "test-side only" reading overstates what the source supports.

The one scenario that makes a production-versus-test-side ambiguity genuinely live is the one the
treatment explicitly declines to adjudicate. You cannot build a determinate-ground-truth cell on an
axis the treatment itself calls unsettled -- and if you graded it either way, the treatment arm could
be *penalised* for correctly hedging, exactly as the artifact instructs it to.

### The structural finding underneath all of it

`classify()` has eight verdicts and they encode two axes: *did the produced test fail on current
code*, and *did the model touch production*. Nothing else. `classify()` never inspects the diff for
`vi.fn`, `vi.mock` or `toHaveBeenCalled`.

Worse for axis 1 specifically: `drove_to_green` fires **only on the all-pass path** (:791-800). A
model that adds a production-side stub *and* a failing test grades `genuinely_red`, `pass: true`.
The code says so in terms: *"A benign compiling STUB that keeps the test red never reaches here."*
**The artifact's central distinction is one the primary gate deliberately tolerates.** Making it
visible is not adding a field -- it is reversing a documented tolerance, which would retroactively
re-grade every existing cell.

Consequence: **on this instrument every double-kind fork collapses into an axis already being
measured** (drive-to-green, or mock-versus-real-collaborator). That is why each candidate keeps
arriving back at the same place, and it is a property of the gate rather than of the search.

---

## 4. Hard-constraint check (does the correct answer grade `genuinely_red`?)

| Candidate | Correct answer grades red? | Note |
|---|---|---|
| Lead (`mock`-carrier on SRVC) | **YES**, MEASURED 8/9 | but ~11% false-negative from the title-attribution miss in section 2 |
| Axis-1 cell (production-side ambiguity) | **NO -- disqualifying** | INFERRED: production-side stub + failing test grades `genuinely_red` `pass:true`, so the *wrong* reading also passes. Ground truth not separable |
| Five-kinds / outgoing-command cell | **YES in principle** | INFERRED from `ASSERTION_RE` including `\btohavebeen`; a failing spy assertion is assertion-shaped. But no such target exists in the vendored corpus |
| `SRVA` (srvx issue #283) | **YES, INFERRED** | pure function, no collaborator -- good RED cell, not a double cell. w8b's ruling stands |
| `waitUntil` (already dead) | **NO** | grades `wrong_reason` via `RUNTIME_RE` when the model is right. Correctly killed |

---

## 5. What I would do instead

**Recommended: do not build an ambiguity apply cell. Record the negative and stop spending on this
axis.** The finding is decision-grade on its own: the D-06 gate cannot separate double *kind* from
double *presence*, and the artifact's only attributable axis is one the artifact declines to settle.
That is a real answer to D-12's "prove it first", and D-12 pre-authorises DECLINE on no measured
lift.

**If you want the question answered anyway, the honest cost is a fork in the CONTEXT lock, not a new
prompt.** Two coherent paths, both more expensive than they look:

1. **Keep D-06 as the primary variable.** Then the cell is not buildable -- here, and I believe not
   anywhere, per section 3's structural finding. Nothing to author.
2. **Move the primary variable onto `assertionShape()`** -- a pure diff function classifying
   mock-shaped (`toHaveBeenCalled*`) against state-shaped (`toBe`/`toEqual`/`toStrictEqual`)
   assertions, sitting alongside `changedProductionFiles` (:167) and `addedTestTitles` (:266). The
   function itself is genuinely cheap and well-precedented. What is *not* cheap is what it requires
   around it: an outgoing-command target with a second-order observable (w8b Part 3's escape hatch --
   job queue, cache layer, event bus, telemetry client), which means a NEW repo, the full T-21-SC
   legitimacy gate, a fresh contamination assessment, new canaries, and reopening CONTEXT's "D-06
   carries the primary variable" lock. That is Option A at full price. It is the only path I can see
   that measures what D-12 asks.

**Two cheap things worth doing regardless of the D-12 decision:**

- Fix multi-line test-title extraction in `addedTestTitles`. A measured ~11% false negative on
  correct answers is a live threat to every future round, not just this one.
- Record the `SRVC:r1` baseline saturation (`no_skill` 3/3) in `e2e-red-srvx/targets.json`. It is the
  single most decision-relevant fact about that cell and it currently lives only in nine result
  directories.

---

## 6. Open items I did not resolve

1. Whether any battery pins the shape of a suite's `mechanical-red.json`. Adding any cell rewrites
   it. Cheap to check; I did not.
2. Whether `assertionShape()` would in fact separate Spy from Mock in vitest idiom. My reading is
   that it separates *state assertions from message assertions*, which is the Metz matrix and is what
   CONTEXT locked -- but it does **not** separate Meszaros' Spy from his Mock, because vitest has no
   idiomatic self-verifying mock. If the round wants to claim the five-kind distinction specifically,
   that gap needs naming before spend.
3. Whether the "second-order observable" target shape actually exists at a qualifying size. w8b
   logged this as assumption A5 and it is still unmeasured. It gates path 2 above.
