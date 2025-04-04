import { Linter } from "eslint";
import { OptionsOverrides, OptionsTypeScriptParserOptions } from "src/types";

import { ensurePackages, interopDefault } from "../utils";

export default async function typescript(
  options: OptionsOverrides & OptionsTypeScriptParserOptions
) {
  const {
    overrides,
    parserOptions
  } = options;

  await ensurePackages([
    "@typescript-eslint/eslint-plugin",
    "@typescript-eslint/parser"
  ]);

  const [
    pluginTs,
    parserTs
  ] = await Promise.all([
    await interopDefault(import("@typescript-eslint/eslint-plugin")),
    await interopDefault(import("@typescript-eslint/parser"))
  ] as const);

  return [
    {
      name: "zjutjh/typescript/setup",
      plugins: {
        "@typescript-eslint": pluginTs
      }
    },
    {
      name: "zjutjh/typescript/parser",
      files: ["**/*.?([cm])ts"],
      languageOptions: {
        parser: parserTs,
        parserOptions: {
          ecmaVersion: 2022,
          sourceType: "module",
          projectService: {
            allowDefaultProject: ["./*.js"],
            defaultProject: "./tsconfig.json"
          },
          tsconfigRootDir: process.cwd(),
          ...parserOptions
        }
      }
    },
    {
      name: "zjutjh/typescript/rules",
      rules: {
        ...pluginTs.configs.strict.rules,
        "@typescript-eslint/ban-ts-comment": ["error", { "ts-expect-error": "allow-with-description" }],
        "@typescript-eslint/no-shadow": "error",
        "@typescript-eslint/no-non-null-assertion": "error",
        "@typescript-eslint/no-empty-function": "error",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unused-expressions": ["error", {
          allowShortCircuit: true,
          allowTaggedTemplates: true,
          allowTernary: true
        }],

        ...overrides
      }
    }
  ] as Linter.Config[];
}
