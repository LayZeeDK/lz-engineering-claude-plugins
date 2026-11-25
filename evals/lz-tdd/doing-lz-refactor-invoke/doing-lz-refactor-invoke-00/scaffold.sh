#!/usr/bin/env bash
# A long processOrder that validates the cart, computes line totals and tax, and formats a receipt in one body, with
# a passing test file.
set -euo pipefail

mkdir -p src

cat > package.json <<'EOF'
{
  "name": "process-order",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "vitest run"
  }
}
EOF

cat > src/process-order.ts <<'EOF'
export interface OrderLine {
  readonly sku: string;
  readonly quantity: number;
  readonly unitPrice: number;
}

export interface Order {
  readonly id: string;
  readonly lines: readonly OrderLine[];
  readonly taxRate: number;
}

export function processOrder(order: Order): string {
  if (order.lines.length === 0) {
    throw new Error('order ' + order.id + ' has no lines');
  }

  for (const line of order.lines) {
    if (line.quantity <= 0) {
      throw new Error('line ' + line.sku + ' has a quantity below 1');
    }

    if (line.unitPrice < 0) {
      throw new Error('line ' + line.sku + ' has a negative price');
    }
  }

  const lineTotals: { sku: string; quantity: number; total: number }[] = [];
  let subtotal = 0;

  for (const line of order.lines) {
    const total = Math.round(line.quantity * line.unitPrice * 100) / 100;
    lineTotals.push({ sku: line.sku, quantity: line.quantity, total });
    subtotal = subtotal + total;
  }

  const tax = Math.round(subtotal * order.taxRate * 100) / 100;
  const grandTotal = Math.round((subtotal + tax) * 100) / 100;
  let receipt = 'Order ' + order.id + '\n';

  for (const entry of lineTotals) {
    receipt = receipt + entry.quantity + ' x ' + entry.sku + ': ' + entry.total.toFixed(2) + '\n';
  }

  receipt = receipt + 'Subtotal: ' + subtotal.toFixed(2) + '\n';
  receipt = receipt + 'Tax: ' + tax.toFixed(2) + '\n';
  receipt = receipt + 'Total: ' + grandTotal.toFixed(2) + '\n';

  return receipt;
}
EOF

cat > src/process-order.test.ts <<'EOF'
import { describe, expect, it } from 'vitest';
import { processOrder } from './process-order';

describe('processOrder', () => {
  it('formats a receipt with line totals, tax and total', () => {
    const receipt = processOrder({
      id: 'A1',
      taxRate: 0.25,
      lines: [
        { sku: 'pen', quantity: 2, unitPrice: 1.5 },
        { sku: 'pad', quantity: 1, unitPrice: 4 },
      ],
    });

    expect(receipt).toBe('Order A1\n2 x pen: 3.00\n1 x pad: 4.00\nSubtotal: 7.00\nTax: 1.75\nTotal: 8.75\n');
  });

  it('refuses an order with no lines', () => {
    expect(() => processOrder({ id: 'A2', taxRate: 0.25, lines: [] })).toThrow('order A2 has no lines');
  });

  it('refuses a line with a quantity below 1', () => {
    const order = { id: 'A3', taxRate: 0.25, lines: [{ sku: 'pen', quantity: 0, unitPrice: 1.5 }] };

    expect(() => processOrder(order)).toThrow('line pen has a quantity below 1');
  });
});
EOF
