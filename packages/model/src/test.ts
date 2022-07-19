import { createModel, Model } from './model';

type RawSample = {
  id: string;
  first_name: string;
  last_name: string;
  age: number;
  description: string;
};

export const Sample = createModel((m: Model<RawSample>) =>
  m
    .copy('id') //
    .copy('first_name', 'firstName')
    .copy('last_name', 'lastName')
    .copy('age')
    .copy('description')

    .get('fullName', ['first_name', 'last_name'], self => {
      return `${self.firstName} ${self.lastName}`;
    })

    .method('multiplyAgeBy', ['age'], (self, i: number) => {
      return self.age * i;
    })
);

const test = new Sample({
  id: '1',
  first_name: 'John',
  last_name: 'Doe',
  age: 30,
  description: 'Lorem ipsum dolor sit amet',
});
