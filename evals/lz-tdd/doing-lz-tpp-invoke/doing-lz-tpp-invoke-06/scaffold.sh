#!/usr/bin/env bash
# A long, working fibonacci of(n) with all its tests green, ready for a cleanup.
set -euo pipefail

mkdir -p src

cat > package.json <<'EOF'
{
  "name": "fibonacci",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "vitest run"
  }
}
EOF

cat > src/fibonacci.ts <<'EOF'
export function of(n: number): number {
  if (!Number.isInteger(n)) {
    throw new RangeError('n must be a whole number, got ' + n);
  }

  if (n < 0) {
    throw new RangeError('n must not be negative, got ' + n);
  }

  if (n === 0) {
    return 0;
  }

  if (n === 1) {
    return 1;
  }

  let previous = 0;
  let current = 1;
  let index = 2;

  while (index <= n) {
    const next = previous + current;
    previous = current;
    current = next;
    index = index + 1;
  }

  if (!Number.isSafeInteger(current)) {
    throw new RangeError('of(' + n + ') is too large to hold exactly');
  }

  return current;
}
EOF

cat > src/fibonacci.test.ts <<'EOF'
import { describe, expect, it } from 'vitest';
import { of } from './fibonacci';

describe('of', () => {
  it('returns the first numbers of the sequence', () => {
    expect([0, 1, 2, 3, 4, 5, 6].map(of)).toEqual([0, 1, 1, 2, 3, 5, 8]);
  });

  it('refuses a negative n', () => {
    expect(() => of(-1)).toThrow('n must not be negative, got -1');
  });

  it('refuses a fraction', () => {
    expect(() => of(1.5)).toThrow('n must be a whole number, got 1.5');
  });

  it('refuses a result too large to hold exactly', () => {
    expect(() => of(80)).toThrow('of(80) is too large to hold exactly');
  });
});
EOF
