import c from 'chalk';
import dedent from 'dedent';
import minimatch from 'minimatch';
import ora from 'ora';
import path from 'path';
import prompt, { PromptObject } from 'prompts';
import sortPackageJSON from 'sort-package-json';
import yargs from 'yargs';
import { spawn } from 'child_process';
import { existsSync } from 'fs';
import { copyFile, mkdir, readdir, readFile, stat, writeFile } from 'fs/promises';
import { createRequire } from 'module';
import { format } from 'prettier';
import { fileURLToPath } from 'url';
import { hideBin } from 'yargs/helpers';
import pkg from '../package.json';

const require = createRequire(import.meta.url);

const cliFlags = await yargs(hideBin(process.argv))
  .scriptName('create-purplet')
  .usage('$0 [options]')
  .version(pkg.version)
  .option('root', {
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
  .parse();

console.log(c.magentaBright.bold(`Welcome to Purplet!`));
console.log(c.grey(`docs & help: https://purplet.js.org`));
console.log();

console.log(c.yellowBright('⚠️  Purplet is beta software! ⚠️'));
console.log(c.yellowBright('Report issues to https://github.com/CRBT-Team/purplet/issues'));
console.log();

const cliRoot = path.resolve(fileURLToPath(import.meta.url), '../../');
const templatesRoot = [
  path.join(cliRoot, 'templates'), // Published Case
  path.join(cliRoot, '../../examples'), // Monorepo case
].find(dir => existsSync(dir));

if (!templatesRoot) {
  console.error(c.redBright(`Could not find templates directory.`));
  console.error(c.redBright(`This is a build issue with Purplet, and should be reported to them:`));
  console.error(c.redBright(`https://github.com/CRBT-Team/purplet/issues`));
  process.exit(2);
}

async function doPrompt<T extends keyof typeof cliFlags>(
  flagName: T,
  data: () => PromptObject
): Promise<Exclude<typeof cliFlags[T], null | undefined>> {
  if (cliFlags[flagName]) {
    return cliFlags[flagName]!;
  }
  const promptObj = await prompt({ ...data(), name: 'value' });
  if (Object.keys(promptObj).length === 0) {
    console.log();
    console.log(c.redBright('Cancelled'));
    // TODO: Exit with error code only if you run it outside of npm/yarn/pnpm
    // If you exit with error code, you'll get an ungly stack trace
    process.exit(0);
  }
  return promptObj.value;
}

const allowedFiles = [
  //
  '.git',
  '.gitignore',
  '.gitattributes',
  '.gitmodules',
  '.DS_Store',
  '.env',
];

async function checkEmpty(root: string | string[]) {
  const files = Array.isArray(root) ? root : await readdir(root);
  return files.every(file => allowedFiles.includes(file));
}

// Calculate initial directory based off of if this directory is 'empty' or not
// Empty is a loose check that allows some stuff like `.git`
const files = await readdir('.');
const isEmpty = await checkEmpty(files);

let initialDirectory = '';
if (!isEmpty) {
  initialDirectory = `my-bot`;
  let i = 1;
  while (files.includes(initialDirectory)) {
    initialDirectory = `my-bot-${i++}`;
  }
}

// Prompt for initial directory
const root = await doPrompt('root', () => ({
  type: 'text',
  name: 'value',
  message: 'Where do you want to create your project?',
  initial: `./${initialDirectory}`,
  format: (value: string) => path.resolve(value),
}));

if (existsSync(root) && !(await checkEmpty(root))) {
  const confirm = await doPrompt('allow-empty', () => ({
    type: 'confirm',
    name: 'value',
    message: c.redBright(
      `${path.relative(process.cwd(), root) || 'The current directory'} is not empty. Continue?`
    ),
    initial: false,
  }));
  if (!confirm) {
    process.exit(0);
  }
}

const templateNames = await readdir(templatesRoot);
const templateJSON = (
  await Promise.all(
    templateNames.map(async template => {
      try {
        return {
          name: template,
          ...JSON.parse(
            await readFile(path.join(templatesRoot, template, '.template.json'), 'utf-8')
          ),
        };
      } catch (error) {
        return null;
      }
    })
  )
).filter(Boolean);

const template = await doPrompt('template', () => ({
  type: 'select',
  name: 'value',
  message: 'What template do you want to use?',
  choices: templateJSON.map(({ title, description, name }) => ({
    title,
    description,
    value: name,
    selected: name === 'basic',
  })),
}));

const lang = await doPrompt('lang', () => ({
  type: 'select',
  name: 'value',
  message: 'Add type checking with TypeScript?',
  choices: [
    { title: 'Yes, using TypeScript syntax', value: 'ts' },
    { title: 'Yes, using JavaScript with JSDoc comments', value: 'jsdoc' },
    { title: 'No', value: 'js' },
  ],
  initial: 0,
}));

const eslint = await doPrompt('eslint', () => ({
  type: 'toggle',
  name: 'value',
  message: 'Add ESLint for code linting?',
  initial: true,
  active: 'Yes',
  inactive: 'No',
}));

const prettier = await doPrompt('prettier', () => ({
  type: 'toggle',
  name: 'value',
  message: 'Add Prettier for code formatting?',
  initial: true,
  active: 'Yes',
  inactive: 'No',
}));

let packageManager = 'npm';
if (process.env.npm_config_user_agent) {
  if (process.env.npm_config_user_agent.includes('pnpm')) {
    packageManager = 'pnpm';
  } else if (process.env.npm_config_user_agent.includes('yarn')) {
    packageManager = 'yarn';
  }
}

// If not found, attempt to find an *installed* package manager
if (packageManager === 'npm') {
  function hasGlobalInstallation(pm: string): Promise<boolean> {
    const proc = spawn(pm, ['--version']);
    return new Promise((resolve, reject) => {
      let data = '';
      proc.stdout.on('data', chunk => (data += chunk.toString()));
      proc.on('error', reject);
      proc.on('exit', (code, signal) => {
        if (code === 0) {
          if (data.trim()) {
            resolve(true);
            return;
          }
        }
        resolve(false);
      });
    });
  }

  const [pnpm, yarn] = await Promise.all([
    hasGlobalInstallation('pnpm'),
    hasGlobalInstallation('yarn'),
  ]);

  if (pnpm) {
    packageManager = 'pnpm';
  } else if (yarn) {
    packageManager = 'yarn';
  }
}

packageManager = 'yarn';

if (packageManager === 'npm') {
  // TODO: Attempt to convince user to try another package manager
  console.log('todo npm');
  process.exit(3);
}

// END OF PROMPTING

console.log(
  `${c.cyanBright.bold('note')}: will be using '${c.magentaBright(
    packageManager
  )}' to install dependencies.`
);
console.log();

const spinner = ora('Creating purplet project... May take a minute.').start();

async function mkdirp(root: string) {
  try {
    await mkdir(root, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}

await mkdirp(root);

/** Async copy recursive, ignoring content in `.ignore` and `.gitignore` */
// TODO: use a better matching system since this has no caching at all for the matchers. It's not
// a huge deal since it still runs nearly instantly on my computer, but it would be better code.
async function copy(
  src: string,
  dest: string,
  copySingleFile: (src: string, dest: string) => Promise<void>,
  ignore: string[] = []
) {
  const stats = await stat(src);
  if (stats.isDirectory()) {
    let ignoredPaths = ignore.concat();
    const ignoreFiles = [path.join(src, '.ignore'), path.join(src, '.gitignore')];

    await Promise.all(
      ignoreFiles.map(async ignoreFile => {
        if (existsSync(ignoreFile)) {
          ignoredPaths = ignoredPaths.concat(
            (await readFile(ignoreFile, 'utf-8'))
              .split('\n')
              .filter(x => !x.startsWith('#') && x.trim())
              .map(x => path.join(src, '**', x).replace(/\\/g, '/').replace(/\/$/, ''))
          );
        }
      })
    );

    await mkdirp(dest);
    const files = (await readdir(src)).filter(file =>
      ignoredPaths.every(pattern => {
        return !minimatch(path.join(src, file), pattern);
      })
    );
    await Promise.all(
      files.map(async file => {
        await copy(path.join(src, file), path.join(dest, file), copySingleFile, ignoredPaths);
      })
    );
  } else {
    await copySingleFile(src, dest);
  }
}

const tsToJsdoc = path.join(require.resolve('ts-to-jsdoc/bin/ts-to-jsdoc.js'));

let prettierConfig = {};
if (lang === 'jsdoc' || lang === 'ts') {
  // This config is based off of prettier-config-dave
  prettierConfig = {
    arrowParens: 'avoid',
    bracketSameLine: true,
    bracketSpacing: true,
    embeddedLanguageFormatting: 'auto',
    endOfLine: 'auto',
    htmlWhitespaceSensitivity: 'css',
    jsxSingleQuote: true,
    printWidth: 100,
    proseWrap: 'always',
    quoteProps: 'as-needed',
    semi: true,
    singleQuote: true,
    tabWidth: 2,
    trailingComma: 'es5',
    jsdocAddDefaultToDescription: false,
    jsdocCapitalizeDescription: true,
    jsdocDescriptionTag: false,
    jsdocDescriptionWithDot: true,
    jsdocKeepUnParseAbleExampleIndent: false,
    jsdocParser: true,
    jsdocPreferCodeFences: true,
    jsdocSeparateReturnsFromParam: false,
    jsdocSeparateTagGroups: true,
    jsdocSingleLineComment: true,
    jsdocSpaces: 1,
    jsdocVerticalAlignment: false,
    tsdoc: true,
    plugins: [
      await import('prettier-plugin-jsdoc'),
      await import('@mattinton/prettier-plugin-tidy-imports'),
    ],
  } as any;
}

const copyPromise = copy(
  path.join(templatesRoot, template),
  root,
  async (src, dest) => {
    if (src.endsWith('.ts')) {
      if (lang === 'jsdoc') {
        dest = dest.replace(/\.ts$/, '.js');

        const proc = spawn('node', [tsToJsdoc, src, '-o', path.dirname(dest), '-f'], {
          stdio: 'pipe',
        });
        await new Promise(resolve => proc.on('exit', resolve));

        const contents = await readFile(dest, 'utf-8');
        await writeFile(
          dest,
          format(contents, { filepath: dest, ...prettierConfig }).replace(
            /(import.*;\n)(?!import)/,
            '$1\n'
          )
        );

        return;
      }
    }
    return copyFile(src, dest);
  },
  ['**/.template.json', '**/package.json', '**/pnpm-lock.yaml']
);

const templatePackageJSON = require(path.join(templatesRoot, template, 'package.json'));
const packageJSON = {
  ...templatePackageJSON,
  name: path
    .basename(path.dirname(root))
    .replace(/[^a-z0-9_-]/gi, '-')
    .replace(/^-+|(-)-+|-+$/g, '$1'),
  version: '1.0.0',
};
packageJSON.dependencies.purplet = 'next'; // TODO: change to 'latest' when we release 2.0.0

await writeFile(
  path.join(root, 'package.json'),
  JSON.stringify(sortPackageJSON(packageJSON), null, 2)
);

const installPromise = new Promise(resolve => {
  const proc = spawn(packageManager, ['install'], {
    cwd: root,
    stdio: 'ignore',
  });
  proc.on('exit', resolve);
});

await Promise.all([copyPromise, installPromise]);

spinner.succeed('Created project');

console.log();
console.log(dedent`
  ${c.magentaBright.bold(`Your bot has been created inside of the ${path.basename(root)}`)} folder.

    ${c.whiteBright('$')} ${c.cyanBright('cd')} ${c.greenBright(path.relative(process.cwd(), root))}

  Before you can run your bot, you need to create an ${c.cyanBright('.env')} file with a Discord
  bot token, which can be created at ${c.magentaBright(
    'https://discordapp.com/developers/applications'
  )}.
  Your ${c.cyanBright('.env')} file should look something like this:

    ${c.cyanBright('DISCORD_BOT_TOKEN')}=${c.grey('<your bot token>')}

  Once that is setup, you can start developing your bot by running:

    ${c.whiteBright('$')} ${c.cyanBright(packageManager)} ${c.greenBright(
  `${packageManager === 'npm' ? 'run ' : ''}dev`
)}

  Purplet Documentation: ${c.magentaBright('https://purplet.js.org/docs/getting-started')}
  Discord Server: ${c.magentaBright('http://crbt.app/discord')}
`);
