---
tags: [doing, lz-tpp, green-step]
max_turns: 12
allowed_tools: [Read, Glob, Grep, Skill]
---

/lz-tdd:lz-tpp `flatten(list)` in `src/flatten.ts` flattens arbitrarily nested arrays. it passes for shallow input like `[1, [2, 3]]` with plain recursion, but the new test on deeply nested input in `src/flatten.test.ts` overflows the stack. make it pass.
