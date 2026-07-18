---
phase: 15-lz-red-skill-scaffold-description-boundary
reviewed: 2026-07-18T01:54:37Z
depth: standard
files_reviewed: 11
files_reviewed_list:
  - plugins/lz-tdd/skills/lz-red/SKILL.md
  - plugins/lz-tdd/skills/lz-red/references/three-laws-and-test-selection.md
  - plugins/lz-tdd/skills/lz-red/references/test-structure-and-assertions.md
  - plugins/lz-tdd/skills/lz-red/references/naming.md
  - plugins/lz-tdd/skills/lz-red/references/anti-patterns.md
  - plugins/lz-tdd/skills/lz-red/references/vitest-typescript-mechanics.md
  - plugins/lz-tdd/skills/lz-red/references/principle-backing.md
  - plugins/lz-tdd/skills/lz-red/references/testing-stance/README.md
  - plugins/lz-tdd/skills/lz-red/references/testing-stance/functional-core.md
  - plugins/lz-tdd/skills/lz-red/references/testing-stance/message-matrix.md
  - plugins/lz-tdd/skills/lz-red/references/testing-stance/seams-and-legacy.md
findings:
  critical: 0
  warning: 1
  info: 0
  total: 1
status: issues_found
---

# Phase 15: Code Review Report

**Reviewed:** 2026-07-18T01:54:37Z
**Depth:** standard
**Files Reviewed:** 11
**Status:** issues_found

## Summary

Reviewed the `lz-red` agent-skill scaffold (1 SKILL.md router + 10 reference-stub content
contracts) against what a scaffold is supposed to be: frontmatter correctness, description
triggering quality, progressive-disclosure link integrity, public-repo hygiene, scope-fence
adherence, and internal requirement-ID / fill-phase consistency. The scaffold is high quality
and passes every load-bearing gate:

- **Frontmatter (SKL-01):** exactly two top-level keys -- `name: lz-red` (equals the directory)
  and `description`. No `version`, `disable-model-invocation`, `user-invocable`, or
  `allowed-tools`. Dual-mode-by-omission is correct.
- **Description (SKL-03):** folded length measures 1091 chars (<= 1536). Leads with the positive
  RED-phase trigger (choose / write the next FAILING test), carries BOTH reciprocal exclusions
  (green / make-it-pass -> lz-tpp; restructure passing code -> lz-refactor), positive trigger
  precedes both exclusions, and stays language-agnostic (no Vitest / TypeScript named).
- **Progressive disclosure:** all 10 reference links resolve on disk with exact case
  (`testing-stance/README.md`, not `readme.md`). SKILL.md links, it does not restate reference
  content; the `## Listen to the tests` caveat is the required D-04 heuristic note, not a
  duplication of `anti-patterns.md`.
- **Public-repo hygiene:** byte-level scan finds zero non-ASCII characters across all 11 files;
  email allowlist-inversion finds zero email-shaped tokens (no leak of the maintainer's employer
  email or domain).
- **Scope fences:** no authored file claims to have bumped `plugin.json`, edited `marketplace.json`
  or `lz-tpp`, or created an eval workspace. The `seams-and-legacy.md` lz-refactor cross-link is
  explicitly deferred ("no link is added here yet"), not asserted.
- **Internal consistency:** every stub's requirement IDs, source clusters, and access tiers
  (owned vs unowned / no-oracle) match the plan's per-stub table and agree across files
  (RCM / Metz / Owen owned; Beck / Feathers / Bernhardt unowned everywhere they appear).

One consistency defect was found: the SKILL.md Phase-18 placeholder cites RTR-03 among the
requirements "authored in Phase 18," but RTR-03 is scoped to Phase 17 in its own stub and in the
plan. Details below. No BLOCKER-level issues; nothing that fails `claude plugin validate` or
breaks the router.

## Warnings

### WR-01: Placeholder cites RTR-03 as a Phase-18 requirement, but RTR-03 is Phase-17-scoped everywhere else

**File:** `plugins/lz-tdd/skills/lz-red/SKILL.md:57`
**Issue:** The deferred-procedure placeholder reads:

> "... is authored in Phase 18 (SEAM-01, LAW-01/02, RTR-02/03)."

The shorthand `RTR-02/03` denotes RTR-02 and RTR-03. Of that list, SEAM-01, LAW-01, LAW-02, and
RTR-02 each legitimately carry a Phase-18 authoring component per the plan
(`15-01-PLAN.md`: three-laws stub is "Phases 16 + 18"; `testing-stance/README.md` is
"Phase 17 (index) + Phase 18 (SKILL.md routing step)"). RTR-03 does not. RTR-03 is marked
Phase-17-only in both places it is defined:

- `references/anti-patterns.md:10` -- "Populated in Phase 17. Satisfies ANTI-01, ANTI-02, RTR-03."
- `references/anti-patterns.md:27` -- "Listen to the tests (RTR-03 meta-rule) ..."
- `15-01-PLAN.md` per-stub table -- `anti-patterns.md | ANTI-01, ANTI-02, RTR-03 | ... | Phase 17`.

So the placeholder's Phase-18 requirement list and the RTR-03 stub disagree on RTR-03's fill
phase. This matches the "inconsistent requirement-ID / fill-phase reference" finding class.
Impact is low and forward-only -- the placeholder is self-labeled non-authoritative
("Do not infer it from this scaffold"), nothing downstream parses it, and no gate breaks -- but
left as-is it can mislead the Phase-18 author about whether RTR-03 is Phase-17 content or
Phase-18 procedure-wiring.

Note the defensible reading: RTR-03's meta-rule ("listen to the tests / allow reasoned
deviation") is genuinely exercised by the eventual coach procedure, so one could argue its
*wiring into the numbered steps* is a Phase-18 act even though its *reference content* lands in
Phase 17 -- exactly the dual-phase structure RTR-02 already has. Under that reading the citation
is intended, not wrong. The fix below lets you resolve it either way.

**Fix:** Pick one so the two references agree.

Option A (lower effort, most consistent with the plan) -- drop RTR-03 from the Phase-18
parenthetical, since RTR-03 has no Phase-18 component in the plan:

```markdown
this scaffold. is authored in Phase 18 (SEAM-01, LAW-01/02, RTR-02).
```

Option B (if RTR-03's procedure-wiring is deliberately Phase-18 work) -- make `anti-patterns.md`
dual-phase like RTR-02 so both docs agree, e.g. change its marker to:

```markdown
> Populated in Phase 17 (ANTI-01, ANTI-02) + Phase 18 (RTR-03 wired into the SKILL.md coach
> procedure). Satisfies ANTI-01, ANTI-02, RTR-03. ...
```

---

_Reviewed: 2026-07-18T01:54:37Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
