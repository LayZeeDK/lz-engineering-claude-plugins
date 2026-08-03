#!/usr/bin/env node
// Hygiene checker over the shippable public surface -- all three skill trees (lz-refactor + lz-tpp
// + lz-red), the PLUGIN-WIDE plugins/lz-tdd/README.md + plugins/lz-tdd/references/ (added by D-21),
// the repo-root README/CHANGELOG/LICENSE, and both manifests:
//   (a) ASCII-only    -- fail on any non-ASCII byte, reported as file@byteN (cp1252 mojibake risk).
//   (b) work-email    -- enumerate every email-shaped token, subtract the approved public gmail,
//                        assert the remainder is empty (the work-email leak recurred twice in Phase 4).
//   (c) no-verbatim   -- DST-04 gate: fail on long double-quoted runs (a verbatim-prose proxy).
// (a), (b), and (c) are all HARD failures (non-zero exit). (c) is the realized Phase-10 no-verbatim
// gate (D-01 layer 1); it scans the narrower verbatimTargets set -- the lz-refactor tree + lz-red +
// the plugin-wide surface + new Phase-10 root prose ONLY, excluding lz-tpp (cited FibTPP), LICENSE,
// and the manifests. Node builtins only.
// TWO floors keep an empty scan from reading as clean: the identity-anchor `scan floor` and the
// `[cls] hygiene scope floor` non-vacuity check on the D-21 widen (see both report() calls below).
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
// lz-red skill tree -- in scope for ALL THREE axes: ASCII + work-email (wideTargets) AND
// no-verbatim (verbatimTargets). Unlike lz-tpp (cited FibTPP, no-verbatim-EXCLUDED by D-04),
// lz-red is clean-room own-words (DST-04), so it DOES take the no-verbatim gate.
const LZ_RED_SKILL_DIR = path.join(repoRoot, "plugins", "lz-tdd", "skills", "lz-red");
const LZ_RED_SKILL_MD = path.join(LZ_RED_SKILL_DIR, "SKILL.md");
const LZ_RED_REFERENCES = path.join(LZ_RED_SKILL_DIR, "references");
// PLUGIN-WIDE surface, OUTSIDE the three skill trees -- in scope for ALL THREE axes: ASCII +
// work-email (wideTargets) AND no-verbatim (verbatimTargets). This takes the lz-red treatment, not
// the lz-tpp carve-out: the plugin-wide references dir is clean-room own-words (DST-04), whereas
// lz-tpp's references/transformations.md is cited FibTPP and is no-verbatim-EXCLUDED by D-04.
// MEASURED before this widen (D-21): plugins/lz-tdd/README.md and
// plugins/lz-tdd/references/beck-tdd-by-example.md were the ONLY two shipped .md files under
// plugins/ falling outside ALL THREE axes -- and beck-tdd-by-example.md is the file Phase 22
// repairs, so the phase's own hygiene re-run would have been a VACUOUS PASS on the one surface it
// edits. The `[cls] hygiene scope floor` check below is what makes this widen provable rather than
// merely printed.
const PLUGIN_ROOT = path.join(repoRoot, "plugins", "lz-tdd");
const PLUGIN_README = path.join(PLUGIN_ROOT, "README.md");
const PLUGIN_REFERENCES = path.join(PLUGIN_ROOT, "references");
const PLUGIN_REFERENCE_ANCHOR = path.join(PLUGIN_REFERENCES, "beck-tdd-by-example.md");
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

if (fs.existsSync(LZ_RED_SKILL_MD)) {
  wideTargets.push(LZ_RED_SKILL_MD);
}

wideTargets.push(...walkMd(LZ_RED_REFERENCES));

// Plugin-wide surface (D-21). This push-gate is safe ONLY because the `[cls] hygiene scope floor`
// check below fails loud when either target drops out; never copy the gate without its floor.
// Plugin-wide surface (D-21). This push-gate is safe ONLY because the `[cls] hygiene scope floor`
// check below fails loud when either target drops out; never copy the gate without its floor.
if (fs.existsSync(PLUGIN_README)) {
  wideTargets.push(PLUGIN_README);
}

wideTargets.push(...walkMd(PLUGIN_REFERENCES));

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

// lz-red is clean-room own-words (DST-04), NOT cited-verbatim like lz-tpp -- so it DOES take
// the no-verbatim gate. lz-tpp stays excluded (its transformations.md is cited FibTPP).
if (fs.existsSync(LZ_RED_SKILL_MD)) {
  verbatimTargets.push(LZ_RED_SKILL_MD);
}

verbatimTargets.push(...walkMd(LZ_RED_REFERENCES));

// The plugin-wide surface is own-words (DST-04), NOT cited-verbatim like lz-tpp, so it DOES take
// the no-verbatim gate too (D-21). Same push-gate/floor pairing as wideTargets above.
if (fs.existsSync(PLUGIN_README)) {
  verbatimTargets.push(PLUGIN_README);
}

verbatimTargets.push(...walkMd(PLUGIN_REFERENCES));

for (const f of [ROOT_README, ROOT_CHANGELOG]) {
  if (fs.existsSync(f)) {
    verbatimTargets.push(f);
  }
}

console.log("Hygiene check (ASCII + work-email allowlist + no-verbatim heuristic)");
console.log(`  scope: the skill trees + the plugin-wide README/references + root README/CHANGELOG/LICENSE + both manifests`);
console.log(`  files: ${wideTargets.length}`);
console.log("");

// Scan floor: the ASCII + work-email axes are only meaningful if the identity-bearing
// surface is actually present. A missing/renamed anchor (SKILL.md, either manifest, or either
// plugin-wide target) would silently drop from wideTargets, and an empty scan reads as "clean" -- a
// false GREEN on the load-bearing work-email control. Fail loud if any anchor is absent.
const missingAnchors = Object.entries({
  "SKILL.md": SKILL_MD,
  "plugin.json": PLUGIN_MANIFEST,
  "marketplace.json": MARKETPLACE_MANIFEST,
  "plugins/lz-tdd/README.md": PLUGIN_README,
  "plugins/lz-tdd/references/beck-tdd-by-example.md": PLUGIN_REFERENCE_ANCHOR,
})
  .filter(([, p]) => !fs.existsSync(p))
  .map(([k]) => k);

report(
  missingAnchors.length === 0,
  "scan floor -- identity-bearing anchors present (SKILL.md + both manifests + plugin-wide README/reference)",
  missingAnchors.length === 0 ? "" : `missing: ${missingAnchors.join(", ")}`
);

// [cls] NON-VACUITY FLOOR on the D-21 widen. Before this, the file carried NO count assertion at
// all -- the file counts appeared only in the detail/summary STRINGS below, so "the widen worked"
// was unfalsifiable. Modelled on check-evals.mjs's suite-dir non-vacuity fail() ("found N dirs but
// scanned 0 authored files ... a SKIP is not a pass"): assert the newly-reached PATHS are actually
// in both scope sets rather than trusting a printed total.
//
// Deliberately keyed on the newly-reached paths and NOT on a bare total-equality literal (199): a
// path-keyed floor survives an unrelated reference leaf being added, whereas `=== 199` would redden
// the battery on every legitimate new file. This is a fail-safe scan floor, not a snapshot test.
// The totals ARE printed in the detail so the 197 -> 199 / 190 -> 192 movement stays visible.
const underPluginReferences = (f) => f.startsWith(PLUGIN_REFERENCES + path.sep);
const scopeGaps = [];

for (const [axis, targets] of [
  ["wide", wideTargets],
  ["verbatim", verbatimTargets],
]) {
  if (!targets.some(underPluginReferences)) {
    scopeGaps.push(`${axis}Targets reaches no file under plugins/lz-tdd/references`);
  }

  if (!targets.includes(PLUGIN_README)) {
    scopeGaps.push(`${axis}Targets is missing plugins/lz-tdd/README.md`);
  }
}

const scopeTotals = `wide ${wideTargets.length} / verbatim ${verbatimTargets.length} (197 / 190 before the D-21 widen)`;

report(
  scopeGaps.length === 0,
  "[cls] hygiene scope floor -- plugin-wide references + README reached",
  scopeGaps.length === 0 ? scopeTotals : `${scopeGaps.join("; ")} -- ${scopeTotals}`
);

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
