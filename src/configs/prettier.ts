import { Linter } from "eslint";
import { Options as PrettierOptions } from "prettier";

import { JS_GLOBS, TS_GLOBS, VUE_GLOBS } from "../globs";
import { OptionsPrettier } from "../types";
import { ensurePackages, interopDefault } from "../utils";

/**
 * @see https://prettier.io/docs/options
 */
const prettierOptions: PrettierOptions = {
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: false,
  quoteProps: "as-needed",
  jsxSingleQuote: false,
  trailingComma: "none",
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: "always",
  requirePragma: false,
  insertPragma: false,
  proseWrap: "preserve",
  htmlWhitespaceSensitivity: "css",
  vueIndentScriptAndStyle: false,
  endOfLine: "lf",
  embeddedLanguageFormatting: "auto",
  singleAttributePerLine: false
};

export default async function prettier(
  options?: OptionsPrettier
): Promise<Linter.Config[]> {
  await ensurePackages(["eslint-plugin-prettier", "eslint-config-prettier", "prettier"]);

  const [configPrettier] = await Promise.all([
    interopDefault(import("eslint-plugin-prettier/recommended"))
  ] as const);

  const mergedPrettierOptions = {
    ...prettierOptions,
    ...options
  };

  return [
    {
      files: [...VUE_GLOBS, ...TS_GLOBS, ...JS_GLOBS],
      name: "zjutjh/prettier/setup",
      ...configPrettier
    },
    {
      files: [...VUE_GLOBS, ...TS_GLOBS, ...JS_GLOBS],
      name: "zjutjh/prettier/rules",
      rules: {
        "prettier/prettier": ["error", mergedPrettierOptions]
      }
    }
  ];
}
