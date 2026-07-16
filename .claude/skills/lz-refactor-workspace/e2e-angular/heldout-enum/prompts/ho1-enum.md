Refactor the `getTypesOfSchema` function in
`packages/angular_devkit/core/src/json/schema/utility.ts`. The tests are green. Make it cleaner and
easier to read without changing its behavior, and apply the changes.

Before you finish, do an explicit loop audit of `getTypesOfSchema`. List every `for` / `for-of` loop,
every `.reduce()`, and every accumulator you mutate inside a loop (`result.push(...)`, `set.add(...)`,
`map.set(...)`, a running `total +=`, or rebuilding a collection from itself such as
`x = new Set([...x, ...])`). For each one, state in your reply: (a) its intent in one word -- filter,
map, sum, group-by, union, or classify; and (b) whether a collection pipeline (`map` / `filter` /
`reduce` / `flatMap` producing the result) would express that intent without changing behavior --
answer yes or no with a one-line reason. Then apply every conversion you marked "yes", keeping behavior
identical.

(Heads up: this is a Bazel-based repo, so running the full test suite locally is impractical --
verify your changes with `npx tsc --noEmit` on the touched project rather than the test runner.)
