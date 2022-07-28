import fs from 'fs/promises';

const paths = ['builders/OptionBuilder.d.ts', 'structures/bit-field-base.d.ts'];

for (const file of paths) {
  await fs.copyFile(`./src/${file}`, `./dist/${file}`);
}
