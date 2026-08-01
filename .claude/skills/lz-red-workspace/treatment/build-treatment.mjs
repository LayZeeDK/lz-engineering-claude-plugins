#!/usr/bin/env node
// Regenerate the D-12 TREATMENT plugin tree from tracked inputs.
//
// Why a build script instead of a committed copy: plugins/lz-tdd is 837K / 195 files, and the
// treatment differs from it in exactly TWO files. Git carries the artifact plus this script; the
// tree is built on demand into an already-gitignored directory.
//
// The shipped tree is never mutated. It IS the baseline arm of the A/B, and guard N3 forbids a
// taxonomy copy under plugins/, so both properties hold by construction rather than by discipline.
//
// Everything here fails CLOSED. A silently-skipped citation insertion would produce a treatment tree
// whose artifact is never cited, and the A/B would then measure nothing while looking healthy.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(HERE, '../../../..');
const SOURCE_DIR = path.join(REPO_ROOT, 'plugins', 'lz-tdd');
const ARTIFACT_NAME = 'test-double-taxonomy.md';
const ARTIFACT_SRC = path.join(HERE, ARTIFACT_NAME);

// HARDCODED destination, deliberately with NO env override. The first thing this script does to this
// path is a recursive delete, and an env-overridable destructive target is a foot-gun. The runner's
// TREATMENT_DIR carries the override instead, because there the value is only ever READ.
const OUT_DIR = path.join(REPO_ROOT, 'out', 'lz-tdd-treatment');

// Single-quoted strings, never template literals: the plugin-root variable must survive into the
// generated markdown verbatim rather than being substituted away at build time by Node.
const ANCHOR = '`${CLAUDE_PLUGIN_ROOT}/references/beck-tdd-by-example.md`';
const CITATION = '`${CLAUDE_PLUGIN_ROOT}/references/' + ARTIFACT_NAME + '`';
const CITATION_LINES = [
  '- Cross-author test-double vocabulary, and which side of the line each term names (plugin-wide',
  '  reference, shared with lz-refactor): ' + CITATION,
];

const SKILL_REL = path.join('skills', 'lz-red', 'SKILL.md');
const ARTIFACT_REL = path.join('references', ARTIFACT_NAME);
const MANIFEST_REL = path.join('.claude-plugin', 'plugin.json');

function fail(message) {
  console.error(`[FAIL] ${message}`);
  process.exit(1);
}

function hashFile(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

// relative path -> content hash, for every file at any depth.
function hashTree(root) {
  const out = new Map();
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        walk(full);
        continue;
      }

      if (entry.isFile()) {
        out.set(path.relative(root, full), hashFile(full));
      }
    }
  };

  walk(root);

  return out;
}

// ---------------------------------------------------------------------------------------------
// Destination safety. Asserted BEFORE anything is deleted.
// ---------------------------------------------------------------------------------------------
const dest = path.resolve(OUT_DIR);
const repoRoot = path.resolve(REPO_ROOT);
const segments = dest.split(path.sep);
const lastTwo = segments.slice(-2);

if (dest !== repoRoot && !dest.startsWith(repoRoot + path.sep)) {
  fail(`destination ${dest} is outside the repo root ${repoRoot}; refusing to delete anything`);
}

if (lastTwo[0] !== 'out' || lastTwo[1] !== 'lz-tdd-treatment') {
  fail(`destination ${dest} does not end in out/lz-tdd-treatment; refusing to delete anything`);
}

if (!fs.existsSync(SOURCE_DIR)) {
  fail(`source plugin tree missing: ${SOURCE_DIR}`);
}

if (!fs.existsSync(ARTIFACT_SRC)) {
  fail(`treatment artifact missing: ${ARTIFACT_SRC}`);
}

// ---------------------------------------------------------------------------------------------
// Build.
// ---------------------------------------------------------------------------------------------
fs.rmSync(dest, { recursive: true, force: true });
fs.cpSync(SOURCE_DIR, dest, { recursive: true });

const artifactOut = path.join(dest, ARTIFACT_REL);
fs.mkdirSync(path.dirname(artifactOut), { recursive: true });
fs.copyFileSync(ARTIFACT_SRC, artifactOut);

const skillPath = path.join(dest, SKILL_REL);

if (!fs.existsSync(skillPath)) {
  fail(`copied skill missing: ${skillPath}`);
}

const skillLines = fs.readFileSync(skillPath, 'utf8').split(/\r?\n/);
const anchorAt = skillLines.reduce((acc, line, i) => (line.includes(ANCHOR) ? acc.concat(i) : acc), []);

if (anchorAt.length !== 1) {
  fail(`anchor count is ${anchorAt.length}, expected exactly 1, in ${SKILL_REL}. A zero-match insertion would yield a treatment tree whose artifact is never cited.`);
}

skillLines.splice(anchorAt[0] + 1, 0, ...CITATION_LINES);
fs.writeFileSync(skillPath, skillLines.join('\n'));

// ---------------------------------------------------------------------------------------------
// Post-build assertions. All fail closed, all printed.
// ---------------------------------------------------------------------------------------------
const manifestPath = path.join(dest, MANIFEST_REL);

if (!fs.existsSync(manifestPath)) {
  fail(`generated tree has no ${MANIFEST_REL}; --plugin-dir would not load it`);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

if (manifest.name !== 'lz-tdd') {
  fail(`generated manifest name is ${JSON.stringify(manifest.name)}, expected "lz-tdd". Any other name breaks the forced slash command and the plugin-root variable, turning the treatment arm into a second baseline.`);
}

const citationCount = fs.readFileSync(skillPath, 'utf8').split(CITATION).length - 1;

if (citationCount !== 1) {
  fail(`citation occurs ${citationCount} time(s) in the generated ${SKILL_REL}, expected exactly 1`);
}

const before = hashTree(SOURCE_DIR);
const after = hashTree(dest);
const deltas = [];

for (const [rel, hash] of after) {
  if (!before.has(rel)) {
    deltas.push(`added   ${rel}`);
    continue;
  }

  if (before.get(rel) !== hash) {
    deltas.push(`edited  ${rel}`);
  }
}

for (const rel of before.keys()) {
  if (!after.has(rel)) {
    deltas.push(`removed ${rel}`);
  }
}

const expected = [`added   ${ARTIFACT_REL}`, `edited  ${SKILL_REL}`].sort();

if (deltas.length !== 2 || deltas.slice().sort().join('|') !== expected.join('|')) {
  fail(`expected exactly 2 deltas (the added artifact and the edited SKILL.md), got ${deltas.length}:\n  ${deltas.join('\n  ')}`);
}

console.log(`[OK] treatment tree built at ${path.relative(repoRoot, dest)} (plugin name: ${manifest.name})`);

for (const delta of deltas) {
  console.log(`[OK] delta: ${delta}`);
}

console.log(`[OK] source tree ${path.relative(repoRoot, SOURCE_DIR)} untouched: ${before.size} files read, 0 written`);
