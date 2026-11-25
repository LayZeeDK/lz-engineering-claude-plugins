// Eval suites and cases: `evals/lz-tdd/<suite>/` (claude plugin eval) and `evals/lz-tdd-apply/<suite>/` (slim
// claude -p), each with a suite.json and one folder per case holding prompt.md. Repository-only; nothing here ships
// with the plugin.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { assertName, isRecord, isStringArray, readJson } from './guards.ts';

export type FrontmatterValue = string | number | boolean | string[];

export interface Frontmatter {
  readonly data: Record<string, FrontmatterValue>;
  readonly body: string;
}

function unquote(raw: string, line: string): string {
  if (raw.startsWith("'")) {
    if (!/^'(?:[^']|'')*'$/.test(raw)) {
      throw new Error(`frontmatter line ${JSON.stringify(line)} has an unclosed single quote`);
    }

    return raw.slice(1, -1).replaceAll("''", "'");
  }

  if (raw.startsWith('"')) {
    try {
      const parsed: unknown = JSON.parse(raw);

      if (typeof parsed === 'string') {
        return parsed;
      }
    } catch {
      // falls through to the error below
    }

    throw new Error(`frontmatter line ${JSON.stringify(line)} has a double-quoted value the harness cannot read`);
  }

  if (raw === '' || /^[[\]{}&*!|>%@`#,-]/.test(raw) || raw.includes(' #') || raw.includes(': ')) {
    throw new Error(`frontmatter line ${JSON.stringify(line)} is YAML the harness cannot read`);
  }

  return raw;
}

function scalar(raw: string, line: string): string | number | boolean {
  if (/^-?\d+$/.test(raw)) {
    return Number(raw);
  }

  if (raw === 'true' || raw === 'false') {
    return raw === 'true';
  }

  return unquote(raw, line);
}

function flowList(raw: string, line: string): string[] {
  const inner = raw.slice(1, -1).trim();

  if (inner === '') {
    return [];
  }

  return inner.split(',').map((item) => unquote(item.trim(), line));
}

// A case the harness cannot read fails loudly instead of running with a field silently dropped.
export function readFrontmatter(text: string): Frontmatter {
  const lines = text.replaceAll('\r\n', '\n').split('\n');

  if (lines[0] !== '---') {
    return { data: {}, body: text };
  }

  const end = lines.indexOf('---', 1);

  if (end === -1) {
    throw new Error('frontmatter has no closing --- line');
  }

  const data: Record<string, FrontmatterValue> = {};

  for (const line of lines.slice(1, end)) {
    if (line.trim() === '') {
      continue;
    }

    const match = /^([A-Za-z_][A-Za-z0-9_]*):(?: (.*))?$/.exec(line);

    if (match === null || match[1] === undefined) {
      throw new Error(`frontmatter line ${JSON.stringify(line)} is not a key: value line`);
    }

    const raw = (match[2] ?? '').trim();
    data[match[1]] = raw.startsWith('[') && raw.endsWith(']') ? flowList(raw, line) : scalar(raw, line);
  }

  return { data, body: lines.slice(end + 1).join('\n').replace(/^\n+/, '') };
}

export type Backend = 'plugin-eval' | 'slim';
export type Ablation = 'none' | 'with-without';

export interface Suite {
  readonly name: string;
  readonly dir: string;
  readonly backend: Backend;
  readonly ablation: Ablation;
  readonly allowTools: readonly string[];
  readonly scaffold: boolean;
  readonly heavy: boolean;
  readonly allow: string | null;
  readonly timeoutMinutes: number;
  readonly invokeTwin: string | null;
  readonly target: unknown;
}

const suiteKeys = new Set([
  'backend',
  'ablation',
  'allowTools',
  'scaffold',
  'heavy',
  'allow',
  'timeoutMinutes',
  'invokeTwin',
  'target',
]);

function suiteField(file: string, key: string, valid: boolean): void {
  if (!valid) {
    throw new Error(`${file}: ${key} has the wrong type or value`);
  }
}

export function readSuite(dir: string): Suite {
  const file = `${dir}/suite.json`;
  const value = readJson(file);

  if (!isRecord(value)) {
    throw new Error(`${file} is not a JSON object`);
  }

  const unknown = Object.keys(value).filter((key) => !suiteKeys.has(key));

  if (unknown.length > 0) {
    throw new Error(`${file}: unknown keys ${unknown.join(', ')}`);
  }

  const {
    backend,
    ablation = 'none',
    allowTools = [],
    scaffold = false,
    heavy = false,
    allow = null,
    timeoutMinutes = 15,
    invokeTwin = null,
    target = null,
  } = value;

  if (backend !== 'plugin-eval' && backend !== 'slim') {
    throw new Error(`${file}: backend must be plugin-eval or slim`);
  }

  if (ablation !== 'none' && ablation !== 'with-without') {
    throw new Error(`${file}: ablation must be none or with-without`);
  }

  if (!isStringArray(allowTools)) {
    throw new Error(`${file}: allowTools must be a list of tool names`);
  }

  suiteField(file, 'scaffold', typeof scaffold === 'boolean');
  suiteField(file, 'heavy', typeof heavy === 'boolean');
  suiteField(file, 'allow', allow === null || typeof allow === 'string');
  suiteField(file, 'timeoutMinutes', typeof timeoutMinutes === 'number' && timeoutMinutes > 0);
  suiteField(file, 'invokeTwin', invokeTwin === null || typeof invokeTwin === 'string');

  return {
    name: assertName('suite', basename(dir)),
    dir,
    backend,
    ablation,
    allowTools,
    scaffold: scaffold === true,
    heavy: heavy === true,
    allow: typeof allow === 'string' ? allow : null,
    timeoutMinutes: typeof timeoutMinutes === 'number' ? timeoutMinutes : 15,
    invokeTwin: typeof invokeTwin === 'string' ? invokeTwin : null,
    target,
  };
}

// LZ_EVAL_REPO lets a test point the harness at a temp repository; unset, it is this repository's root.
export function evalRepo(env: NodeJS.ProcessEnv): string {
  return resolve(env['LZ_EVAL_REPO'] ?? resolve(import.meta.dirname, '..', '..')).replaceAll('\\', '/');
}

export function evalsRoots(repo: string): string[] {
  return [`${repo}/evals/lz-tdd`, `${repo}/evals/lz-tdd-apply`];
}

export function findSuite(roots: readonly string[], name: string): Suite {
  const found = roots.map((root) => `${root}/${assertName('suite', name)}`).filter((dir) => existsSync(`${dir}/suite.json`));

  if (found.length !== 1) {
    throw new Error(`suite ${name}: expected one folder with a suite.json under ${roots.join(', ')}, found ${String(found.length)}`);
  }

  return readSuite(found[0] ?? '');
}

export interface CaseInfo {
  readonly name: string;
  readonly dir: string;
  readonly tags: readonly string[];
  readonly body: string;
}

export function listCases(suite: Suite): CaseInfo[] {
  return readdirSync(suite.dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && existsSync(`${suite.dir}/${entry.name}/prompt.md`))
    .map((entry) => entry.name)
    .sort()
    .map((name) => {
      if (!name.startsWith(`${suite.name}-`)) {
        throw new Error(`case ${name} in suite ${suite.name} must start with ${suite.name}-`);
      }

      const dir = `${suite.dir}/${assertName('case', name)}`;
      const file = `${dir}/prompt.md`;
      let frontmatter: Frontmatter;

      try {
        frontmatter = readFrontmatter(readFileSync(file, 'utf8'));
      } catch (error) {
        throw new Error(`${file}: ${error instanceof Error ? error.message : String(error)}`);
      }

      const { tags = [] } = frontmatter.data;

      if (!isStringArray(tags)) {
        throw new Error(`${file}: tags must be a list`);
      }

      return { name, dir, tags, body: frontmatter.body };
    });
}
