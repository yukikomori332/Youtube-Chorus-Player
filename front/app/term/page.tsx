import Link from "next/link";
import { Music, FileText } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { ALL_NAV_ITEMS } from "@/lib/navigation";

export const metadata = {
  title: "利用規約 | 歌ってみた合唱プレイヤー for Youtube",
  description: "歌ってみた合唱プレイヤー for Youtubeの利用規約ページです。",
};

const navItems = ALL_NAV_ITEMS.filter((item) => item.href !== "/term");

export default function TermsPage() {
  const sections = [
    {
      title: "第1条（適用）",
      content: `本規約は、Hakoice Studio（以下「開発者」）が提供する歌ってみた合唱プレイヤー for Youtube（以下「本サービス」）の利用に関する条件を定めるものです。ユーザーの皆様には、本規約に同意した上で本サービスをご利用いただきます。`,
    },
    {
      title: "第2条（サービスの内容）",
      content: `本サービスは、ユーザーが入力したYouTube URLの動画を複数同時に再生する機能を提供します。本サービスはYouTube IFrame Player APIを利用しており、動画コンテンツはYouTube上に存在するものを参照するものです。\n本サービスをご利用の場合、YouTubeの利用規約（https://www.youtube.com/t/terms）にも同意したものとみなします。`,
    },
    {
      title: "第3条（著作権）",
      content: `本サービス上で再生される動画の著作権は、各動画の権利者に帰属します。ユーザーは、著作権法および関連法令を遵守した上で本サービスをご利用ください。本サービスを通じた動画の違法な複製・配布・二次利用は禁止します。`,
    },
    {
      title: "第4条（禁止事項）",
      content: `ユーザーは以下の行為を行ってはなりません。\n・法令または公序良俗に違反する行為\n・本サービスの運営を妨害する行為\n・他のユーザーまたは第三者の権利を侵害する行為\n・本サービスを商業目的で無断利用する行為\n・YouTube動画のダウンロード、ローカル保存、または独自サーバーでの再ホスト\n・YouTubeプレーヤーのUI・ロゴ・コントロールの改ざん・非表示化\n・YouTube APIを通じて取得したデータの不正な二次利用・販売\n・その他、開発者が不適切と判断する行為`,
    },
    {
      title: "第5条（免責事項）",
      content: `開発者は、本サービスの提供にあたり、サービスの継続性・正確性・完全性を保証するものではありません。本サービスの利用に起因して生じたいかなる損害についても、開発者は責任を負いかねます。また、YouTube側の仕様変更・障害によりサービスが利用できない場合も同様です。\nYouTubeのAPI利用規約・ポリシーの変更により、本サービスの機能の一部または全部が制限・停止される場合があります。この場合も開発者は責任を負いません。`,
    },
    {
      title: "第6条（サービスの変更・終了）",
      content: `開発者は、ユーザーへの事前通知なく、本サービスの内容を変更または終了することがあります。これにより生じた損害について、開発者は責任を負いません。`,
    },
    {
      title: "第7条（プライバシー）",
      content: `本サービスにおける個人情報の取り扱いについては、別途定める「プライバシーポリシー」をご参照ください。\n本サービスはYouTube API Servicesを利用しています。YouTube APIの利用に際し、Googleのプライバシーポリシー（http://www.google.com/policies/privacy）が適用される場合があります。`,
    },
    {
      title: "第8条（規約の変更）",
      content: `開発者は、必要に応じて本規約を変更することがあります。変更後の規約はサービス上に掲示した時点から効力を持ち、ユーザーが引き続きサービスを利用した場合は変更に同意したものとみなします。`,
    },
    {
      title: "第9条（準拠法・管轄裁判所）",
      content: `本規約は日本法に準拠し、本サービスに関する紛争については、開発者所在地を管轄する裁判所を専属的合意管轄とします。`,
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
            <FileText className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">利用規約</h2>
            <p className="text-sm text-muted-foreground">最終更新日：2026年5月1日</p>
          </div>
        </div>

        {/* 前文 */}
        <div className="mb-8 p-4 rounded-lg bg-muted/50 border text-sm text-muted-foreground leading-relaxed">
          本サービスをご利用いただく前に、以下の利用規約をよくお読みください。
          本サービスをご利用いただいた時点で、本規約に同意したものとみなします。
        </div>

        {/* 各条文 */}
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
          本規約に関するお問い合わせは{" "}
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
