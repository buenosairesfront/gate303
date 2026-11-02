**English** · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [日本語](README.ja.md) · [中文](README.zh.md) · [हिन्दी](README.hi.md)

# Gate-03

Write a TB-303 bass line step by step, hear it with a 303-style sound, and get the exact **button-by-button sheet** to program it into a real TB-303 (or a clone). Programming a 303 is famously confusing; this app does the translation for you.

**▶ Open the app:** https://buenosairesfront.github.io/gate303/

Interface in 6 languages: [`?lang=es`](https://buenosairesfront.github.io/gate303/?lang=es) · [`en`](https://buenosairesfront.github.io/gate303/?lang=en) · [`de`](https://buenosairesfront.github.io/gate303/?lang=de) · [`ja`](https://buenosairesfront.github.io/gate303/?lang=ja) · [`zh`](https://buenosairesfront.github.io/gate303/?lang=zh) · [`hi`](https://buenosairesfront.github.io/gate303/?lang=hi).

## How it works

### 1 · Write the line
The pattern is a grid of 1 to 16 steps. Select a step and decide what it is:

- **NOTE** – plays a note. The one-octave **keyboard** sets the pitch, and **DOWN / UP** move it an octave, **ACC** adds accent and **SLIDE** glides into the next note.
- **TIE** – stretches the previous note.
- **REST** – silence.

With **Auto advance** on, the cursor moves to the next step after each note (modifiers are armed *before* the key, just like on the machine); otherwise **TAP** moves on. The piano roll above shows the whole line, with accent in magenta, slide in cyan and ties in yellow.

### 2 · Shape the sound
Seven knobs like the original: **TUNE, CUTOFF, RESONANCE, ENV MOD, DECAY, ACCENT, VOLUME**, plus the **SAW / SQR** waveform and tempo (60–200 BPM). Drag a knob up or down (Shift = fine), double-click to reset. **▶ PLAY** loops the pattern.

### 3 · Scales
Choose a **root** and a **scale** from the norns list (the same names as `MusicUtil` in norns scripts: modes, pentatonics, bebop, blues, world scales…). The keyboard marks the notes of the scale, and **Snap to scale** moves the whole line into it.

### 4 · Program the real machine
Below the editor, the **loading sheet** explains the 303 method: first you enter all the notes in order (**Pitch mode**), then you tell each step what it does (**Time mode**: DOWN = note, UP = tie, ACCENT = rest). Every NOTE step uses the next note on the list; ties and rests don't use notes.

**Button by button** turns that into a checklist: set the mode switch to PATTERN WRITE, press PITCH MODE and enter each note with its key, modifiers and TAP, press TIME MODE and enter the steps, then back to PATTERN PLAY and RUN/STOP. Tap each button on screen as you press it on the machine to cross it off.

### 5 · Library, saving and export
- **100 lines of 303**: original lines (not transcriptions of songs) in the style of 10 scenes, from Hamamatsu 1981 to Chicago acid house, Detroit, Frankfurt, Berlin, London, Goa and Rotterdam, each with its tempo, waveform and knobs. Tap a number to load it.
- **My patterns**: save with a name; they are stored in this browser.
- **Export**: the loading sheet as a **PNG** image (ready for a phone screen or to print), the line as a **.mid** file, or **Share** it straight from the phone.

## Keyboard shortcuts

`A W S E D F T G Y H U J K` notes · `Z` / `X` DOWN / UP · `1` accent · `2` slide · `N` note · `L` tie · `R` rest · `Enter` TAP · `←` `→` step · `space` play.

## Under the hood

Plain HTML/CSS/JS with no build step. The sound and the sequencer run together inside an **AudioWorklet** (`js/worklet.js`): a sawtooth/square oscillator into a resonant filter with its own envelope, with accent and slide behaving like the original. `js/scales.js` has the norns scales, `js/library.js` generates the 100 lines from a fixed seed, `js/export.js` draws the PNG sheet and writes the MIDI file. Texts live in `lang/*.js` (Spanish is the base).

## Run locally

```
python3 -m http.server 8790
```

and open http://localhost:8790

<!-- u-ma:more -->
**More from U-MA:** every instrument and tool in one place → [U-MA showcase](https://github.com/buenosairesfront/U-ma)
<!-- /u-ma:more -->

## Credits

Inspired by the Roland TB-303; not affiliated with Roland. The loading method follows the original TB-303; on clones such as the TD-3 or the x0xb0x some buttons have different names or places. App by U-MA サウンド · [Buenos Aires Front](https://www.instagram.com/buenos.aires.front/).
