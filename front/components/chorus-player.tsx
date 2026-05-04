"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Play, Pause, RotateCcw, Music, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VideoCard } from "@/components/video-card";
import { VideoInput } from "@/components/video-input";
import { type VideoPlaybackConfig } from "@/lib/video-store";

// YouTube IFrame API の読み込み状態を表す判別可能ユニオン
type YouTubeApiStatus = { status: "idle" } | { status: "loading"; promise: Promise<void> } | { status: "ready" };

// YouTube IFrame API の読み込みで使用する定数
const YOUTUBE_API_SRC = "https://www.youtube.com/iframe_api";
const YOUTUBE_API_TIMEOUT_MS = 15_000;

export function ChorusPlayer() {
  // ───────────────────────────────────────────
  // ref
  // ───────────────────────────────────────────
  const videosRef = useRef<VideoPlaybackConfig[]>([]);
  const playersRef = useRef<Map<string, YT.Player>>(new Map());
  /**
   * YouTube IFrame API の読み込み状態を ref で管理する
   * - state にすると API 読み込み完了のたびに再レンダーが走るため ref を選択
   * - コンポーネントのライフサイクル全体でただひとつのYouTube IFrame API の読み込み状態を保証
   */
  const youTubeApiStatusRef = useRef<YouTubeApiStatus>({ status: "idle" });

  // ───────────────────────────────────────────
  // state
  // ───────────────────────────────────────────
  const [videos, setVideos] = useState<VideoPlaybackConfig[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [, setFinishedVideos] = useState<Set<string>>(new Set());
  const [playToken, setPlayToken] = useState(0);

  // ───────────────────────────────────────────
  // refの最新値同期
  // ───────────────────────────────────────────
  useEffect(() => {
    videosRef.current = videos;
  }, [videos]);

  // ───────────────────────────────────────────
  // YouTube IFrame API（URL追加時にのみロード）
  // ───────────────────────────────────────────
  /**
   * YouTube IFrame API を冪等に読み込む
   *
   * - "idle"   → スクリプトを挿入してロード開始、Promise をキャッシュ
   * - "loading" → 既存の Promise をそのまま返す（重複ロード防止）
   * - "ready"  → 即座に resolve（再ロード不要）
   *
   * finally でキャッシュをリセットせず、成功後は "ready" に遷移する
   * これにより後から呼んだ側も即時 resolve できる
   */
  const ensureYouTubeIframeApi = useCallback((): Promise<void> => {
    if (typeof window === "undefined") return Promise.resolve();
    if (window.YT?.Player) return Promise.resolve();

    const current = youTubeApiStatusRef.current;

    if (current.status === "ready") return Promise.resolve();
    if (current.status === "loading") return current.promise;

    const promise = new Promise<void>((resolve, reject) => {
      // スクリプトがまだ挿入されていなければ挿入する
      if (!document.querySelector<HTMLScriptElement>(`script[src="${YOUTUBE_API_SRC}"]`)) {
        const tag = document.createElement("script");
        tag.src = YOUTUBE_API_SRC;
        tag.async = true;
        tag.onerror = () => reject(new Error("Failed to load YouTube IFrame API"));

        const firstScript = document.getElementsByTagName("script")[0];
        const parent = firstScript?.parentNode ?? document.head;
        parent.insertBefore(tag, firstScript ?? null);
      }

      // 既存のコールバックを保護しつつ上書きする
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        try {
          prev?.();
        } finally {
          resolve();
        }
      };

      // API がすでにロード済みの場合のポーリング（スクリプト二重挿入時のフォールバック）
      const startedAt = Date.now();
      const timer = window.setInterval(() => {
        if (window.YT?.Player) {
          window.clearInterval(timer);
          resolve();
          return;
        }
        if (Date.now() - startedAt > YOUTUBE_API_TIMEOUT_MS) {
          window.clearInterval(timer);
          reject(new Error("Timed out waiting for YouTube IFrame API"));
        }
      }, 100);
    }).then(
      () => {
        // 成功時は "ready" に遷移し、以降の呼び出しを即時 resolve にする
        youTubeApiStatusRef.current = { status: "ready" };
      },
      (error: unknown) => {
        // 失敗時は "idle" に戻して次回の再試行を許可する
        youTubeApiStatusRef.current = { status: "idle" };
        throw error;
      }
    );

    youTubeApiStatusRef.current = { status: "loading", promise };
    return promise;
  }, []);

  // ───────────────────────────────────────────
  // プレイヤーの登録・破棄
  // ───────────────────────────────────────────
  const registerPlayer = useCallback((id: string, player: YT.Player | null) => {
    if (player) {
      playersRef.current.set(id, player);
    } else {
      playersRef.current.delete(id);
    }
  }, []);

  const removePlayer = useCallback((id: string) => {
    playersRef.current.delete(id);
  }, []);

  // ───────────────────────────────────────────
  // プレイヤーの再生・停止・リセット・同期ループ
  // ───────────────────────────────────────────
  const syncedRepeatEnabled = videos.some((v) => v.repeat);

  const handlePlayAll = useCallback(() => {
    setIsPlaying(true);
    setFinishedVideos(new Set());
    setPlayToken((t) => t + 1);
  }, [setIsPlaying, setFinishedVideos, setPlayToken]);

  const handlePauseAll = useCallback(() => {
    setIsPlaying(false);
    setFinishedVideos(new Set());
    playersRef.current.forEach((player) => {
      try {
        player.pauseVideo();
      } catch {
        // プレイヤーが既に破棄されている場合は無視
      }
    });
  }, [setIsPlaying, setFinishedVideos, playersRef]);

  const handleResetAll = useCallback(() => {
    setIsPlaying(false);
    setFinishedVideos(new Set());
    playersRef.current.forEach((player) => {
      try {
        player.pauseVideo();
        player.seekTo(0, true);
      } catch {
        // プレイヤーが既に破棄されている場合は無視
      }
    });
    videos.forEach((video) => {
      const player = playersRef.current.get(video.id);
      if (player) {
        try {
          player.seekTo(video.startTime, true);
        } catch {
          // プレイヤーが既に破棄されている場合は無視
        }
      }
    });
  }, [videos, playersRef, setIsPlaying, setFinishedVideos]);

  const handleReachedEnd = useCallback(
    (id: string) => {
      if (!(syncedRepeatEnabled && isPlaying)) return;

      setFinishedVideos((prev) => {
        const next = new Set(prev);
        next.add(id);

        if (videosRef.current.length > 0 && next.size >= videosRef.current.length) {
          queueMicrotask(() => {
            setFinishedVideos(new Set());
            setPlayToken((t) => t + 1);
          });
        }

        return next;
      });
    },
    [isPlaying, syncedRepeatEnabled, videosRef, setFinishedVideos, setPlayToken]
  );

  // ───────────────────────────────────────────
  // 動画の追加・更新・削除
  // ───────────────────────────────────────────
  /**
   * 動画追加と API ロードを並行して開始する
   *
   * API ロードは非同期で進行するが、プレイヤー生成は後続処理が担うため
   * ここでは await せず、エラーは console.error に委ねる
   */
  const addVideo = useCallback(
    (url: string, videoId: string) => {
      // API ロードを開始（失敗時はコンソールに出力して握りつぶさない）
      ensureYouTubeIframeApi().catch((error: unknown) => {
        console.error("YouTube IFrame API のロードに失敗しました:", error);
      });

      setVideos((prev) => [
        ...prev,
        {
          id: `video-${Date.now()}`,
          url,
          videoId,
          title: `動画 ${prev.length + 1}`,
          startTime: 0,
          endTime: null,
          repeat: false,
        },
      ]);
    },
    [ensureYouTubeIframeApi]
  );

  const updateVideo = useCallback((updated: VideoPlaybackConfig) => {
    setVideos((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
  }, []);

  const removeVideo = useCallback(
    (id: string) => {
      setVideos((prev) => prev.filter((v) => v.id !== id));
      removePlayer(id);
    },
    [removePlayer]
  );

  const gridCols =
    videos.length <= 2
      ? "grid-cols-1 md:grid-cols-2"
      : videos.length <= 4
        ? "grid-cols-1 md:grid-cols-2"
        : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

  return (
    <div className="min-h-screen bg-background">
      {/* ヘッダー */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* ロゴ・タイトル */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                <Music className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold">歌ってみた合唱プレイヤー for Youtube</h1>
                <p className="text-xs text-muted-foreground">複数の動画を同時に再生して合唱を楽しもう！</p>
              </div>
            </div>

            {/* 再生コントロール */}
            {videos.length > 0 && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={handleResetAll} title="リセット">
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button size="lg" onClick={isPlaying ? handlePauseAll : handlePlayAll} className="gap-2">
                  {isPlaying ? (
                    <>
                      <Pause className="h-5 w-5" />
                      一時停止
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5" />
                      同時再生
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* URL入力 */}
        <section className="max-w-2xl mx-auto">
          <VideoInput onAdd={addVideo} />
        </section>

        {/* 動画グリッド */}
        {videos.length > 0 ? (
          <section className={`grid ${gridCols} gap-4`}>
            {videos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onUpdate={updateVideo}
                onRemove={removeVideo}
                isPlaying={isPlaying}
                registerPlayer={registerPlayer}
                syncedRepeatEnabled={syncedRepeatEnabled}
                playToken={playToken}
                onReachedEnd={handleReachedEnd}
              />
            ))}
          </section>
        ) : (
          <section className="text-center py-20">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
                <Music className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold">動画を追加して始めよう</h2>
              <p className="text-muted-foreground">
                YouTube URLを入力して、お気に入りの歌ってみた動画を追加してください。
                複数の動画を同時に再生して、夢の合唱を実現しよう！
              </p>
              <div className="flex flex-wrap justify-center gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Settings2 className="h-4 w-4" />
                  <span>開始・終了時間を設定</span>
                </div>
                <div className="flex items-center gap-1">
                  <RotateCcw className="h-4 w-4" />
                  <span>リピート再生</span>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* フッター */}
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-4">
          <p className="text-center text-sm text-muted-foreground">
            YouTube IFrame Player APIを使用しています。 動画の著作権は各権利者に帰属します。
          </p>
          <p className="text-center text-sm text-muted-foreground">©2026 Hakoice Studio All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
