import { describe, expect, it } from 'vitest';
import { shippingCost } from './shipping';

const order = (weightKg: number, subtotal = 10, express = false) => ({ weightKg, subtotal, express });

describe('acceptance', () => {
  it.each([
    [0.2, 5],
    [1, 5],
    [1.01, 7],
    [2, 7],
    [2.5, 9],
    [3, 9],
    [10, 23],
  ])('standard %s kg costs %s', (weight, cost) => {
    expect(shippingCost(order(weight))).toBeCloseTo(cost, 10);
  });

  it.each([
    [1, 10],
    [2.5, 18],
  ])('express %s kg costs %s', (weight, cost) => {
    expect(shippingCost(order(weight, 10, true))).toBeCloseTo(cost, 10);
  });

  it('ships free at a subtotal of exactly 100', () => {
    expect(shippingCost(order(3, 100))).toBe(0);
  });

  it('ships free above 100', () => {
    expect(shippingCost(order(0.5, 250))).toBe(0);
  });

  it('charges just below the threshold', () => {
    expect(shippingCost(order(1, 99.99))).toBeCloseTo(5, 10);
  });

  it('charges express even above the threshold', () => {
    expect(shippingCost(order(2.5, 150, true))).toBeCloseTo(18, 10);
  });

  it.each([0, -1])('rejects weight %s with a RangeError', (weight) => {
    expect(() => shippingCost(order(weight))).toThrow(RangeError);
  });
});
