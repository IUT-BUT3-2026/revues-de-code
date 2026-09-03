# Checklist de revue

À garder sous les yeux pendant chaque revue. Quand un point pose problème,
le signaler dans un **commentaire en ligne**, en expliquant le *pourquoi* et
en suggérant une correction.

## 1. Comportement et logique

- [ ] Le code fait ce que son nom annonce
- [ ] Cas limites traités : valeurs vides, `null`/`undefined`, valeurs
      extrêmes, négatives, `NaN`
- [ ] Pas de valeurs magiques (nombres / chaînes en dur non expliqués)
- [ ] Erreurs gérées : pas de `try/catch` silencieux, pas d'échec muet

## 2. TypeScript

- [ ] Pas de `any` superflu — les types sont précis et utiles
- [ ] `null`/`undefined` maîtrisés (strict mode, narrowing)
- [ ] `async/await` correct : promesses gérées, pas de « floating promise »
- [ ] Signatures de fonctions explicites (paramètres et retour typés)

## 3. Lisibilité et maintenabilité

- [ ] Noms explicites (variables, fonctions, paramètres)
- [ ] Fonctions courtes, une seule responsabilité
- [ ] Pas de duplication évitable
- [ ] Commentaires utiles (le *pourquoi*, pas le *quoi*)

## 4. Tests

- [ ] Tests pour le comportement principal
- [ ] Cas limites testés (pas seulement le chemin heureux)

## 5. Sécurité (selon le TD)

- [ ] Pas de secret / clé API / mot de passe dans le code
- [ ] Entrées utilisateur validées
- [ ] Pas de dépendance inutile ou dangereuse

## Ordre de priorité (Module 3)

1. **Bugs et logique** → 2. **Design et lisibilité** → 3. **Style** (le style
   se règle de toute façon par le linter).
