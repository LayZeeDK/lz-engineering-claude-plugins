---
tags: [doing, lz-refactor, refactor-step]
max_turns: 20
allowed_tools: [Read, Glob, Grep, Skill]
---

/lz-tdd:lz-refactor green. `price(order)` in `src/price.ts` has a big if/else that picks a WHOLE pricing algorithm by customer segment (retail vs wholesale vs promo) -- each branch is a self-contained calculation and i want to add and vary those algorithms independently of the code that runs them. tests pass. refactor it.
