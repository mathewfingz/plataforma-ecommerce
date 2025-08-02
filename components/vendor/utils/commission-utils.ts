import { CommissionRule, CommissionTier } from '../types/commission-types';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const calculateCommission = (orderValue: number, category: string, rules: CommissionRule[]): number => {
  const rule = rules.find(r => r.category === category && r.active);
  if (!rule) return 0;

  if (rule.type === 'percentage') {
    return (orderValue * rule.value) / 100;
  } else {
    return rule.value;
  }
};

export const getCurrentTier = (sales: number, tiers: CommissionTier[]): CommissionTier => {
  return tiers.find(tier => 
    sales >= tier.minSales && (tier.maxSales === undefined || sales <= tier.maxSales)
  ) || tiers[0];
};

export const getNextTier = (currentTier: CommissionTier, tiers: CommissionTier[]): CommissionTier | null => {
  const currentIndex = tiers.findIndex(tier => tier.id === currentTier.id);
  return currentIndex < tiers.length - 1 ? tiers[currentIndex + 1] : null;
};

export const calculateProgressToNextTier = (currentSales: number, currentTier: CommissionTier, nextTier: CommissionTier | null): number => {
  if (!nextTier) return 100;
  return ((currentSales - currentTier.minSales) / ((nextTier.minSales) - currentTier.minSales)) * 100;
};