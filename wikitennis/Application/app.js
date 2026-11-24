// Tennispedia — accueil, favoris, profil et match : tout vient de data.json
const SVG_NS = "http://www.w3.org/2000/svg";
const page = document.body.dataset.page;
const params = new URLSearchParams(location.search);

const conteneur = document.getElementById("liste");
const contenu = document.getElementById("contenu");
const zoneAucun = document.getElementById("aucun");
const champRecherche = document.getElementById("recherche");
const navOnglets = document.getElementById("onglets");
let zoneEtat = document.getElementById("etat");
if (!zoneEtat) {
  zoneEtat = document.createElement("p");
  zoneEtat.id = "etat";
  zoneEtat.setAttribute("role", "status");
  (conteneur || contenu || document.body).before(zoneEtat);
}

const CHEMIN_COEUR =
  "M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2z";

let tousLesJoueurs = [];
let donneesChargees = false;
const favoris = new Set(lireFavoris());

/* ---------- Utilitaires ---------- */

function lireFavoris() {
  try {
    return JSON.parse(localStorage.getItem("favoris")) || [];
  } catch (e) {
    return [];
  }
}

function sauverFavoris() {
  try {
    localStorage.setItem("favoris", JSON.stringify([...favoris]));
  } catch (e) {
    // stockage indisponible : les favoris restent valables pour cette visite
  }
}

function basculerFavori(id) {
  if (favoris.has(id)) favoris.delete(id);
  else favoris.add(id);
  sauverFavoris();
}

function normaliser(texte) {
  return texte.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function el(tag, classe, texte) {
  const e = document.createElement(tag);
  if (classe) e.className = classe;
  if (texte !== undefined) e.textContent = texte;
  return e;
}

function creerIcone(chemins) {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("class", "icone");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  for (const d of chemins) {
    const p = document.createElementNS(SVG_NS, "path");
    p.setAttribute("d", d);
    svg.appendChild(p);
  }
  return svg;
}

function afficherErreur(message) {
  zoneEtat.textContent = message;
  const cible = conteneur || contenu;
  if (cible) cible.replaceChildren();
}

function afficherSqueletes(nombre) {
  const cible = conteneur || contenu;
  if (!cible) return;
  const blocs = [];
  for (let i = 0; i < nombre; i++) {
    const bloc = el(conteneur ? "li" : "div", "squelette");
    bloc.setAttribute("aria-hidden", "true");
    blocs.push(bloc);
  }
  cible.replaceChildren(...blocs);
}

/* ---------- Onglets ---------- */

function creerOnglet(libelle, href, actif, chemins) {
  const a = document.createElement("a");
  a.href = href;
  if (actif) a.setAttribute("aria-current", "page");
  a.append(creerIcone(chemins), el("span", "", libelle));
  return a;
}

function afficherOnglets() {
  navOnglets.replaceChildren(
    creerOnglet("Accueil", "index.html", page === "accueil", ["M3 11l9-8 9 8", "M5 10v10h14V10"]),
    creerOnglet("Favoris", "favori.html", page === "favoris", [CHEMIN_COEUR])
  );
}

/* ---------- Liste (accueil et favoris) ---------- */

function creerCarte(joueur, position) {
  const ligne = el("li", "ligne");
  ligne.append(el("span", "rang", position));

  // une proposition n'est pas dans data.json : pas de page de profil à ouvrir
  const lien = el(joueur.propose ? "div" : "a", "lien");
  if (!joueur.propose) lien.href = "joueur.html?id=" + encodeURIComponent(joueur.id);
  const avatar = el("span", "avatar avatar--" + joueur.teinte, joueur.initiales);
  const bloc = el("div", "grow");
  bloc.append(el("h3", "", joueur.nom), el("p", "commune", joueur.pays));
  lien.append(avatar, bloc);

  const favori = el("button", "favori");
  favori.type = "button";
  favori.setAttribute("aria-pressed", favoris.has(joueur.id) ? "true" : "false");
  favori.setAttribute("aria-label", "Ajouter " + joueur.nom + " aux favoris");
  favori.appendChild(creerIcone([CHEMIN_COEUR]));
  favori.addEventListener("click", () => {
    basculerFavori(joueur.id);
    favori.setAttribute("aria-pressed", favoris.has(joueur.id) ? "true" : "false");
    if (page === "favoris") afficherListe();
  });

  ligne.append(lien, favori);
  return ligne;
}

function afficherListe() {
  const terme = champRecherche ? normaliser(champRecherche.value.trim()) : "";
  const seulementFavoris = page === "favoris";
  const visibles = tousLesJoueurs.filter((j) => {
    const correspond = normaliser(j.nom + " " + j.pays).includes(terme);
    return correspond && (!seulementFavoris || favoris.has(j.id));
  });

  conteneur.replaceChildren(...visibles.map((j) => creerCarte(j, tousLesJoueurs.indexOf(j) + 1)));
  zoneAucun.hidden = visibles.length > 0;
  if (page === "accueil") {
    zoneAucun.textContent = "Aucun joueur ne correspond à votre recherche.";
  }
  zoneEtat.textContent = visibles.length + (visibles.length > 1 ? " joueurs" : " joueur");
}

/* ---------- Profil ---------- */

function creerStat(chemins, valeur, libelle, enHtml) {
  const stat = el("div", "stat");
  const icone = el("div", "stat-icone");
  icone.appendChild(creerIcone(chemins));
  const val = el("div", "stat-valeur" + (enHtml ? " stat-valeur--texte" : ""));
  const fort = document.createElement("strong");
  // meilleurRang contient <sup> : texte de notre propre data.json
  if (enHtml) fort.innerHTML = valeur;
  else fort.textContent = valeur;
  val.append(fort, el("small", "", libelle));
  stat.append(icone, val);
  return stat;
}

function afficherProfil(joueur) {
  document.title = "Tennispedia · " + joueur.nom;

  const identite = el("div", "identite");
  identite.append(el("span", "avatar avatar--grand avatar--" + joueur.teinte, joueur.initiales));
  const titre = el("div", "grow");
  titre.append(
    el("h1", "", joueur.nom),
    el("p", "commune", joueur.pays + " · " + joueur.age + " ans · " + joueur.main)
  );
  identite.append(titre);

  const zoneCta = el("div", "zone-cta");
  const cta = el("button", "cta");
  cta.type = "button";
  cta.append(creerIcone([CHEMIN_COEUR]));
  const texteCta = el("span");
  cta.append(texteCta);
  const majCta = () => {
    const actif = favoris.has(joueur.id);
    cta.classList.toggle("cta--actif", actif);
    cta.setAttribute("aria-pressed", actif ? "true" : "false");
    texteCta.textContent = actif ? "Dans mes favoris" : "Ajouter aux favoris";
  };
  cta.addEventListener("click", () => {
    basculerFavori(joueur.id);
    majCta();
  });
  majCta();
  zoneCta.append(cta);

  const sections = [identite];

  if (joueur.rang > 0) {
    const hero = el("div", "hero");
    hero.append(
      el("p", "hero-etiquette", joueur.feminin ? "Classement WTA" : "Classement ATP"),
      el("p", "hero-score", "N° " + joueur.rang),
      el("p", "hero-titre", joueur.nom)
    );
    sections.push(hero);
  }

  sections.push(zoneCta);

  sections.push(el("h2", "etiquette", "À propos"), el("p", "bref", joueur.resume));

  const c = joueur.carriere;
  const carriere = el("div", "carriere");
  carriere.append(
    creerStat(["M8 21h8", "M12 17v4", "M7 4h10v5a5 5 0 0 1-10 0z"], String(c.titres), "Titres"),
    creerStat(["M5 21V4", "M5 4h13l-3 4 3 4H5"], String(c.finales), "Finales"),
    creerStat(["M3 17l6-6 4 4 8-8"], c.meilleurRang, "Meilleur rang", true)
  );
  sections.push(el("h2", "etiquette", "Carrière"), carriere);

  sections.push(el("h2", "etiquette", "Palmarès"));
  if (joueur.trophees.length === 0) {
    sections.push(el("p", "vide", "Pas encore de grand titre."));
  } else {
    const liste = el("ul", "trophees");
    for (const t of joueur.trophees) {
      const li = el("li");
      li.appendChild(creerIcone(["M8 21h8", "M12 17v4", "M7 4h10v5a5 5 0 0 1-10 0z"]));
      const bloc = el("div", "grow");
      bloc.append(el("strong", "", t.titre), el("span", "", t.detail));
      li.append(bloc);
      if (t.nombre > 1) li.append(el("span", "badge", "× " + t.nombre));
      liste.append(li);
    }
    sections.push(liste);
  }

  sections.push(el("h2", "etiquette", "Derniers matchs"));
  if (joueur.derniersMatchs.length === 0) {
    sections.push(el("p", "vide", "Aucun match récent."));
  } else {
    const matchs = el("div");
    joueur.derniersMatchs.forEach((m, i) => {
      const ligne = el("a", "match-ligne");
      ligne.href =
        "match.html?joueur=" + encodeURIComponent(joueur.id) + "&m=" + i;
      ligne.append(el("span", "resultat " + (m.victoire ? "resultat--v" : "resultat--d"), m.victoire ? "V" : "D"));
      const bloc = el("div", "grow");
      bloc.append(el("strong", "", "vs " + m.adversaire), el("span", "", m.infos));
      ligne.append(bloc, el("span", "match-score", m.score));
      matchs.append(ligne);
    });
    sections.push(matchs);
  }

  contenu.replaceChildren(...sections);
  zoneEtat.textContent = "";
}

/* ---------- Match ---------- */

function afficherMatch(joueur, match) {
  document.title = "Tennispedia · " + joueur.nom + " vs " + match.adversaire;
  const retour = document.getElementById("retour");
  if (retour) retour.href = "joueur.html?id=" + encodeURIComponent(joueur.id);

  const hero = el("div", "hero");
  hero.append(
    el("p", "hero-etiquette", match.victoire ? "Victoire" : "Défaite"),
    el("p", "hero-score", match.score),
    el("p", "hero-titre", joueur.nom + " vs " + match.adversaire),
    el("p", "hero-detail", match.infos)
  );

  const sets = el("div", "sets");
  match.score.split(",").forEach((s, i) => {
    const set = el("div", "set");
    set.append(el("span", "", "Set " + (i + 1)), el("strong", "", s.trim()));
    sets.append(set);
  });

  const [tournoi, tour, date, surface] = match.infos.split(" · ");
  const lignes = [
    ["Tournoi", tournoi],
    ["Tour", tour],
    ["Date", date],
    ["Surface", surface],
  ].filter(([, v]) => v);
  const details = el("dl");
  for (const [libelle, valeur] of lignes) {
    const ligne = el("div", "detail");
    ligne.append(el("dt", "", libelle), el("dd", "", valeur));
    details.append(ligne);
  }

  contenu.replaceChildren(
    hero,
    el("h2", "etiquette", "Score par set"),
    sets,
    el("h2", "etiquette", "Détails"),
    details
  );
  zoneEtat.textContent = "";
}

/* ---------- Démarrage ---------- */

afficherOnglets();

if (champRecherche) {
  champRecherche.addEventListener("input", () => tousLesJoueurs.length && afficherListe());
  const formulaire = champRecherche.closest("form");
  if (formulaire) formulaire.addEventListener("submit", (e) => e.preventDefault());
}

zoneEtat.textContent = "Chargement…";
afficherSqueletes(conteneur ? 6 : 3);

fetch("data.json")
  .then((reponse) => {
    if (!reponse.ok) throw new Error("Code " + reponse.status);
    return reponse.json();
  })
  .then((donnees) => {
    tousLesJoueurs = donnees;
    donneesChargees = true;

    if (page === "accueil" || page === "favoris") {
      if (tousLesJoueurs.length === 0) {
        afficherErreur("Aucun joueur à afficher pour le moment.");
        return;
      }
      afficherListe();
      return;
    }

    const id = params.get("id") || params.get("joueur");
    const joueur = tousLesJoueurs.find((j) => j.id === id);
    if (!joueur) {
      afficherErreur("Joueur introuvable.");
      return;
    }

    if (page === "profil") {
      afficherProfil(joueur);
    } else if (page === "match") {
      const match = joueur.derniersMatchs[Number(params.get("m"))];
      if (!match) {
        afficherErreur("Match introuvable.");
        return;
      }
      afficherMatch(joueur, match);
    }
  })
  .catch((erreur) => {
    console.error(erreur);
    afficherErreur("Impossible de charger les données. Réessayez plus tard.");
  });
/* ---------- Ajouter un joueur (accueil) ---------- */

const TEINTES = ["rouge", "violet", "orange", "bleu", "ardoise"];
const formulaireProposer = document.getElementById("proposer");
const fenetreAjout = document.getElementById("fenetre-ajout");
const boutonAjouter = document.getElementById("ouvrir-ajout");

function initialesDe(nom) {
  return nom
    .split(/\s+/)
    .slice(0, 2)
    .map((mot) => mot[0])
    .join("")
    .toUpperCase();
}

if (formulaireProposer) {
  boutonAjouter.addEventListener("click", () => {
    document.getElementById("erreurs").textContent = "";
    fenetreAjout.showModal();
  });
  document.getElementById("annuler-ajout").addEventListener("click", () => fenetreAjout.close());
  // un clic sur le fond sombre ferme aussi la fenêtre
  fenetreAjout.addEventListener("click", (e) => {
    if (e.target === fenetreAjout) fenetreAjout.close();
  });

  formulaireProposer.addEventListener("submit", (event) => {
    event.preventDefault();

    const donnees = new FormData(formulaireProposer);
    const nom = donnees.get("nom").trim();
    const pays = donnees.get("pays").trim();

    const erreurs = [];
    if (nom.length < 2) {
      erreurs.push("Le nom doit avoir au moins 2 caractères.");
    }
    if (pays === "") {
      erreurs.push("Indiquez le pays.");
    }
    if (!donneesChargees) {
      erreurs.push("La liste n'est pas encore chargée, réessayez dans un instant.");
    }

    const zoneErreurs = document.getElementById("erreurs");
    if (erreurs.length > 0) {
      zoneErreurs.textContent = "Erreur : " + erreurs.join(" ");
      if (nom.length < 2) document.getElementById("champ-nom").focus();
      return;
    }
    zoneErreurs.textContent = "";

    tousLesJoueurs.unshift({
      id: "propose-" + Date.now(),
      nom: nom,
      initiales: initialesDe(nom),
      teinte: TEINTES[tousLesJoueurs.length % TEINTES.length],
      pays: pays,
      propose: true
    });

    if (champRecherche) champRecherche.value = "";
    afficherListe();
    formulaireProposer.reset();
    fenetreAjout.close();
  });
}