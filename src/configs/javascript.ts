import eslintJS from "@eslint/js";
import { Linter } from "eslint";
import globals from "globals";

export default function javascript() {

  return [
    {
      name: "zjutjh/javascript/setup",
      languageOptions: {
        ecmaVersion: 2022,
        globals: {
          ...globals.browser,
          ...globals.es2021,
          ...globals.node,
          document: "readonly",
          navigator: "readonly",
          window: "readonly"
        },
        parserOptions: {
          ecmaFeatures: {
            jsx: true
          },
          ecmaVersion: 2022,
          sourceType: "module"
        },
        sourceType: "module"
      },
      linterOptions: {
        reportUnusedDisableDirectives: true
      }
    },
    {
      name: "zjutjh/javascript/rules",
      rules: {
        ...eslintJS.configs.recommended.rules,
        "camelcase": "warn",
        "no-warning-comments": "warn",
        "no-console": ["warn", { allow: [ "warn", "error", "info" ] }],
        "no-var": "error",
        "no-undef": "off",
        "prefer-const": "warn",
        "arrow-body-style": "error",
        "no-nested-ternary": "error",
        "curly": "error",
        "no-else-return": "error",
        "no-implicit-coercion": "error"
      }
    }
  ] satisfies Linter.Config[];
}
