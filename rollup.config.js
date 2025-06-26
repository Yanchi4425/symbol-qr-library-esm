import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import dts from "rollup-plugin-dts";

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const packageJson = require("./package.json");

// 外部依存関係（バンドルに含めない）
const external = [
  ...Object.keys(packageJson.dependencies || {}),
  ...Object.keys(packageJson.peerDependencies || {}),
];

// 共通設定
const commonConfig = {
  input: "index.ts",
  external,
  plugins: [
    resolve({
      preferBuiltins: true,
    }),
    commonjs(),
    typescript({
      tsconfig: "./tsconfig.json",
      declaration: false, // 型定義は別途生成
      declarationDir: undefined,
      outDir: "dist",
    }),
  ],
};

export default [
  // ESM build
  {
    ...commonConfig,
    output: {
      file: packageJson.module,
      format: "es",
      sourcemap: true,
    },
  },
  // CommonJS build
  {
    ...commonConfig,
    output: {
      file: packageJson.main,
      format: "cjs",
      sourcemap: true,
      exports: "named",
    },
  },
  // UMD build (ブラウザ用)
  {
    ...commonConfig,
    output: {
      file: "dist/symbol-qr-library-esm.umd.js",
      format: "umd",
      name: "SymbolQR",
      sourcemap: true,
      exports: "named",
    },
  },
  // 型定義ファイル生成
  {
    input: "index.ts",
    output: {
      file: packageJson.types,
      format: "es",
    },
    plugins: [dts()],
    external: [/\.css$/],
  },
];
