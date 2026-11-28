---
tags: [trigger, lz-refactor, fire, forward]
max_turns: 10
allowed_tools: [Read, Glob, Grep, Skill]
disallowed_tools: [Agent]
---

`groupImports` in `packages/eslint-plugin/src/utils/runtime-lint-utils.ts` took me a while to follow. the tests pass. how would you make it easier to read?
