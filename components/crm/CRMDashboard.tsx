import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { 
  Search, 
  Filter, 
  Plus,
  Users, 
  TrendingUp,
  TrendingDown,
  Heart,
  DollarSign,
  UserPlus
} from 'lucide-react';

import { CustomerList } from './components/CustomerList';
import { CustomerSegments } from './components/CustomerSegments';
import { AutomationFlows } from './components/AutomationFlows';

import { Customer, CRMAutomation } from './types/crm-types';
import { MOCK_CUSTOMERS, CUSTOMER_SEGMENTS, CRM_AUTOMATIONS, CRM_METRICS } from './constants/crm-data';
import { filterCustomers, formatCurrency } from './utils/crm-utils';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'vendor' | 'admin' | 'staff';
}

interface CRMDashboardProps {
  user: User;
}

export function CRMDashboard({ user }: CRMDashboardProps) {
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [automations, setAutomations] = useState<CRMAutomation[]>(CRM_AUTOMATIONS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [selectedTag, setSelectedTag] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showCustomerDialog, setShowCustomerDialog] = useState(false);

  const filteredCustomers = filterCustomers(customers, searchTerm, selectedSegment, selectedTag);

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowCustomerDialog(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowCustomerDialog(true);
  };

  const handleToggleAutomation = (automationId: string) => {
    setAutomations(prev => prev.map(automation => 
      automation.id === automationId 
        ? { ...automation, status: automation.status === 'active' ? 'paused' : 'active' }
        : automation
    ));
  };

  const handleEditAutomation = (automation: CRMAutomation) => {
    console.log('Edit automation:', automation);
  };

  const handleCreateAutomation = () => {
    console.log('Create new automation');
  };

  // Obtener tags únicos
  const allTags = Array.from(new Set(customers.flatMap(c => c.tags)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl">CRM & Gestión de Clientes</h1>
          <p className="text-muted-foreground">
            Gestiona relaciones con clientes, segmentación y automatizaciones
          </p>
        </div>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Nuevo Cliente
        </Button>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{CRM_METRICS.totalCustomers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{CRM_METRICS.newCustomers} este mes
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">LTV Promedio</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(CRM_METRICS.avgLifetimeValue)}</div>
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
            <CardTitle className="text-sm font-medium">Retención</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{CRM_METRICS.customerRetention}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +2.1% vs mes anterior
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
            <div className="text-2xl font-bold">{CRM_METRICS.churnRate}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingDown className="h-3 w-3 mr-1" />
                -0.5% vs mes anterior
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="customers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="customers">Clientes</TabsTrigger>
          <TabsTrigger value="segments">Segmentación</TabsTrigger>
          <TabsTrigger value="automation">Automatización</TabsTrigger>
          <TabsTrigger value="analytics">Análisis</TabsTrigger>
        </TabsList>

        <TabsContent value="customers" className="space-y-4">
          {/* Filtros */}
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
                      placeholder="Buscar clientes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Select value={selectedSegment} onValueChange={setSelectedSegment}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Segmento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los segmentos</SelectItem>
                    <SelectItem value="vip">VIP</SelectItem>
                    <SelectItem value="loyal">Leales</SelectItem>
                    <SelectItem value="new">Nuevos</SelectItem>
                    <SelectItem value="at_risk">En riesgo</SelectItem>
                    <SelectItem value="lost">Perdidos</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedTag} onValueChange={setSelectedTag}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Etiqueta" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las etiquetas</SelectItem>
                    {allTags.map(tag => (
                      <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <CustomerList
            customers={filteredCustomers}
            onViewCustomer={handleViewCustomer}
            onEditCustomer={handleEditCustomer}
          />
        </TabsContent>

        <TabsContent value="segments" className="space-y-4">
          <CustomerSegments segments={CUSTOMER_SEGMENTS} customers={customers} />
        </TabsContent>

        <TabsContent value="automation" className="space-y-4">
          <AutomationFlows
            automations={automations}
            onToggleAutomation={handleToggleAutomation}
            onEditAutomation={handleEditAutomation}
            onCreateAutomation={handleCreateAutomation}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Satisfacción del Cliente</CardTitle>
                <CardDescription>
                  Puntuación promedio de satisfacción
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    {CRM_METRICS.customerSatisfaction}/5
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Basado en {customers.length} evaluaciones
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tendencias de Crecimiento</CardTitle>
                <CardDescription>
                  Adquisición de clientes mes a mes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Nuevos clientes</span>
                    <Badge variant="outline">+{CRM_METRICS.newCustomers}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Clientes reactivados</span>
                    <Badge variant="outline">+89</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Clientes perdidos</span>
                    <Badge variant="destructive">-23</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog de detalle del cliente */}
      <Dialog open={showCustomerDialog} onOpenChange={setShowCustomerDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedCustomer ? `Cliente: ${selectedCustomer.name}` : 'Detalle del Cliente'}
            </DialogTitle>
            <DialogDescription>
              Información completa y historial del cliente
            </DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm">{selectedCustomer.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Teléfono</Label>
                  <p className="text-sm">{selectedCustomer.phone || 'No disponible'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Total gastado</Label>
                  <p className="text-sm font-semibold">{formatCurrency(selectedCustomer.totalSpent)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Pedidos totales</Label>
                  <p className="text-sm">{selectedCustomer.totalOrders}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Etiquetas</Label>
                <div className="flex gap-1 mt-1">
                  {selectedCustomer.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}