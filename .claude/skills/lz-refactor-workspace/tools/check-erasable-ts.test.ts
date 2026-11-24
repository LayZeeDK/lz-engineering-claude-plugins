import assert from 'node:assert/strict';
import { test } from 'node:test';

import { findParameterProperties } from './check-erasable-ts.ts';

function fence(info: string, body: string): string {
  return ['# Leaf', '', '```' + info, body, '```', ''].join('\n');
}

function hitLines(markdown: string): number[] {
  return findParameterProperties(markdown).map((hit) => hit.line);
}

test('reports a single-line parameter property in a ts fence', () => {
  const markdown = fence('ts', 'class A {\n  constructor(private readonly n: Notifier) {}\n}');

  assert.deepEqual(hitLines(markdown), [5]);
});

test('reports a multi-line parameter list with a modifier on its own line', () => {
  const markdown = fence(
    'typescript',
    'class P {\n  constructor(\n    public x: number,\n    y: number,\n  ) {}\n}',
  );

  assert.deepEqual(hitLines(markdown), [6]);
});

test('reports the line text of each hit', () => {
  const markdown = fence('ts', 'class A {\n  constructor(private readonly n: Notifier) {}\n}');

  assert.equal(findParameterProperties(markdown)[0]?.text, '  constructor(private readonly n: Notifier) {}');
});

test('ignores plain fields and interface members', () => {
  const markdown = fence(
    'ts',
    'interface I {\n  readonly a: number;\n}\nclass A {\n  private readonly sent: string[] = [];\n  constructor(n: Notifier) {}\n}',
  );

  assert.deepEqual(hitLines(markdown), []);
});

test('ignores the same text in a non-ts fence or outside fences', () => {
  const code = 'constructor(private readonly n: Notifier) {}';
  const markdown = [code, fence('java', code), fence('text', code), fence('', code)].join('\n');

  assert.deepEqual(hitLines(markdown), []);
});

test('accepts TS and typescript info strings case-insensitively with trailing attributes', () => {
  const code = 'constructor(private n: Notifier) {}';

  assert.deepEqual(hitLines(fence('TS title="a.ts"', code)), [4]);
  assert.deepEqual(hitLines(fence('TypeScript', code)), [4]);
});

test('reports default and optional parameters with modifiers', () => {
  const markdown = fence('ts', 'class A {\n  constructor(private x = 1, readonly y?: T) {}\n}');

  assert.deepEqual(hitLines(markdown), [5, 5]);
});

test('reports override and public modifiers', () => {
  const markdown = fence('ts', 'class B extends A {\n  constructor(override x: T, public y: U) {\n    super(x);\n  }\n}');

  assert.deepEqual(hitLines(markdown), [5, 5]);
});

test('ignores a readonly member of an object-type parameter', () => {
  const markdown = fence('ts', 'class A {\n  constructor(opts: { readonly a: number, readonly b: number }) {}\n}');

  assert.deepEqual(hitLines(markdown), []);
});

test('ignores commented-out constructors', () => {
  const markdown = fence(
    'ts',
    '// constructor(private x: T) {}\n/*\n  constructor(private y: T) {}\n*/\n/* constructor(public z: T) {} */',
  );

  assert.deepEqual(hitLines(markdown), []);
});

test('keeps line numbers after a block comment', () => {
  const markdown = fence('ts', '/*\n a\n b\n*/\nclass A {\n  constructor(private x: T) {}\n}');

  assert.deepEqual(hitLines(markdown), [9]);
});

test('does not treat // inside a string literal as a comment', () => {
  const markdown = fence('ts', "class A {\n  constructor(url = 'http://x', private y: T) {}\n}");

  assert.deepEqual(hitLines(markdown), [5]);
});

test('reports a constructor with whitespace before the paren', () => {
  const markdown = fence('ts', 'class A {\n  constructor (private x: T) {}\n}');

  assert.deepEqual(hitLines(markdown), [5]);
});

test('does not read the > of an arrow or >= as a closing angle bracket', () => {
  const arrow = fence('ts', 'class A {\n  constructor(clock = () => 0, private x: T) {}\n}');
  const compare = fence('ts', 'class A {\n  constructor(ok = 1 >= 0, private x: T) {}\n}');

  assert.deepEqual(hitLines(arrow), [5]);
  assert.deepEqual(hitLines(compare), [5]);
});

test('keeps an arrow type inside a generic at depth 1', () => {
  const markdown = fence('ts', 'class A {\n  constructor(m: Map<() => void, readonly string[]>) {}\n}');

  assert.deepEqual(hitLines(markdown), []);
});

test('splits generic parameter types only at depth 0', () => {
  const markdown = fence('ts', 'class A {\n  constructor(m: Map<string, number>, private x: T) {}\n}');

  assert.deepEqual(hitLines(markdown), [5]);
});

test('reports a parameter property after a decorator', () => {
  const markdown = fence('ts', 'class A {\n  constructor(@Inject(TOKEN) private x: T) {}\n}');

  assert.deepEqual(hitLines(markdown), [5]);
});
