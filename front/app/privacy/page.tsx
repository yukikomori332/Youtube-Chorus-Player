import Link from "next/link";
import { Music, Shield } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { ALL_NAV_ITEMS } from "@/lib/navigation";

export const metadata = {
  title: "プライバシーポリシー | 歌ってみた合唱プレイヤー for Youtube",
  description: "歌ってみた合唱プレイヤー for Youtubeのプライバシーポリシーページです。",
};

const navItems = ALL_NAV_ITEMS.filter((item) => item.href !== "/privacy");

export default function PrivacyPage() {
  const sections = [
    {
      title: "1. 収集する情報",
      content: `本サービスでは、以下の情報を収集する場合があります。\n\n・お問い合わせフォームにご入力いただいた情報（氏名、メールアドレス、お問い合わせ内容など）\n・アクセスログ（IPアドレス、ブラウザの種類、アクセス日時、参照URLなど）\n・Cookieおよびこれに類する技術を通じて取得される情報`,
    },
    {
      title: "2. 情報の利用目的",
      content: `収集した情報は以下の目的で利用します。\n\n・お問い合わせへの対応\n・サービスの改善・開発\n・利用状況の分析\n・不正利用の防止`,
    },
    {
      title: "3. 第三者への提供",
      content: `開発者は、以下の場合を除き、収集した個人情報を第三者に提供しません。\n\n・ユーザーの同意がある場合\n・法令に基づく開示が必要な場合\n・人の生命・身体・財産の保護のために必要な場合`,
    },
    {
      title: "4. Cookieの利用",
      content: `本サービスでは、サービス改善・利用状況分析のためにCookieを使用することがあります。ブラウザの設定によりCookieを無効にすることができますが、一部の機能がご利用いただけなくなる場合があります。`,
    },
    {
      title: "5. Google Analytics",
      content: `本サービスでは、アクセス解析のためにGoogle Analyticsを使用する場合があります。Google Analyticsはデータ収集のためにCookieを使用します。収集されるデータはGoogleのプライバシーポリシーに従って管理されます。Google Analyticsのオプトアウトについては、Googleのサイトをご参照ください。`,
    },
    {
      title: "6. YouTube APIについて",
      content: `本サービスはYouTube IFrame Player APIを利用しています。YouTubeの動画を再生する際には、YouTubeのプライバシーポリシーが適用されます。詳細はGoogleのプライバシーポリシーをご確認ください。`,
    },
    {
      title: "7. 個人情報の管理",
      content: `開発者は、収集した個人情報の漏洩・滅失・毀損を防ぐため、適切なセキュリティ対策を講じます。不要になった個人情報は、適切な方法で廃棄します。`,
    },
    {
      title: "8. お問い合わせ",
      content: `個人情報の取り扱いに関するお問い合わせ・開示・訂正・削除のご請求は、お問い合わせページよりご連絡ください。`,
    },
    {
      title: "9. プライバシーポリシーの変更",
      content: `本ポリシーは、必要に応じて変更することがあります。変更後のポリシーはサービス上への掲示をもって効力を持ちます。`,
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ヘッダー */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
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
            <div className="flex items-center gap-1">
              {/* ナビゲーション */}
              <Navigation items={navItems} />
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1 container mx-auto px-4 py-10 max-w-3xl">
        {/* タイトル */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
            <Shield className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">プライバシーポリシー</h2>
            <p className="text-sm text-muted-foreground">最終更新日：2026年5月1日</p>
          </div>
        </div>

        {/* 前文 */}
        <div className="mb-8 p-4 rounded-lg bg-muted/50 border text-sm text-muted-foreground leading-relaxed">
          Hakoice Studio（以下「開発者」）は、歌ってみた合唱プレイヤー for
          Youtube（以下「本サービス」）における個人情報の取り扱いについて、 以下のとおりプライバシーポリシーを定めます。
        </div>

        {/* 各セクション */}
        <div className="space-y-8">
          {sections.map((section) => (
            <section key={section.title}>
              <h3 className="text-base font-semibold mb-2">{section.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{section.content}</p>
            </section>
          ))}
        </div>

        {/* お問い合わせへの誘導 */}
        <div className="mt-12 pt-8 border-t text-sm text-muted-foreground">
          プライバシーポリシーに関するお問い合わせは{" "}
          <Link href="/contact" className="underline underline-offset-4 hover:text-foreground transition-colors">
            お問い合わせページ
          </Link>{" "}
          よりご連絡ください。
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
