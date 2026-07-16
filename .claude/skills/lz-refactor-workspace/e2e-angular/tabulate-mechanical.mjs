#!/usr/bin/env node
// MECHANICAL dimensions for the e2e-angular apply eval (lift, cost, tools, drove, Pass@k).
// GRADED dims (output_quality, over/under, idiom, book_authenticity, incrementality) are judge/oracle-owned.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SUITES = { cli: 'angular-cli', cdk: 'components', core: 'angular' };

// Canonical names copied from grade-run.mjs (Phase-14 lift method).
const FOWLER = ["Extract Function","Inline Function","Extract Variable","Inline Variable","Change Function Declaration","Encapsulate Variable","Rename Variable","Introduce Parameter Object","Combine Functions into Class","Combine Functions into Transform","Split Phase","Encapsulate Record","Encapsulate Collection","Replace Primitive with Object","Replace Temp with Query","Extract Class","Inline Class","Hide Delegate","Remove Middle Man","Substitute Algorithm","Move Function","Move Field","Move Statements into Function","Move Statements to Callers","Replace Inline Code with Function Call","Slide Statements","Split Loop","Replace Loop with Pipeline","Remove Dead Code","Split Variable","Rename Field","Replace Derived Variable with Query","Change Reference to Value","Change Value to Reference","Decompose Conditional","Consolidate Conditional Expression","Replace Nested Conditional with Guard Clauses","Replace Conditional with Polymorphism","Introduce Special Case","Introduce Assertion","Separate Query from Modifier","Parameterize Function","Remove Flag Argument","Preserve Whole Object","Replace Parameter with Query","Replace Query with Parameter","Remove Setting Method","Replace Constructor with Factory Function","Replace Function with Command","Replace Command with Function","Return Modified Value","Pull Up Method","Pull Up Field","Pull Up Constructor Body","Push Down Method","Push Down Field","Replace Type Code with Subclasses","Remove Subclass","Extract Superclass","Collapse Hierarchy","Replace Subclass with Delegate","Replace Superclass with Delegate"];
const KERIEVSKY = ["Replace Constructors with Creation Methods","Move Creation Knowledge to Factory","Encapsulate Classes with Factory","Introduce Polymorphic Creation with Factory Method","Encapsulate Composite with Builder","Inline Singleton","Compose Method","Replace Conditional Logic with Strategy","Move Embellishment to Decorator","Replace State-Altering Conditionals with State","Replace Implicit Tree with Composite","Replace Conditional Dispatcher with Command","Form Template Method","Extract Composite","Replace One/Many Distinctions with Composite","Replace Hard-Coded Notifications with Observer","Unify Interfaces with Adapter","Extract Adapter","Replace Implicit Language with Interpreter","Replace Type Code with Class","Limit Instantiation with Singleton","Introduce Null Object","Move Accumulation to Collecting Parameter","Move Accumulation to Visitor","Chain Constructors","Unify Interfaces","Extract Parameter"];
const FUNCTIONAL = ["Factory Function","Function Composition","Structural Clone","Module Namespace","First-Class Function","Discriminated Union and Fold","Memoization and Interning","Thunk and Lazy Value","Generator","Reducer and Store","Immutable Snapshot","Observer Callbacks","Branded Type","Option and Either","Currying and Partial Application","Functor and Monad","Lens and Optics","Transducers","Normalized Store"];
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
  const drove = rs.filter((r) => r.edits > 0).length;
  const union = [...new Set(rs.flatMap((r) => r.names))];
  const liftMean = (rs.reduce((s, r) => s + r.names.length, 0) / n).toFixed(1);
  const cLift = rs.filter((r) => r.names.length > 0).length;
  const costMean = (rs.reduce((s, r) => s + r.cost, 0) / n).toFixed(2);
  const turnsMean = Math.round(rs.reduce((s, r) => s + r.turns, 0) / n);
  const toolAgg = {};
  for (const r of rs) for (const [t, c] of Object.entries(r.tools)) toolAgg[t] = (toolAgg[t] || 0) + c;
  const toolStr = Object.entries(toolAgg).sort((a, b) => b[1] - a[1]).map(([t, c]) => `${t}:${c}`).join(' ');
  console.log(`${cell.padEnd(15)} ${arm.padEnd(12)}  ${n}  ${drove}/${n}    ${liftMean}/${union.length}`.padEnd(52) + `  ${passAtK(n, cLift, 1).toFixed(2)}            ${costMean}   ${turnsMean}    ${toolStr}`);
  out[key] = { n, drove, liftMean: +liftMean, union, costMean: +costMean, turnsMean, passAt1_lift: passAtK(n, cLift, 1), passHat3_lift: passHatK(n, cLift, 3), toolAgg };
}
fs.writeFileSync(path.join(HERE, 'mechanical.json'), JSON.stringify(out, null, 2));
console.log('\nwrote mechanical.json');
