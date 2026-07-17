Refactor the `getTypesOfSchema` function in
`packages/angular_devkit/core/src/json/schema/utility.ts`. The tests are green. Make it cleaner and
easier to read without changing its behavior, and apply the changes.

(Heads up: this is a Bazel-based repo, so running the full test suite locally is impractical --
verify your changes with `npx tsc --noEmit` on the touched project rather than the test runner.)
