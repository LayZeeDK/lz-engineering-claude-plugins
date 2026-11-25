---
tags: [doing, lz-red, red-step]
max_turns: 12
allowed_tools: [Read, Glob, Grep, Skill]
---

`Gate` in `src/gate.ts` has an incoming query `isOpen()` and a command `openGate()` that flips its state. `openGate()` should also send `'opened'` to the notifier injected in the constructor, and it does not yet. I was about to mock the notifier AND stub `isOpen`. write the failing test for the notification in `src/gate.test.ts`.
