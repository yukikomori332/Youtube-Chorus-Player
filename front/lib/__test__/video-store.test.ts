import { isValidYouTubeVideoId, extractYouTubeVideoId, formatTime, parseTimeInput } from "../video-store";

// ---------------------------------------------------------------------------
// テスト用定数
// ---------------------------------------------------------------------------
const VALID_VIDEO_ID = "MkNeIUgNPQ8";

// ---------------------------------------------------------------------------
// isValidYouTubeVideoId
// ---------------------------------------------------------------------------
describe("isValidYouTubeVideoId", () => {
  describe("有効なID", () => {
    it.each([
      ["英数字のみ", "MkNeIUgNPQ8"],
      ["ハイフンを含む", "abc-def-ghi"], // 11文字
      ["アンダースコアを含む", "abc_def_ghi"], // 11文字
      ["ハイフン・アンダースコア混在", "a-b_cDeFgHi"], // 11文字
    ])("%s: true を返す", (_label, id) => {
      expect(isValidYouTubeVideoId(id)).toBe(true);
    });
  });

  describe("無効なID", () => {
    it.each([
      ["10文字（短すぎる）", "MkNeIUgNPQ"],
      ["12文字（長すぎる）", "MkNeIUgNPQ88"],
      ["空文字列", ""],
      ["スペースを含む", "MkNeIU gNPQ8"],
      ["記号を含む", "MkNeIUgNP!8"],
      ["URLそのもの", "https://youtu.be/MkNeIUgNPQ8"],
    ])("%s: false を返す", (_label, id) => {
      expect(isValidYouTubeVideoId(id)).toBe(false);
    });
  });
});

// ---------------------------------------------------------------------------
// extractYouTubeVideoId
// ---------------------------------------------------------------------------
describe("extractYouTubeVideoId", () => {
  describe("各種YouTube URLから動画IDを抽出できる", () => {
    it.each([
      ["通常URL (watch?v=)", `https://www.youtube.com/watch?v=${VALID_VIDEO_ID}`],
      ["通常URL (追加クエリパラメータ付き)", `https://www.youtube.com/watch?v=${VALID_VIDEO_ID}&t=42&list=foo`],
      ["短縮URL (youtu.be)", `https://youtu.be/${VALID_VIDEO_ID}`],
      ["埋め込みURL (embed)", `https://www.youtube.com/embed/${VALID_VIDEO_ID}`],
      ["ShortsURL", `https://www.youtube.com/shorts/${VALID_VIDEO_ID}`],
      ["ライブURL (live)", `https://www.youtube.com/live/${VALID_VIDEO_ID}`],
    ])("%s", (_label, url) => {
      expect(extractYouTubeVideoId(url)).toBe(VALID_VIDEO_ID);
    });
  });

  it("生の11文字IDをそのまま返す", () => {
    expect(extractYouTubeVideoId(VALID_VIDEO_ID)).toBe(VALID_VIDEO_ID);
  });

  describe("無効な入力では null を返す", () => {
    it.each([
      ["YouTube以外のURL", "https://example.com"],
      ["空文字列", ""],
      ["URLでない文字列", "not-a-url"],
      ["10文字の不完全ID", "MkNeIUgNPQ"],
    ])("%s", (_label, input) => {
      expect(extractYouTubeVideoId(input)).toBeNull();
    });
  });
});

// ---------------------------------------------------------------------------
// formatTime
// ---------------------------------------------------------------------------

describe("formatTime", () => {
  /**
   * formatTime の仕様まとめ:
   *   - 1時間未満 → `M:SS`    例: "1:05"
   *   - 1時間以上 → `H:MM:SS` 例: "1:01:01"
   *   - showMilliseconds=true かつミリ秒が存在する → 末尾に `.mmm`
   *   - showMilliseconds=true かつミリ秒が 0    → `.mmm` は付与しない
   */

  describe("ミリ秒なし（デフォルト）", () => {
    it.each<[string, number, string]>([
      ["0秒", 0, "0:00"],
      ["1分5秒", 65, "1:05"],
      ["1時間1分1秒", 3661, "1:01:01"],
      ["ちょうど1時間", 3600, "1:00:00"],
      ["23時間59分59秒", 86399, "23:59:59"],
    ])("%s → %s", (_label, seconds, expected) => {
      expect(formatTime(seconds)).toBe(expected);
    });
  });

  describe("showMilliseconds=true", () => {
    it.each<[string, number, string]>([
      ["ミリ秒あり: 0.5秒", 0.5, "0:00.500"],
      ["ミリ秒あり: 1分30.5秒", 90.5, "1:30.500"],
      ["ミリ秒あり: 0.005秒（端数）", 0.005, "0:00.005"],
      ["ミリ秒あり: 1時間1分1.5秒", 3661.5, "1:01:01.500"],
      ["ミリ秒あり: 1分30秒でも付与する", 90, "1:30.000"],
      ["ミリ秒あり: 0秒でも付与する", 0, "0:00.000"],
    ])("%s → %s", (_label, seconds, expected) => {
      expect(formatTime(seconds, true)).toBe(expected);
    });
  });
});

// ---------------------------------------------------------------------------
// parseTimeInput
// ---------------------------------------------------------------------------

describe("parseTimeInput", () => {
  /**
   * parseTimeInput のサポート形式:
   *   H:MM:SS / H:MM:SS.mmm
   *   M:SS    / M:SS.mmm
   *   秒（整数・小数）
   *
   * 非サポート形式は Error をスローする。
   */

  describe("H:MM:SS 形式", () => {
    it.each<[string, string, number]>([
      ["1:02:03", "1:02:03", 3723],
      ["1:02:03.500", "1:02:03.500", 3723.5],
      ["0:00:00", "0:00:00", 0],
    ])("%s → %d 秒", (_label, input, expected) => {
      expect(parseTimeInput(input)).toBe(expected);
    });
  });

  describe("M:SS 形式", () => {
    it.each<[string, string, number]>([
      ["2:30", "2:30", 150],
      ["2:30.500", "2:30.500", 150.5],
      ["0:00", "0:00", 0],
    ])("%s → %d 秒", (_label, input, expected) => {
      expect(parseTimeInput(input)).toBe(expected);
    });
  });

  describe("秒のみ形式", () => {
    it.each<[string, string, number]>([
      ["整数秒: 90", "90", 90],
      ["小数秒: 1.5", "1.5", 1.5],
      ["0秒", "0", 0],
    ])("%s → %d 秒", (_label, input, expected) => {
      expect(parseTimeInput(input)).toBe(expected);
    });
  });

  describe("ミリ秒の正規化（1〜3桁の端数）", () => {
    it.each<[string, string, number]>([
      ["1桁 (.5)  → 500ms", "0:00.5", 0.5],
      ["2桁 (.05) → 050ms", "0:00.05", 0.05],
      ["3桁 (.005)→ 005ms", "0:00.005", 0.005],
    ])("%s", (_label, input, expected) => {
      expect(parseTimeInput(input)).toBeCloseTo(expected, 10);
    });
  });

  describe("前後の空白は無視される", () => {
    it.each([
      ["先頭の空白", "  90"],
      ["末尾の空白", "90  "],
      ["両端の空白", "  90  "],
    ])("%s", (_label, input) => {
      expect(parseTimeInput(input)).toBe(90);
    });
  });

  describe("非サポート形式は Error をスローする", () => {
    it.each([
      ["空文字列", ""],
      ["空白のみ", "   "],
      ["アルファベット", "abc"],
      ["コロン区切りが多すぎ", "1:2:3:4"],
      ["負の値", "-1"],
    ])("%s", (_label, input) => {
      expect(() => parseTimeInput(input)).toThrow();
    });
  });
});
