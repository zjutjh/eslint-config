# `@zjutjh/eslint-config`

[![npm-version](https://img.shields.io/npm/v/%40zjutjh%2Feslint-config
)](https://www.npmjs.com/package/@zjutjh/eslint-config)

zjutjh 的 ESLint 配置，适用于 JS, TS, Vue3 项目。

## 使用方式

> [!IMPORTANT]
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

> [!TIP]
> 在项目中使用调整配置时，如果对最终计算出的的配置有疑问，可以使用 [@eslint/config-inspector](https://github.com/eslint/config-inspector) 来调试配置。

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

在项目中运行即可。如果有提示按照依赖，请按照提示出的包名安装。

```
npm run eslint
```

## 开发指南

推荐使用官方的 [@eslint/config-inspector](https://github.com/eslint/config-inspector) 来可视化调试配置。

```
npm run dev
```

在 `src/configs` 目录下，分出了每个语言/依赖的配置，如果需要对现有配置修改或删除，找到对应的条目即可。

如果需要添加对一门新的语言/依赖的支持，也是在 `src/configs` 目录下添加新文件。注意给每个配置对象加上 `name` 属性，方便在 inspector 中检索。
