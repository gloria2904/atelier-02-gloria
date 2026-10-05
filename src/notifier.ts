// Port : ce dont le métier a besoin pour prévenir le client.
// L'envoi réel (email, SMS...) s'y branche.
export interface Notifier {
  orderConfirmed(customerName: string, ttc: number): void;
}

// Adaptateur par défaut : affiche le message dans la console.
export class ConsoleNotifier implements Notifier {
  orderConfirmed(customerName: string, ttc: number): void {
    console.log("EMAIL a " + customerName + " : votre commande de " + ttc.toFixed(2) + " EUR est confirmee");
  }
}
