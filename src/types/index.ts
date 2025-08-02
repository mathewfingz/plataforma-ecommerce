// Re-export types from API service to avoid conflicts
export type { User, Product, Order, Analytics } from '../services/api';

// Additional shared types can be added here
export type Route = 
  | 'login' 
  | 'register' 
  | 'tienda-dashboard' 
  | 'products' 
  | 'csv-import'
  | 'orders' 
  | 'analytics'
  | 'marketing'
  | 'crm'
  | 'commissions' 
  | 'notifications'
  | 'users'
  | 'shopify'
  | 'help'
  | 'admin';