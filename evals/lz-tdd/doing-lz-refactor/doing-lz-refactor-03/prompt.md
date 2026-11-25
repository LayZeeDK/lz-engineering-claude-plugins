---
tags: [doing, lz-refactor, refactor-step]
max_turns: 20
allowed_tools: [Read, Glob, Grep, Skill]
---

all green. `Invoice.total()` in `src/invoice.ts` reads almost entirely from the `Customer` it holds -- `customer.discountRate`, `customer.taxRegion`, `customer.loyaltyTier` -- and barely touches any Invoice field of its own. tests pass. refactor it.
