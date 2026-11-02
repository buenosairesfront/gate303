# 303 Trainer

Para escribir y practicar líneas de TB-303 (universo U-MA). Elegís un paso y le das NOTA, LIGADO o SILENCIO. El teclado le pone la altura, DOWN/UP/ACC/SLIDE la modifican y TAP pasa al paso siguiente. Arriba están las perillas de sonido (TUNE, CUTOFF, RESONANCE, ENV MOD, DECAY, ACCENT, VOLUME), la onda y el tempo, y un piano roll. Abajo, la hoja de carga para la máquina real (Pitch mode y Time mode).

Incluye escalas de norns con opción de encadenar a escala, 100 líneas de ejemplo por escena, patterns guardados en el navegador, y exportación de la hoja de carga a PNG y de la línea a MIDI.

HTML/CSS/JS sin build. El sonido sale de un AudioWorklet (`js/worklet.js`) que también corre el secuenciador.
Idiomas en `lang/*.js` (es es la base), `?lang=es|en|de|ja|zh|hi`.

Probar en local: `python3 -m http.server 8790` en esta carpeta y abrir http://localhost:8790

Inspirado en la Roland TB-303; sin afiliación.
