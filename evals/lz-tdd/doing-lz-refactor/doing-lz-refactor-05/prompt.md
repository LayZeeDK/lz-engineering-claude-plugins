---
tags: [doing, lz-refactor, refactor-step]
max_turns: 20
allowed_tools: [Read, Glob, Grep, Skill]
---

tests green. my `Document` class in `src/document.ts` is full of conditionals on `this.status` that both decide what an action is allowed to do right now AND set which status comes next (draft -> moderation -> published). adding a status means touching all of them. refactor it.
