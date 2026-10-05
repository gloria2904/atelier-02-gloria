# Atelier 1 · Chasse aux code smells

**Séance 1 · Qualité logicielle & principes · 75 min · en binôme**

Vous venez de rejoindre l'équipe de **VenteFlash**. Le code est dans `src/`.
Il fonctionne (les tests passent), mais personne n'ose plus y toucher.
Votre mission : **l'auditer sans le modifier**.

**On ne code pas aujourd'hui.** Un bon diagnostic précède toute correction.
Votre grille sert de point de départ à l'atelier 2. C'est aussi le format exact
de la partie « analyse critique » de votre dossier.

## Déroulé conseillé

| Temps  | Étape                                                  |
|--------|--------------------------------------------------------|
| 15 min | Démarrage : création du dépôt, branche, installation   |
| 15 min | Lecture des trois fichiers de `src/` et des tests      |
| 35 min | Remplissage de la grille                               |
| 10 min | Vérification et pull request                           |

## 1. Démarrage : créer votre dépôt GitHub

**Avant tout** : chaque membre du binôme a un compte GitHub. Pas encore de compte ?
Créez-le sur github.com, c'est gratuit. Notez votre pseudo, votre binôme en aura besoin.

**Un seul membre crée le dépôt et pousse.** Il tient la grille et fait les commits.
L'autre lit le code sur son propre écran, cherche et relit. Vous évitez ainsi les conflits Git.

Deux façons de faire. Choisissez **A** si Git et Node.js sont installés sur votre poste.
Sinon, choisissez **B** : tout se passe dans le navigateur.

### A. Sur votre poste, avec Git

**1. Créez le dépôt vide sur GitHub.**
En haut à droite de github.com : **+**, puis **New repository**.

- Nom : `atelier-01-nom1-nom2`, avec vos deux noms de famille, en minuscules et sans accents.
- Visibilité : **Private**.
- Ne cochez **rien** d'autre : ni README, ni .gitignore, ni licence. Le dépôt doit être vide.

Cliquez sur **Create repository**. Gardez la page ouverte : elle affiche l'adresse du dépôt.

**2. Envoyez le code de départ.**
Décompressez l'archive `atelier-01-chasse-aux-smells.zip` téléchargée sur l'espace du cours.
Ouvrez un terminal dans le dossier obtenu, puis :

```bash
git init
git add .
git commit -m "Code de départ VenteFlash"
git branch -M main
git remote add origin https://github.com/<votre-pseudo>/atelier-01-nom1-nom2.git
git push -u origin main
```

Rechargez la page GitHub : les fichiers apparaissent.
Le dossier `.github` est caché sur votre poste, c'est normal. Vérifiez sur GitHub qu'il est bien présent.

**3. Créez votre branche de travail et lancez les tests.**

```bash
git switch -c travail
npm install
npm test
```

### B. Dans le navigateur, avec Codespaces

**1. Créez le dépôt sur GitHub.**
En haut à droite de github.com : **+**, puis **New repository**.
Nom `atelier-01-nom1-nom2`, visibilité **Private**, et cochez cette fois **Add a README file**.
Cliquez sur **Create repository**.

**2. Ouvrez un Codespace.**
Bouton **Code**, onglet **Codespaces**, **Create codespace on main**.
Un éditeur s'ouvre dans le navigateur après une minute environ.

**3. Envoyez le code de départ.**
Glissez l'archive `atelier-01-chasse-aux-smells.zip` dans l'explorateur de fichiers, à gauche.
Puis, dans le terminal en bas de l'écran :

```bash
unzip atelier-01-chasse-aux-smells.zip
cp -r atelier-01-chasse-aux-smells/. .
rm -rf atelier-01-chasse-aux-smells atelier-01-chasse-aux-smells.zip __MACOSX
git add .
git commit -m "Code de départ VenteFlash"
git push
git switch -c travail
npm install
npm test
```

Dans un Codespace, Git est déjà connecté à votre compte : aucun mot de passe à saisir.

### Dans les deux cas

Vous devez voir **6 tests au vert**.

**Invitez votre binôme et l'intervenant.**
Sur la page du dépôt : **Settings**, puis **Collaborators**, puis **Add people**.
Ajoutez le pseudo GitHub de votre binôme, puis celui de l'intervenant, communiqué en séance.
Chaque invité reçoit un email et doit accepter l'invitation.

Si l'installation échoue, ne restez pas bloqués : commencez l'audit quand même.
Lire le code suffit pour aujourd'hui. Prévenez l'intervenant.

### En cas de problème

| Message ou symptôme | Solution |
|------------------------------|--------------------------------------------------------|
| `Please tell me who you are` au premier commit | `git config --global user.name "Prénom Nom"` puis `git config --global user.email "votre-email-github"`, et recommencez le commit |
| `Password authentication is not supported` au push | GitHub refuse les mots de passe dans le terminal. Utilisez GitHub Desktop, ou `gh auth login`, ou passez à la méthode B |
| `rejected` au premier push | le dépôt n'était pas vide. Recréez-le sans README, ou passez à la méthode B |
| `remote origin already exists` | `git remote set-url origin <adresse-du-depot>` |
| le dossier `.github` n'apparaît pas sur GitHub | il n'a pas été copié. Vérifiez avec `ls -a` dans le terminal |

## 2. Consignes

1. Lisez les trois fichiers de `src/` (environ 115 lignes). Parcourez aussi `tests/` : les tests montrent comment le code est utilisé.
2. Identifiez **au moins 8 code smells distincts**.
3. Nommez chaque smell avec le vocabulaire de `MEMO-SMELLS.md`, le catalogue vu en cours. Un défaut absent du mémo est accepté s'il porte la mention « (hors catalogue) » et une justification. Au moins 6 smells doivent venir du mémo.
4. Complétez `GRILLE-DIAGNOSTIC.md` : nom, localisation, gravité, piste de remède.
5. Classez vos lignes par gravité décroissante : les bloquants d'abord, les mineurs à la fin.
6. Rédigez les deux sections sous le tableau : le smell le plus grave, puis votre usage de l'IA.

### Règles de la grille

- **Distinct** veut dire « nom différent ». Un smell présent à plusieurs endroits compte une seule fois. Indiquez toutes ses localisations dans la même ligne.
- **Localisation** : fichier · fonction · lignes. Format attendu : `fichier.ts · nomDeFonction · l. 12-18`. Les numéros renvoient au code tel que vous l'avez reçu.
- **Piste de remède** : une phrase, sans code. Exemple de format : « renommer la variable pour révéler son intention ».

### Échelle de gravité

| Gravité  | Définition                                                  |
|----------|-------------------------------------------------------------|
| bloquant | Peut produire un bug métier, ou rend toute évolution risquée |
| majeur   | Ralentit ou fragilise chaque évolution                      |
| mineur   | Gêne la lecture, sans risque immédiat                       |

## 3. Rendu : pull request avant la fin de séance

```bash
npm run verifier
git add GRILLE-DIAGNOSTIC.md
git commit -m "Diagnostic VenteFlash"
git push -u origin travail
```

`npm run verifier` contrôle le format de votre grille et vous dit ce qui manque.

Sur GitHub, ouvrez ensuite **Pull requests**, puis **New pull request**.
Choisissez base `main` et compare `travail`. Titre : « Atelier 1 · prénom 1 + prénom 2 ».
Cochez la checklist qui s'affiche dans la description.

Copiez enfin l'adresse de votre pull request et déposez-la sur l'espace du cours, dans le devoir « Atelier 1 ».
Vérifiez que l'intervenant a bien accepté votre invitation : sans elle, il ne peut pas lire un dépôt privé.

Deux contrôles automatiques tournent sur votre pull request :

- **Tests** : les 6 tests restent verts. Vous ne touchez pas à `src/`, ils le resteront.
- **Grille** : vérifie le format (8 lignes, localisations, gravités, ordre, sections) et que `src/` et `tests/` sont intacts. Il ne juge pas le fond. C'est le rôle de l'intervenant.

Un contrôle rouge ? Lisez le message, corrigez, puis faites un nouveau `git commit` et `git push`.
La pull request se met à jour toute seule.

## Pour aller plus loin

Votre binôme a fini en avance ? Deux défis au choix :

- Trouvez 12 smells au lieu de 8 (lignes 9 à 12 de la grille).
- Proposez un ordre de remboursement de la dette : par quoi commenceriez-vous, et pourquoi ? Répondez dans la section bonus de la grille.

## Règles communes à tous les ateliers

- Travail en binôme, dans un dépôt GitHub privé créé par le binôme. L'intervenant y est invité.
- Les tests restent au vert à chaque commit. La CI le vérifie.
- Rendu par pull request de la branche `travail` vers `main`.
- IA autorisée dans le cadre du syllabus : l'IA propose, vous arbitrez et justifiez. Tout usage se signale dans la grille.

## Contenu du dépôt

| Fichier                   | Rôle                                            |
|---------------------------|-------------------------------------------------|
| `src/`                    | Le code de VenteFlash, à auditer sans le modifier |
| `tests/`                  | Tests de caractérisation, qui restent au vert  |
| `GRILLE-DIAGNOSTIC.md`    | Votre livrable                                  |
| `MEMO-SMELLS.md`          | Le catalogue des noms de smells                 |
| `outils/verifier-grille.js` | Le contrôle de format lancé par `npm run verifier` |
