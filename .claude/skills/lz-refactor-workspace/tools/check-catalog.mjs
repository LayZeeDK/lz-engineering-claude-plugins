#!/usr/bin/env node
// FWL-01 completeness + provenance checker. Asserts every one of the 66 canonical 2nd-ed
// Fowler refactorings is present EXACTLY once as a level-3 entry heading across the
// fowler-catalog leaf files (identity, not just cardinality -- closes the WR-02 gap from the
// Phase-6 review), that each entry block carries a Motivation marker, a Mechanics marker and
// at least one ts/js fence, and that the 5 print-absent "+" entries carry `[web-only]` while
// Split Phase carries `[web-example]`. Throwaway; node builtins only; mirrors verify-scaffold.mjs.
// RED against the empty catalog by design (0/66) -- proves the checker works before content lands.
//   node .claude/skills/lz-refactor-workspace/tools/check-catalog.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
// tools -> lz-refactor-workspace -> skills -> .claude -> repo root
const repoRoot = path.resolve(here, "..", "..", "..", "..");
const CATALOG = path.join(repoRoot, "plugins", "lz-tdd", "skills", "lz-refactor", "references", "fowler-catalog");

// The 66 canonical 2nd-ed refactoring names (public facts, refactoring-com-overview.md).
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
  "Replace Control Flag with Break",
  "Replace Derived Variable with Query",
  "Replace Error Code with Exception",
  "Replace Exception with Precheck",
  "Replace Function with Command",
  "Replace Inline Code with Function Call",
  "Replace Loop with Pipeline",
  "Replace Magic Literal",
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

// The 5 print-absent "+" entries -- must carry the [web-only] provenance tag on the heading.
const WEB_ONLY = new Set([
  "Replace Magic Literal",
  "Replace Control Flag with Break",
  "Return Modified Value",
  "Replace Error Code with Exception",
  "Replace Exception with Precheck",
]);

// Split Phase's examples are online-only -- must carry [web-example].
const WEB_EXAMPLE = new Set(["Split Phase"]);

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

// Collect every level-3 entry heading across the leaves (README is the index, not a leaf).
// An entry = { name, tag, block } where `name` is the heading text with any trailing
// `[...]` provenance tag stripped, `tag` is that tag (or null), and `block` is the entry body
// up to the next level-1/2/3 heading.
const collectEntries = () => {
  const entries = [];

  for (const file of walkMd(CATALOG)) {
    if (path.basename(file).toLowerCase() === "readme.md") {
      continue;
    }

    const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);

    for (let i = 0; i < lines.length; i++) {
      const m = lines[i].match(/^###\s+(.+?)\s*$/);

      if (!m) {
        continue;
      }

      const rawHeading = m[1];
      const tagMatch = rawHeading.match(/`\[([^\]]*)\]`/);
      const tag = tagMatch ? tagMatch[1] : null;
      const name = rawHeading.replace(/`\[[^\]]*\]`/, "").trim();

      // Body: from the next line until the next heading (#, ##, ### ...) or EOF.
      const bodyLines = [];

      for (let j = i + 1; j < lines.length; j++) {
        if (/^#{1,3}\s+/.test(lines[j])) {
          break;
        }

        bodyLines.push(lines[j]);
      }

      entries.push({ name, tag, file: path.relative(repoRoot, file), block: bodyLines.join("\n") });
    }
  }

  return entries;
};

const entries = collectEntries();
const byName = new Map();

for (const e of entries) {
  if (!byName.has(e.name)) {
    byName.set(e.name, []);
  }

  byName.get(e.name).push(e);
}

console.log("FWL-01 Fowler catalog completeness + provenance check");
console.log(`  catalog dir: ${path.relative(repoRoot, CATALOG)}`);
console.log(`  entry headings found: ${entries.length}`);
console.log("");

let present = 0;

for (const name of NAMES) {
  const matches = byName.get(name) || [];

  if (matches.length === 0) {
    report(false, name, "0 entries found");
    continue;
  }

  if (matches.length > 1) {
    report(false, name, `${matches.length} entries (expected exactly 1)`);
    continue;
  }

  present++;
  const e = matches[0];
  const hasMotivation = /\*\*Motivation/.test(e.block);
  const hasMechanics = /\*\*Mechanics/.test(e.block);
  const hasFence = /```(ts|typescript|js|javascript)\b/.test(e.block);

  let provenanceOk = true;
  let provenanceDetail = "";

  if (WEB_ONLY.has(name)) {
    provenanceOk = e.tag === "web-only";
    provenanceDetail = provenanceOk ? "" : `expected [web-only], got ${e.tag ? "[" + e.tag + "]" : "none"}`;
  } else if (WEB_EXAMPLE.has(name)) {
    provenanceOk = e.tag === "web-example";
    provenanceDetail = provenanceOk ? "" : `expected [web-example], got ${e.tag ? "[" + e.tag + "]" : "none"}`;
  }

  const ok = hasMotivation && hasMechanics && hasFence && provenanceOk;
  const missing = [];

  if (!hasMotivation) {
    missing.push("Motivation");
  }

  if (!hasMechanics) {
    missing.push("Mechanics");
  }

  if (!hasFence) {
    missing.push("ts/js fence");
  }

  if (!provenanceOk) {
    missing.push(provenanceDetail);
  }

  report(ok, name, ok ? "" : `missing: ${missing.join(", ")}`);
}

// Flag any entry heading that is not a canonical name (typo / stray heading).
const canonical = new Set(NAMES);

for (const e of entries) {
  if (!canonical.has(e.name)) {
    report(false, `unknown entry heading: ${e.name}`, e.file);
  }
}

console.log("");

if (failures === 0) {
  console.log(`SUMMARY: FWL-01 GREEN -- ${present}/66 refactorings present with contract fields + provenance`);
  process.exit(0);
}

console.log(`SUMMARY: FWL-01 RED -- ${present}/66 present, ${failures} check(s) FAILED`);
process.exit(1);
