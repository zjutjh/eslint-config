import { Linter } from "eslint";
import { isPackageExists } from "local-pkg";

import ignores from "./configs/ignores";
import imports from "./configs/imports";
import javascript from "./configs/javascript";
import jsx from "./configs/jsx";
import misc from "./configs/misc";
import oxfmt from "./configs/oxfmt";
import react from "./configs/react";
import typescript from "./configs/typescript";
import vue from "./configs/vue";
import { OptionsConfig } from "./types";
import { getOverrides, resolveSubOptions } from "./utils";

export default async function zjutjh(
  options: OptionsConfig = {},
  ...userConfigs: Awaited<Linter.Config[]>
): Promise<Linter.Config[]> {
  const {
    componentExts = [],
    vue: enableVue = isPackageExists("vue"),
    ts: enableTs = isPackageExists("typescript"),
    taro: enableTaro = isPackageExists("@tarojs/taro"),
    jsx: enableJSX = isPackageExists("react"),
    react: enableReact = isPackageExists("react"),
    ignores: userIgnores,
    gitignore: enableGitignore = false,
    oxfmt: enableOxfmt = true
  } = options;

  const configs: Linter.Config[][] = [];

  configs.push(
    ignores({ userIgnores, gitignore: enableGitignore }),
    javascript(),
    imports(),
    misc()
  );

  if (enableVue) {
    componentExts.push("vue");
  }

  const typescriptOptions = resolveSubOptions(options, "ts");
  if (enableTs) {
    configs.push(
      await typescript({
        ...typescriptOptions,
        componentExts,
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

  const oxfmtOptions = resolveSubOptions(options, "oxfmt");
  if (enableOxfmt) {
    configs.push(oxfmt(oxfmtOptions));
  }

  return configs.flat(1).concat(userConfigs);
}
