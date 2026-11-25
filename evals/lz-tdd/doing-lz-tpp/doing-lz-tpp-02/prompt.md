---
tags: [doing, lz-tpp, green-step]
max_turns: 12
allowed_tools: [Read, Glob, Grep, Skill]
---

fibonacci `of(n)` in `src/fibonacci.ts`: the base cases 0 and 1 are handled and it returns 1 for every n > 1. the new test `expect(of(3)).toBe(2)` in `src/fibonacci.test.ts` is red. make it pass -- tail recursion or plain recursion?
