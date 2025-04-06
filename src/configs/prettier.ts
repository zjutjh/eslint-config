import { Linter } from "eslint";
import { Options as PrettierOptions } from "prettier";

import { CSS_GLOBS, HTML_GLOBS, JS_GLOBS, JSON_GLOBS, LESS_GLOBS, SASS_GLOBS, TS_GLOBS, VUE_GLOBS } from "../globs";
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
      files: [...VUE_GLOBS, ...TS_GLOBS, ...JS_GLOBS],
      ...configPrettier
    } : {},
    enableESFormat ? {
      name: "zjutjh/prettier/es",
      files: [...VUE_GLOBS, ...TS_GLOBS, ...JS_GLOBS],
      rules: {
        "prettier/prettier": ["error", mergedPrettierOptions]
      }
    } : {},
    enableCSSFormat ? {
      name: "zjutjh/prettier/css",
      files: [...CSS_GLOBS, LESS_GLOBS, SASS_GLOBS],
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
      files: [...HTML_GLOBS],
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
      files: [...JSON_GLOBS],
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
