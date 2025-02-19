import { Linter } from "eslint";
import { isPackageExists } from "local-pkg";

import { OptionsConfig, OverridesConfigs } from "./types";

type Awaitable<T> = T | Promise<T>;

export async function interopDefault<T>(m: Awaitable<T>): Promise<T extends { default: infer U } ? U : T> {
  const resolved = await m;
  return (resolved as any).default || resolved;
}

export async function ensurePackages(packages: (string | undefined)[]): Promise<void> {
  const nonExistingPackages = packages.filter(i => i && !isPackageExists(i)) as string[];

  if (nonExistingPackages.length !== 0) {
    const message = `${nonExistingPackages.length === 1 ? "Package is" : "Packages are"} required for this config: ${nonExistingPackages.join(", ")}.`;
    throw new Error(message);
  }
}

export type ResolvedOptions<T> = T extends boolean
  ? never
  : NonNullable<T>;

export function resolveSubOptions<K extends keyof OptionsConfig>(
  options: OptionsConfig,
  key: K
): ResolvedOptions<OptionsConfig[K]> {
  return typeof options[key] === "boolean"
    ? {} as any
    : options[key] || {};
}

export function getOverrides<K extends keyof OverridesConfigs>(
  options: OptionsConfig,
  key: K
): Linter.RulesRecord {
  return {
    ...(options.overrides as any)?.[key]
  };
}