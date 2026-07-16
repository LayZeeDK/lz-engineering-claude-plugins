// Full k=5 aggregate for ac1/cd1/an1 (ac2 stays k=3, saturated). Merges all judge passes.
// Per (cell, arm, run): 5-dim verdict [output_quality, behavior_preservation, over_under, idiom, incrementality]
// or "ADVISED" (fired/ran but applied no edits -> drove-fail, no applied-quality score).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const DIMS = ['output_quality', 'behavior_preservation', 'over_under', 'idiom', 'incrementality'];
const P = 'pass', X = 'partial', F = 'fail', A = 'ADVISED';

const V = {
  ac1: {
    no_skill:     { r1:[X,F,P,X,X], r2:[P,P,P,P,X], r3:[P,P,P,P,X], r4:[X,F,P,P,P], r5:[P,P,P,P,P] },
    invoke_skill: { r1:[P,P,P,P,P], r2:[P,P,P,P,P], r3:[P,P,P,P,P], r4:A,           r5:[P,P,P,P,P] },
    with_skill:   { r1:[P,P,P,X,P], r2:[X,F,P,P,P], r3:[X,P,P,P,P], r4:A,           r5:A },
  },
  cd1: {
    no_skill:     { r1:[X,P,X,X,X], r2:[X,P,X,X,X], r3:[P,P,P,P,P], r4:[P,X,P,P,P], r5:[X,P,F,X,P] },
    invoke_skill: { r1:[P,P,P,P,P], r2:[P,P,P,P,P], r3:[P,P,P,P,P], r4:[P,P,P,P,P], r5:[P,P,P,P,P] },
    with_skill:   { r1:A,           r2:[P,X,P,P,P], r3:A,           r4:[P,P,P,P,P], r5:[P,P,P,P,P] },
  },
  an1: {
    no_skill:     { r1:[P,P,P,P,P], r2:[X,X,X,P,X], r3:[P,X,P,P,P], r4:[P,P,P,P,P], r5:[P,P,P,P,P] },
    invoke_skill: { r1:[P,P,P,X,P], r2:[P,P,P,X,P], r3:[P,P,P,X,P], r4:A,           r5:[P,P,P,P,P] },
    with_skill:   { r1:A,           r2:[P,P,P,P,P], r3:[P,P,P,P,P], r4:A,           r5:[P,P,P,P,P] },
  },
};

const ARMS = ['invoke_skill', 'with_skill', 'no_skill'];
const agg = {};
for (const arm of ARMS) agg[arm] = { drove: 0, ran: 0, dims: Object.fromEntries(DIMS.map(d => [d, 0])) };
for (const cell of Object.keys(V)) {
  for (const arm of ARMS) {
    for (const run of Object.keys(V[cell][arm])) {
      const v = V[cell][arm][run];
      agg[arm].ran++;
      if (v === A) continue;
      agg[arm].drove++;
      DIMS.forEach((d, i) => { if (v[i] === P) agg[arm].dims[d]++; });
    }
  }
}
console.log('=== k=5 aggregate (ac1+cd1+an1; strict pass / DROVE-runs) ===\n');
console.log('metric'.padEnd(24) + ARMS.map(a => a.padEnd(16)).join(''));
console.log('drove / ran'.padEnd(24) + ARMS.map(a => `${agg[a].drove}/${agg[a].ran}`.padEnd(16)).join(''));
for (const d of DIMS) {
  console.log(d.padEnd(24) + ARMS.map(a => `${agg[a].dims[d]}/${agg[a].drove} (${Math.round(100 * agg[a].dims[d] / agg[a].drove)}%)`.padEnd(16)).join(''));
}
fs.writeFileSync(path.join(HERE, 'k5-aggregate.json'), JSON.stringify(agg, null, 2));
console.log('\nwrote k5-aggregate.json');
