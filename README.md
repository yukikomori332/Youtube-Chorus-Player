<div id="top"></div>

# 【重要】Youtube API の利用規約にて、1ページで複数のプレイヤーを再生することが禁止されていることを確認したため、サービスを停止！！

## スクリーンショット

<!-- 登録、ログイン、マイページ、マイセット、ソーシャル、アカウント削除、利用規約、プライバシーポリシー、問い合わせ、404 etc -->

| ホーム画面 |
| - |
| <img src="media/screenshot_home-laptop.png" width="100%"> |

<details>

<summary>ホーム - デスクトップ/モバイル</summary>

| デスクトップ | モバイル |
| - | - |
| <img src="media/screenshot_home-laptop.png" width="100%"> | <img src="media/screenshot_home-mobile.png" width="100%"> |

</details>

<details>

<summary>動画追加 - 1件</summary>

| 動画追加 - 1件 |
| - |
| <img src="media/screenshot_home-add-video-1.png" width="100%"> |

</details>

<details>

<summary>動画追加 - 4件</summary>

| 動画追加 - 4件 |
| - |
| <img src="media/screenshot_home-add-video-4.png" width="100%"> |

</details>

<details>

<summary>お問い合わせ・利用規約</summary>

| お問い合わせ | 利用規約 |
| - | - |
| <img src="media/screenshot_contact-laptop.png" width="100%"> | <img src="media/screenshot_term-laptop.png" width="100%"> |

</details>

<details>

<summary>プライバシーポリシー</summary>

| プライバシーポリシー |  |
| - | - |
| <img src="media/screenshot_privacy-laptop.png" width="100%"> | <img src="media/screenshot_dummy-laptop.png" width="100%"> |

</details>

## 使用技術一覧

<p style="display: inline">
  <!-- フレームワーク、ライブラリ、データベース、CI/CD、インフラ一覧 -->
  <img src="https://img.shields.io/badge/-Node.js-000000.svg?logo=node.js&style=for-the-badge">
  <img src="https://img.shields.io/badge/-Next.js-000000?style=for-the-badge&logo=next.js">
  <img src="https://img.shields.io/badge/-React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB">
  <img src="https://img.shields.io/badge/-Typescript-000000?style=for-the-badge&logo=typescript">
  <img src="https://img.shields.io/badge/-TailwindCSS-000000?style=for-the-badge&logo=tailwindCSS">
  <img src="https://img.shields.io/badge/-ESLint-000000?style=for-the-badge&logo=ESLint">
  <img src="https://img.shields.io/badge/-Prettier-000000?style=for-the-badge&logo=Prettier">
  <img src="https://img.shields.io/badge/-jest-000000?style=for-the-badge&logo=jest">
  <img src="https://img.shields.io/badge/-Vercel-000000?style=for-the-badge&logo=Vercel">
  <img src="https://img.shields.io/badge/-GithubActions-000000?style=for-the-badge&logo=GithubActions">
  <img src="https://img.shields.io/badge/-shadcn/ui-000000?style=for-the-badge&logo=shadcn/ui">
  <img src="https://img.shields.io/badge/-v0-000000?style=for-the-badge&logo=v0">
</p>

## 開発期間

2026.05.01 〜 2026.05.07（7日間）<br/>
制作人数 1人</br>

## 目次

1. [開発のきっかけ](#開発のきっかけ)
2. [プロジェクトについて](#プロジェクトについて)
3. [動作確認](#動作確認)
4. [環境](#環境)
5. [技術選定理由](#技術選定理由)
6. [ER図](#er図)
7. [インフラ構成図](#インフラ構成図)
8. [主な機能](#主な機能)
8. [工夫した点](#工夫した点)
9. [修正点](#修正点)
10. [今後の開発について](#今後の開発について)
11. [AIについて](#aiについて)
12. [その他の作品](#その他の作品)

## 開発のきっかけ

新作の歌ってみた動画を視聴中、間違えて別の歌ってみた動画を再生したことがきっかけでした。<br/>
歌声が重なって聞こえると、普段は感じないような臨場感を味わえて面白いと感じ、サービスの開発を始めました。<br/>

## プロジェクトについて

リンク: [歌ってみた合唱プレイヤー for Youtube](https://utattemita-chorus-player-for-youtub.vercel.app/)<br/>
Youtubeの歌ってみた動画や歌枠のアーカイブを複数同時に再生・停止・リピートさせることができるサービスです。<br/>
好きなアーティストさんや普段は聞かないような方との合唱で思わぬ発見ができるかもしれません。<br/>

## 動作確認

■Webサイトでの動作確認<br/>
リンク: [歌ってみた合唱プレイヤー for Youtube](https://utattemita-chorus-player-for-youtub.vercel.app/)

■ローカルでの動作確認<br/>
1. Docker DesktopやDocker EngineなどDockerを実行できる環境を用意
2. Dockerfileを反映 `docker compose build`
3. Dockerコンテナの起動 `docker compose up -d`
4. ローカルホスト`http://localhost:3000/`上で正常に動作することを確認
5. Dockerコンテナの終了 `docker compose down`

## 環境

<!-- 言語、フレームワーク、データベース、インフラの一覧とバージョンを記載 -->

| フロントエンド | バージョン |
| - | - |
| Next.js | 16.2.4 |
| React | 19.2.4 |
| TypeScript | 5.9.3 |

<!-- バックエンド -->

<!-- データベース -->

<!-- 認証 -->

| 環境構築 | バージョン |
| - | - |
| Docker Desktop | 4.37.2 |
| Docker Engine | 27.4.0 |

| CI/CD | バージョン |
| - | - |
| Github Actions |  |

| インフラ | バージョン    |
| - | - |
| Vercel |  |

| その他 | バージョン |
| - | - |
| Tailwind CSS | 4.2.4 |
| ESLint | 9.39.4 |
| Prettier | 3.8.3 |
| Jest | 30.3.0 |
| shadcn/ui | 2.0.1 |
| @vercel/analytics | 2.0.1 |
| @types/youtube | 0.2.0 |

| デザイン | バージョン    |
| - | - |
| v0 |  |

## 技術選定理由

■フロントエンド<br/>

<details>

<summary>Next.js</summary>

- CSR・SSR・SSG・ISRなどレンダリング方法を複数選択できる

- レンダリング方法次第で、SEOの向上が見込め、検索流入を増やせる

- 暫定的なレンダリング方法でサービスを開始できる（今回はCSRでサービスを開始）

- Metadataのカスタマイズができる リンク: [layout.tsx](https://github.com/yukikomori332/Utattemita-Chorus-Player-for-Youtube/blob/main/front/app/layout.tsx)

- 短い期間で早く開発して、自分がサービスを使いたかった（私情）

</details>

<details>

<summary>React</summary></br>

- Next.jsと依存関係があるため

</details>

<details>

<summary>TypeScript</summary>

- Next.jsと依存関係があるため

- 型安全により、エラーの早期発見ができる

</details>

<details>

<summary>TailwindCSS</summary></br>

- Next.jsと依存関係があるため

</details><br/>

■CI/CD<br/>

<details>

<summary>Github Actions</summary></br>

- Githubサービス内でCI/CDを完結できる

</details><br/>

■インフラ<br/>

<details>

<summary>Vercel</summary>

- Next.jsと開発元が同じため、Next.jsのプロジェクトであれば高いパフォーマンスが見込まれる

- GitHubと連携して、プッシュが行われると自動ビルド・デプロイされる

</details><br/>

■その他<br/>

<details>

<summary>ESLint</summary></br>

- Next.jsと依存関係があるため

</details>

<details>

<summary>Prettier</summary>

- Typescriptに対応している

- ESLintと組み合わせることで、高い品質のコードを保てる

</details>

<details>

<summary>Jest</summary>

- JavaScript向けのテストフレームワークであること

- スナップショット機能やカバレッジ計測などテストに欠かせない機能が揃っている

</details>

<details>

<summary>shadcn/ui</summary></br>

- きれいな見た目のコンポーネントを簡単に実装できる

</details>

<details>

<summary>@vercel/analytics</summary>

- Cookieを介さずにWebサイトを解析できる

- 同意を求めるポップアップが不要

</details>

<details>

<summary>@types/youtube</summary></br>

- Youtube IFrame API の読み込みに必要

</details><br/>

■デザイン<br/>

<details>

<summary>v0</summary></br>

- デザインとプログラムの両方で高速にプロトタイプが作成できる

</details>


## ER図

実装予定</br>

<!-- <img src="media/er-diagram.png" width="100%">  -->

## インフラ構成図

実装予定</br>

<!-- <img src="media/infra-config.png" width="100%">  -->

## 主な機能

音量調整</br>

<details>

<summary>開始/終了の時間指定</summary></br>

- ミリ秒単位まで開始/終了の時間指定が可能</br></br>

| 開始/終了の時間指定 |
| - |
| <img src="media/videocapture_specific-time.gif" width="100%"> |

</details>

<details>

<summary>同期的なリピート</summary></br>

- 他の動画の終了を待ってから、リピートを開始する</br></br>

| 同期的なリピート |
| - |
| <img src="media/videocapture_sync-repeat.gif" width="100%"> |

</details>

## 工夫した点

<details>

<summary>Webサイトが初めて読み込まれる時のベンチマークの向上</summary></br>

デベロッパーツールのLighthouseでWebサイトの品質（初回読み込み）を調査しました。</br>
Youtube IFrame APIの読み込み時に、YoutubeサードパーティのCookieがChrome等のブラウザにブロックされるため、警告が出ていました。</br>
解決策として、Webサイトが初めて読み込まれる時にYoutube IFrame APIの読み込みを行うのではなく、Youtube URL入力時にYoutube IFrame APIの読み込みが行われるようにしました。</br>
これにより、Webサイトが初めて読み込まれる時にYoutubeサードパーティのCookieがブラウザからブロックされることはなくなりました。</br>
ただし、Youtube IFrame APIを読み込んだ時点でCookieがブラウザからブロックされることに変わりはありません。</br>
ですが、結果としてWebサイトが初めて読み込まれる時のベンチマークを向上させることができました。</br></br>

| 修正前 | 修正後 |
| - | - |
| <img src="media/lighthouse-report_before.png" width="100%"> | <img src="media/lighthouse-report_after.png" width="100%"> |

リンク: [chorus-player.tsx](https://github.com/yukikomori332/Utattemita-Chorus-Player-for-Youtube/blob/main/front/components/chorus-player.tsx)</br>

</details>

## 修正点

<details>

<summary>componentsのロジック部分の責務分離</summary>

- ChorusPlayerコンポーネントのカスタムhooksを作成する</br>

リンク: [chorus-player.tsx](https://github.com/yukikomori332/Utattemita-Chorus-Player-for-Youtube/blob/main/front/components/chorus-player.tsx)</br>

- VideoCardコンポーネントのカスタムhooksを作成する</br>

リンク: [video-card.tsx](https://github.com/yukikomori332/Utattemita-Chorus-Player-for-Youtube/blob/main/front/components/video-card.tsx)</br>

</details>

<details>

<summary>VideoCardコンポーネントのテストパターンが不足</summary></br>

- リピートオプションがON/OFF、開始時間の指定あり/なし、終了時間の指定あり/なし などのパターンの総当たりができていない</br>

</details>

## 今後の開発について

まずはマイセットページや動画のマイセット追加機能を作成し、サービスの利便性を上げたいと考えています。<br/>
また、それらを公開して閲覧できるソーシャルなページを実装したいと考えています。<br/>
今後はバックエンドの技術選定から、バックエンドの実装までを目指します。<br/>

<details>

<summary>今後開発予定の機能</summary>

- マイセットページの作成<br/>

- マイセット保存ページの作成<br/>

- マイセット編集ページの作成<br/>

- ソーシャルページの作成<br/>

- 人気順、新着順の表示<br/>

- 検索機能<br/>

- ライク機能<br/>

- Google認証<br/>

</details>

## AIについて

<details>

<summary>AIコードエディタ Cursor と Claude Code on the web を利用した点</summary>

- Dockerfile, docker-compose.yml, eslint.config.mjs, jest.config.ts, frontend-ci.yml ファイルの設定追加・修正</br>

- Dockerfile, docker-compose.yml, eslint.config.mjs, jest.config.ts, frontend-ci.yml ファイルのコメントの加筆修正</br>

- .ts, .tsx, test.ts, test.tsxファイルの叩き台の作成</br>

- .ts, .tsx, test.ts, test.tsxファイルの記述追加・修正</br>

- .ts, .tsx, test.ts, test.tsxファイルのコメントの加筆修正</br>

</details>

v0によるホーム画面のデザイン</br>

## その他の作品

リンク: [団子爆弾シュミレーター](https://github.com/yukikomori332/DangoBakudanSimulator-Public)（公開中の個人制作ゲーム）</br>

リンク: [公式サイト](https://hakoice-studio-official-site.vercel.app/)（個人制作ゲーム作品一覧）</br>

<details>
<summary>公式サイトの使用技術</summary>

<p style="display: inline">
  <!-- フロントエンドのフレームワーク一覧 -->
  <img src="https://img.shields.io/badge/-Docker-000000?style=for-the-badge&logo=docker">
  <img src="https://img.shields.io/badge/-Node.js-000000.svg?logo=node.js&style=for-the-badge">
  <img src="https://img.shields.io/badge/-React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB">
  <img src="https://img.shields.io/badge/-Next.js-000000?style=for-the-badge&logo=next.js">
  <img src="https://img.shields.io/badge/-Typescript-000000?style=for-the-badge&logo=typescript">
  <img src="https://img.shields.io/badge/-TailwindCSS-000000?style=for-the-badge&logo=tailwindCSS">
  <img src="https://img.shields.io/badge/-Fontawesome-000000?style=for-the-badge&logo=fontawesome">
  <img src="https://img.shields.io/badge/-Vercel-000000?style=for-the-badge&logo=vercel">
</p>

</details>

<details>
<summary>公式サイトの環境</summary>

<!-- 言語、フレームワーク、ミドルウェア、インフラの一覧とバージョンを記載 -->

| 言語・フレームワーク                    | バージョン |
| --------------------------------- | ------- |
| Docker                            | 27.4.0  |
| Node.js                           | 20.17.6 |
| React                             | 19.0.1  |
| Next.js                           | 15.0.5  |
| Typescript                        | 5.6.3   |
| TailwindCSS                       | 3.4.14  |
| fortawesome/fontawesome-svg-core  | 6.6.0   |
| fortawesome/free-brands-svg-icons | 6.6.0   |
| fortawesome/react-fontawesome     | 0.2.2   |

</details>

<p align="right">(<a href="#top">トップへ</a>)</p>
