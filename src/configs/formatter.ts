import { Linter } from "eslint";

import { OptionsFormatter, OptionsOverrides } from "../types";
import { ensurePackages, interopDefault } from "../utils";

/**
 * @see https://prettier.io/docs/options
 */
const prettierOptions = {
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

export default async function formatter(
  options?: OptionsOverrides & OptionsFormatter
): Promise<Linter.Config[]> {
  await ensurePackages([
    "eslint-plugin-format"
  ]);

  const [
    pluginFormat
  ] = await Promise.all([
    interopDefault(import("eslint-plugin-format"))
  ] as const);

  const mergedPrettierOptions = {
    ...prettierOptions,
    ...options?.prettier
  };

  return [
    {
      name: "zjutjh/formatter/setup",
      plugins: {
        format: pluginFormat
      }
    },
    {
      name: "zjutjh/formatter/css/rules",
      languageOptions: {
        parser: pluginFormat.parserPlain
      },
      files: [
        "**/*.less",
        "**/*.css",
        "**/*.scss",
        "**/*.sass"
      ],
      rules: {
        "format/prettier": ["error", { parser: "css", ...mergedPrettierOptions }]
      }
    },
    {
      name: "zjutjh/formatter/vue/rules",
      languageOptions: {
        parser: pluginFormat.parserPlain
      },
      files: [
        "**/*.vue"
      ],
      rules: {
        "format/prettier": ["error", { parser: "vue", ...mergedPrettierOptions }]
      }
    },
    {
      name: "zjutjh/formatter/json/rules",
      languageOptions: {
        parser: pluginFormat.parserPlain
      },
      files: [
        "**/*.json"
      ],
      rules: {
        "format/prettier": ["error", { parser: "json", ...mergedPrettierOptions }]
      }
    },
    {
      name: "zjutjh/formatter/html/rules",
      languageOptions: {
        parser: pluginFormat.parserPlain
      },
      files: [
        "**/*.html"
      ],
      rules: {
        "format/prettier": ["error", { parser: "html", ...mergedPrettierOptions }]
      }
    },
    {
      name: "zjutjh/formatter/js/rules",
      languageOptions: {
        parser: pluginFormat.parserPlain
      },
      files: ["**/*.js", "**/*.jsx"],
      rules: {
        "format/prettier": ["error", { parser: "babel", ...mergedPrettierOptions }]
      }
    },
    {
      name: "zjutjh/formatter/ts/rules",
      languageOptions: {
        parser: pluginFormat.parserPlain
      },
      files: ["**/*.ts", "**/*.tsx"],
      rules: {
        "format/prettier": ["error", { parser: "typescript", ...mergedPrettierOptions }]
      }
    }
  ];
}
