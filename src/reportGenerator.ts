import { Order } from "./orderRepository";
import { addVat, applyCustomerDiscount } from "./pricing";

// Port : ce dont le rapport a besoin pour lire les ventes.
// OrderManager le satisfait, tout comme un faux dans les tests.
export interface SalesSource {
  getOrders(): readonly Order[];
  getTotalRevenue(): number;
}

// genere les rapports pour la direction
export class ReportGenerator {
  generateHtml(manager: SalesSource): string {
    let html = "<h1>Rapport des ventes</h1><ul>";
    const orders = manager.getOrders();
    for (let i = 0; i < orders.length; i++) {
      html = html + "<li>" + orders[i].name + " : " + orders[i].ttc.toFixed(2) + " EUR</li>";
    }
    html = html + "</ul><p>Total: " + manager.getTotalRevenue().toFixed(2) + " EUR</p>";
    return html;
  }

  // estime le TTC d'un devis (avant commande)
  estimateTtc(ht: number, type: string): number {
    // remise selon le type de client, puis TVA
    return addVat(applyCustomerDiscount(ht, type));
  }
}
