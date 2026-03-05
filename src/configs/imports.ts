import { Linter } from "eslint";
import importXPlugin from "eslint-plugin-import-x";
import simpleImportSortPlugin from "eslint-plugin-simple-import-sort";

export default function imports(): Linter.Config[] {

  return [
    {
      name: "zjutjh/imports/setup",
      plugins: {
        "simple-import-sort": simpleImportSortPlugin,
        "import-x": importXPlugin
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
