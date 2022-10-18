import c from 'chalk';
import path from 'node:path';
import { existsSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { checkEmpty } from './helpers/file-stuff';
import { getTemplates } from './helpers/getTemplates';
import { promptOption } from './helpers/promptOption';
import { ProjectConfig } from './types';

export async function createConfig(templatesRoot: string) {
  const config = {} as ProjectConfig;

  // Calculate initial directory based off of if this directory is 'empty' or not
  // Empty is a loose check that allows some stuff like `.git`
  const files = await readdir('.');
  const isEmpty = await checkEmpty(files);

  let initialDirectory = '';
  if (!isEmpty) {
    initialDirectory = `my-app`;
    let i = 1;
    while (files.includes(initialDirectory)) {
      initialDirectory = `my-app-${i++}`;
    }
  }

  // Prompt for initial directory
  config.root = await promptOption('root', () => ({
    type: 'text',
    name: 'value',
    message: 'Where do you want to create your project?',
    initial: `./${initialDirectory}`,
    format: (value: string) => path.resolve(value),
  }));

  // Non-empty check
  if (existsSync(config.root) && !(await checkEmpty(config.root))) {
    const confirm = await promptOption('allow-empty', () => ({
      type: 'confirm',
      name: 'value',
      message: c.redBright(
        `${
          path.relative(process.cwd(), config.root) || 'The current directory'
        } is not empty. Continue?`
      ),
      initial: false,
    }));
    if (!confirm) {
      process.exit(0);
    }
  }

  const templates = await getTemplates(templatesRoot);

  config.template = await promptOption('template', () => ({
    type: 'select',
    name: 'value',
    message: 'What template do you want to use?',
    choices: templates.map(t => ({
      title: t.title,
      description: t.description,
      value: t.name,
      selected: t.default || false,
    })),
  }));

  config.lang = await promptOption('lang', () => ({
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

  // TODO: add this properly (im not sure how to do this just yet)
  config.eslint = false;

  // config.eslint = await promptOption('eslint', () => ({
  //   type: 'toggle',
  //   name: 'value',
  //   message: 'Add ESLint for code linting?',
  //   initial: true,
  //   active: 'Yes',
  //   inactive: 'No',
  // }));

  config.prettier = await promptOption('prettier', () => ({
    type: 'toggle',
    name: 'value',
    message: 'Add Prettier for code formatting?',
    initial: true,
    active: 'Yes',
    inactive: 'No',
  }));

  return config;
}
