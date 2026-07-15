#!/usr/bin/env node
// selfcheck-code-review.mjs -- offline, ZERO-SPEND Wave-0 gate for the Phase-14 harness extensions.
// It proves the three run-e2e.mjs extensions compose correctly and leave the borrowed repos pristine
// BEFORE any metered claude -p run (D-12). It NEVER calls claude; every step is a --dry-run compose,
// a git-only synthetic-branch build/teardown, or an offline transcript parse.
//
// Three cruxes (RESEARCH "Wave 0 Gaps"):
//   1. COMPOSITION  -- code_review composes /mattpocock-skills:code-review <ROOT> with the mattpocock
//      plugin dir and NO Bash blocked; invoke_skill still blocks Bash and points at plugins/lz-tdd.
//   2. SYNTHETIC BRANCH -- for a nx target AND the kata target, the throwaway branch = the whole
//      target file (three-dot diff non-empty), is scoped to exactly the ROOT-relative target path,
//      the kata arm cwd is <worktree>/TypeScript (Pitfall 4), and teardown leaves the repo clean.
//   3. TRANSCRIPT PARSE -- the extended extractResult() reads token/cost/tool fields off an existing
//      on-disk transcript.
//
// Fail-closed: any violation prints a FAIL line and exits 1. Prints an OK line and exits 0 on success.
// ponytail: single self-contained script, no framework. NOT wired into `npm run check` (it touches
// the borrowed repos); run it explicitly.
//
// Usage: node e2e-nx/selfcheck-code-review.mjs

import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { buildSyntheticBase, extractResult, git } from './run-e2e.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const runE2e = join(here, 'run-e2e.mjs');
const workspace = join(here, '..');

function fail(msg) {
  console.error(`selfcheck-code-review: FAIL - ${msg}`);
  process.exit(1);
}

function readJson(p) {
  let raw;

  try {
    raw = readFileSync(p, 'utf8');
  } catch (err) {
    fail(`cannot read ${p}: ${err.message}`);
  }

  try {
    return JSON.parse(raw);
  } catch (err) {
    fail(`invalid JSON in ${p}: ${err.message}`);
  }
}

// ---- crux 1: command composition (--dry-run, zero spend) -------------------------------------

// Spawn `node run-e2e.mjs --dry-run <extra>` and return the parsed `argv:` line(s) it prints.
function dryRunArgvs(extraArgs) {
  const r = spawnSync(process.execPath, [runE2e, '--dry-run', ...extraArgs], {
    cwd: here,
    encoding: 'utf8',
  });

  if (r.status !== 0) {
    fail(`dry-run '${extraArgs.join(' ')}' exited ${r.status}: ${(r.stderr || '').trim()}`);
  }

  const argvs = (r.stdout || '')
    .split('\n')
    .filter((l) => l.startsWith('argv: '))
    .map((l) => JSON.parse(l.slice('argv: '.length)));

  if (!argvs.length) {
    fail(`dry-run '${extraArgs.join(' ')}' produced no argv: line`);
  }

  return argvs;
}

// Value immediately after a single-value flag (e.g. -p, --plugin-dir).
function flagValue(argv, flag) {
  const i = argv.indexOf(flag);

  return i >= 0 ? argv[i + 1] : undefined;
}

// All values after --disallowedTools up to the next --flag (it is a multi-value flag).
function disallowedTools(argv) {
  const i = argv.indexOf('--disallowedTools');

  if (i < 0) {
    return [];
  }

  const out = [];

  for (let j = i + 1; j < argv.length; j++) {
    if (argv[j].startsWith('--')) {
      break;
    }

    out.push(argv[j]);
  }

  return out;
}

function checkComposition() {
  // code_review + synthetic-base
  const [crArgv] = dryRunArgvs(['--arm', 'code_review', '--synthetic-base', '--prompt', 'p1']);
  const crPrompt = flagValue(crArgv, '-p');

  if (!/^\/mattpocock-skills:code-review [0-9a-f]{40}$/.test(crPrompt || '')) {
    fail(`code_review -p is not '/mattpocock-skills:code-review <40-hex ROOT>': ${JSON.stringify(crPrompt)}`);
  }

  const crPlugin = flagValue(crArgv, '--plugin-dir') || '';

  if (!/mattpocock-skills/.test(crPlugin)) {
    fail(`code_review --plugin-dir is not the mattpocock cache: ${JSON.stringify(crPlugin)}`);
  }

  const crDisallowed = disallowedTools(crArgv);

  if (crDisallowed.includes('Bash')) {
    fail(`code_review --disallowedTools must NOT include Bash (code-review needs git): ${crDisallowed.join(' ')}`);
  }

  // invoke_skill (the recommend profile must be unchanged: Bash blocked, plugin = plugins/lz-tdd)
  const [isArgv] = dryRunArgvs(['--arm', 'invoke_skill', '--prompt', 'p1']);
  const isDisallowed = disallowedTools(isArgv);

  if (!isDisallowed.includes('Bash')) {
    fail(`invoke_skill --disallowedTools MUST include Bash (read-only recommend profile): ${isDisallowed.join(' ')}`);
  }

  const isPlugin = flagValue(isArgv, '--plugin-dir') || '';

  if (!/[\\/]plugins[\\/]lz-tdd$/.test(isPlugin)) {
    fail(`invoke_skill --plugin-dir is not plugins/lz-tdd: ${JSON.stringify(isPlugin)}`);
  }

  console.log('  [crux 1] composition OK (code_review: /mattpocock-skills:code-review <ROOT>, mattpocock plugin, Bash allowed; invoke_skill: Bash blocked, lz-tdd plugin)');
}

// ---- crux 2: synthetic branch build/teardown + scope (git only, zero spend) ------------------

function loadSuiteCtx(suiteDir) {
  const suite = readJson(join(suiteDir, 'suite.json'));
  const targets = readJson(join(suiteDir, 'targets.json'));

  return {
    repo: suite.repo,
    applyBase: suite.applyBase,
    targetsById: new Map((targets.targets || []).map((t) => [t.id, t])),
    protectedBranches: suite.protectedBranches || ['main', 'master'],
  };
}

function checkSyntheticBase(label, suiteDir, targetId, expectRootRelPath, expectArmSubdir) {
  const ctx = loadSuiteCtx(suiteDir);
  const promptEntry = { id: `sc-${label}`, target: targetId };
  let syn;

  try {
    syn = buildSyntheticBase(promptEntry, ctx, { dryRun: false });
  } catch (err) {
    fail(`[${label}] synthetic-base build threw: ${err.message}`);
  }

  try {
    if (syn.rootRelPath !== expectRootRelPath) {
      fail(`[${label}] rootRelPath '${syn.rootRelPath}' != expected '${expectRootRelPath}'`);
    }

    // three-dot diff ROOT...TIP (code-review's exact command) must be the whole target file
    const diff = git(syn.gitRoot, ['diff', `${syn.root}...${syn.tip}`, '--stat']);

    if (diff.status !== 0 || !(diff.stdout || '').trim()) {
      fail(`[${label}] three-dot diff ROOT...TIP empty or errored (exit ${diff.status})`);
    }

    // tree must be scoped to EXACTLY the target path (Pitfall 2: no whole-repo review)
    const ls = git(syn.gitRoot, ['ls-tree', '-r', '--name-only', syn.tip]);
    const files = (ls.stdout || '').split('\n').map((s) => s.trim()).filter(Boolean);

    if (files.length !== 1 || files[0] !== expectRootRelPath) {
      fail(`[${label}] ls-tree TIP is not exactly ['${expectRootRelPath}']: ${JSON.stringify(files)}`);
    }

    // arm cwd = worktree (+ subdir for kata; Pitfall 4)
    const wantCwd = expectArmSubdir ? join(syn.worktree, expectArmSubdir) : syn.worktree;

    if (syn.armCwd !== wantCwd) {
      fail(`[${label}] armCwd '${syn.armCwd}' != expected '${wantCwd}' (Pitfall 4 path prefix)`);
    }
  } finally {
    syn.teardown();
  }

  // teardown must leave the borrowed repo pristine (Pitfall 6)
  const porcelain = (git(syn.gitRoot, ['status', '--porcelain']).stdout || '').trim();

  if (porcelain) {
    fail(`[${label}] repo not clean after teardown: ${porcelain}`);
  }

  const branches = (git(syn.gitRoot, ['branch', '--list', 'review-*']).stdout || '').trim();

  if (branches) {
    fail(`[${label}] leftover review-* branch after teardown: ${branches}`);
  }

  const worktrees = git(syn.gitRoot, ['worktree', 'list']).stdout || '';

  if (/lz-review-wt-/.test(worktrees)) {
    fail(`[${label}] leftover review worktree after teardown:\n${worktrees}`);
  }

  console.log(`  [crux 2:${label}] synthetic branch OK (whole-file three-dot diff, scoped to ${expectRootRelPath}, armCwd correct, torn down clean)`);
}

// ---- crux 3: transcript parse (offline, zero spend) ------------------------------------------

function checkTranscriptParse() {
  const transcript = join(here, 'results', 'apply', 'no_skill', 'p1', 'run-1', 'outputs', 'transcript.stream.jsonl');
  let raw;

  try {
    raw = readFileSync(transcript, 'utf8');
  } catch (err) {
    fail(`cannot read on-disk transcript ${transcript}: ${err.message}`);
  }

  const r = extractResult(raw);

  if (!(r.input_tokens > 0)) {
    fail(`transcript parse: input_tokens not > 0 (got ${r.input_tokens})`);
  }

  if (!(r.total_cost_usd > 0)) {
    fail(`transcript parse: total_cost_usd not > 0 (got ${r.total_cost_usd})`);
  }

  if (!r.tool_calls || Object.keys(r.tool_calls).length === 0) {
    fail('transcript parse: tool_calls histogram is empty');
  }

  console.log(`  [crux 3] transcript parse OK (input_tokens=${r.input_tokens}, total_cost_usd=${r.total_cost_usd}, tools=${Object.keys(r.tool_calls).join('+')})`);
}

// ---- run all three -----------------------------------------------------------------------------

checkComposition();
checkSyntheticBase('nx', join(here), 'T1', 'packages/eslint-plugin/src/rules/enforce-module-boundaries.ts', '');
checkSyntheticBase('kata', join(workspace, 'e2e-gilded-rose'), 'G1', 'TypeScript/app/gilded-rose.ts', 'TypeScript');
checkTranscriptParse();

console.log('selfcheck-code-review: OK - all three cruxes pass (composition, synthetic branch build/teardown+scope for nx+kata, transcript parse); zero spend, borrowed repos clean');
process.exit(0);
