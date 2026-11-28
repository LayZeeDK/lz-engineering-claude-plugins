---
phase: "23"
slug: "agent-as-developer-conversion-of-lz-red-lz-tpp-and-lz-refact"
# status lifecycle: draft (seeded by plan-phase) -> validated (set by validate-phase section 6)
status: draft
nyquist_compliant: false
wave_0_complete: false
created: "2026-11-26"
---

# Phase 23 - Validation Strategy

> Per-phase validation contract for feedback sampling during execution. Seeded from 23-RESEARCH.md "Validation
> Architecture".

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | `node:test` + `tsc` (tools/evals); Node `.mjs` selftests and gates (workspaces); `claude plugin validate` |
| **Config file** | `tools/evals/package.json` (`check`), `tools/evals/tsconfig.json`; workspace `package.json` `check` scripts |
| **Quick run command** | `npm --prefix .claude/skills/lz-red-workspace run check` and `npm --prefix .claude/skills/lz-refactor-workspace run check` |
| **Full suite command** | both workspace checks, `npm --prefix tools/evals run check`, `claude plugin validate . --strict`, `node .claude/skills/lz-red-workspace/variants/build-variants.mjs`, `node .claude/skills/lz-red-workspace/selfcheck-routing.mjs` |
| **Estimated runtime** | ~180 seconds (tools/evals check about 116 s measured) |

---

## Sampling Rate

- **After every task commit:** the workspace check the commit touches, plus the skill-contract check once it exists
- **After every plan wave:** the full suite command
- **Before `/gsd-verify-work`:** full suite must be green; the paid after run only if Lars approves its cost
- **Max feedback latency:** 180 seconds

---

## Per-Task Verification Map

Filled by the planner per task (requirement ids AGD-01 to AGD-12 from 23-RESEARCH.md). "W0" in File Exists means
the task's own Wave 0 step creates the file.

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 23-01-T1 | 01 | 1 | AGD-03, AGD-08 | T-23-01, T-23-02 | grader walk fails closed on unreadable input; asserted RED at HEAD | unit + CLI | `npm --prefix tools/evals run check`; `node tools/evals/check-skills.ts` (expect exit 1) | W0 | pending |
| 23-01-T2 | 01 | 1 | AGD-01, AGD-05, AGD-06 | T-23-02, T-23-03 | coach hygiene (ASCII, approved-gmail allowlist, quotes, names) | unit + CLI | `npm --prefix tools/evals run check`; `node tools/evals/check-skills.ts lz-tdd-coach` (expect exit 1, `missing`) | W0 | pending |
| 23-01-T3 | 01 | 1 | AGD-06, AGD-11 | T-23-03 | routing gate keeps reading the renamed headings | gate | `npm --prefix .claude/skills/lz-red-workspace run check`; refactor workspace check; `claude plugin validate . --strict` | yes | pending |
| 23-02-T1 | 02 | 2 | AGD-01, AGD-02, AGD-03, AGD-04, AGD-05 | T-23-04, T-23-05 | own test command only, no install | contract + gate | `node tools/evals/check-skills.ts lz-red`; lz-red workspace check | yes | pending |
| 23-02-T2 | 02 | 2 | AGD-05, AGD-11 | T-23-06 | none beyond hygiene | gate | lz-red workspace check; `node tools/evals/check-skills.ts lz-red` | yes | pending |
| 23-02-T3 | 02 | 2 | AGD-06 | T-23-06 | none beyond hygiene | contract + gate | `node tools/evals/check-skills.ts lz-red`; both workspace checks | yes | pending |
| 23-03-T1 | 03 | 2 | AGD-05 | T-23-07, T-23-08 | coach never edits or runs | contract + gate | `node tools/evals/check-skills.ts lz-tdd-coach`; `claude plugin validate . --strict`; lz-red workspace check | W0 (Plan 01) | pending |
| 23-03-T2 | 03 | 2 | AGD-05, AGD-11 | T-23-08, T-23-09 | every link resolves | contract + gate | `node tools/evals/check-skills.ts lz-tdd-coach`; lz-red workspace check | W0 (Plan 01) | pending |
| 23-04-T1 | 04 | 3 | AGD-01, AGD-02, AGD-03, AGD-04, AGD-05 | T-23-10, T-23-11 | own test command only, no install; no-shell line says unverified | contract + gate | `node tools/evals/check-skills.ts lz-tpp`; lz-red workspace check | yes | pending |
| 23-04-T2 | 04 | 3 | AGD-06 | T-23-12 | none beyond hygiene | contract + gate | `node tools/evals/check-skills.ts lz-tpp`; `npm --prefix tools/evals run check` | yes | pending |
| 23-05-T1 | 05 | 4 | AGD-01, AGD-02, AGD-03, AGD-04, AGD-05 | T-23-13, T-23-14 | blast-radius stop, red-before-refactor stop, revert on red | contract + gate | `node tools/evals/check-skills.ts lz-refactor`; both workspace checks | yes | pending |
| 23-05-T2 | 05 | 4 | AGD-05, AGD-11 | T-23-16 | none beyond hygiene | gate | refactor workspace check | yes | pending |
| 23-05-T3 | 05 | 4 | AGD-06, AGD-08 | T-23-15 | old label makes the gate fail (mutation proof) | contract + gate | `npm --prefix tools/evals run check` (now runs check-skills); both workspace checks | yes | pending |
| 23-06-T1 | 06 | 5 | AGD-07, AGD-08 | T-23-17, T-23-18, T-23-19 | builder run without a shell; stale stamp and test-state line fail | unit + CLI | `node --test tools/check-variants.test.ts`; `node tools/check-variants.ts build`; `node tools/check-variants.ts`; `node selfcheck-routing.mjs` | W0 | pending |
| 23-06-T2 | 06 | 5 | AGD-07, AGD-08 | T-23-18 | standard check always rebuilds before verifying | gate | `npm --prefix .claude/skills/lz-red-workspace run check` | yes | pending |
| 23-07-T1 | 07 | 5 | AGD-12 | T-23-20, T-23-21 | approved-gmail allowlist over docs and manifests | gate | `claude plugin validate . --strict`; refactor workspace check (check-hygiene) | yes | pending |
| 23-07-T2 | 07 | 5 | AGD-09, AGD-12 | T-23-20 | none beyond hygiene | grep gates | `git ls-files .planning/todos/completed/...`; `rg` gates in the plan | yes | pending |
| 23-07-T3 | 07 | 5 | AGD-09, AGD-11 | T-23-22 | original wording only | gate | refactor workspace check (check-smells, check-crossrefs); per-leaf `rg -l` gates | yes | pending |
| 23-08-T1 | 08 | 6 | AGD-10 | T-23-26 | stub dry run only, no paid call | dry run | `node tools/evals/eval.ts stage "$(git log -1 --format=%H -- plugins/lz-tdd)"`; `npm --prefix tools/evals run check` | W0 | pending |
| 23-08-T2 | 08 | 6 | AGD-10 | T-23-23 | blocking human cost approval | checkpoint | manual: Lars's recorded pre-approval (AFK log rows 2026-11-27T22:35Z and 2026-11-28T08:58Z) with every Task 2 condition checked and written down, else Lars's own message | n/a | pending |
| 23-08-T3 | 08 | 6 | AGD-10 | T-23-24, T-23-25, T-23-27 | budget check per stage; results scanned; heavy lock | paid eval | `node tools/evals/eval.ts crosscheck evals/results/after-23`; `node tools/evals/check-cases.ts` | W0 | pending |

*Status: pending / green / red / flaky*

---

## Wave 0 Requirements

- [ ] `tools/evals/check-skills.ts` + `.test.ts`: banned coach phrases, line formats against committed graders, coach skill present, description caps (AGD-01, 03, 05); asserted RED at HEAD -- Plan 01 Tasks 1-2
- [ ] Hygiene coverage for `skills/lz-tdd-coach/` (AGD-05) -- check-skills coach rules, Plan 01 Task 2 (check-red-references' shipped-tree gates also scan it)
- [ ] Variant single-axis and staleness checks (AGD-07) -- `check-variants.ts` + test, Plan 06 Task 1
- [ ] Leaf-reachability check for the seven named leaves (AGD-09) -- per-leaf measured `rg -l` gates in Plan 07 Task 3 [HEAD=0 each EXPECT>=1 each]

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Reviewer gates on every skill-text change | AGD-11 | Agent review, not a script | Orchestrator spawns the D-10 reviewer agents after each skill change |
| Before/after behaviour numbers | AGD-10 | Paid; needs Lars's yes on cost | `node tools/evals/eval.ts run evals/results/<after>` then aggregate and crosscheck |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 180s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
