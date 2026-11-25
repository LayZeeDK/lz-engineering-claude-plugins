---
tags: [doing, lz-refactor, refactor-step]
max_turns: 20
allowed_tools: [Read, Glob, Grep, Skill]
---

tests are green. the SAME `switch (shape.kind)` (circle / square / triangle) appears in three separate functions in `src/shapes.ts` -- `area(shape)`, `perimeter(shape)`, and `boundingBox(shape)` -- so adding a new shape means editing all three switches. tests pass. refactor it.
