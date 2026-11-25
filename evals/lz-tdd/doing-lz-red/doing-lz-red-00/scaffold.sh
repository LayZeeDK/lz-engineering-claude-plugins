#!/usr/bin/env bash
# A brand-new sumOf with no test yet: the production side only throws, so a first test fails at the point of use.
set -euo pipefail

mkdir -p src

cat > package.json <<'EOF'
{
  "name": "sum-of",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "vitest run"
  }
}
EOF

cat > src/sum-of.ts <<'EOF'
export function sumOf(values: number[]): number {
  throw new Error('not implemented');
}
EOF
