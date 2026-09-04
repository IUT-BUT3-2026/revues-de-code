# Installation de votre environnement : Node.js et npm

Ce document vous aide à installer Node.js et npm sur votre machine, pour les
travaux pratiques et vos projets en TypeScript.

---

## 1. C'est quoi Node.js ?

JavaScript est le langage du web : il s'exécute dans le navigateur. **Node.js**
est un *moteur d'exécution* (runtime) qui permet d'exécuter du JavaScript
**en dehors du navigateur**, directement sur votre machine.

Il sert à beaucoup de choses :

- écrire des serveurs web et des API ;
- exécuter des **outils de développement** : compilateurs TypeScript,
  linters, bundlers, frameworks de test (Vitest, Jest…) ;
- écrire des scripts d'automatisation.

Pour ce cours, Node.js vous permet de compiler et d'exécuter le code
TypeScript et de faire tourner les outils associés.

**LTS** (Long Term Support) : la version stable recommandée, maintenue
longtemps. C'est elle qu'il faut installer.

## 2. C'est quoi npm ?

**npm** (*Node Package Manager*) est le **gestionnaire de paquets** de
Node.js — il est fourni automatiquement avec Node.js (pas d'installation
séparée).

- Un *paquet* est une bibliothèque ou un outil réutilisable (ex. un framework
  de test, un linter).
- npm permet d'en **installer**, de les **mettre à jour** et de les
  **supprimer** dans votre projet.
- C'est le plus grand registre de logiciels au monde : plus de 2 millions de
  paquets.

Les commandes essentielles :

```sh
npm init -y        # crée le fichier package.json (description du projet)
npm install <paquet>   # ajoute un paquet au projet
npm run <script>   # exécute un script défini dans package.json
```

Le fichier **`package.json`** est le « carnet de bord » du projet : il liste
les dépendances et les scripts. Tout projet npm en possède un.

---

## 3. Vérifier si Node est déjà installé

Ouvrez un terminal (PowerShell sous Windows, Terminal sous macOS/Linux) et
tapez :

```sh
node --version
npm --version
```

- Si les deux commandes répondent (ex. `v22.x.x` et `10.x.x`) :
  **c'est déjà bon**, passez à la section 6.
- Si « commande introuvable » : installez Node selon votre système.

---

## 4. Windows

**Méthode recommandée — l'installeur officiel :**

1. Télécharger la version **LTS** sur <https://nodejs.org> (fichier `.msi`).
2. L'exécuter, puis cliquer « Next » jusqu'à la fin (garder les options par
   défaut, notamment *Add to PATH*).
3. **Fermer puis rouvrir** le terminal (PowerShell), puis vérifier :

```powershell
node --version
npm --version
```

**Alternative — via winget :**

```powershell
winget install OpenJS.NodeJS.LTS
```

**Pour les curieux** : `nvm-windows` permet de gérer plusieurs versions de
Node sur la même machine (<https://github.com/coreybutler/nvm-windows>).

---

## 5. Linux et macOS

### macOS

- **Option 1 — installeur officiel :** télécharger la version **LTS** sur
  <https://nodejs.org> (fichier `.pkg`) et l'exécuter.
- **Option 2 — Homebrew :**

  ```sh
  brew install node
  ```

### Linux (Debian / Ubuntu et dérivés)

- **Recommandé — nvm** (Node Version Manager) : permet d'installer la version
  de votre choix, sans `sudo`, et de changer de version facilement. Suivre
  les instructions de <https://github.com/nvm-sh/nvm> (la commande
  d'installation est un `curl … | bash`), puis :

  ```sh
  nvm install --lts
  nvm use --lts
  ```

- **Simple mais parfois daté — apt :** les paquets `nodejs` et `npm`
  d'Ubuntu/Debian peuvent être **plus anciens** que la dernière LTS. Si vous
  choisissez cette option, vérifiez les versions obtenues.

### Vérification (après n'importe quelle méthode)

```sh
node --version   # ex. v22.x.x
npm --version    # ex. 10.x.x
```

---

## 6. Premiers pas dans un projet

Dans le dossier de votre projet :

```sh
npm init -y        # crée package.json
npm install        # installe les dépendances listées dans package.json
npm test           # exécute le script "test" du projet (s'il existe)
npm run dev        # exécute le script "dev" (s'il existe)
```

Si une commande inconnue apparaît dans `package.json` (ex. `npm run lint`),
c'est que le projet définit ce script — `npm run <nom>` l'exécute.

---

## 7. En cas de problème

| Problème | Solution |
|----------|----------|
| « node n'est pas reconnu » juste après l'installation | Fermer et rouvrir le terminal : le `PATH` se met à jour au redémarrage |
| Plusieurs versions de Node cohabitent | Utiliser `nvm` (Linux/macOS) ou `nvm-windows` pour choisir la version active |
| Téléchargements npm bloqués (proxy d'école / entreprise) | `npm config set proxy http://<hote>:<port>` et `npm config set https-proxy http://<hote>:<port>` (renseignements auprès de l'administrateur) |
| Version trop ancienne (npm affiche un avertissement) | Réinstaller la version LTS la plus récente |
