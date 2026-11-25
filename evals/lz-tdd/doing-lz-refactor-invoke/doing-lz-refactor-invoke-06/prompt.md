---
tags: [doing, lz-refactor, refactor-step]
max_turns: 20
allowed_tools: [Read, Glob, Grep, Skill]
---

/lz-tdd:lz-refactor all tests pass. `src/matcher.ts` has a stack of near-identical methods -- matchExactWord, matchWordPrefix, matchExactPhrase, matchPhrasePrefix, and the same set again for the 'or' join -- each one hand-coding a single combination of {exact|prefix} x {word|phrase} x {and|or}. adding a dimension multiplies the methods again. tests green. refactor it.
