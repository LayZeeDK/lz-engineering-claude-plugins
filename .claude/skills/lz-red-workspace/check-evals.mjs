#!/usr/bin/env node
// check-evals.mjs -- build-time lint over evals/trigger-eval.json (lz-red trigger eval, EVL-01).
// Asserts (fail-closed; exits non-zero with a clear message on any violation):
//   (1) array of {query:string, should_trigger:boolean};
//   (2) >= 8 should_trigger:true AND >= 8 should_trigger:false;
//   (3) BOTH-seam near-misses (D-02/D-03.1): >= 2 lz-tpp green-step negatives AND
//       >= 2 lz-refactor refactor-step negatives (each seam matched independently);
//   (4) every query is ASCII-only (no byte > 0x7F);
//   (5) dual-write: negatives are byte-consistent (same strings, same order) with
//       evals/d07-chunks/negatives.json (the file the spec runner reads);
//   (6) D-03.2 reciprocal dual-write: evals/reciprocal-red.json is an array, every entry
//       should_trigger:false, byte-consistent with the trigger-eval should_trigger:true
//       positives (the RED positives re-tagged should_trigger:false for the sibling probes);
//   (7) repo hygiene (AGENTS.md): the ONLY email-shaped token in any present eval file is the
//       approved public contact -- allowlist-inversion; the forbidden value is NEVER encoded here.
//   (8) the same hygiene over the AUTHORED files of every e2e-red-* apply suite (suite.json,
//       targets.json, prompts/*.md): ASCII-only AND the email allowlist. Those are hand-written
//       prose files in a public repo and nothing else checked them mechanically.
// ponytail: single self-contained script, no framework, no config file.
// This is a local lint, NOT a claude -p run (D-11 respected).

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, extname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const evalPath = join(here, 'evals', 'trigger-eval.json');
const specNegPath = join(here, 'evals', 'd07-chunks', 'negatives.json');
const recipPath = join(here, 'evals', 'reciprocal-red.json');
const behaviorPath = join(here, 'evals', 'evals.json'); // authored by 20-02; scanned only if present

function fail(msg) {
  console.error(`check-evals: FAIL - ${msg}`);
  process.exit(1);
}

function readJson(p, label) {
  let raw;

  try {
    raw = readFileSync(p, 'utf8');
  } catch (err) {
    fail(`cannot read ${label} (${p}): ${err.message}`);
  }

  let data;

  try {
    data = JSON.parse(raw);
  } catch (err) {
    fail(`invalid JSON in ${label} (${p}): ${err.message}`);
  }

  return data;
}

const data = readJson(evalPath, 'trigger-eval.json');

// (1) schema: top-level array of {query:string, should_trigger:boolean}
if (!Array.isArray(data)) {
  fail('top-level value must be an array');
}

data.forEach((el, i) => {
  if (el === null || typeof el !== 'object' || Array.isArray(el)) {
    fail(`entry ${i} is not an object`);
  }

  if (typeof el.query !== 'string') {
    fail(`entry ${i} has a non-string \`query\``);
  }

  if (typeof el.should_trigger !== 'boolean') {
    fail(`entry ${i} has a non-boolean \`should_trigger\``);
  }
});

// (2) split: >= 8 should_trigger:true AND >= 8 should_trigger:false
const positives = data.filter((e) => e.should_trigger === true);
const negatives = data.filter((e) => e.should_trigger === false);

if (positives.length < 8) {
  fail(`need >= 8 should_trigger:true entries, found ${positives.length}`);
}

if (negatives.length < 8) {
  fail(`need >= 8 should_trigger:false entries, found ${negatives.length}`);
}

// (3) BOTH-seam near-misses (D-02/D-03.1): the near-misses must draw from BOTH sibling
//     territories so the three-way boundary is proven, not just the lz-tpp seam.
//     lz-tpp green-step seam: making an existing failing test pass / the minimal green move.
const tppSeamRe =
  /failing test|make .* pass|minimal transformation|go green|green it|smallest (edit|step)/i;
//     lz-refactor refactor-step seam: cleaning up / de-duplicating / restructuring code whose
//     tests ALREADY pass -- require a refactor-vocab cue AND a tests-green cue together, so a bare
//     "refactor for speed" (a perf ask, not the refactor step) does NOT count toward this seam.
const refactorVocabRe =
  /clean(ing)? ?up|de-?duplicat|refactor|restructure|tidy|messy|code smell/i;
const testsGreenRe =
  /tests?\s+(pass|are green|green)|green bar|all green|bar is green|already pass/i;
const tppSeamNegatives = negatives.filter((e) => tppSeamRe.test(e.query));
const refactorSeamNegatives = negatives.filter(
  (e) => refactorVocabRe.test(e.query) && testsGreenRe.test(e.query),
);

if (tppSeamNegatives.length < 2) {
  fail(
    `need >= 2 lz-tpp green-step should_trigger:false negatives, found ` +
      `${tppSeamNegatives.length} (the green-step seam is short)`,
  );
}

if (refactorSeamNegatives.length < 2) {
  fail(
    `need >= 2 lz-refactor refactor-step should_trigger:false negatives, found ` +
      `${refactorSeamNegatives.length} (the refactor-step seam is short)`,
  );
}

// (4) ASCII-only: no query byte may exceed 0x7F
data.forEach((el, i) => {
  const nonAscii = Buffer.from(el.query, 'utf8').some((b) => b > 0x7f);

  if (nonAscii) {
    fail(`entry ${i} query contains a non-ASCII byte (> 0x7F)`);
  }
});

// (5) dual-write invariant: every should_trigger:false negative must be byte-consistent
//     (same query strings, same order) with evals/d07-chunks/negatives.json, the file the
//     SPEC runner actually reads. Drift here silently measures a stale negative set.
const specNeg = readJson(specNegPath, 'd07-chunks/negatives.json');

if (!Array.isArray(specNeg)) {
  fail(`d07-chunks/negatives.json top-level value must be an array`);
}

const trigNegQueries = negatives.map((e) => e.query);
const specNegQueries = specNeg.map((e) => e.query);

if (trigNegQueries.length !== specNegQueries.length) {
  fail(
    `dual-write mismatch: trigger-eval.json has ${trigNegQueries.length} negatives ` +
      `but d07-chunks/negatives.json has ${specNegQueries.length}`,
  );
}

trigNegQueries.forEach((q, i) => {
  if (q !== specNegQueries[i]) {
    fail(
      `dual-write mismatch at negative ${i}: trigger-eval.json and d07-chunks/negatives.json ` +
        `differ (spec runner would measure a stale negative set)`,
    );
  }
});

// (6) D-03.2 reciprocal dual-write: reciprocal-red.json is the RED positives re-tagged
//     should_trigger:false (run against the lz-tpp AND lz-refactor skill-paths to prove both
//     siblings stay quiet on RED intent). Assert it is an array, every entry is
//     should_trigger:false, and its query strings byte-match the trigger-eval positives in order.
const recip = readJson(recipPath, 'reciprocal-red.json');

if (!Array.isArray(recip)) {
  fail(`reciprocal-red.json top-level value must be an array`);
}

recip.forEach((el, i) => {
  if (el === null || typeof el !== 'object' || Array.isArray(el)) {
    fail(`reciprocal-red.json entry ${i} is not an object`);
  }

  if (typeof el.query !== 'string') {
    fail(`reciprocal-red.json entry ${i} has a non-string \`query\``);
  }

  if (el.should_trigger !== false) {
    fail(
      `reciprocal-red.json entry ${i} must be should_trigger:false ` +
        `(the reciprocal set is the RED positives re-tagged to prove the siblings stay quiet)`,
    );
  }
});

const posQueries = positives.map((e) => e.query);
const recipQueries = recip.map((e) => e.query);

if (posQueries.length !== recipQueries.length) {
  fail(
    `reciprocal mismatch: trigger-eval.json has ${posQueries.length} positives ` +
      `but reciprocal-red.json has ${recipQueries.length}`,
  );
}

posQueries.forEach((q, i) => {
  if (q !== recipQueries[i]) {
    fail(
      `reciprocal mismatch at positive ${i}: reciprocal-red.json is not the exact RED positive ` +
        `set re-tagged should_trigger:false (byte-consistency broken)`,
    );
  }
});

// (7) repo hygiene (AGENTS.md allowlist-inversion): the ONLY email-shaped token permitted in any
//     committed eval file is the approved public contact. Assert-only-approved; the forbidden
//     work-email / bare domain is NEVER written here, not even as a search needle.
const APPROVED_EMAIL = 'larsbrinknielsen@gmail.com';
const EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;

function scanEmails(label, raw) {
  const matches = raw.match(EMAIL_RE) || [];

  for (const token of matches) {
    if (token.toLowerCase() !== APPROVED_EMAIL) {
      fail(
        `${label} contains a disallowed email-shaped token; the only address permitted in ` +
          `committed eval content is the approved public contact (allowlist-inversion, AGENTS.md)`,
      );
    }
  }
}

// The three files 20-01 authors are REQUIRED inputs (all read above -> guaranteed swept clean by
// this GREEN gate). evals.json is authored by the parallel 20-02; scan it opportunistically IF
// present, never as the sole hygiene guarantee for that file (20-02 owns its own gate).
scanEmails('trigger-eval.json', readFileSync(evalPath, 'utf8'));
scanEmails('d07-chunks/negatives.json', readFileSync(specNegPath, 'utf8'));
scanEmails('reciprocal-red.json', readFileSync(recipPath, 'utf8'));

if (existsSync(behaviorPath)) {
  scanEmails('evals.json', readFileSync(behaviorPath, 'utf8'));
}

// (8) the same two hygiene properties over every AUTHORED file in the RED apply suite dirs.
//
// Each suite dir is four to six hand-written, prose-heavy files -- suite.json, targets.json and one
// prompt per target -- and until now none of them was covered by anything mechanical. The radix
// suite landed four such files and they were verified BY HAND, which does not survive the next
// suite or the next author. ASCII-only matters because Windows cp1252 mangles a stray en dash or
// curly quote into mojibake the moment the file is piped anywhere; the email allowlist is
// AGENTS.md's rule for a public repo, asserted by inversion so the forbidden value is never written
// here as a needle.
//
// Scope: `.json` and `.md` under `e2e-red-*/`, skipping the gitignored runtime output that lives in
// the same dirs (`results*/`, `run-*/`, `outputs/`, `mechanical-red.json`). That output is captured
// MODEL text, not authored content, and it is not committed -- scanning it would fail this lint on
// whatever a model happened to emit.
const SUITE_SCAN_EXTS = new Set(['.json', '.md']);
const SUITE_SKIP_DIR = /^(?:results|outputs|node_modules)|^run-/;

function authoredSuiteFiles(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SUITE_SKIP_DIR.test(entry.name)) {
        authoredSuiteFiles(join(dir, entry.name), out);
      }

      continue;
    }

    if (entry.name !== 'mechanical-red.json' && SUITE_SCAN_EXTS.has(extname(entry.name))) {
      out.push(join(dir, entry.name));
    }
  }

  return out;
}

function scanNonAscii(label, raw) {
  const offending = Buffer.from(raw, 'utf8').findIndex((b) => b > 0x7f);

  if (offending !== -1) {
    fail(`${label} contains a non-ASCII byte (> 0x7F) at offset ${offending}; committed content here is ASCII-only`);
  }
}

const suiteDirs = readdirSync(here, { withFileTypes: true })
  .filter((e) => e.isDirectory() && e.name.startsWith('e2e-red-'))
  .map((e) => join(here, e.name));
let suiteFileCount = 0;

for (const suiteDir of suiteDirs) {
  for (const file of authoredSuiteFiles(suiteDir)) {
    const label = file.slice(here.length + 1).split('\\').join('/');
    const raw = readFileSync(file, 'utf8');
    scanNonAscii(label, raw);
    scanEmails(label, raw);
    suiteFileCount += 1;
  }
}

if (suiteDirs.length > 0 && suiteFileCount === 0) {
  fail(
    `found ${suiteDirs.length} e2e-red-* suite dir(s) but scanned 0 authored files in them; the hygiene ` +
      'sweep is not reaching the suite content it exists to cover (a SKIP is not a pass)',
  );
}

console.log(
  `check-evals: OK - ${data.length} queries ` +
    `(${positives.length} trigger / ${negatives.length} near-miss; ` +
    `${tppSeamNegatives.length} lz-tpp-seam + ${refactorSeamNegatives.length} lz-refactor-seam), ` +
    `reciprocal ${recip.length} all-false byte-consistent, ASCII-clean, email-allowlist-clean; ` +
    `${suiteFileCount} authored file(s) across ${suiteDirs.length} e2e-red-* suite dir(s) swept for ` +
    'non-ASCII bytes and disallowed email-shaped tokens',
);
process.exit(0);
