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

describe("SRP : le calcul du prix", () => {
  test("le code promo s'applique après la remise client, puis TVA et livraison", () => {
    const m = new OrderManager();
    m.processOrder("X", "PRO", [["A", 10, 2], ["B", 5, 4]], "EXPRESS", "WELCOME10", false);
    // 40 HT -5% = 38 ; -10% promo = 34.2 ; TTC = 41.04 ; +14.9 = 55.94
    expect(m.getTotalRevenue()).toBeCloseTo(55.94, 2);
  });

  test("un code promo inconnu et un mode de livraison inconnu n'ajoutent rien", () => {
    const m = new OrderManager();
    m.processOrder("X", "VIP", [["A", 100, 1]], "DRONE", "NOPE", false);
    expect(m.getTotalRevenue()).toBeCloseTo(108, 2);
  });
});

describe("SRP : le reçu", () => {
  test("le reçu est mis en forme avec deux décimales", () => {
    const m = new OrderManager();
    const recu = m.processOrder("Dana", "VIP", [["A", 1, 1]], "EXPRESS", null, false);
    expect(recu).toBe("Recu Dana (VIP) - Total TTC: 15.98 EUR - Livraison: EXPRESS");
  });
});
