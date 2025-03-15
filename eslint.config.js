// eslint.config.js
import { createRequire } from "module";
const require = createRequire(import.meta.url);
import astro from "eslint-plugin-astro";
import astroParser from "astro-eslint-parser";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

/** @type {import("eslint").Linter.FlatConfigItem[]} */
export default [
  // 全体の設定：.astro ディレクトリを無視
  {
    ignores: [".astro/**"],
  },
  // Astro ファイル (.astro) 用の設定（必要に応じて調整）
  {
    files: ["**/*.astro"],
    languageOptions: {
      parser: astroParser,
      parserOptions: {
        parser: tsParser,
        sourceType: "module",
      },
    },
    plugins: { astro },
    rules: {
      // 例: "astro/no-set-html-directly": "error",
    },
  },
  // TypeScript ファイル (.ts, .tsx, .d.ts) 用の設定
  {
    files: ["**/*.{ts,tsx,d.ts}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        sourceType: "module",
        // 必要に応じて tsconfig.json を参照する場合は以下を有効にする
        // project: './tsconfig.json',
      },
    },
    plugins: { "@typescript-eslint": tsPlugin },
    rules: {
      ...tsPlugin.configs.recommended.rules,
    },
  },
  // JavaScript ファイル (.js) 用の設定（必要に応じて）
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "module",
    },
  },
];
