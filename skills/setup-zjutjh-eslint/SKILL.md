---
name: setup-zjutjh-eslint
description: 在 JS/TS/Vue/React 项目中接入 @zjutjh/eslint-config（ESLint Flat Config）。用户提到 eslint / lint / 代码规范 / 代码检查 / @zjutjh 等相关需求时触发。
---

# 接入 `@zjutjh/eslint-config`

本技能用于把 `@zjutjh/eslint-config`（ESLint Flat Config）接入到用户项目里：安装依赖、生成 `eslint.config.*`、补齐 `lint` 脚本、给 VSCode 配置 `eslint.validate`。目标是“可以直接跑起来”，并尽量减少首次运行时的交互式安装。

## 产出清单（最终必须给用户这些落地改动）

- `eslint.config.ts` 或 `eslint.config.mjs`（优先不破坏项目模块体系）
- `package.json` 新增/更新 `scripts.lint`（可选 `scripts.lint:fix`）
- 可选：`.vscode/settings.json`（仅配置必要的 `eslint.validate`，避免过度覆盖用户设置）

## 前置条件与风险提示（要明确告诉用户）

直接让用户安装“最新版本”的依赖即可：

- `eslint`（建议装最新稳定版）
- `@zjutjh/eslint-config@latest`

如果用户反馈首次运行 `eslint` 触发了交互式依赖安装或版本不兼容，再按提示补齐依赖或调整版本即可。

## 操作流程（按顺序执行）

### 1) 识别项目上下文

收集以下信息（读文件 / 搜索文件，用你可用的工具完成即可）：

1. 读取根目录 `package.json`，从中判断：
   - 包管理器：优先看 `packageManager` 字段；同时记录 `engines.node`（用于后续判断是否需要 `jiti`）。
   - 语言：是否有 `typescript` 依赖。
   - 框架：是否有 `vue` / `react` 依赖。
2. 在根目录查找锁文件（`pnpm-lock.yaml` / `package-lock.json` / `yarn.lock` / `bun.lockb`），确认包管理器（与步骤 1 互为补充）。
3. 查找 `tsconfig.json`（确认 TS 项目）和已有的 `eslint.config.*` / `.eslintrc*`。
4. 查找 `.nvmrc` 或 `.node-version`（辅助判断 Node 版本，用于决定是否安装 `jiti`）。

> **已有旧版 `.eslintrc*` 的情况**：本 skill 目前不覆盖旧格式到 Flat Config 的完整迁移，仅新增 `eslint.config.*`。如果项目同时存在两套配置，需告知用户手动删除旧配置文件，避免配置冲突。

#### Monorepo/工作区（必须特别处理）

该项目会基于“当前执行 ESLint 的目录”的 `node_modules` 来识别要启用哪些规则。

- `@zjutjh/eslint-config` 内部用 `local-pkg` 的 `isPackageExists()`（等价于从 `process.cwd()` 附近找依赖）来决定是否启用 `vue/ts/react/jsx` 等配置。
- 在 monorepo 里，根目录 `package.json` 可能没有 `react/vue/typescript`，但子包有；如果你在根目录运行 `eslint`，自动识别会认为“没有这些依赖”，导致对应规则集不会启用。

所以在 monorepo 场景，需要 agent：

1) 先去 workspace 的各个包里找依赖（扫描 `packages/*/package.json`、`apps/*/package.json`，或 `package.json#workspaces` 指定的路径）
2) 把“需要启用的能力”在 `zjutjh()` 工厂函数参数里显式声明，而不是依赖自动识别
3) 推荐把 ESLint、`@zjutjh/eslint-config`、以及后续被提示的 lint 插件依赖都安装在 workspace 根目录，并且在根目录执行 `lint` 命令

推荐做法（让用户最少踩坑）：

- `eslint.config.*` 放在 workspace 根目录
- `eslint`、`@zjutjh/eslint-config`、以及 lint 过程中提示缺失的插件，都装到 workspace 根目录（pnpm 可用 `pnpm add -Dw ...`）
- `lint` 命令也在 workspace 根目录执行（例如 `pnpm run lint`）

### 2) 选择配置文件类型（尽量少装依赖）

推荐策略：

- 项目已经在用 TypeScript（且用户不排斥）：使用 `eslint.config.ts`。
  - 这时 Node `<24` 通常需要 `jiti` 让 ESLint 读取 TS 配置。
- 否则：使用 `eslint.config.mjs`。
  - 这样不需要 `typescript/jiti`，也避免 CJS 项目 `require()` ESM 包的问题。

### 3) 安装依赖（按包管理器输出准确命令）

先装必需依赖：

- `eslint`
- `@zjutjh/eslint-config`

在 monorepo 场景，默认按“workspace 根目录”作为安装与执行目录（装在根、跑在根）。

pnpm 示例：

```bash
pnpm add -D eslint @zjutjh/eslint-config@latest
```

如果你选了 `eslint.config.ts`，额外装：

- `typescript`
- `jiti`：Node 版本判断顺序——先读 `package.json#engines.node`，再看 `.nvmrc` / `.node-version`，若均无法确定则保守地装上；明确 Node `>=24` 时可跳过。

然后根据你识别出来的技术栈，依赖当前项目的能力“按需自动安装”可选依赖：

- 先把 `zjutjh()` 里需要的能力显式开启（见下方 Monorepo 推荐写法/示例）。
- 接着直接运行一次 `lint`：如果缺少对应 ESLint 插件依赖，配置会在运行时提示并引导安装（按提示确认即可）。

### 4) 写入 ESLint Flat Config

在项目根目录创建 `eslint.config.ts` 或 `eslint.config.mjs`（代码相同，只是文件名不同）：

```ts
import zjutjh from "@zjutjh/eslint-config";

export default zjutjh();
```

#### Monorepo：在 `zjutjh()` 中显式开启能力（推荐）

当你已经在 workspace 的某些子包里发现了对应依赖（例如 `apps/web` 有 `react`、`packages/ui` 有 `vue`、项目里普遍用 TS），就直接在根配置里显式声明：

```ts
import zjutjh from "@zjutjh/eslint-config";

export default zjutjh({
  ts: true,
  vue: true,
  react: true,
  jsx: true
});
```

说明要点：

- 这一步的目的就是绕过“根目录没有 react/vue/typescript 依赖导致自动识别失败”的问题。
- 显式开启后，如果相关插件依赖在当前目录缺失，首次运行仍可能触发交互式安装提示（按提示确认即可）。

如果用户提出“禁用/调整某条规则”，使用 `overrides` 进行最小改动，例如：

```ts
import zjutjh from "@zjutjh/eslint-config";

export default zjutjh({
  overrides: {
    vue: {
      "vue/multi-word-component-names": ["off"]
    }
  }
});
```

如果用户想启用 Prettier（通过 ESLint 调用）：

```ts
export default zjutjh({
  prettier: true
});
```

### 5) 更新 `package.json` 脚本

推荐：

```json
{
  "scripts": {
    "lint": "eslint"
  }
}
```

需要修复时，不额外声明 `lint:fix`，而是手动带参数执行：

- pnpm：`pnpm run lint --fix`

### 6) VSCode（或类似 IDE）配置

> 如果用户使用 WebStorm、Neovim 等其他 IDE，可跳过本步骤，或按对应 IDE 的 ESLint 插件文档配置。

提醒：先在命令行跑一遍 `lint`，确保依赖已补齐，再配置编辑器插件。

在 `.vscode/settings.json` 里只做必要配置：

```jsonc
{
  "eslint.validate": [
    "javascript",
    "typescript",
    "vue"
    // React 项目再加："javascriptreact", "typescriptreact"
  ],
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

如果用户安装了 Prettier 插件并出现格式化冲突，建议在工作区关闭：`"prettier.enable": false`。

### 7) 验证与收尾

按步骤 1 识别出的包管理器执行：

```bash
# pnpm
pnpm run lint
# npm
npm run lint
# yarn
yarn lint
# bun
bun run lint
```

首次接入时 ESLint 可能会触发交互式安装（补齐可选 peer deps）。按提示安装完成后，再跑一次 `lint` 直至干净。

## 常见问题排查

- 找不到配置文件：确认 `eslint.config.*` 在项目根目录，文件名正确。
- CJS 项目导入 ESM：不要用 `eslint.config.cjs` 去 `require()`；改用 `eslint.config.mjs`。
- 想看“最终生效配置”：推荐使用 `@eslint/config-inspector` 帮助调试。
