/* eslint-disable no-console */
import c from 'chalk';
import dedent from 'dedent';
import ora from 'ora';
import path from 'path';
import yargs from 'yargs';
import { existsSync } from 'node:fs';
import { realpath } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { hideBin } from 'yargs/helpers';
import { mkdirp } from './helpers/file-stuff';
import { createConfig } from './prompts';
import { writeAll } from './writeAll';
import { version } from '../package.json';

export const cli = await yargs(hideBin(process.argv))
  .scriptName('create-purplet')
  .usage('$0 [options]')
  .version(version)
  .positional('root', {
    alias: 'r',
    describe: 'Where do you want to create your project?',
    type: 'string',
  })
  .option('allow-empty', {
    type: 'boolean',
  })
  .option('template', {
    alias: 't',
    type: 'string',
    describe: 'Which template do you want to use?',
  })
  .option('lang', {
    alias: 'l',
    type: 'string',
    describe: 'Either "ts" | "jsdoc" | "js". TS and JSDoc will enable type-checking ',
  })
  .option('eslint', {
    type: 'boolean',
  })
  .option('prettier', {
    type: 'boolean',
  })
  .option('no-install', {
    type: 'boolean',
  })
  .parse();

// Assign the first positional argument as 'root' if it is available.
if (cli._[0]) {
  cli.root = cli._[0] as string;
}

/*
Here lies my beautiful ASCII art of the Purplet logo. 
Dave does not approve of it, regardless of the beauty that it undeniably is.
Thus, I have no other choice but to comment it out and not add publish it,
So whereas this work of art is not going to ship with the create-purplet CLI,
it will forever remain deep in our hearts (and in the commit history and in the source code)

RIP Purplet ASCII logo
2022 - 2022
*/

// console.log(
//   c.magentaBright(
//     `
//                         *****
//                    ****************
//                 *********************
//               *************************
//               **************************
//              ***************************
//   ***********            ***************
// **************            **************
// ***************           **************
// *****************         **************
// *******************       **************
//               ************
//   *********   ************
//     ********  ************
//        *****  ************
//          ***  ************
// `
//   )
// );
// console.log();
console.log(c.magentaBright('Welcome to Purplet!'));
console.log(c.grey(`Next-gen framework to build modern Discord apps.`));
console.log();

console.log(c.yellowBright('⚠️  Purplet is beta software! ⚠️'));
console.log(c.yellowBright('Report issues to https://github.com/CRBT-Team/purplet/issues'));
console.log();

const cliRoot = path.resolve(fileURLToPath(import.meta.url), '../../');

let templatesRoot = [
  path.join(cliRoot, 'dist/templates'), // Published Case
  path.join(cliRoot, '../../examples'), // Monorepo case
].find(dir => existsSync(dir))!;

if (!templatesRoot) {
  console.error(c.redBright(`Could not find templates directory.`));
  console.error(c.redBright(`This is a build issue with Purplet, and should be reported to them:`));
  console.error(c.redBright(`https://github.com/CRBT-Team/purplet/issues`));
  process.exit(2);
}

templatesRoot = (await realpath(templatesRoot)) ?? templatesRoot;

const config = await createConfig(templatesRoot);

// Detect Package Manager
let packageManager = 'npm';
if (process.env.npm_config_user_agent) {
  if (process.env.npm_config_user_agent.includes('pnpm')) {
    packageManager = 'pnpm';
  } else if (process.env.npm_config_user_agent.includes('yarn')) {
    packageManager = 'yarn';
  }
}

// END OF PROMPTING
console.log();

const spinner = ora('Creating new Purplet project... May take a minute.').start();

await mkdirp(config.root);

await writeAll(config, templatesRoot);

// TODO: stylize a better readme / use from template
// await writeFile(path.join(root, 'README.md'), `# ${path.basename(root)}`);

spinner.succeed('Created Project');

console.log();
console.log(dedent`
  ${c.magentaBright.bold(
    `Your bot has been created inside of the ${path.basename(config.root)} directory.`
  )}

    ${c.whiteBright('$')} ${c.cyanBright('cd')} ${c.greenBright(
  path.relative(process.cwd(), config.root)
)}
    ${c.whiteBright('$')} ${c.cyanBright(packageManager)}${c.greenBright(
  `${packageManager === 'yarn' ? '' : ' install'}`
)}

  Before you can run your bot, you need to create an ${c.cyanBright('.env')} file with a Discord
  bot token, which can be created at ${c.magentaBright(
    'https://discord.com/developers/applications'
  )}.
  Your ${c.cyanBright('.env')} file should look something like this:

    ${c.cyanBright('DISCORD_BOT_TOKEN')}=${c.grey('<your bot token>')}

  Once that is setup, you can start developing your bot by running:

    ${c.whiteBright('$')} ${c.cyanBright(packageManager)} ${c.greenBright(
  `${packageManager === 'npm' ? 'run ' : ''}dev`
)}

  Purplet Documentation: ${c.magentaBright('https://purplet.js.org/docs/getting-started')}
  Discord Server: ${c.magentaBright('https://discord.gg/BFkHA8P7rh')}
`);
console.log();
