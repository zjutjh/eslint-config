import { Linter } from "eslint";
import type { FormatOptions as OxfmtFormatOptions } from "oxfmt";

import { GLOB_CSS, GLOB_HTML, GLOB_JS, GLOB_JSON, GLOB_JSON5, GLOB_JSONC, GLOB_JSX, GLOB_LESS, GLOB_SCSS, GLOB_TS, GLOB_TSX, GLOB_VUE, GLOB_YAML } from "../globs";
import { OptionsOxfmt } from "../types";
import { ensurePackages, interopDefault } from "../utils";

/**
 * @see https://oxc.rs/docs/guide/usage/formatter
 */
const oxfmtOptions: OxfmtFormatOptions = {
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
  htmlWhitespaceSensitivity: "css",
  vueIndentScriptAndStyle: false,
  endOfLine: "lf",
  embeddedLanguageFormatting: "auto",
  singleAttributePerLine: false
};

export default async function oxfmt(
  options?: OptionsOxfmt
): Promise<Linter.Config[]> {
  await ensurePackages(["eslint-plugin-format", "oxfmt"]);

  const pluginFormat = await interopDefault(import("eslint-plugin-format"));

  const {
    es: enableESFormat = true,
    html: enableHTMLFormat = true,
    css: enableCSSFormat = true,
    json: enableJSONFormat = true,
    yaml: enableYAMLFormat = true
  } = options?.lang ?? {};

  const mergedOptions = {
    ...oxfmtOptions,
    ...options?.oxfmtSelfOptions
  };

  return [
    enableESFormat ? {
      name: "zjutjh/oxfmt/es",
      files: [GLOB_VUE, GLOB_TS, GLOB_JS, GLOB_TSX, GLOB_JSX],
      plugins: {
        format: pluginFormat
      },
      rules: {
        "format/oxfmt": ["error", mergedOptions]
      }
    } : {},
    enableCSSFormat ? {
      name: "zjutjh/oxfmt/css",
      files: [GLOB_CSS, GLOB_LESS, GLOB_SCSS],
      languageOptions: {
        parser: pluginFormat.parserPlain
      },
      plugins: {
        format: pluginFormat
      },
      rules: {
        "format/oxfmt": ["error", mergedOptions]
      }
    } : {},
    enableHTMLFormat ? {
      name: "zjutjh/oxfmt/html",
      files: [GLOB_HTML],
      languageOptions: {
        parser: pluginFormat.parserPlain
      },
      plugins: {
        format: pluginFormat
      },
      rules: {
        "format/oxfmt": ["error", mergedOptions]
      }
    } : {},
    enableJSONFormat ? {
      name: "zjutjh/oxfmt/json",
      files: [GLOB_JSON, GLOB_JSON5, GLOB_JSONC],
      languageOptions: {
        parser: pluginFormat.parserPlain
      },
      plugins: {
        format: pluginFormat
      },
      rules: {
        "format/oxfmt": ["error", mergedOptions]
      }
    } : {},
    enableYAMLFormat ? {
      name: "zjutjh/oxfmt/yaml",
      files: [GLOB_YAML],
      languageOptions: {
        parser: pluginFormat.parserPlain
      },
      plugins: {
        format: pluginFormat
      },
      rules: {
        "format/oxfmt": ["error", mergedOptions]
      }
    } : {}
  ];
}
