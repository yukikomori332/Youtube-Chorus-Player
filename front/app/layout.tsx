import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const APP_NAME = "歌ってみた合唱プレイヤー for Youtube";
const APP_DESCRIPTION = "複数のYouTube動画を同時に再生して合唱を楽しもう！";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://example.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`, // 各ページで title を設定すると "ページ名 | サービス名" になる
  },
  description: APP_DESCRIPTION,

  // --- クローラー制御 ---
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // --- OGP (Facebook / LINE など) ---
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: BASE_URL,
    siteName: APP_NAME,
    title: APP_NAME,
    description: APP_DESCRIPTION,
    images: [
      {
        url: "/og-image.png", // metadataBase を起点に絶対URLへ解決される
        width: 1200,
        height: 630,
        alt: APP_NAME,
      },
    ],
  },

  // --- Twitter / X Card ---
  twitter: {
    card: "summary_large_image",
    title: APP_NAME,
    description: APP_DESCRIPTION,
    images: ["/og-image.png"],
    // creator: "@your_handle", // アカウントがあれば追加
  },

  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="bg-background">
      <body className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans")}>
        {children}
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
