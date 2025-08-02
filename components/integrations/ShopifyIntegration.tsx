import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Alert, AlertDescription } from '../ui/alert';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  Store, 
  CheckCircle, 
  AlertTriangle,
  RefreshCw,
  Settings,
  Package,
  Users,
  ShoppingCart,
  Zap,
  Link,
  Unlink,
  Download,
  Upload,
  Clock
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'vendor' | 'admin' | 'staff';
  shopifyConnected?: boolean;
}

interface ShopifyStore {
  id: string;
  name: string;
  domain: string;
  email: string;
  currency: string;
  timezone: string;
  plan: string;
}

interface SyncStatus {
  products: { total: number; synced: number; errors: number; lastSync: string };
  orders: { total: number; synced: number; errors: number; lastSync: string };
  customers: { total: number; synced: number; errors: number; lastSync: string };
  inventory: { total: number; synced: number; errors: number; lastSync: string };
}

interface ShopifyIntegrationProps {
  user: User;
}

const mockShopifyStore: ShopifyStore = {
  id: 'shop_123',
  name: 'Mi Tienda Online',
  domain: 'mi-tienda.myshopify.com',
  email: 'contacto@mi-tienda.com',
  currency: 'EUR',
  timezone: 'Europe/Madrid',
  plan: 'Basic Shopify'
};

const mockSyncStatus: SyncStatus = {
  products: { total: 234, synced: 230, errors: 4, lastSync: '2024-01-16T10:30:00Z' },
  orders: { total: 1250, synced: 1248, errors: 2, lastSync: '2024-01-16T10:25:00Z' },
  customers: { total: 890, synced: 890, errors: 0, lastSync: '2024-01-16T10:20:00Z' },
  inventory: { total: 234, synced: 228, errors: 6, lastSync: '2024-01-16T10:15:00Z' }
};

export function ShopifyIntegration({ user }: ShopifyIntegrationProps) {
  const [isConnected, setIsConnected] = useState(user.shopifyConnected || false);
  const [shopifyStore, setShopifyStore] = useState<ShopifyStore | null>(
    isConnected ? mockShopifyStore : null
  );
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(mockSyncStatus);
  const [isSyncing, setIsSyncing] = useState(false);
  const [connectionForm, setConnectionForm] = useState({
    shopDomain: '',
    accessToken: ''
  });
  const [syncSettings, setSyncSettings] = useState({
    autoSync: true,
    syncInterval: '15', // minutes
    syncProducts: true,
    syncOrders: true,
    syncCustomers: true,
    syncInventory: true
  });

  const handleConnect = async () => {
    setIsSyncing(true);
    // Simular conexión a Shopify
    setTimeout(() => {
      setIsConnected(true);
      setShopifyStore(mockShopifyStore);
      setIsSyncing(false);
    }, 2000);
  };

  const handleDisconnect = () => {
    if (confirm('¿Estás seguro de que quieres desconectar Shopify? Esto pausará toda sincronización.')) {
      setIsConnected(false);
      setShopifyStore(null);
    }
  };

  const handleSync = (type?: string) => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      // Actualizar timestamps de sincronización
      const now = new Date().toISOString();
      setSyncStatus(prev => ({
        ...prev,
        [type || 'products']: {
          ...prev[type as keyof SyncStatus || 'products'],
          lastSync: now
        }
      }));
    }, 3000);
  };

  const formatLastSync = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES');
  };

  const getSyncProgress = (item: { total: number; synced: number }) => {
    return item.total > 0 ? (item.synced / item.total) * 100 : 0;
  };

  if (!isConnected) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl">Integración con Shopify</h1>
          <p className="text-muted-foreground">
            Conecta tu tienda Shopify para sincronizar productos, pedidos e inventario
          </p>
        </div>

        <Card className="max-w-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
              <Store className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle>Conectar con Shopify</CardTitle>
            <CardDescription>
              Sincroniza automáticamente tu inventario y pedidos entre plataformas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-muted rounded-lg">
                <Package className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <h3 className="font-medium">Productos</h3>
                <p className="text-sm text-muted-foreground">Sincronización bidireccional</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <ShoppingCart className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <h3 className="font-medium">Pedidos</h3>
                <p className="text-sm text-muted-foreground">Importación automática</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <Users className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <h3 className="font-medium">Clientes</h3>
                <p className="text-sm text-muted-foreground">Base de datos unificada</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="shopDomain">Dominio de tu tienda</Label>
                <Input
                  id="shopDomain"
                  placeholder="mi-tienda.myshopify.com"
                  value={connectionForm.shopDomain}
                  onChange={(e) => setConnectionForm(prev => ({ ...prev, shopDomain: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="accessToken">Token de acceso</Label>
                <Input
                  id="accessToken"
                  type="password"
                  placeholder="shpat_..."
                  value={connectionForm.accessToken}
                  onChange={(e) => setConnectionForm(prev => ({ ...prev, accessToken: e.target.value }))}
                />
                <p className="text-xs text-muted-foreground">
                  Puedes generar un token desde tu panel de administración de Shopify
                </p>
              </div>
            </div>

            <Alert>
              <Zap className="h-4 w-4" />
              <AlertDescription>
                La conexión es segura y todos los datos se sincronizan de forma encriptada.
                Puedes desconectarte en cualquier momento.
              </AlertDescription>
            </Alert>

            <div className="flex gap-2">
              <Button 
                onClick={handleConnect} 
                disabled={isSyncing || !connectionForm.shopDomain}
                className="flex-1"
              >
                {isSyncing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Conectando...
                  </>
                ) : (
                  <>
                    <Link className="h-4 w-4 mr-2" />
                    Conectar Shopify
                  </>
                )}
              </Button>
              <Button variant="outline">
                Obtener Token
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl">Integración con Shopify</h1>
          <p className="text-muted-foreground">
            Configuración y sincronización con tu tienda Shopify
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="default" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Conectado
          </Badge>
          <Button variant="outline" onClick={() => handleSync()}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
            Sincronizar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="sync">Sincronización</TabsTrigger>
          <TabsTrigger value="settings">Configuración</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Store Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                Información de la Tienda
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Nombre</Label>
                  <p className="text-sm">{shopifyStore?.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Dominio</Label>
                  <p className="text-sm">{shopifyStore?.domain}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm">{shopifyStore?.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Plan</Label>
                  <p className="text-sm">{shopifyStore?.plan}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Moneda</Label>
                  <p className="text-sm">{shopifyStore?.currency}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Zona horaria</Label>
                  <p className="text-sm">{shopifyStore?.timezone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sync Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(syncStatus).map(([key, data]) => (
              <Card key={key}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium capitalize">
                    {key === 'products' ? 'Productos' : 
                     key === 'orders' ? 'Pedidos' :
                     key === 'customers' ? 'Clientes' : 'Inventario'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Sincronizado:</span>
                      <span className="font-medium">{data.synced}/{data.total}</span>
                    </div>
                    <Progress value={getSyncProgress(data)} className="h-2" />
                    {data.errors > 0 && (
                      <div className="flex items-center gap-1 text-sm text-destructive">
                        <AlertTriangle className="h-3 w-3" />
                        {data.errors} errores
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Última sync: {formatLastSync(data.lastSync)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sync" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sincronización Manual</CardTitle>
              <CardDescription>
                Fuerza la sincronización de datos específicos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Productos</Label>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Sincronizar productos</p>
                      <p className="text-xs text-muted-foreground">
                        Última sync: {formatLastSync(syncStatus.products.lastSync)}
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSync('products')}
                      disabled={isSyncing}
                    >
                      {isSyncing ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Pedidos</Label>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Sincronizar pedidos</p>
                      <p className="text-xs text-muted-foreground">
                        Última sync: {formatLastSync(syncStatus.orders.lastSync)}
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSync('orders')}
                      disabled={isSyncing}
                    >
                      {isSyncing ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Download className="h-3 w-3" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Clientes</Label>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Sincronizar clientes</p>
                      <p className="text-xs text-muted-foreground">
                        Última sync: {formatLastSync(syncStatus.customers.lastSync)}
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSync('customers')}
                      disabled={isSyncing}
                    >
                      {isSyncing ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Download className="h-3 w-3" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Inventario</Label>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Sincronizar inventario</p>
                      <p className="text-xs text-muted-foreground">
                        Última sync: {formatLastSync(syncStatus.inventory.lastSync)}
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSync('inventory')}
                      disabled={isSyncing}
                    >
                      {isSyncing ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Sincronización</CardTitle>
              <CardDescription>
                Ajusta cómo y cuándo se sincronizan los datos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Sincronización automática</p>
                  <p className="text-sm text-muted-foreground">
                    Sincronizar datos automáticamente en intervalos regulares
                  </p>
                </div>
                <Switch
                  checked={syncSettings.autoSync}
                  onCheckedChange={(checked) => setSyncSettings(prev => ({ ...prev, autoSync: checked }))}
                />
              </div>

              {syncSettings.autoSync && (
                <div className="space-y-2">
                  <Label htmlFor="syncInterval">Intervalo de sincronización</Label>
                  <Select 
                    value={syncSettings.syncInterval} 
                    onValueChange={(value) => setSyncSettings(prev => ({ ...prev, syncInterval: value }))}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">Cada 5 minutos</SelectItem>
                      <SelectItem value="15">Cada 15 minutos</SelectItem>
                      <SelectItem value="30">Cada 30 minutos</SelectItem>
                      <SelectItem value="60">Cada hora</SelectItem>
                      <SelectItem value="360">Cada 6 horas</SelectItem>
                      <SelectItem value="1440">Diariamente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-4">
                <Label>Tipos de datos a sincronizar</Label>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Productos</p>
                      <p className="text-sm text-muted-foreground">
                        Sincronizar información de productos e inventario
                      </p>
                    </div>
                    <Switch
                      checked={syncSettings.syncProducts}
                      onCheckedChange={(checked) => setSyncSettings(prev => ({ ...prev, syncProducts: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Pedidos</p>
                      <p className="text-sm text-muted-foreground">
                        Importar nuevos pedidos desde Shopify
                      </p>
                    </div>
                    <Switch
                      checked={syncSettings.syncOrders}
                      onCheckedChange={(checked) => setSyncSettings(prev => ({ ...prev, syncOrders: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Clientes</p>
                      <p className="text-sm text-muted-foreground">
                        Sincronizar información de clientes
                      </p>
                    </div>
                    <Switch
                      checked={syncSettings.syncCustomers}
                      onCheckedChange={(checked) => setSyncSettings(prev => ({ ...prev, syncCustomers: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Inventario</p>
                      <p className="text-sm text-muted-foreground">
                        Mantener niveles de stock sincronizados
                      </p>
                    </div>
                    <Switch
                      checked={syncSettings.syncInventory}
                      onCheckedChange={(checked) => setSyncSettings(prev => ({ ...prev, syncInventory: checked }))}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button variant="destructive" onClick={handleDisconnect}>
                  <Unlink className="h-4 w-4 mr-2" />
                  Desconectar Shopify
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}