export interface Order {
  id: string;
  userId: string;
  totalPrice: number;
  createdAt: string;
}

export interface OrderWithItems extends Order {
  orderItems: OrderItem[];
}

export interface OrderItem {
  id: string;
  quantity: number;
  product: {
    name: string;
    price: number;
  };
}
