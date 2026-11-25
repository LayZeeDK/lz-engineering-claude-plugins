#!/usr/bin/env bash
# Word wrap with an empty wrap() and one red test that seems to need the whole algorithm.
set -euo pipefail

mkdir -p src

cat > package.json <<'EOF'
{
  "name": "wrap",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "vitest run"
  }
}
EOF

cat > src/wrap.ts <<'EOF'
export function wrap(text: string, width: number): string[] {
  throw new Error('not implemented');
}
EOF

cat > src/wrap.test.ts <<'EOF'
import { describe, expect, it } from 'vitest';
import { wrap } from './wrap';

describe('wrap', () => {
  it('breaks two words that do not fit on one line', () => {
    expect(wrap('word wrap', 8)).toEqual(['word', 'wrap']);
  });
});
EOF
