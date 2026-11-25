---
tags: [doing, lz-refactor, refactor-step]
max_turns: 20
allowed_tools: [Read, Glob, Grep, Skill]
---

green bar. `Config` in `src/config.ts` is a Singleton -- private constructor, static `getInstance()` -- and every module reaches into `Config.getInstance()` globally, which hides the dependency and makes tests painful. nothing actually needs a single-instance policy. tests pass. refactor it.
