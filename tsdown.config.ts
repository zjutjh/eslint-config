import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  clean: true,
  dts: true,
  shims: true,
  external: [
    // 避免打包第三方 ESLint 插件及其本地绑定
    "eslint-plugin-import-x",
    "unrs-resolver",
    /@unrs\/.*/
  ]
});
