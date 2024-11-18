import { Linter } from "eslint";
import { ensurePackages, interopDefault } from "../utils";
import { OptionsOverrides, OptionsVue } from "../types";

export default async function vue(
  options?: OptionsVue & OptionsOverrides
) {
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
      files: ["**/*.vue"],
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
        ...pluginVue.configs["vue3-recommended"].rules,
        ...pluginVue.configs["vue3-essential"].rules,
        ...pluginVue.configs["vue3-strongly-recommended"].rules,

        "vue/multi-word-component-names": "warn",
        "vue/component-name-in-template-casing": ["error", "kebab-case", { "registeredComponentsOnly": true }],
        "vue/max-attributes-per-line": ["error", { "singleline": { "max": 3 } }],
        "vue/prefer-true-attribute-shorthand": ["warn", options?.taro ? "never" : "always"],

        ...options?.overrides
      }
    }
  ] as Linter.Config[];
}