import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Switch } from '../../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Alert, AlertDescription } from '../../ui/alert';
import { Info } from 'lucide-react';
import { CommissionRule } from '../types/commission-types';
import { formatCurrency } from '../utils/commission-utils';

interface CommissionRulesProps {
  commissionRules: CommissionRule[];
  onUpdateRule: (ruleId: string, updates: Partial<CommissionRule>) => void;
}

export function CommissionRules({ commissionRules, onUpdateRule }: CommissionRulesProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Comisiones por Categoría</CardTitle>
          <CardDescription>
            Configura comisiones específicas para cada categoría de producto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {commissionRules.map((rule) => (
              <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Switch
                    checked={rule.active}
                    onCheckedChange={(checked) => onUpdateRule(rule.id, { active: checked })}
                  />
                  <div>
                    <p className="font-medium">{rule.categoryName}</p>
                    <p className="text-sm text-muted-foreground">
                      {rule.type === 'percentage' ? `${rule.value}% del valor del pedido` : `${formatCurrency(rule.value)} por pedido`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={rule.active ? 'default' : 'secondary'}>
                    {rule.active ? 'Activo' : 'Inactivo'}
                  </Badge>
                  <Select
                    value={rule.value.toString()}
                    onValueChange={(value) => onUpdateRule(rule.id, { value: parseFloat(value) })}
                    disabled={!rule.active}
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 20 }, (_, i) => i + 1).map(num => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}%
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Las comisiones se calculan automáticamente basándose en tu nivel actual y las reglas por categoría. 
          Los cambios se aplican a partir del siguiente período de facturación.
        </AlertDescription>
      </Alert>
    </div>
  );
}