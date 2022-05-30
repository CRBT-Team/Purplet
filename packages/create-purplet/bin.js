#!/usr/bin/env node
//@ts-check
// LARGELY inspired by create-svelte https://github.com/sveltejs/kit/blob/master/packages/create-svelte/bin.js

import fs from 'fs';
import path from 'path';
import prompts from 'prompts';
import chalk from 'chalk';
import ora from 'ora';
import { createPurplet } from './index.js';

const { devDependencies: deps } = JSON.parse(
  fs.readFileSync(new URL('package.json', import.meta.url), 'utf-8')
);

const crbtFace = `
....................(#(#(#(#(#(...............
..............(((((#(((((((#(((((((#(.........
...........#(((#(((#(((#(((#(((#(((#(((#......
.........((#(((((((#(((((((#(((((((#((((((....
.......#####################################..
......(((((#(((((((#(((((((#(((((((#(((((((#(.
.....((#(((#((......(((#(((#(((......((#(((#((
.....((((((#(........((((((#((........(((((#((
.#(#(#(#(#(#(#......(#(#(#(#(#(......#(#(#(#(#
.((#(....((#(((((((#(((((((#(((((((#(((((((#((
.((#(.........(#(((#(((#(((#(((#(((#(((#(((#((
.((#((...........((#............(((#(((((((#((
.######......#########........################
.((#(((((((#(((((((#(((((((#(((((((#(((((((#((
.((#.......#(((#(((#(((#(((#(((#(((#(((#(((#((
............../((((#(((((((#(((((((#(((((((#((
....................(#(#(#(#(#(#(#(#(#(#(#(#(#`;
const colored = crbtFace
  .split('')
  .map(c => chalk[c === '.' ? 'hidden' : 'magentaBright'](c))
  .join('');

const intro = `
${colored}

Welcome to ${chalk.magentaBright.bold(`Purplet`)} ${chalk.gray(
  `(v${deps.purplet.replace(/^\D+/g, '')})`
)}

${chalk.red.yellow(
  '⚠️  Purplet is still in development, so you may expect bugs and missing features.'
)}
Encountered any? Open an issue at ${chalk.cyan('https://github.com/CRBT-Team/Purplet/issues')}.
`;

const main = async () => {
  console.log(intro);

  let cwd = process.argv[2] || '.';

  if (cwd === '.') {
    const opts = await prompts([
      {
        name: 'dir',
        type: 'text',
        message: 'Where should the project be created?\n  (leave blank for current directory)',
      },
    ]);

    if (opts.dir) {
      cwd = opts.dir;
    }
  }

  if (fs.existsSync(cwd)) {
    if (fs.readdirSync(cwd).length > 0) {
      const response = await prompts({
        type: 'confirm',
        name: 'value',
        message: 'Directory not empty. Continue? (you may lose files)',
        initial: false,
      });

      if (!response.value) {
        console.log(chalk.red('Project creation aborted.'));
        process.exit(1);
      }
    }
  }

  const spinner = ora('Creating Purplet project').start();
  try {
    await createPurplet(cwd, { deps });
    spinner.succeed(chalk.bold.green('Purplet project created!'));

    console.log('\nNext steps:');
    let i = 1;
    const relative = path.relative(process.cwd(), cwd);

    if (relative !== '') {
      console.log(`  ${i++}. Go to your project with ${chalk.magentaBright(`cd ${cwd}`)}`);
    }

    console.log(`  ${i++}. Install deps with ${chalk.magentaBright('npm install')}.`);
    console.log(
      `  ${i++} Start your project on dev mode with ${chalk.magentaBright('npm run dev')}.`
    );
  } catch (err) {
    spinner.fail('Purplet project creation failed');
    console.error(chalk.red(err));
  }
};

main();
