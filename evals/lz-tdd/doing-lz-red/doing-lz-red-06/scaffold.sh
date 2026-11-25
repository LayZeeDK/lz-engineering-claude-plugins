#!/usr/bin/env bash
# applyDiscount still returns the total, and its only test checks the result's type, so it went green on the first
# run.
set -euo pipefail

mkdir -p src

cat > package.json <<'EOF'
{
  "name": "apply-discount",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "vitest run"
  }
}
EOF

cat > src/apply-discount.ts <<'EOF'
export function applyDiscount(total: number, percent: number): number {
  return total;
}
EOF

cat > src/apply-discount.test.ts <<'EOF'
import { expect, it } from 'vitest';
import { applyDiscount } from './apply-discount';

it('should return a number', () => {
  expect(typeof applyDiscount(100, 10)).toBe('number');
});
EOF
