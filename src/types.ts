import { ParserOptions } from "@typescript-eslint/parser";
import { Linter } from "eslint";

export type OverridesConfigs = {
  vue?: Linter.RulesRecord,
  ts?: Linter.RulesRecord,
  stylistic?: Linter.RulesRecord,
};

export type OptionsConfig = {
  vue?: boolean;
  ts?: boolean | (OptionsOverrides & OptionsTypeScriptParserOptions)
  taro?: boolean;
  formatter?: boolean | OptionsFormatter;
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

export interface OptionsFormatter {
  /**
   * 自定义 prettier 配置
   * @see https://prettier.io/docs/options
   */
  prettier: Record<string, any>
}