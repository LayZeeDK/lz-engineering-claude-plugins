// Bundle the with_skill runs that actually DROVE (edits>0) for grading, grouped by cell.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, 'graded-ws');
const CELLS = { ac1: 'cli', ac2: 'cli', cd1: 'cdk', an1: 'core' };
fs.rmSync(OUT, { recursive: true, force: true });
const manifest = {};
for (const [cell, suite] of Object.entries(CELLS)) {
  const base = path.join(HERE, suite, 'results', 'apply', 'with_skill', cell);
  manifest[cell] = [];
  for (const run of fs.existsSync(base) ? fs.readdirSync(base) : []) {
    const meta = JSON.parse(fs.readFileSync(path.join(base, run, 'meta.json'), 'utf8'));
    if (meta.exit_code !== 0 || (meta.changed_files || []).length === 0) continue; // skip failed + advise-only (no clean diff to grade)
    const vd = path.join(OUT, cell, run);
    fs.mkdirSync(vd, { recursive: true });
    for (const f of ['answer.md', 'diff.patch']) fs.copyFileSync(path.join(base, run, f), path.join(vd, f));
    manifest[cell].push(run);
  }
}
console.log(JSON.stringify(manifest, null, 2));
