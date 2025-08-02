import { CommissionTier, CommissionRule, PayoutHistory } from '../types/commission-types';

export const COMMISSION_TIERS: CommissionTier[] = [
  { id: '1', name: 'Bronce', minSales: 0, maxSales: 4000000, rate: 5, color: '#cd7f32' },
  { id: '2', name: 'Plata', minSales: 4000000, maxSales: 20000000, rate: 7, color: '#c0c0c0' },
  { id: '3', name: 'Oro', minSales: 20000000, maxSales: 60000000, rate: 10, color: '#ffd700' },
  { id: '4', name: 'Platino', minSales: 60000000, rate: 12, color: '#e5e4e2' }
];

export const DEFAULT_COMMISSION_RULES: CommissionRule[] = [
  { id: '1', category: 'electronics', categoryName: 'Electrónicos', type: 'percentage', value: 8, active: true },
  { id: '2', category: 'fashion', categoryName: 'Moda', type: 'percentage', value: 12, active: true },
  { id: '3', category: 'sports', categoryName: 'Deportes', type: 'percentage', value: 10, active: true },
  { id: '4', category: 'home', categoryName: 'Hogar', type: 'percentage', value: 15, active: false },
  { id: '5', category: 'beauty', categoryName: 'Belleza', type: 'percentage', value: 18, active: false }
];

export const MOCK_PAYOUT_HISTORY: PayoutHistory[] = [
  {
    id: '1',
    period: 'Enero 2024',
    date: '1 Feb 2024',
    amount: 980000,
    status: 'paid'
  },
  {
    id: '2',
    period: 'Diciembre 2023',
    date: '1 Ene 2024',
    amount: 756000,
    status: 'paid'
  },
  {
    id: '3',
    period: 'Febrero 2024',
    date: '1 Mar 2024',
    amount: 500000,
    status: 'pending'
  }
];