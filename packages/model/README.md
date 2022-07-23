# @purplet/model

This is a TS library for building rich data classes from raw json-like data, called a Model. Models made with this library are:

- Relativly Fast
- Strongly Typed
- Maintainable
- Mixable/Separable

See the `./bench` folder for details about the performance of the library. It isn't the fastest option, but it's flexibility and developer experience make up for the loss in speed.

TODO LIST:

- Allow defining a `type` property that affects which properties are visible.
- Type mixing.
- Allow mutable models, this right now is not allowed.

## Model Example

```ts
import { createModel, Model } from '@purplet/model';

// Given an interface for raw data...
interface RawSample {
  id: string;
  first_name: string;
  last_name: string;
  age: number;
  description: string;
};

// ...Create a rich class that wraps the raw data.
export const Sample = createModel((m: Model<RawSample>) =>
  m
    .copy('id')                      // copy the `.id` prop
    .copy('first_name', 'firstName') // copy `.first_name` as `.firstName`
    .copy('last_name', 'lastName')
    .copy('age')
    .copy('description')

    // Computed properties must specify their dependencies.
    .get('fullName', ['first_name', 'last_name'], self => `${self.firstName} ${self.lastName}`)

    .method('multiplyAgeBy', ['age'], (self, i: number) => self.age * i)
);

// Construct instances by passing in raw data
const test = new Sample({
  id: '1',
  first_name: 'John',
  last_name: 'Doe',
  age: 30,
  description: 'Lorem ipsum dolor sit amet',
});

test.fullName; // 'John Doe'
test.multiplyAgeBy(2); // 60
test.raw // { ... what was passed to the constructor ... }

// Create partials by using the type cast `.pick()`. These partials are *ONLY*
// type-based; the JS implementation of this returns the same exact class.
const PartialSample = Sample.pick(['id', 'first_name', 'last_name']);

const partial = new PartialSample({
  id: '1',
  first_name: 'John',
  last_name: 'Doe',
});

partial.fullName // 'John Doe'
partial.age // TS Error, undefined at runtime

// `.omit` is the opposite of `.pick`; it removes the specified properties.
const NoLastName = PartialSample.omit(['last_name']);

const partial2 = new NoLastName({
  id: '1',
  first_name: 'John',
});

partial2.id // '1'
partial2.fullName; // TS Error, "undefined undefined" at runtime
```
