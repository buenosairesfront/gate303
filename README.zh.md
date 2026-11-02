[English](README.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [日本語](README.ja.md) · **中文** · [हिन्दी](README.hi.md)

# gate303 · 303 Trainer

一步一步写出 TB-303 贝斯线，用 303 风格的声音试听，并得到把它输入真正的 TB-303（或复刻机）的**逐键操作单**。303 的编程出了名地难懂；这个应用替你完成翻译。

**▶ 打开应用：** https://buenosairesfront.github.io/gate303/

界面支持 6 种语言：[`?lang=es`](https://buenosairesfront.github.io/gate303/?lang=es) · [`en`](https://buenosairesfront.github.io/gate303/?lang=en) · [`de`](https://buenosairesfront.github.io/gate303/?lang=de) · [`ja`](https://buenosairesfront.github.io/gate303/?lang=ja) · [`zh`](https://buenosairesfront.github.io/gate303/?lang=zh) · [`hi`](https://buenosairesfront.github.io/gate303/?lang=hi)。

## 使用方法

### 1 · 写旋律线
音型是 1 到 16 步的网格。选中一步，决定它是什么：

- **NOTE**：发一个音。一个八度的**键盘**决定音高；**DOWN / UP** 降低或升高一个八度，**ACC** 加重音，**SLIDE** 滑向下一个音。
- **TIE**（连音）：延长前一个音。
- **REST**（休止）：不发声。

打开**自动前进**时，每输入一个音光标就自动跳到下一步（修饰键要在琴键*之前*按，和机器上一样）；否则用 **TAP** 前进。上方的钢琴卷帘显示整条线：重音为洋红，滑音为青色，连音为黄色。

### 2 · 塑造声音
和原机一样的七个旋钮：**TUNE、CUTOFF、RESONANCE、ENV MOD、DECAY、ACCENT、VOLUME**，加上 **SAW / SQR** 波形和速度（60–200 BPM）。上下拖动旋钮（Shift = 微调），双击复位。**▶ PLAY** 循环播放音型。

### 3 · 音阶
从 norns 列表中选择**主音**和**音阶**（与 norns 脚本中 `MusicUtil` 的名称相同：调式、五声音阶、比波普、蓝调、世界音阶…）。键盘会标出音阶内的音，**贴合音阶**会把整条线移进音阶。

### 4 · 输入真机
编辑器下方的**输入单**说明 303 的方法：先按顺序输入所有音（**Pitch mode**），再告诉每一步做什么（**Time mode**：DOWN = 音符，UP = 连音，ACCENT = 休止）。每个 NOTE 步使用列表中的下一个音；连音和休止不占用音。

**逐键输入**把它变成可勾选的清单：模式开关拨到 PATTERN WRITE，按 PITCH MODE 并逐个输入音（琴键、修饰键和 TAP），按 TIME MODE 输入各步，然后回到 PATTERN PLAY 并按 RUN/STOP。每在机器上按一个键，就在屏幕上点一下把它划掉。

### 5 · 曲库、保存与导出
- **303 的 100 条线**：按 10 个场景风格创作的原创旋律线（不是歌曲扒谱），从 1981 年的滨松到芝加哥 acid house、底特律、法兰克福、柏林、伦敦、果阿和鹿特丹，每条都带速度、波形和旋钮设置。点编号即可载入。
- **我的音型**：起名保存，存于本浏览器。
- **导出**：输入单导出为 **PNG** 图片（适合手机屏幕或打印），旋律线导出为 **.mid** 文件，也可以在手机上直接**分享**。

## 键盘快捷键

`A W S E D F T G Y H U J K` 音 · `Z` / `X` DOWN / UP · `1` 重音 · `2` 滑音 · `N` 音符 · `L` 连音 · `R` 休止 · `Enter` TAP · `←` `→` 步 · `空格` 播放。

## 内部原理

无需构建的 HTML/CSS/JS。声音和音序器一起运行在 **AudioWorklet**（`js/worklet.js`）里：锯齿波/方波振荡器送入带独立包络的谐振滤波器，重音和滑音的表现与原机相同。`js/scales.js` 是 norns 音阶，`js/library.js` 用固定种子生成 100 条线，`js/export.js` 绘制 PNG 输入单并写出 MIDI 文件。文本在 `lang/*.js`（以西班牙语为基准）。

## 本地运行

```
python3 -m http.server 8790
```

然后打开 http://localhost:8790

<!-- u-ma:more -->
**更多 U-MA 作品：** 所有乐器和工具汇集一处 → [U-MA 作品集](https://github.com/buenosairesfront/U-ma/blob/main/README.zh.md)
<!-- /u-ma:more -->

## 致谢

灵感来自 Roland TB-303，与 Roland 无关联。输入方法依照原版 TB-303；在 TD-3 或 x0xb0x 等复刻机上，部分按键名称或位置不同。应用：U-MA サウンド · [Buenos Aires Front](https://www.instagram.com/buenos.aires.front/)。
