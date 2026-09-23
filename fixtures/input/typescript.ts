import type { Linter } from 'eslint'
import { readFileSync } from 'node:fs'

interface User {
  name: string,
  age?: number
}

export const users: Array<User> = [{name: 'foo', age: 18}, {name: 'bar'}]

export function describe(user: User): string {
  let prefix = 'User: '
  return prefix + user.name
}

export async function load(path: string) {
  return readFileSync(path, 'utf-8')
}

export const config: Linter.Config = {rules: {}}

export function parse(input: any) {
  return JSON.parse(input)
}
