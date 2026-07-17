#!/usr/bin/env node
// Deterministic grader for the REFERENCE-CATALOG eval (quick 260714-nxp).
//
// Unlike grade-run.mjs (the EVL-02 coach grader, which routes smell->layer), this grades
// book-independent FACT tokens: real Fowler/Kerievsky book contents, real 1st->2nd-ed
// renames/merges, real Refactoring-Directions-table MEMBERSHIP, and real smell/print-vs-web
// provenance. It NEVER grades the skill's own invented conventions (To-vs-Towards semantics, the
// n/a sentinel, N:1 groupings) -- see e2e-reference/README.md and targets.json for the fairness rule.
// It re-derives the word-bounded nameRe matcher and the comb/passAtK/passHatK helpers locally
// (grade-run.mjs and run-e2e.mjs have NO exports and run main() on load, so importing either would
// execute the whole file); re-deriving a few lines is the smaller, lower-risk diff.
//
// A question is CORRECT iff: every mustName.all token is AFFIRMED, every mustName.anyOf group has
// >=1 AFFIRMED token, and NO mustNotClaim token is affirmed (present un-negated). "Affirmed" =
// the token appears at least once and that occurrence is NOT negated in its clause -- this stops a
// correct "not a Fowler smell, it is Kerievsky's" from being mis-scored AND stops a wrong "neither
// Fowler nor Kerievsky" from a false pass on a bare-presence match.
//
// Usage:
//   node grade-reference.mjs --target <id> --output <answer.md> --out <grading.json>
//   node grade-reference.mjs --aggregate [--suite <dir>]   # walk results/, write aggregate.json
//   node grade-reference.mjs --selfcheck

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));

function argVal(flag, def) {
  const i = process.argv.indexOf(flag);

  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : def;
}

const SUITE_DIR = path.resolve(argVal("--suite", path.join(HERE, "e2e-reference")));

// ---- word-bounded name matcher (copied from grade-run.mjs; identical semantics) ----
// Case-insensitive, whitespace/newline tolerant, WORD-BOUNDED so "Extract Function" never
// sub-matches "Extract Functionality".
function nameRe(canonical) {
  const esc = canonical
    .trim()
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&") // escape regex metacharacters
    .replace(/\s+/g, "\\s+"); // tolerate any run of whitespace (incl. newlines) between words

  return new RegExp(`(?<![\\w-])${esc}(?![\\w-])`, "i");
}

// Global variant of the same pattern, for scanning every occurrence.
function nameReAll(canonical) {
  return new RegExp(nameRe(canonical).source, "gi");
}

// ---- clause-scoped, BIDIRECTIONAL negation awareness ----
// A token is a real claim only when it is not negated looking in EITHER direction from the
// occurrence, and is not set up as a hedged hypothetical that a later contrast retracts. This
// catches three shapes the original backward-only scan missed:
//   - forward negation:   "Kerievsky does NOT classify this as a smell"      (token then NEG)
//   - hedged contrastive: "you might GUESS a Fowler smell, BUT actually Kerievsky's"
//   - (still) backward:   "NOT a Fowler smell, it is Kerievsky's"
// Clause boundaries are punctuation; a coordinating/contrastive conjunction also ends a token's
// forward scope (a negation on the far side of "and"/"but" belongs to a different predicate), so
// "a Kerievsky smell and does not appear in Fowler" still affirms Kerievsky.
// ponytail: punctuation + conjunction + hedge heuristics, not a parser. Applied identically to both
// arms, so an occasional mis-read cancels in the delta. Upgrade to a real clause splitter only if a
// graded phrasing proves systematically mis-scored between arms.
const NEG = /\b(?:not|no|never|neither|nor|without|isn't|aren't|wasn't|weren't|doesn't|don't|didn't|cannot|n't)\b/i;
const CONTRAST = /\b(?:but|however|rather|instead|whereas|while|though|although|yet)\b/gi;
// Coordinating/contrastive conjunctions that end a token's forward negation scope.
const FWD_BOUNDARY = /\b(?:and|or|but|however|rather|instead|whereas|while|though|although|yet|because|since|so|plus)\b/i;
// Hedge cues that mark a following token as a hypothetical guess (the "you might guess X" setup).
const HEDGE = /\b(?:might|may|could|would)\s+(?:guess|think|assume|suppose|expect|imagine|say|be\s+tempted)\b|\bat\s+first(?:\s+glance|\s+blush)?\b|\binitially\b|\bnaively\b|\bon\s+first\s+read\b|\btempting\s+to\s+(?:say|think|guess|assume)\b/i;
// Contrast cues, scanned FORWARD of a hedged token, that spring the retraction ("...BUT actually Y").
const CONTRAST_FWD = /\b(?:but|however|actually|instead|rather|whereas|yet|in\s+fact|really)\b/i;

function clauseBefore(resp, idx) {
  let start = idx;

  while (start > 0 && !".,;:!?\n".includes(resp[start - 1])) {
    start--;
  }

  let clause = resp.slice(start, idx);
  const cm = [...clause.matchAll(CONTRAST)];

  if (cm.length) {
    const last = cm[cm.length - 1];
    clause = clause.slice(last.index + last[0].length);
  }

  return clause;
}

// Text AFTER the token up to the next punctuation, truncated at the first coordinating/contrastive
// conjunction so a negation past "and"/"but" is not mis-attributed to this token.
function clauseAfter(resp, end) {
  let stop = end;

  while (stop < resp.length && !".,;:!?\n".includes(resp[stop])) {
    stop++;
  }

  let clause = resp.slice(end, stop);
  const fm = clause.search(FWD_BOUNDARY);

  if (fm >= 0) {
    clause = clause.slice(0, fm);
  }

  return clause;
}

// The sentence (bounded by . ! ? newline) split around the token occurrence.
function sentenceAround(resp, idx, end) {
  let s = idx;

  while (s > 0 && !".!?\n".includes(resp[s - 1])) {
    s--;
  }

  let e = end;

  while (e < resp.length && !".!?\n".includes(resp[e])) {
    e++;
  }

  return { before: resp.slice(s, idx), after: resp.slice(end, e) };
}

// "you might guess X, but actually Y": a hedge before the token and a contrast after it (same
// sentence) mark the token as a retracted hypothetical, not an affirmed claim.
function hedgedContrastive(resp, idx, end) {
  const { before, after } = sentenceAround(resp, idx, end);

  return HEDGE.test(before) && CONTRAST_FWD.test(after);
}

// Token appears at least once as a real claim: present, negated in NEITHER direction, and not a
// hedged-then-retracted hypothetical.
function occursAffirmed(resp, token) {
  const re = nameReAll(token);
  let m;

  while ((m = re.exec(resp)) !== null) {
    const idx = m.index;
    const end = idx + m[0].length;
    const negated = NEG.test(clauseBefore(resp, idx)) || NEG.test(clauseAfter(resp, end));

    if (!negated && !hedgedContrastive(resp, idx, end)) {
      return true;
    }

    if (re.lastIndex === m.index) {
      re.lastIndex++;
    }
  }

  return false;
}

// ---- per-question grade ----
function gradeOne(target, resp) {
  const checks = [];
  const all = (target.mustName && target.mustName.all) || [];

  for (const t of all) {
    const passed = occursAffirmed(resp, t);
    checks.push({ kind: "mustName.all", token: t, passed, evidence: passed ? `affirmed "${t}"` : `missing/negated "${t}"` });
  }

  const anyOf = (target.mustName && target.mustName.anyOf) || [];

  for (const group of anyOf) {
    const hits = group.filter((t) => occursAffirmed(resp, t));
    const passed = hits.length > 0;
    checks.push({ kind: "mustName.anyOf", group, passed, evidence: passed ? `hit: ${hits.join(", ")}` : `none of [${group.join(", ")}]` });
  }

  const forbidden = target.mustNotClaim || [];

  for (const t of forbidden) {
    const claimed = occursAffirmed(resp, t);
    checks.push({ kind: "mustNotClaim", token: t, passed: !claimed, evidence: claimed ? `forbidden claim present: "${t}"` : `absent/negated "${t}"` });
  }

  const correct = checks.length > 0 && checks.every((c) => c.passed);

  return { id: target.id, correct, checks };
}

// ---- Pass@k / Pass^k (copied from run-e2e.mjs; identical semantics) ----
function comb(n, r) {
  if (r < 0 || r > n) {
    return 0;
  }

  r = Math.min(r, n - r);
  let num = 1;
  let den = 1;

  for (let i = 0; i < r; i++) {
    num *= n - i;
    den *= i + 1;
  }

  return num / den;
}

function passAtK(n, c, k) {
  return k > n ? null : 1 - comb(n - c, k) / comb(n, k);
}

function passHatK(n, c, k) {
  return k > n ? null : comb(c, k) / comb(n, k);
}

const ARMS = ["no_skill", "invoke_skill", "with_skill"];

function median(xs) {
  if (!xs.length) {
    return null;
  }

  const s = [...xs].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);

  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

// ---- aggregate: per-question per-arm correct-rate + primary A/B delta + Pass@k + verbosity guard ----
// perArmQ shape: { <arm>: { <qid>: [bool, ...] } }. perArmChars shape: { <arm>: [answer_chars, ...] }.
function aggregate(perArmQ, targets, perArmChars = {}) {
  const questions = {};

  for (const t of targets) {
    const rates = {};
    const passk = {};

    for (const arm of ARMS) {
      const results = (perArmQ[arm] && perArmQ[arm][t.id]) || [];
      const n = results.length;
      const c = results.filter(Boolean).length;
      rates[arm] = n ? c / n : null;
      passk[arm] = { n, c, passAt1: passAtK(n, c, 1), passAt3: passAtK(n, c, 3), passHat3: passHatK(n, c, 3) };
    }

    const delta =
      rates.invoke_skill !== null && rates.no_skill !== null ? rates.invoke_skill - rates.no_skill : null;
    questions[t.id] = { class: t.class, independent: !!t.independent, control: !!t.control, rates, delta, passk };
  }

  const discDeltas = targets
    .filter((t) => t.independent && !t.control)
    .map((t) => questions[t.id].delta)
    .filter((d) => d !== null);
  const positives = discDeltas.filter((d) => d > 0);
  const mean = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);

  // Verbosity guard: median answer length per arm. A skill arm with a much larger median may be
  // winning on token-naming/verbosity rather than recall -- weigh deltas against this (the saturated
  // qc1/qc2 controls cannot catch it on their own).
  const charStats = {};

  for (const arm of ARMS) {
    const chars = perArmChars[arm] || [];
    charStats[arm] = { n: chars.length, median_answer_chars: median(chars) };
  }

  return {
    questions,
    summary: {
      n_discriminating: discDeltas.length,
      mean_delta: mean(discDeltas),
      mean_positive_delta: positives.length ? mean(positives) : 0,
      n_positive: positives.length,
      discriminating_deltas: discDeltas,
    },
    charStats,
  };
}

function loadTargets() {
  const doc = JSON.parse(fs.readFileSync(path.join(SUITE_DIR, "targets.json"), "utf8"));

  return doc.targets;
}

function walkResults(targets) {
  const perArmQ = {};
  const perArmChars = {};
  const modeDir = path.join(SUITE_DIR, "results", "recommend");

  if (!fs.existsSync(modeDir)) {
    return { perArmQ, perArmChars };
  }

  for (const arm of fs.readdirSync(modeDir)) {
    const armDir = path.join(modeDir, arm);

    if (!fs.statSync(armDir).isDirectory()) {
      continue;
    }

    perArmQ[arm] = {};
    perArmChars[arm] = [];

    for (const qid of fs.readdirSync(armDir)) {
      const qDir = path.join(armDir, qid);

      if (!fs.statSync(qDir).isDirectory()) {
        continue;
      }

      const target = targets.find((t) => t.id === qid);

      if (!target) {
        continue;
      }

      const results = [];

      for (const run of fs.readdirSync(qDir)) {
        const runDir = path.join(qDir, run);
        const ans = path.join(runDir, "answer.md");

        if (fs.existsSync(ans)) {
          results.push(gradeOne(target, fs.readFileSync(ans, "utf8")).correct);
        }

        const metaP = path.join(runDir, "meta.json");

        if (fs.existsSync(metaP)) {
          try {
            const meta = JSON.parse(fs.readFileSync(metaP, "utf8"));

            if (typeof meta.answer_chars === "number") {
              perArmChars[arm].push(meta.answer_chars);
            }
          } catch {
            // ignore an unreadable meta.json; the answer still grades
          }
        }
      }

      perArmQ[arm][qid] = results;
    }
  }

  return { perArmQ, perArmChars };
}

const fmt = (v) => (v === null || v === undefined ? "  -  " : Number(v).toFixed(2));
const sgn = (v) => (v === null || v === undefined ? "  -  " : (v >= 0 ? "+" : "") + v.toFixed(2));

function printTable(agg, targets) {
  const row = (t) => {
    const q = agg.questions[t.id];
    console.log(
      `${t.id.padEnd(5)} ${(t.class || "").padEnd(8)} ` +
        `no_skill ${fmt(q.rates.no_skill)}  invoke ${fmt(q.rates.invoke_skill)}  with ${fmt(q.rates.with_skill)}  ` +
        `DELTA ${sgn(q.delta)}  p@1(no/inv) ${fmt(q.passk.no_skill.passAt1)}/${fmt(q.passk.invoke_skill.passAt1)}`,
    );
  };

  console.log("\n=== discriminating (q1-q12) -- book-independent facts ===");

  for (const t of targets.filter((t) => t.independent && !t.control)) {
    row(t);
  }

  console.log("\n=== controls (qc1-qc2) -- saturation, reported separately ===");

  for (const t of targets.filter((t) => t.control)) {
    row(t);
  }

  console.log(
    `\nDELTA = invoke_skill_rate - no_skill_rate (primary A/B).  ` +
      `discriminating: ${agg.summary.n_positive}/${agg.summary.n_discriminating} positive; ` +
      `mean delta ${sgn(agg.summary.mean_delta)}; mean positive delta ${sgn(agg.summary.mean_positive_delta)}.`,
  );
  console.log("A skill that also wins the controls is being verbose -- discount the discriminating edge.");

  console.log("\n=== per-arm answer length (verbosity guard) -- median answer_chars ===");

  for (const arm of ARMS) {
    const cs = (agg.charStats && agg.charStats[arm]) || { n: 0, median_answer_chars: null };
    console.log(`${arm.padEnd(12)} n=${String(cs.n).padStart(3)}  median_chars ${cs.median_answer_chars === null ? "  -  " : cs.median_answer_chars}`);
  }

  console.log("A skill arm with a much larger median answer length may be winning on token-naming/verbosity, not recall.");
}

function runAggregate() {
  const targets = loadTargets();
  const { perArmQ, perArmChars } = walkResults(targets);
  const armsSeen = Object.keys(perArmQ);

  if (!armsSeen.length) {
    console.log(`no results under ${path.join(SUITE_DIR, "results", "recommend")} -- run the eval first (gated on spend approval).`);

    return;
  }

  // Refuse to emit a verdict over a silently-truncated / unbalanced sample. walkResults
  // grades a run only when its answer.md exists, so a killed or timed-out run drops from
  // the cell with no signal -- biasing the A/B delta (unequal n across arms) or nulling a
  // whole question out of the discriminating summary. Require every (arm, qid) cell to hold
  // as many runs as the fullest cell for that qid; list any shortfall and exit non-zero.
  const shortfalls = [];

  for (const t of targets) {
    const counts = armsSeen.map((arm) => (perArmQ[arm]?.[t.id] || []).length);
    const expected = Math.max(0, ...counts);

    // A question with zero runs in EVERY arm would otherwise pass the per-cell balance check (all
    // counts equal 0) and be silently dropped from the discriminating summary. Refuse instead.
    if (expected === 0) {
      shortfalls.push(`${t.id}: 0 runs in all arms`);
      continue;
    }

    armsSeen.forEach((arm, i) => {
      if (counts[i] < expected) {
        shortfalls.push(`${arm}/${t.id}: ${counts[i]}/${expected} runs`);
      }
    });
  }

  if (shortfalls.length) {
    console.error("AGGREGATE REFUSED -- incomplete/unbalanced sample (re-run the missing indices):");

    for (const s of shortfalls) {
      console.error(`  ${s}`);
    }

    process.exit(1);
  }

  const agg = aggregate(perArmQ, targets, perArmChars);
  printTable(agg, targets);
  const outPath = path.join(SUITE_DIR, "aggregate.json");
  fs.writeFileSync(outPath, JSON.stringify({ suite: path.basename(SUITE_DIR), arms: armsSeen, ...agg }, null, 2) + "\n");
  console.log(`\nwrote ${outPath}`);
}

function gradeTargetToFile(args) {
  const targets = loadTargets();
  const target = targets.find((t) => t.id === args.target);

  if (!target) {
    console.error(`--target ${args.target} not found in ${path.join(SUITE_DIR, "targets.json")} (have ${targets.map((t) => t.id).join(", ")})`);
    process.exit(2);
  }

  let resp;

  try {
    resp = fs.readFileSync(args.output, "utf8");
  } catch (e) {
    console.error(`cannot read --output ${args.output}: ${e.message}`);
    process.exit(2);
  }

  const result = gradeOne(target, resp);

  try {
    fs.writeFileSync(args.out, JSON.stringify(result, null, 2) + "\n");
  } catch (e) {
    console.error(`cannot write ${args.out}: ${e.message}`);
    process.exit(2);
  }

  console.log(`graded ${target.id}: ${result.correct ? "CORRECT" : "incorrect"} -> ${args.out}`);
}

function selfcheck() {
  let ok = true;
  const assert = (cond, msg) => {
    if (!cond) {
      ok = false;
      console.error("SELFCHECK FAIL:", msg);
    }
  };

  // (a) matcher: word-bounded + whitespace/newline tolerant.
  assert(occursAffirmed("do an Extract Function on the totals block", "Extract Function"), "matches exact phrase");
  assert(occursAffirmed("Extract  Function", "Extract Function"), "tolerant of extra spaces");
  assert(occursAffirmed("apply Slide\n  Statements next", "Slide Statements"), "tolerant of newline/indent");
  assert(!occursAffirmed("this is just Extract Functionality", "Extract Function"), "no sub-match of a longer word");
  assert(!occursAffirmed("call moveFunction() here", "Move Function"), "no match inside a run-together identifier");

  // negation awareness (clause-scoped): preceding negation suppresses; boundaries reset it.
  assert(!occursAffirmed("it is not in the print edition", "in the print edition"), "same-clause preceding negation suppresses");
  assert(occursAffirmed("yes, it is in the print edition", "in the print edition"), "un-negated occurrence counts");
  assert(occursAffirmed("It is not a Fowler smell. It is a Kerievsky smell.", "Kerievsky"), "negation does not cross a sentence boundary");
  assert(occursAffirmed("It is a Kerievsky smell, not a Fowler smell.", "Kerievsky"), "negation does not cross a comma boundary");
  assert(occursAffirmed("not a Fowler smell but a Kerievsky one", "Kerievsky"), "negation does not cross a contrastive conjunction");
  assert(!occursAffirmed("catalogued by neither Fowler nor Kerievsky", "Kerievsky"), "clause-level neither/nor suppresses (no false pass)");

  // (fix #2) BIDIRECTIONAL negation: a NEG that FOLLOWS the token in its clause also suppresses it.
  assert(!occursAffirmed("Kerievsky does not classify this as a smell; Fowler introduced it", "Kerievsky"), "(fix2) forward negation suppresses (no false pass)");
  assert(occursAffirmed("This is a Kerievsky smell and does not appear in Fowler.", "Kerievsky"), "(fix2) forward NEG past a coordinating conjunction does NOT suppress this token");
  assert(occursAffirmed("Kerievsky, not Fowler, catalogues it.", "Kerievsky"), "(fix2) NEG in the next clause does not cross the comma boundary");
  // (fix #2) hedged-contrastive retraction: "you might guess X, but actually Y".
  assert(!occursAffirmed("you might guess it is a Fowler smell, but it is actually catalogued by Kerievsky", "a Fowler smell"), "(fix2) hedged-then-retracted token is not an affirmed claim");
  assert(occursAffirmed("you might guess it is a Fowler smell, but it is actually catalogued by Kerievsky", "Kerievsky"), "(fix2) the retained (post-contrast) answer is still affirmed");
  const provTarget = {
    id: "prov",
    mustName: { all: ["Kerievsky"], anyOf: [] },
    mustNotClaim: ["a Fowler smell", "both authors", "both catalogs", "Fowler and Kerievsky", "catalogued by neither", "by neither of them"],
  };
  assert(gradeOne(provTarget, "you might guess it is a Fowler smell, but it is actually catalogued by Kerievsky").correct === true, "(fix2) hedged 'might guess X but actually Y' grades CORRECT (no false-fail)");
  assert(gradeOne(provTarget, "Kerievsky does not classify this as a smell; Fowler introduced it").correct === false, "(fix2) forward-negated mustName grades INCORRECT (no false-pass)");

  // (fix #3) a "both"/"neither" attribution fails a Kerievsky-unique provenance even when Kerievsky is named.
  assert(gradeOne(provTarget, "It is a Kerievsky smell, catalogued by both authors.").correct === false, "(fix3) 'both authors' attribution fails");
  assert(gradeOne(provTarget, "Both Fowler and Kerievsky catalogue this smell.").correct === false, "(fix3) 'Fowler and Kerievsky' (both) attribution fails");
  assert(gradeOne(provTarget, "It is a Kerievsky smell, catalogued by neither of them exclusively.").correct === false, "(fix3) 'by neither of them' attribution fails");

  // (fix #1) q6 provenance: bare 'both' no longer passes; specific phrasings do.
  const q6Target = {
    id: "q6t",
    mustName: { all: [], anyOf: [["both authors", "both catalogs", "both books", "Fowler and Kerievsky", "named by both", "catalogued by both", "appears in both catalogs"]] },
    mustNotClaim: [],
  };
  assert(gradeOne(q6Target, "It appears in both editions of his book, catalogued by Fowler.").correct === false, "(fix1) bare 'both' (both editions) no longer passes q6");
  assert(gradeOne(q6Target, "It is catalogued by both authors.").correct === true, "(fix1) specific 'both authors' passes q6");
  assert(gradeOne(q6Target, "Both Fowler and Kerievsky catalogue it.").correct === true, "(fix1) 'Fowler and Kerievsky' passes q6");

  // (fix #4) q10 existence: broadened negative phrasings all pass.
  const q10Target = {
    id: "q10t",
    mustName: { all: [], anyOf: [["no Extract Interface", "does not include an Extract Interface", "does not contain an Extract Interface", "lacks an Extract Interface", "omits Extract Interface", "has no Extract Interface", "Extract Interface is absent"]] },
    mustNotClaim: [],
  };
  assert(gradeOne(q10Target, "The second edition does not contain an Extract Interface refactoring.").correct === true, "(fix4) 'does not contain' phrasing passes q10");
  assert(gradeOne(q10Target, "It lacks an Extract Interface entirely.").correct === true, "(fix4) 'lacks' phrasing passes q10");
  assert(gradeOne(q10Target, "The book has no Extract Interface.").correct === true, "(fix4) 'has no' phrasing passes q10");
  assert(gradeOne(q10Target, "Yes, it contains an Extract Interface refactoring.").correct === false, "(fix4) an affirmative 'contains' answer does NOT pass q10");

  // (b)-(e) fixtures via a mini target (mustName.all + anyOf + mustNotClaim).
  const t = {
    id: "t",
    mustName: { all: ["Kerievsky"], anyOf: [["Module Namespace", "module of functions"]] },
    mustNotClaim: ["a Fowler smell"],
  };
  assert(gradeOne(t, "This is a Kerievsky smell; dissolve it into a Module Namespace.").correct === true, "(b) correct fixture: all + anyOf hit + no forbidden -> true");
  assert(gradeOne(t, "Dissolve it into a Module Namespace.").correct === false, "(c) missing mustName.all token -> false");
  assert(gradeOne(t, "A Kerievsky move but also a Fowler smell; use a Module Namespace.").correct === false, "(d) un-negated mustNotClaim -> false");
  assert(gradeOne(t, "It is a Kerievsky smell, not a Fowler smell; use a Module Namespace.").correct === true, "(d2) negated mustNotClaim is not a claim -> true");
  assert(gradeOne(t, "A Kerievsky smell; use a module of functions instead.").correct === true, "(e) anyOf: a single member hit passes");
  const t2 = { id: "t2", mustName: { all: [], anyOf: [["Module Namespace", "module of functions"]] }, mustNotClaim: [] };
  assert(gradeOne(t2, "just a plain module here").correct === false, "(e2) anyOf: zero hits -> false");

  // (f) delta math + Pass@k on a fabricated in-memory results set.
  const dtargets = [
    { id: "q1", class: "FC-1a", independent: true, control: false },
    { id: "qc1", class: "control", independent: false, control: true },
  ];
  const perArmQ = {
    no_skill: { q1: [false, false, true], qc1: [true, true, true] },
    invoke_skill: { q1: [true, true, true], qc1: [true, true, true] },
    with_skill: { q1: [true, false, true], qc1: [true, true, true] },
  };
  const perArmChars = { no_skill: [100, 300, 200], invoke_skill: [500, 700], with_skill: [] };
  const agg = aggregate(perArmQ, dtargets, perArmChars);
  assert(Math.abs(agg.questions.q1.rates.no_skill - 1 / 3) < 1e-9, "no_skill rate = 1/3");
  assert(Math.abs(agg.questions.q1.rates.invoke_skill - 1) < 1e-9, "invoke_skill rate = 1");
  assert(Math.abs(agg.questions.q1.delta - (1 - 1 / 3)) < 1e-9, "delta = invoke_rate - no_skill_rate");
  assert(Math.abs(agg.questions.q1.passk.invoke_skill.passAt1 - 1) < 1e-9, "invoke pass@1 = 1 (all pass)");
  assert(agg.questions.q1.passk.no_skill.passHat3 === passHatK(3, 1, 3), "no_skill pass^3 matches helper");
  assert(agg.summary.n_discriminating === 1, "controls excluded from discriminating summary");
  assert(Math.abs(agg.summary.mean_positive_delta - (1 - 1 / 3)) < 1e-9, "mean positive delta over discriminating");

  // (fix #10) per-arm median answer_chars in the aggregate (verbosity guard).
  assert(agg.charStats.no_skill.median_answer_chars === 200, "(fix10) odd-count median = middle value");
  assert(agg.charStats.invoke_skill.median_answer_chars === 600, "(fix10) even-count median = mean of the middle two");
  assert(agg.charStats.with_skill.median_answer_chars === null, "(fix10) empty arm -> null median");
  assert(agg.charStats.no_skill.n === 3 && agg.charStats.invoke_skill.n === 2, "(fix10) per-arm sample counts recorded");

  // fairness guard: NO direction word is a graded token anywhere in the shipped targets.json.
  const DIRWORDS = /\b(?:away|towards?|de-?pattern(?:ing|ed)?|dismantle|retreat)\b/i;
  let doc;

  try {
    doc = JSON.parse(fs.readFileSync(path.join(SUITE_DIR, "targets.json"), "utf8"));
  } catch (e) {
    assert(false, `cannot read targets.json: ${e.message}`);
    doc = { targets: [] };
  }

  for (const tg of doc.targets) {
    const tokens = [
      ...((tg.mustName && tg.mustName.all) || []),
      ...(((tg.mustName && tg.mustName.anyOf) || []).flat()),
      ...(tg.mustNotClaim || []),
    ];

    for (const tok of tokens) {
      assert(!DIRWORDS.test(tok), `direction word graded in ${tg.id}: "${tok}"`);
    }
  }

  // every suite prompt id has a targets.json entry.
  try {
    const suite = JSON.parse(fs.readFileSync(path.join(SUITE_DIR, "suite.json"), "utf8"));
    const ids = new Set(doc.targets.map((t) => t.id));

    for (const p of suite.prompts) {
      assert(ids.has(p.id), `targets.json missing an entry for prompt ${p.id}`);
    }

    for (const p of suite.prompts) {
      assert(p.code === false, `prompt ${p.id} must be code:false (recommend-only reference suite)`);
    }
  } catch (e) {
    assert(false, `suite/targets alignment check failed: ${e.message}`);
  }

  console.log(ok ? "SELFCHECK OK" : "SELFCHECK FAILED");
  process.exit(ok ? 0 : 1);
}

function parseArgs(argv) {
  const a = {};

  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];

    if (k === "--selfcheck") {
      a.selfcheck = true;
    } else if (k === "--aggregate") {
      a.aggregate = true;
    } else if (k === "--suite") {
      a.suite = argv[++i]; // consumed at load via argVal; accept here too
    } else if (k.startsWith("--") && k.includes("=")) {
      const idx = k.indexOf("=");
      a[k.slice(2, idx)] = k.slice(idx + 1);
    } else if (k.startsWith("--")) {
      a[k.slice(2)] = argv[++i];
    }
  }

  return a;
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.selfcheck) {
    selfcheck();

    return;
  }

  if (args.aggregate) {
    runAggregate();

    return;
  }

  if (args.target && args.output && args.out) {
    gradeTargetToFile(args);

    return;
  }

  console.error("usage:\n  node grade-reference.mjs --target <id> --output <answer.md> --out <grading.json>\n  node grade-reference.mjs --aggregate [--suite <dir>]\n  node grade-reference.mjs --selfcheck");
  process.exit(2);
}

main();
