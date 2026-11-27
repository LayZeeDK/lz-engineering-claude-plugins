// The grader model (D-13, D-14): the two `claude plugin eval` grader types the cases use, `regex` on the last message
// and `tool_used` over the tool calls, as the CLI documents them. Slim runs are graded with it from their own
// transcripts, and `crosscheck` grades every plugin-eval run from its copied trace to catch a gap between this model
// and the CLI. Repository-only; nothing here ships with the plugin.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { basename } from 'node:path';
import { readFrontmatter } from './cases.ts';
import { isRecord, jsonLines, readJson } from './guards.ts';
import { resultPath, stageDir, type GraderVerdict, type PlannedRun } from './run-set.ts';
import { outFiles, resultFacts, slimOutput, toolCalls, traceResult, type ToolCall } from './trace.ts';

export interface GraderDef {
  readonly name: string;
  readonly type: 'regex' | 'tool_used';
  readonly pattern: string | null;
  readonly flags: string;
  readonly tool: string | null;
  readonly inputMatch: string | null;
  readonly min: number;
  readonly max: number | null;
  // with-only, both or unset; the CLI applies it when it scores, so the model only carries it.
  readonly arm: string | null;
}

const keysOf: Record<GraderDef['type'], ReadonlySet<string>> = {
  regex: new Set(['type', 'pattern', 'flags', 'arm']),
  tool_used: new Set(['type', 'tool', 'input_match', 'min', 'max', 'arm']),
};

function isGraderType(value: unknown): value is GraderDef['type'] {
  return value === 'regex' || value === 'tool_used';
}

// file_exists and llm graders are not modelled (D-14: deterministic first), so a case that needs one fails here
// instead of passing unchecked.
export function readGrader(file: string): GraderDef {
  const fail = (what: string): Error => new Error(`${file}: ${what}`);
  const { data } = readFrontmatter(readFileSync(file, 'utf8'));
  const { type } = data;

  if (!isGraderType(type)) {
    throw fail(`grader type ${String(type)} is not one the harness models (regex, tool_used)`);
  }

  const unknown = Object.keys(data).filter((key) => !keysOf[type].has(key));

  if (unknown.length > 0) {
    throw fail(`unknown grader keys ${unknown.join(', ')}`);
  }

  const text = (key: string): string | null => {
    const value = data[key];

    if (value !== undefined && typeof value !== 'string') {
      throw fail(`${key} must be a string`);
    }

    return value ?? null;
  };
  const count = (key: string): number | null => {
    const value = data[key];

    if (value !== undefined && (typeof value !== 'number' || value < 0)) {
      throw fail(`${key} must be a whole number of at least 0`);
    }

    return value ?? null;
  };
  const def: GraderDef = {
    name: basename(file, '.md'),
    type,
    pattern: text('pattern'),
    flags: text('flags') ?? '',
    tool: text('tool'),
    inputMatch: text('input_match'),
    min: count('min') ?? 1,
    max: count('max'),
    arm: text('arm'),
  };

  if (type === 'regex' && def.pattern === null) {
    throw fail('a regex grader needs a pattern');
  }

  if (type === 'tool_used' && def.tool === null) {
    throw fail('a tool_used grader needs a tool');
  }

  return def;
}

export function readGraders(caseDir: string): GraderDef[] {
  const dir = `${caseDir}/graders`;

  return existsSync(dir)
    ? readdirSync(dir)
        .filter((name) => name.endsWith('.md'))
        .sort()
        .map((name) => readGrader(`${dir}/${name}`))
    : [];
}

export interface Evidence {
  readonly calls: readonly ToolCall[];
  readonly lastMessage: string;
}

function passes(def: GraderDef, evidence: Evidence): boolean {
  if (def.type === 'regex') {
    return new RegExp(def.pattern ?? '', def.flags).test(evidence.lastMessage);
  }

  const inputMatch = def.inputMatch === null ? null : new RegExp(def.inputMatch);
  const tools = (def.tool ?? '').split('|');
  const count = evidence.calls.filter(
    (call) => tools.includes(call.name) && (inputMatch === null || inputMatch.test(JSON.stringify(call.input ?? null))),
  ).length;

  return def.min <= count && (def.max === null || count <= def.max);
}

export function gradeRun(defs: readonly GraderDef[], evidence: Evidence): GraderVerdict[] {
  return defs.map((def) => ({ name: def.name, passed: passes(def, evidence), scored: true }));
}

// The session's main transcript, then every forked agent's from `<session>/subagents/`. Claude Code names a project's
// transcript folder after its working directory, every character other than a letter or digit turned into `-`.
export function sessionTranscripts(projects: string, cwd: string, session: string): string[] {
  const folder = `${projects}/${cwd.replace(/[^A-Za-z0-9]/g, '-')}`;
  const subagents = `${folder}/${session}/subagents`;
  const agents = existsSync(subagents) ? readdirSync(subagents).filter((name) => name.endsWith('.jsonl')) : [];

  return [`${folder}/${session}.jsonl`, ...agents.sort().map((name) => `${subagents}/${name}`)];
}

function uniqueCalls(calls: readonly ToolCall[]): ToolCall[] {
  const seen = new Set<string>();

  return calls.filter((call) => {
    const fresh = !seen.has(call.id);
    seen.add(call.id);

    return fresh;
  });
}

// A refused call, or a call whose result is an error (an Edit that found no match), changed nothing; a command that ran
// and exited non-zero, such as a test run with a failing test, did run.
function tookEffect(call: ToolCall): boolean {
  return !call.denied && (!call.isError || call.exitCode !== null);
}

// A slim run's evidence: the tool calls that took effect in every session its --out files name (a resume may fork a
// new one), with their subagents, each call once; and the reply of the latest --out file. Slim suites are graded only
// here, so they count effects; plugin-eval traces keep the CLI's count, which crosscheck compares against.
export function runEvidence(runDir: string, projectsDir: string): Evidence {
  const outs = outFiles(`${runDir}/raw`).map((file) => slimOutput(readJson(file)));
  const sessions = [
    ...new Map(outs.flatMap((out) => (out.session === null ? [] : [[out.session, out.cwd ?? ''] as const]))),
  ];

  if (sessions.length === 0) {
    throw new Error('no session id in any --out file');
  }

  const calls = sessions.flatMap(([session, cwd]) => {
    const files = sessionTranscripts(projectsDir, cwd, session);

    if (!existsSync(files[0] ?? '')) {
      throw new Error(`no transcript for session ${session}`);
    }

    return files.flatMap((file) => toolCalls(jsonLines(readFileSync(file, 'utf8'))));
  });
  const latest = outs.at(-1);

  return {
    calls: uniqueCalls(calls).filter(tookEffect),
    lastMessage: (latest === undefined ? null : resultFacts(latest.result).resultText) ?? '',
  };
}

// A plugin-eval trace is the session's stream-json: the same assistant and user entries, then one result entry.
export function traceEvidence(entries: readonly unknown[]): Evidence {
  return { calls: uniqueCalls(toolCalls(entries)), lastMessage: traceResult(entries)?.resultText ?? '' };
}

export interface Disagreement {
  readonly caseName: string;
  readonly run: string;
  readonly side: 'with' | 'without';
  readonly grader: string;
  readonly cli: boolean;
  readonly model: boolean;
}

export interface Unchecked {
  readonly run: string;
  readonly reason: string;
}

// agree counts grader verdicts that match, disagree lists those that do not, and unchecked lists arms of runs the
// model could not grade (no copied trace, or a grader it does not model).
export interface Crosscheck {
  readonly agree: number;
  readonly disagree: readonly Disagreement[];
  readonly unchecked: readonly Unchecked[];
}

function cliVerdicts(value: unknown): Map<string, boolean> | null {
  if (value === null) {
    return null;
  }

  if (!Array.isArray(value)) {
    throw new Error('arm verdicts are not a list');
  }

  return new Map(
    value.map((verdict) => {
      if (!isRecord(verdict) || typeof verdict['name'] !== 'string' || typeof verdict['passed'] !== 'boolean') {
        throw new Error('an arm verdict has no name or passed');
      }

      return [verdict['name'], verdict['passed']];
    }),
  );
}

// Grades every finished plugin-eval run of the plan from its copied traces with the graders of its staged case, and
// compares each verdict with the CLI's.
export function crosscheckRunSet(plan: readonly PlannedRun[], stageRoot: string): Crosscheck {
  let agree = 0;
  const disagree: Disagreement[] = [];
  const unchecked: Unchecked[] = [];
  const finished = plan.filter((run) => run.suite.backend === 'plugin-eval' && existsSync(resultPath(run.runDir)));

  for (const run of finished) {
    const result = readJson(resultPath(run.runDir));
    const arms = isRecord(result) && isRecord(result['arms']) ? result['arms'] : {};

    for (const side of ['with', 'without'] as const) {
      try {
        const cli = cliVerdicts(arms[side] ?? null);

        if (cli === null || cli.size === 0) {
          continue;
        }

        const trace = `${run.runDir}/raw/trace-${side}.jsonl`;

        if (!existsSync(trace)) {
          throw new Error(`no copied trace ${trace}`);
        }

        if (run.ref === null) {
          throw new Error('the run has no ref, so it has no staged case');
        }

        const defs = readGraders(`${stageDir(stageRoot, run.ref)}/lz-tdd/evals/${run.caseInfo.name}`);
        const unmodelled = [...cli.keys()].filter((name) => !defs.some((def) => def.name === name));

        if (unmodelled.length > 0) {
          throw new Error(`the staged case has no modelled grader ${unmodelled.join(', ')}`);
        }

        const model = gradeRun(defs, traceEvidence(jsonLines(readFileSync(trace, 'utf8'))));

        for (const verdict of model.filter(({ name }) => cli.has(name))) {
          if (cli.get(verdict.name) === verdict.passed) {
            agree += 1;
          } else {
            disagree.push({
              caseName: run.caseInfo.name,
              run: run.runDir,
              side,
              grader: verdict.name,
              cli: !verdict.passed,
              model: verdict.passed,
            });
          }
        }
      } catch (error) {
        unchecked.push({ run: run.runDir, reason: `${side}: ${error instanceof Error ? error.message : String(error)}` });
      }
    }
  }

  return { agree, disagree, unchecked };
}
