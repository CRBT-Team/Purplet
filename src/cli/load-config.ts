import { Args } from ".";
import { build as esbuild } from "esbuild";
import path from "path";
import { getTempFolder } from "./temp";
import { remove } from "fs-extra";
import { Config } from "../Config";

export async function loadConfig(args: Args) {
  const outfile = path.join(await getTempFolder(), "config.mjs");

  await esbuild({
    entryPoints: [path.resolve(args.root, "bot.config.ts")],
    external: ["crbt-framework"],
    bundle: true,
    format: "esm",
    outfile,
  });

  const imported = await (await import("file://" + outfile)).default;

  await remove(outfile);

  return imported as Config;
}
