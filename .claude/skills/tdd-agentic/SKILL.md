---
name: tdd-agentic
description: >
  Boucle TDD agentique « think → red → green → refactor » pour tout
  développement de code (feature, bugfix, kata). Le TDD est une boucle de
  réflexion basée sur le feedback : chaque anomalie détectée pendant la
  conception du test remonte au niveau responsable — le code, la conception,
  ou la spécification. Toute ambiguïté de spécification est escaladée à
  l'humain, jamais tranchée silencieusement.
---

# TDD agentique — think / red / green / refactor

Le TDD n'est **pas** « écrire des tests d'abord ». C'est une **boucle de
réflexion** : avant même d'avoir un test rouge, la question est *« comment je
pose le code du test ? »*. Le test est un instrument de feedback immédiat sur
la conception — et, quand le feedback remonte plus haut, sur la spécification
elle-même.

## Règles d'or

1. **Jamais de code de production sans un test rouge qui le justifie.**
2. **Un cycle = un comportement = un test.** Pas de lot.
3. **Jamais d'interprétation silencieuse d'une spec ambiguë** : toute
   ambiguïté est escaladée à l'humain (voir « Escalade spécification »).
4. Chaque signal détecté pendant la boucle a un **niveau de responsabilité** :
   le code, la conception, ou la spécification. On corrige au bon niveau, on
   ne contourne pas dans le test.

## Phase 0 — SPEC : lire avant de penser

Avant tout cycle, lire la spécification du comportement visé (énoncé, ticket,
README, doc métier) et en extraire une **liste de comportements testables**.

Un comportement est testable si on peut répondre aux quatre questions :

| Question | Rubrique |
|---|---|
| Quel(s) objet(s) j'expose ? | ARRANGE |
| Quel est l'état de départ ? | ARRANGE |
| Quelle situation je déclenche ? | ACT |
| Quel comportement j'attends ? | ASSERT |

**Si une des quatre réponses manque ou admet plusieurs lectures plausibles →
escalade spécification.** On n'entre pas en phase THINK avec une spec floue.

Traiter les comportements un par un, du plus simple au plus structurant.

## Phase 1 — THINK : concevoir le test avant de l'écrire

Réfléchir **avant** de coder, pour que le futur test soit rouge **pour les
bonnes raisons**. Passer chaque rubrique en revue et agir sur les signaux :

### 🎬 ARRANGE

- **Est-ce que j'expose le bon objet (la bonne surface de code) ?**
  - Dépendances exotiques ou toxiques dans le setup → signal : mieux isoler
    le code et ses responsabilités (social testing).
- **Est-ce que l'état de départ est simple et clair ?**
  - Trop de setup = dépendance aux données dans la logique = logique mal
    répartie → signal de conception.
  - ⚠ Attention aux valeurs constantes ou tirées de la configuration : les
    rendre explicites dans le test.

### 🎯 ACT

- Des **exceptions** seraient-elles levées alors que je ne les attends pas ?
  C'est du feedback immédiat 🍀 — le traiter, pas le masquer.
- Dois-je **enchaîner plus d'une action** pour obtenir un résultat ?
  → **couplage temporel** 📛, signal de conception.
- Mon action renvoie-t-elle un **résultat immédiat** ?
  ⚠ Tester `void` est impossible 📛 — il faut un minimum de valeur de
  retour. Sinon, revoir la conception (ou l'API spécifiée → escalade).

### ✅ ASSERT

- Mes assertions ont-elles un **sens métier** / correspondent-elles au
  comportement attendu ? Si l'assert est informulable en termes métier →
  escalade spécification.
- Est-ce que je vérifie un **effet connexe ou décalé** ? → mauvaise cible.
- Suis-je en train de faire un **test d'intégration** sans le vouloir ?
  « Je teste A mais je dois vérifier B » 📛 → un couplage est mis en
  évidence, signal de conception.

### Table de routage des signaux

| Signal détecté en THINK | Niveau responsable | Action |
|---|---|---|
| Dépendance toxique, trop de setup, couplage temporel, void, « teste A vérifie B » | Conception | Ajuster la conception ciblée **avant** d'écrire le test (ou noter le refactor pour la phase 4 si le harnais existe déjà) |
| Comportement attendu absent, contradictoire, ou à interprétations multiples | Spécification | **Escalade spécification** (stop sur ce comportement) |
| Simple choix de nommage / structure du test | Test | Décider et avancer |

## Phase 2 — RED : rouge pour les bonnes raisons

1. Écrire **un seul** test (ARRANGE / ACT / ASSERT tels que conçus en THINK).
2. L'**exécuter** — obligatoire, ne jamais supposer le résultat.
3. Vérifier qu'il est rouge **pour la bonne raison** :
   - ✅ échec d'**assertion**, avec un message d'échec lisible ;
   - ❌ erreur de compilation, exception imprévue, erreur de setup →
     retour en THINK, ce n'est pas un vrai rouge.
4. Un test **vert du premier coup** est suspect : soit le comportement existe
   déjà (le vérifier, puis passer au comportement suivant), soit le test ne
   teste rien (le corriger).

## Phase 3 — GREEN : le code minimal

1. Écrire le **code minimal** qui fait passer le test. Rien de plus :
   pas de généralisation anticipée, pas de cas non testés « au passage ».
2. Exécuter **toute la suite** : le nouveau test passe, aucune régression.
3. Si un autre test casse : c'est du feedback — comprendre avant de corriger.

## Phase 4 — REFACTOR : sous harnais vert

1. Uniquement quand **tout est vert**.
2. Petits pas ; relancer la suite **après chaque pas**.
3. Refactorer le **code de production ET les tests** (lisibilité,
   duplication, nommage métier).
4. Traiter les signaux de conception notés en THINK (couplages mis en
   évidence). Si le refactor nécessaire change un comportement spécifié →
   **escalade spécification**, pas de décision unilatérale.

Puis retour en **Phase 0/1** pour le comportement suivant, jusqu'à épuisement
de la liste.

## Escalade spécification (supervision humaine)

La boucle de réflexion remonte **jusqu'aux spécifications** quand celles-ci
sont ambiguës ou incomplètes. C'est l'humain qui tranche, jamais l'agent.

**Déclencheurs :**
- comportement attendu non défini pour un cas d'entrée ;
- deux interprétations plausibles de la spec ;
- specs contradictoires entre elles (ou avec le code existant) ;
- cas limite non couvert (vide, null, bornes, erreurs) ;
- assertion impossible à formuler en termes métier ;
- API spécifiée intestable (void sans effet observable).

**Procédure :**
1. **Formuler la question précisément** : le comportement concerné, l'extrait
   de spec en cause, le cas d'entrée problématique.
2. **Proposer 2 à 3 interprétations candidates**, chacune avec ses
   conséquences (sur le code, les tests, les autres comportements).
3. **Recommander** une interprétation, en justifiant.
4. **Soumettre à l'humain** :
   - session interactive → poser la question (AskUserQuestion), une décision
     à la fois ;
   - session autonome → **stopper le comportement bloqué**, avancer sur les
     comportements non ambigus, et lister toutes les questions en attente
     dans le rapport final.
5. **Consigner la décision** de l'humain dans un journal des décisions de
   spécification (`SPEC-DECISIONS.md` à côté de la spec, ou la section
   prévue par le projet) : question, options, décision, date.
6. **Mettre à jour la spécification** si l'humain le valide, puis reprendre
   la boucle en Phase 0 sur ce comportement.

**Interdits absolus :**
- trancher silencieusement une ambiguïté « parce que c'est probablement ça » ;
- implémenter « les deux au cas où » ;
- affaiblir ou supprimer une assertion pour contourner l'ambiguïté ;
- modifier la spec sans validation humaine.

## Pourquoi (bénéfices attendus)

- 🛎 le code est **prévu pour les tests** (surface publique/privée évidente) ;
- 🛎 des tests unitaires forcent un code unitaire (Single Responsibility,
  philosophie Unix) ;
- 🛎 le test reste là pour toujours 🎰 **non-régression** ;
- 🛎 le test explique pourquoi le code est là et ce qu'on attend de lui 🎰
  **documentation vivante** ;
- 🧠 + 🤖 : le TDD agentique est un élément indispensable du **harnais**
  (harness) sur les parties critiques du produit logiciel.
