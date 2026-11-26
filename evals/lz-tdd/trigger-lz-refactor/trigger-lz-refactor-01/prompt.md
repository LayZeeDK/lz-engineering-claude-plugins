---
tags: [trigger, lz-refactor, fire, forward, rec-f23c7f8, baseline]
max_turns: 10
allowed_tools: [Read, Glob, Grep, Skill]
disallowed_tools: [Agent]
---

all tests pass, but this 60-line `processOrder()` does five different things and i keep scrolling to follow it. whats the refactoring here?
