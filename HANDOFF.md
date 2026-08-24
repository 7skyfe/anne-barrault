# Handoff — Site Galerie Anne Barrault → Portfolio & Dossiers

Ce document résume tout ce qui a changé sur le site codé (`E:\Anne Barrault`, repo GitHub
`7skyfe/anne-barrault`, live sur https://7skyfe.github.io/anne-barrault/) depuis la reprise
du travail il y a environ 3 heures. Objectif : que la session Claude qui s'occupe du
`portfolio.html` et des 3 dossiers écrits (10 pages chacun) sache exactement quoi mettre à
jour pour rester cohérente avec l'état actuel du site.

## 1. Contexte rapide

- Site statique HTML/CSS/JS, 8 pages : `index.html`, `projections.html`, `expositions.html`,
  `expo-when-i-think.html`, `expo-lorsque-la-beaute.html`, `expo-viallat.html`,
  `artistes.html`, `a-propos.html`.
- Un seul fichier de style : `css/style.css`. Thème clair/sombre via `data-theme`, effet
  "liquid glass" activable/désactivable via `data-glass`.
- Hébergé sur GitHub Pages, mis à jour à chaque commit poussé sur `main`.
- `portfolio.html` + `pf-base.css` + `pf-fonts.css` + `assets/pf/*` documentent CE projet
  et vivent dans le même repo (accessibles sur `/portfolio.html`).

## 2. Changelog détaillé (dans l'ordre)

### a. Intégration du correctif mobile (package reçu de l'autre session Claude)
Un zip complet (`sitecorrige.zip` + `mobilepatch.css`) a remplacé l'intégralité du code
après une passe de vérification sur téléphone réel (iPhone). Corrections incluses :
- **Bug hero landing mobile** : l'image d'accueil ne remplissait qu'environ 120-140px de
  hauteur au lieu de toute la zone (bug `width:100%` sans `height:100%` sur un élément
  `position:absolute`), causant un gros vide blanc et un chevauchement des textes en
  dessous. Corrigé (`object-fit:cover` + `height:100%`).
- **Menu mobile** : les éléments du menu plein écran étaient trop bas, remontés en haut de
  l'écran.
- **Artistes mobile** : passage à un layout "1 étoile puis le nom, retour à la ligne, 1
  étoile puis le nom..." en colonne unique sur petit écran, plus lisible qu'avant.
- **Accessibilité ajoutée** : lien d'évitement (skip-link), contours `:focus-visible`,
  respect de `prefers-reduced-motion`, `aria-current="page"` calculé en JS sur le lien de
  nav actif, `nav-inline` (nav horizontale visible seulement en desktop ≥1200px), titre/
  `aria-label` sur le bouton de bascule glass.

### b. Nettoyage du menu
Suppression du texte gris "site marchand externe" sous le lien Boutique du menu plein écran,
sur les 8 pages.

### c. Landing page — 3e œuvre (Claude Viallat)
La 3e section "feature" (œuvre de Claude Viallat / expo "L'Empreinte et la Couleur") est
maintenant orientée comme la 1ère section (image à gauche, texte à droite), au lieu d'être
inversée. Ordre bio/nom de l'artiste harmonisé, lien "→ en savoir plus" avec flèche en
premier.

### d. Page Artistes — mur de noms
- Les 13 noms d'artistes fictifs (test) ne sont plus grisés/estompés — ils s'affichent avec
  la même intensité que les 3 vrais artistes, même s'ils ne sont pas cliquables.
- Layout repensé en grille 2 colonnes, avec une **étoile devant chaque nom** (à gauche),
  cohérent en desktop et mobile — c'était cassé (étoile après le nom) en desktop, corrigé et
  revérifié aux deux gabarits.

### e. Page Expositions — bug de filtrage (corrigé aujourd'hui)
Le système de séparateurs visuels entre les cartes (une bordure tous les 3 éléments, basée
sur `:nth-child`) cassait dès qu'un filtre masquait certaines cartes : les séparateurs se
retrouvaient au mauvais endroit et la grille semblait décalée. Remplacé par un simple `gap`
d'espacement — la grille reste propre quel que soit le nombre de résultats filtrés. Vérifié
sans chevauchement, quel que soit le filtre actif.

### f. Page Projections — contenu réel (corrigé aujourd'hui)
Toute la page utilisait un contenu placeholder identique répété (même image de lac,
mêmes dates génériques "30 Septembre 2026" / "13 mai 2026"). Remplacé par de vraies données
recherchées sur le site officiel de la galerie (https://galerieannebarrault.com/cinema/) :
- **Prochaine projection** : "Carte blanche à Marie Losier & Sing Sing", mardi 29 septembre
  2026, 20h, L'Archipel Cinéma (Paris) — 5 films réels du programme affichés individuellement
  (*A Divided World* d'Arne Sucksdorff 1948, *A Matter of Baobab* de Pola Chapelle 1970,
  *Nightcall* de Jacques Tourneur 1963, *Dixieland Droopy* de Tex Avery 1954, *Day is Done*
  de Mike Kelley 2005).
- **Projections déjà passées** (carrousel) : 5 vrais événements passés avec leurs vraies
  dates et titres (Guillaume Pinard 31/03/2026, Ibrahim Meïté Sikely 23/09/2025, "Le trésor
  des poubelles" 16/04/2025, Liv Schulman 27/11/2024, Marie Losier 04/07/2023).
- **Limitation assumée** : les visuels restent des placeholders génériques (photo de
  paysage), aucune image de film n'a été utilisée car aucune image libre de droits
  appropriée n'était disponible pour ces œuvres — seul le texte/la donnée est réelle. À
  mentionner explicitement comme choix éditorial assumé dans les dossiers, pas à cacher.

### g. Vérification mobile des 3 correctifs du jour (pas de régression)
Les trois correctifs ci-dessus (e, f, et l'étoile de d) ont été retestés explicitement à
375px (mobile), 768px (tablette) et en desktop, en plus du test initial :
- **Expositions / filtrage** : à 375px, filtre "peinture" → 6 cartes en 1 colonne, largeur
  et alignement uniformes, aucun chevauchement. À 768px, filtre "sculpture" → 3 cartes,
  aucun chevauchement.
- **Projections / contenu réel** : à 375px, tout le texte réel (films, dates, lieux) s'affiche
  sans coupure ni chevauchement entre les 5 cartes ni dans le carrousel.
- **Artistes / étoiles** : à 375px, l'étoile reste bien devant le nom ET le style "liste à
  bordure basse" du bloc mobile étroit (`@media max-width:700px`, hérité du patch précédent)
  est toujours actif et intact. À 768px, colonne unique, étoile devant le nom, aucun
  chevauchement.
- **Conclusion** : aucune régression sur les correctifs mobile précédents (hero, menu,
  accessibilité, layout "1 étoile + nom" en liste étroite) — seules les 3 zones concernées
  par les nouveaux bugs ont été touchées.

## 3. Pour le `portfolio.html` (captures d'écran à refaire)

Les visuels suivants ont changé depuis les dernières captures dans `assets/pf/` : la landing
page (3e œuvre réorientée), la page Artistes (mur de noms sans grisé, étoiles devant les
noms, layout 2 colonnes), la page Expositions (grille sans séparateurs, filtrage stable), et
la page Projections (contenu entièrement réécrit). Si `portfolio.html` illustre ces pages
avec des captures désynchronisées, il faut reprendre des screenshots à jour (desktop +
mobile) sur https://7skyfe.github.io/anne-barrault/ avant de finaliser le portfolio.

## 4. Pour les 3 dossiers écrits (10 pages chacun)

Points à intégrer dans le récit du processus de conception :
1. **Itération basée sur des retours utilisateur réels** : plusieurs bugs mobile n'ont été
   détectés qu'après des captures d'écran prises sur un vrai téléphone (pas seulement en
   DevTools) — bon exemple à citer pour un chapitre "tests utilisateurs / méthodologie".
2. **Accessibilité** : skip-link, focus visible, `prefers-reduced-motion`, nav accessible —
   à valoriser dans un chapitre accessibilité/UX si le dossier en a un.
3. **Recherche documentaire réelle pour le contenu** : la page Projections a été construite
   à partir de vraies données du site officiel de la galerie (galerieannebarrault.com), pas
   inventées — bon exemple de méthodologie de collecte de contenu pour un projet de maquette
   qui se veut crédible.
4. **Système graphique "étoile devant le nom"** : décision de langage graphique pour le mur
   de noms des artistes, cohérente desktop/mobile — à documenter comme un choix de design
   system si le dossier détaille les composants.
5. **Limite assumée sur les visuels de Projections** : à formuler clairement comme un choix
   (pas de visuel trouvé approprié/libre de droits pour illustrer des films précis), plutôt
   que de laisser croire que c'est un oubli.

## 5. Où vérifier

- Site live : https://7skyfe.github.io/anne-barrault/
- Portfolio live : https://7skyfe.github.io/anne-barrault/portfolio.html
- Dernier commit poussé : `c1b8ad6` — ajout de ce document de handoff, à la suite de
  `9de7e92` ("Remplace le contenu placeholder de Projections par les vraies donnees de
  galerieannebarrault.com/cinema") qui contient les correctifs eux-mêmes.
