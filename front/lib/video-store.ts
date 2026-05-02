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
