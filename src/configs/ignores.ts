import { existsSync } from "node:fs";
import { isAbsolute, resolve } from "node:path";

import { includeIgnoreFile } from "@eslint/compat";
import { Linter } from "eslint";

import { GLOBS_EXCLUDES } from "../globs";
import { OptionsIgnores } from "../types";

export default function ignores(options?: OptionsIgnores): Linter.Config[] {
  const { gitignore = false } = options ?? {};

  const configs: Linter.Config[] = [
    {
      name: "zjutjh/ignores",
      ignores: [...GLOBS_EXCLUDES, ...(options?.userIgnores ?? [])]
    }
  ];

  if (gitignore !== false) {
    const path = gitignore === true ? ".gitignore" : gitignore;
    const absolute = isAbsolute(path) ? path : resolve(process.cwd(), path);
    // 显式指定的路径不存在时报错；隐式默认值不存在时静默跳过
    if (existsSync(absolute)) {
      configs.push(includeIgnoreFile(absolute, "zjutjh/gitignore"));
    } else if (gitignore !== true) {
      throw new Error(`gitignore file not found: ${absolute}`);
    }
  }

  return configs;
}
