import type { Args } from ".";
import { readDirRecursive } from "../util/readDirRecursive";
import { loadConfig } from "./load-config";
import path from "path";
import fs, { pathExists } from "fs-extra";
import { getTempFolder } from "./temp";
import { build as esbuild } from "esbuild";

export async function build(args: Args) {
  console.log("Building bot");
  const configFile = path.resolve(args.root, "purplet.config.ts");
  const config = await loadConfig(args);

  const modulePath = config.compiler?.modulesPath
    ? path.resolve(args.root, config.compiler?.modulesPath)
    : [
        //
        path.resolve(args.root, "src", "modules"),
        path.resolve(args.root, "modules"),
      ].find((x) => fs.existsSync(x));
  if (!modulePath) {
    throw new Error("No modules path found. Create a directory at ./src/modules");
  }
  const moduleList = (await pathExists(modulePath)) ? await readDirRecursive(modulePath) : [];

  const handlerPath = config.compiler?.handlersPath
    ? path.resolve(args.root, config.compiler?.handlersPath)
    : [
        //
        path.resolve(args.root, "src", "handlers"),
        path.resolve(args.root, "handlers"),
      ].find((x) => fs.existsSync(x));
  const handlerList = handlerPath ? await readDirRecursive(handlerPath) : [];

  const entryGeneratedFile = path.join(await getTempFolder(), "entry.ts");

  await fs.writeFile(
    entryGeneratedFile,
    `import "dotenv/config";
     import { Framework, Handler } from 'purplet';
     import config from '${configFile.replace(/\\/g, "\\\\")}';
    ` +
      moduleList
        .map((module) => {
          const relativePath = path.relative(modulePath, module);
          const moduleId = relativePath.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9]/g, "_");
          const moduleFile = module.replace(/\\/g, "\\\\").replace(/\.[tj]s/g, "");
          return `import * as module_${moduleId} from "${moduleFile}";`;
        })
        .join("\n") +
      `const modules = {
          ${moduleList
            .map((module, i) => {
              const relativePath = path.relative(modulePath, module);
              const moduleId = relativePath.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9]/g, "_");
              return `m${i}: module_${moduleId}`;
            })
            .join(",\n")}
        };` +
      handlerList
        .map((module) => {
          const relativePath = path.relative(modulePath, module);
          const moduleId = relativePath.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9]/g, "_");
          const moduleFile = module.replace(/\\/g, "\\\\").replace(/\.[tj]s/g, "");
          return `import * as handler_${moduleId} from "${moduleFile}";`;
        })
        .join("\n") +
      `const handlers = [${handlerList
        .map(() => {
          return `handler_${handlerList.length}`;
        })
        .join(",\n")}].flatMap(x => Object.values(x))
        .filter(x => x.constructor instanceof Handler.constructor)
        .map(x => new x());
        (async() => {
          const conf = await config;
          config.handlers = (config.handlers ?? []).concat(...handlers);
          const bot = new Framework(conf);
          bot.addModules(modules);
          bot.init();
        })()`
  );

  const pkg = await fs.readJSON(path.resolve(args.root, "package.json"));

  const deps = Object.keys(pkg.dependencies ?? {})
    .concat(Object.keys(pkg.devDependencies ?? {}))
    .concat(Object.keys(pkg.peerDependencies ?? {}));

  const libAlias = [
    //
    path.resolve(args.root, "src", "lib"),
    path.resolve(args.root, "lib"),
  ].find((x) => fs.existsSync(x));

  await esbuild({
    entryPoints: [entryGeneratedFile],
    outfile: path.join(args.root, "dist", "bot.mjs"),
    bundle: true,
    platform: "node",
    target: "node16",
    format: "esm",
    external: ["purplet", "discord.js", "@discordjs/rest", "dotenv"].concat(deps),
    ...(config.compiler?.esbuildOptions ?? {}),
    plugins: [
      // add plugins here
      ...(config.compiler?.esbuildPlugins ?? []),
    ],
  });

  console.log("Purplet Built Built!");
}
