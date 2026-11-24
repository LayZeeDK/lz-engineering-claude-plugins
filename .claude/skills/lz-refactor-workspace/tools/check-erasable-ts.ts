#!/usr/bin/env node
// Erasable-syntax guard over the shipped TypeScript examples: fails on any constructor parameter
// property (a constructor parameter that starts with public, private, protected, readonly or
// override) inside a ts or typescript fence in plugins/**/*.md. Parameter properties fail
// erasableSyntaxOnly and Node.js type stripping. Commented-out code is ignored.
//   node .claude/skills/lz-refactor-workspace/tools/check-erasable-ts.ts
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export interface Hit {
  line: number;
  text: string;
}

interface Block {
  firstLine: number;
  text: string;
}

const tsInfo = new Set(['ts', 'typescript']);
const modifier = /^(?:@[\w.$]+(?:\([^)]*\))?\s+)*(?:public|private|protected|readonly|override)\s+[\w$]/;

function tsBlocks(lines: string[]): Block[] {
  const blocks: Block[] = [];
  let open: { marker: string; isTs: boolean; firstLine: number; body: string[] } | undefined;

  for (const [index, line] of lines.entries()) {
    const fenceMatch = /^\s*(`{3,}|~{3,})(.*)$/.exec(line);

    if (open === undefined) {
      if (fenceMatch !== null) {
        const [, marker = '', rest = ''] = fenceMatch;
        const info = (/^\s*([\w+-]*)/.exec(rest)?.[1] ?? '').toLowerCase();
        open = { marker, isTs: tsInfo.has(info), firstLine: index + 2, body: [] };
      }

      continue;
    }

    const [, marker = '', rest = ''] = fenceMatch ?? [];
    const closes = fenceMatch !== null && marker[0] === open.marker[0] && marker.length >= open.marker.length && rest.trim() === '';

    if (closes) {
      if (open.isTs) {
        blocks.push({ firstLine: open.firstLine, text: open.body.join('\n') });
      }

      open = undefined;
    } else {
      open.body.push(line);
    }
  }

  return blocks;
}

// Blanks comments and string contents with spaces, keeping every newline and offset.
// shortcut: regex literals and template ${} expressions are read as plain code, fine for prose examples.
function blankCommentsAndStrings(code: string): string {
  let out = '';
  let index = 0;

  while (index < code.length) {
    const char = code[index] ?? '';
    const next = code[index + 1] ?? '';

    if (char === '/' && next === '/') {
      while (index < code.length && code[index] !== '\n') {
        out += ' ';
        index++;
      }
    } else if (char === '/' && next === '*') {
      const end = code.indexOf('*/', index + 2);
      const stop = end === -1 ? code.length : end + 2;
      out += code.slice(index, stop).replace(/[^\n]/g, ' ');
      index = stop;
    } else if (char === "'" || char === '"' || char === '`') {
      out += char;
      index++;

      while (index < code.length && code[index] !== char) {
        const current = code[index] ?? '';

        if (current === '\\') {
          out += '  ';
          index += 2;
          continue;
        }

        out += current === '\n' ? '\n' : ' ';
        index++;
      }

      if (index < code.length) {
        out += char;
        index++;
      }
    } else {
      out += char;
      index++;
    }
  }

  return out;
}

// Start offsets of the depth-0 parameters of the list that opens just before `start`.
function parameterStarts(code: string, start: number): number[] {
  const starts = [start];
  let depth = 0;

  for (let index = start; index < code.length; index++) {
    const char = code[index] ?? '';

    if (char === '(' || char === '[' || char === '{' || char === '<') {
      depth++;
    } else if (char === ')' && depth === 0) {
      break;
    } else if (char === ')' || char === ']' || char === '}') {
      depth = Math.max(0, depth - 1);
    } else if (char === '>' && code[index - 1] !== '=') {
      depth = Math.max(0, depth - 1);
    } else if (char === ',' && depth === 0) {
      starts.push(index + 1);
    }
  }

  return starts;
}

export function findParameterProperties(markdown: string): Hit[] {
  const lines = markdown.split(/\r?\n/);
  const hits: Hit[] = [];

  for (const block of tsBlocks(lines)) {
    const code = blankCommentsAndStrings(block.text);

    for (const match of code.matchAll(/\bconstructor\s*\(/g)) {
      for (const paramStart of parameterStarts(code, match.index + match[0].length)) {
        const leading = /^\s*/.exec(code.slice(paramStart))?.[0].length ?? 0;
        const tokenStart = paramStart + leading;

        if (!modifier.test(code.slice(tokenStart, tokenStart + 200))) {
          continue;
        }

        const line = block.firstLine + (code.slice(0, tokenStart).match(/\n/g)?.length ?? 0);
        hits.push({ line, text: lines[line - 1] ?? '' });
      }
    }
  }

  return hits;
}

if (import.meta.main) {
  const here = path.dirname(fileURLToPath(import.meta.url));
  // tools -> lz-refactor-workspace -> skills -> .claude -> repo root
  const repoRoot = path.resolve(here, '..', '..', '..', '..');
  const files = fs
    .readdirSync(path.join(repoRoot, 'plugins'), { recursive: true, encoding: 'utf8' })
    .map((file) => `plugins/${file.split(path.sep).join('/')}`)
    .filter((file) => file.endsWith('.md'))
    .sort();
  let count = 0;

  for (const file of files) {
    for (const hit of findParameterProperties(fs.readFileSync(path.join(repoRoot, file), 'utf8'))) {
      console.log(`${file}:${hit.line}: ${hit.text.trim()}`);
      count++;
    }
  }

  console.log(`check-erasable-ts: ${count} hit(s)`);
  process.exitCode = count > 0 ? 1 : 0;
}
