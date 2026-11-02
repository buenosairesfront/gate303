[English](README.md) · [Español](README.es.md) · [Français](README.fr.md) · **Deutsch** · [日本語](README.ja.md) · [中文](README.zh.md) · [हिन्दी](README.hi.md)

# gate303 · 303 Trainer

Schreib eine TB-303-Basslinie Schritt für Schritt, hör sie mit 303-Sound und hol dir die **Taste-für-Taste-Anleitung**, um sie in eine echte TB-303 (oder einen Klon) einzugeben. Eine 303 zu programmieren ist berüchtigt verwirrend; diese App übersetzt für dich.

**▶ App öffnen:** https://buenosairesfront.github.io/gate303/

Oberfläche in 6 Sprachen: [`?lang=es`](https://buenosairesfront.github.io/gate303/?lang=es) · [`en`](https://buenosairesfront.github.io/gate303/?lang=en) · [`de`](https://buenosairesfront.github.io/gate303/?lang=de) · [`ja`](https://buenosairesfront.github.io/gate303/?lang=ja) · [`zh`](https://buenosairesfront.github.io/gate303/?lang=zh) · [`hi`](https://buenosairesfront.github.io/gate303/?lang=hi).

## So funktioniert's

### 1 · Linie schreiben
Das Pattern ist ein Raster aus 1 bis 16 Schritten. Wähle einen Schritt und lege fest, was er ist:

- **NOTE**: spielt einen Ton. Die einoktavige **Tastatur** bestimmt die Tonhöhe; **DOWN / UP** verschieben ihn um eine Oktave, **ACC** setzt einen Akzent und **SLIDE** gleitet in den nächsten Ton.
- **TIE** (Bindung): verlängert den vorigen Ton.
- **REST** (Pause): Stille.

Mit **Auto-Vorlauf** springt der Cursor nach jedem Ton zum nächsten Schritt (Modifikatoren werden *vor* der Taste gesetzt, wie an der Maschine); sonst geht es mit **TAP** weiter. Die Piano-Roll oben zeigt die ganze Linie: Akzent in Magenta, Slide in Cyan, Bindungen in Gelb.

### 2 · Klang formen
Sieben Regler wie beim Original: **TUNE, CUTOFF, RESONANCE, ENV MOD, DECAY, ACCENT, VOLUME**, dazu die Wellenform **SAW / SQR** und das Tempo (60–200 BPM). Regler nach oben oder unten ziehen (Shift = fein), Doppelklick setzt zurück. **▶ PLAY** spielt das Pattern in Schleife.

### 3 · Tonleitern
Wähle **Grundton** und **Tonleiter** aus der norns-Liste (dieselben Namen wie `MusicUtil` in norns-Skripten: Modi, Pentatonik, Bebop, Blues, Skalen aus aller Welt…). Die Tastatur markiert die Töne der Tonleiter, und **An Tonleiter anpassen** verschiebt die ganze Linie hinein.

### 4 · Echte Maschine programmieren
Unter dem Editor erklärt das **Ladeblatt** die 303-Methode: Erst gibst du alle Töne der Reihe nach ein (**Pitch mode**), dann sagst du jedem Schritt, was er tut (**Time mode**: DOWN = Note, UP = Bindung, ACCENT = Pause). Jeder NOTE-Schritt nimmt den nächsten Ton der Liste; Bindungen und Pausen verbrauchen keine Töne.

**Taste für Taste** macht daraus eine Abhakliste: Wahlschalter auf PATTERN WRITE, PITCH MODE und jeden Ton mit Taste, Modifikatoren und TAP, TIME MODE und die Schritte, dann zurück auf PATTERN PLAY und RUN/STOP. Tippe jede Taste auf dem Bildschirm an, während du sie an der Maschine drückst, um sie abzuhaken.

### 5 · Bibliothek, Speichern und Export
- **100 Linien für die 303**: eigene Linien (keine Transkriptionen von Songs) im Stil von 10 Szenen, von Hamamatsu 1981 über Chicago Acid House, Detroit, Frankfurt, Berlin, London, Goa bis Rotterdam, jede mit Tempo, Wellenform und Reglern. Tippe auf eine Nummer, um sie zu laden.
- **Meine Patterns**: mit Namen speichern; sie bleiben in diesem Browser.
- **Export**: das Ladeblatt als **PNG**-Bild (passend fürs Handy oder zum Drucken), die Linie als **.mid**-Datei, oder **Teilen** direkt vom Telefon.

## Tastenkürzel

`A W S E D F T G Y H U J K` Töne · `Z` / `X` DOWN / UP · `1` Akzent · `2` Slide · `N` Note · `L` Bindung · `R` Pause · `Enter` TAP · `←` `→` Schritt · `Leertaste` Play.

## Unter der Haube

HTML/CSS/JS ohne Build-Schritt. Klang und Sequencer laufen zusammen in einem **AudioWorklet** (`js/worklet.js`): ein Sägezahn-/Rechteck-Oszillator in ein Resonanzfilter mit eigener Hüllkurve, Akzent und Slide verhalten sich wie beim Original. `js/scales.js` enthält die norns-Tonleitern, `js/library.js` erzeugt die 100 Linien aus einem festen Seed, `js/export.js` zeichnet das PNG-Blatt und schreibt die MIDI-Datei. Die Texte liegen in `lang/*.js` (Spanisch ist die Basis).

## Lokal starten

```
python3 -m http.server 8790
```

und http://localhost:8790 öffnen

<!-- u-ma:more -->
**Mehr von U-MA:** alle Instrumente und Werkzeuge an einem Ort → [U-MA-Übersicht](https://github.com/buenosairesfront/U-ma/blob/main/README.de.md)
<!-- /u-ma:more -->

## Credits

Inspiriert von der Roland TB-303, nicht mit Roland verbunden. Die Eingabemethode folgt der originalen TB-303; bei Klonen wie TD-3 oder x0xb0x heißen manche Tasten anders oder sitzen woanders. App von U-MA サウンド · [Buenos Aires Front](https://www.instagram.com/buenos.aires.front/).
