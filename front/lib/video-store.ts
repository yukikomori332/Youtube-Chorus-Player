// 動画の再生設定を表すインターフェース
export interface VideoPlaybackConfig {
  id: string; // 一意の識別子
  url: string; // 動画のURL
  videoId: string | null; // プラットフォームから抽出した動画ID
  title: string; // 動画のタイトル
  startTime: number; // 再生開始位置（秒）
  endTime: number | null; // 再生終了位置（秒）、 nullの場合は動画の最後まで再生する
  repeat: boolean; // trueの場合、startTime〜endTime区間をループ再生する
}

// YouTube動画の動画ID形式（11文字の英数字・ハイフン・アンダースコア）
const YOUTUBE_VIDEO_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/;

// YouTube動画の動画IDを抽出するURLパターン一覧
const YOUTUBE_URL_PATTERNS: RegExp[] = [
  // 通常: https://www.youtube.com/watch?v=VIDEO_ID
  /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/,
  // 短縮: https://youtu.be/VIDEO_ID
  /youtu\.be\/([a-zA-Z0-9_-]{11})/,
  // 埋め込み: https://www.youtube.com/embed/VIDEO_ID
  /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  // Shorts: https://www.youtube.com/shorts/VIDEO_ID
  /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  // ライブ: https://www.youtube.com/live/VIDEO_ID
  /youtube\.com\/live\/([a-zA-Z0-9_-]{11})/,
];

/**
 * 文字列がYouTube動画の動画IDとして有効かどうかを検証する
 * @param value 検証する文字列
 */
export function isValidYouTubeVideoId(value: string): boolean {
  return YOUTUBE_VIDEO_ID_REGEX.test(value);
}

/**
 * YouTube URLから動画IDを抽出する
 * @param input YouTube URL
 * @returns 抽出した動画ID、無効な場合はnull
 * @example
 * extractYouTubeVideoId("https://youtu.be/MkNeIUgNPQ8") // => "MkNeIUgNPQ8"
 * extractYouTubeVideoId("MkNeIUgNPQ8")                  // => "MkNeIUgNPQ8"
 * extractYouTubeVideoId("invalid")                      // => null
 */
export function extractYouTubeVideoId(input: string): string | null {
  // 生のIDとして有効であればそのまま返す
  if (isValidYouTubeVideoId(input)) {
    return input;
  }

  // URLパターンで順にマッチを試みる
  for (const pattern of YOUTUBE_URL_PATTERNS) {
    const match = input.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}

/**
 * 秒数を `H:MM:SS` 形式の文字列にフォーマットする
 *
 * - 1時間未満の場合は時間部分を省略し `M:SS` 形式で返す
 * - `showMilliseconds` が true の場合は末尾に `.mmm` を付与する
 *
 * @param totalSeconds フォーマットする秒数（小数点以下はミリ秒として扱う）
 * @param showMilliseconds trueの場合、ミリ秒を表示する（デフォルト: false）
 * @returns フォーマットされた時間の文字列
 * @example
 * formatTime(3661)        // => "1:01:01"
 * formatTime(65)          // => "1:05"
 * formatTime(65.5, true)  // => "1:05.500"
 */
export function formatTime(totalSeconds: number, showMilliseconds: boolean = false): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const milliseconds = Math.floor((totalSeconds % 1) * 1000);

  const minutesString = minutes.toString().padStart(hours > 0 ? 2 : 1, "0");
  const secondsString = seconds.toString().padStart(2, "0");
  const msString = milliseconds.toString().padStart(3, "0");

  const timeParts = hours > 0 ? `${hours}:${minutesString}:${secondsString}` : `${minutesString}:${secondsString}`;

  return showMilliseconds ? `${timeParts}.${msString}` : timeParts;
}

/** parseTimeInput が受け付ける入力形式 */
const TIME_INPUT_PATTERN =
  /^(\d+):(\d{1,2}):(\d{1,2})(?:\.(\d{1,3}))?$|^(\d+):(\d{1,2})(?:\.(\d{1,3}))?$|^(\d+(?:\.\d{1,3})?)$/;

/**
 * 時間文字列を秒数（小数）にパースする
 *
 * サポート形式:
 * - `H:MM:SS`        例: "1:02:03"
 * - `H:MM:SS.mmm`    例: "1:02:03.500"
 * - `M:SS`           例: "2:03"
 * - `M:SS.mmm`       例: "2:03.500"
 * - `秒（整数）`      例: "3723"
 * - `秒（小数）`      例: "3723.5"
 *
 * @param value パースする時間文字列
 * @returns 非数（NaNを返す） 非サポート形式の場合
 * @returns 秒数（ミリ秒は小数部として返す）
 * @example
 * parseTimeInput("1:02:03.500") // => 3723.5
 * parseTimeInput("2:03")        // => 123
 * parseTimeInput("3723")        // => 3723
 */
export function parseTimeInput(value: string): number {
  const trimmed = value.trim();

  // 非サポートの形式は非数として扱う
  if (!TIME_INPUT_PATTERN.test(trimmed)) return NaN;

  // ミリ秒を分離（小数点は最初の1つだけ使用）
  const dotIndex = trimmed.indexOf(".");
  const hasMilliseconds = dotIndex !== -1;
  const mainStr = hasMilliseconds ? trimmed.slice(0, dotIndex) : trimmed;
  const milliseconds = hasMilliseconds ? parseMilliseconds(trimmed.slice(dotIndex + 1)) : 0;

  // コロン区切りで時・分・秒をパース
  const totalSeconds = mainStr.includes(":") ? parseColonSeparated(mainStr) : parseInt(mainStr, 10);

  return totalSeconds + milliseconds / 1000;
}

/**
 * ミリ秒文字列を数値に変換する
 * 桁数に応じて正規化する（"5" → 500、"05" → 50、"005" → 5）
 */
function parseMilliseconds(msStr: string): number {
  const normalized = msStr.padEnd(3, "0").slice(0, 3);
  return parseInt(normalized, 10);
}

/**
 * "H:MM:SS" または "M:SS" 形式の文字列を秒数に変換する
 */
function parseColonSeparated(timeStr: string): number {
  const parts = timeStr.split(":").map((p) => parseInt(p, 10));

  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;
    return hours * 3600 + minutes * 60 + seconds;
  }

  const [minutes, seconds] = parts;
  return minutes * 60 + seconds;
}
