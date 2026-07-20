---
phase: 18
phase_name: "Coach Procedure & lz-tpp Seam Wiring"
project: "lz-engineering-claude-plugins"
generated: "2026-07-20"
counts:
  decisions: 4
  lessons: 4
  patterns: 4
  surprises: 3
missing_artifacts:
  - "18-UAT.md (verification passed with no human_needed items)"
---

# Phase 18 Learnings: Coach Procedure & lz-tpp Seam Wiring

## Decisions

### Coach procedure inline in SKILL.md, not a reference leaf
The lz-red 6-step coach decision procedure replaced the SKILL.md placeholder inline, mirroring the
shipped lz-refactor (6-step) and lz-tpp (7-step) procedures, rather than living in a lazy-loaded
reference file.

**Rationale:** SKL-02 lean-router discipline + the always-active procedure must be reached without an
extra load + the placeholder already reserved the slot. SKILL.md grew 81 -> 147 lines, well under 500.
**Source:** 18-CONTEXT.md D-01, 18-05-SUMMARY.md

### Three Laws spine tiered Owned; oracle-verified against Clean Code Ch. 9 (gate-decided)
Law 1 + Law 2 authored blind at the owned target tier; the orchestrator oracle-reviewer gate confirmed
the tier against Clean Code Ch. 9 (no downgrade). Law 3 as the lz-tpp handoff is lz-red orchestration
(no-oracle).

**Rationale:** Ch. 9 is owned and literally contains the Three Laws; the adjacent "only enough to
fail" row was already owned. The D-05 honesty gate makes the tier claim verifiable, not asserted.
**Source:** 18-CONTEXT.md D-05, 18-06-SUMMARY.md (oracle-reviewer PASS conf 93)

### SEAM-02: both reverse pointers in one edit; review is an orchestrator gate
`lz-tpp -> lz-red` and `lz-tpp -> lz-refactor` shipped in a single additive lz-tpp/SKILL.md edit; the
mandatory >= 1-unbiased review ran as an orchestrator step after the executor returned.

**Rationale:** ROADMAP SC4 requires both pointers together; gsd-executor has no Agent/Task tool so it
cannot spawn its own review. lz-tpp is excluded from the no-verbatim scan, so the review is the sole
verbatim backstop.
**Source:** 18-CONTEXT.md D-09/D-10, 18-04-SUMMARY.md

### Sequential execution (no worktree isolation) for this run
All 6 executors ran on the main working tree, not in isolated worktrees.

**Rationale:** HEAD was 101 commits ahead of origin/main and the target files (the lz-red references,
the checker) do not exist on origin/main; worktrees branch from origin/HEAD by default (baseRef unset),
so an isolated worktree would have started from a tree where the files are absent -- catastrophic.
**Source:** execution decision (this session; git rev-list confirmed 0/101, git cat-file confirmed files absent on origin/main)

## Lessons

### The worktree base-check under-reported the real risk
`worktree.base-check --pick shouldDegrade` returned `false`, yet worktree isolation would have been
catastrophic here.

**Context:** The reliable signal was not the base-check but a direct test -- comparing HEAD to
origin/main (`git rev-list --left-right --count`) and checking whether the target files exist on
origin/main (`git cat-file -e origin/main:<path>`). On a feature branch far ahead of the remote default,
verify target-file existence on the fork base before trusting worktree isolation.
**Source:** execution (this session)

### `query commit` mutates config.json as a side effect
The GSD `query commit` handler flips the ephemeral `workflow._auto_chain_active` flag in
`.planning/config.json`, leaving it modified after each commit.

**Context:** Executors and the orchestrator had to restore it with a single-file
`git checkout .planning/config.json` after each commit to keep the ephemeral flag out of the tree.
Never stage config.json as part of a phase commit.
**Source:** 18-03-SUMMARY.md, 18-04-SUMMARY.md, 18-05-SUMMARY.md

### The instrument scanned references/ only -- SKILL.md + cross-tree guards were net-new
`check-red-references.mjs` (and `extract-samples.mjs`) covered `references/` but not the skill-root
SKILL.md, and had no guard reading the sibling lz-tpp/SKILL.md.

**Context:** Without adding SKILL.md content/fence coverage + the SEAM-02 cross-tree guard, the gate
would have gone falsely GREEN while the coach procedure and reverse pointers were unauthored. A
per-entry `dir` base override reached the skill root from one FILES entry.
**Source:** 18-RESEARCH.md, 18-01-SUMMARY.md

### An org spend-limit termination mid-executor is recoverable via spot-check
The Wave-1 executor was terminated by the org monthly spend limit after committing all its task work
but before its final SUMMARY/tracking commit.

**Context:** The completion-signal fallback applied: the work was verified via git log + filesystem
(3 task commits + SUMMARY.md on disk, checker RED-by-design confirmed, honesty gate byte-intact), and
the orchestrator finished the one pending commit rather than re-spawning a duplicate executor.
**Source:** execution (18-01 resume after limit reset)

## Patterns

### Instrument-first no-stale-marker guard via absence-of-`/Phase 18/i`
The D-14 "no stale deferral marker" check uses a NET-NEW `absent` checker field (inverse of `deferral`)
keyed on `/Phase 18/i` absence.

**When to use:** Flipping a co-edited stub's later-phase deferral guard into a positive content
assertion. Do NOT key it on the requirement-id token (`/LAW-0/`): filled content legitimately contains
LAW-01/SEAM-01, so an id-absence needle would false-fail. Key on the phase-marker phrase only.
**Source:** 18-01-SUMMARY.md, 18-CONTEXT.md D-14

### VIT-02 failing-test example as a compiling wrong-value stub
Depict a RED test with a stub that COMPILES but returns the wrong value (runtime AssertionError).

**When to use:** Any tsc-strict-clean "failing test" doc example. A missing symbol breaks tsc (the
extractor fails); a `ts ignore` / `@ts-` fence is skipped by the extractor AND false-passes a
word-boundary fence regex. The compiling-wrong-value stub is the only form that is both tsc-clean and
genuinely red for the right reason.
**Source:** 18-05-SUMMARY.md, 18-RESEARCH.md

### Orchestrator-driven agent gates after the executor returns
Agent-driven gates (oracle-reviewer, unbiased content review, skill-reviewer) are planned and run as
ORCHESTRATOR steps after the blind executor edit, never as executor tasks.

**When to use:** Any GSD phase whose closure depends on a subagent review/oracle gate. gsd-executor
has only Read/Write/Edit/Bash/Grep/Glob/Skill (no Agent/Task), so a plan task saying "executor spawns
the reviewer" is unexecutable. Frame it as "orchestrator gates after executor returns" in the plan.
**Source:** 18-06-PLAN.md, 18-CONTEXT.md D-05/D-10/D-12

### Per-entry `dir` base override for one-file-outside-the-tree coverage
A single checker FILES entry reaches the skill ROOT (SKILL.md) via a `dir` base override while the rest
stay under `references/`.

**When to use:** Extending a directory-scoped checker to cover one file in a different base directory
without restructuring the whole walk.
**Source:** 18-01-SUMMARY.md

## Surprises

### The security auditor surfaced 3 more threats than the finalize register named
gsd-security-auditor consolidated 8 threats (T-18-01..04 + T-18-SC named in the 18-06 gate register,
plus T-18-05, T-18-06, T-18-GATE from the earlier per-plan threat models).

**Impact:** All were already mitigated (GREEN), so SECURED held -- but it showed the phase-gate plan's
register was not the union of the per-plan registers. Reading every PLAN's `<threat_model>`, not just
the finalize plan's, is necessary for a complete register.
**Source:** 18-SECURITY.md, security-auditor verdict

### The decision-coverage gate note was pessimistic; it actually passed 14/14
The planner reported the decision-coverage gate "skipped on a CONTEXT.md path quirk," but when the
orchestrator ran `check.decision-coverage-plan` directly it passed cleanly (14/14 covered).

**Impact:** No re-plan was needed; the gate is stronger than the planner's self-report suggested.
Run the gate directly rather than trusting a subagent's "skipped" claim.
**Source:** execution (plan-phase step 13a)

### The skill-reviewer caught a genuine wrong step-number in a PASS
Gate 3 returned PASS on all 8 properties but flagged a real reader-tripping error: the worked-example
prose labeled the assertion "(step 5)" when it is step 4.

**Impact:** A scoped 1-line gap-closure edit (commit d4191c3) fixed it before acceptance; re-ran the
battery GREEN. A PASS-with-minor from an unbiased reviewer can still carry a genuine defect worth fixing.
**Source:** 18-06-SUMMARY.md (gate 3)
