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
const PLUGIN_DIR = path.join(REPO_ROOT, 'plugins', 'lz-tdd');
const NX_REPO = 'D:/projects/github/nrwl/nx';
const MODEL = process.env.E2E_MODEL || 'claude-opus-4-8';
const SETTING_SOURCES = 'project';

const PROMPTS = [
  { id: 'p1', file: 'p1-enforce-module-boundaries-run.md', target: 'T1' },
  { id: 'p2', file: 'p2-validate-entry-mode.md', target: 'T2' },
  { id: 'p3', file: 'p3-transitive-deps-loops.md', target: 'T3' },
  { id: 'p4', file: 'p4-group-imports-reduce.md', target: 'T4' },
  { id: 'p5', file: 'p5-reference-depattern.md', target: 'T5' },
  { id: 'p6', file: 'p6-seam-handoff.md', target: 'T6' },
];

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
    'steps. After editing, typecheck the touched file(s) with the package tsc and run the affected ' +
    'tests to confirm nothing broke. Here is my question:\n\n',
};

function parseArgs(argv) {
  const args = { mode: 'recommend', arm: 'with_skill', prompts: [], dryRun: false, report: false, cwd: null };

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];

    if (a === '--dry-run') {
      args.dryRun = true;
    } else if (a === '--report') {
      args.report = true;
    } else if (a === '--mode') {
      args.mode = argv[++i];
    } else if (a === '--arm') {
      args.arm = argv[++i];
    } else if (a === '--prompt') {
      args.prompts.push(argv[++i]);
    } else if (a === '--cwd') {
      args.cwd = argv[++i];
    } else {
      throw new Error(`unknown arg: ${a}`);
    }
  }

  if (!['recommend', 'apply'].includes(args.mode)) {
    throw new Error(`--mode must be recommend|apply, got ${args.mode}`);
  }

  if (!['with_skill', 'no_skill', 'both'].includes(args.arm)) {
    throw new Error(`--arm must be with_skill|no_skill|both, got ${args.arm}`);
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

function composePrompt(promptEntry, mode) {
  const body = fs.readFileSync(path.join(HERE, 'prompts', promptEntry.file), 'utf8').trim();

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
  ];

  if (mode === 'recommend') {
    // Read-only: reads never prompt, writes/shell are impossible.
    cmd.push('--permission-mode', 'bypassPermissions');
    cmd.push('--disallowedTools', 'Edit', 'Write', 'MultiEdit', 'NotebookEdit', 'Bash');
  } else {
    cmd.push('--permission-mode', 'bypassPermissions');
  }

  if (arm === 'with_skill') {
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

function runOne(claude, promptEntry, arm, mode, cwd) {
  const fullPrompt = composePrompt(promptEntry, mode);
  const cmd = buildCmd(fullPrompt, arm, mode);
  const outDir = path.join(HERE, 'results', mode, arm, promptEntry.id);
  const rawDir = path.join(outDir, 'outputs'); // gitignored (**/outputs/)
  fs.mkdirSync(rawDir, { recursive: true });

  const env = { ...process.env };
  delete env.CLAUDECODE;

  const started = Date.now();
  const res = spawnSync(claude, cmd, {
    cwd,
    env,
    encoding: 'utf8',
    maxBuffer: 128 * 1024 * 1024,
    windowsHide: true,
  });
  const elapsedMs = Date.now() - started;

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

  const meta = {
    prompt_id: promptEntry.id,
    target: promptEntry.target,
    arm,
    mode,
    cwd,
    model: MODEL,
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
    `  [${mode}/${arm}] ${promptEntry.id} (${promptEntry.target}) -> exit ${res.status}, ` +
      `${(elapsedMs / 1000).toFixed(0)}s, ${meta.answer_chars} chars, ${flag}`,
  );

  return meta;
}

function report() {
  const rows = [];
  const resultsRoot = path.join(HERE, 'results');

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

  metas.sort((a, b) => `${a.mode}${a.prompt_id}${a.arm}`.localeCompare(`${b.mode}${b.prompt_id}${b.arm}`));
  console.log('\n=== captured runs ===');

  for (const m of metas) {
    console.log(
      `${m.mode.padEnd(9)} ${m.prompt_id} ${m.target.padEnd(3)} ${m.arm.padEnd(10)} ` +
        `exit ${m.exit_code}  ${String(Math.round(m.elapsed_ms / 1000)).padStart(4)}s  ${m.answer_chars} chars  ${skillFlag(m)}`,
    );
  }

  console.log(`\n${metas.length} runs captured.`);
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.report) {
    report();

    return;
  }

  const selected = args.prompts.length
    ? PROMPTS.filter((p) => args.prompts.includes(p.id))
    : PROMPTS;

  if (!selected.length) {
    throw new Error(`no prompts matched: ${args.prompts.join(', ')}`);
  }

  const arms = args.arm === 'both' ? ['with_skill', 'no_skill'] : [args.arm];
  const cwd = args.cwd || NX_REPO;

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
    console.log(`claude   : ${claude}`);
    console.log(`repo cwd : ${cwd}`);
    console.log(`plugin   : ${PLUGIN_DIR}`);
    console.log(`model    : ${MODEL}`);
    console.log(`mode     : ${args.mode}   arms: ${arms.join(', ')}   prompts: ${selected.map((p) => p.id).join(', ')}`);

    for (const p of selected) {
      for (const arm of arms) {
        const full = composePrompt(p, args.mode);
        const cmd = buildCmd(full, arm, args.mode);
        console.log(`\n--- ${args.mode}/${arm}/${p.id} (${p.target}) ---`);
        console.log(`cmd: claude ${cmd.map((c) => (c.length > 60 ? c.slice(0, 57) + '...' : c)).map((c) => (/\s/.test(c) ? `"${c}"` : c)).join(' ')}`);
      }
    }

    console.log(`\n${selected.length * arms.length} runs would execute. Re-run without --dry-run to spend.`);

    return;
  }

  const claude = resolveClaude();
  console.log(`running ${selected.length * arms.length} claude -p sessions (mode=${args.mode}, model=${MODEL})...`);
  const metas = [];

  for (const p of selected) {
    for (const arm of arms) {
      metas.push(runOne(claude, p, arm, args.mode, cwd));
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
