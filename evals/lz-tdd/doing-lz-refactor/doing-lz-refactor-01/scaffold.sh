#!/usr/bin/env bash
# createShipment and three other functions each take the same street, city and zip trio; the tests pass.
set -euo pipefail

mkdir -p src

cat > package.json <<'EOF'
{
  "name": "shipment",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "vitest run"
  }
}
EOF

cat > src/shipment.ts <<'EOF'
export interface Shipment {
  readonly name: string;
  readonly label: string;
  readonly zone: number;
  readonly weightKg: number;
  readonly carrier: string;
  readonly priority: boolean;
  readonly cost: number;
}

export function formatLabel(name: string, street: string, city: string, zip: string): string {
  return name + '\n' + street + '\n' + zip + ' ' + city;
}

export function zoneOf(street: string, city: string, zip: string): number {
  return Number(zip.slice(0, 1)) || 1;
}

export function isDeliverable(street: string, city: string, zip: string): boolean {
  return street.trim() !== '' && city.trim() !== '' && /^\d{4,5}$/.test(zip);
}

export function createShipment(
  name: string,
  street: string,
  city: string,
  zip: string,
  weightKg: number,
  carrier: string,
  priority: boolean,
): Shipment {
  if (!isDeliverable(street, city, zip)) {
    throw new Error('cannot deliver to ' + street + ', ' + city);
  }

  const zone = zoneOf(street, city, zip);
  const cost = Math.round((5 + weightKg * zone * (priority ? 2 : 1)) * 100) / 100;

  return { name, label: formatLabel(name, street, city, zip), zone, weightKg, carrier, priority, cost };
}
EOF

cat > src/shipment.test.ts <<'EOF'
import { describe, expect, it } from 'vitest';
import { createShipment, formatLabel, isDeliverable, zoneOf } from './shipment';

describe('shipment', () => {
  it('creates a priority shipment with label, zone and cost', () => {
    const shipment = createShipment('Ada', 'Main St 1', 'Aarhus', '8000', 2, 'PostNord', true);

    expect(shipment).toEqual({
      name: 'Ada',
      label: 'Ada\nMain St 1\n8000 Aarhus',
      zone: 8,
      weightKg: 2,
      carrier: 'PostNord',
      priority: true,
      cost: 37,
    });
  });

  it('refuses an address it cannot deliver to', () => {
    expect(() => createShipment('Ada', '', 'Aarhus', '8000', 2, 'PostNord', false)).toThrow('cannot deliver to , Aarhus');
  });

  it('formats a label, finds a zone and checks an address on its own', () => {
    expect(formatLabel('Bo', 'Side St 2', 'Odense', '5000')).toBe('Bo\nSide St 2\n5000 Odense');
    expect(zoneOf('Side St 2', 'Odense', '5000')).toBe(5);
    expect(isDeliverable('Side St 2', 'Odense', 'x')).toBe(false);
  });
});
EOF
