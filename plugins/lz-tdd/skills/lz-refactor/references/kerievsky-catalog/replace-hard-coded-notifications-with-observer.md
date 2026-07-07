# Replace Hard-Coded Notifications with Observer

Use when: a class notifies a fixed, named set of dependents by calling each one directly whenever its state changes.

Direction: To/Towards
GoF pattern: [Observer](../gof-catalog/observer.md#observer)
Composed Fowler primitive(s): [Move Function](../fowler-catalog/move-function.md#move-function), [Pull Up Method](../fowler-catalog/pull-up-method.md#pull-up-method), [Change Function Declaration](../fowler-catalog/change-function-declaration.md#change-function-declaration)

## Motivation

When a subject holds references to each dependent it must tell about a change and calls them by name, it
is coupled to exactly those dependents: adding another means editing the subject, wiring a new field, and
adding another call. The subject knows too much about who is listening. Introducing an observer inverts
that: the subject keeps a list of observers behind a small interface and, on a change, notifies whoever
registered -- without naming any of them. Dependents subscribe and unsubscribe on their own, and the
subject's notification code stops growing with the audience. Reach for it once dependents come and go, or
the list of things to notify keeps expanding.

## Mechanics

1. Separate the notifying object's own work from its update-triggering, moving any non-notification
   behavior off the notification path with
   [Move Function](../fowler-catalog/move-function.md#move-function) so what remains only notifies.
2. Define an observer interface with the update method and give the dependents that method with
   [Change Function Declaration](../fowler-catalog/change-function-declaration.md#change-function-declaration)
   so they all conform to it.
3. Give the subject a collection of observers with register and unregister methods, and pull the
   notification responsibility up onto the subject with
   [Pull Up Method](../fowler-catalog/pull-up-method.md#pull-up-method) so notification lives on the
   subject rather than being wired per-dependent.
4. Replace the named direct calls with a single loop that notifies each registered observer, and have the
   former hard-coded dependents subscribe themselves; compile and run the tests.
5. Run the tests and confirm every dependent is still notified on a change.

## Example

Before -- the thermostat names each dependent it updates:

```ts
interface Observer {
  notify(temperature: number): void;
}

class Thermostat {
  private current = 0;
  constructor(
    private readonly panel: Observer,
    private readonly logger: Observer,
  ) {}
  set(temperature: number): void {
    this.current = temperature;
    this.panel.notify(temperature);
    this.logger.notify(temperature);
  }
}
```

After -- the thermostat notifies whoever subscribed:

```ts
interface Observer {
  notify(temperature: number): void;
}

class Thermostat {
  private current = 0;
  private readonly observers: Observer[] = [];
  subscribe(observer: Observer): void {
    this.observers.push(observer);
  }
  set(temperature: number): void {
    this.current = temperature;
    for (const observer of this.observers) {
      observer.notify(temperature);
    }
  }
}
```

## Watch for

- Add the observer indirection only when dependents actually change or multiply; for one or two fixed,
  always-present dependents a direct call is clearer, and routing every notification through a subscriber
  list hides a wiring you could otherwise read straight from the change method.
- An observer that updates state which triggers further notifications can set off cascading updates that
  are hard to trace; and observers that are never unregistered keep the subject holding references to
  them, leaking objects that should have been collected.
