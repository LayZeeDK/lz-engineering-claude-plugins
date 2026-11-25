---
tags: [doing, lz-red, red-step]
max_turns: 12
allowed_tools: [Read, Glob, Grep, Skill]
---

/lz-tdd:lz-red test-driving a `ShoppingCart` in `src/shopping-cart.ts` whose incoming command `addItem(item)` changes its contents, observable through the public query `items()`. no outgoing collaborators. write the failing test for adding an item in `src/shopping-cart.test.ts`.
