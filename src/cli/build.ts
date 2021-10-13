import type { Args } from ".";
import { readDirRecursive } from "../util/readDirRecursive";
import { loadConfig } from "./load-config";
import path from "path";
import fs from "fs-extra";
import { getTempFolder } from "./temp";
import { build as esbuild } from "esbuild";

export async function build(args: Args) {
  console.log("Building bot.");
  const configFile = path.resolve(args.root, "bot.config.ts");
  const config = await loadConfig(args);

  const modulePath = path.resolve(args.root, config.compiler?.modulesPath ?? "modules");
  const moduleList = await readDirRecursive(modulePath);

  const moduleGeneratedFile = path.join(await getTempFolder(), "all-modules.ts");
  const entryGeneratedFile = path.join(await getTempFolder(), "entry.ts");

  await fs.writeFile(
    moduleGeneratedFile,
    moduleList
      .map((module) => {
        const relativePath = path.relative(modulePath, module);
        const moduleId = relativePath.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9]/g, "_");
        const moduleFile = module.replace(/\\/g, "\\\\").replace(/\.[tj]s/g, "");
        return `export * as module_${moduleId} from "${moduleFile}";`;
      })
      .join("\n")
  );

  await fs.writeFile(
    entryGeneratedFile,
    `
      import { Framework } from 'crbt-framework';
      import * as modules from './all-modules.ts';
      import * as config from '${configFile.replace(/\\/g, "\\\\")}';

      const bot = new Framework(config);
      bot.addModules(modules);
      bot.init();
    `
  );

  await esbuild({
    entryPoints: [entryGeneratedFile],
    outfile: path.join(args.root, "dist", "bot.mjs"),
    bundle: true,
    platform: "node",
    target: "node16",
    format: "esm",
    external: ["crbt-framework", "discord.js"],
  });
}
