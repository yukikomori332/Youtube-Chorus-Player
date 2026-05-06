"use client";

import Link from "next/link";
import { Music, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InternalServerError() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ヘッダー */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                <Music className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold">歌ってみた合唱プレイヤー for Youtube</h1>
                <p className="text-xs text-muted-foreground">複数の動画を同時に再生して合唱を楽しもう！</p>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1 flex items-center justify-center container mx-auto px-4 py-12">
        <div className="text-center max-w-md mx-auto space-y-6">
          {/* アイコン */}
          <div className="w-24 h-24 mx-auto rounded-full bg-muted flex items-center justify-center">
            <Music className="h-12 w-12 text-muted-foreground" />
          </div>

          {/* エラーコード */}
          <div>
            <p className="text-8xl font-black text-primary/20 leading-none select-none">500</p>
            <h2 className="text-2xl font-bold mt-2">サーバーエラーが発生しました</h2>
          </div>

          {/* 説明 */}
          <p className="text-muted-foreground leading-relaxed">
            サーバー側で予期しないエラーが発生しました。
            <br />
            しばらく時間をおいてから再度お試しください。
            <br />
            問題が解決しない場合は、お問い合わせください。
          </p>

          {/* ボタン */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" variant="outline" className="gap-2" onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4" />
              ページを再読み込み
            </Button>
            <Button asChild size="lg" className="gap-2">
              <Link href="/">
                <Home className="h-4 w-4" />
                トップページへ戻る
              </Link>
            </Button>
          </div>

          {/* お問い合わせリンク */}
          <p className="text-sm text-muted-foreground">
            問題が続く場合は{" "}
            <Link href="/contact" className="underline underline-offset-4 hover:text-foreground transition-colors">
              お問い合わせ
            </Link>{" "}
            ください。
          </p>
        </div>
      </main>

      {/* フッター */}
      <footer className="border-t">
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
