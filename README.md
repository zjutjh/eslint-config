# `@zjutjh/eslint-config` [![npm-version](https://img.shields.io/npm/v/%40zjutjh%2Feslint-config)](https://www.npmjs.com/package/@zjutjh/eslint-config)

zjutjh 的 ESLint 配置，适用于 JS, TS, Vue3 等项目。

## 使用方式

> [!IMPORTANT]
> ESLint 版本需要 ^10.0.0 以上，Node 版本需要 ^20.19.0 以上

```sh
# 确保你已经安装了 eslint
$ pnpm add -D eslint

$ pnpm add -D @zjutjh/eslint-config

# 如果你想使用 ts 编写配置文件，还需要安装 typescript, jiti 来帮助 eslint 解析配置。（Node 24 版本后不需要安装 jiti）
$ pnpm add -D typescript jiti
```

```ts
// @filename eslint.config.ts
import zjutjh from "@zjutjh/eslint-config";

export default zjutjh();
```

### 命令行配置

本地的 git hooks 以及 CI 环境需要用命令来执行 lint。

在 `package.json` 中添加如下命令。

```json
{
  "scripts": {
    "lint": "eslint"
  }
}
```

在项目根目录运行下面的命令，没有报错就算配置成功。

```sh
$ npm run lint
```

> [!NOTE]
> 项目第一次接入时运行 `eslint` 可能会有安装依赖的交互式命令，按照提示完成依赖安装即可。
>
> 在每次修改依赖配置后，最好也运行一遍 lint 命令，部分配置项可能需要安装额外的依赖。

### 编辑器配置

> [!IMPORTANT]
> 配置编辑器插件之前，请先行一遍 lint 命令，安装所需的依赖。

常见的 IDE 有 VSCode 或者类似的套壳 IDE（如 Cursor, Trae 等），除了要安装 [eslint 插件](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) 之外，为了 lint JavaScript 以外的文件，还需要在项目里面给插件配置 lint 范围。

```jsonc
// 可以参考仓库下的 .vscode/settings.json
// @filename .vscode/settings.json
{
  "eslint.validate": [
    "vue",
    "typescript"
    // JSX 项目要配置
    // "typescriptreact"
  ]
}
```

大部分场景到这里就能使用了，不需要额外的配置。如果你想自定义一些配置，请往下看。

### 自定义配置

基于现有能力修改配置

```ts
export default zjutjh({
  overrides: {
    vue: {
      "vue/multi-word-component-names": ["off"]
    },
    stylistic: {
      "stylistic/quotes": ["error", "single"]
    }
  },
  ignores: [
    "**/build"
  ]
})
```

扩展 eslint 配置

```ts
export default zjutjh(
  // 第一个参数是 zjutjh 专用的配置
  {
    overrides: {
      stylistic: {
        "stylistic/quotes": ["error", "single"]
      }
    },
    ignores: [
      "**/build"
    ]
  },
  // 从第二个参数开始，可以任意传入多个 flat config
  {
    files: ["**/*.vue"],
    rules: {
      "vue/multi-word-component-names": ["off"]
    }
  },
  {
    // 不传入 files glob, 则对所有文件生效 */
    // files: [/** any globs */],
    plugins: {
      // 使用 eslint 插件
    },
    rules: {
      // 使用 eslint 规则
    }
  }
)
```

> [!TIP]
> 在项目中调整配置时，如果对最终生效的配置有疑问，可以使用 [@eslint/config-inspector](https://github.com/eslint/config-inspector) 来调试配置。

## 代码格式化

很多人在意代码的格式化，这里单独拿出一章讲。

内置两种格式化工具。`@stylistic/eslint-plugin` (lint 工具对格式的检查) 和传统的 formatter 工具
(Prettier) 。stylistic 默认开启，如果要使用 Prettier，需要手动开启。

```ts
// 启用 prettier
export default zjutjh({
  prettier: true
}),
```

支持自定义 prettier 格式化选项，以及关闭对部分文件的格式化（默认对支持的文件全部开启）

```ts
export default zjutjh({
  prettier: {
    prettierSelfOptions: {
      // 自定义 prettier 的格式化风格配置
    },
    lang: {
      html: false // 关闭对一些文件的格式化。默认对支持的文件全部开启
    }
  }
})
```

stylistic 只对 js(x) 和 ts(x) 进行格式化，而 prettier 还对其他文件，如 css，html 等的格式化。
如果你要**在编辑器中**自动格式化这些文件，需要配置编辑器来允许 eslint 校验这些类型的文件。

```jsonc
// @filename .vscode/settings.json
{
  "prettier.enable": false, // 如果安装了 prettier 插件，需要在项目中关闭
  "[scss]": {
    "editor.defaultFormatter": "dbaeumer.vscode-eslint"
  },
  "eslint.validate": [
    "scss"
  ]
}
```

> [!WARNING]
> 我们使用 eslint 调用 prettier 可执行文件来进行代码格式化，所以你的编辑器不需要安装 prettier 插件，有
> eslint 插件就行。prettier 的格式化配置声明在配置源码内部，如果启用了 prettier 插件，他读取不到内部的配置，
> 会按照默认的配置来格式化，这会导致代码风格不一致。

## 开发指南

推荐使用官方的 [@eslint/config-inspector](https://github.com/eslint/config-inspector) 来可视化调试配置。

```sh
$ npm run dev
```

在 `src/configs` 目录下，分出了每个语言/依赖的配置，如果需要对现有配置修改或删除，找到对应的条目即可。

如果需要添加对一门新的语言/依赖的支持，也是在 `src/configs` 目录下添加新文件。注意给每个配置对象加上 `name` 属性，方便在 inspector 中检索。
