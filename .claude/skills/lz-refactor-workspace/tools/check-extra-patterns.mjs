#!/usr/bin/env node
// XTR-01 completeness + per-extra-pattern-leaf contract checker (LOCKED 5-scope model).
// A small sibling of check-gof.mjs / check-catalog.mjs. The catalog is one leaf file per pattern
// under extra-patterns-catalog/<slug>.md (README.md is the index, not a leaf). Asserts:
//   - each of the 5 canonical Tier-1 extra names (Null Object, Factory, Creation Method, Composed
//     Method, Collecting Parameter) is present EXACTLY once as a leaf's level-1 heading (identity,
//     not just cardinality), no dupes, no unknown/typo heading;
//   - each leaf file name is the kebab-case slug of its heading name (deterministic cross-link target);
//   - each leaf carries the SAME LOCKED 5-section contract as the GoF leaves (D-04): `## Intent`,
//     `## Applicability`, `## Consequences`, `## Example` (with >=1 ts fence), `## Related patterns`.
//     The optional leading `Also known as:` line is NOT asserted;
//   - `## Consequences` is present AND populated (>=1 non-blank content line before the next `## `);
//     it does NOT assert a liability exists (D-07);
//   - each leaf's `## Applicability` FIRST non-blank line is mirrored verbatim into its README row.
// NO family grouping (flat 5-row index) and NO REQUIRED_AWAY map (Away links are gof-only). No
// Singleton-DI assist. check-hygiene already guards no-verbatim text + ASCII-only (DST-04). Throwaway;
// node builtins only. RED against the empty extra-patterns-catalog by design (0/5) -- the expected
// instrument-first Wave-1 baseline, not a failure.
//   node .claude/skills/lz-refactor-workspace/tools/check-extra-patterns.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { collectH1Lines } from "./lib/heading-scan.mjs";
import { SCAFFOLD_RES } from "./lib/scaffold-phrases.mjs";
import { sectionBody } from "./lib/section-body.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
// tools -> lz-refactor-workspace -> skills -> .claude -> repo root
const repoRoot = path.resolve(here, "..", "..", "..", "..");
const CATALOG = path.join(repoRoot, "plugins", "lz-tdd", "skills", "lz-refactor", "references", "extra-patterns-catalog");
const README = path.join(CATALOG, "README.md");

// The 5 Tier-1 extra patterns (D-02) -- non-GoF-23 patterns Kerievsky documents with pattern-grade
// material. Flat set (no family grouping).
const NAMES = [
  "Null Object",
  "Factory",
  "Creation Method",
  "Composed Method",
  "Collecting Parameter",
];

const EXPECTED = 5;

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

// sectionBody (## <heading> body up to the next ## or EOF) is shared via lib/section-body.mjs.
// Used for the Consequences present+populated + Example-fence checks.

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

// Collect every leaf: { name, tag, file, base, text }. A leaf is an extra-patterns-catalog/*.md that
// is not the README. Its identity is the single level-1 `# <Name>` heading, with a trailing `[tag]`
// (if any) stripped off the name.
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

console.log("XTR-01 extra-patterns catalog completeness + per-leaf contract check (5-scope)");
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

  // LOCKED 5-section contract (D-04, same as GoF leaves). `Also known as:` is OPTIONAL -- not asserted.
  if (!/^##\s+Intent\s*$/m.test(leaf.text)) {
    missing.push("## Intent");
  }

  if (!/^##\s+Applicability\s*$/m.test(leaf.text)) {
    missing.push("## Applicability");
  }

  if (!/^##\s+Consequences\s*$/m.test(leaf.text)) {
    missing.push("## Consequences");
  }

  // Exact heading (not `\b`) so the presence check agrees with the sectionBody match below (WR-02):
  // a decorated `## Example (...)` must not pass presence while sectionBody fails to find it.
  if (!/^##\s+Example\s*$/m.test(leaf.text)) {
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

  // Consequences present + populated (D-07): >=1 non-blank content line before the next `## `.
  const conseqBody = sectionBody(leaf.text, "Consequences");

  if (conseqBody !== null && !conseqBody.split(/\r?\n/).some((l) => l.trim().length > 0)) {
    missing.push("## Consequences empty (needs >=1 content line)");
  }

  // No draft-scaffolding phrases.
  for (const re of SCAFFOLD_RES) {
    if (re.test(leaf.text)) {
      missing.push(`scaffolding phrase ${re}`);
    }
  }

  // Index-row Applicability-first-line mirror: the leaf's `## Applicability` FIRST non-blank line
  // must appear verbatim in a README row that links to this leaf. RED for present leaves until Wave 3
  // fills the README rows (expected baseline).
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

  report(missing.length === 0, name, missing.length === 0 ? "" : `missing: ${missing.join("; ")}`);
}

// Flag any leaf heading that is not a canonical name (typo / stray).
const canonical = new Set(NAMES);

for (const leaf of leaves) {
  if (leaf.name && !canonical.has(leaf.name)) {
    report(false, `unknown leaf heading: ${leaf.name}`, leaf.file);
  }
}

console.log("");

if (failures === 0) {
  console.log(`SUMMARY: XTR-01 GREEN -- ${present}/${EXPECTED} extra patterns present with 5-section contract`);
  process.exit(0);
}

console.log(`SUMMARY: XTR-01 RED -- ${present}/${EXPECTED} present, ${failures} check(s) FAILED`);
process.exit(1);
