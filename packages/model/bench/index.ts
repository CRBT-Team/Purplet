import './implementations/class-assign-props';
import './implementations/class-with-raw';
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
