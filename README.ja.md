[English](README.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · **日本語** · [中文](README.zh.md) · [हिन्दी](README.hi.md)

# gate303 · 303 Trainer

TB-303 のベースラインをステップごとに書き、303 風の音で聴き、本物の TB-303（またはクローン）に打ち込むための **ボタンごとの手順書** を手に入れましょう。303 の打ち込みはわかりにくいことで有名ですが、このアプリが翻訳してくれます。

**▶ アプリを開く：** https://buenosairesfront.github.io/gate303/

画面は 6 言語：[`?lang=es`](https://buenosairesfront.github.io/gate303/?lang=es) · [`en`](https://buenosairesfront.github.io/gate303/?lang=en) · [`de`](https://buenosairesfront.github.io/gate303/?lang=de) · [`ja`](https://buenosairesfront.github.io/gate303/?lang=ja) · [`zh`](https://buenosairesfront.github.io/gate303/?lang=zh) · [`hi`](https://buenosairesfront.github.io/gate303/?lang=hi)。

## 使い方

### 1 · ラインを書く
パターンは 1〜16 ステップのグリッドです。ステップを選んで種類を決めます：

- **NOTE**：音を鳴らす。1 オクターブの **鍵盤** で音高を決め、**DOWN / UP** で 1 オクターブ上下、**ACC** でアクセント、**SLIDE** で次の音へスライド。
- **TIE**（タイ）：前の音を伸ばす。
- **REST**（休符）：無音。

**自動送り** がオンなら、各音のあとカーソルが次のステップへ進みます（実機と同じく、モディファイアは鍵盤の *前に* 押します）。オフなら **TAP** で進みます。上のピアノロールにはライン全体が表示され、アクセントはマゼンタ、スライドはシアン、タイはイエロー。

### 2 · 音を作る
オリジナルと同じ 7 つのノブ：**TUNE、CUTOFF、RESONANCE、ENV MOD、DECAY、ACCENT、VOLUME**。さらに波形 **SAW / SQR** とテンポ（60〜200 BPM）。ノブは上下にドラッグ（Shift で微調整）、ダブルクリックで初期値。**▶ PLAY** でパターンをループ再生。

### 3 · 音階
**主音** と norns リストの **音階** を選びます（norns スクリプトの `MusicUtil` と同じ名前：旋法、ペンタトニック、ビバップ、ブルース、世界の音階…）。鍵盤に音階の音が表示され、**音階に合わせる** でライン全体を音階内に移します。

### 4 · 実機に打ち込む
エディターの下の **ロードシート** が 303 の方法を説明します：まず全部の音を順番に入力（**Pitch mode**）、次に各ステップの動作を指定（**Time mode**：DOWN = 音、UP = タイ、ACCENT = 休符）。NOTE ステップはリストの次の音を使い、タイと休符は音を消費しません。

**ボタンごとの手順** はこれをチェックリストにします：モードスイッチを PATTERN WRITE、PITCH MODE で各音を鍵盤・モディファイア・TAP で入力、TIME MODE でステップを入力、PATTERN PLAY に戻して RUN/STOP。実機で押すたびに画面のボタンをタップして消していきます。

### 5 · ライブラリ、保存、書き出し
- **303 の 100 ライン**：10 のシーンのスタイルで作ったオリジナルのライン（曲の採譜ではありません）。浜松 1981 からシカゴのアシッドハウス、デトロイト、フランクフルト、ベルリン、ロンドン、ゴア、ロッテルダムまで、それぞれテンポ・波形・ノブ付き。番号をタップして読み込みます。
- **マイパターン**：名前を付けて保存。このブラウザに保存されます。
- **書き出し**：ロードシートを **PNG** 画像（スマホ画面や印刷向け）、ラインを **.mid** ファイルで。スマホからそのまま **共有** も可能。

## キーボードショートカット

`A W S E D F T G Y H U J K` 音 · `Z` / `X` DOWN / UP · `1` アクセント · `2` スライド · `N` 音 · `L` タイ · `R` 休符 · `Enter` TAP · `←` `→` ステップ · `スペース` 再生。

## 中身

ビルド不要の HTML/CSS/JS。音とシーケンサーは **AudioWorklet**（`js/worklet.js`）の中で一緒に動きます：ノコギリ波／矩形波のオシレーターが専用エンベロープ付きのレゾナンスフィルターに入り、アクセントとスライドはオリジナルのようにふるまいます。`js/scales.js` に norns の音階、`js/library.js` は固定シードから 100 ラインを生成、`js/export.js` は PNG シートを描き MIDI を書き出します。テキストは `lang/*.js`（スペイン語が基準）。

## ローカルで動かす

```
python3 -m http.server 8790
```

http://localhost:8790 を開きます

<!-- u-ma:more -->
**U-MA のほかの作品：** すべての楽器とツールをひとつに → [U-MA ショーケース](https://github.com/buenosairesfront/U-ma/blob/main/README.ja.md)
<!-- /u-ma:more -->

## クレジット

Roland TB-303 にインスパイアされていますが、Roland とは無関係です。打ち込み方法はオリジナルの TB-303 に準じます。TD-3 や x0xb0x などのクローンでは一部のボタン名や位置が異なります。アプリ：U-MA サウンド · [Buenos Aires Front](https://www.instagram.com/buenos.aires.front/)。
