import { Linter } from "eslint";
import simpleImportSortPlugin from "eslint-plugin-simple-import-sort";

import { ensurePackages, interopDefault } from "../utils";

export default async function imports(): Promise<Linter.Config[]> {

  await ensurePackages([
    "eslint-plugin-import-x"
  ]);

  const pluginImportX = await interopDefault(import("eslint-plugin-import-x"));

  return [
    {
      name: "zjutjh/imports/setup",
      plugins: {
        "simple-import-sort": simpleImportSortPlugin,
        "import-x": pluginImportX
      }
    },
    {
      name: "zjutjh/imports/rules",
      rules: {
        "simple-import-sort/imports": "error",
        "simple-import-sort/exports": "error",
        "import-x/no-duplicates": "error"
      }
    }
  ];
}
