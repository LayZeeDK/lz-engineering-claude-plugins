#!/usr/bin/env node
// Cross-reference consistency checker for the lz-refactor catalog (PHASE-GATE, run fully at 07-10).
// Walks every refactoring leaf (fowler-catalog/<slug>.md, excluding README) + every smell leaf
// (smells/<slug>.md) + the smell index (smells.md), and asserts:
//   - every intra-repo Markdown cross-link `](target.md[#anchor])` resolves: the target file exists
//     and, when an #anchor is given, it resolves to a GitHub-style heading slug in that file;
//   - links whose target is principles.md are FILE-LEVEL (assert the file exists; do NOT resolve an
//     #anchor into it -- it is a hub doc named by link text, not anchor);
//   - no self-referential link (a leaf linking its own file / its own anchor);
//   - inverse-of pairs are MUTUALLY declared: if leaf A declares an inverse-of link to leaf B, leaf
//     B must declare an inverse-of link back to A (an inverse-of declaration = a line mentioning
//     "inverse" that carries a catalog-leaf link).
// Per-wave this is at most a vacuous-green sanity run (compose/inverse links point at later-chapter
// leaves that do not exist yet -> RED-by-design before 07-10); it becomes a content gate only at
// 07-10 when all 62 catalog + 24 smell leaves exist. Throwaway; node builtins only; mirrors
// verify-scaffold.mjs. ponytail: link scan does not strip code fences -- leaf examples are TS and
// carry no Markdown links.
//   node .claude/skills/lz-refactor-workspace/tools/check-crossrefs.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
// tools -> lz-refactor-workspace -> skills -> .claude -> repo root
const repoRoot = path.resolve(here, "..", "..", "..", "..");
const REFERENCES = path.join(repoRoot, "plugins", "lz-tdd", "skills", "lz-refactor", "references");
const CATALOG = path.join(REFERENCES, "fowler-catalog");
const KERIEVSKY = path.join(REFERENCES, "kerievsky-catalog");
const SMELLS_DIR = path.join(REFERENCES, "smells");
const SMELLS_INDEX = path.join(REFERENCES, "smells.md");

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

// GitHub-flavored heading -> anchor slug (github-slugger rules; duplicate slugs get -1, -2 ...).
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

const collectLeafFiles = (dir) => {
  const out = [];

  if (!isDir(dir)) {
    return out;
  }

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith(".md") && entry.name.toLowerCase() !== "readme.md") {
      out.push(path.join(dir, entry.name));
    }
  }

  return out;
};

// Kerievsky leaves are sources too, so every composed-Fowler link (../fowler-catalog/<slug>.md#<slug>)
// gets resolution-checked. The inverse-of mutuality guard below stays CATALOG (Fowler)-scoped, so the
// one-directional Kerievsky -> Fowler composed-primitive links are correctly excluded from mutuality.
const sourceFiles = [...collectLeafFiles(CATALOG), ...collectLeafFiles(KERIEVSKY), ...collectLeafFiles(SMELLS_DIR)];

if (fs.existsSync(SMELLS_INDEX)) {
  sourceFiles.push(SMELLS_INDEX);
}

console.log("Cross-reference consistency check (phase-gate; full at 07-10)");
console.log(`  references dir: ${path.relative(repoRoot, REFERENCES)}`);
console.log(`  source files: ${sourceFiles.length}`);
console.log("");

const anchorCache = new Map();

const anchorsOf = (file) => {
  if (!anchorCache.has(file)) {
    anchorCache.set(file, slugsFor(fs.readFileSync(file, "utf8")));
  }

  return anchorCache.get(file);
};

// Markdown link scan: capture the URL part of every ](...) that points at a .md file.
const linkRe = /\]\(([^)\s]+\.md(?:#[^)\s]+)?)\)/g;
// An inverse-of declaration: a line that mentions "inverse" and carries a catalog-leaf link.
const inverseEdges = []; // { from: base, to: base }

let totalLinks = 0;
let unresolved = 0;
let selfRefs = 0;

for (const file of sourceFiles) {
  const srcBase = path.basename(file, ".md");
  const srcResolved = path.resolve(file);
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const isInverseLine = /\binverse\b/i.test(line);
    let m;

    linkRe.lastIndex = 0;

    while ((m = linkRe.exec(line)) !== null) {
      totalLinks++;
      const [rel, anchor] = m[1].split("#");
      const targetPath = path.resolve(path.dirname(file), rel);
      const targetBase = path.basename(targetPath, ".md");
      const targetName = path.basename(targetPath).toLowerCase();

      // Self-referential link (a leaf linking its own file / anchor).
      if (targetPath === srcResolved) {
        report(false, `self-referential link in ${srcBase}.md`, `-> ${m[1]}`);
        selfRefs++;
        continue;
      }

      // principles.md is a hub doc: file-level only (named by link text, not anchor).
      if (targetName === "principles.md") {
        if (!fs.existsSync(targetPath)) {
          report(false, `${srcBase}.md -> ${rel}`, "principles hub not found");
          unresolved++;
        }

        continue;
      }

      if (!fs.existsSync(targetPath)) {
        report(false, `${srcBase}.md -> ${m[1]}`, "target file not found");
        unresolved++;
        continue;
      }

      if (anchor && !anchorsOf(targetPath).has(anchor)) {
        report(false, `${srcBase}.md -> ${m[1]}`, "anchor does not resolve");
        unresolved++;
        continue;
      }

      // Record inverse-of edges (catalog leaves only) for the mutuality check.
      if (isInverseLine && path.dirname(targetPath) === CATALOG && path.dirname(srcResolved) === CATALOG) {
        inverseEdges.push({ from: srcBase, to: targetBase });
      }
    }
  }
}

report(unresolved === 0, "all cross-links resolve", `${totalLinks} link(s), ${unresolved} unresolved`);
report(selfRefs === 0, "no self-referential links", `${selfRefs} found`);

// Inverse-of mutuality: every declared A->B must have a declared B->A.
const edgeSet = new Set(inverseEdges.map((e) => `${e.from}=>${e.to}`));
let asymmetric = 0;

for (const e of inverseEdges) {
  if (!edgeSet.has(`${e.to}=>${e.from}`)) {
    report(false, `inverse-of not mutual: ${e.from} -> ${e.to}`, `${e.to} does not declare the inverse back`);
    asymmetric++;
  }
}

report(asymmetric === 0, "inverse-of pairs mutually declared", `${inverseEdges.length} inverse link(s), ${asymmetric} one-sided`);

console.log("");

if (failures === 0) {
  console.log(`SUMMARY: cross-refs GREEN -- ${totalLinks} link(s) resolve, ${inverseEdges.length} inverse pair-link(s) mutual, no self-refs`);
  process.exit(0);
}

console.log(`SUMMARY: cross-refs RED -- ${failures} check(s) FAILED (${unresolved} unresolved, ${selfRefs} self-ref, ${asymmetric} one-sided inverse)`);
process.exit(1);
