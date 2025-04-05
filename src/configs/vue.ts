import { Linter } from "eslint";
import { VUE_GLOBS } from "../globs";

import { OptionsOverrides, OptionsVue } from "../types";
import { ensurePackages, interopDefault } from "../utils";

export default async function vue(
  options?: OptionsVue & OptionsOverrides
): Promise<Linter.Config[]> {
  await ensurePackages([
    "eslint-plugin-vue",
    "vue-eslint-parser"
  ]);

  const [
    pluginVue,
    parserVue
  ] = await Promise.all([
    interopDefault(import("eslint-plugin-vue")),
    interopDefault(import("vue-eslint-parser"))
  ] as const);

  return [
    {
      name: "zjutjh/vue/setup",
      plugins: {
        vue: pluginVue
      }
    },
    {
      name: "zjutjh/vue/rules",
      files: VUE_GLOBS,
      languageOptions: {
        parser: parserVue,
        parserOptions: {
          ecmaFeatures: {
            jsx: true
          },
          extraFileExtensions: [".vue"],
          parser: options?.ts
            ? await interopDefault(import("@typescript-eslint/parser"))
            : null,
          sourceType: "module"
        }
      },
      processor: pluginVue.processors[".vue"],
      rules: {
        ...pluginVue.configs["flat/recommended"].map(c => c.rules).reduce((prev, curr) => ({ ...prev, ...curr }), {}),
        ...pluginVue.configs["flat/essential"].map(c => c.rules).reduce((prev, curr) => ({ ...prev, ...curr }), {}),
        ...pluginVue.configs["flat/strongly-recommended"].map(c => c.rules).reduce((prev, curr) => ({ ...prev, ...curr }), {}),

        "vue/multi-word-component-names": ["warn", { ignores: ["index"] }],
        "vue/component-name-in-template-casing": ["error", "kebab-case", { "registeredComponentsOnly": true }],
        "vue/max-attributes-per-line": ["error", { "singleline": { "max": 3 } }],
        "vue/prefer-true-attribute-shorthand": ["warn", options?.taro ? "never" : "always"],

        ...options?.overrides
      }
    }
  ];
}