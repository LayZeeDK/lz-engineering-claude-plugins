// Readers of what the Claude Code CLI itself wrote: the stream-json trace of a `claude plugin eval` run. The model
// that ran, its cost and its tokens come from here, never from a field the harness or the eval command echoes back.
// Repository-only; nothing here ships with the plugin.
import { isRecord } from './guards.ts';
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

// The requested alias or its dated id (`<model>-20251001`) names the same model.
export function namesModel(requested: string, model: string): boolean {
  return model === requested || new RegExp(`^${requested.replaceAll('.', '\\.')}-\\d{8}$`).test(model);
}

// Null when the session ran on the requested model. Other modelUsage keys are the CLI's own side calls (Haiku), which
// are allowed.
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

  return null;
}
