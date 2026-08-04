---
phase: 22-three-way-classifier-correctness-lz-refactor-lz-red
verified: 2026-08-04T09:40:00+02:00
status: gaps_found
score: 5/8 must-haves verified (ROADMAP SC1-SC8; includes 1 override)
behavior_unverified: 0
overrides_applied: 1
overrides:
  - must_have: "SC8: Placement decided empirically -- routing content authored in three variants, staged, A/B'd on routing correctness, and one variant SHIPPED before phase close"
    reason: "D-08/D-09/D-14/D-24 (22-CONTEXT.md, locked 2026-08-03): placement selection requires a metered A/B eval that must never run without fresh, explicit owner approval at run time, and a second, separately-approved metered EVL-01 regression round the D-06 description edits force. The phase's designed contract (D-24) is BUILD the three variants and PROVE the instrument correct entirely offline, then HALT -- 'no variant shipped' is the intended phase-close state, not an incomplete phase. REQUIREMENTS.md's own CLS-05 row and the phase's ROUTING-AB-RESULTS.md scaffold both state this explicitly. The verification task instructions direct judging CLS-05/SC8 on whether the instrument was built and proven offline, not on whether the measurement ran or a variant shipped."
    accepted_by: "owner (locked via D-08, D-09, D-14, D-24 -- 22-CONTEXT.md, 2026-08-03)"
    accepted_at: "2026-08-03T00:00:00+02:00"
gaps:
  - truth: "SC5 -- Body and description agree, per skill. Every in-body handoff matches its own frontmatter."
    status: failed
    reason: "lz-refactor/SKILL.md's intro paragraph (the first prose after the H1, sitting ABOVE the '## Two modes' heading and therefore outside all 11 surfaces check-rgr-routing.mjs parses) still states only the second hop of the two-hop rule. This is the phase's own confirmed BLOCKER (22-ACCEPTANCE-REVIEW.md B-1), independently re-verified against the file on disk at HEAD (684cbf6) -- no commit has touched this file since the fix commit 5be1bf3 (22-03), which predates the review."
    artifacts:
      - path: "plugins/lz-tdd/skills/lz-refactor/SKILL.md"
        issue: "Lines 26-27: 'Behavior changes belong to the green step and its sibling skill lz-tpp.' Names ONLY lz-tpp. D-02 requires an add-or-change-behavior ask with nothing failing yet to route to lz-red FIRST, then lz-tpp. Every other surface in the same file (frontmatter description L16-18, narrative L48-50, step-1 branch (c) L64-66) states the two-hop correctly; this is the one surviving surface with the old, wrong single-hop answer, and it is the first prose a model reads after the H1."
    missing:
      - "Rewrite lz-refactor/SKILL.md lines 26-27 to state the two-hop rule (lz-red first when nothing is failing yet, then lz-tpp), matching the frontmatter/narrative/step-1 wording already fixed elsewhere in the same file."
  - truth: "SC3 -- Single axis: no routing or mode-selection branch keys on test state (includes the surrounding coach prose, not only the 11 surfaces the gate parses)."
    status: failed
    reason: "lz-refactor/SKILL.md's intro paragraph, line 23, still reads 'with the tests green, it recommends the next NAMED refactoring' -- test-state framing that directly contradicts the '## Two modes' bullet ('A target carrying no tests is still coach mode, not an exclusion') and step 5's own untested-code branch, both of which were fixed in the same plan (22-03) that left this sentence untouched. check-rgr-routing.mjs cannot see this: the sentence sits above the first '## ' heading."
    artifacts:
      - path: "plugins/lz-tdd/skills/lz-refactor/SKILL.md"
        issue: "Line 23: 'with the tests green, it recommends the next NAMED refactoring' -- test-state framing outside the parsed surfaces, confirmed still present via direct read and git grep."
    missing:
      - "Reword the intro sentence to key on the ask (coach/reference mode) rather than on suite state, consistent with the '## Two modes' bullet already fixed in the same file."
  - truth: "SC5 -- Consistency: routing vocabulary is current across every surface in a skill, not only the parsed ones."
    status: failed
    reason: "lz-red/SKILL.md line 25 still reads 'restructuring passing code' -- the stale phrase plan 22-03 recorded normalizing to 'restructuring working code' only at line 41 (the narrative section). The intro paragraph, 16 lines above, was missed. Same structural blind spot as the BLOCKER: above the first '## ' heading."
    artifacts:
      - path: "plugins/lz-tdd/skills/lz-red/SKILL.md"
        issue: "Line 25: 'restructuring passing code without changing behavior is the refactor step' -- inconsistent with line 41's 'Restructuring working code' after the same plan's own normalization pass."
    missing:
      - "Change line 25's 'restructuring passing code' to 'restructuring working code' for vocabulary consistency with line 41."
  - truth: "SC5 -- Body and description agree: an in-body handoff must be coherent from the reader's own vantage, not merely mechanically parseable."
    status: failed
    reason: "lz-red/SKILL.md step 1 branch (c), line 74, reads 'hand off to lz-red first' -- INSIDE lz-red's own SKILL.md, telling lz-red to hand off to itself. Correct verbatim in the two sibling files (lz-refactor and lz-tpp, where 'lz-red' genuinely is a different skill); pasted here without adapting the vantage. The same file's own narrative gets it right at line 46 ('starts here in lz-red'). The mechanical gate PASSES this branch because destinationsIn() only extracts affirmed slugs and has no self-reference resolution by design -- it is blind to the semantic confusion of a skill naming itself as a hand-off target."
    artifacts:
      - path: "plugins/lz-tdd/skills/lz-red/SKILL.md"
        issue: "Line 74: 'hand off to lz-red first, because Law 1 gates production code behind a failing test' -- self-referential inside lz-red's own coach procedure."
    missing:
      - "Reword branch (c) to a self-owning form consistent with line 46's 'starts here in lz-red' while keeping the literal slug 'lz-red' present (required so check-rgr-routing.mjs's destinationsIn() still affirms the branch and corpus case c4's ordered pair still resolves)."
  - truth: "SC3 / SC5 -- the plugin-wide shared reference is plugin-neutral (no skill-relative vantage) in every section, not only the repaired seam section."
    status: failed
    reason: "Two skill-relative sentences survive in beck-tdd-by-example.md OUTSIDE the two regions plan 22-04 repaired (the scope line and the seam section). Both were named in deferred-items.md as required input to the D-26 review and independently found by all three D-18/SC7 reviewers per 22-ACCEPTANCE-REVIEW.md F-5/F-6. Re-confirmed present via direct read and git grep at HEAD."
    artifacts:
      - path: "plugins/lz-tdd/references/beck-tdd-by-example.md"
        issue: "Line 49 ('## The two rules'): 'The second rule is where this skill lives: removing that duplication is a refactoring, done under a green bar.' Two defects: 'this skill' cannot resolve in a file three skills read (misdirects an lz-red or lz-tpp reader), and 'done under a green bar' conditions the claim on suite state. Line 55 ('## Green-bar strategies'): '...the coach mentions them only to locate the seam' -- 'the coach' is unqualified in a file loaded from three distinct coaches, and for an lz-tpp reader it is actively harmful (Fake It / Triangulate / Obvious Implementation are lz-tpp's own subject matter, not something it only mentions in passing)."
    missing:
      - "Reword line 49 to attribute refactor-step ownership to lz-refactor by name (matching the seam section's now-repaired plugin-neutral register) and remove or requalify the green-bar gating clause."
      - "Reword line 55 to name lz-tpp explicitly rather than 'the coach', or otherwise disambiguate which of the three coaches is meant."
  - truth: "SC5 -- factual accuracy of the file's own scope claim."
    status: failed
    reason: "The scope line (lines 3-4) claims the file is shared 'so any of the three can name the seams it owns'. Verified false for lz-tpp: git grep -F 'beck-tdd-by-example' -- plugins/lz-tdd/skills/lz-tpp/ returns exit 1 (genuine absence; positive control confirms the pattern works and finds the citation in lz-red/SKILL.md and lz-refactor/references/principles.md). lz-tpp has zero path to this file today."
    artifacts:
      - path: "plugins/lz-tdd/references/beck-tdd-by-example.md"
        issue: "Lines 3-4 assert reach to 'any of the three' skills; only two (lz-red, lz-refactor) actually cite the file."
    missing:
      - "Either narrow the scope-line claim to the two skills that actually cite the file, or add a citation from lz-tpp/SKILL.md to close the gap the claim describes."
  - truth: "SC3 / SC5 -- description-tier consistency (requires a metered EVL-01 regression round; owner-approved 2026-08-04 per 22-ACCEPTANCE-REVIEW.md for inclusion in the gap plan)."
    status: failed
    reason: "The banned test-state string 'code whose tests already pass' survives verbatim in TWO shipped descriptions after YAML >- folding. D-03 removes test-state keying from routing, and the description is the highest-leverage routing surface in the system: lz-refactor's leading trigger clause gates on a state its own '## Two modes' disavows, and lz-red's exclusion is state-qualified so a cleanup ask on an UNTESTED target falls outside the exclusion and can wrongly trigger lz-red."
    artifacts:
      - path: "plugins/lz-tdd/skills/lz-refactor/SKILL.md"
        issue: "Lines 6-7 (frontmatter): 'clean up, tidy, simplify, restructure, or de-duplicate code whose tests already pass'."
      - path: "plugins/lz-tdd/skills/lz-red/SKILL.md"
        issue: "Lines 16-17 (frontmatter): 'Do NOT use it to restructure, clean up, or de-duplicate code whose tests already pass'."
    missing:
      - "Reword both exclusion clauses to key on the ask rather than test state. lz-red's folded description measures 1439/1536 chars (97 headroom) -- the rewrite must be length-neutral or shorter. Requires re-running the EVL-01 reciprocal trigger regression and /reload-plugins per D-06/D-19 -- owner already approved this spend for the gap plan."
  - truth: "SC5 -- each skill's description names both siblings it hands off to (symmetry with lz-red and lz-refactor's descriptions, which each name both)."
    status: failed
    reason: "lz-tpp/SKILL.md's description never names lz-refactor: both its refactoring exclusion and its add-a-feature exclusion name no destination, while the body (line 49, 64, 76) names lz-refactor explicitly. Incomplete rather than contradictory, but an asymmetry against SC5's per-skill agreement standard the other two descriptions meet. Ample headroom (840/1536 chars measured)."
    artifacts:
      - path: "plugins/lz-tdd/skills/lz-tpp/SKILL.md"
        issue: "Frontmatter description (lines 3-14) mentions lz-red by name but never lz-refactor, unlike lz-red's and lz-refactor's descriptions which each name both siblings."
    missing:
      - "Add a clause naming lz-refactor as the destination for a structure-only/cleanup ask, mirroring the reciprocal-naming pattern already present in the other two descriptions. Requires the same EVL-01 regression round as the previous gap (batch together)."
deferred: []
---

# Phase 22: Three-way classifier correctness (lz-refactor + lz-red) Verification Report

**Phase Goal:** Every request in the red-green-refactor loop lands with exactly one skill. The three
sibling classifiers (`lz-red`, `lz-tpp`, `lz-refactor`) become exhaustive, mutually exclusive, and
keyed on a single axis, so the loop the milestone claims to complete actually closes.

**Verified:** 2026-08-04
**Status:** gaps_found
**Re-verification:** No -- initial verification

## Summary of Finding

All 7 plans executed, merged, and self-report `status: complete`. The deterministic routing gate
(`check-rgr-routing.mjs`) is GREEN, both workspace check batteries are GREEN, `claude plugin validate .`
exits 0, and the CLS-05 placement A/B instrument is built and proven entirely offline. **However, the
phase's own D-18/SC7 acceptance review (`22-ACCEPTANCE-REVIEW.md`, dated 2026-08-04, run by the
orchestrator after all 7 plans merged) returned NOT ACCEPTED with one BLOCKER**, and `STATE.md`
currently records `status: gap-closure`. I independently re-verified every finding in that review
directly against the files on disk at HEAD (`684cbf6`) rather than trusting the review's narrative, and
confirm: **the BLOCKER and every "free to fix" finding remain unremediated in the shipped code.** No
commit since the review (`b31083b`, `684cbf6` -- both documentation-only) has touched any of the five
classifier-bearing files. `git log` confirms the last edits to `lz-refactor/SKILL.md` and
`lz-red/SKILL.md` are the 22-03 fix commits (`5be1bf3`, `86e2d17`), which predate the review.

**This is a confirmed instance of the exact failure mode the phase exists to fix: a GREEN deterministic
gate coexisting with a genuine, shipped classifier defect.** `check-rgr-routing.mjs` is structurally
blind to the BLOCKER because every one of its 11 parsed surfaces is anchored to a `## ` heading, and
the defect sits in the intro paragraph above the first heading in `lz-refactor/SKILL.md`. A GREEN gate
is not evidence the requirements closed -- this verification does not stop at the gate's exit code.

## Goal Achievement

### Observable Truths (ROADMAP Phase 22 Success Criteria SC1-SC8)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | **SC1 Exhaustive** -- every corpus case lands with exactly one named owner, no bare catch-all | VERIFIED | `check-rgr-routing.mjs` run directly: `SUMMARY: RGR-ROUTING GREEN`, exit 0. All 9 corpus cases resolve via `[cls-01] exhaustive`; all 8 router surfaces PASS `[cls-01] no bare catch-all terminal`. Direct read of all 3 `SKILL.md` step-1 procedures + the two reference-tier surfaces confirms 5 lettered branches (a-e) with a declared, slug-free residual in each. `git grep -c -E '^ +[a-d]\. '` across the three SKILL.md files = 12 (4 each). |
| 2 | **SC2 Mutually exclusive** -- at most one step-1 procedure claims any request; post-green case fires a positive lz-refactor branch | VERIFIED | `[cls-02] at-most-one` PASSES for all 9 cases (each claimed by exactly one procedure; c9 by none). c1 (post-green what-now) resolves via `refactor-step1#1d` as a positive branch, not a fallback. |
| 3 | **SC3 Single axis** -- no routing/mode-selection branch keys on test state | **FAILED** | The gate's `[cls-03] single-axis` PASSES on all 11 PARSED surfaces (confirmed: 11/11 PASS in my direct run). But `lz-refactor/SKILL.md:23` ("with the tests green, it recommends...") is test-state framing OUTSIDE the parsed surfaces, contradicting the fixed `## Two modes` bullet in the SAME file. See Gaps. |
| 4 | **SC4 Test code has a named owner** -- test-quality ask routes to lz-red, tidy-a-test-file routes to lz-refactor | VERIFIED | Corpus cases c3 (`red-step1`) and c5 (`refactor-step1`) resolve to different owners, confirmed in the gate's `[cls-02]` output ("c3 ... claimed by red-step1", "c5 ... claimed by refactor-step1"). |
| 5 | **SC5 Body and description agree, per skill** -- every in-body handoff matches its own frontmatter | **FAILED** | `lz-refactor/SKILL.md:26-27` still names only lz-tpp for a two-hop case (the confirmed BLOCKER). `lz-red/SKILL.md:25` and `:74` carry stale/self-referential prose. `beck-tdd-by-example.md:49,55` carry skill-relative sentences; its scope line (L3-4) overclaims reach to lz-tpp (verified false by `git grep`). Two shipped descriptions retain the banned test-state phrase verbatim (F-8); lz-tpp's description asymmetrically omits lz-refactor (F-9). See Gaps -- 7 distinct sub-findings. |
| 6 | **SC6 Guarded** -- a checker gate holds routing semantics from a parsed table, not token presence; mutation-tested both directions | VERIFIED | Ran `check-rgr-routing.selftest.mjs` directly: GREEN, exit 0, all mutation legs pass including the OLD-NEEDLE leg (proves this gate catches an evasion the prior TD-02 presence-needle would pass). Ran `check-red-references.mjs` directly: exit 0, roster label `125 checks`, unchanged (confirms D-16's byte-unchanged constraint held). Source inspection confirms no `existsSync` gating (both hits are header-comment prose, not code) and a `try/catch -> ""` read pattern. |
| 7 | **SC7 Fresh acceptance review passes; full battery + `claude plugin validate .` stay GREEN** | **FAILED** | The battery and `claude plugin validate .` ARE green (independently re-run: exit 0 both workspaces, exit 0 validate). But the acceptance-review HALF of this criterion explicitly returned **NOT ACCEPTED** (`22-ACCEPTANCE-REVIEW.md`, one BLOCKER). SC7 requires the review to PASS, not merely run. |
| 8 | **SC8 Placement decided empirically** | PASSED (override) | Per D-08/D-09/D-14/D-24 (locked 2026-08-03): the phase's designed contract is build-and-prove-offline, then HALT on owner approval -- not to select or ship a variant inside this phase. Verified directly: `build-variants.mjs` exit 0 (2 trees, 4 declared deltas each, matched exactly); `selfcheck-routing.mjs` exit 0, 6/6 cruxes PASS; `grade-routing.mjs --selfcheck` exit 0 (10 fixtures); `RUN-GATE.md` and `ROUTING-AB-RESULTS.md` both exist, correctly scaffolded, with zero computed figures. See override in frontmatter. |

**Score:** 5/8 truths verified (4 VERIFIED + 1 PASSED-override); 3 FAILED (SC3, SC5, SC7)

### Per-Requirement Verdict (CLS-01..CLS-05, as requested)

| Requirement | Verdict | Evidence |
|---|---|---|
| **CLS-01** -- Exhaustive by named-owner enumeration | **CLOSED** | Scoped literally to "step 1" per its own text. Gate GREEN (`[cls-01] exhaustive` 9/9, `[cls-01] no bare catch-all terminal` 8/8 router surfaces). Direct read of all 3 `SKILL.md` step-1 procedures + `three-laws-and-test-selection.md`'s classify-first block confirms 5 lettered branches with a declared, slug-free residual. No open finding is scoped to "step 1" itself. |
| **CLS-02** -- Mutually exclusive, test code owned by ask | **CLOSED** | Gate GREEN (`[cls-02] at-most-one` 9/9). c3 (lz-red) and c5 (lz-refactor) resolve to different owners, proving the test-code ask/file-kind distinction holds. |
| **CLS-03** -- Single axis (4 fixed sites) + SC5's consistency | **OPEN** | The 4 explicitly-named sites in the requirement text (`## Two modes` gates x2, lz-tpp step-1 hybrid branch, lz-refactor sweep-rule citation) ARE fixed and gate-verified GREEN. But CLS-03's own text maps to SC5 as well, and the confirmed, live BLOCKER (B-1) plus 6 further confirmed findings (F-2 through F-9) sit exactly in this territory: prose outside the parsed surfaces that still keys on test state or contradicts the fixed classifier beneath it. This is the requirement REQUIREMENTS.md maps SC5 onto, and SC5 is the one the review's BLOCKER is filed against. **Cannot be marked closed while B-1 is live.** |
| **CLS-04** -- Guarded semantically | **CLOSED** | Directly ran `check-rgr-routing.mjs` (GREEN) and `check-rgr-routing.selftest.mjs` (GREEN, mutation-tested both directions, including the OLD-NEEDLE closure proof). Directly ran `check-red-references.mjs` (GREEN, 125 checks, byte-unchanged roster). Source inspection confirms fail-closed design (no `existsSync` gate; `try/catch -> ""`). |
| **CLS-05** -- Placement decided empirically | **CLOSED (build-complete, HALT by design)** | Per explicit task framing and D-08/D-09/D-14/D-24: judged on whether the instrument was built and proven offline, not on whether the measurement ran. Directly verified: `build-variants.mjs`, `selfcheck-routing.mjs` (6/6 cruxes), `grade-routing.mjs --selfcheck` all GREEN at zero spend; `RUN-GATE.md` + `ROUTING-AB-RESULTS.md` exist, correctly scaffolded. "No variant shipped" is the intended state, not a gap. |

**4 of 5 CLS requirements genuinely closed. CLS-03 is OPEN, carrying the phase's confirmed BLOCKER plus
6 further live findings in the same territory.**

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `.claude/skills/lz-red-workspace/tools/lib/routing-parse.mjs` | Parser: 11 surfaces + 9 exported helpers | VERIFIED | Exists; export roster confirmed via selftest (`routing-parse.mjs exports exactly the nine named helpers`); wired into both the gate and its selftest (both run successfully importing it) |
| `.claude/skills/lz-red-workspace/tools/rgr-cases.json` | 9-case corpus | VERIFIED | Exists; corpus floor check confirms 9 cases, 1 residual, 1 ordered two-hop; consumed by the gate (per-case results in output) |
| `.claude/skills/lz-red-workspace/tools/check-rgr-routing.mjs` | Semantic routing gate | VERIFIED | Exists; ran directly, GREEN, exit 0; wired into `npm run check` (confirmed in battery output) |
| `.claude/skills/lz-red-workspace/tools/check-rgr-routing.selftest.mjs` | Both-directions mutation selftest | VERIFIED | Exists; ran directly, GREEN, exit 0, includes OLD-NEEDLE and export-roster legs |
| `plugins/lz-tdd/skills/lz-refactor/SKILL.md` | Exhaustive, ask-keyed, consistent classifier | VERIFIED (mechanically) / **CONTENT DEFECT** | Exists, edited, step-1/description/narrative fixed and gate-GREEN, but the intro paragraph (lines 23, 26-27) contradicts the fixed classifier beneath it -- see Gaps |
| `plugins/lz-tdd/skills/lz-red/SKILL.md` | Same | VERIFIED (mechanically) / **CONTENT DEFECT** | Same pattern: step-1/description/narrative fixed, but intro (line 25) and step-1 branch (c) (line 74) carry stale/self-referential prose -- see Gaps |
| `plugins/lz-tdd/skills/lz-tpp/SKILL.md` | Same, classifier-only edit | VERIFIED (mechanically) / **CONTENT DEFECT** | Step-1/Two-modes/narrative fixed, green-phase sanity check preserved verbatim; description asymmetrically omits lz-refactor -- see Gaps |
| `plugins/lz-tdd/skills/lz-red/references/three-laws-and-test-selection.md` | Reference-tier classifier repair | VERIFIED | Classify-first block matches the SKILL.md branch vocabulary; Law bullets and Sources byte-unchanged (confirmed via direct read); no open finding against this file specifically |
| `plugins/lz-tdd/references/beck-tdd-by-example.md` | Plugin-wide, three-way, ask-keyed seam | VERIFIED (repaired section) / **CONTENT DEFECT (adjacent sections)** | The seam section itself (repaired in 22-04) is three-way, plugin-neutral, ask-keyed and gate-GREEN. Two OTHER sections (lines 49, 55) plus the scope line (lines 3-4) carry unrepaired skill-relative/overclaiming prose -- see Gaps |
| `.claude/skills/lz-red-workspace/variants/build-variants.mjs` | Fail-closed variant tree builder | VERIFIED | Ran directly: 2 trees built, 4 declared deltas each, matched exactly, source untouched (195 files hashed identical) |
| `.claude/skills/lz-red-workspace/selfcheck-routing.mjs` | Offline 3-arm proof | VERIFIED | Ran directly: 6/6 cruxes PASS |
| `.claude/skills/lz-red-workspace/grade-routing.mjs` | Destination grader | VERIFIED | Ran `--selfcheck` directly: OK, 10 fixtures, all classes verified |
| `.claude/skills/lz-red-workspace/e2e-rgr-routing/RUN-GATE.md` | Gated presentation, two HALTs | VERIFIED | Exists (23622 bytes); required keywords present per 22-07's own verification table |
| `.claude/skills/lz-red-workspace/ROUTING-AB-RESULTS.md` | Writeup scaffold, all blank | VERIFIED | Exists (12603 bytes); confirmed no computed figures via `rg '[0-9]+\.[0-9]{2}'` returning exit 1 |

### Key Link Verification

| From | To | Via | Status | Details |
|------|-----|-----|--------|---------|
| `rgr-cases.json` | `check-rgr-routing.mjs` | `matchTokens`/`expectedOwner`/`expectedSecondHop` drive the exhaustive/at-most-one assertions | WIRED | Confirmed: gate output cites case ids and expected owners directly from the corpus |
| `routing-parse.mjs` `ROUTING_SURFACES` | the 11 (file, heading) pairs in `plugins/lz-tdd` | heading is the parse INPUT | WIRED | Confirmed: gate's scan-floor output names each file and its branch count; the heading-as-input design was independently confirmed via source read (no `existsSync`, `sectionBody` null-on-absent-heading) |
| `package.json` `scripts.check` | `check-rgr-routing.mjs` + its selftest | npm script chain | WIRED | Confirmed: `npm --prefix .claude/skills/lz-red-workspace run check` runs both, output shows the routing gate's full report inline |
| `run-e2e.mjs --arm placement` | `build-variants.mjs`'s two output trees | `VARIANT_B_DIR`/`VARIANT_C_DIR` sync | WIRED | Confirmed via `selfcheck-routing.mjs` crux 1 ("builder destinations and driver consts are in SYNC for both generated trees") |
| `grade-routing.mjs` | `rgr-cases.json` | `expectedLabelFor()` | WIRED | Confirmed via `selfcheck-routing.mjs` crux 6 ("all 9 expected labels round-trip through the grader's extractor") |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Routing gate derives verdict from parsed table, not presence | `node .claude/skills/lz-red-workspace/tools/check-rgr-routing.mjs` | `SUMMARY: RGR-ROUTING GREEN`, exit 0 | PASS |
| Gate is mutation-sensitive in both directions (fail-closed on rename/absence; stays green on incidental mention/reword) | `node .claude/skills/lz-red-workspace/tools/check-rgr-routing.selftest.mjs` | `SUMMARY: rgr-routing self-test GREEN`, exit 0, includes OLD-NEEDLE + export-roster legs | PASS |
| `check-red-references.mjs` roster arithmetic unperturbed (D-16) | `node .claude/skills/lz-red-workspace/tools/check-red-references.mjs` | `SUMMARY: RED-REFS GREEN`, 125 checks, all 13 new labels present, none of 64 retired survive | PASS |
| Destination grader extracts labels correctly, both directions | `node .claude/skills/lz-red-workspace/grade-routing.mjs --selfcheck` | OK, 10 fixtures, fail-closed paths + judge blinding verified | PASS |
| 3-arm placement instrument composes and proves offline | `node .claude/skills/lz-red-workspace/variants/build-variants.mjs && node .claude/skills/lz-red-workspace/selfcheck-routing.mjs` | GREEN both, 6/6 cruxes | PASS |
| Full lz-red workspace battery | `npm --prefix .claude/skills/lz-red-workspace run check` | exit 0 | PASS |
| Full lz-refactor workspace battery (hygiene, incl. widened scope) | `npm --prefix .claude/skills/lz-refactor-workspace run check` | exit 0 | PASS |
| Plugin structure validation | `claude plugin validate .` | `Validation passed`, exit 0 | PASS |
| Fail-closed design (no `existsSync` gating) | `git grep -n -B2 -A2 existsSync check-rgr-routing.mjs` | both hits are header-comment prose describing the deliberate absence, not code | PASS |
| Debt markers absent from changed files | `git grep -n -E "TBD\|FIXME\|XXX"` over all 5 shipped + 15 harness files | no matches | PASS |

**Note:** `selfcheck-red.mjs` (the ~15-minute, worktree-spawning check against 3 borrowed external
repos) was NOT re-run by me, per the task's explicit instruction. The orchestrator's prior run at the
same base commit is accepted as recorded in `22-07-SUMMARY.md`.

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|---|---|---|---|---|
| CLS-01 | 22-01, 22-03, 22-04 | Exhaustive by named-owner enumeration | SATISFIED | Gate GREEN; direct read confirms 5-branch structure with residual in all 5 relevant surfaces |
| CLS-02 | 22-01, 22-03, 22-04 | Mutually exclusive; test code owned by ask | SATISFIED | Gate GREEN; c3/c5 resolve to different owners |
| CLS-03 | 22-01, 22-03, 22-04 | Single axis; 4 fixed sites + consistency (maps SC3+SC5) | **BLOCKED** | 4 named sites fixed and gate-GREEN, but 7 confirmed live findings (B-1 BLOCKER + F-2..F-9) sit in this requirement's SC5-mapped territory |
| CLS-04 | 22-01 | Guarded semantically | SATISFIED | Gate + selftest + check-red-references.mjs all directly re-run, GREEN |
| CLS-05 | 22-05, 22-06, 22-07 | Placement decided empirically (build-then-halt) | SATISFIED (per design) | Instrument built and proven offline; HALT is the intended state per D-08/D-09/D-14/D-24 |

REQUIREMENTS.md's own checkboxes for all five remain `[ ]` (unchecked) and the Traceability table
still reads "Pending" for all five -- consistent with `STATE.md`'s `status: gap-closure` and with this
verification's finding that the phase has not closed.

**No orphaned requirements found.** Every CLS-0N id declared in REQUIREMENTS.md's Phase 22 Traceability
row appears in at least one plan's `requirements:` frontmatter field (confirmed: all 7 `22-0N-PLAN.md`
files carry a `requirements:` block naming a subset of CLS-01..CLS-05).

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `plugins/lz-tdd/skills/lz-refactor/SKILL.md` | 26-27 | In-body handoff omits the first hop, contradicting the fixed frontmatter/step-1/narrative in the same file | **BLOCKER** | A model reading this intro paragraph for an add-or-change-behavior/nothing-failing-yet ask sees only "hand to lz-tpp" -- reproducing the exact dead end ROADMAP SC1 names as a failing request |
| `plugins/lz-tdd/skills/lz-refactor/SKILL.md` | 23 | Test-state framing ("with the tests green, it recommends...") contradicting the fixed `## Two modes` bullet in the same file | Warning | Undermines SC3's single-axis guarantee at the narrative level, even though no parsed branch is affected |
| `plugins/lz-tdd/skills/lz-red/SKILL.md` | 25 | Stale vocabulary ("restructuring passing code") inconsistent with the same file's own line-41 normalization | Warning | Internal inconsistency within one shipped file |
| `plugins/lz-tdd/skills/lz-red/SKILL.md` | 74 | Self-referential branch ("hand off to lz-red first") inside lz-red's own coach procedure | Warning | Confusing to a reader even though the mechanical gate cannot see the self-reference as an error |
| `plugins/lz-tdd/references/beck-tdd-by-example.md` | 49, 55 | Skill-relative prose ("this skill", "the coach") in a file loaded from three distinct vantages | Warning | Misdirects a reader arriving from lz-red or lz-tpp; actively harmful for an lz-tpp reader at line 55 |
| `plugins/lz-tdd/references/beck-tdd-by-example.md` | 3-4 | Scope-line overclaim ("so any of the three can name the seams it owns") -- verified false for lz-tpp | Warning | Factual inaccuracy in the file's own self-description |
| `plugins/lz-tdd/skills/lz-refactor/SKILL.md`, `lz-red/SKILL.md` | 6-7, 16-17 | Banned test-state phrase survives verbatim in shipped `description` frontmatter | Warning (requires metered spend to fix) | The description is the highest-leverage routing surface; owner already approved the metered EVL-01 regression needed to fix this |
| `plugins/lz-tdd/skills/lz-tpp/SKILL.md` | 3-14 | Description never names lz-refactor (asymmetric vs. the other two skills' descriptions) | Info/Warning (requires metered spend to fix) | Incomplete rather than contradictory |

No TBD/FIXME/XXX debt markers found in any of the 5 shipped or 15 harness files this phase touched.

### Human Verification Required

None. Every finding above was independently confirmed programmatically (direct file read, `git grep`,
and re-running every relevant checker/selftest) and requires no human judgment to establish as a live,
unremediated defect. Three design questions raised by the acceptance review's reviewers (Q-1: whether
branch (d)'s "I just finished making a test pass, what now?" trigger is itself a suite-state report;
Q-2: whether first-match is the right policy for a compound ask like c8; Q-3: whether the router's
five-way duplication across files/references has begun to drift) are recorded as open design questions
in `22-ACCEPTANCE-REVIEW.md` but are explicitly NOT classified as defects by that review, and I concur
-- they do not block a verdict on any SC/CLS item and are noted here only for completeness, not as
gaps requiring closure before the next attempt.

### Gaps Summary

**The phase has NOT achieved its goal.** Seven distinct, independently-confirmed, unremediated
content defects remain in the shipped classifier prose, one of them a confirmed BLOCKER
(`lz-refactor/SKILL.md:26-27`) that directly reproduces the dead end ROADMAP SC1 was written to close.
All seven live in the same structural blind spot: prose that sits outside the 11 surfaces
`check-rgr-routing.mjs` parses, so the deterministic gate reports GREEN while these defects remain.
This is not a new failure mode -- it is the exact one this phase exists to fix, now recurring one
layer up (in the gate's own coverage boundary rather than in the original three-way classifier).

Five of the seven gaps are body-only fixes requiring zero metered spend (the BLOCKER plus F-3, F-4,
F-5, F-6, F-7). Two require a metered EVL-01 reciprocal-trigger regression round because they touch
shipped `description` frontmatter (F-8, F-9); the owner already approved this spend for inclusion in
the gap-closure plan per `22-ACCEPTANCE-REVIEW.md`'s own note ("OWNER APPROVED 2026-08-04").

This matches the project's own `STATE.md`, which already records `status: gap-closure` and names the
same BLOCKER. This verification independently confirms that status is accurate: no remediation commit
has landed since the review, and every finding the review reported is still present in the code at
HEAD (`684cbf6`).

**Recommended next step:** `/gsd-plan-phase 22 --gaps`, covering all 7 findings above (5 body-only +
2 requiring the description-tier regression round), followed by `/gsd-execute-phase 22 --gaps-only`,
then a second D-18/SC7 acceptance review before the phase can close.

CLS-05's placement question remains correctly BUILT-and-HALTED regardless of this gap-closure round
-- it is not part of the gap and should not be conflated with it.

---

_Verified: 2026-08-04_
_Verifier: Claude (gsd-verifier)_
