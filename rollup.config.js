import terser from "@rollup/plugin-terser";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default [
  {
    input: "client/src/index.js",
    output: [
      {
        file: "dist/SpiderClient.js",
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
  },
  {
    input: "server/src/index.js",
    output: [
      {
        file: "dist/SpiderServer.js",
        format: "cjs"
      }
    ],
    plugins: [nodeResolve(), commonjs()]
  }
];
