import { makeBench } from '../shared';

makeBench('Basic method calling', ({ SampleA, SampleB }) => {
  const a = SampleA({
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

  for (let i = 0; i < 5000; i++) {
    a.multiplyNumbers();
    a.multiplyCamelWithSubObject();
    a.sumOfList();
    a.sumOfSquaredList();
  }
});
