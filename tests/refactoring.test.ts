import { OrderManager } from "../src/orderManager";
import { ReportGenerator } from "../src/reportGenerator";

// Filet de sécurité de l'atelier 2 : ces tests vérifient les règles
// que le refactoring doit préserver ou rendre explicites.

describe("DRY : une seule règle tarifaire", () => {
  test.each([
    ["PARTICULIER", 117.6],
    ["PRO", 114],
    ["VIP", 108],
    ["INCONNU", 120],
  ])("le devis et la commande donnent le même TTC pour %s", (type, ttc) => {
    const m = new OrderManager();
    m.processOrder("X", type, [["Article", 100, 1]], "RETRAIT", null, false);
    expect(m.getTotalRevenue()).toBeCloseTo(ttc, 2);
    expect(new ReportGenerator().estimateTtc(100, type)).toBeCloseTo(ttc, 2);
  });
});
