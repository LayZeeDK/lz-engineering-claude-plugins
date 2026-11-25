---
tags: [trigger, lz-refactor, quiet, forward, chunk]
max_turns: 3
allowed_tools: [Read, Glob, Grep, Skill]
---

i've got a failing test `expect(parseTag('a:b')).toEqual({ scope: 'a', name: 'b' })` and `parseTag` currently just returns `null`. what refactoring gets it to pass?
