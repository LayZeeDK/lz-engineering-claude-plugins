---
phase: 5
slug: skill-effectiveness-evals
status: passed
threats_open: 0
asvs_level: default
block_on: high
audited: 2026-07-03
independent: true
---

# Phase 5 Security Audit -- Skill Effectiveness Evals

Independent, from-scratch retroactive audit. Each PLAN-time threat mitigation was
verified against the executed repository state (git tracking, .gitignore, grader
code, vendored harness, eval artifacts) -- not against the prior inline
SECURITY.md or VERIFICATION.md, which were not read before findings were formed.
Every claim below cites evidence the auditor personally checked.

## Scope confirmation (independently verified)

The phase claims NO product code shipped. Confirmed:

- `git status --porcelain plugins/` -> empty (working tree clean under plugins/).
- SKILL.md last modified by commit `841e97e` ("docs(lz-tpp): de-duplicate TS/JS
  overlay"), a non-Phase-5 commit; `git log -- plugins/.../SKILL.md` shows NO
  `05-*` commit ever touched it. D-07 decision was no-tuning (05-04-SUMMARY).
- All Phase-5 eval artifacts live under `.claude/skills/lz-tpp-workspace/`
  (340 tracked files); none under `plugins/`. The workspace is dev tooling
  excluded from the distributed plugin.
- Raw run transcripts exist on disk under `.../run-*/outputs/` but are gitignored
  (`git check-ignore` echoes the path; `git status --ignored` marks `!!`) and are
  NOT tracked (`git ls-files ... | rg "outputs/|transcript"` -> none).

## Threat register verification

| Threat | Category | Disposition | Verdict | Evidence checked |
|--------|----------|-------------|---------|------------------|
| T-05-01 | Tampering (input validation) | mitigate | CLOSED | Parsed every authored JSON: `evals/trigger-eval.json` (27 queries, 13 pos / 14 neg), `trigger-smoke.json` (2), `evals.json` (skill_name=lz-tpp, 10 scenarios), 10/10 `eval_metadata.json`, all `trigger-results*.json` -- ALL-JSON-PARSE-OK. `grade-run.mjs --selfcheck` -> SELFCHECK OK. PLAN task verify blocks require()/JSON.parse each file before use. |
| T-05-02 | Tampering / EoP | mitigate | CLOSED | (a) Coach-subagents: `grade-run.mjs` has the `nodrive` check via `toolDrive()` -- any Edit/Write/MultiEdit/NotebookEdit/Bash > 0 = "drove"; fail-safe (no metrics -> fail) + fail-loud (unrecognized shape -> fail), proven by selfcheck. Subagents consume only `evals.json` prompts. 05-02-SUMMARY: 0/60 drove, confirmed by empty isolated scratch dirs. (b) Ephemeral probe: `run_eval.py` creates `.claude/skills/<id>/SKILL.md` (l.83-102) and deletes it via `shutil.rmtree(..., ignore_errors=True)` in an outer `finally` (l.265-270); probes only authored trigger queries. A3 re-verified at run time (05-03-SUMMARY: no lz-tpp/lz-tdd enabled; no SKILL.md at any workspace skill root). |
| T-05-03 | Information disclosure | mitigate | CLOSED | Transcript exclusion CLOSED: `.gitignore` l.28/31 exclude `**/outputs/` and `**/trigger-workspace/`; verified untracked. Email allowlist: eval artifacts are clean -- `git grep` for any email under `.claude/skills/lz-tpp-workspace` (incl. EVAL-RESULTS.md) returns ZERO. The one violation -- the prior inline `05-SECURITY.md` spelling the work-email literal (company domain `consensus.dk`) in the unpushed commit `60fa6f3` -- was remediated by amending that single unpushed commit (origin/main `a19b4f4` was clean throughout). See Remediation. |
| T-05-04 | Tampering (scope integrity) | mitigate | CLOSED | `git status --porcelain plugins/` empty; no `05-*` commit modified SKILL.md; the D-07 widened-description variant was drafted then reverted (05-04-SUMMARY) -> SKILL.md at shipped state. The bound (only SKILL.md, description within char limit) held vacuously: nothing changed. |
| T-05-05 | Spoofing (false negative) | mitigate | CLOSED | Prefix-match detection in `run_eval.py` (`trigger_token = "<skill>-skill-"`, l.82; matched against Skill/Read events). Smoke gate is a procedural control: `trigger-smoke.json` (2 queries) exists; 05-03-SUMMARY records smoke PASSED 2/2 (should-trigger 1/1, near-miss 0/1) before the full set. Final clean measurement 100% recall / 100% specificity. Robustness note below. |
| T-05-SC | Tampering (supply chain) | accept/mitigate | CLOSED (warning) | No dependency manifests in the workspace (`git ls-files | rg "package.json|requirements.txt|pyproject"` -> none). All 4 committed Node tools import only `node:` built-ins (fs/path/url/child_process). `run_eval.py` + vendored scripts are Python stdlib only; `rg` for `requests|urllib|http|socket` imports -> none; the only spawned process is the authenticated `claude` CLI (resolved via `shutil.which`, shell=False). `LICENSE.upstream.txt` present. LICENSE-LABEL discrepancy (warning) below. |

## Remediation (resolved 2026-07-04)

### T-05-03 -- work-email literal in the unpushed closure commit (CLOSED)

The declared mitigation for T-05-03 is a public-repo email allowlist ("only the
public gmail permitted; no work email in any committed Phase-5 file"). The eval
artifacts satisfied it (zero emails). It FAILED for one Phase-5 file: the prior
inline `05-SECURITY.md` spelled the full work-email literal (username + company
domain `consensus.dk`). Evidence at audit time:

- `git grep -l "<work-email-literal>"` -> only the prior inline
  `.planning/phases/05-skill-effectiveness-evals/05-SECURITY.md`.
- Introduced by commit `60fa6f3` ("chore(05): complete Phase 5 closure ...").
- The commit was HEAD and UNPUSHED; `origin/main` (`a19b4f4`) never contained it.
- Ironically, the leaking line was itself the allowlist assertion ("no <literal>
  in any committed Phase-5 file") -- which, by spelling the literal, refuted itself.

Resolution (owner-approved): because the leak was confined to a single unpushed
commit, `60fa6f3` was amended to fold in this cleaned `05-SECURITY.md` and the
redacted `05-VERIFICATION.md`, so the literal never enters pushed history. No
`git filter-repo` / force-push was required (contrast the Phase-1 exposure, which
had already been pushed). Post-amend verification: `git grep` for the literal
across HEAD and full history (`git log -S`) returns ZERO; `origin/main` unchanged.
threats_open = 0.

## Accepted risks

- T-05-SC (supply chain): no package installs this phase; the vendored `run_eval`
  is a first-party reimplementation of upstream skill-creator, stdlib-only, no
  network beyond the authenticated `claude` CLI. Residual trust is in the local
  `claude` binary and the Python/Node standard libraries -- accepted, consistent
  with the plan disposition.

## Warnings (non-blocking)

- LICENSE-LABEL discrepancy (T-05-SC provenance): the threat register and the
  `run_eval.py` provenance docstring both state the upstream is "Anthropic MIT".
  The vendored `LICENSE.upstream.txt` AND the installed upstream marketplace
  (`claude-plugins-official`) are Apache License 2.0, not MIT. The attribution
  FILE is correct (matches upstream Apache-2.0 and is retained, so the mitigation
  control holds); only the "MIT" LABEL in the register/docstring is inaccurate.
  Apache-2.0 is permissively compatible with this MIT-licensed public repo and
  the license text is preserved. RESOLVED 2026-07-04: corrected "MIT" ->
  "Apache-2.0" in the `run_eval.py` + README.md provenance and the 05-03 PLAN
  register / 05-CONTEXT provenance note. No security impact.

- T-05-05 robustness (informational, not open): 05-03-SUMMARY documents a false
  outcome (recall read ~8%) from the FIRST full run at `--num-workers 3` --
  concurrent `claude -p` probes throttled under a tight rate window and read as
  silent non-triggers, a textbook false-negative. The single-query smoke gate did
  not catch it (smoke ran at low concurrency). It was caught by cross-checking a
  serial (`--num-workers 1`) re-measurement, which corrected to 100%/100%. The
  final result is trustworthy, but the smoke gate alone does not detect
  concurrency-induced false negatives; serial confirmation of borderline
  positives is the effective guard.

## Public-repo hygiene notes

- Distributed surface unchanged: `plugins/` clean; the plugin ships no Phase-5
  code. Eval tooling is confined to `.claude/skills/lz-tpp-workspace/`.
- Raw transcripts and the trigger-workspace are gitignored and untracked; only
  grading/timing/benchmark/results/EVAL-RESULTS are committed (D-08 honored).
- Email allowlist holds for all eval artifacts; the lone violation was the audit
  file itself (see T-05-03 / Remediation), resolved by amending the unpushed
  commit `60fa6f3` before any push.
- SUMMARY files contain no `## Threat Flags` section; no unregistered new attack
  surface was declared by the executors. The two items above (work-email literal,
  license mislabel) were surfaced by this independent audit, not by a flag.

## Verdict: PASSED (0 open)

All 6 threats CLOSED (T-05-01, T-05-02, T-05-04, T-05-05, T-05-SC -- the last with
a non-blocking license-label warning; and T-05-03, resolved below). T-05-03's
allowlist mitigation held for every eval artifact; the lone violation -- the prior
inline `05-SECURITY.md` leaking the work-email literal into the unpushed closure
commit `60fa6f3` -- was remediated by amending that single unpushed commit before
any push (see Remediation). Post-amend `git grep` / `git log -S` confirm the
literal is absent from HEAD and full history; `origin/main` was clean throughout.
threats_open = 0.
