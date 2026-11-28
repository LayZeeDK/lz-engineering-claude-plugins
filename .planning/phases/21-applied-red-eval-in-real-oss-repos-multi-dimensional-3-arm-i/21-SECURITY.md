---
phase: 21
slug: applied-red-eval-in-real-oss-repos-multi-dimensional-3-arm-i
status: verified
# threats_open = count of OPEN threats at or above workflow.security_block_on severity (the blocking gate)
threats_open: 0
asvs_level: 1
created: 2026-08-02
---

# Phase 21 - Security

> Per-phase security contract: threat register, accepted risks, and audit trail.

Verified retroactively on 2026-08-02 by `gsd-security-auditor` (independent fresh-context
audit; the orchestrator did not reach this verdict inline). The register was authored at
plan time -- all four PLAN files carry a parseable `<threat_model>` block, so
`register_authored_at_plan_time: true` and the audit verified mitigations rather than
building a register retroactively.

**Audited against the code as it stands today, not as it stood at plan time.** Phase 21's
components were modified after the phase closed, by quick tasks `260801-w8b` and
`260802-j03` (a `blunt_red` verdict class and a widened `verdictPass()` in `grade-red.mjs`,
an `--arm d12` token in `run-e2e.mjs`, and revised srvx suite config and prompts). A
mitigation had to hold across that drift to count as CLOSED.

---

## Trust Boundaries

| Boundary | Description | Data Crossing |
|----------|-------------|---------------|
| eval-config -> reused driver | `suite.json` / `targets.json` / prompts are read by `run-e2e.mjs` to compose `claude -p` | Prompt text (eval integrity, not confidentiality) |
| model-produced diff -> grader | `grade-red.mjs` parses a model-generated `diff.patch` plus the target runner's JSON | Untrusted-ish structured input |
| grader -> disposable worktree | The produced test is applied and the target suite run in a temp-dir worktree, never the pristine tree | Model-authored test code, executed |
| captured meta/grade -> tabulator | `tabulate-mechanical-red.mjs` reads model-run `meta.json` and `red-grade.json` | Result data feeding published numbers |
| gated run -> `claude -p` (bypassPermissions) | The metered apply run drives model-generated test code and third-party OSS suites in disposable checkouts | Spend + arbitrary code execution |
| nominated target repo -> workspace | A newly nominated real-OSS target is `npm install`-ed and vendored | Third-party package contents (supply chain) |
| committed artifacts -> public repo | Suite config, `REQUIREMENTS.md`, `EVAL-RESULTS.md`, `RUN-GATE.md` are tracked in a PUBLIC repo | Maintainer PII (info-disclosure surface) |

---

## Threat Register

| Threat ID | Category | Component | Severity | Disposition | Mitigation | Status |
|-----------|----------|-----------|----------|-------------|------------|--------|
| T-21-03 | Information Disclosure | committed suite config, `REQUIREMENTS.md`, `EVAL-RESULTS.md`, `RUN-GATE.md` | low | mitigate | ASCII-only + allowlist-inversion; per-run transcripts git-ignored | closed |
| T-21-EVAL | Tampering (eval integrity) | `prompts/r1-next-test.md` | low | mitigate | Non-leading prompt; byte-identical across arms, driver-enforced + selfcheck-asserted | closed |
| T-21-02 | Tampering (false verdict) | `grade-red.mjs` diff/JSON read | medium | mitigate | Fail-closed on unreadable/empty diff, garbled meta, unparseable runner JSON | closed |
| T-21-12 | Files/Resources (V12) | `grade-red.mjs` worktree | low | mitigate | Per-grade worktree outside the checkout; `finally` teardown + prune; never a protected branch | closed |
| T-21-V5 | Input Validation (V5) | runner JSON parse | low | mitigate | Defensive parse; missing suite -> `collection_error`, not a crash | closed |
| T-21-02b | Tampering (false verdict) | `tabulate-mechanical-red.mjs` | low | mitigate | Fail-closed (exit 1) on garbled/keyless meta or a captured run missing its grade; Pass@k over exit-0 runs only | closed |
| T-21-V5b | Input Validation (V5) | `selfcheck-red.mjs` transcript parse | low | mitigate | Defensive parse; skip rather than crash when the gitignored transcript is absent | closed |
| T-21-01 | Elevation of Privilege / Tampering | metered apply run (`--mode apply`, bypassPermissions) | medium | mitigate | Blocking-human spend gate; disposable worktree reset to `applyBase`; process-tree kill on timeout; isolated checkout | closed |
| T-21-SC | Tampering (supply chain) | `npm` install / vendor of a gate-time-nominated target repo | high | mitigate | Package-legitimacy gate on ANY newly nominated target before install; blocking-human, never auto-approvable | closed |

*Status: open - closed - open, below `high` threshold (non-blocking)*
*Severity: critical > high > medium > low -- only open threats at or above `workflow.security_block_on` count toward `threats_open`*
*Disposition: mitigate (implementation required) - accept (documented risk) - transfer (third-party)*

### Verification Evidence

Every CLOSED verdict below is anchored to a file and line. Two threats were additionally
probed at runtime rather than read, because a fail-closed claim that is only read is an
assumption.

**T-21-03** -- Allowlist-inversion and ASCII scan re-run over 258 tracked in-scope files
(`lz-red-workspace`, the phase-21 planning dir, `REQUIREMENTS.md`, `e2e-nx`, `.gitignore`,
`.planning/quick`): 0 non-ASCII bytes and 0 non-approved email-shaped tokens. The
transcript-ignore leg was proven with `git check-ignore -v` rather than by reading the
patterns: `.gitignore:67` catches `results*/`, `run-*/`, `outputs/`, `answer.md`,
`diff.patch`, `meta.json` and `red-grade.json` under every `e2e-red-*` suite;
`.gitignore:75` catches `mechanical-red.json`; `.gitignore:40` catches `*.stream.jsonl`.
`git status --porcelain --untracked-files=all` is empty, so no capture is
untracked-and-unignored.

**T-21-EVAL** -- Driver leg: `run-e2e.mjs:254-278`, `composePrompt()` reads one prompt file
and returns `PREAMBLE[mode] + body` for the `no_skill` / `with_skill` arms and
`SKILL_COMMAND + PREAMBLE[mode] + body` for every invoke arm, so the bytes cannot diverge
by arm. Selfcheck leg: `selfcheck-red.mjs:316-325` asserts the cross-arm byte equality;
`:352-379` asserts the prompt names none of the target's `prompt_forbidden_tokens` AND that
a case-flipped poisoned prompt IS caught, which makes a clean result non-vacuous;
`:326-335` rejects any test-state claim; `:384-420` runs all of it across every discovered
suite x prompt x mode.

**T-21-02** -- `grade-red.mjs:344-351` (`assertReadableDiff()` throws on missing/empty
diff), `:2139-2143` (unreadable `diff.patch`), `:2150-2158` (garbled or keyless
`meta.json`), `:2165-2167` (missing target), `:2190-2197` (unstated `applyBase`),
`:2235-2246` (unresolvable runner), `:845-852` (`classify()` throws on non-numeric
`newErrors` or non-object `runnerJson`). **Runtime-probed: 9 of 9 fail-closed paths
threw** -- empty, whitespace and undefined diff; null and keyless tsc result; null and
non-object runnerJson; garbled runner stdout at exit 0; spawn error.

**T-21-12** -- `grade-red.mjs:693-712`, `resolveGradeTmpDir()` rejects any candidate
`isWithin` the target checkout and falls back to `os.tmpdir()`; `:2223` derives the
worktree path from it; `:2272` uses `git worktree add --detach`, which never checks out a
branch and so makes a protected branch structurally unreachable; `:2345-2379` teardown
(toolchain removal, `worktree remove --force`, `worktree prune`); `:2678-2682` teardown
invoked from `finally`; `:2390-2399` SIGINT/SIGTERM handler. Driver-side protected-branch
refusal at `run-e2e.mjs:663-668`.

**T-21-V5** -- `grade-red.mjs:860-861` guards `Array.isArray()` on `testResults` and
`assertionResults`; `:863-875` resolves zero assertions to `no_tests` or
`collection_error` rather than throwing; `:1120-1157` `parseRunnerReport()` fail-closed
contract. **Runtime-probed: 6 of 6** -- missing `testResults` key, non-array `testResults`,
empty `testResults`, suite with no `assertionResults`, and non-array `assertionResults` all
return `collection_error`; `newErrors > 0` returns `compile_error`.

**T-21-02b** -- `tabulate-mechanical-red.mjs:218` (unreadable file), `:224` (garbled JSON),
`:273` (keyless meta), `:296-297` (captured run missing its grade), `:304` (grade with no
boolean `pass`), `:329` (undiscoverable suite root) all throw with an explicit `T-21-02b`
message. Pass@k over exit-0 runs only at `:128-130`, consumed at `:193-202`.
`--selfcheck` re-run during the audit: exit 0.

**T-21-V5b** -- `selfcheck-red.mjs:606-723` crux 4 now runs off two committed transcript
fixtures and never SKIPs, which is stronger than the declared mitigation; the gitignored
on-disk capture remains optional and is skipped gracefully at `:726-745`.

**T-21-01** -- Spend gate: `RUN-GATE.md:26-34` HALT banner requires fresh explicit user
approval and states that no prior approval and no `workflow.auto_advance` setting carries
over, making it blocking-human and never auto-approvable; reaffirmed post-phase in
`260802-j03-RESEARCH.md:175` and `260802-j03-PLAN.md:568`. Isolation:
`run-e2e.mjs:683-717` resets hard to `applyBase`, cleans, and then takes a per-run pristine
attestation that throws if `git status --porcelain` is non-empty. Timeout: `:731`
`APPLY_TIMEOUT_MS` with a `taskkill /PID <pid> /T /F` process-tree kill at `:735-744`.
Checkout safety: `:1035-1037` requires `--cwd` on a throwaway in apply mode; `:663-668`
refuses a protected branch; `:673-681` refuses to orphan commits ahead of `applyBase`.

**T-21-SC** (the only `high`, therefore the only threat whose OPEN status would block) --
The requirement is present at `e2e-red-gilded-rose/RUN-GATE.md:177-186`: the
package-legitimacy gate runs on ANY newly nominated repo FIRST (registry age, downloads,
source repo), only then `npm install` and vendor, and explicitly "Do NOT auto-substitute a
similarly-named alternative if an install fails; surface it to the user". Mirrored at
`e2e-red-gilded-rose/targets.json:64`. Critically, the audit checked that the gate was
APPLIED at every entry point rather than merely documented, and accounted for all three
suites: `gilded-rose` is the already-vendored anchor kata and needs no install;
`e2e-red-srvx/targets.json:218` records a `legitimacy_gate` PASS (first publish 2024-09-16,
83 versions, MIT, zero runtime dependencies, not deprecated, repo live and not a fork);
`e2e-red-radix-ng/targets.json:167` records a PASS likewise. Both post-phase nominations
carry a recorded PASS, not just an inherited requirement.

### Unregistered Flags

None. No `## Threat Flags` section exists in any phase-21 SUMMARY, and the audit surfaced
no attack surface beyond what the register covers.

---

## Accepted Risks Log

No accepted risks. All nine threats were closed by verified mitigation; none required
acceptance or transfer.

---

## Observations (non-blocking, no status change)

Recorded because they are real and worth acting on, not because they change any verdict.

1. **Selfcheck coverage lags the post-phase arm additions.** `selfcheck-red.mjs` contains
   no reference to `invoke_treatment`, `invoke_forcing` or `d12`; its crux 1 and 2 drive
   `--arm all`, which expands to `{with_skill, no_skill, invoke_skill}` only
   (`run-e2e.mjs:1027-1031`). The two arms added by `260802-j03` are reachable only via
   `--arm d12` and are therefore never parity-asserted. T-21-EVAL stays CLOSED because the
   driver leg is structural -- `composePrompt()` returns the identical string for all three
   invoke arms and the arms differ only in `--plugin-dir` (`run-e2e.mjs:304-312`). This is
   a verification-coverage gap, not a mitigation gap. Worth closing by widening the crux to
   `--arm d12`.
2. **Two-regime grade corpus.** The verdict set grew from the planned 7 to 9
   (`unattributable`, `blunt_red`) and `verdictPass()` now credits `blunt_red` as a pass
   (`grade-red.mjs:947-949`). Not a T-21-02 regression: the pre-existing assertion rule is
   evaluated first and is byte-unchanged (`:924-935`), making the widening provably
   one-directional, and it is self-checked at `:3272-3286`. The source flags the
   consequence at `:22-26` -- grades archived before 2026-08-02 are not comparable to
   grades after it. Any cross-round Pass@k must state which regime produced each cell.
3. **`gradeRun()` has no protected-branch check of its own**, acknowledged in-source at
   `grade-red.mjs:2183`. Structurally moot because `--detach` (`:2272`) never checks out a
   branch, and the driver carries the refusal, but the asymmetry is worth recording since
   grading is a separate operator command from driving.
4. **Hygiene scan false positives, out of phase-21 scope.** Tree-wide, the only
   non-approved email-shaped matches are milestone filename tokens (`lz-tdd@0.0.2-...`) and
   a documentation placeholder in `260729-lc9-PLAN-CHECK-2.md:203` used to demonstrate that
   an inversion check discriminates. Both are benign artifacts of the generic regex. The
   in-scope scan is clean at 0. Bare-domain detection without an `@local-part` remains out
   of scope by design.

---

## Security Audit Trail

| Audit Date | Threats Total | Closed | Open | Run By |
|------------|---------------|--------|------|--------|
| 2026-08-02 | 9 | 9 | 0 | gsd-security-auditor |

---

## Sign-Off

- [x] All threats have a disposition (mitigate / accept / transfer)
- [x] Accepted risks documented in Accepted Risks Log (none required)
- [x] `threats_open: 0` confirmed
- [x] `status: verified` set in frontmatter

**Approval:** verified 2026-08-02
