# 260725-63f -- PILOT-FIX: the three defects the k=1 RED pilot exposed

Follow-up to quick task 260725-63f. Fixes the three defects surfaced by the user-approved k=1
`invoke_skill` apply run against the Gilded Rose kata (2026-07-25, exit 0, 85 s, $0.54,
`genuinely_red`). Zero metered spend in this pass -- every finding was reconstructed from the
already-captured transcript on disk.

Base: `55a5d17`. Four commits, one logical change each.

| Commit | Defect | Scope |
|--------|--------|-------|
| `85e0cb4` | D3 hygiene | `.gitignore` (one rule) |
| `bb83e21` | D1 measurement-invalidating | `run-e2e.mjs`, `tabulate-mechanical-red.mjs`, `selfcheck-red.mjs`, 2 new + 1 updated fixture |
| `47c3179` | D2 bias against the measured behavior | `run-e2e.mjs`, RED `suite.json`, `selfcheck-red.mjs` |
| `de6bbc6` | docs | `RUN-GATE.md` |

`plugins/lz-tdd`: **zero files** in the diff. No dependency added.

---

## What the captured transcript actually shows (D1 investigation)

Analysed `results/apply/invoke_skill/r1/run-1/outputs/transcript.stream.jsonl` (61 events, 57 KB,
gitignored, left in place and NOT committed).

Event inventory: `system/init` x1, `system/thinking_tokens` x32, `assistant` x17, `user` x7,
`rate_limit_event` x1, `system/task_started` x1, `system/task_notification` x1, `result/success` x1.

**The expanded slash command leaves exactly one observable trace, and it is not a firing signal.**
The `system/init` event advertises the session's reach:

```
slash_commands: [..., "lz-tdd:lz-red", "lz-tdd:lz-refactor", "lz-tdd:lz-tpp", ...]
skills:         [..., "lz-tdd:lz-red", "lz-tdd:lz-refactor", "lz-tdd:lz-tpp", ...]
plugins:        [{ name: "lz-tdd", path: "...", source: "lz-tdd@inline", version: "0.0.3" }]
```

Everything else was checked and is empty of signal: the `-p` prompt is never echoed as a `user`
event (all 7 `user` events are `tool_result`s); no `Skill` tool_use exists anywhere; the only other
`lz-*` mentions are in the final answer TEXT (events 60 and 61), where the model hands the green
step to `lz-tpp` by name -- an answer-quality signal the judge already owns, not a firing signal.
`system/task_started` / `task_notification` describe the PowerShell call, not a skill.

So the three facts are genuinely distinct and only two of them are in the stream:

- **(a) AVAILABLE** -- `system/init` `skills` + `slash_commands`. The only proof `--plugin-dir` worked.
- **(b) MODEL-FIRED** -- a `Skill` tool_use. Absent here, and correctly so.
- **(c) FORCED** -- **not in the transcript at all.** A forced run is transcript-indistinguishable
  from a run that never fired, so it can only be recorded by construction.

### The fix

`extractResult()` now returns `skills_available` (per tracked name, boolean, off the init event) and
`skills_model_fired` (per tracked name, count, off `Skill` tool_use blocks). `runOne()` records
`skill_forced` + `forced_skill` from the composed prompt -- by construction, never inferred.

Two deliberate design points:

1. **Model-fired counts the Skill call's own DESCRIPTOR, not the whole input blob.** In the pilot's
   own answer the model mentions `lz-tpp` while working on `lz-red`; the legacy blob probe reads
   that mention as `lz-tpp` firing. Measured on the committed fixture: legacy `used_skills` reports
   `{lz-red: 1, lz-tpp: 1}` where the descriptor-scoped count correctly reports `{lz-red: 1,
   lz-tpp: 0}`.
2. **Name matching is boundary-anchored.** The CLI reports `lz-tdd:lz-red`; the suite tracks
   `lz-red`. `lz-redux` in the same array must not count.

`used_skills` is **unchanged and still written** -- the lz-refactor suites and their captured
evidence read it. It is simply no longer the measurement.

### The tabulator

`autoTriggerRate` now derives from model-fired only, and `availableRate` + `forcedRate` are their
own columns. Expected reading per arm:

| arm | fired | avail | force |
|-----|-------|-------|-------|
| `with_skill` | the D-04 headline | 1.00 | 0.00 |
| `invoke_skill` | **0.00 by design** | 1.00 | 1.00 |
| `no_skill` | 0.00 | 0.00 | 0.00 |

The control is now meaningful without fabricating anything: `invoke_skill`'s value is `avail` 1.00 +
`force` 1.00, which proves the plugin loaded AND the detector is live -- and that is what licenses
reading a `with_skill` 0.00 as a real trigger gap instead of a broken instrument. Asserting a 1.00
auto-trigger there (as the battery used to) would report a model choice that never happened.

A `meta.json` predating the fix has no measurable trigger state, so `walkRuns` **fails closed** and
asks for a re-capture rather than defaulting the three rates to 0. Practical consequence: the
existing pilot capture will make a bare `tabulate-mechanical-red.mjs` throw until it is re-captured
by the approved second run. That is intentional and loud; the run dir is gitignored anyway.

### Committed fixture + regression (crux 4 no longer SKIPs)

`fixtures/transcripts/` (hand-authored, ~1 KB each, plus a README explaining why each detail is
load-bearing). The real 57 KB transcript was NOT committed.

- `slash-command.jsonl` -- the pilot shape: init advertises `lz-tdd:lz-red` (and `lz-redux` as a
  boundary decoy) but **not** `lz-tpp`, and there is no `Skill` tool_use anywhere. The missing
  `lz-tpp` gives availability a negative case in the same file, so a detector that answered `true`
  for every tracked name fails.
- `model-fired.jsonl` -- a genuine `Skill` tool_use for `lz-tdd:lz-red` whose `args` mention
  `lz-tpp` as a hand-off, pinning the descriptor-only rule.

Crux 4 asserts both key shapes, both availability directions, model-fired 0 vs 1, the descriptor
scoping, and the discrimination itself (the two fixtures must AGREE on availability and DIFFER on
model-fired). It still parses a real on-disk capture as an extra when one exists.

---

## D2 -- per-suite apply preamble

`run-e2e.mjs` is shared, so the default is untouched. `suite.json` may now declare
`"preambles": { apply | recommend }`, merged over `DEFAULT_PREAMBLE` at load. Per SUITE, never per
arm, so parity is structurally unaffected.

RED override (byte-identical across all three arms):

```
You are pair-programming with me. Read what I point you at and make the change in small steps.
After editing, typecheck the touched file(s) and run the affected tests, then tell me what you see.
Leave your edits in the working tree; do not commit. Here is my question:
```

Two clauses changed from the default: "make the improvement" -> "make the change", and "run the
affected tests to confirm nothing broke" -> "run the affected tests, then tell me what you see". It
still asks for a typecheck (the compile_error class depends on it), still forbids committing (the
runner diffs the working tree), names no smell / behavior / verdict, and makes no claim about the
tests staying green.

Guards: crux 2 (apply mode) asserts the override reaches composition, holds parity across the three
arms, keeps typecheck + never-commit, trips on 11 stay-green phrasings, and stays non-leading
(word-boundary matched over 12 tokens). Crux 6 pins the lz-refactor apply preamble BYTE-FOR-BYTE, so
editing the shared default in place instead of overriding per suite fails the battery.

---

## D3 -- gitignore

`mechanical-red.json` is the tabulator's rollup OF the already-ignored `results*/` tree, so it gets
the same lifetime as its inputs. Rule added next to the existing `results*/` line.

Noted for the record: the lz-refactor analog (`e2e-angular/mechanical.json`) IS tracked. That is a
different, deliberate choice -- frozen milestone evidence -- and was left alone.

---

## Anti-regression: every fix fails without it and passes with it

Proved by comparing PRE-FIX and POST-FIX logic on identical inputs. No env var, no flag, no disabled
guard.

| Fix | Method | Pre-fix | Post-fix |
|-----|--------|---------|----------|
| D1 detector | same two fixtures through `HEAD`'s `extractResult` vs the fixed one | no availability field, no model-fired field; `used_skills` false-positives `lz-tpp` from the args mention | availability with a negative case; model-fired 0 vs 1 |
| D1 tabulator | same (new) fixture through `HEAD`'s `aggregate`/`toRun` vs the fixed one | with_skill 0.60, invoke_skill **1.00** "auto-trigger", no avail/force columns | with_skill 0.40, invoke_skill 0.00, avail 1.00, force 1.00 |
| D2 preamble | RED suite composed with the `preambles` key stripped (byte-for-byte the previous `suite.json`) vs present | prompt carries "nothing broke" -- crux 2 fails | phrase gone, typecheck + never-commit retained -- crux 2 passes |
| D3 gitignore | same path in two throwaway repos, `HEAD` rules vs new rules | `ignored=false` | `ignored=true` |

The tabulate fixture makes the legacy `used_skills` counts **diverge from** `skills_model_fired` on
purpose (with_skill 3/5 vs 2/5; invoke_skill 3/3 vs 0/3), so a regression to reading `used_skills`
fails the selfcheck instead of passing quietly with the pilot's misleading numbers.

## No lz-refactor regression

- **216 composed lz-refactor prompts** across all 9 suites (`e2e-angular/{cdk,cli,core,heldout,
  heldout-enum,heldout-precision}`, `e2e-gilded-rose`, `e2e-nx`, `e2e-reference`), both modes, all
  three arms, every prompt -- byte-identical to `55a5d17`. (Only the `-p` value is compared; the
  pre-fix runner executes from a temp dir so its `--plugin-dir` path is a harness artifact.)
- `selfcheck-code-review.mjs` (the lz-refactor battery, which also drives the nx and kata repos):
  exit 0.
- `skillFlag()` falls back to the legacy wording when the new keys are absent, so `--report` over
  already-captured lz-refactor results prints exactly as before.

---

## Definition of done

All six offline commands exit 0:

| Command | Exit |
|---------|------|
| `grade-red.mjs --selfcheck` | 0 |
| `tabulate-mechanical-red.mjs --selfcheck` | 0 |
| `merge-judge.mjs --selfcheck` | 0 |
| `selfcheck-red.mjs` | 0 |
| `check-evals.mjs` | 0 |
| `claude plugin validate .` | 0 |

Plus:

- crux 4 no longer SKIPs; the detector provably distinguishes available / model-fired / forced.
- the lz-refactor preamble is byte-identical (pinned by crux 6, and verified across 216 prompts).
- **kata pristine**: `git status --porcelain` empty, exactly one worktree entry (`main`, `3e0085b`),
  `TypeScript/node_modules` 308 entries, no `review-*` branch. No named branch was ever created on it.
- `plugins/lz-tdd`: zero files in the diff.
- ASCII-clean and email-allowlist-clean across all 10 changed files, all 4 commit messages, and all
  4 commit author/committer identities (allowlist-inversion; the forbidden value is never written).
- working tree clean.

Note: `selfcheck-red.mjs` needs the workspace toolchain (`npm ci --prefix
.claude/skills/lz-red-workspace`) -- `node_modules` is gitignored, so a fresh worktree has none and
`grade-red --selfcheck` fails with a vitest resolution error until it is installed. Not a defect;
recorded because it costs a confusing minute in any fresh checkout.

---

## Open items for the orchestrator

1. **The existing pilot `meta.json` is now un-tabulatable** (fails closed by design). Either
   re-capture it in the approved second metered run or delete the stale run dir first.
2. **`invoke_skill` will read `fired` 0.00 in the next round too.** That is the correct, expected
   reading. Judge the arm by `avail` 1.00 + `force` 1.00, and treat `avail` 0.00 there as a hard stop.
3. **Calibration for scoping the fan-out** is recorded in `RUN-GATE.md` Step 1: $0.54 / 85 s / 8
   turns per run, so 1 target x 3 arms x k=3 is ~$4.90 and ~13 min serial. Treat as a floor -- the
   pilot was one forced run that reached a correct answer in 8 turns.
