import { ParserOptions } from "@typescript-eslint/parser";
import { Linter } from "eslint";
import { Options as PrettierOptions } from "prettier";

export type OverridesConfigs = {
  vue?: Linter.RulesRecord,
  ts?: Linter.RulesRecord,
  stylistic?: Linter.RulesRecord,
};

export type OptionsConfig = {
  vue?: boolean;
  ts?: boolean | (OptionsOverrides & OptionsTypeScriptParserOptions)
  taro?: boolean;
  prettier?: boolean | OptionsPrettier;
  overrides?: OverridesConfigs;
};

export type OptionsOverrides = {
  overrides?: Linter.RulesRecord
};

export type OptionsVue = {
  ts: boolean,
  taro: boolean
};

export interface OptionsTypeScriptParserOptions {
  parserOptions?: Partial<ParserOptions>
}

export interface OptionsPrettier {
  prettierSelfOption?: PrettierOptions
  /** 对哪些文件启用 prettier，默认全部启用 */
  lang?: {
    /** js, ts, vue 文件 */
    es: boolean,
    /** css, less, scss 文件 */
    css: boolean,
    html: boolean,
    /** json, json5, jsonc 文件 */
    json: boolean
  }
}