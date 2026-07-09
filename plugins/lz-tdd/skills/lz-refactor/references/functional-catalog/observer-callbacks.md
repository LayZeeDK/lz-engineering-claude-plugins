# Observer Callbacks

Use when: one object needs to tell an open-ended set of interested parties that something changed, and those parties should not be coupled to the notifier's concrete type.
Correspondence: dissolves-from -> [Observer](../gof-catalog/observer.md#observer), [Replace Hard-Coded Notifications with Observer](../kerievsky-catalog/replace-hard-coded-notifications-with-observer.md#replace-hard-coded-notifications-with-observer)
Keep the OO form when: an observer owns identity or coordinated mutable state, the notification path sits on a measured hot path, subscriber variants churn constantly, or the surrounding house style is object-oriented.

## Idiom

Observer connects a subject to observer objects that each expose an update method the subject calls on change. Because an observer's update method carries no state of its own, it can be a plain function instead of an object: the subject keeps a list of listener callbacks, subscribing pushes a function and hands back a closure that removes it, and a change simply invokes each listener. An event stream or `EventTarget` is the same shape when the wiring is richer.

## Example

Before, a subject holds observer objects and calls `update` on each:

```ts
interface Observer {
  update(temperature: number): void;
}

class WeatherStation {
  private readonly observers: Observer[] = [];

  setTemperature(value: number): void {
    for (const observer of this.observers) {
      observer.update(value);
    }
  }

  addObserver(observer: Observer): void {
    this.observers.push(observer);
  }
}

class Display implements Observer {
  last = 0;

  update(temperature: number): void {
    this.last = temperature;
  }
}
```

After, the subject holds listener functions and returns an unsubscribe closure:

```ts
type Listener = (temperature: number) => void;

function createWeatherStation() {
  const listeners = new Set<Listener>();

  return {
    subscribe(listener: Listener): () => void {
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    },
    setTemperature(value: number): void {
      for (const listener of listeners) {
        listener(value);
      }
    },
  };
}
```

Same behavior; mechanics: [Replace Command with Function](../fowler-catalog/replace-command-with-function.md#replace-command-with-function), run tests between steps.

## When each fits

Callbacks fit when notification is the whole relationship and you want subscribers decoupled from the subject's type. Keep the unsubscribe closure the subscribe call returns, so listeners can detach and you avoid leaks from long-lived subjects. Once the event graph turns complex (many interdependent sources, backpressure, cancellation, or replay), reach for a reactive-stream library rather than hand-rolling that machinery on top of raw callbacks; that is a dependency decision, not a language built-in.
