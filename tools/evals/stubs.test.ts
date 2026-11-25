import assert from 'node:assert/strict';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, test } from 'node:test';

import { jsonLines, readJson, requireRecord } from './guards.ts';
import { projectFolder } from './slim.ts';
import { stubPluginEval, stubRunSlim } from './stubs.ts';
import { limitStopped, slimOutput, traceModels } from './trace.ts';

const root = mkdtempSync(join(tmpdir(), 'lz-evals-stubs-')).replaceAll('\\', '/');

after(() => rmSync(root, { recursive: true, force: true }));

const sonnet = 'claude-sonnet-5-5';

function pluginArgs(dir: string, ablation = 'none'): string[] {
  return ['plugin', 'eval', 'W:/stage/lz-tdd', '--case', 'demo-01', '--runs', '1', '--model', sonnet, '--ablation', ablation, '--output-dir', `${dir}/raw`, '--json', `${dir}/raw/plugin-eval.json`];
}

function firstRun(dir: string, side: 'with' | 'without' = 'with'): Record<string, unknown> {
  const json = requireRecord(readJson(`${dir}/raw/plugin-eval.json`), 'plugin-eval.json');
  const cases = json['cases'];
  const only = requireRecord(Array.isArray(cases) ? cases[0] : null, 'case');
  const runs = requireRecord(only['arms'], 'arms')[side];

  return requireRecord(Array.isArray(runs) ? runs[0] : null, 'run');
}

test('the plugin eval stand-in writes the result JSON and a trace per arm, and logs its argv', () => {
  const dir = `${root}/pe-happy`;
  const env = { LZ_EVAL_STUB_DIR: `${root}/stub-happy` };

  assert.equal(stubPluginEval(pluginArgs(dir, 'with-without'), env), 0);
  const tracePath = firstRun(dir)['tracePath'];
  assert.ok(typeof tracePath === 'string');
  assert.deepEqual(traceModels(jsonLines(readFileSync(tracePath, 'utf8'))).init, sonnet);
  assert.equal(typeof firstRun(dir, 'without')['tracePath'], 'string');
  assert.deepEqual(firstRun(dir)['graders'], [{ name: 'stub', passed: true, weight: 1, scored: true }]);
  assert.equal(readFileSync(`${root}/stub-happy/argv.jsonl`, 'utf8').trim(), JSON.stringify(pluginArgs(dir, 'with-without')));
});

test('the plugin eval stand-in honours the error, model and exit switches', () => {
  const run = (name: string, env: NodeJS.ProcessEnv): { code: number | 'hang'; dir: string } => {
    const dir = `${root}/pe-${name}`;

    return { code: stubPluginEval(pluginArgs(dir), env), dir };
  };
  const limit = run('limit', { LZ_EVAL_STUB_ERROR: 'limit' });
  const other = run('other', { LZ_EVAL_STUB_ERROR: 'other' });
  const maxTurns = run('max', { LZ_EVAL_STUB_ERROR: 'max-turns' });
  const model = run('model', { LZ_EVAL_STUB_MODEL: 'claude-opus-5-5' });
  const exit = run('exit', { LZ_EVAL_STUB_EXIT: '130' });

  assert.deepEqual(
    [limit.code, other.code, maxTurns.code, model.code, exit.code],
    [1, 1, 0, 0, 130],
  );
  assert.deepEqual(
    [firstRun(limit.dir)['error'], firstRun(other.dir)['error'], firstRun(maxTurns.dir)['error']],
    [
      "exit 1: You've hit your 5-hour limit resets 6:30am (Europe/Copenhagen)",
      'exit 1: API Error',
      'exit 1: Reached maximum number of turns (3)',
    ],
  );
  const modelTrace = firstRun(model.dir)['tracePath'];
  assert.ok(typeof modelTrace === 'string');
  assert.deepEqual(traceModels(jsonLines(readFileSync(modelTrace, 'utf8'))).used, ['claude-opus-5-5']);
  assert.deepEqual([existsSync(`${exit.dir}/raw/plugin-eval.json`), existsSync(`${exit.dir}/raw/trace-stub-with.jsonl`)], [false, true]);
});

test('the run-slim stand-in writes a transcript at start and an --out file in run-slim shape', () => {
  const projects = `${root}/projects`;
  const cwd = `${root}/cwd-1`;
  mkdirSync(cwd, { recursive: true });
  writeFileSync(`${root}/prompt.txt`, 'Make it pass.\n');
  const env = { LZ_EVAL_PROJECTS_DIR: projects };
  const args = ['--cwd', cwd, '--prompt-file', `${root}/prompt.txt`, '--out', `${root}/slim/result.json`, '--model', sonnet];

  assert.equal(stubRunSlim(args, env), 0);
  const transcripts = readdirSync(`${projects}/${projectFolder(cwd)}`);
  assert.equal(transcripts.length, 1);
  const out = slimOutput(readJson(`${root}/slim/result.json`));
  assert.match(String(out.session), /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
  assert.deepEqual(
    [out.status, `${String(out.session)}.jsonl`, Object.keys(requireRecord(out.result['modelUsage'], 'modelUsage'))],
    [0, transcripts[0], [sonnet]],
  );
  assert.equal(requireRecord(readJson(`${root}/slim/result.json`), 'out')['prompt'], 'Make it pass.\n');

  const resumed = [...args.slice(0, 5), `${root}/slim/result-resume-1.json`, '--model', sonnet, '--resume', String(out.session)];
  assert.equal(stubRunSlim(resumed, env), 0);
  assert.equal(slimOutput(readJson(`${root}/slim/result-resume-1.json`)).session, out.session);
  assert.equal(readdirSync(`${projects}/${projectFolder(cwd)}`).length, 1);

  assert.equal(stubRunSlim([...args.slice(0, 5), `${root}/slim/limit.json`, '--model', sonnet], { ...env, LZ_EVAL_STUB_ERROR: 'limit' }), 0);
  assert.equal(limitStopped(String(slimOutput(readJson(`${root}/slim/limit.json`)).result['result'])), true);
});

test('both stand-ins hang on the invocation after LZ_EVAL_STUB_HANG_AFTER, leaving start files only', () => {
  const stubDir = `${root}/stub-hang`;
  const projects = `${root}/projects-hang`;
  const env = { LZ_EVAL_STUB_DIR: stubDir, LZ_EVAL_STUB_HANG_AFTER: '1', LZ_EVAL_PROJECTS_DIR: projects };
  const cwd = `${root}/cwd-hang`;
  mkdirSync(cwd, { recursive: true });
  writeFileSync(`${root}/prompt-hang.txt`, 'x');
  const slimArgs = ['--cwd', cwd, '--prompt-file', `${root}/prompt-hang.txt`, '--out', `${root}/hang/result.json`, '--model', sonnet];

  assert.equal(stubPluginEval(pluginArgs(`${root}/pe-before-hang`), env), 0);
  assert.equal(existsSync(`${stubDir}/hung`), false);
  assert.equal(stubRunSlim(slimArgs, env), 'hang');
  assert.deepEqual(
    [existsSync(`${stubDir}/hung`), existsSync(`${root}/hang/result.json`), readdirSync(`${projects}/${projectFolder(cwd)}`).length],
    [true, false, 1],
  );
  assert.equal(stubPluginEval(pluginArgs(`${root}/pe-hang`), env), 'hang');
  assert.equal(existsSync(`${root}/pe-hang/raw/plugin-eval.json`), false);
});
