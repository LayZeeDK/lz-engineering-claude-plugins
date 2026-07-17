Refactor the stylesheet-migration helpers in
`packages/schematics/angular/migrations/use-application-builder/stylesheet-updates.ts` --
`hasLessStylesheets`, `hasPostcssConfiguration`, `analyzeStylesheet`, and `updateStyleImports`. The
tests are green. Make them cleaner and easier to read without changing their behavior, and apply the
changes.

(Heads up: this is a Bazel-based repo, so running the full test suite locally is impractical --
verify your changes with `npx tsc --noEmit` on the touched project rather than the test runner.)
