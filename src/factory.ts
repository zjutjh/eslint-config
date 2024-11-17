import { Linter } from "eslint";
import javascript from "./configs/javascript";
import stylistic from "./configs/stylistic";

export default async function zjutjh() {
  const configs: Linter.Config[][] = [];

  configs.push(javascript());
  configs.push(stylistic());

  return configs.flat(1) satisfies Linter.Config[];
}