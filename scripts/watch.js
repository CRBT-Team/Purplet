const { build: b } = require("esbuild");
const { watch } = require("chokidar");
const { join } = require("path");
const { green, gray } = require("chalk");
const { dtsPlugin } = require("esbuild-plugin-d.ts");

const build = (path, outPath, event) => {
  const start = Date.now();

  b({
    format: "cjs",
    entryPoints: [path],
    outfile: outPath,
    platform: "node",
    target: "node16",
    plugins: [dtsPlugin()],
  });

  console.log(
    gray(`[${event}] ${path} => ${outPath} = ${Date.now() - start}ms`)
  );
};

watch(join(__dirname, "../src"))
  .on("ready", () => {
    console.log(green(`Ready`));
  })
  .on("all", (event, path) => {
    event = event.toUpperCase();

    if (["ADD", "CHANGE"].includes(event)) {
      const outPath = `${path.replace("src", "dist").slice(0, -3)}.js`;

      // console.log(outPath)
      build(path, outPath, event);
    }
  });
