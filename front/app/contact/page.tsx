import Link from "next/link";
import { Music, Mail, Info } from "lucide-react";

export const metadata = {
  title: "お問い合わせ | 歌ってみた合唱プレイヤー for Youtube",
  description: "歌ってみた合唱プレイヤー for Youtubeへのお問い合わせページです。",
};

export default function ContactPage() {
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
      <main className="flex-1 container mx-auto px-4 py-10 max-w-3xl">
        {/* タイトル */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
            <Mail className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">お問い合わせ</h2>
            <p className="text-sm text-muted-foreground">ご意見・ご要望・不具合報告などはこちらから</p>
          </div>
        </div>

        {/* 注意書き */}
        <div className="mb-6 p-4 rounded-lg bg-muted/50 border flex items-start gap-2 text-sm text-muted-foreground">
          <Info className="h-4 w-4 mt-0.5 shrink-0" />
          <p className="leading-relaxed">
            お問い合わせへの返信には数日かかる場合があります。 返信はご入力いただいたメールアドレス宛にお送りします。
            なお、お問い合わせ内容によってはご返答できない場合もございますので、あらかじめご了承ください。
          </p>
        </div>

        {/* Google Form埋め込み */}
        <div className="rounded-lg border overflow-hidden">
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLScPG3o4tZ63JeYCRjqk1gdGgxlRGT5cXKDZAaEacAZdDHVh-w/viewform?embedded=true"
            className="w-full h-[1000px] bg-background"
            title="お問い合わせフォーム"
            loading="lazy"
          >
            フォームを読み込んでいます...
          </iframe>
        </div>
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
