# Replace State-Altering Conditionals with State walkthrough

This walkthrough expands the compact example in
[Replace State-Altering Conditionals with State](replace-state-altering-conditionals-with-state.md#replace-state-altering-conditionals-with-state).
The leaf's before/after shows only the transitions; the teaching this refactoring is really about lives
in the intermediate states: each state guards which operations are legal, runs its own side effect, and
answers state-dependent queries. This fuller example keeps all three so the shift is visible.

## Starting point: one class, conditionals everywhere

A job moves through idle, running, and done. Each operation first checks the current phase (a guard),
then records what it did (a side effect), then advances the phase. A query, `status`, also depends on the
phase. The phase checks and reassignments are smeared across every method:

```ts
class Job {
  private phase: "idle" | "running" | "done" = "idle";
  readonly log: string[] = [];

  start(): void {
    if (this.phase === "idle") {
      this.log.push("started");
      this.phase = "running";
    }
  }

  finish(): void {
    if (this.phase === "running") {
      this.log.push("finished");
      this.phase = "done";
    }
  }

  status(): string {
    return this.phase;
  }
}
```

Reading it, you cannot see at a glance which moves are legal from where: the transition rules are spread
across the guards, and adding a phase means editing every method.

## After: each state owns its rules

Give each state a class that answers the operations. A state receives the job so it can guard, mutate the
job's data, fire the side effect, and set the next state; a state that must not advance simply leaves the
job's state alone. The `status` query becomes state-dependent behavior each class returns for itself:

```ts
interface JobState {
  start(job: Job): void;
  finish(job: Job): void;
  status(): string;
}

class Done implements JobState {
  start(_job: Job): void {}
  finish(_job: Job): void {}
  status(): string {
    return "done";
  }
}

class Running implements JobState {
  start(_job: Job): void {}
  finish(job: Job): void {
    job.log.push("finished");
    job.state = new Done();
  }
  status(): string {
    return "running";
  }
}

class Idle implements JobState {
  start(job: Job): void {
    job.log.push("started");
    job.state = new Running();
  }
  finish(_job: Job): void {}
  status(): string {
    return "idle";
  }
}

class Job {
  state: JobState = new Idle();
  readonly log: string[] = [];

  start(): void {
    this.state.start(this);
  }

  finish(): void {
    this.state.finish(this);
  }

  status(): string {
    return this.state.status();
  }
}
```

Now each state's legal moves, its side effect, and its query answer sit together in one class. An illegal
move is just a method that leaves the job's state unchanged, and adding a phase is adding a class rather
than editing every guard.
