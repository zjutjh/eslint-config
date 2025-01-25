import { Linter } from "eslint";
import { OptionsOverrides } from "src/types";

import { interopDefault } from "../utils";

export default async function typescript(
  options: OptionsOverrides
) {
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
        "@typescript-eslint": pluginTs as any
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
          tsconfigRootDir: process.cwd()
        }
      }
    },
    {
      name: "zjutjh/typescript/rules",
      rules: {
        ...pluginTs.configs.strict.rules,
        "@typescript-eslint/ban-ts-comment": ["error", { "ts-expect-error": "allow-with-description" }],
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-unused-expressions": ["error", {
          allowShortCircuit: true,
          allowTaggedTemplates: true,
          allowTernary: true
        }],

        ...options.overrides
      }
    }
  ] as Linter.Config[];
}
