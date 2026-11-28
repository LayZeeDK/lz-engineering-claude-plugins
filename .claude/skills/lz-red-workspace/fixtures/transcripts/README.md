# Transcript fixtures for the trigger detector (selfcheck-red crux 4)

Two hand-authored, minimal stream-json transcripts that pin the three trigger facts
`extractResult()` must keep separate. Real captures are gitignored
(`.claude/skills/*-workspace/**/*.stream.jsonl`) and are never committed, so crux 4 used to SKIP
outright; these fixtures give it a permanent, zero-spend regression instead.

| File | Shape | `skills_available` | `skills_model_fired` |
|------|-------|--------------------|----------------------|
| `slash-command.jsonl` | the `invoke_skill` arm: the CLI expanded `/lz-tdd:lz-red ` at prompt-processing time, so there is NO `Skill` tool_use anywhere in the stream | `lz-red` true, `lz-tpp` false | both 0 |
| `model-fired.jsonl` | the genuine auto-trigger: the model CHOSE to call the skill, producing a `Skill` tool_use | both true | `lz-red` 1, `lz-tpp` 0 |

Why each detail is load-bearing:

- **`slash-command.jsonl` reproduces the 2026-07-25 pilot blind spot.** The detector saw no
  `tool_use` naming the skill and reported a 0.00 auto-trigger rate for a forced run in which the
  skill demonstrably loaded. Availability comes from the `system/init` event, which is the only
  transcript evidence that `--plugin-dir` took effect. Forcing itself is NOT in the stream at all --
  `run-e2e.mjs` records it by construction as `meta.skill_forced`.
- **`slash-command.jsonl` advertises `lz-tdd:lz-red` but not `lz-tpp`.** That gives availability a
  negative case in the same file: a detector that returned `true` for every tracked name would pass
  the positive assertion and fail this one.
- **The `Skill` call in `model-fired.jsonl` mentions `lz-tpp` in its `args`.** Only the call's own
  descriptor may count, so `lz-tpp` must stay at 0. Counting the whole input blob would read a
  hand-off mention as the sibling skill having fired.
- **Namespaced entries with bare tracked names.** The CLI reports `lz-tdd:lz-red`; the suite tracks
  `lz-red`. The match is boundary-anchored, so `lz-redux` in the same init array must not count.

Keep these tiny and hand-authored. Do not paste a real capture in (the 2026-07-25 pilot transcript
is ~57 KB and is gitignored by policy).
