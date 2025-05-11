import { Linter } from "eslint";
import { Options as PrettierOptions } from "prettier";

import { GLOB_CSS, GLOB_HTML, GLOB_JS, GLOB_JSON, GLOB_JSON5, GLOB_JSONC, GLOB_JSX, GLOB_LESS, GLOB_SCSS, GLOB_TS, GLOB_TSX, GLOB_VUE } from "../globs";
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
  await ensurePackages([
    "eslint-plugin-format",
    "eslint-plugin-prettier",
    "eslint-config-prettier",
    "prettier"
  ]);

  const [configPrettier, pluginFormat] = await Promise.all([
    interopDefault(import("eslint-plugin-prettier/recommended")),
    interopDefault(import("eslint-plugin-format"))
  ] as const);

  const {
    es: enableESFormat = true,
    html: enableHTMLFormat = true,
    css: enableCSSFormat = true,
    json: enableJSONFormat = true
  } = options?.lang ?? {};

  const mergedPrettierOptions = {
    ...prettierOptions,
    ...options?.prettierSelfOptions
  };

  return [
    enableESFormat ? {
      name: "zjutjh/prettier/setup",
      files: [GLOB_VUE, GLOB_TS, GLOB_JS, GLOB_TSX, GLOB_JSX],
      ...configPrettier
    } : {},
    enableESFormat ? {
      name: "zjutjh/prettier/es",
      files: [GLOB_VUE, GLOB_TS, GLOB_JS, GLOB_TSX, GLOB_JSX],
      rules: {
        "prettier/prettier": ["error", mergedPrettierOptions]
      }
    } : {},
    enableCSSFormat ? {
      name: "zjutjh/prettier/css",
      files: [GLOB_CSS, GLOB_LESS, GLOB_SCSS],
      languageOptions: {
        parser: pluginFormat.parserPlain
      },
      plugins: {
        format: pluginFormat
      },
      rules: {
        "format/prettier": ["error", { parser: "css", mergedPrettierOptions }]
      }
    } : {},
    enableHTMLFormat ? {
      name: "zjutjh/prettier/html",
      files: [GLOB_HTML],
      languageOptions: {
        parser: pluginFormat.parserPlain
      },
      plugins: {
        format: pluginFormat
      },
      rules: {
        "format/prettier": ["error", { parser: "html", mergedPrettierOptions }]
      }
    } : {},
    enableJSONFormat ? {
      name: "zjutjh/prettier/json",
      files: [GLOB_JSON, GLOB_JSON5, GLOB_JSONC],
      languageOptions: {
        parser: pluginFormat.parserPlain
      },
      plugins: {
        format: pluginFormat
      },
      rules: {
        "format/prettier": ["error", { parser: "json", mergedPrettierOptions }]
      }
    } : {}
  ];
}
