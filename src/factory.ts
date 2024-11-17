import { Linter } from "eslint";
import javascript from "./configs/javascript";

export default async function zjutjh() {
  const configs: Linter.Config[][] = [];

  configs.push(javascript());

  return configs.flat(1) satisfies Linter.Config[];
}