// Contrôle de FORMAT de GRILLE-DIAGNOSTIC.md.
// Il ne juge pas le fond : c'est le rôle de l'intervenant.
// Usage : npm run verifier

const fs = require("fs");
const path = require("path");

const FICHIER = path.join(__dirname, "..", "GRILLE-DIAGNOSTIC.md");
const MINIMUM = 8;
const MINIMUM_CATALOGUE = 6;
const GRAVITES = ["bloquant", "majeur", "mineur"];
const FICHIERS_SRC = ["orderManager", "reportGenerator", "legacyUtils"];

// Noms reconnus : ceux de MEMO-SMELLS.md, plus quelques équivalents français courants.
const CATALOGUE = [
  "long method", "long function", "large class", "god class", "long parameter list",
  "primitive obsession", "data clumps", "switch statement", "repeated switch",
  "temporary field", "refused bequest", "alternative classes", "divergent change",
  "shotgun surgery", "parallel inheritance", "duplicate code", "duplicated code",
  "dead code", "comments", "speculative generality", "lazy class", "data class",
  "feature envy", "inappropriate intimacy", "message chain", "middle man",
  "mysterious name", "global data", "mutable data", "magic number", "flag argument",
  "code mort", "code duplique", "duplication", "commentaire", "nombre magique",
  "generalite speculative", "classe dieu",
];

const normaliser = (s) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ").trim();

const estVide = (s) => {
  const t = normaliser(s.replace(/[_*`]/g, ""));
  return t === "" || t === "..." || t === "…";
};

const erreurs = [];
const avertissements = [];

if (!fs.existsSync(FICHIER)) {
  console.error("GRILLE-DIAGNOSTIC.md est introuvable à la racine du dépôt.");
  process.exit(1);
}
const lignes = fs.readFileSync(FICHIER, "utf8").split(/\r?\n/);

// 1. Binôme
const binome = lignes.find((l) => normaliser(l).startsWith("binome"));
if (!binome || /pr[ée]nom\s*[12]/i.test(binome)) {
  erreurs.push("Indiquez vos deux prénoms sur la ligne « Binôme ».");
}

// 2. Tableau
const rangs = [];
const noms = new Map();
let reconnus = 0;
for (const l of lignes) {
  if (!l.trim().startsWith("|")) continue;
  const cellules = l.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());
  if (cellules.length < 5 || !/^\d+/.test(cellules[0])) continue;
  const [num, smell, loc, grav, remede] = cellules;
  const remplies = [smell, loc, grav, remede].filter((c) => !estVide(c)).length;
  if (remplies === 0) continue;
  const n = `ligne ${num}`;
  if (estVide(smell)) { erreurs.push(`${n} : le nom du smell manque.`); continue; }
  if (remplies < 4) erreurs.push(`${n} : complétez les quatre colonnes.`);

  if (!estVide(loc)) {
    if (!FICHIERS_SRC.some((f) => loc.includes(f))) {
      erreurs.push(`${n} : la localisation doit citer un fichier de src/ (ex. orderManager.ts).`);
    }
    if (!/\d/.test(loc)) erreurs.push(`${n} : la localisation doit donner des numéros de ligne.`);
  }

  const g = normaliser(grav);
  const rang = GRAVITES.indexOf(g);
  if (!estVide(grav) && rang === -1) {
    erreurs.push(`${n} : gravité « ${grav} » inconnue. Utilisez bloquant, majeur ou mineur.`);
  }
  rangs.push({ n, rang });

  const cle = normaliser(smell.replace(/\(hors catalogue\)/i, ""));
  if (noms.has(cle)) {
    erreurs.push(`${n} : « ${smell} » figure déjà en ${noms.get(cle)}. Regroupez les localisations sur une seule ligne.`);
  } else {
    noms.set(cle, n);
  }
  const horsCatalogue = /hors catalogue/i.test(smell);
  if (!horsCatalogue && CATALOGUE.some((c) => normaliser(smell).includes(c))) reconnus++;
  if (!horsCatalogue && !CATALOGUE.some((c) => normaliser(smell).includes(c))) {
    avertissements.push(`${n} : « ${smell} » n'est pas dans MEMO-SMELLS.md. Ajoutez « (hors catalogue) » et justifiez, ou reprenez un nom du mémo.`);
  }
}

if (noms.size < MINIMUM) {
  erreurs.push(`${noms.size} smell(s) distinct(s) trouvé(s). Il en faut au moins ${MINIMUM}.`);
}
if (reconnus < MINIMUM_CATALOGUE && noms.size >= MINIMUM) {
  erreurs.push(`Seulement ${reconnus} nom(s) reconnu(s) du catalogue. Il en faut au moins ${MINIMUM_CATALOGUE}.`);
}

// 3. Ordre de gravité
for (let i = 1; i < rangs.length; i++) {
  const avant = rangs[i - 1];
  const apres = rangs[i];
  if (avant.rang !== -1 && apres.rang !== -1 && apres.rang < avant.rang) {
    erreurs.push(`${apres.n} : elle est plus grave que la ${avant.n}. Classez par gravité décroissante.`);
    break;
  }
}

// 4. Sections rédigées
function contenuSection(debutTitre) {
  const i = lignes.findIndex((l) => l.startsWith("## ") && normaliser(l).includes(debutTitre));
  if (i === -1) return null;
  const corps = [];
  for (let j = i + 1; j < lignes.length && !lignes[j].startsWith("## "); j++) {
    const l = lignes[j].trim();
    if (l.startsWith(">") || estVide(l)) continue;
    corps.push(l);
  }
  return corps.join(" ");
}
const plusGrave = contenuSection("le plus grave");
if (plusGrave === null) erreurs.push("La section « Le smell le plus grave » a disparu. Remettez-la.");
else if (plusGrave.length < 40) erreurs.push("Rédigez la section « Le smell le plus grave, et pourquoi » (3 lignes).");

const ia = contenuSection("usage de l'ia");
if (ia === null) erreurs.push("La section « Usage de l'IA » a disparu. Remettez-la.");
else if (ia.length === 0) erreurs.push("Remplissez la section « Usage de l'IA ». Écrivez « Aucun » si vous ne l'avez pas utilisée.");

// Bilan
for (const a of avertissements) console.log("Attention : " + a);
if (erreurs.length > 0) {
  console.log("\nGrille incomplète :");
  for (const e of erreurs) console.log(" - " + e);
  process.exit(1);
}
console.log(`\nGrille conforme (${noms.size} smells). Le fond sera évalué par l'intervenant.`);
