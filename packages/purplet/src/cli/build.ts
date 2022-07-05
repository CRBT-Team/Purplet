import resolve from '@rollup/plugin-node-resolve';
import fs from 'fs/promises';
import path from 'path';
import esbuild from 'rollup-plugin-esbuild';
import { createRequire } from 'module';
import { rollup, VERSION as rollupVersion } from 'rollup';
import { loadConfig } from '../config';
import { log } from '../lib/logger';
import { isSourceFile } from '../utils/filetypes';
import { exists, walk } from '../utils/fs';

const ENTRY_HEADER = '// Automatically generated by Purplet v__VERSION__';
const ROLLUP_HEADER = `// Bundled by Rollup v${rollupVersion} and Purplet v__VERSION__`;

export interface BuildOptions {
  root: string;
}

export async function buildGateway(options: BuildOptions) {
  const config = await loadConfig(options.root);

  // Scan for features
  const modules = (await walk(config.paths.features)).filter(isSourceFile);

  // Empty build folder
  if (await exists(config.paths.build)) {
    await fs.rm(config.paths.build, { recursive: true });
  }
  await fs.mkdir(config.paths.build, { recursive: true });

  // This calculation step is really useful for simplifying the code generation.
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

  // An entry file. All that is needed to start the bot is create `GatewayBot` and pass it an
  // array of annotated features. If you need to visualize how this file looks, take a look
  // at `.purplet/build/entry.ts` in any project, as we do not delete this file after the build,
  // just in case we need to debug it.
  const entrySource = [
    ENTRY_HEADER,
    `import { GatewayBot, setupEnv, moduleToFeatureArray, isDirectlyRun } from 'purplet/internal';`,
    ``,
    `setupEnv();`,
    ``,
    ...moduleFeature.map(
      ({ id, filename }) => `import * as ${id} from '${filename.replace(/[\\']/g, '\\$&')}';`
    ),
    ``,
    `const features = [`,
    ...moduleFeature.map(
      ({ id, relative }) =>
        `  moduleToFeatureArray('${relative.replace(/[\\']/g, '\\$&')}', ${id}),`
    ),
    `].flat();`,
    ``,
    `const bot = new GatewayBot();`,
    `bot.loadFeatures(...features);`,
    ``,
    `// The bot only gets started automatically if you run it directly, otherwise \`bot\` is`,
    `// returned as the default export.`,
    `if (isDirectlyRun(import.meta.url)) {`,
    `  bot.start({ mode: 'production' });`,
    `}`,
    ``,
    `export default bot;`,
    ``,
  ].join('\n');

  const entryFile = path.join(config.paths.temp, 'entry.mjs');
  await fs.writeFile(entryFile, entrySource);

  // The rollup config is similar to the one used to package purplet itself, but we base the
  // externals off of the user's package instead of ours.

  const userPkg = JSON.parse(await fs.readFile(path.join(options.root, 'package.json'), 'utf8'));
  const external: string[] = [
    // Ensure that under no case that purplet is bundled, even though it should
    // be impossible to run the `purplet` cli without installing it. /shrug
    'purplet',
  ].concat(
    Object.keys(userPkg.dependencies ?? {}),
    Object.keys(userPkg.peerDependencies ?? {}),
    // We could add devDependencies, but we technically don't need to, as devDependencies are not
    // supposed be used in application code. TODO: throw if devDependencies are used.

    // @ts-expect-error - process.binding is not on @types/node, /shrug
    Object.keys(process.binding('natives'))
  );

  // Run rollup
  const rolled = await rollup({
    input: {
      index: entryFile,
    },
    external: id => id.startsWith('node:') || external.some(x => id.startsWith(x)),
    plugins: [
      resolve({
        extensions: ['.mjs', '.js', '.ts', '.json'],
      }),
      esbuild(),
      {
        name: 'purplet-remove-entry-header',
        transform(code, id) {
          return id === entryFile ? code.replace(ENTRY_HEADER, '') : code;
        },
      },
    ],
  });
  await rolled.write({
    dir: config.paths.build,
    format: 'esm',
    chunkFileNames: '[name].js',
    banner: ROLLUP_HEADER,
  });

  const outputFile = path.join(config.paths.build, 'index.js');

  const req = createRequire(options.root + '/package.json');
  try {
    const resolved = req.resolve('./' + userPkg.main);
    if (resolved !== outputFile) {
      throw undefined;
    }
  } catch {
    log(
      'info',
      `The "main" field in package.json does not point to the bot entry file at ./${path
        .relative(options.root, outputFile)
        .replace(/\\/g, '/')}.`
    );
  }
  log('purplet', 'Bot build succeeded, you can run it with `node .`');
}
