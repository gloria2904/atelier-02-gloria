// utilitaires generiques (concus pour etre reutilisables dans de futurs projets)

export function convertCurrency(
  amount: number,
  from: string,
  to: string,
  rateProvider?: unknown,
  cache?: Map<string, number>,
  retries?: number
): number {
  // TODO: brancher un vrai fournisseur de taux quand on sera a l'international
  return amount; // pour l'instant on ne gere que l'EUR
}

// ancien format de date, garde au cas ou
export function oldFormatDate(d: Date): string {
  return d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
}
