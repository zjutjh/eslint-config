import { Linter } from "eslint";

export type OverridesConfigs = {
  vue?: Linter.RulesRecord,
  ts?: Linter.RulesRecord,
  stylistic?: Linter.RulesRecord,
}

export type OptionsConfig = {
  vue?: boolean;
  ts?: boolean;
  taro?: boolean;
  overrides?: OverridesConfigs;
};

export type OptionsOverrides = {
  overrides: Linter.RulesRecord
};

export type OptionsVue = {
  ts: boolean,
  taro: boolean
};