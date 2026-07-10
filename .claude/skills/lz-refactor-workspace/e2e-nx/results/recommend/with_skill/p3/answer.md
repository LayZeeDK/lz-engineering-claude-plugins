Read the function, its one dependency (`pathExists`/`buildMatrix` in `graph-utils.ts`), and the spec. Here's my take.

## What it does (and the contract the test locks in)

It collects every reachable project from `source` (including `source` itself, since `pathExists` returns `true` when source === target), then flattens each reachable project's dependency edges, keeping the ones whose `target` is an external node. The spec confirms it returns **dependency edges, not packages** — `npm:react` shows up three times (from `aLib`, `bLib`, `cLib`). So the output has intentional duplicates by package.

## What I'd actually change

**1. Fix the JSDoc — it's wrong, not just thin.** The header says "Find all unique (transitive) external dependencies," but the function does no dedup and the test asserts duplicates. "Unique" is misleading; the uniqueness is per-edge, not per-package (and the `source` field matters downstream in `hasBannedDependencies`, which maps each edge to `[externalNode, sourceNode, constraint]`). I'd reword to "all external dependency edges reachable from the given project (one per edge; a package reached via multiple projects appears multiple times)" and either fill in the `@param`/`@returns` stubs or drop them.

**2. Restore the array types.** `allReachableProjects` and `externalDependencies` are implicitly `any[]`. Type them `string[]` and `ProjectGraphDependency[]`. Cheap, safe, and it's the one thing that genuinely erodes safety today.

**3. Worth *noting* but I wouldn't do it: the redundant reachability scan.** The loop calls `pathExists` once per project (O(N)). But `pathExists` internally builds and caches a full reachability matrix, and `reach.matrix[source.name]` *is already exactly the reachable set*. So we're recomputing an O(1) lookup N times against a structure that already holds the whole answer. The clean version would be for `graph-utils` to expose a `reachableFrom(graph, source): string[]` that returns the matrix row's keys, and have this function iterate that directly. I'd flag it as a follow-up, not do it inline — it means touching `graph-utils`' encapsulation and its own tests, which is out of scope for "tidy this function."

## What I would *not* touch

I wouldn't rewrite the index `for` loops into `flatMap`/`filter`. `graph-utils.ts` deliberately uses imperative index loops for perf (there's even a comment measuring a 10× difference in `buildMatrix`), and this function is in that same hot path off `enforce-module-boundaries`. Matching the neighborhood's style matters more than the cosmetic win here.

So: **do #1 and #2 now** (docs + types, both behavior-preserving, tests stay green), **file #3 as a follow-up.** Want me to draft the edits for #1 and #2?