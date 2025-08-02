import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Bell, 
  Check, 
  X, 
  Settings, 
  Mail, 
  Smartphone,
  AlertTriangle,
  Info,
  CheckCircle,
  Package,
  DollarSign,
  TrendingDown
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'vendor' | 'admin' | 'staff';
}

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  category: 'order' | 'inventory' | 'payment' | 'system' | 'marketing';
}

interface NotificationSettings {
  email: boolean;
  push: boolean;
  categories: {
    orders: boolean;
    inventory: boolean;
    payments: boolean;
    marketing: boolean;
    system: boolean;
  };
}

interface NotificationCenterProps {
  user: User;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'warning',
    title: 'Stock bajo',
    message: 'El producto "Smartphone XYZ" tiene solo 5 unidades restantes',
    timestamp: '2024-01-16T10:30:00Z',
    read: false,
    category: 'inventory'
  },
  {
    id: '2',
    type: 'success',
    title: 'Nuevo pedido',
    message: 'Pedido #12345 por €156.99 de Ana García',
    timestamp: '2024-01-16T09:15:00Z',
    read: false,
    category: 'order'
  },
  {
    id: '3',
    type: 'info',
    title: 'Pago procesado',
    message: 'Comisión de €245.80 transferida a tu cuenta',
    timestamp: '2024-01-16T08:00:00Z',
    read: true,
    category: 'payment'
  },
  {
    id: '4',
    type: 'error',
    title: 'Fallo en sincronización',
    message: 'Error al sincronizar con Shopify. Reintenta en unos minutos.',
    timestamp: '2024-01-15T16:45:00Z',
    read: false,
    category: 'system'
  },
  {
    id: '5',
    type: 'success',
    title: 'Campaña exitosa',
    message: 'Tu campaña "Verano 2024" logró 24.5% de apertura',
    timestamp: '2024-01-15T14:20:00Z',
    read: true,
    category: 'marketing'
  }
];

export function NotificationCenter({ user }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [settings, setSettings] = useState<NotificationSettings>({
    email: true,
    push: true,
    categories: {
      orders: true,
      inventory: true,
      payments: true,
      marketing: false,
      system: true
    }
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'error': return <X className="h-4 w-4 text-red-600" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'info': return <Info className="h-4 w-4 text-blue-600" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'order': return <Package className="h-4 w-4" />;
      case 'payment': return <DollarSign className="h-4 w-4" />;
      case 'inventory': return <TrendingDown className="h-4 w-4" />;
      case 'marketing': return <Mail className="h-4 w-4" />;
      case 'system': return <Settings className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Hace unos minutos';
    if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    if (diffDays < 7) return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
    
    return date.toLocaleDateString('es-ES');
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === notificationId ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl">Centro de Notificaciones</h1>
          <p className="text-muted-foreground">
            Gestiona tus notificaciones y preferencias
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {unreadCount} sin leer
          </Badge>
          <Button variant="outline" onClick={markAllAsRead}>
            <Check className="h-4 w-4 mr-2" />
            Marcar todas leídas
          </Button>
        </div>
      </div>

      <Tabs defaultValue="notifications" className="space-y-4">
        <TabsList>
          <TabsTrigger value="notifications">
            Notificaciones ({notifications.length})
          </TabsTrigger>
          <TabsTrigger value="settings">Configuración</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-4">
          {notifications.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No hay notificaciones</h3>
                <p className="text-muted-foreground">
                  Te notificaremos cuando haya nuevas actualizaciones
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <Card 
                  key={notification.id} 
                  className={`transition-all ${!notification.read ? 'border-l-4 border-l-primary bg-primary/5' : ''}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{notification.title}</h4>
                            {!notification.read && (
                              <Badge variant="secondary" className="text-xs">
                                Nuevo
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              {getCategoryIcon(notification.category)}
                              <span className="capitalize">{notification.category}</span>
                            </div>
                            <span>{formatTimestamp(notification.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Canales de Notificación</CardTitle>
              <CardDescription>
                Configura cómo quieres recibir las notificaciones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">
                      Recibir notificaciones por email
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.email}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, email: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Smartphone className="h-4 w-4" />
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Notificaciones en el navegador
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.push}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, push: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Categorías</CardTitle>
              <CardDescription>
                Selecciona qué tipos de notificaciones quieres recibir
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries({
                orders: 'Pedidos',
                inventory: 'Inventario',
                payments: 'Pagos',
                marketing: 'Marketing',
                system: 'Sistema'
              }).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getCategoryIcon(key)}
                    <div>
                      <p className="font-medium">{label}</p>
                      <p className="text-sm text-muted-foreground">
                        Notificaciones relacionadas con {label.toLowerCase()}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.categories[key as keyof typeof settings.categories]}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({
                        ...prev,
                        categories: { ...prev.categories, [key]: checked }
                      }))
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Horarios</CardTitle>
              <CardDescription>
                Configura cuándo recibir notificaciones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Modo silencio nocturno</p>
                    <p className="text-sm text-muted-foreground">
                      No recibir notificaciones entre 22:00 y 8:00
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Solo días laborables</p>
                    <p className="text-sm text-muted-foreground">
                      Pausar notificaciones de marketing los fines de semana
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}