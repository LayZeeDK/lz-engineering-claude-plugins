#!/usr/bin/env node
// Hygiene checker over the shipped lz-refactor skill (SKILL.md + every references/*.md leaf):
//   (a) ASCII-only    -- fail on any non-ASCII byte, reported as file@byteN (cp1252 mojibake risk).
//   (b) work-email    -- enumerate every email-shaped token, subtract the approved public gmail,
//                        assert the remainder is empty (the work-email leak recurred twice in Phase 4).
//   (c) no-verbatim   -- DST-04 heuristic: flag long double-quoted runs as review candidates.
// (a) and (b) are HARD failures (non-zero exit). (c) is WARN-level only -- the authoritative
// no-verbatim gate is the D-07 oracle checkpoint plus the Phase-10 hygiene scan. Node builtins only.
// GREEN against the current scaffold today (ASCII-clean, email-clean).
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

// Only the public contact is allowed in the public repo. The work email must never appear.
const APPROVED_EMAILS = new Set(["larsbrinknielsen@gmail.com"]);
const EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
const QUOTE_THRESHOLD = 120; // chars inside a single "..." run that trip the no-verbatim WARN.

let failures = 0;
let warnings = 0;

const report = (ok, label, detail) => {
  if (!ok) {
    failures++;
  }

  console.log(`  [${ok ? "PASS" : "FAIL"}] ${label}${detail ? " -- " + detail : ""}`);
};

const warn = (label, detail) => {
  warnings++;
  console.log(`  [WARN] ${label}${detail ? " -- " + detail : ""}`);
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

const targets = [];

if (fs.existsSync(SKILL_MD)) {
  targets.push(SKILL_MD);
}

targets.push(...walkMd(REFERENCES));

console.log("Hygiene check (ASCII + work-email allowlist + no-verbatim heuristic)");
console.log(`  skill dir: ${path.relative(repoRoot, SKILL_DIR)}`);
console.log(`  files: ${targets.length}`);
console.log("");

// (a) ASCII-only.
const nonAscii = [];

for (const f of targets) {
  const at = scanNonAscii(f);

  if (at !== -1) {
    nonAscii.push(`${path.relative(repoRoot, f)}@byte${at}`);
  }
}

report(nonAscii.length === 0, "ASCII-only", nonAscii.length === 0 ? `${targets.length} files clean` : nonAscii.join(", "));

// (b) work-email allowlist.
const offending = new Set();

for (const f of targets) {
  const text = fs.readFileSync(f, "utf8");
  const found = text.match(EMAIL_RE) || [];

  for (const email of found) {
    if (!APPROVED_EMAILS.has(email.toLowerCase())) {
      offending.add(`${email} (${path.relative(repoRoot, f)})`);
    }
  }
}

report(offending.size === 0, "no non-allowlisted emails", offending.size === 0 ? "" : [...offending].join(", "));

// (c) no-verbatim heuristic (WARN only).
const quoteRe = /"([^"\n]{1,})"/g;

for (const f of targets) {
  const text = fs.readFileSync(f, "utf8");
  let qm;

  while ((qm = quoteRe.exec(text)) !== null) {
    if (qm[1].length >= QUOTE_THRESHOLD) {
      warn("long quoted run (review for verbatim prose, DST-04)", `${path.relative(repoRoot, f)}: ${qm[1].length} chars`);
    }
  }
}

console.log("");

if (failures === 0) {
  console.log(`SUMMARY: hygiene GREEN -- ASCII + email clean over ${targets.length} file(s); ${warnings} no-verbatim WARN(s)`);
  process.exit(0);
}

console.log(`SUMMARY: hygiene RED -- ${failures} hard failure(s); ${warnings} no-verbatim WARN(s)`);
process.exit(1);
