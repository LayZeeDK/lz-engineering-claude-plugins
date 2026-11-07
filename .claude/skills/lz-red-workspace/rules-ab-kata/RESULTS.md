# User-scope lz-tdd rules A/B (2026-11-07)

Slim `claude -p` via run-slim.ts, Opus 5.5, cwd `D:/tmp/slim-claude-p/rules-ab/runs/<arm>-<k>` (outside home),
lz-tdd packaged at d02204d by run-ab.sh, k=3 per arm, alternating a,b,a,b,a,b. Task: shippingCost kata (task.md),
hidden acceptance suite of 15 tests. Arm A: plugin only (`--rules none`). Arm B: plus `rules-b/CLAUDE.md` (the
lars-mode Test-first bullet) and `rules-b/test-first.md`. For arm B, `--rules` now points at the folder
`../slim-arms.sh` generates.

Isolation, measured with a context probe (not landed): A loaded no memory file; B loaded only rules-b/CLAUDE.md; no
user skill or command in any listing.

| Run | Cost | Min | Turns | lz-red/tpp/refactor calls | Spec tests | Max tests per spec edit | Cycle log | Hidden | tsc |
|---|---|---|---|---|---|---|---|---|---|
| a-1 | $0.44 | 1.8 | 32 | 1/1/0 | 8 | 2 | none | 15/15 | clean |
| a-2 | $0.51 | 1.7 | 37 | 1/1/0 | 9 | 2 | none | 15/15 | clean |
| a-3 | $0.52 | 1.8 | 37 | 1/1/0 | 7 | 1 | none | 15/15 | clean |
| b-1 | $2.63 | 5.4 | 132 | 8/8/8 | 11 | 3 | 11 lines | 15/15 | clean |
| b-2 | $2.78 | 5.0 | 135 | 8/8/8 | 11 | 3 | 11 lines | 15/15 | clean |
| b-3 | $2.29 | 4.0 | 113 | 7/7/7 | 9 | 3 | 9 lines | 15/15 | clean |

B's cycle logs were written to the harness folder and its rules folder, not beside the run folder; grade.mjs
reported "-" for them, corrected by hand. grade.mjs now searches the rules folder and its parent as well.
B's max of 3 is one edit per run adding 3 `test-after` tests that passed on first run (logged as test-after);
A's 2s are two failing tests landing in one edit.

## Verdict

- Process: B follows the rule 3/3 (all three skills every cycle, a cycle log, refactor step considered and declined
  or applied with reasons); A 0/3 (each skill called once, then a plain loop; lz-refactor never called; no log).
- Outcome: no measurable difference. Hidden suite Pass@3 and Pass^3 = 1.00 in both arms; tsc clean in all six. Both
  arms flagged the NaN-weight gap in their reports. The kata is below Opus's ceiling, so it cannot show an outcome
  lift.
- Cost: B median $2.63 vs A $0.51 (5.2x); time 5.0 vs 1.8 min (2.8x). Ranges do not overlap. Limiter: turn count
  (113-135 vs 32-37), driven by three Skill calls per cycle. k=3, below the checklist's 5; the gap is far above
  run-to-run spread. Matches the tainted pilot (4.8x cost, 2.9x time), so the global-CLAUDE.md leak did not change it.
