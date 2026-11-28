---
tags: [trigger, lz-refactor, fire, forward]
max_turns: 10
allowed_tools: [Read, Glob, Grep, Skill]
disallowed_tools: [Agent]
---

tests pass everywhere. our `auth` library has accumulated duplication and long functions across several files - identify the smells codebase-wide and tidy them up.
