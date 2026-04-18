# Agent Instructions

本仓库是 `@zjutjh/eslint-config`，一个给 zjutjh 项目用的 ESLint Flat Config。依赖版本统一在 `pnpm-workspace.yaml` 的 `catalogs:` 下集中管理，`package.json` 里通过 `catalog:<group>` 引用。

## 依赖升级流程

使用本地 [taze](https://github.com/antfu-collective/taze) 统一升级依赖。

1. 运行 taze 检查并写入新版本：

   ```sh
   # 只升级 minor/patch
   pnpm dlx taze -r -w

   # 如果要评估 major 更新
   pnpm dlx taze major -r
   ```

   `-r` 是必要的，因为依赖版本写在 `pnpm-workspace.yaml` 的 catalogs 中而不是 `package.json` 的 `dependencies`。

2. 安装更新后的依赖：

   ```sh
   pnpm install
   ```

3. 跑一遍构建，验证产物没问题：

   ```sh
   pnpm build
   ```

   产物在 `dist/index.mjs` 和 `dist/index.d.mts`。

4. （可选）在一个空白项目里试跑打包产物，验证实际使用场景是否 work：

   ```sh
   # 在本仓库打包
   pnpm pack   # 生成 zjutjh-eslint-config-<version>.tgz

   # 新建一个测试项目（以 Vite React TS 为例）
   pnpm create vite@latest /tmp/eslint-test -- --template react-ts
   cd /tmp/eslint-test
   pnpm install

   # 把 tarball 装进去
   pnpm add -D /path/to/zjutjh-eslint-config-<version>.tgz

   # 装上必要的 peer dep（注意 eslint 必须是 ^10）
   pnpm add -D eslint@^10 jiti
   pnpm add -D @typescript-eslint/eslint-plugin @typescript-eslint/parser
   # 如果测 React 配置
   pnpm add -D "@eslint-react/eslint-plugin@^4.2.3"

   # 写 eslint.config.ts
   # import zjutjh from "@zjutjh/eslint-config";
   # export default zjutjh({ react: true, ts: true });

   pnpm lint
   ```

## 注意事项

- `taze` 默认只升级在当前 semver range 内的版本。对 `@eslint-react/eslint-plugin` 这种有大版本跨越的插件，major 升级需要手动评估。v4 已经合并了原本分散的 `@eslint-react/dom`/`hooks-extra`/`rsc`/`web-api` 子插件到单个 `@eslint-react`，同时移除了 `no-leaked-conditional-rendering` 等规则，`src/configs/react.ts` 需要配套调整。
- 升级后先 `pnpm build` 再 `pnpm lint`、`pnpm typecheck`，构建失败通常意味着 peer dep 版本冲突或 API 变更。
- 测试产物后记得清理：删除 `zjutjh-eslint-config-*.tgz` 以及 `/tmp` 下的测试项目目录。
- peer dep 的版本范围写在 `package.json` 的 `peerDependencies` 里，也需要人工同步 catalogs 里的新版本号。
