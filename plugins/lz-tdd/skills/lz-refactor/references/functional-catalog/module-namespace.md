# Module Namespace

Use when: a class exists only to provide one shared instance or to group related operations, and a module of functions would carry the same contract.
Correspondence: dissolves-from -> [Singleton](../gof-catalog/singleton.md#singleton), [Facade](../gof-catalog/facade.md#facade), [Inline Singleton](../kerievsky-catalog/inline-singleton.md#inline-singleton), [Limit Instantiation with Singleton](../kerievsky-catalog/limit-instantiation-with-singleton.md#limit-instantiation-with-singleton)
Keep the OO form when: you need more than one independent instance, coordinated mutable state with a lifecycle, or dependency injection that a shared module binding would make hard to vary in tests.

## Idiom

Let an ES module be the unit of grouping and of single instantiation: its top-level bindings are evaluated once and shared by every importer, and a set of exported functions is a namespace over a subsystem. No class or getInstance guard is needed to obtain one shared value or a cohesive group of operations.

## Example

Before -- a facade over a subsystem, published as a lazily created singleton:

```ts
class TemperatureSubsystem {
  toFahrenheit(celsius: number): number {
    return celsius * 1.8 + 32;
  }

  toKelvin(celsius: number): number {
    return celsius + 273.15;
  }
}

class TemperatureFacade {
  private static instance: TemperatureFacade | undefined;
  private readonly subsystem = new TemperatureSubsystem();

  private constructor() {}

  static getInstance(): TemperatureFacade {
    if (TemperatureFacade.instance === undefined) {
      TemperatureFacade.instance = new TemperatureFacade();
    }

    return TemperatureFacade.instance;
  }

  fahrenheit(celsius: number): number {
    return this.subsystem.toFahrenheit(celsius);
  }
}

const boilingF: number = TemperatureFacade.getInstance().fahrenheit(100);
```

After -- module-level functions are the facade; a module binding is the single instance:

```ts
const toFahrenheit = (celsius: number): number => celsius * 1.8 + 32;
const toKelvin = (celsius: number): number => celsius + 273.15;

// A module binding is evaluated once and shared by every importer -- the singleton.
const absoluteZeroCelsius = -273.15;

export const temperature = {
  fahrenheit: toFahrenheit,
  kelvin: toKelvin,
  absoluteZeroCelsius,
};

const boilingF: number = temperature.fahrenheit(100);
```

Same behavior; mechanics: run [Inline Singleton](../kerievsky-catalog/inline-singleton.md#inline-singleton) -- move the singleton's methods to module-level functions and its single instance to a module binding, run tests between steps.

## When each fits

### Singleton

A module binding is evaluated once per process and shared by every importer, so the single-instance guarantee comes from the module system rather than a getInstance guard; inject the value as a parameter where a test needs to vary it.

### Facade

A facade over a subsystem becomes a module that exports a few named functions, hiding the subsystem's surface behind the module boundary instead of behind an object.
