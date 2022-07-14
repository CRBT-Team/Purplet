import { makeBench } from '../shared';

makeBench('Access all properties', ({ SampleA, SampleB }) => {
  const a = new SampleB({
    id: 'abc',
    value: 123,
  });

  for (let i = 0; i < 5000; i++) {
    const listOfProps = [a.id, a.value];
  }
});
