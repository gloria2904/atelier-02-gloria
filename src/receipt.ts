// Mise en forme du reçu de commande remis au client.
export function formatReceipt(name: string, type: string, ttc: number, shipping: string): string {
  return "Recu " + name + " (" + type + ") - Total TTC: " + ttc.toFixed(2) + " EUR - Livraison: " + shipping;
}
