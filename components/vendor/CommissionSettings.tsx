import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Calculator } from 'lucide-react';

import { TierStatus } from './components/TierStatus';
import { CommissionRules } from './components/CommissionRules';
import { CommissionTiers } from './components/CommissionTiers';
import { PayoutConfig } from './components/PayoutConfig';

import { CommissionRule, PayoutSettings, MonthlyStats } from './types/commission-types';
import { COMMISSION_TIERS, DEFAULT_COMMISSION_RULES, MOCK_PAYOUT_HISTORY } from './constants/commission-data';
import { 
  formatCurrency, 
  getCurrentTier, 
  getNextTier, 
  calculateProgressToNextTier,
  calculateCommission 
} from './utils/commission-utils';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'tienda' | 'admin';
  shopifyConnected?: boolean;
}

interface CommissionSettingsProps {
  user: User;
}

export function CommissionSettings({ user }: CommissionSettingsProps) {
  const [commissionRules, setCommissionRules] = useState<CommissionRule[]>(DEFAULT_COMMISSION_RULES);
  const [payoutSettings, setPayoutSettings] = useState<PayoutSettings>({
    method: 'bank_transfer',
    frequency: 'monthly',
    minimumAmount: 50,
    bankDetails: {
      accountNumber: '****1234',
      routingNumber: '123456789',
      accountName: user.name
    }
  });

  // Calculadora de comisiones
  const [calculatorOrder, setCalculatorOrder] = useState('100');
  const [calculatorCategory, setCalculatorCategory] = useState('electronics');

  // Datos mock de rendimiento
  const currentSales = 3500;
  const currentTier = getCurrentTier(currentSales, COMMISSION_TIERS);
  const nextTier = getNextTier(currentTier, COMMISSION_TIERS);
  const progressToNextTier = calculateProgressToNextTier(currentSales, currentTier, nextTier);

  const monthlyStats: MonthlyStats = {
    totalSales: 3500,
    totalCommissions: 280,
    pendingPayout: 125,
    nextPayout: '2024-02-01',
    ordersCount: 23,
    avgOrderValue: 152.17
  };

  const updateCommissionRule = (ruleId: string, updates: Partial<CommissionRule>) => {
    setCommissionRules(rules => 
      rules.map(rule => 
        rule.id === ruleId ? { ...rule, ...updates } : rule
      )
    );
  };

  const updatePayoutSettings = (updates: Partial<PayoutSettings>) => {
    setPayoutSettings(prev => ({ ...prev, ...updates }));
  };

  const calculatedCommission = calculateCommission(
    parseFloat(calculatorOrder) || 0,
    calculatorCategory,
    commissionRules
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl">Configuración de Comisiones</h1>
          <p className="text-muted-foreground">
            Gestiona tus comisiones y configuración de pagos
          </p>
        </div>
      </div>

      {/* Current Tier Status */}
      <TierStatus
        currentTier={currentTier}
        nextTier={nextTier}
        currentSales={currentSales}
        progressToNextTier={progressToNextTier}
        monthlyStats={monthlyStats}
      />

      <Tabs defaultValue="rules" className="space-y-4">
        <TabsList>
          <TabsTrigger value="rules">Reglas de Comisión</TabsTrigger>
          <TabsTrigger value="tiers">Niveles</TabsTrigger>
          <TabsTrigger value="payouts">Configuración de Pagos</TabsTrigger>
          <TabsTrigger value="calculator">Calculadora</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-4">
          <CommissionRules
            commissionRules={commissionRules}
            onUpdateRule={updateCommissionRule}
          />
        </TabsContent>

        <TabsContent value="tiers" className="space-y-4">
          <CommissionTiers
            tiers={COMMISSION_TIERS}
            currentTier={currentTier}
          />
        </TabsContent>

        <TabsContent value="payouts" className="space-y-4">
          <PayoutConfig
            payoutSettings={payoutSettings}
            payoutHistory={MOCK_PAYOUT_HISTORY}
            onUpdateSettings={updatePayoutSettings}
          />
        </TabsContent>

        <TabsContent value="calculator" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Calculadora de Comisiones
              </CardTitle>
              <CardDescription>
                Calcula cuánto ganarás por comisiones según el valor del pedido
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="orderValue">Valor del pedido (COP)</Label>
                  <Input
                    id="orderValue"
                    type="number"
                    value={calculatorOrder}
                    onChange={(e) => setCalculatorOrder(e.target.value)}
                    placeholder="100.00"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Categoría</Label>
                  <select
                    id="category"
                    value={calculatorCategory}
                    onChange={(e) => setCalculatorCategory(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    {commissionRules.filter(rule => rule.active).map(rule => (
                      <option key={rule.category} value={rule.category}>
                        {rule.categoryName} ({rule.value}%)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Tu comisión:</span>
                  <span className="text-2xl font-bold text-green-600">
                    {formatCurrency(calculatedCommission)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Basado en tu nivel actual ({currentTier.name}) y la regla de categoría seleccionada
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}