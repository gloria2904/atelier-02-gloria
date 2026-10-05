// Gestionnaire principal de l'application "VenteFlash"
// NOTE : ce code fonctionne. C'est tout ce qu'on peut en dire.

import { ConsoleNotifier, Notifier } from "./notifier";
import { InMemoryOrderRepository, Order, OrderRepository } from "./orderRepository";
import { computeOrderTtc } from "./pricing";
import { formatReceipt } from "./receipt";

export class OrderManager {
  // stockage et notification sont fournis de l'exterieur (injection de dependance)
  constructor(
    private readonly repository: OrderRepository = new InMemoryOrderRepository(),
    private readonly notifier: Notifier = new ConsoleNotifier()
  ) {}

  // les commandes enregistrees, en lecture seule
  getOrders(): readonly Order[] {
    return this.repository.findAll();
  }

  // instance globale, pratique pour y acceder de partout
  public static instance: OrderManager | null = null;
  static getInstance(): OrderManager {
    if (OrderManager.instance == null) {
      OrderManager.instance = new OrderManager();
    }
    return OrderManager.instance;
  }

  // traite une commande et retourne le recu
  processOrder(
    name: string,
    type: string,
    items: [string, number, number][], // [libelle, prix unitaire, quantite]
    shipping: string,
    promo: string | null,
    sendEmail: boolean
  ): string {
    // calcul du total TTC (remise, promo, TVA, livraison)
    const ttc = computeOrderTtc(items, type, shipping, promo);
    // enregistrement de la commande dans la base
    this.repository.save({ name, type, ttc, shipping });
    // envoi de l'email de confirmation au client
    if (sendEmail) {
      this.notifier.orderConfirmed(name, ttc);
    }
    return formatReceipt(name, type, ttc, shipping);
  }

  // calcule le chiffre d'affaires total
  getTotalRevenue(): number {
    let t = 0;
    const orders = this.repository.findAll();
    for (let i = 0; i < orders.length; i++) {
      t = t + orders[i].ttc;
    }
    return t;
  }
}
