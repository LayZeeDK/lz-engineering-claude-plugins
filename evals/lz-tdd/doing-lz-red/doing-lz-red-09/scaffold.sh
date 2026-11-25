#!/usr/bin/env bash
# A messy parseAmount whose tests are all green; a negative amount such as -$5.00 is not handled (it throws).
set -euo pipefail

mkdir -p src

cat > package.json <<'EOF'
{
  "name": "parse-amount",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "vitest run"
  }
}
EOF

cat > src/parse-amount.ts <<'EOF'
export function parseAmount(s: string): number {
  let t = s.trim();
  if (t.startsWith('$')) t = t.slice(1);
  t = t.split(',').join('');
  const n = Number(t);
  if (t === '' || Number.isNaN(n)) {
    throw new Error('not an amount: ' + s);
  }
  return n;
}
EOF

cat > src/parse-amount.test.ts <<'EOF'
import { describe, expect, it } from 'vitest';
import { parseAmount } from './parse-amount';

describe('parseAmount', () => {
  it('reads a plain amount', () => {
    expect(parseAmount('12.50')).toBe(12.5);
  });

  it('reads a dollar amount with thousands separators', () => {
    expect(parseAmount('$1,234.00')).toBe(1234);
  });

  it('refuses text that is not an amount', () => {
    expect(() => parseAmount('twelve')).toThrow('not an amount: twelve');
  });
});
EOF
