#!/usr/bin/env node
// GOF-01/02/03 completeness + per-GoF-leaf contract checker (LOCKED 23-scope model).
// A sibling of check-catalog.mjs: the Fowler 62-checker stays untouched. The catalog is one leaf
// file per pattern under gof-catalog/<slug>.md (README.md is the index, not a leaf). Asserts:
//   - each of the 23 canonical GoF names (grouped by family: Creational 5 / Structural 7 /
//     Behavioral 11) is present EXACTLY once as a leaf's level-1 heading (identity, not just
//     cardinality), no dupes, no unknown/typo heading;
//   - each leaf file name is the kebab-case slug of its heading name (deterministic cross-link target);
//   - each leaf carries the LOCKED 5-section contract (D-04): `## Intent`, `## Applicability`,
//     `## Consequences`, `## Example` (with >=1 ts fence), `## Related patterns`. The optional leading
//     `Also known as:` line is NOT asserted; the Fowler [web-only]/[web-example] provenance logic is
//     deleted (Fowler-only);
//   - `## Consequences` is present AND populated (>=1 non-blank content line before the next `## `);
//     it does NOT assert a liability exists (D-07: the 8 benefits-only patterns must not false-fail --
//     "liability only where sourced" is the oracle-reviewer consequences axis);
//   - the Singleton leaf's `## Consequences` body references Dependency Injection (D-06/A1, the one
//     deterministic GOF-02 assist);
//   - the 3 REQUIRED_AWAY leaves (Singleton/Composite/Iterator) each carry the exact Kerievsky
//     Direction:Away back-link string (D-09, PRESENCE only -- RESOLUTION is check-crossrefs's job);
//   - each leaf's `## Applicability` FIRST non-blank line is mirrored verbatim into its README row;
//   - the README carries the 3 family headings (Creational / Structural / Behavioral, D-05);
//   - no draft-scaffolding phrases leak into a leaf (uppercase TODO / "once it exists" / etc.).
// check-hygiene already guards no-verbatim GoF text + ASCII-only (DST-04). Throwaway; node builtins
// only; mirrors check-catalog.mjs. RED against the empty gof-catalog by design (0/23) -- that is the
// expected instrument-first Wave-1 baseline, not a failure.
//   node .claude/skills/lz-refactor-workspace/tools/check-gof.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { collectH1Lines } from "./lib/heading-scan.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
// tools -> lz-refactor-workspace -> skills -> .claude -> repo root
const repoRoot = path.resolve(here, "..", "..", "..", "..");
const CATALOG = path.join(repoRoot, "plugins", "lz-tdd", "skills", "lz-refactor", "references", "gof-catalog");
const README = path.join(CATALOG, "README.md");

// The 23 canonical GoF pattern names (public facts, Design Patterns catalog), grouped by the three
// families. Family counts: 5 + 7 + 11 = 23. The authoring waves oracle-confirm exact wording.
const CREATIONAL = [
  "Abstract Factory",
  "Builder",
  "Factory Method",
  "Prototype",
  "Singleton",
];

const STRUCTURAL = [
  "Adapter",
  "Bridge",
  "Composite",
  "Decorator",
  "Facade",
  "Flyweight",
  "Proxy",
];

const BEHAVIORAL = [
  "Chain of Responsibility",
  "Command",
  "Interpreter",
  "Iterator",
  "Mediator",
  "Memento",
  "Observer",
  "State",
  "Strategy",
  "Template Method",
  "Visitor",
];

const NAMES = [...CREATIONAL, ...STRUCTURAL, ...BEHAVIORAL];
const EXPECTED = 23;

// name -> family, for the README grouping check.
const FAMILY_OF = new Map([
  ...CREATIONAL.map((n) => [n, "Creational"]),
  ...STRUCTURAL.map((n) => [n, "Structural"]),
  ...BEHAVIORAL.map((n) => [n, "Behavioral"]),
]);

// Related -> Away required-3 (D-09). For exactly these 3 leaves, the exact Kerievsky Direction:Away
// back-link string must appear in the leaf body (PRESENCE only; RESOLUTION is check-crossrefs's job).
const REQUIRED_AWAY = new Map([
  ["Singleton", "../kerievsky-catalog/inline-singleton.md#inline-singleton"],
  ["Composite", "../kerievsky-catalog/encapsulate-composite-with-builder.md#encapsulate-composite-with-builder"],
  ["Iterator", "../kerievsky-catalog/move-accumulation-to-visitor.md#move-accumulation-to-visitor"],
]);

// Draft-scaffolding phrases that must never leak into a shipped leaf. Uppercase TODO only
// (so a `todos` domain example never false-fails); the rest are unambiguous draft markers.
const SCAFFOLD_RES = [/\bTODO\b/, /once it exists/i, /to be authored/i, /\bplaceholder\b/i, /\bTBD\b/];

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

// Body text of a `## <heading>` section: everything after the heading line up to the next `## `
// heading (or EOF). Used for the Consequences present+populated + Singleton-cites-DI checks.
const sectionBody = (text, heading) => {
  const re = new RegExp(`^##\\s+${heading}\\s*$`, "m");
  const parts = text.split(re);

  if (parts.length < 2) {
    return null;
  }

  return parts[1].split(/^##\s+/m)[0];
};

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

// Collect every leaf: { name, tag, file, base, text }. A leaf is a gof-catalog/*.md that is not
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

// Parse README rows so we can assert each leaf's Applicability first line is mirrored. Returns a map
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

console.log("GOF-01 GoF catalog completeness + per-leaf contract check (23-scope)");
console.log(`  catalog dir: ${path.relative(repoRoot, CATALOG)}`);
console.log(`  leaf files found: ${leaves.length}`);
console.log("");

let present = 0;

for (const name of NAMES) {
  const matches = byName.get(name) || [];

  if (matches.length === 0) {
    report(false, `[${FAMILY_OF.get(name)}] ${name}`, "0 leaves found");
    continue;
  }

  if (matches.length > 1) {
    report(false, `[${FAMILY_OF.get(name)}] ${name}`, `${matches.length} leaves (expected exactly 1)`);
    continue;
  }

  present++;
  const leaf = matches[0];
  const expectedSlug = slugFor(name);
  const missing = [];

  if (leaf.base !== expectedSlug) {
    missing.push(`filename ${leaf.base}.md != ${expectedSlug}.md`);
  }

  // LOCKED 5-section contract (D-04). `Also known as:` is OPTIONAL -- not asserted.
  if (!/^##\s+Intent\s*$/m.test(leaf.text)) {
    missing.push("## Intent");
  }

  if (!/^##\s+Applicability\s*$/m.test(leaf.text)) {
    missing.push("## Applicability");
  }

  if (!/^##\s+Consequences\s*$/m.test(leaf.text)) {
    missing.push("## Consequences");
  }

  if (!/^##\s+Example\b/m.test(leaf.text)) {
    missing.push("## Example");
  }

  if (!/^##\s+Related patterns\s*$/m.test(leaf.text)) {
    missing.push("## Related patterns");
  }

  // The ts fence must live INSIDE the ## Example section (IN-01), not merely somewhere in
  // the leaf, so an empty Example with a stray fence elsewhere cannot pass.
  const exampleBody = sectionBody(leaf.text, "Example");

  if (exampleBody === null || !/```(ts|typescript)\b/.test(exampleBody)) {
    missing.push("ts fence in ## Example");
  }

  // Consequences present + populated (D-07): >=1 non-blank content line before the next `## `. Does
  // NOT assert a liability exists -- "liability only where sourced" is the oracle-reviewer's job.
  const conseqBody = sectionBody(leaf.text, "Consequences");

  if (conseqBody !== null && !conseqBody.split(/\r?\n/).some((l) => l.trim().length > 0)) {
    missing.push("## Consequences empty (needs >=1 content line)");
  }

  // Singleton-cites-DI assist (D-06/A1): the Singleton leaf's Consequences body must reference DI.
  if (name === "Singleton" && conseqBody !== null && !/dependency injection/i.test(conseqBody)) {
    missing.push("Singleton Consequences must cite Dependency Injection");
  }

  // Related -> Away required-3 (D-09): exact back-link string present (resolution is check-crossrefs).
  if (REQUIRED_AWAY.has(name)) {
    const link = REQUIRED_AWAY.get(name);

    if (!leaf.text.includes(link)) {
      missing.push(`required Away link ${link}`);
    }
  }

  // No draft-scaffolding phrases.
  for (const re of SCAFFOLD_RES) {
    if (re.test(leaf.text)) {
      missing.push(`scaffolding phrase ${re}`);
    }
  }

  // Index-row Applicability-first-line mirror: the leaf's `## Applicability` FIRST non-blank line
  // must appear verbatim in a README row that links to this leaf. RED for present leaves until Wave 3
  // fills the README rows (expected baseline, same as Fowler "RED until 07-10").
  const app = leaf.text.match(/^##\s+Applicability\s*$\r?\n+([^\r\n]+)/m);
  const selector = app ? app[1].trim() : null;

  if (selector) {
    const rowLines = rows.get(expectedSlug) || [];

    if (rowLines.length === 0) {
      missing.push("no README index row");
    } else if (!rowLines.some((line) => line.includes(selector))) {
      missing.push("Applicability first line not mirrored in README row");
    }
  }

  report(missing.length === 0, `[${FAMILY_OF.get(name)}] ${name}`, missing.length === 0 ? "" : `missing: ${missing.join("; ")}`);
}

// Flag any leaf heading that is not a canonical name (typo / stray).
const canonical = new Set(NAMES);

for (const leaf of leaves) {
  if (leaf.name && !canonical.has(leaf.name)) {
    report(false, `unknown leaf heading: ${leaf.name}`, leaf.file);
  }
}

// README family grouping (D-05, minimum per A3): assert the 3 family headings are present.
const readmeText = fs.existsSync(README) ? fs.readFileSync(README, "utf8") : "";

for (const fam of ["Creational", "Structural", "Behavioral"]) {
  report(new RegExp(`^##\\s+.*\\b${fam}\\b`, "m").test(readmeText), `README family heading: ${fam}`);
}

console.log("");

if (failures === 0) {
  console.log(`SUMMARY: GOF-01 GREEN -- ${present}/${EXPECTED} patterns present with 5-section contract + family index`);
  process.exit(0);
}

console.log(`SUMMARY: GOF-01 RED -- ${present}/${EXPECTED} present, ${failures} check(s) FAILED`);
process.exit(1);
