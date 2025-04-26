import { Linter } from "eslint";

import { JSX_GLOBS, TSX_GLOBS } from "../globs";

export default function jsx() {
  return [
    {
      name: "zjutjh/jsx/setup",
      files: [...TSX_GLOBS, ...JSX_GLOBS],
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
