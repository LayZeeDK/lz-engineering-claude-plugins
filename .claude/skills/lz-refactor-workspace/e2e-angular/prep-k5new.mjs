// Blind-bundle the NEW drove-runs (run-4, run-5 with edits>0) for ac1/cd1/an1 across all 3 arms.
// Round-robin interleave across arms so consecutive variants differ in arm (anti-pattern). KEY kept by grader.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, 'graded-k5new');
const CELLS = { ac1: 'cli', cd1: 'cdk', an1: 'core' };
const ARMS = ['no_skill', 'invoke_skill', 'with_skill'];
fs.rmSync(OUT, { recursive: true, force: true });
const key = {};
for (const [cell, suite] of Object.entries(CELLS)) {
  // collect drove new-runs per arm
  const perArm = {};
  for (const arm of ARMS) {
    perArm[arm] = [];
    for (const k of [4, 5]) {
      const rd = path.join(HERE, suite, 'results', 'apply', arm, cell, `run-${k}`);
      const mp = path.join(rd, 'meta.json');
      if (!fs.existsSync(mp)) continue;
      const m = JSON.parse(fs.readFileSync(mp, 'utf8'));
      if (m.exit_code === 0 && (m.changed_files || []).length > 0) perArm[arm].push({ arm, k, rd });
    }
  }
  // round-robin interleave
  const order = [];
  for (let i = 0; i < 2; i++) for (const arm of ARMS) if (perArm[arm][i]) order.push(perArm[arm][i]);
  key[cell] = {};
  order.forEach((r, i) => {
    const v = `variant-${i + 1}`;
    const vd = path.join(OUT, cell, v);
    fs.mkdirSync(vd, { recursive: true });
    for (const f of ['answer.md', 'diff.patch']) fs.copyFileSync(path.join(r.rd, f), path.join(vd, f));
    key[cell][v] = `${r.arm}/run-${r.k}`;
  });
}
fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'KEY.json'), JSON.stringify(key, null, 2));
for (const cell of Object.keys(key)) console.log(cell, '->', Object.entries(key[cell]).map(([v, a]) => `${v}=${a}`).join('  '));
