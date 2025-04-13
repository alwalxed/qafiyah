import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/utils/client.ts", "src/utils/server.ts"],
  format: ["esm", "cjs"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  outDir: "dist",
  platform: "node",
  target: "node16",
});
