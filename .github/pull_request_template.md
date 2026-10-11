## Groupe

- **Préfixe :** 2026-IUT-BUT3-RECAN
- [x] `ETUDIANTS.md` rempli à la racine (membres + pseudos GitHub)
- [x] Titre de la PR préfixé : `2026-IUT-BUT3-RECAN — TD1 — revue de Product.ts`

## Revue de code — TD

### Fichiers relus

- `td/Product.ts`
- `td/Product.test.ts`

### Problèmes identifiés (résumé)

| # | Fichier | Problème | Gravité | Commentaire en ligne |
|---|---------|----------|---------|----------------------|
| 1 | `td/Product.ts` | Abréviations cryptiques (`st`, `wh`, `qty`, etc.) | Mineure | Dans la PR |
| 2 | `td/Product.ts` | Paramètre mort `region` dans `deprecate()` | Mineure | Dans la PR |
| 3 | `td/Product.ts` | Commentaires mensongers / désynchronisés dans `addImage()` | Mineure | Dans la PR |
| 4 | `td/Product.ts` | Nombres magiques (pourcentages par défaut dans `Price`) | Mineure | Dans la PR |
| 5 | `td/Product.ts` | Paramètre mort `overwrite` dans `addImage()` | Mineure | Dans la PR |
| 6 | `td/Product.ts` | Non-null assertion `!` cachant un `null` potentiel (`warehouse`) | Majeure | Dans la PR |
| 7 | `td/Product.ts` | Cast `as Status` et type widening inutile | Mineure | Dans la PR |
| 8 | `td/Product.ts` | Pyramide de `if/else` dans `getDisplayLabel()` | Mineure | Dans la PR |
| 9 | `td/Product.ts` | Arrow code & redondance dans `addDiscount()` | Majeure | Dans la PR |
| 11 | `td/Product.test.ts` | Test flaky lié au timing dans `addDiscount()` | Majeure | Dans la PR |
| 12 | `td/Product.ts` | Variables locales promues en champs de classe (`nextStatus`, etc.) | Mineure | Dans la PR |
| 13 | `td/Product.ts` | `Error` générique au lieu d'erreurs typées (`DomainRuleError`, `ValidationError`) | Majeure | Dans la PR |
| 14 | `td/Product.ts` | Duplication de la notification des fournisseurs | Mineure | Dans la PR |
| 15 | `td/Product.ts` | Floating promise non awaitée | Majeure | Dans la PR |
| 18 | `td/Product.ts` | Ré-implémentation du calcul de prix au lieu de déléguer à `Price` | Mineure | Dans la PR |
| 20 | `td/Product.ts` | Désynchronisation entre la Map mémoire et la table de jointure | Majeure | Dans la PR |
| 21 | `td/Product.ts` | Primitive obsession sur le cycle de vie du statut | Majeure | Dans la PR |
| 22 | `td/Product.ts` | Mutation mémoire avant écriture base de données (pas de rollback) | Majeure | Dans la PR |
| 23 | `td/Product.ts` | Fuite mémoire : tableau de notifications croissant sans drain | Majeure | Dans la PR |
| 24 | `td/Product.ts` | Feature envy : `Product` construit et envoie les emails directement | Majeure | Dans la PR |

### Corrections proposées

- Extraction de classes d'erreur dédiées (`ValidationError`, `DomainRuleError`) pour typer les échecs métier.
- Remplacement des pyramides de conditions par des guard clauses avec early returns.
- Délégation du calcul de marge/TVA directement à [`Price`]
- Extraction de [`NotificationService`] pour gérer l'ajout, l'envoi et la purge (`drain()`) des notifications.
- Sécurisation des transitions de statut (interdiction de transitionner depuis `deprecated`).
- Persistance en base avant mutation de l'état mémoire pour éviter les désynchronisations en cas d'erreur Prisma.

### Points de discussion / questions

- Faut-il aller jusqu'au smell 25 (déplacement complet des appels Prisma dans un repository dédié) ou la séparation `NotificationService` + `Price` suffit-elle pour ce jalon ?

### Difficultés rencontrées

- Résolution de la race condition / test flaky sur `addDiscount()`.
