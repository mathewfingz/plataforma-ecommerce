export interface CommissionTier {
  id: string;
  name: string;
  minSales: number;
  maxSales?: number;
  rate: number;
  color: string;
}

export interface CommissionRule {
  id: string;
  category: string;
  categoryName: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrder?: number;
  maxOrder?: number;
  active: boolean;
}

export interface PayoutSettings {
  method: 'bank_transfer' | 'paypal' | 'stripe';
  frequency: 'weekly' | 'biweekly' | 'monthly';
  minimumAmount: number;
  bankDetails?: {
    accountNumber: string;
    routingNumber: string;
    accountName: string;
  };
  paypalEmail?: string;
  stripeAccountId?: string;
}

export interface MonthlyStats {
  totalSales: number;
  totalCommissions: number;
  pendingPayout: number;
  nextPayout: string;
  ordersCount: number;
  avgOrderValue: number;
}

export interface PayoutHistory {
  id: string;
  period: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
}