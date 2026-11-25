#!/usr/bin/env bash
# A Config Singleton that every module reaches through Config.getInstance(); the tests pass.
set -euo pipefail

mkdir -p src

cat > package.json <<'EOF'
{
  "name": "config",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "vitest run"
  }
}
EOF

cat > src/config.ts <<'EOF'
export class Config {
  private static instance: Config | null = null;

  locale = 'en';
  currency = 'USD';

  private constructor() {}

  static getInstance(): Config {
    if (Config.instance === null) {
      Config.instance = new Config();
    }

    return Config.instance;
  }
}
EOF

cat > src/greeting.ts <<'EOF'
import { Config } from './config';

export function greeting(name: string): string {
  return Config.getInstance().locale === 'da' ? 'Hej ' + name : 'Hello ' + name;
}
EOF

cat > src/money.ts <<'EOF'
import { Config } from './config';

export function formatMoney(amount: number): string {
  return amount.toFixed(2) + ' ' + Config.getInstance().currency;
}
EOF

cat > src/config.test.ts <<'EOF'
import { afterEach, describe, expect, it } from 'vitest';
import { Config } from './config';
import { greeting } from './greeting';
import { formatMoney } from './money';

afterEach(() => {
  Config.getInstance().locale = 'en';
  Config.getInstance().currency = 'USD';
});

describe('modules that read the config', () => {
  it('greets in the configured locale', () => {
    expect(greeting('Ada')).toBe('Hello Ada');
    Config.getInstance().locale = 'da';
    expect(greeting('Ada')).toBe('Hej Ada');
  });

  it('formats money in the configured currency', () => {
    Config.getInstance().currency = 'DKK';
    expect(formatMoney(12.5)).toBe('12.50 DKK');
  });
});
EOF
