---
phase: 8
slug: kerievsky-catalog-refactoring-to-patterns
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-07-05
---

# Phase 8 — Validation Strategy

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

> Populated during `/gsd-plan-phase` / `/gsd-validate-phase` once PLAN.md tasks exist.
> Each authoring task maps to: the deterministic checker(s) that gate it + the
> `oracle-reviewer` verdict for the leaves it touches.

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 08-XX-XX | XX | X | KRV-01..04 | T-08-xx / — | no verbatim book prose/code (DST-04) | checker + tsc + oracle-reviewer | `node .claude/skills/lz-refactor-workspace/tools/check-kerievsky.mjs` | ❌ W0 | ⬜ pending |

*Status: pending / green / red / flaky. Filled post-planning.*

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

- [ ] `check-kerievsky.mjs` — new checker asserting the 27 Kerievsky leaves + fields (recommended over editing the Fowler-verified `check-catalog.mjs`).
- [ ] `extract-samples.mjs` — extend sample discovery to include `kerievsky-catalog/` fenced examples (avoid flat-filename slug collision with Fowler samples — namespace the extracted `.ts` files).
- [ ] `check-crossrefs.mjs` — include `kerievsky-catalog/` in cross-ref resolution.
- [ ] `check-smells.mjs` — widen the candidate-link regex beyond `fowler-catalog/` so Kerievsky pattern-directed candidates resolve.

*RED against the empty kerievsky-catalog is the expected Wave-0 baseline; KRV-01..04 close only when the authoring waves turn the battery GREEN.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Owner escalation for a non-convergent / ambiguous leaf | KRV-01/04 | The clean-room loop escalates `ambiguities`/non-convergence to the owner via AskUserQuestion (human-gated) | driver asks the owner a targeted question; not automatable |

*Everything else has automated (checker/tsc) or oracle-reviewer verification.*

---

## Validation Sign-Off

- [ ] All authoring tasks gate on a checker command + oracle-reviewer verdict
- [ ] Sampling continuity: deterministic layer runs before every oracle-reviewer batch
- [ ] Wave 0 extends the harness for Kerievsky (4 items above) and is GREEN-when-filled
- [ ] No watch-mode flags
- [ ] Feedback latency < 90s (deterministic layer)
- [ ] `nyquist_compliant: true` set post-execution by `/gsd-validate-phase`

**Approval:** pending
