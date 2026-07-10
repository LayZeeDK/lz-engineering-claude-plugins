Good news: this isn't a refactoring at all — it's a **transformation** (a behavior change that turns a red test green), and transformations are exactly what the priority list ranks. Refactoring is structure-only and comes *after* you're green. So the framing shift is: "what's the simplest transformation that passes this one test?"

## Coach analysis

**Phase check:** one failing test, code compiles (`parseTag` returns `null`). You're picking a transformation. ✅

**Candidates that would pass `parseTag('a:b') === { scope: 'a', name: 'b' }`:**

1. `(nil → constant)` — replace `return null` with the literal object.
2. `(constant → scalar)` + string splitting — parse `':'` and build the object from the parts.

**Recommendation — the highest-priority one: `(nil → constant)`.**

```js
function parseTag(tag) {
  return { scope: 'a', name: 'b' };
}
```

That's #2 on the canonical list (`(nil → constant)`: replace `null`/nothing with a hardcoded value). It's deliberately "too dumb" — it ignores the input entirely — and that's the point. With a single example there is no evidence in your test suite that demands generalization, so TPP says don't reach for the split yet. Jumping straight to `input.split(':')` is choosing a lower-priority transformation before the tests force it.

## Where this goes next (posing the next test)

The amended cycle says: pose a test that can only be passed by a higher-priority transformation. Add a second, *different* example:

```js
expect(parseTag('x:y')).toEqual({ scope: 'x', name: 'y' });
```

Now the constant fails, and the minimal change is `(constant → scalar)` — replace the literal `'a'`/`'b'` with values derived from the argument:

```js
function parseTag(tag) {
  const [scope, name] = tag.split(':');
  return { scope, name };
}
```

That destructuring/array-index step is `(constant → scalar)` / `(statement → recursion)`-adjacent generalization — still a low-numbered, cheap transformation, and now it's *earned* by a test.

## Two things to watch (future red tests, not now)

- **No colon** (`parseTag('a')`) — what should `scope`/`name` be? That decision belongs in a test, then a transformation, not guessed now.
- **Multiple colons** (`parseTag('a:b:c')`) — `split(':')` will surprise you; drive it with a test when you care.

Want me to sketch the test order that walks `null → constant → scalar` in strict priority sequence, or is the next transformation clear enough from here? (I haven't touched any files — this is all advisory.)