# Phase 3: lz-tpp Skill Authoring - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md -- this log preserves the alternatives considered.

**Date:** 2026-07-02
**Phase:** 3-lz-tpp Skill Authoring
**Mode:** --auto --analyze --chain (autonomous single-pass; recommended option selected per area)
**Areas discussed:** Reference-file organization, SKILL.md body boundary, Dual-mode + coach scope, TypeScript examples & TCO guidance, Triggering-description posture

---

## Reference-file organization & progressive disclosure

| Option | Description | Selected |
|--------|-------------|----------|
| Keep transformations.md; add focused worked-example + typescript reference files | Split by concern; heavy content in references/, loaded on demand | X |
| Append everything to transformations.md | One growing reference file | |
| Inline examples/TCO into SKILL.md body | No extra reference files | |

**Selected option:** Keep transformations.md unchanged; add focused reference files (recommended default).
**Notes:** FEATURES progressive-disclosure guidance + TPP-TYPESCRIPT.md footer ("feeds references/typescript.md and the paired worked examples"). transformations.md is the LOCKED Phase-2 source-of-truth; not modified. HIGH confidence. -> D-01, D-02.

---

## SKILL.md body content boundary

| Option | Description | Selected |
|--------|-------------|----------|
| Lean body: description + RGR framing + coach procedure + impasse heuristic + pointers | Heavy material (full list, examples, TCO) in references/ | X |
| Full list + examples inline in body | Everything in SKILL.md | |

**Selected option:** Lean body with pointers (recommended default).
**Notes:** SKILL-06 (<~500 lines / ~1.5-2k words) + FEATURES anti-feature "bloated SKILL.md". HIGH confidence. -> D-02.

---

## Dual-mode invocation + coach scope

| Option | Description | Selected |
|--------|-------------|----------|
| One skill, default frontmatter; coach recommends+names+shows diff, never edits/runs | Auto-trigger coach + explicit reference; coach, don't drive | X |
| Disable auto-invocation / reference-only | Would kill the coach use case | |
| Coach edits code / reads test-runner output | Drives TDD for the user | |

**Selected option:** One skill, default frontmatter, coach-don't-drive (recommended default).
**Notes:** SKILL-02 (auto-trigger coach + explicit reference; omit disable-model-invocation/user-invocable) + PROJECT out-of-scope (no auto-edit/auto-run) + FEATURES anti-feature. HIGH confidence. -> D-03, D-04, D-05.

---

## TypeScript examples & TCO guidance (TPP-05/06/07)

| Option | Description | Selected |
|--------|-------------|----------|
| Fibonacci worked walk (TPP-06) + Kata 1 sum + Kata 2 flatten; teach iterative+trampoline, teach generator/fold, mention CPS-needs-trampoline | Full coverage of TPP-05/06/07 per TPP-TYPESCRIPT.md design | X |
| Fibonacci only | Minimal; misses paradigm divergence + generator/tree case | |
| Katas only, no Fibonacci walk | Loses the canonical monotonic-priority walk TPP-06 asks for | |

**Selected option:** Fibonacci walk + both katas + teach-vs-mention pattern split (recommended default).
**Notes:** TPP-TYPESCRIPT.md designed Kata 1 (linear divergence) + Kata 2 (tree/generator) to pair with the Fibonacci walk; patterns are runnable + --strict-verified on Node v24. CPS-needs-trampoline and the compat-table "Node 2/2" false positive are called out as landmines. HIGH confidence. -> D-06, D-07, D-08, D-09.

---

## Triggering-description posture (SKILL-05)

| Option | Description | Selected |
|--------|-------------|----------|
| Scoped triggers (RGR/TDD/TPP/next-transformation; not generic coding), <=1024 chars, draft now, tune in Phase 5 | Third-person, should-not-trigger boundary; empirical tuning deferred | X |
| Broad triggers (any TDD/coding) | Over-triggers; erodes trust (FEATURES anti-feature) | |
| Defer the whole description to Phase 5 | Leaves the skill non-triggering | |

**Selected option:** Scoped posture, drafted now, empirically tuned in Phase 5 (recommended default).
**Notes:** SKILL-05 + FEATURES anti-feature "over-broad description" + EVAL-01 (Phase 5). Triggering gates everything; the DECISION (scoped posture) is high-confidence, the exact wording is discretion + Phase-5 tuning -- not a discuss-time trap-quadrant item. -> D-10.

---

## Claude's Discretion

- Exact reference file names/count beyond the D-01 split by concern.
- Exact `description` wording within the D-10 scoped posture (tuned in Phase 5).
- Whether the coach procedure lives fully in SKILL.md body or partly in a small references/ file.
- Exact TS example ordering/formatting and which kata leads.
- Whether to include a one-line-per-transformation cheat sheet (v1.x optional).

## Deferred Ideas

- Skill-creator trigger + behavior evals and empirical description tuning -> Phase 5 (EVAL-01/02).
- README + MIT LICENSE + authoring review (plugin-validator / skill-reviewer) -> Phase 4 (DIST-01/02/03).
- Additional worked examples (full Word Wrap, Prime Factors) + additional languages -> v1.x / v2+ (NEXT-04).
- Quick-reference cheat sheet -> v1.x.
