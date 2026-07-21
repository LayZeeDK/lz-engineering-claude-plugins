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
// ponytail: single self-contained script, no framework, no config file.
// This is a local lint, NOT a claude -p run (D-11 respected).

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

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

console.log(
  `check-evals: OK - ${data.length} queries ` +
    `(${positives.length} trigger / ${negatives.length} near-miss; ` +
    `${tppSeamNegatives.length} lz-tpp-seam + ${refactorSeamNegatives.length} lz-refactor-seam), ` +
    `reciprocal ${recip.length} all-false byte-consistent, ASCII-clean, email-allowlist-clean`,
);
process.exit(0);
