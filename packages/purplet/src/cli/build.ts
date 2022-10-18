import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import fs from 'fs/promises';
import path from 'path';
import externalPlugin from 'rollup-plugin-all-external';
import esbuild from 'rollup-plugin-esbuild';
import { Logger, Spinner } from '@paperdave/logger';
import { asyncIterToArray, pathExists, walk } from '@paperdave/utils';
import { spawnSync } from 'child_process';
import { createRequire } from 'module';
import { rollup, VERSION as rollupVersion } from 'rollup';
import { loadConfig } from '../config';
import type { FeatureScan } from '../internal';
import { rollupPluginFeatureArray } from '../lib/rollup-plugin-feature-array';
import { isSourceFile } from '../utils/filetypes';
import { purpletSourceCode } from '../utils/fs';

const ENTRY_HEADER = '// Automatically generated by Purplet v__VERSION__';
const ROLLUP_HEADER = `// Bundled by Rollup v${rollupVersion} and Purplet v__VERSION__`;

export interface BuildOptions {
  root: string;
}

export async function buildGateway(options: BuildOptions) {
  const buildSpinner = new Spinner({ text: 'Building Purplet Application' });
  const config = await loadConfig(options.root);

  // Empty build folder
  Logger.info('Starting build');
  if (await pathExists(config.paths.build)) {
    await fs.rm(config.paths.build, { recursive: true });
  }
  await fs.mkdir(config.paths.build, { recursive: true });

  // Setup common rollup stuff
  const aliasEntries: Record<string, string> = {};
  for (const [key, value] of Object.entries(config.alias)) {
    aliasEntries[key] = path.resolve(value);
  }
  const mainPlugins = [
    resolve({
      extensions: ['.mjs', '.js', '.ts', '.json'],
    }),
    esbuild(),
    alias({
      entries: aliasEntries,
    }),
  ];

  // Phase 1 is building a map of the bot features.
  Logger.info('Building phase 1 file');
  const modules = (await asyncIterToArray(walk(config.paths.features))).filter(isSourceFile);
  const moduleFeature = modules.map((filename, index) => ({
    id: `${path
      .relative(config.paths.features, filename)
      .replace(/\.[jt]sx?$/, '')
      .replace(/[^a-z0-9]/g, '_')
      .replace(/^_+|(_)_+|_+$/g, '$1')}_${index}`,
    relative: path.relative(config.paths.features, filename),
    filename,
    index,
  }));

  const phase1source = [
    ENTRY_HEADER,
    `import { printPhase1Data, moduleToFeatureArray } from 'purplet/internal';`,
    ``,
    ...moduleFeature.map(
      ({ id, filename }) => `import * as ${id} from '${filename.replace(/[\\']/g, '\\$&')}';`
    ),
    ``,
    `printPhase1Data([`,
    ...moduleFeature.map(
      ({ id, relative }) =>
        `  moduleToFeatureArray('${relative.replace(/[\\']/g, '\\$&')}', ${id}),`
    ),
    `].flat());`,
    ``,
  ].join('\n');

  const phase1File = path.join(config.temp, 'phase1.ts');
  const phase1OutFile = path.join(config.temp, 'phase1.mjs');
  await fs.writeFile(phase1File, phase1source);

  const phase1Rollup = await rollup({
    input: phase1File,
    external: id => id.startsWith(purpletSourceCode),
    plugins: [...mainPlugins, externalPlugin()],
  });
  await phase1Rollup.write({
    file: phase1OutFile,
    format: 'esm',
    banner: ENTRY_HEADER,
  });

  // We use a separate process so we can ensure if a database connection or something is attempted,
  // it is killed off as soon as possible.
  Logger.info('Evaluating phase 1');
  const {
    status: phase1Status,
    stdout: phase1OutputText,
    error: phase1Error,
  } = spawnSync(process.argv[0], [phase1OutFile], {
    stdio: 'pipe',
  });

  if (phase1Status !== 0 || phase1Error) {
    Logger.error(phase1OutputText.toString());
    buildSpinner.error(phase1Error ?? 'Scan of bot features failed');
    return;
  }

  const featureScan: FeatureScan = JSON.parse(phase1OutputText.toString());

  // Second rollup build
  Logger.info('Running phase 2 build');
  const phase2Rollup = await rollup({
    input: '/code/CRBT-Team/Purplet/packages/purplet/runtimes/test.js',
    // external: id =>

    plugins: [
      //
      {
        name: 'force-purplet-deps-to-tree-shake',
        async resolveId(source, importer) {
          if (
            [
              // these are ok, purplet internals we dont care
              '@paperdave/logger',
              '@paperdave/utils',
              '@purplet/polyfill',
              'discordjs',
              'chalk',
              'dedent',
              'fast-deep-equal',
              '@sindresorhus/is',
            ].some(x => source.includes(x))
          ) {
            return {
              id: source,
              external: true,
              moduleSideEffects: false,
            };
          }
          if (source.includes('discord-api-types') && importer !== 'me') {
            const resolved = await this.resolve(source, 'me');
            return {
              ...resolved,
              moduleSideEffects: false,
            };
          }
          return null;
        },
      },
      rollupPluginFeatureArray({ config, featureScan }),
      commonjs({ include: [/discord-api-types/] }),
      ...mainPlugins,
    ],
  });
  await phase2Rollup.write({
    dir: config.paths.build,
    chunkFileNames: '[name].js',
    format: 'esm',
    banner: ROLLUP_HEADER,
  });

  const outputFile = path.join(config.paths.build, 'index.js');

  const userPkg = JSON.parse(await fs.readFile(path.join(options.root, 'package.json'), 'utf8'));

  const req = createRequire(options.root + '/package.json');
  try {
    const resolved = req.resolve('./' + userPkg.main);
    if (resolved !== outputFile) {
      throw new Error('Error');
    }
  } catch {
    Logger.warn(
      `The "main" field in package.json does not point to the bot entry file at ./${path
        .relative(options.root, outputFile)
        .replace(/\\/g, '/')}.`
    );
  }
  buildSpinner.success('Bot build succeeded, you can run it with `node .`');
}
