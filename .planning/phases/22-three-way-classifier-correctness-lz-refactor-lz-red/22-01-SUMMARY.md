---
phase: 22-three-way-classifier-correctness-lz-refactor-lz-red
plan: 01
subsystem: dev-harness (lz-red-workspace deterministic battery)
tags: [guard, parser, mutation-testing, instrument-first, asserted-red, classifier-routing]
requires:
  - .claude/skills/lz-refactor-workspace/tools/lib/section-body.mjs (source of the copied module)
  - .claude/skills/lz-red-workspace/package.json (scripts.check chain)
  - the eleven declared classifier surfaces under plugins/lz-tdd (read-only inputs)
provides:
  - tools/lib/routing-parse.mjs -- ROUTING_SURFACES, TEST_STATE_TOKENS, RESIDUAL_MARKER_RE, CATCHALL_CONDITION_RE, parseRoutingBranches, keysOnTestState, destinationsIn, matchesSkillName, foldedDescription
  - tools/rgr-cases.json -- the single-source 9-case corpus (consumed by 22-05's e2e-rgr-routing prompts)
  - tools/check-rgr-routing.mjs -- the semantic routing gate, wired into npm run check
  - tools/check-rgr-routing.selftest.mjs -- 9 mutation legs, both directions
affects:
  - 22-03 / 22-04 (the authored classifier must satisfy this gate's labels)
  - 22-05 (prompts derived from rgr-cases.json, ids matching)
  - 22-06 (build-variants / selfcheck-routing consume ROUTING_SURFACES' variantScope)
tech-stack:
  added: none (node builtins only, zero dependencies)
  patterns:
    - parsed (condition -> destination) table instead of a presence needle
    - heading as a parse INPUT, so a rename fails closed
    - try/catch -> "" whole-file read, never an existence-probe gate
    - branch-scope whitespace flattening for wrap tolerance
    - both-directions mutation selftest over in-memory fixtures only
    - OLD NEEDLE leg committed as evidence rather than discarded to scratch
key-files:
  created:
    - .claude/skills/lz-red-workspace/tools/lib/section-body.mjs
    - .claude/skills/lz-red-workspace/tools/lib/routing-parse.mjs
    - .claude/skills/lz-red-workspace/tools/rgr-cases.json
    - .claude/skills/lz-red-workspace/tools/check-rgr-routing.mjs
    - .claude/skills/lz-red-workspace/tools/check-rgr-routing.selftest.mjs
  modified:
    - .claude/skills/lz-red-workspace/package.json (scripts.check only)
decisions:
  - "isBareCatchAll drops the plan's owner-naming conjunct: requiring the owner SLUG would make the check un-failable against the four shipped catch-alls, which use the house self-reference form a literal parser cannot see."
  - "The sentence-fragment skill-name filter is scoped to kind router, not to parseMode sentences alone: filtering mode gates would zero their branches and make single-axis vacuous on the two gates D-03 names."
  - "c8 carries expectedSecondHop null; its second step lives in rationale, keeping c4 the corpus's only ordered two-hop."
  - "The QUESTION/COMMAND pointer check is section-scoped rather than item-4-scoped, avoiding a duplicated numbered-item splitter."
  - "The selftest restates covers/owns rather than importing the gate, which is a top-level script that would exit on import."
metrics:
  duration: ~70 min (14:22 base -> 15:32 final task commit, 2026-08-03)
  tasks: 3
  commits: 3
  files-created: 5
  files-modified: 1
  gate-failures-at-baseline: 20
  selftest-assertions: 63
completed: 2026-08-03
status: complete
---

# Phase 22 Plan 01: Semantic routing gate, instrument-first and asserted RED -- Summary

Built the parsed `(condition -> destination)` routing gate, its 9-case corpus and its
both-directions mutation selftest, wired the gate into the lz-red battery, and **asserted the gate
RED against the tracked tree at 20 attributable failures** -- the instrument-first baseline that
CLS-01..CLS-04 close against once waves 22-03 and 22-04 author the classifier. No shipped Markdown
was touched.

## What was built

| Artifact | Role | State |
|----------|------|-------|
| `tools/lib/section-body.mjs` | copied level-2 section extractor | function body byte-identical to the lz-refactor-workspace original |
| `tools/lib/routing-parse.mjs` | the parser: 11 surfaces as data + 9 exported helpers | 553 lines |
| `tools/rgr-cases.json` | single-source 9-case corpus, provenance-honest | 9 cases, 1 residual, 1 ordered two-hop |
| `tools/check-rgr-routing.mjs` | the semantic gate | **RED, exit 1, 20 failures (by design)** |
| `tools/check-rgr-routing.selftest.mjs` | 9 mutation legs, both directions | **GREEN, exit 0, 63 assertions** |
| `package.json` | `scripts.check` wiring | appended; `typecheck` + `devDependencies` untouched |

The structural fix the phase needed: **the heading is a parse INPUT, not an assertion.** Renaming a
heading makes `sectionBody` return `null`, which the gate reports as an attributable failure. That is
the inverse of the measured F-1 ceiling, where the heading WAS the assertion and a rename left the
125-check battery green.

## The RED baseline, itemized

`node .claude/skills/lz-red-workspace/tools/check-rgr-routing.mjs` -> `SUMMARY: RGR-ROUTING RED --
20 hard failure(s)`, exit 1. Every failure names a surface id or a corpus case id.

| # | Failing label | Why this is CORRECT today |
|---|---------------|---------------------------|
| 1 | `[cls] scan floor -- beck-seam` | The entry declares the POST-REPAIR heading `The seam across the three steps`. Today's file carries `## The seam with lz-tpp`, so the heading is absent -- exactly the fail-closed signal. 22-04 authors the repair. |
| 2-9 | `[cls-01] exhaustive -- c1..c5, c7, c8, c9` | No step-1 branch routes these cases to their expected owner. `c1` (post-green what-now -> `lz-refactor`) is the phase's BLOCKER: today's `lz-refactor` step 1 is positive-only and loses the request. `c9`'s declared residual terminal does not exist yet. |
| 10-13 | `[cls-01] no bare catch-all terminal -- red-step1, red-narrative, tpp-narrative, laws-classify` | The four shipped `otherwise ... is this skill` terminals D-01 removes. |
| 14-19 | `[cls-03] single-axis -- refactor-modes, red-step1, red-narrative, tpp-step1, tpp-modes, tpp-narrative` | Six branches decide ownership from test state. Matched tokens are printed per branch: `tests are green` + `has a smell` (refactor-modes), `already-passing code` (red-step1, red-narrative, tpp-narrative#s5), `tests are green` + `all prior tests green` (tpp-step1), `a failing (red) test plus` (tpp-modes), `tests already pass` (tpp-narrative#s4). |
| 20 | `[cls-03] QUESTION/COMMAND anchor resolves` | Both halves fail: there is no `## QUESTION vs COMMAND intent routing` heading, and step 4's pointer says `QUESTION/COMMAND intent routing`, not the heading string verbatim. 22-03 authors both halves (D-07). |

### What PASSES today, and why that is honest rather than lax

- `[cls] corpus floor` -- 9 cases, 11 surfaces, 3 step-1 procedures. The anti-vacuity floor inside
  the real gate.
- `[cls] scan floor` on the other ten surfaces -- their headings resolve and they parse to 1-6
  branches each.
- `[cls-01] exhaustive -- c6` (make this failing test pass -> `lz-tpp`, via `refactor-step1#1`). This
  is the one seam that already routes correctly; the corpus carries it as a regression floor and it
  is expected to be green.
- `[cls-02] at-most-one` on all 9 cases -- vacuously true today (no case has a covering branch at
  all, so nothing self-claims). It becomes load-bearing the moment waves 2-3 author the branches.
- `[cls-01] no bare catch-all` on `refactor-step1`, `refactor-narrative`, `tpp-step1` -- correct:
  those three carry no `otherwise` terminal. `lz-refactor`'s defect is the opposite one (it LOSES
  requests), which `[cls-01] exhaustive` catches.
- `[cls-03] sweep-rule citation resolves` -- the sweep rule's `(step 1)` sentence names `lz-tpp`, and
  step 1 does route a behavior-change ask to `lz-tpp`. The D-03 defect at that line is the citation's
  claim about a rule's CONTENT, which 22-03 reconciles; the destination itself resolves today.
- `[cls] description char cap` -- **1233 / 750 / 1245**, matching the plan's measured baseline
  exactly. GREEN on purpose: it is a live budget guard for D-06's rewording (lz-refactor has 291
  chars of headroom), not a baseline to flip.

## Fail-closed behavior test (recorded per the plan's acceptance criterion)

Parked `plugins/lz-tdd/skills/lz-red/references/three-laws-and-test-selection.md` (the only file
backing exactly one surface), re-ran, restored, re-ran. Full label-level delta:

```
[cls] scan floor -- laws-classify                  PASS -> FAIL   (new, attributable)
    "surface text is empty -- unreadable file or empty document,
     so heading "The Three Laws spine and classify-first" is unreachable"
[cls-01] no bare catch-all terminal -- laws-classify  FAIL -> PASS (goes vacuous at 0 branches)
[cls-03] single-axis -- laws-classify               PASS -> PASS   (detail: 6 -> 0 branches)
```

- No crash; exit stayed 1. No report vanished -- the label roster is line-for-line identical, only
  verdicts and details changed. That is the D-17 property under test: a missing file yields exactly
  ONE new attributable failure rather than silence.
- Restoring reproduced the baseline output **byte-for-byte** (`diff` clean).

**Honest caveat on the plan's arithmetic.** The plan predicted "EXACTLY ONE additional FAIL", i.e. a
net count of +1. The net is 0, because the surface's branch-level failure goes vacuous as its
scan-floor failure arrives. This is unavoidable against an already-RED baseline: no single backing
file yields a net +1 today, since every backing file already has at least one failing surface. The
prediction was written for a GREEN-baseline world. The property it was testing holds; read the label
set, not the count. The gate's own header now says so.

## Deviations from Plan

### Auto-fixed issues

**1. [Rule 1 - Bug] `isBareCatchAll` would have been un-failable as literally specified**

- **Found during:** Task 1 (design), confirmed against Task 2's baseline.
- **Issue:** The plan specifies `isBareCatchAll` as `CATCHALL_CONDITION_RE matches AND destinations
  includes surface.owner AND RESIDUAL_MARKER_RE does not match`. The middle conjunct cannot hold for
  any of today's four shipped catch-alls: they say `otherwise ... is this skill's work` /
  `continue here` in the house SELF-REFERENCE form, and the parser has no self-reference resolution
  by design (critical rule 7 forbids adding it). So the three-conjunct predicate evaluates false on
  every shipped catch-all, the check could not fail against the tracked tree, and it would have been
  a guard-that-cannot-fail -- the exact vacuity class this phase exists to close. It also
  contradicted the plan's own acceptance criterion requiring FAILs on `red-step1`, `red-narrative`,
  `tpp-narrative` and `laws-classify`.
- **Fix:** dropped the owner-naming conjunct. A bare catch-all is now an otherwise-conditioned branch
  that does NOT carry the explicit no-owner residual marker. This is strictly STRONGER, not weaker:
  the plan's version was evadable by writing `otherwise ... continue here`, which is precisely
  today's shape. It stays GREEN on the target shape (the residual terminal matches
  `RESIDUAL_MARKER_RE`; positive branches carry positive conditions), proven by selftest mutation 0
  vs mutation 1. Rationale is documented at the site.
- **Files modified:** `tools/lib/routing-parse.mjs`
- **Commit:** `127992f`

**2. [Rule 1 - Bug] The sentence-fragment filter had to be scoped to routers, not to sentence mode**

- **Found during:** Task 1 (design), verified against Task 2's baseline.
- **Issue:** The plan scopes the "keep only fragments that affirm a skill name or match the residual
  marker" filter to `parseMode "sentences"`. All three mode gates are sentence-mode and name no skill
  by design, so the filter would zero their branches -- turning `[cls-03] single-axis` vacuous on
  `refactor-modes` and `tpp-modes`, the two sites D-03 names and the two the plan's own acceptance
  criterion requires to FAIL.
- **Fix:** the filter applies only when `kind === "router"` AND `parseMode === "sentences"`. Mode
  gates keep every non-empty fragment. Lettered items are structurally delimited and never filtered.
  The plan's prose said "a ROUTING section", so this follows its intent and its acceptance criteria
  over its narrower literal clause. Documented at the site.
- **Files modified:** `tools/lib/routing-parse.mjs`
- **Commit:** `127992f`

**3. [Rule 3 - Blocking] `existsSync` token in the lib header vs the clean-token-grep criterion**

- **Found during:** Task 1 verification.
- **Issue:** The plan requires the lib to carry the fail-closed rationale (which names the
  existence-probe API it refuses) AND requires `git grep -c "existsSync"` on the lib to report no
  matches. Both cannot hold literally.
- **Fix:** reworded the lib's header to state the rationale without the literal token ("never gates a
  read on a file-existence probe"), and noted there that the CHECKER's header does carry the literal
  by design. Task 2's own criterion already anticipates this by asserting the checker's behavior
  rather than grepping it. No behavior change.
- **Files modified:** `tools/lib/routing-parse.mjs`
- **Commit:** `127992f`

**4. [Rule 1 - Bug] Selftest fixture: dropping one line orphaned a branch's continuation lines**

- **Found during:** Task 3 (caught by the selftest's own failing assertion, not by inspection).
- **Issue:** Mutation 2 dropped only the line carrying `c.`, leaving branch (c)'s two continuation
  lines to be absorbed by branch (b). Branch (b) then reported a third destination, so the ordered
  two-hop assertion for case `f2` failed. A fixture artifact reading as a guard defect.
- **Fix:** mutation 2 now drops all three of the branch's lines, each with its own `notEqual` guard.
  Documented at the site so a later reader does not reintroduce the single-line drop.
- **Files modified:** `tools/check-rgr-routing.selftest.mjs`
- **Commit:** `9e853a0`

### Interpretations recorded (not deviations, but worth flagging to the reviewer)

- **`c8` carries `expectedSecondHop: null`.** The plan describes c8 as "one owner plus a named second
  step" AND requires "exactly one case has a non-null expectedSecondHop". Both hold only if c4 is the
  sole two-hop, so c8's second step lives in its `rationale` and its `matchTokens` bind the primary
  ask. This keeps c4 the unambiguous pin for D-02's ORDER claim.
- **`c4`'s `matchTokens` deliberately exclude `nothing failing yet`.** That phrase is a
  `TEST_STATE_TOKEN`, so binding c4 on it would demand a branch D-03 forbids, making the gate
  unsatisfiable by construction. c4 binds on the ask (`add a new behavior`). The coupling is
  documented in both files so wave 2 sees it before authoring.
- **The QUESTION/COMMAND pointer check is section-scoped, not item-4-scoped**, to avoid duplicating
  the numbered-item splitter in the checker. Reasoning at the site: moving the pointer to another step
  of the same procedure is not the defect being closed; a dangling cross-reference is. The anchor
  heading itself sits outside the procedure's section body, so the check cannot self-satisfy.
- **The selftest restates `covers` / `owns` rather than importing the gate.** The gate is a top-level
  script by house convention and would run and exit on import. The restatement is minimal and
  identical in shape; the gate's end-to-end wiring is evidenced separately by its RED baseline.

**No `plugins/lz-tdd/` file was edited, no gate was weakened, and no metered command ran.**

## Verification performed

| Check | Result |
|-------|--------|
| `node --check` on all 3 new `.mjs` + the copy | exit 0 |
| `rgr-cases.json` shape (9 cases, 1 NONE, 1 second hop, c3 != c5 owner, RECONSTRUCTED) | pass |
| `ROUTING_SURFACES` (11 entries, 7 fields each, 3 `variant-a`, 3 `mode-gate`, `beck-seam` heading) | pass |
| Export roster (9 named helpers, sorted, exact) | pass |
| `destinationsIn` self-reference gap + slug affirmation | pass |
| `diff` of the copied `section-body.mjs` vs its source | differs ONLY by the 3-line appended header sentence |
| `node tools/check-rgr-routing.selftest.mjs` | **GREEN**, exit 0, 63 assertions, 0 failures |
| `node tools/check-rgr-routing.mjs` | **RED**, exit 1, 20 failures, all attributable |
| Fail-closed behavior test (park / re-run / restore / re-run) | 1 new attributable FAIL, no crash, restore byte-identical |
| `node tools/check-red-references.mjs` | exit 0, roster still `125 checks ... all 13 new labels present ... none of the 64 retired labels survive` |
| `git diff --stat` on `check-red-references.mjs` and `selfcheck-red.mjs` | empty (byte-unchanged) |
| `npm --prefix .claude/skills/lz-red-workspace run check` | 3 existing GREEN -> new selftest GREEN -> gate RED, overall exit 1 |
| `node .claude/skills/lz-refactor-workspace/tools/check-hygiene.mjs` | exit 0, 197 files clean |
| `claude plugin validate .` | exit 0, validation passed |
| `git status --porcelain plugins/lz-tdd` | empty |
| ASCII-only (`LC_ALL=C rg -c -N '[^\x00-\x7F]'`) on all 6 files | zero non-ASCII bytes |
| Email allowlist-inversion on all new files | zero email-shaped tokens (no needle written) |
| Selftest reads no document (`plugins` / `readFileSync` token grep) | zero matches each |
| Both mutation helpers assert (`notEqual` grep) | 2 matches, one per helper |
| 22-02's four files (`check-hygiene.mjs`, `check-evals.mjs`, `.gitignore`, `REQUIREMENTS.md`) | untouched |

## Known Stubs

None. Every authored file is complete and runnable. The gate's RED verdict is an asserted baseline,
not a stub -- it reads real surfaces, parses them, and reports real defects.

## Threat Flags

None. The plan's threat register is fully covered by what shipped:

| Threat | Mitigation as built |
|--------|---------------------|
| T-22-VAC (vacuous pass) | no existence-probe gate anywhere; `try/catch -> ""`; `[cls] scan floor` + `[cls] corpus floor` are explicit non-vacuity checks; selftest mutation 8 is the anti-vacuity control; mutations 4 and 5 prove heading-rename and missing-file both FAIL |
| T-22-CEIL (needle ceiling) | heading is a parse input; OLD NEEDLE leg commits the measurement on three fixtures |
| T-22-INJ (heading into RegExp) | `sectionBody` regex-escapes the heading (copied verbatim) |
| T-22-PII | allowlist-inversion only; zero email-shaped tokens in the new files; no forbidden value written as a needle; ASCII enforced at byte level |
| T-22-SPEND | no `claude -p` command exists in any file this plan added; none ran |
| T-22-DEP | only `scripts.check` edited; no dependency added |

## Follow-ups for later waves (no action needed now)

1. **22-03 / 22-04 must name themselves LITERALLY.** The parser resolves no self-reference by design,
   so a self-owning branch written as `continue here` / `this skill's work` parses to ZERO
   destinations and will not satisfy `[cls-01] exhaustive`. Each branch must name its owner slug.
2. **`beck-seam`'s heading must become `The seam across the three steps`** exactly, or `[cls] scan
   floor` stays RED.
3. **`matchTokens` are the authoring contract.** Each branch's condition must contain every token of
   the cases it owns. The full token set is in `rgr-cases.json`; `nothing failing yet` is banned from
   any condition (it is a `TEST_STATE_TOKEN`).
4. **22-03 owes both halves of the anchor**: the `## QUESTION vs COMMAND intent routing` heading AND
   a step-4 pointer naming that string verbatim.
5. **`[cls-02] at-most-one` is vacuous today** and only becomes load-bearing once branches exist.
   Whoever verifies waves 2-3 should confirm it reports `claimed by <one surface>` rather than
   `claimed by no procedure for itself` for each case.

## Self-Check: PASSED

- All 5 created files + the 1 modified file confirmed present on disk.
- All 3 commit objects confirmed to exist: `127992f`, `2113432`, `9e853a0`.
- No `STATE.md` or `ROADMAP.md` modification (worktree mode; the orchestrator owns those).
