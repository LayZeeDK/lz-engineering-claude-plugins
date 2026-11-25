---
tags: [doing, lz-red, red-step]
max_turns: 12
allowed_tools: [Read, Glob, Grep, Skill]
---

/lz-tdd:lz-red here is a new pure function in `src/slugify.ts` I have not tested yet:

```ts
export function slugify(title: string): string {
  return title.trim().toLowerCase().split(' ').join('-');
}
```

a title with several spaces in a row should still give single dashes. write the failing test for that in `src/slugify.test.ts`.
