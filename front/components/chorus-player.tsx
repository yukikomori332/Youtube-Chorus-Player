"use client";

import { Play, Pause, RotateCcw, Music, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VideoInput } from "@/components/video-input";

export function ChorusPlayer() {
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
                <h1 className="text-xl font-bold">YouTube合唱プレイヤー</h1>
                <p className="text-xs text-muted-foreground">複数の動画を同時再生して合唱を楽しもう</p>
              </div>
            </div>

            {/* 再生コントロール */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" title="リセット">
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button size="lg" className="gap-2">
                <>
                  <Pause className="h-5 w-5" />
                  一時停止
                </>
              </Button>
              <Button size="lg" className="gap-2">
                <>
                  <Play className="h-5 w-5" />
                  同時再生
                </>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* URL入力 */}
        <section className="max-w-2xl mx-auto">
          {/* URL入力用コンポーネントを読み込む */}
          <VideoInput />
        </section>

        {/* 動画グリッド */}
        <section className="text-center py-20">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
              <Music className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold">動画を追加して始めよう</h2>
            <p className="text-muted-foreground">
              YouTube URLを入力して、お気に入りの歌ってみた動画を追加してください。
              複数の動画を同時に再生して、夢の合唱を実現しましょう！
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
