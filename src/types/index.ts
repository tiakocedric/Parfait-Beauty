export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  icon: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category_id: string;
  category?: Category; // Pour les jointures
  image_url: string;
  created_at?: string;
  updated_at?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  quantity: number;
  price: number;
}