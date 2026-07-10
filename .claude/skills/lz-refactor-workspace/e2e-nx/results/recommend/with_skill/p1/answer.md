Read the whole thing. Here's how I'd approach it.

## What's actually wrong

`run` is ~530 lines (257–786) doing three different jobs mashed together:

1. **Resolution** (271–398): derive `sourceFilePath`, `sourceProject`, `targetProject` — with `targetProject` getting reassigned/narrowed at 391 and 555.
2. **A linear cascade of validation checks** (each block: compute → `context.report(...)` → `return`): cross-project imports, externals, self-circular, npm bans, circular deps, apps/e2e, buildable-lib, lazy-loaded, then the big `depConstraints` loop.
3. **Two large inline `fix(fixer)` closures** (307–386 and 450–514) — the barrel-entry-point remapping. These are the worst part: ~80 lines each, deeply nested inside a `context.report` inside an `if` inside `run`, and they **share duplicated logic** (the `(node as any).specifiers` extraction + `ImportSpecifier` filter + `importsToRemap`/`groupImports` dance appears in both).

So it's the classic Long Function + Duplicated Code, and the nesting depth in the fixers is what makes it painful to edit.

## The one caveat before touching anything

"Tests are green" only protects behavior the tests actually exercise. Before I refactored I'd confirm the spec covers each `context.report` branch — especially both fixer paths and the wildcard-path resolution (330–358), which is subtle. If coverage is thin there, I'd add characterization tests **first**, since this is an ESLint rule where "correct" == exactly which messages fire (and which autofix text is produced) for a given input. That's the whole safety net; everything below is pure structural change with zero behavior delta.

## The refactor, in order of reward-to-risk

**1. Extract the two fixers first (biggest win, lowest risk).**
They're self-contained and the deep nesting is the actual pain. Pull them to module-level functions with explicit params:
- `buildCrossProjectImportFix(node, targetProject, imp, fileName, projectPath)` 
- `buildSelfCircularImportFix(node, imp, fileName)`

Then `fix(fixer)` becomes a one-liner delegating out. Along the way, factor the shared duplication into a helper like `getImportedSpecifierNames(node)` (the `.specifiers.filter(ImportSpecifier).map(imported.name)` bit) and a `remapImports(members, entryPoints, ...)` that both fixers call. Module-level means these become independently testable too.

**2. Extract the resolution phase.**
Lines 271–398 → a `resolveSourceAndTarget(...)` returning a discriminated result: either "bail" (source not in workspace, or the cross-project report already fired) or `{ sourceProject, targetProject, sourceFilePath }`. This is where the tricky `targetProject` reassignment lives, so isolating it makes the reassignment explicit instead of a variable mutating across 300 lines.

**3. Turn the cascade into named check functions.**
Each remaining block (521, 559, 605, 614, 623, 642, 675) becomes `checkNpmConstraints(ctx)`, `checkCircularDependency(ctx)`, `checkNoImportOfApps(ctx)`, etc., each returning a boolean "reported/stop". Bundle the closed-over state (`context`, graph, mappings, options, resolved projects) into a single `ctx` object so signatures stay sane. `run` then reads as the pipeline it actually is:

```ts
if (checkNpmConstraints(ctx)) return;
if (checkCircularDependency(ctx)) return;
// ...
```

**On the seam question:** these close over a lot (`projectGraph`, `depConstraints`, all the option flags). Two choices — keep them as nested helpers inside `create` (closures capture everything, minimal plumbing) or push to module level with an explicit context bundle (testable, but more param passing). I'd do **module-level for the fixers and resolution** (they benefit most from being unit-testable and have few dependencies), and keep the **check cascade as nested helpers** taking one `ctx` object — moving all option flags out to module scope buys little and adds noise.

## What I would *not* do

- Don't try to make the checks a data-driven `checks.forEach` array. The order matters, they short-circuit, and some depend on prior narrowing (`targetProject as ProjectGraphProjectNode` after 552). A plain sequence of `if (check()) return;` keeps that honest and readable.
- Don't merge the two fixers into one "smart" function — they resolve entry points differently (`getBarrelEntryPointProjectNode` vs `getBarrelEntryPointByImportScope`). Share the leaf helpers, not the top.
- Don't reorder any check or change a `return` into fall-through — that silently changes which single message wins when multiple apply.

I'd land this as a stack of small commits (fixers → resolution → cascade), running the rule's spec after each so any behavior drift is caught at the commit that caused it. Want me to start with step 1 and sketch the extracted fixer signatures?