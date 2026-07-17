# Coding Conventions

**Analysis Date:** 2026-07-17

This repository has **two authored surfaces**, each with its own conventions:

1. **Shippable Markdown** -- the plugin/skill content that ships to users: skill
   manifests, `SKILL.md` bodies, and the reference catalogs under
   `plugins/lz-tdd/skills/*/references/`. This is the product.
2. **Local Node.js harness** -- the validation + eval tooling under
   `.claude/skills/*-workspace/`. This never ships; it verifies the Markdown and
   measures skill quality. Written as ESM `.mjs`, node builtins only.

`.gsd-opengsd/` is a vendored third-party toolchain (gitignored) and is NOT
governed by these conventions.

## Naming Patterns

**Files:**
- Markdown catalog leaves: kebab-case slug of the leaf's `# H1` title, e.g.
  `Extract Function` -> `extract-function.md`. This is enforced as a
  deterministic cross-link target (`slugFor` in
  `.claude/skills/lz-refactor-workspace/tools/check-catalog.mjs`).
- Harness scripts: kebab-case `.mjs`, e.g. `check-catalog.mjs`, `grade-run.mjs`,
  `verify-scaffold.mjs`, `merge-judge.mjs`.
- Catalog directories: kebab-case grouped by source authority:
  `fowler-catalog/`, `kerievsky-catalog/`, `gof-catalog/`,
  `extra-patterns-catalog/`, `functional-catalog/`, `smells/`.
- Every catalog directory has a `README.md` index (navigation-only; never a leaf).

**Functions (JavaScript):**
- camelCase for functions and helpers: `sectionBody`, `collectH1Lines`,
  `slugFor`, `layersInResponse`, `toolDrive`, `scoreCheck`, `parseArgs`.
- Arrow-function consts for small pure helpers: `const isDir = (p) => {...}`,
  `const report = (ok, label, detail) => {...}`.

**Variables:**
- camelCase for locals: `repoRoot`, `exampleBody`, `useWhen`, `verbatimTargets`.
- SCREAMING_SNAKE_CASE for module-level constants / data tables: `NAMES`,
  `EXPECTED`, `WEB_ONLY`, `FOWLER`, `KERIEVSKY`, `KERIEVSKY_AWAY`, `FUNCTIONAL`,
  `NAME_LAYERS`, `APPROVED_EMAILS`, `EMAIL_RE`, `QUOTE_THRESHOLD`, `SCAFFOLD_RES`.

**Types:**
- No TypeScript in the harness (plain `.mjs`). TypeScript appears only *inside*
  fenced code examples within the Markdown catalog (`ts` / `typescript` fences).

## Code Style

**Language / module system:**
- ESM only in the harness: `import fs from "node:fs";`, top-level `export`.
  File extension `.mjs`. The vendored GSD toolchain uses `.cjs`; do not follow it.
- **Node builtins only. Zero dependencies, no framework, no config file.** Every
  harness header states this explicitly (e.g. "Node builtins only; no deps").
  There is no `package.json`, no lockfile, no `node_modules/` for authored code.

**ASCII-only (HARD rule, enforced):**
- No non-ASCII bytes anywhere in shippable Markdown or manifests. Enforced by
  `check-hygiene.mjs` (axis (a)), which fails on any byte `> 0x7F` and reports
  `file@byteN`. Rationale: Windows cp1252 mojibake risk.
- Use ASCII substitutes: `->` not an arrow glyph, `--` not an em dash, straight
  quotes, `*`/`-` for bullets. Tree diagrams use `|`, `|--`, `'--`, `-`.

**Formatting (JavaScript), observed consistently:**
- Two-space indentation, double-quoted strings (harness), semicolons.
  (Note: `check-evals.mjs` uses single quotes -- the newer files use double
  quotes; match the file you are editing.)
- **Blank line around control-flow and `return`:** a blank line precedes and
  follows `if` / `for` / `while` / `try` / `return` blocks unless the statement
  is first/last in its block. Visible throughout `grade-run.mjs`,
  `check-catalog.mjs`, `check-hygiene.mjs`.
- **Always use braces** for control-flow bodies -- no braceless one-liners.
- No linter/formatter config is committed (no ESLint/Prettier/Biome). Style is
  maintained by convention and by review, not tooling.

**`ponytail:` comments** mark deliberate simplifications with their ceiling, e.g.
`// ponytail: single self-contained script, no framework, no config file`
(`check-evals.mjs`). Read them as intent, not omission.

## Import Organization

Harness scripts open with node builtins, then local `./lib/*` helpers:

```js
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { collectH1Lines } from "./lib/heading-scan.mjs";
import { SCAFFOLD_RES } from "./lib/scaffold-phrases.mjs";
import { sectionBody } from "./lib/section-body.mjs";
```

**Order:**
1. `node:` builtins (`fs`, `path`, `url`).
2. Local `./lib/*.mjs` shared helpers.

**No path aliases** (no bundler, no tsconfig paths). All local imports are
explicit relative paths with the `.mjs` extension.

**Path resolution idiom** (every script that touches the repo tree):
```js
const here = path.dirname(fileURLToPath(import.meta.url));
// tools -> lz-refactor-workspace -> skills -> .claude -> repo root
const repoRoot = path.resolve(here, "..", "..", "..", "..");
```
Always comment the `..` walk so the depth is auditable. Never hardcode absolute
paths (except real-repo eval targets in `suite.json`, which are data, not code).

## Error Handling

**Validators (`check-*.mjs`, `verify-scaffold.mjs`) accumulate then exit:**
- A module-level `let failures = 0;` counter and a shared
  `report(ok, label, detail)` that increments on failure and prints
  `  [PASS]/[FAIL] <label> -- <detail>`.
- Print a final `SUMMARY: ... GREEN` / `SUMMARY: ... RED` line, then
  `process.exit(failures === 0 ? 0 : 1)`.

**Three deliberate failure modes** (named in comments, follow them):
- **fail-loud** -- an unrecognized-but-present input is reported explicitly, never
  silently passed (e.g. `toolDrive` returns `recognized:false` and the nodrive
  check fails with "unrecognized shape" evidence in `grade-run.mjs`).
- **fail-closed** -- refuse to emit a final artifact while unresolved work remains
  (e.g. `grade-run.mjs` writes `grading.preliminary.json` instead of
  `grading.json` when LLM-judge items are still pending, and deletes any stale
  final file).
- **fail-safe / scan-floor** -- assert the load-bearing input actually exists so an
  empty scan cannot read as "clean" (e.g. `check-hygiene.mjs` fails loud if
  `SKILL.md` or either manifest anchor is missing).

**IO / usage errors** use `try/catch` around `fs` reads with a clear message and
`process.exit(2)` (distinct from the `1` used for check failures):
```js
try {
  resp = fs.readFileSync(args.output, "utf8");
} catch (e) {
  console.error(`cannot read --output ${args.output}: ${e.message}`);
  process.exit(2);
}
```

## Logging

**Framework:** `console.log` / `console.error` only. No logging library.

**Patterns:**
- Human-readable check output: `[PASS]` / `[FAIL]` line-item prefixes and a
  `SUMMARY:` closing line. ASCII markers only.
- Machine-readable output goes to a JSON file via `fs.writeFileSync(path,
  JSON.stringify(result, null, 2) + "\n")`, not to stdout.
- `console.error` for usage and IO failures; `console.log` for results.

## Comments

**When to Comment:**
- **Every harness script opens with a header block** stating: what it checks/does,
  the invariants it asserts, its scope, and a `//   node <path>` usage line.
  See `check-catalog.mjs:1-19`, `check-hygiene.mjs:1-12`,
  `grade-run.mjs:1-45`. This is the strongest convention in the codebase --
  reproduce it for any new script.
- Comment non-obvious regex intent and edge cases inline (e.g. why word
  boundaries stop `Extract Function` sub-matching `Extract Functionality` in
  `grade-run.mjs`).
- Shared `lib/*.mjs` helpers document that they are the "single source of truth"
  and why divergence is dangerous (`heading-scan.mjs:1`, `section-body.mjs:1`).

**Markdown catalog leaves** carry provenance/decision references in comments and
prose (`WR-02`, `D-04`, `DST-04`, `CR-01`, dated owner decisions). Preserve these
identifiers when editing -- they tie content to planning decisions.

**No JSDoc/TSDoc.** Documentation is prose header comments, not typed doc blocks.

## Function Design

**Size:** Small, single-purpose helpers. Pure predicate/transform helpers
(`isDir`, `slugFor`, `nameRe`, `sectionBody`, `collectH1Lines`) are extracted to
`tools/lib/` when shared by more than one checker, explicitly to prevent the four
catalog checkers from diverging.

**Parameters:** Positional for small helpers. CLI scripts parse `--flag value`
and `--flag=value` via a hand-rolled `parseArgs` (no arg library).

**Return values:** Helpers return plain data (arrays, `Map`, objects like
`{ recognized, drove, detail }`), or `null` to signal "absent" (`sectionBody`
returns `null` when the heading is missing). Callers null-check.

## Module Design

**Exports:** Named exports for reusable data/helpers
(`export { nameRe, FOWLER, KERIEVSKY, ... }` in `grade-run.mjs`;
`export const sectionBody`, `export const collectH1Lines`).

**Main-module guard** so a script can be both executed and imported:
```js
const isMainModule = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMainModule) {
  main();
}
```
Use this for any script whose data tables or helpers another script reuses.

**Barrel files:** None. Import each `./lib/*.mjs` helper directly.

## Markdown Authoring Conventions (the shippable product)

**Skill frontmatter** (`SKILL.md`): YAML with `name` (equal to the skill
directory name) and a folded `description: >-` block. The `description` is the
primary auto-trigger mechanism -- it enumerates trigger phrases and, critically,
the negative seam (what to route elsewhere: "use lz-tpp instead"). Do NOT add a
`version` field to skill frontmatter (not in the Claude Code skill spec; version
lives in `plugin.json`). See `plugins/lz-tdd/skills/lz-refactor/SKILL.md:1-18`.

**Progressive disclosure:** `SKILL.md` stays lean (a decision procedure plus
links); it never restates reference content. Detail lives in
`references/**/*.md`, loaded on demand. `SKILL.md` should stay under ~500 lines.

**Cross-references:** relative Markdown links to sibling files,
`[Extract Function](replace-inline-code-with-function-call.md)`. The link target
must be the kebab-slug filename of the leaf.

**Catalog-leaf template** (enforced by `check-catalog.mjs`, `check-gof.mjs`,
`check-kerievsky.mjs`, `check-functional.mjs`, `check-extra-patterns.mjs`) --
each leaf is one `.md` file with:
- Exactly one `# <Canonical Name>` level-1 heading (its identity), optionally
  with a trailing `[tag]` such as `[web-only]`.
- An optional `*Aliases: ...*` line.
- A one-line `Use when: <selector>` immediately usable as the trigger.
- `## Motivation`, `## Mechanics` (numbered steps), and `## Example` containing
  at least one `ts`/`js` fenced block. Fowler leaves allow `js`; GoF leaves are
  `ts`-only.
- Optional `## Watch for` caveats.
- The leaf's `Use when:` line must be mirrored verbatim into its `README.md`
  index row.

**No draft scaffolding** may leak into a shipped leaf (no uppercase `TODO`,
"once it exists", etc.) -- enforced via `SCAFFOLD_RES` in
`tools/lib/scaffold-phrases.mjs`.

**No verbatim copyrighted prose** (DST-04): paraphrase book content in original
wording. `check-hygiene.mjs` axis (c) fails on any double-quoted run >= 120 chars
over the lz-refactor tree + root prose. Copyrighted source excerpts live only in
the gitignored `.oracle/` tree, read solely by a review subagent.

## Public-Repo Identity Hygiene (mandatory)

This is a public MIT repo. For the maintainer's authored content, the ONLY
email-shaped token permitted -- in files, commit messages, and commit
author/committer identity -- is `larsbrinknielsen@gmail.com`. The employer email
and its bare domain must never appear, plain or obfuscated.

**Detect by allowlist-inversion, never by encoding the forbidden value.**
`check-hygiene.mjs` axis (b) enumerates every email-shaped token, subtracts the
approved set (`APPROVED_EMAILS`), and asserts the remainder is empty. Do not write
the forbidden address/domain as a search needle -- the needle is itself the leak.
Outside contributors commit under their own identity and are never gated by this
check (it is maintainer-scoped). See `AGENTS.md`.

---

*Convention analysis: 2026-07-17*
