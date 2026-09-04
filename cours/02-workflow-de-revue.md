---
marp: true
theme: default
---

# Module 2 — Le workflow de revue sur GitHub

**Revue de code — Programmation logicielle** · Bachelor informatique

À la fin de cette séance, vous saurez :

- expliquer le modèle de branches **GitHub Flow** ;
- créer une branche, ouvrir une pull request, lire un diff ;
- décrire le cycle de vie d'une PR, de l'ouverture au merge ;
- comprendre la protection de branches et les revues obligatoires ;
- rédiger une PR claire (titre, description, taille).

---

## 1. Rappel — le cycle de base

Vue au Module 1 :

```
branche ──► commits ──► pull request ──► revue ──► merge
```

Ce module détaille chaque étape, et ce qui se passe **autour**.

Le workflow de référence de GitHub s'appelle le **GitHub Flow**.
C'est lui que vous utiliserez en TD.

---

## 2. Le GitHub Flow — le principe

> **`main` est toujours déployable.**
> Tout travail se fait sur une **branche éphémère**, intégrée par **pull request**.

- une branche = une idée (fonctionnalité, correction, exercice) ;
- la branche vit le temps du travail, puis disparaît ;
- rien n'arrive sur `main` sans passer par une PR + revue.

Simple, robuste, utilisé par des millions de dépôts.

---

## 2. Le GitHub Flow — les 6 étapes

```
1. créer une branche depuis main        (feature/…)
2. commiter ses modifications           (petits commits logiques)
3. pousser la branche                   (git push)
4. ouvrir une pull request              (titre + description)
5. revue : commentaires, corrections    (boucle)
6. merger dans main                     (la branche est supprimée)
```

---

## 3. Une branche, c'est quoi ?

Une branche est un **pointeur vers un commit**.

```sh
git branch               # liste les branches
git checkout -b feature/panier   # crée + bascule (nouveau : git switch -c)
git push -u origin feature/panier   # publie la branche
```

Règles de nommage courantes :

- `feature/…` — nouvelle fonctionnalité
- `fix/…` — correction de bug
- `docs/…` — documentation
- `2026-IUT-BUT3-DUPONT-td1` — vos branches de TD

> Le nom de la branche dit **quoi**, le commit dit **pourquoi**.

---

## 4. Le commit — écrire pour le futur

Un commit = une modification **logique et cohérente**.

Message en deux parties :

```
Titre : impératif, ≤ 50 caractères
« Corrige le calcul de la remise quand le panier est vide »

Corps (facultatif) : le pourquoi
« Le prix devenait NaN avec un panier vide ;
  ajoute un garde-fou et un test. »
```

- un commit = une idée (pas « wip », pas 20 fichiers sans lien) ;
- on peut **relire l'historique** comme une revue dans le temps.

---

## 5. La pull request — le cœur du workflow

Une PR est une **demande d'intégration** d'une branche dans une autre.

Elle contient :

- le **diff** : toutes les modifications proposées ;
- un **titre** et une **description** (le « dossier » de la PR) ;
- la **conversation** : commentaires, revue, corrections ;
- l'**état** : ouverte, en brouillon, fermée, fusionnée.

La PR est l'endroit où la revue se déroule.

---

## 5. Base et compare

```
base :   main                  (où l'on veut intégrer)
compare : feature/panier       (ce que l'on propose)
```

Le diff affiché = **tout ce que `compare` apporte par rapport à `base`**.

> En TD : base = `main` du dépôt du cours, compare = votre branche préfixée.

La PR en **brouillon** (*draft*) : pas prête pour la revue,
on finit d'abord le travail.

---

## 6. Lire un diff

Le diff montre, ligne par ligne :

- lignes **ajoutées** (+), lignes **supprimées** (-) ;
- un peu de **contexte** autour (gris) ;
- les **fichiers** modifiés, renommés, créés, supprimés.

Quelques réflexes :

- lire le diff **fichier par fichier**, du plus important au moins important ;
- se demander, pour chaque ajout : *est-ce nécessaire ?* ;
- les **tests** font partie du diff — on les relit aussi.

> On commente le diff, pas le fichier entier : c'est la revue.

---

## 7. Le cycle de vie d'une PR

```
draft ──► open ──► [ review ] ──► changes requested ──► open (corrections)
                       │                │
                       └── approved ◄───┘
                            │
                      merged ──► branche supprimée
                            │
                      closed (sans merge : abandonnée)
```

- **changes requested** : des modifications sont demandées — pas un échec, une étape ;
- **approved** : le relecteur valide ;
- **merged** : le code entre dans `main` ;
- **closed** : sans merge = abandon (ou doublon).

---

## 8. La revue — trois verdicts

| Verdict | Signification |
|---------|---------------|
| **Comment** | avis sans blocage — la conversation continue |
| **Approve** | prêt à intégrer |
| **Request changes** | blocage : il faut corriger |

Le relecteur peut aussi :

- commenter **en ligne** (sur une ligne précise du diff) ;
- laisser un **résumé** de revue (vision d'ensemble) ;
- **suggérer** un changement (bouton « suggestion ») — l'auteur applique en un clic.

---

## 8. La boucle de correction

```
l'auteur corrige ──► nouveau commit ──► push ──► la PR se met à jour
```

- chaque push met à jour le diff de la PR ;
- les commentaires **déjà résolus** le restent ;
- répondre à chaque commentaire : *corrigé* ou *expliquer pourquoi pas*.

> Une revue qui répond à tout va plus vite.
> Une revue qui ignore les commentaires… s'éternise.

---

## 9. Les checks (CI)

La PR affiche les **checks** : exécutions automatiques sur chaque push.

```
✔ tests passent          ✘ un test échoue
✔ lint OK                 ✘ la compilation échoue
```

- un check **rouge** bloque généralement le merge ;
- l'auteur voit l'échec immédiatement, corrige, re-pousse.

*(En TD, nous ajouterons ces vérifications plus tard — linter + tests.)*

---

## 10. La protection de branches

Une règle sur `main` peut imposer :

- **au moins une revue approuvée** avant le merge ;
- **les checks verts** obligatoires ;
- l'**interdiction de push direct** (tout passe par une PR).

Pourquoi ?

> Protéger `main`, c'est protéger le code que tout le monde utilise.
> Personne ne pousse directement : tout est revu.

*(Disponible gratuitement sur les dépôts publics.)*

---

## 11. Le merge — trois façons

| Type | Effet sur l'historique |
|------|------------------------|
| **Merge commit** | conserve toutes les branches (historique complet) |
| **Squash and merge** | tout est compressé en **un seul commit** (propre) |
| **Rebase and merge** | rejoue les commits à la suite, sans commit de merge |

Pour un cours ou un petit projet : **squash and merge** —
un commit propre par PR, historique lisible.

Après le merge : **supprimer la branche**.

---

## 12. La taille d'une PR

> Une PR **petite** est revue plus vite, plus soigneusement, et avec moins de conflits.

Repères issus de l'industrie :

- **Google (2018)** : les revues de moins de 200-400 lignes sont les plus efficaces ;
- une PR = **une idée** (une fonctionnalité, une correction) ;
- trop grosse ? → la **découper** en plusieurs PR successives.

Les PR énormes découragent le relecteur — et la revue devient superficielle.

---

## 13. Titre et description — les bonnes pratiques

**Titre** (impératif, court) :

```
Corrige le total quand le panier est vide
```

**Description** — le « dossier » de la PR :

- **Quoi** : ce que fait la PR, en une phrase ;
- **Pourquoi** : le problème résolu, le contexte ;
- **Comment** : les choix techniques importants ;
- **Tests** : ce qui a été vérifié, ce qui reste à vérifier.

C'est la première chose que lit le relecteur. Soignez-la.

---

## 14. Checklist de l'auteur — avant d'ouvrir la PR

- [ ] auto-revue du diff (Module 1) ;
- [ ] tests passent localement ;
- [ ] pas de code mort, pas de commentaire oublié ;
- [ ] titre et description complets ;
- [ ] PR petite et ciblée ;
- [ ] relecteurs désignés (si pertinent).

> Une PR propre, c'est du temps gagné pour le relecteur —
> et une revue de meilleure qualité pour vous.

---

## 15. Les conventions d'équipe

Une équipe formalise ses habitudes dans le dépôt :

- **PR template** : le corps de PR pré-rempli (c'est le cas dans ce cours) ;
- **labels** : `bug`, `wip`, `review me`… ;
- **assignee** : qui porte la PR ;
- **reviewers** : qui doit relire.

> La revue de code n'est pas qu'un outil :
> c'est un ensemble de **conventions** que l'équipe se donne.

---

## 16. Récapitulatif — le workflow complet

```
main ──► branche ──► commits ──► push ──► PR (titre + description)
   ▲                                      │
   │                                   review (checks + commentaires)
   └── merge ── approve ◄── corrections ◄┘
```

- `main` protégée, toujours déployable ;
- tout passe par une PR revue ;
- petite PR, description claire, réponse aux commentaires.

C'est **exactement** ce que vous ferez en TD.

---

## 17. Questions de compréhension

1. Pourquoi `main` doit-elle toujours rester déployable ?
2. Quelles sont les 6 étapes du GitHub Flow ?
3. Quelle est la différence entre *request changes* et *approve* ?
4. Quels sont les trois types de merge ? Lequel recommander pour un petit projet ?
5. Pourquoi une PR trop grosse est-elle un problème ?
6. Que contient une bonne description de PR ?
7. Que signifie « protéger la branche `main` » ? Donnez deux règles typiques.
8. Dans le diff d'une PR, que regardez-vous en premier ? Pourquoi ?

---

## Pour aller plus loin

- **Module 3** — que chercher dans une revue : la checklist, dans l'ordre de priorité
- **Module 4** — communiquer une revue : ton, feedback constructif, anti-patterns
- **TD** — mise en pratique immédiate du workflow (branche préfixée + PR vers `main`)
