# Decompose Conditional

Use when: a conditional's test or branches are complex enough that their intent is hard to read.

## Motivation

Complex conditional logic is one of the biggest sources of complexity in a program. The condition
and each branch tell you what happens but bury why it happens, so the reader has to decode the
arithmetic instead of seeing the intent. Pulling the test and each leg into well-named functions
turns the conditional into a statement of purpose ("if overdue for a non-member, charge the
penalty") and hides the detail behind names. It is Extract Function applied to a conditional.

## Mechanics

1. Extract the condition into its own function named for what it decides, with
   [Extract Function](extract-function.md).
2. Extract the then-leg into a function named for what it does.
3. Extract the else-leg, if there is one, the same way.
4. Run the tests after each extraction.

## Example

Before, the test and both legs are inline arithmetic:

```ts
function fee(days: number, member: boolean): number {
  let result: number;
  if (days > 14 && !member) {
    result = days * 2;
  } else {
    result = days * 1;
  }
  return result;
}
```

After, the condition and each leg read as named intent:

```ts
function fee(days: number, member: boolean): number {
  if (isOverdueNonMember(days, member)) {
    return penaltyFee(days);
  }
  return standardFee(days);
}

function isOverdueNonMember(days: number, member: boolean): boolean {
  return days > 14 && !member;
}

function penaltyFee(days: number): number {
  return days * 2;
}

function standardFee(days: number): number {
  return days * 1;
}
```
