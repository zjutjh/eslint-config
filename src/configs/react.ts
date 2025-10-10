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

  const plugins = pluginReact.configs.all.plugins;

  return [
    {
      name: "zjutjh/react/setup",
      plugins: {
        "@eslint-react": plugins["@eslint-react"],
        "@eslint-react/debug": plugins["@eslint-react/debug"],
        "@eslint-react/dom": plugins["@eslint-react/dom"],
        "@eslint-react/hooks-extra": plugins["@eslint-react/hooks-extra"],
        "@eslint-react/naming-convention": plugins["@eslint-react/naming-convention"],
        "@eslint-react/web-api": plugins["@eslint-react/web-api"],

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
