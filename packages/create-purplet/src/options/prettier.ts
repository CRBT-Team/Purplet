import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ProjectConfig } from '../types';

export function handlePrettier(config: ProjectConfig) {
  return config.prettier
    ? (async () => {
        const ignoreEntries = ['dist', '.purplet', 'LICENSE', 'build'];
        await writeFile(join(config.root, '.prettierignore'), ignoreEntries.join('\n') + '\n');
        const configFile = {
          arrowParens: 'avoid',
          printWidth: 100,
          singleQuote: true,
          tabWidth: 2,
          trailingComma: 'es5',
        };
        await writeFile(
          join(config.root, '.prettierrc'),
          JSON.stringify(configFile, null, 2) + '\n'
        );
      })()
    : Promise.resolve();
}

export async function prettierConfig(config: ProjectConfig) {
  if (config.lang !== 'js') {
    // This config is based off of prettier-config-dave
    return {
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
}
