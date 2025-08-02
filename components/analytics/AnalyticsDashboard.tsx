import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Progress } from '../ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ComposedChart,
  ScatterChart,
  Scatter
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShoppingCart, 
  DollarSign,
  Calendar,
  Download,
  Brain,
  Target,
  Zap,
  Eye,
  Clock,
  Heart,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'vendor' | 'admin' | 'staff';
}

interface AnalyticsDashboardProps {
  user: User;
}

// Datos mock para análisis avanzados
const demandPrediction = [
  { month: 'Ene', actual: 1250, predicted: 1200, confidence: 85 },
  { month: 'Feb', actual: 1180, predicted: 1150, confidence: 82 },
  { month: 'Mar', actual: 1420, predicted: 1380, confidence: 88 },
  { month: 'Abr', actual: 1350, predicted: 1320, confidence: 86 },
  { month: 'May', actual: 1580, predicted: 1520, confidence: 84 },
  { month: 'Jun', actual: null, predicted: 1650, confidence: 78 },
  { month: 'Jul', actual: null, predicted: 1720, confidence: 75 },
  { month: 'Ago', actual: null, predicted: 1680, confidence: 72 }
];

const cohortData = [
  { cohort: 'Ene 2024', month0: 100, month1: 45, month2: 32, month3: 28, month4: 25, month5: 22 },
  { cohort: 'Feb 2024', month0: 120, month1: 54, month2: 38, month3: 34, month4: 30 },
  { cohort: 'Mar 2024', month0: 140, month1: 63, month2: 44, month3: 39 },
  { cohort: 'Abr 2024', month0: 135, month1: 61, month2: 42 },
  { cohort: 'May 2024', month0: 160, month1: 72 },
  { cohort: 'Jun 2024', month0: 175 }
];

const customerSegments = [
  { name: 'VIP', customers: 245, revenue: 125000, ltv: 510, color: '#8884d8' },
  { name: 'Leales', customers: 680, revenue: 185000, ltv: 272, color: '#82ca9d' },
  { name: 'Nuevos', customers: 1250, revenue: 95000, ltv: 76, color: '#ffc658' },
  { name: 'En Riesgo', customers: 320, revenue: 45000, ltv: 141, color: '#ff7300' },
  { name: 'Perdidos', customers: 890, revenue: 12000, ltv: 13, color: '#ff0000' }
];

const productPerformance = [
  { name: 'Smartphone XYZ', sales: 850, profit: 89000, margin: 28, stock: 45, trend: 'up' },
  { name: 'Auriculares Pro', sales: 680, profit: 67000, margin: 35, stock: 23, trend: 'up' },
  { name: 'Camiseta Vintage', sales: 520, profit: 15000, margin: 42, stock: 156, trend: 'down' },
  { name: 'Reloj Deportivo', sales: 340, profit: 54000, margin: 31, stock: 12, trend: 'up' },
  { name: 'Libro Cocina', sales: 280, profit: 8000, margin: 25, stock: 89, trend: 'stable' }
];

const funnelData = [
  { stage: 'Visitantes', count: 12500, conversion: 100 },
  { stage: 'Vieron Producto', count: 8750, conversion: 70 },
  { stage: 'Agregaron Carrito', count: 3125, conversion: 25 },
  { stage: 'Iniciaron Checkout', count: 1875, conversion: 15 },
  { stage: 'Completaron Compra', count: 1250, conversion: 10 }
];

const advancedMetrics = {
  churnRate: 5.2,
  ltv: 245.80,
  cac: 28.50,
  roas: 4.2,
  repeatPurchaseRate: 32.5,
  avgOrderFrequency: 2.3,
  timeToRepurchase: 45,
  customerSatisfaction: 4.6
};

export function AnalyticsDashboard({ user }: AnalyticsDashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('3m');
  const [selectedSegment, setSelectedSegment] = useState('all');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getMetricTrend = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(change),
      direction: change >= 0 ? 'up' : 'down',
      isPositive: change >= 0
    };
  };

  const getCohortColor = (retention: number) => {
    if (retention >= 30) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (retention >= 20) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl">Análisis & Business Intelligence</h1>
          <p className="text-muted-foreground">
            Insights avanzados, predicciones y análisis de cohortes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">Último mes</SelectItem>
              <SelectItem value="3m">Últimos 3 meses</SelectItem>
              <SelectItem value="6m">Últimos 6 meses</SelectItem>
              <SelectItem value="1y">Último año</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Métricas avanzadas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer LTV</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(advancedMetrics.ltv)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +8.2% vs mes anterior
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Churn</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{advancedMetrics.churnRate}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingDown className="h-3 w-3 mr-1" />
                -1.2% vs mes anterior
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROAS</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{advancedMetrics.roas}x</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +0.3x vs mes anterior
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Repeat Purchase</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{advancedMetrics.repeatPurchaseRate}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +2.1% vs mes anterior
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="prediction" className="space-y-4">
        <TabsList>
          <TabsTrigger value="prediction">Predicción de Demanda</TabsTrigger>
          <TabsTrigger value="cohorts">Análisis de Cohortes</TabsTrigger>
          <TabsTrigger value="segments">Segmentación</TabsTrigger>
          <TabsTrigger value="funnel">Funnel de Conversión</TabsTrigger>
          <TabsTrigger value="products">Rendimiento Productos</TabsTrigger>
        </TabsList>

        <TabsContent value="prediction" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Predicción de Demanda - Próximos 3 meses
                </CardTitle>
                <CardDescription>
                  Modelo de Machine Learning con 82% de precisión promedio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <ComposedChart data={demandPrediction}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [
                      value,
                      name === 'actual' ? 'Ventas Reales' : name === 'predicted' ? 'Predicción' : 'Confianza'
                    ]} />
                    <Area type="monotone" dataKey="predicted" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
                    <Bar dataKey="actual" fill="#8884d8" />
                    <Line type="monotone" dataKey="confidence" stroke="#ff7300" strokeWidth={2} />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Insights de IA</CardTitle>
                <CardDescription>
                  Recomendaciones basadas en patrones
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Oportunidad</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Incrementa stock de "Auriculares Pro" en 40% para julio - alta demanda prevista
                  </p>
                </div>

                <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium">Promoción</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Lanza descuento en "Camiseta Vintage" - demanda cayendo 15%
                  </p>
                </div>

                <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Tendencia</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Categoría "Electrónicos" muestra crecimiento sostenido (+12%)
                  </p>
                </div>

                <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium">Estacionalidad</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Prepara campaña "Back to School" para agosto - pico histórico
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cohorts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análisis de Cohortes - Retención de Clientes</CardTitle>
              <CardDescription>
                Porcentaje de clientes que realizan una segunda compra por mes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-medium">Cohorte</th>
                      <th className="text-center p-2 font-medium">Mes 0</th>
                      <th className="text-center p-2 font-medium">Mes 1</th>
                      <th className="text-center p-2 font-medium">Mes 2</th>
                      <th className="text-center p-2 font-medium">Mes 3</th>
                      <th className="text-center p-2 font-medium">Mes 4</th>
                      <th className="text-center p-2 font-medium">Mes 5</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cohortData.map((cohort, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2 font-medium">{cohort.cohort}</td>
                        <td className="text-center p-2">
                          <Badge variant="outline">{cohort.month0}</Badge>
                        </td>
                        {[cohort.month1, cohort.month2, cohort.month3, cohort.month4, cohort.month5].map((value, i) => {
                          if (value === undefined) return <td key={i} className="text-center p-2">-</td>;
                          const retention = Math.round((value / cohort.month0) * 100);
                          return (
                            <td key={i} className="text-center p-2">
                              <Badge className={getCohortColor(retention)}>
                                {retention}%
                              </Badge>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">32.5%</p>
                  <p className="text-sm text-muted-foreground">Retención promedio</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">45 días</p>
                  <p className="text-sm text-muted-foreground">Tiempo a recompra</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">2.3x</p>
                  <p className="text-sm text-muted-foreground">Compras por cliente</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="segments" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Segmentación de Clientes</CardTitle>
                <CardDescription>
                  Distribución por valor y comportamiento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={customerSegments}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="customers"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {customerSegments.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [value, 'Clientes']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detalle por Segmento</CardTitle>
                <CardDescription>
                  Métricas clave por grupo de clientes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customerSegments.map((segment, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: segment.color }}
                          />
                          <span className="font-medium">{segment.name}</span>
                        </div>
                        <Badge variant="outline">{segment.customers} clientes</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Ingresos</p>
                          <p className="font-medium">{formatCurrency(segment.revenue)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">LTV promedio</p>
                          <p className="font-medium">{formatCurrency(segment.ltv)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="funnel" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Funnel de Conversión</CardTitle>
              <CardDescription>
                Análisis del embudo de ventas y puntos de abandono
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {funnelData.map((stage, index) => (
                  <div key={index} className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{stage.stage}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {stage.count.toLocaleString()} ({stage.conversion}%)
                        </span>
                        {index > 0 && (
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              stage.conversion >= 20 ? 'text-green-600' : 
                              stage.conversion >= 10 ? 'text-yellow-600' : 'text-red-600'
                            }`}
                          >
                            {stage.conversion >= 20 ? '✓ Bueno' : 
                             stage.conversion >= 10 ? '⚠ Regular' : '✗ Mejorar'}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Progress value={stage.conversion} className="h-6" />
                    {index < funnelData.length - 1 && (
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                        <ArrowDownRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                  <p className="text-2xl font-bold text-red-600">30%</p>
                  <p className="text-sm text-muted-foreground">Abandono en carrito</p>
                  <p className="text-xs text-muted-foreground mt-1">Oportunidad de mejora</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-600">40%</p>
                  <p className="text-sm text-muted-foreground">Abandono en checkout</p>
                  <p className="text-xs text-muted-foreground mt-1">Simplificar proceso</p>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">10%</p>
                  <p className="text-sm text-muted-foreground">Conversión final</p>
                  <p className="text-xs text-muted-foreground mt-1">Objetivo: 15%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rendimiento de Productos</CardTitle>
              <CardDescription>
                Análisis detallado de ventas, márgenes y stock por producto
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>Ventas</TableHead>
                    <TableHead>Ganancia</TableHead>
                    <TableHead>Margen</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Tendencia</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productPerformance.map((product, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.sales}</TableCell>
                      <TableCell>{formatCurrency(product.profit)}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline"
                          className={
                            product.margin >= 30 ? 'text-green-600' :
                            product.margin >= 20 ? 'text-yellow-600' : 'text-red-600'
                          }
                        >
                          {product.margin}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={product.stock < 20 ? 'destructive' : 'outline'}
                        >
                          {product.stock}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {product.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-600" />}
                        {product.trend === 'down' && <TrendingDown className="h-4 w-4 text-red-600" />}
                        {product.trend === 'stable' && <div className="h-4 w-4 bg-gray-400 rounded-full" />}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}