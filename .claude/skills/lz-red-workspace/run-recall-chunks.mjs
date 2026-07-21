// Resumable, canary-gated RECALL runner for EVAL-01 (mirror of run-spec-chunks.mjs for positives).
// Sustained back-to-back claude -p probes throttle and read as false non-triggers; small chunks run
// in a healthy window. Each chunk of should-trigger queries carries a reliable positive CANARY; a
// chunk is VALID only if the canary fired (>=0.5) -- proving a non-throttled window -- so a measured
// positive that did NOT fire in that same healthy window is a TRUE recall miss, not throttling.
// Re-running skips already-valid chunks (resume). Idempotent.
//   node run-recall-chunks.mjs           # run/resume all chunks
//   node run-recall-chunks.mjs --report  # print combined result, run nothing
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

// Resolve roots from this file's location (workspace root) so the runner works on any
// clone / CI, not just the maintainer's checkout. Normalize to forward slashes so the
// downstream `WS + "/..."` concatenation is unchanged on every platform.
const WS = path.dirname(fileURLToPath(import.meta.url)).replace(/\\/g, "/");
const TOOL_DIR = WS + "/tools/skill-creator-eval";
const SKILL = path.resolve(WS, "..", "..", "..", "plugins", "lz-tdd", "skills", "lz-red").replace(/\\/g, "/");
const CHUNK_DIR = WS + "/evals/d07-chunks";
const CHUNK_SIZE = 3;

// Ensure the chunk-set dir exists (WR-02): the runner writes recall-chunk-*.json into it and it is
// NOT guaranteed to pre-exist on a fresh checkout (the tracked chunk files living there today are
// incidental). Without this, the first write throws an uncaught ENOENT and kills the resumable run.
fs.mkdirSync(CHUNK_DIR, { recursive: true });

const all = JSON.parse(fs.readFileSync(WS + "/evals/trigger-eval.json", "utf8"));
// Canary = a should-trigger lz-red positive used ONLY as the window-health validator here.
// PLACEHOLDER: re-derived from the authored lz-red trigger set in 20-01 Task 3 (WR-01) so it is
// byte-for-byte a real trigger-eval.json positive, never a hand-typed twin that can silently drift.
// The exclude-filter below and the result-side canary lookups all key off the same CANARY_PREFIX.
// Not run yet (D-11 build-then-halt); the canary only throws at RUN time, not during the build.
const CANARY_PREFIX = "PLACEHOLDER re-derived in 20-01 Task 3";
const CANARY = all.find((q) => q.should_trigger && q.query.startsWith(CANARY_PREFIX));

if (!CANARY) {
  throw new Error("canary positive missing from trigger-eval.json");
}

// Measure every should-trigger EXCEPT the canary query (its recall is measured by its own firing as
// the appended validator across all chunks and reported separately).
const positives = all.filter((q) => q.should_trigger && !q.query.startsWith(CANARY_PREFIX));
const chunks = [];

for (let i = 0; i < positives.length; i += CHUNK_SIZE) {
  chunks.push(positives.slice(i, i + CHUNK_SIZE));
}

const resultPath = (i) => `${WS}/trigger-results-d07-recall-chunk-${i + 1}.json`;

function assess(i) {
  const p = resultPath(i);

  if (!fs.existsSync(p)) {
    return { valid: false, reason: "not run" };
  }

  let r;

  try {
    r = JSON.parse(fs.readFileSync(p, "utf8"));
  } catch {
    return { valid: false, reason: "unparseable" };
  }

  // Valid JSON but wrong shape (WR-03): run_eval may emit an error object or a partial {} with no
  // .results array. Treat it as invalid rather than throwing an uncaught TypeError that would kill
  // the whole resumable run.
  if (!r || !Array.isArray(r.results)) {
    return { valid: false, reason: "no results array" };
  }

  // The appended canary is the LAST result and is the Extract Function lookup.
  const canary = r.results.find((q) => q.query.startsWith(CANARY_PREFIX));
  const measured = r.results.filter((q) => q !== canary);
  const canaryFired = canary && canary.trigger_rate >= 0.5;
  const fired = measured.filter((q) => q.trigger_rate >= 0.5);

  return {
    valid: !!canaryFired,
    reason: canaryFired ? "ok" : "canary quiet (throttled)",
    canaryRate: canary ? `${canary.triggers}/${canary.runs}` : "n/a",
    measured,
    fired,
  };
}

const reportOnly = process.argv.includes("--report");

for (let i = 0; i < chunks.length; i++) {
  const a = assess(i);

  if (a.valid) {
    console.log(`chunk ${i + 1}: VALID (canary ${a.canaryRate}), skip`);
    continue;
  }

  if (reportOnly) {
    console.log(`chunk ${i + 1}: ${a.reason} -- needs run`);
    continue;
  }

  const setPath = `${CHUNK_DIR}/recall-chunk-${i + 1}.json`;
  console.log(`chunk ${i + 1}: running (${chunks[i].length} positives + canary)...`);

  try {
    fs.writeFileSync(setPath, JSON.stringify([...chunks[i], CANARY], null, 2));
    const out = execFileSync(
      "python",
      ["-m", "scripts.run_eval", "--eval-set", setPath, "--skill-path", SKILL, "--model", "claude-opus-4-8", "--runs-per-query", "3", "--num-workers", "1"],
      { cwd: TOOL_DIR, env: { ...process.env, PONYTAIL_DEFAULT_MODE: "off" }, maxBuffer: 64 * 1024 * 1024, stdio: ["ignore", "pipe", "ignore"] },
    );
    fs.writeFileSync(resultPath(i), out);
    const a2 = assess(i);
    console.log(`  -> ${a2.valid ? "VALID" : "INVALID"} (canary ${a2.canaryRate}); fired ${a2.fired ? a2.fired.length : 0}/${a2.measured ? a2.measured.length : 0}`);
  } catch (e) {
    console.log(`  -> run failed/interrupted: ${e.message.slice(0, 80)} (will resume next invocation)`);
    break;
  }
}

// Combined report
console.log("\n=== combined recall (valid chunks only) ===");
let fired = 0;
let tested = 0;
const misses = [];

for (let i = 0; i < chunks.length; i++) {
  const a = assess(i);

  if (!a.valid) {
    console.log(`chunk ${i + 1}: NOT valid (${a.reason}) -- ${chunks[i].length} positives unconfirmed`);
    continue;
  }

  for (const q of a.measured) {
    tested++;

    if (q.trigger_rate >= 0.5) {
      fired++;
    } else {
      misses.push(`${q.triggers}/${q.runs}  ${q.query.slice(0, 72)}`);
    }
  }
}

// Canary recall (measured as its own positive across all valid chunks: appears once per valid chunk).
let canaryFires = 0;
let canaryRuns = 0;

for (let i = 0; i < chunks.length; i++) {
  const a = assess(i);

  if (!a.valid) {
    continue;
  }

  const p = resultPath(i);
  let r;

  try {
    r = JSON.parse(fs.readFileSync(p, "utf8"));
  } catch {
    continue;
  }

  // Same shape guard as assess() (WR-03): skip a valid-JSON-but-wrong-shape file instead of throwing.
  if (!r || !Array.isArray(r.results)) {
    continue;
  }

  const canary = r.results.find((q) => q.query.startsWith(CANARY_PREFIX));

  if (canary) {
    canaryFires += canary.triggers;
    canaryRuns += canary.runs;
  }
}

const canaryRecall = canaryRuns ? canaryFires / canaryRuns >= 0.5 : false;
// Count the canary in the denominator ONLY when it actually ran (IN-01), so a fully-throttled run
// reports "0/10 positives measured: 0/0" (no valid data) rather than a misleading "0/1 = 0%".
const canaryTested = canaryRuns > 0 ? 1 : 0;
const totalTested = tested + canaryTested;
const totalFired = fired + (canaryRecall ? 1 : 0);
const pct = totalTested ? (100 * totalFired / totalTested).toFixed(0) + "%" : "-";

console.log(`\nMEASURED (${positives.length} non-canary positives): ${fired}/${tested} fired >=0.5`);
console.log(`CANARY positive (Extract Function lookup): ${canaryFires}/${canaryRuns} runs fired -> ${canaryRecall ? "RECALLS" : "MISS"}`);
console.log(`RECALL (canary-validated, ${totalTested}/${positives.length + 1} positives measured): ${totalFired}/${totalTested} = ${pct}`);
misses.forEach((m) => console.log("  MISS: " + m));
