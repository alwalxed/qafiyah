import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "utils/client": "src/utils/client.ts",
    "utils/server": "src/utils/server.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  splitting: false,
  sourcemap: false,
  clean: true,
  target: "node18",
  treeshake: true,
  minify: false,
  bundle: true,
  skipNodeModulesBundle: true,
  esbuildOptions(options) {
    options.keepNames = true;
    options.treeShaking = true;
  },
});
