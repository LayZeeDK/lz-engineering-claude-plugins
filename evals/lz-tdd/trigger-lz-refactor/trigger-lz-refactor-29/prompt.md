---
tags: [trigger, lz-refactor, quiet, forward, chunk]
max_turns: 10
allowed_tools: [Read, Glob, Grep, Skill]
disallowed_tools: [Agent]
---

the whole `reporting` module is green but slow. sweep the package and rewrite the hot paths to be faster - i want to halve the current latency.
