---
tags: [doing, lz-red, red-step]
max_turns: 12
allowed_tools: [Read, Glob, Grep, Skill]
---

doing TDD on `isEven` in `src/is-even.ts`. one test is green -- `expect(isEven(0)).toBe(true)` -- but the implementation is literally `return true`. write the next failing test in `src/is-even.test.ts` to drive out the real behavior.
