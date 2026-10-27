# Audit daltonisme & basse vision — AceTrack (s08-av1)

**Outil :** DevTools → Rendering → *Emulate vision deficiencies*.

## Éléments qui utilisent la couleur
| Élément | Couleur | Doublé par | 
|---|---|---|
| Résultat du match | vert `#15803d` / rouge `#b91c1c` | mot « Gagné » / « Perdu » + icône ✓ / ✗ |
| Statut du match | pastille colorée | texte « En cours » / « À venir » / « Terminé » + forme (● / ○ / ✓) |
| Favori | étoile orange | étoile pleine ou vide + texte « Suivi » / « Suivre » |
| Erreur de recherche | rouge | icône ⚠ + phrase explicite |
| Surface (terre, gazon, dur) | pastille | nom de la surface écrit |

## Résultats des émulations
| Profil | Gagné / Perdu distincts | Favori distinct | Remarque |
|---|---|---|---|
| Deutéranopie | ✅ | ✅ | vert et rouge deviennent proches, mais le mot et l'icône suffisent |
| Protanopie | ✅ | ✅ | le rouge paraît plus sombre ; le texte reste lisible |
| Tritanopie | ✅ | ✅ | l'orange vire au rose, l'étoile pleine se distingue toujours de la vide |
| Vision floue | ✅ | ✅ | texte à 16 px et boutons à 48 px encore lisibles |

## Correctifs appliqués
1. Écrire « Gagné » / « Perdu » à côté de chaque score, jamais seulement une pastille.
2. Différencier les statuts par une forme et un mot.
3. Vérifier les contrastes : vert 4,94:1 et rouge 6,38:1 sur `#fffdfb`.

**Commit :** `Ajoute l'atelier d'approfondissement s08-av1-emulation-daltonisme-vision.`
