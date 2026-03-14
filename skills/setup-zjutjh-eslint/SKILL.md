---
name: setup-zjutjh-eslint
description: 在任意 JS/TS/Vue3/React 项目中接入并配置 @zjutjh/eslint-config（ESLint Flat Config / eslint.config.*）。只要用户提到“接入 eslint 规则 / lint / 代码规范 / eslint.config / prettier 冲突 / zjutjh eslint”，就优先使用本技能来给出可落地的安装命令与配置文件改动。
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

读取项目根目录的 `package.json` 与锁文件来判断：

- 包管理器：优先看 `packageManager` 字段，其次看锁文件（`pnpm-lock.yaml`/`package-lock.json`/`yarn.lock`/`bun.lockb`）。
- 语言：是否 TypeScript（`typescript` 依赖、`tsconfig.json`、或大量 `.ts/.tsx`）。
- 框架：Vue（`vue` 依赖）、React（`react` 依赖）、或其他。
- 现有 ESLint：是否已有 `eslint.config.*` 或 `.eslintrc*`（如有，避免“全删重来”，而是迁移/并存策略要说明清楚）。

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
- `jiti`（Node 版本未知或 `<24` 时建议装上；Node `>=24` 可不装）

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

提醒：先在命令行跑一遍 `lint`，确保依赖已补齐，再配置编辑器插件。

在 `.vscode/settings.json` 里只做必要配置：

```jsonc
{
  "eslint.validate": [
    "typescript",
    "vue"
    // React 项目再加："typescriptreact"
  ],
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

如果用户安装了 Prettier 插件并出现格式化冲突，建议在工作区关闭：`"prettier.enable": false`。

### 7) 验证与收尾

执行：

```bash
pnpm run lint
```

首次接入时 ESLint 可能会触发交互式安装（补齐可选 peer deps）。按提示安装完成后，再跑一次 `lint` 直至干净。

## 常见问题排查

- 找不到配置文件：确认 `eslint.config.*` 在项目根目录，文件名正确。
- CJS 项目导入 ESM：不要用 `eslint.config.cjs` 去 `require()`；改用 `eslint.config.mjs`。
- 想看“最终生效配置”：推荐使用 `@eslint/config-inspector` 帮助调试。
