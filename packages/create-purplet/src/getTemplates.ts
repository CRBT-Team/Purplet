import path from 'node:path';
import { readdir, readFile } from 'node:fs/promises';
import { ProjectTemplate } from './types';

export async function getTemplates(templatesRoot: string): Promise<ProjectTemplate[]> {
  const templateNames = await readdir(templatesRoot);

  return (
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
}
