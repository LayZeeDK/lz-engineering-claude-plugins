#!/usr/bin/env bash
# The prime factors kata returning the constant empty list: primeFactors(1) is green, primeFactors(2) is red.
set -euo pipefail

mkdir -p src

cat > package.json <<'EOF'
{
  "name": "prime-factors",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "vitest run"
  }
}
EOF

cat > src/prime-factors.ts <<'EOF'
export function primeFactors(n: number): number[] {
  return [];
}
EOF

cat > src/prime-factors.test.ts <<'EOF'
import { describe, expect, it } from 'vitest';
import { primeFactors } from './prime-factors';

describe('primeFactors', () => {
  it('has no factors for 1', () => {
    expect(primeFactors(1)).toEqual([]);
  });

  it('factors 2', () => {
    expect(primeFactors(2)).toEqual([2]);
  });
});
EOF
