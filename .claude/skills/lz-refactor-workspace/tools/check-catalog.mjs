#!/usr/bin/env node
// FWL-01 completeness + per-refactoring-leaf contract checker (LOCKED 62-scope model).
// The catalog is one leaf file per refactoring under fowler-catalog/<slug>.md (README.md is the
// index, not a leaf). Asserts:
//   - each of the 62 canonical 2nd-ed names is present EXACTLY once as a leaf's level-1 heading
//     (identity, not just cardinality -- closes the WR-02 gap), no dupes, no unknown/typo heading;
//   - each leaf file name is the kebab-case slug of its heading name (deterministic cross-link target);
//   - each leaf carries the contract fields: a one-line `Use when:` selector, a `## Motivation`
//     section, a `## Mechanics` section, and a `## Example` section with >=1 ts/js fence;
//   - the sole web-only entry (Return Modified Value) carries [web-only]; no leaf carries a
//     [web-example] marker (owner reversed the scope-correction's Split Phase [web-example] label
//     on 2026-07-05 -- Split Phase is a normal in-book Ch.6 refactoring);
//   - no draft-scaffolding phrases leak into a leaf (uppercase TODO / "once it exists" / etc.);
//   - each existing leaf's `Use when:` line is mirrored verbatim into its README index row.
// Scope is 62 = the 66 web-catalog entries minus the 4 cut 1st-ed relics (see
// 07-ROUTING-ARCHITECTURE "Scope: 62 refactorings"); the README-row mirror stays partially RED
// until 07-10 fills every chapter -- that is the expected baseline. Throwaway; node builtins only;
// mirrors verify-scaffold.mjs. RED against the empty catalog by design (0/62).
//   node .claude/skills/lz-refactor-workspace/tools/check-catalog.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { collectH1Lines } from "./lib/heading-scan.mjs";
import { SCAFFOLD_RES } from "./lib/scaffold-phrases.mjs";
import { sectionBody } from "./lib/section-body.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
// tools -> lz-refactor-workspace -> skills -> .claude -> repo root
const repoRoot = path.resolve(here, "..", "..", "..", "..");
const CATALOG = path.join(repoRoot, "plugins", "lz-tdd", "skills", "lz-refactor", "references", "fowler-catalog");
const README = path.join(CATALOG, "README.md");

// The 62 canonical 2nd-ed refactoring names (public facts, refactoring-com-overview.md).
// This is the 66-entry web catalog minus the 4 cut 1st-ed relics.
const NAMES = [
  "Change Function Declaration",
  "Change Reference to Value",
  "Change Value to Reference",
  "Collapse Hierarchy",
  "Combine Functions into Class",
  "Combine Functions into Transform",
  "Consolidate Conditional Expression",
  "Decompose Conditional",
  "Encapsulate Collection",
  "Encapsulate Record",
  "Encapsulate Variable",
  "Extract Class",
  "Extract Function",
  "Extract Superclass",
  "Extract Variable",
  "Hide Delegate",
  "Inline Class",
  "Inline Function",
  "Inline Variable",
  "Introduce Assertion",
  "Introduce Parameter Object",
  "Introduce Special Case",
  "Move Field",
  "Move Function",
  "Move Statements into Function",
  "Move Statements to Callers",
  "Parameterize Function",
  "Preserve Whole Object",
  "Pull Up Constructor Body",
  "Pull Up Field",
  "Pull Up Method",
  "Push Down Field",
  "Push Down Method",
  "Remove Dead Code",
  "Remove Flag Argument",
  "Remove Middle Man",
  "Remove Setting Method",
  "Remove Subclass",
  "Rename Field",
  "Rename Variable",
  "Replace Command with Function",
  "Replace Conditional with Polymorphism",
  "Replace Constructor with Factory Function",
  "Replace Derived Variable with Query",
  "Replace Function with Command",
  "Replace Inline Code with Function Call",
  "Replace Loop with Pipeline",
  "Replace Nested Conditional with Guard Clauses",
  "Replace Parameter with Query",
  "Replace Primitive with Object",
  "Replace Query with Parameter",
  "Replace Subclass with Delegate",
  "Replace Superclass with Delegate",
  "Replace Temp with Query",
  "Replace Type Code with Subclasses",
  "Return Modified Value",
  "Separate Query from Modifier",
  "Slide Statements",
  "Split Loop",
  "Split Phase",
  "Split Variable",
  "Substitute Algorithm",
];

const EXPECTED = 62;

// Provenance: exactly one web-only leaf; no web-example leaf (owner reversed the Split Phase
// [web-example] label on 2026-07-05 -- it is a normal in-book Ch.6 refactoring).
const WEB_ONLY = new Set(["Return Modified Value"]);
const WEB_EXAMPLE = new Set();

let failures = 0;

const report = (ok, label, detail) => {
  if (!ok) {
    failures++;
  }

  console.log(`  [${ok ? "PASS" : "FAIL"}] ${label}${detail ? " -- " + detail : ""}`);
};

const isDir = (p) => {
  try {
    return fs.statSync(p).isDirectory();
  } catch {
    return false;
  }
};

// kebab-case slug of a canonical name (deterministic cross-link target).
const slugFor = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const walkMd = (dir) => {
  const out = [];

  if (!isDir(dir)) {
    return out;
  }

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      out.push(...walkMd(full));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      out.push(full);
    }
  }

  return out;
};

// Collect every leaf: { name, tag, file, base, text }. A leaf is a fowler-catalog/*.md that is not
// the README. Its identity is the single level-1 `# <Name>` heading, with a trailing `[tag]` (if
// any) stripped off the name.
const collectLeaves = () => {
  const leaves = [];

  for (const file of walkMd(CATALOG)) {
    if (path.basename(file).toLowerCase() === "readme.md") {
      continue;
    }

    const text = fs.readFileSync(file, "utf8");
    const h1s = collectH1Lines(text);
    const base = path.basename(file, ".md");
    const rel = path.relative(repoRoot, file);

    if (h1s.length !== 1) {
      report(false, `leaf ${base}.md has exactly one level-1 heading`, `found ${h1s.length}`);
      leaves.push({ name: null, tag: null, file: rel, base, text });
      continue;
    }

    const raw = h1s[0].replace(/^#\s+/, "").trim();
    const tagMatch = raw.match(/\[([^\]]+)\]\s*$/);
    const tag = tagMatch ? tagMatch[1] : null;
    const name = raw.replace(/\s*\[[^\]]+\]\s*$/, "").trim();
    leaves.push({ name, tag, file: rel, base, text });
  }

  return leaves;
};

// Parse README rows so we can assert each leaf's Use-when is mirrored. Returns a map
// slug -> array of README line texts that link to that slug's leaf.
const readmeRowsBySlug = () => {
  const map = new Map();

  if (!fs.existsSync(README)) {
    return map;
  }

  const linkRe = /\]\(([a-z0-9][a-z0-9-]*)\.md\)/g;

  for (const line of fs.readFileSync(README, "utf8").split(/\r?\n/)) {
    let m;

    while ((m = linkRe.exec(line)) !== null) {
      const slug = m[1];

      if (!map.has(slug)) {
        map.set(slug, []);
      }

      map.get(slug).push(line);
    }
  }

  return map;
};

const leaves = collectLeaves();
const byName = new Map();

for (const leaf of leaves) {
  if (!leaf.name) {
    continue;
  }

  if (!byName.has(leaf.name)) {
    byName.set(leaf.name, []);
  }

  byName.get(leaf.name).push(leaf);
}

const rows = readmeRowsBySlug();

console.log("FWL-01 Fowler catalog completeness + per-leaf contract check (62-scope)");
console.log(`  catalog dir: ${path.relative(repoRoot, CATALOG)}`);
console.log(`  leaf files found: ${leaves.length}`);
console.log("");

let present = 0;

for (const name of NAMES) {
  const matches = byName.get(name) || [];

  if (matches.length === 0) {
    report(false, name, "0 leaves found");
    continue;
  }

  if (matches.length > 1) {
    report(false, name, `${matches.length} leaves (expected exactly 1)`);
    continue;
  }

  present++;
  const leaf = matches[0];
  const expectedSlug = slugFor(name);
  const missing = [];

  if (leaf.base !== expectedSlug) {
    missing.push(`filename ${leaf.base}.md != ${expectedSlug}.md`);
  }

  if (!/^Use when:\s*\S/m.test(leaf.text)) {
    missing.push("Use when: line");
  }

  if (!/^##\s+Motivation\s*$/m.test(leaf.text)) {
    missing.push("## Motivation");
  }

  if (!/^##\s+Mechanics\s*$/m.test(leaf.text)) {
    missing.push("## Mechanics");
  }

  // Exact heading (not `\b`) so the presence check agrees with the sectionBody match below (WR-02):
  // a decorated `## Example (Before -> After)` must not pass presence while sectionBody fails to find
  // it. All 62 Fowler Example headings are exact.
  if (!/^##\s+Example\s*$/m.test(leaf.text)) {
    missing.push("## Example");
  }

  // The ts/js fence must live INSIDE the ## Example section, not merely somewhere in the leaf, so an
  // empty Example with a stray fence in ## Motivation cannot pass. Keep the broad Fowler alternation
  // (ts|typescript|js|javascript) -- Fowler leaves allow JS, unlike the ts-only GoF leaves.
  const exampleBody = sectionBody(leaf.text, "Example");

  if (exampleBody === null || !/```(ts|typescript|js|javascript)\b/.test(exampleBody)) {
    missing.push("ts/js fence in ## Example");
  }

  // Provenance markers: required on the two special leaves, forbidden elsewhere.
  const hasWebOnly = /\[web-only\]/.test(leaf.text);
  const hasWebExample = /\[web-example\]/.test(leaf.text);

  if (WEB_ONLY.has(name) && !hasWebOnly) {
    missing.push("[web-only] marker");
  }

  if (!WEB_ONLY.has(name) && hasWebOnly) {
    missing.push("unexpected [web-only] marker");
  }

  if (WEB_EXAMPLE.has(name) && !hasWebExample) {
    missing.push("[web-example] marker");
  }

  if (!WEB_EXAMPLE.has(name) && hasWebExample) {
    missing.push("unexpected [web-example] marker");
  }

  // No draft-scaffolding phrases.
  for (const re of SCAFFOLD_RES) {
    if (re.test(leaf.text)) {
      missing.push(`scaffolding phrase ${re}`);
    }
  }

  // Index-row Use-when mirror: the leaf's `Use when:` selector must appear verbatim in a README
  // row that links to this leaf. RED until 07-10 fills every chapter row (expected baseline).
  const useWhen = (leaf.text.match(/^Use when:\s*(.+?)\s*$/m) || [])[1];

  if (useWhen) {
    const rowLines = rows.get(expectedSlug) || [];

    if (rowLines.length === 0) {
      missing.push("no README index row");
    } else if (!rowLines.some((line) => line.includes(useWhen))) {
      missing.push("Use-when not mirrored in README row");
    }
  }

  report(missing.length === 0, name, missing.length === 0 ? "" : `missing: ${missing.join("; ")}`);
}

// Flag any leaf heading that is not a canonical name (typo / stray / cut relic).
const canonical = new Set(NAMES);

for (const leaf of leaves) {
  if (leaf.name && !canonical.has(leaf.name)) {
    report(false, `unknown leaf heading: ${leaf.name}`, leaf.file);
  }
}

console.log("");

if (failures === 0) {
  console.log(`SUMMARY: FWL-01 GREEN -- ${present}/${EXPECTED} refactorings present with contract fields + provenance`);
  process.exit(0);
}

console.log(`SUMMARY: FWL-01 RED -- ${present}/${EXPECTED} present, ${failures} check(s) FAILED`);
process.exit(1);
