
export type OrderStatus = 'Pending' | 'Processing' | 'Completed' | 'Shipped' | 'Cancelled';

export interface Order {
  id: string;
  email: string;
  material: string;
  quantity: number;
  deadline: string;
  file_url?: string;
  status: OrderStatus;
  created_at: string;
  manufacturer?: string; // New field for assignment
}

export type ViewType = 'customer_form' | 'customer_orders' | 'admin_dashboard' | 'manufacturer_dashboard';
