import { Notifier } from "../src/notifier";
import { OrderManager } from "../src/orderManager";
import { InMemoryOrderRepository, Order, OrderRepository } from "../src/orderRepository";
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

describe("DIP : le stockage est injecté", () => {
  test("OrderManager enregistre les commandes dans le dépôt fourni", () => {
    const saved: Order[] = [];
    const fakeRepository: OrderRepository = {
      save: (order) => { saved.push(order); },
      findAll: () => saved,
    };
    const m = new OrderManager(fakeRepository);
    m.processOrder("Eve", "PRO", [["A", 100, 1]], "RETRAIT", null, false);
    expect(saved).toEqual([{ name: "Eve", type: "PRO", ttc: 114, shipping: "RETRAIT" }]);
    expect(m.getTotalRevenue()).toBeCloseTo(114, 2);
  });

  test("deux gestionnaires avec des dépôts différents ne partagent rien", () => {
    const a = new OrderManager(new InMemoryOrderRepository());
    const b = new OrderManager(new InMemoryOrderRepository());
    a.processOrder("A", "PRO", [["X", 10, 1]], "RETRAIT", null, false);
    expect(b.getOrders()).toHaveLength(0);
  });
});

describe("DIP : la notification est injectée", () => {
  const makeSpy = () => {
    const calls: [string, number][] = [];
    const notifier: Notifier = { orderConfirmed: (name, ttc) => { calls.push([name, ttc]); } };
    return { calls, notifier };
  };

  test("le client est prévenu quand sendEmail est vrai", () => {
    const { calls, notifier } = makeSpy();
    const m = new OrderManager(new InMemoryOrderRepository(), notifier);
    m.processOrder("Fay", "PRO", [["A", 100, 1]], "RETRAIT", null, true);
    expect(calls).toEqual([["Fay", 114]]);
  });

  test("personne n'est prévenu quand sendEmail est faux", () => {
    const { calls, notifier } = makeSpy();
    const m = new OrderManager(new InMemoryOrderRepository(), notifier);
    m.processOrder("Gus", "PRO", [["A", 100, 1]], "RETRAIT", null, false);
    expect(calls).toHaveLength(0);
  });

  test("par défaut, le message part dans la console", () => {
    const log = jest.spyOn(console, "log").mockImplementation(() => {});
    new OrderManager().processOrder("Hana", "PRO", [["A", 100, 1]], "RETRAIT", null, true);
    expect(log).toHaveBeenCalledWith("EMAIL a Hana : votre commande de 114.00 EUR est confirmee");
    log.mockRestore();
  });
});
