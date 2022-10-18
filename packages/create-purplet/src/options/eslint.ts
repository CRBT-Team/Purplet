import { ProjectConfig } from '../types';

export async function handleESLint(config: ProjectConfig) {
  return config.eslint
    ? (async () => {
        //
      })()
    : Promise.resolve();
}
