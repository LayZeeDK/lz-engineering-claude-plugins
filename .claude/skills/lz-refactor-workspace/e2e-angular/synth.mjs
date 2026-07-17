// De-blind the graded judge verdicts (via KEY.json) and aggregate by arm.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const KEY = JSON.parse(fs.readFileSync(path.join(HERE, 'graded', 'KEY.json'), 'utf8'));
const DIMS = ['output_quality', 'behavior_preservation', 'over_under_engineering', 'idiom_pattern', 'incrementality'];

// Verdicts as returned by the 4 blind cell-judges (pass|partial|fail), variant-keyed.
const V = {
  ac1: { 'variant-1': ['pass','pass','pass','pass','pass'], 'variant-2': ['partial','fail','pass','partial','partial'], 'variant-3': ['pass','pass','pass','pass','pass'], 'variant-4': ['pass','pass','pass','pass','partial'], 'variant-5': ['pass','pass','pass','pass','pass'], 'variant-6': ['pass','pass','pass','pass','partial'] },
  ac2: { 'variant-1': ['pass','pass','pass','pass','pass'], 'variant-2': ['pass','pass','pass','pass','pass'], 'variant-3': ['pass','pass','pass','pass','pass'], 'variant-4': ['pass','pass','pass','pass','pass'], 'variant-5': ['pass','pass','pass','pass','pass'], 'variant-6': ['pass','pass','pass','pass','pass'] },
  cd1: { 'variant-1': ['pass','pass','pass','pass','pass'], 'variant-2': ['partial','pass','partial','partial','partial'], 'variant-3': ['pass','pass','pass','pass','pass'], 'variant-4': ['pass','pass','pass','pass','pass'], 'variant-5': ['pass','pass','pass','pass','pass'], 'variant-6': ['partial','pass','partial','partial','partial'] },
  an1: { 'variant-1': ['pass','pass','pass','pass','pass'], 'variant-2': ['pass','pass','pass','pass','pass'], 'variant-3': ['pass','pass','pass','partial','pass'], 'variant-4': ['pass','partial','pass','pass','pass'], 'variant-5': ['pass','pass','pass','partial','pass'], 'variant-6': ['partial','partial','partial','pass','partial'] },
};

const arm = (cell, v) => KEY[cell][v].startsWith('invoke_skill') ? 'skill' : 'baseline';
const agg = {}; // arm -> dim -> {pass, partial, fail, n}
const cellAgg = {}; // `${cell}|${arm}` -> dim -> pass count (of 3)
for (const cell of Object.keys(V)) {
  for (const [v, scores] of Object.entries(V[cell])) {
    const a = arm(cell, v);
    DIMS.forEach((d, i) => {
      const s = scores[i];
      ((agg[a] ||= {})[d] ||= { pass: 0, partial: 0, fail: 0, n: 0 });
      agg[a][d].n++; agg[a][d][s]++;
      const ck = `${cell}|${a}`;
      ((cellAgg[ck] ||= {})[d] ||= 0);
      if (s === 'pass') cellAgg[ck][d]++;
    });
  }
}

console.log('=== OVERALL (strict pass / 12 runs per arm) ===');
console.log('dimension'.padEnd(26) + 'skill'.padEnd(10) + 'baseline');
for (const d of DIMS) {
  const s = agg.skill[d], b = agg.baseline[d];
  console.log(d.padEnd(26) + `${s.pass}/12`.padEnd(10) + `${b.pass}/12  (skill partial/fail ${s.partial}/${s.fail}; base ${b.partial}/${b.fail})`);
}
console.log('\n=== PER CELL (strict pass / 3) skill | baseline ===');
console.log('cell   ' + DIMS.map(d => d.slice(0,6)).join('  '));
for (const cell of Object.keys(V)) {
  const s = cellAgg[`${cell}|skill`], b = cellAgg[`${cell}|baseline`];
  console.log(cell.padEnd(6) + ' S ' + DIMS.map(d => `${s[d]}/3`.padEnd(6)).join('  '));
  console.log(cell.padEnd(6) + ' B ' + DIMS.map(d => `${b[d]}/3`.padEnd(6)).join('  '));
}
fs.writeFileSync(path.join(HERE, 'graded', 'verdicts-deblinded.json'), JSON.stringify({ key: KEY, verdicts: V, overall: agg, perCell: cellAgg }, null, 2));
console.log('\nwrote graded/verdicts-deblinded.json');
