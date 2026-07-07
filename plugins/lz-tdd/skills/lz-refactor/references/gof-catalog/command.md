# Command

Also known as: Action, Transaction

## Intent

Turn a request into a standalone object, so requests can be passed as arguments, held in
a queue, recorded for later, or reversed, and the code that triggers a request is kept
separate from the code that carries it out.

## Applicability

Use it when you want to parameterize objects by an action to perform, treating the action itself as a value you can pass around.

Reach for it when you want to specify, queue, and execute requests at different times; when you need to support undo; when you want to log requests so the system can be recovered and the work replayed after a crash; or when you want to structure a system around high-level operations built from primitive ones.

## Consequences

- Decouples the object that invokes an operation from the one that knows how to carry it
  out, so the invoker deals only with the command interface.
- Makes commands first-class objects: they can be passed, stored, and extended like any
  other object, which is what lets requests be queued, logged, and replayed.
- Supports composition into larger commands: primitive commands can be assembled into a
  macro command, itself a command.
- Makes new commands easy to add: because adding one is a new class rather than a change
  to existing code, the invoker and receivers are untouched.
- Modern status: some Command uses have been absorbed by declarative meta-programming.
  JUnit 3 modeled each test as a command object (a test case with a run method that the
  framework invoked), whereas JUnit 4 replaced those explicit command objects with
  annotation-driven test methods discovered by the runner.

## Example

```ts
// Command: declares the execution interface, decoupling invoker from receiver.
interface Command {
  execute(): void;
}

// Receiver: knows how to perform the concrete work.
class MailService {
  private readonly outbox: string[] = [];

  deliver(recipient: string): void {
    this.outbox.push(recipient);
  }
}

// Concrete Command: binds a receiver to an action and its parameters.
class SendMailCommand implements Command {
  constructor(
    private readonly service: MailService,
    private readonly recipient: string,
  ) {}

  execute(): void {
    this.service.deliver(this.recipient);
  }
}

// Invoker: stores and triggers commands without knowing what they do.
class JobQueue {
  private readonly jobs: Command[] = [];

  submit(command: Command): void {
    this.jobs.push(command);
  }

  run(): void {
    for (const job of this.jobs) {
      job.execute();
    }
  }
}

const queue = new JobQueue();
queue.submit(new SendMailCommand(new MailService(), "ops-team"));
queue.run();
```

## Related patterns

- [Composite](composite.md#composite): a macro command that runs a sequence of commands is a composite of commands.
- [Memento](memento.md#memento): can hold the state a command needs to undo its effect.
- [Prototype](prototype.md#prototype): a command that must be copied before being placed on a history list can be cloned.
