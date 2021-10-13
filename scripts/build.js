const { build } = require("esbuild");
const fs = require("fs-extra");
const pkg = JSON.parse(fs.readFileSync("./package.json"));
const dependencies = Object.keys(pkg.dependencies);

build({
  entryPoints: ["./src/index.ts"],
  outfile: "./dist/index.mjs",
  format: "esm",
  target: "node16",
  platform: "node",
  bundle: true,
  external: dependencies,
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
}).then(() => {
  fs.ensureDirSync("node_modules/crbt-framework");
  fs.writeFileSync("node_modules/crbt-framework/index.mjs", 'export * from "../../dist/index.mjs"');
  fs.writeJSONSync("node_modules/crbt-framework/package.json", {
    ...pkg,
    module: "index.mjs",
    main: "index.mjs",
  });
});
