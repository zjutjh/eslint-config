import { Linter } from "eslint";
import javascript from "./configs/javascript";
import stylistic from "./configs/stylistic";
import { isPackageExists } from "local-pkg";
import vue from "./configs/vue";
import { Options } from "./types";
import typescript from "./configs/typescript";

export default async function zjutjh(options?: Options) {
  const {
    vue: enableVue = isPackageExists("vue"),
    ts: enableTs = isPackageExists("typescript"),
    taro: isTaroProj = isPackageExists("@tarojs/taro")
  } = options ?? {};

  const configs: Linter.Config[][] = [];

  configs.push(javascript());
  configs.push(stylistic());

  if (enableVue) {
    configs.push(
      await vue({ ts: enableTs, taro: isTaroProj })
    );
  }

  if (enableTs) configs.push(await typescript());

  return configs.flat(1) satisfies Linter.Config[];
}