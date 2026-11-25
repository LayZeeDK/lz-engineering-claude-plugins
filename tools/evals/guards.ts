// Narrowing and parsing of the untrusted JSON and names the eval harness reads. Repository-only; nothing here ships
// with the plugin.
import { readFileSync } from 'node:fs';

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function requireRecord(value: unknown, what: string): Record<string, unknown> {
  if (!isRecord(value)) {
    throw new Error(`${what} is not a JSON object`);
  }

  return value;
}

export function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

const namePattern = /^[a-z0-9][a-z0-9-]*$/;

// Names become folder names under a run set, so nothing that could leave it (`..`, a slash, a drive) gets through.
export function assertName(kind: string, value: string): string {
  if (!namePattern.test(value)) {
    throw new Error(`${kind} name ${JSON.stringify(value)} must match ${String(namePattern)}`);
  }

  return value;
}

export function readJson(path: string): unknown {
  const text = readFileSync(path, 'utf8');

  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`${path} is not valid JSON: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export function jsonLines(text: string): unknown[] {
  return text.split('\n').flatMap((line): unknown[] => {
    try {
      return [JSON.parse(line)];
    } catch {
      return [];
    }
  });
}
