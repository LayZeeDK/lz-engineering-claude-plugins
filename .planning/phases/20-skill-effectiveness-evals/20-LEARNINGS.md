---
phase: 20
phase_name: "skill-effectiveness-evals"
project: "lz-engineering-claude-plugins"
generated: "2026-07-21"
counts:
  decisions: 6
  lessons: 5
  patterns: 7
  surprises: 4
missing_artifacts:
  - "20-UAT.md (none created; verification passed with no human_needed items)"
---

# Phase 20 Learnings: skill-effectiveness-evals

## Decisions

### Build-then-halt the whole phase (D-11 HARD GATE)
All three plans built and deterministically verified the eval infrastructure (trigger harness + data, RED-behavior grader + scenarios, results scaffold) and ran NOTHING metered -- no claude -p, no run_eval, no subagent fan-out. The empirical eval RUNS are a separate user-gated orchestrator step.

**Rationale:** The metered measurement spends claude -p tokens and is user-gated (eval-run-approval-gate); building the ready-to-run instruments and halting keeps the phase zero-spend and lets the user decide when to spend. Mirrors the Phase-11 (0.0.2) precedent.
**Source:** 20-CONTEXT.md (D-11); 20-01/20-02/20-03 PLAN.md + SUMMARY.md

### Copy the vendored native-fixed harness byte-identical, never re-fix (D-01)
run_eval.py + utils.py + __init__.py + LICENSE.upstream.txt + eval-status.mjs + merge-judge.mjs were copied byte-for-byte from the lz-refactor rig; the skill-agnostic Windows native fix (select-on-pipe, whole-turn detection, ephemeral project-skill probe) was NOT re-touched.

**Rationale:** The fix is skill-agnostic and already proven; re-fixing risks regression. Author eval DATA, not eval INFRASTRUCTURE. Verified with `git diff --no-index --quiet`.
**Source:** 20-01-SUMMARY.md (key-decisions)

### Run executors sequentially on the main tree, no worktree isolation (orchestration)
The orchestrator dispatched all three gsd-executor agents without `isolation="worktree"`, serializing wave-1's two plans on the live branch.

**Rationale:** The branch (gsd/lz-tdd-0.0.3-lz-red) was 150 commits ahead of origin/main with `worktree.baseRef` unset, so worktree agents would fork from origin/main -- which lacks the build-target dir and the lz-red skill. Correctness over the marginal parallelism gain on a 3-plan build phase.
**Source:** 20-execute-phase orchestration (empirical origin/main ls-tree check)

### Leave EVL-01/EVL-02 OPEN in REQUIREMENTS despite phase completion
Every plan set `requirements_completed: []`; the orchestrator kept EVL-01/EVL-02 at Pending (with a "build complete; empirical run gated" annotation) after phase.complete.

**Rationale:** The requirements are empirical ("lz-red fires...", "coach recommends...versus baseline") and are only demonstrated by the gated run. Marking them Complete would be a false claim. The verifier independently confirmed Pending is the correct, non-deceptive state.
**Source:** 20-01/20-02/20-03 SUMMARY.md (requirements-completed: []); 20-VERIFICATION.md; orchestration reconciliation

### D-05-RUBRIC hybrid grader: script the mechanical dimensions, judge only two
grade-run.mjs grades six mechanical RED coach dimensions deterministically (phrase-set matchers) and reserves the LLM judge for EXACTLY two judgment-heavy dimensions (right-next-test, behavior-not-implementation), enforced by a selfcheck `judges <= 2` gate.

**Rationale:** Deterministic grading is reusable across iterations and cheap; only genuinely subjective dimensions warrant a metered judge.
**Source:** 20-02-SUMMARY.md; 20-CONTEXT.md (D-05-RUBRIC)

### Reciprocal RED probe uses the direct run_eval twice, NOT the canary-gated runners
EVAL-RESULTS.md documents the reciprocal spot-check as `run_eval` against lz-tpp then lz-refactor, explicitly NOT via the canary-gated runners.

**Rationale:** The canary is a lz-red positive that would not fire on a sibling skill-path, so a canary-gated runner would wrongly distrust every chunk. Specificity is throttle-robust, so the direct probe is sound.
**Source:** 20-03-SUMMARY.md (key-decisions)

---

## Lessons

### GSD's worktree base-check shouldDegrade=false is a false negative on an unpushed feature branch
`gsd-tools query worktree.base-check --pick shouldDegrade` returned false, but an empirical `git ls-tree origin/main` showed origin/main lacked `.claude/skills/lz-red-workspace/` (the build target) and `plugins/lz-tdd/skills/lz-red/` (the ground-truth read). A worktree forked from origin/HEAD would have run executors against 150-commit-stale content and failed confusingly.

**Context:** Confirms the standing global-CLAUDE.md warning that worktrees fork from origin/HEAD (not live HEAD) when `worktree.baseRef` is unset. Always verify the fork base has the dirs the plans depend on before trusting worktree isolation on a mid-feature branch. The lazy-correct fix is sequential-no-worktree.
**Source:** 20-execute-phase orchestration

### phase.complete over-flips a build-then-halt phase's requirements to Complete
`gsd-tools query phase.complete 20` flipped EVL-01/EVL-02 from `[ ]`/Pending to `[x]`/Complete in REQUIREMENTS.md (both the checkbox list and the traceability table), ignoring the plans' `requirements_completed: []`.

**Context:** For a build-then-halt / gated-measurement phase this over-claims delivery. Always inspect the REQUIREMENTS.md diff after phase.complete and revert any requirement whose empirical closure is still gated. VIT-02 was already Pending, so a mixed Complete/Pending state is a supported precedent.
**Source:** 20-execute-phase orchestration (phase.complete diff)

### GSD tooling injects a non-ASCII em-dash into STATE.md
Both the 20-03 executor and the orchestrator's phase.complete run left a U+2014 em-dash in STATE.md's activity line, violating the ASCII-only rule.

**Context:** GSD's advance-plan / phase.complete handlers are not ASCII-safe. After any GSD-tool STATE.md write, scan for non-ASCII and normalize `--` before committing.
**Source:** 20-03-SUMMARY.md; 20-execute-phase orchestration

### The naive email-regex hygiene scan false-positives on version/archive tokens
A `<local>@<domain>.<tld>`-shaped regex flags milestone/archive tokens like `lz-tdd@0.0.1-ROADMAP.md`. These are benign, not emails.

**Context:** Allowlist-inversion scans must recognize the `lz-tdd@<semver>...` false-positive class (or scope the scan away from ROADMAP archive references) so a benign version string is not mistaken for a leak. The real guard remains: assert only the approved public gmail; never encode the forbidden value.
**Source:** 20-02-SUMMARY.md; 20-execute-phase orchestration hygiene scans

### git grep is a silent zero inside *-workspace/
All work under `.claude/skills/lz-red-workspace/` is partially gitignored, so `git grep` returns zero matches with no error. rg or Read/Glob must be used there.

**Context:** Every plan carried this as RESEARCH Pitfall 7; it held true throughout. Never conclude a symbol is absent from a git grep zero inside a workspace tree.
**Source:** 20-01/20-02/20-03 PLAN.md (Read-blindness note)

---

## Patterns

### Instrument-first RED-then-GREEN for eval assets
Author the checker (check-evals.mjs) / the grader selfcheck (grade-run.mjs --selfcheck) so it FAILS closed on the absent data (RED baseline), then author the data to turn it GREEN.

**When to use:** Building any eval-set lint or grader -- prove the instrument is wired and fail-closed before the data exists, so a passing gate genuinely means the data is present and valid.
**Source:** 20-01-SUMMARY.md (check-evals RED->GREEN); 20-02-SUMMARY.md (grade-run selfcheck RED->GREEN)

### Allowlist-inversion email hygiene
Assert the only email-shaped token present is the approved public contact; flag everything else. Never encode the forbidden work-email/domain, even as a search needle.

**When to use:** Any hygiene gate over maintainer-authored content in a public repo. Writing the forbidden value as a needle is itself the leak.
**Source:** 20-01-SUMMARY.md; AGENTS.md

### Canary-gated chunk runners with a derived canary
A chunk of eval results is trusted only if its appended positive-control query fired; the CANARY_PREFIX is derived from a real should_trigger:true positive in the set (via startsWith), never hand-typed.

**When to use:** Chunked/rate-limited eval runs where a silently-empty chunk must be distinguishable from a genuinely-quiet one. Deriving the canary from the set prevents a hand-typed twin from drifting.
**Source:** 20-01-SUMMARY.md (WR-01)

### Dual-write byte-consistency invariants
A lint asserts derived eval files are byte-consistent with their source: negatives.json equals the trigger negative slice; reciprocal-red.json equals the trigger positives re-tagged should_trigger:false.

**When to use:** Whenever the same query strings must appear in more than one eval file -- enforce equality in the lint so the copies cannot silently diverge.
**Source:** 20-01-SUMMARY.md

### Negation-aware phrase matching to prevent grader leniency
Route every phrase-set phrase through occursAffirmed() (with NEG / CONTRAST / hedgedContrastive clause helpers), never a bare regex.test, so a warned-against phrase ("assert the value, NOT the private field") is not credited.

**When to use:** Any deterministic prose grader -- coaching text is dense with contrastive phrasing, so bare presence-matching credits exactly the phrases the coach warned against (the Phase-11 grader-leniency class).
**Source:** 20-02-SUMMARY.md (Pitfall 6 / CR-01)

### Results record complete-in-structure, empty-in-numbers
When a measurement is user-gated, commit the results doc with the full section/table structure (incl. Pass@k/Pass^k, formulas, captions) and all numbers blank; the ready-to-run command set + HALT line are the deliverable.

**When to use:** Any build-then-halt measurement phase -- proves the reporting obligation is wired without spending tokens, and gives the user an exact, reviewable run recipe.
**Source:** 20-03-SUMMARY.md

### Vendored-harness verbatim copy + light-edit only skill-specific constants
Copy the shared rig byte-identical (verified by diff), then edit ONLY the skill-specific constants (the SKILL name, the CANARY prefix) in the runners; keep run config and skeleton verbatim.

**When to use:** Reusing a proven multi-file harness for a sibling skill -- minimizes divergence surface and keeps the skill-agnostic fix intact and auditable.
**Source:** 20-01-SUMMARY.md; 20-02-SUMMARY.md (grade-run skeleton kept byte-verbatim)

---

## Surprises

### The worktree fork base was 150 commits stale and missing the entire build target
origin/main lacked lz-red-workspace and the lz-red skill, yet GSD's own shouldDegrade check said "do not degrade."

**Impact:** Had the orchestrator trusted worktree isolation, all three executors would have failed against stale content, wasting Opus tokens. Detected pre-dispatch by an explicit origin/main ls-tree check; overridden to sequential-no-worktree.
**Source:** 20-execute-phase orchestration

### phase.complete silently marked the gated requirements Complete
Despite every plan declaring `requirements_completed: []`, the completion tool flipped EVL-01/EVL-02 to Complete.

**Impact:** A false empirical-validation claim would have shipped had the diff not been inspected; required a manual revert to Pending with an annotation.
**Source:** 20-execute-phase orchestration

### The security audit crossed an org monthly-spend-limit boundary and resumed cleanly
The gsd-security-auditor terminated mid-write on 20-SECURITY.md with an API spend-limit error (and the safety classifier was unavailable), then resumed from transcript via SendMessage after the limit reset and finished the audit (threats_open: 0).

**Impact:** No rework needed; the partial artifact + agent context survived the interruption. Confirmed the resumed agent's output independently (hygiene re-scan, battery re-run) because the classifier had been down.
**Source:** 20-execute-phase orchestration

### Zero deviations across all three plans; battery GREEN on first run each time
Every plan executed exactly as written; the deterministic battery passed on the merged tree without a single gap-closure loop.

**Impact:** The build phase completed cleanly and fast (~11/20/15 min per plan), which is unusual for a multi-file harness port -- attributable to the instrument-first RED->GREEN discipline and the byte-identical vendored copy.
**Source:** 20-01/20-02/20-03 SUMMARY.md (Deviations: None)
