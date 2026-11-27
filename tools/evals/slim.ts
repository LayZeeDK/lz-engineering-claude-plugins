// The slim `claude -p` backend, through run-slim.ts, for cases that must run tests. Each run gets its own working
// folder below LZ_EVAL_SLIM_ROOT, and a stopped run continues its own session with `--resume`. Repository-only;
// nothing here ships with the plugin.
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { join } from 'node:path';
import { readCaseYaml } from './cases.ts';
import { isRecord, readJson } from './guards.ts';
import {
  forwardSlashes,
  scriptOrBinary,
  settleRun,
  spawnLogged,
  stageDir,
  type Command,
  type Normalized,
  type PlannedRun,
  type RunOutcome,
  type Trees,
} from './run-set.ts';
import { gradeRun, readGraders, runEvidence, type GraderDef } from './grade.ts';
import { cleanEnv, copyTemplate } from './templates.ts';
import {
  limitStopped,
  modelRefusal,
  namesModel,
  outFiles,
  resultFacts,
  slimOutput,
  usageTokens,
  type SlimOutput,
} from './trace.ts';

export function runSlimCommand(env: NodeJS.ProcessEnv): Command {
  return scriptOrBinary(env['LZ_EVAL_RUN_SLIM'] ?? join(homedir(), '.claude/references/slim-claude-p/run-slim.ts'));
}

export interface SlimInput {
  readonly cwd: string;
  readonly rawDir: string;
  readonly model: string;
  readonly timeoutMinutes: number;
  readonly pluginDir: string | null;
  readonly allow: string | null;
}

// A suite's allow list names the staged plugin folder as {plugin}, since its path depends on the checkout and the
// ref. Permission rules match Windows paths in POSIX form (D:\x is /d/x) and take // for a path from the root. With
// no plugin (the no-plugin arm) a rule naming {plugin} is dropped.
function expandAllow(allow: string, pluginDir: string | null): string {
  if (pluginDir === null) {
    return allow.replaceAll(/\s*[A-Za-z]+\(\{plugin\}[^)]*\)/g, '').trim();
  }

  if (/[\s()]/.test(pluginDir)) {
    throw new Error(`the plugin folder ${pluginDir} holds a space or a parenthesis, which an allow rule cannot carry`);
  }

  const posix = pluginDir.replaceAll('\\', '/').replace(/^([A-Za-z]):/, (_drive, letter: string) => `/${letter.toLowerCase()}`);

  return allow.replaceAll('{plugin}', `/${posix}`);
}

// No rules folder: the session sees the plugin under test and nothing of the maintainer's setup. --offline replaces
// the maintainer's allow list with run-slim's read-only one and denies the network tools, so the suite's own allow
// list is all a run may do beyond reading.
export function slimArgs(input: SlimInput): string[] {
  return [
    ...['--cwd', input.cwd, '--prompt-file', `${input.rawDir}/prompt.txt`, '--out', `${input.rawDir}/result.json`],
    ...['--model', input.model, '--rules', 'none', '--timeout-min', String(input.timeoutMinutes), '--offline'],
    ...(input.pluginDir === null ? [] : ['--plugin-dir', input.pluginDir]),
    ...(input.allow === null ? [] : ['--allow', expandAllow(input.allow, input.pluginDir)]),
  ];
}

function nextResume(rawDir: string): number {
  const last = outFiles(rawDir)
    .map((file) => /result-resume-(\d+)\.json$/.exec(file)?.[1])
    .filter((number) => number !== undefined)
    .map(Number);

  return Math.max(0, ...last) + 1;
}

// A stopped run goes on in its own session, from continue.txt, into the next result-resume-<n>.json.
export function resumeArgs(input: SlimInput, session: string): string[] {
  const args = slimArgs(input);
  args[args.indexOf('--prompt-file') + 1] = `${input.rawDir}/continue.txt`;
  args[args.indexOf('--out') + 1] = `${input.rawDir}/result-resume-${String(nextResume(input.rawDir))}.json`;

  return [...args, '--resume', session];
}

// Claude Code names a project's transcript folder after its working directory, every character other than a letter or
// digit turned into `-`.
export function projectFolder(cwd: string): string {
  return cwd.replace(/[^A-Za-z0-9]/g, '-');
}

interface Started {
  readonly startedAt: string;
  readonly cwd: string;
}

function readStarted(runDir: string): Started | null {
  const file = `${runDir}/raw/started.json`;
  const value = existsSync(file) ? readJson(file) : null;

  return isRecord(value) && typeof value['startedAt'] === 'string' && typeof value['cwd'] === 'string'
    ? { startedAt: value['startedAt'], cwd: value['cwd'] }
    : null;
}

const transcriptName = /^([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\.jsonl$/;

// The latest --out file names the session. A session killed before it printed anything left none, so then the run's
// own transcript folder does: each run has its own working folder, so one transcript written since the run started is
// that run's. Zero or two candidates give null: rerun it.
export function sessionId(runDir: string, projectsDir: string): string | null {
  const latest = outFiles(`${runDir}/raw`).at(-1);
  const fromOut = latest === undefined ? null : slimOutput(readJson(latest)).session;

  if (fromOut !== null) {
    return fromOut;
  }

  const started = readStarted(runDir);

  if (started === null) {
    return null;
  }

  const folder = `${projectsDir}/${projectFolder(started.cwd)}`;
  const since = Date.parse(started.startedAt);
  const candidates = existsSync(folder)
    ? readdirSync(folder).flatMap((name) => {
        const session = transcriptName.exec(name)?.[1];

        return session !== undefined && statSync(`${folder}/${name}`).mtimeMs >= since ? [session] : [];
      })
    : [];

  return candidates.length === 1 ? (candidates[0] ?? null) : null;
}

// Short, so a copied node_modules stays under the Windows path limit; below the slim root, outside the home folder and
// this repository, so no CLAUDE.md above it loads.
export function slimCwd(slimRoot: string, run: PlannedRun): string {
  const key = `${run.arm}/${run.model}/${run.caseInfo.name}/run-${String(run.k)}`;

  return `${slimRoot}/runs/${run.runSetName}-${createHash('sha256').update(key).digest('hex').slice(0, 12)}`;
}

// The harness made this folder; anything outside <slim root>/runs/ is refused rather than deleted.
function freshCwd(slimRoot: string, cwd: string): void {
  const runsRoot = `${forwardSlashes(slimRoot)}/runs/`;

  if (!forwardSlashes(cwd).startsWith(runsRoot)) {
    throw new Error(`${cwd} is not below ${runsRoot}; refusing to delete it`);
  }

  rmSync(cwd, { recursive: true, force: true });
  mkdirSync(cwd, { recursive: true });
}

function sum(values: readonly number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

function usedModels(output: SlimOutput): string[] {
  const usage = output.result['modelUsage'];

  return isRecord(usage) ? Object.keys(usage) : [];
}

export interface SlimMeta extends Trees {
  readonly binary: string;
}

// Seconds and turns are each part's own; cost and tokens are running totals of the session every resume continues.
export function normalizeSlim(run: PlannedRun, outs: readonly SlimOutput[], latest: SlimOutput | null, meta: SlimMeta): Normalized {
  if (latest === null) {
    return { outcome: 'failed', reason: 'run-slim wrote no --out file' };
  }

  const text = resultFacts(latest.result).resultText;

  // A session the usage limit ended exits 0; its result text decides.
  if (limitStopped(text, latest.result)) {
    return { outcome: 'limit', reason: `usage limit: ${String(text)}` };
  }

  if (latest.status !== 0 || latest.result['is_error'] !== false) {
    return { outcome: 'failed', reason: `the session ended with status ${String(latest.status)} or an error result` };
  }

  const used = [...new Set(outs.flatMap(usedModels))];
  const ran = used.find((model) => namesModel(run.model, model)) ?? used[0] ?? null;
  const refusal = modelRefusal(run.model, ran, used);

  if (refusal !== null) {
    return { outcome: 'failed', reason: refusal };
  }

  const facts = outs.map((output) => resultFacts(output.result));
  const tokens = outs.map((output) => usageTokens(output.result['modelUsage']));
  const started = readStarted(run.runDir);

  return {
    outcome: 'done',
    result: {
      schemaVersion: 1,
      backend: 'slim',
      runSet: run.runSetName,
      arm: run.arm,
      ref: run.ref,
      pluginTree: meta.pluginTree,
      casesTree: meta.casesTree,
      suite: run.suite.name,
      case: run.caseInfo.name,
      k: run.k,
      requestedModel: run.model,
      initModel: ran,
      modelsUsed: used,
      claudeCodeVersion: null,
      binary: meta.binary,
      startedAt: started?.startedAt ?? '',
      seconds: Math.round(sum(outs.map(({ ms }) => ms)) / 1000),
      turns: sum(facts.map(({ turns }) => turns)),
      costUsd: Math.max(0, ...facts.map(({ costUsd }) => costUsd)),
      judgeCostUsd: 0,
      tokens: {
        input: Math.max(0, ...tokens.map(({ input }) => input)),
        output: Math.max(0, ...tokens.map(({ output }) => output)),
        cacheRead: Math.max(0, ...tokens.map(({ cacheRead }) => cacheRead)),
        cacheCreation: Math.max(0, ...tokens.map(({ cacheCreation }) => cacheCreation)),
      },
      maxTurns: false,
      graded: false,
      arms: { with: [], without: null },
    },
  };
}

// A finished session is graded from its own transcripts with the case's graders (D-13), as read when `run` found the
// cases committed, so an edit made while runs go on never grades them; a session whose transcript is gone cannot be
// graded, so it fails.
function graded(run: PlannedRun, normalized: Normalized, projectsDir: string, graders: readonly GraderDef[]): Normalized {
  if (normalized.outcome !== 'done') {
    return normalized;
  }

  try {
    const verdicts = gradeRun(graders, runEvidence(run.runDir, projectsDir));

    return { outcome: 'done', result: { ...normalized.result, graded: true, arms: { with: verdicts, without: null } } };
  } catch (error) {
    return { outcome: 'failed', reason: error instanceof Error ? error.message : String(error) };
  }
}

// Reads what the invocation that just ended wrote (outFile) and every earlier part, grades it and settles the run.
export function settleSlim(
  run: PlannedRun,
  outFile: string,
  status: number | null,
  meta: SlimMeta,
  projectsDir: string,
  graders: readonly GraderDef[],
): RunOutcome {
  const outs = outFiles(`${run.runDir}/raw`).map((file) => slimOutput(readJson(file)));
  const latest = existsSync(outFile) ? slimOutput(readJson(outFile)) : null;

  return settleRun(run.runDir, graded(run, normalizeSlim(run, outs, latest, meta), projectsDir, graders), status);
}

export interface SlimContext {
  readonly stageRoot: string;
  readonly slimRoot: string;
  readonly runSlim: Command;
  readonly projectsDir: string;
  readonly trees: (run: PlannedRun) => Trees;
  // Built template folders by template name, for suites with a target.
  readonly templates: ReadonlyMap<string, string>;
  // What each case folder held when the uncommitted-cases check passed, by case folder.
  readonly cases: ReadonlyMap<string, CaseInputs>;
}

export interface CaseInputs {
  readonly graders: readonly GraderDef[];
  readonly scaffold: Buffer | null;
}

export function readCaseInputs(caseDir: string): CaseInputs {
  const script = scaffoldScript(caseDir);

  return { graders: readGraders(caseDir), scaffold: script === null ? null : readFileSync(script) };
}

function caseInputs(run: PlannedRun, ctx: SlimContext): CaseInputs {
  const inputs = ctx.cases.get(run.caseInfo.dir);

  if (inputs === undefined) {
    throw new Error(`the inputs of ${run.caseInfo.name} were not read before the first spawn`);
  }

  return inputs;
}

// The case's committed scaffold script, from case.yaml context.scaffold_script, or null when it has none.
export function scaffoldScript(caseDir: string): string | null {
  const file = `${caseDir}/case.yaml`;
  const script = existsSync(file) ? readCaseYaml(readFileSync(file, 'utf8')).scaffoldScript : null;

  if (script === null) {
    return null;
  }

  if (!script.split('/').every((part) => /^[A-Za-z0-9._-]+$/.test(part) && part !== '.' && part !== '..')) {
    throw new Error(`${file}: scaffold_script must name a file inside the case folder, not ${JSON.stringify(script)}`);
  }

  return `${caseDir}/${script}`;
}

export function slimPluginDir(stageRoot: string, run: PlannedRun): string | null {
  return run.ref === null ? null : `${stageDir(stageRoot, run.ref)}/plugin`;
}

export function slimInput(run: PlannedRun, ctx: SlimContext): SlimInput {
  return {
    cwd: slimCwd(ctx.slimRoot, run),
    rawDir: `${run.runDir}/raw`,
    model: run.model,
    timeoutMinutes: run.suite.timeoutMinutes,
    pluginDir: slimPluginDir(ctx.stageRoot, run),
    allow: run.suite.allow,
  };
}

// Stryker disable all: the heavy lock, the spawned sessions and the command line below start real processes, which
// no unit test does
export function required(name: string, env: NodeJS.ProcessEnv): string {
  const value = env[name];

  if (value === undefined || value === '') {
    throw new Error(`set ${name}`);
  }

  return value;
}

function heavyLock(lock: string, args: readonly string[]): number {
  return spawnSync(process.execPath, [lock, ...args], { stdio: 'inherit' }).status ?? 1;
}

// `heavy`: a stub run of a suite that runs a test suite (D-04). `timing`: a paid run, whose cost and wall clock are
// measured, so peers hold their machine load until it ends.
export type LockMode = 'none' | 'heavy' | 'timing';

export async function withHeavyLock<T>(
  mode: LockMode,
  task: string,
  minutes: number,
  work: () => Promise<T>,
  env: NodeJS.ProcessEnv,
): Promise<T> {
  if (mode === 'none') {
    return work();
  }

  const lock = required('LZ_EVAL_HEAVY_LOCK', env);
  const owner = required('LZ_EVAL_LOCK_OWNER', env);
  const slot = ['--owner', owner, '--task', task, '--minutes', String(minutes)];
  const acquire = ['acquire', ...slot, ...(mode === 'timing' ? ['--timing'] : []), '--pid', String(process.pid)];
  heavyLock(lock, ['wait', ...slot]);

  for (let code = heavyLock(lock, acquire); code !== 0;) {
    if (code === 4) {
      heavyLock(lock, ['wait', ...slot]);
    } else if (code !== 2) {
      throw new Error(`heavy-lock acquire exited ${String(code)}`);
    }

    await new Promise((done) => setTimeout(done, 30_000));
    code = heavyLock(lock, acquire);
  }

  try {
    return await work();
  } finally {
    heavyLock(lock, ['release', '--owner', owner]);
  }
}

function metaOf(run: PlannedRun, ctx: SlimContext): SlimMeta {
  return { binary: ctx.runSlim.prefix[0] ?? ctx.runSlim.file, ...ctx.trees(run) };
}

// The bash that runs scaffold scripts: Git Bash on Windows unless LZ_EVAL_BASH names another.
export function bashOf(env: NodeJS.ProcessEnv): string {
  return env['LZ_EVAL_BASH'] ?? (process.platform === 'win32' ? 'C:/Program Files/Git/bin/bash.exe' : 'bash');
}

// The `plugin eval` scaffold contract, kept for slim runs: bash runs the script in the run's folder for at most 120 s
// with PATH, a temp HOME and TMPDIR only. The script runs from the bytes it is handed, kept as raw/scaffold.sh, and its
// output goes to raw/scaffold.*.txt.
export function runScaffold(bytes: Buffer, cwd: string, rawDir: string, env: NodeJS.ProcessEnv): void {
  const home = mkdtempSync(join(tmpdir(), 'lz-eval-home-'));
  const script = `${rawDir}/scaffold.sh`;
  mkdirSync(rawDir, { recursive: true });
  writeFileSync(script, bytes);

  try {
    const result = spawnSync(bashOf(env), [script], {
      cwd,
      env: cleanEnv(env, home),
      encoding: 'utf8',
      timeout: 120_000,
      windowsHide: true,
    });
    writeFileSync(`${rawDir}/scaffold.stdout.txt`, result.stdout ?? '');
    writeFileSync(`${rawDir}/scaffold.stderr.txt`, result.stderr ?? '');

    if (result.status !== 0) {
      throw new Error(`scaffold ${script} exited ${String(result.status)}${result.error === undefined ? '' : ` (${result.error.message})`}`);
    }
  } finally {
    rmSync(home, { recursive: true, force: true });
  }
}

export async function startSlimRun(run: PlannedRun, ctx: SlimContext): Promise<RunOutcome> {
  const input = slimInput(run, ctx);
  const args = slimArgs(input);
  const { scaffold } = caseInputs(run, ctx);
  freshCwd(ctx.slimRoot, input.cwd);

  if (run.suite.target !== null) {
    const template = ctx.templates.get(run.suite.target);

    if (template === undefined) {
      throw new Error(`template ${run.suite.target} was not built`);
    }

    copyTemplate(template, input.cwd, ctx.slimRoot);
  }

  mkdirSync(input.rawDir, { recursive: true });
  const startedAt = new Date().toISOString();
  writeFileSync(
    `${input.rawDir}/started.json`,
    `${JSON.stringify({ startedAt, cwd: input.cwd, argv: [...ctx.runSlim.prefix, ...args] }, null, 2)}\n`,
  );

  if (scaffold !== null) {
    try {
      runScaffold(scaffold, input.cwd, input.rawDir, process.env);
    } catch (error) {
      return settleRun(run.runDir, { outcome: 'failed', reason: error instanceof Error ? error.message : String(error) }, null);
    }
  }

  writeFileSync(`${input.rawDir}/prompt.txt`, run.caseInfo.body);
  const { status } = await spawnLogged(ctx.runSlim, args, input.rawDir, 'run-slim');

  return settleSlim(run, `${input.rawDir}/result.json`, status, metaOf(run, ctx), ctx.projectsDir, caseInputs(run, ctx).graders);
}

export async function resumeSlimRun(run: PlannedRun, ctx: SlimContext, session: string): Promise<RunOutcome> {
  const input = slimInput(run, ctx);
  const args = resumeArgs(input, session);
  const out = args[args.indexOf('--out') + 1] ?? '';
  writeFileSync(`${input.rawDir}/continue.txt`, 'Continue the task from where you stopped.\n');
  rmSync(`${input.rawDir}/refused.txt`, { force: true });
  const { status } = await spawnLogged(ctx.runSlim, args, input.rawDir, `run-slim-resume-${String(nextResume(input.rawDir))}`);

  return settleSlim(run, out, status, metaOf(run, ctx), ctx.projectsDir, caseInputs(run, ctx).graders);
}
// Stryker restore all
