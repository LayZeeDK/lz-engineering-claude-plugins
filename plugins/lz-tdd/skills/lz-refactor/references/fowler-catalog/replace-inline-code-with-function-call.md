# Replace Inline Code with Function Call

Use when: inline code does the same thing as a function that already exists.

## Motivation

A well-named function call says what the code achieves, leaving the how to the function's body, so a
reader follows intent instead of re-deriving it. When you spot inline code that duplicates an
existing function, replacing it with a call removes the duplication, ties the behavior to a single
definition, and lets any later improvement to that function reach this site for free. Reuse only when
the function genuinely does what the inline code does; code that merely looks similar but means
something different should stay separate.

## Mechanics

1. Replace the inline code with a call to the existing function.
2. Run the tests.

## Example

Before -- the loop re-implements the same membership test the helper already provides:

```ts
function isVowel(ch: string): boolean {
  return ["a", "e", "i", "o", "u"].includes(ch);
}

function countVowels(word: string): number {
  let count = 0;
  for (const ch of word) {
    if (["a", "e", "i", "o", "u"].includes(ch)) {
      count++;
    }
  }
  return count;
}
```

After -- the loop calls the existing function:

```ts
function isVowel(ch: string): boolean {
  return ["a", "e", "i", "o", "u"].includes(ch);
}

function countVowels(word: string): number {
  let count = 0;
  for (const ch of word) {
    if (isVowel(ch)) {
      count++;
    }
  }
  return count;
}
```

## Watch for

- Substitute only when the function's meaning matches, not merely its current implementation; a
  future change to the function must remain correct for this site too.
