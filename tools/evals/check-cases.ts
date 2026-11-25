// Case lint (EVH-12, D-14, D-15), the last step of `npm run check`: every suite and case under evals/lz-tdd and
// evals/lz-tdd-apply reads the way the harness and the `claude plugin eval` loader read it, every grader definition
// has a fixture showing it can pass and can fail, every invoke twin matches its natural case, and every file under
// evals/ that git would commit is ASCII, names no email address but the public contact, and no absolute path outside
// D:/tmp/. Repository-only; nothing here ships with the plugin.
//
//   node tools/evals/check-cases.ts      prints one line per problem and exits 1, or the OK line and exits 0
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { evalRepo, evalsRoots, readCaseYaml, readFrontmatter, readSuite, type Suite } from './cases.ts';
import { gradeRun, readGraders, type Evidence, type GraderDef } from './grade.ts';
import { isRecord, readJson } from './guards.ts';
import { git } from './stage.ts';

// The prompt.md frontmatter keys the `claude plugin eval` loader accepts (measured 2026-11-25; an unknown key fails at
// load time). The harness passes model and runs per run (D-02, D-10), so a case may not set them.
const loaderKeys = [
  'schema_version',
  'name',
  'description',
  'tags',
  'plugins',
  'runs',
  'expected_outcome',
  'model',
  'max_turns',
  'timeout_seconds',
  'allowed_tools',
  'disallowed_tools',
  'artifact_publish',
  'growthbook_overrides',
  'append_system_prompt',
  'env',
];
const caseKeys = new Set(loaderKeys.filter((key) => key !== 'model' && key !== 'runs'));

const publicContact = 'larsbrinknielsen@gmail.com';
const emailShaped = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+[.][A-Za-z]{2,}/g;
const drivePath = /(?<![A-Za-z0-9])[A-Za-z]:[\\/][^\s"'`)]*/g;
const rootedPath = /(?<![\w.~:\\-])\/(?:home|Users|root|mnt|tmp|[A-Za-z])\//;

// The stable form of a grader definition: every field but the name, keys sorted.
export function graderKey(def: GraderDef): string {
  const fields = Object.entries(def)
    .filter(([key]) => key !== 'name')
    .sort(([a], [b]) => (a < b ? -1 : 1));

  return JSON.stringify(Object.fromEntries(fields));
}

export interface LintReport {
  readonly problems: readonly string[];
  readonly suites: number;
  readonly cases: number;
  readonly graders: number;
  readonly fixtures: number;
}

interface LintCase {
  readonly suite: Suite;
  readonly name: string;
  readonly path: string;
  readonly body: string;
  readonly graders: readonly GraderDef[];
}

function message(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

// A path relative to the repository, with forward slashes, for problem lines.
function shown(repo: string, path: string): string {
  const normal = path.replaceAll('\\', '/');

  return normal.startsWith(`${repo}/`) ? normal.slice(repo.length + 1) : normal;
}

function subfolders(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

function checkFiles(repo: string, problems: string[]): void {
  const listed = git(repo, ['ls-files', '-z', '--cached', '--others', '--exclude-standard', '--', 'evals'])
    .split('\0')
    .filter((file) => file !== '' && existsSync(`${repo}/${file}`));

  for (const file of listed.sort()) {
    // latin1 maps each byte to one character, so a byte above 0x7f shows as one.
    readFileSync(`${repo}/${file}`)
      .toString('latin1')
      .split('\n')
      .forEach((line, index) => {
        const where = `${file}:${String(index + 1)}`;

        if (/[^\x00-\x7f]/.test(line)) {
          problems.push(`${where}: non-ASCII byte`);
        }

        if ([...line.matchAll(emailShaped)].some(([token]) => token !== publicContact)) {
          problems.push(`${where}: an email-shaped token other than the public contact`);
        }

        const outside = [...line.matchAll(drivePath)].some(
          ([path]) => !/^d:\/tmp\//i.test(path.replace(/[\\/]+/g, '/')),
        );

        if (outside || rootedPath.test(line)) {
          problems.push(`${where}: absolute path outside D:/tmp/`);
        }
      });
  }
}

function readCase(repo: string, suite: Suite, name: string, problems: string[]): LintCase | null {
  const path = `${suite.dir}/${name}`;
  const where = shown(repo, path);

  if (!name.startsWith(`${suite.name}-`) || !/^[a-z0-9][a-z0-9-]*$/.test(name)) {
    problems.push(`${where}: case ${name} must start with ${suite.name}- and use only a-z, 0-9 and -`);
  }

  if (!existsSync(`${path}/prompt.md`)) {
    problems.push(`${where}: case folder has no prompt.md`);

    return null;
  }

  let body = '';

  try {
    const { data, body: text } = readFrontmatter(readFileSync(`${path}/prompt.md`, 'utf8'));
    body = text;

    for (const key of Object.keys(data).filter((key) => !caseKeys.has(key))) {
      problems.push(`${where}/prompt.md: frontmatter key ${key} is not one the harness lets a case set`);
    }

    const { tags = [] } = data;

    if (!Array.isArray(tags)) {
      problems.push(`${where}/prompt.md: tags must be a list`);
    }
  } catch (error) {
    problems.push(`${where}/prompt.md: ${message(error)}`);
  }

  if (existsSync(`${path}/case.yaml`)) {
    try {
      const script = readCaseYaml(readFileSync(`${path}/case.yaml`, 'utf8')).scaffoldScript;

      if (script !== null && (!/^[A-Za-z0-9._-]+$/.test(script) || !existsSync(`${path}/${script}`))) {
        problems.push(`${where}: scaffold_script ${script} is missing from the case folder`);
      }
    } catch (error) {
      problems.push(`${where}/case.yaml: ${message(error)}`);
    }
  }

  let graders: GraderDef[] = [];

  try {
    graders = readGraders(path);
  } catch (error) {
    problems.push(shown(repo, message(error)));
  }

  return { suite, name, path, body, graders };
}

function templateNames(repo: string): Set<string> {
  const file = `${repo}/evals/lz-tdd-apply/templates.json`;
  const value = existsSync(file) ? readJson(file) : {};

  return new Set(isRecord(value) ? Object.keys(value) : []);
}

function readSuites(repo: string, problems: string[]): Suite[] {
  const templates = templateNames(repo);
  const suites: Suite[] = [];

  for (const root of evalsRoots(repo).filter((dir) => existsSync(dir))) {
    for (const name of subfolders(root).filter((folder) => existsSync(`${root}/${folder}/suite.json`))) {
      try {
        const suite = readSuite(`${root}/${name}`);

        if (suite.backend === 'slim' && (suite.target === null || !templates.has(suite.target))) {
          problems.push(`${shown(repo, suite.dir)}: target ${String(suite.target)} is not in templates.json`);
        }

        suites.push(suite);
      } catch (error) {
        problems.push(shown(repo, message(error)));
      }
    }
  }

  return suites;
}

// Whether a tool_used Skill grader's input_match accepts a call of the skill, plain or plugin-qualified; fired and
// quiet graders both count, since an explicit invoke decides them.
function namesSkill(def: GraderDef, skill: string): boolean {
  if (def.type !== 'tool_used' || def.tool !== 'Skill' || def.inputMatch === null) {
    return false;
  }

  const match = new RegExp(def.inputMatch);

  return match.test(JSON.stringify({ skill })) || match.test(JSON.stringify({ skill: `lz-tdd:${skill}` }));
}

function graderSet(defs: readonly GraderDef[]): string {
  return defs
    .map((def) => `${def.name} ${graderKey(def)}`)
    .sort()
    .join('\n');
}

function checkTwins(repo: string, suites: readonly Suite[], cases: readonly LintCase[], problems: string[]): void {
  for (const suite of suites.filter((candidate) => candidate.invokeTwin !== null)) {
    const twin = suites.find((candidate) => candidate.name === suite.invokeTwin);
    const where = shown(repo, suite.dir);

    if (twin === undefined || suite.skill === null || twin.skill !== suite.skill) {
      problems.push(`${where}: invokeTwin ${String(suite.invokeTwin)} must be a suite with the same skill, and skill must be set`);
      continue;
    }

    const skill = suite.skill;
    const naturals = cases.filter((lintCase) => lintCase.suite === suite);
    const twins = cases.filter((lintCase) => lintCase.suite === twin);
    const twinNameOf = (natural: LintCase): string => `${twin.name}-${natural.name.slice(suite.name.length + 1)}`;

    for (const natural of naturals) {
      const twinName = twinNameOf(natural);
      const match = twins.find((lintCase) => lintCase.name === twinName);

      if (match === undefined) {
        problems.push(`${shown(repo, natural.path)}: ${natural.name} has no twin ${twinName} in ${twin.name}`);
        continue;
      }

      if (match.body !== `/lz-tdd:${skill} ${natural.body}`) {
        problems.push(`${shown(repo, match.path)}: prompt must be "/lz-tdd:${skill} " followed by the ${natural.name} prompt`);
      }

      if (graderSet(match.graders) !== graderSet(natural.graders.filter((def) => !namesSkill(def, skill)))) {
        problems.push(
          `${shown(repo, match.path)}: graders must be the ${natural.name} graders minus its ${skill} Skill graders`,
        );
      }
    }

    const twinNames = new Set(naturals.map(twinNameOf));

    for (const extra of twins.filter((lintCase) => !twinNames.has(lintCase.name))) {
      problems.push(`${shown(repo, extra.path)}: twin case has no natural case in ${suite.name}`);
    }
  }
}

const fixtureFields = new Set(['type', 'pattern', 'flags', 'tool', 'inputMatch', 'min', 'max', 'arm']);

// A fixture's grader is a GraderDef without its name; fields left out take readGrader's defaults.
function fixtureGrader(value: unknown): GraderDef {
  if (!isRecord(value)) {
    throw new Error('grader is not a JSON object');
  }

  const unknown = Object.keys(value).filter((key) => !fixtureFields.has(key));

  if (unknown.length > 0) {
    throw new Error(`unknown grader fields ${unknown.join(', ')}`);
  }

  const { type, pattern = null, flags = '', tool = null, inputMatch = null, min = 1, max = null, arm = null } = value;
  const text = (field: unknown): field is string | null => field === null || typeof field === 'string';
  const whole = (field: unknown): field is number => typeof field === 'number' && Number.isInteger(field) && field >= 0;

  if (
    (type !== 'regex' && type !== 'tool_used') ||
    !text(pattern) ||
    typeof flags !== 'string' ||
    !text(tool) ||
    !text(inputMatch) ||
    !whole(min) ||
    !(max === null || whole(max)) ||
    !text(arm)
  ) {
    throw new Error('grader fields have the wrong type');
  }

  return { name: 'fixture', type, pattern, flags, tool, inputMatch, min, max, arm };
}

function fixtureEvidence(value: unknown, what: string): Evidence {
  if (!isRecord(value) || !Array.isArray(value['toolCalls']) || typeof value['lastMessage'] !== 'string') {
    throw new Error(`${what} evidence must be {"toolCalls": [...], "lastMessage": "..."}`);
  }

  const calls = value['toolCalls'].map((call: unknown, index) => {
    if (!isRecord(call) || typeof call['name'] !== 'string') {
      throw new Error(`${what} evidence tool call ${String(index)} has no name`);
    }

    return { id: `fixture-${String(index)}`, name: call['name'], input: call['input'] ?? null, isError: false, denied: false };
  });

  return { calls, lastMessage: value['lastMessage'] };
}

// Grades each fixture's pass and fail evidence and gives back the grader keys the fixtures cover.
function checkFixtures(repo: string, problems: string[]): Set<string> {
  const dir = `${repo}/evals/fixtures/graders`;
  const covered = new Set<string>();
  const files = existsSync(dir) ? readdirSync(dir).filter((name) => name.endsWith('.json')).sort() : [];

  for (const name of files) {
    const where = `evals/fixtures/graders/${name}`;

    try {
      const value = readJson(`${dir}/${name}`);

      if (!isRecord(value)) {
        throw new Error('not a JSON object');
      }

      const def = fixtureGrader(value['grader']);
      const key = graderKey(def);

      if (covered.has(key)) {
        problems.push(`${where}: a second fixture for one grader definition`);
      }

      covered.add(key);
      const [pass] = gradeRun([def], fixtureEvidence(value['pass'], 'pass'));
      const [fail] = gradeRun([def], fixtureEvidence(value['fail'], 'fail'));

      if (pass?.passed !== true) {
        problems.push(`${where}: the pass evidence fails the grader`);
      }

      if (fail?.passed !== false) {
        problems.push(`${where}: the fail evidence passes the grader`);
      }
    } catch (error) {
      problems.push(`${where}: ${message(error)}`);
    }
  }

  return covered;
}

export function lintCases(repo: string): LintReport {
  const problems: string[] = [];
  const suites = readSuites(repo, problems);
  const cases: LintCase[] = [];
  const owners = new Map<string, string>();

  for (const suite of suites) {
    for (const name of subfolders(suite.dir)) {
      const lintCase = readCase(repo, suite, name, problems);

      if (lintCase === null) {
        continue;
      }

      const owner = owners.get(name);

      if (owner !== undefined) {
        problems.push(`${shown(repo, lintCase.path)}: case ${name} is in two suites (${owner}, ${suite.name})`);
      }

      owners.set(name, suite.name);
      cases.push(lintCase);
    }
  }

  checkTwins(repo, suites, cases, problems);
  const covered = checkFixtures(repo, problems);
  const used = new Map<string, string>();

  for (const lintCase of cases) {
    for (const def of lintCase.graders) {
      const key = graderKey(def);

      if (!used.has(key)) {
        used.set(key, `${shown(repo, lintCase.path)}/graders/${def.name}.md`);
      }
    }
  }

  for (const [key, where] of used) {
    if (!covered.has(key)) {
      problems.push(`${where}: grader ${where.slice(where.lastIndexOf('/') + 1, -3)} has no fixture in evals/fixtures/graders: ${key}`);
    }
  }

  checkFiles(repo, problems);
  const fixtures = existsSync(`${repo}/evals/fixtures/graders`)
    ? readdirSync(`${repo}/evals/fixtures/graders`).filter((name) => name.endsWith('.json')).length
    : 0;

  return { problems, suites: suites.length, cases: cases.length, graders: used.size, fixtures };
}

// Stryker disable all: command-line entry; check-cases.test.ts calls lintCases in-process
// Below Node.js 22.18.0 import.meta.main is undefined, which would skip the lint and exit 0.
if (typeof import.meta.main !== 'boolean') {
  throw new Error('check-cases.ts needs Node.js >= 22.18.0 (import.meta.main)');
}

if (import.meta.main) {
  const report = lintCases(evalRepo(process.env));

  if (report.problems.length > 0) {
    for (const problem of report.problems) {
      console.log(problem);
    }

    process.exitCode = 1;
  } else {
    console.log(
      `check-cases: OK - ${String(report.suites)} suites, ${String(report.cases)} cases, ${String(report.graders)} grader definitions, ${String(report.fixtures)} fixtures`,
    );
  }
}
// Stryker restore all
