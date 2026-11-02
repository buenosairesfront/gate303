[English](README.md) · **Español** · [Français](README.fr.md) · [Deutsch](README.de.md) · [日本語](README.ja.md) · [中文](README.zh.md) · [हिन्दी](README.hi.md)

# gate303 · 303 Trainer

Escribí una línea de bajo de TB-303 paso a paso, escuchala con sonido de 303 y llevate la **hoja botón a botón** para cargarla en una TB-303 real (o un clon). Programar una 303 es famoso por lo confuso; esta app te hace la traducción.

**▶ Abrir la app:** https://buenosairesfront.github.io/gate303/

Interfaz en 6 idiomas: [`?lang=es`](https://buenosairesfront.github.io/gate303/?lang=es) · [`en`](https://buenosairesfront.github.io/gate303/?lang=en) · [`de`](https://buenosairesfront.github.io/gate303/?lang=de) · [`ja`](https://buenosairesfront.github.io/gate303/?lang=ja) · [`zh`](https://buenosairesfront.github.io/gate303/?lang=zh) · [`hi`](https://buenosairesfront.github.io/gate303/?lang=hi).

## Cómo funciona

### 1 · Escribí la línea
El patrón es una grilla de 1 a 16 pasos. Elegís un paso y decidís qué es:

- **NOTA**: suena una nota. El **teclado** de una octava le da la altura; **DOWN / UP** la bajan o suben una octava, **ACC** le pone acento y **SLIDE** la desliza hacia la nota siguiente.
- **LIGADO**: estira la nota anterior.
- **SILENCIO**: no suena nada.

Con **Avance auto** prendido el cursor pasa solo al paso siguiente después de cada nota (los modificadores se arman *antes* de la tecla, como en la máquina); si no, **TAP** avanza. El piano roll de arriba muestra la línea entera, con el acento en magenta, el slide en cian y los ligados en amarillo.

### 2 · Dale forma al sonido
Siete perillas como la original: **TUNE, CUTOFF, RESONANCE, ENV MOD, DECAY, ACCENT, VOLUME**, más la onda **SAW / SQR** y el tempo (60–200 BPM). Arrastrá una perilla hacia arriba o abajo (Shift = fino); doble clic la vuelve al valor inicial. **▶ PLAY** repite el patrón en loop.

### 3 · Escalas
Elegí una **tónica** y una **escala** de la lista de norns (los mismos nombres que `MusicUtil` en los scripts de norns: modos, pentatónicas, bebop, blues, escalas del mundo…). El teclado marca las notas de la escala y **Adaptar a escala** lleva toda la línea adentro.

### 4 · Cargala en la máquina real
Debajo del editor, la **hoja de carga** explica el método de la 303: primero cargás todas las notas en orden (**Pitch mode**) y después le decís a cada paso qué hace (**Time mode**: DOWN = nota, UP = ligado, ACCENT = silencio). Cada paso NOTA usa la siguiente nota de la lista; ligados y silencios no gastan notas.

**Carga botón a botón** lo convierte en una lista para tachar: selector en PATTERN WRITE, PITCH MODE y cada nota con su tecla, modificadores y TAP, TIME MODE y los pasos, y de vuelta a PATTERN PLAY y RUN/STOP. Tocá cada botón en la pantalla a medida que lo apretás en la máquina para ir tachándolo.

### 5 · Biblioteca, guardar y exportar
- **100 líneas de 303**: líneas originales (no transcripciones de temas) al estilo de 10 escenas, de Hamamatsu 1981 al acid house de Chicago, Detroit, Fráncfort, Berlín, Londres, Goa y Róterdam, cada una con su tempo, onda y perillas. Tocá un número para cargarla.
- **Mis patterns**: guardalos con nombre; quedan en este navegador.
- **Exportar**: la hoja de carga como imagen **PNG** (lista para la pantalla del celu o para imprimir), la línea como archivo **.mid**, o **Compartir** directo desde el teléfono.

## Atajos de teclado

`A W S E D F T G Y H U J K` notas · `Z` / `X` DOWN / UP · `1` accent · `2` slide · `N` nota · `L` ligado · `R` silencio · `Enter` TAP · `←` `→` paso · `espacio` play.

## Por dentro

HTML/CSS/JS sin build. El sonido y el secuenciador corren juntos dentro de un **AudioWorklet** (`js/worklet.js`): un oscilador diente de sierra/cuadrada que entra a un filtro resonante con su propia envolvente, con accent y slide que se comportan como en la original. `js/scales.js` tiene las escalas de norns, `js/library.js` genera las 100 líneas con una semilla fija, `js/export.js` dibuja la hoja PNG y escribe el MIDI. Los textos están en `lang/*.js` (el castellano es la base).

## Correr en local

```
python3 -m http.server 8790
```

y abrí http://localhost:8790

<!-- u-ma:more -->
**Más de U-MA:** todos los instrumentos y herramientas en un solo lugar → [muestrario U-MA](https://github.com/buenosairesfront/U-ma/blob/main/README.es.md)
<!-- /u-ma:more -->

## Créditos

Inspirado en la Roland TB-303, sin afiliación con Roland. El método de carga es el de la TB-303 original; en clones como la TD-3 o la x0xb0x algunos botones cambian de nombre o de lugar. App de U-MA サウンド · [Buenos Aires Front](https://www.instagram.com/buenos.aires.front/).
