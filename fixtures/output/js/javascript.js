import fs from "node:fs";
import { resolve } from "node:path";

import { a, b, c } from "./utils.js";

const name = "zjutjh";
const count = 1;

export function greet(user) {
  if (!user) {
    return `Hello, ${name}`;
  }

  return `Hello, ${user}!`;
}

export const double = (n) => n * 2;

export function toBool(value) {
  return Boolean(value);
}

const obj = { foo: 1, bar: [1, 2, 3], baz: `plain` };

console.log(obj, count, resolve("."), fs, a, b, c);
