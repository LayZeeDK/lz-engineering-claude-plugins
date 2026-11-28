#!/usr/bin/env bash
# An untested PriceCalculator that reads Date.now() deep inside computeDue() and has no late fee yet.
set -euo pipefail

mkdir -p src

cat > package.json <<'EOF'
{
  "name": "price-calculator",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "vitest run"
  }
}
EOF

cat > src/price-calculator.ts <<'EOF'
export interface Invoice {
  readonly amount: number;
  readonly dueAt: number;
  readonly paidAt: number | null;
}

export class PriceCalculator {
  constructor(private readonly serviceFeeRate: number) {}

  computeDue(invoice: Invoice): number {
    const fee = this.serviceFee(invoice.amount);

    if (invoice.paidAt !== null) {
      return 0;
    }

    const daysOpen = this.daysOpen(invoice);

    return daysOpen > 365 ? 0 : invoice.amount + fee;
  }

  private serviceFee(amount: number): number {
    return Math.round(amount * this.serviceFeeRate * 100) / 100;
  }

  private daysOpen(invoice: Invoice): number {
    const now = Date.now();

    return Math.floor((now - invoice.dueAt) / 86_400_000);
  }
}
EOF
