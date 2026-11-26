---
tags: [trigger, lz-refactor, fire, forward, rec-f23c7f8, baseline]
max_turns: 10
allowed_tools: [Read, Glob, Grep, Skill]
disallowed_tools: [Agent]
---

tests are green. `Invoice.describe()` only ever reads a Customer's name, tier and address and barely touches Invoice itself. is there a named refactoring for that?
