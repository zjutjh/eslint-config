import { Linter } from "eslint";
import { OptionsOverrides, OptionsTypeScriptParserOptions } from "../types";

import { ensurePackages, interopDefault } from "../utils";
import { TS_GLOBS } from "../globs";

export default async function typescript(
  options: OptionsOverrides & OptionsTypeScriptParserOptions
): Promise<Linter.Config[]> {
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
        // @ts-expect-error 依赖的类型有问题，不影响使用
        "@typescript-eslint": pluginTs
      }
    },
    {
      name: "zjutjh/typescript/parser",
      files: TS_GLOBS,
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
  ];
}
