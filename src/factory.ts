import { Linter } from "eslint";
import javascript from "./configs/javascript";
import stylistic from "./configs/stylistic";
import { isPackageExists } from "local-pkg";
import vue from "./configs/vue";
import { OptionsConfig } from "./types";
import typescript from "./configs/typescript";
import { getOverrides } from "./utils";

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

  if (enableTs) configs.push(
    await typescript({ overrides: getOverrides(options, "ts") })
  );

  if (enableVue) {
    configs.push(
      await vue({
        ts: enableTs,
        taro: enableTaro,
        overrides: getOverrides(options, "vue")
      })
    );
  }

  return configs.flat(1) satisfies Linter.Config[];
}