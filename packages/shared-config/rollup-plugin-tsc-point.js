import { writeFileSync } from 'fs';

export default function dtsPoint() {
  return {
    name: 'rollup-plugin-tsc-point',
    options(opts) {
      if (!opts.watch) {
        return;
      }
      for (const [name, input] of Object.entries(opts.input)) {
        writeFileSync(`dist/${name}.d.ts`, `export * from '../${input.replace(/\.ts$/, '')}';`);
      }
    },
  };
}
