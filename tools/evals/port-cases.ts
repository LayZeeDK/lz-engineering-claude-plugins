// How the trigger and routing cases moved to `claude plugin eval`: this generator reads the trigger sets under
// .claude/skills/<skill>-workspace/evals/ and the e2e-rgr-routing corpus, and writes one suite per skill
// (evals/lz-tdd/trigger-<skill>/) and the routing suite (evals/lz-tdd/routing/). The old JSON sets stay as records
// and are only read here; rerunning the generator over them reproduces the committed cases.
// Repository-only; nothing here ships with the plugin.
//
//   node tools/evals/port-cases.ts      regenerates the four suites from the records
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { basename } from 'node:path';
import { evalRepo } from './cases.ts';
import { isRecord, readJson } from './guards.ts';
import { git } from './stage.ts';

export const skills = ['lz-red', 'lz-tpp', 'lz-refactor'] as const;

export interface GraderSpec {
  readonly name: string;
  readonly skill: string;
  // true: the skill must not fire (min 0, max 0, arm both); false: it must fire.
  readonly quiet: boolean;
}

export interface PortedCase {
  readonly name: string;
  readonly tags: readonly string[];
  readonly body: string;
  readonly graders: readonly GraderSpec[];
}

// The current sets, in the order their queries are numbered, and the set recorded at a commit.
export interface TriggerSpec {
  readonly files: readonly string[];
  // readFrom: the commit the record is read from when sha was never published.
  readonly record: { readonly sha: string; readonly readFrom?: string; readonly path: string };
}

interface Entry {
  readonly query: string;
  readonly fire: boolean;
  readonly canary: boolean;
}

function workspace(skill: string): string {
  return `.claude/skills/${skill}-workspace/evals`;
}

// lz-red numbers heldout-d09.json first, so its baseline picks are held-out queries.
export function triggerSpec(repo: string, skill: string): TriggerSpec {
  const ws = workspace(skill);

  if (skill === 'lz-red') {
    return {
      files: [`${ws}/heldout-d09.json`, `${ws}/trigger-eval.json`, `${ws}/d07-chunks/negatives.json`],
      record: { sha: '8cd13a8', path: `${ws}/heldout-d09.json` },
    };
  }

  if (skill === 'lz-tpp') {
    const chunks = git(repo, ['ls-files', '--', `${ws}/d07-chunks`])
      .split('\n')
      .filter((file) => file.endsWith('.json'))
      .sort();

    return {
      files: [`${ws}/trigger-eval.json`, ...chunks],
      // 5f586da was never published; d85ffeb holds the identical file.
      record: { sha: '5f586da', readFrom: 'd85ffeb', path: `${ws}/trigger-eval.json` },
    };
  }

  if (skill === 'lz-refactor') {
    return {
      files: [`${ws}/trigger-eval.json`, `${ws}/d07-chunks/negatives.json`],
      record: { sha: 'f23c7f8', path: `${ws}/trigger-eval.json` },
    };
  }

  throw new Error(`no trigger sets for skill ${skill}`);
}

function parseEntries(value: unknown, file: string, canaryFile: boolean): Entry[] {
  if (!Array.isArray(value)) {
    throw new Error(`${file} is not a list`);
  }

  return value.map((item: unknown, index) => {
    if (!isRecord(item) || typeof item['query'] !== 'string' || typeof item['should_trigger'] !== 'boolean') {
      throw new Error(`${file} entry ${String(index)} has no query or should_trigger`);
    }

    const note = item['note'];

    return {
      query: item['query'],
      fire: item['should_trigger'],
      canary: canaryFile || (typeof note === 'string' && note.startsWith('CANARY')),
    };
  });
}

function kindTag(file: string): string {
  const name = basename(file);

  if (file.includes('/d07-chunks/')) {
    return 'chunk';
  }

  return name === 'heldout-d09.json' ? 'heldout' : 'forward';
}

function quietGrader(name: string, skill: string): GraderSpec {
  return { name, skill, quiet: true };
}

function pad(index: number): string {
  return String(index + 1).padStart(2, '0');
}

export function triggerCases(repo: string, skill: string, spec: TriggerSpec = triggerSpec(repo, skill)): PortedCase[] {
  const order: string[] = [];
  const facts = new Map<string, { fire: boolean; canary: boolean; kinds: Set<string> }>();

  for (const file of spec.files) {
    for (const entry of parseEntries(readJson(`${repo}/${file}`), file, basename(file).startsWith('canary'))) {
      const known = facts.get(entry.query);

      if (known === undefined) {
        order.push(entry.query);
        facts.set(entry.query, { fire: entry.fire, canary: entry.canary, kinds: new Set([kindTag(file)]) });
      } else if (known.fire !== entry.fire) {
        throw new Error(`query ${JSON.stringify(entry.query)} has two labels in the ${skill} sets`);
      } else {
        known.canary ||= entry.canary;
        known.kinds.add(kindTag(file));
      }
    }
  }

  const recorded = new Set(
    parseEntries(JSON.parse(git(repo, ['show', `${spec.record.readFrom ?? spec.record.sha}:${spec.record.path}`])), spec.record.path, false)
      .filter((entry) => !entry.canary)
      .map((entry) => entry.query),
  );
  const baseline = new Set<string>();

  for (const fire of [true, false]) {
    const picks = order.filter((query) => facts.get(query)?.fire === fire && facts.get(query)?.canary === false).slice(0, 5);

    if (picks.length < 5) {
      throw new Error(`the ${skill} sets have fewer than 5 ${fire ? 'fire' : 'quiet'} queries that are not canaries`);
    }

    picks.forEach((query) => baseline.add(query));
  }

  const siblings = skills.filter((other) => other !== skill);

  return order.map((query, index) => {
    const fact = facts.get(query) ?? { fire: false, canary: false, kinds: new Set<string>() };
    const tags = [
      'trigger',
      skill,
      fact.fire ? 'fire' : 'quiet',
      ...['forward', 'heldout', 'chunk'].filter((kind) => fact.kinds.has(kind)),
      ...(fact.canary ? ['canary'] : []),
      ...(recorded.has(query) ? [`rec-${spec.record.sha}`] : []),
      ...(baseline.has(query) ? ['baseline'] : []),
    ];
    const graders = fact.fire
      ? [{ name: 'skill-fired', skill, quiet: false }, ...siblings.map((other) => quietGrader(`sibling-quiet-${other}`, other))]
      : [quietGrader('quiet', skill)];

    return { name: `trigger-${skill}-${pad(index)}`, tags, body: `${query}\n`, graders };
  });
}

// The e2e-rgr-routing corpus: each case's prompt file verbatim; the expected owner fires, and every skill that is
// neither the owner nor its second hop stays quiet.
export function routingCases(repo: string): PortedCase[] {
  const base = `${repo}/.claude/skills/lz-red-workspace`;
  const corpus = readJson(`${base}/tools/rgr-cases.json`);
  const list = isRecord(corpus) ? corpus['cases'] : null;

  if (!Array.isArray(list)) {
    throw new Error('rgr-cases.json has no cases list');
  }

  const prompts = readdirSync(`${base}/e2e-rgr-routing/prompts`);

  return list.map((item: unknown) => {
    if (!isRecord(item) || typeof item['id'] !== 'string' || typeof item['expectedOwner'] !== 'string') {
      throw new Error('a routing case has no id or expectedOwner');
    }

    const { id, expectedOwner: owner } = item;
    const secondHop = typeof item['expectedSecondHop'] === 'string' ? item['expectedSecondHop'] : null;
    const file = prompts.filter((name) => name.startsWith(`${id}-`) && name.endsWith('.md'));

    if (file.length !== 1) {
      throw new Error(`routing case ${id}: expected one prompt file, found ${String(file.length)}`);
    }

    const graders = [
      ...(owner === 'NONE' ? [] : [{ name: 'owner-fired', skill: owner, quiet: false }]),
      ...skills.filter((skill) => skill !== owner && skill !== secondHop).map((skill) => quietGrader(`quiet-${skill}`, skill)),
    ];
    const tags = ['routing', `owner-${owner.toLowerCase()}`, ...(secondHop === null ? [] : [`second-hop-${secondHop}`])];

    return {
      name: `routing-${id}`,
      tags,
      body: readFileSync(`${base}/e2e-rgr-routing/prompts/${file[0] ?? ''}`, 'utf8').replaceAll('\r\n', '\n'),
      graders,
    };
  });
}

function graderText(spec: GraderSpec): string {
  const lines = [
    '---',
    'type: tool_used',
    'tool: Skill',
    `input_match: '"skill"\\s*:\\s*"(?:[\\w-]+:)?${spec.skill}"'`,
    ...(spec.quiet ? ['min: 0', 'max: 0', 'arm: both'] : []),
    '---',
    '',
    spec.quiet ? `The ${spec.skill} skill stayed quiet.` : `The ${spec.skill} skill fired.`,
    '',
  ];

  return lines.join('\n');
}

// The run settings each case's frontmatter carries. Trigger cases get 10 turns, because at 3 a run in the empty run
// folder was cut off mid-search, and no Agent tool, which two runs called although allowed_tools leaves it out.
export const triggerSettings = ['max_turns: 10', 'allowed_tools: [Read, Glob, Grep, Skill]', 'disallowed_tools: [Agent]'] as const;
export const routingSettings = ['max_turns: 3', 'allowed_tools: [Read, Glob, Grep, Skill]'] as const;

function promptText(ported: PortedCase, settings: readonly string[]): string {
  return ['---', `tags: [${ported.tags.join(', ')}]`, ...settings, '---', '', ported.body].join('\n');
}

// Writes suite.json and every case, and removes this suite's case folders the generator no longer produces.
export function writeSuite(dir: string, suite: Record<string, unknown>, cases: readonly PortedCase[], settings: readonly string[]): void {
  const name = basename(dir);
  mkdirSync(dir, { recursive: true });
  writeFileSync(`${dir}/suite.json`, `${JSON.stringify(suite, null, 2)}\n`);
  const wanted = new Set(cases.map((ported) => ported.name));

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && entry.name.startsWith(`${name}-`) && !wanted.has(entry.name)) {
      rmSync(`${dir}/${entry.name}`, { recursive: true, force: true });
    }
  }

  for (const ported of cases) {
    const caseDir = `${dir}/${ported.name}`;
    rmSync(caseDir, { recursive: true, force: true });
    mkdirSync(`${caseDir}/graders`, { recursive: true });
    writeFileSync(`${caseDir}/prompt.md`, promptText(ported, settings));

    for (const spec of ported.graders) {
      writeFileSync(`${caseDir}/graders/${spec.name}.md`, graderText(spec));
    }
  }
}

// Stryker disable all: command-line entry; port-cases.test.ts calls the generators in-process
// Below Node.js 22.18.0 import.meta.main is undefined, which would skip the generator and exit 0.
if (typeof import.meta.main !== 'boolean') {
  throw new Error('port-cases.ts needs Node.js >= 22.18.0 (import.meta.main)');
}

if (import.meta.main) {
  const repo = evalRepo(process.env);
  const root = `${repo}/evals/lz-tdd`;

  if (!existsSync(`${repo}/.claude/skills`)) {
    throw new Error(`${repo} has no .claude/skills records to port`);
  }

  for (const skill of skills) {
    const cases = triggerCases(repo, skill);
    writeSuite(`${root}/trigger-${skill}`, { backend: 'plugin-eval', ablation: 'none', skill }, cases, triggerSettings);
    console.log(`trigger-${skill}: ${String(cases.length)} cases`);
  }

  const routing = routingCases(repo);
  writeSuite(`${root}/routing`, { backend: 'plugin-eval', ablation: 'none', skill: null }, routing, routingSettings);
  console.log(`routing: ${String(routing.length)} cases`);
}
// Stryker restore all
