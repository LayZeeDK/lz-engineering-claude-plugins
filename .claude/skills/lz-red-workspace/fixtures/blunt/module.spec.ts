import { describe, it, expect } from 'vitest';
import { correlationId } from './module';

describe('correlationId', () => {
  it('returns the incoming header value', () => {
    expect(correlationId('abc-123')).toBe('abc-123');
  });
});
