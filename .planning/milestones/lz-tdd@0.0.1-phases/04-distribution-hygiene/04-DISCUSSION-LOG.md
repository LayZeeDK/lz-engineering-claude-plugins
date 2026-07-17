# Phase 4: Distribution & Hygiene - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md -- this log preserves the alternatives considered.

**Date:** 2026-07-02
**Phase:** 4-Distribution & Hygiene
**Mode:** `--auto --analyze --chain` (autonomous single-pass; recommended option auto-selected per area; trade-off tables retained for the audit trail)
**Areas discussed:** README structure, README TPP-content depth, LICENSE copyright, DIST-03 review triage, Contact & work-email guard

**Trap-quadrant check (`--auto`):** each area was rated on IMPACT and CONFIDENCE.
None landed in the HIGH-IMPACT + NOT-HIGH-CONFIDENCE quadrant -- all are either
low-impact/reversible (docs, license text) or high-confidence/evidence-backed
(standard practice + prior-phase deferral decisions). Auto-locking was therefore
appropriate; no user escalation was required.

---

## README structure & home (-> D-01)

| Option | Description | Selected |
|--------|-------------|----------|
| Single root `README.md` | One shippable doc; GitHub landing + install-command target | [x] |
| Root + per-plugin `plugins/lz-tdd/README.md` | Scales for a 2nd plugin later | |

**Auto choice:** Single root README (recommended default). Per-plugin README optional, and only as a short pointer if added.
**Notes:** Ties to `01-CONTEXT.md` `<specifics>` (install string already documented) and PROJECT.md layout note ("README optional, per-plugin"). Single-plugin marketplace does not justify duplication today.

---

## README TPP-content depth (-> D-02)

| Option | Description | Selected |
|--------|-------------|----------|
| Brief summary + links | Link the 3 authoritative sources + point to `references/transformations.md` | [x] |
| Inline full TPP primer | Self-contained but duplicates the locked reference | |

**Auto choice:** Brief summary + links (recommended default).
**Notes:** Avoids drift against the LOCKED `transformations.md`; respects progressive disclosure (README mirrors how SKILL.md points at references).

---

## LICENSE copyright (-> D-03)

| Option | Description | Selected |
|--------|-------------|----------|
| MIT, `Copyright (c) 2026 Lars Gyrup Brink Nielsen` | Verbatim OSI MIT; holder matches `plugin.json` author; year 2026 | [x] |
| Defer / alternate holder | No evidence for any other holder or year | |

**Auto choice:** Standard OSI MIT with the maintainer as holder, year 2026 (recommended default).
**Notes:** This is the LICENSE FILE deferred from Phase 1 (D-12). High confidence -- holder and year are known.

---

## DIST-03 review scope + findings triage (-> D-05, D-06)

| Option | Description | Selected |
|--------|-------------|----------|
| Fix structural/hygiene now, defer triggering-effectiveness to Phase 5 | Respects Phase-3 D-10 + EVAL-01/02 deferral | [x] |
| Act on every reviewer suggestion in Phase 4 | Maximally clean but pulls Phase-5 empirical tuning forward | |

**Auto choice:** Triage: fix structural/manifest/security/ASCII/factual/authoring-defect findings; defer description/triggering/coaching-accuracy findings to Phase 5 (recommended default). Gates = `claude plugin validate .` (hard) + `plugin-validator` + `skill-reviewer`.
**Notes:** Load-bearing decision. Evidence-backed by `03-CONTEXT.md` D-10 and ROADMAP Phase 5. "Significant findings" that block ship = errors + security + broken install/invocation + ASCII violations.

---

## Contact & work-email guard (-> D-04)

| Option | Description | Selected |
|--------|-------------|----------|
| Public gmail everywhere; hard allowlist pre-commit check | `larsbrinknielsen@gmail.com` only; work email verified absent | [x] |
| Best-effort scan | Weaker guarantee | |

**Auto choice:** Public contact only, with a hard allowlist grep before the completion commit (recommended default).
**Notes:** The work email must appear nowhere in the repo and its literal must never be spelled in any committed file; re-verify with the allowlist guard before commit (exact needle in 04-RESEARCH.md). See memory: public-repo-work-email-allowlist.

---

## Claude's Discretion

- Exact README section ordering, tagline wording, and whether to include a short copy-paste usage snippet.
- Whether to add an optional one-line `plugins/lz-tdd/README.md` pointer.
- README badges/keywords (optional; ASCII, minimal).
- Exact MIT text whitespace/formatting (standard OSI template verbatim).
- Order the three review gates run in.

## Deferred Ideas

- Empty `AGENTS.md` (0 bytes, imported by `CLAUDE.md` via `@AGENTS.md`) -- hygiene defect discovered during scout; NOT in DIST scope, flagged for the user as a separate trivial fix.
- Skill-creator trigger + behavior evals and empirical `description` tuning -> Phase 5 (EVAL-01/02).
- npm packaging / additional plugins / additional skills / non-TS examples -> post-0.0.1 (NEXT-01..04).
