# Introduce Polymorphic Creation with Factory Method

Use when: sibling subclasses each carry a near-identical method that differs only in the object it creates.

Direction: Towards
GoF pattern: Factory Method
Composed Fowler primitive(s): [Pull Up Method](../fowler-catalog/pull-up-method.md#pull-up-method), [Extract Function](../fowler-catalog/extract-function.md#extract-function)

## Motivation

When several subclasses in a hierarchy repeat the same method and the only thing that varies is which
concrete helper they build, that duplication hides a template: one shared method whose single varying
step is a creation. Forming that template method on the superclass and leaving each subclass only an
overridable creation method removes the duplication and lets dispatch supply the right product, so a
new variant is a new subclass rather than another near-copy. Use it once the same method is copied
across siblings and differs only at the point of creation.

## Mechanics

1. Find the method duplicated across the subclasses whose only difference is the object it creates.
2. In each subclass, extract that varying creation into a method with a common name and signature.
3. Confirm the rest of the duplicated methods are now identical; pull the shared method up onto the
   superclass, leaving the extracted creation method behind in each subclass.
4. Declare the creation method as an overridable (abstract) member on the superclass; run the tests
   after each subclass is wired.
5. Run the tests; the superclass now owns the template and each subclass owns only its creation.

## Example

Before -- two subclasses repeat the same method, differing only in the validator they build:

```ts
interface Validator {
  ok(answer: string): boolean;
}

class NonEmpty implements Validator {
  ok(answer: string): boolean {
    return answer.length > 0;
  }
}

class Numeric implements Validator {
  ok(answer: string): boolean {
    return /^[0-9]+$/.test(answer);
  }
}

abstract class Question {
  abstract accepts(answer: string): boolean;
}

class TextQuestion extends Question {
  accepts(answer: string): boolean {
    return new NonEmpty().ok(answer);
  }
}

class AgeQuestion extends Question {
  accepts(answer: string): boolean {
    return new Numeric().ok(answer);
  }
}
```

After -- the shared method is a template on the superclass; each subclass overrides only creation:

```ts
interface Validator {
  ok(answer: string): boolean;
}

class NonEmpty implements Validator {
  ok(answer: string): boolean {
    return answer.length > 0;
  }
}

class Numeric implements Validator {
  ok(answer: string): boolean {
    return /^[0-9]+$/.test(answer);
  }
}

abstract class Question {
  protected abstract createValidator(): Validator;

  accepts(answer: string): boolean {
    return this.createValidator().ok(answer);
  }
}

class TextQuestion extends Question {
  protected createValidator(): Validator {
    return new NonEmpty();
  }
}

class AgeQuestion extends Question {
  protected createValidator(): Validator {
    return new Numeric();
  }
}
```

## Watch for

- If there is no hierarchy yet -- just one class with a conditional that builds an object -- a plain
  factory function is lighter than manufacturing subclasses to hold a factory method.
