import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CustomerSegment, Customer } from '../types/crm-types';
import { formatCurrency } from '../utils/crm-utils';

interface CustomerSegmentsProps {
  segments: CustomerSegment[];
  customers: Customer[];
}

export function CustomerSegments({ segments, customers }: CustomerSegmentsProps) {
  const totalCustomers = customers.length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);

  const segmentData = segments.map(segment => {
    const segmentCustomers = customers.filter(c => 
      c.segment === segment.name.toLowerCase().replace(/\s+/g, '_').replace('clientes_', '')
    );
    
    return {
      ...segment,
      actualCustomers: segmentCustomers.length,
      actualRevenue: segmentCustomers.reduce((sum, c) => sum + c.totalSpent, 0),
      percentage: totalCustomers > 0 ? (segmentCustomers.length / totalCustomers) * 100 : 0
    };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Gráfico de distribución */}
      <Card>
        <CardHeader>
          <CardTitle>Distribución de Clientes</CardTitle>
          <CardDescription>
            Segmentación por comportamiento y valor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={segmentData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="actualCustomers"
                label={({ name, percentage }) => `${name.replace('Clientes ', '')} ${percentage.toFixed(0)}%`}
              >
                {segmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [value, 'Clientes']} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detalles de segmentos */}
      <Card>
        <CardHeader>
          <CardTitle>Detalles por Segmento</CardTitle>
          <CardDescription>
            Métricas clave de cada grupo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {segmentData.map((segment) => (
              <div key={segment.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: segment.color }}
                    />
                    <span className="font-medium">{segment.name}</span>
                  </div>
                  <Badge variant="outline">
                    {segment.actualCustomers} clientes
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3">
                  {segment.description}
                </p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Participación:</span>
                    <span className="font-medium">{segment.percentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={segment.percentage} className="h-2" />
                  
                  <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Ingresos</p>
                      <p className="font-medium">{formatCurrency(segment.actualRevenue)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Promedio</p>
                      <p className="font-medium">
                        {segment.actualCustomers > 0 
                          ? formatCurrency(segment.actualRevenue / segment.actualCustomers)
                          : formatCurrency(0)
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}