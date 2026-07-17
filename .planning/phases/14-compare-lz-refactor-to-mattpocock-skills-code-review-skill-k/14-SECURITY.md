---
phase: 14-compare-lz-refactor-to-mattpocock-skills-code-review-skill-k
audit: security
threats_total: 9
threats_closed: 9
threats_open: 0
register_authored_at_plan_time: true
disposition: SECURED
completed: 2026-07-15
---

# Phase 14 Security Audit -- lz-refactor vs mattpocock code-review head-to-head

Verification-only audit. The threat register was authored at plan time (parseable
`<threat_model>` blocks in all five 14-0N-PLAN.md), so each threat is verified by its declared
disposition -- mitigations confirmed present in code/artifacts, accepted risks confirmed sound.
No retroactive-STRIDE, no new-vulnerability scan. Implementation files were not modified.

Phase 14 ships nothing to the public plugin tree: all artifacts are eval scaffolding under the
`lz-refactor-workspace` (source files tracked; raw `outputs/` transcripts gitignored) plus the
planning docs.

## Verdict: SECURED

All 7 `mitigate` threats CLOSED; both `accept` threats have a sound rationale (logged below).
Zero open threats. One non-blocking hygiene observation recorded (captured model transcripts carry
benign typographic non-ASCII; see Observations).

## Threat Verification

| Threat ID | Category | Disposition | Status | Evidence |
|-----------|----------|-------------|--------|----------|
| T-14-01 | Tampering | mitigate | CLOSED | `buildSyntheticBase` builds from `applyBase` not HEAD (run-e2e.mjs:421 `rev-parse ${applyBase}:${rootRelPath}`); throwaway `review-<target>` branch + worktree (run-e2e.mjs:401,434,437); Edit/Write blocked on ALL arms (run-e2e.mjs:237 code_review, :240 recommend); PROTECTED_BRANCHES refusal (run-e2e.mjs:403-405, apply-mode :500-505; suite.json `protectedBranches`) |
| T-14-02 | Tampering | mitigate | CLOSED | Finally-style teardown `worktree remove --force` + `prune` + `branch -D` (run-e2e.mjs:443-447) invoked in a `finally` (run-e2e.mjs:835-837); selfcheck asserts `git status --porcelain` empty + no `review-*` branch + no leftover worktree (selfcheck-code-review.mjs:200-216) |
| T-14-03 | Information Disclosure | mitigate | CLOSED | Allowlist-inversion scan over 70 tracked phase-14 files: 0 non-approved email-shaped tokens (only-approved-or-none holds); fixtures synthetic-only (meta.sample.json `SAMPLE`/`/synthetic/...`, answer.sample.md "fixture -- not a real run"); ASCII-only on all authored artifacts (run-e2e.mjs, selfcheck, tabulate-mechanical.mjs, cr-* prompts, suite.json, grading JSON, 14-RESULTS.md) verified clean. See Observations for the captured-transcript non-ASCII note. |
| T-14-04 | Information Disclosure | mitigate | CLOSED | DST-04 firewall: fidelity.json `_meta.description` documents "main context never read book prose; all justifications are the oracle's own words"; per-claim `why` fields are the oracle's paraphrased assessments (chapter/catalog refs), not verbatim book prose; 14-RESULTS.md grading-channel note (14-RESULTS.md:25-28) |
| T-14-05 | Process (unapproved spend) | mitigate | CLOSED | D-12 HARD blocking gate: 14-04-PLAN.md Task 1 `<task type="checkpoint:decision" gate="blocking">` build-then-halt; 14-04-SUMMARY records explicit user approval ("approve-3cell (18 runs)") with both Wave-0 self-checks green first; run-e2e.mjs has no self-approval path (`--dry-run` spends nothing; `code_review` requires `--synthetic-base`, parseArgs:144-146) |
| T-14-06 | Tampering (measurement validity) | mitigate | CLOSED | cr-* prompts byte-identical except path, read-only ("Do not edit anything"), name no expected smell/refactoring/pattern (cr-enforce-module-boundaries.md, cr-runtime-lint-utils.md, cr-gilded-rose.md); subagent review incl. >= 1 unbiased from-scratch recorded PASS before any run (14-02-SUMMARY "Subagent Review Outcome") |
| T-14-07 | Tampering (measurement validity) | mitigate | CLOSED | tabulate-mechanical.mjs `--selfcheck` asserts token totals, spawn count, lift count, Pass@k against known-value fixtures (tabulate-mechanical.mjs:408-475); fail-closed on garbled/keyless meta.json (`collectRuns` :321-332 -> `fail()` exit 1) |
| T-14-09 | Tampering (measurement validity) | mitigate | CLOSED | 14-RESULTS.md verdict framed as an empirical finding, "not a pre-assumed win" (14-RESULTS.md:147); both mandatory caveats present -- D-02 whole-file-diff (:130) and D-03 Spec-axis skip (:134); ~139-vs-12 breadth reported as headline not normalized; unbiased from-scratch reviewer confirmed PASS (14-05-SUMMARY step 4) |
| T-14-08 | Information Disclosure | accept | CLOSED (rationale sound) | See Accepted Risks Log |
| T-14-SC | Tampering (supply chain) | accept | CLOSED (rationale sound) | See Accepted Risks Log |

## Accepted Risks Log

### T-14-08 -- loading the third-party mattpocock plugin into the code_review arm
Rationale SOUND. The code_review arm blocks Edit/Write/MultiEdit/NotebookEdit (run-e2e.mjs:237),
so the third-party plugin cannot mutate anything. The plugin is loaded via `--plugin-dir` pointed
at the already-cached install (`MATTPOCOCK_DIR`, run-e2e.mjs:43-45), so no new download/install
occurs. The only residual cost is context inflation from the plugin's ~22 skill descriptions,
which is inherent to an equal-footing head-to-head and is explicitly disclosed as caveat A4
(14-RESULTS.md:141). Risk accepted; disclosure present.

### T-14-SC -- npm/pip/cargo installs (supply chain)
Rationale SOUND. This phase installs NO packages. The three authored scripts import only Node
stdlib (`node:` builtins) plus one local relative import (`./run-e2e.mjs` from the selfcheck); no
`package.json` under the workspace adds a dependency (verified: `tech-stack.added: []` in every
plan SUMMARY, and no external import in run-e2e.mjs / selfcheck-code-review.mjs /
tabulate-mechanical.mjs). Runs use the already-cached mattpocock plugin + the already-installed
`claude` CLI + system `git`. The "N/A -- no installs" acceptance holds.

## Unregistered Flags

None. No `## Threat Flags` section appears in any of 14-01..14-05 SUMMARY (checked all five); no
new attack surface was declared during implementation, so there is nothing to map or log.

## Observations (non-blocking)

- **Captured model transcripts carry benign non-ASCII.** 14 committed `answer.md` files under
  `results/recommend/*/cr-*/` contain typographic non-ASCII emitted verbatim by the model: EM DASH
  (U+2014, x175), EN DASH (U+2013, x17), HORIZONTAL ELLIPSIS (U+2026, x11), RIGHTWARDS ARROW
  (U+2192, x10), LESS-THAN OR EQUAL (U+2264, x2), and one U+2248. These are evidence transcripts of
  what each arm actually said; ASCII-folding them would falsify the record. They contain no PII, no
  secrets, and no book prose, so this does NOT open the T-14-03 information-disclosure vector (that
  vector -- maintainer work-email PII -- is fully closed: 0 non-approved email tokens). The phase's
  own hygiene scan (14-05 Task 3) was correctly scoped to the authored 14-RESULTS.md + grading JSON,
  which are ASCII-clean. Recorded for the maintainer's awareness only; not a ship blocker. If
  strict ASCII across committed transcripts is desired later, add a `.gitattributes`/scan note
  rather than mutating the captured outputs.

## Method Notes

- Workspace is partially gitignored; source + cr-* cell results are tracked, raw `outputs/`
  transcripts are not. Read the implementation files directly and confirmed tracking via
  `git ls-files`.
- Hygiene scan used allowlist-inversion (encode only the approved public gmail; flag every other
  email-shaped token) -- the forbidden work email/domain was never written as a search needle.
- Process-gate threats (T-14-05, T-14-06, T-14-09) verified against the blocking-gate task
  definitions in the PLANs plus the execution record in the SUMMARYs, since these mitigations are
  procedural (human approval, pre-run subagent review, post-hoc unbiased confirmation) rather than
  code paths.
