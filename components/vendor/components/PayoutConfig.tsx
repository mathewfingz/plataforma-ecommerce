import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { PayoutSettings, PayoutHistory } from '../types/commission-types';
import { formatCurrency } from '../utils/commission-utils';

interface PayoutConfigProps {
  payoutSettings: PayoutSettings;
  payoutHistory: PayoutHistory[];
  onUpdateSettings: (updates: Partial<PayoutSettings>) => void;
}

export function PayoutConfig({ payoutSettings, payoutHistory, onUpdateSettings }: PayoutConfigProps) {
  const getStatusBadge = (status: string) => {
    const variants = {
      'paid': { variant: 'secondary' as const, label: 'Pagado' },
      'pending': { variant: 'outline' as const, label: 'Pendiente' },
      'failed': { variant: 'destructive' as const, label: 'Fallido' }
    };
    
    const statusInfo = variants[status as keyof typeof variants] || variants.pending;
    
    return (
      <Badge variant={statusInfo.variant}>
        {statusInfo.label}
      </Badge>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Pagos</CardTitle>
          <CardDescription>
            Configura cómo y cuándo recibir tus comisiones
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="payoutMethod">Método de pago</Label>
            <Select
              value={payoutSettings.method}
              onValueChange={(value) => onUpdateSettings({ method: value as PayoutSettings['method'] })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bank_transfer">Transferencia bancaria</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
                <SelectItem value="stripe">Stripe Connect</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="frequency">Frecuencia de pago</Label>
            <Select
              value={payoutSettings.frequency}
              onValueChange={(value) => onUpdateSettings({ frequency: value as PayoutSettings['frequency'] })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Semanal</SelectItem>
                <SelectItem value="biweekly">Quincenal</SelectItem>
                <SelectItem value="monthly">Mensual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="minimumAmount">Monto mínimo de pago</Label>
            <Input
              id="minimumAmount"
              type="number"
              value={payoutSettings.minimumAmount}
              onChange={(e) => onUpdateSettings({ minimumAmount: parseFloat(e.target.value) })}
            />
            <p className="text-xs text-muted-foreground">
              Solo se procesarán pagos superiores a esta cantidad
            </p>
          </div>

          {payoutSettings.method === 'bank_transfer' && (
            <div className="space-y-4 pt-4 border-t">
              <h4 className="font-medium">Datos bancarios</h4>
              <div className="space-y-2">
                <Label htmlFor="accountName">Nombre de la cuenta</Label>
                <Input
                  id="accountName"
                  value={payoutSettings.bankDetails?.accountName || ''}
                  onChange={(e) => onUpdateSettings({
                    bankDetails: { ...payoutSettings.bankDetails!, accountName: e.target.value }
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Número de cuenta</Label>
                <Input
                  id="accountNumber"
                  value={payoutSettings.bankDetails?.accountNumber || ''}
                  onChange={(e) => onUpdateSettings({
                    bankDetails: { ...payoutSettings.bankDetails!, accountNumber: e.target.value }
                  })}
                />
              </div>
            </div>
          )}

          <Button className="w-full">
            Guardar Configuración
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Pagos</CardTitle>
          <CardDescription>
            Últimos pagos de comisiones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {payoutHistory.map((payout) => (
              <div key={payout.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{payout.period}</p>
                  <p className="text-sm text-muted-foreground">{payout.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">{formatCurrency(payout.amount)}</p>
                  {getStatusBadge(payout.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}