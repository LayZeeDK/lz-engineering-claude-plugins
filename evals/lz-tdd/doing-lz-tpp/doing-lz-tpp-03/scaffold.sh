#!/usr/bin/env bash
# A recursive sum(n) of 1..n whose small tests pass; the new test on one million overflows the stack.
set -euo pipefail

mkdir -p src

cat > package.json <<'EOF'
{
  "name": "sum",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "vitest run"
  }
}
EOF

cat > src/sum.ts <<'EOF'
export function sum(n: number): number {
  if (n === 0) {
    return 0;
  }

  return n + sum(n - 1);
}
EOF

cat > src/sum.test.ts <<'EOF'
import { describe, expect, it } from 'vitest';
import { sum } from './sum';

describe('sum', () => {
  it('is 0 for 0', () => {
    expect(sum(0)).toBe(0);
  });

  it('adds 1 to 3', () => {
    expect(sum(3)).toBe(6);
  });

  it('adds 1 to one million', () => {
    expect(sum(1_000_000)).toBe(500000500000);
  });
});
EOF
