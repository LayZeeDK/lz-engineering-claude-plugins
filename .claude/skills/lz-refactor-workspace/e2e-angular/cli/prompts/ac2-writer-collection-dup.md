The collection-conversion helpers in
`packages/angular_devkit/core/src/workspace/json/writer.ts` have become a pain to work in. The
tests are green. What would you do with them?

(Heads up: this is a Bazel-based repo, so running the full test suite locally is impractical --
verify your changes with `npx tsc --noEmit` on the touched project rather than the test runner.)
