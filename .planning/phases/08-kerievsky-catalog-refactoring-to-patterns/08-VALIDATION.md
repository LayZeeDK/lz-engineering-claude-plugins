---
phase: 8
slug: kerievsky-catalog-refactoring-to-patterns
status: validated
nyquist_compliant: true
wave_0_complete: true
created: 2026-07-05
validated: 2026-07-06
---

# Phase 8 -- Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> This is a Markdown reference-authoring phase: the "test suite" IS the non-shipped
> deterministic checker battery under `.claude/skills/lz-refactor-workspace/` plus the
> `tsc --strict` compile of every fenced example. There is no runtime behavior to
> unit-test (mirrors Phase 7's validate-phase finding: 0 runtime tests generated;
> the checker battery is the verifier-confirmed automated verification). Semantic
> fidelity + behavior-preservation of examples are gated by the `oracle-reviewer`.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Node built-in checker battery (`.claude/skills/lz-refactor-workspace/tools/*.mjs`) + pinned `typescript` `tsc --strict` extractor (`extract-samples.mjs`) |
| **Config file** | `.claude/skills/lz-refactor-workspace/tsconfig.json` + `package.json` (pinned tsc) |
| **Quick run command** | `node .claude/skills/lz-refactor-workspace/tools/check-kerievsky.mjs` (new) + the touched `check-smells.mjs` / `check-crossrefs.mjs` |
| **Full suite command** | run all `tools/*.mjs` checkers + `node extract-samples.mjs` (all fenced examples `tsc --strict`) + `claude plugin validate .` |
| **Estimated runtime** | ~30-90 seconds (tsc extract dominates) |

---

## Sampling Rate

- **After every authored sub-batch (~6-8 leaves):** run the deterministic layer (tsc extract + contract + hygiene + cross-ref) BEFORE spending an `oracle-reviewer` call (Phase-7 pattern).
- **After every plan wave:** run the full checker battery + `claude plugin validate .`.
- **Before phase verification:** full battery GREEN (all 27 leaves, smell fold, cross-refs, tsc, hygiene) AND all leaves oracle-converged (`pass`, or owner-accepted).
- **Max feedback latency:** ~90 seconds (deterministic layer is cheap; the oracle-reviewer round is the costly step, sub-batched + capped at ~3 rounds).

---

## Per-Task Verification Map

> Filled post-execution by `/gsd-validate-phase`. Each authoring task maps to the
> deterministic checker(s) that gate it + the `oracle-reviewer` verdict for the leaves
> it touches. Every row is GREEN: the full battery was re-run read-only from repo root
> on 2026-07-06 (all seven checkers + `extract-samples` exit 0).

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 08-01 | 01 | 1 (W0) | KRV-01..04 | T-08-06 | cross-links resolve; no false-green sample overwrite | checker harness | `node .claude/skills/lz-refactor-workspace/tools/check-kerievsky.mjs` (new) + `check-smells` / `check-crossrefs` / `extract-samples` (extended) | yes | green |
| 08-02 | 02 | 2 | KRV-01, KRV-02, KRV-04 | T-08-01 | no verbatim book prose/code (DST-04) | checker + tsc + oracle-reviewer | `node .claude/skills/lz-refactor-workspace/tools/check-kerievsky.mjs && node .claude/skills/lz-refactor-workspace/extract-samples.mjs` | yes | green |
| 08-03 | 03 | 2 | KRV-01, KRV-02, KRV-04 | T-08-01 | no verbatim book prose/code (DST-04) | checker + tsc + oracle-reviewer | `node .claude/skills/lz-refactor-workspace/tools/check-kerievsky.mjs && node .claude/skills/lz-refactor-workspace/extract-samples.mjs` | yes | green |
| 08-04 | 04 | 2 | KRV-01, KRV-02, KRV-04 | T-08-01 | no verbatim book prose/code (DST-04) | checker + tsc + oracle-reviewer | `node .claude/skills/lz-refactor-workspace/tools/check-kerievsky.mjs && node .claude/skills/lz-refactor-workspace/extract-samples.mjs` | yes | green |
| 08-05 | 05 | 2 | KRV-01, KRV-02, KRV-04 | T-08-01 | no verbatim book prose/code (DST-04) | checker + tsc + oracle-reviewer | `node .claude/skills/lz-refactor-workspace/tools/check-kerievsky.mjs && node .claude/skills/lz-refactor-workspace/extract-samples.mjs` | yes | green |
| 08-06 | 06 | 3 | KRV-01, KRV-03 | T-08-01 / T-08-06 | no verbatim; folded-smell links resolve; index rows mirror | checker + oracle-reviewer | `node .claude/skills/lz-refactor-workspace/tools/check-smells.mjs && node .claude/skills/lz-refactor-workspace/tools/check-kerievsky.mjs && node .claude/skills/lz-refactor-workspace/tools/check-crossrefs.mjs && node .claude/skills/lz-refactor-workspace/tools/check-catalog.mjs && node .claude/skills/lz-refactor-workspace/tools/check-principles.mjs && node .claude/skills/lz-refactor-workspace/tools/check-hygiene.mjs` | yes | green |

*Status legend: pending / green / red / flaky.*

### Coverage adequacy (Nyquist)

Every Phase-8 requirement observable has a covering deterministic check whose sampling rate catches a regression per requirement:

- **KRV-01** (27 leaves + thin index + Use-when mirror + composed Fowler primitives + compiling examples): `check-kerievsky` (27/27 name-identity, not cardinality; LOCKED contract fields; composed-primitive cross-link presence; README-row Use-when mirror) + `extract-samples` (185 modules `tsc --strict`) + `check-crossrefs` (449 links resolve). GREEN.
- **KRV-02** (Direction model + 3 Away cases): `check-kerievsky` Direction allow-list (`To|Towards|Away|n/a`) on every leaf + the AWAY set enforced to carry `Direction: Away` plus an "away from &lt;pattern&gt;" callout. GREEN.
- **KRV-03** (Ch.4 smell fold, source-tagged + deduped): `check-smells` validates source tags (`Fowler|Kerievsky|both`), fails an un-deduped Kerievsky-tagged Fowler name, resolves `(?:fowler|kerievsky)-catalog` candidate links, and contract-checks the 4 Kerievsky-unique leaves. GREEN.
- **KRV-04** (GoF vocabulary-only, no verbatim): `check-kerievsky` GoF-field presence + `check-hygiene` ASCII/email hard-fail + no-verbatim WARN (0 WARN). GREEN.

**No new test generated** -- coverage was already complete over the seven-checker battery + tsc extractor. Adding an assertion would be redundant against an already-green instrument.

**Known limitation (documented, not a gap):** `check-kerievsky` validates Direction *membership*, not the exact 14/6/3/4 census. This is not a REQUIREMENTS-level observable (the Phase-9 coach keys only on `Away`; `To` and `Towards` route identically), the 3 named `Away` cases are hard-checked, and census fidelity is reconciled to the authoritative Refactoring Directions table + oracle-gated. A census-exact checker was deliberately NOT added (redundant per the coach's routing). This matches the 08-VERIFICATION observation.

---

## Requirement -> Verification Map (Nyquist)

| Requirement | Automated verification (deterministic) | Semantic verification (oracle-reviewer) |
|-------------|----------------------------------------|-----------------------------------------|
| **KRV-01** (27 leaves: name, intent, mechanics, TS/JS example, composed Fowler primitive(s)) | `check-kerievsky`: 27 leaves present by canonical name; each has the required sections + a resolving `../fowler-catalog/<slug>.md#<slug>` composed-primitive link; `extract-samples.mjs` compiles every example `tsc --strict` | motivation/mechanics fidelity + example behavior-preservation + representativeness + near-verbatim (DST-04) |
| **KRV-02** (To/Towards/Away; 3 named Away/de-patterning cases) | `check-kerievsky`: every leaf has a Direction value; the 3 Away cases (Inline Singleton, Move Accumulation to Visitor, Encapsulate Composite with Builder) present + flagged | direction correctness + de-patterning framing |
| **KRV-03** (Ch.4 smells folded into unified taxonomy; source-tagged; deduped vs Fowler) | `check-smells` (extended): new smell leaves present; source tags valid (Fowler/Kerievsky/both); no un-deduped duplicate; candidate links resolve (regex widened beyond `fowler-catalog/`) | dedup correctness vs the source Ch.4 list; candidate map aptness |
| **KRV-04** (GoF pattern cross-ref, vocabulary only, no GoF text) | `check-kerievsky`: each leaf carries a GoF pattern name (or `n/a -- utility`); `check-hygiene`: ASCII-only, no work-email, no verbatim GoF/Kerievsky prose or code | GoF target-name correctness (from the Kerievsky book); no reproduced GoF text |

---

## Wave 0 Requirements

- [x] `check-kerievsky.mjs` -- new checker asserting the 27 Kerievsky leaves + fields (landed in 08-01; GREEN 27/27).
- [x] `extract-samples.mjs` -- extended to include `kerievsky-catalog/` fenced examples with per-catalog namespacing (landed in 08-01; GREEN, 185 modules `tsc --strict`, 0 skipped).
- [x] `check-crossrefs.mjs` -- includes `kerievsky-catalog/` in cross-ref resolution, mutuality Fowler-scoped (landed in 08-01; GREEN, 449 links).
- [x] `check-smells.mjs` -- candidate-link regex widened to `(?:fowler|kerievsky)-catalog` + source-tag + dedup guards (landed in 08-01; GREEN).

*All four Wave-0 harness extensions landed in 08-01 and are GREEN post-execution; KRV-01..04 closed as the authoring waves (08-02..08-06) turned the battery GREEN.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Owner escalation for a non-convergent / ambiguous leaf | KRV-01/04 | The clean-room loop escalates `ambiguities`/non-convergence to the owner via AskUserQuestion (human-gated) | driver asks the owner a targeted question; not automatable |

*Everything else has automated (checker/tsc) or oracle-reviewer verification.*

---

## Validation Sign-Off

- [x] All authoring tasks gate on a checker command + oracle-reviewer verdict
- [x] Sampling continuity: deterministic layer runs before every oracle-reviewer batch
- [x] Wave 0 extends the harness for Kerievsky (4 items above) and is GREEN
- [x] No watch-mode flags
- [x] Feedback latency < 90s (deterministic layer; tsc extract dominates)
- [x] `nyquist_compliant: true` set post-execution by `/gsd-validate-phase`

**Approval:** validated 2026-07-06 -- full battery re-run read-only from repo root, all GREEN
(check-kerievsky 27/27, check-catalog 62/62, check-smells 24 Fowler + 4 Kerievsky-unique,
check-crossrefs 449 links, check-principles 8/8, check-hygiene 126 files clean, extract-samples
185 modules `tsc --strict`). Every KRV-01..04 observable has a covering GREEN deterministic check;
no uncovered observable found, so no new test was generated.
