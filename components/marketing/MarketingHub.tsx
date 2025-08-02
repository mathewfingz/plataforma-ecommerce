import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Progress } from '../ui/progress';
import { 
  Plus, 
  Mail, 
  Target, 
  Gift, 
  Zap,
  Users,
  ShoppingBag,
  TrendingUp,
  Calendar,
  Copy,
  Edit,
  Trash2,
  Play,
  Pause,
  BarChart3,
  Brain,
  Megaphone,
  Tag,
  Send,
  Eye,
  Clock
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'vendor' | 'admin' | 'staff';
}

interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed' | 'free_shipping';
  value: number;
  description: string;
  minOrder?: number;
  maxUses?: number;
  usedCount: number;
  validFrom: string;
  validTo: string;
  active: boolean;
  products?: string[];
  customers?: string[];
}

interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  type: 'newsletter' | 'promotion' | 'abandoned_cart' | 'welcome';
  status: 'draft' | 'scheduled' | 'sent' | 'paused' | 'active';
  recipients: number;
  openRate: number;
  clickRate: number;
  sentDate?: string;
  scheduledDate?: string;
}

interface AutomationFlow {
  id: string;
  name: string;
  trigger: 'cart_abandoned' | 'purchase' | 'signup' | 'birthday';
  status: 'active' | 'paused';
  triggers: number;
  conversions: number;
  revenue: number;
}

interface MarketingHubProps {
  user: User;
}

// Datos mock
const mockCoupons: Coupon[] = [
  {
    id: '1',
    code: 'VERANO2024',
    type: 'percentage',
    value: 20,
    description: 'Descuento de verano',
    minOrder: 50,
    maxUses: 1000,
    usedCount: 456,
    validFrom: '2024-06-01',
    validTo: '2024-08-31',
    active: true
  },
  {
    id: '2',
    code: 'ENVIOGRATIS',
    type: 'free_shipping',
    value: 0,
    description: 'Envío gratuito sin mínimo',
    maxUses: 500,
    usedCount: 234,
    validFrom: '2024-01-01',
    validTo: '2024-12-31',
    active: true
  },
  {
    id: '3',
    code: 'BIENVENIDO10',
    type: 'fixed',
    value: 10,
    description: 'Descuento de bienvenida',
    maxUses: 2000,
    usedCount: 1456,
    validFrom: '2024-01-01',
    validTo: '2024-12-31',
    active: true
  }
];

const mockCampaigns: EmailCampaign[] = [
  {
    id: '1',
    name: 'Newsletter Julio',
    subject: '🏖️ Ofertas de verano que no puedes perderte',
    type: 'newsletter',
    status: 'sent',
    recipients: 12450,
    openRate: 24.5,
    clickRate: 3.2,
    sentDate: '2024-07-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Black Friday Preview',
    subject: 'Acceso anticipado - Black Friday 2024',
    type: 'promotion',
    status: 'scheduled',
    recipients: 15600,
    openRate: 0,
    clickRate: 0,
    scheduledDate: '2024-11-25T08:00:00Z'
  },
  {
    id: '3',
    name: 'Recuperación de Carrito',
    subject: 'Tu carrito te está esperando 🛒',
    type: 'abandoned_cart',
    status: 'active',
    recipients: 3420,
    openRate: 45.8,
    clickRate: 12.3
  }
];

const mockAutomations: AutomationFlow[] = [
  {
    id: '1',
    name: 'Carrito Abandonado',
    trigger: 'cart_abandoned',
    status: 'active',
    triggers: 1250,
    conversions: 185,
    revenue: 15600
  },
  {
    id: '2',
    name: 'Bienvenida Nuevos Clientes',
    trigger: 'signup',
    status: 'active',
    triggers: 890,
    conversions: 234,
    revenue: 8950
  },
  {
    id: '3',
    name: 'Post-Compra Upsell',
    trigger: 'purchase',
    status: 'active',
    triggers: 456,
    conversions: 89,
    revenue: 12400
  }
];

export function MarketingHub({ user }: MarketingHubProps) {
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>(mockCampaigns);
  const [automations, setAutomations] = useState<AutomationFlow[]>(mockAutomations);
  const [showCouponDialog, setShowCouponDialog] = useState(false);
  const [showCampaignDialog, setShowCampaignDialog] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);

  const [couponForm, setCouponForm] = useState<{
    code: string;
    type: 'percentage' | 'fixed' | 'free_shipping';
    value: string;
    description: string;
    minOrder: string;
    maxUses: string;
    validFrom: string;
    validTo: string;
  }>({
    code: '',
    type: 'percentage',
    value: '',
    description: '',
    minOrder: '',
    maxUses: '',
    validFrom: '',
    validTo: ''
  });

  const [campaignForm, setCampaignForm] = useState({
    name: '',
    subject: '',
    content: '',
    type: 'newsletter' as const,
    segment: 'all'
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const generateCouponCode = () => {
    const prefix = couponForm.type === 'free_shipping' ? 'ENVIO' : 
                   couponForm.type === 'percentage' ? 'DESC' : 'EUROS';
    const suffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    setCouponForm(prev => ({ ...prev, code: `${prefix}${suffix}` }));
  };

  const generateAIContent = async (type: 'subject' | 'content') => {
    setAiGenerating(true);
    
    // Simular generación de IA
    setTimeout(() => {
      if (type === 'subject') {
        const subjects = [
          '🚀 ¡Nuevos productos que van a revolucionar tu día!',
          '💥 Ofertas exclusivas que terminan pronto',
          '✨ Descubre lo que todos están comprando',
          '🎯 Seleccionado especialmente para ti',
          '⚡ Flash Sale: Solo 24 horas'
        ];
        setCampaignForm(prev => ({ 
          ...prev, 
          subject: subjects[Math.floor(Math.random() * subjects.length)] 
        }));
      } else {
        const content = `Hola {{nombre}},

¡Tenemos excelentes noticias para ti! Hemos seleccionado una colección especial de productos que creemos que te van a encantar.

🔥 OFERTAS DESTACADAS:
• Smartphones con hasta 30% de descuento
• Auriculares premium con envío gratis
• Accesorios de moda con precios únicos

💡 ¿Sabías que? El 89% de nuestros clientes VIP compran estos productos durante la primera semana.

No te pierdas esta oportunidad limitada. 

[VER OFERTAS]

¡Gracias por confiar en nosotros!

El equipo de ${user.name}`;
        
        setCampaignForm(prev => ({ ...prev, content }));
      }
      setAiGenerating(false);
    }, 1500);
  };

  const createCoupon = () => {
    const newCoupon: Coupon = {
      id: Date.now().toString(),
      code: couponForm.code,
      type: couponForm.type,
      value: parseFloat(couponForm.value) || 0,
      description: couponForm.description,
      minOrder: couponForm.minOrder ? parseFloat(couponForm.minOrder) : undefined,
      maxUses: couponForm.maxUses ? parseInt(couponForm.maxUses) : undefined,
      usedCount: 0,
      validFrom: couponForm.validFrom,
      validTo: couponForm.validTo,
      active: true
    };

    setCoupons(prev => [newCoupon, ...prev]);
    setShowCouponDialog(false);
    setCouponForm({
      code: '',
      type: 'percentage',
      value: '',
      description: '',
      minOrder: '',
      maxUses: '',
      validFrom: '',
      validTo: ''
    });
  };

  const toggleCouponStatus = (couponId: string) => {
    setCoupons(prev => prev.map(coupon => 
      coupon.id === couponId 
        ? { ...coupon, active: !coupon.active }
        : coupon
    ));
  };

  const getCouponTypeLabel = (type: string) => {
    const types = {
      'percentage': 'Porcentaje',
      'fixed': 'Cantidad fija',
      'free_shipping': 'Envío gratis'
    };
    return types[type as keyof typeof types] || type;
  };

  const getCampaignStatusBadge = (status: string) => {
    const variants = {
      'draft': { variant: 'secondary' as const, label: 'Borrador' },
      'scheduled': { variant: 'outline' as const, label: 'Programado' },
      'sent': { variant: 'default' as const, label: 'Enviado' },
      'paused': { variant: 'destructive' as const, label: 'Pausado' },
      'active': { variant: 'default' as const, label: 'Activo' }
    };
    
    const statusInfo = variants[status as keyof typeof variants] || variants.draft;
    
    return (
      <Badge variant={statusInfo.variant}>
        {statusInfo.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl">Marketing & Crecimiento</h1>
          <p className="text-muted-foreground">
            Campañas, cupones, automatización y análisis de marketing
          </p>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROI Marketing</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2x</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+0.3x vs mes anterior</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suscriptores</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15,642</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+456 este mes</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.5%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2.1% vs promedio</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos por Email</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(36950)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12.3% este mes</span>
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="coupons" className="space-y-4">
        <TabsList>
          <TabsTrigger value="coupons">Cupones & Descuentos</TabsTrigger>
          <TabsTrigger value="campaigns">Campañas Email</TabsTrigger>
          <TabsTrigger value="automation">Automatización</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="coupons" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Cupones de Descuento</h2>
            <Dialog open={showCouponDialog} onOpenChange={setShowCouponDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Cupón
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Cupón</DialogTitle>
                  <DialogDescription>
                    Configura un nuevo cupón de descuento para tus clientes
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="couponCode">Código del cupón</Label>
                    <div className="flex gap-2">
                      <Input
                        id="couponCode"
                        value={couponForm.code}
                        onChange={(e) => setCouponForm(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                        placeholder="VERANO2024"
                      />
                      <Button variant="outline" onClick={generateCouponCode}>
                        <Zap className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="couponType">Tipo de descuento</Label>
                    <Select value={couponForm.type} onValueChange={(value) => setCouponForm(prev => ({ ...prev, type: value as any }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Porcentaje (%)</SelectItem>
                        <SelectItem value="fixed">Cantidad fija (€)</SelectItem>
                        <SelectItem value="free_shipping">Envío gratis</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {couponForm.type !== 'free_shipping' && (
                    <div className="space-y-2">
                      <Label htmlFor="couponValue">
                        Valor {couponForm.type === 'percentage' ? '(%)' : '(€)'}
                      </Label>
                      <Input
                        id="couponValue"
                        type="number"
                        value={couponForm.value}
                        onChange={(e) => setCouponForm(prev => ({ ...prev, value: e.target.value }))}
                        placeholder={couponForm.type === 'percentage' ? '20' : '10'}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="couponDesc">Descripción</Label>
                    <Input
                      id="couponDesc"
                      value={couponForm.description}
                      onChange={(e) => setCouponForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Descuento de verano"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="minOrder">Pedido mínimo (€)</Label>
                    <Input
                      id="minOrder"
                      type="number"
                      value={couponForm.minOrder}
                      onChange={(e) => setCouponForm(prev => ({ ...prev, minOrder: e.target.value }))}
                      placeholder="50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxUses">Usos máximos</Label>
                    <Input
                      id="maxUses"
                      type="number"
                      value={couponForm.maxUses}
                      onChange={(e) => setCouponForm(prev => ({ ...prev, maxUses: e.target.value }))}
                      placeholder="1000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="validFrom">Válido desde</Label>
                    <Input
                      id="validFrom"
                      type="date"
                      value={couponForm.validFrom}
                      onChange={(e) => setCouponForm(prev => ({ ...prev, validFrom: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="validTo">Válido hasta</Label>
                    <Input
                      id="validTo"
                      type="date"
                      value={couponForm.validTo}
                      onChange={(e) => setCouponForm(prev => ({ ...prev, validTo: e.target.value }))}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowCouponDialog(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={createCoupon}>
                    Crear Cupón
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Usos</TableHead>
                    <TableHead>Válido hasta</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coupons.map((coupon) => (
                    <TableRow key={coupon.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                            {coupon.code}
                          </code>
                          <Button variant="ghost" size="icon" onClick={() => navigator.clipboard.writeText(coupon.code)}>
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>{getCouponTypeLabel(coupon.type)}</TableCell>
                      <TableCell>
                        {coupon.type === 'percentage' && `${coupon.value}%`}
                        {coupon.type === 'fixed' && formatCurrency(coupon.value)}
                        {coupon.type === 'free_shipping' && 'Envío gratis'}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">
                            {coupon.usedCount} / {coupon.maxUses || '∞'}
                          </div>
                          {coupon.maxUses && (
                            <Progress 
                              value={(coupon.usedCount / coupon.maxUses) * 100} 
                              className="h-1"
                            />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(coupon.validTo).toLocaleDateString('es-ES')}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={coupon.active}
                          onCheckedChange={() => toggleCouponStatus(coupon.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Campañas de Email</h2>
            <Dialog open={showCampaignDialog} onOpenChange={setShowCampaignDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Campaña
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Crear Campaña de Email</DialogTitle>
                  <DialogDescription>
                    Diseña una nueva campaña de email marketing
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="campaignName">Nombre de la campaña</Label>
                      <Input
                        id="campaignName"
                        value={campaignForm.name}
                        onChange={(e) => setCampaignForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Newsletter Agosto 2024"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="campaignType">Tipo de campaña</Label>
                      <Select value={campaignForm.type} onValueChange={(value) => setCampaignForm(prev => ({ ...prev, type: value as any }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="newsletter">Newsletter</SelectItem>
                          <SelectItem value="promotion">Promocional</SelectItem>
                          <SelectItem value="abandoned_cart">Carrito abandonado</SelectItem>
                          <SelectItem value="welcome">Bienvenida</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="campaignSubject">Asunto del email</Label>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => generateAIContent('subject')}
                        disabled={aiGenerating}
                      >
                        <Brain className="h-3 w-3 mr-1" />
                        {aiGenerating ? 'Generando...' : 'IA'}
                      </Button>
                    </div>
                    <Input
                      id="campaignSubject"
                      value={campaignForm.subject}
                      onChange={(e) => setCampaignForm(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="¡Ofertas increíbles que no puedes perderte!"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="campaignContent">Contenido del email</Label>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => generateAIContent('content')}
                        disabled={aiGenerating}
                      >
                        <Brain className="h-3 w-3 mr-1" />
                        {aiGenerating ? 'Generando...' : 'IA'}
                      </Button>
                    </div>
                    <Textarea
                      id="campaignContent"
                      value={campaignForm.content}
                      onChange={(e) => setCampaignForm(prev => ({ ...prev, content: e.target.value }))}
                      rows={8}
                      placeholder="Escribe el contenido de tu email aquí..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="campaignSegment">Segmento de audiencia</Label>
                    <Select value={campaignForm.segment} onValueChange={(value) => setCampaignForm(prev => ({ ...prev, segment: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los suscriptores (15,642)</SelectItem>
                        <SelectItem value="vip">Clientes VIP (1,234)</SelectItem>
                        <SelectItem value="new">Nuevos clientes (3,456)</SelectItem>
                        <SelectItem value="inactive">Inactivos 90 días (2,890)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowCampaignDialog(false)}>
                    Guardar Borrador
                  </Button>
                  <Button>
                    <Send className="h-4 w-4 mr-2" />
                    Enviar Ahora
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{campaign.type}</Badge>
                    {getCampaignStatusBadge(campaign.status)}
                  </div>
                  <CardTitle className="text-base">{campaign.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {campaign.subject}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Destinatarios:</span>
                      <span className="font-medium">{campaign.recipients.toLocaleString()}</span>
                    </div>
                    
                    {campaign.status === 'sent' && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span>Tasa apertura:</span>
                          <span className="font-medium text-green-600">{campaign.openRate}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Tasa clicks:</span>
                          <span className="font-medium text-blue-600">{campaign.clickRate}%</span>
                        </div>
                      </>
                    )}

                    {campaign.scheduledDate && (
                      <div className="flex justify-between text-sm">
                        <span>Programado:</span>
                        <span className="font-medium">
                          {new Date(campaign.scheduledDate).toLocaleDateString('es-ES')}
                        </span>
                      </div>
                    )}

                    <div className="flex gap-1 pt-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-3 w-3 mr-1" />
                        Vista previa
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-3 w-3 mr-1" />
                        Editar
                      </Button>
                      {campaign.status === 'active' && (
                        <Button variant="outline" size="sm">
                          <Pause className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="automation" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Flujos de Automatización</h2>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Flujo
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {automations.map((automation) => (
              <Card key={automation.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant={automation.status === 'active' ? 'default' : 'secondary'}>
                      {automation.status === 'active' ? 'Activo' : 'Pausado'}
                    </Badge>
                    <Switch
                      checked={automation.status === 'active'}
                      onCheckedChange={() => {
                        setAutomations(prev => prev.map(a => 
                          a.id === automation.id 
                            ? { ...a, status: a.status === 'active' ? 'paused' : 'active' }
                            : a
                        ));
                      }}
                    />
                  </div>
                  <CardTitle className="text-base">{automation.name}</CardTitle>
                  <CardDescription>
                    Trigger: {automation.trigger.replace('_', ' ')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-lg font-bold">{automation.triggers}</p>
                        <p className="text-xs text-muted-foreground">Activaciones</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-green-600">{automation.conversions}</p>
                        <p className="text-xs text-muted-foreground">Conversiones</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-blue-600">
                          {Math.round((automation.conversions / automation.triggers) * 100)}%
                        </p>
                        <p className="text-xs text-muted-foreground">Tasa</p>
                      </div>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span>Ingresos generados:</span>
                      <span className="font-medium">{formatCurrency(automation.revenue)}</span>
                    </div>

                    <div className="flex gap-1 pt-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-3 w-3 mr-1" />
                        Ver flujo
                      </Button>
                      <Button variant="outline" size="sm">
                        <BarChart3 className="h-3 w-3 mr-1" />
                        Métricas
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Rendimiento de Campañas</CardTitle>
                <CardDescription>
                  Métricas clave de tus campañas de email
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">24.5%</p>
                      <p className="text-sm text-muted-foreground">Tasa de apertura</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">3.2%</p>
                      <p className="text-sm text-muted-foreground">Tasa de clicks</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Emails entregados</span>
                      <span className="font-medium">98.5%</span>
                    </div>
                    <Progress value={98.5} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Tasa de cancelación</span>
                      <span className="font-medium">0.8%</span>
                    </div>
                    <Progress value={0.8} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ingresos por Canal</CardTitle>
                <CardDescription>
                  Distribución de ingresos por canal de marketing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Email Marketing</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-muted rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                      <span className="text-sm font-medium">45%</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Redes Sociales</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-muted rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '30%' }}></div>
                      </div>
                      <span className="text-sm font-medium">30%</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Búsqueda Orgánica</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-muted rounded-full h-2">
                        <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '15%' }}></div>
                      </div>
                      <span className="text-sm font-medium">15%</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Publicidad Pagada</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-muted rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: '10%' }}></div>
                      </div>
                      <span className="text-sm font-medium">10%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}