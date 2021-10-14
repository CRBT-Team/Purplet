import { Args } from ".";
import { build as esbuild } from "esbuild";
import path from "path";
import { getTempFolder } from "./temp";
import { remove } from "fs-extra";
import { Config } from "../Config";

export async function loadConfig(args: Args) {
  const outfile = path.join(await getTempFolder(), "config.mjs");

  await esbuild({
    entryPoints: [path.resolve(args.root, "purplet.config.ts")],
    external: ["purplet"],
    bundle: true,
    format: "esm",
    outfile,
  });

  const imported = await (await import("file://" + outfile)).default;

  return imported as Config;
}
