import type { Args } from ".";
import { readDirRecursive } from "../util/readDirRecursive";
import { loadConfig } from "./load-config";
import path from "path";
import fs, { pathExists } from "fs-extra";
import { getTempFolder } from "./temp";
import { build as esbuild } from "esbuild";

export async function build(args: Args) {
  console.log("Building bot");
  const configFile = path.resolve(args.root, "bot.config.ts");
  const config = await loadConfig(args);

  const modulePath = path.resolve(args.root, config.compiler?.modulesPath ?? "modules");
  const moduleList = (await pathExists(modulePath)) ? await readDirRecursive(modulePath) : [];

  const handlerPath = path.resolve(args.root, config.compiler?.handlersPath ?? "handlers");
  const handlerList = (await pathExists(handlerPath)) ? await readDirRecursive(handlerPath) : [];

  const moduleGeneratedFile = path.join(await getTempFolder(), "all-modules.ts");
  const handlerGeneratedFile = path.join(await getTempFolder(), "all-handlers.ts");
  const entryGeneratedFile = path.join(await getTempFolder(), "entry.ts");

  await fs.writeFile(
    entryGeneratedFile,
    `import "dotenv/config";
     import { Framework, Handler } from 'crbt-framework';
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

  await esbuild({
    entryPoints: [entryGeneratedFile],
    outfile: path.join(args.root, "dist", "bot.mjs"),
    bundle: true,
    platform: "node",
    target: "node16",
    format: "esm",
    external: ["crbt-framework", "discord.js", "dotenv"],
  });

  console.log("Done");
}
