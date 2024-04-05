import terser from "@rollup/plugin-terser";
import { nodeResolve } from "@rollup/plugin-node-resolve";

export default [
  {
    input: "src/main.js",
    output: [
      {
        file: "dist/SpiderClient.esm.js",
        format: "es"
      },
      {
        file: "dist/SpiderClient.min.js",
        format: "iife",
        name: "SpiderClient",
        plugins: [terser()]
      }
    ],
    plugins: [nodeResolve()]
  }
];
