[English](README.md) · [Español](README.es.md) · **Français** · [Deutsch](README.de.md) · [日本語](README.ja.md) · [中文](README.zh.md) · [हिन्दी](README.hi.md)

# Gate-03

Écrivez une ligne de basse de TB-303 pas à pas, écoutez-la avec un son de 303 et obtenez la **fiche bouton par bouton** pour la programmer dans une vraie TB-303 (ou un clone). Programmer une 303 est réputé déroutant ; cette application fait la traduction pour vous.

**▶ Ouvrir l'application :** https://buenosairesfront.github.io/gate303/

Interface en 6 langues : [`?lang=es`](https://buenosairesfront.github.io/gate303/?lang=es) · [`en`](https://buenosairesfront.github.io/gate303/?lang=en) · [`de`](https://buenosairesfront.github.io/gate303/?lang=de) · [`ja`](https://buenosairesfront.github.io/gate303/?lang=ja) · [`zh`](https://buenosairesfront.github.io/gate303/?lang=zh) · [`hi`](https://buenosairesfront.github.io/gate303/?lang=hi).

## Comment ça marche

### 1 · Écrire la ligne
Le pattern est une grille de 1 à 16 pas. Sélectionnez un pas et décidez ce qu'il est :

- **NOTE** : joue une note. Le **clavier** d'une octave règle la hauteur ; **DOWN / UP** la déplacent d'une octave, **ACC** ajoute l'accent et **SLIDE** glisse vers la note suivante.
- **TIE** (liaison) : prolonge la note précédente.
- **REST** (silence) : rien ne sonne.

Avec **Avance auto**, le curseur passe seul au pas suivant après chaque note (les modificateurs s'arment *avant* la touche, comme sur la machine) ; sinon **TAP** avance. Le piano roll au-dessus montre toute la ligne : accent en magenta, slide en cyan, liaisons en jaune.

### 2 · Sculpter le son
Sept potentiomètres comme l'original : **TUNE, CUTOFF, RESONANCE, ENV MOD, DECAY, ACCENT, VOLUME**, plus la forme d'onde **SAW / SQR** et le tempo (60–200 BPM). Glissez un potentiomètre vers le haut ou le bas (Maj = fin), double-clic pour réinitialiser. **▶ PLAY** joue le pattern en boucle.

### 3 · Gammes
Choisissez une **tonique** et une **gamme** de la liste norns (les mêmes noms que `MusicUtil` dans les scripts norns : modes, pentatoniques, bebop, blues, gammes du monde…). Le clavier marque les notes de la gamme et **Adapter à la gamme** y ramène toute la ligne.

### 4 · Programmer la vraie machine
Sous l'éditeur, la **fiche de chargement** explique la méthode de la 303 : d'abord on entre toutes les notes dans l'ordre (**Pitch mode**), puis on dit à chaque pas ce qu'il fait (**Time mode** : DOWN = note, UP = liaison, ACCENT = silence). Chaque pas NOTE utilise la note suivante de la liste ; liaisons et silences n'en consomment pas.

**Bouton par bouton** en fait une liste à cocher : sélecteur sur PATTERN WRITE, PITCH MODE et chaque note avec sa touche, ses modificateurs et TAP, TIME MODE et les pas, puis retour à PATTERN PLAY et RUN/STOP. Touchez chaque bouton à l'écran quand vous l'appuyez sur la machine pour le barrer.

### 5 · Bibliothèque, sauvegarde et export
- **100 lignes de 303** : lignes originales (pas des transcriptions de morceaux) dans le style de 10 scènes, de Hamamatsu 1981 à l'acid house de Chicago, Detroit, Francfort, Berlin, Londres, Goa et Rotterdam, chacune avec son tempo, sa forme d'onde et ses réglages. Touchez un numéro pour la charger.
- **Mes patterns** : enregistrez-les avec un nom ; ils restent dans ce navigateur.
- **Export** : la fiche de chargement en image **PNG** (prête pour l'écran du téléphone ou l'impression), la ligne en fichier **.mid**, ou **Partager** directement depuis le téléphone.

## Raccourcis clavier

`A W S E D F T G Y H U J K` notes · `Z` / `X` DOWN / UP · `1` accent · `2` slide · `N` note · `L` liaison · `R` silence · `Entrée` TAP · `←` `→` pas · `espace` lecture.

## Sous le capot

HTML/CSS/JS sans étape de build. Le son et le séquenceur tournent ensemble dans un **AudioWorklet** (`js/worklet.js`) : un oscillateur dent de scie/carré dans un filtre résonant avec sa propre enveloppe, avec accent et slide qui se comportent comme sur l'original. `js/scales.js` contient les gammes norns, `js/library.js` génère les 100 lignes à partir d'une graine fixe, `js/export.js` dessine la fiche PNG et écrit le fichier MIDI. Les textes sont dans `lang/*.js` (l'espagnol est la base).

## Lancer en local

```
python3 -m http.server 8790
```

puis ouvrez http://localhost:8790

<!-- u-ma:more -->
**Plus de U-MA :** tous les instruments et outils au même endroit → [vitrine U-MA](https://github.com/buenosairesfront/U-ma/blob/main/README.fr.md)
<!-- /u-ma:more -->

## Crédits

Inspiré de la Roland TB-303, sans affiliation avec Roland. La méthode de chargement suit la TB-303 originale ; sur des clones comme la TD-3 ou la x0xb0x, certains boutons changent de nom ou de place. Application par U-MA サウンド · [Buenos Aires Front](https://www.instagram.com/buenos.aires.front/).
