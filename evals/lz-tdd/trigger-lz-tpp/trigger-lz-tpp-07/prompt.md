---
tags: [trigger, lz-tpp, fire, forward, chunk, rec-5f586da]
max_turns: 3
allowed_tools: [Read, Glob, Grep, Skill]
---

my flatten() passes for [1,[2,3]] but the new test on a deeply nested input blows the stack. whats the minimal change to make it pass - tail recursion or a while loop?
