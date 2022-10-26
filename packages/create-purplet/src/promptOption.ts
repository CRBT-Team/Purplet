import c from 'chalk';
import prompts, { PromptObject } from 'prompts';
import { cli } from '.';
import { ProjectConfig } from './types';

export async function promptOption<T extends keyof ProjectConfig>(
  optionName: T,
  data: () => PromptObject
): Promise<ProjectConfig[T]> {
  if (cli[optionName]) {
    // @ts-ignore
    return cli[optionName]!;
  }
  const prompter = await prompts({ ...data(), name: 'value' });

  if (Object.keys(prompter).length === 0) {
    console.log();
    console.log(c.redBright('Cancelled'));
    // TODO: Exit with error code only if you run it outside of npm/yarn/pnpm
    // If you exit with error code, you'll get an ungly stack trace
    process.exit(0);
  }
  return prompter.value;
}
