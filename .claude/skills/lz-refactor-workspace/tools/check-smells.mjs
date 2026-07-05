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
// Phase 8 fold (D-05, KRV-03): candidate links also resolve kerievsky-catalog targets; a leaf MAY
// carry a `Source:` tag (Fowler|Kerievsky|both, default Fowler); Kerievsky-unique leaves are
// contract-checked; overlap smells must be deduped (tag the Fowler leaf `both`, no second leaf).
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

// Source tags fold Kerievsky's Ch.4 smells into the unified taxonomy (D-05). A leaf MAY carry a
// `Source:` line; when present it must name Fowler, Kerievsky, or both. An ABSENT tag defaults to
// Fowler (the Phase-7 baseline), so the shipped 24 Fowler leaves stay green before 08-06 tags them.
const VALID_SOURCE_TAGS = new Set(["Fowler", "Kerievsky", "both"]);

const sourceTagOf = (leaf) => {
  const m = leaf.text.match(/^Source:\s*(\S+)/m);

  return m ? m[1] : "Fowler";
};

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

// Candidate-link resolution within a smell leaf: every ](...(fowler|kerievsky)-catalog/<leaf>.md[#a])
// resolves. Broadened for the D-05 fold -- a unique Kerievsky smell's candidates are mostly Kerievsky
// refactorings; the path.resolve(REFERENCES, "smells", rel) base still handles ../kerievsky-catalog/.
const candidateLinksResolve = (leaf) => {
  const linkRe = /\]\(([^)\s]*(?:fowler|kerievsky)-catalog\/[a-z0-9-]+\.md(?:#[^)\s]+)?)\)/g;
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

// The LOCKED smell-leaf contract (shared by the Fowler-canonical loop and the Kerievsky-unique loop
// so both stay in lockstep): filename == slug, a `Recognize by:` selector, a `## Candidate
// refactorings` section, and >=1 resolving candidate link.
const smellContractMissing = (leaf) => {
  const missing = [];
  const expectedSlug = slugFor(leaf.name);

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

  return missing;
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
  const missing = smellContractMissing(matches[0]);

  report(missing.length === 0, name, missing.length === 0 ? "" : `missing: ${missing.join("; ")}`);
}

// The Kerievsky Ch.4 fold (D-05): validate source tags, accept Kerievsky-sourced headings, reject
// un-deduped duplicates. The exact unique-vs-overlap map is oracle-settled in 08-06; the checker
// validates STRUCTURE + resolution + dedup, leaving name-correctness to the oracle-reviewer.
const canonical = new Set(SMELLS);

for (const leaf of leaves) {
  if (!leaf.name) {
    continue;
  }

  const explicit = leaf.text.match(/^Source:\s*(\S+)/m);

  if (explicit && !VALID_SOURCE_TAGS.has(explicit[1])) {
    report(false, `invalid source tag on ${leaf.base}.md`, `Source: ${explicit[1]} (expected Fowler|Kerievsky|both)`);
  }

  const tag = sourceTagOf(leaf);
  const isKerievskySourced = tag === "Kerievsky" || tag === "both";

  // A non-canonical heading is only legitimate when the leaf declares itself Kerievsky-sourced.
  if (!canonical.has(leaf.name) && !isKerievskySourced) {
    report(false, `unknown smell leaf heading: ${leaf.name}`, leaf.file);
  }

  // Dedup: an overlap smell is folded by tagging the existing Fowler leaf `both`, NEVER by a second
  // `Kerievsky`-only leaf reusing a canonical Fowler name.
  if (tag === "Kerievsky" && canonical.has(leaf.name)) {
    report(false, `un-deduped smell: ${leaf.name}`, "tagged Kerievsky but is a Fowler smell -- use `both` on the Fowler leaf");
  }
}

// Kerievsky-UNIQUE smell leaves (Kerievsky-sourced, non-canonical name): assert present exactly once
// with the smell-leaf contract, derived from the source tags rather than a hardcoded name list.
const kerievskyUnique = new Map();

for (const leaf of leaves) {
  if (!leaf.name || canonical.has(leaf.name)) {
    continue;
  }

  const tag = sourceTagOf(leaf);

  if (tag !== "Kerievsky" && tag !== "both") {
    continue;
  }

  if (!kerievskyUnique.has(leaf.name)) {
    kerievskyUnique.set(leaf.name, []);
  }

  kerievskyUnique.get(leaf.name).push(leaf);
}

for (const [name, matches] of kerievskyUnique) {
  if (matches.length > 1) {
    report(false, `Kerievsky smell ${name}`, `${matches.length} leaves (expected exactly 1)`);
    continue;
  }

  const missing = smellContractMissing(matches[0]);
  report(missing.length === 0, `Kerievsky smell ${name}`, missing.length === 0 ? "" : `missing: ${missing.join("; ")}`);
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
