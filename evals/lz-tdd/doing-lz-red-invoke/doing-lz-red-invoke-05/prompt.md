---
tags: [doing, lz-red, red-step]
max_turns: 12
allowed_tools: [Read, Glob, Grep, Skill]
---

/lz-tdd:lz-red `PriceCalculator` in `src/price-calculator.ts` has no tests and reads `Date.now()` directly deep inside `computeDue()`. I want to add a late fee for invoices still unpaid after their due date. get a first test around it, then write the failing test for the late fee in `src/price-calculator.test.ts`. leave the calculator itself alone for now.
