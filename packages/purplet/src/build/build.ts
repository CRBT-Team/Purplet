import resolve from '@rollup/plugin-node-resolve';
import fs from 'fs/promises';
import path from 'path';
import esbuild from 'rollup-plugin-esbuild';
import { rollup } from 'rollup';
import { isSourceFile } from '../utils/filetypes';
import { exists, walk } from '../utils/fs';

export interface BuildOptions {
  root: string;
}

export async function runBuild(options: BuildOptions) {
  // Scan for modules
  const modulesPath = path.normalize(path.join(options.root, 'src/modules'));
  const modules = (await walk(modulesPath)).filter(isSourceFile);

  // Setup temp folder
  const tempFolder = path.join(options.root, '.purplet/build');
  if (await exists(tempFolder)) {
    // This might not be needed.
    await fs.rm(tempFolder, { recursive: true });
  }
  await fs.mkdir(tempFolder, { recursive: true });

  // This calculation step is really useful for simplifying the code generation.
  const moduleData = modules.map((filename, index) => ({
    id: `${path
      .relative(modulesPath, filename)
      .replace(/\.[jt]sx?$/, '')
      .replace(/[^a-z0-9]/g, '_')
      .replace(/^_+|(_)_+|_+$/g, '$1')}_${index}`,
    relative: path.relative(modulesPath, filename),
    filename,
    index,
  }));

  // An entry file. All that is needed to start the bot is create `GatewayBot` and pass it an
  // array of annotated features. If you need to visualize how this file looks, take a look
  // at `.purplet/build/entry.ts` in any project, as we do not delete this file after the build,
  // just in case we need to debug it.
  const entrySource = [
    `// Automatically generated by Purplet v__VERSION__`,
    `import url from 'url'`,
    `import { GatewayBot, moduleToFeatureArray } from 'purplet';`,
    ...moduleData.map(
      ({ id, filename }) => `import * as ${id} from '${filename.replace(/[\\']/g, '\\$&')}';`
    ),
    ``,
    `const features = [`,
    ...moduleData.map(
      ({ id, relative }) =>
        `  moduleToFeatureArray('${relative.replace(/[\\']/g, '\\$&')}', ${id}),`
    ),
    `].flat();`,
    ``,
    `const bot = new GatewayBot({ mode: 'production' });`,
    `bot.loadFeatures(...features);`,
    ``,
    `// The bot only gets started automatically if you run it directly, otherwise \`bot\` is`,
    `// returned as the default export.`,
    `if (typeof process !== 'undefined' && import.meta.url === url.pathToFileURL(process.argv[1]).href) {`,
    `  bot.start();`,
    `}`,
    ``,
    `export default bot`,
    ``,
  ].join('\n');

  const entryFile = path.join(tempFolder, 'entry.js');
  await fs.writeFile(entryFile, entrySource);

  // The rollup config is similar to the one used to package purplet itself, but we base the
  // externals off of the user's package instead of ours.

  const userPkg = JSON.parse(await fs.readFile(path.join(options.root, 'package.json'), 'utf8'));
  const external: string[] = [
    // Ensure that under no case that purplet or discord.js are bundled, even though it should
    // be impossible to run the `purplet` cli without installing it. /shrug
    'purplet',
    'discord.js',
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
        name: 'rollup-plugin-purplet-build',
        resolveImportMeta(property, { moduleId }) {
          console.log(property, moduleId);
          if (property === 'url') {
            return `import.meta.url`;
          }
          return null;
        },
      },
    ],
  });
  await rolled.write({
    dir: tempFolder,
    format: 'esm',
    chunkFileNames: '[name].js',
  });

  console.log('Built bot to .purplet/build/index.js');
}
