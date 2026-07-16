The `_recordImports` method in `packages/core/schematics/utils/change_tracker.ts` has become a pain
to work in. The tests are green. What would you do with it?

(Heads up: this is a Bazel-based repo, so running the full test suite locally is impractical --
verify your changes with `npx tsc --noEmit` on the touched project rather than the test runner.)
