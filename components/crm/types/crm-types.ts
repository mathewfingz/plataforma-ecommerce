export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  avatar?: string;
  segment: 'vip' | 'loyal' | 'new' | 'at_risk' | 'lost';
  totalSpent: number;
  totalOrders: number;
  lastOrder?: string;
  firstOrder: string;
  ltv: number;
  avgOrderValue: number;
  tags: string[];
  notes?: string;
  birthdate?: string;
  preferredChannel: 'email' | 'sms' | 'phone';
}

export interface CustomerSegment {
  id: string;
  name: string;
  description: string;
  conditions: string;
  customerCount: number;
  totalRevenue: number;
  color: string;
}

export interface CRMAutomation {
  id: string;
  name: string;
  trigger: 'birthday' | 'anniversary' | 'no_purchase' | 'high_value';
  description: string;
  status: 'active' | 'paused';
  customers: number;
  sent: number;
  opened: number;
  clicked: number;
}

export interface CRMMetrics {
  totalCustomers: number;
  newCustomers: number;
  customerRetention: number;
  avgLifetimeValue: number;
  churnRate: number;
  customerSatisfaction: number;
}

export interface CustomerActivity {
  id: string;
  customerId: string;
  type: 'purchase' | 'email_open' | 'email_click' | 'login' | 'support_ticket';
  description: string;
  date: string;
  value?: number;
}