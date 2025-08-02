import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { LogoutButton } from '../auth/LogoutButton';
import { 
  TrendingUp, 
  TrendingDown, 
  ShoppingCart, 
  DollarSign, 
  Package, 
  Users, 
  Star, 
  Eye,
  Calendar,
  Filter,
  Download
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'tienda' | 'admin';
  shopifyConnected?: boolean;
}

interface VendorDashboardProps {
  user: User;
}

// Datos mock para las métricas
const salesData = [
  { name: 'Ene', ventas: 15000000, pedidos: 24, visitantes: 1200 },
  { name: 'Feb', ventas: 12000000, pedidos: 13, visitantes: 1100 },
  { name: 'Mar', ventas: 18000000, pedidos: 35, visitantes: 1400 },
  { name: 'Abr', ventas: 16500000, pedidos: 28, visitantes: 1300 },
  { name: 'May', ventas: 22000000, pedidos: 42, visitantes: 1600 },
  { name: 'Jun', ventas: 25000000, pedidos: 48, visitantes: 1800 },
];

const productPerformance = [
  { name: 'Smartphone XYZ', ventas: 2850000, stock: 45, categoria: 'Electrónicos' },
  { name: 'Auriculares Bluetooth', ventas: 350000, stock: 23, categoria: 'Electrónicos' },
  { name: 'Camiseta Vintage', ventas: 45000, stock: 78, categoria: 'Moda' },
  { name: 'Reloj Deportivo', ventas: 750000, stock: 12, categoria: 'Deportes' },
  { name: 'Libro de Cocina', ventas: 85000, stock: 34, categoria: 'Libros' },
];

const categoryData = [
  { name: 'Electrónicos', value: 40, color: '#8884d8' },
  { name: 'Moda', value: 30, color: '#82ca9d' },
  { name: 'Deportes', value: 20, color: '#ffc658' },
  { name: 'Libros', value: 10, color: '#ff7300' },
];

const recentOrders = [
  { id: '001', cliente: 'María García', producto: 'Smartphone XYZ', monto: 2850000, estado: 'entregado', fecha: '2024-01-15' },
  { id: '002', cliente: 'Carlos López', producto: 'Auriculares Bluetooth', monto: 350000, estado: 'enviado', fecha: '2024-01-14' },
  { id: '003', cliente: 'Ana Martínez', producto: 'Camiseta Vintage', monto: 45000, estado: 'procesando', fecha: '2024-01-14' },
  { id: '004', cliente: 'Luis Rodríguez', producto: 'Reloj Deportivo', monto: 750000, estado: 'pendiente', fecha: '2024-01-13' },
];

export function VendorDashboard({ user }: VendorDashboardProps) {
  const [timeRange, setTimeRange] = useState('6m');
  const [kpis, setKpis] = useState({
    totalSales: 108500000,
    totalOrders: 190,
    avgOrderValue: 571052,
    conversionRate: 3.2,
    totalProducts: 87,
    totalCustomers: 1456,
    rating: 4.8,
    totalViews: 8900
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      'entregado': 'default',
      'enviado': 'secondary',
      'procesando': 'outline',
      'pendiente': 'destructive'
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl">Bienvenido, {user.name}</h1>
          <p className="text-muted-foreground">
            Resumen de tu actividad comercial
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Último mes
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <LogoutButton variant="outline" size="sm" />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(kpis.totalSales)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12.5% del mes pasado
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +8.2% del mes pasado
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Promedio</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(kpis.avgOrderValue)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600 flex items-center">
                <TrendingDown className="h-3 w-3 mr-1" />
                -2.1% del mes pasado
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa Conversión</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +0.3% del mes pasado
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs para diferentes vistas */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="analytics">Analíticas</TabsTrigger>
          <TabsTrigger value="performance">Rendimiento</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Gráfico de ventas */}
            <Card>
              <CardHeader>
                <CardTitle>Tendencia de Ventas</CardTitle>
                <CardDescription>
                  Ventas de los últimos 6 meses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [
                      name === 'ventas' ? formatCurrency(value as number) : value,
                      name === 'ventas' ? 'Ventas' : name === 'pedidos' ? 'Pedidos' : 'Visitantes'
                    ]} />
                    <Area type="monotone" dataKey="ventas" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Distribución por categorías */}
            <Card>
              <CardHeader>
                <CardTitle>Ventas por Categoría</CardTitle>
                <CardDescription>
                  Distribución de ingresos por categoría
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Pedidos recientes */}
          <Card>
            <CardHeader>
              <CardTitle>Pedidos Recientes</CardTitle>
              <CardDescription>
                Últimas transacciones de tu tienda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback>{order.cliente.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{order.cliente}</p>
                        <p className="text-sm text-muted-foreground">{order.producto}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(order.monto)}</p>
                        <p className="text-sm text-muted-foreground">{order.fecha}</p>
                      </div>
                      {getStatusBadge(order.estado)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Métricas adicionales */}
            <Card>
              <CardHeader>
                <CardTitle>Métricas de Engagement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span>Productos activos</span>
                  </div>
                  <span className="font-bold">{kpis.totalProducts}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>Clientes únicos</span>
                  </div>
                  <span className="font-bold">{kpis.totalCustomers.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-muted-foreground" />
                    <span>Calificación promedio</span>
                  </div>
                  <span className="font-bold">{kpis.rating}/5</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span>Visualizaciones</span>
                  </div>
                  <span className="font-bold">{kpis.totalViews.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* Progreso hacia objetivos */}
            <Card>
              <CardHeader>
                <CardTitle>Objetivos del Mes</CardTitle>
                <CardDescription>Tu progreso hacia las metas mensuales</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Ventas ({formatCurrency(29700)} / {formatCurrency(35000)})</span>
                    <span>85%</span>
                  </div>
                  <Progress value={85} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Pedidos (190 / 200)</span>
                    <span>95%</span>
                  </div>
                  <Progress value={95} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Nuevos clientes (45 / 60)</span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          {/* Top productos */}
          <Card>
            <CardHeader>
              <CardTitle>Productos con Mejor Rendimiento</CardTitle>
              <CardDescription>
                Productos ordenados por ventas en el último mes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {productPerformance.map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.categoria}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(product.ventas)}</p>
                      <p className="text-sm text-muted-foreground">Stock: {product.stock}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}