# Travaux dirigés — Revue de code

Les TD se déroulent **entièrement sur GitHub**, avec le workflow industriel :
*branche → pull request → revue → corrections*. Chaque TD expose une branche
de code à revoir ; l'étudiant rend sa revue sous forme de **pull request** sur
le dépôt du cours.

## Le principe, TD par TD

1. L'enseignant publie une branche `tdN` contenant **le code à revoir** et
   l'énoncé (`tdN/README.md`).
2. L'étudiant **forke** le dépôt du cours (le fork copie toutes les branches).
3. L'étudiant crée sa branche de travail **depuis la branche du TD**.
4. L'étudiant ouvre une **pull request** de son fork vers la branche
   principale du dépôt du cours : le code à revoir apparaît dans le diff.
5. L'étudiant **annote** le code : un commentaire en ligne par problème
   (commentaires de revue sur le diff).
6. L'étudiant **propose des corrections** : de nouveaux commits sur sa
   branche qui améliorent le code.
7. Le corps de la PR résume la revue (modèle fourni automatiquement).
8. La PR reste ouverte : c'est le « rendu ». L'enseignant note, la liste des
   PR ouvertes indique qui a rendu.

## Côté étudiant — les commandes

```sh
# 1. Forker le dépôt depuis github.com (bouton « Fork »)

# 2. Cloner son fork
git clone https://github.com/<pseudo>/revues-de-code.git
cd revues-de-code

# 3. Récupérer la branche du TD et créer sa branche de travail
git fetch origin
git checkout -b td1-<pseudo> origin/td1

# 4. Travailler : annoter le code sur github.com (PR) puis corriger
#    (modifier les fichiers, puis :)
git add .
git commit -m "TD1 : corrections proposées (liste des problèmes corrigés)"
git push origin td1-<pseudo>

# 5. Ouvrir la PR depuis github.com : votre branche  →  branche principale
#    du dépôt du cours. Compléter le corps avec le modèle fourni.
```

Conseil : la branche du TD peut évoluer (correctifs d'énoncé). Pour la
récupérer : `git fetch origin && git merge origin/td1` sur votre branche.

## Consignes transverses (chaque TD)

- Le **corps de la PR** décrit votre revue : utilisez le modèle fourni.
- **Un commentaire = un problème**, posé sur la bonne ligne du diff.
- Les commentaires suivent les **attitudes du Module 1** : sur le code, pas
  sur la personne ; expliquer le *pourquoi* ; suggérer, ne pas imposer.
- Appliquez la **checklist de revue** ([`templates/checklist-revue.md`](../templates/checklist-revue.md)).
- Nommez la PR : `TD1 – <pseudo> – revue de <fichiers>`.
- Laissez la PR **ouverte** jusqu'à la correction.

## Suivi des rendus (côté enseignant)

```sh
scripts/check-submissions.sh            # liste des PR ouvertes = qui a rendu
scripts/check-submissions.sh <org/repo> # autre dépôt
```

## Grille de notation (évaluation manuelle)

| Critère | Points |
|---------|--------|
| Commentaires pertinents (vrai problème identifié) | /4 |
| Commentaires justifiés (le *pourquoi* est expliqué) | /3 |
| Corrections proposées (réelles, pas cosmétiques) | /4 |
| Ton constructif (sur le code, suggestions) | /2 |
| Complétude (checklist couverte, cas limites vus) | /3 |
| Corps de PR clair (contexte, choix, difficultés) | /2 |
| Réponses aux commentaires (si applicable) | /2 |

Les énoncés de chaque TD vivent sur leur branche (`td1/README.md`, `td2/…`).
