import { ParserOptions } from "@typescript-eslint/parser";
import { Linter } from "eslint";
import type { FormatOptions as OxfmtFormatOptions } from "oxfmt";

export interface OverridesConfigs {
  vue?: Linter.RulesRecord;
  ts?: Linter.RulesRecord;
  react?: Linter.RulesRecord;
}

export interface OptionsConfig extends OptionsComponentExts {
  vue?: boolean;
  ts?: boolean | OptionsTypeScriptParserOptions;
  taro?: boolean;
  jsx?: boolean;
  react?: boolean;
  oxfmt?: boolean | OptionsOxfmt;
  ignores?: string[];
  gitignore?: boolean | string;
  overrides?: OverridesConfigs;
}

export interface OptionsOverrides {
  overrides?: Linter.RulesRecord;
}

export interface OptionsComponentExts {
  componentExts?: string[];
}

export interface OptionsVue {
  ts: boolean;
  taro: boolean;
}

export interface OptionsTypeScriptParserOptions {
  parserOptions?: Partial<ParserOptions>;
}

export interface OptionsOxfmt {
  /** 传递给 oxfmt format() API 的选项，参考 https://oxc.rs/docs/guide/usage/formatter */
  oxfmtSelfOptions?: OxfmtFormatOptions;
  /** 对哪些文件启用 oxfmt，默认全部启用 */
  lang?: {
    /** js, ts, vue 文件 */
    es: boolean;
    /** css, less, scss 文件 */
    css: boolean;
    html: boolean;
    /** json, json5, jsonc 文件 */
    json: boolean;
    /** yaml, yml 文件 */
    yaml: boolean;
  };
}

export interface OptionsIgnores {
  userIgnores?: string[];
  gitignore?: boolean | string;
}
