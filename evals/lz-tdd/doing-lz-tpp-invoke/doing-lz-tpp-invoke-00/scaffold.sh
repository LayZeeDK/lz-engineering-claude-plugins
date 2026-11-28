#!/usr/bin/env bash
# The fibonacci kata at its first test: of() only throws, and the of(0) test is red.
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
  throw new Error('not implemented');
}
EOF

cat > src/fibonacci.test.ts <<'EOF'
import { describe, expect, it } from 'vitest';
import { of } from './fibonacci';

describe('of', () => {
  it('returns 0 for 0', () => {
    expect(of(0)).toBe(0);
  });
});
EOF
