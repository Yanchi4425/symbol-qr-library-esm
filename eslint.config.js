import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";

export default [
  js.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        console: "readonly",
        process: "readonly",
        Buffer: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        global: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      // TypeScript specific rules
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-non-null-assertion": "warn",

      // General ESLint rules
      "no-console": "off",
      "no-unused-vars": "off", // Use @typescript-eslint/no-unused-vars instead
      "no-var": "error",
      "object-shorthand": "error",
      "prefer-arrow-callback": "error",
      "no-prototype-builtins": "warn",
      "no-irregular-whitespace": "error",
    },
  },
  // Test files configuration
  {
    files: ["test/**/*.ts", "**/*.spec.ts"],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        console: "readonly",
        process: "readonly",
        Buffer: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        global: "readonly",
        // Mocha globals
        describe: "readonly",
        it: "readonly",
        before: "readonly",
        after: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      // TypeScript specific rules (more relaxed for tests)
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-non-null-assertion": "warn",

      // General ESLint rules
      "no-console": "off",
      "no-unused-vars": "off",
      "no-var": "error",
      "object-shorthand": "error",
      "prefer-arrow-callback": "error",
      "no-prototype-builtins": "warn",
      "no-irregular-whitespace": "error",
    },
  },
  {
    ignores: [
      "dist/",
      "node_modules/",
      "*.js",
      "*.cjs",
      "*.mjs",
      "rollup.config.js",
    ],
  },
];
