# Reducer and Store

Use when: several components coordinate through a central object and you want their state transitions to be pure, replayable, and testable in isolation.
Correspondence: dissolves-from -> [Mediator](../gof-catalog/mediator.md#mediator)
Keep the OO form when: the coordinator owns identity or coordinated mutable state, sits on a measured hot path, faces constant new-variant churn (the expression problem), or the surrounding house style is object-oriented.

## Idiom

A Mediator centralizes how a group of components coordinate so they need not reference each other directly. That coordination collapses into a single pure reducer `(state, action) -> state` plus a small store that holds the current value and notifies subscribers when it changes. Every "when this happens, update that" rule lives in one switch over action tags; the store is the only cell that mutates, and it does so by replacing the whole value.

## Example

Before -- a mediator object routes changes between two form fields and a button:

```ts
interface Component {
  setEnabled(on: boolean): void;
}

class SubmitButton implements Component {
  enabled = false;

  setEnabled(on: boolean): void {
    this.enabled = on;
  }
}

class DialogMediator {
  private nameFilled = false;
  private termsAccepted = false;

  constructor(private readonly submit: SubmitButton) {}

  changed(field: "name" | "terms", value: boolean): void {
    if (field === "name") {
      this.nameFilled = value;
    } else {
      this.termsAccepted = value;
    }

    this.submit.setEnabled(this.nameFilled && this.termsAccepted);
  }
}
```

After -- one pure reducer folds actions into state; a store holds the value:

```ts
type State = { nameFilled: boolean; termsAccepted: boolean };

type Action =
  | { tag: "name"; value: boolean }
  | { tag: "terms"; value: boolean };

function reduce(state: State, action: Action): State {
  switch (action.tag) {
    case "name":
      return { ...state, nameFilled: action.value };
    case "terms":
      return { ...state, termsAccepted: action.value };
  }
}

const submitEnabled = (state: State): boolean =>
  state.nameFilled && state.termsAccepted;

let state: State = { nameFilled: false, termsAccepted: false };

function dispatch(action: Action): boolean {
  state = reduce(state, action);

  return submitEnabled(state);
}
```

Same behavior; mechanics: [Combine Functions into Transform](../fowler-catalog/combine-functions-into-transform.md#combine-functions-into-transform), run tests between steps.

## When each fits

Reach for a reducer and store when state transitions are the real coordination and you want them replayable, serializable, and unit-testable apart from any UI. The God-object risk does not disappear -- it moves into a reducer that can grow just as large, so split the reducer by feature once it sprawls. Coordinating long-lived stateful actors -- timers, sockets, retries -- does not belong inside the pure reducer; relocate those to an effect or subscription layer that sits outside it and only dispatches actions back in.
