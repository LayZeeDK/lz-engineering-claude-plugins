# Replace Command with Function

Use when: a command object does little more than run one function, so the class is just overhead.

## Motivation

A command object earns its class when an operation is complex or needs lifecycle -- undo, queuing,
shared intermediate state. When it has shrunk to little more than a constructor and an `execute`
method with no real state or extra capability, the class is ceremony: a plain function is simpler and
clearer. This is the inverse of wrapping a function in a command; apply it once the command no longer
pays for itself.

## Mechanics

1. Seed the replacement: at a call site, apply [Extract Function](extract-function.md) to the code
   that constructs the command and calls `execute`, creating a plain function; run the tests.
2. Inline the command's helper methods into `execute` with [Inline Function](inline-function.md), so
   the whole operation sits in one place.
3. Move the constructor parameters onto `execute` and replace field reads with those parameters, via
   [Change Function Declaration](change-function-declaration.md); run the tests.
4. Move the `execute` body into the seed function and route remaining callers through it, keeping the
   command working until each is migrated; test after each.
5. When the command class is unused, remove it with [Remove Dead Code](remove-dead-code.md).
6. Run the tests.

Inverse of [Replace Function with Command](replace-function-with-command.md).

## Example

Before -- a command with no state beyond its inputs:

```ts
class RentalCharge {
  constructor(private readonly days: number, private readonly dailyRate: number) {}

  execute(): number {
    return this.days * this.dailyRate;
  }
}
```

After -- a plain function:

```ts
function rentalCharge(days: number, dailyRate: number): number {
  return days * dailyRate;
}
```
