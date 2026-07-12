#!/usr/bin/env node
// End-to-end functional test of the lz-refactor skill against a real repo (nrwl/nx @ 23.0.x).
//
// Unlike the trigger/recall evals (which force-inject an ephemeral skill), this drives a real
// `claude -p` session against real nx code and observes whether lz-refactor -- loaded naturally
// via `--plugin-dir` -- steers the model to the right NAMED refactoring for a curated smell.
//
// Two arms:
//   with_skill : `claude -p ... --plugin-dir <lz-tdd>`  (lz-refactor available, auto-triggers by description)
//   no_skill   : same command WITHOUT --plugin-dir      (baseline)
// The ONLY difference between arms is the presence of the plugin. `--setting-sources project`
// drops the user's global plugins ("minimize user plugin interference"); the nx repo's own
// project settings load identically in both arms, so they do not bias the A/B.
//
// Two modes:
//   recommend : read-only. Edit/Write/Bash are hard-blocked. The skill coaches; nothing is applied.
//   apply     : the driving agent may Edit + run Bash (tsc/tests). MUST run in a throwaway branch
//               checkout of nx (pass --cwd), never the pristine 23.0.x working tree.
//
// Usage:
//   node run-e2e.mjs --dry-run                         # print composed prompts + commands, spend nothing
//   node run-e2e.mjs --mode recommend --arm with_skill # run the recommend-only with-skill suite
//   node run-e2e.mjs --mode recommend --arm both       # run with_skill and no_skill for comparison
//   node run-e2e.mjs --prompt p1 --prompt p3           # subset of prompts
//   node run-e2e.mjs --mode apply --arm with_skill --cwd <nx-branch-checkout>
//   node run-e2e.mjs --report                          # summarize captured runs, run nothing
//
// Env: CLAUDE_BIN (override CLI path), E2E_MODEL (override model, default claude-opus-4-8).

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(HERE, '../../../..');
const PLUGIN_DIR = path.join(REPO_ROOT, 'plugins', 'lz-tdd'); // the plugin under test -- constant across suites

// A suite is a directory with suite.json + prompts/ + targets.json; results land under it.
// --suite <dir> selects it (default: this runner's own dir = the nx suite). Scanned from argv here,
// before parseArgs, so the module-level config can derive from it.
function argVal(flag, def) {
  const i = process.argv.indexOf(flag);

  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : def;
}

const SUITE_DIR = path.resolve(argVal('--suite', HERE));
const SUITE = JSON.parse(fs.readFileSync(path.join(SUITE_DIR, 'suite.json'), 'utf8'));
const REPO = SUITE.repo; // the target repo/checkout claude -p runs against
const PROMPTS_DIR = path.join(SUITE_DIR, 'prompts');
const RESULTS_DIR = path.join(SUITE_DIR, 'results');
const PROMPTS = SUITE.prompts; // [{ id, file, target, code }]
const PROTECTED_BRANCHES = SUITE.protectedBranches || ['main', 'master'];

const MODEL = process.env.E2E_MODEL || 'claude-opus-4-8';
// Effort is pinned explicitly (not left to the CLI default) so runs are reproducible and the value
// is recorded in meta.json. `high` is Anthropic's built-in default; --setting-sources project drops
// the user's global effortLevel, so without this pin the runs would silently ride the default.
const EFFORT = process.env.E2E_EFFORT || 'high';
const SETTING_SOURCES = 'project';
// The slash-command form of the skill, used by the invoke_skill arm to force activation.
const SKILL_COMMAND = SUITE.skillCommand || '/lz-tdd:lz-refactor';
// apply mode: the pristine ref each apply run is reset to before it starts, so the k=3 runs don't
// stack edits on each other. The throwaway apply branch is checked out at this ref.
const APPLY_BASE = process.env.E2E_APPLY_BASE || SUITE.applyBase;
// apply sessions edit + build + run tests; give them a generous ceiling so a hung suite cannot block
// forever. recommend sessions are read-only and fast (no timeout needed).
const APPLY_TIMEOUT_MS = Number(process.env.E2E_APPLY_TIMEOUT_MS || 20 * 60 * 1000);

// Mode preambles. Kept deliberately neutral and NON-LEADING: they establish only the harness
// constraint (advise vs apply), not the answer. Each prompt body carries its own context (e.g.
// "tests are green"), so the skill must classify intent and diagnose the smell itself. The
// recommend preamble forbids edits (belt: the runner also disallows the edit tools).
const PREAMBLE = {
  recommend:
    'You are pair-programming with me. Read what I point you at and tell me how you would ' +
    'approach it. Do NOT edit any file and do NOT run any command. Here is my question:\n\n',
  apply:
    'You are pair-programming with me. Read what I point you at and make the improvement in small ' +
    'steps. After editing, typecheck the touched file(s) and run the affected tests to confirm ' +
    'nothing broke. Leave your edits in the working tree; do not commit. Here is my question:\n\n',
};

function parseArgs(argv) {
  const args = { mode: 'recommend', arm: 'with_skill', prompts: [], runs: [], dryRun: false, report: false, cwd: null, force: false };

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];

    if (a === '--dry-run') {
      args.dryRun = true;
    } else if (a === '--report') {
      args.report = true;
    } else if (a === '--force') {
      args.force = true;
    } else if (a === '--mode') {
      args.mode = argv[++i];
    } else if (a === '--arm') {
      args.arm = argv[++i];
    } else if (a === '--prompt') {
      args.prompts.push(argv[++i]);
    } else if (a === '--run') {
      args.runs.push(Number(argv[++i]));
    } else if (a === '--runs') {
      // --runs N is shorthand for run indices 1..N
      const n = Number(argv[++i]);

      for (let k = 1; k <= n; k++) {
        args.runs.push(k);
      }
    } else if (a === '--cwd') {
      args.cwd = argv[++i];
    } else if (a === '--suite') {
      args.suite = argv[++i]; // consumed at module load via argVal; accept it here too
    } else {
      throw new Error(`unknown arg: ${a}`);
    }
  }

  if (!['recommend', 'apply'].includes(args.mode)) {
    throw new Error(`--mode must be recommend|apply, got ${args.mode}`);
  }

  if (!['with_skill', 'no_skill', 'invoke_skill', 'both', 'all'].includes(args.arm)) {
    throw new Error(`--arm must be with_skill|no_skill|invoke_skill|both|all, got ${args.arm}`);
  }

  if (!args.runs.length) {
    args.runs = [1];
  }

  if (args.runs.some((k) => !Number.isInteger(k) || k < 1)) {
    throw new Error(`--run/--runs indices must be positive integers, got ${args.runs.join(', ')}`);
  }

  return args;
}

// Resolve the claude CLI to a concrete path. On Windows the entry on PATH is a .CMD/.sh shim that
// Node's spawnSync (no shell) cannot execute -- it only launches real binaries. The shim wraps a
// native claude.exe under <shim-dir>/node_modules/@anthropic-ai/claude-code/bin/claude.exe, so
// prefer that. Launching the .exe with an args array is also the safe way to pass a prompt that
// contains backticks/quotes: spawnSync(shell:false) forwards argv verbatim, with no re-parsing.
function resolveClaude() {
  if (process.env.CLAUDE_BIN) {
    return process.env.CLAUDE_BIN;
  }

  const isWin = process.platform === 'win32';
  const names = isWin ? ['claude.exe', 'claude.CMD', 'claude.cmd', 'claude'] : ['claude'];
  const dirs = (process.env.PATH || '').split(path.delimiter);

  for (const dir of dirs) {
    for (const name of names) {
      const full = path.join(dir, name);

      if (!fs.existsSync(full)) {
        continue;
      }

      if (full.toLowerCase().endsWith('.exe') || !isWin) {
        return full;
      }

      // Found a shim (.CMD/.sh); resolve the real exe it wraps.
      const realExe = path.join(dir, 'node_modules', '@anthropic-ai', 'claude-code', 'bin', 'claude.exe');

      if (fs.existsSync(realExe)) {
        return realExe;
      }
    }
  }

  throw new Error("could not resolve a native 'claude.exe'; set CLAUDE_BIN to its full path");
}

function composePrompt(promptEntry, mode, arm) {
  const body = fs.readFileSync(path.join(PROMPTS_DIR, promptEntry.file), 'utf8').trim();

  if (arm === 'invoke_skill') {
    // Force skill activation via its slash command; the preamble + body become the skill's input.
    // (Read-only in recommend mode is still enforced by --disallowedTools, not the text.)
    return `${SKILL_COMMAND} ${PREAMBLE[mode]}${body}`;
  }

  return PREAMBLE[mode] + body;
}

function buildCmd(fullPrompt, arm, mode) {
  const cmd = [
    '-p', fullPrompt,
    '--output-format', 'stream-json',
    '--verbose',
    '--strict-mcp-config',
    '--mcp-config', '{"mcpServers":{}}',
    '--setting-sources', SETTING_SOURCES,
    '--model', MODEL,
    '--effort', EFFORT,
  ];

  if (mode === 'recommend') {
    // Read-only: reads never prompt, writes/shell are impossible.
    cmd.push('--permission-mode', 'bypassPermissions');
    cmd.push('--disallowedTools', 'Edit', 'Write', 'MultiEdit', 'NotebookEdit', 'Bash');
  } else {
    cmd.push('--permission-mode', 'bypassPermissions');
  }

  if (arm === 'with_skill' || arm === 'invoke_skill') {
    cmd.push('--plugin-dir', PLUGIN_DIR);
  }

  return cmd;
}

// Pull the final assistant text and skill-usage signal out of the stream-json transcript.
// Tracks BOTH lz skills: lz-refactor (expected for the refactor-step prompts p1-p5) and lz-tpp
// (the correct hand-off for the seam prompt p6). A tool_use referencing either counts.
function extractResult(raw) {
  const lines = raw.split('\n').filter((l) => l.trim());
  let finalText = '';
  let refactorHits = 0;
  let tppHits = 0;
  const skillsInvoked = new Set();

  for (const line of lines) {
    let ev;

    try {
      ev = JSON.parse(line);
    } catch {
      continue;
    }

    if (ev.type === 'result' && typeof ev.result === 'string') {
      finalText = ev.result;
    }

    const content = ev?.message?.content;

    if (!Array.isArray(content)) {
      continue;
    }

    for (const block of content) {
      if (block?.type !== 'tool_use') {
        continue;
      }

      const blob = JSON.stringify(block).toLowerCase();

      if (blob.includes('lz-refactor')) {
        refactorHits++;
      }

      if (blob.includes('lz-tpp')) {
        tppHits++;
      }

      if (block.name === 'Skill') {
        const inp = block.input || {};
        skillsInvoked.add(String(inp.command || inp.skill || inp.name || JSON.stringify(inp)));
      }
    }
  }

  return {
    finalText,
    usedRefactor: refactorHits > 0,
    usedTpp: tppHits > 0,
    refactorHits,
    tppHits,
    skillsInvoked: [...skillsInvoked],
  };
}

// Run a git command in a given working dir (the throwaway apply branch). Used only by apply mode
// for pristine reset + diff capture; runs as the runner's own child process, so it is not gated by
// the Claude Code permission classifier.
function git(cwd, gitArgs, { mustSucceed = false } = {}) {
  const r = spawnSync('git', gitArgs, { cwd, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, windowsHide: true });

  // I1: a silently-failed reset/clean leaves run k's edits in the tree so run k+1 stacks on
  // top -- the k samples stop being independent and changed_files becomes cumulative garbage.
  if (mustSucceed && r.status !== 0) {
    throw new Error(`git ${gitArgs.join(' ')} failed (exit ${r.status}) in ${cwd}: ${(r.stderr || '').trim()}`);
  }

  return r;
}

// One-line human signal of which lz skill(s) the run invoked.
function skillFlag(meta) {
  if (meta.arm === 'no_skill') {
    return 'baseline';
  }

  const used = [];

  if (meta.used_refactor) {
    used.push('lz-refactor');
  }

  if (meta.used_tpp) {
    used.push('lz-tpp');
  }

  return used.length ? `used: ${used.join('+')}` : 'NO lz skill invoked';
}

function runOne(claude, promptEntry, arm, mode, cwd, runIdx, force) {
  const fullPrompt = composePrompt(promptEntry, mode, arm);
  const cmd = buildCmd(fullPrompt, arm, mode);
  const outDir = path.join(RESULTS_DIR, mode, arm, promptEntry.id, `run-${runIdx}`);
  const metaPath = path.join(outDir, 'meta.json');

  // Idempotent resume: a completed run (exit 0) is not re-spent unless --force.
  if (!force && fs.existsSync(metaPath)) {
    try {
      const prev = JSON.parse(fs.readFileSync(metaPath, 'utf8'));

      if (prev.exit_code === 0) {
        console.log(`  [${mode}/${arm}] ${promptEntry.id} run-${runIdx}: already done (exit 0), skip`);

        return prev;
      }
    } catch {
      // fall through and re-run
    }
  }

  const rawDir = path.join(outDir, 'outputs'); // gitignored (**/outputs/)
  fs.mkdirSync(rawDir, { recursive: true });

  if (mode === 'apply') {
    // Safety: `git reset --hard` here would destroy work if cwd were on a real branch. Refuse to run
    // on a protected branch -- apply must run on a throwaway branch (see README).
    const cur = (git(cwd, ['rev-parse', '--abbrev-ref', 'HEAD']).stdout || '').trim();

    if (PROTECTED_BRANCHES.includes(cur)) {
      throw new Error(
        `apply mode refuses to reset --hard on protected branch '${cur}' in ${cwd}. ` +
          `Checkout a throwaway branch there first (e.g. git checkout -b lz-refactor-e2e-apply).`,
      );
    }

    // Pristine reset so this run starts from clean source, not a previous run's edits.
    // mustSucceed (I1): abort loudly rather than silently stacking edits across k runs.
    git(cwd, ['reset', '--hard', APPLY_BASE], { mustSucceed: true });
    git(cwd, ['clean', '-fd'], { mustSucceed: true });
  }

  const env = { ...process.env };
  delete env.CLAUDECODE;

  const started = Date.now();
  const res = spawnSync(claude, cmd, {
    cwd,
    env,
    encoding: 'utf8',
    maxBuffer: 128 * 1024 * 1024,
    windowsHide: true,
    timeout: mode === 'apply' ? APPLY_TIMEOUT_MS : undefined,
  });
  const elapsedMs = Date.now() - started;

  // I5: spawnSync's timeout only SIGTERMs claude.exe; on Windows the agent's grandchildren
  // (node/jest/the nx daemon) survive and can keep writing during the next run's git reset,
  // racing the working tree and holding locks. Kill the whole process tree by PID on timeout.
  if (res.error && (res.error.code === 'ETIMEDOUT' || res.signal) && res.pid) {
    try {
      spawnSync('taskkill', ['/PID', String(res.pid), '/T', '/F'], { windowsHide: true });
    } catch {
      // best-effort; nothing more we can safely do here
    }
  }

  const raw = res.stdout || '';
  fs.writeFileSync(path.join(rawDir, 'transcript.stream.jsonl'), raw);

  if (res.stderr) {
    fs.writeFileSync(path.join(rawDir, 'stderr.log'), res.stderr);
  }

  if (res.error) {
    fs.writeFileSync(path.join(rawDir, 'spawn-error.log'), String(res.error.stack || res.error));
    console.log(`  [${mode}/${arm}] ${promptEntry.id}: spawn error -- ${res.error.message}`);
  }

  const { finalText, usedRefactor, usedTpp, refactorHits, tppHits, skillsInvoked } = extractResult(raw);
  fs.writeFileSync(path.join(outDir, 'answer.md'), finalText || '(no result text captured)\n');

  // apply mode: capture what the agent actually changed (the key artifact), then the branch is
  // reset again before the next run.
  let changedFiles = [];

  if (mode === 'apply') {
    // I3: stage everything (incl. untracked new files from Extract Class / extract-to-module)
    // into the index so `diff --cached` captures them; new files are invisible to a plain
    // `git diff <base>`. Unstage after (the next run's `reset --hard` + `clean -fd` still wipes).
    git(cwd, ['add', '-A']);
    const diff = git(cwd, ['diff', '--cached', APPLY_BASE]);
    fs.writeFileSync(path.join(outDir, 'diff.patch'), diff.stdout || '');
    const names = git(cwd, ['diff', '--cached', '--name-only', APPLY_BASE]);
    changedFiles = (names.stdout || '').split('\n').map((s) => s.trim()).filter(Boolean);
    git(cwd, ['reset']);
  }

  const meta = {
    prompt_id: promptEntry.id,
    target: promptEntry.target,
    run_idx: runIdx,
    arm,
    mode,
    cwd,
    model: MODEL,
    effort: EFFORT,
    changed_files: changedFiles,
    prompt_used: fullPrompt,
    used_refactor: usedRefactor,
    used_tpp: usedTpp,
    refactor_hits: refactorHits,
    tpp_hits: tppHits,
    skills_invoked: skillsInvoked,
    exit_code: res.status,
    elapsed_ms: elapsedMs,
    answer_chars: (finalText || '').length,
  };
  fs.writeFileSync(path.join(outDir, 'meta.json'), JSON.stringify(meta, null, 2));

  const flag = skillFlag(meta);
  console.log(
    `  [${mode}/${arm}] ${promptEntry.id} run-${runIdx} (${promptEntry.target}) -> exit ${res.status}, ` +
      `${(elapsedMs / 1000).toFixed(0)}s, ${meta.answer_chars} chars, ${flag}`,
  );

  return meta;
}

// C(n, r) as an exact-ish float (small n here).
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

// Pass@k (optimistic): prob >=1 of k sampled runs "passes". Pass^k (conservative): all k pass.
// n = total runs, c = passing runs. Returns null when k > n.
function passAtK(n, c, k) {
  return k > n ? null : 1 - comb(n - c, k) / comb(n, k);
}

function passHatK(n, c, k) {
  return k > n ? null : comb(c, k) / comb(n, k);
}

const pct = (v) => (v === null ? '  -  ' : v.toFixed(2));

function report() {
  const resultsRoot = RESULTS_DIR;

  if (!fs.existsSync(resultsRoot)) {
    console.log('no results/ dir yet -- nothing to report');

    return;
  }

  const metas = [];
  const walk = (dir) => {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, ent.name);

      if (ent.isDirectory()) {
        walk(full);
      } else if (ent.name === 'meta.json') {
        metas.push(JSON.parse(fs.readFileSync(full, 'utf8')));
      }
    }
  };
  walk(resultsRoot);

  metas.sort((a, b) => `${a.mode}${a.arm}${a.prompt_id}${a.run_idx || 0}`.localeCompare(`${b.mode}${b.arm}${b.prompt_id}${b.run_idx || 0}`));
  console.log('\n=== captured runs ===');

  for (const m of metas) {
    console.log(
      `${m.mode.padEnd(9)} ${m.arm.padEnd(10)} ${m.prompt_id} run-${m.run_idx || 1} ${(m.target || '').padEnd(3)} ` +
        `exit ${m.exit_code}  ${String(Math.round((m.elapsed_ms || 0) / 1000)).padStart(4)}s  ${m.answer_chars} chars  ${skillFlag(m)}`,
    );
  }

  // Skill-fire reliability per (mode, arm, prompt). "fired" = an lz skill was invoked (the
  // deterministic, gradeable signal). Answer-quality grading stays qualitative (read answer.md).
  const groups = new Map();

  for (const m of metas) {
    const key = `${m.mode}|${m.arm}|${m.prompt_id}`;

    if (!groups.has(key)) {
      groups.set(key, []);
    }

    groups.get(key).push(m);
  }

  console.log('\n=== skill-fire reliability (fired = any lz skill invoked) ===');
  console.log('mode/arm/prompt          n  fired  pass@1  pass@3  pass^3   skills');
  const pooled = new Map(); // arm -> {n, c}

  for (const [key, runs] of [...groups.entries()].sort()) {
    const [mode, arm, pid] = key.split('|');
    const n = runs.length;
    const c = runs.filter((m) => m.used_refactor || m.used_tpp).length;
    const skills = [...new Set(runs.flatMap((m) => [m.used_refactor ? 'lz-refactor' : null, m.used_tpp ? 'lz-tpp' : null]).filter(Boolean))].join('+') || '-';
    console.log(
      `${`${mode}/${arm}/${pid}`.padEnd(24)} ${n}  ${String(c).padStart(2)}/${n}   ${pct(passAtK(n, c, 1))}   ${pct(passAtK(n, c, 3))}   ${pct(passHatK(n, c, 3))}   ${skills}`,
    );
    const pk = `${mode}|${arm}`;

    if (!pooled.has(pk)) {
      pooled.set(pk, { n: 0, c: 0 });
    }

    const agg = pooled.get(pk);
    agg.n += n;
    agg.c += c;
  }

  console.log('\n=== overall (pooled across prompts) ===');

  for (const [pk, { n, c }] of [...pooled.entries()].sort()) {
    console.log(`${pk.replace('|', '/').padEnd(24)} ${n}  ${String(c).padStart(2)}/${n}   pass@1 ${pct(passAtK(n, c, 1))}`);
  }

  console.log(`\n${metas.length} runs captured. (Pass@k on skill-firing; grade answer quality by reading answer.md vs targets.json.)`);
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.report) {
    report();

    return;
  }

  let selected = args.prompts.length
    ? PROMPTS.filter((p) => args.prompts.includes(p.id))
    : PROMPTS;

  if (!selected.length) {
    throw new Error(`no prompts matched: ${args.prompts.join(', ')}`);
  }

  // apply mode only makes sense for prompts with real source to refactor (p1-p4).
  if (args.mode === 'apply') {
    const excluded = selected.filter((p) => !p.code).map((p) => p.id);

    if (excluded.length) {
      console.log(`apply mode: skipping non-code prompts ${excluded.join(', ')} (no source to apply to)`);
    }

    selected = selected.filter((p) => p.code);

    if (!selected.length) {
      throw new Error('apply mode: no code prompts selected (p1-p4 only)');
    }
  }

  const arms =
    args.arm === 'both'
      ? ['with_skill', 'no_skill']
      : args.arm === 'all'
        ? ['with_skill', 'no_skill', 'invoke_skill']
        : [args.arm];
  const cwd = args.cwd || REPO;

  if (args.mode === 'apply' && !args.cwd) {
    throw new Error('apply mode requires --cwd pointing at a THROWAWAY branch checkout of nx (never the pristine tree)');
  }

  if (args.dryRun) {
    const claude = (() => {
      try {
        return resolveClaude();
      } catch (e) {
        return `(unresolved: ${e.message})`;
      }
    })();
    console.log(`DRY RUN -- nothing will be spent.`);
    console.log(`suite    : ${SUITE.name} (${SUITE_DIR})`);
    console.log(`claude   : ${claude}`);
    console.log(`repo cwd : ${cwd}`);
    console.log(`plugin   : ${PLUGIN_DIR}`);
    console.log(`model    : ${MODEL}   effort: ${EFFORT}`);
    console.log(`mode     : ${args.mode}   arms: ${arms.join(', ')}   prompts: ${selected.map((p) => p.id).join(', ')}   runs: ${args.runs.join(',')}`);

    for (const p of selected) {
      for (const arm of arms) {
        const full = composePrompt(p, args.mode, arm);
        const cmd = buildCmd(full, arm, args.mode);
        console.log(`\n--- ${args.mode}/${arm}/${p.id} (${p.target}) ---`);
        console.log(`cmd: claude ${cmd.map((c) => (c.length > 60 ? c.slice(0, 57) + '...' : c)).map((c) => (/\s/.test(c) ? `"${c}"` : c)).join(' ')}`);
      }
    }

    console.log(`\n${selected.length * arms.length * args.runs.length} runs would execute (${args.runs.length} run(s) each; completed runs skip). Re-run without --dry-run to spend.`);

    return;
  }

  const claude = resolveClaude();
  const total = selected.length * arms.length * args.runs.length;
  console.log(`running up to ${total} claude -p sessions (mode=${args.mode}, model=${MODEL}, runs=[${args.runs.join(',')}]; completed runs skipped)...`);
  const metas = [];

  for (const k of args.runs) {
    for (const p of selected) {
      for (const arm of arms) {
        metas.push(runOne(claude, p, arm, args.mode, cwd, k, args.force));
      }
    }
  }

  const withSkill = metas.filter((m) => m.arm === 'with_skill');
  const used = withSkill.filter((m) => m.used_refactor || m.used_tpp).length;
  console.log(`\ndone. ${metas.length} runs captured under results/${args.mode}/`);

  if (withSkill.length) {
    console.log(`with_skill: ${used}/${withSkill.length} runs invoked an lz skill (lz-refactor or lz-tpp).`);
  }

  console.log(`next: read results/${args.mode}/<arm>/<pN>/answer.md and grade against targets.json.`);
}

main();
