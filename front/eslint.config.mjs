import js from '@eslint/js';
import { defineConfig, globalIgnores } from "eslint/config";
import importPlugin from "eslint-plugin-import";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";
import unusedImports from "eslint-plugin-unused-imports";
import tseslint from 'typescript-eslint';

const eslintConfig = defineConfig([
  // ── 基本ルール ────────────────────────────────────────────
  js.configs.recommended,

  // TypeScript 推奨ルール（.ts / .tsx のみ対象）
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: ["**/*.ts", "**/*.tsx"],
  })),

  // Next.js: Core Web Vitals + フレームワーク固有ルール
  ...nextVitals,
  ...nextTs,

  // ── プロジェクト共通ルール ────────────────────────────────
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx", "**/*.mjs"],
    rules: {
      // import の並び順を強制する
      // グループ順: type → builtin → external → internal → 相対パス
      // グループ間の空行なし、各グループ内はアルファベット昇順
      "import/order": [
        "warn",
        {
          groups: [
            "type",
            "builtin",
            "external",
            "internal",
            ["parent", "sibling", "index"],
          ],
          "newlines-between": "never",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],

      // 同一モジュールへの import が分散しているときはエラーにする
      "import/no-duplicates": "error",

      // import ブロックの直後に空行を要求し、実装コードと視覚的に分離する
      "import/newline-after-import": "warn",

      // デバッグログの本番混入を防ぐ
      // console.warn / error は許可
      "no-console": ["warn", { allow: ["warn", "error"] }],

      // 暗黙の型変換による比較バグを防ぐため === / !== を強制する
      // null との比較（== null で null | undefined を同時に検査する慣用句）は例外
      eqeqeq: ["error", "always", { null: "ignore" }],

      // !!value や +str など意図が読み取りにくい暗黙変換を警告する
      // Boolean() / Number() のような明示的な変換を促す
      "no-implicit-coercion": "warn",

      // x ? true : false のように真偽値に置き換えられる冗長な三項演算子を警告する
      "no-unneeded-ternary": "warn",

      // { foo: foo } → { foo } のショートハンド記法を強制する
      "object-shorthand": ["warn", "always"],

      // 文字列結合よりテンプレートリテラルに統一する
      "prefer-template": "warn",
    },
  },

  // ── TypeScript 専用・プラグインルール ────────────────────
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      import: importPlugin,
      "unused-imports": unusedImports,
    },
    rules: {
      // unused-imports/no-unused-vars に検出を委譲するため無効化する
      // 両方を有効にすると同じ変数に対して重複報告が発生する
      "@typescript-eslint/no-unused-vars": "off",

      // 未使用 import はバンドルサイズに直結するためエラーにする
      "unused-imports/no-unused-imports": "error",

      // 未使用の変数・引数をエラーにする
      // _ プレフィックスは「意図的に未使用」を示す慣用表現として除外する
      "unused-imports/no-unused-vars": [
        "error",
        {
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_", // catch (_e) のような場合も除外
        },
      ],

      // any は型安全性を完全に失わせるため警告する
      // 移行期や外部ライブラリとの境界など、やむを得ない箇所での一時使用は許容
      "@typescript-eslint/no-explicit-any": "warn",

      // 型のみの import に import type を強制する
      // バンドラーがツリーシェイキングで型 import を除去しやすくなる
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        {
          prefer: "type-imports",
          fixStyle: "inline-type-imports", // import { type Foo, Bar } 形式で自動修正
        },
      ],
    },
  },

  // ── Prettier 競合回避（必ず末尾に置く） ──────────────────
  // インデント・セミコロン・引用符など Prettier が管理するスタイル系ルールを無効化する
  prettier,

  // ── 解析除外パス ──────────────────────────────────────────
  globalIgnores([
    ".next/**",        // Next.js ビルド成果物
    "out/**",          // next export の静的出力
    "build/**",        // 汎用ビルド
    "next-env.d.ts",   // Next.js が自動生成する型定義
    "node_modules/**", // パッケージ
    "coverage/**",     // テストカバレッジレポート
    "dist/**",         // 汎用配布ビルド
    ".vercel/**",      // Vercel デプロイ用の設定・キャッシュなど
    "*.tsbuildinfo",   // TypeScript インクリメンタルビルドキャッシュ
    "jest.config.js",  // Jest 設定
    "jest.setup.js",
  ]),
]);

export default eslintConfig;
