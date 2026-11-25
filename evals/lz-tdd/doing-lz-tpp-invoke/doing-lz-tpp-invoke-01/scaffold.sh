#!/usr/bin/env bash
# The fibonacci kata after its first test: of() returns the constant 0, of(0) is green and the new of(1) test is red.
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
  return 0;
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
});
EOF
