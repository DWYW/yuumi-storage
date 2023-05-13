import json from '@rollup/plugin-json'
import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import typescript from "@rollup/plugin-typescript"
import dts from "rollup-plugin-dts"
import pkg from "./package.json" assert { type: "json" }

const name = pkg.name.replace(/(^\w)|(-\w)/g, function ($1) {
  return $1.toUpperCase().slice(-1)
})

export default [
	{
    input: 'src/main.ts',
    output: [
      { format: 'umd', file: `dist/index.umd.js`, name: name },
      { format: 'cjs', file: `dist/index.cjs.js`, name: name },
      { format: 'es', file: `dist/index.es.js`, name: name },
    ],
    plugins: [
      resolve(),   // so Rollup can find `ms`
      commonjs(),  // so Rollup can convert `ms` to an ES module
      typescript(), // so Rollup can convert TypeScript to JavaScript
      json()
    ]
  },

  /* 单独生成声明文件 */
  {
    input: 'src/main.ts',
    plugins: [
      dts()
    ],
    output: {
      format: 'esm',
      file: 'dist/index.d.ts',
    }
  }
]