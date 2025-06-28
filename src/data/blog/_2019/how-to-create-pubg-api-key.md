---
author: Devkey
pubDatetime: 2019-12-29T18:51:13.737Z
title: 【PUBG】PUBG API の使い方【API Key 作成から】
featured: false
ogImage: ../../../assets/images/blog/2019/pubg-apikey.jpg
tags:
  - PUBG
  - 開発（ゲーム関連）
description: PUBG（PlayerUnknown's Battlegrounds）のマッチデータなどを分析するためには、公式の開発者APIキーが必要です。ここでは、PUBG APIキー取得手順を紹介します。
---

> [!note] **この記事は [`steins.gg`](<https://x.com/search?q=(steinsgg%20OR%20steins.gg%20OR%20%40SteinsGG)%20until%3A2021-01-01&f=live&src=typed_query>) から移行した記事です。**
>
> `.gg` ドメインの維持費が高いため `steins.gg` は閉鎖しました。

おはこんばんちは！最近、PUBGのAPIを使った分析ツール作りにどハマりしている主です！  
今回は、PUBGの公式APIキーの取得方法をわかりやすく解説します！

## 目次

## 1. 準備：必要なもの

- PUBGアカウント（Steamアカウント）
- メールアドレス（連絡用）

## 2. PUBG Developer Portal にアクセス

1. ブラウザで [**PUBG Developer Portal**](https://developer.pubg.com/）にアクセス。
2. ページ上部の「Sign in」をクリックしてSteamアカウントでログイン。
3. PUBGの利用規約に同意し、「Allow」をクリック。

## 3. アプリケーションの作成

1. ログイン後のダッシュボードにある「Get your own API key」をクリック。
2. 必要事項を入力するフォームが表示されるので、以下を入力します。

   - **Application Name**（任意）：自分のツールやプロジェクト名
   - **Application Description**：どのような用途でAPIを利用するか簡単に説明
   - **Application Website**（任意）：自分のウェブサイトやGitHubリポジトリのURL（あれば記入）

3. 「Create Application」ボタンを押してアプリケーションを作成。

## 4. API キーの取得

アプリケーション作成後、以下のような画面が表示されます。

```
API KEY
──────────────────────────────
ここに自動生成されたキーが表示されます。
──────────────────────────────
Rate Limit: Base Tier 10 Requests Per Minute
```

- 表示されたAPIキーを安全な場所にコピーして保存します。
- APIキーは絶対に他人と共有しないでください。漏洩した場合はすぐにキーを削除して新しく再発行してください。

## 5. テストリクエスト

APIキーが正しく発行されたことを確認するために、テストリクエストを送ります。

```bash
curl -H \"Authorization: Bearer <YOUR_API_KEY>\" \\
     \"https://api.playbattlegrounds.com/shards/pc-na/players?filter[playerNames]=yourPlayerName\"
```

- レスポンスとして200 OKが返れば成功です。

## 6. よくある質問

- **複数のAPIキーを取得できますか？**

  - 可能ですが、管理が煩雑になるため推奨されていません。

- **リクエストの制限は？**

  - 通常は毎分10回。より多くのリクエストが必要な場合は、個別に問い合わせが必要です。

- **商用利用できますか？**

  - 非商用目的での利用に限定されています。商用の場合は公式サポートへ問い合わせてください。

以上がPUBG APIキー取得手順です。取得したキーを使って、さまざまな分析やツール開発に役立ててください！
