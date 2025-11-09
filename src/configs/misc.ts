import { Linter } from "eslint";
import uniconPlugin from "eslint-plugin-unicorn";

export default function misc(): Linter.Config[] {

  return [
    {
      name: "zjutjh/misc/setup",
      plugins: {
        unicorn: uniconPlugin
      }
    },
    {
      name: "zjutjh/misc/rules",
      rules: {
        "unicorn/filename-case": [
          "error",
          {
            "case": "kebabCase"
          }
        ]
      }
    }
  ];
}
