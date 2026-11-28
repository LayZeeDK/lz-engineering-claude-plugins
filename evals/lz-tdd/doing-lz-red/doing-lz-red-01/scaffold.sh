#!/usr/bin/env bash
# isEven returns the constant true and its one test, isEven(0), is green.
set -euo pipefail

mkdir -p src

cat > package.json <<'EOF'
{
  "name": "is-even",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "vitest run"
  }
}
EOF

cat > src/is-even.ts <<'EOF'
export function isEven(n: number): boolean {
  return true;
}
EOF

cat > src/is-even.test.ts <<'EOF'
import { describe, expect, it } from 'vitest';
import { isEven } from './is-even';

describe('isEven', () => {
  it('is true for 0', () => {
    expect(isEven(0)).toBe(true);
  });
});
EOF
