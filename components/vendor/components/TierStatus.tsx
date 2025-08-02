import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Progress } from '../../ui/progress';
import { Award } from 'lucide-react';
import { CommissionTier, MonthlyStats } from '../types/commission-types';
import { formatCurrency } from '../utils/commission-utils';

interface TierStatusProps {
  currentTier: CommissionTier;
  nextTier: CommissionTier | null;
  currentSales: number;
  progressToNextTier: number;
  monthlyStats: MonthlyStats;
}

export function TierStatus({ currentTier, nextTier, currentSales, progressToNextTier, monthlyStats }: TierStatusProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" style={{ color: currentTier.color }} />
          Nivel Actual: {currentTier.name}
        </CardTitle>
        <CardDescription>
          Comisión actual: {currentTier.rate}% • Ventas este mes: {formatCurrency(currentSales)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {nextTier && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progreso al siguiente nivel ({nextTier.name})</span>
              <span>{formatCurrency(currentSales)} / {formatCurrency(nextTier.minSales)}</span>
            </div>
            <Progress value={progressToNextTier} className="h-2" />
            <p className="text-xs text-muted-foreground">
              Te faltan {formatCurrency(nextTier.minSales - currentSales)} para alcanzar el nivel {nextTier.name} (+{nextTier.rate}% comisión)
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{formatCurrency(monthlyStats.totalCommissions)}</p>
            <p className="text-sm text-muted-foreground">Comisiones ganadas</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{monthlyStats.ordersCount}</p>
            <p className="text-sm text-muted-foreground">Pedidos completados</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{formatCurrency(monthlyStats.avgOrderValue)}</p>
            <p className="text-sm text-muted-foreground">Valor promedio</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">{formatCurrency(monthlyStats.pendingPayout)}</p>
            <p className="text-sm text-muted-foreground">Pago pendiente</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}