---
tags: [doing, lz-tpp, green-step]
max_turns: 12
allowed_tools: [Read, Glob, Grep, Skill]
---

/lz-tdd:lz-tpp `sum(n)` in `src/sum.ts` adds 1..n and the base case is done. the new test `expect(sum(1_000_000)).toBe(500000500000)` in `src/sum.test.ts` blows the stack with my recursive version. make it pass.
