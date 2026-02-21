import { Plugin } from "@eslint/core";
import { Linter } from "eslint";

import { GLOB_JS, GLOB_JSX, GLOB_TS, GLOB_TSX } from "../globs";
import { OptionsOverrides } from "../types";
import { ensurePackages, interopDefault } from "../utils";

export default async function react(options: OptionsOverrides): Promise<Linter.Config[]> {
  await ensurePackages([
    "@eslint-react/eslint-plugin",
    "eslint-plugin-react-hooks",
    "eslint-plugin-react-refresh"
  ]);

  const [
    pluginReact,
    pluginReactHooks,
    pluginReactRefresh
  ] = await Promise.all([
    interopDefault(import("@eslint-react/eslint-plugin")),
    interopDefault(import("eslint-plugin-react-hooks")),
    interopDefault(import("eslint-plugin-react-refresh"))
  ]);

  // @ts-expect-error 运行时存在 `plugins` 属性
  const plugins = pluginReact.configs.all.plugins as Record<string, Plugin>;

  return [
    {
      name: "zjutjh/react/setup",
      plugins: {
        "@eslint-react": plugins["@eslint-react"],
        "@eslint-react/dom": plugins["@eslint-react/dom"],
        "@eslint-react/hooks-extra": plugins["@eslint-react/hooks-extra"],
        "@eslint-react/naming-convention": plugins["@eslint-react/naming-convention"],
        "@eslint-react/rsc": plugins["@eslint-react/rsc"],
        "@eslint-react/web-api": plugins["@eslint-react/web-api"],

        // @ts-expect-error `pluginReactHooks.configs.flat` 属性导致类型错误，运行时不会消费该属性
        "react-hooks": pluginReactHooks,
        "react-refresh": pluginReactRefresh
      }
    },
    {
      name: "zjutjh/react/rules",
      files: [GLOB_JSX, GLOB_TSX, GLOB_JS, GLOB_TS],
      rules: {
        ...pluginReact.configs.recommended.rules,
        ...pluginReactHooks.configs.recommended.rules,
        "react-refresh/only-export-components": "warn",
        "@eslint-react/no-leaked-conditional-rendering": "error",
        "@eslint-react/no-missing-component-display-name": "error",
        "@eslint-react/no-missing-context-display-name": "error",
        ...options.overrides
      }
    }
  ] satisfies Linter.Config[];
}
