// Readers of what the Claude Code CLI itself wrote: the stream-json trace of a `claude plugin eval` run and the
// run-slim `--out` file. The model that ran, its cost and its tokens come from here, never from a field the harness
// or the eval command echoes back. Repository-only; nothing here ships with the plugin.
import { existsSync, readdirSync } from 'node:fs';
import { isRecord, jsonLines } from './guards.ts';
import type { Tokens } from './run-set.ts';

function entryOf(entries: readonly unknown[], type: string, subtype?: string): Record<string, unknown> | null {
  const found = entries.find(
    (entry) => isRecord(entry) && entry['type'] === type && (subtype === undefined || entry['subtype'] === subtype),
  );

  return isRecord(found) ? found : null;
}

function lastResult(entries: readonly unknown[]): Record<string, unknown> | null {
  const found = entries.filter((entry) => isRecord(entry) && entry['type'] === 'result').at(-1);

  return isRecord(found) ? found : null;
}

function numberAt(record: Record<string, unknown>, key: string): number {
  const value = record[key];

  return typeof value === 'number' ? value : 0;
}

export interface TraceModels {
  readonly init: string | null;
  readonly used: string[];
  readonly claudeCodeVersion: string | null;
}

// The init line's model and every modelUsage key of the last result line.
export function traceModels(entries: readonly unknown[]): TraceModels {
  const init = entryOf(entries, 'system', 'init');
  const usage = lastResult(entries)?.['modelUsage'];

  return {
    init: typeof init?.['model'] === 'string' ? init['model'] : null,
    used: isRecord(usage) ? Object.keys(usage) : [],
    claudeCodeVersion: typeof init?.['claude_code_version'] === 'string' ? init['claude_code_version'] : null,
  };
}

export function usageTokens(usage: unknown): Tokens {
  const perModel = isRecord(usage) ? Object.values(usage).filter(isRecord) : [];
  const sum = (key: string): number => perModel.reduce((total, model) => total + numberAt(model, key), 0);

  return {
    input: sum('inputTokens'),
    output: sum('outputTokens'),
    cacheRead: sum('cacheReadInputTokens'),
    cacheCreation: sum('cacheCreationInputTokens'),
  };
}

export interface TraceResult {
  readonly sessionId: string | null;
  readonly costUsd: number;
  readonly turns: number;
  readonly isError: boolean;
  readonly resultText: string | null;
  readonly tokens: Tokens;
}

export function resultFacts(result: Record<string, unknown>): TraceResult {
  return {
    sessionId: typeof result['session_id'] === 'string' ? result['session_id'] : null,
    costUsd: numberAt(result, 'total_cost_usd'),
    turns: numberAt(result, 'num_turns'),
    isError: result['is_error'] === true,
    resultText: typeof result['result'] === 'string' ? result['result'] : null,
    tokens: usageTokens(result['modelUsage']),
  };
}

// The last result line, or null when the session printed none (it was killed or crashed).
export function traceResult(entries: readonly unknown[]): TraceResult | null {
  const result = lastResult(entries);

  return result === null ? null : resultFacts(result);
}

// A usage limit ends a session at once with status 0 and is_error false; only its result text says so.
// The apostrophe is straight or curly (U+2019); a result object naming a rate limit in an error type also counts.
export function limitStopped(text: string | null, result?: unknown): boolean {
  return (text !== null && /^You['’]ve hit your .*limit/i.test(text)) || namesRateLimit(result);
}

function namesRateLimit(result: unknown): boolean {
  if (!isRecord(result)) {
    return false;
  }

  const error = result['error'];
  const kinds = [result['type'], result['subtype'], result['error_type'], error, isRecord(error) ? error['type'] : undefined];

  return kinds.some((kind) => typeof kind === 'string' && /rate[_ -]?limit/i.test(kind));
}

export interface SlimOutput {
  readonly cwd: string | null;
  readonly status: number | null;
  readonly ms: number;
  // The session's last result object, or an empty record when the session printed none (it timed out or crashed).
  readonly result: Readonly<Record<string, unknown>>;
  readonly session: string | null;
}

// The run-slim `--out` file: {cwd, args, prompt, status, ms, stdout, stderr}, stdout being the session's
// `--output-format json` result object.
export function slimOutput(raw: unknown): SlimOutput {
  const output = isRecord(raw) ? raw : {};
  const { cwd, status, ms, stdout } = output;
  const entries = jsonLines(typeof stdout === 'string' ? stdout : '');
  const result = lastResult(entries);
  const sessions = entries.flatMap((entry) =>
    isRecord(entry) && typeof entry['session_id'] === 'string' ? [entry['session_id']] : [],
  );

  return {
    cwd: typeof cwd === 'string' ? cwd : null,
    status: typeof status === 'number' ? status : null,
    ms: typeof ms === 'number' ? ms : 0,
    result: result ?? {},
    session: sessions.at(-1) ?? null,
  };
}

// A slim run's --out files in order: result.json, then result-resume-1.json, -2 and so on.
export function outFiles(rawDir: string): string[] {
  const resumes = existsSync(rawDir)
    ? readdirSync(rawDir).flatMap((name) => /^result-resume-(\d+)\.json$/.exec(name)?.[1] ?? []).map(Number)
    : [];

  return [
    `${rawDir}/result.json`,
    ...resumes.sort((a, b) => a - b).map((number) => `${rawDir}/result-resume-${String(number)}.json`),
  ].filter((file) => existsSync(file));
}

export interface ToolCall {
  readonly id: string;
  readonly name: string;
  readonly input: unknown;
  readonly isError: boolean;
  readonly denied: boolean;
}

interface Block {
  readonly block: Readonly<Record<string, unknown>>;
  readonly entry: Readonly<Record<string, unknown>>;
}

// The conversation's own entries; others, such as an api-request-blob, repeat its messages.
const conversation = new Set<unknown>(['assistant', 'user']);

function blocks(entries: readonly unknown[]): Block[] {
  return entries.flatMap((entry) => {
    const message = isRecord(entry) ? entry['message'] : undefined;
    const content = isRecord(message) ? message['content'] : undefined;

    return isRecord(entry) && conversation.has(entry['type']) && Array.isArray(content)
      ? content.filter(isRecord).map((block) => ({ block, entry }))
      : [];
  });
}

export function toolCalls(entries: readonly unknown[]): ToolCall[] {
  const all = blocks(entries);
  const results = new Map(
    all.filter(({ block }) => block['type'] === 'tool_result').map((found) => [found.block['tool_use_id'], found]),
  );

  return all
    .filter(({ block }) => block['type'] === 'tool_use')
    .map(({ block }) => {
      const found = results.get(block['id']);
      const decision = found?.entry['permissionDecision'];

      return {
        id: String(block['id']),
        name: String(block['name']),
        input: block['input'],
        isError: found?.block['is_error'] === true,
        denied: isRecord(decision) && decision['decision'] === 'reject',
      };
    });
}

// The requested alias or its dated id (`<model>-20251001`) names the same model.
export function namesModel(requested: string, model: string): boolean {
  return model === requested || new RegExp(`^${requested.replaceAll('.', '\\.')}-\\d{8}$`).test(model);
}

// Null when the session ran on the requested model. Other modelUsage keys are allowed only as the CLI's own side calls
// (Haiku family); any other model, such as a silent fallback to an older Opus, refuses the run.
export function modelRefusal(requested: string, init: string | null, used: readonly string[]): string | null {
  if (init === null) {
    return `the CLI output names no model; ${requested} was requested`;
  }

  if (!namesModel(requested, init)) {
    return `model mismatch: ${init} ran where ${requested} was requested`;
  }

  if (!used.includes(init)) {
    return `model mismatch: modelUsage (${used.join(', ') || 'empty'}) does not name ${init}`;
  }

  const extra = used.find((model) => !namesModel(requested, model) && !/^claude-haiku-/.test(model));

  return extra === undefined ? null : `model mismatch: ${extra} also ran beside ${requested}`;
}
