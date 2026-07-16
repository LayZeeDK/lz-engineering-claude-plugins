// Build BLINDED grading bundles: per cell, copy the 6 runs' answer.md+diff.patch into
// variant-1..6 under a neutral dir (arm hidden, fixed permutation). KEY.json is kept by the
// grader (main context), NOT given to the judge subagents.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, 'graded');
const CELLS = [
  { cell: 'ac1', suite: 'cli' }, { cell: 'ac2', suite: 'cli' },
  { cell: 'cd1', suite: 'cdk' }, { cell: 'an1', suite: 'core' },
];
const PERM = [
  ['invoke_skill', 2], ['no_skill', 1], ['invoke_skill', 1],
  ['no_skill', 3], ['invoke_skill', 3], ['no_skill', 2],
];

fs.rmSync(OUT, { recursive: true, force: true });
const key = {};
for (const { cell, suite } of CELLS) {
  const src = path.join(HERE, suite, 'results', 'apply');
  key[cell] = {};
  PERM.forEach(([arm, run], i) => {
    const v = `variant-${i + 1}`;
    const rd = path.join(src, arm, cell, `run-${run}`);
    const vd = path.join(OUT, cell, v);
    fs.mkdirSync(vd, { recursive: true });
    for (const f of ['answer.md', 'diff.patch']) {
      const s = path.join(rd, f);
      fs.writeFileSync(path.join(vd, f), fs.existsSync(s) ? fs.readFileSync(s) : '(missing)');
    }
    key[cell][v] = `${arm}/run-${run}`;
  });
}
fs.writeFileSync(path.join(OUT, 'KEY.json'), JSON.stringify(key, null, 2));
console.log('bundles at', OUT);
for (const { cell } of CELLS) console.log(cell, '->', Object.entries(key[cell]).map(([v, a]) => `${v}=${a}`).join('  '));
