`validateEntry` in `packages/eslint-plugin/src/rules/nx-plugin-checks.ts` feels like it's doing
too much. Everything passes. I was thinking of introducing polymorphism for the `mode` parameter --
is that a good idea, or would you do something else?
