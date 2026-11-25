#!/usr/bin/env bash
# The fibonacci kata with the base cases handled and 1 for every n above 1; the new of(3) test is red.
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
  if (n < 2) {
    return n;
  }

  return 1;
}
EOF

cat > src/fibonacci.test.ts <<'EOF'
import { describe, expect, it } from 'vitest';
import { of } from './fibonacci';

describe('of', () => {
  it('returns 0 for 0', () => {
    expect(of(0)).toBe(0);
  });

  it('returns 1 for 1', () => {
    expect(of(1)).toBe(1);
  });

  it('returns 1 for 2', () => {
    expect(of(2)).toBe(1);
  });

  it('returns 2 for 3', () => {
    expect(of(3)).toBe(2);
  });
});
EOF
