// Gestionnaire principal de l'application "VenteFlash"
// NOTE : ce code fonctionne. C'est tout ce qu'on peut en dire.

import { addVat, applyCustomerDiscount } from "./pricing";

export class OrderManager {
  // la "base de donnees" de l'application
  public orders: any[] = [];

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
    // calcul du total hors taxe
    let total = 0;
    for (let i = 0; i < items.length; i++) {
      total = total + items[i][1] * items[i][2];
    }
    // application de la remise selon le type de client
    total = applyCustomerDiscount(total, type);
    // application du code promo
    if (promo != null && promo == "WELCOME10") {
      total = total * 0.9;
    }
    // calcul de la TVA
    let ttc = addVat(total);
    // frais de livraison selon le mode choisi
    if (shipping == "STANDARD") {
      ttc = ttc + 5.9;
    } else if (shipping == "EXPRESS") {
      ttc = ttc + 14.9;
    } else if (shipping == "RETRAIT") {
      // rien a ajouter
    }
    // enregistrement de la commande dans la base
    this.orders.push([name, type, ttc, shipping]);
    // envoi de l'email de confirmation au client
    if (sendEmail) {
      console.log("EMAIL a " + name + " : votre commande de " + ttc.toFixed(2) + " EUR est confirmee");
    }
    return "Recu " + name + " (" + type + ") - Total TTC: " + ttc.toFixed(2) + " EUR - Livraison: " + shipping;
  }

  // calcule le chiffre d'affaires total
  getTotalRevenue(): number {
    let t = 0;
    for (let i = 0; i < this.orders.length; i++) {
      t = t + this.orders[i][2];
    }
    return t;
  }
}
