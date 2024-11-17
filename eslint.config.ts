import zjutjh from "./src";

export default [
  ...await zjutjh(),
  {
    name: "local/ignores",
    ignores: [
      "dist"
    ]
  }
]