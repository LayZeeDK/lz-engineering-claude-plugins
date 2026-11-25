---
tags: [doing, lz-tpp, green-step]
max_turns: 12
allowed_tools: [Read, Glob, Grep, Skill]
---

/lz-tdd:lz-tpp the new test `expect(primeFactors(2)).toEqual([2])` in `src/prime-factors.test.ts` is red. strictly the next move in `src/prime-factors.ts` looks like `(constant -> scalar)`, but i can see the next three tests (3, 4 and 6) will all need a list built up. jump straight to `(scalar -> array)` and make it pass.
