# Audit d'accessibilité avancé (WCAG 2.2 AA) — e2-8

**Cas d'étude :** composant de réservation rejeté à l'audit d'agrément (portail des musées cantonaux, État de Vaud).
**Critères :** 1.4.3, 1.4.11, 1.4.1, 2.4.7 / 2.4.13, 2.5.8.

## Relevé des non-conformités

| # | Élément | Critère | Mesure | Verdict |
|---|---------|---------|--------|---------|
| 1 | Label `#94a3b8` sur `#f8fafc` | 1.4.3 (≥ 4,5:1) | **2,45:1** | ❌ |
| 2 | Bordure de l'input `#e2e8f0` sur `#ffffff` | 1.4.11 (≥ 3:1) | **1,23:1** | ❌ |
| 3 | `outline: none` | 2.4.7 / 2.4.13 | aucun focus visible | ❌ |
| 4 | Bouton `#6366f1` sur `#e0e7ff` | 1.4.3 (≥ 4,5:1) | **3,63:1** | ❌ |
| 5 | Taille du bouton « Valider » | 2.5.8 (≥ 24 × 24 px) | ≈ 56 × 22 px | ❌ |
| 6 | Erreur `#ef4444` sur `#f8fafc`, 12 px, rouge seul | 1.4.3 + 1.4.1 | **3,60:1** | ❌ |

### Réponses aux 4 questions
1. **Ratio du label :** 2,45:1. Non conforme, car le minimum est 4,5:1.
2. **`outline: none` :** il supprime le contour que le navigateur affiche quand on navigue avec Tab. Une personne qui utilise le clavier ne sait plus quel champ ou bouton est actif. C'est donc une barrière infranchissable.
3. **Zone cliquable du bouton :** 12 px de texte (≈ 14 px de ligne) + 2 × 4 px de padding ≈ 22 px de haut ; ≈ 40 px + 2 × 8 px ≈ 56 px de large. La hauteur est sous le minimum de 24 px et très loin des 48 px recommandés.
4. **Signal d'erreur :** il n'est pas intelligible pour une personne daltonienne. Le rouge devient presque un gris-brun, le mot « Erreur » n'explique rien, et il n'y a ni icône ni lien avec le champ.

## Refactorisation conforme

```html
<style>
  :root {
    --bg: #f8fafc;
    --text: #0f172a;          /* 17,06:1 */
    --label: #475569;         /* 7,24:1 */
    --field-bg: #ffffff;
    --field-border: #64748b;  /* 4,76:1 sur blanc */
    --focus: #4338ca;         /* 7,9:1 */
    --btn-bg: #4338ca;
    --btn-text: #ffffff;      /* 7,9:1 */
    --error: #b91c1c;         /* 6,18:1 sur --bg */
  }
  .form { background: var(--bg); padding: 20px; color: var(--text); }
  label { display: block; color: var(--label); font-size: 1rem; margin-bottom: 6px; }
  input {
    display: block; width: 100%; max-width: 360px; min-height: 48px;
    padding: 10px 12px; font-size: 1rem;
    background: var(--field-bg); border: 2px solid var(--field-border); border-radius: 6px;
  }
  input:focus-visible, button:focus-visible { outline: 3px solid var(--focus); outline-offset: 2px; }
  input[aria-invalid="true"] { border-color: var(--error); }
  .error { display: flex; gap: 6px; align-items: center; margin: 6px 0 14px;
           color: var(--error); font-size: .95rem; font-weight: 600; }
  button {
    min-width: 48px; min-height: 48px; padding: 10px 20px; font-size: 1rem;
    background: var(--btn-bg); color: var(--btn-text);
    border: 2px solid var(--btn-bg); border-radius: 6px; cursor: pointer;
  }
</style>

<form class="form" novalidate>
  <label for="email">Votre adresse courriel</label>
  <input id="email" type="email" autocomplete="email"
         aria-invalid="true" aria-describedby="email-error">
  <p id="email-error" class="error" role="alert">
    <span aria-hidden="true">⚠</span> Adresse courriel invalide : il manque le « @ ».
  </p>
  <button type="submit">Valider</button>
</form>
```

## Contre-épreuve
| Contrôle | Résultat |
|---|---|
| Contrastes à la pipette | ✅ labels ≥ 4,5:1, bordures ≥ 3:1 (valeurs ci-dessus) |
| Test clavier (Tab) | ✅ contour de 3 px visible sur le champ et sur le bouton |
| Lighthouse | à lancer dans les DevTools et à noter : ____ / 100 |

**Commit :** `Ajoute l'audit d'accessibilité avancé WCAG AA et la refactorisation du composant e2-8.`
