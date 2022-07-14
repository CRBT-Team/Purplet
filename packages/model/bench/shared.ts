import { bench, group } from 'mitata';

// RAW DATA

export interface RawSampleA {
  id: string;
  name: string;
  snake_case: number;
  other_number: number;
  sub_object: RawSampleB;
  list: RawSampleB[];
  flag: boolean;
}

export interface RawSampleB {
  id: string;
  value: number;
}

// RICH DATA MODELS

export interface ISampleA {
  id: string;
  name: string;
  camelCase: number;
  otherNumber: number;
  subObject: ISampleB;
  list: ISampleB[];
  flag: boolean;
  multiplyNumbers(): number;
  multiplyCamelWithSubObject(): number;
  sumOfList(): number;
  sumOfSquaredList(): number;
  multiplyListBy(n: number): ISampleB[];
}

export interface ISampleB {
  id: string;
  value: number;
  squareSelf(): number;
}

// TYPES

export interface Impl {
  SampleA: { new (raw: RawSampleA): ISampleA };
  SampleB: { new (raw: RawSampleB): ISampleB };
}

type Bench = (impl: Impl) => void;

export interface ImplMeta {
  name: string;
  impl: Impl;
}

export interface BenchMeta {
  name: string;
  bench: Bench;
}

export let impls: ImplMeta[] = [];
export let benches: BenchMeta[] = [];

export function addImpl(name: string, impl: Impl) {
  impls.push({ name, impl });
}

export function makeBench(name: string, fn: Bench) {
  group(name, () => {
    for (const { name, impl } of impls) {
      bench(name, () => fn(impl));
    }
  });
  benches.push({ name, bench: fn });
}

export function beforeRun() {
  if (benches.length > 1) {
    group('all benchmarks combined', () => {
      for (const { name, impl } of impls) {
        bench(name, () => {
          for (const { name, bench } of benches) {
            bench(impl);
          }
        });
      }
    });
  }
}
