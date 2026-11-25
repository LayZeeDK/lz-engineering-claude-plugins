import assert from 'node:assert/strict';
import { test } from 'node:test';

import { limitStopped, modelRefusal, slimOutput, toolCalls, traceModels, traceResult } from './trace.ts';

const usage = {
  'claude-sonnet-5-5': { inputTokens: 10, outputTokens: 20, cacheReadInputTokens: 30, cacheCreationInputTokens: 40 },
  'claude-haiku-4-5-20251001': { inputTokens: 1, outputTokens: 2, cacheReadInputTokens: 3, cacheCreationInputTokens: 4 },
};
const trace = [
  { type: 'system', subtype: 'init', session_id: 's-1', model: 'claude-sonnet-5-5', claude_code_version: '2.1.327' },
  { type: 'assistant', message: { content: [{ type: 'text', text: 'hi' }] } },
  { type: 'result', subtype: 'success', session_id: 's-1', total_cost_usd: 0.5, num_turns: 1, is_error: false, result: 'first' },
  {
    type: 'result',
    subtype: 'success',
    session_id: 's-1',
    total_cost_usd: 0.12,
    num_turns: 7,
    is_error: false,
    result: 'Done.',
    modelUsage: usage,
  },
];

test('traceModels reads the init model, the CLI version and the last result line modelUsage keys', () => {
  assert.deepEqual(traceModels(trace), {
    init: 'claude-sonnet-5-5',
    used: ['claude-sonnet-5-5', 'claude-haiku-4-5-20251001'],
    claudeCodeVersion: '2.1.327',
  });
  assert.deepEqual(traceModels([]), { init: null, used: [], claudeCodeVersion: null });
});

test('traceResult reads session, cost, turns, error flag, text and summed tokens from the last result line', () => {
  assert.deepEqual(traceResult(trace), {
    sessionId: 's-1',
    costUsd: 0.12,
    turns: 7,
    isError: false,
    resultText: 'Done.',
    tokens: { input: 11, output: 22, cacheRead: 33, cacheCreation: 44 },
  });
  assert.equal(traceResult(trace.slice(0, 2)), null);
});

test('modelRefusal accepts the requested model or its dated id, and side calls of other models', () => {
  const sonnet = 'claude-sonnet-5-5';
  const cases: [string | null, string[]][] = [
    [sonnet, [sonnet]],
    [sonnet, [sonnet, 'claude-haiku-4-5-20251001']],
    [`${sonnet}-20261101`, [`${sonnet}-20261101`]],
    ['claude-opus-5-5', ['claude-opus-5-5']],
    [sonnet, ['claude-opus-5-5']],
    [null, [sonnet]],
    [`${sonnet}-2026`, [`${sonnet}-2026`]],
  ];

  const kind = (refusal: string | null): string => {
    if (refusal === null) {
      return 'ok';
    }

    return refusal.startsWith('model mismatch') ? 'mismatch' : 'unnamed';
  };

  assert.deepEqual(
    cases.map(([init, used]) => kind(modelRefusal(sonnet, init, used))),
    ['ok', 'ok', 'ok', 'mismatch', 'mismatch', 'unnamed', 'mismatch'],
  );
  assert.match(modelRefusal(sonnet, 'claude-opus-5-5', ['claude-opus-5-5']) ?? '', /claude-opus-5-5 ran where claude-sonnet-5-5/);
});

test('modelRefusal refuses another main model beside the requested one, naming it', () => {
  const refusal = modelRefusal('claude-opus-5-5', 'claude-opus-5-5', ['claude-opus-5-5', 'claude-opus-4-8']);

  assert.match(refusal ?? '', /claude-opus-4-8/);
  assert.equal(modelRefusal('claude-opus-5-5', 'claude-opus-5-5', ['claude-opus-5-5', 'claude-haiku-4-5-20251001']), null);
});

test('limitStopped accepts the straight and the curly apostrophe, any case, and a rate-limit error type', () => {
  assert.deepEqual(
    ['You’ve hit your 5-hour limit', "you've HIT your weekly limit"].map((text) => limitStopped(text)),
    [true, true],
  );
  assert.equal(limitStopped(null, { subtype: 'error_rate_limit' }), true);
  assert.equal(limitStopped(null, { error: { type: 'rate_limit_error' } }), true);
  assert.equal(limitStopped(null, { subtype: 'success' }), false);
});

test('toolCalls pairs each tool_use with its tool_result by id and marks errors and rejected permissions', () => {
  const entries = [
    {
      type: 'assistant',
      message: {
        content: [
          { type: 'tool_use', id: 't1', name: 'Read', input: { file_path: 'S:/cwd/a.ts' } },
          { type: 'tool_use', id: 't2', name: 'Bash', input: { command: 'npm test' } },
          { type: 'tool_use', id: 't3', name: 'Edit', input: {} },
        ],
      },
    },
    { type: 'user', message: { content: [{ type: 'tool_result', tool_use_id: 't1', content: 'x', is_error: true }] } },
    {
      type: 'user',
      permissionDecision: { decision: 'reject' },
      message: { content: [{ type: 'tool_result', tool_use_id: 't2', content: 'denied' }] },
    },
    { type: 'api-request-blob', message: { content: [{ type: 'tool_use', id: 't9', name: 'Write', input: {} }] } },
  ];

  assert.deepEqual(toolCalls(entries), [
    { id: 't1', name: 'Read', input: { file_path: 'S:/cwd/a.ts' }, isError: true, denied: false },
    { id: 't2', name: 'Bash', input: { command: 'npm test' }, isError: false, denied: true },
    { id: 't3', name: 'Edit', input: {}, isError: false, denied: false },
  ]);
});

test('limitStopped tells a session the usage limit ended from one that reported its work', () => {
  assert.deepEqual(
    [
      "You've hit your 5-hour limit resets 6:30am (Europe/Copenhagen)",
      "You've hit your weekly limit",
      'All 12 tests pass.',
      "I think You've hit your limit",
      null,
    ].map((text) => limitStopped(text)),
    [true, true, false, false, false],
  );
});

test('slimOutput reads the run-slim --out file, whose stdout is one result object', () => {
  const out = {
    cwd: 'S:/cwd',
    args: [],
    prompt: 'x',
    status: 0,
    ms: 1500,
    stdout: JSON.stringify({ type: 'result', session_id: 'abc', result: 'ok', modelUsage: usage }),
    stderr: '',
  };

  assert.deepEqual(slimOutput(out), {
    cwd: 'S:/cwd',
    status: 0,
    ms: 1500,
    result: { type: 'result', session_id: 'abc', result: 'ok', modelUsage: usage },
    session: 'abc',
  });
  assert.deepEqual(slimOutput({ status: null, stdout: '' }), { cwd: null, status: null, ms: 0, result: {}, session: null });
  assert.deepEqual(slimOutput('not an object'), { cwd: null, status: null, ms: 0, result: {}, session: null });
});
