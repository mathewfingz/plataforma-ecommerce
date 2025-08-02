import { Customer, CustomerSegment } from '../types/crm-types';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const getCustomerSegmentColor = (segment: string): string => {
  const colors = {
    'vip': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'loyal': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'new': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'at_risk': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'lost': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  };
  return colors[segment as keyof typeof colors] || colors.new;
};

export const getCustomerSegmentLabel = (segment: string): string => {
  const labels = {
    'vip': 'VIP',
    'loyal': 'Leal',
    'new': 'Nuevo',
    'at_risk': 'En Riesgo',
    'lost': 'Perdido'
  };
  return labels[segment as keyof typeof labels] || segment;
};

export const calculateCustomerHealth = (customer: Customer): {
  score: number;
  status: 'excellent' | 'good' | 'fair' | 'poor';
  color: string;
} => {
  let score = 0;
  
  // Puntuación basada en gasto total
  if (customer.totalSpent > 2000) score += 30;
  else if (customer.totalSpent > 1000) score += 20;
  else if (customer.totalSpent > 500) score += 10;
  
  // Puntuación basada en frecuencia de pedidos
  if (customer.totalOrders > 10) score += 25;
  else if (customer.totalOrders > 5) score += 15;
  else if (customer.totalOrders > 2) score += 5;
  
  // Puntuación basada en recencia
  if (customer.lastOrder) {
    const daysSinceLastOrder = Math.floor(
      (Date.now() - new Date(customer.lastOrder).getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysSinceLastOrder < 30) score += 25;
    else if (daysSinceLastOrder < 60) score += 15;
    else if (daysSinceLastOrder < 90) score += 5;
  }
  
  // Puntuación basada en valor promedio de pedido
  if (customer.avgOrderValue > 200) score += 20;
  else if (customer.avgOrderValue > 100) score += 10;
  else if (customer.avgOrderValue > 50) score += 5;
  
  let status: 'excellent' | 'good' | 'fair' | 'poor';
  let color: string;
  
  if (score >= 80) {
    status = 'excellent';
    color = 'text-green-600';
  } else if (score >= 60) {
    status = 'good';
    color = 'text-blue-600';
  } else if (score >= 40) {
    status = 'fair';
    color = 'text-yellow-600';
  } else {
    status = 'poor';
    color = 'text-red-600';
  }
  
  return { score, status, color };
};

export const filterCustomers = (
  customers: Customer[],
  searchTerm: string,
  selectedSegment: string,
  selectedTag: string
): Customer[] => {
  return customers.filter(customer => {
    const matchesSearch = searchTerm === '' || 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSegment = selectedSegment === 'all' || customer.segment === selectedSegment;
    
    const matchesTag = selectedTag === 'all' || customer.tags.includes(selectedTag);
    
    return matchesSearch && matchesSegment && matchesTag;
  });
};

export const getSegmentMetrics = (customers: Customer[], segment: CustomerSegment) => {
  const segmentCustomers = customers.filter(c => c.segment === segment.name.toLowerCase().replace(' ', '_'));
  
  const totalRevenue = segmentCustomers.reduce((sum, c) => sum + c.totalSpent, 0);
  const avgLTV = segmentCustomers.length > 0 ? 
    segmentCustomers.reduce((sum, c) => sum + c.ltv, 0) / segmentCustomers.length : 0;
  const avgOrderValue = segmentCustomers.length > 0 ?
    segmentCustomers.reduce((sum, c) => sum + c.avgOrderValue, 0) / segmentCustomers.length : 0;
  
  return {
    customerCount: segmentCustomers.length,
    totalRevenue,
    avgLTV,
    avgOrderValue
  };
};