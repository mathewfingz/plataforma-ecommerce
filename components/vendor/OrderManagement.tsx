import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Progress } from '../ui/progress';
import { 
  Search, 
  Filter, 
  Eye, 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle,
  Clock,
  MapPin,
  Phone,
  Mail,
  Download,
  Calendar
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'tienda' | 'admin';
  shopifyConnected?: boolean;
}

interface OrderItem {
  id: string;
  productName: string;
  productSku: string;
  quantity: number;
  price: number;
  total: number;
}

interface Order {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    avatar?: string;
  };
  items: OrderItem[];
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  total: number;
  shippingCost: number;
  tax: number;
  commission: number;
  createdAt: string;
  updatedAt: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  notes?: string;
}

interface OrderManagementProps {
  user: User;
}

// Datos mock de pedidos
const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    customer: {
      name: 'María García',
      email: 'maria.garcia@email.com',
      phone: '+34 612 345 678'
    },
    items: [
      {
        id: '1',
        productName: 'Smartphone Galaxy Pro',
        productSku: 'SGP-001',
        quantity: 1,
        price: 799,
        total: 799
      }
    ],
    status: 'delivered',
    paymentStatus: 'paid',
    shippingAddress: {
      street: 'Calle Mayor 123, 2º A',
      city: 'Madrid',
      state: 'Madrid',
      zipCode: '28001',
      country: 'España'
    },
    total: 842.79,
    shippingCost: 5.99,
    tax: 167.58,
    commission: 79.90,
    createdAt: '2024-01-10T10:30:00Z',
    updatedAt: '2024-01-15T14:20:00Z',
    trackingNumber: 'TRK123456789',
    estimatedDelivery: '2024-01-16'
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    customer: {
      name: 'Carlos López',
      email: 'carlos.lopez@email.com',
      phone: '+34 698 765 432'
    },
    items: [
      {
        id: '2',
        productName: 'Auriculares Bluetooth Pro',
        productSku: 'ABP-002',
        quantity: 2,
        price: 199,
        total: 398
      }
    ],
    status: 'shipped',
    paymentStatus: 'paid',
    shippingAddress: {
      street: 'Avenida de la Constitución 45',
      city: 'Sevilla',
      state: 'Andalucía',
      zipCode: '41001',
      country: 'España'
    },
    total: 421.58,
    shippingCost: 7.99,
    tax: 83.58,
    commission: 39.80,
    createdAt: '2024-01-12T16:45:00Z',
    updatedAt: '2024-01-14T09:15:00Z',
    trackingNumber: 'TRK987654321',
    estimatedDelivery: '2024-01-17'
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    customer: {
      name: 'Ana Martínez',
      email: 'ana.martinez@email.com',
      phone: '+34 623 456 789'
    },
    items: [
      {
        id: '3',
        productName: 'Camiseta Vintage Retro',
        productSku: 'CVR-003',
        quantity: 3,
        price: 29,
        total: 87
      }
    ],
    status: 'processing',
    paymentStatus: 'paid',
    shippingAddress: {
      street: 'Plaza del Sol 12',
      city: 'Barcelona',
      state: 'Cataluña',
      zipCode: '08001',
      country: 'España'
    },
    total: 92.27,
    shippingCost: 3.99,
    tax: 18.27,
    commission: 8.70,
    createdAt: '2024-01-14T11:20:00Z',
    updatedAt: '2024-01-14T11:20:00Z'
  },
  {
    id: '4',
    orderNumber: 'ORD-2024-004',
    customer: {
      name: 'Luis Rodríguez',
      email: 'luis.rodriguez@email.com',
      phone: '+34 654 321 987'
    },
    items: [
      {
        id: '4',
        productName: 'Reloj Deportivo Smart',
        productSku: 'RDS-004',
        quantity: 1,
        price: 299,
        total: 299
      }
    ],
    status: 'pending',
    paymentStatus: 'pending',
    shippingAddress: {
      street: 'Calle de Alcalá 200',
      city: 'Madrid',
      state: 'Madrid',
      zipCode: '28028',
      country: 'España'
    },
    total: 317.89,
    shippingCost: 5.99,
    tax: 62.79,
    commission: 29.90,
    createdAt: '2024-01-15T14:30:00Z',
    updatedAt: '2024-01-15T14:30:00Z'
  }
];

export function OrderManagement({ user }: OrderManagementProps) {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    const variants = {
      'pending': { variant: 'secondary' as const, label: 'Pendiente', icon: Clock },
      'confirmed': { variant: 'default' as const, label: 'Confirmado', icon: CheckCircle },
      'processing': { variant: 'outline' as const, label: 'Procesando', icon: Package },
      'shipped': { variant: 'default' as const, label: 'Enviado', icon: Truck },
      'delivered': { variant: 'default' as const, label: 'Entregado', icon: CheckCircle },
      'cancelled': { variant: 'destructive' as const, label: 'Cancelado', icon: XCircle }
    };
    
    const statusInfo = variants[status as keyof typeof variants] || variants.pending;
    const Icon = statusInfo.icon;
    
    return (
      <Badge variant={statusInfo.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {statusInfo.label}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    const variants = {
      'pending': { variant: 'secondary' as const, label: 'Pendiente' },
      'paid': { variant: 'default' as const, label: 'Pagado' },
      'failed': { variant: 'destructive' as const, label: 'Fallido' },
      'refunded': { variant: 'outline' as const, label: 'Reembolsado' }
    };
    
    const statusInfo = variants[status as keyof typeof variants] || variants.pending;
    
    return (
      <Badge variant={statusInfo.variant}>
        {statusInfo.label}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    const matchesPaymentStatus = selectedPaymentStatus === 'all' || order.paymentStatus === selectedPaymentStatus;
    
    return matchesSearch && matchesStatus && matchesPaymentStatus;
  });

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
        : order
    ));
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailDialogOpen(true);
  };

  const getOrderProgress = (status: string) => {
    const steps = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    const currentStep = steps.indexOf(status);
    return ((currentStep + 1) / steps.length) * 100;
  };

  // Estadísticas
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const shippedOrders = orders.filter(o => o.status === 'shipped').length;
  const totalRevenue = orders.filter(o => o.paymentStatus === 'paid').reduce((sum, o) => sum + o.total, 0);
  const totalCommissions = orders.filter(o => o.paymentStatus === 'paid').reduce((sum, o) => sum + o.commission, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl">Gestión de Pedidos</h1>
          <p className="text-muted-foreground">
            Administra y da seguimiento a todos tus pedidos
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Filtrar fechas
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pedidos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              Este mes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{pendingOrders}</div>
            <p className="text-xs text-muted-foreground">
              Requieren atención
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enviados</CardTitle>
            <Truck className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{shippedOrders}</div>
            <p className="text-xs text-muted-foreground">
              En tránsito
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              Comisiones: {formatCurrency(totalCommissions)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por número de pedido, cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Estado del pedido" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="pending">Pendiente</SelectItem>
                <SelectItem value="confirmed">Confirmado</SelectItem>
                <SelectItem value="processing">Procesando</SelectItem>
                <SelectItem value="shipped">Enviado</SelectItem>
                <SelectItem value="delivered">Entregado</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedPaymentStatus} onValueChange={setSelectedPaymentStatus}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Estado del pago" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los pagos</SelectItem>
                <SelectItem value="pending">Pendiente</SelectItem>
                <SelectItem value="paid">Pagado</SelectItem>
                <SelectItem value="failed">Fallido</SelectItem>
                <SelectItem value="refunded">Reembolsado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Pedidos ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pedido</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Productos</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Pago</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.orderNumber}</p>
                        {order.trackingNumber && (
                          <p className="text-sm text-muted-foreground">
                            Track: {order.trackingNumber}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {order.customer.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{order.customer.name}</p>
                          <p className="text-sm text-muted-foreground">{order.customer.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.items.length} artículo(s)</p>
                        <p className="text-sm text-muted-foreground">
                          {order.items[0].productName}
                          {order.items.length > 1 && ` +${order.items.length - 1} más`}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{formatCurrency(order.total)}</p>
                        <p className="text-sm text-muted-foreground">
                          Comisión: {formatCurrency(order.commission)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>{getPaymentStatusBadge(order.paymentStatus)}</TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{formatDate(order.createdAt)}</p>
                        {order.estimatedDelivery && (
                          <p className="text-xs text-muted-foreground">
                            Est: {new Date(order.estimatedDelivery).toLocaleDateString('es-ES')}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleViewOrder(order)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Select
                          value={order.status}
                          onValueChange={(value) => updateOrderStatus(order.id, value as Order['status'])}
                        >
                          <SelectTrigger className="w-[120px] h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pendiente</SelectItem>
                            <SelectItem value="confirmed">Confirmado</SelectItem>
                            <SelectItem value="processing">Procesando</SelectItem>
                            <SelectItem value="shipped">Enviado</SelectItem>
                            <SelectItem value="delivered">Entregado</SelectItem>
                            <SelectItem value="cancelled">Cancelado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>Pedido {selectedOrder.orderNumber}</span>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(selectedOrder.status)}
                    {getPaymentStatusBadge(selectedOrder.paymentStatus)}
                  </div>
                </DialogTitle>
                <DialogDescription>
                  Creado el {formatDate(selectedOrder.createdAt)}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progreso del pedido</span>
                    <span>{Math.round(getOrderProgress(selectedOrder.status))}%</span>
                  </div>
                  <Progress value={getOrderProgress(selectedOrder.status)} />
                </div>

                <Tabs defaultValue="details" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="details">Detalles</TabsTrigger>
                    <TabsTrigger value="customer">Cliente</TabsTrigger>
                    <TabsTrigger value="shipping">Envío</TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="space-y-4">
                    {/* Order Items */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Productos</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {selectedOrder.items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                              <div>
                                <p className="font-medium">{item.productName}</p>
                                <p className="text-sm text-muted-foreground">SKU: {item.productSku}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">
                                  {item.quantity} × {formatCurrency(item.price)} = {formatCurrency(item.total)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Order Summary */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Resumen del pedido</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>{formatCurrency(selectedOrder.total - selectedOrder.shippingCost - selectedOrder.tax)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Envío</span>
                            <span>{formatCurrency(selectedOrder.shippingCost)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Impuestos</span>
                            <span>{formatCurrency(selectedOrder.tax)}</span>
                          </div>
                          <div className="flex justify-between font-bold border-t pt-2">
                            <span>Total</span>
                            <span>{formatCurrency(selectedOrder.total)}</span>
                          </div>
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Tu comisión</span>
                            <span>{formatCurrency(selectedOrder.commission)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="customer" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Información del cliente</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center space-x-4">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback>
                                {selectedOrder.customer.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{selectedOrder.customer.name}</p>
                              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <Mail className="h-4 w-4" />
                                <span>{selectedOrder.customer.email}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <Phone className="h-4 w-4" />
                                <span>{selectedOrder.customer.phone}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="shipping" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Dirección de envío</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-start space-x-2">
                          <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                          <div>
                            <p>{selectedOrder.shippingAddress.street}</p>
                            <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}</p>
                            <p>{selectedOrder.shippingAddress.zipCode}</p>
                            <p>{selectedOrder.shippingAddress.country}</p>
                          </div>
                        </div>
                        {selectedOrder.trackingNumber && (
                          <div className="mt-4 p-3 bg-muted rounded-lg">
                            <p className="text-sm font-medium">Número de seguimiento</p>
                            <p className="font-mono">{selectedOrder.trackingNumber}</p>
                          </div>
                        )}
                        {selectedOrder.estimatedDelivery && (
                          <div className="mt-4 p-3 bg-muted rounded-lg">
                            <p className="text-sm font-medium">Entrega estimada</p>
                            <p>{new Date(selectedOrder.estimatedDelivery).toLocaleDateString('es-ES', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
                  Cerrar
                </Button>
                <Button>
                  Actualizar Estado
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}