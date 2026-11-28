---
phase: 22-three-way-classifier-correctness-lz-refactor-lz-red
audited: 2026-08-04
auditor: gsd-security-auditor (retroactive, adversarial stance)
asvs_level: 1
block_on: high
threats_total: 60
threats_verified: 60
threats_closed: 60
threats_open: 0
threats_open_nonblocking: 0
accepted_risks: 2
unregistered_flags: 0
method: "Every mitigation re-verified against the MERGED tree by running the actual checkers/selfchecks/build scripts live, reading source for the safety-critical files in full (build-variants.mjs, section-body.mjs), running independent regex scans (allowlist-inversion email sweep across all 67 phase-touched files, positive-controlled wrap-tolerant greps), and diffing frozen files across the whole phase range (e01201a^..HEAD). SUMMARY.md claims were treated as leads to verify, never as evidence."
---

# Phase 22 -- Security Audit (retroactive)

**Phase:** 22 -- Three-way classifier correctness (lz-refactor + lz-red)
**Plans audited:** 22-01 through 22-08 (all merged; phase verified `passed` 8/8 per `22-VERIFICATION.md`)
**ASVS enforcement level:** 1 (as declared identically in all eight plans' `<threat_model>` blocks; no
project-level override found in `.planning/config.json`)
**Blocking severity threshold:** high
**Verdict: SECURED. 60/60 threats CLOSED. 0 open. 2 accept-disposition threats verified and logged
below. 0 unregistered attack surface found.**

This audit does not accept the phase's own documentation (`22-VERIFICATION.md`,
`22-ACCEPTANCE-REVIEW.md`, the eight `*-SUMMARY.md` files) as proof of anything. Every row below was
re-derived from the merged code: live tool runs, full source reads of the two highest-risk files,
independent grep/regex sweeps with positive controls, and `git diff`/`git log` against the pre-phase
base commit (`e01201a^`, the commit immediately before Phase 22 was added). Where a plan's SUMMARY made
a specific factual claim (a byte count, a file count, a hash), this audit reproduced the measurement
itself rather than reading the number off the page.

## Methodology notes specific to this phase

- **Base commit for "byte-unchanged since Phase 22 started" claims:** `e01201a^` = `6049aaa`.
- **Live commands actually executed during this audit** (all offline, zero model spend, safe to
  re-run): `node .claude/skills/lz-red-workspace/tools/check-rgr-routing.mjs`,
  `node .claude/skills/lz-red-workspace/tools/check-rgr-routing.selftest.mjs`,
  `node .claude/skills/lz-red-workspace/variants/build-variants.mjs`,
  `node .claude/skills/lz-red-workspace/selfcheck-routing.mjs`,
  `node .claude/skills/lz-red-workspace/grade-routing.mjs --selfcheck`,
  `node .claude/skills/lz-red-workspace/grade-red.mjs --selfcheck`,
  `node .claude/skills/lz-red-workspace/merge-judge.mjs --selfcheck`,
  `node .claude/skills/lz-red-workspace/tabulate-mechanical-red.mjs --selfcheck`,
  `node .claude/skills/lz-red-workspace/check-evals.mjs`,
  `node .claude/skills/lz-red-workspace/extract-samples.mjs`,
  `node .claude/skills/lz-refactor-workspace/tools/check-hygiene.mjs`,
  `node .claude/skills/lz-refactor-workspace/tools/check-crossrefs.mjs`,
  `npm --prefix .claude/skills/lz-red-workspace run check`,
  `npm --prefix .claude/skills/lz-refactor-workspace run check`,
  `claude plugin validate .`, `claude plugin validate . --strict`. **All exited 0 / GREEN**, confirmed
  by capturing real exit codes (not a downstream `tail`/pipe exit code).
- **No metered command was run by this audit.** `run-e2e.mjs`, any `claude -p` invocation, and
  `selfcheck-red.mjs` (the ~15-minute worktree-spawning check) were deliberately NOT run, per the task's
  explicit instructions.
- **Independent allowlist-inversion email sweep:** every email-shaped token (`[A-Za-z0-9._%+-]+@...`)
  in all 67 files this phase touched or added (`git diff --name-only e01201a^ HEAD` over
  `plugins/lz-tdd`, both workspaces, the phase's planning dir, and `REQUIREMENTS.md`) was extracted with
  a fresh regex, not the project's own checker. Result: the ONLY email-shaped token anywhere is
  `larsbrinknielsen@gmail.com`, the approved public contact. This report contains no forbidden value in
  any form, escaped or otherwise -- the finding above is stated by naming the approved value only.

---

## Threat Register -- Plan 22-01 (semantic routing gate, instrument-first RED)

| Threat ID | Category | Severity | Disposition | Status | Evidence |
|-----------|----------|----------|--------------|--------|----------|
| T-22-VAC | Tampering (undetected vacuous pass) | high | mitigate | CLOSED | Live run of `check-rgr-routing.mjs`: `[cls] scan floor` and `[cls] corpus floor` both PASS as explicit non-vacuity checks; `check-rgr-routing.selftest.mjs` mutation 8 ("anti-vacuity: an emptied corpus and an emptied surface list both FAIL") PASSES; mutations 4/5 (renamed heading / vanished file) both fail closed with an attributable reason, confirmed live. |
| T-22-CEIL | Tampering (undetected, needle ceiling) | high | mitigate | CLOSED | `routing-parse.mjs` read in full: heading is a parse INPUT (`sectionBody` returns `null` on rename, gate treats null as FAIL). Selftest's dedicated "OLD NEEDLE" section, run live, proves a bare presence test GOES GREEN on the re-introduced catch-all and the renamed heading while the new predicate goes RED on both -- the committed closure evidence for the F-1 ceiling. |
| T-22-INJ | Tampering (regex injection) | low | mitigate | CLOSED | Read `.claude/skills/lz-red-workspace/tools/lib/section-body.mjs` in full: `escapeRe(s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")` escapes the heading before RegExp construction. `diff` against the lz-refactor-workspace original: byte-identical except one appended header sentence -- confirms D-16's "copy the READ" requirement, no cross-workspace import. |
| T-22-PII | Information Disclosure | medium | mitigate | CLOSED | Independent regex sweep (not the project's own checker) across all 67 phase-touched files: only `larsbrinknielsen@gmail.com` present anywhere. |
| T-22-SPEND | Unauthorized resource use | high | mitigate | CLOSED | No `claude -p` invocation found in any file this plan added (only doc/comment mentions in unrelated frozen files); no results/run-*/outputs directory tracked in git; `git log` shows no metered-run commit in this plan's range. |
| T-22-DEP | Tampering (supply chain) | low | accept | CLOSED (accepted risk, logged below) | `git diff e01201a^ HEAD -- .claude/skills/lz-red-workspace/package.json`: only `scripts.check` line changed; `devDependencies` block untouched. |

## Threat Register -- Plan 22-02 (close instrument holes, formalize CLS-01..05)

| Threat ID | Category | Severity | Disposition | Status | Evidence |
|-----------|----------|----------|--------------|--------|----------|
| T-22-VAC2 | Tampering (undetected, widened scope) | high | mitigate | CLOSED | Live `check-hygiene.mjs` run: `files: 199`, `192 files clean`, and `[PASS] [cls] hygiene scope floor -- plugin-wide references + README reached -- wide 199 / verbatim 192 (197 / 190 before the D-21 widen)` -- the risen-count non-vacuity floor is present and passing, not merely printed. |
| T-22-VAC3 | Tampering (undetected, clause-8 widen) | medium | mitigate | CLOSED | `git grep -n "SKIP is not a pass"` on `check-evals.mjs`: message intact. `git grep -n "startsWith('e2e-')"`: zero matches (no loosened prefix). `git grep -n "e2e-rgr-routing"`: named-set entry `ROUTING_SUITE_DIR = 'e2e-rgr-routing'` present. Live run: 26 authored files across 4 suite dirs swept (up from the 14-files/3-dirs baseline). |
| T-22-PII2 | Information Disclosure | medium | mitigate | CLOSED | Same independent sweep as T-22-PII; covers `REQUIREMENTS.md` and the two newly-scanned files. |
| T-22-IP | Legal/IP (verbatim prose reaching no-verbatim axis) | medium | mitigate | CLOSED | Live hygiene run: `192 files clean` under the no-verbatim axis, which now includes `beck-tdd-by-example.md`; `QUOTE_THRESHOLD` confirmed unchanged (`git diff` on that line across the whole phase is empty). |
| T-22-REG | Tampering (Phase 21 frozen evidence) | medium | mitigate | CLOSED | `git diff --stat e01201a^ HEAD -- selfcheck-red.mjs`: empty (byte-unchanged). |
| T-22-SPEND2 | Unauthorized resource use | high | mitigate | CLOSED | Same evidence class as T-22-SPEND. |

## Threat Register -- Plan 22-03 (author the three shipped classifiers)

| Threat ID | Category | Severity | Disposition | Status | Evidence |
|-----------|----------|----------|--------------|--------|----------|
| T-22-TRIG | Tampering (behavioral regression, description edits) | high | mitigate | CLOSED | Live gate run: `[cls] description char cap` PASSES for all three skills; the metered EVL-01 reciprocal trigger regression remains correctly HALT-gated (never run -- confirmed below under T-22-SPEND7/T-22-LIVE), which is the plan's own declared mitigation boundary, not a gap. |
| T-22-DEGRADE | Tampering (behavioral regression, shipped bodies) | high | mitigate | CLOSED | `check-rgr-routing.mjs` GREEN (all 11 surfaces, 9 cases); `claude plugin validate .` and `--strict` both exit 0; genuine independent acceptance review DID happen and found a real BLOCKER (see `22-ACCEPTANCE-REVIEW.md`, read in full) -- direct evidence the "GREEN battery is a floor, not a verdict" mitigation was actually exercised, not merely asserted. |
| T-22-SELFCERT | Tampering (undetected, self-certified acceptance) | high | mitigate | CLOSED | Same acceptance-review evidence: a real, independently-spawned unprimed reviewer found B-1 (a genuine BLOCKER) which this repo's own workflow routed through a gap-closure loop (plan 22-08) rather than being waved through on a green battery. |
| T-22-PII3 | Information Disclosure | medium | mitigate | CLOSED | Independent sweep, as above. |
| T-22-LINK | Tampering (broken shipped reference) | low | mitigate | CLOSED | Live `check-crossrefs.mjs` run: exit 0. |
| T-22-SPEND3 | Unauthorized resource use | high | mitigate | CLOSED | Same evidence class as T-22-SPEND. |

## Threat Register -- Plan 22-04 (reference-tier classifier repair)

| Threat ID | Category | Severity | Disposition | Status | Evidence |
|-----------|----------|----------|--------------|--------|----------|
| T-22-CONTRA | Tampering (contradicting shipped guidance) | high | mitigate | CLOSED | Live gate run: `laws-classify` surface PASSES `[cls-01] exhaustive`, `no bare catch-all terminal`, and `[cls-03] single-axis`. `git grep -c -F 'the same red-vs-green-refactor split'`-equivalent self-describing sentence confirmed present in `three-laws-and-test-selection.md` (read in full). |
| T-22-IP2 | Legal/IP | high | mitigate | CLOSED | Full diff of `beck-tdd-by-example.md` (e01201a^..HEAD) read: no hunk at/below `## Sources`, no hunk in the red-green-refactor-cycle section. Independently re-grepped `green bar` -> exactly 1 hit, at the Fowler-attributed sentence, unchanged. Full diff of the three-laws leaf: no hunk on the Law 1/2/3 provenance parentheticals, no hunk in `## Sources`. |
| T-22-ORACLE | Tampering (provenance inflation) | medium | mitigate | CLOSED | `git grep -n "no-oracle\|not a restatement"` on the leaf: confirms `(lz-red orchestration, no-oracle)` tag and the explicit "not a restatement of the law's source" sentence both survive. |
| T-22-SELFCERT2 | Tampering (undetected) | high | mitigate | CLOSED | Same acceptance-review evidence as T-22-SELFCERT; the D-26 unprimed review (reviewer C in `22-ACCEPTANCE-REVIEW.md`) independently found F-5/F-6/F-7 in this exact file. |
| T-22-PII4 | Information Disclosure | medium | mitigate | CLOSED | Independent sweep, as above. |
| T-22-LINK2 | Tampering (broken shipped reference) | low | mitigate | CLOSED | Live `check-crossrefs.mjs` exit 0; both citers (`lz-red/SKILL.md` inline-code citation, `lz-refactor/references/principles.md` relative link) confirmed to target the FILE, so the heading rename in this plan breaks neither. |
| T-22-SPEND4 | Unauthorized resource use | high | mitigate | CLOSED | Same evidence class as T-22-SPEND. |

## Threat Register -- Plan 22-05 (placement A/B instrument, content-independent half)

| Threat ID | Category | Severity | Disposition | Status | Evidence |
|-----------|----------|----------|--------------|--------|----------|
| T-22-SPEND5 | Unauthorized resource use | high | mitigate | CLOSED | Same evidence class as T-22-SPEND; every command in this plan is a dry-run or `--selfcheck`. |
| T-22-MEASURE | Tampering (measurement integrity, prompt/description parity) | high | mitigate | CLOSED | Live `selfcheck-routing.mjs`: crux 1 confirms 3 distinct plugin dirs with variant_a = shipped tree; crux 2 confirms all 9 prompts byte-identical across arms with no leading slash. |
| T-22-VOCAB | Tampering (measurement integrity, vocabulary-proxy grader) | high | mitigate | CLOSED | Live `grade-routing.mjs --selfcheck`: 10/10 fixtures pass, including the negation-aware exclusion-clause leg, the longer-name-refusal leg (`lz-redux`/`lz-red-workspace` both refused), and closed-label multi/zero-cardinality routed to judge rather than guessed. |
| T-22-BLIND | Tampering (measurement integrity, judge blinding) | medium | mitigate | CLOSED | Same selfcheck run: both leak kinds (reference-path, section-heading) confirmed stripped AND reported ("both leak kinds fired and are reported"); a no-leak answer confirmed to report NO normalization (pass not vacuous). |
| T-22-RETR | Tampering (measurement integrity, retrieval) | medium | mitigate | CLOSED | `git grep -n "routing_table_read"` on `run-e2e.mjs`: the fact is recorded on the meta object and threaded through to the returned result; `grade-routing.mjs --selfcheck` confirms "each graded run carries the routing_table_read fact". |
| T-22-FROZEN | Tampering (Phase 20/21 frozen evidence) | medium | mitigate | CLOSED | `git diff --stat e01201a^ HEAD` on `selfcheck-red.mjs`, `grade-run.mjs`, `grade-red.mjs`, `merge-judge.mjs`: all empty. `tabulate-mechanical-red.mjs` diff read in full: purely additive `--grade-file` parameter, `DEFAULT_GRADE_FILE = 'red-grade.json'` preserves Phase 21's default; Pass@k/Pass^k formulas and walk directory shape untouched. |
| T-22-PII5 | Information Disclosure | medium | mitigate | CLOSED | Independent sweep, as above; `check-evals.mjs` clause 8 confirmed to reach the new suite. |
| T-22-BYPROD | Information Disclosure | low | mitigate | CLOSED | `git ls-files` under `e2e-rgr-routing/`: no `results`/`run-*`/`outputs` path tracked; `.gitignore` confirmed to carry explicit lines. |

## Threat Register -- Plan 22-06 (stage placement variants, prove offline)

| Threat ID | Category | Severity | Disposition | Status | Evidence |
|-----------|----------|----------|--------------|--------|----------|
| T-22-RMRF | Destruction/DoS (recursive delete) | high | mitigate | CLOSED | Read `build-variants.mjs` in full. `variantDest()` is hardcoded (`path.resolve(path.join(REPO_ROOT, 'out', outName))`), no `process.env` reference anywhere in the file (`git grep -n "process\.env"` = 0 matches). `buildVariant()` asserts `dest` is inside `repoRoot` AND ends in `out/<outName>` BEFORE `fs.rmSync(dest, {recursive:true, force:true})` is ever reached (confirmed by reading the statement order). **Live-executed**: `node variants/build-variants.mjs` exits 0 and prints `source tree ... UNTOUCHED: 195 files hashed before and after, all identical`. |
| T-22-NOOP | Tampering (measurement integrity, silent no-op transform) | high | mitigate | CLOSED | Read `applyTransform()` in full: every one of the four operations (`addFile`, `replaceSection`, `deleteSection`, `replaceRun`) asserts an exact-match count BEFORE mutating and a marker's presence (or, for `deleteSection`, its INVERSE absence) AFTER. Live run confirms `4 declared delta(s) matched exactly` for both generated trees. |
| T-22-DESCDRIFT | Tampering (measurement integrity, frontmatter drift) | high | mitigate | CLOSED | Read the `frontmatterHash()` + D-11 assertion block in full. **Live-executed twice** (builder + `selfcheck-routing.mjs` crux 3, independently): both report `lz-red`/`lz-tpp`/`lz-refactor` frontmatter IDENTICAL across all 3 trees, matching hashes between the two independent computations. |
| T-22-SAMETREE | Tampering (measurement integrity, duplicate arm) | medium | mitigate | CLOSED | Live run: "pairwise DISTINCT: all 3 pairs differ for each of the 3 SKILL.md files (9 comparisons)"; `selfcheck-routing.mjs` crux 1 independently confirms 3 distinct plugin-dir values. |
| T-22-LAZYREAD | Tampering (behavioral regression, variant C relocation) | medium | **accept** | CLOSED (accepted risk, logged below) | Live-inspected generated `out/lz-tdd-variant-c/skills/{lz-red,lz-refactor,lz-tpp}/SKILL.md`: each retains 4 lettered branches (`rg -c -e '^ +[a-d]\. '`) -- inline branch list confirmed NOT relocated. `routing_table_read` instrumentation confirmed present (see T-22-RETR). |
| T-22-SRCMUT | Tampering (shipped tree mutated during build) | high | mitigate | CLOSED | Live run: source-tree hash-before/hash-after equality asserted and printed ("195 files hashed... all identical"); `git status --porcelain plugins/lz-tdd` confirmed empty after the live run this audit performed. |
| T-22-STAGE | Information Disclosure (generated trees) | low | mitigate | CLOSED | `.gitignore` line 7: `out/`. `git check-ignore -q` on a generated path succeeded; `git status --porcelain` after this audit's own live build shows nothing under `out/`. |
| T-22-SPEND6 | Unauthorized resource use | high | mitigate | CLOSED | Same evidence class as T-22-SPEND; only builds/selfchecks/dry-runs found. |

## Threat Register -- Plan 22-07 (close the BUILD and HALT)

| Threat ID | Category | Severity | Disposition | Status | Evidence |
|-----------|----------|----------|--------------|--------|----------|
| T-22-SPEND7 | Unauthorized resource use | high | mitigate | CLOSED | `RUN-GATE.md` read: opens "This file is DOCUMENTATION... Running any command below is out of scope for phase execution"; no plan task executes anything from it (confirmed by reading all `<action>`/`<verify>` blocks in `22-07-PLAN.md`). No `results`/`run-*`/`outputs` tree tracked. |
| T-22-SELFCERT3 | Tampering (undetected, phase acceptance verdict) | high | mitigate | CLOSED | `22-VERIFICATION.md` read in full: `gsd-verifier` independently re-ran every check rather than trusting the gap-closure SUMMARY, explicitly states "not by trusting the gap-closure SUMMARY's claims"; this audit reproduced a sample of its specific numeric claims (folded-description lengths, hygiene counts) independently and they matched. |
| T-22-VAC4 | Tampering (undetected, hygiene/eval-lint claims) | high | mitigate | CLOSED | Live-reproduced: hygiene 199/192 (risen from 197/190), eval-lint 26 files/4 dirs (risen from 14/3) -- both against the plan's recorded pre-phase baseline. |
| T-22-STALE | Tampering (false status, CLS-05 row) | medium | mitigate | CLOSED | `rg -i "reconcile"` on `ROUTING-AB-RESULTS.md`: `## Reconcile on completion -- CLS-05` section present with explicit reconciliation instructions. |
| T-22-LIVE | Tampering (behavioral regression, live-vs-committed) | high | mitigate | CLOSED | `rg -i "reload"` on `RUN-GATE.md`: "The OWNER has run the plugin reload... No trigger measurement is believed before the owner has run it" present as a named precondition. |
| T-22-PREMATURE | Tampering (measurement integrity, premature selection) | medium | mitigate | CLOSED | `rg -c '[0-9]+\.[0-9]{2}' ROUTING-AB-RESULTS.md`: zero matches -- no numeric result was ever written in; every figure is still a blank placeholder. |
| T-22-PII6 | Information Disclosure | medium | mitigate | CLOSED | Independent sweep, as above; covers `RUN-GATE.md` and `ROUTING-AB-RESULTS.md`. |

## Threat Register -- Plan 22-08 (gap-closure: BLOCKER + 6 body fixes + 3 descriptions)

| Threat ID | Category | Severity | Disposition | Status | Evidence |
|-----------|----------|----------|--------------|--------|----------|
| T-22-08-BLIND | Tampering (undetected, prose outside parsed surfaces) | high | mitigate | CLOSED | Independently re-verified, with positive controls, a representative sample of the eight closed gaps: (1) `git grep -n -F "with the tests green"` on `lz-refactor/SKILL.md` -> exactly 1 hit at line 166 (the permitted step-5 mechanical instruction), NOT the intro (direct read of lines 21-30 confirms the two-hop rule now stated there); (2) `git grep -c -F "restructuring passing code"` on `lz-red/SKILL.md` -> 0 matches, `restructuring working code` -> 1 match; (3) F-9: folded lz-tpp description independently parsed and confirmed to contain `lz-refactor`; (4) F-7: `git grep -F "beck-tdd-by-example"` on `plugins/lz-tdd/skills/lz-tpp/` -> 0 matches (positive control on `lz-red/SKILL.md` for the same string -> 1 match, confirming the grep methodology genuinely discriminates). |
| T-22-08-C4 | Tampering (breaking a passing assertion, corpus c4) | high | mitigate | CLOSED | `git grep -c -F "hand off to lz-red"` on `lz-red/SKILL.md` -> 0 matches (self-reference removed); same string on `lz-refactor/SKILL.md` + `lz-tpp/SKILL.md` -> 3 matches each (sibling copies correctly untouched). Live gate run: `[cls-01] exhaustive -- c4 has a named owner -- lz-red then lz-tpp (ordered)` PASSES. |
| T-22-08-DESC | Spoofing (wrong skill loads, test-state gated description) | high | mitigate | CLOSED | **Independently re-implemented the check from the actual exported functions** (not a grep): `foldedDescription()` + `keysOnTestState()` imported and run live against the current `SKILL.md` files -> `lz-red banned=[]`, `lz-refactor banned=[]`, `lz-tpp banned=[]` (matches `22-VERIFICATION.md`'s recorded numbers exactly: len 1422/1391/1000). |
| T-22-08-VACUOUS | Tampering (a guard that cannot fail) | high | mitigate | CLOSED | Same independent re-implementation as above proves the criterion is genuinely discriminating (function-based, not a line-oriented grep that would pass vacuously on the pre-edit, line-wrapped phrase). |
| T-22-08-RUN | Tampering (breaking `C_POINTER` exact-line runs) | high | mitigate | CLOSED | `git diff --stat 774b5ca..bbb7200 -- variants/build-variants.mjs`: empty (file untouched during the gap-closure wave, as the plan's prohibition requires). Live run of `build-variants.mjs` post-gap-closure: `4 declared delta(s) matched exactly` for both trees -- the `C_POINTER` runs still resolve. |
| T-22-08-PARSE | Tampering (ruling sentence becomes a parsed branch) | medium | mitigate | CLOSED | `git grep -n "context for the ask"` across all four classify lead-ins (`lz-red/SKILL.md`, `lz-refactor/SKILL.md`, `lz-tpp/SKILL.md`, `three-laws-and-test-selection.md`): present in all four, identical wording. Live gate run: `[cls-02] at-most-one` and `[cls-03] single-axis` both PASS over all 9 cases / 11 surfaces post-insertion -- the ruling sentences did not get parsed as routing branches. |
| T-22-08-IP | Legal/IP (beck book-backed claims) | high | mitigate | CLOSED | Full diff of `beck-tdd-by-example.md` across the whole phase read: no hunk in `## Sources` or the red-green-refactor-cycle section; `green bar` re-confirmed at exactly 1 occurrence, unchanged, at the Fowler-attributed sentence. |
| T-22-08-SPEND | Unauthorized resource use | high | mitigate | CLOSED | Same evidence class as T-22-SPEND; no `claude -p` in this plan's diff. |
| T-22-08-SELFCERT | Tampering (self-certification) | high | mitigate | CLOSED | `22-VERIFICATION.md`'s re-verification pass (`gsd-verifier`, second run) independently re-ran every deterministic instrument rather than reading the plan's own SUMMARY -- confirmed by this audit reproducing several of its specific claims from scratch and getting the same numbers. |
| T-22-08-INSTR | Tampering (moving the goalposts) | high | mitigate | CLOSED | `git diff e01201a^ HEAD -- check-hygiene.mjs \| rg QUOTE_THRESHOLD`: empty (threshold unchanged). `check-red-references.mjs` roster label confirmed still 125 checks via live `npm run check`. No checker's assertion was loosened anywhere in the diffs read. |
| T-22-08-PII | Information Disclosure | medium | mitigate | CLOSED | Independent sweep, as above; covers all 5 files this plan touched. |
| T-22-08-LINK | Tampering (broken shipped reference) | low | mitigate | CLOSED | Live `check-crossrefs.mjs` exit 0 post-gap-closure. |

---

## Accepted Risks Log

Two threats in the register carry an explicit `accept` disposition (not `mitigate`). Both were verified
to be properly bounded rather than merely asserted:

### T-22-DEP -- Tampering (supply chain), low severity, plan 22-01

**Accepted rationale (as declared in the plan):** `check-rgr-routing.mjs` is wired into `npm run check`
via a `scripts.check` edit only; no new dependency is introduced, so no package-legitimacy audit is
triggered.

**Verification performed:** `git diff e01201a^ HEAD -- .claude/skills/lz-red-workspace/package.json`
shows exactly one changed line (the `scripts.check` chain, appending two new checker invocations); the
`devDependencies` block is byte-unchanged across the whole phase. The accepted risk is genuinely
scoped -- there is nothing further to mitigate because nothing was added to accept risk on.

**Accepted by:** phase plan author (2026-08-03, `22-01-PLAN.md` threat_model), residual risk: none
material (no new supply-chain surface exists).

### T-22-LAZYREAD -- Tampering (behavioral regression), medium severity, plan 22-06

**Accepted rationale (as declared in the plan, D-10):** Variant C (the pre-registered null tiebreak)
moves the classify-first rationale behind a reference-file read that this repo has MEASURED at a
zero-of-six retrieval rate. This is a disclosed, deliberate risk that is only partially engineered
away -- it is not eliminated, because eliminating it would mean not building variant C at all.

**Verification performed:** (1) Variant C's generated `SKILL.md` files were live-inspected under
`out/lz-tdd-variant-c/` and confirmed to retain their 4 lettered step-1 branches -- the load-bearing
routing rule stays inline even though the rationale/edge-case table is relocated, so the ceiling is
"only the rationale/edge cases may go unread," not "the routing rule may go unread." (2) Retrieval is
genuinely instrumented, not merely claimed: `run-e2e.mjs` records `routing_table_read` /
`routing_table_read_path` on every captured run's meta object, and `grade-routing.mjs --selfcheck`
confirms this fact is threaded into every graded run so a variant's pass rate can be read alongside its
read rate. (3) The residual risk is explicitly recorded in `ROUTING-AB-RESULTS.md`'s caveats section
(read: "a tie on that metric does not prove parity on coaching-quality dimensions") rather than hidden.

**Accepted by:** project owner (2026-08-03, `22-CONTEXT.md` D-10), residual risk: real and
un-eliminated by design, but bounded (inline branch list preserved, retrieval measured, caveat
pre-written) and gated behind a metered A/B that has not run and cannot ship variant C without fresh
explicit approval (T-22-SPEND6/T-22-PREMATURE close that gate independently).

---

## Unregistered Attack Surface (Threat Flags)

Checked every `## Threat Flags` section across all eight `*-SUMMARY.md` files. Seven plans (22-01
through 22-07) carry an explicit section, and all seven state **"None"** -- each cross-references its
own STRIDE register and asserts no new network endpoint, auth path, file-access pattern, or trust
boundary appeared beyond what was already modeled. `22-08-SUMMARY.md` (the gap-closure plan) has **no**
`## Threat Flags` section at all.

This audit does not accept "the section says None" at face value (see adversarial-stance failure mode:
"Assuming SUMMARY.md `## Threat Flags` is a complete list"). Independently cross-checked instead:

- Read every file `git diff --name-only e01201a^ HEAD` reports as touched or added across the whole
  phase (67 files). None introduces a network endpoint, an auth surface, a new external dependency
  (confirmed: zero `package.json` dependency changes anywhere in the phase), or a schema at a trust
  boundary that isn't already one of the 60 threats above.
- 22-08's missing section was cross-checked against its "Deviations from Plan" and "Issues Encountered"
  sections (read in full): the two recorded deviations are (a) a gitignored `node_modules` restore in a
  worktree that touched no tracked file, and (b) a cosmetic re-wrap of an already-covered description
  block, re-verified against the frontmatter-hash assertion afterward. Neither is unmapped attack
  surface; both are already covered by T-22-08-DESC / T-22-08-VACUOUS / T-22-08-INSTR above.

**Result: 0 unregistered flags.** The 60-threat register built from the eight plans' own `<threat_model>`
blocks is the complete set; nothing surfaced during implementation that required a new threat ID.

---

## Summary

| Metric | Value |
|--------|-------|
| Threats declared across 8 plans | 60 |
| Threats independently re-verified against merged code | 60 / 60 |
| CLOSED (mitigation present, verified) | 58 |
| CLOSED as properly-bounded accepted risk | 2 (T-22-DEP, T-22-LAZYREAD) |
| OPEN -- blocking (severity >= high) | **0** |
| OPEN -- non-blocking (severity < high) | 0 |
| Unregistered attack surface found | 0 |
| Metered commands executed by this audit | 0 |

No mitigation was found absent. No checker, threshold, or roster count was found weakened anywhere in
the phase's commit history. The two highest-risk items in the whole phase -- a script whose first act on
its destination is a recursive delete (T-22-RMRF), and the frontmatter-identity precondition that the
entire placement A/B depends on (T-22-DESCDRIFT) -- were each verified by full source read AND live
execution, not by trusting a printed summary line.

**threats_open: 0.** This phase is SECURED at ASVS level 1 / block-on-high. No gap-closure action is
required from this audit.
