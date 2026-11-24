#!/usr/bin/env node
// Script-bar guard over the eval workspaces: fails on any tracked or untracked-not-ignored .mjs,
// .cjs or .js file under .claude/skills/*-workspace/ (node_modules excepted) that grandfathered-js.txt
// does not list, and on any listed file that is gone, so a ported script cannot come back as
// JavaScript. .mts and .cts are TypeScript and pass.
//   node .claude/skills/lz-refactor-workspace/tools/check-no-new-js.ts
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const workspaceScript = /^\.claude\/skills\/[^/]+-workspace\/.*\.[cm]?js$/i;

function isWorkspaceScript(path: string): boolean {
  return workspaceScript.test(path) && !path.split('/').includes('node_modules');
}

export function findScriptViolations(
  listed: readonly string[],
  grandfathered: readonly string[],
): { added: string[]; stale: string[] } {
  const scripts = new Set(listed.filter(isWorkspaceScript));
  const allowed = new Set(grandfathered);

  return {
    added: [...scripts].filter((path) => !allowed.has(path)).sort(),
    stale: [...allowed].filter((path) => !scripts.has(path)).sort(),
  };
}

export function parseGrandfatherList(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line !== '' && !line.startsWith('#'));
}

// A git failure throws, so the guard exits non-zero instead of passing on an empty listing.
export function listWorkspaceFiles(repoRoot: string): string[] {
  const output = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z', '--', '.claude/skills'], {
    cwd: repoRoot,
    encoding: 'utf8',
  });

  return output.split('\0').filter((path) => path !== '');
}

// Below Node.js 22.18.0 import.meta.main is undefined, which would skip the check and exit 0.
if (typeof import.meta.main !== 'boolean') {
  throw new Error('check-no-new-js needs Node.js >= 22.18.0 (import.meta.main)');
}

if (import.meta.main) {
  const here = dirname(fileURLToPath(import.meta.url));
  // tools -> lz-refactor-workspace -> skills -> .claude -> repo root
  const repoRoot = resolve(here, '..', '..', '..', '..');
  const grandfathered = parseGrandfatherList(readFileSync(join(here, 'grandfathered-js.txt'), 'utf8'));
  const { added, stale } = findScriptViolations(listWorkspaceFiles(repoRoot), grandfathered);

  for (const path of added) {
    console.log(`new script, port it to erasable .ts: ${path}`);
  }

  for (const path of stale) {
    console.log(`grandfathered file is gone, remove its line: ${path}`);
  }

  console.log(`check-no-new-js: ${added.length} new, ${stale.length} stale`);
  process.exitCode = added.length > 0 || stale.length > 0 ? 1 : 0;
}
