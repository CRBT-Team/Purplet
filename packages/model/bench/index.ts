import './implementations/class-assign-props';
import './implementations/class-with-raw';
import './implementations/function-return-obj';
import './implementations/lazy-proto';
import './implementations/lazy-proto-with-inlining';
import './implementations/function-return-lazy-proto';
import './benchmarks/basic-construction';
import './benchmarks/basic-prop-access';
import './benchmarks/repeated-prop-access';
import './benchmarks/basic-method';
import { run } from 'mitata';
import { beforeRun } from './shared';

beforeRun();

await run({
  percentiles: false,
});
