# Null Object

Functional alternative: [Option and Either](../functional-catalog/option-and-either.md#option-and-either)

## Intent

Replace repeated checks for a missing collaborator with a stand-in object that implements
the same interface and does nothing (or something harmless), so callers can treat "nothing
there" exactly like a real collaborator.

## Applicability

Use it when many callers repeat the same check for a missing collaborator before acting on it.

Reach for it when an absent object has a well-defined neutral behavior, and scattering explicit absence checks through the callers is obscuring what the code actually does.

## Consequences

- Removes repetitive absence checks: callers invoke the collaborator directly instead of
  guarding every call, so the checking logic collapses into one neutral class.
- Lets callers treat present and absent uniformly: because the null object shares the
  interface, callers cannot tell it apart and need no special case.
- Can hide genuine errors: where an absent collaborator actually signals a bug, a
  do-nothing stand-in silences it, so it fits only where the neutral behavior is truly
  correct.
- Its neutral behavior must stay neutral: every operation on the interface needs a sensible
  do-nothing form, and adding an operation later means giving the null object one too.
- Is not always warranted: introducing a null object adds a class, so it pays off only when
  the same absence check is repeated in many places; where a collaborator is optional in
  just one or two spots, an explicit check is simpler and clearer.

## Example

```ts
interface Notifier {
  send(message: string): void;
}

class EmailNotifier implements Notifier {
  private readonly sent: string[] = [];

  send(message: string): void {
    this.sent.push(message);
  }
}

// Null Object: the same interface with harmless, do-nothing behavior, so callers never
// test for an absent notifier.
class NullNotifier implements Notifier {
  send(): void {
    // intentionally does nothing
  }
}

// The service always holds a Notifier; a caller with none supplies the null object rather
// than null, so register() has no absence check.
class SignupService {
  constructor(private readonly notifier: Notifier) {}

  register(user: string): void {
    this.notifier.send(`welcome ${user}`);
  }
}

const quiet = new SignupService(new NullNotifier());
quiet.register("ada");
```

## Related patterns

- [Strategy](../gof-catalog/strategy.md#strategy): a null object behaves like a do-nothing strategy plugged in where a real behavior would go.
- [State](../gof-catalog/state.md#state): a neutral state object can play a similar role for a context that has an "inactive" state.
