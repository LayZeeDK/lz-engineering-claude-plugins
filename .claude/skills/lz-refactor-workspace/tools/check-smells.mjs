#!/usr/bin/env node
// FWL-02 smell-taxonomy checker. Asserts smells.md carries exactly 24 Fowler-tagged rows and
// that every candidate cross-link of the form ](fowler-catalog/<leaf>.md#<anchor>) resolves to
// a real GitHub-style heading anchor in the target leaf. The Source column counting matches any
// row whose Source cell contains "Fowler" (so a later "Fowler, Kerievsky" merged row still
// counts), which keeps the Phase-8 fold from breaking this gate. Throwaway; node builtins only.
// RED against the empty smells.md stub by design (0 Fowler rows) -- proves the checker works.
//   node .claude/skills/lz-refactor-workspace/tools/check-smells.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
// tools -> lz-refactor-workspace -> skills -> .claude -> repo root
const repoRoot = path.resolve(here, "..", "..", "..", "..");
const REFERENCES = path.join(repoRoot, "plugins", "lz-tdd", "skills", "lz-refactor", "references");
const SMELLS = path.join(REFERENCES, "smells.md");

const FOWLER_ROWS_EXPECTED = 24;

let failures = 0;

const report = (ok, label, detail) => {
  if (!ok) {
    failures++;
  }

  console.log(`  [${ok ? "PASS" : "FAIL"}] ${label}${detail ? " -- " + detail : ""}`);
};

// GitHub-flavored heading -> anchor slug: lowercase, drop punctuation except word chars, spaces
// and hyphens, then spaces to hyphens. Duplicate slugs get a -1, -2 ... suffix (github-slugger).
const slugsFor = (text) => {
  const seen = new Map();
  const anchors = new Set();
  const lines = text.split(/\r?\n/);

  for (const line of lines) {
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

console.log("FWL-02 smell taxonomy check");
console.log(`  smells file: ${path.relative(repoRoot, SMELLS)}`);
console.log("");

if (!fs.existsSync(SMELLS)) {
  report(false, "smells.md exists", "not found");
  console.log("");
  console.log("SUMMARY: FWL-02 RED -- smells.md absent");
  process.exit(1);
}

const text = fs.readFileSync(SMELLS, "utf8");
const lines = text.split(/\r?\n/);

// Count table data rows whose Source cell contains the "Fowler" tag.
let fowlerRows = 0;

for (const line of lines) {
  if (!line.trimStart().startsWith("|")) {
    continue;
  }

  const cells = line.split("|").map((c) => c.trim());

  // Separator rows (---|---) have every non-empty cell made of dashes/colons only.
  const nonEmpty = cells.filter((c) => c.length > 0);

  if (nonEmpty.length > 0 && nonEmpty.every((c) => /^:?-+:?$/.test(c))) {
    continue;
  }

  const isFowler = nonEmpty.some((c) => /\bFowler\b/.test(c));

  if (isFowler) {
    fowlerRows++;
  }
}

report(
  fowlerRows === FOWLER_ROWS_EXPECTED,
  `24 Fowler-tagged smell rows`,
  `found ${fowlerRows}/${FOWLER_ROWS_EXPECTED}`
);

// Resolve every candidate cross-link into the Fowler catalog.
const linkRe = /\]\(fowler-catalog\/([^)#]+)#([^)]+)\)/g;
const anchorCache = new Map();
let links = 0;
let unresolved = 0;
let lm;

while ((lm = linkRe.exec(text)) !== null) {
  links++;
  const leaf = lm[1];
  const anchor = lm[2];
  const leafPath = path.join(REFERENCES, "fowler-catalog", leaf);

  if (!fs.existsSync(leafPath)) {
    report(false, `cross-link target ${leaf}#${anchor}`, "leaf file not found");
    unresolved++;
    continue;
  }

  if (!anchorCache.has(leafPath)) {
    anchorCache.set(leafPath, slugsFor(fs.readFileSync(leafPath, "utf8")));
  }

  const anchors = anchorCache.get(leafPath);

  if (!anchors.has(anchor)) {
    report(false, `cross-link target ${leaf}#${anchor}`, "anchor does not resolve");
    unresolved++;
  }
}

report(
  unresolved === 0,
  "all smell cross-links resolve",
  `${links} link(s), ${unresolved} unresolved`
);

console.log("");

if (failures === 0) {
  console.log(`SUMMARY: FWL-02 GREEN -- ${fowlerRows}/24 Fowler rows, ${links} cross-link(s) resolve`);
  process.exit(0);
}

console.log(`SUMMARY: FWL-02 RED -- ${fowlerRows}/24 Fowler rows, ${unresolved} unresolved link(s)`);
process.exit(1);
