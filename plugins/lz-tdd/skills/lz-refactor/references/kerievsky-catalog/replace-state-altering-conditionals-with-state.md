# Replace State-Altering Conditionals with State

Use when: conditionals scattered through a class both decide what it may do now and choose which state it moves to next.

Direction: To/Towards
GoF pattern: [State](../gof-catalog/state.md#state)
Composed Fowler primitive(s): [Replace Primitive with Object](../fowler-catalog/replace-primitive-with-object.md#replace-primitive-with-object), [Replace Type Code with Subclasses](../fowler-catalog/replace-type-code-with-subclasses.md#replace-type-code-with-subclasses), [Replace Conditional with Polymorphism](../fowler-catalog/replace-conditional-with-polymorphism.md#replace-conditional-with-polymorphism)

## Motivation

When an object tracks its condition with a flag or code and guards every operation with "if we are in this
state" checks that also reassign the flag, the transition rules end up smeared across many methods and no
single place tells you which moves are legal from where. Giving each state its own object -- one that
answers the operations and returns the state to move to -- collects each state's rules in one class and
turns an illegal transition into a method that simply does not advance. The host delegates to its current
state object and replaces it with whatever that object returns. Reach for it once the state-checking
conditionals are duplicated across operations or the legal transitions are hard to see at a glance.

## Mechanics

1. Turn the state field into its own object with
   [Replace Primitive with Object](../fowler-catalog/replace-primitive-with-object.md#replace-primitive-with-object),
   and define a state interface with one method per state-dependent operation.
2. Extract one subclass per state value with
   [Replace Type Code with Subclasses](../fowler-catalog/replace-type-code-with-subclasses.md#replace-type-code-with-subclasses),
   moving each guard's body into the matching state.
3. Pass the host into each state method so a state can guard on the host's data, mutate it, run any side
   effect, and set the next state; a state that must not advance leaves the host's state unchanged.
4. Have each host operation delegate to its current state object; compile and run the tests.
5. Remove the now-unused flag and the state-checking conditionals, letting the polymorphic dispatch stand
   in for them
   ([Replace Conditional with Polymorphism](../fowler-catalog/replace-conditional-with-polymorphism.md#replace-conditional-with-polymorphism)).
6. Run the tests and confirm each transition lands in the expected state.

## Example

Before -- each operation checks and reassigns the phase flag:

```ts
type Phase = "idle" | "running" | "done";

class Job {
  private phase: Phase = "idle";

  start(): void {
    if (this.phase === "idle") {
      this.phase = "running";
    }
  }

  finish(): void {
    if (this.phase === "running") {
      this.phase = "done";
    }
  }
}
```

After -- each state object receives the job, guards the operation, and sets the next state:

```ts
interface JobState {
  start(job: Job): void;
  finish(job: Job): void;
}

const done: JobState = { start: () => {}, finish: () => {} };
const running: JobState = { start: () => {}, finish: (job) => { job.state = done; } };
const idle: JobState = { start: (job) => { job.state = running; }, finish: () => {} };

class Job {
  state: JobState = idle;

  start(): void {
    this.state.start(this);
  }

  finish(): void {
    this.state.finish(this);
  }
}
```

For a fuller example showing state-dependent behavior, guards, and side effects across states, see the
[walkthrough](replace-state-altering-conditionals-with-state-walkthrough.md).

## Watch for

- If only one operation ever inspects the flag, a single conditional may be clearer than a set of state
  objects -- introduce State when the transition logic is genuinely spread out.
