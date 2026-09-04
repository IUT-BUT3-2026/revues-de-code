# Journal des décisions de spécification — kata RPG Combat

Comportements bloqués en phase THINK, story « Damage and Health »
(`kata/rpg-combat.md`) : impossible de formuler une assertion sans trancher
un point que la spec ne précise pas. Voir `.claude/skills/tdd-agentic`.

**Q1, Q2 et Q3 sont désormais tranchées et implémentées** (voir statuts
ci-dessous). Toute la story « Damage and Health » est couverte.

**Story « Levels » en cours** — Level (départ 1), plafond de santé 1500 au
niveau 6, modificateurs de dégâts ±50% selon l'écart de niveau sont
implémentés. Une question latente (Q4, non encore bloquante) est notée
ci-dessous.

---

## Q1 — Un personnage ne peut pas s'infliger de dégâts à lui-même

**Spec en cause :** *« A Character cannot Deal Damage to itself »*
**Cas d'entrée problématique :** `character.dealDamage(character, amount)`

Impossible de poser l'ASSERT : la spec dit *que* c'est interdit, pas ce qui
est **observable** quand on tente l'action.

**Interprétations candidates :**

| # | Comportement | Conséquences |
|---|---|---|
| A | No-op silencieux : `health` inchangé, pas d'erreur | Simple, mais masque l'erreur d'appel côté code appelant (bug silencieux) |
| B | Lève une exception (ex. `Error("Cannot deal damage to self")`) | Feedback immédiat 🍀 (cohérent avec la phase THINK/ACT du skill) ; oblige l'appelant à gérer le cas |
| C | Retourne un résultat (`{ success: false }`) au lieu de `void` | Évite l'exception, mais change la signature de `dealDamage` (impacte le comportement déjà testé au cycle 3-4, qui suppose `void`) |

**Recommandation :** B — lever une exception. Cohérent avec le principe du
skill *« Est-ce que des exceptions sont levées alors que je ne les
attendais pas ? feedback immédiat »* : ici l'exception est **attendue**, ce
qui est le signal le plus net et le moins ambigu à tester (`expect(() =>
...).toThrow()`), sans changer la signature déjà validée par les tests
existants.

**Statut :** ✅ **tranché par l'humain (2026-09-04) : option B — exception.**
Implémenté (cycle think-red-green-refactor complet) : `dealDamage` lève
`Error("A character cannot deal damage to itself")` quand la cible est
`this`, vérifié en garde avant `receiveDamage`.

---

## Q2 — Un personnage mort ne peut pas se soigner

**Spec en cause :** *« Dead characters cannot heal »*
**Cas d'entrée problématique :** `deadCharacter.heal(amount)`

Même blocage que Q1 : « ne peut pas » n'indique pas l'effet observable.

**Interprétations candidates :**

| # | Comportement | Conséquences |
|---|---|---|
| A | No-op silencieux : `health` reste à 0 | Cohérent avec « mort = 0, reste 0 » mais masque un appel invalide |
| B | Lève une exception | Cohérent avec Q1-B si cette réponse est retenue (même politique d'erreur dans tout le domaine) |
| C | Retourne un booléen de succès | Même réserve que Q1-C (changement de signature) |

**Recommandation :** B, pour la même raison que Q1, **et par cohérence** :
adopter la même politique d'erreur (exception) pour toutes les actions
interdites du domaine (auto-dégât, soin d'un mort) plutôt que de mélanger
les styles selon le cas.

**Statut :** ✅ **tranché par l'humain (2026-09-04) : option B — exception**
(cohérent avec Q1). Implémenté (cycle think-red-green-refactor complet) :
`heal` lève `Error("A dead character cannot heal")` quand `!isAlive`,
vérifié en garde avant l'application du soin.

---

## Q3 — Plafond de soin au-delà de 1000

**Spec en cause :** *« Health, starting at 1000 »* + *« A Character can Heal
themselves »* — aucun plafond de santé maximale n'est mentionné.
**Cas d'entrée problématique :** `character.heal(amount)` quand
`character.health + amount > 1000`.

**Interprétations candidates :**

| # | Comportement | Conséquences |
|---|---|---|
| A | Plafonné à 1000 (health max implicite = health de départ) | Cohérent avec les RPG classiques, mais **1000 n'est jamais présenté comme un maximum** dans la spec — seulement comme la valeur de départ |
| B | Pas de plafond : `health` peut dépasser 1000 | Fidèle au texte strict de la spec, mais contre-intuitif pour un jeu de rôle |
| C | Plafond configurable (`maxHealth`, par défaut 1000) | Sur-conception non demandée par la spec actuelle — écarté (YAGNI) |

**Recommandation :** A — plafonner à 1000. C'est l'hypothèse la plus sûre
pour un système de combat (évite l'inflation de vie via le soin, qui
casserait l'équilibre du jeu), mais **ce n'est pas écrit** dans la spec :
décision à valider avant implémentation, pas déduite silencieusement.

**Statut :** ✅ **tranché par l'humain (2026-09-04) : option A — plafond à
1000.** Implémenté (cycle think-red-green-refactor complet) :
`Character.heal` plafonne `currentHealth` à `MAX_HEALTH` via `Math.min`.
Renommage `STARTING_HEALTH` → `MAX_HEALTH` en phase REFACTOR, la constante
portant désormais les deux rôles (valeur de départ = plafond).

---

## Q4 (latente, non bloquante) — Arrondi des dégâts modifiés par l'écart de niveau

**Spec en cause :** *« Damage is reduced/increased by 50% »* — aucun cas
testé jusqu'ici ne produit de valeur non entière (100 × 0.5 = 50,
100 × 1.5 = 150, tous ronds).

**Cas d'entrée qui la déclencherait :** un montant de dégâts impair avec un
modificateur actif, ex. `dealDamage(target, 101)` avec écart de niveau ≥ 5
→ `50.5`. `Character.health` accepte aujourd'hui des `number` non entiers
sans contrainte — le comportement actuel (pas d'arrondi) reste cohérent
tant qu'aucun test n'exige un entier.

**Statut :** non bloquante — aucun comportement de la spec ne force
actuellement ce cas. **Si un futur cycle introduit un montant de dégâts
non multiple de 2, remonter la question avant de choisir un arrondi**
(`Math.round`, `Math.floor`, ou valeurs décimales assumées) : ne pas
trancher silencieusement à ce moment-là.

---

## Comportements implémentés

- Health démarre à 1000.
- Un personnage démarre Alive.
- `attacker.dealDamage(target, amount)` réduit `target.health`.
- Des dégâts qui dépassent `health` amènent `health` à 0 et `isAlive` à
  `false`.
- `character.heal(amount)` augmente `character.health`, plafonné à 1000
  (Q3).
- `character.dealDamage(character, amount)` lève une exception (Q1).
- Un personnage mort (`!isAlive`) qui appelle `heal` lève une exception
  (Q2).
- Un personnage démarre au niveau 1.
- Le plafond de santé passe à 1500 à partir du niveau 6 (en dessous : 1000).
- Les dégâts sont réduits de 50% si la cible a un niveau ≥ attaquant+5, et
  augmentés de 50% si la cible a un niveau ≤ attaquant-5.
