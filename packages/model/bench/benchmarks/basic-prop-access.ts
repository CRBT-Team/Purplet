import { makeBench } from '../shared';

makeBench('Basic property access', ({ SampleA, SampleB }) => {
  const a = new SampleA({
    id: '1',
    name: 'foo',
    snake_case: 1,
    other_number: 2,
    sub_object: {
      id: '2',
      value: 3,
    },
    list: [
      {
        id: '3',
        value: 4,
      },
      {
        id: '4',
        value: 5,
      },
      {
        id: '6',
        value: -4,
      },
    ],
    flag: true,
  });

  const listOfProps = [a.id, a.name, a.name, a.camelCase];
});
