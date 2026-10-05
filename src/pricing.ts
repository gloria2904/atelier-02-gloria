// Règles tarifaires de VenteFlash : une seule source de vérité,
// partagée par les commandes et par les devis.

// Taux de remise selon le type de client. Un type inconnu n'a aucune remise.
const DISCOUNT_RATE_BY_CUSTOMER_TYPE: ReadonlyMap<string, number> = new Map([
  ["PARTICULIER", 0.02],
  ["PRO", 0.05],
  ["VIP", 0.1],
]);

// Coefficient TVA (20 %) appliqué à un montant hors taxe.
export const VAT_MULTIPLIER = 1.2;

// Applique la remise du type de client à un montant hors taxe.
export function applyCustomerDiscount(ht: number, customerType: string): number {
  const rate = DISCOUNT_RATE_BY_CUSTOMER_TYPE.get(customerType) ?? 0;
  return ht - ht * rate;
}

// Convertit un montant hors taxe en toutes taxes comprises.
export function addVat(ht: number): number {
  return ht * VAT_MULTIPLIER;
}

// Un article de commande : [libellé, prix unitaire HT, quantité].
export type OrderItem = [string, number, number];

// Code promo unique pour l'instant : -10 % après la remise client.
const PROMO_CODE = "WELCOME10";
const PROMO_MULTIPLIER = 0.9;

// Frais de livraison (TTC) selon le mode choisi. Un mode inconnu ne coûte rien.
const SHIPPING_FEE_BY_MODE: ReadonlyMap<string, number> = new Map([
  ["STANDARD", 5.9],
  ["EXPRESS", 14.9],
  ["RETRAIT", 0],
]);

// Somme des lignes de la commande, hors taxe.
function computeSubtotal(items: OrderItem[]): number {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total = total + items[i][1] * items[i][2];
  }
  return total;
}

function applyPromoCode(ht: number, promo: string | null): number {
  if (promo != null && promo == PROMO_CODE) {
    return ht * PROMO_MULTIPLIER;
  }
  return ht;
}

// Total TTC d'une commande : sous-total, remise client, code promo, TVA, livraison.
export function computeOrderTtc(
  items: OrderItem[],
  customerType: string,
  shipping: string,
  promo: string | null
): number {
  let total = computeSubtotal(items);
  total = applyCustomerDiscount(total, customerType);
  total = applyPromoCode(total, promo);
  return addVat(total) + (SHIPPING_FEE_BY_MODE.get(shipping) ?? 0);
}
