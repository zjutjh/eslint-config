# `@zjutjh/eslint-config`

[![npm-version](https://img.shields.io/npm/v/%40zjutjh%2Feslint-config
)](https://www.npmjs.com/package/@zjutjh/eslint-config)

zjutjh 的 ESLint 配置，适用于 JS, TS, Vue3 项目。

## 使用方式

> [!NOTE]
> ESLint 版本需要 ^9.0.0 以上，Node 版本需要 ^18.18.0 以上

```sh
$ pnpm add -D @zjutjh/eslint-config
```

```ts
// @filename eslint.config.mjs
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

在项目中运行即可。如果有提示按照依赖，请按照提示出的报名安装。

```
npm run eslint
```

## 开发指南

推荐使用官方的 [@eslint/config-inspector](https://github.com/eslint/config-inspector) 来可视化调试配置。

```
npm run dev
```

在 `src/configs` 目录下，分出了每个语言/依赖的配置，如果需要对现有配置修改或删除，找到对应的条目即可。

如果需要添加对一门新的语言/依赖的支持，也是在 `src/configs` 目录下添加新文件。注意给每个配置对象加上 `name` 属性，方便 inspector 检索。
