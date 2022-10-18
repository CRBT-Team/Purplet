import path from 'node:path';
import { spawn } from 'node:child_process';
import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { format } from 'prettier';
import { sortPackageJson } from 'sort-package-json';
import { copy } from './helpers/file-stuff';
import { handleESLint } from './options/eslint';
import { handlePrettier, prettierConfig } from './options/prettier';
import { ProjectConfig } from './types';

export async function writeAll(config: ProjectConfig, templatesRoot: string) {
  const { eslint, prettier, root, template } = config;

  const require = createRequire(import.meta.url);

  const templatePackageJSON = require(path.join(templatesRoot, template, 'package.json'));
  const packageJSON = {
    ...templatePackageJSON,
    name: path
      .basename(path.dirname(root))
      .replace(/[^a-z0-9_-]/gi, '-')
      .replace(/^-+|(-)-+|-+$/g, '$1'),
    version: '1.0.0',
  };

  packageJSON.dependencies.purplet = 'next';

  if (prettier) {
    packageJSON.dependencies.prettier = '^2.7.1';
    packageJSON.scripts.format = 'prettier --write "**/*.{ts,ts,js,md,json}"';
  }
  if (eslint) {
    packageJSON.dependencies.eslint = 'latest';
    packageJSON.scripts.lint = 'eslint src/**/*.{js,ts}';
  }

  const tsToJsdoc = path.join(require.resolve('ts-to-jsdoc/bin/ts-to-jsdoc.js'));

  await handlePrettier(config);
  await handleESLint(config);

  await copy(
    path.join(templatesRoot, config.template),
    config.root,
    async (src, dest) => {
      // For ts files without the ts lang set, transpile them to JavaScript.
      // This might sound like it produces bad looking output, but combined with the prettier
      // formatter, it actually is really usable.
      if (src.endsWith('.ts') && config.lang !== 'ts') {
        dest = dest.replace(/\.ts$/, '.js');

        // tsToJsdoc is sync, meaning it will freeze the spinner, and in general take longer.
        const proc = spawn('node', [tsToJsdoc, src, '-o', path.dirname(dest), '-f'], {
          stdio: 'pipe',
        });
        await new Promise(resolve => proc.on('exit', resolve));

        // Run Prettier to fix the formatting. Prettier is sync and can sometimes cause spinner jitter
        // but its overall okay. I am certainly not going to add multi-threadedness to this lol.
        const contents = await readFile(dest, 'utf-8');
        await writeFile(
          dest,
          format(contents, { filepath: dest, ...(await prettierConfig(config)) }).replace(
            /(import.*;\n)(?!import)/,
            '$1\n'
          )
        );

        return undefined;
      }
      return copyFile(src, dest);
    },
    ['.template.json', 'package.json', 'pnpm-lock.yaml', '.env']
  );

  await writeFile(
    path.join(config.root, 'package.json'),
    JSON.stringify(sortPackageJson(packageJSON), null, 2)
  );

  // TODO: properly handle this in templates. the issue is npm publish will strip the gitignore file
  await writeFile(
    path.join(config.root, '.gitignore'),
    `# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
node_modules

# testing
coverage

# build
.purplet
dist/

# misc
.DS_Store
*.pem

# debug
*debug*.log*

# env files
.env
*.env.*
`
  );
}
