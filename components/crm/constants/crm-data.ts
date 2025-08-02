import { Customer, CustomerSegment, CRMAutomation, CRMMetrics } from '../types/crm-types';

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: '1',
    name: 'Ana García López',
    email: 'ana.garcia@email.com',
    phone: '+34 612 345 678',
    location: 'Madrid, España',
    segment: 'vip',
    totalSpent: 2450.80,
    totalOrders: 15,
    lastOrder: '2024-01-15',
    firstOrder: '2023-03-20',
    ltv: 850.30,
    avgOrderValue: 163.39,
    tags: ['premium', 'fidelidad'],
    preferredChannel: 'email',
    birthdate: '1985-06-15'
  },
  {
    id: '2',
    name: 'Carlos Rodríguez',
    email: 'carlos.rodriguez@email.com',
    phone: '+34 698 765 432',
    location: 'Barcelona, España',
    segment: 'loyal',
    totalSpent: 1280.50,
    totalOrders: 8,
    lastOrder: '2024-01-12',
    firstOrder: '2023-08-15',
    ltv: 420.15,
    avgOrderValue: 160.06,
    tags: ['tecnología', 'regular'],
    preferredChannel: 'email',
    birthdate: '1990-11-22'
  },
  {
    id: '3',
    name: 'María Fernández',
    email: 'maria.fernandez@email.com',
    phone: '+34 623 456 789',
    location: 'Valencia, España',
    segment: 'new',
    totalSpent: 89.99,
    totalOrders: 1,
    lastOrder: '2024-01-16',
    firstOrder: '2024-01-16',
    ltv: 89.99,
    avgOrderValue: 89.99,
    tags: ['nuevo'],
    preferredChannel: 'sms'
  },
  {
    id: '4',
    name: 'José Luis Martín',
    email: 'jose.martin@email.com',
    phone: '+34 654 321 987',
    location: 'Sevilla, España',
    segment: 'at_risk',
    totalSpent: 850.30,
    totalOrders: 6,
    lastOrder: '2023-10-20',
    firstOrder: '2023-02-10',
    ltv: 280.10,
    avgOrderValue: 141.72,
    tags: ['inactivo', 'riesgo'],
    preferredChannel: 'phone',
    birthdate: '1978-04-08'
  },
  {
    id: '5',
    name: 'Laura Sánchez',
    email: 'laura.sanchez@email.com',
    location: 'Bilbao, España',
    segment: 'lost',
    totalSpent: 120.00,
    totalOrders: 2,
    lastOrder: '2023-06-15',
    firstOrder: '2023-05-20',
    ltv: 40.00,
    avgOrderValue: 60.00,
    tags: ['perdido'],
    preferredChannel: 'email',
    birthdate: '1995-12-30'
  }
];

export const CUSTOMER_SEGMENTS: CustomerSegment[] = [
  {
    id: '1',
    name: 'Clientes VIP',
    description: 'Clientes con más de €2000 en compras',
    conditions: 'total_spent > 2000 AND total_orders > 10',
    customerCount: 234,
    totalRevenue: 450000,
    color: '#8b5cf6'
  },
  {
    id: '2',
    name: 'Clientes Leales',
    description: 'Clientes con 3+ pedidos en últimos 6 meses',
    conditions: 'total_orders >= 3 AND last_order > 6_months_ago',
    customerCount: 1250,
    totalRevenue: 285000,
    color: '#3b82f6'
  },
  {
    id: '3',
    name: 'Nuevos Clientes',
    description: 'Clientes registrados en últimos 30 días',
    conditions: 'created_at > 30_days_ago',
    customerCount: 456,
    totalRevenue: 45000,
    color: '#10b981'
  },
  {
    id: '4',
    name: 'En Riesgo',
    description: 'Sin compras en últimos 90 días',
    conditions: 'last_order < 90_days_ago AND total_orders > 1',
    customerCount: 320,
    totalRevenue: 25000,
    color: '#f59e0b'
  },
  {
    id: '5',
    name: 'Perdidos',
    description: 'Sin actividad en más de 6 meses',
    conditions: 'last_activity < 6_months_ago',
    customerCount: 890,
    totalRevenue: 8000,
    color: '#ef4444'
  }
];

export const CRM_AUTOMATIONS: CRMAutomation[] = [
  {
    id: '1',
    name: 'Felicitación de Cumpleaños',
    trigger: 'birthday',
    description: 'Email automático con descuento especial en cumpleaños',
    status: 'active',
    customers: 1250,
    sent: 45,
    opened: 32,
    clicked: 12
  },
  {
    id: '2',
    name: 'Recuperación de Clientes',
    trigger: 'no_purchase',
    description: 'Serie de emails para clientes inactivos 60+ días',
    status: 'active',
    customers: 520,
    sent: 156,
    opened: 89,
    clicked: 23
  },
  {
    id: '3',
    name: 'Programa VIP',
    trigger: 'high_value',
    description: 'Invitación automática a programa VIP por alto valor',
    status: 'active',
    customers: 89,
    sent: 23,
    opened: 20,
    clicked: 15
  },
  {
    id: '4',
    name: 'Aniversario Cliente',
    trigger: 'anniversary',
    description: 'Celebración aniversario primera compra',
    status: 'paused',
    customers: 234,
    sent: 12,
    opened: 8,
    clicked: 3
  }
];

export const CRM_METRICS: CRMMetrics = {
  totalCustomers: 3486,
  newCustomers: 456,
  customerRetention: 68.5,
  avgLifetimeValue: 245.80,
  churnRate: 5.2,
  customerSatisfaction: 4.6
};