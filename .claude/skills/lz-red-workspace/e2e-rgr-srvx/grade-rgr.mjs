// Usage: node grade-rgr.mjs <task-arm-k> [...]         grade finished runs (out/run-<id>.json + the run folder)
//        node grade-rgr.mjs --outcome-only <folder> <task>   grade a folder's code only (reference-solution self-check)
// Outcome metrics come from the produced code; process metrics from the session transcript (main + subagents).
import { copyFileSync, existsSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, relative } from 'node:path';
import { spawnSync } from 'node:child_process';
import { cycleLogs } from '../cycle-logs.ts';

const evalDir = import.meta.dirname;
const tasksRoot = join(process.env.SLIM_ROOT ?? 'D:/tmp/slim-claude-p', 'rgr-eval');
const projects = join(homedir(), '.claude', 'projects');
const testCall = /^\+\s*(it|test)(\.each\([^)]*\))?\s*\(/gm;

const sh = (cwd, command) => {
  const result = spawnSync(command, { cwd, shell: true, encoding: 'utf8', env: { ...process.env, NO_COLOR: '1' } });

  return { code: result.status, out: `${result.stdout}\n${result.stderr}` };
};

const filesUnder = (folder) =>
  readdirSync(folder, { recursive: true })
    .map(String)
    .filter((name) => statSync(join(folder, name)).isFile());

function outcome(project, task) {
  const hiddenRoot = join(tasksRoot, task, 'hidden');
  const copies = filesUnder(hiddenRoot).map((name) => {
    const target = join(project, name.replace(/\.test\.ts$/, '.hidden.test.ts'));
    copyFileSync(join(hiddenRoot, name), target);

    return target;
  });
  const hiddenTests = copies.filter((file) => file.endsWith('.hidden.test.ts')).map((file) => relative(project, file));
  const hidden = sh(project, `npx vitest run ${hiddenTests.join(' ')}`).out;

  for (const file of copies) {
    rmSync(file);
  }

  const passed = /Tests\s+(?:(\d+) failed \| )?(\d+) passed/.exec(hidden);
  const changed = sh(project, 'git diff --name-only base -- src test && git ls-files --others --exclude-standard src test')
    .out.split('\n')
    .map((line) => line.trim())
    .filter((line) => /\.(ts|mjs)$/.test(line));
  const diff = sh(project, 'git diff base -- src test').out;
  const lintTargets = changed.join(' ');
  // The parent already has type errors in files no task touches, so only errors in changed files count.
  const typeErrors = sh(project, 'npx tsc --noEmit --skipLibCheck')
    .out.split('\n')
    .filter((line) => / error TS\d+/.test(line) && changed.some((file) => line.startsWith(`${file}(`)));

  return {
    hidden: passed ? `${passed[2]}/${Number(passed[1] ?? 0) + Number(passed[2])}` : 'ERR',
    hiddenAllPass: passed !== null && passed[1] === undefined,
    tscNewErrors: typeErrors.length,
    oxlint: lintTargets ? (sh(project, `npx oxlint ${lintTargets}`).code === 0 ? 'clean' : 'ERR') : '-',
    oxfmt: lintTargets ? (sh(project, `npx oxfmt --check ${lintTargets}`).code === 0 ? 'clean' : 'ERR') : '-',
    testsAdded: (diff.match(testCall) ?? []).length,
    diff: sh(project, 'git diff --shortstat base -- src test').out.trim() || 'none',
    changed: changed.join(','),
  };
}

function transcriptsOf(sessionId) {
  const found = [];

  for (const folder of readdirSync(projects)) {
    const main = join(projects, folder, `${sessionId}.jsonl`);

    if (existsSync(main)) {
      found.push(main);
      const subagents = join(projects, folder, sessionId, 'subagents');

      if (existsSync(subagents)) {
        found.push(...readdirSync(subagents).filter((name) => name.endsWith('.jsonl')).map((name) => join(subagents, name)));
      }
    }
  }

  return found;
}

function processMetrics(sessionId) {
  const skills = {};
  const events = [];
  const calls = new Map();
  const denials = [];
  const results = new Map();
  const seen = new Set();
  let maxTestsPerTestEdit = 0;
  let readTestFirst = false;

  for (const file of transcriptsOf(sessionId)) {
    for (const line of readFileSync(file, 'utf8').split('\n')) {
      if (!line.trim()) {
        continue;
      }

      for (const c of [JSON.parse(line).message?.content].flat().filter((x) => x && typeof x === 'object')) {
        if (c.type === 'tool_result') {
          results.set(c.tool_use_id, [c.content].flat().map((x) => (typeof x === 'string' ? x : (x?.text ?? ''))).join('\n'));
        }

        if (c.type !== 'tool_use' || seen.has(c.id)) {
          continue;
        }

        seen.add(c.id);
        const input = c.input ?? {};
        calls.set(c.id, `${c.name}:${JSON.stringify(input).slice(0, 50)}`);
        const path = String(input.file_path ?? '');

        if (c.name === 'Skill') {
          skills[input.skill] = (skills[input.skill] ?? 0) + 1;
          events.push(`S:${String(input.skill).replace('lz-tdd:', '')}`);
        } else if ((c.name === 'Edit' || c.name === 'Write') && /\.test\.ts$/.test(path)) {
          const added =
            (`\n${input.new_string ?? input.content ?? ''}`.replace(/\n/g, '\n+').match(testCall) ?? []).length -
            (`\n${input.old_string ?? ''}`.replace(/\n/g, '\n+').match(testCall) ?? []).length;
          maxTestsPerTestEdit = Math.max(maxTestsPerTestEdit, added);
          events.push(`test+${added}`);
        } else if ((c.name === 'Edit' || c.name === 'Write') && /[\\/]src[\\/]/.test(path)) {
          events.push('src');
        } else if (c.name === 'Bash' && /vitest/.test(input.command ?? '')) {
          events.push(`run:${c.id}`);
        } else if (c.name === 'Read' && /test-first\.md$/.test(path)) {
          readTestFirst = true;
        }
      }
    }
  }

  // The result JSON's permission_denials can come back empty after a turn that spawned a background subagent
  // (measured 2026-11-07), so denials are read from the tool results themselves.
  for (const [id, text] of results) {
    if (/has been denied|requires approval|blocked by permission rules/.test(text)) {
      denials.push(calls.get(id) ?? id);
    }
  }

  let redRuns = 0;
  let testRuns = 0;
  const timeline = events.map((event) => {
    if (!event.startsWith('run:')) {
      return event;
    }

    testRuns += 1;
    const text = results.get(event.slice(4)) ?? '';
    const failed = /(\d+) failed/.exec(text);

    if (failed) {
      redRuns += 1;

      return `RED${failed[1]}`;
    }

    return /passed/.test(text) ? 'GREEN' : 'run?';
  });

  return { skills, maxTestsPerTestEdit, testRuns, redRuns, readTestFirst, timeline, denials };
}

const args = process.argv.slice(2);

if (args[0] === '--outcome-only') {
  console.log(JSON.stringify(outcome(args[1], args[2])));
  process.exit(0);
}

for (const id of args) {
  const [task, arm, k] = id.split('-');
  const project = join(tasksRoot, task, 'runs', `${arm}-${k}`);
  const resultFile = join(evalDir, 'out', `run-${id}.json`);
  const raw = JSON.parse(readFileSync(resultFile, 'utf8'));
  const session = JSON.parse(raw.stdout);
  const since = statSync(resultFile).mtimeMs - raw.ms;
  const p = processMetrics(session.session_id);
  const o = outcome(project, task);

  console.log(
    [
      id,
      `cost=$${session.total_cost_usd.toFixed(2)}`,
      `min=${(raw.ms / 60000).toFixed(1)}`,
      `turns=${session.num_turns}`,
      `skills=${JSON.stringify(p.skills)}`,
      `hidden=${o.hidden}`,
      `tscNewErrors=${o.tscNewErrors}`,
      `oxlint=${o.oxlint}`,
      `oxfmt=${o.oxfmt}`,
      `testsAdded=${o.testsAdded}`,
      `maxTestsPerTestEdit=${p.maxTestsPerTestEdit}`,
      `testRuns=${p.testRuns}`,
      `redRuns=${p.redRuns}`,
      `readTestFirst=${p.readTestFirst}`,
      `cycleLog=${Number.isFinite(since) ? cycleLogs(since, project).join(',') || '-' : 'unknown (no ms in result)'}`,
      `models=${Object.keys(session.modelUsage ?? {}).join(',') || '?'}`,
      `denials=${p.denials.join(' | ') || 0}`,
      `diff=${o.diff}`,
    ].join('  '),
  );
  console.log(`  timeline: ${p.timeline.join(' ')}`);
}
