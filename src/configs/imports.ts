import { Linter } from "eslint";
import importXPlugin, { flatConfigs as importXFlatConfigs } from "eslint-plugin-import-x";
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
        ...importXFlatConfigs.recommended.rules,
        /**
         * 一般都使用打包工具，这项可以关闭
         * @see https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-unresolved.md#when-not-to-use-it
         */
        "import-x/no-unresolved": "off"
      }
    }
  ];
}
