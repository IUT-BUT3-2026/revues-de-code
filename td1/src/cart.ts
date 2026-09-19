/**
 * TD1 — Code à revoir : la caisse du magasin.
 *
 * Ce fichier contient volontairement plusieurs problèmes (logique, typage,
 * lisibilité, conception). À vous de les identifier en commentaires de
 * revue, puis d'en corriger au moins trois.
 */

interface Item {
  name: string;
  price: number;
  qty: number;
}

const TAX_RATE = 0.2;

// Calcule le total TTC du panier
export function total(cart: Item[]): number {
  let sum = 0;
  for (const item of cart) {
    // Rien n'empêche qu'un item.price et item.qty soit négatif
    // Le total peut devenir négatif ou faux
    // Correction : 
    //if (item.price < 0 || item.qty < 0 || Number.isNaN(item.price) || Number.isNaN(item.qty)) {
      //throw new Error("Prix ou quantité invalide");
    //}
    sum += item.price * item.qty;
  }
  return sum + sum * TAX_RATE;
}

// Formate un prix en euros
export function formatPrice(value: number): string {
  return value.toFixed(2) + " €";
}

// Encaisse le panier : affiche le total et prépare le paiement
export function checkout(cart: Item[]) {
  //if (cart.length === 0) {
  // Prévient dans le cas où cart est null ou undefined
  if (!Array.isArray(cart) || cart.length === 0) {
    //console.log("Panier vide");
    // Retourne un objet plutôt qu'un message sur la console
    return {
      ok: false,
      message : "Panier vide"
    };
  }
  const t = total(cart);
  // console.log("Total à payer : " + formatPrice(t));
  // TODO: intégrer le paiement
  // Retourne un objet plutôt qu'un message sur la console
  return {
    ok: true,
    t,
    // La chaîne est entourée de guillemets doubles "...", pas de backticks `...`. 
    // Donc ${formatPrice(t)} n'est pas remplacé par le vrai montant
    // En plus il manque le guillemet fermant donc ce fichier ne compile pas du tout
    // Correction : message: `Total à payer : ${formatPrice(t)}`
    message: "Total à payer : ${formatPrice(t)}
  };
}


