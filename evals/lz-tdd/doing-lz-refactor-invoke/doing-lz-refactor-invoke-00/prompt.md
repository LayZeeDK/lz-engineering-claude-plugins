---
tags: [doing, lz-refactor, refactor-step]
max_turns: 20
allowed_tools: [Read, Glob, Grep, Skill]
---

/lz-tdd:lz-refactor all tests pass. `processOrder(order)` in `src/process-order.ts` validates the cart, then computes line totals and tax in the middle, then formats a receipt string at the end, all inline in one body. i keep scrolling to follow it. tests are green -- refactor it.
