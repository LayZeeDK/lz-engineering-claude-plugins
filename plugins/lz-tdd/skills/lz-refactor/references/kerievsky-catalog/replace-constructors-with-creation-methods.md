# Replace Constructors with Creation Methods

Use when: a class has several constructors, or constructor calls whose arguments do not reveal which kind of instance you are asking for.

Direction: To
GoF pattern: [Creation Method](../extra-patterns-catalog/creation-method.md#creation-method) (Kerievsky's own pattern; not one of the GoF 23)
Composed Fowler primitive(s): [Change Function Declaration](../fowler-catalog/change-function-declaration.md#change-function-declaration), [Extract Function](../fowler-catalog/extract-function.md#extract-function), [Inline Function](../fowler-catalog/inline-function.md#inline-function)

## Motivation

A constructor can only be told apart from its siblings by its parameter list, so two ways of
building the same class read almost the same at the call site and force the reader to remember what
each argument position means. Replacing the raw constructor calls with named static creation methods
puts the intent back where it is read -- one clearly named method per meaningful way to build the
object -- and gives you a single place to enforce or later vary how each variant is made. Reach for
it once a class has more than one construction path, or a constructor whose arguments hide the
variant being created.

## Mechanics

1. Pick one constructor call whose purpose is unclear, and choose a name that says what kind of
   instance it produces.
2. Add a static method with that name on the class; have it forward to the constructor and return
   the result.
3. If the constructor you are replacing merely delegates to a fuller constructor, inline that
   delegation into the creation method so the method calls the fuller constructor directly.
4. Redirect the callers of that variant to the new creation method; compile and run the tests.
5. Repeat for each distinct construction intent, one variant at a time.
6. When every caller goes through a creation method, restrict the constructor (make it private);
   compile and run the tests.

## Example

Before -- two builds of the same class read the same, distinguished only by argument order:

```ts
class Discount {
  constructor(
    readonly kind: "percent" | "flat",
    readonly amount: number,
  ) {}
}

const seasonal = new Discount("percent", 15);
const coupon = new Discount("flat", 5);
```

After -- each construction path has a name; the constructor is sealed:

```ts
class Discount {
  private constructor(
    readonly kind: "percent" | "flat",
    readonly amount: number,
  ) {}

  static percentage(amount: number): Discount {
    return new Discount("percent", amount);
  }

  static flat(amount: number): Discount {
    return new Discount("flat", amount);
  }
}

const seasonal = Discount.percentage(15);
const coupon = Discount.flat(5);
```

## Watch for

- Before naming every constructor, consider whether structural extraction -- pulling a subset of
  fields into their own class, or splitting variants into subclasses -- would cut the number of
  constructors first; creation methods are for the count that genuinely remains.
- A class with a single, obvious construction gains nothing from a creation method -- leave the
  constructor public rather than add ceremony.
