Read it. Here's my honest take.

## First, what actually varies by `mode`

Inside `validateEntry` there are three mode-gated concerns:

| concern | `generator` | `executor` | `migration` |
|---|---|---|---|
| schema | required | required | optional (checked if present) |
| implementation | required | required | required *unless* a `prompt` exists |
| prompt | — | — | validated |
| version | — | — | required + semver-checked |

So within this function `mode` isn't really three-valued — `generator` and `executor` behave **identically**, and the only axis that matters is *migration vs. not*.

That's the crux of my answer.

## Why I'd hold off on polymorphism

Two concrete reasons, not just taste:

1. **`mode` is a poor polymorphism axis.** A class-per-mode hierarchy would give you three subclasses where two (`GeneratorEntry`, `ExecutorEntry`) are copies of each other. And note the *other* call site — `checkCollectionFileNode` (lines 236–250) — partitions on a *different* axis: `executor` vs. `generator/schematic`. So one hierarchy keyed on `mode` would have to serve two different groupings, and it'd serve neither cleanly. That's a sign the type code isn't the real structure.

2. **It fights the grain of the file.** Everything here is exported free functions (`validateImplementationNode`, `validatePromptNode`, `validatePackageGroup`…), almost certainly because the tests call them individually. Dropping a class hierarchy in the middle of an all-functions ESLint rule adds an abstraction style nothing else uses, for a benefit that a class buys you (dynamic dispatch across many call sites) that you don't have here.

The smell you named — "doing too much" — is a *Long Function / mixed-concerns* smell, not a *type-code* smell. Polymorphism is the answer to the latter. Reaching for it here treats the wrong diagnosis.

## What I'd do instead

**Finish the Extract-Function pattern that's already half-done.** The implementation and prompt checks are already extracted; the schema and version blocks are still inline. Pull those out to match:

- `validateSchemaNode(baseNode, key, mode, context, projects)` — lines 306–345
- `validateVersionNode(baseNode, key, context)` — lines 370–405

`validateEntry` then collapses to a ~12-line orchestrator where the mode guards are the only thing left and read as a checklist. Zero behavior change, and since everything passes, the risk is close to nil — each extracted helper is independently testable like its siblings.

**Then reassess.** If the `mode !== 'migration'` / `mode === 'migration'` guards still bug you after that, the lighter-than-polymorphism move is a **declarative descriptor** — a small table like:

```ts
{ migration:  { schemaRequired: false, allowsPrompt: true,  requiresVersion: true  },
  generator:  { schemaRequired: true,  allowsPrompt: false, requiresVersion: false },
  executor:   { schemaRequired: true,  allowsPrompt: false, requiresVersion: false } }
```

That expresses the rules as data (and makes the generator/executor duplication obvious and intentional), keeps everything as free functions, and doesn't force the collection-level `executor`-vs-rest axis into the same shape.

## Bottom line

Extract the two remaining inline blocks first — that's what directly fixes "doing too much" and it's nearly free. Skip the class hierarchy: the `mode` enum collapses to a binary here and splits differently one call up, so polymorphism would add structure that doesn't match either use. If guards still grate afterward, reach for a data descriptor, not classes.

Want me to sketch the extracted `validateEntry` so you can see how short it gets before you decide?