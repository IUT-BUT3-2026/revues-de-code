# Module 1 — Pourquoi relire le code ?

> **Objectifs du module.** À la fin de cette séance, vous saurez :
>
> - définir ce qu'est une revue de code et citer ses principales formes ;
> - argumenter, chiffres à l'appui, pourquoi la revue de code est une pratique
>   indispensable en programmation logicielle ;
> - distinguer l'auto-revue (se relire soi-même) de la revue d'équipe (relire
>   le code des autres) et expliquer leurs enjeux respectifs ;
> - utiliser le vocabulaire de base : *pull request*, *diff*, *reviewer*,
>   *approve*, *request changes*, commentaire en ligne ;
> - adopter les attitudes de base d'un bon relecteur.

---

## 1. Mise en situation

Vous venez d'écrire cette fonction TypeScript. Elle compile. Elle passe tous
les tests que vous avez écrits. La merge-t-on en production ?

```ts
// src/discount.ts
export function applyDiscount(price: number, code: string | undefined): number {
  if (code === "PROMO10") {
    return price * 0.9;
  }
  if (code === "PROMO50") {
    return price * 0.5;
  }
  return price;
}
```

Un relecteur attentif remarquera en quelques secondes des choses que
l'auteur ne voit plus :

- `price` peut être négatif, ou même `NaN` — `NaN * 0.9` reste `NaN` ;
- deux codes magic strings éparpillés — le jour où on ajoute `PROMO20`, il
  faudra retrouver cet endroit ;
- la logique métier (le pourcentage de remise) est mélangée à la logique
  d'application du code ;
- aucun test pour les cas limites (code inconnu, code vide, prix à 0) ;
- le nom de la fonction ne dit pas ce qui se passe si `code` est invalide.

**C'est exactement le rôle de la revue de code : rattraper ce que l'auteur ne
voit plus, avant que le code n'atteigne la production.**

---

## 2. Qu'est-ce qu'une revue de code ?

> **Définition.** La revue de code (*code review*) est la lecture systématique
> d'un code source par une ou plusieurs personnes, **avant** qu'il ne soit
> intégré à la branche principale (et donc livré aux utilisateurs).

C'est une pratique aussi vieille que l'industrie du logiciel : dès les années
1970, Michael Fagan (IBM) formalise l'**inspection de code**, un processus
structuré où une équipe relit ligne à ligne un module et consigne chaque
défaut trouvé. Ce qui a changé depuis, c'est la forme — mais pas le fond :
**un code non relu est un code dont personne ne connaît vraiment la qualité.**

### Les formes de revue

| Forme | Qui relit ? | Quand ? | Où ? |
|-------|-------------|---------|------|
| **Auto-revue** (*self-review*) | L'auteur lui-même | Avant de soumettre | Sur le *diff* local ou la PR |
| **Revue par un pair** (*peer review*) | Un ou plusieurs collègues | Avant le merge | Pull request (GitHub, GitLab, Bitbucket) |
| **Revue croisée** | Deux auteurs se relisent mutuellement | Avant le merge | Pull request |
| **Programmation en binôme** (*pair programming*) | Deux personnes sur le même code | Pendant l'écriture | Un seul écran |
| **Inspection formelle** | Réunion dédiée, rôles définis | Avant une livraison majeure | Réunion (rare, coûteuse) |

Dans ce cours, on se concentre sur les deux formes les plus utilisées dans
l'industrie aujourd'hui : **l'auto-revue** et la **revue par un pair via les
pull requests**. C'est aussi, très concrètement, ce que vous ferez en TD.

---

## 3. Pourquoi c'est important — les chiffres

On pourrait croire que la revue de code est une formalité bureaucratique.
Les données disent le contraire.

### Les bugs coûtent cher — et d'autant plus qu'on les découvre tard

C'est le résultat le plus cité de l'ingénierie logicielle (Boehm & Basili,
*Software Defect Reduction Top 10 List*) :

> Corriger un problème logiciel **après livraison** peut coûter de **10 à
> 100 fois plus cher** que de le corriger pendant le développement.

Un bug trouvé en revue coûte quelques minutes à corriger. Le même bug trouvé
en production coûte : une investigation, un correctif d'urgence, une
re-publication, des utilisateurs mécontents — et parfois une nuit entière.
Aux États-Unis, le coût annuel de la mauvaise qualité logicielle est estimé à
plus de **2 000 milliards de dollars** (Consortium for IT Software Quality,
2022). Une part significative de cette somme est due à des défauts qui
auraient pu être détectés avant la livraison.

### La revue détecte réellement les défauts

- Dans les années 1970-80, les inspections d'IBM et de la NASA montrent des
  taux de détection de défauts de **60 à 75 %** — une revue méthodique attrape
  la majorité des problèmes avant la livraison.
- En 2006, une étude de Cisco portant sur 3 500 revues de code constate que
  **60 à 70 % des défauts** sont trouvés par les revues de code.
- En 2015, une étude interne de Google sur 9 millions de revues de code
  confirme que la revue est un **filtre de qualité efficace et rapide** :
  les revues de moins de 200-400 lignes modifiées sont relues plus vite et
  plus soigneusement.

Bien sûr, la revue n'attrape pas tout — aucun processus ne le fait. Mais
c'est le **meilleur rapport coût / efficacité** dont dispose l'industrie pour
la qualité.

### Le cas TypeScript : le compilateur ne suffit pas

Un langage typé comme TypeScript attrape déjà beaucoup de choses à la
compilation :

```ts
function formatPrice(price: number): string {
  return price.toFixed(2); // ok si price est un number
}
```

Mais le compilateur ne sait pas *pourquoi* ce code existe, ni ce qu'il est
*censé* faire. Il ne détectera jamais :

- une logique métier incorrecte (remise appliquée au mauvais endroit) ;
- un oubli (cas limite non traité, paramètre jamais utilisé) ;
- un problème de sécurité (donnée utilisateur injectée dans une requête) ;
- un code illisible qui sera un cauchemar à maintenir dans 6 mois.

La revue de code est le **complément humain du compilateur** : elle vérifie
ce que la machine ne peut pas vérifier — l'intention, la pertinence, la
clarté.

---

## 4. Les bénéfices concrets

Au-delà de la chasse aux bugs, la revue de code apporte six bénéfices
structurants pour une équipe.

### 1. Moins de bugs en production
C'est le bénéfice immédiat : les défauts sont détectés à la source, quand ils
sont les moins chers à corriger.

### 2. Partage de connaissance
Chaque revue est un moment où deux personnes comprennent le même morceau de
code. Résultat : plus personne ne possède « son » code en solo, le savoir
circule, et l'équipe ne s'arrête pas si un membre part. C'est ce qu'on appelle
le **bus factor** : le nombre de personnes qu'il faudrait « perdre » pour
bloquer le projet. La revue le réduit.

### 3. Propriété collective du code
Si chacun relit tout, chacun se sent responsable de tout. On n'hésite plus à
corriger un bug dans le code d'un collègue, et personne ne « défend » un
morceau de code comme son jardin privé.

### 4. Une barre de qualité commune
Nommage, conventions, structure des dossiers, style… La revue fait respecter
les conventions de l'équipe *par* l'équipe, sans avoir besoin d'un
« gardien du temple ». C'est de la documentation vivante : la meilleure façon
d'apprendre les conventions du projet, c'est de les voir appliquées et
commentées dans les PR.

### 5. Sécurité
Une paire d'yeux supplémentaire détecte les classiques : mots de passe ou
clés API commités, entrées utilisateur non validées, dépendances dangereuses,
accès trop larges. Nous verrons une checklist dédiée au Module 6.

### 6. Amélioration des compétences
Relire du code, c'est lire du code écrit par d'autres — donc découvrir
d'autres façons de résoudre le même problème. Les études internes Google le
confirment : les développeurs qui relisent beaucoup deviennent plus vite
meilleurs. L'auteur apprend (feedback sur son code), le relecteur apprend
(nouvelles techniques), et l'équipe apprend (connaissances partagées).

---

## 5. Se relire soi-même : l'auto-revue

Avant de soumettre son code aux autres, il faut le soumettre… à soi-même.
C'est l'étape la plus simple à mettre en place et celle qui fait gagner le
plus de temps à tout le monde.

### Pourquoi c'est différent de relire le code d'un autre

Quand on vient d'écrire un morceau de code, on est victime d'un **biais de
l'auteur** : on voit ce qu'on a *voulu* écrire, pas ce qu'on a *réellement*
écrit. Le cerveau comble automatiquement les coquilles, saute les branches
évidentes, et oublie que le lecteur ne sait pas ce qu'on sait.

> **Règle d'or de l'auto-revue :** se relire en prenant le point de vue de
> quelqu'un qui ne connaît pas le code. Un relecteur extérieur ne peut pas
> lire dans vos pensées — il ne lit que ce qui est écrit.

### La technique : relire le diff, pas le fichier

L'erreur classique est de se relire « dans l'éditeur », où tout le contexte
est visible. La bonne pratique est de relire le **diff** — les lignes
ajoutées/supprimées telles qu'elles apparaîtront dans la pull request — car
c'est exactement ce que verront vos collègues.

Une auto-revue efficace, en pratique :

1. **Relire le diff avant de créer la PR**, ligne par ligne, à voix haute
   pour ralentir la lecture ;
2. **Vérifier chaque modification** : est-ce que chaque ligne ajoutée est
   nécessaire ? Chaque ligne supprimée est-elle vraiment inutile ?
3. **Relire les tests** : est-ce que les tests testent vraiment le
   comportement, ou juste l'implémentation ?
4. **S'exécuter soi-même les cas limites** : que se passe-t-il si l'entrée
   est vide, nulle, énorme, inattendue ?
5. **Vérifier son propre code à l'aide des outils** : linter, compilateur,
   formatage — avant de faire perdre du temps aux autres avec des détails
   mécaniques.

### L'auto-revue en TypeScript — les 5 réflexes

1. **Le typage est-il honnête ?** `string` là où on pourrait mettre un type
   plus précis ? `any` utilisé comme échappatoire ?
   ```ts
   // À éviter : any fait perdre toute la valeur de TypeScript
   function getTotal(items: any): any {
     return items.reduce((acc, item) => acc + item.price, 0);
   }
   // Mieux : types explicites
   interface Item { price: number }
   function getTotal(items: Item[]): number {
     return items.reduce((acc, item) => acc + item.price, 0);
   }
   ```
2. **Les cas `null`/`undefined` sont-ils traités ?** (voir Module 5)
3. **Les erreurs sont-elles gérées ?** Un `try/catch` silencieux est pire que
   pas de `try/catch` du tout.
4. **Le code est-il lisible hors de son contexte ?** Les noms veulent-ils
   dire quelque chose pour quelqu'un qui arrive sur le projet ?
5. **Y a-t-il des tests pour les cas limites ?** Pas seulement le chemin
   heureux.

---

## 6. Relire en équipe : la revue par les pairs

L'auto-revue a une limite structurelle : **l'auteur ne peut pas se relire
vraiment** — il connaît trop bien le code. C'est pour cela que la revue en
équipe existe : une paire d'yeux *fraîche* voit ce que l'auteur ne voit plus.

### Le principe fondamental : une revue, deux perspectives

- **L'auteur** connaît l'intention, le contexte, les contraintes — mais est
  aveugle à ses propres erreurs.
- **Le relecteur** ignore tout du contexte — mais voit précisément ce qui est
  écrit, les incohérences, les cas oubliés.

La revue de code est la rencontre de ces deux perspectives. C'est un acte de
**collaboration**, pas un examen : le but n'est pas de « prendre en faute »
l'auteur, mais d'améliorer le code ensemble. Les meilleures équipes le vivent
ainsi — c'est une conversation technique, pas un jugement.

### Les rôles dans le workflow GitHub

| Rôle | Action |
|------|--------|
| **Auteur** | Crée la PR, décrit ce qu'il a fait et pourquoi, répond aux commentaires |
| **Relecteur** (*reviewer*) | Lit le diff, commente, approuve ou demande des modifications |
| **Intégrateur** (*maintainer*) | Merge la PR quand les conditions sont réunies (revue faite, tests verts) |

### Le cycle de base d'une PR (aperçu — détaillé au Module 2)

```
1. Auteur :  branche feature  ──►  commit  ──►  push  ──►  pull request
2. CI :      les tests tournent automatiquement (GitHub Actions)
3. Relecteur :  lit le diff, laisse des commentaires en ligne
4. Auteur :  corrige (nouveaux commits sur la même branche)
5. Relecteur :  approuve  (Approve)  ou  demande des changements  (Request changes)
6. Intégrateur :  merge la PR ──►  le code entre dans la branche principale
```

### La revue croisée : la formule des TD

Ce cours utilise la **revue croisée** : deux étudiants échangent leurs PR et
se relisent mutuellement, en jouant tour à tour les rôles d'auteur et de
relecteur. C'est la meilleure façon d'apprendre : vous vivrez les deux côtés
de la conversation, et vous relirez du code écrit par des gens qui, comme
vous, débutent — ce qui rend les défauts plus faciles à repérer que dans du
code professionnel parfaitement propre.

---

## 7. Le vocabulaire à connaître

| Terme | Définition |
|-------|------------|
| **PR** (pull request) | Demande d'intégration d'une branche dans une autre, accompagnée d'une description et d'une discussion |
| **Diff** | Ensemble des lignes ajoutées/supprimées entre deux versions d'un fichier |
| **Reviewer** | Personne qui relit la PR |
| **Inline comment** | Commentaire posé sur une ligne précise du diff |
| **Approve** | Validation de la PR par le relecteur |
| **Request changes** | Refus temporaire : des modifications sont demandées |
| **Merge** | Intégration de la branche dans la branche principale |
| **CI** (intégration continue) | Exécution automatique des tests à chaque push |
| **Checklist de revue** | Liste de points à vérifier systématiquement |

---

## 8. Les attitudes d'un bon relecteur

La revue de code est une pratique technique **et** une pratique sociale. Voici
les attitudes qui font un bon relecteur — et que les TD noteront explicitement :

1. **Commenter le code, pas la personne.**
   Dire « cette boucle est inefficace » et non « tu écris des boucles
   inefficaces ». On critique le travail, jamais l'auteur.

2. **Expliquer le pourquoi.**
   Un commentaire du type « renommer `x` en `totalPrice` » explique ce qu'il
   faut faire ; un commentaire « `x` est ambigu car il peut désigner le prix
   HT ou TTC » explique *pourquoi* il faut le faire. C'est le second qui est
   utile.

3. **Suggérer, ne pas imposer.**
   La revue propose ; l'auteur décide. Formulations : « On pourrait… »,
   « As-tu envisagé… ? », « Qu'en penses-tu si on… ? ».

4. **Dire aussi ce qui est bien.**
   Une revue uniquement négative est démoralisante et fausse : elle laisse
   croire que tout le code est mauvais. Souligner une bonne idée, un nom bien
   choisi, un test malin — c'est aussi de l'information.

5. **Se concentrer sur l'essentiel.**
   Une PR de 50 lignes avec 40 commentaires de style décourage tout le monde.
   Prioriser : d'abord les bugs et la logique, ensuite le design, enfin le
   style (le style se règle de toute façon par le linter).

6. **Respecter le temps de l'autre.**
   Ne pas bloquer une PR pendant des jours, répondre aux commentaires,
   relire rapidement : une revue qui traîne vaut presque une revue qui
   n'existe pas.

7. **Rester humble.**
   Le relecteur peut se tromper. La revue est une discussion, pas un
   jugement dernier. Savoir écrire « je me trompe peut-être, mais… » fait
   partie de la compétence.

---

## 9. Questions de compréhension

1. Expliquez en une phrase pourquoi le compilateur TypeScript ne rend pas la
   revue de code inutile. Donnez deux catégories de problèmes qu'il ne peut
   pas détecter.
2. Citez trois bénéfices de la revue de code autres que la réduction des
   bugs, et expliquez chacun en une phrase.
3. Quelle est la limite structurelle de l'auto-revue ? En quoi la revue par
   un pair la compense-t-elle ?
4. Pourquoi relit-on un *diff* plutôt que le fichier complet quand on fait
   une auto-revue ?
5. Dans l'exemple `applyDiscount` du début de ce module, listez au moins
   trois problèmes qu'un relecteur pourrait signaler.
6. Classez ces commentaires du plus au moins constructif, en justifiant :
   - « `x` c'est nul comme nom » ;
   - « Le nom `priceAfterTax` serait plus clair, car `price` peut être HT ou
     TTC selon l'appelant » ;
   - « Le calcul de la remise devrait être isolé dans sa propre fonction pour
     être testable indépendamment ».
7. Expliquez le principe de la revue croisée et pourquoi elle est adaptée à
   un contexte d'apprentissage.

---

## 10. Pour aller plus loin

- **Module 2** : le workflow complet de la revue sur GitHub (branches,
  protection, merge).
- **Module 3** : la checklist « que chercher dans une revue » — dans l'ordre
  de priorité.
- **Module 5** : les pièges TypeScript les plus fréquents à traquer en revue
  (`null`/`undefined`, `any`, `async/await`, gestion d'erreurs).

Références utiles :

- Boehm & Basili, *Software Defect Reduction Top 10 List* (2001).
- SmartBear, *Best Kept Secrets of Peer Code Review* (étude Cisco, 2006).
- Sadowski, Söderberg, Church, Sipko, Bacchelli, *Modern Code Review: A Case
  Study at Google* (2018).
- Fagan, *Design and Code Inspections to Reduce Errors in Program
  Development* (1976).
