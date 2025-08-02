import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Switch } from '../../ui/switch';
import { Progress } from '../../ui/progress';
import { Plus, Play, Pause, Edit, BarChart3, Zap } from 'lucide-react';
import { CRMAutomation } from '../types/crm-types';

interface AutomationFlowsProps {
  automations: CRMAutomation[];
  onToggleAutomation: (automationId: string) => void;
  onEditAutomation: (automation: CRMAutomation) => void;
  onCreateAutomation: () => void;
}

export function AutomationFlows({ 
  automations, 
  onToggleAutomation, 
  onEditAutomation, 
  onCreateAutomation 
}: AutomationFlowsProps) {
  
  const getTriggerLabel = (trigger: string) => {
    const labels = {
      'birthday': 'Cumpleaños',
      'anniversary': 'Aniversario',
      'no_purchase': 'Sin compras',
      'high_value': 'Alto valor'
    };
    return labels[trigger as keyof typeof labels] || trigger;
  };

  const getTriggerIcon = (trigger: string) => {
    const icons = {
      'birthday': '🎂',
      'anniversary': '🎉',
      'no_purchase': '⏰',
      'high_value': '💎'
    };
    return icons[trigger as keyof typeof icons] || '🤖';
  };

  const calculateConversionRate = (automation: CRMAutomation) => {
    if (automation.sent === 0) return 0;
    return (automation.clicked / automation.sent) * 100;
  };

  const calculateOpenRate = (automation: CRMAutomation) => {
    if (automation.sent === 0) return 0;
    return (automation.opened / automation.sent) * 100;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Automatizaciones CRM</h2>
        <Button onClick={onCreateAutomation}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Automatización
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {automations.map((automation) => (
          <Card key={automation.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getTriggerIcon(automation.trigger)}</span>
                  <Badge variant={automation.status === 'active' ? 'default' : 'secondary'}>
                    {automation.status === 'active' ? 'Activo' : 'Pausado'}
                  </Badge>
                </div>
                <Switch
                  checked={automation.status === 'active'}
                  onCheckedChange={() => onToggleAutomation(automation.id)}
                />
              </div>
              <CardTitle className="text-base">{automation.name}</CardTitle>
              <CardDescription>
                Trigger: {getTriggerLabel(automation.trigger)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {automation.description}
                </p>

                {/* Métricas de rendimiento */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-lg font-bold">{automation.customers}</p>
                    <p className="text-xs text-muted-foreground">Clientes elegibles</p>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-lg font-bold">{automation.sent}</p>
                    <p className="text-xs text-muted-foreground">Mensajes enviados</p>
                  </div>
                </div>

                {/* Tasas de rendimiento */}
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Tasa de apertura</span>
                      <span className="font-medium">{calculateOpenRate(automation).toFixed(1)}%</span>
                    </div>
                    <Progress value={calculateOpenRate(automation)} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Tasa de conversión</span>
                      <span className="font-medium">{calculateConversionRate(automation).toFixed(1)}%</span>
                    </div>
                    <Progress value={calculateConversionRate(automation)} className="h-2" />
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onEditAutomation(automation)}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Editar
                  </Button>
                  <Button variant="outline" size="sm">
                    <BarChart3 className="h-3 w-3 mr-1" />
                    Métricas
                  </Button>
                  {automation.status === 'paused' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onToggleAutomation(automation.id)}
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Activar
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Resumen de automatizaciones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Resumen de Automatizaciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">
                {automations.filter(a => a.status === 'active').length}
              </p>
              <p className="text-sm text-muted-foreground">Activas</p>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {automations.reduce((sum, a) => sum + a.sent, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Mensajes enviados</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">
                {(automations.reduce((sum, a) => sum + (a.sent > 0 ? (a.opened / a.sent) * 100 : 0), 0) / automations.length).toFixed(1)}%
              </p>
              <p className="text-sm text-muted-foreground">Apertura promedio</p>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">
                {(automations.reduce((sum, a) => sum + (a.sent > 0 ? (a.clicked / a.sent) * 100 : 0), 0) / automations.length).toFixed(1)}%
              </p>
              <p className="text-sm text-muted-foreground">Conversión promedio</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}