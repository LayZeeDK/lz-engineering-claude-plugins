// Mutation testing for the eval harness. Repository-only; nothing here ships with the plugin.
//
// Only lz-node-test's node:test runner is supported, loaded from its source entry in an lz-node-test checkout at a
// pinned commit; the config adds that checkout's Node.js mutators and numeric-literal mutator to Stryker's own. The
// mutation gate installs Stryker temporarily and runs, from tools/evals:
//   LZ_NODE_TEST_RUNNER=<checkout>/packages/stryker-node-test-runner/src/index.ts \
//     node <stryker install>/node_modules/@stryker-mutator/core/bin/stryker.js run stryker.config.ts
// Without LZ_NODE_TEST_RUNNER the config refuses to load: there is no fallback to Stryker's command runner.
import { readFileSync } from 'node:fs';
import { availableParallelism, freemem } from 'node:os';
import { pathToFileURL } from 'node:url';

const { LZ_NODE_TEST_RUNNER: runner } = process.env;

if (runner === undefined || runner === '') {
  throw new Error('set LZ_NODE_TEST_RUNNER to the lz-node-test runner entry (pinned checkout)');
}

// Stryker runs the tests from a copy below .stryker-tmp/, where "two folders up" is not the repository; the tests that
// read the real tree take the repository from this variable.
process.env['LZ_EVAL_REPO'] ??= new URL('../../', import.meta.url).pathname.replace(/^\/(?=[A-Za-z]:)/, '').replace(/\/$/, '');

async function callExport(module: URL, name: string, ...args: unknown[]): Promise<void> {
  const exports: unknown = await import(module.href);
  const exported: unknown = typeof exports === 'object' && exports !== null ? Reflect.get(exports, name) : undefined;

  if (typeof exported !== 'function') {
    throw new TypeError(`${module.href} exports no function named ${name}.`);
  }

  const result: unknown = Reflect.apply(exported, undefined, args);

  await result;
}

const packages = new URL('../../', pathToFileURL(runner));
await callExport(new URL('stryker-node-mutators/src/index.ts', packages), 'lzNodeMutators');
await callExport(new URL('stryker-js-mutators/src/index.ts', packages), 'lzJsMutators', { LzJsNumericLiteral: true });

// The test files are the ones `npm run check` runs, read from its script so the two lists cannot drift.
const check: unknown = Reflect.get(Reflect.get(JSON.parse(readFileSync(new URL('package.json', import.meta.url), 'utf8')), 'scripts') ?? {}, 'check');
const testFiles = typeof check === 'string' ? (check.match(/\S+\.test\.ts/g) ?? []) : [];

if (testFiles.length === 0) {
  throw new Error('package.json scripts.check names no *.test.ts file');
}

// One checker or test runner process takes about 0.3 GB (lz-oop's measurement), and 4 GB stays free for the
// machine's other sessions.
const gbPerUnit = 0.3;
const reservedGb = 4;

export default {
  testRunner: 'lz-node-test',
  appendPlugins: [runner],
  coverageAnalysis: 'perTest',
  lzNodeTest: { testFiles },
  checkers: ['typescript'],
  tsconfigFile: 'tsconfig.json',
  reporters: ['clear-text', 'progress', 'html'],
  mutate: ['*.ts', '!*.test.ts', '!stubs.ts', '!stryker.config.ts'],
  thresholds: { high: 100, low: 90, break: null },
  ignorePatterns: ['/node_modules', '/reports'],
  incrementalFile: 'reports/stryker-incremental.json',
  concurrency: Math.max(2, Math.min(availableParallelism() - 1, Math.floor((freemem() / 2 ** 30 - reservedGb) / gbPerUnit))),
};
