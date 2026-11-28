---
tags: [trigger, lz-refactor, fire, forward, rec-f23c7f8]
max_turns: 10
allowed_tools: [Read, Glob, Grep, Skill]
disallowed_tools: [Agent]
---

tests pass. i've got ~12 near-identical methods each handling one combination of {currency, taxRegion, rounding}, and adding a currency means adding a dozen more. what refactoring gets me out of this?
