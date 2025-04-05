# `@zjutjh/eslint-config`

[![npm-version](https://img.shields.io/npm/v/%40zjutjh%2Feslint-config
)](https://www.npmjs.com/package/@zjutjh/eslint-config)

zjutjh 的 ESLint 配置，适用于 JS, TS, Vue3 项目。

## 使用方式

> [!IMPORTANT]
> ESLint 版本需要 ^9.9.0 以上，Node 版本需要 ^18.18.0 以上

```sh
# 确保你已经安装了 eslint
$ pnpm add -D eslint

$ pnpm add -D @zjutjh/eslint-config

# 如果你想使用 ts 编写配置文件，还需要安装 typescript, jiti 来帮助 eslint 解析配置
$ pnpm add -D typescript jiti
```

```ts
// @filename eslint.config.ts
import zjutjh from "@zjutjh/eslint-config";

export default zjutjh();
```

```ts
// 添加定制化配置
export default [
  ...await zjutjh(),
  {
    name: "local/ignores",
    ignores: [
      "dist"
    ]
  }
]
```

> [!TIP]
> 在项目中调整配置时，如果对最终计算出的的配置有疑问，可以使用 [@eslint/config-inspector](https://github.com/eslint/config-inspector) 来调试配置。

```ts
// 覆盖原有配置
export default [
  ...await zjutjh({
    overrides: {
      vue: {
        "vue/multi-word-component-names": "off"
      }
    }
  })
]
```

> [!WARNING]
> 不要在数组内添加新的配置来修改原有配置，请使用函数提供的 overrides 属性来修改。
>
> 在一个配置对象内，一条规则的生效需要声明出对应的插件。对于用户而言，在工厂函数 `zjutjh()` 之外声明规则，无法直接获知一条规则对应的插件是什么。
> 所以函数开放了 `overrides` 入口来透传配置到内部的配置对象中。自定义的配置被带到合适插件的生效范围之下，并结合 JS 声明同名的对象属性来支持配置的覆盖。

在 `package.json` 中添加如下命令。

```json
{
  "scripts": {
    "lint": "eslint"
  }
}
```

在项目中运行即可。如果有提示按照依赖，请按照提示出的包名安装（应该安装到 `devDependencies`）。

```sh
$ npm run lint
```

## 代码格式化

很多人在意代码的格式化，这里单独拿出一章讲。

支持使用 `@stylistic/eslint-plugin` (lint 工具对格式的检查) 或者传统的 formatter 工
具 (Prettier) 来对代码进行格式化。具体配置放在 `options.codeStyle` 下面。codeStyle 默认
开启，以`@stylistic/eslint-plugin` 做为默认的风格规范工具。如果要使用 prettier，需要手动开启。

> [!TIP]
> lint 工具对格式的检查和 formatter 在配置上互斥，选择其中之一即可，我们会保证两者在大部分场景下代码风格的一致性。一般来说，formatter 的规则比 lint 工具更严格。

```
// 启用 formatter，可选传入 prettier 的相关配置
export default [
  ...(await zjutjh({
    codeStyle: {
      tool: "formatter"
      prettier: {}
    }
  })),
];
```

stylistic 只对 js(x) 和 ts(x) 进行格式化，而 formatter 还对其他文件，如 css，json，html 配置了格式化。
如果你要格式化这些文件，需要配置编辑器来允许 eslint 校验这些类型的文件。

```jsonc
// 可以参考仓库下的 .vscode/settings.json 给 vscode 配置
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
> 我们使用 eslint 调用 prettier 可执行文件来进行代码格式化，所以你的编辑器不需要安装 prettier 插件，有 eslint 插件就行。prettier 的格式化配置声明在仓库代码内部，如果启用了 prettier 插件，他读取不到内部的配置，会按照默认的配置来格式化，这会导致代码风格不一致。

## 开发指南

推荐使用官方的 [@eslint/config-inspector](https://github.com/eslint/config-inspector) 来可视化调试配置。

```sh
$ npm run dev
```

在 `src/configs` 目录下，分出了每个语言/依赖的配置，如果需要对现有配置修改或删除，找到对应的条目即可。

如果需要添加对一门新的语言/依赖的支持，也是在 `src/configs` 目录下添加新文件。注意给每个配置对象加上 `name` 属性，方便在 inspector 中检索。
