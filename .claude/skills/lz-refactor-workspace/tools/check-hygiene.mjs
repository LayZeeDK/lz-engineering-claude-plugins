#!/usr/bin/env node
// Hygiene checker over the shippable public surface -- both skill trees (lz-refactor + lz-tpp),
// the repo-root README/CHANGELOG/LICENSE, and both manifests:
//   (a) ASCII-only    -- fail on any non-ASCII byte, reported as file@byteN (cp1252 mojibake risk).
//   (b) work-email    -- enumerate every email-shaped token, subtract the approved public gmail,
//                        assert the remainder is empty (the work-email leak recurred twice in Phase 4).
//   (c) no-verbatim   -- DST-04 gate: fail on long double-quoted runs (a verbatim-prose proxy).
// (a), (b), and (c) are all HARD failures (non-zero exit). (c) is the realized Phase-10 no-verbatim
// gate (D-01 layer 1); it scans the narrower verbatimTargets set -- the lz-refactor tree + new
// Phase-10 root prose ONLY, excluding lz-tpp (cited FibTPP), LICENSE, and the manifests. Node builtins only.
// GREEN against the current tree today (ASCII-clean, email-clean, no verbatim-looking runs).
//   node .claude/skills/lz-refactor-workspace/tools/check-hygiene.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
// tools -> lz-refactor-workspace -> skills -> .claude -> repo root
const repoRoot = path.resolve(here, "..", "..", "..", "..");
const SKILL_DIR = path.join(repoRoot, "plugins", "lz-tdd", "skills", "lz-refactor");
const SKILL_MD = path.join(SKILL_DIR, "SKILL.md");
const REFERENCES = path.join(SKILL_DIR, "references");
// lz-tpp skill tree -- in scope for the ASCII + work-email axes (D-10) but NOT the
// no-verbatim axis (D-04: its references/transformations.md is cited FibTPP by design).
const TPP_SKILL_DIR = path.join(repoRoot, "plugins", "lz-tdd", "skills", "lz-tpp");
const TPP_SKILL_MD = path.join(TPP_SKILL_DIR, "SKILL.md");
const TPP_REFERENCES = path.join(TPP_SKILL_DIR, "references");
// Repo-root shippable prose + both manifests -- the exact files this phase writes.
const ROOT_README = path.join(repoRoot, "README.md");
const ROOT_CHANGELOG = path.join(repoRoot, "CHANGELOG.md");
const LICENSE = path.join(repoRoot, "LICENSE");
const PLUGIN_MANIFEST = path.join(repoRoot, "plugins", "lz-tdd", ".claude-plugin", "plugin.json");
const MARKETPLACE_MANIFEST = path.join(repoRoot, ".claude-plugin", "marketplace.json");

// Only the public contact is allowed in the public repo. The work email must never appear.
const APPROVED_EMAILS = new Set(["larsbrinknielsen@gmail.com"]);
const EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
const QUOTE_THRESHOLD = 120; // chars inside a single "..." run that trip the no-verbatim gate.

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

const scanNonAscii = (p) => {
  const buf = fs.readFileSync(p);

  for (let i = 0; i < buf.length; i++) {
    if (buf[i] > 0x7f) {
      return i;
    }
  }

  return -1;
};

// Axes (a) ASCII + (b) work-email scan the full shippable surface (D-10): both skill
// trees + repo-root README/CHANGELOG/LICENSE + both manifests. LICENSE (no extension)
// and the .json manifests are pushed explicitly because walkMd is .md-only (below); the
// root README/CHANGELOG are pushed explicitly because walkMd only recurses a references dir.
const wideTargets = [];

if (fs.existsSync(SKILL_MD)) {
  wideTargets.push(SKILL_MD);
}

wideTargets.push(...walkMd(REFERENCES));

if (fs.existsSync(TPP_SKILL_MD)) {
  wideTargets.push(TPP_SKILL_MD);
}

wideTargets.push(...walkMd(TPP_REFERENCES));

for (const f of [ROOT_README, ROOT_CHANGELOG, LICENSE, PLUGIN_MANIFEST, MARKETPLACE_MANIFEST]) {
  if (fs.existsSync(f)) {
    wideTargets.push(f);
  }
}

// Axis (c) no-verbatim scans the NARROWER set (D-04): the lz-refactor tree + NEW
// Phase-10 root prose (README + CHANGELOG) ONLY -- EXCLUDING lz-tpp (cited FibTPP by
// design), LICENSE (verbatim OSI MIT), and both manifests (short quoted JSON).
const verbatimTargets = [];

if (fs.existsSync(SKILL_MD)) {
  verbatimTargets.push(SKILL_MD);
}

verbatimTargets.push(...walkMd(REFERENCES));

for (const f of [ROOT_README, ROOT_CHANGELOG]) {
  if (fs.existsSync(f)) {
    verbatimTargets.push(f);
  }
}

console.log("Hygiene check (ASCII + work-email allowlist + no-verbatim heuristic)");
console.log(`  scope: both skill trees + root README/CHANGELOG/LICENSE + both manifests`);
console.log(`  files: ${wideTargets.length}`);
console.log("");

// (a) ASCII-only.
const nonAscii = [];

for (const f of wideTargets) {
  const at = scanNonAscii(f);

  if (at !== -1) {
    nonAscii.push(`${path.relative(repoRoot, f)}@byte${at}`);
  }
}

report(nonAscii.length === 0, "ASCII-only", nonAscii.length === 0 ? `${wideTargets.length} files clean` : nonAscii.join(", "));

// (b) work-email allowlist.
const offending = new Set();

for (const f of wideTargets) {
  const text = fs.readFileSync(f, "utf8");
  const found = text.match(EMAIL_RE) || [];

  for (const email of found) {
    if (!APPROVED_EMAILS.has(email.toLowerCase())) {
      offending.add(`${email} (${path.relative(repoRoot, f)})`);
    }
  }
}

report(offending.size === 0, "no non-allowlisted emails", offending.size === 0 ? "" : [...offending].join(", "));

// (c) no-verbatim gate (HARD, DST-04, D-01 layer 1) over the narrower verbatimTargets set.
const quoteRe = /"([^"\n]{1,})"/g;
const verbatimHits = [];

for (const f of verbatimTargets) {
  const text = fs.readFileSync(f, "utf8");
  let qm;

  while ((qm = quoteRe.exec(text)) !== null) {
    if (qm[1].length >= QUOTE_THRESHOLD) {
      verbatimHits.push(`${path.relative(repoRoot, f)}: ${qm[1].length} chars`);
    }
  }
}

report(verbatimHits.length === 0, "no verbatim-looking quoted runs (DST-04)", verbatimHits.length === 0 ? `${verbatimTargets.length} files clean` : verbatimHits.join(", "));

console.log("");

if (failures === 0) {
  console.log(`SUMMARY: hygiene GREEN -- ASCII + work-email (${wideTargets.length} files) + no-verbatim (${verbatimTargets.length} files) all clean`);
  process.exit(0);
}

console.log(`SUMMARY: hygiene RED -- ${failures} hard failure(s)`);
process.exit(1);
