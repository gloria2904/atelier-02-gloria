// Une commande enregistrée.
export interface Order {
  name: string;
  type: string;
  ttc: number;
  shipping: string;
}

// Port : ce dont le métier a besoin pour conserver les commandes.
// Les détails techniques (mémoire, base SQL, API...) s'y branchent.
export interface OrderRepository {
  save(order: Order): void;
  findAll(): readonly Order[];
}

// Adaptateur par défaut : stockage en mémoire.
export class InMemoryOrderRepository implements OrderRepository {
  private readonly orders: Order[] = [];

  save(order: Order): void {
    this.orders.push(order);
  }

  findAll(): readonly Order[] {
    return this.orders;
  }
}
