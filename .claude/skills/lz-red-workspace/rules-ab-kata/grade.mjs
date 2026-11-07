// Usage: node grade.mjs <arm-k> [...]                       grade finished runs
//        node grade.mjs --cycle-logs <sinceMs> <project>   list the cycle logs a run would be credited
// Process metrics from the session transcript (main + subagents), outcome metrics from the produced project.
import { readFileSync, readdirSync, existsSync, copyFileSync, rmSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { cycleLogs } from '../cycle-logs.mjs';

const ids = process.argv.slice(2);
const outDir = join(import.meta.dirname, 'out');
const hiddenSpec = join(import.meta.dirname, 'hidden', 'acceptance.spec.ts');
const runsRoot = join(process.env.SLIM_ROOT ?? 'D:/tmp/slim-claude-p', 'rules-ab', 'runs');
const projects = join(homedir(), '.claude', 'projects');

const transcriptsOf = (sessionId) => {
  const found = [];

  for (const dir of readdirSync(projects)) {
    const main = join(projects, dir, `${sessionId}.jsonl`);

    if (existsSync(main)) {
      found.push(main);
      const subs = join(projects, dir, sessionId, 'subagents');

      if (existsSync(subs)) {
        found.push(...readdirSync(subs).filter((n) => n.endsWith('.jsonl')).map((n) => join(subs, n)));
      }
    }
  }

  return found;
};

const countTests = (text) => (text.match(/^\s*(it|test)(\.each\([^)]*\))?\s*\(/gm) ?? []).length;

const run = (cwd, args) => {
  const result = spawnSync('npx', args, { cwd, shell: true, encoding: 'utf8' });

  return { code: result.status, out: `${result.stdout}\n${result.stderr}` };
};

if (ids[0] === '--cycle-logs') {
  const since = Number(ids[1]);

  if (ids.length !== 3 || ids[1].trim() === '' || !Number.isFinite(since) || ids[2] === '') {
    console.error('Usage: node grade.mjs --cycle-logs <sinceMs> <project>');
    process.exit(2);
  }

  console.log(JSON.stringify(cycleLogs(since, ids[2])));
  process.exit(0);
}

for (const id of ids) {
  const resultFile = join(outDir, `run-${id}.json`);
  const project = join(runsRoot, id);
  const result = JSON.parse(readFileSync(resultFile, 'utf8'));
  let parsed;

  try {
    parsed = JSON.parse(result.stdout);
  } catch {
    console.log(`${id}: unparsable result, status ${result.status}`);
    continue;
  }

  const seen = new Set();
  const skills = {};
  const events = [];
  const toolResults = new Map();
  let testRuns = 0;
  let redRuns = 0;
  let maxTestsAddedInOneSpecEdit = 0;
  let specEdits = 0;
  let sourceEdits = 0;
  let readTestFirst = false;
  const denials = (parsed.permission_denials ?? []).map((d) => `${d.tool_name}:${JSON.stringify(d.tool_input).slice(0, 60)}`);

  for (const file of transcriptsOf(parsed.session_id)) {
    for (const line of readFileSync(file, 'utf8').split('\n')) {
      if (!line.trim()) {
        continue;
      }

      const entry = JSON.parse(line);

      for (const c of Array.isArray(entry.message?.content) ? entry.message.content : []) {
        if (c.type === 'tool_result') {
          const text = Array.isArray(c.content) ? c.content.map((x) => x.text ?? '').join('\n') : String(c.content ?? '');
          toolResults.set(c.tool_use_id, text);
        }

        if (c.type !== 'tool_use' || seen.has(c.id)) {
          continue;
        }

        seen.add(c.id);
        const i = c.input ?? {};

        if (c.name === 'Skill') {
          skills[i.skill] = (skills[i.skill] ?? 0) + 1;
          events.push(`S:${i.skill.replace('lz-tdd:', '')}`);
        } else if ((c.name === 'Write' || c.name === 'Edit') && /spec\.ts$/.test(i.file_path ?? '')) {
          specEdits += 1;
          const added = countTests(i.content ?? i.new_string ?? '') - countTests(i.old_string ?? '');
          maxTestsAddedInOneSpecEdit = Math.max(maxTestsAddedInOneSpecEdit, added);
          events.push(`spec+${added}`);
        } else if ((c.name === 'Write' || c.name === 'Edit') && /shipping\.ts$/.test(i.file_path ?? '')) {
          sourceEdits += 1;
          events.push('src');
        } else if (c.name === 'Bash' && /npm (run )?test|vitest/.test(i.command ?? '')) {
          testRuns += 1;
          events.push(`run:${c.id}`);
        } else if (c.name === 'Read' && /test-first\.md$/.test(i.file_path ?? '')) {
          readTestFirst = true;
        }
      }
    }
  }

  const timeline = events.map((e) => {
    if (!e.startsWith('run:')) {
      return e;
    }

    const text = toolResults.get(e.slice(4)) ?? '';
    const failed = /(\d+) failed/.exec(text);

    if (failed) {
      redRuns += 1;

      return `RED${failed[1]}`;
    }

    return /passed/.test(text) ? 'GREEN' : 'run?';
  });

  const spec = existsSync(join(project, 'src', 'shipping.spec.ts')) ? readFileSync(join(project, 'src', 'shipping.spec.ts'), 'utf8') : '';
  const ownSuite = run(project, ['vitest', 'run', 'src/shipping.spec.ts']);
  copyFileSync(hiddenSpec, join(project, 'src', 'acceptance.spec.ts'));
  const hidden = run(project, ['vitest', 'run', 'src/acceptance.spec.ts']);
  rmSync(join(project, 'src', 'acceptance.spec.ts'));
  const hiddenPassed = /Tests\s+(?:\S+\s+)?(\d+) passed/.exec(hidden.out.replace(/\x1b\[[0-9;]*m/g, ''));
  const hiddenFailed = /(\d+) failed/.exec(hidden.out.replace(/\x1b\[[0-9;]*m/g, ''));
  const tsc = run(project, ['tsc', '--noEmit', '-p', '.']);
  const since = statSync(resultFile).mtimeMs - result.ms;
  const cycleLog = Number.isFinite(since) ? cycleLogs(since, project).join(',') || '-' : 'unknown (no ms in result)';

  console.log(
    [
      `${id}`,
      `cost=$${(parsed.total_cost_usd ?? 0).toFixed(2)}`,
      `min=${((parsed.duration_ms ?? result.ms ?? 0) / 60000).toFixed(1)}`,
      `turns=${parsed.num_turns ?? '?'}`,
      `skills=${JSON.stringify(skills)}`,
      `specTests=${countTests(spec)}`,
      `specEdits=${specEdits}`,
      `maxTestsPerSpecEdit=${maxTestsAddedInOneSpecEdit}`,
      `srcEdits=${sourceEdits}`,
      `testRuns=${testRuns}`,
      `redRuns=${redRuns}`,
      `ownSuite=${ownSuite.code === 0 ? 'pass' : 'FAIL'}`,
      `hidden=${hiddenFailed ? `FAIL ${hiddenFailed[1]}` : 'pass'}${hiddenPassed ? ` (${hiddenPassed[1]} passed)` : ''}`,
      `tsc=${tsc.code === 0 ? 'clean' : 'ERR'}`,
      `readTestFirst=${readTestFirst}`,
      `cycleLog=${cycleLog}`,
      `denials=${denials.length ? denials.join(' | ') : 0}`,
    ].join('  '),
  );
  console.log(`  timeline: ${timeline.join(' ')}`);
}
