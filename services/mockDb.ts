
import { Order, OrderStatus } from '../types';

// Initial Mock Data
let orders: Order[] = [
  {
    id: '1',
    email: 'test@example.com',
    material: 'PLA (Matte Black)',
    quantity: 50,
    deadline: '2024-12-01',
    status: 'Pending',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    email: 'admin@forgeflow.com',
    material: 'PETG (Translucent)',
    quantity: 10,
    deadline: '2024-11-20',
    status: 'Processing',
    created_at: new Date().toISOString(),
    manufacturer: 'TechLabs 3D'
  }
];

export const mockDb = {
  getOrders: async (): Promise<Order[]> => {
    return [...orders].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },
  
  getOrdersByEmail: async (email: string): Promise<Order[]> => {
    return orders.filter(o => o.email.toLowerCase() === email.toLowerCase());
  },

  getOrdersByManufacturer: async (manufacturerName: string): Promise<Order[]> => {
    return orders.filter(o => o.manufacturer?.toLowerCase() === manufacturerName.toLowerCase());
  },
  
  createOrder: async (orderData: Omit<Order, 'id' | 'created_at' | 'status'>): Promise<Order> => {
    const newOrder: Order = {
      ...orderData,
      id: Math.random().toString(36).substr(2, 9),
      status: 'Pending',
      created_at: new Date().toISOString()
    };
    orders.push(newOrder);
    return newOrder;
  },
  
  updateOrderStatus: async (id: string, status: OrderStatus): Promise<Order | null> => {
    const orderIndex = orders.findIndex(o => o.id === id);
    if (orderIndex === -1) return null;
    orders[orderIndex].status = status;
    return orders[orderIndex];
  },

  assignManufacturer: async (id: string, manufacturer: string): Promise<Order | null> => {
    const orderIndex = orders.findIndex(o => o.id === id);
    if (orderIndex === -1) return null;
    orders[orderIndex].manufacturer = manufacturer;
    return orders[orderIndex];
  }
};
