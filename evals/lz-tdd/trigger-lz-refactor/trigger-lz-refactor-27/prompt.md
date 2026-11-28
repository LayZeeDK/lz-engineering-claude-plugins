---
tags: [trigger, lz-refactor, quiet, forward, chunk]
max_turns: 10
allowed_tools: [Read, Glob, Grep, Skill]
disallowed_tools: [Agent]
---

i've got a failing test `expect(parseTag('a:b')).toEqual({ scope: 'a', name: 'b' })` and `parseTag` currently just returns `null`. what refactoring gets it to pass?
