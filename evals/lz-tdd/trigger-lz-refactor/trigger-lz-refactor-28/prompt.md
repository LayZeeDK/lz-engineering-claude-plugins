---
tags: [trigger, lz-refactor, quiet, forward, chunk]
max_turns: 10
allowed_tools: [Read, Glob, Grep, Skill]
disallowed_tools: [Agent]
---

green across the `api` package - now go through every route module and add request-validation and rate-limiting to each one.
