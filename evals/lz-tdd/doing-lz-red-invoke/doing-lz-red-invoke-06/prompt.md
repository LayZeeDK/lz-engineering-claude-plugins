---
tags: [doing, lz-red, red-step]
max_turns: 12
allowed_tools: [Read, Glob, Grep, Skill]
---

/lz-tdd:lz-red I wrote this as my next red test in `src/apply-discount.test.ts` but it went green on the very first run:

```ts
it('should return a number', () => {
  expect(typeof applyDiscount(100, 10)).toBe('number');
});
```

`applyDiscount` in `src/apply-discount.ts` is still `return total;`. fix the test so it is a real red test.
