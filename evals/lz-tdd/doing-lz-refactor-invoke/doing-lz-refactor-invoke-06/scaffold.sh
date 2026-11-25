#!/usr/bin/env bash
# A matcher with one hand-coded method per combination of exact/prefix, word/phrase and and/or; the tests pass.
set -euo pipefail

mkdir -p src

cat > package.json <<'EOF'
{
  "name": "matcher",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "vitest run"
  }
}
EOF

cat > src/matcher.ts <<'EOF'
function words(text: string): string[] {
  return text.toLowerCase().split(/\s+/).filter((word) => word !== '');
}

export class Matcher {
  matchExactWord(text: string, terms: string[]): boolean {
    return terms.every((term) => words(text).includes(term.toLowerCase()));
  }

  matchWordPrefix(text: string, terms: string[]): boolean {
    return terms.every((term) => words(text).some((word) => word.startsWith(term.toLowerCase())));
  }

  matchExactPhrase(text: string, terms: string[]): boolean {
    return terms.every((term) => (' ' + words(text).join(' ') + ' ').includes(' ' + term.toLowerCase() + ' '));
  }

  matchPhrasePrefix(text: string, terms: string[]): boolean {
    return terms.every((term) => (' ' + words(text).join(' ')).includes(' ' + term.toLowerCase()));
  }

  matchAnyExactWord(text: string, terms: string[]): boolean {
    return terms.some((term) => words(text).includes(term.toLowerCase()));
  }

  matchAnyWordPrefix(text: string, terms: string[]): boolean {
    return terms.some((term) => words(text).some((word) => word.startsWith(term.toLowerCase())));
  }

  matchAnyExactPhrase(text: string, terms: string[]): boolean {
    return terms.some((term) => (' ' + words(text).join(' ') + ' ').includes(' ' + term.toLowerCase() + ' '));
  }

  matchAnyPhrasePrefix(text: string, terms: string[]): boolean {
    return terms.some((term) => (' ' + words(text).join(' ')).includes(' ' + term.toLowerCase()));
  }
}
EOF

cat > src/matcher.test.ts <<'EOF'
import { describe, expect, it } from 'vitest';
import { Matcher } from './matcher';

const text = 'The quick brown fox jumps';
const matcher = new Matcher();

describe('Matcher', () => {
  it('matches every exact word or word prefix', () => {
    expect(matcher.matchExactWord(text, ['quick', 'fox'])).toBe(true);
    expect(matcher.matchExactWord(text, ['quick', 'cat'])).toBe(false);
    expect(matcher.matchWordPrefix(text, ['qui', 'jum'])).toBe(true);
    expect(matcher.matchWordPrefix(text, ['qui', 'cat'])).toBe(false);
  });

  it('matches every exact phrase or phrase prefix', () => {
    expect(matcher.matchExactPhrase(text, ['quick brown'])).toBe(true);
    expect(matcher.matchExactPhrase(text, ['quick bro'])).toBe(false);
    expect(matcher.matchPhrasePrefix(text, ['quick bro'])).toBe(true);
    expect(matcher.matchPhrasePrefix(text, ['brown quick'])).toBe(false);
  });

  it('matches any exact word or word prefix', () => {
    expect(matcher.matchAnyExactWord(text, ['cat', 'fox'])).toBe(true);
    expect(matcher.matchAnyExactWord(text, ['cat', 'dog'])).toBe(false);
    expect(matcher.matchAnyWordPrefix(text, ['ca', 'ju'])).toBe(true);
    expect(matcher.matchAnyWordPrefix(text, ['ca', 'do'])).toBe(false);
  });

  it('matches any exact phrase or phrase prefix', () => {
    expect(matcher.matchAnyExactPhrase(text, ['lazy dog', 'brown fox'])).toBe(true);
    expect(matcher.matchAnyExactPhrase(text, ['lazy dog', 'brown fo'])).toBe(false);
    expect(matcher.matchAnyPhrasePrefix(text, ['lazy dog', 'brown fo'])).toBe(true);
    expect(matcher.matchAnyPhrasePrefix(text, ['lazy dog', 'fox brown'])).toBe(false);
  });
});
EOF
