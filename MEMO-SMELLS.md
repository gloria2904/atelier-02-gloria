# Mémo · Catalogue des code smells

Utilisez ces noms dans votre grille. Ils viennent de refactoring.guru (les 5 familles vues en cours)
et du livre *Refactoring* de Martin Fowler. Gardez le nom anglais : c'est celui des outils et de la littérature.

Un smell n'est pas un bug. C'est un symptôme qui se nomme, se localise et se priorise.

## Boursouflures (Bloaters)

Le code a tellement grossi qu'il devient difficile à manipuler.

| Nom | En une phrase |
|-----|---------------|
| Long Method (Long Function) | Une fonction trop longue pour être comprise d'un coup d'œil. |
| Large Class (God Class) | Une classe qui fait trop de choses et connaît tout. |
| Long Parameter List | Trop de paramètres pour les retenir ou les passer sans erreur. |
| Primitive Obsession | Des types de base (string, number, tableaux) à la place de petits objets métier. |
| Data Clumps | Les mêmes données voyagent toujours ensemble sans former un objet. |

## Abus de l'orienté objet (Object-Orientation Abusers)

L'orienté objet est mal ou pas du tout exploité.

| Nom | En une phrase |
|-----|---------------|
| Switch Statements (Repeated Switches) | Un switch ou une cascade de if/else sur un type, souvent répété. |
| Temporary Field | Un attribut qui n'a de valeur que dans certains cas. |
| Refused Bequest | Une sous-classe qui n'utilise pas ce dont elle hérite. |
| Alternative Classes with Different Interfaces | Deux classes font la même chose avec des méthodes différentes. |

## Empêcheurs de changement (Change Preventers)

Un changement simple coûte cher.

| Nom | En une phrase |
|-----|---------------|
| Divergent Change | Une même classe change pour plusieurs raisons différentes. |
| Shotgun Surgery | Un seul changement oblige à retoucher plusieurs endroits. |
| Parallel Inheritance Hierarchies | Créer une sous-classe oblige à en créer une autre ailleurs. |

## Dispensables

Du code dont on pourrait se passer.

| Nom | En une phrase |
|-----|---------------|
| Duplicate Code | La même connaissance est écrite à plusieurs endroits. |
| Dead Code | Du code jamais appelé ou jamais exécuté. |
| Comments | Des commentaires qui compensent un code peu clair. |
| Speculative Generality | Du code prévu « pour plus tard » qui ne sert à rien aujourd'hui. |
| Lazy Class | Une classe qui n'en fait pas assez pour justifier son existence. |
| Data Class | Une classe qui ne contient que des données, sans comportement. |

## Accouplements abusifs (Couplers)

Des éléments trop liés entre eux.

| Nom | En une phrase |
|-----|---------------|
| Feature Envy | Une méthode s'intéresse plus aux données d'une autre classe qu'aux siennes. |
| Inappropriate Intimacy | Une classe accède aux détails internes d'une autre. |
| Message Chains | Une chaîne d'appels du type `a.getB().getC().getD()`. |
| Middle Man | Une classe qui ne fait que déléguer. |

## Compléments (Fowler et cours)

| Nom | En une phrase |
|-----|---------------|
| Mysterious Name | Un nom qui ne dit ni ce que fait ni ce que contient l'élément. |
| Global Data | Une donnée modifiable accessible de partout. |
| Mutable Data | Des données modifiées à plusieurs endroits sans contrôle. |
| Magic Number | Une valeur littérale sans nom qui porte une règle métier. |
| Flag Argument | Un paramètre booléen qui change le comportement d'une fonction. |
