---
tags: [doing, lz-tpp, green-step]
max_turns: 12
allowed_tools: [Read, Glob, Grep, Skill]
---

/lz-tdd:lz-tpp stuck. the red test in `src/wrap.test.ts` is `expect(wrap('word wrap', 8)).toEqual(['word', 'wrap'])` and `wrap` in `src/wrap.ts` is empty. it looks like i have to write the whole wrap algorithm to pass it. make the smallest move that gets me going.
