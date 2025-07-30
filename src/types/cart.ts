export interface OrderItem {
  id: string;
  quantity: number;
  price?: number;
}

export interface CartItem extends OrderItem {
  name: string;
}

export interface CartStore {
  items: CartItem[];
  addItem: (item: { id: string; name: string }) => void;
  removeItem: (id: string) => void;
  increaseItem: (id: string) => void;
  decreaseItem: (id: string) => void;
  clearCart: () => void;
}
