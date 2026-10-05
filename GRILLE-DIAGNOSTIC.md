# Grille de diagnostic · VenteFlash

Binôme : Gloria (travail individuel)

> Gravité : **bloquant** (bug métier possible ou évolution risquée), **majeur** (ralentit chaque évolution), **mineur** (gêne la lecture).
> Une ligne par smell distinct. Plusieurs localisations possibles dans la même ligne.
> Classez les lignes par gravité décroissante. Les lignes 9 à 12 sont facultatives.

| # | Smell (nom du catalogue) | Localisation (fichier · fonction · lignes) | Gravité | Piste de remède (sans coder) |
|----|--------------------------|--------------------------------------------|------------|------------------------------|
| 1 | Duplicate Code | orderManager.ts · processOrder · l. 31-38 et 43-44 ; reportGenerator.ts · estimateTtc · l. 16-25 | bloquant | Écrire la remise client et la TVA à un seul endroit, utilisé par la commande et par le devis. |
| 2 | Large Class (God Class) | orderManager.ts · OrderManager · l. 4-70 | bloquant | Séparer le calcul du prix, la persistance, la notification, le formatage du reçu et le calcul du chiffre d'affaires en éléments distincts. |
| 3 | Primitive Obsession | orderManager.ts · processOrder · l. 19-24 et 54 ; orderManager.ts · orders · l. 6 ; reportGenerator.ts · generateHtml · l. 8 | bloquant | Remplacer les chaînes (type client, livraison) par des types fermés et la commande en tableau par un objet métier nommé. |
| 4 | Long Method (Long Function) | orderManager.ts · processOrder · l. 18-60 | majeur | Découper la méthode en étapes nommées (sous-total, remise, promo, TVA, livraison, enregistrement, reçu). |
| 5 | Switch Statements (Repeated Switches) | orderManager.ts · processOrder · l. 32-38 et 46-52 ; reportGenerator.ts · estimateTtc · l. 17-23 | majeur | Remplacer les cascades de if/else sur le type de client et le mode de livraison par une table de tarifs ou une stratégie par type. |
| 6 | Magic Number | orderManager.ts · processOrder · l. 33, 35, 37, 40-41, 44, 47, 49 ; reportGenerator.ts · estimateTtc · l. 18, 20, 22, 25 | majeur | Donner un nom de constante à chaque taux, frais et code promo pour que la règle métier se lise. |
| 7 | Global Data | orderManager.ts · OrderManager · l. 6 et 9-15 | majeur | Supprimer le singleton et la liste publique, et fournir l'instance et le stockage par injection. |
| 8 | Long Parameter List | orderManager.ts · processOrder · l. 18-25 ; legacyUtils.ts · convertCurrency · l. 3-10 | majeur | Regrouper les paramètres liés dans un objet « commande » ou « demande » et retirer les paramètres inutiles. |
| 9 | Inappropriate Intimacy | reportGenerator.ts · generateHtml · l. 7-8 | majeur | Faire exposer à l'OrderManager une vue de ses commandes plutôt que de lire ses tableaux par position (orders[i][2]). |
| 10 | Dead Code | legacyUtils.ts · oldFormatDate · l. 15-18 ; legacyUtils.ts · convertCurrency · l. 3-13 | mineur | Supprimer ces deux fonctions, jamais appelées ni testées, l'historique Git les conserve. |
| 11 | Speculative Generality | legacyUtils.ts · convertCurrency · l. 3-13 | mineur | Retirer les paramètres rateProvider, cache et retries et le TODO « à l'international » tant que le besoin n'existe pas. |
| 12 | Flag Argument | orderManager.ts · processOrder · l. 24 et 56-58 | mineur | Sortir l'envoi de l'email de processOrder, ou le confier à un composant de notification injecté. |

## Le smell le plus grave, et pourquoi (3 lignes)

Duplicate Code : la remise client et la TVA sont écrites deux fois (processOrder et estimateTtc, l. 31-44 et 16-25). Si l'on change un taux à un seul endroit, le devis affiche un autre prix que la commande, sans aucune erreur ni test rouge.
C'est le seul smell qui peut produire un montant faux de façon silencieuse, donc un bug métier visible par le client. Il est aussi la conséquence directe de la God Class (smell 2), qui mélange tout dans OrderManager.

## Usage de l'IA

Claude (Anthropic). Question posée : identifier les code smells de src/ avec le vocabulaire de MEMO-SMELLS.md, puis proposer localisation (numéros de lignes du code reçu), gravité et piste de remède.
Retenu : les 12 smells ci-dessus, relus et vérifiés ligne par ligne dans le code, avec le classement par gravité. Écarté : Mutable Data (déjà couvert par Global Data), Comments et Mysterious Name (trop mineurs pour les 12 lignes).

## Bonus : ordre de remboursement (facultatif)

1. Supprimer le Dead Code et la Speculative Generality (legacyUtils.ts) : risque nul, gain immédiat de lisibilité.
2. Traiter Duplicate Code et Magic Number ensemble : une seule source de vérité pour les tarifs, ce qui supprime le risque de bug métier le plus concret.
3. Typer les données (Primitive Obsession) puis supprimer les Switch Statements : un type fermé rend les valeurs invalides impossibles.
4. Découper la God Class et la Long Method (Long Parameter List, Flag Argument) : le plus long, mais bien plus sûr une fois les tarifs centralisés.
5. Supprimer la Global Data et l'Inappropriate Intimacy par injection de dépendances : on termine par l'architecture, une fois le code interne propre.
