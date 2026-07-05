#!/usr/bin/env node
// FWL-02 smell-taxonomy checker (LOCKED smell-LEAF model). The 24 Fowler Ch.3 bad smells are one
// leaf file per smell under references/smells/<slug>.md, with a navigation-only index at
// references/smells.md. Asserts:
//   - each of the 24 canonical smell names is present EXACTLY once as a leaf's level-1 heading
//     (identity, not cardinality), no dupes, filename = kebab-case slug of the name;
//   - each smell leaf carries a one-line `Recognize by:` selector and a `## Candidate refactorings`
//     section whose links resolve to real fowler-catalog leaves (file exists; #anchor resolves);
//   - references/smells.md is a navigation index carrying, per smell, a recognize-by line and a
//     link to that smell's leaf that resolves.
// The index + candidate links stay RED until 07-10 authors the smell leaves + fills the index --
// that is the expected baseline. Throwaway; node builtins only; mirrors verify-scaffold.mjs.
// RED against the empty smells set by design (0/24).
//   node .claude/skills/lz-refactor-workspace/tools/check-smells.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
// tools -> lz-refactor-workspace -> skills -> .claude -> repo root
const repoRoot = path.resolve(here, "..", "..", "..", "..");
const REFERENCES = path.join(repoRoot, "plugins", "lz-tdd", "skills", "lz-refactor", "references");
const CATALOG = path.join(REFERENCES, "fowler-catalog");
const SMELLS_DIR = path.join(REFERENCES, "smells");
const SMELLS_INDEX = path.join(REFERENCES, "smells.md");

// The 24 canonical 2nd-ed Fowler bad-smell names (public facts, Ch.3).
const SMELLS = [
  "Mysterious Name",
  "Duplicated Code",
  "Long Function",
  "Long Parameter List",
  "Global Data",
  "Mutable Data",
  "Divergent Change",
  "Shotgun Surgery",
  "Feature Envy",
  "Data Clumps",
  "Primitive Obsession",
  "Repeated Switches",
  "Loops",
  "Lazy Element",
  "Speculative Generality",
  "Temporary Field",
  "Message Chains",
  "Middle Man",
  "Insider Trading",
  "Large Class",
  "Alternative Classes with Different Interfaces",
  "Data Class",
  "Refused Bequest",
  "Comments",
];

const EXPECTED = 24;

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

const slugFor = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

// GitHub-flavored heading -> anchor slug (github-slugger rules; duplicates get -1, -2 ...).
const slugsFor = (text) => {
  const seen = new Map();
  const anchors = new Set();

  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^#{1,6}\s+(.+?)\s*#*\s*$/);

    if (!m) {
      continue;
    }

    const base = m[1]
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");

    let slug = base;

    if (seen.has(base)) {
      const next = seen.get(base) + 1;
      seen.set(base, next);
      slug = `${base}-${next}`;
    } else {
      seen.set(base, 0);
    }

    anchors.add(slug);
  }

  return anchors;
};

const anchorCache = new Map();

const anchorsOf = (file) => {
  if (!anchorCache.has(file)) {
    anchorCache.set(file, slugsFor(fs.readFileSync(file, "utf8")));
  }

  return anchorCache.get(file);
};

// Collect smell leaves: { name, tag, base, file, text } from smells/<slug>.md.
const collectLeaves = () => {
  const leaves = [];

  if (!isDir(SMELLS_DIR)) {
    return leaves;
  }

  for (const entry of fs.readdirSync(SMELLS_DIR, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith(".md") || entry.name.toLowerCase() === "readme.md") {
      continue;
    }

    const file = path.join(SMELLS_DIR, entry.name);
    const text = fs.readFileSync(file, "utf8");
    const base = path.basename(file, ".md");
    const rel = path.relative(repoRoot, file);
    const h1s = text.split(/\r?\n/).filter((l) => /^#\s+\S/.test(l));

    if (h1s.length !== 1) {
      report(false, `smell leaf ${base}.md has exactly one level-1 heading`, `found ${h1s.length}`);
      leaves.push({ name: null, base, file: rel, text });
      continue;
    }

    const name = h1s[0].replace(/^#\s+/, "").replace(/\s*\[[^\]]+\]\s*$/, "").trim();
    leaves.push({ name, base, file: rel, text });
  }

  return leaves;
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

console.log("FWL-02 smell taxonomy check (smell-leaf model)");
console.log(`  smells dir: ${path.relative(repoRoot, SMELLS_DIR)}`);
console.log(`  smell leaves found: ${leaves.length}`);
console.log("");

// Candidate-link resolution within a smell leaf: every ](...fowler-catalog/<leaf>.md[#a]) resolves.
const candidateLinksResolve = (leaf) => {
  const linkRe = /\]\(([^)\s]*fowler-catalog\/[a-z0-9-]+\.md(?:#[^)\s]+)?)\)/g;
  const problems = [];
  let count = 0;
  let m;

  while ((m = linkRe.exec(leaf.text)) !== null) {
    count++;
    const [rel, anchor] = m[1].split("#");
    const targetPath = path.resolve(REFERENCES, "smells", rel);

    if (!fs.existsSync(targetPath)) {
      problems.push(`${rel} (missing)`);
      continue;
    }

    if (anchor && !anchorsOf(targetPath).has(anchor)) {
      problems.push(`${rel}#${anchor} (anchor)`);
    }
  }

  return { count, problems };
};

let present = 0;

for (const name of SMELLS) {
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

  if (!/^Recognize by:\s*\S/m.test(leaf.text)) {
    missing.push("Recognize by: line");
  }

  if (!/^##\s+Candidate refactorings\s*$/m.test(leaf.text)) {
    missing.push("## Candidate refactorings");
  }

  const { count, problems } = candidateLinksResolve(leaf);

  if (count === 0) {
    missing.push("no candidate-refactoring links");
  }

  if (problems.length > 0) {
    missing.push(`unresolved candidates: ${problems.join(", ")}`);
  }

  report(missing.length === 0, name, missing.length === 0 ? "" : `missing: ${missing.join("; ")}`);
}

// Flag any smell-leaf heading that is not a canonical name.
const canonical = new Set(SMELLS);

for (const leaf of leaves) {
  if (leaf.name && !canonical.has(leaf.name)) {
    report(false, `unknown smell leaf heading: ${leaf.name}`, leaf.file);
  }
}

// Navigation index: smells.md carries, per smell, a recognize-by line and a resolving leaf link.
if (!fs.existsSync(SMELLS_INDEX)) {
  report(false, "smells.md index exists", "not found");
} else {
  const indexText = fs.readFileSync(SMELLS_INDEX, "utf8");
  const hasRecognize = /recognize by:/i.test(indexText);
  report(hasRecognize, "smells.md carries recognize-by lines", hasRecognize ? "" : "none found");

  let indexed = 0;
  const indexMissing = [];

  for (const name of SMELLS) {
    const slug = slugFor(name);
    const linkRe = new RegExp(`\\]\\((?:\\./)?smells/${slug}\\.md(?:#[^)\\s]+)?\\)`);

    if (linkRe.test(indexText)) {
      indexed++;
    } else {
      indexMissing.push(slug);
    }
  }

  report(
    indexed === EXPECTED,
    `smells.md links all ${EXPECTED} smell leaves`,
    indexed === EXPECTED ? "" : `${indexed}/${EXPECTED}; missing: ${indexMissing.join(", ")}`
  );
}

console.log("");

if (failures === 0) {
  console.log(`SUMMARY: FWL-02 GREEN -- ${present}/${EXPECTED} smell leaves with contract + navigation index`);
  process.exit(0);
}

console.log(`SUMMARY: FWL-02 RED -- ${present}/${EXPECTED} smell leaves, ${failures} check(s) FAILED`);
process.exit(1);
