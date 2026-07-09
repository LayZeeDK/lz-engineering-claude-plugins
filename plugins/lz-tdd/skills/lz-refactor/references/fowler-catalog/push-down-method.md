# Push Down Method

Use when: a method on the superclass is relevant to only one subclass (or a few), not all of them.

## Motivation

A method that sits on the superclass but makes sense for just one kind of subclass misleads readers
into thinking every subclass supports it. Moving it down to the subclass that actually uses it makes
the class hierarchy honest about which behavior belongs where. It is the natural response once you
realize a capability is specific rather than shared.

## Mechanics

1. Recreate the method body inside each subclass that actually calls it.
2. Take the method off the superclass, leaving it defined only on those subclasses.
3. Run the tests.
4. Remove the copy from any subclass that turns out not to need it.
5. Run the tests.

Inverse of [Pull Up Method](pull-up-method.md).

## Example

Before, the interest calculation lives on the base class but only savings accounts use it:

```ts
abstract class Account {
  interestRate(): number {
    return 0.02;
  }
}

class SavingsAccount extends Account {}

class CheckingAccount extends Account {}
```

After, the method moves down to the subclass that needs it:

```ts
abstract class Account {}

class SavingsAccount extends Account {
  interestRate(): number {
    return 0.02;
  }
}

class CheckingAccount extends Account {}
```

## Watch for

- Pushing the method down is safe only where callers already work with the specific subclass. If any
  caller reaches it through a superclass-typed reference, restructure those callers first: have the
  choice dispatch on the concrete type via
  [Replace Conditional with Polymorphism](replace-conditional-with-polymorphism.md), so no
  superclass caller is left calling a method the parent no longer offers.
