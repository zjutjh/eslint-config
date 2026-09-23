/**
 * 冒烟测试：用不同的配置组合对 fixtures/input 执行 `eslint --fix`，
 * 将修复结果和剩余诊断信息与 fixtures/output/<name> 下的快照对比。
 *
 * 规则变更后运行 `pnpm test -u` 更新快照，并在 PR 中 review 快照的 diff。
 *
 * @see https://github.com/antfu/eslint-config/blob/main/test/fixtures.test.ts
 */
import fs from "node:fs/promises";
import { join, relative, resolve } from "node:path";

import type { Linter } from "eslint";
import { x } from "tinyexec";
import { glob } from "tinyglobby";
import { afterAll, beforeAll, it } from "vitest";

import type { OptionsConfig } from "../src/types";

const root = resolve(import.meta.dirname, "..");
const eslintBin = resolve(root, "node_modules/eslint/bin/eslint.js");
const timeout = process.platform === "win32" ? 300_000 : 60_000;

/** 修复后的剩余诊断写到这个文件里一起做快照 */
const REPORT_FILE = "lint-report.txt";

beforeAll(async () => {
  await fs.rm(resolve(root, "_fixtures"), { recursive: true, force: true });
});
afterAll(async () => {
  await fs.rm(resolve(root, "_fixtures"), { recursive: true, force: true });
});

runWithConfig("js", { ts: false, vue: false, jsx: false, react: false }, [
  "**/*.ts",
  "**/*.tsx",
  "**/*.vue",
  "tsconfig.json"
]);
runWithConfig("ts", { ts: true, vue: false, react: false }, ["**/*.vue"]);
runWithConfig("vue", { ts: true, vue: true, react: false }, ["**/*.tsx", "**/*.jsx"]);
runWithConfig("react", { ts: true, vue: false, jsx: true, react: true }, ["**/*.vue"]);
runWithConfig("no-oxfmt", { ts: true, vue: true, react: true, oxfmt: false });

interface LintResult {
  filePath: string;
  messages: Linter.LintMessage[];
}

/**
 * @param name 配置组合名，对应 fixtures/output/<name>
 * @param options 传给 zjutjh() 的选项
 * @param exclude 这个组合下不参与测试的 fixture 文件（例如 js 组合不应处理 ts 文件）
 */
function runWithConfig(name: string, options: OptionsConfig, exclude: string[] = []) {
  it.concurrent(
    name,
    async ({ expect }) => {
      const from = resolve(root, "fixtures/input");
      const output = resolve(root, "fixtures/output", name);
      const target = resolve(root, "_fixtures", name);

      const inputFiles = await glob("**/*", { cwd: from, ignore: exclude });
      await Promise.all(
        inputFiles.map((file) => fs.cp(join(from, file), join(target, file), { recursive: true }))
      );

      // 直接引用 src，改完规则无需 build 即可测试
      const entry = relative(target, resolve(root, "src/index.ts")).replaceAll("\\", "/");
      await fs.writeFile(
        join(target, "eslint.config.ts"),
        `import zjutjh from "${entry}";

export default zjutjh(${JSON.stringify(options)}, { ignores: ["eslint.config.ts"] });
`
      );

      // 有无法自动修复的 error 时 eslint 退出码为 1，这是预期的；退出码 2 表示配置或运行时错误
      const proc = await x(process.execPath, [eslintBin, ".", "--fix", "--format", "json"], {
        nodeOptions: { cwd: target, stdio: "pipe" }
      });
      if (proc.exitCode !== 0 && proc.exitCode !== 1) {
        throw new Error(`ESLint exited with code ${String(proc.exitCode)}:\n${proc.stderr}`);
      }

      const results = JSON.parse(proc.stdout) as LintResult[];
      const fatal = results.flatMap((r) =>
        r.messages
          .filter((m) => m.fatal)
          .map((m) => `${relative(target, r.filePath)}:${m.line}:${m.column} ${m.message}`)
      );
      expect(fatal, "fixture 出现解析错误").toEqual([]);

      await Promise.all(
        inputFiles.map(async (file) => {
          const content = await fs.readFile(join(target, file), "utf-8");
          const source = await fs.readFile(join(from, file), "utf-8");
          const outputPath = join(output, file);
          if (content === source) {
            await fs.rm(outputPath, { force: true });
            return;
          }
          await expect.soft(content).toMatchFileSnapshot(outputPath);
        })
      );

      await expect
        .soft(formatReport(results, target))
        .toMatchFileSnapshot(join(output, REPORT_FILE));
    },
    timeout
  );
}

function formatReport(results: LintResult[], cwd: string): string {
  const lines = results
    .filter((r) => r.messages.length > 0)
    .map((r) => ({ file: relative(cwd, r.filePath).replaceAll("\\", "/"), messages: r.messages }))
    .sort((a, b) => a.file.localeCompare(b.file))
    .flatMap(({ file, messages }) => [
      file,
      ...messages.map((m) => {
        const severity = m.severity === 2 ? "error" : "warn ";
        return `  ${m.line}:${m.column}  ${severity}  ${m.ruleId ?? "-"}  ${m.message}`;
      }),
      ""
    ]);
  return lines.length > 0 ? lines.join("\n") : "No problems\n";
}
