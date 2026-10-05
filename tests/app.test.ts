import { OrderManager } from "../src/orderManager";
import { ReportGenerator } from "../src/reportGenerator";

// Tests de caracterisation : ils decrivent le comportement ACTUEL.
// Regle d'or de tous les ateliers : ces tests restent au vert.

describe("OrderManager", () => {
  test("commande particulier, livraison standard", () => {
    const m = new OrderManager();
    const recu = m.processOrder("Alice", "PARTICULIER", [["Clavier", 50, 2]], "STANDARD", null, false);
    // 100 HT -2% = 98 ; TTC = 117.6 ; + 5.9 = 123.5
    expect(recu).toBe("Recu Alice (PARTICULIER) - Total TTC: 123.50 EUR - Livraison: STANDARD");
  });

  test("commande VIP avec code promo, retrait", () => {
    const m = new OrderManager();
    const recu = m.processOrder("Bob", "VIP", [["Ecran", 200, 1]], "RETRAIT", "WELCOME10", false);
    // 200 -10% = 180 ; -10% promo = 162 ; TTC = 194.4
    expect(recu).toBe("Recu Bob (VIP) - Total TTC: 194.40 EUR - Livraison: RETRAIT");
  });

  test("commande PRO express", () => {
    const m = new OrderManager();
    m.processOrder("Carla", "PRO", [["Souris", 20, 5]], "EXPRESS", null, false);
    // 100 -5% = 95 ; TTC = 114 ; +14.9 = 128.9
    expect(m.getTotalRevenue()).toBeCloseTo(128.9, 2);
  });

  test("le chiffre d'affaires cumule les commandes", () => {
    const m = new OrderManager();
    m.processOrder("A", "PARTICULIER", [["X", 10, 1]], "RETRAIT", null, false);
    m.processOrder("B", "PARTICULIER", [["Y", 10, 1]], "RETRAIT", null, false);
    expect(m.getTotalRevenue()).toBeCloseTo(23.52, 2); // 2 x 11.76
  });
});

describe("ReportGenerator", () => {
  test("le rapport HTML liste les commandes et le total", () => {
    const m = new OrderManager();
    m.processOrder("Alice", "PARTICULIER", [["Clavier", 50, 2]], "RETRAIT", null, false);
    const html = new ReportGenerator().generateHtml(m);
    expect(html).toContain("<li>Alice : 117.60 EUR</li>");
    expect(html).toContain("Total: 117.60 EUR");
  });

  test("l'estimation de devis applique remise puis TVA", () => {
    expect(new ReportGenerator().estimateTtc(100, "PRO")).toBeCloseTo(114, 2);
  });
});
