/**
 * API Service Layer for SaaS Multi-Tienda Platform
 * Now using mock data for frontend-only demonstration
 */

import { MockApiService } from './mockApi';

// Re-export types for convenience
export * from './mockApi';

// Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
  meta?: ResponseMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  field?: string;
  timestamp: string;
  requestId?: string;
}

export interface ResponseMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'tienda' | 'admin' | 'staff';
  shopifyConnected?: boolean;
  permissions?: string[];
  tier?: 'bronce' | 'plata' | 'oro' | 'platino';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  sku: string;
  category: string;
  stock: number;
  images: string[];
  status: 'active' | 'inactive' | 'draft';
  tiendaId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Analytics {
  revenue: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    growth: number;
  };
  orders: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    growth: number;
  };
  products: {
    total: number;
    active: number;
    inactive: number;
  };
  customers: {
    total: number;
    new: number;
    returning: number;
  };
}

// Use mock service for all API calls
const mockService = new MockApiService();

// Export the mock service as the main API service
export const apiService = mockService;

// For backward compatibility, also export as default
export default mockService;