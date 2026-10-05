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
