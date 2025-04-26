import { Linter } from "eslint";
import { isPackageExists } from "local-pkg";

import imports from "./configs/imports";
import javascript from "./configs/javascript";
import jsx from "./configs/jsx";
import prettier from "./configs/prettier";
import stylistic from "./configs/stylistic";
import typescript from "./configs/typescript";
import vue from "./configs/vue";
import { OptionsConfig } from "./types";
import { getOverrides, resolveSubOptions } from "./utils";

export default async function zjutjh(options: OptionsConfig = {}) {
  const {
    vue: enableVue = isPackageExists("vue"),
    ts: enableTs = isPackageExists("typescript"),
    taro: enableTaro = isPackageExists("@tarojs/taro"),
    jsx: enableJSX = isPackageExists("react"),
    prettier: enablePrettier = false
  } = options;

  const configs: Linter.Config[][] = [];

  configs.push(javascript());
  configs.push(imports());
  configs.push(
    stylistic({
      overrides: getOverrides(options, "stylistic")
    })
  );

  const typescriptOptions = resolveSubOptions(options, "ts");
  if (enableTs) {
    configs.push(
      await typescript({
        ...typescriptOptions,
        overrides: getOverrides(options, "ts")
      })
    );
  }

  if (enableVue) {
    configs.push(
      await vue({
        ts: Boolean(enableTs),
        taro: enableTaro,
        overrides: getOverrides(options, "vue")
      })
    );
  }

  if (enableJSX) {
    configs.push(jsx());
  }

  // 放到最后，eslint-config-prettier 需要覆盖一些冲突的配置
  const codeStyleOptions = resolveSubOptions(options, "prettier");
  if (enablePrettier) {
    configs.push(await prettier(codeStyleOptions));
  }

  return configs.flat(1) satisfies Linter.Config[];
}
