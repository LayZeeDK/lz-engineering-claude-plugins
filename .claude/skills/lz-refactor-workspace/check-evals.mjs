#!/usr/bin/env node
// check-evals.mjs -- build-time lint over evals/trigger-eval.json.
// Asserts: (1) array of {query:string, should_trigger:boolean};
//          (2) >= 8 should_trigger:true AND >= 8 should_trigger:false;
//          (3) >= 2 should_trigger:false entries are lz-tpp-seam green-step negatives;
//          (4) every query is ASCII-only (no byte > 0x7F);
//          (5) D-12 dual-write: negatives are byte-consistent (same strings, same order)
//              with evals/d07-chunks/negatives.json (the file the spec runner reads).
// Exits non-zero with a clear message on any violation (fail-closed).
// ponytail: single self-contained script, no framework, no config file.
// This is a local lint, NOT a claude -p run (D-10 respected).

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const evalPath = join(here, 'evals', 'trigger-eval.json');
const specNegPath = join(here, 'evals', 'd07-chunks', 'negatives.json');

function fail(msg) {
  console.error(`check-evals: FAIL - ${msg}`);
  process.exit(1);
}

let raw;

try {
  raw = readFileSync(evalPath, 'utf8');
} catch (err) {
  fail(`cannot read ${evalPath}: ${err.message}`);
}

let data;

try {
  data = JSON.parse(raw);
} catch (err) {
  fail(`invalid JSON in ${evalPath}: ${err.message}`);
}

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

// (3) >= 2 lz-tpp-seam green-step negatives (the highest-value specificity probes)
const seamRe =
  /failing test|make .* pass|minimal transformation|go green|green it|smallest (edit|step)/i;
const seamNegatives = negatives.filter((e) => seamRe.test(e.query));

if (seamNegatives.length < 2) {
  fail(
    `need >= 2 lz-tpp-seam should_trigger:false negatives, found ${seamNegatives.length}`,
  );
}

// (4) ASCII-only: no query byte may exceed 0x7F
data.forEach((el, i) => {
  const nonAscii = Buffer.from(el.query, 'utf8').some((b) => b > 0x7f);

  if (nonAscii) {
    fail(`entry ${i} query contains a non-ASCII byte (> 0x7F)`);
  }
});

// (5) D-12 dual-write invariant: every should_trigger:false negative must be
//     byte-consistent (same query strings, same order) with evals/d07-chunks/negatives.json,
//     the file the SPEC runner actually reads. Drift here silently makes the spec runner
//     measure a stale negative set, invalidating the SC1 specificity guarantee.
let specRaw;

try {
  specRaw = readFileSync(specNegPath, 'utf8');
} catch (err) {
  fail(`cannot read ${specNegPath}: ${err.message}`);
}

let specNeg;

try {
  specNeg = JSON.parse(specRaw);
} catch (err) {
  fail(`invalid JSON in ${specNegPath}: ${err.message}`);
}

if (!Array.isArray(specNeg)) {
  fail(`${specNegPath} top-level value must be an array`);
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

console.log(
  `check-evals: OK - ${data.length} queries ` +
    `(${positives.length} trigger / ${negatives.length} near-miss; ` +
    `${seamNegatives.length} lz-tpp-seam negatives), ASCII-clean`,
);
process.exit(0);
