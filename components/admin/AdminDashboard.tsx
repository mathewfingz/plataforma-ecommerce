import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Progress } from '../ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LogoutButton } from '../auth/LogoutButton';
import { 
  Users, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp, 
  Store, 
  Package,
  AlertTriangle,
  CheckCircle,
  Crown,
  Settings
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'tienda' | 'admin';
  shopifyConnected?: boolean;
}

interface AdminDashboardProps {
  user: User;
}

// Datos mock para el panel de administrador
const platformStats = {
  totalVendors: 1247,
  activeVendors: 892,
  totalSales: 11390372000,
  monthlyGrowth: 15.3,
  totalProducts: 45621,
  totalOrders: 12893,
  avgCommission: 8.5,
  platformRevenue: 967380000
};

const topVendors = [
  { id: '1', name: 'TechStore Pro', email: 'tech@store.com', sales: 500000000, commission: 50000000, products: 89, status: 'active', tier: 'Platino' },
  { id: '2', name: 'Fashion Hub', email: 'fashion@hub.com', sales: 392000000, commission: 47040000, products: 156, status: 'active', tier: 'Oro' },
  { id: '3', name: 'Sports World', email: 'sports@world.com', sales: 312000000, commission: 31200000, products: 234, status: 'active', tier: 'Oro' },
  { id: '4', name: 'Home Essentials', email: 'home@essentials.com', sales: 260000000, commission: 39000000, products: 98, status: 'pending', tier: 'Plata' },
  { id: '5', name: 'Beauty Corner', email: 'beauty@corner.com', sales: 208000000, commission: 37440000, products: 67, status: 'active', tier: 'Plata' }
];

const salesData = [
  { month: 'Ene', ventas: 720000000, vendedores: 145, pedidos: 890 },
  { month: 'Feb', ventas: 840000000, vendedores: 167, pedidos: 1020 },
  { month: 'Mar', ventas: 960000000, vendedores: 189, pedidos: 1150 },
  { month: 'Abr', ventas: 1120000000, vendedores: 201, pedidos: 1340 },
  { month: 'May', ventas: 1280000000, vendedores: 234, pedidos: 1560 },
  { month: 'Jun', ventas: 1460000000, vendedores: 267, pedidos: 1780 }
];

const categoryData = [
  { name: 'Electrónicos', value: 35, revenue: 3980000000, color: '#8884d8' },
  { name: 'Moda', value: 28, revenue: 3192000000, color: '#82ca9d' },
  { name: 'Hogar', value: 20, revenue: 2280000000, color: '#ffc658' },
  { name: 'Deportes', value: 10, revenue: 1140000000, color: '#ff7300' },
  { name: 'Belleza', value: 7, revenue: 798000000, color: '#00ff88' }
];

const recentActivity = [
  { id: '1', type: 'new_vendor', vendor: 'Digital Solutions', message: 'Nuevo vendedor registrado', time: '5 min', status: 'pending' },
  { id: '2', type: 'payout', vendor: 'TechStore Pro', message: 'Pago procesado: $5,000,000', time: '12 min', status: 'completed' },
  { id: '3', type: 'dispute', vendor: 'Fashion Hub', message: 'Disputa reportada: Pedido #12845', time: '23 min', status: 'pending' },
  { id: '4', type: 'milestone', vendor: 'Sports World', message: 'Alcanzó nivel Oro', time: '1h', status: 'completed' },
  { id: '5', type: 'alert', vendor: 'Home Essentials', message: 'Stock bajo en 3 productos', time: '2h', status: 'warning' }
];

export function AdminDashboard({ user }: AdminDashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount).replace('COP', '$');
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'active': { variant: 'default' as const, label: 'Activo' },
      'pending': { variant: 'secondary' as const, label: 'Pendiente' },
      'suspended': { variant: 'destructive' as const, label: 'Suspendido' },
      'completed': { variant: 'default' as const, label: 'Completado' },
      'warning': { variant: 'destructive' as const, label: 'Alerta' }
    };
    
    const statusInfo = variants[status as keyof typeof variants] || variants.active;
    
    return (
      <Badge variant={statusInfo.variant}>
        {statusInfo.label}
      </Badge>
    );
  };

  const getTierBadge = (tier: string) => {
    const colors = {
      'Bronce': 'bg-amber-100 text-amber-800',
      'Plata': 'bg-gray-100 text-gray-800',
      'Oro': 'bg-yellow-100 text-yellow-800',
      'Platino': 'bg-purple-100 text-purple-800'
    };

    return (
      <Badge className={colors[tier as keyof typeof colors] || colors.Bronce}>
        <Crown className="h-3 w-3 mr-1" />
        {tier}
      </Badge>
    );
  };

  const getActivityIcon = (type: string) => {
    const icons = {
      'new_vendor': Users,
      'payout': DollarSign,
      'dispute': AlertTriangle,
      'milestone': TrendingUp,
      'alert': AlertTriangle
    };

    const Icon = icons[type as keyof typeof icons] || Users;
    return <Icon className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl">Panel de Administración</h1>
          <p className="text-muted-foreground">
            Resumen general de la plataforma marketplace
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configuración
          </Button>
          <LogoutButton variant="outline" size="sm" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendedores Totales</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{platformStats.totalVendors.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">
                {platformStats.activeVendors} activos ({Math.round((platformStats.activeVendors / platformStats.totalVendors) * 100)}%)
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(platformStats.totalSales)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{platformStats.monthlyGrowth}% este mes
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{platformStats.totalProducts.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Promedio: {Math.round(platformStats.totalProducts / platformStats.activeVendors)} por vendedor
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Plataforma</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(platformStats.platformRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              Comisión promedio: {platformStats.avgCommission}%
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="vendors">Vendedores</TabsTrigger>
          <TabsTrigger value="analytics">Analíticas</TabsTrigger>
          <TabsTrigger value="activity">Actividad</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Gráfico de crecimiento */}
            <Card>
              <CardHeader>
                <CardTitle>Crecimiento de la Plataforma</CardTitle>
                <CardDescription>
                  Evolución de ventas y vendedores activos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [
                      name === 'ventas' ? formatCurrency(value as number) : value,
                      name === 'ventas' ? 'Ventas' : name === 'vendedores' ? 'Vendedores' : 'Pedidos'
                    ]} />
                    <Line type="monotone" dataKey="ventas" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="vendedores" stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Distribución por categorías */}
            <Card>
              <CardHeader>
                <CardTitle>Ingresos por Categoría</CardTitle>
                <CardDescription>
                  Distribución de ventas por sector
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
                    <Tooltip formatter={(value, name) => [
                      `${value}%`,
                      'Participación'
                    ]} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="vendors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Vendedores</CardTitle>
              <CardDescription>
                Vendedores con mejor rendimiento del mes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendedor</TableHead>
                    <TableHead>Ventas</TableHead>
                    <TableHead>Comisión</TableHead>
                    <TableHead>Productos</TableHead>
                    <TableHead>Nivel</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topVendors.map((vendor) => (
                    <TableRow key={vendor.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {vendor.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{vendor.name}</p>
                            <p className="text-sm text-muted-foreground">{vendor.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{formatCurrency(vendor.sales)}</TableCell>
                      <TableCell className="text-green-600">{formatCurrency(vendor.commission)}</TableCell>
                      <TableCell>{vendor.products}</TableCell>
                      <TableCell>{getTierBadge(vendor.tier)}</TableCell>
                      <TableCell>{getStatusBadge(vendor.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {categoryData.map((category) => (
              <Card key={category.name}>
                <CardHeader>
                  <CardTitle className="text-base">{category.name}</CardTitle>
                  <CardDescription>
                    {category.value}% del total
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Ingresos</span>
                      <span className="font-medium">{formatCurrency(category.revenue)}</span>
                    </div>
                    <Progress value={category.value} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      Crecimiento mensual estimado
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
              <CardDescription>
                Eventos y notificaciones de la plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                    <div className="p-2 bg-muted rounded-full">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.vendor}</p>
                      <p className="text-sm text-muted-foreground">{activity.message}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{activity.time}</p>
                      {getStatusBadge(activity.status)}
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