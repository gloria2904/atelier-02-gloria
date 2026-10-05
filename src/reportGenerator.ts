import { OrderManager } from "./orderManager";

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
    // on applique la remise selon le type de client
    if (type == "PARTICULIER") {
      ht = ht - ht * 0.02;
    } else if (type == "PRO") {
      ht = ht - ht * 0.05;
    } else if (type == "VIP") {
      ht = ht - ht * 0.1;
    }
    // puis la TVA
    return ht * 1.2;
  }
}
