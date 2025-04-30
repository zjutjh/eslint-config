import { Linter } from "eslint";

import { GLOB_JSX, GLOB_TSX } from "../globs";

export default function jsx() {
  return [
    {
      name: "zjutjh/jsx/setup",
      files: [GLOB_TSX, GLOB_JSX],
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            jsx: true
          }
        }
      }
    }
  ] satisfies Linter.Config[];
}
