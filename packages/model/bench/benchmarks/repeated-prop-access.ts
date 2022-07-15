import { makeBench } from '../shared';

makeBench('Repeated property access', ({ SampleA, SampleB }) => {
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

  for (let i = 0; i < 12; i++) {
    const listOfProps = [
      a.id,
      a.name,
      a.camelCase,
      a.otherNumber,
      a.subObject.value,
      a.list[0].value,
      a.list[1].value,
      a.list[2].value,
      a.flag,
    ];
  }
});
