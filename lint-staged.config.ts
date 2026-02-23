import type { Configuration } from "lint-staged";

export default {
  "*.ts": ["eslint --fix"],
  "*": ["cspell"]
} satisfies Configuration;
