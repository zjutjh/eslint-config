import { Linter } from "eslint";

import { JS_GLOBS, JSX_GLOBS, TS_GLOBS, TSX_GLOBS } from "../globs";
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

  const plugins = pluginReact.configs.all.plugins;

  return [
    {
      name: "zjutjh/react/setup",
      plugins: {
        // @ts-expect-error 依赖的类型有问题，不影响使用
        "@eslint-react": plugins["@eslint-react"],
        // @ts-expect-error 依赖的类型有问题，不影响使用
        "@eslint-react/debug": plugins["@eslint-react/debug"],
        // @ts-expect-error 依赖的类型有问题，不影响使用
        "@eslint-react/dom": plugins["@eslint-react/dom"],
        // @ts-expect-error 依赖的类型有问题，不影响使用
        "@eslint-react/hooks-extra": plugins["@eslint-react/hooks-extra"],
        // @ts-expect-error 依赖的类型有问题，不影响使用
        "@eslint-react/naming-convention": plugins["@eslint-react/naming-convention"],
        // @ts-expect-error 依赖的类型有问题，不影响使用
        "@eslint-react/web-api": plugins["@eslint-react/web-api"],

        "react-hooks": pluginReactHooks,
        "react-refresh": pluginReactRefresh
      }
    },
    {
      name: "zjutjh/react/rules",
      files: [JSX_GLOBS, TSX_GLOBS, JS_GLOBS, TS_GLOBS],
      rules: {
        ...pluginReact.configs.recommended.rules,
        ...pluginReactHooks.configs.recommended.rules,
        "react-refresh/only-export-components": "warn",
        ...options.overrides
      }
    }
  ];
}
