#!/usr/bin/env bash
# flatten() by plain recursion: the shallow test passes, the new deeply nested test overflows the stack.
set -euo pipefail

mkdir -p src

cat > package.json <<'EOF'
{
  "name": "flatten",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "vitest run"
  }
}
EOF

cat > src/flatten.ts <<'EOF'
export type Nested = number | Nested[];

export function flatten(list: Nested[]): number[] {
  const result: number[] = [];

  for (const item of list) {
    if (Array.isArray(item)) {
      result.push(...flatten(item));
    } else {
      result.push(item);
    }
  }

  return result;
}
EOF

cat > src/flatten.test.ts <<'EOF'
import { describe, expect, it } from 'vitest';
import { flatten, type Nested } from './flatten';

describe('flatten', () => {
  it('flattens shallow input', () => {
    expect(flatten([1, [2, 3]])).toEqual([1, 2, 3]);
  });

  it('flattens deeply nested input', () => {
    let deep: Nested[] = [1];

    for (let depth = 0; depth < 100_000; depth += 1) {
      deep = [deep];
    }

    expect(flatten(deep)).toEqual([1]);
  });
});
EOF
