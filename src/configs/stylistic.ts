import pluginStylistic from "@stylistic/eslint-plugin";
import { Linter } from "eslint";
import { OptionsOverrides } from "src/types";

export default function stylistic(
  options: OptionsOverrides
): Linter.Config[] {

  return [
    {
      name: "zjutjh/stylistic/rules",
      plugins: {
        "@stylistic": pluginStylistic
      },
      rules: {
        "@stylistic/indent": ["error", 2],
        "@stylistic/keyword-spacing": "error",
        "@stylistic/key-spacing": "error",
        "@stylistic/no-trailing-spaces": "error",
        "@stylistic/linebreak-style": ["error", "unix"],
        "@stylistic/quotes": ["error", "double"],
        "@stylistic/function-call-spacing": "error",
        "@stylistic/semi": "error",
        "@stylistic/no-multiple-empty-lines": ["warn", { max: 1 }],
        "@stylistic/object-curly-spacing": ["error", "always"],
        "@stylistic/arrow-spacing": "error",
        "@stylistic/block-spacing": "error",
        "@stylistic/brace-style": "error",
        "@stylistic/comma-dangle": "error",
        "@stylistic/no-multi-spaces": "error",
        "@stylistic/comma-spacing": "error",
        "@stylistic/switch-colon-spacing": "error",
        "@stylistic/type-annotation-spacing": "error",

        "@stylistic/space-before-blocks": "error",
        "@stylistic/space-before-function-paren": ["error", {
          "anonymous": "never",
          "named": "never",
          "asyncArrow": "always"
        }],
        "@stylistic/space-in-parens": "error",
        "@stylistic/space-infix-ops": "error",
        "@stylistic/spaced-comment": "error",

        ...options.overrides
      }
    }
  ];
}
