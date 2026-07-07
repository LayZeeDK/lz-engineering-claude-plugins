# Introduce Null Object

Use when: the same "is it absent?" check is repeated across call sites, each supplying the same default behavior when it is.

Direction: To
GoF pattern: [Null Object](../extra-patterns-catalog/null-object.md#null-object) (non-classic-GoF)
Composed Fowler primitive(s): [Introduce Special Case](../fowler-catalog/introduce-special-case.md#introduce-special-case), [Replace Conditional with Polymorphism](../fowler-catalog/replace-conditional-with-polymorphism.md#replace-conditional-with-polymorphism)
Functional alternative: [Option and Either](../functional-catalog/option-and-either.md#option-and-either)

## Motivation

When a value can be absent and every caller guards it with the same null check before falling back to the
same neutral behavior, that check is duplicated everywhere the value is used, and forgetting it once is a
latent bug. A null object is a real instance of the expected type whose methods do the neutral thing --
return the identity value, do nothing, answer "empty". Callers hold it in place of the absent value and
simply call through, with no special case at the call site. The absence is handled in one class instead of
at every use. Reach for it once the same null-and-default pattern is repeated across callers.

## Mechanics

1. Identify the absent case and the neutral behavior each caller falls back to, treating it as a special
   case with [Introduce Special Case](../fowler-catalog/introduce-special-case.md#introduce-special-case).
2. Create a class implementing the value's interface whose methods return the neutral results.
3. Supply the null object wherever the value would have been absent, then remove the null checks, letting
   the polymorphic call stand in for them with
   [Replace Conditional with Polymorphism](../fowler-catalog/replace-conditional-with-polymorphism.md#replace-conditional-with-polymorphism);
   compile and run the tests.
4. Run the tests and confirm the absent case behaves exactly as the old default did.

## Example

Before -- every caller null-checks the plan before defaulting:

```ts
interface Plan {
  discount(amount: number): number;
}

class PaidPlan implements Plan {
  discount(amount: number): number { return amount * 0.9; }
}

function priceFor(plan: Plan | null, amount: number): number {
  if (plan === null) {
    return amount;
  }
  return plan.discount(amount);
}
```

After -- a null object supplies the neutral behavior:

```ts
interface Plan {
  discount(amount: number): number;
}

class PaidPlan implements Plan {
  discount(amount: number): number { return amount * 0.9; }
}

class NoPlan implements Plan {
  discount(amount: number): number { return amount; }
}

function priceFor(plan: Plan, amount: number): number {
  return plan.discount(amount);
}
```

## Watch for

- Introduce a null object only when the absent case has one genuinely neutral behavior repeated across
  callers; if "absent" must be handled differently in different places, or should be a loud error rather
  than a quiet default, a null object masks the distinction and can swallow bugs that an explicit check
  would surface.
- A null object only helps callers who know to use it: a developer unaware that one exists may keep
  writing redundant null checks against it, so the duplicated checks it was meant to remove can quietly
  creep back.
