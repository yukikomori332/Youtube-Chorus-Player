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
