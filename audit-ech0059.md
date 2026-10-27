# Auto-audit eCH-0059 (WCAG 2.1 AA) — AceTrack

| Critère | Intitulé | État | Constat | Correctif appliqué |
|---|---|---|---|---|
| 1.1.1 | Contenus non textuels | **Conforme** | Photos de joueurs avec `alt="Photo de Belinda Bencic"` ; icônes décoratives en `aria-hidden="true"` ; étoile favori avec `aria-label="Suivre Belinda Bencic"` | `alt` générés depuis le nom du joueur |
| 1.4.3 | Contraste minimal 4,5:1 | **Conforme** | Texte `#1a1a1a` sur `#fffdfb` : 17,15:1 ; gris secondaire `#6b7280` : 4,76:1 ; bouton blanc sur `#C2410C` : 5,18:1 | Gris clair `#9ca3af` (2,5:1) remplacé par `#6b7280` |
| 2.1.1 | Clavier intégral | **Conforme** | Tab parcourt recherche → résultats → profil → « Suivre » → onglets ; Entrée et Espace activent les boutons | `<div onclick>` remplacés par `<button>` et `<a>` |
| 2.4.7 | Visibilité du focus | **Conforme** | `:focus-visible { outline: 3px solid #141210; outline-offset: 2px }` (18,4:1) | Aucun `outline: none` dans le CSS |
| 3.3.1 | Identification des erreurs | **Conforme** | Recherche sans résultat : icône ⚠ + « Aucun joueur ou joueuse trouvé·e pour “…” » en `role="status"` | Texte explicite + bouton « Voir tous les joueurs » |

**Non applicable :** aucun critère dans cette grille.
**Rappel :** « Conforme » est l'état prévu par le design. À reconfirmer sur l'app codée.

**Commit :** `Ajoute l'atelier d'approfondissement s08-av2-grilleech-0059-wcag.`
