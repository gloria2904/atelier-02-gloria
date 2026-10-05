import { OrderManager } from "./orderManager";
import { addVat, applyCustomerDiscount } from "./pricing";

// genere les rapports pour la direction
export class ReportGenerator {
  generateHtml(manager: OrderManager): string {
    let html = "<h1>Rapport des ventes</h1><ul>";
    for (let i = 0; i < manager.orders.length; i++) {
      html = html + "<li>" + manager.orders[i][0] + " : " + manager.orders[i][2].toFixed(2) + " EUR</li>";
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
