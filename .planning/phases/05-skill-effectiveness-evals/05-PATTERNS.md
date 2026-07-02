# Phase 5: Skill Effectiveness Evals - Pattern Map

**Mapped:** 2026-07-02
**Files analyzed:** 7 (6 created + 1 modified)
**Analogs found:** 7 / 7 (5 external skill-creator schema/logic, 2 in-repo)

## Honest framing

This is a DATA-authoring phase, not application code. Files created are eval
DATA (JSON query sets + scenarios + per-scenario metadata), one small
deterministic grader script, a results doc, and a `.gitignore` entry. The
authoritative pattern source is the INSTALLED skill-creator plugin (outside
this repo's git index -- read via `Read`/`rg`, never `git grep`). There are NO
prior eval sets in this repo, so most "analogs" are external schema/logic
contracts. In-repo analogs are limited to JSON formatting conventions (two
manifest files), the existing `.gitignore`, and the ASCII-only committed-content
rule. Where an analog is external-only, this document says so plainly rather
than manufacturing a false in-repo match.

**External skill-creator dir (native):**
`C:/Users/LarsGyrupBrinkNielse/.claude/plugins/marketplaces/claude-plugins-official/plugins/skill-creator/skills/skill-creator`

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `evals/trigger-eval.json` | eval-data (config) | batch input to `run_loop.py` | `run_eval.py` array `[{query, should_trigger}]` (external, RESEARCH 223-230); format from `.claude-plugin/marketplace.json` | external-schema |
| `evals/trigger-smoke.json` | eval-data (config) | batch input to `run_eval.py` | 2-query subset of `trigger-eval.json` | exact (sibling subset) |
| `evals/evals.json` | eval-data (config) | batch input to behavior harness | `schemas.md` evals.json (external, lines 7-36) | external-schema |
| `lz-tpp-workspace/iteration-1/eval-<N>-<slug>/eval_metadata.json` | eval-data (config) | batch input to `aggregate_benchmark.py` | `aggregate_benchmark.py` eval_id derivation (lines 86-98) + RESEARCH 326-338 | external-schema |
| deterministic grader (`.mjs`) | utility / script | transform + file-I/O (reads transcript + metrics + metadata -> writes `grading.json`) | `agents/grader.md` (logic) + grading.json contract (`schemas.md` 86-149) + consumer `aggregate_benchmark.py` 130-169. NO in-repo `.mjs` exists | role-match (external logic, net-new script) |
| `EVAL-RESULTS.md` | doc (results) | n/a | `aggregate_benchmark.py` `generate_markdown()` summary table (281-335) + Pass@k/Pass^k formulas (RESEARCH 380-384 / CLAUDE.md) | partial (external structure) |
| `.gitignore` (modify) | config | n/a | existing `.gitignore` (in-repo) | exact (in-repo) |

## Pattern Assignments

### `evals/trigger-eval.json` and `evals/trigger-smoke.json` (eval-data, batch)

**Analog:** external `run_eval.py`/`run_loop.py` input schema. This is a plain
JSON ARRAY and is DISTINCT from `evals.json` (which is an object). The schema is
NOT in `schemas.md` -- it is only defined by what the scripts read. Confirmed
shape (RESEARCH 223-230):

```json
[
  {"query": "the user prompt text", "should_trigger": true},
  {"query": "another prompt", "should_trigger": false}
]
```

- `trigger-smoke.json` = a 2-query subset (one obvious should-trigger + one
  near-miss) for the mandatory WSL interop smoke test before the full loop.
- The full 20-query candidate set is ready-to-use in RESEARCH 280-303 (10
  should-trigger + 10 genuinely-tricky near-misses). D-02 grants discretion on
  final wording.
- **Formatting analog (in-repo):** two-space indent, straight quotes, ASCII-only
  arrows (`->`) inside query strings, matching `.claude-plugin/marketplace.json`.

**In-repo JSON formatting analog** (`.claude-plugin/marketplace.json` lines 1-17):
```json
{
  "name": "lz-engineering-claude-plugins",
  "owner": {
    "name": "Lars Gyrup Brink Nielsen",
    "email": "larsbrinknielsen@gmail.com"
  }
}
```
Copy: 2-space indent, `larsbrinknielsen@gmail.com` public email if any contact
field appears (NEVER the work email -- MEMORY allowlist gate), ASCII throughout.

---

### `evals/evals.json` (eval-data, batch)

**Analog:** external `schemas.md` evals.json (lines 7-36) -- the AUTHORITATIVE
shape. Object (not array). Field names are load-bearing.

**Schema excerpt** (`schemas.md` lines 11-27):
```json
{
  "skill_name": "example-skill",
  "evals": [
    {
      "id": 1,
      "prompt": "User's example prompt",
      "expected_output": "Description of expected result",
      "files": ["evals/files/sample1.pdf"],
      "expectations": [
        "The output includes X",
        "The skill used script Y"
      ]
    }
  ]
}
```

Apply for lz-tpp: `skill_name: "lz-tpp"`, `evals[]` = the 7 ready-to-use
behavior scenarios in RESEARCH 365-378 (fib-nothing-to-constant,
fib-split-base-case, fib-prefer-tail-recursion, sum-deep-input-stacksafe,
flatten-tree-no-tail, wordwrap-impasse-backtrack, refactor-not-transformation).
Each `prompt` = red test + current code; each `expectations[]` string-matches
a NAMED transformation (e.g. `(constant -> scalar)`) PLUS the cross-cutting
"coach, don't drive" assertion (no Edit/Write, no test run). Ground truth is
LIFTED from the locked references -- do not re-derive (RESEARCH 187).

---

### `lz-tpp-workspace/iteration-1/eval-<N>-<slug>/eval_metadata.json` (eval-data, batch)

**Analog:** external. Field names verbatim in RESEARCH 326-338; the reason the
`eval-<N>-<slug>` DIR-NAME prefix matters is in `aggregate_benchmark.py`.

**eval_id-derivation pattern** (`aggregate_benchmark.py` lines 86-98) -- why the
directory prefix and metadata field must agree:
```python
for eval_idx, eval_dir in enumerate(sorted(search_dir.glob("eval-*"))):
    metadata_path = eval_dir / "eval_metadata.json"
    if metadata_path.exists():
        eval_id = json.load(mf).get("eval_id", eval_idx)
    else:
        eval_id = int(eval_dir.name.split("-")[1])   # falls back to the "-N-" prefix
```
So: dir MUST start with `eval-` (the `glob("eval-*")`), the `-<N>-` prefix must
be an int, and `eval_metadata.json` carries the same `eval_id`. Shape to write
(RESEARCH 326-338):
```json
{
  "eval_id": 0,
  "eval_name": "fib-prefer-tail-recursion",
  "prompt": "The user's task prompt",
  "assertions": ["...", "...", "..."]
}
```

---

### deterministic grader script (utility, transform + file-I/O) -- NET-NEW, no in-repo analog

**Language:** Node.js ESM `.mjs` -- the project default for PERMANENT/reusable
scripts (D-04 calls the deterministic assertions "reusable across iterations").
`grading.json` is language-agnostic, so `.mjs` interoperates cleanly with the
Python harness. NOTE the tension plainly: the skill-creator harness scripts are
Python stdlib-only; if the planner would rather keep one runtime, a stdlib-only
`.py` matching `aggregate_benchmark.py`'s style is a valid alternative. Either
way the OUTPUT contract below is fixed.

**Logic analog:** `agents/grader.md` (the LLM-grader this script replaces for the
deterministic checks). D-04 says grade deterministically first (string-match the
named transformation + a "coach, don't drive" check); use the `grader.md`
subagent only for rationale quality where a string match is insufficient.

**Output contract (LOAD-BEARING)** -- `grading.json`, `schemas.md` lines 90-109:
```json
{
  "expectations": [
    {
      "text": "The recommendation names (statement -> tail-recursion)",
      "passed": true,
      "evidence": "Output line: 'Apply (statement -> tail-recursion) #9 ...'"
    }
  ],
  "summary": { "passed": 2, "failed": 0, "total": 3, "pass_rate": 0.67 }
}
```

**Why the field names are non-negotiable** -- consumer `aggregate_benchmark.py`:
- Reads summary fields exactly (lines 130-133):
```python
"pass_rate": grading.get("summary", {}).get("pass_rate", 0.0),
"passed": grading.get("summary", {}).get("passed", 0),
"failed": grading.get("summary", {}).get("failed", 0),
"total": grading.get("summary", {}).get("total", 0),
```
- WARNS (blank viewer) if an expectation lacks `text`/`passed` (lines 158-160):
```python
for exp in raw_expectations:
    if "text" not in exp or "passed" not in exp:
        print(f"Warning: expectation ... missing required fields (text, passed, evidence): {exp}")
```

**The "coach, don't drive" check** reads the executor's `metrics.json`
(`schemas.md` 163-193) for `tool_calls.Edit`/`tool_calls.Write` counts and scans
the transcript for a Bash test invocation. Pattern from the RESEARCH grading
example (RESEARCH 345): `"evidence": "metrics.json shows Edit=0, Write=0; no Bash
test invocation in transcript"`. Assert Edit==0 AND Write==0 AND no test run.

**Deliberate simplification:** the deterministic grader only needs `expectations[]`
+ `summary{}`. The richer optional blocks in the full schema
(`execution_metrics`, `timing`, `claims`, `user_notes_summary`, `eval_feedback`)
are OPTIONAL for aggregate -- it reads timing from a sibling `timing.json` if
absent from grading (lines 136-147). Emit `timing.json` separately per D-05
(one-shot capture at completion). Skip the LLM-only blocks unless the judged
rationale pass runs. `<!-- ponytail: minimal grading.json; add claims/eval_feedback only if the grader.md judged pass is invoked -->`

---

### `EVAL-RESULTS.md` (doc, results summary)

**Analog:** external `aggregate_benchmark.py` `generate_markdown()` (lines
281-335) for the summary-table shape, plus the Pass@k/Pass^k reporting contract
(RESEARCH 380-384, restated from CLAUDE.md). No in-repo results-doc analog
exists yet.

**Benchmark summary-table pattern** (`generate_markdown` lines 302-323) --
mirror this Metric x config x Delta table, ASCII `+/-` for stddev (the script
uses a Unicode `±`; in this repo write `+/-` per the ASCII-only rule):
```
| Metric | With Skill | Without Skill | Delta |
|--------|------------|---------------|-------|
| Pass Rate | ...% +/- ...% | ...% +/- ...% | +0.50 |
| Time | ...s +/- ...s | ...s +/- ...s | +13.0s |
```

**Pass@k / Pass^k tables** (RESEARCH 380-384): n = runs for the eval, c = fully
passing runs. Pass@k (optimistic) = `1 - C(n-c, k)/C(n, k)`; Pass^k
(conservative) = `C(c, k)/C(n, k)`. Report per-eval (that eval's n) AND overall.
k = 1, 3, 5, total; cap k at n. Skip trivial rows where both configs are 1.0.
Flag any eval with Pass@1 == 1.0 for BOTH configs as saturated/non-discriminating.

**Committed per D-08:** commit `EVAL-RESULTS.md` + the eval sets +
`benchmark.json`/`.md`; keep bulky iteration transcripts out of the shipped
surface (`.gitignore` entry below or scratchpad).

---

### `.gitignore` (modify, config)

**Analog:** the existing `.gitignore` (in-repo, read in full).

**Current content** (all 19 lines): sections for Dependencies, Build output,
Logs (`*.log`), OS noise, Editor. The bulky-transcript exclusion (D-08) is NOT
yet covered.

**Add a section** (keep the existing header/blank-line style):
```
# Phase 5 eval raw transcripts (D-08: keep bulky raw runs out of the shipped surface)
.planning/phases/05-skill-effectiveness-evals/lz-tpp-workspace/**/outputs/
.planning/phases/05-skill-effectiveness-evals/trigger-workspace/
```
Commit the eval sets, `eval_metadata.json`, `grading.json`, `benchmark.json`/`.md`,
and `EVAL-RESULTS.md`; ignore only the bulky raw run `outputs/` and the trigger
workspace transcripts. Adjust the exact globs to what the planner decides to keep
vs. drop -- the principle (commit sets + summary + benchmark; drop raw transcripts)
is the load-bearing part. `git grep` cannot see ignored paths, so verify the
committed surface with `git status`/`rg`, not `git grep`.

## Shared Patterns

### ASCII-only committed content
**Source:** CLAUDE.md (project + global), repo convention across all phases.
**Apply to:** ALL files (JSON query strings, grader evidence strings, results doc).
Use `->` for arrows (matches the transformation names like `(constant -> scalar)`),
straight quotes, `+/-` not the Unicode `±`, no emojis, no em-dashes. The
transformation NAMES the assertions string-match are already ASCII (`({} -> nil)`,
`(statement -> tail-recursion)`), so this aligns naturally.

### JSON formatting
**Source:** `.claude-plugin/marketplace.json`, `plugins/lz-tdd/.claude-plugin/plugin.json`.
**Apply to:** all `.json` files created. Two-space indent, straight quotes,
trailing newline, no comments (plain JSON, not JSONC).

### grading.json field contract
**Source:** `agents/grader.md` (108-183) + `schemas.md` (86-149), enforced by
`aggregate_benchmark.py` (130-169).
**Apply to:** the deterministic grader script's output. Emit exactly
`{"expectations":[{"text","passed","evidence"}], "summary":{"passed","failed","total","pass_rate"}}`.
Using `name`/`met`/`details` instead of `text`/`passed`/`evidence` makes the
viewer/aggregate warn and blank (RESEARCH Pitfall 4).

### workspace directory + config-literal contract
**Source:** `aggregate_benchmark.py` globbing (86, 105, 111) + RESEARCH 141-167.
**Apply to:** the `lz-tpp-workspace` layout. Dir prefix `eval-<N>-<slug>`; config
dir name EXACTLY `with_skill` / `without_skill` (the viewer color-codes on that
literal); run dirs `run-<K>`; each run dir holds `outputs/`, `grading.json`,
`timing.json`. `pass_rate` MUST be nested under `result` (aggregate builds it at
lines 242-251), never top-level.

### timing capture is one-shot
**Source:** `schemas.md` timing.json note (line 201), D-05, CLAUDE.md.
**Apply to:** every behavior run. `total_tokens`/`duration_ms` arrive only in the
subagent completion notification and are unrecoverable later -- write each
`timing.json` as its notification arrives, THEN grade. Wait for ALL completions
before grading/aggregating.

## No Analog Found (in-repo)

Files whose pattern is EXTERNAL-only (skill-creator) or net-new -- the planner
should copy from the cited external source, not force an in-repo match:

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `evals/trigger-eval.json` schema | eval-data | batch | The `[{query, should_trigger}]` array schema exists only in `run_eval.py`/`run_loop.py`; no `schemas.md` entry and no prior in-repo eval set. In-repo analog covers FORMATTING only. |
| deterministic grader `.mjs` | utility | transform | No `.mjs` script exists anywhere in this repo. Logic analog is external (`grader.md`); output contract is external (`schemas.md`/`aggregate_benchmark.py`). Script is net-new. |
| `EVAL-RESULTS.md` | doc | n/a | No prior eval/results doc in this repo. Structure borrows from the external `generate_markdown()` table + Pass@k formulas. |

## Metadata

**Analog search scope:**
- In-repo: `.claude-plugin/marketplace.json`, `plugins/lz-tdd/.claude-plugin/plugin.json`, `.gitignore`, `plugins/lz-tdd/skills/lz-tpp/SKILL.md` (description = EVAL-01 target), `**/*.mjs` (none found).
- External skill-creator (read via `Read`, outside git index): `references/schemas.md`, `agents/grader.md`, `scripts/aggregate_benchmark.py`, `scripts/` listing.
**Files scanned:** 6 read in full + 1 directory listing.
**Pattern extraction date:** 2026-07-02

## PATTERN MAPPING COMPLETE
