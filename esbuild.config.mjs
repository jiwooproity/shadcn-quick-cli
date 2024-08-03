import { build } from "esbuild";

build({
  entryPoints: ["./src/index.ts"],
  bundle: true,
  outdir: "./build",
  platform: "node",
  minify: true,
  metafile: true,
});
