#!/usr/bin/env bash
# A Gate with a query isOpen() and a command openGate() that flips its state but does not yet notify the injected
# notifier, so a test of the outgoing 'opened' message fails on its assertion.
set -euo pipefail

mkdir -p src

cat > package.json <<'EOF'
{
  "name": "gate",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "vitest run"
  }
}
EOF

cat > src/gate.ts <<'EOF'
export class Gate {
  private open = false;

  constructor(private readonly notify: (event: string) => void) {}

  isOpen(): boolean {
    return this.open;
  }

  openGate(): void {
    this.open = true;
  }
}
EOF
