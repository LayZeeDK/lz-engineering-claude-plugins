// Resumable, canary-gated specificity runner for EVAL-01.
// Splits the 14 negatives into small chunks, appends a reliable positive canary to EACH chunk,
// and runs them serially (num-workers 1) on the token-optimized harness. A chunk is VALID only if
// its canary fired (>=0.5) -- proving that chunk ran in a healthy (non-throttled) window, so its
// negatives' "quiet" results are trustworthy. Re-running skips already-valid chunks (resume);
// only un-run or canary-failed (throttled) chunks re-execute. Idempotent.
//
//   node run-spec-chunks.mjs           # run/resume all chunks
//   node run-spec-chunks.mjs --report  # just print the combined result, run nothing
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const WS = "D:/projects/github/LayZeeDK/lz-engineering-claude-plugins/.claude/skills/lz-tpp-workspace";
const TOOL_DIR = WS + "/tools/skill-creator-eval";
const SKILL = "D:/projects/github/LayZeeDK/lz-engineering-claude-plugins/plugins/lz-tdd/skills/lz-tpp";
const CHUNK_DIR = WS + "/evals/d07-chunks";
const CANARY = { query: "what does the transformation `(constant -> scalar)` actually mean and when would I reach for it?", should_trigger: true };
const CHUNK_SIZE = 4; // negatives per chunk (+1 canary each)

const negatives = JSON.parse(fs.readFileSync(CHUNK_DIR + "/negatives.json", "utf8"));
const chunks = [];

for (let i = 0; i < negatives.length; i += CHUNK_SIZE) {
  chunks.push(negatives.slice(i, i + CHUNK_SIZE));
}

const resultPath = (i) => `${WS}/trigger-results-d07-spec-chunk-${i + 1}.json`;

// A result is VALID iff the canary fired (healthy window). Returns {valid, canaryRate, falsePos[]}.
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

  const canary = r.results.find((q) => q.should_trigger);
  const negs = r.results.filter((q) => !q.should_trigger);
  const canaryFired = canary && canary.trigger_rate >= 0.5;
  const falsePos = negs.filter((q) => q.trigger_rate >= 0.5);

  return { valid: !!canaryFired, reason: canaryFired ? "ok" : "canary quiet (throttled)", canaryRate: canary ? `${canary.triggers}/${canary.runs}` : "n/a", negs, falsePos };
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

  const setPath = `${CHUNK_DIR}/spec-chunk-${i + 1}.json`;
  fs.writeFileSync(setPath, JSON.stringify([...chunks[i], CANARY], null, 2));
  console.log(`chunk ${i + 1}: running (${chunks[i].length} negatives + canary)...`);

  try {
    const out = execFileSync(
      "python",
      ["-m", "scripts.run_eval", "--eval-set", setPath, "--skill-path", SKILL, "--model", "claude-opus-4-8", "--runs-per-query", "3", "--num-workers", "1"],
      { cwd: TOOL_DIR, env: { ...process.env, PONYTAIL_DEFAULT_MODE: "off" }, maxBuffer: 64 * 1024 * 1024, stdio: ["ignore", "pipe", "ignore"] },
    );
    fs.writeFileSync(resultPath(i), out);
    const a2 = assess(i);
    console.log(`  -> ${a2.valid ? "VALID" : "INVALID"} (canary ${a2.canaryRate})${a2.falsePos && a2.falsePos.length ? " FALSE-POS: " + a2.falsePos.length : ""}`);
  } catch (e) {
    console.log(`  -> run failed/interrupted: ${e.message.slice(0, 80)} (will resume next invocation)`);
    break;
  }
}

// Combined report
console.log("\n=== combined specificity (valid chunks only) ===");
let quiet = 0;
let tested = 0;
const fp = [];

for (let i = 0; i < chunks.length; i++) {
  const a = assess(i);

  if (!a.valid) {
    console.log(`chunk ${i + 1}: NOT valid (${a.reason}) -- ${chunks[i].length} negatives unconfirmed`);
    continue;
  }

  for (const q of a.negs) {
    tested++;

    if (q.trigger_rate < 0.5) {
      quiet++;
    } else {
      fp.push(q.query);
    }
  }
}

console.log(`\nSPECIFICITY (canary-validated): ${quiet}/${tested} quiet = ${tested ? (100 * quiet / tested).toFixed(0) : "-"}%  (${fp.length} false positives, ${negatives.length - tested} unconfirmed)`);
fp.forEach((q) => console.log("  FALSE-POS: " + q.slice(0, 70)));
