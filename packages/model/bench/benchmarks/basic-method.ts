import { makeBenchPrep } from '../shared';

makeBenchPrep('Basic method calling', ({ SampleA, SampleB }) => {
  const a = SampleB({
    id: 'abc',
    value: 123,
  });

  return () => {
    for (let i = 0; i < 100; i++) {
      a.squareSelf();
    }
  };
});
