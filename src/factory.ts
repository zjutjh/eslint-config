import { Linter } from "eslint";
import { isPackageExists } from "local-pkg";

import imports from "./configs/imports";
import javascript from "./configs/javascript";
import stylistic from "./configs/stylistic";
import typescript from "./configs/typescript";
import vue from "./configs/vue";
import { OptionsConfig } from "./types";
import { getOverrides, resolveSubOptions } from "./utils";

export default async function zjutjh(options: OptionsConfig = {}) {
  const {
    vue: enableVue = isPackageExists("vue"),
    ts: enableTs = isPackageExists("typescript"),
    taro: enableTaro = isPackageExists("@tarojs/taro")
  } = options;

  const configs: Linter.Config[][] = [];

  configs.push(javascript());
  configs.push(
    stylistic({ overrides: getOverrides(options, "stylistic") })
  );
  configs.push(imports());

  const typescriptOptions = resolveSubOptions(options, "ts");
  if (enableTs) configs.push(
    await typescript({
      ...typescriptOptions,
      overrides: getOverrides(options, "ts")
    })
  );

  if (enableVue) {
    configs.push(
      await vue({
        ts: !!enableTs,
        taro: enableTaro,
        overrides: getOverrides(options, "vue")
      })
    );
  }

  return configs.flat(1) satisfies Linter.Config[];
}