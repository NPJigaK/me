---
author: Devkey
pubDatetime: 2019-12-29T18:51:13.737Z
title: 【PUBG】タイムゾーンを1クリックで変更させる方法【東京⇔北京】
slug: change-timezone-pubg
featured: false
ogImage: ../../../assets/images/blog/2019/tokyo-beijing.jpg
tags:
  - PUBG
  - ゲームライフハック
description: PUBGで8×8マップを遊びたいのにマッチしない？そんなときは、サーバーリージョンを変更してみよう。1クリックで切り替えられる便利な方法を紹介します。
---

> [!note] **この記事は [`steins.gg`](https://x.com/search?q=steins.gg&src=typeahead_click&f=live) から移行した記事です。** 
> 
> `.gg` ドメインの維持費が高いため `steins.gg` は閉鎖しました。 

おはこんばんちは！最近、PUBGにどハマりしている主です！

すぐにマッチしてカジュアルに楽しめる4×4マップが人気ですが、たまには8×8マップもやりたくなりますよね！  
ただ、8×8マップはマッチングにかかる時間が長く、スクリムとかに出てないとプレイの機会が少ないのが悩みどころ…。

そんなとき、**マッチするサーバーをアジアサーバーに変更する**だけで、マッチングにかかる時間を大幅に短縮できることをご存じでしょうか？

今回は、**簡単にアジアサーバーに変更する方法**をご紹介します！

![PUBG-tokyo-beijing](@/assets/images/blog/2019/tokyo-beijing.jpg)

## 目次

## タイムゾーン変更ファイルを作る
PUBGでは、**PCのタイムゾーンを変更することで、マッチするサーバーのリージョンを変更**することができます。

- 「**東京（UTC+9:00）**」にすると → **KRJP（韓国・日本サーバー）**
- 「**北京（UTC+8:00）**」にすると → **AS（アジアサーバー）**

しかし、Windowsの「日付と時刻の設定」から毎回手動で変更するのは、**3回くらいクリック操作が必要**で面倒です…。  
というわけで、**1クリックで切り替えられるファイル**を作りましょう！

### Step 1. テキストファイルを作る

まずは、デスクトップなどで**右クリック → 新規作成 → テキストドキュメント**を選びます。
![create-new-text-document](@/assets/images/blog/2020/create-new-text-document.jpg)

「北京用」と「東京用」の**2つのファイル**を用意しておくと分かりやすいです。（自分で分かりやすいファイル名でOK）
- 北京.text
- 東京.text

### Step 2. ファイルを編集する
それぞれのファイルをメモ帳などのテキストエディタで開き、以下の内容をコピペします。

- 北京.text
```
:: 北京
tzutil /s "China Standard Time"
```

- 東京.text
```
:: 東京
tzutil /s "Tokyo Standard Time"
```

コピペができたら、しっかり保存してくださいね。

### Step 3. 拡張子を .bat に変更する
保存ができたら、それぞれのファイルの**拡張子**を `.bat` に変更します。
- 北京.text → 北京.bat
- 東京.text → 東京.bat

> [!important] 拡張子が表示されない場合は、エクスプローラーの「表示」タブから「ファイル名拡張子」にチェックを入れてください。

### Step 4. ファイルを実行する
あとは、PUBGを起動する前に使いたいサーバーに応じて対応する `.bat` ファイルをダブルクリックするだけ！  
タスクトレイに表示される時計のタイムゾーンが変わっていれば、成功です！お疲れさまでした！

## さいごに
最後まで読んでいただきありがとうございます！  
毎回手動でやる操作こそ、なるべくラクにしたいですよね。  
少しでも参考になったら嬉しいです。  
それでは、よきPUBGライフを！

## おまけ
他の国のタイムゾーンに変えたい人向け（PUBGではあまり使わなそうですが）

```
(UTC-12:00) 国際日付変更線 西側
Dateline Standard Time

(UTC-11:00) 協定世界時-11
UTC-11

(UTC-10:00) アリューシャン諸島
Aleutian Standard Time

(UTC-10:00) ハワイ
Hawaiian Standard Time

(UTC-09:30) マルキーズ諸島
Marquesas Standard Time

(UTC-09:00) アラスカ
Alaskan Standard Time

(UTC-09:00) 協定世界時-09
UTC-09

(UTC-08:00) バハカリフォルニア
Pacific Standard Time (Mexico)

(UTC-08:00) 協定世界時-08
UTC-08

(UTC-08:00) 太平洋標準時 (米国およびカナダ)
Pacific Standard Time

(UTC-07:00) アリゾナ
US Mountain Standard Time

(UTC-07:00) チワワ、ラパス、マサトラン
Mountain Standard Time (Mexico)

(UTC-07:00) 山地標準時 (米国およびカナダ)
Mountain Standard Time

(UTC-06:00) イースター島
Easter Island Standard Time

(UTC-06:00) グアダラハラ、メキシコシティ、モンテレー
Central Standard Time (Mexico)

(UTC-06:00) サスカチュワン
Canada Central Standard Time

(UTC-06:00) 中央アメリカ
Central America Standard Time

(UTC-06:00) 中部標準時 (米国およびカナダ)
Central Standard Time

(UTC-05:00) インディアナ東部
US Eastern Standard Time

(UTC-05:00) タークス・カイコス諸島
Turks And Caicos Standard Time

(UTC-05:00) チェトゥマル
Eastern Standard Time (Mexico)

(UTC-05:00) ハイチ
Haiti Standard Time

(UTC-05:00) ハバナ
Cuba Standard Time

(UTC-05:00) ボゴタ、リマ、キト、リオ ブランコ
SA Pacific Standard Time

(UTC-05:00) 東部標準時 (米国およびカナダ)
Eastern Standard Time

(UTC-04:00) アスンシオン
Paraguay Standard Time

(UTC-04:00) カラカス
Venezuela Standard Time

(UTC-04:00) クイアバ
Central Brazilian Standard Time

(UTC-04:00) サンティアゴ
Pacific SA Standard Time

(UTC-04:00) ジョージタウン、ラパス、マナウス、サンフアン
SA Western Standard Time

(UTC-04:00) 大西洋標準時 (カナダ)
Atlantic Standard Time

(UTC-03:30) ニューファンドランド
Newfoundland Standard Time

(UTC-03:00) アラグァイナ
Tocantins Standard Time

(UTC-03:00) カイエンヌ、フォルタレザ
SA Eastern Standard Time

(UTC-03:00) グリーンランド
Greenland Standard Time

(UTC-03:00) サルバドル
Bahia Standard Time

(UTC-03:00) サンピエール・ミクロン
Saint Pierre Standard Time

(UTC-03:00) ブエノスアイレス
Argentina Standard Time

(UTC-03:00) ブラジリア
E. South America Standard Time

(UTC-03:00) プンタアレーナス
Magallanes Standard Time

(UTC-03:00) モンテビデオ
Montevideo Standard Time

(UTC-02:00) 協定世界時-02
UTC-02

(UTC-01:00) アゾレス諸島
Azores Standard Time

(UTC-01:00) カーボベルデ諸島
Cape Verde Standard Time

(UTC) 協定世界時
UTC

(UTC+00:00) ダブリン、エジンバラ、リスボン、ロンドン
GMT Standard Time

(UTC+00:00) モンロビア、レイキャビク
Greenwich Standard Time

(UTC+01:00) アムステルダム、ベルリン､ベルン、ローマ､ストックホルム､ウィーン
W. Europe Standard Time

(UTC+01:00) カサブランカ
Morocco Standard Time

(UTC+01:00) サラエボ、スコピエ、ワルシャワ、ザグレブ
Central European Standard Time

(UTC+01:00) サントメ
Sao Tome Standard Time

(UTC+01:00) ブリュッセル、コペンハーゲン、マドリード、パリ
Romance Standard Time

(UTC+01:00) ベオグラード、ブラチスラバ、ブダペスト、リュブリャナ、プラハ
Central Europe Standard Time

(UTC+01:00) 西中央アフリカ
W. Central Africa Standard Time

(UTC+02:00) アテネ、ブカレスト
GTB Standard Time

(UTC+02:00) アンマン
Jordan Standard Time

(UTC+02:00) ウィントフック
Namibia Standard Time

(UTC+02:00) エルサレム
Israel Standard Time

(UTC+02:00) カイロ
Egypt Standard Time

(UTC+02:00) ガザ、ヘブロン
West Bank Standard Time

(UTC+02:00) カリーニングラード
Kaliningrad Standard Time

(UTC+02:00) キシナウ
E. Europe Standard Time

(UTC+02:00) ダマスカス
Syria Standard Time

(UTC+02:00) トリポリ
Libya Standard Time

(UTC+02:00) ハラーレ、プレトリア
South Africa Standard Time

(UTC+02:00) ハルツーム
Sudan Standard Time

(UTC+02:00) ベイルート
Middle East Standard Time

(UTC+02:00) ヘルシンキ、キエフ、リガ、ソフィア、タリン、ビリニュス
FLE Standard Time

(UTC+03:00) イスタンブール
Turkey Standard Time

(UTC+03:00) クウェート、リヤド
Arab Standard Time

(UTC+03:00) ナイロビ
E. Africa Standard Time

(UTC+03:00) バグダッド
Arabic Standard Time

(UTC+03:00) ミンスク
Belarus Standard Time

(UTC+03:00) モスクワ、サンクトペテルブルク
Russian Standard Time

(UTC+03:30) テヘラン
Iran Standard Time

(UTC+04:00) アストラハン、ウリヤノフスク
Astrakhan Standard Time

(UTC+04:00) アブダビ、マスカット
Arabian Standard Time

(UTC+04:00) イジェフスク、サマーラ
Russia Time Zone 3

(UTC+04:00) エレバン
Caucasus Standard Time

(UTC+04:00) サラトフ
Saratov Standard Time

(UTC+04:00) トビリシ
Georgian Standard Time

(UTC+04:00) バク
Azerbaijan Standard Time

(UTC+04:00) ポート ルイス
Mauritius Standard Time

(UTC+04:00) ボルゴグラード
Volgograd Standard Time

(UTC+04:30) カブール
Afghanistan Standard Time

(UTC+05:00) アシハバード、タシケント
West Asia Standard Time

(UTC+05:00) イスラマバード、カラチ
Pakistan Standard Time

(UTC+05:00) エカテリンブルク
Ekaterinburg Standard Time

(UTC+05:30) スリジャヤワルダナプラコッテ
Sri Lanka Standard Time

(UTC+05:30) チェンナイ、コルカタ、ムンバイ、ニューデリー
India Standard Time

(UTC+05:45) カトマンズ
Nepal Standard Time

(UTC+06:00) アスタナ
Central Asia Standard Time

(UTC+06:00) オムスク
Omsk Standard Time

(UTC+06:00) ダッカ
Bangladesh Standard Time

(UTC+06:30) ヤンゴン (ラングーン)
Myanmar Standard Time

(UTC+07:00) クラスノヤルスク
North Asia Standard Time

(UTC+07:00) トムスク
Tomsk Standard Time

(UTC+07:00) ノボシビルスク
N. Central Asia Standard Time

(UTC+07:00) バルナウル、ゴルノ・アルタイスク
Altai Standard Time

(UTC+07:00) バンコク、ハノイ、ジャカルタ
SE Asia Standard Time

(UTC+07:00) ホブド
W. Mongolia Standard Time

(UTC+08:00) イルクーツク
North Asia East Standard Time

(UTC+08:00) ウランバートル
Ulaanbaatar Standard Time

(UTC+08:00) クアラルンプール、シンガポール
Singapore Standard Time

(UTC+08:00) パース
W. Australia Standard Time

(UTC+08:00) 台北
Taipei Standard Time

(UTC+08:00) 北京、重慶、香港特別行政区、ウルムチ
China Standard Time

(UTC+08:45) ユークラ
Aus Central W. Standard Time

(UTC+09:00) ソウル
Korea Standard Time

(UTC+09:00) チタ
Transbaikal Standard Time

(UTC+09:00) ヤクーツク
Yakutsk Standard Time

(UTC+09:00) 大阪、札幌、東京
Tokyo Standard Time

(UTC+09:00) 平壌
North Korea Standard Time

(UTC+09:30) アデレード
Cen. Australia Standard Time

(UTC+09:30) ダーウィン
AUS Central Standard Time

(UTC+10:00) ウラジオストク
Vladivostok Standard Time

(UTC+10:00) キャンベラ、メルボルン、シドニー
AUS Eastern Standard Time

(UTC+10:00) グアム、ポートモレスビー
West Pacific Standard Time

(UTC+10:00) ブリズベン
E. Australia Standard Time

(UTC+10:00) ホバート
Tasmania Standard Time

(UTC+10:30) ロードハウ島
Lord Howe Standard Time

(UTC+11:00) サハリン
Sakhalin Standard Time

(UTC+11:00) ソロモン諸島、ニューカレドニア
Central Pacific Standard Time

(UTC+11:00) チョクルダフ
Russia Time Zone 10

(UTC+11:00) ノーフォーク島
Norfolk Standard Time

(UTC+11:00) ブーゲンビル島
Bougainville Standard Time

(UTC+11:00) マガダン
Magadan Standard Time

(UTC+12:00) アナディリ、ペトロパブロフスク・カムチャツキー
Russia Time Zone 11

(UTC+12:00) オークランド、ウェリントン
New Zealand Standard Time

(UTC+12:00) フィジー
Fiji Standard Time

(UTC+12:00) 協定世界時+12
UTC+12

(UTC+12:45) チャタム諸島
Chatham Islands Standard Time

(UTC+13:00) サモア
Samoa Standard Time

(UTC+13:00) ヌクアロファ
Tonga Standard Time

(UTC+13:00) 協定世界時+13
UTC+13

(UTC+14:00) クリスマス島
Line Islands Standard Time
```
