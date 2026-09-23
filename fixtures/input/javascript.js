import { resolve } from 'node:path'
import fs from 'node:fs'
import { a, c, b } from './utils.js'

var name = 'zjutjh'
let count = 1

export function greet(user) {
  if (!user) return 'Hello, ' + name
  else {
    return 'Hello, ' + user + '!'
  }
}

export const double = (n) => { return n * 2 }

export function toBool(value) {
  return !!value
}

const obj = {"foo": 1, 'bar': [1,2,3], baz: `plain`}

console.log(obj, count, resolve('.'), fs, a, b, c)
