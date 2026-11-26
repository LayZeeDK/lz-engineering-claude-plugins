---
tags: [trigger, lz-tpp, fire, forward, chunk, rec-5f586da]
max_turns: 10
allowed_tools: [Read, Glob, Grep, Skill]
disallowed_tools: [Agent]
---

here's my whole test file - `describe('stack', () => { it('starts empty', () => expect(s.size).toBe(0)); it('push adds one', () => { s.push('a'); expect(s.size).toBe(1); }); it('pop returns last pushed', () => expect(s.pop()).toBe('a')); })` - the third test is red, first two pass. least code to make it green?
