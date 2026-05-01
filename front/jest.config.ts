import type { Config } from "jest";
import nextJest from "next/jest.js";

// next.config.jsや環境変数（.env）を読み込むためのパスを提供する
const createJestConfig = nextJest({
  dir: "./",
});

// Jestの設定
const config: Config = {
  // コードカバレッジ計測の際に使用するプロバイダーを指定
  coverageProvider: "v8",
  // テストに使用する検証環境
  testEnvironment: "jest-environment-jsdom",
  // 各テスト実行前に読み込まれる設定ファイルを指定
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  // 正規表現からモジュール名、またはモジュール名の配列へのマッピングを行う
  // 一つのモジュールでリソースをスタブ化できるようになる
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
};

export default createJestConfig(config);
