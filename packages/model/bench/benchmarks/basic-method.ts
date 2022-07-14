import { makeBench } from '../shared';

makeBench('Basic method calling', ({ SampleA, SampleB }) => {
  const a = new SampleB({
    id: 'abc',
    value: 123,
  });

  for (let i = 0; i < 100; i++) {
    a.squareSelf();
  }
});
