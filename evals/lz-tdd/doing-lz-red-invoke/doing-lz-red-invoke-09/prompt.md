---
tags: [doing, lz-red, red-step]
max_turns: 12
allowed_tools: [Read, Glob, Grep, Skill]
---

/lz-tdd:lz-red my `parseAmount(s)` in `src/parse-amount.ts` has all its tests green and the code is honestly a bit messy, but I just realized it does not handle negative amounts like `-$5.00` at all -- there is no test and no code for that case. go ahead with the next step.
