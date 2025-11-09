import { Linter } from "eslint";

import { GLOBS_EXCLUDES } from "../globs";
import { OptionsIgnores } from "../types";

export default function ignores(options?: OptionsIgnores): Linter.Config[] {
  return [
    {
      name: "zjutjh/ignores",
      ignores: [
        ...GLOBS_EXCLUDES,
        ...options?.userIgnores ?? []
      ]
    }
  ];
}
