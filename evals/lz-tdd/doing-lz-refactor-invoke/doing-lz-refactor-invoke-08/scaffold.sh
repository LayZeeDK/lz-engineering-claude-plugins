#!/usr/bin/env bash
# The same switch on shape.kind repeated in area, perimeter and boundingBox; the tests build shapes through the
# circle, square and triangle functions and pass.
set -euo pipefail

mkdir -p src

cat > package.json <<'EOF'
{
  "name": "shapes",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "vitest run"
  }
}
EOF

cat > src/shapes.ts <<'EOF'
export type Shape =
  | { readonly kind: 'circle'; readonly radius: number }
  | { readonly kind: 'square'; readonly side: number }
  | { readonly kind: 'triangle'; readonly base: number; readonly height: number };

export function circle(radius: number): Shape {
  return { kind: 'circle', radius };
}

export function square(side: number): Shape {
  return { kind: 'square', side };
}

export function triangle(base: number, height: number): Shape {
  return { kind: 'triangle', base, height };
}

export function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius * shape.radius;
    case 'square':
      return shape.side * shape.side;
    case 'triangle':
      return (shape.base * shape.height) / 2;
  }
}

export function perimeter(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return 2 * Math.PI * shape.radius;
    case 'square':
      return 4 * shape.side;
    case 'triangle':
      return shape.base + 2 * Math.hypot(shape.base / 2, shape.height);
  }
}

export function boundingBox(shape: Shape): { width: number; height: number } {
  switch (shape.kind) {
    case 'circle':
      return { width: 2 * shape.radius, height: 2 * shape.radius };
    case 'square':
      return { width: shape.side, height: shape.side };
    case 'triangle':
      return { width: shape.base, height: shape.height };
  }
}
EOF

cat > src/shapes.test.ts <<'EOF'
import { describe, expect, it } from 'vitest';
import { area, boundingBox, circle, perimeter, square, triangle } from './shapes';

describe('shapes', () => {
  it('measures a circle', () => {
    expect(area(circle(1))).toBeCloseTo(Math.PI);
    expect(perimeter(circle(1))).toBeCloseTo(2 * Math.PI);
    expect(boundingBox(circle(1))).toEqual({ width: 2, height: 2 });
  });

  it('measures a square', () => {
    expect(area(square(3))).toBe(9);
    expect(perimeter(square(3))).toBe(12);
    expect(boundingBox(square(3))).toEqual({ width: 3, height: 3 });
  });

  it('measures an isosceles triangle', () => {
    expect(area(triangle(6, 4))).toBe(12);
    expect(perimeter(triangle(6, 4))).toBe(16);
    expect(boundingBox(triangle(6, 4))).toEqual({ width: 6, height: 4 });
  });
});
EOF
