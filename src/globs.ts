export const VUE_GLOBS = [
  "**/*.vue"
];

export const TS_GLOBS = [
  "**/*.?([cm])ts"
];

export const JS_GLOBS = [
  "**/*.?([cm])js"
];

export const JSX_GLOBS = [
  "**/*.?([cm])jsx"
];

export const TSX_GLOBS = [
  "**/*.?([cm])tsx"
];

export const CSS_GLOBS = [
  "**/*.css"
];

export const SASS_GLOBS = [
  "**/*.scss",
  "**/*.sass"
];

export const LESS_GLOBS = [
  "**/*.less"
];

export const HTML_GLOBS = [
  "**/*.html"
];

export const JSON_GLOBS = [
  "**/*.json",
  "**/*.json5",
  "**/*.jsonc"
];

export const GLOBS_EXCLUDES = [
  "**/node_modules",
  "**/dist",
  "**/package-lock.json",
  "**/yarn.lock",
  "**/pnpm-lock.yaml",
  "**/bun.lockb",

  "**/output",
  "**/coverage",
  "**/temp",
  "**/.temp",
  "**/tmp",
  "**/.tmp",
  "**/.history",
  "**/.vitepress/cache",
  "**/.nuxt",
  "**/.next",
  "**/.svelte-kit",
  "**/.vercel",
  "**/.changeset",
  "**/.idea",
  "**/.cache",
  "**/.output",
  "**/.vite-inspect",
  "**/.yarn",
  "**/vite.config.*.timestamp-*",

  "**/CHANGELOG*.md",
  "**/*.min.*",
  "**/LICENSE*",
  "**/__snapshots__",
  "**/auto-import?(s).d.ts",
  "**/components.d.ts"
];