import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '../../ui/badge';
import { Award } from 'lucide-react';
import { CommissionTier } from '../types/commission-types';
import { formatCurrency } from '../utils/commission-utils';

interface CommissionTiersProps {
  tiers: CommissionTier[];
  currentTier: CommissionTier;
}

export function CommissionTiers({ tiers, currentTier }: CommissionTiersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Niveles de Comisión</CardTitle>
        <CardDescription>
          Sistema de niveles basado en volumen de ventas mensuales
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tiers.map((tier) => (
            <Card key={tier.id} className={`relative ${currentTier.id === tier.id ? 'ring-2 ring-primary' : ''}`}>
              <CardHeader className="text-center">
                <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center" style={{ backgroundColor: tier.color + '20' }}>
                  <Award className="h-6 w-6" style={{ color: tier.color }} />
                </div>
                <CardTitle className="text-lg">{tier.name}</CardTitle>
                {currentTier.id === tier.id && (
                  <Badge variant="secondary" className="absolute top-2 right-2">
                    Actual
                  </Badge>
                )}
              </CardHeader>
              <CardContent className="text-center space-y-2">
                <div className="text-2xl font-bold text-primary">{tier.rate}%</div>
                <p className="text-sm text-muted-foreground">Comisión</p>
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground">
                    Ventas mensuales
                  </p>
                  <p className="text-sm">
                    {formatCurrency(tier.minSales)}
                    {tier.maxSales ? ` - ${formatCurrency(tier.maxSales)}` : '+'}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}