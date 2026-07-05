# Push Down Field

Use when: a field on the superclass is used by only one subclass (or a few), not all of them.

## Motivation

A field declared on the superclass but read or written by a single subclass advertises state that
most instances never use. Moving it down to the subclass that actually needs it keeps each class
carrying only the data it uses, and makes the hierarchy accurate about where that state lives.

## Mechanics

1. Declare the field on every subclass that uses it.
2. Remove the field from the superclass.
3. Run the tests.
4. Delete the field from any subclass that does not need it.
5. Run the tests.

Inverse of [Pull Up Field](pull-up-field.md).

## Example

Before -- the frame-rate field is on the base class but only video assets use it:

```ts
abstract class MediaAsset {
  protected frameRate = 0;
}

class VideoAsset extends MediaAsset {}

class ImageAsset extends MediaAsset {}
```

After -- the field moves down to the subclass that reads it:

```ts
abstract class MediaAsset {}

class VideoAsset extends MediaAsset {
  protected frameRate = 0;
}

class ImageAsset extends MediaAsset {}
```

## Watch for

- Confirm no superclass method still reads the field before you push it down; if one does, push that
  method down first or the superclass will not compile.
