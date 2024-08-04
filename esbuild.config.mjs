import { build } from "esbuild";

build({
  entryPoints: ["./src/index.ts"],
  bundle: true,
  target: "ES5",
  outdir: "./build",
  platform: "node",
  minify: true,
});
