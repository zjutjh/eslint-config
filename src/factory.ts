import { Linter } from "eslint";
import { isPackageExists } from "local-pkg";

import ignores from "./configs/ignores";
import imports from "./configs/imports";
import javascript from "./configs/javascript";
import jsx from "./configs/jsx";
import prettier from "./configs/prettier";
import react from "./configs/react";
import stylistic from "./configs/stylistic";
import typescript from "./configs/typescript";
import vue from "./configs/vue";
import { OptionsConfig } from "./types";
import { getOverrides, resolveSubOptions } from "./utils";

export default async function zjutjh(options: OptionsConfig = {}, ...userConfigs: Awaited<Linter.Config[]>) {
  const {
    vue: enableVue = isPackageExists("vue"),
    ts: enableTs = isPackageExists("typescript"),
    taro: enableTaro = isPackageExists("@tarojs/taro"),
    jsx: enableJSX = isPackageExists("react"),
    react: enableReact = isPackageExists("react"),
    ignores: userIgnores,
    prettier: enablePrettier = false
  } = options;

  const configs: Linter.Config[][] = [];

  configs.push(
    ignores({ userIgnores }),
    javascript(),
    imports(),
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

  if (enableReact) {
    configs.push(
      await react({
        overrides: getOverrides(options, "react")
      })
    );
  }

  // 放到最后，eslint-config-prettier 需要覆盖一些冲突的配置
  const codeStyleOptions = resolveSubOptions(options, "prettier");
  if (enablePrettier) {
    configs.push(await prettier(codeStyleOptions));
  }

  return configs.flat(1).concat(userConfigs);
}
