---
tags: [doing, lz-refactor, refactor-step]
max_turns: 20
allowed_tools: [Read, Glob, Grep, Skill]
---

tests are green. `SavingsAccount` and `CheckingAccount` in `src/accounts.ts` both extend `Account` and each has an identical `validateWithdrawal(amount)` method -- same body, copy-pasted into both siblings. remove that duplication.
