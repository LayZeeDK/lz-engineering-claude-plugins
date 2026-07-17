#!/usr/bin/env node
// MECHANICAL dimensions for the e2e-angular apply eval (lift, cost, tools, drove, Pass@k).
// GRADED dims (output_quality, over/under, idiom, book_authenticity, incrementality) are judge/oracle-owned.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
// Canonical name lists come from grade-run.mjs (the source of truth) so this tabulator's
// vocabulary can never drift from the grader's.
import { FOWLER, KERIEVSKY, FUNCTIONAL } from '../grade-run.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SUITES = { cli: 'angular-cli', cdk: 'components', core: 'angular' };

const ALL = [...new Set([...FOWLER, ...KERIEVSKY, ...FUNCTIONAL])];

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const nameRe = (n) => new RegExp('\\b' + esc(n).replace(/\s+/g, '\\s+') + '\\b', 'i');
// longest-match shadowing (CR-01): drop a name that is a word-bounded sub-phrase of another matched name
function liftNames(resp) {
  const matched = ALL.filter((n) => nameRe(n).test(resp));
  return matched.filter((n) => !matched.some((o) => o !== n && o.length > n.length && nameRe(n).test(o)));
}
function comb(n, r) { if (r < 0 || r > n) return 0; r = Math.min(r, n - r); let num = 1, den = 1; for (let i = 0; i < r; i++) { num *= n - i; den *= i + 1; } return num / den; }
const passAtK = (n, c, k) => (k > n ? null : 1 - comb(n - c, k) / comb(n, k));
const passHatK = (n, c, k) => (k > n ? null : comb(c, k) / comb(n, k));

const cells = {}; // key: `${cell}|${arm}` -> runs[]
for (const [suite] of Object.entries(SUITES)) {
  const base = path.join(HERE, suite, 'results', 'apply');
  if (!fs.existsSync(base)) continue;
  for (const arm of fs.readdirSync(base)) {
    for (const pid of fs.readdirSync(path.join(base, arm))) {
      for (const run of fs.readdirSync(path.join(base, arm, pid))) {
        const dir = path.join(base, arm, pid, run);
        const mp = path.join(dir, 'meta.json');
        if (!fs.existsSync(mp)) continue;
        const m = JSON.parse(fs.readFileSync(mp, 'utf8'));
        const answer = fs.existsSync(path.join(dir, 'answer.md')) ? fs.readFileSync(path.join(dir, 'answer.md'), 'utf8') : '';
        const names = liftNames(answer);
        const key = `${suite}:${pid}|${arm}`;
        (cells[key] ||= []).push({ run, exit: m.exit_code, cost: m.total_cost_usd || 0, turns: m.num_turns || 0, tools: m.tool_calls || {}, edits: (m.changed_files || []).length, names });
      }
    }
  }
}

console.log('cell            arm           n  drove  lift(mean/union)  Pass@1(lift>0)  $mean  turns  tools');
const out = {};
for (const key of Object.keys(cells).sort()) {
  const [cell, arm] = key.split('|');
  const rs = cells[key];
  const n = rs.length;
  // drove/lift/union/Pass@k measure refactoring quality, so they must exclude runs that errored out
  // (exit != 0) -- a crashed run has no meaningful diff. cost/turns/tools stay over ALL runs (spend
  // and tool usage are real regardless of exit).
  const clean = rs.filter((r) => r.exit === 0);
  const nClean = clean.length;
  const drove = clean.filter((r) => r.edits > 0).length;
  const union = [...new Set(clean.flatMap((r) => r.names))];
  const liftMean = nClean ? (clean.reduce((s, r) => s + r.names.length, 0) / nClean).toFixed(1) : '0.0';
  const cLift = clean.filter((r) => r.names.length > 0).length;
  const passAt1 = passAtK(nClean, cLift, 1);
  const costMean = (rs.reduce((s, r) => s + r.cost, 0) / n).toFixed(2);
  const turnsMean = Math.round(rs.reduce((s, r) => s + r.turns, 0) / n);
  const toolAgg = {};
  for (const r of rs) for (const [t, c] of Object.entries(r.tools)) toolAgg[t] = (toolAgg[t] || 0) + c;
  const toolStr = Object.entries(toolAgg).sort((a, b) => b[1] - a[1]).map(([t, c]) => `${t}:${c}`).join(' ');
  console.log(`${cell.padEnd(15)} ${arm.padEnd(12)}  ${n}  ${drove}/${nClean}    ${liftMean}/${union.length}`.padEnd(52) + `  ${(passAt1 == null ? 0 : passAt1).toFixed(2)}            ${costMean}   ${turnsMean}    ${toolStr}`);
  out[key] = { n, nClean, drove, liftMean: +liftMean, union, costMean: +costMean, turnsMean, passAt1_lift: passAt1, passHat3_lift: passHatK(nClean, cLift, 3), toolAgg };
}
fs.writeFileSync(path.join(HERE, 'mechanical.json'), JSON.stringify(out, null, 2));
console.log('\nwrote mechanical.json');
